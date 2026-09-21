// Cloud save: keeps this browser's progress and the D1 database in step.
// Local-first — the site always works from localStorage; the cloud copy is pulled on start and pushed a few
// seconds after each change. When two computers both changed things, the logs are merged day by day
// (more minutes wins, ticked tasks and done letter groups are combined) and each card keeps its newest version,
// so nothing studied is ever lost.
import * as store from "./store.js";

const DEBOUNCE_MS = 3000;
let timer = null;
let lastPushed = ""; // skip pushes when only per-computer settings (language, theme) changed
let status = { state: "off", at: 0 }; // off | syncing | saved | error | wrong-key | not-configured
const listeners = new Set();

export const getStatus = () => status;
export const onStatus = fn => (listeners.add(fn), () => listeners.delete(fn));
const setStatus = (state, extra = {}) => {
  status = { state, at: Date.now(), ...extra };
  listeners.forEach(fn => fn(status));
};

const key = () => store.own().sync?.key ?? "";
const headers = () => ({ authorization: `Bearer ${key()}`, "content-type": "application/json" });

// The parts of the state that belong in the cloud. prefs (language, theme) stay per computer; so does the timer.
const cloudPart = s => ({ version: s.version, script: s.script, log: s.log, srs: s.srs, goals: s.goals });

function mergeDay(a = { min: 0, tasks: [] }, b = { min: 0, tasks: [] }) {
  const quiz = (a.quiz?.total ?? 0) >= (b.quiz?.total ?? 0) ? a.quiz : b.quiz;
  const cards = (a.cards?.r ?? 0) >= (b.cards?.r ?? 0) ? a.cards : b.cards;
  return {
    min: Math.max(a.min ?? 0, b.min ?? 0),
    tasks: [...new Set([...(a.tasks ?? []), ...(b.tasks ?? [])])],
    ...(quiz ? { quiz } : {}),
    ...(cards ? { cards } : {}),
  };
}

// Each card, and the card settings, keep whichever version changed last.
function mergeSrs(local = { cards: {}, prefs: {} }, remote = { cards: {}, prefs: {} }) {
  const cards = { ...local.cards };
  for (const [id, c] of Object.entries(remote.cards ?? {})) if (!cards[id] || (c.mod ?? 0) > (cards[id].mod ?? 0)) cards[id] = c;
  const prefs = (remote.prefs?.mod ?? 0) > (local.prefs?.mod ?? 0) ? { ...local.prefs, ...remote.prefs } : local.prefs;
  return { cards, prefs };
}

export function merge(local, remote) {
  const log = { ...local.log };
  for (const [day, e] of Object.entries(remote.log ?? {})) log[day] = mergeDay(local.log[day], e);
  const union = (x = [], y = []) => [...new Set([...x, ...y])];
  return {
    script: { ...local.script, done: union(local.script.done, remote.script?.done), quiz: union(local.script.quiz, remote.script?.quiz) },
    log,
    srs: mergeSrs(local.srs, remote.srs),
    goals: { done: union(local.goals?.done, remote.goals?.done) },
  };
}

async function request(method, body) {
  const res = await fetch("api/progress", { method, headers: headers(), body: body && JSON.stringify(body), cache: "no-store" });
  if (res.status === 401) throw Object.assign(new Error("wrong-key"), { state: "wrong-key" });
  if (res.status === 503 || res.status === 404) throw Object.assign(new Error("not-configured"), { state: "not-configured" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function push() {
  if (!key()) return;
  clearTimeout(timer);
  setStatus("syncing");
  try {
    const updatedAt = Date.now();
    const data = cloudPart(store.own());
    await request("PUT", { data, updatedAt });
    lastPushed = JSON.stringify(data);
    store.update(s => { s.sync.pushedAt = updatedAt; }, { silent: true, own: true });
    setStatus("saved");
  } catch (e) {
    setStatus(e.state ?? "error");
  }
}

// Pull the cloud copy, merge it in, and push the merged result back if this computer had anything new.
export async function pull() {
  if (!key()) return setStatus("off");
  setStatus("syncing");
  try {
    const { data } = await request("GET");
    if (data) {
      const before = JSON.stringify(cloudPart(store.own()));
      store.update(s => Object.assign(s, merge(s, data)), { silent: true, own: true });
      const after = JSON.stringify(cloudPart(store.own()));
      lastPushed = JSON.stringify(cloudPart({ ...data, version: store.own().version }));
      if (after !== lastPushed) await push(); // this computer had something the cloud didn't
      else setStatus("saved");
      return before !== after; // true when the page should re-render
    }
    await push(); // first save ever
  } catch (e) {
    setStatus(e.state ?? "error");
  }
  return false;
}

// Volodymyr's progress, for Dima to look at (read-only).
export async function fetchHis() {
  if (!key()) throw Object.assign(new Error("off"), { state: "off" });
  const res = await fetch("api/progress?who=student", { headers: headers(), cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()).data;
}

export function connect(newKey) {
  store.update(s => { s.sync = { key: newKey.trim(), pushedAt: 0 }; }, { silent: true, own: true });
  return pull();
}

export function disconnect() {
  store.update(s => { s.sync = { key: "", pushedAt: 0 }; }, { silent: true, own: true });
  setStatus("off");
}

// Any change to progress schedules a push a few seconds later (one request for a burst of clicks).
export function start(onRemoteChange) {
  store.subscribe(() => {
    if (!key() || JSON.stringify(cloudPart(store.own())) === lastPushed) return;
    clearTimeout(timer);
    timer = setTimeout(push, DEBOUNCE_MS);
  });
  addEventListener("pagehide", () => key() && timer && push());
  pull().then(changed => changed && !store.watching() && onRemoteChange());
  // Dima watching his progress: refresh it every few minutes.
  setInterval(() => store.watching() && fetchHis().then(d => d && (store.watch(d), onRemoteChange()), () => {}), 5 * 60_000);
}
