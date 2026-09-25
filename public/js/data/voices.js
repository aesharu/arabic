// A Saudi voice for the words she taught him.
//
// The files in public/audio/saudi are the ar-SA voice "Hamed" (speechgen.io, 320 kbps / 48 kHz mono), made
// word by word from data/hers.js. It is a computer, not Dima — the site says so every time it plays, and her
// own recording always wins over it (core/speech.js plays hers first, this second, the browser voice last).
// It is here because the browser's own Arabic voice reads فصحى: it says ق as q, and these are exactly the
// words he will say to her first.
//
// The engine reads what it is given, so each word was typed into it fully marked and spelled so that a
// formal reading lands on her sound: ay where she says ē (زَيْن, not زين, which it read as "zīn"), aw where
// she says ō, a sukun where the dialect drops the vowel (بْخَيْر, not بِخَيْر), and a kasra on the final ك
// because he is saying it to her (شَخْبَارِكْ, -ik, never -ak). SAID is exactly what was typed in, kept so
// the file can be made again the same way.
const SAID = {
  "سلام": "سَلَام",
  "شخبارك؟": "شَخْبَارِكْ؟",
  "شلونك؟": "شْلَوْنِكْ؟",
  "بخير": "بْخَيْر",
  "مو بخير": "مُو بْخَيْر",
  "زين": "زَيْن",
  "زينة": "زَيْنَة",
  "اسمي فولودكا": "اِسْمِي فُولُودْكَا",
  "أنا من أوكرانيا": "أَنَا مِن أُوكْرَانْيَا",
  "الحمد لله": "الحَمْدُ لله",
};

const FILES = {
  "سلام": "salam",
  "شخبارك؟": "shakhbarik",
  "شلونك؟": "shlonik",
  "بخير": "bkher",
  "مو بخير": "mu-bkher",
  "زين": "zen",
  "زينة": "zena",
  "اسمي فولودكا": "ismi-folodka",
  "أنا من أوكرانيا": "ana-min-ukranya",
  "الحمد لله": "alhamdulillah",
};

// The same word may be written with vowel marks or without, with or without the question mark.
const key = text => String(text ?? "").normalize("NFC")
  .replace(/[ً-ْٰـ]/g, "")
  .replace(/[؟?!.,،؛:"'«»()‏‎]/g, "")
  .replace(/\s+/g, " ")
  .trim();

const BY_KEY = new Map(Object.entries(FILES).map(([ar, file]) => [key(ar), file]));

/** The file for a word, or "" when there isn't one. */
export const voiceFile = text => BY_KEY.get(key(text)) ?? "";
export const VOICE_WORDS = Object.keys(FILES);
export const voiceText = word => SAID[word] ?? "";
export const VOICE_FILES = Object.values(FILES);
