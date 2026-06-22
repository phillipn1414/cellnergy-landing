/* ============================================================
   CELLNERGY — scroll engine
   Canvas frame-sequence scrub sections + mouse-driven 360 orbit
   ============================================================ */
function coverDraw(ctx, canvas, img, bgFill) {
  const cw = canvas.clientWidth, ch = canvas.clientHeight;
  ctx.fillStyle = bgFill; ctx.fillRect(0, 0, cw, ch);
  if (!img || !img.complete || !img.naturalWidth) return;
  const ir = img.naturalWidth / img.naturalHeight, cr = cw / ch;
  let dw, dh, dx, dy;
  if (ir > cr) { dh = ch; dw = ch * ir; dx = (cw - dw) / 2; dy = 0; }
  else         { dw = cw; dh = cw / ir; dx = 0; dy = (ch - dh) / 2; }
  ctx.drawImage(img, dx, dy, dw, dh);
}

function setupHiDPI(canvas, ctx, redraw) {
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = canvas.clientWidth  * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    redraw();
  }
  window.addEventListener("resize", resize);
  resize();
}

function preloadFrames(cfg, onFirst) {
  const images = [];
  let firstDone = false;
  for (let i = 0; i < cfg.frameCount; i++) {
    const img = new Image();
    img.src = cfg.framePath(i + 1);
    img.onload = () => { if (!firstDone) { firstDone = true; onFirst(); } };
    images[i] = img;
  }
  return images;
}

/* ---------- scroll-scrubbed sections ---------- */
function initScrub(cfg) {
  const section = document.querySelector(cfg.section);
  const canvas  = section.querySelector("canvas");
  const ctx     = canvas.getContext("2d", { alpha: false });
  const lines   = [...section.querySelectorAll(".line")];
  const bgFill  = cfg.bg || "#f4f4f6";
  let current = -1;
  const images = preloadFrames(cfg, () => draw(0));
  function draw(i) { coverDraw(ctx, canvas, images[i], bgFill); }
  setupHiDPI(canvas, ctx, () => draw(current < 0 ? 0 : current));
  function update() {
    const rect = section.getBoundingClientRect();
    if (rect.bottom < -window.innerHeight || rect.top > window.innerHeight) return;
    const scrollable = rect.height - window.innerHeight;
    const p = Math.min(Math.max(-rect.top / scrollable, 0), 1);
    const idx = Math.min(cfg.frameCount - 1, Math.floor(p * (cfg.frameCount - 1)));
    if (idx !== current) { current = idx; draw(idx); }
    for (const el of lines) {
      const a = parseFloat(el.dataset.in), b = parseFloat(el.dataset.out);
      const mid = (a + b) / 2, half = (b - a) / 2;
      let o = 1 - Math.abs(p - mid) / half;
      o = Math.max(0, Math.min(1, o));
      el.style.opacity = o.toFixed(3);
      el.style.transform = `translateY(${(1 - o) * 26}px)`;
    }
  }
  return { update };
}

/* ---------- mouse-driven 360 orbit ---------- */
function initOrbit(cfg) {
  const canvas = document.querySelector(cfg.canvas);
  if (!canvas) return null;
  const ctx = canvas.getContext("2d", { alpha: false });
  const wrap = canvas.parentElement;
  const hint = document.getElementById("orbit-hint");
  const bgFill = cfg.bg || "#f4f4f6";
  const N = cfg.frameCount;
  let shown = -1, pos = 0, last = performance.now();
  const PERIOD = 7; // seconds for one full revolution (faster = smoother playback)
  const images = preloadFrames(cfg, () => draw(0));
  function draw(i) { coverDraw(ctx, canvas, images[i], bgFill); }
  setupHiDPI(canvas, ctx, () => draw(shown < 0 ? 0 : shown));

  // Tap toggles benefit cards on touch devices (hover handles desktop).
  document.querySelectorAll(".hotspot").forEach((h) => {
    h.addEventListener("touchstart", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".hotspot.open").forEach((o) => { if (o !== h) o.classList.remove("open"); });
      h.classList.toggle("open");
    }, { passive: true });
  });

  // Pause rotation when the viewer is off-screen (saves CPU, lets the page settle).
  let inView = false;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) { inView = entries[0].isIntersecting; }, { threshold: 0.05 }).observe(wrap);
  } else { inView = true; }

  // The bottle rotates on its own; the only interaction is hovering the dots.
  function update() {
    const now = performance.now();
    if (!inView) { last = now; return; }
    const dt = Math.min((now - last) / 1000, 0.1); last = now;
    pos = (pos + dt * (N / PERIOD)) % N;
    const idx = Math.floor(pos);
    if (idx !== shown) { shown = idx; draw(idx); }
  }
  return { update };
}

/* ---------- boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const scrubs = (window.SCRUB_SECTIONS || [])
    .filter((c) => document.querySelector(c.section))
    .map(initScrub);
  const orbit = window.ORBIT_CONFIG ? initOrbit(window.ORBIT_CONFIG) : null;

  const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
  window.__lenis = lenis;
  function raf(t) {
    lenis.raf(t);
    scrubs.forEach((s) => s.update());
    if (orbit) orbit.update();
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      io.unobserve(e.target);
    });
  }, { threshold: 0.2 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  lenis.on("scroll", ({ scroll }) => {
    document.querySelectorAll(".scroll-hint").forEach((h) => (h.style.opacity = scroll > 60 ? "0" : "0.65"));
  });
});
