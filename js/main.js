import { FEATURED, FILMS, FAN, MORE, BUILT } from "./works.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
let lang = "en";
try { lang = localStorage.getItem("cd-lang") || ((navigator.language || "en").slice(0, 2) === "es" ? "es" : "en"); } catch (e) {}

/* ---------- Build the films ---------- */
function filmCard(f) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "film";
  b.dataset.id = f.id;
  b.innerHTML = `
    <div class="film__frame">
      <img src="assets/posters/${f.id}.jpg" alt="" loading="lazy">
      <video src="assets/video/${f.id}.mp4" muted loop playsinline preload="none"></video>
    </div>
    <div class="film__text">
      <h3 class="film__title">${f.title}</h3>
      <div class="film__meta">
        <p class="film__kind" data-en="${f.kind.en}" data-es="${f.kind.es}"></p>
        <p class="film__desc" data-en="${f.desc.en}" data-es="${f.desc.es}"></p>
      </div>
    </div>`;
  b.setAttribute("aria-label", `${f.title}. Play`);
  const v = $("video", b);
  const on = () => {
    b.classList.add("is-live");
    v.muted = window.__cdSound === false;
    v.play().catch(() => { v.muted = true; v.play().catch(() => {}); });
  };
  const off = () => { b.classList.remove("is-live"); v.pause(); };
  b.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") on(); });
  b.addEventListener("pointerleave", off);
  b.addEventListener("click", () => openPlayer(f));
  return b;
}
const features = $("#features");
FEATURED.forEach(f => features.append(filmCard(f)));
const track = $(".strip__track");
FILMS.forEach(f => track.append(filmCard(f)));
FAN.forEach(f => $("#features2").append(filmCard(f)));
BUILT.forEach(f => $("#features3").append(filmCard(f)));
MORE.forEach(f => $("#track2").prepend(filmCard(f)));
const strips = $$(".strip").map(el => ({ el, track: $(".strip__track", el), rev: el.classList.contains("strip--rev"), dist: 0 }));

/* ---------- Hero marquee text ---------- */
const PHRASE = { en: "I make ideas move", es: "Hago que las ideas se muevan" };
function fillRows() {
  // Only as many copies as the screen needs. Eight copies made a layer too wide for phone GPUs, and the text flickered.
  $$(".row__in").forEach(r => {
    const one = `<span>${PHRASE[lang]}</span>`;
    r.innerHTML = one;
    const w = r.firstChild.getBoundingClientRect().width || 1200;
    r.innerHTML = Array(2 * Math.max(1, Math.ceil(innerWidth * 1.3 / w))).fill(one).join("");
  });
}

/* ---------- Language ---------- */
function applyLang() {
  document.documentElement.lang = lang;
  $$("[data-en]").forEach(el => {
    const t = el.dataset[lang];
    if (el.hasAttribute("data-split")) el.innerHTML = t.split(" ").map(w => `<span>${w}</span>`).join(" ");
    else el.textContent = t;
  });
  fillRows();
  $(".nav__lang").setAttribute("aria-label", lang === "en" ? "Cambiar a español" : "Switch to English");
  try { localStorage.setItem("cd-lang", lang); } catch (e) {}
  requestAnimationFrame(measure);
}
$(".nav__lang").addEventListener("click", () => { lang = lang === "en" ? "es" : "en"; applyLang(); });

/* ---------- Player ---------- */
const player = $(".player"), pv = $(".player__video");
let lastFocus = null;
function openPlayer(f) {
  lastFocus = document.activeElement;
  pv.src = `assets/video/${f.id}.mp4`;
  pv.poster = `assets/posters/${f.id}.jpg`;
  $(".player__title").textContent = `${f.title}, ${f.kind[lang]}`;
  player.hidden = false;
  document.body.classList.add("is-locked");
  pv.play().catch(() => {});
  $(".player__close").focus();
}
function closePlayer() {
  if (player.hidden) return;
  pv.pause(); pv.removeAttribute("src"); pv.load();
  player.hidden = true;
  document.body.classList.remove("is-locked");
  if (lastFocus) lastFocus.focus();
}
$(".player__close").addEventListener("click", closePlayer);
player.addEventListener("click", e => { if (e.target === player) closePlayer(); });
addEventListener("keydown", e => { if (e.key === "Escape") closePlayer(); });

/* ---------- Cursor and spotlight ---------- */
const cursor = $(".cursor"), hero = $(".hero"), light = $(".hero__light");
if (finePointer) {
  addEventListener("pointermove", e => {
    cursor.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
    cursor.classList.toggle("is-play", !!e.target.closest(".film"));
    const r = hero.getBoundingClientRect();
    if (r.bottom > 0) { light.style.setProperty("--mx", e.clientX + "px"); light.style.setProperty("--my", e.clientY - r.top + "px"); }
    stretchContact(e.clientX);
  }, { passive: true });
}
function stretchContact(x) {
  const words = $$(".contact__big span");
  if (!words.length) return;
  const box = $(".contact").getBoundingClientRect();
  if (box.top > innerHeight || box.bottom < 0) return;
  words.forEach(w => {
    const r = w.getBoundingClientRect();
    const d = Math.abs(x - (r.left + r.width / 2)) / innerWidth;
    w.style.setProperty("--w", (62 + 63 * clamp(1 - d * 2.6)).toFixed(1) + "%");
  });
}

