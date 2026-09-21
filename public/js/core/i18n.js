// Interface language: English or Ukrainian. Texts live in i18n/strings.js; content data carries
// { en, uk } values that tx() picks from.
import * as store from "./store.js";
import { STRINGS } from "../i18n/strings.js";

export const LANGS = ["en", "uk"];
export const lang = () => (LANGS.includes(store.get().prefs.lang) ? store.get().prefs.lang : "en");
export const other = () => (lang() === "en" ? "uk" : "en");
export const locale = () => (lang() === "uk" ? "uk-UA" : "en-GB");
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

// The unit word for a count: tu("unit.days", 3) → "days" / "дні"
export function tu(key, n, opts) {
  const forms = STRINGS[key][lang()];
  return forms[new Intl.PluralRules(locale(), opts).select(n)] ?? forms.other;
}

// A number the way the current language writes it (1.5 / 1,5)
export const num = (n, digits = 0) =>
  n.toLocaleString(locale(), { minimumFractionDigits: digits, maximumFractionDigits: digits });

// A bilingual content value — { en, uk } — in the current language. Plain strings pass through.
export const tx = v => (v && typeof v === "object" ? v[lang()] ?? v.en : v ?? "");
