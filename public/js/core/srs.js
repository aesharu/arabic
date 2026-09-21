// Spaced repetition — the scheduler Anki uses (SM-2 with learning steps), as plain functions with no page code,
// so tests/srs.test.mjs can check every answer.
//
// A card is { s, due, ivl, ease, step, reps, lapses, last }:
//   s      0 new · 1 learning · 2 review · 3 relearning (forgot a review card)
//   due    learning/relearning: a timestamp in ms · review: a day "YYYY-MM-DD"
//   ivl    days until the next review (review cards; relearning cards keep the interval they return to)
//   ease   how fast the interval grows, 2.5 = ×2.5 per "Good"
//   last   the day of the last answer
// Answers: 1 Again · 2 Hard · 3 Good · 4 Easy.
import { addDays, diffDays } from "./dates.js";

export const SETTINGS = {
  learnSteps: [1, 10], // minutes
  relearnSteps: [10],
  graduatingIvl: 1, // days, after the last learning step
  easyIvl: 4, // days, "Easy" on a new card
  startEase: 2.5,
  minEase: 1.3,
  hardFactor: 1.2,
  easyBonus: 1.3,
  maxIvl: 36500,
};
const MIN = 60_000;

export const newCard = () => ({ s: 0, due: 0, ivl: 0, ease: SETTINGS.startEase, step: 0, reps: 0, lapses: 0, last: "" });

// Anki spreads reviews out by a few days so cards learned together don't stay together forever.
function fuzz(ivl, rand) {
  if (ivl < 3) return ivl;
  const spread = Math.max(1, Math.round(ivl * 0.05));
  return ivl + Math.round((rand() * 2 - 1) * spread);
}

const clampIvl = n => Math.min(SETTINGS.maxIvl, Math.max(1, Math.round(n)));

function graduate(card, ivl, today) {
  return { ...card, s: 2, step: 0, ivl, due: addDays(today, ivl) };
}

/**
 * answer(card, grade, { now, today, rand }) → the card after the answer.
 * now: ms timestamp · today: "YYYY-MM-DD" · rand: () => 0…1 (Math.random, or fixed in tests)
 */
export function answer(card, grade, { now, today, rand = Math.random }) {
  const c = { ...card, reps: card.reps + 1, last: today };
  const S = SETTINGS;

  if (c.s === 0 || c.s === 1) {
    const steps = S.learnSteps;
    const step = c.s === 0 ? 0 : c.step;
    if (grade === 1) return { ...c, s: 1, step: 0, due: now + steps[0] * MIN };
    if (grade === 2) {
      const delay = step === 0 && steps.length > 1 ? (steps[0] + steps[1]) / 2 : steps[step];
      return { ...c, s: 1, step, due: now + delay * MIN };
    }
    if (grade === 3) {
      if (step + 1 >= steps.length) return graduate(c, S.graduatingIvl, today);
      return { ...c, s: 1, step: step + 1, due: now + steps[step + 1] * MIN };
    }
    return graduate(c, S.easyIvl, today);
  }

  if (c.s === 3) {
    const steps = S.relearnSteps;
    if (grade === 1) return { ...c, step: 0, due: now + steps[0] * MIN };
    if (grade === 2) return { ...c, due: now + steps[c.step] * 1.5 * MIN };
    if (grade === 3) {
      if (c.step + 1 >= steps.length) return graduate(c, c.ivl, today);
      return { ...c, step: c.step + 1, due: now + steps[c.step + 1] * MIN };
    }
    return graduate(c, c.ivl + 1, today);
  }

  // Review card. Days late count for part of the new interval, as in Anki.
  const late = Math.max(0, diffDays(card.due, today));
  if (grade === 1) {
    return { ...c, s: 3, step: 0, lapses: c.lapses + 1, ease: Math.max(S.minEase, c.ease - 0.2), ivl: 1, due: now + S.relearnSteps[0] * MIN };
  }
  const hard = clampIvl(Math.max(c.ivl + 1, c.ivl * S.hardFactor));
  if (grade === 2) return { ...c, ease: Math.max(S.minEase, c.ease - 0.15), ivl: hard, due: addDays(today, hard) };
  const good = clampIvl(Math.max(hard + 1, (c.ivl + late / 2) * c.ease));
  if (grade === 3) {
    const ivl = clampIvl(fuzz(good, rand));
    return { ...c, ivl, due: addDays(today, ivl) };
  }
  const easy = clampIvl(Math.max(good + 1, (c.ivl + late) * c.ease * S.easyBonus));
  const ivl = clampIvl(fuzz(easy, rand));
  return { ...c, ease: c.ease + 0.15, ivl, due: addDays(today, ivl) };
}

// What each answer button would do, for the labels above the buttons: [{ ms } | { days }] × 4, without fuzz.
export function preview(card, { now, today }) {
  return [1, 2, 3, 4].map(g => {
    const next = answer(card, g, { now, today, rand: () => 0.5 });
    return next.s === 2 ? { days: diffDays(today, next.due) } : { ms: next.due - now };
  });
}

// Anki's words for how well a card is known.
export const isLearned = card => !!card && card.s === 2; // passed its learning steps at least once
export const isMature = card => !!card && card.s === 2 && card.ivl >= 21; // interval of three weeks or more
