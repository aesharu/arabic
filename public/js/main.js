import { startRouter } from "./core/router.js";
import { say, canSpeak } from "./core/speech.js";
import * as store from "./core/store.js";
import { todayKey } from "./core/dates.js";
import { dayNumber, phaseFor, phaseTitle, TOTAL_DAYS } from "./core/schedule.js";
import { t, tx, lang, setLang } from "./core/i18n.js";
import { esc } from "./core/dom.js";

import today from "./views/today.js";
import calendar from "./views/calendar.js";
import plan from "./views/plan.js";
import letters from "./views/letters.js";
import vowels from "./views/vowels.js";
import reading from "./views/reading.js";
import quiz from "./views/quiz.js";
import phrases from "./views/phrases.js";

// Each view is { titleKey, mount(root, { params, signal }) }. Listeners a view adds with
// { signal } are removed automatically when you leave it.
const routes = { today, calendar, plan, letters, vowels, reading, quiz, phrases };
const view = document.getElementById("view");
let controller = null;
let current = { name: "today", params: [] };

if (!canSpeak) document.body.classList.add("no-tts");

// Anything with data-say speaks its Arabic, on every page.
document.addEventListener("click", e => {
  const el = e.target.closest("[data-say]");
  if (el) say(el.dataset.say);
});

// Sidebar texts in index.html name their string with a data-i18n attribute.
function translateShell() {
  document.documentElement.lang = lang();
  document.querySelectorAll("[data-i18n]").forEach(el => (el.textContent = t(el.dataset.i18n)));
  document.querySelectorAll("[data-i18n-label]").forEach(el => el.setAttribute("aria-label", t(el.dataset.i18nLabel)));
  document.querySelectorAll("[data-lang]").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === lang()));
}

function renderDayPill() {
  const date = todayKey();
  const n = dayNumber(date);
  const phase = phaseFor(date);
  const pct = Math.min(100, Math.max(0, (n / TOTAL_DAYS) * 100));
  document.getElementById("daypill").innerHTML = phase
    ? `<b>${t("day.n", { n })}</b> <span>${t("day.of", { total: TOTAL_DAYS })}</span>
       <span class="meter" aria-hidden="true"><span style="width:${pct.toFixed(1)}%"></span></span>
       <small>${esc(tx(phaseTitle(phase)))}</small>`
    : `<b>${t("pill.soon")}</b>`;
}

const THEMES = ["auto", "light", "dark"];
const themeButton = document.getElementById("theme");
function applyTheme() {
  const theme = store.get().prefs.theme;
  if (theme === "auto") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
  themeButton.textContent = t("theme.label", { name: t(`theme.${theme}`) });
}
themeButton.addEventListener("click", () => {
  store.update(s => {
    s.prefs.theme = THEMES[(THEMES.indexOf(s.prefs.theme) + 1) % THEMES.length];
  });
  applyTheme();
});

function show(name, params) {
  controller?.abort();
  controller = new AbortController();
  current = { name, params };
  document.querySelectorAll("[data-route]").forEach(a => {
    if (a.dataset.route === name) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  document.title = `${t(routes[name].titleKey)} · Najdi`;
  renderDayPill();
  routes[name].mount(view, { params, signal: controller.signal });
}

document.querySelector(".langs").addEventListener("click", e => {
  const b = e.target.closest("[data-lang]");
  if (!b || b.dataset.lang === lang()) return;
  setLang(b.dataset.lang);
  translateShell();
  applyTheme();
  show(current.name, current.params);
});

translateShell();
applyTheme();
startRouter(routes, "today", (name, params) => {
  show(name, params);
  view.focus({ preventScroll: true });
  window.scrollTo(0, 0);
});
