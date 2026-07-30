import type { ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export function Tag({ className, ...rest }: ComponentPropsWithoutRef<'span'>) {
  return <span className={cx('bi-tag', className)} {...rest} />;
}

export interface ChipProps extends ComponentPropsWithoutRef<'span'> {
  /** Show the live status dot (default true). */
  dot?: boolean;
}

export function Chip({ dot = true, className, children, ...rest }: ChipProps) {
  return (
    <span className={cx('bi-chip', className)} {...rest}>
      {dot && <i aria-hidden="true" />}
      {children}
    </span>
  );
}

export interface BadgeProps extends ComponentPropsWithoutRef<'span'> {
  variant?: 'default' | 'live' | 'ink';
}

export function Badge({ variant = 'default', className, ...rest }: BadgeProps) {
  return (
    <span
      className={cx(
        'bi-badge',
        variant === 'live' && 'bi-badge--live',
        variant === 'ink' && 'bi-badge--ink',
        className,
      )}
      {...rest}
    />
  );
}
