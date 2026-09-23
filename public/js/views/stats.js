// Stats — Volodymyr's own page, behind the stats password: everything Dima has done on the site.
// When she came in, how long she stayed, which day the special greeting found her, every word she recorded
// and every correction she suggested. The password is checked by the server (the Worker secret STATS_PASS),
// so the number is nowhere in this site's code.
//   #/stats
import { t, tu, tx, num, locale } from "../core/i18n.js";
import { esc, ar, pageHead } from "../core/dom.js";
import { icon } from "../core/art.js";
import { columns } from "../core/charts.js";
import * as store from "../core/store.js";
import { fetchStats, summarize, saudiDay, eventsOn } from "../core/activity.js";
import { HOLIDAYS } from "../data/holidays.js";

const PASS_KEY = "najdi-stats"; // kept for this browser session only, so it asks again tomorrow
const remembered = () => {
  try {
    return sessionStorage.getItem(PASS_KEY) ?? "";
  } catch {
    return "";
  }
};
const remember = pass => {
  try {
    pass ? sessionStorage.setItem(PASS_KEY, pass) : sessionStorage.removeItem(PASS_KEY);
  } catch {}
};

const LABEL = { ar: "edit.ar", say: "edit.say", ua: "edit.ua", en: "edit.en", najdi: "edit.najdiUi" };
const RTL = new Set(["ar", "najdi"]);
const cell = (f, text) => (RTL.has(f) ? ar(text) : esc(text));

// Saudi time, so the day and the hour are the ones Dima was living.
const clock = at => new Date(at).toLocaleTimeString(locale(), { timeZone: "Asia/Riyadh", hour: "numeric", minute: "2-digit" });
const dayLong = day => new Date(`${day}T12:00:00Z`).toLocaleDateString(locale(), { timeZone: "UTC", weekday: "long", day: "numeric", month: "long", year: "numeric" });
const dayShort = day => new Date(`${day}T12:00:00Z`).toLocaleDateString(locale(), { timeZone: "UTC", day: "numeric", month: "short" });

