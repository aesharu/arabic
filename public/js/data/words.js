// Reading practice, in four languages:
//   ar + tr   Najdi Arabic and its pronunciation — copied from NAJDI-PLAN.md (Parts 5–6)
//   msa       the formal-Arabic (MSA) equivalent, for recognizing, not for saying
//   en        English meaning — from the plan
//   uk        Ukrainian meaning
// src: "alphabet" marks the two example words from the Letters page. check = marked ⚠ in the plan.
// The Reading page unlocks a word once you know all its letters.
export const WORDS = [
  // group 1 — ا ب ت ث ن ي
  { ar: "أنا", tr: "ana", msa: "أنا", en: "I", uk: "я" },
  { ar: "انت", tr: "int", msa: "أنتَ", en: "you (to a man)", uk: "ти (до чоловіка)" },
  { ar: "انتي", tr: "inti", msa: "أنتِ", en: "you (to a woman)", uk: "ти (до жінки)" },
  { ar: "بيت", tr: "bēt", msa: "بيت", en: "house, home", uk: "дім, оселя" },
  { ar: "بيتي", tr: "bēti", msa: "بيتي", en: "my house", uk: "мій дім" },
  { ar: "بيتنا", tr: "bētna", msa: "بيتنا", en: "our house", uk: "наш дім" },
  { ar: "بنت", tr: "bint", msa: "فتاة / ابنة", en: "girl, daughter", uk: "дівчина, донька" },
  { ar: "ثنين", tr: "thnēn", msa: "اثنان", en: "two", uk: "два" },
  { ar: "أبي", tr: "abi", msa: "أريد", en: "I want", uk: "я хочу" },
  { ar: "تبين", tr: "tibīn", msa: "تريدين", en: "you want (to her)", uk: "ти хочеш (до неї)" },
  { ar: "باب", tr: "bāb", msa: "باب", en: "door", uk: "двері", src: "alphabet" },

  // + group 2 — ج ح خ
  { ar: "حنا", tr: "ḥinna", msa: "نحن", en: "we", uk: "ми" },
  { ar: "أحب", tr: "aḥibb", msa: "أحب", en: "I love, like", uk: "я люблю, мені подобається" },
  { ar: "تحبين", tr: "tḥibbīn", msa: "تحبين", en: "you love, like (to her)", uk: "ти любиш (до неї)" },
  { ar: "أجي", tr: "aji", msa: "آتي", en: "I come", uk: "я приходжу" },
  { ar: "تجين", tr: "tijīn", msa: "تأتين", en: "you come (to her)", uk: "ти приходиш (до неї)" },
  { ar: "حبيبتي", tr: "ḥabībti", msa: "حبيبتي", en: "my love", uk: "кохана моя" },

  // + group 3 — د ذ ر ز و
  { ar: "وين", tr: "wēn", msa: "أين", en: "where", uk: "де" },
  { ar: "زين", tr: "zēn", msa: "جيد", en: "good, okay", uk: "добре, гаразд" },
  { ar: "أروح", tr: "arūḥ", msa: "أذهب", en: "I go", uk: "я йду" },
  { ar: "تروحين", tr: "tirūḥīn", msa: "تذهبين", en: "you go (to her)", uk: "ти йдеш (до неї)" },
  { ar: "بخير", tr: "bikhēr", msa: "بخير", en: "fine", uk: "добре" },
  { ar: "أبوي", tr: "abūy", msa: "أبي", en: "my dad", uk: "мій тато" },
  { ar: "أخوي", tr: "akhūy", msa: "أخي", en: "my brother", uk: "мій брат" },
  { ar: "بارد", tr: "bārid", msa: "بارد", en: "cold", uk: "холодний" },
  { ar: "حار", tr: "ḥārr", msa: "حار", en: "hot, spicy", uk: "гарячий, гострий" },
  { ar: "خبز", tr: "khubz", msa: "خبز", en: "bread", uk: "хліб" },
  { ar: "رز", tr: "rizz", msa: "أرز", en: "rice", uk: "рис" },
  { ar: "جديد", tr: "jidīd", msa: "جديد", en: "new", uk: "новий" },
  { ar: "دجاج", tr: "dijāj", msa: "دجاج", en: "chicken", uk: "курка" },

  // + group 4 — س ش ص ض
  { ar: "وش", tr: "wesh", msa: "ماذا", en: "what", uk: "що" },
  { ar: "بس", tr: "bass", msa: "لكن / فقط", en: "but / just / enough", uk: "але / просто / досить" },
  { ar: "شي", tr: "shay", msa: "شيء", en: "thing, something", uk: "річ, щось" },
  { ar: "شوي", tr: "shwayy", msa: "قليلاً", en: "a little", uk: "трохи" },
  { ar: "أشوف", tr: "ashūf", msa: "أرى", en: "I see", uk: "я бачу" },
  { ar: "تشوفين", tr: "tshūfīn", msa: "ترين", en: "you see (to her)", uk: "ти бачиш (до неї)" },
  { ar: "أسوي", tr: "asawwi", msa: "أفعل", en: "I do, make", uk: "я роблю" },
  { ar: "تسوين", tr: "tsawwīn", msa: "تفعلين", en: "you do, make (to her)", uk: "ти робиш (до неї)" },
  { ar: "وش تسوين؟", tr: "wesh tsawwīn?", msa: "ماذا تفعلين؟", en: "what are you doing? (to her)", uk: "що ти робиш? (до неї)" },

  // + group 5 — ط ظ ع غ
  { ar: "طيب", tr: "ṭayyib", msa: "حسناً", en: "okay, well", uk: "окей, ну" },
  { ar: "عادي", tr: "ʿādi", msa: "لا بأس", en: "normal, it's fine", uk: "нормально, все гаразд" },
  { ar: "تعبان", tr: "taʿbān", msa: "متعب", en: "tired", uk: "втомлений" },
  { ar: "عطشان", tr: "ʿaṭshān", msa: "عطشان", en: "thirsty", uk: "спраглий, хочу пити" },
  { ar: "غدا", tr: "ghada", msa: "غداء", en: "lunch — the main meal", uk: "обід — головна трапеза дня" },
  { ar: "عشا", tr: "ʿasha", msa: "عشاء", en: "dinner", uk: "вечеря" },
  { ar: "عصير", tr: "ʿaṣīr", msa: "عصير", en: "juice", uk: "сік" },
  { ar: "عيال", tr: "ʿiyāl", msa: "أطفال", en: "kids / guys", uk: "діти / хлопці" },

  // + group 6 — ف ق ك ل م ه
  { ar: "كيفك", tr: "kēfik", msa: "كيف حالك؟", en: "how are you? (same to him and her)", uk: "як ти? (однаково до нього й до неї)" },
  { ar: "الحين", tr: "al-ḥīn", msa: "الآن", en: "now", uk: "зараз" },
  { ar: "هلا", tr: "hala", msa: "أهلاً", en: "hi", uk: "привіт" },
  { ar: "ليش", tr: "lēsh", msa: "لماذا", en: "why", uk: "чому" },
  { ar: "مدري", tr: "madri", msa: "لا أدري", en: "dunno", uk: "не знаю" },
  { ar: "يلا", tr: "yalla", msa: "هيا", en: "come on, let's go", uk: "давай, ходімо" },
  { ar: "مع", tr: "maʿ", msa: "مع", en: "with", uk: "з (разом із)" },
  { ar: "من", tr: "min", msa: "من", en: "from", uk: "з, від" },
  { ar: "لين", tr: "lēn", msa: "حتى", en: "until", uk: "доки, до" },
  { ar: "مرحبا", tr: "marḥaba", msa: "مرحباً", en: "hello", uk: "привіт" },
  { ar: "معليش", tr: "maʿlēsh", msa: "آسف / لا عليك", en: "sorry / never mind", uk: "вибач / нічого страшного" },
  { ar: "خلاص", tr: "khalāṣ", msa: "انتهى / يكفي", en: "done, enough", uk: "усе, досить" },
  { ar: "تمام", tr: "tamām", msa: "على ما يرام", en: "all good", uk: "усе добре" },
  { ar: "يمكن", tr: "yimkin", msa: "ربما", en: "maybe", uk: "можливо" },
  { ar: "مشغول", tr: "mashghūl", msa: "مشغول", en: "busy", uk: "зайнятий" },
  { ar: "مبسوط", tr: "mabsūṭ", msa: "سعيد", en: "happy", uk: "щасливий" },
  { ar: "زعلان", tr: "zaʿlān", msa: "مستاء", en: "upset (with someone)", uk: "ображений (на когось)" },
  { ar: "طفشان", tr: "ṭafshān", msa: "ضَجِر", en: "bored — very Saudi", uk: "знуджений — дуже по-саудівськи" },
  { ar: "شغل", tr: "shughl", msa: "عمل", en: "work", uk: "робота" },
  { ar: "اليوم", tr: "al-yōm", msa: "اليوم", en: "today", uk: "сьогодні" },
  { ar: "أمس", tr: "ams", msa: "أمس", en: "yesterday", uk: "учора" },
  { ar: "الليل", tr: "al-lēl", msa: "الليل", en: "night", uk: "ніч" },
  { ar: "حلو", tr: "ḥilw", msa: "جميل", en: "nice, pretty", uk: "гарний, приємний" },
  { ar: "كبير", tr: "kbīr", msa: "كبير", en: "big", uk: "великий" },
  { ar: "جوال", tr: "jawwāl", msa: "هاتف محمول", en: "mobile phone — Saudi word", uk: "мобільний телефон — саудівське слово" },
  { ar: "شاهي", tr: "shāhi", msa: "شاي", en: "tea — Saudi word", uk: "чай — саудівське слово" },
  { ar: "صديق", tr: "ṣadīg", msa: "صديق", en: "friend (m)", uk: "друг" },
  { ar: "فلوس", tr: "flūs", msa: "نقود", en: "money", uk: "гроші", src: "alphabet" },

  // + the extras — ء ة ى (Day 13)
  { ar: "قهوة", tr: "gahwa", msa: "قهوة", en: "coffee", uk: "кава" },
  { ar: "موية", tr: "mōya", msa: "ماء", en: "water", uk: "вода", check: true, checkNote: { en: "Also ماي (māy).", uk: "Також ماي (māy).", najdi: "ويقولون بعد «ماي» (māy).", msa: "ويُقال أيضًا «ماي» (māy)." } },
  { ar: "بكرة", tr: "bukra", msa: "غداً", en: "tomorrow", uk: "завтра" },
  { ar: "سيارة", tr: "sayyāra", msa: "سيارة", en: "car", uk: "машина" },
  { ar: "ترى", tr: "tara", msa: "اعلم أن", en: "you know, look… — a softener at the start of a sentence", uk: "знаєш, слухай… — пом'якшувач на початку речення" },
  { ar: "كبسة", tr: "kabsa", msa: "كبسة", en: "kabsa — rice and meat, the national dish", uk: "кабса — рис із м'ясом, національна страва" },
  { ar: "مرّة", tr: "marra", msa: "جداً", en: "very / once", uk: "дуже / один раз" },
  { ar: "صورة", tr: "ṣūra", msa: "صورة", en: "photo", uk: "фото" },
  { ar: "رسالة", tr: "risāla", msa: "رسالة", en: "message", uk: "повідомлення" },
  { ar: "إيه", tr: "ēh", msa: "نعم", en: "yes", uk: "так", check: true,
    checkNote: { en: "Careful: in Egyptian إيه means “what”.", uk: "Обережно: у єгипетській إيه означає «що».", najdi: "انتبه: بالمصري «إيه» يعني «وش».", msa: "انتبه: «إيه» في المصرية تعني «ماذا»." } },
];
