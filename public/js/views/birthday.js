// Her birthday — Volodymyr's goal: a simple conversation (A1) by 21 December, and on 9 February (her birthday,
// 2 Ramadan 1448) birthday wishes by heart and a real talk in her dialect (A2). Only in his profile: a surprise.
//   #/birthday
import { t, tx, num, locale } from "../core/i18n.js";
import { esc, ar, translit, flag, playIcon, pageHead } from "../core/dom.js";
import { icon } from "../core/art.js";
import { todayKey, diffDays, longDate } from "../core/dates.js";
import * as store from "../core/store.js";
import { BIRTHDAY, A1_BY, GOALS, SPEECH } from "../data/birthday.js";

let testing = false; // "test me": the Arabic is hidden until the line is tapped

const goalRow = g => {
  const done = store.get().goals.done.includes(g.id);
  return `<li class="bd-goal${done ? " is-done" : ""}">
    <label class="check"><input type="checkbox" data-goal="${g.id}"${done ? " checked" : ""}${store.watching() ? " disabled" : ""}> <span>${esc(tx(g))}</span></label>
    <a class="bd-go" href="${g.link}" aria-label="${esc(t("bday.practise"))}">${icon("arrow")}</a>
  </li>`;
};

const goalList = level => {
  const list = GOALS.filter(g => g.level === level);
  const done = list.filter(g => store.get().goals.done.includes(g.id)).length;
  return { html: `<ol class="bd-goals">${list.map(goalRow).join("")}</ol>`, done, total: list.length };
};

const line = (x, i) => `
  <li><button class="phrase bd-line" data-say="${esc(x.ar)}" data-line="${i}">
    <span class="bd-n">${num(i + 1)}</span>
    <span class="bd-body">
      <span class="bd-ar">${ar(x.ar, "phrase-ar")}</span>
      <span class="phrase-t"><span class="bd-say">${translit(x.say)} ${x.check ? flag({ check: true }) : ""}</span>
        <span class="gr-mean">${esc(tx({ en: x.en, uk: x.uk, najdi: x.en, msa: x.en }))}</span></span>
    </span>${playIcon}</button></li>`;

export default {
  titleKey: "bday.title",
  mount(root, { signal }) {
    if (store.isTeacher()) {
      location.replace("#/today"); // her birthday surprise isn't in her profile
      return;
    }
    const render = () => {
      const today = todayKey();
      const left = Math.max(0, diffDays(today, BIRTHDAY));
      const leftA1 = Math.max(0, diffDays(today, A1_BY));
      const a1 = goalList("a1");
      const a2 = goalList("a2");
      root.innerHTML = `${pageHead(t("bday.title"), esc(t("bday.sub")), "", "", "finish")}
        <section class="bd-count">
          <div class="bd-days"><b>${num(left)}</b><span>${esc(t("bday.daysLeft"))}</span><small>${esc(longDate(BIRTHDAY, locale()))}</small></div>
          <div class="bd-days is-a1"><b>${num(leftA1)}</b><span>${esc(t("bday.daysA1"))}</span><small>${esc(longDate(A1_BY, locale()))}</small></div>
        </section>
        <p class="callout bd-ramadan">${icon("star")} ${esc(t("bday.ramadan"))}</p>

        <section class="panel">
          <div class="panel-head"><h2>${esc(t("bday.a1"))}</h2><span class="bd-score">${esc(t("bday.score", { n: num(a1.done), total: num(a1.total) }))}</span></div>
          <span class="meter" aria-hidden="true"><span style="width:${(a1.done / a1.total) * 100}%"></span></span>
          ${a1.html}
        </section>
        <section class="panel">
          <div class="panel-head"><h2>${esc(t("bday.a2"))}</h2><span class="bd-score">${esc(t("bday.score", { n: num(a2.done), total: num(a2.total) }))}</span></div>
          <span class="meter" aria-hidden="true"><span style="width:${(a2.done / a2.total) * 100}%"></span></span>
          ${a2.html}
        </section>

        <section class="panel bd-speech${testing ? " is-testing" : ""}">
          <div class="panel-head"><h2>${icon("heart")} ${esc(t("bday.speech"))}</h2>
            <button type="button" class="btn" data-test aria-pressed="${testing}">${esc(t("bday.test"))}</button></div>
          <p class="muted">${esc(t(testing ? "bday.testHint" : "bday.speechSub"))}</p>
          <ol class="bd-lines">${SPEECH.map(line).join("")}</ol>
        </section>`;
    };
    render();
    root.addEventListener("change", e => {
      const box = e.target.closest("[data-goal]");
      if (!box) return;
      store.update(s => {
        const set = new Set(s.goals.done);
        box.checked ? set.add(box.dataset.goal) : set.delete(box.dataset.goal);
        s.goals.done = [...set];
      });
      render();
    }, { signal });
    root.addEventListener("click", e => {
      if (e.target.closest("[data-test]")) {
        testing = !testing;
        return render();
      }
      const l = e.target.closest("[data-line]");
      if (l && testing) l.classList.add("is-open"); // tapping reveals the line (and plays it)
    }, { signal });
  },
};
