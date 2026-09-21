import { todayKey, shortDate, diffDays } from "../core/dates.js";
import { phaseFor, phaseTitle } from "../core/schedule.js";
import { esc, rich, pageHead } from "../core/dom.js";
import { START, GOAL } from "../config.js";
import { PHASES } from "../data/plan.js";

// NAJDI-PLAN.md Parts 2–3, with today's stage highlighted.
const BLOCKS = PHASES[1].routine;
const WEEK = PHASES[1].weekly;

export default {
  title: "The plan",
  mount(root) {
    const today = todayKey();
    const current = phaseFor(today);

    root.innerHTML = `
      ${pageHead("The plan", "Talk with one person, in her dialect, about everyday life. Not movies, not news, not formal Arabic — Riyadh Najdi, spoken.", `${esc(shortDate(START))} → ${esc(shortDate(GOAL))} · 1–2 hours a day`)}

      <div class="plan-intro">
        <section class="panel">
          <h2>The method in one sentence</h2>
          <p class="big">Learn words <b>inside sentences</b>, speak <b>from week 3</b>, and let <b>her voice notes</b> be your main listening.</p>
          <p class="muted">Memorised chunks first — you learn ${rich("وش تسوين؟")} <i>wesh tsawwīn?</i> as one piece, like a word. Grammar comes later to explain what you already say.</p>
        </section>
        <section class="panel">
          <h2>How many words, honestly</h2>
          <ul class="checks">
            <li><b>~150 words + ~50 fixed phrases</b> — greet her, ask how she is, say what you're doing, survive a voice note.</li>
            <li><b>~500 words</b> — real daily conversation about your day, food, plans, feelings, family. Slow, with gaps, but real.</li>
            <li><b>~1000 words</b> — comfortable. You follow her normal-speed voice notes on familiar topics and tell stories about your week.</li>
          </ul>
        </section>
      </div>

      <ol class="phases">
        ${PHASES.map(p => {
          const isNow = current?.id === p.id;
          const len = diffDays(p.start, p.end) + 1;
          const into = isNow ? diffDays(p.start, today) + 1 : 0;
          return `
          <li class="phase p${p.id}${isNow ? " is-now" : ""}${today > p.end ? " is-past" : ""}">
            <div class="phase-head">
              <span class="phase-n" aria-hidden="true">${p.id === 1 ? "✎" : p.id - 1}</span>
              <div>
                <h2>${esc(phaseTitle(p))} ${isNow ? `<span class="now-tag">You are here</span>` : ""}</h2>
                <p class="muted">${esc(p.when)} · ${esc(shortDate(p.start))} – ${esc(shortDate(p.end))} · words: ${esc(p.words)}</p>
              </div>
            </div>
            ${isNow ? `<span class="meter" aria-label="Day ${into} of ${len} in this stage"><span style="width:${((into / len) * 100).toFixed(1)}%"></span></span>` : ""}
            <p class="phase-focus">You can… ${esc(p.canDo.charAt(0).toLowerCase() + p.canDo.slice(1))}</p>
            ${p.note ? `<p class="muted">${esc(p.note)}</p>` : ""}
          </li>`;
        }).join("")}
      </ol>

      <div class="plan-intro">
        <section class="panel">
          <h2>A normal day — 90 minutes</h2>
          <p class="muted">From week 3. The two Script weeks are planned day by day instead — see <a href="#/today">Today</a> and the <a href="#/calendar">Calendar</a>.</p>
          <ul class="checks">${BLOCKS.map(b => `<li><b>${b.min} min</b> — ${esc(b.text)}</li>`).join("")}</ul>
        </section>
        <section class="panel">
          <h2>A normal week</h2>
          <ul class="checks">${WEEK.map(w => `<li>${esc(w)}</li>`).join("")}</ul>
        </section>
      </div>

      <section class="panel">
        <h2>How she can help — without becoming your teacher</h2>
        <ul class="checks">
          <li>Ask for <b>voice notes, not text.</b> Najdi is barely written; text quietly teaches formal spellings and hides pronunciation.</li>
          <li>Ask her for <b>one word a day</b> — any word she'd use. These become Stages 4–5.</li>
          <li>Ask her to correct <b>one thing per conversation</b>, not everything.</li>
          <li>The tutor handles grammar and drills. She's for real life.</li>
        </ul>
        <p class="muted small">Source: NAJDI-PLAN.md, Parts 2–3.</p>
      </section>`;
  },
};
