// The 15-month roadmap. Mirrors NAJDI-PLAN.md Part 3 — that file is the source of truth, so change both together.
// The two Script weeks are planned day by day (two days per letter group); from week 3 every day is the
// plan's three blocks: cards, listening, speaking.
// A task is { id, min, text, href? }. Every text is in both languages: { en, najdi }.
import { GROUPS } from "./letters.js";

const lettersOf = g => GROUPS[g].letters.map(l => l.char).join(" ");
const both = (en, najdi) => ({ en, najdi });
// Builds a text in both languages from one template per language, e.g. prefix + shared letters + suffix.
const each = (parts, fn) => both(fn(parts.en, "en"), fn(parts.najdi, "najdi"));

const HOW_FIRST = both(
  "hear each letter, say it out loud, read the Saudi notes",
  "اسمع كل حرف، قوله بصوت عالي، واقرا ملاحظات السعودي",
);
const HOW_SECOND = both(
  "cover the forms row and name each form from memory",
  "غطّ سطر الأشكال وقول كل شكل من راسك",
);
const GROUP = both("Group", "المجموعة");
const VOWELS = both("Vowels", "الحركات");

const task = {
  review: () => ({ id: "review", min: 10, href: "#/quiz", text: both(
    "Warm-up: quiz yourself on every letter so far",
    "إحماء: اختبر نفسك في كل الحروف اللي أخذتها",
  ) }),
  learn: (g, how) => ({ id: "learn", min: 25, href: `#/letters/${g + 1}`,
    text: each(GROUP, (word, l) => `${word} ${g + 1} — ${lettersOf(g)}: ${how[l]}`) }),
  write: g => ({ id: "write", min: 20, text: both(
    `Handwriting: write every form of ${lettersOf(g)} ten times on paper, saying each sound`,
    `كتابة باليد: اكتب كل أشكال ${lettersOf(g)} عشر مرات على ورقة، وأنت تقول الصوت`,
  ) }),
  vowels: what => ({ id: "vowels", min: 10, href: "#/vowels", text: each(VOWELS, (word, l) => `${word}: ${what[l]}`) }),
  read: (min = 10) => ({ id: "read", min, href: "#/reading", text: both(
    "Reading: say each practice word out loud before you reveal it",
    "قراية: قول كل كلمة بصوت عالي قبل ما تكشفها",
  ) }),
  phrases: () => ({ id: "phrases", min: 10, href: "#/phrases", text: both(
    "Speak: say today's phrases out loud, ten times each, until they come out without thinking",
    "كلام: قول عبارات اليوم بصوت عالي، كل وحدة عشر مرات، لين تطلع بدون تفكير",
  ) }),
  listen: () => ({ id: "listen", min: 15, text: both(
    "Listen: 15 minutes of Saudi Arabic — her voice notes, or daily-life vlogs on Snapchat or TikTok. Don't try to understand yet; get used to the sound",
    "استماع: 15 دقيقة سعودي — فويساتها، أو فلوقات يومية في سناب أو تيك توك. لا تحاول تفهم الحين؛ بس تعوّد على الصوت",
  ) }),
  tutor: () => ({ id: "tutor", min: 15, text: both(
    "Find a Riyadh-born tutor (speaking only, 45 min) and book two sessions a week, starting Monday 5 October",
    "دوّر مدرّس من أهل الرياض (كلام بس، 45 دقيقة) واحجز حصتين بالأسبوع، تبدأ يوم الاثنين 5 أكتوبر",
  ) }),
};

const firstDay = g => [task.review(), task.learn(g, HOW_FIRST), task.write(g), task.phrases(), task.listen()];
const secondDay = g => [task.review(), task.learn(g, HOW_SECOND), task.write(g), task.read(), task.phrases(), task.listen()];

