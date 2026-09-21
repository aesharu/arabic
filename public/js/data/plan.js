// The 15-month roadmap. Mirrors NAJDI-PLAN.md Part 3 — that file is the source of truth, so change both together.
// The two Script weeks are planned day by day (two days per letter group); from week 3 every day is the
// plan's three blocks: cards, listening, speaking.
// A task is { id, min, text, href? }. Every text is in four languages: { en, uk, najdi, msa }.
import { GROUPS } from "./letters.js";

const lettersOf = g => GROUPS[g].letters.map(l => l.char).join(" ");
const four = (en, uk, najdi, msa) => ({ en, uk, najdi, msa });
// Builds a four-language text from one template per language, e.g. prefix + shared letters + suffix.
const each = (parts, fn) => four(fn(parts.en, "en"), fn(parts.uk, "uk"), fn(parts.najdi, "najdi"), fn(parts.msa, "msa"));

const HOW_FIRST = four(
  "hear each letter, say it out loud, read the Najdi notes",
  "послухай кожну літеру, скажи її вголос, прочитай примітки про наджді",
  "اسمع كل حرف، قوله بصوت عالي، واقرا ملاحظات النجدي",
  "استمع إلى كل حرف، وانطقه بصوت عالٍ، واقرأ ملاحظات النجدية",
);
const HOW_SECOND = four(
  "cover the forms row and name each form from memory",
  "закрий рядок форм і назви кожну форму з пам'яті",
  "غطّ سطر الأشكال وقول كل شكل من راسك",
  "غطِّ سطر الأشكال وسمِّ كل شكل من ذاكرتك",
);
const GROUP = four("Group", "Група", "المجموعة", "المجموعة");
const VOWELS = four("Vowels", "Голосні", "الحركات", "الحركات");

const task = {
  review: () => ({ id: "review", min: 10, href: "#/quiz", text: four(
    "Warm-up: quiz yourself on every letter so far",
    "Розминка: тест на всі вивчені літери",
    "إحماء: اختبر نفسك في كل الحروف اللي أخذتها",
    "إحماء: اختبر نفسك في جميع الحروف التي تعلّمتها",
  ) }),
  learn: (g, how) => ({ id: "learn", min: 25, href: `#/letters/${g + 1}`,
    text: each(GROUP, (word, l) => `${word} ${g + 1} — ${lettersOf(g)}: ${how[l]}`) }),
  write: g => ({ id: "write", min: 20, text: four(
    `Handwriting: write every form of ${lettersOf(g)} ten times on paper, saying each sound`,
    `Письмо від руки: напиши кожну форму ${lettersOf(g)} десять разів на папері, промовляючи звук`,
    `كتابة باليد: اكتب كل أشكال ${lettersOf(g)} عشر مرات على ورقة، وأنت تقول الصوت`,
    `الكتابة باليد: اكتب كل أشكال ${lettersOf(g)} عشر مرات على الورق وأنت تنطق الصوت`,
  ) }),
  vowels: what => ({ id: "vowels", min: 10, href: "#/vowels", text: each(VOWELS, (word, l) => `${word}: ${what[l]}`) }),
  read: (min = 10) => ({ id: "read", min, href: "#/reading", text: four(
    "Reading: say each practice word out loud before you reveal it",
    "Читання: скажи кожне слово вголос, перш ніж відкрити відповідь",
    "قراية: قول كل كلمة بصوت عالي قبل ما تكشفها",
    "القراءة: انطق كل كلمة بصوت عالٍ قبل أن تكشف إجابتها",
  ) }),
  phrases: () => ({ id: "phrases", min: 10, href: "#/phrases", text: four(
    "Speak: say today's phrases out loud, ten times each, until they come out without thinking",
    "Говоріння: скажи сьогоднішні фрази вголос, кожну десять разів, доки вони не вилітатимуть без роздумів",
    "كلام: قول عبارات اليوم بصوت عالي، كل وحدة عشر مرات، لين تطلع بدون تفكير",
    "المحادثة: انطق عبارات اليوم بصوت عالٍ، كل واحدة عشر مرات، حتى تخرج دون تفكير",
  ) }),
  listen: () => ({ id: "listen", min: 15, text: four(
    "Listen: 15 minutes of Najdi — her voice notes, or daily-life vlogs on Snapchat or TikTok. Don't try to understand yet; get used to the sound",
    "Аудіювання: 15 хвилин наджді — її голосові або щоденні влоги в Snapchat чи TikTok. Поки не намагайся зрозуміти — просто звикай до звучання",
    "استماع: 15 دقيقة نجدي — فويساتها، أو فلوقات يومية في سناب أو تيك توك. لا تحاول تفهم الحين؛ بس تعوّد على الصوت",
    "الاستماع: 15 دقيقة من النجدية — رسائلها الصوتية أو مقاطع الحياة اليومية على سناب شات أو تيك توك. لا تحاول الفهم الآن، بل اعتد على الصوت",
  ) }),
  tutor: () => ({ id: "tutor", min: 15, text: four(
    "Find a Riyadh-born tutor (speaking only, 45 min) and book two sessions a week, starting Monday 5 October",
    "Знайди викладача, народженого в Ер-Ріяді (лише розмова, 45 хв), і забронюй два заняття на тиждень, починаючи з понеділка, 5 жовтня",
    "دوّر مدرّس من أهل الرياض (كلام بس، 45 دقيقة) واحجز حصتين بالأسبوع، تبدأ يوم الاثنين 5 أكتوبر",
    "ابحث عن معلّم من مواليد الرياض (محادثة فقط، 45 دقيقة) واحجز حصتين أسبوعيًا تبدأ يوم الاثنين 5 أكتوبر",
  ) }),
};

