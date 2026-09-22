// The welcome screen, each time the site is opened: choose who's here — Volodymyr (student) or Dima (teacher).
// The first time a profile is chosen on a device, its name must be written (Volodymyr / Володимир / فولوديمير,
// Dima / Діма / ديما). That signs in to cloud save (worker /api/login): Volodymyr's progress is saved in the database;
// Dima's sign-in can only read it.
// Then: a greeting, her or his name in gold, and five seconds of oud. Dima gets "I love you" with hearts and a
// compliment, a different one every time (data/love.js).
// It is a friendly door, not a lock: anyone who reads this file can see the name. "Log out" in the menu forgets the sign-in.
import { lang } from "./i18n.js";
import { STRINGS } from "../i18n/strings.js";
import { scene } from "./art.js";
import { play, LENGTH } from "./music.js";
import * as store from "./store.js";
import * as sync from "./sync.js";
import { LOVE_HEADLINE, COMPLIMENTS } from "../data/love.js";

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

const HEART = `<svg class="wl-heart" viewBox="0 0 24 22" aria-hidden="true"><path d="M12 21.2C5.4 16 1 12.2 1 7.3 1 3.9 3.6 1.3 6.8 1.3c2.1 0 4 1.1 5.2 2.8 1.2-1.7 3.1-2.8 5.2-2.8 3.2 0 5.8 2.6 5.8 6 0 4.9-4.4 8.7-11 13.9z"/></svg>`;

// "I love you" and the next compliment, in Arabic with English beneath.
function loveWords() {
  const i = (storage("local", s => +s.getItem(LOVE_NEXT)) || 0) % COMPLIMENTS.length;
  storage("local", s => s.setItem(LOVE_NEXT, String(i + 1)));
  const c = COMPLIMENTS[i];
  return `<h1 class="wl-title wl-love" id="wl-title">
      <span class="wl-ar" lang="ar" dir="rtl">${HEART}<span>${LOVE_HEADLINE.ar}</span>${HEART}</span>
      <span class="wl-en" lang="en">${LOVE_HEADLINE.en}</span>
    </h1>
    <p class="wl-line wl-compliment"><span class="wl-ar" lang="ar" dir="rtl">${c.ar}</span><span class="wl-en" lang="en">${c.en}</span></p>`;
}

// Hearts rising across the whole sky, for her.
const heartsRain = () =>
  `<div class="wl-hearts" aria-hidden="true">${Array.from({ length: 22 }, (_, i) => `<i style="--x:${(i * 47) % 100}%;--d:${((i * 13) % 30) / 10}s;--s:${0.6 + ((i * 7) % 9) / 10};--t:${5 + ((i * 11) % 5)}s"></i>`).join("")}</div>`;

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
  }

  // The moment: music, the star draws itself in gold, the name appears, the fort's windows light up.
  function celebrate(profile, greetingKey, lineKey) {
    chosen = profile;
    store.setProfile(profile);
    // Cloud save follows the profile: this device now reads (and, for Volodymyr, saves) with that profile's token.
    const token = logins()[profile];
    if (token && token !== "local" && token !== store.get().sync.key) {
      if (profile === startedAs) sync.connect(token);
      else store.update(s => { s.sync = { key: token, pushedAt: 0 }; }, { silent: true });
    }
    stopMusic = play();
    const name = STRINGS[profile === "student" ? "profile.volodymyr" : "profile.dima"].najdi;
    nameEl.textContent = name;
    nameEl.classList.toggle("is-long", name.length > 5);
    const love = profile === "teacher";
    stage.innerHTML = love ? loveWords() : `${three(greetingKey, "h1", "wl-title", "wl-title")}${three(lineKey, "p", "wl-line")}`;
    el.classList.toggle("is-love", love);
    if (love) el.querySelector(".wl-glow").insertAdjacentHTML("afterend", heartsRain());
    el.classList.add("is-open");
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
  choose();
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
