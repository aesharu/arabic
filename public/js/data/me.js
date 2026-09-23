// "Talk about yourself" (views/me.js): the choices, each with its Najdi, pronunciation, English and Ukrainian.
// The sentences are built from these; all of it shows "check with tutor".
const row = ([id, ar, say, en, x]) => ({ id, ar, say, en, ...(x ?? {}) });

export const NAMES = [
  ["volodka", "فولودكا", "Folodka", "Volodka"],
  ["volodymyr", "فولوديمير", "Folodīmir", "Volodymyr"],
  ["vova", "فوفا", "Fōfa", "Vova"],
].map(row);

export const CITIES = [
  ["kyiv", "كييف", "Kyīv", "Kyiv"],
  ["lviv", "لفيف", "Lvīv", "Lviv"],
  ["kharkiv", "خاركيف", "Khārkiv", "Kharkiv"],
  ["odesa", "أوديسا", "Ōdēsa", "Odesa"],
  ["dnipro", "دنيبرو", "Dnīpro", "Dnipro"],
  ["zaporizhzhia", "زابوريجيا", "Zāporīzhya", "Zaporizhzhia"],
  ["vinnytsia", "فينيتسا", "Vīnnitsa", "Vinnytsia"],
  ["poltava", "بولتافا", "Poltāva", "Poltava"],
  ["frankivsk", "إيفانو فرانكيفسك", "Īvāno-Frānkivsk", "Ivano-Frankivsk"],
  ["ternopil", "ترنوبل", "Ternopil", "Ternopil"],
  ["chernihiv", "تشيرنيهيف", "Chernīhiv", "Chernihiv"],
  ["zhytomyr", "جيتومير", "Zhitōmir", "Zhytomyr"],
].map(row);

export const COUNTRIES = [
  ["ukraine", "أوكرانيا", "Ukrānya", "Ukraine"],
  ["poland", "بولندا", "bōlanda", "Poland"],
  ["germany", "ألمانيا", "almānya", "Germany"],
  ["czechia", "التشيك", "at-tshēk", "Czechia"],
  ["uk", "بريطانيا", "brīṭānya", "Britain"],
  ["usa", "أمريكا", "amrīka", "America"],
  ["canada", "كندا", "kanada", "Canada"],
  ["saudi", "السعودية", "as-saʿūdiyya", "Saudi Arabia"],
].map(row);

// Whole sentences: "I work as …".
export const JOBS = [
  ["computers", "أشتغل على الكمبيوتر", "ashtaghil ʿala l-kambyūtar", "I work with computers"],
  ["programmer", "أشتغل مبرمج", "ashtaghil mubarmij", "I work as a programmer"],
  ["designer", "أشتغل مصمم", "ashtaghil muṣammim", "I work as a designer"],
  ["engineer", "أنا مهندس", "ana muhandis", "I'm an engineer"],
  ["manager", "أنا مدير في شركة", "ana mudīr fi sharika", "I'm a manager at a company"],
  ["business", "عندي شغل خاص", "ʿindi shughul khāṣṣ", "I have my own business"],
  ["teacher", "أنا معلم", "ana mʿallim", "I'm a teacher"],
  ["student", "أنا طالب في الجامعة", "ana ṭālib fi l-jāmʿa", "I'm a university student"],
  ["doctor", "أنا دكتور", "ana daktōr", "I'm a doctor"],
  ["driver", "أنا سواق", "ana sawwāg", "I'm a driver"],
  ["cook", "أنا طباخ", "ana ṭabbākh", "I'm a cook"],
  ["military", "أنا عسكري", "ana ʿaskari", "I'm in the military"],
  ["none", "ما أشتغل الحين", "ma ashtaghil al-ḥīn", "I'm not working right now"],
].map(row);

export const LANGUAGES = [
  ["uk", "أوكراني", "ukrāni", "Ukrainian"],
  ["en", "إنجليزي", "ingilīzi", "English"],
  ["ru", "روسي", "rūsi", "Russian"],
  ["pl", "بولندي", "bōlandi", "Polish"],
  ["de", "ألماني", "almāni", "German"],
].map(row);

