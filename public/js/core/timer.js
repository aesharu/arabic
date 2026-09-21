// The study timer. It keeps running while you move between pages (the sidebar shows it) and even if you close the
// tab; stopping it adds the minutes to the day it was started.
import * as store from "./store.js";

const MAX_SESSION_MIN = 240; // a forgotten timer never logs more than 4 hours

export const running = () => store.get().timer;
export const start = date => store.update(s => { s.timer = { start: Date.now(), date }; });

export function stop() {
  const timer = running();
  if (!timer) return;
  const min = Math.min(MAX_SESSION_MIN, Math.round((Date.now() - timer.start) / 60000));
  if (min > 0) store.addMinutes(timer.date, min);
  store.update(s => { s.timer = null; });
}

// 4:05 · 1:02:09
export function clock(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const mm = String(Math.floor((s % 3600) / 60)).padStart(h ? 2 : 1, "0");
  const ss = String(s % 60).padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}
