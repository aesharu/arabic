// The voice studio: Dima records a word or a line, listens to it (normally or slowly), cuts off the silence,
// picks the best of her takes and saves it. Nothing reaches the site until she presses Save, and every save
// or delete can be undone (the server keeps the version before, see worker/index.js).
//   openStudio(items, index, { onClose })   items: words or lines { id, ar, say, en, speak? }; ‹ › move through them
import { t, tx, num } from "./i18n.js";
import { esc, ar, translit } from "./dom.js";
import { icon } from "./art.js";
import * as content from "./content.js";
import { toast, rescue } from "./toast.js";
import { speakText } from "./vocab.js";
import { audioContext, decode, findVoice, peaks, toWav, play, stop, SLOW } from "./audiotools.js";

const MAX_S = 10; // a word or a phrase — never more than a few seconds
const MAX_BYTES = 600_000; // what the server accepts
const MIN_GAP = 0.15; // the shortest cut, in seconds
export const spoken = n => n.speak ?? speakText(n.ar);

// Unsaved takes stay with their word while she moves around, until the page is left.
const drafts = new Map(); // id → { takes: [{ blob, take, start, end }], sel }

export function openStudio(items, index = 0, { onClose } = {}) {
  let i = index;
  let rec = null; // while recording: { recorder, stream, source, analyser, t0, bars, raf, auto }
  let starting = false; // the microphone is being switched on (the iPad may be asking for permission)
  let leaving = false; // "close anyway?" is showing
  let prevUrl = null; // the earlier version on the server, if any
  let playhead = 0;
  const draft = () => {
    const id = items[i].id;
    if (!drafts.has(id)) drafts.set(id, { takes: [], sel: -1 });
    return drafts.get(id);
  };

  const dlg = document.createElement("dialog");
  dlg.className = "studio";
  dlg.setAttribute("aria-labelledby", "st-title");
  document.body.append(dlg);

  const msg = text => {
    const el = dlg.querySelector(".st-msg");
    if (el) el.textContent = text;
  };

  // ---------- Drawing ----------
  function paint() {
    if (leaving && ![...drafts.values()].some(x => x.takes.length)) leaving = false;
    const n = items[i];
    const d = draft();
    const tk = d.takes[d.sel];
    const saved = content.hasAudio(spoken(n));
    const recording = Boolean(rec);
    const note = dlg.querySelector(".voice-toast"); // an Undo message outlives the redraw
    dlg.innerHTML = `
      <div class="st-top">
        <span class="st-count">${esc(t("studio.of", { n: num(i + 1), total: num(items.length) }))}</span>
        <span class="st-nav">
          <button type="button" class="st-iconbtn" data-prev aria-label="${esc(t("studio.prev"))}"${i === 0 || recording ? " disabled" : ""}>${icon("back")}</button>
          <button type="button" class="st-iconbtn" data-next aria-label="${esc(t("studio.next"))}"${i === items.length - 1 || recording ? " disabled" : ""}>${icon("arrow")}</button>
        </span>
        <button type="button" class="st-iconbtn st-close" data-close aria-label="${esc(t("studio.close"))}">${icon("close")}</button>
      </div>
      ${leaving ? `<div class="st-confirm" role="alert"><p>${t("studio.leave")}</p>
        <button type="button" class="btn" data-stay>${t("studio.stay")}</button>
        <button type="button" class="btn btn-ghost st-danger" data-leave>${t("studio.leaveAnyway")}</button></div>` : ""}
      <header class="st-word">
        <h2 id="st-title">${ar(n.ar, "st-ar")}</h2>
        <p>${translit(n.say)} · <span>${esc(n.en)}</span></p>
      </header>

      <section class="st-card st-saved${saved ? "" : " is-empty"}">
        <p class="st-label">${saved ? `${icon("check")} ${t("studio.onSite")}` : t("studio.none")}</p>
        ${saved ? `<div class="st-row">
          <button type="button" class="btn" data-play-saved>${icon("play")} ${t("record.play")}</button>
          <button type="button" class="btn" data-slow-saved>${icon("slow")} ${t("studio.slow")}</button>
          <button type="button" class="btn btn-ghost st-danger" data-delete>${icon("trash")} ${t("studio.delete")}</button>
        </div>` : ""}
        ${prevUrl ? `<div class="st-row st-prev"><span>${t("studio.earlier")}</span>
          <button type="button" class="btn btn-ghost" data-play-prev aria-label="${esc(t("record.play"))}">${icon("play")}</button>
          <button type="button" class="btn btn-ghost" data-restore>${icon("undo")} ${t("studio.bringBack")}</button></div>` : ""}
      </section>

      <section class="st-card st-new${tk || recording ? "" : " is-empty"}">
        ${d.takes.length > 1 ? `<div class="st-takes" role="group" aria-label="${esc(t("studio.takes"))}">${d.takes.map((_, k) => `
          <button type="button" data-take="${k}" aria-pressed="${k === d.sel}">${esc(t("studio.take", { n: num(k + 1) }))}</button>`).join("")}</div>` : ""}
        <div class="st-wave" dir="ltr"${tk?.take ? ` style="--a:${tk.start / tk.take.duration};--b:${tk.end / tk.take.duration}"` : ""}>
          <canvas aria-hidden="true"></canvas>
          ${tk?.take && !recording ? `
            <span class="st-dim st-dim-a"></span><span class="st-dim st-dim-b"></span>
            <button type="button" class="st-handle" data-h="a" aria-label="${esc(t("studio.start"))}"></button>
            <button type="button" class="st-handle" data-h="b" aria-label="${esc(t("studio.end"))}"></button>
            <span class="st-playhead" hidden></span>` : ""}
          ${!tk && !recording ? `<span class="st-wave-empty">${t("studio.tapToRecord")}</span>` : ""}
        </div>
        ${tk && !recording ? `
          ${tk.take ? `<p class="st-hint">${esc(t("studio.trimHint", { s: num((tk.end - tk.start).toFixed(1)) }))}</p>` : ""}
          <div class="st-row">
            <button type="button" class="btn" data-play-take>${icon("play")} ${t("record.play")}</button>
            <button type="button" class="btn" data-slow-take>${icon("slow")} ${t("studio.slow")}</button>
            <button type="button" class="btn btn-ghost" data-discard>${icon("trash")} ${t("studio.discard")}</button>
          </div>` : ""}
      </section>

      <div class="st-rec">
        <button type="button" class="st-mic${recording ? " is-on" : ""}" data-rec aria-label="${esc(t(recording ? "record.stop" : d.takes.length ? "record.redo" : "record.start"))}">${icon(recording ? "stop" : "mic")}</button>
        <p class="st-rec-label">${recording ? `<b class="st-time">0:00</b> ${t("studio.recording")}` : t(d.takes.length || saved ? "record.redo" : "record.start")}</p>
      </div>

      <p class="st-msg" aria-live="polite"></p>
      ${tk && !recording ? `<div class="st-actions">
        <button type="button" class="btn btn-primary" data-save>${icon("check")} ${t("studio.save")}</button>
        ${i < items.length - 1 ? `<button type="button" class="btn" data-save-next>${t("studio.saveNext")} ${icon("arrow")}</button>` : ""}
      </div>` : ""}`;
    if (note) dlg.append(note);
    draw();
  }

  function colors() {
    const cs = getComputedStyle(dlg);
    return { on: cs.getPropertyValue("--accent").trim() || "#006C35", off: cs.getPropertyValue("--muted").trim() || "#888", rec: cs.getPropertyValue("--bad").trim() || "#c00" };
  }

  // The take's shape: bars, bright inside the part that is kept.
  function draw() {
    const cv = dlg.querySelector(".st-wave canvas");
    if (!cv) return;
    const w = cv.clientWidth;
    const h = cv.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    const g = cv.getContext("2d");
    g.scale(dpr, dpr);
    g.clearRect(0, 0, w, h);
    const c = colors();
    const bar = (x, v, color) => {
      const bh = Math.max(2, Math.min(1, v) * (h - 8));
      g.fillStyle = color;
      g.beginPath();
      g.roundRect ? g.roundRect(x, (h - bh) / 2, 2.4, bh, 1.2) : g.rect(x, (h - bh) / 2, 2.4, bh);
      g.fill();
    };
    if (rec) {
      rec.bars.forEach(([at, v]) => bar((at / MAX_S) * (w - 3), v, c.rec));
      return;
    }
    const tk = draft().takes[draft().sel];
    if (!tk?.take) return;
    const count = Math.max(20, Math.floor(w / 4));
    const p = peaks(tk.take, count);
    let top = 0;
    for (const v of p) top = Math.max(top, v);
    p.forEach((v, k) => {
      const at = ((k + 0.5) / count) * tk.take.duration;
      bar(k * (w / count), top ? v / top : 0, at >= tk.start && at <= tk.end ? c.on : c.off);
    });
  }

  // ---------- Recording ----------
  async function startRecording() {
    if (starting) return;
    const ac = audioContext(); // iPad only starts sound from inside a tap
    stop();
    msg("");
    if (!("MediaRecorder" in window) || !navigator.mediaDevices?.getUserMedia) return msg(t("record.noMic"));
    let stream;
    starting = true;
    dlg.querySelector(".st-mic")?.classList.add("is-starting");
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 } });
    } catch {
      starting = false;
      dlg.querySelector(".st-mic")?.classList.remove("is-starting");
      return msg(t("record.noMic"));
    }
    starting = false;
    if (!dlg.open) return stream.getTracks().forEach(tr => tr.stop());
    const type = ["audio/mp4", "audio/webm;codecs=opus", "audio/webm"].find(x => MediaRecorder.isTypeSupported?.(x)) ?? "";
    const recorder = new MediaRecorder(stream, type ? { mimeType: type } : {});
    const chunks = [];
    recorder.ondataavailable = e => e.data.size && chunks.push(e.data);
    let source = null;
    let analyser = null;
    try {
      source = ac.createMediaStreamSource(stream);
      analyser = ac.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
    } catch {}
    rec = { recorder, stream, source, analyser, t0: performance.now(), bars: [] };
    rec.auto = setTimeout(stopRecording, MAX_S * 1000);
    recorder.onstop = () => finish(new Blob(chunks, { type: recorder.mimeType || type || "audio/mp4" }));
    recorder.start();
    paint();
    const buf = new Float32Array(1024);
    const tick = () => {
      if (!rec) return;
      const at = (performance.now() - rec.t0) / 1000;
      if (rec.analyser) {
        rec.analyser.getFloatTimeDomainData(buf);
        let s = 0;
        for (const v of buf) s += v * v;
        rec.bars.push([at, Math.min(1, Math.sqrt(s / buf.length) * 5)]);
      }
      const time = dlg.querySelector(".st-time");
      if (time) time.textContent = `0:${String(Math.floor(at)).padStart(2, "0")}`;
      dlg.querySelector(".st-mic")?.style.setProperty("--p", Math.min(1, at / MAX_S));
      draw();
      rec.raf = requestAnimationFrame(tick);
    };
    tick();
  }

  function stopRecording() {
    if (rec?.recorder.state === "recording") rec.recorder.stop();
  }

  // The microphone is let go after every take, so the iPad plays sound at full volume again.
  async function finish(blob) {
    const r = rec;
    clearTimeout(r.auto);
    cancelAnimationFrame(r.raf);
    r.source?.disconnect();
    r.stream.getTracks().forEach(tr => tr.stop());
    if (r.recorder.state === "recording") r.recorder.stop();
    rec = null;
    if (!blob?.size) return dlg.open && (msg(blob ? t("studio.empty") : ""), paint());
    const d = draft();
    let entry = { blob, take: null, start: 0, end: 0 };
    try {
      const take = await decode(blob);
      entry = { blob, take, ...findVoice(take) };
    } catch {} // an old browser that can't read it back: it's kept whole, without cutting
    d.takes.push(entry);
    d.sel = d.takes.length - 1;
    if (!dlg.open) return;
    paint();
    playTake(1); // she hears what she just said
  }

  // ---------- Listening ----------
  const takeBlob = tk => (tk.take ? toWav(tk.take, tk.start, tk.end) : tk.blob);

  function playTake(rate) {
    const tk = draft().takes[draft().sel];
    if (!tk) return;
    const url = URL.createObjectURL(takeBlob(tk));
    play(url, rate).then(a => follow(a, tk, rate), () => {});
  }

  // A line moves along the shape while it plays.
  function follow(a, tk) {
    const line = dlg.querySelector(".st-playhead");
    if (!line || !tk.take) return;
    cancelAnimationFrame(playhead);
    line.hidden = false;
    const step = () => {
      if (a.paused || a.ended || !line.isConnected) {
        line.hidden = true;
        return;
      }
      line.style.left = `${((tk.start + a.currentTime) / tk.take.duration) * 100}%`;
      playhead = requestAnimationFrame(step);
    };
    step();
  }

  // ---------- Cutting: drag the two edges (or use the arrow keys on them) ----------
  function setEdge(which, sec) {
    const tk = draft().takes[draft().sel];
    if (!tk?.take) return;
    const dur = tk.take.duration;
    if (which === "a") tk.start = Math.max(0, Math.min(sec, tk.end - MIN_GAP));
    else tk.end = Math.min(dur, Math.max(sec, tk.start + MIN_GAP));
    const wave = dlg.querySelector(".st-wave");
    wave.style.setProperty("--a", tk.start / dur);
    wave.style.setProperty("--b", tk.end / dur);
    const hint = dlg.querySelector(".st-hint");
    if (hint) hint.textContent = t("studio.trimHint", { s: num((tk.end - tk.start).toFixed(1)) });
    draw();
  }

  let dragging = null;
  dlg.addEventListener("pointerdown", e => {
    const h = e.target.closest(".st-handle");
    if (!h) return;
    e.preventDefault();
    dragging = h.dataset.h;
    h.setPointerCapture(e.pointerId);
  });
  dlg.addEventListener("pointermove", e => {
    if (!dragging) return;
    const tk = draft().takes[draft().sel];
    const box = dlg.querySelector(".st-wave").getBoundingClientRect();
    setEdge(dragging, ((e.clientX - box.left) / box.width) * tk.take.duration);
  });
  const endDrag = () => {
    if (dragging) playTake(1); // hear the new cut
    dragging = null;
  };
  dlg.addEventListener("pointerup", endDrag);
  dlg.addEventListener("pointercancel", endDrag);
  dlg.addEventListener("keydown", e => {
    const h = e.target.closest?.(".st-handle");
    if (!h || !["ArrowLeft", "ArrowRight"].includes(e.key)) return;
    e.preventDefault();
    const tk = draft().takes[draft().sel];
    setEdge(h.dataset.h, (h.dataset.h === "a" ? tk.start : tk.end) + (e.key === "ArrowRight" ? 0.05 : -0.05));
  });

  // ---------- Saving, deleting, undoing ----------
  async function loadPrev() {
    const n = items[i];
    prevUrl = null;
    const url = await content.previousUrl(spoken(n)).catch(() => null);
    if (items[i] === n && dlg.open) {
      prevUrl = url;
      if (!rec && url) paint();
    }
  }

  const undoer = text => () =>
    content.restoreRecording(text).then(() => {
      toast(t("edit.undone"));
      if (dlg.open) (paint(), loadPrev());
    }, () => toast(t("record.error")));

  async function save(andNext) {
    const n = items[i];
    const text = spoken(n);
    const d = draft();
    const blob = takeBlob(d.takes[d.sel]);
    if (blob.size > MAX_BYTES) return msg(t("studio.tooLong"));
    dlg.querySelectorAll(".st-actions button").forEach(b => (b.disabled = true));
    msg(t("record.saving"));
    try {
      await content.upload(text, blob);
    } catch {
      dlg.querySelectorAll(".st-actions button").forEach(b => (b.disabled = false));
      return msg(t("record.error"));
    }
    drafts.delete(n.id);
    toast(t("studio.savedToast"), { action: t("studio.undo"), onAction: undoer(text) });
    if (andNext && i < items.length - 1) go(i + 1);
    else {
      paint();
      loadPrev();
    }
  }

  async function remove() {
    const text = spoken(items[i]);
    try {
      await content.removeRecording(text);
    } catch {
      return msg(t("record.error"));
    }
    toast(t("studio.deletedToast"), { action: t("studio.undo"), onAction: undoer(text) });
    paint();
    loadPrev();
  }

  function go(k) {
    stop();
    i = Math.max(0, Math.min(items.length - 1, k));
    prevUrl = null;
    paint();
    loadPrev();
  }

  function close(force = false) {
    const unsaved = [...drafts.values()].some(d => d.takes.length);
    if (unsaved && !force) {
      leaving = true;
      return paint();
    }
    if (rec) {
      rec.recorder.onstop = null;
      finish(null);
    }
    drafts.clear();
    stop();
    rescue(); // an Undo message still showing stays on the page
    dlg.close();
    dlg.remove();
    onClose?.();
  }

  dlg.addEventListener("cancel", e => {
    e.preventDefault();
    close();
  });
  dlg.addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b || b.disabled) return;
    const text = spoken(items[i]);
    const d = draft();
    if (b.matches("[data-close]")) return close();
    if (b.matches("[data-leave]")) return close(true);
    if (b.matches("[data-stay]")) {
      leaving = false;
      return paint();
    }
    if (b.matches("[data-prev]")) return go(i - 1);
    if (b.matches("[data-next]")) return go(i + 1);
    if (b.matches("[data-rec]")) return rec ? stopRecording() : startRecording();
    if (b.matches("[data-play-saved], [data-slow-saved]")) return content.playRecording(text, b.matches("[data-slow-saved]") ? SLOW : 1).catch(() => msg(t("record.error")));
    if (b.matches("[data-play-prev]")) return play(prevUrl).catch(() => {});
    if (b.matches("[data-restore]")) return undoer(text)();
    if (b.matches("[data-delete]")) return remove();
    if (b.matches("[data-take]")) {
      d.sel = +b.dataset.take;
      paint();
      return playTake(1);
    }
    if (b.matches("[data-play-take]")) return playTake(1);
    if (b.matches("[data-slow-take]")) return playTake(SLOW);
    if (b.matches("[data-discard]")) {
      d.takes.splice(d.sel, 1);
      d.sel = d.takes.length - 1;
      stop();
      return paint();
    }
    if (b.matches("[data-save]")) return save(false);
    if (b.matches("[data-save-next]")) return save(true);
  });
  const redraw = () => dlg.isConnected ? draw() : removeEventListener("resize", redraw);
  addEventListener("resize", redraw);

  paint();
  dlg.showModal();
  dlg.querySelector("[data-rec]")?.focus();
  loadPrev();
}
