import { startRouter } from "./core/router.js";
import { say, canSpeak } from "./core/speech.js";
import * as store from "./core/store.js";
import { todayKey } from "./core/dates.js";
import { dayNumber, phaseFor, phaseTitle, TOTAL_DAYS } from "./core/schedule.js";
import { esc } from "./core/dom.js";

import today from "./views/today.js";
import calendar from "./views/calendar.js";
import plan from "./views/plan.js";
import letters from "./views/letters.js";
import vowels from "./views/vowels.js";
import reading from "./views/reading.js";
import quiz from "./views/quiz.js";
import phrases from "./views/phrases.js";

// Each view is { title, mount(root, { params, signal }) }. Listeners a view adds with
// { signal } are removed automatically when you leave it.
const routes = { today, calendar, plan, letters, vowels, reading, quiz, phrases };
const view = document.getElementById("view");
let controller = null;

if (!canSpeak) document.body.classList.add("no-tts");

// Anything with data-say speaks its Arabic, on every page.
document.addEventListener("click", e => {
  const el = e.target.closest("[data-say]");
  if (el) say(el.dataset.say);
});

function renderDayPill() {
  const date = todayKey();
  const n = dayNumber(date);
  const phase = phaseFor(date);
  const pct = Math.min(100, Math.max(0, (n / TOTAL_DAYS) * 100));
  document.getElementById("daypill").innerHTML = phase
    ? `<b>Day ${n}</b> <span>of ${TOTAL_DAYS}</span>
       <span class="meter" aria-hidden="true"><span style="width:${pct.toFixed(1)}%"></span></span>
       <small>${esc(phaseTitle(phase))}</small>`
    : `<b>Starts soon</b>`;
}

const THEMES = ["auto", "light", "dark"];
const themeButton = document.getElementById("theme");
function applyTheme() {
  const t = store.get().prefs.theme;
  if (t === "auto") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = t;
  themeButton.textContent = `Theme: ${t}`;
}
themeButton.addEventListener("click", () => {
  store.update(s => {
    s.prefs.theme = THEMES[(THEMES.indexOf(s.prefs.theme) + 1) % THEMES.length];
  });
  applyTheme();
});
applyTheme();

startRouter(routes, "today", (name, params) => {
  controller?.abort();
  controller = new AbortController();
  document.querySelectorAll("[data-route]").forEach(a => {
    if (a.dataset.route === name) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  document.title = `${routes[name].title} · Najdi`;
  renderDayPill();
  routes[name].mount(view, { params, signal: controller.signal });
  view.focus({ preventScroll: true });
  window.scrollTo(0, 0);
});
