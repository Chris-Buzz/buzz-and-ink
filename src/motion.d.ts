/* Buzz & Ink · motion — type declarations */

export interface RevealOptions {
  /** IntersectionObserver threshold. Default 0.15. */
  threshold?: number;
  /** Reveal once and stop observing. Default true. */
  once?: boolean;
  /** IntersectionObserver rootMargin. Default '0px 0px -8% 0px'. */
  rootMargin?: string;
}

/** True when the user has asked for reduced motion. Every utility checks this. */
export function prefersReducedMotion(): boolean;

/**
 * Activate scroll reveals for `[data-bi-reveal]` elements in scope.
 * Variants: `up` (default), `down`, `left`, `right`, `scale`, `blur`, `clip`.
 * Stagger a group with `[data-bi-stagger="60"]` on the parent, or delay one
 * element with `[data-bi-delay="120"]`.
 * Returns the observer (`disconnect()` to stop), or null when reduced motion
 * is on or IntersectionObserver is unavailable.
 */
export function reveal(scope?: ParentNode, options?: RevealOptions): IntersectionObserver | null;

/** Scroll-linked parallax for `[data-bi-parallax="0.3"]`. Returns a teardown. */
export function parallax(scope?: ParentNode): () => void;

/**
 * Drive a `--bi-progress` custom property (0–1) on `[data-bi-scroll-progress]`
 * from document scroll, or from one element when the attribute holds a
 * selector. Returns a teardown.
 */
export function scrollProgress(scope?: ParentNode): () => void;

/** Cursor attraction for `[data-bi-magnetic="0.4"]`. Pointer devices only. */
export function magnetic(scope?: ParentNode): () => void;

/**
 * 3D tilt toward the cursor for `[data-bi-tilt="9"]`. Also writes `--bi-mx`
 * and `--bi-my` (0–1) so a `.bi-tilt-glare` layer can track the pointer.
 */
export function tilt(scope?: ParentNode): () => void;

/** Writes `--bi-spot-x` / `--bi-spot-y` on `[data-bi-spotlight]` for glows. */
export function spotlight(scope?: ParentNode): () => void;

/**
 * Animate `[data-bi-count="1284"]` up when it scrolls into view. Supports
 * `data-bi-decimals`, `data-bi-prefix`, `data-bi-suffix`, `data-bi-duration`,
 * and `data-bi-group="false"` to drop thousands separators.
 */
export function countUp(scope?: ParentNode): IntersectionObserver | null;

/**
 * Wrap words (or characters, with `data-bi-split="char"`) in spans so a line
 * can cascade. Each piece carries `--bi-i` for the CSS delay.
 */
export function splitText(scope?: ParentNode): void;

export interface SpringOptions {
  from?: number;
  to?: number;
  /** Default 170. */
  stiffness?: number;
  /** Default 22. */
  damping?: number;
  /** Default 1. */
  mass?: number;
  onUpdate: (value: number) => void;
  onRest?: () => void;
}

/** Spring-physics tween for one-off JS animation. Returns a cancel function. */
export function spring(options: SpringOptions): () => void;

/** Wire every utility above over a scope. Returns a teardown for all of them. */
export function initMotion(
  scope?: ParentNode,
  options?: { reveal?: RevealOptions },
): () => void;
