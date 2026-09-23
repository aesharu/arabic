import { t, tx } from "../core/i18n.js";
import { esc, rich, ar, translit, playIcon, pageHead } from "../core/dom.js";
import { VOWEL_SECTIONS } from "../data/vowels.js";

// Each row's English reads "ba — short a": the bit before the dash is the sound, so it gets both spellings.
const sound = r => {
  const said = String(r.text.en).split(" — ")[0].trim();
  return /^[a-zāīūēō'ʿʾ]+$/i.test(said) ? translit(said) : "";
};

export default {
  titleKey: "vowels.title",
  mount(root) {
    root.innerHTML = `
      ${pageHead(t("vowels.title"), t("vowels.sub"), "", "", "qalam")}
      <div class="vgrid">
        ${VOWEL_SECTIONS.map(s => `
          <section class="vsec">
            <h2>${esc(tx(s.title))}</h2>
            <p>${esc(tx(s.intro))}</p>
            ${s.rows.map(r => `
              <button class="vrow" data-say="${esc(r.ar)}">${ar(r.ar)}
                <span class="t"><b>${esc(tx(r.name))}</b>${sound(r)}<span>${rich(tx(r.text))}</span></span>${playIcon}</button>`).join("")}
          </section>`).join("")}
      </div>`;
  },
};
