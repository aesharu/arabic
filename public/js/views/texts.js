// Learning to read, from zero (#/read) — the ladder in data/read.js.
// It is laid out like a page in a book: the Arabic runs as one block of text, and the pronunciation, the
// Ukrainian and the English sit under it as their own blocks — not interleaved line by line, because that is
// not reading. Every sentence in the block is still its own button, so a tap plays it.
// Steps 1–3 are letter-gated and hold words, not texts; from step 4 the whole alphabet is open.
import * as store from "../core/store.js";
import { t, tx, num } from "../core/i18n.js";
import { icon } from "../core/art.js";
import { esc, ar, lat, translit, pageHead } from "../core/dom.js";
import { uaSay, hasSay } from "../core/ua.js";
import { READS, STEPS } from "../data/read.js";

let show = { say: true, en: true, lines: false }; // survives page switches until reload

const textsOf = n => READS.filter(r => r.step === n);
const doneSet = () => new Set(store.get().read?.done ?? []);
const lettersSoFar = n => STEPS.filter(s => s.n <= n).flatMap(s => [...s.add]);
const mine = () => !store.isTeacher();

const stepChips = (now, done) => `
  <div class="chips rd-steps" role="group" aria-label="${esc(t("texts.steps"))}">
    ${STEPS.map(s => {
      const list = textsOf(s.n);
      const n = list.filter(r => done.has(r.id)).length;
      return `<button class="chip rd-chip" data-step="${s.n}" aria-pressed="${s.n === now}">
        <span class="d">${esc(t("texts.step", { n: num(s.n) }))}</span>
        <span class="rd-chip-n">${num(n)}/${num(list.length)}</span>
        ${n === list.length ? `<span class="ok" aria-label="${esc(t("texts.allRead"))}">✓</span>` : ""}
      </button>`;
    }).join("")}
  </div>`;

// A page of text, set like a sheet from a printed Arabic book: a ruled frame, the title above a rule, the
// Arabic justified in naskh, and a small star between sentences. Each sentence is still its own button.
// Not every line was written with a full stop, and run together in one block they need one.
const stop = t => (/[.!?…؟]$/.test(t.trim()) ? t.trim() : t.trim() + ".");
const run = (r, f) => r.lines.map(l => stop(f(l))).join(" ");

const page = r => `
  <div class="rd-sheet"><div class="rd-sheet-in">
    <h4 class="rd-sheet-t" lang="ar" dir="rtl">${esc(r.title.najdi)}</h4>
    <p class="rd-body" lang="ar" dir="rtl" translate="no">${r.lines.map((l, i) =>
      `${i ? '<span class="rd-orn" aria-hidden="true">٭</span>' : ""}<button type="button" class="rd-s" data-say="${esc(l.ar)}">${esc(l.ar)}</button>`).join(" ")}</p>
  </div></div>
  ${show.say ? `<p class="rd-say">${lat(run(r, l => l.say), "", "ar-Latn")}</p>
    ${mine() && r.lines.some(l => hasSay(l.say))
      ? `<p class="rd-ua" lang="uk" dir="ltr" translate="no">${esc(run(r, l => uaSay(l.say)))}</p>` : ""}` : ""}
  ${show.en ? `<p class="rd-en" lang="en" dir="ltr">${esc(run(r, l => l.en))}</p>` : ""}`;

// Word practice (steps 1–3): a strip of cards, because five unrelated words are not a text.
const strip = r => `
  <ul class="rd-words">${r.lines.map(l => `
    <li><button type="button" class="rd-w" data-say="${esc(l.ar)}">
      ${ar(l.ar, "rd-w-ar")}
      ${show.say ? `<span class="rd-w-say">${translit(l.say)}</span>` : ""}
      ${show.en ? `<span class="rd-w-en" lang="en" dir="ltr">${esc(l.en)}</span>` : ""}
    </button></li>`).join("")}</ul>`;

// Line by line, for when he wants them lined up instead of flowing.
const byLine = r => `
  <ul class="rd-lines">${r.lines.map(l => `
    <li class="rd-line">
      <button type="button" class="rd-say-btn" data-say="${esc(l.ar)}">${ar(l.ar, "rd-ar")}</button>
      ${show.say ? `<span class="rd-tr">${translit(l.say)}</span>` : ""}
      ${show.en ? `<span class="rd-en-s" lang="en" dir="ltr">${esc(l.en)}</span>` : ""}
    </li>`).join("")}</ul>`;

const card = (r, step, done) => `
  <article class="panel rd-card${done.has(r.id) ? " is-read" : ""}">
    ${step.kind === "words" ? `<h3 class="rd-t">${ar(r.title.najdi, "rd-t-ar")}<span class="rd-t-en" dir="ltr">${esc(tx(r.title))}</span></h3>` : ""}
    ${step.kind === "words" ? "" : `<p class="rd-t-en rd-t-over" dir="ltr">${esc(tx(r.title))}</p>`}
    ${step.kind === "words" ? strip(r) : show.lines ? byLine(r) : page(r)}
    <button type="button" class="btn rd-tick${done.has(r.id) ? "" : " btn-primary"}" data-done="${r.id}"
      aria-pressed="${done.has(r.id)}">${icon("check")} ${esc(t(done.has(r.id) ? "texts.readIt" : "texts.markRead"))}</button>
  </article>`;

const toggle = (key, onKey, offKey) => `
  <button type="button" class="btn rd-tg${show[key] ? " is-on" : ""}" data-toggle="${key}" aria-pressed="${show[key]}">
    ${esc(t(show[key] ? onKey : offKey))}</button>`;

export default {
  titleKey: "texts.title",
  mount(root, { params, signal }) {
    let now = Math.min(STEPS.length, Math.max(1, parseInt(params[0], 10) || 1));

    const render = () => {
      const done = doneSet();
      const step = STEPS[now - 1];
      const list = textsOf(now);
      const readAll = READS.filter(r => done.has(r.id)).length;

      root.innerHTML = `
        ${pageHead(t("texts.title"), t("texts.sub"), "", "", "qalam")}
        <p class="rd-total">${esc(t("texts.total", { n: num(readAll), all: num(READS.length) }))}</p>
        ${stepChips(now, done)}
        <section class="rd-head">
          <h2>${esc(tx(step.title))}</h2>
          ${[...step.add].length
            ? `<p class="rd-letters" dir="rtl" lang="ar">${lettersSoFar(now).map(c =>
                `<span class="rd-l${[...step.add].includes(c) ? " is-new" : ""}">${esc(c)}</span>`).join("")}</p>`
            : ""}
          <p class="rd-note">${esc(tx(step.note))}</p>
          <div class="btn-row rd-tools">
            ${toggle("say", "texts.hideSay", "texts.showSay")}
            ${toggle("en", "texts.hideEn", "texts.showEn")}
            ${step.kind === "words" ? "" : toggle("lines", "texts.flow", "texts.byLine")}
          </div>
        </section>
        <details class="rd-how">
          <summary>${esc(t("texts.howTitle"))}</summary>
          <p>${esc(t("texts.how1"))}</p>
          <p>${esc(t("texts.how2"))}</p>
          <p>${esc(t("texts.how3"))}</p>
        </details>
        <div class="rd-list">${list.map(r => card(r, step, done)).join("")}</div>`;
    };

    root.addEventListener("click", e => {
      const chip = e.target.closest("[data-step]");
      if (chip) {
        now = +chip.dataset.step;
        location.hash = `#/read/${now}`;
        render();
        return;
      }
      const tg = e.target.closest("[data-toggle]");
      if (tg) {
        show[tg.dataset.toggle] = !show[tg.dataset.toggle];
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
