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

test("the phrase book: four languages, unique, and every unflagged phrase is in NAJDI-PLAN.md word for word", async () => {
  const { readFileSync } = await import("node:fs");
  const plan = readFileSync(new URL("../NAJDI-PLAN.md", import.meta.url), "utf8").split("\n");
  assert.ok(LOVE.LOVE_ITEMS.length >= 120);
  assert.equal(new Set(LOVE.LOVE_ITEMS.map(x => x.id)).size, LOVE.LOVE_ITEMS.length, "two phrases share an id");
  for (const l of LOVE.LOVE) for (const f of ["en", "uk", "najdi", "msa"]) assert.ok(l.title[f], `section ${l.id}: title ${f}`);
  for (const x of LOVE.LOVE_ITEMS) {
    checkLine(x, `phrase ${x.section}`);
    assert.ok(x.say && /[a-z]/.test(x.say), `${x.ar}: pronunciation`);
    if (x.north) assert.match(x.north.ar, /چ/, `${x.ar}: the northern form should have چ`);
    if (!x.check) assert.ok(plan.some(line => line.includes(x.ar) && line.includes(x.say)), `${x.ar} (${x.say}) is not flagged but isn't in the plan`);
  }
  for (const f of ["en", "uk", "najdi", "msa"]) assert.ok(LOVE.LOVE_INTRO[f]);
});

test("her birthday: goals and wishes in four languages; the date is 2 Ramadan 1448", async () => {
  const B = await import("../public/js/data/birthday.js");
  for (const g of B.GOALS) for (const f of ["en", "uk", "najdi", "msa"]) assert.ok(g[f], `goal ${g.id}: ${f}`);
  assert.equal(new Set(B.GOALS.map(g => g.id)).size, B.GOALS.length);
  B.SPEECH.forEach((x, i) => (checkLine(x, `wish ${i + 1}`), assert.ok(x.say)));
  const hijri = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", { day: "numeric", month: "long" }).format(new Date(`${B.BIRTHDAY}T12:00:00Z`));
  assert.match(hijri, /Ramadan 2/);
});

test("her words and the rude words: four languages, pronunciation, a level for each rude one", async () => {
  const H = await import("../public/js/data/hers.js");
  assert.ok(H.HER_WORDS.length >= 9);
  for (const w of [...H.HER_WORDS, ...H.RUDE]) {
    for (const f of ["ar", "say", "en", "uk", "msa"]) assert.ok(w[f], `${w.ar}: ${f}`);
    assert.match(w.uk, /[Ѐ-ӿ]/);
    assert.match(w.msa, /[؀-ۿ]/);
  }
  for (const w of H.RUDE) assert.ok(["rude", "very rude"].includes(w.level), `${w.ar}: level`);
  assert.equal(new Set([...H.HER_WORDS, ...H.RUDE].map(w => w.id)).size, H.HER_WORDS.length + H.RUDE.length);
});

test("chats: every line in three languages with pronunciation; clean text for the voice", async () => {
  const C = await import("../public/js/data/chats.js");
  assert.ok(C.CHATS.length >= 10);
  for (const c of C.CHATS) for (const f of ["en", "uk", "najdi", "msa"]) assert.ok(c.title[f], `${c.id} title ${f}`);
  for (const l of C.CHAT_LINES) {
    for (const f of ["who", "ar", "say", "en", "uk", "speak"]) assert.ok(l[f], `${l.id}: ${f}`);
    assert.match(l.uk, /[Ѐ-ӿ]/, `${l.id}: Ukrainian`);
    assert.doesNotMatch(l.speak, /[A-Za-z]|\p{Extended_Pictographic}/u, `${l.id}: what the voice reads`);
    assert.ok(["him", "her", "other"].includes(l.who));
    const words = l.ar.replace(/[؟?…!.،:]/g, " ").split(/\s+/);
    for (const trap of ["شو", "فين", "عايز", "بدي", "كويس", "ليه", "كمان", "مش", "إيش", "هيك", "بحبك"]) assert.ok(!words.includes(trap), `${l.id}: ${trap}`);
  }
  assert.equal(new Set(C.CHAT_LINES.map(l => l.id)).size, C.CHAT_LINES.length);
});
