// Saudi life: culture stories (with a focus on the north), facts, and the year's occasions.
// Words marked `check` are not in NAJDI-PLAN.md and show "check with tutor" until Dima confirms them
// (tests/saudi.test.mjs enforces this). Facts are well-established; anything approximate says so.

const W = (ar, say, en, check = true) => ({ ar, say, en, check });

export const STORIES = [
  {
    id: "ramadan", region: "all",
    title: { en: "Ramadan", najdi: "رمضان" },
    body: {
      en: "The whole country changes rhythm. People fast from dawn (Fajr) to sunset (Maghrib), then break the fast with dates, water and Arabic coffee before the meal. Nights are long and social: taraweeh prayers, family visits, and suhoor — a last meal before dawn. Streets and malls come alive after iftar.",
      najdi: "البلد كله يتغيّر إيقاعه. الناس يصومون من الفجر لين المغرب، وبعدين يفطرون على تمر وموية وقهوة قبل الأكل. الليل طويل وكله ناس: صلاة التراويح، وزيارات الأهل، والسحور قبل الفجر. وبعد الفطور الشوارع والمولات تحيا.",
    },
    words: [
      W("رمضان كريم", "ramaḍān karīm", "Ramadan greeting (reply: allah akram)", false),
      W("فطور", "fṭūr", "the meal that breaks the fast (also: breakfast)", false),
      W("سحور", "saḥūr", "the meal before dawn"),
      W("تراويح", "tarāwīḥ", "Ramadan night prayers"),
      W("صايم", "ṣāyim", "fasting (a man); ṣāyma — a woman"),
    ],
  },
  {
    id: "eid", region: "all",
    title: { en: "Eid", najdi: "العيد" },
    body: {
      en: "There are two Eids: Eid al-Fitr at the end of Ramadan, and Eid al-Adha during the Hajj. The day starts with the Eid prayer; then new clothes, visits to the eldest of the family first, coffee, dates and sweets in every house. Children collect ʿīdiyya — Eid money — from their relatives.",
      najdi: "فيه عيدين: عيد الفطر بعد رمضان، وعيد الأضحى وقت الحج. اليوم يبدأ بصلاة العيد، وبعدين لبس جديد، وزيارة كبار العايلة أول، وقهوة وتمر وحلا في كل بيت. والعيال يجمعون العيدية من أهلهم.",
    },
    words: [
      W("عيدك مبارك", "ʿīdik mbārak", "Eid greeting (to her)", false),
      W("كل عام وانتي بخير", "kill ʿām w inti bkhēr", "Eid / birthday wish (to her)", false),
      W("عيدية", "ʿīdiyya", "Eid money for children"),
      W("صلاة العيد", "ṣalāt al-ʿīd", "the Eid prayer"),
    ],
  },
  {
    id: "gahwa", region: "all",
    title: { en: "Arabic coffee (gahwa)", najdi: "القهوة" },
    body: {
      en: "Saudi coffee is lightly roasted and spiced with cardamom — sometimes saffron or cloves. It's poured from a dallah into a small finjal, only a little at a time, and served with the right hand, with dates. When you've had enough, gently shake the cup side to side before handing it back — otherwise it will be refilled. UNESCO lists Arabic coffee as intangible heritage (2015).",
      najdi: "القهوة السعودية شقرا ومهيّلة — وأحيانًا فيها زعفران أو قرنفل. تنصب من الدلة في فنجال صغير، شوي شوي، وتتقدّم باليمين مع التمر. وإذا كفّيت، هزّ الفنجال يمين ويسار قبل ما ترجّعه — وإلا بيصبّون لك زود.",
    },
    words: [
      W("قهوة", "gahwa", "coffee — ق said as g", false),
      W("دلة", "dalla", "the coffee pot"),
      W("فنجال", "finjāl", "the small coffee cup"),
      W("هيل", "hēl", "cardamom"),
      W("تمر", "tamr", "dates", false),
    ],
  },
  {
    id: "mud", region: "najd",
    title: { en: "Mud-brick Najd and Diriyah", najdi: "الطين والدرعية" },
    body: {
      en: "Traditional Najdi houses are built from mud brick with palm-trunk beams: thick walls that keep out the heat, a courtyard inside, triangular vents and crenellations along the roof — like the fort drawn on this site. At-Turaif in Diriyah, the first Saudi capital, is a UNESCO World Heritage Site (2010).",
      najdi: "البيوت النجدية القديمة مبنية من الطين وسقفها من جذوع النخل: جدران عريضة تصد الحر، وحوش بالنص، وفتحات مثلّثة وشرفات فوق السطح — مثل القصر المرسوم بهالموقع. وحي الطريف بالدرعية، أول عاصمة سعودية، من مواقع التراث العالمي لليونسكو.",
    },
    words: [
      W("طين", "ṭīn", "mud (for building)"),
      W("الدرعية", "ad-dirʿiyya", "Diriyah"),
      W("مجلس", "majlis", "the sitting room for guests"),
      W("حوش", "ḥōsh", "courtyard"),
    ],
  },
  {
    id: "ardah", region: "najd",
    title: { en: "Al-Ardah — the sword dance", najdi: "العرضة" },
    body: {
      en: "Two rows of men with swords move to big drums while a poet chants verses and the rows answer him. It's danced at National Day, Founding Day and weddings — the kings dance it too. UNESCO listed Alardah Alnajdiyah as intangible heritage in 2015.",
      najdi: "صفّين رجال معهم سيوف يتحرّكون على الطبول، والشاعر يقول القصيد والصفوف ترد عليه. تنلعب باليوم الوطني ويوم التأسيس والأعراس — حتى الملوك يلعبونها.",
    },
    words: [
      W("عرضة", "ʿarḍa", "the Ardah dance"),
      W("سيف", "sēf", "sword"),
      W("طبول", "ṭubūl", "drums"),
      W("قصيدة", "gaṣīda", "poem — ق said as g"),
    ],
  },
  {
    id: "sadu", region: "north",
    title: { en: "Al-Sadu weaving", najdi: "السدو" },
    body: {
      en: "Bedouin women weave Sadu on a ground loom from sheep, goat and camel wool: bands of red, black and white with geometric patterns, for tents, cushions and camel bags. The zig-zag border under this site's headings is a nod to it. UNESCO listed it in 2020 (Saudi Arabia and Kuwait).",
      najdi: "نسوان البادية ينسجون السدو على النول بالأرض من صوف الغنم وشعر الماعز ووبر البعارين: خطوط حمر وسود وبيض بنقوش، للخيام والمساند وشداد البعارين. والنقشة المتعرّجة تحت عناوين هالموقع مأخوذة منه.",
    },
    words: [
      W("سدو", "sadu", "Sadu weaving"),
      W("صوف", "ṣūf", "wool"),
      W("بيت الشعر", "bēt ash-shaʿar", "the black goat-hair tent"),
    ],
  },
  {
    id: "falcons", region: "all",
    title: { en: "Falcons", najdi: "الصقور" },
    body: {
      en: "Falconry is an old desert art that's still loved: falcons are trained to hunt, flown in races and shown at big winter festivals. A good falcon can cost as much as a car. Falconry is on UNESCO's list of intangible heritage, shared by many countries including Saudi Arabia.",
      najdi: "الصقارة فن قديم من البر وللحين الناس يحبونه: يدرّبون الصقور على الصيد، ويسابقونها، ويعرضونها بمهرجانات الشتا. والصقر الزين ممكن سعره مثل سيارة.",
    },
    words: [
      W("صقر", "ṣagr", "falcon — ق said as g"),
      W("مقناص", "magnāṣ", "a hunting trip"),
    ],
  },
  {
    id: "camels", region: "north",
    title: { en: "Camels", najdi: "الإبل" },
    body: {
      en: "Camels are family history: milk, races and even beauty contests. The King Abdulaziz Camel Festival, held every winter north of Riyadh, is one of the biggest camel events in the world. In the northern steppe many families still keep herds.",
      najdi: "البعارين تاريخ العوايل: حليب، وسباق هجن، وحتى مزاين. ومهرجان الملك عبدالعزيز للإبل كل شتا شمال الرياض من أكبر مهرجانات الإبل بالعالم. وبالشمال للحين عوايل كثير عندهم حلال.",
    },
    words: [
      W("ناقة", "nāga", "she-camel — ق said as g"),
      W("بعير", "biʿīr", "camel"),
      W("هجن", "hjin", "racing camels"),
      W("مزاين", "mazāyin", "camel beauty contest"),
    ],
  },
  {
    id: "kashta", region: "all",
    title: { en: "Kashta and the desert spring", najdi: "الكشتة والربيع" },
    body: {
      en: "In winter, and after rain, the desert turns green — rabīʿ. Families and friends drive out for a kashta: a trip into the desert with a fire, coffee and grilled food, often late into the night under the stars. It's one of the most loved parts of the Saudi winter.",
      najdi: "بالشتا وبعد المطر البر يخضرّ — الربيع. والعوايل والربع يطلعون كشتة: طلعة للبر مع نار وقهوة وشوي، وأحيانًا لين آخر الليل تحت النجوم. من أحلى شي بشتا السعودية.",
    },
    words: [
      W("كشتة", "kashta", "a desert outing"),
      W("ربيع", "rabīʿ", "the green desert after rain"),
      W("البر", "al-barr", "the open desert, the outdoors"),
      W("نار", "nār", "fire"),
    ],
  },
  {
    id: "truffles", region: "north",
    title: { en: "Desert truffles of the north", najdi: "فقع الشمال" },
    body: {
      en: "After good winter rains, the northern deserts — around Ha'il, Al-Jouf, Arar and Hafar al-Batin — give fagʿ: desert truffles, dug out of the sand in late winter and spring. They're sold at special markets, can be very expensive in a good year, and are eaten grilled, boiled or cooked with rice.",
      najdi: "إذا جا مطر زين بالشتا، براري الشمال — حول حايل والجوف وعرعر وحفر الباطن — يطلع فيها الفقع، يطلعونه من الرمل آخر الشتا وبالربيع. ينباع بأسواق خاصة، وبالسنة الزينة يغلى مرة، وينشوى أو ينطبخ مع الرز.",
    },
    words: [
      W("فقع", "fagʿ", "desert truffles — ق said as g"),
      W("زبيدي", "zbēdi", "the prized white truffle"),
      W("مطر", "maṭar", "rain", false),
    ],
  },
  {
    id: "hail", region: "north",
    title: { en: "Ha'il", najdi: "حايل" },
    body: {
      en: "Ha'il sits between two mountain ranges, Aja and Salma, in the north of Najd. It's famous for generosity: the pre-Islamic poet Hatim al-Tai, whose name still means “the most generous”, came from here. Near Ha'il, at Jubbah and Shuwaymis, is some of Arabia's oldest rock art — people, camels and ibex carved thousands of years ago (UNESCO, 2015).",
      najdi: "حايل بين جبلين، أجا وسلمى، بشمال نجد. معروفة بالكرم: حاتم الطائي، اللي اسمه للحين يعني «أكرم واحد»، منها. وقريب من حايل، بجبة والشويمس، فيه من أقدم النقوش على الصخور بالجزيرة — ناس وبعارين ووعول منقوشة من آلاف السنين.",
    },
    words: [
      W("كرم", "karam", "generosity"),
      W("كريم", "karīm", "generous"),
      W("جبل", "jabal", "mountain"),
      W("أجا وسلمى", "aja w salma", "the two mountains of Ha'il"),
    ],
  },
  {
    id: "jouf", region: "north",
    title: { en: "Al-Jouf", najdi: "الجوف" },
    body: {
      en: "The far north, around Sakaka and Dumat al-Jandal. Al-Jouf is one of the biggest olive-growing regions in Saudi Arabia, with millions of trees and an olive festival every year. In Dumat al-Jandal stand the stone Marid Castle and the old Omar mosque, among the oldest in Arabia.",
      najdi: "أقصى الشمال، حول سكاكا ودومة الجندل. الجوف من أكبر مناطق الزيتون بالسعودية، فيها ملايين الشجر ومهرجان للزيتون كل سنة. وبدومة الجندل فيه قلعة مارد الحجرية ومسجد عمر القديم، من أقدم المساجد بالجزيرة.",
    },
    words: [
      W("زيتون", "zētūn", "olives"),
      W("قلعة", "galʿa", "castle — ق said as g"),
      W("مزرعة", "mazraʿa", "farm"),
    ],
  },
  {
    id: "tabuk", region: "north",
    title: { en: "Tabuk", najdi: "تبوك" },
    body: {
      en: "In the north-west, near Jordan and the Red Sea. In a cold winter the mountains around Jabal al-Lawz can turn white with snow, and people drive for hours to see it. Tabuk is also a region of big farms and flower fields, with a flower festival in spring.",
      najdi: "بالشمال الغربي، قريب من الأردن والبحر الأحمر. إذا صار الشتا بارد، جبال اللوز ممكن تبيضّ من الثلج، والناس يسوقون ساعات عشان يشوفونه. وتبوك بعد فيها مزارع كبيرة وحقول ورد، ومهرجان للورد بالربيع.",
    },
    words: [
      W("ثلج", "thalj", "snow", false),
      W("ورد", "ward", "roses, flowers"),
      W("برد", "bard", "cold weather", false),
    ],
  },
  {
    id: "arar", region: "north",
    title: { en: "Arar and the Northern Borders", najdi: "عرعر والحدود الشمالية" },
    body: {
      en: "The region along the borders with Iraq and Jordan: open steppe, sheep and camel herding, cold winters and — after rain — truffles and spring grass. Arar is its capital. Life here is close to the Bedouin traditions of the desert: hospitality, poetry and the herd.",
      najdi: "المنطقة اللي على حدود العراق والأردن: بر مفتوح، ورعي غنم وبعارين، وشتا بارد، وبعد المطر فقع وربيع. وعاصمتها عرعر. والحياة هنا قريبة من عادات البادية: الكرم والشعر والحلال.",
    },
    words: [
      W("غنم", "ghanam", "sheep"),
      W("حلال", "ḥalāl", "livestock, the herd (in the desert)"),
      W("بادية", "bādya", "the desert and its Bedouin life"),
    ],
  },
  {
    id: "poetry", region: "all",
    title: { en: "Nabati poetry", najdi: "الشعر النبطي" },
    body: {
      en: "Poetry in the spoken dialect, not in formal Arabic — the heart of Najdi and northern culture. People quote verses in conversation, send them to each other, and follow poetry competitions on TV. A good line of Nabati poetry can win an argument.",
      najdi: "شعر باللهجة، مو بالفصحى — قلب ثقافة نجد والشمال. الناس يستشهدون بالأبيات بالسوالف، ويرسلونها لبعض، ويتابعون مسابقات الشعر بالتلفزيون. والبيت الزين يكسب النقاش.",
    },
    words: [
      W("شاعر", "shāʿir", "poet"),
      W("بيت", "bēt", "a line of poetry (also: house)", false),
      W("قصيد", "gaṣīd", "poetry — ق said as g"),
    ],
  },
  {
    id: "days", region: "all",
    title: { en: "National Day and Founding Day", najdi: "اليوم الوطني ويوم التأسيس" },
    body: {
      en: "23 September is National Day — the unification of the Kingdom in 1932: green everywhere, fireworks, the Ardah, cars decorated with flags. 22 February is Founding Day — the founding of the first Saudi state in Diriyah in 1727, celebrated with traditional clothes and old Najdi style.",
      najdi: "٢٣ سبتمبر اليوم الوطني — توحيد المملكة سنة ١٩٣٢: كل شي أخضر، وألعاب نارية، وعرضة، وسيارات مزيّنة. و٢٢ فبراير يوم التأسيس — تأسيس الدولة السعودية الأولى بالدرعية سنة ١٧٢٧، ويحتفلون فيه باللبس الشعبي والطابع النجدي القديم.",
    },
    words: [
      W("اليوم الوطني", "al-yōm al-waṭani", "National Day"),
      W("يوم التأسيس", "yōm at-taʾsīs", "Founding Day"),
      W("كل عام والوطن بخير", "kill ʿām w al-waṭan bkhēr", "happy National Day (lit. may the homeland be well every year)"),
    ],
  },
  {
    id: "food", region: "najd",
    title: { en: "Food of Najd", najdi: "أكلات نجد" },
    body: {
      en: "Beyond kabsa: jarīsh — crushed wheat slow-cooked with laban; margūg — a vegetable and meat stew with thin sheets of dough; gursān — thin bread torn into broth; maṭāzīz — dough squares in stew; and in winter, ḥanīni — dates mashed with bread and butter. Most are made at home, for family.",
      najdi: "مو بس كبسة: الجريش — بر مجروش ينطبخ مع اللبن؛ والمرقوق — مرق خضار ولحم مع رقايق عجين؛ والقرصان — خبز رقيق مقطّع بالمرق؛ والمطازيز — قطع عجين بالمرق؛ وبالشتا الحنيني — تمر مهروس مع خبز وسمن. أغلبها ينسوّى بالبيت للعايلة.",
    },
    words: [
      W("كبسة", "kabsa", "rice and meat, the national dish", false),
      W("جريش", "jarīsh", "crushed wheat with laban"),
      W("مرقوق", "margūg", "stew with thin dough"),
      W("قرصان", "gursān", "thin bread in broth"),
      W("حنيني", "ḥanīni", "winter dish of dates, bread and butter"),
    ],
  },
  {
    id: "weddings", region: "all",
    title: { en: "Weddings", najdi: "الأعراس" },
    body: {
      en: "Usually two separate celebrations — one for the women and one for the men. The women's party is the big night: music, dancing and the bride's entrance late in the evening. The men's side has coffee, dinner and often the Ardah. Guests congratulate with “mabrūk”.",
      najdi: "بالعادة حفلتين: وحدة للحريم ووحدة للرجال. حفلة الحريم هي الليلة الكبيرة: طرب ورقص ودخلة العروس آخر الليل. وعند الرجال قهوة وعشا وأحيانًا عرضة. والمعازيم يقولون «مبروك».",
    },
    words: [
      W("مبروك", "mabrūk", "congratulations (reply: allah ybārik fīk)", false),
      W("عرس", "ʿirs", "wedding"),
      W("عروس", "ʿarūs", "bride"),
      W("معازيم", "maʿāzīm", "the guests"),
    ],
  },
  {
    id: "hijri", region: "all",
    title: { en: "The Hijri calendar and the Saudi week", najdi: "التقويم الهجري" },
    body: {
      en: "Saudi Arabia uses the Umm al-Qura Hijri calendar alongside the Gregorian one. Its 12 months follow the moon, so the year is about 11 days shorter — Ramadan and the Eids come earlier every year. The weekend is Friday and Saturday.",
      najdi: "السعودية تستخدم تقويم أم القرى الهجري مع الميلادي. شهوره الـ١٢ على القمر، فالسنة أقصر بحوالي ١١ يوم — ورمضان والأعياد يجون أبدر كل سنة. والويكند الجمعة والسبت.",
    },
    words: [
      W("هجري", "hijri", "Hijri (the Islamic calendar)"),
      W("ميلادي", "mīlādi", "Gregorian"),
      W("شهر", "shahr", "month", false),
      W("الجمعة", "al-jumʿa", "Friday"),
    ],
  },
];

