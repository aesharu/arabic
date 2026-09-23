// Change something on the site, in a dialog:
//   openEditor(id)                a word or a conversation line — Najdi, pronunciation, English, Ukrainian, MSA, and
//                                 "this is correct Najdi" (removes the check-with-tutor flag)
//   openTextEditor(target, src)   any text on the site (a menu item, a heading, a lesson) — English, Ukrainian, Najdi, MSA
// Volodymyr's changes go live; Dima's are sent to him as suggestions (core/content.js). The plan file is untouched.
// After saving, a message with Undo. A word's editor also has its voice: listen, slowly, and (Dima) record it.
import { t } from "./i18n.js";
import { esc } from "./dom.js";
import { icon } from "./art.js";
import * as content from "./content.js";
import * as store from "./store.js";
import { vocabNow } from "./vocab.js";
import { toast, rescue } from "./toast.js";
import { say } from "./speech.js";
import { openStudio, spoken } from "./studio.js";

function find(id) {
  const v = vocabNow();
  if (content.registered(id)) return content.registered(id);
  if (!v) return null;
  return v.notes.find(n => n.id === id) ?? v.vocab.stages.flatMap(s => s.topics.flatMap(tp => tp.entries)).find(e => e.id === id) ?? null;
}

const WORD_FIELDS = [
  ["ar", "edit.ar", "rtl", "ar"],
  ["say", "edit.say", "ltr", "en"],
  ["en", "edit.en", "ltr", "en"],
];
const TEXT_FIELDS = [
  ["en", "edit.en", "ltr", "en"],
  ["najdi", "edit.najdiUi", "rtl", "ar"],
];

// The dialog both editors share. fields: [name, label, dir, lang]; values: current; orig: before any change.
function dialog({ title, fields, values, orig, top = "", extra = "", note = "", long = false, onSave, onRevert, onReady }) {
  const dlg = document.createElement("dialog");
  dlg.className = "editor";
  dlg.setAttribute("aria-labelledby", "editor-title");
  const teacher = store.isTeacher();
  dlg.innerHTML = `<form method="dialog" class="editor-form">
    <h2 id="editor-title">${title}</h2>
    ${content.signedIn() ? "" : `<p class="editor-msg is-bad">${t("edit.signIn")}</p>`}
    ${note ? `<p class="muted small">${note}</p>` : ""}
    ${top}
    ${fields.map(([f, label, dir, lang]) => `<label class="editor-field"><span>${t(label)}</span>
      ${long ? `<textarea name="${f}" dir="${dir}" lang="${lang}" rows="3" spellcheck="false">${esc(values[f] ?? "")}</textarea>`
        : `<input name="${f}" dir="${dir}" lang="${lang}" value="${esc(values[f] ?? "")}" autocomplete="off" spellcheck="false">`}
      ${orig[f] && orig[f] !== values[f] ? `<small>${esc(t("edit.original", { text: orig[f] }))}</small>` : ""}</label>`).join("")}
    ${extra}
    <p class="editor-msg" aria-live="polite"></p>
    <div class="editor-actions">
      <button type="submit" class="btn" value="save">${t(teacher ? "edit.send" : "edit.save")}</button>
      <button type="button" class="btn btn-ghost" data-close>${t("edit.cancel")}</button>
      ${onRevert ? `<button type="button" class="btn btn-ghost editor-revert" data-revert>${t("edit.revert")}</button>` : ""}
    </div>
  </form>`;
  document.body.append(dlg);
  const form = dlg.querySelector("form");
  const msg = dlg.querySelector(".editor-msg[aria-live]");
  const close = () => {
    rescue();
    dlg.close();
    dlg.remove();
  };
  dlg.addEventListener("cancel", close);
  dlg.querySelector("[data-close]").addEventListener("click", close);
  dlg.querySelector("[data-revert]")?.addEventListener("click", async () => {
    try {
      await onRevert();
      close();
    } catch {
      msg.textContent = t("edit.error");
    }
  });
  form.addEventListener("submit", async ev => {
    ev.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    msg.textContent = "";
    try {
      await onSave(form);
      close();
    } catch {
      msg.textContent = t("edit.error");
      btn.disabled = false;
    }
  });
  onReady?.(dlg, close);
  dlg.showModal();
  form.querySelector("input, textarea")?.focus();
}

