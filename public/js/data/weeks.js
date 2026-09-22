// One lesson per week, from week 3 (the end of the Script weeks) to week 67. Each week: the topic(s) from the plan's
// word tables (vocab.json topic ids), a grammar lesson (data/grammar.js), a speaking task for its stage, and — where
// written — a short conversation. The conversations are NOT from the plan: every line shows "check with tutor"
// until Dima confirms it (✎ on the line), and their Arabic is built from the plan's own words.

// [topic id, number of weeks] in teaching order; null = a review week. A topic over several weeks is split evenly.
const SCHEDULE = [
  // Stage 1 · weeks 3–10
  [["1.3"], 1, "1"], [["1.1", "1.2"], 1, "2"], [["1.4"], 1, "3"], [["1.5"], 1, "8"], [["1.6"], 2, ["4", "7"]], [null, 1, "6"], [null, 1, "9"],
  // Stage 2 · weeks 11–21
  [["2.1"], 1, "5"], [["2.2"], 1, "6"], [["2.3"], 1, "4"], [["2.4"], 1, "2"], [["2.5"], 1, "3"], [["2.6"], 1, "9"], [["2.7"], 1, "5"], [["7"], 1, "7"],
  [null, 1, "8"], [null, 1, "6"], [null, 1, "5"],
  // Stage 3 · weeks 22–36
  [["3.1"], 2, ["4", "1"]], [["3.2"], 1, "2"], [["3.3"], 1, "7"], [["3.4"], 1, "6"],
  // talking about yourself and her world: countries and languages, jobs, free time, animals and nature, how young Saudis talk (NAJDI-WORDS.md)
  [["4.21"], 1, "5"], [["4.19"], 1, "9"], [["4.20"], 1, "3"], [["4.18"], 1, "8"], [["4.22"], 1, "4"], [null, 1, "2"], [null, 1, "7"], [null, 1, "6"], [null, 1, "5"], [null, 1, "1"],
  // Stage 4 · weeks 37–53
  [["4.1"], 3, ["5", "5", "9"]], [["4.2"], 2, ["4", "6"]], [["4.3"], 2, ["7", "3"]], [["4.4"], 2, ["9", "8"]], [["4.5"], 1, "4"], [["4.6"], 1, "6"], [["4.7"], 1, "2"],
  [["4.8"], 1, "5"], [["4.9"], 2, ["8", "6"]], [["4.10"], 1, "4"], [["4.11"], 1, "3"],
  // Stage 5 · weeks 54–67
  [["4.12"], 1, "2"], [["4.13"], 2, ["8", "7"]], [["4.14"], 1, "3"], [["4.15"], 2, ["1", "5"]], [["4.16"], 1, "9"], [["4.17"], 2, ["2", "6"]],
  [null, 1, "5"], [null, 1, "4"], [null, 1, "7"], [null, 1, "6"], [null, 1, "9"],
];

// Week number → { week, topics: [{ id, part: [i, n] }], grammar, review }
export const WEEKS = (() => {
  const out = [];
  let week = 3;
  for (const [topics, n, grammar] of SCHEDULE) {
    for (let i = 0; i < n; i++) {
      out.push({
        week: week++,
        topics: topics ? topics.map(id => ({ id, part: n > 1 ? [i, n] : null })) : [],
        grammar: Array.isArray(grammar) ? grammar[i] : grammar,
        review: !topics,
      });
    }
  }
  return out;
})();

