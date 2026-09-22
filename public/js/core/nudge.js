// A word to Dima when she comes in: why her voice matters, and the two things only she can do —
// record a word, or correct one. Her profile only, once per visit, and never when she has already
// done her five for the day or when a special day is greeting her: nobody likes being asked twice.
import { t, tu, cnt, num, isArabic } from "./i18n.js";
import { esc } from "./dom.js";
import { icon } from "./art.js";
import * as store from "./store.js";
import * as content from "./content.js";
import { toggle as editToggle } from "./editmode.js";
import { saudiDay, streaks, daysFromTimes } from "./activity.js";

const MESSAGES = 10;
const NEXT = "najdi-nudge-next"; // which message comes next on this device, so they come round in turn
const FIVE = 5;

const stored = (key, fallback = "") => {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
};
const store_ = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {}
};

// The messages come round in turn, so she doesn't read the same one twice in a day.
function nextMessage() {
  const i = Number(stored(NEXT, "0")) % MESSAGES;
  store_(NEXT, String((i + 1) % MESSAGES));
  return `nudge.m${i + 1}`;
}

const said = (key, n) => (isArabic() ? cnt(key, n) : `${num(n)} ${tu(key, n)}`);

export function show() {
  const times = content.audioTimes();
  const today = saudiDay(Date.now());
  const todayCount = times.filter(at => saudiDay(at) === today).length;
  const { current } = streaks(daysFromTimes(times));

  const dlg = document.createElement("dialog");
  dlg.className = "nudge";
  dlg.setAttribute("aria-labelledby", "nudge-title");
  dlg.innerHTML = `
    <div class="nudge-body">
      <p class="nudge-heart" aria-hidden="true">${icon("heart")}</p>
      <h2 id="nudge-title">${esc(t(nextMessage()))}</h2>
      <div class="nudge-actions">
        <button type="button" class="btn btn-primary" data-go="record">${icon("mic")} ${esc(t("nudge.record"))}</button>
        <button type="button" class="btn" data-go="correct">${icon("pencil")} ${esc(t("nudge.correct"))}</button>
      </div>
      <button type="button" class="btn btn-ghost nudge-later" data-go="later">${esc(t("nudge.later"))}</button>
      ${times.length ? `<p class="nudge-foot">${esc(t("td.fiveTotal", { n: said("unit.words", times.length) }))}${current > 1 ? ` · ${esc(`${said("unit.days", current)} ${t("td.fiveRow")}`)}` : ""}</p>` : ""}
    </div>`;
  document.body.append(dlg);

  const close = () => {
    dlg.close();
    dlg.remove();
  };
  dlg.addEventListener("cancel", close);
  dlg.addEventListener("click", e => {
    const b = e.target.closest("[data-go]");
    if (!b) return;
    close();
    if (b.dataset.go === "record") location.hash = "#/record";
    if (b.dataset.go === "correct") {
      location.hash = "#/words"; // the word list, where every word has its own ✎
      editToggle(true);
    }
  });
  dlg.showModal();
  dlg.querySelector("[data-go]").focus({ preventScroll: true });
  return { todayCount };
}

// Called when the welcome screen lets her in. holiday: a special day is greeting her — leave the day alone.
export function maybeShow({ holiday = false } = {}) {
  if (!store.isTeacher() || holiday || !content.signedIn()) return;
  // Her recordings tell us whether she has already helped today; wait for them rather than ask blindly.
  content.load().then(() => {
    const today = saudiDay(Date.now());
    if (content.audioTimes().filter(at => saudiDay(at) === today).length >= FIVE) return; // she's done her five
    if (document.querySelector("dialog[open]")) return; // never on top of something else
    show();
  });
}
