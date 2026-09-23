import * as store from "../core/store.js";
import * as timer from "../core/timer.js";
import * as cards from "../core/cards.js";
import { loadVocab, vocabNow } from "../core/vocab.js";
import { progressNow } from "../core/cards.js";
import { todayKey, longDate, addDays, diffDays, format } from "../core/dates.js";
import { planFor, phaseTitle, stageProgress, weekNumber, streak, totals, allTasksTicked } from "../core/schedule.js";
import { t, tx, tu, num, cnt, said, locale, lang, isArabic } from "../core/i18n.js";
import { esc, rich, ar, lat, translit, flag, meanings, playIcon } from "../core/dom.js";
import { icon, scene } from "../core/art.js";
import { START, DAILY_GOAL_MIN } from "../config.js";
import { PHRASES } from "../data/phrases.js";
import { GROUPS } from "../data/letters.js";
import { journeyParapet, ring, wordsMeter } from "./shared.js";
import { BIRTHDAY } from "../data/birthday.js";
import { PATH } from "../data/path.js";
import { weeks as pathWeeks, weekIndex as pathWeek, progress as pathProgress } from "../core/path.js";
import { CITIES, around, saudiToday } from "../core/prayer.js";
import { upcoming, leftText } from "./saudi.js";
import { sceneSvg } from "../core/scenes.js";
import * as content from "../core/content.js";
import { spoken, openStudio } from "../core/studio.js";
import { DECKS } from "../core/vocab.js";
import { streaks, daysFromTimes, saudiDay } from "../core/activity.js";

// New phrases on Days 1–14; after that, a rotating review of three.
function phrasesFor(n) {
  const fresh = PHRASES.filter(p => p.day === n);
  if (fresh.length) return { label: t("today.newPhrases"), list: fresh };
  const start = (Math.max(n, 1) * 3) % PHRASES.length;
  return { label: t("today.phraseReview"), list: [0, 1, 2].map(i => PHRASES[(start + i) % PHRASES.length]) };
}

// The sky over the fort follows your clock; the greeting teaches the words for this time of day.
// The sky follows the theme: a dark theme is night with the moon; a light one has the sun, low at dawn and dusk.
function timeOfDay(h = new Date().getHours()) {
  const theme = document.documentElement.dataset.theme;
  const dark = theme ? theme === "dark" || theme === "saudi-dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  if (dark) return "night";
  if (h >= 5 && h < 8) return "dawn";
  if (h >= 17 && h < 20) return "dusk";
  return "day";
}
const GREETING = {
  morning: { ar: "صباح الخير", say: "ṣabāḥ al-khēr", key: "today.greetMorning", reply: "صباح النور", replySay: "ṣabāḥ an-nūr" },
  evening: { ar: "مساء الخير", say: "masāʾ al-khēr", key: "today.greetEvening", reply: "مساء النور", replySay: "masāʾ an-nūr" },
};

// Her side of the world: the time in Saudi Arabia, the Hijri date, the next prayer in her city and the next
// occasion — the Arabic words to hear.
const HAFAR = CITIES.find(c => c.id === "hafar");
const TZ = "Asia/Riyadh";
let occasions = { day: "", list: [] }; // upcoming() walks the calendar day by day: once a day is enough
const clockAt = at => new Intl.DateTimeFormat(locale(), { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: TZ }).format(at);
const meanOf = x => lat(tx({ en: x.en, uk: x.uk, najdi: x.en, msa: x.en }));
const daysText = n => (n === 0 ? t("saudi.isToday") : n === 1 ? t("saudi.tomorrow") : t("saudi.inDays", { n: cnt("unit.days", n) }));

