// In-memory model of the deck + progress, and the logic that decides what to study next.
import * as store from "./store.js";
import { schedule, dayStart, dayKey, DAY, MIN, recallNow } from "./fsrs.js";
import { saveSoon, push as pushNow } from "./sync.js";

export const TYPES = {
  rec:    { label: "Recognition", short: "Arabic → English" },
  listen: { label: "Listening",   short: "Audio → meaning" },
  prod:   { label: "Production",  short: "English → Arabic" },
  cloze:  { label: "Cloze",       short: "Fill the gap" },
  basic:  { label: "Card",        short: "Front → back" },
};
export const VOCAB_TYPES = ["rec", "listen", "prod", "cloze"];
export const LEVEL_NAMES = { A1: "Survival", A2: "Conversational", B1: "Fluency", B2: "Advanced", C1: "Proficient", C2: "Mastery" };
const LEVEL_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2", ""];

export const DEFAULT_SETTINGS = {
  newPerDay: 20, reviewsPerDay: 200, retention: 0.9,
  types: { rec: true, listen: false, prod: true, cloze: true },
  levels: [],            // empty = every level
  voice: "both", autoplay: true, speed: 1, theme: "system", // "both" plays the man and then the woman

};
const freshDay = () => ({ key: dayKey(), newCount: 0, introCount: 0, followCount: 0, reviewCount: 0, done: 0, ms: 0 });

export const S = {
  deck: null, notes: [], byGuid: new Map(), levels: [], themes: [],
  cards: new Map(), user: new Map(), settings: structuredClone(DEFAULT_SETTINGS), day: freshDay(),
};

export async function load() {
  const [deck, settings, day, notes, cards, user] = await Promise.all([
    store.get("meta", "deck"), store.get("meta", "settings"), store.get("meta", "day"),
    store.all("notes"), store.entries("cards"), store.entries("user"),
  ]);
  S.deck = deck || null;
  S.settings = { ...structuredClone(DEFAULT_SETTINGS), ...settings, types: { ...DEFAULT_SETTINGS.types, ...settings?.types } };
  S.day = day || freshDay();
  S.cards = cards;
  S.user = user;
  S.notes = S.deck ? notes.sort((a, b) => a.sort - b.sort || a.id - b.id) : [];
  S.byGuid = new Map(S.notes.map(n => [n.guid, n]));
  S.levels = [...new Set(S.notes.map(n => n.level))].filter(Boolean).sort((a, b) => LEVEL_ORDER.indexOf(a) - LEVEL_ORDER.indexOf(b));
  const themes = new Map();
  for (const n of S.notes) {
    if (!n.theme) continue;
    if (!themes.has(n.theme.id)) themes.set(n.theme.id, { ...n.theme, level: n.level, notes: [] });
    themes.get(n.theme.id).notes.push(n);
  }
  const num = id => id.split(".").map(x => x.padStart(4, "0")).join(".");
  S.themes = [...themes.values()].sort((a, b) => num(a.id).localeCompare(num(b.id)));
  ensureDay();
}

export function ensureDay() {
  if (S.day.key !== dayKey()) S.day = freshDay();
}

// Settings follow him between devices like everything else: the moment they changed decides which
// side wins when two devices disagree.
export const saveSettings = async () => {
  await Promise.all([store.set("meta", "settings", S.settings), store.set("meta", "settingsAt", Date.now())]);
  saveSoon(3000);
};
export const userOf = guid => S.user.get(guid) || {};
export async function setUser(guid, patch) {
  const u = { ...userOf(guid), ...patch };
  S.user.set(guid, u);
  await store.set("user", guid, u);
}

