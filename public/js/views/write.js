// Write it in Arabic — the other half of speaking: he sees the meaning and types the word in Arabic script,
// with an on-screen keyboard, because his computer has no Arabic layout. Ten a round, like Practice.
// The marking forgives what isn't really a spelling mistake (core/arabic.js) but always shows the exact spelling.
//   #/write          the topics
//   #/write/<id>     one topic
import { t, tx, num, said } from "../core/i18n.js";
import { esc, ar, lat, translit, flag, playIcon, pageHead, shuffle, typing } from "../core/dom.js";
import { icon } from "../core/art.js";
import * as store from "../core/store.js";
import * as content from "../core/content.js";
import { loadVocab, speakText } from "../core/vocab.js";
import { topics, mean } from "./practice.js";
import { mark, diff, KEYS } from "../core/arabic.js";
import { todayKey } from "../core/dates.js";
import { celebrate } from "../core/celebrate.js";
import { say } from "../core/speech.js";

const ROUND = 10;
const best = () => store.get().prefs.write ?? {};

function list(all) {
  const b = best();
  const groups = [...new Set(all.map(tp => tp.group))];
  return `${pageHead(t("wr.title"), esc(t("wr.sub")), "", "", "qalam")}
    ${groups.map(g => `<section class="st-step">
      <h2>${esc(g)}</h2>
      <ol class="ch-list pr-list">${all.filter(tp => tp.group === g).map(tp => `<li><a class="ch-card" href="#/write/${tp.id}">
        <span class="ch-card-text"><b>${esc(tp.title)}</b><small class="muted">${esc(t("pr.words", { n: num(tp.entries.length) }))}</small></span>
        ${b[tp.id] !== undefined ? `<span class="pr-best${b[tp.id] === 100 ? " is-full" : ""}">${b[tp.id] === 100 ? icon("check") : ""}${esc(t("pr.best", { n: num(b[tp.id]) }))}</span>` : ""}
      </a></li>`).join("")}</ol>
    </section>`).join("")}`;
}

const makeRound = words => shuffle([...words]).slice(0, ROUND).map(e => ({ e, typed: "", verdict: null, hint: false }));

// The word as it should be written, with the letters he left out marked.
function answerLetters(q) {
  const { letters, extra } = diff(q.typed, q.e.ar);
  return `<span class="wr-answer" lang="ar" dir="rtl">${letters.map(l =>
    `<span class="${l.kind === "missing" ? "is-missing" : ""}">${esc(l.ch)}</span>`).join("")}</span>
    ${extra ? `<small class="wr-extra">${esc(t("wr.extra", { n: said("unit.letters", extra) }))}</small>` : ""}`;
}

