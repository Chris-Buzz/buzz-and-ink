import type { ComponentPropsWithoutRef, ElementType, HTMLAttributes, ReactNode } from 'react';
import { cx } from './cx';

export function Kicker({ className, ...rest }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cx('bi-kicker', className)} {...rest} />;
}

export interface DisplayProps extends HTMLAttributes<HTMLElement> {
  /** Heading element to render, e.g. 'h1' (default), 'h2', 'p'. */
  as?: ElementType;
}

export function Display({ as: As = 'h1', className, ...rest }: DisplayProps) {
  return <As className={cx('bi-display', className)} {...rest} />;
}

export function GhostNum({ className, ...rest }: ComponentPropsWithoutRef<'span'>) {
  return <span className={cx('bi-ghost-num', className)} aria-hidden="true" {...rest} />;
}

export function GhostWord({ className, ...rest }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cx('bi-ghost-word', className)} aria-hidden="true" {...rest} />;
}

export interface HrProps extends ComponentPropsWithoutRef<'div'> {
  /** When given, renders the labeled variant with the text centered in the rule. */
  label?: ReactNode;
}

export function Hr({ label, className, ...rest }: HrProps) {
  if (label === undefined) {
    return <hr className={cx('bi-hr', className)} {...(rest as ComponentPropsWithoutRef<'hr'>)} />;
  }
  return (
    <div className={cx('bi-hr', 'bi-hr--labeled', className)} role="separator" {...rest}>
      <span>{label}</span>
    </div>
  );
}