// Card types this note can produce, regardless of settings.
export function availableTypes(note) {
  if (note.kind !== "vocab") return ["basic"];
  const f = note.fields, a = note.audio;
  return VOCAB_TYPES.filter(t =>
    t === "listen" ? !!(a.AudioWordMale || a.AudioWordFemale) :
    t === "cloze" ? !!f.ExampleArabic?.trim() : true);
}
export function enabledTypes(note) {
  const types = availableTypes(note);
  if (note.kind !== "vocab") return types;
  const on = types.filter(t => S.settings.types[t]);
  return on.length ? on : types.slice(0, 1);
}
export const cardId = (note, type) => `${note.guid}:${type}`;

function inScope(note, focus) {
  if (userOf(note.guid).suspended) return false;
  if (focus?.theme) return note.theme?.id === focus.theme;
  if (focus?.starred) return !!userOf(note.guid).star;
  const lv = S.settings.levels;
  return !lv.length || !note.level || lv.includes(note.level);
}

/**
 * What's due today. New cards are paced: a word's first card (usually Recognition) introduces it;
 * its other cards unlock once that one has graduated, one per day, mixed in with brand-new words.
 */
export function queues(now = Date.now(), focus = null) {
  ensureDay();
  const ds = dayStart(now), de = ds + DAY;
  const studiedToday = new Set();
  for (const [id, c] of S.cards) if (c.last >= ds) studiedToday.add(id.slice(0, id.lastIndexOf(":")));

  const learn = [], review = [], intro = [], follow = [];
  let followTypes = 1;
  for (const note of S.notes) {
    if (!inScope(note, focus)) continue;
    const types = enabledTypes(note);
    followTypes = Math.max(followTypes, types.length - 1);
    let offered = false;
    types.forEach((type, i) => {
      const id = cardId(note, type), c = S.cards.get(id);
      if (c) {
        if (c.due < de) (c.state === "review" ? review : learn).push({ note, type, id });
        return;
      }
      if (offered || studiedToday.has(note.guid)) return;
      if (i === 0) { intro.push({ note, type, id, kind: "intro" }); offered = true; return; }
      const first = S.cards.get(cardId(note, types[0]));
      if (first?.state === "review") { follow.push({ note, type, id, kind: "follow" }); offered = true; }
    });
  }

  // Mix follow-ups and new words so the backlog stays steady (≈ follow-up types per new word).
  const room = focus ? Math.max(0, S.settings.newPerDay - S.day.newCount) + 10 : Math.max(0, S.settings.newPerDay - S.day.newCount);
  const fresh = [];
  let i = 0, f = 0, ic = S.day.introCount, fc = S.day.followCount;
  while (fresh.length < room && (i < intro.length || f < follow.length)) {
    if (f < follow.length && (i >= intro.length || fc < ic * followTypes)) { fresh.push(follow[f++]); fc++; }
    else { fresh.push(intro[i++]); ic++; }
  }
  const byDue = (a, b) => S.cards.get(a.id).due - S.cards.get(b.id).due;
  learn.sort(byDue);
  // Most-at-risk reviews first
  review.sort((a, b) => recallNow(S.cards.get(a.id), now) - recallNow(S.cards.get(b.id), now));
  const reviewRoom = focus ? review.length : Math.max(0, S.settings.reviewsPerDay - S.day.reviewCount);
  return { learn, review: review.slice(0, reviewRoom), fresh };
}

export function pickNext(focus, lastId, now = Date.now()) {
  const Q = queues(now, focus);
  const learnReady = limit => {
    const ready = Q.learn.filter(x => S.cards.get(x.id).due <= limit);
    if (!ready.length) return null;
    return ready[0].id === lastId && ready.length > 1 ? ready[1] : ready[0];
  };
  const l = learnReady(now);
  if (l) return { item: l, Q };
  const nR = Q.review.length, nN = Q.fresh.length;
  if (nR || nN) {
    const takeNew = nN && (!nR || Math.random() < nN / (nN + nR));
    let item = takeNew ? Q.fresh[0] : Q.review[0];
    if (item.id === lastId && (takeNew ? Q.fresh[1] : Q.review[1])) item = takeNew ? Q.fresh[1] : Q.review[1];
    return { item, Q };
  }
  return { item: learnReady(now + 20 * MIN), Q };  // learn ahead a little, like Anki
}

