/* Concept D v4: project modal (sheet). Every project opens here; /#<id> deep links open it directly.
   Content comes from window.AB_DATA (assets/projects.js). */
(function () {
  'use strict';
  var AB = window.AB, DATA = window.AB_DATA, reduce = AB.reduce;
  var P = DATA.projects, byId = {};
  P.forEach(function (p, i) { byId[p.id] = p; p._i = i; });
  AB.projects = P; AB.projectById = byId;
  var ALIAS = { 'tv-sdks': 'mobile-sdk' };
  var modal = document.getElementById('modal'), sheet = modal.querySelector('.modal-sheet'), body = document.getElementById('modalBody');
  var current = null, opener = null, pushed = false, closing = false;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function icon(name, cls) {
    return '<svg class="' + (cls || 'ic') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (DATA.icons[name] || '') + '</svg>';
  }
  AB.icon = icon;
  var LINK_ICON = '<svg class="ic" viewBox="0 0 20 20" aria-hidden="true"><path d="M8.5 11.5a3.5 3.5 0 0 0 5 0l2.5-2.5a3.5 3.5 0 0 0-5-5L10 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M11.5 8.5a3.5 3.5 0 0 0-5 0L4 11a3.5 3.5 0 0 0 5 5l1-1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

  // ---------- Rendering ----------
  function vis(v) {
    switch (v.kind) {
      case 'icon': return '<div class="tile-vis vis-icon">' + icon(v.icon, 'ic-lg') + '</div>';
      case 'illu': return '<div class="tile-vis">' + DATA.illu[v.name] + '</div>';
      case 'demo': return '<div class="tile-vis vis-demo"><div class="demo" data-demo="' + v.demo + '"' + (v.fixed != null ? ' data-fixed="' + v.fixed + '"' : '') + ' aria-hidden="true"></div></div>';
      case 'holo': return '<div class="tile-vis vis-holo"><div class="holo holo-tile" data-holo data-sep="' + (v.sep || 0) + '" data-shift="' + (v.shift || 0) + '" data-exp="' + (v.exp || 0) + '" role="img" aria-label="' + esc(v.alt || 'Illustrated layer stack') + '"></div></div>';
      case 'slot': return '<div class="tile-vis vis-slot"><div class="slot">' + icon(v.icon || 'image') + '<span>' + esc(v.label) + '</span></div></div>';
      case 'chips': return '<ul class="tile-chips">' + v.items.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>';
    }
    return '';
  }
  function tile(t) {
    var v = t.vis, top = v && v.kind !== 'chips' ? vis(v) : '', bottom = v && v.kind === 'chips' ? vis(v) : '';
    return '<article class="tile t-' + (t.size || 's') + '">' + top + '<div class="tile-body">' +
      (t.kicker ? '<p class="tile-k">' + esc(t.kicker) + '</p>' : '') + (t.title ? '<h3>' + esc(t.title) + '</h3>' : '') +
      (t.text ? '<p>' + esc(t.text) + '</p>' : '') + bottom + '</div></article>';
  }
  function links(p) {
    var out = [];
    p.tiles.forEach(function (t) { if (t.vis && t.vis.kind === 'links') out = out.concat(t.vis.items); });
    return out;
  }
  function linkBtn(l) {
    if (l.todo) return ''; // hidden until the archived link is found
    if (false) return '<!-- TODO: ' + esc(l.todo) + ' --><a class="m-link" href="#" data-todo="The archived Google Play listing link is coming soon.">' + icon(l.icon || 'archive') + esc(l.label) + '</a>';
    return '<a class="m-link" href="' + esc(l.href) + '" target="_blank" rel="noopener">' + icon(l.icon || 'globe') + esc(l.label) + '</a>';
  }
  // Live archived sites can only be framed on the real site (the claude.ai preview blocks other-site frames).
  function canEmbed() { var hn = location.hostname; return /(^|\.)arjunbhadra\.com$/.test(hn) || /\.github\.io$/.test(hn) || hn === 'localhost' || location.protocol === 'file:'; }
  function fitSites(scope) {
    (scope || document).querySelectorAll('.site-view').forEach(function (v) { var f = v.querySelector('iframe'); if (f) f.style.transform = 'scale(' + (v.clientWidth / 1280).toFixed(4) + ')'; });
  }
  addEventListener('resize', function () { fitSites(); });
  AB.fitSites = fitSites;
  // The demo is the one framed area in the modal. Helper text lives behind a small (i) button.
  function hero(p) {
    var h = p.hero, inner;
    if (h.kind === 'viz') inner = '<div class="viz" data-viz="' + h.viz + '" data-title="' + esc(h.title || '') + '"></div>';
    else if (h.site && canEmbed()) inner = '<div class="viz dframe site-frame"><div class="viz-bar"><span class="viz-live"><i></i>Archived site</span><span class="viz-title">' + esc(h.siteLabel || '') + '</span>' +
      '<a class="site-open" href="' + esc(h.siteOpen || h.site) + '" target="_blank" rel="noopener">Open in new tab</a></div>' +
      '<div class="site-view"><iframe src="' + esc(h.site) + '" title="' + esc(p.card.name) + ', archived by the Internet Archive" loading="lazy" referrerpolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-popups"></iframe></div></div>';
    else inner = '<div class="viz dframe"><div class="viz-bar"><span class="viz-live"><i></i>Illustrated demo</span><span class="viz-title">' + esc(p.card.name) + '</span></div>' +
      '<div class="viz-stage"><div class="hero-demo' + (AB.DARK_TONE && AB.DARK_TONE[h.demo] ? ' dk' : '') + '"><div class="demo" data-demo="' + h.demo + '" aria-hidden="true"></div></div></div>' +
      (h.drive ? '<div class="viz-ctl"><div class="viz-ctl-l"><button type="button" class="vbtn vbtn-primary drive-btn" data-drive="abc3d" aria-pressed="false">Drive it yourself</button></div></div>' : '') + '</div>';
    return '<section class="m-hero" data-drive-scope aria-label="Live demo" data-info="' + esc(h.caption || '') + '">' + inner + '</section>';
  }
  var infoN = 0;
  function addInfo(heroEl) {
    var frame = heroEl.querySelector('.viz'), bar = frame && frame.querySelector('.viz-bar'); if (!bar) return;
    var notes = [], cap = heroEl.dataset.info, note = frame.querySelector('.viz-note');
    if (cap) notes.push(cap);
    if (note) { if (note.textContent && cap.indexOf(note.textContent) < 0) notes.push(note.textContent + '.'); note.remove(); }
    if (heroEl.querySelector('[data-drive]')) notes.push('Drive it yourself: use the arrow keys on the game, or drag on the screen.');
    if (frame.querySelector('.viz-bp')) notes.push('Blueprint flips the demo to the hand-drawn sketch it started from.');
    if (!notes.length) return;
    var id = 'info-' + (++infoN);
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'info-btn'; b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-controls', id);
    b.setAttribute('aria-label', 'About this demo');
    b.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M10 9v5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="10" cy="6.2" r="1" fill="currentColor"/></svg>';
    var pop = document.createElement('div');
    pop.className = 'info-pop'; pop.id = id; pop.hidden = true; pop.setAttribute('role', 'note');
    pop.innerHTML = notes.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('');
    var bp = bar.querySelector('.viz-bp');
    if (bp) bar.insertBefore(b, bp); else bar.appendChild(b);
    frame.appendChild(pop);
    b.addEventListener('click', function (e) { e.stopPropagation(); setInfo(b, pop, pop.hidden); });
  }
  var openInfo = null;
  function setInfo(b, pop, on) {
    if (openInfo && openInfo.b !== b) setInfo(openInfo.b, openInfo.pop, false);
    pop.hidden = !on; b.setAttribute('aria-expanded', String(on)); openInfo = on ? { b: b, pop: pop } : null;
  }
  document.addEventListener('click', function (e) { if (openInfo && !openInfo.pop.contains(e.target)) setInfo(openInfo.b, openInfo.pop, false); });
  function render(p) {
    var prev = P[(p._i - 1 + P.length) % P.length], next = P[(p._i + 1) % P.length];
    var facts = (p.facts || []).map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('');
    var tiles = p.tiles.filter(function (t) { return !(t.vis && (t.vis.kind === 'links' || t.vis.kind === 'slot')); }).map(tile).join('');
    body.innerHTML =
      '<header class="m-head">' +
        '<p class="eyebrow"><span class="dot"></span>' + esc(p.kicker) + '</p>' +
        '<h2 class="m-title" id="m-title" tabindex="-1">' + esc(p.title) + '</h2>' +
        '<p class="p-sum">' + esc(p.summary) + '</p>' +
        '<div class="m-acts"><button type="button" class="m-link m-copy" data-copy="' + p.id + '">' + LINK_ICON + 'Copy link</button>' + links(p).map(linkBtn).join('') + '</div>' +
        (facts ? '<dl class="p-facts">' + facts + '</dl>' : '') +
      '</header>' +
      hero(p) + (tiles ? '<section class="bento" aria-label="Highlights">' + tiles + '</section>' : '') +
      '<nav class="m-nav" aria-label="More projects">' +
        '<button type="button" class="p-navcard prev" data-go="' + prev.id + '"><span class="p-nk">Previous</span><span class="p-nt">' + esc(prev.card.name) + '</span></button>' +
        '<button type="button" class="p-navcard next" data-go="' + next.id + '"><span class="p-nk">Next</span><span class="p-nt">' + esc(next.card.name) + '</span></button>' +
      '</nav>';
    body.querySelectorAll('.viz[data-viz]').forEach(AB.buildViz);
    body.querySelectorAll('.demo[data-demo]').forEach(function (d) { AB.mountDemo(d); });
    fitSites(body); requestAnimationFrame(function () { fitSites(body); });
    AB.initHolos(body);
    var hEl = body.querySelector('.m-hero'); if (hEl) addInfo(hEl);
    var mt = document.getElementById('mtName'); if (mt) mt.textContent = p.card.name;
    modal.scrollTop = 0;
    AB.emit('project', { id: p.id });
  }

  // ---------- Open / close ----------
  var inertEls = ['main', '.hud', '.bg', '.skip'].map(function (s) { return document.querySelector(s); }).filter(Boolean);
  function cardFor(id) { return document.querySelector('[data-open="' + id + '"]'); }
  function show(id, from) {
    var p = byId[id]; if (!p) return;
    var wasOpen = !!current;
    current = id; render(p);
    try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: 'project/' + id, title: p.title, event: true }); } catch (e) {}
    if (wasOpen) { body.classList.remove('swap'); void body.offsetWidth; if (!reduce) body.classList.add('swap'); return; }
    opener = from || cardFor(id) || document.activeElement;
    var sbw = innerWidth - document.documentElement.clientWidth;
    document.documentElement.classList.add('modal-open');
    document.documentElement.style.setProperty('--sbw', sbw + 'px');
    inertEls.forEach(function (e) { e.inert = true; });
    AB.setModalOpen(true);
    modal.hidden = false; modal.scrollTop = 0;
    // Grow from the card that opened it.
    var src = opener && opener.closest && (opener.closest('.scard, .dcard') || opener);
    if (src && src.getBoundingClientRect && !reduce) {
      var r = src.getBoundingClientRect(), s = sheet.getBoundingClientRect();
      sheet.style.transformOrigin = (r.left + r.width / 2 - s.left) + 'px ' + (r.top + r.height / 2 - s.top + modal.scrollTop) + 'px';
    } else sheet.style.transformOrigin = '50% 20%';
    modal.classList.remove('closing'); void modal.offsetWidth; modal.classList.add('open');
    var t = body.querySelector('#m-title'); if (t) t.focus({ preventScroll: true });
  }
  function hide() {
    if (!current || closing) return;
    closing = true;
    var done = function () {
      modal.hidden = true; modal.classList.remove('open', 'closing'); body.innerHTML = '';
      document.documentElement.classList.remove('modal-open');
      inertEls.forEach(function (e) { e.inert = false; });
      AB.setModalOpen(false);
      var back = cardFor(current) && document.contains(opener) ? opener : (cardFor(current) || opener);
      current = null; closing = false; pushed = false;
      if (back && back.focus) { back.focus({ preventScroll: true }); if (back.scrollIntoView && !isInView(back)) back.scrollIntoView({ block: 'center', behavior: 'auto' }); }
    };
    if (reduce) done();
    else { modal.classList.add('closing'); setTimeout(done, 240); }
  }
  function isInView(el) { var r = el.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; }
  function idFromHash() {
    var h = ''; try { h = decodeURIComponent(location.hash.slice(1)); } catch (e) {}
    h = ALIAS[h] || h;
    return byId[h] ? h : null;
  }

  // Public: open a project from a card or link. Adds one history entry so Back closes it.
  AB.openProject = function (id, from) {
    if (!byId[id]) return;
    opener = from || null;
    if (idFromHash() === id) { show(id, from); return; }
    pushed = true;
    location.hash = id;
  };
  function closeUI() {
    if (!current) return;
    if (pushed) history.back();                       // hashchange will hide()
    else { history.replaceState(null, '', location.pathname + location.search); hide(); }
  }
  addEventListener('hashchange', function () {
    var id = idFromHash();
    if (id) { if (id !== current) show(id, opener); }
    else if (current) hide();
    else { var h = location.hash.slice(1); if (h && !document.getElementById(h)) scrollTo({ top: 0, behavior: 'instant' }); }
  });

  // ---------- Events ----------
  modal.addEventListener('click', function (e) {
    var t = e.target;
    if (t.closest('[data-close]')) { closeUI(); return; }
    var go = t.closest('[data-go]');
    if (go) { var id = go.dataset.go; history.replaceState(null, '', '#' + id); show(id); var tt = body.querySelector('#m-title'); if (tt) tt.focus({ preventScroll: true }); }
  });
  modal.addEventListener('mousedown', function (e) { if (e.target === modal) closeUI(); });
  document.addEventListener('keydown', function (e) {
    if (!current) return;
    if (e.key === 'Escape') { e.preventDefault(); if (openInfo) { var ob = openInfo.b; setInfo(ob, openInfo.pop, false); ob.focus(); return; } closeUI(); return; }
    if (e.key === 'Tab') {
      var f = Array.prototype.filter.call(sheet.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"]), canvas[tabindex]'), function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || !sheet.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !sheet.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
    }
  });

  // ---------- Initial deep link ----------
  function boot() {
    var id = idFromHash();
    if (id) { show(id, null); return; }
    var h = location.hash.slice(1);
    if (h && !document.getElementById(h)) scrollTo({ top: 0, behavior: 'instant' });
  }
  if (document.readyState === 'complete') setTimeout(boot, 0); else addEventListener('load', boot);
})();
