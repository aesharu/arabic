// The Najdi A1–B2 page (public/najdi) and the deck behind it.
//
// The deck he bought is licensed to him, not to the internet: it is not in this repository and it is
// not a public file. It lives in his own D1 database and /api/najdi hands it over only to his own
// profile. These checks are here so that can never quietly stop being true.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { STRINGS } from "../public/js/i18n/strings.js";

const read = p => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const worker = read("worker/index.js");
const page = read("public/index.html");

test("nothing of the deck is in the site's files", () => {
  const dir = new URL("../public/najdi/", import.meta.url);
  assert.ok(existsSync(dir), "the page itself is missing");
  const walk = (at, into = "") => readdirSync(new URL(into, at), { withFileTypes: true })
    .flatMap(e => e.isDirectory() ? walk(at, `${into}${e.name}/`) : [`${into}${e.name}`]);
  const files = walk(dir);
  for (const f of files)
    assert.doesNotMatch(f, /\.(mp3|ogg|m4a|wav|apkg|colpkg)$/i, `${f} is deck content — it must not be a public file`);
  assert.ok(!files.includes("cards.json"), "the deck's cards must not be a public file");
  assert.ok(!existsSync(new URL("../public/najdi/vendor/", import.meta.url)), "the .apkg readers are not needed on the site");
  const ignore = read(".gitignore");
  assert.match(ignore, /^AnkiCardsTryOne\/$/m, "the folder holding the deck must stay out of git");
});

test("the deck answers his profile and nobody else's", () => {
  const handler = worker.slice(worker.indexOf("async function najdi("), worker.indexOf("export default"));
  assert.ok(handler.includes('const role = await roleOf(request, env)'), "the deck must check who is asking");
  assert.match(handler, /if \(role !== "student"\) return json\(\{ error: "not-yours" \}, 403\)/,
    "only the student profile may read the deck");
  assert.match(worker, /if \(\/\^\\\/api\\\/najdi\(\\\/\|\$\)\/\.test\(url\.pathname\)\) return najdi\(request, env, url\)/,
    "the /api/najdi route is not wired up");
  for (const table of ["najdi_deck", "najdi_media"])
    assert.ok(worker.includes(`CREATE TABLE IF NOT EXISTS ${table}`), `${table} is not created`);
});

test("it is the first thing in the menu, in both languages, and hidden from Dima", () => {
  const menu = page.slice(page.indexOf('<nav data-i18n-label="nav.main"'), page.indexOf("</nav>"));
  const first = menu.match(/<(a|p)\b[^>]*>/);
  assert.match(first[0], /class="nav-najdi"/, "the deck must be the first thing in the menu");
  assert.ok(menu.indexOf('class="nav-najdi"') < menu.indexOf('data-i18n="nav.readGroup"'), "it must come before the reading group");
  assert.match(menu, /href="\/najdi\/"/, "it must open the page");
  for (const k of ["nav.najdi", "nav.najdiSub"])
    for (const l of ["en", "najdi"]) assert.ok(STRINGS[k]?.[l], `${k}: ${l} is missing`);
  assert.match(read("public/css/base.css"), /body\.is-teacher \.nav-najdi \{ display: none; \}/,
    "Dima's profile must not see it");
});

