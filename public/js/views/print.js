// Printables (NAJDI-PLAN.md Part 9, Phase 3): A4 practice sheets you print from the browser, or save as PDFs with
// `npm run pdf`. Arabic is at least 28pt and every row starts at the right margin.
//   #/print                          the list
//   #/print/letters/<1–6 | all>      letter tracing, one sheet per shape group
//   #/print/words/<stage>            word writing sheets, one topic after another
//   #/print/fold/<stage>             fold-and-test lists
//   #/print/cards/<set>              phrase cards, 8 per sheet, backs mirrored for double-sided printing
//   #/print/tracker/<week>           the weekly tracker
//   #/print/stories/<easy | A1 | A2>  stories to read: the Arabic large, how it's said and what it means below
import { todayKey, addDays, format } from "../core/dates.js";
import { weekNumber } from "../core/schedule.js";
import { t, tx, num, locale, lang } from "../core/i18n.js";
import { esc, ar, lat, pageHead } from "../core/dom.js";
import { icon } from "../core/art.js";
import { loadVocab } from "../core/vocab.js";
import { GROUPS, formsOf } from "../data/letters.js";
import { PHRASES } from "../data/phrases.js";
import { START } from "../config.js";
import { deckName, TOTAL_WEEKS } from "./shared.js";
import { loadStories } from "./stories.js";

const chunk = (list, n) => Array.from({ length: Math.ceil(list.length / n) }, (_, i) => list.slice(i * n, i * n + n));
const STAGES = ["1", "2", "3", "4", "special", "grammar"];
const CARD_SETS = ["phrases", "1", "2", "3", "4", "special"];

// The meaning under a word: the interface language first (English in the Arabic interfaces), then the other one.
const meaningLines = e => {
  const first = lang() === "uk" ? "uk" : "en";
  const second = first === "en" ? "uk" : "en";
  return `<span class="pm1" lang="${first}">${esc(e[first])}</span><span class="pm2" lang="${second}">${esc(e[second])}</span>`;
};

// A guideline row: the baseline, a faint line above it, and whatever glyphs sit on it.
const row = (glyphs = "", cls = "") => `<div class="trow${cls ? " " + cls : ""}" dir="rtl">${glyphs}</div>`;
const solid = text => `<span class="g solid" lang="ar">${esc(text)}</span>`;
const grey = text => `<span class="g grey" lang="ar">${esc(text)}</span>`;

// date: a line to write the date on (practice sheets; not cards to cut up, nor the tracker, which has its dates).
function sheet(title, body, n, total, cls = "", { date = true } = {}) {
  return `<section class="sheet${cls ? " " + cls : ""}">
    <header class="sheet-head"><h2>${title}</h2>${date ? `<p>${esc(t("print.nameDate"))}</p>` : ""}</header>
    <div class="sheet-body">${body}</div>
    <footer class="sheet-foot"><span translate="no">Saudi · <span lang="ar">سعودي</span></span><span dir="ltr">${num(n)} / ${num(total)}</span></footer>
  </section>`;
}

// ---------- 1. Letter tracing ----------
function letterSheets(which) {
  const groups = which === "all" ? GROUPS.map((_, i) => i) : [Math.max(0, Math.min(GROUPS.length - 1, (+which || 1) - 1))];
  return groups.map((g, i) => {
    const group = GROUPS[g];
    const blocks = group.letters.map(l => {
      const forms = formsOf(l);
      const cells = (fn, perCell, labelled) =>
        forms.map(([f, key]) => `<span class="cell"${labelled ? ` data-form="${esc(t(key))}"` : ""}>${fn(f, perCell)}</span>`).join("");
      return `<div class="tletter" style="--cols:${forms.length}">
        <p class="tl-head"><b class="tl-char" lang="ar">${esc(l.char)}</b> ${lat(l.name)} <span class="tl-sound">${esc(tx(l.sound))}</span>
          <span class="tl-forms">${forms.map(([, key]) => `<span>${t(key)}</span>`).join("")}</span></p>
        ${row(cells((f, n) => solid(f) + grey(f).repeat(n), forms.length === 2 ? 3 : 1, true), "cells")}
        ${row(cells((f, n) => grey(f).repeat(n), forms.length === 2 ? 4 : 2), "cells")}
        ${row()}
      </div>`;
    }).join("");
    const spare = Math.max(0, 6 - group.letters.length) * 3; // smaller groups: free practice to fill the page
    const title = `${esc(t("print.lettersTitle", { days: group.days }))} · ${esc(tx(group.title))}`;
    return sheet(title, `${blocks}${spare ? `<p class="free-label">${esc(t("print.freePractice"))}</p>${row().repeat(spare)}` : ""}`, i + 1, groups.length, "s-letters");
  }).join("");
}

