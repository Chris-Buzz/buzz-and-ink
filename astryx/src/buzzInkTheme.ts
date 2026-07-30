/**
 * Buzz & Ink theme for Astryx (https://github.com/facebook/astryx, MIT © Meta
 * Platforms, Inc.). Maps the Buzz & Ink palette — warm cream, working orange,
 * rich ink — onto Astryx's token system.
 *
 * Three edge personalities, mirroring the CSS package's data-radius attribute:
 *   buzzInkTheme  — standard (editorial default)
 *   buzzInkSharp  — zero radius + hard offset shadows
 *   buzzInkSoft   — pills + blurred orange glows
 *
 * The accent/neutral/paper voices live in voices.css (they retarget Astryx
 * custom properties off the same data-* attributes the CSS package uses).
 */
import {defineTheme} from '@astryxdesign/core/theme';

export const buzzInkTheme = defineTheme({
  name: 'buzz-ink',

  typography: {
    scale: {base: 15, ratio: 1.2},
    body: {
      family: 'Inter',
      fallbacks: 'system-ui, -apple-system, "Segoe UI", sans-serif',
    },
    heading: {
      family: 'Fraunces',
      fallbacks: 'Georgia, "Times New Roman", serif',
    },
    code: {
      family: 'JetBrains Mono',
      fallbacks: 'ui-monospace, "SF Mono", Consolas, monospace',
    },
  },

  motion: {fast: 140, medium: 320, slow: 720, ratio: 0.75},

  tokens: {
    // Backgrounds — cream paper (light) / warm espresso-black (dark)
    '--color-background-surface': ['#FFFDF8', '#241D14'],
    '--color-background-body': ['#FAF6EE', '#181310'],
    '--color-background-card': ['#FFFDF8', '#241D14'],
    '--color-background-popover': ['#FFFDF8', '#241D14'],
    '--color-background-muted': ['#F3ECDD', '#1F1911'],

    // Accent — the working orange
    '--color-accent': ['#D9701E', '#E28C3F'],
    '--color-accent-muted': ['#FAE4CE', '#3A2510'],
    '--color-neutral': ['#241E170F', '#F2EAD91A'],

    // Overlays — warm ink scrims, never pure black in light mode
    '--color-overlay': ['#241E1780', '#000000CC'],
    '--color-overlay-hover': ['#241E170D', '#F2EAD90D'],
    '--color-overlay-pressed': ['#241E171A', '#F2EAD91A'],

    // Text — rich ink on cream / cream on ink
    '--color-text-primary': ['#241E17', '#F2EAD9'],
    '--color-text-secondary': ['#6E6350', '#B8AA8F'],
    '--color-text-disabled': ['#A29278', '#8A7C63'],
    '--color-text-accent': ['#B25A12', '#ECA96C'],
    '--color-on-dark': '#FFFDF8',
    '--color-on-light': '#241E17',
    '--color-on-accent': ['#FFFFFF', '#241E17'],

    '--color-icon-accent': ['#B25A12', '#ECA96C'],
    '--color-icon-primary': ['#241E17', '#F2EAD9'],
    '--color-icon-secondary': ['#6E6350', '#B8AA8F'],
    '--color-icon-disabled': ['#A29278', '#8A7C63'],

    // Status — sage green, honey amber, warm brick (never neon)
    '--color-success': ['#3E7A50', '#9FD3AA'],
    '--color-error': ['#9C2B2B', '#EFA9A0'],
    '--color-warning': ['#8A6116', '#EFC983'],
    '--color-success-muted': ['#D9E9D5', '#5FA3743D'],
    '--color-error-muted': ['#F4D6D0', '#C266593D'],
    '--color-warning-muted': ['#F6E5C4', '#DFA2513D'],

    // Borders — cream hairlines / warm dark lines
    '--color-border': ['#E6DBC5', '#3A3122'],
    '--color-border-emphasized': ['#C9BCA4', '#55493A'],

    // Effects
    '--color-skeleton': ['#EDE3CE', '#3A3122'],
    '--color-shadow': ['#241E171A', '#0000004D'],

    // Categorical orange retuned to the buzz scale so charts/badges match brand
    '--color-background-orange': ['#FAE4CE', '#E28C3F3D'],
    '--color-border-orange': ['#F4C9A0', '#E28C3F'],
    '--color-icon-orange': ['#94490D', '#ECA96C'],
    '--color-text-orange': ['#94490D', '#F4C9A0'],

    // Radius — tighter than Astryx defaults; the editorial standard
    '--radius-none': '0px',
    '--radius-inner': '2px',
    '--radius-element': '4px',
    '--radius-container': '8px',
    '--radius-page': '14px',
    '--radius-full': '9999px',

    // Shadows — warm-tinted, subtle; dark mode gets a faint cream rim
    '--shadow-low':
      '0 1px 2px light-dark(rgba(36,30,23,.05), rgba(0,0,0,.3)), ' +
      '0 4px 14px light-dark(rgba(36,30,23,.07), rgba(0,0,0,.45)), ' +
      'inset 0 0 0 1px light-dark(transparent, rgba(242,234,217,.06))',
    '--shadow-med':
      '0 2px 4px light-dark(rgba(36,30,23,.05), rgba(0,0,0,.4)), ' +
      '0 16px 48px light-dark(rgba(36,30,23,.11), rgba(0,0,0,.55)), ' +
      'inset 0 0 0 1px light-dark(transparent, rgba(242,234,217,.09))',
    '--shadow-high':
      '0 4px 6px light-dark(rgba(36,30,23,.09), rgba(0,0,0,.5)), ' +
      '0 20px 60px light-dark(rgba(36,30,23,.16), rgba(0,0,0,.7)), ' +
      'inset 0 0 0 1px light-dark(transparent, rgba(242,234,217,.12))',

    // Focus/selection rings in brand orange instead of Astryx blue
    '--shadow-inset-hover': 'inset 0px 0px 0px 2px #D9701E4D',
    '--shadow-inset-selected': 'inset 0px 0px 0px 2px #D9701E80',
    '--shadow-inset-success': 'inset 0px 0px 0px 2px #5FA3744D',
    '--shadow-inset-warning': 'inset 0px 0px 0px 2px #DFA2514D',
    '--shadow-inset-error': 'inset 0px 0px 0px 2px #9C2B2B4D',
  },

  components: {
    // Semantic badges: filled, in the Buzz & Ink status palette.
    // Dark mode flips to dark text on the brighter fill (contrast holds).
    badge: {
      'variant:info': {
        backgroundColor: 'light-dark(#D9701E, #E28C3F)',
        color: 'light-dark(#FFFFFF, #241E17)',
      },
      'variant:success': {
        backgroundColor: 'light-dark(#3E7A50, #6FAF7C)',
        color: 'light-dark(#FFFFFF, #14100B)',
      },
      'variant:warning': {
        backgroundColor: '#DFA251',
        color: '#241E17',
      },
      'variant:error': {
        backgroundColor: 'light-dark(#9C2B2B, #D9776B)',
        color: 'light-dark(#FFFFFF, #14100B)',
      },
    },

    // Status dots read as fills, matched to the badge fills above
    statusdot: {
      'variant:accent': {backgroundColor: 'light-dark(#D9701E, #E28C3F)'},
      'variant:success': {backgroundColor: '#5FA374'},
      'variant:warning': {backgroundColor: '#DFA251'},
      'variant:error': {backgroundColor: 'light-dark(#9C2B2B, #D9776B)'},
    },
  },
});

