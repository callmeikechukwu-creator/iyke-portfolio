"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * LenisProvider
 * Initialises Lenis smooth scroll globally for the entire site.
 * Must be a Client Component ("use client") because it touches the DOM.
 * Cleans up properly on unmount to prevent memory leaks.
 *
 * Usage: wrap your body children with this in the root or portfolio layout.
 */
export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Expose lenis to GSAP ScrollTrigger via requestAnimationFrame
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    // Expose lenis instance on window for GSAP ScrollTrigger integration
    // GSAP ScrollTrigger can use: ScrollTrigger.scrollerProxy(...)
    // With Lenis we use the RAF loop instead.
    (window as unknown as { lenisInstance: Lenis }).lenisInstance = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
