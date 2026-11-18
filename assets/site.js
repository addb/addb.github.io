/* Concept D v2: core runtime (boot, HUD, hero, Layers hologram, systems explorer, sketch engine).
   Shared helpers live on window.AB so the other asset scripts can reuse them. */
(function () {
  'use strict';
  var root = document.documentElement;
  // Base URL of the assets folder, so the same scripts work from / and from /work/<id>/.
  var ASSET_BASE = (function () { var c = document.currentScript; try { return new URL('.', c && c.src ? c.src : location.href).href; } catch (e) { return 'assets/'; } })();
  var NS = 'http://www.w3.org/2000/svg';
  var reduce = root.classList.contains('rm');

  var AB = window.AB = {
    reduce: reduce,
    NS: NS,
    hidden: document.hidden,
    // Seeded random so illustrations are stable between visits.
    rng: function (seed) { seed = seed || 1; return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; },
    svg: function (tag, attrs, parent) {
      var e = document.createElementNS(NS, tag);
      if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
      if (parent) parent.appendChild(e);
      return e;
    },
    el: function (tag, cls, html, parent) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (html != null) e.innerHTML = html;
      if (parent) parent.appendChild(e);
      return e;
    },
    clamp01: function (v) { return Math.max(0, Math.min(1, v)); },
    smooth: function (a, b, v) { var t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); },
    emit: function (name, detail) { document.dispatchEvent(new CustomEvent('ab:' + name, { detail: detail })); },
    /* A time-based loop that only runs while its element is on screen, the tab is visible and motion is allowed.
       frame(t) receives seconds since start. With reduced motion the static frame is drawn once. */
    runner: function (el, frame, opts) {
      opts = opts || {};
      var t = 0, last = null, raf = null, visible = false, enabled = opts.enabled !== false, started = false;
      function loop(ts) {
        if (!el.isConnected) { raf = null; return; }
        if (last === null) last = ts;
        t += Math.min(0.05, (ts - last) / 1000); last = ts;
        frame(t);
        raf = requestAnimationFrame(loop);
      }
      function update() {
        if (!el.isConnected && !raf) return;
        // While a project modal is open, only animations inside it run.
        var run = enabled && visible && !AB.hidden && !reduce && el.isConnected && (!AB.modalOpen || !!el.closest('.modal'));
        if (run && !raf) { last = null; raf = requestAnimationFrame(loop); if (!started) { started = true; if (opts.onStart) opts.onStart(); } if (opts.onState) opts.onState(true); }
        else if (!run && raf) { cancelAnimationFrame(raf); raf = null; if (opts.onState) opts.onState(false); }
      }
      var api = {
        setEnabled: function (v) { enabled = v; update(); },
        get enabled() { return enabled; },
        restart: function () { t = 0; if (reduce) frame(opts.staticT || 0); else frame(0); },
        get t() { return t; },
        set t(v) { t = v; },
        update: update
      };
      if (reduce) { frame(opts.staticT || 0); if (opts.onStart) opts.onStart(); }
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (ents) { visible = ents[0].isIntersecting; update(); }, { threshold: 0.15 }).observe(el);
      } else { visible = true; update(); }
      AB._runners.push(update);
      return api;
    },
    _runners: [],
    asset: function (p) { return ASSET_BASE + p; },
    /* Layers demo artwork. To use Arjun's real Layers demo, export the image's layers and point these paths at them
       (for example 'layers/background.webp'). Paths are relative to the assets folder. */
    LAYERS_ART: [
      { name: 'Background', src: 'layers/background.svg' },
      { name: 'Light', src: 'layers/light.svg' },
      { name: 'Subject', src: 'layers/subject.svg', shift: true },
      { name: 'Type', text: 'Layers' }
    ]
  };

  document.addEventListener('visibilitychange', function () {
    AB.hidden = document.hidden;
    root.classList.toggle('paused', AB.hidden);
    AB._runners.forEach(function (u) { u(); });
    if (AB.hidden) { stopClock(); stopCycle(); } else { startClock(); startCycle(); }
  });

  // ---------- Boot ----------
  var ready = function () { root.classList.add('ready'); };
  if (root.classList.contains('boot')) {
    var done = false;
    var finish = function () {
      if (done) return; done = true;
      try { sessionStorage.setItem('ab-boot', '1'); } catch (e) {}
      root.classList.add('boot-done');
      setTimeout(ready, 250);
      setTimeout(function () { root.classList.remove('boot', 'boot-done'); }, 900);
      removeEventListener('keydown', finish);
    };
    var bs = document.getElementById('bootSkip'), bt = document.getElementById('boot');
    if (bs) bs.addEventListener('click', finish);
    if (bt) bt.addEventListener('pointerdown', finish);
    addEventListener('keydown', finish);
    setTimeout(finish, 2300);
  } else if (reduce) { ready(); } else { requestAnimationFrame(function () { requestAnimationFrame(ready); }); }

  // ---------- Clock ----------
  var clockEl = document.getElementById('clock'), clockT = null;
  function tick() { if (!clockEl) return; var d = new Date(); clockEl.textContent = [d.getHours(), d.getMinutes(), d.getSeconds()].map(function (n) { return String(n).padStart(2, '0'); }).join(':'); }
  function startClock() { if (!clockT) { tick(); clockT = setInterval(tick, 1000); } }
  function stopClock() { clearInterval(clockT); clockT = null; }
  startClock();

  // ---------- Hero instrument ----------
  var ticks = document.getElementById('ticks');
  for (var a = 0; ticks && a < 360; a += 5) {
    var major = a % 45 === 0, r2 = major ? 190 : 198, rad = (a - 90) * Math.PI / 180;
    AB.svg('line', { x1: 220 + Math.cos(rad) * 205, y1: 220 + Math.sin(rad) * 205, x2: 220 + Math.cos(rad) * r2, y2: 220 + Math.sin(rad) * r2,
      'class': a % 90 === 45 ? 'bearing' : major ? 'tick tick-major' : 'tick' }, ticks);
  }
  var focuses = ['Applied AI', 'LLM systems', 'Agentic workflows', 'Cross-platform SDKs'];
  var fi = 0, turns = 0, cycleT = null, marker = document.getElementById('marker'), big = document.getElementById('ctrBig'), idx = document.getElementById('ctrIdx');
  if (marker) marker.style.setProperty('--rot', '45deg');
  function showFocus(i) {
    marker.style.setProperty('--rot', (45 + turns * 90) + 'deg');
    big.classList.add('fade');
    setTimeout(function () { big.textContent = focuses[i]; idx.textContent = 'Focus ' + (i + 1) + ' of 4'; big.classList.remove('fade'); }, 350);
  }
  function startCycle() { if (reduce || cycleT || !marker) return; cycleT = setInterval(function () { fi = (fi + 1) % 4; turns++; showFocus(fi); }, 3400); }
  function stopCycle() { clearInterval(cycleT); cycleT = null; }
  startCycle();

  // ---------- Cursor parallax (pointer devices only) ----------
  var depthEls = Array.prototype.slice.call(document.querySelectorAll('[data-depth]'));
  var mx = 0, my = 0, cx = 0, cy = 0, praf = null;
  function ploop() {
    cx += (mx - cx) * 0.08; cy += (my - cy) * 0.08;
    depthEls.forEach(function (el) { var d = +el.dataset.depth; el.style.transform = 'translate3d(' + (cx * d).toFixed(2) + 'px,' + (cy * d).toFixed(2) + 'px,0)'; });
    praf = (!AB.hidden && (Math.abs(mx - cx) > 0.001 || Math.abs(my - cy) > 0.001)) ? requestAnimationFrame(ploop) : null;
  }
  if (!reduce && matchMedia('(pointer: fine)').matches) {
    addEventListener('pointermove', function (e) { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; if (!praf && !AB.hidden) praf = requestAnimationFrame(ploop); }, { passive: true });
  }

  // ---------- Reveals ----------
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (ents) { ents.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });
    document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });
  }

  // ---------- Hologram component (Layers) ----------
  // The artwork comes from AB.LAYERS_ART, so a real demo image can be dropped in later.
  AB.holoMarkup = function () {
    return '<div class="holo-cone"></div><div class="holo-base"></div><div class="holo-stack">' +
      AB.LAYERS_ART.map(function (l, i) {
        var inner = l.src ? '<img src="' + AB.asset(l.src) + '" alt="" decoding="async"' + (l.shift ? ' class="shift"' : '') + '>' : '<div class="h-type">' + l.text + '</div>';
        return '<div class="hl hl' + i + '" style="--i:' + i + '">' + inner + '<span class="htag">' + l.name + '</span></div>';
      }).join('') + '</div>' +
      '<div class="holo-export"><svg viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="17" r="15" fill="none" stroke="#ffb27a" stroke-width="1.5"/><path d="M13 11 L24 17 L13 23 Z" fill="#ffb27a"/></svg><span>video.mp4</span></div>';
  };
  AB.holo = function (holoEl) {
    holoEl.innerHTML = AB.holoMarkup();
    var stack = holoEl.querySelector('.holo-stack');
    var cur = { sep: 0.7, shift: 0, exp: 0, tilt: 0 }, tgt = { sep: 0.7, shift: 0, exp: 0, tilt: 0 }, raf = null;
    function apply() {
      stack.style.setProperty('--sep', cur.sep.toFixed(3));
      stack.style.setProperty('--shift', cur.shift.toFixed(2) + '%');
      stack.style.setProperty('--tilt', cur.tilt.toFixed(2) + 'deg');
      holoEl.style.setProperty('--exp', cur.exp.toFixed(3));
    }
    function loop() {
      var moving = false;
      for (var k in tgt) { var d = tgt[k] - cur[k]; if (Math.abs(d) > 0.0008) { cur[k] += d * 0.14; moving = true; } else cur[k] = tgt[k]; }
      apply();
      raf = moving && !AB.hidden ? requestAnimationFrame(loop) : null;
    }
    var api = {
      tgt: tgt,
      set: function (o, instant) { for (var k in o) tgt[k] = o[k]; if (reduce || instant) { for (var j in tgt) cur[j] = tgt[j]; apply(); } else if (!raf) raf = requestAnimationFrame(loop); }
    };
    // Drag across to pull layers apart; the vertical cursor position tilts it.
    var dragging = false, sx = 0, s0 = 0;
    holoEl.addEventListener('pointerdown', function (e) { if (e.pointerType === 'touch') return; dragging = true; sx = e.clientX; s0 = tgt.sep; holoEl.setPointerCapture(e.pointerId); if (api.onUser) api.onUser(); });
    holoEl.addEventListener('pointermove', function (e) {
      var r = holoEl.getBoundingClientRect(), o = {};
      if (!reduce) o.tilt = ((e.clientY - r.top) / r.height - 0.5) * -10;
      if (dragging) { o.sep = AB.clamp01(s0 + (e.clientX - sx) / (r.width * 0.6)); if (api.onSep) api.onSep(o.sep); }
      api.set(o);
    });
    var end = function () { dragging = false; api.set({ tilt: 0 }); };
    holoEl.addEventListener('pointerup', end); holoEl.addEventListener('pointerleave', end); holoEl.addEventListener('pointercancel', end);
    holoEl.addEventListener('click', function () { if (matchMedia('(hover: hover)').matches) return; var v = tgt.sep > 0.35 ? 0 : 0.8; api.set({ sep: v }); if (api.onSep) api.onSep(v); if (api.onUser) api.onUser(); });
    apply();
    return api;
  };

  // Static holograms: <div class="holo" data-holo data-sep=".8" data-exp="0">
  AB.initHolos = function (scope) {
    (scope || document).querySelectorAll('[data-holo]').forEach(function (el) {
      if (el._holo) return;
      var h = el._holo = AB.holo(el); h.set({ sep: +(el.dataset.sep || 0), exp: +(el.dataset.exp || 0), shift: +(el.dataset.shift || 0) }, true);
    });
  };
  AB.initHolos();
  AB.setModalOpen = function (on) { AB.modalOpen = on; AB._runners.forEach(function (u) { u(); }); };

  // ---------- Scroll: progress fallback, nav state, feature ----------
  var prog = document.getElementById('progress'), sraf = null;
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.hud nav a'));
  var supportsTimeline = window.CSS && CSS.supports && CSS.supports('animation-timeline: scroll()');
  function onScroll() {
    sraf = null;
    var max = document.documentElement.scrollHeight - innerHeight;
    if (!supportsTimeline && prog) prog.style.setProperty('--p', max > 0 ? (scrollY / max).toFixed(4) : 0);
    var curLink = null;
    navLinks.forEach(function (a) { var h = a.getAttribute('href'), t = h.charAt(0) === '#' ? document.querySelector(h) : null; if (t && t.getBoundingClientRect().top < innerHeight * 0.4) curLink = a; });
    navLinks.forEach(function (a) { a.setAttribute('aria-current', String(a === curLink)); });
  }
  addEventListener('scroll', function () { if (!sraf) sraf = requestAnimationFrame(onScroll); }, { passive: true });
  onScroll();

  // ---------- Systems explorer: master/detail on wide screens, accordion on narrow ----------
  var wide = matchMedia('(min-width: 1181px)');
  var sysBtns = Array.prototype.slice.call(document.querySelectorAll('.sys-btn'));
  var sysBodies = sysBtns.map(function (b) { return document.getElementById(b.getAttribute('aria-controls')); });
  var active = 0;
  sysBtns.forEach(function (b, i) { b.parentNode.style.gridRow = String(i + 1); });
  function openBody(i, on) {
    sysBtns[i].setAttribute('aria-expanded', String(on));
    sysBodies[i].hidden = !on;
    if (on) { sysBodies[i].classList.remove('enter'); void sysBodies[i].offsetWidth; sysBodies[i].classList.add('enter'); }
  }
  function sysMode() { sysBtns.forEach(function (b, i) { openBody(i, i === active); }); }
  sysBtns.forEach(function (b, i) {
    b.addEventListener('click', function () {
      if (wide.matches) { if (i !== active) { active = i; sysMode(); } }
      else { var on = b.getAttribute('aria-expanded') !== 'true'; openBody(i, on); if (on) active = i; }
    });
    b.addEventListener('keydown', function (e) {
      var j = null;
      if (e.key === 'ArrowDown') j = (i + 1) % sysBtns.length; else if (e.key === 'ArrowUp') j = (i - 1 + sysBtns.length) % sysBtns.length;
      else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = sysBtns.length - 1;
      if (j !== null) { e.preventDefault(); sysBtns[j].focus(); if (wide.matches) { active = j; sysMode(); } }
    });
  });
  wide.addEventListener('change', sysMode);
  sysMode();
  // Used by deep links: open the explorer entry that contains a body element.
  AB.openSystem = function (body) {
    var i = sysBodies.indexOf(body); if (i < 0) return;
    if (wide.matches) { active = i; sysMode(); } else { openBody(i, true); active = i; }
  };

  // ---------- Sketch engine: hand-drawn blueprints of each system ----------
  var skCount = 0;
  AB.sketch = function (container, def) {
    var R = AB.rng(7 + skCount * 13), fid = 'pencil' + (skCount++), k = 0;
    var svg = AB.svg('svg', { viewBox: '0 0 768 312', role: 'img',
      'aria-label': 'Hand-drawn blueprint: ' + def.boxes.filter(function (b) { return b.t; }).map(function (b) { return b.t.replace(/\n/g, ' '); }).join(', ') + '.' });
    svg.innerHTML = '<defs><filter id="' + fid + '" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="' + (3 + skCount) + '" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter></defs>';
    var gS = AB.svg('g', { filter: 'url(#' + fid + ')' }, svg), gT = AB.svg('g', null, svg);
    var B = {}; def.boxes.forEach(function (b) { B[b.id] = b; });
    function j(v) { return v + (R() - 0.5) * 2.2; }
    function path(d, cls) { var p = AB.svg('path', { d: d, pathLength: 1, 'class': 'sk-stroke' + (cls ? ' ' + cls : '') }, gS); p.style.setProperty('--k', k++); return p; }
    function line(x1, y1, x2, y2) { var mx = (x1 + x2) / 2 + (R() - 0.5) * 3, my = (y1 + y2) / 2 + (R() - 0.5) * 3; return path('M' + j(x1) + ' ' + j(y1) + ' Q' + mx + ' ' + my + ' ' + j(x2) + ' ' + j(y2)); }
    function rect(b) {
      var o = 4, x = b.x, y = b.y, w = b.w, h = b.h;
      path('M' + j(x - o) + ' ' + j(y) + ' L' + j(x + w + o) + ' ' + j(y) + ' M' + j(x + w) + ' ' + j(y - o) + ' L' + j(x + w) + ' ' + j(y + h + o) + ' M' + j(x + w + o) + ' ' + j(y + h) + ' L' + j(x - o) + ' ' + j(y + h) + ' M' + j(x) + ' ' + j(y + h + o) + ' L' + j(x) + ' ' + j(y - o));
      path('M' + j(x) + ' ' + j(y + 1) + ' L' + j(x + w) + ' ' + j(y) + ' L' + j(x + w - 1) + ' ' + j(y + h) + ' L' + j(x + 1) + ' ' + j(y + h) + ' Z', 'faint');
    }
    function head(x, y, ang) { var L = 10; path('M' + (x + Math.cos(ang + 2.65) * L) + ' ' + (y + Math.sin(ang + 2.65) * L) + ' L' + x + ' ' + y + ' L' + (x + Math.cos(ang - 2.65) * L) + ' ' + (y + Math.sin(ang - 2.65) * L)); }
    function arrow(x1, y1, x2, y2) { var cxp = (x1 + x2) / 2, cyp = (y1 + y2) / 2; path('M' + j(x1) + ' ' + j(y1) + ' Q' + cxp + ' ' + cyp + ' ' + x2 + ' ' + y2); head(x2, y2, Math.atan2(y2 - cyp, x2 - cxp)); }
    function text(x, y, t, cls, anchor) {
      var tx = AB.svg('text', { x: x, y: y, 'class': cls || 'sk-text', 'text-anchor': anchor || 'middle', 'dominant-baseline': 'central' }, gT);
      tx.style.setProperty('--k', k);
      var lines = t.split('\n'), lh = cls === 'sk-note' ? 19 : 22;
      lines.forEach(function (l, i) { var ts = AB.svg('tspan', { x: x, dy: (i === 0 ? (-(lines.length - 1) * lh / 2) : lh) + 'px' }, tx); ts.textContent = l; });
    }
    def.boxes.forEach(function (b) {
      if (b.stack) { for (var s = 0; s < 3; s++) { var ox = b.x + s * 14, oy = b.y + 50 - s * 22; path('M' + j(ox) + ' ' + j(oy + 18) + ' L' + j(ox + 40) + ' ' + j(oy) + ' L' + j(ox + 78) + ' ' + j(oy + 18) + ' L' + j(ox + 38) + ' ' + j(oy + 36) + ' Z'); } return; }
      rect(b);
      if (b.fill) { var f = AB.svg('rect', { x: b.x + 3, y: b.y + 3, width: b.w - 6, height: b.h - 6, 'class': 'sk-fill' }); gT.insertBefore(f, gT.firstChild); }
      if (b.pic) { line(b.x + 12, b.y + b.h - 14, b.x + 40, b.y + 30); line(b.x + 40, b.y + 30, b.x + 58, b.y + 48); line(b.x + 58, b.y + 48, b.x + 72, b.y + 38); line(b.x + 72, b.y + 38, b.x + b.w - 12, b.y + b.h - 14); text(b.x + b.w / 2, b.y + b.h + 20, b.t); return; }
      if (b.loop) { var lx = b.x + b.w - 22, ly = b.y - 2; path('M' + (lx - 14) + ' ' + ly + ' a14 12 0 1 1 22 10'); head(lx + 8, ly + 10, 2.2); }
      if (b.t) text(b.x + b.w / 2, b.y + b.h / 2, b.t);
    });
    (def.labels || []).forEach(function (l) { text(l.x, l.y, l.t); });
    (def.arrows || []).forEach(function (a) {
      var s = B[a[0]], e = B[a[1]], mode = a[2];
      if (mode === 'v2') { arrow(s.x + s.w / 2, s.y + s.h + 6, e.x + e.w / 2, e.y - 8); arrow(e.x + e.w / 2 - 14, e.y - 8, s.x + s.w / 2 - 14, s.y + s.h + 6); return; }
      if (mode === 'down') { arrow(s.x + s.w / 2 + (e.x + e.w / 2 - (s.x + s.w / 2)) * 0.25, s.y + s.h + 6, e.x + e.w / 2, e.y - 8); return; }
      var sx = s.x + s.w + 6, sy = s.y + s.h / 2, ex = e.x - 8, ey = e.y + e.h / 2;
      if (s.stack) sx = s.x + s.w + 4; if (e.stack) ex = e.x - 6;
      arrow(sx, sy, ex, ey);
    });
    if (def.bus) { var bu = def.bus; line(bu.x1, bu.y, bu.x2, bu.y); bu.from.forEach(function (x) { line(x, 178, x, bu.y); }); bu.to.forEach(function (x) { arrow(x, bu.y, x, 240); }); }
    (def.notes || []).forEach(function (n) { text(n.x, n.y, n.t, 'sk-note', 'start'); });
    container.appendChild(svg);
    return svg;
  };
})();

