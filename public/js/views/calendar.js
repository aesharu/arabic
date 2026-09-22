import * as store from "../core/store.js";
import { todayKey, longDate, format, monthKey, addMonths, daysInMonth, weekdayMon, addDays } from "../core/dates.js";
import { planFor, phaseTitle, dayStatus, heatLevel, allTasksTicked, TOTAL_DAYS, weekNumber } from "../core/schedule.js";
import { t, tx, locale, isArabic } from "../core/i18n.js";
import { esc, rich, pageHead } from "../core/dom.js";
import { START, GOAL, DAILY_GOAL_MIN } from "../config.js";
import { PHASES } from "../data/plan.js";
import * as sync from "../core/sync.js";

const STATUS_KEY = { off: "off", syncing: "syncing", saved: "saved", error: "error", "wrong-key": "wrongKey", "not-configured": "notConfigured" };
function cloudStatus({ state, at } = sync.getStatus()) {
  const time = new Date(store.get().sync.pushedAt || at).toLocaleTimeString(locale(), { hour: "2-digit", minute: "2-digit" });
  return esc(t(`cloud.status.${STATUS_KEY[state] ?? "error"}`, { time }));
}
function cloudBox() {
  const connected = !!store.get().sync.key;
  return `
    <div class="cloud">
      <h3>${t("cloud.title")}</h3>
      <p class="muted">${t("cloud.hint")}</p>
      <p class="cloud-status" data-cloud-status aria-live="polite">${cloudStatus()}</p>
      ${connected
        ? `<div class="btn-row"><button class="btn" data-cloud="save">${t("cloud.saveNow")}</button><button class="btn" data-cloud="disconnect">${t("cloud.disconnect")}</button></div>`
        : `<form class="cloud-form" data-cloud-form>
             <label>${t("cloud.keyLabel")} <input type="password" name="key" autocomplete="off" spellcheck="false" required dir="ltr"></label>
             <button class="btn btn-primary" type="submit">${t("cloud.connect")}</button>
           </form>`}
    </div>`;
}

const status = s => t(`status.${s}`);

function monthsInPlan() {
  const months = [];
  for (let m = monthKey(START); m <= monthKey(GOAL); m = addMonths(m, 1)) months.push(m);
  return months;
}

// Mon … Sun in the current language (START is a Monday).
const weekdays = () => Array.from({ length: 7 }, (_, i) => format(addDays("2026-09-21", i), { weekday: isArabic() ? "narrow" : "short" }, locale()));
const STAGE_STARTS = new Set(PHASES.map(p => p.start));

function renderMonth(m, log, today, selected, wd) {
  const cells = wd.map(d => `<span class="cal-wd">${esc(d)}</span>`);
  for (let i = weekdayMon(`${m}-01`); i > 0; i--) cells.push(`<span></span>`);
  for (let d = 1; d <= daysInMonth(m); d++) {
    const date = `${m}-${String(d).padStart(2, "0")}`;
    if (date < START || date > GOAL) {
      cells.push(`<span class="cal-day is-out" aria-hidden="true"></span>`);
      continue;
    }
    const st = dayStatus(date, log, today);
    const level = date > today ? 0 : heatLevel(log[date], allTasksTicked(date, log[date]));
    const cls = ["cal-day", level && `l${level}`, `s-${st}`, STAGE_STARTS.has(date) && "stage-start", date === today && "is-today", date === selected && "is-selected"]
      .filter(Boolean).join(" ");
    cells.push(`<button class="${cls}" data-date="${date}" aria-label="${esc(longDate(date, locale()))}: ${esc(status(st))}"${date === selected ? ` aria-pressed="true"` : ""}>${d}</button>`);
  }
  const last = `${m}-${String(daysInMonth(m)).padStart(2, "0")}`;
  const stages = PHASES.filter(p => p.start <= last && p.end >= `${m}-01`).map(p => tx(phaseTitle(p)));
  return `<section class="month"><h2>${esc(format(`${m}-01`, { month: "long", year: "numeric" }, locale()))}</h2>
    <p class="stage-names">${esc(stages.join(" · "))}</p><div class="cal-grid">${cells.join("")}</div></section>`;
}

