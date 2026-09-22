// Every form of a verb from its "I" forms, with the plan's patterns (NAJDI-PLAN.md Part 5.4–5.5):
//   present  a- / ti- / ti-…-īn / yi- / ti- / ni- / ti-…-ūn / yi-…-ūn        أروح تروح تروحين يروح تروح نروح تروحون يروحون
//   past     -t / -t / -ti / (he) / -at / -na / -tu / -aw                       رحت رحت رحتي راح راحت رحنا رحتو راحوا
//   future   بـ + the present                                                    بروح بتروح بتروحين بيروح …
// No DOM, so the tests check "go" against the plan's own table.

export const PERSONS = ["i", "youM", "youF", "he", "she", "we", "youPl", "they"];

const DEFECTIVE = /[يىا]$/; // أمشي، أصحى، أقرا: the last vowel goes before -īn / -ūn
const CONSONANT = "(?:sh|kh|gh|th|dh|[bdfghjklmnqrstvwyzʿʾḥṣṭẓḍ])";
// Before -īn / -ūn a short i in the last syllable drops: tiktib → tiktbīn, tishtaghil → tishtaghlīn.
const LOSE_I = new RegExp(`(?<=${CONSONANT})i(${CONSONANT})$`);

function present(v) {
  const first = v.now.ar[0];
  const rest = v.now.ar.slice(1);
  const body = first === "آ" ? "ا" + rest : rest; // آكل → تاكل
  const short = DEFECTIVE.test(body) ? body.slice(0, -1) : body;
  const stem = v.now.say.replace(/^a/, ""); // arūḥ → rūḥ; ākil → ākil
  const long = stem.startsWith("ā");
  const pre = p => (long ? p : p + "i"); // tākil but tirūḥ
  const vowelEnd = /[aiuāīū]$/.test(stem);
  const before = vowelEnd ? stem.slice(0, -1) : stem.replace(LOSE_I, "$1"); // before -īn / -ūn
  return [
    { ar: v.now.ar, say: v.now.say },
    { ar: "ت" + body, say: pre("t") + stem },
    { ar: "ت" + short + "ين", say: pre("t") + before + "īn" },
    { ar: "ي" + body, say: pre("y") + stem },
    { ar: "ت" + body, say: pre("t") + stem },
    { ar: "ن" + body, say: pre("n") + stem },
    { ar: "ت" + short + "ون", say: pre("t") + before + "ūn" },
    { ar: "ي" + short + "ون", say: pre("y") + before + "ūn" },
  ];
}

function past(v) {
  const i = v.past;
  const he = v.he;
  const heShort = he.ar === "جا" ? "ج" : DEFECTIVE.test(he.ar) ? he.ar.slice(0, -1) : he.ar;
  const sheAr = he.ar === "جا" ? "جات" : heShort + "ت";
  return [
    { ar: i.ar, say: i.say },
    { ar: i.ar, say: i.say },
    { ar: i.ar + "ي", say: i.say + "i" },
    { ar: he.ar, say: he.say },
    { ar: sheAr, say: he.she },
    { ar: i.ar.slice(0, -1) + "نا", say: i.say.replace(/t$/, "") + "na" },
    { ar: i.ar + "و", say: i.say + "u" },
    { ar: heShort + "وا", say: he.she.replace(/at$/, "aw") },
  ];
}

// بـ + present: بروح barūḥ (I), بتروح btirūḥ (you, she), بيروح bīrūḥ (he), بنروح bnirūḥ (we) …
function future(now) {
  return now.map((f, k) => {
    const ar = "ب" + (k === 0 ? (f.ar[0] === "آ" ? "ا" + f.ar.slice(1) : f.ar.slice(1)) : f.ar);
    const say = k === 0 ? "b" + f.say : f.say.startsWith("yi") ? "bī" + f.say.slice(2) : f.say.startsWith("y") ? "bi" + f.say : "b" + f.say;
    return { ar, say };
  });
}

export function conjugate(v) {
  const now = present(v);
  return { now, past: past(v), will: future(now) };
}

// Saying no and "want to", built from the forms: ما أروح، ما رحت، لا تروحين، أبي أروح، تبين تروحين؟
export function patterns(v) {
  const { now, past: p } = conjugate(v);
  const modal = v.id === "can" || v.id === "want";
  const base = v.en.split(/,\s*/)[0].replace(/ \(.*\)$/, ""); // "do, make" → do; "miss (someone)" → miss
  const en = {
    not: v.id === "can" ? "I can't" : `I don't ${base}`,
    notPast: v.id === "can" ? "I couldn't" : `I didn't ${base}`,
  };
  const out = [
    { ar: `ما ${now[0].ar}`, say: `ma ${now[0].say}`, en: en.not, uk: `я не ${v.ukNow}` },
    { ar: `ما ${p[0].ar}`, say: `ma ${p[0].say}`, en: en.notPast, uk: `я не ${v.ukPast}` },
  ];
  if (!modal) {
    out.push(
      { ar: `لا ${now[2].ar}`, say: `la ${now[2].say}`, en: `don't ${base}! (to her)`, uk: `не треба ${v.ukInf}! (до неї)` },
      { ar: `أبي ${now[0].ar}`, say: `abi ${now[0].say}`, en: `I want to ${base}`, uk: `я хочу ${v.ukInf}` },
      { ar: `تبين ${now[2].ar}؟`, say: `tibīn ${now[2].say}?`, en: `do you want to ${base}? (to her)`, uk: `хочеш ${v.ukInf}? (до неї)` },
    );
  }
  return out;
}
