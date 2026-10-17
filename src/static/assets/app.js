(function () {
  'use strict';

  // Texts are rendered into the HTML by src/build.py; this file only adds motion and form behaviour.
  var REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var chosen = null;

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  // ---------- Reveal on scroll (fadeIn / fadeInUp) + counters ----------
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }) : null;
  function observeReveals() {
    $$('.fade:not(.in), .fade-up:not(.in), .rise:not(.in)').forEach(function (n) { if (io && !REDUCED) io.observe(n); else n.classList.add('in'); });
  }

  function fmt(n, sep) { return sep ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep) : String(n); }
  function countUp(el) {
    var end = +el.dataset.count, sep = el.dataset.sep, dur = 1800, t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(end * e), sep);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var cio = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } });
  }, { threshold: 0.5 }) : null;
  $$('[data-count]').forEach(function (n) {
    if (cio && !REDUCED) { n.textContent = '0'; cio.observe(n); }
    else n.textContent = fmt(n.dataset.count, n.dataset.sep);
  });

  // ---------- Header hide/show, FAB ----------
  var header = $('#header'), fab = $('#fab'), nav = $('#nav');
  var lastY = window.scrollY;

  function onScroll() {
    var y = window.scrollY;
    if (header) {
      header.classList.toggle('scrolled', y > 20);
      header.classList.toggle('hide', y > 400 && y > lastY && !(nav && nav.classList.contains('open')));
    }
    if (fab) fab.classList.toggle('show', y > 600);
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- Motion engine (mirrors the reference's GSAP ScrollTrigger setup) ----------
  // .split   — words rise from a mask, stagger .05s, when the heading centre passes 95% of the viewport
  // .type1   — footer slogan: letters unfold (rotateY 90° → 0) scrubbed between centre 80% → 40%
  // data-sy / data-sx="from,to" — translate in % of own size, scrubbed while the parent crosses the viewport
  // .stack-item — card scales 1 → .8 and fades out from its bottom at 60% of the viewport until it leaves
  // [data-clip] — section shrinks into a rounded card (inset 0 → 8% / 4%, radius 0 → 40px)
  var M = { splits: [], scrubs: [], cards: [], chars: [], slogan: null, clip: null, rows: [], scene: null, floats: [], mx: 0, my: 0, tx: 0, ty: 0, run: false };
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    M.tx = e.clientX / window.innerWidth * 2 - 1;
    M.ty = e.clientY / window.innerHeight * 2 - 1;
  }, { passive: true });

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function mix(a, b, p) { return a + (b - a) * p; }

  function splitWords(el) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var m = document.createElement('span'), w = document.createElement('span');
            m.className = 'wm'; w.className = 'wi'; w.textContent = part;
            w.style.transitionDelay = (i++ * 0.05).toFixed(2) + 's';
            m.appendChild(w); frag.appendChild(m);
          });
          c.parentNode.replaceChild(frag, c);
        } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
      });
    })(el);
    el.classList.remove('in');
  }

  function splitChars(el) {
    var chars = [];
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var wd = document.createElement('span'); wd.className = 'wd';
            Array.prototype.forEach.call(part, function (ch) {
              var s = document.createElement('span'); s.className = 'ch'; s.textContent = ch;
              wd.appendChild(s); chars.push(s);
            });
            frag.appendChild(wd);
          });
          c.parentNode.replaceChild(frag, c);
        } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
      });
    })(el);
    return chars;
  }

  function measureCards() {
    M.cards.forEach(function (c) {
      c.item.style.position = 'relative';
      var r = c.item.getBoundingClientRect();
      c.bottom = r.top + window.scrollY + r.height;
      c.item.style.position = '';
    });
  }

  function initMotion() {
    M.splits = $$('.split');
    M.splits.forEach(splitWords);
    M.scrubs = $$('[data-sy],[data-sx]').map(function (el) {
      var y = el.dataset.sy ? el.dataset.sy.split(',').map(Number) : null;
      var x = el.dataset.sx ? el.dataset.sx.split(',').map(Number) : null;
      return { el: el, ref: el.parentElement, x: x, y: y, k: +(el.dataset.k || 0.1), cur: null };
    });
    M.cards = $$('.stack-item').map(function (item) { return { item: item, card: item.firstElementChild, cur: 0 }; });
    measureCards();
    M.slogan = $('.type1');
    M.chars = M.slogan ? splitChars(M.slogan) : [];
    M.sloganP = 0;
    M.clip = $('[data-clip]');
    M.scene = $('[data-marquee]');
    M.rows = M.scene ? $$('.marquee-row', M.scene) : [];
    M.floats = $$('.fw').map(function (el) { return { el: el, d: +el.dataset.depth }; });
    if (REDUCED) {
      M.splits.forEach(function (n) { n.classList.add('in'); });
      M.chars.forEach(function (c) { c.style.opacity = 1; });
      if (M.scene) M.scene.classList.add('in');
      return;
    }
    if (!M.run) { M.run = true; requestAnimationFrame(frame); }
  }

  function frame() {
    var vh = window.innerHeight, vw = window.innerWidth, sy = window.scrollY;

    // headings: words rise once their centre passes 95% of the viewport
    M.splits.forEach(function (el) {
      if (el.classList.contains('in')) return;
      var r = el.getBoundingClientRect();
      if (r.height && r.top + r.height / 2 < vh * 0.95) el.classList.add('in');
    });

    // scrubbed translations ("top bottom" → "bottom top"), smoothed like GSAP scrub
    M.scrubs.forEach(function (s) {
      var r = s.ref.getBoundingClientRect();
      var p = clamp((vh - r.top) / (vh + r.height));
      s.cur = s.cur === null ? p : s.cur + (p - s.cur) * s.k;
      var t = '';
      if (s.x) t += 'translateX(' + mix(s.x[0], s.x[1], s.cur).toFixed(2) + '%) ';
      if (s.y) t += 'translateY(' + mix(s.y[0], s.y[1], s.cur).toFixed(2) + '%)';
      s.el.style.transform = t;
    });

    // stacked cards: scale 1 → .8, opacity 1 → 0 (start: bottom at 60% vh, end: bottom at top)
    M.cards.forEach(function (c) {
      if (vw <= 900) { c.card.style.transform = ''; c.card.style.opacity = ''; return; }
      var p = clamp((sy + vh * 0.6 - c.bottom) / (vh * 0.6));
      c.cur += (p - c.cur) * 0.1;
      c.card.style.transform = 'scale(' + (1 - 0.2 * c.cur).toFixed(4) + ')';
      c.card.style.opacity = (1 - c.cur).toFixed(3);
    });

    // giant text rows: scroll offset on top of their own endless loop
    if (M.scene) {
      var prog = vh - M.scene.getBoundingClientRect().top;
      M.rows.forEach(function (row) {
        var sp = parseFloat(row.dataset.speed);
        var base = sp < 0 ? -vw * 0.1 : -row.scrollWidth / 4 + vw * 0.1;
        row.style.transform = 'translate3d(' + (base + prog * sp).toFixed(1) + 'px,0,0)';
      });
    }

    // floating words: pop in when the scene arrives, then drift with scroll depth + cursor
    if (M.scene && M.floats.length) {
      var rf = M.scene.getBoundingClientRect();
      if (rf.top < vh * 0.75 && rf.bottom > 0) M.scene.classList.add('in');
      var pf = clamp((vh - rf.top) / (vh + rf.height)) - 0.5;
      M.mx += (M.tx - M.mx) * 0.06; M.my += (M.ty - M.my) * 0.06;
      M.floats.forEach(function (f) {
        var x = M.mx * f.d * 26, y = -pf * f.d * 160 + M.my * f.d * 18;
        f.el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
      });
    }

    // footer slogan: letters unfold, scrubbed centre 80% → 40%
    if (M.slogan && M.chars.length) {
      var rs = M.slogan.getBoundingClientRect(), cy = rs.top + rs.height / 2;
      var ps = clamp((vh * 0.8 - cy) / (vh * 0.4));
      M.sloganP += (ps - M.sloganP) * 0.06;
      var n = M.chars.length, st = 0.6 / n;
      M.chars.forEach(function (ch, i) {
        var e = clamp((M.sloganP - i * st) / 0.4);
        e = 1 - Math.pow(1 - e, 3);
        ch.style.opacity = e.toFixed(3);
        ch.style.transform = 'rotateY(' + ((1 - e) * 90).toFixed(1) + 'deg)';
      });
    }

    // contact section shrinks into a rounded card as it scrolls away
    if (M.clip) {
      var rc = M.clip.getBoundingClientRect();
      var pc = vw > 640 ? clamp(-rc.top / rc.height) : 0;
      M.clip.style.clipPath = pc > 0
        ? 'inset(0 ' + (8 * pc).toFixed(2) + '% ' + (4 * pc).toFixed(2) + '% ' + (8 * pc).toFixed(2) + '% round ' + (40 * pc).toFixed(1) + 'px)'
        : '';
    }

    requestAnimationFrame(frame);
  }
  window.addEventListener('resize', function () { measureCards(); });
  window.addEventListener('load', function () { measureCards(); });

  // ---------- Mobile menu ----------
  var burger = $('.burger');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
    });
  }

  // ---------- Header dropdowns ----------
  var subItems = $$('.nav-item.has-sub');
  function closeSubs(except) {
    subItems.forEach(function (it) {
      if (it === except) return;
      it.classList.remove('open');
      $('.sub-toggle', it).setAttribute('aria-expanded', 'false');
    });
  }
  subItems.forEach(function (it) {
    var btn = $('.sub-toggle', it);
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = it.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      closeSubs(it);
    });
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('.nav-item')) closeSubs(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSubs(); });

  // ---------- Form ----------
  var form = $('#form');
  if (form) {
    var fileInput = $('#file'), fileName = $('[data-filename]');
    var rules = {
      name: function () { return $('#name').value.trim().length > 1; },
      email: function () { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('#email').value.trim()); },
      phone: function () { return /^\+\d{9,15}$/.test($('#phone').value.replace(/[\s\-()]/g, '')); },
      agree: function () { return $('#agree').checked; },
      file: function () { return !chosen || (/\.(pdf|docx|jpe?g|png)$/i.test(chosen.name) && chosen.size <= 25 * 1024 * 1024); }
    };
    var check = function (k) { var ok = rules[k](); $('[data-f="' + k + '"]').classList.toggle('err', !ok); return ok; };
    fileInput.addEventListener('change', function () {
      chosen = fileInput.files[0] || null;
      fileName.textContent = chosen ? chosen.name : fileName.dataset.hint;
      check('file');
    });
    ['name', 'email', 'phone'].forEach(function (k) {
      $('#' + k).addEventListener('blur', function () { check(k); });
      $('#' + k).addEventListener('input', function () { if ($('[data-f="' + k + '"]').classList.contains('err')) check(k); });
    });
    $('#agree').addEventListener('change', function () { check('agree'); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = Object.keys(rules).map(check).every(Boolean);
      if (!ok) { var f = $('.f.err input, .f.err textarea'); if (f) f.focus(); return; }
      // TODO: send to e-mail / CRM endpoint
      $('#formCard').classList.add('done');
    });
    $('[data-reset]').addEventListener('click', function () {
      form.reset(); chosen = null; fileName.textContent = fileName.dataset.hint;
      $('#formCard').classList.remove('done');
    });
  }

  // ---------- Init ----------
  observeReveals();
  initMotion();
  onScroll();
  window.__mdReady = true;
})();
