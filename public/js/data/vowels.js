// Each row: { ar, name, text }. Names and texts are in both languages: { en, najdi }.
export const VOWEL_SECTIONS = [
  {
    title: { en: "Short vowels", najdi: "الحركات القصيرة" },
    intro: {
      en: "Small marks above or below a letter. Practice with them now — everyday writing leaves them out, so later you'll read without them.",
      najdi: "علامات صغيرة فوق الحرف أو تحته. تدرّب عليها الحين — الكتابة العادية ما تحطها، فبعدين بتقرا بدونها.",
    },
    rows: [
      { ar: "بَ", name: { en: "fatḥa", najdi: "فتحة" }, text: { en: "ba — short a", najdi: "ba — فتحة قصيرة" } },
      { ar: "بِ", name: { en: "kasra", najdi: "كسرة" }, text: { en: "bi — short i", najdi: "bi — كسرة قصيرة" } },
      { ar: "بُ", name: { en: "ḍamma", najdi: "ضمة" }, text: { en: "bu — short u", najdi: "bu — ضمة قصيرة" } },
      { ar: "بْ", name: { en: "sukūn", najdi: "سكون" }, text: { en: "b — no vowel at all", najdi: "b — بدون حركة أبد" } },
      { ar: "بّ", name: { en: "shadda", najdi: "شدة" }, text: { en: "bb — say the letter twice as long", najdi: "bb — طوّل الحرف مرتين" } },
    ],
  },
  {
    title: { en: "Long vowels", najdi: "حروف المد" },
    intro: {
      en: "Three letters double as long vowels.",
      najdi: "ثلاث حروف تشتغل بعد كحروف مد.",
    },
    rows: [
      { ar: "بَا", name: { en: "alif", najdi: "ألف" }, text: { en: "bā — long a", najdi: "bā — ألف ممدودة" } },
      { ar: "بِي", name: { en: "yāʾ", najdi: "ياء" }, text: { en: "bī — long i", najdi: "bī — ياء ممدودة" } },
      { ar: "بُو", name: { en: "wāw", najdi: "واو" }, text: { en: "bū — long u", najdi: "bū — واو ممدودة" } },
      { ar: "زين", name: { en: "Saudi ē", najdi: "ē السعودية" }, text: { en: "zēn — ay becomes ē", najdi: "zēn — ay تصير ē" } },
      { ar: "يوم", name: { en: "Saudi ō", najdi: "ō السعودية" }, text: { en: "yōm — aw becomes ō", najdi: "yōm — aw تصير ō" } },
    ],
  },
  {
    title: { en: "Four extras", najdi: "الأربع الإضافية" },
    intro: {
      en: "Not full letters, but everywhere. The plan covers them on Day 13.",
      najdi: "مو حروف كاملة، بس موجودة بكل مكان. الخطة تغطيها في اليوم 13.",
    },
    rows: [
      { ar: "ء", name: { en: "hamza", najdi: "همزة" }, text: { en: "A catch in the throat, like the break in uh-oh.", najdi: "وقفة في الحلق، مثل الوقفة في uh-oh." } },
      { ar: "ة", name: { en: "tāʾ marbūṭa", najdi: "تاء مربوطة" }, text: { en: "Word-ending -a, as in قهوة gahwa.", najdi: "آخر الكلمة -a، مثل «قهوة» gahwa." } },
      { ar: "ى", name: { en: "alif maqṣūra", najdi: "ألف مقصورة" }, text: { en: "Also a word-ending -a, as in أبغى abgha.", najdi: "بعد آخر الكلمة -a، مثل «أبغى» abgha." } },
      { ar: "لا", name: { en: "lām-alif", najdi: "لام ألف" }, text: { en: "ل + ا always fuse into this shape. It means “no”.", najdi: "ل + ا دايم يلتصقون بهالشكل. ومعناها «لا»." } },
    ],
  },
];
