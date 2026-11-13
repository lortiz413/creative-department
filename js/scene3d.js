// A small real time 3D piece: a knot that goes from wireframe blockout to a lit final render as you scroll.
import * as THREE from "./vendor/three.module.min.js";

export function start(canvas, reduced) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  cam.position.set(0, 0, 6.2);

  const geo = new THREE.TorusKnotGeometry(1.15, 0.42, 220, 28, 2, 3);
  const solid = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xc21f35, metalness: 0.6, roughness: 0.25, transparent: true, opacity: 0 }));
  const wire = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.TorusKnotGeometry(1.15, 0.42, 90, 12, 2, 3)), new THREE.LineBasicMaterial({ color: 0xf3ece4, transparent: true, opacity: 0.55 }));
  const group = new THREE.Group();
  group.add(solid, wire);
  scene.add(group);

  const gel = new THREE.PointLight(0xe3192c, 90, 30); gel.position.set(-4, 3, 4);
  const key = new THREE.PointLight(0xfff1e0, 160, 30); key.position.set(4, 2, 5);
  const rim = new THREE.PointLight(0xffffff, 90, 30); rim.position.set(0, -4, -3);
  scene.add(gel, key, rim, new THREE.AmbientLight(0xffffff, 0.5));

  let dragX = 0, dragY = 0, down = false, px = 0, py = 0;
  canvas.addEventListener("pointerdown", e => { down = true; px = e.clientX; py = e.clientY; });
  addEventListener("pointerup", () => { down = false; });
  addEventListener("pointermove", e => { if (!down) return; dragY += (e.clientX - px) * 0.008; dragX += (e.clientY - py) * 0.008; px = e.clientX; py = e.clientY; });

  function size() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    cam.aspect = w / h; cam.updateProjectionMatrix();
  }
  new ResizeObserver(size).observe(canvas);
  size();

  let visible = true, p = 0;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(canvas);

  function tick(t) {
    requestAnimationFrame(tick);
    if (!visible) return;
    p += ((window.__cd3d || 0) - p) * 0.08;
    const s = Math.min(1, Math.max(0, (p - 0.15) / 0.6));
    solid.material.opacity = s;
    wire.material.opacity = 0.55 * (1 - s * 0.92);
    group.rotation.y = dragY + p * Math.PI * 2 + (reduced ? 0 : t * 0.00018);
    group.rotation.x = dragX + 0.35 + p * 0.9;
    gel.intensity = 40 + s * 220;
    renderer.render(scene, cam);
  }
  requestAnimationFrame(tick);
}
