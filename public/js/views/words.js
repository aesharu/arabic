// The Word list: every word by stage and topic, a search across all four languages, and the Anki decks.
//   #/words/<tab>   tab = 1 · 2 · 3 · 4 · special · grammar · traps
import { t, tx, tu, num } from "../core/i18n.js";
import { esc, rich, ar, translit, flag, meanings, playIcon, pageHead } from "../core/dom.js";
import { icon } from "../core/art.js";
import { loadVocab, speakText } from "../core/vocab.js";
import { wordState } from "../core/cards.js";
import { haystack, matches } from "../core/search.js";
import { deckName } from "./shared.js";
import * as content from "../core/content.js";

const TABS = ["1", "2", "3", "4", "special", "grammar", "traps"];
const DECK_FILES = { "1": "najdi-stage1.csv", "2": "najdi-stage2.csv", "3": "najdi-stage3.csv", "4": "najdi-stage4-5.csv", special: "najdi-special.csv", grammar: "najdi-grammar.csv" };
const count = stage => stage.topics.reduce((n, topic) => n + topic.entries.length, 0);
let query = ""; // kept while you move between pages
let hay = null; // search strings, built once

const STATE_KEY = { learning: "words.stLearning", learned: "words.stLearned", strong: "words.stStrong", suspended: "words.stSuspended" };
const badge = id => {
  const st = wordState(id);
  return STATE_KEY[st] ? `<span class="wstate ${st}">${st === "strong" || st === "learned" ? icon("check") : ""}${t(STATE_KEY[st])}</span>` : "";
};

// Each word: tap to hear (her voice once recorded), and ✎ to correct it.
const entry = e => `<div class="word-wrap">
  <button type="button" class="word-edit" data-edit="${esc(e.id)}" aria-label="${esc(t("edit.button"))}" title="${esc(t("edit.button"))}">✎</button>
  <button class="phrase" data-say="${esc(speakText(e.ar))}">
    ${ar(e.ar, "phrase-ar")}
    <span class="phrase-t">${translit(e.say)} ${badge(e.id)} ${e.check ? flag({ check: true, checkNote: e.note }) : ""}${meanings(e)}
      ${e.toHer ? `<span class="to-her">${t("words.toHer")}: ${ar(e.toHer.ar)} ${translit(e.toHer.say)}</span>` : ""}
      ${e.reply ? `<span class="to-her">${t("words.reply")}: ${ar(e.reply.ar)} ${e.reply.say ? translit(e.reply.say) : ""}</span>` : ""}
      ${e.note && !e.check ? `<span class="pnote">${rich(tx(e.note))}</span>` : ""}
      ${content.hasAudio(speakText(e.ar)) ? `<span class="her-voice">${icon("sound")}${t("record.herVoice")}</span>` : ""}</span>
    ${playIcon}
  </button></div>`;

const trapRow = tr => `
  <div class="phrase-row trap">
    <div class="trap-side"><span class="muted small">${t("words.youSee")} · ${esc(tx(tr.dialect))}</span>${ar(tr.wrong.ar, "phrase-ar strike")} ${translit(tr.wrong.say)}</div>
    <div class="trap-side"><span class="muted small">${t("words.sayInstead")}</span>
      <button class="phrase" data-say="${esc(tr.right.ar)}">${ar(tr.right.ar, "phrase-ar")} ${translit(tr.right.say)} ${playIcon}</button></div>
  </div>`;

