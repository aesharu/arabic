import * as store from "../core/store.js";
import { todayKey, addDays, diffDays, format } from "../core/dates.js";
import { dayNumber, phaseFor, phaseTitle, TOTAL_DAYS, streak, totals, learnedLetters, lettersIn } from "../core/schedule.js";
import { t, tx, tu, num, locale } from "../core/i18n.js";
import { esc, pageHead } from "../core/dom.js";
import { columns } from "../core/charts.js";
import { START, DAILY_GOAL_MIN } from "../config.js";
import { PHASES } from "../data/plan.js";
import { GROUPS } from "../data/letters.js";
import { WORDS } from "../data/words.js";
import { PHRASES } from "../data/phrases.js";
import { journeyParapet, minutesBetween, TOTAL_WEEKS } from "./shared.js";

const day = key => format(key, { day: "numeric", month: "short" }, locale());
const dayLong = key => format(key, { weekday: "short", day: "numeric", month: "short" }, locale());
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

// The 28 days a chart shows: the first four weeks of the plan, then always the last 28 days.
function window28(today) {
  const end = dayNumber(today) < 28 ? addDays(START, 27) : today;
  return Array.from({ length: 28 }, (_, i) => addDays(end, i - 27));
}

const tile = (label, value, unit = "", extra = "", cls = "") =>
  `<div class="stat${cls ? " " + cls : ""}"><dt>${label}</dt><dd>${value} ${unit ? `<small>${unit}</small>` : ""}</dd>${extra}</div>`;

const meterRow = (label, n, total) => `
  <div><dt>${label} <span>${t("progress.of", { n, total })}</span></dt>
  <dd><span class="meter" role="meter" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${n}" aria-label="${esc(label)}"><span style="width:${pct(n, total)}%"></span></span></dd></div>`;

