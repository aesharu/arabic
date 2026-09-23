// Verbs: every form of the most useful verbs — present, past, future, for everyone (the "to her" form marked),
// telling someone to do it, saying no, "I want to…" — and a drill: which form is it?
//   #/verbs          the first verb
//   #/verbs/<id>     one verb (data/verbs.js ids)
import { t, tx, num } from "../core/i18n.js";
import { esc, ar, lat, translit, flag, rich, playIcon, pageHead, shuffle, typing } from "../core/dom.js";
import { icon } from "../core/art.js";
import { say } from "../core/speech.js";
import { VERBS } from "../data/verbs.js";
import { PERSONS, conjugate, patterns } from "../core/verbs.js";
import { celebrate } from "../core/celebrate.js";

const TENSES = ["now", "past", "will"];
let tense = "now"; // the column shown on narrow screens
let mix = false; // drill: every verb, or just this one
const score = { right: 0, total: 0, run: 0 };
const mean = v => lat(tx({ en: v.en, najdi: v.en }));
const tensesOf = v => (v.id === "want" ? ["now", "past"] : TENSES); // "I will want" isn't something you'd say
const cell = f => `<button type="button" class="vb-form" data-say="${esc(f.ar)}">${ar(f.ar)}<span>${translit(f.say)}</span></button>`;

function table(v) {
  const forms = conjugate(v);
  const cols = tensesOf(v);
  return `<div class="seg vb-seg" role="group">${cols.map(k => `<button type="button" data-tense="${k}" aria-pressed="${k === tense}">${t(`gl.t.${k}`)}</button>`).join("")}</div>
    <table class="vb-table show-${tense}">
      <thead><tr><th scope="col"><span class="visually-hidden">${t("vb.who")}</span></th>${cols.map(k => `<th scope="col" class="c-${k}">${t(`gl.t.${k}`)}</th>`).join("")}</tr></thead>
      <tbody>${PERSONS.map((p, i) => `<tr${p === "youF" ? ' class="is-her"' : ""}>
        <th scope="row">${esc(t(`gl.p.${p}`))}${p === "youF" ? ` ${icon("heart")}` : ""}</th>
        ${cols.map(k => `<td class="c-${k}">${cell(forms[k][i])}</td>`).join("")}
      </tr>`).join("")}</tbody>
    </table>`;
}

function verbCard(v) {
  return `<section class="vb-card">
    <div class="vb-head">
      <button type="button" class="vb-big" data-say="${esc(v.now.ar)}">${ar(v.now.ar)}${playIcon}</button>
      <div><h2 class="vb-mean">${mean(v)}</h2><p class="muted">${translit(v.now.say)} · ${ar(v.he.ar)} ${translit(v.he.say)} ${flag(v)}</p></div>
    </div>
    ${v.note ? `<p class="callout"><span>${rich(tx(v.note))}</span></p>` : ""}
    ${table(v)}
    ${v.imp ? `<h3>${t("vb.imp")}</h3>
      <div class="vb-imp"><span class="muted">${t("vb.toHim")}</span>${cell(v.imp.him)}<span class="muted">${t("vb.toHer")} ${icon("heart")}</span>${cell(v.imp.her)}</div>` : ""}
    <h3>${t("vb.more")}</h3>
    <div class="vocab">${patterns(v).map(x => `<button type="button" class="phrase lv-phrase" data-say="${esc(x.ar.replace(/[؟!]/g, ""))}">${ar(x.ar, "phrase-ar")}
      <span class="phrase-t">${translit(x.say)}<span class="gr-mean">${lat(x.en)}</span></span>${playIcon}</button>`).join("")}</div>
  </section>`;
}

// Drill: "you (to her) · past — go" → pick the form.
function newQuestion(v) {
  const verb = mix ? VERBS[Math.floor(Math.random() * VERBS.length)] : v;
  const cols = tensesOf(verb);
  const k = cols[Math.floor(Math.random() * cols.length)];
  const p = Math.floor(Math.random() * PERSONS.length);
  const forms = conjugate(verb)[k];
  const right = forms[p];
  const others = shuffle(forms.filter(f => f.ar !== right.ar)).filter((f, i, a) => a.findIndex(x => x.ar === f.ar) === i).slice(0, 3);
  return { verb, tense: k, person: PERSONS[p], right, options: shuffle([right, ...others]), picked: null };
}