/** Zero radius, hard offset shadows — the print/brutalist personality. */
export const buzzInkSharp = defineTheme({
  name: 'buzz-ink-sharp',
  extends: buzzInkTheme,
  radius: {base: 4, multiplier: 0},
  tokens: {
    '--shadow-low': '3px 3px 0 light-dark(#241E17, #000000)',
    '--shadow-med': '4px 4px 0 light-dark(#241E17, #000000)',
    '--shadow-high': '7px 7px 0 light-dark(#241E17, #000000)',
  },
});

/** Pills and blurred orange glows — the friendly personality. */
export const buzzInkSoft = defineTheme({
  name: 'buzz-ink-soft',
  extends: buzzInkTheme,
  tokens: {
    '--radius-inner': '8px',
    '--radius-element': '12px',
    '--radius-container': '18px',
    '--radius-page': '26px',
    '--shadow-low':
      '0 2px 8px light-dark(rgba(36,30,23,.06), rgba(0,0,0,.35)), ' +
      '0 8px 24px light-dark(rgba(217,112,30,.10), rgba(226,140,63,.12))',
    '--shadow-med':
      '0 4px 10px light-dark(rgba(36,30,23,.06), rgba(0,0,0,.45)), ' +
      '0 22px 60px light-dark(rgba(217,112,30,.13), rgba(226,140,63,.16))',
    '--shadow-high':
      '0 6px 14px light-dark(rgba(36,30,23,.08), rgba(0,0,0,.55)), ' +
      '0 30px 80px light-dark(rgba(217,112,30,.18), rgba(226,140,63,.2))',
  },
});
