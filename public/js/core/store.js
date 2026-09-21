// All progress lives in this browser's localStorage under one key, and — once cloud save is connected — in the
// D1 database too (core/sync.js). The backup file on the Calendar page never contains the cloud-save key.
const KEY = "najdi-v2";
const PROFILE = "najdi-profile";

// Who is using this device: Volodymyr (student) studies and saves; Dima (teacher) only looks.
// In teacher mode nothing she does is saved or sent to the cloud — only the language, theme and cloud key —
// and the page shows his latest progress from the cloud. Chosen on the welcome screen.
export const PROFILES = ["student", "teacher"];
function readProfile() {
  try {
    return localStorage.getItem(PROFILE) === "teacher" ? "teacher" : "student";
  } catch {
    return "student";
  }
}
const profileNow = readProfile();
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
  // Cards (core/cards.js): cardId → the scheduler's card (core/srs.js) plus mod, the time it last changed.
  // prefs: new cards a day, practise saying (reverse cards), open every deck early, read the answer aloud.
  srs: { cards: {}, prefs: { newPerDay: 8, reverse: true, unlockAll: false, autoplay: true, mod: 0 } },
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

export const get = () => state;
export const subscribe = fn => (listeners.add(fn), () => listeners.delete(fn));

// silent: true saves without telling subscribers (used by cloud save itself, so it doesn't re-trigger)
export function update(fn, { silent = false } = {}) {
  fn(state);
  save();
  if (!silent) listeners.forEach(l => l(state));
}

function save() {
  try {
    if (!isTeacher()) return localStorage.setItem(KEY, JSON.stringify(state));
    // Teacher: keep the saved progress exactly as it was; only this device's settings change.
    const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
    localStorage.setItem(KEY, JSON.stringify({ ...saved, prefs: state.prefs, sync: state.sync }));
  } catch {}
}

// Teacher: take the cloud copy of his progress as it is (nothing of hers is mixed in) and keep it for next time.
export function adopt(cloud) {
  const { prefs, sync } = state;
  state = merge({ ...cloud, prefs, sync });
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
  listeners.forEach(l => l(state));
}

export const entry = date => state.log[date] ?? { min: 0, tasks: [] };

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
