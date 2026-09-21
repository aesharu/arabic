import { t, tx, lang, other } from "./i18n.js";

export const esc = s =>
  String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// English or Ukrainian text that may contain Arabic words: escapes it and gives each Arabic run the Arabic font.
const ARABIC_RUN = /[؀-ۿ](?:[؀-ۿً-ْ ،]*[؀-ۿ])?/g;
export const rich = text => esc(text).replace(ARABIC_RUN, m => `<span class="ar ar-in" lang="ar">${m}</span>`);

// Arabic text always goes through here so it gets the Arabic font and right-to-left direction.
export const ar = (text, cls = "") => `<span class="ar${cls ? " " + cls : ""}" lang="ar">${esc(text)}</span>`;

// Visible "check with tutor" badge for content that still needs a native speaker's OK.
export const flag = item =>
  item.check ? `<span class="flag" title="${esc(tx(item.checkNote) || t("flag.default"))}">${t("flag.label")}</span>` : "";

export const flagNote = item => (item.check && item.checkNote ? `<p class="flag-note">${rich(tx(item.checkNote))}</p>` : "");

// "UA", not "UK", so English readers don't read it as United Kingdom.
const SHORT = { en: "EN", uk: "UA" };

// The four languages of a word or phrase, after its Najdi Arabic: meaning in the interface language,
// meaning in the other one, and the formal-Arabic (MSA) equivalent.
export const meanings = item => `
  <span class="m1" lang="${lang()}">${esc(item[lang()])}</span>
  <span class="m2" lang="${other()}"><i>${SHORT[other()]}</i> ${esc(item[other()])}</span>
  <span class="msa"><i title="${esc(t("lab.msaHint"))}">${t("lab.msa")}</i> ${ar(item.msa)}</span>`;

export const playIcon = `<span class="play" aria-hidden="true">▶</span>`;

export const pageHead = (title, sub = "", eyebrow = "") => `
  <header class="page-head">
    ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ""}
    <h1>${title}</h1>
    ${sub ? `<p class="sub">${sub}</p>` : ""}
  </header>`;

export const reviewNote = () => `<p class="review-note">${esc(t("review.note"))}</p>`;

export const shuffle = a => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Ignore keyboard shortcuts while the person is typing in a field.
export const typing = e => /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
