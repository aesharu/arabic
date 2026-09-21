// Every interface text must exist in all four languages — English, Ukrainian, Najdi Arabic and formal Arabic
// (MSA) — with the same {placeholders}; every key the code asks for must exist, and every key must be used.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { STRINGS } from "../public/js/i18n/strings.js";

const root = new URL("../public/", import.meta.url).pathname;
const files = dir => readdirSync(dir).flatMap(f => (statSync(join(dir, f)).isDirectory() ? files(join(dir, f)) : [join(dir, f)]));
const code = files(root).filter(f => /\.(js|html)$/.test(f) && !f.endsWith("strings.js")).map(f => readFileSync(f, "utf8")).join("\n");
const placeholders = s => [...s.matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort();
const ARABIC = /[؀-ۿ]/;
const CYRILLIC = /[Ѐ-ӿ]/;
const PLURALS = { en: ["one", "other"], uk: ["one", "few", "many", "other"], najdi: ["zero", "one", "two", "few", "many", "other"], msa: ["zero", "one", "two", "few", "many", "other"] };

test("every string exists in English, Ukrainian, Najdi and MSA", () => {
  for (const [key, v] of Object.entries(STRINGS)) {
    for (const lang of ["en", "uk", "najdi", "msa"]) assert.ok(v[lang], `${key}: ${lang} missing`);
    if (typeof v.en === "object") {
      for (const [lang, forms] of Object.entries(PLURALS)) for (const f of forms) assert.ok(v[lang][f], `${key}: ${lang} needs the "${f}" form`);
      continue;
    }
    for (const lang of ["uk", "najdi", "msa"]) assert.deepEqual(placeholders(v[lang]), placeholders(v.en), `${key}: ${lang} placeholders differ`);
    assert.notEqual(v.uk, v.en, `${key}: Ukrainian is identical to English — not translated?`);
    assert.match(v.uk, CYRILLIC, `${key}: Ukrainian should be in Cyrillic`);
    assert.match(v.najdi, ARABIC, `${key}: Najdi should be in Arabic script`);
    assert.match(v.msa, ARABIC, `${key}: MSA should be in Arabic script`);
  }
});

test("every key used in the code exists", () => {
  const used = [
    ...code.matchAll(/\bt[u]?\(\s*"([\w.]+)"/g),
    ...code.matchAll(/data-i18n(?:-label)?="([\w.]+)"/g),
    ...code.matchAll(/"((?:form|letters|quiz|reading|words|progress)\.\w+)"/g),
  ].map(m => m[1]);
  for (const key of new Set(used)) assert.ok(STRINGS[key], `missing string: ${key}`);
});

test("every defined key is used somewhere", () => {
  const dynamic = ["status.", "theme.", "cloud.status.", "cloud.short."]; // built as t(`status.${s}`) etc.
  for (const key of Object.keys(STRINGS)) {
    if (dynamic.some(p => key.startsWith(p))) continue;
    assert.ok(code.includes(`"${key}"`), `unused string: ${key}`);
  }
});
