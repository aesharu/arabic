// Love, in her dialect (public/js/data/love.js): every text in four languages, in the right scripts,
// and no Egyptian or Levantine words.
import { test } from "node:test";
import assert from "node:assert/strict";
import * as LOVE from "../public/js/data/love.js";

const TRAPS = ["إزيك", "شو", "فين", "عايز", "بدي", "دلوقتي", "هلق", "كويس", "ليه", "كمان", "مش", "دحين", "إيش", "ازاي", "هيك", "منيح", "بحبك", "كتير", "هلأ"];

export function checkLine(l, where) {
  for (const f of ["ar", "en", "uk", "msa"]) assert.ok(l[f], `${where} ${l.ar ?? ""}: ${f} is missing`);
  assert.match(l.ar, /[؀-ۿ]/, `${where} ${l.ar}: Najdi should be Arabic`);
  assert.match(l.msa, /[؀-ۿ]/, `${where} ${l.ar}: MSA should be Arabic`);
  assert.match(l.uk, /[Ѐ-ӿ]/, `${where} ${l.ar}: Ukrainian should be Cyrillic`);
  const words = l.ar.replace(/[؟?…!.،:]/g, " ").split(/\s+/);
  for (const trap of TRAPS) assert.ok(!words.includes(trap), `${where}: ${l.ar} contains ${trap}`);
}

test("Dima's welcome: the headline and at least 40 different compliments, in four languages", () => {
  checkLine(LOVE.LOVE_HEADLINE, "headline");
  assert.ok(LOVE.COMPLIMENTS.length >= 40);
  LOVE.COMPLIMENTS.forEach((c, i) => checkLine(c, `compliment ${i + 1}`));
  assert.equal(new Set(LOVE.COMPLIMENTS.map(c => c.ar)).size, LOVE.COMPLIMENTS.length, "a compliment is repeated");
});
