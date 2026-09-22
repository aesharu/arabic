// Her words: what she has taught him herself — the real thing, so they carry no "check with tutor" flag.
// Shown first on the Phrases page and as the Cards deck "hers" (open from Day 1). Add each new one she teaches here.
// Every text in four languages: ar (as she says it), say (pronunciation), en, uk, msa, note?.
export const HER_WORDS = [
  { ar: "سلام", say: "salām", en: "hi — short for السلام عليكم (lit. “peace”)", uk: "привіт — коротко від السلام عليكم (досл. «мир»)", msa: "السلام عليكم" },
  { ar: "شخبارك؟", say: "shakhbārik?", en: "how are you? what's new? (lit. “what's your news?”)", uk: "як ти? що нового? (досл. «які твої новини?»)", msa: "ما أخبارك؟" },
  { ar: "شلونك؟", say: "shlōnik?", en: "how are you? (lit. “what's your color?”)", uk: "як ти? (досл. «який твій колір?»)", msa: "كيف حالك؟",
    note: { en: "In Riyadh also وش لونك wesh lōnik.", uk: "У Ер-Ріяді також وش لونك wesh lōnik.", najdi: "أهل الرياض يقولون بعد: وش لونك.", msa: "ويقول أهل الرياض أيضًا: وش لونك." } },
  { ar: "بخير", say: "bkhēr", en: "I'm fine", uk: "я в порядку", msa: "أنا بخير" },
  { ar: "مو بخير", say: "mū bkhēr", en: "not good, bad", uk: "не дуже, погано", msa: "لستُ بخير",
    note: { en: "مو mū = not. In Riyadh you'll also hear مب mub.", uk: "مو mū = не. В Ер-Ріяді також кажуть مب mub.", najdi: "مو يعني مب — أهل الرياض يقولون مب.", msa: "«مو» بمعنى «ليس»، ويقول أهل الرياض «مب»." } },
  { ar: "زين", say: "zēn", en: "good, okay — also to praise something, like food", uk: "добре, нормально — а ще щоб похвалити щось, наприклад їжу", msa: "جيّد" },
  { ar: "زينة", say: "zēna", en: "good (about something feminine)", uk: "добра (про щось жіночого роду)", msa: "جيّدة" },
  { ar: "اسمي فولودكا", say: "ismi Folodka", en: "my name is Volodka", uk: "мене звати Володька", msa: "اسمي فولودكا",
    note: { en: "Arabic has no “v” sound: ف (f) stands in for it.", uk: "В арабській немає звуку «в»: замість нього ف (ф).", najdi: "ما فيه حرف V بالعربي، نكتبه ف.", msa: "لا يوجد صوت V في العربية، فيُكتب فاءً." } },
  { ar: "أنا من أوكرانيا", say: "ana min Ukrānya", en: "I'm from Ukraine", uk: "я з України", msa: "أنا من أوكرانيا" },
];

// Rude words — to recognize, never to say. level: "rude" or "very rude". taught = she taught it; the others are
// common ones, flagged until she confirms them.
export const RUDE = [
  { ar: "شرموط / شرموطة", say: "sharmūṭ / sharmūṭa", en: "a very vulgar insult (like “whore”) — never say it", uk: "дуже вульгарна образа (на кшталт «повія») — ніколи не кажи", msa: "شتيمة فاحشة", level: "very rude", taught: true },
  { ar: "يا بنت الكلب", say: "ya bint il-kalb", en: "“daughter of a dog” — an insult", uk: "«доньку собаки» — образа", msa: "يا بنت الكلب", level: "very rude", taught: true },
  { ar: "يا ابن الكلب", say: "ya ibn il-kalb", en: "“son of a dog” — an insult", uk: "«сину собаки» — образа", msa: "يا ابن الكلب", level: "very rude", taught: true },
  { ar: "يا حمار", say: "ya ḥmār", en: "“you donkey” — you idiot", uk: "«ти осел» — дурень", msa: "يا أحمق", level: "rude" },
  { ar: "يا غبي", say: "ya ghabi", en: "you stupid", uk: "дурню", msa: "يا غبيّ", level: "rude" },
  { ar: "انقلع", say: "inglaʿ", en: "get lost!", uk: "забирайся геть!", msa: "اغرُب عن وجهي", level: "rude" },
  { ar: "اسكت", say: "iskut", en: "shut up (to a man)", uk: "замовкни (до чоловіка)", msa: "اسكت", level: "rude" },
  { ar: "يا ثقل دمك", say: "ya thigil dammik", en: "you're so annoying (lit. “how heavy your blood is”) — often joking", uk: "який ти нестерпний (досл. «яка важка в тебе кров») — часто жартома", msa: "ما أثقل ظلّك", level: "rude" },
];

const fnv = s => {
  let h = 0x811c9dc5;
  for (const ch of s) h = Math.imul(h ^ ch.codePointAt(0), 0x01000193) >>> 0;
  return h.toString(36);
};
// Ids follow the Arabic, so a card keeps its progress when words are added.
for (const w of HER_WORDS) w.id = `hw.${fnv(w.ar)}`;
for (const w of RUDE) w.id = `rw.${fnv(w.ar)}`;
