// Marking what he types in Arabic (core/arabic.js): forgiving about what isn't a spelling mistake,
// strict about the letters themselves, and clear about what he left out.
import { test } from "node:test";
import assert from "node:assert/strict";
import { bare, mark, diff, KEYS } from "../public/js/core/arabic.js";

test("the exact spelling is right", () => {
  assert.equal(mark("قهوة", "قهوة"), "right");
  assert.equal(mark("  قهوة ", "قهوة"), "right"); // spaces around it don't matter
  assert.equal(mark("كيفك؟", "كيفك؟"), "right");
});

test("what he can't be expected to type is forgiven, and named as such", () => {
  assert.equal(mark("قهوه", "قهوة"), "close"); // ه for ة
  assert.equal(mark("انا", "أنا"), "close"); // no hamza
  assert.equal(mark("علي", "على"), "close"); // ي for ى
  assert.equal(mark("كيفك", "كيفك؟"), "right"); // the question mark isn't a letter
  assert.equal(mark("قَهوة", "قهوة"), "right"); // vowel marks are ignored on both sides
});

test("a different word is wrong", () => {
  assert.equal(mark("قهو", "قهوة"), "wrong");
  assert.equal(mark("بيت", "بنت"), "wrong");
  assert.equal(mark("", "قهوة"), "empty");
});

test("the letters he left out are the ones marked", () => {
  const d = diff("كتب", "كتاب");
  assert.deepEqual(d.letters.map(l => l.ch), ["ك", "ت", "ا", "ب"]);
  assert.deepEqual(d.letters.filter(l => l.kind === "missing").map(l => l.ch), ["ا"]);
  assert.equal(d.extra, 0);
});

test("letters that don't belong are counted, not marked on the answer", () => {
  const d = diff("قهوةز", "قهوة");
  assert.equal(d.extra, 1);
  assert.ok(d.letters.every(l => l.kind === "same"));
});

test("a perfect answer marks nothing", () => {
  const d = diff("بيت", "بيت");
  assert.ok(d.letters.every(l => l.kind === "same"));
  assert.equal(d.extra, 0);
});

test("bare() folds the letters that sound the same together", () => {
  assert.equal(bare("أنا"), bare("انا"));
  assert.equal(bare("قهوة"), bare("قهوه"));
  assert.notEqual(bare("بيت"), bare("بنت"));
});

test("the on-screen keyboard has all 28 letters, in alphabet order", () => {
  const flat = KEYS.flat();
  const alphabet = [..."ابتثجحخدذرزسشصضطظعغفقكلمنهوي"];
  for (const letter of alphabet) assert.ok(flat.includes(letter), `the keyboard is missing ${letter}`);
  const positions = alphabet.map(l => flat.indexOf(l));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b), "the letters should stay in alphabet order");
});

// A day spent only speaking or typing still counts as a day studied.
import { totals, streak } from "../public/js/core/schedule.js";
test("speaking or typing makes the day count", () => {
  const log = { "2026-09-21": { min: 0, tasks: [], speak: 4 }, "2026-09-22": { min: 0, tasks: [], write: 6 } };
  const t = totals(log);
  assert.equal(t.days, 2);
  assert.equal(t.spoken, 4);
  assert.equal(t.written, 6);
  assert.equal(streak(log, "2026-09-22"), 2);
});
