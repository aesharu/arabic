// Special days on the welcome screen (public/js/data/holidays.js): the right day for each, every phrase with
// Saudi Arabic, pronunciation, English and Ukrainian, facts in four languages, and plan phrases unflagged.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { HOLIDAYS, holidayOn, HIJRI_DATES, HIJRI_DATES_UNTIL } from "../public/js/data/holidays.js";
import { hijriParts } from "../public/js/core/prayer.js";
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

test("the written-out Hijri dates are the Umm al-Qura calendar's, one a year with no gaps", () => {
  const first = { newyear: [1, 1], ramadan: [9, 1], fitr: [10, 1], arafah: [12, 9], adha: [12, 10] };
  for (const [id, dates] of Object.entries(HIJRI_DATES)) {
    assert.ok(HOLIDAYS.some(h => h.id === id), id);
    dates.forEach((d, i) => {
      const h = hijriParts(new Date(`${d}T12:00:00Z`));
      assert.deepEqual([h.month, h.day], first[id], `${id} ${d}`);
      if (i) assert.ok((Date.parse(d) - Date.parse(dates[i - 1])) / 864e5 >= 353 && (Date.parse(d) - Date.parse(dates[i - 1])) / 864e5 <= 356, `${id}: a year missing before ${d}`);
    });
    // the list reaches past the date where the calendar takes over
    const next = new Date(Date.parse(dates.at(-1)) + 356 * 864e5).toISOString().slice(0, 10);
    assert.ok(next >= HIJRI_DATES_UNTIL, `${id}: the list stops too early`);
  }
});

test("every day from now to the end of the list: the list and the calendar agree", () => {
  const byCalendar = key => {
    const h = hijriParts(new Date(`${key}T12:00:00Z`));
    return HOLIDAYS.find(o => (o.greg ? key.slice(5) === o.greg : h.month === o.hijri[0] && h.day >= o.hijri[1] && h.day < o.hijri[1] + o.hijri[2]))?.id ?? null;
  };
  for (let t = Date.parse("2026-09-01T12:00:00Z"); ; t += 864e5) {
    const key = new Date(t).toISOString().slice(0, 10);
    if (key >= HIJRI_DATES_UNTIL) break;
    assert.equal(at(key), byCalendar(key), key);
  }
});