// ---------- 2. Word writing ----------
// Each word: how it's said and what it means on a line of its own, lined up above the word; then the word in black
// with grey copies to trace after it (as many as fit — fitRows() removes the ones that would run off the line);
// then an empty line to write it yourself.
function wordSheets(stage) {
  const pages = stage.topics.flatMap(topic => chunk(topic.entries, 8).map(list => ({ topic, list })));
  return pages.map((p, i) => sheet(
    `${esc(deckName(stage.id))} · ${esc(tx(p.topic.title))}`,
    p.list.map(e => `<div class="tword">
      <p class="tw-cap" dir="ltr">${lat(e.say, "tr")}${meaningLines(e)}</p>
      ${row(solid(e.ar) + grey(e.ar).repeat(4), "fit")}
      ${row()}
    </div>`).join(""),
    i + 1, pages.length, "s-words",
  )).join("");
}

// ---------- 3. Fold-and-test ----------
function foldSheets(stage) {
  const all = stage.topics.flatMap(topic => topic.entries);
  const pages = chunk(all, 15);
  return pages.map((list, i) => sheet(
    `${esc(t("print.foldTitle"))} · ${esc(deckName(stage.id))}`,
    `<p class="fold-line"><span>${esc(t("print.foldHere"))}</span></p>
     <table class="fold" dir="ltr"><tbody>${list.map(e => `
       <tr><td class="fold-meaning">${lat(e.say, "tr")}${meaningLines(e)}</td><td class="fold-ar" dir="rtl" lang="ar">${esc(e.ar)}</td></tr>`).join("")}
     </tbody></table>`,
    i + 1, pages.length, "s-fold",
  )).join("");
}

// ---------- 4. Phrase cards ----------
// 8 cards a sheet (2 across, 4 down). The back of each sheet swaps left and right, so with double-sided printing
// (flip on the long edge) every answer lands behind its card.
function cardSheets(list) {
  const pages = chunk(list, 8);
  const out = [];
  pages.forEach((cards, i) => {
    const slots = Array.from({ length: 8 }, (_, k) => cards[k] && { ...cards[k], n: i * 8 + k + 1 });
    const no = c => `<span class="pc-n" dir="ltr">${num(c.n)}</span>`; // the same number front and back, to pair them after cutting
    const front = slots.map(c => `<div class="pcard">${c ? `${no(c)}<p lang="ar" dir="rtl">${esc(c.ar)}</p>` : ""}</div>`).join("");
    const mirrored = [0, 1, 2, 3].flatMap(r => [slots[r * 2 + 1], slots[r * 2]]);
    const back = mirrored.map(c => `<div class="pcard back">${c ? `${no(c)}${lat(c.say, "tr")}${meaningLines(c)}` : ""}</div>`).join("");
    out.push(sheet(esc(t("print.cardsFront")), `<div class="pcards">${front}</div>`, i * 2 + 1, pages.length * 2, "s-cards", { date: false }));
    out.push(sheet(esc(t("print.cardsBack")), `<div class="pcards">${back}</div>`, i * 2 + 2, pages.length * 2, "s-cards", { date: false }));
  });
  return out.join("");
}

