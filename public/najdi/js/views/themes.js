import * as D from "../deck.js";
import { S, LEVEL_NAMES } from "../deck.js";
import { esc, plural } from "../util.js";
import { themeCard } from "./today.js";

export function render(root) {
  if (!S.themes.length) {
    root.innerHTML = `<div class="page"><div class="page-head"><div><h1>Themes</h1></div></div>
      <div class="panel empty">This deck isn’t organised into themes.</div></div>`;
    return;
  }
  const groups = new Map();
  for (const t of S.themes) {
    const key = t.level || "";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(t);
  }
  root.innerHTML = `<div class="page">
    <div class="page-head"><div><h1>Themes</h1><p>Pick a topic to focus on. Its new words are introduced first, alongside your normal reviews.</p></div></div>
    ${[...groups].map(([level, themes]) => {
      const words = themes.reduce((n, t) => n + t.notes.length, 0);
      return `<section class="theme-group"><h2>${level ? `${esc(level)} · ${esc(LEVEL_NAMES[level] || "")}` : "Themes"}<small>${plural(themes.length, "theme")} · ${plural(words, "word")}</small></h2>
      <div class="themes">${themes.map(t => {
        const started = t.notes.filter(n => D.noteStatus(n) !== "new").length;
        return themeCard(t, started, t.notes.length);
      }).join("")}</div></section>`;
    }).join("")}
  </div>`;
  root.querySelectorAll("[data-theme-id]").forEach(b => b.addEventListener("click", () => {
    const t = S.themes.find(x => x.id === b.dataset.themeId);
    window.app.go("study", { focus: { theme: t.id, label: t.name } });
  }));
}
