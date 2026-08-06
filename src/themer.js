/* ==========================================================================
   BUZZ & INK — themer
   A runtime control panel for the whole design system. Pick three colors and
   every token, component, chart, and graph re-inks live.

     import {themer} from 'buzz-and-ink/themer';
     themer();                        // floating panel, bottom-right
     themer({mount: '#panel', floating: false});   // inline, in your own chrome

   It is a thin shell over createTheme() — the OKLCH scale derivation in
   buzz-and-ink/theme does the real work. This adds the controls, the preset
   list, localStorage persistence, and a "copy CSS" that hands back a
   stylesheet you can paste into a project and delete this panel entirely.

   The point: customization is not a fork. You seed three colors, the system
   derives ~27 scale steps in perceptually even OKLCH, and every semantic role
   that references those scales follows — in light, dark, and deep contrast.
   ========================================================================== */

import { createTheme } from './theme.js';

const KEY = 'bi-themer';

/** The attribute switches the system already understands. */
const VOICES = [
  { attr: 'data-theme',    label: 'theme',    options: ['light', 'dark'] },
  { attr: 'data-radius',   label: 'edges',    options: ['standard', 'sharp', 'soft'] },
  { attr: 'data-contrast', label: 'contrast', options: ['standard', 'deep'] },
  { attr: 'data-type',     label: 'type',     options: ['fraunces', 'bricolage'] },
];

/** Seed triples, not full themes — the engine derives the rest. */
export const PRESETS = {
  'buzz & ink': { accent: '#D9701E', neutral: '#3E342A', paper: '#FAF6EE' },
  midnight:     { accent: '#7B61FF', neutral: '#2A2A38', paper: '#F5F5FA' },
  forest:       { accent: '#3F8F5B', neutral: '#2B332C', paper: '#F4F7F0' },
  ocean:        { accent: '#1E7FA8', neutral: '#26313A', paper: '#F0F6F9' },
  ember:        { accent: '#C7402B', neutral: '#332624', paper: '#FAF2EE' },
  mono:         { accent: '#4A4A4A', neutral: '#2B2B2B', paper: '#F7F7F7' },
};

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

/* localStorage is attacker-writable in any XSS scenario and survives across
   sessions, so what comes back out is untrusted input — not "our own data".

   Two things follow. First, the restored object is rebuilt key by key from a
   known schema rather than spread wholesale: JSON.parse happily produces an
   own "__proto__" property, and Object.assign-ing that onto the state object
   walks the prototype setter and pollutes Object.prototype for the whole page.
   Second, each value is validated — the colours reach createTheme() and the
   voices become DOM attributes, so a junk value should be dropped, not
   applied. */
const COLOR_KEYS = ['accent', 'neutral', 'paper'];
const VOICE_VALUES = {
  theme: ['light', 'dark'],
  radius: ['standard', 'sharp', 'soft'],
  contrast: ['standard', 'deep'],
  type: ['fraunces', 'bricolage'],
};
const HEX_OK = /^#[0-9a-fA-F]{6}$/;

function load() {
  let raw;
  try { raw = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;

  const clean = Object.create(null);
  for (const key of COLOR_KEYS) {
    const v = raw[key];
    if (typeof v === 'string' && HEX_OK.test(v)) clean[key] = v.toUpperCase();
  }
  for (const [key, allowed] of Object.entries(VOICE_VALUES)) {
    if (allowed.includes(raw[key])) clean[key] = raw[key];
  }
  return clean;
}

function save(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* private mode — fine */ }
}

/**
 * Mount the theme customizer.
 * @param {{mount?: string|HTMLElement, floating?: boolean, open?: boolean,
 *          persist?: boolean, onChange?: (state: object) => void}} [opts]
 */
