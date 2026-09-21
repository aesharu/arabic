// The Word list, the Cards and the Anki decks are generated from NAJDI-PLAN.md and NAJDI-WORDS.md by `npm run vocab`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const root = new URL("../", import.meta.url);
const vocab = JSON.parse(readFileSync(new URL("public/data/vocab.json", root), "utf8"));
const plan = readFileSync(new URL("NAJDI-PLAN.md", root), "utf8");
const candidates = readFileSync(new URL("NAJDI-WORDS.md", root), "utf8");
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

test("every entry is in four languages and its Arabic comes from the plan (or NAJDI-WORDS.md for Stages 4–5)", () => {
  for (const e of entries) {
    for (const f of ["id", "ar", "say", "en", "msa", "uk"]) assert.ok(e[f], `${e.ar}: ${f} missing`);
    assert.match(e.msa, /[؀-ۿ]/, `${e.ar}: MSA should be Arabic`);
    assert.match(e.uk, /[Ѐ-ӿ]/, `${e.ar}: Ukrainian should be Cyrillic`);
    const source = e.stage === "4" ? candidates : plan;
    for (const part of e.ar.split(/ [/→] /)) assert.ok(source.includes(part.trim()), `${part} not found in ${e.stage === "4" ? "NAJDI-WORDS.md" : "the plan"}`);
    if (e.note) for (const l of ["en", "uk", "najdi", "msa"]) assert.ok(e.note[l], `${e.ar}: note ${l} missing`);
  }
  for (const s of vocab.stages) for (const t of s.topics) for (const l of ["en", "uk", "najdi", "msa"]) assert.ok(t.title[l], `topic ${t.id}: ${l}`);
});

test("one Anki deck per stage, one card per entry", () => {
  const files = { "1": "najdi-stage1.csv", "2": "najdi-stage2.csv", "3": "najdi-stage3.csv", "4": "najdi-stage4-5.csv", special: "najdi-special.csv", grammar: "najdi-grammar.csv" };
  for (const s of vocab.stages) {
    const file = new URL(`public/anki/${files[s.id]}`, root);
    assert.ok(existsSync(file), `${files[s.id]} missing`);
    const lines = readFileSync(file, "utf8").trim().split("\n");
    assert.ok(lines[0].startsWith("#separator") && lines.some(l => l.startsWith("#deck:Najdi::")), "Anki headers missing");
    const cards = lines.filter(l => !l.startsWith("#")).length;
    assert.equal(cards, s.topics.reduce((n, t) => n + t.entries.length, 0), `${files[s.id]}: card count`);
  }
});

// NAJDI-WORDS.md holds suggestions, not verified Najdi: every one shows "check with tutor" until its row has a ✓.
test("Stage 4–5 words are flagged until a native speaker ticks them", () => {
  const checked = new Set(candidates.split("\n").filter(l => /\|\s*✓\s*\|\s*$/.test(l)).map(l => l.split("|")[1].trim()));
  for (const e of entries.filter(e => e.stage === "4")) {
    assert.equal(e.check, !checked.has(e.ar), `${e.ar}: flag should be ${!checked.has(e.ar)}`);
    if (e.check) assert.ok(e.note?.en, `${e.ar}: needs the "suggested word" note`);
  }
});

test("the word list reaches 1000 different words, and no candidate repeats a plan word", () => {
  const bare = ar => ar.replace(/[\u064B-\u0652ـ؟?…!.،]/g, "").trim();
  const words = new Set(entries.map(e => `${e.ar}|${e.en}`));
  assert.ok(words.size >= 1000, `only ${words.size} words`);
  const inPlan = new Set(entries.filter(e => e.stage !== "4").map(e => bare(e.ar)));
  for (const e of entries.filter(e => e.stage === "4")) assert.ok(!inPlan.has(bare(e.ar)), `${e.ar} is already in the plan`);
});

// Part 8 of the plan: the Egyptian, Levantine and Hijazi words to avoid. None may sneak into the Najdi column.
test("no Egyptian, Levantine or Hijazi words in the Najdi", () => {
  const TRAPS = ["إزيك", "عامل إيه", "شو", "فين", "عايز", "بدي", "دلوقتي", "هلق", "كويس", "وحشتني", "ليه", "كمان", "مش", "دحين", "إيش", "برضو", "ازاي", "هيك", "منيح", "لسه"];
  for (const e of entries) {
    const words = e.ar.replace(/[؟?…!.،]/g, " ").split(/\s+/);
    for (const trap of TRAPS) assert.ok(!words.includes(trap) && !(trap.includes(" ") && e.ar.includes(trap)), `${e.ar} contains ${trap}`);
  }
});
