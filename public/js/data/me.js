// "Talk about yourself" (views/me.js): the choices, each with its Najdi, pronunciation, English and Ukrainian.
// The sentences are built from these; all of it shows "check with tutor".
const row = ([id, ar, say, en, uk, x]) => ({ id, ar, say, en, uk, ...(x ?? {}) });

export const NAMES = [
  ["volodka", "فولودكا", "Folodka", "Volodka", "Володька"],
  ["volodymyr", "فولوديمير", "Folodīmir", "Volodymyr", "Володимир"],
  ["vova", "فوفا", "Fōfa", "Vova", "Вова"],
].map(row);

// ukFrom: "з Києва" (from …), for the Ukrainian sentence.
export const CITIES = [
  ["kyiv", "كييف", "Kyīv", "Kyiv", "Київ", { ukFrom: "з Києва" }],
  ["lviv", "لفيف", "Lvīv", "Lviv", "Львів", { ukFrom: "зі Львова" }],
  ["kharkiv", "خاركيف", "Khārkiv", "Kharkiv", "Харків", { ukFrom: "з Харкова" }],
  ["odesa", "أوديسا", "Ōdēsa", "Odesa", "Одеса", { ukFrom: "з Одеси" }],
  ["dnipro", "دنيبرو", "Dnīpro", "Dnipro", "Дніпро", { ukFrom: "з Дніпра" }],
  ["zaporizhzhia", "زابوريجيا", "Zāporīzhya", "Zaporizhzhia", "Запоріжжя", { ukFrom: "із Запоріжжя" }],
  ["vinnytsia", "فينيتسا", "Vīnnitsa", "Vinnytsia", "Вінниця", { ukFrom: "з Вінниці" }],
  ["poltava", "بولتافا", "Poltāva", "Poltava", "Полтава", { ukFrom: "з Полтави" }],
  ["frankivsk", "إيفانو فرانكيفسك", "Īvāno-Frānkivsk", "Ivano-Frankivsk", "Івано-Франківськ", { ukFrom: "з Івано-Франківська" }],
  ["ternopil", "ترنوبل", "Ternopil", "Ternopil", "Тернопіль", { ukFrom: "з Тернополя" }],
  ["chernihiv", "تشيرنيهيف", "Chernīhiv", "Chernihiv", "Чернігів", { ukFrom: "з Чернігова" }],
  ["zhytomyr", "جيتومير", "Zhitōmir", "Zhytomyr", "Житомир", { ukFrom: "з Житомира" }],
].map(row);

// ukIn: "в Україні" (in …).
export const COUNTRIES = [
  ["ukraine", "أوكرانيا", "Ukrānya", "Ukraine", "Україна", { ukIn: "в Україні" }],
  ["poland", "بولندا", "bōlanda", "Poland", "Польща", { ukIn: "в Польщі" }],
  ["germany", "ألمانيا", "almānya", "Germany", "Німеччина", { ukIn: "в Німеччині" }],
  ["czechia", "التشيك", "at-tshēk", "Czechia", "Чехія", { ukIn: "в Чехії" }],
  ["uk", "بريطانيا", "brīṭānya", "Britain", "Британія", { ukIn: "в Британії" }],
  ["usa", "أمريكا", "amrīka", "America", "Америка", { ukIn: "в Америці" }],
  ["canada", "كندا", "kanada", "Canada", "Канада", { ukIn: "в Канаді" }],
  ["saudi", "السعودية", "as-saʿūdiyya", "Saudi Arabia", "Саудівська Аравія", { ukIn: "в Саудівській Аравії" }],
].map(row);

// Whole sentences: "I work as …".
export const JOBS = [
  ["computers", "أشتغل على الكمبيوتر", "ashtaghil ʿala l-kambyūtar", "I work with computers", "Я працюю з комп'ютерами"],
  ["programmer", "أشتغل مبرمج", "ashtaghil mubarmij", "I work as a programmer", "Я працюю програмістом"],
  ["designer", "أشتغل مصمم", "ashtaghil muṣammim", "I work as a designer", "Я працюю дизайнером"],
  ["engineer", "أنا مهندس", "ana muhandis", "I'm an engineer", "Я інженер"],
  ["manager", "أنا مدير في شركة", "ana mudīr fi sharika", "I'm a manager at a company", "Я менеджер у компанії"],
  ["business", "عندي شغل خاص", "ʿindi shughul khāṣṣ", "I have my own business", "У мене власна справа"],
  ["teacher", "أنا معلم", "ana mʿallim", "I'm a teacher", "Я вчитель"],
  ["student", "أنا طالب في الجامعة", "ana ṭālib fi l-jāmʿa", "I'm a university student", "Я студент університету"],
  ["doctor", "أنا دكتور", "ana daktōr", "I'm a doctor", "Я лікар"],
  ["driver", "أنا سواق", "ana sawwāg", "I'm a driver", "Я водій"],
  ["cook", "أنا طباخ", "ana ṭabbākh", "I'm a cook", "Я кухар"],
  ["military", "أنا عسكري", "ana ʿaskari", "I'm in the military", "Я військовий"],
  ["none", "ما أشتغل الحين", "ma ashtaghil al-ḥīn", "I'm not working right now", "Зараз я не працюю"],
].map(row);

