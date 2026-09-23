// Pieces more than one page draws.
import * as store from "../core/store.js";
import { addDays, format } from "../core/dates.js";
import { phaseTitle, stageNow, dayNumber } from "../core/schedule.js";
import { progressNow } from "../core/cards.js";
import { vocabNow } from "../core/vocab.js";
import { t, tx, tu, num, locale } from "../core/i18n.js";
import { esc } from "../core/dom.js";
import { parapet } from "../core/charts.js";
import { START } from "../config.js";
import { PHASES } from "../data/plan.js";

// How many weeks the parapet shows: every week studied so far, and always at least a season ahead to grow into.
export const WEEKS_AHEAD = 8;
export const PLAN_WEEKS = 67; // the weeks NAJDI-PLAN.md writes out, for numbering the printable tracker
export const weeksSoFar = today => Math.max(1, Math.ceil(dayNumber(today) / 7));

const shortDay = key => format(key, { day: "numeric", month: "short" }, locale());

// Minutes studied in [from, to], both inclusive.
export function minutesBetween(from, to) {
  const log = store.get().log;
  let sum = 0;
  for (let d = from; d <= to; d = addDays(d, 1)) sum += log[d]?.min ?? 0;
  return sum;
}

// The weeks you have studied, as a row of rooftop crenellations — it grows with you instead of counting down
// to a date: every week so far, filled when you studied that week, plus a few empty ones ahead.
export function journeyParapet(today) {
  const stage = stageNow(progressNow(vocabNow()?.notes));
  const upto = weeksSoFar(today);
  const weeks = [];
  for (let n = 1; n <= upto + WEEKS_AHEAD; n++) {
    const start = addDays(START, (n - 1) * 7);
    const end = addDays(start, 6);
    const min = minutesBetween(start, end < today ? end : today);
    const state = n < upto ? "done" : n === upto ? "now" : "future";
    weeks.push({
      n,
      stage: stage.id,
      state: `${state}${state === "done" && !min ? " empty" : ""}`,
      title: t("today.weekTip", { n, dates: `${shortDay(start)} – ${shortDay(end)}` }),
      rows: [[t("today.weekMin", { min }), tx(phaseTitle(stage))]],
    });
  }
  return parapet({ weeks, label: t("progress.journey"), stageLabels: PHASES.map(p => tx(p.label)) });
}

// A ring that fills as today's minutes approach the goal.
export function ring(fraction, size = 86) {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.min(1, Math.max(0, fraction)));
  return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
    <circle class="track" cx="${size / 2}" cy="${size / 2}" r="${r}"/>
    <circle class="fill" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
  </svg>`;
}

// A deck's name in the current language.
export function deckName(id) {
  if (id === "phrases") return t("cards.deckPhrases");
  if (id === "love") return t("cards.deckLove");
  if (id === "hers") return t("cards.deckHers");
  if (["1", "2", "3"].includes(id)) return tx(phaseTitle(PHASES[+id]));
  return t(id === "4" ? "words.her" : id === "special" ? "words.special" : "words.grammar");
}

// "You know 37 words": the words you've learned on the way to 1000, with the plan's milestones (Part 2).
const MILESTONES = [150, 500, 1000];
export function wordsMeter({ learned, strong, seen }) {
  const goal = 1000;
  const pct = n => Math.min(100, (n / goal) * 100).toFixed(1);
  const next = MILESTONES.find(m => m > learned) ?? goal;
  return `
    <div class="words-meter">
      <p class="words-big"><b>${num(learned)}</b> <span>${esc(t("cards.wordsKnown", { goal: num(goal) }))}</span></p>
      <div class="wm-track" role="meter" aria-valuemin="0" aria-valuemax="${goal}" aria-valuenow="${learned}" aria-label="${esc(t("cards.wordsKnownLabel"))}">
        <span class="wm-strong" style="width:${pct(strong)}%"></span>
        <span class="wm-learned" style="width:${pct(Math.max(0, learned - strong))}%"></span>
        ${MILESTONES.map(m => `<i class="wm-mark${learned >= m ? " is-passed" : ""}" style="inset-inline-start:${pct(m)}%"><b>${num(m)}</b></i>`).join("")}
      </div>
      <p class="wm-legend">
        <span><i class="wm-key strong"></i>${esc(t("cards.strong", { n: num(strong) }))}</span>
        <span><i class="wm-key learned"></i>${esc(t("cards.learnedN", { n: num(Math.max(0, learned - strong)) }))}</span>
        <span class="muted">${esc(t("cards.seenN", { n: num(seen) }))} · ${esc(t("cards.nextMilestone", { n: num(next - learned), m: num(next), words: tu("unit.words", next - learned) }))}</span>
      </p>
    </div>`;
}