export default {
  titleKey: "progress.title",
  mount(root) {
    const today = todayKey();
    const s = store.get();
    const log = s.log;
    const n = Math.max(1, Math.min(TOTAL_DAYS, dayNumber(today)));
    const tot = totals(log);
    const hours = tot.minutes / 60;
    const days = streak(log, today);
    const phase = phaseFor(today < START ? START : today);
    const phaseLen = diffDays(phase.start, phase.end) + 1;
    const phaseDay = Math.max(1, diffDays(phase.start, today) + 1);
    const table = { showTable: t("progress.showTable"), hideTable: t("progress.hideTable") };

    // Minutes per day, last 28 days
    const win = window28(today);
    const minuteChart = columns({
      label: t("progress.minutesDay"),
      data: win.map(d => ({ label: day(d), title: dayLong(d), values: [d > today ? 0 : log[d]?.min ?? 0] })),
      series: [{ name: t("progress.minutes"), cls: "" }],
      goal: DAILY_GOAL_MIN,
      goalLabel: `${t("progress.goal")} ${DAILY_GOAL_MIN}`,
      emptyText: t("progress.empty"),
      tableHead: [t("progress.date"), t("progress.minutes")],
      width: 1180,
      height: 230,
      ...table,
    });

    // Hours per week, every week so far
    const weeksSoFar = Math.max(1, Math.min(TOTAL_WEEKS, Math.floor((n - 1) / 7) + 1));
    const weekData = Array.from({ length: Math.max(weeksSoFar, 8) }, (_, i) => {
      const start = addDays(START, i * 7);
      const end = addDays(start, 6);
      const h = start > today ? 0 : minutesBetween(start, end > today ? today : end) / 60;
      return { label: String(i + 1), title: `${t("cal.week", { n: i + 1 })} · ${day(start)} – ${day(end)}`, values: [Math.round(h * 10) / 10] };
    });
    const weekGoal = (DAILY_GOAL_MIN * 7) / 60;
    const hoursChart = columns({
      label: t("progress.hoursWeek"),
      data: weekData,
      series: [{ name: t("progress.hours"), cls: "" }],
      goal: weekGoal,
      goalLabel: `${t("progress.goal")} ${num(weekGoal)}`,
      format: v => num(v, v % 1 ? 1 : 0),
      emptyText: t("progress.empty"),
      tableHead: [t("progress.week"), t("progress.hours")],
      width: 560,
      ...table,
    });

    // Quiz answers per day: correct (accent) stacked under wrong (grey) — emphasis, not two competing colours
    const quizChart = columns({
      label: t("progress.quiz"),
      data: win.map(d => ({ label: day(d), title: dayLong(d), values: [log[d]?.quiz?.right ?? 0, (log[d]?.quiz?.total ?? 0) - (log[d]?.quiz?.right ?? 0)] })),
      series: [{ name: t("progress.correct"), cls: "" }, { name: t("progress.wrong"), cls: "deemph" }],
      emptyText: t("progress.empty"),
      tableHead: [t("progress.date"), t("progress.correct"), t("progress.wrong")],
      width: 560,
      ...table,
    });

    // Alphabet
    const groupsDone = s.script.done.length;
    const known = learnedLetters(s.script.done, today);
    const readable = WORDS.filter(w => lettersIn(w.ar).every(c => known.has(c))).length;
    const phrasesMet = PHRASES.filter(p => p.day <= n).length;

    // Stage bar: six segments sized by length, today's position marked
    const span = TOTAL_DAYS;
    const todayPos = pct(Math.min(span, n), span);
    const stageBar = `
      <div class="stage-bar" dir="ltr" role="img" aria-label="${esc(t("progress.journey"))}">
        ${PHASES.map(p => {
          const len = diffDays(p.start, p.end) + 1;
          return `<div class="p${p.id}" style="flex:${len}" tabindex="0" data-tip="${esc(tx(phaseTitle(p)))}" data-rows="${esc(`${day(p.start)} – ${day(p.end)}||`)}"></div>`;
        }).join("")}
        <span class="today-mark" style="left:${todayPos}%"></span>
      </div>
      <div class="stage-names-row" dir="ltr">${PHASES.map(p => `<span style="flex:${diffDays(p.start, p.end) + 1}">${esc(tx(p.label))}</span>`).join("")}</div>`;

    root.innerHTML = `
      ${pageHead(t("progress.title"), t("progress.sub"), "", "has-parapet")}
      ${journeyParapet(today)}
      <dl class="stats-row">
        ${tile(t("progress.journey"), t("day.n", { n }), t("day.of", { total: TOTAL_DAYS }), `<span class="meter" aria-hidden="true"><span style="width:${pct(n, TOTAL_DAYS)}%"></span></span>`, "hero")}
        ${tile(t("today.total"), num(hours, 1), tu("unit.hours", hours, { minimumFractionDigits: 1 }))}
        ${tile(t("today.streak"), days, tu("unit.days", days))}
        ${tile(t("today.studied"), tot.days, tu("unit.days", tot.days))}
        ${tile(t("progress.tasksDone"), tot.tasks)}
        ${tile(t("progress.accuracy"), tot.quizTotal ? `${pct(tot.quizRight, tot.quizTotal)}%` : "—", tot.quizTotal ? t("progress.of", { n: tot.quizRight, total: tot.quizTotal }) : "")}
      </dl>

      <div class="progress-grid">
        <section class="panel wide">
          <div class="panel-head"><h2>${t("progress.journey")}</h2>
            <span class="muted">${esc(t("progress.stageNow", { n: phaseDay, len: phaseLen, stage: tx(phaseTitle(phase)) }))}</span></div>
          ${stageBar}
        </section>
        <section class="panel wide">
          <div class="panel-head"><h2>${t("progress.minutesDay")}</h2><span class="muted">${t("progress.minutesSub", { goal: DAILY_GOAL_MIN })}</span></div>
          ${minuteChart}
        </section>
        <section class="panel">
          <div class="panel-head"><h2>${t("progress.hoursWeek")}</h2></div>
          <p class="muted small">${t("progress.hoursSub", { goal: num(weekGoal) })}</p>
          ${hoursChart}
        </section>
        <section class="panel">
          <div class="panel-head"><h2>${t("progress.quiz")}</h2></div>
          <p class="muted small">${t("progress.quizSub")}</p>
          ${quizChart}
        </section>
        <section class="panel wide">
          <h2>${t("progress.script")}</h2>
          <dl class="meters">
            ${meterRow(t("progress.letters"), groupsDone, GROUPS.length)}
            ${meterRow(t("progress.readable"), readable, WORDS.length)}
            ${meterRow(t("progress.phrasesMet"), phrasesMet, PHRASES.length)}
          </dl>
        </section>
      </div>`;
  },
};
