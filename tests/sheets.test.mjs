// The printable tracing sheets (scripts/sheets-html.mjs → public/worksheets/*.pdf).
//
// He prints these on A4 and writes on them with a black pen, so two things are checked hard: that
// every letter of the alphabet really gets a sheet with its sound in both alphabets, and that the
// black-and-white set has nothing solid on it where he writes — on a mono printer a solid letter
// comes out the same black as his own hand and he cannot tell them apart.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, statSync } from "node:fs";
import { BOOKLETS, LETTERS } from "../scripts/sheets-html.mjs";
import { uaSay } from "../public/js/core/ua.js";

const pages = html => html.split('<section class="page').length - 1;

test("five booklets, printed in colour and in black and white", () => {
  assert.equal(BOOKLETS.length, 5);
  assert.deepEqual(BOOKLETS.map(b => b.file),
    ["1-letters", "2-in-a-word", "3-look-alike", "4-marks", "5-practice-paper"]);
  for (const b of BOOKLETS) for (const mode of ["colour", "mono"]) {
    const html = b.html(mode);
    assert.ok(html.startsWith("<!doctype html>"), `${b.file}: not a document`);
    assert.ok(pages(html) >= 4, `${b.file}: only ${pages(html)} pages`);
    assert.ok(/size: A4 portrait/.test(html), `${b.file}: not set for A4`);
  }
});

test("every letter gets a sheet, with its sound in English and in Ukrainian letters", () => {
  assert.equal(LETTERS.length, 28);
  const html = BOOKLETS[0].html("colour");
  assert.equal(pages(html), 29, "a cover and the 28 letters");
  for (const l of LETTERS) {
    assert.ok(html.includes(l.name), `${l.char}: the name is missing`);
    assert.ok(html.includes(l.sound.en), `${l.char}: the English sound is missing`);
    assert.ok(html.includes(l.example.ar), `${l.char}: the example word is missing`);
    const ua = uaSay(l.translit.replace(/\s*→\s*/g, " → ")).split(" → ")[0];
    assert.ok(html.includes(ua), `${l.char}: the Ukrainian letter ${ua} is missing`);
  }
});

test("the black-and-white sheets have nothing solid where he writes", () => {
  for (const b of BOOKLETS) {
    const mono = b.html("mono"), colour = b.html("colour");
    // the letter he traces is drawn as dashes in both, and only the colour one fills it in
    assert.ok(!/class="dots"/.test(mono), `${b.file}: the mono sheet still fills a letter in`);
    assert.ok(!/<text class="ink"/.test(mono), `${b.file}: the mono sheet still has solid ink`);
    assert.ok(/stroke-dasharray/.test(mono), `${b.file}: the mono sheet has no dashes at all`);
    assert.ok(!/green =/.test(mono), `${b.file}: the mono sheet still points at a colour`);
    if (b.file !== "5-practice-paper") assert.ok(/class="dots"/.test(colour), `${b.file}: the colour sheet lost its green dots`);
  }
});

test("both languages on the sheets, and the files are really printed", () => {
  const html = BOOKLETS[0].html("colour");
  for (const word of ["الحَرْف", "مَوْصُول", "لِحَالَك", "اكْتِبْها بْيَدَك"])
    assert.ok(html.includes(word), `the Arabic for the sheet is missing: ${word}`);
  for (const word of ["The letter", "Joined up", "On your own", "write it by hand"])
    assert.ok(html.includes(word), `the English for the sheet is missing: ${word}`);

  const dir = new URL("../public/worksheets/", import.meta.url);
  for (const b of BOOKLETS) for (const suffix of ["", "-bw"]) {
    const file = new URL(b.file + suffix + ".pdf", dir);
    assert.ok(existsSync(file), `public/worksheets/${b.file}${suffix}.pdf is missing — run npm run sheets`);
    assert.ok(statSync(file).size > 40000, `${b.file}${suffix}.pdf is too small to be a booklet`);
  }
});
