// Cloudflare Worker: serves the static site from ./public and one small API for cloud save in D1.
//   GET  /api/progress   → { data, updatedAt }   the saved progress (data is null before the first save)
//   PUT  /api/progress   ← { data, updatedAt }   replaces it, and keeps a snapshot of the day
//   POST /api/login      ← { name }               → { role, token } when the name is Volodymyr's or Dima's
// Every progress request needs "Authorization: Bearer <key>": the SYNC_KEY secret itself, or a token from /api/login.
// Tokens are an HMAC of the role with SYNC_KEY, so they never need storing. Each profile has its own saved progress:
// Volodymyr's (student) is row "main", Dima's (teacher) is row "dima". Dima may also read his: GET ?who=student.
// Nobody can write anyone else's. SYNC_KEY is a Worker secret, never in this repository.
//   GET    /api/content          → { edits, audio, suggestions, history }  corrections, which words she has recorded,
//                                  her suggestions waiting, and the last ones decided
//   PUT    /api/edits/<id>       ← { ar?, say?, en?, uk?, najdi?, msa?, checked?, before? }  a correction to a word, a line
//                                  or any text on the site ("s.<string key>", "x.<hash>"). Volodymyr's goes live at once;
//                                  Dima's becomes a suggestion that waits for him.
//   DELETE /api/edits/<id>       back to the original (Volodymyr)
//   POST   /api/suggestions/<n>  ← { action: "approve" | "reject" }  (Volodymyr) · DELETE: Dima withdraws her own
//   GET    /api/audio/<key>      → her recording        PUT (raw audio, Dima only) · DELETE (Dima only)
//                                  The version before the last change is kept: GET ?v=prev hears it, and
//                                  POST ← { action: "restore" } swaps it back (Undo — works again to redo).
// Everything else is served straight from the assets.

const MAX_BYTES = 1_000_000; // a year of study logs is well under 100 KB

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

// Constant-time comparison, so the key can't be guessed from response timing.
async function sameSecret(given, expected) {
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([given, expected].map(s => crypto.subtle.digest("SHA-256", enc.encode(s))));
  return crypto.subtle.timingSafeEqual(a, b);
}

// The names that sign in, in English, Ukrainian and Arabic (compared without case, spaces or vowel marks).
const NAMES = {
  student: ["volodymyr", "volodimir", "volodia", "volodya", "володимир", "володя", "فولوديمير"],
  teacher: ["dima", "deema", "dema", "діма", "дима", "ديما", "ديمه", "ديمة"],
};
const normal = s => String(s).normalize("NFC").toLowerCase().replace(/[\u064B-\u0652\u0640]/g, "").replace(/[^\p{L}]/gu, "");
const roleFor = name => Object.keys(NAMES).find(r => NAMES[r].includes(normal(name)));

async function tokenFor(role, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(`najdi-profile:${role}`)));
  return `${role}.${[...sig].map(b => b.toString(16).padStart(2, "0")).join("")}`;
}

// Which role a request's key belongs to, or null.
async function roleOf(request, env) {
  const auth = request.headers.get("authorization") ?? "";
  if (await sameSecret(auth, `Bearer ${env.SYNC_KEY}`)) return "student";
  for (const role of Object.keys(NAMES)) if (await sameSecret(auth, `Bearer ${await tokenFor(role, env.SYNC_KEY)}`)) return role;
  return null;
}

async function login(request, env) {
  if (!env.SYNC_KEY) return json({ error: "not-configured" }, 503);
  if (request.method !== "POST") return json({ error: "method-not-allowed" }, 405);
  let name = "";
  try {
    name = (await request.json())?.name ?? "";
  } catch {}
  const role = roleFor(name);
  if (!role) return json({ error: "unknown-name" }, 401);
  return json({ role, token: await tokenFor(role, env.SYNC_KEY) });
}

