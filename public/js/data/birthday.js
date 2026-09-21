// Her birthday, 9 February 2027 — Volodymyr's goal (views/birthday.js; only in his profile, it's a surprise).
// Every text in four languages. The "I can…" goals are ticked in his progress (store goals.done, synced).
export const BIRTHDAY = "2027-02-09"; // 2 Ramadan 1448 by the Umm al-Qura calendar
export const A1_BY = "2026-12-21"; // three months after Day 1

// "I can…" — first the A1 goals (a simple conversation), then the A2 goals (talking to her about his life).
// link = where on the site to practise it.
export const GOALS = [
  { level: "a1", id: "greet", link: "#/phrases", en: "I can greet her, ask how she is and answer", uk: "Я можу привітатися, спитати, як вона, і відповісти", najdi: "أقدر أسلّم عليها وأسألها عن حالها وأرد", msa: "أستطيع أن أحيّيها وأسألها عن حالها وأجيب" },
  { level: "a1", id: "me", link: "#/lessons", en: "I can tell her about myself: my name, country, age and work", uk: "Я можу розповісти про себе: ім'я, країну, вік і роботу", najdi: "أقدر أعرّفها بنفسي: اسمي وبلدي وعمري وشغلي", msa: "أستطيع أن أعرّفها بنفسي: اسمي وبلدي وعمري وعملي" },
  { level: "a1", id: "ask", link: "#/love", en: "I can ask and answer: what are you doing, where are you, have you eaten, did you sleep well", uk: "Я можу спитати й відповісти: що робиш, де ти, чи поїла, чи добре спала", najdi: "أقدر أسأل وأجاوب: وش تسوين، وينك، أكلتي، نمتي زين", msa: "أستطيع أن أسأل وأجيب: ماذا تفعلين، أين أنتِ، هل أكلتِ، هل نمتِ جيدًا" },
  { level: "a1", id: "count", link: "#/numbers", en: "I can count to 100, say the days of the week and tell the time", uk: "Я можу рахувати до 100, називати дні тижня й казати, котра година", najdi: "أقدر أعد لين ١٠٠ وأقول أيام الأسبوع والساعة", msa: "أستطيع العدّ حتى ١٠٠ وذكر أيام الأسبوع وقول الوقت" },
  { level: "a1", id: "like", link: "#/grammar", en: "I can say what I like and what I don't", uk: "Я можу сказати, що мені подобається, а що ні", najdi: "أقدر أقول وش أحب ووش ما أحب", msa: "أستطيع أن أقول ما أحبّه وما لا أحبّه" },
  { level: "a1", id: "want", link: "#/grammar/6", en: "I can say what I want and what I'm going to do", uk: "Я можу сказати, чого хочу і що збираюся робити", najdi: "أقدر أقول وش أبي ووش بسوي", msa: "أستطيع أن أقول ما أريده وما سأفعله" },
  { level: "a1", id: "repair", link: "#/cards", en: "I can say I don't understand, ask her to repeat and ask “how do I say…?”", uk: "Я можу сказати, що не зрозумів, попросити повторити й спитати «як сказати…?»", najdi: "أقدر أقول ما فهمت، وأطلب منها تعيد، وأسأل «كيف أقول…؟»", msa: "أستطيع أن أقول لم أفهم، وأطلب منها الإعادة، وأسأل «كيف أقول…؟»" },
  { level: "a1", id: "love20", link: "#/love", en: "I know 20 love phrases by heart", uk: "Я знаю напам'ять 20 фраз про кохання", najdi: "أحفظ ٢٠ عبارة حب", msa: "أحفظ عشرين عبارة حبّ" },
  { level: "a1", id: "read", link: "#/reading", en: "I can read any word slowly", uk: "Я можу повільно прочитати будь-яке слово", najdi: "أقدر أقرا أي كلمة على مهلي", msa: "أستطيع قراءة أيّ كلمة ببطء" },
  { level: "a1", id: "voice", link: "#/today", en: "I can send her a one-minute voice note in Arabic about my day", uk: "Я можу надіслати їй хвилинне голосове арабською про свій день", najdi: "أقدر أرسل لها فويس دقيقة بالعربي عن يومي", msa: "أستطيع أن أرسل لها رسالة صوتية مدّتها دقيقة بالعربية عن يومي" },

  { level: "a2", id: "past", link: "#/grammar/5", en: "I can tell her what I did yesterday and at the weekend", uk: "Я можу розповісти, що робив учора й на вихідних", najdi: "أقدر أقول لها وش سويت أمس وبالويكند", msa: "أستطيع أن أخبرها بما فعلتُ أمس وفي عطلة نهاية الأسبوع" },
  { level: "a2", id: "plans", link: "#/grammar/6", en: "I can talk about plans: tomorrow, next week, God willing", uk: "Я можу говорити про плани: завтра, наступного тижня, якщо Бог дасть", najdi: "أقدر أتكلم عن خططي: بكرة والأسبوع الجاي إن شاء الله", msa: "أستطيع التحدّث عن خططي: غدًا والأسبوع القادم إن شاء الله" },
  { level: "a2", id: "family", link: "#/lessons", en: "I can describe my family, my home and my city", uk: "Я можу описати свою родину, дім і місто", najdi: "أقدر أوصف أهلي وبيتي ومدينتي", msa: "أستطيع وصف عائلتي وبيتي ومدينتي" },
  { level: "a2", id: "food", link: "#/lessons", en: "I can talk about food and drinks, and order at a café", uk: "Я можу говорити про їжу й напої та замовити в кафе", najdi: "أقدر أتكلم عن الأكل والشرب وأطلب بالكوفي", msa: "أستطيع التحدّث عن الطعام والشراب والطلب في المقهى" },
  { level: "a2", id: "feel", link: "#/lessons", en: "I can say how I feel and ask how she feels", uk: "Я можу сказати, що відчуваю, і спитати, що відчуває вона", najdi: "أقدر أقول وش أحس فيه وأسألها وش تحس", msa: "أستطيع أن أقول ما أشعر به وأسألها عمّا تشعر" },
  { level: "a2", id: "listen", link: "#/today", en: "I understand her slow voice notes about everyday things", uk: "Я розумію її повільні голосові про буденні речі", najdi: "أفهم فويساتها لا تكلمت على مهلها عن أشياء كل يوم", msa: "أفهم رسائلها الصوتية البطيئة عن الأمور اليومية" },
  { level: "a2", id: "call", link: "#/love", en: "I can hold a ten-minute call with her, mostly in Arabic", uk: "Я можу поговорити з нею десять хвилин, здебільшого арабською", najdi: "أقدر أكلمها عشر دقايق وأغلب الكلام بالعربي", msa: "أستطيع أن أكلّمها عشر دقائق معظمها بالعربية" },
  { level: "a2", id: "dates", link: "#/numbers", en: "I can say dates, months, prices and numbers up to 1,000", uk: "Я можу називати дати, місяці, ціни й числа до 1000", najdi: "أقدر أقول التواريخ والشهور والأسعار والأرقام لين ألف", msa: "أستطيع ذكر التواريخ والشهور والأسعار والأعداد حتى الألف" },
  { level: "a2", id: "family2", link: "#/love", en: "I can greet her family politely and know the coffee manners", uk: "Я можу чемно привітатися з її родиною й знаю, як пити каву за звичаєм", najdi: "أقدر أسلّم على أهلها بأدب وأعرف سنع القهوة", msa: "أستطيع أن أحيّي أهلها بأدب وأعرف آداب القهوة" },
  { level: "a2", id: "speech", link: "#/birthday", en: "I can say my birthday wishes to her by heart", uk: "Я можу сказати їй свої побажання на день народження напам'ять", najdi: "أحفظ كلام عيد ميلادها وأقوله من قلبي", msa: "أحفظ تهنئة عيد ميلادها وأقولها عن ظهر قلب" },
];

