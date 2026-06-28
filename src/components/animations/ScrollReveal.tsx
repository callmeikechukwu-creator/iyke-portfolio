"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealDirection = "up" | "down" | "left" | "right" | "fade";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: RevealDirection;
  duration?: number;
  delay?: number;
  stagger?: number;
  distance?: number;
  className?: string;
  triggerHook?: string; // ScrollTrigger start parameter, e.g. "top 85%"
}

export default function ScrollReveal({
  children,
  direction = "up",
  duration = 0.8,
  delay = 0,
  stagger = 0,
  distance = 60,
  className,
  triggerHook = "top 88%",
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Configure animatable elements (select direct children or children marked for stagger)
      const targets = el.children.length > 1 ? Array.from(el.children) : el;

      // ── Desktop Configuration (min-width: 768px) ──
      mm.add("(min-width: 768px)", () => {
        let xVal = 0;
        let yVal = 0;

        if (direction === "left") xVal = -distance;
        if (direction === "right") xVal = distance;
        if (direction === "up") yVal = distance;
        if (direction === "down") yVal = -distance;

        gsap.fromTo(
          targets,
          {
            opacity: 0,
            x: xVal,
            y: yVal,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration,
            delay,
            stagger: stagger > 0 ? stagger : undefined,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: triggerHook,
              toggleActions: "play none none none",
            },
          }
        );
      });

      // ── Mobile Configuration (max-width: 767px) ──
      // Disable large horizontal shifts to prevent screen layout/overflow bugs
      mm.add("(max-width: 767px)", () => {
        gsap.fromTo(
          targets,
          {
            opacity: 0,
            x: 0,
            y: direction === "fade" ? 0 : 25, // Small vertical fade-up
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: duration * 0.9, // Slightly faster transition on mobile
            delay,
            stagger: stagger > 0 ? stagger * 0.8 : undefined,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 92%", // Trigger slightly earlier on mobile viewport scroll
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [direction, duration, delay, stagger, distance, triggerHook]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
