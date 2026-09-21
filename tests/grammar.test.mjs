// The grammar lessons (public/js/data/grammar.js) must be the plan's Part 5, in all four languages.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { GRAMMAR } from "../public/js/data/grammar.js";

const plan = readFileSync(new URL("../NAJDI-PLAN.md", import.meta.url), "utf8");
const part5 = plan.slice(plan.indexOf("## Part 5"), plan.indexOf("## Part 6"));

test("nine grammar lessons, one per pattern in Part 5", () => {
  assert.equal(GRAMMAR.length, (part5.match(/^### 5\.\d/gm) ?? []).length);
});

test("every grammar example comes from Part 5 and is in four languages", () => {
  for (const l of GRAMMAR) {
    for (const k of ["en", "uk", "najdi", "msa"]) {
      assert.ok(l.title[k] && l.intro[k], `lesson ${l.id}: ${k} missing`);
    }
    assert.match(l.intro.uk, /[Ѐ-ӿ]/, `lesson ${l.id}: Ukrainian intro should be Cyrillic`);
    for (const r of l.rows) {
      for (const f of ["ar", "say", "en", "uk", "msa"]) assert.ok(r[f], `${l.id} ${r.ar}: ${f} missing`);
      assert.match(r.uk, /[Ѐ-ӿ]/, `${r.ar}: Ukrainian should be Cyrillic`);
      assert.match(r.msa, /[؀-ۿ]/, `${r.ar}: MSA should be Arabic`);
      for (const part of r.ar.split(" → ")) assert.ok(part5.includes(part.replace("؟", "")), `${part} is not in Part 5 of the plan`);
      for (const part of r.say.split(" → ")) assert.ok(part5.includes(part.replace("?", "")), `${part} (say) is not in Part 5`);
      if (r.note) for (const k of ["en", "uk", "najdi", "msa"]) assert.ok(r.note[k], `${r.ar}: note ${k}`);
    }
  }
});

test("the plan's ⚠ grammar items carry the check-with-tutor flag", () => {
  const flagged = GRAMMAR.flatMap(l => l.rows).filter(r => r.check).map(r => r.say);
  assert.deepEqual(flagged.sort(), ["kint", "rāḥaw"]);
});
