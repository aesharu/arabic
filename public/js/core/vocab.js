// The vocabulary as decks for the Cards page, in the order the plan teaches it. Words come from data/vocab.json
// (built from NAJDI-PLAN.md and NAJDI-WORDS.md by `npm run vocab`); the Script-week phrases from data/phrases.js.
// A deck opens on the day its stage starts, so new cards follow the plan — unless "open every deck" is on.
import { PHASES } from "../data/plan.js";
import { PHRASES } from "../data/phrases.js";
import { LOVE_ITEMS } from "../data/love.js";
import { HER_WORDS } from "../data/hers.js";
import { dateOfDay } from "./schedule.js";
import * as content from "./content.js";

let request = null;
let loaded = null;
export const loadVocab = () =>
  (request ??= fetch("data/vocab.json")
    .then(r => (r.ok ? r.json() : Promise.reject(new Error(`vocab.json: HTTP ${r.status}`))))
    .then(v => {
      loaded = { vocab: v, notes: buildNotes(v) };
      applyEdits();
      return loaded;
    })
    .catch(e => {
      request = null; // try again next time
      throw e;
    }));
export const vocabNow = () => loaded;

// Dima's corrections, laid over every word (and again whenever they change).
function applyEdits() {
  if (!loaded) return;
  for (const s of loaded.vocab.stages) for (const t of s.topics) t.entries.forEach(content.apply);
  loaded.notes.forEach(content.apply);
}
content.onChange(applyEdits);

// id → when that deck opens. PHASES[1] is Stage 1, [2] Stage 2, [3] Stage 3, [4] Stage 4.
export const DECKS = [
  { id: "phrases", opens: PHASES[0].start },
  { id: "hers", opens: PHASES[0].start }, // words she taught him — open from the first day
  { id: "love", opens: PHASES[0].start }, // what to say to her — open from the first day
  { id: "1", opens: PHASES[1].start },
  { id: "grammar", opens: PHASES[1].start },
  { id: "2", opens: PHASES[2].start },
  { id: "special", opens: PHASES[2].start },
  { id: "3", opens: PHASES[3].start },
  { id: "4", opens: PHASES[4].start },
];
const OPENS = Object.fromEntries(DECKS.map(d => [d.id, d.opens]));

// The same word written with or without vowel marks, question marks or ellipses is still the same word.
export const bare = ar => ar.replace(/[ً-ْـ؟?…!.،]/g, "").replace(/\s+/g, " ").trim();

// What the voice reads: the last form of "X / Y" or "X → Y", without "…" and "؟".
export const speakText = ar => ar.split(/ [/→] /).at(-1).replace(/[…؟]/g, "").trim();

function fnv(s) {
  let h = 0x811c9dc5;
  for (const ch of s) h = Math.imul(h ^ ch.codePointAt(0), 0x01000193) >>> 0;
  return h.toString(36);
}

// Every card-able word once, in teaching order: { id, deck, opens, ar, say, en, uk, msa, note?, toHer?, reply?, check }
export function buildNotes(vocab) {
  const all = vocab.stages.flatMap(s => s.topics.flatMap(t => t.entries.map(e => ({ ...e, deck: s.id, topicTitle: t.title }))));
  const byBare = new Map();
  for (const e of all) if (!byBare.has(bare(e.ar))) byBare.set(bare(e.ar), e);

  const notes = [];
  const seen = new Set();
  const add = n => {
    if (seen.has(n.id) || seen.has(`ar:${bare(n.ar)}`)) return;
    seen.add(n.id);
    seen.add(`ar:${bare(n.ar)}`);
    notes.push(n);
  };
  // The Script weeks: three phrases a day, each opening on its own day. A phrase that is also in the plan's word
  // tables keeps that word's id, so it stays one card.
  for (const p of PHRASES) {
    const twin = byBare.get(bare(p.ar));
    add({
      id: twin?.id ?? fnv(`${p.ar}|${p.en}`), deck: "phrases", opens: dateOfDay(p.day), day: p.day,
      ar: p.ar, say: p.tr, en: p.en, uk: p.uk, msa: p.msa, note: p.note, check: !!p.check, checkNote: p.checkNote, speak: p.speak,
      topicTitle: twin?.topicTitle,
    });
  }
  // Her words (data/hers.js) and To her ♥ (data/love.js): open from Day 1.
  for (const x of HER_WORDS) add({ ...x, deck: "hers", opens: OPENS.hers, check: false, topicTitle: null });
  for (const x of LOVE_ITEMS) add({ ...x, deck: "love", opens: OPENS.love, topicTitle: null });
  for (const d of DECKS.filter(d => !["phrases", "hers", "love"].includes(d.id))) {
    for (const e of all.filter(x => x.deck === d.id)) add({ ...e, opens: OPENS[d.id] });
  }
  return notes;
}
