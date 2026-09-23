// Awards: the level, the fire, the points and the thirty-three things you can win.
// Everything here is worked out from progress that already exists — nothing new to tick.
import * as store from "../core/store.js";
import { todayKey } from "../core/dates.js";
import { streak } from "../core/schedule.js";
import { t, num, said } from "../core/i18n.js";
import { esc, pageHead } from "../core/dom.js";
import { icon } from "../core/art.js";
import { wordStats } from "../core/cards.js";
import { vocabNow, loadVocab } from "../core/vocab.js";
import { BADGES, GROUPS, LEVELS, allStandings, levelOf, nextUp, scoreboard, XP } from "../core/game.js";
import { STORIES } from "../data/stories.js";
import { GOALS } from "../data/birthday.js";

const A1 = GOALS.filter(g => g.level === "a1").map(g => g.id);

// The board, out of whatever progress this profile has.
export function boardNow(today = todayKey()) {
  const s = store.get();
  const notes = vocabNow()?.notes;
  return scoreboard({
    log: s.log,
    script: s.script,
    reading: s.reading,
    goals: s.goals,
    words: notes ? wordStats(notes) : {},
    streak: streak(s.log, today),
    stories: STORIES.length,
    a1: A1,
    today,
  });
}

const flame = n => `<span class="fire fire-${n}" aria-hidden="true">${icon("flame")}</span>`;

const levelCard = b => {
  const lv = b.level;
  return `<div class="aw-level">
    <div class="aw-lv-top">
      <span class="aw-lv-n">${esc(t("aw.level", { n: num(lv.n) }))}</span>
      <b class="aw-lv-name">${esc(t(`lv.${lv.id}`))}</b>
    </div>
    <p class="aw-xp"><b>${num(b.xp)}</b> <small>${esc(t("aw.points"))}</small></p>
    <span class="meter aw-lv-bar" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(lv.pct)}" aria-label="${esc(t("aw.level", { n: num(lv.n) }))}">
      <span style="width:${Math.min(100, lv.pct).toFixed(1)}%"></span></span>
    <p class="aw-lv-left">${lv.next ? esc(t("aw.toNext", { n: num(lv.left), name: t(`lv.${lv.next.id}`) })) : esc(t("aw.top"))}</p>
  </div>`;
};

const fireCard = b => `<div class="aw-fire">
  ${flame(b.fire)}
  <p class="aw-fire-n"><b>${num(b.streak)}</b> <small>${esc(t("aw.streak"))}</small></p>
  ${b.streak === 0 ? `<p class="aw-fire-hint">${esc(t("aw.noStreak"))}</p>` : ""}
</div>`;

const todayCard = b => `<div class="aw-today">
  <p class="aw-today-n"><b>+${num(b.today)}</b> <small>${esc(t("aw.points"))}</small></p>
  <p class="aw-today-l">${esc(t("aw.todayPoints"))}</p>
</div>`;

const badge = x => `
  <li class="aw-badge${x.have ? " is-won" : ""}">
    <span class="aw-ico" aria-hidden="true">${icon(x.icon)}</span>
    <span class="aw-text">
      <b>${esc(t(`badge.${x.id}`))}</b>
      <small>${esc(t(`badge.${x.id}.sub`))}</small>
      ${x.have
        ? ""
        : `<span class="meter aw-b-bar" aria-hidden="true"><span style="width:${Math.min(100, x.pct).toFixed(1)}%"></span></span>
           <span class="aw-b-count" dir="ltr">${num(x.now)} / ${num(x.need)}</span>`}
    </span>
    ${x.have ? `<span class="aw-tick" aria-hidden="true">${icon("check")}</span>` : `<span class="aw-lock">${esc(t("aw.locked"))}</span>`}
  </li>`;

export default {
  titleKey: "aw.title",
  async mount(root) {
    await loadVocab();
    const b = boardNow();
    const all = allStandings(b);
    const won = all.filter(x => x.have);
    const close = nextUp(b, 3);
    const byId = Object.fromEntries(all.map(x => [x.id, x]));

    const groups = GROUPS.map(g => {
      const list = BADGES.filter(x => x.group === g).map(x => byId[x.id]);
      const n = list.filter(x => x.have).length;
      return `<section class="aw-group">
        <h2>${esc(t(`bg.${g}`))} <span class="aw-g-count">${esc(t("aw.won", { n: num(n), all: num(list.length) }))}</span></h2>
        <ul class="aw-list">${list.map(badge).join("")}</ul>
      </section>`;
    }).join("");

    root.innerHTML = `
      ${pageHead(t("aw.title"), t("aw.sub"), "", "", "star")}
      <div class="aw-top">${levelCard(b)}${fireCard(b)}${todayCard(b)}</div>
      <p class="aw-total">${esc(t("aw.won", { n: num(won.length), all: num(all.length) }))}</p>
      ${close.length
        ? `<section class="aw-next"><h2>${esc(t("aw.next"))}</h2>
            <ul class="aw-list">${close.map(badge).join("")}</ul></section>`
        : ""}
      ${groups}
      <details class="aw-how">
        <summary>${esc(t("aw.howPoints"))}</summary>
        <p>${esc(t("aw.howList"))}</p>
      </details>`;
  },
};
