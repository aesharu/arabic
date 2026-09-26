import { startRouter } from "./core/router.js";
import { say, canSpeak } from "./core/speech.js";
import * as store from "./core/store.js";
import * as timer from "./core/timer.js";
import { todayKey } from "./core/dates.js";
import { dayNumber, phaseTitle, stageProgress } from "./core/schedule.js";
import { t, tx, num, lang, meta, setLang, said } from "./core/i18n.js";
import { esc } from "./core/dom.js";
import { icon } from "./core/art.js";
import { attachTooltips, fitCharts } from "./core/charts.js";
import { loadVocab, vocabNow } from "./core/vocab.js";
import { counts as cardCounts, progressNow, wordStats } from "./core/cards.js";
import * as sync from "./core/sync.js";
import { welcome, keepWatch, switchProfile, logOut } from "./core/welcome.js";
import * as activity from "./core/activity.js";
import { chime } from "./core/music.js";
import { celebrate } from "./core/celebrate.js";
import { toast } from "./core/toast.js";
import { earned } from "./core/game.js";
import { elapsed, clock } from "./core/together.js";
import { TOGETHER_SINCE } from "./config.js";

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
import me from "./views/me.js";
import path from "./views/path.js";
import vowels from "./views/vowels.js";
import reading from "./views/reading.js";
import quiz from "./views/quiz.js";
import record from "./views/record.js";
import grammar from "./views/grammar.js";
import lessons from "./views/lessons.js";
import saudi from "./views/saudi.js";
import book from "./views/book.js";
import texts from "./views/texts.js";
import essentials from "./views/essentials.js";
import review from "./views/review.js";
import stats from "./views/stats.js";
import speak from "./views/speak.js";
import write from "./views/write.js";
import awards, { boardNow } from "./views/awards.js";
import * as editmode from "./core/editmode.js";
import * as content from "./core/content.js";
import { openEditor } from "./core/editor.js";
import { renderCulture, startCulture } from "./views/culture.js";

// Each view is { titleKey, mount(root, { params, signal }) }. Listeners a view adds with
// { signal } are removed automatically when you leave it.
const routes = { read: book, essentials, texts, today, progress, calendar, plan, print, cards, words, phrases, letters, vowels, reading, quiz, record, grammar, lessons, saudi, review, stats, speak, write, awards, love, birthday, numbers, chats, stories, practice, verbs, me, path };
const NAV_ICONS = { read: "reading", essentials: "sound", texts: "qalam", today: "today", progress: "progress", calendar: "calendar", plan: "plan", print: "print", cards: "cards", words: "words", phrases: "phrases", letters: "letters", vowels: "vowels", reading: "reading", quiz: "quiz", record: "sound", grammar: "reading", lessons: "plan", saudi: "star", review: "check", stats: "progress", speak: "mic", write: "pencil", awards: "star", love: "heart", birthday: "star", numbers: "timer", chats: "phrases", stories: "reading", practice: "quiz", verbs: "reading", me: "phrases", path: "plan" };
const view = document.getElementById("view");
const motion = !matchMedia("(prefers-reduced-motion: reduce)").matches;
let controller = null;
let current = { name: "", params: [] };

if (!canSpeak) document.body.classList.add("no-tts");
document.querySelectorAll("nav [data-route]").forEach(a => a.insertAdjacentHTML("afterbegin", icon(NAV_ICONS[a.dataset.route])));
// His Cards tab goes to his own Anki deck (/najdi/), so it has no route of its own to take an icon from.
document.querySelector(".tab-najdi")?.insertAdjacentHTML("afterbegin", icon("cards"));
document.querySelector("[data-menu-open]").insertAdjacentHTML("afterbegin", icon("more"));
document.querySelector("[data-menu-close]").innerHTML = icon("close");

