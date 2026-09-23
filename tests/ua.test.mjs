// The pronunciation in Ukrainian letters (public/js/core/ua.js). These are the sounds Volodymyr reads aloud
// when Dima asks him to say something back, so the mapping is pinned down word by word here: a change to
// core/ua.js that moves any of these is a change he has to agree to.
import { test } from "node:test";
import { readFileSync, readdirSync } from "node:fs";
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
    "as-salāmu ʿalēkum": "ас-саламу ъалекум",
    "al-ḥamdu lillāh": "аль-ҳамду ліллаг",
    "kēfik": "кефік",
    "shlōnik": "шлонік",
    "ṣabāḥ al-khēr": "сʹабаҳ аль-хер",
    "masāʾ al-khēr": "масаʼ аль-хер",
    "gahwa": "ґагва",
    "ḥabībti": "ҳабібті",
    "fidētik": "фідетік",
    "ya galbi": "я ґальбі",
    "bil-bēt": "біль-бет",
    "in shāʾ allah": "ін шаʼ аллаг",
    "yōm": "йом",
    "thnēn": "ҫнен",
    "dhīb": "ҙіб",
    "ghanam": "ғанам",
    "ṭayyib": "тʹаййіб",
    "fāẓya": "фаҙʹя",
    "min faḍlik": "мін фаҙʹлік",
    "tisʿa": "тісъа",
  };
  for (const [latin, ukrainian] of Object.entries(golden)) assert.equal(uaSay(latin), ukrainian, latin);
});

test("ق is ґ and nothing else is — that is what makes it sound Saudi", () => {
  assert.equal(uaSay("gahwa"), "ґагва");
  assert.equal(uaSay("gilt"), "ґільт");
  assert.ok(!uaSay("ghanam").includes("ґ"), "غ is not ق");
  assert.ok(!uaSay("hala").includes("ґ"), "ه is not ق");
});

// The whole point of the Ukrainian line: no two Arabic consonants may come out as the same letter, or he
// would learn to say them the same. Every pair below is one he has to be able to tell apart by eye.
test("no two Arabic consonants share a Ukrainian letter", () => {
  const apart = [
    ["خ kh", "ḥ ح"], ["ه h", "gh غ"], ["س s", "th ث"], ["س s", "ṣ ص"], ["th ث", "ṣ ص"],
    ["ز z", "dh ذ"], ["ز z", "ẓ ظ"], ["dh ذ", "ẓ ظ"], ["ت t", "ṭ ط"], ["ع ʿ", "ʾ ء"],
    ["g ق", "gh غ"], ["g ق", "ه h"], ["j ج", "ز z"],
  ];
  for (const [a, b] of apart) {
    const [x, y] = [a, b].map(s => uaSay(s.replace(/[^a-zāīūēōḥṣṭẓḍḏṯġʿʾ]/gi, "")));
    assert.notEqual(x, y, `${a} and ${b} both come out as "${x}"`);
  }
});

test("each throat sound has its own letter", () => {
  assert.equal(uaSay("khēr"), "хер", "خ is plain х");
  assert.equal(uaSay("ḥilw"), "ҳільв", "ح is х with a tail");
  assert.equal(uaSay("hala"), "гала", "ه is г");
  assert.equal(uaSay("ghada"), "ғада", "غ is г with a bar");
  assert.equal(uaSay("gahwa"), "ґагва", "ق is ґ");
  assert.equal(uaSay("maʿa"), "маъа", "ع is the squeeze");
  assert.equal(uaSay("masāʾ"), "масаʼ", "ء is the catch");
});

test("the tongue between the teeth, and the heavy ones", () => {
  assert.equal(uaSay("thalātha"), "ҫалаҫа", "ث — never plain с, that is Egyptian");
  assert.equal(uaSay("dhīb"), "ҙіб", "ذ — never plain з");
  assert.equal(uaSay("ṣēf"), "сʹеф", "ص is the heavy с");
  assert.equal(uaSay("ṭayyib"), "тʹаййіб", "ط is the heavy т");
  assert.equal(uaSay("ẓēf"), "ҙʹеф", "ظ is the heavy ҙ");
  assert.equal(uaSay("ramaḍān"), "рамаҙʹан", "ض sounds the same as ظ in Saudi, whatever the Latin writes");
  assert.equal(uaSay("sēf"), "сеф", "and plain س stays plain — سيف is not صيف");
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
  assert.equal(uaSay("saʿūdiyya"), "саъудійя");
});

test("a name keeps its capital", () => {
  assert.equal(uaSay("Dīma"), "Діма");
  assert.equal(uaSay("Folodka"), "Фолодка");
});

test("spaces, hyphens and punctuation come through untouched", () => {
  assert.equal(uaSay("wesh tsawwīn al-yōm?"), "веш тсаввін аль-йом?");
  assert.equal(uaSay("yalla, nirūḥ?"), "ялла, ніруҳ?");
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
  assert.ok(hasSay("ʿ"), "ع on its own is still a sound");
  assert.ok(!hasSay(""));
  assert.ok(!hasSay("؟"));
  assert.ok(!hasSay(undefined));
});

// He studies alone, so the Ukrainian line has to be on EVERY pronunciation, not most of them. Anything that
// prints a pronunciation into the page must go through translit() (core/dom.js), which adds it. This catches
// a new view that writes ${x.say} straight into the HTML and quietly loses the second line.
test("no page prints a pronunciation without its Ukrainian line", () => {
  const dir = new URL("../public/js/", import.meta.url).pathname;
  const files = [...readdirSync(dir + "views").map(f => "views/" + f), "core/dom.js", "core/studio.js", "core/welcome.js", "core/nudge.js"]
    .filter(f => f.endsWith(".js"));
  // What a pronunciation may legitimately be used for without being shown as text.
  const fine = /data-say|data-hol-say|aria-label|lab\.hear|speakText\(|data-show|show\.say|edit\.say|t\("|cls === "tr"/;
  // A line that already calls translit(), ua() or uaSay() is showing the Ukrainian right there.
  const covered = /translit\(|\bua\(|uaSay\(/;
  const bad = [];
  for (const f of files) {
    const src = readFileSync(dir + f, "utf8");
    src.split("\n").forEach((line, i) => {
      for (const m of line.matchAll(/\$\{[^}]*\.(?:say|tr|translit)\b[^}]*\}/g)) {
        if (fine.test(m[0]) || covered.test(line)) continue;
        const before = line.slice(0, m.index).trimEnd();
        if (before.endsWith('="') || before.endsWith("='")) continue; // inside an attribute
        bad.push(`${f}:${i + 1}  ${m[0]}`);
      }
    });
  }
  assert.deepEqual(bad, [], `these print a pronunciation with no Ukrainian under it:\n  ${bad.join("\n  ")}`);
});
