/* ============================================================
   CELLNERGY Hydration System — Acid-Reflux page (v4, premium)
   Trust marquee, hover/tap-reveal problem cards, FAQ accordion,
   honest launch countdown, Lenis smooth scroll, scroll reveals,
   hero/product video fallbacks.
   ============================================================ */
(function () {
  "use strict";

  /* ============================================================
     CART CONFIG — the ONLY place to edit product IDs.
     Find a variant ID in Shopify: Products > CELLNERGY Hydration
     System > click the variant > copy the number at the end of
     the URL (…?variant=XXXXXXXXXXXX).
     On Shopify, the page template sets window.CN_CART and those
     numbers win; the defaults below are used on the standalone page.
     ============================================================ */
  var CN_CART = window.CN_CART = window.CN_CART || {};
  CN_CART.single = CN_CART.single || { variant: 53040002400565 };   // 1 Bottle
  CN_CART.triple = CN_CART.triple || { variant: 53003471388981 };   // 3 Bottles
  // 6-MONTH REFILL 3-PACK (the "Add a 6-month refill 3-pack" checkbox).
  //   variant     -> paste the refill 3-pack variant ID here.
  //   sellingPlan -> leave null for a one-time buy, OR paste a
  //                  Subscribe & Save selling-plan ID to auto-ship it.
  CN_CART.refill = CN_CART.refill || { variant: null, sellingPlan: null };
  // Auto-detects: uses the Shopify AJAX cart + drawer when running on
  // your Shopify store, and just links to the product page anywhere else.
  var onShopify = (CN_CART.onShopify != null) ? CN_CART.onShopify : !!window.Shopify;

  /* ---------- add to cart (AJAX) + open the theme's cart drawer ---------- */
  function addToCart(items) {
    return fetch("/cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ items: items })
    }).then(function (r) { if (!r.ok) throw new Error("cart add failed"); return r.json(); });
  }
  function openCartDrawer() {
    try {
      document.dispatchEvent(new CustomEvent("cart:refresh", { bubbles: true }));
      document.dispatchEvent(new CustomEvent("cart:build", { bubbles: true }));
    } catch (e) {}
    var dr = document.querySelector("cart-drawer");
    if (dr && typeof dr.open === "function") { dr.open(); return; }
    if (dr) { dr.classList.remove("is-empty"); }
    var sel = CN_CART.drawerToggle ||
      '#cart-icon-bubble,[data-cart-drawer-toggle],.js-drawer-open-cart,#CartDrawer-Toggle,.header__icon--cart,a[href="/cart"],a[href^="/cart"]';
    var t = document.querySelector(sel);
    if (t) { t.click(); return; }
    window.location.href = "/cart"; // last resort: never lose the add
  }

  /* ---------- product URL helper ---------- */
  var PDP = "https://shop.lifepharm.com/products/cellnergy-hydration-system";
  function pdp(v) { return PDP + "?variant=" + v + "&ref=RetailDirect"; }

  /* ---------- secondary CTAs (announce, hero, mid-page strips): add 1 bottle + open drawer ---------- */
  function buySingle() {
    var url = pdp(CN_CART.single.variant);
    if (!onShopify || !CN_CART.single.variant) { window.location.href = url; return; }
    addToCart([{ id: CN_CART.single.variant, quantity: 1 }]).then(openCartDrawer).catch(function () { window.location.href = url; });
  }
  document.querySelectorAll('a[href="#offer"]').forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); buySingle(); });
  });

  /* ---------- trust marquee (icon + label, larger) ---------- */
  var SVG = {
    crystal: '<svg viewBox="0 0 24 24"><path d="M6 4h12l3 5-9 11L3 9z"/><path d="M3 9h18"/></svg>',
    molecule: '<svg viewBox="0 0 24 24"><path d="M8 11l8-4M8 12l7 4"/><circle cx="6" cy="12" r="2.4" class="fill"/><circle cx="18" cy="7" r="2.4" class="fill"/><circle cx="16" cy="17" r="2.4" class="fill"/></svg>',
    waves: '<svg viewBox="0 0 24 24"><path d="M2 12c2-5 4-5 6 0s4 5 6 0 4-5 6 0"/></svg>',
    nutrient: '<svg viewBox="0 0 24 24"><path d="M12 21V8M12 8l-4-4M12 8l4-4M4 13c4 0 4 4 8 4s4-4 8-4"/></svg>',
    bpa: '<svg viewBox="0 0 24 24"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M4 4l16 16"/></svg>',
    shield: '<svg viewBox="0 0 24 24"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
  };
  /* v2 marquee: trust badges only (tech chips removed to keep the one-mechanism focus) */
  var ITEMS = [
    { svg: "shield", label: "90-Day Money-Back Guarantee" },
    { chip: true, plain: true, logo: "https://phillipn1414.github.io/cellnergy-landing/assets/badges/truemed-orange.svg", label: "FSA Eligible" },
    { logo: "https://phillipn1414.github.io/cellnergy-landing/assets/badges/bbb.webp", logoOnly: true, label: "BBB Accredited Business" },
    { chip: true, logoOnly: true, logo: "https://phillipn1414.github.io/cellnergy-landing/assets/icons/asa-logo.svg", label: "American Society on Aging" },
    { svg: "bpa", label: "BPA Free" },
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

  /* ---------- buy tabs: 1 bottle vs 3 bottles (drives price, button, save badge, what-you-get) ---------- */
  var PLANS = {
    single: {
      variant: CN_CART.single.variant,
      was: "$49", now: "$39", save: "You save $10", badge: "$10", cta: "Get mine for $39", href: pdp(CN_CART.single.variant),
      includes: [
        "1 CELLNERGY Hydration System (650 mL / 22 oz)",
        "6-element mineral diffuser installed inside",
        "90-day money-back guarantee",
        "HSA / FSA accepted",
      ],
    },
    triple: {
      variant: CN_CART.triple.variant,
      was: "$147", now: "$99", save: "You save $48", badge: "$48", cta: "Get my 3-pack for $99", href: pdp(CN_CART.triple.variant),
      includes: [
        "3 CELLNERGY Hydration Systems (650 mL / 22 oz)",
        "6-element mineral diffuser installed inside",
        "90-day money-back guarantee",
        "HSA / FSA accepted",
      ],
    },
  };
  var currentPlan = "single";
  var elWas = document.getElementById("p-was"),
      elNow = document.getElementById("p-now"),
      elSave = document.getElementById("p-save"),
      elCta = document.getElementById("order-cta"),
      elInc = document.getElementById("p-includes"),
      elAmt = document.getElementById("save-amt"),
      buyTabs = [].slice.call(document.querySelectorAll(".buy-tab"));
  function applyPlan(key) {
    var p = PLANS[key];
    if (!p) return;
    currentPlan = key;
    if (elWas) elWas.textContent = p.was;
    if (elNow) elNow.textContent = p.now;
    if (elSave) elSave.textContent = p.save;
    if (elAmt) elAmt.textContent = p.badge;
    if (elInc) elInc.innerHTML = p.includes.map(function (i) { return "<li>" + i + "</li>"; }).join("");
    if (elCta) { elCta.textContent = p.cta; elCta.setAttribute("href", p.href); }
    buyTabs.forEach(function (t) {
      var on = t.getAttribute("data-plan") === key;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
  }
  buyTabs.forEach(function (t) {
    t.addEventListener("click", function () { applyPlan(t.getAttribute("data-plan")); });
  });
  applyPlan("single"); // set initial state (button link carries the variant)

  /* ---------- CTA: add to cart + open the drawer (on Shopify); link out otherwise ---------- */
  if (elCta) {
    elCta.addEventListener("click", function (e) {
      var plan = PLANS[currentPlan] || PLANS.single;
      if (!onShopify || !plan.variant) return; // let the button's href handle it
      e.preventDefault();
      var items = [{ id: plan.variant, quantity: 1 }];
      var bump = document.getElementById("refill-bump");
      if (bump && bump.checked && CN_CART.refill && CN_CART.refill.variant) {
        var refill = { id: CN_CART.refill.variant, quantity: 1 };
        if (CN_CART.refill.sellingPlan) refill.selling_plan = CN_CART.refill.sellingPlan;
        items.push(refill);
      }
      var label = elCta.textContent;
      elCta.textContent = "Adding…";
      addToCart(items).then(function () {
        elCta.textContent = label;
        openCartDrawer();
      }).catch(function () {
        window.location.href = plan.href; // AJAX failed: fall back so the sale isn't lost
      });
    });
  }

  /* ---------- launch countdown: evergreen 15 min from first visit, persists across refresh, no loop ---------- */
  var CYCLE = 15 * 60 * 1000; // 15 minutes in ms
  var KEY = "lam_offer_deadline";
  var aTime = document.getElementById("a-time");
  var oTime = document.getElementById("o-time");
  var deadline = parseInt(localStorage.getItem(KEY), 10);
  if (!deadline || isNaN(deadline)) {
    deadline = Date.now() + CYCLE;
    try { localStorage.setItem(KEY, deadline); } catch (e) {}
  }
  function fmt(s) { var m = Math.floor(s / 60), ss = s % 60; return m + ":" + (ss < 10 ? "0" : "") + ss; }
  var ivl;
  function tickDown() {
    var remain = Math.max(0, Math.round((deadline - Date.now()) / 1000));
    var t = fmt(remain);
    if (aTime) aTime.textContent = t;
    if (oTime) oTime.textContent = t;
    if (remain <= 0 && ivl) clearInterval(ivl); // stop at 0:00, no reset
  }
  if (aTime || oTime) { tickDown(); ivl = setInterval(tickDown, 1000); }

  /* ---------- video posters: fall back to the still if a clip cannot play ---------- */
  ["ph-vid", "vid-inside", "vid-offer"].forEach(function (id) {
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
      if (id.length < 2 || id === "#offer") return; // #offer buttons add to cart, don't scroll
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis && lenis.scrollTo) lenis.scrollTo(target, { offset: -60 });
      else target.scrollIntoView({ behavior: "smooth" });
    });
  });
})();
