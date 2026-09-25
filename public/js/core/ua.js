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

// The key at the front of the book, the way a dictionary prints one: every letter of this line that is not
// simply the Ukrainian one, what it is in Arabic, and how to say it — in English and in his own language,
// because a pronunciation key is the one thing that has to be read in the language you think in.
//   ua  the Cyrillic letter · ar  the Arabic it stands for · en / uk  how to say it · ex  a word he knows
export const UA_KEY = [
  { ua: "ґ", ar: "ق", ex: "ґагва — قهوة",
    en: "A hard g made far back, deeper than any Ukrainian sound. Never the Ukrainian г. This one letter is most of what makes Saudi sound Saudi.",
    uk: "Твердий ґ, як у «ґанок», але глибше в горлі. Ніколи не «г». Саме цей звук найбільше робить саудівську саудівською." },
  { ua: "х", ar: "خ", ex: "хер — خير",
    en: "The ch of Scottish “loch” — a scrape at the back of the mouth.", uk: "Як «х» у «хата» — шкрябання в задній частині рота." },
  { ua: "ҳ", ar: "ح", ex: "ҳабібті — حبيبتي",
    en: "An h pushed out of the throat itself: breath, not scrape. Say “h” and squeeze the throat while you do it.",
    uk: "«Х», яке йде з самого горла: видих, а не шкрябання. Скажи «х» і водночас стисни горло." },
  { ua: "г", ar: "ه", ex: "гала — هلا",
    en: "The ordinary h of “hello” — a soft breath.", uk: "Звичайне українське «г» — м'який видих." },
  { ua: "ғ", ar: "غ", ex: "ғанам — غنم",
    en: "A gargled r — the French r, or г with the throat rattling.", uk: "«Г» з гарчанням, як французьке «r»." },
  { ua: "с", ar: "س", ex: "салам — سلام", en: "Plain s.", uk: "Звичайне «с»." },
  { ua: "ҫ", ar: "ث", ex: "ҫалаҫа — ثلاثة",
    en: "The th of “think”: the tip of the tongue between the teeth. Never a plain s — that is Egyptian.",
    uk: "Англійське «th» у think: кінчик язика між зубами. Не «с» — так кажуть єгиптяни." },
  { ua: "сʹ", ar: "ص", ex: "сʹабаҳ — صباح",
    en: "A heavy s: the tongue pulls back and the whole sound goes dark. The tick ʹ always means heavy.",
    uk: "Важке «с»: язик відтягується назад, звук стає глухим і «темним». Риска ʹ завжди означає важкий звук." },
  { ua: "з", ar: "ز", ex: "зен — زين", en: "Plain z.", uk: "Звичайне «з»." },
  { ua: "ҙ", ar: "ذ", ex: "ҙіб — ذيب",
    en: "The th of “this” — the voiced one.", uk: "Англійське «th» у this — дзвінке, з голосом." },
  { ua: "ҙʹ", ar: "ظ ض", ex: "рамаҙʹан — رمضان",
    en: "A heavy ҙ. In Saudi ظ and ض are one and the same sound, whatever the spelling says.",
    uk: "Важке «ҙ». У саудівській ظ і ض — це один і той самий звук, хоч пишуться по-різному." },
  { ua: "т", ar: "ت", ex: "тамр — تمر", en: "A light, clean t.", uk: "Легке, чисте «т»." },
  { ua: "тʹ", ar: "ط", ex: "тʹаййіб — طيب",
    en: "A heavy t: tongue back, the vowel after it goes dark too.", uk: "Важке «т»: язик назад, і голосна після нього теж «темніє»." },
  { ua: "ъ", ar: "ع", ex: "ъалекум — عليكم",
    en: "The throat squeezes shut and lets go. It is a sound, not a pause — and there is nothing like it in English.",
    uk: "Горло стискається і відпускається. Це звук, а не пауза — в українській такого немає." },
  { ua: "ʼ", ar: "ء", ex: "масаʼ — مساء",
    en: "A clean catch in the voice, the break in “uh-oh”.", uk: "Чиста зупинка голосу — як апостроф у «п'ять»." },
  { ua: "дж", ar: "ج", ex: "джамаль — جمل", en: "The j of “jam”.", uk: "Як «дж» у «джем»." },
  { ua: "ш", ar: "ش", ex: "шмағ — شماغ", en: "Plain sh.", uk: "Звичайне «ш»." },
  { ua: "в", ar: "و", ex: "вен — وين",
    en: "The w of “water” — the в of «вовк», never a hard v.", uk: "Як «в» у «вовк» (англійське w), ніколи не тверде «в»." },
  { ua: "ль", ar: "ل", ex: "аль-бет — البيت",
    en: "Before a consonant and at the end of a word the Arabic l is lighter than ours, so it is written ль.",
    uk: "Перед приголосним і в кінці слова арабська «л» легша за нашу, тому пишемо «ль»." },
  { ua: "я є ю йо", ar: "يـ", ex: "я ґальбі — يا قلبي",
    en: "ي and a vowel run together into one letter, exactly as Ukrainian already writes them.",
    uk: "ي разом із голосною зливається в одну літеру — так само, як в українській." },
];

// Vowel length is the one thing this line cannot carry: Ukrainian has no long vowels. The Latin line above
// each word shows it with ā ī ū ē ō — hold those, and the word is right.
export const UA_LENGTH = {
  en: "Ukrainian has no long vowels, so this line can't show them. The Latin line above does: ā ī ū ē ō. Hold those two beats and the word comes out right.",
  uk: "В українській немає довгих голосних, тому цей рядок їх не показує. Показує латинський рядок угорі: ā ī ū ē ō. Тягни їх удвічі довше — і слово звучатиме правильно.",
};
