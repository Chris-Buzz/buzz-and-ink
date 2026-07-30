import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cx } from './cx';

export interface TickerProps extends ComponentPropsWithoutRef<'div'> {
  items: ReactNode[];
  /** Seconds per loop (default 22). */
  duration?: number;
}

export function Ticker({ items, duration = 22, className, ...rest }: TickerProps) {
  // the strip translates -50% and loops, so it needs exactly two copies
  const strip = [...items, ...items];
  return (
    <div className={cx('bi-ticker', className)} {...rest}>
      <div style={{ animationDuration: `${duration}s` }}>
        {strip.map((item, i) => (
          <span key={i} aria-hidden={i >= items.length || undefined}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export interface FrameProps extends ComponentPropsWithoutRef<'figure'> {
  caption?: ReactNode;
}

export function Frame({ caption, className, children, ...rest }: FrameProps) {
  return (
    <figure className={cx('bi-frame', className)} {...rest}>
      {children}
      {caption !== undefined && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export interface AccordionProps extends ComponentPropsWithoutRef<'details'> {
  heading: ReactNode;
}

export function Accordion({ heading, className, children, ...rest }: AccordionProps) {
  return (
    <details className={cx('bi-acc', className)} {...rest}>
      <summary>{heading}</summary>
      <div>{children}</div>
    </details>
  );
}
