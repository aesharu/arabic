// Print the tracing sheets to PDF: node scripts/sheets.mjs  (or npm run sheets)
//
// The pages are built by scripts/sheets-html.mjs and printed by the Chrome that is already on this
// Mac — no library, no service, no account. Chrome is the only thing here that can lay out Arabic
// properly and turn it into a PDF, and it keeps the dashed letters as vector lines, so they print as
// sharply as the printer allows.
//
// The finished files go to public/worksheets, which means they are also on the site once it is
// deployed — he can open them on the iPad and print from there.
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { BOOKLETS } from "./sheets-html.mjs";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = new URL("../public/worksheets/", import.meta.url).pathname;
const work = join(tmpdir(), "sheets-" + Date.now());
const wait = ms => new Promise(r => setTimeout(r, ms));

mkdirSync(OUT, { recursive: true });
mkdirSync(work, { recursive: true });

const chrome = spawn(CHROME, ["--headless=new", "--remote-debugging-port=9411", "--disable-gpu",
  "--no-first-run", "--user-data-dir=" + join(work, "profile"), "--allow-file-access-from-files"], { stdio: "ignore" });

let ws, id = 0;
const pend = new Map();
for (let i = 0; i < 60 && !ws; i++) {
  try {
    const v = await (await fetch("http://127.0.0.1:9411/json/version")).json();
    ws = new WebSocket(v.webSocketDebuggerUrl);
  } catch { await wait(250); }
}
await new Promise(r => (ws.onopen = r));
ws.onmessage = e => {
  const m = JSON.parse(e.data);
  if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.rej(new Error(JSON.stringify(m.error))) : p.res(m.result); }
};
const raw = (method, params = {}, sessionId) => new Promise((res, rej) => {
  const n = ++id; pend.set(n, { res, rej });
  ws.send(JSON.stringify({ id: n, method, params, ...(sessionId ? { sessionId } : {}) }));
});
const { targetInfos } = await raw("Target.getTargets");
const { sessionId } = await raw("Target.attachToTarget", { targetId: targetInfos.find(t => t.type === "page").targetId, flatten: true });
const send = (m, p) => raw(m, p, sessionId);
await send("Page.enable");

// Two prints of everything: the colour one to look at, and the grey one for the black-and-white
// printer, where a solid letter would come out the same black as his pen.
for (const b of BOOKLETS) for (const mode of ["colour", "mono"]) {
  const name = b.file + (mode === "mono" ? "-bw" : "");
  const page = join(work, name + ".html");
  writeFileSync(page, b.html(mode));
  await send("Page.navigate", { url: "file://" + page });
  await wait(1800); // the Arabic font has to be loaded and the text shaped before it is printed

  // A page that runs past the bottom of the sheet pushes its last line onto the next one, and the
  // whole booklet prints wrong from there. Measure every page and say so rather than print it.
  const { result } = await send("Runtime.evaluate", {
    returnByValue: true,
    expression: `[...document.querySelectorAll(".page:not(.cover)")].map((p, i) => {
      const pad = parseFloat(getComputedStyle(p).paddingBottom);
      const over = p.lastElementChild.getBoundingClientRect().bottom - (p.getBoundingClientRect().bottom - pad);
      return over;
    })`,
  });
  const over = result.value.map((v, i) => (v > 1 ? `${i + 1} (+${v.toFixed(0)}px)` : null)).filter(Boolean);
  if (over.length) throw new Error(`${name}: these pages overflow the sheet — ${over.join(", ")}`);
  const spare = Math.max(...result.value.map(v => -v)) / 3.7795; // px → mm, the emptiest sheet

  const { data } = await send("Page.printToPDF", {
    printBackground: true, paperWidth: 8.27, paperHeight: 11.69, // A4 in inches
    marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0, preferCSSPageSize: true,
  });
  const pdf = Buffer.from(data, "base64");
  writeFileSync(OUT + name + ".pdf", pdf);
  const pages = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
  console.log(`${name}.pdf — ${pages} pages, ${(pdf.length / 1024).toFixed(0)} KB, up to ${spare.toFixed(0)}mm spare — ${b.title}${mode === "mono" ? " (black and white)" : ""}`);
}

ws.close();
chrome.kill();
await wait(600); // Chrome is still writing its profile the instant it is killed
rmSync(work, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 });
