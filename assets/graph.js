/* Concept D v2: knowledge graph. Vanilla JS force layout, clustered by kind (domains inside, work in the middle, tech outside).
   Settles once, then drifts very gently. Zoom (buttons, pinch, ctrl/cmd + wheel), pan (drag background), spacing, filters. */
(function () {
  'use strict';
  var AB = window.AB, root = document.querySelector('[data-kg2]');
  if (!root) return;
  var reduce = AB.reduce, S = AB.svg;

  var W = function (id, label, desc, full) { return { id: id, kind: 'work', label: label, desc: desc, full: full }; };
  var Tn = function (id, label, full) { return { id: id, kind: 'tech', label: label, full: full }; };
  var D = function (id, label) { return { id: id, kind: 'domain', label: label }; };
  var NODES = [
    W('genstudio', 'GenStudio service', 'The GenAI service behind Adobe GenStudio: an enterprise pipeline that turns campaign inputs into on-brand ad copy and assets, with multi-provider model routing and bring-your-own-model integrations.', 'GenAI service for Adobe GenStudio'),
    W('layers', 'Layers', 'An agentic AI design app, built and deployed end to end. An agent breaks images into editable layers, rebuilds them and turns them into video.'),
    W('omnigen', 'OmniGen', 'Adobe hackathon project, 2025: an agent that plans and creates ad copy, images and video together.'),
    W('skills', 'Coding-agent skills', 'Repository-aware Claude Code skills and a shared wiki for debugging, code review and onboarding, adopted by engineers across two teams.'),
    W('voyager', 'Voyager', 'An internal workbench for side-by-side model comparison, API testing and load testing.'),
    W('mobilesdk', 'Adobe Mobile SDK', 'Adobe’s plugin-based, open-source Mobile SDK for data collection and media analytics on iOS and Android.'),
    W('rokusdk', 'Roku SDK', 'Adobe’s data-collection SDK for Roku, built from architecture through release.'),
    W('vegasdk', 'Vega OS SDK', 'Adobe’s data-collection SDK for Amazon Vega OS (Fire TV), built from architecture through release.'),
    W('moti', 'San José MOTI website', 'Pro bono, from November 2018: helped develop the website for the San José Mayor\u2019s Office of Technology & Innovation.', 'San José MOTI website (pro bono)'),
    W('canon', 'Pipeline dashboard', 'Canon internship, 2016: a Python/Flask and Java monitoring dashboard for enterprise data pipelines, with failure diagnostics and alerts.', 'Pipeline monitoring dashboard (Canon)'),
    W('places', 'Places', 'A location-aware Android social app: photo and event feed, Krumbs capture, Eventshop data and Foursquare nearby places.'),
    W('search', 'Search Engine', 'University-domain crawling, indexing and PageRank-style ranking in Java and MySQL. Team project.'),
    W('iba', 'Business Analytics', 'B.E. final-year project, 2015: a gadget portal with specs, prices and comparisons, plus a Twitter trend view that classifies tweets for a hashtag as positive, negative or neutral with a Naive Bayes classifier.', 'Intelligent Business Analytics'),
    W('ddeal', 'The D-Deal', 'A website for a fully automated, real-time online auction and trading event, built for 300 simultaneous users (2015).'),
    W('ehealth', 'Health Care Portal', 'Health Care Management Institution Portal: patients see appointments, treatment history and bills; doctors manage appointments and schedules.', 'Health Care Management Institution Portal'),
    W('game', 'GameMaker game', 'A course action game built in GameMaker: pick a character and fight enemies (2015).'),
    W('runurn', 'Run & Urn', 'Code for Good hackathon, 2014: a web app for an NGO to run fundraising running campaigns, with public participants and corporate sponsors.'),
    W('inventory', 'Inventory Management', 'Online inventory management course project (2014): buy, sell, edit and view stock.', 'Online Inventory Management'),
    W('projmgmt', 'Project Management', 'Online project management course project (2014): students upload projects, professors review and grade them.', 'Online Project Management'),
    W('snapplock', 'SnappLock', 'An Android app locker with front-camera intrusion alerts. 5K+ Google Play Store downloads and an IJCA paper.'),
    W('abc3d', 'ABC3D', 'An AR literacy game built with Unity and Vuforia, with a co-authored IEEE PerCom Workshops 2016 paper.'),
    W('iste', 'ISTE VESIT site & app', 'The website and Android app for the ISTE VESIT student chapter (2013 to 2014).', 'ISTE VESIT website and app'),
    W('cricket', 'Cricket league DB', 'A small database application with an MS-SQL database and a VB.NET interface (2013).', 'Cricket league database'),
    W('chat', 'NodeJS ChatApp', 'Multi-room browser chat on Node.js.'),

    Tn('llm', 'LLMs'), Tn('agents', 'Agents & tool calling'), Tn('claude', 'Claude'), Tn('claudecode', 'Claude Code'), Tn('langgraph', 'LangGraph'), Tn('langchain', 'LangChain'),
    Tn('routing', 'Model routing', 'Multi-provider model routing'), Tn('imgseg', 'Image models', 'Image models and segmentation'), Tn('video', 'Video generation'), Tn('mlnlp', 'ML / NLP', 'Machine learning / NLP (Naive Bayes)'),
    Tn('azure', 'Azure', 'Azure (OpenAI and cloud)'), Tn('python', 'Python'), Tn('flask', 'Flask'), Tn('java', 'Java'), Tn('kotlin', 'Kotlin'), Tn('swift', 'Swift'), Tn('objc', 'Objective-C'),
    Tn('brightscript', 'BrightScript'), Tn('js', 'JavaScript'), Tn('node', 'Node.js'), Tn('react', 'React'), Tn('php', 'PHP'), Tn('vbnet', 'VB.NET'), Tn('android', 'Android'), Tn('ott', 'TV / OTT'),
    Tn('unity', 'Unity'), Tn('vuforia', 'Vuforia'), Tn('gamemaker', 'GameMaker'), Tn('mysql', 'MySQL'), Tn('mongodb', 'MongoDB'), Tn('sqlserver', 'SQL Server', 'SQL Server (MS-SQL)'), Tn('redis', 'Redis'),
    Tn('datastores', 'Data stores'), Tn('observability', 'Observability'), Tn('splunk', 'Splunk'), Tn('newrelic', 'New Relic'), Tn('testauto', 'Test automation'),

    D('genai', 'Generative AI'), D('devtools', 'Developer tools'), D('mobiletv', 'Mobile & TV'), D('enterprise', 'Enterprise integrations'), D('backend', 'Backend services'),
    D('web', 'Web'), D('research', 'Research'), D('hackathons', 'Hackathons'), D('games', 'Games')
  ];
  var EDGES = [
    ['genstudio', 'llm'], ['genstudio', 'routing'], ['genstudio', 'python'], ['genstudio', 'azure'], ['genstudio', 'agents'], ['genstudio', 'enterprise'], ['genstudio', 'observability'], ['genstudio', 'backend'], ['genstudio', 'genai'],
    ['layers', 'agents'], ['layers', 'claude'], ['layers', 'imgseg'], ['layers', 'video'], ['layers', 'react'], ['layers', 'node'], ['layers', 'genai'],
    ['omnigen', 'agents'], ['omnigen', 'imgseg'], ['omnigen', 'video'], ['omnigen', 'llm'], ['omnigen', 'genai'], ['omnigen', 'hackathons'],
    ['skills', 'claudecode'], ['skills', 'llm'], ['skills', 'devtools'], ['voyager', 'llm'], ['voyager', 'devtools'],
    ['mobilesdk', 'java'], ['mobilesdk', 'kotlin'], ['mobilesdk', 'swift'], ['mobilesdk', 'objc'], ['mobilesdk', 'android'], ['mobilesdk', 'testauto'], ['mobilesdk', 'mobiletv'],
    ['rokusdk', 'brightscript'], ['rokusdk', 'ott'], ['rokusdk', 'mobiletv'], ['vegasdk', 'js'], ['vegasdk', 'ott'], ['vegasdk', 'mobiletv'],
    ['canon', 'python'], ['canon', 'flask'], ['canon', 'java'], ['canon', 'observability'], ['canon', 'backend'],
    ['moti', 'web'],
    ['places', 'android'], ['places', 'java'], ['search', 'java'], ['search', 'mysql'], ['search', 'web'],
    ['iba', 'mlnlp'], ['iba', 'web'], ['ddeal', 'web'], ['ehealth', 'mysql'], ['ehealth', 'web'], ['game', 'gamemaker'], ['game', 'games'],
    ['runurn', 'web'], ['runurn', 'hackathons'], ['inventory', 'php'], ['inventory', 'js'], ['inventory', 'web'], ['projmgmt', 'web'],
    ['snapplock', 'android'], ['snapplock', 'java'], ['snapplock', 'research'], ['abc3d', 'unity'], ['abc3d', 'vuforia'], ['abc3d', 'research'], ['abc3d', 'games'],
    ['iste', 'android'], ['iste', 'web'], ['cricket', 'sqlserver'], ['cricket', 'vbnet'], ['chat', 'node'], ['chat', 'js'], ['chat', 'web'],
    ['langgraph', 'agents'], ['langchain', 'llm'], ['claude', 'llm'], ['claude', 'agents'], ['claudecode', 'claude'], ['azure', 'llm'], ['azure', 'routing'],
    ['flask', 'python'], ['node', 'js'], ['react', 'js'], ['kotlin', 'android'], ['unity', 'vuforia'], ['mlnlp', 'llm'],
    ['datastores', 'mysql'], ['datastores', 'mongodb'], ['datastores', 'sqlserver'], ['datastores', 'redis'], ['datastores', 'backend'],
    ['observability', 'splunk'], ['observability', 'newrelic'], ['genai', 'llm'], ['genai', 'imgseg'], ['genai', 'video']
  ];
  var KIND = { work: 'Work', tech: 'Tech', domain: 'Domain' };
  var PMAP = { genstudio: 'genstudio-service', skills: 'coding-agent-skills', mobilesdk: 'mobile-sdk', rokusdk: 'mobile-sdk', vegasdk: 'mobile-sdk', canon: 'canon-dashboard',
    search: 'search-engine', iba: 'intelligent-business-analytics', ddeal: 'd-deal', game: 'gamemaker-game', runurn: 'run-and-urn', inventory: 'inventory-management',
    projmgmt: 'project-management', moti: 'sj-moti', iste: 'iste-vesit', cricket: 'cricket-league-db', chat: 'chat-app' };
  // Project nodes open the project modal directly; other nodes show their connections.
  function projectOf(n) { var pid = PMAP[n.id] || n.id; return n.kind === 'work' && AB.projectById && AB.projectById[pid] ? pid : null; }
  function activate(n, from) {
    var pid = projectOf(n);
    if (pid && AB.openProject) { AB.emit('graphnode', { id: n.id }); AB.openProject(pid, from || n.g); return; }
    select(n === selected ? null : n);
  }
  var ORDER = { work: 0, domain: 1, tech: 2 };

  var stage = root.querySelector('.kg-stage'), svg = root.querySelector('.kg-svg'), drawer = root.querySelector('.kg-drawer');
  var chipsEl = root.querySelector('.kg-chips'), mpanel = root.querySelector('.kg-mpanel'), spacing = root.querySelector('[data-spacing]');
  var nodes = NODES.map(function (n) { var o = {}; for (var k in n) o[k] = n[k]; o.nb = []; return o; });
  var byId = {}; nodes.forEach(function (n) { byId[n.id] = n; });
  var edges = EDGES.map(function (e) { var a = byId[e[0]], b = byId[e[1]]; a.nb.push(b); b.nb.push(a); return { a: a, b: b }; });
  var order = nodes.slice().sort(function (a, b) { return ORDER[a.kind] - ORDER[b.kind]; });
  var view = { k: 1, tx: 0, ty: 0 }, selected = null, hovered = null, hiddenKinds = {}, freeze = false, laid = false, entered = false;
  var Wd = 1300, Hd = 820, SP = 1, driftT = 0;

  // ---------- SVG scaffold ----------
  var gView = S('g', { 'class': 'kg-view' }, svg), gE = S('g', { 'aria-hidden': 'true' }, gView), gN = S('g', null, gView);
  svg.setAttribute('role', 'group');
  edges.forEach(function (e) { e.el = S('line', { 'class': 'kg-edge ek-' + e.a.kind + ' ek-' + e.b.kind }, gE); });
  nodes.forEach(function (n, i) {
    var g = S('g', { 'class': 'kg-node kg-' + n.kind, tabindex: i === 0 ? '0' : '-1', role: 'button', 'aria-pressed': 'false',
      'aria-label': (n.full || n.label) + ', ' + KIND[n.kind].toLowerCase() + '. Connects to ' + n.nb.map(function (m) { return m.full || m.label; }).join(', ') + '.' }, gN);
    n.r = S('rect', { 'class': 'kg-shape' }, g);
    n.t = S('text', { 'class': 'kg-label', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, g); n.t.textContent = n.label;
    n.g = g;
    n.p1 = (i * 2.399) % 6.283; n.p2 = (i * 1.7) % 6.283;
    g.addEventListener('pointerenter', function () { hovered = n; paint(); });
    g.addEventListener('pointerleave', function () { if (hovered === n) hovered = null; paint(); });
    g.addEventListener('focus', function () { hovered = n; paint(); ensureVisible(n); });
    g.addEventListener('blur', function () { if (hovered === n) hovered = null; paint(); });
    // Clicks are handled on pointerup (the SVG captures the pointer for panning and dragging).
    g.addEventListener('keydown', function (ev) {
      var vis = order.filter(visible), i2 = vis.indexOf(n), j = null;
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); activate(n); }
      else if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') j = (i2 + 1) % vis.length;
      else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') j = (i2 - 1 + vis.length) % vis.length;
      else if (ev.key === 'Home') j = 0; else if (ev.key === 'End') j = vis.length - 1;
      else if (ev.key === 'Escape') select(null);
      if (j !== null) { ev.preventDefault(); focusNode(vis[j]); }
    });
  });
  function visible(n) { return !hiddenKinds[n.kind]; }
  function focusNode(n) { nodes.forEach(function (m) { m.g.setAttribute('tabindex', m === n ? '0' : '-1'); }); n.g.focus(); }

  // ---------- Chips (phones) ----------
  ['work', 'tech', 'domain'].forEach(function (k) {
    var wrap = AB.el('div', 'kg-group kg-g-' + k, null, chipsEl);
    AB.el('p', 'kg-group-h', k === 'domain' ? 'Domains' : KIND[k], wrap);
    var ul = AB.el('ul', 'kg-chip-list', null, wrap);
    nodes.filter(function (n) { return n.kind === k; }).forEach(function (n) {
      var li = AB.el('li', null, null, ul), b = AB.el('button', 'kg-chip kg-' + n.kind, null, li);
      b.textContent = n.full || n.label; b.type = 'button'; b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () { if (projectOf(n)) { activate(n, b); return; } select(n === selected ? null : n); var r = mpanel.getBoundingClientRect(); if (selected && (r.bottom > innerHeight || r.top < 0)) mpanel.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }); });
      n.chip = b;
    });
  });

  // ---------- Details (drawer on wide screens, panel on phones) ----------
  var intro = mpanel.innerHTML;
  function details(target, n, closable) {
    target.innerHTML = '';
    if (!n) { target.innerHTML = intro; return; }
    if (closable) { var x = AB.el('button', 'kg-close', '<span aria-hidden="true">&times;</span>', target); x.type = 'button'; x.setAttribute('aria-label', 'Close details'); x.addEventListener('click', function () { var was = selected; select(null); if (was) was.g.focus(); }); }
    AB.el('p', 'kg-p-kind kg-' + n.kind, KIND[n.kind], target);
    AB.el('h3', 'kg-p-title', null, target).textContent = n.full || n.label;
    if (n.desc) AB.el('p', 'kg-p-desc', null, target).textContent = n.desc;
    AB.el('p', 'kg-p-sub', n.kind === 'work' ? 'Built with and part of' : 'Connected to', target);
    var ul = AB.el('ul', 'kg-p-conn', null, target);
    n.nb.slice().sort(function (a, b) { return ORDER[a.kind] - ORDER[b.kind]; }).forEach(function (m) {
      var li = AB.el('li', null, null, ul), b = AB.el('button', 'kg-chip kg-' + m.kind, null, li);
      b.textContent = m.full || m.label; b.type = 'button';
      b.addEventListener('click', function () { if (hiddenKinds[m.kind]) { toggleKind(m.kind, true); relayout(false); } select(m); if (stage.offsetWidth) { centerOn(m); focusNode(m); } });
    });
  }
  function select(n) {
    selected = n;
    nodes.forEach(function (m) { m.g.setAttribute('aria-pressed', String(m === n)); m.chip.setAttribute('aria-pressed', String(m === n)); });
    details(drawer, n, true); drawer.hidden = !n;
    details(mpanel, n, false);
    if (n) AB.emit('graphnode', { id: n.id });
    paint();
  }
  function paint() {
    var f = hovered || selected;
    root.classList.toggle('kg-has-hl', !!f);
    freeze = !!hovered || dragging;
    nodes.forEach(function (m) { var on = !!f && (m === f || f.nb.indexOf(m) > -1); m.g.classList.toggle('is-hl', on); m.g.classList.toggle('is-focus', m === f); m.chip.classList.toggle('is-hl', on); });
    edges.forEach(function (e) { e.el.classList.toggle('is-hl', !!f && (e.a === f || e.b === f)); });
  }

  // ---------- Filters ----------
  var filterBtns = Array.prototype.slice.call(root.querySelectorAll('.kg-filter'));
  function toggleKind(kind, on) {
    hiddenKinds[kind] = !on;
    root.classList.toggle('hide-' + kind, !on);
    filterBtns.forEach(function (b) { if (b.dataset.kind === kind) b.setAttribute('aria-pressed', String(on)); });
    if (selected && !on && selected.kind === kind) select(null);
  }
  filterBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var on = b.getAttribute('aria-pressed') !== 'true';
      if (!on && filterBtns.filter(function (x) { return x.getAttribute('aria-pressed') === 'true'; }).length === 1) return; // keep one kind visible
      toggleKind(b.dataset.kind, on);
      relayout(true);
    });
  });

  // ---------- Layout ----------
  var CFG = { h: { work: 30, tech: 25, domain: 32 }, rx: { work: 8, tech: 12.5, domain: 3 }, padX: 12, gap: 10 };
  function size() {
    var c = root.classList.contains('kg-compact');
    nodes.forEach(function (n) { n.w = Math.ceil(n.t.getComputedTextLength()) + (c ? 9 : CFG.padX) * 2; n.h = CFG.h[n.kind] - (c ? 3 : 0);
      n.r.setAttribute('width', n.w); n.r.setAttribute('height', n.h); n.r.setAttribute('rx', Math.min(CFG.rx[n.kind], n.h / 2)); n.t.setAttribute('x', n.w / 2); n.t.setAttribute('y', n.h / 2); });
  }
  function collide(a, b) {
    var dx = b.x - a.x, dy = b.y - a.y, ox = (a.w + b.w) / 2 + CFG.gap - Math.abs(dx), oy = (a.h + b.h) / 2 + CFG.gap - Math.abs(dy);
    if (ox <= 0 || oy <= 0) return false;
    if (ox / (a.w + b.w) < oy / (a.h + b.h)) { var sx = (dx < 0 ? -1 : 1) * ox / 2; a.x -= sx; b.x += sx; } else { var sy = (dy < 0 ? -1 : 1) * oy / 2; a.y -= sy; b.y += sy; }
    return true;
  }
  function layout(sp) {
    var vis = nodes.filter(visible), vedges = edges.filter(function (e) { return visible(e.a) && visible(e.b); });
    // With a kind hidden, keep related nodes together: projects that share a hidden node get a layout-only spring.
    var spring = vedges.map(function (e) { return { a: e.a, b: e.b, w: 1 }; });
    nodes.forEach(function (h) {
      if (visible(h)) return;
      var nb = h.nb.filter(visible);
      for (var i = 0; i < nb.length; i++) for (var j = i + 1; j < nb.length; j++) spring.push({ a: nb[i], b: nb[j], w: 0.35 });
    });
    // Size the layout box to the stage's aspect ratio and to how much label area is visible.
    var area = 0; vis.forEach(function (n) { area += (n.w + CFG.gap * 2) * (n.h + CFG.gap * 2); });
    var aspect = SW && SH ? Math.max(0.7, Math.min(2.2, SW / SH)) : 1.55;
    area *= 1.1 * sp * sp;
    Wd = Math.sqrt(area * aspect); Hd = Wd / aspect;
    var cx = Wd / 2, cy = Hd / 2, R = AB.rng(11), L = Math.sqrt(area / vis.length) * 0.55, REP = Math.pow(L * 0.9, 2);
    var RAD = { domain: 0.2, work: 0.55, tech: 0.93 };
    if (hiddenKinds.tech) RAD = { domain: 0.25, work: 0.8, tech: 0.93 };
    var pos = vis.map(function (n, i) {
      var a = (i / vis.length) * Math.PI * 2 * 3.1 + R() * 0.5, r = RAD[n.kind];
      return { x: cx + Math.cos(a) * r * Wd / 2, y: cy + Math.sin(a) * r * Hd / 2, vx: 0, vy: 0, w: n.w, h: n.h, n: n };
    });
    var P = pos, IT = 460;
    var idx = {}; P.forEach(function (p, i) { idx[p.n.id] = i; });
    for (var it = 0; it < IT; it++) {
      var alpha = 1 - it / IT;
      for (var i = 0; i < P.length; i++) for (var j = i + 1; j < P.length; j++) {
        var a = P[i], b = P[j], dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy + 1, d = Math.sqrt(d2), f = Math.min(REP / d2, 6) * alpha;
        dx /= d; dy /= d; a.vx -= dx * f; a.vy -= dy * f; b.vx += dx * f; b.vy += dy * f;
      }
      spring.forEach(function (e) {
        var a = P[idx[e.a.id]], b = P[idx[e.b.id]], dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 1, f = (d - L) * 0.045 * e.w * alpha;
        dx /= d; dy /= d; a.vx += dx * f; a.vy += dy * f; b.vx -= dx * f; b.vy -= dy * f;
      });
      P.forEach(function (p) {
        var ex = (p.x - cx) / (Wd / 2), ey = (p.y - cy) / (Hd / 2), r = Math.sqrt(ex * ex + ey * ey) || 0.001, tr = RAD[p.n.kind], g = (tr - r) * 0.06 * alpha;
        p.vx += ex / r * g * Wd / 2 * 0.08; p.vy += ey / r * g * Hd / 2 * 0.08;
        p.x += p.vx; p.y += p.vy; p.vx *= 0.55; p.vy *= 0.55;
      });
      if (it > IT * 0.4) for (var p1 = 0; p1 < P.length; p1++) for (var q1 = p1 + 1; q1 < P.length; q1++) collide(P[p1], P[q1]);
    }
    for (var pass = 0; pass < 120; pass++) { var any = false; for (var p2 = 0; p2 < P.length; p2++) for (var q2 = p2 + 1; q2 < P.length; q2++) if (collide(P[p2], P[q2])) any = true; if (!any) break; }
    // Reshape toward the stage's aspect ratio (labels are wide, so layouts drift wide), then settle overlaps again.
    for (var sh = 0; sh < 4; sh++) {
      var bx0 = 1e9, by0 = 1e9, bx1 = -1e9, by1 = -1e9;
      P.forEach(function (p) { bx0 = Math.min(bx0, p.x - p.w / 2); bx1 = Math.max(bx1, p.x + p.w / 2); by0 = Math.min(by0, p.y - p.h / 2); by1 = Math.max(by1, p.y + p.h / 2); });
      var cur = (bx1 - bx0) / (by1 - by0), f = Math.sqrt(aspect / cur);
      if (Math.abs(f - 1) < 0.04) break;
      var mx = (bx0 + bx1) / 2, my = (by0 + by1) / 2;
      P.forEach(function (p) { p.x = mx + (p.x - mx) * f; p.y = my + (p.y - my) / f; });
      for (var pass2 = 0; pass2 < 120; pass2++) { var any2 = false; for (var a2 = 0; a2 < P.length; a2++) for (var b2 = a2 + 1; b2 < P.length; b2++) if (collide(P[a2], P[b2])) any2 = true; if (!any2) break; }
    }
    // keep edges from running under unrelated labels
    for (var ep = 0; ep < 40; ep++) {
      var moved = false;
      vedges.forEach(function (e) {
        var A = P[idx[e.a.id]], B = P[idx[e.b.id]], vx = B.x - A.x, vy = B.y - A.y, l2 = vx * vx + vy * vy || 1;
        P.forEach(function (p) {
          if (p === A || p === B) return;
          var t = ((p.x - A.x) * vx + (p.y - A.y) * vy) / l2; if (t <= 0.03 || t >= 0.97) return;
          var dx = p.x - (A.x + vx * t), dy = p.y - (A.y + vy * t);
          if (Math.abs(dx) < p.w / 2 + 4 && Math.abs(dy) < p.h / 2 + 4) { var nl = Math.sqrt(l2), nx = -vy / nl, ny = vx / nl; if (nx * dx + ny * dy < 0) { nx = -nx; ny = -ny; } p.x += nx * 6; p.y += ny * 6; moved = true; }
        });
      });
      for (var p3 = 0; p3 < P.length; p3++) for (var q3 = p3 + 1; q3 < P.length; q3++) collide(P[p3], P[q3]);
      if (!moved) break;
    }
    P.forEach(function (p) { p.n.fx = p.x; p.n.fy = p.y; });
    nodes.forEach(function (n) {
      n.r.setAttribute('width', n.w); n.r.setAttribute('height', n.h); n.r.setAttribute('rx', Math.min(CFG.rx[n.kind], n.h / 2));
      n.t.setAttribute('x', n.w / 2); n.t.setAttribute('y', n.h / 2);
    });
    laid = true;
  }

  // ---------- View (zoom / pan) ----------
  var SW = 0, SH = 0;
  function sizeSvg() { SW = stage.clientWidth; SH = stage.clientHeight; svg.setAttribute('width', SW); svg.setAttribute('height', SH); svg.setAttribute('viewBox', '0 0 ' + SW + ' ' + SH); }
  function bbox() { var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; nodes.filter(visible).forEach(function (n) { x0 = Math.min(x0, n.fx - n.w / 2); y0 = Math.min(y0, n.fy - n.h / 2); x1 = Math.max(x1, n.fx + n.w / 2); y1 = Math.max(y1, n.fy + n.h / 2); }); return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }; }
  // Fit every visible node, with padding, so no label is ever cut at the panel edge.
  function fit(animate) {
    var pad = SW < 700 ? 18 : 30, b = bbox(), k = Math.min(1.25, (SW - pad * 2) / (b.w + 6), (SH - pad * 2) / (b.h + 6));
    setView(k, SW / 2 - (b.x + b.w / 2) * k, SH / 2 - (b.y + b.h / 2) * k, animate);
  }
  var vraf = null;
  function setView(k, tx, ty, animate) {
    if (!animate || reduce) { view.k = k; view.tx = tx; view.ty = ty; applyView(); return; }
    var from = { k: view.k, tx: view.tx, ty: view.ty }, t0 = null;
    cancelAnimationFrame(vraf);
    (function step(ts) { if (t0 === null) t0 = ts; var t = Math.min(1, (ts - t0) / 450), e = 1 - Math.pow(1 - t, 3);
      view.k = from.k + (k - from.k) * e; view.tx = from.tx + (tx - from.tx) * e; view.ty = from.ty + (ty - from.ty) * e; applyView();
      if (t < 1) vraf = requestAnimationFrame(step); })(performance.now());
  }
  function applyView() { gView.setAttribute('transform', 'translate(' + view.tx.toFixed(1) + ' ' + view.ty.toFixed(1) + ') scale(' + view.k.toFixed(4) + ')'); }
  function zoomAt(f, cx, cy, animate) { var k = Math.max(0.3, Math.min(2.6, view.k * f)), r = k / view.k; setView(k, cx - (cx - view.tx) * r, cy - (cy - view.ty) * r, animate); }
  function centerOn(n) { setView(view.k, SW / 2 - n.fx * view.k, SH / 2 - n.fy * view.k, true); }
  function ensureVisible(n) { var x = n.fx * view.k + view.tx, y = n.fy * view.k + view.ty; if (x < 40 || x > SW - 40 || y < 40 || y > SH - 40) centerOn(n); }
  root.querySelectorAll('[data-zoom]').forEach(function (b) {
    b.addEventListener('click', function () { var z = b.dataset.zoom; if (z === 'fit') fit(true); else zoomAt(z === 'in' ? 1.25 : 0.8, SW / 2, SH / 2, true); });
  });
  stage.addEventListener('keydown', function (e) {
    if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomAt(1.2, SW / 2, SH / 2, true); }
    else if (e.key === '-' || e.key === '_') { e.preventDefault(); zoomAt(0.83, SW / 2, SH / 2, true); }
    else if (e.key === '0') { e.preventDefault(); fit(true); }
  });
  function local(e) { var r = svg.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  svg.addEventListener('wheel', function (e) { if (!(e.ctrlKey || e.metaKey)) return; e.preventDefault(); var p = local(e); zoomAt(Math.exp(-e.deltaY * 0.0025), p.x, p.y, false); }, { passive: false });

  // Pan the background, drag nodes, pinch with two pointers.
  var pointers = {}, dragging = false, panStart = null, pinch = null, dragNode = null;
  svg.addEventListener('pointerdown', function (e) {
    pointers[e.pointerId] = local(e);
    var ids = Object.keys(pointers);
    if (ids.length === 2) { var a = pointers[ids[0]], b = pointers[ids[1]]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), k: view.k, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2, tx: view.tx, ty: view.ty }; panStart = null; dragNode = null; return; }
    var g = e.target.closest && e.target.closest('.kg-node');
    svg.setPointerCapture(e.pointerId);
    if (g) { dragNode = nodes.filter(function (n) { return n.g === g; })[0]; var p = local(e); dragNode._sx = p.x; dragNode._sy = p.y; dragNode._ox = dragNode.fx; dragNode._oy = dragNode.fy; dragNode._moved = false; }
    else { var p2 = local(e); panStart = { x: p2.x, y: p2.y, tx: view.tx, ty: view.ty }; root.classList.add('kg-panning'); }
  });
  svg.addEventListener('pointermove', function (e) {
    if (!(e.pointerId in pointers)) return;
    var p = local(e); pointers[e.pointerId] = p;
    var ids = Object.keys(pointers);
    if (pinch && ids.length === 2) {
      var a = pointers[ids[0]], b = pointers[ids[1]], k = Math.max(0.3, Math.min(2.6, pinch.k * Math.hypot(a.x - b.x, a.y - b.y) / pinch.d)), r = k / pinch.k;
      view.k = k; view.tx = pinch.cx - (pinch.cx - pinch.tx) * r; view.ty = pinch.cy - (pinch.cy - pinch.ty) * r; applyView(); return;
    }
    if (dragNode) {
      if (!dragNode._moved && Math.hypot(p.x - dragNode._sx, p.y - dragNode._sy) < 4) return;
      dragNode._moved = true; dragging = true; root.classList.add('kg-dragging'); paint();
      dragNode.fx = dragNode._ox + (p.x - dragNode._sx) / view.k; dragNode.fy = dragNode._oy + (p.y - dragNode._sy) / view.k; render();
    } else if (panStart) { view.tx = panStart.tx + p.x - panStart.x; view.ty = panStart.ty + p.y - panStart.y; applyView(); }
  });
  function endPointer(e) {
    delete pointers[e.pointerId];
    if (Object.keys(pointers).length < 2) pinch = null;
    if (dragNode && dragNode._moved) { dragNode._dragged = true; var dn = dragNode; setTimeout(function () { dn._dragged = false; }, 0); }
    else if (dragNode && e.type === 'pointerup') { var tap = dragNode; dragNode = null; panStart = null; dragging = false; root.classList.remove('kg-dragging', 'kg-panning'); activate(tap); return; }
    dragNode = null; panStart = null; dragging = false; root.classList.remove('kg-dragging', 'kg-panning'); paint();
  }
  svg.addEventListener('pointerup', endPointer); svg.addEventListener('pointercancel', endPointer);

  // ---------- Render + gentle drift ----------
  var enterK = 1;
  function render() {
    if (!laid) return;
    var A = reduce ? 0 : 2.4, cx = Wd / 2, cy = Hd / 2;
    nodes.forEach(function (n) {
      if (!isFinite(n.fx) || !isFinite(n.fy)) return; // hidden kinds have no layout position yet
      var x = cx + (n.fx - cx) * enterK + A * Math.sin(driftT * 0.55 + n.p1), y = cy + (n.fy - cy) * enterK + A * Math.cos(driftT * 0.47 + n.p2);
      n.x = x; n.y = y;
      n.g.setAttribute('transform', 'translate(' + (x - n.w / 2).toFixed(1) + ' ' + (y - n.h / 2).toFixed(1) + ')');
    });
    edges.forEach(function (e) { if (!isFinite(e.a.x) || !isFinite(e.b.x)) return; e.el.setAttribute('x1', e.a.x.toFixed(1)); e.el.setAttribute('y1', e.a.y.toFixed(1)); e.el.setAttribute('x2', e.b.x.toFixed(1)); e.el.setAttribute('y2', e.b.y.toFixed(1)); });
  }
  var lastTime = 0;
  function frame(time) {
    var dt = time - lastTime; lastTime = time;
    if (!freeze && dt > 0 && dt < 0.2) driftT += dt;
    if (!entered) return;
    render();
  }

  function init() {
    sizeSvg();
    if (!SW) return;
    root.classList.toggle('kg-compact', SW < 820);
    size(); layout(SP);
    fit(false);
    render();
  }
  // Re-run the layout for the current filters and stage, easing nodes to their new places.
  function relayout(animate) {
    if (!SW) return;
    var cx0 = Wd / 2, cy0 = Hd / 2;
    var from = nodes.map(function (n) { return { x: n.fx == null ? cx0 : n.fx, y: n.fy == null ? cy0 : n.fy }; });
    size(); layout(SP);
    var to = nodes.map(function (n) { return { x: n.fx, y: n.fy }; });
    if (!animate || reduce) { fit(false); render(); return; }
    fit(true);
    var t0 = null;
    (function step(ts) { if (t0 === null) t0 = ts; var t = Math.min(1, (ts - t0) / 600), e = 1 - Math.pow(1 - t, 3);
      nodes.forEach(function (n, i) { n.fx = from[i].x + (to[i].x - from[i].x) * e; n.fy = from[i].y + (to[i].y - from[i].y) * e; });
      render(); if (t < 1) requestAnimationFrame(step); })(performance.now());
  }
  // Entrance: nodes ease out from the centre the first time the graph is seen.
  function enter() {
    entered = true; root.classList.add('kg-in');
    if (reduce) { enterK = 1; render(); return; }
    var t0 = null;
    (function step(ts) { if (t0 === null) t0 = ts; var t = Math.min(1, (ts - t0) / 1100); enterK = 0.35 + 0.65 * (1 - Math.pow(1 - t, 4)); render(); if (t < 1) requestAnimationFrame(step); })(performance.now());
  }
  var spTimer = null;
  spacing.addEventListener('input', function () {
    clearTimeout(spTimer);
    spTimer = setTimeout(function () { SP = spacing.value / 100; relayout(true); }, 120);
  });

  var lastW = 0;
  new ResizeObserver(function () { var w = stage.clientWidth; if (!w || Math.abs(w - lastW) < 20) return; lastW = w; init(); }).observe(stage);
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () {
    lastW = stage.clientWidth;
    // Narrow panels start with technologies hidden so labels stay readable; the Tech filter brings them back.
    if (stage.clientWidth && stage.clientWidth < 760) { toggleKind('tech', false); var note = root.querySelector('.kg-note'); if (note) note.hidden = false; }
    init();
    enterK = reduce ? 1 : 0.35; render();
    var io = new IntersectionObserver(function (ents) { if (ents[0].isIntersecting && !entered) { io.disconnect(); enter(); } }, { threshold: 0.2 });
    io.observe(stage);
    if (!stage.clientWidth) { entered = true; root.classList.add('kg-in'); }
  });
  AB.runner(stage, frame, { staticT: 0 });
  details(mpanel, null, false);
})();
