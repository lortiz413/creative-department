// "What the department does": the screen beside the list shows each service with real work.
// It follows whichever row main.js marks as active, and the 3D row gets a line you can drag
// between the 3D layout and the final picture of the same shot.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

const box = $(".stagebox");
if (box) {
  const panes = Object.fromEntries($$(".pane", box).map(p => [p.dataset.pane, p]));
  const svcs = $$(".svc"), num = $(".stagebox__n", box), section = $(".services");
  let current = null, onScreen = false;

  const vids = p => $$("video", p);
  const play = p => vids(p).forEach(v => { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); });
  const pause = p => vids(p).forEach(v => v.pause());

  function show(key) {
    if (key === current || !panes[key]) return;
    const prev = current && panes[current];
    if (prev) { prev.classList.remove("is-on"); prev.classList.add("was-on"); pause(prev); setTimeout(() => prev.classList.remove("was-on"), 750); }
    current = key;
    panes[key].classList.remove("was-on");
    panes[key].classList.add("is-on");
    num.textContent = String(svcs.findIndex(s => s.dataset.stage === key) + 1);
    if (onScreen) play(panes[key]);
  }

  // Follow the active row
  const sync = () => { const on = svcs.find(s => s.classList.contains("is-on")) || svcs[0]; show(on.dataset.stage); };
  svcs.forEach(s => new MutationObserver(sync).observe(s, { attributes: true, attributeFilter: ["class"] }));
  sync();

  // Only play while the section is on screen
  new IntersectionObserver(es => {
    onScreen = es[0].isIntersecting;
    if (current) (onScreen ? play : pause)(panes[current]);
  }, { threshold: 0.05 }).observe(section);

  /* ---------- Drag to compare: 3D layout on the left of the line, final picture on the right ---------- */
  const cmp = $(".pane--cmp", box), bar = $(".cmp__bar", box), a = $(".cmp__a", box), b = $(".cmp__b", box);
  let x = 50, touched = false, dragging = false;
  const set = v => { x = Math.min(96, Math.max(4, v)); cmp.style.setProperty("--x", x.toFixed(1) + "%"); bar.setAttribute("aria-valuenow", Math.round(x)); };
  const fromEvent = e => { const r = cmp.getBoundingClientRect(); set(((e.clientX - r.left) / r.width) * 100); };
  cmp.addEventListener("pointerdown", e => { dragging = true; touched = true; cmp.setPointerCapture(e.pointerId); fromEvent(e); });
  cmp.addEventListener("pointermove", e => { if (dragging) fromEvent(e); });
  ["pointerup", "pointercancel"].forEach(ev => cmp.addEventListener(ev, () => { dragging = false; }));
  bar.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") { touched = true; set(x - 5); e.preventDefault(); }
    if (e.key === "ArrowRight") { touched = true; set(x + 5); e.preventDefault(); }
  });
  set(50);
  // Until someone grabs it, the line sways by itself so it is clear it can move
  (function sway(t) {
    requestAnimationFrame(sway);
    if (touched || reduced || current !== "3d" || !onScreen) return;
    set(50 + Math.sin(t / 1100) * 28);
  })(0);
  // Keep the two takes of the shot in step
  a.addEventListener("timeupdate", () => { if (b.readyState > 1 && Math.abs(b.currentTime - a.currentTime) > 0.12) b.currentTime = a.currentTime; });

  /* ---------- Print: cycle the pieces ---------- */
  const prints = $$(".pane--print img", box);
  let pi = 0;
  if (prints.length) {
    prints[0].classList.add("is-on");
    setInterval(() => {
      if (current !== "print" || !onScreen) return;
      prints[pi].classList.remove("is-on");
      pi = (pi + 1) % prints.length;
      prints[pi].classList.add("is-on");
    }, 2200);
  }
}