// What to say to her on the day — learn it line by line. check = not verified by a native speaker yet.
export const SPEECH = [
  { ar: "كل عام وانتي بخير يا حبيبتي", say: "kill ʿām w inti bkhēr ya ḥabībti", en: "Happy birthday, my love (lit. “may every year find you well”)", uk: "З днем народження, кохана (досл. «щоб кожен рік ти була здорова»)", msa: "كلّ عام وأنتِ بخير يا حبيبتي", check: true },
  { ar: "عيد ميلاد سعيد", say: "ʿīd mīlād saʿīd", en: "happy birthday", uk: "з днем народження", msa: "عيد ميلاد سعيد", check: true },
  { ar: "اليوم يومك", say: "al-yōm yōmik", en: "today is your day", uk: "сьогодні твій день", msa: "اليوم يومكِ", check: true },
  { ar: "أبي أقول لك شي بالعربي", say: "abi agūl lik shay bil-ʿarabi", en: "I want to tell you something in Arabic", uk: "я хочу сказати тобі дещо арабською", msa: "أريد أن أقول لكِ شيئًا بالعربية", check: true },
  { ar: "من يوم عرفتك وحياتي صارت أحلى", say: "min yōm ʿiraftik w ḥayāti ṣārat aḥla", en: "since the day I met you, my life has been more beautiful", uk: "відколи я тебе зустрів, моє життя стало кращим", msa: "منذ عرفتُكِ صارت حياتي أجمل", check: true },
  { ar: "تعلمت العربي عشانك، عشان أكلمك بلهجتك", say: "tʿallamt al-ʿarabi ʿashānik, ʿashān akallimik b-lahjatik", en: "I learned Arabic for you, so I can talk to you in your dialect", uk: "я вивчив арабську заради тебе, щоб говорити з тобою твоїм діалектом", msa: "تعلّمتُ العربية من أجلكِ، لكي أكلّمكِ بلهجتكِ", check: true },
  { ar: "انتي أذكى وأحلى بنت بالدنيا", say: "inti adhka w aḥla bint bid-dinya", en: "you're the smartest and most beautiful girl in the world", uk: "ти найрозумніша й найгарніша дівчина на світі", msa: "أنتِ أذكى وأجمل فتاة في الدنيا", check: true },
  { ar: "شكرًا إنك صبرتي علي وعلمتيني", say: "shukran innik ṣbarti ʿalayy w ʿallamtīni", en: "thank you for being patient with me and teaching me", uk: "дякую, що ти була терплячою зі мною й навчала мене", msa: "شكرًا لأنّكِ صبرتِ عليّ وعلّمتِني", check: true },
  { ar: "أتمنى لك سنة كلها فرح وصحة", say: "atmanna lik sana killaha faraḥ w ṣiḥḥa", en: "I wish you a year full of joy and health", uk: "бажаю тобі року, повного радості й здоров'я", msa: "أتمنّى لكِ عامًا كلّه فرح وصحّة", check: true },
  { ar: "وعسى كل أيامك سعيدة وأنا معك", say: "w ʿasa kill ayyāmik saʿīda w ana maʿik", en: "and may all your days be happy, with me by your side", uk: "і нехай усі твої дні будуть щасливими, а я — поруч", msa: "وعسى أن تكون كلّ أيامكِ سعيدة وأنا معكِ", check: true },
  { ar: "أحبك، وأحبك أكثر كل سنة", say: "aḥibbik, w aḥibbik akthar kill sana", en: "I love you, and I love you more every year", uk: "я кохаю тебе і кохаю щороку ще більше", msa: "أحبّكِ، وأحبّكِ أكثر كلّ عام", check: true },
  { ar: "رمضان كريم", say: "ramaḍān karīm", en: "and Ramadan Kareem", uk: "і щедрого Рамадану", msa: "رمضان كريم" },
];
