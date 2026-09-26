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
});
