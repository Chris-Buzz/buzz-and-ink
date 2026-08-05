/* ==========================================================================
   BUZZ & INK — charts
   Token-driven SVG charts. Bar, line, area, donut, sparkline.

   These render SVG, not canvas, and every mark is painted with
   `var(--bi-series-N)` rather than a resolved hex. That one choice is why a
   chart re-inks itself the instant you flip data-theme / data-accent — the
   cascade repaints it, with no redraw, no observer, and no JS at all. (The
   knowledge graph draws to canvas, so it *does* need a MutationObserver to
   re-read tokens; charts get it for free.)

     import {barChart, lineChart, donutChart, sparkline} from 'buzz-and-ink/charts';

     barChart(el, {
       categories: ['Mon','Tue','Wed'],
       series: [{name: 'Reads', values: [12, 19, 14]}],
     });

   Every chart returns a controller: {update(data), destroy(), el}.

   Defaults follow the system's data-viz rules, and two of them are load-
   bearing for accessibility rather than taste:
     · a legend is drawn whenever there are 2+ series, and
     · adjacent/stacked fills keep a 2px surface gap.
   The series palette clears colorblind separation only *with* that secondary
   encoding, so turning both off makes neighbouring series ambiguous for
   tritan viewers. `legend: false` is honoured for the single-series case —
   there the title names the series and a legend box is noise.

   Zero dependencies.
   ========================================================================== */

const SERIES_SLOTS = 6;

/* ── helpers ──────────────────────────────────────────────────────────────── */

/** Escape text bound for markup. All label/name input flows through here. */
function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/**
 * Series color for slot i (0-based), cycling only as a last resort.
 *
 * A lone series follows `--bi-accent`, so a single-series chart is on-brand
 * and re-inks with a custom theme. Two or more fall back to the fixed
 * `--bi-series-*` ramp: that ramp is validated for adjacent-pair separation
 * under colorblindness, and rebasing it on an arbitrary brand color would
 * silently void the validation. The distinction is safe because a single
 * series has no neighbour to be confused with — only the surface, and the
 * accent already clears contrast against that.
 */
function seriesVar(i, total = Infinity) {
  if (total === 1) return 'var(--bi-accent)';
  return `var(--bi-series-${(i % SERIES_SLOTS) + 1})`;
}

/**
 * Colors are caller-supplied and land inside SVG attributes, so they get an
 * allowlist rather than an escape — escaping would only yield a broken color,
 * whereas a quote or angle bracket here would break out of the attribute.
 * The permitted set covers every legitimate CSS color form: hex, named,
 * rgb()/hsl()/oklch(), var(), and color-mix().
 */
