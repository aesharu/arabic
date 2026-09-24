// Weekly lessons (public/js/data/weeks.js): weeks 3–100, real topics and grammar, conversations in both languages.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { WEEKS, TASKS, DIALOGUES } from "../public/js/data/weeks.js";
import { GRAMMAR as PLAN_GRAMMAR } from "../public/js/data/grammar.js";
import { GRAMMAR_A2 } from "../public/js/data/grammar2.js";
import { GRAMMAR_B1 } from "../public/js/data/grammar3.js";
const GRAMMAR = [...PLAN_GRAMMAR, ...GRAMMAR_A2, ...GRAMMAR_B1];

const vocab = JSON.parse(readFileSync(new URL("../public/data/vocab.json", import.meta.url), "utf8"));
const topicIds = new Set(vocab.stages.flatMap(s => s.topics.map(t => t.id)));

test("one lesson for every week of the route, 3 to 100", () => {
  assert.deepEqual(WEEKS.map(w => w.week), Array.from({ length: 98 }, (_, i) => i + 3));
});

test("every week's topics and grammar exist, and every plan topic is taught", () => {
  for (const w of WEEKS) {
    for (const x of w.topics) assert.ok(topicIds.has(x.id), `week ${w.week}: topic ${x.id}`);
    assert.ok(GRAMMAR.some(g => g.id === w.grammar), `week ${w.week}: grammar ${w.grammar}`);
  }
  const taught = new Set(WEEKS.flatMap(w => w.topics.map(x => x.id)));
  for (const s of vocab.stages) if (s.id !== "grammar") for (const t of s.topics) assert.ok(taught.has(t.id), `topic ${t.id} is never taught`);
});

test("speaking tasks and conversations are in both languages", () => {
  for (const x of [...Object.values(TASKS).flat()]) for (const l of ["en", "najdi"]) assert.ok(x[l], `task ${x.en}: ${l}`);
  // Words from other dialects, and the older Gulf forms CLAUDE.md rules out — none of them belong in her Saudi.
  const TRAPS = ["إزيك", "شو", "فين", "عايز", "بدي", "دلوقتي", "هلق", "كويس", "ليه", "كمان", "مش", "دحين", "إيش", "ازاي", "هيك", "منيح",
    "وايد", "چذي", "أحبچ", "مب", "شلونچ", "زين چذي", "لاش", "هسه", "شكو"];
  for (const [w, lines] of Object.entries(DIALOGUES)) {
    for (const l of lines) {
      for (const f of ["who", "ar", "say", "en"]) assert.ok(l[f], `week ${w} ${l.ar}: ${f}`);
      const words = l.ar.replace(/[؟?…!.،]/g, " ").split(/\s+/);
      for (const trap of TRAPS) assert.ok(!words.includes(trap), `week ${w}: ${l.ar} contains ${trap}`);
    }
  }
});

// Every week from 3 to 67 has a conversation now — 44 were written on 23 Sept 2026, one for each week that
// had none. Each is a real exchange: both of them speak, and it is long enough to act out.
test("every week has a conversation, and both of them speak in it", () => {
  for (const w of WEEKS) {
    const lines = DIALOGUES[w.week];
    assert.ok(lines, `week ${w.week} has no conversation`);
    assert.ok(lines.length >= 4, `week ${w.week}: only ${lines.length} lines`);
    assert.ok(lines.some(l => l.who === "you"), `week ${w.week}: he never speaks`);
    assert.ok(lines.some(l => l.who === "her"), `week ${w.week}: she never speaks`);
  }
});

test("a conversation's Arabic is Arabic, and its pronunciation is not", () => {
  for (const [w, lines] of Object.entries(DIALOGUES)) {
    for (const l of lines) {
      assert.match(l.ar, /[\u0600-\u06FF]/, `week ${w}: "${l.ar}" should be in Arabic script`);
      assert.doesNotMatch(l.say, /[\u0600-\u06FF]/, `week ${w}: the pronunciation "${l.say}" has Arabic letters in it`);
      assert.doesNotMatch(l.en, /[\u0600-\u06FF]/, `week ${w}: the English "${l.en}" has Arabic letters in it`);
    }
  }
});

// ق is said "g" in her dialect, so no pronunciation may spell it "q" (NAJDI-PLAN.md, and CLAUDE.md).
test("no conversation writes ق as q", () => {
  for (const [w, lines] of Object.entries(DIALOGUES)) {
    for (const l of lines) assert.doesNotMatch(l.say, /q/i, `week ${w}: "${l.say}" — ق is "g" in Saudi`);
  }
});

// The course is a route, not a library: if a lesson is written but no week ever hands it to him, he does
// everything he's told and still never learns it. That is how the whole A2 grammar (اللي, كان, إذا, لازم…)
// sat unreachable between A1 and B1 until 24 Sept 2026.
test("every grammar lesson written is actually taught, at least twice, and in level order", () => {
  const taught = new Map();
  for (const w of WEEKS) (taught.get(String(w.grammar)) ?? taught.set(String(w.grammar), []).get(String(w.grammar))).push(w.week);

  const never = GRAMMAR.filter(g => !taught.has(String(g.id)));
  assert.deepEqual(never.map(g => g.id), [], `written but never scheduled: ${never.map(g => g.id).join(", ")}`);

  const thin = GRAMMAR.filter(g => taught.get(String(g.id)).length < 2);
  assert.deepEqual(thin.map(g => g.id), [], `taught only once, so it won't stick: ${thin.map(g => g.id).join(", ")}`);

  // A1 before A2 before B1: each level's first week comes after the level below it started.
  const firstOf = list => Math.min(...list.map(g => taught.get(String(g.id))[0]));
  assert.ok(firstOf(PLAN_GRAMMAR) < firstOf(GRAMMAR_A2), "the A2 grammar must start after the A1 grammar");
  assert.ok(firstOf(GRAMMAR_A2) < firstOf(GRAMMAR_B1), "the B1 grammar must start after the A2 grammar");

  // and nothing from a higher level turns up before the level below it has been taught at all
  for (const g of GRAMMAR_B1) assert.ok(taught.get(String(g.id))[0] > firstOf(GRAMMAR_A2), `B1 lesson ${g.id} comes before any A2 lesson`);
});
