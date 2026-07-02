"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { counterUp } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

/**
 * About Section
 * Editorial layout with sticky left column and scrollable right column.
 * Incorporates:
 *   - Giant parallax section number "01"
 *   - Profile image with styled initials fallback
 *   - Interactive bio text
 *   - 3 stat cards with count-up animations on scroll
 */
export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  
  // Refs for count-up animations
  const yearsValRef = useRef<HTMLSpanElement>(null);
  const projectsValRef = useRef<HTMLSpanElement>(null);
  const speedValRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Parallax on the giant "01" number
      gsap.fromTo(
        numberRef.current,
        { yPercent: 0 },
        {
          yPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // 2. Fade in and slide up for bio paragraphs and stat cards
      const anims = bioRef.current?.querySelectorAll(".reveal-item");
      if (anims && anims.length > 0) {
        gsap.fromTo(
          anims,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: bioRef.current,
              start: "top 80%",
            },
          }
        );
      }

      // 3. Stat counters triggering on scroll
      if (yearsValRef.current) {
        counterUp(yearsValRef.current, 3, {
          duration: 1.5,
          suffix: "+",
          scrollTrigger: {
            trigger: yearsValRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      if (projectsValRef.current) {
        counterUp(projectsValRef.current, 10, {
          duration: 1.8,
          suffix: "+",
          scrollTrigger: {
            trigger: projectsValRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      if (speedValRef.current) {
        counterUp(speedValRef.current, 100, {
          duration: 2.0,
          suffix: "%",
          scrollTrigger: {
            trigger: speedValRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="about-section"
      aria-label="About Ikechukwu"
      className="relative w-full bg-[var(--color-base)] border-b border-[var(--color-border)] py-20 md:py-32"
    >
      <div className="section-wrapper">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* ════════════════════════════════════════
              LEFT COLUMN (Sticky on Desktop)
          ════════════════════════════════════════ */}
          <div
            ref={leftColRef}
            className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col gap-8 w-full"
          >
            {/* Giant Background Number */}
            <div className="relative overflow-hidden h-28 md:h-36 select-none pointer-events-none">
              <div
                ref={numberRef}
                className="text-display text-[var(--color-border-strong)] opacity-30 leading-none absolute left-0 top-0 font-bold"
                style={{ fontSize: "clamp(6rem, 16vw, 12rem)" }}
              >
                01
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-label text-[var(--color-vermillion)] uppercase tracking-[var(--tracking-wide)]">
                About Me
              </span>
              <h2 className="text-display text-[var(--color-ink)] text-2xl font-bold tracking-tight">
                CREATIVE SOULS,<br />ENGINEERED MINDS.
              </h2>
            </div>

            {/* Profile Frame with Styled initials / real photo placeholder */}
            <div className="relative group aspect-square w-full max-w-[380px] rounded-2xl overflow-hidden border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
              {/* Overlay with subtle grid background */}
              <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,var(--color-ink)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-ink)_1px,transparent_1px)] bg-[size:20px_20px] opacity-[0.02] pointer-events-none" />

              {/* Real profile image placeholder (uses /public/profile.jpg if exists) */}
              <div className="absolute inset-0 w-full h-full z-1 transition-transform duration-700 ease-out group-hover:scale-105">
                <Image
                  src="/profile.jpg"
                  alt="Ikechukwu Alaeto"
                  fill
                  className="object-cover object-center grayscale contrast-[1.05]"
                  sizes="(max-width: 768px) 100vw, 380px"
                  priority
                />
              </div>

              {/* Tint / Gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/20 via-transparent to-transparent z-2" />

              {/* Corner brackets/notch design for premium aesthetic */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[var(--color-base)] z-3 opacity-80" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[var(--color-base)] z-3 opacity-80" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[var(--color-base)] z-3 opacity-80" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[var(--color-base)] z-3 opacity-80" />
            </div>
          </div>

          {/* ════════════════════════════════════════
              RIGHT COLUMN (Scrollable content)
          ════════════════════════════════════════ */}
          <div
            ref={bioRef}
            className="lg:col-span-7 flex flex-col gap-10 md:gap-14 w-full"
          >
            {/* Biography Copy */}
            <div className="flex flex-col gap-6 text-body text-[var(--color-ink)] text-base md:text-lg leading-relaxed">
              <p className="reveal-item font-semibold text-[var(--color-ink)] text-lg md:text-xl">
                I am a software engineer and digital builder based in Ibadan, Nigeria. I develop fast, beautifully designed web applications that bridge the gap between creative frontends and secure, high-performance backend systems.
              </p>
              
              <p className="reveal-item text-muted">
                My development journey is focused on creating things that feel alive. Rather than just building functional interfaces, I aim for interactive visual polish and absolute reliability under the hood. Using modern platforms like Next.js, TypeScript, Node.js, and clean databases, I build architectures that scale smoothly.
              </p>

              {/* 3D Visual Banner */}
              <div className="reveal-item relative w-full aspect-[2/1] rounded-2xl overflow-hidden border border-border bg-base/10 flex items-center justify-center p-6 my-2 shadow-inner hover:scale-[1.01] transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-tr from-vermillion/[0.01] to-transparent pointer-events-none" />
                <Image
                  src="/brand/3d-about.png"
                  alt="Futuristic workstation 3D illustration"
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 760px"
                />
              </div>

              <p className="reveal-item text-muted">
                Outside of direct coding, I explore creative technology, motion systems, and UI details. I collaborate closely with companies, design teams, and startups to convert complex product goals into highly optimized, responsive digital realities.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 md:pt-14 border-t border-[var(--color-border)]">
              {/* Stat 1 */}
              <div className="reveal-item flex flex-col gap-3 p-6 md:p-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                <span
                  ref={yearsValRef}
                  className="text-display text-3xl font-bold text-[var(--color-vermillion)] leading-none"
                >
                  0
                </span>
                <span className="text-body text-xs font-semibold text-muted uppercase tracking-[var(--tracking-wide)]">
                  Years of Coding
                </span>
                <p className="text-body text-xs text-[var(--color-ink)] opacity-70 leading-relaxed mt-1">
                  Active experience shipping dynamic applications.
                </p>
              </div>

              {/* Stat 2 */}
              <div className="reveal-item flex flex-col gap-3 p-6 md:p-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                <span
                  ref={projectsValRef}
                  className="text-display text-3xl font-bold text-[var(--color-vermillion)] leading-none"
                >
                  0
                </span>
                <span className="text-body text-xs font-semibold text-muted uppercase tracking-[var(--tracking-wide)]">
                  Projects Completed
                </span>
                <p className="text-body text-xs text-[var(--color-ink)] opacity-70 leading-relaxed mt-1">
                  Case studies ranging from PWAs to systems.
                </p>
              </div>

              {/* Stat 3 */}
              <div className="reveal-item flex flex-col gap-3 p-6 md:p-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                <span
                  ref={speedValRef}
                  className="text-display text-3xl font-bold text-[var(--color-vermillion)] leading-none"
                >
                  0
                </span>
                <span className="text-body text-xs font-semibold text-muted uppercase tracking-[var(--tracking-wide)]">
                  Performance-Driven
                </span>
                <p className="text-body text-xs text-[var(--color-ink)] opacity-70 leading-relaxed mt-1">
                  Aiming for maximum speed and SEO optimization.
                </p>
              </div>
            </div>

            {/* Philosophy block */}
            <div className="reveal-item p-8 md:p-12 rounded-2xl bg-[var(--color-ink)] text-[var(--color-base)] flex flex-col gap-6 border border-transparent shadow-[var(--shadow-lg)]">
              <span className="text-body text-xs font-bold text-[var(--color-amber)] uppercase tracking-[var(--tracking-wider)]">
                My Core Philosophy
              </span>
              <p className="font-display text-lg md:text-xl font-medium leading-relaxed tracking-tight text-[var(--color-base)]">
                &ldquo;Engineering is incomplete without aesthetic discipline. A product must load instantly, respond predictably, and look gorgeous from the first frame to the last.&rdquo;
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