const firstDay = g => [task.review(), task.learn(g, HOW_FIRST), task.write(g), task.phrases(), task.listen()];
const secondDay = g => [task.review(), task.learn(g, HOW_SECOND), task.write(g), task.read(), task.phrases(), task.listen()];

export const SCRIPT_DAYS = {
  1: { group: 0, focus: four("Meet ا ب ت ث ن ي — their shapes and sounds", "Знайомство з ا ب ت ث ن ي — їхні форми та звуки", "تعرّف على ا ب ت ث ن ي — أشكالها وأصواتها", "تعرّف إلى ا ب ت ث ن ي — أشكالها وأصواتها"), tasks: [
    task.learn(0, HOW_FIRST),
    task.vowels(four("the three short vowels — fatḥa, kasra, ḍamma — on ب", "три короткі голосні — фатха, касра, дамма — на ب", "الحركات القصيرة الثلاث — الفتحة والكسرة والضمة — على الباء", "الحركات القصيرة الثلاث — الفتحة والكسرة والضمة — على الباء")),
    task.write(0), task.phrases(), task.listen(),
  ] },
  2: { group: 0, focus: four("Group 1 again — all four forms, then read your first real words", "Знову група 1 — усі чотири форми, а потім перші справжні слова", "المجموعة 1 مرة ثانية — الأشكال الأربعة، وبعدين أول كلمات حقيقية تقراها", "المجموعة 1 مجددًا — الأشكال الأربعة، ثم أولى الكلمات الحقيقية"), tasks: [
    task.review(), task.learn(0, HOW_SECOND), task.write(0),
    task.vowels(four("long vowels with ا and ي — bā, bī", "довгі голосні з ا та ي — bā, bī", "المد بالألف والياء — bā، bī", "المدّ بالألف والياء — bā، bī")),
    task.read(), task.phrases(), task.listen(),
  ] },
  3: { group: 1, focus: four("ج ح خ — and ح, a sound Ukrainian doesn't have", "ج ح خ — і ح, звук, якого немає в українській", "ج ح خ — والحاء، صوت ما هو موجود بالأوكراني", "ج ح خ — والحاء، وهو صوت غير موجود في الأوكرانية"), tasks: firstDay(1) },
  4: { group: 1, focus: four("Group 2 again — forms, and words built from groups 1–2", "Знову група 2 — форми та слова з літер груп 1–2", "المجموعة 2 مرة ثانية — الأشكال، وكلمات من حروف المجموعتين 1 و2", "المجموعة 2 مجددًا — الأشكال وكلمات من حروف المجموعتين 1 و2"), tasks: secondDay(1) },
  5: { group: 2, focus: four("د ذ ر ز و — the letters that never join forward", "د ذ ر ز و — літери, що не з'єднуються з наступною", "د ذ ر ز و — الحروف اللي ما تتصل باللي بعدها", "د ذ ر ز و — الحروف التي لا تتصل بما بعدها"),
    tasks: [...firstDay(2), task.vowels(four("و as a long vowel — bū", "و як довга голосна — bū", "الواو كحرف مد — bū", "الواو حرف مدّ — bū"))] },
  6: { group: 2, focus: four("Group 3 again — plus sukūn and shadda", "Знову група 3 — плюс сукун і шадда", "المجموعة 3 مرة ثانية — ومعها السكون والشدة", "المجموعة 3 مجددًا — ومعها السكون والشدّة"),
    tasks: [...secondDay(2), task.vowels(four("sukūn (no vowel) and shadda (double letter)", "сукун (без голосної) і шадда (подвоєна літера)", "السكون (بدون حركة) والشدة (حرف مضاعف)", "السكون (بلا حركة) والشدّة (حرف مضعّف)"))] },
  7: { group: 3, focus: four("س ش ص ض — your first heavy letters", "س ش ص ض — твої перші важкі літери", "س ش ص ض — أول حروف ثقيلة", "س ش ص ض — أولى الحروف المفخّمة"), tasks: firstDay(3) },
  8: { group: 3, focus: four("Heavy vs light: hear the difference between س and ص", "Важкі й легкі: почуй різницю між س і ص", "الثقيل والخفيف: اسمع الفرق بين السين والصاد", "المفخّم والمرقّق: استمع إلى الفرق بين السين والصاد"), tasks: [...secondDay(3), task.tutor()] },
  9: { group: 4, focus: four("ط ظ ع غ — the throat letters. Slowest days of the plan; that's normal", "ط ظ ع غ — горлові літери. Найповільніші дні плану, і це нормально", "ط ظ ع غ — حروف الحلق. أبطأ أيام الخطة، وهذا عادي", "ط ظ ع غ — الحروف الحلقية. أبطأ أيام الخطة، وهذا طبيعي"), tasks: firstDay(4) },
  10: { group: 4, focus: four("ع and غ out loud until they stop feeling strange", "ع і غ вголос, доки вони не перестануть здаватися дивними", "العين والغين بصوت عالي لين ما عادت غريبة عليك", "العين والغين بصوت عالٍ حتى تألفهما"), tasks: secondDay(4) },
  11: { group: 5, focus: four("ف ق ك ل م ه — and ق, which is g in Najdi", "ف ق ك ل م ه — і ق, яка в наджді звучить як ґ", "ف ق ك ل م ه — والقاف، اللي تنقال g بالنجدي", "ف ق ك ل م ه — والقاف التي تُنطق g في النجدية"), tasks: firstDay(5) },
  12: { group: 5, focus: four("Group 6 again. You now know all 28 letters", "Знову група 6. Тепер ти знаєш усі 28 літер", "المجموعة 6 مرة ثانية. الحين تعرف الـ28 حرف كلها", "المجموعة 6 مجددًا. أصبحت تعرف الحروف الثمانية والعشرين كلها"), tasks: secondDay(5) },
  13: { group: null, focus: four("The four extras — ء ة ى لا — and a full review", "Чотири додаткові знаки — ء ة ى لا — і повне повторення", "الأربع الإضافية — ء ة ى لا — ومراجعة كاملة", "العلامات الأربع — ء ة ى لا — ومراجعة شاملة"), tasks: [
    { id: "quiz", min: 15, href: "#/quiz", text: four("Quiz: all six groups", "Тест: усі шість груп", "اختبار: كل المجموعات الست", "اختبار: المجموعات الست كلها") },
    task.vowels(four("the four extras — hamza, tāʾ marbūṭa, alif maqṣūra, lām-alif", "чотири додаткові знаки — хамза, та марбута, аліф максура, лям-аліф", "الأربع الإضافية — الهمزة والتاء المربوطة والألف المقصورة واللام ألف", "العلامات الأربع — الهمزة والتاء المربوطة والألف المقصورة واللام ألف")),
    { id: "write", min: 20, text: four("Handwriting: all 28 letters in their alone form, in alphabet order", "Письмо від руки: усі 28 літер в окремій формі, в порядку абетки", "كتابة باليد: الـ28 حرف بشكلها لحالها، بترتيب الأبجدية", "الكتابة باليد: الحروف الثمانية والعشرون منفردةً بالترتيب الأبجدي") },
    task.read(15), task.phrases(), task.listen(),
  ] },
  14: { group: null, focus: four("Test day: read any word slowly, write every letter in every form", "День перевірки: повільно прочитати будь-яке слово, написати кожну літеру в кожній формі", "يوم الاختبار: تقرا أي كلمة على مهلك، وتكتب كل حرف بكل أشكاله", "يوم الاختبار: قراءة أي كلمة ببطء، وكتابة كل حرف بجميع أشكاله"), tasks: [
    { id: "quiz", min: 20, href: "#/quiz", text: four("Quiz: all groups — aim for 25 correct in a row", "Тест: усі групи — мета 25 правильних поспіль", "اختبار: كل المجموعات — الهدف 25 صح ورا بعض", "اختبار: جميع المجموعات — الهدف 25 إجابة صحيحة متتالية") },
    task.read(20),
    { id: "dictation", min: 20, text: four("From memory: write all 28 letters without looking, then check against the Letters page", "З пам'яті: напиши всі 28 літер, не підглядаючи, а тоді звір зі сторінкою «Літери»", "من راسك: اكتب الـ28 حرف بدون ما تطالع، بعدين قارنها بصفحة الحروف", "من الذاكرة: اكتب الحروف الثمانية والعشرين دون النظر، ثم قارنها بصفحة الحروف") },
    { id: "phrases", min: 15, href: "#/phrases", text: four("Speak: every phrase from the last two weeks, out loud", "Говоріння: усі фрази за останні два тижні, вголос", "كلام: كل عبارات الأسبوعين اللي فاتوا، بصوت عالي", "المحادثة: جميع عبارات الأسبوعين الماضيين بصوت عالٍ") },
    task.listen(),
  ] },
};

