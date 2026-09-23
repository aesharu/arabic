// Tap a word in any Arabic line (stories, chats): the line as tappable words, and the panel that says what a word
// means, how it's built and how it's said. The dictionary comes from core/dictionary.js.
import { t, tx } from "../core/i18n.js";
import { esc, ar, lat, translit, flag, meanings, playIcon } from "../core/dom.js";
import { icon } from "../core/art.js";
import { tokens, sayWords, norm } from "../core/gloss.js";

const mean = x => lat(tx({ en: x.en, najdi: x.en })); // English/Ukrainian, left to right even in Arabic

// The words of line i; words that make a phrase in the lists ("صباح الخير") are one piece. tag: "button", or "span"
// inside something that is already a button (a chat bubble).
export function tappable(l, i, d, { cls = "st-s", tag = "button", text = l.ar } = {}) {
  const parts = tokens(text);
  const words = parts.filter(p => p.w).map(p => p.w);
  let html = "";
  let wi = 0;
  for (let k = 0; k < parts.length; k++) {
    const p = parts[k];
    if (p.sep !== undefined) {
      html += esc(p.sep);
      continue;
    }
    let n = d.phraseAt(words, wi)?.n ?? 1;
    // Only words next to each other with nothing but spaces between them make a phrase.
    for (let j = 1; j < n; j++) if (!/^\s+$/.test(parts[k + 2 * j - 1]?.sep ?? "")) n = j;
    const piece = parts.slice(k, k + 2 * n - 1).map(x => x.w ?? x.sep).join("");
    const attrs = `class="st-w" data-s="${i}" data-w="${wi}" data-n="${n}"`;
    html += tag === "button" ? `<button type="button" ${attrs}>${esc(piece)}</button>` : `<span ${attrs}>${esc(piece)}</span>`;
    k += 2 * n - 2;
    wi += n;
  }
  return `<span class="${cls} ar" lang="ar" translate="no"${l.id ? ` data-edit-id="${l.id}"` : ""}>${html}</span>`;
}

// What was tapped: the word(s), their pronunciation (when the line's pronunciation lines up word for word) and
// what the dictionary makes of them.
export function selection(l, el, d) {
  const wi = +el.dataset.w;
  const n = +el.dataset.n;
  const words = tokens(l.ar).filter(p => p.w).map(p => p.w);
  const said = sayWords(l.say);
  const surface = words.slice(wi, wi + n).join(" ");
  const phrase = n > 1 ? d.phraseAt(words, wi) : null;
  return { l, surface, el, pron: said.length === words.length ? said.slice(wi, wi + n).join(" ") : "", r: phrase ? { e: phrase.e, parts: [] } : d.lookup(surface) };
}

// Meaning (or, for a verb form, who and when + the word it comes from), its pieces, how it's said, and its line.
export function panel(sel) {
  const { l, surface, pron, r } = sel;
  const e = r?.e;
  const pieces = r?.parts?.length
    ? `<p class="st-parts"><span class="st-lab">${t("st.parts")}</span> ${r.parts
        .map(p => `<span class="st-part">${ar(p.ar)}<small>${p.e ? mean(p.e) : esc(t(`gl.${p.key}`))}</small></span>`)
        .join(`<span class="st-plus" aria-hidden="true">+</span>`)}</p>`
    : "";
  const form = r?.tense ? `<span class="st-form">${r.who ? `${esc(t(`gl.p.${r.who}`))} · ` : ""}${esc(t(`gl.t.${r.tense}`))}</span>` : "";
  let what = `<p class="muted">${esc(t("st.noWord"))}</p>`;
  if (e && r.via === "verb")
    what = `<div class="st-meaning">${form}${r.parts.length ? "" : `<span class="st-base"><span class="st-lab">${t("st.base")}</span> ${ar(e.ar)} ${translit(e.say)} — ${mean(e)}</span>`} ${flag(e)}</div>`;
  else if (e) what = `<div class="st-meaning">${meanings(e)} ${form} ${flag(e)}</div>`;
  return `<div class="st-panel-head">
      <button type="button" class="st-big" data-say="${esc(surface)}">${ar(surface)}${playIcon}</button>
      ${pron ? `<span class="st-pron">${translit(pron)}</span>` : ""}
      <button type="button" class="st-x" data-close aria-label="${esc(t("st.close"))}">${icon("close")}</button>
    </div>
    ${what}${pieces}
    <div class="st-panel-sent">
      <button type="button" class="btn" data-say="${esc(l.speak ?? l.ar)}">${icon("sound")} ${t("st.hearSentence")}</button>
      <p>${translit(l.say)}<span>${mean(l)}</span></p>
    </div>`;
}

// Show (or hide, sel = null) the panel in box, mark the tapped word, and keep it in sight above the panel.
export function paint(root, box, sel) {
  root.querySelectorAll(".st-w.is-sel").forEach(b => b.classList.remove("is-sel"));
  if (!sel) return (box.hidden = true);
  box.innerHTML = panel(sel);
  box.hidden = false;
  box.scrollTop = 0;
  sel.el.classList.add("is-sel");
  const w = sel.el.getBoundingClientRect();
  const top = box.getBoundingClientRect().top;
  if (w.bottom > top - 8) window.scrollBy({ top: w.bottom - top + 28, behavior: "smooth" });
}
