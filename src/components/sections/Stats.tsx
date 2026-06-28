"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  desc: string;
}

export default function Stats() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const stats: StatItem[] = [
    {
      value: 3,
      suffix: "+",
      label: "Years of Engineering",
      desc: "Delivering fast, secure backends and rich interactive products.",
    },
    {
      value: 10,
      suffix: "+",
      label: "Production Deployments",
      desc: "Full cycle deployments from databases and caching to cloud services.",
    },
    {
      value: 100,
      suffix: "%",
      label: "Codebase Delivery",
      desc: "Clean developer handoff with complete version control coverage.",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = containerRef.current?.querySelectorAll(".stat-number");
      if (!elements) return;

      elements.forEach((el) => {
        const targetVal = parseInt(el.getAttribute("data-target") || "0", 10);
        const obj = { val: 0 };

        gsap.to(obj, {
          val: targetVal,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            el.textContent = Math.round(obj.val).toString();
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      aria-label="Professional statistics"
      className="relative w-full bg-[var(--color-surface)] border-b border-[var(--color-border)] py-16 md:py-24"
    >
      <div className="section-wrapper">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-3 p-6 md:p-8 rounded-3xl border border-[var(--color-border)] bg-[var(--color-base)]/10 hover:border-[var(--color-border-strong)] transition-colors duration-300"
            >
              <span className="text-[clamp(2.5rem,6vw,4.5rem)] font-body font-black tracking-tight text-[var(--color-vermillion)] leading-none flex items-baseline">
                <span
                  className="stat-number tabular-nums"
                  data-target={stat.value}
                >
                  0
                </span>
                <span>{stat.suffix}</span>
              </span>
              <div className="flex flex-col gap-1.5 mt-2">
                <h3 className="text-display text-sm font-bold text-[var(--color-ink)] uppercase tracking-wider">
                  {stat.label}
                </h3>
                <p className="text-body text-xs md:text-sm text-muted leading-relaxed">
                  {stat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