const undoStack = [];
export const canUndo = () => undoStack.length > 0;

export async function grade(item, g, ms) {
  const now = Date.now(), prev = S.cards.get(item.id);
  const next = schedule(prev, g, now, S.settings.retention);
  const daySnap = { ...S.day };
  ensureDay();
  if (!prev) { S.day.newCount++; item.kind === "follow" ? S.day.followCount++ : S.day.introCount++; }
  else if (prev.state === "review") S.day.reviewCount++;
  S.day.done++;
  S.day.ms += Math.min(ms, 90e3);
  S.cards.set(item.id, next);
  const logKey = await store.add("revlog", { cid: item.id, t: now, g, from: prev ? prev.state : "new", ivl: next.ivl, s: next.s, ms: Math.round(ms) });
  await Promise.all([store.set("cards", item.id, next), store.set("meta", "day", S.day)]);
  undoStack.push({ item, prev, daySnap, logKey });
  saveSoon(); // the answer is on its way to his database a few seconds from now
  if (undoStack.length > 50) undoStack.shift();
}

export async function undo() {
  const u = undoStack.pop();
  if (!u) return null;
  if (u.prev) { S.cards.set(u.item.id, u.prev); await store.set("cards", u.item.id, u.prev); }
  else { S.cards.delete(u.item.id); await store.remove("cards", u.item.id); }
  S.day = u.daySnap;
  await Promise.all([store.remove("revlog", u.logKey), store.set("meta", "day", S.day)]);
  return u.item;
}

// ---- Status helpers for Browse / Home ----
export function noteStatus(note) {
  const cs = enabledTypes(note).map(t => S.cards.get(cardId(note, t))).filter(Boolean);
  if (!cs.length) return "new";
  if (cs.some(c => c.state !== "review")) return "learning";
  return cs.every(c => c.ivl >= 21) ? "mature" : "young";
}
export function cardStatus(c) {
  if (!c) return "new";
  if (c.state !== "review") return "learning";
  return c.ivl >= 21 ? "mature" : "young";
}
export const wordsKnown = () => S.notes.filter(n => S.cards.get(cardId(n, enabledTypes(n)[0]))?.state === "review").length;

// ---- Backup ----
export async function exportProgress() {
  return {
    app: "najdi", version: 1, exportedAt: new Date().toISOString(), deck: S.deck?.name || null,
    settings: S.settings, day: S.day,
    cards: Object.fromEntries(S.cards), user: Object.fromEntries(S.user),
    revlog: await store.all("revlog"),
  };
}
export async function importProgress(data) {
  if (!data || data.app !== "najdi" || typeof data.cards !== "object") throw new Error("That isn’t a Najdi progress backup.");
  await store.clear("cards", "user", "revlog");
  await store.putMany("cards", Object.entries(data.cards));
  await store.putMany("user", Object.entries(data.user || {}));
  await store.putMany("revlog", (data.revlog || []).map((r, i) => [i + 1, r]));
  if (data.settings) await store.set("meta", "settings", data.settings);
  await store.set("meta", "day", data.day?.key === dayKey() ? data.day : freshDay());
  await store.set("meta", "resetAt", Date.now()); // a restored backup replaces what the others hold too
  undoStack.length = 0;
  await load();
  pushNow();
}
export async function resetProgress() {
  await store.clear("cards", "revlog");
  await store.set("meta", "day", freshDay());
  // Starting over has to reach his other devices — without this stamp they would simply hand back
  // everything they still remember the next time they synced.
  await store.set("meta", "resetAt", Date.now());
  undoStack.length = 0;
  await load();
  pushNow();
}
export async function removeDeck() {
  await store.set("meta", "deck", null);
  await store.clear("notes", "media");
  await load();
}
