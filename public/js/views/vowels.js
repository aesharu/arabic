import { esc, rich, ar, playIcon, pageHead } from "../core/dom.js";
import { VOWEL_SECTIONS } from "../data/vowels.js";

export default {
  title: "Vowels",
  mount(root) {
    root.innerHTML = `
      ${pageHead("Vowels", "Short vowel marks, long vowels, and the four extras you'll see everywhere. Click a row to hear it.")}
      <div class="vgrid">
        ${VOWEL_SECTIONS.map(s => `
          <section class="vsec">
            <h2>${esc(s.title)}</h2>
            <p>${esc(s.intro)}</p>
            ${s.rows.map(([a, name, text]) => `
              <button class="vrow" data-say="${esc(a)}">${ar(a)}
                <span class="t"><b>${esc(name)}</b><span>${rich(text)}</span></span>${playIcon}</button>`).join("")}
          </section>`).join("")}
      </div>`;
  },
};
