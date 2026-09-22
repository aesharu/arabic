// Tap-to-hear. Dima's own recording when she has made one (core/content.js) — a real Najdi voice.
// Otherwise the browser's built-in voice, which speaks formal Arabic, not Najdi (ق = q, not g),
// so each time it plays a short note says so.
import * as content from "./content.js";
import { t } from "./i18n.js";
import { toast } from "./toast.js";
import { SLOW, stop } from "./audiotools.js";

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

function robot(text, slow) {
  if (!canSpeak) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ar-SA";
    if (voice) u.voice = voice;
    u.rate = slow ? 0.5 : 0.8;
    speechSynthesis.speak(u);
    toast(slow ? `${t("speech.slow")} · ${t("speech.robot")}` : t("speech.robot"), { ms: 3200 });
  } catch {}
}

// Tap the same speaker again within a few seconds and it plays slowly (the next tap is normal again).
let last = { text: "", at: 0, slow: false };
export function say(text, { tap = false, slow } = {}) {
  run++; // a single word or sentence stops "Listen to all"
  const now = Date.now();
  slow ??= tap && last.tap && last.text === text && now - last.at < 5000 && !last.slow;
  last = { text, at: now, slow, tap };
  if (content.hasAudio(text)) {
    if (canSpeak) speechSynthesis.cancel();
    content.playRecording(text, slow ? SLOW : 1).then(() => slow && toast(t("speech.slowHint")), () => robot(text, slow));
    return;
  }
  stop();
  robot(text, slow);
}

// "Listen to all": one sentence after another — her recording when there is one, otherwise the computer voice
// (the note about it shows once). onLine(i) marks the sentence playing; onLine(-1) when it ends or stops.
// Returns stop().
let run = 0;
export function sayAll(texts, onLine = () => {}) {
  const id = ++run;
  let i = 0;
  let noted = false;
  const next = () => {
    if (id !== run) return;
    if (i >= texts.length) return onLine(-1);
    const k = i++;
    const text = texts[k];
    onLine(k);
    const computer = () => {
      if (!canSpeak) return next();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ar-SA";
      if (voice) u.voice = voice;
      u.rate = 0.8;
      u.onend = u.onerror = () => setTimeout(next, 250);
      speechSynthesis.speak(u);
      if (!noted) toast(t("speech.robot"), { ms: 3200 });
      noted = true;
    };
    if (content.hasAudio(text)) {
      if (canSpeak) speechSynthesis.cancel();
      content.playRecording(text).then(a => a.addEventListener("ended", () => setTimeout(next, 250), { once: true }), computer);
    } else computer();
  };
  stop();
  if (canSpeak) speechSynthesis.cancel();
  next();
  return () => {
    if (id !== run) return;
    run++;
    stop();
    if (canSpeak) speechSynthesis.cancel();
    onLine(-1);
  };
}
