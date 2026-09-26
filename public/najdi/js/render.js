// HTML pieces for showing a note, shared by Study and Words.
import { esc, plain, arabicSpans, safeHtml, PLAY_ICON, SLOW_ICON, MALE_ICON, FEMALE_ICON } from "./util.js";
import { userOf } from "./deck.js";

export const F = (note, name) => plain(note.fields[name]);
export const hasAudio = (note, kind) => kind === "word"
  ? !!(note.audio.AudioWordMale || note.audio.AudioWordFemale)
  : !!(note.audio.AudioSentenceMale || note.audio.AudioSentenceFemale);

export function playBtn(note, kind, label, { voice = "", rate = "", cls = "", mark = "" } = {}) {
  if (!hasAudio(note, kind)) return "";
  const icon = rate ? SLOW_ICON : PLAY_ICON;
  const what = kind === "word" ? "word" : "sentence";
  const who = voice === "m" ? "man’s voice" : voice === "f" ? "woman’s voice" : "";
  return `<button class="play ${cls}${rate ? " slow" : ""}" data-play="${kind}" data-guid="${esc(note.guid)}"${voice ? ` data-voice="${voice}"` : ""}${rate ? ` data-rate="${rate}"` : ""}
    title="${rate ? "Slow" : "Play"} ${what}${who ? `, ${who}` : ""}" aria-label="${rate ? "Slow" : "Play"} ${what}${who ? `, ${who}` : ""}">${icon}${mark || (label ? `<span>${esc(label)}</span>` : "")}</button>`;
}

export function metaLine(note) {
  const bits = [];
  const pos = F(note, "PartOfSpeech"), g = F(note, "Gender"), pl = F(note, "Plural"), plt = F(note, "PluralTranslit");
  if (pos) bits.push(esc(pos));
  if (g) bits.push(g === "m" ? "masculine" : g === "f" ? "feminine" : esc(g));
  if (pl) bits.push(`plural <span class="ar">${esc(pl)}</span>${plt ? ` <i>${esc(plt)}</i>` : ""}`);
  return bits.length ? `<div class="meta">${bits.join(" · ")}</div>` : "";
}

export function wordBlock(note, { size = "", withMeaning = true } = {}) {
  return `<div class="ar word ${size}">${esc(F(note, "Arabic"))}</div>
    <div class="translit">${esc(F(note, "Transliteration"))}</div>
    ${withMeaning ? `<div class="meaning">${esc(F(note, "English"))}</div>` : ""}${metaLine(note)}`;
}

export function example(note, { audio = true } = {}) {
  const ar = F(note, "ExampleArabic");
  if (!ar) return "";
  return `<div class="ex"><div class="ar">${esc(ar)}</div>
    <div class="ex-tr">${esc(F(note, "ExampleTranslit"))}</div><div class="ex-en">${esc(F(note, "ExampleEnglish"))}</div>
    ${audio && hasAudio(note, "sent") ? `<div class="plays">${playBtn(note, "sent", "Sentence")}${playBtn(note, "sent", "", { voice: "m", cls: "icon", mark: MALE_ICON })}${playBtn(note, "sent", "", { voice: "f", cls: "icon", mark: FEMALE_ICON })}${playBtn(note, "sent", "", { rate: 0.7, cls: "icon" })}</div>` : ""}</div>`;
}

export function notes(note, { mine: showMine = true } = {}) {
  let h = "";
  const culture = F(note, "CulturalNote"), gulf = F(note, "GulfVariants"), mine = userOf(note.guid).note;
  if (culture) h += `<div class="note"><b>Culture</b>${arabicSpans(culture)}</div>`;
  if (gulf) h += `<div class="note"><b>Around the Gulf</b>${arabicSpans(gulf)}</div>`;
  if (mine && showMine) h += `<div class="note mine"><b>My note</b>${arabicSpans(mine)}</div>`;
  return h;
}

/** Non-vocab note types: first field is the front, the rest is the back. */
export function genericFront(note) {
  return `<div class="generic">${safeHtml(note.fields[note.fieldNames[0]])}</div>`;
}
export function genericBack(note) {
  const rest = note.fieldNames.slice(1).filter(n => plain(note.fields[n]) || /\[sound:|<img/.test(note.fields[n]));
  return `<div class="generic">${safeHtml(note.fields[note.fieldNames[0]])}</div>
    ${rest.map(n => `<div class="note"><b>${esc(n)}</b>${safeHtml(note.fields[n])}</div>`).join("")}`;
}
