// The hundred words for talking to Dima (public/js/data/hundred.js) and the Saudi voice files made from them.
//
// He learns these by ear, from a machine that reads exactly what it is given — so the marks on every word are
// the difference between learning her Arabic and learning a textbook's. Bare زين came out "zīn"; marked زَيْن
// comes out "zēn". That is what these checks are for, and why there are this many of them.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, statSync } from "node:fs";
import { HUNDRED, GROUPS, wordOf } from "../public/js/data/hundred.js";
import { HER_WORDS } from "../public/js/data/hers.js";
import { STRINGS } from "../public/js/i18n/strings.js";
import { sameWord } from "./spelling.mjs";

const MARK = /[ً-ْ]/;                    // fatḥa … sukūn, and the tanwīns
const MARKS_G = /[ً-ْٰـ]/g;
const LETTER = /[ء-يگ]/;            // Arabic letters, plus the گ the engine is given
const TRAPS = ["إزيك", "شو", "فين", "عايز", "بدي", "دلوقتي", "هلق", "كويس", "ليه", "كمان", "مش", "دحين", "إيش",
  "ازاي", "هيك", "منيح", "بحبك", "كتير", "هلأ", "نحن", "وايد", "چذي", "مب", "أحبچ"];
const plain = s => String(s).replace(MARKS_G, "").replace(/[؟?!.,،…]/g, "").replace(/\s+/g, " ").trim();

test("a hundred words, ten groups, both languages, one file each", () => {
  assert.equal(HUNDRED.length, 100);
  assert.equal(GROUPS.length, 10);
  assert.equal(new Set(HUNDRED.map(w => w.file)).size, 100, "two words share a file name");
  for (const g of GROUPS) {
    for (const f of ["title", "sub"]) for (const l of ["en", "najdi"]) assert.ok(g[f][l], `${g.id}: ${f} in ${l}`);
    assert.ok(g.words.length, `${g.id} is empty`);
  }
  for (const w of HUNDRED) {
    for (const f of ["ar", "said", "show", "say", "en", "file"]) assert.ok(w[f], `${w.ar}: ${f} is missing`);
    assert.match(w.ar, LETTER, `${w.ar} should be Arabic`);
    assert.doesNotMatch(w.say, /[؀-ۿ]/, `${w.say} should be Latin`);
    assert.equal(wordOf(w.file).ar, w.ar);
  }
});

// Nothing here is Arabic I made up: every word is one the plan already teaches, or one she taught him.
test("every word comes from the plan or from her", () => {
  const vocab = JSON.parse(readFileSync(new URL("../public/data/vocab.json", import.meta.url), "utf8"));
  const known = new Set();
  const add = ar => String(ar).split(" / ").forEach(p => known.add(plain(p)));
  for (const s of vocab.stages) for (const t of s.topics) for (const e of t.entries) add(e.ar);
  for (const w of HER_WORDS) add(w.ar);
  const strays = HUNDRED.filter(w => !known.has(plain(w.ar))).map(w => w.ar);
  assert.deepEqual(strays, [], `not in the plan: ${strays.join(" · ")}`);
});

// The marks may not quietly change the word: take them off and you must be back at the real spelling.
test("the marked spelling is the same word as the plain one", () => {
  for (const w of HUNDRED)
    assert.equal(plain(w.show), plain(w.ar), `"${w.show}" is not "${w.ar}" with marks on it`);
});

// A bare letter is a letter the engine guesses at, and it guesses فصحى. Every consonant carries a mark —
// except the ones that never do: ا, the long و/ي, ة, the hamza seats, and the last letter of a word.
test("every consonant is marked — no letter is left for the voice to guess", () => {
  const NEVER = "اأإآةىء";
  const bad = [];
  for (const w of HUNDRED) {
    for (const token of w.said.split(/\s+/)) {
      const chars = [...token];
      chars.forEach((c, i) => {
        if (!LETTER.test(c) || NEVER.includes(c)) return;
        if (i === chars.length - 1) return;                       // a word may stop unmarked
        const next = chars[i + 1] ?? "";
        if (MARK.test(next)) return;                              // marked
        if ("وي".includes(c) && MARK.test(chars[i - 1] ?? "")) return; // a long vowel rides the mark before it
        if (c === "ل" && token.startsWith("ال")) return;          // the ل of الـ
        if (token.includes("لله")) return;                        // الله is written the way it is written
        bad.push(`${w.ar}: "${token}" leaves ${c} bare`);
      });
    }
  }
  assert.deepEqual(bad, [], bad.join("\n"));
});

