import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { cx } from './cx';

export type BiTheme = 'light' | 'dark';
export type BiRadius = 'sharp' | 'standard' | 'soft';
export type BiContrast = 'standard' | 'deep';
export type BiAccent = 'buzz' | 'amber' | 'rust';
export type BiNeutral = 'warm' | 'carbon' | 'espresso';
export type BiPaper = 'cream' | 'ivory' | 'oat';
export type BiType = 'fraunces' | 'bricolage';

export interface BiThemeState {
  theme: BiTheme;
  radius: BiRadius;
  contrast: BiContrast;
  accent: BiAccent;
  neutral: BiNeutral;
  paper: BiPaper;
  type: BiType;
}

export interface BiThemeContextValue extends BiThemeState {
  set: (patch: Partial<BiThemeState>) => void;
}

const DEFAULTS: BiThemeState = {
  theme: 'light',
  radius: 'standard',
  contrast: 'standard',
  accent: 'buzz',
  neutral: 'warm',
  paper: 'cream',
  type: 'fraunces',
};

const ATTRS: Record<keyof BiThemeState, string> = {
  theme: 'data-theme',
  radius: 'data-radius',
  contrast: 'data-contrast',
  accent: 'data-accent',
  neutral: 'data-neutral',
  paper: 'data-paper',
  type: 'data-type',
};

const ThemeContext = createContext<BiThemeContextValue | null>(null);

export interface ThemeProviderProps extends Partial<BiThemeState> {
  /**
   * 'root' (default) writes the data-* attributes onto <html>, theming the
   * whole document. 'local' renders a wrapping <div class="bi"> so a subtree
   * can carry its own theme.
   */
  scope?: 'root' | 'local';
  className?: string;
  children: ReactNode;
}

export function ThemeProvider({ scope = 'root', className, children, ...initial }: ThemeProviderProps) {
  const [state, setState] = useState<BiThemeState>({ ...DEFAULTS, ...initial });
  const value = useMemo<BiThemeContextValue>(
    () => ({ ...state, set: (patch) => setState((s) => ({ ...s, ...patch })) }),
    [state],
  );

  useEffect(() => {
    if (scope !== 'root') return;
    const el = document.documentElement;
    for (const key of Object.keys(ATTRS) as Array<keyof BiThemeState>) {
      el.setAttribute(ATTRS[key], state[key]);
    }
  }, [scope, state]);

  if (scope === 'local') {
    return (
      <ThemeContext.Provider value={value}>
        <div
          className={cx('bi', className)}
          data-theme={state.theme}
          data-radius={state.radius}
          data-contrast={state.contrast}
          data-accent={state.accent}
          data-neutral={state.neutral}
          data-paper={state.paper}
          data-type={state.type}
        >
          {children}
        </div>
      </ThemeContext.Provider>
    );
  }
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useBuzzTheme(): BiThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useBuzzTheme must be used inside a <ThemeProvider>');
  return ctx;
}
