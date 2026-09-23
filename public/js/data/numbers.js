// Numbers, time, days and months, the way they're spoken (views/numbers.js). Every text in three languages:
// ar (spoken Saudi) + say (pronunciation) + en. check = not verified by a native speaker yet.
// 1–10, 20, 100, 1000 and the days are the plan's (NAJDI-PLAN.md 2.6); the rest is flagged.

const UNITS = [
  ["صفر", "ṣifr"], ["واحد", "wāḥid"], ["ثنين", "thnēn"], ["ثلاثة", "thalātha"], ["أربعة", "arbaʿa"], ["خمسة", "khamsa"],
  ["ستة", "sitta"], ["سبعة", "sabʿa"], ["ثمانية", "thamānya"], ["تسعة", "tisʿa"], ["عشرة", "ʿashara"],
  ["احدعش", "iḥdaʿash"], ["اثنعش", "ithnaʿash"], ["ثلطعش", "thalaṭṭaʿash"], ["أربعطعش", "arbaʿṭaʿash"], ["خمسطعش", "khamisṭaʿash"],
  ["ستطعش", "sittaʿash"], ["سبعطعش", "sabaʿṭaʿash"], ["ثمنطعش", "thamanṭaʿash"], ["تسعطعش", "tisaʿṭaʿash"],
];
const TENS = [null, null, ["عشرين", "ʿishrīn"], ["ثلاثين", "thalāthīn"], ["أربعين", "arbaʿīn"], ["خمسين", "khamsīn"],
  ["ستين", "sittīn"], ["سبعين", "sabʿīn"], ["ثمانين", "thamānīn"], ["تسعين", "tisʿīn"]];
// Before مية and آلاف the short forms: ثلاث مية thalāth miya, ثلاث آلاف thalāth ālāf.
const SHORT = [null, null, null, ["ثلاث", "thalāth"], ["أربع", "arbaʿ"], ["خمس", "khams"], ["ست", "sitt"], ["سبع", "sabʿ"], ["ثمان", "thamān"], ["تسع", "tisʿ"], ["عشر", "ʿashar"]];

const join = parts => ({ ar: parts.map(p => p[0]).join(" و"), say: parts.map(p => p[1]).join(" w ") });

function below100(n) {
  if (n < 20) return [UNITS[n]];
  const [t, u] = [Math.floor(n / 10), n % 10];
  return u ? [UNITS[u], TENS[t]] : [TENS[t]];
}

function below1000(n) {
  const h = Math.floor(n / 100);
  const rest = n % 100;
  const hundreds = h === 0 ? [] : h === 1 ? [["مية", "miya"]] : h === 2 ? [["ميتين", "mītēn"]] : [[`${SHORT[h][0]} مية`, `${SHORT[h][1]} miya`]];
  return [...hundreds, ...(rest || !h ? below100(rest) : [])].filter(Boolean);
}

// Any whole number from 0 to 1,000,000, as spoken: 125 → مية وخمسة وعشرين, miya w khamsa w ʿishrīn.
export function spoken(n) {
  if (!Number.isInteger(n) || n < 0 || n > 1_000_000) return null;
  if (n === 1_000_000) return { ar: "مليون", say: "milyōn" };
  if (n < 1000) return join(below1000(n));
  const th = Math.floor(n / 1000);
  const rest = n % 1000;
  let thousands;
  if (th === 1) thousands = [["ألف", "alf"]];
  else if (th === 2) thousands = [["ألفين", "alfēn"]];
  else if (th <= 10) thousands = [[`${SHORT[th][0]} آلاف`, `${SHORT[th][1]} ālāf`]];
  else {
    const t = join(below1000(th));
    thousands = [[`${t.ar} ألف`, `${t.say} alf`]];
  }
  return join([...thousands, ...(rest ? below1000(rest) : [])]);
}

// Which numbers the plan itself gives (the others are flagged).
export const PLAN_NUMBERS = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 100, 1000]);
export const isChecked = n => PLAN_NUMBERS.has(n);

// The digits Saudis write, next to ours: 2026 → ٢٠٢٦.
export const arabicDigits = n => String(n).replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);

// ---------- Time ----------
// The hour (with الساعة): وحدة، ثنتين، ثلاث … اثنعش.
const HOURS = [null, ["وحدة", "waḥda"], ["ثنتين", "thintēn"], ["ثلاث", "thalāth"], ["أربع", "arbaʿ"], ["خمس", "khams"], ["ست", "sitt"],
  ["سبع", "sabʿ"], ["ثمان", "thamān"], ["تسع", "tisʿ"], ["عشر", "ʿashar"], ["احدعش", "iḥdaʿash"], ["اثنعش", "ithnaʿash"]];
// Minutes in steps of five, as they're said: past the hour, or "to" the next one.
const MINUTES = {
  0: null,
  5: ["وخمس", "w khams", "five past"],
  10: ["وعشر", "w ʿashar", "ten past"],
  15: ["وربع", "w rubʿ", "quarter past"],
  20: ["وثلث", "w thilth", "twenty past (lit. “and a third”)"],
  25: ["ونص إلا خمس", "w nuṣṣ illa khams", "twenty-five past (lit. “half minus five”)"],
  30: ["ونص", "w nuṣṣ", "half past"],
  35: ["ونص وخمس", "w nuṣṣ w khams", "twenty-five to (lit. “half and five”)"],
  40: ["إلا ثلث", "illa thilth", "twenty to (lit. “minus a third”)"],
  45: ["إلا ربع", "illa rubʿ", "quarter to"],
  50: ["إلا عشر", "illa ʿashar", "ten to"],
  55: ["إلا خمس", "illa khams", "five to"],
};
const PART_OF_DAY = h => (h < 5 ? ["بالليل", "bil-lēl", "at night"] : h < 12 ? ["الصبح", "aṣ-ṣubḥ", "in the morning"] : h < 15 ? ["الظهر", "aẓ-ẓuhr", "at noon"] : h < 18 ? ["العصر", "al-ʿaṣr", "in the afternoon"] : ["بالليل", "bil-lēl", "in the evening"]);

