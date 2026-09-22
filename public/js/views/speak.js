// Speak it back — Volodymyr's own practice: hear the phrase in Dima's voice, say it, and hear the two
// one after the other. Everything else on the site is recognising; this is the only page where he speaks.
// His takes stay in this browser (core/mytakes.js) — they are for his ears, not hers.
//   #/speak/<deck>
import { t, tx, num } from "../core/i18n.js";
import { esc, ar, translit, flag, pageHead } from "../core/dom.js";
import { icon } from "../core/art.js";
import { loadVocab, DECKS } from "../core/vocab.js";
import { deckName } from "./shared.js";
import * as content from "../core/content.js";
import * as store from "../core/store.js";
import * as takes from "../core/mytakes.js";
import { record, canRecord, MAX_SECONDS } from "../core/mic.js";
import { play, stop as stopSound, decode, peaks, SLOW } from "../core/audiotools.js";
import { say } from "../core/speech.js";
import { todayKey } from "../core/dates.js";
import { celebrate } from "../core/celebrate.js";

const HER_VOICE = "voice"; // the first tab: everything she has recorded, wherever it comes from
const BARS = 48;

const textOf = n => n.speak ?? n.ar;
const keyOf = n => content.audioKey(textOf(n));

// A row of bars — the shape of a take, so a glance shows whether his is longer or emptier than hers.
const wave = (values, cls = "") =>
  `<span class="sp-wave${cls ? " " + cls : ""}" aria-hidden="true">${[...values].map(v =>
    `<i style="height:${Math.max(6, Math.round(v * 100))}%"></i>`).join("")}</span>`;

// The shape of a take and how long it runs, so his length can be held against hers.
const shapeOf = async url => {
  try {
    const blob = await (await fetch(url)).blob();
    const take = await decode(blob);
    return { bars: peaks(take, BARS), seconds: take.duration };
  } catch {
    return null;
  }
};

