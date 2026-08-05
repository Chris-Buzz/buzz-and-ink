/* Buzz & Ink · themer — type declarations */

import type { BuzzInkTheme } from './theme';

export interface ThemerState {
  accent: string;
  neutral: string;
  paper: string;
  theme: 'light' | 'dark';
  radius: 'standard' | 'sharp' | 'soft';
  contrast: 'standard' | 'deep';
  type: 'fraunces' | 'bricolage';
}

export interface ThemerOptions {
  /** Where to mount. Omit for a floating panel in the corner. */
  mount?: string | HTMLElement;
  /** Floating panel + toggle button. Default true unless `mount` is given. */
  floating?: boolean;
  /** Start open. Floating panels start closed. */
  open?: boolean;
  /** Remember the last theme in localStorage. Default true. */
  persist?: boolean;
  /** Seed values that override the saved/default state. */
  initial?: Partial<ThemerState>;
  onChange?: (state: ThemerState, theme: BuzzInkTheme) => void;
}

export interface ThemerController {
  panel: HTMLElement;
  state: ThemerState;
  /** The generated stylesheet for the current seeds. */
  readonly css: string;
  set(next: Partial<ThemerState>): void;
  open(): void;
  close(): void;
  destroy(): void;
}

/** Seed triples the panel offers as presets. */
export const PRESETS: Record<string, { accent: string; neutral: string; paper: string }>;

/**
 * Mount the runtime theme customizer. Seeds three colors into createTheme(),
 * which derives every scale step in OKLCH, and flips the system's voice
 * attributes on `<html>`.
 */
export function themer(options?: ThemerOptions): ThemerController | null;
