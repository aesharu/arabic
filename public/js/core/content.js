// Dima's corrections and recordings, from the cloud (worker /api/content, /api/edits, /api/audio).
// Corrections are laid over the words from the plan at runtime — NAJDI-PLAN.md itself never changes here.
// Recordings are found by their Arabic text, so a word she records plays wherever that word appears.
import * as store from "./store.js";

let edits = {};
let audio = {}; // key → time recorded
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
      changed();
    })
    .catch(() => {})
    .finally(() => setTimeout(() => (loaded = null), 60_000)); // look again after a minute
  return loaded;
}

// ---------- Corrections ----------
export const editOf = id => edits[id];
export const FIELDS = ["ar", "say", "en", "uk", "msa"];

// Lay the corrections over a word (keeps the plan's version in .orig).
export function apply(entry) {
  const e = edits[entry.id];
  if (!e && !entry.orig) return entry;
  entry.orig ??= Object.fromEntries(FIELDS.map(f => [f, entry[f]]).concat([["check", entry.check]]));
  for (const f of FIELDS) entry[f] = e?.[f] ?? entry.orig[f];
  entry.check = e?.checked ? false : entry.orig.check;
  entry.edited = Boolean(e);
  return entry;
}

export async function saveEdit(id, data) {
  const r = await fetch(`api/edits/${id}`, { method: "PUT", headers: { ...auth(), "content-type": "application/json" }, body: JSON.stringify(data) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  edits[id] = { ...(await r.json()).data, by: store.profile(), at: Date.now() };
  changed();
}

export async function revertEdit(id) {
  const r = await fetch(`api/edits/${id}`, { method: "DELETE", headers: auth() });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  delete edits[id];
  changed();
}

// ---------- Recordings ----------
export const hasAudio = text => Boolean(audio[audioKey(text)]);
export const recordedCount = texts => texts.filter(hasAudio).length;
const urls = new Map();

async function urlFor(text) {
  const k = audioKey(text);
  const tag = `${k}.${audio[k]}`;
  if (!urls.has(tag)) {
    const r = await fetch(`api/audio/${k}`, { headers: auth() });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    urls.set(tag, URL.createObjectURL(await r.blob()));
  }
  return urls.get(tag);
}

let playing = null;
export async function playRecording(text) {
  playing?.pause();
  const a = new Audio(await urlFor(text));
  playing = a;
  await a.play();
  return a;
}

export async function upload(text, blob) {
  const k = audioKey(text);
  const r = await fetch(`api/audio/${k}`, { method: "PUT", headers: { ...auth(), "content-type": blob.type.split(";")[0] || "audio/mp4" }, body: blob });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  audio[k] = (await r.json()).at;
  changed();
}

export async function removeRecording(text) {
  const k = audioKey(text);
  const r = await fetch(`api/audio/${k}`, { method: "DELETE", headers: auth() });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  delete audio[k];
  changed();
}
