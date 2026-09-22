// Special days: on these days the welcome screen opens with a greeting for the day instead of the usual one
// (core/welcome.js). Dates follow Saudi time and the Umm al-Qura calendar, like the "year ahead" on Saudi life.
//   title    the big greeting (titleV: a different one in Volodymyr's profile)
//   toHer    the line to Dima, in her profile
//   sayToHer what Volodymyr can say to her that day, with her answer (reply); check = not in the plan yet
//   fact     one line about the day, in the interface language (factV: only in his profile)
// Every phrase: Saudi Arabic, pronunciation, English, Ukrainian.
import { hijriParts } from "../core/prayer.js";
import { BIRTHDAY } from "./birthday.js";

const four = (en, uk, najdi, msa) => ({ en, uk, najdi, msa });
const KULL_AM = { ar: "كل عام وانتي بخير", say: "kill ʿām w inti bkhēr", en: "many happy returns (to her)", uk: "зі святом (до неї)" };
const REPLY = { ar: "وانت بخير", say: "w int bkhēr", en: "and to you", uk: "і тобі того ж" };

export const HOLIDAYS = [
  {
    id: "birthday", look: "birthday", greg: BIRTHDAY.slice(5),
    name: four("Dima's birthday", "День народження Діми", "عيد ميلاد ديما", "عيد ميلاد ديما"),
    title: { ...KULL_AM, en: "Happy birthday", uk: "З днем народження" },
    titleV: { ar: "عيد ميلاد ديما", say: "ʿīd milād dīma", en: "It's Dima's birthday!", uk: "Сьогодні день народження Діми!" },
    toHer: { ar: "عيد ميلاد سعيد يا ديما — من فولوديمير", say: "ʿīd milād saʿīd ya dīma — min volodymyr", en: "Happy birthday, Dima — from Volodymyr", uk: "З днем народження, Дімо — від Володимира" },
    sayToHer: { ...KULL_AM, ar: "كل عام وانتي بخير يا ديما", say: "kill ʿām w inti bkhēr ya dīma", en: "happy birthday, Dima", uk: "з днем народження, Дімо" },
    reply: REPLY,
    factV: four(
      "It's 2 Ramadan: wish her after iftar. Your birthday wishes for her are waiting on Her birthday.",
      "Сьогодні 2 Рамадану: привітай її після іфтару. Твої побажання для неї — на сторінці «Її день народження».",
      "اليوم ٢ رمضان: هنّها بعد الفطور. تهانيك لها في صفحة عيد ميلادها.",
      "اليوم الثاني من رمضان: هنّئها بعد الإفطار. تهانيك لها في صفحة عيد ميلادها.",
    ),
  },
  {
    id: "national", look: "green", greg: "09-23",
    name: four("Saudi National Day", "Національний день Саудівської Аравії", "اليوم الوطني السعودي", "اليوم الوطني السعودي"),
    title: { ar: "يوم وطني سعيد", say: "yōm waṭani saʿīd", en: "Happy National Day", uk: "З Національним днем!" },
    toHer: { ar: "كل عام وانتي بخير يا ديما، ودام عزك يا وطن", say: "kill ʿām w inti bkhēr ya dīma, w dām ʿizzak ya waṭan", en: "Happy National Day, Dima — long may our country be proud", uk: "Зі святом, Дімо! Хай наша країна завжди буде величною" },
    sayToHer: { ar: "كل عام وانتي بخير، ودام عزك يا وطن", say: "kill ʿām w inti bkhēr, w dām ʿizzak ya waṭan", en: "many happy returns — long may our country be proud", uk: "зі святом — хай наша країна завжди буде величною" },
    reply: REPLY, check: true,
    fact: four(
      "On 23 September 1932 King Abdulaziz united the country as the Kingdom of Saudi Arabia. Today everything is green: flags, green lights on the towers, and fireworks at night.",
      "23 вересня 1932 року король Абдулазіз об'єднав країну в Королівство Саудівська Аравія. Сьогодні все зелене: прапори, зелене світло на вежах і феєрверки вночі.",
      "في ٢٣ سبتمبر ١٩٣٢ وحّد الملك عبدالعزيز البلاد باسم المملكة العربية السعودية. اليوم كل شي أخضر: الأعلام، والأبراج تنوّر أخضر، وبالليل ألعاب نارية.",
      "في ٢٣ سبتمبر ١٩٣٢ وحّد الملك عبدالعزيز البلاد باسم المملكة العربية السعودية. واليوم يكتسي كل شيء بالأخضر: الأعلام، وأضواء الأبراج، والألعاب النارية ليلًا.",
    ),
  },
  {
    id: "founding", look: "green", greg: "02-22",
    name: four("Founding Day", "День заснування", "يوم التأسيس", "يوم التأسيس"),
    title: { ar: "يوم بدينا", say: "yōm badēna", en: "The day we began", uk: "День, коли ми почали" },
    toHer: { ar: "يوم تأسيس سعيد يا ديما", say: "yōm taʾsīs saʿīd ya dīma", en: "Happy Founding Day, Dima", uk: "З Днем заснування, Дімо" },
    sayToHer: { ar: "يوم تأسيس سعيد", say: "yōm taʾsīs saʿīd", en: "happy Founding Day", uk: "з Днем заснування" },
    check: true,
    fact: four(
      "In 1727 Imam Muhammad bin Saud founded the first Saudi state in Diriyah, near Riyadh. People wear traditional clothes, and old mud-brick Diriyah is lit up.",
      "У 1727 році імам Мухаммад ібн Сауд заснував першу саудівську державу в Дірії, біля Ер-Ріяда. Люди вдягають традиційний одяг, а стара глиняна Дірія сяє вогнями.",
      "سنة ١٧٢٧ أسّس الإمام محمد بن سعود الدولة السعودية الأولى في الدرعية جنب الرياض. الناس يلبسون اللبس التقليدي، والدرعية الطين تتنوّر.",
      "في عام ١٧٢٧ أسّس الإمام محمد بن سعود الدولة السعودية الأولى في الدرعية قرب الرياض. ويرتدي الناس الزي التقليدي، وتتلألأ الدرعية الطينية بالأضواء.",
    ),
  },
  {
    id: "ramadan", look: "ramadan", hijri: [9, 1, 3],
    name: four("Ramadan begins", "Початок Рамадану", "بداية رمضان", "بداية شهر رمضان"),
    title: { ar: "رمضان كريم", say: "ramaḍān karīm", en: "Ramadan Kareem", uk: "Щедрого Рамадану" },
    toHer: { ar: "رمضان كريم يا ديما", say: "ramaḍān karīm ya dīma", en: "Ramadan Kareem, Dima", uk: "Щедрого Рамадану, Дімо" },
    sayToHer: { ar: "رمضان كريم", say: "ramaḍān karīm", en: "Ramadan Kareem (a generous Ramadan)", uk: "щедрого Рамадану" },
    reply: { ar: "الله أكرم", say: "allah akram", en: "God is more generous", uk: "Бог щедріший" },
    fact: four(
      "The month of fasting: from dawn to sunset no food or water. At sunset the family breaks the fast together — dates and coffee first — and the evenings are long and lively.",
      "Місяць посту: від світанку до заходу сонця ні їжі, ні води. На заході сонця родина разом розговляється — спершу фініки й кава, — а вечори довгі й жваві.",
      "شهر الصيام: من الفجر للمغرب بدون أكل ولا موية. على المغرب العايلة تفطر مع بعض — تمر وقهوة أول — والليل طويل ووناسة.",
      "شهر الصيام: من الفجر إلى المغرب بلا طعام ولا ماء. وعند المغرب تفطر العائلة معًا — التمر والقهوة أولًا — والليالي طويلة عامرة.",
    ),
  },
  {
    id: "fitr", look: "eid", hijri: [10, 1, 3],
    name: four("Eid al-Fitr", "Ід аль-Фітр", "عيد الفطر", "عيد الفطر"),
    title: { ar: "عيدك مبارك", say: "ʿīdik mbārak", en: "Eid Mubarak", uk: "Ід мубарак — зі святом!" },
    titleV: { ar: "عيدك مبارك", say: "ʿīdak mbārak", en: "Eid Mubarak", uk: "Ід мубарак — зі святом!" },
    toHer: { ar: "كل عام وانتي بخير يا ديما", say: "kill ʿām w inti bkhēr ya dīma", en: "Many happy returns, Dima", uk: "Зі святом, Дімо" },
    sayToHer: { ar: "عيدك مبارك، كل عام وانتي بخير", say: "ʿīdik mbārak, kill ʿām w inti bkhēr", en: "Eid Mubarak, many happy returns (to her)", uk: "Ід мубарак, зі святом (до неї)" },
    reply: REPLY,
    fact: four(
      "The feast at the end of Ramadan: the Eid prayer in the morning, new clothes, visits to family, eidiyya money for the children, and sweets and coffee in every house.",
      "Свято наприкінці Рамадану: вранці святкова молитва, новий одяг, гостини в рідних, гроші «ідія» для дітей, солодощі й кава в кожному домі.",
      "العيد بعد رمضان: صلاة العيد الصبح، لبس جديد، زيارة الأهل، العيدية للعيال، والحلا والقهوة في كل بيت.",
      "العيد في ختام رمضان: صلاة العيد صباحًا، والملابس الجديدة، وزيارة الأهل، والعيدية للأطفال، والحلوى والقهوة في كل بيت.",
    ),
  },
  {
    id: "arafah", look: "calm", hijri: [12, 9, 1],
    name: four("Day of Arafah", "День Арафат", "يوم عرفة", "يوم عرفة"),
    title: { ar: "يوم عرفة", say: "yōm ʿarafa", en: "The Day of Arafah", uk: "День Арафат" },
    toHer: { ar: "بكرة العيد يا ديما", say: "bukra l-ʿīd ya dīma", en: "Tomorrow is Eid, Dima", uk: "Завтра Ід, Дімо" },
    sayToHer: { ar: "بكرة العيد", say: "bukra l-ʿīd", en: "tomorrow is Eid", uk: "завтра Ід" },
    check: true,
    fact: four(
      "The pilgrims stand on Mount Arafat near Mecca — the heart of Hajj. Many people fast today; tomorrow is Eid al-Adha.",
      "Паломники стоять на горі Арафат біля Мекки — це серце хаджу. Багато хто сьогодні постить; завтра Ід аль-Адха.",
      "الحجاج يوقفون على جبل عرفة جنب مكة، وهو أهم يوم في الحج. ناس كثير صايمين اليوم، وبكرة عيد الأضحى.",
      "يقف الحجاج على جبل عرفات قرب مكة، وهو ركن الحج الأعظم. ويصوم كثير من الناس هذا اليوم، وغدًا عيد الأضحى.",
    ),
  },
  {
    id: "adha", look: "eid", hijri: [12, 10, 4],
    name: four("Eid al-Adha", "Ід аль-Адха", "عيد الأضحى", "عيد الأضحى"),
    title: { ar: "عيدك مبارك", say: "ʿīdik mbārak", en: "Eid Mubarak", uk: "Ід мубарак — зі святом!" },
    titleV: { ar: "عيدك مبارك", say: "ʿīdak mbārak", en: "Eid Mubarak", uk: "Ід мубарак — зі святом!" },
    toHer: { ar: "كل عام وانتي بخير يا ديما", say: "kill ʿām w inti bkhēr ya dīma", en: "Many happy returns, Dima", uk: "Зі святом, Дімо" },
    sayToHer: { ar: "عيدك مبارك، كل عام وانتي بخير", say: "ʿīdik mbārak, kill ʿām w inti bkhēr", en: "Eid Mubarak, many happy returns (to her)", uk: "Ід мубарак, зі святом (до неї)" },
    reply: REPLY,
    fact: four(
      "The feast of the sacrifice, at the end of Hajj: families sacrifice a sheep and share the meat with relatives and people in need — four days of visits.",
      "Свято жертвопринесення наприкінці хаджу: родини приносять у жертву барана й діляться м'ясом з рідними та тими, хто потребує, — чотири дні гостин.",
      "عيد الحج: الناس يذبحون الأضاحي ويوزعون اللحم على الأهل والمحتاجين، وأربع أيام زيارات.",
      "عيد الأضحى في ختام الحج: تذبح الأسر الأضاحي وتوزّع لحمها على الأقارب والمحتاجين، وأربعة أيام من الزيارات.",
    ),
  },
  {
    id: "newyear", look: "calm", hijri: [1, 1, 1],
    name: four("Islamic New Year", "Ісламський Новий рік", "رأس السنة الهجرية", "رأس السنة الهجرية"),
    title: { ar: "سنة هجرية جديدة", say: "sana hijriyya jdīda", en: "A new Hijri year", uk: "Новий рік за хіджрою" },
    toHer: { ar: "كل عام وانتي بخير يا ديما", say: "kill ʿām w inti bkhēr ya dīma", en: "Many happy returns, Dima", uk: "Зі святом, Дімо" },
    sayToHer: KULL_AM,
    reply: REPLY,
    fact: four(
      "1 Muharram begins the Islamic year, counted from the Prophet's journey from Mecca to Medina in 622. Saudi Arabia lives by this calendar: the Hijri date is on every official paper.",
      "1 мухаррама починається ісламський рік — від переселення Пророка з Мекки до Медини у 622 році. Саудівська Аравія живе за цим календарем: дата за хіджрою є на кожному офіційному папері.",
      "أول محرّم بداية السنة الهجرية، من هجرة النبي ﷺ من مكة للمدينة سنة ٦٢٢. والسعودية تمشي على هالتقويم: التاريخ الهجري على كل ورقة رسمية.",
      "الأول من محرّم بداية السنة الهجرية، منذ هجرة النبي ﷺ من مكة إلى المدينة عام ٦٢٢. والمملكة تعتمد هذا التقويم: فالتاريخ الهجري على كل وثيقة رسمية.",
    ),
  },
];

// The special day on a Saudi date ("YYYY-MM-DD"), or null. Her birthday comes first (it falls in Ramadan in 2027).
export function holidayOn(key) {
  const h = hijriParts(new Date(`${key}T12:00:00Z`));
  return HOLIDAYS.find(o => o.greg ? key.slice(5) === o.greg : h.month === o.hijri[0] && h.day >= o.hijri[1] && h.day < o.hijri[1] + o.hijri[2]) ?? null;
}
