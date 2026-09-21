// Phrases for the two Script weeks — three a day, so you speak from Day 1.
// ar / tr / en / note are copied from NAJDI-PLAN.md (Parts 6 and 7); tests/content.test.mjs checks that
// every ar and tr still appears there. ua is the Ukrainian meaning. speak = what the voice reads,
// when ar has a slash or "…". check = marked ⚠ in the plan.
export const PHRASES = [
  { day: 1, ar: "السلام عليكم", tr: "as-salāmu ʿalēkum", en: "hello", ua: "привіт (досл. «мир вам»)" },
  { day: 1, ar: "وعليكم السلام", tr: "wa ʿalēkum as-salām", en: "the reply", ua: "відповідь: «і вам мир»" },
  { day: 1, ar: "هلا والله", tr: "hala wallah", en: "hi!!", ua: "приві-іт!", note: "Warm" },

  { day: 2, ar: "كيفك؟", tr: "kēfik?", en: "how are you?", ua: "як ти?", note: "Same to him and her" },
  { day: 2, ar: "الحمد لله", tr: "al-ḥamdu lillāh", en: "good, thank God", ua: "добре, слава Богу", note: "Standard answer" },
  { day: 2, ar: "بخير", tr: "bikhēr", en: "fine", ua: "добре" },

  { day: 3, ar: "وش لونك؟", tr: "wesh lōnik?", en: "how are you?", ua: "як ти?", note: "Najdi classic, lit. “what's your colour”" },
  { day: 3, ar: "صباح الخير", tr: "ṣabāḥ al-khēr", en: "good morning", ua: "доброго ранку" },
  { day: 3, ar: "صباح النور", tr: "ṣabāḥ an-nūr", en: "the reply", ua: "відповідь на «доброго ранку»" },

  { day: 4, ar: "تسلمين", tr: "tislamīn", en: "thanks", ua: "дякую (до неї)", note: "To her" },
  { day: 4, ar: "تسلم", tr: "tislam", en: "thanks", ua: "дякую (до нього)", note: "To him — what she'll say to you" },
  { day: 4, ar: "الله يسلمك", tr: "allah yisallimik", en: "reply to thanks", ua: "відповідь на подяку" },

  { day: 5, ar: "مساء الخير", tr: "masāʾ al-khēr", en: "good evening", ua: "добрий вечір" },
  { day: 5, ar: "مساء النور", tr: "masāʾ an-nūr", en: "the reply", ua: "відповідь на «добрий вечір»" },
  { day: 5, ar: "مع السلامة", tr: "maʿ as-salāma", en: "bye", ua: "бувай" },

  { day: 6, ar: "مدري", tr: "madri", en: "dunno", ua: "не знаю" },
  { day: 6, ar: "ما فهمت", tr: "ma fhimt", en: "I didn't understand", ua: "я не зрозумів(-ла)" },
  { day: 6, ar: "شوي شوي", tr: "shwayy shwayy", en: "slowly, please", ua: "повільніше, будь ласка" },

  { day: 7, ar: "إيه", tr: "ēh", en: "yes", ua: "так", check: true, checkNote: "Careful: in Egyptian إيه means “what”" },
  { day: 7, ar: "لا", tr: "la", en: "no", ua: "ні" },
  { day: 7, ar: "زين", tr: "zēn", en: "good, okay", ua: "добре, гаразд" },

  { day: 8, ar: "طيب / طب", speak: "طيب", tr: "ṭayyib / ṭab", en: "okay, well", ua: "окей, ну" },
  { day: 8, ar: "والله؟", tr: "wallah?", en: "really?", ua: "справді?" },
  { day: 8, ar: "عادي", tr: "ʿādi", en: "normal, it's fine", ua: "нормально, все гаразд", note: "Hugely common" },

  { day: 9, ar: "معليش", tr: "maʿlēsh", en: "sorry / never mind", ua: "вибач / нічого страшного" },
  { day: 9, ar: "ما عليه", tr: "ma ʿalēh", en: "it's okay", ua: "все гаразд" },
  { day: 9, ar: "ولا يهمك", tr: "wala yhimmik", en: "no worries", ua: "не переймайся" },

  { day: 10, ar: "وش تسوين؟", tr: "wesh tsawwīn?", en: "what are you doing?", ua: "що робиш? (до неї)", note: "To her" },
  { day: 10, ar: "وينك؟", tr: "wēnik?", en: "where are you?", ua: "де ти?" },
  { day: 10, ar: "الحين", tr: "al-ḥīn", en: "now", ua: "зараз" },

  { day: 11, ar: "إن شاء الله", tr: "in shāʾ allah", en: "hopefully / I will", ua: "сподіваюсь / якщо Бог дасть" },
  { day: 11, ar: "ما شاء الله", tr: "mā shāʾ allah", en: "wow, great", ua: "ого, чудово", note: "Praise that also wards off the evil eye" },
  { day: 11, ar: "يلا", tr: "yalla", en: "come on, let's go", ua: "давай, ходімо" },

  { day: 12, ar: "تصبحين على خير", tr: "tiṣbiḥīn ʿala khēr", en: "good night", ua: "на добраніч (до неї)", note: "To her" },
  { day: 12, ar: "وانتي من أهله", tr: "w inti min ahlah", en: "reply to good night", ua: "відповідь на «на добраніч»", note: "To her; she says وانت to you" },
  { day: 12, ar: "في أمان الله", tr: "fi amān allah", en: "bye (warm)", ua: "бувай (тепло)" },

  { day: 13, ar: "كيف أقول…؟", speak: "كيف أقول", tr: "kēf agūl…?", en: "how do I say …?", ua: "як сказати …?", note: "Your most useful sentence" },
  { day: 13, ar: "وش معنى…؟", speak: "وش معنى", tr: "wesh maʿna…?", en: "what does … mean?", ua: "що означає …?" },
  { day: 13, ar: "عيدي", tr: "ʿīdi", en: "say it again", ua: "повтори (до неї)", note: "To her" },

  { day: 14, ar: "الله يعطيك العافية", tr: "allah yiʿṭīk al-ʿāfya", en: "“God give you strength”", ua: "«дай Боже сили»", note: "When she's worked or done something" },
  { day: 14, ar: "الله يعافيك", tr: "allah yʿāfīk", en: "reply", ua: "відповідь" },
  { day: 14, ar: "أبشر / أبشري", speak: "أبشري", tr: "abshir / abshiri", en: "consider it done (to him / to her)", ua: "вважай, що зроблено (до нього / до неї)", note: "Very Saudi" },
];
