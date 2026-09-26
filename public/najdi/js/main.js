import * as D from "./deck.js";
import { S } from "./deck.js";
import { $, $$, play, playAll, audioName, audioNames, tellNative, stopAudio, esc } from "./util.js";
import { loadLog, byDay, streaks } from "./stats.js";
import * as today from "./views/today.js";
import * as themes from "./views/themes.js";
import * as browse from "./views/browse.js";
import * as stats from "./views/stats.js";
import * as settings from "./views/settings.js";
import * as study from "./views/study.js";
import * as welcome from "./views/welcome.js";
import * as sync from "./sync.js";

const views = { today, themes, browse, stats, settings, study, welcome };
const NAV_ORDER = ["today", "themes", "browse", "stats", "settings"];
const viewEl = $("#view");
let current = null, currentName = "";

async function go(name, opts = {}) {
  if (!S.deck && name !== "welcome") name = "welcome";
  current?.leave?.();
  stopAudio();
  currentName = name;
  current = views[name];
  document.body.classList.toggle("no-deck", !S.deck);
  $$(".nav").forEach(b => b.setAttribute("aria-current", b.dataset.go === name ? "page" : "false"));
  viewEl.scrollTop = 0;
  await current.render(viewEl, opts);
  if (name !== "study") refreshChrome();
}

async function refreshChrome() {
  if (!S.deck) return;
  const Q = D.queues();
  const due = Q.fresh.length + Q.learn.length + Q.review.length;
  $("#navDue").textContent = due || "";
  const st = streaks(byDay(await loadLog()));
  $("#sideFoot").innerHTML = `<span class="streak-pill"><b>${st.current}</b> day streak${st.studiedToday ? " ✓" : ""}</span>
    <span>${esc(S.deck.name)}</span>`;
}

function applyTheme() {
  const t = S.settings.theme;
  if (t === "system") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = t;
  tellNative({ type: "appearance", value: t });
}

// Once this device has the deck: start saving, and fold in whatever the other device did. It runs
// after the first fetch too, not only on later openings — otherwise the day he set a device up, the
// progress already in his database would sit there until he closed the page and came back.
let syncing = false;
async function deckReady() {
  if (syncing || !S.deck) return;
  syncing = true;
  sync.start();
  try {
    if (await sync.pull()) { await D.load(); refreshChrome(); if (currentName === "today") await go("today"); }
  } catch (err) { console.warn("progress didn't come down:", err.message); }
  sync.saveSoon(2000);
}

window.app = { go, refreshChrome, applyTheme, deckReady, get view() { return currentName; } };

// Any audio button anywhere
document.addEventListener("click", e => {
  const b = e.target.closest("[data-play],[data-sound]");
  if (!b) return;
  if (b.dataset.sound) return play(b.dataset.sound, { button: b });
  const note = S.byGuid.get(b.dataset.guid);
  if (!note) return;
  // A button with its own ♂/♀ plays that one; anything else follows the setting, which may be both.
  const rate = +b.dataset.rate || S.settings.speed;
  const names = audioNames(note, b.dataset.play, b.dataset.voice || S.settings.voice);
  if (names.length > 1) playAll(names, { rate, button: b });
  else play(names[0], { rate, button: b });
});

$$(".nav").forEach(b => b.addEventListener("click", () => go(b.dataset.go)));

document.addEventListener("keydown", e => {
  if (document.querySelector(".modal")) return;
  const typing = e.target.matches("input, textarea, select");
  if ((e.metaKey || e.ctrlKey) && !e.altKey) {
    const i = "12345".indexOf(e.key);
    if (i >= 0 && S.deck && currentName !== "study") { e.preventDefault(); return go(NAV_ORDER[i]); }
    if (e.key === ",") { e.preventDefault(); return go("settings"); }
  }
  if (typing && e.key !== "Escape" && !((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f")) return;
  current?.onKey?.(e);
});

// New study day while the app stays open
let lastDay = new Date().getDate();
const onReturn = () => {
  if (document.hidden) return;
  const d = new Date().getDate();
  if (d !== lastDay) { lastDay = d; if (currentName === "today") go("today"); else refreshChrome(); }
};
document.addEventListener("visibilitychange", onReturn);
window.addEventListener("focus", onReturn);

(async () => {
  try {
    await D.load();
  } catch (err) {
    console.error(err);
    viewEl.innerHTML = `<div class="welcome"><h1>Couldn’t open storage</h1><p class="lead">${esc(err.message || String(err))}</p></div>`;
    return;
  }
  applyTheme();
  await go(S.deck ? "today" : "welcome");
  await deckReady();
})();
