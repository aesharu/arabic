// The book: «أَقْرَا وَأَتْكَلَّم» — from the first letter to a real conversation, in one bound volume (views/book.js).
//
// It opens on a cover and turns page by page, the way a book does. It starts as a child's alphabet book —
// one big letter, its colour, a picture, two words — and grows up: the marks, then pictured words, then
// short sentences, then whole days, and at the end the kind of message Dima actually sends.
//
// The rule it keeps: five hundred words, and only words he will really use (tests/book.test.mjs counts them).
// Every word on the word pages comes from the plan's own vocabulary, so nothing here is invented Arabic.
// The reading pages at the back are the texts from data/read.js, chosen so they stay inside those words.
//
// Each letter has a colour of its own and keeps it everywhere in the book, so a joined-up word comes apart
// in front of him: بيت is three colours, not one shape. No two letters that ever touch share a colour.
import { GROUPS } from "./letters.js";
import { READS } from "./read.js";

const T = (en, najdi) => ({ en, najdi });

// ---------------------------------------------------------------- the cover
export const COVER = {
  title: T("I read, and I speak", "أَقْرَا وَأَتْكَلَّم"),
  sub: T("Saudi Arabic, from the very first letter", "العَرَبي السُّعُودي، مِن أوَّل حَرْف"),
  line: T("Five hundred words — the ones you will actually say", "خَمْسْمِيَة كَلِمَة — اللي بْتِقُولْها فِعْلاً"),
  where: T("The north — Hafar al-Batin, and the valley it was dug in",
           "الشَّمَال — حَفَر البَاطِن، والوَادِي اللي انْحَفَرَت فِيه"),
  open: T("Open the book", "افْتَح الكِتَاب"),
};

// ------------------------------------------------- the letters and their colours
// Every letter keeps one colour through the whole book. The numbers are worked out from these very pages, so
// that no two letters that ever stand next to each other share one — and no two letters that look alike
// either (ب and ث, ج and ح), because telling those apart is half of what the colours are for.
// tests/book.test.mjs checks both against the text; change the words and it will tell you to recolour.
export const HUE = {
  "ا": 1, "ب": 5, "ت": 2, "ث": 7, "ن": 6, "ي": 3, "ج": 13, "ح": 11, "خ": 12, "د": 12, "ذ": 5, "ر": 7,
  "ز": 2, "و": 8, "س": 12, "ش": 13, "ص": 7, "ض": 4, "ط": 11, "ظ": 3, "ع": 10, "غ": 9, "ف": 10, "ق": 6,
  "ك": 14, "ل": 4, "م": 9, "ه": 11,
  // the shapes that are really another letter wearing a hat — they keep its colour
  "ة": 2, "ى": 3, "أ": 1, "إ": 1, "آ": 1, "ؤ": 8, "ئ": 3,
  "ء": 2, // a hamza standing on its own is a sound of its own
};

export const LETTER = Object.fromEntries(GROUPS.flatMap(g => g.letters).map(l => [l.char, l]));
export const ALPHABET = GROUPS.flatMap(g => g.letters.map(l => l.char));

// ---------------------------------------------------------------- part 1 · the letters
// [word, pronunciation, English, picture]. The letter of the page is coloured inside each word.
const L = (char, words, note) => ({ kind: "letter", id: "L" + char, char, words, note });

// The key at the front, the way a dictionary opens with one: how to read the pronunciation line before he
// reads a single word of Arabic. The rows are in core/ua.js.
const KEY_PAGE = {
  kind: "key", id: "key",
  title: T("How to read the sounds", "كيف تقرا النطق"),
  note: T("Under every Arabic word there are two lines: the Latin one, and the same sounds again in Ukrainian letters. Ukrainian can say things English spelling only hints at — so read the second line, not the first. Here is what each letter of it means. A tick like сʹ always means heavy: the tongue pulls back and the sound goes dark.",
          "تحت كل كلمة عربية سطرين: اللاتيني، ونفس الأصوات مرة ثانية بحروف أوكرانية. الأوكراني يقدر يقول أصوات الإنجليزي بس يلمّح لها — فاقرا السطر الثاني مو الأول. وهذي معاني حروفه. والعلامة مثل сʹ دايم معناها ثقيلة: اللسان يرجع ورا والصوت يصير غامق."),
};

const LETTERS = [
  L("ا", [["أَرْنَب", "arnab", "a rabbit", "rabbit"], ["أَنَا", "ana", "I, me", ""]]),
  L("ب", [["بَاب", "bāb", "a door", "door"], ["بَيْت", "bēt", "a house", "house"]]),
  L("ت", [["تَمْر", "tamr", "dates", "dates"], ["تَعْبَان", "taʿbān", "tired", ""]]),
  L("ث", [["ثَلْج", "thalj", "snow", "snow"], ["ثَلاثَة", "thalātha", "three", ""]]),
  L("ن", [["نَخْلَة", "nakhla", "a palm tree", "palm"], ["نُور", "nūr", "light", ""]]),
  L("ي", [["يَد", "yad", "a hand", "hand"], ["يَوْم", "yōm", "a day", ""]]),
  L("ج", [["جَمَل", "jamal", "a camel", "camel"], ["جَوَّال", "jawwāl", "a phone", "phone"]]),
  L("ح", [["حَلِيب", "ḥalīb", "milk", "milk"], ["حِلْو", "ḥilw", "nice, sweet", ""]]),
  L("خ", [["خُبْز", "khubz", "bread", "bread"], ["خَمْسَة", "khamsa", "five", ""]]),
  L("د", [["دَجَاجَة", "dijāja", "a hen", "hen"], ["دَافِي", "dāfi", "warm", ""]]),
  L("ذ", [["ذِيب", "dhīb", "a wolf", "wolf"], ["لَذِيذ", "ladhīdh", "delicious", ""]]),
  L("ر", [["رُزّ", "rizz", "rice", "rice"], ["رَاس", "rās", "a head", ""]]),
  L("ز", [["زُولِيَّة", "zūliyya", "a carpet", "rug"], ["زَيْن", "zēn", "good", ""]]),
  L("و", [["وَرْدَة", "warda", "a flower", "rose"], ["وَيْن", "wēn", "where", ""]]),
  L("س", [["سَيَّارَة", "sayyāra", "a car", "car"], ["سُوق", "sūg", "a market", "market"]]),
  L("ش", [["شَمْس", "shams", "the sun", "sun"], ["شَاهِي", "shāhi", "tea", "tea"]]),
  L("ص", [["صَقْر", "ṣagr", "a falcon", "falcon"], ["الصُّبْح", "aṣ-ṣubḥ", "the morning", ""]]),
  L("ض", [["ضَبّ", "ẓabb", "a dhab lizard", "lizard"], ["أَخْضَر", "akhẓar", "green", ""]]),
  L("ط", [["طَاوْلَة", "ṭāwla", "a table", "table"], ["طَرِيق", "ṭarīg", "a road", "road"]]),
  L("ظ", [["نَظَّارَة", "naẓẓāra", "glasses", "glasses"], ["الظُّهْر", "aẓ-ẓuhr", "noon", ""]]),
  L("ع", [["عَيْن", "ʿēn", "an eye", "eye"], ["عِنْدِي", "ʿindi", "I have", ""]]),
  L("غ", [["غَنَم", "ghanam", "sheep", "sheep"], ["غَدَا", "ghada", "lunch", ""]]),
  L("ف", [["فْلُوس", "flūs", "money", "money"], ["فْطُور", "fṭūr", "breakfast", ""]]),
  L("ق", [["قَهْوَة", "gahwa", "coffee", "coffee"], ["قَلْبِي", "galbi", "my heart", "heart"]]),
  L("ك", [["كُرْسِي", "kursi", "a chair", "chair"], ["كَاس", "kās", "a glass", "cup"]]),
  L("ل", [["اللَّيْل", "al-lēl", "the night", "moon"], ["لَحَم", "laḥam", "meat", "meat"]]),
  L("م", [["مِفْتَاح", "miftāḥ", "a key", "key"], ["مَوْيَة", "mōya", "water", "water"]]),
  L("ه", [["وَجْه", "wajh", "a face", "face"], ["هَلا", "hala", "hi", ""]]),
];

