// Put his flashcard deck into his own database — the one the Najdi page reads on the phone.
//
//   node scripts/najdi-deck.mjs <extracted-deck-dir> [--base https://saudiarabic.online] [--dry]
//
// The folder is what AnkiCardsTryOne/scripts/extract_apkg.py writes: cards.json and an audio/ folder.
// The deck itself is Eidetic's, bought for one person, so none of it is in this repository and none of
// it is served as a public file: it goes into the D1 database behind /api/najdi, which answers his
// profile and nobody else's.
//
// The key is SYNC_KEY, read from .dev.vars (git-ignored) or the NAJDI_KEY environment variable, and it
// is never printed. Uploading can be stopped and started again: it asks the server what it already has.
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const dir = args.find(a => !a.startsWith("--"));
const base = (args.find(a => a.startsWith("--base=")) ?? "--base=https://saudiarabic.online").split("=")[1];
const dry = args.includes("--dry");
if (!dir) { console.error("which folder? node scripts/najdi-deck.mjs <extracted-deck-dir>"); process.exit(1); }

// Signing in the way the site does — by name, which hands back his own token — so the deployed
// SYNC_KEY never has to be known here. NAJDI_KEY still works if it is set.
const name = (args.find(a => a.startsWith("--as=")) ?? "--as=Volodia").split("=")[1];
let key = process.env.NAJDI_KEY ?? "";
if (!key) {
  const r = await fetch(`${base}/api/login`, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name }),
  });
  const body = await r.json().catch(() => ({}));
  if (!body.token) { console.error(`could not sign in as ${name}: ${body.error ?? r.status}`); process.exit(1); }
  if (body.role !== "student") { console.error(`${name} signs in as ${body.role} — the deck is the student's`); process.exit(1); }
  key = body.token;
}

const api = (path, init = {}) => fetch(`${base}/api/najdi${path}`, {
  ...init, headers: { authorization: `Bearer ${key}`, ...init.headers },
});

// ---------------------------------------------------------------- the notes
// The same shape the Mac app's importer builds, so the study screens need no changes: what kind of note
// it is, its level, its theme, where it sorts, and the file name of each recording.
const LEVEL = /\b(A1|A2|B1|B2|C1|C2)\b/;
const SOUND = /\[sound:([^\]]+)\]/g;

const noteOf = (n, index) => {
  const fields = n.fields ?? {};
  const tags = n.tags ?? [];
  const kind = "Arabic" in fields && "English" in fields ? "vocab" : "HTMLContent" in fields ? "info" : "generic";
  const level = ((fields.Tier || n.deck || "").match(LEVEL) ?? [])[1] ?? "";
  const themeTag = tags.find(t => t.startsWith("theme:"));
  let theme = null;
  if (themeTag) {
    const raw = themeTag.slice(6);
    const m = raw.match(/^(\d+(?:\.\d+)*)_(.*)$/);
    theme = m ? { id: m[1], name: m[2].replaceAll("_", " ") } : { id: raw, name: raw.replaceAll("_", " ") };
  }
  const audio = {};
  for (const [field, value] of Object.entries(fields))
    for (const m of String(value).matchAll(SOUND)) (audio[field] ??= []).push(m[1]);
  const sort = Number.parseFloat(fields.SortOrder);
  return { guid: n.guid, id: n.id, noteType: n.noteType, fieldNames: Object.keys(fields), fields, tags,
           deck: n.deck, audio, kind, level, theme, sort: Number.isFinite(sort) ? sort : index };
};

const src = JSON.parse(readFileSync(join(dir, "cards.json"), "utf8"));
const notes = src.notes.map(noteOf).filter(n => n.kind !== "info");
const levels = [...new Set(notes.map(n => n.level))].filter(Boolean).sort();
const themes = new Set(notes.map(n => n.theme?.id).filter(Boolean));
console.log(`${notes.length} notes · levels ${levels.join(", ")} · ${themes.size} themes`);

// D1 takes a million characters a row, so the notes go up in slices of about 300 KB, each one stored
// as the text between the brackets: the server joins them back into one array without parsing anything.
const PART = 300_000;
const parts = [];
let cur = "";
for (const n of notes) {
  const text = JSON.stringify(n);
  if (cur && cur.length + text.length > PART) { parts.push(cur); cur = ""; }
  cur += (cur ? "," : "") + text;
}
if (cur) parts.push(cur);
console.log(`deck: ${parts.length} parts, ${(parts.reduce((n, p) => n + p.length, 0) / 1e6).toFixed(1)} MB of JSON`);

// ---------------------------------------------------------------- the recordings
const audioDir = join(dir, "audio");
const files = existsSync(audioDir) ? readdirSync(audioDir).filter(f => !f.startsWith(".")) : [];
const total = files.reduce((n, f) => n + statSync(join(audioDir, f)).size, 0);
console.log(`audio: ${files.length} files, ${(total / 1e6).toFixed(0)} MB`);
if (dry) process.exit(0);

const was = await api("/status").then(r => r.json()).catch(() => null);
if (!was || was.error) { console.error("the server said:", was?.error ?? "nothing"); process.exit(1); }
console.log(`already there: ${was.parts} deck parts, ${was.media} recordings`);

for (const [i, data] of parts.entries()) {
  const r = await api(`/deck/${i}`, { method: "PUT", headers: { "content-type": "text/plain" }, body: data });
  if (!r.ok) { console.error(`deck part ${i}: ${r.status} ${await r.text()}`); process.exit(1); }
}
console.log(`deck: ${parts.length} parts uploaded`);

const have = new Set((await api("/media").then(r => r.json())).names ?? []);
const todo = files.filter(f => !have.has(f));
console.log(`recordings to send: ${todo.length} of ${files.length}`);

const TYPE = { mp3: "audio/mpeg", ogg: "audio/ogg", m4a: "audio/mp4", wav: "audio/wav", opus: "audio/ogg" };
let done = 0, failed = [];
const worker = async queue => {
  for (const name of queue) {
    const body = readFileSync(join(audioDir, name));
    const type = TYPE[name.split(".").pop().toLowerCase()] ?? "audio/mpeg";
    let ok = false;
    for (let tries = 0; tries < 3 && !ok; tries++) {
      const r = await api(`/media/${encodeURIComponent(name)}`, { method: "PUT", headers: { "content-type": type }, body })
        .catch(() => null);
      ok = !!r?.ok;
      if (!ok) await new Promise(r => setTimeout(r, 400 * (tries + 1)));
    }
    if (!ok) failed.push(name);
    if (++done % 250 === 0) console.log(`  ${done} / ${todo.length}`);
  }
};
const LANES = 8; // gentle on a free Worker, and still about twenty files a second
const lanes = Array.from({ length: LANES }, (_, i) => todo.filter((_, n) => n % LANES === i));
await Promise.all(lanes.map(worker));

const now = await api("/status").then(r => r.json());
console.log(`done: ${now.media} recordings and ${now.parts} deck parts in the database` +
  (failed.length ? ` — ${failed.length} failed, run it again` : ""));
