// Her words: what she has taught him herself — the real thing, so they carry no "check with tutor" flag.
// Shown first on the Phrases page and as the Cards deck "hers" (open from Day 1). Add each new one she teaches here.
// Every text: ar (as she says it), say (pronunciation), en, note?.
export const HER_WORDS = [
  { ar: "سلام", say: "salām", en: "hi — short for السلام عليكم (lit. “peace”)" },
  { ar: "شخبارك؟", say: "shakhbārik?", en: "how are you? what's new? (lit. “what's your news?”)" },
  { ar: "شلونك؟", say: "shlōnik?", en: "how are you? (lit. “what's your color?”)",
    note: { en: "In Riyadh also وش لونك wesh lōnik.", najdi: "أهل الرياض يقولون بعد: وش لونك." } },
  { ar: "بخير", say: "bkhēr", en: "I'm fine" },
  { ar: "مو بخير", say: "mū bkhēr", en: "not good, bad",
    note: { en: "مو mū = not. In Riyadh you'll also hear مب mub.", najdi: "مو يعني مب — أهل الرياض يقولون مب." } },
  { ar: "زين", say: "zēn", en: "good, okay — also to praise something, like food" },
  { ar: "زينة", say: "zēna", en: "good (about something feminine)" },
  { ar: "اسمي فولودكا", say: "ismi Folodka", en: "my name is Volodka",
    note: { en: "Arabic has no “v” sound: ف (f) stands in for it.", najdi: "ما فيه حرف V بالعربي، نكتبه ف." } },
  { ar: "أنا من أوكرانيا", say: "ana min Ukrānya", en: "I'm from Ukraine" },
];

// Rude words — to recognize, never to say. level: "rude" or "very rude". taught = she taught it; the others are
// common ones, flagged until she confirms them.
export const RUDE = [
  { ar: "شرموط / شرموطة", say: "sharmūṭ / sharmūṭa", en: "a very vulgar insult (like “whore”) — never say it", level: "very rude", taught: true },
  { ar: "يا بنت الكلب", say: "ya bint il-kalb", en: "“daughter of a dog” — an insult", level: "very rude", taught: true },
  { ar: "يا ابن الكلب", say: "ya ibn il-kalb", en: "“son of a dog” — an insult", level: "very rude", taught: true },
  { ar: "يا حمار", say: "ya ḥmār", en: "“you donkey” — you idiot", level: "rude" },
  { ar: "يا غبي", say: "ya ghabi", en: "you stupid", level: "rude" },
  { ar: "انقلع", say: "inglaʿ", en: "get lost!", level: "rude" },
  { ar: "اسكت", say: "iskut", en: "shut up (to a man)", level: "rude" },
  { ar: "يا ثقل دمك", say: "ya thigil dammik", en: "you're so annoying (lit. “how heavy your blood is”) — often joking", level: "rude" },
];

const fnv = s => {
  let h = 0x811c9dc5;
  for (const ch of s) h = Math.imul(h ^ ch.codePointAt(0), 0x01000193) >>> 0;
  return h.toString(36);
};
// Ids follow the Arabic, so a card keeps its progress when words are added.
for (const w of HER_WORDS) w.id = `hw.${fnv(w.ar)}`;
for (const w of RUDE) w.id = `rw.${fnv(w.ar)}`;
