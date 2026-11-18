/* Concept D v2: "Your visit" instrument panel. Everything is computed in the visitor's browser.
   Nothing here is stored, sent or logged. The only network requests are the opt-in "Show my IP" button
   and reading the public GoatCounter total for the drawer header (see site.js). */
(function () {
  'use strict';
  var AB = window.AB, root = document.querySelector('[data-visit]');
  if (!root) return;
  var reduce = AB.reduce, nav = navigator, S = AB.svg;
  var NA = 'Not shared';
  function $(sel) { return root.querySelector(sel); }
  function $$(sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }
  function set(key, val) { $$('[data-k="' + key + '"]').forEach(function (el) { if (el.textContent !== String(val)) el.textContent = val; }); }
  function ring(el, f) { if (el) el.style.strokeDashoffset = (1 - Math.max(0, Math.min(1, f))).toFixed(4); }
  function polar(cx, cy, r, deg) { var a = (deg - 90) * Math.PI / 180; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; }

  // ---------- Gears (original line drawings with simple trapezoid teeth) ----------
  function gearPath(t, r, m) {
    var ro = r + m, rr = r - 1.25 * m, p = 360 / t, d = '';
    for (var i = 0; i < t; i++) {
      var a = i * p, pts = [[rr, a - p * 0.27], [ro, a - p * 0.15], [ro, a + p * 0.15], [rr, a + p * 0.27], [rr, a + p * 0.73]];
      pts.forEach(function (q, j) { var xy = polar(0, 0, q[0], q[1]); d += (i === 0 && j === 0 ? 'M' : 'L') + xy[0].toFixed(2) + ' ' + xy[1].toFixed(2); });
    }
    return d + 'Z';
  }
  var gears = [];
  function makeGear(parent, t, cx, cy, m, opts) {
    opts = opts || {};
    var r = m * t / 2, g = S('g', { transform: 'translate(' + cx.toFixed(2) + ' ' + cy.toFixed(2) + ')' }, parent), rot = S('g', { 'class': 'gear' }, g);
    S('path', { d: gearPath(t, r, m), 'class': 'gear-body' }, rot);
    S('circle', { r: Math.max(2, r * 0.32), 'class': 'gear-hole' }, rot);
    for (var k = 0; k < 4; k++) { var a = polar(0, 0, r * 0.38, k * 90), b = polar(0, 0, r - 1.6 * m, k * 90); S('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], 'class': 'gear-spoke' }, rot); }
    var gear = { el: rot, t: t, r: r, cx: cx, cy: cy, ratio: opts.ratio || 1, phase: opts.phase || 0 };
    gears.push(gear);
    return gear;
  }
  // Mesh gear B to gear A in a direction (degrees, 0 = right, clockwise).
  function meshGear(parent, a, t, dir, m) {
    var rB = m * t / 2, dist = a.r + rB, rad = dir * Math.PI / 180;
    var b = makeGear(parent, t, a.cx + Math.cos(rad) * dist, a.cy + Math.sin(rad) * dist, m);
    var k = a.t / t;
    b.ratio = -a.ratio * k;
    b.phase = -k * a.phase + (dir + 90) * (1 + k) + 180 / t;
    return b;
  }
  var head = $('.gears-head'); head.innerHTML = '';
  var g1 = makeGear(head, 14, 22, 22, 2.4), g2 = meshGear(head, g1, 9, -15, 2.4); meshGear(head, g2, 14, 18, 2.4);
  $$('.w-gear').forEach(function (svg, i) {
    var t = +svg.querySelector('[data-gear]').dataset.gear; svg.innerHTML = '';
    makeGear(svg, t, 30, 30, 44 / t, { ratio: (i % 2 ? -1 : 1) * 12 / t, phase: i * 7 });
  });

  // ---------- Static scaffolding for dials ----------
  $$('.dial-ticks').forEach(function (g) {
    var n = +g.dataset.ticks, r = +g.dataset.r;
    for (var i = 0; i < n; i++) { var a = polar(50, 50, r, i * 360 / n), b = polar(50, 50, r - (i % 3 ? 3 : 6), i * 360 / n); S('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], 'class': 'tick' }, g); }
  });
  // Speed gauge: log scale from 0 to 5000 px/s across a half circle.
  var MAXV = 5000;
  function vToF(v) { return Math.min(1, Math.log10(1 + v) / Math.log10(1 + MAXV)); }
  var gt = $('.g-ticks');
  [0, 10, 50, 100, 500, 1000, 5000].forEach(function (v) { var ang = -90 + 180 * vToF(v), a = polar(100, 100, 80, ang), b = polar(100, 100, 71, ang); S('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], 'class': 'tick' }, gt); });
  var trail = $('.g-trail'), TRAIL = 8, trailEls = [];
  for (var ti = 0; ti < TRAIL; ti++) trailEls.push(S('line', { x1: 100, y1: 100, x2: 100, y2: 32, 'class': 'g-ghost', opacity: (0.3 * (1 - ti / TRAIL)).toFixed(2) }, trail));
  var needle = $('.g-needle'), peakEl = $('.g-peak'), gfill = $('.g-fill');

  // Sections: one ring segment per top-level section.
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]')).filter(function (s) { return !s.closest('.vgrid'); });
  var segG = $('.segs'), segs = [], N = sections.length, gap = 7;
  sections.forEach(function (s, i) {
    var a0 = i * 360 / N + gap / 2, a1 = (i + 1) * 360 / N - gap / 2, p0 = polar(50, 50, 38, a0), p1 = polar(50, 50, 38, a1);
    segs.push(S('path', { d: 'M' + p0[0].toFixed(2) + ' ' + p0[1].toFixed(2) + ' A38 38 0 0 1 ' + p1[0].toFixed(2) + ' ' + p1[1].toFixed(2), 'class': 'seg' }, segG));
  });

  // ---------- Behaviour (this visit) ----------
  var t0 = performance.now(), lastInput = t0, clicks = 0, focusN = 0, blurN = 0, peakSpeed = 0, maxDepth = 0;
  var vizRun = {}, graphSeen = {}, demos = {}, seen = {};
  var lastY = scrollY, lastS = t0, speed = 0;
  addEventListener('scroll', function () {
    var now = performance.now(), dt = (now - lastS) / 1000;
    if (dt > 0.03) { speed = Math.abs(scrollY - lastY) / dt; lastY = scrollY; lastS = now; peakSpeed = Math.max(peakSpeed, speed); }
    lastInput = now;
  }, { passive: true });
  ['pointerdown', 'keydown', 'pointermove', 'wheel', 'touchstart'].forEach(function (ev) { addEventListener(ev, function () { lastInput = performance.now(); }, { passive: true }); });
  addEventListener('click', function () { clicks++; }, true);
  addEventListener('focus', function () { focusN++; });
  addEventListener('blur', function () { blurN++; });
  document.addEventListener('ab:vizrun', function (e) { vizRun[e.detail.id] = 1; });
  document.addEventListener('ab:graphnode', function (e) { graphSeen[e.detail.id] = 1; });
  document.addEventListener('ab:project', function (e) { demos[e.detail.id] = 1; });
  if ('IntersectionObserver' in window) {
    var sio = new IntersectionObserver(function (ents) { ents.forEach(function (e) { if (e.isIntersecting) seen[e.target.id] = 1; }); }, { threshold: 0.15 });
    sections.forEach(function (s) { sio.observe(s); });
  }
  function count(o) { return Object.keys(o).length; }
  function mmss(ms) { var s = Math.floor(ms / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  var rfTime = $('.rf-time'), hand = $('.w-time .hand'), rfDepth = $('.rf-depth'), peakMark = $('.peak-mark'), idleBar = $('.idlebar i');
  var mViz = $('.m-viz'), mNodes = $('.m-nodes'), mDemos = $('.m-demos');
  var TOTAL_NODES = 70, TOTAL_DEMOS = 22;

  function behaviour() {
    var now = performance.now(), max = document.documentElement.scrollHeight - innerHeight;
    var depth = max > 0 ? Math.round(scrollY / max * 100) : 100; maxDepth = Math.max(maxDepth, depth);
    if (now - lastS > 250) speed *= 0.55;
    var secs = (now - t0) / 1000;
    set('time', mmss(now - t0)); ring(rfTime, (secs % 60) / 60);
    hand.setAttribute('transform', 'rotate(' + ((secs % 60) * 6).toFixed(1) + ' 50 50)');
    set('depth', depth + '%'); set('maxdepth', maxDepth + '%'); ring(rfDepth, depth / 100);
    peakMark.setAttribute('transform', 'rotate(' + (maxDepth * 3.6).toFixed(1) + ' 50 50)');
    set('speed', Math.round(speed) + ' px/s'); set('peak', Math.round(peakSpeed) + ' px/s');
    peakEl.setAttribute('transform', 'rotate(' + (-90 + 180 * vToF(peakSpeed)).toFixed(1) + ' 100 100)');
    segs.forEach(function (sg, i) { sg.classList.toggle('on', !!seen[sections[i].id]); });
    set('sections', count(seen) + ' of ' + sections.length);
    set('viz', count(vizRun) + '/6'); ring(mViz, count(vizRun) / 6);
    set('nodes', count(graphSeen)); ring(mNodes, count(graphSeen) / TOTAL_NODES);
    if (window.AB_DATA) TOTAL_DEMOS = AB_DATA.projects.length; set('demos', count(demos) + '/' + TOTAL_DEMOS); ring(mDemos, count(demos) / TOTAL_DEMOS);
    var idle = Math.floor((now - lastInput) / 1000);
    set('clicks', clicks); set('idle', idle + ' s'); set('focus', focusN + ' / ' + blurN);
    idleBar.style.transform = 'scaleX(' + Math.min(1, idle / 60).toFixed(3) + ')';
    set('localtime', new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    if (reduce) setNeedle(vToF(speed));
  }

  // ---------- Needle + gears animation (only while the panel is on screen) ----------
  var nCur = 0, history = [], theta = 0, boost = 0, lastT = 0;
  function setNeedle(f) {
    var ang = -90 + 180 * f;
    needle.setAttribute('transform', 'rotate(' + ang.toFixed(2) + ' 100 100)');
    ring(gfill, f);
    return ang;
  }
  function anim(time) {
    var dt = Math.min(0.05, Math.max(0, time - lastT)); lastT = time;
    nCur += (vToF(speed) - nCur) * Math.min(1, dt * 7);
    var ang = setNeedle(nCur);
    history.unshift(ang); if (history.length > TRAIL * 2 + 2) history.length = TRAIL * 2 + 2;
    trailEls.forEach(function (l, i) { var a = history[(i + 1) * 2]; if (a == null) a = ang; l.setAttribute('transform', 'rotate(' + a.toFixed(2) + ' 100 100)'); });
    // Gears turn slowly, speed up briefly with scroll velocity, then settle.
    boost += (Math.min(1, speed / 1500) - boost) * Math.min(1, dt * (speed > 50 ? 4 : 1.2));
    theta += dt * (8 + 90 * boost);
    gears.forEach(function (g) { g.el.setAttribute('transform', 'rotate(' + (g.phase + g.ratio * theta).toFixed(2) + ')'); });
  }

  // ---------- Environment (what any site can read) ----------
  function mq(q) { return matchMedia(q).matches; }
  function browserOS() {
    var ua = nav.userAgent || '', b = '', o = '', uad = nav.userAgentData, m;
    if (uad && uad.brands) {
      var br = uad.brands.filter(function (x) { return !/Not.?A.?Brand|Chromium/i.test(x.brand); })[0] || uad.brands[0];
      if (br) b = br.brand + ' ' + br.version;
      if (uad.platform) o = uad.platform;
    }
    if (!b) {
      if ((m = ua.match(/Edg\/(\d+)/))) b = 'Edge ' + m[1];
      else if ((m = ua.match(/OPR\/(\d+)/))) b = 'Opera ' + m[1];
      else if ((m = ua.match(/Firefox\/(\d+)/))) b = 'Firefox ' + m[1];
      else if ((m = ua.match(/Chrome\/(\d+)/))) b = 'Chrome ' + m[1];
      else if ((m = ua.match(/Version\/(\d+).*Safari/))) b = 'Safari ' + m[1];
      else b = 'Unknown browser';
    }
    if (!o) {
      if (/Windows NT/.test(ua)) o = 'Windows'; else if (/iPhone|iPad/.test(ua)) o = 'iOS'; else if (/Mac OS X/.test(ua)) o = 'macOS';
      else if (/Android/.test(ua)) o = 'Android'; else if (/CrOS/.test(ua)) o = 'ChromeOS'; else if (/Linux/.test(ua)) o = 'Linux'; else o = 'Unknown OS';
    }
    return { b: b, o: o };
  }
  function deviceGlyph() {
    var g = $('.dev-glyph'), touch = nav.maxTouchPoints > 0, w = Math.min(screen.width, screen.height), kind = touch && w < 600 ? 'phone' : touch && w < 1100 ? 'tablet' : 'computer';
    var h;
    if (kind === 'phone') h = '<rect x="34" y="4" width="28" height="56" rx="6" class="dg"/><rect x="38" y="11" width="20" height="40" rx="2" class="dg-s"/><line x1="44" y1="55" x2="52" y2="55" class="dg"/>';
    else if (kind === 'tablet') h = '<rect x="18" y="6" width="60" height="52" rx="6" class="dg"/><rect x="23" y="11" width="50" height="42" rx="2" class="dg-s"/>';
    else h = '<rect x="16" y="6" width="64" height="42" rx="4" class="dg"/><rect x="21" y="11" width="54" height="32" rx="1.5" class="dg-s"/><path d="M6 52 H90 L84 58 H12 Z" class="dg"/>';
    g.innerHTML = h;
    return kind;
  }
  var cogBuilt = false;
  function env() {
    var bo = browserOS(), kind = deviceGlyph();
    set('browser', bo.b); set('os', bo.o + ', ' + kind);
    set('input', (nav.maxTouchPoints > 0 ? 'Touch' : 'No touch') + ', ' + (mq('(pointer: fine)') ? 'precise pointer' : mq('(pointer: coarse)') ? 'coarse pointer' : 'no pointer'));
    // Screen and viewport diagram
    var sw = screen.width, sh = screen.height, vw = innerWidth, vh = innerHeight, k = Math.min(150 / sw, 90 / sh);
    var sx = (160 - sw * k) / 2, sy = (100 - sh * k) / 2, vwc = Math.min(sw, vw), vhc = Math.min(sh, vh);
    var sr = $('.scr-s'), vr = $('.scr-v');
    [['x', sx], ['y', sy], ['width', sw * k], ['height', sh * k], ['rx', 3]].forEach(function (a) { sr.setAttribute(a[0], a[1]); });
    var vx = sx + Math.max(0, Math.min(sw - vwc, window.screenX || 0)) * k, vy = sy + Math.max(0, Math.min(sh - vhc, (window.screenY || 0) + (window.outerHeight || vh) - vh)) * k;
    [['x', vx], ['y', vy], ['width', vwc * k], ['height', vhc * k], ['rx', 2]].forEach(function (a) { vr.setAttribute(a[0], a[1]); });
    set('screen', sw + ' × ' + sh); set('viewport', vw + ' × ' + vh);
    set('dpr', (window.devicePixelRatio || 1).toFixed(2).replace(/\.?0+$/, '') + 'x');
    // CPU cog: one tooth per core
    var cores = nav.hardwareConcurrency || 0;
    if (!cogBuilt) {
      var cog = $('.cog'); cogBuilt = true;
      if (cores) {
        // A cog with exactly one tooth per core: fixed body radius, tooth width shrinks as cores grow.
        var t = Math.min(64, cores), p = 360 / t, hw = Math.min(p * 0.26, 13), d = '';
        var P2 = function (r, ang) { var xy = polar(0, 0, r, ang); return xy[0].toFixed(2) + ' ' + xy[1].toFixed(2); };
        for (var i = 0; i < t; i++) {
          var a = i * p, gapDeg = p - hw * 2.5;
          d += (i === 0 ? 'M' : 'L') + P2(27, a - hw * 1.25) + 'L' + P2(36, a - hw * 0.8) + 'L' + P2(36, a + hw * 0.8) + 'L' + P2(27, a + hw * 1.25);
          d += 'A27 27 0 ' + (gapDeg > 180 ? 1 : 0) + ' 1 ' + P2(27, a + p - hw * 1.25);
        }
        var cg = S('g', { transform: 'translate(50 50)' }, cog), rot = S('g', { 'class': 'gear' }, cg);
        S('path', { d: d + 'Z', 'class': 'gear-body cog-body' }, rot); S('circle', { r: 9, 'class': 'gear-hole' }, rot);
        gears.push({ el: rot, t: t, r: 30, ratio: 0.6, phase: 0 });
      }
      else S('circle', { cx: 50, cy: 50, r: 28, 'class': 'gear-body' }, cog);
    }
    set('cores', cores ? cores + (cores === 1 ? ' core' : ' cores') : NA);
    var mem = nav.deviceMemory;
    set('mem', mem ? 'About ' + mem + ' GB' : NA);
    $('.mem b').style.transform = 'scaleX(' + (mem ? Math.min(1, mem / 8) : 0) + ')';
    // Network
    var c = nav.connection || nav.mozConnection || nav.webkitConnection, lvl = 0;
    if (c && c.effectiveType) lvl = { 'slow-2g': 1, '2g': 2, '3g': 3, '4g': 4 }[c.effectiveType] || 0;
    $$('.bars rect').forEach(function (r, i) { r.classList.toggle('on', i < lvl); });
    set('net', c && (c.effectiveType || c.downlink) ? (c.effectiveType ? c.effectiveType.toUpperCase() : '') + (c.downlink ? ', ~' + c.downlink + ' Mbps' : '') : NA);
    set('online', nav.onLine ? 'Online' : 'Offline');
    // Time zone: a line of dots from UTC-12 to UTC+14
    var tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) {}
    var off = -new Date().getTimezoneOffset() / 60, sign = off >= 0 ? '+' : '−';
    set('tz', (tz || NA) + ', UTC' + sign + Math.abs(off));
    var dots = $('.tz-dots'); dots.innerHTML = '';
    for (var h = -12; h <= 14; h++) S('circle', { cx: 6 + (h + 12) * (268 / 26), cy: 15, r: h === 0 ? 2.6 : 1.8, 'class': 'tz-dot' + (h === 0 ? ' z' : '') }, dots);
    $('.tz-mark').setAttribute('transform', 'translate(' + (6 + (off + 12) * (268 / 26)).toFixed(1) + ' 0)');
    // Preferences
    set('scheme', mq('(prefers-color-scheme: dark)') ? 'Dark' : mq('(prefers-color-scheme: light)') ? 'Light' : 'No preference');
    set('motion', mq('(prefers-reduced-motion: reduce)') ? 'Reduced' : 'Full');
    set('lang', (nav.languages && nav.languages.length ? nav.languages.slice(0, 2).join(', ') : nav.language) || NA);
    set('contrast', mq('(prefers-contrast: more)') ? 'More' : mq('(prefers-contrast: less)') ? 'Less' : 'Default');
    // Privacy signals
    var dnt = nav.doNotTrack === '1' || window.doNotTrack === '1' ? 'On' : nav.doNotTrack === '0' ? 'Off' : 'Not sent';
    var gpc = nav.globalPrivacyControl === true ? 'On' : nav.globalPrivacyControl === false ? 'Off' : 'Not sent';
    var ref; try { ref = document.referrer ? new URL(document.referrer).hostname : 'Direct visit'; } catch (e) { ref = 'Direct visit'; }
    set('dnt', dnt); set('gpc', gpc); set('cookies', nav.cookieEnabled ? 'Enabled; this site sets none' : 'Disabled'); set('ref', ref);
    $('[data-l="dnt"]').className = dnt === 'On' ? 'ok' : 'off';
    $('[data-l="gpc"]').className = gpc === 'On' ? 'ok' : 'off';
    $('[data-l="cookies"]').className = 'ok';
    $('[data-l="ref"]').className = 'info';
    $$('[data-k]').forEach(function (el) { el.classList.toggle('na', el.textContent === NA); });
  }
  env();
  gears.forEach(function (g) { g.el.setAttribute('transform', 'rotate(' + g.phase.toFixed(2) + ')'); });
  addEventListener('resize', function () { clearTimeout(env._t); env._t = setTimeout(env, 200); });
  addEventListener('online', env); addEventListener('offline', env);

  // ---------- Opt-in IP lookup ----------
  var ipBtn = $('.vt-ipbtn'), ipOut = $('.vt-ipout');
  ipBtn.addEventListener('click', function () {
    ipBtn.disabled = true; ipOut.textContent = 'Asking a public echo service…';
    var ctl = 'AbortController' in window ? new AbortController() : null, tm = setTimeout(function () { if (ctl) ctl.abort(); }, 6000);
    fetch('https://api.ipify.org?format=json', { cache: 'no-store', referrerPolicy: 'no-referrer', signal: ctl ? ctl.signal : undefined })
      .then(function (r) { if (!r.ok) throw new Error('bad'); return r.json(); })
      .then(function (j) { clearTimeout(tm); ipOut.innerHTML = ''; AB.el('b', 'vt-ip', null, ipOut).textContent = j.ip; AB.el('span', null, ' is what servers see. This page keeps nothing.', ipOut); ipBtn.disabled = false; ipBtn.textContent = 'Check again'; })
      .catch(function () { clearTimeout(tm); ipOut.textContent = 'Couldn’t fetch it. Your network or this viewer blocks the request.'; ipBtn.disabled = false; });
  });

  // ---------- Loops ----------
  var timer = null, onScreen = false;
  function start() { if (!timer && !document.hidden) { behaviour(); timer = setInterval(behaviour, reduce ? 3000 : 250); } }
  function stop() { clearInterval(timer); timer = null; }
  new IntersectionObserver(function (e) { onScreen = e[0].isIntersecting; if (onScreen) start(); else stop(); }).observe(root);
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else if (onScreen) start(); });
  AB.runner(root, anim, { staticT: 0 });
  // Screen-reader summary, throttled to once every 20 seconds at most.
  var live = $('.vt-live'), lastLive = 0;
  setInterval(function () {
    if (!onScreen || document.hidden) return;
    var now = performance.now(); if (now - lastLive < 20000) return; lastLive = now;
    live.textContent = 'Your visit so far: ' + mmss(now - t0) + ' on page, ' + maxDepth + '% scrolled, ' + count(seen) + ' of ' + sections.length + ' sections viewed.';
  }, 5000);
  behaviour(); setNeedle(0);
})();
