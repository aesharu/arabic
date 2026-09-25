// The book (#/read) — data/book.js, one page at a time.
//
// It opens on its cover and turns like a book: the next page is to the left, the way an Arabic book turns.
// Arrow keys, a swipe, or the two buttons under the sheet. Turning a page marks the one you just left as
// read, so the progress fills itself in while he reads instead of asking him to tick anything.
//
// Every letter keeps its own colour from data/book.js, and every word on the page is a button that says it.
import * as store from "../core/store.js";
import { t, tx, num } from "../core/i18n.js";
import { icon } from "../core/art.js";
import { esc, ar, lat, translit, flag } from "../core/dom.js";
import { uaSay, hasSay, UA_KEY, UA_LENGTH } from "../core/ua.js";
import { clusters, shapes } from "../core/arabic.js";
import { pic, hasPic } from "../core/pics.js";
import { COVER, PARTS, PAGES, HUE, LETTER, END } from "../data/book.js";

let show = { say: true, en: true, colour: true }; // survives page turns until reload
let contentsOpen = false;

const mine = () => !store.isTeacher();
const saved = () => store.get().book ?? { page: 1, done: [] };
const doneSet = () => new Set(saved().done ?? []);

// ---- the colours -------------------------------------------------------------------------------
// Each letter of a word in its own colour, so a joined-up word comes apart in front of him. The marks ride
// along with the letter they belong to. `key` is the letter the page is about: it gets the underline.
const tint = (text, key = "") => {
  if (!show.colour) return esc(text);
  return clusters(text).map(({ ch, marks }) => {
    const h = HUE[ch];
    const piece = esc(ch + marks);
    if (!h) return piece;
    return `<span class="bk-c bk-c${h}${key && ch === key ? " is-key" : ""}">${piece}</span>`;
  }).join("");
};
const arTint = (text, key = "", cls = "") =>
  `<span class="ar${cls ? " " + cls : ""}" lang="ar" dir="rtl" translate="no">${tint(text, key)}</span>`;

// A word that says itself when you tap it.
const sayable = (arabic, inner, cls = "") =>
  `<button type="button" class="${cls}" data-say="${esc(arabic)}">${inner}</button>`;

const says = (say, en) => `
  ${show.say ? `<span class="bk-say">${translit(say)}</span>` : ""}
  ${show.en && en ? `<span class="bk-en" lang="en" dir="ltr">${esc(en)}</span>` : ""}`;

// A picture, a numeral, a colour swatch, or — when the word has none — its first letter as a medallion.
const badge = (name, word) => {
  if (name?.startsWith("#")) return `<span class="bk-numeral" lang="ar">${esc(name.slice(1))}</span>`;
  if (name?.startsWith("@")) return `<span class="bk-swatch bk-sw-${esc(name.slice(1))}"></span>`;
  if (name && hasPic(name)) return pic(name);
  const first = [...String(word)].find(c => HUE[c]);
  return `<span class="bk-medal bk-c${HUE[first] ?? 1}" lang="ar">${esc(first ?? "")}</span>`;
};

// ---- the pages ---------------------------------------------------------------------------------
const FORM_KEYS = ["book.alone", "book.start", "book.middle", "book.end"];

const letterPage = p => {
  const l = LETTER[p.char];
  const h = HUE[p.char];
  const labels = l.nonJoining ? [FORM_KEYS[0], FORM_KEYS[3]] : FORM_KEYS;
  return `
    <div class="bk-letter">
      <div class="bk-letter-top">
        ${sayable(l.example?.ar ?? p.char, `<span class="bk-big bk-c${h}" lang="ar" dir="rtl">${esc(p.char)}</span>`, "bk-big-btn")}
        <div class="bk-letter-id">
          <h2 class="bk-letter-name" lang="ar" dir="rtl">${esc(l.nameAr)}</h2>
          <p class="bk-letter-lat">${lat(l.name, "", "ar-Latn")} <span class="bk-letter-sound">${esc(l.translit)}</span>${mine() && hasSay(l.translit) ? `<bdi class="bk-ua" lang="uk" dir="ltr" translate="no">${esc(uaSay(l.translit))}</bdi>` : ""}</p>
          <p class="bk-letter-how">${esc(tx(l.sound))}</p>
          ${l.nonJoining ? `<p class="bk-letter-note">${esc(t("book.noJoin"))}</p>` : ""}
        </div>
      </div>
      <ul class="bk-forms" dir="rtl">
        ${shapes(p.char, l.nonJoining).map((s, i) => `
          <li><span class="bk-form bk-c${h}" lang="ar" dir="rtl">${esc(s)}</span>
            <span class="bk-form-lab" dir="ltr">${esc(t(labels[i]))}</span></li>`).join("")}
      </ul>
      <ul class="bk-words">
        ${p.words.map(([w, say, en, name]) => `
          <li>${sayable(w, `
            <span class="bk-word-pic">${badge(name, w)}</span>
            ${arTint(w, p.char, "bk-word-ar")}
            ${says(say, en)}`, "bk-word")}</li>`).join("")}
      </ul>
    </div>`;
};

