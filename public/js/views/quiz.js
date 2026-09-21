import * as store from "../core/store.js";
import { say } from "../core/speech.js";
import { scheduledGroup } from "../core/schedule.js";
import { t, tx } from "../core/i18n.js";
import { esc, rich, ar, pageHead, shuffle, typing } from "../core/dom.js";
import { ALL_LETTERS, formsOf } from "../data/letters.js";
import { groupChips } from "./letters.js";

// Kept at module level so the score survives switching pages until you reload.
let q = null;
const score = { right: 0, total: 0, run: 0 };

function newQuestion(groups) {
  const pool = ALL_LETTERS.filter(l => groups.includes(l.group));
  const answer = pool[Math.floor(Math.random() * pool.length)];
  const forms = formsOf(answer);
  const form = forms[Math.floor(Math.random() * forms.length)];
  // Distractors come from the same groups first, so you tell apart letters you're actually learning.
  const same = shuffle(pool.filter(l => l !== answer));
  const rest = shuffle(ALL_LETTERS.filter(l => l !== answer && !same.includes(l)));
  q = { answer, form, options: shuffle([answer, ...[...same, ...rest].slice(0, 3)]), picked: null };
}

export default {
  titleKey: "quiz.title",
  mount(root, { signal }) {
    const groups = () => store.get().script.quiz;
    if (!q || !groups().includes(q.answer.group)) newQuestion(groups());

    const render = () => {
      const { done } = store.get().script;
      const answered = q.picked !== null;
      const right = answered && q.options[q.picked] === q.answer;
      root.innerHTML = `
        ${pageHead(t("quiz.title"), t("quiz.sub"))}
        ${groupChips({ isOn: i => groups().includes(i), done, scheduled: scheduledGroup() })}
        <div class="quiz">
          <div class="qglyph">${ar(q.form[0])}<small>${t("quiz.form", { form: t(q.form[1]) })}</small></div>
          <div class="qside">
            <div class="qhead"><p>${t("quiz.score")} <b>${score.right} / ${score.total}</b></p><p>${t("quiz.run")} <b>${score.run}</b></p></div>
            <div class="opts">${q.options.map((o, i) => {
              let cls = "opt";
              if (answered && o === q.answer) cls += " right";
              else if (answered && i === q.picked) cls += " wrong";
              return `<button class="${cls}" data-opt="${i}"${answered ? " disabled" : ""}><kbd>${i + 1}</kbd><b>${esc(o.translit)}</b><span>${esc(o.name)}</span></button>`;
            }).join("")}</div>
            <div class="fb" aria-live="polite">${answered ? `<b>${esc(t(right ? "quiz.right" : "quiz.wrong", { name: q.answer.name }))}</b> ${rich(tx(q.answer.sound))}` : ""}</div>
            <button class="next"${answered ? "" : " hidden"}>${t("quiz.next")} <kbd>Enter</kbd></button>
          </div>
        </div>`;
      if (answered) root.querySelector(".next").focus({ preventScroll: true });
    };

    const pick = i => {
      if (q.picked !== null || !q.options[i]) return;
      q.picked = i;
      const right = q.options[i] === q.answer;
      score.total++;
      score.right += right ? 1 : 0;
      score.run = right ? score.run + 1 : 0;
      say(q.answer.nameAr);
      render();
    };
    const next = () => {
      newQuestion(groups());
      render();
    };

    root.addEventListener("click", e => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.g !== undefined) {
        const i = +b.dataset.g;
        store.update(s => {
          const sel = s.script.quiz;
          s.script.quiz = sel.includes(i) ? sel.filter(x => x !== i) : [...sel, i];
          if (!s.script.quiz.length) s.script.quiz = [i];
        });
        next();
      } else if (b.dataset.opt !== undefined) pick(+b.dataset.opt);
      else if (b.classList.contains("next")) next();
    }, { signal });

    document.addEventListener("keydown", e => {
      if (typing(e) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^[1-4]$/.test(e.key)) pick(+e.key - 1);
      else if (e.key === "Enter" && q.picked !== null && !e.target.closest?.("button:not(.next)")) {
        e.preventDefault();
        next();
      }
    }, { signal });

    render();
  },
};
