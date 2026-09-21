import { t, tx, lang, isArabic } from "./i18n.js";

export const esc = s =>
  String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Interface text that may contain Arabic words: escapes it and, in English/Ukrainian, gives each Arabic run the
// Arabic font. In the Arabic interfaces the whole text is already Arabic, so it stays as is.
const ARABIC_RUN = /[؀-ۿ](?:[؀-ۿً-ْ ،]*[؀-ۿ])?/g;
export const rich = text => (isArabic() ? esc(text) : esc(text).replace(ARABIC_RUN, m => `<span class="ar ar-in" lang="ar">${m}</span>`));

// Arabic learning content always goes through here: Naskh font, right-to-left.
export const ar = (text, cls = "") => `<span class="ar${cls ? " " + cls : ""}" lang="ar">${esc(text)}</span>`;

// Latin text (transliteration, English, Ukrainian) kept left-to-right inside an Arabic interface.
export const lat = (text, cls = "", l = "") => `<bdi class="lat${cls ? " " + cls : ""}" dir="ltr"${l ? ` lang="${l}"` : ""}>${esc(text)}</bdi>`;
export const translit = text => lat(text, "tr");

// Visible "check with tutor" badge for content that still needs a native speaker's OK.
export const flag = item =>
  item.check ? `<span class="flag" title="${esc(tx(item.checkNote) || t("flag.default"))}">${t("flag.label")}</span>` : "";

export const flagNote = item => (item.check && item.checkNote ? `<p class="flag-note">${rich(tx(item.checkNote))}</p>` : "");

// "UA", not "UK", so English readers don't read it as United Kingdom.
const SHORT = { en: "EN", uk: "UA" };
const meaningLine = (item, l, cls) => `<span class="${cls}" lang="${l}" dir="ltr"><i>${SHORT[l]}</i> ${esc(item[l])}</span>`;

// The languages of a word or phrase after its Najdi Arabic: English and Ukrainian meanings (the interface
// language first) and the formal-Arabic (MSA) equivalent.
export function meanings(item) {
  const l = lang();
  const lines = l === "en" || l === "uk"
    ? `<span class="m1" lang="${l}">${esc(item[l])}</span>${meaningLine(item, l === "en" ? "uk" : "en", "m2")}`
    : `${meaningLine(item, "en", "m1")}${meaningLine(item, "uk", "m2")}`;
  return `${lines}<span class="msa"><i title="${esc(t("lab.msaHint"))}">${t("lab.msa")}</i> ${ar(item.msa)}</span>`;
}

export const playIcon = `<span class="play" aria-hidden="true">▶</span>`;

export const pageHead = (title, sub = "", eyebrow = "", cls = "") => `
  <header class="page-head${cls ? " " + cls : ""}">
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
