// Your path: from Day 1 to A1 (21 Dec) and A2 (by 9 Feb), one week at a time. Each week: a goal and steps that link
// to the exact story, chat, topic, verb, lesson or page. Stories, chats and practice tick themselves.
//   #/path          this week open
//   #/path/<n>      week n open
import { t, tx, num, locale } from "../core/i18n.js";
import { esc, rich, pageHead } from "../core/dom.js";
import { icon } from "../core/art.js";
import * as store from "../core/store.js";
import { format, todayKey, diffDays } from "../core/dates.js";
import { loadVocab } from "../core/vocab.js";
import { weeks, weekIndex, stepDone, isAuto, progress, toggleStep, PASS } from "../core/path.js";
import { PAGES, TASKS } from "../data/path.js";
import { CHATS } from "../data/chats.js";
import { VERBS } from "../data/verbs.js";
import { GRAMMAR as PLAN_GRAMMAR } from "../data/grammar.js";
import { GRAMMAR_A2 } from "../data/grammar2.js";
import { LOVE } from "../data/love.js";
import { A1_BY, BIRTHDAY } from "../data/birthday.js";
import { loadStories } from "./stories.js";

const GRAMMAR = [...PLAN_GRAMMAR, ...GRAMMAR_A2];
const day = key => format(key, { day: "numeric", month: "short" }, locale());

// What a step says and where it goes.
function describe(step, ctx) {
  const [kind, id] = step.split(":");
  const title = x => (x ? tx(x) : id);
  if (kind === "st") return { href: `#/stories/${id}`, text: title(ctx.stories.find(s => s.id === id)?.title) };
  if (kind === "ch") return { href: `#/chats/${id}`, text: title(CHATS.find(c => c.id === id)?.title) };
  if (kind === "pr") return { href: `#/practice/${id}`, text: id === "hers" ? t("cards.deckHers") : title(ctx.topics.get(id)), hint: t("path.pass", { n: PASS }) };
  if (kind === "vb") {
    const v = VERBS.find(x => x.id === id);
    return { href: `#/verbs/${id}`, text: `${v.now.ar} — ${tx({ en: v.en, uk: v.ukInf, najdi: v.en, msa: v.en })}` };
  }
  if (kind === "gr") return { href: `#/grammar/${id}`, text: title(GRAMMAR.find(g => g.id === id)?.title) };
  if (kind === "lv") return { href: `#/love/${id}`, text: title(LOVE.find(s => s.id === id)?.title) };
  if (kind === "pg") return { href: PAGES[id].href, text: tx(PAGES[id].text) };
  return { href: "", text: tx(TASKS[id]) };
}

function stepRow(step, ctx, readOnly) {
  const d = describe(step, ctx);
  const done = stepDone(step);
  const auto = isAuto(step);
  const kind = step.split(":")[0];
  const box = auto
    ? `<span class="pa-box${done ? " is-done" : ""}" title="${esc(t("path.auto"))}">${done ? icon("check") : ""}</span>`
    : `<button type="button" class="pa-box${done ? " is-done" : ""}" data-step="${esc(step)}" aria-pressed="${done}" aria-label="${esc(t("path.tick"))}"${readOnly ? " disabled" : ""}>${done ? icon("check") : ""}</button>`;
  const body = `<span class="pa-kind">${esc(t(`path.k.${kind}`))}</span><span class="pa-text">${rich(d.text)}</span>${d.hint && !done ? `<small>${esc(d.hint)}</small>` : ""}`;
  return `<li class="pa-step${done ? " is-done" : ""}">${box}${d.href ? `<a href="${d.href}">${body}${icon("arrow")}</a>` : `<span class="pa-plain">${body}</span>`}</li>`;
}

function week(w, ctx, open, current, readOnly) {
  const p = progress(w);
  const full = p.done === p.total;
  return `<details class="pa-week${current ? " is-now" : ""}${full ? " is-full" : ""}" id="week-${w.n}"${open ? " open" : ""}>
    <summary>
      <span class="pa-n">${num(w.n)}</span>
      <span class="pa-head"><b>${esc(tx(w.title))}</b><small>${esc(day(w.start))} – ${esc(day(w.end))}${current ? ` · ${esc(t("path.now"))}` : ""}</small></span>
      <span class="pa-count${full ? " is-full" : ""}">${full ? icon("check") : ""}${num(p.done)}/${num(p.total)}</span>
    </summary>
    <p class="pa-goal">${icon("star")}<span>${rich(tx(w.goal))}</span></p>
    <ol class="pa-steps">${w.steps.map(s => stepRow(s, ctx, readOnly)).join("")}</ol>
  </details>`;
}

export default {
  titleKey: "path.title",
  async mount(root, { params, signal }) {
    root.innerHTML = pageHead(t("path.title"), esc(t("words.loading")), "", "", "plan");
    const [S, V] = await Promise.all([loadStories().catch(() => ({ STORIES: [] })), loadVocab().catch(() => null)]);
    if (signal.aborted) return;
    const topics = new Map((V?.vocab.stages ?? []).flatMap(s => s.topics.map(tp => [tp.id, tp.title])));
    const ctx = { stories: S.STORIES, topics };
    const teacher = store.isTeacher();
    const list = weeks(teacher);
    const now = weekIndex();
    const openN = +params[0] || now + 1;

    const render = () => {
      const today = todayKey();
      const readOnly = store.watching();
      const all = list.reduce((a, w) => {
        const p = progress(w);
        return { done: a.done + p.done, total: a.total + p.total };
      }, { done: 0, total: 0 });
      root.innerHTML = `${pageHead(t("path.title"), esc(t(teacher ? "path.subTeacher" : "path.sub")), "", "", "plan")}
        <div class="pa-top">
          <div><b>${num(now + 1)}</b><span>${esc(t("path.weekOf", { total: num(list.length) }))}</span></div>
          ${!teacher && today <= A1_BY ? `<div><b>${num(diffDays(today, A1_BY))}</b><span>${esc(t("path.toA1"))}</span></div>` : ""}
          ${!teacher && today <= BIRTHDAY ? `<div><b>${num(diffDays(today, BIRTHDAY))}</b><span>${esc(t("path.toA2"))}</span></div>` : ""}
          <div><b>${num(all.done)}/${num(all.total)}</b><span>${esc(t("path.steps"))}</span></div>
        </div>
        <p class="callout"><span>${esc(t("path.how"))}</span></p>
        <div class="pa-weeks">${list.map((w, i) => week(w, ctx, w.n === openN, i === now, readOnly)).join("")}</div>`;
    };
    render();
    if (params[0]) root.querySelector(`#week-${openN}`)?.scrollIntoView({ block: "start" });

    root.addEventListener("click", e => {
      const b = e.target.closest("[data-step]");
      if (!b || store.watching()) return;
      toggleStep(b.dataset.step);
      const open = [...root.querySelectorAll("details[open]")].map(d => d.id);
      render();
      root.querySelectorAll("details").forEach(d => (d.open = open.includes(d.id)));
    }, { signal });
  },
};
