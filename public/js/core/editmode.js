// Edit mode: tap any text on the site to change it — a menu item, a heading, a lesson, a word.
// In Dima's profile each change is sent to Volodymyr as a suggestion; he approves it on the Suggestions page.
// Texts are found by what they say (core/i18n.js remembers where each shown text came from); words and
// conversation lines by their ✎ id.
import { t, setEditing, isEditing, sourceOf } from "./i18n.js";
import { openEditor, openTextEditor } from "./editor.js";
import * as content from "./content.js";
import * as store from "./store.js";

let rerender = () => {};
const bar = document.createElement("div");
bar.className = "edit-bar";
bar.setAttribute("role", "status");

function paintBar() {
  const n = store.isTeacher() ? content.pending().length : 0;
  bar.innerHTML = `<span class="edit-bar-dot" aria-hidden="true"></span>
    <span><b>${t("edit.modeOn")}</b>${n ? `<small>${t("edit.pendingNote", { n })}</small>` : ""}</span>
    <button type="button" class="btn" data-edit-done>${t("edit.done")}</button>`;
}

export function toggle(on = !isEditing()) {
  setEditing(on);
  document.body.classList.toggle("editing", on);
  document.querySelectorAll("[data-edit-mode]").forEach(b => b.setAttribute("aria-pressed", on));
  if (on) {
    paintBar();
    document.body.append(bar);
  } else bar.remove();
  rerender(); // draw the page again so every text is remembered (or forgotten)
}

function note(text) {
  let el = document.querySelector(".voice-toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "voice-toast";
    el.setAttribute("role", "status");
    document.body.append(el);
  }
  el.textContent = text;
  el.classList.add("is-on");
  setTimeout(() => el.classList.remove("is-on"), 2600);
}

// The texts an element shows: its own words first, then its parents' (a tap often lands on a span inside).
function findSource(el) {
  for (let i = 0; el && i < 6; el = el.parentElement, i++) {
    if (el.matches?.("main, body, .app, .menu")) break;
    const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join(" ");
    const hit = sourceOf(own) ?? sourceOf(el.textContent);
    if (hit) return hit;
  }
  return null;
}

export function start(onChange) {
  rerender = onChange;
  bar.addEventListener("click", e => e.target.closest("[data-edit-done]") && toggle(false));
  document.addEventListener("click", e => {
    if (e.target.closest("[data-edit-mode]")) return toggle();
    if (!isEditing() || e.target.closest(".edit-bar, dialog, .sky-toggle, [data-lang], [data-palette]")) return;
    e.preventDefault();
    e.stopPropagation(); // in edit mode a tap edits instead of opening links or pressing buttons
    const word = e.target.closest(".word-wrap, .rec-row, .dl-line");
    const id = e.target.closest("[data-edit-id]")?.dataset.editId ?? word?.querySelector("[data-edit]")?.dataset.edit ?? e.target.closest("[data-edit]")?.dataset.edit;
    if (id) return openEditor(id);
    const src = findSource(e.target);
    if (src) return openTextEditor(src.target, src.source);
    note(t("edit.notHere"));
  }, true);
  document.addEventListener("keydown", e => e.key === "Escape" && isEditing() && !document.querySelector("dialog[open]") && toggle(false));
  content.onChange(() => isEditing() && paintBar());
}
