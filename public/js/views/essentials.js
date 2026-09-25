// The essentials words for talking to Dima (#/essentials) — data/essentials.js.
//
// One page, ten groups, every word a button that says itself in a Saudi voice (data/voices.js). The Arabic is
// shown fully marked, because that is what he has to read to say it right, and because it is exactly what the
// voice was given. Tapping a word counts it as heard, so the page fills itself in while he works through it.
import * as store from "../core/store.js";
import { t, tx, num } from "../core/i18n.js";
import { esc, ar, translit, pageHead, playIcon } from "../core/dom.js";
import { GROUPS, ESSENTIALS } from "../data/essentials.js";

const heard = () => new Set(store.get().essentials?.done ?? []);

const word = (w, done) => `
  <li><button type="button" class="es-word${done.has(w.file) ? " is-heard" : ""}" data-say="${esc(w.ar)}" data-heard="${esc(w.file)}">
    ${ar(w.show, "es-ar")}
    <span class="es-say">${translit(w.say)}</span>
    <span class="es-en" lang="en" dir="ltr">${esc(w.en)}</span>
    ${playIcon}
  </button></li>`;

export default {
  titleKey: "essentials.title",
  mount(root, { signal }) {
    const render = () => {
      const done = heard();
      const n = ESSENTIALS.filter(w => done.has(w.file)).length;
      root.innerHTML = `
        ${pageHead(t("essentials.title"), t("essentials.sub"), "", "", "qalam")}
        <label class="es-find"><span class="visually-hidden">${esc(t("essentials.search"))}</span>
          <input type="search" class="es-search" placeholder="${esc(t("essentials.search"))}" autocomplete="off" spellcheck="false"></label>
        <p class="es-count">${esc(t("essentials.count", { n: num(n), all: num(ESSENTIALS.length) }))}</p>
        <div class="es-bar" aria-hidden="true"><span style="width:${(n / ESSENTIALS.length) * 100}%"></span></div>
        <details class="es-how">
          <summary>${esc(t("essentials.howTitle"))}</summary>
          <p>${esc(t("essentials.how"))}</p>
        </details>
        ${GROUPS.map(g => {
          const words = ESSENTIALS.filter(w => w.group === g.id);
          const got = words.filter(w => done.has(w.file)).length;
          return `<section class="es-group">
            <h2 class="es-h">
              <span class="es-h-ar" lang="ar" dir="rtl">${esc(g.title.najdi)}</span>
              <span class="es-h-en" dir="ltr">${esc(g.title.en)}</span>
              <span class="es-h-n">${esc(num(got))}/${esc(num(words.length))}</span>
            </h2>
            <p class="es-sub">${esc(tx(g.sub))}</p>
            <ul class="es-list">${words.map(w => word(w, done)).join("")}</ul>
          </section>`;
        }).join("")}`;
    };

    // Four hundred is a lot to scroll: type and the page narrows to what matches, in Arabic, in the
    // pronunciation or in English.
    const bare = s => s.replace(/[\u064B-\u0652\u0670\u0640]/g, "").replace(/[أإآ]/g, "ا");
    root.addEventListener("input", e => {
      if (!e.target.matches(".es-search")) return;
      const q = bare(e.target.value.trim().toLowerCase());
      for (const li of root.querySelectorAll(".es-list > li")) {
        const hit = !q || bare(li.textContent.toLowerCase()).includes(q);
        li.hidden = !hit;
      }
      for (const g of root.querySelectorAll(".es-group"))
        g.hidden = ![...g.querySelectorAll(".es-list > li")].some(li => !li.hidden);
    }, { signal });

    // Tapping a word plays it (main.js handles data-say) and counts it as heard.
    root.addEventListener("click", e => {
      const btn = e.target.closest("[data-heard]");
      if (!btn) return;
      const file = btn.dataset.heard;
      if (heard().has(file)) return;
      store.update(s => { s.essentials = { done: [...new Set([...(s.essentials?.done ?? []), file])] }; }, { silent: true });
      btn.classList.add("is-heard");
      const box = btn.closest(".es-group");
      const all = box.querySelectorAll(".es-word").length;
      box.querySelector(".es-h-n").textContent = `${num(box.querySelectorAll(".es-word.is-heard").length)}/${num(all)}`;
      const n = ESSENTIALS.filter(w => heard().has(w.file)).length;
      root.querySelector(".es-count").textContent = t("essentials.count", { n: num(n), all: num(ESSENTIALS.length) });
      root.querySelector(".es-bar span").style.width = `${(n / ESSENTIALS.length) * 100}%`;
    }, { signal });

    render();
  },
};
