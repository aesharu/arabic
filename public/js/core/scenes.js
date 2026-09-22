// Page scenes: one hand-drawn picture of her world at the top of each page — northern and Saudi life — with the
// word for it underneath (tap to hear). Drawn in a 480×160 box with the same colour tokens as the Today scene, so
// they follow the theme: sun by day, moon and stars in dark mode. Tap a scene and it does something small.
import { tri, crenels, vents, palm, dallah, finjal } from "./art.js";

const W = 480;
const H = 160;

// Sky, sun or moon, stars (stars and moon only show in the dark themes: --scene-night).
function sky(sunX = 410, sunY = 36) {
  const stars = Array.from({ length: 22 }, (_, i) => {
    const x = (i * 131 + 17) % 470 + 5;
    const y = ((i * 53) % 78) + 6;
    const r = i % 4 === 0 ? 1.4 : 0.9;
    return `<circle class="a-star${i % 3 === 0 ? " twinkle" : ""}" cx="${x}" cy="${y}" r="${r}" style="animation-delay:${(i % 6) * 0.6}s"/>`;
  }).join("");
  return `<rect width="${W}" height="${H}" fill="url(#ps-sky)"/>
    <g class="ps-night">${stars}<g class="a-moon" transform="translate(${sunX - 16} ${sunY - 16}) scale(1.35) rotate(-18 12 12)"><path d="M14 2.9A9.4 9.4 0 1 0 14 21.1A8 8 0 1 1 14 2.9Z"/></g></g>
    <g class="ps-day"><circle class="a-sun-glow" cx="${sunX}" cy="${sunY}" r="26"/><circle class="a-sun" cx="${sunX}" cy="${sunY}" r="13"/></g>`;
}
const dunes = (farCls = "a-dune-far", nearCls = "a-dune") => `
  <path class="${farCls}" d="M0,110 C70,96 150,108 230,100 C310,92 390,104 480,94 V160 H0Z"/>
  <path class="${nearCls}" d="M0,130 C110,120 220,134 330,126 C400,121 450,126 480,123 V160 H0Z"/>`;

// A camel walking right, feet at y = 56.
const camel = `<path d="M6,26 C6,18 12,14 20,14 C24,4 38,2 42,12 C45,16 48,17 50,15 L52,8 C53,4 57,3 60,5 L63,8 L60,9.5 C58.5,10.5 57.5,12 57.2,15 C56.5,22 54,27 50,30 C48,32 46,33 44,33 L45,56 L41,56 L39,36 C34,37.2 26,37.2 22,36 L21,56 L17,56 L15.5,36.5 C13.5,40 12.5,46 12.5,56 L8.5,56 L8.5,40 C6.5,36 5.5,31 6,26 Z"/>
  <path class="ps-saddle" d="M23,15 C27,8 36,7 40,13 L41,19 C34,21 27,21 22,19 Z"/>
  <path class="ps-saddle-band" d="M22.5,18 C28,19.6 34,19.6 40.8,17.8 L41,19.2 C34,21 27,21 22,19.4 Z"/>
  <path class="ps-tail" d="M6.5,27 C3.5,29 2.8,33 3.6,37"/>`;

// Little Sadu teeth: a row of small triangles in the weave's colours.
const saduRow = (x, y, n, w = 6, h = 4, cls = "ps-sadu-cream") => `<path class="${cls}" d="${Array.from({ length: n }, (_, i) => tri(x + i * w, y, w, h)).join("")}"/>`;

