import * as D from "../deck.js";
import { S, TYPES } from "../deck.js";
import { previewLabel, fmtDuration, MIN } from "../fsrs.js";
import { $, esc, plural, play, playAll, stopAudio, audioName, audioNames, clozeHtml, hydrateMedia, toast, STAR_ICON, PLAY_ICON } from "../util.js";
import { F, wordBlock, example, notes, playBtn, genericFront, genericBack, hasAudio } from "../render.js";
import { fmtMinutes } from "../stats.js";

let root, focus = null, cur = null, revealed = false, lastId = null, shownAt = 0;
let session = { done: 0, again: 0, ms: 0, start: 0 };

export function render(el, opts = {}) {
  root = el;
  focus = opts.focus || null;
  cur = null; revealed = false; lastId = null;
  session = { done: 0, again: 0, ms: 0, start: Date.now() };
  document.body.classList.add("studying");
  root.innerHTML = `<div class="study">
    <div class="studybar">
      <button class="icon-btn" data-act="close" title="Back (Esc)" aria-label="End session"><svg viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8"/></svg></button>
      ${focus ? `<span class="focus-tag">${esc(focus.label)}</span>` : ""}
      <div class="progress" aria-hidden="true"><i id="prog"></i></div>
      <div class="mini" id="mini"></div>
      <div class="seg" aria-label="Voice">
        <button data-voice-set="both" aria-pressed="${S.settings.voice === "both"}" title="Both voices (V)">♂♀</button>
        <button data-voice-set="m" aria-pressed="${S.settings.voice === "m"}" title="Male voice (V)">♂</button>
        <button data-voice-set="f" aria-pressed="${S.settings.voice === "f"}" title="Female voice (V)">♀</button>
      </div>
      <button class="icon-btn" id="starBtn" data-act="star" title="Star this word (S)" aria-label="Star this word">${STAR_ICON.replace("<svg", '<svg style="stroke:currentColor;stroke-width:1.3"')}</button>
    </div>
    <div class="stage" id="stage"></div>
    <div>
      <div class="answer-bar" id="answers"></div>
      <div class="keys"><kbd>Space</kbd> show / good · <kbd>1</kbd>–<kbd>4</kbd> answer · <kbd>R</kbd> replay · <kbd>T</kbd> slow · <kbd>V</kbd> voice · <kbd>S</kbd> star · <kbd>Z</kbd> undo · <kbd>Esc</kbd> end</div>
    </div>
  </div>`;
  root.onclick = onClick;
  next();
}

export function leave() {
  document.body.classList.remove("studying");
  stopAudio();
}

function updateBar(Q) {
  const n = Q.fresh.length, l = Q.learn.length, r = Q.review.length;
  const which = cur ? (!S.cards.get(cur.id) ? "n" : S.cards.get(cur.id).state === "review" ? "r" : "l") : "";
  $("#mini", root).innerHTML = [["n", n, "new", "New"], ["l", l, "learn", "Learning"], ["r", r, "review", "Review"]].map(([k, v, cls, label]) =>
    `<span class="${which === k ? "cur" : ""}" title="${label}"><i class="key ${cls}"></i>${v}<span class="sr"> ${label}</span></span>`).join("");
  const total = session.done + n + l + r;
  $("#prog", root).style.width = total ? (100 * session.done / total) + "%" : "100%";
}

function next() {
  const { item, Q } = D.pickNext(focus, lastId);
  cur = item; revealed = false;
  updateBar(Q);
  if (!item) return renderDone(Q);
  renderCard();
}

function tags(note, type) {
  const t = TYPES[type];
  const tier = F(note, "Tier") || note.level;
  const reg = F(note, "Register");
  return `<div class="card-top"><span class="tag type">${t.label}${t.short ? " · " + t.short : ""}</span>
    ${tier ? `<span class="tag">${esc(tier)}</span>` : ""}${reg ? `<span class="tag">${esc(reg)}</span>` : ""}
    <span class="spacer"></span>${note.theme ? `<span class="tag theme-tag">${esc(note.theme.name)}</span>` : ""}</div>`;
}

