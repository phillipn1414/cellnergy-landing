/* ============================================================
   CELLNERGY Hydration System — Brain Wellness page
   Trust marquee, interactive brain nodes, bundle tabs + refill add-on,
   sticky add-to-cart, FAQ accordion, Lenis smooth scroll, scroll reveals.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- trust marquee ---------- */
  var SVG = {
    shield: '<svg viewBox="0 0 24 24"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
    medical: '<svg viewBox="0 0 24 24"><path d="M12 4v16M4 12h16"/><circle cx="12" cy="12" r="9"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/><circle cx="12" cy="12" r="10"/></svg>',
    bpa: '<svg viewBox="0 0 24 24"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M4 4l16 16"/></svg>',
    guarantee: '<svg viewBox="0 0 24 24"><circle cx="12" cy="10" r="6"/><path d="M8.5 14L7 21l5-2.5L17 21l-1.5-7"/></svg>',
  };
  var ITEMS = [
    { logo: "assets/badges/bbb.webp", logoOnly: true, label: "BBB Accredited Business" },
    { svg: "medical", label: "Innovations in Medicine" },
    { svg: "check", label: "Clinician’s Choice" },
    { chip: true, logoOnly: true, logo: "assets/icons/asa-logo.svg", label: "American Society on Aging" },
    { svg: "bpa", label: "BPA Free" },
    { logo: "assets/badges/truemed-logo-orange.svg", label: "FSA Eligible" },
    { svg: "guarantee", label: "90-Day Money-Back Guarantee" },
  ];
  var track = document.getElementById("marquee-track");
  if (track) {
    var html = ITEMS.map(function (it) {
      if (it.chip) return '<span class="m-item chip' + (it.plain ? " nobg" : "") + '"><img class="m-logo" src="' + it.logo + '" alt="' + it.label + '">' + (it.logoOnly ? "" : '<span class="m-lab">' + it.label + "</span>") + "</span>";
      if (it.logoOnly && it.logo) return '<span class="m-item"><img class="m-logo" src="' + it.logo + '" alt="' + it.label + '"></span>';
      if (it.logo) return '<span class="m-item"><img class="m-logo" src="' + it.logo + '" alt="' + it.label + '"><span class="m-lab">' + it.label + "</span></span>";
      return '<span class="m-item"><span class="m-ic">' + SVG[it.svg] + '</span><span class="m-lab">' + it.label + "</span></span>";
    }).join("");
    track.innerHTML = html + html;
  }

  /* ---------- interactive brain ---------- */
  var NODES = [
    { tag: "Problem 01", t: "Acidic and flat", d: "Most tap water is a little acidic and flat, the kind that sits forgotten on your desk while you stay under-hydrated." },
    { tag: "Problem 02", t: "Flat, not fresh", d: "Everyday life creates oxidation, and ordinary water sits positive on the ORP scale, so it only adds to that, never fresh." },
    { tag: "Problem 03", t: "Heavy, not light", d: "Plain water can feel heavy and flat, so it is easy to sip less than you mean to through the day." },
  ];
  var bnodes = [].slice.call(document.querySelectorAll(".bnode"));
  var panel = document.getElementById("brain-panel");
  var bpTag = document.getElementById("bp-tag");
  var bpTitle = document.getElementById("bp-title");
  var bpDesc = document.getElementById("bp-desc");
  var activeIdx = 0;
  function setNode(i) {
    if (i === activeIdx && bnodes[i] && bnodes[i].classList.contains("active")) return;
    activeIdx = i;
    bnodes.forEach(function (b, j) { b.classList.toggle("active", j === i); });
    if (!panel) return;
    panel.classList.add("swap");
    setTimeout(function () {
      if (bpTag) bpTag.textContent = NODES[i].tag;
      if (bpTitle) bpTitle.textContent = NODES[i].t;
      if (bpDesc) bpDesc.textContent = NODES[i].d;
      panel.classList.remove("swap");
    }, 160);
  }
  bnodes.forEach(function (b) {
    var i = parseInt(b.getAttribute("data-i"), 10);
    b.addEventListener("mouseenter", function () { setNode(i); });
    b.addEventListener("focus", function () { setNode(i); });
    b.addEventListener("click", function () { setNode(i); });
  });
  if (bnodes[0]) bnodes[0].classList.add("active");

  /* ---------- media fallbacks ---------- */
  var ugc = document.getElementById("ugc-vid");
  if (ugc) ugc.addEventListener("error", function () { ugc.style.display = "none"; });
  // videos with a poster: swap to the still image if the clip cannot play
  ["cell-vid", "cta-vid"].forEach(function (id) {
    var v = document.getElementById(id);
    if (!v) return;
    v.addEventListener("error", function () {
      var p = v.getAttribute("poster");
      if (p) { var img = document.createElement("img"); img.src = p; img.alt = v.getAttribute("aria-label") || ""; img.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;"; v.replaceWith(img); }
      else { v.style.display = "none"; }
    });
  });
  var whyImg = document.getElementById("why-img");
  if (whyImg) {
    var hideWhy = function () { whyImg.style.display = "none"; };
    whyImg.addEventListener("error", hideWhy);
    // catch images that already failed before this script attached the listener
    if (whyImg.complete && whyImg.naturalWidth === 0) hideWhy();
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

  /* ---------- bundle tabs (1 bottle / 3 bottles) + refill add-on ---------- */
  var tabs = [].slice.call(document.querySelectorAll(".buy-tab"));
  var oWas = document.getElementById("o-was");
  var oNow = document.getElementById("o-now");
  var oSave = document.getElementById("o-save");
  var ringAmt = document.getElementById("ring-amt");
  var orderCta = document.getElementById("order-cta");
  var addonCheck = document.getElementById("addon-check");
  var baseHref = orderCta ? orderCta.getAttribute("href") : "";

  function applyAddon(href) {
    // append a refill flag so the cart can add the 6-month refill 3-pack (real variant link TBD)
    if (addonCheck && addonCheck.checked) { return href + (href.indexOf("?") > -1 ? "&" : "?") + "refill3=1"; }
    return href;
  }
  function selectTab(tab) {
    tabs.forEach(function (t) { t.classList.toggle("active", t === tab); });
    if (oWas) oWas.textContent = tab.getAttribute("data-was");
    if (oNow) oNow.textContent = tab.getAttribute("data-now");
    if (oSave) oSave.textContent = tab.getAttribute("data-save");
    if (ringAmt) ringAmt.textContent = tab.getAttribute("data-ring");
    if (orderCta) {
      orderCta.textContent = tab.getAttribute("data-cta");
      baseHref = tab.getAttribute("data-href");
      orderCta.setAttribute("href", applyAddon(baseHref));
    }
  }
  tabs.forEach(function (t) { t.addEventListener("click", function () { selectTab(t); }); });
  if (addonCheck && orderCta) {
    addonCheck.addEventListener("change", function () { orderCta.setAttribute("href", applyAddon(baseHref)); });
  }

  /* ---------- looping 15-minute launch timer (resets every 15 min) ---------- */
  var HOLD = 15 * 60;
  var t0 = Date.now();
  var aTime = document.getElementById("a-time");
  var oTime = document.getElementById("o-time");
  function fmtT(s) { var m = Math.floor(s / 60), ss = s % 60; return m + ":" + (ss < 10 ? "0" : "") + ss; }
  function tickTimer() {
    var elapsed = Math.floor((Date.now() - t0) / 1000);
    var remain = HOLD - (elapsed % HOLD);
    var t = fmtT(remain);
    if (aTime) aTime.textContent = t;
    if (oTime) oTime.textContent = t;
  }
  if (aTime || oTime) { tickTimer(); setInterval(tickTimer, 1000); }

  /* ---------- sticky add-to-cart: show after hero, hide over the offer ---------- */
  var sticky = document.getElementById("stickybar");
  var hero = document.getElementById("top");
  var offer = document.getElementById("close");
  function stickyCheck() {
    if (!sticky || !hero) return;
    var pastHero = (hero.getBoundingClientRect().bottom < 0);
    var onOffer = offer ? (offer.getBoundingClientRect().top < window.innerHeight && offer.getBoundingClientRect().bottom > 0) : false;
    sticky.classList.toggle("show", pastHero && !onOffer);
  }

  /* ---------- Lenis smooth scroll + scroll-driven reveals ---------- */
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
  function onScroll() { revealInView(); stickyCheck(); }
  onScroll();
  if (lenis && lenis.on) lenis.on("scroll", onScroll);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  setTimeout(onScroll, 300);
  setTimeout(onScroll, 1200);

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