function herWorld(now = Date.now()) {
  const day = saudiToday(now);
  if (occasions.day !== day) occasions = { day, list: upcoming(day) };
  const noon = new Date(Date.parse(day) + 12 * 3600e3);
  const hijri = { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" };
  const hijriAr = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura-nu-latn", hijri).format(noon);
  const hijriLat = new Intl.DateTimeFormat(`${isArabic() ? "en" : lang()}-u-ca-islamic-umalqura`, hijri).format(noon);
  const { next } = around(HAFAR, now);
  const occ = occasions.list[0];
  const gap = 3 + new Date(now).getTimezoneOffset() / 60; // hours Saudi Arabia is ahead of this device
  const hour = +new Intl.DateTimeFormat("en", { hour: "numeric", hourCycle: "h23", timeZone: TZ }).format(now);
  const gapText = gap === 0 ? t("td.same") : t(gap > 0 ? "td.ahead" : "td.behind", { n: num(Math.abs(gap)) });
  const tile = (iconName, label, body, say) => say
    ? `<button type="button" class="hc-tile" data-say="${esc(say)}"><span class="hc-label">${icon(iconName)} ${label}</span>${body}${playIcon}</button>`
    : `<div class="hc-tile"><span class="hc-label">${icon(iconName)} ${label}</span>${body}</div>`;
  return `
    ${tile(hour >= 6 && hour < 18 ? "today" : "moon", t("td.timeThere"), `<span class="hc-big hc-clock">${esc(clockAt(now))}</span><span class="hc-small">${esc(gapText)}</span>`)}
    ${tile("calendar", t("td.hijri"), `<span class="hc-big hc-hijri">${ar(hijriAr)}</span><span class="hc-small">${lat(hijriLat)}</span>`, hijriAr.replace(/\s*هـ$/, ""))}
    ${next ? tile("mosque", t("td.nextPrayer"), `<span class="hc-big">${ar(next.p.ar)} <span class="hc-time">${esc(clockAt(next.at))}</span></span>
      <span class="hc-small">${translit(next.p.say)} · ${meanOf(next.p)} · ${esc(leftText(next.at - now))}</span>`, next.p.ar) : ""}
    ${occ ? tile("star", t("td.comingUp"), `<span class="hc-big">${ar(occ.o.name.najdi)}</span>
      <span class="hc-small">${translit(occ.o.say)} · ${meanOf(occ.o.name)} · <b>${esc(daysText(occ.days))}</b></span>`, occ.o.name.najdi) : ""}`;
}

// Her one minute: five words she hasn't said yet. A page with 1,157 words is a wall; five is a favour — and
// five a day is what turns the computer voice off across the whole site. Her profile only.
const FIVE = 5;
const deckOrder = Object.fromEntries(DECKS.map((d, i) => [d.id, i]));

export function nextToRecord(notes, n = FIVE) {
  return notes
    .filter(x => !content.hasAudio(spoken(x)))
    .sort((a, b) => (deckOrder[a.deck] ?? 99) - (deckOrder[b.deck] ?? 99))
    .slice(0, n);
}

function fiveCard() {
  const v = vocabNow();
  if (!v || !content.signedIn()) return "";
  const times = content.audioTimes();
  const today = saudiDay(Date.now());
  const todayCount = times.filter(at => saudiDay(at) === today).length;
  const { current } = streaks(daysFromTimes(times));
  const five = nextToRecord(v.notes);
  const enough = todayCount >= FIVE;
  return `<section class="panel five" data-five>
    <div class="five-head">
      <h2>${icon("mic")} ${esc(t("td.fiveTitle"))}</h2>
      <span class="muted">${esc(t("td.fiveTodayCount", { n: num(Math.min(todayCount, FIVE)), total: num(FIVE) }))}</span>
    </div>
    <span class="meter" aria-hidden="true"><span style="width:${Math.min(100, (todayCount / FIVE) * 100)}%"></span></span>
    <p class="five-sub">${esc(t(enough ? "td.fiveDone" : "td.fiveSub"))}</p>
    ${five.length ? `<ul class="five-words">${five.map(x => `<li>${ar(x.ar)}${lat(tx({ en: x.en, uk: x.uk, najdi: x.en, msa: x.en }))}</li>`).join("")}</ul>
      <button type="button" class="btn btn-primary five-go" data-five-go>${icon("mic")} ${esc(t("td.fiveGo"))}</button>`
    : `<p class="empty-note">${icon("check")} ${esc(t("record.allDone"))}</p>`}
    <p class="five-foot">${esc(t("td.fiveTotal", { n: said("unit.words", times.length) }))}${current > 1 ? ` · <b>${esc(`${said("unit.days", current)} ${t("td.fiveRow")}`)}</b>` : ""}</p>
  </section>`;
}

// Today's story: the next one he hasn't read (short stories are how she learns); in her profile, the next one to
// record in her voice.
function storyCard(S) {
  const teacher = store.isTeacher();
  const read = new Set(store.get().reading?.done ?? []);
  const voiced = s => content.recordedCount(s.text.map(spoken)) === s.text.length;
  const done = S.STORIES.filter(s => (teacher ? voiced(s) : read.has(`st.${s.id}`))).length;
  const s = S.STORIES.find(x => (teacher ? !voiced(x) : !read.has(`st.${x.id}`)));
  if (!s) return "";
  return `<a class="td-story" href="#/stories/${s.id}">
    <span class="td-story-pic" aria-hidden="true">${sceneSvg("tent", { square: true })}</span>
    <span class="td-story-text">
      <span class="td-story-kind">${icon(teacher ? "mic" : "reading")} ${t(teacher ? "td.storyRec" : "td.story")} · ${esc(s.level === "easy" ? t("st.badgeEasy") : s.level)}</span>
      <b>${esc(tx(s.title))}</b>
      ${ar(s.text[0].ar, "td-story-ar")}
      <span class="td-story-meta">${esc(t("st.lines", { n: num(s.text.length) }))} · ${esc(t(teacher ? "td.storiesVoiced" : "td.storiesRead", { n: num(done), total: num(S.STORIES.length) }))}</span>
    </span>
    <span class="btn btn-primary td-story-go">${teacher ? `${icon("mic")} ${t("st.record")}` : `${t("td.read")} ${icon("arrow", "flip-rtl")}`}</span>
  </a>`;
}

const stat = (iconName, label, value, unit) =>
  `<div><dt>${icon(iconName)}${label}</dt><dd>${value} <small>${unit}</small></dd></div>`;

// Minutes for each of the last 14 days, as small columns with a tooltip each.
function last14(date) {
  const log = store.get().log;
  const days = Array.from({ length: 14 }, (_, i) => addDays(date, i - 13));
  const max = Math.max(DAILY_GOAL_MIN, ...days.map(d => log[d]?.min ?? 0));
  return `<div class="mini-bars" dir="ltr">${days.map(d => {
    const min = d < START ? 0 : log[d]?.min ?? 0;
    const title = format(d, { weekday: "short", day: "numeric", month: "short" }, locale());
    return `<span class="${min ? "" : "zero"}" style="height:${Math.max(6, (min / max) * 100)}%" role="img" tabindex="0"
      data-tip="${esc(title)}" data-rows="${esc(`${t("min", { n: min })}||`)}" aria-label="${esc(`${title}: ${t("min", { n: min })}`)}"></span>`;
  }).join("")}</div>`;
}

function cardsPanel() {
  const v = vocabNow();
  if (!v) return `<section class="panel today-cards"><h2>${icon("cards")} ${t("nav.cards")}</h2><p class="muted">${esc(t("cards.loading"))}</p></section>`;
  const c = cards.counts(v.notes);
  const waiting = c.fresh + c.learn + c.review;
  return `
    <section class="panel today-cards">
      <div class="panel-head"><h2>${icon("cards")} ${t("nav.cards")}</h2><a href="#/cards" class="small">${t("cards.decks")}</a></div>
      <dl class="due-counts compact">
        <div class="c-new"><dt>${t("cards.new")}</dt><dd>${c.fresh}</dd></div>
        <div class="c-learn"><dt>${t("cards.learning")}</dt><dd>${c.learn}</dd></div>
        <div class="c-due"><dt>${t("cards.due")}</dt><dd>${c.review}</dd></div>
      </dl>
      ${waiting
        ? `<a class="btn btn-primary btn-wide" href="#/cards/study">${t("cards.studyNow")} ${icon("arrow", "flip-rtl")}</a>`
        : `<p class="all-done">${icon("check")} ${t("cards.allDoneToday")}</p>`}
      ${wordsMeter(cards.wordStats(v.notes))}
    </section>`;
}

export default {
  titleKey: "today.title",
  mount(root, { signal }) {
    const render = () => {
      const date = todayKey();
      const plan = planFor(date);
      if (!plan) {
        root.innerHTML = `<section class="hero sky-${timeOfDay()}">${scene(timeOfDay())}<div class="hero-text"><h1>${t("today.notStarted")}</h1>
          <p class="hero-sub">${esc(t("today.day1Is", { date: longDate(START, locale()) }))}</p></div></section>`;
        return;
      }
      const s = store.get();
      const e = store.entry(date);
      const { n, phase, focus, group, tasks } = plan;
      const ticked = tasks.filter(task => e.tasks.includes(task.id)).length;
      const nextId = tasks.find(task => !e.tasks.includes(task.id))?.id;
      const planned = tasks.reduce((sum, task) => sum + task.min, 0);
      const ph = phrasesFor(n);
      const yesterday = addDays(date, -1);
      const tot = totals(s.log);
      const hours = tot.minutes / 60;
      const days = streak(s.log, date);
      const sp = stageProgress(progressNow(vocabNow()?.notes));
      const week = weekNumber(date);
      const time = timeOfDay();
      const hour = new Date().getHours();
      const g = GREETING[hour >= 4 && hour < 12 ? "morning" : "evening"];
      const run = timer.running();

      root.innerHTML = `
        <section class="hero sky-${time}">
          ${scene(time)}
          <div class="hero-text">
            <p class="eyebrow">${esc(longDate(date, locale()))}</p>
            <h1>${t("day.n", { n })}</h1>
            <p class="hero-sub">${esc(tx(phaseTitle(phase)))} · ${t("week.n", { n: week })}</p>
            <button class="greet" data-say="${esc(g.ar)}" aria-label="${esc(t("lab.hear", { what: g.say }))}">
              ${ar(g.ar, "greet-ar")}
              <span class="greet-t">${translit(g.say)} <span>${esc(t(g.key))}</span>
                <small>${t("today.greetReply")} ${ar(g.reply)} ${translit(g.replySay)}</small></span>
              ${icon("sound")}
            </button>
          </div>
        </section>
        ${journeyParapet(date)}
        <p class="parapet-caption">${t("cal.week", { n: week })}</p>

        <section class="hc" aria-labelledby="hc-title">
          <div class="hc-head"><h2 id="hc-title">${t("td.herCity")}</h2><a href="#/saudi" class="small">${t("nav.saudi")} ${icon("arrow", "flip-rtl")}</a></div>
          <div class="hc-tiles" data-hc>${herWorld()}</div>
        </section>

        <div class="today">
          <div class="today-main">
            ${!store.isTeacher() && diffDays(START, date) < PATH.length * 7 ? (w => (p => `<a class="ls-today pa-today" href="#/path">${icon("plan")}<span><b>${esc(t("path.todayLink", { title: tx(w.title) }))}</b><small>${esc(t("path.todaySub", { done: num(p.done), total: num(p.total) }))}</small></span>${icon("arrow")}</a>`)(pathProgress(w)))(pathWeeks(false)[pathWeek(date)]) : ""}
            ${!store.isTeacher() && date <= BIRTHDAY ? `<a class="ls-today bd-today" href="#/birthday">${icon("heart")}<span><b>${esc(t("bday.todayLink", { n: num(diffDays(date, BIRTHDAY)) }))}</b><small>${esc(t("bday.todaySub"))}</small></span>${icon("arrow")}</a>` : ""}
            ${week >= 3 && week <= 67 ? `<a class="ls-today" href="#/lessons/${week}">${icon("plan")}<span><b>${t("lessons.thisWeek")}</b><small>${t("lessons.weekN", { n: week })}</small></span>${icon("arrow")}</a>` : ""}
            ${store.isTeacher() ? `<div data-five-slot>${fiveCard()}</div>` : ""}
            <section class="panel">
              <div class="panel-head">
                <h2>${t("today.focus")}</h2>
                <span class="muted">${t("today.doneOf", { done: ticked, total: tasks.length, min: planned })}</span>
              </div>
              <span class="meter" aria-hidden="true"><span style="width:${((ticked / tasks.length) * 100).toFixed(1)}%"></span></span>
              <p class="focus">${rich(tx(focus))}</p>
              ${group !== null ? `<a class="focus-letters" href="#/letters/${group + 1}" aria-label="${esc(t("today.openGroup", { n: group + 1 }))}">${ar(GROUPS[group].letters.map(l => l.char).join(" "))}</a>` : ""}
              <ul class="tasks">
                ${tasks.map(task => {
                  const done = e.tasks.includes(task.id);
                  return `<li class="task${done ? " is-done" : ""}${task.id === nextId ? " is-next" : ""}">
                    <label><input type="checkbox" data-task="${task.id}"${done ? " checked" : ""}>
                      <span class="task-text">${rich(tx(task.text))}</span></label>
                    <span class="task-min">${t("min", { n: task.min })}</span>
                    ${task.href ? `<a class="task-go" href="${task.href}">${t("open")} ${icon("arrow", "flip-rtl")}</a>` : `<span></span>`}
                  </li>`;
                }).join("")}
              </ul>
              ${allTasksTicked(date, e) ? `<p class="day-done">${icon("star")} ${esc(t("today.dayDone"))}</p>` : ""}
              ${phase.weekly.length ? `<div class="weekly"><b>${t("today.everyWeek")}</b><ul>${phase.weekly.map(w => `<li>${esc(tx(w))}</li>`).join("")}</ul></div>` : ""}
            </section>

            <div class="td-story-slot" data-story-slot></div>

            <section class="panel">
              <div class="panel-head"><h2>${ph.label}</h2><a href="#/phrases">${t("today.allPhrases")}</a></div>
              <div class="phrase-list">
                ${ph.list.map(p => `
                  <button class="phrase" data-say="${esc(p.speak ?? p.ar)}">
                    ${ar(p.ar, "phrase-ar")}
                    <span class="phrase-t">${translit(p.tr)} ${flag(p)}${meanings(p)}
                      ${p.note ? `<span class="pnote">${rich(tx(p.note))}</span>` : ""}</span>
                    ${playIcon}
                  </button>`).join("")}
              </div>
            </section>
          </div>

          <div class="today-side">
            <div data-cards-panel>${cardsPanel()}</div>

            <section class="panel timer${run ? " is-running" : ""}">
              <h2>${icon("timer")} ${t("today.studyTime")}</h2>
              <div class="ring-wrap">
                ${ring(e.min / DAILY_GOAL_MIN)}
                <div>
                  <p class="clock" id="clock">${run ? timer.clock(Date.now() - run.start) : t("min", { n: e.min })}</p>
                  <p class="muted small">${run ? t("today.running", { min: e.min }) : t("today.logged", { goal: DAILY_GOAL_MIN })}</p>
                </div>
              </div>
              <button class="btn btn-primary btn-wide" data-timer>${run ? `${icon("pause")} ${t("today.stop")}` : `${icon("play")} ${t("today.start")}`}</button>
              <div class="btn-row" role="group" aria-label="${esc(t("today.adjust"))}">
                <button class="btn" data-add="-10">−10</button>
                <button class="btn" data-add="10">+10</button>
                <button class="btn" data-add="30">+30</button>
              </div>
            </section>

            <section class="panel stats">
              <h2>${t("today.journey")}</h2>
              <dl class="stat-pairs">
                ${stat("flame", t("today.streak"), days, tu("unit.days", days))}
                ${stat("calendar", t("today.studied"), tot.days, tu("unit.days", tot.days))}
                ${stat("timer", t("today.total"), num(hours, 1), tu("unit.hours", hours, { minimumFractionDigits: 1 }))}
                ${stat("plan", t("today.toGo"), sp.left, sp.kind === "letters" ? tu("unit.groups", sp.left) : tu("unit.words", sp.left))}
              </dl>
              <h3>${t("today.last14")}</h3>
              ${last14(date)}
              <p class="muted small">${esc(t(`stage.gate.${sp.kind}`, { done: num(sp.done), need: num(sp.need) }))}</p>
              ${yesterday >= START && !store.entry(yesterday).min ? `
                <div class="nudge">
                  <p>${t("today.yesterday")}</p>
                  <div class="btn-row">
                    <button class="btn" data-add-yesterday="30">+${t("min", { n: 30 })}</button>
                    <button class="btn" data-add-yesterday="60">+${t("min", { n: 60 })}</button>
                    <button class="btn" data-add-yesterday="90">+${t("min", { n: 90 })}</button>
                  </div>
                </div>` : ""}
            </section>
          </div>
        </div>`;
      fillStory();
    };

    root.addEventListener("change", e => {
      const id = e.target.dataset.task;
      if (id) {
        store.toggleTask(todayKey(), id);
        render();
        root.querySelector(`[data-task="${id}"]`)?.focus();
      }
    }, { signal });

    root.addEventListener("click", e => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.hasAttribute("data-timer")) {
        if (timer.running()) timer.stop();
        else timer.start(todayKey());
      } else if (b.dataset.add) {
        store.addMinutes(todayKey(), +b.dataset.add);
      } else if (b.dataset.addYesterday) {
        store.addMinutes(addDays(todayKey(), -1), +b.dataset.addYesterday);
      } else return;
      render();
      root.querySelector(b.hasAttribute("data-timer") ? "[data-timer]" : `[data-add="${b.dataset.add}"]`)?.focus();
    }, { signal });

    let minute = new Date().getMinutes();
    const tick = setInterval(() => {
      const run = timer.running();
      const el = document.getElementById("clock");
      if (run && el) el.textContent = timer.clock(Date.now() - run.start);
      if (new Date().getMinutes() !== minute) {
        minute = new Date().getMinutes();
        const hc = root.querySelector("[data-hc]");
        if (hc) hc.innerHTML = herWorld();
      }
    }, 1000);

    // The story card fills in once the stories are loaded (they're big, so they load after the page).
    let stories = null;
    const fillStory = () => {
      const slot = !signal.aborted && stories && root.querySelector("[data-story-slot]");
      if (slot) slot.innerHTML = storyCard(stories);
    };
    import("./stories.js").then(m => m.loadStories()).then(S => ((stories = S), fillStory()), () => {});
    const fillFive = () => {
      const slot = !signal.aborted && root.querySelector("[data-five-slot]");
      if (slot) slot.innerHTML = fiveCard();
    };
    const offContent = content.onChange(() => {
      fillStory();
      fillFive();
    });

    // "Five words, one minute": the studio opens on them, one after another.
    root.addEventListener("click", e => {
      if (!e.target.closest("[data-five-go]")) return;
      const v = vocabNow();
      if (!v) return;
      const five = nextToRecord(v.notes);
      if (five.length) openStudio(five, 0, { onClose: fillFive });
    }, { signal });
    signal.addEventListener("abort", offContent);
    signal.addEventListener("abort", () => clearInterval(tick));

    render();
    if (!vocabNow()) loadVocab().then(() => {
      const slot = !signal.aborted && root.querySelector("[data-cards-panel]");
      if (slot) slot.innerHTML = cardsPanel();
      fillFive();
    }, () => {});
    content.load();
  },
};
