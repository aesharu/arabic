// Marking what he types in Arabic. Typing is new to him, so the marking forgives everything that isn't
// really a spelling mistake — vowel marks he can't type, the hamza shapes, ة for ه, ى for ي, punctuation —
// but it still shows him the exact spelling afterwards, so he learns the written form properly.
// No DOM here: tests/write.test.mjs checks these directly.

const MARKS = /[ً-ْٓ-ٰٕۖ-ۭـ]/g; // fatha, kasra, shadda, sukun… and tatweel
const PUNCT = /[\s.,!?؟،؛:"'`«»()\-–—…]/g;

// One form for each letter that has several: أإآٱ → ا, ة → ه, ى → ي, ؤ → و, ئ → ي.
const SAME = { "أ": "ا", "إ": "ا", "آ": "ا", "ٱ": "ا", "ة": "ه", "ى": "ي", "ؤ": "و", "ئ": "ي", "ء": "" };

export function bare(text) {
  return String(text ?? "")
    .normalize("NFC")
    .replace(MARKS, "")
    .replace(PUNCT, "")
    .split("")
    .map(ch => SAME[ch] ?? ch)
    .join("");
}

// Right, right-but-spelled-differently, or wrong.
export function mark(typed, answer) {
  const a = String(typed ?? "").normalize("NFC").replace(MARKS, "").replace(PUNCT, "");
  const b = String(answer ?? "").normalize("NFC").replace(MARKS, "").replace(PUNCT, "");
  if (!a) return "empty";
  if (a === b) return "right";
  return bare(a) === bare(b) ? "close" : "wrong"; // "close": the same word, one of the letters that sound alike
}

// What to show him when he got it wrong: every letter of the correct spelling marked "same" (he typed it)
// or "missing" (he didn't), plus how many letters he typed that don't belong. The walk is the usual
// longest-common-run table, so letters in the right order still count as his even if others are missing.
export function diff(typed, answer) {
  const a = [...String(typed ?? "").normalize("NFC").replace(MARKS, "").replace(PUNCT, "")];
  const b = [...String(answer ?? "").normalize("NFC").replace(MARKS, "").replace(PUNCT, "")];
  const alike = (x, y) => (SAME[x] ?? x) === (SAME[y] ?? y);
  const n = a.length, m = b.length;
  const table = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      table[i][j] = alike(a[i], b[j]) ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }
  const letters = [];
  let i = 0, j = 0, extra = 0;
  while (j < m || i < n) {
    if (i < n && j < m && alike(a[i], b[j])) {
      letters.push({ ch: b[j], kind: "same" });
      i++;
      j++;
    } else if (i < n && (j >= m || table[i + 1][j] >= table[i][j + 1])) {
      extra++; // a letter he typed that the word doesn't have
      i++;
    } else {
      letters.push({ ch: b[j], kind: "missing" });
      j++;
    }
  }
  return { letters, extra };
}

// The on-screen keyboard: his Mac has no Arabic layout, so the letters are given in alphabet order,
// which is the order he learns them in (Letters page), not the order of an Arabic typewriter.
export const KEYS = [
  ["ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر"],
  ["ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف"],
  ["ق", "ك", "ل", "م", "ن", "ه", "و", "ي", "ة", "ى"],
  ["أ", "إ", "آ", "ء", "ؤ", "ئ", "لا", "؟"],
];

// --- Reading help: a word taken apart the way a reader has to take it apart ---
// Arabic joins its letters up, so a beginner cannot see where one ends and the next begins. These split a
// word into what the eye should treat as one letter — the letter itself, plus any marks riding on it — so
// the book can give each one its own colour (views/book.js).
const RIDER = /[ً-ٰٕۖ-ۭـ]/;

export function clusters(word) {
  const out = [];
  for (const ch of String(word ?? "").normalize("NFC")) {
    if (out.length && RIDER.test(ch)) out[out.length - 1].marks += ch;
    else out.push({ ch, marks: "" });
  }
  return out;
}

// The shapes one letter wears: alone, at the start, in the middle, at the end. The ones that never join
// forward (ا د ذ ر ز و) only have two — that is the point of them.
export const shapes = (char, nonJoining = false) =>
  nonJoining ? [char, "ـ" + char] : [char, char + "ـ", "ـ" + char + "ـ", "ـ" + char];
