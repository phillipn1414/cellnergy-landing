/* ============================================================
   CELLNERGY — urgency + bundle logic
   - honest cart-hold timer (persists per visitor, never cheat-resets)
   - bundle selector that updates the CTA
   - exit-intent popup (once per session)
   - smooth-scroll for on-page anchor CTAs
   ============================================================ */
(function () {
  "use strict";

  /* ---- OFFER CONFIG — swap these for the real numbers / Shopify links ---- */
  var PRICES = { "1": 39, "3": 99, "6": 186 };
  var LABELS = { "1": "Single Bottle", "3": "3-Bottle Pack", "6": "6-Bottle Pack" };
  // When live on Shopify, build a cart permalink + auto-apply discount, e.g.:
  //   checkout("3") => "https://<store>.myshopify.com/cart/<VARIANT_ID>:3?discount=LAUNCH"
  var CHECKOUT_BASE = "https://shop.lifepharm.com/products/cellnergy-bottle?ref=RetailDirect";
  function checkout(/* qty */) { return CHECKOUT_BASE; }

  /* ---- honest hold timer ---------------------------------------------- */
  var HOLD_SECONDS = 15 * 60;
  var STORE_KEY = "cn_hold_start";
  var start = parseInt(localStorage.getItem(STORE_KEY), 10);
  if (!start || isNaN(start)) { start = Date.now(); localStorage.setItem(STORE_KEY, String(start)); }

  var launchTimer = document.getElementById("launch-timer");
  var offerTimer = document.getElementById("offer-timer");
  var line1 = document.getElementById("lb-line1");
  var holdMsg = document.getElementById("hold-msg");

  function fmt(s) {
    var m = Math.floor(s / 60), ss = s % 60;
    return m + ":" + (ss < 10 ? "0" : "") + ss;
  }
  var timerInt = setInterval(tick, 1000);
  function tick() {
    var remain = HOLD_SECONDS - Math.floor((Date.now() - start) / 1000);
    if (remain > 0) {
      var t = fmt(remain);
      if (launchTimer) launchTimer.textContent = t;
      if (offerTimer) offerTimer.textContent = t;
    } else {
      // Honest expiry: the price doesn't vanish — we just stop the clock.
      if (line1) line1.innerHTML = "We Held Your Offer For You";
      if (holdMsg) holdMsg.innerHTML = "We Held Your Offer For You, check out below";
      clearInterval(timerInt);
    }
  }
  tick();

  /* ---- bundle selector ------------------------------------------------- */
  var bundles = document.querySelectorAll(".bundle");
  var offerCta = document.getElementById("offer-cta");
  function selectBundle(qty) {
    bundles.forEach(function (b) { b.classList.toggle("selected", b.dataset.qty === qty); });
    // CTA label stays "BUY NOW" for every bundle; only the checkout target changes.
    if (offerCta) offerCta.href = checkout(qty);
  }
  bundles.forEach(function (b) {
    b.addEventListener("click", function () { selectBundle(b.dataset.qty); });
  });
  selectBundle("3");

  /* ---- exit-intent popup (once per session) ---------------------------- */
  var pop = document.getElementById("exit-pop");
  var shown = sessionStorage.getItem("cn_exit_shown");
  function showPop() {
    if (shown || !pop) return;
    pop.hidden = false; shown = "1"; sessionStorage.setItem("cn_exit_shown", "1");
  }
  function hidePop() { if (pop) pop.hidden = true; }
  document.addEventListener("mouseout", function (e) {
    if (e.clientY <= 0 && !e.relatedTarget) showPop();
  });
  var ec = document.getElementById("exit-close");
  var ed = document.getElementById("exit-dismiss");
  var et = document.getElementById("exit-cta");
  if (ec) ec.addEventListener("click", hidePop);
  if (ed) ed.addEventListener("click", hidePop);
  if (et) et.addEventListener("click", hidePop);
  if (pop) pop.addEventListener("click", function (e) { if (e.target === pop) hidePop(); });

  /* ---- smooth-scroll on-page anchors (uses Lenis if present) ----------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (window.__lenis && window.__lenis.scrollTo) window.__lenis.scrollTo(target, { offset: -10 });
      else target.scrollIntoView({ behavior: "smooth" });
    });
  });
})();
