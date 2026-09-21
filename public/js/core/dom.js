export const esc = s =>
  String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// English text that may contain Arabic words: escapes it and gives each Arabic run the Arabic font.
const ARABIC_RUN = /[\u0600-\u06FF](?:[\u0600-\u06FF\u064B-\u0652 ،]*[\u0600-\u06FF])?/g;
export const rich = text => esc(text).replace(ARABIC_RUN, m => `<span class="ar ar-in" lang="ar">${m}</span>`);

// Arabic text always goes through here so it gets the Arabic font and right-to-left direction.
export const ar = (text, cls = "") => `<span class="ar${cls ? " " + cls : ""}" lang="ar">${esc(text)}</span>`;

// Visible "check with tutor" badge for content that still needs a native speaker's OK.
export const flag = item =>
  item.check
    ? `<span class="flag" title="${esc(item.checkNote || "Not yet verified as Najdi — ask a native speaker.")}">check with tutor</span>`
    : "";

export const flagNote = item => (item.check && item.checkNote ? `<p class="flag-note">${rich(item.checkNote)}</p>` : "");

export const playIcon = `<span class="play" aria-hidden="true">▶</span>`;

export const pageHead = (title, sub = "", eyebrow = "") => `
  <header class="page-head">
    ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ""}
    <h1>${title}</h1>
    ${sub ? `<p class="sub">${sub}</p>` : ""}
  </header>`;

export const shuffle = a => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Ignore keyboard shortcuts while the person is typing in a field.
export const typing = e => /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
