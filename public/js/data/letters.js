// The 28 letters in six shape-based groups, two study days each.
//   char, name, nameAr     the letter and its name
//   translit, sound        Latin spelling and how to say it (Najdi first when it differs)
//   ua                     closest Ukrainian sound
//   example {ar, tr, en}   a Najdi word; tr is the Najdi pronunciation
//   najdi                  optional Najdi note
//   hard                   a sound Ukrainian doesn't have
//   nonJoining             never connects to the letter after it
//   check, checkNote       needs a native speaker's OK (shown as "check with tutor")
export const GROUPS = [
  {
    days: "1–2",
    title: "Alif and the boat letters",
    note: "ب ت ث ن ي share one body at the start and middle of a word. Only the dots tell them apart.",
    letters: [
      {
        char: "ا", name: "alif", nameAr: "ألف", translit: "ā", sound: "Long a, as in father.", ua: "а (довге)", nonJoining: true,
        example: { ar: "أبغى", tr: "abgha", en: "I want" },
        najdi: "Najdi mostly says أبي (abi) for “I want”; أبغى means the same and is more pan-Saudi. Formal Arabic says أريد — you won't need it.",
      },
      { char: "ب", name: "bāʾ", nameAr: "باء", translit: "b", sound: "b as in book.", ua: "б", example: { ar: "باب", tr: "bāb", en: "door" } },
      { char: "ت", name: "tāʾ", nameAr: "تاء", translit: "t", sound: "t, clean and light.", ua: "т", example: { ar: "تمر", tr: "tamr", en: "dates" } },
      {
        char: "ث", name: "thāʾ", nameAr: "ثاء", translit: "th", sound: "th as in think. Tongue tip between the teeth.", ua: "немає — язик між зубами", hard: true,
        example: { ar: "ثلاثة", tr: "thalātha", en: "three" },
        najdi: "Najdi keeps this sound. Egyptian turns it into t or s — don't copy them.",
      },
      { char: "ن", name: "nūn", nameAr: "نون", translit: "n", sound: "n. At the end of a word it drops into a bowl.", ua: "н", example: { ar: "نور", tr: "nūr", en: "light" } },
      {
        char: "ي", name: "yāʾ", nameAr: "ياء", translit: "y / ī", sound: "y as in yes, or a long ee.", ua: "й, або довге і",
        example: { ar: "يوم", tr: "yōm", en: "day" },
        najdi: "In Najdi, ay usually becomes ē and aw becomes ō. That's why يوم is yōm.",
      },
    ],
  },
  {
    days: "3–4",
    title: "The hooks",
    note: "One shape, three sounds: dot below, no dot, dot above.",
    letters: [
      { char: "ج", name: "jīm", nameAr: "جيم", translit: "j", sound: "j as in jam.", ua: "дж", example: { ar: "جمل", tr: "jamal", en: "camel" } },
      {
        char: "ح", name: "ḥāʾ", nameAr: "حاء", translit: "ḥ", sound: "A strong breathy h from deep in the throat, like fogging glasses but tighter.", ua: "немає", hard: true,
        example: { ar: "الحين", tr: "al-ḥīn", en: "now" },
        najdi: "الحين is pure Najdi. You'll hear it all day.",
      },
      { char: "خ", name: "khāʾ", nameAr: "خاء", translit: "kh", sound: "kh as in Bach.", ua: "х — точно як українське", example: { ar: "خبز", tr: "khubz", en: "bread" } },
    ],
  },
  {
    days: "5–6",
    title: "Letters that never join forward",
    note: "These never connect to the letter after them, so words break into pieces. ا is one of them too.",
    letters: [
      {
        char: "د", name: "dāl", nameAr: "دال", translit: "d", sound: "d.", ua: "д", nonJoining: true,
        example: { ar: "دار", tr: "dār", en: "house" },
        check: true, checkNote: "The everyday Najdi word for “house” is usually بيت (bēt). Ask your tutor how دار is used.",
      },
      {
        char: "ذ", name: "dhāl", nameAr: "ذال", translit: "dh", sound: "th as in this.", ua: "немає — дзвінке th", hard: true, nonJoining: true,
        example: { ar: "ذهب", tr: "dhahab", en: "gold" },
        najdi: "Kept in Najdi, just like ث.",
      },
      {
        char: "ر", name: "rāʾ", nameAr: "راء", translit: "r", sound: "A tapped or rolled r.", ua: "р — ідеально як українське", nonJoining: true,
        example: { ar: "رز", tr: "rizz", en: "rice" },
      },
      {
        char: "ز", name: "zāy", nameAr: "زاي", translit: "z", sound: "z.", ua: "з", nonJoining: true,
        example: { ar: "زين", tr: "zēn", en: "good, fine" },
        najdi: "زين is the Najdi “okay / good”. Use it every day.",
      },
      { char: "و", name: "wāw", nameAr: "واو", translit: "w / ū", sound: "w as in wow, or a long oo.", ua: "англ. w, або довге у", nonJoining: true, example: { ar: "وين", tr: "wēn", en: "where" } },
    ],
  },
  {
    days: "7–8",
    title: "Teeth and the first heavy letters",
    note: "س ش have teeth, ص ض have a loop. Heavy letters darken the vowels next to them.",
    letters: [
      { char: "س", name: "sīn", nameAr: "سين", translit: "s", sound: "s.", ua: "с", example: { ar: "سلام", tr: "salām", en: "hello, peace" } },
      {
        char: "ش", name: "shīn", nameAr: "شين", translit: "sh", sound: "sh as in shop.", ua: "ш",
        example: { ar: "وش", tr: "wesh", en: "what?" },
        najdi: "وش is the signature Najdi word. Other dialects say ايش or شو.",
      },
      { char: "ص", name: "ṣād", nameAr: "صاد", translit: "ṣ", sound: "A heavy s: tongue low, mouth full and rounded.", ua: "важке с", hard: true, example: { ar: "صباح", tr: "ṣabāḥ", en: "morning" } },
      {
        char: "ض", name: "ḍād", nameAr: "ضاد", translit: "ḍ → ẓ", sound: "In Najdi, a heavy th as in this — the same sound as ظ. Formal Arabic says a heavy d.", ua: "важке дзвінке th (у формальній — важке д)", hard: true,
        example: { ar: "ضيف", tr: "ẓēf", en: "guest" },
        najdi: "In Najdi, ض and ظ sound the same: a heavy th as in this. So ضيف is ẓēf, not ḍēf.",
      },
    ],
  },
  {
    days: "9–10",
    title: "The throat letters",
    note: "The hardest two days. Go slow and say every sound out loud.",
    letters: [
      { char: "ط", name: "ṭāʾ", nameAr: "طاء", translit: "ṭ", sound: "A heavy t.", ua: "важке т", hard: true, example: { ar: "طيب", tr: "ṭayyib", en: "okay, good" } },
      { char: "ظ", name: "ẓāʾ", nameAr: "ظاء", translit: "ẓ", sound: "A heavy th as in this.", ua: "немає", hard: true, example: { ar: "ظهر", tr: "ẓuhr", en: "noon" } },
      {
        char: "ع", name: "ʿayn", nameAr: "عين", translit: "ʿ", sound: "Squeeze the throat and voice through it, like the very start of a gag, gently.", ua: "немає", hard: true,
        example: { ar: "عيال", tr: "ʿiyāl", en: "kids, guys" },
        najdi: "عيال means kids — and between friends, “guys”.",
      },
      { char: "غ", name: "ghayn", nameAr: "غين", translit: "gh", sound: "A gargled r, like the French r in Paris.", ua: "дзвінке х, як гаркаве р", hard: true, example: { ar: "غالي", tr: "ghāli", en: "expensive, dear" } },
    ],
  },
  {
    days: "11–12",
    title: "The last six",
    note: "Mostly friendly sounds — and ق, the most Najdi letter of all.",
    letters: [
      { char: "ف", name: "fāʾ", nameAr: "فاء", translit: "f", sound: "f.", ua: "ф", example: { ar: "فلوس", tr: "flūs", en: "money" } },
      {
        char: "ق", name: "qāf", nameAr: "قاف", translit: "q → g", sound: "In Najdi, g as in go. In formal Arabic, a deep k from the throat.", ua: "ґ, як у «ґанок» — не українське г",
        example: { ar: "قهوة", tr: "gahwa", en: "coffee" },
        najdi: "The biggest Najdi tell. قال is gāl, قهوة is gahwa.",
      },
      {
        char: "ك", name: "kāf", nameAr: "كاف", translit: "k", sound: "k.", ua: "к",
        example: { ar: "كيف", tr: "kēf", en: "how" },
        najdi: "In traditional Najdi you may hear ك as ц in some words. Recognise it, don't copy it yet.",
      },
      { char: "ل", name: "lām", nameAr: "لام", translit: "l", sound: "A light l, tongue tip on the teeth.", ua: "л, але світліше", example: { ar: "ليش", tr: "lēsh", en: "why" } },
      { char: "م", name: "mīm", nameAr: "ميم", translit: "m", sound: "m.", ua: "м", example: { ar: "موية", tr: "mōya", en: "water" }, check: true, checkNote: "Also ماي (māy)." },
      {
        char: "ه", name: "hāʾ", nameAr: "هاء", translit: "h", sound: "A light breath, as in hello.", ua: "м'якше за українське г — просто видих",
        example: { ar: "هلا", tr: "hala", en: "hi!" },
        najdi: "هلا and هلا والله are everyday Najdi greetings.",
      },
    ],
  },
];

export const ALL_LETTERS = GROUPS.flatMap((g, gi) => g.letters.map(l => ({ ...l, group: gi })));

const TATWEEL = "ـ"; // the joining stroke used to show a letter's connected forms
export const formsOf = l =>
  l.nonJoining
    ? [[l.char, "alone"], [TATWEEL + l.char, "joined from right"]]
    : [[l.char + TATWEEL, "start"], [TATWEEL + l.char + TATWEEL, "middle"], [TATWEEL + l.char, "end"], [l.char, "alone"]];
