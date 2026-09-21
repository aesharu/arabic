// The Words page and the Anki decks are generated from NAJDI-PLAN.md by `npm run vocab`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const root = new URL("../", import.meta.url);
const vocab = JSON.parse(readFileSync(new URL("public/data/vocab.json", root), "utf8"));
const plan = readFileSync(new URL("NAJDI-PLAN.md", root), "utf8");
const entries = vocab.stages.flatMap(s => s.topics.flatMap(t => t.entries.map(e => ({ ...e, stage: s.id, topic: t }))));

test("every vocabulary entry and topic has its translations", () => {
  const r = spawnSync(process.execPath, [new URL("scripts/build-vocab.mjs", root).pathname, "--check"], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stdout + r.stderr);
});

test("vocab.json is up to date with NAJDI-PLAN.md", () => {
  const r = spawnSync(process.execPath, ["-e", `
    process.argv.push("--check");
    import(${JSON.stringify(new URL("scripts/build-vocab.mjs", root).href)});
  `], { encoding: "utf8" });
  const count = +r.stdout.match(/All (\d+) entries/)?.[1];
  assert.equal(entries.length, count, "vocab.json has a different number of entries — run npm run vocab");
});

test("every entry is in four languages and its Arabic comes from the plan", () => {
  for (const e of entries) {
    for (const f of ["ar", "say", "en", "msa", "uk"]) assert.ok(e[f], `${e.ar}: ${f} missing`);
    assert.match(e.msa, /[؀-ۿ]/, `${e.ar}: MSA should be Arabic`);
    for (const part of e.ar.split(/ [/→] /)) assert.ok(plan.includes(part.trim()), `${part} not found in the plan`);
    if (e.note) for (const l of ["en", "uk", "najdi", "msa"]) assert.ok(e.note[l], `${e.ar}: note ${l} missing`);
  }
  for (const s of vocab.stages) for (const t of s.topics) for (const l of ["en", "uk", "najdi", "msa"]) assert.ok(t.title[l], `topic ${t.id}: ${l}`);
});

test("one Anki deck per stage, one card per entry", () => {
  const files = { "1": "najdi-stage1.csv", "2": "najdi-stage2.csv", "3": "najdi-stage3.csv", special: "najdi-special.csv", grammar: "najdi-grammar.csv" };
  for (const s of vocab.stages) {
    const file = new URL(`public/anki/${files[s.id]}`, root);
    assert.ok(existsSync(file), `${files[s.id]} missing`);
    const lines = readFileSync(file, "utf8").trim().split("\n");
    assert.ok(lines[0].startsWith("#separator") && lines.some(l => l.startsWith("#deck:Najdi::")), "Anki headers missing");
    const cards = lines.filter(l => !l.startsWith("#")).length;
    assert.equal(cards, s.topics.reduce((n, t) => n + t.entries.length, 0), `${files[s.id]}: card count`);
  }
});
