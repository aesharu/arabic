// Turns a calendar date into "where am I in the plan" — day number, phase, tasks, status.
import { START, GOAL, DAILY_GOAL_MIN } from "../config.js";
import { diffDays, addDays, todayKey } from "./dates.js";
import { PHASES, SCRIPT_DAYS } from "../data/plan.js";
import { GROUPS } from "../data/letters.js";

export const TOTAL_DAYS = diffDays(START, GOAL) + 1;
export const dayNumber = date => diffDays(START, date) + 1; // START is Day 1
export const dateOfDay = n => addDays(START, n - 1);
export const weekNumber = date => Math.floor((dayNumber(date) - 1) / 7) + 1;

export function phaseFor(date) {
  if (date < START) return null;
  return PHASES.find(p => date >= p.start && date <= p.end) ?? PHASES.at(-1);
}

const LANGS = ["en", "uk", "najdi", "msa"];
const byLang = fn => Object.fromEntries(LANGS.map(l => [l, fn(l)]));

// "Script" / "Stage 1 · Core" — in every language: { en, uk, najdi, msa }
export const phaseTitle = p => byLang(l => (p.label[l] === p.name[l] ? p.name[l] : `${p.label[l]} · ${p.name[l]}`));
const GOAL_PREFIX = { en: "Goal of this stage", uk: "Мета етапу", najdi: "هدف المرحلة", msa: "هدف المرحلة" };

// ---------- Stages, opened by what you have done ----------
// 23 Sept 2026: the fifteen-month deadline is gone — Arabic takes as long as it takes. A stage now opens when
// the one before it is finished, not on a date: the Script stage when all six letter groups are marked done,
// every later stage when that stage's word count from the plan is learned (the same "learned" the Word list
// badges use). The dates in NAJDI-PLAN.md stay as the written route (phaseFor, the Plan page), not as a clock.
export const STAGE_GATE = {
  1: { letters: GROUPS.length }, // Script: the six letter groups
  2: { words: 200 }, // Stage 1 · Core: 150 words + 50 phrases
  3: { words: 320 }, // Stage 2 · Daily life
  4: { words: 500 }, // Stage 3 · Talking to her
  5: { words: 750 }, // Stage 4 · Her words
  6: { words: 1000 }, // Stage 5 · Her words, deeper
};

// progress: { letters: groups marked done, words: words learned, days: days actually studied }
export function stageNow({ letters = 0, words = 0 } = {}) {
  if (letters < STAGE_GATE[PHASES[0].id].letters) return PHASES[0];
  return PHASES.slice(1).find(p => words < STAGE_GATE[p.id].words) ?? PHASES.at(-1);
}

// Where you are inside the stage you're on, and what finishes it.
export function stageProgress(progress = {}) {
  const phase = stageNow(progress);
  const i = PHASES.indexOf(phase);
  const gate = STAGE_GATE[phase.id];
  const kind = gate.letters ? "letters" : "words";
  const need = gate.letters ?? gate.words;
  const from = kind === "words" ? STAGE_GATE[PHASES[i - 1]?.id]?.words ?? 0 : 0;
  const done = Math.max(from, Math.min(need, (kind === "letters" ? progress.letters : progress.words) ?? 0));
  return { phase, next: PHASES[i + 1] ?? null, kind, done, need, from, left: need - done, pct: need > from ? ((done - from) / (need - from)) * 100 : 100 };
}

// Which of the plan's fourteen Script days to show: one step for each day actually studied, never sitting on a
// letter group already marked done.
function scriptStep({ days = 0, done = [] }) {
  let step = Math.min(14, Math.max(1, days + 1));
  while (step < 14 && done.includes(SCRIPT_DAYS[step].group)) step++;
  return step;
}

