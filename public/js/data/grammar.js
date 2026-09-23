// The nine grammar patterns of NAJDI-PLAN.md Part 5, as lessons. Every Arabic example is copied from the plan
// (tests/grammar.test.mjs checks it); `her: true` marks the forms for talking to her; `check` = ⚠ in the plan.
export const GRAMMAR = [
  {
    id: "1",
    title: { en: "Pronouns", najdi: "الضمائر" },
    intro: {
      en: "Two things differ from formal Arabic: “we” is ḥinna, and “you” changes — int to a man, inti to a woman. When you talk to her, it's always inti.",
      najdi: "فيه فرقين عن الفصحى: «نحن» نقولها حنا، و«انت» تتغيّر: للرجّال انت وللبنت انتي. إذا تكلّمها دايم انتي.",
    },
    rows: [
      { ar: "أنا", say: "ana", en: "I" },
      { ar: "انت", say: "int", en: "you (to a man)" },
      { ar: "انتي", say: "inti", en: "you (to a woman)", her: true },
      { ar: "هو", say: "hu", en: "he" },
      { ar: "هي", say: "hi", en: "she" },
      { ar: "حنا", say: "ḥinna", en: "we" },
      { ar: "انتو", say: "intu", en: "you all" },
      { ar: "هم", say: "hum", en: "they" },
    ],
  },
  {
    id: "2",
    title: { en: "“My, your, her” — endings", najdi: "النهايات: بيتي، بيتك، بيتها" },
    intro: {
      en: "Add an ending to a noun to say whose it is. “Your” is -ik to a woman and -ak to a man — the same letter ك, only the vowel changes: بيتك is bētik to her, bētak to him. After a verb, -ni means “me”.",
      najdi: "حطّ نهاية على الاسم عشان تقول حق مين. «ـك» للبنت تنقال -ik وللرجّال -ak — نفس الحرف بس الحركة تتغير: «بيتك» لها bētik وله bētak. وبعد الفعل ـني يعني «أنا».",
    },
    rows: [
      { ar: "بيتي", say: "bēti", en: "my house" },
      { ar: "بيتك", say: "bētik", en: "your house (to her)", her: true },
      { ar: "بيتك", say: "bētak", en: "your house (to him)" },
      { ar: "بيته", say: "bētah", en: "his house" },
      { ar: "بيتها", say: "bētha", en: "her house" },
      { ar: "بيتنا", say: "bētna", en: "our house" },
      { ar: "بيتكم", say: "bētkum", en: "your house (all of you)" },
      { ar: "بيتهم", say: "bēthum", en: "their house" },
      { ar: "تحبني؟", say: "tḥibbīni?", en: "do you love me? (to her)", her: true },
    ],
  },
  {
    id: "3",
    title: { en: "“To be” — there's no verb", najdi: "«يكون» — ما فيه فعل" },
    intro: {
      en: "In the present there's no word for “am / is / are” — just put the two words side by side. For the past, use كنت (I was).",
      najdi: "بالحاضر ما فيه كلمة لـ«يكون» — حطّ الكلمتين جنب بعض وخلاص. وللماضي: كنت.",
    },
    rows: [
      { ar: "أنا تعبان", say: "ana taʿbān", en: "I'm tired" },
      { ar: "هي بالبيت", say: "hi bil-bēt", en: "she's at home" },
      { ar: "كنت", say: "kint", en: "I was", check: true,
        note: { en: "Some say kunt.", najdi: "بعضهم يقول كُنت." } },
    ],
  },
  {
    id: "4",
    title: { en: "Present tense — one verb, all people", najdi: "المضارع — فعل واحد لكل الناس" },
    intro: {
      en: "Learn one verb and you know them all: the beginning (and sometimes the end) changes for each person. Pattern: a- / ti- / ti-…-īn / yi- / ti- / ni- / ti-…-ūn / yi-…-ūn. To her, the verb ends in -īn: tirūḥīn.",
      najdi: "اعرف فعل واحد وتعرفها كلها: أوّل الفعل (وأحيانًا آخره) يتغيّر حسب الشخص: أ / تـ / تـ…ين / يـ / تـ / نـ / تـ…ون / يـ…ون. ولها يخلص الفعل بـ ـين: تروحين.",
    },
    verb: { ar: "راح / يروح", en: "to go" },
    rows: [
      { ar: "أروح", say: "arūḥ", en: "I go" },
      { ar: "تروح", say: "tirūḥ", en: "you go (to a man)" },
      { ar: "تروحين", say: "tirūḥīn", en: "you go (to her)", her: true },
      { ar: "يروح", say: "yirūḥ", en: "he goes" },
      { ar: "تروح", say: "tirūḥ", en: "she goes" },
      { ar: "نروح", say: "nirūḥ", en: "we go" },
      { ar: "تروحون", say: "tirūḥūn", en: "you all go" },
      { ar: "يروحون", say: "yirūḥūn", en: "they go" },
    ],
  },
  {
    id: "5",
    title: { en: "Past tense", najdi: "الماضي" },
    intro: {
      en: "The past adds endings instead. “I went” and “you went” (to a man) sound the same: riḥt. To her it's riḥti. Verbs that end in a vowel take -ēt: sawwēt, ṣiḥēt, ligēt.",
      najdi: "بالماضي نضيف نهايات. «أنا رحت» و«انت رحت» نفس النطق: رحت. ولها: رحتي. والأفعال اللي تخلص بحرف علّة تاخذ ـيت: سويت، صحيت، لقيت.",
    },
    rows: [
      { ar: "رحت", say: "riḥt", en: "I went" },
      { ar: "رحت", say: "riḥt", en: "you went (to a man)" },
      { ar: "رحتي", say: "riḥti", en: "you went (to her)", her: true },
      { ar: "راح", say: "rāḥ", en: "he went" },
      { ar: "راحت", say: "rāḥat", en: "she went" },
      { ar: "رحنا", say: "riḥna", en: "we went" },
      { ar: "رحتو", say: "riḥtu", en: "you all went" },
      { ar: "راحوا", say: "rāḥaw", en: "they went", check: true },
      { ar: "سويت", say: "sawwēt", en: "I did" },
      { ar: "صحيت", say: "ṣiḥēt", en: "I woke up" },
      { ar: "لقيت", say: "ligēt", en: "I found" },
    ],
  },
  {
    id: "6",
    title: { en: "Want, will, am doing", najdi: "أبي، بـ، قاعد" },
    intro: {
      en: "Three small words before a verb do a lot: أبي (I want), ب- (will — the future), قاعد (right now). Talking to her: تبين; about her: قاعدة.",
      najdi: "ثلاث كلمات صغيرة قبل الفعل تسوّي كثير: أبي، وبـ للمستقبل، وقاعد للحين. لها: تبين، وعنها: قاعدة.",
    },
    rows: [
      { ar: "أبي أنام", say: "abi anām", en: "I want to sleep" },
      { ar: "تبين تاكلين؟", say: "tibīn tākilīn?", en: "do you want to eat? (to her)", her: true },
      { ar: "ودي أشوفك", say: "widdi ashūfik", en: "I'd love to see you" },
      { ar: "بنام", say: "banām", en: "I'm going to sleep" },
      { ar: "قاعد أشتغل", say: "gāʿid ashtaghil", en: "I'm working (right now)" },
      { ar: "قاعدة تطبخ", say: "gāʿda tiṭbakh", en: "she's cooking" },
      { ar: "أبغى", say: "abgha", en: "I want (same meaning, more pan-Saudi)" },
    ],
  },
  {
    id: "7",
    title: { en: "Saying no", najdi: "النفي" },
    intro: {
      en: "ما before a verb (ma fhimt — I didn't understand), مو before a word that isn't a verb (mū zēn — not good; Riyadh also says مب mub), ماني for “I'm not”, and لا for “don't!”.",
      najdi: "ما قبل الفعل (ما فهمت)، ومو قبل الكلمة اللي مو فعل (مو زين — وأهل الرياض يقولون بعد: مب)، وماني يعني «أنا مو»، ولا للنهي (لا تزعلين).",
    },
    rows: [
      { ar: "ما أدري → مدري", say: "ma adri → madri", en: "I don't know" },
      { ar: "ما فهمت", say: "ma fhimt", en: "I didn't understand" },
      { ar: "مو زين", say: "mū zēn", en: "not good" },
      { ar: "ماني فاهم", say: "māni fāhim", en: "I'm not getting it" },
      { ar: "لا تزعلين", say: "la tizʿalīn", en: "don't be upset (to her)", her: true },
      { ar: "ما فيه مشكلة", say: "ma fīh mushkila", en: "there's no problem" },
    ],
  },
  {
    id: "8",
    title: { en: "Have, there is", najdi: "عندي وفيه" },
    intro: {
      en: "“Have” isn't a verb in Arabic: عندي literally means “at me”. “There is” is فيه. Put ما in front to say no.",
      najdi: "«عندي» مو فعل — معناها «عند أنا». و«يوجد» نقولها فيه. وحطّ ما قدّامها للنفي.",
    },
    rows: [
      { ar: "عندي", say: "ʿindi", en: "I have" },
      { ar: "عندك", say: "ʿindik", en: "you have" },
      { ar: "ما عندي", say: "ma ʿindi", en: "I don't have" },
      { ar: "فيه", say: "fīh", en: "there is" },
      { ar: "ما فيه", say: "ma fīh", en: "there isn't" },
    ],
  },
  {
    id: "9",
    title: { en: "Time words that change meaning", najdi: "كلمات الوقت: توّ، بعد، عاد" },
    intro: {
      en: "Small words you'll hear all the time: توّ + ending = “just now”, بعد = “still / also”, ما بعد = “not yet”, عاد = “then / anymore” (often just a filler).",
      najdi: "كلمات صغيرة بتسمعها دايم: توّ مع النهاية = قبل شوي، بعد = للحين أو أيضًا، ما بعد = للحين ما صار، عاد = بعدين أو خلاص (وكثير تجي بس حشو).",
    },
    rows: [
      { ar: "توني صحيت", say: "tawwni ṣiḥēt", en: "I just woke up" },
      { ar: "وأنا بعد", say: "w ana baʿad", en: "me too" },
      { ar: "ما بعد أكلت", say: "ma baʿad akalt", en: "I haven't eaten yet" },
      { ar: "عاد", say: "ʿād", en: "then / anymore (a filler you'll hear constantly)" },
    ],
  },
];
