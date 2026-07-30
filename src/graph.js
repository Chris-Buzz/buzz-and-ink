/* ── Buzz & Ink · knowledge graph (v0.7) ─────────────────────────────────────
   A force-directed knowledge graph on <canvas>, inked entirely by the live
   CSS tokens — it re-colors itself when data-theme / data-accent / any voice
   flips, with zero re-init. Zero dependencies.

     import { knowledgeGraph } from 'buzz-and-ink/graph'
     const g = knowledgeGraph(document.querySelector('#graph'), {
       nodes: [{ id:'tokens', label:'tokens', group:'foundation', hub:true }, …],
       edges: [{ from:'tokens', to:'button' },
               { from:'fraunces', to:'bricolage', kind:'soft' },   // dashed affinity
               { from:'tokens', to:'waggle', accent:true }],       // brand relation
       onSelect: n => console.log(n),
     })
     g.filter('motion')   // highlight matches, veil the rest → returns count
     g.fit(); g.zoomIn(); g.destroy()

   Interactions: hover = spotlight node + neighbors · drag node = re-pin ·
   drag canvas = pan · wheel / pinch = zoom · click = select · dblclick = fit.
   Respects prefers-reduced-motion: layout settles instantly, no idle drift.
──────────────────────────────────────────────────────────────────────────── */

