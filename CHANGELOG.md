# Changelog

All notable changes to `buzz-and-ink`. This project follows
[Semantic Versioning](https://semver.org/); pre-1.0, minor versions may contain
breaking changes and will say so here.

## [0.9.0] — 2026-08-06

The completeness release. v0.8 could build a dashboard; v0.9 can build a
product — forms, validation, selection, print, and the accessibility surface
that was missing.

### Added — surface themes
- `data-surface` — five light palettes (`cream`, `white`, `ivory`, `sand`,
  `slate`) and five dark (`ink`, `carbon`, `black`, `midnight`, `espresso`).
  Complete sets rather than tints: each defines its own bg, raised surface, two
  hairline weights and three text tiers. `black` is a true black for OLED;
  `carbon` is a neutral charcoal with no colour cast. Omitting the attribute
  keeps the previous cream/ink defaults, so nothing changes for existing work.
- All ten verified against their own background and their own raised surface —
  text ≥ 7:1, secondary ≥ 4.5:1, meta ≥ 3:1, hairlines ≥ 1.35:1 — with a test
  that re-checks every one on each run. The first pass failed: light hairlines
  measured 1.27:1 and disappeared on a bright screen.
- The theme panel gained surface swatches that preview the palette they apply,
  and now adopts whatever the page already declares instead of resetting it.

### Added — forms
- `bi-field`, `bi-label`, `bi-help`, `bi-error` — the field wrapper the system
  never had. Validation styling keys off `aria-invalid` rather than a class, so
  the accessible state and the visible state cannot drift apart.
- `bi-textarea`, input sizes (`--s`, `--l`), `bi-input-group` with addons,
  prefixes, icons, and welded buttons (the focus ring moves to the wrapper via
  `:focus-within`, so the group lights up as one control).
- `bi-fieldset`, `bi-field-row`, `bi-count-hint`, `bi-dropzone`, `bi-file`.
- Disabled and read-only states across every control.

### Added — buttons
- Sizes `--s` / `--l`, `--danger`, `--quiet`, `--icon` (square, label moves to
  `aria-label`), `bi-btn-group`, `bi-actions`.
- `data-loading="true"` keeps the label in the DOM — width never jumps and the
  accessible name survives — while showing a spinner.

### Added — data
- Table selection (`aria-selected` rows, `.pick` column), `bi-table-bulk`
  action bar, and empty / loading states.
- `bi-popover`, `bi-dl` (description list), `bi-page-head`, `bi-panel`.

### Added — accessibility & output
- `bi-sr-only` (+ `--focusable` for skip links) using the clip-path pattern, so
  content stays in the accessibility tree.
- `@media (forced-colors: active)` fallbacks — custom properties are discarded
  in Windows high contrast, so components that relied on background alone get
  real borders.
- A full `@media print` stylesheet: screen chrome removed, ink to black on
  white, `break-inside` protection, and link targets revealed.

### Added — the play layer (opt-in)
Buzz & Ink stays editorial by default. None of this is on unless you ask.
- `data-mood="playful" | "bold"` — retunes radius, easing, duration, tilt, and
  animation amplitude in one attribute.
- Pop palette: eight surface/ink pairs, every pair verified ≥ 4.5:1 so text on
  a colored surface is always readable (worst pair 5.37:1).
- Accent voices `punch`, `electric`, `mint`.
- `bi-note`, `bi-tape`, `bi-sticker`, `bi-ribbon`, `bi-bubble`, `bi-polaroid`,
  `bi-mark`, `bi-squiggle`, `bi-blob`, `bi-wave`, `bi-flip`, `bi-burst`,
  `bi-counter`, `bi-doodle-arrow`, `bi-rainbow`, `bi-shine`, textures.
- Motion: `confetti()`, `ripple()`, `typewriter()`, `scramble()`,
  `cursorTrail()`, plus CSS hover and idle personalities.

### Added — engineering
- A test suite on the Node built-in runner — zero dependencies, `npm test`.
  Covers the OKLCH scale maths, gamut clamping, stylesheet integrity, and a
  named regression for every security fix below.
- GitHub Actions CI: tests on Node 20/22/24, a dependency-free assertion, a
  publish-tarball audit, and a credential scan.
- `SECURITY.md` with the trust model, per-input treatment, and CSP guidance.

### Changed
- **Type scale raised.** The old scale bottomed out at 9px for mono caps —
  small, uppercase, and letter-spaced at once, which is the least legible
  combination available. The floor is now 11px (`--bi-text-2xs`), and no
  component sets a size in raw px: every one reads the scale, so overriding six
  values re-scales the whole UI. A test enforces this.
- `data-density="compact" | "comfortable"` retunes the scale and spacing.
- Scroll reveals now animate the independent `translate` / `scale` properties
  instead of the `transform` shorthand, so a component that rests at a rotation
  is no longer flattened when it animates in.
- `splitText()` walks the node tree instead of flattening `textContent`, so
  inline markup inside a split heading survives.

### Fixed
- Form fields in a `.bi-field-row` no longer sit one space-step lower than
  their neighbour — the adjacent-sibling rhythm margin was leaking into the
  horizontal grid, where the grid's own `gap` already owns spacing.
- Table rules render evenly. Two causes: the last row's `border-bottom` stacked
  against a following footer's `border-top` into a doubled line, and rows landed
  on fractional pixels, so a 1px border was rasterised across two device rows at
  half opacity and read as faded or cut. Cells now have a fixed line-height and
  min-height, putting every rule back on a whole pixel.
- Chart tooltips no longer render as an empty box on load — a class-level
  `display` was outranking the UA sheet's `[hidden]`.
- `bi-polaroid > .shot` exposes a `--shot` custom property instead of hardcoding
  its background; the descendant selector previously outranked any single class
  a consumer wrote.
- `bi-progress--candy` layers its stripes over the fill rather than replacing
  it — `background-image` is one property, so the bar had been rendering empty.
- Speech-bubble tails scale with the corner radius, so they clear the curve at
  every `data-mood`.

### Security
- `icon(name)` uses an own-property lookup — a bare index reached inherited keys,
  so `icon('constructor')` found a function and stringified it into the output.
- `icon(name, cls)` allowlists the class attribute. It previously interpolated
  `cls` unescaped into `class="…"`, so a quote could break out into markup.
- `createTheme({name})` and `{selector}` are validated. Both were interpolated
  into a generated stylesheet: a name could close the CSS comment early and a
  selector could close the rule block and append arbitrary rules.
- `themer()` rebuilds its persisted state key-by-key from a known schema.
  `JSON.parse` + `Object.assign` let a tampered `localStorage` value reach the
  `__proto__` setter and pollute `Object.prototype` for the whole page.

## [0.8.0] — 2026-08-05

### Added
- `buzz-and-ink/charts` — token-driven SVG bar, line, area, donut, and
  sparkline. Marks are painted with `var(--bi-series-N)`, so a chart re-inks on
  a theme flip with no redraw. The six-slot categorical palette is validated for
  lightness band, chroma floor, colorblind separation, and surface contrast;
  dark mode gets its own steps rather than an automatic flip.
- `buzz-and-ink/themer` — a control panel over `createTheme()` with presets,
  live pickers, and a copy-out stylesheet.
- Motion layer: reveal variants, container staggering, parallax, scroll
  progress, magnetic, tilt, spotlight, count-up, split text, and `spring()`.
- Table upgrades, stat deltas, app shell (sidebar / menubar / context menu /
  split), timeline, calendar, meter, rating, banner.
- Icons 36 → 99.
- Examples: `hive-desk`, `comb`, `apiary`.

## [0.7.0] — 2026-08-05

Initial public release. Tokens, components, six theming attributes, OKLCH
`createTheme()`, the knowledge graph, and the `waggle` example.
