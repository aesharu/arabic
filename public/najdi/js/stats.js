// Numbers behind the Today and Stats screens, computed from the review log and card states.
import * as store from "./store.js";
import { S, cardId, enabledTypes, cardStatus } from "./deck.js";
import { dayKey, dayStart, DAY, HOUR } from "./fsrs.js";

export const loadLog = () => store.all("revlog");

const keyToDate = k => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
export const prevDay = t => dayStart(t - 12 * HOUR);  // step back one study day, safe across DST
export const nextDay = t => dayStart(t + 36 * HOUR);

/** Map dayKey → { n, ms, new, learn, review, pass, again, grades[4] } */
export function byDay(log) {
  const days = new Map();
  for (const r of log) {
    const k = dayKey(r.t);
    let d = days.get(k);
    if (!d) days.set(k, d = { n: 0, ms: 0, new: 0, learn: 0, review: 0, pass: 0, grades: [0, 0, 0, 0] });
    d.n++;
    d.ms += r.ms || 0;
    d[r.from === "new" ? "new" : r.from === "review" ? "review" : "learn"]++;
    if (r.from === "review" && r.g > 1) d.pass++;
    d.grades[r.g - 1]++;
  }
  return days;
}

export function streaks(days, now = Date.now()) {
  let t = dayStart(now);
  if (!days.has(dayKey(t))) t = prevDay(t);   // today isn't lost until it's over
  let current = 0;
  while (days.has(dayKey(t))) { current++; t = prevDay(t); }
  const keys = [...days.keys()].sort();
  let best = 0, run = 0, prev = null;
  for (const k of keys) {
    const d = keyToDate(k);
    run = prev && Math.round((d - prev) / DAY) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  return { current, best: Math.max(best, current), studiedToday: days.has(dayKey(now)) };
}

/** Last `n` study days ending today: [{ key, t, d }] */
export function lastDays(days, n, now = Date.now()) {
  const out = [];
  let t = dayStart(now);
  for (let i = 0; i < n; i++) { out.unshift({ key: dayKey(t), t, d: days.get(dayKey(t)) }); t = prevDay(t); }
  return out;
}

/** Cumulative words learned (first time any of a word's cards graduated), per day. */
export function wordsLearnedSeries(log, n, now = Date.now()) {
  const first = new Map();
  for (const r of log) {
    if (!(r.ivl > 0) || r.from === "review") continue;
    const guid = r.cid.slice(0, r.cid.lastIndexOf(":"));
    if (!S.byGuid.has(guid)) continue;
    if (!first.has(guid) || first.get(guid) > r.t) first.set(guid, r.t);
  }
  const perDay = new Map();
  for (const t of first.values()) { const k = dayKey(t); perDay.set(k, (perDay.get(k) || 0) + 1); }
  const span = n === Infinity ? spanDays(log, now) : n;
  const range = lastDays(new Map(), span, now);
  const startT = range[0].t;
  let total = 0;
  for (const t of first.values()) if (t < startT) total++;
  return range.map(({ key, t }) => { total += perDay.get(key) || 0; return { key, t, value: total }; });
}

export function spanDays(log, now = Date.now()) {
  if (!log.length) return 7;
  const firstT = Math.min(...log.map(r => r.t));
  return Math.max(7, Math.round((dayStart(now) - dayStart(firstT)) / DAY) + 1);
}

/** Cards coming due over the next `n` days (day 0 includes overdue and today's learning). */
export function forecast(n, now = Date.now()) {
  const start = dayStart(now), counts = new Array(n).fill(0);
  for (const note of S.notes) {
    if ((S.user.get(note.guid) || {}).suspended) continue;
    for (const type of enabledTypes(note)) {
      const c = S.cards.get(cardId(note, type));
      if (!c) continue;
      const idx = Math.max(0, Math.floor((c.due - start) / DAY));
      if (idx < n) counts[idx]++;
    }
  }
  return counts;
}

/** Per level: counts of cards by status (new / learning / young / mature). */
export function maturityByLevel() {
  const levels = S.levels.length ? S.levels : [""];
  return levels.map(level => {
    const c = { new: 0, learning: 0, young: 0, mature: 0, total: 0 };
    for (const note of S.notes) {
      if (level && note.level !== level) continue;
      for (const type of enabledTypes(note)) { c[cardStatus(S.cards.get(cardId(note, type)))]++; c.total++; }
    }
    return { level, ...c };
  });
}

/** Share of review answers that weren't "Again", by card type, within [from, now]. */
export function retentionByType(log, from) {
  const out = {};
  for (const r of log) {
    if (r.t < from || r.from !== "review") continue;
    const type = r.cid.slice(r.cid.lastIndexOf(":") + 1);
    const o = out[type] ??= { n: 0, pass: 0 };
    o.n++;
    if (r.g > 1) o.pass++;
  }
  return out;
}

/** Words you've forgotten most often. */
export function hardestWords(limit = 8) {
  const rows = [];
  for (const note of S.notes) {
    let lapses = 0;
    for (const type of enabledTypes(note)) lapses += S.cards.get(cardId(note, type))?.lapses || 0;
    if (lapses) rows.push({ note, lapses });
  }
  return rows.sort((a, b) => b.lapses - a.lapses).slice(0, limit);
}

export function fmtMinutes(ms) {
  const m = Math.round(ms / 60000);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
}
