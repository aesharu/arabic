// Dima records her voice for each word, deck by deck. Once a word is recorded, every speaker button for it plays
// her voice instead of the computer's. Only her profile can record (the server enforces it too).
// A word opens in the voice studio (core/studio.js): record, listen, cut, save — and ‹ › to the next word.
// Words she records while here stay in the list (marked ✓) even under "Not recorded yet", until she leaves the deck.
//   #/record/<deck>   deck = phrases · 1 · grammar · 2 · special · 3 · 4
import { t, tx, num } from "../core/i18n.js";
import { SLOW } from "../core/audiotools.js";
import { esc, ar, translit, pageHead } from "../core/dom.js";
import { icon } from "../core/art.js";
import { loadVocab, DECKS } from "../core/vocab.js";
import * as content from "../core/content.js";
import * as store from "../core/store.js";
import { deckName } from "./shared.js";
import { DIALOGUES } from "../data/weeks.js";
import { CHAT_LINES } from "../data/chats.js";
import { openStudio, spoken } from "../core/studio.js";

// The weekly conversations, recordable line by line (their ids match the lesson pages' ✎).
const TALK = Object.entries(DIALOGUES).flatMap(([w, lines]) => lines.map((l, i) => ({ ...l, id: `d${w}x${i}`, deck: "talk" })));
const CHATS = CHAT_LINES.map(l => ({ ...l, deck: "chats" }));
const deckLabel = d => (d === "talk" ? t("lessons.conversation") : d === "chats" ? t("nav.chats") : deckName(d));

let onlyTodo = true; // kept while she moves between decks
const textOf = spoken;

export default {
  titleKey: "record.title",
  mount(root, { params, signal }) {
    root.innerHTML = pageHead(t("record.title"), esc(t("record.sub")), "", "", "phrases");
    let notes = [];
    let shown = [];
    const doneHere = new Set(); // recorded during this visit: they stay in view

    const deckIds = [...DECKS.map(d => d.id), "talk", "chats"];
    const pick = () => {
      if (deckIds.includes(params[0])) return params[0];
      return deckIds.find(d => notes.some(n => n.deck === d && !content.hasAudio(textOf(n)))) ?? deckIds[0];
    };

    const row = (n, k) => {
      const done = content.hasAudio(textOf(n));
      return `<li class="rec-row${done ? " is-done" : ""}" data-id="${esc(n.id)}">
        <button type="button" class="rec-open" data-open="${k}">
          <span class="rec-word">${ar(n.ar, "rec-ar")} <span class="rec-t">${translit(n.say)} · <span>${esc(tx({ en: n.en, uk: n.uk, najdi: n.en, msa: n.en }))}</span></span></span>
          <span class="rec-state">${done ? `<span class="rec-ok">${icon("check")}<span>${t("record.saved")}</span></span>` : `<span class="rec-go"><i class="rec-dot" aria-hidden="true"></i>${t("record.start")}</span>`}</span>
        </button>
        <span class="rec-actions">
          ${done ? `<button type="button" class="btn btn-ghost" data-play aria-label="${esc(t("record.play"))}">${icon("play")}</button>
            <button type="button" class="btn btn-ghost" data-slow aria-label="${esc(t("speech.slowLabel"))}">${icon("slow")}</button>` : ""}
          <button type="button" class="btn btn-ghost" data-edit="${esc(n.id)}" aria-label="${esc(t("edit.button"))}">${icon("pencil")}</button>
        </span>
      </li>`;
    };

    const render = () => {
      if (signal.aborted || document.querySelector("dialog.studio")) return;
      const deck = pick();
      const inDeck = notes.filter(n => n.deck === deck);
      const texts = notes.map(textOf);
      shown = onlyTodo ? inDeck.filter(n => !content.hasAudio(textOf(n)) || doneHere.has(n.id)) : inDeck;
      const canRecord = store.isTeacher() && content.signedIn();
      const count = content.recordedCount(texts);
      root.innerHTML = `${pageHead(t("record.title"), esc(t("record.sub")), "", "", "phrases")}
        ${!content.signedIn() ? `<p class="callout">${t("record.signIn")}</p>` : !store.isTeacher() ? `<p class="callout">${t("record.onlyDima")}</p>` : ""}
        <div class="rec-total"><b>${esc(t("record.count", { n: num(count), total: num(texts.length) }))}</b>
          <span class="meter" aria-hidden="true"><span style="width:${texts.length ? (count / texts.length) * 100 : 0}%"></span></span>
          <span>${esc(t("record.tip"))}</span></div>
        <div class="tabs" role="tablist">${deckIds.map(d => {
          const left = notes.filter(n => n.deck === d && !content.hasAudio(textOf(n))).length;
          return `<a role="tab" href="#/record/${d}" aria-selected="${d === deck}"${d === deck ? ' class="is-on"' : ""}>${esc(deckLabel(d))} <small>${num(left)}</small></a>`;
        }).join("")}</div>
        <div class="seg" role="group">
          <button type="button" data-filter="todo" aria-pressed="${onlyTodo}">${t("record.filterTodo")}</button>
          <button type="button" data-filter="all" aria-pressed="${!onlyTodo}">${t("record.filterAll")}</button>
        </div>
        ${shown.length ? `<ul class="rec-list${canRecord ? "" : " no-rec"}">${shown.map(row).join("")}</ul>` : `<p class="empty-note">${icon("check")} ${t("record.allDone")}</p>`}`;
    };

    root.addEventListener("click", e => {
      const f = e.target.closest("[data-filter]");
      if (f) {
        onlyTodo = f.dataset.filter === "todo";
        doneHere.clear();
        return render();
      }
      const li = e.target.closest(".rec-row");
      if (!li) return;
      const n = notes.find(x => x.id === li.dataset.id);
      if (e.target.closest("[data-play]")) return content.playRecording(textOf(n)).catch(() => {});
      if (e.target.closest("[data-slow]")) return content.playRecording(textOf(n), SLOW).catch(() => {});
      const open = e.target.closest("[data-open]");
      if (open && store.isTeacher() && content.signedIn()) {
        const list = [...shown];
        const before = new Set(list.filter(x => content.hasAudio(textOf(x))).map(x => x.id));
        openStudio(list, +open.dataset.open, {
          onClose: () => {
            list.forEach(x => content.hasAudio(textOf(x)) && !before.has(x.id) && doneHere.add(x.id));
            render();
          },
        });
      } else if (open && content.hasAudio(textOf(n))) content.playRecording(textOf(n)).catch(() => {});
    }, { signal });

    Promise.all([loadVocab(), content.load()]).then(([v]) => {
      notes = [...v.notes, ...TALK.map(content.apply), ...CHATS.map(content.apply)];
      render();
    }, () => {});
    const off = content.onChange(render);
    signal.addEventListener("abort", off);
  },
};
