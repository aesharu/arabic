// Saudi life (public/js/data/saudi.js, core/prayer.js): four languages, flags on words not in the plan, sane prayer times.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { STORIES, FACTS, OCCASIONS, REGIONS } from "../public/js/data/saudi.js";
import { prayerTimes, qibla, CITIES } from "../public/js/core/prayer.js";

const plan = readFileSync(new URL("../NAJDI-PLAN.md", import.meta.url), "utf8");
const L = ["en", "uk", "najdi", "msa"];

test("stories, facts and occasions are in four languages", () => {
  for (const s of STORIES) {
    for (const l of L) assert.ok(s.title[l] && s.body[l], `${s.id}: ${l}`);
    assert.ok(REGIONS[s.region], `${s.id}: region`);
    assert.match(s.body.uk, /[Ѐ-ӿ]/, `${s.id}: Ukrainian`);
  }
  for (const f of FACTS) for (const l of L) assert.ok(f[l], `fact ${f.en}: ${l}`);
  for (const o of OCCASIONS) for (const l of L) assert.ok(o.name[l], `${o.id}: ${l}`);
});

test("a culture word without the tutor flag must be in the plan", () => {
  for (const s of STORIES) for (const w of s.words) {
    for (const f of ["ar", "say", "en", "uk", "msa"]) assert.ok(w[f], `${w.ar}: ${f}`);
    assert.match(w.uk, /[Ѐ-ӿ]/, `${w.ar}: Ukrainian`);
    if (!w.check) assert.ok(plan.includes(w.ar), `${w.ar} is not in the plan, so it needs the check flag`);
  }
});

test("the north gets its own stories", () => {
  assert.ok(STORIES.filter(s => s.region === "north").length >= 5);
});

test("prayer times for Riyadh are in the right order and the right hours", () => {
  const riyadh = CITIES.find(c => c.id === "riyadh");
  const t = prayerTimes("2026-09-21", riyadh);
  const h = d => (d.getUTCHours() + 3) % 24 + d.getUTCMinutes() / 60;
  const order = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"].map(k => t[k].getTime());
  assert.deepEqual([...order].sort((a, b) => a - b), order);
  assert.ok(h(t.fajr) > 4 && h(t.fajr) < 5, "Fajr around 4:20");
  assert.ok(h(t.dhuhr) > 11.5 && h(t.dhuhr) < 12, "Dhuhr around 11:45");
  assert.ok(h(t.maghrib) > 17.6 && h(t.maghrib) < 18, "Maghrib around 17:50");
  assert.equal((t.isha - t.maghrib) / 60e3, 90, "Isha 90 minutes after Maghrib outside Ramadan");
  const q = qibla(riyadh);
  assert.ok(q.bearing > 240 && q.bearing < 248 && q.km > 750 && q.km < 830, "Mecca is west-south-west of Riyadh, ~790 km");
});

test("her city, Hafar al-Batin, is first: prayer times in order, Mecca to the south-west", () => {
  assert.equal(CITIES[0].id, "hafar");
  const t = prayerTimes("2026-09-22", CITIES[0]);
  const h = d => (d.getUTCHours() + 3) % 24 + d.getUTCMinutes() / 60;
  assert.ok(h(t.fajr) > 4.2 && h(t.fajr) < 4.6, "Fajr around 4:23");
  assert.ok(h(t.maghrib) > 17.7 && h(t.maghrib) < 18, "Maghrib around 17:53");
  const q = qibla(CITIES[0]);
  assert.ok(q.bearing > 214 && q.bearing < 226 && q.km > 950 && q.km < 1040, "Mecca is south-west of Hafar al-Batin, ~1000 km");
});
