// Learning to read, from zero (public/js/data/read.js). The whole promise of this page is that he is never
// shown a letter he hasn't met yet, so that is the first thing checked — and then that the Arabic and the
// pronunciation really do spell the same word, because he learns the sounds from them.
import { test } from "node:test";
import assert from "node:assert/strict";
import { READS, READ_LINES, STEPS } from "../public/js/data/read.js";
import { STRINGS } from "../public/js/i18n/strings.js";
import { lettersIn } from "../public/js/core/schedule.js";
import { GROUPS } from "../public/js/data/letters.js";
import { tokens, sayWords } from "../public/js/core/gloss.js";

const ARABIC = /[ء-ي]/;
const MARKS = /[ً-ْ]/;
const VOWELLED = 6; // steps 1–6 carry their vowel marks; 7–10 do without, like real writing
const TRAPS = ["إزيك", "شو", "فين", "عايز", "بدي", "دلوقتي", "هلق", "كويس", "ليه", "كمان", "مش", "دحين", "إيش",
  "ازاي", "هيك", "منيح", "بحبك", "كتير", "هلأ", "نحن", "وايد", "چذي", "مب", "أحبچ"];
const allowedAt = n => new Set(STEPS.filter(s => s.n <= n).flatMap(s => [...s.add]));
const words = ar => tokens(ar).filter(t => t.w).map(t => t.w);

// --- the Arabic spelling and the pronunciation have to be the same word ---
//  agree with the pronunciation, letter for letter?
// Only the hard consonants are compared: alif/waw/ya as long vowels, hamza and the ال of a sun letter behave
// differently in speech, so they are ignored on both sides.
const SOUND = { "ب":"b","ت":"t","ث":"th","ج":"j","ح":"H","خ":"kh","د":"d","ذ":"dh","ر":"r","ز":"z","س":"s",
  "ش":"sh","ص":"S","ض":"Z","ط":"T","ظ":"Z","ع":"3","غ":"gh","ف":"f","ق":"g","ك":"k","ل":"l","م":"m","ن":"n","ه":"h" };
const SUN = "تثدذرزسشصضطظلن";
// الـ is the article only at the start of a word — قالت is not "qa + al + t". و ب ك ل ع ف may sit in front of it.
const ART = new RegExp(`(^|[\\sوبكلعف])ال(?=[${SUN}])`, "gu");

const arSkeleton = ar => [...ar.replace(/ا?ً/g, "ن").replace(/[ً-ْٰـ]/g, "").replace(ART, "$1ا")]
  .flatMap(c => (SOUND[c] ? [SOUND[c]] : []));

