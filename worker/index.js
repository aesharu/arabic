// Cloudflare Worker: serves the static site from ./public and one small API for cloud save in D1.
//   GET  /api/progress   → { data, updatedAt }   the saved progress (data is null before the first save)
//   PUT  /api/progress   ← { data, updatedAt }   replaces it, and keeps a snapshot of the day
//   POST /api/login      ← { name }               → { role, token } when the name is Volodymyr's or Dima's
// Every progress request needs "Authorization: Bearer <key>": the SYNC_KEY secret itself, or a token from /api/login.
// Tokens are an HMAC of the role with SYNC_KEY, so they never need storing. Each profile has its own saved progress:
// Volodymyr's (student) is row "main", Dima's (teacher) is row "dima". Dima may also read his: GET ?who=student.
// Nobody can write anyone else's. SYNC_KEY is a Worker secret, never in this repository.
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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/progress") return progress(request, env);
    if (url.pathname === "/api/login") return login(request, env);
    return env.ASSETS.fetch(request);
  },
};
