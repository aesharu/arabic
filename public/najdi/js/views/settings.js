import * as D from "../deck.js";
import { S, TYPES, VOCAB_TYPES } from "../deck.js";
import { $, esc, plural, toast, confirmDialog, saveTextFile, forgetMedia } from "../util.js";
import { loader } from "./welcome.js";

const seg = (name, options, value) => `<div class="seg" data-setting="${name}">${options.map(([v, l]) =>
  `<button data-v="${v}" aria-pressed="${String(value) === String(v)}">${l}</button>`).join("")}</div>`;

export function render(root) {
  const s = S.settings, deck = S.deck;
  const hasVocab = S.notes.some(n => n.kind === "vocab");
  root.innerHTML = `<div class="page" style="max-width:760px">
    <div class="page-head"><div><h1>Settings</h1></div></div>

    <section class="panel">
      <div class="deck-card"><div><b>${esc(deck?.name || "No deck")}</b>
        <p>${deck ? `${plural(deck.notes, "word")} · ${plural(deck.media, "audio file")} · added ${new Date(deck.importedAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}` : ""}</p></div>
        <div style="display:flex;gap:8px"><button class="btn ghost small" id="updateBtn">Fetch again…</button><button class="btn danger small" id="removeBtn">Remove</button></div></div>
      <div id="updateBox" style="margin-top:16px" hidden></div>
      <div class="setting" style="border-top:1px solid var(--line);margin-top:14px;padding-top:14px">
        <div><label>The rest of the site</label><p>The book, the words you need, today’s plan — everything else lives there.</p></div>
        <a class="btn ghost small" href="/">Back to the site</a>
      </div>
    </section>

    <h2 class="section-title">Daily study</h2>
    <section class="panel">
      <div class="setting"><div><label>New cards per day</label><p>The deck’s authors suggest 20 for beginners. Each word has up to ${hasVocab ? "four" : "one"} cards, spread over different days.</p></div>
        ${seg("newPerDay", [[5, "5"], [10, "10"], [20, "20"], [30, "30"], [50, "50"]], s.newPerDay)}</div>
      <div class="setting"><div><label>Maximum reviews per day</label><p>A cap for days after a break. Reviews over the cap wait until tomorrow.</p></div>
        ${seg("reviewsPerDay", [[100, "100"], [200, "200"], [500, "500"], [99999, "No limit"]], s.reviewsPerDay)}</div>
      <div class="setting"><div><label>How much to remember</label><p>Higher means more reviews but fewer forgotten words. 90% is what Anki recommends.</p></div>
        ${seg("retention", [[0.85, "85%"], [0.9, "90%"], [0.95, "95%"]], s.retention)}</div>
      ${hasVocab ? `<div class="setting"><div><label>Card types</label><p>Listening shows only the audio: great for understanding people when they talk.</p></div>
        <div class="chips" id="typeChips">${VOCAB_TYPES.map(t => `<button class="chip" data-type="${t}" aria-pressed="${!!s.types[t]}">${TYPES[t].label}</button>`).join("")}</div></div>` : ""}
      ${S.levels.length ? `<div class="setting"><div><label>Levels</label><p>Which parts of the course to take new words from.</p></div>
        <div class="chips" id="levelChips">${S.levels.map(l => `<button class="chip" data-level="${l}" aria-pressed="${!s.levels.length || s.levels.includes(l)}">${l}</button>`).join("")}</div></div>` : ""}
    </section>

    <h2 class="section-title">Audio</h2>
    <section class="panel">
      <div class="setting"><div><label>Voice</label><p>Both plays the man and then the woman, every time. V switches while you study.</p></div>${seg("voice", [["both", "♂♀ Both"], ["m", "♂ Male"], ["f", "♀ Female"]], s.voice)}</div>
      <div class="setting"><div><label>Play automatically</label><p>Play the recording when a card appears or is revealed.</p></div>${seg("autoplay", [[true, "On"], [false, "Off"]], s.autoplay)}</div>
      <div class="setting"><div><label>Speed</label><p>The slow button (or T) always plays at 0.7×.</p></div>${seg("speed", [[1, "1×"], [0.85, "0.85×"], [0.7, "0.7×"]], s.speed)}</div>
    </section>

    <h2 class="section-title">Appearance</h2>
    <section class="panel">
      <div class="setting"><div><label>Theme</label></div>${seg("theme", [["system", "Automatic"], ["light", "Light"], ["dark", "Dark"]], s.theme)}</div>
    </section>

    <h2 class="section-title">Your progress</h2>
    <section class="panel">
      <div class="setting"><div><label>Back up</label><p>Saves your progress, stars and notes to a small file. The deck itself isn’t included.</p></div>
        <div style="display:flex;gap:8px"><button class="btn ghost small" id="exportBtn">Export…</button><button class="btn ghost small" id="importBtn">Restore…</button></div>
        <input type="file" id="restoreFile" accept="application/json,.json" hidden></div>
      <div class="setting"><div><label>Start over</label><p>Forget all answers and scheduling. Stars and notes are kept.</p></div><button class="btn danger small" id="resetBtn">Reset progress</button></div>
    </section>
    <p class="muted" style="font-size:13px;margin-top:22px">Your deck and progress are stored only on this device.</p>
  </div>`;

  root.querySelectorAll("[data-setting]").forEach(g => g.addEventListener("click", e => {
    const b = e.target.closest("[data-v]"); if (!b) return;
    const key = g.dataset.setting, raw = b.dataset.v;
    S.settings[key] = raw === "true" ? true : raw === "false" ? false : isNaN(+raw) ? raw : +raw;
    g.querySelectorAll("[data-v]").forEach(x => x.setAttribute("aria-pressed", x === b));
    D.saveSettings();
    if (key === "theme") window.app.applyTheme();
    window.app.refreshChrome();
  }));
  $("#typeChips", root)?.addEventListener("click", e => {
    const b = e.target.closest("[data-type]"); if (!b) return;
    const next = { ...S.settings.types, [b.dataset.type]: !S.settings.types[b.dataset.type] };
    if (!Object.values(next).some(Boolean)) return toast("Keep at least one card type on");
    S.settings.types = next;
    b.setAttribute("aria-pressed", next[b.dataset.type]);
    D.saveSettings(); window.app.refreshChrome();
  });
  $("#levelChips", root)?.addEventListener("click", e => {
    const b = e.target.closest("[data-level]"); if (!b) return;
    const cur = new Set(S.settings.levels.length ? S.settings.levels : S.levels);
    cur.has(b.dataset.level) ? cur.delete(b.dataset.level) : cur.add(b.dataset.level);
    if (!cur.size) return toast("Keep at least one level on");
    S.settings.levels = cur.size === S.levels.length ? [] : S.levels.filter(l => cur.has(l));
    root.querySelectorAll("[data-level]").forEach(x => x.setAttribute("aria-pressed", cur.has(x.dataset.level)));
    D.saveSettings(); window.app.refreshChrome();
  });

  $("#updateBtn", root).addEventListener("click", () => {
    const box = $("#updateBox", root);
    box.hidden = !box.hidden;
    if (!box.hidden) loader(box, { update: true, onDone: () => { window.app.refreshChrome(); render(root); toast("Deck refreshed"); } });
  });
  $("#removeBtn", root).addEventListener("click", async () => {
    if (!(await confirmDialog({ title: "Remove this deck?", body: "Cards and audio are deleted from this device. Your progress is kept, and your database still has the deck — fetching it again picks up where you left off.", ok: "Remove deck", danger: true }))) return;
    await D.removeDeck(); forgetMedia();
    window.app.go("welcome");
  });
  $("#exportBtn", root).addEventListener("click", async () => {
    const data = await D.exportProgress();
    saveTextFile(`najdi-progress-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(data));
  });
  $("#importBtn", root).addEventListener("click", () => $("#restoreFile", root).click());
  $("#restoreFile", root).addEventListener("change", async e => {
    const f = e.target.files[0]; e.target.value = "";
    if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      if (!(await confirmDialog({ title: "Restore this backup?", body: `It has ${plural(Object.keys(data.cards || {}).length, "card")} of progress from ${data.exportedAt ? new Date(data.exportedAt).toLocaleDateString() : "an earlier date"}. Your current progress is replaced.`, ok: "Restore" }))) return;
      await D.importProgress(data);
      window.app.applyTheme(); window.app.refreshChrome(); render(root);
      toast("Progress restored");
    } catch (err) {
      await confirmDialog({ title: "Couldn’t restore", body: err.message, ok: "OK", cancel: "" });
    }
  });
  $("#resetBtn", root).addEventListener("click", async () => {
    if (!(await confirmDialog({ title: "Reset all progress?", body: "Every card goes back to new. Export a backup first if you might want it back.", ok: "Reset", danger: true }))) return;
    await D.resetProgress();
    window.app.refreshChrome();
    toast("Progress reset");
  });
}
