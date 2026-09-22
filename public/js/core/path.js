// Your path (data/path.js): which week it is, and which steps are done. Stories, chats and practice tick themselves;
// the rest are ticked by hand and saved with the birthday goals (goals.done, "path:<step>", synced).
import { PATH } from "../data/path.js";
import { START } from "../config.js";
import { addDays, diffDays, todayKey } from "./dates.js";
import * as store from "./store.js";

export const PASS = 80; // a practice topic counts once you've scored this much

export const weeks = (teacher = store.isTeacher()) =>
  PATH.map((w, i) => ({ ...w, n: i + 1, start: addDays(START, 7 * i), end: addDays(START, 7 * i + 6) })).filter(w => !(teacher && w.secret));

// The week you're in (the last one after the path ends).
export const weekIndex = (today = todayKey()) => Math.max(0, Math.min(PATH.length - 1, Math.floor(diffDays(START, today) / 7)));

export const isAuto = step => /^(st|ch|pr):/.test(step);

export function stepDone(step, s = store.get()) {
  const [kind, id] = step.split(":");
  if (kind === "st") return (s.reading?.done ?? []).includes(`st.${id}`);
  if (kind === "ch") return (s.reading?.done ?? []).includes(`ch.${id}`) || (s.prefs.chatsRead ?? []).includes(id);
  if (kind === "pr") return (s.prefs.practice?.[id] ?? 0) >= PASS;
  return (s.goals?.done ?? []).includes(`path:${step}`);
}

export const progress = (w, s = store.get()) => ({ done: w.steps.filter(x => stepDone(x, s)).length, total: w.steps.length });

export function toggleStep(step) {
  store.update(s => {
    const set = new Set(s.goals.done);
    const key = `path:${step}`;
    set.has(key) ? set.delete(key) : set.add(key);
    s.goals.done = [...set];
  });
}
