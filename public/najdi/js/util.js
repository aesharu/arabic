import * as store from "./store.js";
import * as cloud from "./cloud.js";

export const $ = (s, root = document) => root.querySelector(s);
export const $$ = (s, root = document) => [...root.querySelectorAll(s)];
export const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const plural = (n, one, many = one + "s") => `${n.toLocaleString()} ${n === 1 ? one : many}`;
export const PLAY_ICON = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5v9l7.5-4.5z"/></svg>';
export const SLOW_ICON = '<svg viewBox="0 0 16 12" aria-hidden="true"><path d="M1 1.5v9l6-4.5zM8.5 1.5v9l6-4.5z" opacity=".55"/></svg>';
// ♂ and ♀ as text land wherever the phone's fallback font puts them — too small, off the line, and
// different in Safari and on the Mac. Drawn here, they sit exactly where they are put.
export const MALE_ICON = '<svg viewBox="0 0 16 16" class="vx" aria-hidden="true"><circle cx="6.5" cy="9.5" r="4"/><path d="M10 6l4-4M10.5 2H14v3.5"/></svg>';
export const FEMALE_ICON = '<svg viewBox="0 0 16 16" class="vx" aria-hidden="true"><circle cx="8" cy="6" r="4"/><path d="M8 10v5M5.5 12.5h5"/></svg>';
export const BOTH_ICON = MALE_ICON.replace('class="vx"', 'class="vx vx-m"') + FEMALE_ICON.replace('class="vx"', 'class="vx vx-f"');
export const STAR_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.3l2 4.3 4.6.5-3.4 3.2.9 4.6L8 11.6l-4.1 2.3.9-4.6L1.4 6.1 6 5.6z"/></svg>';

// ---------- Field text ----------
const parser = new DOMParser();
const plainCache = new Map();
/** Field value as plain text (deck fields may contain HTML entities or tags). */
export function plain(s) {
  if (!s) return "";
  s = s.replace(/\[sound:[^\]]+\]/g, "");
  if (!/[<&]/.test(s)) return s.trim();
  if (!plainCache.has(s)) {
    const doc = parser.parseFromString(s.replace(/<br\s*\/?>/gi, "\n").replace(/<\/(div|p|li)>/gi, "$&\n"), "text/html");
    plainCache.set(s, doc.body.textContent.replace(/\n{3,}/g, "\n\n").trim());
  }
  return plainCache.get(s);
}

/** Deck HTML made safe to show: no scripts or handlers; images and [sound:] resolved from local media. */
export function safeHtml(s) {
  const doc = parser.parseFromString(`<div>${s || ""}</div>`, "text/html");
  doc.querySelectorAll("script,style,iframe,object,embed,link,meta,form,input,button,textarea,select").forEach(e => e.remove());
  for (const el of doc.querySelectorAll("*")) {
    for (const a of [...el.attributes]) {
      if (/^on/i.test(a.name) || /^\s*javascript:/i.test(a.value) || a.name === "style" && /url\(/i.test(a.value)) el.removeAttribute(a.name);
    }
  }
  for (const img of doc.querySelectorAll("img")) {
    img.dataset.media = img.getAttribute("src") || "";
    img.removeAttribute("src");
  }
  return doc.body.firstChild.innerHTML.replace(/\[sound:([^\]]+)\]/g,
    (_, n) => `<button class="play" data-sound="${esc(n)}">${PLAY_ICON}Play</button>`);
}
export async function hydrateMedia(root) {
  for (const img of $$("img[data-media]", root)) img.src = (await mediaUrl(img.dataset.media)) || "";
}

/** Wrap runs of Arabic script so they get the Arabic font and direction. */
export const arabicSpans = s => esc(s).replace(/[\u0600-\u06FF][\u0600-\u06FF\s\u064B-\u0652،؟]*[\u0600-\u06FF؟]|[\u0600-\u06FF]/g,
  m => `<span class="ar">${m}</span>`);

