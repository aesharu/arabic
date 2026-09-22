// The Stats page's arithmetic: days in a row, totals, and which Saudi day a moment belongs to.
import { test } from "node:test";
import assert from "node:assert/strict";
import { streaks, summarize, saudiDay, eventsOn } from "../public/js/core/activity.js";

const day = (n = 0) => new Date(Date.now() + 3 * 3600_000 + n * 86400000).toISOString().slice(0, 10);
const visited = (d, minutes = 10) => ({ who: "teacher", day: d, opens: 1, minutes, first: 0, last: 0 });

test("a Saudi day starts three hours before a UTC one", () => {
  assert.equal(saudiDay(Date.parse("2026-09-22T21:30:00Z")), "2026-09-23"); // 00:30 in Riyadh, already the next day
  assert.equal(saudiDay(Date.parse("2026-09-22T20:59:00Z")), "2026-09-22");
});

test("days in a row, counting back from today", () => {
  assert.deepEqual(streaks([]), { current: 0, longest: 0, lastDay: "" });
  const three = [visited(day(0)), visited(day(-1)), visited(day(-2))];
  assert.equal(streaks(three).current, 3);
  assert.equal(streaks(three).longest, 3);
});

test("yesterday still counts, so the streak isn't lost before she wakes up", () => {
  assert.equal(streaks([visited(day(-1)), visited(day(-2))]).current, 2);
  assert.equal(streaks([visited(day(-2))]).current, 0); // the day before yesterday: the streak is over
});

test("a gap ends the streak but the best one is remembered", () => {
  const s = streaks([visited(day(0)), visited(day(-4)), visited(day(-5)), visited(day(-6))]);
  assert.equal(s.current, 1);
  assert.equal(s.longest, 3);
});

test("a day the site was open but nothing happened doesn't count", () => {
  assert.equal(streaks([{ who: "teacher", day: day(0), opens: 0, minutes: 0, first: 0, last: 0 }]).current, 0);
});

test("the totals count only her, not him", () => {
  const stats = {
    now: Date.now(),
    days: [visited(day(0), 30), { ...visited(day(0), 99), who: "student" }],
    events: [
      { who: "teacher", kind: "record", detail: { text: "قهوة" }, at: Date.now() },
      { who: "teacher", kind: "rerecord", detail: { text: "قهوة" }, at: Date.now() },
      { who: "teacher", kind: "correct", detail: { target: "w1" }, at: Date.now() },
      { who: "teacher", kind: "holiday", detail: { holiday: "national" }, at: Date.now() },
      { who: "student", kind: "record", detail: {}, at: Date.now() },
    ],
  };
  const s = summarize(stats, "teacher");
  assert.equal(s.minutes, 30);
  assert.equal(s.recordings, 1);
  assert.equal(s.rerecordings, 1);
  assert.equal(s.corrections, 1);
  assert.equal(s.holidays, 1);
  assert.equal(s.activeDays, 1);
  assert.equal(s.events.length, 4);
});

test("a day's events come back newest first", () => {
  const base = Date.parse("2026-09-22T09:00:00Z");
  const events = [
    { who: "teacher", kind: "visit", detail: null, at: base },
    { who: "teacher", kind: "record", detail: { text: "بيت" }, at: base + 60_000 },
    { who: "teacher", kind: "record", detail: { text: "باب" }, at: base + 5 * 86400000 },
  ];
  const on = eventsOn(events, "2026-09-22");
  assert.deepEqual(on.map(e => e.kind), ["record", "visit"]);
});
