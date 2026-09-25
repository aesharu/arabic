// The book (public/js/data/book.js, views/book.js) — the one thing on the site that is a book.
//
// What has to stay true, and what would go wrong if it didn't:
//   · five hundred words, no more — the promise he was made, and the difference between a book he finishes
//     and one he abandons;
//   · every word on a word page comes from the plan's own vocabulary, so none of this is Arabic I invented;
//   · the Arabic and the pronunciation spell the same word, or he learns to read a word wrong;
//   · no two letters that ever stand next to each other share a colour, or the colours stop taking the word
//     apart for him, which is the only reason they are there.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { COVER, PARTS, PAGES, HUE, LETTER, ALPHABET, END } from "../public/js/data/book.js";
import { STRINGS } from "../public/js/i18n/strings.js";
import { GROUPS } from "../public/js/data/letters.js";
import { GLOSSARY } from "../public/js/data/glossary.js";
import { hasPic, PIC_NAMES } from "../public/js/core/pics.js";
import { tokens, sayWords } from "../public/js/core/gloss.js";
import { clusters, shapes } from "../public/js/core/arabic.js";
import { UA_KEY, UA_LENGTH } from "../public/js/core/ua.js";
import { sameWord } from "./spelling.mjs";

const WORDS_PROMISED = 500;
const ARABIC = /[ء-ي]/;
const MARKS = /[ً-ْ]/;
const TRAPS = ["إزيك", "شو", "فين", "عايز", "بدي", "دلوقتي", "هلق", "كويس", "ليه", "كمان", "مش", "دحين", "إيش",
  "ازاي", "هيك", "منيح", "بحبك", "كتير", "هلأ", "نحن", "وايد", "چذي", "مب", "أحبچ"];
const VOWELLED = ["letters", "marks", "words", "sentences"]; // the parts that still carry every mark

