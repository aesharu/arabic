// Points, levels, the fire and the awards (public/js/core/game.js): the numbers have to be right, every award
// has to be winnable, and none of them may ever be taken back.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  BADGES, FIRE, GROUPS, LEVELS, XP,
  allStandings, comebacks, earned, fireLevel, fullMonths, goalStreak, levelOf, nextUp, perfectQuizzes, scoreboard, totalXp, xpOf,
} from "../public/js/core/game.js";
import { STRINGS } from "../public/js/i18n/strings.js";
import { DAILY_GOAL_MIN } from "../public/js/config.js";

const days = (from, n, entry) => {
  const log = {};
  const d = new Date(`${from}T00:00:00Z`);
  for (let i = 0; i < n; i++) log[new Date(d.getTime() + i * 864e5).toISOString().slice(0, 10)] = { ...entry };
  return log;
};

test("a day is worth what it earned, and a finished day gets its bonus", () => {
  assert.equal(xpOf(null), 0);
  assert.equal(xpOf({ min: 10, tasks: [] }), 10);
  assert.equal(xpOf({ min: 10, tasks: ["a", "b"] }), 10 + 2 * XP.task);
  assert.equal(xpOf({ min: 0, cards: { r: 20 } }), 20 * XP.card);
  assert.equal(xpOf({ min: 0, quiz: { right: 8, total: 10 } }), 8 * XP.quizRight);
  assert.equal(xpOf({ min: 0, speak: 3, write: 4 }), 3 * XP.spoken + 4 * XP.written);
  // The hour carries its own bonus; a short day that ticked everything gets it too.
  assert.equal(xpOf({ min: DAILY_GOAL_MIN, tasks: [] }), DAILY_GOAL_MIN + XP.goal);
  assert.equal(xpOf({ min: 20, tasks: [] }, true), 20 + XP.goal);
});

test("the total is every day added up", () => {
  assert.equal(totalXp({}), 0);
  assert.equal(totalXp(days("2026-09-21", 3, { min: 30, tasks: [] })), 90);
});

test("levels rise, never fall, and the last one stays put", () => {
  assert.equal(levelOf(0).n, 1);
  assert.equal(levelOf(249).n, 1);
  assert.equal(levelOf(250).n, 2);
  assert.equal(levelOf(LEVELS.at(-1).at).n, LEVELS.length);
  assert.equal(levelOf(999_999).n, LEVELS.length);
  assert.equal(levelOf(999_999).next, null);
  assert.equal(levelOf(999_999).pct, 100);
  for (let i = 1; i < LEVELS.length; i++) assert.ok(LEVELS[i].at > LEVELS[i - 1].at, `level ${i + 1} must cost more`);
  // Halfway between two levels is halfway along the bar.
  const mid = levelOf((LEVELS[0].at + LEVELS[1].at) / 2);
  assert.equal(Math.round(mid.pct), 50);
  assert.equal(mid.left, LEVELS[1].at / 2);
});

test("the fire grows with the run and is out at zero", () => {
  assert.equal(fireLevel(0), 0);
  assert.equal(fireLevel(1), 1);
  assert.equal(fireLevel(3), 2);
  assert.equal(fireLevel(7), 3);
  assert.equal(fireLevel(30), 4);
  assert.equal(fireLevel(400), FIRE.length - 1);
});

test("the longest run of finished days", () => {
  const log = { ...days("2026-09-21", 4, { min: 90, tasks: [] }), ...days("2026-10-01", 2, { min: 90, tasks: [] }) };
  assert.equal(goalStreak(log), 4);
  assert.equal(goalStreak(days("2026-09-21", 3, { min: 10, tasks: [] })), 0, "short days don't count");
});

test("a month counts only when every one of its days was studied, and only once it's over", () => {
  const october = days("2026-10-01", 31, { min: 20, tasks: [] });
  assert.equal(fullMonths(october, "2026-11-05"), 1);
  assert.equal(fullMonths(october, "2026-10-31"), 0, "a month still running can't be complete");
  delete october["2026-10-17"];
  assert.equal(fullMonths(october, "2026-11-05"), 0, "one missed day and it isn't a full month");
});

test("coming back after more than a week away is counted", () => {
  assert.equal(comebacks({ "2026-09-21": { min: 30 }, "2026-09-22": { min: 30 } }), 0);
  assert.equal(comebacks({ "2026-09-21": { min: 30 }, "2026-10-05": { min: 30 } }), 1);
  assert.equal(comebacks({ "2026-09-21": { min: 30 }, "2026-09-27": { min: 30 } }), 0, "six days apart is not a break");
});

test("a perfect quiz has to be a long one", () => {
  assert.equal(perfectQuizzes({ a: { quiz: { right: 5, total: 5 } } }), 0);
  assert.equal(perfectQuizzes({ a: { quiz: { right: 10, total: 10 } } }), 1);
  assert.equal(perfectQuizzes({ a: { quiz: { right: 9, total: 10 } } }), 0);
});