const COLOR_OK = /^[a-zA-Z0-9#(),.%\s_-]+$/;
function safeColor(value, fallback) {
  return typeof value === 'string' && COLOR_OK.test(value) ? value : fallback;
}

const defaultFormat = (n) =>
  Math.abs(n) >= 1e9 ? `${(n / 1e9).toFixed(1)}B`
  : Math.abs(n) >= 1e6 ? `${(n / 1e6).toFixed(1)}M`
  : Math.abs(n) >= 1e4 ? `${(n / 1e3).toFixed(0)}k`
  : Number.isInteger(n) ? String(n)
  : n.toFixed(1);

/**
 * Round an axis maximum up to a readable number and pick tick spacing.
 * "Nice" means 1, 2, 2.5, or 5 times a power of ten — the intervals people
 * read without doing arithmetic.
 */
function niceScale(min, max, ticks = 4) {
  if (min === max) { max = min + 1; }
  const raw = (max - min) / ticks;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const stepN = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  const step = stepN * mag;
  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;
  const out = [];
  // Tiny epsilon: floating-point drift otherwise drops the final tick.
  for (let v = niceMin; v <= niceMax + step * 1e-9; v += step) out.push(+v.toFixed(10));
  return { min: niceMin, max: niceMax, ticks: out };
}

/** Catmull-Rom → cubic bezier. Smooth without the overshoot of a naive spline. */
function smoothPath(pts) {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  return d;
}

function linePath(pts) {
  return pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join('');
}

function reducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/** Shared scaffolding: wrapper, optional legend, tooltip, figure semantics. */
function mount(el, opts, kind) {
  el.classList.add('bi-chart', `bi-chart--${kind}`);
  el.innerHTML = '';

  if (opts.title) {
    const h = document.createElement('div');
    h.className = 'bi-chart-title';
    h.textContent = opts.title;              // text node, never parsed
    el.appendChild(h);
  }

  const plot = document.createElement('div');
  plot.className = 'bi-chart-plot';
  el.appendChild(plot);

  const tip = document.createElement('div');
  tip.className = 'bi-chart-tip';
  tip.setAttribute('role', 'status');
  tip.hidden = true;
  el.appendChild(tip);

  return { plot, tip };
}

/** A legend is identity-not-by-color-alone. Drawn for 2+ series. */
function legendFor(el, series, opts) {
  const wanted = opts.legend ?? series.length > 1;
  if (!wanted || series.length === 0) return;
  const box = document.createElement('div');
  box.className = 'bi-chart-legend';
  series.forEach((s, i) => {
    const item = document.createElement('span');
    item.className = 'bi-chart-legend-item';
    const dot = document.createElement('i');
    dot.style.background = safeColor(s.color, seriesVar(i, series.length));
    item.appendChild(dot);
    item.appendChild(document.createTextNode(s.name ?? `Series ${i + 1}`));
    box.appendChild(item);
  });
  el.appendChild(box);
}

/** Position the tooltip inside the chart box, flipping near the right edge. */
function placeTip(el, tip, x, y) {
  tip.hidden = false;
  const box = el.getBoundingClientRect();
  const w = tip.offsetWidth;
  const left = Math.min(Math.max(8, x - w / 2), box.width - w - 8);
  tip.style.left = `${left}px`;
  tip.style.top = `${Math.max(4, y)}px`;
}

function normalizeSeries(opts) {
  if (Array.isArray(opts.series)) return opts.series;
  if (Array.isArray(opts.values)) return [{ name: opts.name, values: opts.values }];
  if (Array.isArray(opts.data)) {
    return [{ name: opts.name, values: opts.data.map((d) => (typeof d === 'number' ? d : d.value)) }];
  }
  return [];
}

function normalizeCategories(opts, len) {
  if (Array.isArray(opts.categories)) return opts.categories;
  if (Array.isArray(opts.data) && typeof opts.data[0] === 'object') {
    return opts.data.map((d) => d.label);
  }
  return Array.from({ length: len }, (_, i) => String(i + 1));
}

/* ── bar chart ─────────────────────────────────────────────────────────────
   barChart(el, {
     categories: ['Mon','Tue'],
     series: [{name:'Reads', values:[10,14]}, {name:'Saves', values:[3,6]}],
     stacked: false, horizontal: false, height: 240,
   })
   ------------------------------------------------------------------------ */

export function barChart(el, opts = {}) {
  const state = { ...opts };

  function render() {
    const o = state;
    const series = normalizeSeries(o);
    const cats = normalizeCategories(o, series[0]?.values.length || 0);
    const fmt = o.format || defaultFormat;
    const H = o.height || 240;
    const { plot, tip } = mount(el, o, 'bar');

    // Totals when stacked, else the tallest single bar.
    const peak = o.stacked
      ? Math.max(...cats.map((_, c) => series.reduce((sum, s) => sum + (s.values[c] || 0), 0)), 0)
      : Math.max(...series.flatMap((s) => s.values), 0);
    const scale = niceScale(0, peak, o.ticks || 4);

    const padL = o.axis === false ? 4 : 44;
    const padB = 26, padT = 10, padR = 6;
    const W = Math.max(el.clientWidth || 560, 240);
    const iw = W - padL - padR;
    const ih = H - padT - padB;
    const y = (v) => padT + ih - ((v - scale.min) / (scale.max - scale.min)) * ih;

    const bandW = iw / Math.max(cats.length, 1);
    const GAP = 2;                                   // surface gap — accessibility, not styling
    const groupW = bandW * 0.62;
    const barW = o.stacked ? groupW : (groupW - GAP * (series.length - 1)) / series.length;
    const radius = Math.min(4, barW / 2);

    let svg = `<svg viewBox="0 0 ${W} ${H}" width="100%" height="${H}" role="img" `
      + `aria-label="${esc(o.title || 'Bar chart')}" preserveAspectRatio="none">`;

    // grid + y axis — recessive on purpose
    if (o.grid !== false) {
      for (const t of scale.ticks) {
        svg += `<line class="bi-chart-grid" x1="${padL}" x2="${W - padR}" y1="${y(t).toFixed(1)}" y2="${y(t).toFixed(1)}"/>`;
        if (o.axis !== false) {
          svg += `<text class="bi-chart-atick" x="${padL - 8}" y="${(y(t) + 3.5).toFixed(1)}" text-anchor="end">${esc(fmt(t))}</text>`;
        }
      }
    }

    cats.forEach((cat, c) => {
      const x0 = padL + c * bandW + (bandW - groupW) / 2;
      let stackTop = 0;

      series.forEach((s, si) => {
        const v = s.values[c] || 0;
        const color = safeColor(s.color, seriesVar(si, series.length));
        let bx, by, bh;

        if (o.stacked) {
          bx = x0;
          const base = y(stackTop);
          stackTop += v;
          by = y(stackTop);
          bh = Math.max(0, base - by - GAP);        // gap between stacked segments
        } else {
          bx = x0 + si * (barW + GAP);
          by = y(v);
          bh = Math.max(0, y(scale.min) - by);
        }
        if (bh <= 0) return;

        // Rounded top only — the baseline end stays square so the bar reads
        // as anchored to zero rather than floating.
        const r = Math.min(radius, bh);
        const d = `M${bx},${by + bh} L${bx},${by + r} Q${bx},${by} ${bx + r},${by}`
          + ` L${bx + barW - r},${by} Q${bx + barW},${by} ${bx + barW},${by + r} L${bx + barW},${by + bh} Z`;

        svg += `<path class="bi-chart-bar" d="${d}" fill="${color}" `
          + `data-c="${c}" data-s="${si}" data-v="${esc(fmt(v))}" `
          + `data-label="${esc(cat)}" data-name="${esc(s.name ?? '')}"><title>${esc(cat)}: ${esc(fmt(v))}</title></path>`;
      });

      if (o.axis !== false) {
        svg += `<text class="bi-chart-atick" x="${(padL + c * bandW + bandW / 2).toFixed(1)}" y="${H - 8}" text-anchor="middle">${esc(cat)}</text>`;
      }
    });

    svg += '</svg>';
    plot.innerHTML = svg;

    legendFor(el, series, o);
    wireTooltip(el, plot, tip, '.bi-chart-bar', (t) => ({
      label: t.dataset.label, name: t.dataset.name, value: t.dataset.v,
    }));

    if (!reducedMotion() && o.animate !== false) {
      plot.querySelectorAll('.bi-chart-bar').forEach((bar, i) => {
        bar.style.animationDelay = `${i * 28}ms`;
        bar.classList.add('bi-chart-grow');
      });
    }
  }

  render();
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(render) : null;
  ro?.observe(el);

  return {
    el,
    update(next) { Object.assign(state, next); render(); },
    destroy() { ro?.disconnect(); el.innerHTML = ''; el.classList.remove('bi-chart', 'bi-chart--bar'); },
  };
}

/* ── line / area chart ─────────────────────────────────────────────────────
   lineChart(el, {categories, series:[{name, values}], area: true, curve: true})
   ------------------------------------------------------------------------ */

export function lineChart(el, opts = {}) {
  const state = { ...opts };

  function render() {
    const o = state;
    const series = normalizeSeries(o);
    const cats = normalizeCategories(o, series[0]?.values.length || 0);
    const fmt = o.format || defaultFormat;
    const H = o.height || 240;
    const { plot, tip } = mount(el, o, o.area ? 'area' : 'line');

    const all = series.flatMap((s) => s.values);
    const lo = o.zero === false ? Math.min(...all) : 0;
    const scale = niceScale(lo, Math.max(...all, 0), o.ticks || 4);

    const padL = o.axis === false ? 4 : 44;
    const padB = 26, padT = 12, padR = 10;
    const W = Math.max(el.clientWidth || 560, 240);
    const iw = W - padL - padR;
    const ih = H - padT - padB;
    const y = (v) => padT + ih - ((v - scale.min) / (scale.max - scale.min)) * ih;
    const x = (i) => padL + (cats.length === 1 ? iw / 2 : (i / (cats.length - 1)) * iw);

    const uid = `bi${Math.random().toString(36).slice(2, 8)}`;
    let svg = `<svg viewBox="0 0 ${W} ${H}" width="100%" height="${H}" role="img" `
      + `aria-label="${esc(o.title || 'Line chart')}" preserveAspectRatio="none">`;

    if (o.area) {
      svg += '<defs>';
      series.forEach((s, si) => {
        const color = safeColor(s.color, seriesVar(si, series.length));
        svg += `<linearGradient id="${uid}-g${si}" x1="0" y1="0" x2="0" y2="1">`
          + `<stop offset="0%" stop-color="${color}" stop-opacity="0.26"/>`
          + `<stop offset="100%" stop-color="${color}" stop-opacity="0"/></linearGradient>`;
      });
      svg += '</defs>';
    }

    if (o.grid !== false) {
      for (const t of scale.ticks) {
        svg += `<line class="bi-chart-grid" x1="${padL}" x2="${W - padR}" y1="${y(t).toFixed(1)}" y2="${y(t).toFixed(1)}"/>`;
        if (o.axis !== false) {
          svg += `<text class="bi-chart-atick" x="${padL - 8}" y="${(y(t) + 3.5).toFixed(1)}" text-anchor="end">${esc(fmt(t))}</text>`;
        }
      }
    }

    series.forEach((s, si) => {
      const pts = s.values.map((v, i) => [x(i), y(v)]);
      const color = safeColor(s.color, seriesVar(si, series.length));
      const d = o.curve === false ? linePath(pts) : smoothPath(pts);

      if (o.area) {
        const floor = y(scale.min);
        svg += `<path class="bi-chart-area" d="${d} L${pts[pts.length - 1][0].toFixed(2)},${floor} L${pts[0][0].toFixed(2)},${floor} Z" fill="url(#${uid}-g${si})"/>`;
      }
      svg += `<path class="bi-chart-line" d="${d}" stroke="${color}" fill="none"/>`;

      if (o.points !== false) {
        pts.forEach((p, i) => {
          svg += `<circle class="bi-chart-dot" cx="${p[0].toFixed(2)}" cy="${p[1].toFixed(2)}" r="4" `
            + `fill="${color}" data-c="${i}" data-v="${esc(fmt(s.values[i]))}" `
            + `data-label="${esc(cats[i])}" data-name="${esc(s.name ?? '')}"><title>${esc(cats[i])}: ${esc(fmt(s.values[i]))}</title></circle>`;
        });
      }
    });

    if (o.axis !== false) {
      // Thin the x labels so they never collide on a narrow chart.
      const stride = Math.ceil((cats.length * 52) / iw) || 1;
      cats.forEach((cat, i) => {
        if (i % stride && i !== cats.length - 1) return;
        svg += `<text class="bi-chart-atick" x="${x(i).toFixed(1)}" y="${H - 8}" text-anchor="middle">${esc(cat)}</text>`;
      });
    }

    svg += '</svg>';
    plot.innerHTML = svg;

    legendFor(el, series, o);
    wireTooltip(el, plot, tip, '.bi-chart-dot', (t) => ({
      label: t.dataset.label, name: t.dataset.name, value: t.dataset.v,
    }));

    if (!reducedMotion() && o.animate !== false) {
      plot.querySelectorAll('.bi-chart-line').forEach((path) => {
        const len = path.getTotalLength?.() || 0;
        if (!len) return;
        path.style.strokeDasharray = String(len);
        path.style.strokeDashoffset = String(len);
        path.classList.add('bi-chart-draw');
      });
      plot.querySelectorAll('.bi-chart-dot').forEach((dot, i) => {
        dot.style.animationDelay = `${420 + i * 22}ms`;
        dot.classList.add('bi-chart-pop');
      });
    }
  }

  render();
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(render) : null;
  ro?.observe(el);

  return {
    el,
    update(next) { Object.assign(state, next); render(); },
    destroy() { ro?.disconnect(); el.innerHTML = ''; el.className = ''; },
  };
}

/** areaChart(el, opts) — lineChart with the fill on. */
export function areaChart(el, opts = {}) {
  return lineChart(el, { ...opts, area: true });
}

/* ── donut ─────────────────────────────────────────────────────────────────
   donutChart(el, {data: [{label, value}], center: {value, label}})
   ------------------------------------------------------------------------ */

export function donutChart(el, opts = {}) {
  const state = { ...opts };

  function render() {
    const o = state;
    const data = (o.data || []).map((d, i) => ({
      label: d.label ?? `Slice ${i + 1}`,
      value: d.value ?? 0,
      color: safeColor(d.color, seriesVar(i, (o.data || []).length)),
    }));
    const fmt = o.format || defaultFormat;
    const total = data.reduce((s, d) => s + d.value, 0) || 1;
    const size = o.size || 200;
    const thickness = o.thickness || 22;
    const r = (size - thickness) / 2;
    const cx = size / 2, cy = size / 2;
    const { plot, tip } = mount(el, o, 'donut');

    const circumference = 2 * Math.PI * r;
    const GAP = 2;                                    // surface gap between slices

    let svg = `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" `
      + `aria-label="${esc(o.title || 'Donut chart')}">`;
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" class="bi-chart-track" fill="none" stroke-width="${thickness}"/>`;

    let offset = 0;
    data.forEach((d, i) => {
      const frac = d.value / total;
      const len = Math.max(0, frac * circumference - GAP);
      svg += `<circle class="bi-chart-slice" cx="${cx}" cy="${cy}" r="${r}" fill="none" `
        + `stroke="${d.color}" stroke-width="${thickness}" stroke-linecap="butt" `
        + `stroke-dasharray="${len.toFixed(2)} ${(circumference - len).toFixed(2)}" `
        + `stroke-dashoffset="${(-offset).toFixed(2)}" `
        + `transform="rotate(-90 ${cx} ${cy})" `
        + `data-label="${esc(d.label)}" data-v="${esc(fmt(d.value))}" `
        + `data-pct="${((frac * 100).toFixed(1))}%" style="--bi-i:${i}">`
        + `<title>${esc(d.label)}: ${esc(fmt(d.value))}</title></circle>`;
      offset += frac * circumference;
    });
    svg += '</svg>';

    plot.innerHTML = svg;
    plot.classList.add('bi-chart-plot--center');

    if (o.center !== false) {
      const mid = document.createElement('div');
      mid.className = 'bi-chart-center';
      const big = document.createElement('b');
      big.textContent = o.center?.value ?? fmt(total);
      const small = document.createElement('span');
      small.textContent = o.center?.label ?? 'total';
      mid.append(big, small);
      plot.appendChild(mid);
    }

    legendFor(el, data.map((d) => ({ name: d.label, color: d.color })), { legend: o.legend ?? true });
    wireTooltip(el, plot, tip, '.bi-chart-slice', (t) => ({
      label: t.dataset.label, name: '', value: `${t.dataset.v} · ${t.dataset.pct}`,
    }));

    if (!reducedMotion() && o.animate !== false) {
      plot.querySelectorAll('.bi-chart-slice').forEach((s) => s.classList.add('bi-chart-sweep'));
    }
  }

  render();
  return {
    el,
    update(next) { Object.assign(state, next); render(); },
    destroy() { el.innerHTML = ''; el.className = ''; },
  };
}

/* ── sparkline ─────────────────────────────────────────────────────────────
   sparkline(el, {values: [3,5,4,9], area: true})
   Inline, axis-free, for table cells and stat tiles.
   ------------------------------------------------------------------------ */

export function sparkline(el, opts = {}) {
  const values = opts.values || [];
  const W = opts.width || 84;
  const H = opts.height || 26;
  const color = safeColor(opts.color, seriesVar(0, 1));
  const pad = 3;

  el.classList.add('bi-spark');
  if (values.length < 2) { el.innerHTML = ''; return { el, destroy() { el.innerHTML = ''; } }; }

  const lo = Math.min(...values), hi = Math.max(...values);
  const span = hi - lo || 1;
  const pts = values.map((v, i) => [
    pad + (i / (values.length - 1)) * (W - pad * 2),
    pad + (1 - (v - lo) / span) * (H - pad * 2),
  ]);
  const d = opts.curve === false ? linePath(pts) : smoothPath(pts);
  const uid = `sp${Math.random().toString(36).slice(2, 8)}`;

  let svg = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true">`;
  if (opts.area !== false) {
    svg += `<defs><linearGradient id="${uid}" x1="0" y1="0" x2="0" y2="1">`
      + `<stop offset="0%" stop-color="${color}" stop-opacity="0.28"/>`
      + `<stop offset="100%" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>`
      + `<path d="${d} L${pts[pts.length - 1][0].toFixed(2)},${H} L${pts[0][0].toFixed(2)},${H} Z" fill="url(#${uid})"/>`;
  }
  svg += `<path d="${d}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (opts.dot !== false) {
    const last = pts[pts.length - 1];
    svg += `<circle cx="${last[0].toFixed(2)}" cy="${last[1].toFixed(2)}" r="2.4" fill="${color}"/>`;
  }
  svg += '</svg>';

  el.innerHTML = svg;
  return { el, destroy() { el.innerHTML = ''; el.classList.remove('bi-spark'); } };
}

/* ── shared tooltip wiring ────────────────────────────────────────────────── */

function wireTooltip(el, plot, tip, selector, fields) {
  if (el.dataset.biTip === 'off') return;

  const show = (e) => {
    const target = e.target.closest(selector);
    if (!target) return;

    // Built from text nodes rather than a markup string. dataset values are
    // the *decoded* originals (the parser undoes the escaping applied when the
    // SVG string was assembled), so re-escaping here would be both necessary
    // and easy to forget — using textContent removes the question entirely.
    const { label, name, value } = fields(target);
    tip.textContent = '';
    const head = document.createElement('b');
    head.textContent = name ? `${label} · ${name}` : label;
    const val = document.createElement('span');
    val.textContent = value;
    tip.append(head, val);

    const box = el.getBoundingClientRect();
    placeTip(el, tip, e.clientX - box.left, e.clientY - box.top - 46);
    target.classList.add('is-hot');
  };
  const hide = (e) => {
    const target = e.target.closest?.(selector);
    target?.classList.remove('is-hot');
    tip.hidden = true;
  };

  plot.addEventListener('pointermove', show);
  plot.addEventListener('pointerout', hide);
  plot.addEventListener('pointerleave', () => { tip.hidden = true; });
}

/** Every chart type, for `import * as charts`. */
export const charts = { barChart, lineChart, areaChart, donutChart, sparkline };
