// "Start a project": a button that stays on screen and a three question brief.
// There is no server behind this site, so the brief is copied to the clipboard and Instagram messages open, ready to paste.
const IG = "https://ig.me/m/elcreativedepartment";
const T = {
  en: {
    cta: "Start a project", title: "Tell me what you need", close: "Close",
    q1: "What do you need?", a1: ["A commercial", "Reels for social", "3D or previz", "Branding or design", "Something else"],
    q2: "When do you need it?", a2: ["As soon as possible", "This month", "In a few months", "Just exploring"],
    q3: "What budget are you working with?", a3: ["Under $1,000", "$1,000 to $5,000", "Over $5,000", "Not sure yet"],
    name: "Your name or brand", more: "Anything else I should know? (optional)",
    send: "Copy my brief", done: "Brief copied. Now open Instagram and paste it in the message.", openig: "Open Instagram messages",
    need: "Pick one answer for each question first.", hi: "Hi Luis, I saw your site."
  },
  es: {
    cta: "Empieza un proyecto", title: "Cuéntame qué necesitas", close: "Cerrar",
    q1: "¿Qué necesitas?", a1: ["Un comercial", "Reels para redes", "3D o previz", "Branding o diseño", "Otra cosa"],
    q2: "¿Para cuándo?", a2: ["Lo antes posible", "Este mes", "En unos meses", "Solo estoy explorando"],
    q3: "¿Con qué presupuesto cuentas?", a3: ["Menos de $1,000", "$1,000 a $5,000", "Más de $5,000", "Todavía no sé"],
    name: "Tu nombre o marca", more: "¿Algo más que deba saber? (opcional)",
    send: "Copiar mi brief", done: "Brief copiado. Ahora abre Instagram y pégalo en el mensaje.", openig: "Abrir mensajes de Instagram",
    need: "Escoge una respuesta para cada pregunta primero.", hi: "Hola Luis, vi tu página."
  }
};
const lang = () => (document.documentElement.lang === "es" ? "es" : "en");

const fab = document.createElement("button");
fab.type = "button"; fab.className = "fab";
document.body.append(fab);

const dlg = document.createElement("div");
dlg.className = "brief"; dlg.hidden = true;
dlg.setAttribute("role", "dialog"); dlg.setAttribute("aria-modal", "true");
document.body.append(dlg);

let picks = {}, lastFocus = null;

function render() {
  const t = T[lang()];
  fab.textContent = t.cta;
  const group = (k, q, as) => `<fieldset><legend>${q}</legend><div class="brief__chips">${as.map((a, i) =>
    `<button type="button" class="chip" data-k="${k}" data-i="${i}" aria-pressed="${picks[k] === i}">${a}</button>`).join("")}</div></fieldset>`;
  dlg.setAttribute("aria-label", t.title);
  dlg.innerHTML = `<div class="brief__box">
    <button type="button" class="brief__close">${t.close}</button>
    <h2>${t.title}</h2>
    ${group("q1", t.q1, t.a1)}${group("q2", t.q2, t.a2)}${group("q3", t.q3, t.a3)}
    <label>${t.name}<input type="text" name="name" autocomplete="organization" maxlength="80"></label>
    <label>${t.more}<textarea name="more" rows="2" maxlength="400"></textarea></label>
    <button type="button" class="btn brief__send">${t.send}</button>
    <p class="brief__msg" role="status"></p>
  </div>`;
}

function open() {
  lastFocus = document.activeElement;
  render();
  dlg.hidden = false; fab.hidden = true;
  document.body.classList.add("is-locked");
  dlg.querySelector(".brief__close").focus();
}
function close() {
  if (dlg.hidden) return;
  dlg.hidden = true; fab.hidden = false;
  document.body.classList.remove("is-locked");
  if (lastFocus) lastFocus.focus();
}

fab.addEventListener("click", open);
addEventListener("keydown", e => { if (e.key === "Escape") close(); });
dlg.addEventListener("click", e => {
  const t = T[lang()];
  if (e.target === dlg || e.target.closest(".brief__close")) return close();
  const chip = e.target.closest(".chip");
  if (chip) {
    picks[chip.dataset.k] = Number(chip.dataset.i);
    dlg.querySelectorAll(`.chip[data-k="${chip.dataset.k}"]`).forEach(c => c.setAttribute("aria-pressed", String(c === chip)));
    return;
  }
  if (e.target.closest(".brief__send")) {
    const msg = dlg.querySelector(".brief__msg");
    if (picks.q1 == null || picks.q2 == null || picks.q3 == null) { msg.textContent = t.need; return; }
    const name = dlg.querySelector('[name="name"]').value.trim();
    const more = dlg.querySelector('[name="more"]').value.trim();
    const text = [t.hi + (name ? " " + name + "." : ""), t.q1 + " " + t.a1[picks.q1] + ".", t.q2 + " " + t.a2[picks.q2] + ".", t.q3 + " " + t.a3[picks.q3] + ".", more].filter(Boolean).join("\n");
    // The copy is the click. Opening Instagram is a second, real link, so no popup blocker gets in the way.
    const go = copied => {
      const a = document.createElement("a");
      a.className = "btn brief__open"; a.href = IG; a.target = "_blank"; a.rel = "noopener"; a.textContent = t.openig;
      dlg.querySelector(".brief__send").replaceWith(a);
      if (copied) { msg.textContent = t.done; a.focus(); return; }
      // The browser refused to copy: show the brief so it can be copied by hand
      const ta = dlg.querySelector('[name="more"]');
      ta.value = text; ta.rows = 6; ta.focus(); ta.select();
      msg.textContent = lang() === "es" ? "Copia este texto y envíalo por Instagram." : "Copy this text and send it on Instagram.";
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => go(true), () => go(false)); else go(false);
  }
});

// Keep the button label in the page language, and send the big contact button to the same brief
new MutationObserver(() => { fab.textContent = T[lang()].cta; }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
fab.textContent = T[lang()].cta;
const contactBtn = document.querySelector(".contact .btn");
if (contactBtn) contactBtn.addEventListener("click", e => { e.preventDefault(); open(); });

// Hide the floating button while the intro is covering the page and while the contact section is on screen
const contact = document.querySelector(".contact");
if (contact && "IntersectionObserver" in window) new IntersectionObserver(es => { fab.classList.toggle("is-away", es[0].isIntersecting); }, { threshold: 0.35 }).observe(contact);
