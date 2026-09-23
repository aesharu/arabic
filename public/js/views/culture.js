// The culture card at the bottom of a page (data/culture.js): a true story about her world with a picture and one
// word to hear. It lives beside the page (#culture), not in it, so it stays put while the page redraws itself.
// Today shows a different card every day; other pages show theirs, and "Another story" turns to the next.
import { t, tx } from "../core/i18n.js";
import { esc, ar, lat, translit, flag, rich, playIcon } from "../core/dom.js";
import { icon } from "../core/art.js";
import { sceneSvg } from "../core/scenes.js";
import { diffDays, todayKey } from "../core/dates.js";
import { START } from "../config.js";
import { CULTURE } from "../data/culture.js";

const turn = new Map(); // route → how many times "Another story" was pressed (until reload)

function card(c, many) {
  const [word, say, en] = c.word;
  return `<section class="culture" aria-labelledby="cu-title">
    <div class="sadu" aria-hidden="true"></div>
    <div class="culture-body">
      <div class="culture-pic" aria-hidden="true">${sceneSvg(c.pic, { square: true })}</div>
      <div class="culture-text">
        <p class="culture-kind">${icon("star")} ${t(c.kind === "north" ? "cu.north" : "cu.saudi")}</p>
        <h2 id="cu-title">${esc(tx(c.title))}</h2>
        <p>${rich(tx(c.text))}</p>
        <div class="culture-foot">
          <button type="button" class="culture-word" data-say="${esc(word.replace(/[؟?]/g, ""))}">${ar(word)}<span>${translit(say)}</span><small>${lat(en)}</small>${playIcon}</button>
          ${flag({ check: true })}
          ${many ? `<button type="button" class="btn btn-ghost culture-next" data-culture-next>${icon("redo")} ${t("cu.next")}</button>` : ""}
        </div>
      </div>
    </div>
  </section>`;
}

export function renderCulture(slot, route) {
  const list = route === "today" ? CULTURE : CULTURE.filter(c => c.pages.includes(route));
  if (!list.length || route === "print") {
    slot.innerHTML = "";
    slot.hidden = true;
    return;
  }
  const start = Math.max(0, diffDays(START, todayKey())); // a different card each day
  const c = list[(start + (turn.get(route) ?? 0)) % list.length];
  slot.hidden = false;
  slot.innerHTML = card(c, list.length > 1);
}

export function startCulture(slot, current) {
  slot.addEventListener("click", e => {
    if (!e.target.closest("[data-culture-next]")) return;
    const route = current().name;
    turn.set(route, (turn.get(route) ?? 0) + 1);
    renderCulture(slot, route);
    slot.querySelector(".culture")?.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 260, easing: "cubic-bezier(.2,.7,.2,1)" });
  });
}