// ---------- Audio ----------
// A recording is kept in this browser after the first time it is heard; anything not here yet is
// fetched from his own database and kept. Asking twice while the first fetch is still going gives
// the same promise, so a card never downloads the same file twice.
const urls = new Map();
export async function mediaUrl(name) {
  if (!name) return null;
  if (!urls.has(name)) urls.set(name, (async () => {
    let blob = await store.get("media", name).catch(() => null);
    if (!blob) blob = await cloud.media(name).catch(() => null);
    return blob ? URL.createObjectURL(blob) : null;
  })());
  const url = await urls.get(name);
  urls.set(name, url); // keep the url itself, not the promise, once it is known
  return url;
}
export function forgetMedia() {
  for (const u of urls.values()) if (typeof u === "string") URL.revokeObjectURL(u);
  urls.clear();
}

let current = null, run = 0;
export async function play(name, { rate = 1, button = null } = {}) {
  if (!name) return;
  const mine = ++run;
  const url = await mediaUrl(name);
  if (!url || mine !== run) return;
  stopAudio();
  const el = new Audio(url);
  el.playbackRate = rate;
  el.preservesPitch = true;
  current = el;
  const done = () => button?.classList.remove("playing");
  button?.classList.add("playing");
  el.onended = el.onpause = el.onerror = done;
  await el.play().catch(done);
  return new Promise(resolve => {
    const end = () => resolve();
    el.addEventListener("ended", end, { once: true });
    el.addEventListener("error", end, { once: true });
    el.addEventListener("pause", end, { once: true });
  });
}

/**
 * One recording after another — the man, then the woman, the way he listens to a card in Anki.
 * A new sequence (or stopAudio) cancels whatever is still to come.
 */
export async function playAll(names, { rate = 1, gap = 180, button = null } = {}) {
  const list = names.filter(Boolean);
  if (!list.length) return;
  const mine = ++run;
  button?.classList.add("playing");
  for (const [i, name] of list.entries()) {
    if (mine !== run) break;
    const url = await mediaUrl(name);
    if (!url || mine !== run) break;
    stopAudio(false);
    const el = new Audio(url);
    el.playbackRate = rate;
    el.preservesPitch = true;
    current = el;
    await new Promise(resolve => {
      el.addEventListener("ended", resolve, { once: true });
      el.addEventListener("error", resolve, { once: true });
      el.addEventListener("pause", resolve, { once: true });
      el.play().catch(resolve);
    });
    if (i < list.length - 1 && mine === run) await new Promise(r => setTimeout(r, gap));
  }
  if (mine === run) button?.classList.remove("playing");
}

export function stopAudio(cancelSequence = true) {
  if (cancelSequence) run++;
  if (current) { current.pause(); current = null; }
}

/** Audio file for a vocab note: kind "word" | "sent", voice "m" | "f" (falls back to the other voice). */
export function audioName(note, kind, voice) {
  const key = kind === "word" ? "Word" : "Sentence";
  const m = note.audio[`Audio${key}Male`]?.[0], f = note.audio[`Audio${key}Female`]?.[0];
  return voice === "f" ? f || m : m || f;
}

/**
 * The recordings for one kind, in the order they should be heard.
 * With the voice set to "both" that is the man and then the woman — both of them, every time.
 */
export function audioNames(note, kind, voice) {
  const key = kind === "word" ? "Word" : "Sentence";
  const m = note.audio[`Audio${key}Male`]?.[0], f = note.audio[`Audio${key}Female`]?.[0];
  if (voice === "both") return [m, f].filter(Boolean);
  return [audioName(note, kind, voice)].filter(Boolean);
}