const SAME = ["تة", "يى", "اأإآ", "وؤ", "يئ"]; // shapes that are the same letter, so they may share a colour
const bare = s => String(s).replace(/[ً-ْٰـ]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي");
const words = s => tokens(String(s)).filter(t => t.w).map(t => t.w);

// Everything the book puts in front of him, page by page: [Arabic, pronunciation, English].
const rows = p =>
  p.kind === "letter" ? p.words.map(([ar, say, en]) => [ar, say, en])
  : p.kind === "mark" ? p.words.map(([ar, say, en]) => [ar, say, en])
  : p.kind === "words" ? p.items.map(([ar, say, en]) => [ar, say, en])
  : p.kind === "text" || p.kind === "talk" ? p.lines.map(l => [l.ar, l.say, l.en])
  : [];
const ALL_ROWS = PAGES.flatMap(p => rows(p).map(r => [...r, p]));
const ALL_ARABIC = PAGES.flatMap(p => [
  ...rows(p).map(r => r[0]),
  ...(p.kind === "mark" ? p.show.map(s => s[0]) : []),
]);

test("a cover, seven parts, and every page in both languages", () => {
  for (const f of ["title", "sub", "line", "where", "open"])
    for (const l of ["en", "najdi"]) assert.ok(COVER[f][l], `the cover's ${f}: ${l}`);
  assert.equal(PARTS.length, 7);
  assert.ok(PAGES.length > 90, `a big book, not a pamphlet — ${PAGES.length} pages`);
  assert.equal(new Set(PAGES.map(p => p.id)).size, PAGES.length, "two pages share an id");
  for (const part of PARTS) {
    for (const f of ["title", "sub", "blurb"])
      for (const l of ["en", "najdi"]) assert.ok(part[f][l], `part ${part.id}: ${f} in ${l}`);
    assert.ok(part.pages.length, `part ${part.id} has no pages`);
    assert.ok(hasPic(part.art), `part ${part.id}: no picture called ${part.art}`);
  }
  for (const l of ["en", "najdi"]) {
    assert.ok(END.title[l], `the last page's title: ${l}`);
    for (const line of END.lines) assert.ok(line[l], `the last page: ${l}`);
  }
  // the pages run in one order, numbered from one, and every one knows its part
  PAGES.forEach((p, i) => {
    assert.equal(p.n, i + 1, `${p.id} is numbered wrong`);
    assert.ok(PARTS.some(x => x.id === p.part), `${p.id} belongs to no part`);
  });
});

test("every letter of the alphabet gets its own page, in the order the site teaches them", () => {
  const taught = PAGES.filter(p => p.kind === "letter").map(p => p.char);
  assert.deepEqual(taught, ALPHABET, "the letter pages are not the alphabet in its own order");
  assert.equal(taught.length, 28);
  for (const p of PAGES.filter(x => x.kind === "letter")) {
    const l = LETTER[p.char];
    assert.ok(l, `${p.char} is not in data/letters.js`);
    for (const f of ["en", "najdi"]) assert.ok(l.sound[f], `${p.char}: how it sounds, in ${f}`);
    assert.equal(shapes(p.char, l.nonJoining).length, l.nonJoining ? 2 : 4, `${p.char}: wrong number of shapes`);
    assert.ok(p.words.length >= 2, `${p.char}: give him at least two words`);
    for (const [w] of p.words)
      assert.ok([...w].some(c => bare(c) === bare(p.char)), `${p.char}: "${w}" doesn't contain the letter`);
  }
});

// Five hundred words was the promise. Counted as a reader counts them: الـ and و are not words of their own,
// and بيتي is بيت — but تروحين and أروح are two things to learn, so they count twice.
test("five hundred words, no more", () => {
  const forms = new Set(ALL_ARABIC.flatMap(a => words(a).map(bare)));
  const ART = /^(وال|فال|بال|كال|لل|هال|ال)(?=..)/;
  const CLITIC = /^([وفبل])(?=...)/;
  const OWNER = /(كم|هم|ها|نا|ني|ي|ك|ه)$/;
  const lemma = w => {
    let x = w.replace(ART, "");
    for (let i = 0; i < 3; i++) {
      const c = x.replace(CLITIC, ""); if (c !== x && forms.has(c)) { x = c; continue; }
      const s = x.replace(OWNER, ""); if (s !== x && s.length > 1 && forms.has(s)) { x = s; continue; }
      break;
    }
    return x;
  };
  const lemmas = new Set([...forms].map(lemma));
  assert.ok(lemmas.size <= WORDS_PROMISED, `the book has grown to ${lemmas.size} words — it promised ${WORDS_PROMISED}`);
  assert.ok(lemmas.size > 400, `only ${lemmas.size} words — that is not enough to talk about a day`);
});

// Nothing in the word pages is Arabic I made up: every one of them is a word the plan already teaches
// (public/data/vocab.json, built from NAJDI-PLAN.md) or a name from the glossary.
test("every word he is taught comes from the plan", () => {
  const vocab = JSON.parse(readFileSync(new URL("../public/data/vocab.json", import.meta.url), "utf8"));
  const known = new Set();
  for (const s of vocab.stages) for (const t of s.topics) for (const e of t.entries) for (const w of words(e.ar)) known.add(bare(w));
  for (const g of GLOSSARY) for (const w of words(g.ar)) known.add(bare(w));
  const strays = [];
  for (const p of PAGES.filter(x => x.kind === "words" || x.kind === "letter")) {
    for (const [ar] of rows(p)) for (const w of words(ar)) if (!known.has(bare(w))) strays.push(`${p.id}: ${w} (in "${ar}")`);
  }
  assert.deepEqual(strays, [], `these are not in the plan's vocabulary:\n  ${strays.join("\n  ")}`);
});

test("the Arabic and the pronunciation spell the same word, letter for letter", () => {
  const bad = [];
  for (const [ar, say, , p] of ALL_ROWS) {
    if (!sameWord(ar, say)) bad.push(`${p.id}: "${ar}" / "${say}"`);
    if (sayWords(say).length !== words(ar).length) bad.push(`${p.id}: "${ar}" / "${say}" don't line up word for word`);
  }
  assert.deepEqual(bad, []);
});

test("every line is in both languages, and nothing from another dialect", () => {
  for (const [ar, say, en, p] of ALL_ROWS) {
    assert.match(ar, ARABIC, `${p.id}: "${ar}" should be Arabic`);
    assert.ok(say, `${p.id}: "${ar}" has no pronunciation`);
    assert.ok(en, `${p.id}: "${ar}" has no English`);
    assert.doesNotMatch(say, /[؀-ۿ]/, `${p.id}: "${say}" should be Latin`);
    assert.doesNotMatch(say, /q/i, `${p.id}: "${say}" writes ق as q`);
    for (const trap of TRAPS) assert.ok(!words(ar).includes(trap), `${p.id}: "${ar}" contains ${trap}`);
  }
});

test("the marks are written while he needs them, and gone once he doesn't", () => {
  for (const p of PAGES) {
    if (!rows(p).length) continue;
    const vowelled = VOWELLED.includes(p.part);
    for (const [ar] of rows(p))
      vowelled
        ? assert.match(ar, MARKS, `${p.id}: "${ar}" is in a vowelled part but carries no marks`)
        : assert.doesNotMatch(ar, MARKS, `${p.id}: "${ar}" is past the vowelled parts but still has marks`);
  }
});

// The colours are the whole reason a beginner can take a joined-up word apart. Two letters that touch and
// share a colour would undo that — so this walks every word in the book and checks each pair.
test("no two letters that ever touch share a colour", () => {
  const clash = new Set();
  for (const ar of ALL_ARABIC) {
    for (const w of words(ar)) {
      const letters = clusters(w).map(c => c.ch).filter(c => ARABIC.test(c) || "أإآء".includes(c));
      for (let i = 1; i < letters.length; i++) {
        const [a, b] = [letters[i - 1], letters[i]];
        if (a === b || SAME.some(s => s.includes(a) && s.includes(b))) continue; // one letter in two dresses
        if (!HUE[a] || !HUE[b]) continue;
        if (HUE[a] === HUE[b]) clash.add(`${a}${b} (colour ${HUE[a]}) in "${w}"`);
      }
    }
  }
  assert.deepEqual([...clash], [], `these pairs come out the same colour:\n  ${[...clash].join("\n  ")}`);
});

// Telling ب from ث from ن is the first thing a reader has to learn. If they came out the same colour, the
// colours would be teaching him the opposite of what he needs.
test("letters that look alike never share a colour", () => {
  const groups = ["بتثني", "جحخ", "دذ", "رز", "سش", "صض", "طظ", "عغ", "فق"];
  const same = [];
  for (const g of groups) for (const a of g) for (const b of g) if (a < b && HUE[a] === HUE[b]) same.push(`${a} and ${b}`);
  assert.deepEqual(same, []);
});

test("every letter has a colour, and the shapes that are really another letter share its one", () => {
  for (const c of ALPHABET) assert.ok(HUE[c], `${c} has no colour`);
  assert.equal(HUE["ة"], HUE["ت"], "ة is a ت wearing a hat");
  assert.equal(HUE["ى"], HUE["ي"], "ى is a ي");
  for (const c of "أإآ") assert.equal(HUE[c], HUE["ا"], `${c} belongs with the alif`);
  assert.ok(HUE["ء"], "the hamza has no colour");
});

test("every picture the book asks for is drawn, and nothing is drawn for nothing", () => {
  const asked = new Set(PARTS.map(p => p.art).concat("palm")); // "palm" closes the book
  for (const p of PAGES) {
    const items = p.kind === "letter" ? p.words : p.kind === "words" ? p.items : [];
    for (const [, , , name] of items) {
      if (!name) continue;
      if (name.startsWith("#") || name.startsWith("@")) continue; // a numeral or a colour swatch
      assert.ok(hasPic(name), `${p.id}: there is no picture called ${name}`);
      asked.add(name);
    }
  }
  assert.deepEqual(PIC_NAMES.filter(n => !asked.has(n)), [], "pictures nothing uses");
});

// The book has to get harder, or it is a reference and not a course: each part of the reading reads longer
// than the one before it, and inside a part each page is longer than the last.
test("the reading grows, part by part and page by page", () => {
  const len = p => p.lines.reduce((n, l) => n + l.ar.split(/\s+/).length, 0);
  // The messages are the exception: they are short on purpose, because that is what a message is.
  const reading = PARTS.filter(p => p.pages.every(x => x.lines) && p.id !== "talk");
  const averages = reading.map(p => p.pages.reduce((n, x) => n + len(x), 0) / p.pages.length);
  for (let i = 1; i < averages.length; i++)
    assert.ok(averages[i] > averages[i - 1],
      `${reading[i].id} (${averages[i].toFixed(1)} words a page) should read longer than ${reading[i - 1].id} (${averages[i - 1].toFixed(1)})`);
  for (const part of reading) {
    const lengths = part.pages.map(len);
    assert.deepEqual(lengths, [...lengths].sort((a, b) => a - b), `${part.id}: its pages are not in order of length`);
  }
});

// He reads the Ukrainian line, not the Latin one, so the key that explains it has to be in his own language
// as well as in English — a pronunciation key is the one thing you have to read in the language you think in.
test("the key at the front explains every letter, in English and in Ukrainian", () => {
  const key = PAGES.find(p => p.kind === "key");
  assert.ok(key, "the book opens without a pronunciation key");
  assert.equal(key.n, 2, "the key should be at the front, right after the first chapter opens");
  for (const l of ["en", "najdi"]) { assert.ok(key.title[l]); assert.ok(key.note[l]); }
  assert.ok(UA_KEY.length >= 18, `only ${UA_KEY.length} rows in the key`);
  for (const row of UA_KEY)
    for (const f of ["ua", "ar", "en", "uk", "ex"]) assert.ok(row[f], `${row.ua ?? "?"}: ${f} is missing`);
  for (const row of UA_KEY) {
    assert.match(row.ua, /^[Ѐ-ӿʹʼ ]+$/, `${row.ua} is not something the Ukrainian line can print`);
    assert.match(row.ar, /[ء-ي]/, `${row.ua}: ${row.ar} should be Arabic`);
    assert.match(row.uk, /[а-яіїєґ]/i, `${row.ua}: the Ukrainian line isn't Ukrainian`);
    assert.match(row.en, /[a-z]{3}/i, `${row.ua}: the English line isn't English`);
  }
  // the sounds a Ukrainian ear would otherwise collapse into one letter each have their own row
  for (const pair of ["ґ", "х", "ҳ", "г", "ғ", "ҫ", "ҙ", "сʹ", "тʹ", "ҙʹ", "ъ", "ʼ"])
    assert.ok(UA_KEY.some(r => r.ua === pair), `${pair} is not explained anywhere`);
  for (const f of ["en", "uk"]) assert.ok(UA_LENGTH[f], `the note about vowel length: ${f}`);
});

test("the messages are a real conversation — every line knows who said it", () => {
  for (const p of PAGES.filter(x => x.kind === "talk")) {
    assert.equal(p.who?.length, p.lines.length, `${p.id}: ${p.who?.length ?? 0} speakers for ${p.lines.length} lines`);
    for (const w of p.who) assert.ok(w === "me" || w === "her", `${p.id}: "${w}" is not a person`);
    assert.ok(new Set(p.who).size === 2, `${p.id}: only one of them is talking`);
  }
});

test("everything he reads is still flagged for her to check", () => {
  for (const p of PAGES.filter(x => x.kind === "text" || x.kind === "talk"))
    assert.ok(p.check, `${p.id} should be flagged "check with tutor"`);
});

test("the book's own words are on the site in both languages", () => {
  const keys = ["nav.book", "nav.bookShort", "nav.texts", "book.title", "book.open", "book.continue", "book.fromStart",
    "book.contents", "book.part", "book.pageOf", "book.read", "book.next", "book.back", "book.cover", "book.hint",
    "book.alone", "book.start", "book.middle", "book.end", "book.noJoin",
    "book.colLetter", "book.colArabic", "book.colHow", "book.colUk",
    "book.colourOn", "book.colourOff", "book.sayOn", "book.sayOff", "book.enOn", "book.enOff"];
  for (const k of keys) for (const l of ["en", "najdi"]) assert.ok(STRINGS[k]?.[l], `${k}: ${l}`);
});

test("the alphabet the book teaches is the alphabet the site teaches", () => {
  assert.deepEqual(ALPHABET, GROUPS.flatMap(g => g.letters.map(l => l.char)));
});
