/* ==========================================================================
   BUZZ & INK — motion utilities
   Scroll reveals for elements marked data-bi-reveal. Progressive: the CSS
   hidden state only activates once this script tags <html> with .bi-motion,
   so pages render fully visible without JavaScript. Respects
   prefers-reduced-motion by simply not activating.

     import {reveal} from 'buzz-and-ink/motion';
     reveal();                       // observe the whole document
     reveal(document.querySelector('#app'));   // or a subtree

   Stagger: data-bi-reveal="120" delays that element's reveal by 120ms.
   ========================================================================== */

/**
 * Activate scroll reveals for all [data-bi-reveal] elements in scope.
 * @param {ParentNode} [scope=document]
 * @param {{threshold?: number}} [options]
 * @returns {IntersectionObserver | null} the observer (disconnect() to stop),
 *   or null when reduced motion is on or IntersectionObserver is unavailable.
 */
export function reveal(scope = document, options = {}) {
  if (typeof window === 'undefined') return null;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  if (typeof IntersectionObserver === 'undefined') return null;

  document.documentElement.classList.add('bi-motion');

  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      }),
    { threshold: options.threshold ?? 0.15 },
  );

  scope.querySelectorAll('[data-bi-reveal]').forEach((el) => {
    const delay = el.getAttribute('data-bi-reveal');
    if (delay) el.style.transitionDelay = /[a-z]/.test(delay) ? delay : `${delay}ms`;
    io.observe(el);
  });

  return io;
}
