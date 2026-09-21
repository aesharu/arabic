// The 15-month roadmap. Mirrors NAJDI-PLAN.md Part 3 — that file is the source of truth, so change both together.
// The two Script weeks are planned day by day (two days per letter group); from week 3 every day is the
// plan's three blocks: cards, listening, speaking.
// A task is { id, min, text: { en, uk }, href? }. All texts are { en, uk }.
import { GROUPS } from "./letters.js";

const lettersOf = g => GROUPS[g].letters.map(l => l.char).join(" ");
const both = (en, uk) => ({ en, uk });

const HOW_FIRST = both("hear each letter, say it out loud, read the Najdi notes", "послухай кожну літеру, скажи її вголос, прочитай примітки про наджді");
const HOW_SECOND = both("cover the forms row and name each form from memory", "закрий рядок форм і назви кожну форму з пам'яті");

const task = {
  review: () => ({ id: "review", min: 10, href: "#/quiz", text: both("Warm-up: quiz yourself on every letter so far", "Розминка: тест на всі вивчені літери") }),
  learn: (g, how) => ({ id: "learn", min: 25, href: `#/letters/${g + 1}`,
    text: both(`Group ${g + 1} — ${lettersOf(g)}: ${how.en}`, `Група ${g + 1} — ${lettersOf(g)}: ${how.uk}`) }),
  write: g => ({ id: "write", min: 20,
    text: both(`Handwriting: write every form of ${lettersOf(g)} ten times on paper, saying each sound`,
               `Письмо від руки: напиши кожну форму ${lettersOf(g)} десять разів на папері, промовляючи звук`) }),
  vowels: what => ({ id: "vowels", min: 10, href: "#/vowels", text: both(`Vowels: ${what.en}`, `Голосні: ${what.uk}`) }),
  read: (min = 10) => ({ id: "read", min, href: "#/reading",
    text: both("Reading: say each practice word out loud before you reveal it", "Читання: скажи кожне слово вголос, перш ніж відкрити відповідь") }),
  phrases: () => ({ id: "phrases", min: 10, href: "#/phrases",
    text: both("Speak: say today's phrases out loud, ten times each, until they come out without thinking",
               "Говоріння: скажи сьогоднішні фрази вголос, кожну десять разів, доки вони не вилітатимуть без роздумів") }),
  listen: () => ({ id: "listen", min: 15,
    text: both("Listen: 15 minutes of Najdi — her voice notes, or daily-life vlogs on Snapchat or TikTok. Don't try to understand yet; get used to the sound",
               "Аудіювання: 15 хвилин наджді — її голосові або щоденні влоги в Snapchat чи TikTok. Поки не намагайся зрозуміти — просто звикай до звучання") }),
  tutor: () => ({ id: "tutor", min: 15,
    text: both("Find a Riyadh-born tutor (speaking only, 45 min) and book two sessions a week, starting Monday 5 October",
               "Знайди викладача, народженого в Ер-Ріяді (лише розмова, 45 хв), і забронюй два заняття на тиждень, починаючи з понеділка, 5 жовтня") }),
};

const firstDay = g => [task.review(), task.learn(g, HOW_FIRST), task.write(g), task.phrases(), task.listen()];
const secondDay = g => [task.review(), task.learn(g, HOW_SECOND), task.write(g), task.read(), task.phrases(), task.listen()];

