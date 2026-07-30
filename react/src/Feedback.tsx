import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cx } from './cx';

/* ── progress ────────────────────────────────────────────────────────────── */

export interface ProgressProps extends ComponentPropsWithoutRef<'div'> {
  value: number;
  max?: number;
}

export function Progress({ value, max = 100, className, ...rest }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      className={cx('bi-progress', className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      {...rest}
    >
      <i style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ── tooltip (pure CSS, data-tip) ────────────────────────────────────────── */

export interface TooltipProps extends ComponentPropsWithoutRef<'span'> {
  tip: string;
}

export function Tooltip({ tip, className, children, ...rest }: TooltipProps) {
  return (
    <span className={cx('bi-tip', className)} data-tip={tip} {...rest}>
      {children}
    </span>
  );
}

/* ── modal (native <dialog>) ─────────────────────────────────────────────── */

export interface ModalProps {
  open: boolean;
  /** Called when the dialog closes for any reason (Escape, close(), backdrop). */
  onClose: () => void;
  heading?: ReactNode;
  /** Close when the backdrop is clicked (default false, matching the platform). */
  dismissOnBackdrop?: boolean;
  className?: string;
  children?: ReactNode;
}

export function Modal({ open, onClose, heading, dismissOnBackdrop = false, className, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cx('bi-modal', className)}
      onClose={onClose}
      onClick={dismissOnBackdrop ? (e) => { if (e.target === ref.current) onClose(); } : undefined}
    >
      {heading !== undefined && <h3>{heading}</h3>}
      {children}
    </dialog>
  );
}

/* ── toasts ──────────────────────────────────────────────────────────────── */

export type ToastKind = 'default' | 'ok' | 'warn';

export interface ToastOptions {
  kind?: ToastKind;
  /** Milliseconds before auto-dismiss; falls back to the provider default. */
  duration?: number;
}

interface ToastItem {
  id: number;
  message: ReactNode;
  kind: ToastKind;
}

export interface ToastContextValue {
  toast: (message: ReactNode, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  children: ReactNode;
  /** Default auto-dismiss in milliseconds. */
  duration?: number;
}

export function ToastProvider({ children, duration = 3200 }: ToastProviderProps) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const toast = useCallback<ToastContextValue['toast']>(
    (message, options) => {
      const id = nextId.current++;
      setItems((list) => [...list, { id, message, kind: options?.kind ?? 'default' }]);
      window.setTimeout(
        () => setItems((list) => list.filter((t) => t.id !== id)),
        options?.duration ?? duration,
      );
    },
    [duration],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted &&
        createPortal(
          <div className="bi-toasts">
            {items.map((t) => (
              <div
                key={t.id}
                role="status"
                className={cx(
                  'bi-toast',
                  t.kind === 'ok' && 'bi-toast--ok',
                  t.kind === 'warn' && 'bi-toast--warn',
                )}
              >
                {t.message}
              </div>
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside a <ToastProvider>');
  return ctx;
}
