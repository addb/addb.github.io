/* Concept D v2: looping demos for the archive. Each demo is a small state machine:
   a list of steps sets data-v (the visible view) and data-c (state flags); CSS does the rest.
   Demos run only while visible, pause off-screen or in a hidden tab, and show one static frame with reduced motion. */
(function () {
  'use strict';
  var AB = window.AB;

  function phone(inner, cls) {
    return '<div class="phone ' + (cls || '') + '"><div class="ph-scr"><div class="ph-status"><span>11:10</span><span class="ph-ic"><i></i><i></i><i></i></span></div>' +
      '<div class="ph-app">' + inner + '</div><div class="ph-nav"><i class="nb"></i><i class="nh"></i><i class="nr"></i></div></div></div>';
  }
  function browser(inner, title, cls) {
    return '<div class="bwin ' + (cls || '') + '"><div class="bw-top"><i></i><i></i><i></i><span>' + title + '</span></div><div class="bw-body">' + inner + '</div></div>';
  }
  // Generic app icons (no third-party brands).
  var ICON = {
    photos: '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" fill="#f59e0b"/><circle cx="16" cy="8" r="2.4" fill="#fff"/><path d="M4 18l5-6 4 4 3-3 4 5z" fill="#fff"/></svg>',
    chat: '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" fill="#22c55e"/><path d="M6 8h12v7H11l-3 3v-3H6z" fill="#fff"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" fill="#3b82f6"/><rect x="5.5" y="7.5" width="13" height="9" rx="1" fill="#fff"/><path d="M5.5 8l6.5 5 6.5-5" fill="none" stroke="#3b82f6" stroke-width="1.4"/></svg>',
    music: '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" fill="#a855f7"/><path d="M10 16.5V7l7-1.5v9" fill="none" stroke="#fff" stroke-width="1.6"/><circle cx="8.5" cy="16.5" r="2" fill="#fff"/><circle cx="15.5" cy="15" r="2" fill="#fff"/></svg>',
    notes: '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" fill="#eab308"/><path d="M7 8h10M7 12h10M7 16h6" stroke="#fff" stroke-width="1.6"/></svg>',
    settings: '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" fill="#64748b"/><circle cx="12" cy="12" r="3" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M12 5v2.5M12 16.5V19M5 12h2.5M16.5 12H19M7 7l1.8 1.8M15.2 15.2L17 17M7 17l1.8-1.8M15.2 8.8L17 7" stroke="#fff" stroke-width="1.5"/></svg>'
  };
  var LOCK = '<svg class="lk" viewBox="0 0 20 20"><rect x="4" y="9" width="12" height="9" rx="2" class="lk-b"/><path class="lk-s" d="M7 9V6.5a3 3 0 0 1 6 0V9" fill="none"/></svg>';
  var SNAPICON = '<svg viewBox="0 0 24 24" class="sl-ic"><path d="M7 10V7.5a5 5 0 0 1 10 0V10" fill="none" stroke="#cfd6dc" stroke-width="2"/><rect x="4" y="10" width="16" height="12" rx="3" fill="#2b2f36" stroke="#cfd6dc" stroke-width="1.2"/><circle cx="12" cy="16" r="3.6" fill="#1e1b4b" stroke="#8b9bb4" stroke-width="1.2"/><circle cx="12" cy="16" r="1.6" fill="#6366f1"/><circle cx="13" cy="15" r=".6" fill="#fff"/></svg>';
  var SIL = '<svg viewBox="0 0 40 40" class="sil"><rect width="40" height="40" fill="#3a4250"/><circle cx="20" cy="16" r="7" fill="#7b8696"/><path d="M6 40c2-9 8-13 14-13s12 4 14 13z" fill="#7b8696"/></svg>';

  var T = {};

  // SnappLock: faithful to the original Holo-era UI, with generic apps.
  T.snapplock = {
    html: function () {
      var apps = [['photos', 'Photos'], ['chat', 'Chat'], ['mail', 'Mail'], ['music', 'Music'], ['notes', 'Notes'], ['settings', 'Settings']];
      var tabs = function (a) { return '<div class="sl-tabs">' + ['App list', 'Settings', 'Intruder log'].map(function (n, i) { return '<span' + (i === a ? ' class="on"' : '') + '>' + n + '</span>'; }).join('') + '</div>'; };
      var bar = '<div class="sl-bar">' + SNAPICON + '<b>SnappLock</b><span class="sl-q">?</span><span class="sl-dots"></span></div>';
      var list = '<div class="v v-list">' + bar + tabs(0) + '<ul class="sl-list">' + apps.map(function (a) {
        return '<li class="sl-' + a[0] + '"><span class="ai">' + ICON[a[0]] + '</span><span class="an">' + a[1] + '</span>' + LOCK + '</li>';
      }).join('') + '</ul><div class="sl-btns"><span>Lock all</span><span>Unlock all</span><span>Lock important</span></div><i class="tap tap-chat"></i></div>';
      var home = '<div class="v v-home"><div class="hm-grid">' + apps.map(function (a) { return '<span class="hm-' + a[0] + '">' + ICON[a[0]] + '<em>' + a[1] + '</em></span>'; }).join('') + '</div><i class="tap tap-home"></i></div>';
      var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', ''].map(function (k) { return '<span>' + k + '</span>'; }).join('');
      var pin = '<div class="v v-pin"><div class="pin-head">' + SNAPICON + '<p>Chat is locked</p><p class="pin-sub">Enter passcode</p></div><div class="pin-dots"><i></i><i></i><i></i><i></i></div>' +
        '<p class="pin-err"><span class="e1">Wrong passcode (1 of 3)</span><span class="e2">Wrong passcode (2 of 3)</span><span class="e3">Wrong passcode (3 of 3)</span></p><div class="pin-keys">' + keys + '</div>' +
        '<div class="flash"></div><div class="snap">' + SIL + '<span>Intruder ID</span></div>' +
        '<div class="notif"><b>SnappLock</b><span>SMS alert sent to your chosen number</span><span class="tone"><svg viewBox="0 0 16 16"><path d="M3 6h3l4-3v10l-4-3H3z" fill="currentColor"/><path d="M12 5.5c1 1.4 1 3.6 0 5" stroke="currentColor" fill="none"/></svg>Alert tone played</span></div></div>';
      var log = '<div class="v v-log">' + bar + tabs(2) + '<div class="sl-shield"><svg viewBox="0 0 12 12"><rect x="2.5" y="5" width="7" height="6" rx="1" fill="#cfd6dc"/><path d="M4 5V3.6a2 2 0 0 1 4 0V5" stroke="#cfd6dc" fill="none"/></svg>Intruder Shield activated</div>' +
        '<ul class="sl-log"><li class="new">' + SIL + '<span><b>Chat</b><em>3 wrong passcodes</em><em>SMS sent, tone played</em></span><time>11:10</time></li>' +
        '<li>' + SIL + '<span><b>Photos</b><em>3 wrong passcodes</em><em>SMS sent</em></span><time>Yesterday</time></li></ul><p class="sl-sample">Sample log entries</p></div>';
      return phone(list + home + pin + log, 'ph-holo');
    },
    steps: [[1.6, 'list', ''], [0.9, 'list', 'tapchat'], [1.2, 'list', 'locked'], [1.3, 'home', 'locked taphome'], [1.1, 'pin', 'locked a1'],
      [1.0, 'pin', 'locked a2'], [1.1, 'pin', 'locked a3 flash'], [2.4, 'pin', 'locked a3 snap sms'], [3.0, 'log', 'locked']],
    still: 8
  };

  T.places = {
    html: function () {
      var head = '<div class="pl-bar"><b>Places</b><span class="pl-tabs"><em class="t-feed">Feed</em><em class="t-map">Map</em></span></div>';
      var feed = '<div class="pl-feed"><div class="pl-card"><div class="pl-ph"></div><p><b>Photo nearby</b><span>Captured with Krumbs</span></p></div>' +
        '<div class="pl-card pl-ev"><div class="pl-cal"><b>8</b><span>PM</span></div><p><b>Live music tonight</b><span>Event from Eventshop</span></p></div>' +
        '<div class="pl-card"><div class="pl-ph pl-ph2"></div><p><b>Sunset at the pier</b><span>Shared near you</span></p></div><span class="pl-fab"></span></div>';
      var map = '<div class="pl-map"><i class="pin p1"></i><i class="pin p2"></i><i class="pin p3"></i><i class="pin p4"></i><i class="me"></i>' +
        '<div class="pl-place"><b>Coffee shop</b><span>Nearby place from Foursquare</span><em>Sample distance: 120 m</em></div></div>';
      return phone('<div class="v-places">' + head + feed + map + '<i class="tap tap-tab"></i><i class="tap tap-pin"></i></div>', 'ph-light');
    },
    steps: [[2.2, 'feed', ''], [0.7, 'feed', 'tapmap'], [0.7, 'map', ''], [1.8, 'map', 'pins'], [0.7, 'map', 'pins tappin'], [2.4, 'map', 'pins card']],
    still: 5
  };



  // ABC3D: part 1 scans a letter card (3D object pops up); part 2 is "Drive & Collect":
  // a toy car in a bounded little world collects things that start with the scanned letter.
  T.abc3d = {
    html: function () {
      var cam = '<div class="ab-cam"><div class="ab-table"></div><div class="ab-card"><b>A</b></div><div class="ab-reticle"><i></i><i></i><i></i><i></i></div>' +
        '<div class="ab-obj"><svg viewBox="0 0 60 60"><ellipse cx="30" cy="54" rx="16" ry="3.5" fill="rgba(0,0,0,.25)"/><path d="M30 18c-6-5-18-3-18 11 0 12 9 21 13 21 2 0 3-1 5-1s3 1 5 1c4 0 13-9 13-21 0-14-12-16-18-11z" fill="#ef4444"/><path d="M30 18c0-5 2-9 6-11" stroke="#7c4a1d" stroke-width="2.4" fill="none"/><path d="M33 12c4-3 9-2 11 0-3 3-8 3-11 0z" fill="#22c55e"/><path d="M18 26c1-4 4-6 7-6" stroke="#fff" stroke-opacity=".5" stroke-width="2" fill="none"/></svg><span>A is for apple</span></div>' +
        '<p class="ab-mode">Scan a letter</p></div>';
      var game = '<div class="ab-game"><canvas width="720" height="380" role="img" aria-label="Drive and Collect: a toy car drives around a small world collecting things that start with A, such as an apple, an ant, an airplane, an anchor and a space helmet, while avoiding a ball and a cat."></canvas></div>';
      return phone(cam + game, 'ph-land ph-game');
    },
    custom: abc3dGame
  };

  function abc3dGame(el, fixed) {
    var canvas = el.querySelector('canvas'), ctx = canvas.getContext('2d');
    ctx.scale(2, 2);
    var W = 360, H = 190, R = AB.rng(5);
    // Closed track through the world
    function track(u) {
      var a = u * Math.PI * 2;
      return { x: 180 + 126 * Math.cos(a), y: 98 + 56 * Math.sin(a) + 9 * Math.sin(3 * a) };
    }
    var TRACK = []; for (var i = 0; i <= 160; i++) TRACK.push(track(i / 160));
    function tangent(u) { var a = track(u - 0.002), b = track(u + 0.002); return Math.atan2(b.y - a.y, b.x - a.x); }
    var GOOD = ['apple', 'ant', 'airplane', 'anchor', 'helmet'], NAMES = { apple: 'Apple', ant: 'Ant', airplane: 'Airplane', anchor: 'Anchor', helmet: 'Astronaut helmet', ball: 'Ball', cat: 'Cat' };
    var LAYOUT = [['apple', 0.12, 6], ['ball', 0.24, 5], ['ant', 0.33, -6], ['airplane', 0.45, 6], ['cat', 0.55, -5], ['anchor', 0.64, 6], ['helmet', 0.80, -6]];
    var trees = [[30, 40], [334, 40], [24, 166], [340, 170], [180, 98], [146, 108], [216, 90], [110, 92], [252, 106]];
    var items, parts, car, count, msg, msgT, doneT, mode = 'auto', keys = {};
    function reset(manual) {
      items = LAYOUT.map(function (d) {
        var p = track(d[1]), ang = tangent(d[1]), nx = -Math.sin(ang), ny = Math.cos(ang);
        return { kind: d[0], good: GOOD.indexOf(d[0]) > -1, u: d[1], lat: d[2], x: p.x + nx * d[2], y: p.y + ny * d[2], alive: true, ph: R() * 6 };
      });
      parts = []; count = 0; msg = ''; msgT = 0; doneT = -1;
      var s = track(0.02);
      car = { u: 0.02, lat: 0, x: s.x, y: s.y, h: tangent(0.02), v: 0, manual: !!manual };
    }
    reset(false);

    // ---------- Drawing ----------
    function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
    function world() {
      ctx.fillStyle = '#9ad97f'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#8fd174'; for (var k = 0; k < 14; k++) { ctx.beginPath(); ctx.ellipse((k * 53) % W, (k * 37) % H, 22, 10, 0, 0, 7); ctx.fill(); }
      // fence around the bounded world
      ctx.strokeStyle = '#b07a4a'; ctx.lineWidth = 3; rr(5, 5, W - 10, H - 10, 14); ctx.stroke();
      ctx.fillStyle = '#8a5a33'; for (var f = 18; f < W - 10; f += 22) { ctx.fillRect(f, 3, 3, 6); ctx.fillRect(f, H - 9, 3, 6); }
      // road
      function path() { ctx.beginPath(); TRACK.forEach(function (p, i) { if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.closePath(); }
      ctx.lineJoin = 'round';
      path(); ctx.strokeStyle = '#f1f5f9'; ctx.lineWidth = 34; ctx.stroke();
      path(); ctx.strokeStyle = '#ef4444'; ctx.setLineDash([6, 6]); ctx.lineWidth = 34; ctx.stroke(); ctx.setLineDash([]);
      path(); ctx.strokeStyle = '#5b6472'; ctx.lineWidth = 28; ctx.stroke();
      path(); ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 1.6; ctx.setLineDash([7, 7]); ctx.stroke(); ctx.setLineDash([]);
      // start line
      var s = track(0), a = tangent(0); ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(a);
      for (var q = -3; q < 3; q++) { ctx.fillStyle = (q % 2) ? '#fff' : '#111827'; ctx.fillRect(-2, q * 4.6, 4, 4.6); } ctx.restore();
      // trees (low-poly)
      trees.forEach(function (t) {
        ctx.fillStyle = 'rgba(0,0,0,.15)'; ctx.beginPath(); ctx.ellipse(t[0] + 3, t[1] + 7, 9, 4, 0, 0, 7); ctx.fill();
        ctx.fillStyle = '#2f8f4e'; ctx.beginPath(); ctx.moveTo(t[0], t[1] - 11); ctx.lineTo(t[0] + 9, t[1] + 5); ctx.lineTo(t[0] - 9, t[1] + 5); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#3fae63'; ctx.beginPath(); ctx.moveTo(t[0], t[1] - 11); ctx.lineTo(t[0] + 9, t[1] + 5); ctx.lineTo(t[0], t[1] + 5); ctx.closePath(); ctx.fill();
      });
    }
    function icon(kind, x, y, s) {
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
      if (kind === 'apple') { ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(-3, 1, 6, 0, 7); ctx.arc(3, 1, 6, 0, 7); ctx.fill(); ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.ellipse(3, -7, 3.5, 1.8, -0.5, 0, 7); ctx.fill(); ctx.strokeStyle = '#7c4a1d'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(1, -8); ctx.stroke(); }
      else if (kind === 'ant') { ctx.fillStyle = '#3b2a20'; [-6, 0, 6].forEach(function (dx, i) { ctx.beginPath(); ctx.arc(dx, 0, i === 1 ? 2.6 : 3.6, 0, 7); ctx.fill(); }); ctx.strokeStyle = '#3b2a20'; ctx.lineWidth = 1; [-3, 0, 3].forEach(function (dx) { ctx.beginPath(); ctx.moveTo(dx, 0); ctx.lineTo(dx - 2, 6); ctx.moveTo(dx, 0); ctx.lineTo(dx - 2, -6); ctx.stroke(); }); }
      else if (kind === 'airplane') { ctx.fillStyle = '#f8fafc'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.ellipse(0, 0, 9, 2.4, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-1, 0); ctx.lineTo(-4, -8); ctx.lineTo(1, -8); ctx.lineTo(3, 0); ctx.lineTo(1, 8); ctx.lineTo(-4, 8); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#38bdf8'; ctx.fillRect(-9, -4, 3, 8); }
      else if (kind === 'anchor') { ctx.strokeStyle = '#475569'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, -6, 2.2, 0, 7); ctx.moveTo(0, -4); ctx.lineTo(0, 7); ctx.moveTo(-4, -2); ctx.lineTo(4, -2); ctx.moveTo(-7, 3); ctx.quadraticCurveTo(0, 11, 7, 3); ctx.stroke(); }
      else if (kind === 'helmet') { ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.arc(0, 0, 7.5, 0, 7); ctx.fill(); ctx.fillStyle = '#1e3a5f'; ctx.beginPath(); ctx.ellipse(1, 0, 5, 4, 0, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.ellipse(-0.5, -1.5, 1.8, 1, -0.5, 0, 7); ctx.fill(); }
      else if (kind === 'ball') { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 7, 0, 7); ctx.fill(); ctx.fillStyle = '#3b82f6'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 7, -0.5, 0.9); ctx.fill(); ctx.fillStyle = '#f43f5e'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 7, 1.6, 3); ctx.fill(); ctx.fillStyle = '#facc15'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 7, 3.7, 5.1); ctx.fill(); }
      else if (kind === 'cat') { ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(0, 1, 6.5, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(-6, -2); ctx.lineTo(-5, -9); ctx.lineTo(-1, -5); ctx.moveTo(6, -2); ctx.lineTo(5, -9); ctx.lineTo(1, -5); ctx.fill(); ctx.fillStyle = '#1f2937'; ctx.fillRect(-3, 0, 1.6, 1.6); ctx.fillRect(1.6, 0, 1.6, 1.6); }
      ctx.restore();
    }
    function drawItems(t) {
      items.forEach(function (it) {
        if (!it.alive) return;
        var bob = Math.sin(t * 3 + it.ph) * 2;
        ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(it.x, it.y + 9, 7, 2.6, 0, 0, 7); ctx.fill();
        if (it.good) { ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.arc(it.x, it.y - 2 + bob, 11, 0, 7); ctx.fill(); }
        icon(it.kind, it.x, it.y - 2 + bob, 1);
      });
    }
    function drawCar() {
      ctx.save(); ctx.translate(car.x, car.y); ctx.rotate(car.h);
      var sp = Math.min(1, Math.abs(car.v) / 60);
      if (sp > 0.2) { ctx.strokeStyle = 'rgba(255,255,255,' + (0.7 * sp).toFixed(2) + ')'; ctx.lineWidth = 1.4; [-4, 0, 4].forEach(function (dy, i) { ctx.beginPath(); ctx.moveTo(-14 - i * 2, dy); ctx.lineTo(-24 - i * 3 - sp * 8, dy); ctx.stroke(); }); }
      ctx.fillStyle = 'rgba(0,0,0,.25)'; rr(-10, -5, 22, 12, 4); ctx.fill();
      ctx.fillStyle = '#111827'; ctx.fillRect(-8, -7.5, 5, 2.5); ctx.fillRect(4, -7.5, 5, 2.5); ctx.fillRect(-8, 5, 5, 2.5); ctx.fillRect(4, 5, 5, 2.5);
      ctx.fillStyle = '#0ea5e9'; rr(-11, -6, 22, 12, 4); ctx.fill();
      ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.moveTo(-11, -6); ctx.lineTo(11, -6); ctx.lineTo(8, 0); ctx.lineTo(-9, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#e0f2fe'; rr(1, -4.5, 5, 9, 1.5); ctx.fill();
      ctx.fillStyle = '#0369a1'; rr(-6, -4, 6, 8, 1.5); ctx.fill();
      ctx.fillStyle = '#fde68a'; ctx.fillRect(10, -5, 1.6, 2.4); ctx.fillRect(10, 2.6, 1.6, 2.4);
      ctx.restore();
    }
    function hud(t) {
      ctx.font = '600 10px "IBM Plex Sans", system-ui, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,.92)'; rr(10, 10, 132, 20, 10); ctx.fill();
      ctx.fillStyle = '#1d4ed8'; ctx.beginPath(); ctx.arc(21, 20, 6.5, 0, 7); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('A', 21, 20.5);
      ctx.fillStyle = '#0f172a'; ctx.textAlign = 'left'; ctx.fillText('Things that start with A', 31, 20.5);
      ctx.fillStyle = 'rgba(255,255,255,.92)'; rr(W - 86, 10, 76, 20, 10); ctx.fill();
      ctx.fillStyle = '#e2e8f0'; rr(W - 46, 17, 30, 6, 3); ctx.fill();
      ctx.fillStyle = '#22c55e'; if (count) { rr(W - 46, 17, 30 * count / 5, 6, 3); ctx.fill(); }
      ctx.fillStyle = '#0f172a'; ctx.textAlign = 'left'; ctx.fillText(count + ' / 5', W - 78, 20.5);
      if (msg && t - msgT < 1.6) {
        ctx.globalAlpha = Math.min(1, 1.6 - (t - msgT)); ctx.fillStyle = 'rgba(15,23,42,.82)'; ctx.font = '600 10px "IBM Plex Sans", system-ui, sans-serif';
        var w = ctx.measureText(msg).width + 18; rr(W / 2 - w / 2, H - 30, w, 20, 10); ctx.fill(); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText(msg, W / 2, H - 19.5); ctx.globalAlpha = 1;
      }
    }
    function card(lines, big) {
      ctx.fillStyle = 'rgba(15,23,42,.35)'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#fff'; rr(W / 2 - 138, H / 2 - 38, 276, 76, 14); ctx.fill();
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#1d4ed8'; ctx.font = '700 14px "IBM Plex Sans", system-ui, sans-serif'; ctx.fillText(big, W / 2, H / 2 - 12);
      ctx.fillStyle = '#334155'; ctx.font = '500 11px "IBM Plex Sans", system-ui, sans-serif'; ctx.fillText(lines, W / 2, H / 2 + 12);
    }
    function stars(t) {
      for (var k = 0; k < 14; k++) {
        var a = k / 14 * Math.PI * 2 + t, r = 60 + 10 * Math.sin(t * 3 + k);
        ctx.fillStyle = ['#facc15', '#38bdf8', '#f472b6', '#22c55e'][k % 4];
        ctx.save(); ctx.translate(W / 2 + Math.cos(a) * r * 1.6, H / 2 + Math.sin(a) * r * 0.75); ctx.rotate(a * 2);
        ctx.beginPath(); for (var j = 0; j < 5; j++) { var b = j * 4 * Math.PI / 5; ctx.lineTo(Math.cos(b) * 4, Math.sin(b) * 4); } ctx.closePath(); ctx.fill(); ctx.restore();
      }
    }
    function draw(t, overlay) {
      ctx.clearRect(0, 0, W, H);
      world(); drawItems(t);
      parts.forEach(function (p) { var a = 1 - p.age / 0.7; ctx.fillStyle = 'rgba(' + p.c + ',' + a.toFixed(2) + ')'; ctx.beginPath(); ctx.arc(p.x, p.y, 1.8, 0, 7); ctx.fill(); });
      drawCar(); hud(t);
      if (overlay === 'prompt') card('Steer the car and pick them up', 'Collect 5 things that start with A');
      if (overlay === 'done') { card('Apple, ant, airplane, anchor, astronaut helmet', 'Great job! 5 of 5'); stars(t); }
    }

    // ---------- Simulation ----------
    function collect(t) {
      items.forEach(function (it) {
        if (!it.alive) return;
        var dx = it.x - car.x, dy = it.y - car.y;
        if (dx * dx + dy * dy < 13 * 13) {
          it.alive = false;
          if (it.good) {
            count++; msg = NAMES[it.kind] + ' starts with A'; msgT = t;
            for (var k = 0; k < 12; k++) { var a = k / 12 * 6.283; parts.push({ x: it.x, y: it.y, vx: Math.cos(a) * 60, vy: Math.sin(a) * 60, age: 0, c: k % 2 ? '250,204,21' : '255,255,255' }); }
            if (count === 5) doneT = t;
          } else { msg = NAMES[it.kind] + ' starts with ' + it.kind.charAt(0).toUpperCase() + ', not A'; msgT = t; }
        }
      });
    }
    function stepParts(dt) { parts.forEach(function (p) { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.9; p.vy *= 0.9; p.age += dt; }); parts = parts.filter(function (p) { return p.age < 0.7; }); }
    function autoStep(dt, t) {
      var V = 0.105, latT = 0;
      items.forEach(function (it) { if (!it.alive) return; var du = it.u - car.u; if (du > 0 && du < 0.075) latT = it.good ? it.lat : -Math.sign(it.lat) * 12; });
      car.lat += (latT - car.lat) * Math.min(1, dt * 5);
      car.u += V * dt;
      var p = track(car.u), a = tangent(car.u), nx = -Math.sin(a), ny = Math.cos(a);
      car.x = p.x + nx * car.lat; car.y = p.y + ny * car.lat; car.h = a; car.v = V * 800;
      collect(t); stepParts(dt);
    }
    function manualStep(dt, t) {
      var acc = (keys.ArrowUp ? 90 : 0) - (keys.ArrowDown ? 110 : 0) + (pointer ? 90 : 0), steer = (keys.ArrowLeft ? -1 : 0) + (keys.ArrowRight ? 1 : 0);
      if (pointer) { var want = Math.atan2(pointer.y - car.y, pointer.x - car.x), d = Math.atan2(Math.sin(want - car.h), Math.cos(want - car.h)); steer = Math.max(-1, Math.min(1, d * 2)); }
      car.v += acc * dt; car.v *= Math.pow(0.35, dt); car.v = Math.max(-40, Math.min(110, car.v));
      car.h += steer * dt * 2.8 * Math.min(1, Math.abs(car.v) / 30) * (car.v < 0 ? -1 : 1);
      car.x += Math.cos(car.h) * car.v * dt; car.y += Math.sin(car.h) * car.v * dt;
      if (car.x < 16 || car.x > W - 16) { car.x = Math.max(16, Math.min(W - 16, car.x)); car.v *= -0.4; }
      if (car.y < 16 || car.y > H - 16) { car.y = Math.max(16, Math.min(H - 16, car.y)); car.v *= -0.4; }
      if (doneT < 0) collect(t); stepParts(dt);
    }

    // ---------- Timeline ----------
    // 0-4.8 s scan (HTML layer), 4.8-6.4 prompt, 6.4-15.4 drive, 15.4-18 done.
    var TT = 18, lastLoop = -1, lastT = 0, simT = 6.4;
    function setView(v, c) { if (el.dataset.v !== v) el.dataset.v = v; if (el.dataset.c !== c) el.dataset.c = c; }
    function autoFrame(time) {
      var loop = Math.floor(time / TT), t = time % TT, dt = Math.min(0.05, Math.max(0, time - lastT)); lastT = time;
      if (loop !== lastLoop) { lastLoop = loop; reset(false); simT = 6.4; }
      if (t < 4.8) { setView('cam', t < 1.4 ? '' : t < 2.2 ? 'found' : 'found pop'); return; }
      setView('game', '');
      if (t < 6.4) { draw(t, 'prompt'); return; }
      if (t < 15.4) { autoStep(dt, t); draw(t); return; }
      stepParts(dt); draw(t, 'done');
    }
    function staticGame(atT) { reset(false); for (var tt = 6.4; tt < atT; tt += 1 / 30) autoStep(1 / 30, tt); setView('game', ''); draw(atT); }
    if (fixed) {
      if (fixed === 'scan') setView('cam', 'found'); else if (fixed === 'pop') setView('cam', 'found pop');
      else if (fixed === 'done') { staticGame(15.3); draw(15.5, 'done'); } else if (fixed === 'prompt') { reset(false); setView('game', ''); draw(5, 'prompt'); }
      else staticGame(11.2);
      return;
    }
    var runner = AB.runner(el, function (time) { if (mode === 'auto') { if (AB.reduce) staticGame(11.2); else autoFrame(time); } }, {
      staticT: 0, onState: function (on) { el.classList.toggle('on', on); },
      onStart: function () {}
    });
    if (AB.reduce) staticGame(11.2);

    // ---------- Drive it yourself ----------
    var raf = null, mlast = 0, pointer = null;
    function mloop(ts) {
      var dt = Math.min(0.05, (ts - (mlast || ts)) / 1000), t = ts / 1000; mlast = ts;
      if (doneT >= 0 && t - doneT > 2.6) reset(true);
      manualStep(dt, t); draw(t, doneT >= 0 ? 'done' : null);
      raf = mode === 'manual' && !AB.hidden && el.isConnected ? requestAnimationFrame(mloop) : null;
    }
    function setMode(m, btn) {
      mode = m;
      if (m === 'manual') {
        reset(true); setView('game', ''); canvas.tabIndex = 0; canvas.focus({ preventScroll: true }); mlast = 0;
        if (!raf) raf = requestAnimationFrame(mloop);
      } else { canvas.removeAttribute('tabindex'); keys = {}; if (AB.reduce) staticGame(11.2); }
      el.classList.toggle('driving', m === 'manual');
      if (btn) { btn.setAttribute('aria-pressed', String(m === 'manual')); btn.textContent = m === 'manual' ? 'Back to autoplay' : 'Drive it yourself'; }
    }
    canvas.addEventListener('keydown', function (e) { if (mode === 'manual' && /^Arrow/.test(e.key)) { keys[e.key] = true; e.preventDefault(); } });
    canvas.addEventListener('keyup', function (e) { keys[e.key] = false; });
    canvas.addEventListener('blur', function () { keys = {}; });
    function local(e) { var r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height }; }
    canvas.addEventListener('pointerdown', function (e) { if (mode !== 'manual') return; pointer = local(e); canvas.setPointerCapture(e.pointerId); e.preventDefault(); });
    canvas.addEventListener('pointermove', function (e) { if (pointer) pointer = local(e); });
    ['pointerup', 'pointercancel'].forEach(function (n) { canvas.addEventListener(n, function () { pointer = null; }); });
    document.addEventListener('visibilitychange', function () { if (!document.hidden && mode === 'manual' && !raf) raf = requestAnimationFrame(mloop); });
    var scope = el.closest('[data-drive-scope]');
    if (scope) scope.querySelectorAll('[data-drive="abc3d"]').forEach(function (btn) {
      btn.addEventListener('click', function () { setMode(mode === 'manual' ? 'auto' : 'manual', btn); });
    });
    var hint = document.createElement('p'); hint.className = 'ab-hint'; hint.textContent = 'Arrow keys to drive, or drag on the screen';
    el.appendChild(hint);
    return runner;
  }

  T.search = {
    html: function () {
      var nodes = [[60, 60], [20, 22], [104, 22], [20, 100], [104, 100], [60, 120], [130, 62], [0, 62]];
      var edges = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 6], [0, 7], [2, 6], [4, 5], [3, 5], [1, 7]];
      var crawl = '<svg class="se-crawl" viewBox="-10 0 160 135">' + edges.map(function (e, i) { return '<line style="--i:' + i + '" x1="' + nodes[e[0]][0] + '" y1="' + nodes[e[0]][1] + '" x2="' + nodes[e[1]][0] + '" y2="' + nodes[e[1]][1] + '"/>'; }).join('') +
        nodes.map(function (n, i) { return '<circle style="--i:' + i + '" class="' + (i ? '' : 'seed') + '" cx="' + n[0] + '" cy="' + n[1] + '" r="' + (i ? 6 : 8) + '"/>'; }).join('') + '</svg>';
      var res = [['Program overview', 82], ['Admissions guide', 64], ['Course catalog', 47], ['Faculty directory', 33]];
      var list = '<ol class="se-res">' + res.map(function (r, i) { return '<li class="r' + i + '"><b>' + r[0] + '</b><span class="pg">dept page</span><i style="--w:' + r[1] + '%"></i></li>'; }).join('') + '</ol>';
      return browser('<div class="se-q"><span class="se-txt">graduate programs</span><i class="se-caret"></i></div><div class="se-main">' + crawl + list + '</div><p class="se-note">Ranked by a PageRank-style score (sample)</p>', 'campus search', 'b-search');
    },
    steps: [[1.6, 's', 'type'], [2.2, 's', 'type crawl'], [1.0, 's', 'type crawl res'], [3.0, 's', 'type crawl res rank']],
    still: 3
  };

  T.chat = {
    html: function () {
      var side = '<div class="ch-side"><b>Rooms</b><span class="r-gen"># general</span><span class="r-proj"># projects<em>2</em></span></div>';
      var gen = '<div class="v v-gen"><p class="m m1"><i class="a1"></i><span><b>user1</b>Hi everyone</span></p><p class="m m2"><i class="a2"></i><span><b>user2</b>Hello! Messages show up instantly.</span></p>' +
        '<p class="m typing"><i class="a1"></i><span><em></em><em></em><em></em></span></p><p class="m m3"><i class="a1"></i><span><b>user1</b>Over sockets, no refresh needed.</span></p></div>';
      var proj = '<div class="v v-proj"><p class="m p1"><i class="a3"></i><span><b>user3</b>Demo is ready to share.</span></p><p class="m p2"><i class="a2"></i><span><b>user2</b>Joining the room now.</span></p></div>';
      return browser(side + '<div class="ch-main">' + gen + proj + '<div class="ch-input">Message</div></div>', 'chat rooms', 'b-chat');
    },
    steps: [[1.0, 'gen', 'm1'], [1.0, 'gen', 'm1 m2'], [0.9, 'gen', 'm1 m2 typing'], [1.0, 'gen', 'm1 m2 m3'], [1.3, 'gen', 'm1 m2 m3 badge'], [1.0, 'proj', 'p1'], [2.2, 'proj', 'p1 p2']],
    still: 4
  };

  T.canon = {
    html: function () {
      var N = [['Ingest', 40, 34], ['Parse', 130, 34], ['Validate', 220, 34], ['Load', 130, 96], ['Report', 220, 96]];
      var edges = [[0, 1], [1, 2], [2, 3], [3, 4]];
      var dag = '<svg class="cn-dag" viewBox="0 0 270 130">' + edges.map(function (e, i) {
        var a = N[e[0]], b = N[e[1]], d = (i === 2) ? 'M' + (a[1]) + ' ' + (a[2] + 16) + ' C' + a[1] + ' 74 ' + b[1] + ' 60 ' + (b[1] + 30) + ' ' + (b[2] - 16) : 'M' + (a[1] + 34) + ' ' + a[2] + ' L' + (b[1] - 34) + ' ' + b[2];
        if (i === 2) d = 'M220 50 C220 76 130 64 130 80';
        return '<path class="cn-e e' + i + '" d="' + d + '"/>';
      }).join('') + N.map(function (n, i) { return '<g class="cn-n n' + i + '"><rect x="' + (n[1] - 34) + '" y="' + (n[2] - 16) + '" width="68" height="32" rx="7"/><circle cx="' + (n[1] - 22) + '" cy="' + n[2] + '" r="4"/><text x="' + (n[1] + 5) + '" y="' + (n[2] + 1) + '">' + n[0] + '</text></g>'; }).join('') + '</svg>';
      var drill = '<div class="cn-drill"><b>Validate: run history</b><ul><li class="ok">Run 1 completed</li><li class="ok">Run 2 completed</li><li class="bad">Run 3 failed: schema mismatch</li></ul><small>Sample data</small></div>';
      return browser('<div class="cn-main">' + dag + drill + '</div><div class="cn-toast">Alert sent to the on-call channel (sample)</div>', 'pipeline monitor', 'b-canon');
    },
    steps: [[2.0, 'd', ''], [1.2, 'd', 'fail'], [1.8, 'd', 'fail drill'], [2.6, 'd', 'fail drill toast'], [1.2, 'd', '']],
    still: 3
  };

  T.ehealth = {
    html: function () {
      var pat = '<div class="v v-pat"><div class="eh-nav"><b>Health Care Portal</b><span class="who">Patient</span></div><div class="eh-tabs"><em class="t1">Appointments</em><em class="t2">History</em><em class="t3">Bills</em></div>' +
        '<div class="eh-pane p1"><div class="eh-row"><b>Tue 10:30</b><span>General physician</span><i class="ok">Confirmed</i></div><div class="eh-row"><b>Fri 4:00</b><span>Follow-up</span><i>Requested</i></div></div>' +
        '<div class="eh-pane p2"><div class="eh-row"><b>Check-up</b><span>Notes and prescriptions</span></div><div class="eh-row"><b>Lab tests</b><span>Results attached</span></div></div>' +
        '<div class="eh-pane p3"><div class="eh-row"><b>Consultation</b><span>Paid</span><i class="ok">Paid</i></div><div class="eh-row"><b>Lab tests</b><span>Due</span><i>Due</i></div></div><p class="eh-s">Sample records</p></div>';
      var doc = '<div class="v v-doc"><div class="eh-nav"><b>Health Care Portal</b><span class="who">Doctor</span></div><p class="eh-h">Today’s schedule</p><div class="eh-grid">' +
        ['9:00', '10:30', '12:00', '2:00', '3:30', '5:00'].map(function (t, i) { return '<span class="s' + i + '"><b>' + t + '</b><em>' + (i === 1 || i === 4 ? 'Booked' : i === 3 ? 'New request' : 'Open') + '</em></span>'; }).join('') + '</div><p class="eh-s">Sample schedule</p></div>';
      return browser('<div class="eh-main">' + pat + doc + '</div>', 'health care portal', 'b-eh');
    },
    steps: [[1.6, 'pat', 'tab1'], [1.6, 'pat', 'tab2'], [1.6, 'pat', 'tab3'], [1.0, 'doc', ''], [2.4, 'doc', 'new']],
    still: 4
  };

  T.iste = {
    html: function () {
      var site = browser('<div class="is-site"><div class="is-hero"><b>ISTE VESIT</b><span>Student chapter</span></div><div class="is-nav"><em>Events</em><em>Team</em><em>Contact</em></div><div class="is-cards"><i></i><i></i><i></i></div></div>', 'chapter website', 'b-iste');
      var app = phone('<div class="is-app"><div class="is-top"><b>ISTE VESIT</b></div><div class="is-grid"><span class="ev">Events</span><span>Team</span><span>News</span><span>Contact</span></div>' +
        '<div class="is-events"><p>Events</p><div class="is-ev"><b>Workshop</b><span>Saturday</span></div><div class="is-ev"><b>Coding contest</b><span>Next week</span></div><div class="is-ev"><b>Guest talk</b><span>This month</span></div></div><i class="tap tap-ev"></i></div>', 'ph-light ph-sm');
      return '<div class="is-split">' + site + app + '</div>';
    },
    steps: [[1.8, 'i', ''], [0.6, 'i', 'tap'], [2.6, 'i', 'ev'], [0.8, 'i', '']],
    still: 2
  };

  T.game = {
    html: function () {
      return '<div class="gm"><div class="gm-sky"></div><div class="gm-hills"></div>' +
        '<div class="gm-pick"><p>Choose your character</p><span class="ch c1"><i></i></span><span class="ch c2"><i></i></span></div>' +
        '<div class="gm-hero"><i></i></div><div class="gm-enemy"><i></i></div><div class="gm-ground"></div><p class="gm-label">GameMaker game (course project)</p></div>';
    },
    steps: [[1.2, 'g', 'pick'], [1.0, 'g', 'pick chosen'], [5.0, 'g', 'fight']],
    still: 2
  };

  T.moti = {
    html: function () {
      return browser('<div class="mo"><div class="mo-page"><div class="mo-nav"><i class="mo-mark"></i><span></span><span></span><span></span></div>' +
        '<div class="mo-hero"><b>Hi, we’re the Mayor’s Office of Technology &amp; Innovation</b><span>We use technology to address the most pressing issues facing San José</span><em class="mo-cta">Digital Inclusion Grant</em></div>' +
        '<div class="mo-stats"><i></i><i></i><i></i></div>' +
        '<div class="mo-team"><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
        '<div class="mo-foot"><span>Sign up for updates</span><i></i><em>Subscribe</em></div></div></div>', 'civic website', 'b-moti');
    },
    steps: [[1.2, 'm', 'hero'], [1.4, 'm', 'hero cta'], [1.6, 'm', 'hero cta stats'], [1.8, 'm', 'hero cta stats team'], [2.2, 'm', 'hero cta stats team foot']],
    still: 2
  };

  T.iba = {
    html: function () {
      var cmp = '<div class="v v-cmp"><p class="ib-h">Compare gadgets</p><div class="ib-cmp"><div><b>Phone X1</b><span>6.1 in screen</span><span>Long battery</span><span class="pr">Best price</span></div><div><b>Phone Z2</b><span>6.4 in screen</span><span>Fast charging</span><span class="pr">Best price</span></div></div><p class="ib-s">Generic sample gadgets</p></div>';
      var posts = [['Battery easily lasts all day. Love it.', 'pos', 86], ['Got mine today, still setting it up.', 'neu', 64], ['Screen scratches far too easily.', 'neg', 79], ['Camera is great in low light!', 'pos', 90]];
      var trend = '<div class="v v-trend"><div class="ib-tag"><span>#phonex1</span><i class="se-caret"></i></div><ul class="ib-posts">' + posts.map(function (p, i) {
        return '<li class="ps' + i + '"><span>' + p[0] + '</span><em class="' + p[1] + '">' + (p[1] === 'pos' ? 'Positive' : p[1] === 'neg' ? 'Negative' : 'Neutral') + '</em><i style="--c:' + p[2] + '%"></i></li>';
      }).join('') + '</ul><div class="ib-sum"><span><b>Positive</b><i class="pos" style="--w:50%"></i></span><span><b>Neutral</b><i class="neu" style="--w:25%"></i></span><span><b>Negative</b><i class="neg" style="--w:25%"></i></span></div><p class="ib-s">Naive Bayes classifier, sample posts</p></div>';
      return browser('<div class="ib">' + cmp + trend + '</div>', 'gadget portal', 'b-iba');
    },
    steps: [[2.2, 'cmp', ''], [1.0, 'trend', 'tag'], [0.7, 'trend', 'tag s1'], [0.7, 'trend', 'tag s1 s2'], [0.7, 'trend', 'tag s1 s2 s3'], [0.8, 'trend', 'tag s1 s2 s3 s4'], [2.6, 'trend', 'tag s1 s2 s3 s4 sum']],
    still: 6
  };

  T.ddeal = {
    html: function () {
      var lots = [['Lot 1', 'Vintage camera', [120, 135, 150]], ['Lot 2', 'Desk lamp', [40, 55, 60]], ['Lot 3', 'Board game set', [75, 90, 110]]];
      return browser('<div class="dd"><div class="dd-top"><b>The D-Deal</b><span class="dd-live"><i></i>Live</span></div><table class="dd-t"><thead><tr><th>Lot</th><th>Item</th><th>Top bid</th><th>Status</th></tr></thead><tbody>' +
        lots.map(function (l, i) { return '<tr class="lot' + i + '"><td>' + l[0] + '</td><td>' + l[1] + '</td><td class="bid">' + l[2].map(function (v, j) { return '<span class="b' + j + '">' + v + ' pts</span>'; }).join('') + '</td><td class="st"><span class="open">Open</span><span class="sold">Sold</span></td></tr>'; }).join('') +
        '</tbody></table><p class="dd-s">Sample lots and bids</p></div>', 'auction board', 'b-dd');
    },
    steps: [[1.0, 'd', ''], [1.0, 'd', 'k1'], [1.0, 'd', 'k2'], [1.2, 'd', 'k2 sold0'], [1.0, 'd', 'k3 sold0'], [2.2, 'd', 'k3 sold0 sold2']],
    still: 5
  };

  T.runurn = {
    html: function () {
      return browser('<div class="ru"><div class="ru-hero"><b>Run for a cause</b><span>Sample campaign</span></div><div class="ru-prog"><i></i></div>' +
        '<div class="ru-stats"><span><b class="n0">12</b><b class="n1">18</b><b class="n2">25</b><b class="n3">31</b> runners</span><span>Goal: a full field</span></div>' +
        '<ul class="ru-sp"><li class="sp1">Sponsor A pledged</li><li class="sp2">Sponsor B pledged</li></ul><em class="ru-btn">Join the run</em><p class="ru-s">Sample numbers</p></div>', 'campaign page', 'b-ru');
    },
    steps: [[1.2, 'r', ''], [1.0, 'r', 'r1'], [1.2, 'r', 'r2 sp1'], [1.0, 'r', 'r3 sp1'], [2.4, 'r', 'r3 sp1 sp2 full']],
    still: 4
  };

  T.inventory = {
    html: function () {
      var rows = [['Notebooks', [40, 38, 38, 48]], ['Pens', [12, 12, 4, 4]], ['Folders', [25, 25, 25, 25]]];
      return browser('<div class="inv"><div class="inv-top"><b>Inventory</b><em class="a-sell">Sell 2 notebooks</em><em class="a-sell2">Sell 8 pens</em><em class="a-buy">Buy 10 notebooks</em></div><table class="inv-t"><thead><tr><th>Item</th><th>In stock</th><th></th></tr></thead><tbody>' +
        rows.map(function (r, i) { return '<tr class="it' + i + '"><td>' + r[0] + '</td><td class="q">' + r[1].map(function (v, j) { return '<span class="q' + j + '">' + v + '</span>'; }).join('') + '</td><td class="flag"><span>Low</span></td></tr>'; }).join('') +
        '</tbody></table><p class="dd-s">Sample items</p></div>', 'inventory manager', 'b-inv');
    },
    steps: [[1.4, 'n', 's0'], [1.4, 'n', 's1'], [1.6, 'n', 's2'], [2.2, 'n', 's3']],
    still: 2
  };

  T.projmgmt = {
    html: function () {
      var up = '<div class="v v-up"><p class="pm-h">Submit your project</p><div class="pm-file"><svg viewBox="0 0 20 20"><path d="M5 2h7l4 4v12H5z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M12 2v4h4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg><span>final-project.zip</span><i><b></b></i></div><em class="pm-btn">Upload</em></div>';
      var rv = '<div class="v v-rv"><p class="pm-h">Professor review</p><div class="pm-c"><b>Report</b><span>Clear scope and tests.</span></div><div class="pm-c"><b>Code</b><span>Add input validation.</span></div></div>';
      var gr = '<div class="v v-gr"><div class="pm-grade"><span>Grade</span><b>A</b><em>Sample grade</em></div></div>';
      return browser('<div class="pmg">' + up + rv + gr + '</div>', 'project portal', 'b-pm');
    },
    steps: [[1.2, 'up', ''], [1.6, 'up', 'upl'], [2.2, 'rv', ''], [2.4, 'gr', '']],
    still: 3
  };

  T.cricket = {
    html: function () {
      var rows = [['Player 4', 'Team B', 312], ['Player 7', 'Team B', 288], ['Player 2', 'Team B', 241], ['Player 9', 'Team B', 198]];
      return '<div class="cr"><div class="cr-title"><span>League Manager</span><i></i><i></i><i></i></div><div class="cr-body"><label>Query</label><div class="cr-q"><span>SELECT player, runs FROM players WHERE team = \'Team B\' ORDER BY runs DESC</span></div>' +
        '<em class="cr-run">Run</em><table class="cr-t"><thead><tr><th>Player</th><th>Team</th><th>Runs</th></tr></thead><tbody>' + rows.map(function (r, i) { return '<tr class="cr' + i + '"><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>'; }).join('') + '</tbody></table><p class="cr-s">Sample data</p></div></div>';
    },
    steps: [[1.6, 'c', 'q'], [0.5, 'c', 'q run'], [2.8, 'c', 'q run res']],
    still: 2
  };

  function mount(el) {
    var def = T[el.dataset.demo]; if (!def) return;
    el.innerHTML = def.html();
    el.classList.add('demo-' + el.dataset.demo);
    var fixed = el.dataset.fixed;
    if (def.custom) { var cr = def.custom(el, fixed); fitDemo(el); return cr; }
    // data-fixed="N" shows one step as a still frame (used for screenshot-style tiles on project pages).
    if (fixed != null) { var st = def.steps[+fixed] || def.steps[0]; el.dataset.v = st[1]; el.dataset.c = st[2]; el.dataset.s = fixed; el.classList.add('fixed'); fitDemo(el); return; }
    var total = def.steps.reduce(function (s, x) { return s + x[0]; }, 0), last = -1;
    function show(i) {
      if (i === last) return; last = i;
      el.dataset.v = def.steps[i][1]; el.dataset.c = def.steps[i][2]; el.dataset.s = i;
    }
    function frame(time) {
      var t = time % total, acc = 0;
      for (var i = 0; i < def.steps.length; i++) { acc += def.steps[i][0]; if (t < acc) { show(i); return; } }
    }
    var reported = false;
    var api = AB.runner(el, AB.reduce ? function () { show(def.still); } : frame, {
      staticT: 0,
      onState: function (on) { el.classList.toggle('on', on); },
      onStart: function () { if (!reported) { reported = true; AB.emit('demo', { id: el.dataset.demo }); } }
    });
    if (AB.reduce) show(def.still); else show(0);
    fitDemo(el);
    return api;
  }
  AB.mountDemo = function (el) { if (el._mounted) return el._run; el._mounted = true; el._run = mount(el); return el._run; };
  AB.fitDemo = function (el) { fitDemo(el); };
  // Scale a demo down (CSS zoom) when its column is narrower than the demo, e.g. on small phones.
  function fitDemo(el) {
    if (!el.firstChild) return;
    if (el.closest('.astage')) { if (AB.fitStage) AB.fitStage(el.closest('.astage')); return; } // card previews scale with their stage
    el.style.zoom = '';
    var host = el.parentElement, cs = getComputedStyle(host);
    var avail = host.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var need = el.scrollWidth, z = avail > 0 && need > avail ? avail / need : 1;
    // Inside fixed-height tile frames, fit the height too.
    if (host.classList.contains('tile-vis')) { var ah = host.clientHeight - 16, nh = el.scrollHeight; if (nh > ah) z = Math.min(z, ah / nh); }
    if (z < 1) el.style.zoom = z.toFixed(3);
  }
  var rT = null;
  addEventListener('resize', function () { clearTimeout(rT); rT = setTimeout(function () { document.querySelectorAll('.demo').forEach(fitDemo); }, 150); });
  document.querySelectorAll('.demo[data-demo]:not([data-lazy])').forEach(function (el) { if (!el.closest('[data-lazy-scope]')) AB.mountDemo(el); });
})();
