// The welcome screen, each time the site is opened: choose who's here — Volodymyr (student) or Dima (teacher).
// The first time a profile is chosen on a device, its name must be written (Volodymyr / Володимир / فولوديمير,
// Dima / Діма / ديما). That signs in to cloud save (worker /api/login): Volodymyr's progress is saved in the database;
// Dima's sign-in can only read it.
// Then: a greeting, her or his name in gold, and five seconds of oud. Dima gets "I love you" with hearts and a
// compliment, a different one every time (data/love.js).
// On a special day (data/holidays.js: National Day, Founding Day, Ramadan, the Eids, her birthday…) the screen is
// dressed for it — fireworks and green-lit towers, or Ramadan lanterns — and the greeting is the day's: for her, a
// wish with her name; for him, the same greeting and what to say to her that day. It stays until "Come in".
// To see it on any other day: add ?holiday=national (or founding, ramadan, fitr, arafah, adha, newyear, birthday).
// It is a friendly door, not a lock: anyone who reads this file can see the name. "Log out" in the menu forgets the sign-in.
import { lang } from "./i18n.js";
import { STRINGS } from "../i18n/strings.js";
import { uaSay } from "./ua.js";
import { scene } from "./art.js";
import { play, LENGTH } from "./music.js";
import * as store from "./store.js";
import * as sync from "./sync.js";
import { LOVE_HEADLINE, COMPLIMENTS } from "../data/love.js";
import { HOLIDAYS, holidayOn } from "../data/holidays.js";
import { saudiToday } from "./prayer.js";
import { say } from "./speech.js";
import * as activity from "./activity.js";
import * as nudge from "./nudge.js";

const LOGINS = "najdi-logins"; // localStorage: { student?, teacher? } → cloud token ("local" when the cloud couldn't be reached)
const GREETED = "najdi-welcomed"; // sessionStorage: "reload" = a profile was just chosen, don't greet twice
const LOVE_NEXT = "najdi-love-next"; // localStorage: which compliment Dima sees next time
const NAMES = {
  student: ["volodymyr", "volodimir", "volodia", "volodya", "володимир", "володя", "فولوديمير"],
  teacher: ["dima", "deema", "dema", "діма", "дима", "ديما", "ديمه", "ديمة"],
};

const normal = s => s.normalize("NFC").toLowerCase().replace(/[ً-ْـ]/g, "").replace(/[^\p{L}]/gu, "");
export const isNameOf = (profile, s) => NAMES[profile].includes(normal(s));
const logins = () => storage("local", s => JSON.parse(s.getItem(LOGINS) || "{}")) ?? {};

const storage = (area, fn) => {
  try {
    return fn(area === "local" ? localStorage : sessionStorage);
  } catch {
    return null;
  }
};

// One text in Arabic (large) and English — the screen appears before anyone picks a language.
function three(key, tag, cls, id = "") {
  const s = STRINGS[key];
  return `<${tag} class="${cls}"${id ? ` id="${id}"` : ""}>
    <span class="wl-ar" lang="ar" dir="rtl">${s.najdi}</span>
    <span class="wl-en" lang="en" dir="ltr">${s.en}</span>
  </${tag}>`;
}

// A button label in Arabic and English.
const two = key => `<span lang="ar">${STRINGS[key].najdi}</span><span>${STRINGS[key].en}</span>`;

// An eight-pointed star, as carved on Najdi doors and painted on ceilings: two squares turned 45°.
function star() {
  const R = 86;
  const r = (R * Math.cos(Math.PI / 4)) / Math.cos(Math.PI / 8);
  const pts = Array.from({ length: 16 }, (_, i) => {
    const a = (i * Math.PI) / 8 - Math.PI / 2;
    const d = i % 2 ? r : R;
    return `${(d * Math.cos(a)).toFixed(1)},${(d * Math.sin(a)).toFixed(1)}`;
  });
  const tips = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4 - Math.PI / 2;
    return `<circle cx="${(100 * Math.cos(a)).toFixed(1)}" cy="${(100 * Math.sin(a)).toFixed(1)}" r="2.6"/>`;
  }).join("");
  return `<svg class="wl-star" viewBox="-110 -110 220 220" aria-hidden="true">
    <circle class="wl-ring" r="94" pathLength="100"/>
    <path class="wl-outline" d="M${pts.join("L")}Z" pathLength="100"/>
    <circle class="wl-inner" r="54" pathLength="100"/>
    <g class="wl-tips">${tips}</g>
  </svg>`;
}

