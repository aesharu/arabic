// All progress lives in this browser's localStorage under one key.
// Use Export on the Calendar page to keep a backup — clearing browser data wipes it.
const KEY = "najdi-v2";

const defaults = () => ({
  version: 2,
  prefs: { theme: "auto", lang: "en" },
  script: { group: 0, done: [], quiz: [0] }, // letter groups marked done / selected for the quiz
  log: {}, // "YYYY-MM-DD" → { min: minutes studied, tasks: ids of ticked tasks, quiz?: { right, total } }
  timer: null, // { start: epoch ms, date: "YYYY-MM-DD" } while the study timer runs
});

function merge(saved) {
  const d = defaults();
  return {
    ...d,
    ...saved,
    prefs: { ...d.prefs, ...saved.prefs },
    script: { ...d.script, ...saved.script },
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

export const get = () => state;

export function update(fn) {
  fn(state);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
}

export const entry = date => state.log[date] ?? { min: 0, tasks: [] };

function editEntry(date, fn) {
  update(s => {
    const e = (s.log[date] ??= { min: 0, tasks: [] });
    fn(e);
    if (!e.min && !e.tasks.length && !e.quiz?.total) delete s.log[date];
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
  return JSON.stringify(state, null, 2);
}

export function importJson(text) {
  const data = JSON.parse(text);
  if (!data || typeof data !== "object" || !data.log) throw new Error("This doesn't look like a Najdi backup file.");
  update(s => Object.assign(s, merge(data)));
}
