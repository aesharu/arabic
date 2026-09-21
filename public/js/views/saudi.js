// Saudi life: today in the Hijri calendar, prayer times and the way to Mecca for a chosen city, the year's
// occasions, culture stories (with the north first among equals) and facts.
//   #/saudi            everything
//   #/saudi/<region>   stories from one region: najd · north
import { t, tx, num, locale, lang } from "../core/i18n.js";
import { esc, rich, ar, translit, flag, playIcon, pageHead } from "../core/dom.js";
import { icon } from "../core/art.js";
import * as store from "../core/store.js";
import { CITIES, PRAYERS, around, qibla, hijriParts, saudiToday } from "../core/prayer.js";
import { STORIES, REGIONS, FACTS, OCCASIONS } from "../data/saudi.js";
import { speakText } from "../core/vocab.js";
import * as content from "../core/content.js";

// Every word can be corrected in edit mode (ids sa.<story>x<n>).
for (const s of STORIES) s.words.forEach((w, i) => (w.id = `sa.${s.id}x${i}`));
content.register(STORIES.flatMap(s => s.words));

const DAY = 864e5;
const cityNow = () => CITIES.find(c => c.id === store.get().prefs.city) ?? CITIES[0];
const clock = d => new Intl.DateTimeFormat(locale(), { hour: "numeric", minute: "2-digit", timeZone: "Asia/Riyadh" }).format(d);
const hijriLong = (d, l = locale()) =>
  new Intl.DateTimeFormat(`${l.split("-u-")[0]}-u-ca-islamic-umalqura-nu-latn`, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(d);
const gregLong = d => new Intl.DateTimeFormat(locale(), { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(d);

export function leftText(ms) {
  const m = Math.max(0, Math.round(ms / 60e3));
  const h = Math.floor(m / 60);
  return h ? t("saudi.inHours", { h, m: m % 60 }) : t("saudi.inMin", { m });
}

// The next date of each occasion, within the coming ~13 months.
export function upcoming(from = saudiToday()) {
  const start = Date.parse(from);
  const found = new Map();
  for (let i = 0; i < 400 && found.size < OCCASIONS.length; i++) {
    const d = new Date(start + i * DAY + 12 * 3600e3);
    const h = hijriParts(d);
    for (const o of OCCASIONS) {
      if (found.has(o.id)) continue;
      const hit = o.hijri ? h.month === o.hijri[0] && h.day === o.hijri[1] : d.getUTCMonth() + 1 === o.greg[0] && d.getUTCDate() === o.greg[1];
      if (hit) found.set(o.id, { o, date: d, days: i });
    }
  }
  return [...found.values()].sort((a, b) => a.days - b.days);
}

const daysText = n => (n === 0 ? t("saudi.isToday") : n === 1 ? t("saudi.tomorrow") : t("saudi.inDays", { n: num(n) }));

// A compass: N at the top, the arrow turned to the Kaaba's bearing.
function compass(bearing) {
  const ticks = Array.from({ length: 36 }, (_, i) => `<line x1="60" y1="${i % 9 === 0 ? 10 : 12}" x2="60" y2="16" transform="rotate(${i * 10} 60 60)"/>`).join("");
  return `<svg class="qibla-compass" viewBox="0 0 120 120" aria-hidden="true">
    <circle cx="60" cy="60" r="54" class="qc-face"/><g class="qc-ticks">${ticks}</g>
    <text x="60" y="30" text-anchor="middle" class="qc-n">N</text>
    <g transform="rotate(${bearing.toFixed(1)} 60 60)">
      <path d="M60 22 L67 60 L60 55 L53 60 Z" class="qc-arrow"/><path d="M60 98 L53 60 L60 65 L67 60 Z" class="qc-tail"/>
      <g transform="translate(60 14)"><rect x="-6" y="-6" width="12" height="12" rx="1.5" class="qc-kaaba"/><rect x="-6" y="-3" width="12" height="2" class="qc-band"/></g>
    </g>
    <circle cx="60" cy="60" r="4" class="qc-pin"/>
  </svg>`;
}

const wordBtn = w => (content.apply(w), `<button class="phrase" data-say="${esc(speakText(w.ar))}" data-edit-id="${w.id}">${ar(w.ar, "phrase-ar")}
  <span class="phrase-t">${translit(w.say)} ${w.check ? flag({ check: true }) : ""}
    <span class="gr-mean">${esc(tx({ en: w.en, uk: w.uk, najdi: w.en, msa: w.en }))}</span></span>${playIcon}</button>`);

export default {
  titleKey: "saudi.title",
  mount(root, { params, signal }) {
    const region = REGIONS[params[0]] && params[0] !== "all" ? params[0] : "all";

    const prayerPanel = () => {
      const city = cityNow();
      const now = Date.now();
      const { prev, next, today } = around(city, now);
      return `<div class="city-chips" role="group" aria-label="${esc(t("saudi.city"))}">${CITIES.map(c =>
          `<button type="button" data-city="${c.id}" aria-pressed="${c.id === city.id}">${esc(tx(c.name))}</button>`).join("")}</div>
        ${next ? `<p class="pr-next"><span>${esc(t("saudi.nextPrayer"))}</span> ${ar(next.p.ar)} <b>${esc(clock(next.at))}</b> <em data-left>${esc(leftText(next.at - now))}</em></p>` : ""}
        <ol class="pr-list">${PRAYERS.map(p => {
          const at = today[p.id];
          const cls = next && p.id === next.p.id && at.getTime() === next.at.getTime() ? "is-next" : prev && p.id === prev.p.id && at.getTime() === prev.at.getTime() ? "is-prev" : at < now ? "is-past" : "";
          return `<li class="${cls}${p.notPrayer ? " is-sun" : ""}"><button class="pr-name" data-say="${esc(p.ar)}">${ar(p.ar)} <span>${esc(tx({ en: p.en, uk: p.uk, najdi: p.en, msa: p.en }))}</span></button><b>${esc(clock(at))}</b></li>`;
        }).join("")}</ol>
        <p class="muted small">${esc(t("saudi.method"))}</p>`;
    };

    const qiblaPanel = () => {
      const q = qibla(cityNow());
      return `${compass(q.bearing)}
        <p class="qibla-num"><b>${num(Math.round(q.bearing))}°</b> ${esc(t("saudi.fromNorth"))} · ${num(Math.round(q.km))} ${esc(t("saudi.km"))}</p>
        <p class="muted small">${esc(t("saudi.qiblaHint", { city: tx(cityNow().name) }))}</p>`;
    };

    const render = () => {
      const todayD = new Date(Date.parse(saudiToday()) + 12 * 3600e3);
      const next = upcoming();
      const shown = STORIES.filter(s => region === "all" || s.region === region);
      root.innerHTML = `
        ${pageHead(t("saudi.title"), esc(t("saudi.sub")), "", "", "phrases")}
        <div class="sa-top">
          <section class="panel sa-today"><h2>${icon("calendar")} ${t("saudi.today")}</h2>
            <p class="sa-hijri" lang="ar" dir="rtl">${esc(hijriLong(todayD, "ar-SA"))}</p>
            ${lang() === "najdi" || lang() === "msa" ? "" : `<p class="sa-hijri-lat">${esc(hijriLong(todayD))}</p>`}
            <p class="muted">${esc(gregLong(todayD))}</p>
            ${next[0] ? `<p class="sa-next">${icon("star")} <b>${esc(tx(next[0].o.name))}</b> — ${esc(daysText(next[0].days))}</p>` : ""}
          </section>
          <section class="panel sa-prayer"><h2>${icon("timer")} ${t("saudi.prayers")}</h2><div data-prayer>${prayerPanel()}</div></section>
          <section class="panel sa-qibla"><h2>${icon("arrow")} ${t("saudi.qibla")}</h2><div data-qibla>${qiblaPanel()}</div></section>
        </div>

        <section class="sa-block"><h2>${t("saudi.year")}</h2>
          <ol class="sa-year">${next.map(({ o, date, days }) => `<li><b>${esc(tx(o.name))}</b>
            <span>${esc(new Intl.DateTimeFormat(locale(), { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date))} · <span lang="ar">${esc(hijriLong(date, "ar-SA"))}</span></span>
            <em>${esc(daysText(days))}</em></li>`).join("")}</ol>
          <p class="muted small">${esc(t("saudi.yearNote"))}</p></section>

        <section class="sa-block"><h2>${t("saudi.stories")}</h2>
          <div class="tabs" role="group" aria-label="${esc(t("saudi.stories"))}">${Object.entries(REGIONS).map(([id, name]) =>
            `<a href="#/saudi/${id}" aria-selected="${id === region}">${esc(tx(name))}</a>`).join("")}</div>
          <div class="sa-stories">${shown.map(s => `<details class="panel sa-story" id="story-${s.id}">
            <summary><span class="sa-tag is-${s.region}">${esc(tx(REGIONS[s.region]))}</span><h3>${esc(tx(s.title))}</h3></summary>
            <p>${rich(tx(s.body))}</p>
            <h4>${t("saudi.words")}</h4><div class="vocab sa-words">${s.words.map(wordBtn).join("")}</div>
          </details>`).join("")}</div></section>

        <section class="sa-block"><h2>${icon("star")} ${t("saudi.facts")}</h2>
          <ul class="sa-facts">${FACTS.map(f => `<li>${rich(tx(f))}</li>`).join("")}</ul></section>`;
    };

    render();
    root.addEventListener("click", e => {
      const c = e.target.closest("[data-city]");
      if (!c) return;
      store.update(s => {
        s.prefs.city = c.dataset.city;
      });
      root.querySelector("[data-prayer]").innerHTML = prayerPanel();
      root.querySelector("[data-qibla]").innerHTML = qiblaPanel();
    }, { signal });
    const tick = setInterval(() => {
      const box = root.querySelector("[data-prayer]");
      if (box) box.innerHTML = prayerPanel();
    }, 30_000);
    signal.addEventListener("abort", () => clearInterval(tick));
  },
};
