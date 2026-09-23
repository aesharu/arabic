// The grammar that turns single sentences into talk — the B1 set (views/grammar.js, after the plan's nine and
// the A2 twelve). This is what CEFR B1 asks for and the earlier stages don't teach: what you did it to, passing
// on what someone said, giving a reason, saying where things stand right now, and joining two times together.
// Not from NAJDI-PLAN.md, so every example shows "check with tutor".
// Rows: [Saudi, pronunciation, English, "to her"?]
const T = (en, najdi) => ({ en, najdi });
const rows = list => list.map(([ar, say, en, her]) => ({ ar, say, en, her: Boolean(her), check: true }));

export const GRAMMAR_B1 = [
  {
    id: "18",
    title: T("Him, her, you — on the end of the verb", "ـه، ـها، ـك في آخر الفعل"),
    intro: T(
      "What you did it to hangs on the end of the verb: شفت shift (I saw) → شفته shifta (I saw him), شفتها shiftha (her), شفتك shiftik (you — to her). “To me” is لي: قال لي gāl li — he told me. And عطني aʿṭni — give me.",
      "اللي سويت له الفعل يلتصق بآخره: شفت ← شفته، شفتها، شفتك. و«لي» للمتكلم: قال لي. و«عطني» يعني أعطني."),
    rows: rows([
      ["شفته أمس", "shifta ams", "I saw him yesterday"],
      ["شفتها بالسوق", "shiftha bis-sūg", "I saw her at the market"],
      ["شفتك بالستوري", "shiftik bis-stōri", "I saw you in your story", true],
      ["قال لي إنه تعبان", "gāl li innah taʿbān", "he told me he's tired"],
      ["عطني رقمك", "aʿṭni ragmik", "give me your number", true],
      ["كلميني لما تفضين", "kallimīni lamma tifẓīn", "call me when you're free", true],
      ["ودّيني معك", "waddīni maʿik", "take me with you", true],
    ]),
  },
  {
    id: "19",
    title: T("He said that… — passing it on", "قال إن… — تنقل الكلام"),
    intro: T(
      "To pass on what someone said, put إن inn after the verb: قال إنه تعبان — he said (that) he's tired. قالت لي إنها بتجي — she told me she's coming. For a yes/no question use إذا: سألني إذا أنا فاضي.",
      "عشان تنقل كلام أحد، حط «إن» بعد الفعل: قال إنه تعبان. وقالت لي إنها بتجي. وللسؤال بنعم/لا استخدم «إذا»: سألني إذا أنا فاضي."),
    rows: rows([
      ["قال إنه تعبان", "gāl innah taʿbān", "he said he's tired"],
      ["قالت إنها بالبيت", "gālat innaha bil-bēt", "she said she's at home"],
      ["قلت لك إني بجي", "gilt lik inni baji", "I told you I'm coming", true],
      ["سألني إذا أنا فاضي", "saʾalni idha ana fāẓi", "he asked me if I'm free"],
      ["قالت لي إنها اشتاقت", "gālat li innaha shtāgat", "she told me she misses me"],
      ["وش قال؟", "wesh gāl?", "what did he say?"],
    ]),
  },
  {
    id: "20",
    title: T("Because, that's why, even though", "لأن، عشان كذا، مع إن"),
    intro: T(
      "عشان ʿashān and لأن liʾann both mean “because” — عشان is the one you'll hear most. عشان كذا = that's why. مع إن maʿ inn = even though. بس bass and لكن lākin = but. These are what make an answer a sentence instead of a word.",
      "«عشان» و«لأن» معناها because — و«عشان» أكثر وحدة تسمعها. و«عشان كذا» = that's why. و«مع إن» = even though. و«بس» و«لكن» = but. هذي اللي تخلي جوابك جملة مو كلمة."),
    rows: rows([
      ["ما جيت عشان كنت تعبان", "ma jīt ʿashān kint taʿbān", "I didn't come because I was tired"],
      ["أتعلم عربي عشانك", "atʿallam ʿarabi ʿashānik", "I'm learning Arabic because of you", true],
      ["عشان كذا ما رديت", "ʿashān kidha ma raddēt", "that's why I didn't answer"],
      ["مع إني تعبان، بجي", "maʿ inni taʿbān, baji", "even though I'm tired, I'll come"],
      ["أبي أجي بس ما أقدر", "abi aji bass ma agdar", "I want to come but I can't"],
      ["الجو حار لكن حلو", "al-jaww ḥārr lākin ḥilw", "the weather's hot but nice"],
    ]),
  },
  {
    id: "21",
    title: T("رايح، قاعد، ناسي — where things stand", "رايح، قاعد، ناسي — وضعك الحين"),
    intro: T(
      "These look like describing words, but they say where things stand right now: رايح rāyiḥ = on my way, جاي jāy = coming, قاعد gāʿid = sitting, staying — and also “-ing”: قاعد أذاكر. ساكن sākin = living. ناسي nāsi = I've forgotten. For a woman add ـة: رايحة، ناسية.",
      "تشبه الصفات، بس تقول وضعك الحين: رايح، جاي، قاعد (وبعد تعني -ing: قاعد أذاكر)، ساكن، ناسي. وللبنت زيد ـة: رايحة، ناسية."),
    rows: rows([
      ["أنا رايح الحين", "ana rāyiḥ al-ḥīn", "I'm on my way now"],
      ["انتي جاية؟", "inti jāya?", "are you coming?", true],
      ["قاعد أذاكر عربي", "gāʿid adhākir ʿarabi", "I'm studying Arabic (right now)"],
      ["ساكن في كييف", "sākin fi kyīv", "I live in Kyiv"],
      ["ناسي اسمه", "nāsi ismah", "I've forgotten his name"],
      ["هي ناسية موعدها", "hi nāsya mawʿidha", "she's forgotten her appointment"],
    ]),
  },
  {
    id: "22",
    title: T("صار، للحين، بعدني — it turned, and it still is", "صار، للحين، بعدني"),
    intro: T(
      "صار ṣār = became, or happened: صار الجو بارد. It also counts time you've been at something: صار لي ساعة أنتظرك — I've been waiting for you an hour. للحين lil-ḥīn = still, until now. بعدني baʿadni = I'm still…",
      "«صار» يعني تغيّر أو حصل: صار الجو بارد. وبعد تحسب الوقت: صار لي ساعة أنتظرك. و«للحين» يعني لين هاللحظة. و«بعدني» يعني لسا أنا."),
    rows: rows([
      ["صار الجو بارد", "ṣār al-jaww bārid", "the weather's turned cold"],
      ["صار لي ساعة أنتظرك", "ṣār li sāʿa antaẓrik", "I've been waiting for you an hour", true],
      ["وش صار؟", "wesh ṣār?", "what happened?"],
      ["للحين ما كليت", "lil-ḥīn ma kalēt", "I still haven't eaten"],
      ["بعدني بالشغل", "baʿadni bish-shughul", "I'm still at work"],
      ["صرت تتكلم عربي!", "ṣirt titkallam ʿarabi!", "you've started speaking Arabic!"],
    ]),
  },
  {
    id: "23",
    title: T("The name of the doing", "اسم الفعل: السباحة، القراية"),
    intro: T(
      "Where English says “-ing”, Arabic often uses the name of the action: أحب السباحة — I like swimming. القراية ممتعة — reading is fun. After قبل and بعد you can use it directly, or add ما and a verb: قبل الأكل / قبل ما آكل.",
      "مكان الـ-ing بالإنجليزي، العربي كثير يستخدم اسم الفعل: أحب السباحة. والقراية ممتعة. وبعد «قبل» و«بعد» إما اسم الفعل أو «ما» + فعل: قبل الأكل / قبل ما آكل."),
    rows: rows([
      ["أحب السباحة", "aḥibb as-sibāḥa", "I like swimming"],
      ["تحبين القراية؟", "tḥibbīn al-grāya?", "do you like reading?", true],
      ["قبل الأكل", "gabl al-akil", "before eating"],
      ["قبل ما آكل، أغسل يدي", "gabl ma ākil, aghassil yadi", "before I eat, I wash my hands"],
      ["السفر غالي", "as-safar ghāli", "travelling is expensive"],
      ["المذاكرة كل يوم أحسن", "al-mudhākara kill yōm aḥsan", "studying every day is better"],
    ]),
  },
  {
    id: "24",
    title: T("It got broken — when nobody did it", "انكسر — لما ما فيه فاعل"),
    intro: T(
      "For something that happened by itself, put ان in- on the front: كسر kisar (he broke) → انكسر inkisar (it got broken). فتح → انفتح. سرق → انسرق. Saudi also uses تـ: تسوّى tsawwa — it's been taken care of.",
      "للشي اللي صار من نفسه، زيد «ان» بالأول: كسر ← انكسر. فتح ← انفتح. سرق ← انسرق. وبالسعودي بعد «تـ»: تسوّى."),
    rows: rows([
      ["انكسر الكاس", "inkisar al-kās", "the glass got broken"],
      ["انفتح الباب", "infitaḥ al-bāb", "the door opened"],
      ["جوالي انسرق", "jawwāli nsirag", "my phone got stolen"],
      ["لا تخافين، ما انكسر شي", "la tkhāfīn, ma nkisar shay", "don't worry, nothing got broken", true],
      ["خلاص، تسوّى", "khalāṣ, tsawwa", "done — it's been taken care of"],
      ["الحجز انلغى", "al-ḥajz inligha", "the booking got cancelled"],
    ]),
  },
  {
    id: "25",
    title: T("Telling it in order", "ترتيب السالفة"),
    intro: T(
      "A story needs signposts: أول شي awwal shay (first), وبعدين w baʿdēn (and then), فجأة fajʾa (suddenly), المهم al-muhimm (anyway — the point is), آخر شي ākhir shay (in the end), يعني yaʿni (I mean). Saudis use المهم constantly to get back to the point.",
      "السالفة تبي علامات: أول شي، وبعدين، فجأة، المهم، آخر شي، يعني. والسعوديين يستخدمون «المهم» كثير عشان يرجعون للموضوع."),
    rows: rows([
      ["أول شي صحيت بدري", "awwal shay ṣiḥēt badri", "first I woke up early"],
      ["وبعدين طلعت", "w baʿdēn ṭilaʿt", "and then I went out"],
      ["فجأة طاح جوالي", "fajʾa ṭāḥ jawwāli", "suddenly my phone fell"],
      ["المهم، وش سويتي انتي؟", "al-muhimm, wesh sawwēti inti?", "anyway — what did you do?", true],
      ["آخر شي رجعت البيت", "ākhir shay rijaʿt al-bēt", "in the end I went home"],
      ["يعني ما كان يوم حلو", "yaʿni ma kān yōm ḥilw", "I mean, it wasn't a good day"],
    ]),
  },
  {
    id: "26",
    title: T("Asking nicely", "الطلب بأدب"),
    intro: T(
      "Softening a request is half of politeness: ممكن mumkin (could I / could you), لو سمحتي law samaḥti (please — to her), إذا ما عليك أمر idha ma ʿalēk amr (if you don't mind — very Saudi), تكفين tikfīn (I'm begging you), كان ودي kān widdi (I'd have liked to).",
      "تلطيف الطلب نص الأدب: ممكن، لو سمحتي، إذا ما عليك أمر، تكفين، كان ودي."),
    rows: rows([
      ["ممكن تساعدينني؟", "mumkin tsāʿdīnni?", "could you help me?", true],
      ["لو سمحتي، عيدي الكلمة", "law samaḥti, ʿīdi l-kalima", "please, say the word again", true],
      ["إذا ما عليك أمر، أرسلي اللوكيشن", "idha ma ʿalēk amr, arsili l-lokēshin", "if you don't mind, send the location", true],
      ["تكفين لا تزعلين", "tikfīn la tizʿalīn", "please don't be upset", true],
      ["كان ودي أجي", "kān widdi aji", "I'd have liked to come"],
      ["ممكن سؤال؟", "mumkin suʾāl?", "could I ask something?"],
    ]),
  },
  {
    id: "27",
    title: T("I wish, I should have", "يا ليت، كان لازم"),
    intro: T(
      "يا ليت ya lēt = I wish: يا ليتني عندك. كان لازم kān lāzim = I should have: كان لازم أقول لك. المفروض al-mafrūẓ = it was supposed to: المفروض نتكلم أمس. ندمت nidamt = I regretted it.",
      "«يا ليت» = I wish: يا ليتني عندك. و«كان لازم» = I should have. و«المفروض» = it was supposed to. و«ندمت» = I regretted."),
    rows: rows([
      ["يا ليتني عندك", "ya lētni ʿindik", "I wish I were with you", true],
      ["يا ليت الوقت يمر بسرعة", "ya lēt al-wagt ymurr bsurʿa", "I wish time would go faster"],
      ["كان لازم أقول لك", "kān lāzim agūl lik", "I should have told you", true],
      ["المفروض نتكلم أمس", "al-mafrūẓ nitkallam ams", "we were supposed to talk yesterday"],
      ["ندمت إني ما رحت", "nidamt inni ma riḥt", "I regret not going"],
    ]),
  },
  {
    id: "28",
    title: T("How much: مرة، شوي، أبد", "المقدار: مرة، شوي، أبد"),
    intro: T(
      "Saudi measures things with مرة marra (very — literally “a time”), شوي shwayy (a bit), بزيادة bziyāda (too much), أبد abad and نهائي nihāʾi (not at all). مرة comes after the word, not before: حلو مرة — really nice.",
      "السعودي يقيس بـ«مرة» (very) و«شوي» (a bit) و«بزيادة» (too much) و«أبد» و«نهائي» (not at all). و«مرة» تجي بعد الكلمة مو قبلها: حلو مرة."),
    rows: rows([
      ["حلو مرة", "ḥilw marra", "really nice"],
      ["تعبان شوي", "taʿbān shwayy", "a bit tired"],
      ["حار بزيادة", "ḥārr bziyāda", "too hot"],
      ["ما أعرف أبد", "ma aʿrif abad", "I don't know at all"],
      ["ما شفته نهائي", "ma shifta nihāʾi", "I haven't seen him at all"],
      ["أحبك مرة", "aḥibbik marra", "I love you so much", true],
    ]),
  },
  {
    id: "29",
    title: T("Before, after, until, as soon as", "قبل ما، بعد ما، لين، أول ما"),
    intro: T(
      "Joining two times: قبل ما gabl ma (before), بعد ما baʿad ma (after), لين lēn (until), من min (ever since), أول ما awwal ma (as soon as). Each one takes a whole sentence after it, not just a word.",
      "ربط وقتين: «قبل ما»، «بعد ما»، «لين»، «من»، «أول ما». وكل وحدة ياخذ بعدها جملة كاملة مو كلمة."),
    rows: rows([
      ["قبل ما أنام، أذاكر", "gabl ma anām, adhākir", "before I sleep, I study"],
      ["بعد ما خلصت، كلمتك", "baʿad ma khallaṣt, kallamtik", "after I finished, I called you", true],
      ["انتظري لين أرجع", "intaẓri lēn arjaʿ", "wait until I come back", true],
      ["من شفتك وأنا مبسوط", "min shiftik w ana mabsūṭ", "ever since I saw you I've been happy", true],
      ["أول ما توصلين، كلميني", "awwal ma tūṣalīn, kallimīni", "as soon as you arrive, call me", true],
    ]),
  },
];
