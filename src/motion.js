/* ==========================================================================
   BUZZ & INK — motion
   The system's motion layer. Scroll reveals, scroll-linked parallax and
   progress, pointer-driven magnetics and tilt, count-ups, and text splitting.

   Every utility is progressive: the CSS resting state only activates once a
   script tags <html> with .bi-motion, so a page with JavaScript disabled
   renders fully visible and fully readable. Every utility no-ops under
   prefers-reduced-motion — that check happens once, here, so callers never
   have to think about it.

     import {initMotion} from 'buzz-and-ink/motion';
     initMotion();               // wire every data-bi-* attribute on the page

   Or take them one at a time:

     import {reveal, parallax, magnetic, tilt, countUp} from 'buzz-and-ink/motion';

   Zero dependencies. Everything drives transform and opacity only, so it
   stays on the compositor.
   ========================================================================== */

const isBrowser = typeof window !== 'undefined';

/** One place to ask. Everything below bails on `true`. */
export function prefersReducedMotion() {
  return (
    isBrowser &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Tag <html> so the CSS resting states switch on. Idempotent. */
function armMotion() {
  document.documentElement.classList.add('bi-motion');
}

/** Parse "120" or "120ms" or ".2s" into ms. */
function toMs(value) {
  if (!value) return 0;
  const v = String(value).trim();
  if (v.endsWith('ms')) return parseFloat(v);
  if (v.endsWith('s')) return parseFloat(v) * 1000;
  return parseFloat(v) || 0;
}

/* ── scroll reveal ─────────────────────────────────────────────────────────
   <div data-bi-reveal>                      fade + rise (the default)
   <div data-bi-reveal="up|down|left|right|scale|blur|clip">
   <div data-bi-reveal data-bi-delay="120">  stagger by 120ms
   <ul data-bi-stagger="60">                 auto-delay each child by 60ms
   ------------------------------------------------------------------------ */

/**
 * Activate scroll reveals for [data-bi-reveal] elements in scope.
 * @param {ParentNode} [scope=document]
 * @param {{threshold?: number, once?: boolean, rootMargin?: string}} [options]
 * @returns {IntersectionObserver | null} observer (disconnect() to stop), or
 *   null when reduced motion is on or IntersectionObserver is unavailable.
 */
export function reveal(scope = document, options = {}) {
  if (!isBrowser || prefersReducedMotion()) return null;
  if (typeof IntersectionObserver === 'undefined') return null;

  armMotion();

  const once = options.once ?? true;

  // Containers hand their children an incremental delay, so a grid cascades
  // without anyone hand-writing a delay per card.
  scope.querySelectorAll('[data-bi-stagger]').forEach((group) => {
    const gap = toMs(group.getAttribute('data-bi-stagger')) || 60;
    const base = toMs(group.getAttribute('data-bi-delay'));
    Array.from(group.children).forEach((child, i) => {
      if (!child.hasAttribute('data-bi-reveal')) child.setAttribute('data-bi-reveal', '');
      if (!child.hasAttribute('data-bi-delay')) child.setAttribute('data-bi-delay', String(base + i * gap));
    });
  });

  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          if (once) io.unobserve(entry.target);
        } else if (!once) {
          entry.target.classList.remove('in');
        }
      }),
    { threshold: options.threshold ?? 0.15, rootMargin: options.rootMargin ?? '0px 0px -8% 0px' },
  );

  scope.querySelectorAll('[data-bi-reveal]').forEach((el) => {
    // Back-compat: v0.5 put the delay in the attribute value itself.
    const legacy = el.getAttribute('data-bi-reveal');
    const delay = el.getAttribute('data-bi-delay') || (/^[\d.]+m?s?$/.test(legacy || '') ? legacy : null);
    if (delay) el.style.transitionDelay = `${toMs(delay)}ms`;
    io.observe(el);
  });

  return io;
}

/* ── parallax ──────────────────────────────────────────────────────────────
   <div data-bi-parallax="0.3">     moves at 30% of scroll (negative = opposite)
   ------------------------------------------------------------------------ */

/**
 * Scroll-linked parallax on [data-bi-parallax] elements.
 * @returns {() => void} teardown
 */
