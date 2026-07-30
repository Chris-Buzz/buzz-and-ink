/* ── Buzz & Ink · icons (v0.7) ───────────────────────────────────────────────
   The system's own line-icon set — 24×24 viewBox, 1.5px stroke, round caps,
   drawn for the editorial register (no emoji, ever). Inked by currentColor.

     import { injectIcons, icon, ICONS } from 'buzz-and-ink/icons'
     injectIcons()                       // once — mounts a hidden <symbol> sprite
     <svg class="bi-icon"><use href="#bi-i-search"/></svg>

   `icon('search')` returns a standalone inline SVG string for templating.
──────────────────────────────────────────────────────────────────────────── */

export const ICONS = {
  'arrow-right':    '<path d="M4 12h15M13 6l6 6-6 6"/>',
  'arrow-left':     '<path d="M20 12H5M11 6l-6 6 6 6"/>',
  'arrow-up-right': '<path d="M7 17 17 7M8 7h9v9"/>',
  'chevron-down':   '<path d="m6 9 6 6 6-6"/>',
  'chevron-right':  '<path d="m9 6 6 6-6 6"/>',
  'check':          '<path d="m4 12.5 5 5L20 6.5"/>',
  'x':              '<path d="M6 6l12 12M18 6 6 18"/>',
  'plus':           '<path d="M12 5v14M5 12h14"/>',
  'minus':          '<path d="M5 12h14"/>',
  'search':         '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.2-4.2"/>',
  'menu':           '<path d="M4 7h16M4 12h16M4 17h16"/>',
  'settings':       '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/>',
  'user':           '<circle cx="12" cy="8" r="3.8"/><path d="M4.5 20.5c1.4-3.8 4.2-5.7 7.5-5.7s6.1 1.9 7.5 5.7"/>',
  'home':           '<path d="m4 11 8-7 8 7"/><path d="M6 9.5V20h12V9.5"/>',
  'folder':         '<path d="M3 6.5h6l2 2.5h10V19H3z"/>',
  'file':           '<path d="M6 3h8l4 4.5V21H6z"/><path d="M14 3v4.5h4"/>',
  'mail':           '<rect x="3" y="5.5" width="18" height="13" rx="1.5"/><path d="m3.5 7.5 8.5 6 8.5-6"/>',
  'calendar':       '<rect x="4" y="5" width="16" height="15.5" rx="1.5"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  'clock':          '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.2 3.2"/>',
  'star':           '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.9-5.2-2.7-5.2 2.7 1-5.9-4.3-4.1 5.9-.9z"/>',
  'bolt':           '<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/>',
  'sun':            '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.5 1.5M17.3 17.3l1.5 1.5M18.8 5.2l-1.5 1.5M6.7 17.3l-1.5 1.5"/>',
  'moon':           '<path d="M20 13.5A8.5 8.5 0 1 1 10.5 4a7 7 0 0 0 9.5 9.5z"/>',
  'bee':            '<ellipse cx="12" cy="13.5" rx="4.6" ry="6"/><path d="M8.6 11h6.8M7.8 13.5h8.4M8.6 16h6.8"/><path d="M8.5 8.5C6 6.5 5.5 4 7 3.4s3.6 1.6 4.5 4M15.5 8.5c2.5-2 3-4.5 1.5-5.1s-3.6 1.6-4.5 4"/>',
  'hex':            '<path d="M12 2.8 19.8 7.3v9.2L12 21.2 4.2 16.5V7.3z"/>',
  'graph':          '<circle cx="6" cy="17.5" r="2.2"/><circle cx="12.5" cy="6.5" r="2.2"/><circle cx="18" cy="15.5" r="2.2"/><path d="m7.2 15.6 4.2-7M13.7 8.3l3.2 5.4M8.2 17.2l7.6-1.3"/>',
  'code':           '<path d="m8 7-5 5 5 5M16 7l5 5-5 5"/>',
  'external':       '<path d="M14 4h6v6M20 4 10.5 13.5"/><path d="M20 13.5V20H4V4h6.5"/>',
  'chart':          '<path d="M5 20v-6M11 20V7.5M17 20v-9.5"/><path d="M3 20h18"/>',
  'send':           '<path d="M21 3 3 10.8l7 2.2 2 7z"/><path d="M21 3 10 13"/>',
  'mic':            '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3"/>',
  'drop':           '<path d="M12 3s6 6.7 6 11a6 6 0 0 1-12 0c0-4.3 6-11 6-11z"/>',
  'info':           '<circle cx="12" cy="12" r="8.8"/><path d="M12 11v5M12 7.8v.4"/>',
  'alert':          '<path d="M12 3.5 2.5 19.5h19z"/><path d="M12 9.5v4.5M12 16.8v.4"/>',
  'trash':          '<path d="M4 7h16M9.5 7V4h5v3M6 7l1 13.5h10L18 7M10 11v6M14 11v6"/>',
};

const wrap = (name, inner, attrs = '') =>
  `<svg ${attrs}viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" ` +
  `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

/** Standalone inline SVG string for one icon. */
export const icon = (name, cls = 'bi-icon') => {
  const d = ICONS[name];
  return d ? wrap(name, d, `class="${cls}" `) : '';
};

/** Mount the <symbol> sprite once; then reference via <use href="#bi-i-name">. */
export const injectIcons = (doc = document) => {
  if (doc.getElementById('bi-icon-sprite')) return;
  const div = doc.createElement('div');
  div.innerHTML =
    `<svg id="bi-icon-sprite" width="0" height="0" style="position:absolute" aria-hidden="true">` +
    Object.entries(ICONS).map(([n, d]) =>
      `<symbol id="bi-i-${n}" viewBox="0 0 24 24" fill="none" stroke="currentColor" ` +
      `stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${d}</symbol>`).join('') +
    `</svg>`;
  doc.body.prepend(div.firstChild);
};
