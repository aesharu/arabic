// The hundred words for talking to Dima (#/hundred).
//
// Every one of them is from the plan's own vocabulary (public/data/vocab.json) or from what she taught him
// (data/hers.js) — nothing here is invented Arabic.
//
// Three columns matter:
//   ar    the plain spelling, the way it is really written
//   said  the same word fully marked, and spelled so that a Saudi voice reads it the way SHE says it.
//         This is what was typed into the voice engine, and it is what the page shows him to read.
//   say   the pronunciation, in the plan's Latin
//
// The marking rules, which tests/hundred.test.mjs enforces word by word:
//   · every consonant carries a fatḥa, kasra, ḍamma, sukūn or shadda — a bare letter makes the engine guess,
//     and when it guesses it guesses فصحى (زين came out "zīn" until it was written زَيْن);
//   · ay where she says ē and aw where she says ō — a Saudi mouth reads زَيْن as zēn, وَيْن as wēn;
//   · a sukūn where the dialect drops the vowel: بْخَيْر, not بِخَيْر;
//   · the final ـك is a kasra, because he is speaking to her: شَخْبَارِكْ, never -ak;
//   · ق is written گ in `said` only. She says gahwa; the engine reads ق as q, and q is فصحى. The page always
//     shows the real ق (`show` below) — the گ never reaches his eyes, only the voice's ear.
const G = (id, title, sub, words) => ({ id, title, sub, words });
const T = (en, najdi) => ({ en, najdi });

