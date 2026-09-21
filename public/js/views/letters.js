import * as store from "../core/store.js";
import { scheduledGroup } from "../core/schedule.js";
import { t, tx } from "../core/i18n.js";
import { esc, rich, ar, lat, translit, flag, flagNote, meanings, playIcon, pageHead } from "../core/dom.js";
import { GROUPS, formsOf } from "../data/letters.js";

export function groupChips({ isOn, done, scheduled }) {
  return `<div class="chips" role="group" aria-label="${esc(t("letters.groups"))}">${GROUPS.map((g, i) => `
    <button class="chip" data-g="${i}" aria-pressed="${isOn(i)}">
      <span class="d">${t("letters.days", { days: g.days })}</span>${ar(g.letters.map(l => l.char).join(" "))}
      ${done.includes(i) ? `<span class="ok" aria-label="${esc(t("letters.doneMark"))}">✓</span>` : ""}
      ${i === scheduled && !done.includes(i) ? `<span class="now">${t("letters.today")}</span>` : ""}
    </button>`).join("")}</div>`;
}

const card = l => `
  <article class="card">
    <div class="top">
      <button class="glyph ar" lang="ar" data-say="${esc(l.nameAr)}" aria-label="${esc(t("letters.hearName", { name: l.name }))}">${esc(l.char)}</button>
      <div class="meta">
        <div class="name"><b>${lat(l.name)}</b>${ar(l.nameAr)}
          ${l.hard ? `<span class="tag h">${t("letters.newSound")}</span>` : ""}${l.nonJoining ? `<span class="tag nc">${t("letters.nonJoining")}</span>` : ""}</div>
        <p class="sound">${rich(tx(l.sound))}</p>
        <p class="ua"><span>${t("lab.ua")}</span><bdi lang="uk">${esc(l.ua)}</bdi></p>
      </div>
    </div>
    <div class="forms">${formsOf(l).map(([f, key]) => `<div>${ar(f)}<small>${t(key)}</small></div>`).join("")}</div>
    <button class="ex" data-say="${esc(l.example.ar)}">${ar(l.example.ar)}
      <span class="t">${translit(l.example.tr)} ${flag(l)}${meanings(l.example)}</span>${playIcon}</button>
    ${flagNote(l)}
    ${l.najdi ? `<div class="najdi"><b>${t("lab.najdi")}</b> ${rich(tx(l.najdi))}</div>` : ""}
  </article>`;

export default {
  titleKey: "letters.title",
  mount(root, { params, signal }) {
    const fromUrl = parseInt(params[0], 10) - 1;
    const g = fromUrl >= 0 && fromUrl < GROUPS.length ? fromUrl : scheduledGroup();

    const render = () => {
      const { done } = store.get().script;
      const group = GROUPS[g];
      const isDone = done.includes(g);
      root.innerHTML = `
        ${pageHead(t("letters.title"), t("letters.sub"))}
        ${groupChips({ isOn: i => i === g, done, scheduled: scheduledGroup() })}
        <div class="gintro"><h2>${esc(tx(group.title))}</h2><p>${rich(tx(group.note))}</p></div>
        <div class="cards">${group.letters.map(card).join("")}</div>
        <button class="done" data-done aria-pressed="${isDone}">${t(isDone ? "letters.isDone" : "letters.markDone", { days: group.days })}</button>
        <p class="hint">${t("letters.hint")}</p>`;
    };

    root.addEventListener("click", e => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.g !== undefined) {
        location.hash = `#/letters/${+b.dataset.g + 1}`;
      } else if (b.hasAttribute("data-done")) {
        store.update(s => {
          const { script } = s;
          if (script.done.includes(g)) script.done = script.done.filter(x => x !== g);
          else {
            script.done = [...script.done, g];
            if (!script.quiz.includes(g)) script.quiz = [...script.quiz, g];
          }
        });
        render();
      }
    }, { signal });

    render();
  },
};