function drill(q) {
  const answered = q.picked !== null;
  const ok = answered && q.options[q.picked].ar === q.right.ar;
  return `<section class="vb-drill">
    <div class="panel-head"><h2>${t("vb.drill")}</h2>
      <label class="vb-mix"><input type="checkbox" data-mix${mix ? " checked" : ""}> ${t("vb.mix")}</label></div>
    <p class="muted">${esc(t("vb.drillSub"))} <b>${esc(t("vb.score", { n: num(score.right), total: num(score.total) }))}</b> · ${esc(t("vb.run", { n: num(score.run) }))}</p>
    <div class="pr-card">
      <p class="vb-ask">${ar(q.verb.now.ar)} <span>${mean(q.verb)}</span></p>
      <p class="vb-who">${esc(t(`gl.p.${q.person}`))} · ${esc(t(`gl.t.${q.tense}`))}</p>
      <div class="opts pr-opts is-ar">${q.options.map((o, k) => {
        let cls = "opt pr-opt";
        if (answered && o.ar === q.right.ar) cls += " right";
        else if (answered && k === q.picked) cls += " wrong";
        return `<button type="button" class="${cls}" data-pick="${k}"${answered ? " disabled" : ""}><kbd>${k + 1}</kbd>${ar(o.ar)}<span>${translit(o.say)}</span></button>`;
      }).join("")}</div>
      ${answered ? `<div class="pr-fb"><p class="pr-verdict ${ok ? "is-right" : "is-wrong"}">${ok ? icon("check") : ""}${t(ok ? "st.right" : "st.wrong")}</p>
        <button type="button" class="btn btn-primary" data-again>${t("pr.next")} <kbd>Enter</kbd></button></div>` : ""}
    </div>
  </section>`;
}

export default {
  titleKey: "vb.title",
  mount(root, { params, signal }) {
    const v = VERBS.find(x => x.id === params[0]) ?? VERBS[0];
    let q = newQuestion(v);
    if (!tensesOf(v).includes(tense)) tense = "now";

    const render = () => {
      root.innerHTML = `${pageHead(t("vb.title"), esc(t("vb.sub", { n: num(VERBS.length) })), "", "", "camels")}
        <p class="callout"><span>${rich(t("vb.pattern"))}</span></p>
        <div class="vb-list" role="group" aria-label="${esc(t("vb.pick"))}">${VERBS.map(x => `<a href="#/verbs/${x.id}"${x === v ? ' aria-current="page"' : ""}>${ar(x.now.ar)}<small>${esc(x.en)}</small></a>`).join("")}</div>
        ${verbCard(v)}
        <div data-drill>${drill(q)}</div>`;
      root.querySelector(".vb-list [aria-current]")?.scrollIntoView({ block: "nearest", inline: "center" });
    };
    const paintDrill = () => (root.querySelector("[data-drill]").innerHTML = drill(q));
    const pick = k => {
      if (q.picked !== null || !q.options[k]) return;
      q.picked = k;
      const ok = q.options[k].ar === q.right.ar;
      score.total++;
      score.right += ok ? 1 : 0;
      score.run = ok ? score.run + 1 : 0;
      say(q.right.ar);
      paintDrill();
      if (ok && score.run > 0 && score.run % 5 === 0) celebrate(root.querySelector(".vb-drill .pr-verdict"));
    };
    const again = () => {
      q = newQuestion(v);
      paintDrill();
    };
    render();

    root.addEventListener("click", e => {
      const tb = e.target.closest("[data-tense]");
      if (tb) {
        tense = tb.dataset.tense;
        root.querySelectorAll("[data-tense]").forEach(b => b.setAttribute("aria-pressed", b === tb));
        root.querySelector(".vb-table").className = `vb-table show-${tense}`;
        return;
      }
      const p = e.target.closest("[data-pick]");
      if (p) return pick(+p.dataset.pick);
      if (e.target.closest("[data-again]")) again();
    }, { signal });
    root.addEventListener("change", e => {
      if (e.target.matches("[data-mix]")) {
        mix = e.target.checked;
        again();
      }
    }, { signal });
    document.addEventListener("keydown", e => {
      if (typing(e) || document.querySelector("dialog[open]")) return;
      if (/^[1-4]$/.test(e.key)) pick(+e.key - 1);
      else if (e.key === "Enter" && q.picked !== null) {
        e.preventDefault();
        again();
      }
    }, { signal });
  },
};
