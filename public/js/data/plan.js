// The 15-month roadmap. Mirrors NAJDI-PLAN.md Part 3 — that file is the source of truth, so change both together.
// The two Script weeks are planned day by day (two days per letter group); from week 3 every day is the
// plan's three blocks: cards, listening, speaking. A task is { id, min, text, href? }.
import { GROUPS } from "./letters.js";

const lettersOf = g => GROUPS[g].letters.map(l => l.char).join(" ");

const task = {
  review: () => ({ id: "review", min: 10, text: "Warm-up: quiz yourself on every letter so far", href: "#/quiz" }),
  learn: (g, how) => ({ id: "learn", min: 25, text: `Group ${g + 1} — ${lettersOf(g)}: ${how}`, href: `#/letters/${g + 1}` }),
  write: g => ({ id: "write", min: 20, text: `Handwriting: write every form of ${lettersOf(g)} ten times on paper, saying each sound` }),
  vowels: what => ({ id: "vowels", min: 10, text: `Vowels: ${what}`, href: "#/vowels" }),
  read: (min = 10) => ({ id: "read", min, text: "Reading: say each practice word out loud before you reveal it", href: "#/reading" }),
  phrases: () => ({ id: "phrases", min: 10, text: "Speak: say today's phrases out loud, ten times each, until they come out without thinking", href: "#/phrases" }),
  listen: () => ({ id: "listen", min: 15, text: "Listen: 15 minutes of Najdi — her voice notes, or daily-life vlogs on Snapchat or TikTok. Don't try to understand yet; get used to the sound" }),
  tutor: () => ({ id: "tutor", min: 15, text: "Find a Riyadh-born tutor (speaking only, 45 min) and book two sessions a week, starting Monday 5 October" }),
};

const firstDay = g => [task.review(), task.learn(g, "hear each letter, say it out loud, read the Najdi notes"), task.write(g), task.phrases(), task.listen()];
const secondDay = g => [task.review(), task.learn(g, "cover the forms row and name each form from memory"), task.write(g), task.read(), task.phrases(), task.listen()];

export const SCRIPT_DAYS = {
  1: { group: 0, focus: "Meet ا ب ت ث ن ي — their shapes and sounds", tasks: [
    task.learn(0, "hear each letter, say it out loud, read the Najdi notes"),
    task.vowels("the three short vowels — fatḥa, kasra, ḍamma — on ب"),
    task.write(0), task.phrases(), task.listen(),
  ] },
  2: { group: 0, focus: "Group 1 again — all four forms, then read your first real words", tasks: [
    task.review(), task.learn(0, "cover the forms row and name each form from memory"), task.write(0),
    task.vowels("long vowels with ا and ي — bā, bī"), task.read(), task.phrases(), task.listen(),
  ] },
  3: { group: 1, focus: "ج ح خ — and ح, a sound Ukrainian doesn't have", tasks: firstDay(1) },
  4: { group: 1, focus: "Group 2 again — forms, and words built from groups 1–2", tasks: secondDay(1) },
  5: { group: 2, focus: "د ذ ر ز و — the letters that never join forward", tasks: [...firstDay(2), task.vowels("و as a long vowel — bū")] },
  6: { group: 2, focus: "Group 3 again — plus sukūn and shadda", tasks: [...secondDay(2), task.vowels("sukūn (no vowel) and shadda (double letter)")] },
  7: { group: 3, focus: "س ش ص ض — your first heavy letters", tasks: firstDay(3) },
  8: { group: 3, focus: "Heavy vs light: hear the difference between س and ص", tasks: [...secondDay(3), task.tutor()] },
  9: { group: 4, focus: "ط ظ ع غ — the throat letters. Slowest days of the plan; that's normal", tasks: firstDay(4) },
  10: { group: 4, focus: "ع and غ out loud until they stop feeling strange", tasks: secondDay(4) },
  11: { group: 5, focus: "ف ق ك ل م ه — and ق, which is g in Najdi", tasks: firstDay(5) },
  12: { group: 5, focus: "Group 6 again. You now know all 28 letters", tasks: secondDay(5) },
  13: { group: null, focus: "The four extras — ء ة ى لا — and a full review", tasks: [
    { id: "quiz", min: 15, text: "Quiz: all six groups", href: "#/quiz" },
    task.vowels("the four extras — hamza, tāʾ marbūṭa, alif maqṣūra, lām-alif"),
    { id: "write", min: 20, text: "Handwriting: all 28 letters in their alone form, in alphabet order" },
    task.read(15), task.phrases(), task.listen(),
  ] },
  14: { group: null, focus: "Test day: read any word slowly, write every letter in every form", tasks: [
    { id: "quiz", min: 20, text: "Quiz: all groups — aim for 25 correct in a row", href: "#/quiz" },
    task.read(20),
    { id: "dictation", min: 20, text: "From memory: write all 28 letters without looking, then check against the Letters page" },
    { id: "phrases", min: 15, text: "Speak: every phrase from the last two weeks, out loud", href: "#/phrases" },
    task.listen(),
  ] },
};

