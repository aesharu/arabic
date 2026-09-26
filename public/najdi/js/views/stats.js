import * as D from "../deck.js";
import { S, TYPES } from "../deck.js";
import { $, esc, plural } from "../util.js";
import { dayKey, dayStart, DAY } from "../fsrs.js";
import * as st from "../stats.js";
import { columns, line, sparkline, tableTwin, responsive, tooltip } from "../charts.js";
import { levelBars } from "./today.js";

const RANGES = [[7, "7 days"], [30, "30 days"], [90, "3 months"], [Infinity, "All time"]];
let range = 30, month = null, cleanups = [];

const shortDate = t => new Date(t).toLocaleDateString(undefined, { month: "short", day: "numeric" });
const longDate = t => new Date(t).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
const SERIES = [
  { key: "new", label: "New", color: "var(--new)" },
  { key: "learn", label: "Learning", color: "var(--learn)" },
  { key: "review", label: "Review", color: "var(--review)" },
];

export function leave() { cleanups.forEach(f => f()); cleanups = []; }

export async function render(root) {
  leave();
  const log = await st.loadLog();
  const days = st.byDay(log);
  const now = Date.now();
  const span = range === Infinity ? st.spanDays(log, now) : range;
  const win = st.lastDays(days, span, now);
  const from = win[0].t;
  const sum = win.reduce((a, { d }) => {
    if (!d) return a;
    a.n += d.n; a.ms += d.ms; a.review += d.review; a.pass += d.pass; a.studied++;
    d.grades.forEach((g, i) => a.grades[i] += g);
    return a;
  }, { n: 0, ms: 0, review: 0, pass: 0, studied: 0, grades: [0, 0, 0, 0] });
  const streak = st.streaks(days, now);
  const known = D.wordsKnown();
  const words = st.wordsLearnedSeries(log, span, now);
  const fc = st.forecast(31, now);
  const retention = sum.review ? Math.round(100 * sum.pass / sum.review) : null;
  month ??= { y: new Date().getFullYear(), m: new Date().getMonth() };

  root.innerHTML = `<div class="page">
    <div class="page-head"><div><h1>Progress</h1><p>${log.length ? `${plural(log.length, "answer")} since ${new Date(Math.min(...log.map(r => r.t))).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}` : "Your charts fill in as you study."}</p></div>
      <div class="seg" id="rangeSeg" aria-label="Time range">${RANGES.map(([v, l]) => `<button data-range="${v}" aria-pressed="${range === v}">${l}</button>`).join("")}</div>
    </div>

    <div class="kpis">
      <div class="kpi hero-kpi"><div><div class="label">Words learned</div><div class="value">${known.toLocaleString()}<small>/ ${S.notes.length.toLocaleString()}</small></div>
        <div class="delta">${words.length > 1 ? `+${(words.at(-1).value - words[0].value).toLocaleString()} in ${RANGES.find(r => r[0] === range)[1].toLowerCase()}` : ""}</div></div><div id="spark"></div></div>
      <div class="kpi"><div class="label">Streak</div><div class="value">${streak.current}<small>${streak.current === 1 ? "day" : "days"}</small></div><div class="delta">Best ${plural(streak.best, "day")}${!streak.studiedToday && streak.current ? " · study today to keep it" : ""}</div></div>
      <div class="kpi"><div class="label">Remembered</div><div class="value">${retention === null ? "–" : retention + "<small>%</small>"}</div><div class="delta">of reviews · goal ${Math.round(S.settings.retention * 100)}%</div></div>
      <div class="kpi"><div class="label">Answers</div><div class="value">${sum.n.toLocaleString()}</div><div class="delta">${sum.studied ? `${Math.round(sum.n / sum.studied)} per study day` : "none yet"}</div></div>
      <div class="kpi"><div class="label">Study time</div><div class="value">${st.fmtMinutes(sum.ms)}</div><div class="delta">${sum.studied ? `${st.fmtMinutes(sum.ms / sum.studied)} per study day` : "–"}</div></div>
      <div class="kpi"><div class="label">Days studied</div><div class="value">${sum.studied}<small>/ ${span}</small></div><div class="delta">${span ? Math.round(100 * sum.studied / span) : 0}% of days</div></div>
      <div class="kpi"><div class="label">Due tomorrow</div><div class="value">${fc[1].toLocaleString()}</div><div class="delta">${fc[0] ? `${fc[0]} still due today` : "today is clear"}</div></div>
    </div>

    <div class="grid-2" style="margin-top:16px">
      <section class="panel"><div class="calendar" id="calendar"></div></section>
      <section class="panel"><div class="panel-head"><div><h2>Cards per day</h2><div class="sub">What you answered, by kind of card</div></div></div>
        <div class="legend" style="margin:0 0 10px">${SERIES.map(s => `<span><i class="key ${s.key}"></i>${s.label}</span>`).join("")}</div>
        <div id="perDay" data-label="Cards answered per day"></div></section>
    </div>

    <div class="grid-2" style="margin-top:16px">
      <section class="panel"><div class="panel-head"><div><h2>Words learned</h2><div class="sub">Running total</div></div></div><div id="wordsLine" data-label="Words learned over time"></div></section>
      <section class="panel"><div class="panel-head"><div><h2>Coming up</h2><div class="sub">Cards due over the next 30 days</div></div></div><div id="forecast" data-label="Cards due per day, next 30 days"></div></section>
    </div>

    <div class="grid-2" style="margin-top:16px">
      <section class="panel"><div class="panel-head"><div><h2>By level</h2><div class="sub">Every card, by how well you know it</div></div></div>${levelBars(st.maturityByLevel())}</section>
      <section class="panel"><div class="panel-head"><div><h2>Remembered by card type</h2><div class="sub">Reviews in this period that weren’t “Again”</div></div></div>
        <div class="hbars" id="byType"></div>
        <h2 style="margin-top:22px;font-size:15px">Your answers</h2><div class="hbars" id="grades" style="margin-top:12px"></div></section>
    </div>

    <section class="panel" style="margin-top:16px"><div class="panel-head"><div><h2>Trickiest words</h2><div class="sub">The ones you’ve forgotten most. Open one to add a note or listen again.</div></div></div>
      <div class="hard-list" id="hard"></div></section>
  </div>`;

  $("#rangeSeg", root).addEventListener("click", e => {
    const b = e.target.closest("[data-range]"); if (!b) return;
    range = b.dataset.range === "Infinity" ? Infinity : +b.dataset.range;
    render(root);
  });

  // Hero sparkline: running total of words learned
  $("#spark", root).append(sparkline(words.slice(-30).map(p => p.value)));

  renderCalendar(root, days);

  // Cards per day (weekly buckets for long ranges)
  const perDay = $("#perDay", root);
  let rows;
  if (win.length > 120) {
    rows = [];
    for (let i = 0; i < win.length; i += 7) {
      const chunk = win.slice(i, i + 7), v = { new: 0, learn: 0, review: 0 };
      for (const { d } of chunk) if (d) { v.new += d.new; v.learn += d.learn; v.review += d.review; }
      rows.push({ label: shortDate(chunk[0].t), title: `Week of ${shortDate(chunk[0].t)}`, values: v });
    }
  } else {
    rows = win.map(({ t, d }) => ({ label: shortDate(t), title: longDate(t), values: d ? { new: d.new, learn: d.learn, review: d.review } : {} }));
  }
  cleanups.push(responsive(perDay, () => columns(perDay, { rows, series: SERIES, height: 210 })));
  perDay.append(tableTwin(["Day", "New", "Learning", "Review"], rows.filter(r => Object.values(r.values).some(Boolean)).map(r => [r.title, r.values.new || 0, r.values.learn || 0, r.values.review || 0])));

  // Words learned line
  const wl = $("#wordsLine", root);
  const pts = words.map(p => ({ label: shortDate(p.t), title: longDate(p.t), value: p.value }));
  cleanups.push(responsive(wl, () => line(wl, { points: pts, color: "var(--new)", unit: "words", height: 200 })));
  wl.append(tableTwin(["Day", "Words learned"], pts.filter((p, i) => i === 0 || p.value !== pts[i - 1].value).map(p => [p.title, p.value])));

  // Forecast
  const fEl = $("#forecast", root);
  const frows = fc.slice(0, 30).map((n, i) => {
    const t = dayStart(now) + i * DAY + 2 * 3600e3;
    return { label: i === 0 ? "Today" : shortDate(t), title: i === 0 ? "Today (incl. overdue)" : longDate(t), values: { due: n } };
  });
  cleanups.push(responsive(fEl, () => columns(fEl, { rows: frows, series: [{ key: "due", label: "due", color: "var(--review)" }], height: 200 })));
  fEl.append(tableTwin(["Day", "Due"], frows.map(r => [r.title, r.values.due])));

  // Retention by type
  const rt = st.retentionByType(log, from);
  const typeRows = Object.keys(TYPES).filter(t => rt[t]?.n);
  $("#byType", root).innerHTML = typeRows.length ? typeRows.map(t => {
    const p = Math.round(100 * rt[t].pass / rt[t].n);
    return `<div class="hbar"><span>${TYPES[t].label}</span><div class="track"><i style="width:${p}%"></i></div><span class="v">${p}% <span class="muted">of ${rt[t].n}</span></span></div>`;
  }).join("") : `<p class="muted" style="margin:0">Shows up once cards come back for review.</p>`;
  const gTotal = sum.grades.reduce((a, b) => a + b, 0);
  $("#grades", root).innerHTML = ["Again", "Hard", "Good", "Easy"].map((g, i) => {
    const p = gTotal ? Math.round(100 * sum.grades[i] / gTotal) : 0;
    return `<div class="hbar"><span>${g}</span><div class="track"><i style="width:${p}%"></i></div><span class="v">${p}% <span class="muted">${sum.grades[i]}</span></span></div>`;
  }).join("");

  // Trickiest words
  const hard = st.hardestWords(8);
  $("#hard", root).innerHTML = hard.length ? hard.map(({ note, lapses }) => `<button class="hard-row" style="border-left:0;border-right:0;border-bottom:0;background:none;text-align:left;width:100%" data-open="${esc(note.guid)}">
      <span><b>${esc(note.kind === "vocab" ? note.fields.English : note.fieldNames[0])}</b> <small>${esc(note.fields.Transliteration || "")}</small></span>
      ${note.kind === "vocab" ? `<span class="ar">${esc(note.fields.Arabic)}</span>` : "<span></span>"}<small>forgot ${lapses}×</small></button>`).join("")
    : `<p class="muted" style="margin:0">Nothing yet. Words you forget will show up here.</p>`;
  $("#hard", root).addEventListener("click", e => {
    const b = e.target.closest("[data-open]");
    if (b) window.app.go("browse", { select: b.dataset.open });
  });
}