// "3 hours ago", "yesterday" — in the interface language.
function ago(at, now) {
  const rtf = new Intl.RelativeTimeFormat(locale(), { numeric: "auto" });
  const mins = Math.round((at - now) / 60000);
  if (Math.abs(mins) < 60) return rtf.format(mins, "minute");
  const hours = Math.round(mins / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
  return rtf.format(Math.round(hours / 24), "day");
}

const hm = minutes => (minutes >= 60 ? `${num(Math.floor(minutes / 60))} ${tu("unit.hours", Math.floor(minutes / 60))} ${num(minutes % 60)} ${tu("unit.minutes", minutes % 60)}` : `${num(minutes)} ${tu("unit.minutes", minutes)}`);
const tile = (label, value, unit = "", cls = "") =>
  `<div class="stat${cls ? " " + cls : ""}"><dt>${esc(label)}</dt><dd>${value}${unit ? ` <small>${esc(unit)}</small>` : ""}</dd></div>`;

const holidayName = id => {
  const h = HOLIDAYS.find(x => x.id === id);
  return h ? tx(h.name) : id;
};

// One thing she did, as a line: the time, what it was, and the word or the correction itself.
function eventLine(e) {
  const when = `<span class="sx-time">${esc(clock(e.at))}</span>`;
  const word = e.detail?.text ? ar(e.detail.text) : `<span class="muted">${esc(t("stats.aWord"))}</span>`;
  if (e.kind === "visit") return `<li class="sx-ev is-visit">${when}${icon("today")}<span>${esc(t("stats.evVisit"))}</span></li>`;
  if (e.kind === "holiday") return `<li class="sx-ev is-holiday">${when}${icon("star")}<span>${esc(t("stats.evHoliday", { day: holidayName(e.detail?.holiday) }))}</span></li>`;
  if (e.kind === "withdraw") return `<li class="sx-ev">${when}${icon("undo")}<span>${esc(t("stats.evWithdraw"))}</span></li>`;
  if (e.kind === "correct") {
    const rows = Object.keys(e.detail?.data ?? {}).filter(f => f !== "checked").map(f =>
      `<tr><th>${t(LABEL[f] ?? f)}</th><td class="sx-was">${cell(f, e.detail.before?.[f] ?? "") || "—"}</td>
       <td aria-hidden="true">→</td><td class="sx-now">${cell(f, e.detail.data[f])}</td></tr>`).join("");
    return `<li class="sx-ev is-correct">${when}${icon("pencil")}
      <div><span>${esc(t("stats.evCorrect"))}</span>
      ${rows ? `<table class="sx-table"><tbody>${rows}</tbody></table>` : ""}
      ${e.detail?.data?.checked ? `<p class="sx-checked">${icon("check")} ${esc(t("review.checked"))}</p>` : ""}</div></li>`;
  }
  const KIND = { record: "stats.evRecord", rerecord: "stats.evRerecord", unrecord: "stats.evUnrecord", restore: "stats.evRestore" };
  const name = KIND[e.kind];
  if (!name) return "";
  return `<li class="sx-ev is-rec">${when}${icon(e.kind === "unrecord" ? "trash" : "mic")}<span>${esc(t(name))} ${word}</span></li>`;
}

function dayCard(d, events) {
  const list = eventsOn(events, d.day);
  return `<li class="panel sx-day">
    <div class="sx-day-head">
      <h3>${esc(dayLong(d.day))}</h3>
      <p class="muted">${esc(`${num(d.opens)} ${tu("stats.visits", d.opens)}`)} · ${esc(hm(d.minutes))}
        ${d.opens ? ` · ${esc(t("stats.between", { from: clock(d.first), to: clock(d.last) }))}` : ""}</p>
    </div>
    ${list.length ? `<ul class="sx-events">${list.map(eventLine).join("")}</ul>` : ""}
  </li>`;
}

function board(data, root, render) {
  const s = summarize(data, "teacher");
  const today = saudiDay(data.now);
  // The last 28 days, so an empty stretch shows as clearly as a busy one.
  const window28 = Array.from({ length: 28 }, (_, i) => {
    const at = Date.parse(`${today}T12:00:00Z`) - (27 - i) * 86400000;
    return new Date(at).toISOString().slice(0, 10);
  });
  const byDay = Object.fromEntries(s.days.map(d => [d.day, d]));
  const chart = columns({
    label: t("progress.minutesDay"),
    data: window28.map(day => ({ label: dayShort(day), title: dayLong(day), values: [byDay[day]?.minutes ?? 0] })),
    series: [{ name: t("progress.minutes"), cls: "" }],
    emptyText: t("progress.empty"),
    tableHead: [t("progress.date"), t("progress.minutes")],
    showTable: t("progress.showTable"),
    hideTable: t("progress.hideTable"),
    width: 1180,
    height: 220,
  });
  const shown = s.days.filter(d => d.opens > 0 || d.minutes > 0).slice(0, 60);

  root.innerHTML = `
    ${pageHead(t("stats.title"), esc(t("stats.sub")), "", "", "majlis")}
    <p class="callout sx-note">${icon("lock")} ${esc(t("stats.onlyYou"))} <span class="muted">${esc(t("stats.saudiTime"))}</span></p>
    <dl class="stats-row">
      ${tile(t("stats.lastSeen"), s.lastSeen ? esc(ago(s.lastSeen, data.now)) : esc(t("stats.never")), s.lastSeen ? clock(s.lastSeen) : "", "hero sx-last")}
      ${tile(t("stats.streakNow"), num(s.current), tu("unit.days", s.current))}
      ${tile(t("stats.streakBest"), num(s.longest), tu("unit.days", s.longest))}
      ${tile(t("stats.daysHere"), num(s.activeDays), tu("unit.days", s.activeDays))}
      ${tile(t("stats.timeTotal"), num(Math.round((s.minutes / 60) * 10) / 10, 1), tu("unit.hours", Math.round(s.minutes / 60)))}
      ${tile(t("stats.opensTotal"), num(s.opens), tu("stats.visits", s.opens))}
      ${tile(t("stats.recordedN"), num(s.recordings + s.rerecordings))}
      ${tile(t("stats.correctedN"), num(s.corrections))}
      ${tile(t("stats.holidaysN"), num(s.holidays))}
    </dl>

    <section class="panel wide">
      <div class="panel-head"><h2>${esc(t("progress.minutesDay"))}</h2></div>
      ${chart}
    </section>

    <section>
      <div class="panel-head"><h2>${esc(t("stats.dayByDay"))}</h2>
        <button type="button" class="btn btn-ghost" data-refresh>${icon("redo")} ${esc(t("stats.refresh"))}</button></div>
      ${shown.length ? `<ul class="sx-days">${shown.map(d => dayCard(d, s.events)).join("")}</ul>` : `<p class="callout">${esc(t("stats.noneYet"))}</p>`}
    </section>

    <p class="sx-foot"><button type="button" class="btn btn-ghost" data-lock>${icon("lock")} ${esc(t("stats.lockAgain"))}</button></p>`;

  root.querySelector("[data-refresh]")?.addEventListener("click", () => render(remembered()));
  root.querySelector("[data-lock]")?.addEventListener("click", () => {
    remember("");
    render(null);
  });
}

function lockScreen(root, render, message = "") {
  root.innerHTML = `
    ${pageHead(t("stats.title"), esc(t("stats.sub")), "", "", "majlis")}
    <form class="panel sx-lock">
      <p class="sx-lock-icon" aria-hidden="true">${icon("lock")}</p>
      <h2>${esc(t("stats.lockTitle"))}</h2>
      <p class="muted">${esc(t("stats.lockHint"))}</p>
      <label class="sx-field"><span class="visually-hidden">${esc(t("stats.password"))}</span>
        <input type="password" name="pass" inputmode="numeric" autocomplete="off" placeholder="${esc(t("stats.password"))}" required></label>
      <button type="submit" class="btn">${esc(t("stats.unlock"))}</button>
      <p class="editor-msg" aria-live="polite">${esc(message)}</p>
    </form>`;
  const form = root.querySelector("form");
  form.querySelector("input").focus({ preventScroll: true });
  form.addEventListener("submit", e => {
    e.preventDefault();
    render(form.querySelector("input").value.trim());
  });
}

export default {
  titleKey: "stats.title",
  mount(root, { signal }) {
    if (store.isTeacher()) {
      location.replace("#/today"); // her own page never shows what the site noticed about her
      return;
    }
    const render = async pass => {
      if (signal.aborted) return;
      if (!pass) return lockScreen(root, render);
      root.innerHTML = `${pageHead(t("stats.title"), esc(t("stats.sub")), "", "", "majlis")}<p class="callout">${icon("cloud")} …</p>`;
      try {
        const data = await fetchStats(pass);
        if (signal.aborted) return;
        remember(pass);
        board(data, root, render);
      } catch (err) {
        if (signal.aborted) return;
        remember("");
        lockScreen(root, render, t(err.reason === "password" ? "stats.wrong" : err.reason === "off" ? "stats.notSet" : "stats.error"));
      }
    };
    render(remembered());
  },
};
