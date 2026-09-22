import { startRouter } from "./core/router.js";
import { say, canSpeak } from "./core/speech.js";
import * as store from "./core/store.js";
import * as timer from "./core/timer.js";
import { todayKey } from "./core/dates.js";
import { dayNumber, phaseFor, phaseTitle, TOTAL_DAYS } from "./core/schedule.js";
import { t, tx, lang, meta, setLang } from "./core/i18n.js";
import { esc } from "./core/dom.js";
import { icon } from "./core/art.js";
import { attachTooltips, fitCharts } from "./core/charts.js";
import { loadVocab, vocabNow } from "./core/vocab.js";
import { counts as cardCounts } from "./core/cards.js";
import * as sync from "./core/sync.js";
import { welcome, switchProfile, logOut } from "./core/welcome.js";
import { chime } from "./core/music.js";

import today from "./views/today.js";
import progress from "./views/progress.js";
import calendar from "./views/calendar.js";
import plan from "./views/plan.js";
import print from "./views/print.js";
import cards from "./views/cards.js";
import words from "./views/words.js";
import phrases from "./views/phrases.js";
import letters from "./views/letters.js";
import love from "./views/love.js";
import birthday from "./views/birthday.js";
import numbers from "./views/numbers.js";
import chats from "./views/chats.js";
import stories from "./views/stories.js";
import practice from "./views/practice.js";
import verbs from "./views/verbs.js";
import vowels from "./views/vowels.js";
import reading from "./views/reading.js";
import quiz from "./views/quiz.js";
import record from "./views/record.js";
import grammar from "./views/grammar.js";
import lessons from "./views/lessons.js";
import saudi from "./views/saudi.js";
import review from "./views/review.js";
import * as editmode from "./core/editmode.js";
import * as content from "./core/content.js";
import { openEditor } from "./core/editor.js";

// Each view is { titleKey, mount(root, { params, signal }) }. Listeners a view adds with
// { signal } are removed automatically when you leave it.
const routes = { today, progress, calendar, plan, print, cards, words, phrases, letters, vowels, reading, quiz, record, grammar, lessons, saudi, review, love, birthday, numbers, chats, stories, practice, verbs };
const NAV_ICONS = { today: "today", progress: "progress", calendar: "calendar", plan: "plan", print: "print", cards: "cards", words: "words", phrases: "phrases", letters: "letters", vowels: "vowels", reading: "reading", quiz: "quiz", record: "sound", grammar: "reading", lessons: "plan", saudi: "star", review: "check", love: "heart", birthday: "star", numbers: "timer", chats: "phrases", stories: "reading", practice: "quiz", verbs: "reading" };
const view = document.getElementById("view");
const motion = !matchMedia("(prefers-reduced-motion: reduce)").matches;
let controller = null;
let current = { name: "", params: [] };

if (!canSpeak) document.body.classList.add("no-tts");
document.querySelectorAll("nav [data-route]").forEach(a => a.insertAdjacentHTML("afterbegin", icon(NAV_ICONS[a.dataset.route])));
document.querySelector("[data-menu-open]").insertAdjacentHTML("afterbegin", icon("more"));
document.querySelector("[data-menu-close]").innerHTML = icon("close");

// Phones and tablets: "More" opens the whole menu as a sheet; Escape, the close button or any link closes it.
const moreButton = document.querySelector("[data-menu-open]");
function setMenu(open) {
  document.body.classList.toggle("menu-open", open);
  moreButton.setAttribute("aria-expanded", open);
  if (open) document.querySelector("#menu nav a")?.focus();
}
moreButton.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
document.querySelector("[data-menu-close]").addEventListener("click", () => {
  setMenu(false);
  moreButton.focus();
});
document.addEventListener("keydown", e => e.key === "Escape" && document.body.classList.contains("menu-open") && (setMenu(false), moreButton.focus()));

