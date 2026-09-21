// npm run vocab — reads every vocabulary table in NAJDI-PLAN.md (Parts 5–8) and writes:
//   public/data/vocab.json     the Words page
//   public/anki/*.csv          one Anki deck per stage (Anki reads the #headers and sets deck, note type and tags)
// NAJDI-PLAN.md stays the source of truth for the Najdi words. The formal-Arabic and Ukrainian meanings, and the
// Ukrainian/Najdi/MSA topic names, live in data/vocab-translations.json (keyed by "arabic|english meaning").
// Run with --check to only report entries that are missing a translation.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const root = new URL("../", import.meta.url);
const plan = readFileSync(new URL("NAJDI-PLAN.md", root), "utf8").split("\n");
const extra = JSON.parse(readFileSync(new URL("data/vocab-translations.json", root), "utf8"));
const checkOnly = process.argv.includes("--check");

const cells = line => line.split("|").slice(1, -1).map(c => c.trim());
const flagged = s => s.includes("⚠");
const clean = s => s.replace(/⚠/g, "").replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
// "بيتي *bēti* — my house" → { ar, say, en }. Several pairs ("ما أدري *ma adri* → مدري *madri*",
// "عايز *ʿāyiz* / بدي *biddi*") are joined with the same arrow or slash.
const PAIR = /([\u0600-\u06FF][\u0600-\u06FF\s…؟ـ\u064B-\u0652]*?)\s*\*([^*]+)\*/g;
function example(s) {
  const text = clean(s);
  const pairs = [...text.matchAll(PAIR)];
  if (!pairs.length) return null;
  const sep = text.includes("→") ? " → " : " / ";
  const after = text.slice(pairs.at(-1).index + pairs.at(-1)[0].length).match(/^\s*[—–]\s*(.+)$/);
  return { ar: pairs.map(p => p[1].trim()).join(sep), say: pairs.map(p => p[2].trim()).join(sep), en: after?.[1].trim() ?? "" };
}

// Section tracking: which stage and topic a table belongs to.
const STAGE_OF_PART = { 5: "grammar", 7: "special", 8: "traps" };
let part = 0;
let stage = null;
let topic = null;
const topics = new Map(); // topicId → { id, stage, title, entries }
const traps = [];

function addEntry(e) {
  if (!e.ar || !e.say) return;
  const t = topics.get(topic.id) ?? topics.set(topic.id, { ...topic, entries: [] }).get(topic.id);
  t.entries.push(e);
}