// Speaking tasks, by plan stage (PHASES id). Review weeks add the review task.
export const TASKS = {
  "2": [
    { en: "Act out this week's conversation with Dima — then swap parts.", uk: "Розіграй розмову цього тижня з Дімою — потім поміняйтеся ролями.", najdi: "مثّل محادثة هالأسبوع مع ديما — وبعدين بدّلوا الأدوار.", msa: "مثّل محادثة هذا الأسبوع مع ديما، ثم تبادلا الأدوار." },
    { en: "Every day: one good-morning, one good-night and one question to her in Arabic.", uk: "Щодня: одне «доброго ранку», одне «на добраніч» і одне питання до неї арабською.", najdi: "كل يوم: صباح الخير، وتصبحين على خير، وسؤال واحد لها بالعربي.", msa: "كل يوم: تحية صباح وتحية مساء وسؤال واحد لها بالعربية." },
  ],
  "3": [
    { en: "Send her a voice note about your day using three of this week's words.", uk: "Надішли їй голосове про свій день, використавши три слова цього тижня.", najdi: "أرسل لها فويس عن يومك، واستخدم ثلاث كلمات من كلمات هالأسبوع.", msa: "أرسل إليها رسالة صوتية عن يومك مستخدمًا ثلاث كلمات من كلمات هذا الأسبوع." },
    { en: "Ask her to correct one thing per conversation — not everything.", uk: "Попроси її виправляти одну річ за розмову — не все.", najdi: "اطلب منها تصحّح لك شي واحد بكل سالفة — مو كل شي.", msa: "اطلب منها أن تصحّح لك أمرًا واحدًا في كل محادثة، لا كلّ شيء." },
  ],
  "4": [
    { en: "A 10-minute call mostly in Arabic — English only as a rescue.", uk: "10-хвилинна розмова переважно арабською — англійська лише на крайній випадок.", najdi: "مكالمة عشر دقايق أغلبها بالعربي — والإنجليزي بس إذا علقت.", msa: "مكالمة مدّتها عشر دقائق معظمها بالعربية، والإنجليزية للضرورة فقط." },
    { en: "Shadow one of her voice notes: repeat it out loud until you sound like her.", uk: "Повторюй за одним її голосовим уголос, доки не звучатимеш як вона.", najdi: "عيد وحدة من فويساتها بصوت عالي لين تطلع مثلها.", msa: "كرّر إحدى رسائلها الصوتية بصوت مرتفع حتى يشبه نطقك نطقها." },
  ],
  "5": [
    { en: "Tell her a story about your week, in the past tense.", uk: "Розкажи їй історію про свій тиждень у минулому часі.", najdi: "علّمها سالفة عن أسبوعك بالماضي.", msa: "احكِ لها قصة عن أسبوعك بصيغة الماضي." },
    { en: "Ask her for one word a day — any word she'd use.", uk: "Проси в неї одне слово на день — будь-яке, яке вона вживає.", najdi: "اطلب منها كلمة كل يوم — أي كلمة تقولها هي.", msa: "اطلب منها كلمةً كل يوم، أيّ كلمة تستعملها." },
  ],
  "6": [
    { en: "A 30-minute call in Arabic.", uk: "30-хвилинна розмова арабською.", najdi: "مكالمة نص ساعة بالعربي.", msa: "مكالمة مدّتها نصف ساعة بالعربية." },
    { en: "Joke, disagree or explain a feeling — in Arabic.", uk: "Пожартуй, не погодься або поясни почуття — арабською.", najdi: "اضحك معها، أو اختلف معها، أو اشرح شعورك — بالعربي.", msa: "امزح، أو اختلف في الرأي، أو اشرح شعورًا — بالعربية." },
  ],
  review: { en: "Review week: go through every card due, and write each of this stage's hardest words by hand three times.", uk: "Тиждень повторення: пройди всі картки на сьогодні й напиши від руки тричі кожне найважче слово цього етапу.", najdi: "أسبوع مراجعة: راجع كل الكروت، واكتب بيدك أصعب كلمات هالمرحلة ثلاث مرات.", msa: "أسبوع مراجعة: راجع جميع البطاقات المستحقّة، واكتب بيدك أصعب كلمات هذه المرحلة ثلاث مرات." },
};

