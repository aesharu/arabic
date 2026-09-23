// Special days: on these days the welcome screen opens with a greeting for the day instead of the usual one
// (core/welcome.js). Dates follow Saudi time and the Umm al-Qura calendar, like the "year ahead" on Saudi life.
//   title    the big greeting (titleV: a different one in Volodymyr's profile)
//   toHer    the line to Dima, in her profile
//   sayToHer what Volodymyr can say to her that day, with her answer (reply); check = not in the plan yet
//   fact     one line about the day, in the interface language (factV: only in his profile)
// Every phrase: Saudi Arabic, pronunciation, English, Ukrainian.
import { hijriParts } from "../core/prayer.js";
import { BIRTHDAY } from "./birthday.js";

const both = (en, najdi) => ({ en, najdi });
const KULL_AM = { ar: "كل عام وانتي بخير", say: "kill ʿām w inti bkhēr", en: "many happy returns (to her)" };
const REPLY = { ar: "وانت بخير", say: "w int bkhēr", en: "and to you" };

export const HOLIDAYS = [
  {
    id: "birthday", look: "birthday", greg: BIRTHDAY.slice(5),
    name: both("Dima's birthday", "عيد ميلاد ديما"),
    title: { ...KULL_AM, en: "Happy birthday" },
    titleV: { ar: "عيد ميلاد ديما", say: "ʿīd milād dīma", en: "It's Dima's birthday!" },
    toHer: { ar: "عيد ميلاد سعيد يا ديما — من فولوديمير", say: "ʿīd milād saʿīd ya dīma — min volodymyr", en: "Happy birthday, Dima — from Volodymyr" },
    sayToHer: { ...KULL_AM, ar: "كل عام وانتي بخير يا ديما", say: "kill ʿām w inti bkhēr ya dīma", en: "happy birthday, Dima" },
    reply: REPLY,
    factV: both(
      "It's 2 Ramadan: wish her after iftar. Your birthday wishes for her are waiting on Her birthday.",
      "اليوم ٢ رمضان: هنّها بعد الفطور. تهانيك لها في صفحة عيد ميلادها.",
    ),
  },
  {
    id: "national", look: "green", greg: "09-23",
    name: both("Saudi National Day", "اليوم الوطني السعودي"),
    title: { ar: "يوم وطني سعيد", say: "yōm waṭani saʿīd", en: "Happy National Day" },
    toHer: { ar: "كل عام وانتي بخير يا ديما، ودام عزك يا وطن", say: "kill ʿām w inti bkhēr ya dīma, w dām ʿizzak ya waṭan", en: "Happy National Day, Dima — long may our country be proud" },
    sayToHer: { ar: "كل عام وانتي بخير، ودام عزك يا وطن", say: "kill ʿām w inti bkhēr, w dām ʿizzak ya waṭan", en: "many happy returns — long may our country be proud" },
    reply: REPLY, check: true,
    fact: both(
      "On 23 September 1932 King Abdulaziz united the country as the Kingdom of Saudi Arabia. Today everything is green: flags, green lights on the towers, and fireworks at night.",
      "في ٢٣ سبتمبر ١٩٣٢ وحّد الملك عبدالعزيز البلاد باسم المملكة العربية السعودية. اليوم كل شي أخضر: الأعلام، والأبراج تنوّر أخضر، وبالليل ألعاب نارية.",
    ),
  },
  {
    id: "founding", look: "green", greg: "02-22",
    name: both("Founding Day", "يوم التأسيس"),
    title: { ar: "يوم بدينا", say: "yōm badēna", en: "The day we began" },
    toHer: { ar: "يوم تأسيس سعيد يا ديما", say: "yōm taʾsīs saʿīd ya dīma", en: "Happy Founding Day, Dima" },
    sayToHer: { ar: "يوم تأسيس سعيد", say: "yōm taʾsīs saʿīd", en: "happy Founding Day" },
    check: true,
    fact: both(
      "In 1727 Imam Muhammad bin Saud founded the first Saudi state in Diriyah, near Riyadh. People wear traditional clothes, and old mud-brick Diriyah is lit up.",
      "سنة ١٧٢٧ أسّس الإمام محمد بن سعود الدولة السعودية الأولى في الدرعية جنب الرياض. الناس يلبسون اللبس التقليدي، والدرعية الطين تتنوّر.",
    ),
  },
  {
    id: "ramadan", look: "ramadan", hijri: [9, 1, 3],
    name: both("Ramadan begins", "بداية رمضان"),
    title: { ar: "رمضان كريم", say: "ramaḍān karīm", en: "Ramadan Kareem" },
    toHer: { ar: "رمضان كريم يا ديما", say: "ramaḍān karīm ya dīma", en: "Ramadan Kareem, Dima" },
    sayToHer: { ar: "رمضان كريم", say: "ramaḍān karīm", en: "Ramadan Kareem (a generous Ramadan)" },
    reply: { ar: "الله أكرم", say: "allah akram", en: "God is more generous" },
    fact: both(
      "The month of fasting: from dawn to sunset no food or water. At sunset the family breaks the fast together — dates and coffee first — and the evenings are long and lively.",
      "شهر الصيام: من الفجر للمغرب بدون أكل ولا موية. على المغرب العايلة تفطر مع بعض — تمر وقهوة أول — والليل طويل ووناسة.",
    ),
  },
  {
    id: "fitr", look: "eid", hijri: [10, 1, 3],
    name: both("Eid al-Fitr", "عيد الفطر"),
    title: { ar: "عيدك مبارك", say: "ʿīdik mbārak", en: "Eid Mubarak" },
    titleV: { ar: "عيدك مبارك", say: "ʿīdak mbārak", en: "Eid Mubarak" },
    toHer: { ar: "كل عام وانتي بخير يا ديما", say: "kill ʿām w inti bkhēr ya dīma", en: "Many happy returns, Dima" },
    sayToHer: { ar: "عيدك مبارك، كل عام وانتي بخير", say: "ʿīdik mbārak, kill ʿām w inti bkhēr", en: "Eid Mubarak, many happy returns (to her)" },
    reply: REPLY,
    fact: both(
      "The feast at the end of Ramadan: the Eid prayer in the morning, new clothes, visits to family, eidiyya money for the children, and sweets and coffee in every house.",
      "العيد بعد رمضان: صلاة العيد الصبح، لبس جديد، زيارة الأهل، العيدية للعيال، والحلا والقهوة في كل بيت.",
    ),
  },
  {
    id: "arafah", look: "calm", hijri: [12, 9, 1],
    name: both("Day of Arafah", "يوم عرفة"),
    title: { ar: "يوم عرفة", say: "yōm ʿarafa", en: "The Day of Arafah" },
    toHer: { ar: "بكرة العيد يا ديما", say: "bukra l-ʿīd ya dīma", en: "Tomorrow is Eid, Dima" },
    sayToHer: { ar: "بكرة العيد", say: "bukra l-ʿīd", en: "tomorrow is Eid" },
    check: true,
    fact: both(
      "The pilgrims stand on Mount Arafat near Mecca — the heart of Hajj. Many people fast today; tomorrow is Eid al-Adha.",
      "الحجاج يوقفون على جبل عرفة جنب مكة، وهو أهم يوم في الحج. ناس كثير صايمين اليوم، وبكرة عيد الأضحى.",
    ),
  },
  {
    id: "adha", look: "eid", hijri: [12, 10, 4],
    name: both("Eid al-Adha", "عيد الأضحى"),
    title: { ar: "عيدك مبارك", say: "ʿīdik mbārak", en: "Eid Mubarak" },
    titleV: { ar: "عيدك مبارك", say: "ʿīdak mbārak", en: "Eid Mubarak" },
    toHer: { ar: "كل عام وانتي بخير يا ديما", say: "kill ʿām w inti bkhēr ya dīma", en: "Many happy returns, Dima" },
    sayToHer: { ar: "عيدك مبارك، كل عام وانتي بخير", say: "ʿīdik mbārak, kill ʿām w inti bkhēr", en: "Eid Mubarak, many happy returns (to her)" },
    reply: REPLY,
    fact: both(
      "The feast of the sacrifice, at the end of Hajj: families sacrifice a sheep and share the meat with relatives and people in need — four days of visits.",
      "عيد الحج: الناس يذبحون الأضاحي ويوزعون اللحم على الأهل والمحتاجين، وأربع أيام زيارات.",
    ),
  },
  {
    id: "newyear", look: "calm", hijri: [1, 1, 1],
    name: both("Islamic New Year", "رأس السنة الهجرية"),
    title: { ar: "سنة هجرية جديدة", say: "sana hijriyya jdīda", en: "A new Hijri year" },
    toHer: { ar: "كل عام وانتي بخير يا ديما", say: "kill ʿām w inti bkhēr ya dīma", en: "Many happy returns, Dima" },
    sayToHer: KULL_AM,
    reply: REPLY,
    fact: both(
      "1 Muharram begins the Islamic year, counted from the Prophet's journey from Mecca to Medina in 622. Saudi Arabia lives by this calendar: the Hijri date is on every official paper.",
      "أول محرّم بداية السنة الهجرية، من هجرة النبي ﷺ من مكة للمدينة سنة ٦٢٢. والسعودية تمشي على هالتقويم: التاريخ الهجري على كل ورقة رسمية.",
    ),
  },
];

