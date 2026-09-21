import * as store from "../core/store.js";
import { learnedLetters, lettersIn } from "../core/schedule.js";
import { esc, ar, flag, flagNote, playIcon, pageHead, shuffle } from "../core/dom.js";
import { WORDS } from "../data/words.js";

// View settings survive page switches until reload.
let showAll = false;
let order = WORDS.map((_, i) => i);
const revealed = new Set();

export default {
  title: "Reading",
  mount(root, { signal }) {
    const render = () => {
      const known = learnedLetters(store.get().script.done);
      const readable = i => lettersIn(WORDS[i].ar).every(c => known.has(c));
      const count = WORDS.filter((_, i) => readable(i)).length;
      const list = order.filter(i => showAll || readable(i));

      root.innerHTML = `
        ${pageHead("Reading", "Real Najdi words, written the way Saudis write them — without vowel marks. Say each word out loud, then click it to check.")}
        <div class="toolbar">
          <p><b>${count}</b> of ${WORDS.length} words use only letters you know so far.</p>
          <div class="btn-row">
            <button class="btn" data-act="all" aria-pressed="${showAll}">${showAll ? "Showing all words" : "Show all words"}</button>
            <button class="btn" data-act="shuffle">Shuffle</button>
            <button class="btn" data-act="reveal">Reveal all</button>
            <button class="btn" data-act="hide">Hide all</button>
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
                <button class="word-say" data-say="${esc(w.ar)}" aria-label="Hear ${esc(w.tr)}">${playIcon}</button>
                <div><b>${esc(w.tr)}</b> ${flag(w)}<span>${esc(w.en)}</span></div>
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
