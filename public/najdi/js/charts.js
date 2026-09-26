// Small SVG chart kit: stacked columns, single-series line/area, sparkline.
// Thin marks, 2px surface gaps, hairline grid, hover + keyboard tooltips, and a table twin for every chart.
const NS = "http://www.w3.org/2000/svg";
const el = (tag, attrs = {}, parent) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  parent?.append(n);
  return n;
};

export function niceScale(max, count = 4) {
  if (!(max > 0)) max = 1;
  const raw = max / count, p = 10 ** Math.floor(Math.log10(raw));
  const step = Math.max(1, [1, 2, 5, 10].map(m => m * p).find(s => s >= raw));
  const top = Math.ceil(max / step) * step, ticks = [];
  for (let v = 0; v <= top + 1e-9; v += step) ticks.push(v);
  return { top, ticks };
}
const fmtTick = v => v >= 1000 ? (v / 1000).toFixed(v % 1000 ? 1 : 0) + "k" : String(v);

// Column path with 4px rounded top, square at the baseline
function colPath(x, y, w, h, r) {
  r = Math.min(r, w / 2, h);
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}

export function tooltip(root) {
  let t = root.querySelector(".tooltip");
  if (!t) { t = document.createElement("div"); t.className = "tooltip"; t.hidden = true; root.append(t); }
  return {
    show(x, y, title, rows) {
      t.replaceChildren();
      const h = document.createElement("div"); h.className = "t-title"; h.textContent = title; t.append(h);
      for (const r of rows) {
        const row = document.createElement("div"); row.className = "t-row";
        if (r.color) { const k = document.createElement("i"); k.className = "t-key"; k.style.background = r.color; row.append(k); }
        const b = document.createElement("b"); b.textContent = r.value; row.append(b);
        if (r.label) { const s = document.createElement("span"); s.textContent = r.label; row.append(s); }
        t.append(row);
      }
      t.hidden = false;
      const w = root.clientWidth, tw = t.offsetWidth;
      t.style.left = Math.max(tw / 2, Math.min(w - tw / 2, x)) + "px";
      t.style.top = y + "px";
    },
    hide() { t.hidden = true; },
  };
}

export function tableTwin(headers, rows) {
  const d = document.createElement("details");
  d.className = "table-toggle";
  const s = document.createElement("summary"); s.textContent = "Show as table"; d.append(s);
  const wrap = document.createElement("div"); wrap.className = "table-wrap";
  const t = document.createElement("table");
  const tr = document.createElement("tr");
  for (const h of headers) { const th = document.createElement("th"); th.textContent = h; tr.append(th); }
  const thead = document.createElement("thead"); thead.append(tr); t.append(thead);
  const tb = document.createElement("tbody");
  for (const r of rows) {
    const row = document.createElement("tr");
    for (const c of r) { const td = document.createElement("td"); td.textContent = c; row.append(td); }
    tb.append(row);
  }
  t.append(tb); wrap.append(t); d.append(wrap);
  return d;
}

/**
 * Stacked columns. rows: [{ label, title, values: { key: n } }], series: [{ key, label, color }]
 */
export function columns(root, { rows, series, height = 200 }) {
  root.classList.add("chart");
  root.querySelector("svg")?.remove();
  const W = Math.max(240, root.clientWidth), H = height;
  const padL = 30, padR = 4, padT = 8, padB = 22;
  const iw = W - padL - padR, ih = H - padT - padB;
  const totals = rows.map(r => series.reduce((a, s) => a + (r.values[s.key] || 0), 0));
  const { top, ticks } = niceScale(Math.max(1, ...totals));
  const y = v => padT + ih - (v / top) * ih;
  const band = iw / rows.length, bw = Math.max(2, Math.min(24, band - 2));
  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, height: H, role: "img", "aria-label": root.dataset.label || "Column chart" });
  for (const t of ticks) {
    el("line", { x1: padL, x2: W - padR, y1: y(t), y2: y(t), class: t === 0 ? "baseline" : "gridline" }, svg);
    el("text", { x: padL - 8, y: y(t) + 4, "text-anchor": "end", class: "tick" }, svg).textContent = fmtTick(t);
  }
  const every = Math.max(1, Math.ceil(46 / band));
  const hover = el("rect", { class: "hover-band", y: padT, height: ih, width: band, opacity: 0 }, svg);
  const tip = tooltip(root);
  rows.forEach((r, i) => {
    const x = padL + i * band + (band - bw) / 2;
    let acc = 0;
    const segs = series.map(s => ({ s, v: r.values[s.key] || 0 })).filter(x => x.v > 0);
    segs.forEach(({ s, v }, j) => {
      const y1 = y(acc + v), h = y(acc) - y1;
      if (j === segs.length - 1) el("path", { d: colPath(x, y1, bw, h, 4), fill: s.color }, svg);
      else el("rect", { x, y: y1, width: bw, height: h, fill: s.color }, svg);
      if (j > 0) el("rect", { x, y: y(acc) - 1, width: bw, height: 2, fill: "var(--surface)" }, svg);  // 2px surface gap
      acc += v;
    });
    // Label every Nth column plus the last one, skipping any that would collide with the last
    const isLast = i === rows.length - 1;
    if (isLast || (i % every === 0 && rows.length - 1 - i >= Math.ceil(every / 2))) {
      el("text", { x: padL + i * band + band / 2, y: H - 6, "text-anchor": isLast && every > 1 ? "end" : "middle", class: "tick" }, svg).textContent = r.label;
    }
    const hit = el("rect", { x: padL + i * band, y: padT, width: band, height: ih, class: "hit", tabindex: 0,
      "aria-label": `${r.title}: ${series.map(s => `${r.values[s.key] || 0} ${s.label}`).join(", ")}` }, svg);
    const show = () => {
      hover.setAttribute("x", padL + i * band); hover.setAttribute("opacity", 1);
      tip.show(padL + i * band + band / 2, y(totals[i]) - 2, r.title,
        [{ value: totals[i], label: "total" }, ...series.map(s => ({ color: s.color, value: r.values[s.key] || 0, label: s.label }))]);
    };
    const hide = () => { hover.setAttribute("opacity", 0); tip.hide(); };
    hit.addEventListener("pointerenter", show); hit.addEventListener("pointerleave", hide);
    hit.addEventListener("focus", show); hit.addEventListener("blur", hide);
  });
  root.prepend(svg);
}