const skyStars = () =>
  `<svg class="wl-stars" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${Array.from({ length: 90 }, (_, i) => {
    const x = (i * 379 + 17) % 1000;
    const y = (i * 211 + 43) % 720;
    const r = i % 9 === 0 ? 2.2 : i % 4 === 0 ? 1.5 : 1;
    return `<circle cx="${x}" cy="${y}" r="${r}" style="animation-delay:${((i * 7) % 23) / 5}s"${i % 3 ? "" : ' class="tw"'}/>`;
  }).join("")}</svg>`;

const HEART = `<svg class="wl-heart" viewBox="0 0 24 22" aria-hidden="true"><path d="M12 21.2C5.4 16 1 12.2 1 7.3 1 3.9 3.6 1.3 6.8 1.3c2.1 0 4 1.1 5.2 2.8 1.2-1.7 3.1-2.8 5.2-2.8 3.2 0 5.8 2.6 5.8 6 0 4.9-4.4 8.7-11 13.9z"/></svg>`;

// "I love you" and the next compliment, in Arabic with English beneath.
function loveWords() {
  const i = (storage("local", s => +s.getItem(LOVE_NEXT)) || 0) % COMPLIMENTS.length;
  storage("local", s => s.setItem(LOVE_NEXT, String(i + 1)));
  const c = COMPLIMENTS[i];
  return `<h1 class="wl-title wl-love" id="wl-title">
      <span class="wl-ar" lang="ar" dir="rtl">${HEART}<span>${LOVE_HEADLINE.ar}</span>${HEART}</span>
      <span class="wl-en" lang="en" dir="ltr">${LOVE_HEADLINE.en}</span>
    </h1>
    <p class="wl-line wl-compliment"><span class="wl-ar" lang="ar" dir="rtl">${c.ar}</span><span class="wl-en" lang="en" dir="ltr">${c.en}</span></p>`;
}

// Hearts rising across the whole sky, for her.
const heartsRain = () =>
  `<div class="wl-hearts" aria-hidden="true">${Array.from({ length: 22 }, (_, i) => `<i style="--x:${(i * 47) % 100}%;--d:${((i * 13) % 30) / 10}s;--s:${0.6 + ((i * 7) % 9) / 10};--t:${5 + ((i * 11) % 5)}s"></i>`).join("")}</div>`;

const sparks = () =>
  Array.from({ length: 16 }, (_, i) => `<i style="--x:${((i * 53) % 100) - 50}px;--d:${((i * 37) % 17) / 10}s;--s:${0.6 + ((i * 29) % 10) / 10}"></i>`).join("");

// ---------- Special days ----------
const PLAY = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.5L12 19V5L7.5 9.5z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
const COLORS = { green: ["#3DDC84", "#F6EEDC", "#E2B04A"], eid: ["#E2B04A", "#F8E3A6", "#F28AA6", "#8FD3FF"], birthday: ["#F28AA6", "#E2B04A", "#F8E3A6"] };

