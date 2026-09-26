import * as D from "../deck.js";
import { S } from "../deck.js";
import { $, esc, plural, forgetMedia, confirmDialog } from "../util.js";
import * as cloud from "../cloud.js";
import * as store from "../store.js";

const LOCK_ICON = '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
const DOWN_ICON = '<svg viewBox="0 0 24 24"><path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 20h16"/></svg>';

/** First screen: the deck is not in this page, it is fetched from his own database. */
export function render(root) {
  if (!cloud.signedIn()) {
    const teacher = cloud.profile() === "teacher";
    root.innerHTML = `<div class="welcome">
      <div class="ar big">أهلاً</div>
      <h1>${teacher ? "This one is Volodia’s" : "Sign in first"}</h1>
      <p class="lead">${teacher
        ? "These cards are his own deck, on his own shelf. Everything else on the site is yours too — this page just isn’t."
        : "This deck lives in your own database, so the site has to know it is you. Open the site, sign in with your name, and come back."}</p>
      <div><a class="btn primary big" href="/">${teacher ? "Back to the site" : "Go and sign in"}</a></div>
    </div>`;
    return;
  }
  root.innerHTML = `<div class="welcome">
    <div class="ar big">أهلاً وسهلاً</div>
    <h1>Bring your deck in</h1>
    <p class="lead">Your words and recordings are waiting in your own database. This gets them onto this
      device once; after that they play straight from here, with or without a signal.</p>
    <div id="loader"></div>
    <p class="privacy">${LOCK_ICON}<span>Only your profile can read it, and none of it is a public file.</span></p>
  </div>`;
  loader($("#loader", root), { onDone: () => window.app.go("today") });
}

/** The "get the deck" panel — first run, and again from Settings when the deck changes. */
export function loader(box, { update = false, onDone }) {
  box.innerHTML = `<div class="drop" id="drop">${DOWN_ICON}
    <button class="btn primary big" id="get">${update ? "Get it again" : "Get my deck"}</button>
    <p id="hint">1,744 words · A1 to B2</p>
  </div>`;
  $("#get", box).addEventListener("click", run);
  cloud.status().then(s => {
    if ($("#hint", box)) $("#hint", box).textContent = `${plural(s.media, "recording")} · ${(s.deckBytes / 1e6).toFixed(1)} MB of cards`;
  }).catch(() => {});

  async function run() {
    if (update && !(await confirmDialog({ title: "Fetch the deck again?", body: "Your progress is kept for every word that is still in it.", ok: "Fetch it" }))) return;
    box.innerHTML = `<div class="panel importing"><div class="stage-label" id="lbl">Asking your database…</div>
      <div class="progress"><i id="bar" style="width:8%"></i></div><div class="muted" id="sub"></div></div>`;
    const set = (label, pct, sub = "") => {
      if (!$("#lbl", box)) return;
      $("#lbl", box).textContent = label;
      $("#bar", box).style.width = Math.round(pct * 100) + "%";
      $("#sub", box).textContent = sub;
    };
    try {
      await store.persist();
      const notes = await cloud.deck();
      set("Saving the words…", 0.6, plural(notes.length, "word"));
      await store.set("meta", "deck", null);
      await store.clear("notes");
      await store.putMany("notes", notes);
      const media = new Set(notes.flatMap(n => Object.values(n.audio ?? {}).flat()));
      await store.set("meta", "deck", {
        name: "Najdi A1–B2", fileName: "your database", importedAt: Date.now(),
        notes: notes.length, media: media.size, problems: [], skippedInfo: 0,
      });
      forgetMedia();
      await D.load();
      set("Ready", 1);
      showResult(notes.length, media.size);
    } catch (err) {
      console.error(err);
      const why = { "no-deck": "There is no deck in your database yet.",
                    "signed-out": "The site signed you out. Open the site, sign in, and come back.",
                    "not-yours": "This profile can’t read that deck." }[err.message]
                  ?? (err.message || String(err));
      box.innerHTML = `<div class="panel result"><h2>Couldn’t get the deck</h2>
        <p class="muted" style="margin:0">${esc(why)}</p>
        <div><button class="btn ghost" id="again">Try again</button></div></div>`;
      $("#again", box).addEventListener("click", () => loader(box, { update, onDone }));
    }
  }

  function showResult(notes, media) {
    const kept = [...S.cards.keys()].filter(id => S.byGuid.has(id.slice(0, id.lastIndexOf(":")))).length;
    box.innerHTML = `<div class="panel result">
      <h2>${update ? "Deck refreshed" : "Your deck is here"}</h2>
      <div class="result-grid">
        <div><b>${notes.toLocaleString()}</b><span>words</span></div>
        <div><b>${media.toLocaleString()}</b><span>recordings</span></div>
        <div><b>${S.themes.length || S.levels.length || "–"}</b><span>${S.themes.length ? "themes" : "levels"}</span></div>
      </div>
      ${update && kept ? `<p class="muted" style="margin:0">Your progress on ${plural(kept, "card")} carried over.</p>` : ""}
      <p class="muted" style="margin:0">The recordings come as you meet each word, and stay on this device once heard.</p>
      <div><button class="btn primary big" id="go">${update ? "Done" : "Start learning"}</button></div>
    </div>`;
    $("#go", box).addEventListener("click", onDone);
  }
}
