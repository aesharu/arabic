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
    { en: "Act out this week's conversation with Dima — then swap parts.", najdi: "مثّل محادثة هالأسبوع مع ديما — وبعدين بدّلوا الأدوار." },
    { en: "Every day: one good-morning, one good-night and one question to her in Arabic.", najdi: "كل يوم: صباح الخير، وتصبحين على خير، وسؤال واحد لها بالعربي." },
  ],
  "3": [
    { en: "Send her a voice note about your day using three of this week's words.", najdi: "أرسل لها فويس عن يومك، واستخدم ثلاث كلمات من كلمات هالأسبوع." },
    { en: "Ask her to correct one thing per conversation — not everything.", najdi: "اطلب منها تصحّح لك شي واحد بكل سالفة — مو كل شي." },
  ],
  "4": [
    { en: "A 10-minute call mostly in Arabic — English only as a rescue.", najdi: "مكالمة عشر دقايق أغلبها بالعربي — والإنجليزي بس إذا علقت." },
    { en: "Shadow one of her voice notes: repeat it out loud until you sound like her.", najdi: "عيد وحدة من فويساتها بصوت عالي لين تطلع مثلها." },
  ],
  "5": [
    { en: "Tell her a story about your week, in the past tense.", najdi: "علّمها سالفة عن أسبوعك بالماضي." },
    { en: "Ask her for one word a day — any word she'd use.", najdi: "اطلب منها كلمة كل يوم — أي كلمة تقولها هي." },
  ],
  "6": [
    { en: "A 30-minute call in Arabic.", najdi: "مكالمة نص ساعة بالعربي." },
    { en: "Joke, disagree or explain a feeling — in Arabic.", najdi: "اضحك معها، أو اختلف معها، أو اشرح شعورك — بالعربي." },
  ],
  review: { en: "Review week: go through every card due, and write each of this stage's hardest words by hand three times.", najdi: "أسبوع مراجعة: راجع كل الكروت، واكتب بيدك أصعب كلمات هالمرحلة ثلاث مرات." },
};