// "A normal day (90 minutes)" and "A normal week" — NAJDI-PLAN.md Part 3.
const DAY_BLOCKS = [
  { id: "cards", min: 20, href: "#/cards/study", text: four(
    "Cards: review, then 3–5 new words — always as whole sentences with audio",
    "Картки: повторення, потім 3–5 нових слів — завжди цілими реченнями з аудіо",
    "الكروت: مراجعة، وبعدين 3–5 كلمات جديدة — دايم بجمل كاملة مع صوت",
    "البطاقات: مراجعة، ثم 3–5 كلمات جديدة — دائمًا في جمل كاملة مع الصوت",
  ) },
  { id: "listening", min: 40, text: four(
    "Listening: her voice notes first, then short Najdi vlogs or snaps. Half focused, half in the background",
    "Аудіювання: спершу її голосові, потім короткі влоги чи снепи наджді. Половину уважно, половину фоном",
    "استماع: فويساتها أول، وبعدين فلوقات أو سنابات نجدية قصيرة. نصها بتركيز ونصها بالخلفية",
    "الاستماع: رسائلها الصوتية أولًا، ثم مقاطع نجدية قصيرة. نصف الوقت بتركيز ونصفه في الخلفية",
  ) },
  { id: "speaking", min: 30, text: four(
    "Speaking: tutor session, or shadow her voice notes out loud, or record a voice note back to her",
    "Говоріння: заняття з викладачем, або повторюй уголос за її голосовими, або запиши їй голосове у відповідь",
    "كلام: حصة مع المدرّس، أو عيد فويساتها بصوت عالي، أو سجّل لها فويس ترد فيه",
    "المحادثة: حصة مع المعلّم، أو ردّد رسائلها الصوتية بصوت عالٍ، أو سجّل لها رسالة صوتية ردًّا",
  ) },
];
const WEEK = [
  four(
    "2 tutor sessions — 45 min, Riyadh-born tutor, speaking only. They replace that day's speaking block.",
    "2 заняття з викладачем — по 45 хв, викладач родом з Ер-Ріяда, лише розмова. Вони замінюють блок говоріння того дня.",
    "حصتين مع المدرّس — 45 دقيقة، مدرّس من أهل الرياض، كلام بس. تاخذ مكان وقت الكلام في ذاك اليوم.",
    "حصتان مع المعلّم — 45 دقيقة لكل منهما، معلّم من مواليد الرياض، محادثة فقط، وتحلّان محلّ فقرة المحادثة في ذلك اليوم.",
  ),
  four(
    "1 review day at the weekend: write every new word by hand three times.",
    "1 день повторення на вихідних: напиши кожне нове слово від руки тричі.",
    "يوم مراجعة بالويكند: اكتب كل كلمة جديدة بيدك ثلاث مرات.",
    "يوم مراجعة في عطلة نهاية الأسبوع: اكتب كل كلمة جديدة بيدك ثلاث مرات.",
  ),
  four(
    "Every day: one small ritual with her in Arabic — a good-morning, a good-night, one question.",
    "Щодня: маленький ритуал з нею арабською — «доброго ранку», «на добраніч» або одне запитання.",
    "كل يوم: عادة صغيرة معها بالعربي — صباح الخير، تصبحين على خير، أو سؤال واحد.",
    "كل يوم: عادة صغيرة معها بالعربية — تحية الصباح، أو تحية المساء، أو سؤال واحد.",
  ),
];

