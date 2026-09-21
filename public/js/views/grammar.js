// Grammar: the nine patterns from the plan, one lesson each — explanation, examples to hear, and a short quiz.
//   #/grammar        all nine
//   #/grammar/<n>    lesson n (1–9)
import { t, tx } from "../core/i18n.js";
import { esc, rich, ar, translit, flag, playIcon, pageHead, shuffle } from "../core/dom.js";
import { icon } from "../core/art.js";
import { GRAMMAR } from "../data/grammar.js";
import { speakText } from "../core/vocab.js";

const meaning = r => tx({ en: r.en, uk: r.uk, najdi: r.en, msa: r.en });
const second = r => tx({ en: r.uk, uk: r.en, najdi: r.uk, msa: r.uk });

const exampleRow = r => `
  <button class="phrase gr-row${r.her ? " is-her" : ""}" data-say="${esc(speakText(r.ar))}">
    ${ar(r.ar, "phrase-ar")}
    <span class="phrase-t">${translit(r.say)} ${r.check ? flag({ check: true, checkNote: r.note }) : ""}
      <span class="gr-mean">${esc(meaning(r))}</span>
      <span class="gr-mean-2">${esc(second(r))}</span>
      <span class="gr-msa"><i title="${esc(t("lab.msaHint"))}">${t("lab.msa")}</i> ${ar(r.msa)}</span>
      ${r.her ? `<span class="gr-her">${icon("star")}${t("grammar.toHer")}</span>` : ""}
      ${r.note && !r.check ? `<span class="pnote">${rich(tx(r.note))}</span>` : ""}</span>
    ${playIcon}
  </button>`;

// A few questions: the meaning is shown, pick the Najdi. Options are always different words.
function makeQuiz(lesson) {
  const pool = lesson.rows.filter((r, i, a) => a.findIndex(x => x.ar === r.ar) === i);
  return shuffle([...pool]).slice(0, Math.min(5, pool.length)).map(answer => {
    const others = shuffle(pool.filter(r => r !== answer)).slice(0, 3);
    return { answer, options: shuffle([answer, ...others]) };
  });
}

function list() {
  return `${pageHead(t("grammar.title"), esc(t("grammar.sub")), "", "", "reading")}
    <ol class="gr-list">${GRAMMAR.map(l => `<li><a class="gr-card" href="#/grammar/${l.id}">
      <span class="gr-num" aria-hidden="true">${l.id}</span>
      <span><b>${esc(tx(l.title))}</b><span class="gr-peek">${l.rows.slice(0, 3).map(r => ar(r.ar)).join(" · ")}</span></span>
      ${icon("arrow")}</a></li>`).join("")}</ol>`;
}

export default {
  titleKey: "grammar.title",
  mount(root, { params, signal }) {
    const lesson = GRAMMAR.find(l => l.id === params[0]);
    if (!lesson) {
      root.innerHTML = list();
      return;
    }
    const i = GRAMMAR.indexOf(lesson);
    const prev = GRAMMAR[i - 1];
    const next = GRAMMAR[i + 1];
    const quiz = makeQuiz(lesson);
    let q = 0;
    let right = 0;

    const quizHtml = () => {
      if (q >= quiz.length) {
        return `<p class="gr-score">${icon("check")} ${esc(t("grammar.score", { n: right, total: quiz.length }))}</p>
          <button type="button" class="btn" data-again>${t("grammar.again")}</button>`;
      }
      const { answer, options } = quiz[q];
      return `<p class="gr-q"><span class="muted">${esc(t("grammar.qOf", { n: q + 1, total: quiz.length }))}</span>
          <b>${esc(t("grammar.qSay", { what: meaning(answer) }))}</b></p>
        <div class="gr-options">${options.map((o, k) => `<button type="button" class="gr-opt" data-opt="${k}">${ar(o.ar)}</button>`).join("")}</div>`;
    };

    root.innerHTML = `
      <p class="gr-back"><a href="#/grammar">${icon("back")} ${t("grammar.all")}</a></p>
      ${pageHead(tx(lesson.title), "", t("grammar.lessonN", { n: lesson.id }), "", "reading")}
      <section class="panel gr-intro"><p>${rich(tx(lesson.intro))}</p>
        ${lesson.verb ? `<p class="gr-verb">${ar(lesson.verb.ar)} — ${esc(meaning(lesson.verb))} <span class="gr-msa"><i>${t("lab.msa")}</i> ${ar(lesson.verb.msa)}</span></p>` : ""}
      </section>
      <h2>${t("grammar.examples")}</h2>
      <div class="vocab gr-rows">${lesson.rows.map(exampleRow).join("")}</div>
      <section class="panel gr-quiz"><h2>${icon("quiz")} ${t("grammar.practice")}</h2><div data-quiz>${quizHtml()}</div></section>
      <nav class="gr-nav">
        ${prev ? `<a class="btn btn-ghost" href="#/grammar/${prev.id}">${icon("back")} ${esc(tx(prev.title))}</a>` : "<span></span>"}
        ${next ? `<a class="btn" href="#/grammar/${next.id}">${esc(tx(next.title))} ${icon("arrow")}</a>` : ""}
      </nav>`;

    const box = root.querySelector("[data-quiz]");
    box.addEventListener("click", e => {
      if (e.target.closest("[data-again]")) {
        quiz.splice(0, quiz.length, ...makeQuiz(lesson));
        q = right = 0;
        box.innerHTML = quizHtml();
        return;
      }
      const b = e.target.closest("[data-opt]");
      if (!b || box.querySelector(".is-right")) return;
      const { answer, options } = quiz[q];
      const chosen = options[+b.dataset.opt];
      const ok = chosen === answer;
      if (ok) right++;
      box.querySelectorAll("[data-opt]").forEach(x => {
        x.disabled = true;
        if (options[+x.dataset.opt] === answer) x.classList.add("is-right");
      });
      if (!ok) b.classList.add("is-wrong");
      box.insertAdjacentHTML("beforeend", `<p class="gr-feedback">${ar(answer.ar)} ${translit(answer.say)} — ${esc(meaning(answer))}</p>
        <button type="button" class="btn" data-next>${t("grammar.next")} ${icon("arrow")}</button>`);
      box.querySelector("[data-next]").focus();
    }, { signal });
    box.addEventListener("click", e => {
      if (!e.target.closest("[data-next]")) return;
      q++;
      box.innerHTML = quizHtml();
      box.querySelector("button")?.focus();
    }, { signal });
  },
};
