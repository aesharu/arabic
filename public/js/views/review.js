// Dima's suggestions, for Volodymyr: what each text or word says now, what she suggests, and Approve / Reject.
// Approved changes become the site's text for both profiles. Below: the last ones decided, approved or not.
//   #/review
import { t, tx } from "../core/i18n.js";
import { esc, ar, pageHead } from "../core/dom.js";
import { icon } from "../core/art.js";
import * as content from "../core/content.js";
import * as store from "../core/store.js";
import { STRINGS } from "../i18n/strings.js";

const LABEL = { ar: "edit.ar", say: "edit.say", en: "edit.en", uk: "edit.uk", najdi: "edit.najdiUi", msa: "edit.msa" };
const RTL = new Set(["ar", "najdi", "msa"]);

function kind(target) {
  if (target.startsWith("s.")) return t("review.kindText");
  if (target.startsWith("x.")) return t("review.kindContent");
  if (/^d\d+x\d+$/.test(target)) return t("review.kindLine");
  return t("review.kindWord");
}

// What the thing says now: the approved edit if any, else the original sent along with the suggestion.
function now(s, f) {
  if (s.target.startsWith("s.")) return content.textOf(s.target, f) ?? STRINGS[s.target.slice(2)]?.[f] ?? s.before?.[f] ?? "";
  return content.editOf(s.target)?.[f] ?? s.before?.[f] ?? "";
}

const cell = (f, text) => (RTL.has(f) ? ar(text) : esc(text));

function card(s) {
  const done = Boolean(s.status && s.status !== "pending");
  const was = f => (done ? s.before?.[f] ?? "" : now(s, f));
  const rows = Object.keys(s.data).filter(f => f !== "checked").map(f => `<tr><th>${t(LABEL[f] ?? f)}</th>
    <td class="rv-before">${cell(f, was(f)) || "—"}</td><td class="rv-arrow" aria-hidden="true">→</td><td class="rv-after">${cell(f, s.data[f])}</td></tr>`).join("");
  if (done) {
    return `<li class="panel rv-card is-done">
      <p class="rv-kind">${esc(kind(s.target))} · <span class="muted">${esc(new Date(s.at).toLocaleString())}</span>
        <span class="rv-status is-${s.status}">${icon(s.status === "approved" ? "check" : "close")} ${t(s.status === "approved" ? "review.approved" : "review.rejected")}</span></p>
      ${rows ? `<table class="rv-table"><tbody>${rows}</tbody></table>` : ""}
    </li>`;
  }
  return `<li class="panel rv-card" data-sid="${s.sid}">
    <p class="rv-kind">${esc(kind(s.target))} · <span class="muted">${esc(new Date(s.at).toLocaleString())}</span></p>
    ${rows ? `<table class="rv-table"><thead><tr><th></th><th>${t("review.before")}</th><th></th><th>${t("review.after")}</th></tr></thead><tbody>${rows}</tbody></table>` : ""}
    ${s.data.checked ? `<p class="rv-checked">${icon("check")} ${t("review.checked")}</p>` : ""}
    <div class="rv-actions">${store.isTeacher()
      ? `<button type="button" class="btn btn-ghost" data-withdraw>${icon("undo")} ${t("review.withdraw")}</button>`
      : `<button type="button" class="btn" data-decide="approve">${icon("check")} ${t("review.approve")}</button>
         <button type="button" class="btn btn-ghost" data-decide="reject">${icon("close")} ${t("review.reject")}</button>`}
    </div>
    <p class="editor-msg" aria-live="polite"></p>
  </li>`;
}

export default {
  titleKey: "review.title",
  mount(root, { signal }) {
    const render = () => {
      if (signal.aborted) return;
      const list = content.pending();
      root.innerHTML = `${pageHead(t("review.title"), esc(t(store.isTeacher() ? "review.subDima" : "review.sub")), "", "", "print")}
        ${list.length > 1 && !store.isTeacher() ? `<p><button type="button" class="btn" data-all>${icon("check")} ${t("review.approveAll", { n: list.length })}</button></p>` : ""}
        ${list.length ? `<ol class="rv-list${store.isTeacher() ? " is-mine" : ""}">${list.map(card).join("")}</ol>` : `<p class="empty-note">${icon("check")} ${t("review.none")}</p>`}
        ${content.decided().length ? `<h2 class="rv-history">${t("review.history")}</h2>
          <ol class="rv-list">${content.decided().slice(0, 20).map(card).join("")}</ol>` : ""}`;
    };
    render();
    content.load();
    const off = content.onChange(render);
    signal.addEventListener("abort", off);
    root.addEventListener("click", async e => {
      if (e.target.closest("[data-all]")) {
        for (const s of [...content.pending()]) await content.decide(s.sid, "approve").catch(() => {});
        return;
      }
      const b = e.target.closest("[data-decide], [data-withdraw]");
      if (!b) return;
      const li = b.closest("[data-sid]");
      li.querySelectorAll("button").forEach(x => (x.disabled = true));
      try {
        if (b.dataset.decide) await content.decide(+li.dataset.sid, b.dataset.decide);
        else await content.withdraw(+li.dataset.sid);
      } catch {
        li.querySelector(".editor-msg").textContent = t("edit.error");
        li.querySelectorAll("button").forEach(x => (x.disabled = false));
      }
    }, { signal });
  },
};
