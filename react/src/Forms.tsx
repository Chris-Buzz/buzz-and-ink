import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cx } from './cx';

export const Input = forwardRef<HTMLInputElement, ComponentPropsWithoutRef<'input'>>(
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} className={cx('bi-input', className)} {...rest} />;
  },
);

export interface SelectProps extends ComponentPropsWithoutRef<'select'> {
  /** Extra class for the wrapping <span class="bi-select"> (the chevron host). */
  wrapperClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ wrapperClassName, className, children, ...rest }, ref) {
    return (
      <span className={cx('bi-select', wrapperClassName)}>
        <select ref={ref} className={className} {...rest}>
          {children}
        </select>
      </span>
    );
  },
);

export interface CheckableProps extends ComponentPropsWithoutRef<'input'> {
  /** Label text rendered next to the control (children work too). */
  label?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckableProps>(
  function Checkbox({ label, className, children, ...rest }, ref) {
    return (
      <label className={cx('bi-check', className)}>
        <input ref={ref} type="checkbox" {...rest} />
        {label ?? children}
      </label>
    );
  },
);

export const Radio = forwardRef<HTMLInputElement, CheckableProps>(
  function Radio({ label, className, children, ...rest }, ref) {
    return (
      <label className={cx('bi-radio', className)}>
        <input ref={ref} type="radio" {...rest} />
        {label ?? children}
      </label>
    );
  },
);

export const Switch = forwardRef<HTMLInputElement, CheckableProps>(
  function Switch({ label, className, children, ...rest }, ref) {
    return (
      <label className={cx('bi-switch', className)}>
        <input ref={ref} type="checkbox" role="switch" {...rest} />
        <i aria-hidden="true" />
        {label ?? children}
      </label>
    );
  },
);

export interface SegmentedOption {
  label: ReactNode;
  value: string;
}

export interface SegmentedProps {
  options: ReadonlyArray<SegmentedOption | string>;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  'aria-label'?: string;
  id?: string;
}

export function Segmented({ options, value, onChange, className, ...rest }: SegmentedProps) {
  return (
    <div className={cx('bi-seg', className)} role="group" {...rest}>
      {options.map((o) => {
        const opt = typeof o === 'string' ? { label: o, value: o } : o;
        const on = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            className={on ? 'on' : undefined}
            aria-pressed={on}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
