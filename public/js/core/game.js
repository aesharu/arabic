// Points, levels, the fire and the awards — the part of the site that keeps score.
// No DOM and no store: everything is worked out from a plain snapshot of progress, so the tests can use it too.
// Points are earned only for real study, and never taken away: a course measured in years needs a number that
// only ever goes up.
import { addDays, daysInMonth, monthKey, todayKey } from "./dates.js";
import { DAILY_GOAL_MIN } from "../config.js";

// What one day of study is worth. A full hour of cards and a little speaking comes out around 200.
export const XP = { minute: 1, card: 2, quizRight: 3, spoken: 5, written: 5, task: 5, goal: 25 };

// Points for one day in the log. `full` is true when the day counts as done (all tasks ticked or the hour reached).
export function xpOf(e, full = false) {
  if (!e) return 0;
  return (
    (e.min ?? 0) * XP.minute +
    (e.cards?.r ?? 0) * XP.card +
    (e.quiz?.right ?? 0) * XP.quizRight +
    (e.speak ?? 0) * XP.spoken +
    (e.write ?? 0) * XP.written +
    (e.tasks?.length ?? 0) * XP.task +
    (full || (e.min ?? 0) >= DAILY_GOAL_MIN ? XP.goal : 0)
  );
}

export const xpOn = (log, date) => xpOf(log[date]);
export const totalXp = log => Object.values(log).reduce((n, e) => n + xpOf(e), 0);

// Ten levels, named for what you can do by then. The last one is years away on purpose.
export const LEVELS = [
  { id: "start", at: 0 },
  { id: "letters", at: 250 },
  { id: "words", at: 750 },
  { id: "sentences", at: 2000 },
  { id: "sawalif", at: 4500 },
  { id: "call", at: 9000 },
  { id: "story", at: 18000 },
  { id: "dialect", at: 32000 },
  { id: "heart", at: 55000 },
  { id: "poet", at: 90000 },
];

// Which level a number of points is, and how far it is to the next one.
export function levelOf(xp) {
  let i = 0;
  while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1].at) i++;
  const level = LEVELS[i];
  const next = LEVELS[i + 1] ?? null;
  const into = xp - level.at;
  const need = next ? next.at - level.at : 0;
  return { n: i + 1, id: level.id, at: level.at, next, into, need, left: next ? next.at - xp : 0, pct: next ? (into / need) * 100 : 100 };
}

// How big the fire is: nothing, a spark, a flame, a blaze, or the one that never goes out.
export const FIRE = [0, 1, 3, 7, 30, 100];
export const fireLevel = streak => FIRE.filter(n => streak >= n && n > 0).length;

// ---------- The numbers the awards are measured against ----------

const active = e => !!e && ((e.min ?? 0) > 0 || e.tasks?.length > 0 || e.quiz?.total > 0 || e.cards?.r > 0 || e.speak > 0 || e.write > 0);
const met = e => (e?.min ?? 0) >= DAILY_GOAL_MIN;

// The longest run of days in a row that reached the daily goal.
export function goalStreak(log) {
  const days = Object.keys(log).filter(d => met(log[d])).sort();
  let best = 0, run = 0, prev = "";
  for (const d of days) {
    run = prev && addDays(prev, 1) === d ? run + 1 : 1;
    prev = d;
    best = Math.max(best, run);
  }
  return best;
}

// Calendar months where every single day was studied. A month still running doesn't count yet.
export function fullMonths(log, today = todayKey()) {
  const months = new Set(Object.keys(log).filter(d => active(log[d])).map(monthKey));
  let n = 0;
  for (const m of months) {
    if (m >= monthKey(today)) continue;
    const days = daysInMonth(m);
    let all = true;
    for (let d = 1; d <= days && all; d++) all = active(log[`${m}-${String(d).padStart(2, "0")}`]);
    if (all) n++;
  }
  return n;
}

// Times he stopped for a week or more and came back anyway. That one deserves an award.
export function comebacks(log, gap = 7) {
  const days = Object.keys(log).filter(d => active(log[d])).sort();
  let n = 0;
  for (let i = 1; i < days.length; i++) {
    let apart = 0;
    for (let d = days[i - 1]; d !== days[i]; d = addDays(d, 1)) apart++;
    if (apart > gap) n++;
  }
  return n;
}

// Days with a long quiz and not one answer wrong.
export const perfectQuizzes = log => Object.values(log).filter(e => (e.quiz?.total ?? 0) >= 10 && e.quiz.right === e.quiz.total).length;

// The longest single day.
export const bestDayMin = log => Object.values(log).reduce((n, e) => Math.max(n, e.min ?? 0), 0);

/**
 * Everything the awards need, out of a profile's progress.
 * log · script.done · reading.done · read.done · goals.done · words { learned, strong } · streak · stories/texts (how many there are)
 */
