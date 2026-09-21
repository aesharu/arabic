import * as store from "../core/store.js";
import { todayKey, longDate, addDays, diffDays, format } from "../core/dates.js";
import { planFor, phaseTitle, TOTAL_DAYS, weekNumber, streak, totals, allTasksTicked } from "../core/schedule.js";
import { t, tx, tu, num, locale } from "../core/i18n.js";
import { esc, rich, ar, translit, flag, meanings, playIcon, pageHead } from "../core/dom.js";
import { START, GOAL, DAILY_GOAL_MIN } from "../config.js";
import { PHRASES } from "../data/phrases.js";
import { GROUPS } from "../data/letters.js";
import { journeyParapet, ring, TOTAL_WEEKS } from "./shared.js";

const MAX_SESSION_MIN = 240; // a forgotten timer never logs more than 4 hours

// New phrases on Days 1–14; after that, a rotating review of three.
function phrasesFor(n) {
  const fresh = PHRASES.filter(p => p.day === n);
  if (fresh.length) return { label: t("today.newPhrases"), list: fresh };
  const start = (Math.max(n, 1) * 3) % PHRASES.length;
  return { label: t("today.phraseReview"), list: [0, 1, 2].map(i => PHRASES[(start + i) % PHRASES.length]) };
}

const clock = ms => {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

function stopTimer() {
  const timer = store.get().timer;
  if (!timer) return;
  const min = Math.min(MAX_SESSION_MIN, Math.round((Date.now() - timer.start) / 60000));
  if (min > 0) store.addMinutes(timer.date, min);
  store.update(s => {
    s.timer = null;
  });
}

const stat = (label, value, unit) => `<div><dt>${label}</dt><dd>${value} <small>${unit}</small></dd></div>`;

// Minutes for each of the last 14 days, as small columns with a tooltip each.
function last14(date) {
  const log = store.get().log;
  const days = Array.from({ length: 14 }, (_, i) => addDays(date, i - 13));
  const max = Math.max(DAILY_GOAL_MIN, ...days.map(d => log[d]?.min ?? 0));
  return `<div class="mini-bars" dir="ltr">${days.map(d => {
    const min = d < START ? 0 : log[d]?.min ?? 0;
    const title = format(d, { weekday: "short", day: "numeric", month: "short" }, locale());
    return `<span class="${min ? "" : "zero"}" style="height:${Math.max(6, (min / max) * 100)}%" tabindex="0"
      data-tip="${esc(title)}" data-rows="${esc(`${t("min", { n: min })}||`)}"></span>`;
  }).join("")}</div>`;
}

export default {
  titleKey: "today.title",
  mount(root, { signal }) {
    const render = () => {
      const date = todayKey();
      const plan = planFor(date);
      if (!plan) {
        root.innerHTML = pageHead(t("today.notStarted"), esc(t("today.day1Is", { date: longDate(START, locale()) })));
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

      root.innerHTML = `
        ${pageHead(`${t("day.n", { n })} <span class="of">${t("day.of", { total: TOTAL_DAYS })}</span>`,
                   `${esc(tx(phaseTitle(phase)))} · ${t("week.n", { n: week })}`,
                   esc(longDate(date, locale())), "has-parapet")}
        ${journeyParapet(date)}
        <p class="parapet-caption">${t("today.weekOf", { n: week, total: TOTAL_WEEKS })}</p>
        <div class="today">
          <div class="today-main">
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
                    ${task.href ? `<a class="task-go" href="${task.href}">${t("open")}</a>` : `<span></span>`}
                  </li>`;
                }).join("")}
              </ul>
              ${allTasksTicked(date, e) ? `<p class="day-done"><span aria-hidden="true">✓</span> ${esc(t("today.dayDone"))}</p>` : ""}
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
            <section class="panel timer">
              <h2>${t("today.studyTime")}</h2>
              <div class="ring-wrap">
                ${ring(e.min / DAILY_GOAL_MIN)}
                <div>
                  <p class="clock" id="clock">${s.timer ? clock(Date.now() - s.timer.start) : t("min", { n: e.min })}</p>
                  <p class="muted small">${s.timer ? t("today.running", { min: e.min }) : t("today.logged", { goal: DAILY_GOAL_MIN })}</p>
                </div>
              </div>
              <button class="btn btn-primary" data-timer>${s.timer ? t("today.stop") : t("today.start")}</button>
              <div class="btn-row" role="group" aria-label="${esc(t("today.adjust"))}">
                <button class="btn" data-add="-10">−10</button>
                <button class="btn" data-add="10">+10</button>
                <button class="btn" data-add="30">+30</button>
              </div>
            </section>

            <section class="panel stats">
              <h2>${t("today.journey")}</h2>
              <dl class="stat-pairs">
                ${stat(t("today.streak"), days, tu("unit.days", days))}
                ${stat(t("today.studied"), tot.days, tu("unit.days", tot.days))}
                ${stat(t("today.total"), num(hours, 1), tu("unit.hours", hours, { minimumFractionDigits: 1 }))}
                ${stat(t("today.toGo"), left, tu("unit.days", left))}
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
        if (store.get().timer) stopTimer();
        else store.update(s => { s.timer = { start: Date.now(), date: todayKey() }; });
      } else if (b.dataset.add) {
        store.addMinutes(todayKey(), +b.dataset.add);
      } else if (b.dataset.addYesterday) {
        store.addMinutes(addDays(todayKey(), -1), +b.dataset.addYesterday);
      } else return;
      render();
    }, { signal });

    const tick = setInterval(() => {
      const timer = store.get().timer;
      const el = document.getElementById("clock");
      if (timer && el) el.textContent = clock(Date.now() - timer.start);
    }, 1000);
    signal.addEventListener("abort", () => clearInterval(tick));

    render();
  },
};