// id picks the stage's step on the color ramp (p1–p6) on the calendar, plan and progress pages.
export const PHASES = [
  { id: 1, label: four("Script", "Письмо", "الكتابة", "الكتابة"), name: four("Script", "Письмо", "الكتابة", "الكتابة"),
    when: four("Weeks 1–2", "Тижні 1–2", "الأسبوع 1–2", "الأسبوعان 1–2"),
    start: "2026-09-21", end: "2026-10-04", words: four("—", "—", "—", "—"),
    canDo: four("Read any word slowly, write every letter in every form", "Повільно прочитати будь-яке слово, написати кожну літеру в кожній формі",
                "تقرا أي كلمة على مهلك، وتكتب كل حرف بكل أشكاله", "قراءة أي كلمة ببطء، وكتابة كل حرف بجميع أشكاله"),
    routine: [], weekly: [] },
  { id: 2, label: four("Stage 1", "Етап 1", "المرحلة 1", "المرحلة 1"), name: four("Core", "Основа", "الأساس", "الأساس"),
    when: four("Weeks 3–10", "Тижні 3–10", "الأسابيع 3–10", "الأسابيع 3–10"),
    start: "2026-10-05", end: "2026-11-29", words: four("150 + 50 phrases", "150 + 50 фраз", "150 + 50 عبارة", "150 + 50 عبارة"),
    canDo: four("Greet her, ask and answer “how are you”, say what you're doing, say you don't understand",
                "Привітатися з нею, спитати й відповісти «як справи», сказати, що ти робиш, сказати, що не розумієш",
                "تسلّم عليها، تسأل وترد على «كيفك»، تقول وش قاعد تسوي، وتقول إنك ما فهمت",
                "تحيّتها، والسؤال عن الحال والرد عليه، وقول ما تفعله، والتعبير عن أنك لم تفهم"),
    routine: DAY_BLOCKS, weekly: WEEK },
  { id: 3, label: four("Stage 2", "Етап 2", "المرحلة 2", "المرحلة 2"), name: four("Daily life", "Щоденне життя", "الحياة اليومية", "الحياة اليومية"),
    when: four("Months 3–5", "Місяці 3–5", "الشهور 3–5", "الأشهر 3–5"),
    start: "2026-11-30", end: "2027-02-14", words: four("~320", "~320", "~320", "~320"),
    canDo: four("Talk about your day, food, family, what you'll do tomorrow — in short sentences",
                "Розповісти про свій день, їжу, родину, що робитимеш завтра, — короткими реченнями",
                "تسولف عن يومك والأكل والأهل ووش بتسوي بكرة — بجمل قصيرة",
                "الحديث عن يومك والطعام والعائلة وما ستفعله غدًا — بجمل قصيرة"),
    note: four("Ramadan 2027 falls roughly early February to early March (check the exact dates nearer the time) — learn the special-moment phrases and use them with her.",
               "Рамадан 2027 припадає приблизно на початок лютого — початок березня (точні дати перевір ближче до того часу). Вивчи фрази для особливих моментів і вживай їх з нею.",
               "رمضان 2027 تقريبًا من أول فبراير لأول مارس (تأكد من التاريخ بالضبط لما يقرب) — تعلّم عبارات المناسبات وقلها لها.",
               "يقع رمضان 2027 تقريبًا بين أوائل فبراير وأوائل مارس (تحقّق من التواريخ الدقيقة لاحقًا) — تعلّم عبارات المناسبات واستعملها معها."),
    routine: DAY_BLOCKS, weekly: WEEK },
  { id: 4, label: four("Stage 3", "Етап 3", "المرحلة 3", "المرحلة 3"), name: four("Talking to her", "Розмови з нею", "السوالف معها", "الحديث معها"),
    when: four("Months 5–8", "Місяці 5–8", "الشهور 5–8", "الأشهر 5–8"),
    start: "2027-02-15", end: "2027-05-31", words: four("~500", "~500", "~500", "~500"),
    canDo: four("A 10-minute call mostly in Arabic, with English as a rescue", "провести 10-хвилинну розмову переважно арабською, з англійською як рятівним колом",
                "تسوي مكالمة 10 دقايق أغلبها بالعربي، والإنجليزي للطوارئ", "إجراء مكالمة مدتها عشر دقائق معظمها بالعربية، مع الإنجليزية عند الحاجة"),
    routine: DAY_BLOCKS, weekly: WEEK },
  { id: 5, label: four("Stage 4", "Етап 4", "المرحلة 4", "المرحلة 4"), name: four("Her words", "Її слова", "كلماتها", "كلماتها"),
    when: four("Months 8–12", "Місяці 8–12", "الشهور 8–12", "الأشهر 8–12"),
    start: "2027-06-01", end: "2027-09-30", words: four("~750", "~750", "~750", "~750"),
    canDo: four("Tell a story about your week in the past tense; follow her voice notes on familiar topics",
                "Розповісти про свій тиждень у минулому часі; розуміти її голосові на знайомі теми",
                "تحكي عن أسبوعك بالماضي، وتفهم فويساتها في المواضيع اللي تعرفها",
                "رواية أحداث أسبوعك بصيغة الماضي، وفهم رسائلها الصوتية في الموضوعات المألوفة"),
    note: four("The new words come from her: her word of the day, lines from her voice notes, and every word your tutor corrects.",
               "Нові слова приходять від неї: її слово дня, фрази з її голосових і кожне слово, яке виправить викладач.",
               "الكلمات الجديدة تجي منها: كلمتها اليومية، وجمل من فويساتها، وكل كلمة يصححها المدرّس.",
               "تأتي الكلمات الجديدة منها: كلمتها اليومية، وجمل من رسائلها الصوتية، وكل كلمة يصحّحها المعلّم."),
    routine: DAY_BLOCKS, weekly: WEEK },
  { id: 6, label: four("Stage 5", "Етап 5", "المرحلة 5", "المرحلة 5"), name: four("Her words, deeper", "Її слова, глибше", "كلماتها، أعمق", "كلماتها، بعمق أكبر"),
    when: four("Months 12–15", "Місяці 12–15", "الشهور 12–15", "الأشهر 12–15"),
    start: "2027-10-01", end: "2027-12-31", words: four("~1000", "~1000", "~1000", "~1000"),
    canDo: four("A 30-minute call in Arabic; joke, disagree, explain feelings simply",
                "провести 30-хвилинну розмову арабською; жартувати, не погоджуватися, просто пояснювати почуття",
                "تسوي مكالمة 30 دقيقة بالعربي؛ تمزح وتختلف معها وتشرح مشاعرك ببساطة",
                "إجراء مكالمة مدتها ثلاثون دقيقة بالعربية، والمزاح والاختلاف في الرأي والتعبير عن المشاعر ببساطة"),
    routine: DAY_BLOCKS, weekly: WEEK },
];