/** Single-series line with a 10% area wash, end label and crosshair. points: [{ label, title, value }] */
export function line(root, { points, color = "var(--new)", height = 190, unit = "" }) {
  root.classList.add("chart");
  root.querySelector("svg")?.remove();
  const W = Math.max(240, root.clientWidth), H = height;
  const padL = 34, padR = 40, padT = 12, padB = 22;
  const iw = W - padL - padR, ih = H - padT - padB;
  const { top, ticks } = niceScale(Math.max(1, ...points.map(p => p.value)));
  const x = i => padL + (points.length === 1 ? iw / 2 : (i / (points.length - 1)) * iw);
  const y = v => padT + ih - (v / top) * ih;
  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, height: H, role: "img", tabindex: 0, "aria-label": root.dataset.label || "Line chart" });
  for (const t of ticks) {
    el("line", { x1: padL, x2: W - padR, y1: y(t), y2: y(t), class: t === 0 ? "baseline" : "gridline" }, svg);
    el("text", { x: padL - 8, y: y(t) + 4, "text-anchor": "end", class: "tick" }, svg).textContent = fmtTick(t);
  }
  const d = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join("");
  el("path", { d: `${d}L${x(points.length - 1)},${y(0)}L${x(0)},${y(0)}Z`, fill: color, class: "area" }, svg);
  el("path", { d, stroke: color, class: "line" }, svg);
  const every = Math.max(1, Math.ceil(60 / (iw / Math.max(1, points.length - 1))));
  points.forEach((p, i) => {
    if (i % every === 0 && i < points.length - Math.ceil(every / 2)) el("text", { x: x(i), y: H - 6, "text-anchor": "middle", class: "tick" }, svg).textContent = p.label;
  });
  el("text", { x: x(points.length - 1), y: H - 6, "text-anchor": "end", class: "tick" }, svg).textContent = points.at(-1).label;
  const last = points.length - 1;
  el("circle", { cx: x(last), cy: y(points[last].value), r: 4.5, fill: color, class: "marker" }, svg);
  el("text", { x: x(last) + 9, y: y(points[last].value) + 4, class: "endlabel" }, svg).textContent = points[last].value.toLocaleString();

  const cross = el("line", { y1: padT, y2: padT + ih, class: "crosshair", opacity: 0 }, svg);
  const dot = el("circle", { r: 4.5, fill: color, class: "marker", opacity: 0 }, svg);
  const tip = tooltip(root);
  let cur = -1;
  const show = i => {
    cur = Math.max(0, Math.min(last, i));
    const p = points[cur];
    cross.setAttribute("x1", x(cur)); cross.setAttribute("x2", x(cur)); cross.setAttribute("opacity", 1);
    dot.setAttribute("cx", x(cur)); dot.setAttribute("cy", y(p.value)); dot.setAttribute("opacity", 1);
    tip.show(x(cur), y(p.value) - 6, p.title || p.label, [{ color, value: p.value.toLocaleString(), label: unit }]);
  };
  const hide = () => { cross.setAttribute("opacity", 0); dot.setAttribute("opacity", 0); tip.hide(); cur = -1; };
  svg.addEventListener("pointermove", e => {
    const r = svg.getBoundingClientRect(), px = (e.clientX - r.left) * (W / r.width);
    show(Math.round(((px - padL) / iw) * last));
  });
  svg.addEventListener("pointerleave", hide);
  svg.addEventListener("blur", hide);
  svg.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); e.stopPropagation(); show((cur < 0 ? last : cur) + (e.key === "ArrowLeft" ? -1 : 1)); }
  });
  root.prepend(svg);
}

/** 12–30 point sparkline: de-emphasis stroke, current value dot in the accent. */
export function sparkline(values) {
  const W = 140, H = 46, pad = 5;
  const max = Math.max(1, ...values), min = Math.min(0, ...values);
  const x = i => pad + (values.length === 1 ? 0 : (i / (values.length - 1)) * (W - 2 * pad));
  const y = v => H - pad - ((v - min) / (max - min || 1)) * (H - 2 * pad);
  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, class: "spark", "aria-hidden": "true" });
  el("path", { d: values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("") }, svg);
  el("circle", { cx: x(values.length - 1), cy: y(values.at(-1)), r: 4 }, svg);
  return svg;
}

/** Re-render a chart when its container is resized. */
export function responsive(root, draw) {
  draw();
  let w = root.clientWidth, raf = 0;
  const ro = new ResizeObserver(() => {
    if (Math.abs(root.clientWidth - w) < 2) return;
    w = root.clientWidth;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(draw);
  });
  ro.observe(root);
  return () => ro.disconnect();
}
