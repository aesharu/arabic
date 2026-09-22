// Chats to read: conversations between him and her in her dialect, the way Saudis text. Read the Arabic first;
// tap a message to see how it's said and what it means (and to hear it — her voice once she's recorded it).
//   #/chats          all chats
//   #/chats/<id>     one chat
import { t, tx, num } from "../core/i18n.js";
import { esc, ar, translit, flag, pageHead } from "../core/dom.js";
import { icon } from "../core/art.js";
import * as store from "../core/store.js";
import * as content from "../core/content.js";
import { CHATS, CHAT_LINES } from "../data/chats.js";

content.register(CHAT_LINES); // ✎ in edit mode

// Shown for every message at once (kept while moving between chats).
const show = { say: false, mean: false };
// Read chats: "ch.<id>" in reading.done (synced); older marks were kept on the device in prefs.chatsRead.
const read = () => [...(store.get().prefs.chatsRead ?? []), ...(store.get().reading?.done ?? []).filter(x => x.startsWith("ch.")).map(x => x.slice(3))];
const mean = x => esc(tx({ en: x.en, uk: x.uk, najdi: x.en, msa: x.en }));

function list() {
  const done = read();
  return `${pageHead(t("chats.title"), esc(t("chats.sub")), "", "", "phrases")}
    <p class="callout">${esc(t("chats.tip"))}</p>
    <ol class="ch-list">${CHATS.map(c => `<li><a class="ch-card" href="#/chats/${c.id}">
      <span class="ch-level">${c.level}</span>
      <span class="ch-card-text"><b>${esc(tx(c.title))}</b>${ar(c.lines[0].ar)}</span>
      <span class="ch-count">${done.includes(c.id) ? `${icon("check")} ` : ""}${esc(t("chats.lines", { n: num(c.lines.length) }))}</span>
    </a></li>`).join("")}</ol>`;
}

const who = (c, l) => (l.who === "her" ? t("profile.dima") : l.who === "other" ? tx({ ...c.other, najdi: c.other.ar, msa: c.other.ar }) : "");

const bubble = (c, l) => (content.apply(l), `
  <li class="ch-msg is-${l.who}">
    <button class="ch-bubble" data-say="${esc(l.speak)}" data-line="${l.id}" data-edit-id="${l.id}">
      ${l.who !== "him" ? `<span class="ch-who">${esc(who(c, l))}</span>` : ""}
      ${ar(l.ar, "ch-ar")}
      <span class="ch-say">${translit(l.say)}</span>
      <span class="ch-mean">${mean(l)}</span>
    </button>
  </li>`);

function chat(c) {
  const i = CHATS.indexOf(c);
  const next = CHATS[i + 1];
  const isRead = read().includes(c.id);
  return `<p class="gr-back"><a href="#/chats">${icon("back")} ${t("chats.all")}</a></p>
    ${pageHead(esc(tx(c.title)), "", `${c.level} · ${esc(t("chats.lines", { n: num(c.lines.length) }))}`, "", "")}
    <div class="ch-tools">
      ${flag({ check: true })}
      <button type="button" class="btn" data-show="say" aria-pressed="${show.say}">${t("chats.say")}</button>
      <button type="button" class="btn" data-show="mean" aria-pressed="${show.mean}">${t("chats.mean")}</button>
    </div>
    <p class="muted small">${esc(t("chats.how"))}</p>
    <ol class="ch-thread${show.say ? " show-say" : ""}${show.mean ? " show-mean" : ""}">${c.lines.map(l => bubble(c, l)).join("")}</ol>
    <div class="ch-end">
      <button type="button" class="btn${isRead ? "" : " btn-primary"}" data-read aria-pressed="${isRead}">${icon("check")} ${t(isRead ? "chats.isRead" : "chats.read")}</button>
      ${next ? `<a class="btn" href="#/chats/${next.id}">${esc(tx(next.title))} ${icon("arrow")}</a>` : ""}
    </div>`;
}

export default {
  titleKey: "chats.title",
  mount(root, { params, signal }) {
    const c = CHATS.find(x => x.id === params[0]);
    const render = () => (root.innerHTML = c ? chat(c) : list());
    render();
    root.addEventListener("click", e => {
      const s = e.target.closest("[data-show]");
      if (s) {
        show[s.dataset.show] = !show[s.dataset.show];
        return render();
      }
      if (e.target.closest("[data-read]")) {
        store.update(st => {
          const set = new Set(st.reading?.done ?? []);
          const was = read().includes(c.id);
          was ? set.delete(`ch.${c.id}`) : set.add(`ch.${c.id}`);
          st.reading = { done: [...set] };
          if (was) st.prefs.chatsRead = (st.prefs.chatsRead ?? []).filter(x => x !== c.id);
        });
        return render();
      }
      const b = e.target.closest("[data-line]");
      if (b) b.closest(".ch-msg").classList.toggle("is-open"); // and main.js plays it
    }, { signal });
  },
};
