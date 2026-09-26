// Keeping what he has learned in his own database, so the phone and the computer are the same deck.
//
// Everything the app knows about his progress — when each card is due, his stars and notes, the day's
// counters and the review log the charts are drawn from — goes up as one gzipped blob and comes back
// the same way. It is small: a year of reviews is a few hundred kilobytes before gzip.
//
// Two devices are merged rather than one overwriting the other:
//   · a card is taken from whichever side reviewed it last;
//   · a review is kept if either side has it (they are matched by card and time);
//   · the day's counters take the higher of the two for today;
//   · the settings stay the ones on this device, because they are how he likes to study here.
//
// Merging only ever adds, so a **reset** needs saying out loud: "Start over" and restoring a backup
// both stamp meta.resetAt, and a device that sees a newer stamp than its own throws its own cards and
// reviews away and takes what came down. And because a device that has not caught up could otherwise
// undo a reset made on the other one, every save tells the server which version it started from; the
// server refuses (409) if it has moved on, and then this device looks first and saves again.
import * as store from "./store.js";
import * as D from "./deck.js";
import { S } from "./deck.js";
import * as cloud from "./cloud.js";

const REVLOG_KEEP = 30_000; // about four years of studying; older reviews stay on the device that made them

const gzip = async text => {
  const raw = new TextEncoder().encode(text);
  if (typeof CompressionStream !== "function") return raw;
  const stream = new Blob([raw]).stream().pipeThrough(new CompressionStream("gzip"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
};
const gunzip = async buf => {
  const bytes = new Uint8Array(buf);
  const zipped = bytes[0] === 0x1f && bytes[1] === 0x8b;
  if (!zipped) return new TextDecoder().decode(bytes);
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
  return new Response(stream).text();
};

async function snapshot() {
  const [cards, user, revlog, day, resetAt] = await Promise.all([
    store.entries("cards"), store.entries("user"), store.all("revlog"), store.get("meta", "day"),
    store.get("meta", "resetAt"),
  ]);
  return {
    v: 1, at: Date.now(), resetAt: resetAt ?? 0,
    cards: [...cards.entries()],
    user: [...user.entries()],
    revlog: revlog.slice(-REVLOG_KEEP),
    day: day ?? null,
    settings: S.settings,
  };
}

/** True when anything on this device changed because of what came back. */
async function merge(remote) {
  const mineResetAt = (await store.get("meta", "resetAt")) ?? 0;
  const theirResetAt = remote.resetAt ?? 0;

  // The other device started over (or restored a backup) after this one last did: take that, whole.
  if (theirResetAt > mineResetAt) {
    await store.clear("cards", "revlog");
    if (remote.cards?.length) await store.putMany("cards", remote.cards);
    for (const r of remote.revlog ?? []) await store.add("revlog", r);
    await store.set("meta", "resetAt", theirResetAt);
    if (remote.day) await store.set("meta", "day", remote.day);
    return true;
  }
  // This device started over more recently: what is up there is from before, so none of it comes back.
  if (mineResetAt > theirResetAt) return false;

  const [cards, user, revlog] = await Promise.all([store.entries("cards"), store.entries("user"), store.all("revlog")]);
  let changed = false;

  const newer = (a, b) => (a?.last ?? 0) >= (b?.last ?? 0) ? a : b;
  const cardPuts = [];
  for (const [id, theirs] of remote.cards ?? []) {
    const mine = cards.get(id);
    const win = mine ? newer(mine, theirs) : theirs;
    if (win !== mine) { cardPuts.push([id, win]); cards.set(id, win); changed = true; }
  }
  if (cardPuts.length) await store.putMany("cards", cardPuts);

  const userPuts = [];
  for (const [guid, theirs] of remote.user ?? []) {
    const mine = user.get(guid);
    if (!mine) { userPuts.push([guid, theirs]); changed = true; }
    else if (JSON.stringify(mine) !== JSON.stringify(theirs)) {
      // stars and notes both matter and neither is timestamped: keep a star from either side, and the
      // note that actually says something.
      const both = { ...theirs, ...mine, star: mine.star || theirs.star, note: mine.note || theirs.note };
      if (JSON.stringify(both) !== JSON.stringify(mine)) { userPuts.push([guid, both]); changed = true; }
    }
  }
  if (userPuts.length) await store.putMany("user", userPuts);

  const seen = new Set(revlog.map(r => `${r.cid}|${r.t}`));
  const missing = (remote.revlog ?? []).filter(r => !seen.has(`${r.cid}|${r.t}`));
  for (const r of missing) await store.add("revlog", r);
  if (missing.length) changed = true;

  const theirDay = remote.day;
  if (theirDay && S.day && theirDay.key === S.day.key && theirDay.done > S.day.done) {
    S.day = { ...theirDay, done: Math.max(theirDay.done, S.day.done) };
    await store.set("meta", "day", S.day);
    changed = true;
  }
  return changed;
}

/** Pull what the database has and fold it in. Returns true if this device learned something new. */
let baseAt = 0; // the version of his progress this device last saw, so a save can't overwrite a newer one
export async function pull() {
  if (!cloud.signedIn()) return false;
  const r = await fetch("/api/najdi/progress", { headers: { authorization: `Bearer ${cloud.token()}` } });
  if (r.status === 204) { baseAt = 0; return false; }
  if (!r.ok) throw new Error(`progress ${r.status}`);
  baseAt = Number(r.headers.get("x-updated-at") ?? 0);
  const remote = JSON.parse(await gunzip(await r.arrayBuffer()));
  const changed = await merge(remote);
  if (changed) await D.load();
  return changed;
}

export let lastSaved = 0; // when the database last took a copy, for the line in Settings
let pushing = null, again = false;
export async function push() {
  if (!cloud.signedIn()) return false;
  if (pushing) { again = true; return pushing; }
  pushing = (async () => {
    try {
      for (let attempt = 0; attempt < 2; attempt++) {
        const body = await gzip(JSON.stringify(await snapshot()));
        const r = await fetch("/api/najdi/progress", {
          method: "PUT",
          headers: { authorization: `Bearer ${cloud.token()}`, "content-type": "application/octet-stream",
                     "x-base-at": String(baseAt) },
          body,
        });
        if (r.status === 409) {
          // The other device saved since this one last looked: fold that in and try once more.
          await pull().catch(() => {});
          continue;
        }
        if (!r.ok) return false;
        baseAt = Number((await r.json().catch(() => ({}))).at ?? Date.now());
        lastSaved = Date.now();
        store.set("meta", "syncedAt", lastSaved).catch(() => {});
        return true;
      }
      return false;
    } catch { return false; } finally {
      pushing = null;
      if (again) { again = false; push(); }
    }
  })();
  return pushing;
}

// Saving happens on its own: a few seconds after the last answer, and whenever the page is left —
// closing the tab, locking the phone, switching app. sendBeacon can't carry the key, so the last save
// is a normal request made while the page is still hiding, which iOS does allow.
let timer = null;
export function saveSoon(ms = 4000) {
  clearTimeout(timer);
  timer = setTimeout(push, ms);
}
store.get("meta", "syncedAt").then(at => { if (at && !lastSaved) lastSaved = at; }).catch(() => {});

export function start() {
  document.addEventListener("visibilitychange", () => { if (document.hidden) { clearTimeout(timer); push(); } });
  window.addEventListener("pagehide", () => { clearTimeout(timer); push(); });
}
