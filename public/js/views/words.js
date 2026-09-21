import { t, tx, tu } from "../core/i18n.js";
import { esc, rich, ar, translit, flag, meanings, playIcon, pageHead } from "../core/dom.js";
import { phaseTitle } from "../core/schedule.js";
import { PHASES } from "../data/plan.js";

// The vocabulary comes from public/data/vocab.json, generated from NAJDI-PLAN.md by `npm run vocab`.
let request = null; // the fetch, shared by every visit
let tab = "1";
const load = () => (request ??= fetch("data/vocab.json").then(r => (r.ok ? r.json() : Promise.reject(r.status))));

const DECK_FILES = { "1": "najdi-stage1.csv", "2": "najdi-stage2.csv", "3": "najdi-stage3.csv", special: "najdi-special.csv", grammar: "najdi-grammar.csv" };
const stageName = id => (["1", "2", "3"].includes(id) ? tx(phaseTitle(PHASES[+id])) : t(id === "special" ? "words.special" : "words.grammar"));
const count = stage => stage.topics.reduce((n, topic) => n + topic.entries.length, 0);

const entry = e => `
  <button class="phrase" data-say="${esc(e.ar.split(/ [/→] /).at(-1).replace(/[…؟]/g, ""))}">
    ${ar(e.ar, "phrase-ar")}
    <span class="phrase-t">${translit(e.say)} ${e.check ? flag({ check: true, checkNote: e.note }) : ""}${meanings(e)}
      ${e.toHer ? `<span class="to-her">${t("words.toHer")}: ${ar(e.toHer.ar)} ${translit(e.toHer.say)}</span>` : ""}
      ${e.reply ? `<span class="to-her">${t("words.reply")}: ${ar(e.reply.ar)} ${e.reply.say ? translit(e.reply.say) : ""}</span>` : ""}
      ${e.note ? `<span class="pnote">${rich(tx(e.note))}</span>` : ""}</span>
    ${playIcon}
  </button>`;

const trapRow = tr => `
  <div class="phrase-row trap">
    <div class="trap-side"><span class="muted small">${t("words.youSee")} · ${esc(tx(tr.dialect))}</span>${ar(tr.wrong.ar, "phrase-ar strike")} ${translit(tr.wrong.say)}</div>
    <div class="trap-side"><span class="muted small">${t("words.sayInstead")}</span>
      <button class="phrase" data-say="${esc(tr.right.ar)}">${ar(tr.right.ar, "phrase-ar")} ${translit(tr.right.say)} ${playIcon}</button></div>
  </div>`;

export default {
  titleKey: "words.title",
  mount(root, { signal }) {
    root.innerHTML = pageHead(t("words.title"), esc(t("words.loading")));

    let vocab = null;
    const render = () => {
      const total = vocab.stages.reduce((n, s) => n + count(s), 0);
      const tabs = [...vocab.stages.map(s => s.id), "traps"];
      const current = vocab.stages.find(s => s.id === tab);
      root.innerHTML = `
        ${pageHead(t("words.title"), esc(t("words.sub", { n: total })))}
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
            ${vocab.stages.map(s => `<a class="btn" href="anki/${DECK_FILES[s.id]}" download>${esc(t("words.download", { name: stageName(s.id) }))} · ${count(s)} ${tu("unit.cards", count(s))}</a>`).join("")}
          </div>
        </section>
        <div class="tabs" role="tablist">
          ${tabs.map(id => `<button role="tab" data-tab="${id}" aria-selected="${id === tab}">${esc(id === "traps" ? t("words.traps") : stageName(id))}</button>`).join("")}
        </div>
        ${tab === "traps"
          ? `<p class="hint">${esc(t("words.trapsSub"))}</p><div class="phrase-list">${vocab.traps.map(trapRow).join("")}</div>`
          : current.topics.map(topic => `
            <section class="topic">
              <h2>${esc(tx(topic.title))}</h2>
              <div class="vocab">${topic.entries.map(entry).join("")}</div>
            </section>`).join("")}`;
    };

    root.addEventListener("click", e => {
      const b = e.target.closest("[data-tab]");
      if (!b) return;
      tab = b.dataset.tab;
      render();
      root.querySelector(`[data-tab="${tab}"]`)?.focus();
    }, { signal });

    load().then(v => {
      vocab = v;
      if (!signal.aborted) render();
    }).catch(() => {
      request = null; // try again on the next visit
      if (!signal.aborted) root.innerHTML = pageHead(t("words.title"), esc(t("words.loadError")));
    });
  },
};
