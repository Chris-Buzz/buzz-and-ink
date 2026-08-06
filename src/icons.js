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

  /* ── v0.8 — the application set ────────────────────────────────────────────
     Everything a real product screen reaches for: editing, filtering, state,
     navigation, commerce, media. Same grammar as above — 24×24, 1.5 stroke,
     round caps, geometric, no emoji. ──────────────────────────────────────── */

  /* navigation & direction */
  'chevron-left':   '<path d="m15 6-6 6 6 6"/>',
  'chevron-up':     '<path d="m6 15 6-6 6 6"/>',
  'arrow-up':       '<path d="M12 20V5M6 11l6-6 6 6"/>',
  'arrow-down':     '<path d="M12 4v15M6 13l6 6 6-6"/>',
  'sort':           '<path d="M7 4v16M4 17l3 3 3-3M17 20V4M14 7l3-3 3 3"/>',
  'expand':         '<path d="M9 4H4v5M15 4h5v5M15 20h5v-5M9 20H4v-5"/>',
  'collapse':       '<path d="M4 9h5V4M20 9h-5V4M20 15h-5v5M4 15h5v5"/>',
  'more-h':         '<circle cx="5.5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18.5" cy="12" r="1.4"/>',
  'more-v':         '<circle cx="12" cy="5.5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="18.5" r="1.4"/>',

  /* editing */
  'edit':           '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m14.5 5.5 4 4"/>',
  'copy':           '<rect x="9" y="9" width="11" height="11" rx="1.5"/><path d="M15 6.5V5a1.5 1.5 0 0 0-1.5-1.5h-9A1.5 1.5 0 0 0 3 5v9A1.5 1.5 0 0 0 4.5 15H6"/>',
  'clipboard':      '<path d="M9 4.5H7A1.5 1.5 0 0 0 5.5 6v13A1.5 1.5 0 0 0 7 20.5h10A1.5 1.5 0 0 0 18.5 19V6A1.5 1.5 0 0 0 17 4.5h-2"/><rect x="9" y="2.8" width="6" height="3.4" rx="1"/>',
  'save':           '<path d="M5 4.5h11L19.5 8v11.5a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5v-15a.5.5 0 0 1 .5-.5z"/><path d="M8 4.5v5h7M8 20v-5.5h8V20"/>',
  'undo':           '<path d="M4 9h11a4.5 4.5 0 0 1 0 9h-6"/><path d="m7.5 5.5-3.5 3.5 3.5 3.5"/>',
  'redo':           '<path d="M20 9H9a4.5 4.5 0 0 0 0 9h6"/><path d="m16.5 5.5 3.5 3.5-3.5 3.5"/>',

  /* data & filtering */
  'filter':         '<path d="M3.5 5h17l-6.5 7.5V20l-4-2.5v-5z"/>',
  'sliders':        '<path d="M4 8h9M17 8h3M4 16h3M11 16h9"/><circle cx="15" cy="8" r="2.2"/><circle cx="9" cy="16" r="2.2"/>',
  'grid':           '<rect x="3.5" y="3.5" width="7" height="7" rx="1"/><rect x="13.5" y="3.5" width="7" height="7" rx="1"/><rect x="3.5" y="13.5" width="7" height="7" rx="1"/><rect x="13.5" y="13.5" width="7" height="7" rx="1"/>',
  'list':           '<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4.2" cy="6" r="1.2"/><circle cx="4.2" cy="12" r="1.2"/><circle cx="4.2" cy="18" r="1.2"/>',
  'table':          '<rect x="3.5" y="4.5" width="17" height="15" rx="1.5"/><path d="M3.5 9.5h17M9.5 9.5v10M15 9.5v10"/>',
  'pie':            '<path d="M12 3.2v8.8h8.8A8.8 8.8 0 0 0 12 3.2z"/><path d="M20.3 15A8.8 8.8 0 1 1 9 3.7"/>',
  'activity':       '<path d="M3 12h4l3-7 4 14 3-7h4"/>',
  'trending-up':    '<path d="M3 17 9.5 10.5l4 4L21 7"/><path d="M15.5 7H21v5.5"/>',
  'trending-down':  '<path d="M3 7 9.5 13.5l4-4L21 17"/><path d="M15.5 17H21v-5.5"/>',
  'database':       '<ellipse cx="12" cy="6" rx="7.5" ry="3"/><path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6"/><path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3"/>',
  'layers':         '<path d="m12 3 8.5 4.5L12 12 3.5 7.5z"/><path d="m3.5 12 8.5 4.5L20.5 12"/><path d="m3.5 16.5 8.5 4.5 8.5-4.5"/>',

  /* files & storage */
  'download':       '<path d="M12 3.5v11"/><path d="m7.5 10 4.5 4.5 4.5-4.5"/><path d="M4.5 17v2.5h15V17"/>',
  'upload':         '<path d="M12 15V3.5"/><path d="M7.5 8 12 3.5 16.5 8"/><path d="M4.5 17v2.5h15V17"/>',
  'archive':        '<rect x="3.5" y="4" width="17" height="4.5" rx="1"/><path d="M5.5 8.5V19a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V8.5"/><path d="M10 12h4"/>',
  'inbox':          '<path d="M3.5 13.5h5l1.5 3h4l1.5-3h5"/><path d="M6 4.5h12l2.5 9V19a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-5.5z"/>',
  'box':            '<path d="M20.5 8.5 12 12 3.5 8.5 12 5z"/><path d="M3.5 8.5V16l8.5 3.5 8.5-3.5V8.5"/><path d="M12 12v7.5"/>',
  'link':           '<path d="M10 13.5a3.5 3.5 0 0 0 5 0l3-3a3.54 3.54 0 0 0-5-5l-1.5 1.5"/><path d="M14 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.54 3.54 0 0 0 5 5l1.5-1.5"/>',
  'image':          '<rect x="3.5" y="4.5" width="17" height="15" rx="1.5"/><circle cx="9" cy="10" r="1.8"/><path d="m4.5 17.5 5-5 4.5 4.5 3-2.5 3.5 3.5"/>',
  'file-text':      '<path d="M6 3h8l4 4.5V21H6z"/><path d="M14 3v4.5h4"/><path d="M9 12.5h6M9 16h4"/>',

  /* state & feedback */
  'bell':           '<path d="M6.5 10a5.5 5.5 0 0 1 11 0c0 4.5 1.5 6 1.5 6h-14s1.5-1.5 1.5-6z"/><path d="M10.2 19a2 2 0 0 0 3.6 0"/>',
  'eye':            '<path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
  'eye-off':        '<path d="M9.6 6.2A8.5 8.5 0 0 1 12 5.8c6 0 9.5 6.2 9.5 6.2a17 17 0 0 1-3.2 4M6.2 8A17 17 0 0 0 2.5 12S6 18.2 12 18.2a8.8 8.8 0 0 0 3.6-.75"/><path d="m4 4 16 16"/>',
  'lock':           '<rect x="4.5" y="10" width="15" height="10.5" rx="1.5"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10"/>',
  'unlock':         '<rect x="4.5" y="10" width="15" height="10.5" rx="1.5"/><path d="M8 10V7.5a4 4 0 0 1 7.6-1.7"/>',
  'shield':         '<path d="M12 3 4.5 6v6c0 4.6 3.1 7.8 7.5 9 4.4-1.2 7.5-4.4 7.5-9V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
  'help':           '<circle cx="12" cy="12" r="8.8"/><path d="M9.6 9.6a2.5 2.5 0 1 1 3.3 2.4c-.6.2-.9.8-.9 1.4v.4M12 16.6v.4"/>',
  'flag':           '<path d="M5.5 21V4"/><path d="M5.5 5h9l-1.2 3 1.2 3h-9z"/>',
  'award':          '<circle cx="12" cy="9" r="5.5"/><path d="m8.6 13.6-1.1 7 4.5-2.4 4.5 2.4-1.1-7"/>',

  /* commerce & people */
  'users':          '<circle cx="9.5" cy="8" r="3.4"/><path d="M3.5 20c1.1-3.2 3.3-4.8 6-4.8s4.9 1.6 6 4.8"/><path d="M16.5 5.2a3.4 3.4 0 0 1 0 5.6M17.5 15.6c1.7.6 2.9 2 3.6 4.4"/>',
  'credit-card':    '<rect x="2.5" y="5.5" width="19" height="13" rx="2"/><path d="M2.5 10h19M6 14.5h3"/>',
  'dollar':         '<path d="M12 2.8v18.4"/><path d="M16.5 7.2c-.7-1.6-2.4-2.4-4.5-2.4-2.5 0-4.2 1.2-4.2 3.1 0 4.6 9.2 2.4 9.2 7.2 0 2-1.9 3.3-4.7 3.3-2.4 0-4.2-.9-5-2.6"/>',
  'tag':            '<path d="M11.5 3.5H20V12l-8.8 8.8a1.5 1.5 0 0 1-2.1 0l-6.4-6.4a1.5 1.5 0 0 1 0-2.1z"/><circle cx="16.2" cy="7.8" r="1.4"/>',
  'pin':            '<path d="M12 21v-6.5"/><path d="M8 3.5h8l-1 5 2.5 2.5v1.5h-11V11L9 8.5z"/>',
  'bookmark':       '<path d="M6.5 3.5h11v17l-5.5-4-5.5 4z"/>',
  'heart':          '<path d="M12 20.2 4.9 13a4.6 4.6 0 0 1 7.1-5.7A4.6 4.6 0 0 1 19.1 13z"/>',
  'share':          '<circle cx="18" cy="5.5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="18.5" r="2.6"/><path d="m8.4 10.7 7.2-3.9M8.4 13.3l7.2 3.9"/>',
  'log-out':        '<path d="M14 4.5H6a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 6 19.5h8"/><path d="M17 8.5 20.5 12 17 15.5M20.5 12H10"/>',
  'key':            '<circle cx="7.5" cy="12" r="3.8"/><path d="M11.3 12H21M18 12v3M15 12v2.2"/>',

  /* media & device */
  'play':           '<path d="M7.5 4.8 19 12 7.5 19.2z"/>',
  'pause':          '<path d="M9 5v14M15 5v14"/>',
  'refresh':        '<path d="M20.5 12a8.5 8.5 0 1 1-2.5-6"/><path d="M20.5 4v5h-5"/>',
  'globe':          '<circle cx="12" cy="12" r="8.8"/><path d="M3.4 12h17.2"/><path d="M12 3.2a13 13 0 0 1 0 17.6 13 13 0 0 1 0-17.6z"/>',
  'map-pin':        '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
  'phone':          '<path d="M7.5 3.5 10 8l-2.2 2a12 12 0 0 0 6.2 6.2L16 14l4.5 2.5v3A1.5 1.5 0 0 1 19 21C10.4 20.4 3.6 13.6 3 5a1.5 1.5 0 0 1 1.5-1.5z"/>',
  'camera':         '<path d="M3.5 7.5h3.8L9 5h6l1.7 2.5h3.8a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1V8.5a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.6"/>',
  'message':        '<path d="M20.5 15a1.5 1.5 0 0 1-1.5 1.5H8L4 20V5a1.5 1.5 0 0 1 1.5-1.5H19A1.5 1.5 0 0 1 20.5 5z"/>',
  'wifi':           '<path d="M2.5 9a14 14 0 0 1 19 0M5.8 12.5a9.4 9.4 0 0 1 12.4 0M9 16a4.7 4.7 0 0 1 6 0"/><circle cx="12" cy="19.3" r="1.1"/>',
  'terminal':       '<rect x="3" y="4.5" width="18" height="15" rx="1.5"/><path d="m7 10 2.5 2.5L7 15M12.5 15.5H17"/>',
  'printer':        '<path d="M7 8.5V3.5h10v5"/><rect x="3.5" y="8.5" width="17" height="7.5" rx="1.5"/><path d="M7 13.5h10V21H7z"/>',

  /* ── v0.9 — the expressive set ─────────────────────────────────────────────
     The system had no vocabulary for delight — nothing to put on a sticker, a
     celebration, or an empty state that wanted to be warm rather than neutral.
     Same grammar as everything above: 24×24, 1.5 stroke, round caps, drawn
     not borrowed. Still no emoji — these ink with currentColor and sit on the
     baseline like type. ──────────────────────────────────────────────────── */

  'sparkle':        '<path d="M12 2.8 13.9 9 20 10.9 13.9 12.8 12 19 10.1 12.8 4 10.9 10.1 9z"/><path d="M18.6 3.4v3M20.1 4.9h-3M5.4 16.6v2.4M6.6 17.8H4.2"/>',
  'sparkles':       '<path d="M9.5 3.2 11 8l4.8 1.5L11 11 9.5 15.8 8 11 3.2 9.5 8 8z"/><path d="M17.2 13.4 18.2 16.4 21.2 17.4 18.2 18.4 17.2 21.4 16.2 18.4 13.2 17.4 16.2 16.4z"/>',
  'star-burst':     '<path d="m12 2.6 2.3 4.9 5.3-1.4-1.4 5.3 4.9 2.3-4.9 2.3 1.4 5.3-5.3-1.4L12 21.4l-2.3-4.5-5.3 1.4 1.4-5.3L.9 11.7l4.9-2.3-1.4-5.3 5.3 1.4z"/>',
  'party':          '<path d="M3.2 21 9 8.2 16.4 15z"/><path d="M13.5 6.5c.6-1.7 2.2-2.6 3.6-2M18 9.5c1.4-.9 3.2-.6 4.2.6M14.8 2.6l.5 1.7M20.6 5.1l-1.5 1M21.6 12.2l-1.8-.3"/>',
  'gift':           '<rect x="3.2" y="9.5" width="17.6" height="11" rx="1.5"/><path d="M2.5 9.5h19M12 9.5V20.5"/><path d="M12 9.5C10.5 6.5 9 4.5 7.2 4.5a2.3 2.3 0 0 0 0 5zM12 9.5c1.5-3 3-5 4.8-5a2.3 2.3 0 0 1 0 5z"/>',
  'crown':          '<path d="M3.2 7.5 6.5 13 12 5.5 17.5 13l3.3-5.5V19H3.2z"/><path d="M3.2 15.5h17.6"/>',
  'flame':          '<path d="M12 21c3.9 0 6.5-2.5 6.5-6 0-4.5-4.5-6.2-3.5-11-2.5.8-4.5 3-4.5 5.5 0 1.6.6 2.4.6 3.2 0 1-.8 1.8-1.8 1.8s-1.8-.9-1.8-2.4c-1.2 1.2-2 3-2 4.9C5.5 18.5 8.1 21 12 21z"/>',
  'rocket':         '<path d="M12 2.5c3.2 2.4 5 6 5 10.2l-2.4 3H9.4L7 12.7C7 8.5 8.8 4.9 12 2.5z"/><circle cx="12" cy="10" r="2"/><path d="M9.4 15.7 7 17.2v3l2.6-1.4M14.6 15.7 17 17.2v3l-2.6-1.4"/>',
  'smile':          '<circle cx="12" cy="12" r="8.8"/><path d="M8.6 14.2a4.4 4.4 0 0 0 6.8 0"/><path d="M9.2 9.4v.6M14.8 9.4v.6"/>',
  'heart-hand':     '<path d="M12 20.4 6.2 14.8a3.6 3.6 0 0 1 5.1-5.1l.7.7.7-.7a3.6 3.6 0 0 1 5.1 5.1z"/><path d="M12 9.7V3.4"/>',
  'thumbs-up':      '<path d="M7 10.5 11.2 3a2.4 2.4 0 0 1 2.3 3l-.9 3.6h5.3a2 2 0 0 1 2 2.5l-1.6 6.4a2 2 0 0 1-2 1.5H7z"/><rect x="2.8" y="10.5" width="4.2" height="10.5" rx="1"/>',
  'music':          '<circle cx="6" cy="17.5" r="2.8"/><circle cx="17.5" cy="15" r="2.8"/><path d="M8.8 17.5v-11l11.5-2.5v11"/><path d="M8.8 9.5 20.3 7"/>',
  'coffee':         '<path d="M3.5 8.5h13V15a4.5 4.5 0 0 1-4.5 4.5H8A4.5 4.5 0 0 1 3.5 15z"/><path d="M16.5 10.5h2a2.5 2.5 0 0 1 0 5h-2"/><path d="M7 5.5V3M11 5.5V3"/>',
  'leaf':           '<path d="M4.5 19.5C3 13 7 5.5 20 4.5c1 12-6 16.5-12.5 15"/><path d="M4.5 19.5C8 15 12 12.5 16.5 11"/>',
  'cloud':          '<path d="M7 18.5a4.2 4.2 0 0 1-.5-8.4 5.6 5.6 0 0 1 10.8-1.2A3.9 3.9 0 0 1 17.5 18.5z"/>',
  'rainbow':        '<path d="M2.5 19.5a9.5 9.5 0 0 1 19 0"/><path d="M6 19.5a6 6 0 0 1 12 0"/><path d="M9.5 19.5a2.5 2.5 0 0 1 5 0"/>',
  'umbrella':       '<path d="M2.8 12.2a9.2 9.2 0 0 1 18.4 0z"/><path d="M12 12.2V19a2.2 2.2 0 0 0 4.4 0"/><path d="M12 3v-.8"/>',
  'balloon':        '<path d="M12 15.5c3 0 5.2-2.8 5.2-6.3S15 3 12 3 6.8 5.7 6.8 9.2s2.2 6.3 5.2 6.3z"/><path d="m12 15.5-1 1.6h2z"/><path d="M11.5 17.5c1.5 1.2-.8 2 .5 3.5"/>',
  'wand':           '<path d="m4 20 11-11"/><path d="m14 6 4 4"/><path d="M18.5 2.5v3M20 4h-3M6.5 3.5v2.2M7.6 4.6H5.4M20.5 13v2.2M21.6 14.1h-2.2"/>',
  'palette':        '<path d="M12 21a9 9 0 1 1 9-9c0 2-1.6 2.8-3.2 2.8h-1.6a2 2 0 0 0-1.4 3.4A1.9 1.9 0 0 1 12 21z"/><circle cx="7.8" cy="12" r="1.1"/><circle cx="9.8" cy="8" r="1.1"/><circle cx="14.2" cy="7.6" r="1.1"/><circle cx="17" cy="10.8" r="1.1"/>',
  'trophy':         '<path d="M7.5 3.5h9v6a4.5 4.5 0 0 1-9 0z"/><path d="M7.5 5.5H4.8v1.6a3 3 0 0 0 2.7 3M16.5 5.5h2.7v1.6a3 3 0 0 1-2.7 3"/><path d="M12 14v3.5M8.5 20.5h7l-.8-3h-5.4z"/>',
  'target':         '<circle cx="12" cy="12" r="8.8"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>',
  'compass':        '<circle cx="12" cy="12" r="8.8"/><path d="m15.4 8.6-2 5.4-5.4 2 2-5.4z"/>',
  'anchor':         '<circle cx="12" cy="5" r="2.4"/><path d="M12 7.4V21"/><path d="M7.5 11.5h9"/><path d="M3.5 14.5A8.5 8.5 0 0 0 12 21a8.5 8.5 0 0 0 8.5-6.5"/>',
  'puzzle':         '<path d="M10 3.5h4v2.2a1.8 1.8 0 1 0 3.6 0V3.5h2.9v6h-2.2a1.8 1.8 0 1 0 0 3.6h2.2v7.4h-6v-2.2a1.8 1.8 0 1 0-3.6 0v2.2H3.5v-6h2.2a1.8 1.8 0 1 0 0-3.6H3.5v-4H10z"/>',
  'moon-star':      '<path d="M20 13.5A8.5 8.5 0 1 1 10.5 4a7 7 0 0 0 9.5 9.5z"/><path d="m17.6 2.6.9 2 2 .9-2 .9-.9 2-.9-2-2-.9 2-.9z"/>',
};

const wrap = (inner, attrs = '') =>
  `<svg ${attrs}viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" ` +
  `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

/**
 * Class names are an allowlist, not an escape: this string is returned for
 * interpolation into markup, so a quote in `cls` would close the attribute and
 * everything after it becomes markup the browser trusts. Only the characters
 * a CSS class can legally contain get through.
 */
const CLASS_OK = /^[A-Za-z0-9 _-]*$/;

/**
 * Standalone inline SVG string for one icon.
 *
 * `name` is looked up with a own-property check rather than plain `ICONS[name]`
 * — a bare index reaches inherited keys, so `icon('constructor')` would find a
 * function, pass the truthiness test, and stringify into the output.
 *
 * @param {string} name  Key from ICONS. Unknown names return ''.
 * @param {string} [cls] Class attribute. Non-conforming values fall back to
 *   'bi-icon' rather than being escaped — a mangled class is a silent bug,
 *   a rejected one is not.
 */
export const icon = (name, cls = 'bi-icon') => {
  if (!Object.hasOwn(ICONS, name)) return '';
  const safeCls = CLASS_OK.test(cls) ? cls : 'bi-icon';
  return wrap(ICONS[name], `class="${safeCls}" `);
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
