import { t, tx } from "../core/i18n.js";
import { esc, rich, ar, playIcon, pageHead } from "../core/dom.js";
import { VOWEL_SECTIONS } from "../data/vowels.js";

export default {
  titleKey: "vowels.title",
  mount(root) {
    root.innerHTML = `
      ${pageHead(t("vowels.title"), t("vowels.sub"))}
      <div class="vgrid">
        ${VOWEL_SECTIONS.map(s => `
          <section class="vsec">
            <h2>${esc(tx(s.title))}</h2>
            <p>${esc(tx(s.intro))}</p>
            ${s.rows.map(r => `
              <button class="vrow" data-say="${esc(r.ar)}">${ar(r.ar)}
                <span class="t"><b>${esc(tx(r.name))}</b><span>${rich(tx(r.text))}</span></span>${playIcon}</button>`).join("")}
          </section>`).join("")}
      </div>`;
  },
};