// ---------------------------------------------------------------- part 2 · the marks
// The little signs above and below the letters. They are the difference between reading Arabic and guessing it.
const M = (id, title, note, show, words) => ({ kind: "mark", id, title, note, show, words });

export const MARKS = [
  M("m1", T("Three little marks", "ثَلاث حَرَكَات"),
    T("A letter on its own is only a consonant. The mark tells you the vowel: a stroke above is a, a stroke below is i, a little loop above is u.",
      "الحَرْف لِحَالَه صَامِت. الحَرَكَة هِيَ اللي تْقُول لَك الصَّوْت: فَوْق فَتْحَة a، وتَحْت كَسْرَة i، واللِّفَّة فَوْق ضَمَّة u."),
    [["بَ", "ba"], ["بِ", "bi"], ["بُ", "bu"], ["مَ", "ma"], ["مِ", "mi"], ["مُ", "mu"]],
    [["بَيْت", "bēt", "a house"], ["بِنْت", "bint", "a girl"], ["بُكْرَة", "bukra", "tomorrow"]]),
  M("m2", T("Sukūn — no vowel at all", "السُّكُون — بِلا حَرَكَة"),
    T("A small circle over a letter means: nothing after it. The letter closes the syllable and you go straight on.",
      "دَايْرَة صْغِيرَة فَوْق الحَرْف مَعْنَاهَا: مَا بَعْدَه حَرَكَة. الحَرْف يْسَكِّر المَقْطَع وتْكَمِّل عَلَى طُول."),
    [["بْ", "b"], ["نْ", "n"], ["تْ", "t"]],
    [["بِنْت", "bint", "a girl"], ["قَلْب", "galb", "a heart"], ["الصُّبْح", "aṣ-ṣubḥ", "the morning"]]),
  M("m3", T("Shadda — say it twice", "الشَّدَّة — حَرْفَيْن بْحَرْف"),
    T("The little w over a letter means the letter is doubled. You hold it: ḥabb, not ḥab. It changes the word.",
      "العَلامَة اللي فَوْق الحَرْف مَعْنَاهَا الحَرْف مَرَّتَيْن. تْشِدّ عَلَيْه: aḥibb مُو aḥib. وتْغَيِّر الكَلِمَة."),
    [["بّ", "bb"], ["مّ", "mm"], ["وّ", "ww"]],
    [["أَحِبّ", "aḥibb", "I love"], ["أُمِّي", "ummi", "my mom"], ["جَوَّال", "jawwāl", "a phone"]]),
  M("m4", T("The three long ones", "حُرُوف المَدّ"),
    T("ا و ي are letters and lengths at once: bāb, nūr, kbīr. In Saudi, ay becomes ē and aw becomes ō — that is why بيت is bēt and يوم is yōm.",
      "ا و ي حُرُوف ومُدُود بْنَفْس الوَقْت: bāb، nūr، kbīr. وفي السُّعُودي ay تْصِير ē وaw تْصِير ō — عَشَان كِذَا «بيت» bēt و«يوم» yōm."),
    [["بَا", "bā"], ["بُو", "bū"], ["بِي", "bī"], ["بَيْ", "bē"], ["بَوْ", "bō"]],
    [["بَاب", "bāb", "a door"], ["نُور", "nūr", "light"], ["كْبِير", "kbīr", "big"], ["يَوْم", "yōm", "a day"]]),
  M("m5", T("The tied t — ة", "التَّاء المَرْبُوطَة"),
    T("A h with two dots on top ends most feminine words. On its own it sounds like a soft a; when another word follows, it wakes up as t: gahwa, but gahwat aṣ-ṣubḥ.",
      "هَاء بْنُقْطَتَيْن تْجِي بْآخِر أَغْلَب كَلِمَات المُؤَنَّث. لِحَالْهَا تِنْقَال a خَفِيفَة، ولَمَّا تْجِي كَلِمَة بَعْدْهَا تِصْحَى t: gahwa، بَس gahwat aṣ-ṣubḥ."),
    [["ـة", "a"], ["ـتِ", "t"]],
    [["قَهْوَة", "gahwa", "coffee"], ["سَيَّارَة", "sayyāra", "a car"], ["نَخْلَة", "nakhla", "a palm tree"]]),
  M("m6", T("الـ — and the letters that swallow it", "الـ والحُرُوف اللي تِبْلَعْهَا"),
    T("الـ is “the”, written the same every time and not always said the same. Before half the letters you hear the l; before the other half it disappears into the letter, which then doubles: al-bēt, but ash-shams.",
      "الـ هِيَ «الـ»، تِنْكِتِب وَحْدَة وَمَا تِنْقَال وَحْدَة. قُدَّام نُصّ الحُرُوف تِسْمَع اللام، وقُدَّام النُّصّ الثَّانِي تِخْتِفِي في الحَرْف واللي بَعْدَه يِتْشَدَّد: al-bēt، بَس ash-shams."),
    [["الْبَيْت", "al-bēt"], ["الْقَهْوَة", "al-gahwa"], ["الشَّمْس", "ash-shams"], ["السُّوق", "as-sūg"]],
    [["الْقَمَر", "al-gamar", "the moon"], ["النُّور", "an-nūr", "the light"], ["الرُّزّ", "ar-rizz", "the rice"]]),
  M("m7", T("Hamza — the catch in the throat", "الهَمْزَة"),
    T("ء is a sound of its own: the tiny stop in English uh-oh. It rides on a chair — أ إ ؤ ئ — or sits alone. And ى at the end of a word is just a long a.",
      "ء صَوْت بْرُوحَه: الوَقْفَة الصْغِيرَة اللي بَيْن المَقْطَعَيْن. تِرْكَب عَلَى كُرْسِي — أ إ ؤ ئ — أَو تِجْلِس لِحَالْهَا. وال ى بْآخِر الكَلِمَة مُجَرَّد أَلِف طَوِيلَة."),
    [["أَ", "a"], ["إِ", "i"], ["ؤ", "uʾ"], ["ئ", "iʾ"], ["ى", "a"]],
    [["أُمِّي", "ummi", "my mom"], ["مَسَاء", "masāʾ", "evening"], ["عَلَى", "ʿala", "on"], ["مَتَى", "mita", "when"]]),
];

// ---------------------------------------------------------------- part 3 · the words
// Every word here is from the plan's own vocabulary. [word, pronunciation, English, picture].
// A picture name starting with # is a numeral and one starting with @ is a colour swatch.
const W = (id, title, note, items) => ({ kind: "words", id, title, note, items });

