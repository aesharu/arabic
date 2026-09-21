// Every interface text must exist in English AND Ukrainian, with the same {placeholders},
// and every key the code asks for must exist (and every key defined must be used).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { STRINGS } from "../public/js/i18n/strings.js";

const root = new URL("../public/", import.meta.url).pathname;
const files = dir => readdirSync(dir).flatMap(f => (statSync(join(dir, f)).isDirectory() ? files(join(dir, f)) : [join(dir, f)]));
const code = files(root).filter(f => /\.(js|html)$/.test(f) && !f.endsWith("strings.js")).map(f => readFileSync(f, "utf8")).join("\n");
const placeholders = s => [...s.matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort();

test("every string has English and Ukrainian", () => {
  for (const [key, v] of Object.entries(STRINGS)) {
    if (typeof v.en === "object") {
      assert.ok(v.en.one && v.en.other, `${key}: English needs one/other`);
      assert.ok(v.uk.one && v.uk.few && v.uk.many && v.uk.other, `${key}: Ukrainian needs one/few/many/other`);
    } else {
      assert.ok(v.en?.trim(), `${key}: English missing`);
      assert.ok(v.uk?.trim(), `${key}: Ukrainian missing`);
      assert.deepEqual(placeholders(v.uk), placeholders(v.en), `${key}: placeholders differ`);
      assert.notEqual(v.uk, v.en, `${key}: Ukrainian is identical to English — not translated?`);
    }
  }
});

test("every key used in the code exists", () => {
  const used = [...code.matchAll(/\bt[u]?\(\s*"([\w.]+)"/g), ...code.matchAll(/data-i18n(?:-label)?="([\w.]+)"/g), ...code.matchAll(/"((?:form|letters|quiz|reading)\.[\w]+)"/g)].map(m => m[1]);
  for (const key of new Set(used)) assert.ok(STRINGS[key], `missing string: ${key}`);
});

test("every defined key is used somewhere", () => {
  const dynamic = ["status.", "theme."]; // built as t(`status.${s}`) and t(`theme.${name}`)
  for (const key of Object.keys(STRINGS)) {
    if (dynamic.some(p => key.startsWith(p))) continue;
    assert.ok(code.includes(`"${key}"`), `unused string: ${key}`);
  }
});
