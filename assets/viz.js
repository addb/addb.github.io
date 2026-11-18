/* Concept D v2: interactive system visualizers for the "Active systems" explorer.
   Every console is illustrative. Any figures shown are labelled as sample data. */
(function () {
  'use strict';
  var AB = window.AB, S = AB.svg, E = AB.el, reduce = AB.reduce;

  // Blueprint sketches (the hand-drawn look from v1), one per system.
  var SK = {
    genstudio: { boxes: [
        { id: 'in', x: 18, y: 70, w: 112, h: 64, t: 'campaign\ninputs' }, { id: 'ctx', x: 160, y: 70, w: 150, h: 64, t: 'brand, product,\naudience context' },
        { id: 'gen', x: 340, y: 70, w: 140, h: 64, t: 'multi-step\nLLM generation' }, { id: 'safe', x: 510, y: 70, w: 118, h: 64, t: 'brand-safety\nchecks' },
        { id: 'out', x: 652, y: 70, w: 104, h: 64, t: 'ad copy\n+ assets', fill: 1 }, { id: 'router', x: 350, y: 200, w: 120, h: 46, t: 'model router' },
        { id: 'azure', x: 540, y: 176, w: 160, h: 42, t: 'Azure OpenAI' }, { id: 'byom', x: 540, y: 238, w: 160, h: 56, t: 'customer-hosted\nmodels' }],
      arrows: [['in', 'ctx'], ['ctx', 'gen'], ['gen', 'safe'], ['safe', 'out'], ['gen', 'router', 'v2'], ['router', 'azure'], ['router', 'byom']],
      notes: [{ x: 30, y: 230, t: 'bring your own model:\nenterprises plug in\ntheir hosted LLMs' }, { x: 166, y: 40, t: 'context first, then generate' }] },
    layers: { boxes: [
        { id: 'img', x: 16, y: 110, w: 104, h: 74, t: 'flat image', pic: 1 }, { id: 'agent', x: 160, y: 100, w: 140, h: 94, t: 'agent\n(tool-calling\nloop)', loop: 1 },
        { id: 't1', x: 340, y: 22, w: 168, h: 40, t: 'segmentation' }, { id: 't2', x: 340, y: 74, w: 168, h: 40, t: 'background removal' },
        { id: 't3', x: 340, y: 126, w: 168, h: 40, t: 'image model' }, { id: 't4', x: 340, y: 178, w: 168, h: 40, t: 'compositing' },
        { id: 'lay', x: 546, y: 80, w: 92, h: 90, t: '', stack: 1 }, { id: 'expo', x: 668, y: 62, w: 82, h: 42, t: 'image' }, { id: 'vid', x: 668, y: 150, w: 82, h: 42, t: 'video' }],
      arrows: [['img', 'agent'], ['agent', 't1'], ['agent', 't2'], ['agent', 't3'], ['agent', 't4'], ['t4', 'lay'], ['lay', 'expo'], ['lay', 'vid']],
      labels: [{ x: 592, y: 196, t: 'editable layers' }],
      notes: [{ x: 30, y: 262, t: 'SAM2, Gemini image models, Veo for video' }, { x: 470, y: 262, t: 'regression evals on the image pipeline' }] },
    omnigen: { boxes: [
        { id: 'brief', x: 22, y: 118, w: 104, h: 60, t: 'ad brief' }, { id: 'plan', x: 176, y: 106, w: 150, h: 84, t: 'planning\nagent', loop: 1 },
        { id: 'copy', x: 392, y: 34, w: 168, h: 46, t: 'copy generator' }, { id: 'image', x: 392, y: 126, w: 168, h: 46, t: 'image generator' },
        { id: 'video', x: 392, y: 218, w: 168, h: 46, t: 'video generator' }, { id: 'set', x: 618, y: 96, w: 128, h: 104, t: 'ad set', fill: 1 }],
      arrows: [['brief', 'plan'], ['plan', 'copy'], ['plan', 'image'], ['plan', 'video'], ['copy', 'set'], ['image', 'set'], ['video', 'set']],
      notes: [{ x: 120, y: 250, t: 'plan first,\nthen make all three' }] },
    skills: { boxes: [
        { id: 'dev', x: 20, y: 116, w: 112, h: 60, t: 'developer' }, { id: 'skill', x: 172, y: 104, w: 150, h: 84, t: 'skill\n/investigate', loop: 1 },
        { id: 'map', x: 372, y: 36, w: 156, h: 46, t: 'repo map' }, { id: 'wiki', x: 372, y: 124, w: 156, h: 46, t: 'shared wiki' },
        { id: 'steps', x: 372, y: 212, w: 156, h: 46, t: 'tool steps' }, { id: 'sum', x: 588, y: 116, w: 150, h: 60, t: 'summary', fill: 1 }],
      arrows: [['dev', 'skill'], ['skill', 'map'], ['skill', 'wiki'], ['skill', 'steps'], ['map', 'sum'], ['wiki', 'sum'], ['steps', 'sum']],
      notes: [{ x: 26, y: 262, t: 'teammates reuse\nthe same skills' }] },
    sdks: { boxes: [
        { id: 'core', x: 280, y: 18, w: 200, h: 54, t: 'plugin-based core', fill: 1 },
        { id: 'e1', x: 30, y: 128, w: 150, h: 44, t: 'analytics' }, { id: 'e2', x: 210, y: 128, w: 150, h: 44, t: 'media' },
        { id: 'e3', x: 390, y: 128, w: 150, h: 44, t: 'identity' }, { id: 'e4', x: 570, y: 128, w: 150, h: 44, t: 'consent' },
        { id: 'p1', x: 40, y: 248, w: 120, h: 44, t: 'iOS' }, { id: 'p2', x: 200, y: 248, w: 120, h: 44, t: 'Android' },
        { id: 'p3', x: 360, y: 248, w: 120, h: 44, t: 'Roku' }, { id: 'p4', x: 520, y: 248, w: 120, h: 44, t: 'Vega OS' }],
      arrows: [['core', 'e1', 'down'], ['core', 'e2', 'down'], ['core', 'e3', 'down'], ['core', 'e4', 'down']],
      bus: { y: 210, x1: 60, x2: 640, from: [105, 285, 465, 645], to: [100, 260, 420, 580] },
      notes: [{ x: 640, y: 40, t: 'extensions\nplug in' }, { x: 662, y: 262, t: 'millions\nof devices' }] },
    voyager: { boxes: [
        { id: 'p', x: 20, y: 120, w: 110, h: 56, t: 'prompt' }, { id: 'a', x: 190, y: 50, w: 150, h: 64, t: 'model A' },
        { id: 'b', x: 190, y: 184, w: 150, h: 64, t: 'model B' }, { id: 'c', x: 400, y: 112, w: 140, h: 72, t: 'compare\nside by side' },
        { id: 'r', x: 600, y: 112, w: 140, h: 72, t: 'report', fill: 1 }],
      arrows: [['p', 'a'], ['p', 'b'], ['a', 'c'], ['b', 'c'], ['c', 'r']],
      notes: [{ x: 400, y: 40, t: 'load test runs\nin parallel' }, { x: 560, y: 250, t: 'run history kept' }] }
  };

  // ---------- Shared console shell ----------
  function shell(el, opts) {
    el.innerHTML = '';
    var bar = E('div', 'viz-bar', null, el);
    E('span', 'viz-live', '<i></i>Illustrated demo', bar);
    E('span', 'viz-title', el.dataset.title || '', bar);
    var bp = E('button', 'viz-bp', 'Blueprint', bar); bp.type = 'button'; bp.setAttribute('aria-pressed', 'false');
    var stage = E('div', 'viz-stage ' + (opts.stageClass || ''), null, el);
    var live = E('div', 'viz-live-layer', null, stage);
    var sketch = E('div', 'viz-sketch', null, stage); sketch.hidden = true;
    var ctl = E('div', 'viz-ctl', null, el);
    var ctlL = E('div', 'viz-ctl-l', null, ctl);
    E('span', 'viz-note', opts.note || 'Illustrative, sample data', ctl);
    var api = { el: el, stage: stage, live: live, ctl: ctlL, run: null };
    bp.addEventListener('click', function () {
      var on = bp.getAttribute('aria-pressed') !== 'true';
      bp.setAttribute('aria-pressed', String(on));
      el.classList.toggle('bp', on);
      if (on && !sketch.firstChild) AB.sketch(sketch, SK[opts.id]);
      sketch.hidden = !on;
      if (on) { sketch.classList.remove('drawn'); void sketch.offsetWidth; requestAnimationFrame(function () { sketch.classList.add('drawn'); }); }
      if (api.run) api.run.setEnabled(!on);
    });
    return api;
  }
  function seg(parent, label, options, onPick, initial) {
    var g = E('div', 'seg', null, parent); g.setAttribute('role', 'group'); g.setAttribute('aria-label', label);
    E('span', 'seg-l', label, g);
    var btns = options.map(function (o, i) {
      var b = E('button', null, o.label, g); b.type = 'button'; b.setAttribute('aria-pressed', String(i === (initial || 0)));
      b.addEventListener('click', function () { btns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); onPick(o.value, i, true); });
      return b;
    });
    return { set: function (i) { btns.forEach(function (x, j) { x.setAttribute('aria-pressed', String(j === i)); }); } };
  }
  function button(parent, label, cls) { var b = E('button', 'vbtn ' + (cls || ''), label, parent); b.type = 'button'; return b; }
  var curEl = null;
  function started(id) { var el = curEl; return function () { if (el && el.closest('.modal')) AB.emit('vizrun', { id: id }); }; }
  function txt(parent, x, y, s, cls, anchor) { var t = S('text', { x: x, y: y, 'class': cls || 'vz-t', 'text-anchor': anchor || 'middle', 'dominant-baseline': 'central' }, parent); t.textContent = s; return t; }
  function ease(t) { return 1 - Math.pow(1 - AB.clamp01(t), 3); }
  function seg01(t, a, b) { return AB.clamp01((t - a) / (b - a)); }

  var builders = {};

  // ---------- GenStudio: brief -> context -> multi-step generation -> brand safety -> variants ----------
  builders.genstudio = function (el) {
    var v = shell(el, { id: 'genstudio' });
    var svg = S('svg', { viewBox: '0 0 720 300', 'class': 'vz', role: 'img', 'aria-label': 'Animated pipeline: a campaign brief picks up brand, product and audience context, goes through three LLM generation steps that call a model router, passes a brand-safety check and comes out as three ad variants.' }, v.live);
    var g = S('g', null, svg);
    // links
    var ctxY = [67, 150, 233], M = [272, 150];
    var ctxLinks = ctxY.map(function (y) { return S('path', { d: 'M244 ' + y + ' C262 ' + y + ' 258 150 ' + M[0] + ' ' + M[1], 'class': 'vz-link', pathLength: 1 }, g); });
    S('path', { d: 'M120 150 H300', 'class': 'vz-wire' }, g);
    S('path', { d: 'M450 150 H482', 'class': 'vz-wire' }, g);
    S('path', { d: 'M578 150 H604', 'class': 'vz-wire' }, g);
    var outY = [75, 150, 225];
    outY.forEach(function (y) { S('path', { d: 'M604 150 C612 150 606 ' + y + ' 614 ' + y, 'class': 'vz-wire' }, g); });
    var toRouter = S('path', { d: 'M375 196 V236', 'class': 'vz-wire' }, g);
    var routeA = S('path', { d: 'M422 253 C440 253 442 238 462 238', 'class': 'vz-route' }, g);
    var routeB = S('path', { d: 'M422 253 C440 253 442 278 462 278', 'class': 'vz-route' }, g);
    // brief
    var brief = S('g', { 'class': 'vz-fade' }, g);
    S('rect', { x: 16, y: 112, width: 104, height: 76, rx: 8, 'class': 'vz-box' }, brief);
    txt(brief, 68, 130, 'Campaign brief', 'vz-t vz-s');
    S('rect', { x: 28, y: 146, width: 80, height: 5, rx: 2.5, 'class': 'vz-bar' }, brief);
    S('rect', { x: 28, y: 158, width: 62, height: 5, rx: 2.5, 'class': 'vz-bar' }, brief);
    S('rect', { x: 28, y: 170, width: 70, height: 5, rx: 2.5, 'class': 'vz-bar' }, brief);
    // context chips
    var chips = ['Brand', 'Product', 'Audience'].map(function (n, i) {
      var c = S('g', { 'class': 'vz-chip' }, g);
      S('rect', { x: 150, y: ctxY[i] - 15, width: 94, height: 30, rx: 15, 'class': 'vz-pill' }, c);
      txt(c, 197, ctxY[i], n, 'vz-t vz-s');
      return c;
    });
    // LLM box with steps
    S('rect', { x: 300, y: 104, width: 150, height: 92, rx: 10, 'class': 'vz-box vz-strong' }, g);
    txt(g, 375, 124, 'LLM generation', 'vz-t');
    var stepEls = ['Draft', 'Refine', 'Final'].map(function (n, i) {
      var s = S('g', { 'class': 'vz-step' }, g);
      S('rect', { x: 308 + i * 46, y: 150, width: 42, height: 26, rx: 6, 'class': 'vz-pill' }, s);
      txt(s, 329 + i * 46, 163, n, 'vz-t vz-xs');
      return s;
    });
    // brand safety
    S('rect', { x: 482, y: 114, width: 96, height: 72, rx: 10, 'class': 'vz-box' }, g);
    S('path', { d: 'M530 128 l14 6 v10 c0 9 -6 14 -14 17 c-8 -3 -14 -8 -14 -17 v-10 z', 'class': 'vz-shield' }, g);
    var check = S('path', { d: 'M523 144 l5 5 l9 -10', 'class': 'vz-check', pathLength: 1 }, g);
    txt(g, 530, 174, 'Brand safety', 'vz-t vz-xs');
    // router + providers
    S('rect', { x: 328, y: 236, width: 94, height: 34, rx: 8, 'class': 'vz-box' }, g);
    txt(g, 375, 253, 'Router', 'vz-t vz-s');
    var provA = S('g', { 'class': 'vz-prov' }, g); S('rect', { x: 462, y: 224, width: 132, height: 28, rx: 8, 'class': 'vz-box' }, provA); txt(provA, 528, 238, 'Azure OpenAI', 'vz-t vz-xs');
    var provB = S('g', { 'class': 'vz-prov' }, g); S('rect', { x: 462, y: 264, width: 132, height: 28, rx: 8, 'class': 'vz-box' }, provB); txt(provB, 528, 278, 'Customer-hosted model', 'vz-t vz-xs');
    // outputs
    txt(g, 660, 30, 'On-brand variants', 'vz-t vz-xs vz-m');
    var tiles = outY.map(function (y, i) {
      var t = S('g', { 'class': 'vz-tile' }, g);
      S('rect', { x: 614, y: y - 30, width: 92, height: 60, rx: 8, 'class': 'vz-box' }, t);
      S('rect', { x: 622, y: y - 22, width: 76, height: 24, rx: 4, 'class': 'vz-img v' + i }, t);
      S('rect', { x: 622, y: y + 8, width: 60, height: 5, rx: 2.5, 'class': 'vz-bar vz-bar-hi' }, t);
      S('rect', { x: 622, y: y + 17, width: 44, height: 5, rx: 2.5, 'class': 'vz-bar' }, t);
      return t;
    });
    var packet = S('circle', { r: 5, 'class': 'vz-packet' }, g);
    var outPk = outY.map(function () { return S('circle', { r: 4, 'class': 'vz-packet' }, g); });
    var pulse = S('circle', { r: 4.5, 'class': 'vz-pulse' }, g);
    var route = 0; // 0 = Azure OpenAI, 1 = customer-hosted
    function setRoute(i) { route = i; routeA.classList.toggle('on', i === 0); routeB.classList.toggle('on', i === 1); provA.classList.toggle('on', i === 0); provB.classList.toggle('on', i === 1); }
    setRoute(0);
    seg(v.ctl, 'Model route', [{ label: 'Azure OpenAI', value: 0 }, { label: 'Customer-hosted', value: 1 }], function (val) { setRoute(val); if (reduce) frame(6); });
    function along(p, f) { var L = p.getTotalLength(); return p.getPointAtLength(L * AB.clamp01(f)); }
    var T = 8;
    function frame(time) {
      var t = time % T, fade = 1 - seg01(t, 7.3, 7.9);
      g.style.opacity = fade;
      brief.style.opacity = ease(seg01(t, 0, 0.6));
      chips.forEach(function (c, i) { c.classList.toggle('on', t > 0.6 + i * 0.2); });
      ctxLinks.forEach(function (l, i) { l.style.strokeDashoffset = 1 - ease(seg01(t, 0.7 + i * 0.2, 1.4 + i * 0.2)); });
      // main packet
      var x, y = 150, show = true;
      if (t < 1.2) { x = 120; show = t > 0.6; }
      else if (t < 2.0) x = 120 + (375 - 120) * ease(seg01(t, 1.2, 2.0));
      else if (t < 4.0) x = 375;
      else if (t < 4.6) x = 375 + (530 - 375) * ease(seg01(t, 4.0, 4.6));
      else if (t < 4.9) x = 530 + (604 - 530) * seg01(t, 4.6, 4.9);
      else { show = false; x = 604; }
      packet.setAttribute('cx', x); packet.setAttribute('cy', y); packet.style.opacity = show ? 1 : 0;
      stepEls.forEach(function (s, i) { s.classList.toggle('on', t > 2.2 + i * 0.7 && t < 7.3); });
      // route pulses: one round trip per generation step
      var pr = -1;
      [2.1, 2.8, 3.5].forEach(function (s0) { if (t >= s0 && t < s0 + 0.62) pr = (t - s0) / 0.62; });
      if (pr >= 0) {
        var leg = pr < 0.5 ? pr * 2 : (1 - pr) * 2, pt;
        if (leg < 0.4) pt = along(toRouter, leg / 0.4); else pt = along(route ? routeB : routeA, (leg - 0.4) / 0.6);
        pulse.setAttribute('cx', pt.x); pulse.setAttribute('cy', pt.y); pulse.style.opacity = 1;
      } else pulse.style.opacity = 0;
      check.style.strokeDashoffset = 1 - ease(seg01(t, 4.5, 4.9));
      outPk.forEach(function (p, i) { var f = seg01(t, 4.9, 5.3 + i * 0.12); p.setAttribute('cx', 604 + 10 * f); p.setAttribute('cy', 150 + (outY[i] - 150) * ease(f)); p.style.opacity = f > 0 && f < 1 ? 1 : 0; });
      tiles.forEach(function (tl, i) { tl.classList.toggle('on', t > 5.2 + i * 0.15); });
    }
    v.run = AB.runner(el, frame, { staticT: 6, onStart: started('genstudio') });
  };

  // ---------- Layers: compact hologram on a gentle loop ----------
  builders.layers = function (el) {
    var v = shell(el, { id: 'layers', stageClass: 'viz-holo viz-lyr', note: 'Illustration of what the app does' });
    var ART = AB.LAYERS_ART, N = ART.length;
    var wrap = E('div', 'lyr-wrap', null, v.live);
    var left = E('div', 'lyr-left', null, wrap);
    var holoEl = E('div', 'holo holo-sm', null, left); holoEl.setAttribute('role', 'img');
    holoEl.setAttribute('aria-label', 'An illustrated poster made of background, light, subject and type layers.');
    var phaseEl = E('p', 'holo-phase', '', left); phaseEl.setAttribute('aria-live', 'off');
    var h = AB.holo(holoEl);
    var hls = Array.prototype.slice.call(holoEl.querySelectorAll('.hl'));
    function flat(l) { return l.src ? '<img src="' + AB.asset(l.src) + '" alt="">' : '<span class="lyr-type">' + l.text + '</span>'; }
    // Layers panel, top layer first like a design tool
    var panel = E('div', 'lyr-panel', null, wrap);
    E('p', 'lyr-k', 'Layers', panel);
    var list = E('ul', 'lyr-list', null, panel); list.setAttribute('role', 'list');
    var rows = [];
    for (var k = N - 1; k >= 0; k--) (function (i) {
      var li = E('li', null, null, list);
      var b = E('button', 'lyr-row', '<span class="lyr-thumb">' + flat(ART[i]) + '</span><span class="lyr-name">' + ART[i].name + '</span><span class="lyr-st"></span>', li);
      b.type = 'button'; b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () { setPlaying(false); inspect(i); });
      b.addEventListener('mouseenter', function () { if (!playing) select(i); });
      rows[i] = b;
    })(k);
    var prevBox = E('div', 'lyr-prev', null, panel);
    var prevK = E('p', 'lyr-k', 'Selected layer', prevBox);
    var prevArt = E('div', 'lyr-art', null, prevBox);

    var MODES = {
      compose: [
        { name: 'Empty canvas', vis: 0, sel: -1, st: { sep: 1, exp: 0 } },
        { name: 'Agent adds the background', vis: 1, sel: 0, st: { sep: 1, exp: 0 } },
        { name: 'Adds the light', vis: 2, sel: 1, st: { sep: 1, exp: 0 } },
        { name: 'Adds the subject', vis: 3, sel: 2, st: { sep: 1, exp: 0 } },
        { name: 'Adds the type', vis: 4, sel: 3, st: { sep: 1, exp: 0 } },
        { name: 'Export as an image or a video', vis: 4, sel: -1, st: { sep: 0.1, exp: 1 } }
      ],
      decompose: [
        { name: 'Flat image in', vis: 4, sel: -1, st: { sep: 0, exp: 0 } },
        { name: 'Agent splits it into layers', vis: 4, sel: -1, st: { sep: 1, exp: 0 } },
        { name: 'Layer: background', vis: 4, sel: 0, st: { sep: 1, exp: 0 } },
        { name: 'Layer: light', vis: 4, sel: 1, st: { sep: 1, exp: 0 } },
        { name: 'Layer: subject', vis: 4, sel: 2, st: { sep: 1, exp: 0 } },
        { name: 'Layer: type', vis: 4, sel: 3, st: { sep: 1, exp: 0 } },
        { name: 'Export as an image or a video', vis: 4, sel: -1, st: { sep: 0.1, exp: 1 } }
      ]
    };
    var mode = 'decompose', PH = MODES[mode], DUR = 1.9, cur = -1, playing = !reduce, offset = 0, visN = N, selI = -1;
    function select(i) {
      selI = i;
      hls.forEach(function (hl, j) { hl.classList.toggle('is-sel', j === i); hl.classList.toggle('is-dim', i >= 0 && j !== i && j < visN); });
      rows.forEach(function (r, j) { r.setAttribute('aria-pressed', String(j === i)); });
      if (i >= 0) { prevK.textContent = 'Selected layer: ' + ART[i].name; prevArt.innerHTML = flat(ART[i]); prevBox.classList.add('on'); }
      else { prevK.textContent = visN ? 'Composite' : 'Canvas'; prevArt.innerHTML = '<span class="lyr-comp">' + ART.slice(0, visN).map(flat).join('') + '</span>'; prevBox.classList.add('on'); }
    }
    function setVis(n) {
      visN = n;
      hls.forEach(function (hl, j) { hl.classList.toggle('is-off', j >= n); });
      rows.forEach(function (r, j) { r.classList.toggle('is-off', j >= n); r.querySelector('.lyr-st').textContent = j >= n ? 'pending' : ''; });
    }
    function show(i) {
      if (i === cur) return; cur = i;
      var p = PH[i]; setVis(p.vis); h.set(p.st); select(p.sel);
      phaseEl.textContent = (i + 1) + ' of ' + PH.length + ': ' + p.name;
      dotBtns.forEach(function (b, k) { b.setAttribute('aria-current', k === i ? 'step' : 'false'); });
    }
    function inspect(i) { cur = -1; setVis(N); h.set({ sep: 1, exp: 0 }); select(i); phaseEl.textContent = 'Inspecting: ' + ART[i].name; dotBtns.forEach(function (b) { b.setAttribute('aria-current', 'false'); }); }
    seg(v.ctl, 'Mode', [{ label: 'Decompose', value: 'decompose' }, { label: 'Compose', value: 'compose' }], function (m) {
      mode = m; PH = MODES[m]; buildDots(); cur = -1; if (v.run) offset = v.run.t; show(0); if (!reduce) setPlaying(true);
    });
    var play = button(v.ctl, reduce ? 'Play' : 'Pause', 'vbtn-primary layers-play');
    play.setAttribute('aria-pressed', String(playing));
    if (reduce) play.hidden = true;
    var dots = E('div', 'step-dots', null, v.ctl); dots.setAttribute('role', 'group'); dots.setAttribute('aria-label', 'Steps');
    var dotBtns = [];
    function buildDots() {
      dots.innerHTML = '';
      dotBtns = PH.map(function (p, i) {
        var b = E('button', 'step-dot', '<span class="visually-hidden">Step ' + (i + 1) + ': ' + p.name + '</span>', dots); b.type = 'button';
        b.addEventListener('click', function () { setPlaying(false); cur = -1; show(i); });
        return b;
      });
    }
    buildDots();
    function setPlaying(on) {
      playing = on; play.textContent = on ? 'Pause' : 'Play'; play.setAttribute('aria-pressed', String(on));
      if (on && v.run) offset = v.run.t - Math.max(0, cur) * DUR;
    }
    play.addEventListener('click', function () { setPlaying(!playing); });
    h.onUser = function () { setPlaying(false); };
    function frame(time) {
      if (reduce) { show(2); return; }
      if (!playing) return;
      var T = PH.length * DUR, t = ((time - offset) % T + T) % T;
      show(Math.min(PH.length - 1, Math.floor(t / DUR)));
    }
    show(reduce ? 2 : 0);
    v.run = AB.runner(el, frame, { staticT: 0, onStart: started('layers') });
  };

  // ---------- OmniGen: plan, then copy / image / video together ----------
  var BRIEFS = [
    { brief: 'Spring launch for a trail running shoe', hue: 'trail',
      heads: ['Run further on softer ground.', 'Built for the long way round.', 'Less road. More trail.'],
      bodies: ['Grip that holds on wet rock and loose dirt.', 'Cushioned for the miles after the trailhead.', 'Light enough to forget you are wearing it.'] },
    { brief: 'Weekend sale for a neighborhood coffee shop', hue: 'coffee',
      heads: ['Two coffees, one easy Saturday.', 'Your weekend starts here.', 'Half off the second cup.'],
      bodies: ['Bring a friend; the second one is on us.', 'Fresh pastries until noon, Saturday and Sunday.', 'This weekend only, at the corner shop.'] },
    { brief: 'Back-to-school bundle for a laptop bag', hue: 'school',
      heads: ['Everything you carry, sorted.', 'Ready for the first bell.', 'One bag, every class.'],
      bodies: ['A padded sleeve and pockets for the rest.', 'Bundle a bag and a case, save on both.', 'Sized for a laptop, a lunch and a lot more.'] }
  ];
  var OG_IC = {
    text: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 4h10M3 8h10M3 12h6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    img: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="3" width="12" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M2.5 11.5l3.5-3.5 3 3 2-2 2.5 2.5" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>',
    vid: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.5l8 4.5-8 4.5z" fill="currentColor"/></svg>'
  };
  // OmniGen: a planning agent makes a brief into three ad variants, generated in parallel.
  builders.omnigen = function (el) {
    var v = shell(el, { id: 'omnigen', stageClass: 'viz-og' });
    var L = v.live, N = 3;
    function card(i) {
      return '<div class="og-ad"><p class="og-vn">Variant ' + (i + 1) + '<span class="og-ok og-all">&#10003;</span></p>' +
        '<p class="og-part og-head"><i class="og-ic">' + OG_IC.text + '</i><span></span><b class="og-ok">&#10003;</b></p>' +
        '<p class="og-part og-body"><i class="og-ic">' + OG_IC.text + '</i><span></span><b class="og-ok">&#10003;</b></p>' +
        '<div class="og-img"><span></span><b class="og-ok">&#10003;</b></div>' +
        '<div class="og-vid"><i class="og-ic">' + OG_IC.vid + '</i><i class="og-tl"><b></b></i><b class="og-ok">&#10003;</b></div></div>';
    }
    L.innerHTML = '<div class="og-top"><p class="og-brief"><span class="og-k">Brief (sample)</span><span class="og-bt"></span></p>' +
      '<p class="og-status"><span class="og-dot"></span><span class="og-st">Planning agent</span></p></div>' +
      '<div class="og-set">' + [0, 1, 2].map(card).join('') + '</div>';
    var bt = L.querySelector('.og-bt'), st = L.querySelector('.og-st'), set = L.querySelector('.og-set'), top = L.querySelector('.og-top');
    var ads = Array.prototype.slice.call(L.querySelectorAll('.og-ad')).map(function (a) {
      return { el: a, head: a.querySelector('.og-head'), hs: a.querySelector('.og-head span'), body: a.querySelector('.og-body'), bs: a.querySelector('.og-body span'),
        img: a.querySelector('.og-img'), vid: a.querySelector('.og-vid'), tl: a.querySelector('.og-tl b') };
    });
    var bi = 0;
    function setBrief(i) { bi = i; bt.textContent = BRIEFS[i].brief; set.dataset.hue = BRIEFS[i].hue; }
    setBrief(0);
    var run = button(v.ctl, 'Run plan', 'vbtn-primary');
    run.addEventListener('click', function () { setBrief((bi + 1) % BRIEFS.length); if (v.run) v.run.t = 0; frame(reduce ? 7 : 0); });
    var T = 9.2, last = '';
    function type(elm, str, f) { var tx = str.slice(0, Math.round(str.length * AB.clamp01(f))); if (elm.textContent !== tx) elm.textContent = tx; }
    function frame(time) {
      var t = time % T, B = BRIEFS[bi];
      L.style.opacity = (0.25 + 0.75 * (1 - seg01(t, 8.6, 9.15))).toFixed(3);
      top.classList.toggle('on', t > 0.1);
      var allDone = true;
      ads.forEach(function (a, i) {
        var s0 = 0.9 + i * 0.2;                      // staggered starts read as parallel work
        var fh = seg01(t, s0, s0 + 0.9), fb = seg01(t, s0 + 1.0, s0 + 1.9), fi = t > s0 + 2.0, fv = seg01(t, s0 + 2.3, s0 + 3.9);
        a.el.classList.toggle('on', t > s0 - 0.1);
        type(a.hs, B.heads[i], fh); type(a.bs, B.bodies[i], fb);
        a.head.classList.toggle('done', fh >= 1); a.body.classList.toggle('done', fb >= 1);
        a.img.classList.toggle('on', fi); a.img.classList.toggle('done', t > s0 + 2.5);
        a.tl.style.transform = 'scaleX(' + fv.toFixed(3) + ')';
        a.vid.classList.toggle('on', t > s0 + 2.2); a.vid.classList.toggle('done', fv >= 1);
        var d = fv >= 1; a.el.classList.toggle('done', d); if (!d) allDone = false;
      });
      var msg = t < 0.8 ? 'Planning agent: deciding audience, message and 3 variants' : !allDone ? 'Planning agent → 3 variants, generating in parallel' : 'Ad set ready, 3 variants';
      if (msg !== last) { st.textContent = msg; last = msg; }
      L.classList.toggle('og-ready', allDone);
    }
    v.run = AB.runner(el, frame, { staticT: 7, onStart: started('omnigen') });
  };

  // ---------- Coding-agent skills: a console where a skill runs, then teammates pick it up ----------
  var SKILLS = {
    '/investigate': { lines: ['/investigate checkout timeout (sample)', 'Reading the repo map and runbooks', 'Searching recent logs for the failing request', 'Tracing the call path through the service', 'Likely cause: a downstream call with no timeout'],
      sum: 'Add a timeout and retry, plus a test that reproduces it.' },
    '/review': { lines: ['/review current branch', 'Loading team conventions from the shared wiki', 'Checking error handling and async usage', 'Checking that tests cover the new path', 'Two suggestions, no blockers (sample)'],
      sum: 'Ready for a human reviewer, with two small suggestions.' },
    '/onboard': { lines: ['/onboard', 'Mapping the repository and its services', 'Linking the wiki page for each service', 'Collecting the run and test commands', 'Picking a starter task from the list'],
      sum: 'Local setup, key services and a first task, in one place.' }
  };
  builders.skills = function (el) {
    var v = shell(el, { id: 'skills', stageClass: 'viz-sk' });
    var L = v.live;
    L.innerHTML = '<div class="sk-con"><div class="sk-top"><i></i><i></i><i></i><span>agent console</span></div><div class="sk-lines"></div><div class="sk-sum"><b>Summary</b><span></span></div></div>' +
      '<div class="sk-team"><p class="og-k">Shared with the team</p>' + [0, 1, 2].map(function (i) {
        return '<div class="sk-mate"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="19" class="sk-ring"/><circle cx="20" cy="16" r="6.5" class="sk-head"/><path d="M8 34c2-7 7-10 12-10s10 3 12 10" class="sk-head"/></svg><span class="sk-who">Teammate ' + 'ABC'[i] + '</span><span class="sk-st">idle</span></div>';
      }).join('') + '</div>';
    var linesEl = L.querySelector('.sk-lines'), sumEl = L.querySelector('.sk-sum'), sumTxt = sumEl.querySelector('span'), mates = L.querySelectorAll('.sk-mate');
    var names = Object.keys(SKILLS), cur = 0, userPicked = false, lineEls = [];
    function setSkill(i) {
      cur = i; linesEl.innerHTML = '';
      lineEls = SKILLS[names[i]].lines.map(function (s, j) { var p = E('p', j === 0 ? 'cmd' : '', '', linesEl); p.dataset.full = s; return p; });
      sumTxt.textContent = SKILLS[names[i]].sum;
    }
    setSkill(0);
    var picker = seg(v.ctl, 'Skill', names.map(function (n, i) { return { label: n, value: i }; }), function (val) { userPicked = true; setSkill(val); if (v.run) v.run.t = 0; frame(reduce ? 7 : 0); });
    var T = 9.5, lastLoop = 0;
    function frame(time) {
      var loopN = Math.floor(time / T), t = time % T;
      if (loopN !== lastLoop) { lastLoop = loopN; if (!userPicked) { setSkill((cur + 1) % names.length); picker.set(cur); } }
      lineEls.forEach(function (p, j) {
        var s0 = 0.3 + j * 0.75, full = p.dataset.full, txt;
        if (j === 0) txt = '$ ' + full.slice(0, Math.round(full.length * seg01(t, s0, s0 + 0.7)));
        else txt = t > s0 ? (j === lineEls.length - 1 ? '✓ ' : '› ') + full : '';
        if (p.textContent !== txt) p.textContent = txt;
        p.classList.toggle('last', j === lineEls.length - 1);
      });
      sumEl.classList.toggle('on', t > 3.9 && t < 9.1);
      mates.forEach(function (m, i) {
        var on = t > 5 + i * 0.6 && t < 9.1;
        m.classList.toggle('on', on);
        var st = on ? 'using ' + names[cur] : 'idle';
        var stEl = m.querySelector('.sk-st'); if (stEl.textContent !== st) stEl.textContent = st;
      });
    }
    v.run = AB.runner(el, frame, { staticT: 7, onStart: started('skills') });
  };

  // ---------- SDKs: plugin-based core, extensions snapping in, devices emitting events ----------
  builders.sdks = function (el) {
    var v = shell(el, { id: 'sdks' });
    var svg = S('svg', { viewBox: '0 0 720 330', 'class': 'vz', role: 'img', 'aria-label': 'A plugin-based SDK core with analytics, media, identity and consent extensions. Phones and TVs send event pulses through the core to the cloud. Turning an extension off stops its events.' }, v.live);
    var g = S('g', null, svg), CORE = [360, 182];
    // cloud
    S('path', { d: 'M318 62 a20 20 0 0 1 8 -38 a26 26 0 0 1 48 -6 a20 20 0 0 1 30 18 a18 18 0 0 1 -6 26 z', 'class': 'vz-box vz-strong' }, g);
    txt(g, 362, 44, 'Cloud', 'vz-t vz-s');
    S('path', { d: 'M360 150 V66', 'class': 'vz-wire' }, g);
    // devices
    var DEV = [
      { id: 'ios', label: 'iOS', x: 70, y: 96, kind: 'phone' }, { id: 'android', label: 'Android', x: 70, y: 252, kind: 'phone' },
      { id: 'roku', label: 'Roku', x: 650, y: 96, kind: 'tv' }, { id: 'vega', label: 'Fire TV (Vega OS)', x: 650, y: 252, kind: 'tv' }];
    DEV.forEach(function (d) {
      var dg = S('g', null, g);
      if (d.kind === 'phone') { S('rect', { x: d.x - 18, y: d.y - 32, width: 36, height: 64, rx: 7, 'class': 'vz-box vz-strong' }, dg); S('path', { d: 'M' + (d.x - 6) + ' ' + (d.y - 25) + ' h12', 'class': 'vz-wire' }, dg); }
      else { S('rect', { x: d.x - 38, y: d.y - 25, width: 76, height: 46, rx: 4, 'class': 'vz-box vz-strong' }, dg); S('path', { d: 'M' + (d.x - 12) + ' ' + (d.y + 28) + ' h24', 'class': 'vz-wire' }, dg); }
      txt(dg, d.x, d.y + 48, d.label, 'vz-t vz-xs vz-m');
      d.path = S('path', { d: 'M' + (d.x + (d.kind === 'phone' ? 22 : -42)) + ' ' + d.y + ' C' + (d.x < 360 ? 210 : 510) + ' ' + d.y + ' ' + (d.x < 360 ? 250 : 470) + ' ' + CORE[1] + ' ' + (d.x < 360 ? 296 : 424) + ' ' + CORE[1], 'class': 'vz-wire' }, g);
    });
    // extensions
    var EXT = [
      { id: 'analytics', label: 'Analytics', x: 230, y: 132, dx: -1, color: 'c-ice' }, { id: 'media', label: 'Media', x: 490, y: 132, dx: 1, color: 'c-warm' },
      { id: 'identity', label: 'Identity', x: 230, y: 232, dx: -1, color: 'c-vio' }, { id: 'consent', label: 'Consent', x: 490, y: 232, dx: 1, color: 'c-mint' }];
    EXT.forEach(function (x) {
      x.on = true;
      x.g = S('g', { 'class': 'vz-ext ' + x.color }, g);
      S('rect', { x: x.x - 48, y: x.y - 15, width: 96, height: 30, rx: 8, 'class': 'vz-box' }, x.g);
      S('circle', { cx: x.x - 34, cy: x.y, r: 4, 'class': 'vz-dot' }, x.g);
      txt(x.g, x.x + 6, x.y, x.label, 'vz-t vz-xs');
    });
    S('rect', { x: 296, y: 150, width: 128, height: 64, rx: 12, 'class': 'vz-box vz-core' }, g);
    txt(g, 360, 175, 'SDK core', 'vz-t');
    txt(g, 360, 194, 'plugin-based', 'vz-t vz-xs vz-m');
    var up = S('path', { d: 'M360 150 V66', 'class': 'vz-none' }, g);
    // pulses
    var pool = [], R = AB.rng(42);
    for (var i = 0; i < 36; i++) pool.push({ el: S('circle', { r: 4, 'class': 'vz-ev', opacity: 0 }, g), live: false });
    var nextSpawn = 0, lastT = 0;
    function enabledTypes() { return EXT.filter(function (x) { return x.on; }); }
    function spawn(t) {
      var types = enabledTypes(); if (!types.length) return;
      var p = pool.filter(function (q) { return !q.live; })[0]; if (!p) return;
      p.live = true; p.t0 = t; p.dev = DEV[Math.floor(R() * DEV.length)]; p.type = types[Math.floor(R() * types.length)];
      p.el.setAttribute('class', 'vz-ev ' + p.type.color);
    }
    function place(p, t) {
      var age = t - p.t0, pt;
      if (age < 1) { var L1 = p.dev.path.getTotalLength(); pt = p.dev.path.getPointAtLength(L1 * ease(age)); }
      else if (age < 1.7) { var L2 = up.getTotalLength(); pt = up.getPointAtLength(L2 * ((age - 1) / 0.7)); }
      else { p.live = false; p.el.setAttribute('opacity', 0); return; }
      p.el.setAttribute('cx', pt.x); p.el.setAttribute('cy', pt.y); p.el.setAttribute('opacity', age > 1.55 ? (1.7 - age) / 0.15 : 1);
    }
    function frame(time) {
      if (time < lastT) { pool.forEach(function (p) { p.live = false; p.el.setAttribute('opacity', 0); }); nextSpawn = time; }
      lastT = time;
      EXT.forEach(function (x, i) {
        var dock = AB.smooth(0.2 + i * 0.25, 0.9 + i * 0.25, time);
        var off = x.on ? 0 : 1;
        x.cur = x.cur == null ? off : x.cur + (off - x.cur) * 0.12;
        var shift = (1 - dock) * 60 * x.dx + x.cur * 34 * x.dx;
        x.g.setAttribute('transform', 'translate(' + shift.toFixed(1) + ' 0)');
        x.g.style.opacity = (0.25 + 0.75 * dock) * (1 - 0.65 * x.cur);
      });
      if (time > 1.4) while (nextSpawn <= time) { spawn(nextSpawn); nextSpawn += 0.28; }
      pool.forEach(function (p) { if (p.live) place(p, time); });
    }
    function staticFrame() {
      EXT.forEach(function (x) { x.cur = x.on ? 0 : 1; x.g.setAttribute('transform', 'translate(' + (x.on ? 0 : 34 * x.dx) + ' 0)'); x.g.style.opacity = x.on ? 1 : 0.35; });
      pool.forEach(function (p) { p.live = false; p.el.setAttribute('opacity', 0); });
      var types = enabledTypes(); if (!types.length) return;
      [[0, 0.3], [1, 0.55], [2, 0.75], [3, 0.4], [0, 1.25], [2, 1.4]].forEach(function (s, k) {
        var p = pool[k]; p.live = true; p.t0 = -s[1]; p.dev = DEV[s[0]]; p.type = types[k % types.length]; p.el.setAttribute('class', 'vz-ev ' + p.type.color); place(p, 0);
      });
    }
    // controls: toggle each extension
    var grp = E('div', 'seg', '<span class="seg-l">Extensions</span>', v.ctl); grp.setAttribute('role', 'group'); grp.setAttribute('aria-label', 'Extensions');
    EXT.forEach(function (x) {
      var b = E('button', 'tog ' + x.color, '<i></i>' + x.label, grp); b.type = 'button'; b.setAttribute('aria-pressed', 'true');
      b.addEventListener('click', function () { x.on = !x.on; b.setAttribute('aria-pressed', String(x.on)); if (reduce) staticFrame(); });
    });
    v.run = AB.runner(el, reduce ? staticFrame : frame, { staticT: 0, onStart: started('sdks') });
  };

  // ---------- Voyager: side-by-side model comparison plus a sample load-test sparkline ----------
  var PROMPTS = [
    { p: 'Summarize this product description in one sentence.', a: 'A lightweight trail shoe with a grippy sole and a breathable upper, built for long runs on rough ground.', b: 'Lightweight, grippy and breathable: a trail shoe for long, rough runs.', la: '1.4 s', lb: '0.9 s' },
    { p: 'Write a friendly subject line for a weekend sale.', a: 'Your weekend just got better: the sale starts now.', b: 'Saturday plans? Our weekend sale is on.', la: '0.8 s', lb: '0.6 s' },
    { p: 'Classify this ticket: "The app logs me out every hour."', a: 'Category: authentication. Likely cause: a short session timeout. Priority: medium.', b: 'Auth issue (session expiry). Medium priority.', la: '1.1 s', lb: '0.7 s' }
  ];
  builders.voyager = function (el) {
    var v = shell(el, { id: 'voyager', stageClass: 'viz-vy' });
    var L = v.live;
    L.innerHTML = '<div class="vy-rail" role="list" aria-label="Workbench tools">' + ['API test', 'Load test', 'LLM council', 'Compare'].map(function (n) { return '<span role="listitem" class="vy-tool" data-t="' + n + '">' + n + '</span>'; }).join('') +
      '<span class="vy-hist"><b class="vy-saved">Run saved to history</b><span class="vy-rep">Export report</span></span></div>' +
      '<div class="vy-prompt"><span class="og-k">Prompt (sample)</span><p></p></div>' +
      '<div class="vy-panes">' + ['Model A', 'Model B'].map(function (n) { return '<div class="vy-pane"><div class="vy-h"><b>' + n + '</b><span class="vy-lat"></span></div><p class="vy-out"></p></div>'; }).join('') + '</div>' +
      '<div class="vy-load"><div class="vy-lh"><span class="og-k">Load test (sample)</span><span class="vy-u">requests per second, sample data</span></div><svg viewBox="0 0 600 70" preserveAspectRatio="none" aria-hidden="true"><path class="vy-area"/><path class="vy-line"/></svg></div>';
    var pEl = L.querySelector('.vy-prompt p'), outs = L.querySelectorAll('.vy-out'), lats = L.querySelectorAll('.vy-lat');
    var line = L.querySelector('.vy-line'), area = L.querySelector('.vy-area');
    var tools = L.querySelectorAll('.vy-tool'), hist = L.querySelector('.vy-hist');
    var pi = 0;
    function setPrompt(i) { pi = i; pEl.textContent = PROMPTS[i].p; }
    setPrompt(0);
    var swap = button(v.ctl, 'Swap prompt', 'vbtn-primary');
    swap.addEventListener('click', function () { setPrompt((pi + 1) % PROMPTS.length); if (v.run) v.run.t = 0; frame(reduce ? 5 : 0); });
    var N = 60;
    function load(x) { return 0.55 + 0.22 * Math.sin(x * 0.21) + 0.12 * Math.sin(x * 0.73 + 1) + 0.06 * Math.sin(x * 1.9); }
    var T = 7;
    function frame(time) {
      var t = time % T, P = PROMPTS[pi];
      [P.a, P.b].forEach(function (s, i) {
        var words = s.split(' '), dur = i === 0 ? 2.6 : 1.8, n = Math.round(words.length * seg01(t, 0.3, 0.3 + dur));
        var txt = words.slice(0, n).join(' ');
        if (outs[i].textContent !== txt) outs[i].textContent = txt;
        outs[i].classList.toggle('typing', n < words.length && t > 0.3);
        var lt = t > 0.3 + dur ? (i === 0 ? P.la : P.lb) + ' (sample)' : '';
        if (lats[i].textContent !== lt) lats[i].textContent = lt;
      });
      tools.forEach(function (tl) { var n = tl.dataset.t; tl.classList.toggle('on', (n === 'Compare' && t < 3.4) || (n === 'Load test' && t >= 3.4 && t < 5.6)); });
      hist.classList.toggle('on', t >= 5.4);
      var off = time * 6, d = '', a = '';
      for (var k = 0; k <= N; k++) {
        var x = k * 600 / N, y = 66 - load(k + off * 0.5) * 60;
        d += (k ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
      }
      a = d + 'L600 70 L0 70 Z';
      line.setAttribute('d', d); area.setAttribute('d', a);
    }
    v.run = AB.runner(el, frame, { staticT: 5, onStart: started('voyager') });
  };

  AB.buildViz = function (el) { var b = builders[el.dataset.viz]; if (b && !el._built) { el._built = true; curEl = el; b(el); curEl = null; } };
  document.querySelectorAll('.viz[data-viz]').forEach(AB.buildViz);
})();
