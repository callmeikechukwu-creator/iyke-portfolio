"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { splitChars } from "@/lib/animations";
import Typewriter from "@/components/ui/Typewriter";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero Section
 * Full-viewport landing. The name dominates everything.
 *
 * Layout:
 *   — Small label: "FULL STACK DEVELOPER IN IBADAN, NIGERIA 🇳🇬"
 *   — Giant display: IKECHUKWU / ALAETO
 *   — Hero lines: "I build things that feel alive."
 *   — Sub-line: engineering/experience descriptor
 *   — Bottom-left: animated scroll indicator
 *   — Bottom-right: AVAILABLE FOR WORK pill
 *
 * Entrance (fires after PageLoader exits, or immediately if loader already played):
 *   Label → line1 chars → line2 chars → hero lines → bottom elements
 *
 * Scroll:
 *   Name parallaxes upward at 0.3× scroll speed
 */
export default function Hero() {
  const sectionRef   = useRef<HTMLElement>(null);
  const labelRef     = useRef<HTMLParagraphElement>(null);
  const line1Ref     = useRef<HTMLHeadingElement>(null);
  const line2Ref     = useRef<HTMLSpanElement>(null);
  const heroLine1Ref = useRef<HTMLParagraphElement>(null);
  const heroLine2Ref = useRef<HTMLParagraphElement>(null);
  const bottomRef    = useRef<HTMLDivElement>(null);
  const nameRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let line1Cleanup: (() => void) | null = null;
    let line2Cleanup: (() => void) | null = null;

    const ctx = gsap.context(() => {
      // Delay entrance slightly to let loader exit, if it played
      const loaderPlayed = sessionStorage.getItem("loader-played");
      const entranceDelay = loaderPlayed ? 0.1 : 2.4; // if loader just played, wait for curtain

      const tl = gsap.timeline({ delay: entranceDelay });

      // ① Label slides up
      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );

      // ② Line 1 chars clip in
      if (line1Ref.current) {
        const { tween, cleanup } = splitChars(line1Ref.current, {
          stagger: 0.035,
          duration: 0.5,
        });
        line1Cleanup = cleanup;
        tl.add(tween, "-=0.3");
      }

      // ③ Line 2 chars clip in
      if (line2Ref.current) {
        const { tween, cleanup } = splitChars(line2Ref.current, {
          stagger: 0.04,
          duration: 0.5,
        });
        line2Cleanup = cleanup;
        tl.add(tween, "-=0.4");
      }

      // ④ Hero lines fade up
      tl.fromTo(
        [heroLine1Ref.current, heroLine2Ref.current],
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power3.out" },
        "-=0.15"
      );

      // ⑤ Bottom elements fade in
      tl.fromTo(
        bottomRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
        "-=0.2"
      );

      // ── Parallax: name block drifts up at 0.3× scroll speed
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          if (nameRef.current) {
            gsap.set(nameRef.current, {
              y: self.progress * -120,
            });
          }
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      if (line1Cleanup) {
        line1Cleanup();
      }
      if (line2Cleanup) {
        line2Cleanup();
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Hero"
      className="
        relative min-h-[100dvh] w-full
        bg-[var(--color-base)]
        flex flex-col justify-center
        px-[var(--section-padding-x)]
        pt-[var(--navbar-height)]
        [overflow-x:clip]
      "
    >
      {/* Subtle grid overlay */}
      <div
        aria-hidden="true"
        className="
          absolute inset-0 pointer-events-none overflow-hidden
          bg-[linear-gradient(to_right,var(--color-ink)_1px,transparent_1px),
              linear-gradient(to_bottom,var(--color-ink)_1px,transparent_1px)]
          bg-[size:clamp(3rem,6vw,6rem)_clamp(3rem,6vw,6rem)]
          opacity-[0.03]
        "
      />

      {/* Content */}
      <div className="relative max-w-[var(--content-max-width)] w-full mx-auto flex flex-col gap-4 md:gap-6">

        {/* Label */}
        <p
          ref={labelRef}
          className="text-label tracking-[var(--tracking-widest)] text-muted flex items-center gap-1.5"
          style={{ opacity: 0 }}
        >
          Full Stack Developer in Ibadan, Nigeria
          <img
            src="https://flagcdn.com/w20/ng.png"
            width="16"
            height="12"
            alt="Nigeria"
            aria-hidden="true"
            style={{ display: "inline-block", verticalAlign: "middle", borderRadius: "2px", flexShrink: 0 }}
          />
        </p>

        {/* Giant name — parallax container */}
        <div ref={nameRef} className="flex flex-col gap-0 will-change-transform">
          <h1
            ref={line1Ref}
            className="text-display text-[var(--color-ink)] leading-[0.93]"
            style={{
              fontSize: "clamp(2.2rem, 12vw, 11rem)",
              letterSpacing: "-0.04em",
            }}
          >
            IKECHUKWU
          </h1>
          <span
            ref={line2Ref}
            className="text-display text-[var(--color-ink)] leading-[0.93]"
            aria-hidden="true" /* part of h1 visually, screen reader reads h1 */
            style={{
              fontSize: "clamp(2.2rem, 12vw, 11rem)",
              letterSpacing: "-0.04em",
            }}
          >
            ALAETO
          </span>
        </div>

        {/* Hero lines */}
        <div className="mt-4 md:mt-6 flex flex-col gap-2 max-w-[640px]">
          <p
            ref={heroLine1Ref}
            className="text-display text-[var(--color-ink)]"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              opacity: 0,
            }}
          >
            <Typewriter
              phrases={[
                "I build things that feel alive.",
                "I craft high-performance backends.",
                "I optimize database scaling.",
                "I design premium user experiences."
              ]}
            />
          </p>
          <p
            ref={heroLine2Ref}
            className="text-body text-muted"
            style={{
              fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)",
              lineHeight: 1.6,
              opacity: 0,
            }}
          >
            Engineering web experiences that turn complex problems into fast, beautiful products.
          </p>
        </div>
      </div>

      {/* ── Bottom strip: scroll indicator + availability pill ── */}
      <div
        ref={bottomRef}
        className="
          absolute bottom-8 left-0 right-0
          px-[var(--section-padding-x)]
          flex items-end justify-end sm:justify-between
        "
        style={{ opacity: 0 }}
      >
        {/* Scroll indicator */}
        <div className="flex flex-col items-center gap-2 hide-mobile" aria-hidden="true">
          <span className="text-label text-muted text-[10px] tracking-[0.2em]">
            SCROLL
          </span>
          <div
            className="w-px h-12 bg-[var(--color-muted)]/40 relative overflow-hidden"
          >
            <div
              className="absolute top-0 left-0 right-0 h-1/2 bg-[var(--color-muted)]"
              style={{
                animation: "scrollLineDown 1.8s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        {/* Availability pill */}
        <a
          href="/contact"
          className="
            flex items-center gap-2
            px-4 py-2.5 rounded-full
            border border-[var(--color-border)]
            bg-[var(--color-surface)]/70
            backdrop-blur-sm
            text-body text-xs font-semibold
            tracking-[var(--tracking-wide)]
            text-[var(--color-ink)]
            hover:border-[var(--color-vermillion)]
            hover:text-[var(--color-vermillion)]
            transition-colors duration-300
            select-none
          "
        >
          <span className="status-dot" aria-hidden="true" />
          AVAILABLE FOR WORK
        </a>
      </div>

      {/* Scroll line animation keyframe */}
      <style>{`
        @keyframes scrollLineDown {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </section>
  );
}
