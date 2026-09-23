// "From the north" / "Saudi life" cards at the bottom of the pages (views/culture.js): short true stories about her
// world, each with a picture (a scene from core/scenes.js) and one word to hear. Every text in both languages.
// pages: the routes the card shows on (Today shows them all, one a day). word: [Najdi, pronunciation, English, Ukrainian];
// the words aren't from the plan, so they show "check with tutor".
const T = (en, najdi) => ({ en, najdi });

export const CULTURE = [
  { id: "tent", kind: "north", pic: "tent", pages: ["stories"],
    title: T("The goat-hair tent", "بيت الشعر"),
    text: T(
      "Bedouin families in the north still pitch بيت الشعر in winter and spring — a long black tent woven from goat hair. When it rains, the hair swells and the weave closes, so the water stays out. Inside, a woven curtain divides it: one side is the men's majlis, the other the family's.",
      "أهل البر في الشمال للحين ينصبون بيت الشعر بالشتا والربيع — خيمة طويلة سودا منسوجة من شعر الماعز. إذا جا المطر ينتفخ الشعر ويتسكر النسيج، فما تدخل الموية. وداخله مقسوم بستارة منسوجة: جهة مجلس للرجال، وجهة للعايلة."),
    word: ["بيت الشعر", "bēt ash-shaʿar", "goat-hair tent"] },
  { id: "sawalif", kind: "north", pic: "coffee", pages: ["stories", "chats", "reading"],
    title: T("Sawalif by the fire", "السوالف حول النار"),
    text: T(
      "On winter nights in the north, people sit around the fire with coffee and tell سوالف — stories, news and jokes. The old people's سوالف about the desert, the rains and long journeys are how history was passed on. Tell her a سالفة about your day: that's how Saudis talk.",
      "بليالي الشتا في الشمال يجلسون الناس حول النار مع القهوة ويسولفون: قصص وعلوم وضحك. وسوالف الشياب عن البر والمطر والسفر الطويل هي اللي حفظت التاريخ. سولف لها سالفة عن يومك — كذا يسولفون السعوديين."),
    word: ["سالفة", "sālfa", "a story, a chat, something to talk about"] },
  { id: "sadu", kind: "north", pic: "sadu", pages: ["cards"],
    title: T("Al Sadu weaving", "السدو"),
    text: T(
      "Sadu is the weaving of Bedouin women: wool from sheep, camel hair and goat hair, spun by hand and woven on a loom on the ground into red, black and white bands of patterns, each with its own name. The stripe at the top of this card is Sadu. Since 2020 it has been on UNESCO's list of intangible heritage, for Saudi Arabia and Kuwait.",
      "السدو نسيج الحريم البدويات: صوف الغنم ووبر الإبل وشعر الماعز، يغزلونه بيدهم وينسجونه على نول بالأرض، خطوط حمرا وسودا وبيضا وكل نقشة لها اسم. والخط اللي فوق هالكرت هو السدو. ومن ٢٠٢٠ السدو في قايمة اليونسكو للتراث، للسعودية والكويت."),
    word: ["السدو", "as-sadu", "Sadu weaving"] },
  { id: "falconry", kind: "saudi", pic: "falcon", pages: ["practice"],
    title: T("Falconry", "الصقارة"),
    text: T(
      "Arabs have hunted with falcons for thousands of years. A trained falcon wears a leather hood, برقع, to stay calm, and sits on its owner's gloved hand. Falconry is on UNESCO's list of living heritage — Saudi Arabia is one of the countries that share it — and in the north, winter is the season for the مقناص, the hunting trip.",
      "العرب يصيدون بالصقور من آلاف السنين. الصقر المدرّب يلبس برقع من جلد عشان يهدا، ويقعد على يد صاحبه اللي لابس الدس. والصقارة في قايمة اليونسكو للتراث الحي، والسعودية من الدول اللي تشاركت فيها. وفي الشمال الشتا موسم المقناص."),
    word: ["المقناص", "al-magnāṣ", "a hunting trip in the desert"] },
  { id: "camels", kind: "north", pic: "camels", pages: ["verbs"],
    title: T("Camels in the north", "الإبل في الشمال"),
    text: T(
      "For desert families, camels were everything: milk, meat, hair for tents, and the only way across the sand. They still matter: herds graze the northern desert, and at the King Abdulaziz Camel Festival the most beautiful camels win prizes worth millions of riyals. Arabic even has a different word for a camel at each age.",
      "الإبل كانت كل شي لأهل البر: حليب ولحم ووبر لبيوت الشعر، وهي اللي تقطع الرمل. وللحين لها شان: ترعى بالبر في الشمال، وفي مهرجان الملك عبدالعزيز للإبل الأزين منها تاخذ جوايز بالملايين. وحتى كل عمر للبعير له اسم بالعربي."),
    word: ["ناقة", "nāga", "a she-camel"] },
  { id: "souq", kind: "saudi", pic: "souq", pages: ["numbers"],
    title: T("Prices at the souq", "الأسعار في السوق"),
    text: T(
      "A riyal is 100 halalas, and prices are said like any number: خمسة وعشرين ريال. At the souq — dates, spices, clothes — people ask بكم؟ and bargain a little, smiling: عطني سعرك الأخير, “give me your last price”. In malls and supermarkets the price is fixed.",
      "الريال مية هللة، والأسعار تنقال مثل أي رقم: خمسة وعشرين ريال. وبالسوق — تمر وبهارات ولبس — يسألون: بكم؟ ويكاسرون شوي وهم يضحكون: عطني سعرك الأخير. وبالمولات والسوبرماركت السعر ثابت."),
    word: ["بكم؟", "b-kam?", "how much?"] },
  { id: "hijri", kind: "saudi", pic: "crescent", pages: ["calendar", "birthday"],
    title: T("The moon calendar", "التقويم الهجري"),
    text: T(
      "Saudi Arabia counts time in two calendars. The Hijri one follows the moon: each month begins with the new crescent, الهلال, so Ramadan and the two Eids come about 11 days earlier every year. Official dates follow the Umm al-Qura calendar, and the start of Ramadan is announced once the crescent has been seen.",
      "السعودية تحسب الوقت بتقويمين. الهجري يمشي مع القمر: كل شهر يبدا مع الهلال، عشان كذا رمضان والعيدين يجون قبل بحوالي ١١ يوم كل سنة. والتواريخ الرسمية على تقويم أم القرى، وبداية رمضان تنعلن إذا شافوا الهلال."),
    word: ["الهلال", "al-hilāl", "the new crescent moon"] },
  { id: "rawdha", kind: "north", pic: "spring", pages: ["progress"],
    title: T("When the desert turns green", "لا اخضر البر"),
    text: T(
      "After good winter rains the northern desert changes: grass and small flowers cover the روضة — the low meadows where rainwater gathers. Families drive out for كشتة, sheep and camels graze, and people search for فقع, desert truffles. A green spring is news everyone talks about.",
      "إذا جا مطر زين بالشتا يتغيّر البر في الشمال: العشب والزهر يغطي الروضة — المنخفض اللي تتجمع فيه موية المطر. العوايل يطلعون يكشتون، والغنم والإبل ترعى، والناس يدورون الفقع. والربيع الأخضر سالفة الكل يتكلم عنها."),
    word: ["روضة", "rōẓa", "a green desert meadow"] },
  { id: "dates", kind: "saudi", pic: "palms", pages: ["words"],
    title: T("Dates with everything", "التمر"),
    text: T(
      "Saudi Arabia grows hundreds of kinds of dates — sukkari, khalas, saqi, ajwa and many more. Dates come with every coffee, break the fast in Ramadan, and make a welcome gift. Qassim, in the heart of Najd, holds one of the biggest date festivals in the world at harvest time.",
      "بالسعودية مئات الأنواع من التمر — السكري والخلاص والصقعي والعجوة وغيرها. التمر يجي مع كل قهوة، ونفطر عليه برمضان، وهدية الكل يحبها. وفي القصيم، بقلب نجد، واحد من أكبر مهرجانات التمور بالعالم وقت الصرام."),
    word: ["التمر", "at-tamr", "dates"] },
  { id: "truffles", kind: "north", pic: "spring", pages: ["words"],
    title: T("Desert truffles", "الفقع"),
    text: T(
      "In a good year, فقع — desert truffles — grow under the sand after the autumn rains, and people dig them up in late winter and spring. The north is famous for them: truffle markets in the northern towns fill up, and a kilo of the best white زبيدي can cost hundreds of riyals.",
      "إذا كانت السنة زينة يطلع الفقع تحت الرمل بعد أمطار الوسم، ويدورونه الناس آخر الشتا وبالربيع. والشمال مشهور فيه: أسواق الفقع بمدن الشمال تمتلي، وكيلو الزبيدي الأبيض الزين يوصل مئات الريالات."),
    word: ["الفقع", "al-fagʿ", "desert truffles"] },
  { id: "mudhouse", kind: "north", pic: "mudhouse", pages: ["grammar", "lessons"],
    title: T("Houses of mud", "بيوت الطين"),
    text: T(
      "Old Najdi houses were built from mud bricks and palm trunks. Thick walls keep the rooms cool in summer and warm in winter; small triangular openings let the air in; and the zigzag crenellations along the roof — the pattern under every page title here — are their signature. You'll see the same shapes on new buildings in Riyadh today.",
      "بيوت نجد القديمة من اللبن وجذوع النخل. الجدران العريضة تخلي الغرف باردة بالصيف ودافية بالشتا، والفتحات الصغيرة المثلثة تدخّل الهوا، والشرفات المسننة فوق السطح — النقش اللي تحت عنوان كل صفحة هنا — هي علامتها. وللحين تشوف نفس الأشكال بمباني الرياض الجديدة."),
    word: ["طين", "ṭīn", "mud, clay"] },
  { id: "majlis", kind: "saudi", pic: "majlis", pages: ["chats", "record"],
    title: T("The majlis", "المجلس"),
    text: T(
      "Every Saudi home has a majlis: a room with cushions along the walls where guests sit. When a guest arrives, the host stands to greet them and coffee comes at once. Men and women usually have separate majlises. It's where news is shared, problems are solved and friendships are kept.",
      "كل بيت سعودي فيه مجلس: غرفة فيها مساند على الجدران ويجلسون فيها الضيوف. إذا جا ضيف يقوم له صاحب البيت ويسلم عليه، والقهوة تجي على طول. وغالبًا مجلس للرجال ومجلس للحريم. وفيه تنقال العلوم، وتنحل المشاكل، وتنحفظ العلاقات."),
    word: ["المجلس", "al-majlis", "the majlis, the sitting room for guests"] },
  { id: "coffee", kind: "saudi", pic: "coffee", pages: ["me"],
    title: T("Saudi coffee", "القهوة السعودية"),
    text: T(
      "Saudi coffee is light and golden, made with cardamom — sometimes saffron or cloves — and poured from the دلة into small cups. The host pours with the left hand and offers the cup with the right, starting with the eldest or most honored guest. Saudi Arabia named 2022 the Year of Saudi Coffee.",
      "القهوة السعودية شقرا، بالهيل — وأحيانًا بالزعفران أو القرنفل — وتنصب من الدلة بفناجيل صغار. المعزّب يصب بيده اليسار ويعطي الفنجال باليمين، ويبدا بالكبير أو بالضيف المقدّر. والسعودية سمّت ٢٠٢٢ عام القهوة السعودية."),
    word: ["الدلة", "ad-dalla", "the coffee pot"] },
  { id: "meeting", kind: "saudi", pic: "majlis", pages: ["me", "phrases"],
    title: T("Meeting people", "التعارف والسلام"),
    text: T(
      "Saudi greetings take their time: after سلام come شلونك, شخبارك and شلون أهلك — and everyone answers الحمد لله. Men shake hands; close friends and relatives may touch noses. With a woman, wait: shake hands only if she offers hers.",
      "السلام عند السعوديين ياخذ وقته: بعد سلام يجي شلونك وشخبارك وشلون أهلك — والكل يرد: الحمد لله. الرجال يسلمون باليد، والربع والأقارب ممكن يسلمون بالخشوم. ومع الحرمة لا تستعجل: لا تمد يدك إلا إذا مدت يدها."),
    word: ["تشرفنا", "tsharrafna", "nice to meet you (lit. we're honored)"] },
  { id: "incense", kind: "saudi", pic: "majlis", pages: ["phrases"],
    title: T("Oud and bakhoor", "العود والبخور"),
    text: T(
      "Saudi homes smell of oud — fragrant agarwood burned on coals in a مبخرة. It's passed around after a meal, and guests waft the smoke into their clothes and hair. The saying بعد العود ما فيه قعود means “after the oud, no more sitting”: the visit is over.",
      "ريحة البيوت السعودية عود — خشب ريحته حلوة يحطونه على الجمر بالمبخرة. يدورونها بعد الأكل، والضيوف يبخرون لبسهم وشعرهم. والمثل يقول: بعد العود ما فيه قعود — يعني الزيارة خلصت."),
    word: ["المبخرة", "al-mabkhara", "the incense burner"] },
  { id: "roses", kind: "saudi", pic: "roses", pages: ["love"],
    title: T("Taif roses", "الورد الطايفي"),
    text: T(
      "Every spring the mountain city of Taif blooms with pink roses. They're picked at dawn and distilled into rose water and precious rose oil — it takes thousands of flowers for a few grams. Rose water flavors sweets and coffee, and a bottle of Taif rose oil is a much-loved gift.",
      "كل ربيع تتزين الطايف، مدينة الجبال، بالورد الوردي. يقطفونه مع الفجر ويقطرونه ماي ورد ودهن ورد غالي — آلاف الوردات عشان كم غرام. وماي الورد يحطونه بالحلا والقهوة، وقارورة دهن الورد الطايفي هدية ما أحلاها."),
    word: ["الورد", "al-ward", "roses"] },
  { id: "nabati", kind: "north", pic: "tent", pages: ["love"],
    title: T("Nabati poetry", "الشعر النبطي"),
    text: T(
      "Nabati poetry is poetry in the spoken dialect, not formal Arabic — and in Najd and the north it's loved everywhere. Poets recite love, pride and longing at weddings, on TV and in the majlis, and many famous ones come from the northern tribes. One well-said line, بيت, can win a heart.",
      "الشعر النبطي شعر باللهجة مو بالفصحى — وبنجد والشمال الكل يحبه. الشعار يقولون قصايد بالحب والفخر والشوق بالأعراس وبالتلفزيون وبالمجالس، وكثير من المشاهير منهم من قبايل الشمال. وبيت واحد زين يملك القلب."),
    word: ["قصيدة", "gaṣīda", "a poem"] },
  { id: "ardah", kind: "saudi", pic: "diriyah", pages: ["saudi", "plan"],
    title: T("Al-Ardah", "العرضة النجدية"),
    text: T(
      "Al-Ardah Al-Najdiyah is Najd's traditional dance: two rows of men with swords, drums in the middle and a poet chanting verses. It's performed at national celebrations and weddings, and the King often joins in. UNESCO added it to its heritage list in 2015.",
      "العرضة النجدية رقصة نجد: صفين رجال معهم سيوف، والطبول بالنص، وشاعر يقول القصيد. يعرضونها بالأعياد الوطنية والأعراس، والملك كثير يعرض معهم. واليونسكو حطتها بقايمة التراث سنة ٢٠١٥."),
    word: ["العرضة", "al-ʿarẓa", "the sword dance"] },
  { id: "callig", kind: "saudi", pic: "qalam", pages: ["letters", "vowels", "quiz"],
    title: T("Arabic calligraphy", "الخط العربي"),
    text: T(
      "Arabic can be written in many styles: Naskh — the one you're learning, and the one on this site — Thuluth on mosques, Diwani with its curls. Calligraphers cut a reed pen, القلم, at an angle to make thick and thin strokes. Saudi Arabia named 2020–2021 the Year of Arabic Calligraphy.",
      "الخط العربي له أنواع كثير: النسخ — اللي تتعلمه، واللي بهالموقع — والثلث على المساجد، والديواني بلفاته. والخطاطين يبرون القلم من القصب على ميل عشان يطلع الخط عريض ورقيق. والسعودية سمّت ٢٠٢٠–٢٠٢١ عام الخط العربي."),
    word: ["القلم", "al-galam", "the pen"] },
  { id: "hafar", kind: "north", pic: "well", pages: ["path"],
    title: T("Hafar al-Batin", "حفر الباطن"),
    text: T(
      "Her city lies in Wadi al-Batin, a long, wide valley that runs from the Saudi desert toward Kuwait. Its name means “the wells dug in al-Batin”: for centuries travellers and herders stopped here for water. Today it's a busy city of the north-east, close to the borders of Kuwait and Iraq.",
      "مدينتها بوادي الباطن، وادي طويل وعريض يمشي من البر السعودي لين الكويت. واسمها معناه الحفر — الآبار — اللي انحفرت بالباطن: من قرون والمسافرين والبدو يوقفون فيها عشان الموية. واليوم مدينة كبيرة في شمال شرق السعودية، قريبة من حدود الكويت والعراق."),
    word: ["وادي", "wādi", "a valley, a wadi"] },
  { id: "nafud", kind: "north", pic: "nafud", pages: ["path"],
    title: T("The Nafud", "النفود"),
    text: T(
      "The Great Nafud is a sea of red-orange sand dunes in the north, between Al-Jouf and Hail. The wind shapes the dunes, and some are tens of meters high. In spring, after rain, even the Nafud turns green for a few weeks.",
      "النفود الكبير بحر كثبان رملية حمرا في الشمال، بين الجوف وحائل. الهوا هو اللي يشكل الطعوس، وبعضها عشرات الأمتار. وبالربيع، بعد المطر، حتى النفود يخضر كم أسبوع."),
    word: ["طعس", "ṭaʿs", "a sand dune"] },
  { id: "kashta", kind: "north", pic: "tent", pages: ["path", "today"],
    title: T("Kashta", "الكشتة"),
    text: T(
      "When the weather cools, Saudis go on كشتة: a day or a night out in the desert. They drive out with a tent, rugs, firewood, a dallah and a teapot, light a fire and sit under the stars. In the north, kashta season runs through winter and spring.",
      "إذا برد الجو السعوديين يطلعون كشتة: يوم أو ليلة بالبر. ياخذون خيمة وزوالي وحطب ودلة وبراد، ويشبون النار ويجلسون تحت النجوم. وبالشمال موسم الكشتات الشتا والربيع كله."),
    word: ["كشتة", "kashta", "a trip out to the desert"] },
  { id: "rababa", kind: "north", pic: "rababa", pages: ["record"],
    title: T("The rababa", "الربابة"),
    text: T(
      "The rababa is the desert's own instrument: a small square box covered with skin, one string of horsehair and a bow. On winter nights in the north, a poet plays it and sings Nabati poems while everyone around the fire listens. Its voice is simple and a little sad — like one person talking to you.",
      "الربابة آلة البر: صندوق صغير مربّع مغطّى بجلد، ووتر واحد من شعر الخيل، وقوس. بليالي الشتا في الشمال يعزف عليها الشاعر ويغنّي قصيد نبطي، واللي حول النار كلهم يسمعون. صوتها بسيط وفيه حزن — كأنه واحد يسولف معك."),
    word: ["ربابة", "rabāba", "rababa, a one-string fiddle"] },
  { id: "doors", kind: "north", pic: "door", pages: ["review"],
    title: T("Painted Najdi doors", "الأبواب النجدية"),
    text: T(
      "Old mud houses in Najd have plain walls, but their doors are works of art: tamarisk wood painted with triangles, stripes and diamonds in red, yellow, green and blue. Many big doors have a small door cut into them, the خوخة, for every day; the whole door opened only for guests and big loads.",
      "بيوت الطين القديمة بنجد جدرانها سادة، بس أبوابها تحف: خشب أثل منقوش بمثلثات وخطوط ومعينات، حمر وصفر وخضر وزرق. وأغلب الأبواب الكبيرة فيها باب صغير اسمه الخوخة للدخلة والطلعة كل يوم، والباب الكبير كله ما ينفتح إلا للضيوف والأغراض الكبيرة."),
    word: ["خوخة", "khōkha", "a small door cut into a big one"] },
];
