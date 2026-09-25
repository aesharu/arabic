// The pictures in the book (data/book.js). Flat shapes on a 64×64 square, coloured by CSS classes (p-*), so
// every theme repaints them from its own tokens — the same way the rest of the site's art works (core/art.js).
// They are decoration: every one of them sits next to the word it draws, and is aria-hidden.
//
//   p-k ink · p-w white with an outline · p-sand p-gold p-green p-red p-blue p-brown p-rose p-sky p-teal
//   p-purple p-orange p-grey — flat fills · p-l a line, no fill

const PICS = {
  // --- the chapter pictures ---
  alphabet: `<rect class="p-w" x="8" y="12" width="48" height="40" rx="4"/><path class="p-l" d="M8 12h48v40H8z"/>
    <path class="p-l" d="M32 12v40"/><text class="p-ar p-red" x="20" y="36" text-anchor="middle">ا</text>
    <text class="p-ar p-blue" x="44" y="36" text-anchor="middle">ب</text>`,
  qalam: `<path class="p-brown" d="M52 8l6 5-34 40-8 3 2-8z"/><path class="p-k" d="M18 48l-2 8 8-3z"/>
    <path class="p-gold" d="M46 14l6 5-4 5-6-5z"/><path class="p-l" d="M10 58h44"/>`,
  night: `<path class="p-k" d="M40 6a20 20 0 1 0 8 30 16 16 0 0 1-8-30z"/>
    <circle class="p-gold" cx="16" cy="14" r="2"/><circle class="p-gold" cx="26" cy="24" r="1.6"/><circle class="p-gold" cx="10" cy="28" r="1.6"/>
    <path class="p-sand" d="M0 44c12-8 22 0 34-4 10-3 22 0 30 6v18H0z"/>
    <path class="p-gold" d="M2 56c14-6 24 2 36-2 8-3 18-1 26 3v7H2z"/>`,
  pages: `<path class="p-w" d="M32 16C24 10 14 9 6 12v38c8-3 18-2 26 4z"/><path class="p-w" d="M32 16c8-6 18-7 26-4v38c-8-3-18-2-26 4z"/>
    <path class="p-l" d="M32 16v38M12 20h12M12 27h12M12 34h10M40 20h12M40 27h12M40 34h10"/>`,
  // --- animals ---
  rabbit: `<ellipse class="p-w" cx="36" cy="42" rx="15" ry="11"/><circle class="p-w" cx="21" cy="33" r="9"/>
    <ellipse class="p-w" cx="17" cy="17" rx="3.5" ry="10" transform="rotate(-12 17 17)"/>
    <ellipse class="p-w" cx="26" cy="16" rx="3.5" ry="10" transform="rotate(8 26 16)"/>
    <circle class="p-k" cx="16" cy="32" r="1.6"/><circle class="p-w" cx="51" cy="38" r="5"/>`,
  camel: `<ellipse class="p-sand" cx="29" cy="36" rx="16" ry="9"/><circle class="p-sand" cx="29" cy="27" r="9"/>
    <path class="p-sand" d="M41 34c4-4 5-10 5-16l6 1c0 8-2 14-6 19z"/><ellipse class="p-sand" cx="50" cy="16" rx="6" ry="4"/>
    <circle class="p-k" cx="52" cy="15" r="1.2"/>
    <path class="p-l" d="M20 44v10M28 45v9M36 45v9M42 44v10"/>`,
  hen: `<ellipse class="p-w" cx="30" cy="38" rx="15" ry="12"/><circle class="p-w" cx="43" cy="26" r="7"/>
    <path class="p-red" d="M41 18c1-4 4-4 5-1 2-3 5-2 4 2z"/><path class="p-gold" d="M49 27l6 2-6 2z"/>
    <circle class="p-k" cx="45" cy="25" r="1.3"/><path class="p-l" d="M26 50v5M34 50v5"/>
    <path class="p-sand" d="M15 34c-4 3-4 9 0 12 3-4 3-8 0-12z"/>`,
  wolf: `<path class="p-grey" d="M18 26l-3-11 10 5h14l10-5-3 11c4 5 4 14-2 18-4 3-9 4-13 4s-9-1-13-4c-6-4-6-13-2-18z"/>
    <path class="p-w" d="M26 40h12l-6 8z"/><circle class="p-k" cx="25" cy="32" r="2"/><circle class="p-k" cx="39" cy="32" r="2"/>`,
  sheep: `<ellipse class="p-w" cx="30" cy="34" rx="17" ry="13"/><circle class="p-w" cx="16" cy="28" r="7"/>
    <circle class="p-w" cx="44" cy="26" r="7"/><ellipse class="p-k" cx="46" cy="38" rx="6" ry="7"/>
    <circle class="p-w" cx="47" cy="36" r="1.5"/><path class="p-l" d="M22 46v8M34 46v8"/>`,
  falcon: `<path class="p-brown" d="M34 14c7 0 12 6 12 14 0 10-5 18-12 22-7-4-12-12-12-22 0-8 5-14 12-14z"/>
    <path class="p-brown" d="M22 24c-8 2-13 8-14 16 6-2 10-6 14-8z"/><circle class="p-w" cx="38" cy="22" r="3"/>
    <circle class="p-k" cx="38" cy="22" r="1.4"/><path class="p-gold" d="M44 22l7 3-7 3z"/>`,
  lizard: `<path class="p-sand" d="M14 34c0-5 6-8 14-8s14 3 14 8-6 8-14 8-14-3-14-8z"/>
    <path class="p-sand" d="M42 34c6-1 10-5 14-11 1 8-4 15-12 17z"/><circle class="p-sand" cx="13" cy="34" r="6"/>
    <circle class="p-k" cx="10" cy="31" r="1.4"/><path class="p-l" d="M20 42l-4 7M34 42l4 7M20 26l-4-6M34 26l4-6"/>`,
  rug: `<path class="p-red" d="M8 18h48v28H8z"/><path class="p-w" d="M8 24h48v3H8zM8 37h48v3H8z"/>
    <path class="p-k" d="M20 28l4 5-4 5-4-5zM32 28l4 5-4 5-4-5zM44 28l4 5-4 5-4-5z"/>
    <path class="p-l" d="M10 46v5M18 46v5M26 46v5M34 46v5M42 46v5M50 46v5M10 18v-5M18 18v-5M26 18v-5M34 18v-5M42 18v-5M50 18v-5"/>`,
  // --- the desert and the sky ---
  palm: `<rect class="p-brown" x="29" y="28" width="6" height="28" rx="2"/>
    <path class="p-green" d="M32 26c-10-8-18-8-24-2 8-1 15 1 20 5zM32 26c10-8 18-8 24-2-8-1-15 1-20 5zM32 24c-4-10-2-17 4-21-1 8 0 14 2 19zM32 26c6-6 14-8 20-5-6 1-12 4-16 8z"/>
    <circle class="p-gold" cx="30" cy="30" r="2"/><circle class="p-gold" cx="35" cy="31" r="2"/>`,
  dune: `<path class="p-gold" d="M2 50c10-12 20-4 30-14 8-8 20-6 30 2v14H2z"/>
    <path class="p-sand" d="M2 56c14-8 26 2 38-4 8-4 18-2 22 2v6H2z"/>`,
  mountain: `<path class="p-grey" d="M4 52l16-26 10 15 8-12 22 23z"/><path class="p-w" d="M20 26l6 9H14z"/>
    <path class="p-w" d="M38 29l5 7h-9z"/>`,
  wadi: `<path class="p-gold" d="M2 34c10-8 18 2 30-2 10-4 20 0 30 6v14H2z"/>
    <path class="p-blue" d="M6 50c8-6 16 2 26-2 8-3 18-1 26 4v2H6z"/>
    <rect class="p-brown" x="14" y="26" width="3" height="12"/><path class="p-green" d="M15 26c-5-5-9-5-12-2 4 0 7 1 9 3zM16 26c5-5 9-5 12-2-4 0-7 1-9 3z"/>`,
  star: `<path class="p-gold" d="M32 8l6 16 17 2-13 11 4 17-14-9-14 9 4-17L9 26l17-2z"/>`,
  moon: `<path class="p-gold" d="M42 10a24 24 0 1 0 8 36 19 19 0 0 1-8-36z"/><circle class="p-gold" cx="48" cy="16" r="3"/>`,
  sun: `<circle class="p-gold" cx="32" cy="32" r="14"/>
    <path class="p-l" d="M32 8v6M32 50v6M8 32h6M50 32h6M15 15l4 4M45 45l4 4M49 15l-4 4M19 45l-4 4"/>`,
  cloud: `<path class="p-w" d="M18 44a11 11 0 0 1-1-22 15 15 0 0 1 28 3 10 10 0 0 1-2 19z"/>`,
  rain: `<path class="p-w" d="M18 36a10 10 0 0 1-1-20 14 14 0 0 1 26 3 9 9 0 0 1-2 17z"/>
    <path class="p-blue" d="M20 42l-3 8M30 42l-3 10M40 42l-3 8"/>`,
  wind: `<path class="p-l" d="M6 24h30a6 6 0 1 0-6-6M6 34h40a6 6 0 1 1-6 6M6 44h22a5 5 0 1 1-5 5"/>`,
  snow: `<path class="p-sky" d="M32 8v48M12 20l40 24M52 20L12 44"/>
    <path class="p-sky" d="M26 14l6 6 6-6M26 50l6-6 6 6M12 28l2 8-8 2M52 28l-2 8 8 2"/>`,
  rose: `<path class="p-green" d="M31 36h3v20h-3z"/><path class="p-green" d="M32 46c-7 0-11-4-12-9 7-1 11 3 12 9z"/>
    <circle class="p-rose" cx="32" cy="24" r="14"/><circle class="p-red" cx="32" cy="24" r="8"/><circle class="p-rose" cx="32" cy="24" r="3"/>`,
  // --- the house ---
  house: `<path class="p-sand" d="M10 30L32 12l22 18v24H10z"/><path class="p-brown" d="M27 40h10v14H27z"/>
    <rect class="p-sky" x="15" y="34" width="8" height="8"/><rect class="p-sky" x="41" y="34" width="8" height="8"/>
    <path class="p-l" d="M6 31L32 10l26 21"/>`,
  door: `<rect class="p-brown" x="15" y="8" width="34" height="48" rx="3"/>
    <rect class="p-gold" x="20" y="13" width="24" height="38" rx="2"/>
    <path class="p-brown" d="M32 13v38M20 32h24"/><circle class="p-brown" cx="25" cy="32" r="2.2"/>`,
  window: `<rect class="p-sky" x="12" y="12" width="40" height="40" rx="3"/>
    <path class="p-brown" d="M30 12h4v40h-4zM12 30h40v4H12z"/>
    <rect class="p-l" x="12" y="12" width="40" height="40" rx="3"/>`,
  bed: `<rect class="p-brown" x="6" y="32" width="52" height="14" rx="3"/>
    <rect class="p-w" x="11" y="24" width="18" height="10" rx="4"/>
    <path class="p-blue" d="M30 30h24a4 4 0 0 1 4 4v2H30z"/>
    <rect class="p-brown" x="7" y="46" width="4" height="9"/><rect class="p-brown" x="53" y="46" width="4" height="9"/>`,
  sofa: `<rect class="p-teal" x="8" y="28" width="48" height="16" rx="5"/>
    <rect class="p-teal" x="4" y="32" width="8" height="16" rx="4"/><rect class="p-teal" x="52" y="32" width="8" height="16" rx="4"/>
    <rect class="p-w" x="16" y="30" width="14" height="10" rx="3"/><rect class="p-w" x="34" y="30" width="14" height="10" rx="3"/>
    <path class="p-l" d="M10 48v6M54 48v6"/>`,
  table: `<rect class="p-brown" x="6" y="24" width="52" height="7" rx="2"/>
    <path class="p-brown" d="M12 31h5v25h-5zM47 31h5v25h-5z"/>`,
  chair: `<rect class="p-brown" x="16" y="8" width="8" height="34" rx="3"/>
    <rect class="p-brown" x="16" y="34" width="34" height="7" rx="2"/>
    <path class="p-brown" d="M17 41h5v15h-5zM44 41h5v15h-5z"/><rect class="p-gold" x="20" y="14" width="18" height="5" rx="2"/>`,
  fridge: `<rect class="p-w" x="18" y="6" width="28" height="52" rx="4"/><path class="p-l" d="M18 26h28"/>
    <rect class="p-grey" x="40" y="16" width="3" height="7" rx="1.5"/><rect class="p-grey" x="40" y="30" width="3" height="9" rx="1.5"/>`,
  key: `<circle class="p-gold" cx="20" cy="26" r="11"/><circle class="p-sand" cx="20" cy="26" r="4"/>
    <path class="p-gold" d="M28 30l24 20-5 6-4-3-4 4-4-3 3-4-13-11z"/>`,
  lamp: `<path class="p-gold" d="M32 10a13 13 0 0 1 7 24v4H25v-4a13 13 0 0 1 7-24z"/>
    <rect class="p-grey" x="25" y="40" width="14" height="5" rx="1.5"/><rect class="p-grey" x="27" y="46" width="10" height="4" rx="1.5"/>
    <path class="p-l" d="M12 16l6 3M52 16l-6 3M32 4v5"/>`,
  pot: `<path class="p-grey" d="M12 28h40v16a8 8 0 0 1-8 8H20a8 8 0 0 1-8-8z"/>
    <rect class="p-grey" x="8" y="24" width="48" height="5" rx="2"/><rect class="p-brown" x="28" y="18" width="8" height="5" rx="2"/>
    <path class="p-l" d="M22 14c0-4 4-4 4-8M32 12c0-4 4-4 4-8"/>`,
  plate: `<circle class="p-w" cx="32" cy="32" r="22"/><circle class="p-sand" cx="32" cy="32" r="14"/>
    <circle class="p-l" cx="32" cy="32" r="22"/>`,
  spoon: `<ellipse class="p-grey" cx="32" cy="18" rx="9" ry="12"/><rect class="p-grey" x="29" y="28" width="6" height="28" rx="3"/>`,
  cup: `<path class="p-w" d="M20 22h24v20a12 12 0 0 1-24 0z"/><path class="p-l" d="M20 22h24v20a12 12 0 0 1-24 0z"/>
    <path class="p-gold" d="M22 34h20v8a10 10 0 0 1-20 0z"/>`,
  // --- food and drink ---
  bread: `<ellipse class="p-sand" cx="32" cy="34" rx="23" ry="16"/><ellipse class="p-gold" cx="32" cy="34" rx="18" ry="12"/>
    <circle class="p-brown" cx="26" cy="30" r="1.6"/><circle class="p-brown" cx="37" cy="36" r="1.6"/>
    <circle class="p-brown" cx="40" cy="29" r="1.6"/><circle class="p-brown" cx="25" cy="39" r="1.6"/>`,
  rice: `<path class="p-w" d="M10 32h44c0 12-10 20-22 20s-22-8-22-20z"/>
    <path class="p-w" d="M18 30c4-8 24-8 28 0z"/><path class="p-l" d="M10 32h44"/>
    <circle class="p-sand" cx="26" cy="26" r="2"/><circle class="p-sand" cx="34" cy="24" r="2"/><circle class="p-sand" cx="40" cy="27" r="2"/>`,
  meat: `<path class="p-red" d="M16 24c6-10 26-10 32 0 5 8 2 20-8 24s-22 1-25-8c-2-6-1-12 1-16z"/>
    <path class="p-w" d="M28 26c6-3 12-1 14 4-5-2-10-2-14-1z"/><path class="p-brown" d="M30 42l16 12-3 4-16-13z"/>`,
  fish: `<path class="p-sky" d="M8 32c8-12 26-14 36-6 4 3 7 6 9 6-2 0-5 3-9 6-10 8-28 6-36-6z"/>
    <path class="p-blue" d="M8 32l-6-9v18z"/><circle class="p-w" cx="38" cy="28" r="3"/><circle class="p-k" cx="38" cy="28" r="1.4"/>`,
  egg: `<ellipse class="p-w" cx="24" cy="34" rx="13" ry="16"/><ellipse class="p-w" cx="44" cy="40" rx="11" ry="13"/>
    <ellipse class="p-gold" cx="44" cy="40" rx="5" ry="5"/>`,
  dates: `<ellipse class="p-brown" cx="24" cy="32" rx="7" ry="12" transform="rotate(-14 24 32)"/>
    <ellipse class="p-brown" cx="36" cy="30" rx="7" ry="12" transform="rotate(10 36 30)"/>
    <ellipse class="p-brown" cx="30" cy="44" rx="7" ry="11" transform="rotate(-4 30 44)"/>
    <path class="p-green" d="M24 19l3-7 3 7z"/>`,
  milk: `<path class="p-w" d="M22 20h20v34a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4z"/>
    <path class="p-w" d="M26 8h12v12H26z"/><path class="p-l" d="M22 20h20M26 8h12v12"/>
    <path class="p-blue" d="M24 34h16v20a4 4 0 0 1-4 4H28a4 4 0 0 1-4-4z"/>`,
  water: `<path class="p-sky" d="M32 6c8 12 16 20 16 30a16 16 0 0 1-32 0c0-10 8-18 16-30z"/>
    <path class="p-w" d="M24 38a8 8 0 0 0 6 10c-6 0-10-4-10-10z"/>`,
  tea: `<path class="p-w" d="M20 18h22l-4 30a6 6 0 0 1-6 5h-2a6 6 0 0 1-6-5z"/>
    <path class="p-gold" d="M22 30h18l-2 18a5 5 0 0 1-5 4h-4a5 5 0 0 1-5-4z"/>
    <path class="p-l" d="M20 18h22l-4 30a6 6 0 0 1-6 5h-2a6 6 0 0 1-6-5z"/><path class="p-l" d="M26 12c0-3 3-3 3-6M35 12c0-3 3-3 3-6"/>`,
  coffee: `<path class="p-gold" d="M30 20c-6 2-9 8-9 16 0 10 3 16 5 20h16c2-4 5-10 5-20 0-8-3-14-9-16z"/>
    <path class="p-gold" d="M32 20l-4-8h12l-4 8zM47 26l8-6-2 12z"/>
    <path class="p-gold" d="M21 32c-6 2-6 12 0 14"/><path class="p-w" d="M10 44h12l-2 8h-8z"/>`,
  // --- out in the world ---
  car: `<path class="p-red" d="M8 42v-8l6-2 6-9h24l6 9 6 2v8z"/><path class="p-sky" d="M23 26h8v7H18zM34 26h8l5 7H34z"/>
    <circle class="p-k" cx="19" cy="44" r="6"/><circle class="p-k" cx="45" cy="44" r="6"/>
    <circle class="p-w" cx="19" cy="44" r="2.4"/><circle class="p-w" cx="45" cy="44" r="2.4"/>`,
  road: `<path class="p-grey" d="M22 56L14 8h36l-8 48z"/><path class="p-w" d="M31 12h2l-1 8h-2zM30 26h4l-1 8h-3zM29 40h6l-1 10h-5z"/>`,
  plane: `<path class="p-w" d="M6 34l10-4 14 2 8-18 6 2-2 18 14 4v5l-14 2-2 12-5 1-3-12-14 2z"/>
    <path class="p-l" d="M6 34l10-4 14 2 8-18 6 2-2 18 14 4v5l-14 2-2 12-5 1-3-12-14 2z"/>`,
  market: `<path class="p-red" d="M6 22h52l-4 10H10z"/><path class="p-w" d="M14 22l-2 10h8l2-10zM30 22h8v10h-8zM46 22l2 10h-8l-2-10z"/>
    <rect class="p-brown" x="10" y="32" width="44" height="4"/><path class="p-brown" d="M14 36h4v20h-4zM46 36h4v20h-4z"/>
    <circle class="p-green" cx="26" cy="42" r="4"/><circle class="p-gold" cx="36" cy="42" r="4"/>`,
  mall: `<rect class="p-teal" x="8" y="16" width="48" height="40" rx="3"/>
    <path class="p-sky" d="M13 22h14v10H13zM37 22h14v10H37zM13 36h14v8H13zM37 36h14v8H37z"/>
    <path class="p-w" d="M28 44h8v12h-8z"/><path class="p-gold" d="M20 10h24v6H20z"/>`,
  school: `<path class="p-sand" d="M10 26h44v30H10z"/><path class="p-green" d="M6 26L32 10l26 16z"/>
    <path class="p-w" d="M28 40h8v16h-8z"/><rect class="p-sky" x="16" y="34" width="7" height="7"/><rect class="p-sky" x="41" y="34" width="7" height="7"/>`,
  hospital: `<rect class="p-w" x="10" y="20" width="44" height="36" rx="3"/><path class="p-l" d="M10 20h44v36H10z"/>
    <path class="p-green" d="M44 6a14 14 0 1 0 8 26 11 11 0 0 1-8-26z"/>
    <rect class="p-sky" x="16" y="28" width="8" height="8"/><rect class="p-sky" x="28" y="28" width="8" height="8"/>
    <path class="p-w" d="M26 44h12v12H26z"/>`,
  work: `<rect class="p-brown" x="8" y="24" width="48" height="28" rx="4"/>
    <path class="p-brown" d="M24 24v-5a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v5"/><path class="p-l" d="M24 24v-5a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v5"/>
    <rect class="p-gold" x="28" y="34" width="8" height="7" rx="1.5"/><path class="p-brown" d="M8 34h48v3H8z"/>`,
  money: `<rect class="p-green" x="6" y="18" width="52" height="28" rx="4"/>
    <circle class="p-w" cx="32" cy="32" r="9"/><path class="p-green" d="M28 32h8M32 27v10"/>
    <circle class="p-w" cx="14" cy="24" r="2"/><circle class="p-w" cx="50" cy="40" r="2"/>`,
  phone: `<rect class="p-k" x="18" y="6" width="28" height="52" rx="6"/><rect class="p-sky" x="21" y="12" width="22" height="38" rx="2"/>
    <circle class="p-grey" cx="32" cy="54" r="2.4"/><path class="p-w" d="M25 20h14v3H25zM25 27h10v3H25z"/>`,
  clock: `<circle class="p-w" cx="32" cy="34" r="22"/><circle class="p-l" cx="32" cy="34" r="22"/>
    <path class="p-k" d="M31 18h2v17h-2z"/><path class="p-k" d="M32 33l12 7-1 2-12-7z"/>
    <circle class="p-gold" cx="32" cy="34" r="3"/><path class="p-l" d="M32 8v4"/>`,
  bag: `<path class="p-brown" d="M12 24h40v26a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6z"/>
    <path class="p-l" d="M24 24v-6a8 8 0 0 1 16 0v6"/><rect class="p-gold" x="27" y="32" width="10" height="8" rx="2"/>`,
  medicine: `<rect class="p-w" x="20" y="18" width="24" height="34" rx="4"/><path class="p-l" d="M20 18h24v34H20z"/>
    <rect class="p-red" x="24" y="8" width="16" height="10" rx="2"/>
    <path class="p-green" d="M30 28h4v6h6v4h-6v6h-4v-6h-6v-4h6z"/>`,
  // --- clothes and things you wear ---
  thobe: `<path class="p-w" d="M24 14h16l12 8-5 8-5-3v29H22V27l-5 3-5-8z"/><path class="p-l" d="M24 14h16l12 8-5 8-5-3v29H22V27l-5 3-5-8z"/>
    <path class="p-l" d="M32 18v14"/>`,
  abaya: `<path class="p-k" d="M32 18c-8 0-12 6-13 12l-5 26h36l-5-26c-1-6-5-12-13-12z"/><circle class="p-k" cx="32" cy="14" r="8"/>`,
  shmagh: `<path class="p-red" d="M14 14h36l-2 26c-1 10-7 16-16 16s-15-6-16-16z"/>
    <path class="p-w" d="M14 20h36l-.5 6h-35zM15 30h34l-.5 6h-33z"/>
    <path class="p-k" d="M16 10h32a4 4 0 0 1 4 4v4H12v-4a4 4 0 0 1 4-4z"/>`,
  dress: `<path class="p-rose" d="M26 12h12l4 10-4 4 8 30H18l8-30-4-4z"/><path class="p-l" d="M26 12h12l4 10-4 4 8 30H18l8-30-4-4z"/>`,
  shoe: `<path class="p-k" d="M8 40c6 0 10-2 14-6l8-8 6 4c4 3 10 4 18 4 4 0 6 3 6 6v6H8z"/>
    <path class="p-w" d="M8 44h48v3H8z"/>`,
  glasses: `<circle class="p-l" cx="18" cy="34" r="11"/><circle class="p-l" cx="46" cy="34" r="11"/>
    <path class="p-l" d="M29 32h6M7 30L2 26M57 30l5-4"/>`,
  ring: `<circle class="p-gold" cx="32" cy="40" r="15"/><circle class="p-sand" cx="32" cy="40" r="9"/>
    <path class="p-sky" d="M32 8l8 10-8 8-8-8z"/>`,
  perfume: `<rect class="p-rose" x="20" y="26" width="24" height="30" rx="5"/><rect class="p-gold" x="27" y="14" width="10" height="12" rx="2"/>
    <rect class="p-k" x="25" y="8" width="14" height="7" rx="2"/><path class="p-w" d="M25 34h14v8H25z"/>`,
  // --- the body and faces ---
  eye: `<path class="p-w" d="M4 32c8-12 18-18 28-18s20 6 28 18c-8 12-18 18-28 18S12 44 4 32z"/>
    <path class="p-l" d="M4 32c8-12 18-18 28-18s20 6 28 18c-8 12-18 18-28 18S12 44 4 32z"/>
    <circle class="p-teal" cx="32" cy="32" r="10"/><circle class="p-k" cx="32" cy="32" r="5"/>`,
  hand: `<path class="p-sand" d="M20 56V36l-6-6a4 4 0 0 1 6-5l4 4V12a4 4 0 0 1 8 0v12a4 4 0 0 1 8 0v3a4 4 0 0 1 8 0v4a4 4 0 0 1 6 4c0 10-4 21-10 21z"/>
    <path class="p-l" d="M32 24v10M40 27v7M48 31v4"/>`,
  leg: `<path class="p-sand" d="M24 8h14v24c0 8 4 10 4 16 0 5-4 8-9 8h-9c-3 0-6-2-6-6 0-8 6-12 6-20z"/>
    <path class="p-l" d="M24 30h14"/>`,
  tooth: `<path class="p-w" d="M16 20c0-8 6-12 16-12s16 4 16 12c0 12-3 16-5 26-1 5-6 5-7 0l-4-14-4 14c-1 5-6 5-7 0-2-10-5-14-5-26z"/>
    <path class="p-l" d="M16 20c0-8 6-12 16-12s16 4 16 12c0 12-3 16-5 26-1 5-6 5-7 0l-4-14-4 14c-1 5-6 5-7 0-2-10-5-14-5-26z"/>`,
  heart: `<path class="p-red" d="M32 56C14 42 6 34 6 24 6 16 12 10 19 10c5 0 10 3 13 7 3-4 8-7 13-7 7 0 13 6 13 14 0 10-8 18-26 32z"/>`,
  face: `<circle class="p-sand" cx="32" cy="32" r="22"/><circle class="p-l" cx="32" cy="32" r="22"/>
    <circle class="p-k" cx="24" cy="28" r="2.4"/><circle class="p-k" cx="40" cy="28" r="2.4"/>
    <path class="p-l" d="M22 40c4 4 16 4 20 0"/>`,
  him: `<circle class="p-sand" cx="32" cy="24" r="12"/><path class="p-w" d="M18 22a14 14 0 0 1 28 0l2 6H16z"/>
    <path class="p-k" d="M18 16h28a3 3 0 0 1 3 3v3H15v-3a3 3 0 0 1 3-3z"/>
    <path class="p-green" d="M32 38c10 0 16 7 16 18H16c0-11 6-18 16-18z"/>`,
  her: `<circle class="p-sand" cx="32" cy="26" r="11"/>
    <path class="p-k" d="M32 10c9 0 14 7 14 16 0 6-2 10-4 12l-3-2c2-3 3-6 3-10 0-6-4-10-10-10s-10 4-10 10c0 4 1 7 3 10l-3 2c-2-2-4-6-4-12 0-9 5-16 14-16z"/>
    <path class="p-rose" d="M32 38c10 0 16 7 16 18H16c0-11 6-18 16-18z"/>`,
  family: `<circle class="p-sand" cx="17" cy="26" r="8"/><path class="p-green" d="M17 36c7 0 11 6 11 20H6c0-14 4-20 11-20z"/>
    <circle class="p-sand" cx="45" cy="26" r="8"/><path class="p-rose" d="M45 36c7 0 11 6 11 20H34c0-14 4-20 11-20z"/>
    <circle class="p-sand" cx="31" cy="38" r="6"/><path class="p-gold" d="M31 45c5 0 8 4 8 11H23c0-7 3-11 8-11z"/>`,
  "f-happy": `<circle class="p-gold" cx="32" cy="32" r="24"/><circle class="p-k" cx="23" cy="27" r="3"/><circle class="p-k" cx="41" cy="27" r="3"/>
    <path class="p-l" d="M19 38c5 8 21 8 26 0"/>`,
  "f-sad": `<circle class="p-gold" cx="32" cy="32" r="24"/><circle class="p-k" cx="23" cy="28" r="3"/><circle class="p-k" cx="41" cy="28" r="3"/>
    <path class="p-l" d="M20 46c5-8 19-8 24 0"/><path class="p-sky" d="M23 33c2 4 2 7 0 7s-2-3 0-7z"/>`,
  "f-tired": `<circle class="p-gold" cx="32" cy="32" r="24"/><path class="p-l" d="M17 28c4-3 8-3 12 0M35 28c4-3 8-3 12 0"/>
    <path class="p-l" d="M24 44h16"/><path class="p-l" d="M44 14h10l-10 10h10"/>`,
  "f-hungry": `<circle class="p-gold" cx="32" cy="32" r="24"/><circle class="p-k" cx="23" cy="27" r="3"/><circle class="p-k" cx="41" cy="27" r="3"/>
    <ellipse class="p-k" cx="32" cy="42" rx="9" ry="7"/><path class="p-w" d="M25 40h14v3H25z"/>`,
  "f-scared": `<circle class="p-gold" cx="32" cy="32" r="24"/><circle class="p-w" cx="23" cy="28" r="5"/><circle class="p-w" cx="41" cy="28" r="5"/>
    <circle class="p-k" cx="23" cy="28" r="2.4"/><circle class="p-k" cx="41" cy="28" r="2.4"/>
    <ellipse class="p-k" cx="32" cy="44" rx="6" ry="5"/>`,
  "f-sick": `<circle class="p-gold" cx="32" cy="32" r="24"/><path class="p-l" d="M17 26l10 6M47 26l-10 6"/>
    <path class="p-l" d="M22 44c4-4 6 4 10 0s6 4 10 0"/><rect class="p-w" x="38" y="12" width="18" height="6" rx="3" transform="rotate(-12 47 15)"/>`,
};

export const hasPic = name => Object.hasOwn(PICS, String(name ?? ""));

// A picture, ready to drop into a page. Nothing here is ever the only way to read something.
export const pic = (name, cls = "") =>
  PICS[name]
    ? `<svg class="pic${cls ? " " + cls : ""}" viewBox="0 0 64 64" aria-hidden="true" focusable="false">${PICS[name]}</svg>`
    : "";

export const PIC_NAMES = Object.keys(PICS);
