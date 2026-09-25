// Put the vowel marks on a Saudi word, worked out from the pronunciation the plan already gives it.
//
// Why this exists: the voice engine reads exactly what it is given, and a bare letter makes it guess فصحى
// (زين came out "zīn" until it was written زَيْن). Marking four hundred words by hand is four hundred chances
// to teach him a wrong vowel; the plan's Latin already says every vowel, so the marks are derived from it and
// then checked back against it.
//
// It refuses rather than guesses: if the Arabic and the Latin don't line up letter for letter, it returns
// null and the word is marked by hand instead.
//
//   vocalise("زين", "zēn")      → "زَيْن"
//   vocalise("قهوة", "gahwa")   → "قَهْوَة"
//   vocalise("شلونك", "shlōnik") → "شْلَوْنِكْ"   (the final ك keeps its kasra: he is speaking to her)

const FATHA = "َ", KASRA = "ِ", DAMMA = "ُ", SUKUN = "ْ", SHADDA = "ّ";

// One Arabic consonant → the Latin the plan writes for it.
const SOUND = {
  "ب": "b", "ت": "t", "ث": "th", "ج": "j", "ح": "H", "خ": "kh", "د": "d", "ذ": "dh", "ر": "r", "ز": "z",
  "س": "s", "ش": "sh", "ص": "S", "ض": "Z", "ط": "T", "ظ": "Z", "ع": "3", "غ": "gh", "ف": "f", "ق": "g",
  "ك": "k", "ل": "l", "م": "m", "ن": "n", "ه": "h", "و": "w", "ي": "y", "ء": "'", "أ": "'", "إ": "'", "آ": "'",
  "ؤ": "'", "ئ": "'", "ة": "t",
};
const SUN = "تثدذرزسشصضطظلن";