function face(note, type) {
  const f = n => F(note, n);
  const plays = (...b) => `<div class="plays">${b.join("")}</div>`;
  const slowWord = playBtn(note, "word", "", { rate: 0.7, cls: "icon" });
  // The big button follows the voice setting (both, by default: the man and then the woman); the two
  // small ones are there for when he wants to hear one speaker again on its own.
  const eachVoice = kind => playBtn(note, kind, "♂", { voice: "m", cls: "icon" }) + playBtn(note, kind, "♀", { voice: "f", cls: "icon" });
  if (type === "basic") return revealed ? genericBack(note) : genericFront(note);
  if (type === "rec") return revealed
    ? wordBlock(note) + plays(playBtn(note, "word", "Word"), eachVoice("word"), slowWord)
    : `<div class="ar word">${esc(f("Arabic"))}</div>${plays(playBtn(note, "word", "Listen"), slowWord)}<div class="prompt">What does it mean?</div>`;
  if (type === "listen") return revealed
    ? wordBlock(note) + plays(playBtn(note, "word", "Word"), eachVoice("word"), slowWord)
    : `<button class="listen-big" data-play="word" data-guid="${esc(note.guid)}" aria-label="Play the word">${PLAY_ICON}</button>
       ${plays(playBtn(note, "word", "Slower", { rate: 0.7 }))}<div class="prompt">Listen. What does it mean?</div>`;
  if (type === "prod") return revealed
    ? `<div class="en-small">${esc(f("English"))}</div>${wordBlock(note, { withMeaning: false })}${plays(playBtn(note, "word", "Word"), eachVoice("word"), slowWord)}`
    : `<div class="en-big">${esc(f("English"))}</div>${f("PartOfSpeech") ? `<div class="pos">${esc(f("PartOfSpeech"))}</div>` : ""}
       <div class="prompt">Say it in Saudi Arabic, then check.</div>`;
  // cloze
  const c = clozeHtml(f("ExampleArabic"), f("Arabic"), revealed);
  if (revealed) return `<div class="ar sentence">${c.html}</div><div class="ex-tr">${esc(f("ExampleTranslit"))}</div>
    <div class="ex-en">${esc(f("ExampleEnglish"))}</div>
    ${plays(playBtn(note, "sent", "Sentence"), eachVoice("sent"), playBtn(note, "sent", "", { rate: 0.7, cls: "icon" }))}
    <div style="height:18px"></div>${wordBlock(note, { size: "md" })}${plays(playBtn(note, "word", "Word"), eachVoice("word"))}`;
  return `<div class="ar sentence">${c.html}</div><div class="ex-en">${esc(f("ExampleEnglish"))}</div>
    <div class="hint">${c.found ? "The missing word" : "Which word here"} means “${esc(f("English"))}”</div>
    ${plays(playBtn(note, "sent", "Listen"), playBtn(note, "sent", "", { rate: 0.7, cls: "icon" }))}`;
}

function renderCard() {
  const { note, type } = cur;
  const extra = revealed && type !== "basic" ? example(note, { audio: type !== "cloze" }) : "";
  const moreNotes = revealed && type !== "basic" ? notes(note) : "";
  const stage = $("#stage", root);
  stage.innerHTML = `<article class="card" aria-live="polite">${tags(note, type)}<div class="face">${face(note, type)}</div>
    ${extra || moreNotes ? `<div class="details">${type === "cloze" ? "" : extra}${moreNotes}</div>` : ""}</article>`;
  stage.scrollTop = 0;
  hydrateMedia(stage);
  const star = $("#starBtn", root);
  star.classList.toggle("on", !!D.userOf(note.guid).star);
  const now = Date.now(), prev = S.cards.get(cur.id);
  $("#answers", root).className = "answer-bar" + (revealed ? "" : " reveal");
  $("#answers", root).innerHTML = revealed
    ? ["Again", "Hard", "Good", "Easy"].map((n, i) =>
        `<button class="grade g${i + 1}" data-grade="${i + 1}" aria-keyshortcuts="${i + 1}">${n}<small>${previewLabel(prev, i + 1, now, S.settings.retention)}</small></button>`).join("")
    : `<button class="btn primary big" data-act="reveal">Show answer <kbd>Space</kbd></button>`;
  if (!revealed) shownAt = performance.now();
  if (S.settings.autoplay) autoPlay();
}

function voicePlay(kind, rate) {
  if (!cur || cur.type === "basic") return;
  const names = audioNames(cur.note, kind, S.settings.voice);
  if (names.length > 1) return playAll(names, { rate: rate || S.settings.speed });
  play(names[0], { rate: rate || S.settings.speed });
}

/**
 * What you hear without touching anything — the way he listens to a card in Anki.
 * Before the answer: the word in both voices (or the sentence, on a cloze).
 * After it: the word in both voices again, and then the example sentence in both.
 */
