import * as store from "../core/store.js";
import { learnedLetters, lettersIn } from "../core/schedule.js";
import { t } from "../core/i18n.js";
import { esc, ar, translit, flag, flagNote, meanings, playIcon, pageHead, shuffle } from "../core/dom.js";
import { WORDS } from "../data/words.js";

// View settings survive page switches until reload.
let showAll = false;
let order = WORDS.map((_, i) => i);
const revealed = new Set();

export default {
  titleKey: "reading.title",
  mount(root, { signal }) {
    const render = () => {
      const known = learnedLetters(store.get().script.done);
      const readable = i => lettersIn(WORDS[i].ar).every(c => known.has(c));
      const count = WORDS.filter((_, i) => readable(i)).length;
      const list = order.filter(i => showAll || readable(i));

      root.innerHTML = `
        ${pageHead(t("reading.title"), t("reading.sub"), "", "", "reading")}
        <div class="toolbar">
          <p>${t("reading.count", { n: count, total: WORDS.length })}</p>
          <div class="btn-row">
            <button class="btn" data-act="all" aria-pressed="${showAll}">${t(showAll ? "reading.showingAll" : "reading.showAll")}</button>
            <button class="btn" data-act="shuffle">${t("reading.shuffle")}</button>
            <button class="btn" data-act="reveal">${t("reading.revealAll")}</button>
            <button class="btn" data-act="hide">${t("reading.hideAll")}</button>
          </div>
        </div>
        <div class="words">
          ${list.map(i => {
            const w = WORDS[i];
            const open = revealed.has(i);
            return `
            <article class="word${open ? " is-open" : ""}${readable(i) ? "" : " is-locked"}">
              <button class="word-ar" data-reveal="${i}" aria-expanded="${open}">${ar(w.ar)}</button>
              <div class="word-back"${open ? "" : " hidden"}>
                <button class="word-say" data-say="${esc(w.ar)}" aria-label="${esc(t("lab.hear", { what: w.tr }))}">${playIcon}</button>
                <div>${translit(w.tr)} ${flag(w)}${meanings(w)}</div>
              </div>
              ${open ? flagNote(w) : ""}
            </article>`;
          }).join("")}
        </div>`;
    };

    root.addEventListener("click", e => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.reveal !== undefined) {
        const i = +b.dataset.reveal;
        revealed.has(i) ? revealed.delete(i) : revealed.add(i);
      } else if (b.dataset.act === "all") showAll = !showAll;
      else if (b.dataset.act === "shuffle") order = shuffle([...order]);
      else if (b.dataset.act === "reveal") order.forEach(i => revealed.add(i));
      else if (b.dataset.act === "hide") revealed.clear();
      else return;
      render();
      if (b.dataset.reveal !== undefined) root.querySelector(`[data-reveal="${b.dataset.reveal}"]`)?.focus();
    }, { signal });

    render();
  },
};
