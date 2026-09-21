// All progress lives in this browser's localStorage under one key, and — once cloud save is connected — in the
// D1 database too (core/sync.js). The backup file on the Calendar page never contains the cloud-save key.
const PROFILE = "najdi-profile";

// Who is using this device, chosen on the welcome screen. Each profile has its own progress, here and in the cloud:
// Volodymyr (student) is the real learner; Dima (teacher) can study anything in her own copy, which never touches his,
// and can look at his progress read-only (watch()).
export const PROFILES = ["student", "teacher"];
function readProfile() {
  try {
    return localStorage.getItem(PROFILE) === "teacher" ? "teacher" : "student";
  } catch {
    return "student";
  }
}
const profileNow = readProfile();
const KEY = profileNow === "teacher" ? "najdi-v2-dima" : "najdi-v2";
export const profile = () => profileNow;
export const isTeacher = () => profileNow === "teacher";
export function setProfile(p) {
  try {
    localStorage.setItem(PROFILE, p);
  } catch {}
}

const defaults = () => ({
  version: 2,
  prefs: { theme: "auto", lang: "en" },
  script: { group: 0, done: [], quiz: [0] }, // letter groups marked done / selected for the quiz
  // "YYYY-MM-DD" → { min: minutes studied, tasks: ids of ticked tasks, quiz?: { right, total },
  //                  cards?: { n: new cards seen, r: answers, a: "Again" answers } }
  log: {},
  goals: { done: [] }, // the birthday plan's "I can…" goals ticked (views/birthday.js)
  // Cards (core/cards.js): cardId → the scheduler's card (core/srs.js) plus mod, the time it last changed.
  // prefs: new cards a day, practice saying (reverse cards), open every deck early, read the answer aloud.
  srs: { cards: {}, prefs: { newPerDay: 8, reverse: true, unlockAll: profileNow === "teacher", autoplay: true, mod: 0 } }, // Dima: every deck open
  timer: null, // { start: epoch ms, date: "YYYY-MM-DD" } while the study timer runs
  sync: { key: "", pushedAt: 0 }, // cloud save: this computer's secret key and the last successful save
});

function merge(saved) {
  const d = defaults();
  return {
    ...d,
    ...saved,
    prefs: { ...d.prefs, ...saved.prefs },
    script: { ...d.script, ...saved.script },
    sync: { ...d.sync, ...saved.sync },
    srs: { cards: { ...saved.srs?.cards }, prefs: { ...d.srs.prefs, ...saved.srs?.prefs } },
    log: saved.log && typeof saved.log === "object" ? saved.log : {},
    goals: { done: Array.isArray(saved.goals?.done) ? saved.goals.done : [] },
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return merge(JSON.parse(raw));
  } catch {}
  return defaults();
}

let state = load();
const listeners = new Set();

// Dima looking at Volodymyr's progress: the whole site shows his, and nothing can change it.
let his = null;
export const get = () => his ?? state;
export const own = () => state; // this profile's own progress, whatever is on screen (cloud save uses it)
export const watching = () => Boolean(his);
export function watch(data) {
  his = data ? merge({ ...data, prefs: state.prefs, sync: state.sync }) : null;
  listeners.forEach(l => l(get()));
}
export const subscribe = fn => (listeners.add(fn), () => listeners.delete(fn));

// silent: true saves without telling subscribers (used by cloud save itself, so it doesn't re-trigger)
// own: true always changes this profile's own progress (cloud save), even while watching his.
export function update(fn, { silent = false, own: ownOnly = false } = {}) {
  if (his && !ownOnly) {
    // While watching his progress only the language and theme can change.
    const copy = structuredClone(his);
    fn(copy);
    state.prefs = his.prefs = copy.prefs;
  } else fn(state);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
  if (!silent) listeners.forEach(l => l(get()));
}

export const entry = date => get().log[date] ?? { min: 0, tasks: [] };

function editEntry(date, fn) {
  update(s => {
    const e = (s.log[date] ??= { min: 0, tasks: [] });
    fn(e);
    if (!e.min && !e.tasks.length && !e.quiz?.total && !e.cards?.r) delete s.log[date];
  });
}

export const toggleTask = (date, id) =>
  editEntry(date, e => {
    e.tasks = e.tasks.includes(id) ? e.tasks.filter(t => t !== id) : [...e.tasks, id];
  });

export const addMinutes = (date, n) =>
  editEntry(date, e => {
    e.min = Math.max(0, Math.min(24 * 60, e.min + n));
  });

export const logQuiz = (date, right) =>
  editEntry(date, e => {
    const q = (e.quiz ??= { right: 0, total: 0 });
    q.total++;
    if (right) q.right++;
  });

export function exportJson() {
  const { sync, timer, ...rest } = state; // never put the cloud-save key in a file
  return JSON.stringify(rest, null, 2);
}

export function importJson(text) {
  const data = JSON.parse(text);
  if (!data || typeof data !== "object" || !data.log) throw new Error("This doesn't look like a Najdi backup file.");
  const { sync, ...rest } = data;
  update(s => Object.assign(s, merge({ ...rest, sync: s.sync })));
}
