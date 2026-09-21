// Small SVG charts drawn from plain data — no library. Every mark carries a hover/focus tooltip, and every
// chart has a table view, so no value is only reachable by hovering.
//   columns()  bars over time (one series, or two stacked), optional goal line
//   parapet()  the whole plan as a row of Najdi rooftop crenellations, one triangle per week
import { esc } from "./dom.js";

const PAD = { top: 14, right: 16, bottom: 26, left: 34 };

// Round an axis maximum up to 1, 2 or 5 × 10ⁿ so ticks land on clean numbers.
function niceMax(v) {
  if (v <= 0) return 1;
  const p = 10 ** Math.floor(Math.log10(v));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}

// A column segment with a square foot; only the top of the whole stack gets the 4px rounded data-end.
function columnPath(x, y, w, h, rounded) {
  if (h <= 0) return "";
  if (!rounded) return `M${x},${y + h}V${y}H${x + w}V${y + h}Z`;
  const r = Math.min(4, w / 2, h);
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}

// Tooltip rows travel as data attributes: data-tip="Title" data-rows="value|label;value|label"
const tipAttrs = (title, rows) =>
  `data-tip="${esc(title)}" data-rows="${esc(rows.map(([v, label, cls = ""]) => `${v}|${label}|${cls}`).join(";"))}"`;

/**
 * columns({ label, data, series, goal, goalLabel, format, emptyText, tableHead, width, height })
 *   width/height: the size the chart is shown at, so axis text stays 12px instead of being scaled
 *   data:   [{ key, label (x-axis), title (tooltip), values: [n, n?] }]
 *   series: [{ name, cls }] — values stack bottom→top in this order ("" = accent, "deemph" = grey)
 */