export const SCRIPT_DAYS = {
  1: { group: 0, focus: both("Meet ا ب ت ث ن ي — their shapes and sounds", "Знайомство з ا ب ت ث ن ي — їхні форми та звуки"), tasks: [
    task.learn(0, HOW_FIRST),
    task.vowels(both("the three short vowels — fatḥa, kasra, ḍamma — on ب", "три короткі голосні — фатха, касра, дамма — на ب")),
    task.write(0), task.phrases(), task.listen(),
  ] },
  2: { group: 0, focus: both("Group 1 again — all four forms, then read your first real words", "Знову група 1 — усі чотири форми, а потім перші справжні слова"), tasks: [
    task.review(), task.learn(0, HOW_SECOND), task.write(0),
    task.vowels(both("long vowels with ا and ي — bā, bī", "довгі голосні з ا та ي — bā, bī")), task.read(), task.phrases(), task.listen(),
  ] },
  3: { group: 1, focus: both("ج ح خ — and ح, a sound Ukrainian doesn't have", "ج ح خ — і ح, звук, якого немає в українській"), tasks: firstDay(1) },
  4: { group: 1, focus: both("Group 2 again — forms, and words built from groups 1–2", "Знову група 2 — форми та слова з літер груп 1–2"), tasks: secondDay(1) },
  5: { group: 2, focus: both("د ذ ر ز و — the letters that never join forward", "د ذ ر ز و — літери, що не з'єднуються з наступною"),
    tasks: [...firstDay(2), task.vowels(both("و as a long vowel — bū", "و як довга голосна — bū"))] },
  6: { group: 2, focus: both("Group 3 again — plus sukūn and shadda", "Знову група 3 — плюс сукун і шадда"),
    tasks: [...secondDay(2), task.vowels(both("sukūn (no vowel) and shadda (double letter)", "сукун (без голосної) і шадда (подвоєна літера)"))] },
  7: { group: 3, focus: both("س ش ص ض — your first heavy letters", "س ش ص ض — твої перші важкі літери"), tasks: firstDay(3) },
  8: { group: 3, focus: both("Heavy vs light: hear the difference between س and ص", "Важкі й легкі: почуй різницю між س і ص"), tasks: [...secondDay(3), task.tutor()] },
  9: { group: 4, focus: both("ط ظ ع غ — the throat letters. Slowest days of the plan; that's normal", "ط ظ ع غ — горлові літери. Найповільніші дні плану, і це нормально"), tasks: firstDay(4) },
  10: { group: 4, focus: both("ع and غ out loud until they stop feeling strange", "ع і غ вголос, доки вони не перестануть здаватися дивними"), tasks: secondDay(4) },
  11: { group: 5, focus: both("ف ق ك ل م ه — and ق, which is g in Najdi", "ف ق ك ل م ه — і ق, яка в наджді звучить як ґ"), tasks: firstDay(5) },
  12: { group: 5, focus: both("Group 6 again. You now know all 28 letters", "Знову група 6. Тепер ти знаєш усі 28 літер"), tasks: secondDay(5) },
  13: { group: null, focus: both("The four extras — ء ة ى لا — and a full review", "Чотири додаткові знаки — ء ة ى لا — і повне повторення"), tasks: [
    { id: "quiz", min: 15, href: "#/quiz", text: both("Quiz: all six groups", "Тест: усі шість груп") },
    task.vowels(both("the four extras — hamza, tāʾ marbūṭa, alif maqṣūra, lām-alif", "чотири додаткові знаки — хамза, та марбута, аліф максура, лям-аліф")),
    { id: "write", min: 20, text: both("Handwriting: all 28 letters in their alone form, in alphabet order", "Письмо від руки: усі 28 літер в окремій формі, в порядку абетки") },
    task.read(15), task.phrases(), task.listen(),
  ] },
  14: { group: null, focus: both("Test day: read any word slowly, write every letter in every form", "День перевірки: повільно прочитати будь-яке слово, написати кожну літеру в кожній формі"), tasks: [
    { id: "quiz", min: 20, href: "#/quiz", text: both("Quiz: all groups — aim for 25 correct in a row", "Тест: усі групи — мета 25 правильних поспіль") },
    task.read(20),
    { id: "dictation", min: 20, text: both("From memory: write all 28 letters without looking, then check against the Letters page", "З пам'яті: напиши всі 28 літер, не підглядаючи, а тоді звір зі сторінкою «Літери»") },
    { id: "phrases", min: 15, href: "#/phrases", text: both("Speak: every phrase from the last two weeks, out loud", "Говоріння: усі фрази за останні два тижні, вголос") },
    task.listen(),
  ] },
};

// "A normal day (90 minutes)" and "A normal week" — NAJDI-PLAN.md Part 3.
const DAY_BLOCKS = [
  { id: "cards", min: 20, text: both("Cards: review, then 3–5 new words — always as whole sentences with audio",
                                     "Картки: повторення, потім 3–5 нових слів — завжди цілими реченнями з аудіо") },
  { id: "listening", min: 40, text: both("Listening: her voice notes first, then short Najdi vlogs or snaps. Half focused, half in the background",
                                         "Аудіювання: спершу її голосові, потім короткі влоги чи снепи наджді. Половину уважно, половину фоном") },
  { id: "speaking", min: 30, text: both("Speaking: tutor session, or shadow her voice notes out loud, or record a voice note back to her",
                                        "Говоріння: заняття з викладачем, або повторюй уголос за її голосовими, або запиши їй голосове у відповідь") },
];
const WEEK = [
  both("2 tutor sessions — 45 min, Riyadh-born tutor, speaking only. They replace that day's speaking block.",
       "2 заняття з викладачем — по 45 хв, викладач родом з Ер-Ріяда, лише розмова. Вони замінюють блок говоріння того дня."),
  both("1 review day at the weekend: write every new word by hand three times.",
       "1 день повторення на вихідних: напиши кожне нове слово від руки тричі."),
  both("Every day: one small ritual with her in Arabic — a good-morning, a good-night, one question.",
       "Щодня: маленький ритуал з нею арабською — «доброго ранку», «на добраніч» або одне запитання."),
];