// The pronunciation key, set like the one at the front of a dictionary. The Ukrainian column is his own —
// Dima is the native speaker and reads the Arabic column instead.
const keyPage = p => `
  <div class="bk-key">
    <p class="bk-note">${esc(tx(p.note))}</p>
    <table class="bk-key-tbl">
      <thead><tr><th>${esc(t("book.colLetter"))}</th><th>${esc(t("book.colArabic"))}</th>
        <th>${esc(t("book.colHow"))}</th>${mine() ? `<th lang="uk">${esc(t("book.colUk"))}</th>` : ""}</tr></thead>
      <tbody>
        ${UA_KEY.map(row => `<tr>
          <td class="bk-key-ua" lang="uk" dir="ltr">${esc(row.ua)}</td>
          <td class="bk-key-ar">${ar(row.ar)}<span class="bk-key-ex" lang="uk" dir="ltr">${esc(row.ex)}</span></td>
          <td lang="en" dir="ltr">${esc(row.en)}</td>
          ${mine() ? `<td lang="uk" dir="ltr">${esc(row.uk)}</td>` : ""}
        </tr>`).join("")}
      </tbody>
    </table>
    <p class="bk-key-long"><b lang="en" dir="ltr">${esc(UA_LENGTH.en)}</b>${mine() ? `<span lang="uk" dir="ltr">${esc(UA_LENGTH.uk)}</span>` : ""}</p>
  </div>`;

const markPage = p => `
  <div class="bk-mark">
    <p class="bk-note">${esc(tx(p.note))}</p>
    <ul class="bk-tiles" dir="rtl">
      ${p.show.map(([a, s]) => `<li>${sayable(a, `${arTint(a, "", "bk-tile-ar")}<span class="bk-tile-say">${lat(s, "", "ar-Latn")}</span>`, "bk-tile")}</li>`).join("")}
    </ul>
    <ul class="bk-words bk-words-wide">
      ${p.words.map(([w, say, en]) => `
        <li>${sayable(w, `${arTint(w, "", "bk-word-ar")}${says(say, en)}`, "bk-word")}</li>`).join("")}
    </ul>
  </div>`;

const wordsPage = p => `
  <div class="bk-wordpage">
    <p class="bk-note">${esc(tx(p.note))}</p>
    <ul class="bk-words">
      ${p.items.map(([w, say, en, name]) => `
        <li>${sayable(w, `
          <span class="bk-word-pic">${badge(name, w)}</span>
          ${arTint(w, "", "bk-word-ar")}
          ${says(say, en)}`, "bk-word")}</li>`).join("")}
    </ul>
  </div>`;

// Not every line was written with a full stop, and run together in one block they need one.
const stop = s => (/[.!?…؟]$/.test(s.trim()) ? s.trim() : s.trim() + ".");
const run = (p, f) => p.lines.map(l => stop(f(l))).join(" ");

const textPage = p => `
  <div class="bk-text">
    <p class="bk-body" lang="ar" dir="rtl" translate="no">
      ${p.lines.map((l, i) => `${i ? '<span class="bk-orn" aria-hidden="true">٭</span>' : ""}${
        sayable(l.ar, tint(l.ar), "bk-s")}`).join(" ")}
    </p>
    ${show.say ? `<p class="bk-run-say">${lat(run(p, l => l.say), "", "ar-Latn")}</p>
      ${mine() && p.lines.some(l => hasSay(l.say))
        ? `<p class="bk-run-ua" lang="uk" dir="ltr" translate="no">${esc(run(p, l => uaSay(l.say)))}</p>` : ""}` : ""}
    ${show.en ? `<p class="bk-run-en" lang="en" dir="ltr">${esc(run(p, l => l.en))}</p>` : ""}
  </div>`;