// The two sounds a formal reading gets wrong, and the whole reason the marks are here: she says ē where the
// book writes ay, and ō where it writes aw. Written that way, a Saudi voice lands on her sound.
test("ē is written ay and ō is written aw", () => {
  const EXCEPT = { "إيه": "إيه is written with a kasra; أيه would not look like the word she writes" };
  const bad = [];
  for (const w of HUNDRED) {
    if (EXCEPT[w.ar]) continue;
    const m = w.said.replace(/ّ/g, ""); // a shadda may sit inside the cluster; it changes nothing here
    if (/ē/.test(w.say) && !/َيْ/.test(m)) bad.push(`${w.ar} (${w.say}) should carry َيْ: "${w.said}"`);
    if (/ō/.test(w.say) && !/َوْ/.test(m)) bad.push(`${w.ar} (${w.say}) should carry َوْ: "${w.said}"`);
  }
  assert.deepEqual(bad, [], bad.join("\n"));
});

// ق is the letter this machine cannot say. She says gahwa; it reads qahwa, which is فصحى. So the engine is
// given گ — and he is never shown it.
test("the g she says is written گ for the voice and ق for him", () => {
  for (const w of HUNDRED) {
    assert.ok(!w.show.includes("گ"), `${w.ar}: he is being shown a گ`);
    if (/\bg/.test(w.say.replace(/gh/g, "")) && w.ar.includes("ق"))
      assert.ok(w.said.includes("گ") && !w.said.includes("ق"), `${w.ar} (${w.say}) still has a ق for the voice`);
    if (w.said.includes("گ")) assert.ok(w.ar.includes("ق"), `${w.ar}: a گ that isn't a ق`);
  }
});

test("the Arabic and the pronunciation are the same word, letter for letter", () => {
  const bad = HUNDRED.filter(w => !sameWord(w.ar, w.say)).map(w => `${w.ar} / ${w.say}`);
  assert.deepEqual(bad, []);
});

test("nothing from another dialect, and ق is never written q", () => {
  for (const w of HUNDRED) {
    assert.doesNotMatch(w.say, /q/i, `${w.ar}: "${w.say}" writes ق as q`);
    for (const trap of TRAPS) assert.ok(!plain(w.ar).split(" ").includes(trap), `${w.ar} contains ${trap}`);
  }
});

// The "you" he says to her is -ik. -ak is what she says to him, and he must never learn it the wrong way
// round — so a fatḥa may never be the last thing before a final ك, and no pronunciation may end in -ak.
test("no word ends in -ak: he is always speaking to her", () => {
  for (const w of HUNDRED) {
    const last = w.said.split(/\s+/).at(-1) ?? "";
    if (!/ك[ْ]?$/.test(last)) continue;
    const before = last.replace(/ك[ْ]?$/, "").at(-1) ?? "";
    assert.notEqual(before, "َ", `${w.ar}: a fatḥa before the ك makes it -ak, not -ik: "${w.said}"`);
    assert.doesNotMatch(w.say, /ak\??$/, `${w.ar}: "${w.say}" ends in -ak`);
  }
});

test("every word has its voice file, and the page is named in both languages", () => {
  const dir = new URL("../public/audio/saudi/", import.meta.url);
  const missing = HUNDRED.filter(w => !existsSync(new URL(w.file + ".mp3", dir))).map(w => w.file);
  assert.deepEqual(missing, [], `no voice file yet: ${missing.length} of 100`);
  for (const w of HUNDRED)
    assert.ok(statSync(new URL(w.file + ".mp3", dir)).size > 8000, `${w.file}.mp3 is too small to be a word`);
  for (const k of ["nav.hundred", "hundred.title", "hundred.sub", "hundred.howTitle", "hundred.how", "hundred.count"])
    for (const l of ["en", "najdi"]) assert.ok(STRINGS[k]?.[l], `${k}: ${l}`);
});
