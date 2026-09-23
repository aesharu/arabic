// Interface language: English or Saudi Arabic. Texts live in i18n/strings.js; content data carries
// { en, najdi } values that tx() picks from. The Arabic interface runs right-to-left.
import * as store from "./store.js";
import * as content from "./content.js";
import { STRINGS } from "../i18n/strings.js";

export const LANGS = ["en", "najdi"];
const META = {
  en: { html: "en", dir: "ltr", locale: "en-US", plural: "en" },
  najdi: { html: "ar-SA", dir: "rtl", locale: "ar-SA-u-ca-gregory-nu-latn", plural: "ar" },
};

export const lang = () => (LANGS.includes(store.get().prefs.lang) ? store.get().prefs.lang : "en");
export const meta = () => META[lang()];
export const isArabic = () => meta().dir === "rtl";
export const locale = () => meta().locale;
export const setLang = l => store.update(s => { s.prefs.lang = l; });

const fill = (s, vars) => (vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m)) : s);

// Edit mode (core/editmode.js): while it's on, every text shown remembers where it came from, so tapping it
// can open the right thing to change. Changed texts come from core/content.js ("s.<key>" / "x.<hash>").
let editing = false;
const seen = new Map();
const norm = s => String(s).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
export function setEditing(on) {
  editing = on;
  seen.clear();
}
export const isEditing = () => editing;
export const sourceOf = text => seen.get(norm(text));
function remember(out, target, source) {
  if (editing) {
    const k = norm(out);
    if (k && !seen.has(k)) seen.set(k, { target, source });
  }
  return out;
}

// t("today.focus") · t("day.n", { n: 3 })
export function t(key, vars) {
  const entry = STRINGS[key];
  if (!entry) {
    console.warn(`Missing string: ${key}`);
    return key;
  }
  const raw = content.textOf(`s.${key}`, lang()) ?? entry[lang()] ?? entry.en;
  return remember(fill(raw, vars), `s.${key}`, entry);
}

// Content texts are known by a hash of their English, so a change follows the text wherever it appears.
const ids = new WeakMap();
function idOf(v) {
  let id = ids.get(v);
  if (!id) {
    let h = 0x811c9dc5;
    for (const ch of String(v.en ?? JSON.stringify(v))) h = Math.imul(h ^ ch.codePointAt(0), 0x01000193) >>> 0;
    id = `x.${h.toString(36)}`;
    ids.set(v, id);
  }
  return id;
}

// The unit word for a count: tu("unit.days", 3) → "days" / "أيام"
export function tu(key, n, opts) {
  const forms = STRINGS[key][lang()];
  return forms[new Intl.PluralRules(meta().plural, opts).select(n)] ?? forms.other;
}

// A count inside a sentence: in Arabic the number with its word, the way it's said — one and two by the word alone
// (ساعة، ساعتين), the number only from three up (3 ساعات، 11 ساعة); in English just the number, since its
// texts carry a short unit ("in {h} h").
export function cnt(key, n) {
  if (meta().plural !== "ar") return num(n);
  const w = tu(key, n);
  return n === 1 || n === 2 ? w : `${num(n)} ${w}`;
}

// A count with its word, the way each language says it: "7 words", "٧ كلمات" — and يومين, not "٢ يومين".
export const said = (key, n) => (isArabic() ? cnt(key, n) : `${num(n)} ${tu(key, n)}`);

// A number the way the current language writes it (1.5 / 1,5)
export const num = (n, digits = 0) =>
  n.toLocaleString(locale(), { minimumFractionDigits: digits, maximumFractionDigits: digits });

// A content value — { en, najdi } — in the current language. Plain strings pass through.
export function tx(v) {
  if (!v || typeof v !== "object") return v ?? "";
  const id = idOf(v);
  return remember(content.textOf(id, lang()) ?? v[lang()] ?? v.en ?? "", id, v);
}