// Phones and tablets: "More" opens the whole menu as a sheet; Escape, the close button or any link closes it.
const moreButton = document.querySelector("[data-menu-open]");
function setMenu(open) {
  document.body.classList.toggle("menu-open", open);
  moreButton.setAttribute("aria-expanded", open);
  // While the sheet is open, the page behind it can't be reached with Tab (the tab bar stays, so "More" closes it again).
  for (const el of [document.querySelector("main"), ...document.querySelector(".sidebar").children]) if (el.id !== "menu") el.inert = open;
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
  // Tap a page's scene and it does something small (core/scenes.js).
  const scenePic = e.target.closest(".pscene");
  if (scenePic) {
    const card = scenePic.closest(".scene-card, .culture-pic");
    if (!card) return;
    card.classList.remove("is-play");
    void card.offsetWidth; // restart the animation on a quick second tap
    card.classList.add("is-play");
    clearTimeout(card.playTimer);
    card.playTimer = setTimeout(() => card.classList.remove("is-play"), 1600);
    return;
  }
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

// The day you're on, the stage you've reached, and how much of it is left — no deadline, no total.
function renderDayPill() {
  const n = dayNumber(todayKey());
  const sp = stageProgress(progressNow(vocabNow()?.notes));
  document.getElementById("daypill").innerHTML = n < 1
    ? `<b>${t("pill.soon")}</b>`
    : `<b>${t("day.n", { n })}</b> <span>${esc(tx(phaseTitle(sp.phase)))}</span>
       <span class="meter" aria-hidden="true"><span style="width:${Math.min(100, Math.max(0, sp.pct)).toFixed(1)}%"></span></span>
       <small>${esc(t(`stage.gate.${sp.kind}`, { done: num(sp.done), need: num(sp.need) }))}</small>`;
}

// "Together for 172 days, 3:39:15" — floating above every page, ticking, in both their profiles.
// Tap it to read the same moment differently, and smaller each time: months and days → days → days alone.
const TG_MODES = ["months", "days", "short"];
const together = document.getElementById("together");
const tgMode = () => (TG_MODES.includes(store.get().prefs.togetherMode) ? store.get().prefs.togetherMode : "months");

function renderTogether() {
  const e = elapsed(TOGETHER_SINCE);
  const mode = tgMode();
  const big = mode === "months" ? `${said("unit.months", e.months)} ${said("unit.days", e.restDays)}` : said("unit.days", e.days);
  together.hidden = false;
  together.dataset.mode = mode;
  together.setAttribute("aria-label", `${t("tg.title")} ${big}${mode === "short" ? "" : ` ${clock(e)}`}. ${t("tg.tap")}`);
  together.innerHTML = `${icon("heart")}<span class="tg-text">
      ${mode === "short" ? "" : `<span class="tg-label">${esc(t("tg.title"))}</span>`}
      <span class="tg-big">${esc(big)}</span>
      ${mode === "short" ? "" : `<span class="tg-clock" dir="ltr">${esc(clock(e))}</span>`}
    </span>`;
}
together.addEventListener("click", () => {
  const next = TG_MODES[(TG_MODES.indexOf(tgMode()) + 1) % TG_MODES.length];
  store.update(s => {
    s.prefs.togetherMode = next;
  });
  renderTogether();
});
renderTogether();
setInterval(renderTogether, 1000); // it keeps going, wherever you are on the site

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

// The fire, the level and today's points — under the day pill, on every page. Tap it for the Awards page.
// Dima has her own copy of all of it, so the site keeps score for her too when she studies.
const scoreStrip = document.getElementById("scorestrip");
function renderScore() {
  if (store.watching()) return void (scoreStrip.hidden = true); // his progress, seen from her profile
  const b = boardNow();
  scoreStrip.hidden = false;
  scoreStrip.innerHTML = `<a href="#/awards" aria-label="${esc(`${t("aw.streak")}: ${num(b.streak)}. ${t("aw.level", { n: num(b.level.n) })}. ${t("aw.todayPoints")}: ${num(b.today)}`)}">
      <span class="sc-fire fire-${b.fire}">${icon("flame")}<b>${num(b.streak)}</b></span>
      <span class="sc-lv">${esc(t("aw.level", { n: num(b.level.n) }))}</span>
      <span class="sc-xp">+${num(b.today)}</span>
    </a>`;
}

// An award is won once and stays won. Whatever page he is on, the moment the numbers reach one, it lands.
function checkAwards() {
  if (store.isTeacher() || store.watching() || !vocabNow()) return;
  const b = boardNow();
  const had = new Set(store.get().game?.badges ?? []);
  const fresh = earned(b).filter(id => !had.has(id));
  const level = store.get().game?.level ?? 1;
  if (!fresh.length && b.level.n <= level) return;
  store.update(s => {
    s.game = { badges: [...new Set([...(s.game?.badges ?? []), ...fresh])], level: Math.max(level, b.level.n) };
  });
  // One at a time is a moment; ten at once is noise, so a handful become one line.
  if (fresh.length > 2) toast(t("aw.earnedMany", { n: num(fresh.length) }), { ms: 5000 });
  else for (const id of fresh) toast(t("aw.earnedToast", { name: t(`badge.${id}`) }), { ms: 4200 });
  if (b.level.n > level) toast(t("aw.levelToast", { n: num(b.level.n), name: t(`lv.${b.level.id}`) }), { ms: 5500 });
  if (fresh.length || b.level.n > level) {
    celebrate(scoreStrip);
    chime();
  }
}

// Cards waiting today, on the Cards menu item — like the numbers beside Anki's decks.
let countQueued = false;
// A mark of how many words are known today, kept day by day so the years can show a line that only goes up.
function noteWordsKnown(notes) {
  if (store.isTeacher() || store.watching()) return;
  const date = todayKey();
  const known = wordStats(notes).learned;
  if ((store.get().log[date]?.known ?? -1) === known) return;
  store.update(s => {
    (s.log[date] ??= { min: 0, tasks: [] }).known = known;
  });
}

function renderNavCount() {
  countQueued = false;
  renderDayPill(); // words learned can move the stage on
  renderScore();
  checkAwards();
  const v = vocabNow();
  if (!v) return;
  noteWordsKnown(v.notes);
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

// The browser's own bar takes the color of what's under it: on the iPad and iPhone the green top bar, so Safari's
// bar and the site's run together; on the computer the page's background.
const themeMeta = document.querySelector('meta[name="theme-color"]');
const topBar = matchMedia("(max-width: 860px)");
const paintThemeColor = () =>
  themeMeta.setAttribute("content", getComputedStyle(topBar.matches ? document.querySelector(".sidebar") : document.body).backgroundColor);
topBar.addEventListener("change", paintThemeColor);
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
    <button type="button" class="btn btn-ghost" data-watch>${t(w ? "teacher.backMine" : "teacher.seeHis")}</button></div>
    <div class="her-tools">
      <a class="btn btn-primary" href="#/record">${icon("mic")} ${t("nudge.record")}</a>
      <button type="button" class="btn" data-her-correct>${icon("pencil")} ${t("nudge.correct")}</button>
    </div>`);
}
if (store.isTeacher()) {
  document.documentElement.style.overflowAnchor = "none"; // otherwise the browser scrolls to keep the page still and pushes the note off the top
  new MutationObserver(teacherBanner).observe(view, { childList: true });
  // "Correct a word": the word list, with edit mode already on, so she can see what correcting means.
  view.addEventListener("click", e => {
    if (!e.target.closest("[data-her-correct]")) return;
    location.hash = "#/words";
    editmode.toggle(true);
  });
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

const cultureSlot = document.getElementById("culture");
startCulture(cultureSlot, () => current);
function show(name, params) {
  const samePageRedraw = name === current.name && JSON.stringify(params) === JSON.stringify(current.params) && cultureSlot.innerHTML;
  controller?.abort();
  controller = new AbortController();
  current = { name, params };
  document.querySelectorAll("[data-route]").forEach(a => {
    if (a.dataset.route === name) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  document.title = `${t(routes[name].titleKey)} · Saudi`;
  document.body.dataset.route = name;
  renderDayPill();
  routes[name].mount(view, { params, signal: controller.signal });
  if (!samePageRedraw) {
    renderCulture(cultureSlot, name);
    view.classList.add("is-entering"); // lists flow in once, when the page opens
    clearTimeout(view.enterTimer);
    view.enterTimer = setTimeout(() => view.classList.remove("is-entering"), 1100);
  }
  teacherBanner();
  requestAnimationFrame(() => fitCharts(view));
}

// Phones: a long row of choices scrolls sideways in one line (css: .tabs, .chips, .lv-jump). Whenever the page
// redraws, the chosen one is brought to the middle of its row, so you always see where you are.
function showChosen() {
  for (const row of view.querySelectorAll(".tabs, .chips, .lv-jump")) {
    if (row.scrollWidth <= row.clientWidth) continue;
    const on = row.querySelector('[aria-selected="true"], [aria-current="page"], [aria-pressed="true"]');
    if (!on) continue;
    const a = on.getBoundingClientRect(), r = row.getBoundingClientRect();
    row.scrollLeft += a.left + a.width / 2 - (r.left + r.width / 2);
  }
}
new MutationObserver(() => requestAnimationFrame(showChosen)).observe(view, { childList: true });
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
  renderTogether();
  show(current.name, current.params);
});

store.subscribe(() => {
  renderTimerPill();
  queueNavCount();
});

translateShell();
welcome();
keepWatch();
renderCloudPill();
renderTimerPill();
activity.start(); // count the minutes each profile spends here (Stats)
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
