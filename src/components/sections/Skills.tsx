"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Code2, Server, Database, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface SkillItem {
  name: string;
  level: string;
}

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  skills: SkillItem[];
}

/**
 * Skills Component
 * Premium dark-mode skills showcase.
 * Incorporates:
 *   - Dark theme background (`bg-[var(--color-ink)]`)
 *   - "CAPABILITIES" display heading
 *   - Two opposing infinite scrolling marquee rows (left and right directions)
 *   - 4 category cards with grid outline borders and hover state highlights
 */
export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const categories: SkillCategory[] = [
    {
      title: "Frontend Engineering",
      icon: <Code2 className="w-6 h-6 text-[var(--color-vermillion)]" />,
      skills: [
        { name: "Next.js 16 (App Router)", level: "Expert" },
        { name: "React 19 & React Compiler", level: "Expert" },
        { name: "TypeScript", level: "Expert" },
        { name: "Tailwind CSS v4 & CSS3", level: "Expert" },
        { name: "GSAP & Motion Systems", level: "Advanced" },
      ],
    },
    {
      title: "Backend Development",
      icon: <Server className="w-6 h-6 text-[var(--color-amber)]" />,
      skills: [
        { name: "Node.js & Express.js", level: "Expert" },
        { name: "RESTful API Integration", level: "Expert" },
        { name: "Prisma ORM", level: "Expert" },
        { name: "Socket.io (WebSockets)", level: "Advanced" },
        { name: "JWT & Security Headers", level: "Expert" },
      ],
    },
    {
      title: "Databases & Caching",
      icon: <Database className="w-6 h-6 text-[var(--color-vermillion)]" />,
      skills: [
        { name: "PostgreSQL (Neon Serverless)", level: "Advanced" },
        { name: "Upstash Redis", level: "Intermediate" },
        { name: "MongoDB", level: "Advanced" },
        { name: "SQL.js & SQLite", level: "Advanced" },
        { name: "Rate Limiting & Tracking", level: "Advanced" },
      ],
    },
    {
      title: "DevOps & Integrations",
      icon: <Cpu className="w-6 h-6 text-[var(--color-amber)]" />,
      skills: [
        { name: "Git & GitHub Workflows", level: "Expert" },
        { name: "Cloudinary CDN", level: "Expert" },
        { name: "Vercel & Render Deployments", level: "Expert" },
        { name: "Puppeteer PDF Engines", level: "Advanced" },
        { name: "Uptime Monitoring", level: "Advanced" },
      ],
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal animation
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
            },
          }
        );
      }

      // Cards reveal animation
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".skill-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="skills-section"
      aria-label="Capabilities"
      className="relative w-full bg-[var(--color-ink)] border-b border-[var(--color-border)] py-20 md:py-32 overflow-hidden"
    >
      {/* Subtle grid pattern for dark mode depth */}
      <div
        aria-hidden="true"
        className="
          absolute inset-0 pointer-events-none
          bg-[linear-gradient(to_right,rgba(240,237,230,0.05)_1px,transparent_1px),
              linear-gradient(to_bottom,rgba(240,237,230,0.05)_1px,transparent_1px)]
          bg-[size:6rem_6rem]
          opacity-30
        "
      />

      <div className="flex flex-col gap-16 md:gap-24 w-full">
        {/* ── Header ── */}
        <div
          ref={headerRef}
          className="section-wrapper flex flex-col gap-3"
        >
          <span className="text-body text-xs font-bold text-[var(--color-vermillion)] uppercase tracking-[var(--tracking-wider)]">
            Capabilities
          </span>
          <h2
            className="text-display text-[var(--color-base)]"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.03em" }}
          >
            TECHNICAL CAPABILITIES
          </h2>
          <p className="text-body text-[var(--color-base)]/60 text-base md:text-lg leading-relaxed max-w-[600px] mt-2">
            A specialized full-stack development toolkit. Engineered for rapid deployments, highly responsive animations, and optimized databases.
          </p>
        </div>

        {/* ── Opposing Marquees ── */}
        <div className="flex flex-col gap-4 w-full select-none" aria-hidden="true">
          {/* Row 1: Left-scrolling */}
          <div className="marquee-container border-y border-[var(--color-base)]/10 py-4 bg-[var(--color-base)]/5">
            <div className="marquee-track marquee-left">
              {[...Array(2)].map((_, i) => (
                <span key={i} className="flex items-center gap-10">
                  {[
                    "Next.js 16", "React 19", "TypeScript", "GSAP Motion",
                    "Tailwind CSS v4", "Fluid UI", "Responsive Design",
                    "Lenis Scroll", "Client Transitions", "Typography",
                  ].map((word) => (
                    <span
                      key={word}
                      className="text-display text-xl font-bold uppercase text-[var(--color-base)]/80 flex items-center gap-10 whitespace-nowrap"
                    >
                      {word}
                      <span className="w-2 h-2 rounded-full bg-[var(--color-vermillion)]" />
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>

          {/* Row 2: Right-scrolling */}
          <div className="marquee-container border-b border-[var(--color-base)]/10 py-4 bg-[var(--color-base)]/5">
            <div className="marquee-track marquee-right">
              {[...Array(2)].map((_, i) => (
                <span key={i} className="flex items-center gap-10">
                  {[
                    "Node.js", "Express.js", "PostgreSQL", "Prisma ORM",
                    "Upstash Redis", "JWT Auth", "Cloudinary CDN",
                    "REST APIs", "Puppeteer PDF", "GitHub Actions",
                  ].map((word) => (
                    <span
                      key={word}
                      className="text-display text-xl font-bold uppercase text-[var(--color-base)]/80 flex items-center gap-10 whitespace-nowrap"
                    >
                      {word}
                      <span className="w-2 h-2 rounded-full bg-[var(--color-amber)]" />
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Category Cards Grid ── */}
        <div
          ref={cardsRef}
          className="section-wrapper grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className={cn(
                "skill-card p-8 rounded-3xl border border-[var(--color-base)]/10 bg-[var(--color-base)]/[0.02]",
                "flex flex-col gap-6 hover:border-[var(--color-vermillion)]/40 hover:bg-[var(--color-base)]/[0.04]",
                "transition-all duration-300 group"
              )}
            >
              {/* Header */}
              <div className="flex items-center gap-4 border-b border-[var(--color-base)]/10 pb-4">
                {cat.icon}
                <h3 className="text-display text-xl font-bold text-[var(--color-base)] group-hover:text-[var(--color-vermillion)] transition-colors duration-300">
                  {cat.title}
                </h3>
              </div>

              {/* Skills list */}
              <ul className="flex flex-col gap-3.5 text-body text-sm">
                {cat.skills.map((skill, sIdx) => (
                  <li
                    key={sIdx}
                    className="flex justify-between items-center border-b border-[var(--color-base)]/[0.05] pb-2 last:border-0 last:pb-0"
                  >
                    <span className="text-[var(--color-base)]/75 group-hover:text-[var(--color-base)] transition-colors duration-300">
                      {skill.name}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded bg-[var(--color-base)]/10 text-[var(--color-base)] font-semibold uppercase tracking-wider select-none">
                      {skill.level}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
