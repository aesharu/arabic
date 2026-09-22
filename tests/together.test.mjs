// "Together for" — the counter reads the same moment two ways (core/together.js).
import { test } from "node:test";
import assert from "node:assert/strict";
import { elapsed, clock } from "../public/js/core/together.js";
import { TOGETHER_SINCE } from "../public/js/config.js";

const SINCE = "2026-04-03T19:20:24";

test("the two readings of the same moment", () => {
  const e = elapsed(SINCE, new Date("2026-09-22T22:59:39"));
  assert.equal(e.days, 172);
  assert.equal(e.months, 5);
  assert.equal(e.restDays, 19);
  assert.equal(clock(e), "3:39:15");
});

test("a month is a calendar month, not thirty days", () => {
  const e = elapsed("2026-01-31T12:00:00", new Date("2026-03-01T12:00:00"));
  assert.equal(e.months, 1, "31 Jan → 1 Mar is one whole month and a day or two, never two months");
  assert.ok(e.restDays >= 1);
});

test("the very first seconds, and a moment that hasn't come yet", () => {
  const start = new Date("2026-04-03T19:20:24");
  const e = elapsed(SINCE, new Date(start.getTime() + 5000));
  assert.deepEqual([e.days, e.months, e.restDays, e.hours, e.minutes, e.seconds], [0, 0, 0, 0, 0, 5]);
  const future = elapsed(SINCE, new Date("2026-04-01T00:00:00"));
  assert.equal(future.days, 0);
  assert.equal(future.months, 0);
});

test("the clock pads minutes and seconds, never the hours", () => {
  assert.equal(clock({ hours: 3, minutes: 9, seconds: 5 }), "3:09:05");
  assert.equal(clock({ hours: 0, minutes: 0, seconds: 0 }), "0:00:00");
  assert.equal(clock({ hours: 12, minutes: 59, seconds: 59 }), "12:59:59");
});

test("an exact anniversary reads as whole months with no days left over", () => {
  const e = elapsed("2026-04-03T19:20:00", new Date("2026-10-03T19:20:00"));
  assert.equal(e.months, 6);
  assert.equal(e.restDays, 0);
});

test("the date the site counts from is the one we agreed", () => {
  assert.match(TOGETHER_SINCE, /^2026-04-03T/, "3 April 2026 — change config.js if the moment moves");
});
