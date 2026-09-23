// The pronunciation in Ukrainian letters (public/js/core/ua.js). These are the sounds Volodymyr reads aloud
// when Dima asks him to say something back, so the mapping is pinned down word by word here: a change to
// core/ua.js that moves any of these is a change he has to agree to.
import { test } from "node:test";
import assert from "node:assert/strict";
import { uaSay, hasSay } from "../public/js/core/ua.js";
import { WORDS } from "../public/js/data/words.js";
import { PHRASES } from "../public/js/data/phrases.js";
import { DIALOGUES } from "../public/js/data/weeks.js";
import { STORIES } from "../public/js/data/stories.js";
import { CHATS } from "../public/js/data/chats.js";
import { LOVE_ITEMS } from "../public/js/data/love.js";

const CYRILLIC = /[Ѐ-ӿ]/;
const LATIN = /[a-z]/i;

test("the words he says most often, letter for letter", () => {
  const golden = {
    "as-salāmu ʿalēkum": "ас-саламу ʼалекум",
    "al-ḥamdu lillāh": "аль-хамду ліллаг",
    "kēfik": "кефік",
    "shlōnik": "шлонік",
    "ṣabāḥ al-khēr": "сабах аль-хер",
    "gahwa": "ґагва",
    "ḥabībti": "хабібті",
    "fidētik": "фідетік",
    "ya galbi": "я ґальбі",
    "bil-bēt": "біль-бет",
    "in shāʾ allah": "ін шаʼ аллаг",
    "yōm": "йом",
    "thnēn": "снен",
    "dhīb": "зіб",
    "ghanam": "ганам",
  };
  for (const [latin, ukrainian] of Object.entries(golden)) assert.equal(uaSay(latin), ukrainian, latin);
});

test("ق is ґ and nothing else is — that is what makes it sound Saudi", () => {
  assert.equal(uaSay("gahwa"), "ґагва");
  assert.equal(uaSay("gilt"), "ґільт");
  assert.ok(!uaSay("ghanam").includes("ґ"), "غ is not ق");
  assert.ok(!uaSay("hala").includes("ґ"), "ه is not ق");
});

test("خ and ح are х; ه and غ are г", () => {
  assert.equal(uaSay("khēr"), "хер");
  assert.equal(uaSay("ḥilw"), "хільв");
  assert.equal(uaSay("hala"), "гала");
  assert.equal(uaSay("ghada"), "гада");
});

test("a light ل before a consonant or at the end reads as ль", () => {
  assert.equal(uaSay("galbi"), "ґальбі");
  assert.equal(uaSay("al-bēt"), "аль-бет");
  assert.equal(uaSay("riyāl"), "ріяль");
  assert.equal(uaSay("lēsh"), "леш", "before a vowel it stays л");
  assert.equal(uaSay("lillāh"), "ліллаг", "a doubled л stays doubled");
});

test("y and a vowel become one Ukrainian letter", () => {
  assert.equal(uaSay("yalla"), "ялла");
  assert.equal(uaSay("yōm"), "йом");
  assert.equal(uaSay("saʿūdiyya"), "саʼудійя");
});

test("a name keeps its capital", () => {
  assert.equal(uaSay("Dīma"), "Діма");
  assert.equal(uaSay("Folodka"), "Фолодка");
});

test("spaces, hyphens and punctuation come through untouched", () => {
  assert.equal(uaSay("wesh tsawwīn al-yōm?"), "веш тсаввін аль-йом?");
  assert.equal(uaSay("yalla, nirūḥ?"), "ялла, нірух?");
  assert.equal(uaSay(""), "");
  assert.equal(uaSay(undefined), "");
});

test("every pronunciation on the site comes out as readable Ukrainian", () => {
  const all = [
    ...WORDS.map(w => w.tr),
    ...PHRASES.map(p => p.tr),
    ...Object.values(DIALOGUES).flat().map(l => l.say),
    ...STORIES.flatMap(s => [...s.text, ...s.words, ...s.quiz]).map(l => l.say),
    ...CHATS.flatMap(c => c.lines).map(l => l.say),
    ...LOVE_ITEMS.map(x => x.say),
  ].filter(Boolean);
  assert.ok(all.length > 1000, `only ${all.length} pronunciations found`);
  for (const say of all) {
    const out = uaSay(say);
    assert.match(out, CYRILLIC, `"${say}" produced no Ukrainian letters`);
    assert.doesNotMatch(out, LATIN, `"${say}" → "${out}" still has Latin letters in it`);
  }
});

// Saudi as the plan writes it has no c, no x and no q (ق is written g). If one turns up, the Ukrainian line
// would show a Latin letter in the middle of Cyrillic — this catches that before he ever sees it.
test("no pronunciation uses a letter the Ukrainian line cannot say", () => {
  const all = [
    ...WORDS.map(w => w.tr), ...PHRASES.map(p => p.tr),
    ...Object.values(DIALOGUES).flat().map(l => l.say),
    ...STORIES.flatMap(s => [...s.text, ...s.words, ...s.quiz]).map(l => l.say),
    ...CHATS.flatMap(c => c.lines).map(l => l.say),
  ].filter(Boolean);
  const bad = new Map();
  for (const say of all) for (const ch of uaSay(say)) if (/[a-z]/i.test(ch)) bad.set(ch, say);
  assert.deepEqual([...bad.keys()].sort(), [], [...bad].map(([c, w]) => `"${c}" in "${w}"`).join(", "));
});

test("hasSay knows when there is something to read", () => {
  assert.ok(hasSay("kēfik"));
  assert.ok(!hasSay(""));
  assert.ok(!hasSay("؟"));
  assert.ok(!hasSay(undefined));
});
