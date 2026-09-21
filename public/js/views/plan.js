import { todayKey, shortDate, diffDays } from "../core/dates.js";
import { phaseFor, phaseTitle } from "../core/schedule.js";
import { t, tx, locale } from "../core/i18n.js";
import { esc, ar, pageHead } from "../core/dom.js";
import { START, GOAL } from "../config.js";
import { PHASES } from "../data/plan.js";

// NAJDI-PLAN.md Parts 2–3, with today's stage highlighted.
const BLOCKS = PHASES[1].routine;
const WEEK = PHASES[1].weekly;
const lowerFirst = s => s.charAt(0).toLocaleLowerCase() + s.slice(1);

export default {
  titleKey: "plan.title",
  mount(root) {
    const today = todayKey();
    const current = phaseFor(today);
    const date = d => esc(shortDate(d, locale()));
    const phrase = `${ar("وش تسوين؟", "ar-in")} <i>wesh tsawwīn?</i>`;

    root.innerHTML = `
      ${pageHead(t("plan.title"), t("plan.sub"), t("plan.eyebrow", { start: date(START), goal: date(GOAL) }))}

      <div class="plan-intro">
        <section class="panel">
          <h2>${t("plan.method")}</h2>
          <p class="big">${t("plan.methodText")}</p>
          <p class="muted">${t("plan.chunks", { phrase })}</p>
        </section>
        <section class="panel">
          <h2>${t("plan.words")}</h2>
          <ul class="checks">
            <li>${t("plan.w150")}</li>
            <li>${t("plan.w500")}</li>
            <li>${t("plan.w1000")}</li>
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
                <h2>${esc(tx(phaseTitle(p)))} ${isNow ? `<span class="now-tag">${t("plan.here")}</span>` : ""}</h2>
                <p class="muted">${t("plan.meta", { when: esc(tx(p.when)), start: date(p.start), end: date(p.end), words: esc(tx(p.words)) })}</p>
              </div>
            </div>
            ${isNow ? `<span class="meter" aria-label="${esc(t("plan.dayInStage", { n: into, len }))}"><span style="width:${((into / len) * 100).toFixed(1)}%"></span></span>` : ""}
            <p class="phase-focus">${esc(t("plan.canDo", { text: lowerFirst(tx(p.canDo)) }))}</p>
            ${p.note ? `<p class="muted">${esc(tx(p.note))}</p>` : ""}
          </li>`;
        }).join("")}
      </ol>

      <div class="plan-intro">
        <section class="panel">
          <h2>${t("plan.normalDay")}</h2>
          <p class="muted">${t("plan.normalDayHint")}</p>
          <ul class="checks">${BLOCKS.map(b => `<li><b>${t("min", { n: b.min })}</b> — ${esc(tx(b.text))}</li>`).join("")}</ul>
        </section>
        <section class="panel">
          <h2>${t("plan.normalWeek")}</h2>
          <ul class="checks">${WEEK.map(w => `<li>${esc(tx(w))}</li>`).join("")}</ul>
        </section>
      </div>

      <section class="panel">
        <h2>${t("plan.help")}</h2>
        <ul class="checks">
          <li>${t("plan.help1")}</li>
          <li>${t("plan.help2")}</li>
          <li>${t("plan.help3")}</li>
          <li>${t("plan.help4")}</li>
        </ul>
        <p class="muted small">${t("plan.source")}</p>
      </section>`;
  },
};
