// Dima records her voice for each word, deck by deck. Once a word is recorded, every speaker button for it plays
// her voice instead of the computer's. Only her profile can record (the server enforces it too).
//   #/record/<deck>   deck = phrases · 1 · grammar · 2 · special · 3 · 4
import { t, tx, num } from "../core/i18n.js";
import { esc, ar, translit, pageHead } from "../core/dom.js";
import { icon } from "../core/art.js";
import { loadVocab, speakText, DECKS } from "../core/vocab.js";
import * as content from "../core/content.js";
import * as store from "../core/store.js";
import { deckName } from "./shared.js";

const MAX_MS = 10_000; // a word or a phrase — never more than a few seconds
let onlyTodo = true; // kept while she moves between decks
const textOf = n => n.speak ?? speakText(n.ar);

export default {
  titleKey: "record.title",
  mount(root, { params, signal }) {
    root.innerHTML = pageHead(t("record.title"), esc(t("record.sub")), "", "", "phrases");
    let notes = [];
    let stream = null;
    let recorder = null;

    signal.addEventListener("abort", () => {
      if (recorder?.state === "recording") recorder.stop();
      stream?.getTracks().forEach(tr => tr.stop());
    });

    const deckIds = DECKS.map(d => d.id);
    const pick = () => {
      if (deckIds.includes(params[0])) return params[0];
      return deckIds.find(d => notes.some(n => n.deck === d && !content.hasAudio(textOf(n)))) ?? deckIds[0];
    };

    const row = n => {
      const done = content.hasAudio(textOf(n));
      return `<li class="rec-row${done ? " is-done" : ""}" data-id="${esc(n.id)}">
        <div class="rec-word">${ar(n.ar, "rec-ar")} <span class="rec-t">${translit(n.say)} · <span>${esc(tx({ en: n.en, uk: n.uk, najdi: n.en, msa: n.en }))}</span></span></div>
        <div class="rec-actions">
          ${done ? `<span class="rec-ok">${icon("check")}<span>${t("record.saved")}</span></span>` : ""}
          <button type="button" class="btn rec-go" data-rec><i class="rec-dot" aria-hidden="true"></i><span>${t(done ? "record.redo" : "record.start")}</span></button>
          ${done ? `<button type="button" class="btn btn-ghost" data-play aria-label="${esc(t("record.play"))}">${icon("play")}</button>` : ""}
          <button type="button" class="btn btn-ghost" data-edit="${esc(n.id)}" aria-label="${esc(t("edit.button"))}">✎</button>
          ${done ? `<button type="button" class="btn btn-ghost" data-del aria-label="${esc(t("record.delete"))}">${icon("close")}</button>` : ""}
        </div>
        <p class="rec-msg" aria-live="polite"></p>
      </li>`;
    };

    const render = () => {
      if (signal.aborted) return;
      const deck = pick();
      const inDeck = notes.filter(n => n.deck === deck);
      const texts = notes.map(textOf);
      const shown = onlyTodo ? inDeck.filter(n => !content.hasAudio(textOf(n))) : inDeck;
      const canRecord = store.isTeacher() && content.signedIn() && "MediaRecorder" in window;
      root.innerHTML = `${pageHead(t("record.title"), esc(t("record.sub")), "", "", "phrases")}
        ${!content.signedIn() ? `<p class="callout">${t("record.signIn")}</p>` : !store.isTeacher() ? `<p class="callout">${t("record.onlyDima")}</p>` : ""}
        <p class="rec-total"><b>${esc(t("record.count", { n: num(content.recordedCount(texts)), total: num(texts.length) }))}</b> · ${esc(t("record.tip"))}</p>
        <div class="tabs" role="tablist">${deckIds.map(d => {
          const left = notes.filter(n => n.deck === d && !content.hasAudio(textOf(n))).length;
          return `<a role="tab" href="#/record/${d}" aria-selected="${d === deck}"${d === deck ? ' class="is-on"' : ""}>${esc(deckName(d))} <small>${num(left)}</small></a>`;
        }).join("")}</div>
        <div class="seg" role="group">
          <button type="button" data-filter="todo" aria-pressed="${onlyTodo}">${t("record.filterTodo")}</button>
          <button type="button" data-filter="all" aria-pressed="${!onlyTodo}">${t("record.filterAll")}</button>
        </div>
        ${shown.length ? `<ul class="rec-list${canRecord ? "" : " no-rec"}">${shown.map(row).join("")}</ul>` : `<p class="empty-note">${icon("check")} ${t("record.allDone")}</p>`}`;
    };

    async function mic() {
      stream ??= await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 } });
      return stream;
    }

    async function record(li, n, btn) {
      const msg = li.querySelector(".rec-msg");
      if (recorder?.state === "recording") return recorder.stop(); // the same button stops it
      try {
        await mic();
      } catch {
        msg.textContent = t("record.noMic");
        return;
      }
      const type = ["audio/mp4", "audio/webm;codecs=opus", "audio/webm"].find(x => MediaRecorder.isTypeSupported?.(x)) ?? "";
      recorder = new MediaRecorder(stream, type ? { mimeType: type } : {});
      const chunks = [];
      recorder.ondataavailable = e => e.data.size && chunks.push(e.data);
      const auto = setTimeout(() => recorder?.state === "recording" && recorder.stop(), MAX_MS);
      recorder.onstop = async () => {
        clearTimeout(auto);
        li.classList.remove("is-recording");
        btn.querySelector("span").textContent = t("record.saving");
        btn.disabled = true;
        try {
          const blob = new Blob(chunks, { type: recorder.mimeType || type || "audio/mp4" });
          await content.upload(textOf(n), blob);
          content.playRecording(textOf(n)).catch(() => {}); // she hears what was saved
          render();
        } catch {
          msg.textContent = t("record.error");
          btn.disabled = false;
          btn.querySelector("span").textContent = t("record.start");
        }
      };
      recorder.start();
      li.classList.add("is-recording");
      btn.querySelector("span").textContent = t("record.stop");
    }

    root.addEventListener("click", e => {
      const f = e.target.closest("[data-filter]");
      if (f) {
        onlyTodo = f.dataset.filter === "todo";
        return render();
      }
      const li = e.target.closest(".rec-row");
      if (!li) return;
      const n = notes.find(x => x.id === li.dataset.id);
      if (e.target.closest("[data-rec]")) return record(li, n, e.target.closest("[data-rec]"));
      if (e.target.closest("[data-play]")) return content.playRecording(textOf(n)).catch(() => {});
      if (e.target.closest("[data-del]")) {
        return content.removeRecording(textOf(n)).then(render, () => (li.querySelector(".rec-msg").textContent = t("record.error")));
      }
    }, { signal });

    Promise.all([loadVocab(), content.load()]).then(([v]) => {
      notes = v.notes;
      render();
    }, () => {});
    const off = content.onChange(render);
    signal.addEventListener("abort", off);
  },
};
