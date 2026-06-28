/**
 * animations.ts
 * Shared GSAP animation preset functions.
 * Import these in any component to get consistent, branded motion.
 *
 * All functions accept a GSAP context-aware target (Element | string)
 * and return GSAP Tween/Timeline instances so callers can chain or sequence them.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger once at module level
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─────────────────────────────────────────────
   1. FADE UP
   Elements enter from below with opacity.
   Default: 60px offset, 700ms, expo ease.
───────────────────────────────────────────── */
export function fadeUp(
  target: gsap.TweenTarget,
  options: {
    delay?: number;
    duration?: number;
    y?: number;
    stagger?: number;
    scrollTrigger?: ScrollTrigger.Vars;
  } = {}
) {
  const {
    delay = 0,
    duration = 0.7,
    y = 50,
    stagger = 0,
    scrollTrigger,
  } = options;

  return gsap.fromTo(
    target,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease: "power4.out",
      scrollTrigger,
    }
  );
}

/* ─────────────────────────────────────────────
   2. CLIP REVEAL (bottom-to-top wipe)
   Reveals element by animating clip-path.
   Great for section entries and text reveals.
───────────────────────────────────────────── */
export function clipReveal(
  target: gsap.TweenTarget,
  options: {
    delay?: number;
    duration?: number;
    stagger?: number;
    scrollTrigger?: ScrollTrigger.Vars;
  } = {}
) {
  const { delay = 0, duration = 0.8, stagger = 0, scrollTrigger } = options;

  return gsap.fromTo(
    target,
    { clipPath: "inset(100% 0 0 0)" },
    {
      clipPath: "inset(0% 0 0 0)",
      duration,
      delay,
      stagger,
      ease: "power4.out",
      scrollTrigger,
    }
  );
}

/* ─────────────────────────────────────────────
   3. STAGGER IN
   Multiple elements fade + slide up in sequence.
───────────────────────────────────────────── */
export function staggerIn(
  targets: gsap.TweenTarget,
  options: {
    stagger?: number;
    delay?: number;
    duration?: number;
    y?: number;
    scrollTrigger?: ScrollTrigger.Vars;
  } = {}
) {
  const {
    stagger = 0.08,
    delay = 0,
    duration = 0.6,
    y = 40,
    scrollTrigger,
  } = options;

  return gsap.fromTo(
    targets,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease: "power3.out",
      scrollTrigger,
    }
  );
}

/* ─────────────────────────────────────────────
   4. SPLIT CHARS (character-by-character clip reveal)
   Splits a text element's innerHTML into individual
   char spans, then clips each one in sequence.
   Returns cleanup function to reset the DOM.
───────────────────────────────────────────── */
export function splitChars(
  element: HTMLElement,
  options: {
    stagger?: number;
    delay?: number;
    duration?: number;
    onComplete?: () => void;
  } = {}
) {
  const { stagger = 0.04, delay = 0, duration = 0.6, onComplete } = options;

  const originalHTML = element.innerHTML;
  const text = element.textContent || "";

  /*
   * Line-mask technique — the ONLY approach that never clips glyphs:
   *
   * wrapper  — overflow:hidden clip zone, padded so the top boundary sits well
   *            ABOVE any ascender. vertical-align:bottom keeps baseline alignment.
   * inner    — translates from translateY(100%) into place.
   *
   * The wrapper padding-top of 0.25em + display:inline-block ensures there is
   * always ample space between the glyph top and the clip boundary, while
   * the negative margin-top offsets the visual spacing the padding adds.
   */
  const chars = text.split("").map((char) => {
    const wrapper = document.createElement("span");
    wrapper.style.cssText = [
      "display:inline-block",
      "overflow:hidden",
      "vertical-align:bottom",
      "padding-top:0.25em",    // safe-zone ABOVE the tallest ascender
      "margin-top:-0.25em",    // compensate so surrounding layout is unchanged
    ].join(";");

    const inner = document.createElement("span");
    inner.style.cssText = [
      "display:inline-block",
      "transform:translateY(105%)",
    ].join(";");
    inner.textContent = char === " " ? "\u00A0" : char;

    wrapper.appendChild(inner);
    return { wrapper, inner };
  });

  element.innerHTML = "";
  chars.forEach(({ wrapper }) => element.appendChild(wrapper));

  const tween = gsap.to(
    chars.map((c) => c.inner),
    {
      y: "0%",
      duration,
      delay,
      stagger,
      ease: "power4.out",
      onComplete,
    }
  );

  return {
    tween,
    cleanup: () => {
      tween.kill();
      element.innerHTML = originalHTML;
    },
  };
}

/* ─────────────────────────────────────────────
   5. COUNTER UP
   Animates a number from 0 to target value.
   Useful for stats sections.
───────────────────────────────────────────── */
export function counterUp(
  element: HTMLElement,
  target: number,
  options: {
    duration?: number;
    delay?: number;
    suffix?: string;
    scrollTrigger?: ScrollTrigger.Vars;
  } = {}
) {
  const { duration = 1.5, delay = 0, suffix = "", scrollTrigger } = options;

  const obj = { val: 0 };

  return gsap.to(obj, {
    val: target,
    duration,
    delay,
    ease: "power2.out",
    scrollTrigger,
    onUpdate: () => {
      element.textContent = `${Math.round(obj.val)}${suffix}`;
    },
  });
}

/* ─────────────────────────────────────────────
   6. DRAW SVG LINE
   Animates an SVG path from 0 → full stroke-dashoffset.
   Used for the Experience timeline draw animation.
───────────────────────────────────────────── */
export function drawLine(
  path: SVGPathElement | SVGLineElement,
  options: {
    duration?: number;
    delay?: number;
    scrollTrigger?: ScrollTrigger.Vars;
  } = {}
) {
  const { duration = 1.2, delay = 0, scrollTrigger } = options;

  const length =
    path instanceof SVGPathElement ? path.getTotalLength() : 0;

  gsap.set(path, {
    strokeDasharray: length,
    strokeDashoffset: length,
  });

  return gsap.to(path, {
    strokeDashoffset: 0,
    duration,
    delay,
    ease: "power2.inOut",
    scrollTrigger,
  });
}

/* ─────────────────────────────────────────────
   7. PARALLAX
   Drives a slow upward drift as the user scrolls
   through a pinned/tall section.
───────────────────────────────────────────── */
export function parallaxUp(
  target: gsap.TweenTarget,
  options: {
    speed?: number; // 0.3 = moves up at 30% of scroll speed
    scrollTrigger?: ScrollTrigger.Vars;
  } = {}
) {
  const { speed = 0.3, scrollTrigger } = options;

  return gsap.to(target, {
    y: () => `-${speed * 100}%`,
    ease: "none",
    scrollTrigger: {
      scrub: true,
      ...scrollTrigger,
    },
  });
}
