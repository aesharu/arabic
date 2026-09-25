// Does the Arabic spelling and the Latin pronunciation say the same word?
// Shared by tests/read.test.mjs (the texts) and tests/book.test.mjs (the book), because both of them make the
// same promise: he learns the sounds from the pronunciation and the letters from the Arabic, so if the two
// ever drift apart he learns to read a word wrong.
//
// Only the hard consonants are compared: alif/waw/ya as long vowels, hamza, and the ال of a sun letter behave
// differently in speech, so they are ignored on both sides.
const SOUND = { "ب":"b","ت":"t","ث":"th","ج":"j","ح":"H","خ":"kh","د":"d","ذ":"dh","ر":"r","ز":"z","س":"s",
  "ش":"sh","ص":"S","ض":"Z","ط":"T","ظ":"Z","ع":"3","غ":"gh","ف":"f","ق":"g","ك":"k","ل":"l","م":"m","ن":"n","ه":"h" };
const SUN = "تثدذرزسشصضطظلن";
// الـ is the article only at the start of a word — قالت is not "qa + al + t". و ب ك ل ع ف may sit in front of it.
const ART = new RegExp(`(^|[\\sوبكلعف])ال(?=[${SUN}])`, "gu");

export const arSkeleton = ar => [...ar.replace(/ا?ً/g, "ن").replace(/[ً-ْٰـ]/g, "").replace(ART, "$1ا")]
  .flatMap(c => (SOUND[c] ? [SOUND[c]] : []));

export const saySkeleton = say => {
  const s = String(say).toLowerCase().replace(/[āīūēō]/g, "")
    .replace(/ḥ/g, "H").replace(/ṣ/g, "S").replace(/[ẓḍ]/g, "Z").replace(/ṭ/g, "T")
    .replace(/ʿ/g, "3").replace(/[ʾ'’ʼ]/g, "").replace(/ġ/g, "gh").replace(/ž/g, "j").replace(/v/g, "f")
    .replace(/[^a-z3HSZT]/g, "");
  const out = [];
  for (let i = 0; i < s.length; ) {
    if ("HSZT3".includes(s[i])) { out.push(s[i]); i++; continue; }
    const two = s.slice(i, i + 2);
    if (["th", "kh", "dh", "sh", "gh"].includes(two)) { out.push(two); i += 2; continue; }
    if ("aeiouyw".includes(s[i])) { i++; continue; }
    out.push(s[i] === "q" ? "g" : s[i]); i++;
  }
  return out;
};

const collapse = a => a.filter((x, i) => x !== a[i - 1]);              // شدّة writes one letter, the Latin two
const expand = a => a.flatMap(x => (x.length === 2 ? [x[0], x[1]] : [x]));
const norm = a => collapse(expand(collapse(a)));
const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

// ة is silent at the end of a phrase and sounded "t" before the next word (شجرة السعودية → shajarat as-...).
// A line can hold several, each going its own way, so every combination is tried.
const variants = ar => {
  const at = [...ar].flatMap((c, i) => (c === "ة" ? [i] : []));
  if (!at.length || at.length > 8) return [ar];
  const out = [];
  for (let m = 0; m < 1 << at.length; m++) {
    const chars = [...ar];
    at.forEach((i, k) => { if (m & (1 << k)) chars[i] = "ت"; });
    out.push(chars.join(""));
  }
  return out;
};

export const sameWord = (ar, say) => {
  const S = norm(saySkeleton(say));
  return variants(ar).some(v => same(norm(arSkeleton(v)), S));
};