// The Latin, as a list of sounds: consonants (b, th, H, 3 …) and vowels (a i u, aa ii uu, ay aw).
export function units(say) {
  const s = String(say).toLowerCase()
    .replace(/ā/g, "aa").replace(/ī/g, "ii").replace(/ū/g, "uu").replace(/ē/g, "ay").replace(/ō/g, "aw")
    .replace(/ḥ/g, "H").replace(/ṣ/g, "S").replace(/[ẓḍ]/g, "Z").replace(/ṭ/g, "T")
    .replace(/ʿ/g, "3").replace(/[ʾ’ʼ']/g, "'").replace(/ġ/g, "gh").replace(/ž/g, "j")
    .replace(/[^a-z3HSZT'-]/g, "");
  const out = [];
  for (let i = 0; i < s.length; ) {
    const two = s.slice(i, i + 2);
    if (["th", "kh", "dh", "sh", "gh"].includes(two)) { out.push({ c: two }); i += 2; continue; }
    const third = s[i + 2];
    const doubled = (two === "ay" && third === "y") || (two === "aw" && third === "w");
    if (["aa", "ii", "uu", "ay", "aw"].includes(two) && !doubled) { out.push({ v: two }); i += 2; continue; }
    const ch = s[i];
    if (ch === "-") { i++; continue; }
    if ("aeiou".includes(ch)) { out.push({ v: ch === "e" ? "i" : ch === "o" ? "u" : ch }); i++; continue; }
    out.push({ c: ch === "q" ? "g" : ch === "v" ? "f" : ch });
    i++;
  }
  return out;
}

// One word. Returns the marked word, or null when the two sides don't line up.
function word(ar, say) {
  const letters = [...String(ar).replace(/[ً-ْٰـ]/g, "")];
  const u = units(say);
  let out = "";
  let p = 0;               // where we are in the Latin
  const peek = (n = 0) => u[p + n];
  const isVowel = x => x && x.v;

  for (let i = 0; i < letters.length; i++) {
    const c = letters[i];
    const next = letters[i + 1];
    const last = i === letters.length - 1;

    // الـ at the start: written the same every time, said two ways.
    if (i === 0 && c === "ا" && next === "ل" && letters.length > 2) {
      const after = letters[2];
      const sun = SUN.includes(after);
      if (peek()?.v === "a") p++;                       // the a of al-
      if (u[p]?.c === "l") p++;                          // moon: the l is heard
      out += "ا" + "ل" + (sun ? "" : SUKUN);
      i++;                                               // the ل is done
      if (sun) {
        // as-salāma: the ل disappears into a doubled letter
        if (u[p]?.c === SOUND[after]) p++;
        if (u[p]?.c === SOUND[after]) p++;   // the Latin writes the doubled letter twice: aṣ-ṣubḥ
        out += after + SHADDA;
        i++;
        // and the vowel after it, with whatever carries it
        const v = peek();
        if (isVowel(v)) {
          const w = vowel(v.v, letters[i + 1]);
          out += w.out; p++; if (w.ate) i++;
        }
        continue;
      }
      continue;
    }

    // A hamza or alif that opens the word carries the first vowel.
    if (i === 0 && "اأإآ".includes(c)) {
      const v = peek();
      if (c === "آ") { out += "آ"; if (v?.v === "aa") p++; continue; }
      if (isVowel(v)) {
        if (u[p]?.c === "'") p++;                        // the catch itself, when the Latin writes one
        const vv = peek();
        out += c + (isVowel(vv) ? markFor(vv.v) : "");
        if (isVowel(vv)) { p++; if (vv.v === "aa" && next === "ا") i++; }
        continue;
      }
      out += c;
      continue;
    }

    // A long vowel's carrier, already written when its mark was placed.
    if ("اويى".includes(c) && out.endsWith(SUKUN) === false && carried(out, c)) { out += c; continue; }

    if (last && "اوي".includes(c) && p >= u.length) { out += c; continue; } // the silent carrier at the end
    const sound = SOUND[c];
    if (!sound) { out += c; continue; }                  // ء and friends inside a word: leave them
    if (c === "ة") { out += c; continue; }               // the tied t is never marked

    // و and ي may be consonants (w, y) or the carrier of a long vowel — decide from the Latin.
    if ((c === "و" || c === "ي") && !(u[p]?.c === sound)) { out += c; continue; }

    if (u[p]?.c !== sound) return null;                  // they do not line up: hand-mark it
    p++;
    out += c;
    if (u[p]?.c === sound) { out += SHADDA; p++; }       // written once, said twice

    const v = peek();
    if (isVowel(v)) {
      const w = vowel(v.v, next);
      out += w.out;
      p++;
      if (w.ate) i++;
      else if (["aa", "ii", "uu", "ay", "aw"].includes(v.v) && next !== "ة" && !last) return null;
    } else if (!last && !out.endsWith(SHADDA)) {
      out += SUKUN;                                      // a shadda'd letter never also takes a sukūn
    }
  }
  return p === u.length ? out : null;                    // every sound accounted for
}

// Writes the vowel, and the ا/و/ي that carries it when the vowel is a long one or a diphthong.
function vowel(v, nextLetter) {
  let out = markFor(v);
  let ate = false;
  if (v === "aa" && nextLetter === "ا") { out += "ا"; ate = true; }
  else if (v === "ii" && nextLetter === "ي") { out += "ي"; ate = true; }
  else if (v === "uu" && nextLetter === "و") { out += "و"; ate = true; }
  else if (v === "ay" && nextLetter === "ي") { out += "ي" + SUKUN; ate = true; }
  else if (v === "aw" && nextLetter === "و") { out += "و" + SUKUN; ate = true; }
  return { out, ate };
}

const markFor = v => (v === "a" || v === "aa" || v === "ay" || v === "aw" ? FATHA : v === "i" || v === "ii" ? KASRA : DAMMA);
const carried = (out, c) => false;                       // the carriers are written when their mark is placed

/** The whole phrase, word by word. Returns null if any word doesn't line up. */
export function vocalise(ar, say) {
  const arWords = String(ar).trim().split(/\s+/);
  const sayWords = String(say).trim().split(/\s+/).filter(Boolean);
  if (arWords.length !== sayWords.length) return null;
  const out = [];
  for (let i = 0; i < arWords.length; i++) {
    const punct = arWords[i].match(/[؟?!.,،…]+$/)?.[0] ?? "";
    const w = word(arWords[i].replace(/[؟?!.,،…]+$/, ""), sayWords[i]);
    if (w === null) return null;
    out.push(w + punct);
  }
  return out.join(" ");
}
