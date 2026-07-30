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
Try it live in the playground's **Make it yours** section.

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

## Motion (v0.5)

Every interactive component runs on the motion tokens — consistent timing is what
"polish" is. Built in:

- **Micro-feedback** — buttons and the FAB press down (`:active` scale), checkboxes
  and radios pop on check, the switch knob lands on a soft spring, tab underlines
  slide via `transform: scaleX`.
- **Entrances** — modal (+ backdrop fade), dropdown menu, accordion, and tree
  children animate in; drawer and sheet glide on `--bi-dur-4`.
- **Scroll reveals (opt-in)** — mark elements `data-bi-reveal` (a value like `"120"`
  staggers by ms) and call:

```js
import {reveal} from 'buzz-and-ink/motion';
reveal();   // progressive: without JS (or with reduced motion) content is simply visible
```

Everything is `transform`/`opacity` only, and every animation — including reveals —
is disabled under `prefers-reduced-motion`.

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

## Playground

Open [`docs/index.html`](docs/index.html) in a browser (or `npm run docs`) — live controls
for all six theming attributes, plus the full palette and component gallery.

## Roadmap

- **npm publish** (both `buzz-and-ink` and `@buzz-ink/react`) — needs an npm account;
  the `files`/`exports` fields are already set.
- Docs site deployment (the playground is static — Vercel/GitHub Pages ready).

MIT © Christopher Buzaid
