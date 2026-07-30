import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { cx } from './cx';

export function Nav({ className, ...rest }: ComponentPropsWithoutRef<'nav'>) {
  return <nav className={cx('bi-nav', className)} {...rest} />;
}

export interface NavItemProps extends ComponentPropsWithoutRef<'a'> {
  active?: boolean;
  /**
   * Custom link component (e.g. react-router's Link). It must ultimately
   * render an <a> — the CSS counter numbering targets `.bi-nav a`.
   */
  as?: ElementType;
}

export function NavItem({ active, as: As = 'a', className, ...rest }: NavItemProps) {
  return <As className={cx(active && 'active', className)} {...rest} />;
}
