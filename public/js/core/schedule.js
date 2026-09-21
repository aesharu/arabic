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

export function planFor(date) {
  const phase = phaseFor(date);
  if (!phase) return null;
  const n = dayNumber(date);
  const day = SCRIPT_DAYS[n];
  return day
    ? { n, phase, focus: day.focus, group: day.group, tasks: day.tasks }
    : { n, phase, focus: byLang(l => `${GOAL_PREFIX[l]}: ${phase.canDo[l]}`), group: null, tasks: phase.routine };
}

const isActive = e => !!e && (e.min > 0 || e.tasks?.length > 0 || e.quiz?.total > 0 || e.cards?.r > 0);

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
