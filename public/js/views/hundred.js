// The hundred words for talking to Dima (#/hundred) — data/hundred.js.
//
// One page, ten groups, every word a button that says itself in a Saudi voice (data/voices.js). The Arabic is
// shown fully marked, because that is what he has to read to say it right, and because it is exactly what the
// voice was given. Tapping a word counts it as heard, so the page fills itself in while he works through it.
import * as store from "../core/store.js";
import { t, tx, num } from "../core/i18n.js";
import { esc, ar, translit, pageHead, playIcon } from "../core/dom.js";
import { GROUPS, HUNDRED } from "../data/hundred.js";

const heard = () => new Set(store.get().hundred?.done ?? []);

const word = (w, done) => `
  <li><button type="button" class="hd-word${done.has(w.file) ? " is-heard" : ""}" data-say="${esc(w.ar)}" data-heard="${esc(w.file)}">
    ${ar(w.show, "hd-ar")}
    <span class="hd-say">${translit(w.say)}</span>
    <span class="hd-en" lang="en" dir="ltr">${esc(w.en)}</span>
    ${playIcon}
  </button></li>`;

export default {
  titleKey: "hundred.title",
  mount(root, { signal }) {
    const render = () => {
      const done = heard();
      const n = HUNDRED.filter(w => done.has(w.file)).length;
      root.innerHTML = `
        ${pageHead(t("hundred.title"), t("hundred.sub"), "", "", "qalam")}
        <p class="hd-count">${esc(t("hundred.count", { n: num(n), all: num(HUNDRED.length) }))}</p>
        <div class="hd-bar" aria-hidden="true"><span style="width:${(n / HUNDRED.length) * 100}%"></span></div>
        <details class="hd-how">
          <summary>${esc(t("hundred.howTitle"))}</summary>
          <p>${esc(t("hundred.how"))}</p>
        </details>
        ${GROUPS.map(g => {
          const words = HUNDRED.filter(w => w.group === g.id);
          const got = words.filter(w => done.has(w.file)).length;
          return `<section class="hd-group">
            <h2 class="hd-h">
              <span class="hd-h-ar" lang="ar" dir="rtl">${esc(g.title.najdi)}</span>
              <span class="hd-h-en" dir="ltr">${esc(g.title.en)}</span>
              <span class="hd-h-n">${esc(num(got))}/${esc(num(words.length))}</span>
            </h2>
            <p class="hd-sub">${esc(tx(g.sub))}</p>
            <ul class="hd-list">${words.map(w => word(w, done)).join("")}</ul>
          </section>`;
        }).join("")}`;
    };

    // Tapping a word plays it (main.js handles data-say) and counts it as heard.
    root.addEventListener("click", e => {
      const btn = e.target.closest("[data-heard]");
      if (!btn) return;
      const file = btn.dataset.heard;
      if (heard().has(file)) return;
      store.update(s => { s.hundred = { done: [...new Set([...(s.hundred?.done ?? []), file])] }; }, { silent: true });
      btn.classList.add("is-heard");
      const box = btn.closest(".hd-group");
      const all = box.querySelectorAll(".hd-word").length;
      box.querySelector(".hd-h-n").textContent = `${num(box.querySelectorAll(".hd-word.is-heard").length)}/${num(all)}`;
      const n = HUNDRED.filter(w => heard().has(w.file)).length;
      root.querySelector(".hd-count").textContent = t("hundred.count", { n: num(n), all: num(HUNDRED.length) });
      root.querySelector(".hd-bar span").style.width = `${(n / HUNDRED.length) * 100}%`;
    }, { signal });

    render();
  },
};
