import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cx } from './cx';

export interface TableProps extends ComponentPropsWithoutRef<'table'> {
  /** Quick API: column headers. Compose thead/tbody as children for full control. */
  head?: ReactNode[];
  /** Quick API: one array of cells per row. */
  rows?: ReactNode[][];
}

export function Table({ head, rows, className, children, ...rest }: TableProps) {
  return (
    <table className={cx('bi-table', className)} {...rest}>
      {head && (
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
      )}
      {rows && (
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      )}
      {children}
    </table>
  );
}

export interface StatProps extends ComponentPropsWithoutRef<'div'> {
  value: ReactNode;
  label: ReactNode;
}

export function Stat({ value, label, className, ...rest }: StatProps) {
  return (
    <div className={cx('bi-stat', className)} {...rest}>
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}
