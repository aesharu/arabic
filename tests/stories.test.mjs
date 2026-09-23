// Stories (public/js/data/stories.js) and tap-a-word (core/gloss.js, core/dictionary.js): every sentence in
// both languages, pronunciation that lines up word for word, easy stories really easy, and every word in every
// story explained.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { STORIES, STORY_LINES, LEVELS } from "../public/js/data/stories.js";
import { tokens, sayWords, makeGlossary } from "../public/js/core/gloss.js";
import { dictionary } from "../public/js/core/dictionary.js";
import { GLOSSARY } from "../public/js/data/glossary.js";

const TRAPS = ["إزيك", "شو", "فين", "عايز", "بدي", "دلوقتي", "هلق", "كويس", "ليه", "كمان", "مش", "دحين", "إيش", "ازاي", "هيك", "منيح", "بحبك", "كتير", "هلأ", "نحن"];
const words = ar => tokens(ar).filter(t => t.w).map(t => t.w);

function checkLine(l, where) {
  for (const f of ["ar", "say", "en"]) assert.ok(l[f], `${where} ${l.ar ?? ""}: ${f} is missing`);
  assert.match(l.ar, /[؀-ۿ]/, `${where} ${l.ar}: should be Arabic`);
  assert.doesNotMatch(l.say, /[؀-ۿ]/, `${where} ${l.ar}: pronunciation should be Latin`);
  for (const trap of TRAPS) assert.ok(!words(l.ar).includes(trap), `${where}: ${l.ar} contains ${trap}`);
}

test("60 stories, 20 in each step, unique ids, titles in both languages", () => {
  assert.deepEqual(LEVELS, ["easy", "A1", "A2"]);
  for (const level of LEVELS) assert.equal(STORIES.filter(s => s.level === level).length, 20, level);
  assert.equal(new Set(STORIES.map(s => s.id)).size, STORIES.length);
  assert.equal(new Set(STORY_LINES.map(l => l.id)).size, STORY_LINES.length);
  for (const s of STORIES) for (const f of ["en", "najdi"]) assert.ok(s.title[f], `${s.id}: title ${f}`);
});

test("every sentence, key word and question: both languages, pronunciation one piece per Arabic word", () => {
  for (const s of STORIES) {
    assert.ok(s.text.length >= 5, `${s.id}: at least five sentences`);
    assert.ok(s.words.length >= 5, `${s.id}: at least five key words`);
    assert.ok(s.quiz.length >= 2, `${s.id}: at least two questions`);
    for (const l of [...s.text, ...s.words, ...s.quiz]) {
      checkLine(l, s.id);
      assert.equal(sayWords(l.say).length, words(l.ar).length, `${s.id}: "${l.ar}" / "${l.say}" don't line up word for word`);
    }
    for (const q of s.quiz) assert.equal(typeof q.answer, "boolean", `${s.id}: ${q.ar} needs true or false`);
    assert.ok(s.quiz.some(q => q.answer) && s.quiz.some(q => !q.answer), `${s.id}: questions should be both true and false`);
  }
});

test("step 1 is like a children's book: short sentences, short stories", () => {
  for (const s of STORIES.filter(x => x.level === "easy")) {
    assert.ok(s.text.length <= 6, `${s.id}: ${s.text.length} sentences`);
    for (const l of s.text) assert.ok(words(l.ar).length <= 6, `${s.id}: "${l.ar}" is long for step 1`);
  }
  const avg = level => {
    const lines = STORIES.filter(s => s.level === level).flatMap(s => s.text);
    return lines.reduce((n, l) => n + words(l.ar).length, 0) / lines.length;
  };
  assert.ok(avg("easy") < avg("A1") && avg("A1") < avg("A2"), "sentences should get longer step by step");
});

