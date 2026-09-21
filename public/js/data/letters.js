// The 28 letters in six shape-based groups, two study days each.
//   char, name, nameAr     the letter and its name
//   translit               Latin spelling of the sound
//   sound {en, uk}         how to say it (Najdi first when it differs from formal Arabic)
//   ua                     closest Ukrainian sound
//   example                a Najdi word: ar + tr (Najdi pronunciation), msa (formal Arabic), en, uk
//   najdi {en, uk}         optional Najdi note
//   hard                   a sound Ukrainian doesn't have
//   nonJoining             never connects to the letter after it
//   check, checkNote       needs a native speaker's OK (shown as "check with tutor")
export const GROUPS = [
  {
    days: "1–2",
    title: { en: "Alif and the boat letters", uk: "Аліф і «човники»" },
    note: {
      en: "ب ت ث ن ي share one body at the start and middle of a word. Only the dots tell them apart.",
      uk: "На початку й у середині слова ب ت ث ن ي мають однакове тіло. Розрізняють їх лише крапки.",
    },
    letters: [
      {
        char: "ا", name: "alif", nameAr: "ألف", translit: "ā", ua: "а (довге)", nonJoining: true,
        sound: { en: "Long a, as in father.", uk: "Довге а, як в англ. father." },
        example: { ar: "أبغى", tr: "abgha", msa: "أريد", en: "I want", uk: "я хочу" },
        najdi: {
          en: "Najdi mostly says أبي (abi) for “I want”; أبغى means the same and is more pan-Saudi. Formal Arabic says أريد — you won't need it.",
          uk: "Для «я хочу» в наджді здебільшого кажуть أبي (abi); أبغى означає те саме й поширене по всій Саудівській Аравії. Формальне أريد тобі не знадобиться.",
        },
      },
      {
        char: "ب", name: "bāʾ", nameAr: "باء", translit: "b", ua: "б",
        sound: { en: "b as in book.", uk: "б." },
        example: { ar: "باب", tr: "bāb", msa: "باب", en: "door", uk: "двері" },
      },
      {
        char: "ت", name: "tāʾ", nameAr: "تاء", translit: "t", ua: "т",
        sound: { en: "t, clean and light.", uk: "т, чисте й легке." },
        example: { ar: "تمر", tr: "tamr", msa: "تمر", en: "dates", uk: "фініки" },
      },
      {
        char: "ث", name: "thāʾ", nameAr: "ثاء", translit: "th", ua: "немає — язик між зубами", hard: true,
        sound: { en: "th as in think. Tongue tip between the teeth.", uk: "th, як в англ. think. Кінчик язика між зубами." },
        example: { ar: "ثلاثة", tr: "thalātha", msa: "ثلاثة", en: "three", uk: "три" },
        najdi: {
          en: "Najdi keeps this sound. Egyptian turns it into t or s — don't copy them.",
          uk: "Наджді зберігає цей звук. Єгиптяни перетворюють його на т або с — не копіюй їх.",
        },
      },
      {
        char: "ن", name: "nūn", nameAr: "نون", translit: "n", ua: "н",
        sound: { en: "n. At the end of a word it drops into a bowl.", uk: "н. У кінці слова опускається «мисочкою» нижче рядка." },
        example: { ar: "نور", tr: "nūr", msa: "نور", en: "light", uk: "світло" },
      },
      {
        char: "ي", name: "yāʾ", nameAr: "ياء", translit: "y / ī", ua: "й, або довге і",
        sound: { en: "y as in yes, or a long ee.", uk: "й, як в англ. yes, або довге і." },
        example: { ar: "يوم", tr: "yōm", msa: "يوم", en: "day", uk: "день" },
        najdi: {
          en: "In Najdi, ay usually becomes ē and aw becomes ō. That's why يوم is yōm.",
          uk: "У наджді ay зазвичай стає ē, а aw — ō. Тому يوم звучить як yōm.",
        },
      },
    ],
  },
  {
    days: "3–4",
    title: { en: "The hooks", uk: "«Гачки»" },
    note: { en: "One shape, three sounds: dot below, no dot, dot above.", uk: "Одна форма — три звуки: крапка знизу, без крапки, крапка зверху." },
    letters: [
      {
        char: "ج", name: "jīm", nameAr: "جيم", translit: "j", ua: "дж",
        sound: { en: "j as in jam.", uk: "дж, як в англ. jam." },
        example: { ar: "جمل", tr: "jamal", msa: "جمل", en: "camel", uk: "верблюд" },
      },
      {
        char: "ح", name: "ḥāʾ", nameAr: "حاء", translit: "ḥ", ua: "немає", hard: true,
        sound: {
          en: "A strong breathy h from deep in the throat, like fogging glasses but tighter.",
          uk: "Сильний придиховий звук з глибини горла — як коли дихаєш на скло, щоб запітніло, але напруженіше.",
        },
        example: { ar: "الحين", tr: "al-ḥīn", msa: "الآن", en: "now", uk: "зараз" },
        najdi: { en: "الحين is pure Najdi. You'll hear it all day.", uk: "الحين — чиста наджді. Чутимеш це слово постійно." },
      },
      {
        char: "خ", name: "khāʾ", nameAr: "خاء", translit: "kh", ua: "х — точно як українське",
        sound: { en: "kh as in Bach.", uk: "х, як у слові «хата»." },
        example: { ar: "خبز", tr: "khubz", msa: "خبز", en: "bread", uk: "хліб" },
      },
    ],
  },
  {
    days: "5–6",
    title: { en: "Letters that never join forward", uk: "Літери, що не з'єднуються з наступною" },
    note: {
      en: "These never connect to the letter after them, so words break into pieces. ا is one of them too.",
      uk: "Вони ніколи не з'єднуються з літерою після себе, тому слова розпадаються на частини. ا — теж із них.",
    },
    letters: [
      {
        char: "د", name: "dāl", nameAr: "دال", translit: "d", ua: "д", nonJoining: true,
        sound: { en: "d.", uk: "д." },
        example: { ar: "دار", tr: "dār", msa: "دار", en: "house", uk: "дім" },
        check: true,
        checkNote: {
          en: "The everyday Najdi word for “house” is usually بيت (bēt). Ask your tutor how دار is used.",
          uk: "У повсякденній наджді «дім» — це зазвичай بيت (bēt). Спитай викладача, як уживають دار.",
        },
      },
      {
        char: "ذ", name: "dhāl", nameAr: "ذال", translit: "dh", ua: "немає — дзвінке th", hard: true, nonJoining: true,
        sound: { en: "th as in this.", uk: "th, як в англ. this." },
        example: { ar: "ذهب", tr: "dhahab", msa: "ذهب", en: "gold", uk: "золото" },
        najdi: { en: "Kept in Najdi, just like ث.", uk: "У наджді зберігається, як і ث." },
      },
      {
        char: "ر", name: "rāʾ", nameAr: "راء", translit: "r", ua: "р — ідеально як українське", nonJoining: true,
        sound: { en: "A tapped or rolled r.", uk: "Одноударне або розкотисте р." },
        example: { ar: "رز", tr: "rizz", msa: "أرز", en: "rice", uk: "рис" },
      },
      {
        char: "ز", name: "zāy", nameAr: "زاي", translit: "z", ua: "з", nonJoining: true,
        sound: { en: "z.", uk: "з." },
        example: { ar: "زين", tr: "zēn", msa: "جيد", en: "good, fine", uk: "добре" },
        najdi: { en: "زين is the Najdi “okay / good”. Use it every day.", uk: "زين — це «окей / добре» мовою наджді. Вживай щодня." },
      },
      {
        char: "و", name: "wāw", nameAr: "واو", translit: "w / ū", ua: "англ. w, або довге у", nonJoining: true,
        sound: { en: "w as in wow, or a long oo.", uk: "w, як в англ. wow, або довге у." },
        example: { ar: "وين", tr: "wēn", msa: "أين", en: "where", uk: "де" },
      },
    ],
  },
  {
    days: "7–8",
    title: { en: "Teeth and the first heavy letters", uk: "«Зубці» й перші важкі літери" },
    note: {
      en: "س ش have teeth, ص ض have a loop. Heavy letters darken the vowels next to them.",
      uk: "У س ش є «зубці», у ص ض — петля. Важкі літери роблять сусідні голосні темнішими.",
    },
    letters: [
      {
        char: "س", name: "sīn", nameAr: "سين", translit: "s", ua: "с",
        sound: { en: "s.", uk: "с." },
        example: { ar: "سلام", tr: "salām", msa: "سلام", en: "hello, peace", uk: "привіт, мир" },
      },
      {
        char: "ش", name: "shīn", nameAr: "شين", translit: "sh", ua: "ш",
        sound: { en: "sh as in shop.", uk: "ш." },
        example: { ar: "وش", tr: "wesh", msa: "ماذا", en: "what?", uk: "що?" },
        najdi: { en: "وش is the signature Najdi word. Other dialects say ايش or شو.", uk: "وش — фірмове слово наджді. Інші діалекти кажуть ايش або شو." },
      },
      {
        char: "ص", name: "ṣād", nameAr: "صاد", translit: "ṣ", ua: "важке с", hard: true,
        sound: { en: "A heavy s: tongue low, mouth full and rounded.", uk: "Важке с: язик низько, рот наче повний і округлений." },
        example: { ar: "صباح", tr: "ṣabāḥ", msa: "صباح", en: "morning", uk: "ранок" },
      },
      {
        char: "ض", name: "ḍād", nameAr: "ضاد", translit: "ḍ → ẓ", ua: "важке дзвінке th (у формальній — важке д)", hard: true,
        sound: {
          en: "In Najdi, a heavy th as in this — the same sound as ظ. Formal Arabic says a heavy d.",
          uk: "У наджді — важке th, як в англ. this, той самий звук, що й ظ. У формальній арабській — важке д.",
        },
        example: { ar: "ضيف", tr: "ẓēf", msa: "ضيف", en: "guest", uk: "гість" },
        najdi: {
          en: "In Najdi, ض and ظ sound the same: a heavy th as in this. So ضيف is ẓēf, not ḍēf.",
          uk: "У наджді ض і ظ звучать однаково: важке th, як в англ. this. Тож ضيف — це ẓēf, а не ḍēf.",
        },
      },
    ],
  },
  {
    days: "9–10",
    title: { en: "The throat letters", uk: "Горлові літери" },
    note: { en: "The hardest two days. Go slow and say every sound out loud.", uk: "Найважчі два дні. Не поспішай і вимовляй кожен звук уголос." },
    letters: [
      {
        char: "ط", name: "ṭāʾ", nameAr: "طاء", translit: "ṭ", ua: "важке т", hard: true,
        sound: { en: "A heavy t.", uk: "Важке т." },
        example: { ar: "طيب", tr: "ṭayyib", msa: "حسناً", en: "okay, good", uk: "окей, добре" },
      },
      {
        char: "ظ", name: "ẓāʾ", nameAr: "ظاء", translit: "ẓ", ua: "немає", hard: true,
        sound: { en: "A heavy th as in this.", uk: "Важке th, як в англ. this." },
        example: { ar: "ظهر", tr: "ẓuhr", msa: "ظهر", en: "noon", uk: "полудень" },
      },
      {
        char: "ع", name: "ʿayn", nameAr: "عين", translit: "ʿ", ua: "немає", hard: true,
        sound: {
          en: "Squeeze the throat and voice through it, like the very start of a gag, gently.",
          uk: "Стисни горло й проведи крізь нього голос — як на самому початку блювотного рефлексу, але м'яко.",
        },
        example: { ar: "عيال", tr: "ʿiyāl", msa: "أطفال", en: "kids, guys", uk: "діти, хлопці" },
        najdi: { en: "عيال means kids — and between friends, “guys”.", uk: "عيال — це діти, а між друзями — «хлопці»." },
      },
      {
        char: "غ", name: "ghayn", nameAr: "غين", translit: "gh", ua: "дзвінке х, як гаркаве р", hard: true,
        sound: { en: "A gargled r, like the French r in Paris.", uk: "Гаркаве р, як французьке r у слові Paris." },
        example: { ar: "غالي", tr: "ghāli", msa: "غالٍ", en: "expensive, dear", uk: "дорогий, любий" },
      },
    ],
  },
  {
    days: "11–12",
    title: { en: "The last six", uk: "Останні шість" },
    note: { en: "Mostly friendly sounds — and ق, the most Najdi letter of all.", uk: "Здебільшого прості звуки — і ق, найхарактерніша літера наджді." },
    letters: [
      {
        char: "ف", name: "fāʾ", nameAr: "فاء", translit: "f", ua: "ф",
        sound: { en: "f.", uk: "ф." },
        example: { ar: "فلوس", tr: "flūs", msa: "نقود", en: "money", uk: "гроші" },
      },
      {
        char: "ق", name: "qāf", nameAr: "قاف", translit: "q → g", ua: "ґ, як у «ґанок» — не українське г",
        sound: { en: "In Najdi, g as in go. In formal Arabic, a deep k from the throat.", uk: "У наджді — ґ, як у слові «ґанок». У формальній арабській — глибоке к з горла." },
        example: { ar: "قهوة", tr: "gahwa", msa: "قهوة", en: "coffee", uk: "кава" },
        najdi: { en: "The biggest Najdi tell. قال is gāl, قهوة is gahwa.", uk: "Найпомітніша ознака наджді. قال — це gāl, قهوة — gahwa." },
      },
      {
        char: "ك", name: "kāf", nameAr: "كاف", translit: "k", ua: "к",
        sound: { en: "k.", uk: "к." },
        example: { ar: "كيف", tr: "kēf", msa: "كيف", en: "how", uk: "як" },
        najdi: {
          en: "In traditional Najdi you may hear ك as ц in some words. Recognise it, don't copy it yet.",
          uk: "У традиційній наджді ك у деяких словах може звучати як ц. Впізнавай, але поки не копіюй.",
        },
      },
      {
        char: "ل", name: "lām", nameAr: "لام", translit: "l", ua: "л, але світліше",
        sound: { en: "A light l, tongue tip on the teeth.", uk: "Світле л, кінчик язика на зубах." },
        example: { ar: "ليش", tr: "lēsh", msa: "لماذا", en: "why", uk: "чому" },
      },
      {
        char: "م", name: "mīm", nameAr: "ميم", translit: "m", ua: "м",
        sound: { en: "m.", uk: "м." },
        example: { ar: "موية", tr: "mōya", msa: "ماء", en: "water", uk: "вода" },
        check: true, checkNote: { en: "Also ماي (māy).", uk: "Також ماي (māy)." },
      },
      {
        char: "ه", name: "hāʾ", nameAr: "هاء", translit: "h", ua: "м'якше за українське г — просто видих",
        sound: { en: "A light breath, as in hello.", uk: "Легкий видих, як в англ. hello." },
        example: { ar: "هلا", tr: "hala", msa: "أهلاً", en: "hi!", uk: "привіт!" },
        najdi: { en: "هلا and هلا والله are everyday Najdi greetings.", uk: "هلا і هلا والله — щоденні привітання наджді." },
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
