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
  [null, 1, "5"], [null, 1, "9"], [null, 1, "3"], [null, 1, "8"], [null, 1, "4"], [null, 1, "2"], [null, 1, "7"], [null, 1, "6"], [null, 1, "5"], [null, 1, "1"],
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
    { en: "Ask her to correct one thing per conversation — not everything.", uk: "Попроси її виправляти одну річ за розмову — не все.", najdi: "اطلب منها تصحّح لك شي واحد بكل سالفة — مب كل شي.", msa: "اطلب منها أن تصحّح لك أمرًا واحدًا في كل محادثة، لا كلّ شيء." },
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
    L("you", "وش لونك؟", "wesh lōnik?", "How are you?", "Як ти?", "كيف حالكِ؟"),
    L("her", "زين، الحمد لله. وش أخبارك؟", "zēn, al-ḥamdu lillāh. wesh akhbārik?", "Good, thank God. What's new with you?", "Добре, слава Богу. Що в тебе нового?", "بخير والحمد لله. ما أخبارك؟"),
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
    L("her", "صباح النور. توك صحيت؟", "ṣabāḥ an-nūr. tawwik ṣiḥēt?", "Good morning. Did you just wake up?", "Доброго ранку. Ти щойно прокинувся?", "صباح النور. هل استيقظتَ للتوّ؟"),
    L("you", "إيه، توني صحيت. وانتي؟", "ēh, tawwni ṣiḥēt. w inti?", "Yes, I just woke up. And you?", "Так, щойно прокинувся. А ти?", "نعم، استيقظتُ للتوّ. وأنتِ؟"),
    L("her", "صحيت الصبح، بس ما بعد أكلت.", "ṣiḥēt aṣ-ṣubḥ, bass ma baʿad akalt.", "I woke up early, but I haven't eaten yet.", "Я прокинулася зранку, але ще не їла.", "استيقظتُ صباحًا، لكنني لم آكل بعد."),
    L("you", "عادي، وأنا بعد.", "ʿādi, w ana baʿad.", "That's fine — same here.", "Нічого, я теж.", "لا بأس، وأنا كذلك."),
  ],
};
