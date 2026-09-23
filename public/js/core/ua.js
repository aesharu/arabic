// The pronunciation written a second time, in Ukrainian letters.
//
// Why: Ukrainian carries several of these sounds that English spelling can only hint at — х is exactly خ,
// ґ is exactly the Saudi ق (as in «ґанок», never the Ukrainian г), і and у are clean single vowels, and
// nothing is silent. Volodymyr reads the Ukrainian line when Dima asks him to say something back.
//
// It is worked out from the Latin pronunciation the plan already gives, so every word has one and they are
// all consistent. Any single word can be corrected by hand (the ✎ form has a "Ukrainian sound" box) and the
// correction wins — see core/content.js.
//
// What Ukrainian cannot keep apart, the Latin line above it still shows:
//   ح and خ both → х   (خ is exactly Ukrainian х; ح is deeper in the throat)
//   ه and غ both → г   (a soft breath / a voiced throaty g)
//   ث س ص  all → с  ·  ذ ز ظ ض all → з  ·  ت ط both → т
// ق is the one sound worth its own letter: ґ, because "g" is what makes Saudi sound Saudi.

// Longest first — "kh" must be read before "k", "ā" before "a".
const PAIRS = [
  // two letters
  ["th", "с"], ["kh", "х"], ["dh", "з"], ["sh", "ш"], ["gh", "г"],
  // y + vowel reads as one Ukrainian letter
  ["yā", "я"], ["ya", "я"], ["yū", "ю"], ["yu", "ю"], ["yē", "є"], ["yō", "йо"], ["yo", "йо"], ["yī", "йі"], ["yi", "йі"],
  // long vowels: Ukrainian doesn't mark length, and the Latin line above already does
  ["ā", "а"], ["ī", "і"], ["ū", "у"], ["ē", "е"], ["ō", "о"],
  // the emphatic and throat consonants
  ["ḥ", "х"], ["ṣ", "с"], ["ṭ", "т"], ["ẓ", "з"], ["ḍ", "д"], ["ḏ", "з"], ["ṯ", "с"], ["ġ", "г"], ["ž", "ж"],
  // ع and ء — Ukrainian writes its own apostrophe, so it reads as the catch it is
  ["ʿ", "ʼ"], ["ʾ", "ʼ"], ["'", "ʼ"], ["’", "ʼ"], ["ʼ", "ʼ"],
  // one letter
  ["a", "а"], ["b", "б"], ["d", "д"], ["e", "е"], ["f", "ф"], ["g", "ґ"], ["h", "г"], ["i", "і"], ["j", "дж"],
  ["k", "к"], ["l", "л"], ["m", "м"], ["n", "н"], ["o", "о"], ["p", "п"], ["r", "р"], ["s", "с"], ["t", "т"],
  ["u", "у"], ["v", "в"], ["w", "в"], ["y", "й"], ["z", "з"],
];

const VOWELS = "аеиіоуюяєї";
const isVowel = ch => VOWELS.includes(ch);
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
 * "as-salāmu ʿalēkum" → "ас-саламу ʼалекум"
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
// ʿ and ʾ count: ع on its own is a sound — the catch in the throat that Ukrainian writes with an apostrophe.
export const hasSay = say => /[a-zāīūēōḥṣṭẓḍḏṯġʿʾ]/i.test(String(say ?? ""));
