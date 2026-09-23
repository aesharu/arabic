// The grammar lessons (public/js/data/grammar.js) must be the plan's Part 5, in all both languages.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { GRAMMAR } from "../public/js/data/grammar.js";

const plan = readFileSync(new URL("../NAJDI-PLAN.md", import.meta.url), "utf8");
const part5 = plan.slice(plan.indexOf("## Part 5"), plan.indexOf("## Part 6"));

test("nine grammar lessons, one per pattern in Part 5", () => {
  assert.equal(GRAMMAR.length, (part5.match(/^### 5\.\d/gm) ?? []).length);
});

test("every grammar example comes from Part 5 and is in both languages", () => {
  for (const l of GRAMMAR) {
    for (const k of ["en", "najdi"]) {
      assert.ok(l.title[k] && l.intro[k], `lesson ${l.id}: ${k} missing`);
    }
    for (const r of l.rows) {
      for (const f of ["ar", "say", "en"]) assert.ok(r[f], `${l.id} ${r.ar}: ${f} missing`);
      for (const part of r.ar.split(" → ")) assert.ok(part5.includes(part.replace("؟", "")), `${part} is not in Part 5 of the plan`);
      for (const part of r.say.split(" → ")) assert.ok(part5.includes(part.replace("?", "")), `${part} (say) is not in Part 5`);
      if (r.note) for (const k of ["en", "najdi"]) assert.ok(r.note[k], `${r.ar}: note ${k}`);
    }
  }
});

test("the plan's ⚠ grammar items carry the check-with-tutor flag", () => {
  const flagged = GRAMMAR.flatMap(l => l.rows).filter(r => r.check).map(r => r.say);
  assert.deepEqual(flagged.sort(), ["kint", "rāḥaw"]);
});

test("more grammar for A2: ids after the plan's, both languages, every example flagged and in both languages", async () => {
  const { GRAMMAR_A2 } = await import("../public/js/data/grammar2.js");
  assert.ok(GRAMMAR_A2.length >= 6);
  const ids = [...GRAMMAR, ...GRAMMAR_A2].map(l => l.id);
  assert.equal(new Set(ids).size, ids.length, "lesson ids must be unique");
  for (const l of GRAMMAR_A2) {
    for (const k of ["en", "najdi"]) assert.ok(l.title[k] && l.intro[k], `lesson ${l.id}: ${k}`);
    assert.ok(l.rows.length >= 4, `lesson ${l.id}: at least four examples`);
    assert.ok(l.rows.some(r => r.her), `lesson ${l.id}: at least one “to her” example`);
    for (const r of l.rows) {
      for (const f of ["ar", "say", "en"]) assert.ok(r[f], `${l.id} ${r.ar}: ${f}`);
      assert.doesNotMatch(r.say, /[؀-ۿ]/, `${r.ar}: pronunciation should be Latin`);
      assert.equal(r.check, true, `${r.ar}: should be flagged`);
      assert.equal(r.ar.split(" → ").length, r.say.split(" → ").length, `${r.ar}: forms and pronunciation`);
    }
  }
});

// The B1 grammar (data/grammar3.js): the step from answering to talking. Same rules as the A2 set — every
// lesson explained in both languages, at least four examples, at least one said to her, all flagged.
test("the B1 grammar: unique ids after the A2 set, both languages, every example flagged", async () => {
  const { GRAMMAR_A2 } = await import("../public/js/data/grammar2.js");
  const { GRAMMAR_B1 } = await import("../public/js/data/grammar3.js");
  assert.ok(GRAMMAR_B1.length >= 10, `only ${GRAMMAR_B1.length} B1 lessons`);
  const ids = [...GRAMMAR, ...GRAMMAR_A2, ...GRAMMAR_B1].map(l => l.id);
  assert.equal(new Set(ids).size, ids.length, "lesson ids must be unique across all three sets");
  for (const l of GRAMMAR_B1) {
    for (const k of ["en", "najdi"]) assert.ok(l.title[k] && l.intro[k], `lesson ${l.id}: ${k}`);
    assert.ok(l.rows.length >= 4, `lesson ${l.id}: at least four examples`);
    assert.ok(l.rows.some(r => r.her), `lesson ${l.id}: at least one “to her” example`);
    for (const r of l.rows) {
      for (const f of ["ar", "say", "en"]) assert.ok(r[f], `${l.id} ${r.ar}: ${f}`);
      assert.match(r.ar, /[؀-ۿ]/, `${r.ar}: should be Arabic script`);
      assert.doesNotMatch(r.say, /[؀-ۿ]/, `${r.ar}: pronunciation should be Latin`);
      assert.doesNotMatch(r.say, /q/i, `${r.say}: ق is written "g" in Saudi`);
      assert.equal(r.check, true, `${r.ar}: should be flagged`);
    }
  }
});

// The whole point of these twelve: B1 is where sentences join up. Each of those joins has to be taught.
test("every joining word B1 needs has a lesson", async () => {
  const { GRAMMAR_B1 } = await import("../public/js/data/grammar3.js");
  const all = GRAMMAR_B1.flatMap(l => [l.title.najdi, l.intro.najdi, ...l.rows.map(r => r.ar)]).join(" ");
  for (const word of ["عشان", "لأن", "مع إن", "إن", "قبل ما", "بعد ما", "لين", "أول ما", "يا ليت", "المفروض", "صار", "للحين", "ممكن", "المهم"]) {
    assert.ok(all.includes(word), `B1 grammar never teaches "${word}"`);
  }
});
