// The pronunciation written a second time, in Ukrainian letters.
//
// Why: Ukrainian carries sounds that English spelling can only hint at — х is exactly خ, ґ is exactly the Saudi ق
// (as in «ґанок», never the Ukrainian г), і and у are clean single vowels, and nothing is silent. Volodymyr reads
// the Ukrainian line aloud, on his own or when Dima asks him to say something back, so every Arabic consonant
// gets a letter of its own: no two Arabic sounds may share one, or he would learn to say them the same.
//
// The whole scheme, and the only four things to remember:
//   ґ            ق   a hard g — the sound that makes Saudi sound Saudi
//   ҳ ғ ҫ ҙ      ح غ ث ذ   a letter with a tail or a bar is the Arabic one, not the Ukrainian it grew from
//   ʹ            ص ط ظ/ض   a tick after с т ҙ = say it heavy and dark: сʹ тʹ ҙʹ
//   ъ  ʼ         ع ء   the squeeze in the throat, and a clean catch
//
//   خ х  ·  ح ҳ        ه г  ·  غ ғ        ق ґ  ·  ك к
//   س с  ·  ث ҫ  ·  ص сʹ   ز з  ·  ذ ҙ  ·  ظ ҙʹ (and ض, which sounds the same in Saudi)   ت т  ·  ط тʹ
//
// It is worked out from the Latin pronunciation the plan already gives, so every word has one and they are all
// consistent. Any single word can be corrected by hand (the ✎ form has a "Ukrainian sound" box) and the
// correction wins — see core/content.js.
//
// Every letter here is one codepoint the site's own font actually carries; combining accents (х̣, а̄) are not,
// they fall back to another font and break the line, so the scheme never uses one.

const HEAVY = "ʹ"; // U+02B9 — "dark, tongue pulled back". Only ever after с, т or ҙ.

// Longest first — "kh" must be read before "k", "ā" before "a".
const PAIRS = [
  // two letters
  ["th", "ҫ"], ["kh", "х"], ["dh", "ҙ"], ["sh", "ш"], ["gh", "ғ"],
  // y + vowel reads as one Ukrainian letter
  ["yā", "я"], ["ya", "я"], ["yū", "ю"], ["yu", "ю"], ["yē", "є"], ["yō", "йо"], ["yo", "йо"], ["yī", "йі"], ["yi", "йі"],
  // long vowels: Ukrainian doesn't mark length, and the Latin line above already does
  ["ā", "а"], ["ī", "і"], ["ū", "у"], ["ē", "е"], ["ō", "о"],
  // the throat: each its own letter
  ["ḥ", "ҳ"], ["ġ", "ғ"], ["ḵ", "х"],
  // heavy and interdental
  ["ṣ", "с" + HEAVY], ["ṭ", "т" + HEAVY], ["ẓ", "ҙ" + HEAVY], ["ḍ", "ҙ" + HEAVY], ["ṯ", "ҫ"], ["ḏ", "ҙ"], ["ž", "ж"],
  // ع is a squeeze in the throat; ء is a clean catch, the way Ukrainian uses its own apostrophe
  ["ʿ", "ъ"], ["ʾ", "ʼ"], ["'", "ʼ"], ["’", "ʼ"], ["ʼ", "ʼ"],
  // one letter
  ["a", "а"], ["b", "б"], ["d", "д"], ["e", "е"], ["f", "ф"], ["g", "ґ"], ["h", "г"], ["i", "і"], ["j", "дж"],
  ["k", "к"], ["l", "л"], ["m", "м"], ["n", "н"], ["o", "о"], ["p", "п"], ["q", "ґ"], ["r", "р"], ["s", "с"],
  ["t", "т"], ["u", "у"], ["v", "в"], ["w", "в"], ["y", "й"], ["z", "з"],
];

const VOWELS = "аеиіоуюяєї";
const capital = s => s.charAt(0).toUpperCase() + s.slice(1);

// Arabic ل is lighter than a Ukrainian л: before a consonant or at the end of a word it reads as ль
// (аль-бет, ґальбі), which is much closer than a hard л.
function softenL(out) {
  return out.replace(/л(?![аеиіоуюяєї])/g, (m, i, s) => {
    const next = s[i + 1] ?? "";
    return next === "ь" || next === "л" ? m : "ль";
  });
}

/**
 * "as-salāmu ʿalēkum" → "ас-саламу ъалекум"
 * Anything that isn't part of the scheme (spaces, hyphens, ?, !, …, digits) is kept as it is.
 */
export function uaSay(say) {
  if (!say) return "";
  let out = "";
  const src = String(say);
  for (let i = 0; i < src.length; ) {
    const rest = src.slice(i);
    const lower = rest.toLowerCase();
    const hit = PAIRS.find(([from]) => lower.startsWith(from));
    if (!hit) {
      out += src[i];
      i++;
      continue;
    }
    const [from, to] = hit;
    // A capital in the source (a name: Dīma, Folodka) stays a capital.
    out += src[i] === src[i].toUpperCase() && src[i] !== src[i].toLowerCase() ? capital(to) : to;
    i += from.length;
  }
  return softenL(out);
}

// True when a pronunciation is worth showing a Ukrainian line for (there is something to read).
// ʿ and ʾ count: ع on its own is a sound — the squeeze in the throat.
export const hasSay = say => /[a-zāīūēōḥṣṭẓḍḏṯġʿʾ]/i.test(String(say ?? ""));

// The letters that are not simply the Ukrainian ones, for the key on the alphabet page.
export const UA_KEY = [
  { ua: "ґ", ar: "ق" }, { ua: "х", ar: "خ" }, { ua: "ҳ", ar: "ح" }, { ua: "г", ar: "ه" }, { ua: "ғ", ar: "غ" },
  { ua: "с", ar: "س" }, { ua: "ҫ", ar: "ث" }, { ua: "сʹ", ar: "ص" },
  { ua: "з", ar: "ز" }, { ua: "ҙ", ar: "ذ" }, { ua: "ҙʹ", ar: "ظ ض" },
  { ua: "т", ar: "ت" }, { ua: "тʹ", ar: "ط" }, { ua: "ъ", ar: "ع" }, { ua: "ʼ", ar: "ء" },
];
