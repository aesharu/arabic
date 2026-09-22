// Verbs (public/js/data/verbs.js, core/verbs.js): the built forms of "go" are exactly the plan's tables (Part 5.4–5.5),
// and every verb has all its forms, meanings in English and Ukrainian, and pronunciation.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { VERBS } from "../public/js/data/verbs.js";
import { PERSONS, conjugate, patterns } from "../public/js/core/verbs.js";

const plan = readFileSync(new URL("../NAJDI-PLAN.md", import.meta.url), "utf8");
const section = (from, to) => plan.slice(plan.indexOf(from), plan.indexOf(to));
// "| I go | أروح | arūḥ |" → [أروح, arūḥ]; bold (**…**) and ⚠ removed.
const rows = text => [...text.matchAll(/^\|[^|]+\|\s*\**([^|*]+?)\**\s*\|\s*\**([^|*]+?)\**\s*\|$/gm)]
  .map(m => [m[1].trim(), m[2].replace("⚠", "").trim()])
  .filter(([ar]) => /[؀-ۿ]/.test(ar));

test("“go” is the plan's own table, present and past", () => {
  const go = conjugate(VERBS.find(v => v.id === "go"));
  assert.deepEqual(go.now.map(f => [f.ar, f.say]), rows(section("### 5.4", "### 5.5")));
  assert.deepEqual(go.past.map(f => [f.ar, f.say]), rows(section("### 5.5", "### 5.6")));
});

test("every verb: all eight people in three tenses, meanings, pronunciation, unique ids", () => {
  assert.ok(VERBS.length >= 40);
  assert.equal(new Set(VERBS.map(v => v.id)).size, VERBS.length);
  for (const v of VERBS) {
    for (const f of ["en", "enPast", "ukInf", "ukNow", "ukPast"]) assert.ok(v[f], `${v.id}: ${f}`);
    for (const f of ["ukInf", "ukNow", "ukPast"]) assert.match(v[f], /[Ѐ-ӿ]/, `${v.id}: ${f} should be Cyrillic`);
    const c = conjugate(v);
    for (const k of ["now", "past", "will"]) {
      assert.equal(c[k].length, PERSONS.length, `${v.id} ${k}`);
      for (const f of c[k]) {
        assert.match(f.ar, /^[؀-ۿ]+$/, `${v.id} ${k}: ${f.ar}`);
        assert.match(f.say, /^[a-zāīūēōḥṣṭẓḍʿʾ]+$/, `${v.id} ${k}: ${f.say}`);
      }
    }
    assert.ok(c.now[2].ar.endsWith("ين") && c.now[2].say.endsWith("īn"), `${v.id}: “to her” present ends in -īn`);
    assert.ok(c.past[2].ar.endsWith("ي"), `${v.id}: “to her” past ends in -i`);
    if (v.imp) for (const w of ["him", "her"]) assert.ok(v.imp[w].ar && v.imp[w].say, `${v.id}: imperative ${w}`);
    if (v.note) for (const l of ["en", "uk", "najdi", "msa"]) assert.ok(v.note[l], `${v.id}: note ${l}`);
    for (const p of patterns(v)) {
      assert.ok(p.ar && p.say && p.en && p.uk, `${v.id}: pattern`);
      assert.match(p.uk, /[Ѐ-ӿ]/);
    }
    assert.equal(v.check, v.id !== "go", `${v.id}: only “go” comes from the plan`);
  }
});
