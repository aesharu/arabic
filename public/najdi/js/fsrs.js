// FSRS-5 memory model (the scheduler modern Anki uses) with Anki-style learning steps.
// Card state: { state: "learning"|"review"|"relearning", step, s (stability, days), d (difficulty 1–10),
//               due (ms), last (ms), ivl (days), reps, lapses }
export const MIN = 60e3, HOUR = 36e5, DAY = 864e5;
const ROLLOVER = 4 * HOUR;                       // a new study day starts at 4am, like Anki
const LEARN_STEPS = [1 * MIN, 10 * MIN];
const RELEARN_STEPS = [10 * MIN];
const MAX_IVL = 3650;

// FSRS-5 default parameters
const W = [0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575, 0.1192,
           1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621];
const DECAY = -0.5, FACTOR = 19 / 81;

export function dayStart(now = Date.now()) {
  const d = new Date(now - ROLLOVER);
  d.setHours(0, 0, 0, 0);
  return d.getTime() + ROLLOVER;
}
export const dayKey = (now = Date.now()) => {
  const d = new Date(dayStart(now));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const clampD = d => Math.min(10, Math.max(1, d));
export const retrievability = (days, s) => Math.pow(1 + FACTOR * days / s, DECAY);
const intervalFor = (s, r) => (s / FACTOR) * (Math.pow(r, 1 / DECAY) - 1);
const initS = g => W[g - 1];
const initD = g => clampD(W[4] - Math.exp(W[5] * (g - 1)) + 1);
function nextD(d, g) {
  const damped = d + (-W[6] * (g - 3)) * (10 - d) / 9;
  return clampD(W[7] * initD(4) + (1 - W[7]) * damped);
}
function recallS(d, s, r, g) {
  const hard = g === 2 ? W[15] : 1, easy = g === 4 ? W[16] : 1;
  return s * (1 + Math.exp(W[8]) * (11 - d) * Math.pow(s, -W[9]) * (Math.exp(W[10] * (1 - r)) - 1) * hard * easy);
}
function forgetS(d, s, r) {
  return Math.min(s, W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r)));
}
const shortS = (s, g) => s * Math.exp(W[17] * (g - 3 + W[18]));

const ivlDays = (s, retention) => Math.min(MAX_IVL, Math.max(1, Math.round(intervalFor(s, retention))));

/** Returns the new state after grading `prev` (undefined = new card) with g ∈ 1..4. */
export function schedule(prev, g, now = Date.now(), retention = 0.9) {
  const c = prev ? { ...prev } : { state: "new", step: 0, s: 0, d: 0, ivl: 0, reps: 0, lapses: 0, last: 0, due: now };
  const today = dayStart(now);
  const elapsed = c.last ? Math.max(0, Math.round((today - dayStart(c.last)) / DAY)) : 0;
  const toReview = days => { c.state = "review"; c.step = 0; c.ivl = days; c.due = today + days * DAY; };

  if (c.state === "new") {
    c.s = initS(g); c.d = initD(g); c.state = "learning"; c.step = 0;
  } else if (elapsed === 0) {
    c.s = shortS(c.s, g); c.d = nextD(c.d, g);
  } else {
    const r = retrievability(elapsed, c.s);
    if (c.state === "review" && g > 1) {
      // Keep Hard < Good < Easy by at least a day, like Anki.
      const [h, gd, e] = [2, 3, 4].map(x => ivlDays(recallS(c.d, c.s, r, x), retention));
      const good = Math.max(gd, h + 1), easy = Math.max(e, good + 1);
      c.s = recallS(c.d, c.s, r, g); c.d = nextD(c.d, g);
      c.reps++; c.last = now;
      toReview(g === 2 ? h : g === 3 ? good : easy);
      return c;
    }
    c.s = g === 1 ? forgetS(c.d, c.s, r) : recallS(c.d, c.s, r, g);
    c.d = nextD(c.d, g);
  }
  c.reps++; c.last = now;

  if (c.state === "review") {
    // g === 1 here (other review grades returned above, or same-day review of a review card)
    if (g === 1) { c.lapses++; c.state = "relearning"; c.step = 0; c.due = now + RELEARN_STEPS[0]; }
    else toReview(Math.max(c.ivl, ivlDays(c.s, retention)));
    return c;
  }
  const steps = c.state === "relearning" ? RELEARN_STEPS : LEARN_STEPS;
  if (g === 1) { c.step = 0; c.due = now + steps[0]; }
  else if (g === 2) c.due = now + (c.step === 0 && steps.length > 1 ? (steps[0] + steps[1]) / 2 : steps[c.step] * 1.5);
  else if (g === 3 && c.step + 1 < steps.length) { c.step++; c.due = now + steps[c.step]; }
  else toReview(ivlDays(c.s, retention));   // stability already reflects Good vs Easy
  return c;
}

/** Human label for when a card would next be shown after grading. */
export function previewLabel(prev, g, now, retention) {
  const c = schedule(prev, g, now, retention);
  return c.state === "review" ? fmtDays(c.ivl) : fmtDuration(c.due - now);
}

export function fmtDuration(ms) {
  if (ms < HOUR) return Math.max(1, Math.round(ms / MIN)) + "m";
  if (ms < DAY) return Math.round(ms / HOUR) + "h";
  return fmtDays(Math.round(ms / DAY));
}
export function fmtDays(d) {
  if (d < 30) return d + "d";
  if (d < 365) return +(d / 30).toFixed(1) + "mo";
  return +(d / 365).toFixed(1) + "y";
}

/** Probability you'd recall the card right now. */
export function recallNow(c, now = Date.now()) {
  if (!c || !c.s) return 0;
  return retrievability(Math.max(0, (now - c.last) / DAY), c.s);
}