export const GROUPS = [
  G("hello", T("Hello and goodbye", "سَلَام ومَع السَّلَامَة"),
    T("How every conversation opens and closes.", "كيف تفتح وتسكّر أي كلام."), [
    ["سلام", "سَلَام", "salām", "hi"],
    ["هلا", "هَلَا", "hala", "hi (warmer)"],
    ["صباح الخير", "صَبَاح الخَيْر", "ṣabāḥ al-khēr", "good morning"],
    ["مساء الخير", "مَسَاء الخَيْر", "masāʾ al-khēr", "good evening"],
    ["شلونك؟", "شْلَوْنِكْ", "shlōnik?", "how are you? (to her)"],
    ["شخبارك؟", "شَخْبَارِكْ", "shakhbārik?", "what's new? (to her)"],
    ["الحمد لله", "الحَمْدُ لله", "al-ḥamdu lillāh", "I'm well, thank God"],
    ["بخير", "بْخَيْر", "bkhēr", "fine"],
    ["تسلمين", "تِسْلَمِين", "tislamīn", "thank you (to her)"],
    ["الله يعطيك العافية", "الله يِعْطِيكْ العَافْيَة", "allah yiʿṭīk al-ʿāfya", "thank you (for an effort)"],
    ["مع السلامة", "مَعْ السَّلَامَة", "maʿ as-salāma", "goodbye"],
    ["تصبحين على خير", "تِصْبِحِين عَلَى خَيْر", "tiṣbiḥīn ʿala khēr", "good night (to her)"],
  ]),
  G("yes", T("Yes, no, really?", "إِيه، لَا، وَالله؟"),
    T("Half of any conversation is these twelve.", "نص أي كلام هو هالاثنا عشر."), [
    ["إيه", "إِيه", "ēh", "yes"],
    ["لا", "لَا", "la", "no"],
    ["أكيد", "أَكِيد", "akīd", "sure"],
    ["طيب", "طَيِّب", "ṭayyib", "okay, well"],
    ["زين", "زَيْن", "zēn", "good"],
    ["تمام", "تَمَام", "tamām", "all good"],
    ["خلاص", "خَلَاص", "khalāṣ", "done, enough"],
    ["يلا", "يَلَّا", "yalla", "come on"],
    ["والله؟", "وَالله", "wallah?", "really?"],
    ["معليش", "مَعْلَيْش", "maʿlēsh", "never mind"],
    ["عادي", "عَادِي", "ʿādi", "it's fine"],
    ["مدري", "مَدْرِي", "madri", "I don't know"],
  ]),
  G("ask", T("Asking", "أَسْئِلَة"),
    T("With وش and وين alone you can keep an evening going.", "بـ«وش» و«وين» بس تقدر تمشّي سهرة كاملة."), [
    ["وش", "وِش", "wesh", "what"],
    ["وين", "وَيْن", "wēn", "where"],
    ["متى", "مِتَى", "mita", "when"],
    ["ليش", "لَيْش", "lēsh", "why"],
    ["كيف", "كَيْف", "kēf", "how"],
    ["مين", "مِين", "mīn", "who"],
    ["كم", "كَمْ", "kam", "how many"],
    ["وش تسوين؟", "وِش تْسَوِّين", "wesh tsawwīn?", "what are you doing? (to her)"],
    ["وينك؟", "وَيْنِكْ", "wēnik?", "where are you? (to her)"],
    ["وش فيك؟", "وِش فِيكْ", "wesh fīk?", "what's wrong? (to her)"],
  ]),
  G("small", T("The small words", "كَلِمَات صْغِيرَة"),
    T("Nine words out of ten in a real message are one of these.", "تسع كلمات من عشر بأي رسالة هي من هذي."), [
    ["أنا", "أَنَا", "ana", "I"],
    ["انتي", "اِنْتِي", "inti", "you (to a woman)"],
    ["حنا", "حِنَّا", "ḥinna", "we"],
    ["مع", "مَعْ", "maʿ", "with"],
    ["من", "مِنْ", "min", "from"],
    ["في", "فِي", "fi", "in"],
    ["على", "عَلَى", "ʿala", "on"],
    ["بس", "بَسّ", "bass", "but, just"],
    ["كل", "كِلّ", "kill", "every, all"],
    ["شوي", "شْوَيّ", "shwayy", "a little"],
    ["عشان", "عَشَان", "ʿashān", "because"],
    ["يعني", "يَعْنِي", "yaʿni", "I mean, like"],
  ]),
  G("when", T("When", "الوَقْت"),
    T("The words that open almost every message she sends.", "الكلمات اللي تفتح أغلب رسايلها."), [
    ["الحين", "الحِين", "al-ḥīn", "now"],
    ["اليوم", "اليَوْم", "al-yōm", "today"],
    ["بكرة", "بُكْرَة", "bukra", "tomorrow"],
    ["أمس", "أَمْس", "ams", "yesterday"],
    ["بعدين", "بَعْدَيْن", "baʿdēn", "later"],
    ["الصبح", "الصُّبْح", "aṣ-ṣubḥ", "the morning"],
    ["الليل", "اللَّيْل", "al-lēl", "the night"],
    ["ساعة", "سَاعَة", "sāʿa", "an hour"],
    ["أسبوع", "أُسْبُوع", "usbūʿ", "a week"],
  ]),
  G("feel", T("How you are", "شْلَوْنِي"),
    T("Answer شلونك with one of these and you have had a conversation.", "رد على «شلونك» بوحدة من هذي وتكون سويت محادثة."), [
    ["تعبان", "تَعْبَان", "taʿbān", "tired"],
    ["جوعان", "جُوعَان", "jūʿān", "hungry"],
    ["مبسوط", "مَبْسُوط", "mabsūṭ", "happy"],
    ["زعلان", "زَعْلَان", "zaʿlān", "upset"],
    ["مشغول", "مَشْغُول", "mashghūl", "busy"],
    ["فاضي", "فَاضِي", "fāẓi", "free"],
    ["مشتاق", "مِشْتَاگ", "mishtāg", "missing you"],
    ["خايف", "خَايِف", "khāyif", "scared"],
    ["مريض", "مَرِيض", "marīẓ", "ill"],
  ]),
  G("her", T("To her", "كَلَام لَهَا"),
    T("The ones she will answer with a voice note.", "اللي بترد عليها بفويس."), [
    ["أحبك", "أَحِبِّكْ", "aḥibbik", "I love you"],
    ["حبيبتي", "حَبِيبْتِي", "ḥabībti", "my love"],
    ["يا عمري", "يَا عُمْرِي", "ya ʿumri", "my life"],
    ["يا قلبي", "يَا گَلْبِي", "ya galbi", "my heart"],
    ["فديتك", "فِدَيْتِكْ", "fidētik", "sweetheart"],
    ["اشتقت لك", "اِشْتَگْتْ لِكْ", "ishtagt lik", "I missed you"],
    ["ودي أشوفك", "وِدِّي أَشُوفِكْ", "widdi ashūfik", "I want to see you"],
    ["تبين شي؟", "تِبِين شَي", "tibīn shay?", "do you need anything?"],
    ["الله يحفظك", "الله يِحْفَظِكْ", "allah yiḥfaẓik", "God keep you safe"],
    ["انتي أحلى شي", "اِنْتِي أَحْلَى شَي", "inti aḥla shay", "you're the best thing"],
  ]),
  G("do", T("What you do", "أَفْعَال"),
    T("All in the “I” form. Swap the first letter for تـ and add ـين and you are talking to her.",
      "كلها بصيغة «أنا». بدّل أول حرف بـ«تـ» وزِد «ـين» وتكون تكلمها."), [
    ["أبي", "أَبِي", "abi", "I want"],
    ["أحب", "أَحِبّ", "aḥibb", "I love, I like"],
    ["أروح", "أَرُوح", "arūḥ", "I go"],
    ["أجي", "أَجِي", "aji", "I come"],
    ["أسوي", "أَسَوِّي", "asawwi", "I do, I make"],
    ["أقول", "أَگُول", "agūl", "I say"],
    ["أشوف", "أَشُوف", "ashūf", "I see"],
    ["أعرف", "أَعْرِف", "aʿrif", "I know"],
    ["أفهم", "أَفْهَم", "afham", "I understand"],
    ["آكل", "آكِل", "ākil", "I eat"],
    ["أشرب", "أَشْرَب", "ashrab", "I drink"],
    ["أنام", "أَنَام", "anām", "I sleep"],
    ["أصحى", "أَصْحَى", "aṣḥa", "I wake up"],
    ["أشتغل", "أَشْتَغِل", "ashtaghil", "I work"],
    ["أدرس", "أَدْرِس", "adris", "I study"],
    ["أتكلم", "أَتْكَلَّم", "atkallam", "I speak"],
  ]),
  G("lost", T("When you don't understand", "لَمَّا مَا تِفْهَم"),
    T("Say these instead of going quiet. She would rather teach you than lose you.",
      "قل هذي بدل ما تسكت. هي تفضّل تعلّمك على إنك تختفي."), [
    ["ما فهمت", "مَا فْهِمْت", "ma fhimt", "I didn't understand"],
    ["عيدي", "عِيدِي", "ʿīdi", "say it again (to her)"],
    ["شوي شوي", "شْوَيّ شْوَيّ", "shwayy shwayy", "slowly"],
    ["وش معنى", "وِش مَعْنَى", "wesh maʿna", "what does it mean"],
    ["كيف أقول", "كَيْف أَگُول", "kēf agūl", "how do I say"],
    ["آسف", "آسِف", "āsif", "sorry"],
  ]),
  G("things", T("Four things", "أَرْبَع أَشْيَاء"),
    T("The four that come up every single day.", "الأربعة اللي تجي كل يوم."), [
    ["قهوة", "گَهْوَة", "gahwa", "coffee"],
    ["موية", "مَوْيَة", "mōya", "water"],
    ["بيت", "بَيْت", "bēt", "home"],
    ["جوال", "جَوَّال", "jawwāl", "phone"],
  ]),
];

// The g that ق stands for in her dialect is written گ for the voice engine only; he always sees ق.
const show = said => said.replace(/گ/g, "ق");
const slug = say => say.toLowerCase()
  .replace(/[āăá]/g, "a").replace(/[īí]/g, "i").replace(/[ūú]/g, "u").replace(/[ēé]/g, "e").replace(/[ōó]/g, "o")
  .replace(/ḥ/g, "h").replace(/ṣ/g, "s").replace(/[ẓḍ]/g, "z").replace(/ṭ/g, "t").replace(/ġ/g, "gh")
  .replace(/[ʿʾ'’ʼ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// من (min, "from") and مين (mīn, "who") come out of slug() the same, so the file is named for the group too.
export const HUNDRED = GROUPS.flatMap(g =>
  g.words.map(([ar, said, say, en]) => {
    const base = slug(say);
    const clash = GROUPS.some(o => o.id !== g.id && o.words.some(w => slug(w[2]) === base));
    return { ar, said, show: show(said), say, en, group: g.id, file: clash ? `${base}-${g.id}` : base };
  }));

export const wordOf = file => HUNDRED.find(w => w.file === file);
