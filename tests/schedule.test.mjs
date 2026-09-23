import { test } from "node:test";
import assert from "node:assert/strict";
import { START, GOAL } from "../public/js/config.js";
import { addDays, weekdayMon } from "../public/js/core/dates.js";
import { TOTAL_DAYS, dayNumber, dateOfDay, phaseFor, planFor, dayStatus, streak, learnedLetters, lettersIn, scheduledGroup } from "../public/js/core/schedule.js";
import { PHASES, SCRIPT_DAYS } from "../public/js/data/plan.js";
import { ALL_LETTERS } from "../public/js/data/letters.js";
import { WORDS } from "../public/js/data/words.js";

test("Day 1 is Monday 21 September 2026; the written route runs to 30 June 2029", () => {
  assert.equal(START, "2026-09-21");
  assert.equal(weekdayMon(START), 0);
  assert.equal(dayNumber("2026-09-21"), 1);
  assert.equal(TOTAL_DAYS, 1014); // Day 1 to the end of the route to B1
  assert.equal(dateOfDay(TOTAL_DAYS), GOAL);
});

test("stages follow NAJDI-PLAN.md Part 3 with no gaps or overlaps", () => {
  assert.equal(PHASES[0].start, START);
  assert.equal(PHASES.at(-1).end, GOAL);
  // The course ends at B1, and every stage says which CEFR level it stands at.
  assert.equal(PHASES.at(-1).cefr, "B1");
  assert.deepEqual(PHASES.map(p => p.cefr), ["", "A1", "A1", "A2", "A2", "A2+", "B1 →", "B1"]);
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

// Statistics for a course measured in years (no deadline — 23 Sept 2026).
import { longestStreak, bestDay, byMonth, habit, stageNow, stageProgress, STAGE_GATE } from "../public/js/core/schedule.js";

const LOG = {
  "2026-09-21": { min: 60, tasks: [] },
  "2026-09-22": { min: 90, tasks: [] },
  "2026-09-23": { min: 30, tasks: [] },
  "2026-09-27": { min: 45, tasks: [] },
  "2026-10-01": { min: 0, tasks: [], speak: 3 },
};

test("the longest run of days ever, not just the one running", () => {
  assert.equal(longestStreak(LOG), 3);
  assert.equal(longestStreak({}), 0);
});

test("the best day, and months with what was done in them", () => {
  assert.deepEqual(bestDay(LOG), { date: "2026-09-22", min: 90 });
  const months = byMonth(LOG);
  assert.deepEqual(months.map(m => m.month), ["2026-09", "2026-10"]);
  assert.equal(months[0].min, 225);
  assert.equal(months[0].days, 4);
  assert.equal(months[1].days, 1, "a day of only speaking still counts");
});

test("the habit: days studied out of days since Day 1", () => {
  const h = habit(LOG, "2026-10-01");
  assert.equal(h.since, 11);
  assert.equal(h.days, 5);
  assert.equal(Math.round(h.average), 45);
});

test("a stage opens when the one before it is finished, whatever the date", () => {
  assert.equal(stageNow({ letters: 5, words: 900 }).label.en, "Script", "the letters come first");
  assert.equal(stageNow({ letters: 6, words: 0 }).label.en, "Stage 1");
  assert.equal(stageNow({ letters: 6, words: STAGE_GATE[2].words }).label.en, "Stage 2");
  assert.equal(stageNow({ letters: 6, words: 99999 }), PHASES.at(-1));
  const sp = stageProgress({ letters: 6, words: 260 });
  assert.equal(sp.kind, "words");
  assert.equal(sp.from, 200);
  assert.equal(sp.need, 320);
  assert.equal(sp.left, 60);
});
