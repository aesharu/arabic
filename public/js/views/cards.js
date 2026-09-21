// Cards — spaced repetition in the site, the way Anki does it.
//   #/cards               the decks, today's numbers, settings
//   #/cards/study         study every open deck, in the plan's order
//   #/cards/study/<deck>  study one deck
import * as store from "../core/store.js";
import * as cards from "../core/cards.js";
import { preview } from "../core/srs.js";
import { loadVocab, DECKS, speakText } from "../core/vocab.js";
import { say } from "../core/speech.js";
import { running as timerRunning } from "../core/timer.js";
import { todayKey, addDays, shortDate } from "../core/dates.js";
import { t, tx, tu, num, lang, locale } from "../core/i18n.js";
import { esc, rich, ar, translit, flag, pageHead, typing } from "../core/dom.js";
import { icon, vignette } from "../core/art.js";
import { deckName, wordsMeter } from "./shared.js";

const MAX_ANSWER_MS = 60_000; // like Anki: a card never counts for more than a minute of study time
let carryMs = 0; // study time not yet added to today's minutes

// "10m", "4d", "2.5mo" in English; the locale's own short units elsewhere ("10 хв", "4 أيام").
function span(p) {
  const round1 = n => Math.round(n * 10) / 10;
  const unit = (n, u) =>
    lang() === "en"
      ? `${n}${{ minute: "m", hour: "h", day: "d", month: "mo", year: "y" }[u]}`
      : new Intl.NumberFormat(locale(), { style: "unit", unit: u, unitDisplay: "short", maximumFractionDigits: 1 }).format(n);
  if (p.ms !== undefined) {
    const m = Math.max(1, Math.round(p.ms / 60000));
    return m < 60 ? unit(m, "minute") : unit(round1(m / 60), "hour");
  }
  if (p.days < 30) return unit(p.days, "day");
  if (p.days < 365) return unit(round1(p.days / 30), "month");
  return unit(round1(p.days / 365), "year");
}

const GRADES = [
  { g: 1, key: "cards.again", cls: "again" },
  { g: 2, key: "cards.hard", cls: "hard" },
  { g: 3, key: "cards.good", cls: "good" },
  { g: 4, key: "cards.easy", cls: "easy" },
];

// The meaning, for a "say it" card's front: interface language first (English in the Arabic interfaces).
function meaningFront(n) {
  const first = lang() === "uk" ? "uk" : "en";
  const second = first === "en" ? "uk" : "en";
  return `<p class="study-meaning" lang="${first}">${esc(n[first])}</p>
    <p class="study-meaning-2" lang="${second}" dir="ltr"><i>${second === "uk" ? "UA" : "EN"}</i> ${esc(n[second])}</p>`;
}

function answerSide(n, kind) {
  const first = lang() === "uk" ? "uk" : "en";
  const second = first === "en" ? "uk" : "en";
  const extra = [
    n.toHer ? `<p class="study-extra">${t("words.toHer")}: ${ar(n.toHer.ar)} ${translit(n.toHer.say)}</p>` : "",
    n.reply ? `<p class="study-extra">${t("words.reply")}: ${ar(n.reply.ar)} ${n.reply.say ? translit(n.reply.say) : ""}</p>` : "",
    n.note && !n.check ? `<p class="study-note">${rich(tx(n.note))}</p>` : "",
  ].join("");
  const arabic = kind === "p"
    ? `<p class="study-ar">${ar(n.ar)}</p>`
    : "";
  return `
    ${arabic}
    <p class="study-say">${translit(n.say)} ${n.check ? flag({ check: true, checkNote: n.checkNote ?? n.note }) : ""}</p>
    ${kind === "r" ? `<p class="study-meaning" lang="${first}">${esc(n[first])}</p><p class="study-meaning-2" lang="${second}" dir="ltr"><i>${second === "uk" ? "UA" : "EN"}</i> ${esc(n[second])}</p>` : ""}
    <p class="study-msa"><i title="${esc(t("lab.msaHint"))}">${t("lab.msa")}</i> ${ar(n.msa)}</p>
    ${extra}`;
}