export function scoreboard({ log = {}, script = {}, reading = {}, read = {}, goals = {}, words = {}, streak = 0, stories = 0, texts = 0, a1 = [], today = todayKey() } = {}) {
  const days = Object.values(log).filter(active);
  const sum = f => days.reduce((n, e) => n + (f(e) || 0), 0);
  const xp = totalXp(log);
  return {
    xp,
    level: levelOf(xp),
    today: xpOn(log, today),
    streak,
    fire: fireLevel(streak),
    minutes: sum(e => e.min),
    days: days.length,
    bestDayMin: bestDayMin(log),
    cardAnswers: sum(e => e.cards?.r),
    spoken: sum(e => e.speak),
    written: sum(e => e.write),
    letters: new Set(script.done ?? []).size,
    stories: (reading.done ?? []).length,
    allStories: stories,
    texts: (read.done ?? []).length,
    allTexts: texts,
    words: { learned: words.learned ?? 0, strong: words.strong ?? 0 },
    perfectQuizzes: perfectQuizzes(log),
    goalStreak: goalStreak(log),
    fullMonths: fullMonths(log, today),
    comebacks: comebacks(log),
    a1done: (goals.done ?? []).filter(id => a1.includes(id)).length,
    a1Goals: a1.length,
  };
}

// ---------- The awards ----------
// group: how they're sorted on the page. of(s): the number reached so far; need: the number that wins it.
// Every name and line lives in i18n/strings.js as badge.<id> and badge.<id>.sub.
export const BADGES = [
  { id: "fire3", group: "fire", icon: "flame", need: 3, of: s => s.streak },
  { id: "fire7", group: "fire", icon: "flame", need: 7, of: s => s.streak },
  { id: "fire14", group: "fire", icon: "flame", need: 14, of: s => s.streak },
  { id: "fire30", group: "fire", icon: "flame", need: 30, of: s => s.streak },
  { id: "fire100", group: "fire", icon: "flame", need: 100, of: s => s.streak },
  { id: "fire365", group: "fire", icon: "flame", need: 365, of: s => s.streak },

  { id: "hour1", group: "time", icon: "timer", need: 60, of: s => s.minutes },
  { id: "hour10", group: "time", icon: "timer", need: 600, of: s => s.minutes },
  { id: "hour50", group: "time", icon: "timer", need: 3000, of: s => s.minutes },
  { id: "hour100", group: "time", icon: "timer", need: 6000, of: s => s.minutes },
  { id: "longday", group: "time", icon: "timer", need: 180, of: s => s.bestDayMin },

  { id: "group1", group: "script", icon: "letters", need: 1, of: s => s.letters },
  { id: "alphabet", group: "script", icon: "letters", need: 6, of: s => s.letters },
  { id: "quizclean", group: "script", icon: "quiz", need: 1, of: s => s.perfectQuizzes },

  { id: "words10", group: "words", icon: "words", need: 10, of: s => s.words.learned },
  { id: "words100", group: "words", icon: "words", need: 100, of: s => s.words.learned },
  { id: "words500", group: "words", icon: "words", need: 500, of: s => s.words.learned },
  { id: "words1000", group: "words", icon: "words", need: 1000, of: s => s.words.learned },
  { id: "strong100", group: "words", icon: "star", need: 100, of: s => s.words.strong },

  { id: "cards100", group: "cards", icon: "cards", need: 100, of: s => s.cardAnswers },
  { id: "cards1000", group: "cards", icon: "cards", need: 1000, of: s => s.cardAnswers },
  { id: "cards5000", group: "cards", icon: "cards", need: 5000, of: s => s.cardAnswers },

  { id: "spoke1", group: "voice", icon: "mic", need: 1, of: s => s.spoken },
  { id: "spoke100", group: "voice", icon: "mic", need: 100, of: s => s.spoken },
  { id: "wrote1", group: "voice", icon: "pencil", need: 1, of: s => s.written },
  { id: "wrote500", group: "voice", icon: "pencil", need: 500, of: s => s.written },

  { id: "story1", group: "read", icon: "reading", need: 1, of: s => s.stories },
  { id: "story10", group: "read", icon: "reading", need: 10, of: s => s.stories },
  { id: "storyAll", group: "read", icon: "reading", need: 0, of: s => s.stories, all: s => s.allStories },

  { id: "read1", group: "read", icon: "qalam", need: 1, of: s => s.texts },
  { id: "read25", group: "read", icon: "qalam", need: 25, of: s => s.texts },
  { id: "readAll", group: "read", icon: "qalam", need: 0, of: s => s.texts, all: s => s.allTexts },

  { id: "goal7", group: "habit", icon: "check", need: 7, of: s => s.goalStreak },
  { id: "fullmonth", group: "habit", icon: "calendar", need: 1, of: s => s.fullMonths },
  { id: "comeback", group: "habit", icon: "heart", need: 1, of: s => s.comebacks },
  { id: "a1goals", group: "habit", icon: "star", need: 0, of: s => s.a1done, all: s => s.a1Goals },
];

export const GROUPS = ["fire", "time", "script", "words", "cards", "voice", "read", "habit"];

// Where one award stands: { id, now, need, have, pct }.
export function standing(badge, s) {
  const need = badge.all ? badge.all(s) : badge.need;
  const now = Math.min(badge.of(s), Math.max(need, 0));
  return { id: badge.id, icon: badge.icon, group: badge.group, now, need, have: need > 0 && now >= need, pct: need > 0 ? (now / need) * 100 : 0 };
}

export const allStandings = s => BADGES.map(b => standing(b, s));
export const earned = s => allStandings(s).filter(x => x.have).map(x => x.id);

// The next few worth chasing: closest to done first, and never one already won.
export const nextUp = (s, n = 3) =>
  allStandings(s).filter(x => !x.have && x.need > 0).sort((a, b) => b.pct - a.pct).slice(0, n);
