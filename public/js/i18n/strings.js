// Every interface text, in English and Ukrainian side by side. tests/i18n.test.mjs fails if either is missing.
// {name} is filled in by t(key, { name }). Counted words ({ one, few, many, other }) go through tu().
// A few strings contain simple HTML (<b>, <a>) — they are ours, never user input.
export const STRINGS = {
  // Sidebar
  "nav.plan": { en: "Plan", uk: "План" },
  "nav.today": { en: "Today", uk: "Сьогодні" },
  "nav.calendar": { en: "Calendar", uk: "Календар" },
  "nav.thePlan": { en: "The plan", uk: "План навчання" },
  "nav.script": { en: "Script", uk: "Письмо" },
  "nav.letters": { en: "Letters", uk: "Літери" },
  "nav.vowels": { en: "Vowels", uk: "Голосні" },
  "nav.reading": { en: "Reading", uk: "Читання" },
  "nav.quiz": { en: "Quiz", uk: "Тест" },
  "nav.speak": { en: "Speak", uk: "Говоріння" },
  "nav.phrases": { en: "Phrases", uk: "Фрази" },
  "nav.main": { en: "Main", uk: "Головне меню" },
  "lang.label": { en: "Language", uk: "Мова" },
  "theme.label": { en: "Theme: {name}", uk: "Тема: {name}" },
  "theme.auto": { en: "auto", uk: "авто" },
  "theme.light": { en: "light", uk: "світла" },
  "theme.dark": { en: "dark", uk: "темна" },
  "pill.soon": { en: "Starts soon", uk: "Скоро старт" },

  // Shared
  "day.n": { en: "Day {n}", uk: "День {n}" },
  "day.of": { en: "of {total}", uk: "з {total}" },
  "week.n": { en: "week {n}", uk: "тиждень {n}" },
  "min": { en: "{n} min", uk: "{n} хв" },
  "open": { en: "Open", uk: "Відкрити" },
  "unit.days": { en: { one: "day", other: "days" }, uk: { one: "день", few: "дні", many: "днів", other: "дня" } },
  "unit.hours": { en: { one: "hour", other: "hours" }, uk: { one: "година", few: "години", many: "годин", other: "години" } },
  "flag.label": { en: "check with tutor", uk: "перевірити з викладачем" },
  "flag.default": { en: "Not yet verified as Najdi — ask a native speaker.", uk: "Ще не перевірено, що це саме наджді, — спитай носія мови." },
  "lab.msa": { en: "Formal (MSA)", uk: "Формальна (MSA)" },
  "lab.msaHint": { en: "recognise it, don't say it", uk: "впізнавай, але не кажи" },
  "lab.ua": { en: "UA", uk: "Укр." },
  "lab.najdi": { en: "Najdi:", uk: "Наджді:" },
  "lab.hear": { en: "Hear {what}", uk: "Почути {what}" },
  "review.note": {
    en: "Najdi words and phrases come from NAJDI-PLAN.md. The formal Arabic (MSA) and Ukrainian lines were added by Claude — if anything looks wrong, please tell Volodia.",
    uk: "Слова й фрази наджді взято з NAJDI-PLAN.md. Рядки формальною арабською (MSA) та українською додав Claude — попроси її перевірити їх.",
  },
  "status.done": { en: "Done", uk: "Виконано" },
  "status.partial": { en: "Started", uk: "Розпочато" },
  "status.missed": { en: "Missed", uk: "Пропущено" },
  "status.open": { en: "Today — not started yet", uk: "Сьогодні — ще не почато" },
  "status.future": { en: "Coming up", uk: "Попереду" },

  // Today
  "today.title": { en: "Today", uk: "Сьогодні" },
  "today.notStarted": { en: "Not started yet", uk: "Ще не почалося" },
  "today.day1Is": { en: "Day 1 is {date}.", uk: "День 1 — {date}." },
  "today.focus": { en: "Today's focus", uk: "Фокус на сьогодні" },
  "today.doneOf": { en: "{done} of {total} done · about {min} min", uk: "виконано {done} з {total} · приблизно {min} хв" },
  "today.openGroup": { en: "Open letter group {n}", uk: "Відкрити групу літер {n}" },
  "today.everyWeek": { en: "Every week", uk: "Щотижня" },
  "today.newPhrases": { en: "Today's new phrases", uk: "Нові фрази на сьогодні" },
  "today.phraseReview": { en: "Phrase review", uk: "Повторення фраз" },
  "today.allPhrases": { en: "All phrases", uk: "Усі фрази" },
  "today.studyTime": { en: "Study time", uk: "Час навчання" },
  "today.logged": { en: "logged today · goal {goal}+ min", uk: "записано сьогодні · мета {goal}+ хв" },
  "today.running": { en: "Running — {min} min already logged today", uk: "Відлік іде — сьогодні вже записано {min} хв" },
  "today.start": { en: "Start timer", uk: "Запустити таймер" },
  "today.stop": { en: "Stop and log time", uk: "Зупинити й записати час" },
  "today.adjust": { en: "Adjust minutes by hand", uk: "Змінити хвилини вручну" },
  "today.journey": { en: "Your journey", uk: "Твій шлях" },
  "today.streak": { en: "Streak", uk: "Серія" },
  "today.studied": { en: "Studied", uk: "Навчання" },
  "today.total": { en: "Total", uk: "Усього" },
  "today.toGo": { en: "To go", uk: "Залишилось" },
  "today.finish": { en: "Day {n} of {total} — finish line {date}", uk: "День {n} з {total} — фініш {date}" },
  "today.yesterday": { en: "Studied yesterday? Log it:", uk: "Учора теж було заняття? Запиши:" },

  // Calendar
  "cal.title": { en: "Calendar", uk: "Календар" },
  "cal.sub": {
    en: "Day 1 is {start}. The finish line is {goal}. Click any day to see its plan or log time you forgot to record.",
    uk: "День 1 — {start}. Фініш — {goal}. Натисни на будь-який день, щоб побачити план або дописати забутий час.",
  },
  "cal.legend": { en: "Legend", uk: "Умовні позначення" },
  "cal.legendDone": { en: "Done (all tasks or {min}+ min)", uk: "Виконано (усі завдання або {min}+ хв)" },
  "cal.week": { en: "Week {n}", uk: "Тиждень {n}" },
  "cal.logged": { en: "<b>{min} min</b> logged", uk: "записано <b>{min} хв</b>" },
  "cal.adjust": { en: "Adjust minutes", uk: "Змінити хвилини" },
  "cal.openToday": { en: "Open today's page", uk: "Відкрити сторінку «Сьогодні»" },
  "cal.data": { en: "Your data", uk: "Твої дані" },
  "cal.dataHint": {
    en: "Progress is saved only in this browser. Download a backup now and then — clearing browser data would erase it.",
    uk: "Прогрес зберігається лише в цьому браузері. Час від часу завантажуй резервну копію — очищення даних браузера його зітре.",
  },
  "cal.download": { en: "Download backup", uk: "Завантажити копію" },
  "cal.restore": { en: "Restore from backup", uk: "Відновити з копії" },
  "cal.restored": { en: "Backup restored.", uk: "Копію відновлено." },
  "cal.badFile": { en: "This doesn't look like a Najdi backup file.", uk: "Це не схоже на файл резервної копії Najdi." },

  // Plan
  "plan.title": { en: "The plan", uk: "План навчання" },
  "plan.sub": {
    en: "Talk with one person, in her dialect, about everyday life. Not movies, not news, not formal Arabic — Riyadh Najdi, spoken.",
    uk: "Говорити з однією людиною її діалектом про повсякденне життя. Не фільми, не новини, не формальна арабська — розмовна наджді Ер-Ріяда.",
  },
  "plan.eyebrow": { en: "{start} → {goal} · 1–2 hours a day", uk: "{start} → {goal} · 1–2 години на день" },
  "plan.method": { en: "The method in one sentence", uk: "Метод одним реченням" },
  "plan.methodText": {
    en: "Learn words <b>inside sentences</b>, speak <b>from week 3</b>, and let <b>her voice notes</b> be your main listening.",
    uk: "Вчи слова <b>всередині речень</b>, говори <b>з 3-го тижня</b>, а <b>її голосові</b> хай будуть головним аудіюванням.",
  },
  "plan.chunks": {
    en: "Memorised chunks first — you learn {phrase} as one piece, like a word. Grammar comes later to explain what you already say.",
    uk: "Спершу завчені блоки — ти вчиш {phrase} цілком, як одне слово. Граматика прийде пізніше й пояснить те, що ти вже кажеш.",
  },
  "plan.words": { en: "How many words, honestly", uk: "Скільки слів — чесно" },
  "plan.w150": {
    en: "<b>~150 words + ~50 fixed phrases</b> — greet her, ask how she is, say what you're doing, survive a voice note.",
    uk: "<b>~150 слів + ~50 сталих фраз</b> — привітатися з нею, спитати, як вона, сказати, що ти робиш, пережити голосове.",
  },
  "plan.w500": {
    en: "<b>~500 words</b> — real daily conversation about your day, food, plans, feelings, family. Slow, with gaps, but real.",
    uk: "<b>~500 слів</b> — справжня щоденна розмова про твій день, їжу, плани, почуття, родину. Повільно, з прогалинами, але по-справжньому.",
  },
  "plan.w1000": {
    en: "<b>~1000 words</b> — comfortable. You follow her normal-speed voice notes on familiar topics and tell stories about your week.",
    uk: "<b>~1000 слів</b> — комфортно. Ти розумієш її голосові в звичайному темпі на знайомі теми й розповідаєш про свій тиждень.",
  },
  "plan.here": { en: "You are here", uk: "Ти тут" },
  "plan.meta": { en: "{when} · {start} – {end} · words: {words}", uk: "{when} · {start} – {end} · слів: {words}" },
  "plan.canDo": { en: "You can… {text}", uk: "Ти зможеш… {text}" },
  "plan.dayInStage": { en: "Day {n} of {len} in this stage", uk: "День {n} з {len} на цьому етапі" },
  "plan.normalDay": { en: "A normal day — 90 minutes", uk: "Звичайний день — 90 хвилин" },
  "plan.normalDayHint": {
    en: "From week 3. The two Script weeks are planned day by day instead — see <a href=\"#/today\">Today</a> and the <a href=\"#/calendar\">Calendar</a>.",
    uk: "З 3-го тижня. Два тижні письма сплановані по днях — див. <a href=\"#/today\">Сьогодні</a> і <a href=\"#/calendar\">Календар</a>.",
  },
  "plan.normalWeek": { en: "A normal week", uk: "Звичайний тиждень" },
  "plan.help": { en: "How she can help — without becoming your teacher", uk: "Як вона може допомогти — не стаючи твоєю вчителькою" },
  "plan.help1": {
    en: "Ask for <b>voice notes, not text.</b> Najdi is barely written; text quietly teaches formal spellings and hides pronunciation.",
    uk: "Проси <b>голосові, а не текст.</b> Наджді майже не пишуть; текст непомітно привчає до формального письма й ховає вимову.",
  },
  "plan.help2": {
    en: "Ask her for <b>one word a day</b> — any word she'd use. These become Stages 4–5.",
    uk: "Проси в неї <b>одне слово на день</b> — будь-яке, яке вона сама вживає. З них складуться етапи 4–5.",
  },
  "plan.help3": { en: "Ask her to correct <b>one thing per conversation</b>, not everything.", uk: "Проси виправляти <b>одну річ за розмову</b>, а не все підряд." },
  "plan.help4": { en: "The tutor handles grammar and drills. She's for real life.", uk: "Граматика й вправи — це до викладача. Вона — для справжнього життя." },
  "plan.source": { en: "Source: NAJDI-PLAN.md, Parts 2–3.", uk: "Джерело: NAJDI-PLAN.md, частини 2–3." },

  // Letters
  "letters.title": { en: "Letters", uk: "Літери" },
  "letters.sub": {
    en: "28 letters in 12 days, learned by shape rather than alphabet order. Click a big letter to hear its name, or a word to hear it said.",
    uk: "28 літер за 12 днів — за формою, а не за абеткою. Натисни на велику літеру, щоб почути її назву, або на слово — щоб почути, як воно звучить.",
  },
  "letters.groups": { en: "Letter groups", uk: "Групи літер" },
  "letters.days": { en: "Days {days}", uk: "Дні {days}" },
  "letters.today": { en: "today", uk: "сьогодні" },
  "letters.doneMark": { en: "done", uk: "виконано" },
  "letters.hearName": { en: "Hear the name {name}", uk: "Почути назву {name}" },
  "letters.newSound": { en: "new sound", uk: "новий звук" },
  "letters.nonJoining": { en: "never joins forward", uk: "не з'єднується з наступною" },
  "letters.markDone": { en: "Mark days {days} done", uk: "Позначити дні {days} як виконані" },
  "letters.isDone": { en: "Days {days} done ✓", uk: "Дні {days} виконано ✓" },
  "letters.hint": {
    en: "Write every letter by hand, in every form, until you stop hesitating. Your hand learns shapes faster than your eyes do.",
    uk: "Пиши кожну літеру від руки, у всіх формах, доки не перестанеш вагатися. Рука запам'ятовує форми швидше, ніж очі.",
  },
  "form.start": { en: "start", uk: "початок" },
  "form.middle": { en: "middle", uk: "середина" },
  "form.end": { en: "end", uk: "кінець" },
  "form.alone": { en: "alone", uk: "окремо" },
  "form.joined": { en: "joined from right", uk: "з'єднана справа" },

  // Vowels
  "vowels.title": { en: "Vowels", uk: "Голосні" },
  "vowels.sub": {
    en: "Short vowel marks, long vowels, and the four extras you'll see everywhere. Click a row to hear it.",
    uk: "Короткі голосні знаки, довгі голосні та чотири додаткові знаки, які трапляються всюди. Натисни на рядок, щоб почути.",
  },

  // Quiz
  "quiz.title": { en: "Quiz", uk: "Тест" },
  "quiz.sub": {
    en: "What sound is this letter? Pick the groups to test. Keys: 1–4 to answer, Enter for the next letter.",
    uk: "Який це звук? Обери групи для перевірки. Клавіші: 1–4 — відповідь, Enter — наступна літера.",
  },
  "quiz.form": { en: "{form} form", uk: "форма: {form}" },
  "quiz.score": { en: "Score", uk: "Рахунок" },
  "quiz.run": { en: "In a row", uk: "Поспіль" },
  "quiz.right": { en: "Right — {name}.", uk: "Правильно — {name}." },
  "quiz.wrong": { en: "That's {name}.", uk: "Це {name}." },
  "quiz.next": { en: "Next letter", uk: "Наступна літера" },

  // Reading
  "reading.title": { en: "Reading", uk: "Читання" },
  "reading.sub": {
    en: "Real Najdi words from your plan, written the way Saudis write them — without vowel marks. Say each word out loud, then click it to check.",
    uk: "Справжні слова наджді з твого плану, написані так, як пишуть саудівці, — без голосних знаків. Скажи кожне слово вголос, а тоді натисни, щоб перевірити.",
  },
  "reading.count": { en: "<b>{n}</b> of {total} words use only letters you know so far.", uk: "<b>{n}</b> з {total} слів складаються лише з літер, які ти вже знаєш." },
  "reading.showAll": { en: "Show all words", uk: "Показати всі слова" },
  "reading.showingAll": { en: "Showing all words", uk: "Показано всі слова" },
  "reading.shuffle": { en: "Shuffle", uk: "Перемішати" },
  "reading.revealAll": { en: "Reveal all", uk: "Відкрити всі" },
  "reading.hideAll": { en: "Hide all", uk: "Сховати всі" },

  // Phrases
  "phrases.title": { en: "Phrases", uk: "Фрази" },
  "phrases.sub": {
    en: "Three phrases a day for the two Script weeks, straight from your plan — with the “to her” forms. Click one to hear it, then say it out loud ten times.",
    uk: "Три фрази на день протягом двох тижнів письма — прямо з твого плану, з формами «до неї». Натисни, щоб почути, і скажи вголос десять разів.",
  },
  "phrases.hint": {
    en: "The voice speaks formal Arabic. Trust the pronunciation line for Najdi sounds — {q} is g, and short vowels often drop out.",
    uk: "Голос говорить формальною арабською. Для звуків наджді довіряй рядку з вимовою — {q} звучить як ґ, а короткі голосні часто випадають.",
  },
  "phrases.today": { en: "Today", uk: "Сьогодні" },
};