export const SCRIPT_DAYS = {
  1: { group: 0, focus: both("Meet ا ب ت ث ن ي — their shapes and sounds", "تعرّف على ا ب ت ث ن ي — أشكالها وأصواتها"), tasks: [
    task.learn(0, HOW_FIRST),
    task.vowels(both("the three short vowels — fatḥa, kasra, ḍamma — on ب", "الحركات القصيرة الثلاث — الفتحة والكسرة والضمة — على الباء")),
    task.write(0), task.phrases(), task.listen(),
  ] },
  2: { group: 0, focus: both("Group 1 again — all four forms, then read your first real words", "المجموعة 1 مرة ثانية — الأشكال الأربعة، وبعدين أول كلمات حقيقية تقراها"), tasks: [
    task.review(), task.learn(0, HOW_SECOND), task.write(0),
    task.vowels(both("long vowels with ا and ي — bā, bī", "المد بالألف والياء — bā، bī")),
    task.read(), task.phrases(), task.listen(),
  ] },
  3: { group: 1, focus: both("ج ح خ — and ح, a sound Ukrainian doesn't have", "ج ح خ — والحاء، صوت ما هو موجود بالأوكراني"), tasks: firstDay(1) },
  4: { group: 1, focus: both("Group 2 again — forms, and words built from groups 1–2", "المجموعة 2 مرة ثانية — الأشكال، وكلمات من حروف المجموعتين 1 و2"), tasks: secondDay(1) },
  5: { group: 2, focus: both("د ذ ر ز و — the letters that never join forward", "د ذ ر ز و — الحروف اللي ما تتصل باللي بعدها"),
    tasks: [...firstDay(2), task.vowels(both("و as a long vowel — bū", "الواو كحرف مد — bū"))] },
  6: { group: 2, focus: both("Group 3 again — plus sukūn and shadda", "المجموعة 3 مرة ثانية — ومعها السكون والشدة"),
    tasks: [...secondDay(2), task.vowels(both("sukūn (no vowel) and shadda (double letter)", "السكون (بدون حركة) والشدة (حرف مضاعف)"))] },
  7: { group: 3, focus: both("س ش ص ض — your first heavy letters", "س ش ص ض — أول حروف ثقيلة"), tasks: firstDay(3) },
  8: { group: 3, focus: both("Heavy vs light: hear the difference between س and ص", "الثقيل والخفيف: اسمع الفرق بين السين والصاد"), tasks: [...secondDay(3), task.tutor()] },
  9: { group: 4, focus: both("ط ظ ع غ — the throat letters. Slowest days of the plan; that's normal", "ط ظ ع غ — حروف الحلق. أبطأ أيام الخطة، وهذا عادي"), tasks: firstDay(4) },
  10: { group: 4, focus: both("ع and غ out loud until they stop feeling strange", "العين والغين بصوت عالي لين ما عادت غريبة عليك"), tasks: secondDay(4) },
  11: { group: 5, focus: both("ف ق ك ل م ه — and ق, which is g in Saudi Arabic", "ف ق ك ل م ه — والقاف، اللي تنقال g بالسعودي"), tasks: firstDay(5) },
  12: { group: 5, focus: both("Group 6 again. You now know all 28 letters", "المجموعة 6 مرة ثانية. الحين تعرف الـ28 حرف كلها"), tasks: secondDay(5) },
  13: { group: null, focus: both("The four extras — ء ة ى لا — and a full review", "الأربع الإضافية — ء ة ى لا — ومراجعة كاملة"), tasks: [
    { id: "quiz", min: 15, href: "#/quiz", text: both("Quiz: all six groups", "اختبار: كل المجموعات الست") },
    task.vowels(both("the four extras — hamza, tāʾ marbūṭa, alif maqṣūra, lām-alif", "الأربع الإضافية — الهمزة والتاء المربوطة والألف المقصورة واللام ألف")),
    { id: "write", min: 20, text: both("Handwriting: all 28 letters in their alone form, in alphabet order", "كتابة باليد: الـ28 حرف بشكلها لحالها، بترتيب الأبجدية") },
    task.read(15), task.phrases(), task.listen(),
  ] },
  14: { group: null, focus: both("Test day: read any word slowly, write every letter in every form", "يوم الاختبار: تقرا أي كلمة على مهلك، وتكتب كل حرف بكل أشكاله"), tasks: [
    { id: "quiz", min: 20, href: "#/quiz", text: both("Quiz: all groups — aim for 25 correct in a row", "اختبار: كل المجموعات — الهدف 25 صح ورا بعض") },
    task.read(20),
    { id: "dictation", min: 20, text: both("From memory: write all 28 letters without looking, then check against the Letters page", "من راسك: اكتب الـ28 حرف بدون ما تطالع، بعدين قارنها بصفحة الحروف") },
    { id: "phrases", min: 15, href: "#/phrases", text: both("Speak: every phrase from the last two weeks, out loud", "كلام: كل عبارات الأسبوعين اللي فاتوا، بصوت عالي") },
    task.listen(),
  ] },
};

// "A normal day (90 minutes)" and "A normal week" — NAJDI-PLAN.md Part 3.
const DAY_BLOCKS = [
  { id: "cards", min: 20, href: "#/cards/study", text: both(
    "Cards: review, then 3–5 new words — always as whole sentences with audio",
    "الكروت: مراجعة، وبعدين 3–5 كلمات جديدة — دايم بجمل كاملة مع صوت",
  ) },
  { id: "listening", min: 40, text: both(
    "Listening: her voice notes first, then short Saudi vlogs or snaps. Half focused, half in the background",
    "استماع: فويساتها أول، وبعدين فلوقات أو سنابات سعودية قصيرة. نصها بتركيز ونصها بالخلفية",
  ) },
  { id: "speaking", min: 30, text: both(
    "Speaking: tutor session, or shadow her voice notes out loud, or record a voice note back to her",
    "كلام: حصة مع المدرّس، أو عيد فويساتها بصوت عالي، أو سجّل لها فويس ترد فيه",
  ) },
];
const WEEK = [
  both(
    "2 tutor sessions — 45 min, Riyadh-born tutor, speaking only. They replace that day's speaking block.",
    "حصتين مع المدرّس — 45 دقيقة، مدرّس من أهل الرياض، كلام بس. تاخذ مكان وقت الكلام في ذاك اليوم.",
  ),
  both(
    "1 review day at the weekend: write every new word by hand three times.",
    "يوم مراجعة بالويكند: اكتب كل كلمة جديدة بيدك ثلاث مرات.",
  ),
  both(
    "Every day: one small ritual with her in Arabic — a good-morning, a good-night, one question.",
    "كل يوم: عادة صغيرة معها بالعربي — صباح الخير، تصبحين على خير، أو سؤال واحد.",
  ),
];