function autoPlay() {
  const t = cur.type;
  if (t === "basic") return;
  const list = kinds => kinds.flatMap(k => audioNames(cur.note, k, S.settings.voice));
  if (!revealed) {
    if (t === "cloze") return playAll(list(["sent"]), { rate: S.settings.speed });
    if (t === "rec" || t === "listen") return playAll(list(["word"]), { rate: S.settings.speed });
    return;
  }
  playAll(list(["word", "sent"]), { rate: S.settings.speed, gap: 320 });
}
function replay(rate) {
  if (!cur) return;
  const kind = cur.type === "cloze" && !revealed ? "sent" : "word";
  if (!hasAudio(cur.note, kind)) return;
  voicePlay(kind, rate);
}

function reveal() {
  if (!cur || revealed) return;
  revealed = true;
  renderCard();
}

async function grade(g) {
  if (!cur || !revealed) return;
  const ms = performance.now() - shownAt;
  const item = cur;
  cur = null;   // ignore key repeats while saving
  await D.grade(item, g, ms);
  session.done++; session.ms += Math.min(ms, 90e3);
  if (g === 1) session.again++;
  lastId = item.id;
  next();
}

async function undo() {
  const item = await D.undo();
  if (!item) return toast("Nothing to undo");
  session.done = Math.max(0, session.done - 1);
  cur = item; revealed = false;
  updateBar(D.queues(Date.now(), focus));
  renderCard();
  toast("Undid last answer");
}

async function toggleStar() {
  if (!cur) return;
  const on = !D.userOf(cur.note.guid).star;
  await D.setUser(cur.note.guid, { star: on });
  $("#starBtn", root).classList.toggle("on", on);
  toast(on ? "Starred" : "Unstarred");
}

function renderDone(Q) {
  $("#answers", root).innerHTML = "";
  $("#answers", root).className = "answer-bar reveal";
  const later = Q.learn.length;
  const soon = later ? Math.min(...Q.learn.map(x => S.cards.get(x.id).due)) - Date.now() : 0;
  const acc = session.done ? Math.round(100 * (1 - session.again / session.done)) : 0;
  $("#stage", root).innerHTML = `<div class="done">
    <div class="ar">${later ? "استراحة" : "أحسنت!"}</div>
    <h2>${later ? "Take a short break" : focus ? "Theme done for now" : "All done for today"}</h2>
    <p>${later ? `${plural(later, "card")} still in learning come${later === 1 ? "s" : ""} back in about ${fmtDuration(Math.max(soon, MIN))}.`
      : session.done ? "Come back tomorrow. Short daily sessions are what make it stick." : "Nothing is due right now."}</p>
    ${session.done ? `<div class="done-stats"><div><b>${session.done}</b><span>cards</span></div><div><b>${acc}%</b><span>remembered</span></div><div><b>${fmtMinutes(session.ms)}</b><span>time</span></div></div>` : ""}
    <div class="row">${later ? `<button class="btn primary" data-act="ahead">Study them now</button>` : ""}
      <button class="btn ghost" data-act="close">Back to Today</button></div></div>`;
}

function studyAhead() {
  const Q = D.queues(Date.now(), focus);
  if (!Q.learn.length) return;
  cur = Q.learn[0]; revealed = false;
  updateBar(Q);
  renderCard();
}

function setVoice(v) {
  S.settings.voice = v;
  D.saveSettings();
  root.querySelectorAll("[data-voice-set]").forEach(b => b.setAttribute("aria-pressed", b.dataset.voiceSet === v));
  replay();
}

function onClick(e) {
  const t = e.target.closest("[data-act],[data-grade],[data-voice-set]");
  if (!t) {
    if (!revealed && cur && e.target.closest(".card") && !e.target.closest("button")) reveal();
    return;
  }
  if (t.dataset.grade) return grade(+t.dataset.grade);
  if (t.dataset.voiceSet) return setVoice(t.dataset.voiceSet);
  const act = t.dataset.act;
  if (act === "reveal") reveal();
  else if (act === "close") window.app.go("today");
  else if (act === "ahead") studyAhead();
  else if (act === "star") toggleStar();
}

export function onKey(e) {
  const k = e.key.toLowerCase();
  if ((e.metaKey || e.ctrlKey) && k === "z") { e.preventDefault(); return undo(); }
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (k === " " || k === "enter") { e.preventDefault(); if (e.repeat) return; revealed ? grade(3) : reveal(); }
  else if (["1", "2", "3", "4"].includes(k)) { if (!e.repeat) grade(+k); }
  else if (k === "r") replay();
  else if (k === "t") replay(0.7);
  else if (k === "v") setVoice({ both: "m", m: "f", f: "both" }[S.settings.voice] ?? "both");
  else if (k === "s") toggleStar();
  else if (k === "z") undo();
  else if (k === "escape") window.app.go("today");
}
