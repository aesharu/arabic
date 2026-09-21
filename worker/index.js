// Cloudflare Worker: serves the static site from ./public and one small API for cloud save in D1.
//   GET  /api/progress   → { data, updatedAt }   the saved progress (data is null before the first save)
//   PUT  /api/progress   ← { data, updatedAt }   replaces it, and keeps a snapshot of the day
// Every API request needs the header "Authorization: Bearer <SYNC_KEY>". SYNC_KEY is a Worker secret set in the
// Cloudflare dashboard — it is never in this repository. Everything else is served straight from the assets.

const MAX_BYTES = 1_000_000; // a year of study logs is well under 100 KB

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

// Constant-time comparison, so the key can't be guessed from response timing.
async function sameSecret(given, expected) {
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([given, expected].map(s => crypto.subtle.digest("SHA-256", enc.encode(s))));
  return crypto.subtle.timingSafeEqual(a, b);
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
  const auth = request.headers.get("authorization") ?? "";
  if (!(await sameSecret(auth, `Bearer ${env.SYNC_KEY}`))) return json({ error: "wrong-key" }, 401);
  await ensureTables(env.DB);

  if (request.method === "GET") {
    const row = await env.DB.prepare("SELECT data, updated_at FROM progress WHERE id = 'main'").first();
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
    const day = new Date().toISOString().slice(0, 10);
    await env.DB.batch([
      env.DB.prepare("INSERT INTO progress (id, data, updated_at) VALUES ('main', ?1, ?2) ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at")
        .bind(serialized, updatedAt),
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
    return env.ASSETS.fetch(request);
  },
};
