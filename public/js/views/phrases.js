import { todayKey, shortDate } from "../core/dates.js";
import { dayNumber, dateOfDay } from "../core/schedule.js";
import { t, tx, locale } from "../core/i18n.js";
import { esc, rich, ar, translit, flag, flagNote, meanings, playIcon, pageHead } from "../core/dom.js";
import { PHRASES } from "../data/phrases.js";

export default {
  titleKey: "phrases.title",
  mount(root) {
    const n = dayNumber(todayKey());
    const days = [...new Set(PHRASES.map(p => p.day))];

    root.innerHTML = `
      ${pageHead(t("phrases.title"), t("phrases.sub"), "", "", "phrases")}
      <p class="hint">${t("phrases.hint", { q: ar("ق", "ar-in") })}</p>
      ${days.map(d => `
        <section class="pday${d === n ? " is-today" : ""}${d > n ? " is-later" : ""}">
          <h2>${t("day.n", { n: d })} <span class="muted">· ${esc(shortDate(dateOfDay(d), locale()))}</span>${d === n ? ` <span class="now-tag">${t("phrases.today")}</span>` : ""}</h2>
          <div class="phrase-list">
            ${PHRASES.filter(p => p.day === d).map(p => `
              <div class="phrase-row">
                <button class="phrase" data-say="${esc(p.speak ?? p.ar)}">
                  ${ar(p.ar, "phrase-ar")}
                  <span class="phrase-t">${translit(p.tr)} ${flag(p)}${meanings(p)}
                    ${p.note ? `<span class="pnote">${rich(tx(p.note))}</span>` : ""}</span>
                  ${playIcon}
                </button>
                ${flagNote(p)}
              </div>`).join("")}
          </div>
        </section>`).join("")}`;
  },
};
