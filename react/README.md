# @buzz-ink/react

Typed React components for the [Buzz & Ink](../README.md) design system. The CSS
does the styling — these wrappers add the ergonomics: props, refs, a theme
context, and behavior (toast stack, dialog lifecycle).

```bash
npm install buzz-and-ink @buzz-ink/react   # (not yet published)
```

```tsx
import 'buzz-and-ink';                       // the CSS (tokens + components)
import { ThemeProvider, Button, useToast } from '@buzz-ink/react';

<ThemeProvider theme="light" radius="sharp" accent="rust">
  <App />
</ThemeProvider>
```

## Theming

`ThemeProvider` owns the six theming attributes — `theme`, `radius`, `contrast`,
`accent`, `neutral`, `paper` — and writes them to `<html>` (`scope="root"`, default)
or to a wrapping `<div class="bi">` (`scope="local"`). Read and change them
anywhere with the hook:

```tsx
const { accent, set } = useBuzzTheme();
set({ accent: 'amber', theme: 'dark' });
```

## Components

| Family | Exports |
|---|---|
| Core | `Button` `Card` `Tag` `Chip` `Badge` `Input` `Nav`/`NavItem` `Hr` |
| Type | `Kicker` `Display` `GhostNum` `GhostWord` |
| Forms | `Segmented` `Switch` `Checkbox` `Radio` `Select` |
| Feedback | `Progress` `Tooltip` `Modal` `ToastProvider`+`useToast` |
| Data | `Table` `Stat` |
| Editorial | `Ticker` `Frame` `Accordion` |

Notes:

- `Modal` rides the native `<dialog>` — pass `open` + `onClose`; Escape works for free.
- Toasts: wrap once in `<ToastProvider>`, then `useToast().toast('Saved.', { kind: 'ok' })`.
- `Ticker` duplicates its items internally for the seamless loop — pass them once.
- `NavItem` takes `as={Link}` for router links (must render an `<a>`).

## Demo

`npm run dev` in this folder serves a full component gallery with live theme controls.

MIT © Christopher Buzaid
