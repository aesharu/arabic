import * as D from "../deck.js";
import { S, LEVEL_NAMES } from "../deck.js";
import { $, esc, plural } from "../util.js";
import { loadLog, byDay, streaks, lastDays, maturityByLevel, fmtMinutes } from "../stats.js";
import { dayKey } from "../fsrs.js";

const GREETINGS = [
  [5, "صباح الخير", "ṣabāḥ al-khayr", "Good morning"],
  [12, "هلا والله", "halā wa-llāh", "Hey there"],
  [17, "مساء الخير", "masāʾ al-khayr", "Good evening"],
];
function greeting() {
  const h = new Date().getHours();
  const g = [...GREETINGS].reverse().find(([from]) => h >= from) || GREETINGS[2];
  return g;
}

export function levelBars(rows) {
  const pct = (n, t) => t ? (100 * n / t) : 0;
  return `<div class="levels">${rows.map(r => {
    const seen = r.learning + r.young + r.mature;
    const name = r.level ? `<b>${r.level}</b><span>${LEVEL_NAMES[r.level] || ""}</span>` : "<b>All cards</b>";
    return `<div class="level-row"><div class="name">${name}</div>
      <div class="stack" role="img" aria-label="${r.level || "All"}: ${r.mature} mature, ${r.young} young, ${r.learning} learning, ${r.new} not started">
        ${r.mature ? `<i style="width:${pct(r.mature, r.total)}%;background:var(--q3)" title="Mature: ${r.mature}"></i>` : ""}
        ${r.young ? `<i style="width:${pct(r.young, r.total)}%;background:var(--q2)" title="Young: ${r.young}"></i>` : ""}
        ${r.learning ? `<i style="width:${pct(r.learning, r.total)}%;background:var(--q1)" title="Learning: ${r.learning}"></i>` : ""}
      </div><div class="pct">${seen.toLocaleString()} / ${r.total.toLocaleString()}</div></div>`;
  }).join("")}</div>
  <div class="legend"><span><i class="key q3"></i>Mature (21+ days)</span><span><i class="key q2"></i>Young</span><span><i class="key q1"></i>Learning</span><span><i class="key q0"></i>Not started</span></div>`;
}

