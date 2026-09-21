// Weekly lessons, week 3 to 67: this week's words (from the plan), a grammar lesson, a short conversation and a
// speaking task. Weeks 1–2 are the Script weeks, taught day by day on Today.
//   #/lessons       every week, by stage, this week marked
//   #/lessons/<n>   week n
import { t, tx, num } from "../core/i18n.js";
import { esc, rich, ar, translit, flag, playIcon, pageHead } from "../core/dom.js";
import { icon } from "../core/art.js";
import { todayKey, addDays, shortDate } from "../core/dates.js";
import { weekNumber, phaseFor, phaseTitle } from "../core/schedule.js";
import { locale } from "../core/i18n.js";
import { START } from "../config.js";
import { loadVocab, speakText } from "../core/vocab.js";
import * as content from "../core/content.js";
import { WEEKS, TASKS, DIALOGUES } from "../data/weeks.js";
import { GRAMMAR } from "../data/grammar.js";

const startOf = w => addDays(START, (w - 1) * 7);
const meaning = r => tx({ en: r.en, uk: r.uk, najdi: r.en, msa: r.en });
const second = r => tx({ en: r.uk, uk: r.en, najdi: r.uk, msa: r.uk });
const CHECK_NOTE = {
  en: "A practice conversation, not from the plan — Dima checks each line.",
  uk: "Тренувальна розмова, не з плану — Діма перевіряє кожен рядок.",
  najdi: "محادثة للتمرين، مب من الخطة — ديما تراجع كل سطر.",
  msa: "محادثة تدريبية ليست من الخطة — تراجع ديما كلّ سطر.",
};

// The words of a week: its topics' entries, or the right slice when a topic runs over several weeks.
function wordsOf(week, vocab) {
  const topics = vocab.stages.flatMap(s => s.topics.map(tp => ({ ...tp, deck: s.id })));
  return week.topics.flatMap(({ id, part }) => {
    const tp = topics.find(x => x.id === id);
    if (!tp) return [];
    if (!part) return tp.entries.map(e => ({ e, tp }));
    const [i, n] = part;
    const size = Math.ceil(tp.entries.length / n);
    return tp.entries.slice(i * size, (i + 1) * size).map(e => ({ e, tp }));
  });
}

const wordRow = e => `<div class="word-wrap">
  <button type="button" class="word-edit" data-edit="${esc(e.id)}" aria-label="${esc(t("edit.button"))}">✎</button>
  <button class="phrase" data-say="${esc(speakText(e.ar))}">${ar(e.ar, "phrase-ar")}
    <span class="phrase-t">${translit(e.say)} ${e.check ? flag({ check: true, checkNote: e.note }) : ""}
      <span class="gr-mean">${esc(meaning(e))}</span><span class="gr-mean-2">${esc(second(e))}</span>
      ${e.toHer ? `<span class="to-her">${t("words.toHer")}: ${ar(e.toHer.ar)} ${translit(e.toHer.say)}</span>` : ""}</span>
    ${playIcon}</button></div>`;

const line = l => {
  content.apply(l);
  return `<div class="dl-line is-${l.who}">
    <span class="dl-who">${t(l.who === "you" ? "lessons.you" : "lessons.her")}</span>
    <div class="word-wrap">
      <button type="button" class="word-edit" data-edit="${l.id}" aria-label="${esc(t("edit.button"))}">✎</button>
      <button class="phrase dl-bubble" data-say="${esc(speakText(l.ar))}">${ar(l.ar, "phrase-ar")}
        <span class="phrase-t">${translit(l.say)} ${l.check === false ? "" : flag({ check: true, checkNote: CHECK_NOTE })}
          <span class="gr-mean">${esc(meaning(l))}</span><span class="gr-mean-2">${esc(second(l))}</span></span>
        ${playIcon}</button></div></div>`;
};

function list(current) {
  const byStage = new Map();
  for (const w of WEEKS) {
    const p = phaseFor(startOf(w.week));
    if (!byStage.has(p.id)) byStage.set(p.id, { p, weeks: [] });
    byStage.get(p.id).weeks.push(w);
  }
  return `${pageHead(t("lessons.title"), esc(t("lessons.sub")), "", "", "plan")}
    <p class="callout">${icon("letters")} ${t("lessons.script")}</p>
    ${[...byStage.values()].map(({ p, weeks }) => `<section class="ls-stage"><h2>${esc(tx(phaseTitle(p)))}</h2>
      <ol class="ls-weeks">${weeks.map(w => `<li><a class="ls-week${w.week === current ? " is-now" : ""}${w.week < current ? " is-past" : ""}" href="#/lessons/${w.week}">
        <b>${esc(t("lessons.weekN", { n: w.week }))}</b>
        <span>${w.review ? esc(t("lessons.review")) : ""}${w.topics.map(x => `<span data-topic="${x.id}"></span>`).join("")}</span>
        <small>${esc(tx(GRAMMAR.find(g => g.id === w.grammar).title))}</small></a></li>`).join("")}</ol></section>`).join("")}`;
}