export function knowledgeGraph(container, opts = {}) {
  const o = {
    nodes: [], edges: [],
    labels: 'hubs',          // 'hubs' | 'all' | 'hover'
    hubDegree: 7,            // degree at which a node auto-promotes to hub
    wheelZoom: true,
    idleDrift: true,         // gentle breathing while parked (off under RM)
    grid: true,              // faint world-space dot grid
    tones: null,             // {group: '--bi-token' | '#hex'} → per-group node color
    onSelect: null,
    onHover: null,
    ...opts,
  };

  container.classList.add('bi-graph');
  const canvas = document.createElement('canvas');
  container.prepend(canvas);                      // HUD children stay above
  const ctx = canvas.getContext('2d');
  const rmq = matchMedia('(prefers-reduced-motion: reduce)');

  /* ── colors — read from the cascade so every voice/theme flip re-inks ──── */
  const norm = document.createElement('canvas').getContext('2d');
  const rgb = (css) => {
    norm.fillStyle = '#000'; norm.fillStyle = css;
    const s = norm.fillStyle;
    if (s[0] === '#') return [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];
    const m = s.match(/[\d.]+/g) || [0, 0, 0];
    return [+m[0], +m[1], +m[2]];
  };
  let C = {}, T = {}, mono = 'ui-monospace,monospace';
  const recolor = () => {
    const cs = getComputedStyle(container);
    const v = (name, fb) => cs.getPropertyValue(name).trim() || fb;
    C = {
      node:   rgb(v('--bi-text-2', '#6E6350')),   // resting ink
      strong: rgb(v('--bi-text',   '#221D14')),   // hubs + neighbors
      edge:   rgb(v('--bi-text-3', '#8A8172')),   // edges (drawn at low alpha)
      line:   rgb(v('--bi-line',   '#E4DCC9')),   // dot grid
      accent: rgb(v('--bi-accent', '#D9701E')),   // active only
    };
    T = {};                                       // group tones, re-read live
    for (const [g, tone] of Object.entries(o.tones || {}))
      T[g] = rgb(tone.startsWith('--') ? v(tone, '#8A8172') : tone);
    mono = v('--bi-font-mono', mono);
    dirty = true;
  };
  const paint = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

  /* ── data ──────────────────────────────────────────────────────────────── */
  let nodes = [], edges = [], byId = new Map(), nbr = new Map();
  let W = 0, H = 0, dpr = 1;
  let view = { k: 1, x: 0, y: 0 }, viewTarget = null, userMoved = false;
  let hoverId = null, selectedId = null, filterSet = null;
  let awake = true, calm = 0, dirty = true, raf = 0;

  const setData = ({ nodes: ns = [], edges: es = [] }) => {
    byId = new Map(); nbr = new Map();
    const deg = new Map();
    es.forEach(e => { deg.set(e.from, (deg.get(e.from) || 0) + 1); deg.set(e.to, (deg.get(e.to) || 0) + 1); });
    nodes = ns.map((n, i) => {
      const d = deg.get(n.id) || 0;
      const hub = n.hub || d >= o.hubDegree;
      const node = {
        ...n, deg: d, hub,
        r: n.size || (hub ? 4.6 + Math.sqrt(d) * .38 : 2.2 + Math.sqrt(d) * .5),
        x: 0, y: 0, vx: 0, vy: 0, fx: null, fy: null,
        dr: 0, phase: (i * 2.399963) % (Math.PI * 2),   // golden-angle drift phase
      };
      node.dr = node.r;
      byId.set(n.id, node);
      return node;
    });
    edges = es.filter(e => byId.has(e.from) && byId.has(e.to));
    edges.forEach(e => {
      if (!nbr.has(e.from)) nbr.set(e.from, new Set());
      if (!nbr.has(e.to)) nbr.set(e.to, new Set());
      nbr.get(e.from).add(e.to); nbr.get(e.to).add(e.from);
    });
    place();
    awake = true; calm = 0;
    if (rmq.matches) settle(900); else settle(150);   // open composed, not exploding
    fit(false);
  };

  // hubs ring the center; leaves burst around their hub (his dandelion look)
  const place = () => {
    const hubs = nodes.filter(n => n.hub);
    hubs.forEach((h, i) => {
      const a = (i / Math.max(hubs.length, 1)) * Math.PI * 2 - Math.PI / 2;
      h.x = Math.cos(a) * 150; h.y = Math.sin(a) * 110;
    });
    let ring = 0;
    nodes.forEach(n => {
      if (n.hub) return;
      const anchor = [...(nbr.get(n.id) || [])].map(id => byId.get(id)).find(m => m && m.hub);
      if (anchor) {
        const a = n.phase * 3 + anchor.x;                       // deterministic spread
        n.x = anchor.x + Math.cos(a) * 46; n.y = anchor.y + Math.sin(a) * 46;
      } else {
        const a = ring * 2.399963; const rr = 90 + 7 * Math.sqrt(++ring);
        n.x = Math.cos(a) * rr; n.y = Math.sin(a) * rr;
      }
    });
  };

  /* ── physics — O(n²) repulsion + springs + soft centering, then sleep ──── */
  const tick = () => {
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        let dx = a.x - b.x, dy = a.y - b.y;
        let d2 = dx * dx + dy * dy;
        if (d2 < 1) { d2 = 1; dx = .7; dy = .3; }
        if (d2 > 32000) continue;
        const f = 620 / d2;
        const d = Math.sqrt(d2), ux = dx / d, uy = dy / d;
        a.vx += ux * f; a.vy += uy * f;
        b.vx -= ux * f; b.vy -= uy * f;
      }
    }
    for (const e of edges) {
      const a = byId.get(e.from), b = byId.get(e.to);
      const dx = b.x - a.x, dy = b.y - a.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      // varied leaf distances make bursts read organic, not geometric
      const leaf = a.hub !== b.hub ? (a.hub ? b : a) : null;
      const rest = leaf ? 34 + (leaf.phase / (Math.PI * 2)) * 26
                        : (a.hub && b.hub) ? 190 : 58;
      const f = (d - rest) * .026 * (e.strength || 1) * (e.kind === 'soft' ? .35 : 1) / d;
      a.vx += dx * f; a.vy += dy * f;
      b.vx -= dx * f; b.vy -= dy * f;
    }
    let energy = 0;
    for (const n of nodes) {
      n.vx -= n.x * .0035; n.vy -= n.y * .0035;      // soft gravity to origin
      n.vx *= .82; n.vy *= .82;
      if (n.fx != null) { n.x = n.fx; n.y = n.fy; n.vx = n.vy = 0; continue; }
      const v = Math.min(Math.hypot(n.vx, n.vy), 7);
      const s = v / (Math.hypot(n.vx, n.vy) || 1);
      n.x += n.vx * s; n.y += n.vy * s;
      energy += n.vx * n.vx + n.vy * n.vy;
    }
    if (energy < .0012 * nodes.length) { if (++calm > 26) awake = false; }
    else calm = 0;
  };
  const settle = (max) => { for (let i = 0; i < max && awake; i++) tick(); };

  /* ── focus model: filter ▸ hover ▸ selection ───────────────────────────── */
  const spotlight = (id) => {
    const s = new Set([id]);
    (nbr.get(id) || []).forEach(n => s.add(n));
    return s;
  };
  const focusState = () => {
    if (filterSet) return { set: filterSet, root: null };
    if (hoverId != null) return { set: spotlight(hoverId), root: hoverId };
    if (selectedId != null) return { set: spotlight(selectedId), root: selectedId };
    return { set: null, root: null };
  };

  /* ── draw ──────────────────────────────────────────────────────────────── */
  const draw = () => {
    const { k, x, y } = view;
    const t = performance.now() / 1000;
    const drifting = o.idleDrift && !rmq.matches && !document.hidden;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.setTransform(dpr * k, 0, 0, dpr * k, dpr * x, dpr * y);

    const wx0 = -x / k, wy0 = -y / k, wx1 = (W - x) / k, wy1 = (H - y) / k;
    if (o.grid && k > .45) {
      ctx.fillStyle = paint(C.line, .38);
      const s = 56, d = 1.2 / k;
      for (let gx = Math.floor(wx0 / s) * s; gx < wx1; gx += s)
        for (let gy = Math.floor(wy0 / s) * s; gy < wy1; gy += s)
          ctx.fillRect(gx - d / 2, gy - d / 2, d, d);
    }

    const { set: focus, root } = focusState();
    const wob = (n) => drifting ? Math.sin(t * .7 + n.phase) * 1 : 0;
    const wobY = (n) => drifting ? Math.cos(t * .6 + n.phase * 1.7) * 1 : 0;

    for (const e of edges) {
      const a = byId.get(e.from), b = byId.get(e.to);
      const onRoot = root != null && (e.from === root || e.to === root);
      const inF = !focus || (focus.has(e.from) && focus.has(e.to)) || onRoot;
      const col = (e.accent || onRoot) ? C.accent : C.edge;
      let alpha = focus ? (onRoot ? .9 : inF ? .55 : .04) : (e.accent ? .65 : .26);
      ctx.strokeStyle = paint(col, alpha);
      ctx.lineWidth = (onRoot ? 1.2 : .75) / k;
      ctx.setLineDash(e.kind === 'soft' ? [2.5 / k, 4.5 / k] : []);
      ctx.beginPath();
      ctx.moveTo(a.x + wob(a), a.y + wobY(a));
      ctx.lineTo(b.x + wob(b), b.y + wobY(b));
      ctx.stroke();
    }
    ctx.setLineDash([]);

    for (const n of nodes) {
      const isRoot = n.id === root;
      const isMatch = filterSet ? filterSet.has(n.id) : false;
      const inF = !focus || focus.has(n.id);
      const target = n.r * (isRoot ? 1.5 : (focus && inF && !filterSet) ? 1.14 : 1);
      n.dr += (target - n.dr) * .22;
      if (Math.abs(target - n.dr) > .05) dirty = true;
      const nx = n.x + wob(n), ny = n.y + wobY(n);
      const tone = T[n.group];
      const col = (isRoot || isMatch) ? C.accent
        : tone || ((focus && inF && !filterSet) ? C.strong : n.hub ? C.strong : C.node);
      if (isRoot || isMatch) {                                   // soft halo
        ctx.fillStyle = paint(C.accent, .12);
        ctx.beginPath(); ctx.arc(nx, ny, n.dr + 6, 0, 7); ctx.fill();
      }
      ctx.fillStyle = paint(col, inF ? (n.hub ? .95 : .8) : .13);
      ctx.beginPath(); ctx.arc(nx, ny, n.dr, 0, 7); ctx.fill();
      if (n.hub) {
        ctx.strokeStyle = paint(col, (inF ? .35 : .08));
        ctx.lineWidth = .9 / k;
        ctx.beginPath(); ctx.arc(nx, ny, n.dr + 2.6, 0, 7); ctx.stroke();
      }
      if (n.id === selectedId) {
        ctx.strokeStyle = paint(C.accent, .85);
        ctx.lineWidth = 1.2 / k;
        ctx.beginPath(); ctx.arc(nx, ny, n.dr + 3.5, 0, 7); ctx.stroke();
      }
    }

    // labels — screen-space so they never blur or scale away
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = `500 10px ${mono}`;
    ctx.textBaseline = 'middle';
    let budget = 48;
    for (const n of nodes) {
      const isRoot = n.id === root;
      const isMatch = filterSet ? filterSet.has(n.id) : false;
      const inF = !focus || focus.has(n.id);
      const show =
        isRoot || isMatch || n.id === selectedId ||
        (o.labels === 'all' && inF) ||
        (o.labels === 'hubs' && n.hub && inF) ||
        (focus && !filterSet && inF);
      if (!show || !n.label || budget-- <= 0) continue;
      const sx = n.x * k + x, sy = n.y * k + y;
      if (sx < -80 || sx > W / dpr + 80 || sy < -20 || sy > H / dpr + 20) continue;
      ctx.fillStyle = paint(isRoot || isMatch ? C.accent : C.strong, isRoot || isMatch ? 1 : n.hub ? .8 : .62);
      ctx.fillText(n.label, sx + n.dr * k + 6, sy + .5);
    }
  };

  /* ── loop — physics only while awake, draw only while dirty ────────────── */
  const loop = () => {
    raf = requestAnimationFrame(loop);
    if (awake) { tick(); dirty = true; }
    if (o.idleDrift && !rmq.matches && !document.hidden) dirty = true;
    if (viewTarget) {
      view.k += (viewTarget.k - view.k) * .2;
      view.x += (viewTarget.x - view.x) * .2;
      view.y += (viewTarget.y - view.y) * .2;
      if (Math.abs(viewTarget.k - view.k) < .002 &&
          Math.abs(viewTarget.x - view.x) < .5 && Math.abs(viewTarget.y - view.y) < .5) {
        view = { ...viewTarget }; viewTarget = null;
      }
      dirty = true;
    }
    if (dirty) { dirty = false; draw(); }
  };

  /* ── view control ──────────────────────────────────────────────────────── */
  const bounds = () => {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const n of nodes) {
      x0 = Math.min(x0, n.x - n.r); y0 = Math.min(y0, n.y - n.r);
      x1 = Math.max(x1, n.x + n.r); y1 = Math.max(y1, n.y + n.r);
    }
    return nodes.length ? { x0, y0, x1, y1 } : { x0: -100, y0: -100, x1: 100, y1: 100 };
  };
  const goTo = (t, animate) => {
    if (animate && !rmq.matches) viewTarget = t;
    else { view = t; viewTarget = null; }
    dirty = true;
  };
  const fit = (animate = true) => {
    const b = bounds(), pad = 56;
    const w = W / dpr, h = H / dpr;
    const k = Math.max(.35, Math.min((w - pad * 2) / (b.x1 - b.x0), (h - pad * 2) / (b.y1 - b.y0), 1.6));
    goTo({ k, x: w / 2 - k * (b.x0 + b.x1) / 2, y: h / 2 - k * (b.y0 + b.y1) / 2 }, animate);
  };
  const center = () => {
    const b = bounds(), w = W / dpr, h = H / dpr, k = viewTarget ? viewTarget.k : view.k;
    goTo({ k, x: w / 2 - k * (b.x0 + b.x1) / 2, y: h / 2 - k * (b.y0 + b.y1) / 2 }, true);
  };
  const zoomBy = (f) => {
    const cur = viewTarget || view;
    const k = Math.max(.35, Math.min(cur.k * f, 3.2));
    const w = W / (2 * dpr), h = H / (2 * dpr);
    goTo({ k, x: w - (w - cur.x) * (k / cur.k), y: h - (h - cur.y) * (k / cur.k) }, true);
    userMoved = true;
  };

  /* ── input ─────────────────────────────────────────────────────────────── */
  const toWorld = (sx, sy) => [(sx - view.x) / view.k, (sy - view.y) / view.k];
  const pick = (sx, sy) => {
    const [wx, wy] = toWorld(sx, sy);
    let best = null, bd = 1e9;
    for (const n of nodes) {
      const d = Math.hypot(n.x - wx, n.y - wy);
      if (d < n.r + 5 / view.k && d < bd) { best = n; bd = d; }
    }
    return best;
  };
  const local = (ev) => {
    const r = canvas.getBoundingClientRect();
    return [ev.clientX - r.left, ev.clientY - r.top];
  };

  const pointers = new Map();
  let dragNode = null, panning = false, moved = 0, pinchBase = null;

  const onDown = (ev) => {
    canvas.setPointerCapture(ev.pointerId);
    const [sx, sy] = local(ev);
    pointers.set(ev.pointerId, { sx, sy });
    moved = 0;
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinchBase = { d: Math.hypot(a.sx - b.sx, a.sy - b.sy), k: view.k };
      if (dragNode) { dragNode.fx = dragNode.fy = null; dragNode = null; }
      panning = false;
      return;
    }
    const n = pick(sx, sy);
    if (n) { dragNode = n; n.fx = n.x; n.fy = n.y; }
    else { panning = true; container.classList.add('bi-graph--panning'); }
    viewTarget = null;
  };
  const onMove = (ev) => {
    const [sx, sy] = local(ev);
    const p = pointers.get(ev.pointerId);
    if (pinchBase && pointers.size === 2 && p) {
      p.sx = sx; p.sy = sy;
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.sx - b.sx, a.sy - b.sy);
      const mx = (a.sx + b.sx) / 2, my = (a.sy + b.sy) / 2;
      const k = Math.max(.35, Math.min(pinchBase.k * (d / pinchBase.d), 3.2));
      view.x = mx - (mx - view.x) * (k / view.k);
      view.y = my - (my - view.y) * (k / view.k);
      view.k = k; userMoved = true; dirty = true;
      return;
    }
    if (dragNode && p) {
      const [wx, wy] = toWorld(sx, sy);
      dragNode.fx = wx; dragNode.fy = wy;
      moved += Math.abs(sx - p.sx) + Math.abs(sy - p.sy);
      p.sx = sx; p.sy = sy;
      awake = true; calm = 0; userMoved = true;
      return;
    }
    if (panning && p) {
      view.x += sx - p.sx; view.y += sy - p.sy;
      moved += Math.abs(sx - p.sx) + Math.abs(sy - p.sy);
      p.sx = sx; p.sy = sy;
      userMoved = true; dirty = true;
      return;
    }
    const n = pick(sx, sy);                                     // pure hover
    const id = n ? n.id : null;
    if (id !== hoverId) {
      hoverId = id;
      container.classList.toggle('bi-graph--node', !!n);
      if (o.onHover) o.onHover(n ? byId.get(id) : null);
      dirty = true;
    }
  };
  const onUp = (ev) => {
    pointers.delete(ev.pointerId);
    if (pointers.size < 2) pinchBase = null;
    if (dragNode) {
      if (moved < 5) select(dragNode.id === selectedId ? null : dragNode.id);
      dragNode.fx = dragNode.fy = null;
      dragNode = null; awake = true; calm = 0;
    } else if (panning && moved < 5) select(null);
    panning = false;
    container.classList.remove('bi-graph--panning');
  };
  const onLeave = () => {
    if (hoverId != null) { hoverId = null; container.classList.remove('bi-graph--node'); dirty = true; }
    if (o.onHover) o.onHover(null);
  };
  const onWheel = (ev) => {
    if (!o.wheelZoom) return;
    ev.preventDefault();
    const [sx, sy] = local(ev);
    const k = Math.max(.35, Math.min(view.k * Math.exp(-ev.deltaY * .0016), 3.2));
    view.x = sx - (sx - view.x) * (k / view.k);
    view.y = sy - (sy - view.y) * (k / view.k);
    view.k = k; viewTarget = null; userMoved = true; dirty = true;
  };
  const onDbl = () => { fit(true); userMoved = false; };

  /* ── public api ────────────────────────────────────────────────────────── */
  const select = (id) => {
    selectedId = id;
    if (o.onSelect) o.onSelect(id != null ? byId.get(id) : null);
    dirty = true;
  };
  const filter = (q) => {
    q = (q || '').trim().toLowerCase();
    if (!q) { filterSet = null; dirty = true; return 0; }
    filterSet = new Set(nodes.filter(n =>
      (n.label || '').toLowerCase().includes(q) ||
      (n.group || '').toLowerCase().includes(q) ||
      String(n.id).toLowerCase().includes(q)).map(n => n.id));
    dirty = true;
    return filterSet.size;
  };

  /* ── lifecycle ─────────────────────────────────────────────────────────── */
  const size = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    W = Math.round(w * dpr); H = Math.round(h * dpr);
    canvas.width = W; canvas.height = H;
    if (!userMoved) fit(false);
    dirty = true;
  };
  const ro = new ResizeObserver(size);
  ro.observe(container);
  const mo = new MutationObserver(recolor);
  const themed = { attributes: true, attributeFilter:
    ['data-theme', 'data-accent', 'data-neutral', 'data-paper', 'data-contrast', 'data-radius', 'data-type', 'style', 'class'] };
  mo.observe(document.documentElement, themed);
  if (container !== document.documentElement) mo.observe(container, themed);
  rmq.addEventListener('change', () => { dirty = true; });

  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);
  canvas.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('wheel', onWheel, { passive: false });
  canvas.addEventListener('dblclick', onDbl);

  recolor();
  size();
  setData(o);
  loop();

  return {
    setData,
    filter,
    select,
    fit,
    center,
    zoomIn: () => zoomBy(1.35),
    zoomOut: () => zoomBy(1 / 1.35),
    stats: () => ({ nodes: nodes.length, edges: edges.length, hubs: nodes.filter(n => n.hub).length }),
    node: (id) => byId.get(id) || null,
    destroy: () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); mo.disconnect();
      canvas.remove();
      container.classList.remove('bi-graph--panning', 'bi-graph--node');
    },
  };
}