const DRAW = {
  // Stories: a black goat-hair tent, a fire, the dallah by it.
  tent: () => {
    const lines = Array.from({ length: 11 }, (_, i) => `M${234 + i * 13},${92 + (i % 2)} L${230 + i * 13.4},130`).join(" ");
    return `${sky(96, 34)}${dunes()}
      <path class="ps-rope" d="M216,108 L190,131 M384,108 L410,131 M226,97 L204,131 M372,97 L396,131"/>
      <path class="ps-tent" d="M214,131 L226,96 C250,86 282,86 300,94 C320,86 352,86 372,96 L386,131 Z"/>
      <path class="ps-tent-line" d="${lines}"/>
      <path class="ps-tent-in" d="M262,131 L266,104 L334,104 L338,131 Z"/>
      <rect class="ps-sadu-red" x="266" y="104" width="68" height="7"/>${saduRow(266, 111, 11, 6.2, 4)}
      <circle class="ps-lamp-glow" cx="300" cy="120" r="12"/><circle class="ps-lamp" cx="300" cy="120" r="3.2"/>
      <g class="ps-fire" transform="translate(126 0)">
        <circle class="ps-glow" cx="0" cy="124" r="30"/>
        <path class="ps-log" d="M-16,130 L14,122 L16,126 L-14,134 Z M-14,122 L16,130 L14,134 L-16,126 Z"/>
        <path class="ps-flame" d="M0,126 C-9,118 -8,106 0,94 C4,104 12,108 8,119 C6,124 4,126 0,126Z"/>
        <path class="ps-flame-core" d="M0,126 C-4,121 -4,114 0,107 C3,113 6,117 3,122 C2,125 1,126 0,126Z"/>
      </g>
      ${dallah(150, 90, 0.34)}${finjal(178, 124, 0.7)}
      <rect class="ps-sadu-red" x="52" y="124" width="36" height="9" rx="3"/>${saduRow(54, 133, 5, 6.4, 3)}`;
  },

  // Verbs: camels walking over the dunes.
  camels: () => `${sky(400, 34)}${dunes("ps-nafud-far", "ps-nafud")}
    <path class="ps-tracks" d="M40,142 C120,136 200,140 300,133"/>
    ${[[96, 76, 0], [178, 72, 0.35], [260, 74, 0.7]].map(([x, y, d], i) => `<g transform="translate(${x} ${y})${i === 1 ? " scale(1.08)" : ""}"><g class="ps-camel ps-walk" style="animation-delay:${d}s">${camel}</g></g>`).join("")}
    <path class="ps-rope-dark" d="M148,94 C160,98 168,98 178,94 M233,94 C244,98 252,98 262,94"/>`,

  // Practice: a hooded falcon on its perch.
  falcon: () => `${sky(96, 36)}${dunes()}
    <path class="ps-pole" d="M306,152 L306,108 M290,152 h32"/>
    <rect class="ps-sadu-red" x="280" y="100" width="52" height="9" rx="4.5"/>${saduRow(284, 109, 7, 6.2, 3)}
    <g class="ps-falcon-all">
      <path class="ps-falcon-wing" d="M308,98 L319,123 L303,121 Z"/>
      <path class="ps-falcon" d="M306,101 C291,101 283,87 284,71 C285,57 292,49 301,48 C312,48 319,57 318,73 C317,89 315,99 306,101Z"/>
      <path class="ps-falcon-chest" d="M296,95 C289,87 289,71 294,62 C298,57 303,59 303,65 C303,77 303,89 300,96Z"/>
      <path class="ps-falcon-spot" d="M291,70 q2.5,1.6 5,0 M292,77 q2.5,1.6 5,0 M291.5,84 q2.5,1.6 5,0 M294,90 q2,1.4 4,0"/>
      <g class="ps-wing"><path class="ps-falcon-wing" d="M309,55 C322,59 327,81 322,101 L331,124 C321,118 314,107 311,99 C308,85 307,69 309,55Z"/>
        <path class="ps-wing-line" d="M313,66 C318,74 320,86 319,98"/></g>
      <circle class="ps-falcon" cx="301" cy="45" r="11.5"/>
      <path class="ps-malar" d="M293.5,50.5 c1,4.2 3.2,7 6.4,8.2"/>
      <path class="ps-hood" d="M289.6,46.5 C288.8,35 296.5,30 303.8,31 C311.2,32 314.4,38.5 312.6,46.5Z"/>
      <path class="ps-hood-band" d="M290,42 h22.6 v2.4 h-22.6z"/>
      <path class="ps-plume" d="M301.5,31.2 C299,24 301.6,19 306,16.4 C304.6,21 306,26 304,31.2Z"/>
      <path class="ps-beak" d="M290.5,46.2 C285.4,46.2 283.2,50.2 285.1,53.4 C286.2,55.3 288.5,55.4 289.3,53.3 C289.8,51.8 290.9,50.4 292.8,49.4Z"/>
      <path class="ps-talon" d="M298,100 v4 M302,100 v4 M309,100 v4"/>
    </g>
    <path class="ps-leash" d="M303,104 C294,120 310,130 304,146"/>`,

  // Numbers: a souq stall — spices, dates and price tags.
  souq: () => `${sky(420, 30)}
    <path class="a-wall" d="M0,40 H480 V132 H0Z"/>
    <path class="a-vent" d="${vents(20, 58, 38, 12, 4.5, 5)}"/>
    <path class="a-wall-shade" d="M36,132 V88 a22,22 0 0 1 44,0 V132Z M400,132 V88 a22,22 0 0 1 44,0 V132Z"/>
    ${Array.from({ length: 12 }, (_, i) => `<path class="${i % 2 ? "ps-awning-2" : "ps-awning"}" d="M${120 + i * 21},62 h21 l-3,16 h-15 z"/>`).join("")}
    <path class="ps-awning-edge" d="M120,62 H372"/>
    <path class="ps-wood" d="M132,106 H362 V114 H132Z M142,114 V140 h6 V114Z M346,114 V140 h6 V114Z"/>
    ${[[166, "ps-spice-1"], [206, "ps-spice-2"], [246, "ps-spice-3"], [286, "ps-spice-4"]].map(([x, c]) => `<ellipse class="ps-bowl" cx="${x}" cy="105" rx="17" ry="4"/><path class="${c}" d="M${x - 14},104 C${x - 10},90 ${x - 4},84 ${x},84 C${x + 4},84 ${x + 10},90 ${x + 14},104Z"/>`).join("")}
    <ellipse class="ps-basket" cx="332" cy="102" rx="20" ry="8"/>
    ${[[322, 97], [330, 95], [338, 96], [345, 99], [326, 101], [334, 100], [341, 102]].map(([x, y]) => `<ellipse class="a-dates" cx="${x}" cy="${y}" rx="3.4" ry="2.3"/>`).join("")}
    ${[[176, "١٠"], [256, "٥"], [338, "٢٥"]].map(([x, n]) => `<g class="ps-tag"><path class="ps-tag-stick" d="M${x},86 v-8"/><rect class="ps-tag-card" x="${x - 12}" y="66" width="24" height="13" rx="2.5"/><text class="ps-tag-text" x="${x}" y="76.5" text-anchor="middle">${n}</text></g>`).join("")}
    <path class="a-ground" d="M0,132 H480 V160 H0Z"/>`,

  // To her: Taif roses under the moon.
  roses: () => {
    const roses = [[150, 92, 1], [178, 78, 1.15], [206, 96, 0.95], [236, 82, 1.1], [262, 100, 0.9], [196, 112, 0.85], [228, 110, 0.9]];
    const stems = roses.map(([x, y]) => `M${x},${y + 6} C${x - 2},${y + 22} ${210 + (x - 210) * 0.3},122 ${210 + (x - 210) * 0.25},138`).join(" ");
    const leaves = roses.map(([x, y], i) => `<ellipse class="ps-leaf" cx="${x + (i % 2 ? 8 : -8)}" cy="${y + 18}" rx="7" ry="3.2" transform="rotate(${i % 2 ? -30 : 30} ${x + (i % 2 ? 8 : -8)} ${y + 18})"/>`).join("");
    const flowers = roses.map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})"><circle class="ps-rose" r="9"/><path class="ps-rose-in" d="M-4,-1 C-4,-6 4,-6 4,-1 C4,3 -1,4 -2,1 C-3,-2 1,-3 1,0 M-8,2 C-6,7 6,7 8,2"/></g>`).join("");
    const hearts = [[182, 58, 0], [244, 50, 1.2], [214, 44, 2.4]].map(([x, y, d]) => `<path class="ps-heart" style="animation-delay:${d}s" transform="translate(${x} ${y}) scale(.55)" d="M0,8 C-8,2 -10,-2 -10,-5 C-10,-8 -8,-10 -5,-10 C-3,-10 -1,-9 0,-7 C1,-9 3,-10 5,-10 C8,-10 10,-8 10,-5 C10,-2 8,2 0,8Z"/>`).join("");
    return `${sky(380, 38)}
      <path class="ps-hill" d="M0,112 C60,86 120,96 170,84 C230,70 300,92 360,80 C410,70 450,84 480,78 V160 H0Z"/>
      ${dunes("a-dune-far", "a-dune")}
      <path class="ps-stem" d="${stems}"/>${leaves}${flowers}${hearts}
      <g transform="translate(330 104)"><path class="ps-glass" d="M6,0 h8 v6 c6,4 8,10 8,16 c0,6 -4,10 -12,10 c-8,0 -12,-4 -12,-10 c0,-6 2,-12 8,-16z"/><path class="ps-glass-in" d="M-1,20 c0,5 3,8 11,8 c8,0 11,-3 11,-8z"/><rect class="ps-cork" x="6" y="-4" width="8" height="5" rx="1"/></g>`;
  },

  // About me, phrases: coffee on a tray — the dallah pours, steam rises.
  coffee: () => `${sky(430, 30)}
    <path class="a-wall" d="M0,20 H480 V124 H0Z"/><path class="a-vent" d="${vents(24, 44, 36, 12.6, 4.5, 5)}"/>
    <rect class="ps-sadu-red" x="0" y="118" width="480" height="12"/>${saduRow(0, 124, 80, 6, 4)}
    <path class="ps-carpet" d="M0,130 H480 V160 H0Z"/>
    <ellipse class="a-brass-shade" cx="250" cy="138" rx="120" ry="15"/><ellipse class="a-brass" cx="250" cy="135" rx="118" ry="13"/>
    ${dallah(128, 38, 0.95)}
    <path class="ps-pour" d="M246,84 C252,94 256,104 258,118"/>
    ${finjal(250, 118, 1.05)}${finjal(290, 122, 1.05)}${finjal(320, 124, 0.95)}
    <ellipse class="ps-bowl" cx="360" cy="132" rx="22" ry="6"/>
    ${[[350, 126], [358, 124], [366, 125], [372, 128], [354, 129], [362, 129]].map(([x, y]) => `<ellipse class="a-dates" cx="${x}" cy="${y}" rx="4" ry="2.6"/>`).join("")}`,

  // Your path: a track through the red Nafud to a fort.
  nafud: () => `${sky(90, 34)}
    <path class="ps-nafud-far" d="M0,98 C60,82 120,96 190,86 C260,76 330,92 400,82 C440,76 460,80 480,78 V160 H0Z"/>
    <path class="ps-nafud" d="M0,118 C90,104 170,122 250,112 C330,102 410,116 480,106 V160 H0Z"/>
    <path class="ps-nafud-near" d="M0,140 C100,130 200,146 300,138 C380,132 440,138 480,134 V160 H0Z"/>
    <g class="a-fort" transform="translate(378 60) scale(.62)">
      <path class="a-wall" d="M8,86 L12,28 L64,28 L68,86 Z"/><path class="a-wall-shade" d="M48,28 L64,28 L68,86 L50,86Z"/>
      <path class="a-wall" d="${crenels(12, 28, 52, 8.66, 8)}"/><path class="a-vent" d="${vents(20, 44, 4, 10)}"/>
      <path class="a-wall" d="M60,86 L62,50 L130,50 L132,86Z"/><path class="a-wall" d="${crenels(62, 50, 68, 8.5, 7)}"/>
      <path class="a-door" d="M86,86 v-18 h16 v18z"/>
    </g>
    <path class="a-path" d="M24,156 C80,150 110,136 160,134 C220,132 250,124 300,120 C340,117 360,110 400,108"/>
    ${[[104, 144], [196, 131], [288, 121]].map(([x, y]) => `<path class="a-flag-pole" d="M${x},${y} v-16"/><path class="a-flag" d="M${x},${y - 16} l11,4 l-11,4z"/>`).join("")}
    <g class="ps-car" transform="translate(58 136)"><path class="ps-car-body" d="M0,10 L4,2 C5,0 7,-1 9,-1 H25 C27,-1 29,0 30,2 L34,10 V14 H0Z"/><path class="ps-car-glass" d="M8,1 H26 L29,7 H5Z"/><circle class="ps-wheel" cx="8" cy="15" r="3.6"/><circle class="ps-wheel" cx="27" cy="15" r="3.6"/></g>`,

  // Grammar, lessons: a Najdi mud-brick house.
  mudhouse: () => `${sky(420, 32)}${dunes()}
    ${palm(116, 134, 82, -6, 0.9)}
    <g class="a-fort">
      <path class="a-wall" d="M180,134 L184,54 L352,54 L356,134 Z"/><path class="a-wall-shade" d="M314,54 L352,54 L356,134 L318,134Z"/>
      <path class="a-wall" d="${crenels(184, 54, 168, 12, 10)}"/>
      <path class="a-band" d="M184,68 h168 v3 h-168z M182,96 h172 v3 h-172z"/>
      <path class="a-vent" d="${vents(196, 84, 12, 13, 5, 6)}"/>
      <path class="a-vent" d="M208,108 h12 v14 h-12z M308,108 h12 v14 h-12z"/>
      <g class="a-door"><path d="M250,134 v-32 h30 v32z"/><path class="a-door-paint" d="${tri(252, 110, 6.5, 6)}${tri(258.5, 110, 6.5, 6)}${tri(265, 110, 6.5, 6)}${tri(271.5, 110, 6.5, 6)}M252,116 h26 v2 h-26z M264,120 v12 h2 v-12z"/></g>
      <path class="ps-spout" d="M190,62 h-10 v3 h10z M346,62 h10 v3 h-10z"/>
    </g>
    <path class="a-ground" d="M0,134 C160,130 320,136 480,132 V160 H0Z"/>`,

  // Chats: inside a majlis — cushions along the wall, coffee, incense.
  majlis: () => `<rect width="${W}" height="${H}" class="ps-plaster"/>
    <path class="ps-plaster-shade" d="M0,0 H480 V14 H0Z"/><path class="a-vent" d="${vents(20, 30, 36, 12.6, 5, 6)}"/>
    <g class="ps-window"><rect x="360" y="36" width="56" height="48" rx="3"/><path class="ps-window-bar" d="M388,36 v48 M360,60 h56"/></g>
    <path class="ps-light" d="M360,84 L416,84 L470,160 L330,160Z"/>
    <path class="ps-cushion" d="M0,96 H480 V126 H0Z"/><rect class="ps-sadu-red" x="0" y="96" width="480" height="8"/>${saduRow(0, 104, 80, 6, 4)}
    ${[40, 150, 260].map(x => `<rect class="ps-armrest" x="${x}" y="84" width="34" height="20" rx="8"/><path class="ps-armrest-band" d="M${x + 4},90 h26 M${x + 4},98 h26"/>`).join("")}
    <path class="ps-carpet" d="M0,126 H480 V160 H0Z"/><path class="ps-carpet-line" d="M20,138 H460 M20,150 H460"/>
    ${dallah(96, 62, 0.62)}${finjal(170, 140, 0.9)}${finjal(194, 142, 0.9)}
    <g transform="translate(300 128)"><path class="a-brass" d="M-10,18 L-6,4 H6 L10,18Z"/><path class="a-brass-dark" d="M-8,4 h16 v-3 h-16z"/><path class="ps-smoke" d="M0,-2 C-6,-10 6,-16 0,-24 C-5,-30 4,-36 0,-44"/></g>`,

  // Cards: a Sadu loom on the sand, the weave half done.
  sadu: () => {
    const warp = Array.from({ length: 22 }, (_, i) => `M${250 + i * 8},92 L${250 + i * 8},122`).join(" ");
    return `${sky(420, 32)}${dunes()}
      <path class="ps-pole" d="M60,86 V130 M420,86 V130"/>
      <path class="ps-wood" d="M56,84 H424 V90 H56Z M56,122 H424 V128 H56Z"/>
      <path class="ps-warp" d="${warp}"/>
      <rect class="ps-sadu-red" x="72" y="90" width="176" height="32"/>
      <rect class="ps-sadu-dark" x="72" y="90" width="176" height="5"/><rect class="ps-sadu-dark" x="72" y="117" width="176" height="5"/>
      ${saduRow(72, 101, 29, 6.07, 5)}
      <path class="ps-sadu-cream" d="${Array.from({ length: 7 }, (_, i) => `M${90 + i * 24},104 l6,5 l-6,5 l-6,-5z`).join("")}"/>
      <path class="ps-sadu-dark" d="${Array.from({ length: 7 }, (_, i) => `M${90 + i * 24},106.5 l2.5,2.5 l-2.5,2.5 l-2.5,-2.5z`).join("")}"/>
      <path class="ps-sadu-green" d="M72,100 h176 v2 h-176z M72,110 h176 v2 h-176z"/>
      <path class="ps-wood" d="M246,86 L252,130 L256,130 L250,86Z"/>
      <g class="ps-yarn"><circle class="ps-wool-red" cx="112" cy="140" r="11"/><path class="ps-wool-line" d="M104,134 C110,140 114,142 120,142 M103,140 C108,146 114,148 121,146"/></g>
      <g class="ps-yarn" style="animation-delay:.4s"><circle class="ps-wool-cream" cx="140" cy="143" r="9"/><path class="ps-wool-line" d="M133,139 C138,144 142,145 147,144"/></g>`;
  },

  // Word list: a palm grove with a basket of dates.
  palms: () => `${sky(90, 34)}${dunes()}
    ${palm(210, 134, 96, -8, 1)}${palm(270, 136, 118, 6, 1.15)}${palm(334, 134, 84, 10, 0.95)}${palm(392, 136, 70, -4, 0.8)}
    <path class="a-ground" d="M0,134 C160,130 320,136 480,132 V160 H0Z"/>
    <g transform="translate(140 132)"><path class="ps-basket" d="M-22,-8 H22 L17,10 H-17Z"/><path class="ps-basket-line" d="M-20,-2 H20 M-18,4 H18"/>
      ${[[-12, -10], [-4, -12], [4, -11], [12, -10], [-8, -14], [0, -15], [8, -14]].map(([x, y]) => `<ellipse class="a-dates" cx="${x}" cy="${y}" rx="4" ry="2.7"/>`).join("")}</g>`,

  // Progress: spring in the desert — green ground, flowers, a few truffles, a rain cloud leaving.
  spring: () => {
    const flowers = Array.from({ length: 26 }, (_, i) => {
      const x = (i * 97 + 30) % 460 + 10;
      const y = 124 + ((i * 37) % 30);
      return `<circle class="${["ps-flower-1", "ps-flower-2", "ps-flower-3"][i % 3]}" cx="${x}" cy="${y}" r="${i % 4 ? 2.2 : 3}"/>`;
    }).join("");
    return `${sky(90, 32)}
      <g class="ps-cloud"><path d="M300,44 a14,14 0 0 1 26,-6 a12,12 0 0 1 22,4 a10,10 0 0 1 2,20 h-48 a10,10 0 0 1 -2,-18z"/>
        <path class="ps-rain" d="M312,70 l-3,8 M326,70 l-3,8 M340,70 l-3,8"/></g>
      <path class="ps-grass-far" d="M0,108 C80,96 160,108 240,100 C320,92 400,104 480,96 V160 H0Z"/>
      <path class="ps-grass" d="M0,124 C120,114 240,128 360,120 C420,116 460,120 480,118 V160 H0Z"/>
      ${flowers}
      ${[[180, 140], [206, 146], [230, 138]].map(([x, y]) => `<ellipse class="ps-truffle" cx="${x}" cy="${y}" rx="7" ry="5"/><path class="ps-truffle-line" d="M${x - 3},${y - 2} l3,3 l3,-2"/>`).join("")}
      <g transform="translate(380 96) scale(.5)"><path class="ps-tent" d="M0,40 L10,8 C30,0 50,0 64,6 C80,0 100,0 116,8 L126,40 Z"/><path class="ps-tent-in" d="M44,40 L46,18 L82,18 L84,40Z"/></g>`;
  },

  // Calendar: the new crescent over the dunes and a mosque far away.
  crescent: () => `${sky(96, 30)}
    <g class="ps-crescent" transform="translate(368 18)"><circle class="a-moon-glow" cx="26" cy="26" r="34"/><path class="ps-crescent-moon" d="M32,4 A22,22 0 1 0 32,48 A26,26 0 0 1 32,4Z"/></g>
    ${dunes()}
    <g class="a-far" transform="translate(96 72)"><path d="M0,40 V22 a14,14 0 0 1 28,0 V40Z"/><path d="M14,8 v-6 h1 v6z"/><path d="M34,40 V6 h7 V40Z"/><path d="M33,6 h9 l-4.5,-6z"/></g>
    <path class="a-ground" d="M0,136 C160,132 320,138 480,134 V160 H0Z"/>`,

  // Letters: a sheet with calligraphy, the reed pen and ink.
  qalam: () => `${sky(90, 30)}
    <path class="ps-desk" d="M0,112 H480 V160 H0Z"/>
    <g transform="rotate(-4 300 92)"><rect class="a-paper-shadow" x="222" y="42" width="168" height="102" rx="4"/><rect class="a-paper" x="218" y="38" width="168" height="102" rx="4"/>
      <text class="a-ar a-green ps-callig" x="302" y="102" text-anchor="middle">سعودي</text>
      <path class="a-rule" d="M234,116 H372 M234,128 H340"/></g>
    <g transform="rotate(32 426 88)"><path class="a-qalam" d="M420,38 h10 v88 h-10z"/><path class="a-qalam-tip" d="M420,126 h10 l-5,14z"/></g>
    <path class="a-ink-pot" d="M150,126 h26 v18 a5,5 0 0 1 -5,5 h-16 a5,5 0 0 1 -5,-5z"/><rect class="a-brass-dark" x="154" y="120" width="18" height="7" rx="2"/>
    <circle class="a-ink" cx="194" cy="140" r="3"/><circle class="a-ink" cx="204" cy="144" r="1.8"/>`,

  // Saudi life: the mud towers of Diriyah with palms below.
  diriyah: () => {
    const tower = (x, h, w = 28) => `<path class="a-wall" d="M${x},134 L${x + 4},${134 - h} L${x + w - 4},${134 - h} L${x + w},134Z"/><path class="a-wall-shade" d="M${x + w * 0.62},${134 - h} L${x + w - 4},${134 - h} L${x + w},134 L${x + w * 0.64},134Z"/><path class="a-wall" d="${crenels(x + 4, 134 - h, w - 8, (w - 8) / 3, 7)}"/><path class="a-vent" d="${vents(x + 7, 134 - h + 18, 3, (w - 14) / 3, 4, 5)}"/>`;
    return `${sky(420, 32)}${dunes()}
      <g class="a-fort">${tower(150, 86)}${tower(186, 64, 44)}<path class="a-wall" d="M226,134 L228,90 L300,90 L302,134Z"/><path class="a-wall" d="${crenels(228, 90, 72, 9, 7)}"/>${tower(296, 98, 30)}${tower(330, 70, 40)}
        <path class="a-vent" d="${vents(236, 106, 5, 13)}"/></g>
      ${palm(120, 140, 70, -6, 0.8)}${palm(390, 140, 78, 8, 0.85)}${palm(430, 142, 58, -4, 0.7)}
      <path class="a-ground" d="M0,138 C160,134 320,140 480,136 V160 H0Z"/>`;
  },

  // Record: the rababa, the one-string fiddle of the desert, leaning by the fire — its sound rises. Tap: the bow plays.
  rababa: () => `${sky(318, 28)}${dunes()}
    <g class="ps-fire" transform="translate(104 0)">
      <circle class="ps-glow" cx="0" cy="124" r="28"/>
      <path class="ps-log" d="M-16,130 L14,122 L16,126 L-14,134 Z M-14,122 L16,130 L14,134 L-16,126 Z"/>
      <path class="ps-flame" d="M0,126 C-9,118 -8,106 0,94 C4,104 12,108 8,119 C6,124 4,126 0,126Z"/>
      <path class="ps-flame-core" d="M0,126 C-4,121 -4,114 0,107 C3,113 6,117 3,122 C2,125 1,126 0,126Z"/>
    </g>
    ${dallah(126, 92, 0.32)}${finjal(170, 128, 0.7)}
    <path class="ps-carpet" d="M200,132 H472 V142 H200Z"/><path class="ps-carpet-line" d="M208,137 H464"/>
    <path class="ps-cushion" d="M290,108 H366 V132 H290Z"/><rect class="ps-sadu-red" x="290" y="108" width="76" height="7"/>${saduRow(290, 115, 12, 6.3, 4)}
    ${finjal(232, 126, 0.8)}
    <g transform="translate(394 22) rotate(-8)">
      <circle class="ps-wood" cx="0" cy="-2" r="3.6"/>
      <path class="ps-wood" d="M-2.6,0 h5.2 v106 h-5.2z M-9,10 h18 v4.4 h-18z"/>
      <path class="ps-tassel" d="M8,14 C12,22 9,30 13,38 M9,14 C14,20 13,26 16,32"/>
      <rect class="ps-wood" x="-21" y="60" width="42" height="46" rx="3"/>
      <rect class="ps-skin" x="-17" y="64" width="34" height="38" rx="2"/>
      <path class="ps-wood" d="M-2,106 h4 v10 h-4z"/>
      <path class="ps-string" d="M1,12 V104"/>
      <path class="ps-sadu-dark" d="M-5,88 h10 v3 h-10z"/>
    </g>
    <g class="ps-bow"><path class="ps-bow-wood" d="M372,98 C384,80 416,68 440,72"/><path class="ps-bow-hair" d="M374,96 L438,74"/></g>
    <g class="ps-waves" transform="translate(430 100)">
      <path class="ps-wave" d="M0,-8 a9,9 0 0 1 0,16"/>
      <path class="ps-wave" style="animation-delay:.5s" d="M7,-14 a16,16 0 0 1 0,28"/>
      <path class="ps-wave" style="animation-delay:1s" d="M14,-20 a23,23 0 0 1 0,40"/>
    </g>`,

  // Suggestions: a painted Najdi door in a mud wall, a lantern beside it. Tap: the door swings open on a lit room.
  door: () => {
    const studs = [70, 82, 94, 106, 118, 130].map(y => `<circle class="ps-stud" cx="208" cy="${y}" r="1.3"/><circle class="ps-stud" cx="272" cy="${y}" r="1.3"/>`).join("");
    const diamonds = [0, 1, 2, 3, 4].map(i => `<path class="${i % 2 ? "ps-sadu-green" : "ps-sadu-cream"}" d="M${214 + i * 13},83 l5,6 l-5,6 l-5,-6z"/>`).join("");
    return `${sky(420, 30)}
      <path class="a-wall" d="M0,54 H480 V136 H0Z"/><path class="a-wall" d="${crenels(0, 54, 480, 12, 9)}"/>
      <path class="a-band" d="M0,66 h480 v3 h-480z"/>
      <path class="a-vent" d="${vents(24, 86, 5, 16, 5, 6)}${vents(344, 86, 5, 16, 5, 6)}"/>
      ${palm(440, 140, 90, -8, 0.9)}
      <path class="a-band" d="M60,136 V120 H176 V136Z"/><rect class="ps-sadu-red" x="64" y="113" width="108" height="7" rx="2"/>${saduRow(64, 120, 18, 6, 3.5)}
      ${finjal(140, 102, 0.8)}
      <path class="a-band" d="M194,136 V54 H286 V136Z"/><path class="a-door-paint" d="${crenels(196, 54, 88, 8, 7)}"/>
      <rect class="ps-door-in" x="204" y="62" width="72" height="74"/><rect class="ps-door-warm" x="204" y="62" width="72" height="74"/>
      <circle class="ps-lamp-glow" cx="250" cy="86" r="16"/><path class="ps-wood" d="M250,62 v18"/><circle class="ps-lamp" cx="250" cy="84" r="3.4"/>
      <path class="ps-cushion" d="M204,116 H276 V136 H204Z"/><rect class="ps-sadu-red" x="204" y="116" width="72" height="6"/>${saduRow(204, 122, 12, 6, 3.5)}
      <path class="ps-carpet" d="M204,132 H276 V136 H204Z"/>
      <g class="ps-door-leaf">
        <rect class="ps-wood" x="204" y="62" width="72" height="74"/>
        <path class="ps-door-plank" d="M222,62 V136 M240,62 V136 M258,62 V136"/>
        <rect class="ps-door-blue" x="206" y="65" width="68" height="12"/>
        <path class="a-door-paint" d="${Array.from({ length: 8 }, (_, i) => tri(207 + i * 8.25, 77, 8.25, 9)).join("")}"/>
        <rect class="ps-sadu-red" x="206" y="78" width="68" height="3"/>
        ${diamonds}
        <rect class="ps-sadu-red" x="206" y="96" width="68" height="3"/>
        <rect class="ps-door-small" x="222" y="104" width="36" height="32" rx="1"/>
        <path class="a-door-paint" d="${Array.from({ length: 4 }, (_, i) => tri(224 + i * 8, 112, 8, 6)).join("")}"/>
        <circle class="ps-knocker" cx="251" cy="122" r="3.6"/><circle class="ps-stud" cx="251" cy="118" r="1.4"/>
        ${studs}
      </g>
      <path class="a-band" d="M194,136 h92 v4 h-92z"/>
      <path class="ps-wood" d="M296,68 h16 v2.5 h-16z M303,70.5 v3"/>
      <circle class="ps-lamp-glow" cx="304" cy="84" r="15"/>
      <path class="a-brass-dark" d="${tri(296, 76, 16, 6)}"/><rect class="ps-lantern" x="298" y="76" width="12" height="15" rx="2"/><path class="a-brass-dark" d="M297,91 h14 v3 h-14z"/>
      <path class="a-ground" d="M0,136 C160,134 320,139 480,135 V160 H0Z"/>`;
  },

  // Printables: a desert well — Hafar al-Batin is named after the wells dug in its valley. A camel drinks at the
  // trough. Tap: the bucket comes up.
  well: () => `${sky(404, 30)}${dunes()}
    ${palm(58, 132, 82, -6, 0.85)}${palm(100, 134, 62, 6, 0.72)}
    <path class="ps-pole" d="M214,108 L222,40 M302,108 L294,40"/>
    <path class="ps-wood" d="M210,36 H306 V43 H210Z"/>
    <path class="ps-rope-line" d="M267,50 C282,70 300,100 322,132"/>
    <ellipse class="ps-well-hole" cx="258" cy="106" rx="44" ry="6"/>
    <path class="ps-rope-line ps-bucket-rope" d="M250,50 V87"/>
    <g class="ps-bucket"><path class="ps-dalw" d="M241,92 h18 l-3,15 h-12z"/><path class="ps-rope-line" d="M241,92 C244,86 256,86 259,92"/></g>
    <path class="ps-stone" d="M206,106 A52,8 0 0 0 310,106 V136 H206Z"/>
    <ellipse class="ps-stone-top" cx="258" cy="106" rx="52" ry="8"/><ellipse class="ps-well-hole" cx="258" cy="106" rx="43" ry="5"/>
    <path class="ps-stone-line" d="M206,122 C240,126 276,126 310,122 M206,134 H310 M226,115 V124 M258,116 V125 M290,115 V124 M242,125 V134 M274,125 V134"/>
    <g class="ps-pulley"><circle class="ps-wood" cx="258" cy="50" r="9"/><circle class="ps-sadu-dark" cx="258" cy="50" r="2.4"/><path class="ps-spoke" d="M258,42 V58 M250,50 H266"/></g>
    <path class="ps-stone" d="M334,124 h58 v12 h-58z"/><rect class="ps-water" x="337" y="124" width="52" height="3.4" rx="1.7"/>
    <g transform="translate(458 80) scale(-1 1)"><g class="ps-camel">${camel}</g></g>
    <path class="a-ground" d="M0,136 C160,133 320,139 480,135 V160 H0Z"/>`,
};

