/* ==========================================================================
   BUZZ & INK — createTheme()
   Bring-your-own-color theming. Give it any accent / neutral / paper hex and
   it derives full scales (buzz-50…900, ink-50…950, cream-0…200) in OKLCH —
   perceptually even steps, gamut-clamped — and emits CSS that remaps the
   base scales in place, exactly like the built-in palette voices do. Every
   semantic role, component, theme, and contrast mode follows automatically.

   Zero dependencies. OKLab math from Björn Ottosson (public domain).

     import {createTheme} from 'buzz-and-ink/theme';
     const theme = createTheme({name: 'midnight', accent: '#7B61FF'});
     theme.apply();            // inject into <head>
     // or: writeFileSync('theme.css', theme.css)
   ========================================================================== */

/* ── sRGB <-> OKLab <-> OKLCH ─────────────────────────────────────────────── */

function srgbToLinear(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function linearToSrgb(c) {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

function hexToRgb(hex) {
  let h = hex.trim().replace(/^#/, '');
  if (h.length === 3) h = h.replace(/./g, (ch) => ch + ch);
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error(`createTheme: invalid hex color "${hex}"`);
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255);
}

function rgbToOklch([r, g, b]) {
  const lr = srgbToLinear(r), lg = srgbToLinear(g), lb = srgbToLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(A, B);
  const H = (Math.atan2(B, A) * 180) / Math.PI;
  return { L, C, H: H < 0 ? H + 360 : H };
}

function oklchToRgb({ L, C, H }) {
  const rad = (H * Math.PI) / 180;
  const A = C * Math.cos(rad), B = C * Math.sin(rad);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    linearToSrgb(+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s),
  ];
}

function inGamut(rgb) {
  return rgb.every((c) => c >= -0.0005 && c <= 1.0005);
}

/** Reduce chroma (binary search) until the color fits in sRGB. */
function clampToGamut(lch) {
  if (inGamut(oklchToRgb(lch))) return lch;
  let lo = 0, hi = lch.C;
  for (let i = 0; i < 14; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(oklchToRgb({ ...lch, C: mid }))) lo = mid;
    else hi = mid;
  }
  return { ...lch, C: lo };
}

function toHex(rgb) {
  return (
    '#' +
    rgb
      .map((c) => Math.round(Math.min(1, Math.max(0, c)) * 255).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

function step(seed, L, chromaFactor) {
  return toHex(oklchToRgb(clampToGamut({ L, C: seed.C * chromaFactor, H: seed.H })));
}

/* ── scale curves (calibrated against the built-in buzz/ink/cream scales) ── */

const ACCENT_STEPS = [
  [50, 0.965, 0.2], [100, 0.93, 0.38], [200, 0.868, 0.6], [300, 0.795, 0.82],
  [400, 0.72, 0.96], [500, 0.645, 1.0], [600, 0.565, 0.96], [700, 0.49, 0.86],
  [800, 0.415, 0.72], [900, 0.345, 0.58],
];
const NEUTRAL_STEPS = [
  [50, 0.945, 0.55], [100, 0.895, 0.6], [200, 0.815, 0.7], [300, 0.705, 0.85],
  [400, 0.625, 1.0], [500, 0.555, 1.0], [600, 0.465, 1.0], [700, 0.385, 0.95],
  [800, 0.315, 0.9], [900, 0.27, 0.85], [950, 0.185, 0.7],
];
const PAPER_STEPS = [
  [0, 1.0, 0], [25, 0.985, 0.35], [50, 0.968, 0.6], [100, 0.945, 0.85],
  [150, 0.928, 1.0], [200, 0.91, 1.15],
];

/* ── public API ───────────────────────────────────────────────────────────── */

/**
 * Build a complete Buzz & Ink theme from up to three seed colors.
 *
 * @param {object} opts
 * @param {string} [opts.name='custom']   Theme name (used for the style tag id).
 * @param {string} [opts.accent]          Any hex — becomes the buzz scale (seed ≈ the 500 stop).
 * @param {string} [opts.neutral]         Any hex — becomes the ink scale (hue + tint carry over).
 * @param {string} [opts.paper]           Any hex — becomes the cream scale (hue carries over).
 * @param {string} [opts.selector=':root'] Where the overrides land. Use
 *   '[data-bi-theme="name"]' to scope a theme to a subtree.
 * @returns {{name: string, css: string, tokens: Record<string,string>, apply: (doc?: Document) => void}}
 */
/* Both of these end up inside a generated stylesheet, so both are validated
   rather than escaped — CSS has no escape that makes an arbitrary string safe
   in both a comment and a selector position.

   `name` lands in a /* … *​/ comment and an element id: a name containing the
   comment terminator would close the comment early and let whatever follows be
   parsed as real CSS.

   `selector` is injected verbatim as a rule head. A caller passing user input
   here could otherwise close the block and append rules of their own. The
   permitted set covers the selectors a theme legitimately needs — :root,
   .class, #id, [data-attr="value"], descendants — and nothing that can
   terminate a declaration block. */
const NAME_OK = /^[A-Za-z0-9_-]{1,64}$/;
const SELECTOR_OK = /^[A-Za-z0-9\s.#:_\-[\]="',>()*]{1,200}$/;

export function createTheme(opts = {}) {
  const name = opts.name === undefined ? 'custom' : String(opts.name);
  const selector = opts.selector === undefined ? ':root' : String(opts.selector);

  if (!NAME_OK.test(name)) {
    throw new Error(`createTheme: name must match ${NAME_OK} — got "${name}"`);
  }
  if (!SELECTOR_OK.test(selector) || selector.includes('}') || selector.includes('{')) {
    throw new Error(`createTheme: unsafe selector "${selector}"`);
  }

  const tokens = {};

  if (opts.accent) {
    const seed = rgbToOklch(hexToRgb(opts.accent));
    for (const [n, L, cf] of ACCENT_STEPS) tokens[`--bi-buzz-${n}`] = step(seed, L, cf);
  }
  if (opts.neutral) {
    const raw = rgbToOklch(hexToRgb(opts.neutral));
    const seed = { ...raw, C: Math.min(raw.C, 0.035) }; // neutrals stay near-gray
    for (const [n, L, cf] of NEUTRAL_STEPS) tokens[`--bi-ink-${n}`] = step(seed, L, cf);
  }
  if (opts.paper) {
    const raw = rgbToOklch(hexToRgb(opts.paper));
    const seed = { ...raw, C: Math.min(raw.C, 0.04) }; // paper stays paper
    for (const [n, L, cf] of PAPER_STEPS) tokens[`--bi-cream-${n}`] = step(seed, L, cf);
  }

  const body = Object.entries(tokens)
    .map(([k, v]) => `  ${k}:${v};`)
    .join('\n');
  const css = `/* Buzz & Ink theme "${name}" — generated by createTheme() */\n${selector}{\n${body}\n}\n`;

  return {
    name,
    css,
    tokens,
    apply(doc) {
      const d = doc || (typeof document !== 'undefined' ? document : null);
      if (!d) throw new Error('createTheme.apply(): no document — pass one or use theme.css');
      const id = `bi-theme-${name}`;
      let el = d.getElementById(id);
      if (!el) {
        el = d.createElement('style');
        el.id = id;
        d.head.appendChild(el);
      }
      el.textContent = css;
    },
  };
}
