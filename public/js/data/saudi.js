// Saudi life: culture stories (with a focus on the north), facts, and the year's occasions.
// Words marked `check` are not in NAJDI-PLAN.md and show "check with tutor" until Dima confirms them
// (tests/saudi.test.mjs enforces this). Facts are well-established; anything approximate says so.

const W = (ar, say, en, uk, msa, check = true) => ({ ar, say, en, uk, msa, check });

export const STORIES = [
  {
    id: "ramadan", region: "all",
    title: { en: "Ramadan", uk: "Рамадан", najdi: "رمضان", msa: "شهر رمضان" },
    body: {
      en: "The whole country changes rhythm. People fast from dawn (Fajr) to sunset (Maghrib), then break the fast with dates, water and Arabic coffee before the meal. Nights are long and social: taraweeh prayers, family visits, and suhoor — a last meal before dawn. Streets and malls come alive after iftar.",
      uk: "Уся країна змінює ритм. Люди постять від світанку (Фаджр) до заходу сонця (Магриб), а потім розговляються фініками, водою й арабською кавою перед основною їжею. Ночі довгі й сповнені зустрічей: молитви тараві, гостини в родичів і сухур — остання їжа перед світанком. Після іфтару вулиці й торгові центри оживають.",
      najdi: "البلد كله يتغيّر إيقاعه. الناس يصومون من الفجر لين المغرب، وبعدين يفطرون على تمر وموية وقهوة قبل الأكل. الليل طويل وكله ناس: صلاة التراويح، وزيارات الأهل، والسحور قبل الفجر. وبعد الفطور الشوارع والمولات تحيا.",
      msa: "يتغيّر إيقاع البلاد كلّها. يصوم الناس من الفجر حتى المغرب، ثم يفطرون على التمر والماء والقهوة العربية قبل الطعام. والليالي طويلة عامرة: صلاة التراويح، وزيارات الأهل، والسحور قبل الفجر. وبعد الإفطار تدبّ الحياة في الشوارع والمجمّعات.",
    },
    words: [
      W("رمضان كريم", "ramaḍān karīm", "Ramadan greeting (reply: allah akram)", "привітання з Рамаданом (відповідь: allah akram)", "رمضان كريم", false),
      W("فطور", "fṭūr", "the meal that breaks the fast (also: breakfast)", "їжа після посту (а також сніданок)", "إفطار", false),
      W("سحور", "saḥūr", "the meal before dawn", "їжа перед світанком", "سحور"),
      W("تراويح", "tarāwīḥ", "Ramadan night prayers", "нічні молитви Рамадану", "صلاة التراويح"),
      W("صايم", "ṣāyim", "fasting (a man); ṣāyma — a woman", "той, хто постить (чоловік); ṣāyma — жінка", "صائم"),
    ],
  },
  {
    id: "eid", region: "all",
    title: { en: "Eid", uk: "Ід (свято)", najdi: "العيد", msa: "العيد" },
    body: {
      en: "There are two Eids: Eid al-Fitr at the end of Ramadan, and Eid al-Adha during the Hajj. The day starts with the Eid prayer; then new clothes, visits to the eldest of the family first, coffee, dates and sweets in every house. Children collect ʿīdiyya — Eid money — from their relatives.",
      uk: "Є два Іди: Ід аль-Фітр наприкінці Рамадану та Ід аль-Адха під час хаджу. День починається зі святкової молитви; далі новий одяг, гостини — насамперед у найстарших членів родини, кава, фініки й солодощі в кожному домі. Діти збирають ʿīdiyya — святкові гроші — від родичів.",
      najdi: "فيه عيدين: عيد الفطر بعد رمضان، وعيد الأضحى وقت الحج. اليوم يبدأ بصلاة العيد، وبعدين لبس جديد، وزيارة كبار العايلة أول، وقهوة وتمر وحلا في كل بيت. والعيال يجمعون العيدية من أهلهم.",
      msa: "هناك عيدان: عيد الفطر في نهاية رمضان، وعيد الأضحى في موسم الحج. يبدأ اليوم بصلاة العيد، ثم الثياب الجديدة، وزيارة كبار العائلة أولًا، والقهوة والتمر والحلوى في كل بيت. ويجمع الأطفال العيدية من أقاربهم.",
    },
    words: [
      W("عيدك مبارك", "ʿīdik mbārak", "Eid greeting (to her)", "вітання з Ідом (до неї)", "عيدكِ مبارك", false),
      W("كل عام وانتي بخير", "kill ʿām w inti bkhēr", "Eid / birthday wish (to her)", "побажання на Ід чи день народження (до неї)", "كلّ عام وأنتِ بخير", false),
      W("عيدية", "ʿīdiyya", "Eid money for children", "святкові гроші для дітей", "عيدية"),
      W("صلاة العيد", "ṣalāt al-ʿīd", "the Eid prayer", "святкова молитва", "صلاة العيد"),
    ],
  },
  {
    id: "gahwa", region: "all",
    title: { en: "Arabic coffee (gahwa)", uk: "Арабська кава (гахва)", najdi: "القهوة", msa: "القهوة العربية" },
    body: {
      en: "Saudi coffee is lightly roasted and spiced with cardamom — sometimes saffron or cloves. It's poured from a dallah into a small finjal, only a little at a time, and served with the right hand, with dates. When you've had enough, gently shake the cup side to side before handing it back — otherwise it will be refilled. UNESCO lists Arabic coffee as intangible heritage (2015).",
      uk: "Саудівська кава злегка обсмажена, з кардамоном — інколи з шафраном чи гвоздикою. Її наливають із далли в маленький фінджал, щоразу потроху, і подають правою рукою разом із фініками. Коли досить — злегка похитай чашкою з боку в бік, перш ніж віддати, інакше тобі наллють ще. ЮНЕСКО внесла арабську каву до нематеріальної спадщини (2015).",
      najdi: "القهوة السعودية شقرا ومهيّلة — وأحيانًا فيها زعفران أو قرنفل. تنصب من الدلة في فنجال صغير، شوي شوي، وتتقدّم باليمين مع التمر. وإذا كفّيت، هزّ الفنجال يمين ويسار قبل ما ترجّعه — وإلا بيصبّون لك زود.",
      msa: "القهوة السعودية خفيفة التحميص ومنكّهة بالهيل، وأحيانًا بالزعفران أو القرنفل. تُصَبّ من الدلّة في فنجان صغير قليلًا قليلًا، وتُقدَّم باليد اليمنى مع التمر. وإذا اكتفيت فهُزّ الفنجان يمينًا ويسارًا قبل أن تعيده، وإلا صُبّ لك المزيد. وقد أدرجت اليونسكو القهوة العربية تراثًا غير مادي (٢٠١٥).",
    },
    words: [
      W("قهوة", "gahwa", "coffee — ق said as g", "кава — ق вимовляється як g", "قهوة", false),
      W("دلة", "dalla", "the coffee pot", "кавник", "دلّة"),
      W("فنجال", "finjāl", "the small coffee cup", "маленька чашка для кави", "فنجان"),
      W("هيل", "hēl", "cardamom", "кардамон", "هيل"),
      W("تمر", "tamr", "dates", "фініки", "تمر", false),
    ],
  },
  {
    id: "mud", region: "najd",
    title: { en: "Mud-brick Najd and Diriyah", uk: "Глиняний Неджд і Ед-Дірʼія", najdi: "الطين والدرعية", msa: "العمارة الطينية والدرعية" },
    body: {
      en: "Traditional Najdi houses are built from mud brick with palm-trunk beams: thick walls that keep out the heat, a courtyard inside, triangular vents and crenellations along the roof — like the fort drawn on this site. At-Turaif in Diriyah, the first Saudi capital, is a UNESCO World Heritage Site (2010).",
      uk: "Традиційні будинки Неджду зводили з глиняної цегли з балками зі стовбурів пальм: товсті стіни, що не пускають спеку, внутрішнє подвір'я, трикутні вентиляційні отвори й зубці вздовж даху — як у фортеці, намальованій на цьому сайті. Квартал Ат-Турайф у Ед-Дірʼії, першій саудівській столиці, — об'єкт Світової спадщини ЮНЕСКО (2010).",
      najdi: "البيوت النجدية القديمة مبنية من الطين وسقفها من جذوع النخل: جدران عريضة تصد الحر، وحوش بالنص، وفتحات مثلّثة وشرفات فوق السطح — مثل القصر المرسوم بهالموقع. وحي الطريف بالدرعية، أول عاصمة سعودية، من مواقع التراث العالمي لليونسكو.",
      msa: "بُنيت البيوت النجدية التقليدية من الطين وسُقفت بجذوع النخل: جدران سميكة تصدّ الحرّ، وفناء داخلي، وفتحات مثلّثة وشُرَف على السطح — كالقصر المرسوم في هذا الموقع. وحيّ الطريف في الدرعية، أول عاصمة سعودية، مُدرَج في قائمة التراث العالمي لليونسكو (٢٠١٠).",
    },
    words: [
      W("طين", "ṭīn", "mud (for building)", "глина (для будівництва)", "طين"),
      W("الدرعية", "ad-dirʿiyya", "Diriyah", "Ед-Дірʼія", "الدرعية"),
      W("مجلس", "majlis", "the sitting room for guests", "вітальня для гостей", "مجلس"),
      W("حوش", "ḥōsh", "courtyard", "подвір'я", "فناء"),
    ],
  },
  {
    id: "ardah", region: "najd",
    title: { en: "Al-Ardah — the sword dance", uk: "Аль-Арда — танець із мечами", najdi: "العرضة", msa: "العرضة النجدية" },
    body: {
      en: "Two rows of men with swords move to big drums while a poet chants verses and the rows answer him. It's danced at National Day, Founding Day and weddings — the kings dance it too. UNESCO listed Alardah Alnajdiyah as intangible heritage in 2015.",
      uk: "Два ряди чоловіків із мечами рухаються під великі барабани, поки поет виголошує вірші, а ряди йому відповідають. Її танцюють на Національний день, День заснування та весілля — танцюють і королі. ЮНЕСКО внесла Неджську арду до нематеріальної спадщини у 2015 році.",
      najdi: "صفّين رجال معهم سيوف يتحرّكون على الطبول، والشاعر يقول القصيد والصفوف ترد عليه. تنلعب باليوم الوطني ويوم التأسيس والأعراس — حتى الملوك يلعبونها.",
      msa: "صفّان من الرجال يحملون السيوف ويتحرّكون على قرع الطبول، والشاعر ينشد والصفوف تردّد. تُؤدّى في اليوم الوطني ويوم التأسيس والأعراس، ويؤدّيها الملوك أيضًا. وأدرجتها اليونسكو تراثًا غير مادي عام ٢٠١٥.",
    },
    words: [
      W("عرضة", "ʿarḍa", "the Ardah dance", "танець арда", "العرضة"),
      W("سيف", "sēf", "sword", "меч", "سيف"),
      W("طبول", "ṭubūl", "drums", "барабани", "طبول"),
      W("قصيدة", "gaṣīda", "poem — ق said as g", "вірш — ق вимовляється як g", "قصيدة"),
    ],
  },
  {
    id: "sadu", region: "north",
    title: { en: "Al-Sadu weaving", uk: "Ткацтво ас-саду", najdi: "السدو", msa: "نسيج السدو" },
    body: {
      en: "Bedouin women weave Sadu on a ground loom from sheep, goat and camel wool: bands of red, black and white with geometric patterns, for tents, cushions and camel bags. The zig-zag border under this site's headings is a nod to it. UNESCO listed it in 2020 (Saudi Arabia and Kuwait).",
      uk: "Бедуїнки тчуть саду на наземному верстаті з овечої, козячої та верблюжої вовни: червоні, чорні й білі смуги з геометричними візерунками — для наметів, подушок і в'юків. Зигзаг під заголовками цього сайту — відсилання до нього. ЮНЕСКО внесла саду до списку у 2020 році (Саудівська Аравія та Кувейт).",
      najdi: "نسوان البادية ينسجون السدو على النول بالأرض من صوف الغنم وشعر الماعز ووبر البعارين: خطوط حمر وسود وبيض بنقوش، للخيام والمساند وشداد البعارين. والنقشة المتعرّجة تحت عناوين هالموقع مأخوذة منه.",
      msa: "تنسج نساء البادية السدو على النول الأرضي من صوف الغنم وشعر الماعز ووبر الإبل: أشرطة حمراء وسوداء وبيضاء بزخارف هندسية، للخيام والوسائد وأحمال الإبل. والزخرفة المتعرّجة تحت عناوين هذا الموقع مستوحاة منه. وأدرجته اليونسكو عام ٢٠٢٠ (السعودية والكويت).",
    },
    words: [
      W("سدو", "sadu", "Sadu weaving", "ткацтво саду", "السدو"),
      W("صوف", "ṣūf", "wool", "вовна", "صوف"),
      W("بيت الشعر", "bēt ash-shaʿar", "the black goat-hair tent", "чорний намет із козячої вовни", "بيت الشَّعر"),
    ],
  },
  {
    id: "falcons", region: "all",
    title: { en: "Falcons", uk: "Соколи", najdi: "الصقور", msa: "الصقور" },
    body: {
      en: "Falconry is an old desert art that's still loved: falcons are trained to hunt, flown in races and shown at big winter festivals. A good falcon can cost as much as a car. Falconry is on UNESCO's list of intangible heritage, shared by many countries including Saudi Arabia.",
      uk: "Соколине полювання — давнє мистецтво пустелі, яке досі люблять: соколів вчать полювати, змагаються в польотах і показують на великих зимових фестивалях. Добрий сокіл може коштувати як автомобіль. Соколине полювання внесене до списку нематеріальної спадщини ЮНЕСКО — спільно з багатьма країнами, зокрема Саудівською Аравією.",
      najdi: "الصقارة فن قديم من البر وللحين الناس يحبونه: يدرّبون الصقور على الصيد، ويسابقونها، ويعرضونها بمهرجانات الشتا. والصقر الزين ممكن سعره مثل سيارة.",
      msa: "الصقارة فنّ صحراوي قديم ما زال محبوبًا: تُدرَّب الصقور على الصيد، وتُقام لها السباقات والمهرجانات الشتوية الكبرى. وقد يبلغ ثمن الصقر الجيد ثمن سيارة. والصقارة مُدرَجة في قائمة اليونسكو للتراث غير المادي باشتراك دول عدّة منها السعودية.",
    },
    words: [
      W("صقر", "ṣagr", "falcon — ق said as g", "сокіл — ق вимовляється як g", "صقر"),
      W("مقناص", "magnāṣ", "a hunting trip", "мисливська поїздка", "رحلة صيد"),
    ],
  },
  {
    id: "camels", region: "north",
    title: { en: "Camels", uk: "Верблюди", najdi: "الإبل", msa: "الإبل" },
    body: {
      en: "Camels are family history: milk, races and even beauty contests. The King Abdulaziz Camel Festival, held every winter north of Riyadh, is one of the biggest camel events in the world. In the northern steppe many families still keep herds.",
      uk: "Верблюди — це історія родин: молоко, перегони й навіть конкурси краси. Фестиваль верблюдів імені короля Абдулазіза, що відбувається щозими на північ від Ер-Ріяда, — одна з найбільших верблюжих подій у світі. На північних степах багато родин досі тримають стада.",
      najdi: "البعارين تاريخ العوايل: حليب، وسباق هجن، وحتى مزاين. ومهرجان الملك عبدالعزيز للإبل كل شتا شمال الرياض من أكبر مهرجانات الإبل بالعالم. وبالشمال للحين عوايل كثير عندهم حلال.",
      msa: "الإبل جزء من تاريخ العائلات: الحليب والسباقات وحتى مسابقات الجمال. ومهرجان الملك عبدالعزيز للإبل، الذي يُقام كل شتاء شمال الرياض، من أكبر فعاليات الإبل في العالم. وفي بادية الشمال ما زالت عائلات كثيرة تربّي الإبل.",
    },
    words: [
      W("ناقة", "nāga", "she-camel — ق said as g", "верблюдиця — ق вимовляється як g", "ناقة"),
      W("بعير", "biʿīr", "camel", "верблюд", "بعير"),
      W("هجن", "hjin", "racing camels", "бігові верблюди", "هُجُن"),
      W("مزاين", "mazāyin", "camel beauty contest", "конкурс краси верблюдів", "مسابقة جمال الإبل"),
    ],
  },
  {
    id: "kashta", region: "all",
    title: { en: "Kashta and the desert spring", uk: "Кашта і весна в пустелі", najdi: "الكشتة والربيع", msa: "الكشتة وربيع الصحراء" },
    body: {
      en: "In winter, and after rain, the desert turns green — rabīʿ. Families and friends drive out for a kashta: a trip into the desert with a fire, coffee and grilled food, often late into the night under the stars. It's one of the most loved parts of the Saudi winter.",
      uk: "Узимку й після дощів пустеля зеленіє — це rabīʿ. Родини й друзі виїжджають на кашту: поїздку в пустелю з вогнищем, кавою та їжею на грилі, часто допізна під зорями. Це одна з найулюбленіших частин саудівської зими.",
      najdi: "بالشتا وبعد المطر البر يخضرّ — الربيع. والعوايل والربع يطلعون كشتة: طلعة للبر مع نار وقهوة وشوي، وأحيانًا لين آخر الليل تحت النجوم. من أحلى شي بشتا السعودية.",
      msa: "في الشتاء وبعد المطر تخضرّ الصحراء — وهو الربيع. فتخرج العائلات والأصدقاء في «كشتة»: رحلة إلى البرّ مع النار والقهوة والمشويات، وكثيرًا ما تمتدّ إلى آخر الليل تحت النجوم. وهي من أحبّ ما في الشتاء السعودي.",
    },
    words: [
      W("كشتة", "kashta", "a desert outing", "виїзд на природу в пустелю", "رحلة برّية"),
      W("ربيع", "rabīʿ", "the green desert after rain", "зелена пустеля після дощів", "ربيع"),
      W("البر", "al-barr", "the open desert, the outdoors", "пустеля, природа за містом", "البرّ"),
      W("نار", "nār", "fire", "вогонь", "نار"),
    ],
  },
  {
    id: "truffles", region: "north",
    title: { en: "Desert truffles of the north", uk: "Пустельні трюфелі півночі", najdi: "فقع الشمال", msa: "كمأة الشمال" },
    body: {
      en: "After good winter rains, the northern deserts — around Ha'il, Al-Jouf, Arar and Hafar al-Batin — give fagʿ: desert truffles, dug out of the sand in late winter and spring. They're sold at special markets, can be very expensive in a good year, and are eaten grilled, boiled or cooked with rice.",
      uk: "Після добрих зимових дощів північні пустелі — довкола Хаїля, Ель-Джауфа, Арара й Хафр-ель-Батина — дають fagʿ: пустельні трюфелі, які викопують із піску наприкінці зими й навесні. Їх продають на окремих ринках, у вдалий рік вони бувають дуже дорогі, їх смажать, варять або готують із рисом.",
      najdi: "إذا جا مطر زين بالشتا، براري الشمال — حول حايل والجوف وعرعر وحفر الباطن — يطلع فيها الفقع، يطلعونه من الرمل آخر الشتا وبالربيع. ينباع بأسواق خاصة، وبالسنة الزينة يغلى مرة، وينشوى أو ينطبخ مع الرز.",
      msa: "بعد أمطار الشتاء الجيدة تُخرج صحارى الشمال — حول حائل والجوف وعرعر وحفر الباطن — الفقع، أي الكمأة الصحراوية، فيُستخرج من الرمل في أواخر الشتاء والربيع. ويُباع في أسواق خاصة، وقد يغلو ثمنه كثيرًا، ويؤكل مشويًّا أو مسلوقًا أو مطبوخًا مع الأرز.",
    },
    words: [
      W("فقع", "fagʿ", "desert truffles — ق said as g", "пустельні трюфелі — ق вимовляється як g", "كمأة"),
      W("زبيدي", "zbēdi", "the prized white truffle", "цінний білий трюфель", "الزبيدي (نوع من الكمأة)"),
      W("مطر", "maṭar", "rain", "дощ", "مطر", false),
    ],
  },
  {
    id: "hail", region: "north",
    title: { en: "Ha'il", uk: "Хаїль", najdi: "حايل", msa: "حائل" },
    body: {
      en: "Ha'il sits between two mountain ranges, Aja and Salma, in the north of Najd. It's famous for generosity: the pre-Islamic poet Hatim al-Tai, whose name still means “the most generous”, came from here. Near Ha'il, at Jubbah and Shuwaymis, is some of Arabia's oldest rock art — people, camels and ibex carved thousands of years ago (UNESCO, 2015).",
      uk: "Хаїль лежить між двома гірськими пасмами, Аджа і Сальма, на півночі Неджду. Він славиться щедрістю: доісламський поет Хатім ат-Таї, чиє ім'я досі означає «найщедріший», був звідси. Біля Хаїля, у Джуббі та Шувеймісі, — одне з найдавніших наскельних мистецтв Аравії: люди, верблюди й козероги, вирізьблені тисячі років тому (ЮНЕСКО, 2015).",
      najdi: "حايل بين جبلين، أجا وسلمى، بشمال نجد. معروفة بالكرم: حاتم الطائي، اللي اسمه للحين يعني «أكرم واحد»، منها. وقريب من حايل، بجبة والشويمس، فيه من أقدم النقوش على الصخور بالجزيرة — ناس وبعارين ووعول منقوشة من آلاف السنين.",
      msa: "تقع حائل بين جبلَي أجا وسلمى في شمال نجد. وتشتهر بالكرم، فمنها الشاعر الجاهلي حاتم الطائي الذي ما زال اسمه مضرب المثل في الجود. وقرب حائل، في جبّة والشويمس، من أقدم الفنون الصخرية في الجزيرة العربية: بشر وإبل ووعول نُقشت قبل آلاف السنين (اليونسكو، ٢٠١٥).",
    },
    words: [
      W("كرم", "karam", "generosity", "щедрість", "كرم"),
      W("كريم", "karīm", "generous", "щедрий", "كريم"),
      W("جبل", "jabal", "mountain", "гора", "جبل"),
      W("أجا وسلمى", "aja w salma", "the two mountains of Ha'il", "дві гори Хаїля", "جبلا أجا وسلمى"),
    ],
  },
  {
    id: "jouf", region: "north",
    title: { en: "Al-Jouf", uk: "Ель-Джауф", najdi: "الجوف", msa: "الجوف" },
    body: {
      en: "The far north, around Sakaka and Dumat al-Jandal. Al-Jouf is one of the biggest olive-growing regions in Saudi Arabia, with millions of trees and an olive festival every year. In Dumat al-Jandal stand the stone Marid Castle and the old Omar mosque, among the oldest in Arabia.",
      uk: "Крайня північ — довкола Сакаки та Думат-ель-Джандаля. Ель-Джауф — один із найбільших оливкових регіонів Саудівської Аравії, з мільйонами дерев і щорічним фестивалем олив. У Думат-ель-Джандалі стоять кам'яна фортеця Марид і стара мечеть Омара — одна з найдавніших в Аравії.",
      najdi: "أقصى الشمال، حول سكاكا ودومة الجندل. الجوف من أكبر مناطق الزيتون بالسعودية، فيها ملايين الشجر ومهرجان للزيتون كل سنة. وبدومة الجندل فيه قلعة مارد الحجرية ومسجد عمر القديم، من أقدم المساجد بالجزيرة.",
      msa: "أقصى الشمال، حول سكاكا ودومة الجندل. والجوف من أكبر مناطق زراعة الزيتون في السعودية، بملايين الأشجار ومهرجان سنوي للزيتون. وفي دومة الجندل تقوم قلعة مارد الحجرية ومسجد عمر القديم، من أقدم مساجد الجزيرة العربية.",
    },
    words: [
      W("زيتون", "zētūn", "olives", "оливки", "زيتون"),
      W("قلعة", "galʿa", "castle — ق said as g", "фортеця — ق вимовляється як g", "قلعة"),
      W("مزرعة", "mazraʿa", "farm", "ферма", "مزرعة"),
    ],
  },
  {
    id: "tabuk", region: "north",
    title: { en: "Tabuk", uk: "Табук", najdi: "تبوك", msa: "تبوك" },
    body: {
      en: "In the north-west, near Jordan and the Red Sea. In a cold winter the mountains around Jabal al-Lawz can turn white with snow, and people drive for hours to see it. Tabuk is also a region of big farms and flower fields, with a flower festival in spring.",
      uk: "На північному заході, біля Йорданії та Червоного моря. Холодної зими гори довкола Джебель-ель-Лауза можуть побіліти від снігу, і люди їдуть годинами, щоб його побачити. Табук — також край великих ферм і квіткових полів, із квітковим фестивалем навесні.",
      najdi: "بالشمال الغربي، قريب من الأردن والبحر الأحمر. إذا صار الشتا بارد، جبال اللوز ممكن تبيضّ من الثلج، والناس يسوقون ساعات عشان يشوفونه. وتبوك بعد فيها مزارع كبيرة وحقول ورد، ومهرجان للورد بالربيع.",
      msa: "في الشمال الغربي، قرب الأردن والبحر الأحمر. وفي الشتاء البارد قد تكتسي جبال اللوز بالثلج، فيقطع الناس الساعات ليروه. وتبوك أيضًا منطقة مزارع كبيرة وحقول زهور، ولها مهرجان للزهور في الربيع.",
    },
    words: [
      W("ثلج", "thalj", "snow", "сніг", "ثلج", false),
      W("ورد", "ward", "roses, flowers", "троянди, квіти", "ورد"),
      W("برد", "bard", "cold weather", "холод", "برد", false),
    ],
  },
  {
    id: "arar", region: "north",
    title: { en: "Arar and the Northern Borders", uk: "Арар і Північні кордони", najdi: "عرعر والحدود الشمالية", msa: "عرعر ومنطقة الحدود الشمالية" },
    body: {
      en: "The region along the borders with Iraq and Jordan: open steppe, sheep and camel herding, cold winters and — after rain — truffles and spring grass. Arar is its capital. Life here is close to the Bedouin traditions of the desert: hospitality, poetry and the herd.",
      uk: "Край уздовж кордонів з Іраком і Йорданією: відкритий степ, випас овець і верблюдів, холодні зими, а після дощів — трюфелі й весняна трава. Столиця — Арар. Життя тут близьке до бедуїнських традицій пустелі: гостинність, поезія і стадо.",
      najdi: "المنطقة اللي على حدود العراق والأردن: بر مفتوح، ورعي غنم وبعارين، وشتا بارد، وبعد المطر فقع وربيع. وعاصمتها عرعر. والحياة هنا قريبة من عادات البادية: الكرم والشعر والحلال.",
      msa: "المنطقة الممتدّة على حدود العراق والأردن: بادية مفتوحة، ورعي الغنم والإبل، وشتاء بارد، وبعد المطر كمأة وربيع. وعاصمتها عرعر. والحياة هنا قريبة من تقاليد البادية: الكرم والشعر والماشية.",
    },
    words: [
      W("غنم", "ghanam", "sheep", "вівці", "غنم"),
      W("حلال", "ḥalāl", "livestock, the herd (in the desert)", "худоба, стадо (у пустелі)", "الماشية"),
      W("بادية", "bādya", "the desert and its Bedouin life", "пустеля та бедуїнське життя", "البادية"),
    ],
  },
  {
    id: "poetry", region: "all",
    title: { en: "Nabati poetry", uk: "Набатійська поезія", najdi: "الشعر النبطي", msa: "الشعر النبطي" },
    body: {
      en: "Poetry in the spoken dialect, not in formal Arabic — the heart of Najdi and northern culture. People quote verses in conversation, send them to each other, and follow poetry competitions on TV. A good line of Nabati poetry can win an argument.",
      uk: "Поезія розмовним діалектом, а не літературною арабською, — серце культури Неджду й півночі. Люди цитують вірші в розмові, пересилають їх одне одному й дивляться поетичні змагання по телебаченню. Влучний рядок набатійської поезії може виграти суперечку.",
      najdi: "شعر باللهجة، مو بالفصحى — قلب ثقافة نجد والشمال. الناس يستشهدون بالأبيات بالسوالف، ويرسلونها لبعض، ويتابعون مسابقات الشعر بالتلفزيون. والبيت الزين يكسب النقاش.",
      msa: "شعر باللهجة المحكية لا بالفصحى — وهو قلب الثقافة النجدية والشمالية. يستشهد الناس بأبياته في أحاديثهم، ويتبادلونها، ويتابعون مسابقات الشعر على التلفاز. وقد يحسم بيتٌ جميل نقاشًا كاملًا.",
    },
    words: [
      W("شاعر", "shāʿir", "poet", "поет", "شاعر"),
      W("بيت", "bēt", "a line of poetry (also: house)", "рядок вірша (а також: дім)", "بيت شعر", false),
      W("قصيد", "gaṣīd", "poetry — ق said as g", "поезія — ق вимовляється як g", "قصيد"),
    ],
  },
  {
    id: "days", region: "all",
    title: { en: "National Day and Founding Day", uk: "Національний день і День заснування", najdi: "اليوم الوطني ويوم التأسيس", msa: "اليوم الوطني ويوم التأسيس" },
    body: {
      en: "23 September is National Day — the unification of the Kingdom in 1932: green everywhere, fireworks, the Ardah, cars decorated with flags. 22 February is Founding Day — the founding of the first Saudi state in Diriyah in 1727, celebrated with traditional clothes and old Najdi style.",
      uk: "23 вересня — Національний день, об'єднання королівства у 1932 році: усюди зелений колір, феєрверки, арда, прикрашені автомобілі. 22 лютого — День заснування: заснування першої саудівської держави в Ед-Дірʼії у 1727 році, його святкують у традиційному одязі й старому неджському стилі.",
      najdi: "٢٣ سبتمبر اليوم الوطني — توحيد المملكة سنة ١٩٣٢: كل شي أخضر، وألعاب نارية، وعرضة، وسيارات مزيّنة. و٢٢ فبراير يوم التأسيس — تأسيس الدولة السعودية الأولى بالدرعية سنة ١٧٢٧، ويحتفلون فيه باللبس الشعبي والطابع النجدي القديم.",
      msa: "في ٢٣ سبتمبر اليوم الوطني، ذكرى توحيد المملكة عام ١٩٣٢: الأخضر في كل مكان، والألعاب النارية، والعرضة، والسيارات المزيّنة. وفي ٢٢ فبراير يوم التأسيس، ذكرى تأسيس الدولة السعودية الأولى في الدرعية عام ١٧٢٧، ويُحتفل به بالأزياء التقليدية والطابع النجدي القديم.",
    },
    words: [
      W("اليوم الوطني", "al-yōm al-waṭani", "National Day", "Національний день", "اليوم الوطني"),
      W("يوم التأسيس", "yōm at-taʾsīs", "Founding Day", "День заснування", "يوم التأسيس"),
      W("كل عام والوطن بخير", "kill ʿām w al-waṭan bkhēr", "happy National Day (lit. may the homeland be well every year)", "з Національним днем (дослівно: хай батьківщина щороку буде в добрі)", "كلّ عام والوطن بخير"),
    ],
  },
  {
    id: "food", region: "najd",
    title: { en: "Food of Najd", uk: "Кухня Неджду", najdi: "أكلات نجد", msa: "أكلات نجد" },
    body: {
      en: "Beyond kabsa: jarīsh — crushed wheat slow-cooked with laban; margūg — a vegetable and meat stew with thin sheets of dough; gursān — thin bread torn into broth; maṭāzīz — dough squares in stew; and in winter, ḥanīni — dates mashed with bread and butter. Most are made at home, for family.",
      uk: "Не лише кабса: джаріш — дроблена пшениця, довго тушкована з кислим молоком; маргуг — рагу з овочів і м'яса з тонкими листками тіста; гурсан — тонкий хліб, розламаний у бульйон; матазіз — квадратики тіста в рагу; а взимку ханіні — фініки, розтерті з хлібом і маслом. Здебільшого їх готують удома, для родини.",
      najdi: "مو بس كبسة: الجريش — بر مجروش ينطبخ مع اللبن؛ والمرقوق — مرق خضار ولحم مع رقايق عجين؛ والقرصان — خبز رقيق مقطّع بالمرق؛ والمطازيز — قطع عجين بالمرق؛ وبالشتا الحنيني — تمر مهروس مع خبز وسمن. أغلبها ينسوّى بالبيت للعايلة.",
      msa: "ليست الكبسة وحدها: الجريش — قمح مجروش يُطهى ببطء مع اللبن؛ والمرقوق — مرق خضار ولحم مع رقائق العجين؛ والقرصان — خبز رقيق يُفتّ في المرق؛ والمطازيز — قطع عجين في المرق؛ وفي الشتاء الحنيني — تمر مهروس مع الخبز والسمن. ويُعدّ أغلبها في البيت للعائلة.",
    },
    words: [
      W("كبسة", "kabsa", "rice and meat, the national dish", "рис із м'ясом, національна страва", "كبسة", false),
      W("جريش", "jarīsh", "crushed wheat with laban", "дроблена пшениця з кислим молоком", "جريش"),
      W("مرقوق", "margūg", "stew with thin dough", "рагу з тонким тістом", "مرقوق"),
      W("قرصان", "gursān", "thin bread in broth", "тонкий хліб у бульйоні", "قرصان"),
      W("حنيني", "ḥanīni", "winter dish of dates, bread and butter", "зимова страва з фініків, хліба й масла", "حنيني"),
    ],
  },
  {
    id: "weddings", region: "all",
    title: { en: "Weddings", uk: "Весілля", najdi: "الأعراس", msa: "الأعراس" },
    body: {
      en: "Usually two separate celebrations — one for the women and one for the men. The women's party is the big night: music, dancing and the bride's entrance late in the evening. The men's side has coffee, dinner and often the Ardah. Guests congratulate with “mabrūk”.",
      uk: "Зазвичай це два окремі святкування — для жінок і для чоловіків. Жіноча вечірка — головна ніч: музика, танці й поява нареченої пізно ввечері. На чоловічій половині — кава, вечеря і часто арда. Гості вітають словом «mabrūk».",
      najdi: "بالعادة حفلتين: وحدة للحريم ووحدة للرجال. حفلة الحريم هي الليلة الكبيرة: طرب ورقص ودخلة العروس آخر الليل. وعند الرجال قهوة وعشا وأحيانًا عرضة. والمعازيم يقولون «مبروك».",
      msa: "في الغالب حفلان منفصلان: للنساء وللرجال. وحفل النساء هو الليلة الكبرى: موسيقى ورقص ودخول العروس في آخر السهرة. وعند الرجال قهوة وعشاء وكثيرًا ما تُؤدّى العرضة. ويهنّئ الضيوف بقولهم «مبروك».",
    },
    words: [
      W("مبروك", "mabrūk", "congratulations (reply: allah ybārik fīk)", "вітаю (відповідь: allah ybārik fīk)", "مبروك", false),
      W("عرس", "ʿirs", "wedding", "весілля", "عرس"),
      W("عروس", "ʿarūs", "bride", "наречена", "عروس"),
      W("معازيم", "maʿāzīm", "the guests", "гості", "المدعوّون"),
    ],
  },
  {
    id: "hijri", region: "all",
    title: { en: "The Hijri calendar and the Saudi week", uk: "Календар хіджри і саудівський тиждень", najdi: "التقويم الهجري", msa: "التقويم الهجري والأسبوع" },
    body: {
      en: "Saudi Arabia uses the Umm al-Qura Hijri calendar alongside the Gregorian one. Its 12 months follow the moon, so the year is about 11 days shorter — Ramadan and the Eids come earlier every year. The weekend is Friday and Saturday.",
      uk: "Саудівська Аравія користується календарем хіджри Умм аль-Кура поряд із григоріанським. Його 12 місяців ідуть за місяцем, тому рік приблизно на 11 днів коротший — Рамадан та Іди щороку настають раніше. Вихідні — п'ятниця й субота.",
      najdi: "السعودية تستخدم تقويم أم القرى الهجري مع الميلادي. شهوره الـ١٢ على القمر، فالسنة أقصر بحوالي ١١ يوم — ورمضان والأعياد يجون أبدر كل سنة. والويكند الجمعة والسبت.",
      msa: "تعتمد السعودية تقويم أم القرى الهجري إلى جانب الميلادي. وأشهره الاثنا عشر قمرية، فالسنة أقصر بنحو أحد عشر يومًا، ولذلك يتقدّم رمضان والعيدان كل عام. وعطلة نهاية الأسبوع الجمعة والسبت.",
    },
    words: [
      W("هجري", "hijri", "Hijri (the Islamic calendar)", "за хіджрою (ісламський календар)", "هجري"),
      W("ميلادي", "mīlādi", "Gregorian", "григоріанський", "ميلادي"),
      W("شهر", "shahr", "month", "місяць", "شهر", false),
      W("الجمعة", "al-jumʿa", "Friday", "п'ятниця", "الجمعة"),
    ],
  },
];

