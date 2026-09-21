import * as store from "../core/store.js";
import * as timer from "../core/timer.js";
import * as cards from "../core/cards.js";
import { loadVocab, vocabNow } from "../core/vocab.js";
import { todayKey, longDate, addDays, diffDays, format } from "../core/dates.js";
import { planFor, phaseTitle, TOTAL_DAYS, weekNumber, streak, totals, allTasksTicked } from "../core/schedule.js";
import { t, tx, tu, num, locale } from "../core/i18n.js";
import { esc, rich, ar, translit, flag, meanings, playIcon } from "../core/dom.js";
import { icon, scene } from "../core/art.js";
import { START, GOAL, DAILY_GOAL_MIN } from "../config.js";
import { PHRASES } from "../data/phrases.js";
import { GROUPS } from "../data/letters.js";
import { journeyParapet, ring, TOTAL_WEEKS, wordsMeter } from "./shared.js";

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
    return `<span class="${min ? "" : "zero"}" style="height:${Math.max(6, (min / max) * 100)}%" tabindex="0"
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
      const left = Math.max(0, diffDays(date, GOAL));
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
            <h1>${t("day.n", { n })} <span class="of">${t("day.of", { total: TOTAL_DAYS })}</span></h1>
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
        <p class="parapet-caption">${t("today.weekOf", { n: week, total: TOTAL_WEEKS })}</p>

        <div class="today">
          <div class="today-main">
            ${week >= 3 && week <= 67 ? `<a class="ls-today" href="#/lessons/${week}">${icon("plan")}<span><b>${t("lessons.thisWeek")}</b><small>${t("lessons.weekN", { n: week })}</small></span>${icon("arrow")}</a>` : ""}
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

          <aside class="today-side">
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
                ${stat("plan", t("today.toGo"), left, tu("unit.days", left))}
              </dl>
              <h3>${t("today.last14")}</h3>
              ${last14(date)}
              <p class="muted small">${esc(t("today.finish", { n, total: TOTAL_DAYS, date: longDate(GOAL, locale()) }))}</p>
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
          </aside>
        </div>`;
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

    const tick = setInterval(() => {
      const run = timer.running();
      const el = document.getElementById("clock");
      if (run && el) el.textContent = timer.clock(Date.now() - run.start);
    }, 1000);
    signal.addEventListener("abort", () => clearInterval(tick));

    render();
    if (!vocabNow()) loadVocab().then(() => {
      const slot = !signal.aborted && root.querySelector("[data-cards-panel]");
      if (slot) slot.innerHTML = cardsPanel();
    }, () => {});
  },
};