// The word under each scene: [Najdi, pronunciation, English, Ukrainian].
export const SCENE_WORDS = {
  tent: ["بيت الشعر", "bēt ash-shaʿar", "the goat-hair tent", "намет із козячої вовни"],
  camels: ["الإبل", "al-ibil", "camels", "верблюди"],
  falcon: ["الصقر", "aṣ-ṣagr", "the falcon", "сокіл"],
  souq: ["السوق", "as-sūg", "the market", "ринок"],
  roses: ["الورد", "al-ward", "roses", "троянди"],
  coffee: ["القهوة", "al-gahwa", "coffee", "кава"],
  nafud: ["النفود", "an-nufūd", "the Nafud, the red sand desert", "Нафуд, червона піщана пустеля"],
  mudhouse: ["بيت الطين", "bēt aṭ-ṭīn", "a mud-brick house", "глиняний будинок"],
  majlis: ["المجلس", "al-majlis", "the majlis, the sitting room for guests", "маджліс, кімната для гостей"],
  sadu: ["السدو", "as-sadu", "Sadu weaving", "ткацтво саду"],
  palms: ["النخل", "an-nakhl", "palm trees", "пальми"],
  spring: ["الربيع", "ar-rabīʿ", "spring, when the desert turns green", "весна, коли пустеля зеленіє"],
  crescent: ["الهلال", "al-hilāl", "the new crescent moon", "молодий місяць"],
  qalam: ["القلم", "al-galam", "the pen", "перо, ручка"],
  diriyah: ["الدرعية", "ad-dirʿiyya", "Diriyah, the old capital", "Дірія, стара столиця"],
  rababa: ["الربابة", "ar-rabāba", "the rababa, a desert fiddle", "ребаба, скрипка пустелі"],
  door: ["الباب", "al-bāb", "the door — Najdi doors are painted", "двері — у Наджді їх розписують"],
  well: ["البير", "al-bīr", "the well", "криниця"],
};

export const hasScene = name => Boolean(DRAW[name]);

// Where the subject of each scene sits (x in the 480-wide box), for small square crops.
const FOCUS = { tent: 280, camels: 190, falcon: 305, souq: 250, roses: 210, coffee: 230, nafud: 360, mudhouse: 268, majlis: 190, sadu: 150, palms: 280, spring: 205, crescent: 360, qalam: 300, diriyah: 260, rababa: 400, door: 240, well: 300 };

// The picture itself (no text inside it apart from Arabic digits and calligraphy that belong to the scene).
// square: a crop around the subject, for small pictures.
export const sceneSvg = (name, { square = false } = {}) => {
  const box = square ? `${Math.max(0, Math.min(W - 170, (FOCUS[name] ?? 240) - 85))} 0 170 ${H}` : `0 0 ${W} ${H}`;
  return `<svg class="pscene ps-${name}" viewBox="${box}" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
  <defs><linearGradient id="ps-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="ps-sky-top"/><stop offset="1" class="ps-sky-bottom"/></linearGradient></defs>
  ${DRAW[name]()}</svg>`;
};
