// Numbers and time: say any number, practice, the tables, the clock, days, months and questions with numbers.
//   #/numbers
import { t, tx, num } from "../core/i18n.js";
import { esc, ar, translit, flag, playIcon, pageHead } from "../core/dom.js";
import { spoken, isChecked, arabicDigits, clockTime, TIME_PARTS, DAYS, MONTHS, HIJRI_MONTHS, NUMBER_PHRASES } from "../data/numbers.js";

const LEVELS = [10, 20, 100, 1000];
let level = 20;
let current = 7; // the number in the "say any number" box
const rnd = max => Math.floor(Math.random() * (max + 1));
const mean = x => esc(tx({ en: x.en, uk: x.uk, najdi: x.en, msa: x.en }));

const numberCard = n => {
  const s = spoken(n);
  return `<button class="nm-big" data-say="${esc(s.ar)}">
    <span class="nm-digits">${num(n)} <span lang="ar">${arabicDigits(n)}</span></span>
    ${ar(s.ar, "nm-words")}
    <span class="nm-say">${translit(s.say)} ${isChecked(n) ? "" : flag({ check: true })}</span>
    ${playIcon}</button>`;
};

const chip = n => {
  const s = spoken(n);
  return `<button class="nm-chip" data-n="${n}" data-say="${esc(s.ar)}"><b>${num(n)}</b>${ar(s.ar)}<small>${esc(s.say)}</small></button>`;
};

const row = x => `<button class="phrase lv-phrase" data-say="${esc(x.ar)}">${ar(x.ar, "phrase-ar")}
  <span class="phrase-t">${translit(x.say)} ${x.check === false ? "" : flag({ check: true })}<span class="gr-mean">${mean(x)}</span></span>${playIcon}</button>`;

// A clock face for the time practice.
function clock(h, m) {
  const hand = (deg, len, w) => `<line x1="50" y1="50" x2="${50 + len * Math.sin((deg * Math.PI) / 180)}" y2="${50 - len * Math.cos((deg * Math.PI) / 180)}" stroke-width="${w}" stroke-linecap="round"/>`;
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 * Math.PI) / 180;
    return `<circle cx="${50 + 40 * Math.sin(a)}" cy="${50 - 40 * Math.cos(a)}" r="${i % 3 ? 1.3 : 2.2}"/>`;
  }).join("");
  return `<svg class="nm-clock" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" class="nm-face"/>
    <g class="nm-ticks">${ticks}</g><g class="nm-hands">${hand(((h % 12) + m / 60) * 30, 24, 4)}${hand(m * 6, 34, 2.5)}</g><circle cx="50" cy="50" r="3" class="nm-pin"/></svg>`;
}

