// More grammar for A2 (views/grammar.js, after the plan's nine): patterns the plan doesn't teach but a real
// conversation needs. Not from NAJDI-PLAN.md, so every example shows "check with tutor".
// Rows: [Najdi, pronunciation, English, Ukrainian, "to her"?]
const T = (en, najdi) => ({ en, najdi });
const rows = list => list.map(([ar, say, en, her]) => ({ ar, say, en, her: Boolean(her), check: true }));

export const GRAMMAR_A2 = [
  {
    id: "10",
    title: T("He's tall, she's tall", "هو طويل، هي طويلة"),
    intro: T(
      "Describing words take -a (ة) for a woman or a feminine thing: حلو ḥilu → حلوة ḥilwa. For several people add -īn: تعبان → تعبانين. About her, always -a: انتي حلوة.",
      "الصفة تاخذ ـة للبنت أو للشي المؤنث: حلو ← حلوة. وللجماعة ـين: تعبان ← تعبانين. ولها دايم ـة: انتي حلوة."),
    rows: rows([
      ["هو طويل", "hu ṭawīl", "he's tall"],
      ["هي طويلة", "hi ṭawīla", "she's tall"],
      ["انتي حلوة", "inti ḥilwa", "you're beautiful (to her)", true],
      ["البيت كبير", "al-bēt kbīr", "the house is big"],
      ["السيارة كبيرة", "as-sayyāra kbīra", "the car is big"],
      ["أنا مبسوط، وهي مبسوطة", "ana mabsūṭ, w hi mabsūṭa", "I'm happy, and she's happy"],
      ["هم تعبانين", "hum taʿbānīn", "they're tired"],
    ]),
  },
  {
    id: "11",
    title: T("One, two, many", "واحد، ثنين، كثير"),
    intro: T(
      "Two of something: add -ēn — يومين, ساعتين, سيارتين. Many: some words add -āt (سيارات, كلمات), others change inside (بيت → بيوت, ولد → عيال). Learn the plural with the word.",
      "للثنين زيد ـين: يومين، ساعتين، سيارتين. وللجمع: كلمات تاخذ ـات (سيارات)، وكلمات تتغيّر من داخل (بيت ← بيوت، ولد ← عيال). احفظ الجمع مع الكلمة."),
    rows: rows([
      ["يوم → يومين", "yōm → yōmēn", "a day → two days"],
      ["ساعة → ساعتين", "sāʿa → sāʿtēn", "an hour → two hours"],
      ["سيارة → سيارات", "sayyāra → sayyārāt", "a car → cars"],
      ["بيت → بيوت", "bēt → biyūt", "a house → houses"],
      ["ولد → عيال", "walad → ʿiyāl", "a boy → kids"],
      ["بنت → بنات", "bint → banāt", "a girl → girls"],
      ["ثلاث سيارات", "thalāth sayyārāt", "three cars"],
      ["عندك خوات؟", "ʿindik khawāt?", "do you have sisters? (to her)", true],
    ]),
  },
  {
    id: "12",
    title: T("Bigger, the most", "أكبر، أحلى"),
    intro: T(
      "To compare, describing words take the shape a__a_: كبير → أكبر (bigger), حلو → أحلى (nicer), زين → أزين (better). “Than” is من. Before a noun it means “the most”: أحلى بنت — the most beautiful girl.",
      "للمقارنة الصفة تصير على وزن أفعل: كبير ← أكبر، حلو ← أحلى، زين ← أزين. و«من» بعدها. وإذا جات قبل الاسم معناها «الأكثر»: أحلى بنت."),
    rows: rows([
      ["كبير → أكبر", "kbīr → akbar", "big → bigger"],
      ["حلو → أحلى", "ḥilu → aḥla", "nice → nicer"],
      ["الرياض أكبر من حفر الباطن", "ar-riyāẓ akbar min Ḥafar al-Bāṭin", "Riyadh is bigger than Hafar al-Batin"],
      ["الشتا أبرد من الصيف", "ash-shita abrad min aṣ-ṣēf", "winter is colder than summer"],
      ["انتي أحلى بنت بالدنيا", "inti aḥla bint bid-dinya", "you're the most beautiful girl in the world (to her)", true],
      ["أكثر شي أحبه", "akthar shay aḥibbah", "the thing I love most"],
      ["أحسن", "aḥsan", "better, the best"],
    ]),
  },
  {
    id: "13",
    title: T("Mine, yours: حق", "حقي وحقك"),
    intro: T(
      "Saudis often say whose something is with حق (ḥagg): الجوال حقي — the phone is mine. It takes the endings: حقي, حقك, حقها. With a feminine thing it's حقت: السيارة حقت أبوي.",
      "بالسعودي نقول لمين الشي بـ«حق»: الجوال حقي. وتاخذ النهايات: حقي، حقك، حقها. والشي المؤنث حقت: السيارة حقت أبوي."),
    rows: rows([
      ["هذا حقي", "hādha ḥaggi", "this is mine"],
      ["حقك ولا حقها؟", "ḥaggak walla ḥaggaha?", "yours or hers?"],
      ["الجوال حقي", "al-jawwāl ḥaggi", "the phone is mine"],
      ["السيارة حقت أبوي", "as-sayyāra ḥaggat abūy", "the car is my dad's"],
      ["هذي حقتك", "hādhi ḥaggatik", "this one is yours (to her, a feminine thing)", true],
    ]),
  },
  {
    id: "14",
    title: T("Must, can, there's time", "لازم، أقدر، يمديك"),
    intro: T(
      "لازم + verb = must: لازم أروح (I have to go). أقدر + verb = I can. يمدي / يمديك = there's time, you can make it (very Saudi): يمديك تجين؟ ممكن = maybe; could I…?",
      "لازم + فعل: لازم أروح. أقدر + فعل: أقدر أجي. يمدي أو يمديك يعني فيه وقت وتلحق: يمديك تجين؟ وممكن: يمكن، أو «تسمح لي؟»."),
    rows: rows([
      ["لازم أروح الحين", "lāzim arūḥ al-ḥīn", "I have to go now"],
      ["لازم تاكلين", "lāzim tākilīn", "you have to eat (to her)", true],
      ["أقدر أكلمك بكرة", "agdar akallmik bukra", "I can call you tomorrow"],
      ["ما أقدر اليوم", "ma agdar al-yōm", "I can't today"],
      ["يمديك تجين الساعة سبع؟", "yimdīk tjīn as-sāʿa sabʿ?", "can you make it by seven? (to her)", true],
      ["ما يمدي، الوقت متأخر", "ma yimdi, al-wagt mitʾakhkhir", "there's no time, it's late"],
      ["ممكن سؤال؟", "mumkin suʾāl?", "can I ask something?"],
    ]),
  },
  {
    id: "15",
    title: T("Was, used to: كان", "كان وكنت"),
    intro: T(
      "كان = was. With a present verb after it, it means “used to” or “was …ing”: كنت أشتغل — I used to work, I was working. Its forms: كنت, كنتي (to her), كان, كانت, كنا, كانوا.",
      "كان يعني «كان» مثل ما هي. وإذا جا بعدها فعل مضارع معناها كنت أسويه زمان أو كنت أسويه ذاك الوقت: كنت أشتغل. وصيغها: كنت، كنتي، كان، كانت، كنا، كانوا."),
    rows: rows([
      ["كنت تعبان", "kint taʿbān", "I was tired"],
      ["كنتي نايمة؟", "kinti nāyma?", "were you asleep? (to her)", true],
      ["كان الجو حلو", "kān al-jaww ḥilu", "the weather was nice"],
      ["كنت أدرس في الجامعة", "kint adris fi l-jāmʿa", "I used to study at university"],
      ["زمان كنا نروح البر كل جمعة", "zamān kinna nrūḥ al-barr kill jumʿa", "we used to go to the desert every Friday"],
      ["كانت تضحك", "kānat tiẓḥak", "she was laughing"],
    ]),
  },
  {
    id: "16",
    title: T("If: إذا and لو", "إذا ولو"),
    intro: T(
      "إذا = if (something that can happen): إذا فاضية، نتكلم — if you're free, let's talk. لو = if (a wish, or not real): لو أقدر، كان جيتك — if I could, I'd come to you. لو سمحت = please.",
      "إذا للشي اللي يمكن يصير: إذا فاضية نتكلم. ولو للتمني أو الشي اللي ما صار: لو أقدر كان جيتك. ولو سمحت يعني من فضلك."),
    rows: rows([
      ["إذا فاضية، نتكلم", "idha fāẓya, nitkallam", "if you're free, let's talk (to her)", true],
      ["إذا نزل مطر، ما بنطلع", "idha nizal maṭar, ma bniṭlaʿ", "if it rains, we won't go out"],
      ["إذا تبين، بجيك بكرة", "idha tibīn, bajīk bukra", "if you want, I'll come to you tomorrow (to her)", true],
      ["لو أقدر، كان جيتك اليوم", "law agdar, kān jītik al-yōm", "if I could, I'd come to you today"],
      ["لو سمحت", "law samaḥt", "please (to a man)"],
      ["لو سمحتي", "law samaḥti", "please (to her)", true],
    ]),
  },
  {
    id: "17",
    title: T("The one who: اللي", "اللي"),
    intro: T(
      "اللي joins two ideas, like “who / which / that”: البنت اللي أحبها — the girl (that) I love. It never changes: اللي for everyone and everything. وش اللي صار؟ — what happened?",
      "اللي تربط كلامين، مثل: البنت اللي أحبها. وما تتغيّر أبد: اللي للكل. ووش اللي صار؟"),
    rows: rows([
      ["البنت اللي أحبها", "al-bint illi aḥibbha", "the girl I love"],
      ["الكتاب اللي قريته", "al-ktāb illi garētah", "the book I read"],
      ["الناس اللي في الصورة", "an-nās illi fi ṣ-ṣūra", "the people in the photo"],
      ["وش اللي صار؟", "wesh illi ṣār?", "what happened?"],
      ["اللي تبينه", "illi tibīnah", "whatever you want (to her)", true],
      ["هذا اللي قلت لك عنه", "hādha lli gilt lik ʿannah", "this is the one I told you about (to her)", true],
    ]),
  },
];
