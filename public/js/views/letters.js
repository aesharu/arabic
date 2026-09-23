import * as store from "../core/store.js";
import { scheduledGroup } from "../core/schedule.js";
import { t, tx, num } from "../core/i18n.js";
import { icon } from "../core/art.js";
import { esc, rich, ar, lat, translit, flag, flagNote, meanings, playIcon, pageHead } from "../core/dom.js";
import { GROUPS, formsOf } from "../data/letters.js";
import { UA_KEY } from "../core/ua.js";

export function groupChips({ isOn, done, scheduled }) {
  return `<div class="chips" role="group" aria-label="${esc(t("letters.groups"))}">${GROUPS.map((g, i) => `
    <button class="chip" data-g="${i}" aria-pressed="${isOn(i)}">
      <span class="d">${t("letters.days", { days: g.days })}</span>${ar(g.letters.map(l => l.char).join(" "))}
      ${done.includes(i) ? `<span class="ok" aria-label="${esc(t("letters.doneMark"))}">✓</span>` : ""}
      ${i === scheduled && !done.includes(i) ? `<span class="now">${t("letters.today")}</span>` : ""}
    </button>`).join("")}</div>`;
}

const card = l => `
  <article class="card">
    <div class="top">
      <button class="glyph ar" lang="ar" data-say="${esc(l.nameAr)}" aria-label="${esc(t("letters.hearName", { name: l.name }))}">${esc(l.char)}</button>
      <div class="meta">
        <div class="name"><b>${translit(l.name)}</b>${ar(l.nameAr)}
          ${l.hard ? `<span class="tag h">${t("letters.newSound")}</span>` : ""}${l.nonJoining ? `<span class="tag nc">${t("letters.nonJoining")}</span>` : ""}</div>
        <p class="sound">${rich(tx(l.sound))}</p>
      </div>
    </div>
    <div class="forms">${formsOf(l).map(([f, key]) => `<div>${ar(f)}<small>${t(key)}</small></div>`).join("")}</div>
    <button class="ex" data-say="${esc(l.example.ar)}">${ar(l.example.ar)}
      <span class="t">${translit(l.example.tr)} ${flag(l)}${meanings(l.example)}</span>${playIcon}</button>
    ${flagNote(l)}
    ${l.najdi ? `<div class="najdi"><b>${t("lab.najdi")}</b> ${rich(tx(l.najdi))}</div>` : ""}
  </article>`;

// The whole alphabet in one table, in alphabetical order: #/letters/all
const ORDER = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي";
const ALL = GROUPS.flatMap(g => g.letters).sort((a, b) => ORDER.indexOf(a.char) - ORDER.indexOf(b.char));
const T = "\u0640"; // tatweel: the joining line
// Start, middle, end, alone. A letter that never joins forward keeps its alone shape at the start.
const shapes = l => (l.nonJoining ? [l.char, T + l.char, T + l.char, l.char] : [l.char + T, T + l.char + T, T + l.char, l.char]);
const FORMS = ["form.start", "form.middle", "form.end", "form.alone"];

const tableRow = (l, i) => `
  <tr class="${l.hard ? "is-hard" : ""}">
    <td class="lt-n">${num(i + 1)}</td>
    <td class="lt-char"><button class="lt-glyph ar" lang="ar" data-say="${esc(l.nameAr)}" aria-label="${esc(t("letters.hearName", { name: l.name }))}">${esc(l.char)}</button></td>
    <td class="lt-name"><b>${translit(l.name)}</b> ${ar(l.nameAr)}
      ${l.hard ? `<span class="tag h">${t("letters.newSound")}</span>` : ""}${l.nonJoining ? `<span class="tag nc">${t("letters.nonJoining")}</span>` : ""}</td>
    <td class="lt-sound"><b>${translit(l.translit, l.ua)}</b></td>
    ${shapes(l).map((f, k) => `<td class="lt-f" data-label="${esc(t(FORMS[k]))}">${ar(f)}</td>`).join("")}
    <td class="lt-ex"><button class="lt-exbtn" data-say="${esc(l.example.ar)}">${ar(l.example.ar)}
      <span>${translit(l.example.tr)} · ${esc(l.example.en)} ${flag(l)}</span></button></td>
  </tr>`;