// Fireworks over the whole sky: bursts of rays that open, drift and fade, one after another.
function fireworks(look) {
  const colors = COLORS[look];
  const spots = [[180, 150], [760, 110], [470, 70], [880, 260], [90, 330], [620, 230], [320, 250], [960, 60]];
  return `<svg class="hol-fw" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${spots.map(([x, y], i) => {
    const c = colors[i % colors.length];
    const R = 54 + ((i * 17) % 40);
    const rays = Array.from({ length: 18 }, (_, k) => {
      const a = (k / 18) * Math.PI * 2;
      const [cx, cy] = [Math.cos(a), Math.sin(a)];
      return `<path d="M${(x + cx * R * 0.25).toFixed(1)} ${(y + cy * R * 0.25).toFixed(1)}L${(x + cx * R).toFixed(1)} ${(y + cy * R).toFixed(1)}"/><circle cx="${(x + cx * R * 1.1).toFixed(1)}" cy="${(y + cy * R * 1.1).toFixed(1)}" r="2.2"/>`;
    }).join("");
    return `<g class="fw" style="--c:${c};--d:${((i * 0.73) % 4.4).toFixed(2)}s;transform-origin:${x}px ${y}px">${rays}</g>`;
  }).join("")}</svg>`;
}

// Ramadan: lanterns hanging from the top of the sky, swaying a little.
function lanterns() {
  const lamp = (x, len, s, i) => `<g class="lantern" style="--d:${(i * 0.6).toFixed(1)}s;transform-origin:${x}px 0px">
    <path class="l-cord" d="M${x} 0V${len}"/>
    <g transform="translate(${x} ${len}) scale(${s})">
      <path class="l-metal" d="M-6 0h12l4 8h-20z"/><path class="l-glass" d="M-12 8h24l-3 30h-18z"/>
      <path class="l-frame" d="M-12 8h24M-3 8l-1.5 30M3 8l1.5 30M-12 8l3 30M12 8l-3 30"/><path class="l-metal" d="M-10 38h20l-4 8h-12z"/>
      <circle class="l-light" cy="23" r="7"/>
    </g></g>`;
  return `<svg class="hol-lanterns" viewBox="0 0 1000 300" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
    ${[[90, 70, 1.3], [240, 130, 1], [400, 50, 1.5], [610, 110, 1.1], [780, 60, 1.4], [930, 140, 1]].map(([x, len, s], i) => lamp(x, len, s, i)).join("")}</svg>`;
}

// The day's words: the greeting large with its pronunciation and meaning; then for her a wish with her name,
// for him what to say to her (tap to hear it) and what she'll answer; one line about the day; "Come in".
function holidayWords(h, profile) {
  const her = profile === "teacher";
  // He reads the pronunciation twice — Latin, then Ukrainian letters, which get these sounds closer (core/ua.js).
  const ua = say => `<span class="hol-ua" lang="uk" dir="ltr">${uaSay(say)}</span>`;
  const phrase = p => `<span class="wl-ar" lang="ar" dir="rtl">${p.ar}</span>${her ? "" : `<span class="hol-say" lang="ar-Latn" dir="ltr" translate="no">${p.say}</span>${ua(p.say)}`}
    <span class="wl-en" lang="en" dir="ltr">${p.en}</span>`;
  const title = (!her && h.titleV) || h.title;
  const fact = her ? h.fact : h.factV ?? h.fact;
  const learn = h.sayToHer && `<div class="hol-learn">
      <p class="hol-lead">${two("hol.sayIt")}</p>
      <button type="button" class="hol-phrase" data-hol-say="${h.sayToHer.ar}">
        <span class="wl-ar" lang="ar" dir="rtl">${h.sayToHer.ar}</span>
        <span class="hol-say" lang="ar-Latn" dir="ltr" translate="no">${h.sayToHer.say}</span>${her ? "" : ua(h.sayToHer.say)}
        <span class="hol-mean" dir="ltr">${h.sayToHer.en}</span>
        <span class="hol-play">${PLAY}</span>
      </button>
      ${h.reply ? `<p class="hol-reply" dir="ltr">${STRINGS["hol.reply"].en}: <span lang="ar" dir="rtl">${h.reply.ar}</span> <i>${h.reply.say}</i>${her ? "" : ` <i lang="uk">${uaSay(h.reply.say)}</i>`} — ${h.reply.en}</p>` : ""}
      ${h.check ? `<p class="hol-check">${STRINGS["flag.label"].en}</p>` : ""}
    </div>`;
  return `<p class="hol-name"><span lang="ar" dir="rtl">${h.name.najdi}</span><span dir="ltr">${h.name.en}</span></p>
    <h1 class="wl-title hol-title" id="wl-title">${phrase(title)}</h1>
    ${her ? `<p class="wl-line hol-line">${phrase(h.toHer)}</p>` : learn}
    ${fact ? `<p class="hol-fact" lang="${lang() === "en" ? "en" : "ar"}" dir="auto">${fact[lang()]}</p>` : ""}
    <div class="hol-actions">
      ${!her && h.id === "birthday" ? `<button type="button" class="hol-more" data-hol-go="#/birthday">${two("hol.wishes")}</button>` : ""}
      <button type="button" class="wl-btn" data-hol-in>${two(her ? "welcome.go" : "hol.in")}</button>
    </div>`;
}