// Anything with data-say speaks its Arabic, on every page (tap again: slowly); data-say-slow always slowly.
// ✎ (data-edit) opens the word's correction form.
document.addEventListener("click", e => {
  const ed = e.target.closest("[data-edit]");
  if (ed) return openEditor(ed.dataset.edit, () => show(current.name, current.params));
  const slow = e.target.closest("[data-say-slow]");
  if (slow) return say(slow.dataset.saySlow, { slow: true });
  const el = e.target.closest("[data-say]");
  if (el) say(el.dataset.say, { tap: true });
});
// Corrections, suggestions and recordings: load them, and redraw the page (and the menu) when they change.
function renderReviewCount() {
  const n = content.pending().length;
  document.querySelectorAll(".rv-count").forEach(el => {
    el.hidden = n === 0;
    el.textContent = String(n);
  });
}
content.onChange(() => {
  renderReviewCount();
  translateShell();
  if (!document.querySelector("dialog[open]") && !["record", "review", "lessons"].includes(current.name)) show(current.name, current.params);
});
content.load();
editmode.start(() => {
  translateShell();
  show(current.name, current.params);
});
// Record is Dima's page: in the menu only in her profile, and in place of Letters on the iPad/iPhone tab bar.
if (store.isTeacher()) {
  document.body.classList.add("can-record");
  const tab = document.querySelector('.tabbar [data-route="letters"]');
  if (tab) {
    tab.href = "#/record";
    tab.dataset.route = "record";
    tab.querySelector("[data-i18n]").dataset.i18n = "nav.record";
  }
}
attachTooltips(document);
document.querySelector("[data-profile-switch]").addEventListener("click", switchProfile);
document.querySelector("[data-logout]").addEventListener("click", logOut);
document.body.classList.toggle("is-teacher", store.isTeacher());

// Sidebar texts in index.html name their string with a data-i18n attribute.
function translateShell() {
  const m = meta();
  document.documentElement.lang = m.html;
  document.documentElement.dir = m.dir;
  document.querySelectorAll("[data-i18n]").forEach(el => (el.textContent = t(el.dataset.i18n)));
  document.querySelectorAll("[data-i18n-label]").forEach(el => el.setAttribute("aria-label", t(el.dataset.i18nLabel)));
  document.querySelectorAll("[data-lang]").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === lang()));
  if (typeof labelSky === "function") labelSky();
  const who = store.isTeacher() ? ["profile.dima", "profile.teacher"] : ["profile.volodymyr", "profile.student"];
  document.querySelector(".ps-who").textContent = `${t(who[0])} · ${t(who[1])}`;
  document.querySelectorAll("[data-palette]").forEach(b => {
    const name = t(b.dataset.palette === "mud" ? "theme.mud" : "theme.saudi");
    b.title = name;
    b.setAttribute("aria-label", name);
  });
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

// The study timer, visible from every page while it runs.
const pill = document.getElementById("timerpill");
function renderTimerPill() {
  const run = timer.running();
  pill.hidden = !run;
  if (!run) return;
  if (!pill.firstChild) {
    pill.innerHTML = `<a href="#/today">${icon("timer")}<span class="tp-clock"></span></a>
      <button type="button" class="tp-stop">${icon("pause")}<span></span></button>`;
  }
  pill.querySelector(".tp-clock").textContent = timer.clock(Date.now() - run.start);
  pill.querySelector("a").setAttribute("aria-label", t("timer.running"));
  pill.querySelector(".tp-stop span").textContent = t("today.stop");
}
pill.addEventListener("click", e => {
  if (!e.target.closest(".tp-stop")) return;
  timer.stop();
  pill.replaceChildren();
  if (current.name === "today") show(current.name, current.params);
});
setInterval(() => timer.running() && renderTimerPill(), 1000);

// Cards waiting today, on the Cards menu item — like the numbers beside Anki's decks.
let countQueued = false;
function renderNavCount() {
  countQueued = false;
  const v = vocabNow();
  if (!v) return;
  const c = cardCounts(v.notes);
  const n = c.fresh + c.learn + c.review;
  document.querySelectorAll(".navcount:not(.rv-count)").forEach(el => {
    el.hidden = n === 0;
    el.textContent = n > 99 ? "99+" : String(n);
    el.setAttribute("aria-label", t("cards.waiting", { n }));
  });
}
const queueNavCount = () => {
  if (countQueued) return;
  countQueued = true;
  setTimeout(renderNavCount, 250);
};

// Sidebar line showing whether progress is saved to the cloud.
const SHORT = { off: "off", syncing: "syncing", saved: "saved" };
function renderCloudPill({ state } = sync.getStatus()) {
  const el = document.getElementById("cloudpill");
  el.dataset.state = SHORT[state] ?? "error";
  el.textContent = t(`cloud.short.${SHORT[state] ?? "error"}`);
}
sync.onStatus(renderCloudPill);

// The browser's own bar takes the page's background color.
const themeMeta = document.querySelector('meta[name="theme-color"]');
const paintThemeColor = () => themeMeta.setAttribute("content", getComputedStyle(document.body).backgroundColor);
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  paintThemeColor();
  show(current.name, current.params); // charts and the sky read theme colors
});