const talkPage = p => `
  <ul class="bk-chat">
    ${p.lines.map((l, i) => {
      const who = p.who?.[i] === "her" ? "her" : "me";
      const { ar: line, say, en } = l;
      return `<li class="bk-msg is-${who}">
        ${sayable(line, `${arTint(line, "", "bk-msg-ar")}${says(say, en)}`, "bk-bubble")}
      </li>`;
    }).join("")}
  </ul>`;

const openerPage = p => {
  const part = PARTS[p.partIndex];
  return `
    <div class="bk-opener">
      <p class="bk-part-n">${esc(t("book.part", { n: num(p.partIndex + 1) }))}</p>
      <h2 class="bk-part-ar" lang="ar" dir="rtl">${esc(part.title.najdi)}</h2>
      <p class="bk-part-en" dir="ltr">${esc(part.title.en)}</p>
      <div class="bk-part-pic">${pic(part.art)}</div>
      <p class="bk-part-sub">${esc(tx(part.sub))}</p>
      <p class="bk-part-blurb">${esc(tx(part.blurb))}</p>
    </div>`;
};

const endPage = () => `
  <div class="bk-end">
    <div class="bk-part-pic">${pic("palm")}</div>
    <h2 class="bk-part-ar" lang="ar" dir="rtl">${esc(END.title.najdi)}</h2>
    <p class="bk-part-en" dir="ltr">${esc(END.title.en)}</p>
    ${END.lines.map(l => `<p class="bk-part-blurb">${esc(tx(l))}</p>`).join("")}
  </div>`;

const BODY = { key: keyPage, letter: letterPage, mark: markPage, words: wordsPage, text: textPage, talk: talkPage, opener: openerPage, end: endPage };

const headingOf = p =>
  p.kind === "letter" ? "" : p.kind === "opener" || p.kind === "end" ? "" : `
    <h3 class="bk-head" lang="ar" dir="rtl">${esc(p.title.najdi)}</h3>
    <p class="bk-head-en" dir="ltr">${esc(p.title.en)}</p>`;

// One sheet of the book: the ruled frame, the page, its number at the foot.
const sheet = p => `
  <div class="bk-sheet${p.kind === "opener" || p.kind === "end" ? " is-opener" : ""}" data-page="${p.n}">
    <div class="bk-sheet-in">
      ${headingOf(p)}
      ${BODY[p.kind](p)}
      <p class="bk-folio" aria-hidden="true">${esc(num(p.n))}</p>
    </div>
    ${p.check ? `<p class="bk-flag">${flag(p)}</p>` : ""}
  </div>`;

// ---- the cover ---------------------------------------------------------------------------------
const cover = () => {
  const s = saved();
  const started = s.page > 1 || (s.done ?? []).length > 0;
  return `
    <div class="bk-cover">
      <div class="bk-cover-card">
        <div class="bk-cover-art">${coverArt()}</div>
        <div class="bk-cover-text">
        <h1 class="bk-cover-ar" lang="ar" dir="rtl">${esc(COVER.title.najdi)}</h1>
        <p class="bk-cover-en" dir="ltr">${esc(COVER.title.en)}</p>
          <p class="bk-cover-rule" aria-hidden="true">٭</p>
          <p class="bk-cover-sub">${esc(tx(COVER.sub))}</p>
        </div>
      </div>
      <p class="bk-cover-line">${esc(tx(COVER.line))}</p>
      <div class="bk-cover-do">
        <button type="button" class="btn btn-primary bk-open" data-go="${started ? s.page : 1}">
          ${icon("arrow")} ${esc(t(started ? "book.continue" : "book.open"))}</button>
        ${started ? `<button type="button" class="btn bk-restart" data-go="1">${esc(t("book.fromStart"))}</button>` : ""}
      </div>
      <p class="bk-cover-where">${esc(tx(COVER.where))}</p>
    </div>`;
};

