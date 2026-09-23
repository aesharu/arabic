// Her birthday, 9 February 2027 — Volodymyr's goal (views/birthday.js; only in his profile, it's a surprise).
// Every text in both languages. The "I can…" goals are ticked in his progress (store goals.done, synced).
export const BIRTHDAY = "2027-02-09"; // 2 Ramadan 1448 by the Umm al-Qura calendar
export const A1_BY = "2026-12-21"; // three months after Day 1

// "I can…" — first the A1 goals (a simple conversation), then the A2 goals (talking to her about his life).
// link = where on the site to practise it.
export const GOALS = [
  { level: "a1", id: "greet", link: "#/phrases", en: "I can greet her, ask how she is and answer", najdi: "أقدر أسلّم عليها وأسألها عن حالها وأرد" },
  { level: "a1", id: "me", link: "#/lessons", en: "I can tell her about myself: my name, country, age and work", najdi: "أقدر أعرّفها بنفسي: اسمي وبلدي وعمري وشغلي" },
  { level: "a1", id: "ask", link: "#/love", en: "I can ask and answer: what are you doing, where are you, have you eaten, did you sleep well", najdi: "أقدر أسأل وأجاوب: وش تسوين، وينك، أكلتي، نمتي زين" },
  { level: "a1", id: "count", link: "#/numbers", en: "I can count to 100, say the days of the week and tell the time", najdi: "أقدر أعد لين ١٠٠ وأقول أيام الأسبوع والساعة" },
  { level: "a1", id: "like", link: "#/grammar", en: "I can say what I like and what I don't", najdi: "أقدر أقول وش أحب ووش ما أحب" },
  { level: "a1", id: "want", link: "#/grammar/6", en: "I can say what I want and what I'm going to do", najdi: "أقدر أقول وش أبي ووش بسوي" },
  { level: "a1", id: "repair", link: "#/cards", en: "I can say I don't understand, ask her to repeat and ask “how do I say…?”", najdi: "أقدر أقول ما فهمت، وأطلب منها تعيد، وأسأل «كيف أقول…؟»" },
  { level: "a1", id: "love20", link: "#/love", en: "I know 20 love phrases by heart", najdi: "أحفظ ٢٠ عبارة حب" },
  { level: "a1", id: "read", link: "#/reading", en: "I can read any word slowly", najdi: "أقدر أقرا أي كلمة على مهلي" },
  { level: "a1", id: "voice", link: "#/today", en: "I can send her a one-minute voice note in Arabic about my day", najdi: "أقدر أرسل لها فويس دقيقة بالعربي عن يومي" },

  { level: "a2", id: "past", link: "#/grammar/5", en: "I can tell her what I did yesterday and at the weekend", najdi: "أقدر أقول لها وش سويت أمس وبالويكند" },
  { level: "a2", id: "plans", link: "#/grammar/6", en: "I can talk about plans: tomorrow, next week, God willing", najdi: "أقدر أتكلم عن خططي: بكرة والأسبوع الجاي إن شاء الله" },
  { level: "a2", id: "family", link: "#/lessons", en: "I can describe my family, my home and my city", najdi: "أقدر أوصف أهلي وبيتي ومدينتي" },
  { level: "a2", id: "food", link: "#/lessons", en: "I can talk about food and drinks, and order at a café", najdi: "أقدر أتكلم عن الأكل والشرب وأطلب بالكوفي" },
  { level: "a2", id: "feel", link: "#/lessons", en: "I can say how I feel and ask how she feels", najdi: "أقدر أقول وش أحس فيه وأسألها وش تحس" },
  { level: "a2", id: "listen", link: "#/today", en: "I understand her slow voice notes about everyday things", najdi: "أفهم فويساتها لا تكلمت على مهلها عن أشياء كل يوم" },
  { level: "a2", id: "call", link: "#/love", en: "I can hold a ten-minute call with her, mostly in Arabic", najdi: "أقدر أكلمها عشر دقايق وأغلب الكلام بالعربي" },
  { level: "a2", id: "dates", link: "#/numbers", en: "I can say dates, months, prices and numbers up to 1,000", najdi: "أقدر أقول التواريخ والشهور والأسعار والأرقام لين ألف" },
  { level: "a2", id: "family2", link: "#/love", en: "I can greet her family politely and know the coffee manners", najdi: "أقدر أسلّم على أهلها بأدب وأعرف سنع القهوة" },
  { level: "a2", id: "speech", link: "#/birthday", en: "I can say my birthday wishes to her by heart", najdi: "أحفظ كلام عيد ميلادها وأقوله من قلبي" },
];

// What to say to her on the day — learn it line by line. check = not verified by a native speaker yet.
export const SPEECH = [
  { ar: "كل عام وانتي بخير يا حبيبتي", say: "kill ʿām w inti bkhēr ya ḥabībti", en: "Happy birthday, my love (lit. “may every year find you well”)", check: true },
  { ar: "عيد ميلاد سعيد", say: "ʿīd mīlād saʿīd", en: "happy birthday", check: true },
  { ar: "اليوم يومك", say: "al-yōm yōmik", en: "today is your day", check: true },
  { ar: "أبي أقول لك شي بالعربي", say: "abi agūl lik shay bil-ʿarabi", en: "I want to tell you something in Arabic", check: true },
  { ar: "من يوم عرفتك وحياتي صارت أحلى", say: "min yōm ʿiraftik w ḥayāti ṣārat aḥla", en: "since the day I met you, my life has been more beautiful", check: true },
  { ar: "تعلمت العربي عشانك، عشان أكلمك بلهجتك", say: "tʿallamt al-ʿarabi ʿashānik, ʿashān akallimik b-lahjatik", en: "I learned Arabic for you, so I can talk to you in your dialect", check: true },
  { ar: "انتي أذكى وأحلى بنت بالدنيا", say: "inti adhka w aḥla bint bid-dinya", en: "you're the smartest and most beautiful girl in the world", check: true },
  { ar: "شكرًا إنك صبرتي علي وعلمتيني", say: "shukran innik ṣbarti ʿalayy w ʿallamtīni", en: "thank you for being patient with me and teaching me", check: true },
  { ar: "أتمنى لك سنة كلها فرح وصحة", say: "atmanna lik sana killaha faraḥ w ṣiḥḥa", en: "I wish you a year full of joy and health", check: true },
  { ar: "وعسى كل أيامك سعيدة وأنا معك", say: "w ʿasa kill ayyāmik saʿīda w ana maʿik", en: "and may all your days be happy, with me by your side", check: true },
  { ar: "أحبك، وأحبك أكثر كل سنة", say: "aḥibbik, w aḥibbik akthar kill sana", en: "I love you, and I love you more every year", check: true },
  { ar: "رمضان كريم", say: "ramaḍān karīm", en: "and Ramadan Kareem" },
];
