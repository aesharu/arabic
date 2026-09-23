// Your path (public/js/data/path.js): 21 weeks from Day 1, A1 in week 13 (ends 20 Dec), every step points at
// something that exists, every text in both languages, and every story, chat and new topic is on the path.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PATH, PAGES, TASKS } from "../public/js/data/path.js";
import { STORIES } from "../public/js/data/stories.js";
import { CHATS } from "../public/js/data/chats.js";
import { VERBS } from "../public/js/data/verbs.js";
import { GRAMMAR as PLAN_GRAMMAR } from "../public/js/data/grammar.js";
import { GRAMMAR_A2 } from "../public/js/data/grammar2.js";
const GRAMMAR = [...PLAN_GRAMMAR, ...GRAMMAR_A2];
import { LOVE } from "../public/js/data/love.js";
import { START } from "../public/js/config.js";
import { A1_BY, BIRTHDAY } from "../public/js/data/birthday.js";
import { addDays } from "../public/js/core/dates.js";

const vocab = JSON.parse(readFileSync(new URL("../public/data/vocab.json", import.meta.url), "utf8"));
const topics = new Set(vocab.stages.flatMap(s => s.topics.map(t => t.id)));
const four = (x, where) => ["en", "najdi"].forEach(l => assert.ok(x?.[l], `${where}: ${l}`));

test("the weeks line up with the goals: A1 after week 13, her birthday in week 21", () => {
  assert.equal(PATH.length, 21);
  assert.equal(addDays(START, 13 * 7), A1_BY);
  const w21 = addDays(START, 20 * 7);
  assert.ok(w21 <= BIRTHDAY && BIRTHDAY <= addDays(w21, 6), "the birthday falls in week 21");
  assert.ok(PATH[20].secret, "the birthday week is hidden from Dima");
});

test("every step points at something that exists; every text in both languages", () => {
  const exists = {
    st: id => STORIES.some(s => s.id === id), ch: id => CHATS.some(c => c.id === id), pr: id => id === "hers" || topics.has(id),
    vb: id => VERBS.some(v => v.id === id), gr: id => GRAMMAR.some(g => g.id === id), lv: id => LOVE.some(s => s.id === id),
    pg: id => Boolean(PAGES[id]), do: id => Boolean(TASKS[id]),
  };
  PATH.forEach((w, i) => {
    four(w.title, `week ${i + 1} title`);
    four(w.goal, `week ${i + 1} goal`);
    assert.ok(w.steps.length >= 2);
    assert.equal(new Set(w.steps).size, w.steps.length, `week ${i + 1}: a step twice`);
    for (const s of w.steps) {
      const [kind, id] = s.split(":");
      assert.ok(exists[kind]?.(id), `week ${i + 1}: ${s} doesn't exist`);
    }
  });
  for (const [k, p] of Object.entries(PAGES)) (four(p.text, `page ${k}`), assert.match(p.href, /^#\//));
  for (const [k, x] of Object.entries(TASKS)) four(x, `task ${k}`);
});

test("every story and chat, and the new topics, are somewhere on the path", () => {
  const steps = new Set(PATH.flatMap(w => w.steps));
  for (const s of STORIES) assert.ok(steps.has(`st:${s.id}`), `story ${s.id} is not on the path`);
  for (const c of CHATS) assert.ok(steps.has(`ch:${c.id}`), `chat ${c.id} is not on the path`);
  for (const t of ["4.18", "4.19", "4.20", "4.21"]) assert.ok(steps.has(`pr:${t}`), `topic ${t}`);
});