// Conversations: you (Volodymyr) and her (Dima). Lines addressed to her use the "to her" forms.
const L = (who, ar, say, en) => ({ who, ar, say, en });
export const DIALOGUES = {
  3: [
    L("you", "السلام عليكم", "as-salāmu ʿalēkum", "Hello."),
    L("her", "وعليكم السلام، هلا والله!", "wa ʿalēkum as-salām, hala wallah!", "Hello — hi!!"),
    L("you", "كيفك؟", "kēfik?", "How are you?"),
    L("her", "الحمد لله بخير. وانت؟", "al-ḥamdu lillāh bikhēr. w int?", "Fine, thank God. And you?"),
    L("you", "الحمد لله.", "al-ḥamdu lillāh.", "Good, thank God."),
    L("you", "مع السلامة", "maʿ as-salāma", "Bye."),
    L("her", "في أمان الله", "fi amān allah", "Bye, take care."),
  ],
  4: [
    L("you", "شلونك؟", "shlōnik?", "How are you?"),
    L("her", "زين، الحمد لله. شخبارك؟", "zēn, al-ḥamdu lillāh. shakhbārak?", "Good, thank God. What's new with you?"),
    L("you", "تمام. وين انتي الحين؟", "tamām. wēn inti al-ḥīn?", "All good. Where are you now?"),
    L("her", "بالبيت.", "bil-bēt.", "At home."),
    L("you", "صدق؟ وأنا بعد!", "ṣidg? w ana baʿad!", "Really? Me too!"),
  ],
  5: [
    L("you", "وش تسوين اليوم؟", "wesh tsawwīn al-yōm?", "What are you doing today?"),
    L("her", "أشتغل لين العصر.", "ashtaghil lēn al-ʿaṣr.", "I'm working until the afternoon."),
    L("you", "وبعدين؟", "w baʿdēn?", "And after that?"),
    L("her", "بعدين بالبيت.", "baʿdēn bil-bēt.", "Then I'm at home."),
    L("you", "زين، أكلمك الليلة؟", "zēn, akallimik al-lēla?", "OK — shall I call you tonight?"),
    L("her", "إن شاء الله.", "in shāʾ allah.", "Hopefully — yes."),
  ],
  6: [
    L("you", "وش فيك؟", "wesh fīk?", "What's wrong?"),
    L("her", "ما فيه شي، بس تعبانة شوي.", "ma fīh shay, bass taʿbāna shwayy.", "Nothing — just a little tired."),
    L("you", "معليش. ترى أنا هنا.", "maʿlēsh. tara ana hina.", "I'm sorry. You know I'm here."),
    L("her", "تسلم.", "tislam.", "Thank you."),
    L("you", "الله يسلمك.", "allah yisallimik.", "You're welcome."),
  ],
  7: [
    L("you", "تشربين قهوة؟", "tishrabīn gahwa?", "Do you drink coffee?"),
    L("her", "إيه، دايم! وانت؟", "ēh, dāyim! w int?", "Yes, always! And you?"),
    L("you", "أحياناً. وش تبين تاكلين؟", "aḥyānan. wesh tibīn tākilīn?", "Sometimes. What do you want to eat?"),
    L("her", "مدري… أي شي.", "madri… ay shay.", "Dunno… anything."),
    L("you", "يلا، نروح؟", "yalla, nirūḥ?", "Come on — shall we go?"),
  ],
  8: [
    L("you", "ما فهمت.", "ma fhimt.", "I didn't understand."),
    L("you", "تقدرين تقولين مرة ثانية؟", "tigdarīn tgūlīn marra thānya?", "Can you say it again?"),
    L("her", "أكيد. شوي شوي.", "akīd. shwayy shwayy.", "Sure. Slowly."),
    L("you", "الحين فهمت. شكراً!", "al-ḥīn fhimt. shukran!", "Now I get it. Thanks!"),
    L("her", "العفو.", "al-ʿafw.", "You're welcome."),
  ],
  9: [
    L("you", "وش تسوين الحين؟", "wesh tsawwīn al-ḥīn?", "What are you doing right now?"),
    L("her", "قاعدة أدرس.", "gāʿda adris.", "I'm studying."),
    L("you", "زين، بكلمك بعدين.", "zēn, bakallimik baʿdēn.", "OK, I'll call you later."),
    L("her", "إيه، الليلة.", "ēh, al-lēla.", "Yes — tonight."),
    L("you", "ودي أشوفك.", "widdi ashūfik.", "I'd love to see you."),
  ],
  10: [
    L("you", "صباح الخير!", "ṣabāḥ al-khēr!", "Good morning!"),
    L("her", "صباح النور. توك صحيت؟", "ṣabāḥ an-nūr. tawwak ṣiḥēt?", "Good morning. Did you just wake up?"),
    L("you", "إيه، توني صحيت. وانتي؟", "ēh, tawwni ṣiḥēt. w inti?", "Yes, I just woke up. And you?"),
    L("her", "صحيت الصبح، بس ما بعد أكلت.", "ṣiḥēt aṣ-ṣubḥ, bass ma baʿad akalt.", "I woke up early, but I haven't eaten yet."),
    L("you", "عادي، وأنا بعد.", "ʿādi, w ana baʿad.", "That's fine — same here."),
  ],
  11: [
    L("you", "كيفك اليوم؟", "kēfik al-yōm?", "How are you today?"),
    L("her", "تعبانة شوي… ونعسانة.", "taʿbāna shwayy… w naʿsāna.", "A bit tired… and sleepy."),
    L("you", "ليش؟", "lēsh?", "Why?"),
    L("her", "الشغل. وانت؟", "ash-shughl. w int?", "Work. And you?"),
    L("you", "أنا مبسوط، بس مشتاق لك.", "ana mabsūṭ, bass mishtāg lik.", "I'm happy — but I miss you."),
  ],
  12: [
    L("you", "أكلتي؟", "akalti?", "Have you eaten?"),
    L("her", "لا، ما بعد. جوعانة!", "la, ma baʿad. jūʿāna!", "No, not yet. I'm hungry!"),
    L("you", "وش تبين تاكلين؟", "wesh tibīn tākilīn?", "What do you want to eat?"),
    L("her", "كبسة! وانت؟", "kabsa! w int?", "Kabsa! And you?"),
    L("you", "أنا أبي قهوة وتمر.", "ana abi gahwa w tamr.", "I want coffee and dates."),
    L("her", "لذيذ!", "ladhīdh!", "Delicious!"),
  ],
  13: [
    L("her", "وينك؟", "wēnak?", "Where are you?"),
    L("you", "بالبيت. توني رجعت من الشغل.", "bil-bēt. tawwni rjaʿt min ash-shughl.", "At home. I just got back from work."),
    L("her", "أرسلت لك فويس.", "arsalt lak fōys.", "I sent you a voice note."),
    L("you", "زين، بسمعه الحين.", "zēn, basmaʿah al-ḥīn.", "OK, I'll listen to it now."),
    L("her", "وأرسل لي صورة!", "w arsil li ṣūra!", "And send me a photo!"),
  ],
  14: [
    L("her", "كيف أهلك؟", "kēf ahlak?", "How's your family?"),
    L("you", "الحمد لله، بخير. أمي تسلم عليك.", "al-ḥamdu lillāh, bikhēr. ummi tsallim ʿalēk.", "Fine, thank God. My mom says hi."),
    L("her", "الله يسلمها! وأبوك؟", "allah ysallimha! w abūk?", "Say hi back! And your dad?"),
    L("you", "بخير. وأخوي بعد.", "bikhēr. w akhūy baʿad.", "Fine. My brother too."),
  ],
  15: [
    L("you", "شوفي هالصورة!", "shūfi haṣ-ṣūra!", "Look at this photo!"),
    L("her", "ما شاء الله، حلوة مرة!", "mā shāʾ allah, ḥilwa marra!", "Wow — really pretty!"),
    L("you", "البيت قديم، بس كبير.", "al-bēt gadīm, bass kbīr.", "The house is old, but big."),
    L("her", "وقريب من الشغل؟", "w garīb min ash-shughl?", "And is it near work?"),
    L("you", "لا، بعيد شوي.", "la, baʿīd shwayy.", "No, a bit far."),
  ],
  16: [
    L("her", "متى ترجع؟", "mita tirjaʿ?", "When are you coming back?"),
    L("you", "بعد ثلاثة أيام.", "baʿad thalātha ayyām.", "In three days."),
    L("her", "الساعة كم؟", "as-sāʿa kam?", "What time?"),
    L("you", "الساعة خمسة العصر.", "as-sāʿa khamsa al-ʿaṣr.", "At five in the afternoon."),
    L("her", "زين، أنتظرك!", "zēn, antiẓrak!", "OK, I'll wait for you!"),
  ],
  17: [
    L("her", "وش الجو بأوكرانيا؟", "wesh al-jaw b-ukrānya?", "What's the weather like in Ukraine?"),
    L("you", "برد! فيه ثلج.", "bard! fīh thalj.", "Cold! There's snow."),
    L("her", "صدق؟ هنا حر.", "ṣidg? hina ḥarr.", "Really? It's hot here."),
    L("you", "ودي أشوف الرياض.", "widdi ashūf ar-riyāḍ.", "I'd love to see Riyadh."),
    L("her", "إن شاء الله قريب!", "in shāʾ allah garīb!", "Hopefully soon!"),
  ],
  18: [
    L("you", "كل عام وانتي بخير!", "kill ʿām w inti bkhēr!", "Happy Eid! (to her)"),
    L("her", "وانت بخير!", "w int bkhēr!", "And to you!"),
    L("you", "عيدك مبارك.", "ʿīdik mbārak.", "Blessed Eid to you."),
    L("her", "الله يبارك فيك.", "allah ybārik fīk.", "God bless you too."),
  ],
  22: [
    L("you", "نمتي زين؟", "nimti zēn?", "Did you sleep well?"),
    L("her", "إيه، الحمد لله. توني صحيت.", "ēh, al-ḥamdu lillāh. tawwni ṣiḥēt.", "Yes, thank God. I just woke up."),
    L("you", "فاضية الحين؟", "fāẓya al-ḥīn?", "Are you free now?"),
    L("her", "لحظة… دقيقة وأرجع.", "laḥẓa… dagīga w arjaʿ.", "One moment… one minute, I'll be back."),
  ],
  23: [
    L("you", "كيف كان يومك؟", "kēf kān yōmik?", "How was your day?"),
    L("her", "زين، بس كنت بالدوام لين الليل.", "zēn, bass kint bid-dawām lēn al-lēl.", "Good — but I was at work until night."),
    L("you", "الله يعطيك العافية.", "allah yiʿṭīk al-ʿāfya.", "God give you strength."),
    L("her", "الله يعافيك. وانت، وش صار؟", "allah yʿāfīk. w int, wesh ṣār?", "And you. What's new with you?"),
    L("you", "ولا شي، عادي.", "wala shay, ʿādi.", "Nothing — the usual."),
  ],
  24: [
    L("you", "اشتقت لك.", "ishtagt lik.", "I missed you."),
    L("her", "وأنا بعد.", "w ana baʿad.", "Me too."),
    L("you", "أحبك يا قلبي.", "aḥibbik ya galbi.", "I love you, my heart."),
    L("her", "فديتك.", "fidētak.", "Sweetheart."),
    L("you", "الله يحفظك.", "allah yiḥfaẓik.", "God keep you safe."),
  ],
  25: [
    L("you", "شوي شوي، ما فهمت.", "shwayy shwayy, ma fhimt.", "Slowly, please — I didn't understand."),
    L("you", "وش معنى طفشان؟", "wesh maʿna ṭafshān?", "What does ṭafshān mean?"),
    L("her", "يعني ما عنده شي يسويه.", "yaʿni ma ʿindah shay ysawwīh.", "It means he's got nothing to do — bored."),
    L("you", "آه! معك حق، أنا طفشان!", "āh! maʿik ḥagg, ana ṭafshān!", "Ah! You're right — I'm bored!"),
    L("her", "يا حليلك!", "ya ḥalīlak!", "Aww, how sweet!"),
  ],
  26: [
    L("you", "متى فاضية؟", "mita fāẓya?", "When are you free?"),
    L("her", "الليلة. نتكلم؟", "al-lēla. nitkallam?", "Tonight. Shall we talk?"),
    L("you", "يمديك الساعة تسعة؟", "yimdīk as-sāʿa tisʿa?", "Can you manage nine o'clock?"),
    L("her", "يصير.", "yṣīr.", "That works."),
    L("you", "بكرة إن شاء الله نطلع؟", "bukra in shāʾ allah niṭlaʿ?", "Shall we go out tomorrow, hopefully?"),
    L("her", "إن شاء الله!", "in shāʾ allah!", "Hopefully!"),
  ],
};
