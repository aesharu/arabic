// The microphone, for Volodymyr's own practice takes (views/speak.js). Dima's voice studio has its own
// copy of this (core/studio.js) because hers uploads to the server and must not change; this one only ever
// hands back a WAV in the browser.
// The microphone is released the moment a take ends — on the iPad a held microphone makes playback quiet.
import { audioContext, decode, findVoice, toWav, stop as stopPlayback } from "./audiotools.js";

export const MAX_SECONDS = 12;
export const canRecord = () => "MediaRecorder" in window && Boolean(navigator.mediaDevices?.getUserMedia);

// Start recording. onLevel(0…1) each frame for the meter, onDone({ blob, seconds }) when the take is finished,
// onFail() when the microphone can't be used. Returns a handle: stop() ends the take.
export async function record({ onLevel, onDone, onFail }) {
  const ac = audioContext(); // the iPad only wakes sound up inside a tap
  stopPlayback();
  if (!canRecord()) return onFail?.(), null;
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 } });
  } catch {
    onFail?.();
    return null;
  }
  const type = ["audio/mp4", "audio/webm;codecs=opus", "audio/webm"].find(x => MediaRecorder.isTypeSupported?.(x)) ?? "";
  const recorder = new MediaRecorder(stream, type ? { mimeType: type } : {});
  const chunks = [];
  const t0 = performance.now();
  let raf = 0;
  let live = true;

  recorder.ondataavailable = e => e.data.size && chunks.push(e.data);
  recorder.onstop = async () => {
    cancelAnimationFrame(raf);
    stream.getTracks().forEach(tr => tr.stop()); // let go of the microphone at once
    const blob = new Blob(chunks, { type: recorder.mimeType || type || "audio/mp4" });
    try {
      // Cut the silence either side, so "compare" plays the words and not the pause before them.
      const take = await decode(blob);
      const { start, end } = findVoice(take);
      onDone?.({ blob: toWav(take, start, end), seconds: Math.max(0.1, end - start) });
    } catch {
      onDone?.({ blob, seconds: (performance.now() - t0) / 1000 });
    }
  };

  let source = null;
  let analyser = null;
  try {
    source = ac.createMediaStreamSource(stream);
    analyser = ac.createAnalyser();
    analyser.fftSize = 1024;
    source.connect(analyser);
  } catch {}
  const buf = new Float32Array(1024);
  const tick = () => {
    if (!live) return;
    if (analyser) {
      analyser.getFloatTimeDomainData(buf);
      let peak = 0;
      for (const v of buf) peak = Math.max(peak, Math.abs(v));
      onLevel?.(Math.min(1, peak * 1.8), (performance.now() - t0) / 1000);
    }
    raf = requestAnimationFrame(tick);
  };

  recorder.start();
  tick();
  const auto = setTimeout(() => handle.stop(), MAX_SECONDS * 1000); // a forgotten take never runs on
  const handle = {
    stop() {
      if (!live) return;
      live = false;
      clearTimeout(auto);
      try {
        source?.disconnect();
      } catch {}
      if (recorder.state !== "inactive") recorder.stop();
      else stream.getTracks().forEach(tr => tr.stop());
    },
    get live() {
      return live;
    },
  };
  return handle;
}
