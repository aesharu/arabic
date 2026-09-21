// Tap-to-hear through the browser's built-in voices. On a Mac the Saudi voice is "Majed".
// It speaks standard Arabic, so for Najdi sounds (ق = g, ض = ظ) trust the notes, not the voice.
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

export function say(text) {
  if (!canSpeak) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ar-SA";
    if (voice) u.voice = voice;
    u.rate = 0.8;
    speechSynthesis.speak(u);
  } catch {}
}
