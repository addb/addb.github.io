/* Concept D v5: one card design for Systems and the archive. Each card opens its project modal. */
(function () {
  'use strict';
  var AB = window.AB, DATA = window.AB_DATA;
  var P = DATA.projects;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  // Light mockups are re-toned to the site's dark palette so every card reads as one family.
  AB.DARK_TONE = { places: 1, search: 1, canon: 1, iba: 1, ddeal: 1, ehealth: 1, runurn: 1, inventory: 1, projmgmt: 1, iste: 1, cricket: 1, chat: 1, moti: 1 };
  var STAGE_W = 500, STAGE_H = 312;

  // Scale a preview's natural size into its 16:10 frame (same approach for consoles and archive demos).
  function fit(frame) {
    var inner = frame.querySelector('.prev-inner'); if (!inner) return;
    var stage = inner.querySelector('.astage');
    if (stage) {
      // Archive: the stage has a fixed size, so its scale never depends on measuring zoomed content.
      inner.style.zoom = '';
      fitStage(stage);
      var k = Math.min(frame.clientWidth / STAGE_W, frame.clientHeight / STAGE_H);
      if (k > 0) inner.style.zoom = k.toFixed(3);
      return;
    }
    inner.style.zoom = '';
    var fw = frame.clientWidth, fh = frame.clientHeight, nw = inner.scrollWidth, nh = inner.scrollHeight;
    if (!fw || !fh || !nw || !nh) return;
    inner.style.zoom = Math.min(fw / nw, fh / nh).toFixed(3);
  }
  // Archive demos sit at one shared scale inside a fixed stage, so a phone and a browser read at the same density.
  function fitStage(stage) {
    var d = stage && stage.querySelector('.demo'); if (!d || !d.firstChild) return;
    d.style.zoom = '';
    var w = d.offsetWidth, h = d.offsetHeight; if (!w || !h) return;
    d.style.zoom = Math.min(1.3, (STAGE_W - 48) / w, (STAGE_H - 36) / h).toFixed(3);
  }
  AB.fitStage = fitStage;
  var ro = new ResizeObserver(function (ents) { ents.forEach(function (e) { fit(e.target); }); });
  var lazy = new IntersectionObserver(function (ents) {
    ents.forEach(function (e) {
      if (!e.isIntersecting) return;
      lazy.unobserve(e.target);
      var frame = e.target, v = frame.querySelector('.viz'), d = frame.querySelector('.demo');
      if (v) AB.buildViz(v);
      if (d) { AB.mountDemo(d); fitStage(frame.querySelector('.astage')); }
      fit(frame); ro.observe(frame);
      setTimeout(function () { if (d) fitStage(frame.querySelector('.astage')); fit(frame); }, 300);
    });
  }, { rootMargin: '300px 0px' });

  function card(p) {
    var c = p.card, sys = c.group === 'system';
    var prev = sys
      ? '<div class="viz" data-viz="' + p.hero.viz + '" data-title=""></div>'
      : '<div class="astage' + (AB.DARK_TONE[p.hero.demo] ? ' dk' : '') + '"><div class="demo" data-demo="' + p.hero.demo + '"></div></div>';
    var meta = c.year ? '<span class="pc-year">' + esc(c.year) + '</span>' : '';
    var TINT = { system: '155, 232, 255', mobile: '110, 231, 183', web: '167, 139, 250', data: '96, 165, 250', games: '255, 178, 122', ai: '244, 114, 182' };
    var tint = TINT[sys ? 'system' : ((c.filters && c.filters[0]) || 'system')] || TINT.system;
    return '<article class="pcard" style="--tint: ' + tint + '" data-id="' + p.id + '"' + (c.filters ? ' data-filters="' + c.filters.join(' ') + '"' : '') + '>' +
      '<div class="card-prev" aria-hidden="true"><div class="prev-inner">' + prev + '</div></div>' +
      '<div class="pcard-body"><h3><button type="button" class="card-btn" data-open="' + p.id + '">' + esc(c.name) +
      (c.year ? '<span class="visually-hidden">, ' + esc(c.year) + '</span>' : '') + '</button></h3>' +
      '<p class="card-line">' + esc(c.line) + '</p>' +
      '<div class="pc-foot">' + meta + '<ul class="card-tags">' + (c.tags || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>' +
      '</div></article>';
  }
  function mountGrid(el, list) {
    el.innerHTML = list.map(card).join('');
    el.querySelectorAll('.card-prev').forEach(function (f) { lazy.observe(f); });
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-open]'); if (b) AB.openProject(b.dataset.open, b);
    });
  }

  var sys = document.getElementById('sysCards');
  if (sys) mountGrid(sys, P.filter(function (p) { return p.card.group === 'system'; }));

  var grid = document.getElementById('agrid');
  if (!grid) return;
  var items = P.filter(function (p) { return p.card.group === 'archive'; });
  mountGrid(grid, items);
  // Filter chips: only kinds that have at least one project.
  var fEl = document.getElementById('archFilters'), countEl = document.getElementById('archCount');
  var chips = DATA.filters.filter(function (f) { return f[0] === 'all' || items.some(function (p) { return (p.card.filters || []).indexOf(f[0]) > -1; }); });
  fEl.innerHTML = chips.map(function (f, i) {
    var n = f[0] === 'all' ? items.length : items.filter(function (p) { return (p.card.filters || []).indexOf(f[0]) > -1; }).length;
    return '<button type="button" data-f="' + f[0] + '" aria-pressed="' + (i === 0) + '">' + esc(f[1]) + '<span class="fc-n">' + n + '</span></button>';
  }).join('');
  fEl.addEventListener('click', function (e) {
    var b = e.target.closest('[data-f]'); if (!b) return;
    var f = b.dataset.f, n = 0;
    fEl.querySelectorAll('[data-f]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    grid.querySelectorAll('.pcard').forEach(function (c) {
      var show = f === 'all' || (' ' + c.dataset.filters + ' ').indexOf(' ' + f + ' ') > -1;
      c.hidden = !show; if (show) n++;
    });
    countEl.textContent = 'Showing ' + n + ' project' + (n === 1 ? '' : 's') + '.';
  });
  var rT = null;
  addEventListener('resize', function () { clearTimeout(rT); rT = setTimeout(function () { document.querySelectorAll('.pcard .card-prev').forEach(fit); }, 120); });
})();