// A profile to choose: name in Arabic, English and Ukrainian, the role, and what the role means.
function profileCard(id, last) {
  const person = id === "student" ? "profile.volodymyr" : "profile.dima";
  const role = id === "student" ? "profile.student" : "profile.teacher";
  const note = id === "student" ? "profile.studentNote" : "profile.teacherNote";
  const n = STRINGS[person];
  return `<button class="wl-profile${last ? " is-last" : ""}" type="button" data-profile="${id}">
    <span class="wl-avatar" aria-hidden="true" lang="ar">${n.najdi[0]}</span>
    <span class="wl-p-text">
      <span class="wl-p-ar" lang="ar" dir="rtl">${n.najdi}</span>
      <span class="wl-p-lat">${n.en}</span>
      <span class="wl-p-role">${STRINGS[role].en} · <span lang="ar">${STRINGS[role].najdi}</span></span>
      <span class="wl-p-note">${STRINGS[note][lang()]}</span>
    </span>
  </button>`;
}

// Today's special day in Saudi Arabia (or the one asked for with ?holiday=…), or null. Never stops the welcome screen.
function specialDay() {
  try {
    return HOLIDAYS.find(o => o.id === new URLSearchParams(location.search).get("holiday")) ?? holidayOn(saudiToday());
  } catch {
    return null;
  }
}
let greetedDay = ""; // the Saudi date whose special greeting was shown while this page has been open

