/* ============================================================
   CELLNERGY Hydration System — Acid-Reflux page (v4, premium)
   Trust marquee, hover/tap-reveal problem cards, FAQ accordion,
   honest launch countdown, Lenis smooth scroll, scroll reveals,
   hero/product video fallbacks.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- trust marquee (icon + label, larger) ---------- */
  var SVG = {
    crystal: '<svg viewBox="0 0 24 24"><path d="M6 4h12l3 5-9 11L3 9z"/><path d="M3 9h18"/></svg>',
    molecule: '<svg viewBox="0 0 24 24"><path d="M8 11l8-4M8 12l7 4"/><circle cx="6" cy="12" r="2.4" class="fill"/><circle cx="18" cy="7" r="2.4" class="fill"/><circle cx="16" cy="17" r="2.4" class="fill"/></svg>',
    waves: '<svg viewBox="0 0 24 24"><path d="M2 12c2-5 4-5 6 0s4 5 6 0 4-5 6 0"/></svg>',
    nutrient: '<svg viewBox="0 0 24 24"><path d="M12 21V8M12 8l-4-4M12 8l4-4M4 13c4 0 4 4 8 4s4-4 8-4"/></svg>',
    bpa: '<svg viewBox="0 0 24 24"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M4 4l16 16"/></svg>',
    shield: '<svg viewBox="0 0 24 24"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
  };
  var ITEMS = [
    { svg: "crystal", label: "Mineral-Based Alkalization" },
    { svg: "molecule", label: "Molecular Hydrogen Infusion" },
    { svg: "waves", label: "Terahertz-Frequency Conditioning" },
    { svg: "nutrient", label: "Nutrient Delivery Support" },
    { svg: "bpa", label: "BPA Free" },
    { chip: true, plain: true, logo: "assets/badges/truemed-orange.svg", label: "FSA Eligible" },
    { svg: "shield", label: "90-Day Money-Back Guarantee" },
    { chip: true, logoOnly: true, logo: "assets/icons/asa-logo.svg", label: "American Society on Aging" },
    { logo: "assets/badges/bbb.webp", logoOnly: true, label: "BBB Accredited Business" },
  ];
  var track = document.getElementById("marquee-track");
  if (track) {
    var html = ITEMS.map(function (it) {
      if (it.chip) return '<span class="m-item chip' + (it.plain ? " nobg" : "") + '"><img class="m-logo" src="' + it.logo + '" alt="' + it.label + '">' + (it.logoOnly ? "" : '<span class="m-lab">' + it.label + "</span>") + "</span>";
      if (it.logoOnly) return '<span class="m-item"><img class="m-logo" src="' + it.logo + '" alt="' + it.label + '"></span>';
      if (it.logo) return '<span class="m-item"><img class="m-logo" src="' + it.logo + '" alt="' + it.label + '"><span class="m-lab">' + it.label + "</span></span>";
      return '<span class="m-item"><span class="m-ic">' + SVG[it.svg] + '</span><span class="m-lab">' + it.label + "</span></span>";
    }).join("");
    track.innerHTML = html + html; // duplicate for a seamless loop
  }

  /* ---------- problem hub: hover handled by CSS; tap toggles the pop on touch ---------- */
  var spokes = document.querySelectorAll(".spoke");
  spokes.forEach(function (s) {
    s.addEventListener("click", function (e) {
      e.preventDefault();
      var wasOpen = s.classList.contains("open");
      spokes.forEach(function (o) { o.classList.remove("open"); });
      if (!wasOpen) s.classList.add("open");
    });
  });

  /* ---------- comparison: hover handled by CSS; tap toggles expand on touch ---------- */
  var glance = document.querySelector(".glance");
  if (glance) {
    glance.addEventListener("click", function (e) {
      if (e.target.closest("a")) return;
      glance.classList.toggle("open");
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q"), a = item.querySelector(".faq-a");
    q.addEventListener("click", function () {
      var open = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (o) { o.classList.remove("open"); o.querySelector(".faq-a").style.maxHeight = null; });
      if (!open) { item.classList.add("open"); a.style.maxHeight = a.scrollHeight + "px"; }
    });
  });

  /* ---------- buy tabs: 1 bottle vs 3 bottles (bottom offer only) ---------- */
  var SHOP = "https://shop.lifepharm.com/products/cellnergy-hydration-system?ref=RetailDirect";
  var PLANS = {
    single: {
      was: "$49", now: "$39", badge: "Launch price &middot; save $10", unit: "for 1 bottle", pct: "20%",
      includes: [
        "1 CELLNERGY Hydration System (650 mL / 22 oz)",
        "Mineral diffuser with all 6 elements installed",
        "90-Day hassle-free money-back guarantee",
      ],
      cta: "Get Mine For $39 &rarr;", href: SHOP,
    },
    triple: {
      was: "$147", now: "$99", badge: "Best value &middot; save $48", unit: "for 3 bottles ($33 each)", pct: "33%",
      includes: [
        "3 CELLNERGY Hydration Systems (650 mL / 22 oz)",
        "3 mineral diffusers with all 6 elements installed",
        "90-Day hassle-free money-back guarantee",
      ],
      cta: "Get 3 For $99 &rarr;", href: SHOP + "&quantity=3",
    },
  };
  var elWas = document.getElementById("p-was"),
      elNow = document.getElementById("p-now"),
      elBadge = document.getElementById("p-badge"),
      elUnit = document.getElementById("p-unit"),
      elInc = document.getElementById("p-includes"),
      elCta = document.getElementById("order-cta"),
      elPct = document.getElementById("save-pct"),
      buyTabs = [].slice.call(document.querySelectorAll(".buy-tab"));
  function applyPlan(key) {
    var p = PLANS[key];
    if (!p) return;
    if (elWas) elWas.textContent = p.was;
    if (elNow) elNow.textContent = p.now;
    if (elBadge) elBadge.innerHTML = p.badge;
    if (elUnit) elUnit.textContent = p.unit;
    if (elPct) elPct.textContent = p.pct;
    if (elInc) elInc.innerHTML = p.includes.map(function (i) { return "<li>" + i + "</li>"; }).join("");
    if (elCta) { elCta.innerHTML = p.cta; elCta.setAttribute("href", p.href); }
    buyTabs.forEach(function (t) {
      var on = t.getAttribute("data-plan") === key;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
  }
  buyTabs.forEach(function (t) {
    t.addEventListener("click", function () { applyPlan(t.getAttribute("data-plan")); });
  });

  /* ---------- honest launch countdown (single bottle) ---------- */
  var HOLD_SECONDS = 15 * 60;
  var STORE_KEY = "cn_reflux_hold";
  var start = parseInt(localStorage.getItem(STORE_KEY), 10);
  if (!start || isNaN(start)) { start = Date.now(); localStorage.setItem(STORE_KEY, String(start)); }
  var aTime = document.getElementById("a-time");
  var oTime = document.getElementById("o-time");
  var announceLine = document.querySelector(".announce p");
  var countline = document.getElementById("countline");
  function fmt(s) { var m = Math.floor(s / 60), ss = s % 60; return m + ":" + (ss < 10 ? "0" : "") + ss; }
  var int = setInterval(tick, 1000);
  function tick() {
    var remain = HOLD_SECONDS - Math.floor((Date.now() - start) / 1000);
    if (remain > 0) {
      var t = fmt(remain);
      if (aTime) aTime.textContent = t;
      if (oTime) oTime.textContent = t;
    } else {
      // Honest expiry: the price stays, the clock just stops.
      if (announceLine) announceLine.textContent = "We still held your launch offer for you.";
      if (countline) countline.textContent = "We still held your launch offer for you.";
      clearInterval(int);
    }
  }
  tick();

  /* ---------- video posters: fall back to the still if a clip cannot play ---------- */
  ["cell-vid", "hero-vid", "vid-inside", "vid-offer"].forEach(function (id) {
    var v = document.getElementById(id);
    if (!v) return;
    v.addEventListener("error", function () {
      var img = document.createElement("img");
      img.src = v.getAttribute("poster") || "";
      img.alt = v.getAttribute("aria-label") || "";
      v.replaceWith(img);
    });
  });

  /* ---------- Lenis smooth scroll + scroll-driven reveals + hero parallax-free ---------- */
  var lenis = null;
  if (window.Lenis) { lenis = new Lenis({ lerp: 0.09, smoothWheel: true }); window.__lenis = lenis; }
  function raf(t) { if (lenis) lenis.raf(t); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  var reveals = [].slice.call(document.querySelectorAll(".reveal"));
  function revealInView() {
    var h = window.innerHeight || document.documentElement.clientHeight;
    for (var i = reveals.length - 1; i >= 0; i--) {
      if (reveals[i].getBoundingClientRect().top < h * 0.9) { reveals[i].classList.add("in"); reveals.splice(i, 1); }
    }
  }
  revealInView();
  if (lenis && lenis.on) lenis.on("scroll", revealInView);
  window.addEventListener("scroll", revealInView, { passive: true });
  window.addEventListener("resize", revealInView);
  setTimeout(revealInView, 300);
  setTimeout(revealInView, 1200);

  /* ---------- smooth-scroll on-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis && lenis.scrollTo) lenis.scrollTo(target, { offset: -60 });
      else target.scrollIntoView({ behavior: "smooth" });
    });
  });
})();