export default {
  titleKey: "speak.title",
  mount(root, { params, signal }) {
    if (store.isTeacher()) {
      location.replace("#/today"); // her voice is the model here; she has the Record page instead
      return;
    }
    let notes = [];
    let list = [];
    let i = 0;
    let mine = null; // { blob, seconds, url }
    let myShape = null;
    let herShape = null;
    let rec = null; // while recording
    let mineKeys = new Set();

    const deckIds = [HER_VOICE, ...DECKS.map(d => d.id)];
    const deck = () => (deckIds.includes(params[0]) ? params[0] : content.audioTimes().length ? HER_VOICE : "phrases");
    const label = d => (d === HER_VOICE ? t("speak.herVoice") : deckName(d));

    const build = () => {
      const d = deck();
      list = d === HER_VOICE ? notes.filter(n => content.hasAudio(textOf(n))) : notes.filter(n => n.deck === d);
      i = Math.min(i, Math.max(0, list.length - 1));
    };

    const item = () => list[i];

    // Her voice for this phrase — her recording when there is one, otherwise the computer's (which reads
    // formal Arabic, so the page says so).
    const hers = () => item() && content.hasAudio(textOf(item()));
    const listen = (slow = false) => {
      const n = item();
      if (!n) return;
      if (hers()) return content.playRecording(textOf(n), slow ? SLOW : 1).catch(() => {});
      say(textOf(n), { slow });
    };

    const playMine = () => mine?.url && play(mine.url).catch(() => {});

    // Hers, then his, one after the other — the whole point of the page.
    async function compare() {
      const n = item();
      if (!n || !mine?.url) return;
      try {
        if (hers()) {
          const a = await content.playRecording(textOf(n));
          await new Promise(r => a.addEventListener("ended", r, { once: true }));
        } else {
          say(textOf(n));
          await new Promise(r => setTimeout(r, 1600));
        }
        await new Promise(r => setTimeout(r, 350));
        await play(mine.url);
      } catch {}
    }

    async function loadTake() {
      mine = null;
      myShape = null;
      herShape = null;
      const n = item();
      if (!n) return render();
      const saved = await takes.load(keyOf(n));
      if (signal.aborted || item() !== n) return;
      if (saved?.blob) {
        mine = { blob: saved.blob, seconds: saved.seconds, url: URL.createObjectURL(saved.blob) };
        myShape = await shapeOf(mine.url);
      }
      if (hers()) {
        try {
          herShape = await shapeOf(await content.audioUrlFor(textOf(n)));
        } catch {}
      }
      if (!signal.aborted && item() === n) render();
    }

    function keep({ blob, seconds }) {
      const n = item();
      if (!n) return;
      mine = { blob, seconds, url: URL.createObjectURL(blob) };
      takes.save(keyOf(n), blob, seconds);
      mineKeys.add(keyOf(n));
      store.logSpoken(todayKey()); // one more phrase said out loud today
      const saidToday = store.entry(todayKey()).speak ?? 0;
      if (saidToday && saidToday % 10 === 0) setTimeout(() => celebrate(root.querySelector(".sp-count")), 400);
      shapeOf(mine.url).then(s => {
        myShape = s;
        if (!signal.aborted) render();
      });
      render();
      setTimeout(compare, 250); // hear the two at once — that's what teaches
    }

    function toggleRecord() {
      if (rec?.live) return rec.stop();
      stopSound();
      record({
        onLevel: level => {
          const meter = root.querySelector(".sp-level > i");
          if (meter) meter.style.transform = `scaleX(${level.toFixed(3)})`;
        },
        onDone: take => {
          rec = null;
          keep(take);
        },
        onFail: () => {
          rec = null;
          render(t("speak.noMic"));
        },
      }).then(handle => {
        rec = handle;
        render();
      });
      render();
    }

    const go = step => {
      if (rec?.live) rec.stop();
      stopSound();
      i = (i + step + list.length) % list.length;
      loadTake();
      render();
    };

    function render(message = "") {
      if (signal.aborted) return;
      const n = item();
      const d = deck();
      const todaySaid = store.entry(todayKey()).speak ?? 0;
      const recording = Boolean(rec?.live);
      const withHer = n && hers();

      root.innerHTML = `${pageHead(t("speak.title"), esc(t("speak.sub")), "", "", "rababa")}
        <div class="tabs" role="tablist">${deckIds.map(x => {
          const count = x === HER_VOICE ? notes.filter(y => content.hasAudio(textOf(y))).length : notes.filter(y => y.deck === x).length;
          return `<a role="tab" href="#/speak/${x}" aria-selected="${x === d}"${x === d ? ' class="is-on"' : ""}>${esc(label(x))} <small>${num(count)}</small></a>`;
        }).join("")}</div>

        ${!canRecord() ? `<p class="callout">${icon("mic")} ${esc(t("speak.noMic"))}</p>` : ""}
        ${message ? `<p class="callout is-bad">${esc(message)}</p>` : ""}

        ${!n ? `<p class="empty-note">${icon("mic")} ${esc(t(d === HER_VOICE ? "speak.noneRecorded" : "speak.noneHere"))}</p>` : `
        <section class="panel sp-card">
          <p class="sp-count"><span>${esc(t("speak.nOf", { n: num(i + 1), total: num(list.length) }))}</span>
            ${todaySaid ? `<b>${esc(t("speak.todayN", { n: num(todaySaid) }))}</b>` : ""}</p>

          <div class="sp-word">
            ${ar(n.ar, "sp-ar")}
            <span class="sp-say">${translit(n.say)}</span>
            <span class="sp-mean">${esc(tx({ en: n.en, uk: n.uk, najdi: n.en, msa: n.en }))}</span>
            ${flag(n)}
          </div>

          <div class="sp-side sp-her">
            <div class="sp-side-head"><b>${esc(withHer ? t("speak.herTake") : t("speak.computer"))}</b>
              ${herShape ? `<span class="muted">${esc(t("speak.seconds", { n: num(herShape.seconds, 1) }))}</span>` : ""}</div>
            ${herShape ? wave(herShape.bars, "is-her") : ""}
            <div class="sp-btns">
              <button type="button" class="btn" data-listen>${icon("sound")} ${esc(t("speak.listen"))}</button>
              <button type="button" class="btn btn-ghost" data-slow>${icon("slow")} ${esc(t("speak.slow"))}</button>
            </div>
            ${withHer ? "" : `<p class="sp-note">${icon("star")} ${esc(t("speak.computerNote"))}</p>`}
          </div>

          <div class="sp-side sp-mine">
            <div class="sp-side-head"><b>${esc(t("speak.yourTake"))}</b>
              ${mine && !recording ? `<span class="muted">${esc(t("speak.seconds", { n: num(mine.seconds, 1) }))}</span>` : ""}</div>
            ${recording
              ? `<span class="sp-level" aria-hidden="true"><i></i></span>`
              : myShape ? wave(myShape.bars, "is-mine") : `<p class="sp-empty">${esc(t("speak.notYet"))}</p>`}
            <div class="sp-btns">
              <button type="button" class="btn ${recording ? "btn-stop" : "btn-primary"}" data-rec ${canRecord() ? "" : "disabled"}>
                ${icon(recording ? "stop" : "mic")} ${esc(t(recording ? "speak.stop" : mine ? "speak.again" : "speak.record"))}</button>
              ${mine && !recording ? `<button type="button" class="btn btn-ghost" data-mine>${icon("play")} ${esc(t("speak.playMine"))}</button>
                <button type="button" class="btn btn-ghost" data-drop aria-label="${esc(t("speak.drop"))}">${icon("trash")}</button>` : ""}
            </div>
          </div>

          ${mine && !recording ? `<button type="button" class="btn btn-primary sp-compare" data-compare>${icon("redo")} ${esc(t("speak.compare"))}</button>` : ""}

          <div class="sp-nav">
            <button type="button" class="btn btn-ghost" data-step="-1">${icon("back")} ${esc(t("speak.prev"))}</button>
            <button type="button" class="btn" data-step="1">${esc(t("speak.next"))} ${icon("arrow", "flip-rtl")}</button>
          </div>
          <p class="sp-keys muted small">${esc(t("speak.keys", { max: num(MAX_SECONDS) }))}</p>
        </section>`}`;
    }

    root.addEventListener("click", e => {
      if (e.target.closest("[data-listen]")) return listen(false);
      if (e.target.closest("[data-slow]")) return listen(true);
      if (e.target.closest("[data-rec]")) return toggleRecord();
      if (e.target.closest("[data-mine]")) return playMine();
      if (e.target.closest("[data-compare]")) return compare();
      if (e.target.closest("[data-drop]")) {
        const n = item();
        if (!n) return;
        takes.remove(keyOf(n));
        mineKeys.delete(keyOf(n));
        mine = null;
        myShape = null;
        return render();
      }
      const step = e.target.closest("[data-step]");
      if (step) return go(+step.dataset.step);
    }, { signal });

    addEventListener("keydown", e => {
      if (e.target.matches("input, textarea") || e.metaKey || e.ctrlKey) return;
      const k = e.key.toLowerCase();
      if (k === " " || k === "spacebar") {
        e.preventDefault();
        toggleRecord();
      } else if (k === "l") listen(false);
      else if (k === "s") listen(true);
      else if (k === "c") compare();
      else if (k === "arrowright" || k === "n") go(1);
      else if (k === "arrowleft") go(-1);
    }, { signal });

    signal.addEventListener("abort", () => {
      if (rec?.live) rec.stop();
      stopSound();
    });

    render();
    Promise.all([loadVocab(), content.load(), takes.keys()]).then(([v, , ks]) => {
      if (signal.aborted) return;
      notes = v.notes;
      mineKeys = new Set(ks ?? []);
      build();
      loadTake();
      render();
    }, () => {});
    const off = content.onChange(() => {
      build();
      render();
    });
    signal.addEventListener("abort", off);
  },
};
