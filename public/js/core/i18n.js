// Interface language: English, Ukrainian, Najdi Arabic or formal Arabic (MSA). Texts live in i18n/strings.js;
// content data carries { en, uk, najdi, msa } values that tx() picks from. Arabic interfaces run right-to-left.
import * as store from "./store.js";
import { STRINGS } from "../i18n/strings.js";

export const LANGS = ["en", "uk", "najdi", "msa"];
const META = {
  en: { html: "en", dir: "ltr", locale: "en-GB", plural: "en" },
  uk: { html: "uk", dir: "ltr", locale: "uk-UA", plural: "uk" },
  najdi: { html: "ar-SA", dir: "rtl", locale: "ar-SA-u-ca-gregory-nu-latn", plural: "ar" },
  msa: { html: "ar", dir: "rtl", locale: "ar-u-ca-gregory-nu-latn", plural: "ar" },
};

export const lang = () => (LANGS.includes(store.get().prefs.lang) ? store.get().prefs.lang : "en");
export const meta = () => META[lang()];
export const isArabic = () => meta().dir === "rtl";
export const locale = () => meta().locale;
export const setLang = l => store.update(s => { s.prefs.lang = l; });

const fill = (s, vars) => (vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m)) : s);

// t("today.focus") · t("day.n", { n: 3 })
export function t(key, vars) {
  const entry = STRINGS[key];
  if (!entry) {
    console.warn(`Missing string: ${key}`);
    return key;
  }
  return fill(entry[lang()] ?? entry.en, vars);
}

// The unit word for a count: tu("unit.days", 3) → "days" / "дні" / "أيام"
export function tu(key, n, opts) {
  const forms = STRINGS[key][lang()];
  return forms[new Intl.PluralRules(meta().plural, opts).select(n)] ?? forms.other;
}

// A number the way the current language writes it (1.5 / 1,5)
export const num = (n, digits = 0) =>
  n.toLocaleString(locale(), { minimumFractionDigits: digits, maximumFractionDigits: digits });

// A content value — { en, uk, najdi, msa } — in the current language. Plain strings pass through.
export const tx = v => (v && typeof v === "object" ? v[lang()] ?? v.en : v ?? "");