function question(q, i, total) {
  const done = q.verdict !== null;
  const recorded = content.hasAudio(speakText(q.e.ar));
  return `<div class="pr-card wr-card">
    <p class="pr-kind">${esc(t("wr.kind"))}</p>
    <p class="wr-mean">${lat(mean(q.e))}</p>
    <div class="wr-hints">
      <button type="button" class="btn btn-ghost" data-say="${esc(speakText(q.e.ar))}">${icon("sound")} ${esc(t(recorded ? "wr.herVoice" : "wr.hear"))}</button>
      <button type="button" class="btn btn-ghost" data-hint aria-pressed="${q.hint}">${icon("star")} ${esc(t("wr.hint"))}</button>
    </div>
    ${q.hint || done ? `<p class="wr-say">${translit(q.e.say)}</p>` : ""}

    <label class="wr-field"><span class="visually-hidden">${esc(t("wr.type"))}</span>
      <input class="wr-in" name="answer" lang="ar" dir="rtl" autocomplete="off" autocapitalize="off" spellcheck="false"
        placeholder="${esc(t("wr.type"))}" value="${esc(q.typed)}"${done ? " readonly" : ""}></label>

    ${done ? "" : `<div class="wr-keys" role="group" aria-label="${esc(t("wr.keyboard"))}">
      ${KEYS.map(row => `<div class="wr-row">${row.map(k => `<button type="button" class="wr-key" data-key="${esc(k)}">${esc(k)}</button>`).join("")}</div>`).join("")}
      <div class="wr-row wr-row-wide">
        <button type="button" class="wr-key wr-space" data-key=" ">${esc(t("wr.space"))}</button>
        <button type="button" class="wr-key wr-back" data-back aria-label="${esc(t("wr.back"))}">⌫</button>
      </div>
    </div>`}

    <div class="pr-fb wr-fb" aria-live="polite">
      ${done ? `<p class="pr-verdict ${q.verdict === "wrong" ? "is-wrong" : "is-right"}">
          ${q.verdict === "wrong" ? "" : icon("check")}${esc(t(`wr.v.${q.verdict}`))}</p>
        ${q.verdict === "right" ? "" : answerLetters(q)}
        <button type="button" class="phrase lv-phrase" data-say="${esc(speakText(q.e.ar))}">${ar(q.e.ar, "phrase-ar")}
          <span class="phrase-t">${translit(q.e.say)} ${flag(q.e)}</span>${playIcon}</button>
        <button type="button" class="btn btn-primary" data-next>${t(i + 1 < total ? "pr.next" : "pr.finish")} <kbd>Enter</kbd></button>`
      : `<div class="btn-row">
          <button type="button" class="btn btn-primary" data-check>${esc(t("wr.check"))} <kbd>Enter</kbd></button>
          <button type="button" class="btn btn-ghost" data-show>${esc(t("wr.show"))}</button>
        </div>`}
    </div>
  </div>`;
}

function finished(round) {
  const right = round.filter(q => q.verdict === "right" || q.verdict === "close").length;
  const missed = round.filter(q => q.verdict === "wrong" || q.verdict === "shown").map(q => q.e);
  return `<div class="pr-card pr-end">
    <p class="pr-kind">${esc(t("pr.done"))}</p>
    <p class="pr-big">${esc(t("st.score", { n: num(right), total: num(round.length) }))}</p>
    ${missed.length ? `<h3>${t("wr.missed")}</h3><div class="vocab">${missed.map(e => `<button type="button" class="phrase lv-phrase" data-say="${esc(speakText(e.ar))}">${ar(e.ar, "phrase-ar")}
      <span class="phrase-t">${translit(e.say)}</span>${playIcon}</button>`).join("")}</div>` : `<p class="pr-perfect">${esc(t("pr.perfect"))}</p>`}
    <div class="btn-row">
      ${missed.length ? `<button type="button" class="btn btn-primary" data-retry>${t("pr.retryMissed")}</button>` : ""}
      <button type="button" class="btn${missed.length ? "" : " btn-primary"}" data-again>${t("pr.again")}</button>
      <a class="btn btn-ghost" href="#/write">${t("wr.all")}</a>
    </div>
  </div>`;
}

