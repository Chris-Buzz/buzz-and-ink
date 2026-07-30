import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cx } from './cx';

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  /** Mono eyebrow line, e.g. "01 — WORK". */
  num?: string;
  /** Serif heading rendered as the card's <h3>. */
  heading?: ReactNode;
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { num, heading, interactive, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx('bi-card', interactive && 'bi-card--interactive', className)} {...rest}>
      {num !== undefined && <span className="bi-card-num">{num}</span>}
      {heading !== undefined && <h3>{heading}</h3>}
      {typeof children === 'string' ? <p>{children}</p> : children}
    </div>
  );
});
