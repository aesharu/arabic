// Talk about yourself: choose your details and get your introduction in her dialect, your answers to the questions
// her family and friends will ask, and questions to ask her back. The choices stay on this device (prefs.me).
//   #/me
import { t, tx } from "../core/i18n.js";
import { esc, ar, lat, translit, flag, playIcon, pageHead } from "../core/dom.js";
import { icon } from "../core/art.js";
import * as store from "../core/store.js";
import { sayAll } from "../core/speech.js";
import { aboutMe, DEFAULT_ME } from "../core/aboutme.js";
import { NAMES, CITIES, COUNTRIES, JOBS, LANGUAGES, HOBBIES, FOODS } from "../data/me.js";

const me = () => ({ ...DEFAULT_ME, ...store.get().prefs.me });
const label = x => tx({ en: x.en, uk: x.uk, najdi: x.ar, msa: x.ar });
const mean = x => lat(tx({ en: x.en, uk: x.uk, najdi: x.en, msa: x.en }));
const phrase = x => `<button type="button" class="phrase lv-phrase" data-say="${esc(x.ar.replace(/[؟!.]/g, ""))}">${ar(x.ar, "phrase-ar")}
  <span class="phrase-t">${translit(x.say)} ${flag(x)}<span class="gr-mean">${mean(x)}</span></span>${playIcon}</button>`;

const select = (key, list, value, none) => `<select name="${key}">${none ? `<option value="">${esc(none)}</option>` : ""}${list
  .map(x => `<option value="${x.id}"${x.id === value ? " selected" : ""}>${esc(label(x))}</option>`).join("")}</select>`;
const count = (key, value) => `<select name="${key}">${[0, 1, 2, 3, 4, 5, 6].map(n => `<option${n === +value ? " selected" : ""}>${n}</option>`).join("")}</select>`;
const checks = (key, list, values) => `<div class="me-checks">${list
  .map(x => `<label><input type="checkbox" name="${key}" value="${x.id}"${values.includes(x.id) ? " checked" : ""}> ${esc(label(x))}</label>`).join("")}</div>`;

function form(m) {
  return `<form class="me-form" autocomplete="off">
    <label>${t("me.name")} ${select("name", NAMES, m.name)}</label>
    <label>${t("me.age")} <input type="number" name="age" min="14" max="99" inputmode="numeric" value="${esc(m.age)}"></label>
    <label>${t("me.city")} ${select("city", CITIES, m.city, t("me.noCity"))}</label>
    <label>${t("me.country")} ${select("country", COUNTRIES, m.country)}</label>
    <label>${t("me.job")} ${select("job", JOBS, m.job)}</label>
    <label>${t("me.food")} ${select("food", FOODS, m.food)}</label>
    <label>${t("me.brothers")} ${count("brothers", m.brothers)}</label>
    <label>${t("me.sisters")} ${count("sisters", m.sisters)}</label>
    <fieldset><legend>${t("me.langs")}</legend>${checks("langs", LANGUAGES, m.langs)}</fieldset>
    <fieldset><legend>${t("me.hobbies")}</legend>${checks("hobbies", HOBBIES, m.hobbies)}</fieldset>
  </form>`;
}

function output(r) {
  return `<section class="me-out">
      <div class="panel-head"><h2>${t("me.intro")}</h2><button type="button" class="btn" data-listen>${icon("sound")} <span>${t("st.listen")}</span></button></div>
      <p class="muted">${esc(t("me.tip"))}</p>
      <div class="me-lines">${r.intro.map(phrase).join("")}</div>
    </section>
    <section class="me-out">
      <h2>${t("me.qa")}</h2>
      <ol class="me-qa">${r.qa.map(x => `<li>${phrase(x.q)}<div class="me-a">${phrase(x.a)}</div></li>`).join("")}</ol>
    </section>
    <section class="me-out">
      <h2>${t("me.askHer")}</h2>
      <div class="vocab">${r.askHer.map(phrase).join("")}</div>
    </section>`;
}

export default {
  titleKey: "me.title",
  mount(root, { signal }) {
    let stop = null;
    root.innerHTML = `${pageHead(t("me.title"), esc(t("me.sub")), "", "", "phrases")}
      <p class="callout">${icon("heart")}<span>${esc(t("me.family"))}</span></p>
      <div class="me-grid">${form(me())}<div data-out>${output(aboutMe(me()))}</div></div>`;
    const out = root.querySelector("[data-out]");
    const f = root.querySelector(".me-form");

    f.addEventListener("input", () => {
      const d = new FormData(f);
      const next = {
        name: d.get("name"), age: d.get("age"), city: d.get("city"), country: d.get("country"), job: d.get("job"), food: d.get("food"),
        brothers: +d.get("brothers"), sisters: +d.get("sisters"), langs: d.getAll("langs"), hobbies: d.getAll("hobbies"),
      };
      store.update(st => (st.prefs.me = next));
      stop?.();
      out.innerHTML = output(aboutMe(next));
    }, { signal });
    f.addEventListener("submit", e => e.preventDefault(), { signal });

    root.addEventListener("click", e => {
      const b = e.target.closest("[data-listen]");
      if (!b) return;
      if (stop) return stop();
      const lines = [...out.querySelectorAll(".me-lines .phrase")];
      const texts = aboutMe(me()).intro.map(x => x.ar.replace(/[؟!.]/g, ""));
      b.querySelector("span").textContent = t("st.stop");
      stop = sayAll(texts, i => {
        lines.forEach((l, k) => l.classList.toggle("is-playing", k === i));
        if (i < 0) {
          stop = null;
          b.querySelector("span").textContent = t("st.listen");
        }
      });
    }, { signal });
    signal.addEventListener("abort", () => stop?.());
  },
};
