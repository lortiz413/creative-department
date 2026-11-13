// Extra motion: TV static for the intro, sound switch, scrubbed headlines, speed skew and coverflow strips.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const root = document.documentElement;

/* TV static behind the logo while the page loads */
const cv = $(".curtain__static");
if (cv && !reduced) {
  const ctx = cv.getContext("2d");
  cv.width = 240; cv.height = 135;
  const img = ctx.createImageData(240, 135);
  (function noise() {
    if (!document.body.classList.contains("is-loading") && !cv.dataset.last) { cv.dataset.last = 1; setTimeout(() => cv.remove(), 800); }
    if (!cv.isConnected) return;
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) { const v = Math.random() * 255 | 0; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
    ctx.putImageData(img, 0, 0);
    setTimeout(noise, 45);
  })();
}

/* Sound switch: hover previews play with sound once the visitor has clicked anywhere */
window.__cdSound = true;
const sb = $(".nav__sound");
if (sb) sb.addEventListener("click", () => {
  window.__cdSound = !window.__cdSound;
  sb.setAttribute("aria-pressed", String(window.__cdSound));
  const s = $("span", sb);
  s.dataset.en = window.__cdSound ? "Sound on" : "Sound off";
  s.dataset.es = window.__cdSound ? "Con sonido" : "Sin sonido";
  s.textContent = s.dataset[root.lang] || s.dataset.en;
  if (!window.__cdSound) $$(".film video").forEach(v => { v.muted = true; });
});

/* Headlines: each word rises out of its own slot, tied to the scroll position */
function split(h) {
  h.innerHTML = h.textContent.trim().split(/\s+/).map(w => `<span class="w"><span>${w}</span></span>`).join(" ");
}
const heads = reduced ? [] : $$(".display");
heads.forEach(h => {
  split(h);
  new MutationObserver(() => { if (!h.querySelector(".w")) split(h); }).observe(h, { childList: true });
});

/* The light source follows the pointer, so the two shadows on the wall slide the other way */
const back = $(".stage--back");
addEventListener("pointermove", e => {
  if (scrollY > innerHeight) return;
  back.style.setProperty("--lx", ((e.clientX / innerWidth - 0.5) * 2).toFixed(3));
  back.style.setProperty("--ly", ((e.clientY / innerHeight - 0.5) * 2).toFixed(3));
}, { passive: true });

/* Per frame: scroll speed, headline scrub, feature drift, coverflow, process steps */
const feats = $$(".feature .film");
const stripCards = $$(".strip").map(s => ({ el: s, cards: $$(".film", s) }));
const steps = $$(".steps li");
let lastY = scrollY, vel = 0;

function tick() {
  requestAnimationFrame(tick);
  const y = scrollY, vh = innerHeight, vw = innerWidth;
  vel += ((y - lastY) - vel) * 0.18; lastY = y;
  const v = clamp(vel / 45, -1, 1);
  root.style.setProperty("--vel", v.toFixed(3));

  heads.forEach(h => {
    const r = h.getBoundingClientRect();
    if (r.top > vh || r.bottom < 0) return;
    const p = clamp((vh * 0.96 - r.top) / (vh * 0.5));
    const ws = h.querySelectorAll(".w > span"), n = ws.length;
    ws.forEach((w, i) => {
      const l = clamp(p * (n + 2) - i), e = 1 - (1 - l) ** 3;
      w.style.transform = `translateY(${((1 - e) * 110).toFixed(1)}%) rotate(${((1 - e) * 7).toFixed(2)}deg)`;
    });
  });

  feats.forEach((f, i) => {
    const r = f.getBoundingClientRect();
    if (r.top > vh || r.bottom < 0) return;
    const c = (r.top + r.height / 2 - vh / 2) / vh;
    f.style.setProperty("--tx", (c * (i % 2 ? 12 : -12)).toFixed(2) + "vw");
    f.style.setProperty("--py", (c * -5).toFixed(2) + "%");
  });

  if (vw > 820) stripCards.forEach(s => {
    const r = s.el.getBoundingClientRect();
    if (r.top > vh || r.bottom < 0) return;
    s.cards.forEach(c => {
      const b = c.getBoundingClientRect();
      if (b.right < -vw * 0.3 || b.left > vw * 1.3) return;
      const d = clamp((b.left + b.width / 2 - vw / 2) / vw, -1, 1);
      c.style.setProperty("--d", d.toFixed(3));
      c.style.setProperty("--da", Math.abs(d).toFixed(3));
    });
  });

  steps.forEach((s, i) => {
    const r = s.getBoundingClientRect();
    if (r.top > vh * 1.3 || r.bottom < 0) return;
    const p = clamp((vh - r.top) / (vh * 0.45) - (i % 3) * 0.25);
    s.style.setProperty("--sp", (1 - (1 - p) ** 3).toFixed(3));
  });
}
if (!reduced) requestAnimationFrame(tick);