export function parallax(scope = document) {
  if (!isBrowser || prefersReducedMotion()) return () => {};

  const items = Array.from(scope.querySelectorAll('[data-bi-parallax]')).map((el) => ({
    el,
    rate: parseFloat(el.getAttribute('data-bi-parallax')) || 0.2,
  }));
  if (!items.length) return () => {};

  let frame = 0;
  const update = () => {
    frame = 0;
    const mid = window.innerHeight / 2;
    for (const { el, rate } of items) {
      const box = el.getBoundingClientRect();
      // Distance of this element's centre from the viewport centre, so the
      // effect is symmetric on the way in and the way out.
      const offset = (box.top + box.height / 2 - mid) * rate;
      el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    }
  };
  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  return () => {
    if (frame) cancelAnimationFrame(frame);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    items.forEach(({ el }) => (el.style.transform = ''));
  };
}

/* ── scroll progress ───────────────────────────────────────────────────────
   <div data-bi-scroll-progress>            0→1 of the whole document
   <div data-bi-scroll-progress="#article"> 0→1 across one element
   Writes --bi-progress (0–1) on the element; style it however you like.
   ------------------------------------------------------------------------ */

/** Drive a --bi-progress custom property from scroll position. */
export function scrollProgress(scope = document) {
  if (!isBrowser) return () => {};

  const items = Array.from(scope.querySelectorAll('[data-bi-scroll-progress]')).map((el) => ({
    el,
    target: el.getAttribute('data-bi-scroll-progress')
      ? document.querySelector(el.getAttribute('data-bi-scroll-progress'))
      : null,
  }));
  if (!items.length) return () => {};

  let frame = 0;
  const update = () => {
    frame = 0;
    for (const { el, target } of items) {
      let p;
      if (target) {
        const box = target.getBoundingClientRect();
        const total = box.height - window.innerHeight;
        p = total > 0 ? -box.top / total : box.top <= 0 ? 1 : 0;
      } else {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        p = total > 0 ? window.scrollY / total : 0;
      }
      el.style.setProperty('--bi-progress', Math.min(1, Math.max(0, p)).toFixed(4));
    }
  };
  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  return () => {
    if (frame) cancelAnimationFrame(frame);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  };
}

/* ── magnetic ──────────────────────────────────────────────────────────────
   <button data-bi-magnetic="0.4">   drifts toward the cursor within its box
   ------------------------------------------------------------------------ */

