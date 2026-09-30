(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var isPlaceholder = function (v) { return !v || /YOUR_|example\.com/i.test(v); };

  /* ---------- Config-driven links ---------- */
  var waBase = "https://wa.me/" + (C.whatsappNumber || "YOUR_NUMBER");
  var waUrl = waBase + (C.whatsappMessage ? "?text=" + encodeURIComponent(C.whatsappMessage) : "");
  $$("[data-whatsapp]").forEach(function (a) { a.href = waUrl; });
  $$("[data-github]").forEach(function (a) { if (C.github) a.href = C.github; });
  $$("[data-linkedin]").forEach(function (a) { if (C.linkedin) a.href = C.linkedin; });
  $$("[data-email]").forEach(function (a) {
    a.href = "mailto:" + (C.email || "");
    a.textContent = C.email || "Email me";
  });
  var yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Projects ---------- */
  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function linkBtn(url, label, primary) {
    var cls = "btn " + (primary ? "btn-primary" : "btn-ghost");
    if (url) return '<a class="' + cls + '" href="' + esc(url) + '" target="_blank" rel="noopener">' + label + "</a>";
    return '<a class="' + cls + '" role="link" aria-disabled="true" title="Link coming soon" href="#projects">' + label + " (soon)</a>";
  }
  var list = $("#projectList");
  if (list && Array.isArray(C.projects)) {
    list.innerHTML = C.projects.map(function (p) {
      var chips = (p.tech || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
      return '<article class="card project reveal">' +
        '<img src="' + esc(p.image) + '" alt="Preview of ' + esc(p.name) + '" width="640" height="360" loading="lazy" decoding="async">' +
        '<div class="project-body">' +
        "<h3>" + esc(p.name) + "</h3>" +
        "<p>" + esc(p.description) + "</p>" +
        '<p class="solves"><b>Problem solved:</b> ' + esc(p.problem) + "</p>" +
        '<ul class="chips" aria-label="Technologies">' + chips + "</ul>" +
        '<div class="btn-row">' +
        linkBtn(p.github, "GitHub", false) +
        linkBtn(p.demo, "Live Demo", false) +
        '<a class="btn btn-primary" href="#case-' + esc(p.id) + '" data-case="' + esc(p.id) + '">View Case Study</a>' +
        "</div></div></article>";
    }).join("");

    // Placeholder buttons should not jump the page
    $$('[aria-disabled="true"]', list).forEach(function (a) {
      a.addEventListener("click", function (e) { e.preventDefault(); });
    });
    // Open the matching case study, then scroll to it
    $$("[data-case]", list).forEach(function (a) {
      a.addEventListener("click", function (e) {
        var d = document.getElementById("case-" + a.getAttribute("data-case"));
        if (!d) return;
        e.preventDefault();
        d.open = true;
        d.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "center" });
        var s = $("summary", d); if (s) s.focus({ preventScroll: true });
      });
    });
  }

  function prefersReduced() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* ---------- Navbar ---------- */
  var nav = $("#nav"), toggle = $("#navToggle"), menu = $("#navMenu");
  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 24); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
  $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { setMenu(false); toggle.focus(); } });

  /* ---------- Scroll reveal ---------- */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !prefersReduced()) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Contact form ---------- */
  var form = $("#contactForm"), status = $("#formStatus");
  function say(msg, kind) { status.textContent = msg; status.className = "form-status" + (kind ? " " + kind : ""); }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var d = new FormData(form);
    var v = function (k) { return String(d.get(k) || "").trim(); };
    var bad = [];
    ["name", "email", "type", "message"].forEach(function (k) {
      var el = form.elements[k];
      var invalid = !v(k) || (k === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v(k)));
      el.setAttribute("aria-invalid", invalid ? "true" : "false");
      if (invalid) bad.push(el);
    });
    if (bad.length) { say("Please complete the highlighted fields.", "error"); bad[0].focus(); return; }

    var subject = "Project inquiry: " + v("type") + " (" + v("name") + ")";
    var body = "Name: " + v("name") + "\nEmail: " + v("email") + "\nProject type: " + v("type") +
      "\nBudget: " + (v("budget") || "Not specified") + "\n\n" + v("message");

    // Option 1: form service (set C.formEndpoint in config.js)
    if (C.formEndpoint) {
      say("Sending...");
      fetch(C.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: v("name"), email: v("email"), type: v("type"), budget: v("budget"), message: v("message") })
      }).then(function (r) {
        if (!r.ok) throw new Error("bad response");
        form.reset(); say("Message sent. I'll reply soon.", "ok");
      }).catch(function () {
        say("Couldn't send the message. Please email me directly or use WhatsApp.", "error");
      });
      return;
    }

    // Option 2: mailto fallback (no backend needed)
    if (isPlaceholder(C.email)) {
      say("Email isn't set up yet. Add your address in js/config.js.", "error");
      return;
    }
    window.location.href = "mailto:" + C.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    say("Opening your email app. If nothing opens, email me at " + C.email + ".", "ok");
  });
})();
