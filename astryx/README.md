# @buzz-ink/astryx

The **Buzz & Ink theme for [Astryx](https://github.com/facebook/astryx)** — Meta's
open-source design system — plus the voice bridge that lets Astryx components answer
to Buzz & Ink's theming attributes. You get Astryx's ~160 accessible components wearing
warm cream, working orange, rich ink, and Fraunces.

```tsx
import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import 'buzz-and-ink';                      // editorial layer + --bi-* tokens
import '@buzz-ink/astryx/voices.css';       // data-accent/neutral/paper → Astryx tokens

import {Theme} from '@astryxdesign/core/theme';
import {buzzInkTheme, buzzInkSharp, buzzInkSoft} from '@buzz-ink/astryx';

<Theme theme={buzzInkTheme} mode="light">
  <App />
</Theme>
```

## What's in the box

- **`buzzInkTheme`** — the standard editorial personality: cream surfaces, buzz-orange
  accent, warm ink text, tight radii, warm-tinted shadows, Fraunces/Inter/JetBrains type,
  brand-orange focus rings, status colors in sage/honey/brick, and semantic badges/dots
  restyled via Astryx component overrides.
- **`buzzInkSharp`** — zero radius + hard offset shadows (the print/brutalist voice).
- **`buzzInkSoft`** — pills + blurred orange glows.
- **`voices.css`** — the same `data-accent` (buzz/amber/rust), `data-neutral`
  (warm/carbon/espresso), and `data-paper` (cream/ivory/oat) attributes the Buzz & Ink
  CSS package uses, retargeted at Astryx's custom properties. One attribute on `<html>`
  re-skins both systems at once.

Dark mode is unified too: Astryx's `<Theme mode>` syncs `data-theme` onto `<html>`,
which is the exact attribute the Buzz & Ink CSS keys off. One toggle, two systems.

## Division of labor

| Layer | Provides |
|---|---|
| Astryx (`@astryxdesign/core`) | The workhorse components: forms, tables, dialogs, tabs, banners, command palettes… |
| This package | The look: tokens, type, edge personalities, voices |
| `buzz-and-ink` (CSS) | The editorial signature Astryx doesn't have: ghost words, tickers, kickers, rotated frames, numbered nav |

## Demo

`npx vite` in this folder (or `npm run dev`) serves a gallery of stock Astryx
components in full Buzz & Ink dress, editorial devices alongside, with live controls
for mode, edges, accent, ink, and paper.

## Licensing

- Astryx is © Meta Platforms, Inc., MIT-licensed. This package **does not** vendor or
  modify Astryx source; it themes it through Astryx's public `defineTheme` API.
  Keep Astryx's license notice when redistributing its code.
- The theme and voice CSS in this package are © Christopher Buzaid, MIT.
- "Astryx" is Meta's project name; this package is an independent theme and is not
  affiliated with or endorsed by Meta.