// The key to the Ukrainian line, on the page where the sounds are learned. Only in his profile, like the line itself.
// The key names Arabic letters inside English sentences; each run of them is isolated so a full stop or a
// bracket beside it can't reorder the line.
const AR_RUN = /[\u0600-\u06FF]+(?:\s+[\u0600-\u06FF]+)*/g;
const bidi = s => esc(s).replace(AR_RUN, m => `<bdi dir="rtl" lang="ar">${m}</bdi>`);

const uaKey = () => (store.isTeacher() ? "" : `
  <details class="ua-key">
    <summary>${esc(t("ua.key"))}</summary>
    <p>${bidi(t("ua.keyIntro"))}</p>
    <p class="ua-tbl-h">${esc(t("ua.keyTable"))}</p>
    <ul class="ua-tbl">${UA_KEY.map(x => `
      <li><b lang="uk" dir="ltr">${esc(x.ua)}</b>${ar(x.ar)}</li>`).join("")}</ul>
    <ul>${["ua.keyG", "ua.keyTail", "ua.keyTh", "ua.keyHeavy", "ua.keyA", "ua.keyL", "ua.keyW", "ua.keyLong"]
      .map(k => `<li>${bidi(t(k))}</li>`).join("")}</ul>
    <p class="muted small">${esc(t("ua.keyFix"))}</p>
  </details>`);

const table = () => `
  ${pageHead(t("letters.tableTitle"), t("letters.tableSub"), "", "", "qalam")}
  <p class="lt-back"><a href="#/letters">${icon("back")} ${t("letters.byGroups")}</a></p>
  ${uaKey()}
  <table class="lt-table">
    <thead><tr><th class="lt-n">#</th><th>${t("letters.colLetter")}</th><th>${t("letters.colName")}</th><th>${t("letters.colSound")}</th>
      ${FORMS.map(k => `<th class="lt-fh">${t(k)}</th>`).join("")}<th>${t("letters.colExample")}</th></tr></thead>
    <tbody>${ALL.map(tableRow).join("")}</tbody>
  </table>`;

export default {
  titleKey: "letters.title",
  mount(root, { params, signal }) {
    if (params[0] === "all") {
      root.innerHTML = table();
      return;
    }
    const fromUrl = parseInt(params[0], 10) - 1;
    const g = fromUrl >= 0 && fromUrl < GROUPS.length ? fromUrl : scheduledGroup();

    const render = () => {
      const { done } = store.get().script;
      const group = GROUPS[g];
      const isDone = done.includes(g);
      root.innerHTML = `
        ${pageHead(t("letters.title"), t("letters.sub"), "", "", "qalam")}
        <p><a class="btn lt-all" href="#/letters/all">${icon("words")} ${t("letters.all")}</a></p>
        ${groupChips({ isOn: i => i === g, done, scheduled: scheduledGroup() })}
        <div class="gintro"><h2>${esc(tx(group.title))}</h2><p>${rich(tx(group.note))}</p></div>
        <div class="cards">${group.letters.map(card).join("")}</div>
        <button class="done" data-done aria-pressed="${isDone}">${t(isDone ? "letters.isDone" : "letters.markDone", { days: group.days })}</button>
        <p class="hint">${t("letters.hint")}</p>`;
    };

    root.addEventListener("click", e => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.g !== undefined) {
        location.hash = `#/letters/${+b.dataset.g + 1}`;
      } else if (b.hasAttribute("data-done")) {
        store.update(s => {
          const { script } = s;
          if (script.done.includes(g)) script.done = script.done.filter(x => x !== g);
          else {
            script.done = [...script.done, g];
            if (!script.quiz.includes(g)) script.quiz = [...script.quiz, g];
          }
        });
        render();
      }
    }, { signal });

    render();
  },
};