const WORDS = [
  W("w1", T("Me and you", "أَنَا وانْتِي"),
    T("Arabic says who is speaking in the verb, so these small words are for pointing and for emphasis.",
      "العَرَبِي يْبَيِّن الفَاعِل في الفِعْل نَفْسَه، فَهَالكَلِمَات لِلإِشَارَة والتَّوْكِيد."), [
    ["أَنَا", "ana", "I", "him"], ["انْتِي", "inti", "you (to a woman)", "her"], ["انْت", "int", "you (to a man)", ""],
    ["هُو", "hu", "he", ""], ["هِي", "hi", "she", ""], ["حْنَا", "ḥinna", "we", ""],
    ["انْتُو", "intu", "you all", ""], ["هُم", "hum", "they", ""],
  ]),
  W("w2", T("My people", "أَهْلِي"),
    T("Family words carry the “my” inside them: أبوي is “my dad”, not “dad”.",
      "كَلِمَات الأَهْل تْشِيل «ـي» جُوَّاهَا: «أَبُوي» يَعْنِي my dad مُو dad."), [
    ["أَهْل", "ahl", "family", "family"], ["أَبُوي", "abūy", "my dad", ""], ["أُمِّي", "ummi", "my mom", ""],
    ["أَخُوي", "akhūy", "my brother", ""], ["أُخْتِي", "ukhti", "my sister", ""], ["وَلَد", "walad", "a boy", ""],
    ["بِنْت", "bint", "a girl", ""], ["جَدِّي", "jaddi", "my grandfather", ""], ["عِيَال", "ʿiyāl", "kids", ""],
    ["نَاس", "nās", "people", ""],
  ]),
  W("w3", T("My house", "بَيْتِي"),
    T("Say them out loud while you walk around your own flat — that is how they stick.",
      "قُلْهَا بْصَوْت عَالِي وانْت تْلِفّ في شَقَّتَك — كِذَا تِثْبُت."), [
    ["بَيْت", "bēt", "a house", "house"], ["بَاب", "bāb", "a door", "door"], ["شُبَّاك", "shibbāk", "a window", "window"],
    ["غُرْفَة", "ghurfa", "a room", ""], ["صَالَة", "ṣāla", "a living room", "sofa"], ["مَطْبَخ", "maṭbakh", "a kitchen", "pot"],
    ["حَمَّام", "ḥammām", "a bathroom", ""], ["سَرِير", "sarīr", "a bed", "bed"], ["مِفْتَاح", "miftāḥ", "a key", "key"],
    ["نُور", "nūr", "light", "lamp"],
  ]),
  W("w4", T("In the kitchen", "في المَطْبَخ"),
    T("The things on the table when she calls you while you are eating.",
      "الأَشْيَاء اللي عَلَى الطَّاوْلَة لَمَّا تْكَلِّمَك وانْت تَاكِل."), [
    ["كَاس", "kās", "a glass", "cup"], ["صَحْن", "ṣaḥn", "a plate", "plate"], ["مَلْعَقَة", "malʿaga", "a spoon", "spoon"],
    ["ثَلَّاجَة", "thallāja", "a fridge", "fridge"], ["طَاوْلَة", "ṭāwla", "a table", "table"], ["كُرْسِي", "kursi", "a chair", "chair"],
    ["مَوْيَة", "mōya", "water", "water"], ["شَاهِي", "shāhi", "tea", "tea"],
  ]),
  W("w5", T("Food and drink", "أَكْل وشُرْب"),
    T("Three meals and what is in them. كبسة is the one she will ask if you have tried.",
      "ثَلاث وَجْبَات وِش فِيهَا. و«الكَبْسَة» هِيَ اللي بْتِسْأَلَك إِذَا ذُقْتَهَا."), [
    ["أَكْل", "akl", "food", ""], ["فْطُور", "fṭūr", "breakfast", ""], ["غَدَا", "ghada", "lunch", ""],
    ["عَشَا", "ʿasha", "dinner", ""], ["خُبْز", "khubz", "bread", "bread"], ["رُزّ", "rizz", "rice", "rice"],
    ["لَحَم", "laḥam", "meat", "meat"], ["دَجَاج", "dijāj", "chicken", "hen"], ["سَمَك", "samak", "fish", "fish"],
    ["بَيْض", "bēẓ", "eggs", "egg"], ["تَمْر", "tamr", "dates", "dates"], ["حَلِيب", "ḥalīb", "milk", "milk"],
    ["قَهْوَة", "gahwa", "coffee", "coffee"], ["كَبْسَة", "kabsa", "kabsa", ""],
  ]),
  W("w6", T("The time of day", "الوَقْت"),
    T("These are the words that open almost every message: الحين، اليوم، بكرة.",
      "هَذِي الكَلِمَات اللي تِفْتَح أَغْلَب الرَّسَايِل: الحِين، اليَوْم، بُكْرَة."), [
    ["الحِين", "al-ḥīn", "now", ""], ["اليَوْم", "al-yōm", "today", ""], ["بُكْرَة", "bukra", "tomorrow", ""],
    ["أَمْس", "ams", "yesterday", ""], ["الصُّبْح", "aṣ-ṣubḥ", "the morning", "sun"], ["الظُّهْر", "aẓ-ẓuhr", "noon", ""],
    ["اللَّيْل", "al-lēl", "the night", "moon"], ["سَاعَة", "sāʿa", "an hour", "clock"], ["دَقِيقَة", "dagīga", "a minute", ""],
    ["أُسْبُوع", "usbūʿ", "a week", ""], ["شَهْر", "shahr", "a month", ""], ["سَنَة", "sana", "a year", ""],
  ]),
  W("w7", T("The days of the week", "أَيَّام الأُسْبُوع"),
    T("The week starts on Sunday and الجمعة is the day off — that is why her Thursday night is your Friday night.",
      "الأُسْبُوع يِبْدَا الأَحَد، والجُمْعَة إِجَازَة — عَشَان كِذَا لَيْلَة الخَمِيس عِنْدْهَا هِيَ لَيْلَة الجُمْعَة عِنْدَك."), [
    ["السَّبْت", "as-sabt", "Saturday", ""], ["الأَحَد", "al-aḥad", "Sunday", ""], ["الاثْنَيْن", "al-ithnēn", "Monday", ""],
    ["الثَّلاثَاء", "ath-thalāthāʾ", "Tuesday", ""], ["الأَرْبِعَاء", "al-arbiʿāʾ", "Wednesday", ""],
    ["الخَمِيس", "al-khamīs", "Thursday", ""], ["الجُمْعَة", "al-jumʿa", "Friday", ""],
  ]),
  W("w8", T("One to ten", "الأَرْقَام"),
    T("The numerals are read left to right, the same direction as ours, even inside Arabic writing.",
      "الأَرْقَام تِنْقِرَا مِن اليَسَار لِليَمِين، نَفْس اتِّجَاهْنَا، حَتَّى جُوَّا الكِتَابَة العَرَبِيَّة."), [
    ["وَاحِد", "wāḥid", "one", "#١"], ["ثْنَيْن", "thnēn", "two", "#٢"], ["ثَلاثَة", "thalātha", "three", "#٣"],
    ["أَرْبَعَة", "arbaʿa", "four", "#٤"], ["خَمْسَة", "khamsa", "five", "#٥"], ["سِتَّة", "sitta", "six", "#٦"],
    ["سَبْعَة", "sabʿa", "seven", "#٧"], ["ثَمَانْيَة", "thamānya", "eight", "#٨"], ["تِسْعَة", "tisʿa", "nine", "#٩"],
    ["عَشَرَة", "ʿashara", "ten", "#١٠"], ["عِشْرِين", "ʿishrīn", "twenty", "#٢٠"], ["مِيَة", "miya", "a hundred", "#١٠٠"],
  ]),
  W("w9", T("The colours", "الأَلْوَان"),
    T("Green is the colour of the flag and of the word أخضر you will hear about every plant and every light.",
      "الأَخْضَر لَوْن العَلَم، ونَفْس الكَلِمَة بْتِسْمَعْهَا عَن كِلّ زَرْع وكِلّ إِشَارَة."), [
    ["لَوْن", "lōn", "a colour", ""], ["أَبْيَض", "abyaẓ", "white", "@white"], ["أَسْوَد", "aswad", "black", "@black"],
    ["أَحْمَر", "aḥmar", "red", "@red"], ["أَخْضَر", "akhẓar", "green", "@green"], ["أَزْرَق", "azrag", "blue", "@blue"],
    ["أَصْفَر", "aṣfar", "yellow", "@yellow"], ["بُنِّي", "binni", "brown", "@brown"], ["وَرْدِي", "wardi", "pink", "@pink"],
  ]),
  W("w10", T("The weather", "الجَوّ"),
    T("In Hafar al-Batin the summer is 45 degrees and the winter nights are cold enough for a fire.",
      "في حَفَر البَاطِن الصَّيْف ٤٥ دَرَجَة، ولَيَالِي الشِّتَا بَارْدَة لِدَرَجَة تِوَلِّع نَار."), [
    ["الجَوّ", "al-jaww", "the weather", ""], ["شَمْس", "shams", "sun", "sun"], ["غَيْم", "ghēm", "clouds", "cloud"],
    ["مَطَر", "maṭar", "rain", "rain"], ["هَوَا", "hawa", "wind", "wind"], ["غُبَار", "ghubār", "dust", ""],
    ["حَرّ", "ḥarr", "heat", ""], ["بَرْد", "bard", "cold", ""], ["ثَلْج", "thalj", "snow", "snow"],
    ["الصَّيْف", "aṣ-ṣēf", "the summer", ""], ["الشِّتَا", "ash-shita", "the winter", ""],
  ]),
  W("w11", T("How I feel", "شْلَوْنِي"),
    T("Answer شلونك with one of these and you have had a conversation.",
      "رِدّ عَلَى «شْلَوْنَك» بْوَحْدَة مِن هَذِي وتْكُون سَوَّيْت مُحَادَثَة."), [
    ["تَعْبَان", "taʿbān", "tired", "f-tired"], ["جُوعَان", "jūʿān", "hungry", "f-hungry"],
    ["عَطْشَان", "ʿaṭshān", "thirsty", ""], ["مَبْسُوط", "mabsūṭ", "happy", "f-happy"],
    ["زَعْلَان", "zaʿlān", "upset", "f-sad"], ["مَشْغُول", "mashghūl", "busy", ""], ["فَاضِي", "fāẓi", "free", ""],
    ["مِشْتَاق", "mishtāg", "missing you", "heart"], ["خَايِف", "khāyif", "scared", "f-scared"],
    ["مَرِيض", "marīẓ", "ill", "f-sick"],
  ]),
  W("w12", T("My body", "جِسْمِي"),
    T("You need these the first time one of you is ill and the other is far away.",
      "بْتِحْتَاجْهَا أَوَّل مَرَّة يِمْرَض وَاحِد مِنْكُم والثَّانِي بَعِيد."), [
    ["رَاس", "rās", "a head", ""], ["وَجْه", "wajh", "a face", "face"], ["عَيْن", "ʿēn", "an eye", "eye"],
    ["خَشْم", "khashm", "a nose", ""], ["سِنّ", "sinn", "a tooth", "tooth"], ["يَد", "yad", "a hand", "hand"],
    ["رِجْل", "rijl", "a leg", "leg"], ["بَطْن", "baṭn", "a stomach", ""], ["قَلْب", "galb", "a heart", "heart"],
    ["شَعَر", "shaʿar", "hair", ""],
  ]),
  W("w13", T("Outside the house", "بَرَّا البَيْت"),
    T("Where the day happens. السوق is any shopping at all, not only the old market.",
      "وِين يِصِير اليَوْم. و«السُّوق» أَي تَسَوُّق، مُو بَس السُّوق القَدِيم."), [
    ["سَيَّارَة", "sayyāra", "a car", "car"], ["طَرِيق", "ṭarīg", "a road", "road"], ["سُوق", "sūg", "a market", "market"],
    ["مُول", "mōl", "a mall", "mall"], ["شُغْل", "shughl", "work", "work"], ["جَامْعَة", "jāmʿa", "a university", "school"],
    ["مَطْعَم", "maṭʿam", "a restaurant", ""], ["مُسْتَشْفَى", "mustashfa", "a hospital", "hospital"],
    ["جَوَّال", "jawwāl", "a phone", "phone"], ["فْلُوس", "flūs", "money", "money"],
  ]),
  W("w14", T("The desert and the north", "الصَّحْرَا والشَّمَال"),
    T("Her country outside the cities, and the words behind half the names you will hear.",
      "بِلادْهَا بَرَّا المُدُن، والكَلِمَات اللي وَرَا نُصّ الأَسْمَاء اللي بْتِسْمَعْهَا."), [
    ["جَمَل", "jamal", "a camel", "camel"], ["غَنَم", "ghanam", "sheep", "sheep"], ["نَخْلَة", "nakhla", "a palm tree", "palm"],
    ["صَقْر", "ṣagr", "a falcon", "falcon"], ["ضَبّ", "ẓabb", "a dhab lizard", "lizard"], ["ذِيب", "dhīb", "a wolf", "wolf"],
    ["رَمْل", "raml", "sand", "dune"], ["جَبَل", "jabal", "a mountain", "mountain"], ["وَادِي", "wādi", "a valley", "wadi"],
    ["نَجْمَة", "najma", "a star", "star"], ["قَمَر", "gamar", "the moon", "moon"],
  ]),
  W("w15", T("What people wear", "اللِّبْس"),
    T("The thobe and the shemagh are everyday clothes, not a costume — he wears them to work.",
      "الثَّوْب والشِّمَاغ لِبْس يَوْمِي، مُو زِيّ تَنَكُّرِي — يِلْبَسْهُم لِلدَّوَام."), [
    ["لِبْس", "libs", "clothes", ""], ["ثَوْب", "thōb", "a thobe", "thobe"], ["شِمَاغ", "shmāgh", "a shemagh", "shmagh"],
    ["عَبَايَة", "ʿabāya", "an abaya", "abaya"], ["فُسْتَان", "fustān", "a dress", "dress"], ["جَزْمَة", "jazma", "shoes", "shoe"],
    ["نَظَّارَة", "naẓẓāra", "glasses", "glasses"], ["خَاتِم", "khātim", "a ring", "ring"], ["عِطْر", "ʿiṭr", "perfume", "perfume"],
  ]),
  W("w16", T("The little words", "الكَلِمَات الصْغِيرَة"),
    T("Nine words out of ten in a real message are these. Learn them before any noun.",
      "تِسْع كَلِمَات مِن عَشَر في أَي رِسَالَة هِيَ هَذِي. تَعَلَّمْهَا قَبْل أَي اسْم."), [
    ["فِي", "fi", "in", ""], ["مِن", "min", "from", ""], ["عَلَى", "ʿala", "on", ""], ["مَع", "maʿ", "with", ""],
    ["عِنْدِي", "ʿindi", "I have", ""], ["هَذَا", "hādha", "this", ""], ["هِنَا", "hina", "here", ""],
    ["وَ", "w", "and", ""], ["بَسّ", "bass", "but, just", ""], ["كِلّ", "kill", "every, all", ""],
    ["شْوَيّ", "shwayy", "a little", ""], ["مَرَّة", "marra", "very", ""], ["كَثِير", "kithīr", "a lot", ""],
    ["عَشَان", "ʿashān", "because", ""],
  ]),
  W("w17", T("The eight questions", "الأَسْئِلَة"),
    T("وش and وين will carry you through a whole evening on their own.",
      "«وِش» و«وِين» لِحَالْهُم يْمَشُّون سَهْرَة كَامْلَة."), [
    ["وِش", "wesh", "what", ""], ["وِين", "wēn", "where", ""], ["مَتَى", "mita", "when", ""],
    ["لِيش", "lēsh", "why", ""], ["كِيف", "kēf", "how", ""], ["مِين", "mīn", "who", ""],
    ["كَم", "kam", "how many", ""], ["أَي", "ay", "which", ""],
  ]),
  W("w18", T("What I do", "أَفْعَالِي"),
    T("Every one is the “I” form. Swap the first letter for تـ and add ـين and you are talking to her: أروح → تروحين.",
      "كِلّهَا صِيغَة «أَنَا». بَدِّل أَوَّل حَرْف بـ«تـ» وزِيد «ـين» وتْكُون تْكَلِّمْهَا: أَرُوح ← تْرُوحِين."), [
    ["أَبِي", "abi", "I want", ""], ["أَحِبّ", "aḥibb", "I love", "heart"], ["أَرُوح", "arūḥ", "I go", ""],
    ["أَجِي", "aji", "I come", ""], ["أَسَوِّي", "asawwi", "I do", ""], ["أَقُول", "agūl", "I say", ""],
    ["أَشُوف", "ashūf", "I see", "eye"], ["أَعْرِف", "aʿrif", "I know", ""], ["أَفْهَم", "afham", "I understand", ""],
    ["آكِل", "ākil", "I eat", ""], ["أَشْرَب", "ashrab", "I drink", "cup"], ["أَنَام", "anām", "I sleep", "bed"],
    ["أَصْحَى", "aṣḥa", "I wake up", ""], ["أَشْتَغِل", "ashtaghil", "I work", "work"], ["أَدْرِس", "adris", "I study", ""],
    ["أَتْكَلَّم", "atkallam", "I speak", ""],
  ]),
  W("w19", T("Describing things", "صِفَات"),
    T("Adjectives come after the thing: بيت كبير, a house big. Always.",
      "الصِّفَة تِجِي بَعْد المَوْصُوف: «بَيْت كْبِير». دَايْماً."), [
    ["كْبِير", "kbīr", "big", ""], ["صْغِير", "ṣghīr", "small", ""], ["حِلْو", "ḥilw", "nice, pretty", ""],
    ["جِدِيد", "jidīd", "new", ""], ["قَدِيم", "gadīm", "old", ""], ["سَهْل", "sahl", "easy", ""],
    ["صَعْب", "ṣaʿb", "hard", ""], ["غَالِي", "ghāli", "expensive", ""], ["قَرِيب", "garīb", "near", ""],
    ["بَعِيد", "baʿīd", "far", ""],
  ]),
  W("w21", T("Telling the time", "السَّاعَة كَم؟"),
    T("Arabic says the hour, then “and a half” or “less a quarter”: الساعة أربع إلا ربع is a quarter to four.",
      "العَرَبِي يْقُول السَّاعَة وبَعْدَيْن «ونُصّ» أَو «إِلّا رُبْع»: «السَّاعَة أَرْبَع إِلّا رُبْع» يَعْنِي a quarter to four."), [
    ["السَّاعَة كَم؟", "as-sāʿa kam?", "what time is it?", "clock"], ["وَقْت", "wagt", "time", ""],
    ["نُصّ", "nuṣṣ", "a half", ""], ["رُبْع", "rubʿ", "a quarter", ""], ["إِلّا", "illa", "less, to (the hour)", ""],
    ["بَدْرِي", "badri", "early", ""], ["مِتْأَخِّر", "mitʾakhkhir", "late", ""], ["الفَجْر", "al-fajr", "dawn", ""],
  ]),
  W("w22", T("From morning till night", "مِن الصُّبْح لِليَل"),
    T("This is your day in ten lines. Learn it and you can answer وش سويت اليوم؟ without stopping to think.",
      "هَذَا يَوْمَك بْعَشَر أَسْطُر. احْفَظَه وتْقْدَر تْرِدّ عَلَى «وِش سَوَّيْت اليَوْم؟» بِلا مَا تْفَكِّر."), [
    ["أَقُوم مِن النَّوْم", "agūm min an-nōm", "I get out of bed", "bed"], ["أَفْطِر", "afṭir", "I have breakfast", ""],
    ["أَطْلَع مِن البَيْت", "aṭlaʿ min al-bēt", "I leave the house", "door"], ["أَوْصَل الشُّغُل", "awṣal ash-shughul", "I get to work", "work"],
    ["أَتْغَدَّى", "atghadda", "I have lunch", ""], ["أَرْجَع البَيْت", "arjaʿ al-bēt", "I go back home", "house"],
    ["أَتْعَشَّى", "atʿashsha", "I have dinner", ""], ["أَذَاكِر عَرَبِي", "adhākir ʿarabi", "I study Arabic", ""],
    ["أَنَام بَدْرِي", "anām badri", "I go to bed early", ""], ["أَسْهَر", "ashar", "I stay up late", "moon"],
  ]),
  W("w23", T("On the road", "في الطَّرِيق"),
    T("Enough to sit in a taxi in Riyadh and not go silent.",
      "يْكَفِّي عَشَان تِجْلِس في تَاكْسِي بْالرِّيَاض وَمَا تِسْكُت."), [
    ["يَمِين", "yimīn", "right", ""], ["يَسَار", "yisār", "left", ""], ["سِيدَا", "sēda", "straight ahead", ""],
    ["إِشَارَة", "ishāra", "a traffic light", ""], ["دَوَّار", "dawwār", "a roundabout", ""],
    ["مَوْقِف", "mawgif", "a parking space", ""], ["تَاكْسِي", "taksi", "a taxi", "car"],
    ["طَيَّارَة", "ṭayyāra", "a plane", "plane"], ["تَذْكَرَة", "tadhkara", "a ticket", ""], ["شَنْطَة", "shanṭa", "a bag", "bag"],
  ]),
  W("w24", T("Money and the market", "فْلُوس وسُوق"),
    T("بكم؟ is the whole question. Everything else is listening to the answer.",
      "«بْكَم؟» هِيَ السُّؤَال كِلَّه. والبَاقِي إِنَّك تِسْمَع الجَوَاب."), [
    ["فْلُوس", "flūs", "money", "money"], ["بْكَم؟", "bikam?", "how much is it?", ""],
    ["رِيَال", "riyāl", "a riyal", ""], ["كَاش", "kāsh", "cash", ""], ["بِطَاقَة", "biṭāga", "a bank card", ""],
    ["الحِسَاب", "al-ḥisāb", "the bill", ""], ["خَصْم", "khaṣm", "a discount", ""], ["كِيس", "kīs", "a bag", ""],
    ["غَالِي", "ghāli", "expensive", ""], ["رْخِيص", "rkhīṣ", "cheap", ""],
  ]),
  W("w25", T("When you are ill", "لَمَّا تِمْرَض"),
    T("The words you will need at the worst possible moment, so learn them at the best one.",
      "الكَلِمَات اللي بْتِحْتَاجْهَا بْأَسْوَأ وَقْت، فَتَعَلَّمْهَا بْأَحْسَن وَقْت."), [
    ["مَرِيض", "marīẓ", "ill", "f-sick"], ["يْعَوِّرْنِي", "yʿawwirni", "it hurts", ""],
    ["حَرَارَة", "ḥarāra", "a fever", ""], ["زُكَام", "zukām", "a cold", ""], ["دَوَا", "dawa", "medicine", "medicine"],
    ["صَيْدَلِيَّة", "ṣaydaliyya", "a pharmacy", ""], ["مُسْتَشْفَى", "mustashfa", "a hospital", "hospital"],
    ["صِحَّة", "ṣiḥḥa", "health", ""], ["سَلامْتِك", "salāmtik", "get well soon (to her)", ""],
  ]),
  W("w26", T("Saying yes, no and really?", "إِيه ولا ووالله؟"),
    T("Half of a Saudi conversation is these. They are short, they are constant, and they make you sound like you belong.",
      "نُصّ المُحَادَثَة السُّعُودِيَّة هَذِي. قَصِيرَة، ودَايْماً مَوْجُودَة، وتْخَلِّيك تِبَان مِنَّا."), [
    ["إِيه", "ēh", "yes", ""], ["لَا", "la", "no", ""], ["أَكِيد", "akīd", "sure", ""],
    ["طَيِّب", "ṭayyib", "okay, well", ""], ["زَيْن", "zēn", "good", ""], ["تَمَام", "tamām", "all good", ""],
    ["خَلاص", "khalāṣ", "done, enough", ""], ["يَلا", "yalla", "come on", ""], ["وَالله؟", "wallah?", "really?", ""],
    ["مَعْلِيش", "maʿlēsh", "never mind", ""], ["عَادِي", "ʿādi", "it's fine", ""], ["يَعْنِي", "yaʿni", "I mean, like", ""],
    ["مَدْرِي", "madri", "dunno", ""], ["تَرَى", "tara", "you know…", ""],
  ]),
  W("w20", T("What you say every day", "كَلام كِلّ يَوْم"),
    T("Learn these by heart. They are the ones that make her smile because they are hers, not a textbook's.",
      "احْفَظْهَا. هَذِي اللي تْضَحِّكْهَا لأَنَّهَا كَلامْهَا، مُو كَلام كِتَاب."), [
    ["هَلا", "hala", "hi", ""], ["السَّلام عَلَيْكُم", "as-salāmu ʿalēkum", "hello", ""],
    ["صَبَاح الخَيْر", "ṣabāḥ al-khēr", "good morning", "sun"], ["مَسَاء الخَيْر", "masāʾ al-khēr", "good evening", "moon"],
    ["شْلَوْنِك", "shlōnik", "how are you? (to her)", ""], ["الحَمْدُ لله", "al-ḥamdu lillāh", "I'm well, thank God", ""],
    ["شُكْراً", "shukran", "thank you", ""], ["الله يَعْطِيك العَافْيَة", "allah yiʿṭīk al-ʿāfya", "well done, thank you", ""],
    ["إن شَاء الله", "in shāʾ allah", "hopefully, I will", ""], ["مَع السَّلامَة", "maʿ as-salāma", "goodbye", ""],
  ]),
];

