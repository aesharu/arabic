// Where the deck comes from on this site.
//
// The deck he bought isn't his to publish, so it isn't in the site's files: it sits in his own database
// and comes back only for his own profile. This page is on the same domain as the site, so it reads the
// sign-in the site already made — the profile and its token — and asks /api/najdi with it.
//
// Nothing else changes: once a word's recording has been fetched once it is kept in this browser
// (store.js, the "media" store), so it plays from the phone afterwards and works with no signal.
import * as store from "./store.js";

const PROFILE = "najdi-profile";   // the site's localStorage: "student" | "teacher"
const LOGINS = "najdi-logins";     // the site's localStorage: { student?: token, teacher?: token }

const read = (key, fallback = null) => {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
};

/** "student" when it is his own profile on this device — the deck is his and only he may read it. */
export const profile = () => (read(PROFILE) === "teacher" ? "teacher" : "student");

export function token() {
  try {
    const t = JSON.parse(read(LOGINS, "{}") || "{}")[profile()];
    return t && t !== "local" ? t : "";
  } catch { return ""; }
}

export const signedIn = () => profile() === "student" && !!token();

const api = (path, init = {}) => fetch(`/api/najdi${path}`, {
  ...init, headers: { authorization: `Bearer ${token()}`, ...init.headers },
});

/** What the database holds: how many notes and recordings are in there. */
export async function status() {
  const r = await api("/status");
  if (!r.ok) throw new Error(r.status === 403 ? "not-yours" : r.status === 401 ? "signed-out" : `status ${r.status}`);
  return r.json();
}

/** Every note in the deck, ready to be stored. */
export async function deck() {
  const r = await api("/deck");
  if (!r.ok) throw new Error(r.status === 404 ? "no-deck" : r.status === 403 ? "not-yours" : r.status === 401 ? "signed-out" : `deck ${r.status}`);
  return r.json();
}

// One recording. It is asked for once and then lives in this browser; two cards wanting the same file
// at the same moment share one request.
const waiting = new Map();
export function media(name) {
  if (!waiting.has(name)) {
    waiting.set(name, (async () => {
      const r = await api(`/media/${encodeURIComponent(name)}`);
      if (!r.ok) throw new Error(`media ${name}: ${r.status}`);
      const blob = await r.blob();
      await store.set("media", name, blob).catch(() => {});
      return blob;
    })().finally(() => setTimeout(() => waiting.delete(name), 0)));
  }
  return waiting.get(name);
}