// "It's 3:40 in the afternoon" → الساعة أربع إلا ثلث العصر. h 0–23, m a multiple of 5.
export function clockTime(h, m) {
  const next = m >= 40 || m === 45; // from :40 it's "to" the next hour
  const hh = ((next ? h + 1 : h) % 12) || 12;
  const min = MINUTES[m];
  const part = PART_OF_DAY(h);
  return {
    ar: `الساعة ${HOURS[hh][0]}${min ? ` ${min[0]}` : ""} ${part[0]}`,
    say: `as-sāʿa ${HOURS[hh][1]}${min ? ` ${min[1]}` : ""} ${part[1]}`,
    digits: `${h}:${String(m).padStart(2, "0")}`,
  };
}
export const TIME_PARTS = Object.entries(MINUTES).filter(([, v]) => v).map(([m, v]) => ({ m: +m, ar: v[0], say: v[1], en: v[2] }));

// ---------- Days, months ----------
export const DAYS = [
  { ar: "الأحد", say: "al-aḥad", en: "Sunday" },
  { ar: "الاثنين", say: "al-ithnēn", en: "Monday" },
  { ar: "الثلاثاء", say: "ath-thalāthāʾ", en: "Tuesday" },
  { ar: "الأربعاء", say: "al-arbiʿāʾ", en: "Wednesday" },
  { ar: "الخميس", say: "al-khamīs", en: "Thursday" },
  { ar: "الجمعة", say: "al-jumʿa", en: "Friday — weekend" },
  { ar: "السبت", say: "as-sabt", en: "Saturday — weekend" },
];

// The months of the year as Saudis name them; many also just say the number: شهر ٢ shahar thnēn = February.
export const MONTHS = [
  { ar: "يناير", say: "yanāyir", en: "January" },
  { ar: "فبراير", say: "fibrāyir", en: "February" },
  { ar: "مارس", say: "māris", en: "March" },
  { ar: "أبريل", say: "abrīl", en: "April" },
  { ar: "مايو", say: "māyu", en: "May" },
  { ar: "يونيو", say: "yūnyu", en: "June" },
  { ar: "يوليو", say: "yūlyu", en: "July" },
  { ar: "أغسطس", say: "aghusṭus", en: "August" },
  { ar: "سبتمبر", say: "sibtambir", en: "September" },
  { ar: "أكتوبر", say: "uktōbar", en: "October" },
  { ar: "نوفمبر", say: "nōfambir", en: "November" },
  { ar: "ديسمبر", say: "disambir", en: "December" },
];
export const HIJRI_MONTHS = [
  { ar: "محرم", say: "muḥarram", en: "Muharram — the new Islamic year" },
  { ar: "صفر", say: "ṣafar", en: "Safar" },
  { ar: "ربيع الأول", say: "rabīʿ al-awwal", en: "Rabi' I" },
  { ar: "ربيع الثاني", say: "rabīʿ ath-thāni", en: "Rabi' II" },
  { ar: "جمادى الأولى", say: "jumād al-ūla", en: "Jumada I" },
  { ar: "جمادى الآخرة", say: "jumād al-ākhra", en: "Jumada II" },
  { ar: "رجب", say: "rajab", en: "Rajab" },
  { ar: "شعبان", say: "shaʿbān", en: "Sha'ban" },
  { ar: "رمضان", say: "ramaḍān", en: "Ramadan — the month of fasting" },
  { ar: "شوال", say: "shawwāl", en: "Shawwal — Eid al-Fitr on the 1st" },
  { ar: "ذو القعدة", say: "dhu l-gaʿda", en: "Dhu al-Qa'dah" },
  { ar: "ذو الحجة", say: "dhu l-ḥijja", en: "Dhu al-Hijjah — Hajj and Eid al-Adha" },
];

// Questions and answers with numbers.
export const NUMBER_PHRASES = [
  { ar: "كم الساعة؟", say: "kam as-sāʿa?", en: "what time is it?" },
  { ar: "كم عمرك؟", say: "kam ʿumrik?", en: "how old are you?" },
  { ar: "عمري ثلاثين سنة", say: "ʿumri thalāthīn sana", en: "I'm thirty (years old)" },
  { ar: "بكم؟", say: "bikam?", en: "how much is it?" },
  { ar: "بخمسين ريال", say: "b-khamsīn riyāl", en: "fifty riyals" },
  { ar: "اليوم كم بالشهر؟", say: "al-yōm kam bish-shahar?", en: "what's the date today?" },
  { ar: "اليوم تسعة فبراير", say: "al-yōm tisʿa fibrāyir", en: "today is 9 February" },
  { ar: "يوم ميلادك متى؟", say: "yōm mīlādik mita?", en: "when is your birthday?" },
  { ar: "كم رقمك؟", say: "kam ragmik?", en: "what's your number?" },
  { ar: "نتقابل الساعة ثمان", say: "nitgābal as-sāʿa thamān", en: "let's meet at eight" },
  { ar: "بعد ساعتين", say: "baʿad sāʿatēn", en: "in two hours" },
  { ar: "قبل يومين", say: "gabl yōmēn", en: "two days ago" },
];
