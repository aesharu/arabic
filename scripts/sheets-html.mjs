// The printable sheets: five A4 booklets for learning to write the letters by hand.
//
// He asked for what a Saudi child gets at school — one letter shown properly, then the same letter
// dotted over and over to trace, then empty lines to do it alone — with the sound written in English
// and in Ukrainian letters, and every shape the letter wears at the start, the middle and the end of
// a word, so that by the end he can write them and tell them apart.
//
// Two things matter more than looks. **A page must hold a lot of writing**: eight letters to a line,
// a dozen lines to a sheet, because the hand learns by repeating, not by reading. And **nothing may
// overflow the sheet** — a page that runs past 297mm pushes its footer onto the next one and the
// print is ruined, so scripts/sheets.mjs measures every page before it prints and refuses if one is
// too tall.
//
// This file only builds the HTML; Chrome prints it. Every letter is drawn as SVG, so the dashed
// outline stays a vector line in the PDF and prints as sharply as the printer can manage.
//
// Nothing here invents Arabic. The letters, their sounds and their example words come from
// data/letters.js, the marks from the book, the words from the plan's own vocabulary (vocab.json),
// and the Ukrainian letters from core/ua.js — the same ones he reads everywhere else on the site.
import { readFileSync } from "node:fs";
import { GROUPS } from "../public/js/data/letters.js";
import { MARKS } from "../public/js/data/book.js";
import { uaSay, UA_KEY } from "../public/js/core/ua.js";
import { shapes } from "../public/js/core/arabic.js";

const FONTS = new URL("../public/fonts/", import.meta.url).pathname;
const vocab = JSON.parse(readFileSync(new URL("../public/data/vocab.json", import.meta.url), "utf8"));
const VOCAB = vocab.stages.flatMap(s => s.topics.flatMap(t => t.entries));
export const LETTERS = GROUPS.flatMap(g => g.letters);

const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const times = (n, f) => Array.from({ length: n }, (_, i) => f(i)).join("");

// ------------------------------------------------------------------ the sounds, in two alphabets
// "q → g" is one letter said two ways, not two letters: the sheet shows both and the Ukrainian once.
const clean = t => String(t ?? "").replace(/\s*→\s*/g, " → ");
const uaLetter = translit => {
  const ua = uaSay(clean(translit));
  const [a, b] = ua.split(" → ");
  return b && a === b ? a : ua;
};
const ukTip = char => UA_KEY.find(r => r.ar === char)?.uk ?? "";

// ------------------------------------------------------------------ the body under the dots
// Every dotted letter is a plain body plus dots, and the dots are always written last. Arabic has a
// letter for each bare body, so the sheet can show both at once by laying the whole letter under the
// bare one: what shows through is exactly the dots.
const BODY = {
  "ب": "ٮ", "ت": "ٮ", "ث": "ٮ", "ن": "ں", "ي": "ى", "ج": "ح", "خ": "ح", "ذ": "د",
  "ز": "ر", "ش": "س", "ض": "ص", "ظ": "ط", "غ": "ع", "ف": "ڡ", "ق": "ٯ",
};
/** The same trick for a joined-up shape: ـبـ is ـٮـ plus the dot. */
const bodyOf = text => {
  const hit = [...text].find(c => BODY[c]);
  return hit ? text.replace(hit, BODY[hit]) : "";
};

// ------------------------------------------------------------------ one square of paper
// A cell is given its size in millimetres and drawn in units 78 tall with the baseline at 56, so
// cells set side by side make one unbroken writing line, the way ruled paper works.
const H = 78, BASE = 56;
const units = (wmm, hmm) => Math.round((H * wmm) / hmm);