// ukWith: "українською" (in Ukrainian).
export const LANGUAGES = [
  ["uk", "أوكراني", "ukrāni", "Ukrainian", "українською"],
  ["en", "إنجليزي", "ingilīzi", "English", "англійською"],
  ["ru", "روسي", "rūsi", "Russian", "російською"],
  ["pl", "بولندي", "bōlandi", "Polish", "польською"],
  ["de", "ألماني", "almāni", "German", "німецькою"],
].map(row);

// With "the" in Arabic: أحب الكورة والسفر.
export const HOBBIES = [
  ["football", "الكورة", "al-kōra", "football", "футбол"],
  ["gym", "النادي", "an-nādi", "the gym", "спортзал"],
  ["reading", "القراية", "al-grāya", "reading", "читання"],
  ["travel", "السفر", "as-safar", "travel", "подорожі"],
  ["cooking", "الطبخ", "aṭ-ṭabkh", "cooking", "готування"],
  ["photos", "التصوير", "at-taṣwīr", "photography", "фотографію"],
  ["games", "البلايستيشن", "al-blēstēshin", "video games", "відеоігри"],
  ["music", "الموسيقى", "al-mūsīga", "music", "музику"],
  ["movies", "الأفلام", "al-aflām", "movies", "фільми"],
  ["walking", "المشي", "al-mashi", "walking", "прогулянки"],
  ["swimming", "السباحة", "as-sibāḥa", "swimming", "плавання"],
  ["drawing", "الرسم", "ar-rasim", "drawing", "малювання"],
  ["cars", "السيارات", "as-sayyārāt", "cars", "автомобілі"],
  ["desert", "البر", "al-barr", "going out to the desert", "виїзди в пустелю"],
].map(row);

export const FOODS = [
  ["kabsa", "الكبسة", "al-kabsa", "kabsa", "кабса"],
  ["borscht", "البورشت", "al-bōrsht", "borscht", "борщ"],
  ["varenyky", "الوارنيكي", "al-warnīki", "varenyky", "вареники"],
  ["mandi", "المندي", "al-mandi", "mandi (rice and meat)", "манді (рис із м'ясом)"],
  ["jareesh", "الجريش", "al-jarīsh", "jareesh", "джаріш"],
  ["shawarma", "الشاورما", "ash-shāwarma", "shawarma", "шаурма"],
  ["pizza", "البيتزا", "al-bītza", "pizza", "піца"],
  ["sushi", "السوشي", "as-sūshi", "sushi", "суші"],
].map(row);

// Fixed questions and answers (to a man), and questions to ask her back.
export const MORE_QA = [
  { q: ["وش رأيك بالسعودية؟", "wesh raʾyak bis-saʿūdiyya?", "What do you think of Saudi Arabia?", "Що ти думаєш про Саудівську Аравію?"],
    a: ["حلوة مرة، وأهلها طيبين.", "ḥilwa marra, w-ahalha ṭayybīn.", "It's lovely, and its people are kind.", "Вона дуже гарна, а люди добрі."] },
  { q: ["تحب القهوة العربية؟", "tḥibb al-gahwa l-ʿarabiyya?", "Do you like Arabic coffee?", "Ти любиш арабську каву?"],
    a: ["إيه، أحبها مرة!", "ēh, aḥibbha marra!", "Yes, I love it!", "Так, дуже люблю!"] },
  { q: ["ليش تتعلم عربي؟", "lēsh titʿallam ʿarabi?", "Why are you learning Arabic?", "Чому ти вчиш арабську?"],
    a: ["أحب اللهجة السعودية، وأبي أتكلم مع الناس هنا.", "aḥibb al-lahja s-saʿūdiyya, w-abi atkallam maʿ an-nās hina.", "I love the Saudi dialect, and I want to talk with people here.", "Я люблю саудівський діалект і хочу говорити з людьми тут."] },
];

export const ASK_HER = [
  ["شلونك؟", "shlōnik?", "How are you? (to her)", "Як ти? (до неї)"],
  ["وش تشتغلين؟", "wesh tishtaghlīn?", "What do you do for work? (to her)", "Ким ти працюєш? (до неї)"],
  ["وين ساكنة؟", "wēn sākna?", "Where do you live? (to her)", "Де ти живеш? (до неї)"],
  ["عندك إخوان؟", "ʿindik ikhwān?", "Do you have brothers and sisters? (to her)", "У тебе є брати й сестри? (до неї)"],
  ["وش تحبين تسوين بوقت فراغك؟", "wesh tḥibbīn tsawwīn b-wagt farāghik?", "What do you like doing in your free time? (to her)", "Що ти любиш робити у вільний час? (до неї)"],
  ["وش أكثر أكلة تحبينها؟", "wesh akthar akla tḥibbīnha?", "What's your favorite food? (to her)", "Яка твоя улюблена страва? (до неї)"],
  ["وش أكثر مكان تحبينه في السعودية؟", "wesh akthar makān tḥibbīnah fi s-saʿūdiyya?", "What's your favorite place in Saudi Arabia? (to her)", "Яке твоє улюблене місце в Саудівській Аравії? (до неї)"],
].map(([ar, say, en, uk]) => ({ ar, say, en, uk, check: true }));
