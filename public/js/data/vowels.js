// Each row: { ar, name, text: { en, uk } }. The names are the Arabic terms, the same in both languages.
export const VOWEL_SECTIONS = [
  {
    title: { en: "Short vowels", uk: "Короткі голосні" },
    intro: {
      en: "Small marks above or below a letter. Practise with them now — everyday writing leaves them out, so later you'll read without them.",
      uk: "Маленькі знаки над або під літерою. Тренуйся з ними зараз — у звичайному письмі їх пропускають, тож згодом читатимеш без них.",
    },
    rows: [
      { ar: "بَ", name: "fatḥa", text: { en: "ba — short a", uk: "ba — коротке а" } },
      { ar: "بِ", name: "kasra", text: { en: "bi — short i", uk: "bi — коротке і" } },
      { ar: "بُ", name: "ḍamma", text: { en: "bu — short u", uk: "bu — коротке у" } },
      { ar: "بْ", name: "sukūn", text: { en: "b — no vowel at all", uk: "b — зовсім без голосної" } },
      { ar: "بّ", name: "shadda", text: { en: "bb — say the letter twice as long", uk: "bb — вимовляй літеру вдвічі довше" } },
    ],
  },
  {
    title: { en: "Long vowels", uk: "Довгі голосні" },
    intro: { en: "Three letters double as long vowels.", uk: "Три літери також позначають довгі голосні." },
    rows: [
      { ar: "بَا", name: "alif", text: { en: "bā — long a", uk: "bā — довге а" } },
      { ar: "بِي", name: "yāʾ", text: { en: "bī — long i", uk: "bī — довге і" } },
      { ar: "بُو", name: "wāw", text: { en: "bū — long u", uk: "bū — довге у" } },
      { ar: "زين", name: "Najdi ē", text: { en: "zēn — ay becomes ē", uk: "zēn — ay стає ē" } },
      { ar: "يوم", name: "Najdi ō", text: { en: "yōm — aw becomes ō", uk: "yōm — aw стає ō" } },
    ],
  },
  {
    title: { en: "Four extras", uk: "Чотири додаткові знаки" },
    intro: {
      en: "Not full letters, but everywhere. The plan covers them on Day 13.",
      uk: "Не повноцінні літери, але трапляються всюди. У плані вони припадають на 13-й день.",
    },
    rows: [
      { ar: "ء", name: "hamza", text: { en: "A catch in the throat, like the break in uh-oh.", uk: "Коротка зупинка в горлі, як пауза в англ. uh-oh." } },
      { ar: "ة", name: "tāʾ marbūṭa", text: { en: "Word-ending -a, as in قهوة gahwa.", uk: "Закінчення -a, як у قهوة gahwa." } },
      { ar: "ى", name: "alif maqṣūra", text: { en: "Also a word-ending -a, as in أبغى abgha.", uk: "Теж закінчення -a, як у أبغى abgha." } },
      { ar: "لا", name: "lām-alif", text: { en: "ل + ا always fuse into this shape. It means “no”.", uk: "ل + ا завжди зливаються в цю форму. Означає «ні»." } },
    ],
  },
];