function renderCalendar(root, days) {
  const box = $("#calendar", root);
  const { y, m } = month;
  const first = new Date(y, m, 1), daysIn = new Date(y, m + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7;   // weeks start on Monday
  const todayKey = dayKey();
  const all = [...days.values()].map(d => d.n);
  const max = Math.max(1, ...all);
  const q = [0.25, 0.5, 0.75].map(f => Math.ceil(max * f));
  const level = n => !n ? 0 : n <= q[0] ? 1 : n <= q[1] ? 2 : n <= q[2] ? 3 : 4;
  let studied = 0, cards = 0, ms = 0;
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(`<span class="cal-day out" aria-hidden="true"></span>`);
  for (let d = 1; d <= daysIn; d++) {
    const date = new Date(y, m, d, 12);
    const k = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const info = days.get(k);
    if (info) { studied++; cards += info.n; ms += info.ms; }
    const future = k > todayKey;
    const label = `${date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}: ${info ? `${plural(info.n, "card")}, ${st.fmtMinutes(info.ms)}` : future ? "upcoming" : "no study"}`;
    cells.push(`<button class="cal-day ${future ? "future" : "l" + level(info?.n)} ${k === todayKey ? "today" : ""}" data-k="${k}" aria-label="${esc(label)}">
      <span>${d}</span>${info ? `<span class="c">${info.n}</span>` : ""}</button>`);
  }
  const monthName = first.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const now = new Date();
  const atCurrent = y === now.getFullYear() && m === now.getMonth();
  box.innerHTML = `<div class="cal-head"><div><h2 style="font-size:16px">Study calendar</h2><b>${monthName}</b></div>
      <div style="display:flex;gap:6px"><button class="icon-btn" data-cal="-1" aria-label="Previous month"><svg viewBox="0 0 16 16"><path d="M10 3L5 8l5 5"/></svg></button>
      <button class="icon-btn" data-cal="1" aria-label="Next month" ${atCurrent ? "disabled style='opacity:.35'" : ""}><svg viewBox="0 0 16 16"><path d="M6 3l5 5-5 5"/></svg></button></div></div>
    <div class="cal-grid">${["M", "T", "W", "T", "F", "S", "S"].map(d => `<span class="cal-dow" aria-hidden="true">${d}</span>`).join("")}${cells.join("")}</div>
    <div class="cal-scale" aria-hidden="true">Less <i></i><i class="l1"></i><i class="l2"></i><i class="l3"></i><i class="l4"></i> More</div>
    <div class="cal-summary"><span><b>${studied}</b>days studied</span><span><b>${cards.toLocaleString()}</b>cards</span><span><b>${st.fmtMinutes(ms)}</b>time</span></div>`;
  box.style.position = "relative";
  const tip = tooltip(box);
  box.querySelectorAll(".cal-day[data-k]").forEach(c => {
    const show = () => {
      const info = days.get(c.dataset.k);
      const r = c.getBoundingClientRect(), br = box.getBoundingClientRect();
      const [yy, mm, dd] = c.dataset.k.split("-").map(Number);
      tip.show(r.left - br.left + r.width / 2, r.top - br.top, new Date(yy, mm - 1, dd).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" }),
        info ? [{ value: info.n, label: "cards" }, { value: st.fmtMinutes(info.ms), label: "studied" }, ...(info.review ? [{ value: Math.round(100 * info.pass / info.review) + "%", label: "remembered" }] : [])]
             : [{ value: "–", label: c.classList.contains("future") ? "upcoming" : "no study" }]);
    };
    c.addEventListener("pointerenter", show); c.addEventListener("focus", show);
    c.addEventListener("pointerleave", tip.hide); c.addEventListener("blur", tip.hide);
  });
  box.querySelectorAll("[data-cal]").forEach(b => b.addEventListener("click", () => {
    if (b.disabled) return;
    const d = new Date(month.y, month.m + +b.dataset.cal, 1);
    month = { y: d.getFullYear(), m: d.getMonth() };
    renderCalendar(root, days);
  }));
}
