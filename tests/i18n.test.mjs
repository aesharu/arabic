// Every interface text must exist in both languages — English and Saudi Arabic — with the same
// {placeholders}; every key the code asks for must exist, and every key must be used.
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
const PLURALS = { en: ["one", "other"], najdi: ["zero", "one", "two", "few", "many", "other"] };

test("every string exists in English and Saudi Arabic", () => {
  for (const [key, v] of Object.entries(STRINGS)) {
    for (const lang of ["en", "najdi"]) assert.ok(v[lang], `${key}: ${lang} missing`);
    if (typeof v.en === "object") {
      for (const [lang, forms] of Object.entries(PLURALS)) for (const f of forms) assert.ok(v[lang][f], `${key}: ${lang} needs the "${f}" form`);
      continue;
    }
    assert.deepEqual(placeholders(v.najdi), placeholders(v.en), `${key}: Saudi placeholders differ`);
    assert.match(v.najdi, ARABIC, `${key}: Saudi Arabic should be in Arabic script`);
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
  const dynamic = ["status.", "theme.", "cloud.status.", "cloud.short.", "st.step.", "st.stepSub.", "gl.", "pr.q.", "path.k.", "nudge.m", "wr.v.", "stage.gate.", "lv.", "badge.", "bg."]; // built as t(`status.${s}`) etc.; tests/game.test.mjs checks every lv./badge./bg. key exists
  for (const key of Object.keys(STRINGS)) {
    if (dynamic.some(p => key.startsWith(p))) continue;
    assert.ok(code.includes(`"${key}"`), `unused string: ${key}`);
  }
});

// The ten messages Dima sees when she comes in are picked as `nudge.m${i}` (core/nudge.js): all ten must be there.
test("all ten of Dima's welcome messages exist, in both languages", () => {
  for (let i = 1; i <= 10; i++) {
    const v = STRINGS[`nudge.m${i}`];
    assert.ok(v, `nudge.m${i} is missing`);
    for (const lang of ["en", "najdi"]) assert.ok(v[lang], `nudge.m${i}: ${lang} missing`);
  }
  assert.ok(!STRINGS["nudge.m11"], "there are eleven messages but core/nudge.js only shows ten");
});