// Conversations: you (Volodymyr) and her (Dima). Lines addressed to her use the "to her" forms.
const L = (who, ar, say, en, uk, msa) => ({ who, ar, say, en, uk, msa });
export const DIALOGUES = {
  3: [
    L("you", "السلام عليكم", "as-salāmu ʿalēkum", "Hello.", "Привіт.", "السلام عليكم."),
    L("her", "وعليكم السلام، هلا والله!", "wa ʿalēkum as-salām, hala wallah!", "Hello — hi!!", "Привіт-привіт!", "وعليكم السلام، أهلًا وسهلًا!"),
    L("you", "كيفك؟", "kēfik?", "How are you?", "Як ти?", "كيف حالكِ؟"),
    L("her", "الحمد لله بخير. وانت؟", "al-ḥamdu lillāh bikhēr. w int?", "Fine, thank God. And you?", "Добре, слава Богу. А ти?", "بخير والحمد لله. وأنت؟"),
    L("you", "الحمد لله.", "al-ḥamdu lillāh.", "Good, thank God.", "Добре, слава Богу.", "الحمد لله."),
    L("you", "مع السلامة", "maʿ as-salāma", "Bye.", "Бувай.", "مع السلامة."),
    L("her", "في أمان الله", "fi amān allah", "Bye, take care.", "Бувай, бережи себе.", "في أمان الله."),
  ],
  4: [
    L("you", "شلونك؟", "shlōnik?", "How are you?", "Як ти?", "كيف حالكِ؟"),
    L("her", "زين، الحمد لله. شخبارك؟", "zēn, al-ḥamdu lillāh. shakhbārak?", "Good, thank God. What's new with you?", "Добре, слава Богу. Що в тебе нового?", "بخير والحمد لله. ما أخبارك؟"),
    L("you", "تمام. وين انتي الحين؟", "tamām. wēn inti al-ḥīn?", "All good. Where are you now?", "Усе добре. Де ти зараз?", "كلّ شيء على ما يرام. أين أنتِ الآن؟"),
    L("her", "بالبيت.", "bil-bēt.", "At home.", "Вдома.", "في البيت."),
    L("you", "صدق؟ وأنا بعد!", "ṣidg? w ana baʿad!", "Really? Me too!", "Справді? Я теж!", "حقًّا؟ وأنا أيضًا!"),
  ],
  5: [
    L("you", "وش تسوين اليوم؟", "wesh tsawwīn al-yōm?", "What are you doing today?", "Що ти робиш сьогодні?", "ماذا تفعلين اليوم؟"),
    L("her", "أشتغل لين العصر.", "ashtaghil lēn al-ʿaṣr.", "I'm working until the afternoon.", "Працюю до пообіддя.", "أعمل حتى العصر."),
    L("you", "وبعدين؟", "w baʿdēn?", "And after that?", "А потім?", "وبعد ذلك؟"),
    L("her", "بعدين بالبيت.", "baʿdēn bil-bēt.", "Then I'm at home.", "Потім удома.", "بعد ذلك في البيت."),
    L("you", "زين، أكلمك الليلة؟", "zēn, akallimik al-lēla?", "OK — shall I call you tonight?", "Добре, подзвонити тобі ввечері?", "حسنًا، هل أتصل بكِ الليلة؟"),
    L("her", "إن شاء الله.", "in shāʾ allah.", "Hopefully — yes.", "Якщо Бог дасть — так.", "إن شاء الله."),
  ],
  6: [
    L("you", "وش فيك؟", "wesh fīk?", "What's wrong?", "Що з тобою?", "ما بكِ؟"),
    L("her", "ما فيه شي، بس تعبانة شوي.", "ma fīh shay, bass taʿbāna shwayy.", "Nothing — just a little tired.", "Нічого, просто трохи втомилася.", "لا شيء، أنا متعبة قليلًا فقط."),
    L("you", "معليش. ترى أنا هنا.", "maʿlēsh. tara ana hina.", "I'm sorry. You know I'm here.", "Мені шкода. Знай, я поруч.", "آسف. واعلمي أنني هنا."),
    L("her", "تسلم.", "tislam.", "Thank you.", "Дякую.", "شكرًا لك."),
    L("you", "الله يسلمك.", "allah yisallimik.", "You're welcome.", "Нема за що.", "الله يسلّمكِ."),
  ],
  7: [
    L("you", "تشربين قهوة؟", "tishrabīn gahwa?", "Do you drink coffee?", "Ти п'єш каву?", "هل تشربين القهوة؟"),
    L("her", "إيه، دايم! وانت؟", "ēh, dāyim! w int?", "Yes, always! And you?", "Так, завжди! А ти?", "نعم، دائمًا! وأنت؟"),
    L("you", "أحياناً. وش تبين تاكلين؟", "aḥyānan. wesh tibīn tākilīn?", "Sometimes. What do you want to eat?", "Інколи. Що ти хочеш з'їсти?", "أحيانًا. ماذا تريدين أن تأكلي؟"),
    L("her", "مدري… أي شي.", "madri… ay shay.", "Dunno… anything.", "Не знаю… будь-що.", "لا أدري… أيّ شيء."),
    L("you", "يلا، نروح؟", "yalla, nirūḥ?", "Come on — shall we go?", "Ну що, ходімо?", "هيّا، هل نذهب؟"),
  ],
  8: [
    L("you", "ما فهمت.", "ma fhimt.", "I didn't understand.", "Я не зрозумів.", "لم أفهم."),
    L("you", "تقدرين تقولين مرة ثانية؟", "tigdarīn tgūlīn marra thānya?", "Can you say it again?", "Можеш сказати ще раз?", "هل يمكنكِ أن تقوليها مرةً أخرى؟"),
    L("her", "أكيد. شوي شوي.", "akīd. shwayy shwayy.", "Sure. Slowly.", "Звісно. Повільно.", "بالتأكيد. ببطء."),
    L("you", "الحين فهمت. شكراً!", "al-ḥīn fhimt. shukran!", "Now I get it. Thanks!", "Тепер зрозумів. Дякую!", "الآن فهمت. شكرًا!"),
    L("her", "العفو.", "al-ʿafw.", "You're welcome.", "Нема за що.", "عفوًا."),
  ],
  9: [
    L("you", "وش تسوين الحين؟", "wesh tsawwīn al-ḥīn?", "What are you doing right now?", "Що ти зараз робиш?", "ماذا تفعلين الآن؟"),
    L("her", "قاعدة أدرس.", "gāʿda adris.", "I'm studying.", "Я саме вчуся.", "أنا أدرس الآن."),
    L("you", "زين، بكلمك بعدين.", "zēn, bakallimik baʿdēn.", "OK, I'll call you later.", "Добре, я подзвоню тобі пізніше.", "حسنًا، سأتصل بكِ لاحقًا."),
    L("her", "إيه، الليلة.", "ēh, al-lēla.", "Yes — tonight.", "Так, увечері.", "نعم، الليلة."),
    L("you", "ودي أشوفك.", "widdi ashūfik.", "I'd love to see you.", "Я так хочу тебе побачити.", "أودّ أن أراكِ."),
  ],
  10: [
    L("you", "صباح الخير!", "ṣabāḥ al-khēr!", "Good morning!", "Доброго ранку!", "صباح الخير!"),
    L("her", "صباح النور. توك صحيت؟", "ṣabāḥ an-nūr. tawwak ṣiḥēt?", "Good morning. Did you just wake up?", "Доброго ранку. Ти щойно прокинувся?", "صباح النور. هل استيقظتَ للتوّ؟"),
    L("you", "إيه، توني صحيت. وانتي؟", "ēh, tawwni ṣiḥēt. w inti?", "Yes, I just woke up. And you?", "Так, щойно прокинувся. А ти?", "نعم، استيقظتُ للتوّ. وأنتِ؟"),
    L("her", "صحيت الصبح، بس ما بعد أكلت.", "ṣiḥēt aṣ-ṣubḥ, bass ma baʿad akalt.", "I woke up early, but I haven't eaten yet.", "Я прокинулася зранку, але ще не їла.", "استيقظتُ صباحًا، لكنني لم آكل بعد."),
    L("you", "عادي، وأنا بعد.", "ʿādi, w ana baʿad.", "That's fine — same here.", "Нічого, я теж.", "لا بأس، وأنا كذلك."),
  ],
  11: [
    L("you", "كيفك اليوم؟", "kēfik al-yōm?", "How are you today?", "Як ти сьогодні?", "كيف حالكِ اليوم؟"),
    L("her", "تعبانة شوي… ونعسانة.", "taʿbāna shwayy… w naʿsāna.", "A bit tired… and sleepy.", "Трохи втомлена… і сонна.", "متعبة قليلًا… وناعسة."),
    L("you", "ليش؟", "lēsh?", "Why?", "Чому?", "لماذا؟"),
    L("her", "الشغل. وانت؟", "ash-shughl. w int?", "Work. And you?", "Робота. А ти?", "العمل. وأنت؟"),
    L("you", "أنا مبسوط، بس مشتاق لك.", "ana mabsūṭ, bass mishtāg lik.", "I'm happy — but I miss you.", "Я щасливий, але сумую за тобою.", "أنا سعيد، لكنني مشتاق إليكِ."),
  ],
  12: [
    L("you", "أكلتي؟", "akalti?", "Have you eaten?", "Ти їла?", "هل أكلتِ؟"),
    L("her", "لا، ما بعد. جوعانة!", "la, ma baʿad. jūʿāna!", "No, not yet. I'm hungry!", "Ні, ще ні. Я голодна!", "لا، ليس بعد. أنا جائعة!"),
    L("you", "وش تبين تاكلين؟", "wesh tibīn tākilīn?", "What do you want to eat?", "Що ти хочеш з'їсти?", "ماذا تريدين أن تأكلي؟"),
    L("her", "كبسة! وانت؟", "kabsa! w int?", "Kabsa! And you?", "Кабсу! А ти?", "الكبسة! وأنت؟"),
    L("you", "أنا أبي قهوة وتمر.", "ana abi gahwa w tamr.", "I want coffee and dates.", "Я хочу кави та фініків.", "أريد قهوةً وتمرًا."),
    L("her", "لذيذ!", "ladhīdh!", "Delicious!", "Смачно!", "لذيذ!"),
  ],
  13: [
    L("her", "وينك؟", "wēnak?", "Where are you?", "Де ти?", "أين أنت؟"),
    L("you", "بالبيت. توني رجعت من الشغل.", "bil-bēt. tawwni rjaʿt min ash-shughl.", "At home. I just got back from work.", "Удома. Щойно повернувся з роботи.", "في البيت. عدتُ للتوّ من العمل."),
    L("her", "أرسلت لك فويس.", "arsalt lak fōys.", "I sent you a voice note.", "Я надіслала тобі голосове.", "أرسلتُ إليك رسالةً صوتية."),
    L("you", "زين، بسمعه الحين.", "zēn, basmaʿah al-ḥīn.", "OK, I'll listen to it now.", "Добре, зараз послухаю.", "حسنًا، سأستمع إليها الآن."),
    L("her", "وأرسل لي صورة!", "w arsil li ṣūra!", "And send me a photo!", "І надішли мені фото!", "وأرسل لي صورة!"),
  ],
  14: [
    L("her", "كيف أهلك؟", "kēf ahlak?", "How's your family?", "Як твоя родина?", "كيف حال أهلك؟"),
    L("you", "الحمد لله، بخير. أمي تسلم عليك.", "al-ḥamdu lillāh, bikhēr. ummi tsallim ʿalēk.", "Fine, thank God. My mom says hi.", "Добре, слава Богу. Мама передає тобі привіт.", "بخير والحمد لله. أمي تسلّم عليكِ."),
    L("her", "الله يسلمها! وأبوك؟", "allah ysallimha! w abūk?", "Say hi back! And your dad?", "Їй теж привіт! А тато?", "سلّمها الله! ووالدك؟"),
    L("you", "بخير. وأخوي بعد.", "bikhēr. w akhūy baʿad.", "Fine. My brother too.", "Добре. Брат теж.", "بخير. وأخي أيضًا."),
  ],
  15: [
    L("you", "شوفي هالصورة!", "shūfi haṣ-ṣūra!", "Look at this photo!", "Подивись на це фото!", "انظري إلى هذه الصورة!"),
    L("her", "ما شاء الله، حلوة مرة!", "mā shāʾ allah, ḥilwa marra!", "Wow — really pretty!", "Ого, дуже гарне!", "ما شاء الله، جميلة جدًّا!"),
    L("you", "البيت قديم، بس كبير.", "al-bēt gadīm, bass kbīr.", "The house is old, but big.", "Будинок старий, але великий.", "البيت قديم، لكنه كبير."),
    L("her", "وقريب من الشغل؟", "w garīb min ash-shughl?", "And is it near work?", "А він близько до роботи?", "وهل هو قريب من العمل؟"),
    L("you", "لا، بعيد شوي.", "la, baʿīd shwayy.", "No, a bit far.", "Ні, трохи далеко.", "لا، بعيد قليلًا."),
  ],
  16: [
    L("her", "متى ترجع؟", "mita tirjaʿ?", "When are you coming back?", "Коли ти повернешся?", "متى تعود؟"),
    L("you", "بعد ثلاثة أيام.", "baʿad thalātha ayyām.", "In three days.", "Через три дні.", "بعد ثلاثة أيام."),
    L("her", "الساعة كم؟", "as-sāʿa kam?", "What time?", "О котрій?", "في أيّ ساعة؟"),
    L("you", "الساعة خمسة العصر.", "as-sāʿa khamsa al-ʿaṣr.", "At five in the afternoon.", "О п'ятій по обіді.", "في الساعة الخامسة عصرًا."),
    L("her", "زين، أنتظرك!", "zēn, antiẓrak!", "OK, I'll wait for you!", "Добре, чекаю на тебе!", "حسنًا، سأنتظرك!"),
  ],
  17: [
    L("her", "وش الجو بأوكرانيا؟", "wesh al-jaw b-ukrānya?", "What's the weather like in Ukraine?", "Яка погода в Україні?", "كيف الطقس في أوكرانيا؟"),
    L("you", "برد! فيه ثلج.", "bard! fīh thalj.", "Cold! There's snow.", "Холодно! Лежить сніг.", "بارد! يوجد ثلج."),
    L("her", "صدق؟ هنا حر.", "ṣidg? hina ḥarr.", "Really? It's hot here.", "Справді? Тут спекотно.", "حقًّا؟ الجوّ هنا حارّ."),
    L("you", "ودي أشوف الرياض.", "widdi ashūf ar-riyāḍ.", "I'd love to see Riyadh.", "Я б дуже хотів побачити Ер-Ріяд.", "أودّ أن أرى الرياض."),
    L("her", "إن شاء الله قريب!", "in shāʾ allah garīb!", "Hopefully soon!", "Дасть Бог, скоро!", "إن شاء الله قريبًا!"),
  ],
  18: [
    L("you", "كل عام وانتي بخير!", "kill ʿām w inti bkhēr!", "Happy Eid! (to her)", "Зі святом! (до неї)", "كلّ عام وأنتِ بخير!"),
    L("her", "وانت بخير!", "w int bkhēr!", "And to you!", "І тебе!", "وأنت بخير!"),
    L("you", "عيدك مبارك.", "ʿīdik mbārak.", "Blessed Eid to you.", "Благословенного тобі свята.", "عيدكِ مبارك."),
    L("her", "الله يبارك فيك.", "allah ybārik fīk.", "God bless you too.", "Нехай Бог благословить і тебе.", "بارك الله فيك."),
  ],
  22: [
    L("you", "نمتي زين؟", "nimti zēn?", "Did you sleep well?", "Ти добре спала?", "هل نمتِ جيدًا؟"),
    L("her", "إيه، الحمد لله. توني صحيت.", "ēh, al-ḥamdu lillāh. tawwni ṣiḥēt.", "Yes, thank God. I just woke up.", "Так, слава Богу. Щойно прокинулася.", "نعم، الحمد لله. استيقظتُ للتوّ."),
    L("you", "فاضية الحين؟", "fāẓya al-ḥīn?", "Are you free now?", "Ти зараз вільна?", "هل أنتِ متفرّغة الآن؟"),
    L("her", "لحظة… دقيقة وأرجع.", "laḥẓa… dagīga w arjaʿ.", "One moment… one minute, I'll be back.", "Хвилинку… зараз повернуся.", "لحظة… دقيقة وأعود."),
  ],
  23: [
    L("you", "كيف كان يومك؟", "kēf kān yōmik?", "How was your day?", "Як минув твій день?", "كيف كان يومكِ؟"),
    L("her", "زين، بس كنت بالدوام لين الليل.", "zēn, bass kint bid-dawām lēn al-lēl.", "Good — but I was at work until night.", "Добре, але я була на роботі до ночі.", "جيد، لكنني كنتُ في العمل حتى الليل."),
    L("you", "الله يعطيك العافية.", "allah yiʿṭīk al-ʿāfya.", "God give you strength.", "Хай Бог дасть тобі сил.", "أعطاكِ الله العافية."),
    L("her", "الله يعافيك. وانت، وش صار؟", "allah yʿāfīk. w int, wesh ṣār?", "And you. What's new with you?", "І тобі. А в тебе що сталося?", "عافاك الله. وأنت، ماذا حدث؟"),
    L("you", "ولا شي، عادي.", "wala shay, ʿādi.", "Nothing — the usual.", "Нічого, як завжди.", "لا شيء، كالمعتاد."),
  ],
  24: [
    L("you", "اشتقت لك.", "ishtagt lik.", "I missed you.", "Я скучив за тобою.", "اشتقتُ إليكِ."),
    L("her", "وأنا بعد.", "w ana baʿad.", "Me too.", "Я теж.", "وأنا أيضًا."),
    L("you", "أحبك يا قلبي.", "aḥibbik ya galbi.", "I love you, my heart.", "Я кохаю тебе, серденько.", "أحبّكِ يا قلبي."),
    L("her", "فديتك.", "fidētak.", "Sweetheart.", "Мій любий.", "فديتُك."),
    L("you", "الله يحفظك.", "allah yiḥfaẓik.", "God keep you safe.", "Бережи тебе Бог.", "حفظكِ الله."),
  ],
  25: [
    L("you", "شوي شوي، ما فهمت.", "shwayy shwayy, ma fhimt.", "Slowly, please — I didn't understand.", "Повільніше, будь ласка, я не зрозумів.", "ببطء من فضلك، لم أفهم."),
    L("you", "وش معنى طفشان؟", "wesh maʿna ṭafshān?", "What does ṭafshān mean?", "Що означає ṭafshān?", "ما معنى «طفشان»؟"),
    L("her", "يعني ما عنده شي يسويه.", "yaʿni ma ʿindah shay ysawwīh.", "It means he's got nothing to do — bored.", "Тобто йому нема чого робити — нудно.", "يعني ليس لديه ما يفعله."),
    L("you", "آه! معك حق، أنا طفشان!", "āh! maʿik ḥagg, ana ṭafshān!", "Ah! You're right — I'm bored!", "А! Твоя правда, мені нудно!", "آه! معكِ حق، أنا ضجِر!"),
    L("her", "يا حليلك!", "ya ḥalīlak!", "Aww, how sweet!", "Ой, який ти милий!", "ما ألطفك!"),
  ],
  26: [
    L("you", "متى فاضية؟", "mita fāẓya?", "When are you free?", "Коли ти вільна?", "متى تكونين متفرّغة؟"),
    L("her", "الليلة. نتكلم؟", "al-lēla. nitkallam?", "Tonight. Shall we talk?", "Увечері. Поговоримо?", "الليلة. هل نتحدّث؟"),
    L("you", "يمديك الساعة تسعة؟", "yimdīk as-sāʿa tisʿa?", "Can you manage nine o'clock?", "Встигнеш о дев'ятій?", "هل يناسبكِ الساعة التاسعة؟"),
    L("her", "يصير.", "yṣīr.", "That works.", "Підходить.", "يمكن ذلك."),
    L("you", "بكرة إن شاء الله نطلع؟", "bukra in shāʾ allah niṭlaʿ?", "Shall we go out tomorrow, hopefully?", "Завтра, якщо Бог дасть, кудись підемо?", "هل نخرج غدًا إن شاء الله؟"),
    L("her", "إن شاء الله!", "in shāʾ allah!", "Hopefully!", "Дасть Бог!", "إن شاء الله!"),
  ],
};