// The whole cover drawing: the Batin valley at night — dunes, palms, a camel, the well the town is named
// after, and a sky of stars over a Najdi wall.
const coverArt = () => `
  <svg class="bk-art" viewBox="0 0 320 400" role="img" aria-label="${esc(tx(COVER.where))}">
    <rect class="bk-sky" x="0" y="0" width="320" height="400"/>
    <g class="bk-stars">
      ${[[42, 40], [86, 30], [130, 44], [186, 32], [232, 46], [274, 34], [58, 150], [104, 168], [150, 158],
          [196, 176], [244, 162], [288, 184], [36, 196], [126, 200], [212, 206], [298, 148]]
        .map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 === 0 ? 2.4 : 1.4}"/>`).join("")}
    </g>
    <path class="bk-moon" d="M62 168a22 22 0 1 0 10 34 18 18 0 0 1-10-34z"/>
    <path class="bk-dune-far" d="M0 252c50-34 92-8 140-26 44-16 96-8 180 22v152H0z"/>
    <path class="bk-dune" d="M0 292c60-30 104 2 158-16 46-16 110-6 162 20v104H0z"/>
    <path class="bk-dune-near" d="M0 338c54-22 110 10 168-6 44-12 106-2 152 16v52H0z"/>
    <g class="bk-palms">
      <path class="bk-trunk" d="M56 332v-54h7v54z"/>
      <path class="bk-frond" d="M59 278c-17-15-31-15-41-5 13-2 26 1 34 9zM60 278c17-15 31-15 41-5-13-2-26 1-34 9zM59 276c-6-18-3-30 7-36-3 13-1 25 2 33zM60 278c9-12 23-15 34-10-11 2-20 8-26 15z"/>
      <path class="bk-trunk" d="M252 344v-42h6v42z"/>
      <path class="bk-frond" d="M255 302c-14-12-25-12-33-3 10-2 20 1 27 6zM256 302c14-12 25-12 33-3-10-2-20 1-27 6zM255 301c-5-15-2-24 6-29-3 10-1 20 1 26z"/>
    </g>
    <g class="bk-well">
      <path class="bk-beam" d="M150 356v-26h34v26M144 330h46"/>
      <path class="bk-rope" d="M167 330v16"/><path class="bk-stone" d="M162 346h10v9h-10z"/>
      <path class="bk-stone" d="M146 356h42v22h-42z"/>
    </g>
    <g class="bk-camel">
      <ellipse class="bk-ink" cx="74" cy="352" rx="17" ry="8"/>
      <circle class="bk-ink" cx="74" cy="344" r="9"/>
      <path class="bk-ink" d="M87 350c4-4 5-11 5-17l7 1c0 8-3 15-7 20z"/>
      <ellipse class="bk-ink" cx="97" cy="330" rx="6" ry="4"/>
      <path class="bk-ink" d="M63 359h3v13h-3zM71 360h3v12h-3zM79 360h3v12h-3zM86 359h3v13h-3z"/>
      <ellipse class="bk-ink" cx="112" cy="358" rx="10" ry="5"/><circle class="bk-ink" cx="112" cy="353" r="5"/>
      <path class="bk-ink" d="M119 356c2-2 3-6 3-9l4 1c0 4-2 8-4 11z"/><ellipse class="bk-ink" cx="125" cy="345" rx="3.5" ry="2.4"/>
      <path class="bk-ink" d="M106 362h2v8h-2zM116 362h2v8h-2z"/>
    </g>
    <g class="bk-sadu">
      ${Array.from({ length: 13 }, (_, i) => `<path d="M${34 + i * 19} 370l9.5 9 9.5-9-9.5-9z"/>`).join("")}
    </g>
    <g class="bk-frame">
      <rect x="14" y="14" width="292" height="372" rx="4"/>
      <rect x="21" y="21" width="278" height="358" rx="3"/>
    </g>
  </svg>`;

// ---- the shell ---------------------------------------------------------------------------------
const toggle = (key, onKey, offKey) => `
  <button type="button" class="btn bk-tg${show[key] ? " is-on" : ""}" data-toggle="${key}" aria-pressed="${show[key]}">
    ${esc(t(show[key] ? onKey : offKey))}</button>`;

const contents = (at, done) => `
  <div class="bk-contents" ${contentsOpen ? "" : "hidden"}>
    <ol class="bk-toc">
      ${PARTS.map((part, i) => {
        const pages = PAGES.filter(p => p.part === part.id);
        const read = pages.filter(p => done.has(p.id)).length;
        const first = pages[0].n;
        return `<li class="bk-toc-row${PAGES[at - 1]?.part === part.id ? " is-now" : ""}">
          <button type="button" data-go="${first}">
            <span class="bk-toc-n">${esc(num(i + 1))}</span>
            <span class="bk-toc-t"><b lang="ar" dir="rtl">${esc(part.title.najdi)}</b><small dir="ltr">${esc(part.title.en)}</small></span>
            <span class="bk-toc-c">${esc(num(read))}/${esc(num(pages.length))}</span>
          </button></li>`;
      }).join("")}
    </ol>
  </div>`;

export default {
  titleKey: "book.title",
  mount(root, { params, signal }) {
    // 0 is the cover; 1…PAGES.length are the pages.
    let at = Math.min(PAGES.length, Math.max(0, parseInt(params[0], 10) || 0));
    let turning = "";

    const remember = () => store.update(st => {
      const set = new Set(st.book?.done ?? []);
      if (at > 0) set.add(PAGES[at - 1].id);
      st.book = { page: Math.max(1, at), done: [...set] };
    }, { silent: true });

    const go = (n, dir) => {
      const next = Math.min(PAGES.length, Math.max(0, n));
      if (next === at) return;
      if (at > 0) remember();                       // the page he is leaving counts as read
      turning = dir || (next > at ? "next" : "back");
      at = next;
      location.hash = at ? `#/read/${at}` : "#/read";
      render();
      root.querySelector(".bk-stage")?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    };

    const render = () => {
      const done = doneSet();
      const p = at > 0 ? PAGES[at - 1] : null;
      const part = p ? PARTS[p.partIndex] : null;
      const readCount = PAGES.filter(x => done.has(x.id)).length;

      root.innerHTML = at === 0 ? `<section class="bk">${cover()}</section>` : `
        <section class="bk">
          <div class="bk-bar">
            <button type="button" class="btn bk-toc-btn" data-contents aria-expanded="${contentsOpen}">
              ${icon("words")} ${esc(t("book.contents"))}</button>
            <p class="bk-where">
              <b lang="ar" dir="rtl">${esc(part.title.najdi)}</b>
              <span dir="ltr">${esc(t("book.pageOf", { n: num(p.n), all: num(PAGES.length) }))}</span>
            </p>
            <div class="bk-toggles">
              ${toggle("colour", "book.colourOff", "book.colourOn")}
              ${toggle("say", "book.sayOff", "book.sayOn")}
              ${toggle("en", "book.enOff", "book.enOn")}
            </div>
          </div>
          ${contents(at, done)}
          <div class="bk-progress" role="img" aria-label="${esc(t("book.read", { n: num(readCount), all: num(PAGES.length) }))}">
            <span style="width:${(readCount / PAGES.length) * 100}%"></span>
          </div>
          <div class="bk-stage${turning ? " turn-" + turning : ""}" tabindex="-1">${sheet(p)}</div>
          <nav class="bk-nav">
            <button type="button" class="btn btn-primary bk-next" data-go="${at + 1}" ${at >= PAGES.length ? "disabled" : ""}>
              ${esc(t("book.next"))} ${icon("back")}</button>
            <button type="button" class="btn bk-back" data-go="${at - 1}">
              ${icon("arrow")} ${esc(t(at === 1 ? "book.cover" : "book.back"))}</button>
          </nav>
          <p class="bk-hint">${esc(t("book.hint"))}</p>
        </section>`;
      turning = "";
    };

    root.addEventListener("click", e => {
      const goTo = e.target.closest("[data-go]");
      if (goTo) { go(+goTo.dataset.go); return; }
      if (e.target.closest("[data-contents]")) {
        contentsOpen = !contentsOpen;
        render();
      }
    }, { signal });

    // ← is forward, the way the pages of an Arabic book run.
    document.addEventListener("keydown", e => {
      if (e.metaKey || e.ctrlKey || e.altKey || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); go(at + 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); go(at - 1); }
    }, { signal });

    // A swipe across the sheet turns the page; a tap on a word still says it.
    let from = null;
    root.addEventListener("pointerdown", e => { from = e.pointerType === "mouse" ? null : { x: e.clientX, y: e.clientY }; }, { signal });
    root.addEventListener("pointerup", e => {
      if (!from) return;
      const dx = e.clientX - from.x;
      const dy = e.clientY - from.y;
      from = null;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.6) go(at + (dx > 0 ? -1 : 1));
    }, { signal });

    // A book is a reading surface: while it is open, the floating "Together for" card steps aside instead of
    // sitting on top of the page (on a phone it covered the page-turn buttons and two lines of every text).
    document.body.classList.add("reading");
    signal.addEventListener("abort", () => document.body.classList.remove("reading"), { once: true });

    render();
    if (at > 0) remember();
  },
};