export const REGIONS = {
  all: { en: "All of Saudi", uk: "Уся Саудівська Аравія", najdi: "كل السعودية", msa: "المملكة كلّها" },
  najd: { en: "Najd", uk: "Неджд", najdi: "نجد", msa: "نجد" },
  north: { en: "The north", uk: "Північ", najdi: "الشمال", msa: "الشمال" },
};

export const FACTS = [
  { en: "Riyadh means “gardens” — the plural of rawḍa, a green meadow in the desert.", uk: "Ер-Ріяд означає «сади» — множина від rawḍa, зелена галявина в пустелі.", najdi: "الرياض يعني جمع روضة — الأرض الخضرا بالبر.", msa: "الرياض جمع روضة، وهي الأرض الخضراء في الصحراء." },
  { en: "Najd means “highland” — the plateau in the middle of Arabia.", uk: "Неджд означає «височина» — плато в центрі Аравії.", najdi: "نجد يعني الأرض المرتفعة — الهضبة اللي بنص الجزيرة.", msa: "نجد تعني الأرض المرتفعة، وهي الهضبة في وسط الجزيرة العربية." },
  { en: "Saudi Arabia has no permanent rivers — only wadis that flow after rain.", uk: "У Саудівській Аравії немає постійних річок — лише ваді, що течуть після дощу.", najdi: "السعودية ما فيها أنهار دايمة — بس أودية تسيل بعد المطر.", msa: "لا توجد في السعودية أنهار دائمة، بل أودية تسيل بعد المطر." },
  { en: "The Empty Quarter (ar-Rubʿ al-Khāli) is the largest continuous sand desert in the world.", uk: "Руб-ель-Халі («Порожня чверть») — найбільша суцільна піщана пустеля у світі.", najdi: "الربع الخالي أكبر صحرا رملية متصلة بالعالم.", msa: "الربع الخالي أكبر صحراء رملية متّصلة في العالم." },
  { en: "The Saudi weekend is Friday and Saturday.", uk: "Вихідні в Саудівській Аравії — п'ятниця й субота.", najdi: "الويكند بالسعودية الجمعة والسبت.", msa: "عطلة نهاية الأسبوع في السعودية الجمعة والسبت." },
  { en: "One riyal is 100 halalas.", uk: "Один ріял — це 100 халал.", najdi: "الريال فيه ١٠٠ هللة.", msa: "الريال يساوي مئة هللة." },
  { en: "Saudi Arabia has 13 regions; Ha'il, Al-Jouf, Tabuk and the Northern Borders make up the north.", uk: "Саудівська Аравія має 13 регіонів; Хаїль, Ель-Джауф, Табук і Північні кордони — це північ.", najdi: "السعودية فيها ١٣ منطقة، والشمال: حايل والجوف وتبوك والحدود الشمالية.", msa: "في السعودية ثلاث عشرة منطقة، والشمال يضمّ حائل والجوف وتبوك والحدود الشمالية." },
  { en: "Hegra (Mada'in Salih) near AlUla was Saudi Arabia's first UNESCO World Heritage Site, in 2008.", uk: "Хеґра (Мадаїн-Саліх) біля Аль-Ули стала першим об'єктом Світової спадщини ЮНЕСКО в Саудівській Аравії у 2008 році.", najdi: "الحجر (مدائن صالح) قرب العلا أول موقع سعودي بالتراث العالمي لليونسكو، سنة ٢٠٠٨.", msa: "الحِجر (مدائن صالح) قرب العُلا أول موقع سعودي في قائمة التراث العالمي لليونسكو عام ٢٠٠٨." },
  { en: "Saudi Arabia grows hundreds of kinds of dates; Sukkari from Qassim is one of the most loved.", uk: "У Саудівській Аравії вирощують сотні сортів фініків; сукарі з Касима — один із найулюбленіших.", najdi: "بالسعودية مئات الأنواع من التمر، والسكري من القصيم من أحبها للناس.", msa: "تزرع السعودية مئات الأصناف من التمور، ومن أحبّها السكّري من القصيم." },
  { en: "In Saudi speech, ق is usually said as “g”: gahwa (coffee), gāl (he said), galb (heart).", uk: "У саудівській мові ق зазвичай вимовляють як «g»: gahwa (кава), gāl (він сказав), galb (серце).", najdi: "بالسعودي القاف غالبًا تنقال مثل حرف g بالإنجليزي: قهوة، قال، قلب.", msa: "في اللهجة السعودية تُنطق القاف غالبًا كحرف g في الإنجليزية: قهوة، قال، قلب." },
  { en: "Riyadh's skyline on this site: Kingdom Centre with its sky bridge, and Al Faisaliah with its golden globe.", uk: "Панорама Ер-Ріяда на цьому сайті: Кінгдом-центр із мостом на вершині та Аль-Фейсалія із золотою кулею.", najdi: "الرياض بهالموقع: برج المملكة مع الجسر اللي فوق، وبرج الفيصلية مع الكرة الذهبية.", msa: "أفق الرياض في هذا الموقع: برج المملكة بجسره العلوي، وبرج الفيصلية بكرته الذهبية." },
  { en: "Hatim al-Tai of Ha'il is so famous for generosity that Arabs say “more generous than Hatim”.", uk: "Хатім ат-Таї з Хаїля настільки славиться щедрістю, що араби кажуть «щедріший за Хатіма».", najdi: "حاتم الطائي من حايل مشهور بالكرم لدرجة الناس يقولون «أكرم من حاتم».", msa: "اشتهر حاتم الطائي من حائل بالكرم حتى قالت العرب: «أكرم من حاتم»." },
  { en: "Arabic coffee, the majlis, Al-Sadu, the Ardah and falconry are all on UNESCO's intangible heritage lists.", uk: "Арабська кава, меджліс, ас-саду, арда й соколине полювання — усі в списках нематеріальної спадщини ЮНЕСКО.", najdi: "القهوة العربية والمجلس والسدو والعرضة والصقارة كلها بقوائم التراث غير المادي لليونسكو.", msa: "القهوة العربية والمجلس والسدو والعرضة والصقارة كلّها مُدرَجة في قوائم التراث غير المادي لليونسكو." },
  { en: "Riyadh will host Expo 2030, and Saudi Arabia the 2034 FIFA World Cup.", uk: "Ер-Ріяд прийме Expo 2030, а Саудівська Аравія — чемпіонат світу з футболу 2034 року.", najdi: "الرياض بتستضيف إكسبو ٢٠٣٠، والسعودية كأس العالم ٢٠٣٤.", msa: "تستضيف الرياض معرض إكسبو ٢٠٣٠، وتستضيف السعودية كأس العالم ٢٠٣٤." },
  { en: "Sadu patterns carry names: a row of triangles is often called “teeth”.", uk: "Візерунки саду мають назви: ряд трикутників часто називають «зубами».", najdi: "نقوش السدو لها أسماء: صف المثلثات كثير يسمّونه «ضروس».", msa: "لنقوش السدو أسماء: فصفّ المثلثات كثيرًا ما يُسمّى «الضروس»." },
];