export const REGIONS = {
  all: { en: "All of Saudi", najdi: "كل السعودية" },
  najd: { en: "Najd", najdi: "نجد" },
  north: { en: "The north", najdi: "الشمال" },
};

export const FACTS = [
  { en: "Riyadh means “gardens” — the plural of rawḍa, a green meadow in the desert.", najdi: "الرياض يعني جمع روضة — الأرض الخضرا بالبر." },
  { en: "Najd means “highland” — the plateau in the middle of Arabia.", najdi: "نجد يعني الأرض المرتفعة — الهضبة اللي بنص الجزيرة." },
  { en: "Saudi Arabia has no permanent rivers — only wadis that flow after rain.", najdi: "السعودية ما فيها أنهار دايمة — بس أودية تسيل بعد المطر." },
  { en: "The Empty Quarter (ar-Rubʿ al-Khāli) is the largest continuous sand desert in the world.", najdi: "الربع الخالي أكبر صحرا رملية متصلة بالعالم." },
  { en: "The Saudi weekend is Friday and Saturday.", najdi: "الويكند بالسعودية الجمعة والسبت." },
  { en: "One riyal is 100 halalas.", najdi: "الريال فيه ١٠٠ هللة." },
  { en: "Saudi Arabia has 13 regions; Ha'il, Al-Jouf, Tabuk and the Northern Borders make up the north.", najdi: "السعودية فيها ١٣ منطقة، والشمال: حايل والجوف وتبوك والحدود الشمالية." },
  { en: "Hegra (Mada'in Salih) near AlUla was Saudi Arabia's first UNESCO World Heritage Site, in 2008.", najdi: "الحجر (مدائن صالح) قرب العلا أول موقع سعودي بالتراث العالمي لليونسكو، سنة ٢٠٠٨." },
  { en: "Saudi Arabia grows hundreds of kinds of dates; Sukkari from Qassim is one of the most loved.", najdi: "بالسعودية مئات الأنواع من التمر، والسكري من القصيم من أحبها للناس." },
  { en: "In Saudi speech, ق is usually said as “g”: gahwa (coffee), gāl (he said), galb (heart).", najdi: "بالسعودي القاف غالبًا تنقال مثل حرف g بالإنجليزي: قهوة، قال، قلب." },
  { en: "Riyadh's skyline on this site: Kingdom Centre with its sky bridge, and Al Faisaliah with its golden globe.", najdi: "الرياض بهالموقع: برج المملكة مع الجسر اللي فوق، وبرج الفيصلية مع الكرة الذهبية." },
  { en: "Hatim al-Tai of Ha'il is so famous for generosity that Arabs say “more generous than Hatim”.", najdi: "حاتم الطائي من حايل مشهور بالكرم لدرجة الناس يقولون «أكرم من حاتم»." },
  { en: "Arabic coffee, the majlis, Al-Sadu, the Ardah and falconry are all on UNESCO's intangible heritage lists.", najdi: "القهوة العربية والمجلس والسدو والعرضة والصقارة كلها بقوائم التراث غير المادي لليونسكو." },
  { en: "Riyadh will host Expo 2030, and Saudi Arabia the 2034 FIFA World Cup.", najdi: "الرياض بتستضيف إكسبو ٢٠٣٠، والسعودية كأس العالم ٢٠٣٤." },
  { en: "Sadu patterns carry names: a row of triangles is often called “teeth”.", najdi: "نقوش السدو لها أسماء: صف المثلثات كثير يسمّونه «ضروس»." },
];

