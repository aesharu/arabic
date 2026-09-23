// Weekly lessons (public/js/data/weeks.js): weeks 3–67, real topics and grammar, conversations in both languages.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { WEEKS, TASKS, DIALOGUES } from "../public/js/data/weeks.js";
import { GRAMMAR } from "../public/js/data/grammar.js";

const vocab = JSON.parse(readFileSync(new URL("../public/data/vocab.json", import.meta.url), "utf8"));
const topicIds = new Set(vocab.stages.flatMap(s => s.topics.map(t => t.id)));

test("one lesson for every week from 3 to 67", () => {
  assert.deepEqual(WEEKS.map(w => w.week), Array.from({ length: 65 }, (_, i) => i + 3));
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
  const TRAPS = ["إزيك", "شو", "فين", "عايز", "بدي", "دلوقتي", "هلق", "كويس", "ليه", "كمان", "مش", "دحين", "إيش", "ازاي", "هيك", "منيح"];
  for (const [w, lines] of Object.entries(DIALOGUES)) {
    for (const l of lines) {
      for (const f of ["who", "ar", "say", "en"]) assert.ok(l[f], `week ${w} ${l.ar}: ${f}`);
      const words = l.ar.replace(/[؟?…!.،]/g, " ").split(/\s+/);
      for (const trap of TRAPS) assert.ok(!words.includes(trap), `week ${w}: ${l.ar} contains ${trap}`);
    }
  }
});