// Said once it's saved, with Undo: Dima's suggestion is taken back; Volodymyr's change goes back to what was there.
async function saveWithUndo(id, data, before) {
  const live = store.isTeacher() ? null : content.editOf(id);
  const res = await content.saveEdit(id, data, before);
  const undone = () => toast(t("edit.undone"));
  const failed = () => toast(t("edit.error"));
  if (res?.pending) {
    toast(t("edit.sent"), { action: t("studio.undo"), onAction: () => content.withdraw(res.sid).then(undone, failed) });
  } else {
    const { by, at, ...was } = live ?? {};
    toast(t("edit.savedToast"), { action: t("studio.undo"), onAction: () => (live ? content.saveEdit(id, was) : content.revertEdit(id)).then(undone, failed) });
  }
  return res;
}

// The voice of a word: hers if recorded, and in her profile a way into the studio.
function voiceRow(e) {
  const has = content.hasAudio(spoken(e));
  const canRecord = store.isTeacher() && content.signedIn();
  return `<div class="editor-voice">
    <span class="ev-state${has ? " is-hers" : ""}">${has ? `${icon("check")} ${t("studio.herVoice")}` : t("studio.robotVoice")}</span>
    <span class="ev-btns">
      <button type="button" class="btn btn-ghost" data-ev="play" aria-label="${esc(t("record.play"))}">${icon("play")}</button>
      <button type="button" class="btn btn-ghost" data-ev="slow" aria-label="${esc(t("speech.slowLabel"))}">${icon("slow")}</button>
      ${canRecord ? `<button type="button" class="btn" data-ev="record">${icon("mic")} ${t(has ? "record.redo" : "record.start")}</button>` : ""}
    </span>
  </div>`;
}

export function openEditor(id) {
  const e = find(id);
  if (!e) return;
  const orig = e.orig ?? e;
  dialog({
    title: t("edit.title"),
    fields: WORD_FIELDS,
    values: e,
    orig,
    top: voiceRow(e),
    extra: `<label class="check"><input type="checkbox" name="checked"${content.editOf(id)?.checked ? " checked" : ""}><span>${t("edit.checked")}</span></label>`,
    onReady: (dlg, close) => dlg.querySelector(".editor-voice").addEventListener("click", ev => {
      const b = ev.target.closest("[data-ev]");
      if (!b) return;
      if (b.dataset.ev === "record") {
        close();
        return openStudio([e], 0);
      }
      say(spoken(e), { slow: b.dataset.ev === "slow" });
    }),
    onSave: form => {
      const data = { checked: form.checked.checked };
      // Only what differs from the plan is stored, so later fixes to the plan still come through.
      for (const [f] of WORD_FIELDS) {
        const v = form[f].value.trim();
        if (v && v !== orig[f]) data[f] = v;
      }
      return saveWithUndo(id, data, Object.fromEntries(WORD_FIELDS.map(([f]) => [f, orig[f]])));
    },
    onRevert: !store.isTeacher() && content.editOf(id) ? () => content.revertEdit(id) : null,
  });
}

export function openTextEditor(target, source) {
  const orig = Object.fromEntries(TEXT_FIELDS.map(([f]) => [f, source[f] ?? ""]));
  const values = Object.fromEntries(TEXT_FIELDS.map(([f]) => [f, content.textOf(target, f) ?? orig[f]]));
  const long = TEXT_FIELDS.some(([f]) => (values[f] ?? "").length > 60);
  dialog({
    title: t("edit.textTitle"),
    fields: TEXT_FIELDS,
    values,
    orig,
    long,
    note: TEXT_FIELDS.some(([f]) => /[{<]/.test(orig[f])) ? esc(t("edit.keepVars")) : "",
    onSave: form => {
      const data = {};
      for (const [f] of TEXT_FIELDS) {
        const v = form[f].value.trim();
        if (v && v !== orig[f]) data[f] = v;
      }
      return saveWithUndo(target, data, orig);
    },
    onRevert: !store.isTeacher() && content.editOf(target) ? () => content.revertEdit(target) : null,
  });
}
