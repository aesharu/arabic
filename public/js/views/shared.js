// Pieces more than one page draws.
import * as store from "../core/store.js";
import { addDays, format } from "../core/dates.js";
import { phaseFor, phaseTitle, TOTAL_DAYS } from "../core/schedule.js";
import { t, tx, locale } from "../core/i18n.js";
import { parapet } from "../core/charts.js";
import { START, GOAL } from "../config.js";
import { PHASES } from "../data/plan.js";

export const TOTAL_WEEKS = Math.ceil(TOTAL_DAYS / 7);

const shortDay = key => format(key, { day: "numeric", month: "short" }, locale());

// Minutes studied in [from, to], both inclusive.
export function minutesBetween(from, to) {
  const log = store.get().log;
  let sum = 0;
  for (let d = from; d <= to; d = addDays(d, 1)) sum += log[d]?.min ?? 0;
  return sum;
}

// The whole plan as a row of rooftop crenellations: past weeks filled in their stage's colour, this week outlined.
export function journeyParapet(today) {
  const weeks = [];
  for (let n = 1; n <= TOTAL_WEEKS; n++) {
    const start = addDays(START, (n - 1) * 7);
    const end = addDays(start, 6) > GOAL ? GOAL : addDays(start, 6);
    const phase = phaseFor(start);
    const min = minutesBetween(start, end < today ? end : today);
    const state = end < today ? "done" : start <= today ? "now" : "future";
    weeks.push({
      n,
      stage: phase.id,
      state: `${state}${state === "done" && !min ? " empty" : ""}`,
      title: t("today.weekTip", { n, dates: `${shortDay(start)} – ${shortDay(end)}` }),
      rows: [[t("today.weekMin", { min }), tx(phaseTitle(phase))]],
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