// Day 1 of each Hijri occasion by the Umm al-Qura calendar (the one Saudi Arabia uses), written out so the iPad never
// has to work it out — and so a date can be corrected here by hand if the moon is sighted a day earlier or later
// than the calendar says. tests/holidays.test.mjs checks every date against the calendar.
export const HIJRI_DATES = {
  ramadan: ["2027-02-08", "2028-01-28", "2029-01-16", "2030-01-05", "2030-12-26", "2031-12-16", "2032-12-04"],
  fitr: ["2027-03-09", "2028-02-26", "2029-02-14", "2030-02-04", "2031-01-24", "2032-01-14", "2033-01-03"],
  arafah: ["2027-05-15", "2028-05-04", "2029-04-23", "2030-04-12", "2031-04-01", "2032-03-21", "2033-03-11"],
  adha: ["2027-05-16", "2028-05-05", "2029-04-24", "2030-04-13", "2031-04-02", "2032-03-22", "2033-03-12"],
  newyear: ["2027-06-06", "2028-05-25", "2029-05-14", "2030-05-04", "2031-04-23", "2032-04-11"],
};
export const HIJRI_DATES_UNTIL = "2033-03-01"; // after this, the browser's own Umm al-Qura calendar is asked

const plus = (key, n) => new Date(Date.parse(`${key}T12:00:00Z`) + n * 864e5).toISOString().slice(0, 10);

// Month and day by the browser's Umm al-Qura calendar — or null if this browser doesn't have it (never a wrong guess).
function hijriOf(key) {
  try {
    if (new Intl.DateTimeFormat("en-u-ca-islamic-umalqura").resolvedOptions().calendar !== "islamic-umalqura") return null;
    return hijriParts(new Date(`${key}T12:00:00Z`));
  } catch {
    return null;
  }
}

// The special day on a Saudi date ("YYYY-MM-DD"), or null. Her birthday comes first (it falls in Ramadan in 2027).
export function holidayOn(key) {
  const listed = key < HIJRI_DATES_UNTIL;
  const h = listed ? null : hijriOf(key);
  return HOLIDAYS.find(o => {
    if (o.greg) return key.slice(5) === o.greg;
    if (listed) return HIJRI_DATES[o.id].some(d => key >= d && key < plus(d, o.hijri[2]));
    return h !== null && h.month === o.hijri[0] && h.day >= o.hijri[1] && h.day < o.hijri[1] + o.hijri[2];
  }) ?? null;
}
