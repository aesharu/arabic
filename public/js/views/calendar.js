import * as store from "../core/store.js";
import { todayKey, longDate, format, monthKey, addMonths, daysInMonth, weekdayMon } from "../core/dates.js";
import { planFor, phaseFor, phaseTitle, dayStatus, TOTAL_DAYS, weekNumber } from "../core/schedule.js";
import { esc, rich, pageHead } from "../core/dom.js";
import { START, GOAL } from "../config.js";
import { PHASES } from "../data/plan.js";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const STATUS_TEXT = {
  done: "Done",
  partial: "Started",
  missed: "Missed",
  open: "Today — not started yet",
  future: "Coming up",
};

function monthsInPlan() {
  const months = [];
  for (let m = monthKey(START); m <= monthKey(GOAL); m = addMonths(m, 1)) months.push(m);
  return months;
}

function renderMonth(m, log, today, selected) {
  const cells = WEEKDAYS.map(d => `<span class="cal-wd">${d}</span>`);
  for (let i = weekdayMon(`${m}-01`); i > 0; i--) cells.push(`<span></span>`);
  for (let d = 1; d <= daysInMonth(m); d++) {
    const date = `${m}-${String(d).padStart(2, "0")}`;
    if (date < START || date > GOAL) {
      cells.push(`<span class="cal-day is-out">${d}</span>`);
      continue;
    }
    const status = dayStatus(date, log, today);
    const cls = [`cal-day`, `p${phaseFor(date).id}`, `s-${status}`, date === today && "is-today", date === selected && "is-selected"]
      .filter(Boolean).join(" ");
    cells.push(`<button class="${cls}" data-date="${date}" aria-label="${esc(longDate(date))}: ${STATUS_TEXT[status]}"${date === selected ? ` aria-pressed="true"` : ""}>${d}</button>`);
  }
  return `<section class="month"><h3>${format(`${m}-01`, { month: "long", year: "numeric" })}</h3><div class="cal-grid">${cells.join("")}</div></section>`;
}

function renderDetail(date, log, today) {
  const plan = planFor(date);
  const e = store.entry(date);
  const status = dayStatus(date, log, today);
  const editable = date <= today;
  return `
    <p class="eyebrow">${esc(longDate(date))}</p>
    <h2>Day ${plan.n} <span class="of">of ${TOTAL_DAYS}</span></h2>
    <p class="muted">Week ${weekNumber(date)} · ${esc(phaseTitle(plan.phase))}</p>
    <p class="detail-status s-${status}">${STATUS_TEXT[status]}</p>
    <p class="focus">${rich(plan.focus)}</p>
    <ul class="detail-tasks">
      ${plan.tasks.map(t => {
        const done = e.tasks.includes(t.id);
        return editable
          ? `<li><label><input type="checkbox" data-task="${t.id}"${done ? " checked" : ""}> ${rich(t.text)}</label></li>`
          : `<li>${rich(t.text)}</li>`;
      }).join("")}
    </ul>
    ${editable ? `
      <p><b>${e.min} min</b> logged</p>
      <div class="btn-row" role="group" aria-label="Adjust minutes">
        <button class="btn" data-add="-10">−10</button>
        <button class="btn" data-add="10">+10</button>
        <button class="btn" data-add="30">+30</button>
        <button class="btn" data-add="60">+60</button>
      </div>` : ""}
    ${date === today ? `<p><a href="#/today">Open today's page</a></p>` : ""}`;
}

function download(name, text) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  a.click();
  URL.revokeObjectURL(url);
}

export default {
  title: "Calendar",
  mount(root, { signal }) {
    const today = todayKey();
    let selected = today < START ? START : today > GOAL ? GOAL : today;

    const render = () => {
      const log = store.get().log;
      root.innerHTML = `
        ${pageHead("Calendar", `Day 1 was ${esc(longDate(START))}. The finish line is ${esc(longDate(GOAL))}. Click any day to see its plan or log time you forgot to record.`)}
        <div class="legend" aria-label="Legend">
          ${PHASES.map(p => `<span><i class="sw p${p.id}"></i>${esc(phaseTitle(p))}</span>`).join("")}
        </div>
        <div class="legend">
          <span><i class="dot s-done"></i>Done (all tasks or 60+ min)</span>
          <span><i class="dot s-partial"></i>Started</span>
          <span><i class="dot s-missed"></i>Missed</span>
          <span><i class="ring"></i>Today</span>
        </div>
        <div class="cal-layout">
          <div class="months">${monthsInPlan().map(m => renderMonth(m, log, today, selected)).join("")}</div>
          <aside class="panel detail" aria-live="polite">${renderDetail(selected, log, today)}</aside>
        </div>
        <section class="panel backup">
          <h2>Your data</h2>
          <p class="muted">Progress is saved only in this browser. Download a backup now and then — clearing browser data would erase it.</p>
          <div class="btn-row">
            <button class="btn" data-export>Download backup</button>
            <label class="btn">Restore from backup<input type="file" accept="application/json,.json" data-import hidden></label>
          </div>
        </section>`;
    };

    root.addEventListener("click", e => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.date) selected = b.dataset.date;
      else if (b.dataset.add) store.addMinutes(selected, +b.dataset.add);
      else if (b.hasAttribute("data-export")) return download(`najdi-backup-${todayKey()}.json`, store.exportJson());
      else return;
      render();
      if (b.dataset.date) root.querySelector(`[data-date="${selected}"]`)?.focus();
    }, { signal });

    root.addEventListener("change", async e => {
      if (e.target.dataset.task) {
        store.toggleTask(selected, e.target.dataset.task);
        render();
      } else if (e.target.hasAttribute("data-import")) {
        const file = e.target.files[0];
        if (!file) return;
        try {
          store.importJson(await file.text());
          render();
          alert("Backup restored.");
        } catch (err) {
          alert(err.message);
        }
      }
    }, { signal });

    render();
  },
};