// ---------------------------------------------------------------- parts 4–6 · the reading
// The texts at the back are the ones from data/read.js, chosen so the book stays inside its five hundred
// words, and ordered the way the book grows: vowelled sentences, then whole days with the marks taken away,
// then the messages she really sends.
const pick = ids => ids.map(id => {
  const r = READS.find(x => x.id === id);
  if (!r) throw new Error(`the book asks for a text that isn't there: ${id}`);
  return { kind: "text", id: "t-" + r.id, title: r.title, lines: r.lines, check: true, marks: r.step <= 6 };
});

// Who says which line, so the message pages are a real conversation and he never learns a -ak as a -ik.
const WHO = {
  msg1: ["me", "her", "her", "me", "her"],
  msg2: ["me", "her", "me", "her", "me"],
  msg3: ["me", "her", "me", "her", "me"],
  msg5: ["her", "me", "her", "me", "her"],
  msg7: ["me", "her", "me", "her", "me"],
  msg10: ["her", "me", "her", "me", "her"],
  msg11: ["her", "me", "her", "me", "her"],
  msg12: ["me", "her", "me", "her", "me"],
  msg13: ["me", "her", "me", "her", "me"],
  msg14: ["me", "her", "me", "her", "me"],
};
const talk = ids => pick(ids).map(p => ({ ...p, kind: "talk", who: WHO[p.id.slice(2)] }));

