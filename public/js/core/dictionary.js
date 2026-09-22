// The word lists tap-a-word looks in, in order: the story's own key words, her words, the plan's words
// (data/vocab.json), the reading glossary (data/glossary.js), then the love phrases. No DOM, so the tests use it too.
import { makeGlossary } from "./gloss.js";
import { HER_WORDS } from "../data/hers.js";
import { LOVE_ITEMS } from "../data/love.js";
import { GLOSSARY } from "../data/glossary.js";

// Verbs in the plan's lists: the "I" form of the present (أروح) in 1.6 and 4.2, past "I" forms (رحت) in 4.1.
function kindOf(e) {
  if ((e.topic === "1.6" || e.topic === "4.2") && /^[أآ]/.test(e.ar)) return "v";
  if (e.topic === "4.1" && /^I /.test(e.en)) return "p1";
  return undefined;
}

export function vocabEntries(vocab) {
  return vocab.stages.flatMap(s => s.topics.flatMap(t => t.entries.map(e => ({ ...e, kind: kindOf(e) }))));
}

// own: the open story's key words (they win); more: other key words, used only when nothing else knows the word.
export function dictionary(vocab, own = [], more = []) {
  return makeGlossary([own, HER_WORDS, vocab ? vocabEntries(vocab) : [], GLOSSARY, more, LOVE_ITEMS]);
}