/* v5.1: visitor console easter egg (clock button, footer link, "v" key or #visit) */
(function () {
  var d = document.getElementById('visit'), t = document.getElementById('visitToggle'); if (!d) return;
  var last = null;
  function open() {
    if (!d.hidden) return; last = document.activeElement; d.hidden = false; if (t) t.setAttribute('aria-expanded', 'true');
    var c = d.querySelector('[data-vclose]'); if (c) setTimeout(function () { c.focus(); }, 60);
    try { document.dispatchEvent(new CustomEvent('ab:visitopen')); } catch (e) {}
    loadCount();
  }
  function close() {
    if (d.hidden) return; d.hidden = true; if (t) t.setAttribute('aria-expanded', 'false');
    if (location.hash === '#visit') history.replaceState(null, '', location.pathname + location.search);
    if (last && last.focus) last.focus();
  }
  if (t) t.addEventListener('click', function () { d.hidden ? open() : close(); });
  document.querySelectorAll('[data-vopen]').forEach(function (b) { b.addEventListener('click', open); });
  d.querySelector('[data-vclose]').addEventListener('click', close);
  addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !d.hidden) { close(); return; }
    var tag = (e.target && e.target.tagName) || '';
    if ((e.key === 'v' || e.key === 'V') && !e.metaKey && !e.ctrlKey && !e.altKey && !/INPUT|TEXTAREA|SELECT/.test(tag) && !document.querySelector('.modal:not([hidden])')) { d.hidden ? open() : close(); }
  });
  // Public all-time view count from GoatCounter (needs "Allow adding visitor counts" in its settings).
  var counted = false;
  function loadCount() {
    if (counted || !window.fetch) return; counted = true;
    var el = d.querySelector('.vd-count'); if (!el) return;
    fetch('https://arjunbhadra.goatcounter.com/counter//.json').then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { if (j && j.count) { el.textContent = ' · one of ' + j.count + ' visits'; el.hidden = false; } }).catch(function () {});
  }
  function fromHash() { if (location.hash === '#visit') open(); }
  addEventListener('hashchange', fromHash); fromHash();
})();
