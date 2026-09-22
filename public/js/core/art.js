// Hand-drawn SVG: the icon set, the small illustration on each page, and the Najdi scene on Today.
// Everything is flat shapes colored by CSS classes (a-*), so every theme — light, dark, mud brick — repaints the
// art from its own tokens (css/tokens.css). All of it is decoration: aria-hidden, never the only way to read anything.

// ---------- Icons: 24×24, 1.8px strokes ----------
const ICONS = {
  today: `<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/>`,
  progress: `<path d="M3.5 20.5h17M6.5 20.5v-6M11 20.5V9.5M15.5 20.5v-8M20 20.5V4.5"/>`,
  calendar: `<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M14.6 13.2a3 3 0 1 0 .9 4.8 2.3 2.3 0 0 1-.9-4.8z" fill="currentColor" stroke="none"/>`,
  plan: `<path d="M4.5 20.5c2.5-2 6.5-.8 7.2-4.4.6-3.2-3.9-4.3-2.2-7.4.9-1.6 3-2 4.5-2.2"/><path d="M15.5 3v7M15.5 3.5h4.5l-1.2 1.8 1.2 1.8h-4.5"/><circle cx="4.5" cy="20.5" r="1" fill="currentColor"/>`,
  print: `<path d="M7 8.5V3.5h10v5M7 17H4.8a1.3 1.3 0 0 1-1.3-1.3v-5a2.2 2.2 0 0 1 2.2-2.2h12.6a2.2 2.2 0 0 1 2.2 2.2v5a1.3 1.3 0 0 1-1.3 1.3H17"/><rect x="7" y="13.5" width="10" height="7" rx="1"/>`,
  cards: `<rect x="3.5" y="7.5" width="12.5" height="13" rx="2"/><path d="M8 7.5V5.5a2 2 0 0 1 2-2h8.5a2 2 0 0 1 2 2V15a2 2 0 0 1-2 2H16"/>`,
  words: `<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z"/><path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19M9 7.5h6M9 11h4"/>`,
  phrases: `<path d="M5.5 4h13A2.5 2.5 0 0 1 21 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 4v-4h-1A2.5 2.5 0 0 1 3 13.5v-7A2.5 2.5 0 0 1 5.5 4z"/><path d="M8 9h8M8 12h5"/>`,
  // The letter ب: a boat with one dot beneath
  letters: `<path d="M3.5 9.5c0 4.6 3.2 6.5 8.5 6.5s8.5-1.9 8.5-6.5"/><circle cx="12" cy="20" r="1.3" fill="currentColor" stroke="none"/>`,
  vowels: `<path d="M4 14.5h16M9.5 9.5l5-2.2M9.5 20.5l5-2.2"/>`,
  reading: `<path d="M3 5.5c3-1.3 6-1 9 1 3-2 6-2.3 9-1v13c-3-1.3-6-1-9 1-3-2-6-2.3-9-1z"/><path d="M12 6.5v13"/>`,
  quiz: `<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.6 2.3c-.8.4-1.2 1-1.2 1.8"/><circle cx="12" cy="16.8" r="1" fill="currentColor" stroke="none"/>`,
  sound: `<path d="M4 9.5h3.5L12.5 5v14l-5-4.5H4z" fill="currentColor"/><path d="M15.8 9a4.2 4.2 0 0 1 0 6M18.6 6.4a8 8 0 0 1 0 11.2"/>`,
  play: `<path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>`,
  timer: `<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9.5M9.5 2.5h5M18.5 6.5l1.3-1.3"/>`,
  flame: `<path d="M12 21c-3.9 0-6.5-2.6-6.5-6.1 0-3.4 2.4-5.2 3.4-8.4.2-.6 1-.8 1.4-.3 1 1.3 1.1 2.9 1.2 4 .9-1 1.6-2.4 1.8-4 .1-.6.8-.9 1.3-.5 2.5 2.1 3.9 5.4 3.9 8.3 0 4.2-2.6 7-6.5 7z"/>`,
  check: `<path d="M4.5 12.5l4.5 4.5L19.5 6.5"/>`,
  lock: `<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>`,
  undo: `<path d="M8.5 5.5L4 10l4.5 4.5"/><path d="M4 10h10a6 6 0 0 1 0 12h-3"/>`,
  search: `<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5l5 5"/>`,
  download: `<path d="M12 3.5v11M7.5 10l4.5 4.5 4.5-4.5M4.5 20.5h15"/>`,
  cloud: `<path d="M7 18.5a4.5 4.5 0 0 1-.4-9A6 6 0 0 1 18 9.5a4.5 4.5 0 0 1-1 9z"/>`,
  arrow: `<path d="M5 12h14M13 6l6 6-6 6"/>`,
  back: `<path d="M19 12H5M11 6l-6 6 6 6"/>`,
  settings: `<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.4M12 18.8v2.4M4.1 7.4l2.1 1.2M17.8 15.4l2.1 1.2M4.1 16.6l2.1-1.2M17.8 8.6l2.1-1.2"/>`,
  star: `<path d="M12 3.5l2.5 5.3 5.7.7-4.2 4 1.1 5.7L12 16.4l-5.1 2.8L8 13.5l-4.2-4 5.7-.7z"/>`,
  pause: `<path d="M8.5 5v14M15.5 5v14"/>`,
  more: `<circle cx="5.5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="18.5" cy="12" r="1.6" fill="currentColor"/>`,
  close: `<path d="M6 6l12 12M18 6L6 18"/>`,
  heart: `<path d="M12 20.5C6 15.8 3 12.6 3 8.9 3 6.2 5.1 4 7.7 4c1.7 0 3.2.9 4.3 2.3C13.1 4.9 14.6 4 16.3 4 18.9 4 21 6.2 21 8.9c0 3.7-3 6.9-9 11.6z"/>`,
  mic: `<rect x="9" y="2.8" width="6" height="11.4" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5v3.5M8.5 21h7"/>`,
  stop: `<rect x="6.5" y="6.5" width="11" height="11" rx="2.2" fill="currentColor"/>`,
  slow: `<path d="M3.5 15.5a7.5 6.8 0 0 1 15 0z"/><path d="M8 15.5l1.8-3.6h3.4l1.8 3.6M6.5 15.5v2.8M15.5 15.5v2.8M18.5 13.4c.6-1.4 1.6-2.2 2.6-2 .6.2.8.9.4 1.5-.5.8-1.6 1.2-3 1.2"/>`,
  trash: `<path d="M4.5 6.5h15M9.5 6.5V4.5h5v2M6.5 6.5l1 13.5h9l1-13.5M10 10.5v6M14 10.5v6"/>`,
  pencil: `<path d="M4 20l1-4.6L15.6 4.8a2.1 2.1 0 0 1 3 3L8 18.4z"/><path d="M13.6 6.8l3 3"/>`,
  redo: `<path d="M15.5 5.5L20 10l-4.5 4.5"/><path d="M20 10H10a6 6 0 0 0 0 12h3"/>`,
};

