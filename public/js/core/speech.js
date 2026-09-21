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
