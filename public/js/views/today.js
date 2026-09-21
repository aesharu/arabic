import * as store from "../core/store.js";
import { todayKey, longDate, addDays, diffDays } from "../core/dates.js";
import { planFor, phaseTitle, TOTAL_DAYS, weekNumber, streak, totals } from "../core/schedule.js";
import { esc, rich, ar, flag, playIcon, pageHead } from "../core/dom.js";
import { START, GOAL, DAILY_GOAL_MIN } from "../config.js";
import { PHRASES } from "../data/phrases.js";
import { GROUPS } from "../data/letters.js";

const MAX_SESSION_MIN = 240; // a forgotten timer never logs more than 4 hours

// New phrases on Days 1–14; after that, a rotating review of three.
function phrasesFor(n) {
  const fresh = PHRASES.filter(p => p.day === n);
  if (fresh.length) return { label: "Today's new phrases", list: fresh };
  const start = (Math.max(n, 1) * 3) % PHRASES.length;
  return { label: "Phrase review", list: [0, 1, 2].map(i => PHRASES[(start + i) % PHRASES.length]) };
}

const clock = ms => {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

function stopTimer() {
  const t = store.get().timer;
  if (!t) return;
  const min = Math.min(MAX_SESSION_MIN, Math.round((Date.now() - t.start) / 60000));
  if (min > 0) store.addMinutes(t.date, min);
  store.update(s => {
    s.timer = null;
  });
}

export default {
  title: "Today",
  mount(root, { signal }) {
    const render = () => {
      const date = todayKey();
      const plan = planFor(date);
      if (!plan) {
        root.innerHTML = pageHead("Not started yet", `Day 1 is ${esc(longDate(START))}.`);
        return;
      }
      const s = store.get();
      const e = store.entry(date);
      const { n, phase, focus, group, tasks } = plan;
      const ticked = tasks.filter(t => e.tasks.includes(t.id)).length;
      const planned = tasks.reduce((sum, t) => sum + t.min, 0);
      const ph = phrasesFor(n);
      const yesterday = addDays(date, -1);
      const tot = totals(s.log);
      const left = Math.max(0, diffDays(date, GOAL));
      const pctDay = Math.min(100, (e.min / DAILY_GOAL_MIN) * 100);
      const pctAll = Math.min(100, (n / TOTAL_DAYS) * 100);

      root.innerHTML = `
        ${pageHead(`Day ${n} <span class="of">of ${TOTAL_DAYS}</span>`, `${esc(phaseTitle(phase))} · week ${weekNumber(date)}`, esc(longDate(date)))}
        <div class="today">
          <div class="today-main">
            <section class="panel">
              <div class="panel-head">
                <h2>Today's focus</h2>
                <span class="muted">${ticked} of ${tasks.length} done · about ${planned} min</span>
              </div>
              <p class="focus">${rich(focus)}</p>
              ${group !== null ? `<a class="focus-letters" href="#/letters/${group + 1}" aria-label="Open letter group ${group + 1}">${ar(GROUPS[group].letters.map(l => l.char).join(" "))}</a>` : ""}
              <ul class="tasks">
                ${tasks.map(t => {
                  const done = e.tasks.includes(t.id);
                  return `<li class="task${done ? " is-done" : ""}">
                    <label><input type="checkbox" data-task="${t.id}"${done ? " checked" : ""}>
                      <span class="task-text">${rich(t.text)}</span></label>
                    <span class="task-min">${t.min} min</span>
                    ${t.href ? `<a class="task-go" href="${t.href}">Open</a>` : `<span></span>`}
                  </li>`;
                }).join("")}
              </ul>
              ${phase.weekly.length ? `<div class="weekly"><b>Every week</b><ul>${phase.weekly.map(w => `<li>${esc(w)}</li>`).join("")}</ul></div>` : ""}
            </section>

            <section class="panel">
              <div class="panel-head"><h2>${ph.label}</h2><a href="#/phrases">All phrases</a></div>
              <div class="phrase-list">
                ${ph.list.map(p => `
                  <button class="phrase" data-say="${esc(p.speak ?? p.ar)}">
                    ${ar(p.ar, "phrase-ar")}
                    <span class="phrase-t"><b>${esc(p.tr)}</b> ${flag(p)}<span>${esc(p.en)}${p.note ? ` — ${rich(p.note)}` : ""}</span></span>
                    ${playIcon}
                  </button>`).join("")}
              </div>
            </section>
          </div>

          <aside class="today-side">
            <section class="panel timer">
              <h2>Study time</h2>
              <p class="clock" id="clock">${s.timer ? clock(Date.now() - s.timer.start) : `${e.min} min`}</p>
              <p class="muted">${s.timer ? `Running — ${e.min} min already logged today` : `logged today · goal ${DAILY_GOAL_MIN}+`}</p>
              <span class="meter" aria-hidden="true"><span style="width:${pctDay}%"></span></span>
              <button class="btn btn-primary" data-timer>${s.timer ? "Stop and log time" : "Start timer"}</button>
              <div class="btn-row" role="group" aria-label="Adjust minutes by hand">
                <button class="btn" data-add="-10">−10</button>
                <button class="btn" data-add="10">+10</button>
                <button class="btn" data-add="30">+30</button>
              </div>
            </section>

            <section class="panel stats">
              <h2>Your journey</h2>
              <dl>
                <div><dt>Streak</dt><dd>${streak(s.log, date)} <small>days</small></dd></div>
                <div><dt>Studied</dt><dd>${tot.days} <small>days</small></dd></div>
                <div><dt>Total</dt><dd>${(tot.minutes / 60).toFixed(1)} <small>hours</small></dd></div>
                <div><dt>To go</dt><dd>${left} <small>days</small></dd></div>
              </dl>
              <span class="meter" aria-hidden="true"><span style="width:${pctAll.toFixed(1)}%"></span></span>
              <p class="muted small">Day ${n} of ${TOTAL_DAYS} — finish line ${esc(longDate(GOAL))}</p>
              ${yesterday >= START && !store.entry(yesterday).min ? `
                <div class="nudge">
                  <p>Studied yesterday? Log it:</p>
                  <div class="btn-row">
                    <button class="btn" data-add-yesterday="30">+30 min</button>
                    <button class="btn" data-add-yesterday="60">+60 min</button>
                    <button class="btn" data-add-yesterday="90">+90 min</button>
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
      const t = store.get().timer;
      const el = document.getElementById("clock");
      if (t && el) el.textContent = clock(Date.now() - t.start);
    }, 1000);
    signal.addEventListener("abort", () => clearInterval(tick));

    render();
  },
};
