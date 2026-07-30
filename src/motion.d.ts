export interface RevealOptions {
  /** IntersectionObserver threshold. Default 0.15. */
  threshold?: number;
}

/**
 * Activate scroll reveals for all `[data-bi-reveal]` elements in scope.
 * Returns the observer (call `disconnect()` to stop), or null when reduced
 * motion is on or IntersectionObserver is unavailable.
 */
export function reveal(scope?: ParentNode, options?: RevealOptions): IntersectionObserver | null;
