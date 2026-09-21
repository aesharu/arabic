import { todayKey, shortDate } from "../core/dates.js";
import { dayNumber, dateOfDay } from "../core/schedule.js";
import { t, tx, locale } from "../core/i18n.js";
import { esc, rich, ar, translit, flag, flagNote, meanings, playIcon, pageHead } from "../core/dom.js";
import { PHRASES } from "../data/phrases.js";
import { HER_WORDS, RUDE } from "../data/hers.js";
import { speakText } from "../core/vocab.js";
import * as content from "../core/content.js";

content.register([...HER_WORDS, ...RUDE]); // ✎ in edit mode

// Her words and the rude ones: Najdi, pronunciation, meaning, formal Arabic, a note.
const word = w => (content.apply(w), `
  <button class="phrase lv-phrase" data-say="${esc(speakText(w.ar))}" data-edit-id="${w.id}">
    ${ar(w.ar, "phrase-ar")}
    <span class="phrase-t">${translit(w.say)} ${w.level ? `<span class="rude-tag${w.level === "very rude" ? " is-very" : ""}">${t(w.level === "very rude" ? "phrases.veryRude" : "phrases.rudeTag")}</span>` : ""}${w.level && !w.taught ? flag({ check: true }) : ""}
      <span class="gr-mean">${esc(tx({ en: w.en, uk: w.uk, najdi: w.en, msa: w.en }))}</span>
      <span class="gr-msa"><i>${t("lab.msa")}</i> ${ar(w.msa)}</span>
      ${w.note ? `<span class="pnote">${esc(tx(w.note))}</span>` : ""}</span>
    ${playIcon}
  </button>`);

export default {
  titleKey: "phrases.title",
  mount(root) {
    const n = dayNumber(todayKey());
    const days = [...new Set(PHRASES.map(p => p.day))];

    root.innerHTML = `
      ${pageHead(t("phrases.title"), t("phrases.sub"), "", "", "phrases")}
      <p class="hint">${t("phrases.hint", { q: ar("ق", "ar-in") })}</p>
      <section class="pday hers">
        <h2>${t("phrases.hers")}</h2>
        <p class="muted">${t("phrases.hersSub")}</p>
        <div class="vocab">${HER_WORDS.map(word).join("")}</div>
      </section>
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
        </section>`).join("")}
      <details class="panel rude">
        <summary><h2>${t("phrases.rude")}</h2></summary>
        <p class="muted">${t("phrases.rudeSub")}</p>
        <div class="vocab">${RUDE.map(word).join("")}</div>
      </details>`;
  },
};
