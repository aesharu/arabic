// Every Arabic word on the site must come from NAJDI-PLAN.md, spelled exactly the same,
// and must carry the "check with tutor" flag exactly when the plan marks it ⚠.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PHRASES } from "../public/js/data/phrases.js";
import { WORDS } from "../public/js/data/words.js";

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

test("every phrase and word has an English meaning; phrases have Ukrainian", () => {
  for (const p of PHRASES) assert.ok(p.en && p.ua, p.ar);
  for (const w of WORDS) assert.ok(w.en, w.ar);
});

test("no duplicate reading words", () => {
  const seen = WORDS.map(w => w.ar);
  assert.equal(new Set(seen).size, seen.length);
});