export async function render(root) {
  const Q = D.queues();
  const due = Q.fresh.length + Q.learn.length + Q.review.length;
  const log = await loadLog();
  const days = byDay(log);
  const st = streaks(days);
  const today = days.get(dayKey()) || { n: 0, ms: 0 };
  const goal = today.n + due;
  const pct = goal ? today.n / goal : 1;
  const week = lastDays(days, 7);
  const [, ar, tr, en] = greeting();
  const mins = Math.max(1, Math.round(due * 0.25 + Q.fresh.length * 0.15));
  const known = D.wordsKnown();

  // Themes you're partway through (or next up), in course order
  const themeProgress = S.themes.map(t => {
    const started = t.notes.filter(n => D.noteStatus(n) !== "new").length;
    return { t, started, total: t.notes.length };
  });
  const nextThemes = [...themeProgress.filter(x => x.started && x.started < x.total), ...themeProgress.filter(x => !x.started)].slice(0, 3);

  root.innerHTML = `<div class="page">
    <div class="page-head"><div>
      <div class="hello"><span class="ar">${ar}</span><small>${tr} · ${en}</small></div>
      <h1>Today</h1></div></div>

    <div class="today">
      <section class="panel session">
        <div class="big-count">${due ? plural(due, "card") : "All caught up"}<small>${due ? `due today · about ${mins} min` : today.n ? `You studied ${plural(today.n, "card")} today. أحسنت!` : "Nothing due right now"}</small></div>
        <div class="qcounts">
          <div class="qcount"><b>${Q.fresh.length}</b><span><i class="key new"></i>New</span></div>
          <div class="qcount"><b>${Q.learn.length}</b><span><i class="key learn"></i>Learning</span></div>
          <div class="qcount"><b>${Q.review.length}</b><span><i class="key review"></i>Review</span></div>
        </div>
        <div class="session-actions">
          <button class="btn primary big" id="startBtn" ${due ? "" : "disabled"}>${today.n && due ? "Continue" : "Start studying"} <kbd>Space</kbd></button>
          ${[...S.user.values()].some(u => u.star) ? `<button class="btn ghost" id="starredBtn">Review starred</button>` : ""}
        </div>
      </section>

      <section class="panel">
        <div class="ring-wrap">
          <svg class="ring" viewBox="0 0 120 120" role="img" aria-label="${Math.round(pct * 100)}% of today's cards done">
            <circle class="track" cx="60" cy="60" r="50"/>
            <circle class="fill" cx="60" cy="60" r="50" stroke-dasharray="${2 * Math.PI * 50}" stroke-dashoffset="${2 * Math.PI * 50 * (1 - pct)}" transform="rotate(-90 60 60)"/>
            <text x="60" y="62" text-anchor="middle">${Math.round(pct * 100)}%</text>
            <text x="60" y="80" text-anchor="middle" class="ring-sub">${today.n} of ${goal}</text>
          </svg>
          <div class="facts">
            <div class="fact"><b>${plural(st.current, "day")}</b><span>streak${st.best > st.current ? ` · best ${st.best}` : ""}</span></div>
            <div class="fact"><b>${known.toLocaleString()}</b><span>of ${S.notes.length.toLocaleString()} words learned</span></div>
            <div class="fact"><b>${fmtMinutes(today.ms)}</b><span>studied today</span></div>
          </div>
        </div>
        <div class="week" aria-label="Last 7 days">${week.map((d, i) => {
          const date = new Date(d.t);
          return `<div><i class="${d.d ? "on" : ""} ${i === 6 ? "today" : ""}" title="${date.toDateString()}: ${d.d ? plural(d.d.n, "card") : "no study"}">${date.getDate()}</i>${date.toLocaleDateString(undefined, { weekday: "narrow" })}</div>`;
        }).join("")}</div>
      </section>
    </div>

    <h2 class="section-title">Your progress</h2>
    <section class="panel">${levelBars(maturityByLevel())}</section>

    ${nextThemes.length ? `<h2 class="section-title">Pick up a theme</h2>
    <div class="next-themes">${nextThemes.map(({ t, started, total }) => themeCard(t, started, total)).join("")}</div>` : ""}
  </div>`;

  $("#startBtn", root)?.addEventListener("click", () => window.app.go("study"));
  $("#starredBtn", root)?.addEventListener("click", () => window.app.go("study", { focus: { starred: true, label: "Starred words" } }));
  root.querySelectorAll("[data-theme-id]").forEach(b => b.addEventListener("click", () => {
    const t = S.themes.find(x => x.id === b.dataset.themeId);
    window.app.go("study", { focus: { theme: t.id, label: t.name } });
  }));
}

export function themeCard(t, started, total) {
  const words = t.notes.slice(0, 3).map(n => n.fields.Arabic).filter(Boolean).join(" · ");
  const known = t.notes.filter(n => ["young", "mature"].includes(D.noteStatus(n))).length;
  const learning = started - known;
  return `<button class="theme" data-theme-id="${esc(t.id)}">
    <div class="t-top"><span class="t-name">${esc(t.name)}</span><span class="t-id">${esc(t.id)}</span></div>
    <div class="t-sample">${esc(words)}</div>
    <div class="stack" aria-hidden="true">${known ? `<i style="width:${100 * known / total}%;background:var(--q3)"></i>` : ""}${learning ? `<i style="width:${100 * learning / total}%;background:var(--q1)"></i>` : ""}</div>
    <div class="t-foot"><span>${started ? `${started} of ${total} started` : `${plural(total, "word")}`}</span><span>${t.level || ""}</span></div>
  </button>`;
}

export function onKey(e) {
  if (e.key === " " && !e.metaKey && !e.ctrlKey) {
    const b = document.getElementById("startBtn");
    if (b && !b.disabled) { e.preventDefault(); b.click(); }
  }
}