// What to study. With `progress` the stage follows what you've done; without it, the written route by date.
export function planFor(date, progress = null) {
  const phase = progress ? stageNow(progress) : phaseFor(date);
  if (!phase) return null;
  const n = dayNumber(date);
  const day = phase === PHASES[0] ? SCRIPT_DAYS[progress ? scriptStep(progress) : n] : progress ? null : SCRIPT_DAYS[n];
  return day
    ? { n, phase, focus: day.focus, group: day.group, tasks: day.tasks }
    : { n, phase, focus: byLang(l => `${GOAL_PREFIX[l]}: ${phase.canDo[l]}`), group: null, tasks: phase.routine };
}

const isActive = e => !!e && (e.min > 0 || e.tasks?.length > 0 || e.quiz?.total > 0 || e.cards?.r > 0 || e.speak > 0 || e.write > 0);

export const allTasksTicked = (date, e) => {
  const tasks = planFor(date).tasks;
  return tasks.length > 0 && tasks.every(t => e?.tasks?.includes(t.id));
};

// "done" = all tasks ticked or the daily minutes goal reached.
export function dayStatus(date, log, today = todayKey()) {
  if (date < START) return "before";
  if (date > today) return "future";
  const e = log[date];
  const allTicked = allTasksTicked(date, e);
  if (allTicked || (e?.min ?? 0) >= DAILY_GOAL_MIN) return "done";
  if (isActive(e)) return "partial";
  return date === today ? "open" : "missed";
}

// Consecutive days with any study, ending today (or yesterday, if today hasn't started yet).
export function streak(log, today = todayKey()) {
  let d = isActive(log[today]) ? today : addDays(today, -1);
  let n = 0;
  while (d >= START && isActive(log[d])) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}

export function totals(log) {
  const days = Object.values(log).filter(isActive);
  const sum = f => days.reduce((n, e) => n + (f(e) || 0), 0);
  return {
    days: days.length,
    minutes: sum(e => e.min),
    tasks: sum(e => e.tasks?.length),
    quizRight: sum(e => e.quiz?.right),
    quizTotal: sum(e => e.quiz?.total),
    cardAnswers: sum(e => e.cards?.r),
    spoken: sum(e => e.speak), // phrases said out loud (views/speak.js)
    written: sum(e => e.write), // words typed in Arabic (views/write.js)
  };
}

// Heat level of a day for the calendar: 0 nothing · 1 some · 2 30+ min · 3 goal met · 4 90+ min.
export function heatLevel(entry, allTicked) {
  const min = entry?.min ?? 0;
  if (min >= 90) return 4;
  if (min >= DAILY_GOAL_MIN || allTicked) return 3;
  if (min >= 30) return 2;
  return isActive(entry) ? 1 : 0;
}

// Letter group the schedule says you're on today (0–5), or 5 once the alphabet is finished.
export function scheduledGroup(date = todayKey()) {
  const n = dayNumber(date);
  if (n < 1) return 0;
  return Math.min(GROUPS.length - 1, Math.floor((n - 1) / 2));
}

// Letters you should know by now: every group up to today's, plus any you marked done early.
// The extras (ء ة ى and hamza seats) unlock on Day 13 or once all six groups are marked done.
export function learnedLetters(done, date = todayKey()) {
  const groups = new Set(done);
  for (let g = 0; g <= scheduledGroup(date); g++) groups.add(g);
  const letters = new Set([...groups].flatMap(g => GROUPS[g].letters.map(l => l.char)));
  if (dayNumber(date) >= 13 || groups.size === GROUPS.length) ["ء", "ة", "ى", "ؤ", "ئ"].forEach(c => letters.add(c));
  return letters;
}

// Vowel marks, spaces and punctuation are not letters to learn.
const NOT_LETTERS = /[\u064B-\u0652\u0670\s؟،…/?.!]/g;
const SEATS = { "أ": "ا", "إ": "ا", "آ": "ا" };
export const lettersIn = word => [...word.replace(NOT_LETTERS, "")].map(c => SEATS[c] ?? c);