for (let i = 0; i < plan.length; i++) {
  const line = plan[i];
  const partMatch = line.match(/^## Part (\d+)/);
  if (partMatch) {
    part = +partMatch[1];
    stage = STAGE_OF_PART[part] ?? null;
    topic = part === 7 ? { id: "7", stage: "special", title: "Phrases for special moments" } : part === 8 ? null : topic;
    continue;
  }
  const stageMatch = line.match(/^### STAGE (\d)/);
  if (stageMatch && part === 6) {
    stage = stageMatch[1];
    continue;
  }
  if (line.startsWith("### STAGES 4")) {
    stage = null;
    continue;
  }
  const h = line.match(/^#{3,4} (\d\.\d+) (.+)$/);
  if (h && (part === 5 || part === 6) && stage) {
    topic = { id: h[1], stage, title: h[2].replace(/[—–].*$/, "").trim() };
    continue;
  }
  // The days of the week are prose in 2.6: السبت *as-sabt* (Sat), …
  if (part === 6 && line.startsWith("Days:")) {
    for (const m of line.matchAll(/(\S+) \*([^*]+)\* \((\w+)\)/g)) addEntry({ ar: m[1], say: m[2], en: m[3] });
    continue;
  }
  // A table starts with a header row followed by |---|
  if (!line.startsWith("|") || !plan[i + 1]?.startsWith("|---") || !stage) continue;
  const head = cells(line).map(c => c.toLowerCase());
  const rows = [];
  for (i += 2; plan[i]?.startsWith("|"); i++) rows.push(cells(plan[i]));
  i--;

  for (const r of rows) {
    const check = r.some(flagged);
    const c = r.map(clean);
    if (part === 8) {
      const wrong = example(c[0]);
      const right = example(c[2].replace(/\(.*\)$/, ""));
      if (wrong && right) traps.push({ wrong, dialect: c[1], right: { ar: right.ar, say: right.say } });
      continue;
    }
    if (head[0] === "arabic" && head[1] === "say" && head[3] === "arabic") {
      // 2.6 numbers: two word/number pairs per row
      for (const [a, s] of [[c[0], c[1]], [c[3], c[4]]]) {
        if (!a) continue;
        // "miya — 100 / alf — 1000" → say "miya / alf", en "100 / 1000"
        const parts = s.split(/\s*\/\s*/).map(p => p.split(/\s*—\s*/));
        addEntry({ ar: a, say: parts.map(p => p[0]).join(" / "), en: parts.map(p => p[1]).join(" / ") });
      }
    } else if (head[0] === "arabic" && head[2] === "meaning") {
      addEntry({ ar: c[0], say: c[1], en: c[2], note: c[3] || "", check });
    } else if (head[0].startsWith("i (arabic)")) {
      addEntry({ ar: c[0], say: c[1], en: c[2], toHer: { ar: c[3], say: c[4] }, check });
    } else if (head[0] === "" && head[1] === "arabic") {
      addEntry({ ar: c[1], say: c[2], en: c[0], check });
    } else if (head[0] === "arabic" && head[2] === "when") {
      const reply = c[3] ? example(c[3]) ?? { ar: c[3], say: "" } : null;
      addEntry({ ar: c[0], say: c[1], en: c[2], reply, check });
    } else if (head[1] === "example" || head[2] === "example") {
      // 5.6 / 5.7 / 5.9 pattern tables and 5.2 endings: the example column holds Arabic *say*
      const ex = example(head[1] === "example" ? c[1] : c[2]);
      if (!ex) continue;
      // 5.2 endings: rows without a meaning are all بيت + ending, e.g. بيته = "his house"
      const en = ex.en || (head[0] === "ending" ? `${c[1]} house` : c[2]);
      addEntry({ ar: ex.ar, say: ex.say, en, note: head[1] === "example" ? c[0] : `${c[0]} — ${c[1]}`, check });
    }
  }
}

// Merge translations and check completeness.
const key = e => `${e.ar}|${e.en}`; // بعد means both “after” and “also”: the meaning is part of the key
const missing = [];
const STAGES = ["1", "2", "3", "special", "grammar"];
const out = { generated: "npm run vocab", stages: [], traps: [] };
for (const s of STAGES) {
  const list = [...topics.values()].filter(t => t.stage === s).map(t => {
    const title = { en: t.title, ...(extra.topics[t.id] ?? {}) };
    if (!title.uk || !title.najdi || !title.msa) missing.push(`topic ${t.id} ${t.title}`);
    return {
      id: t.id,
      title,
      entries: t.entries.map(e => {
        const tr = extra.words[key(e)];
        if (!tr?.msa || !tr?.uk) missing.push(`${key(e)}  (${e.en})`);
        if (e.note && !extra.notes[e.note]) missing.push(`note: ${e.note}`);
        const note = e.note ? { en: e.note, ...extra.notes[e.note] } : undefined;
        return { ...e, note, msa: tr?.msa ?? "", uk: tr?.uk ?? "" };
      }),
    };
  });
  out.stages.push({ id: s, topics: list });
}
out.traps = traps.map(t => ({ ...t, dialect: { en: t.dialect, ...extra.dialects[t.dialect] } }));
for (const t of out.traps) if (!t.dialect.uk) missing.push(`dialect: ${t.dialect.en}`);

const count = out.stages.reduce((n, s) => n + s.topics.reduce((m, t) => m + t.entries.length, 0), 0);
if (missing.length) {
  console.log(`${missing.length} missing translations:\n  ${missing.join("\n  ")}`);
  if (checkOnly) process.exit(1);
}
if (checkOnly) {
  console.log(`All ${count} entries translated.`);
  process.exit(0);
}

mkdirSync(new URL("public/data/", root), { recursive: true });
mkdirSync(new URL("public/anki/", root), { recursive: true });
writeFileSync(new URL("public/data/vocab.json", root), JSON.stringify(out, null, 1));

// Anki: Najdi on the front; pronunciation, English, Ukrainian, formal Arabic, the "to her" form and notes on the back.
const DECKS = { "1": "Stage 1 — Core", "2": "Stage 2 — Daily life", "3": "Stage 3 — Talking to her", special: "Special moments", grammar: "Grammar patterns" };
const csv = v => `"${String(v).replace(/"/g, '""')}"`;
const html = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
for (const s of out.stages) {
  const lines = [
    "#separator:Comma",
    "#html:true",
    "#notetype:Basic",
    `#deck:Najdi::${DECKS[s.id]}`,
    "#tags column:3",
  ];
  for (const t of s.topics) {
    for (const e of t.entries) {
      const front = `<div dir="rtl" style="font-size:2em">${html(e.ar)}</div>`;
      const back = [
        `<b>${html(e.say)}</b>`,
        `EN: ${html(e.en)}`,
        `UA: ${html(e.uk)}`,
        `MSA: <span dir="rtl">${html(e.msa)}</span>`,
        e.toHer ? `To her: <span dir="rtl">${html(e.toHer.ar)}</span> <i>${html(e.toHer.say)}</i>` : "",
        e.reply ? `Reply / Відповідь: <span dir="rtl">${html(e.reply.ar)}</span> <i>${html(e.reply.say)}</i>` : "",
        e.note ? `<i>${html(e.note.en)} · ${html(e.note.uk)}</i>` : "",
        e.check ? `⚠ check with tutor` : "",
      ].filter(Boolean).join("<br>");
      const tags = [`stage-${s.id}`, `topic-${t.id}`, e.check ? "check-with-tutor" : ""].filter(Boolean).join(" ");
      lines.push([front, back, tags].map(csv).join(","));
    }
  }
  writeFileSync(new URL(`public/anki/najdi-${s.id === "1" || s.id === "2" || s.id === "3" ? `stage${s.id}` : s.id}.csv`, root), lines.join("\n") + "\n");
}
console.log(`Wrote ${count} entries in ${out.stages.length} decks and ${traps.length} traps.`);
