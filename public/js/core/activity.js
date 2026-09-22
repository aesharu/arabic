// What each profile does on the site, sent to the cloud so the Stats page (Volodymyr's only) can show it:
// when Dima opened the site, how long she stayed, what she recorded or corrected, and which special day greeted her.
// The site only ever says "I opened it" / "I'm still here" / "a special day greeted me" — the server decides who
// that is (from the sign-in token) and when it happened, so a wrong clock on the iPad can't change the story.
// Recordings and corrections are logged by the server itself, as they are saved.
import * as store from "./store.js";

const PING_MS = 60_000; // a minute on the site = a minute counted
let started = false;

const key = () => store.own().sync?.key ?? "";

async function post(kind, detail) {
  if (!key()) return;
  try {
    await fetch("api/activity", {
      method: "POST",
      headers: { authorization: `Bearer ${key()}`, "content-type": "application/json" },
      body: JSON.stringify({ kind, detail }),
      cache: "no-store",
    });
  } catch {} // the site must work with no connection; a lost minute is no loss
}

// Called when a profile is chosen on the welcome screen. holiday: the special day's id, when one greeted her.
export const logVisit = holiday => post("visit", holiday ? { holiday } : null);

// A minute at a time, only while the page is really being looked at.
export function start() {
  if (started) return;
  started = true;
  const ping = () => document.visibilityState === "visible" && post("ping");
  setInterval(ping, PING_MS);
  document.addEventListener("visibilitychange", () => document.visibilityState === "visible" && post("ping"));
}

// ---------- Reading it back (Stats) ----------
export async function fetchStats(password) {
  const res = await fetch("api/stats", { headers: { authorization: `Bearer ${key()}`, "x-stats-key": password }, cache: "no-store" });
  if (res.status === 403) {
    const err = await res.json().catch(() => ({}));
    throw Object.assign(new Error(err.error ?? "forbidden"), { reason: err.error === "wrong-password" ? "password" : "forbidden" });
  }
  if (res.status === 503) throw Object.assign(new Error("not-configured"), { reason: "off" });
  if (!res.ok) throw Object.assign(new Error(`HTTP ${res.status}`), { reason: "error" });
  return res.json();
}

// ---------- Working out the story (pure, so tests can check it) ----------
const DAY_MS = 86400000;
const RIYADH_OFFSET_MS = 3 * 60 * 60 * 1000;
// The Saudi day a moment belongs to — the day Dima was living when it happened.
export const saudiDay = at => new Date(at + RIYADH_OFFSET_MS).toISOString().slice(0, 10);
const before = day => new Date(Date.parse(`${day}T00:00:00Z`) - DAY_MS).toISOString().slice(0, 10);

// Days in a row, counting back from today (yesterday still counts, so the streak isn't lost before she wakes up).
export function streaks(days) {
  const on = new Set(days.filter(d => d.opens > 0 || d.minutes > 0).map(d => d.day));
  if (!on.size) return { current: 0, longest: 0, lastDay: "" };
  const sorted = [...on].sort();
  let longest = 0, run = 0, prev = "";
  for (const day of sorted) {
    run = prev && before(day) === prev ? run + 1 : 1;
    prev = day;
    longest = Math.max(longest, run);
  }
  const today = saudiDay(Date.now());
  let current = 0;
  let cursor = on.has(today) ? today : before(today);
  while (on.has(cursor)) {
    current++;
    cursor = before(cursor);
  }
  return { current, longest, lastDay: sorted[sorted.length - 1] };
}

// Days made out of a list of moments (when each recording was saved), for streaks().
export const daysFromTimes = times => [...new Set(times.map(saudiDay))].map(day => ({ day, opens: 1, minutes: 0 }));

// Everything the Stats page shows at the top, for one profile.
export function summarize(stats, who = "teacher") {
  const days = (stats.days ?? []).filter(d => d.who === who);
  const events = (stats.events ?? []).filter(e => e.who === who);
  const count = kind => events.filter(e => e.kind === kind).length;
  return {
    days,
    events,
    ...streaks(days),
    activeDays: days.filter(d => d.opens > 0 || d.minutes > 0).length,
    minutes: days.reduce((a, d) => a + d.minutes, 0),
    opens: days.reduce((a, d) => a + d.opens, 0),
    lastSeen: Math.max(0, ...days.map(d => d.last), ...events.map(e => e.at)),
    recordings: count("record"),
    rerecordings: count("rerecord"),
    corrections: count("correct"),
    holidays: count("holiday"),
  };
}

// The events of one Saudi day, newest first.
export const eventsOn = (events, day) => events.filter(e => saudiDay(e.at) === day).sort((a, b) => b.at - a.at);