const cell = (text, cls, { wmm, hmm, size = 58, rule = true } = {}) => {
  const w = units(wmm, hmm);
  return `<svg class="cl" viewBox="0 0 ${w} ${H}" style="width:${wmm}mm;height:${hmm}mm">
    ${rule ? `<line class="rule" x1="0" y1="${BASE}" x2="${w}" y2="${BASE}"/>` : ""}
    ${text ? `<text class="${cls}" x="${w / 2}" y="${BASE}" font-size="${size}" text-anchor="middle" direction="rtl">${esc(text)}</text>` : ""}
  </svg>`;
};

// Every booklet is printed twice, because the two printers want opposite things.
//   "colour" — the letter written properly in ink with its dots picked out in green. Beautiful on a
//              screen or a colour printer, and that is the one he liked.
//   "mono"   — nothing solid anywhere he writes: the lead letter is the same dashes drawn heavier,
//              everything else lighter, all grey. On a black-and-white printer a solid letter comes
//              out the same black as his pen, and then he cannot see what he wrote.
let MODE = "colour";
export const setMode = m => { MODE = m; };

/** The first one in a line — the one written for him, that the rest of the line copies. */
const model = (text, opts) => {
  if (MODE === "mono") return cell(text, "lead", opts);
  const bare = bodyOf(text);
  if (!bare) return cell(text, "ink", opts);
  const w = units(opts.wmm, opts.hmm), size = opts.size ?? 58;
  return `<svg class="cl" viewBox="0 0 ${w} ${H}" style="width:${opts.wmm}mm;height:${opts.hmm}mm">
    <line class="rule" x1="0" y1="${BASE}" x2="${w}" y2="${BASE}"/>
    <text class="dots" x="${w / 2}" y="${BASE}" font-size="${size}" text-anchor="middle" direction="rtl">${esc(text)}</text>
    <text class="ink" x="${w / 2}" y="${BASE}" font-size="${size}" text-anchor="middle" direction="rtl">${esc(bare)}</text>
  </svg>`;
};
/** The bare body of a letter — step one, before the dots go on. */
const step = (text, opts) => cell(bodyOf(text) || text, MODE === "mono" ? "lead" : "ink", opts);
/** What the sheet says about its own two steps, since on the grey sheets there is no green to point at. */
const dotsHint = () => MODE === "mono"
  ? "the body first, the dots last · right to left ←"
  : "green = the dots, written last · right to left ←";

const WIDTH = 186; // the paper inside its margins
const row = (cells, cls = "") => `<div class="row ${cls}">${cells}</div>`;

/** A line of the same thing: written once in ink, then dotted all the way across. */
const line = (text, { per = 8, hmm = 17, size = 58, lead = true } = {}) => {
  const wmm = +(WIDTH / per).toFixed(2);
  const o = { wmm, hmm, size };
  return row((lead ? model(text, o) : cell(text, "dash", o)) + times(per - 1, () => cell(text, "dash", o)));
};
/** A line that runs through every shape the letter wears, over and over. */
const mixed = (texts, { per = 8, hmm = 17, size = 58 } = {}) => {
  const wmm = +(WIDTH / per).toFixed(2);
  return row(times(per, i => cell(texts[i % texts.length], "dash", { wmm, hmm, size })));
};
/** An empty writing line: the baseline, and a faint guide where the shoulder of the letter sits. */
const blank = (hmm = 15) => {
  const w = units(WIDTH, hmm);
  return row(`<svg class="cl" viewBox="0 0 ${w} ${H}" style="width:${WIDTH}mm;height:${hmm}mm">
    <line class="guide" x1="0" y1="30" x2="${w}" y2="30"/>
    <line class="rule" x1="0" y1="${BASE}" x2="${w}" y2="${BASE}"/>
  </svg>`, "blank");
};

// ------------------------------------------------------------------ the words he traces
const bare = ar => String(ar).replace(/[ً-ْٰـ]/g, "");
/** The shortest word in the plan with this letter at the start, in the middle, or at the end. */
const wordWith = (char, where) => VOCAB
  .filter(w => !/\s/.test(w.ar) && bare(w.ar).length >= 3 && bare(w.ar).length <= 6)
  .filter(w => {
    const i = bare(w.ar).indexOf(char), n = bare(w.ar).length;
    return where === "start" ? i === 0 : where === "end" ? i === n - 1 && i > 0 : i > 0 && i < n - 1;
  })
  .sort((a, b) => bare(a.ar).length - bare(b.ar).length)[0] ?? null;