let tablesReady = false;
async function ensureTables(db) {
  if (tablesReady) return;
  await db.batch([
    db.prepare("CREATE TABLE IF NOT EXISTS progress (id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at INTEGER NOT NULL)"),
    db.prepare("CREATE TABLE IF NOT EXISTS snapshots (day TEXT PRIMARY KEY, data TEXT NOT NULL, saved_at INTEGER NOT NULL)"),
    db.prepare("CREATE TABLE IF NOT EXISTS edits (id TEXT PRIMARY KEY, data TEXT NOT NULL, by TEXT NOT NULL, updated_at INTEGER NOT NULL)"),
    db.prepare("CREATE TABLE IF NOT EXISTS audio (key TEXT PRIMARY KEY, type TEXT NOT NULL, data BLOB NOT NULL, updated_at INTEGER NOT NULL)"),
    db.prepare("CREATE TABLE IF NOT EXISTS audio_prev (key TEXT PRIMARY KEY, type TEXT NOT NULL, data BLOB NOT NULL, updated_at INTEGER NOT NULL)"),
    db.prepare("CREATE TABLE IF NOT EXISTS suggestions (sid INTEGER PRIMARY KEY AUTOINCREMENT, target TEXT NOT NULL, data TEXT NOT NULL, before TEXT, by TEXT NOT NULL, created INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'pending')"),
  ]);
  tablesReady = true;
}

async function progress(request, env) {
  if (!env.DB || !env.SYNC_KEY) return json({ error: "not-configured" }, 503);
  const role = await roleOf(request, env);
  if (!role) return json({ error: "wrong-key" }, 401);
  await ensureTables(env.DB);
  const ROW = { student: "main", teacher: "dima" };
  const own = ROW[role];

  if (request.method === "GET") {
    const who = new URL(request.url).searchParams.get("who");
    const id = who === "student" ? ROW.student : own; // Dima can look at his progress; he has no reason to read hers
    const row = await env.DB.prepare("SELECT data, updated_at FROM progress WHERE id = ?1").bind(id).first();
    return json(row ? { data: JSON.parse(row.data), updatedAt: row.updated_at } : { data: null, updatedAt: 0 });
  }

  if (request.method === "PUT") {
    const text = await request.text();
    if (text.length > MAX_BYTES) return json({ error: "too-large" }, 413);
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      return json({ error: "bad-json" }, 400);
    }
    const { data, updatedAt } = body ?? {};
    if (!data || typeof data !== "object" || typeof data.log !== "object" || !Number.isFinite(updatedAt)) {
      return json({ error: "bad-shape" }, 400);
    }
    const serialized = JSON.stringify(data);
    const today = new Date().toISOString().slice(0, 10);
    const day = own === "main" ? today : `${own}:${today}`; // his snapshots keep their old keys
    await env.DB.batch([
      env.DB.prepare("INSERT INTO progress (id, data, updated_at) VALUES (?3, ?1, ?2) ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at")
        .bind(serialized, updatedAt, own),
      env.DB.prepare("INSERT INTO snapshots (day, data, saved_at) VALUES (?1, ?2, ?3) ON CONFLICT(day) DO UPDATE SET data = excluded.data, saved_at = excluded.saved_at")
        .bind(day, serialized, Date.now()),
    ]);
    return json({ ok: true, updatedAt });
  }

  return json({ error: "method-not-allowed" }, 405);
}

const MAX_AUDIO = 600_000; // a few seconds of speech is ~30 KB
const ID = /^[a-zA-Z0-9._:-]{1,80}$/;
const FIELDS = ["ar", "say", "en", "uk", "najdi", "msa"];
const clean = body => {
  const data = {};
  for (const f of FIELDS) if (typeof body?.[f] === "string" && body[f].trim()) data[f] = body[f].trim().slice(0, 2000);
  if (typeof body?.checked === "boolean") data.checked = body.checked;
  return data;
};