// ---------- Cloze ----------
const DIACRITICS = /[\u064B-\u065F\u0670\u0640]/g;
const DIAC = "[\\u064B-\\u065F\\u0670\\u0640]*";
const BREAK = /[\s؟،.!?,:;"«»()]/;
function looseRe(word) {
  const letters = [...word.replace(DIACRITICS, "")].map(ch => ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp(letters.join(DIAC) + DIAC);
}
/** Where the target word sits in its example sentence, tolerant of diacritics, ال and conjugation. */
export function findCloze(sentence, word) {
  if (!sentence || !word) return null;
  const tries = [word, ...word.split(/\s+/).sort((a, b) => b.length - a.length)];
  for (const w of [...tries, ...tries.map(t => t.replace(/^ال/, ""))]) {
    if ([...w.replace(DIACRITICS, "")].length < 2) continue;
    const m = sentence.match(looseRe(w));
    if (m) return { start: m.index, end: m.index + m[0].length };
  }
  // Conjugated / possessive forms (راح → رحت, زوجة → زوجتي): compare consonant skeletons per word
  const skel = s => s.replace(DIACRITICS, "").replace(/^ال/, "").replace(/[اأإآءؤئوىيةت]/g, "");
  const target = skel(word.split(/\s+/).sort((a, b) => b.length - a.length)[0]);
  if (target.length < 2) return null;
  const words = [...sentence.matchAll(/[^\s؟،.!?,:;"«»()]+/g)];
  const hit = words.find(w => skel(w[0]).startsWith(target)) || words.find(w => skel(w[0]).includes(target));
  return hit ? { start: hit.index, end: hit.index + hit[0].length } : null;
}
export function clozeHtml(sentence, word, reveal) {
  const m = findCloze(sentence, word);
  if (!m) return { html: esc(sentence), found: false };
  let { start, end } = m;
  if (reveal) {  // highlight the whole word so Arabic letters stay joined across the <mark>
    while (start > 0 && !BREAK.test(sentence[start - 1])) start--;
    while (end < sentence.length && !BREAK.test(sentence[end])) end++;
  }
  const mid = reveal ? `<mark>${esc(sentence.slice(start, end))}</mark>` : `<span class="blank" aria-label="missing word"></span>`;
  return { html: esc(sentence.slice(0, start)) + mid + esc(sentence.slice(end)), found: true };
}

// ---------- Native bridge (Mac app) / browser fallbacks ----------
const native = () => window.webkit?.messageHandlers?.native;
export const isMacApp = () => !!native();
export function tellNative(msg) { try { native()?.postMessage(msg); } catch {} }

export function saveTextFile(name, text) {
  if (native()) { tellNative({ type: "save", name, text }); return; }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

// ---------- Dialogs ----------
export function confirmDialog({ title, body = "", ok = "OK", cancel = "Cancel", danger = false }) {
  return new Promise(resolve => {
    const wrap = document.createElement("div");
    wrap.className = "modal";
    wrap.innerHTML = `<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="mTitle">
      <h3 id="mTitle">${esc(title)}</h3>${body ? `<p>${esc(body)}</p>` : ""}
      <div class="sheet-actions">${cancel ? `<button class="ghost" data-r="0">${esc(cancel)}</button>` : ""}
      <button class="${danger ? "primary danger" : "primary"}" data-r="1">${esc(ok)}</button></div></div>`;
    const close = r => { wrap.remove(); document.removeEventListener("keydown", onKey, true); resolve(r); };
    const onKey = e => {
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(false); }
      else if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); close(true); }
      else e.stopPropagation();
    };
    wrap.addEventListener("click", e => {
      const b = e.target.closest("[data-r]");
      if (b) close(b.dataset.r === "1");
      else if (e.target === wrap) close(false);
    });
    document.addEventListener("keydown", onKey, true);
    document.body.append(wrap);
    $("[data-r='1']", wrap).focus();
  });
}

let toastTimer = null;
export function toast(msg) {
  let el = $("#toast");
  if (!el) { el = document.createElement("div"); el.id = "toast"; el.setAttribute("role", "status"); document.body.append(el); }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}
