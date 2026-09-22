// Stories to read, in her dialect: three steps from very easy (like a children's book) to A2.
// Tap any word: what it means, how it's built (و + بيت + ي), how it's said, and the sentence it's in.
//   #/stories         all stories
//   #/stories/<id>    one story
import { t, tx, num } from "../core/i18n.js";
import { esc, ar, lat, translit, flag, playIcon, pageHead } from "../core/dom.js";
import { icon } from "../core/art.js";
import * as store from "../core/store.js";
import * as content from "../core/content.js";
import { sayAll } from "../core/speech.js";
import { dictionary } from "../core/dictionary.js";
import { tappable, selection, paint } from "./tapword.js";
import { loadVocab } from "../core/vocab.js";

// The stories are a big file: loaded the first time this page (or the Record page) needs them.
let loading = null;
export const loadStories = () =>
  (loading ??= import("../data/stories.js").then(m => (content.register(m.STORY_LINES), m)).catch(e => ((loading = null), Promise.reject(e))));

const show = { say: false, mean: false, hide: false }; // kept while moving between stories; hide = "Listen first"
const answers = new Map(); // story id → true/false answers given (until reload)
const mean = x => lat(tx({ en: x.en, uk: x.uk, najdi: x.en, msa: x.en })); // English/Ukrainian, left to right even in Arabic
const readIds = () => store.get().reading?.done ?? [];
const isRead = id => readIds().includes(`st.${id}`);
const BADGE = { easy: "st.badgeEasy", A1: "", A2: "" };
const badge = level => (BADGE[level] ? t(BADGE[level]) : level);

function list(S) {
  const done = S.STORIES.filter(s => isRead(s.id)).length;
  const next = S.STORIES.find(s => !isRead(s.id));
  return `${pageHead(t("st.title"), esc(t("st.sub")), "", "", "reading")}
    <p class="callout">${esc(t("st.tip"))}</p>
    <div class="st-top">
      <p class="st-count">${esc(t("st.count", { n: num(done), total: num(S.STORIES.length) }))}</p>
      ${next ? `<a class="btn btn-primary" href="#/stories/${next.id}">${t("st.next")}: ${esc(tx(next.title))} ${icon("arrow")}</a>` : ""}
    </div>
    ${S.LEVELS.map(level => `
      <section class="st-step">
        <h2>${t(`st.step.${level}`)}</h2>
        <p class="muted">${esc(t(`st.stepSub.${level}`))}</p>
        <ol class="ch-list">${S.STORIES.filter(s => s.level === level).map(s => `<li><a class="ch-card st-card" href="#/stories/${s.id}">
          <span class="ch-level st-lv-${level}">${esc(badge(level))}</span>
          <span class="ch-card-text"><b>${esc(tx(s.title))}</b>${ar(s.text[0].ar)}</span>
          <span class="ch-count">${isRead(s.id) ? `${icon("check")} ` : ""}${esc(t("st.lines", { n: num(s.text.length) }))}</span>
        </a></li>`).join("")}</ol>
      </section>`).join("")}`;
}

const sentence = (l, i, d) => tappable(l, i, d);

function text(s, d) {
  const lines = show.say || show.mean;
  if (!lines) return `<p class="st-flow">${s.text.map((l, i) => sentence(l, i, d)).join(" ")}</p>`;
  return `<ol class="st-lines">${s.text.map((l, i) => `<li class="st-line" data-line="${i}">
      <button type="button" class="st-play" data-say="${esc(l.ar)}" aria-label="${esc(t("st.hearSentence"))}">${icon("sound")}</button>
      <div>${sentence(l, i, d)}
        ${show.say ? `<p class="st-say">${translit(l.say)}</p>` : ""}
        ${show.mean ? `<p class="st-mean">${mean(l)}</p>` : ""}</div>
    </li>`).join("")}</ol>`;
}

function quiz(s) {
  const got = answers.get(s.id) ?? [];
  const finished = s.quiz.every((_, i) => got[i] !== undefined);
  const right = s.quiz.filter((q, i) => got[i] === q.answer).length;
  return `<section class="st-quiz">
    <h2>${t("st.quiz")}</h2>
    <p class="muted">${esc(t("st.quizSub"))}</p>
    <ol>${s.quiz.map((q, i) => {
      const a = got[i];
      const done = a !== undefined;
      const ok = a === q.answer;
      return `<li class="st-q${done ? (ok ? " is-right" : " is-wrong") : ""}">
        <button type="button" class="st-q-ar" data-say="${esc(q.ar)}">${ar(q.ar)}</button>
        <div class="st-q-btns">
          <button type="button" class="btn" data-q="${i}" data-a="1" aria-pressed="${a === true}"${done ? " disabled" : ""}>${t("st.true")}</button>
          <button type="button" class="btn" data-q="${i}" data-a="0" aria-pressed="${a === false}"${done ? " disabled" : ""}>${t("st.false")}</button>
        </div>
        ${done ? `<p class="st-q-fb"><b>${ok ? icon("check") : ""}${t(ok ? "st.right" : "st.wrong")}</b> ${esc(t(q.answer ? "st.itsTrue" : "st.itsFalse"))} ${translit(q.say)} <span>${mean(q)}</span></p>` : ""}
      </li>`;
    }).join("")}</ol>
    ${finished ? `<p class="st-score">${esc(t("st.score", { n: num(right), total: num(s.quiz.length) }))} <button type="button" class="btn btn-ghost" data-retry>${t("st.again")}</button></p>` : ""}
  </section>`;
}