// Dima's corrections and recordings: shared by both profiles, so his site shows her versions.
async function content(request, env, url) {
  if (!env.DB || !env.SYNC_KEY) return json({ error: "not-configured" }, 503);
  const role = await roleOf(request, env);
  if (!role) return json({ error: "wrong-key" }, 401);
  await ensureTables(env.DB);
  const [, kind, id] = url.pathname.match(/^\/api\/(content|edits|audio|suggestions)\/?([^/]*)$/) ?? [];
  const m = request.method;

  if (kind === "content" && m === "GET") {
    const [edits, audio, sugg, done] = await Promise.all([
      env.DB.prepare("SELECT id, data, by, updated_at FROM edits").all(),
      env.DB.prepare("SELECT key, updated_at FROM audio").all(),
      env.DB.prepare("SELECT sid, target, data, before, by, created, status FROM suggestions WHERE status = 'pending' ORDER BY sid").all(),
      env.DB.prepare("SELECT sid, target, data, before, by, created, status FROM suggestions WHERE status IN ('approved', 'rejected') ORDER BY sid DESC LIMIT 40").all(),
    ]);
    const suggestion = r => ({ sid: r.sid, target: r.target, data: JSON.parse(r.data), before: r.before ? JSON.parse(r.before) : null, by: r.by, at: r.created, status: r.status });
    return json({
      edits: Object.fromEntries(edits.results.map(r => [r.id, { ...JSON.parse(r.data), by: r.by, at: r.updated_at }])),
      audio: Object.fromEntries(audio.results.map(r => [r.key, r.updated_at])),
      suggestions: sugg.results.map(suggestion),
      history: done.results.map(suggestion), // the last decisions, newest first
    });
  }
  if (!kind || kind === "content" || !ID.test(id)) return json({ error: "not-found" }, 404);

  if (kind === "suggestions") {
    const row = await env.DB.prepare("SELECT sid, target, data, by, status FROM suggestions WHERE sid = ?1").bind(+id).first();
    if (!row || row.status !== "pending") return json({ error: "not-found" }, 404);
    if (m === "DELETE") {
      if (role !== "teacher") return json({ error: "forbidden" }, 403);
      await env.DB.prepare("UPDATE suggestions SET status = 'withdrawn' WHERE sid = ?1").bind(row.sid).run();
      return json({ ok: true });
    }
    if (m !== "POST") return json({ error: "method-not-allowed" }, 405);
    if (role !== "student") return json({ error: "only-volodymyr-approves" }, 403);
    let body = {};
    try {
      body = await request.json();
    } catch {}
    if (body.action === "approve") {
      const live = await env.DB.prepare("SELECT data FROM edits WHERE id = ?1").bind(row.target).first();
      const merged = { ...(live ? JSON.parse(live.data) : {}), ...JSON.parse(row.data) };
      await env.DB.batch([
        env.DB.prepare("INSERT INTO edits (id, data, by, updated_at) VALUES (?1, ?2, ?3, ?4) ON CONFLICT(id) DO UPDATE SET data = excluded.data, by = excluded.by, updated_at = excluded.updated_at")
          .bind(row.target, JSON.stringify(merged), row.by, Date.now()),
        env.DB.prepare("UPDATE suggestions SET status = 'approved' WHERE sid = ?1").bind(row.sid),
      ]);
      return json({ ok: true, data: merged });
    }
    if (body.action === "reject") {
      await env.DB.prepare("UPDATE suggestions SET status = 'rejected' WHERE sid = ?1").bind(row.sid).run();
      return json({ ok: true });
    }
    return json({ error: "bad-action" }, 400);
  }

  if (kind === "edits") {
    if (m === "DELETE") {
      if (role !== "student") return json({ error: "forbidden" }, 403);
      await env.DB.prepare("DELETE FROM edits WHERE id = ?1").bind(id).run();
      return json({ ok: true });
    }
    if (m !== "PUT") return json({ error: "method-not-allowed" }, 405);
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "bad-json" }, 400);
    }
    const data = clean(body);
    if (role === "teacher") {
      // Dima suggests; Volodymyr decides. One open suggestion per target: a new one replaces her older one.
      const before = body?.before && typeof body.before === "object" ? JSON.stringify(clean(body.before)) : null;
      await env.DB.prepare("UPDATE suggestions SET status = 'replaced' WHERE target = ?1 AND status = 'pending'").bind(id).run();
      const res = await env.DB.prepare("INSERT INTO suggestions (target, data, before, by, created) VALUES (?1, ?2, ?3, 'teacher', ?4)")
        .bind(id, JSON.stringify(data), before, Date.now()).run();
      return json({ ok: true, pending: true, sid: res.meta?.last_row_id ?? null, data });
    }
    await env.DB.prepare("INSERT INTO edits (id, data, by, updated_at) VALUES (?1, ?2, ?3, ?4) ON CONFLICT(id) DO UPDATE SET data = excluded.data, by = excluded.by, updated_at = excluded.updated_at")
      .bind(id, JSON.stringify(data), role, Date.now()).run();
    return json({ ok: true, data });
  }

  // audio
  if (m === "GET") {
    const table = url.searchParams.get("v") === "prev" ? "audio_prev" : "audio";
    const row = await env.DB.prepare(`SELECT type, data FROM ${table} WHERE key = ?1`).bind(id).first();
    if (!row) return table === "audio_prev" ? new Response(null, { status: 204 }) : json({ error: "not-found" }, 404); // 204: no earlier version
    // The page asks for ?v=<time recorded>, so each version has its own address and can be cached for good.
    const cache = table === "audio" && url.searchParams.has("v") ? "private, max-age=31536000, immutable" : "no-store";
    return new Response(row.data, { headers: { "content-type": row.type, "cache-control": cache } });
  }
  if (role !== "teacher") return json({ error: "only-dima-records" }, 403); // the voice to learn from is hers
  // Before any change, what is there now becomes the previous version (or "none", so Undo can remove a first recording).
  const keepPrev = () => [
    env.DB.prepare("DELETE FROM audio_prev WHERE key = ?1").bind(id),
    env.DB.prepare("INSERT INTO audio_prev (key, type, data, updated_at) SELECT key, type, data, updated_at FROM audio WHERE key = ?1").bind(id),
  ];
  if (m === "DELETE") {
    await env.DB.batch([...keepPrev(), env.DB.prepare("DELETE FROM audio WHERE key = ?1").bind(id)]);
    return json({ ok: true });
  }
  if (m === "POST") {
    let body = {};
    try {
      body = await request.json();
    } catch {}
    if (body.action !== "restore") return json({ error: "bad-action" }, 400);
    const [cur, prev] = await Promise.all(["audio", "audio_prev"].map(tb => env.DB.prepare(`SELECT type, data, updated_at FROM ${tb} WHERE key = ?1`).bind(id).first()));
    if (!cur && !prev) return json({ error: "not-found" }, 404);
    const at = prev ? Date.now() : null;
    await env.DB.batch([
      env.DB.prepare("DELETE FROM audio WHERE key = ?1").bind(id),
      env.DB.prepare("DELETE FROM audio_prev WHERE key = ?1").bind(id),
      ...(prev ? [env.DB.prepare("INSERT INTO audio (key, type, data, updated_at) VALUES (?1, ?2, ?3, ?4)").bind(id, prev.type, prev.data, at)] : []),
      ...(cur ? [env.DB.prepare("INSERT INTO audio_prev (key, type, data, updated_at) VALUES (?1, ?2, ?3, ?4)").bind(id, cur.type, cur.data, cur.updated_at)] : []),
    ]);
    return json({ ok: true, at });
  }
  if (m !== "PUT") return json({ error: "method-not-allowed" }, 405);
  const type = (request.headers.get("content-type") ?? "").split(";")[0];
  if (!/^audio\/[\w.+-]+$/.test(type)) return json({ error: "not-audio" }, 415);
  const buf = await request.arrayBuffer();
  if (!buf.byteLength || buf.byteLength > MAX_AUDIO) return json({ error: "too-large" }, 413);
  const at = Date.now();
  await env.DB.batch([
    ...keepPrev(),
    env.DB.prepare("INSERT INTO audio (key, type, data, updated_at) VALUES (?1, ?2, ?3, ?4) ON CONFLICT(key) DO UPDATE SET type = excluded.type, data = excluded.data, updated_at = excluded.updated_at")
      .bind(id, type, buf, at),
  ]);
  return json({ ok: true, at });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/progress") return progress(request, env);
    if (url.pathname === "/api/login") return login(request, env);
    if (/^\/api\/(content|edits|audio|suggestions)(\/|$)/.test(url.pathname)) return content(request, env, url);
    return env.ASSETS.fetch(request);
  },
};
