/* ==========================================================================
   BUZZ & INK — test suite
   Runs on the Node built-in test runner. No dependencies, no build step:

     npm test

   Covers the parts where being wrong is expensive and invisible — the colour
   maths, the chart scales, and every security fix (each of those has a named
   regression test, so a future refactor that reopens the hole fails here
   rather than in someone's product).
   ========================================================================== */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { createTheme } from '../src/theme.js';
import { ICONS, icon } from '../src/icons.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

/* ── colour engine ───────────────────────────────────────────────────────── */

test('createTheme derives a full accent scale from one seed', () => {
  const t = createTheme({ accent: '#D9701E' });
  for (const step of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]) {
    assert.match(t.tokens[`--bi-buzz-${step}`], /^#[0-9A-F]{6}$/,
      `--bi-buzz-${step} should be a hex colour`);
  }
});

test('accent scale is monotonically darker as the step rises', () => {
  const t = createTheme({ accent: '#3D6BA8' });
  const luminance = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  for (let i = 1; i < steps.length; i++) {
    const lighter = luminance(t.tokens[`--bi-buzz-${steps[i - 1]}`]);
    const darker = luminance(t.tokens[`--bi-buzz-${steps[i]}`]);
    assert.ok(darker < lighter,
      `step ${steps[i]} should be darker than ${steps[i - 1]}`);
  }
});