test("tap-a-word explains every word in every story", () => {
  const vocab = JSON.parse(readFileSync(new URL("../public/data/vocab.json", import.meta.url), "utf8"));
  const all = STORIES.flatMap(s => s.words);
  const missing = [];
  for (const s of STORIES) {
    const d = dictionary(vocab, s.words, all);
    for (const l of [...s.text, ...s.quiz]) {
      const ws = words(l.ar);
      for (let i = 0; i < ws.length; i++) {
        const p = d.phraseAt(ws, i);
        if (p) {
          i += p.n - 1;
          continue;
        }
        if (!d.lookup(ws[i])) missing.push(`${s.id}: ${ws[i]}`);
      }
    }
  }
  assert.deepEqual(missing, []);
});

test("tap-a-word explains every word in every chat", async () => {
  const { CHATS } = await import("../public/js/data/chats.js");
  const vocab = JSON.parse(readFileSync(new URL("../public/data/vocab.json", import.meta.url), "utf8"));
  const d = dictionary(vocab);
  const missing = [];
  for (const c of CHATS)
    for (const l of c.lines) {
      const ws = words(l.ar);
      for (let i = 0; i < ws.length; i++) {
        const p = d.phraseAt(ws, i);
        if (p) i += p.n - 1;
        else if (!d.lookup(ws[i])) missing.push(`${c.id}: ${ws[i]}`);
      }
    }
  assert.deepEqual(missing, []);
});

test("the reading glossary: pronunciation, meanings in both languages, valid kinds", () => {
  for (const g of GLOSSARY) {
    for (const f of ["ar", "say", "en"]) assert.ok(g[f], `${g.ar}: ${f}`);
    assert.ok([undefined, "v", "p1", "p3"].includes(g.kind), `${g.ar}: kind`);
    assert.ok(g.check, `${g.ar}: should be flagged`);
  }
});

test("taking words apart: و + بيت + ي, verb persons and tenses, بـ = will", () => {
  const d = makeGlossary([[
    { ar: "بيت", say: "bēt", en: "house", uk: "дім" },
    { ar: "أروح", say: "arūḥ", en: "go", uk: "іти", kind: "v" },
    { ar: "أمشي", say: "amshi", en: "I walk", uk: "я йду", kind: "v" },
    { ar: "شفت", say: "shift", en: "I saw", uk: "я побачив", kind: "p1" },
    { ar: "راح", say: "rāḥ", en: "he went", uk: "він пішов", kind: "p3" },
    { ar: "سيارة", say: "sayyāra", en: "car", uk: "машина" },
    { ar: "سعودي", say: "saʿūdi", en: "Saudi", uk: "саудівець" },
    { ar: "على", say: "ʿala", en: "on", uk: "на" },
    { ar: "علي", say: "ʿalay", en: "on me", uk: "на мене" },
    { ar: "صباح الخير", say: "ṣabāḥ al-khēr", en: "good morning", uk: "доброго ранку" },
  ]]);
  const r = d.lookup("وبيتي");
  assert.deepEqual(r.parts.map(p => p.key ?? p.ar), ["w", "بيت", "i"]);
  assert.deepEqual([d.lookup("تروحين").who, d.lookup("تروحين").tense], ["youF", "now"]);
  assert.deepEqual([d.lookup("يروحون").who, d.lookup("نروح").who], ["they", "we"]);
  assert.deepEqual([d.lookup("تمشين").e.ar, d.lookup("تمشين").who], ["أمشي", "youF"]);
  assert.deepEqual([d.lookup("بروح").tense, d.lookup("بتروح").tense], ["will", "will"]);
  assert.deepEqual([d.lookup("شفنا").who, d.lookup("شفنا").tense], ["we", "past"]);
  assert.deepEqual([d.lookup("راحت").who, d.lookup("راحوا").who], ["she", "they"]);
  assert.equal(d.lookup("بالسيارة").e.ar, "سيارة");
  assert.equal(d.lookup("سيارات").e.ar, "سيارة");
  assert.equal(d.lookup("سعودية").e.ar, "سعودي");
  assert.notEqual(d.lookup("على").e, d.lookup("علي").e, "على and علي are different words");
  assert.equal(d.phraseAt(["صباح", "الخير", "يا"], 0).n, 2);
  assert.equal(d.lookup("كمبيوتر"), null);
});