// The year's occasions: Hijri ones (found with the Umm al-Qura calendar) and Gregorian ones. say: how the Arabic name sounds.
export const OCCASIONS = [
  { id: "ramadan", hijri: [9, 1], say: "bidāyat ramaḍān", name: { en: "Ramadan begins", najdi: "بداية رمضان" } },
  { id: "fitr", hijri: [10, 1], say: "ʿīd al-fiṭr", name: { en: "Eid al-Fitr", najdi: "عيد الفطر" } },
  { id: "arafah", hijri: [12, 9], say: "yōm ʿarafa", name: { en: "Day of Arafah", najdi: "يوم عرفة" } },
  { id: "adha", hijri: [12, 10], say: "ʿīd al-aḍḥa", name: { en: "Eid al-Adha", najdi: "عيد الأضحى" } },
  { id: "newyear", hijri: [1, 1], say: "rās as-sana al-hijriyya", name: { en: "Islamic New Year", najdi: "رأس السنة الهجرية" } },
  { id: "founding", greg: [2, 22], say: "yōm at-taʾsīs", name: { en: "Founding Day", najdi: "يوم التأسيس" } },
  { id: "national", greg: [9, 23], say: "al-yōm al-waṭani", name: { en: "National Day", najdi: "اليوم الوطني" } },
];
