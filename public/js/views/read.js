// Learning to read, from zero (#/read) — the ladder in data/read.js.
// Ten steps: step 1 uses six letters and nothing else, and each step adds the next group of the alphabet, so
// he is never shown a letter he hasn't met. Steps 1–7 carry their vowel marks; from step 8 they are gone.
// Under every line: the pronunciation in Latin and, below it, the same sounds in Ukrainian letters (core/ua.js).
import * as store from "../core/store.js";
import { t, tx, num } from "../core/i18n.js";
import { icon } from "../core/art.js";
import { esc, ar, translit, pageHead, playIcon } from "../core/dom.js";
import { READS, STEPS } from "../data/read.js";

let hideEnglish = false; // survives page switches until reload

const textsOf = n => READS.filter(r => r.step === n);
const doneSet = () => new Set(store.get().read?.done ?? []);
const lettersSoFar = n => STEPS.filter(s => s.n <= n).flatMap(s => [...s.add]);

const stepChips = (now, done) => `
  <div class="chips rd-steps" role="group" aria-label="${esc(t("read.steps"))}">
    ${STEPS.map(s => {
      const list = textsOf(s.n);
      const n = list.filter(r => done.has(r.id)).length;
      return `<button class="chip rd-chip" data-step="${s.n}" aria-pressed="${s.n === now}">
        <span class="d">${esc(t("read.step", { n: num(s.n) }))}</span>
        <span class="rd-chip-n">${num(n)}/${num(list.length)}</span>
        ${n === list.length ? `<span class="ok" aria-label="${esc(t("read.allRead"))}">✓</span>` : ""}
      </button>`;
    }).join("")}
  </div>`;

const line = l => `
  <li class="rd-line">
    <button type="button" class="rd-say" data-say="${esc(l.ar)}" aria-label="${esc(t("read.hear"))}">
      ${ar(l.ar, "rd-ar")}${playIcon}
    </button>
    <span class="rd-tr">${translit(l.say)}</span>
    <span class="rd-en"${hideEnglish ? " hidden" : ""} lang="en" dir="ltr">${esc(l.en)}</span>
  </li>`;

const card = (r, done) => `
  <article class="panel rd-card${done.has(r.id) ? " is-read" : ""}">
    <h3 class="rd-t"><span dir="ltr">${esc(tx(r.title))}</span>${ar(r.title.najdi, "rd-t-ar")}</h3>
    <ul class="rd-lines">${r.lines.map(line).join("")}</ul>
    <button type="button" class="btn rd-tick${done.has(r.id) ? "" : " btn-primary"}" data-done="${r.id}"
      aria-pressed="${done.has(r.id)}">${icon("check")} ${esc(t(done.has(r.id) ? "read.readIt" : "read.markRead"))}</button>
  </article>`;

export default {
  titleKey: "read.title",
  mount(root, { params, signal }) {
    let now = Math.min(10, Math.max(1, parseInt(params[0], 10) || 1));

    const render = () => {
      const done = doneSet();
      const step = STEPS[now - 1];
      const list = textsOf(now);
      const total = READS.length;
      const readAll = READS.filter(r => done.has(r.id)).length;

      root.innerHTML = `
        ${pageHead(t("read.title"), t("read.sub"), "", "", "qalam")}
        <p class="rd-total">${esc(t("read.total", { n: num(readAll), all: num(total) }))}</p>
        ${stepChips(now, done)}
        <section class="rd-head">
          <h2>${esc(tx(step.title))}</h2>
          <p class="rd-letters" dir="rtl" lang="ar">${lettersSoFar(now).map(c =>
            `<span class="rd-l${[...step.add].includes(c) ? " is-new" : ""}">${esc(c)}</span>`).join("")}</p>
          <p class="rd-note">${esc(tx(step.note))}</p>
          <button type="button" class="btn rd-hide" data-hide aria-pressed="${hideEnglish}">
            ${icon(hideEnglish ? "eye" : "check")} ${esc(t(hideEnglish ? "read.showEn" : "read.hideEn"))}</button>
        </section>
        <div class="rd-list">${list.map(r => card(r, done)).join("")}</div>`;
    };

    root.addEventListener("click", e => {
      const chip = e.target.closest("[data-step]");
      if (chip) {
        now = +chip.dataset.step;
        location.hash = `#/read/${now}`;
        render();
        return;
      }
      if (e.target.closest("[data-hide]")) {
        hideEnglish = !hideEnglish;
        render();
        return;
      }
      const tick = e.target.closest("[data-done]");
      if (tick) {
        const id = tick.dataset.done;
        store.update(st => {
          const set = new Set(st.read?.done ?? []);
          set.has(id) ? set.delete(id) : set.add(id);
          st.read = { done: [...set] };
        });
        render();
      }
    }, { signal });

    render();
  },
};