/* Intro sound: a synthesized glitch (stuttering noise, digital blips and a TV power down), timed to the logo animation */
function glitchSound(ctx) {
  const t = ctx.currentTime + 0.02;
  const out = ctx.createGain(); out.gain.value = 0.45; out.connect(ctx.destination);
  const len = Math.floor(ctx.sampleRate * 2.6);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
  let hold = 0, val = 0;
  for (let i = 0; i < len; i++) {
    if (hold-- <= 0) { val = Math.random() * 2 - 1; hold = Math.random() < 0.02 ? Math.random() * 400 | 0 : Math.random() * 6 | 0; }
    d[i] = val;
  }
  const n = ctx.createBufferSource(); n.buffer = buf;
  const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 0.7;
  const g = ctx.createGain(); g.gain.value = 0;
  n.connect(bp); bp.connect(g); g.connect(out);
  [[0, 0.12, 0.1], [0.17, 0.1, 0.5], [0.34, 0.22, 0.7], [0.57, 0.08, 0.3], [0.65, 0.3, 0.8], [0.95, 0.08, 0.25], [1.1, 0.09, 0.9], [1.19, 0.3, 0.35]]
    .forEach(([s, dur, v]) => { g.gain.setValueAtTime(v, t + s); g.gain.setValueAtTime(0.05, t + s + dur); });
  g.gain.setValueAtTime(0.05, t + 1.5); g.gain.linearRampToValueAtTime(0.14, t + 2.28); g.gain.setValueAtTime(0, t + 2.32);
  bp.frequency.setValueAtTime(900, t); bp.frequency.exponentialRampToValueAtTime(5200, t + 0.6);
  bp.frequency.setValueAtTime(700, t + 0.65); bp.frequency.exponentialRampToValueAtTime(3800, t + 1.2);
  n.start(t); n.stop(t + 2.6);
  [[0.18, 220], [0.34, 880], [0.36, 440], [0.65, 1320], [0.67, 110], [1.1, 660], [1.12, 1760]].forEach(([s, f]) => {
    const o = ctx.createOscillator(), og = ctx.createGain();
    o.type = "square"; o.frequency.value = f;
    og.gain.setValueAtTime(0.12, t + s); og.gain.exponentialRampToValueAtTime(0.001, t + s + 0.07);
    o.connect(og); og.connect(out); o.start(t + s); o.stop(t + s + 0.08);
  });
  const o = ctx.createOscillator(), og = ctx.createGain();
  o.type = "sawtooth"; o.frequency.setValueAtTime(2400, t + 2.3); o.frequency.exponentialRampToValueAtTime(40, t + 2.75);
  og.gain.setValueAtTime(0, t); og.gain.setValueAtTime(0.22, t + 2.3); og.gain.exponentialRampToValueAtTime(0.001, t + 2.85);
  o.connect(og); og.connect(out); o.start(t + 2.3); o.stop(t + 2.9);
}

/* Gate: browsers block sound until the visitor clicks. If we are blocked, wait for one click, then run the intro with sound. */
(function intro() {
  const body = document.body;
  let started = false, ctx = null;
  const go = withSound => {
    if (started) return;
    started = true;
    body.classList.remove("is-gated", "needs-click");
    if (withSound && ctx) { try { glitchSound(ctx); } catch (e) {} }
    if (window.__cdOpen) window.__cdOpen();
  };
  const AC = window.AudioContext || window.webkitAudioContext;
  if (reduced || !AC) return go(false);
  try { ctx = new AC(); } catch (e) { return go(false); }
  setTimeout(() => {
    if (ctx.state === "running") return go(true);
    body.classList.add("needs-click");
    const unlock = () => { ctx.resume().then(() => go(true), () => go(false)); };
    ["pointerdown", "keydown"].forEach(ev => addEventListener(ev, unlock, { once: true }));
    setTimeout(() => go(false), 10000);
  }, 200);
})();