export default {
  titleKey: "cards.title",
  mount(root, { params, signal }) {
    const studying = params[0] === "study";
    const deck = studying && params[1] && DECKS.some(d => d.id === params[1]) ? params[1] : null;
    root.innerHTML = pageHead(t("cards.title"), esc(t("cards.loading")), "", "", "cards");

    let notes = [];
    let byId = new Map();
    let current = null; // { cardId, shownAt, revealed }
    let undoToken = null;
    let wakeTimer = 0;
    signal.addEventListener("abort", () => clearTimeout(wakeTimer));

    // ---------- The deck list ----------
    const renderDecks = () => {
      const today = todayKey();
      const p = cards.prefs();
      const all = cards.counts(notes);
      const stats = cards.wordStats(notes);
      const any = all.fresh + all.learn + all.review > 0;
      const susp = cards.suspendedCount();
      root.innerHTML = `
        ${pageHead(t("cards.title"), t("cards.sub"), "", "", "cards")}
        <section class="panel cards-hero">
          <div class="cards-today">
            <h2>${t("cards.today")}</h2>
            <dl class="due-counts">
              <div class="c-new"><dt>${t("cards.new")}</dt><dd>${all.fresh}</dd></div>
              <div class="c-learn"><dt>${t("cards.learning")}</dt><dd>${all.learn}</dd></div>
              <div class="c-due"><dt>${t("cards.due")}</dt><dd>${all.review}</dd></div>
            </dl>
            ${any
              ? `<a class="btn btn-primary btn-big" href="#/cards/study">${icon("cards")} ${t("cards.studyNow")}</a>`
              : `<p class="muted">${t("cards.nothingNow")}</p>`}
          </div>
          <div class="cards-words">${wordsMeter(stats)}</div>
        </section>

        <section class="panel">
          <div class="panel-head"><h2>${t("cards.decks")}</h2><span class="muted small">${t("cards.newPerDayNote", { n: p.newPerDay })}</span></div>
          <table class="decks">
            <thead><tr><th>${t("cards.deck")}</th><th class="num c-new">${t("cards.new")}</th><th class="num c-learn">${t("cards.learning")}</th><th class="num c-due">${t("cards.due")}</th><th><span class="visually-hidden">${t("cards.study")}</span></th></tr></thead>
            <tbody>${DECKS.map(d => {
              const open = cards.deckOpen(d.id, today);
              const c = cards.counts(notes, { deck: d.id });
              const size = notes.filter(n => n.deck === d.id).length;
              const has = c.fresh + c.learn + c.review > 0;
              return `<tr class="${open ? "" : "is-locked"}">
                <th scope="row"><span class="deck-name">${esc(deckName(d.id))}</span>
                  <span class="deck-size">${num(size)} ${tu("unit.words", size)}${open ? "" : ` · ${icon("lock")} ${esc(t("cards.opens", { date: shortDate(d.opens, locale()) }))}`}</span></th>
                <td class="num c-new">${c.fresh || "·"}</td><td class="num c-learn">${c.learn || "·"}</td><td class="num c-due">${c.review || "·"}</td>
                <td class="deck-go">${has ? `<a class="btn btn-small" href="#/cards/study/${d.id}">${t("cards.study")}</a>` : ""}</td>
              </tr>`;
            }).join("")}</tbody>
          </table>
        </section>

        <div class="cards-foot">
          <details class="panel settings">
            <summary><h2>${icon("settings")} ${t("cards.settings")}</h2></summary>
            <form class="settings-form" data-settings>
              <label class="field"><span>${t("cards.newPerDay")}</span>
                <input type="number" name="newPerDay" min="0" max="50" step="1" value="${p.newPerDay}" inputmode="numeric"></label>
              <label class="check"><input type="checkbox" name="reverse"${p.reverse ? " checked" : ""}> <span>${t("cards.reverse")}<small>${t("cards.reverseHint")}</small></span></label>
              <label class="check"><input type="checkbox" name="autoplay"${p.autoplay ? " checked" : ""}> <span>${t("cards.autoplay")}</span></label>
              <label class="check"><input type="checkbox" name="unlockAll"${p.unlockAll ? " checked" : ""}> <span>${t("cards.unlockAll")}<small>${t("cards.unlockAllHint")}</small></span></label>
              ${susp ? `<p>${esc(t("cards.suspended", { n: susp }))} <button type="button" class="btn btn-small" data-unsuspend>${t("cards.unsuspend")}</button></p>` : ""}
            </form>
          </details>
          <details class="panel how">
            <summary><h2>${t("cards.how")}</h2></summary>
            <ul class="checks">
              <li>${t("cards.how1")}</li>
              <li>${t("cards.how2")}</li>
              <li>${t("cards.how3")}</li>
              <li>${t("cards.how4")}</li>
            </ul>
            <p class="keys">${t("cards.keys")}</p>
          </details>
        </div>`;
    };

    // ---------- Studying ----------
    const renderStudy = () => {
      clearTimeout(wakeTimer);
      const now = Date.now();
      const q = cards.queue(notes, { deck, now });
      const cardId = cards.nextCard(q, now);
      const title = deck ? deckName(deck) : t("cards.allDecks");
      if (!cardId) return renderFinished(q, title);

      if (current?.cardId !== cardId) current = { cardId, shownAt: now, revealed: false };
      const n = byId.get(cards.noteOfCard(cardId));
      const kind = cards.kindOf(cardId);
      const c = cards.cardOf(cardId);
      const which = q.learn.includes(cardId) || q.later.includes(cardId) ? "learn" : q.review.includes(cardId) ? "review" : "fresh";
      const labels = preview(c ?? { s: 0, due: 0, ivl: 0, ease: 2.5, step: 0, reps: 0, lapses: 0 }, { now, today: todayKey() });

      root.innerHTML = `
        <div class="study-bar">
          <a class="btn btn-ghost" href="#/cards">${icon("back")} ${t("cards.decks")}</a>
          <p class="study-deck">${esc(title)}</p>
          <p class="study-counts" aria-label="${esc(t("cards.remaining"))}">
            <span class="c-new${which === "fresh" ? " is-now" : ""}" title="${esc(t("cards.new"))}">${q.fresh.length}</span>
            <span class="c-learn${which === "learn" ? " is-now" : ""}" title="${esc(t("cards.learning"))}">${q.learn.length + q.later.length}</span>
            <span class="c-due${which === "review" ? " is-now" : ""}" title="${esc(t("cards.due"))}">${q.review.length}</span>
          </p>
          <button class="btn btn-ghost" data-undo${undoToken ? "" : " disabled"} title="Ctrl+Z">${icon("undo")} ${t("cards.undo")}</button>
        </div>

        <article class="study-card kind-${kind}${current.revealed ? " is-revealed" : ""}" aria-labelledby="study-q">
          <p class="study-kind">${kind === "r" ? t("cards.kindRecognise") : t("cards.kindSay")}${n.topicTitle ? ` · ${esc(tx(n.topicTitle))}` : ""}</p>
          <div class="study-front" id="study-q">
            ${kind === "r"
              ? `<p class="study-ar big">${ar(n.ar)}</p>`
              : `${meaningFront(n)}<p class="study-prompt">${t("cards.sayPrompt")}</p>`}
          </div>
          ${kind === "r" || current.revealed ? `<button class="hear" data-say="${esc(n.speak ?? speakText(n.ar))}" aria-label="${esc(t("lab.hear", { what: n.say }))}" title="R">${icon("sound")}</button>` : ""}
          <div class="study-back" aria-live="polite">${current.revealed ? `<hr>${answerSide(n, kind)}` : ""}</div>
        </article>

        <div class="study-actions">
          ${current.revealed
            ? `<div class="grades" role="group" aria-label="${esc(t("cards.howWell"))}">${GRADES.map(g => `
                <button class="grade ${g.cls}" data-grade="${g.g}">
                  <span class="grade-ivl">${esc(span(labels[g.g - 1]))}</span>
                  <b>${t(g.key)}</b><kbd>${g.g}</kbd>
                </button>`).join("")}</div>`
            : `<button class="btn btn-primary btn-big show-answer" data-show>${t("cards.show")} <kbd>${t("cards.space")}</kbd></button>`}
        </div>
        <p class="study-more">
          <button class="linkish" data-suspend>${t("cards.suspend")}</button>
          <span class="muted">${esc(t("cards.keysShort"))}</span>
        </p>`;
      const focusTarget = root.querySelector(current.revealed ? '[data-grade="3"]' : "[data-show]");
      focusTarget?.focus({ preventScroll: true });
    };

    const renderFinished = (q, title) => {
      const tomorrow = addDays(todayKey(), 1);
      const allCards = store.get().srs.cards;
      const dueTomorrow = Object.values(allCards).filter(c => !c.susp && c.s === 2 && c.due <= tomorrow).length;
      const day = store.get().log[todayKey()]?.cards;
      const waitMs = q.nextAt ? q.nextAt - Date.now() : 0;
      root.innerHTML = `
        <div class="study-bar"><a class="btn btn-ghost" href="#/cards">${icon("back")} ${t("cards.decks")}</a><p class="study-deck">${esc(title)}</p></div>
        <section class="finished">
          ${vignette("finish")}
          <h1>${t("cards.doneTitle")}</h1>
          <p class="sub">${esc(t("cards.doneSub", { n: day?.r ?? 0 }))}</p>
          <p>${q.nextAt
            ? esc(t("cards.nextIn", { time: span({ ms: waitMs }) }))
            : esc(t("cards.tomorrow", { n: dueTomorrow }))}</p>
          ${q.fresh.length === 0 && cards.newLeft() === 0 ? `<p class="muted">${esc(t("cards.limitReached", { n: cards.prefs().newPerDay }))}</p>` : ""}
          <div class="btn-row center"><a class="btn btn-primary" href="#/today">${t("cards.backToday")}</a><a class="btn" href="#/cards">${t("cards.decks")}</a></div>
        </section>`;
      // Come back by itself when the next learning card is ready.
      if (q.nextAt) wakeTimer = setTimeout(renderStudy, Math.max(1000, waitMs - 20 * 60_000 + 1000));
    };

    const reveal = () => {
      if (!current || current.revealed) return;
      current.revealed = true;
      renderStudy();
      const n = byId.get(cards.noteOfCard(current.cardId));
      if (cards.prefs().autoplay) say(n.speak ?? speakText(n.ar));
    };

    const grade = g => {
      if (!current?.revealed) return;
      const spent = Math.min(MAX_ANSWER_MS, Date.now() - current.shownAt);
      undoToken = cards.answerCard(current.cardId, g);
      // Card time counts as study time, unless the study timer is already counting it.
      if (!timerRunning()) {
        carryMs += spent;
        const whole = Math.floor(carryMs / 60000);
        if (whole > 0) {
          carryMs -= whole * 60000;
          store.addMinutes(todayKey(), whole);
        }
      }
      current = null;
      renderStudy();
    };

    const doUndo = () => {
      if (!undoToken) return;
      cards.undo(undoToken);
      current = { cardId: undoToken.cardId, shownAt: Date.now(), revealed: false };
      undoToken = null;
      renderStudy();
    };

    root.addEventListener("click", e => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.hasAttribute("data-show")) reveal();
      else if (b.dataset.grade) grade(+b.dataset.grade);
      else if (b.hasAttribute("data-undo")) doUndo();
      else if (b.hasAttribute("data-suspend") && current) {
        cards.suspend(current.cardId);
        current = null;
        renderStudy();
      } else if (b.hasAttribute("data-unsuspend")) {
        cards.unsuspendAll();
        renderDecks();
      }
    }, { signal });

    root.addEventListener("change", e => {
      const form = e.target.closest("[data-settings]");
      if (!form) return;
      const f = new FormData(form);
      cards.setPrefs({
        newPerDay: Math.max(0, Math.min(50, parseInt(f.get("newPerDay"), 10) || 0)),
        reverse: f.has("reverse"),
        autoplay: f.has("autoplay"),
        unlockAll: f.has("unlockAll"),
      });
      const focused = e.target.name;
      renderDecks();
      root.querySelector("details.settings").open = true;
      root.querySelector(`[name="${focused}"]`)?.focus();
    }, { signal });

    document.addEventListener("keydown", e => {
      if (!studying || typing(e) || e.altKey) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        return doUndo();
      }
      if (e.metaKey || e.ctrlKey) return;
      if (!current) return;
      if (e.key === " " || e.key === "Enter") {
        if (e.target.closest?.("a, button:not([data-show]):not([data-grade])")) return;
        e.preventDefault();
        if (current.revealed) grade(3);
        else reveal();
      } else if (current.revealed && /^[1-4]$/.test(e.key)) grade(+e.key);
      else if (e.key.toLowerCase() === "r" || e.key === "ق") {
        const n = byId.get(cards.noteOfCard(current.cardId));
        if (cards.kindOf(current.cardId) === "r" || current.revealed) say(n.speak ?? speakText(n.ar));
      }
    }, { signal });

    loadVocab()
      .then(({ notes: list }) => {
        if (signal.aborted) return;
        notes = list;
        byId = new Map(notes.map(n => [n.id, n]));
        if (studying) renderStudy();
        else renderDecks();
      })
      .catch(() => {
        if (!signal.aborted) root.innerHTML = pageHead(t("cards.title"), esc(t("words.loadError")), "", "", "cards");
      });
  },
};
