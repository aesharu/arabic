// Correct a word: Najdi Arabic, pronunciation, English, Ukrainian and MSA, and "this is correct Najdi" (which removes
// the check-with-tutor flag). Saved to the cloud for both profiles (core/content.js); the plan file is untouched.
import { t } from "./i18n.js";
import { esc } from "./dom.js";
import * as content from "./content.js";
import { vocabNow } from "./vocab.js";

function find(id) {
  const v = vocabNow();
  if (!v) return null;
  return v.notes.find(n => n.id === id) ?? v.vocab.stages.flatMap(s => s.topics.flatMap(tp => tp.entries)).find(e => e.id === id) ?? null;
}

const FIELD_META = [
  ["ar", "edit.ar", "rtl", "ar"],
  ["say", "edit.say", "ltr", "en"],
  ["en", "edit.en", "ltr", "en"],
  ["uk", "edit.uk", "ltr", "uk"],
  ["msa", "edit.msa", "rtl", "ar"],
];

export function openEditor(id, onSaved) {
  const e = find(id);
  if (!e) return;
  const orig = e.orig ?? e;
  const dlg = document.createElement("dialog");
  dlg.className = "editor";
  dlg.setAttribute("aria-labelledby", "editor-title");
  dlg.innerHTML = `<form method="dialog" class="editor-form">
    <h2 id="editor-title">${t("edit.title")}</h2>
    ${content.signedIn() ? "" : `<p class="editor-msg is-bad">${t("edit.signIn")}</p>`}
    ${FIELD_META.map(([f, label, dir, lang]) => `<label class="editor-field"><span>${t(label)}</span>
      <input name="${f}" dir="${dir}" lang="${lang}" value="${esc(e[f] ?? "")}" autocomplete="off" spellcheck="false">
      ${orig[f] && orig[f] !== e[f] ? `<small>${esc(t("edit.original", { text: orig[f] }))}</small>` : ""}</label>`).join("")}
    <label class="check"><input type="checkbox" name="checked"${content.editOf(id)?.checked ? " checked" : ""}><span>${t("edit.checked")}</span></label>
    <p class="editor-msg" aria-live="polite"></p>
    <div class="editor-actions">
      <button type="submit" class="btn" value="save">${t("edit.save")}</button>
      <button type="button" class="btn btn-ghost" data-close>${t("edit.cancel")}</button>
      ${content.editOf(id) ? `<button type="button" class="btn btn-ghost editor-revert" data-revert>${t("edit.revert")}</button>` : ""}
    </div>
  </form>`;
  document.body.append(dlg);
  const form = dlg.querySelector("form");
  const msg = dlg.querySelector(".editor-msg[aria-live]");
  const close = () => {
    dlg.close();
    dlg.remove();
  };
  dlg.addEventListener("cancel", close);
  dlg.querySelector("[data-close]").addEventListener("click", close);
  dlg.querySelector("[data-revert]")?.addEventListener("click", async () => {
    try {
      await content.revertEdit(id);
      close();
      onSaved?.();
    } catch {
      msg.textContent = t("edit.error");
    }
  });
  form.addEventListener("submit", async ev => {
    ev.preventDefault();
    const data = { checked: form.checked.checked };
    // Only what differs from the plan is stored, so later fixes to the plan still come through.
    for (const [f] of FIELD_META) {
      const v = form[f].value.trim();
      if (v && v !== orig[f]) data[f] = v;
    }
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    msg.textContent = "";
    try {
      await content.saveEdit(id, data);
      close();
      onSaved?.();
    } catch {
      msg.textContent = t("edit.error");
      btn.disabled = false;
    }
  });
  dlg.showModal();
  form.ar.focus();
}