export const icon = (name, cls = "") =>
  `<svg class="i${cls ? " " + cls : ""}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;

// ---------- Building blocks ----------
export const tri = (x, y, w, h) => `M${x},${y}l${w / 2},${-h}l${w / 2},${h}z`;
// A row of Najdi crenellations (sharafat) along a wall top: small triangles with a notch step.
export const crenels = (x, y, width, w = 10, h = 9) => {
  let d = "";
  for (let cx = x; cx + w <= x + width + 0.1; cx += w) d += tri(cx, y, w, h);
  return d;
};
// Triangular vents in a row — the little openings of Najdi mud walls.
export const vents = (x, y, n, gap = 12, w = 5, h = 6) => Array.from({ length: n }, (_, i) => tri(x + i * gap, y, w, h)).join("");

// A date palm: a gently curved trunk, a crown of fronds, and hanging dates.
export function palm(x, base, height, lean = 0, scale = 1) {
  const top = { x: x + lean, y: base - height };
  const trunk = `M${x - 4 * scale},${base} C${x - 3 * scale},${base - height * 0.5} ${top.x - 2 * scale},${top.y + height * 0.25} ${top.x - 1.6 * scale},${top.y} L${top.x + 1.6 * scale},${top.y} C${top.x + 2.5 * scale},${top.y + height * 0.25} ${x + 3 * scale},${base - height * 0.5} ${x + 4 * scale},${base} Z`;
  const rings = Array.from({ length: Math.floor(height / (7 * scale)) }, (_, i) => {
    const t = (i + 1) / (height / (7 * scale));
    const cx = x + lean * t * t;
    const cy = base - height * t;
    return `M${cx - 3.2 * scale},${cy + 1.5 * scale}L${cx + 3.2 * scale},${cy - 1.5 * scale}`;
  }).join("");
  // Fronds: each a curved leaf from the crown, drooping at the tip.
  const fronds = [[-62, 1], [-38, 1.08], [-12, 1.1], [14, 1.08], [40, 1], [-80, 0.8], [62, 0.85], [-150, 0.75], [150, 0.75]]
    .map(([angle, len]) => {
      const L = 34 * scale * len;
      const a = ((angle - 90) * Math.PI) / 180;
      const tip = { x: top.x + Math.cos(a) * L, y: top.y + Math.sin(a) * L * 0.55 + L * 0.35 };
      const mid = { x: top.x + Math.cos(a) * L * 0.55, y: top.y + Math.sin(a) * L * 0.55 - 6 * scale };
      const nx = -Math.sin(a) * 3.6 * scale;
      const ny = Math.cos(a) * 3.6 * scale;
      return `M${top.x},${top.y} Q${mid.x + nx},${mid.y + ny} ${tip.x},${tip.y} Q${mid.x - nx},${mid.y - ny} ${top.x},${top.y}Z`;
    }).join("");
  const dates = [[-5, 7], [-1, 9], [3, 7], [-3, 12], [1, 12.5], [5, 11]]
    .map(([dx, dy]) => `<circle cx="${top.x + dx * scale}" cy="${top.y + dy * scale}" r="${1.9 * scale}"/>`).join("");
  return `<g class="palm"><path class="a-trunk" d="${trunk}"/><path class="a-trunk-line" d="${rings}"/>
    <g class="a-dates">${dates}</g><path class="a-frond" d="${fronds}"/></g>`;
}

// ---------- The Najdi scene on Today ----------
// time: "dawn" | "day" | "dusk" | "night". Drawn in a 1200×280 box; the text sits over the empty sky on the left.
export function scene(time) {
  const W = 1200;
  const H = 280;
  const stars = time === "night"
    ? Array.from({ length: 34 }, (_, i) => {
        const x = (i * 197 + 61) % 1180 + 10;
        const y = ((i * 83) % 150) + 12;
        const r = i % 5 === 0 ? 1.8 : i % 3 === 0 ? 1.3 : 0.9;
        return `<circle class="a-star${i % 4 === 0 ? " twinkle" : ""}" cx="${x}" cy="${y}" r="${r}" style="animation-delay:${(i % 7) * 0.7}s"/>`;
      }).join("")
    : "";
  const sky = time === "night"
    ? `<g class="a-moon"><circle cx="1085" cy="70" r="34" class="a-moon-glow"/><g transform="translate(1085 70) scale(2.3) rotate(-18) translate(-24 -24)"><path d="M28.07 13.69A12.5 12.5 0 1 0 28.07 34.31A10.6 10.6 0 1 1 28.07 13.69Z"/></g></g>`
    : `<circle class="a-sun-glow" cx="1080" cy="${time === "day" ? 64 : 150}" r="64"/><circle class="a-sun" cx="1080" cy="${time === "day" ? 64 : 150}" r="30"/>`;

  // Riyadh's towers far away: Kingdom Centre (the arch with a bridge) and Al Faisaliah (the golden sphere).
  const skyline = `<g class="a-far">
    <path d="M822,210 L836,70 Q850,36 864,70 L878,210 Z M840,118 L860,118 L860,92 Q850,64 840,92 Z" fill-rule="evenodd"/>
    <path d="M840,100 h20 v4 h-20z"/>
    <path d="M744,210 L770,64 L796,210 Z"/><circle cx="770" cy="106" r="9" class="a-far-ball"/><path d="M769,64 h2 v-26 h-2z"/>
    <path d="M700,210 v-58 h26 v58z M898,210 v-72 h22 v72z M932,210 v-40 h30 v40z M654,210 v-34 h30 v34z M972,210 v-56 h18 v56z"/>
  </g>`;

  const dunes = `<path class="a-dune-far" d="M0,206 C140,176 260,196 380,188 C520,178 600,150 760,170 C900,188 1020,160 1200,176 L1200,${H} L0,${H} Z"/>
    <path class="a-dune" d="M0,236 C180,214 330,232 470,226 C640,218 700,204 880,214 C1010,222 1100,206 1200,212 L1200,${H} L0,${H} Z"/>`;

  // The fort: two tapered towers and a crenellated wall, with triangular vents and a painted wooden door.
  const fx = 600;
  const fort = `<g class="a-fort">
    <path class="a-wall" d="M${fx + 48},246 L${fx + 52},160 L${fx + 300},160 L${fx + 304},246 Z"/>
    <path class="a-wall-shade" d="M${fx + 250},160 L${fx + 300},160 L${fx + 304},246 L${fx + 252},246 Z" opacity=".55"/>
    <path class="a-wall" d="${crenels(fx + 52, 160, 248, 12, 10)}"/>
    <path class="a-wall" d="M${fx},246 L${fx + 8},104 L${fx + 62},104 L${fx + 70},246 Z"/>
    <path class="a-wall-shade" d="M${fx + 42},104 L${fx + 62},104 L${fx + 70},246 L${fx + 46},246 Z"/>
    <path class="a-wall" d="${crenels(fx + 8, 104, 54, 9, 9)}"/>
    <path class="a-wall" d="M${fx + 282},246 L${fx + 290},120 L${fx + 346},120 L${fx + 354},246 Z"/>
    <path class="a-wall-shade" d="M${fx + 324},120 L${fx + 346},120 L${fx + 354},246 L${fx + 328},246 Z"/>
    <path class="a-wall" d="${crenels(fx + 290, 120, 56, 9.33, 9)}"/>
    <path class="a-band" d="M${fx + 8},122 h54 v3 h-54z M${fx + 290},138 h56 v3 h-56z M${fx + 52},172 h198 v3 h-198z"/>
    <path class="a-vent" d="${vents(fx + 17, 140, 4, 11)} ${vents(fx + 298, 156, 4, 11)} ${vents(fx + 66, 190, 15, 12.5, 4.5, 5)}"/>
    <path class="a-vent" d="M${fx + 30},170 h10 v14 h-10z M${fx + 312},184 h10 v14 h-10z"/>
    <g class="a-door"><path d="M${fx + 158},246 v-44 h36 v44z"/>
      <path class="a-door-paint" d="${tri(fx + 160, 212, 8, 7)}${tri(fx + 168, 212, 8, 7)}${tri(fx + 176, 212, 8, 7)}${tri(fx + 184, 212, 8, 7)}M${fx + 160},220 h32 v2 h-32z M${fx + 175},224 v20 h2 v-20z"/></g>
  </g>`;

  const trees = `${palm(1000, 250, 118, 10, 1.15)}${palm(1052, 252, 88, -6, 0.9)}${palm(566, 250, 96, -8, 1)}`;
  const ground = `<path class="a-ground" d="M0,248 C300,242 600,250 900,244 C1020,242 1120,246 1200,244 L1200,${H} L0,${H} Z"/>`;

  return `<svg class="scene" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMaxYMax slice" aria-hidden="true" focusable="false">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="a-sky-top"/><stop offset="1" class="a-sky-bottom"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#sky)"/>${stars}${sky}${skyline}${dunes}${fort}${trees}${ground}
  </svg>`;
}

// ---------- Small illustrations for page headings (160×120) ----------
export const dallah = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <ellipse class="a-shadow" cx="72" cy="110" rx="26" ry="4"/>
  <path class="a-brass" d="M50,106 C44,92 48,78 60,72 L84,72 C96,78 100,92 94,106 Z"/>
  <path class="a-brass-shade" d="M80,72 L84,72 C96,78 100,92 94,106 L84,106 C90,94 88,80 80,72 Z"/>
  <path class="a-brass" d="M62,72 C64,68 64,64 63,60 L81,60 C80,64 80,68 82,72 Z"/>
  <path class="a-brass" d="M58,60 C60,53 65,49 72,47 C79,49 84,53 86,60 Z"/>
  <path class="a-brass-dark" d="M58,60 h28 v3 h-28z M50,104 h44 v3 h-44z"/>
  <path class="a-brass" d="M65,47 C66,41 69,37 72,35 C75,37 78,41 79,47 Z"/>
  <circle class="a-brass-dark" cx="72" cy="31" r="3.6"/><path class="a-brass-dark" d="M71,28 h2 v-8 h-2z"/>
  <path class="a-brass" d="M92,92 C108,86 112,66 124,50 L129,52 C120,72 112,94 94,100 Z"/>
  <path class="a-brass-dark" fill="none" stroke-width="5" stroke-linecap="round" d="M60,58 C38,56 36,86 52,94"/>
  <path class="a-shine" d="M58,80 C56,88 57,96 60,101 L63,101 C61,95 60,88 62,81 Z"/>
</g>`;
export const finjal = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path class="a-cup" d="M0,0 h18 l-2.5,11 h-13z"/><path class="a-cup-band" d="M.6,3 h16.8 l-.4,2 h-16z"/>
  <path class="a-steam" d="M6,-4 c-3,-4 3,-6 0,-11 M12,-4 c-3,-4 3,-6 0,-11"/></g>`;

const VIGNETTES = {
  phrases: `${dallah(-10, 0, 1)}${finjal(120, 96)}`,
  progress: `<ellipse class="a-dune" cx="80" cy="116" rx="72" ry="12"/>${palm(80, 114, 84, 4, 1)}`,
  calendar: `<path class="a-dune-far" d="M0,96 C40,80 80,92 120,84 C140,80 150,84 160,86 V120 H0Z"/><path class="a-dune" d="M0,108 C50,98 110,112 160,102 V120 H0Z"/>
    <path class="a-moon-solid" d="M104,18 a24,24 0 1 0 8,40 a19,19 0 1 1 -8,-40z"/>
    <circle class="a-star-solid" cx="40" cy="26" r="2.2"/><circle class="a-star-solid" cx="62" cy="48" r="1.4"/><circle class="a-star-solid" cx="138" cy="70" r="1.6"/><circle class="a-star-solid" cx="24" cy="62" r="1.2"/>`,
  plan: `<path class="a-dune-far" d="M0,88 C40,74 90,86 160,72 V120 H0Z"/><path class="a-dune" d="M0,104 C60,92 110,108 160,96 V120 H0Z"/>
    <path class="a-path" d="M10,116 C40,108 30,96 58,94 C84,92 76,80 100,76 C114,74 112,66 122,62"/>
    <path class="a-wall" d="M112,64 L114,34 L148,34 L150,64 Z"/><path class="a-wall" d="${crenels(114, 34, 34, 8.5, 7)}"/><path class="a-wall-shade" d="M138,34 L148,34 L150,64 L140,64Z"/>
    <path class="a-vent" d="${vents(118, 46, 3, 9, 4, 5)}"/><path class="a-door" d="M126,64 v-10 h8 v10z"/>
    <path class="a-flag-pole" d="M131,26 v8" /><path class="a-flag" d="M131,17 h10 l-2,3 2,3 h-10z"/>`,
  print: `<g transform="rotate(-6 80 60)"><rect class="a-paper-shadow" x="44" y="12" width="76" height="100" rx="3"/><rect class="a-paper" x="40" y="8" width="76" height="100" rx="3"/>
    <path class="a-rule" d="M48,36 h60 M48,58 h60 M48,80 h60 M48,102 h60"/>
    <text class="a-ar a-ink" x="104" y="32" text-anchor="end" direction="rtl">ا ب ت</text>
    <text class="a-ar a-trace" x="104" y="54" text-anchor="end" direction="rtl">ا ب ت</text>
    <text class="a-ar a-trace" x="104" y="76" text-anchor="end" direction="rtl">ا ب ت</text></g>
    <path class="a-qalam" d="M118,104 L150,36 L154,38 L124,108 Z"/><path class="a-qalam-tip" d="M118,104 L124,108 L117,113 Z"/>`,
  cards: `<g transform="rotate(-8 80 64)"><rect class="a-card-back" x="34" y="18" width="84" height="96" rx="8"/></g>
    <g transform="rotate(5 80 64)"><rect class="a-card" x="42" y="12" width="84" height="96" rx="8"/><path class="a-card-trim" d="${crenels(50, 26, 68, 8.5, 7)}"/>
    <text class="a-ar a-ink a-big" x="84" y="86" text-anchor="middle">ب</text></g>`,
  words: `<path class="a-book" d="M80,30 C62,20 36,18 16,24 V104 C36,98 62,100 80,110 Z"/><path class="a-book-2" d="M80,30 C98,20 124,18 144,24 V104 C124,98 98,100 80,110 Z"/>
    <path class="a-rule" d="M28,44 h40 M28,58 h36 M28,72 h40 M28,86 h30 M92,44 h40 M96,58 h36 M92,72 h40 M102,86 h30"/>
    <path class="a-sadu" d="M16,104 C36,98 62,100 80,110 C98,100 124,98 144,104 V110 C124,104 98,106 80,116 C62,106 36,104 16,110Z"/>`,
  letters: `<text class="a-ar a-green a-huge" x="84" y="84" text-anchor="middle">ب</text>
    <path class="a-ink-pot" d="M22,112 C16,104 18,92 28,90 H44 C54,92 56,104 50,112 Z"/><path class="a-brass-dark" d="M26,86 h20 v5 h-20z"/>
    <path class="a-qalam" d="M40,88 L116,20 L119,23 L44,92 Z"/>`,
  vowels: `<text class="a-ar a-ink a-big" x="80" y="84" text-anchor="middle">بَ بِ بُ</text>`,
  reading: `<path class="a-book" d="M80,40 C62,30 36,28 16,34 V108 C36,102 62,104 80,114 Z"/><path class="a-book-2" d="M80,40 C98,30 124,28 144,34 V108 C124,102 98,104 80,114 Z"/>
    <text class="a-ar a-ink" x="60" y="78" text-anchor="middle">بيت</text><text class="a-ar a-ink" x="112" y="78" text-anchor="middle">باب</text>
    <path class="a-lamp-glow" d="M80,4 a14,14 0 1 1 0.1,0z"/>`,
  quiz: `<path class="a-wall" d="M44,114 V52 L80,20 L116,52 V114 Z"/><path class="a-wall-shade" d="M100,38 L116,52 V114 H100 Z"/>
    <path class="a-arch" d="M60,114 V70 a20,20 0 0 1 40,0 V114 Z"/><text class="a-ar a-cream a-big" x="80" y="104" text-anchor="middle">؟</text>`,
  finish: `${dallah(0, 0, 1)}${finjal(118, 96)}${finjal(138, 100, 0.8)}`,
};

export const vignette = name =>
  VIGNETTES[name] ? `<svg class="vignette" viewBox="0 0 160 120" aria-hidden="true" focusable="false">${VIGNETTES[name]}</svg>` : "";
