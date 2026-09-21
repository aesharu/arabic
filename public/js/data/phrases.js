// Phrases for the two Script weeks — three a day, so you speak from Day 1.
// Every phrase is in four languages:
//   ar + tr   Najdi Arabic and its pronunciation — copied from NAJDI-PLAN.md (Parts 6–7)
//   msa       the formal-Arabic (MSA) equivalent, for recognising, not for saying
//   en        English meaning — from the plan
//   uk        Ukrainian meaning
// note {en, uk, najdi, msa} comes from the plan's Note column. check = marked ⚠ in the plan.
// speak = what the voice reads, when ar has a slash or "…".
// tests/content.test.mjs checks every ar/tr against the plan and that no language is missing.
export const PHRASES = [
  { day: 1, ar: "السلام عليكم", tr: "as-salāmu ʿalēkum", msa: "السلام عليكم", en: "hello", uk: "привіт (досл. «мир вам»)" },
  { day: 1, ar: "وعليكم السلام", tr: "wa ʿalēkum as-salām", msa: "وعليكم السلام", en: "the reply", uk: "відповідь: «і вам мир»" },
  { day: 1, ar: "هلا والله", tr: "hala wallah", msa: "أهلاً وسهلاً", en: "hi!!", uk: "приві-іт!", note: { en: "Warm", uk: "Тепле привітання", najdi: "ترحيب دافي", msa: "تحية حارّة" } },

  { day: 2, ar: "كيفك؟", tr: "kēfik?", msa: "كيف حالك؟", en: "how are you?", uk: "як ти?", note: { en: "Same to him and her", uk: "Однаково до нього й до неї", najdi: "نفسها له ولها", msa: "بالصيغة نفسها للمذكر والمؤنث" } },
  { day: 2, ar: "الحمد لله", tr: "al-ḥamdu lillāh", msa: "الحمد لله", en: "good, thank God", uk: "добре, слава Богу", note: { en: "Standard answer", uk: "Стандартна відповідь", najdi: "الرد المعتاد", msa: "الرد المعتاد" } },
  { day: 2, ar: "بخير", tr: "bikhēr", msa: "بخير", en: "fine", uk: "добре" },

  { day: 3, ar: "وش لونك؟", tr: "wesh lōnik?", msa: "كيف حالك؟", en: "how are you?", uk: "як ти?", note: { en: "Najdi classic, lit. “what's your colour”", uk: "Класика наджді, досл. «який твій колір»", najdi: "نجدية أصيلة، حرفيًا «وش لونك»", msa: "عبارة نجدية أصيلة، معناها الحرفي «ما لونك»" } },
  { day: 3, ar: "صباح الخير", tr: "ṣabāḥ al-khēr", msa: "صباح الخير", en: "good morning", uk: "доброго ранку" },
  { day: 3, ar: "صباح النور", tr: "ṣabāḥ an-nūr", msa: "صباح النور", en: "the reply", uk: "відповідь на «доброго ранку»" },

  { day: 4, ar: "تسلمين", tr: "tislamīn", msa: "شكراً لكِ", en: "thanks", uk: "дякую (до неї)", note: { en: "To her", uk: "До неї", najdi: "لها", msa: "لمخاطبة المؤنث" } },
  { day: 4, ar: "تسلم", tr: "tislam", msa: "شكراً لكَ", en: "thanks", uk: "дякую (до нього)", note: { en: "To him — what she'll say to you", uk: "До нього — так вона казатиме тобі", najdi: "له — هي بتقولها لك", msa: "لمخاطبة المذكر — ستقولها هي لك" } },
  { day: 4, ar: "الله يسلمك", tr: "allah yisallimik", msa: "عفواً", en: "reply to thanks", uk: "відповідь на подяку" },

  { day: 5, ar: "مساء الخير", tr: "masāʾ al-khēr", msa: "مساء الخير", en: "good evening", uk: "добрий вечір" },
  { day: 5, ar: "مساء النور", tr: "masāʾ an-nūr", msa: "مساء النور", en: "the reply", uk: "відповідь на «добрий вечір»" },
  { day: 5, ar: "مع السلامة", tr: "maʿ as-salāma", msa: "مع السلامة", en: "bye", uk: "бувай" },

  { day: 6, ar: "مدري", tr: "madri", msa: "لا أدري", en: "dunno", uk: "не знаю" },
  { day: 6, ar: "ما فهمت", tr: "ma fhimt", msa: "لم أفهم", en: "I didn't understand", uk: "я не зрозумів(-ла)" },
  { day: 6, ar: "شوي شوي", tr: "shwayy shwayy", msa: "ببطء من فضلك", en: "slowly, please", uk: "повільніше, будь ласка" },

  { day: 7, ar: "إيه", tr: "ēh", msa: "نعم", en: "yes", uk: "так", check: true,
    checkNote: { en: "Careful: in Egyptian إيه means “what”", uk: "Обережно: у єгипетській إيه означає «що»", najdi: "انتبه: بالمصري «إيه» يعني «وش»", msa: "انتبه: «إيه» في المصرية تعني «ماذا»" } },
  { day: 7, ar: "لا", tr: "la", msa: "لا", en: "no", uk: "ні" },
  { day: 7, ar: "زين", tr: "zēn", msa: "جيد", en: "good, okay", uk: "добре, гаразд" },

  { day: 8, ar: "طيب / طب", speak: "طيب", tr: "ṭayyib / ṭab", msa: "حسناً", en: "okay, well", uk: "окей, ну" },
  { day: 8, ar: "والله؟", tr: "wallah?", msa: "حقاً؟", en: "really?", uk: "справді?" },
  { day: 8, ar: "عادي", tr: "ʿādi", msa: "لا بأس", en: "normal, it's fine", uk: "нормально, все гаразд", note: { en: "Hugely common", uk: "Дуже поширене", najdi: "منتشرة مرة", msa: "شائعة جدًا" } },

  { day: 9, ar: "معليش", tr: "maʿlēsh", msa: "آسف / لا عليك", en: "sorry / never mind", uk: "вибач / нічого страшного" },
  { day: 9, ar: "ما عليه", tr: "ma ʿalēh", msa: "لا بأس", en: "it's okay", uk: "все гаразд" },
  { day: 9, ar: "ولا يهمك", tr: "wala yhimmik", msa: "لا تقلق", en: "no worries", uk: "не переймайся" },

  { day: 10, ar: "وش تسوين؟", tr: "wesh tsawwīn?", msa: "ماذا تفعلين؟", en: "what are you doing?", uk: "що ти робиш?", note: { en: "To her", uk: "До неї", najdi: "لها", msa: "لمخاطبة المؤنث" } },
  { day: 10, ar: "وينك؟", tr: "wēnik?", msa: "أين أنتِ؟", en: "where are you?", uk: "де ти?", note: { en: "To her", uk: "До неї", najdi: "لها", msa: "لمخاطبة المؤنث" } },
  { day: 10, ar: "الحين", tr: "al-ḥīn", msa: "الآن", en: "now", uk: "зараз" },

  { day: 11, ar: "إن شاء الله", tr: "in shāʾ allah", msa: "إن شاء الله", en: "hopefully / I will", uk: "сподіваюсь / якщо Бог дасть" },
  { day: 11, ar: "ما شاء الله", tr: "mā shāʾ allah", msa: "ما شاء الله", en: "wow, great", uk: "ого, чудово", note: { en: "Praise that also wards off the evil eye", uk: "Похвала, яка ще й захищає від пристріту", najdi: "مدح ويحمي من العين بعد", msa: "مديح يقي من العين أيضًا" } },
  { day: 11, ar: "يلا", tr: "yalla", msa: "هيا", en: "come on, let's go", uk: "давай, ходімо" },

  { day: 12, ar: "تصبحين على خير", tr: "tiṣbiḥīn ʿala khēr", msa: "تصبحين على خير", en: "good night", uk: "на добраніч", note: { en: "To her", uk: "До неї", najdi: "لها", msa: "لمخاطبة المؤنث" } },
  { day: 12, ar: "وانتي من أهله", tr: "w inti min ahlah", msa: "وأنتِ من أهله", en: "reply to good night", uk: "відповідь на «на добраніч»", note: { en: "To her; she says وانت to you", uk: "До неї; тобі вона скаже وانت", najdi: "لها؛ وهي تقول لك «وانت»", msa: "لمخاطبة المؤنث؛ وتقول لك هي «وأنت»" } },
  { day: 12, ar: "في أمان الله", tr: "fi amān allah", msa: "في أمان الله", en: "bye (warm)", uk: "бувай (тепло)" },

  { day: 13, ar: "كيف أقول…؟", speak: "كيف أقول", tr: "kēf agūl…?", msa: "كيف أقول…؟", en: "how do I say …?", uk: "як сказати …?", note: { en: "Your most useful sentence", uk: "Твоє найкорисніше речення", najdi: "أنفع جملة عندك", msa: "أنفع جملة لديك" } },
  { day: 13, ar: "وش معنى…؟", speak: "وش معنى", tr: "wesh maʿna…?", msa: "ما معنى…؟", en: "what does … mean?", uk: "що означає …?" },
  { day: 13, ar: "عيدي", tr: "ʿīdi", msa: "أعيدي من فضلك", en: "say it again", uk: "повтори", note: { en: "To her", uk: "До неї", najdi: "لها", msa: "لمخاطبة المؤنث" } },

  { day: 14, ar: "الله يعطيك العافية", tr: "allah yiʿṭīk al-ʿāfya", msa: "أعطاكِ الله العافية", en: "“God give you strength”", uk: "«дай Боже сили»", note: { en: "When she's worked or done something", uk: "Коли вона попрацювала чи щось зробила", najdi: "لما تشتغل أو تسوي شي", msa: "حين تعمل أو تنجز شيئًا" } },
  { day: 14, ar: "الله يعافيك", tr: "allah yʿāfīk", msa: "عافاك الله", en: "reply", uk: "відповідь" },
  { day: 14, ar: "أبشر / أبشري", speak: "أبشري", tr: "abshir / abshiri", msa: "حاضر", en: "consider it done (to him / to her)", uk: "вважай, що зроблено (до нього / до неї)", note: { en: "Very Saudi", uk: "Дуже по-саудівськи", najdi: "سعودية مرة", msa: "سعودية جدًا" } },
];
