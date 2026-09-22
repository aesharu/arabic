// Culture cards (public/js/data/culture.js) and page scenes (public/js/core/scenes.js): every story in four languages,
// on pages that exist, with a picture that exists and a word with pronunciation, English and Ukrainian.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CULTURE } from "../public/js/data/culture.js";

const main = readFileSync(new URL("../public/js/main.js", import.meta.url), "utf8");
const routes = new Set(main.match(/const routes = \{([^}]*)\}/)[1].split(",").map(s => s.trim()));
const scenes = readFileSync(new URL("../public/js/core/scenes.js", import.meta.url), "utf8");
const sceneNames = new Set([...scenes.matchAll(/^  (\w+): \[/gm)].map(m => m[1]));

test("culture stories: four languages, pages and pictures that exist, a word to hear", () => {
  assert.ok(CULTURE.length >= 15);
  assert.equal(new Set(CULTURE.map(c => c.id)).size, CULTURE.length);
  for (const c of CULTURE) {
    for (const l of ["en", "uk", "najdi", "msa"]) assert.ok(c.title[l] && c.text[l], `${c.id}: ${l}`);
    assert.match(c.text.uk, /[Ѐ-ӿ]/, `${c.id}: Ukrainian`);
    assert.match(c.text.najdi, /[؀-ۿ]/, `${c.id}: Najdi`);
    assert.ok(["north", "saudi"].includes(c.kind), `${c.id}: kind`);
    assert.ok(sceneNames.has(c.pic), `${c.id}: picture ${c.pic}`);
    for (const p of c.pages) assert.ok(routes.has(p), `${c.id}: page ${p}`);
    const [ar, say, en, uk] = c.word;
    assert.match(ar, /[؀-ۿ]/);
    assert.ok(say && en && /[Ѐ-ӿ]/.test(uk), `${c.id}: word`);
  }
});

test("every scene has its word in three languages", () => {
  const words = scenes.slice(scenes.indexOf("export const SCENE_WORDS"), scenes.indexOf("export const hasScene"));
  const draw = [...scenes.slice(0, scenes.indexOf("// The word under each scene")).matchAll(/^  (\w+): \(\) =>/gm)].map(m => m[1]);
  assert.ok(draw.length >= 15);
  for (const name of draw) {
    const m = words.match(new RegExp(`^  ${name}: \\["([^"]+)", "([^"]+)", "([^"]+)", "([^"]+)"\\]`, "m"));
    assert.ok(m, `scene ${name} has no word`);
    assert.match(m[1], /[؀-ۿ]/);
    assert.match(m[4], /[Ѐ-ӿ]/);
  }
});
