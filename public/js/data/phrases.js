// Phrases for the two Script weeks — three a day, so you speak from Day 1.
// Every phrase is in four languages:
//   ar + tr   Najdi Arabic and its pronunciation — copied from NAJDI-PLAN.md (Parts 6–7)
//   en        English meaning — from the plan
//   uk        Ukrainian meaning
// note {en, najdi} comes from the plan's Note column. check = marked ⚠ in the plan.
// speak = what the voice reads, when ar has a slash or "…".
// tests/content.test.mjs checks every ar/tr against the plan and that no language is missing.
export const PHRASES = [
  { day: 1, ar: "السلام عليكم", tr: "as-salāmu ʿalēkum", en: "hello" },
  { day: 1, ar: "وعليكم السلام", tr: "wa ʿalēkum as-salām", en: "the reply" },
  { day: 1, ar: "هلا والله", tr: "hala wallah", en: "hi!!", note: { en: "Warm", najdi: "ترحيب دافي" } },

  { day: 2, ar: "كيفك؟", tr: "kēfik?", en: "how are you?", note: { en: "To her; to him it's kēfak", najdi: "لها؛ وله تنقال kēfak" } },
  { day: 2, ar: "الحمد لله", tr: "al-ḥamdu lillāh", en: "good, thank God", note: { en: "Standard answer", najdi: "الرد المعتاد" } },
  { day: 2, ar: "بخير", tr: "bikhēr", en: "fine" },

  { day: 3, ar: "شلونك؟", tr: "shlōnik?", en: "how are you?", note: { en: "Her word, lit. “what's your colour”; older Riyadh speech: وش لونك", najdi: "كلمتها، حرفيًا «وش لونك»؛ أهل الرياض زمان يقولون: وش لونك" } },
  { day: 3, ar: "صباح الخير", tr: "ṣabāḥ al-khēr", en: "good morning" },
  { day: 3, ar: "صباح النور", tr: "ṣabāḥ an-nūr", en: "the reply" },

  { day: 4, ar: "تسلمين", tr: "tislamīn", en: "thanks", note: { en: "To her", najdi: "لها" } },
  { day: 4, ar: "تسلم", tr: "tislam", en: "thanks", note: { en: "To him — what she'll say to you", najdi: "له — هي بتقولها لك" } },
  { day: 4, ar: "الله يسلمك", tr: "allah yisallimik", en: "reply to thanks" },

  { day: 5, ar: "مساء الخير", tr: "masāʾ al-khēr", en: "good evening" },
  { day: 5, ar: "مساء النور", tr: "masāʾ an-nūr", en: "the reply" },
  { day: 5, ar: "مع السلامة", tr: "maʿ as-salāma", en: "bye" },

  { day: 6, ar: "مدري", tr: "madri", en: "dunno" },
  { day: 6, ar: "ما فهمت", tr: "ma fhimt", en: "I didn't understand" },
  { day: 6, ar: "شوي شوي", tr: "shwayy shwayy", en: "slowly, please" },

  { day: 7, ar: "إيه", tr: "ēh", en: "yes", check: true,
    checkNote: { en: "Careful: in Egyptian إيه means “what”", najdi: "انتبه: بالمصري «إيه» يعني «وش»" } },
  { day: 7, ar: "لا", tr: "la", en: "no" },
  { day: 7, ar: "زين", tr: "zēn", en: "good, okay" },

  { day: 8, ar: "طيب / طب", speak: "طيب", tr: "ṭayyib / ṭab", en: "okay, well" },
  { day: 8, ar: "والله؟", tr: "wallah?", en: "really?" },
  { day: 8, ar: "عادي", tr: "ʿādi", en: "normal, it's fine", note: { en: "Hugely common", najdi: "منتشرة مرة" } },

  { day: 9, ar: "معليش", tr: "maʿlēsh", en: "sorry / never mind" },
  { day: 9, ar: "ما عليه", tr: "ma ʿalēh", en: "it's okay" },
  { day: 9, ar: "ولا يهمك", tr: "wala yhimmik", en: "no worries" },

  { day: 10, ar: "وش تسوين؟", tr: "wesh tsawwīn?", en: "what are you doing?", note: { en: "To her", najdi: "لها" } },
  { day: 10, ar: "وينك؟", tr: "wēnik?", en: "where are you?", note: { en: "To her", najdi: "لها" } },
  { day: 10, ar: "الحين", tr: "al-ḥīn", en: "now" },

  { day: 11, ar: "إن شاء الله", tr: "in shāʾ allah", en: "hopefully / I will" },
  { day: 11, ar: "ما شاء الله", tr: "mā shāʾ allah", en: "wow, great", note: { en: "Praise that also wards off the evil eye", najdi: "مدح ويحمي من العين بعد" } },
  { day: 11, ar: "يلا", tr: "yalla", en: "come on, let's go" },

  { day: 12, ar: "تصبحين على خير", tr: "tiṣbiḥīn ʿala khēr", en: "good night", note: { en: "To her", najdi: "لها" } },
  { day: 12, ar: "وانتي من أهله", tr: "w inti min ahlah", en: "reply to good night", note: { en: "To her; she says وانت to you", najdi: "لها؛ وهي تقول لك «وانت»" } },
  { day: 12, ar: "في أمان الله", tr: "fi amān allah", en: "bye (warm)" },

  { day: 13, ar: "كيف أقول…؟", speak: "كيف أقول", tr: "kēf agūl…?", en: "how do I say …?", note: { en: "Your most useful sentence", najdi: "أنفع جملة عندك" } },
  { day: 13, ar: "وش معنى…؟", speak: "وش معنى", tr: "wesh maʿna…?", en: "what does … mean?" },
  { day: 13, ar: "عيدي", tr: "ʿīdi", en: "say it again", note: { en: "To her", najdi: "لها" } },

  { day: 14, ar: "الله يعطيك العافية", tr: "allah yiʿṭīk al-ʿāfya", en: "“God give you strength”", note: { en: "When she's worked or done something", najdi: "لما تشتغل أو تسوي شي" } },
  { day: 14, ar: "الله يعافيك", tr: "allah yʿāfīk", en: "reply" },
  { day: 14, ar: "أبشر / أبشري", speak: "أبشري", tr: "abshir / abshiri", en: "consider it done (to him / to her)", note: { en: "Very Saudi", najdi: "سعودية مرة" } },
];