// direct: the site is already open (it stayed open overnight) — go straight to the day's greeting for this profile.
export function welcome({ direct = false } = {}) {
  if (direct) document.documentElement.dataset.welcome = "1";
  if (!document.documentElement.dataset.welcome) return; // set before the first paint by index.html
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lastProfile = storage("local", s => s.getItem("najdi-profile"));
  const startedAs = store.profile();
  const holiday = specialDay();
  if (direct && !holiday) return void delete document.documentElement.dataset.welcome;

  const el = document.createElement("div");
  const h = new Date().getHours();
  const day = !holiday && h >= 6 && h < 18; // the sun is up in Riyadh roughly 6:00–18:00; special days are always a festive night
  el.className = `welcome ${day ? "is-day" : "is-night"}${holiday ? ` is-holiday h-${holiday.look}` : ""}`;
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.setAttribute("aria-labelledby", "wl-title");
  el.innerHTML = `
    ${day ? "" : skyStars()}
    <div class="wl-glow" aria-hidden="true"></div>
    ${!holiday ? "" : COLORS[holiday.look] ? fireworks(holiday.look) : holiday.look === "ramadan" ? lanterns() : ""}
    <div class="wl-center">
      <p class="wl-brand" translate="no"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M8 38 L10 13 H30 L32 38 Z"/><path d="M10 13 l2.5-5 2.5 5 2.5-5 2.5 5 2.5-5 2.5 5 2.5-5 2.5 5z"/></svg><span>Saudi</span><span lang="ar">سعودي</span></p>
      <div class="wl-medal">
        ${star()}
        <p class="wl-name" lang="ar" dir="rtl" translate="no"></p>
        <div class="wl-sparks" aria-hidden="true">${sparks()}</div>
      </div>
      <div class="wl-stage"></div>
    </div>
    <div class="wl-scene">${scene(day ? "day" : "night").replace("xMaxYMax", "xMidYMax")}</div>
    <button class="wl-skip" type="button" hidden>${STRINGS["welcome.skip"][lang()]}</button>`;
  document.body.append(el);
  const stage = el.querySelector(".wl-stage");
  const nameEl = el.querySelector(".wl-name");

  let stopMusic = () => {};
  let timer = 0;
  let chosen = startedAs;

  function leave() {
    clearTimeout(timer);
    stopMusic();
    // A different profile than the page started with: start again, so teacher mode is on (or off) from the first moment.
    if (chosen !== startedAs) {
      storage("session", s => s.setItem(GREETED, "reload"));
      return location.reload();
    }
    delete document.documentElement.dataset.welcome;
    el.classList.add("is-leaving");
    setTimeout(() => el.remove(), reduced ? 0 : 900);
    document.getElementById("view")?.focus({ preventScroll: true });
    // A word to Dima about why her voice matters — after the greeting, never on top of it.
    setTimeout(() => nudge.maybeShow({ holiday: Boolean(holiday) }), reduced ? 0 : 950);
  }

  // The moment: music, the star draws itself in gold, the name appears, the fort's windows light up.
  function celebrate(profile, greetingKey, lineKey) {
    if (holiday) greetedDay = saudiToday();
    chosen = profile;
    store.setProfile(profile);
    // Cloud save follows the profile: this device now reads (and, for Volodymyr, saves) with that profile's token.
    const token = logins()[profile];
    if (token && token !== "local" && token !== store.get().sync.key) {
      if (profile === startedAs) sync.connect(token);
      else store.update(s => { s.sync = { key: token, pushedAt: 0 }; }, { silent: true });
    }
    activity.logVisit(holiday?.id); // the Stats page: who came in, when, and which special day greeted them
    stopMusic = play();
    const name = STRINGS[profile === "student" ? "profile.volodymyr" : "profile.dima"].najdi;
    nameEl.textContent = name;
    nameEl.classList.toggle("is-long", name.length > 5);
    const love = profile === "teacher" && (!holiday || holiday.look === "birthday");
    if (holiday) {
      stage.innerHTML = holidayWords(holiday, profile);
      stage.querySelector("[data-hol-in]").addEventListener("click", leave);
      stage.querySelector("[data-hol-say]")?.addEventListener("click", e => say(e.currentTarget.dataset.holSay, { tap: true }));
      stage.querySelector("[data-hol-go]")?.addEventListener("click", e => {
        location.hash = e.currentTarget.dataset.holGo;
        leave();
      });
    } else stage.innerHTML = profile === "teacher" ? loveWords() : `${three(greetingKey, "h1", "wl-title", "wl-title")}${three(lineKey, "p", "wl-line")}`;
    el.classList.toggle("is-love", love);
    if (love) el.querySelector(".wl-glow").insertAdjacentHTML("afterend", heartsRain());
    el.classList.add("is-open");
    if (holiday) {
      stage.querySelector("[data-hol-in]").focus({ preventScroll: true });
      return; // a special day stays until "Come in"
    }
    const skip = el.querySelector(".wl-skip");
    skip.hidden = false;
    skip.addEventListener("click", leave);
    skip.focus({ preventScroll: true });
    timer = setTimeout(leave, love ? 9500 : LENGTH * 1000 + 300); // time to read the compliment
  }

  function choose() {
    stage.innerHTML = `${three("welcome.who", "h1", "wl-title", "wl-title")}
      <div class="wl-profiles">${profileCard("student", lastProfile === "student")}${profileCard("teacher", lastProfile === "teacher")}</div>`;
    stage.querySelectorAll("[data-profile]").forEach(b =>
      b.addEventListener("click", () => {
        const p = b.dataset.profile;
        if (logins()[p] && logins()[p] !== "local") return p === "student" ? celebrate("student", "welcome.backV", "welcome.lineV") : celebrate("teacher", "welcome.back", "welcome.line");
        askName(p);
      }),
    );
    (stage.querySelector(".is-last") ?? stage.querySelector("[data-profile]")).focus({ preventScroll: true });
  }

  // The first time this profile is used on this device: write the name to sign in.
  function askName(profile) {
    stage.innerHTML = `${three(profile === "student" ? "welcome.askV" : "welcome.ask", "h1", "wl-title wl-ask", "wl-title")}
      <form class="wl-form" novalidate>
        <input class="wl-input" name="name" type="text" dir="auto" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="go" aria-labelledby="wl-title" placeholder="· · ·">
        <button class="wl-btn" type="submit">${two("welcome.go")}</button>
        <div class="wl-wrong" aria-live="polite"></div>
        <button class="wl-back" type="button">${STRINGS["welcome.back2"][lang()]}</button>
      </form>`;
    const form = stage.querySelector(".wl-form");
    const input = form.querySelector("input");
    const wrong = form.querySelector(".wl-wrong");
    form.querySelector(".wl-back").addEventListener("click", choose);
    form.addEventListener("submit", async e => {
      e.preventDefault();
      if (!isNameOf(profile, input.value)) {
        wrong.innerHTML = three("welcome.wrong", "p", "wl-wrong-text");
        form.classList.remove("shake");
        void form.offsetWidth; // restart the shake
        form.classList.add("shake");
        input.select();
        return;
      }
      input.blur();
      form.querySelector(".wl-btn").disabled = true;
      let token = "local";
      try {
        const res = await fetch("api/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: input.value }), cache: "no-store" });
        if (res.ok) token = (await res.json()).token || "local";
      } catch {} // offline: come in anyway; cloud save connects next time
      storage("local", s => s.setItem(LOGINS, JSON.stringify({ ...logins(), [profile]: token })));
      if (profile === "student") celebrate("student", "welcome.backV", "welcome.lineV");
      else celebrate("teacher", "welcome.first", "welcome.line");
    });
    input.focus();
  }

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && el.classList.contains("is-open") && el.isConnected) leave();
  });
  if (direct) celebrate(startedAs);
  else choose();
}