// ------------------------------------------------------------------ the paper itself
const CSS = () => `
@font-face { font-family: "Naskh"; src: url("file://${FONTS}noto-naskh-arabic-400-700-arabic.woff2") format("woff2"); font-weight: 400 700; }
@font-face { font-family: "Sans"; src: url("file://${FONTS}alegreya-sans-400-latin.woff2") format("woff2"); font-weight: 400; }
@font-face { font-family: "Sans"; src: url("file://${FONTS}alegreya-sans-700-latin.woff2") format("woff2"); font-weight: 700; }
@font-face { font-family: "Sans"; src: url("file://${FONTS}alegreya-sans-400-cyrillic.woff2") format("woff2"); font-weight: 400; unicode-range: U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116; }
@font-face { font-family: "Sans"; src: url("file://${FONTS}alegreya-sans-400-cyrillic-ext.woff2") format("woff2"); font-weight: 400; unicode-range: U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F; }
@font-face { font-family: "Sans"; src: url("file://${FONTS}alegreya-sans-700-cyrillic.woff2") format("woff2"); font-weight: 700; unicode-range: U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116; }
@font-face { font-family: "Sans"; src: url("file://${FONTS}alegreya-sans-700-cyrillic-ext.woff2") format("woff2"); font-weight: 700; unicode-range: U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F; }

* { margin: 0; padding: 0; box-sizing: border-box; }
@page { size: A4 portrait; margin: 0; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: "Sans", system-ui, sans-serif; color: #17301f; background: #fff; }
.page { width: 210mm; height: 297mm; padding: 10mm 12mm; page-break-after: always; overflow: hidden; }
.page:last-child { page-break-after: auto; }

/* the strip along the top: the letter, its name, its sound, a word — all on one line, nothing stacked */
.top { display: flex; align-items: center; gap: 5mm; border-bottom: 0.5mm solid #1c6b45; padding-bottom: 2mm; margin-bottom: 2mm; }
.top .big { font-family: "Naskh"; font-size: 17mm; line-height: 1.1; color: #1c6b45; direction: rtl; min-width: 18mm; text-align: center; }
.top .who { flex: 1; min-width: 0; }
.name { font-size: 5mm; font-weight: 700; line-height: 1.25; }
.name .ar { font-family: "Naskh"; color: #1c6b45; }
.name .sound { color: #1c6b45; }
.tip { font-size: 3.2mm; line-height: 1.35; color: #3d5548; }
.tip .ar { font-family: "Naskh"; font-size: 4mm; }
.tip.uk { color: #5d7266; }
.num { text-align: center; font-size: 2.8mm; color: #93a598; line-height: 1.2; }
.num b { display: block; font-size: 7mm; color: #1c6b45; }

h2 { font-size: 3.2mm; font-weight: 700; text-transform: uppercase; letter-spacing: 0.45mm; color: #1c6b45;
     margin: 2.5mm 0 1mm; display: flex; gap: 2.5mm; align-items: baseline; }
h2 .ar { font-family: "Naskh"; text-transform: none; letter-spacing: 0; font-size: 4mm; color: #17301f; }
h2 .hint { margin-left: auto; font-size: 2.9mm; text-transform: none; letter-spacing: 0; color: #7d9187; font-weight: 400; }

.row { display: flex; gap: 0.6mm; justify-content: space-between; }
.cl { display: block; overflow: visible; }
/* Everything he writes over is dashed and grey — it prints grey on a black-and-white printer and
   stays telling apart from a black pen. The lead one in a line is the same dashes, only heavier. */
.ink { fill: #1d1d1d; font-family: "Naskh"; }
.lead { fill: none; stroke: #5c5c5c; stroke-width: 2; stroke-dasharray: 4.2 3.4; stroke-linecap: round; font-family: "Naskh"; }
.dash { fill: none; stroke: #9a9a9a; stroke-width: 1.6; stroke-dasharray: 3.6 4.2; stroke-linecap: round; font-family: "Naskh"; }
.rule { stroke: #c9c9c9; stroke-width: 0.7; }
.guide { stroke: #e3e3e3; stroke-width: 0.7; stroke-dasharray: 3 4; }

/* the four shapes, small, in a strip */
.forms { display: flex; gap: 1.5mm; }
.form { flex: 1; border: 0.3mm solid #d7e0da; border-radius: 1.5mm; text-align: center; padding-top: 0.5mm; }
.form .g { font-family: "Naskh"; font-size: 9mm; line-height: 1.2; direction: rtl; color: #17301f; }
.form .lb { font-size: 2.6mm; color: #7d9187; padding-bottom: 0.8mm; line-height: 1.25; }
.form .lb .ar { font-family: "Naskh"; }

.words { display: flex; gap: 2mm; font-size: 3mm; color: #5d7266; margin-bottom: 0.5mm; }
.words span { flex: 1; text-align: center; }
.words b { color: #17301f; }

.foot { margin-top: 2mm; display: flex; justify-content: space-between; font-size: 2.8mm; color: #a7b6ac; }
.foot .ar { font-family: "Naskh"; }

.cover { display: flex; flex-direction: column; justify-content: center; text-align: center; gap: 4mm; }
.cover h1 { font-size: 12mm; color: #1c6b45; line-height: 1.15; }
.cover .ar { font-family: "Naskh"; direction: rtl; }
.cover p { font-size: 4.2mm; line-height: 1.55; max-width: 145mm; margin: 0 auto; }
.cover ol { max-width: 135mm; margin: 3mm auto 0; font-size: 3.8mm; line-height: 1.7; text-align: left; padding-left: 5mm; }
.cover .sig { color: #7d9187; font-size: 3.4mm; }

${MODE !== "mono" ? "" : `
/* the black-and-white sheets: grey paper marks, black text, nothing solid where he writes */
.top { border-bottom-color: #1d1d1d; }
.top .big, .name .ar, .name .sound, .num b, h2, .cover h1, .form .g { color: #1d1d1d; }
h2 .hint, .tip, .tip.uk, .form .lb, .words, .num { color: #555; }
.form { border-color: #bdbdbd; }
`}`;

const doc = (title, pages) =>
  `<!doctype html><html lang="en"><meta charset="utf-8"><title>${esc(title)}</title><style>${CSS()}</style>${pages.join("\n")}`;
const foot = `<div class="foot"><span>Saudi Arabic · write it by hand</span><span class="ar">اكْتِبْها بْيَدَك</span></div>`;
const head = (big, name, tips, n, of) => `<div class="top">
  <div class="big">${esc(big)}</div>
  <div class="who"><div class="name">${name}</div>${tips.filter(Boolean).join("")}</div>
  <div class="num"><b>${n}</b>of ${of}</div>
</div>`;

const FORM_LABELS = {
  4: [["alone", "وَحْدَه"], ["at the start", "بْأَوَّل الكَلِمَة"], ["in the middle", "بْنُصّ الكَلِمَة"], ["at the end", "بْآخِر الكَلِمَة"]],
  2: [["alone", "وَحْدَه"], ["at the end", "بْآخِر الكَلِمَة"]],
};
const formStrip = four => `<div class="forms">${four.map((f, i) =>
  `<div class="form"><div class="g">${esc(f)}</div><div class="lb">${FORM_LABELS[four.length][i][0]}<br><span class="ar">${esc(FORM_LABELS[four.length][i][1])}</span></div></div>`).join("")}</div>`;

// ------------------------------------------------------------------ booklet 1: one letter a page
// Eleven lines of writing on every sheet: the letter alone until the hand knows it, then each of its
// joined-up shapes, then the four of them shuffled, then empty lines.
const letterPage = (l, i) => {
  const four = shapes(l.char, l.nonJoining);
  const uk = ukTip(l.char);
  const rest = four.slice(1);
  return `<section class="page">
  ${head(l.char,
    `${esc(l.name)} · <span class="ar">${esc(l.nameAr)}</span> &nbsp; <span class="sound">${esc(clean(l.translit))} · ${esc(uaLetter(l.translit))}</span>`,
    [`<p class="tip">${esc(l.sound.en)} &nbsp;·&nbsp; <span class="ar">${esc(l.example.ar)}</span> ${esc(l.example.tr)} — ${esc(l.example.en)}</p>`,
     uk ? `<p class="tip uk">${esc(uk)}</p>` : ""], i + 1, 28)}

  <h2>The letter <span class="ar">الحَرْف</span><span class="hint">${dotsHint()}</span></h2>
  ${line(l.char, { per: 6, hmm: 20, size: 60 })}
  ${line(l.char, { per: 8, hmm: 16 })}
  ${line(l.char, { per: 8, hmm: 16, lead: false })}
  ${line(l.char, { per: 10, hmm: 14, lead: false })}

  <h2>Joined up <span class="ar">مَوْصُول</span><span class="hint">the same letter where it sits in a word</span></h2>
  ${formStrip(four)}
  ${rest.map(f => line(f, { per: 8, hmm: 16 })).join("")}
  ${mixed(four, { per: 8, hmm: 16 })}
  ${mixed([...four].reverse(), { per: 10, hmm: 14 })}
  ${four.length === 2 ? line(l.char, { per: 10, hmm: 14, lead: false }) + mixed(four, { per: 10, hmm: 14 }) : ""}

  <h2>On your own <span class="ar">لِحَالَك</span><span class="hint">say the sound out loud every time you write it</span></h2>
  ${blank(14)}${blank(14)}${blank(14)}
  ${foot}
</section>`;
};

// ------------------------------------------------------------------ booklet 2: the letter in a word
const formsPage = (l, i) => {
  const four = shapes(l.char, l.nonJoining);
  const spots = l.nonJoining ? ["start", "end"] : ["start", "middle", "end"];
  const found = spots.map(s => wordWith(l.char, s)).filter(Boolean);
  const wordLines = found.map(w => `${row(model(w.ar, { wmm: 37.2, hmm: 16, size: 50 })
      + times(4, () => cell(w.ar, "dash", { wmm: 37.2, hmm: 16, size: 50 })))}`).join("");
  return `<section class="page">
  ${head(l.char,
    `${esc(l.name)} · <span class="ar">${esc(l.nameAr)}</span> &nbsp; <span class="sound">${esc(clean(l.translit))} · ${esc(uaLetter(l.translit))}</span>`,
    [`<p class="tip">${l.nonJoining
        ? "This one never joins to the letter after it: write it, lift the pen, and start the next letter on its own."
        : "The body stays the same wherever it stands — only the tail and the joins change."}</p>`], i + 1, 28)}

  <h2>Every shape <span class="ar">كِلّ الأَشْكَال</span><span class="hint">alone · start · middle · end</span></h2>
  ${formStrip(four)}
  ${four.map(f => line(f, { per: 8, hmm: 15 })).join("")}
  ${mixed(four, { per: 10, hmm: 14 })}
  ${mixed([...four].reverse(), { per: 10, hmm: 14 })}
  ${mixed(four, { per: 10, hmm: 14 })}
  ${times(4 - four.length, () => line(l.char, { per: 10, hmm: 14, lead: false }))}

  <h2>In a real word <span class="ar">في كَلِمَة</span><span class="hint">from the words you are learning</span></h2>
  <div class="words">${found.map(w => `<span><b>${esc(w.say)}</b> — ${esc(w.en)}</span>`).join("")}</div>
  ${wordLines}
  ${times(5 - found.length, () => blank(14))}
  ${foot}
</section>`;
};

// ------------------------------------------------------------------ booklet 3: the ones that look alike
const familyPage = (g, i) => {
  const ls = g.letters;
  const per = ls.length;
  const wmm = +(WIDTH / per).toFixed(2);
  return `<section class="page">
  ${head(ls.map(l => l.char).join(" "),
    `${esc(g.title.en)} · <span class="ar">${esc(g.title.najdi)}</span>`,
    [`<p class="tip">${esc(g.note.en)}</p>`,
     `<p class="tip uk"><span class="ar" dir="rtl">${esc(g.note.najdi)}</span></p>`], i + 1, GROUPS.length)}

  <h2>Side by side <span class="ar">جَنْب بَعْض</span><span class="hint">${MODE === "mono" ? "the dots are the whole difference" : "green = what tells them apart"}</span></h2>
  ${row(ls.map(l => model(l.char, { wmm, hmm: 20, size: 58 })).join(""))}
  <div class="words">${ls.map(l => `<span><b>${esc(l.name)}</b> ${esc(clean(l.translit))} · ${esc(uaLetter(l.translit))}</span>`).join("")}</div>

  <h2>One line each <span class="ar">سَطْر لِكِلّ حَرْف</span><span class="hint">say the sound as you write it</span></h2>
  ${ls.map(l => line(l.char, { per: 8, hmm: 15 })).join("")}

  <h2>All of them mixed <span class="ar">مَخْلُوطَة</span><span class="hint">look at the dots before you write</span></h2>
  ${mixed(ls.map(l => l.char), { per: 10, hmm: 14 })}
  ${mixed([...ls].reverse().map(l => l.char), { per: 10, hmm: 14 })}
  ${mixed(ls.map(l => l.char).concat([...ls].reverse().map(l => l.char)), { per: 10, hmm: 14 })}

  <h2>Add the dots yourself <span class="ar">حُطّ النُّقَط</span><span class="hint">the body is written — put the dots where they belong</span></h2>
  ${row(ls.map(l => step(l.char, { wmm, hmm: 18, size: 58 })).join(""))}
  <div class="words">${ls.map(l => `<span>${esc(l.name)}</span>`).join("")}</div>
  <h2>On your own <span class="ar">لِحَالَك</span><span class="hint">write all of them again, from memory</span></h2>
  ${times(Math.max(0, 5 - ls.length), () => blank(14))}
  ${foot}
</section>`;
};

// ------------------------------------------------------------------ booklet 4: the marks
const markPage = (m, i) => {
  const show = m.show.slice(0, 6);
  const per = Math.max(4, show.length);
  const wmm = +(WIDTH / per).toFixed(2);
  return `<section class="page">
  ${head(show[0]?.[0] ?? "",
    `${esc(m.title.en)} · <span class="ar">${esc(m.title.najdi)}</span>`,
    [`<p class="tip">${esc(m.note.en)}</p>`,
     `<p class="tip uk"><span class="ar" dir="rtl">${esc(m.note.najdi)}</span></p>`], i + 1, MARKS.length)}

  <h2>How it sounds <span class="ar">كَيْف تِنْقَال</span><span class="hint">Latin above, Ukrainian below</span></h2>
  ${row(show.map(([ar]) => model(ar, { wmm, hmm: 19, size: 54 })).join(""))}
  <div class="words">${show.map(([, say]) => `<span><b>${esc(say)}</b><br>${esc(uaSay(say))}</span>`).join("")}</div>

  <h2>Trace them <span class="ar">مَشِّ عَلَيْهَا</span><span class="hint">the mark is part of the word — write it too</span></h2>
  ${show.map(([ar]) => line(ar, { per: 8, hmm: 15, size: 54 })).join("")}

  <h2>In a word <span class="ar">في كَلِمَة</span></h2>
  <div class="words">${m.words.slice(0, 3).map(([, say, en]) => `<span><b>${esc(say)}</b> — ${esc(en)}</span>`).join("")}</div>
  ${m.words.slice(0, 3).map(([ar]) => row(model(ar, { wmm: 37.2, hmm: 15, size: 46 })
      + times(4, () => cell(ar, "dash", { wmm: 37.2, hmm: 15, size: 46 })))).join("")}
  ${times(2 + Math.max(0, 6 - show.length), () => blank(14))}
  ${foot}
</section>`;
};

// ------------------------------------------------------------------ booklet 5: empty paper
const blankPage = n => `<section class="page">
  ${head("ا ب ت", `Practice paper · <span class="ar">وَرَق لِلتَّمْرِين</span>`,
    [`<p class="tip">Write from right to left. The faint dashed line is where the shoulder of the letter sits; the solid line is the baseline everything stands on.</p>`], n, 4)}
  <h2>Write <span class="ar">اكْتِب</span><span class="hint">right to left ←</span></h2>
  ${times(12, () => blank(19))}
  ${foot}
</section>`;

// ------------------------------------------------------------------ the covers
const cover = (title, ar, what, how) => `<section class="page cover">
  <h1>${esc(title)}<br><span class="ar">${esc(ar)}</span></h1>
  <p>${esc(what)}</p>
  <ol>${how.map(h => `<li>${esc(h)}</li>`).join("")}</ol>
  <p class="sig">Print on A4 · العربي السعودي</p>
</section>`;

const HOW = [
  "Say the sound out loud every single time you write the letter — the hand and the ear learn together.",
  "Start at the right and move left. The dots come last, after the body of the letter is finished.",
  "Trace the dotted letters first. Then cover the line and write it again on the empty ones.",
  "When you can write a letter without looking at the model, go on to the next sheet.",
];

export const BOOKLETS = [
  {
    file: "1-letters", title: "The letters, one a page",
    html: mode => (setMode(mode), doc("Arabic letters — trace and write", [
      cover("The letters, one a page", "الحُرُوف، حَرْف بْصَفْحَة",
        "All 28 letters. Each sheet gives you the letter written properly, its sound in English and in Ukrainian letters, the shapes it wears inside a word, and eleven lines to write it.", HOW),
      ...LETTERS.map(letterPage),
    ])),
  },
  {
    file: "2-in-a-word", title: "The letter inside a word",
    html: mode => (setMode(mode), doc("Arabic letters in a word — trace and write", [
      cover("The letter inside a word", "الحَرْف دَاخِل الكَلِمَة",
        "The same 28 letters, joined up: every shape written line after line, then shuffled, then a real Saudi word with the letter at the start, in the middle and at the end.", HOW),
      ...LETTERS.map(formsPage),
    ])),
  },
  {
    file: "3-look-alike", title: "Letters that look alike",
    html: mode => (setMode(mode), doc("Arabic letters that look alike", [
      cover("Letters that look alike", "حُرُوف تِتْشَابَه",
        "ب ت ث ن ي are one body and five sets of dots; so are ج ح خ, د ذ, ر ز, س ش, ص ض, ط ظ, ع غ, ف ق. Write them side by side until the dots are the only thing you need to look at — then put the dots on yourself.", HOW),
      ...GROUPS.map(familyPage),
    ])),
  },
  {
    file: "4-marks", title: "The marks — short and long vowels",
    html: mode => (setMode(mode), doc("Arabic vowel marks — trace and write", [
      cover("The marks", "الحَرَكَات",
        "The little signs that turn consonants into words: fatḥa, kasra, ḍamma, sukūn, shadda, the long ا و ي, the tied ة, الـ and the hamza — each with its sound in English and Ukrainian letters, and words to write.", HOW),
      ...MARKS.map(markPage),
    ])),
  },
  {
    file: "5-practice-paper", title: "Empty practice paper",
    html: mode => (setMode(mode), doc("Arabic practice paper", [1, 2, 3, 4].map(blankPage))),
  },
];
