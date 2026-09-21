import { test } from "node:test";
import assert from "node:assert/strict";
import { START, GOAL } from "../public/js/config.js";
import { addDays, weekdayMon } from "../public/js/core/dates.js";
import { TOTAL_DAYS, dayNumber, dateOfDay, phaseFor, planFor, dayStatus, streak, learnedLetters, lettersIn, scheduledGroup } from "../public/js/core/schedule.js";
import { PHASES, SCRIPT_DAYS } from "../public/js/data/plan.js";
import { ALL_LETTERS } from "../public/js/data/letters.js";
import { WORDS } from "../public/js/data/words.js";

test("Day 1 is Monday 21 September 2026; the plan runs to 31 December 2027", () => {
  assert.equal(START, "2026-09-21");
  assert.equal(weekdayMon(START), 0);
  assert.equal(dayNumber("2026-09-21"), 1);
  assert.equal(TOTAL_DAYS, 467);
  assert.equal(dateOfDay(TOTAL_DAYS), GOAL);
});

test("stages follow NAJDI-PLAN.md Part 3 with no gaps or overlaps", () => {
  assert.equal(PHASES[0].start, START);
  assert.equal(PHASES.at(-1).end, GOAL);
  for (let i = 1; i < PHASES.length; i++) assert.equal(addDays(PHASES[i - 1].end, 1), PHASES[i].start, PHASES[i].label);
  assert.equal(PHASES[0].end, "2026-10-04"); // Script: weeks 1–2
  assert.equal(PHASES[1].end, "2026-11-29"); // Stage 1: weeks 3–10
});

test("the two Script weeks are planned day by day; week 3 switches to the three blocks", () => {
  for (let n = 1; n <= 14; n++) {
    assert.ok(SCRIPT_DAYS[n], `day ${n}`);
    assert.equal(phaseFor(dateOfDay(n)).label.en, "Script");
    const ids = SCRIPT_DAYS[n].tasks.map(t => t.id);
    assert.equal(new Set(ids).size, ids.length, `duplicate task on day ${n}`);
  }
  assert.equal(SCRIPT_DAYS[15], undefined);
  assert.deepEqual(planFor(dateOfDay(15)).tasks.map(t => t.id), ["cards", "listening", "speaking"]);
  assert.equal(planFor(dateOfDay(15)).tasks.reduce((s, t) => s + t.min, 0), 90);
});

test("every day of the plan has tasks", () => {
  for (let n = 1; n <= TOTAL_DAYS; n++) assert.ok(planFor(dateOfDay(n)).tasks.length > 0, `day ${n}`);
});

test("letter groups: two days each, 28 letters", () => {
  assert.equal(ALL_LETTERS.length, 28);
  assert.deepEqual(Array.from({ length: 12 }, (_, i) => scheduledGroup(dateOfDay(i + 1))), [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);
});

test("every reading word uses real letters and is readable by Day 13", () => {
  const alphabet = new Set([...ALL_LETTERS.map(l => l.char), "ء", "ة", "ى", "ؤ", "ئ"]);
  const day13 = learnedLetters([], dateOfDay(13));
  for (const w of WORDS) {
    for (const c of lettersIn(w.ar)) assert.ok(alphabet.has(c), `${w.ar}: unexpected character ${c}`);
    assert.ok(lettersIn(w.ar).every(c => day13.has(c)), w.ar);
  }
  const day1 = learnedLetters([], START);
  assert.ok(WORDS.filter(w => lettersIn(w.ar).every(c => day1.has(c))).length >= 10, "at least 10 words on Day 1");
});

test("day status and streak", () => {
  const log = { "2026-09-21": { min: 70, tasks: [] }, "2026-09-22": { min: 10, tasks: [] } };
  assert.equal(dayStatus("2026-09-21", log, "2026-09-23"), "done");
  assert.equal(dayStatus("2026-09-22", log, "2026-09-23"), "partial");
  assert.equal(dayStatus("2026-09-23", log, "2026-09-23"), "open");
  assert.equal(dayStatus("2026-09-24", log, "2026-09-23"), "future");
  assert.equal(streak(log, "2026-09-23"), 2);
  assert.equal(streak(log, "2026-09-25"), 0);
});
