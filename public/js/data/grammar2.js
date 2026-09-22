// More grammar for A2 (views/grammar.js, after the plan's nine): patterns the plan doesn't teach but a real
// conversation needs. Not from NAJDI-PLAN.md, so every example shows "check with tutor".
// Rows: [Najdi, pronunciation, English, Ukrainian, "to her"?]
const T = (en, uk, najdi, msa = najdi) => ({ en, uk, najdi, msa });
const rows = list => list.map(([ar, say, en, uk, her]) => ({ ar, say, en, uk, her: Boolean(her), check: true }));

export const GRAMMAR_A2 = [
  {
    id: "10",
    title: T("He's tall, she's tall", "Він високий, вона висока", "هو طويل، هي طويلة", "المذكر والمؤنث في الصفات"),
    intro: T(
      "Describing words take -a (ة) for a woman or a feminine thing: حلو ḥilu → حلوة ḥilwa. For several people add -īn: تعبان → تعبانين. About her, always -a: انتي حلوة.",
      "Слова-описи додають -a (ة) для жінки чи слова жіночого роду: حلو ḥilu → حلوة ḥilwa. Для кількох людей додай -īn: تعبان → تعبانين. Про неї — завжди -a: انتي حلوة.",
      "الصفة تاخذ ـة للبنت أو للشي المؤنث: حلو ← حلوة. وللجماعة ـين: تعبان ← تعبانين. ولها دايم ـة: انتي حلوة.",
      "تلحق الصفةَ تاءُ التأنيث للمؤنث: حلو ← حلوة، وللجمع «ـين»: تعبان ← تعبانين. وفي خطابها دائمًا بالتاء: انتي حلوة."),
    rows: rows([
      ["هو طويل", "hu ṭawīl", "he's tall", "він високий"],
      ["هي طويلة", "hi ṭawīla", "she's tall", "вона висока"],
      ["انتي حلوة", "inti ḥilwa", "you're beautiful (to her)", "ти гарна (до неї)", true],
      ["البيت كبير", "al-bēt kbīr", "the house is big", "дім великий"],
      ["السيارة كبيرة", "as-sayyāra kbīra", "the car is big", "машина велика"],
      ["أنا مبسوط، وهي مبسوطة", "ana mabsūṭ, w hi mabsūṭa", "I'm happy, and she's happy", "я щасливий, і вона щаслива"],
      ["هم تعبانين", "hum taʿbānīn", "they're tired", "вони втомлені"],
    ]),
  },
  {
    id: "11",
    title: T("One, two, many", "Один, два, багато", "واحد، ثنين، واجد", "المفرد والمثنى والجمع"),
    intro: T(
      "Two of something: add -ēn — يومين, ساعتين, سيارتين. Many: some words add -āt (سيارات, كلمات), others change inside (بيت → بيوت, ولد → عيال). Learn the plural with the word.",
      "Двоє чогось: додай -ēn — يومين، ساعتين، سيارتين. Багато: одні слова додають -āt (سيارات، كلمات), інші змінюються всередині (بيت → بيوت، ولد → عيال). Учи множину разом зі словом.",
      "للثنين زيد ـين: يومين، ساعتين، سيارتين. وللجمع: كلمات تاخذ ـات (سيارات)، وكلمات تتغيّر من داخل (بيت ← بيوت، ولد ← عيال). احفظ الجمع مع الكلمة.",
      "للمثنى تُزاد «ـين»: يومين، ساعتين. وللجمع: بعض الكلمات تُجمع بالألف والتاء (سيارات)، وبعضها جمع تكسير (بيت ← بيوت). احفظ الجمع مع الكلمة."),
    rows: rows([
      ["يوم → يومين", "yōm → yōmēn", "a day → two days", "день → два дні"],
      ["ساعة → ساعتين", "sāʿa → sāʿtēn", "an hour → two hours", "година → дві години"],
      ["سيارة → سيارات", "sayyāra → sayyārāt", "a car → cars", "машина → машини"],
      ["بيت → بيوت", "bēt → biyūt", "a house → houses", "дім → будинки"],
      ["ولد → عيال", "walad → ʿiyāl", "a boy → kids", "хлопчик → діти"],
      ["بنت → بنات", "bint → banāt", "a girl → girls", "дівчина → дівчата"],
      ["ثلاث سيارات", "thalāth sayyārāt", "three cars", "три машини"],
      ["عندك خوات؟", "ʿindik khawāt?", "do you have sisters? (to her)", "у тебе є сестри? (до неї)", true],
    ]),
  },
  {
    id: "12",
    title: T("Bigger, the most", "Більший, найбільший", "أكبر، أحلى", "التفضيل"),
    intro: T(
      "To compare, describing words take the shape a__a_: كبير → أكبر (bigger), حلو → أحلى (nicer), زين → أزين (better). “Than” is من. Before a noun it means “the most”: أحلى بنت — the most beautiful girl.",
      "Щоб порівняти, слова-описи мають форму a__a_: كبير → أكبر (більший), حلو → أحلى (гарніший), زين → أزين (кращий). «Ніж» — من. Перед іменником — «най-»: أحلى بنت — найгарніша дівчина.",
      "للمقارنة الصفة تصير على وزن أفعل: كبير ← أكبر، حلو ← أحلى، زين ← أزين. و«من» بعدها. وإذا جات قبل الاسم معناها «الأكثر»: أحلى بنت.",
      "للتفضيل تأتي الصفة على وزن «أفعل»: كبير ← أكبر، حلو ← أحلى. ويليها «من». وقبل الاسم تفيد الأعلى: أحلى بنت."),
    rows: rows([
      ["كبير → أكبر", "kbīr → akbar", "big → bigger", "великий → більший"],
      ["حلو → أحلى", "ḥilu → aḥla", "nice → nicer", "гарний → гарніший"],
      ["الرياض أكبر من حفر الباطن", "ar-riyāẓ akbar min Ḥafar al-Bāṭin", "Riyadh is bigger than Hafar al-Batin", "Ер-Ріяд більший за Хафр-ель-Батін"],
      ["الشتا أبرد من الصيف", "ash-shita abrad min aṣ-ṣēf", "winter is colder than summer", "зима холодніша за літо"],
      ["انتي أحلى بنت بالدنيا", "inti aḥla bint bid-dinya", "you're the most beautiful girl in the world (to her)", "ти найгарніша дівчина у світі (до неї)", true],
      ["أكثر شي أحبه", "akthar shay aḥibbah", "the thing I love most", "те, що я люблю найбільше"],
      ["أحسن", "aḥsan", "better, the best", "кращий, найкращий"],
    ]),
  },
  {
    id: "13",
    title: T("Mine, yours: حق", "Моє, твоє: حق", "حقي وحقك", "الملكية بـ«حق»"),
    intro: T(
      "Najdi often says whose something is with حق (ḥagg): الجوال حقي — the phone is mine. It takes the endings: حقي, حقك, حقها. With a feminine thing it's حقت: السيارة حقت أبوي.",
      "У наджді часто кажуть, чиє щось, через حق (ḥagg): الجوال حقي — телефон мій. Він бере закінчення: حقي، حقك، حقها. Зі словом жіночого роду — حقت: السيارة حقت أبوي.",
      "بالنجدي نقول لمين الشي بـ«حق»: الجوال حقي. وتاخذ النهايات: حقي، حقك، حقها. والشي المؤنث حقت: السيارة حقت أبوي.",
      "تُستعمل في النجدية «حقّ» للملكية: الجوال حقّي. وتتصل بها الضمائر: حقّي، حقّك، حقّها. ومع المؤنث «حقّت»: السيارة حقّت أبوي."),
    rows: rows([
      ["هذا حقي", "hādha ḥaggi", "this is mine", "це моє"],
      ["حقك ولا حقها؟", "ḥaggak walla ḥaggaha?", "yours or hers?", "твоє чи її?"],
      ["الجوال حقي", "al-jawwāl ḥaggi", "the phone is mine", "телефон мій"],
      ["السيارة حقت أبوي", "as-sayyāra ḥaggat abūy", "the car is my dad's", "машина — мого тата"],
      ["هذي حقتك", "hādhi ḥaggatik", "this one is yours (to her, a feminine thing)", "ця — твоя (до неї)", true],
    ]),
  },
  {
    id: "14",
    title: T("Must, can, there's time", "Треба, можу, встигну", "لازم، أقدر، يمديك", "الوجوب والقدرة والإمكان"),
    intro: T(
      "لازم + verb = must: لازم أروح (I have to go). أقدر + verb = I can. يمدي / يمديك = there's time, you can make it (very Najdi): يمديك تجين؟ ممكن = maybe; could I…?",
      "لازم + дієслово = треба: لازم أروح (мені треба йти). أقدر + дієслово = можу. يمدي / يمديك = є час, встигнеш (дуже наджді): يمديك تجين؟ ممكن = можливо; можна…?",
      "لازم + فعل: لازم أروح. أقدر + فعل: أقدر أجي. يمدي أو يمديك يعني فيه وقت وتلحق: يمديك تجين؟ وممكن: يمكن، أو «تسمح لي؟».",
      "«لازم» + فعل للوجوب، و«أقدر» + فعل للقدرة، و«يمدي/يمديك» أي يتّسع الوقت (نجدية): يمديك تجين؟ و«ممكن» للاحتمال أو الاستئذان."),
    rows: rows([
      ["لازم أروح الحين", "lāzim arūḥ al-ḥīn", "I have to go now", "мені треба йти зараз"],
      ["لازم تاكلين", "lāzim tākilīn", "you have to eat (to her)", "тобі треба поїсти (до неї)", true],
      ["أقدر أكلمك بكرة", "agdar akallmik bukra", "I can call you tomorrow", "я можу подзвонити тобі завтра"],
      ["ما أقدر اليوم", "ma agdar al-yōm", "I can't today", "сьогодні не можу"],
      ["يمديك تجين الساعة سبع؟", "yimdīk tjīn as-sāʿa sabʿ?", "can you make it by seven? (to her)", "встигнеш прийти о сьомій? (до неї)", true],
      ["ما يمدي، الوقت متأخر", "ma yimdi, al-wagt mitʾakhkhir", "there's no time, it's late", "не встигнемо, вже пізно"],
      ["ممكن سؤال؟", "mumkin suʾāl?", "can I ask something?", "можна питання?"],
    ]),
  },
  {
    id: "15",
    title: T("Was, used to: كان", "Був, колись: كان", "كان وكنت", "«كان» والماضي المستمر"),
    intro: T(
      "كان = was. With a present verb after it, it means “used to” or “was …ing”: كنت أشتغل — I used to work, I was working. Its forms: كنت, كنتي (to her), كان, كانت, كنا, كانوا.",
      "كان = був. З дієсловом теперішнього часу після нього — «колись робив» або «саме робив»: كنت أشتغل — я колись працював, я саме працював. Форми: كنت، كنتي (до неї)، كان، كانت، كنا، كانوا.",
      "كان يعني «كان» مثل ما هي. وإذا جا بعدها فعل مضارع معناها كنت أسويه زمان أو كنت أسويه ذاك الوقت: كنت أشتغل. وصيغها: كنت، كنتي، كان، كانت، كنا، كانوا.",
      "«كان» للماضي، وإذا تلاها مضارع دلّت على العادة أو الاستمرار في الماضي: كنت أشتغل. وصيغها: كنت، كنتِ، كان، كانت، كنّا، كانوا."),
    rows: rows([
      ["كنت تعبان", "kint taʿbān", "I was tired", "я був утомлений"],
      ["كنتي نايمة؟", "kinti nāyma?", "were you asleep? (to her)", "ти спала? (до неї)", true],
      ["كان الجو حلو", "kān al-jaww ḥilu", "the weather was nice", "погода була гарна"],
      ["كنت أدرس في الجامعة", "kint adris fi l-jāmʿa", "I used to study at university", "колись я вчився в університеті"],
      ["زمان كنا نروح البر كل جمعة", "zamān kinna nrūḥ al-barr kill jumʿa", "we used to go to the desert every Friday", "колись ми щоп'ятниці їздили в пустелю"],
      ["كانت تضحك", "kānat tiẓḥak", "she was laughing", "вона сміялася"],
    ]),
  },
  {
    id: "16",
    title: T("If: إذا and لو", "Якщо: إذا і لو", "إذا ولو", "الشرط: إذا ولو"),
    intro: T(
      "إذا = if (something that can happen): إذا فاضية، نتكلم — if you're free, let's talk. لو = if (a wish, or not real): لو أقدر، كان جيتك — if I could, I'd come to you. لو سمحت = please.",
      "إذا = якщо (те, що може статися): إذا فاضية، نتكلم — якщо ти вільна, поговорімо. لو = якби (мрія або нереальне): لو أقدر، كان جيتك — якби міг, приїхав би до тебе. لو سمحت = будь ласка.",
      "إذا للشي اللي يمكن يصير: إذا فاضية نتكلم. ولو للتمني أو الشي اللي ما صار: لو أقدر كان جيتك. ولو سمحت يعني من فضلك.",
      "«إذا» للشرط الممكن: إذا فاضية نتكلم. و«لو» للتمنّي أو الممتنع: لو أقدر كان جيتك. و«لو سمحت» بمعنى من فضلك."),
    rows: rows([
      ["إذا فاضية، نتكلم", "idha fāẓya, nitkallam", "if you're free, let's talk (to her)", "якщо ти вільна, поговорімо (до неї)", true],
      ["إذا نزل مطر، ما بنطلع", "idha nizal maṭar, ma bniṭlaʿ", "if it rains, we won't go out", "якщо піде дощ, ми нікуди не підемо"],
      ["إذا تبين، بجيك بكرة", "idha tibīn, bajīk bukra", "if you want, I'll come to you tomorrow (to her)", "якщо хочеш, завтра приїду до тебе (до неї)", true],
      ["لو أقدر، كان جيتك اليوم", "law agdar, kān jītik al-yōm", "if I could, I'd come to you today", "якби я міг, приїхав би до тебе сьогодні"],
      ["لو سمحت", "law samaḥt", "please (to a man)", "будь ласка (до чоловіка)"],
      ["لو سمحتي", "law samaḥti", "please (to her)", "будь ласка (до неї)", true],
    ]),
  },
  {
    id: "17",
    title: T("The one who: اللي", "Який, що: اللي", "اللي", "الاسم الموصول «اللي»"),
    intro: T(
      "اللي joins two ideas, like “who / which / that”: البنت اللي أحبها — the girl (that) I love. It never changes: اللي for everyone and everything. وش اللي صار؟ — what happened?",
      "اللي з'єднує дві думки, як «який / що»: البنت اللي أحبها — дівчина, яку я кохаю. Воно не змінюється: اللي для всіх і всього. وش اللي صار؟ — що сталося?",
      "اللي تربط كلامين، مثل: البنت اللي أحبها. وما تتغيّر أبد: اللي للكل. ووش اللي صار؟",
      "«اللي» اسم موصول عامّي يربط جملتين: البنت اللي أحبها. ولا يتغيّر بحسب الجنس أو العدد."),
    rows: rows([
      ["البنت اللي أحبها", "al-bint illi aḥibbha", "the girl I love", "дівчина, яку я кохаю"],
      ["الكتاب اللي قريته", "al-ktāb illi garētah", "the book I read", "книжка, яку я прочитав"],
      ["الناس اللي في الصورة", "an-nās illi fi ṣ-ṣūra", "the people in the photo", "люди на фото"],
      ["وش اللي صار؟", "wesh illi ṣār?", "what happened?", "що сталося?"],
      ["اللي تبينه", "illi tibīnah", "whatever you want (to her)", "що захочеш (до неї)", true],
      ["هذا اللي قلت لك عنه", "hādha lli gilt lik ʿannah", "this is the one I told you about (to her)", "це те, про що я тобі казав (до неї)", true],
    ]),
  },
];