export function columns({ label, data, series, goal, goalLabel, format = v => String(v), emptyText, tableHead, showTable, hideTable, width: W = 720, height: H = 200 }) {
  const totals = data.map(d => d.values.reduce((a, b) => a + b, 0));
  const max = niceMax(Math.max(goal ?? 0, ...totals));
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const slot = plotW / data.length;
  const barW = Math.max(2, Math.min(24, slot - 2)); // ≤ 24px thick, at least a 2px gap
  const y = v => PAD.top + plotH - (v / max) * plotH;
  const ticks = [0, max / 2, max];
  const labelEvery = data.length > 20 ? 7 : data.length > 10 ? 2 : 1;

  const grid = ticks.map(v => `
    <line class="grid" x1="${PAD.left}" x2="${W - PAD.right}" y1="${y(v)}" y2="${y(v)}"/>
    <text class="axis" x="${PAD.left - 6}" y="${y(v) + 4}" text-anchor="end">${esc(format(v))}</text>`).join("");

  const bars = data.map((d, i) => {
    const x = PAD.left + i * slot + (slot - barW) / 2;
    const lastFilled = d.values.findLastIndex(v => v > 0);
    let base = 0;
    const marks = d.values.map((v, s) => {
      const bottom = y(base);
      const top = y(base + v);
      // a 2px surface gap separates a segment from the one below it
      const gap = s > 0 && base > 0 ? 2 : 0;
      base += v;
      const path = columnPath(x, top, barW, bottom - top - gap, s === lastFilled);
      return path ? `<path class="bar ${series[s].cls}" d="${path}"/>` : "";
    }).join("");
    const rows = d.values.map((v, s) => [format(v), series[s].name, series[s].cls]);
    const xLabel = i % labelEvery === 0 || i === data.length - 1
      ? `<text class="axis" x="${x + barW / 2}" y="${H - 8}" text-anchor="middle">${esc(d.label)}</text>` : "";
    return `<g class="col" tabindex="0" ${tipAttrs(d.title, rows)}>
      <rect class="hit" x="${PAD.left + i * slot}" y="${PAD.top}" width="${slot}" height="${plotH}"/>${marks}</g>${xLabel}`;
  }).join("");

  const goalLine = goal ? `
    <line class="goal" x1="${PAD.left}" x2="${W - PAD.right}" y1="${y(goal)}" y2="${y(goal)}"/>
    <text class="goal-label" x="${W - PAD.right}" y="${y(goal) - 5}" text-anchor="end">${esc(goalLabel)}</text>` : "";

  const empty = totals.every(v => v === 0) && emptyText ? `<p class="chart-empty">${esc(emptyText)}</p>` : "";
  const legend = series.length > 1
    ? `<div class="chart-legend">${series.map(s => `<span><i class="${s.cls}"></i>${esc(s.name)}</span>`).join("")}</div>` : "";
  const table = `
    <details class="table-details">
      <summary><span class="when-closed">${esc(showTable)}</span><span class="when-open">${esc(hideTable)}</span></summary>
      <table class="data-table">
        <thead><tr>${tableHead.map((h, i) => `<th${i ? ' class="num"' : ""}>${esc(h)}</th>`).join("")}</tr></thead>
        <tbody>${data.map(d => `<tr><td>${esc(d.title)}</td>${d.values.map(v => `<td class="num">${esc(format(v))}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>
    </details>`;

  return `
    <figure class="chart" dir="ltr">
      ${legend}
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}">${grid}${goalLine}${bars}</svg>
      ${empty}
    </figure>${table}`;
}

/**
 * parapet({ weeks, label })
 *   weeks: [{ n, stage (1–6), state: "done" | "now" | "future", title, rows }]
 * Draws one crenellation per week; a small gap marks where each stage begins.
 */
export function parapet({ weeks, label, stageLabels }) {
  const PW = 1000;
  const TH = 18; // triangle height
  const GAP = 6;
  const stageBreaks = weeks.filter((w, i) => i > 0 && w.stage !== weeks[i - 1].stage).length;
  const tw = (PW - stageBreaks * GAP) / weeks.length;
  let x = 0;
  const starts = [];
  const tris = weeks.map((w, i) => {
    if (i > 0 && w.stage !== weeks[i - 1].stage) x += GAP;
    if (i === 0 || w.stage !== weeks[i - 1].stage) starts.push({ stage: w.stage, x });
    const d = `M${x.toFixed(1)},${TH}L${(x + tw / 2).toFixed(1)},1L${(x + tw).toFixed(1)},${TH}Z`;
    const el = `<path class="wk p${w.stage} ${w.state}" d="${d}" tabindex="0" ${tipAttrs(w.title, w.rows)}/>`;
    x += tw;
    return el;
  }).join("");
  const labels = stageLabels
    ? `<div class="parapet-labels">${starts.map(s => `<span style="left:${((s.x / PW) * 100).toFixed(2)}%">${esc(stageLabels[s.stage - 1])}</span>`).join("")}</div>`
    : "";
  return `
    <div class="parapet" dir="ltr">
      <svg viewBox="0 0 ${PW} ${TH + 5}" role="img" aria-label="${esc(label)}">${tris}<rect class="base" x="0" y="${TH}" width="${PW}" height="5"/></svg>
      ${labels}
    </div>`;
}

// One tooltip for the whole page, filled with textContent (never innerHTML). Shows on hover and keyboard focus.
export function attachTooltips(root) {
  const tip = document.createElement("div");
  tip.className = "tooltip";
  tip.hidden = true;
  tip.setAttribute("role", "tooltip");
  document.body.append(tip);

  const show = (el, x, y) => {
    tip.replaceChildren();
    for (const row of el.dataset.rows.split(";").filter(Boolean)) {
      const [value, name, cls] = row.split("|");
      const line = document.createElement("div");
      const key = document.createElement("span");
      key.className = `tip-key ${cls}`;
      const strong = document.createElement("b");
      strong.textContent = value;
      line.append(strong, key, document.createTextNode(name));
      tip.append(line);
    }
    const title = document.createElement("div");
    title.className = "tip-title";
    title.textContent = el.dataset.tip;
    tip.append(title);
    tip.hidden = false;
    const r = tip.getBoundingClientRect();
    tip.style.left = `${Math.min(window.innerWidth - r.width - 8, Math.max(8, x - r.width / 2))}px`;
    tip.style.top = `${Math.max(8, y - r.height - 14)}px`;
  };
  let focused = null; // a keyboard-focused mark keeps its tooltip, following it when the page scrolls
  const hide = () => (tip.hidden = true);
  const showFocused = () => {
    const r = focused.getBoundingClientRect();
    show(focused, r.left + r.width / 2, r.top);
  };

  root.addEventListener("pointermove", e => {
    const el = e.target.closest?.("[data-tip]");
    if (el) show(el, e.clientX, e.clientY);
    else if (!focused) hide();
  });
  root.addEventListener("pointerleave", () => focused || hide());
  root.addEventListener("focusin", e => {
    focused = e.target.closest?.("[data-tip]") ?? null;
    if (focused) showFocused();
    else hide();
  });
  root.addEventListener("focusout", () => {
    focused = null;
    hide();
  });
  window.addEventListener("scroll", () => (focused ? showFocused() : hide()), { passive: true });
}
