import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'ghost';
  /** When set, renders an <a> instead of a <button>. */
  href?: string;
  target?: string;
  rel?: string;
}

export const Button = forwardRef<HTMLButtonElement & HTMLAnchorElement, ButtonProps>(
  function Button({ variant = 'primary', href, className, type, children, ...rest }, ref) {
    const cls = cx('bi-btn', variant === 'ghost' ? 'bi-btn--ghost' : 'bi-btn--primary', className);
    if (href !== undefined) {
      return (
        <a ref={ref} className={cls} href={href} {...(rest as ComponentPropsWithoutRef<'a'>)}>
          {children}
        </a>
      );
    }
    return (
      <button ref={ref} className={cls} type={type ?? 'button'} {...rest}>
        {children}
      </button>
    );
  },
);