// The sun/moon button: flips between the light and dark version of the current theme.
const FLIP = { saudi: "saudi-dark", "saudi-dark": "saudi", light: "dark", dark: "light" };
const darkNow = () => {
  const th = store.get().prefs.theme;
  return th === "auto" ? matchMedia("(prefers-color-scheme: dark)").matches : th === "saudi-dark" || th === "dark";
};
const skyButton = document.getElementById("sky-toggle");
const labelSky = () => skyButton.setAttribute("aria-label", t(darkNow() ? "theme.toLight" : "theme.toDark"));
skyButton.addEventListener("click", () => {
  const th = store.get().prefs.theme;
  chime(!darkNow()); // a soft oud note: low for night, bright for day
  const next = th === "auto" ? (darkNow() ? "saudi" : "saudi-dark") : FLIP[th] ?? "saudi-dark";
  store.update(s => {
    s.prefs.theme = next;
  });
  applyTheme();
  show(current.name, current.params);
});

function applyTheme() {
  const theme = store.get().prefs.theme;
  if (theme === "auto") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
  const palette = theme === "light" || theme === "dark" ? "mud" : "saudi";
  document.querySelectorAll("[data-palette]").forEach(b => b.setAttribute("aria-pressed", b.dataset.palette === palette));
  paintThemeColor();
  labelSky();
}
// Two palettes — Saudi green and mud brick; the sun/moon button decides light or dark.
document.querySelector(".themes").addEventListener("click", e => {
  const b = e.target.closest("[data-palette]");
  if (!b) return;
  const dark = darkNow();
  store.update(s => {
    s.prefs.theme = b.dataset.palette === "mud" ? (dark ? "dark" : "light") : dark ? "saudi-dark" : "saudi";
  });
  applyTheme();
  show(current.name, current.params);
});

// Dima's profile: a note at the top of every page, with a switch between her own study and his progress (read-only).
// Pages that draw themselves later (after loading words) replace their content, so the note is put back when it goes missing.
let hisError = false;
function teacherBanner() {
  if (!store.isTeacher() || view.querySelector(":scope > .teacher-banner")) return;
  const w = store.watching();
  const hint = hisError ? t("teacher.hisError") : !store.own().sync.key ? t("teacher.connect") : "";
  view.insertAdjacentHTML("afterbegin", `<div class="teacher-banner${w ? " is-watching" : ""}" role="note">${icon("star")}
    <span>${t(w ? "teacher.watching" : "teacher.banner")}${hint ? `<small>${hint}</small>` : ""}</span>
    <button type="button" class="btn btn-ghost" data-watch>${t(w ? "teacher.backMine" : "teacher.seeHis")}</button></div>`);
}
if (store.isTeacher()) {
  document.documentElement.style.overflowAnchor = "none"; // otherwise the browser scrolls to keep the page still and pushes the note off the top
  new MutationObserver(teacherBanner).observe(view, { childList: true });
  view.addEventListener("click", async e => {
    const b = e.target.closest("[data-watch]");
    if (!b) return;
    b.disabled = true;
    hisError = false;
    if (store.watching()) store.watch(null);
    else {
      try {
        store.watch(await sync.fetchHis());
      } catch (err) {
        hisError = err.state !== "off"; // not signed in to the cloud: the note already says how
      }
    }
    document.body.classList.toggle("is-watching", store.watching());
    show(current.name, current.params);
  });
}

function show(name, params) {
  controller?.abort();
  controller = new AbortController();
  current = { name, params };
  document.querySelectorAll("[data-route]").forEach(a => {
    if (a.dataset.route === name) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  document.title = `${t(routes[name].titleKey)} · Najdi`;
  document.body.dataset.route = name;
  renderDayPill();
  routes[name].mount(view, { params, signal: controller.signal });
  teacherBanner();
  requestAnimationFrame(() => fitCharts(view));
}
let resizeTimer = 0;
addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => fitCharts(view), 120);
});

document.querySelector(".langs").addEventListener("click", e => {
  const b = e.target.closest("[data-lang]");
  if (!b || b.dataset.lang === lang()) return;
  setLang(b.dataset.lang);
  translateShell();
  renderCloudPill();
  renderTimerPill();
  renderNavCount();
  show(current.name, current.params);
});

store.subscribe(() => {
  renderTimerPill();
  queueNavCount();
});

translateShell();
welcome();
renderCloudPill();
renderTimerPill();
sync.start(() => show(current.name, current.params)); // re-render if another computer had newer progress
applyTheme();
startRouter(routes, "today", (name, params) => {
  const samePage = name === current.name;
  if (document.body.classList.contains("menu-open")) setMenu(false);
  show(name, params);
  if (samePage) return; // a tab or letter group inside the same page: stay where you are
  view.focus({ preventScroll: true });
  window.scrollTo(0, 0);
  if (motion) view.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 220, easing: "cubic-bezier(.2,.7,.2,1)" });
});
loadVocab().then(renderNavCount, () => {});
setInterval(renderNavCount, 60_000); // learning cards come due by themselves