function story(S, s, d) {
  const i = S.STORIES.indexOf(s);
  const next = S.STORIES[i + 1];
  s.text.forEach(content.apply); // Dima's corrections
  return `<p class="gr-back"><a href="#/stories">${icon("back")} ${t("st.all")}</a></p>
    ${pageHead(esc(tx(s.title)), "", `${esc(t(`st.step.${s.level}`))} · ${esc(t("st.lines", { n: num(s.text.length) }))}`, "", "")}
    <div class="ch-tools st-tools">
      ${flag({ check: true })}
      <button type="button" class="btn" data-listen>${icon("sound")} <span>${t("st.listen")}</span></button>
      <button type="button" class="btn" data-show="say" aria-pressed="${show.say}">${t("chats.say")}</button>
      <button type="button" class="btn" data-show="mean" aria-pressed="${show.mean}">${t("chats.mean")}</button>
      <button type="button" class="btn" data-show="hide" aria-pressed="${show.hide}">${icon("sound")} ${t("st.hide")}</button>
    </div>
    <p class="muted small">${esc(t(show.hide ? "st.hideHow" : "st.tapWord"))}</p>
    <article class="st-text lv-${s.level}${show.say || show.mean ? " is-lines" : ""}${show.hide ? " is-hidden" : ""}">${text(s, d)}</article>
    <aside class="st-panel" aria-live="polite" hidden></aside>
    <section class="st-words">
      <h2>${t("st.words")}</h2>
      <div class="vocab">${s.words.map(w => `<button class="phrase lv-phrase" data-say="${esc(w.ar)}">${ar(w.ar, "phrase-ar")}
        <span class="phrase-t">${translit(w.say)}<span class="gr-mean">${mean(w)}</span></span>${playIcon}</button>`).join("")}</div>
    </section>
    <div data-quiz>${quiz(s)}</div>
    <div class="ch-end">
      <button type="button" class="btn${isRead(s.id) ? "" : " btn-primary"}" data-read aria-pressed="${isRead(s.id)}">${icon("check")} ${t(isRead(s.id) ? "chats.isRead" : "chats.read")}</button>
      ${next ? `<a class="btn" href="#/stories/${next.id}">${esc(tx(next.title))} ${icon("arrow")}</a>` : ""}
    </div>`;
}

export default {
  titleKey: "st.title",
  async mount(root, { params, signal }) {
    root.innerHTML = pageHead(t("st.title"), esc(t("words.loading")), "", "", "reading");
    let S;
    let vocab = null;
    try {
      [S, { vocab }] = await Promise.all([loadStories(), loadVocab().catch(() => ({ vocab: null }))]);
    } catch {
      root.innerHTML = pageHead(t("st.title"), esc(t("st.loadError")), "", "", "reading");
      return;
    }
    if (signal.aborted) return;
    const s = S.STORIES.find(x => x.id === params[0]);
    if (!s) {
      root.innerHTML = list(S);
      return;
    }
    const others = S.STORIES.filter(x => x !== s).flatMap(x => x.words);
    const d = dictionary(vocab, s.words, others);
    let stopListening = null;
    let selected = null;

    const render = () => {
      stopListening?.();
      root.innerHTML = story(S, s, d);
    };
    const paintPanel = () => paint(root, root.querySelector(".st-panel"), selected);
    render();
    signal.addEventListener("abort", () => stopListening?.());

    root.addEventListener("click", e => {
      // "Listen first": the first tap on the hidden text shows it.
      const hidden = e.target.closest(".st-text.is-hidden");
      if (hidden) {
        hidden.classList.remove("is-hidden");
        return;
      }
      const w = e.target.closest(".st-w");
      if (w) {
        selected = selection(s.text[+w.dataset.s], w, d);
        return paintPanel();
      }
      if (e.target.closest("[data-close]")) {
        selected = null;
        return paintPanel();
      }
      const sh = e.target.closest("[data-show]");
      if (sh) {
        show[sh.dataset.show] = !show[sh.dataset.show];
        selected = null;
        return render();
      }
      const listen = e.target.closest("[data-listen]");
      if (listen) {
        if (stopListening) return stopListening();
        const mark = i => {
          root.querySelectorAll(".st-s.is-playing").forEach(x => x.classList.remove("is-playing"));
          if (i < 0) {
            stopListening = null;
            listen.querySelector("span").textContent = t("st.listen");
            listen.setAttribute("aria-pressed", "false");
            return;
          }
          root.querySelectorAll(".st-s")[i]?.classList.add("is-playing");
        };
        listen.querySelector("span").textContent = t("st.stop");
        listen.setAttribute("aria-pressed", "true");
        stopListening = sayAll(s.text.map(l => l.ar), mark);
        return;
      }
      const q = e.target.closest("[data-q]");
      if (q) {
        const got = answers.get(s.id) ?? [];
        got[+q.dataset.q] = q.dataset.a === "1";
        answers.set(s.id, got);
        root.querySelector("[data-quiz]").innerHTML = quiz(s);
        return;
      }
      if (e.target.closest("[data-retry]")) {
        answers.delete(s.id);
        root.querySelector("[data-quiz]").innerHTML = quiz(s);
        return;
      }
      if (e.target.closest("[data-read]")) {
        store.update(st => {
          const set = new Set(st.reading?.done ?? []);
          const key = `st.${s.id}`;
          set.has(key) ? set.delete(key) : set.add(key);
          st.reading = { done: [...set] };
        });
        const b = root.querySelector("[data-read]");
        const now = isRead(s.id);
        b.classList.toggle("btn-primary", !now);
        b.setAttribute("aria-pressed", now);
        b.innerHTML = `${icon("check")} ${t(now ? "chats.isRead" : "chats.read")}`;
      }
    }, { signal });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && selected && !document.querySelector("dialog[open]")) {
        selected = null;
        paintPanel();
      }
    }, { signal });
  },
};
