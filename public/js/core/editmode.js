// Edit mode: tap any text on the site to change it — a menu item, a heading, a lesson, a word.
// In Dima's profile each change is sent to Volodymyr as a suggestion; he approves it on the Suggestions page.
// Texts are found by what they say (core/i18n.js remembers where each shown text came from); words and
// conversation lines by their ✎ id.
import { t, setEditing, isEditing, sourceOf } from "./i18n.js";
import { openEditor, openTextEditor } from "./editor.js";
import * as content from "./content.js";
import * as store from "./store.js";
import { toast } from "./toast.js";

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

// Tint what can be changed: the smallest element around each text that the page remembers.
function mark() {
  document.querySelectorAll("[data-editable]").forEach(el => delete el.dataset.editable);
  if (!isEditing()) return;
  const walker = document.createTreeWalker(document.querySelector(".app"), NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent.trim()) continue;
    let el = n.parentElement;
    for (let i = 0; el && i < 4; el = el.parentElement, i++) {
      if (el.closest("[data-edit-id], .word-wrap, .rec-row, .dl-line, [data-edit-mode], [data-lang], script, style")) break;
      if (sourceOf(el.textContent)) {
        el.dataset.editable = "";
        break;
      }
    }
  }
}
let marking = 0;
const observer = new MutationObserver(() => {
  cancelAnimationFrame(marking);
  marking = requestAnimationFrame(() => {
    observer.disconnect();
    mark();
    observer.observe(document.querySelector(".app"), { childList: true, subtree: true });
  });
});

export function toggle(on = !isEditing()) {
  setEditing(on);
  document.body.classList.toggle("editing", on);
  document.querySelectorAll("[data-edit-mode]").forEach(b => {
    b.setAttribute("aria-pressed", on);
    const label = b.querySelector("[data-i18n]");
    if (label) label.dataset.i18n = on ? "edit.done" : "edit.short";
  });
  if (on) {
    paintBar();
    document.body.append(bar);
  } else bar.remove();
  rerender(); // draw the page again so every text is remembered (or forgotten)
  if (on) {
    mark();
    observer.observe(document.querySelector(".app"), { childList: true, subtree: true });
  } else {
    observer.disconnect();
    mark();
  }
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
    if (!isEditing() || e.target.closest(".edit-bar, dialog, .voice-toast, .sky-toggle, [data-lang], [data-palette], [data-logout], [data-profile-switch]")) return;
    e.preventDefault();
    e.stopPropagation(); // in edit mode a tap edits instead of opening links or pressing buttons
    const word = e.target.closest(".word-wrap, .rec-row, .dl-line");
    const id = e.target.closest("[data-edit-id]")?.dataset.editId ?? word?.querySelector("[data-edit]")?.dataset.edit ?? e.target.closest("[data-edit]")?.dataset.edit;
    if (id) return openEditor(id);
    const src = findSource(e.target);
    if (src) return openTextEditor(src.target, src.source);
    toast(t("edit.notHere"));
  }, true);
  document.addEventListener("keydown", e => e.key === "Escape" && isEditing() && !document.querySelector("dialog[open]") && toggle(false));
  content.onChange(() => isEditing() && paintBar());
}