export default {
  titleKey: "nums.title",
  mount(root, { signal }) {
    let practice = rnd(level);
    let shown = false;
    let time = [rnd(23), rnd(11) * 5];

    const practiceHtml = () => {
      const s = spoken(practice);
      return `<p class="nm-q">${num(practice)} <span lang="ar">${arabicDigits(practice)}</span></p>
        ${shown ? `<button class="nm-answer" data-say="${esc(s.ar)}">${ar(s.ar, "nm-words")} <span>${translit(s.say)}</span> ${playIcon}</button>` : `<p class="muted">${esc(t("nums.practiceHint"))}</p>`}
        <div class="btn-row">${shown ? `<button type="button" class="btn btn-primary" data-next>${t("nums.next")}</button>` : `<button type="button" class="btn btn-primary" data-show>${t("nums.show")}</button>`}</div>`;
    };

    const timeHtml = () => {
      const c = clockTime(...time);
      return `${clock(...time)}<div class="nm-time"><p class="nm-q">${esc(c.digits)}</p>
        <button class="nm-answer" data-say="${esc(c.ar)}">${ar(c.ar, "nm-words")} <span>${translit(c.say)} ${flag({ check: true })}</span> ${playIcon}</button>
        <button type="button" class="btn" data-time>${t("nums.another")}</button></div>`;
    };

    root.innerHTML = `${pageHead(t("nums.title"), esc(t("nums.sub")), "", "", "souq")}
      <section class="panel nm-maker">
        <h2>${t("nums.maker")}</h2>
        <div class="nm-input"><input type="number" inputmode="numeric" min="0" max="1000000" value="${current}" aria-label="${esc(t("nums.maker"))}">
          <button type="button" class="btn" data-random>${t("nums.random")}</button></div>
        <div data-out>${numberCard(current)}</div>
      </section>

      <section class="panel nm-practice">
        <div class="panel-head"><h2>${t("nums.practice")}</h2>
          <div class="seg" role="group">${LEVELS.map(l => `<button type="button" data-level="${l}" aria-pressed="${l === level}">${esc(t("nums.upTo", { n: num(l) }))}</button>`).join("")}</div></div>
        <div data-practice>${practiceHtml()}</div>
      </section>

      <h2>${t("nums.basics")}</h2>
      <div class="nm-grid">${Array.from({ length: 21 }, (_, i) => chip(i)).join("")}</div>
      <h2>${t("nums.tens")}</h2>
      <div class="nm-grid">${[20, 30, 40, 50, 60, 70, 80, 90, 21, 35, 99].map(chip).join("")}</div>
      <h2>${t("nums.hundreds")}</h2>
      <div class="nm-grid">${[100, 200, 300, 400, 500, 600, 700, 800, 900, 150, 365].map(chip).join("")}</div>
      <h2>${t("nums.thousands")}</h2>
      <div class="nm-grid">${[1000, 2000, 3000, 5000, 10000, 11000, 50000, 100000, 1000000, 2026, 2027].map(chip).join("")}</div>

      <section class="panel nm-clockpanel">
        <h2>${t("nums.time")}</h2>
        <div class="nm-timebox" data-clock>${timeHtml()}</div>
        <h3>${t("nums.minutes")}</h3>
        <div class="vocab">${TIME_PARTS.map(row).join("")}</div>
      </section>

      <h2>${t("nums.days")}</h2>
      <div class="vocab">${DAYS.map(d => row({ ...d, check: false })).join("")}</div>
      <h2>${t("nums.months")}</h2>
      <p class="muted">${esc(t("nums.monthsNote"))}</p>
      <div class="vocab">${MONTHS.map((x, i) => row({ ...x, check: false, en: `${i + 1} · ${x.en}`, uk: `${i + 1} · ${x.uk}` })).join("")}</div>
      <h2>${t("nums.hijri")}</h2>
      <div class="vocab">${HIJRI_MONTHS.map((x, i) => row({ ...x, check: false, en: `${i + 1} · ${x.en}`, uk: `${i + 1} · ${x.uk}` })).join("")}</div>
      <h2>${t("nums.phrases")}</h2>
      <div class="vocab">${NUMBER_PHRASES.map(row).join("")}</div>`;

    const out = root.querySelector("[data-out]");
    const input = root.querySelector(".nm-input input");
    const setNumber = n => {
      current = n;
      input.value = n;
      out.innerHTML = numberCard(n);
    };
    input.addEventListener("input", () => {
      const n = Math.floor(Number(input.value));
      if (Number.isInteger(n) && n >= 0 && n <= 1_000_000) {
        current = n;
        out.innerHTML = numberCard(n);
      }
    }, { signal });

    root.addEventListener("click", e => {
      if (e.target.closest("[data-random]")) return setNumber(rnd(level === 1000 ? 999_999 : 1000));
      const c = e.target.closest("[data-n]");
      if (c) setNumber(+c.dataset.n);
      const lv = e.target.closest("[data-level]");
      if (lv) {
        level = +lv.dataset.level;
        root.querySelectorAll("[data-level]").forEach(b => b.setAttribute("aria-pressed", b === lv));
        practice = rnd(level);
        shown = false;
      }
      if (e.target.closest("[data-show]")) shown = true;
      if (e.target.closest("[data-next]")) {
        practice = rnd(level);
        shown = false;
      }
      if (lv || e.target.closest("[data-show], [data-next]")) root.querySelector("[data-practice]").innerHTML = practiceHtml();
      if (e.target.closest("[data-time]")) {
        time = [rnd(23), rnd(11) * 5];
        root.querySelector("[data-clock]").innerHTML = timeHtml();
      }
    }, { signal });
  },
};
