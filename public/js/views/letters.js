import * as store from "../core/store.js";
import { scheduledGroup } from "../core/schedule.js";
import { esc, rich, ar, flag, flagNote, playIcon, pageHead } from "../core/dom.js";
import { GROUPS, formsOf } from "../data/letters.js";

export function groupChips({ isOn, done, scheduled }) {
  return `<div class="chips" role="group" aria-label="Letter groups">${GROUPS.map((g, i) => `
    <button class="chip" data-g="${i}" aria-pressed="${isOn(i)}">
      <span class="d">Days ${g.days}</span>${ar(g.letters.map(l => l.char).join(" "))}
      ${done.includes(i) ? `<span class="ok" aria-label="done">✓</span>` : ""}
      ${i === scheduled && !done.includes(i) ? `<span class="now" aria-label="today">today</span>` : ""}
    </button>`).join("")}</div>`;
}

const card = l => `
  <article class="card">
    <div class="top">
      <button class="glyph ar" lang="ar" data-say="${esc(l.nameAr)}" aria-label="Hear the name ${esc(l.name)}">${esc(l.char)}</button>
      <div class="meta">
        <div class="name"><b>${esc(l.name)}</b>${ar(l.nameAr)}
          ${l.hard ? `<span class="tag h">new sound</span>` : ""}${l.nonJoining ? `<span class="tag nc">never joins forward</span>` : ""}</div>
        <p class="sound">${rich(l.sound)}</p>
        <p class="ua"><span>UA</span>${esc(l.ua)}</p>
      </div>
    </div>
    <div class="forms">${formsOf(l).map(([f, label]) => `<div>${ar(f)}<small>${label}</small></div>`).join("")}</div>
    <button class="ex" data-say="${esc(l.example.ar)}">${ar(l.example.ar)}
      <span class="t"><b>${esc(l.example.tr)}</b> ${flag(l)}<span>${esc(l.example.en)}</span></span>${playIcon}</button>
    ${flagNote(l)}
    ${l.najdi ? `<div class="najdi"><b>Najdi:</b> ${rich(l.najdi)}</div>` : ""}
  </article>`;

export default {
  title: "Letters",
  mount(root, { params, signal }) {
    const fromUrl = parseInt(params[0], 10) - 1;
    const g = fromUrl >= 0 && fromUrl < GROUPS.length ? fromUrl : scheduledGroup();

    const render = () => {
      const { done } = store.get().script;
      const group = GROUPS[g];
      const isDone = done.includes(g);
      root.innerHTML = `
        ${pageHead("Letters", "28 letters in 12 days, learned by shape rather than alphabet order. Click a big letter to hear its name, or a word to hear it said.")}
        ${groupChips({ isOn: i => i === g, done, scheduled: scheduledGroup() })}
        <div class="gintro"><h2>${esc(group.title)}</h2><p>${rich(group.note)}</p></div>
        <div class="cards">${group.letters.map(card).join("")}</div>
        <button class="done" data-done aria-pressed="${isDone}">${isDone ? `Days ${group.days} done ✓` : `Mark days ${group.days} done`}</button>
        <p class="hint">Write every letter by hand, in every form, until you stop hesitating. Your hand learns shapes faster than your eyes do.</p>`;
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
