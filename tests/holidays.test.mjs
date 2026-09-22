// Special days on the welcome screen (public/js/data/holidays.js): the right day for each, every phrase with
// Saudi Arabic, pronunciation, English and Ukrainian, facts in four languages, and plan phrases unflagged.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { HOLIDAYS, holidayOn } from "../public/js/data/holidays.js";
import { OCCASIONS } from "../public/js/data/saudi.js";

const plan = readFileSync(new URL("../NAJDI-PLAN.md", import.meta.url), "utf8");
const at = key => holidayOn(key)?.id ?? null;

test("each special day falls on its date (Saudi time, Umm al-Qura)", () => {
  assert.equal(at("2026-09-22"), null);
  assert.equal(at("2026-09-23"), "national");
  assert.equal(at("2026-09-24"), null);
  assert.equal(at("2027-02-08"), "ramadan"); // 1 Ramadan 1448
  assert.equal(at("2027-02-09"), "birthday"); // her birthday wins over Ramadan
  assert.equal(at("2027-02-10"), "ramadan");
  assert.equal(at("2027-02-11"), null);
  assert.equal(at("2027-02-22"), "founding");
  assert.equal(at("2027-03-09"), "fitr");
  assert.equal(at("2027-03-11"), "fitr");
  assert.equal(at("2027-03-12"), null);
  assert.equal(at("2027-05-15"), "arafah");
  assert.equal(at("2027-05-16"), "adha");
  assert.equal(at("2027-05-19"), "adha");
  assert.equal(at("2027-05-20"), null);
  assert.equal(at("2027-06-06"), "newyear");
  assert.equal(at("2027-09-23"), "national");
});

test("every occasion on Saudi life has its greeting", () => {
  for (const o of OCCASIONS) assert.ok(HOLIDAYS.some(h => h.id === (o.id === "ramadan" ? "ramadan" : o.id)), o.id);
});

test("every phrase: Arabic, pronunciation, English, Ukrainian; facts in four languages", () => {
  assert.equal(new Set(HOLIDAYS.map(h => h.id)).size, HOLIDAYS.length);
  for (const h of HOLIDAYS) {
    for (const l of ["en", "uk", "najdi", "msa"]) assert.ok(h.name[l], `${h.id} name ${l}`);
    for (const k of ["title", "titleV", "toHer", "sayToHer", "reply"]) {
      const p = h[k];
      if (!p) continue;
      assert.match(p.ar, /[؀-ۿ]/, `${h.id} ${k} Arabic`);
      assert.ok(p.say && !/[؀-ۿ]/.test(p.say), `${h.id} ${k} pronunciation`);
      assert.ok(p.en, `${h.id} ${k} English`);
      assert.match(p.uk, /[Ѐ-ӿ]/, `${h.id} ${k} Ukrainian`);
    }
    for (const k of ["fact", "factV"]) {
      if (!h[k]) continue;
      for (const l of ["en", "uk", "najdi", "msa"]) assert.ok(h[k][l], `${h.id} ${k} ${l}`);
      assert.match(h[k].uk, /[Ѐ-ӿ]/);
      assert.match(h[k].najdi, /[؀-ۿ]/);
    }
    assert.ok(h.title && h.toHer && h.sayToHer, `${h.id}: greeting, line to her, line for him`);
  }
});

test("what he says to her is the plan's own phrase, or it carries the tutor flag", () => {
  for (const h of HOLIDAYS) {
    const inPlan = h.sayToHer.ar.split("، ").every(part => plan.includes(`| ${part.replace(/ يا ديما$/, "")} |`));
    if (!inPlan) assert.ok(h.check, `${h.id}: «${h.sayToHer.ar}» isn't in the plan — flag it`);
  }
});
