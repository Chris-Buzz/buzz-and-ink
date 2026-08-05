# Buzz & Ink

An editorial design system in **warm cream, working orange, and rich ink** — extracted from
[chrisbuzaid.dev] and [lainow.com](https://www.lainow.com), generalized into tokens anyone
can theme. CSS-first and framework-agnostic, the way `@carbon/styles` is for Carbon.

```bash
npm install buzz-and-ink        # (not yet published — see Roadmap)
```

```css
@import 'buzz-and-ink';         /* tokens + components */
/* or pick a layer: */
@import 'buzz-and-ink/tokens';
@import 'buzz-and-ink/components';
```

## Theming: six attributes, one system

Everything hangs off attributes on `<html>` (or any subtree root — you can theme a single
section differently):

```html
<html data-theme="light" data-radius="standard" data-contrast="standard"
      data-accent="buzz" data-neutral="warm" data-paper="cream">
```

| Attribute | Values | What it does |
|---|---|---|
| `data-theme` | `light` · `dark` | full palette flip |
| `data-radius` | `sharp` · `standard` · `soft` | **edge personality** — corners *and* shadows switch together: sharp edges get hard offset shadows, soft edges get blurs |
| `data-contrast` | `standard` · `deep` | deep = whiter whites, deeper blacks, deeper orange |
| `data-accent` | `buzz` · `amber` · `rust` | **orange voice** — the working orange (default), golden, or earthy red-orange |
| `data-neutral` | `warm` · `carbon` · `espresso` | **ink voice** — warm neutrals (default), cool print grays, or coffee browns |
| `data-paper` | `cream` · `ivory` · `oat` | **paper voice** — cream (default), cooler/whiter, or warmer/toastier |
| `data-type` | `fraunces` · `bricolage` | **type voice** — editorial serif stack (Fraunces · Inter · JetBrains Mono) or modern grotesque (Bricolage Grotesque · Inter Tight · IBM Plex Mono) |

The voices work by remapping the base scales in place, so every semantic role follows.
The accent voice applies in both themes; neutral and paper shape the light theme.

## Bring your own colors

The built-in voices are presets. For **any** palette, `createTheme()` derives full
perceptual scales (OKLCH, gamut-clamped) from up to three seed hexes and remaps the
system in place — every component, theme, edge personality, and contrast mode follows:

```js
import {createTheme} from 'buzz-and-ink/theme';

const theme = createTheme({
  name: 'midnight',
  accent: '#7B61FF',    // → buzz-50…900
  neutral: '#5B6470',   // → ink-50…950
  paper: '#F4F6FA',     // → cream-0…200
});
theme.apply();                    // inject at runtime, or:
fs.writeFileSync('theme.css', theme.css);   // build-time CSS
```

Zero dependencies, ~150 lines, works in Node and the browser. Prefer pure CSS?
The override contract is the same thing by hand: redefine any `--bi-*` scale or
semantic token after the import — components only ever consume tokens.

For a control panel over the same engine — pickers, presets, and a copy-out
stylesheet — see [`themer()`](#the-theme-panel-v08).

## Tokens

- **Scales**: `--bi-buzz-50…900` (orange), `--bi-ink-50…950` (warm neutrals → rich black),
  `--bi-cream-0…200` (paper), plus `honey / sage / taupe / live` accents.
- **Alternate scales** behind the palette voices, also usable directly:
  `--bi-amber-*` and `--bi-rust-*` (oranges), `--bi-carbon-*` and `--bi-espresso-*`
  (neutrals), `--bi-ivory-*` and `--bi-oat-*` (papers).
- **Semantic roles**: `--bi-bg`, `--bi-surface`, `--bi-line`, `--bi-text`, `--bi-text-2/3`,
  `--bi-accent`, `--bi-accent-deep` — components consume only these, themes remap them.
- **Type voices**: three font slots (`--bi-font-display/body/mono`), two built-in
  stacks — `fraunces` (editorial serif, default) and `bricolage` (Bricolage Grotesque ·
  Inter Tight · IBM Plex Mono) via `data-type` — or swap the tokens for any fonts.
- **System scales**: spacing `--bi-space-1…10` (4px grid), z-index `--bi-z-*`
  (nav/fab/drawer/sheet/modal/command/toast/tip).
- **Motion scale**: durations `--bi-dur-1…4` (hover 140 · state 220 · entrance 340 ·
  panel 520ms) and three easings — `--bi-ease-out` (smooth default), `--bi-ease`
  (decisive settle), `--bi-ease-spring` (delight, used sparingly).
- Fonts are **not bundled**; bring your own (Google Fonts or self-hosted).

## Components (v0.4)

**Core** — `bi-btn` (primary/ghost) · `bi-card` (+interactive) · `bi-tag` · `bi-chip` ·
`bi-input` · `bi-kicker` · `bi-display` · `bi-ghost-num` · `bi-nav` (auto-numbered) ·
`bi-hr` (+labeled)

**Forms** — `bi-seg` (segmented) · `bi-switch` · `bi-check` · `bi-radio` · `bi-select`

**Feedback** — `bi-badge` (default/live/ink) · `bi-toast` (+ok/warn) · `bi-progress` ·
`bi-tip` (CSS tooltip) · `bi-modal` (native `<dialog>`)

**Data** — `bi-table` · `bi-stat`

**Editorial devices** — `bi-ticker` (marquee strip) · `bi-ghost-word` (outline watermark) ·
`bi-frame` (rotated media + mono caption) · `bi-acc` (native `<details>` accordion)

**General (v0.4)** — `bi-alert` (+ok/warn/error) · `bi-avatar` (+sizes, `bi-avatars` stack) ·
`bi-breadcrumbs` · `bi-pages` (pagination) · `bi-skeleton` · `bi-spinner` · `bi-slider` ·
`bi-steps` (stepper) · `bi-tabs` · `bi-dropdown` (native `<details>` menu) · `bi-code` /
`bi-codeblock` · `bi-empty` (empty state) · `bi-drawer` (+backdrop)

**Desktop (v0.4)** — `bi-window` / `bi-titlebar` (chrome + traffic dots) · `bi-toolbar` ·
`bi-statusbar` · `bi-kbd` · `bi-command` (command palette) · `bi-tree` (file tree)

**Mobile (v0.4)** — `bi-phone` (demo frame) · `bi-appbar` · `bi-bottomnav` (tab bar +
badge dot, safe-area aware) · `bi-sheet` (bottom sheet + backdrop) · `bi-fab` ·
`bi-list` (grouped settings rows)

All autonomous motion (ticker, toast entrance, skeleton shimmer) is disabled under
`prefers-reduced-motion`. Wrap your app root in class `bi` (or apply tokens globally
yourself). Overlays stack on the `--bi-z-*` scale.

**Data & shell (v0.8)** — `bi-chart` (see below) · `bi-spark` · `bi-table--{sortable,
sticky,zebra,numeric,compact,roomy}` + `bi-cell-dot` · `bi-stat-delta` /
`bi-stat-row` · `bi-app` / `bi-app-body` / `bi-app-main` (full-height shell) ·
`bi-sidebar` (+`--rail`) · `bi-menubar` · `bi-ctxmenu` · `bi-split` (+`--v`, drag bar) ·
`bi-timeline` · `bi-calendar` · `bi-meter` · `bi-rating` · `bi-banner`

All autonomous motion (ticker, toast entrance, skeleton shimmer) is disabled under
`prefers-reduced-motion`. Wrap your app root in class `bi` (or apply tokens globally
yourself). Overlays stack on the `--bi-z-*` scale.

## Motion (v0.8)

Every interactive component runs on the motion tokens — consistent timing is what
"polish" is. Built in:

- **Micro-feedback** — buttons and the FAB press down (`:active` scale), checkboxes
  and radios pop on check, the switch knob lands on a soft spring, tab underlines
  slide via `transform: scaleX`.
- **Entrances** — modal (+ backdrop fade), dropdown menu, accordion, and tree
  children animate in; drawer and sheet glide on `--bi-dur-4`.

Then the opt-in layer. One call wires every `data-bi-*` attribute on the page:

```js
import {initMotion} from 'buzz-and-ink/motion';
initMotion();
```

| Attribute | Effect |
|---|---|
| `data-bi-reveal` | fade + rise on scroll. Variants: `down` `left` `right` `scale` `blur` `clip` |
| `data-bi-stagger="60"` | on a container — cascades its children |
| `data-bi-delay="120"` | delay one element, in ms |
| `data-bi-split` | wrap words (or `="char"`) so a headline rises piece by piece |
| `data-bi-count="1284"` | count the number up when it scrolls in (`data-bi-decimals/prefix/suffix`) |
| `data-bi-parallax="0.3"` | scroll-linked drift |
| `data-bi-scroll-progress` | writes `--bi-progress` (0–1); pair with `.bi-scrollbar` |
| `data-bi-magnetic="0.4"` | element drifts toward the cursor |
| `data-bi-tilt="9"` | 3D tilt + `--bi-mx/--bi-my` for a `.bi-tilt-glare` layer |
| `data-bi-spotlight` | cursor-following glow via `--bi-spot-x/y` |

Plus surface treatments that need no JS: `.bi-aurora`, `.bi-gradient-text`,
`.bi-lift`, `.bi-sweep` (underline), `.bi-pulse`, `.bi-rule-draw`. And a
`spring()` helper for one-off JS animation.

Everything is `transform`/`opacity`/`filter` only, so it stays on the compositor.
The resting states live behind `.bi-motion`, which only the script adds — with
JavaScript off the page renders complete, never stuck at `opacity: 0`. Every
utility no-ops under `prefers-reduced-motion`.

## Icons (v0.8)

The system's own line set — 99 icons, 24×24, 1.5px stroke, round caps, drawn for the
editorial register. No emoji, ever. Inked by `currentColor`, so they take the
surrounding text color for free.

```js
import {injectIcons, icon, ICONS} from 'buzz-and-ink/icons';

injectIcons();   // once — mounts a hidden <symbol> sprite
```

```html
<svg class="bi-icon"><use href="#bi-i-search"/></svg>
<svg class="bi-icon bi-icon--l"><use href="#bi-i-trending-up"/></svg>
```

Sizes: `bi-icon` 16px, `--s` 13px, `--l` 20px. `icon('search')` returns a standalone
inline SVG string for templating; `ICONS` is the raw name → path map.

Coverage: navigation and direction, editing (`edit` `copy` `save` `undo`), data
(`filter` `sort` `table` `pie` `activity` `trending-up/down` `database` `layers`),
files (`download` `upload` `archive` `inbox` `link` `image`), state (`bell` `eye`
`lock` `shield` `flag`), commerce and people (`users` `credit-card` `tag` `heart`
`share`), media and device (`play` `refresh` `globe` `map-pin` `camera` `terminal`),
plus the house glyphs `bee`, `hex`, and `graph`.

## Charts (v0.8)

Token-driven SVG charts. Marks are painted with `var(--bi-series-N)` rather than a
resolved hex, so a chart re-inks the moment you flip a theme — no redraw, no
observer, no JS.

```js
import {barChart, lineChart, donutChart, sparkline} from 'buzz-and-ink/charts';

lineChart(el, {
  categories: ['Mon', 'Tue', 'Wed'],
  series: [{name: 'Reads', values: [12, 19, 14]}],
  area: true,
});

sparkline(cell, {values: [3, 5, 4, 9]});   // inline, for table cells and stat tiles
```

`barChart` (grouped or `stacked`), `lineChart` (+`area`, `curve`, `points`),
`areaChart`, `donutChart`, `sparkline`. Each returns `{update(), destroy()}` and
re-renders on container resize.

The six-slot series palette is **computed, not eyeballed** — validated for OKLCH
lightness band, chroma floor, adjacent-pair separation under deuteranopia /
protanopia / tritanopia, and contrast against its own surface. Dark mode gets its
own steps, re-picked against the dark surface rather than flipped.

Two defaults are load-bearing rather than decorative: a legend is drawn for 2+
series, and adjacent/stacked fills keep a 2px surface gap. The palette only clears
colorblind separation *with* that secondary encoding.

A lone series follows `--bi-accent` instead — it has no neighbour to be confused
with, so it can stay on brand and follow a custom theme. Two or more fall back to
the fixed validated ramp.

## The theme panel (v0.8)

`createTheme()` (above) takes three seed colors and derives every scale step in
OKLCH. `themer()` puts a control panel on top of it:

```js
import {themer} from 'buzz-and-ink/themer';
themer();                       // floating panel, bottom-right
themer({mount: '#panel'});      // or inline, in your own chrome
```

Pick an accent, neutral, and paper — the engine derives ~27 perceptually even,
gamut-clamped steps, and every semantic role, component, chart, and voice follows,
in light, dark, and deep contrast alike. Six presets ship with it. **Copy CSS**
hands back a stylesheet you can paste into a project and drop the panel entirely.

Customization is not a fork: you seed three colors, the system does the rest.

## Knowledge graph (v0.7)

A force-directed knowledge graph on `<canvas>`, drawn entirely with the live tokens —
flip `data-theme`, `data-accent`, or any voice and it re-inks itself, no re-init.
Zero dependencies, ~9 kB of ES module.

```js
import {knowledgeGraph} from 'buzz-and-ink/graph';

const g = knowledgeGraph(document.querySelector('#graph'), {
  nodes: [{id: 'tokens', label: 'tokens', hub: true}, {id: 'button', label: 'button'}],
  edges: [{from: 'tokens', to: 'button'},                 // structure (hairline)
          {from: 'fraunces', to: 'bricolage', kind: 'soft'},  // affinity (dashed)
          {from: 'tokens', to: 'waggle', accent: true}],  // brand relation (accent)
  onSelect: node => console.log(node),
});
g.filter('motion');   // spotlight matches, veil the rest → returns match count
g.fit(); g.zoomIn();  g.destroy();
```

Hover spotlights a node's neighborhood; drag nodes to re-pin them, drag the canvas to
pan, wheel/pinch to zoom, click to select, double-click to re-fit. Physics sleeps once
the layout settles (near-zero idle cost) and wakes on drag. The accent color is
reserved for the *active* thing — hover, selection, matches, and explicitly marked
`accent` edges — so the graph keeps the system's restraint. Under
`prefers-reduced-motion` the layout settles instantly and idle drift is disabled.

Chrome floats over the canvas via `.bi-graph-hud--{tl,tr,bl,bc}` — compose the shipped
`.bi-graph-legend` card, `.bi-btn` zoom controls, and a `.bi-input` search into any
corner. Section 12 of the playground maps the design system with itself.

## React

[`react/`](react/) holds **`@buzz-ink/react`** — typed React wrappers for every component
(ThemeProvider + `useBuzzTheme()`, toast stack, native-dialog modal, and the rest).
See [`react/README.md`](react/README.md). `npm run dev` in that folder serves a live
component gallery with all six theme controls.

## Astryx

[`astryx/`](astryx/) holds **`@buzz-ink/astryx`** — the Buzz & Ink theme for
[Meta's Astryx design system](https://github.com/facebook/astryx) (MIT). It puts
Astryx's ~160 accessible components in this palette via `defineTheme` (three edge
personalities: `buzzInkTheme` / `buzzInkSharp` / `buzzInkSoft`), and its `voices.css`
makes the `data-accent` / `data-neutral` / `data-paper` attributes drive Astryx's tokens
too — one attribute re-skins both systems. See [`astryx/README.md`](astryx/README.md).

## Playground & examples

Open [`docs/index.html`](docs/index.html) in a browser (or `npm run docs`) — live controls
for all six theming attributes, plus the full palette and component gallery.

Four complete applications, each built from the shipped components rather than
one-off CSS:

| Example | | What it exercises |
|---|---|---|
| [`examples/hive-desk/`](examples/hive-desk/) | desktop | Newsroom CMS — menubar, sidebar, resizable split, sortable table, tabs, tree, command palette (`⌘K`), context menu, drawer, statusbar, meters, timeline |
| [`examples/comb/`](examples/comb/) | desktop | Readership analytics — KPI tiles with deltas and sparklines, line/area, grouped ⇄ stacked bars, donut, filterable sortable data grid, scroll progress |
| [`examples/apiary/`](examples/apiary/) | mobile | Field operations — four screens, app bar, bottom nav, bottom sheet, FAB, settings list, calendar, rating, live charts |
| [`examples/waggle/`](examples/waggle/) | marketing | Long-form product page — scroll reveals, ticker, knowledge graph |

All four are static files. `npm run docs` serves the repo root; the examples load
`../../src/index.css` directly, so edits to the system show up on refresh.

## Roadmap

- **npm publish** (both `buzz-and-ink` and `@buzz-ink/react`) — needs an npm account;
  the `files`/`exports` fields are already set.
- Docs site deployment (the playground is static — Vercel/GitHub Pages ready).

MIT © Christopher Buzaid
