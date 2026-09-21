// The welcome screen, each time the site is opened: choose who's here — Volodymyr (student) or Dima (teacher).
// The first time Dima chooses her profile on a device, she writes her name (Dima, Діма or ديما) to come in.
// Then: a greeting, her or his name in gold, and five seconds of oud.
// It is a friendly door, not a lock: anyone who reads this file can see the name.
import { lang } from "./i18n.js";
import { STRINGS } from "../i18n/strings.js";
import { scene } from "./art.js";
import { play, LENGTH } from "./music.js";
import * as store from "./store.js";

const REGISTERED = "najdi-welcome"; // localStorage: Dima has written her name on this device
const GREETED = "najdi-welcomed"; // sessionStorage: "reload" = a profile was just chosen, don't greet twice
const NAMES = ["dima", "deema", "dema", "діма", "дима", "ديما", "ديمه", "ديمة"];

const normal = s => s.normalize("NFC").toLowerCase().replace(/[ً-ْـ]/g, "").replace(/[^\p{L}]/gu, "");
export const isHerName = s => NAMES.includes(normal(s));

const arLang = () => (lang() === "msa" ? "msa" : "najdi");
const latLang = () => (lang() === "uk" ? "uk" : "en");
const storage = (area, fn) => {
  try {
    return fn(area === "local" ? localStorage : sessionStorage);
  } catch {
    return null;
  }
};

// One text in Arabic (large), English and Ukrainian — the screen appears before anyone picks a language.
function three(key, tag, cls, id = "") {
  const s = STRINGS[key];
  return `<${tag} class="${cls}"${id ? ` id="${id}"` : ""}>
    <span class="wl-ar" lang="ar" dir="rtl">${s[arLang()]}</span>
    <span class="wl-en" lang="en">${s.en}</span>
    <span class="wl-uk" lang="uk">${s.uk}</span>
  </${tag}>`;
}

// A button label in Arabic and English (or Ukrainian).
const two = key => `<span lang="ar">${STRINGS[key][arLang()]}</span><span>${STRINGS[key][latLang()]}</span>`;

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

const sparks = () =>
  Array.from({ length: 16 }, (_, i) => `<i style="--x:${((i * 53) % 100) - 50}px;--d:${((i * 37) % 17) / 10}s;--s:${0.6 + ((i * 29) % 10) / 10}"></i>`).join("");

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
      <span class="wl-p-lat">${n.en} · <span lang="uk">${n.uk}</span></span>
      <span class="wl-p-role">${STRINGS[role][latLang()]} · <span lang="ar">${STRINGS[role][arLang()]}</span></span>
      <span class="wl-p-note">${STRINGS[note][lang()]}</span>
    </span>
  </button>`;
}

export function welcome() {
  if (!document.documentElement.dataset.welcome) return; // set before the first paint by index.html
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lastProfile = storage("local", s => s.getItem("najdi-profile"));
  const startedAs = store.profile();

  const el = document.createElement("div");
  const h = new Date().getHours();
  const day = h >= 6 && h < 18; // the sun is up in Riyadh roughly 6:00–18:00
  el.className = `welcome ${day ? "is-day" : "is-night"}`;
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.setAttribute("aria-labelledby", "wl-title");
  el.innerHTML = `
    ${day ? "" : skyStars()}
    <div class="wl-glow" aria-hidden="true"></div>
    <div class="wl-center">
      <p class="wl-brand" translate="no"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M8 38 L10 13 H30 L32 38 Z"/><path d="M10 13 l2.5-5 2.5 5 2.5-5 2.5 5 2.5-5 2.5 5 2.5-5 2.5 5z"/></svg><span>Najdi</span><span lang="ar">نجدي</span></p>
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
  }

  // The moment: music, the star draws itself in gold, the name appears, the fort's windows light up.
  function celebrate(profile, greetingKey, lineKey) {
    chosen = profile;
    store.setProfile(profile);
    stopMusic = play();
    const name = STRINGS[profile === "student" ? "profile.volodymyr" : "profile.dima"].najdi;
    nameEl.textContent = name;
    nameEl.classList.toggle("is-long", name.length > 5);
    stage.innerHTML = `${three(greetingKey, "h1", "wl-title", "wl-title")}${three(lineKey, "p", "wl-line")}`;
    el.classList.add("is-open");
    const skip = el.querySelector(".wl-skip");
    skip.hidden = false;
    skip.addEventListener("click", leave);
    skip.focus({ preventScroll: true });
    timer = setTimeout(leave, LENGTH * 1000 + 300);
  }

  function choose() {
    stage.innerHTML = `${three("welcome.who", "h1", "wl-title", "wl-title")}
      <div class="wl-profiles">${profileCard("student", lastProfile === "student")}${profileCard("teacher", lastProfile === "teacher")}</div>`;
    stage.querySelectorAll("[data-profile]").forEach(b =>
      b.addEventListener("click", () => {
        if (b.dataset.profile === "student") return celebrate("student", "welcome.backV", "welcome.lineV");
        if (storage("local", s => s.getItem(REGISTERED))) return celebrate("teacher", "welcome.back", "welcome.line");
        askName();
      }),
    );
    (stage.querySelector(".is-last") ?? stage.querySelector("[data-profile]")).focus({ preventScroll: true });
  }

  // Dima, the first time on this device.
  function askName() {
    stage.innerHTML = `${three("welcome.ask", "h1", "wl-title wl-ask", "wl-title")}
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
    form.addEventListener("submit", e => {
      e.preventDefault();
      if (!isHerName(input.value)) {
        wrong.innerHTML = three("welcome.wrong", "p", "wl-wrong-text");
        form.classList.remove("shake");
        void form.offsetWidth; // restart the shake
        form.classList.add("shake");
        input.select();
        return;
      }
      storage("local", s => s.setItem(REGISTERED, "1"));
      input.blur();
      celebrate("teacher", "welcome.first", "welcome.line");
    });
    input.focus();
  }

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && el.classList.contains("is-open") && el.isConnected) leave();
  });
  choose();
}

// "Switch profile" in the menu: show the welcome screen again.
export function switchProfile() {
  location.reload();
}
