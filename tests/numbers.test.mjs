// Numbers and time (public/js/data/numbers.js): spoken the way people say them, and matching the plan where it has them.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spoken, clockTime, arabicDigits, PLAN_NUMBERS, DAYS, MONTHS, HIJRI_MONTHS, NUMBER_PHRASES, TIME_PARTS } from "../public/js/data/numbers.js";

test("numbers are built the way they're spoken", () => {
  const cases = {
    0: "صفر", 2: "ثنين", 11: "احدعش", 21: "واحد وعشرين", 100: "مية", 125: "مية وخمسة وعشرين", 200: "ميتين", 300: "ثلاث مية",
    1000: "ألف", 2000: "ألفين", 2026: "ألفين وستة وعشرين", 3000: "ثلاث آلاف", 11000: "احدعش ألف", 100000: "مية ألف", 1000000: "مليون",
  };
  for (const [n, ar] of Object.entries(cases)) assert.equal(spoken(+n).ar, ar, `${n}`);
  assert.equal(spoken(125).say, "miya w khamsa w ʿishrīn");
  assert.equal(spoken(-1), null);
  for (let n = 0; n <= 1_000_000; n += n < 1000 ? 1 : 997) assert.ok(spoken(n)?.ar && spoken(n)?.say, `${n}`);
  assert.equal(arabicDigits(2026), "٢٠٢٦");
});

test("1–10, 20, 100 and 1000 are the plan's own words", () => {
  const plan = readFileSync(new URL("../NAJDI-PLAN.md", import.meta.url), "utf8");
  for (const n of PLAN_NUMBERS) {
    const s = spoken(n);
    assert.ok(plan.includes(s.ar) && plan.includes(s.say), `${n}: ${s.ar} ${s.say}`);
  }
  for (const d of DAYS) assert.ok(plan.includes(d.ar) && plan.includes(d.say), `${d.ar}`);
});

test("clock times", () => {
  assert.equal(clockTime(15, 40).ar, "الساعة أربع إلا ثلث العصر");
  assert.equal(clockTime(8, 30).ar, "الساعة ثمان ونص الصبح");
  assert.equal(clockTime(12, 0).ar, "الساعة اثنعش الظهر");
  assert.equal(clockTime(23, 45).ar, "الساعة اثنعش إلا ربع بالليل");
  for (let h = 0; h < 24; h++) for (let m = 0; m < 60; m += 5) assert.ok(clockTime(h, m).say, `${h}:${m}`);
});

test("days, months and phrases in three languages", () => {
  assert.equal(DAYS.length, 7);
  assert.equal(MONTHS.length, 12);
  assert.equal(HIJRI_MONTHS.length, 12);
  for (const x of [...DAYS, ...MONTHS, ...HIJRI_MONTHS, ...NUMBER_PHRASES, ...TIME_PARTS]) {
    for (const f of ["ar", "say", "en", "uk"]) assert.ok(x[f], `${x.ar}: ${f}`);
    assert.match(x.uk, /[Ѐ-ӿ]/, `${x.ar}: Ukrainian`);
  }
});