/* ---------- Scroll driven pieces ---------- */
const mask = $(".mask"), word = $(".mask__word"), eye = $(".mask__eye"), plate = $(".mask__plate"), sizzle = $(".mask__video");
const strip = $(".strip"), rows = $$(".row"), luis = $(".stage__luis");
const svcs = $$(".svc"), services = $(".services"), cap = $(".services__cap i");
const featFrames = () => $$(".feature .film__frame");
let stripDist = 0, sideways = true, lastY = scrollY, vel = 0;

function measure() {
  // Fall through the stem of the I
  const wr = word.getBoundingClientRect(), er = eye.getBoundingClientRect();
  if (wr.width) {
    const ox = ((er.left + er.width / 2 - wr.left) / wr.width) * 100;
    word.style.transformOrigin = `${ox.toFixed(2)}% 52%`;
  }
  sideways = !reduced && innerWidth > 820;
  strips.forEach(s => {
    if (sideways) { s.dist = Math.max(0, s.track.scrollWidth - innerWidth); s.el.style.height = `${innerHeight + s.dist}px`; }
    else s.el.style.height = "";
  });
  frame();
}

function frame() {
  const y = scrollY, vh = innerHeight;
  vel += (Math.abs(y - lastY) - vel) * 0.25; lastY = y;

  // Hero: rows slide with scroll and the letters stretch with speed
  if (y < vh * 1.2 && !reduced) {
    if (finePointer) {
      // Desktop only: on phones the rows just run their own loop, stretching giant type every frame stutters there
      rows[0].style.transform = `translateX(${-y * 0.5}px)`;
      rows[1].style.transform = `translateX(${y * 0.5 - 300}px)`;
      const w = (62 + clamp(vel / 60) * 63).toFixed(0) + "%";
      if (w !== frame.w) { frame.w = w; rows.forEach(r => r.style.setProperty("--w", w)); }
    }
    luis.style.setProperty("--zoom", (1 + clamp(y / vh) * 0.08).toFixed(3));
  }

  // FILM window
  if (!reduced) {
    const r = mask.getBoundingClientRect();
    const p = clamp(-r.top / (r.height - vh));
    const near = r.top < vh && r.bottom > 0;
    if (near) {
      const e = p * p * p;
      word.style.transform = `scale(${(1 + e * 70).toFixed(3)})`;
      plate.style.opacity = p > 0.86 ? (1 - (p - 0.86) / 0.1).toFixed(2) : 1;
      mask.classList.toggle("is-open", p > 0.9);
      if (sizzle.paused) sizzle.play().catch(() => {});
    } else if (!sizzle.paused) sizzle.pause();
  }

  // Featured frames open like a shutter as they arrive
  featFrames().forEach(f => {
    const r = f.getBoundingClientRect();
    const p = reduced ? 1 : clamp((vh - r.top) / (vh * 0.75));
    const c = (1 - p) * 12;
    f.style.setProperty("--clip", c.toFixed(2) + "%");
    f.style.setProperty("--clipn", (c / 100).toFixed(3));
  });

  // Sideways strip
  if (sideways) strips.forEach(s => {
    const r = s.el.getBoundingClientRect();
    if (r.top > vh || r.bottom < 0) return;
    const p = clamp(-r.top / (r.height - vh));
    s.track.style.transform = `translateX(${(-(s.rev ? 1 - p : p) * s.dist).toFixed(1)}px)`;
  });

  // Services: light up the row at the middle of the screen, feed the 3D object
  const sr = services.getBoundingClientRect();
  if (sr.top < vh && sr.bottom > 0) {
    let best = null, bd = 1e9;
    svcs.forEach(s => { const b = s.getBoundingClientRect(); const d = Math.abs(b.top + b.height / 2 - vh * 0.5); if (d < bd) { bd = d; best = s; } });
    svcs.forEach(s => s.classList.toggle("is-on", s === best));
    const p = clamp((vh * 0.6 - sr.top) / (sr.height - vh * 0.5));
    cap.style.setProperty("--p", p.toFixed(3));
    window.__cd3d = p;
  }
}
let ticking = false;
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { frame(); ticking = false; }); } }, { passive: true });
addEventListener("resize", measure);

/* ---------- 3D: load only when the section is close ---------- */
const io = new IntersectionObserver(es => {
  if (es.some(e => e.isIntersecting)) {
    io.disconnect();
    import("./scene3d.js").then(m => m.start($("#scene3d"), reduced)).catch(() => { $(".services__viz").style.display = "none"; services.style.gridTemplateColumns = "1fr"; });
  }
}, { rootMargin: "100% 0px" });
io.observe(services);

/* ---------- Go ---------- */
applyLang();
const lift = () => { if (!document.body.classList.contains("is-loading")) return; fillRows(); document.body.classList.remove("is-loading"); measure(); };
const gate = window.__cdGate || Promise.resolve();
const ready = Promise.all([document.fonts ? document.fonts.ready : 0, gate.then(() => new Promise(r => setTimeout(r, reduced ? 0 : 2300)))]);
ready.then(lift);
gate.then(() => setTimeout(lift, 4000));
addEventListener("load", measure);
