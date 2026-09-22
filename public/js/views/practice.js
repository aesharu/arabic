// Practice by topic: pick a topic from the word list (or her words, or a "To her ♥" section) and answer ten quick
// questions — what a word means, how to say it, and (when Dima has recorded it) what you hear. The words you miss
// come back at the end. Best scores stay on this device (prefs.practice).
//   #/practice          all topics
//   #/practice/<id>     one topic (a word-list topic id like 2.2, "hers", or "love.<section>")
import { t, tx, num } from "../core/i18n.js";
import { esc, ar, lat, translit, flag, meanings, playIcon, pageHead, shuffle, typing } from "../core/dom.js";
import { icon } from "../core/art.js";
import * as store from "../core/store.js";
import * as content from "../core/content.js";
import { say } from "../core/speech.js";
import { loadVocab, speakText } from "../core/vocab.js";
import { HER_WORDS } from "../data/hers.js";
import { LOVE } from "../data/love.js";
import { deckName } from "./shared.js";
import { celebrate } from "../core/celebrate.js";

const ROUND = 10;
export const mean = x => tx({ en: x.en, uk: x.uk, najdi: x.en, msa: x.en });
const best = () => store.get().prefs.practice ?? {};

// Every topic as { id, title, group, entries }. The typing page (views/write.js) uses the same list.
export function topics(vocab) {
  const out = [];
  for (const s of vocab.stages) {
    if (s.id === "grammar") continue;
    for (const tp of s.topics) out.push({ id: tp.id, title: tx(tp.title), group: deckName(s.id), entries: tp.entries });
  }
  out.push({ id: "hers", title: t("cards.deckHers"), group: t("nav.love"), entries: HER_WORDS });
  for (const sec of LOVE) out.push({ id: `love.${sec.id}`, title: tx(sec.title), group: t("nav.love"), entries: sec.items });
  return out.filter(tp => tp.entries.length >= 4);
}

function list(all) {
  const b = best();
  const groups = [...new Set(all.map(tp => tp.group))];
  return `${pageHead(t("pr.title"), esc(t("pr.sub")), "", "", "falcon")}
    ${groups.map(g => `<section class="st-step">
      <h2>${esc(g)}</h2>
      <ol class="ch-list pr-list">${all.filter(tp => tp.group === g).map(tp => `<li><a class="ch-card" href="#/practice/${tp.id}">
        <span class="ch-card-text"><b>${esc(tp.title)}</b><small class="muted">${esc(t("pr.words", { n: num(tp.entries.length) }))}</small></span>
        ${b[tp.id] !== undefined ? `<span class="pr-best${b[tp.id] === 100 ? " is-full" : ""}">${b[tp.id] === 100 ? icon("check") : ""}${esc(t("pr.best", { n: num(b[tp.id]) }))}</span>` : ""}
      </a></li>`).join("")}</ol>
    </section>`).join("")}`;
}

// A round: each question is one word with its kind of question and four choices.
function makeRound(tp, pool, words) {
  return shuffle([...words]).slice(0, ROUND).map((e, i) => {
    const recorded = content.hasAudio(speakText(e.ar));
    const kinds = recorded ? ["meaning", "arabic", "listen"] : ["meaning", "arabic"];
    const kind = kinds[i % kinds.length];
    const others = shuffle(pool.filter(x => x !== e && mean(x) !== mean(e) && x.ar !== e.ar));
    const picked = [];
    for (const x of others) if (picked.length < 3 && !picked.some(p => mean(p) === mean(x) || p.ar === x.ar)) picked.push(x);
    return { e, kind, options: shuffle([e, ...picked]), answer: null };
  });
}

function question(tp, round, i) {
  const q = round[i];
  const answered = q.answer !== null;
  const ok = answered && q.options[q.answer] === q.e;
  const prompt = {
    meaning: `<button type="button" class="pr-prompt" data-say="${esc(speakText(q.e.ar))}">${ar(q.e.ar)}${playIcon}</button>`,
    arabic: `<p class="pr-prompt pr-mean">${lat(mean(q.e))}</p>`,
    listen: `<button type="button" class="pr-listen" data-say="${esc(speakText(q.e.ar))}" aria-label="${esc(t("pr.qListen"))}">${icon("sound")}</button>`,
  }[q.kind];
  const option = (o, k) => {
    let cls = "opt pr-opt";
    if (answered && o === q.e) cls += " right";
    else if (answered && k === q.answer) cls += " wrong";
    const body = q.kind === "meaning" ? `<b>${lat(mean(o))}</b>` : `${ar(o.ar)}${q.kind === "arabic" ? `<span>${translit(o.say)}</span>` : ""}`;
    return `<button type="button" class="${cls}" data-opt="${k}"${answered ? " disabled" : ""}><kbd>${k + 1}</kbd>${body}</button>`;
  };
  return `<div class="pr-card">
      <p class="pr-kind">${esc(t(`pr.q.${q.kind}`))}</p>
      ${prompt}
      <div class="opts pr-opts${q.kind === "meaning" ? "" : " is-ar"}">${q.options.map(option).join("")}</div>
      <div class="pr-fb" aria-live="polite">${answered ? `<p class="pr-verdict ${ok ? "is-right" : "is-wrong"}">${ok ? icon("check") : ""}${t(ok ? "st.right" : "st.wrong")}</p>
        <button type="button" class="phrase lv-phrase" data-say="${esc(speakText(q.e.ar))}">${ar(q.e.ar, "phrase-ar")}
          <span class="phrase-t">${translit(q.e.say)} ${flag(q.e)}${meanings(q.e)}</span>${playIcon}</button>
        <button type="button" class="btn btn-primary" data-next>${t(i + 1 < round.length ? "pr.next" : "pr.finish")} <kbd>Enter</kbd></button>` : ""}</div>
    </div>`;
}

