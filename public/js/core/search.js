// Forgiving search for the Word list: type Arabic with or without vowel marks (any alif, ى or ي, ة or ه), the
// pronunciation without its special letters (h finds ḥ, s finds ṣ, a finds ā and ʿa), English or Ukrainian.
const ARABIC_MARKS = /[ً-ٰٟـ]/g;
const ARABIC_FOLD = { "أ": "ا", "إ": "ا", "آ": "ا", "ٱ": "ا", "ى": "ي", "ئ": "ي", "ؤ": "و", "ة": "ه" };

export function fold(text) {
  return String(text ?? "")
    .toLowerCase()
    .replace(ARABIC_MARKS, "")
    .replace(/[أإآٱىئؤة]/g, c => ARABIC_FOLD[c])
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // ā → a, ḥ → h, ṣ → s …
    .replace(/[ʿʾ'’`ʼ]/g, "")
    .replace(/ґ/g, "г")
    .replace(/[؟?!.,،…“”"«»()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// One searchable string per word, built once.
export const haystack = n => fold([n.ar, n.say, n.en, n.uk, n.msa, n.toHer?.ar, n.toHer?.say].filter(Boolean).join(" "));

// Every word of the query must appear somewhere.
export function matches(hay, query) {
  const words = fold(query).split(" ").filter(Boolean);
  return words.length > 0 && words.every(w => hay.includes(w));
}