// ---------- 5. Weekly tracker ----------
function trackerSheet(week) {
  const start = addDays(START, (week - 1) * 7);
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const box = label => `<span class="tk-field"><span>${label}</span><i></i></span>`;
  return sheet(
    esc(t("print.trackerTitle", { n: week, dates: `${format(days[0], { day: "numeric", month: "short" }, locale())} – ${format(days[6], { day: "numeric", month: "short", year: "numeric" }, locale())}` })),
    days.map(d => `<div class="tk-day">
      <p class="tk-top"><b>${esc(format(d, { weekday: "long", day: "numeric", month: "short" }, locale()))}</b>
        ${box(t("print.trackMinutes"))}${box(t("print.trackWords"))}${box(t("print.trackVoice"))}
        <span class="tk-check"><i></i>${esc(t("print.trackTutor"))}</span></p>
      <p class="tk-label">${esc(t("print.trackSentence"))}</p>
      ${row()}${row()}
    </div>`).join(""),
    1, 1, "s-tracker", { date: false },
  );
}

// ---------- 6. Stories to read ----------
// One story a sheet: the Arabic, numbered (the very easy ones large, like a children's book), then — under a dashed
// line to fold back — each sentence's pronunciation and meaning.
function storySheets(S, level) {
  const list = S.STORIES.filter(st => st.level === level);
  const pages = chunk(list, 1);
  const story = st => `<div class="ps-story">
    <h3>${esc(tx(st.title))}</h3>
    <ol class="ps-ar" dir="rtl" lang="ar">${st.text.map(l => `<li>${esc(l.ar)}</li>`).join("")}</ol>
    <div class="ps-write optional"><p class="free-label">${esc(t("print.copySentence"))}</p>${row()}${row()}</div>
    <p class="ps-cut"><span>${esc(t("print.foldHere"))}</span></p>
    <ol class="ps-key">${st.text.map(l => `<li>${lat(l.say, "tr")}${meaningLines(l)}</li>`).join("")}</ol>
  </div>`;
  return pages.map((group, i) => sheet(`${esc(t("print.storiesName"))} · ${esc(t(`st.step.${level}`))}`, group.map(story).join(""), i + 1, pages.length, `s-stories lv-${level}`)).join("");
}

