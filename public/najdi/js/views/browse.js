import * as D from "../deck.js";
import { S, TYPES } from "../deck.js";
import { $, esc, plain, plural, toast, hydrateMedia, play, audioName } from "../util.js";
import { F, wordBlock, example, notes, playBtn, genericBack } from "../render.js";
import { fmtDuration, fmtDays, dayStart, DAY } from "../fsrs.js";

const STATUS = [["all", "All"], ["new", "New"], ["learning", "Learning"], ["known", "Known"], ["starred", "Starred"], ["suspended", "Hidden"]];
let root, q = "", status = "all", level = "", selected = null, limit = 150, index = null;

const fold = s => String(s || "").normalize("NFD").replace(/[\u0300-\u036F\u064B-\u065F\u0670\u0640ʿʾ'’\-]/g, "").toLowerCase();
function buildIndex() {
  index = new Map(S.notes.map(n => [n.guid, fold(n.kind === "vocab"
    ? [F(n, "Arabic"), F(n, "Transliteration"), F(n, "English"), F(n, "ExampleEnglish"), F(n, "Plural"), n.theme?.name].join(" ")
    : n.fieldNames.map(f => plain(n.fields[f])).join(" "))]));
}

function matches(n) {
  if (q && !index.get(n.guid)?.includes(q)) return false;
  if (level && n.level !== level) return false;
  const u = D.userOf(n.guid);
  if (status === "suspended") return !!u.suspended;
  if (status === "starred") return !!u.star;
  const s = D.noteStatus(n);
  if (status === "new") return s === "new";
  if (status === "learning") return s === "learning";
  if (status === "known") return s === "young" || s === "mature";
  return true;
}

export function render(el, opts = {}) {
  root = el;
  if (!index || index.size !== S.notes.length) buildIndex();
  if (opts.select) selected = opts.select;
  root.innerHTML = `<div class="page">
    <div class="page-head"><div><h1>Words</h1><p>${plural(S.notes.length, "word")} in ${esc(S.deck?.name || "your deck")}</p></div></div>
    <input type="search" id="q" placeholder="Search Arabic, transliteration or English…" value="${esc(q)}" autocomplete="off" aria-label="Search words">
    <div class="filters">
      <div class="seg" id="statusSeg">${STATUS.map(([k, l]) => `<button data-status="${k}" aria-pressed="${status === k}">${l}</button>`).join("")}</div>
      ${S.levels.length ? `<div class="chips" id="levelChips">${S.levels.map(l => `<button class="chip" data-level="${l}" aria-pressed="${level === l}">${l}</button>`).join("")}</div>` : ""}
    </div>
    <div class="browse"><div><div class="list" id="list" role="listbox" aria-label="Words"></div></div><aside class="detail" id="detail"></aside></div>
  </div>`;
  $("#q", root).addEventListener("input", e => { q = fold(e.target.value.trim()); limit = 150; renderList(); });
  $("#statusSeg", root).addEventListener("click", e => {
    const b = e.target.closest("[data-status]"); if (!b) return;
    status = b.dataset.status; limit = 150;
    root.querySelectorAll("[data-status]").forEach(x => x.setAttribute("aria-pressed", x === b));
    renderList();
  });
  $("#levelChips", root)?.addEventListener("click", e => {
    const b = e.target.closest("[data-level]"); if (!b) return;
    level = level === b.dataset.level ? "" : b.dataset.level; limit = 150;
    root.querySelectorAll("[data-level]").forEach(x => x.setAttribute("aria-pressed", x.dataset.level === level));
    renderList();
  });
  $("#list", root).addEventListener("click", e => {
    if (e.target.closest("#moreBtn")) { limit += 300; return renderList(); }
    const r = e.target.closest("[data-guid-row]"); if (!r) return;
    select(r.dataset.guidRow, true);
  });
  $("#detail", root).addEventListener("click", onDetailClick);
  renderList();
  renderDetail();
}

function renderList() {
  const rows = S.notes.filter(matches);
  const list = $("#list", root);
  if (!rows.length) { list.innerHTML = `<div class="empty">No words match.</div>`; return; }
  list.innerHTML = rows.slice(0, limit).map(n => {
    const u = D.userOf(n.guid);
    const vocab = n.kind === "vocab";
    return `<button class="row-item" role="option" data-guid-row="${esc(n.guid)}" aria-selected="${selected === n.guid}">
      <span class="dot ${D.noteStatus(n)}" title="${D.noteStatus(n)}"></span>
      <span style="min-width:0"><div class="en">${esc(vocab ? F(n, "English") : plain(n.fields[n.fieldNames[0]]))}${u.star ? `<span class="star">★</span>` : ""}</div>
        <div class="tr">${esc(vocab ? F(n, "Transliteration") : "")}${n.level ? ` · ${n.level}` : ""}${u.suspended ? " · hidden" : ""}</div></span>
      ${vocab ? `<span class="ar">${esc(F(n, "Arabic"))}</span>` : ""}
    </button>`;
  }).join("") + (rows.length > limit ? `<div class="list-foot"><button class="btn ghost small" id="moreBtn">Show more (${(rows.length - limit).toLocaleString()} left)</button></div>` : "");
  if (!selected || !rows.some(n => n.guid === selected)) { selected = rows[0].guid; renderDetail(); }
}

function select(guid, audio) {
  selected = guid;
  root.querySelectorAll("[data-guid-row]").forEach(r => r.setAttribute("aria-selected", r.dataset.guidRow === guid));
  renderDetail();
  const n = S.byGuid.get(guid);
  if (audio && n?.kind === "vocab") play(audioName(n, "word", S.settings.voice));
  if (matchMedia("(max-width: 900px)").matches) $("#detail", root).scrollIntoView({ behavior: "smooth", block: "start" });
}

function dueText(c) {
  if (!c) return "Not started";
  const now = Date.now();
  if (c.state !== "review") return `Learning · ${c.due <= now ? "due now" : "in " + fmtDuration(c.due - now)}`;
  const days = Math.round((c.due - dayStart(now)) / DAY);
  return `${days <= 0 ? "Due today" : "Next in " + fmtDays(days)} · ${c.ivl >= 21 ? "mature" : "young"}`;
}

function renderDetail() {
  const box = $("#detail", root);
  const n = S.byGuid.get(selected);
  if (!n) { box.innerHTML = ""; return; }
  const u = D.userOf(n.guid);
  const types = D.availableTypes(n), on = D.enabledTypes(n);
  const vocab = n.kind === "vocab";
  box.innerHTML = `<div class="panel">
    ${vocab ? `${wordBlock(n)}
      <div class="plays">${playBtn(n, "word", "♂ Word", { voice: "m" })}${playBtn(n, "word", "♀ Word", { voice: "f" })}
        ${playBtn(n, "sent", "♂ Sentence", { voice: "m" })}${playBtn(n, "sent", "♀ Sentence", { voice: "f" })}${playBtn(n, "word", "", { rate: 0.7, cls: "icon" })}</div>
      <div class="details">${example(n, { audio: false })}${notes(n, { mine: false })}` : `<div class="details" style="border:0;margin:0;padding:0">${genericBack(n)}`}
      <div class="note mine"><b>My note</b><textarea id="myNote" placeholder="A mnemonic, where you heard it, how she says it…" aria-label="My note">${esc(u.note || "")}</textarea></div>
    </div>
    <div class="card-states">${types.map(t => {
      const c = S.cards.get(D.cardId(n, t));
      return `<div class="card-state"><b>${TYPES[t].label}${on.includes(t) ? "" : " (off)"}</b><span>${dueText(c)}${c?.lapses ? ` · forgot ${c.lapses}×` : ""}</span></div>`;
    }).join("")}</div>
    <div class="detail-actions">
      <button class="btn ghost small" data-act="star">${u.star ? "★ Starred" : "☆ Star"}</button>
      <button class="btn ghost small" data-act="suspend">${u.suspended ? "Show in study again" : "Hide from study"}</button>
      ${n.theme ? `<button class="btn ghost small" data-act="theme">Study “${esc(n.theme.name)}”</button>` : ""}
    </div>
  </div>`;
  hydrateMedia(box);
  $("#myNote", box).addEventListener("change", async e => {
    await D.setUser(n.guid, { note: e.target.value.trim() });
    toast("Note saved");
  });
}

async function onDetailClick(e) {
  const b = e.target.closest("[data-act]"); if (!b) return;
  const n = S.byGuid.get(selected); if (!n) return;
  const u = D.userOf(n.guid);
  if (b.dataset.act === "star") await D.setUser(n.guid, { star: !u.star });
  else if (b.dataset.act === "suspend") { await D.setUser(n.guid, { suspended: !u.suspended }); toast(u.suspended ? "Back in your study queue" : "Hidden from study"); }
  else if (b.dataset.act === "theme") return window.app.go("study", { focus: { theme: n.theme.id, label: n.theme.name } });
  renderList();
  renderDetail();
}

export function onKey(e) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f") { e.preventDefault(); $("#q", root)?.focus(); return; }
  if (e.target.matches("input, textarea")) return;
  if (e.key === "/") { e.preventDefault(); $("#q", root)?.focus(); }
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    const rows = [...root.querySelectorAll("[data-guid-row]")];
    const i = rows.findIndex(r => r.dataset.guidRow === selected);
    const nextRow = rows[Math.max(0, Math.min(rows.length - 1, i + (e.key === "ArrowDown" ? 1 : -1)))];
    if (nextRow) { e.preventDefault(); select(nextRow.dataset.guidRow, true); nextRow.scrollIntoView({ block: "nearest" }); }
  }
}
