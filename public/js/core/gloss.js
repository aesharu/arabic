// Tap a word, see what it means. Works on any Arabic text in her dialect (stories, chats): it looks the word up
// in the word lists, and when it isn't there as written, it takes it apart the way Arabic builds words —
// و "and" + بيت "house" + ي "my"; ت…ين "you (to her)" + أروح "I go"; بـ "will" + أروح. No DOM here, so the tests
// can run it too.

// Letters only, spelled one way: no vowel marks or tatweel; أ إ آ → ا, ة → ه (people text both). ى stays, so على
// "on" and علي "on me" stay apart.
export const norm = s =>
  String(s ?? "")
    .replace(/[ً-ٰٟـ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/[^ء-ي ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// A text as words and what's between them (spaces, punctuation, emoji, Latin).
const WORD = /[ء-يً-ٰٟـ]+/g;
export function tokens(text) {
  const out = [];
  let last = 0;
  for (const m of text.matchAll(WORD)) {
    if (m.index > last) out.push({ sep: text.slice(last, m.index) });
    out.push({ w: m[0] });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ sep: text.slice(last) });
  return out;
}

// The pronunciation split into one piece per Arabic word ("w-inti" is one piece, like وانتي).
export const sayWords = say => String(say ?? "").split(/\s+/).map(w => w.replace(/^[^\p{L}ʿʾ]+|[^\p{L}ʿʾ]+$/gu, "")).filter(Boolean);

// The pieces a word can be built from, and how the page names them (strings gl.<key>).
const PREFIXES = [
  ["وبال", ["w", "b", "al"]], ["ولل", ["w", "l", "al"]], ["وال", ["w", "al"]], ["فال", ["f", "al"]], ["بال", ["b", "al"]],
  ["كال", ["k", "al"]], ["لل", ["l", "al"]], ["وهال", ["w", "hal"]], ["هال", ["hal"]], ["ال", ["al"]], ["وب", ["w", "b"]], ["ول", ["w", "l"]],
  ["و", ["w"]], ["ف", ["f"]], ["ب", ["b"]], ["ل", ["l"]], ["", []],
];
const SUFFIXES = [["كم", "kum"], ["هم", "hum"], ["ها", "ha"], ["نا", "na"], ["ني", "ni"], ["ي", "i"], ["ك", "k2"], ["ه", "h"], ["", null]];
// Endings on nouns and adjectives: سعودية = سعودي + feminine; مبسوطين = مبسوط + plural; سيارات = سيارة + plural.
const ENDINGS = [["تين", "two", "ه"], ["ين", "pl", ""], ["ات", "pl", "ه"], ["ات", "pl", ""], ["ه", "fem", ""]];
const PIECE_AR = {
  w: "و", f: "فـ", b: "بـ", l: "لـ", al: "الـ", hal: "هالـ", k: "كـ", will: "بـ",
  i: "ـي", ni: "ـني", k2: "ـك", h: "ـه", ha: "ـها", na: "ـنا", kum: "ـكم", hum: "ـهم",
  two: "ـين", pl: "ـين / ـات", fem: "ـة",
};

// Present tense: the person comes from the first letter and the ending (the plan's a- / ti- / ti-…-īn / yi- …).
const PRESENT = [["ين", { ت: "youF" }], ["ون", { ت: "youPl", ي: "they" }], ["", { ا: "i", ت: "youShe", ي: "he", ن: "we" }]];
// Past tense endings on the "I" form's stem (شفت → شفتي، شفنا، شفتو) and on the "he" form (راح → راحت، راحوا).
const PAST_I = [["تي", "youF"], ["توا", "youPl"], ["تو", "youPl"], ["نا", "we"]];
const PAST_HE = [["وا", "they"], ["ت", "she"]];

// Verb forms in lists that don't say so: "I …" on an أ- word is the present "I" form; "I …" on a word ending in
// ت is past "I"; "he …" / "it …" on a word that doesn't start with ي/ت is past "he".
function guessKind(e, k) {
  const en = String(e.en ?? "");
  if (/^I /.test(en) && k.startsWith("ا")) return "v";
  if (/^I /.test(en) && k.endsWith("ت")) return "p1";
  if (/^(he|it) /.test(en) && !/^[يت]/.test(k)) return "p3";
  return undefined;
}

// "كبير / صغير — big / small" is two words: each form with its own meaning (when the meanings split the same way).
function split(e) {
  const forms = String(e.ar).split(/ [/→] /);
  if (forms.length < 2) return [e];
  const cut = (x, sep) => String(x ?? "").split(sep).map(p => p.trim());
  const say = cut(e.say, /\s[/→]\s/), en = cut(e.en, / \/ /), uk = cut(e.uk, / \/ /);
  return forms.map((ar, i) => ({
    ...e, ar,
    say: say.length === forms.length ? say[i] : e.say,
    en: en.length === forms.length ? en[i] : e.en,
    uk: uk.length === forms.length ? uk[i] : e.uk,
  }));
}

// groups: lists of entries { ar, say, en, uk, check?, kind? } — earlier lists win. kind: "v" = a verb in the
// "I" form of the present (أروح), "p1" = past "I" form (رحت), "p3" = past "he" form (راح).
export function makeGlossary(groups) {
  const words = new Map();
  const phrases = new Map();
  const verbs = new Map();
  const past1 = new Map();
  const past3 = new Map();
  const bare = [];
  let longest = 1;
  for (const list of groups)
    for (const whole of list)
      for (const e of split(whole)) {
        const k = norm(e.ar);
        if (!k) continue;
        const n = k.split(" ").length;
        if (n > 1) {
          if (!phrases.has(k)) phrases.set(k, e);
          longest = Math.max(longest, n);
          continue;
        }
        if (!words.has(k)) words.set(k, e);
        const kind = e.kind ?? guessKind(e, k);
        const map = kind === "v" ? verbs : kind === "p1" ? past1 : kind === "p3" ? past3 : null;
        if (map && !map.has(k)) map.set(k, e);
        if (k.startsWith("ال") && k.length > 3 && k !== "الله") bare.push([k.slice(2), e]);
      }
  // "the coffee" in a list also teaches "coffee" (بالقهوة، للقهوة) — unless that word is in a list by itself.
  for (const [k, e] of bare) if (!words.has(k)) words.set(k, e);

  const tense = (e, who, t) => ({ e, who, tense: t });

  // A verb form with no prefixes or object endings left: present, future with بـ, or past.
  function verb(c, future) {
    for (const [end, people] of PRESENT) {
      if (!c.endsWith(end)) continue;
      const who = people[c[0]];
      if (!who) continue;
      const stem = c.slice(1, c.length - end.length);
      if (stem.length < 2) continue;
      const keys = ["ا" + stem];
      if (stem[0] === "ا") keys.push(stem); // تاكل → آكل
      if (end) keys.push("ا" + stem + "ي", "ا" + stem + "ى"); // تمشين → أمشي، تنسين → أنسى
      if (/[اى]$/.test(stem)) keys.push("ا" + stem.slice(0, -1) + "ى", "ا" + stem.slice(0, -1) + "ي"); // تنسا → أنسى
      for (const k of keys) if (verbs.has(k)) return tense(verbs.get(k), who, future ? "will" : "now");
    }
    // بـ + the "I" form without its أ: بروح "I'll go", باكل "I'll eat".
    if (future) {
      const e = verbs.get("ا" + c) ?? (c[0] === "ا" ? verbs.get(c) : null);
      return e ? tense(e, "i", "will") : null;
    }
    for (const [end, who] of PAST_I) {
      if (!c.endsWith(end)) continue;
      const stem = c.slice(0, c.length - end.length);
      if (past1.has(stem + "ت")) return tense(past1.get(stem + "ت"), who, "past");
      if (past3.has(stem)) return tense(past3.get(stem), who, "past"); // سولفنا: the "he" form is the stem
    }
    for (const [end, who] of PAST_HE) {
      if (!c.endsWith(end)) continue;
      const stem = c.slice(0, c.length - end.length);
      for (const k of [stem, stem + "ى", stem + "ي", stem + "ا"]) if (past3.has(k)) return tense(past3.get(k), who, "past");
    }
    return null;
  }

  // The best way to take a word apart: the fewest pieces wins; a word in a list as written beats everything.
  function lookup(word) {
    const w = norm(word);
    if (!w) return null;
    if (words.has(w)) return describe({ e: words.get(w), pre: [], suf: null, via: "word" });
    let best = null;
    const offer = f => {
      if (!best || f.cost < best.cost) best = f;
    };
    // Only the verb itself: تروحين, راحت, شفنا.
    const v0 = verb(w, false);
    if (v0) offer({ ...v0, via: "verb", pre: [], suf: null, cost: 0.5 });
    for (const [p, pre] of PREFIXES) {
      if (!w.startsWith(p)) continue;
      for (const [s, suf] of SUFFIXES) {
        if (!w.endsWith(s)) continue;
        const core = w.slice(p.length, w.length - s.length);
        if (core.length < 2) continue;
        const cost = pre.length + (suf ? 1 : 0);
        const at = { pre, suf };
        if (cost && words.has(core)) offer({ ...at, e: words.get(core), via: "word", cost });
        // A feminine noun keeps its ة as ت before an ending: زوجتي = زوجة + ي.
        if (suf && core.endsWith("ت") && words.has(core.slice(0, -1) + "ه")) offer({ ...at, e: words.get(core.slice(0, -1) + "ه"), via: "word", cost });
        for (const [end, key, add] of ENDINGS) {
          if (!core.endsWith(end) || core.length - end.length < 2 || (!pre.length && core.startsWith("ال"))) continue;
          const k = core.slice(0, core.length - end.length) + add;
          if (words.has(k)) offer({ ...at, e: words.get(k), via: "word", cost: cost + 1, end: key });
        }
        // Verbs take و / ف in front and object endings behind (never "my"); بـ right before a verb means "will".
        const future = pre.at(-1) === "b";
        const verbPre = pre.every((x, i) => x === "w" || x === "f" || (x === "b" && i === pre.length - 1));
        if (cost && verbPre && suf !== "i") {
          const v = verb(core, future);
          if (v) offer({ ...at, ...v, via: "verb", cost: cost + (future ? -0.25 : 0.5) });
          // بيروحون: بـ before a present-tense word from a list ("they go") is the future too.
          else if (future && /^[يتن]/.test(core) && words.has(core) && /^(they|he|she|we|you|it) /i.test(words.get(core).en ?? ""))
            offer({ ...at, e: words.get(core), via: "word", cost: cost - 0.25, tense: "will" });
        }
      }
    }
    return best ? describe(best) : null;
  }

  // { e, parts: [{ ar, key } | { ar, e }], who?, tense?, via }
  function describe(b) {
    const parts = [];
    for (const k of b.pre) {
      const key = b.tense === "will" && k === "b" ? "will" : k;
      parts.push({ ar: PIECE_AR[key], key });
    }
    const base = b.e.ar.replace(/[…؟]/g, "");
    if (b.pre.length || b.suf || b.end) parts.push({ ar: b.pre.includes("al") && base.startsWith("ال") ? base.slice(2) : base, e: b.e });
    if (b.end) parts.push({ ar: PIECE_AR[b.end], key: b.end });
    if (b.suf) parts.push({ ar: PIECE_AR[b.suf], key: b.suf });
    const who = b.who ?? (b.e.kind === "p1" ? "iYou" : undefined);
    const t = b.tense ?? (b.e.kind === "p1" || b.e.kind === "p3" ? "past" : undefined);
    return { e: b.e, parts: parts.length > 1 ? parts : [], who, tense: t, via: b.via };
  }

  // How many words from position i form one phrase in the lists ("إن شاء الله", "صباح الخير").
  function phraseAt(list, i) {
    for (let n = Math.min(longest, list.length - i); n > 1; n--) {
      const k = norm(list.slice(i, i + n).join(" "));
      if (phrases.has(k)) return { n, e: phrases.get(k) };
    }
    return null;
  }

  return { lookup, phraseAt };
}