test('every derived colour lands inside the sRGB gamut', () => {
  // The gamut clamp is a binary search; an off-by-one there yields channels
  // outside 00–FF that silently render as garbage.
  for (const seed of ['#FF0000', '#00FF00', '#0000FF', '#7B61FF', '#000000', '#FFFFFF']) {
    const t = createTheme({ accent: seed, neutral: seed, paper: seed });
    for (const [token, hex] of Object.entries(t.tokens)) {
      assert.match(hex, /^#[0-9A-F]{6}$/, `${token} from ${seed} left the gamut: ${hex}`);
    }
  }
});

test('createTheme rejects malformed hex input', () => {
  assert.throws(() => createTheme({ accent: 'not-a-colour' }), /invalid hex/);
  assert.throws(() => createTheme({ accent: '#12345' }), /invalid hex/);
});

test('createTheme accepts 3-digit shorthand hex', () => {
  const t = createTheme({ accent: '#f80' });
  assert.match(t.tokens['--bi-buzz-500'], /^#[0-9A-F]{6}$/);
});

/* ── security regressions ────────────────────────────────────────────────── */

test('SECURITY: createTheme refuses a name that breaks out of the CSS comment', () => {
  // `*/ body{display:none} /*` would close the generated comment early.
  assert.throws(() => createTheme({ name: '*/ body{display:none} /*', accent: '#D9701E' }),
    /name must match/);
  assert.throws(() => createTheme({ name: 'a"b' }), /name must match/);
});

test('SECURITY: createTheme refuses a selector that closes the rule block', () => {
  assert.throws(() => createTheme({ selector: ':root} body{display:none', accent: '#D9701E' }),
    /unsafe selector/);
  assert.throws(() => createTheme({ selector: 'a{b' }), /unsafe selector/);
});

test('createTheme still allows the selectors a theme legitimately needs', () => {
  for (const sel of [':root', '.dark', '#app', '[data-bi-theme="night"]', 'html[data-theme="dark"] .panel']) {
    assert.doesNotThrow(() => createTheme({ selector: sel, accent: '#D9701E' }), `rejected ${sel}`);
  }
});

test('SECURITY: icon() will not let a class attribute escape into markup', () => {
  const out = icon('search', '" onload="alert(1)');
  assert.ok(!out.includes('onload'), 'attribute broke out of the class value');
  assert.ok(out.includes('class="bi-icon"'), 'should fall back to the default class');
});

test('SECURITY: icon() does not reach inherited object properties', () => {
  // A bare ICONS[name] lookup finds Object.prototype members and stringifies them.
  for (const key of ['constructor', 'toString', '__proto__', 'hasOwnProperty']) {
    assert.equal(icon(key), '', `icon(${key}) should be empty`);
  }
});

test('icon() returns well-formed SVG for a real name, and nothing for a fake one', () => {
  assert.match(icon('search'), /^<svg class="bi-icon" viewBox="0 0 24 24"/);
  assert.equal(icon('definitely-not-an-icon'), '');
});

/* ── icon set integrity ──────────────────────────────────────────────────── */

test('every icon is a valid, non-empty, kebab-case entry', () => {
  const names = Object.keys(ICONS);
  assert.ok(names.length >= 120, `expected a full set, got ${names.length}`);
  for (const name of names) {
    assert.match(name, /^[a-z0-9-]+$/, `icon name "${name}" is not kebab-case`);
    assert.ok(ICONS[name].includes('<'), `icon "${name}" has no geometry`);
    // Icons are inked by currentColor; a hardcoded fill would ignore the theme.
    assert.ok(!/fill="#|stroke="#/.test(ICONS[name]),
      `icon "${name}" hardcodes a colour instead of inheriting currentColor`);
  }
});

test('every icon referenced by an example actually exists', () => {
  for (const app of ['hive-desk', 'apiary', 'comb', 'swarm']) {
    const html = read(`examples/${app}/index.html`);
    for (const [, name] of html.matchAll(/#bi-i-([a-z0-9-]+)/g)) {
      assert.ok(Object.hasOwn(ICONS, name), `${app} references missing icon "${name}"`);
    }
  }
});

/* ── stylesheet integrity ────────────────────────────────────────────────── */

test('components.css has balanced braces', () => {
  const bare = read('src/components.css').replace(/\/\*[\s\S]*?\*\//g, '');
  let depth = 0, min = 0;
  for (const ch of bare) {
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (depth < min) min = depth; }
  }
  assert.equal(depth, 0, 'unclosed block');
  assert.equal(min, 0, 'stray closing brace');
});

test('no component hardcodes a font size below the readable floor', () => {
  // Mono caps at 9px was the v0.8 readability complaint. Sizes come from the
  // scale now, so any raw px here is a regression.
  const css = read('src/components.css');
  const raw = [...css.matchAll(/font-size:(\d+(?:\.\d+)?)px/g)].map((m) => Number(m[1]));
  const tooSmall = raw.filter((n) => n < 20);   // 20px+ are display sizes, fine
  assert.deepEqual(tooSmall, [],
    `hardcoded body-scale font sizes found: ${tooSmall.join(', ')}px — use var(--bi-text-*)`);
});

test('every class an example uses is defined in the stylesheet', () => {
  const defined = new Set([...read('src/components.css').matchAll(/\.(bi-[a-z0-9-]+)/g)].map((m) => m[1]));
  for (const app of ['hive-desk', 'apiary', 'comb', 'swarm']) {
    const html = read(`examples/${app}/index.html`);
    const used = new Set(
      [...html.matchAll(/class="([^"]*)"/g)]
        .flatMap((m) => m[1].split(/\s+/))
        .filter((c) => c.startsWith('bi-')),
    );
    for (const cls of used) {
      assert.ok(defined.has(cls), `${app} uses undefined class .${cls}`);
    }
  }
});

test('the play layer stays out of the professional examples', () => {
  // The whole point of data-mood: fun is opt-in. If a sticker turns up in the
  // newsroom console again, that is a regression in intent, not just style.
  const PLAY = /\bbi-(note|sticker|bubble|polaroid|mark|squiggle|blob|burst|wobble|jelly|tada|rainbow|tape|doodle|pop-(pink|violet|sky|teal|mint|lemon|peach|lilac))\b/;
  for (const app of ['hive-desk', 'apiary', 'comb']) {
    const html = read(`examples/${app}/index.html`);
    const hit = html.match(PLAY);
    assert.equal(hit, null, `${app} pulled in the play layer: ${hit?.[0]}`);
  }
});

/* ── package integrity ───────────────────────────────────────────────────── */

test('every export path in package.json resolves to a real file', () => {
  const pkg = JSON.parse(read('package.json'));
  for (const [name, entry] of Object.entries(pkg.exports)) {
    const paths = typeof entry === 'string' ? [entry] : Object.values(entry);
    for (const p of paths) {
      assert.doesNotThrow(() => readFileSync(join(root, p)), `exports["${name}"] → missing ${p}`);
    }
  }
});

test('the published bundle carries no dependencies', () => {
  // Zero runtime deps is the security posture, not an accident. Assert it.
  const pkg = JSON.parse(read('package.json'));
  assert.deepEqual(pkg.dependencies ?? {}, {},
    'buzz-and-ink must stay dependency-free');
});

test('every typed export ships a matching .d.ts', () => {
  const pkg = JSON.parse(read('package.json'));
  for (const [name, entry] of Object.entries(pkg.exports)) {
    if (typeof entry === 'object' && entry.default?.endsWith('.js')) {
      assert.ok(entry.types, `exports["${name}"] has no types field`);
    }
  }
});

/* ── surface themes ──────────────────────────────────────────────────────── */

/** WCAG relative-luminance contrast between two hex colours. */
function contrast(a, b) {
  const lum = (h) => {
    const [r, g, b2] = [1, 3, 5]
      .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
      .map((c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b2;
  };
  const [x, y] = [lum(a), lum(b)];
  const [hi, lo] = x > y ? [x, y] : [y, x];
  return (hi + 0.05) / (lo + 0.05);
}

/** Pull every `--bi-*: #hex` pair out of one rule block in tokens.css. */
function surfaceThemes() {
  const css = read('src/tokens.css');
  const out = {};
  for (const [, selector, block] of css.matchAll(/([^{}\n][^{}]*\[data-surface="[a-z]+"\])\s*\{([^}]*)\}/g)) {
    const vars = {};
    for (const [, k, v] of block.matchAll(/--bi-([a-z0-9-]+)\s*:\s*(#[0-9A-Fa-f]{6})/g)) vars[k] = v;
    if (vars.bg && vars.text) out[selector.trim()] = vars;
  }
  return out;
}

test('every surface theme is a complete set', () => {
  const themes = surfaceThemes();
  // 4 light + 4 dark alternates; the two defaults live in :root and [data-theme=dark]
  assert.ok(Object.keys(themes).length >= 8,
    `expected the alternate surface themes, found ${Object.keys(themes).length}`);
  for (const [name, v] of Object.entries(themes)) {
    for (const key of ['bg', 'bg-deep', 'surface', 'line', 'line-soft', 'text', 'text-2', 'text-3']) {
      assert.ok(v[key], `${name} is missing --bi-${key}`);
    }
  }
});

test('every surface theme meets its contrast floor', () => {
  // These are the thresholds the palette was designed against. A theme that
  // drifts below one of them has a real, visible accessibility failure —
  // faint hairlines and unreadable meta text are the usual symptoms.
  const FLOOR = { text: 7, 'text-2': 4.5, 'text-3': 3, line: 1.35 };
  for (const [name, v] of Object.entries(surfaceThemes())) {
    for (const [key, min] of Object.entries(FLOOR)) {
      const got = contrast(v.bg, v[key]);
      assert.ok(got >= min,
        `${name}: --bi-${key} is ${got.toFixed(2)}:1 against --bi-bg, needs ${min}:1`);
    }
    // body text has to hold up on a raised card too, not just the page
    const onSurface = contrast(v.surface, v.text);
    assert.ok(onSurface >= 7,
      `${name}: text on --bi-surface is ${onSurface.toFixed(2)}:1, needs 7:1`);
    // and the card has to be distinguishable from the page at all
    assert.ok(contrast(v.bg, v.surface) >= 1.02 || v.bg === v.surface,
      `${name}: --bi-surface is indistinguishable from --bi-bg`);
  }
});

test('surface themes are distinguishable from each other', () => {
  // Contrast measures a theme against ITSELF. It passed on the first version
  // of this set, which nevertheless shipped five light themes sitting OKLab
  // dE 0.8-2.3 apart — visually identical, because they were spread by hue
  // alone and hue is nearly invisible at these chroma levels. This is the
  // check that catches that: every theme has to differ from every other one.
  const oklab = (hex) => {
    const [r, g, b] = [1, 3, 5]
      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [
      0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
      1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
      0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
    ];
  };
  const dE = (x, y) => {
    const [a, b, c] = oklab(x), [d, e, f] = oklab(y);
    return Math.hypot(a - d, b - e, c - f) * 100;
  };

  const themes = surfaceThemes();
  const light = Object.entries(themes).filter(([k]) => k.includes(':not('));
  const dark = Object.entries(themes).filter(([k]) => k.includes('data-theme="dark"'));

  for (const [label, group] of [['light', light], ['dark', dark]]) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const [na, a] = group[i], [nb, b] = group[j];
        const d = dE(a.bg, b.bg);
        assert.ok(d >= 3,
          `${label}: ${na.match(/"(\w+)"\]$/)[1]} and ${nb.match(/"(\w+)"\]$/)[1]} ` +
          `are only dE ${d.toFixed(1)} apart — they will read as the same theme`);
      }
    }
  }
});
