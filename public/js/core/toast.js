// A short message at the bottom of the screen, sometimes with one button (Undo): toast(text, { action, onAction }).
// With a button it stays for 8 seconds, so there's time to press it. rescue() brings it out of a window that closes.
let el = null;
let timer = 0;
let act = null;

function hide() {
  el?.classList.remove("is-on");
  act = null;
}

export function toast(text, { action = "", onAction = null, ms = 2800 } = {}) {
  if (!el) {
    el = document.createElement("div");
    el.className = "voice-toast";
    el.setAttribute("role", "status");
    el.addEventListener("click", e => {
      if (!e.target.closest("[data-toast-act]") || !act) return;
      const fn = act;
      hide();
      fn();
    });
  }
  // Inside an open window (the studio), or it would sit behind it where nobody can press it.
  const host = document.querySelector("dialog[open]") ?? document.body;
  if (el.parentElement !== host) host.append(el);
  el.replaceChildren(Object.assign(document.createElement("span"), { textContent: text }));
  if (action) {
    const b = Object.assign(document.createElement("button"), { type: "button", textContent: action });
    b.dataset.toastAct = "";
    el.append(b);
  }
  act = action ? onAction : null;
  el.classList.toggle("has-action", Boolean(action));
  el.classList.add("is-on");
  clearTimeout(timer);
  timer = setTimeout(hide, action ? 8000 : ms);
}

export function rescue() {
  if (el && el.parentElement !== document.body) document.body.append(el);
}