// With "the" in Arabic: أحب الكورة والسفر.
export const HOBBIES = [
  ["football", "الكورة", "al-kōra", "football"],
  ["gym", "النادي", "an-nādi", "the gym"],
  ["reading", "القراية", "al-grāya", "reading"],
  ["travel", "السفر", "as-safar", "travel"],
  ["cooking", "الطبخ", "aṭ-ṭabkh", "cooking"],
  ["photos", "التصوير", "at-taṣwīr", "photography"],
  ["games", "البلايستيشن", "al-blēstēshin", "video games"],
  ["music", "الموسيقى", "al-mūsīga", "music"],
  ["movies", "الأفلام", "al-aflām", "movies"],
  ["walking", "المشي", "al-mashi", "walking"],
  ["swimming", "السباحة", "as-sibāḥa", "swimming"],
  ["drawing", "الرسم", "ar-rasim", "drawing"],
  ["cars", "السيارات", "as-sayyārāt", "cars"],
  ["desert", "البر", "al-barr", "going out to the desert"],
].map(row);

export const FOODS = [
  ["kabsa", "الكبسة", "al-kabsa", "kabsa"],
  ["borscht", "البورشت", "al-bōrsht", "borscht"],
  ["varenyky", "الوارنيكي", "al-warnīki", "varenyky"],
  ["mandi", "المندي", "al-mandi", "mandi (rice and meat)"],
  ["jareesh", "الجريش", "al-jarīsh", "jareesh"],
  ["shawarma", "الشاورما", "ash-shāwarma", "shawarma"],
  ["pizza", "البيتزا", "al-bītza", "pizza"],
  ["sushi", "السوشي", "as-sūshi", "sushi"],
].map(row);

// Fixed questions and answers (to a man), and questions to ask her back.
export const MORE_QA = [
  { q: ["وش رأيك بالسعودية؟", "wesh raʾyak bis-saʿūdiyya?", "What do you think of Saudi Arabia?"],
    a: ["حلوة مرة، وأهلها طيبين.", "ḥilwa marra, w-ahalha ṭayybīn.", "It's lovely, and its people are kind."] },
  { q: ["تحب القهوة العربية؟", "tḥibb al-gahwa l-ʿarabiyya?", "Do you like Arabic coffee?"],
    a: ["إيه، أحبها مرة!", "ēh, aḥibbha marra!", "Yes, I love it!"] },
  { q: ["ليش تتعلم عربي؟", "lēsh titʿallam ʿarabi?", "Why are you learning Arabic?"],
    a: ["أحب اللهجة السعودية، وأبي أتكلم مع الناس هنا.", "aḥibb al-lahja s-saʿūdiyya, w-abi atkallam maʿ an-nās hina.", "I love the Saudi dialect, and I want to talk with people here."] },
];

export const ASK_HER = [
  ["شلونك؟", "shlōnik?", "How are you? (to her)"],
  ["وش تشتغلين؟", "wesh tishtaghlīn?", "What do you do for work? (to her)"],
  ["وين ساكنة؟", "wēn sākna?", "Where do you live? (to her)"],
  ["عندك إخوان؟", "ʿindik ikhwān?", "Do you have brothers and sisters? (to her)"],
  ["وش تحبين تسوين بوقت فراغك؟", "wesh tḥibbīn tsawwīn b-wagt farāghik?", "What do you like doing in your free time? (to her)"],
  ["وش أكثر أكلة تحبينها؟", "wesh akthar akla tḥibbīnha?", "What's your favorite food? (to her)"],
  ["وش أكثر مكان تحبينه في السعودية؟", "wesh akthar makān tḥibbīnah fi s-saʿūdiyya?", "What's your favorite place in Saudi Arabia? (to her)"],
].map(([ar, say, en]) => ({ ar, say, en, check: true }));
