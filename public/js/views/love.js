// "To her ♥": what to say to her — love, missing her, compliments, flirting, making up, the future, her family —
// in her dialect. Tap to hear (her voice once she's recorded it).
//   #/love
import { t, tx } from "../core/i18n.js";
import { esc, ar, translit, flag, playIcon, pageHead } from "../core/dom.js";
import { icon } from "../core/art.js";
import { speakText } from "../core/vocab.js";
import * as content from "../core/content.js";
import { LOVE, LOVE_ITEMS, LOVE_INTRO } from "../data/love.js";

content.register(LOVE_ITEMS); // ✎ in edit mode

let hidden = false; // "hide the meanings" stays while moving around

const phrase = x => (content.apply(x), `
  <button class="phrase lv-phrase" data-say="${esc(speakText(x.ar))}" data-edit-id="${x.id}">
    ${ar(x.ar, "phrase-ar")}
    <span class="phrase-t">${translit(x.say)} ${x.check ? flag({ check: true }) : ""}
      <span class="gr-mean">${esc(x.en)}</span>
      ${x.note ? `<span class="pnote">${esc(tx(x.note))}</span>` : ""}</span>
    ${playIcon}
  </button>`);

export default {
  titleKey: "love.title",
  mount(root, { params, signal }) {
    const render = () => {
      root.innerHTML = `${pageHead(t("love.title"), esc(t("love.sub")), "", "", "roses")}
        <section class="panel lv-intro"><p>${icon("heart")} ${esc(tx(LOVE_INTRO))}</p>
          <div class="btn-row">
            <a class="btn btn-primary" href="#/cards/study/love">${icon("cards")} ${t("love.study")}</a>
            <button type="button" class="btn" data-hide aria-pressed="${hidden}">${t("love.hide")}</button>
          </div></section>
        <div class="city-chips lv-jump" role="group" aria-label="${esc(t("love.sections"))}">${LOVE.map(s =>
          `<button type="button" data-jump="${s.id}">${esc(tx(s.title))} <small>${s.items.length}</small></button>`).join("")}</div>
        <div class="lv-sections${hidden ? " is-hidden" : ""}">${LOVE.map(s => `
          <section class="lv-section" id="lv-${s.id}">
            <h2>${esc(tx(s.title))}</h2>
            <div class="vocab">${s.items.map(phrase).join("")}</div>
          </section>`).join("")}</div>`;
    };
    render();
    if (params[0]) root.querySelector(`#lv-${CSS.escape(params[0])}`)?.scrollIntoView({ block: "start" }); // #/love/<section>, from Your path
    root.addEventListener("click", e => {
      const j = e.target.closest("[data-jump]");
      if (j) return root.querySelector(`#lv-${j.dataset.jump}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      if (e.target.closest("[data-hide]")) {
        hidden = !hidden;
        render();
      }
    }, { signal });
  },
};