test("every device he signs in on gets the deck by itself, and keeps his progress", () => {
  const welcome = read("public/najdi/js/views/welcome.js");
  assert.match(welcome, /loader\(\$\("#loader", root\), \{ auto: true/, "a new device must fetch the deck without being asked");
  assert.match(welcome, /if \(auto\) run\(\)/, "the automatic fetch must actually start");
  assert.match(welcome, /if \(auto\) return onDone\(\)/, "nothing to acknowledge once it is in");
  assert.match(welcome, /await window\.app\.deckReady\(\)/, "the new device must pick up his progress in the same session");

  const main = read("public/najdi/js/main.js");
  assert.match(main, /async function deckReady/, "there must be one place that starts syncing");
  assert.match(main, /sync\.start\(\)[\s\S]{0,200}sync\.pull\(\)/, "it must both save and fold in what is already there");

  const sync = read("public/najdi/js/sync.js");
  for (const part of ["cards", "user", "revlog", "day"])
    assert.ok(sync.includes(part), `the progress must carry ${part}`);
  assert.match(sync, /CompressionStream/, "progress goes up gzipped");
  assert.match(read("worker/index.js"), /CREATE TABLE IF NOT EXISTS najdi_progress/, "the database must keep his progress");
});

test("the page never says the old thing about where his progress lives", () => {
  // It was a Mac app once, where the deck really was only on that machine. Saying so on the site
  // would now be a lie — he caught it in Settings.
  for (const f of ["js/views/settings.js", "js/views/welcome.js", "js/store.js"]) {
    const text = read("public/najdi/" + f);
    assert.doesNotMatch(text, /only on this device/i, `${f} still says the deck is only on this device`);
    assert.doesNotMatch(text, /nothing is uploaded/i, `${f} still says nothing is uploaded`);
  }
  assert.match(read("public/najdi/js/views/settings.js"), /live in your own database/,
    "Settings should say where his progress actually is");
});

test("a long card keeps its note inside the card", () => {
  // On the phone the card was pinned to the height of the screen, so a long culture note hung out
  // below the card's own background.
  const css = read("public/najdi/css/app.css");
  const phone = css.slice(css.indexOf("@media (max-width: 720px)"));
  assert.doesNotMatch(phone.slice(0, phone.indexOf("}\n}")), /\.stage \{ align-items: stretch/,
    "stretch pins the card to the screen height — it must grow with the card");
  assert.match(phone, /\.card \{ min-height: 100%; justify-content: safe center; \}/);
});

test("his Cards tab opens the deck, and Dima's stays the site's own", () => {
  const tabs = page.slice(page.indexOf('<nav class="tabbar"'), page.indexOf("</nav>", page.indexOf('<nav class="tabbar"')));
  assert.match(tabs, /class="tab-najdi"[^>]*>|href="\/najdi\/" class="tab-najdi"/, "his Cards tab must open the deck");
  assert.ok(tabs.includes('class="tab-sitecards"'), "hers must stay the site's own cards");
  const css = read("public/css/base.css");
  assert.match(css, /body:not\(\.is-teacher\) \.tab-sitecards \{ display: none; \}/);
  assert.match(css, /body\.is-teacher \.tab-najdi \{ display: none; \}/);
  for (const l of ["en", "najdi"]) assert.ok(STRINGS["nav.siteCards"]?.[l], `nav.siteCards: ${l}`);
});

test("starting over on one device empties the others", () => {
  // Merging only adds, so a reset had to be said out loud, or the phone handed back everything the
  // computer had just thrown away.
  const sync = read("public/najdi/js/sync.js"), deck = read("public/najdi/js/deck.js"), worker = read("worker/index.js");
  assert.match(deck, /resetProgress[\s\S]{0,300}store\.set\("meta", "resetAt", Date\.now\(\)\)/, "a reset must be stamped");
  assert.match(deck, /importProgress[\s\S]{0,600}store\.set\("meta", "resetAt", Date\.now\(\)\)/, "a restored backup must be stamped too");
  assert.match(deck, /pushNow\(\)/, "a reset must go up at once, not in a few seconds");
  assert.match(sync, /theirResetAt > mineResetAt[\s\S]{0,200}store\.clear\("cards", "revlog"\)/, "a newer reset must win");
  assert.match(sync, /mineResetAt > theirResetAt/, "an older copy must not come back");
  // and a device that has not caught up cannot quietly undo it
  assert.match(sync, /"x-base-at"/, "a save must say which version it started from");
  assert.match(sync, /r\.status === 409/, "it must look again when the server says it is behind");
  assert.match(worker, /return json\(\{ error: "stale", at: now\.updated_at \}, 409\)/, "the server must refuse a stale save");
});

test("a word opens where he is looking, not at the bottom of the list", () => {
  const browse = read("public/najdi/js/views/browse.js");
  assert.ok(!/scrollIntoView\(\{ behavior: "smooth", block: "start" \}\)/.test(browse),
    "tapping a word must not throw him to the bottom of the page");
  assert.match(browse, /if \(stacked\(\)\) openSheet\(\)/, "on a narrow screen the word opens over the list");
  assert.match(browse, /const stacked = \(\) => matchMedia\("\(max-width: 900px\)"\)\.matches/,
    "only where the two columns stack — the Mac and the iPad lying down keep the side panel");
  assert.match(browse, /data-act="close"/, "the sheet needs a way out");
  assert.match(read("public/najdi/css/app.css"), /body\.detail-open \.detail \{/, "the sheet needs its styles");
  assert.ok(!/[♂♀]/.test(browse), "no ♂ or ♀ characters left in the word list");
});

test("the page fetches the deck instead of holding it, and plays both voices", () => {
  const cloud = read("public/najdi/js/cloud.js");
  assert.match(cloud, /\/api\/najdi/, "the page must read the deck from his database");
  assert.match(cloud, /profile\(\) === "student"/, "the page must know whose profile it is on");
  assert.ok(!read("public/najdi/index.html").includes("vendor/"), "nothing is unpacked in the page any more");

  // "Both" is how he listens: the man, then the woman — the word on the front, the word and the
  // sentence once the answer is shown.
  assert.match(read("public/najdi/js/deck.js"), /voice: "both"/, "both voices is the default");
  assert.match(read("public/najdi/js/util.js"), /export function audioNames[\s\S]{0,400}voice === "both"[\s\S]{0,120}\[m, f\]/,
    "both voices must mean the man and then the woman");
  const study = read("public/najdi/js/views/study.js");
  assert.match(study, /playAll\(list\(\["word", "sent"\]\)/, "after the answer, the word and the sentence both play");
  assert.match(study, /data-voice-set="both"/, "the study bar needs the both-voices button");
  // ♂ and ♀ as text characters came out wrong on his iPhone: they are drawn now.
  const util = read("public/najdi/js/util.js");
  assert.match(util, /export const MALE_ICON = '<svg/, "the man's symbol must be drawn, not typed");
  assert.match(util, /export const FEMALE_ICON = '<svg/, "the woman's symbol must be drawn, not typed");
  assert.ok(!/[♂♀]/.test(study), "no ♂ or ♀ characters left in the study screen");
  assert.ok(!/[♂♀]/.test(read("public/najdi/js/render.js")), "no ♂ or ♀ characters left on the cards");
});
