// Tap-to-hear. Dima's own recording when she has made one (core/content.js) — a real Najdi voice.
// Otherwise the browser's built-in voice, which speaks formal Arabic, not Najdi (ق = q, not g),
// so each time it plays a short note says so.
import * as content from "./content.js";
import { t } from "./i18n.js";

export const canSpeak = "speechSynthesis" in window;

let voice = null;
function pickVoice() {
  const voices = speechSynthesis.getVoices();
  voice = voices.find(v => /^ar[-_]SA/i.test(v.lang)) || voices.find(v => /^ar/i.test(v.lang)) || null;
}
if (canSpeak) {
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
}

let toast = null;
let toastTimer = 0;
function robotNote() {
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "voice-toast";
    toast.setAttribute("role", "status");
    document.body.append(toast);
  }
  toast.textContent = t("speech.robot");
  toast.classList.add("is-on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-on"), 3200);
}

function robot(text) {
  if (!canSpeak) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ar-SA";
    if (voice) u.voice = voice;
    u.rate = 0.8;
    speechSynthesis.speak(u);
    robotNote();
  } catch {}
}

export function say(text) {
  if (content.hasAudio(text)) {
    if (canSpeak) speechSynthesis.cancel();
    content.playRecording(text).catch(() => robot(text));
    return;
  }
  robot(text);
}
