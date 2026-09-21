// Each row: { ar, name, text }. Names and texts are in four languages: { en, uk, najdi, msa }.
export const VOWEL_SECTIONS = [
  {
    title: { en: "Short vowels", uk: "Короткі голосні", najdi: "الحركات القصيرة", msa: "الحركات القصيرة" },
    intro: {
      en: "Small marks above or below a letter. Practise with them now — everyday writing leaves them out, so later you'll read without them.",
      uk: "Маленькі знаки над або під літерою. Тренуйся з ними зараз — у звичайному письмі їх пропускають, тож згодом читатимеш без них.",
      najdi: "علامات صغيرة فوق الحرف أو تحته. تدرّب عليها الحين — الكتابة العادية ما تحطها، فبعدين بتقرا بدونها.",
      msa: "علامات صغيرة فوق الحرف أو تحته. تدرّب عليها الآن، فالكتابة المعتادة تُسقطها، وستقرأ لاحقًا بدونها.",
    },
    rows: [
      { ar: "بَ", name: { en: "fatḥa", uk: "фатха", najdi: "فتحة", msa: "الفتحة" }, text: { en: "ba — short a", uk: "ba — коротке а", najdi: "ba — فتحة قصيرة", msa: "ba — فتحة قصيرة" } },
      { ar: "بِ", name: { en: "kasra", uk: "касра", najdi: "كسرة", msa: "الكسرة" }, text: { en: "bi — short i", uk: "bi — коротке і", najdi: "bi — كسرة قصيرة", msa: "bi — كسرة قصيرة" } },
      { ar: "بُ", name: { en: "ḍamma", uk: "дамма", najdi: "ضمة", msa: "الضمة" }, text: { en: "bu — short u", uk: "bu — коротке у", najdi: "bu — ضمة قصيرة", msa: "bu — ضمة قصيرة" } },
      { ar: "بْ", name: { en: "sukūn", uk: "сукун", najdi: "سكون", msa: "السكون" }, text: { en: "b — no vowel at all", uk: "b — зовсім без голосної", najdi: "b — بدون حركة أبد", msa: "b — بلا حركة" } },
      { ar: "بّ", name: { en: "shadda", uk: "шадда", najdi: "شدة", msa: "الشدّة" }, text: { en: "bb — say the letter twice as long", uk: "bb — вимовляй літеру вдвічі довше", najdi: "bb — طوّل الحرف مرتين", msa: "bb — انطق الحرف مضعّفًا" } },
    ],
  },
  {
    title: { en: "Long vowels", uk: "Довгі голосні", najdi: "حروف المد", msa: "حروف المدّ" },
    intro: {
      en: "Three letters double as long vowels.",
      uk: "Три літери також позначають довгі голосні.",
      najdi: "ثلاث حروف تشتغل بعد كحروف مد.",
      msa: "ثلاثة حروف تؤدي أيضًا وظيفة حروف المدّ.",
    },
    rows: [
      { ar: "بَا", name: { en: "alif", uk: "аліф", najdi: "ألف", msa: "الألف" }, text: { en: "bā — long a", uk: "bā — довге а", najdi: "bā — ألف ممدودة", msa: "bā — مدّ بالألف" } },
      { ar: "بِي", name: { en: "yāʾ", uk: "йа", najdi: "ياء", msa: "الياء" }, text: { en: "bī — long i", uk: "bī — довге і", najdi: "bī — ياء ممدودة", msa: "bī — مدّ بالياء" } },
      { ar: "بُو", name: { en: "wāw", uk: "вав", najdi: "واو", msa: "الواو" }, text: { en: "bū — long u", uk: "bū — довге у", najdi: "bū — واو ممدودة", msa: "bū — مدّ بالواو" } },
      { ar: "زين", name: { en: "Najdi ē", uk: "наджді ē", najdi: "ē النجدية", msa: "ē في النجدية" }, text: { en: "zēn — ay becomes ē", uk: "zēn — ay стає ē", najdi: "zēn — ay تصير ē", msa: "zēn — تتحول ay إلى ē" } },
      { ar: "يوم", name: { en: "Najdi ō", uk: "наджді ō", najdi: "ō النجدية", msa: "ō في النجدية" }, text: { en: "yōm — aw becomes ō", uk: "yōm — aw стає ō", najdi: "yōm — aw تصير ō", msa: "yōm — تتحول aw إلى ō" } },
    ],
  },
  {
    title: { en: "Four extras", uk: "Чотири додаткові знаки", najdi: "الأربع الإضافية", msa: "العلامات الأربع الإضافية" },
    intro: {
      en: "Not full letters, but everywhere. The plan covers them on Day 13.",
      uk: "Не повноцінні літери, але трапляються всюди. У плані вони припадають на 13-й день.",
      najdi: "مو حروف كاملة، بس موجودة بكل مكان. الخطة تغطيها في اليوم 13.",
      msa: "ليست حروفًا كاملة لكنها في كل مكان، وتتناولها الخطة في اليوم 13.",
    },
    rows: [
      { ar: "ء", name: { en: "hamza", uk: "хамза", najdi: "همزة", msa: "الهمزة" }, text: { en: "A catch in the throat, like the break in uh-oh.", uk: "Коротка зупинка в горлі, як пауза в англ. uh-oh.", najdi: "وقفة في الحلق، مثل الوقفة في uh-oh.", msa: "وقفة حنجرية كالتي في uh-oh." } },
      { ar: "ة", name: { en: "tāʾ marbūṭa", uk: "та марбута", najdi: "تاء مربوطة", msa: "التاء المربوطة" }, text: { en: "Word-ending -a, as in قهوة gahwa.", uk: "Закінчення -a, як у قهوة gahwa.", najdi: "آخر الكلمة -a، مثل «قهوة» gahwa.", msa: "تُنطق -a في آخر الكلمة، كما في «قهوة» gahwa." } },
      { ar: "ى", name: { en: "alif maqṣūra", uk: "аліф максура", najdi: "ألف مقصورة", msa: "الألف المقصورة" }, text: { en: "Also a word-ending -a, as in أبغى abgha.", uk: "Теж закінчення -a, як у أبغى abgha.", najdi: "بعد آخر الكلمة -a، مثل «أبغى» abgha.", msa: "تُنطق أيضًا -a في آخر الكلمة، كما في «أبغى» abgha." } },
      { ar: "لا", name: { en: "lām-alif", uk: "лям-аліф", najdi: "لام ألف", msa: "اللام ألف" }, text: { en: "ل + ا always fuse into this shape. It means “no”.", uk: "ل + ا завжди зливаються в цю форму. Означає «ні».", najdi: "ل + ا دايم يلتصقون بهالشكل. ومعناها «لا».", msa: "تندمج اللام والألف دائمًا في هذا الشكل، ومعناها «لا»." } },
    ],
  },
];
