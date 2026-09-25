// The words that have a Saudi voice of their own.
//
// The files in public/audio/saudi are the ar-SA voice "Hamed" (speechgen.io, 320 kbps / 48 kHz mono): the ten
// words she taught him (data/hers.js) and the four hundred for talking to her (data/essentials.js). It is a computer,
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
import { ESSENTIALS } from "./essentials.js";

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
// The words still without a voice of their own: the site that makes them gives a thousand characters to a
// visitor and then stops, and these are what was left when it stopped. They are not lost — the marked
// spelling each one needs is kept in SAID below, so the day the voice can be made they are made from it.
// Until then they speak in the browser's own voice, like every other word on the site, and wait for Dima.
const WAITING = new Set([
  "bez", "jibn", "khuzar", "fawakih", "salata",
  "hala-food", "matam", "talab", "ladhidh", "harr",
  "barid", "hali", "malih", "wesh-tibin-takilin", "ghurfa",
  "matbakh", "sarir", "shahin", "risala", "foys",
  "sura", "mukalama", "shughl", "dawam", "jama",
  "sayyara", "tarig", "sug", "ahl", "abuy",
  "ummi", "akhuy", "ukhti", "iyal", "walad",
  "bint", "ar-rab", "nas", "jamil", "shen",
  "muhimm", "gharib", "wahid", "saba", "thnen",
  "thamanya", "thalatha", "tisa", "arbaa", "ashara",
  "khamsa", "ishrin", "sitta", "as-sabt", "al-ahad",
  "al-ithnen", "ukranya", "urubba", "ash-shita", "thalj",
  "matar", "shughli", "dirasti", "nimti-zen", "kef-kan-yomik",
  "wesh-sar", "sar-shay", "fazya", "ana-bid-dawam", "tawwni-sihet",
  "tawwni-khallast", "banam", "barja-baad-saa", "akallimik-baden", "lahza",
  "dagiga-w-arja", "gaid-ashtaghil", "mishtag-lik", "ya-baad-hayyi", "ya-halilik",
  "maik-hagg", "ana-maik", "la-tizalin", "samhini", "allimini",
  "mani-fahim", "wesh-widdik-tsawwin", "mita-fazya", "nitkallam-al-lela", "bukra-in-sha-allah",
  "yimdik", "ma-yimdi", "ysir", "int", "hu",
  "hi", "intu", "hum", "beti", "betik",
  "betah", "betha", "betna", "betkum", "bethum",
  "thibbini", "tiruh", "ramazan-karim", "ramazan-mbarak", "idik-mbarak",
  "kill-am-w-inti-bkher", "asak-min-uwwadah", "allah-yishfik", "salamat", "mabruk",
  "allah-yirhamah", "bit-tofig", "agum-min-an-nom", "aghassil-wajhi", "anazzif-asnani",
  "ahlig", "albas-malabsi", "aftir", "atla-min-al-bet", "awsal-ash-shughul",
  "abda-dawami", "astarih-shwayy", "atghadda", "akhallis-dawam", "arja-al-bet",
  "atashsha", "snab", "stori", "arsili-li", "shift-risalatik",
  "ma-shift", "riddi-alay", "lesh-ma-raddeti", "an-nit", "way-fay",
  "ash-shabaka-zaifa", "shahn", "jawwali-tifa", "ragm", "ragmik",
  "ras", "rasi-yawwirni", "yawwirni", "batn", "zahr",
  "idhn", "khashm", "thumm", "yad", "rijl",
  "galb", "wajh", "harara", "zukam", "al-jaww",
  "al-jaww-hilw", "shams", "ghem", "mghayyim", "hawa",
  "ghubar", "ajaj", "rad", "barg", "sel",
  "rtuba", "katma", "daraja", "yimin", "yisar",
  "seda", "liffi", "wagguf", "ishara", "dawwar",
  "makhraj", "mawgif", "taksi", "sawwag", "tayyara",
  "rihla", "tadhkara",]);

for (const w of ESSENTIALS) {
  if (!WAITING.has(w.file)) BY_KEY.set(key(w.ar), w.file);
  SAID.set(key(w.ar), w.said);
}

/** The file for a word, or "" when there isn't one. */
export const voiceFile = text => BY_KEY.get(key(text)) ?? "";
/** Exactly what was typed into the voice engine to make it — so it can be made again the same way. */
export const voiceText = text => SAID.get(key(text)) ?? "";
export const VOICE_WORDS = [...BY_KEY.keys()];
export const VOICE_FILES = [...BY_KEY.values()];
/** The words whose voice is still to be made. */
export const VOICE_WAITING = [...WAITING];