// ---------------------------------------------------------------- part 7 · whole pages
// The end of the book: nothing new to learn, everything he already has, at full length. Not one word here
// is outside the five hundred — which is the point. A page you can read all the way down is the thing that
// makes a person believe they can read.
const long1 = [
  { kind: "text", id: "g1", check: true, title: T("A whole day", "يوم كامل"), lines: [
    ["أقوم الساعة سبعة الصبح.", "agūm as-sāʿa sabʿa aṣ-ṣubḥ.", "I get up at seven in the morning."],
    ["أغسل وجهي وألبس.", "aghassil wajhi w-albas.", "I wash my face and get dressed."],
    ["بعدين أشرب قهوة وأفطر.", "baʿdēn ashrab gahwa w-afṭir.", "Then I drink coffee and have breakfast."],
    ["أطلع من البيت الساعة ثمانية.", "aṭlaʿ min al-bēt as-sāʿa thamānya.", "I leave the house at eight."],
    ["أشتغل لين الظهر.", "ashtaghil lēn aẓ-ẓuhr.", "I work until noon."],
    ["بعدين أتغدى مع الربع.", "baʿdēn atghadda maʿ ar-rabʿ.", "Then I have lunch with the guys."],
    ["أرجع البيت الساعة خمسة.", "arjaʿ al-bēt as-sāʿa khamsa.", "I come back home at five."],
    ["أشوف ديما بالفويس وأسولف معها.", "ashūf Dīma bil-fōys w-asōlif maʿha.", "I see Dima on a voice note and chat with her."],
    ["بعدين أذاكر عربي ساعة.", "baʿdēn adhākir ʿarabi sāʿa.", "Then I study Arabic for an hour."],
    ["أتعشى وأتفرج شوي.", "atʿashsha w-atfarraj shwayy.", "I have dinner and watch something for a bit."],
    ["وأنام بدري.", "w-anām badri.", "And I go to bed early."],
    ["يوم طويل بس زين.", "yōm ṭawīl bass zēn.", "A long day, but a good one."],
  ] },
  { kind: "text", id: "g2", check: true, title: T("Our house", "بيتنا"), lines: [
    ["بيتنا مو كبير بس فيه كل شي.", "bētna mū kbīr bass fīh kill shay.", "Our house isn't big, but it has everything."],
    ["فيه غرفتين ومطبخ وصالة.", "fīh ghurfatēn w-maṭbakh w-ṣāla.", "It has two rooms, a kitchen and a living room."],
    ["بالصالة طاولة وكرسي.", "biṣ-ṣāla ṭāwla w-kursi.", "In the living room there's a table and a chair."],
    ["بالمطبخ ثلاجة وكاس وصحن.", "bil-maṭbakh thallāja w-kās w-ṣaḥn.", "In the kitchen there's a fridge, a glass and a plate."],
    ["بالغرفة سرير وزولية.", "bil-ghurfa sarīr w-zūliyya.", "In the room there's a bed and a carpet."],
    ["الشباك كبير والنور حلو.", "ash-shibbāk kbīr w-an-nūr ḥilw.", "The window is big and the light is lovely."],
    ["كل صبح أشرب قهوة بالصالة.", "kill ṣubḥ ashrab gahwa biṣ-ṣāla.", "Every morning I drink coffee in the living room."],
    ["وبالليل أقعد أذاكر.", "w-bil-lēl agʿad adhākir.", "And at night I sit and study."],
    ["بيتي صغير بس أحبه.", "bēti ṣghīr bass aḥibbah.", "My house is small, but I love it."],
  ] },
  { kind: "text", id: "g3", check: true, title: T("My week", "أسبوعي"), lines: [
    ["الأسبوع عندنا أوله الأحد.", "al-usbūʿ ʿindana awwalah al-aḥad.", "Our week starts on Sunday."],
    ["والخميس آخر يوم شغل.", "w-al-khamīs ākhir yōm shughl.", "And Thursday is the last working day."],
    ["الجمعة والسبت عطلة.", "al-jumʿa w-as-sabt ʿuṭla.", "Friday and Saturday are the weekend."],
    ["يوم الجمعة أصحى متأخر.", "yōm al-jumʿa aṣḥa mitʾakhkhir.", "On Friday I wake up late."],
    ["بعدين أشرب قهوة مع أهلي.", "baʿdēn ashrab gahwa maʿ ahli.", "Then I have coffee with my family."],
    ["وبعد الظهر أطلع للسوق.", "w-baʿad aẓ-ẓuhr aṭlaʿ lis-sūg.", "And after noon I go out to the market."],
    ["السبت أذاكر عربي مرتين.", "as-sabt adhākir ʿarabi marratēn.", "On Saturday I study Arabic twice."],
    ["وأكلم ديما بالفويس.", "w-akallim Dīma bil-fōys.", "And I call Dima with a voice note."],
    ["الأحد أرجع للشغل.", "al-aḥad arjaʿ lish-shughl.", "On Sunday I go back to work."],
    ["وكل أسبوع أعرف كلمات جديدة.", "w-kill usbūʿ aʿrif kalimāt jidīda.", "And every week I know new words."],
  ] },
  { kind: "text", id: "g4", check: true, title: T("Coffee and people", "القهوة والناس"), lines: [
    ["القهوة عندهم مو مثل قهوتنا.", "al-gahwa ʿindahum mū mithl gahwatna.", "Their coffee isn't like ours."],
    ["لونها فاتح وحلو.", "lōnha fātiḥ w-ḥilw.", "Its colour is light and lovely."],
    ["يشربونها بفنجال صغير.", "yishrabūnha b-finjāl ṣghīr.", "They drink it from a little cup."],
    ["ومعها تمر دايم.", "w-maʿha tamr dāyim.", "And there are always dates with it."],
    ["إذا خلصت الفنجال هز يدك.", "idha khallaṣt al-finjāl hizz yadik.", "When you've finished the cup, shake your hand."],
    ["والناس يسولفون لين الليل.", "w-an-nās yisōlfūn lēn al-lēl.", "And people sit talking until night."],
    ["أول مرة ما حبيتها.", "awwal marra ma ḥabbētha.", "The first time I didn't like it."],
    ["والحين أشربها كل يوم.", "w-al-ḥīn ashrabha kill yōm.", "And now I drink it every day."],
  ] },
  { kind: "text", id: "g5", check: true, title: T("Dima and me", "ديما وأنا"), lines: [
    ["ديما من حفر الباطن وأنا من أوكرانيا.", "Dīma min Ḥafar al-Bāṭin w-ana min Ukrānya.", "Dima is from Hafar al-Batin and I'm from Ukraine."],
    ["كل يوم نتكلم بالجوال.", "kill yōm nitkallam bil-jawwāl.", "Every day we talk on the phone."],
    ["هي ترسل لي فويس وأنا أرد بفويس.", "hi tarsil li fōys w-ana arudd b-fōys.", "She sends me a voice note and I answer with one."],
    ["أول مرة ما فهمت ولا كلمة.", "awwal marra ma fhimt wala kalima.", "The first time I didn't understand a single word."],
    ["والحين أفهم نص الفويس.", "w-al-ḥīn afham nuṣṣ al-fōys.", "And now I understand half the voice note."],
    ["تضحك لما أغلط.", "tiẓḥak lamma aghlaṭ.", "She laughs when I get it wrong."],
    ["أذاكر عشانها.", "adhākir ʿashānha.", "I study because of her."],
    ["وأبي أقول لها كل شي بالعربي.", "w-abi agūl laha kill shay bil-ʿarabi.", "And I want to say everything to her in Arabic."],
    ["بدري بس أنا أدرس كل يوم.", "badri bass ana adris kill yōm.", "It's early, but I study every day."],
  ] },
  { kind: "text", id: "g6", check: true, title: T("A year from now", "بعد سنة"), lines: [
    ["بعد سنة إن شاء الله أعرف كلمات كثيرة.", "baʿad sana in shāʾ allah aʿrif kalimāt kithīra.", "In a year, God willing, I'll know a lot of words."],
    ["بقرا كل شي بدون مساعدة.", "bagra kill shay bidūn musāʿada.", "I'll read everything without help."],
    ["وبفهم الفويس من أول مرة.", "w-bafham al-fōys min awwal marra.", "And I'll understand a voice note the first time."],
    ["بكلم أهلها بالعربي.", "bakallim ahlha bil-ʿarabi.", "I'll talk to her family in Arabic."],
    ["وبقول لأهلها شي حلو.", "w-bagūl l-ahlha shay ḥilw.", "And I'll say something lovely to her family."],
    ["برد عليهم بدون خوف.", "barudd ʿalēhum bidūn khōf.", "I'll answer them without being afraid."],
    ["وبسولف معهم بالمجلس.", "w-basōlif maʿhum bil-majlis.", "And I'll sit and talk with them in the majlis."],
    ["وبشرب قهوة معهم.", "w-bashrab gahwa maʿhum.", "And I'll drink coffee with them."],
    ["وآكل الكبسة كلها.", "w-ākil al-kabsa killaha.", "And I'll eat all of the kabsa."],
    ["وبقول لها كلمة واحدة بس.", "w-bagūl laha kalima wāḥida bass.", "And I'll say one single word to her."],
    ["أحبك.", "aḥibbik.", "I love you."],
    ["وهي تعرف إني تعبت عشانها.", "w-hi taʿrif inni taʿabt ʿashānha.", "And she'll know I worked for it, for her."],
  ] },
];

