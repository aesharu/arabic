// The 28 letters in six shape-based groups, two study days each. Every text is in both languages:
// { en, najdi }.
//   char, name, nameAr     the letter and its name
//   translit               Latin spelling of the sound
//   sound                  how to say it (Saudi first when it differs from formal Arabic)
//   example                a Saudi word: ar + tr (Saudi pronunciation) + en
//   najdi                  optional note on Saudi speech
//   hard                   a sound English doesn't have
//   nonJoining             never connects to the letter after it
//   check, checkNote       needs a native speaker's OK (shown as "check with tutor")
export const GROUPS = [
  {
    days: "1–2",
    title: { en: "Alif and the boat letters", najdi: "الألف وحروف «القارب»" },
    note: {
      en: "ب ت ث ن ي share one body at the start and middle of a word. Only the dots tell them apart.",
      najdi: "ب ت ث ن ي لها نفس الجسم في أول الكلمة ونصها. بس النقاط تفرّق بينها.",
    },
    letters: [
      {
        char: "ا", name: "alif", nameAr: "ألف", translit: "ā", nonJoining: true,
        sound: { en: "Long a, as in father.", najdi: "ألف ممدودة، مثل a في father." },
        example: { ar: "أبغى", tr: "abgha", en: "I want" },
        najdi: {
          en: "She and most people in the centre and north say أبي (abi) for “I want”; أبغى means the same and is heard all over Saudi, especially in the west. Formal Arabic says أريد — you won't need it.",
          najdi: "هي وأغلب أهل الوسط والشمال يقولون «أبي» (abi)؛ و«أبغى» نفس المعنى وتنسمع بكل السعودية، خصوصًا بالغربية. «أريد» فصحى — ما بتحتاجها.",
        },
      },
      {
        char: "ب", name: "bāʾ", nameAr: "باء", translit: "b",
        sound: { en: "b as in book.", najdi: "باء، مثل b في book." },
        example: { ar: "باب", tr: "bāb", en: "door" },
      },
      {
        char: "ت", name: "tāʾ", nameAr: "تاء", translit: "t",
        sound: { en: "t, clean and light.", najdi: "تاء، خفيفة وواضحة." },
        example: { ar: "تمر", tr: "tamr", en: "dates" },
      },
      {
        char: "ث", name: "thāʾ", nameAr: "ثاء", translit: "th", hard: true,
        sound: {
          en: "th as in think. Tongue tip between the teeth.",
          najdi: "مثل th في think. طرف لسانك بين أسنانك.",
        },
        example: { ar: "ثلاثة", tr: "thalātha", en: "three" },
        najdi: {
          en: "Saudi Arabic keeps this sound. Egyptian turns it into t or s — don't copy them.",
          najdi: "السعودي يحافظ على هالصوت. المصريين يقلبونه ت أو س — لا تقلدهم.",
        },
      },
      {
        char: "ن", name: "nūn", nameAr: "نون", translit: "n",
        sound: {
          en: "n. At the end of a word it drops into a bowl.",
          najdi: "نون. في آخر الكلمة تنزل تحت السطر مثل الصحن.",
        },
        example: { ar: "نور", tr: "nūr", en: "light" },
      },
      {
        char: "ي", name: "yāʾ", nameAr: "ياء", translit: "y / ī",
        sound: { en: "y as in yes, or a long ee.", najdi: "مثل y في yes، أو ياء ممدودة." },
        example: { ar: "يوم", tr: "yōm", en: "day" },
        najdi: {
          en: "In Saudi Arabic, ay usually becomes ē and aw becomes ō. That's why يوم is yōm.",
          najdi: "في السعودي ay غالبًا تصير ē، وaw تصير ō. عشان كذا «يوم» تنقال yōm.",
        },
      },
    ],
  },
  {
    days: "3–4",
    title: { en: "The hooks", najdi: "حروف «الخطّاف»" },
    note: {
      en: "One shape, three sounds: dot below, no dot, dot above.",
      najdi: "شكل واحد وثلاث أصوات: نقطة تحت، بدون نقطة، نقطة فوق.",
    },
    letters: [
      {
        char: "ج", name: "jīm", nameAr: "جيم", translit: "j",
        sound: { en: "j as in jam.", najdi: "مثل j في jam." },
        example: { ar: "جمل", tr: "jamal", en: "camel" },
      },
      {
        char: "ح", name: "ḥāʾ", nameAr: "حاء", translit: "ḥ", hard: true,
        sound: {
          en: "A strong breathy h from deep in the throat, like fogging glasses but tighter.",
          najdi: "حاء قوية من آخر الحلق، مثل لما تنفخ على القزاز يغبش بس أشد.",
        },
        example: { ar: "الحين", tr: "al-ḥīn", en: "now" },
        najdi: {
          en: "الحين is pure Saudi. You'll hear it all day.",
          najdi: "«الحين» سعودية صافية. بتسمعها طول اليوم.",
        },
      },
      {
        char: "خ", name: "khāʾ", nameAr: "خاء", translit: "kh",
        sound: { en: "kh as in Bach.", najdi: "مثل ch في Bach." },
        example: { ar: "خبز", tr: "khubz", en: "bread" },
      },
    ],
  },
  {
    days: "5–6",
    title: { en: "Letters that never join forward", najdi: "حروف ما تتصل باللي بعدها" },
    note: {
      en: "These never connect to the letter after them, so words break into pieces. ا is one of them too.",
      najdi: "هذي ما تتصل أبد بالحرف اللي بعدها، عشان كذا الكلمة تتقطع. والألف منها بعد.",
    },
    letters: [
      {
        char: "د", name: "dāl", nameAr: "دال", translit: "d", nonJoining: true,
        sound: { en: "d.", najdi: "دال." },
        example: { ar: "دار", tr: "dār", en: "house" },
        check: true,
        checkNote: {
          en: "The everyday Saudi word for “house” is usually بيت (bēt). Ask your tutor how دار is used.",
          najdi: "الكلمة اليومية للبيت في السعودي غالبًا «بيت» (bēt). اسأل المدرّس كيف تنستخدم «دار».",
        },
      },
      {
        char: "ذ", name: "dhāl", nameAr: "ذال", translit: "dh", hard: true, nonJoining: true,
        sound: { en: "th as in this.", najdi: "مثل th في this." },
        example: { ar: "ذهب", tr: "dhahab", en: "gold" },
        najdi: { en: "Kept in Saudi Arabic, just like ث.", najdi: "باقية في السعودي، مثل الثاء." },
      },
      {
        char: "ر", name: "rāʾ", nameAr: "راء", translit: "r", nonJoining: true,
        sound: { en: "A tapped or rolled r.", najdi: "راء مضروبة أو مكررة." },
        example: { ar: "رز", tr: "rizz", en: "rice" },
      },
      {
        char: "ز", name: "zāy", nameAr: "زاي", translit: "z", nonJoining: true,
        sound: { en: "z.", najdi: "زاي." },
        example: { ar: "زين", tr: "zēn", en: "good, fine" },
        najdi: {
          en: "زين is the Saudi “okay / good”. Use it every day.",
          najdi: "«زين» يعني تمام وحلو بالسعودي. قلها كل يوم.",
        },
      },
      {
        char: "و", name: "wāw", nameAr: "واو", translit: "w / ū", nonJoining: true,
        sound: { en: "w as in wow, or a long oo.", najdi: "مثل w في wow، أو واو ممدودة." },
        example: { ar: "وين", tr: "wēn", en: "where" },
      },
    ],
  },
  {
    days: "7–8",
    title: { en: "Teeth and the first heavy letters", najdi: "الأسنان وأول الحروف الثقيلة" },
    note: {
      en: "س ش have teeth, ص ض have a loop. Heavy letters darken the vowels next to them.",
      najdi: "س ش لها أسنان، وص ض لها حلقة. الحروف الثقيلة تغمّق الحركات اللي جنبها.",
    },
    letters: [
      {
        char: "س", name: "sīn", nameAr: "سين", translit: "s",
        sound: { en: "s.", najdi: "سين." },
        example: { ar: "سلام", tr: "salām", en: "hello, peace" },
      },
      {
        char: "ش", name: "shīn", nameAr: "شين", translit: "sh",
        sound: { en: "sh as in shop.", najdi: "مثل sh في shop." },
        example: { ar: "وش", tr: "wesh", en: "what?" },
        najdi: {
          en: "وش is the signature Saudi word. Jeddah says إيش, the Levant شو.",
          najdi: "«وش» أشهر كلمة سعودية. أهل جدة يقولون «إيش»، والشوام «شو».",
        },
      },
      {
        char: "ص", name: "ṣād", nameAr: "صاد", translit: "ṣ", hard: true,
        sound: {
          en: "A heavy s: tongue low, mouth full and rounded.",
          najdi: "سين ثقيلة: اللسان تحت والفم مليان ومدوّر.",
        },
        example: { ar: "صباح", tr: "ṣabāḥ", en: "morning" },
      },
      {
        char: "ض", name: "ḍād", nameAr: "ضاد", translit: "ḍ → ẓ", ua: "ҙʹ", hard: true,
        sound: {
          en: "In Saudi Arabic, a heavy th as in this — the same sound as ظ. Formal Arabic says a heavy d.",
          najdi: "في السعودي نفس صوت الظاء: ذال ثقيلة. في الفصحى دال ثقيلة.",
        },
        example: { ar: "ضيف", tr: "ẓēf", en: "guest" },
        najdi: {
          en: "In Saudi Arabic, ض and ظ sound the same: a heavy th as in this. So ضيف is ẓēf, not ḍēf.",
          najdi: "في السعودي الضاد والظاء نفس الصوت. عشان كذا «ضيف» تنقال ẓēf مو ḍēf.",
        },
      },
    ],
  },
  {
    days: "9–10",
    title: { en: "The throat letters", najdi: "حروف الحلق" },
    note: {
      en: "The hardest two days. Go slow and say every sound out loud.",
      najdi: "أصعب يومين. خذها على مهلك وقول كل صوت بصوت عالي.",
    },
    letters: [
      {
        char: "ط", name: "ṭāʾ", nameAr: "طاء", translit: "ṭ", hard: true,
        sound: { en: "A heavy t.", najdi: "تاء ثقيلة." },
        example: { ar: "طيب", tr: "ṭayyib", en: "okay, good" },
      },
      {
        char: "ظ", name: "ẓāʾ", nameAr: "ظاء", translit: "ẓ", hard: true,
        sound: { en: "A heavy th as in this.", najdi: "ذال ثقيلة، مثل th في this بس أثقل." },
        example: { ar: "ظهر", tr: "ẓuhr", en: "noon" },
      },
      {
        char: "ع", name: "ʿayn", nameAr: "عين", translit: "ʿ", hard: true,
        sound: {
          en: "Squeeze the throat and voice through it, like the very start of a gag, gently.",
          najdi: "اعصر حلقك وخلّ الصوت يطلع منه، مثل بداية الترجيع بس بهدوء.",
        },
        example: { ar: "عيال", tr: "ʿiyāl", en: "kids, guys" },
        najdi: {
          en: "عيال means kids — and between friends, “guys”.",
          najdi: "«عيال» يعني الأولاد — وبين الربع يعني «يا شباب».",
        },
      },
      {
        char: "غ", name: "ghayn", nameAr: "غين", translit: "gh", hard: true,
        sound: { en: "A gargled r, like the French r in Paris.", najdi: "مثل الراء الفرنسية في Paris." },
        example: { ar: "غالي", tr: "ghāli", en: "expensive, dear" },
      },
    ],
  },
  {
    days: "11–12",
    title: { en: "The last six", najdi: "آخر ستة" },
    note: {
      en: "Mostly friendly sounds — and ق, the most Saudi letter of all.",
      najdi: "أغلبها أصوات سهلة — ومعها القاف، أكثر حرف سعودي.",
    },
    letters: [
      {
        char: "ف", name: "fāʾ", nameAr: "فاء", translit: "f",
        sound: { en: "f.", najdi: "فاء." },
        example: { ar: "فلوس", tr: "flūs", en: "money" },
      },
      {
        char: "ق", name: "qāf", nameAr: "قاف", translit: "q → g", ua: "ґ",
        sound: {
          en: "In Saudi Arabic, g as in go. In formal Arabic, a deep k from the throat.",
          najdi: "في السعودي تنقال g مثل go. في الفصحى قاف عميقة من الحلق.",
        },
        example: { ar: "قهوة", tr: "gahwa", en: "coffee" },
        najdi: {
          en: "The biggest Saudi tell. قال is gāl, قهوة is gahwa.",
          najdi: "أوضح علامة للسعودي. «قال» تنقال gāl، و«قهوة» gahwa.",
        },
      },
      {
        char: "ك", name: "kāf", nameAr: "كاف", translit: "k",
        sound: { en: "k.", najdi: "كاف." },
        example: { ar: "كيف", tr: "kēf", en: "how" },
        najdi: {
          en: "In old village and Bedouin speech you may hear ك as “ts” in some words. Recognize it, don't copy it yet.",
          najdi: "في كلام الشياب والبدو زمان ممكن تسمع الكاف «تس» في بعض الكلمات. افهمها بس لا تقلدها للحين.",
        },
      },
      {
        char: "ل", name: "lām", nameAr: "لام", translit: "l",
        sound: { en: "A light l, tongue tip on the teeth.", najdi: "لام خفيفة، طرف اللسان على الأسنان." },
        example: { ar: "ليش", tr: "lēsh", en: "why" },
      },
      {
        char: "م", name: "mīm", nameAr: "ميم", translit: "m",
        sound: { en: "m.", najdi: "ميم." },
        example: { ar: "موية", tr: "mōya", en: "water" },
        check: true, checkNote: { en: "Also ماي (māy).", najdi: "ويقولون بعد «ماي» (māy)." },
      },
      {
        char: "ه", name: "hāʾ", nameAr: "هاء", translit: "h",
        sound: { en: "A light breath, as in hello.", najdi: "نفَس خفيف، مثل h في hello." },
        example: { ar: "هلا", tr: "hala", en: "hi!" },
        najdi: {
          en: "هلا and هلا والله are everyday Saudi greetings.",
          najdi: "«هلا» و«هلا والله» تحيات سعودية كل يوم.",
        },
      },
    ],
  },
];

export const ALL_LETTERS = GROUPS.flatMap((g, gi) => g.letters.map(l => ({ ...l, group: gi })));

const TATWEEL = "ـ"; // the joining stroke used to show a letter's connected forms
// Each form: [what it looks like, i18n key for its label]
export const formsOf = l =>
  l.nonJoining
    ? [[l.char, "form.alone"], [TATWEEL + l.char, "form.joined"]]
    : [[l.char + TATWEEL, "form.start"], [TATWEEL + l.char + TATWEEL, "form.middle"], [TATWEEL + l.char, "form.end"], [l.char, "form.alone"]];
