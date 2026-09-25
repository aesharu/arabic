// The words that have a Saudi voice of their own.
//
// The files in public/audio/saudi are the ar-SA voice "Hamed" (speechgen.io, 320 kbps / 48 kHz mono): the ten
// words she taught him (data/hers.js) and the hundred for talking to her (data/hundred.js). It is a computer,
// not Dima — the site says so every time one plays, and her own recording always wins over it (core/speech.js
// plays hers first, this second, the browser voice last).
//
// It is here because the browser's own Arabic voice reads فصحى: it says ق as q, and these are exactly the
// words he will say to her first.
//
// The engine reads what it is given, so every word was typed in fully marked and spelled so that a formal
// reading lands on her sound: ay where she says ē (زَيْن, not زين, which it read as "zīn"), aw where she says
// ō, a sukūn where the dialect drops the vowel (بْخَيْر), a kasra on the final ك because he is speaking to
// her (شَخْبَارِكْ, -ik, never -ak), and گ for the g that ق stands for (گَهْوَة — it reads ق as q).
// What was typed in is kept beside each word: `said` in data/hundred.js, SAID here.
import { HUNDRED } from "./hundred.js";

// The ten she taught him herself.
const HERS = {
  "سلام": ["salam", "سَلَام"],
  "شخبارك؟": ["shakhbarik", "شَخْبَارِكْ؟"],
  "شلونك؟": ["shlonik", "شْلَوْنِكْ؟"],
  "بخير": ["bkher", "بْخَيْر"],
  "مو بخير": ["mu-bkher", "مُو بْخَيْر"],
  "زين": ["zen", "زَيْن"],
  "زينة": ["zena", "زَيْنَة"],
  "اسمي فولودكا": ["ismi-folodka", "اِسْمِي فُولُودْكَا"],
  "أنا من أوكرانيا": ["ana-min-ukranya", "أَنَا مِن أُوكْرَانْيَا"],
  "الحمد لله": ["alhamdulillah", "الحَمْدُ لله"],
};

// The same word may arrive with vowel marks or without, with or without the question mark.
const key = text => String(text ?? "").normalize("NFC")
  .replace(/[ً-ْٰـ]/g, "")
  .replace(/[؟?!.,،؛:"'«»()‏‎]/g, "")
  .replace(/\s+/g, " ")
  .trim();

const BY_KEY = new Map();
const SAID = new Map();
for (const [ar, [file, said]] of Object.entries(HERS)) { BY_KEY.set(key(ar), file); SAID.set(key(ar), said); }
for (const w of HUNDRED) { BY_KEY.set(key(w.ar), w.file); SAID.set(key(w.ar), w.said); }

/** The file for a word, or "" when there isn't one. */
export const voiceFile = text => BY_KEY.get(key(text)) ?? "";
/** Exactly what was typed into the voice engine to make it — so it can be made again the same way. */
export const voiceText = text => SAID.get(key(text)) ?? "";
export const VOICE_WORDS = [...BY_KEY.keys()];
export const VOICE_FILES = [...BY_KEY.values()];