const saySkeleton = say => {
  const s = String(say).toLowerCase().replace(/[āīūēō]/g, "")
    .replace(/ḥ/g, "H").replace(/ṣ/g, "S").replace(/[ẓḍ]/g, "Z").replace(/ṭ/g, "T")
    .replace(/ʿ/g, "3").replace(/[ʾ'’ʼ]/g, "").replace(/ġ/g, "gh").replace(/ž/g, "j").replace(/v/g, "f")
    .replace(/[^a-z3HSZT]/g, "");
  const out = [];
  for (let i = 0; i < s.length; ) {
    if ("HSZT3".includes(s[i])) { out.push(s[i]); i++; continue; }
    const two = s.slice(i, i + 2);
    if (["th", "kh", "dh", "sh", "gh"].includes(two)) { out.push(two); i += 2; continue; }
    if ("aeiouyw".includes(s[i])) { i++; continue; }
    out.push(s[i] === "q" ? "g" : s[i]); i++;
  }
  return out;
};

const collapse = a => a.filter((x, i) => x !== a[i - 1]);              // شدّة writes one letter, the Latin two
const expand = a => a.flatMap(x => (x.length === 2 ? [x[0], x[1]] : [x]));
const norm = a => collapse(expand(collapse(a)));
const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

// ة is silent at the end of a phrase and sounded "t" before the next word (شجرة السعودية → shajarat as-...).
// A line can hold several, each going its own way, so every combination is tried.
const variants = ar => {
  const at = [...ar].flatMap((c, i) => (c === "ة" ? [i] : []));
  if (!at.length) return [ar];
  if (at.length > 8) return [ar];
  const out = [];
  for (let m = 0; m < 1 << at.length; m++) {
    const chars = [...ar];
    at.forEach((i, k) => { if (m & (1 << k)) chars[i] = "ت"; });
    out.push(chars.join(""));
  }
  return out;
};

const sameWord = (ar, say) => {
  const S = norm(saySkeleton(say));
  return variants(ar).some(v => same(norm(arSkeleton(v)), S));
};

test("a hundred and forty texts, ten steps, unique ids", () => {
  assert.equal(READS.length, 140);
  assert.equal(STEPS.length, 10);
  assert.equal(new Set(READS.map(r => r.id)).size, READS.length);
  assert.equal(new Set(READ_LINES.map(l => l.id)).size, READ_LINES.length);
  for (const s of STEPS) {
    assert.ok(READS.some(r => r.step === s.n), `step ${s.n} has no texts`);
    for (const f of ["en", "najdi"]) {
      assert.ok(s.title[f], `step ${s.n}: title ${f}`);
      assert.ok(s.note[f], `step ${s.n}: note ${f}`);
    }
  }
});

// This is the point of the whole page: the letters grow with the alphabet he is being taught, and nothing
// ever runs ahead of it. Break this and he meets a letter he cannot read.
test("no text uses a letter its step hasn't taught yet", () => {
  const bad = [];
  for (const r of READS) {
    const ok = allowedAt(r.step);
    for (const l of r.lines) {
      const stray = [...new Set(lettersIn(l.ar))].filter(c => ARABIC.test(c) && !ok.has(c));
      if (stray.length) bad.push(`${r.id} (step ${r.step}): "${l.ar}" uses ${stray.join(" ")}`);
    }
    const strayT = [...new Set(lettersIn(r.title.najdi))].filter(c => ARABIC.test(c) && !ok.has(c));
    if (r.step <= 6 && strayT.length) bad.push(`${r.id}: its title uses ${strayT.join(" ")}`);
  }
  assert.deepEqual(bad, []);
});

test("the steps together are exactly the alphabet the site teaches, in its order", () => {
  const ladder = STEPS.flatMap(s => [...s.add]);
  const alphabet = GROUPS.flatMap(g => g.letters.map(l => l.char));
  assert.deepEqual(ladder.filter(c => alphabet.includes(c)), alphabet, "same letters, same order");
  assert.deepEqual([...new Set(ladder)], ladder, "no letter is introduced twice");
  // by the last vowelled step every letter is available
  const last = allowedAt(VOWELLED);
  for (const c of alphabet) assert.ok(last.has(c), `${c} is never taught`);
});

test("every line: both languages, and the pronunciation lines up word for word", () => {
  for (const r of READS) {
    assert.ok(r.lines.length >= 5, `${r.id}: at least five lines`);
    for (const l of r.lines) {
      for (const f of ["ar", "say", "en"]) assert.ok(l[f], `${r.id}: ${f} is missing`);
      assert.match(l.ar, ARABIC, `${r.id}: "${l.ar}" should be Arabic`);
      assert.doesNotMatch(l.say, /[؀-ۿ]/, `${r.id}: "${l.say}" should be Latin`);
      assert.equal(sayWords(l.say).length, words(l.ar).length, `${r.id}: "${l.ar}" / "${l.say}" don't line up`);
    }
  }
});

test("the Arabic and the pronunciation spell the same word, letter for letter", () => {
  const bad = READ_LINES.filter(l => !sameWord(l.ar, l.say))
    .map(l => `"${l.ar}" / "${l.say}" — ${arSkeleton(l.ar).join(".")} vs ${saySkeleton(l.say).join(".")}`);
  assert.deepEqual(bad, []);
});

test("vowel marks while he needs them, and none once he doesn't", () => {
  for (const r of READS)
    for (const l of r.lines)
      r.step <= VOWELLED
        ? assert.match(l.ar, MARKS, `${r.id}: "${l.ar}" is in a vowelled step but has no marks`)
        : assert.doesNotMatch(l.ar, MARKS, `${r.id}: "${l.ar}" is past the vowelled steps but still has marks`);
});

test("nothing from another dialect, and it's all flagged for her to check", () => {
  for (const r of READS) {
    assert.ok(r.check, `${r.id} should be flagged "check with tutor"`);
    for (const l of r.lines) {
      assert.ok(l.check, `${r.id}: a line is not flagged`);
      assert.doesNotMatch(l.say, /q/i, `${r.id}: "${l.say}" writes ق as q`);
      for (const trap of TRAPS) assert.ok(!words(l.ar).includes(trap), `${r.id}: "${l.ar}" contains ${trap}`);
    }
  }
});

test("the texts get longer as the steps go up", () => {
  const avg = n => {
    const lines = READS.filter(r => r.step === n).flatMap(r => r.lines);
    return lines.reduce((t, l) => t + words(l.ar).length, 0) / lines.length;
  };
  assert.ok(avg(1) < avg(5), "step 5 should say more than step 1");
  assert.ok(avg(5) < avg(9), "step 9 should say more than step 5");
});

test("the page and its awards are named in both languages", () => {
  const keys = ["nav.read", "nav.readGroup", "read.title", "read.sub", "read.step", "read.total",
    "read.markRead", "read.readIt", "read.hideEn", "read.showEn", "read.hideSay", "read.showSay",
    "read.flow", "read.byLine", "read.howTitle", "read.how1", "read.how2", "read.how3", "read.steps", "read.allRead",
    "badge.read1", "badge.read1.sub", "badge.read25", "badge.read25.sub", "badge.readAll", "badge.readAll.sub"];
  for (const k of keys) for (const l of ["en", "najdi"]) assert.ok(STRINGS[k]?.[l], `${k}: ${l}`);
});