// [Arabic, pronunciation, English] like everywhere else in the book; the pages want them as lines.
const LONG = long1.map(r => ({ ...r, lines: r.lines.map(([ar, say, en], i) => ({ id: `bk${r.id}x${i}`, ar, say, en, check: true })) }));

// The reading parts run from the shortest page to the longest, so the book itself gets harder as it goes.
const grow = pages => [...pages].sort((a, b) =>
  a.lines.reduce((n, l) => n + l.ar.split(/\s+/).length, 0) - b.lines.reduce((n, l) => n + l.ar.split(/\s+/).length, 0));

export const PARTS = [
  { id: "letters", art: "alphabet", pages: [KEY_PAGE, ...LETTERS],
    title: T("The letters", "الحُرُوف"),
    sub: T("Twenty-eight of them, one to a page", "ثَمَانْيَة وعِشْرِين حَرْف، كِلّ حَرْف بْصَفْحَة"),
    blurb: T("Arabic runs from right to left and the letters hold hands: most of them change shape depending on who they are standing next to. So every letter here is shown four ways — alone, at the start, in the middle, at the end — and every letter has its own colour, which it keeps for the rest of the book. That is how a joined-up word comes apart in front of you.",
             "العَرَبِي يِمْشِي مِن اليَمِين لِليَسَار، والحُرُوف تِمْسِك بَعْض: أَغْلَبْهَا يْغَيِّر شَكْلَه حَسَب اللي جَنْبَه. عَشَان كِذَا كِلّ حَرْف هِنَا مَعْرُوض بْأَرْبَع صِوَر — لِحَالَه، وبْالأَوَّل، وبْالوَسَط، وبْالآخِر — ولْكِلّ حَرْف لَوْنَه اللي يِبْقَى مَعَه لِآخِر الكِتَاب. كِذَا الكَلِمَة المَوْصُولَة تِتْفَكَّك قُدَّامَك.") },
  { id: "marks", art: "qalam", pages: MARKS,
    title: T("The marks", "الحَرَكَات"),
    sub: T("The seven signs that turn letters into words", "سَبْع عَلامَات تْحَوِّل الحُرُوف كَلِمَات"),
    blurb: T("Arabic writes the consonants and leaves the vowels to you. For now they are all written in, the way a child's book writes them, and they stay written in until the middle of this book — then they quietly disappear, because that is how everything outside a school book is written.",
             "العَرَبِي يِكْتِب الصَّوَامِت ويْخَلِّي الحَرَكَات عَلَيْك. الحِين كِلّهَا مَكْتُوبَة، مِثْل كُتُب الأَطْفَال، وتِضَلّ مَكْتُوبَة لِنُصّ الكِتَاب — وبَعْدَيْن تِخْتِفِي بْهُدُوء، لأَن كِذَا يِنْكِتِب كِلّ شَي بَرَّا كُتُب المَدْرَسَة.") },
  { id: "words", art: "market", pages: WORDS,
    title: T("The words", "الكَلِمَات"),
    sub: T("Two hundred you will really use", "مِيَتَيْن كَلِمَة بْتِسْتَخْدِمْهَا فِعْلاً"),
    blurb: T("Not the words a textbook starts with — the words that come up in a day: your house, your food, the weather, how you feel, what you are doing. Tap any of them to hear it. Read the page out loud twice and move on; you will meet every one of them again in the texts.",
             "مُو كَلِمَات كِتَاب المَدْرَسَة — الكَلِمَات اللي تِجِي في اليَوْم العَادِي: بَيْتَك، أَكْلَك، الجَوّ، شْلَوْنَك، وِش تْسَوِّي. اضْغَط عَلَى أَي وَحْدَة تِسْمَعْهَا. اقْرَا الصَّفْحَة بْصَوْت عَالِي مَرَّتَيْن وكَمِّل؛ بْتِلاقِيهَا كِلّهَا مَرَّة ثَانْيَة في النُّصُوص.") },
  { id: "sentences", art: "coffee",
    pages: grow(pick(["me4", "house4", "morning4", "coffee4", "food4", "work4", "souq4", "weather4",
                 "car4", "water4", "time4", "night4", "myday5", "family5", "phone5", "thedays6"])),
    title: T("First sentences", "أَوَّل جُمَل"),
    sub: T("Five lines at a time, every mark still in place", "خَمْس أَسْطُر، وكِلّ الحَرَكَات مَوْجُودَة"),
    blurb: T("From here on it is reading, not spelling. Read the Arabic first and only then look down at the pronunciation — even if you get half of it wrong. Getting it wrong and then seeing why is the whole of learning to read.",
             "مِن هِنَا قِرَاءَة، مُو تَهْجِئَة. اقْرَا العَرَبِي أَوَّل وبَعْدَيْن بَس شُوف النُّطْق — حَتَّى لَو غَلِطْت بْنُصَّه. تِغْلَط وبَعْدَيْن تْشُوف لِيش، هَذِي هِيَ القِرَاءَة كِلّهَا.") },
  { id: "day", art: "night",
    pages: grow(pick(["morning9", "ourhouse9", "coffee9", "week9", "market9", "phone9", "night9", "learning9",
                 "before7", "hername7", "firstvoice7", "rain7", "hafar8", "families9", "dream9", "inayear9"])),
    title: T("My day", "يَوْمِي"),
    sub: T("The marks are gone now — this is real writing", "رَاحَت الحَرَكَات — هَذِي الكِتَابَة الحَقِيقِيَّة"),
    blurb: T("Nobody writes the vowel marks. Not a message, not a sign, not a menu. You know these words by now, so you carry the vowels in your head — and the first time a whole line goes in without you working at it, that is the day you can read Arabic.",
             "مَا فِي أَحَد يِكْتِب الحَرَكَات. لا رِسَالَة ولا لَوْحَة ولا مِنْيُو. الكَلِمَات هَذِي تَعْرِفْهَا، فَالحَرَكَات بْرَاسَك — وأَوَّل مَرَّة يِدْخُل سَطْر كَامِل بِلا مَا تِتْعَب فِيه، ذَاك اليَوْم تْصِير تِقْرَا عَرَبِي.") },
  { id: "talk", art: "phone",
    pages: grow(talk(["msg1", "msg2", "msg3", "msg5", "msg7", "msg10", "msg11", "msg12", "msg13", "msg14"])),
    title: T("We talk", "نَتْكَلَّم"),
    sub: T("The way she actually writes", "مِثْل مَا تِكْتِب هِي"),
    blurb: T("Short, no marks, an emoji where the full stop should be. Her line is on the right, yours on the left. Read hers out loud in her voice; that is the version you want in your head when the phone buzzes.",
             "قَصِيرَة، بِلا حَرَكَات، وإِيمُوجِي بَدَل النُّقْطَة. كَلامْهَا عَلَى اليَمِين وكَلامَك عَلَى اليَسَار. اقْرَا كَلامْهَا بْصَوْت عَالِي بْصَوْتْهَا؛ هَذِي النُّسْخَة اللي تَبِيهَا بْرَاسَك لَمَّا يِرِنّ الجَوَّال.") },
  { id: "long", art: "pages", pages: grow(LONG),
    title: T("Whole pages", "صَفَحَات كَامِلَة"),
    sub: T("Nothing new — everything you have, at full length", "مَا فِي جَدِيد — كِلّ اللي عِنْدَك، بْطُولَه"),
    blurb: T("Not one word on these pages is outside the five hundred. That is the whole point of them: this is what you already know, standing up as a page you can read from the top to the bottom without stopping. Read one out loud every day until it stops feeling like work.",
             "وَلا كَلِمَة بْهَالصَّفَحَات بَرَّا الخَمْسْمِيَة. وهَذِي الفِكْرَة: هَذَا اللي تَعْرِفَه أَصْلاً، بَس وَاقِف كْصَفْحَة تِقْرَاهَا مِن فَوْق لِتَحْت بِلا مَا تْوَقِّف. اقْرَا وَحْدَة بْصَوْت عَالِي كِلّ يَوْم لِين تِرْتَاح فِيهَا.") },
];

