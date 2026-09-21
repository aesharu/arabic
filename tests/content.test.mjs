// Every Arabic word on the site must come from NAJDI-PLAN.md, spelled exactly the same,
// and must carry the "check with tutor" flag exactly when the plan marks it ⚠.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PHRASES } from "../public/js/data/phrases.js";
import { WORDS } from "../public/js/data/words.js";
import { GROUPS } from "../public/js/data/letters.js";
import { VOWEL_SECTIONS } from "../public/js/data/vowels.js";
import { SCRIPT_DAYS, PHASES } from "../public/js/data/plan.js";

const planLines = readFileSync(new URL("../NAJDI-PLAN.md", import.meta.url), "utf8").split("\n");
const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// Match whole words only, so من doesn't match inside منهو and "min" doesn't match inside "minhu".
const wholeAr = s => new RegExp(`(?<![\\u0621-\\u064A])${escape(s)}(?![\\u0621-\\u064A])`);
const wholeLatin = s => new RegExp(`(?<!\\p{L})${escape(s)}(?!\\p{L})`, "u");

// A word's own table row ("| من | min | from |") wins over lines that merely mention it inside a longer phrase.
function planRows(item) {
  const a = wholeAr(item.ar), t = wholeLatin(item.tr);
  const mentions = planLines.filter(l => a.test(l) && t.test(l));
  const own = mentions.filter(l => l.split("|")[1]?.trim() === item.ar);
  return own.length ? own : mentions;
}

const items = [
  ...PHRASES.map(p => ({ ...p, kind: "phrase" })),
  ...WORDS.filter(w => w.src !== "alphabet").map(w => ({ ...w, kind: "word" })),
];

for (const item of items) {
  test(`${item.kind} ${item.ar} (${item.tr}) matches NAJDI-PLAN.md`, () => {
    const rows = planRows(item);
    assert.ok(rows.length > 0, `"${item.ar}" with "${item.tr}" not found on any line of the plan`);
    const flaggedInPlan = rows.some(l => l.includes("⚠"));
    assert.equal(!!item.check, flaggedInPlan, flaggedInPlan ? "plan marks this ⚠ — add check: true" : "plan doesn't mark this ⚠ — remove check");
  });
}

test("three phrases on each of the 14 Script days", () => {
  for (let d = 1; d <= 14; d++) assert.equal(PHRASES.filter(p => p.day === d).length, 3, `day ${d}`);
});

// The rule from CLAUDE.md: every word and phrase in Najdi (ar + tr), MSA, English and Ukrainian;
// every other text in English and Ukrainian.
const both = (v, what) => {
  assert.ok(v && typeof v === "object", `${what}: needs { en, uk }`);
  assert.ok(v.en?.trim() && v.uk?.trim(), `${what}: English or Ukrainian missing`);
};
const four = (item, what) => {
  for (const f of ["ar", "tr", "msa", "en", "uk"]) assert.ok(item[f]?.trim(), `${what}: "${f}" missing`);
  assert.match(item.msa, /[\u0600-\u06FF]/, `${what}: MSA must be in Arabic script`);
  assert.match(item.uk, /[\u0400-\u04FF]/, `${what}: Ukrainian must be in Cyrillic`);
};

test("every word and phrase is in all four languages", () => {
  for (const p of PHRASES) {
    four(p, `phrase ${p.ar}`);
    if (p.note) both(p.note, `phrase ${p.ar} note`);
    if (p.check) both(p.checkNote, `phrase ${p.ar} checkNote`);
  }
  for (const w of WORDS) {
    four(w, `word ${w.ar}`);
    if (w.check) both(w.checkNote, `word ${w.ar} checkNote`);
  }
});

test("every letter, vowel row and plan text is in English and Ukrainian", () => {
  for (const g of GROUPS) {
    both(g.title, "group title");
    both(g.note, "group note");
    for (const l of g.letters) {
      both(l.sound, `${l.char} sound`);
      four(l.example, `${l.char} example`);
      if (l.najdi) both(l.najdi, `${l.char} Najdi note`);
      if (l.check) both(l.checkNote, `${l.char} checkNote`);
    }
  }
  for (const s of VOWEL_SECTIONS) {
    both(s.title, "vowel section");
    both(s.intro, "vowel intro");
    s.rows.forEach(r => both(r.text, `vowel ${r.ar}`));
  }
  for (const [n, d] of Object.entries(SCRIPT_DAYS)) {
    both(d.focus, `day ${n} focus`);
    d.tasks.forEach(task => both(task.text, `day ${n} task ${task.id}`));
  }
  for (const p of PHASES) {
    for (const f of ["label", "name", "when", "words", "canDo"]) both(p[f], `stage ${p.id} ${f}`);
    if (p.note) both(p.note, `stage ${p.id} note`);
    p.routine.forEach(task => both(task.text, `stage ${p.id} ${task.id}`));
    p.weekly.forEach(w => both(w, `stage ${p.id} weekly`));
  }
});

test("no duplicate reading words", () => {
  const seen = WORDS.map(w => w.ar);
  assert.equal(new Set(seen).size, seen.length);
});