export default {
  titleKey: "lessons.title",
  mount(root, { params, signal }) {
    const current = weekNumber(todayKey());
    const week = WEEKS.find(w => w.week === +params[0]);

    if (!week) {
      root.innerHTML = list(current);
      loadVocab().then(({ vocab }) => {
        if (signal.aborted) return;
        const topics = vocab.stages.flatMap(s => s.topics);
        root.querySelectorAll("[data-topic]").forEach(el => {
          const tp = topics.find(x => x.id === el.dataset.topic);
          if (tp) el.textContent = tx(tp.title);
        });
        root.querySelector(".ls-week.is-now")?.scrollIntoView({ block: "center" });
      }, () => {});
      return;
    }

    const phase = phaseFor(startOf(week.week));
    const g = GRAMMAR.find(x => x.id === week.grammar);
    const dialogue = DIALOGUES[week.week];
    const tasks = [...(week.review ? [TASKS.review] : []), ...(TASKS[phase.id] ?? [])];
    const prev = WEEKS.find(w => w.week === week.week - 1);
    const next = WEEKS.find(w => w.week === week.week + 1);
    if (dialogue) {
      dialogue.forEach((l, i) => (l.id = `d${week.week}x${i}`)); // ✎ saves corrections under these ids
      content.register(dialogue);
    }

    const render = vocab => {
      if (signal.aborted) return;
      const words = vocab ? wordsOf(week, vocab) : [];
      const titles = [...new Set(words.map(({ tp }) => tx(tp.title)))];
      root.innerHTML = `
        <p class="gr-back"><a href="#/lessons">${icon("back")} ${t("lessons.all")}</a></p>
        ${pageHead(week.review ? t("lessons.review") : titles.join(" · ") || "…",
          esc(`${shortDate(startOf(week.week), locale())} – ${shortDate(addDays(startOf(week.week), 6), locale())}`),
          `${t("lessons.weekN", { n: week.week })} · ${esc(tx(phaseTitle(phase)))}`, "", "plan")}
        <section class="panel ls-goal"><h2>${icon("star")} ${t("lessons.goal")}</h2><p>${rich(tx(phase.canDo))}</p></section>

        ${week.review ? "" : `<section class="ls-block"><div class="panel-head"><h2>1 · ${t("lessons.words")} <small class="muted">${num(words.length)}</small></h2>
          <a class="btn" href="#/cards/study">${icon("cards")} ${t("lessons.study")}</a></div>
          <div class="vocab">${words.map(({ e }) => wordRow(e)).join("")}</div></section>`}

        <section class="ls-block"><h2>${week.review ? 1 : 2} · ${t("lessons.grammar")}</h2>
          <a class="gr-card" href="#/grammar/${g.id}"><span class="gr-num" aria-hidden="true">${g.id}</span>
            <span><b>${esc(tx(g.title))}</b><span class="gr-peek">${g.rows.slice(0, 3).map(r => ar(r.ar)).join(" · ")}</span></span>${icon("arrow")}</a></section>

        ${dialogue ? `<section class="ls-block"><h2>${week.review ? 2 : 3} · ${t("lessons.conversation")}</h2>
          <p class="muted">${t("lessons.convHint")}</p>
          <div class="dialogue">${dialogue.map(line).join("")}</div></section>` : ""}

        <section class="panel ls-tasks"><h2>${icon("sound")} ${t("lessons.speaking")}</h2>
          <ul>${tasks.map(x => `<li>${rich(tx(x))}</li>`).join("")}</ul></section>

        <nav class="gr-nav">
          ${prev ? `<a class="btn btn-ghost" href="#/lessons/${prev.week}">${icon("back")} ${esc(t("lessons.weekN", { n: prev.week }))}</a>` : "<span></span>"}
          ${next ? `<a class="btn" href="#/lessons/${next.week}">${esc(t("lessons.weekN", { n: next.week }))} ${icon("arrow")}</a>` : ""}
        </nav>`;
    };
    render(null);
    loadVocab().then(({ vocab }) => render(vocab), () => {});
    const off = content.onChange(() => loadVocab().then(({ vocab }) => render(vocab), () => {}));
    signal.addEventListener("abort", off);
  },
};
