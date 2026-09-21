// Five seconds of oud and drum, made in the browser — no audio files.
// The oud is a Karplus–Strong plucked string (a short burst of noise fed round a delay line the length of
// one wave, so it rings at that pitch and softens as it decays). The melody is in maqam Hijaz on D,
// over the maqsum rhythm (dum tak – tak dum – tak –). Long notes use the oud's tremolo (risha).

const HZ = { D2: 73.42, D3: 146.83, Eb3: 155.56, Fs3: 185.0, G3: 196.0, A3: 220.0, Bb3: 233.08, C4: 261.63, D4: 293.66 };

// [start in seconds, note, length of tremolo in seconds (0 = one pluck)]
const MELODY = [
  [0.0, "D3", 0], [0.0, "D2", 0], [0.3, "Fs3", 0], [0.45, "G3", 0], [0.6, "A3", 0.5],
  [1.2, "Bb3", 0], [1.35, "A3", 0], [1.5, "G3", 0], [1.65, "Fs3", 0], [1.8, "G3", 0.2], [2.1, "A3", 0],
  [2.4, "D3", 0], [2.4, "D2", 0], [2.7, "A3", 0], [2.85, "Bb3", 0], [3.0, "C4", 0], [3.15, "Bb3", 0],
  [3.3, "A3", 0], [3.45, "G3", 0], [3.6, "Fs3", 0], [3.75, "Eb3", 0], [3.9, "D3", 0.7], [3.9, "D2", 0],
];
// Maqsum, one bar = 8 eighths of 0.3 s: dum on 1 and 4, tak on 2, 3 (off-beat) and 7.
const DRUM = [[0, "dum"], [0.3, "tak"], [0.9, "tak"], [1.2, "dum"], [1.8, "tak"], [2.4, "dum"], [2.7, "tak"], [3.3, "tak"], [3.6, "dum"], [4.2, "tak"], [4.5, "dum"]];

export const LENGTH = 5;

function pluck(out, sr, start, hz, gain) {
  const n = Math.round(sr / hz);
  const ring = new Float32Array(n);
  let prev = 0;
  for (let i = 0; i < n; i++) ring[i] = prev = prev * 0.55 + (Math.random() * 2 - 1) * 0.45; // darker noise = warmer, like gut strings
  const from = Math.floor(start * sr);
  const to = Math.min(out.length, from + Math.floor(1.8 * sr));
  for (let i = from, k = 0; i < to; i++, k++) {
    const j = k % n;
    const next = ring[(j + 1) % n];
    const s = ring[j];
    out[i] += s * gain;
    ring[j] = 0.4985 * (s + next);
  }
}

function drum(out, sr, start, kind) {
  const from = Math.floor(start * sr);
  const len = Math.floor((kind === "dum" ? 0.45 : 0.12) * sr);
  let phase = 0;
  let hp = 0;
  let last = 0;
  for (let k = 0; k < len && from + k < out.length; k++) {
    const t = k / sr;
    if (kind === "dum") {
      phase += (2 * Math.PI * (55 + 50 * Math.exp(-t * 30))) / sr; // the skin's pitch drops as it settles
      out[from + k] += Math.sin(phase) * Math.exp(-t * 9) * 0.55;
    } else {
      const noise = Math.random() * 2 - 1;
      hp = 0.7 * (hp + noise - last); // thin the noise to a rim "tak"
      last = noise;
      out[from + k] += hp * Math.exp(-t * 45) * 0.28;
    }
  }
}

function render(sr) {
  const out = new Float32Array(Math.ceil(LENGTH * sr));
  for (const [at, note, trem] of MELODY) {
    const bass = note === "D2";
    if (!trem) pluck(out, sr, at, HZ[note], bass ? 0.32 : 0.5);
    else for (let t = 0, i = 0; t <= trem; t += 0.075, i++) pluck(out, sr, at + t, HZ[note], (i ? 0.26 : 0.5) * (1 - t / (trem * 1.6)));
  }
  for (const [at, kind] of DRUM) drum(out, sr, at, kind);

  // A small room: two soft echoes, then a fade over the last second.
  const wet = Float32Array.from(out);
  for (const [d, g] of [[0.083, 0.22], [0.137, 0.16]]) {
    const off = Math.floor(d * sr);
    for (let i = off; i < out.length; i++) wet[i] += wet[i - off] * g;
  }
  let peak = 0;
  for (const v of wet) peak = Math.max(peak, Math.abs(v));
  const fade = Math.floor(sr);
  for (let i = 0; i < wet.length; i++) {
    const tail = wet.length - i;
    wet[i] = (wet[i] / peak) * 0.8 * (tail < fade ? tail / fade : 1);
  }
  return wet;
}

// Call from a click or key press: browsers only let sound start after the person does something.
export function play() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return () => {};
  try {
    if (navigator.audioSession) navigator.audioSession.type = "playback"; // iPhone: play even with the ring switch on silent
  } catch {}
  const ctx = new AC();
  ctx.resume();
  const data = render(ctx.sampleRate);
  const buf = ctx.createBuffer(1, data.length, ctx.sampleRate);
  buf.copyToChannel(data, 0);
  const src = ctx.createBufferSource();
  const vol = ctx.createGain();
  vol.gain.value = 0.9;
  src.buffer = buf;
  src.connect(vol).connect(ctx.destination);
  src.start();
  src.onended = () => ctx.close();
  // Stopping early (the person skipped): a short fade instead of a click.
  return () => {
    try {
      vol.gain.setTargetAtTime(0, ctx.currentTime, 0.08);
      setTimeout(() => ctx.close(), 400);
    } catch {}
  };
}

// The sun/moon button: two plucked notes — falling and low for night, rising and bright for day.
export function chime(toDark) {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  try {
    const ctx = new AC();
    const sr = ctx.sampleRate;
    const out = new Float32Array(Math.ceil(1.4 * sr));
    const notes = toDark ? [[0, HZ.A3], [0.11, HZ.D3], [0.11, HZ.D2]] : [[0, HZ.D4], [0.1, HZ.A3 * 2], [0.2, HZ.D4 * 2]];
    for (const [at, hz] of notes) pluck(out, sr, at, hz, 0.5);
    let peak = 0;
    for (const v of out) peak = Math.max(peak, Math.abs(v));
    for (let i = 0; i < out.length; i++) out[i] = (out[i] / (peak || 1)) * 0.35 * Math.min(1, (out.length - i) / (0.4 * sr));
    const buf = ctx.createBuffer(1, out.length, sr);
    buf.copyToChannel(out, 0);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start();
    src.onended = () => ctx.close();
  } catch {}
}
