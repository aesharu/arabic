// Cards: every word as two cards, like Anki's "Basic (and reversed card)".
//   <id>.r  Recognize — Najdi on the front, meaning on the back
//   <id>.p  Say it    — meaning on the front, say it out loud in Najdi, then check
// A "say it" card only comes up once you've learned to recognize the word (on an earlier day).
// The next card is chosen the way Anki does it: learning cards that are due, then today's reviews, then new cards
// up to the daily limit, then learning cards a little ahead of time so you don't wait.
import * as store from "./store.js";
import { answer as schedule, newCard, isLearned, isMature } from "./srs.js";
import { todayKey } from "./dates.js";
import { DECKS } from "./vocab.js";
import { totals, stageNow } from "./schedule.js";
import { PHASES } from "../data/plan.js";

const LEARN_AHEAD_MS = 20 * 60_000;

export const prefs = () => store.get().srs.prefs;
export const setPrefs = patch => store.update(s => { s.srs.prefs = { ...s.srs.prefs, ...patch, mod: Date.now() }; });

const cardsOf = () => store.get().srs.cards;
export const cardOf = id => cardsOf()[id];
export const noteOfCard = cardId => cardId.slice(0, cardId.lastIndexOf("."));
export const kindOf = cardId => cardId.slice(cardId.lastIndexOf(".") + 1); // "r" | "p"

// How far the decks are open: which stage he has reached, and how many days he has actually studied — the
// Script-week phrases still arrive one a day, but by days studied, not by the calendar.
export function openness(notes) {
  const p = progressNow(notes);
  return { stage: PHASES.indexOf(stageNow(p)), days: p.days };
}
const isOpen = (note, at) =>
  prefs().unlockAll || (note.day ? note.day <= Math.max(1, at.days + 1) : (note.stage ?? 0) <= at.stage);
export const deckOpen = (deckId, notes) =>
  prefs().unlockAll || (DECKS.find(d => d.id === deckId)?.stage ?? 0) <= openness(notes).stage;

// Cards introduced for the first time today, against the daily limit.
export const newToday = (today = todayKey()) => store.get().log[today]?.cards?.n ?? 0;
export const newLeft = (today = todayKey()) => Math.max(0, prefs().newPerDay - newToday(today));

/**
 * Everything waiting in a deck (or all decks when deck is null), right now.
 * { learn: [cardId due now], review: [cardId due today], fresh: [cardId new, in teaching order], later: [cardId learning
 *   due later today], nextAt: ms of the next learning card or 0 }
 */
export function queue(notes, { deck = null, now = Date.now(), today = todayKey() } = {}) {
  const cards = cardsOf();
  const { reverse } = prefs();
  const learn = [];
  const review = [];
  const later = [];
  const freshSay = [];
  const freshRecognize = [];
  const at = openness(notes); // worked out once for the whole pass
  for (const n of notes) {
    if (deck && n.deck !== deck) continue;
    for (const kind of reverse ? ["r", "p"] : ["r"]) {
      const id = `${n.id}.${kind}`;
      const c = cards[id];
      if (c?.susp) continue;
      if (!c || c.s === 0) {
        if (!isOpen(n, at)) continue;
        if (kind === "r") freshRecognize.push(id);
        else {
          const twin = cards[`${n.id}.r`];
          if (isLearned(twin) && twin.last < today) freshSay.push(id);
        }
      } else if (c.s === 1 || c.s === 3) {
        (c.due <= now ? learn : later).push(id);
      } else if (c.due <= today) review.push(id);
    }
  }
  const byDue = (a, b) => (cards[a].due < cards[b].due ? -1 : cards[a].due > cards[b].due ? 1 : 0);
  learn.sort(byDue);
  later.sort(byDue);
  review.sort(byDue);
  // Words you can already recognize get their "say it" card before brand-new words.
  const fresh = [...freshSay, ...freshRecognize].slice(0, newLeft(today));
  return { learn, review, fresh, later, nextAt: later.length ? cards[later[0]].due : 0 };
}

// The card to show next, or null when there's nothing left for now.
export function nextCard(q, now = Date.now()) {
  if (q.learn.length) return q.learn[0];
  if (q.review.length) return q.review[0];
  if (q.fresh.length) return q.fresh[0];
  if (q.later.length && cardsOf()[q.later[0]].due - now <= LEARN_AHEAD_MS) return q.later[0];
  return null;
}

// The three numbers Anki shows over a deck: new · learning · due.
export function counts(notes, opts) {
  const q = queue(notes, opts);
  return { fresh: q.fresh.length, learn: q.learn.length + q.later.length, review: q.review.length };
}

/**
 * Answer a card (1 Again · 2 Hard · 3 Good · 4 Easy). Returns an undo token.
 */
export function answerCard(cardId, grade, { now = Date.now(), today = todayKey() } = {}) {
  const before = cardsOf()[cardId];
  const dayBefore = store.get().log[today]?.cards;
  const wasNew = !before || before.s === 0;
  const next = { ...schedule(before ?? newCard(), grade, { now, today }), mod: now };
  store.update(s => {
    s.srs.cards[cardId] = next;
    const e = (s.log[today] ??= { min: 0, tasks: [] });
    const c = (e.cards ??= { n: 0, r: 0, a: 0 });
    c.r++;
    if (wasNew) c.n++;
    if (grade === 1) c.a++;
  });
  return { cardId, before, dayBefore: dayBefore ? { ...dayBefore } : undefined, today };
}

export function undo({ cardId, before, dayBefore, today }) {
  store.update(s => {
    if (before) s.srs.cards[cardId] = { ...before, mod: Date.now() };
    else s.srs.cards[cardId] = { ...newCard(), mod: Date.now() }; // back to new, and the cloud learns it changed
    const e = s.log[today];
    if (e) {
      if (dayBefore) e.cards = dayBefore;
      else delete e.cards;
    }
  });
}

// Suspend: the card never comes up again until you bring suspended cards back.
export const suspend = cardId =>
  store.update(s => { s.srs.cards[cardId] = { ...(s.srs.cards[cardId] ?? newCard()), susp: true, mod: Date.now() }; });
export const suspendedCount = () => Object.values(cardsOf()).filter(c => c.susp).length;
export const unsuspendAll = () =>
  store.update(s => {
    for (const [id, c] of Object.entries(s.srs.cards)) if (c.susp) s.srs.cards[id] = { ...c, susp: false, mod: Date.now() };
  });

// How many words you know: learned = recognized after the learning steps, strong = three weeks or more.
// What the stage gates look at (core/schedule.js): letter groups marked done, words learned, and the number
// of days actually studied — never the calendar.
export function progressNow(notes) {
  const st = store.get();
  return {
    letters: new Set(st.script.done ?? []).size,
    done: st.script.done ?? [],
    words: notes ? wordStats(notes).learned : 0,
    days: totals(st.log).days,
  };
}

export function wordStats(notes) {
  const cards = cardsOf();
  let seen = 0, learned = 0, strong = 0;
  for (const n of notes) {
    const c = cards[`${n.id}.r`];
    if (c && c.s > 0) seen++;
    if (isLearned(c)) learned++;
    if (isMature(c)) strong++;
  }
  return { seen, learned, strong, total: notes.length };
}

// A word's state for badges on the Word list: "new" | "learning" | "learned" | "strong" | "suspended"
export function wordState(noteId) {
  const c = cardsOf()[`${noteId}.r`];
  if (!c || c.s === 0) return "new";
  if (c.susp) return "suspended";
  if (isMature(c)) return "strong";
  if (isLearned(c)) return "learned";
  return "learning";
}
