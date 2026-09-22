// "Talk about yourself" (core/aboutme.js, data/me.js): every choice in three languages, and whatever you choose,
// every sentence comes out in Najdi, pronunciation, English and Ukrainian.
import { test } from "node:test";
import assert from "node:assert/strict";
import { aboutMe } from "../public/js/core/aboutme.js";
import * as ME from "../public/js/data/me.js";

const check = (l, where) => {
  for (const f of ["ar", "say", "en", "uk"]) assert.ok(l[f], `${where}: ${f}`);
  assert.match(l.ar, /[؀-ۿ]/, `${where}: ${l.ar}`);
  assert.match(l.uk, /[Ѐ-ӿ]/, `${where}: ${l.uk}`);
  assert.doesNotMatch(l.say, /[؀-ۿ]/, `${where}: ${l.say}`);
  assert.doesNotMatch(`${l.ar} ${l.say} ${l.en} ${l.uk}`, /undefined|null|NaN/, `${where}: ${l.en}`);
};

test("every choice: Najdi, pronunciation, English, Ukrainian", () => {
  for (const list of ["NAMES", "CITIES", "COUNTRIES", "JOBS", "LANGUAGES", "HOBBIES", "FOODS"]) {
    assert.equal(new Set(ME[list].map(x => x.id)).size, ME[list].length, `${list}: ids`);
    for (const x of ME[list]) check(x, `${list} ${x.id}`);
  }
  for (const c of ME.CITIES) assert.match(c.ukFrom, /^(з|зі|із) /);
  for (const c of ME.COUNTRIES) assert.match(c.ukIn, /^(в|у) /);
});

test("whatever you choose, every sentence is complete", () => {
  const cases = [
    {},
    { age: 28, city: "kyiv", country: "poland", langs: ["uk", "en", "ru"], hobbies: ["football", "travel", "cooking"], brothers: 1, sisters: 2 },
    { name: "vova", age: 21, country: "saudi", job: "none", langs: [], hobbies: ["desert"], brothers: 4, sisters: 0, food: "borscht" },
    { name: "volodymyr", age: 33, city: "frankivsk", job: "student", langs: ["de"], brothers: 0, sisters: 5 },
  ];
  for (const [k, me] of cases.entries()) {
    for (const day of ["2026-09-25", "2026-11-22", "2027-01-15", "2027-12-30"]) {
      const r = aboutMe(me, day);
      r.intro.forEach((l, i) => check(l, `case ${k} ${day} line ${i}`));
      r.qa.forEach((x, i) => (check(x.q, `case ${k} q${i}`), check(x.a, `case ${k} a${i}`)));
      r.askHer.forEach((l, i) => check(l, `ask ${i}`));
    }
  }
  assert.match(aboutMe({ brothers: 1, sisters: 2 }).intro.find(l => l.ar.startsWith("عندي")).ar, /^عندي أخ واحد وأختين/);
  assert.ok(aboutMe({}, "2026-09-25").intro.some(l => l.ar.startsWith("توني بديت")));
  assert.ok(aboutMe({}, "2027-01-15").intro.some(l => l.ar.startsWith("صار لي ثلاث شهور")));
});
