// Sound for the voice studio (core/studio.js) and every speaker button:
//   play(url, rate)     one sound at a time; rate 0.65 = slow, with the pitch kept natural
//   decode(blob)        what the microphone recorded, as plain samples
//   findVoice(take)     where the voice starts and ends, so silence can be cut off
//   peaks(take, n)      the shape of the sound, for drawing it
//   toWav(take, a, b)   the part from a to b seconds as a small WAV file: loudness evened out, no clicks
export const SLOW = 0.65;

let ctx = null;
// One AudioContext for the page. iPad starts it only from a tap, so call this first thing in a tap handler.
export function audioContext() {
  ctx ??= new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

let current = null;
export function stop() {
  current?.pause();
  current = null;
}

export function play(url, rate = 1) {
  stop();
  const a = new Audio(url);
  a.preservesPitch = a.webkitPreservesPitch = true;
  a.defaultPlaybackRate = a.playbackRate = rate;
  a.addEventListener("play", () => (a.playbackRate = rate), { once: true }); // Safari can reset it on load
  current = a;
  return a.play().then(() => a);
}

export async function decode(blob) {
  const audio = await audioContext().decodeAudioData(await blob.arrayBuffer());
  const n = audio.length;
  const samples = new Float32Array(n);
  for (let c = 0; c < audio.numberOfChannels; c++) {
    const d = audio.getChannelData(c);
    for (let i = 0; i < n; i++) samples[i] += d[i] / audio.numberOfChannels;
  }
  return { samples, rate: audio.sampleRate, duration: n / audio.sampleRate };
}

// Loudness in 10 ms steps.
function levels({ samples, rate }) {
  const win = Math.max(1, Math.round(rate / 100));
  const out = new Float32Array(Math.floor(samples.length / win));
  for (let k = 0; k < out.length; k++) {
    let s = 0;
    for (let i = k * win; i < (k + 1) * win; i++) s += samples[i] * samples[i];
    out[k] = Math.sqrt(s / win);
  }
  return out;
}

// The voice is where it's clearly louder than the quiet parts, for at least 40 ms (so a tap on the screen doesn't count).
export function findVoice(take) {
  const lv = levels(take);
  if (!lv.length) return { start: 0, end: take.duration };
  let peak = 0;
  for (const v of lv) peak = Math.max(peak, v);
  const floor = [...lv].sort((a, b) => a - b)[Math.floor(lv.length * 0.1)];
  const thr = Math.max(floor * 3, peak * 0.07, 0.002);
  const run = 4;
  const loud = k => lv.slice(k, k + run).every(v => v > thr);
  let a = 0;
  while (a < lv.length - run && !loud(a)) a++;
  let b = lv.length - run;
  while (b > a && !loud(b)) b--;
  if (a >= lv.length - run) return { start: 0, end: take.duration };
  return { start: Math.max(0, a / 100 - 0.12), end: Math.min(take.duration, (b + run) / 100 + 0.2) };
}

export function peaks({ samples }, n) {
  const out = new Float32Array(n);
  const step = samples.length / n;
  for (let k = 0; k < n; k++) {
    let m = 0;
    for (let i = Math.floor(k * step); i < Math.floor((k + 1) * step); i++) m = Math.max(m, Math.abs(samples[i]));
    out[k] = m;
  }
  return out;
}

// About 24 000 samples a second is plenty for a voice and keeps ten seconds under 500 KB.
export function toWav({ samples, rate }, start, end) {
  const f = Math.max(1, Math.round(rate / 24000));
  const r = Math.round(rate / f);
  const from = Math.floor(start * rate);
  const n = Math.max(1, Math.floor((Math.ceil(end * rate) - from) / f));
  const out = new Float32Array(n);
  let peak = 0;
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let j = 0; j < f; j++) s += samples[from + i * f + j] ?? 0;
    out[i] = s / f;
    peak = Math.max(peak, Math.abs(out[i]));
  }
  const gain = peak > 0 ? Math.min(0.9 / peak, 6) : 1;
  const fade = Math.min(Math.round(r * 0.012), n >> 2);
  const buf = new ArrayBuffer(44 + n * 2);
  const v = new DataView(buf);
  const text = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  text(0, "RIFF");
  v.setUint32(4, 36 + n * 2, true);
  text(8, "WAVEfmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true); // PCM
  v.setUint16(22, 1, true); // mono
  v.setUint32(24, r, true);
  v.setUint32(28, r * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  text(36, "data");
  v.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) {
    let s = out[i] * gain;
    if (i < fade) s *= i / fade;
    if (i >= n - fade) s *= (n - 1 - i) / fade;
    s = Math.max(-1, Math.min(1, s));
    v.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([buf], { type: "audio/wav" });
}
