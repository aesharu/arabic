// Dima's corrections and recordings, from the cloud (worker /api/content, /api/edits, /api/audio).
// Corrections are laid over the words from the plan at runtime — NAJDI-PLAN.md itself never changes here.
// Recordings are found by their Arabic text, so a word she records plays wherever that word appears.
import * as store from "./store.js";
import { play } from "./audiotools.js";

// The Arabic goes with a recording's address so the Stats page can name the word, not just its key.
const withText = (k, text) => `api/audio/${k}?text=${encodeURIComponent(String(text).slice(0, 300))}`;

let edits = {};
let audio = {}; // key → time recorded
let suggestions = []; // Dima's changes waiting for Volodymyr: { sid, target, data, before, at }
let history = []; // the last ones he decided: the same, with status "approved" or "rejected"
let loaded = null;
const listeners = new Set();
export const onChange = fn => (listeners.add(fn), () => listeners.delete(fn));
const changed = () => listeners.forEach(l => l());

const key = () => store.own().sync?.key ?? "";
const auth = () => ({ authorization: `Bearer ${key()}` });
export const signedIn = () => Boolean(key());

// The same word with or without vowel marks, tatweel or punctuation gets the same recording.
export function audioKey(text) {
  const bare = String(text).normalize("NFC").replace(/[ً-ٰٟـ]/g, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  let h = 0x811c9dc5;
  for (const ch of bare) h = Math.imul(h ^ ch.codePointAt(0), 0x01000193) >>> 0;
  return h.toString(36);
}

export function load() {
  if (!key()) return Promise.resolve();
  loaded ??= fetch("api/content", { headers: auth(), cache: "no-store" })
    .then(r => (r.ok ? r.json() : { edits: {}, audio: {} }))
    .then(d => {
      edits = d.edits ?? {};
      audio = d.audio ?? {};
      suggestions = d.suggestions ?? [];
      history = d.history ?? [];
      changed();
    })
    .catch(() => {})
    .finally(() => setTimeout(() => (loaded = null), 60_000)); // look again after a minute
  return loaded;
}

// ---------- Corrections ----------
// Lines that aren't in the word list (the weekly conversations) register here so ✎ can find them.
const extra = new Map();
export const register = list => list.forEach(e => extra.set(e.id, e));
export const registered = id => extra.get(id);
// What a target shows: the approved edit, and — in Dima's profile — her own suggestion on top, so she sees it.
function effective(id) {
  const mine = store.isTeacher() ? suggestions.find(x => x.target === id) : null;
  return mine ? { ...edits[id], ...mine.data } : edits[id];
}
export const editOf = id => effective(id);
export const pending = () => suggestions;
export const decided = () => history;
export const pendingFor = id => suggestions.find(x => x.target === id);
// A text anywhere on the site, if it has been changed: "s.<string key>" or "x.<hash>" (see core/i18n.js).
export const textOf = (id, l) => effective(id)?.[l];
export const FIELDS = ["ar", "say", "en", "uk", "msa"];

// Lay the corrections over a word (keeps the plan's version in .orig).
export function apply(entry) {
  const e = effective(entry.id);
  if (!e && !entry.orig) return entry;
  entry.orig ??= Object.fromEntries(FIELDS.map(f => [f, entry[f]]).concat([["check", entry.check]]));
  for (const f of FIELDS) entry[f] = e?.[f] ?? entry.orig[f];
  entry.check = e?.checked ? false : entry.orig.check;
  entry.edited = Boolean(e);
  return entry;
}

// Volodymyr's changes go live; Dima's become a suggestion (the server decides by who is signed in).
export async function saveEdit(id, data, before = null) {
  const r = await fetch(`api/edits/${encodeURIComponent(id)}`, { method: "PUT", headers: { ...auth(), "content-type": "application/json" }, body: JSON.stringify({ ...data, before }) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const res = await r.json();
  if (res.pending) suggestions = [...suggestions.filter(x => x.target !== id), { sid: res.sid, target: id, data: res.data, before, at: Date.now() }];
  else edits[id] = { ...res.data, by: store.profile(), at: Date.now() };
  changed();
  return res;
}

export async function decide(sid, action) {
  const r = await fetch(`api/suggestions/${sid}`, { method: "POST", headers: { ...auth(), "content-type": "application/json" }, body: JSON.stringify({ action }) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const res = await r.json();
  const s = suggestions.find(x => x.sid === sid);
  suggestions = suggestions.filter(x => x.sid !== sid);
  if (s) history = [{ ...s, status: action === "approve" ? "approved" : "rejected" }, ...history];
  if (action === "approve" && s) edits[s.target] = { ...res.data, by: "teacher", at: Date.now() };
  changed();
}

export async function withdraw(sid) {
  const r = await fetch(`api/suggestions/${sid}`, { method: "DELETE", headers: auth() });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  suggestions = suggestions.filter(x => x.sid !== sid);
  changed();
}

export async function revertEdit(id) {
  const r = await fetch(`api/edits/${encodeURIComponent(id)}`, { method: "DELETE", headers: auth() });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  delete edits[id];
  changed();
}

// ---------- Recordings ----------
export const hasAudio = text => Boolean(audio[audioKey(text)]);
export const recordedCount = texts => texts.filter(hasAudio).length;
const urls = new Map();

// Each version has its own address (?v=<time recorded>), so a new recording never plays the old one from the cache.
async function urlFor(text) {
  const k = audioKey(text);
  const tag = `${k}.${audio[k]}`;
  if (!urls.has(tag)) {
    const r = await fetch(`api/audio/${k}?v=${audio[k]}`, { headers: auth() });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    urls.set(tag, URL.createObjectURL(await r.blob()));
  }
  return urls.get(tag);
}

export const playRecording = async (text, rate = 1) => play(await urlFor(text), rate);

// The version before the last change (for "bring it back"): an object URL, or null when there was none.
export async function previousUrl(text) {
  const r = await fetch(`api/audio/${audioKey(text)}?v=prev`, { headers: auth(), cache: "no-store" });
  return r.status === 200 ? URL.createObjectURL(await r.blob()) : null; // 204: there was none
}

export async function upload(text, blob) {
  const k = audioKey(text);
  const r = await fetch(withText(k, text), { method: "PUT", headers: { ...auth(), "content-type": blob.type.split(";")[0] || "audio/mp4" }, body: blob });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  audio[k] = (await r.json()).at;
  urls.set(`${k}.${audio[k]}`, URL.createObjectURL(blob)); // no need to download what was just recorded
  changed();
}

export async function removeRecording(text) {
  const k = audioKey(text);
  const r = await fetch(withText(k, text), { method: "DELETE", headers: auth() });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  delete audio[k];
  changed();
}

// Undo the last change to a recording (a new one, a replacement or a delete). Doing it again redoes it.
export async function restoreRecording(text) {
  const k = audioKey(text);
  const r = await fetch(withText(k, text), { method: "POST", headers: { ...auth(), "content-type": "application/json" }, body: JSON.stringify({ action: "restore" }) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const { at } = await r.json();
  if (at) audio[k] = at;
  else delete audio[k];
  changed();
}
