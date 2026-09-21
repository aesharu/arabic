// Numbers, time, days and months, the way they're spoken (views/numbers.js). Every text in three languages:
// ar (spoken Najdi) + say (pronunciation), en, uk. check = not verified by a native speaker yet.
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
  5: ["وخمس", "w khams", "five past", "п'ять на"],
  10: ["وعشر", "w ʿashar", "ten past", "десять на"],
  15: ["وربع", "w rubʿ", "quarter past", "чверть на"],
  20: ["وثلث", "w thilth", "twenty past (lit. “and a third”)", "двадцять на (досл. «і третина»)"],
  25: ["ونص إلا خمس", "w nuṣṣ illa khams", "twenty-five past (lit. “half minus five”)", "двадцять п'ять на (досл. «пів мінус п'ять»)"],
  30: ["ونص", "w nuṣṣ", "half past", "пів на"],
  35: ["ونص وخمس", "w nuṣṣ w khams", "twenty-five to (lit. “half and five”)", "за двадцять п'ять (досл. «пів і п'ять»)"],
  40: ["إلا ثلث", "illa thilth", "twenty to (lit. “minus a third”)", "за двадцять (досл. «без третини»)"],
  45: ["إلا ربع", "illa rubʿ", "quarter to", "за чверть"],
  50: ["إلا عشر", "illa ʿashar", "ten to", "за десять"],
  55: ["إلا خمس", "illa khams", "five to", "за п'ять"],
};
const PART_OF_DAY = h => (h < 5 ? ["بالليل", "bil-lēl", "at night", "вночі"] : h < 12 ? ["الصبح", "aṣ-ṣubḥ", "in the morning", "вранці"] : h < 15 ? ["الظهر", "aẓ-ẓuhr", "at noon", "опівдні"] : h < 18 ? ["العصر", "al-ʿaṣr", "in the afternoon", "по обіді"] : ["بالليل", "bil-lēl", "in the evening", "увечері"]);

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
export const TIME_PARTS = Object.entries(MINUTES).filter(([, v]) => v).map(([m, v]) => ({ m: +m, ar: v[0], say: v[1], en: v[2], uk: v[3] }));

// ---------- Days, months ----------
export const DAYS = [
  { ar: "الأحد", say: "al-aḥad", en: "Sunday", uk: "неділя" },
  { ar: "الاثنين", say: "al-ithnēn", en: "Monday", uk: "понеділок" },
  { ar: "الثلاثاء", say: "ath-thalāthāʾ", en: "Tuesday", uk: "вівторок" },
  { ar: "الأربعاء", say: "al-arbiʿāʾ", en: "Wednesday", uk: "середа" },
  { ar: "الخميس", say: "al-khamīs", en: "Thursday", uk: "четвер" },
  { ar: "الجمعة", say: "al-jumʿa", en: "Friday — weekend", uk: "п'ятниця — вихідний" },
  { ar: "السبت", say: "as-sabt", en: "Saturday — weekend", uk: "субота — вихідний" },
];

// The months of the year as Saudis name them; many also just say the number: شهر ٢ shahar thnēn = February.
export const MONTHS = [
  { ar: "يناير", say: "yanāyir", en: "January", uk: "січень" },
  { ar: "فبراير", say: "fibrāyir", en: "February", uk: "лютий" },
  { ar: "مارس", say: "māris", en: "March", uk: "березень" },
  { ar: "أبريل", say: "abrīl", en: "April", uk: "квітень" },
  { ar: "مايو", say: "māyu", en: "May", uk: "травень" },
  { ar: "يونيو", say: "yūnyu", en: "June", uk: "червень" },
  { ar: "يوليو", say: "yūlyu", en: "July", uk: "липень" },
  { ar: "أغسطس", say: "aghusṭus", en: "August", uk: "серпень" },
  { ar: "سبتمبر", say: "sibtambir", en: "September", uk: "вересень" },
  { ar: "أكتوبر", say: "uktōbar", en: "October", uk: "жовтень" },
  { ar: "نوفمبر", say: "nōfambir", en: "November", uk: "листопад" },
  { ar: "ديسمبر", say: "disambir", en: "December", uk: "грудень" },
];
export const HIJRI_MONTHS = [
  { ar: "محرم", say: "muḥarram", en: "Muharram — the new Islamic year", uk: "Мухаррам — новий ісламський рік" },
  { ar: "صفر", say: "ṣafar", en: "Safar", uk: "Сафар" },
  { ar: "ربيع الأول", say: "rabīʿ al-awwal", en: "Rabi' I", uk: "Рабі перший" },
  { ar: "ربيع الثاني", say: "rabīʿ ath-thāni", en: "Rabi' II", uk: "Рабі другий" },
  { ar: "جمادى الأولى", say: "jumād al-ūla", en: "Jumada I", uk: "Джумада перший" },
  { ar: "جمادى الآخرة", say: "jumād al-ākhra", en: "Jumada II", uk: "Джумада другий" },
  { ar: "رجب", say: "rajab", en: "Rajab", uk: "Раджаб" },
  { ar: "شعبان", say: "shaʿbān", en: "Sha'ban", uk: "Шаабан" },
  { ar: "رمضان", say: "ramaḍān", en: "Ramadan — the month of fasting", uk: "Рамадан — місяць посту" },
  { ar: "شوال", say: "shawwāl", en: "Shawwal — Eid al-Fitr on the 1st", uk: "Шавваль — Ід аль-Фітр першого числа" },
  { ar: "ذو القعدة", say: "dhu l-gaʿda", en: "Dhu al-Qa'dah", uk: "Зуль-каада" },
  { ar: "ذو الحجة", say: "dhu l-ḥijja", en: "Dhu al-Hijjah — Hajj and Eid al-Adha", uk: "Зуль-хіджа — хадж і Ід аль-Адха" },
];

// Questions and answers with numbers.
export const NUMBER_PHRASES = [
  { ar: "كم الساعة؟", say: "kam as-sāʿa?", en: "what time is it?", uk: "котра година?" },
  { ar: "كم عمرك؟", say: "kam ʿumrik?", en: "how old are you?", uk: "скільки тобі років?" },
  { ar: "عمري ثلاثين سنة", say: "ʿumri thalāthīn sana", en: "I'm thirty (years old)", uk: "мені тридцять (років)" },
  { ar: "بكم؟", say: "bikam?", en: "how much is it?", uk: "скільки коштує?" },
  { ar: "بخمسين ريال", say: "b-khamsīn riyāl", en: "fifty riyals", uk: "п'ятдесят ріалів" },
  { ar: "اليوم كم بالشهر؟", say: "al-yōm kam bish-shahar?", en: "what's the date today?", uk: "яке сьогодні число?" },
  { ar: "اليوم تسعة فبراير", say: "al-yōm tisʿa fibrāyir", en: "today is 9 February", uk: "сьогодні 9 лютого" },
  { ar: "يوم ميلادك متى؟", say: "yōm mīlādik mita?", en: "when is your birthday?", uk: "коли в тебе день народження?" },
  { ar: "كم رقمك؟", say: "kam ragmik?", en: "what's your number?", uk: "який у тебе номер?" },
  { ar: "نتقابل الساعة ثمان", say: "nitgābal as-sāʿa thamān", en: "let's meet at eight", uk: "зустрінемося о восьмій" },
  { ar: "بعد ساعتين", say: "baʿad sāʿatēn", en: "in two hours", uk: "за дві години" },
  { ar: "قبل يومين", say: "gabl yōmēn", en: "two days ago", uk: "два дні тому" },
];