// ---------- The list of printables ----------
function index() {
  const w = Math.max(1, Math.min(TOTAL_WEEKS, weekNumber(todayKey())));
  const item = (iconName, title, text, links) => `
    <article class="print-item">
      <div class="pi-icon">${icon(iconName)}</div>
      <div><h2>${title}</h2><p class="muted">${text}</p><div class="pi-links">${links}</div></div>
    </article>`;
  const link = (href, label) => `<a class="btn btn-small" href="${href}">${label}</a>`;
  return `
    ${pageHead(t("print.title"), t("print.sub"), "", "", "well")}
    <div class="print-list">
      ${item("letters", t("print.lettersName"), t("print.lettersText"),
        GROUPS.map((g, i) => link(`#/print/letters/${i + 1}`, `${esc(t("letters.days", { days: g.days }))} <span lang="ar">${esc(g.letters.map(l => l.char).join(" "))}</span>`)).join("") + link("#/print/letters/all", esc(t("print.all"))))}
      ${item("words", t("print.wordsName"), t("print.wordsText"), STAGES.map(s => link(`#/print/words/${s}`, esc(deckName(s)))).join(""))}
      ${item("reading", t("print.foldName"), t("print.foldText"), STAGES.map(s => link(`#/print/fold/${s}`, esc(deckName(s)))).join(""))}
      ${item("cards", t("print.cardsName"), t("print.cardsText"), CARD_SETS.map(s => link(`#/print/cards/${s}`, esc(deckName(s)))).join(""))}
      ${item("reading", t("print.storiesName"), t("print.storiesText"), ["easy", "A1", "A2"].map(l => link(`#/print/stories/${l}`, esc(t(`st.step.${l}`)))).join(""))}
      ${item("calendar", t("print.trackerName"), t("print.trackerText"), `${link(`#/print/tracker/${w}`, esc(t("print.thisWeek", { n: w })))}${w < TOTAL_WEEKS ? link(`#/print/tracker/${w + 1}`, esc(t("print.nextWeek", { n: w + 1 }))) : ""}`)}
    </div>
    <section class="panel how-print">
      <h2>${icon("print")} ${t("print.howTitle")}</h2>
      <ul class="checks"><li>${t("print.how1")}</li><li>${t("print.how2")}</li><li>${t("print.how3")}</li></ul>
    </section>`;
}

// Anything marked optional (the lines to copy a sentence under a story) goes if the sheet would overflow.
function fitSheets(root) {
  for (const body of root.querySelectorAll(".sheet-body")) {
    const extra = [...body.querySelectorAll(".optional")];
    while (extra.length && body.scrollHeight > body.clientHeight + 1) extra.pop().remove();
  }
}

// A word and its grey copies share one line: drop copies from the end until the line fits (long phrases keep
// one copy, or none — then the empty line under it is for tracing from the black one).
function fitRows(root) {
  for (const rowEl of root.querySelectorAll(".trow.fit")) {
    const greys = [...rowEl.querySelectorAll(".g.grey")];
    while (greys.length && rowEl.scrollWidth > rowEl.clientWidth + 1) greys.pop().remove();
  }
}

// The baseline sits wherever the Arabic font puts it: measure it once and draw every guideline there.
function measureBaseline(root) {
  const rowEl = root.querySelector(".trow:not(.cells)");
  if (!rowEl) return;
  const mark = document.createElement("span");
  mark.style.cssText = "display:inline-block;width:0;height:0;vertical-align:baseline";
  rowEl.append(mark);
  const bl = mark.getBoundingClientRect().top - rowEl.getBoundingClientRect().top;
  mark.remove();
  root.querySelector(".sheets")?.style.setProperty("--bl", `${bl.toFixed(2)}px`);
}

export default {
  titleKey: "print.title",
  mount(root, { params, signal }) {
    const [kind, arg] = params;
    if (!kind) {
      root.innerHTML = index();
      return;
    }
    const toolbar = `
      <div class="print-bar">
        <h1 class="visually-hidden">${t("print.title")}</h1>
        <a class="btn btn-ghost" href="#/print">${icon("back")} ${t("print.title")}</a>
        <p class="muted">${t("print.barHint")}</p>
        <button class="btn btn-primary" data-print>${icon("print")} ${t("print.print")}</button>
      </div>`;
    const show = sheets => {
      if (signal.aborted) return;
      root.innerHTML = `${toolbar}<div class="sheets">${sheets}</div>`;
      document.fonts.ready.then(() => {
        if (signal.aborted) return;
        measureBaseline(root);
        fitRows(root);
        fitSheets(root);
        document.body.dataset.printReady = "1"; // scripts/print-pdf.mjs waits for this
      });
    };
    delete document.body.dataset.printReady;
    signal.addEventListener("abort", () => delete document.body.dataset.printReady);
    root.addEventListener("click", e => e.target.closest("[data-print]") && window.print(), { signal });

    if (kind === "letters") return show(letterSheets(arg ?? "1"));
    if (kind === "tracker") return show(trackerSheet(Math.max(1, Math.min(TOTAL_WEEKS, +arg || weekNumber(todayKey())))));
    root.innerHTML = `${toolbar}<p class="muted">${esc(t("words.loading"))}</p>`;
    if (kind === "stories") {
      loadStories().then(S => show(storySheets(S, ["easy", "A1", "A2"].includes(arg) ? arg : "easy")), () => show(`<p>${esc(t("st.loadError"))}</p>`));
      return;
    }
    loadVocab().then(({ vocab }) => {
      if (kind === "cards" && arg === "phrases") return show(cardSheets(PHRASES.map(p => ({ ...p, say: p.tr }))));
      const stage = vocab.stages.find(s => s.id === arg) ?? vocab.stages[0];
      if (kind === "words") return show(wordSheets(stage));
      if (kind === "fold") return show(foldSheets(stage));
      if (kind === "cards") return show(cardSheets(stage.topics.flatMap(tp => tp.entries)));
      location.hash = "#/print";
    }, () => show(`<p>${esc(t("words.loadError"))}</p>`));
  },
};