// The year's occasions: Hijri ones (found with the Umm al-Qura calendar) and Gregorian ones. say: how the Arabic name sounds.
export const OCCASIONS = [
  { id: "ramadan", hijri: [9, 1], say: "bidāyat ramaḍān", name: { en: "Ramadan begins", uk: "Початок Рамадану", najdi: "بداية رمضان", msa: "بداية شهر رمضان" } },
  { id: "fitr", hijri: [10, 1], say: "ʿīd al-fiṭr", name: { en: "Eid al-Fitr", uk: "Ід аль-Фітр (свято розговіння)", najdi: "عيد الفطر", msa: "عيد الفطر" } },
  { id: "arafah", hijri: [12, 9], say: "yōm ʿarafa", name: { en: "Day of Arafah", uk: "День Арафат", najdi: "يوم عرفة", msa: "يوم عرفة" } },
  { id: "adha", hijri: [12, 10], say: "ʿīd al-aḍḥa", name: { en: "Eid al-Adha", uk: "Ід аль-Адха (свято жертвопринесення)", najdi: "عيد الأضحى", msa: "عيد الأضحى" } },
  { id: "newyear", hijri: [1, 1], say: "rās as-sana al-hijriyya", name: { en: "Islamic New Year", uk: "Ісламський Новий рік", najdi: "رأس السنة الهجرية", msa: "رأس السنة الهجرية" } },
  { id: "founding", greg: [2, 22], say: "yōm at-taʾsīs", name: { en: "Founding Day", uk: "День заснування", najdi: "يوم التأسيس", msa: "يوم التأسيس" } },
  { id: "national", greg: [9, 23], say: "al-yōm al-waṭani", name: { en: "National Day", uk: "Національний день", najdi: "اليوم الوطني", msa: "اليوم الوطني" } },
];