// The iPad and iPhone keep the site open for days, so "opening" it can just bring back yesterday's page. So:
// coming back to the site on a new day reloads it — fresh, with the welcome screen and the day's greeting, the same
// as opening it new (unless something is open mid-way, like the voice studio; progress and the timer are saved
// either way). And if the site is open when midnight in Saudi Arabia brings a special day, its greeting comes in.
export function keepWatch() {
  const opened = { saudi: saudiToday(), local: new Date().toDateString() };
  const busy = () => !!document.querySelector("dialog[open]"); // the voice studio or a correction being written
  const check = returning => {
    if (document.hidden) return;
    const newDay = saudiToday() !== opened.saudi || new Date().toDateString() !== opened.local;
    if (returning && newDay && !busy()) return location.reload();
    if (!specialDay() || greetedDay === saudiToday() || busy() || document.querySelector(".welcome")) return;
    welcome({ direct: true });
  };
  document.addEventListener("visibilitychange", () => check(true));
  addEventListener("pageshow", e => e.persisted && check(true));
  addEventListener("focus", () => check(true));
  setInterval(() => check(false), 60e3);
}

// "Switch profile" in the menu: show the welcome screen again.
export function switchProfile() {
  location.reload();
}

// "Log out": this device forgets both sign-ins, so the name must be written again on the welcome screen.
// Progress stays: it's saved in the cloud (the last minutes are sent first) and on this device.
export async function logOut() {
  if (store.own().sync?.key) await sync.push().catch(() => {});
  sync.disconnect();
  storage("local", s => {
    s.removeItem(LOGINS);
    for (const k of ["najdi-v2", "najdi-v2-dima"]) {
      const d = JSON.parse(s.getItem(k) || "null");
      if (d?.sync?.key) s.setItem(k, JSON.stringify({ ...d, sync: { key: "", pushedAt: 0 } }));
    }
  });
  location.reload();
}
