"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/* ─────────────────────────────────────────────────────────────
   GLITCH CHARSET — used for the scramble effect
────────────────────────────────────────────────────────────── */
const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
function randChar() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

/**
 * PageLoader — DANGEROUS BUILD
 *
 * Plays on every full page load — no flags, no storage.
 * Use <a href="..."> for internal links so every navigation is a real load.
 *
 * Sequence:
 * 0. Overlay is solid ink from first paint — no FOUC ever.
 * 1. ENTRY: All letters appear scrambling simultaneously (~28fps glitch chars).
 *    A vermillion stroke draws left→right across the name.
 *    Each letter locks to its real char with a violent snap as the stroke passes.
 * 2. HOLD: ~200ms.
 * 3. EXIT: White flash → overlay rips upward at expo speed (0.55s).
 *    Page scales in from 0.94 → 1 simultaneously.
 *
 * Total duration: ~2.4s
 */
export default function PageLoader() {
  const [visible, setVisible] = useState(true);

  const overlayRef = useRef<HTMLDivElement>(null);
  const strokeRef  = useRef<HTMLDivElement>(null);
  const flashRef   = useRef<HTMLDivElement>(null);
  const line1Ref   = useRef<HTMLDivElement>(null);
  const line2Ref   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return;
    if (!overlayRef.current) return;

    document.body.style.overflow = "hidden";

    /* ── 1. Build char spans for both lines ── */
    const buildLine = (el: HTMLDivElement | null, word: string) => {
      if (!el) return [];
      el.innerHTML = "";
      return word.split("").map((char, i) => {
        const wrapper = document.createElement("span");
        wrapper.style.cssText = [
          "display:inline-block",
          "overflow:hidden",
          "vertical-align:bottom",
        ].join(";");

        const inner = document.createElement("span");
        inner.style.cssText = [
          "display:inline-block",
          // Start invisible — CSS handles FOUC, not JS
          "opacity:0",
          "transform:translateY(110%) skewX(-12deg)",
          "will-change:transform,opacity",
        ].join(";");
        inner.textContent = char;
        inner.dataset.real = char;
        inner.dataset.index = String(i);

        wrapper.appendChild(inner);
        el.appendChild(wrapper);
        return inner;
      });
    };

    const chars1 = buildLine(line1Ref.current, "IKECHUKWU");
    const chars2 = buildLine(line2Ref.current, "ALAETO");
    const allChars = [...chars1, ...chars2];

    /* ── 2. Scramble loop — runs until each char is locked ── */
    const locked = new Set<number>();
    let rafId: number;
    let lastTick = 0;
    const TICK_INTERVAL = 1000 / 28; // ~28fps scramble feels analog

    const scrambleTick = (now: number) => {
      if (now - lastTick > TICK_INTERVAL) {
        lastTick = now;
        allChars.forEach((span, i) => {
          if (!locked.has(i) && span.style.opacity !== "0") {
            span.textContent = randChar();
          }
        });
      }
      rafId = requestAnimationFrame(scrambleTick);
    };

    /* ── 3. GSAP timeline ── */
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          cancelAnimationFrame(rafId);
          document.body.style.overflow = "";
          setTimeout(() => setVisible(false), 50);
        },
      });

      const totalChars = allChars.length;
      // Stroke travels across the full name width over 1.0s
      const STROKE_DURATION = 1.0;
      const LOCK_START   = 0.15; // when first char locks
      const LOCK_END     = 1.05; // when last char locks
      const LOCK_SPREAD  = LOCK_END - LOCK_START;

      // ① Make all chars visible (but scrambling) + start scramble loop
      tl.call(() => {
        allChars.forEach((span) => {
          span.style.opacity = "1";
          span.style.transform = "translateY(0%) skewX(0deg)";
          span.textContent = randChar();
        });
        rafId = requestAnimationFrame(scrambleTick);
      }, [], 0);

      // ② Draw the vermillion stroke line left → right
      if (strokeRef.current) {
        gsap.set(strokeRef.current, { scaleX: 0, transformOrigin: "left center" });
        tl.to(
          strokeRef.current,
          { scaleX: 1, duration: STROKE_DURATION, ease: "power2.inOut" },
          0.1
        );
      }

      // ③ Lock each character as the stroke passes it
      allChars.forEach((span, i) => {
        const lockAt = LOCK_START + (i / (totalChars - 1)) * LOCK_SPREAD;
        tl.call(
          (s: HTMLSpanElement, idx: number) => {
            locked.add(idx);
            s.textContent = s.dataset.real || "";
            // Violent snap in from below — skew snaps straight
            gsap.fromTo(
              s,
              { y: "60%", skewX: -14, opacity: 0.4 },
              { y: "0%", skewX: 0, opacity: 1, duration: 0.28, ease: "power4.out" }
            );
          },
          [span, i],
          lockAt
        );
      });

      // ④ Brief hold — grain pulses
      const holdAt = LOCK_END + 0.05;
      tl.to({}, { duration: 0.22 }, holdAt);

      // ⑤ White flash frame
      const exitAt = holdAt + 0.22;
      if (flashRef.current) {
        tl.to(
          flashRef.current,
          { opacity: 1, duration: 0.06, ease: "none" },
          exitAt
        );
        tl.to(
          flashRef.current,
          { opacity: 0, duration: 0.12, ease: "none" },
          exitAt + 0.06
        );
      }

      // ⑥ Overlay RIPS upward — violent expo, 0.55s
      tl.to(
        overlayRef.current,
        { yPercent: -105, duration: 0.55, ease: "expo.in" },
        exitAt + 0.04
      );

      // ⑦ Page content scales in from 0.94 simultaneously
      tl.fromTo(
        "#main-content",
        { scale: 0.94, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.55, ease: "expo.out" },
        exitAt + 0.04
      );
    });

    return () => {
      cancelAnimationFrame(rafId);
      ctx.revert();
      document.body.style.overflow = "";
      gsap.set("#main-content", { clearProps: "all" });
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      aria-live="polite"
      aria-label="Loading portfolio"
      className="fixed inset-0 z-[var(--z-loader)] select-none overflow-hidden"
      style={{ backgroundColor: "var(--color-ink)", willChange: "transform" }}
    >
      {/* ── Grain texture overlay ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />

      {/* ── White flash layer ── */}
      <div
        ref={flashRef}
        aria-hidden="true"
        className="absolute inset-0 z-20 pointer-events-none"
        style={{ backgroundColor: "#fff", opacity: 0 }}
      />

      {/* ── Wordmark + stroke container ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center z-10"
        aria-hidden="true"
      >
        {/* Vermillion stroke line — positioned behind text via z-index */}
        <div className="relative w-full flex flex-col items-center">
          {/* The stroke sits centred, spanning the name width */}
          <div
            ref={strokeRef}
            className="absolute top-1/2 -translate-y-1/2 h-[2px] w-[min(72vw,660px)] z-0 pointer-events-none"
            style={{ backgroundColor: "var(--color-vermillion)", transformOrigin: "left center" }}
          />

          {/* Line 1: IKECHUKWU */}
          <div
            ref={line1Ref}
            className="relative z-10 leading-none tracking-[0.06em] text-[var(--color-base)]"
            style={{
              fontFamily: "var(--font-host-grotesk), sans-serif",
              fontWeight: 900,
              fontSize: "clamp(2.8rem, 9vw, 7.5rem)",
              letterSpacing: "0.06em",
            }}
          >
            IKECHUKWU
          </div>

          {/* Line 2: ALAETO */}
          <div
            ref={line2Ref}
            className="relative z-10 leading-none text-[var(--color-base)]"
            style={{
              fontFamily: "var(--font-host-grotesk), sans-serif",
              fontWeight: 900,
              fontSize: "clamp(2.8rem, 9vw, 7.5rem)",
              letterSpacing: "0.06em",
            }}
          >
            ALAETO
          </div>
        </div>
      </div>
    </div>
  );
}