function renderDetail(date, log, today) {
  const plan = planFor(date);
  const e = store.entry(date);
  const st = dayStatus(date, log, today);
  const editable = date <= today;
  return `
    <p class="eyebrow">${esc(longDate(date, locale()))}</p>
    <h2>${t("day.n", { n: plan.n })} <span class="of">${t("day.of", { total: TOTAL_DAYS })}</span></h2>
    <p class="muted">${t("cal.week", { n: weekNumber(date) })} · ${esc(tx(phaseTitle(plan.phase)))}</p>
    <p class="detail-status s-${st}">${status(st)}</p>
    <p class="focus">${rich(tx(plan.focus))}</p>
    <ul class="detail-tasks">
      ${plan.tasks.map(task => {
        const done = e.tasks.includes(task.id);
        return editable
          ? `<li><label><input type="checkbox" data-task="${task.id}"${done ? " checked" : ""}> <span>${rich(tx(task.text))}</span></label></li>`
          : `<li>${rich(tx(task.text))}</li>`;
      }).join("")}
    </ul>
    ${editable ? `
      <p>${t("cal.logged", { min: e.min })}</p>
      <div class="btn-row" role="group" aria-label="${esc(t("cal.adjust"))}">
        <button class="btn" data-add="-10">−10</button>
        <button class="btn" data-add="10">+10</button>
        <button class="btn" data-add="30">+30</button>
        <button class="btn" data-add="60">+60</button>
      </div>` : ""}
    ${date === today ? `<p><a href="#/today">${t("cal.openToday")}</a></p>` : ""}`;
}

function download(name, text) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  a.click();
  URL.revokeObjectURL(url);
}

export default {
  titleKey: "cal.title",
  mount(root, { signal }) {
    const today = todayKey();
    let selected = today < START ? START : today > GOAL ? GOAL : today;

    const render = () => {
      const log = store.get().log;
      const wd = weekdays();
      root.innerHTML = `
        ${pageHead(t("cal.title"), esc(t("cal.sub", { start: longDate(START, locale()), goal: longDate(GOAL, locale()) })), "", "", "crescent")}
        <div class="legend" aria-label="${esc(t("cal.legend"))}">
          <span>${t("cal.less")} <span class="heat-scale" dir="ltr">${[0, 1, 2, 3, 4].map(l => `<i class="heat-key l${l}"></i>`).join("")}</span> ${t("cal.more")}</span>
          <span><i class="heat-key l3"></i>${t("cal.legendDone", { min: DAILY_GOAL_MIN })}</span>
          <span><i class="miss-key"></i>${status("missed")}</span>
          <span><i class="ring-key"></i>${t("nav.today")}</span>
          <span><i class="stage-key"></i>${t("cal.stageStart")}</span>
        </div>
        <div class="cal-layout">
          <div class="months">${monthsInPlan().map(m => renderMonth(m, log, today, selected, wd)).join("")}</div>
          <div class="panel detail" aria-live="polite">${renderDetail(selected, log, today)}</div>
        </div>
        <section class="panel backup">
          <h2>${t("cal.data")}</h2>
          ${cloudBox()}
          <h3>${t("cal.download")}</h3>
          <p class="muted">${t("cal.dataHint")}</p>
          <div class="btn-row">
            <button class="btn" data-export>${t("cal.download")}</button>
            <label class="btn">${t("cal.restore")}<input type="file" accept="application/json,.json" data-import hidden></label>
          </div>
        </section>`;
    };

    root.addEventListener("click", e => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.cloud === "save") return sync.push();
      if (b.dataset.cloud === "disconnect") {
        sync.disconnect();
        return render();
      }
      if (b.dataset.date) selected = b.dataset.date;
      else if (b.dataset.add) store.addMinutes(selected, +b.dataset.add);
      else if (b.hasAttribute("data-export")) return download(`najdi-backup-${todayKey()}.json`, store.exportJson());
      else return;
      render();
      if (b.dataset.date) root.querySelector(`[data-date="${selected}"]`)?.focus();
    }, { signal });

    root.addEventListener("submit", async e => {
      if (!e.target.matches("[data-cloud-form]")) return;
      e.preventDefault();
      await sync.connect(new FormData(e.target).get("key"));
      render();
    }, { signal });
    const off = sync.onStatus(s => {
      const el = root.querySelector("[data-cloud-status]");
      if (el) el.innerHTML = cloudStatus(s);
    });
    signal.addEventListener("abort", off);

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
          alert(t("cal.restored"));
        } catch {
          alert(t("cal.badFile"));
        }
      }
    }, { signal });

    render();
  },
};
