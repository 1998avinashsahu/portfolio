/* ============================================
   Site settings + small helpers shared by every page.
   EDIT THE SETTINGS BLOCK BELOW. Nothing else needs to change.
   ============================================ */
(function () {
  var SITE = {
    // Paste your Cal.com or Calendly link here (for example 'https://cal.com/avinash/20min').
    // While empty, the "call" buttons send a pre-filled email request instead.
    bookingUrl: '',

    // WhatsApp number, digits only with country code. Set to '' to hide every WhatsApp button.
    whatsapp: '919922436794',

    // GoatCounter site code (free, no cookies). If your stats page is avinash.goatcounter.com,
    // the code is 'avinash'. While empty, no analytics script is loaded at all.
    goatcounterCode: '',

    email: 'avinashsahu7415@gmail.com',

    // Real quotes only, with the person's permission. While empty, the testimonials section stays hidden.
    // Example: { quote: 'Short quote here.', name: 'First Last', role: 'Director', org: 'US nonprofit' }
    testimonials: []
  };
  window.SITE = SITE;

  function ready(fn) {
    if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    // ---- booking buttons ----
    var callMail = 'mailto:' + SITE.email + '?subject=' + encodeURIComponent('Free 20-minute call request') +
      '&body=' + encodeURIComponent('Hi Avinash,\n\nI would like a free 20-minute call.\n\nBest days and times (with my time zone):\n\nWhat I need help with:\n\nThanks,');
    document.querySelectorAll('[data-book]').forEach(function (a) {
      var label = a.querySelector('.book-label');
      if (SITE.bookingUrl) {
        a.href = SITE.bookingUrl; a.target = '_blank'; a.rel = 'noopener';
        if (label) label.textContent = 'Book a free 20-min call';
      } else {
        a.href = callMail;
        if (label) label.textContent = 'Request a free 20-min call';
      }
    });

    // ---- WhatsApp buttons ----
    var waText = encodeURIComponent('Hi Avinash, I found your portfolio and have a question about ');
    document.querySelectorAll('[data-wa]').forEach(function (a) {
      if (SITE.whatsapp) {
        a.href = 'https://wa.me/' + SITE.whatsapp + '?text=' + waText;
        a.target = '_blank'; a.rel = 'noopener';
      } else {
        a.style.display = 'none';
      }
    });

    // ---- testimonials (hidden until there is at least one real quote) ----
    var section = document.getElementById('testimonials');
    var grid = document.getElementById('testimonialGrid');
    if (section && grid && SITE.testimonials && SITE.testimonials.length) {
      SITE.testimonials.forEach(function (t) {
        var card = document.createElement('figure');
        card.className = 'quote-card';
        var q = document.createElement('blockquote'); q.textContent = t.quote;
        var cap = document.createElement('figcaption');
        var who = document.createElement('strong'); who.textContent = t.name;
        var meta = document.createElement('span'); meta.textContent = [t.role, t.org].filter(Boolean).join(', ');
        cap.appendChild(who); cap.appendChild(meta);
        card.appendChild(q); card.appendChild(cap);
        grid.appendChild(card);
      });
      section.hidden = false;
    }

    // ---- privacy-friendly analytics (GoatCounter, no cookies) ----
    if (SITE.goatcounterCode) {
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://gc.zgo.at/count.js';
      s.setAttribute('data-goatcounter', 'https://' + SITE.goatcounterCode + '.goatcounter.com/count');
      document.head.appendChild(s);
    }

    // ---- theme toggle on blog and resource pages (the home page has its own) ----
    if (document.body.classList.contains('post-page')) {
      var btn = document.getElementById('themeToggle');
      if (btn) btn.addEventListener('click', function () {
        var cur = document.documentElement.getAttribute('data-theme');
        var next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) {}
      });
    }
  });
})();