export default {
  titleKey: "wr.title",
  async mount(root, { params, signal }) {
    root.innerHTML = pageHead(t("wr.title"), esc(t("words.loading")), "", "", "qalam");
    let vocab;
    try {
      ({ vocab } = await loadVocab());
    } catch {
      root.innerHTML = pageHead(t("wr.title"), esc(t("st.loadError")), "", "", "qalam");
      return;
    }
    if (signal.aborted) return;
    const all = topics(vocab);
    const tp = all.find(x => x.id === params[0]);
    if (!tp) {
      root.innerHTML = list(all);
      return;
    }
    let round = makeRound(tp.entries);
    let i = 0;

    const input = () => root.querySelector(".wr-in");
    const render = ({ focus = true } = {}) => {
      if (signal.aborted) return;
      const done = i >= round.length;
      root.innerHTML = `<p class="gr-back"><a href="#/write">${icon("back")} ${t("wr.all")}</a></p>
        ${pageHead(esc(tp.title), "", `${esc(tp.group)} · ${esc(t("pr.words", { n: num(tp.entries.length) }))}`, "", "")}
        ${done ? "" : `<div class="pr-top"><span>${esc(t("pr.of", { n: num(i + 1), total: num(round.length) }))}</span><span class="meter" aria-hidden="true"><span style="width:${(i / round.length) * 100}%"></span></span></div>`}
        ${done ? finished(round) : question(round[i], i, round.length)}`;
      if (!done && focus) {
        const el = input();
        el?.focus({ preventScroll: true });
        el?.setSelectionRange(el.value.length, el.value.length);
      } else if (done) root.querySelector("[data-retry], [data-again]")?.focus({ preventScroll: true });
    };

    const type = text => {
      const el = input();
      if (!el) return;
      const at = el.selectionStart ?? el.value.length;
      el.value = el.value.slice(0, at) + text + el.value.slice(el.selectionEnd ?? at);
      round[i].typed = el.value;
      el.focus();
      el.setSelectionRange(at + text.length, at + text.length);
    };
    const backspace = () => {
      const el = input();
      if (!el) return;
      const at = el.selectionStart ?? el.value.length;
      const from = el.selectionEnd > at ? at : Math.max(0, at - 1);
      el.value = el.value.slice(0, from) + el.value.slice(el.selectionEnd ?? at);
      round[i].typed = el.value;
      el.focus();
      el.setSelectionRange(from, from);
    };

    const check = (shown = false) => {
      const q = round[i];
      if (!q || q.verdict !== null) return;
      q.typed = input()?.value ?? q.typed;
      const verdict = shown ? "shown" : mark(q.typed, q.e.ar);
      if (verdict === "empty") return input()?.focus();
      q.verdict = verdict;
      store.logWritten(todayKey());
      if (verdict === "right" || verdict === "close") say(speakText(q.e.ar));
      render({ focus: false });
      root.querySelector(".wr-fb")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    };

    const saveBest = () => {
      if (round.length < Math.min(ROUND, tp.entries.length)) return; // a "words you missed" round doesn't count
      const pct = Math.round((round.filter(q => q.verdict === "right" || q.verdict === "close").length / round.length) * 100);
      if ((best()[tp.id] ?? -1) < pct) store.update(st => (st.prefs.write = { ...st.prefs.write, [tp.id]: pct }));
    };
    const next = () => {
      if (round[i]?.verdict === null) return;
      i++;
      if (i >= round.length) saveBest();
      render();
      if (i >= round.length && round.every(q => q.verdict === "right" || q.verdict === "close")) celebrate(root.querySelector(".pr-big"));
    };

    render();

    root.addEventListener("click", e => {
      const k = e.target.closest("[data-key]");
      if (k) return type(k.dataset.key);
      if (e.target.closest("[data-back]")) return backspace();
      if (e.target.closest("[data-check]")) return check();
      if (e.target.closest("[data-show]")) return check(true);
      if (e.target.closest("[data-next]")) return next();
      if (e.target.closest("[data-hint]")) {
        round[i].typed = input()?.value ?? "";
        round[i].hint = !round[i].hint;
        return render();
      }
      if (e.target.closest("[data-retry]")) {
        round = makeRound(round.filter(q => q.verdict === "wrong" || q.verdict === "shown").map(q => q.e));
        i = 0;
        return render();
      }
      if (e.target.closest("[data-again]")) {
        round = makeRound(tp.entries);
        i = 0;
        render();
      }
    }, { signal });

    root.addEventListener("input", e => {
      if (e.target.matches(".wr-in")) round[i].typed = e.target.value;
    }, { signal });

    document.addEventListener("keydown", e => {
      if (document.querySelector("dialog[open]")) return;
      if (e.key !== "Enter") return;
      if (typing(e) && !e.target.matches(".wr-in")) return;
      e.preventDefault();
      if (i >= round.length) return;
      if (round[i].verdict === null) check();
      else next();
    }, { signal });
  },
};