test("a fresh profile has no points and no awards", () => {
  const b = scoreboard({ today: "2026-09-23" });
  assert.equal(b.xp, 0);
  assert.equal(b.level.n, 1);
  assert.equal(earned(b).length, 0);
  // and nothing shows more progress than it has
  for (const x of allStandings(b)) assert.equal(x.now, 0, x.id);
});

test("real progress wins the awards it should, and no others", () => {
  const b = scoreboard({
    log: days("2026-09-21", 8, { min: 90, tasks: ["learn"], cards: { r: 20 }, speak: 2, write: 3 }),
    script: { done: [0, 1] },
    reading: { done: ["st.house"] },
    goals: { done: ["greet", "me"] },
    words: { learned: 120, strong: 4 },
    streak: 8,
    stories: 60,
    a1: ["greet", "me", "ask"],
    today: "2026-09-28",
  });
  const won = new Set(earned(b));
  for (const id of ["fire3", "fire7", "hour1", "hour10", "group1", "words10", "words100", "cards100", "spoke1", "wrote1", "story1", "goal7"]) {
    assert.ok(won.has(id), `${id} should be won`);
  }
  for (const id of ["fire30", "alphabet", "words500", "cards5000", "story10", "fullmonth", "comeback", "a1goals", "quizclean"]) {
    assert.ok(!won.has(id), `${id} should not be won yet`);
  }
  assert.equal(b.minutes, 8 * 90);
  assert.equal(b.cardAnswers, 8 * 20);
});

test("an award that counts a whole collection knows how big the collection is", () => {
  const b = scoreboard({ reading: { done: Array.from({ length: 60 }, (_, i) => `st.${i}`) }, stories: 60, goals: { done: ["a", "b"] }, a1: ["a", "b"], today: "2026-09-23" });
  const won = new Set(earned(b));
  assert.ok(won.has("storyAll"), "every story read");
  assert.ok(won.has("a1goals"), "every first-level goal ticked");
});

test("nothing about an award can ever go backwards on the page", () => {
  const b = scoreboard({ words: { learned: 5000 }, today: "2026-09-23" });
  for (const x of allStandings(b)) {
    assert.ok(x.now <= x.need || x.need === 0, `${x.id}: ${x.now} shown out of ${x.need}`);
    assert.ok(x.pct <= 100 || x.need === 0, `${x.id}: ${x.pct}%`);
  }
});

test("what to chase next is the closest unfinished award", () => {
  const b = scoreboard({ log: days("2026-09-21", 1, { min: 55, tasks: [] }), streak: 1, today: "2026-09-21" });
  const next = nextUp(b, 3);
  assert.equal(next.length, 3);
  assert.ok(next.every(x => !x.have));
  for (let i = 1; i < next.length; i++) assert.ok(next[i - 1].pct >= next[i].pct, "closest first");
});

test("every award and level is named in both languages, and every award is reachable", () => {
  assert.equal(new Set(BADGES.map(b => b.id)).size, BADGES.length, "award ids must be unique");
  for (const b of BADGES) {
    assert.ok(GROUPS.includes(b.group), `${b.id}: unknown group ${b.group}`);
    assert.ok(b.need > 0 || b.all, `${b.id}: nothing to reach`);
    for (const key of [`badge.${b.id}`, `badge.${b.id}.sub`]) {
      assert.ok(STRINGS[key], `${key} is missing`);
      for (const l of ["en", "najdi"]) assert.ok(STRINGS[key][l], `${key}: ${l}`);
    }
  }
  for (const l of LEVELS) assert.ok(STRINGS[`lv.${l.id}`]?.najdi, `lv.${l.id}`);
  for (const g of GROUPS) assert.ok(STRINGS[`bg.${g}`]?.najdi, `bg.${g}`);
  for (const g of GROUPS) assert.ok(BADGES.some(b => b.group === g), `group ${g} has no awards`);
});

test("an award, once won, is kept — the site never takes one back", () => {
  const src = readFileSync(new URL("../public/js/main.js", import.meta.url), "utf8");
  const block = src.slice(src.indexOf("function checkAwards"), src.indexOf("function checkAwards") + 1200);
  assert.match(block, /\[\.\.\.new Set\(\[\.\.\.\(s\.game\?\.badges \?\? \[\]\), \.\.\.fresh\]\)\]/, "won awards are merged in, never replaced");
  assert.match(block, /Math\.max\(level, b\.level\.n\)/, "the level only ever goes up");
});

test("the points the page explains are the points the code gives", () => {
  const how = STRINGS["aw.howList"].en;
  assert.match(how, new RegExp(`${XP.card} for every card`));
  assert.match(how, new RegExp(`${XP.quizRight} for every quiz`));
  assert.match(how, new RegExp(`${XP.spoken} for a phrase`));
  assert.match(how, new RegExp(`${XP.written} for a word written`));
  assert.match(how, new RegExp(`${XP.task} for a task`));
  assert.match(how, new RegExp(`${XP.goal} for a day`));
});
