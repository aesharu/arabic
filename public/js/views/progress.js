import * as store from "../core/store.js";
import { todayKey, addDays, format } from "../core/dates.js";
import { dayNumber, phaseTitle, stageProgress, STAGE_GATE, streak, longestStreak, bestDay, byMonth, habit, totals, learnedLetters, lettersIn } from "../core/schedule.js";
import { t, tx, tu, num, locale } from "../core/i18n.js";
import { esc, pageHead } from "../core/dom.js";
import { icon } from "../core/art.js";
import { columns } from "../core/charts.js";
import { progressNow } from "../core/cards.js";
import { allStandings } from "../core/game.js";
import { boardNow } from "./awards.js";
import { vocabNow, loadVocab } from "../core/vocab.js";
import { START, DAILY_GOAL_MIN } from "../config.js";
import { PHASES } from "../data/plan.js";
import { GROUPS } from "../data/letters.js";
import { WORDS } from "../data/words.js";
import { PHRASES } from "../data/phrases.js";
import { journeyParapet, minutesBetween, weeksSoFar } from "./shared.js";

const day = key => format(key, { day: "numeric", month: "short" }, locale());
const dayLong = key => format(key, { weekday: "short", day: "numeric", month: "short" }, locale());
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

// How many of the awards are won (core/game.js) — the tile links through to them.
const awardsWon = () => {
  const all = allStandings(boardNow());
  return { won: all.filter(x => x.have).length, all: all.length };
};

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
    const n = Math.max(1, dayNumber(today));
    const tot = totals(log);
    const hours = tot.minutes / 60;
    const days = streak(log, today);
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
    const weeksDone = weeksSoFar(today);
    const weekData = Array.from({ length: Math.max(weeksDone, 8) }, (_, i) => {
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

    // Quiz answers per day: correct (accent) stacked under wrong (grey) — emphasis, not two competing colors
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

    // The six stages as a ladder: what's behind you, the one you're on with how much is left, and what opens next.
    // No dates — a stage is finished when its letter groups or its words are.
    const sp = stageProgress(progressNow(vocabNow()?.notes));
    const atIndex = PHASES.indexOf(sp.phase);
    const gateText = p => {
      const gate = STAGE_GATE[p.id];
      return gate.letters ? t("stage.opensLetters", { need: num(gate.letters) }) : t("stage.opens", { need: num(gate.words) });
    };
    const stageLadder = `<ol class="stage-ladder">${PHASES.map((p, i) => {
      const state = i < atIndex ? "done" : i === atIndex ? "now" : "later";
      return `<li class="sl-step is-${state}">
        <span class="sl-mark" aria-hidden="true">${state === "done" ? icon("check") : num(i + 1)}</span>
        <span class="sl-body">
          <b>${esc(tx(phaseTitle(p)))}${p.cefr ? ` <span class="sl-cefr" dir="ltr">${esc(p.cefr)}</span>` : ""}</b>
          ${state === "now"
            ? `<span class="meter" role="meter" aria-valuemin="${sp.from}" aria-valuemax="${sp.need}" aria-valuenow="${sp.done}" aria-label="${esc(tx(phaseTitle(p)))}"><span style="width:${Math.max(0, Math.min(100, sp.pct)).toFixed(1)}%"></span></span>
               <small>${esc(t(`stage.gate.${sp.kind}`, { done: num(sp.done), need: num(sp.need) }))}</small>`
            : `<small>${esc(state === "done" ? tx(p.canDo) : gateText(p))}</small>`}
        </span>
      </li>`;
    }).join("")}</ol>
    ${sp.next ? `<p class="muted small sl-next">${esc(t("stage.next", { stage: tx(phaseTitle(sp.next)) }))} — ${esc(gateText(sp.phase))}</p>` : `<p class="muted small sl-next">${esc(t("stage.last"))}</p>`}
    <details class="sl-b1"><summary>${esc(t("cefr.what"))}</summary>
      <p>${esc(t("cefr.b1Means"))}</p>
      <ul><li>${esc(t("cefr.b1a"))}</li><li>${esc(t("cefr.b1b"))}</li><li>${esc(t("cefr.b1c"))}</li><li>${esc(t("cefr.b1d"))}</li></ul>
      <p class="muted small">${esc(t("cefr.b1Words"))}</p>
    </details>`;

    // The long view: every month studied, and the words known at the end of each one.
    const months = byMonth(log);
    const wordsByMonth = {};
    for (const [date, e] of Object.entries(log)) if (e.known) wordsByMonth[date.slice(0, 7)] = Math.max(wordsByMonth[date.slice(0, 7)] ?? 0, e.known);
    const monthName = m => format(`${m}-01`, { month: "short", year: "2-digit" }, locale());
    const monthChart = months.length ? columns({
      label: t("progress.hoursMonth"),
      data: months.map(m => ({ label: monthName(m.month), title: `${monthName(m.month)} · ${t("progress.daysStudied", { n: num(m.days) })}`, values: [Math.round((m.min / 60) * 10) / 10] })),
      series: [{ name: t("progress.hours"), cls: "" }],
      emptyText: t("progress.empty"),
      tableHead: [t("progress.month"), t("progress.hours")],
      showTable: t("progress.showTable"),
      hideTable: t("progress.hideTable"),
      width: 1180,
      height: 200,
    }) : "";
    const knownMonths = Object.keys(wordsByMonth).sort();
    const knownChart = knownMonths.length ? columns({
      label: t("progress.wordsKnown"),
      data: knownMonths.map(m => ({ label: monthName(m), title: monthName(m), values: [wordsByMonth[m]] })),
      series: [{ name: t("progress.wordsKnown"), cls: "" }],
      emptyText: t("progress.empty"),
      tableHead: [t("progress.month"), t("progress.wordsKnown")],
      showTable: t("progress.showTable"),
      hideTable: t("progress.hideTable"),
      width: 1180,
      height: 200,
    }) : "";
    const hb = habit(log, today);
    const bd = bestDay(log);
    const best = longestStreak(log);

    root.innerHTML = `
      ${pageHead(t("progress.title"), t("progress.sub"), "", "has-parapet", "spring")}
      ${journeyParapet(today)}
      <dl class="stats-row">
        ${tile(t("progress.dayNow"), t("day.n", { n }), "", `<p class="stat-note">${esc(tx(phaseTitle(sp.phase)))}</p>`, "hero")}
        ${tile(t("today.total"), num(hours, 1), tu("unit.hours", hours, { minimumFractionDigits: 1 }))}
        ${tile(t("today.streak"), days, tu("unit.days", days))}
        ${tile(t("today.studied"), tot.days, tu("unit.days", tot.days))}
        ${tile(t("progress.tasksDone"), tot.tasks)}
        ${(board => tile(t("aw.tile"), num(board.won), t("progress.of", { n: num(board.won), total: num(board.all) }),
          `<p class="stat-note"><a href="#/awards">${esc(t("aw.seeAll"))}</a></p>`))(awardsWon())}
        ${tile(t("progress.bestStreak"), best, tu("unit.days", best))}
        ${tile(t("progress.average"), num(Math.round(hb.average)), t("progress.aDay"))}
        ${tile(t("progress.share"), `${Math.round(hb.share * 100)}%`, t("progress.ofDays", { n: num(hb.since) }))}
        ${bd.min ? tile(t("progress.bestDay"), num(bd.min), `${tu("unit.minutes", bd.min)} · ${esc(day(bd.date))}`) : ""}
        ${tot.spoken ? tile(t("progress.spoken"), tot.spoken) : ""}
        ${tot.written ? tile(t("progress.written"), tot.written) : ""}
        ${tile(t("progress.accuracy"), tot.quizTotal ? `${pct(tot.quizRight, tot.quizTotal)}%` : "—", tot.quizTotal ? t("progress.of", { n: tot.quizRight, total: tot.quizTotal }) : "")}
      </dl>

      <div class="progress-grid">
        <section class="panel wide">
          <div class="panel-head"><h2>${t("progress.journey")}</h2>
            <span class="muted">${esc(tx(phaseTitle(sp.phase)))}</span></div>
          ${stageLadder}
        </section>
        ${months.length > 1 ? `<section class="panel wide">
          <div class="panel-head"><h2>${t("progress.hoursMonth")}</h2><span class="muted">${t("progress.hoursMonthSub")}</span></div>
          ${monthChart}
        </section>` : ""}
        ${knownMonths.length > 1 ? `<section class="panel wide">
          <div class="panel-head"><h2>${t("progress.wordsKnown")}</h2><span class="muted">${t("progress.wordsKnownSub")}</span></div>
          ${knownChart}
        </section>` : ""}
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
