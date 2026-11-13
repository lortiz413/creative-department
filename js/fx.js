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