export default {
  titleKey: "words.title",
  mount(root, { params, signal }) {
    const tab = TABS.includes(params[0]) ? params[0] : "1";
    root.innerHTML = pageHead(t("words.title"), esc(t("words.loading")), "", "", "palms");

    let vocab = null;
    const results = () => {
      const all = vocab.stages.flatMap(s => s.topics.flatMap(tp => tp.entries.map(e => ({ e, s }))));
      hay ??= new Map(all.map(({ e }) => [e, haystack(e)]));
      const found = all.filter(({ e }) => matches(hay.get(e), query));
      if (!found.length) return `<p class="empty-note">${esc(t("words.noResults", { q: query }))}</p>`;
      const shown = found.slice(0, 120);
      return `<p class="muted">${esc(t("words.results", { n: num(found.length) }))}</p>
        <div class="vocab">${shown.map(({ e, s }) => entry(e).replace('<span class="phrase-t">', `<span class="phrase-t"><span class="in-stage">${esc(deckName(s.id))}</span>`)).join("")}</div>`;
    };

    const tabPanel = () => {
      if (tab === "traps") return `<p class="hint">${esc(t("words.trapsSub"))}</p><div class="phrase-list">${vocab.traps.map(trapRow).join("")}</div>`;
      const stage = vocab.stages.find(s => s.id === tab);
      return `${tab === "4" ? `<p class="callout">${icon("star")} ${t("words.herNote")}</p>` : ""}
        ${stage.topics.map(topic => `
          <section class="topic">
            <h2>${esc(tx(topic.title))} <span class="muted small">${num(topic.entries.length)}</span>
              ${topic.entries.length >= 4 ? `<a class="btn btn-ghost topic-practice" href="#/practice/${topic.id}">${icon("quiz")} ${t("pr.practice")}</a>` : ""}</h2>
            <div class="vocab">${topic.entries.map(entry).join("")}</div>
          </section>`).join("")}`;
    };

    const render = () => {
      const total = vocab.stages.reduce((n, s) => n + count(s), 0);
      root.innerHTML = `
        ${pageHead(t("words.title"), esc(t("words.sub", { n: num(total) })), "", "", "palms")}
        <div class="words-tools">
          <label class="search">${icon("search")}<span class="visually-hidden">${t("words.search")}</span>
            <input type="search" name="q" value="${esc(query)}" placeholder="${esc(t("words.searchHint"))}" autocomplete="off" spellcheck="false" data-search></label>
        </div>
        <div data-results${query ? "" : " hidden"}>${query ? results() : ""}</div>
        <div data-browse${query ? " hidden" : ""}>
          <div class="tabs" role="tablist" aria-label="${esc(t("words.stages"))}">
            ${TABS.map(id => `<a role="tab" id="tab-${id}" href="#/words/${id}" aria-selected="${id === tab}" aria-controls="panel" tabindex="${id === tab ? 0 : -1}">${esc(id === "traps" ? t("words.traps") : deckName(id))}</a>`).join("")}
          </div>
          <div id="panel" role="tabpanel" aria-labelledby="tab-${tab}">${tabPanel()}</div>
        </div>
        <section class="panel anki">
          <div>
            <h2>${t("words.anki")}</h2>
            <p class="muted">${t("words.ankiSub")}</p>
            <ol>
              <li>${esc(t("words.anki1"))}</li>
              <li>${esc(t("words.anki2"))}</li>
              <li>${esc(t("words.anki3"))}</li>
              <li class="muted">${esc(t("words.anki4"))}</li>
            </ol>
          </div>
          <div class="btn-row anki-downloads">
            ${vocab.stages.map(s => `<a class="btn" href="anki/${DECK_FILES[s.id]}" download>${icon("download")} ${esc(t("words.download", { name: deckName(s.id) }))} · ${num(count(s))} ${tu("unit.cards", count(s))}</a>`).join("")}
          </div>
        </section>`;
    };

    // Arrow keys move between tabs (and open them), as in any tab list.
    root.addEventListener("keydown", e => {
      const tabEl = e.target.closest?.('[role="tab"]');
      if (!tabEl) return;
      const rtl = document.documentElement.dir === "rtl";
      const step = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1, Home: -99, End: 99 }[e.key];
      if (!step) return;
      e.preventDefault();
      const i = Math.max(0, Math.min(TABS.length - 1, TABS.indexOf(tab) + step));
      location.hash = `#/words/${TABS[i]}`;
    }, { signal });

    let pending = 0;
    root.addEventListener("input", e => {
      if (!e.target.matches("[data-search]")) return;
      clearTimeout(pending);
      pending = setTimeout(() => {
        query = e.target.value.trim();
        const res = root.querySelector("[data-results]");
        res.hidden = !query;
        res.innerHTML = query ? results() : "";
        root.querySelector("[data-browse]").hidden = !!query;
      }, 120);
    }, { signal });
    signal.addEventListener("abort", () => clearTimeout(pending));

    loadVocab().then(({ vocab: v }) => {
      vocab = v;
      if (signal.aborted) return;
      render();
      // Switching tabs re-draws the page; keep the keyboard focus on the tab you're on.
      if ((document.activeElement === document.body || !document.activeElement) && params[0]) root.querySelector(`#tab-${tab}`)?.focus({ preventScroll: true });
    }).catch(() => {
      if (!signal.aborted) root.innerHTML = pageHead(t("words.title"), esc(t("words.loadError")), "", "", "palms");
    });
  },
};