export const END = {
  title: T("You can read", "صِرْت تِقْرَا"),
  lines: [
    T("Five hundred words is not a small thing. It is a taxi, a market, a kitchen, a bad day explained, a good night wished.",
      "خَمْسْمِيَة كَلِمَة مُو شَي صْغِير. هِيَ تَاكْسِي، وسُوق، ومَطْبَخ، ويَوْم تِعْبَان تِقْدَر تْفَسِّرَه، ولَيْلَة تْقُول فِيهَا تِصْبِحِين عَلَى خَيْر."),
    T("What is left is not more letters. It is hours: her voice notes, this book again from the front, and saying it out loud until your mouth stops thinking about it.",
      "اللي بَاقِي مُو حُرُوف زِيَادَة. سَاعَات: فُويْسَاتْهَا، وهَالكِتَاب مَرَّة ثَانْيَة مِن أَوَّلَه، وتْقُولْهَا بْصَوْت عَالِي لِين يِسْكُت فَمَّك عَن التَّفْكِير."),
  ],
};

// Every page in reading order, each knowing which part it belongs to and its number in the book.
export const PAGES = PARTS.flatMap((part, i) =>
  [{ kind: "opener", id: "open-" + part.id, part: part.id, partIndex: i }]
    .concat(part.pages.map(p => ({ ...p, part: part.id, partIndex: i }))))
  .concat([{ kind: "end", id: "end", part: "talk", partIndex: PARTS.length - 1 }])
  .map((p, i) => ({ ...p, n: i + 1 }));

export const PART_OF = id => PARTS.find(p => p.id === id);
export const pageIndex = id => PAGES.findIndex(p => p.id === id);