// id picks the colour (p1–p6) on the calendar and plan pages.
export const PHASES = [
  { id: 1, label: both("Script", "Письмо"), name: both("Script", "Письмо"), when: both("Weeks 1–2", "Тижні 1–2"),
    start: "2026-09-21", end: "2026-10-04", words: both("—", "—"),
    canDo: both("Read any word slowly, write every letter in every form", "Повільно прочитати будь-яке слово, написати кожну літеру в кожній формі"),
    routine: [], weekly: [] },
  { id: 2, label: both("Stage 1", "Етап 1"), name: both("Core", "Основа"), when: both("Weeks 3–10", "Тижні 3–10"),
    start: "2026-10-05", end: "2026-11-29", words: both("150 + 50 phrases", "150 + 50 фраз"),
    canDo: both("Greet her, ask and answer “how are you”, say what you're doing, say you don't understand",
                "Привітатися з нею, спитати й відповісти «як справи», сказати, що ти робиш, сказати, що не розумієш"),
    routine: DAY_BLOCKS, weekly: WEEK },
  { id: 3, label: both("Stage 2", "Етап 2"), name: both("Daily life", "Щоденне життя"), when: both("Months 3–5", "Місяці 3–5"),
    start: "2026-11-30", end: "2027-02-14", words: both("~320", "~320"),
    canDo: both("Talk about your day, food, family, what you'll do tomorrow — in short sentences",
                "Розповісти про свій день, їжу, родину, що робитимеш завтра, — короткими реченнями"),
    note: both("Ramadan 2027 falls roughly early February to early March (check the exact dates nearer the time) — learn the special-moment phrases and use them with her.",
               "Рамадан 2027 припадає приблизно на початок лютого — початок березня (точні дати перевір ближче до того часу). Вивчи фрази для особливих моментів і вживай їх з нею."),
    routine: DAY_BLOCKS, weekly: WEEK },
  { id: 4, label: both("Stage 3", "Етап 3"), name: both("Talking to her", "Розмови з нею"), when: both("Months 5–8", "Місяці 5–8"),
    start: "2027-02-15", end: "2027-05-31", words: both("~500", "~500"),
    canDo: both("A 10-minute call mostly in Arabic, with English as a rescue", "10-хвилинний дзвінок переважно арабською, з англійською як рятівним колом"),
    routine: DAY_BLOCKS, weekly: WEEK },
  { id: 5, label: both("Stage 4", "Етап 4"), name: both("Her words", "Її слова"), when: both("Months 8–12", "Місяці 8–12"),
    start: "2027-06-01", end: "2027-09-30", words: both("~750", "~750"),
    canDo: both("Tell a story about your week in the past tense; follow her voice notes on familiar topics",
                "Розповісти про свій тиждень у минулому часі; розуміти її голосові на знайомі теми"),
    note: both("The new words come from her: her word of the day, lines from her voice notes, and every word your tutor corrects.",
               "Нові слова приходять від неї: її слово дня, фрази з її голосових і кожне слово, яке виправить викладач."),
    routine: DAY_BLOCKS, weekly: WEEK },
  { id: 6, label: both("Stage 5", "Етап 5"), name: both("Her words, deeper", "Її слова, глибше"), when: both("Months 12–15", "Місяці 12–15"),
    start: "2027-10-01", end: "2027-12-31", words: both("~1000", "~1000"),
    canDo: both("A 30-minute call in Arabic; joke, disagree, explain feelings simply",
                "30-хвилинний дзвінок арабською; жартувати, не погоджуватися, просто пояснювати почуття"),
    routine: DAY_BLOCKS, weekly: WEEK },
];