/** Cursor-attracted elements. Feels expensive; costs one transform. */
export function magnetic(scope = document) {
  if (!isBrowser || prefersReducedMotion()) return () => {};
  if (!window.matchMedia('(hover: hover)').matches) return () => {}; // skip touch

  const cleanups = [];
  scope.querySelectorAll('[data-bi-magnetic]').forEach((el) => {
    const strength = parseFloat(el.getAttribute('data-bi-magnetic')) || 0.35;
    let frame = 0;
    let tx = 0, ty = 0;

    const apply = () => {
      frame = 0;
      el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
    };
    const onMove = (e) => {
      const box = el.getBoundingClientRect();
      tx = (e.clientX - (box.left + box.width / 2)) * strength;
      ty = (e.clientY - (box.top + box.height / 2)) * strength;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      tx = ty = 0;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    el.classList.add('bi-magnetic');
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    cleanups.push(() => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      el.classList.remove('bi-magnetic');
      el.style.transform = '';
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

/* ── tilt ──────────────────────────────────────────────────────────────────
   <div data-bi-tilt="9">   3D tilt toward the cursor, max 9deg
   Also writes --bi-mx / --bi-my (0–1) so a glare layer can follow the pointer.
   ------------------------------------------------------------------------ */

/** Pointer-tracked 3D tilt. */
export function tilt(scope = document) {
  if (!isBrowser || prefersReducedMotion()) return () => {};
  if (!window.matchMedia('(hover: hover)').matches) return () => {};

  const cleanups = [];
  scope.querySelectorAll('[data-bi-tilt]').forEach((el) => {
    const max = parseFloat(el.getAttribute('data-bi-tilt')) || 8;
    let frame = 0;
    let rx = 0, ry = 0, mx = 0.5, my = 0.5;

    const apply = () => {
      frame = 0;
      el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      el.style.setProperty('--bi-mx', mx.toFixed(4));
      el.style.setProperty('--bi-my', my.toFixed(4));
    };
    const onMove = (e) => {
      const box = el.getBoundingClientRect();
      mx = (e.clientX - box.left) / box.width;
      my = (e.clientY - box.top) / box.height;
      ry = (mx - 0.5) * 2 * max;
      rx = -(my - 0.5) * 2 * max;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      rx = ry = 0;
      mx = my = 0.5;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    el.classList.add('bi-tilt');
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    cleanups.push(() => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      el.classList.remove('bi-tilt');
      el.style.transform = '';
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

/* ── spotlight ─────────────────────────────────────────────────────────────
   <div data-bi-spotlight>   writes --bi-mx/--bi-my in px for a radial glow
   ------------------------------------------------------------------------ */

/** Pointer position as custom properties, for cursor-following gradients. */
export function spotlight(scope = document) {
  if (!isBrowser) return () => {};
  if (!window.matchMedia('(hover: hover)').matches) return () => {};

  const cleanups = [];
  scope.querySelectorAll('[data-bi-spotlight]').forEach((el) => {
    let frame = 0;
    let x = 0, y = 0;
    const apply = () => {
      frame = 0;
      el.style.setProperty('--bi-spot-x', `${x.toFixed(1)}px`);
      el.style.setProperty('--bi-spot-y', `${y.toFixed(1)}px`);
    };
    const onMove = (e) => {
      const box = el.getBoundingClientRect();
      x = e.clientX - box.left;
      y = e.clientY - box.top;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    el.classList.add('bi-spotlight');
    el.addEventListener('pointermove', onMove);
    cleanups.push(() => {
      el.removeEventListener('pointermove', onMove);
      el.classList.remove('bi-spotlight');
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

/* ── count up ──────────────────────────────────────────────────────────────
   <b data-bi-count="1284">0</b>              counts to 1284 when scrolled into view
   <b data-bi-count="98.6" data-bi-decimals="1" data-bi-suffix="%">
   ------------------------------------------------------------------------ */

/** Animate numbers up when they enter the viewport. */
export function countUp(scope = document) {
  if (!isBrowser) return null;

  const els = Array.from(scope.querySelectorAll('[data-bi-count]'));
  if (!els.length) return null;

  const run = (el) => {
    const to = parseFloat(el.getAttribute('data-bi-count'));
    if (Number.isNaN(to)) return;
    const decimals = parseInt(el.getAttribute('data-bi-decimals') || '0', 10);
    const prefix = el.getAttribute('data-bi-prefix') || '';
    const suffix = el.getAttribute('data-bi-suffix') || '';
    const group = el.getAttribute('data-bi-group') !== 'false';
    const dur = toMs(el.getAttribute('data-bi-duration')) || 1400;

    const format = (n) => {
      const fixed = n.toFixed(decimals);
      const [int, dec] = fixed.split('.');
      const withCommas = group ? int.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : int;
      return prefix + withCommas + (dec ? `.${dec}` : '') + suffix;
    };

    if (prefersReducedMotion()) {
      el.textContent = format(to);
      return;
    }

    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      // easeOutExpo — fast out of the gate, long graceful settle.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      el.textContent = format(to * eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (typeof IntersectionObserver === 'undefined') {
    els.forEach(run);
    return null;
  }

  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          run(entry.target);
          io.unobserve(entry.target);
        }
      }),
    { threshold: 0.4 },
  );
  els.forEach((el) => io.observe(el));
  return io;
}

/* ── split text ────────────────────────────────────────────────────────────
   <h1 data-bi-split>Hello there</h1>          → per-word spans
   <h1 data-bi-split="char">Hello</h1>         → per-character spans
   Each piece gets --bi-i (its index) so CSS can cascade the delay.
   ------------------------------------------------------------------------ */

/**
 * Wrap words (or characters) in spans for staggered type animation.
 *
 * Walks the node tree rather than flattening textContent, so inline markup
 * inside the heading survives — `<h1 data-bi-split>Everyone keeps
 * <span class="bi-mark">bees</span></h1>` keeps its highlight and animates it
 * along with the rest. (Reading textContent and rebuilding, the obvious
 * implementation, silently eats every nested element.)
 *
 * Safe by construction: it only ever moves existing nodes and creates text
 * nodes via createTextNode, so nothing is re-parsed as markup.
 */
export function splitText(scope = document) {
  if (!isBrowser) return;

  scope.querySelectorAll('[data-bi-split]').forEach((el) => {
    if (el.dataset.biSplitDone) return;
    const mode = el.getAttribute('data-bi-split') === 'char' ? 'char' : 'word';
    let i = 0;

    const wrap = (piece) => {
      const outer = document.createElement('span');
      outer.className = 'bi-split-part';
      const inner = document.createElement('span');
      inner.className = 'bi-split-inner';
      inner.style.setProperty('--bi-i', String(i++));
      inner.append(piece);            // text node or a cloned element
      outer.appendChild(inner);
      return outer;
    };

    const walk = (node) => {
      // Snapshot first: we replace children as we go, so a live list would skip.
      for (const child of [...node.childNodes]) {
        if (child.nodeType === Node.TEXT_NODE) {
          const pieces = mode === 'char'
            ? Array.from(child.data)
            : child.data.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          for (const piece of pieces) {
            if (piece === '') continue;
            if (/^\s+$/.test(piece)) frag.append(document.createTextNode(piece));
            else frag.append(wrap(document.createTextNode(piece)));
          }
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          // Keep the element (and its classes) and split what's inside it.
          walk(child);
        }
      }
    };

    walk(el);
    el.dataset.biSplitDone = 'true';
    el.style.setProperty('--bi-split-count', String(i));
  });
}

/* ── spring ────────────────────────────────────────────────────────────────
   A tiny critically-tunable spring for one-off JS animation. Framer-ish feel
   without the dependency.
   ------------------------------------------------------------------------ */

/**
 * Animate a value with spring physics.
 * @param {{from?: number, to?: number, stiffness?: number, damping?: number,
 *          mass?: number, onUpdate: (v: number) => void, onRest?: () => void}} opts
 * @returns {() => void} cancel
 */
export function spring(opts) {
  const {
    from = 0, to = 1, stiffness = 170, damping = 22, mass = 1,
    onUpdate, onRest,
  } = opts;

  if (!isBrowser || prefersReducedMotion()) {
    onUpdate(to);
    onRest?.();
    return () => {};
  }

  let value = from;
  let velocity = 0;
  let frame = 0;
  let last = performance.now();

  const tick = (now) => {
    // Clamp dt so a backgrounded tab doesn't explode the integration.
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;

    const force = -stiffness * (value - to);
    const drag = -damping * velocity;
    velocity += ((force + drag) / mass) * dt;
    value += velocity * dt;

    if (Math.abs(velocity) < 0.01 && Math.abs(value - to) < 0.01) {
      onUpdate(to);
      onRest?.();
      return;
    }
    onUpdate(value);
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);

  return () => frame && cancelAnimationFrame(frame);
}

/* ══════════════════════════════════════════════════════════════════════════
   v0.9 — PLAY
   The loud half of the motion layer. Same rules as everything above: pointer
   and compositor only, and every one of these is a no-op under reduced
   motion rather than a smaller version of itself.
   ══════════════════════════════════════════════════════════════════════════ */

/* ── confetti ──────────────────────────────────────────────────────────────
   confetti()                       burst from the middle of the screen
   confetti({origin: buttonEl})     burst from an element
   ------------------------------------------------------------------------ */

const CONFETTI_COLORS = [
  '--bi-accent', '--bi-pop-pink-ink', '--bi-pop-violet-ink',
  '--bi-pop-teal-ink', '--bi-pop-mint-ink', '--bi-pop-lemon-ink',
];

/**
 * Throw confetti. Returns a promise that resolves once the pieces are gone.
 * @param {{count?: number, origin?: HTMLElement|{x:number,y:number},
 *          spread?: number, colors?: string[], duration?: number}} [opts]
 */
export function confetti(opts = {}) {
  if (!isBrowser || prefersReducedMotion()) return Promise.resolve();

  const count = opts.count ?? 70;
  const spread = opts.spread ?? 340;
  const duration = opts.duration ?? 2400;

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 3;
  if (opts.origin instanceof Element) {
    const box = opts.origin.getBoundingClientRect();
    x = box.left + box.width / 2;
    y = box.top + box.height / 2;
  } else if (opts.origin) {
    ({ x, y } = opts.origin);
  }

  const layer = document.createElement('div');
  layer.className = 'bi-confetti';
  layer.setAttribute('aria-hidden', 'true');   // decorative — never announced
  document.body.append(layer);

  const palette = opts.colors || CONFETTI_COLORS;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('i');
    const tone = palette[i % palette.length];
    piece.style.background = tone.startsWith('--') ? `var(${tone})` : tone;
    piece.style.left = `${x}px`;
    piece.style.top = `${y}px`;
    // Spread horizontally, but always fall — gravity reads as "real" even
    // when nothing else about the motion is.
    piece.style.setProperty('--dx', `${(Math.random() - 0.5) * spread}px`);
    piece.style.setProperty('--dy', `${window.innerHeight * (0.45 + Math.random() * 0.5)}px`);
    piece.style.setProperty('--dr', `${(Math.random() - 0.5) * 1080}deg`);
    piece.style.setProperty('--dur', `${duration + Math.random() * 900}ms`);
    piece.style.animationDelay = `${Math.random() * 140}ms`;
    if (Math.random() > 0.55) piece.style.borderRadius = '99px';
    layer.append(piece);
  }

  return new Promise((resolve) => {
    setTimeout(() => { layer.remove(); resolve(); }, duration + 1200);
  });
}

/* ── ripple ────────────────────────────────────────────────────────────────
   <button data-bi-ripple>   ink spreads from the exact click point
   ------------------------------------------------------------------------ */

/** Material-style click ripple, drawn in currentColor. */
export function ripple(scope = document) {
  if (!isBrowser) return () => {};

  const cleanups = [];
  scope.querySelectorAll('[data-bi-ripple]').forEach((el) => {
    el.classList.add('bi-ripple-host');
    const onDown = (e) => {
      if (prefersReducedMotion()) return;
      const box = el.getBoundingClientRect();
      // Cover the whole element from wherever the click landed: the farthest
      // corner sets the radius, so it never stops short.
      const size = Math.max(
        Math.hypot(e.clientX - box.left, e.clientY - box.top),
        Math.hypot(box.right - e.clientX, e.clientY - box.top),
        Math.hypot(e.clientX - box.left, box.bottom - e.clientY),
        Math.hypot(box.right - e.clientX, box.bottom - e.clientY),
      ) * 2;

      const dot = document.createElement('span');
      dot.className = 'bi-ripple-dot';
      dot.style.width = dot.style.height = `${size}px`;
      dot.style.left = `${e.clientX - box.left}px`;
      dot.style.top = `${e.clientY - box.top}px`;
      el.append(dot);
      setTimeout(() => dot.remove(), 700);
    };
    el.addEventListener('pointerdown', onDown);
    cleanups.push(() => {
      el.removeEventListener('pointerdown', onDown);
      el.classList.remove('bi-ripple-host');
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

/* ── typewriter ────────────────────────────────────────────────────────────
   <h2 data-bi-type>Ships on Friday.</h2>
   <h2 data-bi-type="40">…</h2>          ms per character
   ------------------------------------------------------------------------ */

/** Type text out character by character when it scrolls into view. */
export function typewriter(scope = document) {
  if (!isBrowser) return null;

  const els = [...scope.querySelectorAll('[data-bi-type]')];
  if (!els.length) return null;

  const run = (el) => {
    const full = el.dataset.biTypeText ?? el.textContent;
    el.dataset.biTypeText = full;                       // keep the source
    if (prefersReducedMotion()) { el.textContent = full; return; }

    const speed = Number(el.getAttribute('data-bi-type')) || 42;
    el.textContent = '';
    el.style.setProperty('--bi-caret', '1');
    let i = 0;
    const tick = () => {
      el.textContent = full.slice(0, ++i);              // text node, never parsed
      if (i < full.length) setTimeout(tick, speed);
      else el.style.setProperty('--bi-caret', '0');
    };
    setTimeout(tick, 180);
  };

  if (typeof IntersectionObserver === 'undefined') { els.forEach(run); return null; }
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
  }), { threshold: 0.5 });
  els.forEach((el) => io.observe(el));
  return io;
}

/* ── text scramble ─────────────────────────────────────────────────────────
   <span data-bi-scramble>DEPLOYED</span>   settles out of noise on hover
   ------------------------------------------------------------------------ */

const GLYPHS = '!<>-_\\/[]{}—=+*^?#________';

/** Decode-from-noise effect. Fires on hover and once when revealed. */
export function scramble(scope = document) {
  if (!isBrowser) return () => {};

  const cleanups = [];
  scope.querySelectorAll('[data-bi-scramble]').forEach((el) => {
    const target = el.textContent;
    let frame = 0, raf = 0;

    const play = () => {
      if (prefersReducedMotion()) return;
      cancelAnimationFrame(raf);
      frame = 0;
      // Each character gets its own start and end frame, so the word resolves
      // raggedly from left to right instead of all at once.
      const plan = [...target].map((ch, i) => ({
        ch, start: Math.floor(Math.random() * 18) + i * 1.4,
        end: Math.floor(Math.random() * 18) + i * 1.4 + 14,
      }));
      const total = Math.max(...plan.map((p) => p.end));

      const tick = () => {
        let out = '';
        for (const p of plan) {
          if (frame >= p.end) out += p.ch;
          else if (frame >= p.start) out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          else out += p.ch === ' ' ? ' ' : '';
        }
        el.textContent = out;
        if (frame++ < total) raf = requestAnimationFrame(tick);
        else el.textContent = target;
      };
      tick();
    };

    el.addEventListener('pointerenter', play);
    cleanups.push(() => { cancelAnimationFrame(raf); el.removeEventListener('pointerenter', play); el.textContent = target; });
  });

  return () => cleanups.forEach((fn) => fn());
}

/* ── cursor trail ──────────────────────────────────────────────────────────
   cursorTrail()                    accent dots that chase the pointer
   ------------------------------------------------------------------------ */

/** A short trail of dots easing toward the cursor. Pointer devices only. */
export function cursorTrail(opts = {}) {
  if (!isBrowser || prefersReducedMotion()) return () => {};
  if (!window.matchMedia('(hover: hover)').matches) return () => {};

  const count = opts.count ?? 8;
  const layer = document.createElement('div');
  layer.className = 'bi-confetti';                       // reuse the fixed layer
  layer.setAttribute('aria-hidden', 'true');
  document.body.append(layer);

  const dots = Array.from({ length: count }, (_, i) => {
    const d = document.createElement('span');
    const size = 13 - i;
    d.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:99px;`
      + `background:var(--bi-accent);opacity:${(1 - i / count) * 0.5};will-change:transform`;
    layer.append(d);
    return { el: d, x: 0, y: 0 };
  });

  let mx = -100, my = -100, raf = 0;
  const onMove = (e) => { mx = e.clientX; my = e.clientY; };

  const loop = () => {
    let px = mx, py = my;
    for (const dot of dots) {
      // Each dot eases toward the one ahead of it — a spring chain, which is
      // what makes the tail lag and curl instead of moving rigidly.
      dot.x += (px - dot.x) * 0.34;
      dot.y += (py - dot.y) * 0.34;
      dot.el.style.transform = `translate3d(${dot.x}px,${dot.y}px,0) translate(-50%,-50%)`;
      px = dot.x; py = dot.y;
    }
    raf = requestAnimationFrame(loop);
  };

  window.addEventListener('pointermove', onMove, { passive: true });
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('pointermove', onMove);
    layer.remove();
  };
}

/* ── one-call setup ───────────────────────────────────────────────────────── */

/**
 * Wire every motion utility over a scope. Returns a teardown that undoes all
 * of them. Safe to call on a page that uses none of the attributes.
 *
 * `play: false` skips the v0.9 play utilities (ripple, typewriter, scramble)
 * for a page that wants only the quiet layer.
 */
export function initMotion(scope = document, options = {}) {
  splitText(scope);
  const io = reveal(scope, options.reveal);
  const counters = countUp(scope);
  const stops = [parallax(scope), scrollProgress(scope), magnetic(scope), tilt(scope), spotlight(scope)];
  const observers = [io, counters];

  if (options.play !== false) {
    stops.push(ripple(scope), scramble(scope));
    observers.push(typewriter(scope));
  }

  return () => {
    observers.forEach((o) => o?.disconnect());
    stops.forEach((stop) => stop());
  };
}