// "A normal day (90 minutes)" and "A normal week" — NAJDI-PLAN.md Part 3.
const DAY_BLOCKS = [
  { id: "cards", min: 20, text: "Cards: review, then 3–5 new words — always as whole sentences with audio" },
  { id: "listening", min: 40, text: "Listening: her voice notes first, then short Najdi vlogs or snaps. Half focused, half in the background" },
  { id: "speaking", min: 30, text: "Speaking: tutor session, or shadow her voice notes out loud, or record a voice note back to her" },
];
const WEEK = [
  "2 tutor sessions — 45 min, Riyadh-born tutor, speaking only. They replace that day's speaking block.",
  "1 review day at the weekend: write every new word by hand three times.",
  "Every day: one small ritual with her in Arabic — a good-morning, a good-night, one question.",
];

// id picks the colour (p1–p6) on the calendar and plan pages.
export const PHASES = [
  { id: 1, label: "Script", name: "Script", when: "Weeks 1–2", start: "2026-09-21", end: "2026-10-04", words: "—",
    canDo: "Read any word slowly, write every letter in every form", routine: [], weekly: [] },
  { id: 2, label: "Stage 1", name: "Core", when: "Weeks 3–10", start: "2026-10-05", end: "2026-11-29", words: "150 + 50 phrases",
    canDo: "Greet her, ask and answer “how are you”, say what you're doing, say you don't understand", routine: DAY_BLOCKS, weekly: WEEK },
  { id: 3, label: "Stage 2", name: "Daily life", when: "Months 3–5", start: "2026-11-30", end: "2027-02-14", words: "~320",
    canDo: "Talk about your day, food, family, what you'll do tomorrow — in short sentences", routine: DAY_BLOCKS, weekly: WEEK,
    note: "Ramadan 2027 falls roughly early February to early March (check the exact dates nearer the time) — learn the special-moment phrases and use them with her." },
  { id: 4, label: "Stage 3", name: "Talking to her", when: "Months 5–8", start: "2027-02-15", end: "2027-05-31", words: "~500",
    canDo: "A 10-minute call mostly in Arabic, with English as a rescue", routine: DAY_BLOCKS, weekly: WEEK },
  { id: 5, label: "Stage 4", name: "Her words", when: "Months 8–12", start: "2027-06-01", end: "2027-09-30", words: "~750",
    canDo: "Tell a story about your week in the past tense; follow her voice notes on familiar topics", routine: DAY_BLOCKS, weekly: WEEK,
    note: "The new words come from her: her word of the day, lines from her voice notes, and every word your tutor corrects." },
  { id: 6, label: "Stage 5", name: "Her words, deeper", when: "Months 12–15", start: "2027-10-01", end: "2027-12-31", words: "~1000",
    canDo: "A 30-minute call in Arabic; joke, disagree, explain feelings simply", routine: DAY_BLOCKS, weekly: WEEK },
];
