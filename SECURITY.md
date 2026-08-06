# Security

## Reporting a vulnerability

Report privately through
[GitHub Security Advisories](https://github.com/Chris-Buzz/buzz-and-ink/security/advisories/new),
or email <cjpbuzaid@gmail.com>. Please don't open a public issue for a
vulnerability.

Expect an acknowledgement within 72 hours and an assessment within a week.

## What this package is, in security terms

Buzz & Ink is CSS plus a handful of small ES modules. It has **zero runtime
dependencies** — that is a deliberate security posture, not a coincidence, and
CI fails the build if a dependency is ever added. There is no install script, no
postinstall hook, and no network access at runtime.

The modules never call `eval`, `new Function`, or `document.write`, and never
fetch anything.

## Trust model

The system assumes **you control the data you pass it**. Where that assumption
could bite, the API is defensive anyway:

| Input | Treatment |
|---|---|
| Chart labels, series names, categories | HTML-escaped before entering the SVG string |
| Chart / sparkline colors | Allowlisted against a CSS-color character set, not escaped — a rejected color falls back to the series token |
| Chart tooltips | Built from `textContent` nodes, never markup |
| `icon(name)` | Own-property lookup, so inherited keys like `constructor` return `''` |
| `icon(name, cls)` | Class allowlist; a non-conforming value falls back to `bi-icon` rather than being interpolated |
| `createTheme({name})` | Must match `/^[A-Za-z0-9_-]{1,64}$/` — it lands in a CSS comment and an element id |
| `createTheme({selector})` | Validated against a conservative selector grammar and rejected if it contains `{` or `}` |
| `createTheme({accent, neutral, paper})` | Parsed as hex; throws on anything else |
| `themer()` persisted state | Rebuilt key-by-key from a known schema on read, so a tampered `localStorage` value cannot pollute `Object.prototype` or inject an attribute |
| `splitText()` / `typewriter()` | Only move existing nodes and create text nodes; nothing is re-parsed as markup |

### Where you still own the risk

- **`knowledgeGraph()` node labels** are drawn to `<canvas>` as text. That can't
  execute, but very long labels can degrade rendering — cap them.
- **`icon()` returns a string.** If you interpolate it into `innerHTML`
  alongside your own untrusted data, that data is still your responsibility.
  Prefer `injectIcons()` + `<use href="#bi-i-name">`, which involves no string
  building at all.
- **Slot values you pass through CSS custom properties** (`--shot`, `--pop`)
  land in a `background` declaration. Don't build them from user input.

## Content Security Policy

The package works under a strict CSP with one caveat per feature:

| Feature | Requirement |
|---|---|
| `buzz-and-ink` CSS | Nothing special. Serve the stylesheet from your own origin. |
| `charts`, `graph`, `motion`, `icons` | Nothing special — no inline styles or scripts are injected. |
| `createTheme().apply()` | Injects a `<style>` element, so it needs `style-src 'self' 'unsafe-inline'` **or** a nonce. To avoid `unsafe-inline`, write `theme.css` to a file at build time and ship it as a normal stylesheet — that is the recommended production path. |
| `themer()` | Same as `createTheme()`, plus `localStorage` access. It is a development and demo tool; you generally do not ship it. |

A workable baseline:

```
default-src 'self';
style-src 'self';
script-src 'self';
img-src 'self' data:;
```

`img-src data:` is needed because a few components use inline SVG data URIs for
checkmarks, squiggles, and the wave divider.

## Fonts

No fonts are bundled or fetched by the package. The examples load Google Fonts
over a `<link>`; if you'd rather not have a third-party origin in your CSP,
self-host the families and point `--bi-font-*` at them.

## Accessibility as a security-adjacent concern

Two defaults exist because losing them creates real risk of misreading data,
and both are enforced rather than suggested:

- Charts draw a legend for two or more series and keep a 2px surface gap
  between adjacent fills. The categorical palette only clears colorblind
  separation with that secondary encoding present.
- Status is never carried by color alone — dots ship with labels, deltas ship
  with arrow glyphs, and error messages ship with a `!` marker.

## Supported versions

| Version | Supported |
|---|---|
| 0.9.x | ✅ |
| < 0.9 | ❌ |

Pre-1.0, security fixes land on `main` and in the next minor release.