// id picks the stage's step on the color ramp (p1–p6) on the calendar, plan and progress pages.
export const PHASES = [
  { id: 1, label: both("Script", "الكتابة"), name: both("Script", "الكتابة"),
    when: both("Weeks 1–2", "الأسبوع 1–2"),
    start: "2026-09-21", end: "2026-10-04", words: both("—", "—", "—", "—"),
    canDo: both("Read any word slowly, write every letter in every form",
                "تقرا أي كلمة على مهلك، وتكتب كل حرف بكل أشكاله"),
    routine: [], weekly: [] },
  { id: 2, label: both("Stage 1", "المرحلة 1"), name: both("Core", "الأساس"),
    when: both("Weeks 3–10", "الأسابيع 3–10"),
    start: "2026-10-05", end: "2026-11-29", words: both("150 + 50 phrases", "150 + 50 عبارة"),
    canDo: both("Greet her, ask and answer “how are you”, say what you're doing, say you don't understand",
                "تسلّم عليها، تسأل وترد على «كيفك»، تقول وش قاعد تسوي، وتقول إنك ما فهمت"),
    routine: DAY_BLOCKS, weekly: WEEK },
  { id: 3, label: both("Stage 2", "المرحلة 2"), name: both("Daily life", "الحياة اليومية"),
    when: both("Months 3–5", "الشهور 3–5"),
    start: "2026-11-30", end: "2027-02-14", words: both("~320", "~320", "~320", "~320"),
    canDo: both("Talk about your day, food, family, what you'll do tomorrow — in short sentences",
                "تسولف عن يومك والأكل والأهل ووش بتسوي بكرة — بجمل قصيرة"),
    note: both("Ramadan 2027 falls roughly early February to early March (check the exact dates nearer the time) — learn the special-moment phrases and use them with her.",
               "رمضان 2027 تقريبًا من أول فبراير لأول مارس (تأكد من التاريخ بالضبط لما يقرب) — تعلّم عبارات المناسبات وقلها لها."),
    routine: DAY_BLOCKS, weekly: WEEK },
  { id: 4, label: both("Stage 3", "المرحلة 3"), name: both("Talking to her", "السوالف معها"),
    when: both("Months 5–8", "الشهور 5–8"),
    start: "2027-02-15", end: "2027-05-31", words: both("~500", "~500", "~500", "~500"),
    canDo: both("A 10-minute call mostly in Arabic, with English as a rescue",
                "تسوي مكالمة 10 دقايق أغلبها بالعربي، والإنجليزي للطوارئ"),
    routine: DAY_BLOCKS, weekly: WEEK },
  { id: 5, label: both("Stage 4", "المرحلة 4"), name: both("Her words", "كلماتها"),
    when: both("Months 8–12", "الشهور 8–12"),
    start: "2027-06-01", end: "2027-09-30", words: both("~750", "~750", "~750", "~750"),
    canDo: both("Tell a story about your week in the past tense; follow her voice notes on familiar topics",
                "تحكي عن أسبوعك بالماضي، وتفهم فويساتها في المواضيع اللي تعرفها"),
    note: both("The new words come from her: her word of the day, lines from her voice notes, and every word your tutor corrects.",
               "الكلمات الجديدة تجي منها: كلمتها اليومية، وجمل من فويساتها، وكل كلمة يصححها المدرّس."),
    routine: DAY_BLOCKS, weekly: WEEK },
  { id: 6, label: both("Stage 5", "المرحلة 5"), name: both("Her words, deeper", "كلماتها، أعمق"),
    when: both("Months 12–15", "الشهور 12–15"),
    start: "2027-10-01", end: "2027-12-31", words: both("~1000", "~1000", "~1000", "~1000"),
    canDo: both("A 30-minute call in Arabic; joke, disagree, explain feelings simply",
                "تسوي مكالمة 30 دقيقة بالعربي؛ تمزح وتختلف معها وتشرح مشاعرك ببساطة"),
    routine: DAY_BLOCKS, weekly: WEEK },
];
