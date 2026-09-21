import { todayKey, shortDate } from "../core/dates.js";
import { dayNumber, dateOfDay } from "../core/schedule.js";
import { esc, rich, ar, flag, flagNote, playIcon, pageHead } from "../core/dom.js";
import { PHRASES } from "../data/phrases.js";

export default {
  title: "Phrases",
  mount(root) {
    const n = dayNumber(todayKey());
    const days = [...new Set(PHRASES.map(p => p.day))];

    root.innerHTML = `
      ${pageHead("Phrases", "Three phrases a day for the two Script weeks, straight from your plan — with the “to her” forms. Click one to hear it, then say it out loud ten times.")}
      <p class="hint">The voice speaks standard Arabic. Trust the transliteration for Najdi sounds — ${ar("ق")} is g, and short vowels often drop out.</p>
      ${days.map(d => `
        <section class="pday${d === n ? " is-today" : ""}${d > n ? " is-later" : ""}">
          <h2>Day ${d} <span class="muted">· ${esc(shortDate(dateOfDay(d)))}</span>${d === n ? ` <span class="now-tag">Today</span>` : ""}</h2>
          <div class="phrase-list">
            ${PHRASES.filter(p => p.day === d).map(p => `
              <div class="phrase-row">
                <button class="phrase" data-say="${esc(p.speak ?? p.ar)}">
                  ${ar(p.ar, "phrase-ar")}
                  <span class="phrase-t"><b>${esc(p.tr)}</b> ${flag(p)}<span>${esc(p.en)}</span>
                    <span class="ua"><span>UA</span>${esc(p.ua)}</span>
                    ${p.note ? `<span class="pnote">${rich(p.note)}</span>` : ""}</span>
                  ${playIcon}
                </button>
                ${flagNote(p)}
              </div>`).join("")}
          </div>
        </section>`).join("")}`;
  },
};