export function themer(opts = {}) {
  if (typeof document === 'undefined') return null;

  const persist = opts.persist !== false;
  const saved = persist ? load() : null;
  const state = {
    ...PRESETS['buzz & ink'],
    theme: document.documentElement.getAttribute('data-theme') || 'light',
    radius: 'standard', contrast: 'standard', type: 'fraunces',
    ...(saved || {}),
    ...(opts.initial || {}),
  };

  /* ── apply ──────────────────────────────────────────────────────────────── */
  let current = null;
  function apply() {
    current = createTheme({
      name: 'themer',
      accent: state.accent,
      neutral: state.neutral,
      paper: state.paper,
    });
    current.apply();

    const root = document.documentElement;
    root.setAttribute('data-theme', state.theme);
    root.setAttribute('data-radius', state.radius);
    root.setAttribute('data-contrast', state.contrast);
    root.setAttribute('data-type', state.type);

    // The palette voices remap the same scales createTheme() writes, so
    // leaving one on would silently win. Custom seeds replace them outright.
    root.removeAttribute('data-accent');
    root.removeAttribute('data-neutral');
    root.removeAttribute('data-paper');

    if (persist) save(state);
    opts.onChange?.(state, current);
  }

  /* ── panel ──────────────────────────────────────────────────────────────── */
  const host = typeof opts.mount === 'string' ? document.querySelector(opts.mount) : opts.mount;
  const floating = opts.floating !== false && !host;

  const panel = el('div', 'bi-themer');
  if (floating) panel.classList.add('bi-themer--float');

  const head = el('header');
  head.append(el('b', null, 'Theme'));
  const close = el('button', 'x', '×');
  close.setAttribute('aria-label', 'Close theme panel');
  head.append(close);
  panel.append(head);

  const body = el('div', 'bi-themer-body');
  panel.append(body);

  /* presets */
  body.append(el('div', 'bi-themer-label', 'presets'));
  const presetRow = el('div', 'bi-themer-presets');
  for (const [name, seed] of Object.entries(PRESETS)) {
    const chip = el('button', 'bi-themer-preset');
    chip.title = name;
    chip.setAttribute('aria-label', `Apply ${name} theme`);
    const swatch = el('i');
    swatch.style.background = seed.accent;
    chip.append(swatch, el('span', null, name));
    chip.addEventListener('click', () => {
      Object.assign(state, seed);
      syncInputs();
      apply();
    });
    presetRow.append(chip);
  }
  body.append(presetRow);

  /* color seeds */
  body.append(el('div', 'bi-themer-label', 'your colors'));
  const inputs = {};
  for (const key of ['accent', 'neutral', 'paper']) {
    const row = el('label', 'bi-themer-row');
    row.append(el('span', null, key));

    const hex = el('input', 'bi-themer-hex');
    hex.type = 'text';
    hex.spellcheck = false;
    hex.setAttribute('aria-label', `${key} hex value`);

    const swatch = el('input', 'bi-themer-color');
    swatch.type = 'color';
    swatch.setAttribute('aria-label', `${key} color`);

    // Two controls, one value. The picker fires continuously while dragging,
    // so the whole system re-derives live; the text field is for pasting a
    // brand hex, and only commits once it is actually a valid color.
    swatch.addEventListener('input', () => {
      state[key] = swatch.value.toUpperCase();
      hex.value = state[key];
      apply();
    });
    hex.addEventListener('input', () => {
      const v = hex.value.trim();
      if (/^#?[0-9a-fA-F]{6}$/.test(v)) {
        state[key] = v.startsWith('#') ? v.toUpperCase() : `#${v.toUpperCase()}`;
        swatch.value = state[key];
        apply();
      }
    });

    row.append(hex, swatch);
    body.append(row);
    inputs[key] = { hex, swatch };
  }

  /* voice switches */
  for (const voice of VOICES) {
    const row = el('div', 'bi-themer-row');
    row.append(el('span', null, voice.label));
    const seg = el('div', 'bi-seg');
    voice.options.forEach((option) => {
      const b = el('button', null, option);
      b.dataset.value = option;
      b.dataset.voice = voice.label;
      b.addEventListener('click', () => {
        state[voice.label === 'edges' ? 'radius' : voice.label] = option;
        syncInputs();
        apply();
      });
      seg.append(b);
    });
    row.append(seg);
    body.append(row);
  }

  /* actions */
  const actions = el('div', 'bi-themer-actions');
  const copy = el('button', 'bi-btn bi-btn--ghost', 'Copy CSS');
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(current.css);
      copy.textContent = 'Copied';
    } catch {
      copy.textContent = 'Copy failed';
    }
    setTimeout(() => { copy.textContent = 'Copy CSS'; }, 1600);
  });
  const reset = el('button', 'bi-btn bi-btn--ghost', 'Reset');
  reset.addEventListener('click', () => {
    Object.assign(state, PRESETS['buzz & ink'], { radius: 'standard', contrast: 'standard', type: 'fraunces' });
    syncInputs();
    apply();
  });
  actions.append(copy, reset);
  body.append(actions);

  /* ── sync UI from state ─────────────────────────────────────────────────── */
  function syncInputs() {
    for (const key of ['accent', 'neutral', 'paper']) {
      inputs[key].hex.value = state[key];
      inputs[key].swatch.value = state[key];
    }
    panel.querySelectorAll('.bi-seg button').forEach((b) => {
      const stateKey = b.dataset.voice === 'edges' ? 'radius' : b.dataset.voice;
      b.classList.toggle('on', state[stateKey] === b.dataset.value);
    });
  }

  /* ── mount ──────────────────────────────────────────────────────────────── */
  let toggle = null;
  if (floating) {
    toggle = el('button', 'bi-themer-toggle');
    toggle.setAttribute('aria-label', 'Customize theme');
    toggle.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" '
      + 'stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true">'
      + '<path d="M4 8h9M17 8h3M4 16h3M11 16h9"/>'
      + '<circle cx="15" cy="8" r="2.2"/><circle cx="9" cy="16" r="2.2"/></svg>';
    toggle.addEventListener('click', () => panel.classList.toggle('open'));
    close.addEventListener('click', () => panel.classList.remove('open'));
    document.body.append(toggle, panel);
    if (opts.open) panel.classList.add('open');
  } else {
    close.remove();
    (host || document.body).append(panel);
    panel.classList.add('open');
  }

  syncInputs();
  apply();

  return {
    panel,
    state,
    get css() { return current.css; },
    set(next) { Object.assign(state, next); syncInputs(); apply(); },
    open() { panel.classList.add('open'); },
    close() { panel.classList.remove('open'); },
    destroy() { panel.remove(); toggle?.remove(); },
  };
}
