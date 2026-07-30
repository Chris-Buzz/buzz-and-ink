/* Buzz & Ink · icons — type declarations */

export type IconName =
  | 'arrow-right' | 'arrow-left' | 'arrow-up-right' | 'chevron-down' | 'chevron-right'
  | 'check' | 'x' | 'plus' | 'minus' | 'search' | 'menu' | 'settings' | 'user'
  | 'home' | 'folder' | 'file' | 'mail' | 'calendar' | 'clock' | 'star' | 'bolt'
  | 'sun' | 'moon' | 'bee' | 'hex' | 'graph' | 'code' | 'external' | 'chart'
  | 'send' | 'mic' | 'drop' | 'info' | 'alert' | 'trash';

/** Raw path data per icon (24×24 viewBox, stroke-based). */
export const ICONS: Record<IconName, string>;

/** Standalone inline SVG string for one icon. */
export function icon(name: IconName, cls?: string): string;

/** Mount the hidden <symbol> sprite once; reference icons via <use href="#bi-i-name">. */
export function injectIcons(doc?: Document): void;
