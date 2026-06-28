"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { splitChars } from "@/lib/animations";

/**
 * PageLoader
 * Cinematic full-screen loader that plays on first visit per session.
 * Skipped on subsequent in-session navigations (sessionStorage flag).
 *
 * Sequence:
 * 1. Deep charcoal overlay covers the screen
 * 2. "IKECHUKWU" animates in — letter by letter, clipping up from below
 * 3. "ALAETO" follows with a slight delay
 * 4. Brief hold (200ms)
 * 5. Exit: two curtain panels slide — left half goes left, right half goes right
 * 6. Loader unmounts
 *
 * Total duration: ~2 seconds
 */
export default function PageLoader() {
  // Start visible so the loader is part of the SSR / initial paint.
  // The useEffect below will immediately dismiss it if already played.
  const [visible, setVisible] = useState(true);

  const overlayRef   = useRef<HTMLDivElement>(null);
  const leftRef      = useRef<HTMLDivElement>(null);
  const rightRef     = useRef<HTMLDivElement>(null);
  const line1Ref     = useRef<HTMLSpanElement>(null);
  const line2Ref     = useRef<HTMLSpanElement>(null);

  // useLayoutEffect runs synchronously before the browser paints,
  // so returning visitors never see a flash of the loader overlay.
  useLayoutEffect(() => {
    const hasPlayed = sessionStorage.getItem("loader-played");
    if (hasPlayed) {
      setVisible(false);
    }
  }, []);

  /* ── Build & run the GSAP timeline only once the loader is actually
        mounted in the DOM (i.e. after `visible` flips true and refs exist) ── */
  useEffect(() => {
    if (!visible) return;
    if (!leftRef.current || !rightRef.current) return;

    // Prevent scroll during loader
    document.body.style.overflow = "hidden";

    let line1Cleanup: (() => void) | null = null;
    let line2Cleanup: (() => void) | null = null;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("loader-played", "1");
          document.body.style.overflow = "";
          // Small delay before unmounting so exit animation fully completes
          setTimeout(() => setVisible(false), 50);
        },
      });

      // Ensure initial state (in case of fast render)
      gsap.set([leftRef.current, rightRef.current], { xPercent: 0 });

      // ① Line 1: "IKECHUKWU" — char by char
      if (line1Ref.current) {
        const { tween: tl1, cleanup } = splitChars(line1Ref.current, {
          stagger: 0.05,
          duration: 0.5,
          delay: 0.2,
        });
        line1Cleanup = cleanup;
        tl.add(tl1, 0);
      }

      // ② Line 2: "ALAETO" — char by char, 300ms after line 1 starts
      if (line2Ref.current) {
        const { tween: tl2, cleanup } = splitChars(line2Ref.current, {
          stagger: 0.06,
          duration: 0.5,
          delay: 0,
        });
        line2Cleanup = cleanup;
        tl.add(tl2, 0.45);
      }

      // ③ Brief hold
      tl.to({}, { duration: 0.3 });

      // ④ Exit: curtain split — left panel exits left, right panel exits right
      tl.to(
        leftRef.current,
        { xPercent: -100, duration: 0.65, ease: "power4.inOut" },
        "exit"
      );
      tl.to(
        rightRef.current,
        { xPercent: 100, duration: 0.65, ease: "power4.inOut" },
        "exit"
      );
    });

    return () => {
      ctx.revert();
      if (line1Cleanup) {
        line1Cleanup();
      }
      if (line2Cleanup) {
        line2Cleanup();
      }
      document.body.style.overflow = "";
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      aria-live="polite"
      aria-label="Loading Ikechukwu Alaeto's portfolio"
      className="fixed inset-0 z-[var(--z-loader)] pointer-events-none select-none"
    >
      {/* ── Left curtain panel ── */}
      <div
        ref={leftRef}
        className="absolute inset-y-0 left-0 w-1/2 bg-[var(--color-ink)]"
        aria-hidden="true"
      />

      {/* ── Right curtain panel ── */}
      <div
        ref={rightRef}
        className="absolute inset-y-0 right-0 w-1/2 bg-[var(--color-ink)]"
        aria-hidden="true"
      />

      {/* ── Wordmark (sits above both curtain panels, always centred) ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-0 z-10"
        aria-hidden="true"
      >
        <span
          ref={line1Ref}
          className="text-logo text-[var(--color-base)] leading-none"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 7rem)",
            letterSpacing: "0.04em",
          }}
        >
          IKECHUKWU
        </span>
        <span
          ref={line2Ref}
          className="text-logo text-[var(--color-base)] leading-none"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 7rem)",
            letterSpacing: "0.04em",
          }}
        >
          ALAETO
        </span>
      </div>
    </div>
  );
}