function finished(tp, round) {
  const right = round.filter(q => q.options[q.answer] === q.e).length;
  const missed = round.filter(q => q.options[q.answer] !== q.e).map(q => q.e);
  return `<div class="pr-card pr-end">
      <p class="pr-kind">${esc(t("pr.done"))}</p>
      <p class="pr-big">${esc(t("st.score", { n: num(right), total: num(round.length) }))}</p>
      ${missed.length ? `<h3>${t("pr.missed")}</h3><div class="vocab">${missed.map(e => `<button type="button" class="phrase lv-phrase" data-say="${esc(speakText(e.ar))}">${ar(e.ar, "phrase-ar")}
        <span class="phrase-t">${translit(e.say)}${meanings(e)}</span>${playIcon}</button>`).join("")}</div>` : `<p class="pr-perfect">${esc(t("pr.perfect"))}</p>`}
      <div class="btn-row">
        ${missed.length ? `<button type="button" class="btn btn-primary" data-retry>${t("pr.retryMissed")}</button>` : ""}
        <button type="button" class="btn${missed.length ? "" : " btn-primary"}" data-again>${t("pr.again")}</button>
        <a class="btn btn-ghost" href="#/practice">${t("pr.all")}</a>
      </div>
    </div>`;
}

export default {
  titleKey: "pr.title",
  async mount(root, { params, signal }) {
    root.innerHTML = pageHead(t("pr.title"), esc(t("words.loading")), "", "", "falcon");
    let vocab;
    try {
      ({ vocab } = await loadVocab());
    } catch {
      root.innerHTML = pageHead(t("pr.title"), esc(t("st.loadError")), "", "", "falcon");
      return;
    }
    if (signal.aborted) return;
    const all = topics(vocab);
    const tp = all.find(x => x.id === params[0]);
    if (!tp) {
      root.innerHTML = list(all);
      return;
    }
    // Wrong answers come from the same topic, or its whole group when the topic is small.
    const pool = tp.entries.length >= 8 ? tp.entries : all.filter(x => x.group === tp.group).flatMap(x => x.entries);
    let round = makeRound(tp, pool, tp.entries);
    let i = 0;

    const render = () => {
      const done = i >= round.length;
      root.innerHTML = `<p class="gr-back"><a href="#/practice">${icon("back")} ${t("pr.all")}</a></p>
        ${pageHead(esc(tp.title), "", `${esc(tp.group)} · ${esc(t("pr.words", { n: num(tp.entries.length) }))}`, "", "")}
        ${done ? "" : `<div class="pr-top"><span>${esc(t("pr.of", { n: num(i + 1), total: num(round.length) }))}</span><span class="meter" aria-hidden="true"><span style="width:${(i / round.length) * 100}%"></span></span></div>`}
        ${done ? finished(tp, round) : question(tp, round, i)}`;
      if (!done && round[i].kind === "listen" && round[i].answer === null) say(speakText(round[i].e.ar));
      root.querySelector("[data-next], .pr-opt:not([disabled])")?.focus({ preventScroll: true });
    };
    const saveBest = () => {
      const pct = Math.round((round.filter(q => q.options[q.answer] === q.e).length / round.length) * 100);
      if (round.length < Math.min(ROUND, tp.entries.length)) return; // a "missed words" round doesn't count
      if ((best()[tp.id] ?? -1) < pct) store.update(st => (st.prefs.practice = { ...st.prefs.practice, [tp.id]: pct }));
    };
    const pick = k => {
      const q = round[i];
      if (!q || q.answer !== null || !q.options[k]) return;
      q.answer = k;
      if (q.options[k] === q.e) say(speakText(q.e.ar));
      render();
      root.querySelector(".pr-fb")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    };
    const next = () => {
      if (round[i]?.answer === null) return;
      i++;
      if (i >= round.length) saveBest();
      render();
      if (i >= round.length && round.every(q => q.options[q.answer] === q.e)) celebrate(root.querySelector(".pr-big"));
    };
    render();

    root.addEventListener("click", e => {
      const o = e.target.closest("[data-opt]");
      if (o) return pick(+o.dataset.opt);
      if (e.target.closest("[data-next]")) return next();
      if (e.target.closest("[data-retry]")) {
        const missed = round.filter(q => q.options[q.answer] !== q.e).map(q => q.e);
        round = makeRound(tp, pool, missed);
        i = 0;
        return render();
      }
      if (e.target.closest("[data-again]")) {
        round = makeRound(tp, pool, tp.entries);
        i = 0;
        render();
      }
    }, { signal });
    document.addEventListener("keydown", e => {
      if (typing(e) || document.querySelector("dialog[open]")) return;
      if (/^[1-4]$/.test(e.key)) pick(+e.key - 1);
      else if (e.key === "Enter" && round[i]?.answer !== null && i < round.length) {
        e.preventDefault();
        next();
      }
    }, { signal });
  },
};
