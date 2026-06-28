"use client";

import { useState, useEffect, useRef } from "react";
import { Calendar, MapPin, ChevronDown } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { drawLine } from "@/lib/animations";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface Job {
  role: string;
  company: string;
  location: string;
  period: string;
  points: string[];
}

/**
 * Experience Component
 * Interactive timeline page section.
 * Features:
 *   - SVG vertical timeline line on left that draws/animates on scroll
 *   - Accordion cards with smooth transition heights
 *   - Clean, professional design language matching the tokens
 */
export default function Experience() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgLineRef = useRef<SVGLineElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const jobs: Job[] = [
    {
      role: "Founder & Lead Developer",
      company: "Iyke Visuals Studio",
      location: "Ibadan, Nigeria (Remote)",
      period: "2023 - Present",
      points: [
        "Architected and deployed 5+ production full-stack web applications using Next.js and Express.js.",
        "Created custom Node.js backend systems incorporating email OAuth2, scrypt credentials, and RESTful specs.",
        "Integrated Cloudinary media pipelines with clean Next.js rewrite reverse proxies.",
        "Optimized web platforms to deliver sub-second response times using Upstash Redis caching and Neon serverless databases.",
        "Managed complete delivery life cycles, handling staging, DNS configurations, and Render cloud integrations."
      ]
    },
    {
      role: "Educator & Web Developer",
      company: "GOATC",
      location: "Ibadan, Nigeria",
      period: "2024 - 2025",
      points: [
        "Developed and maintained the GOATC computer-based examination (CBT) platform.",
        "Built dynamic WebSocket integrations using Socket.io to sync test progression metrics in real-time.",
        "Managed database schemas and handled student progress dashboard deployments.",
        "Mentored young students in software fundamentals and web development practices."
      ]
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Reveal headers
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

      // 2. Animate SVG timeline line on scroll
      if (svgLineRef.current) {
        drawLine(svgLineRef.current, {
          duration: 1.5,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            end: "bottom 60%",
            scrub: true,
          },
        });
      }

      // 3. Stagger reveal cards
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".experience-card");
        gsap.fromTo(
          cards,
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 85%",
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
      id="experience-section"
      aria-label="Professional journey"
      className="relative w-full bg-[var(--color-base)] border-b border-[var(--color-border)] py-20 md:py-32"
    >
      <div className="section-wrapper">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* ── Left Column: Headers ── */}
          <div ref={headerRef} className="lg:col-span-4 flex flex-col gap-4">
            <span className="text-label text-[var(--color-vermillion)] uppercase tracking-[var(--tracking-wide)]">
              Journey
            </span>
            <h2
              className="text-display text-[var(--color-ink)]"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.03em" }}
            >
              PROFESSIONAL EXPERIENCE
            </h2>
            <p className="text-body text-muted text-base md:text-lg leading-relaxed mt-2 max-w-sm">
              An interactive timeline of my roles building web products, architecting backends, and leading development courses. Click cards to expand.
            </p>
          </div>

          {/* ── Right Column: Timeline & Cards ── */}
          <div className="lg:col-span-8 grid grid-cols-[30px_1fr] md:grid-cols-[40px_1fr] gap-4 relative">
            
            {/* SVG Timeline Axis */}
            <div className="flex flex-col items-center justify-start h-full pt-6 relative" aria-hidden="true">
              <svg width="2" height="100%" className="absolute inset-y-0 opacity-20">
                <line x1="1" y1="0" x2="1" y2="100%" stroke="var(--color-border-strong)" strokeWidth="2" />
              </svg>
              <svg width="2" height="100%" className="absolute inset-y-0 z-1">
                <line
                  ref={svgLineRef}
                  x1="1" y1="0" x2="1" y2="100%"
                  stroke="var(--color-vermillion)"
                  strokeWidth="2.5"
                />
              </svg>
            </div>

            {/* Accordion Cards List */}
            <div ref={cardsRef} className="flex flex-col gap-6 w-full">
              {jobs.map((job, idx) => {
                const isExpanded = expandedIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className={cn(
                      "experience-card p-6 md:p-8 rounded-3xl border transition-all duration-500 cursor-pointer select-none relative overflow-hidden",
                      isExpanded
                        ? "bg-[var(--color-surface)] border-[var(--color-vermillion)] shadow-[var(--shadow-md)]"
                        : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-border-strong)]"
                    )}
                  >
                    {/* Active Marker Bar */}
                    <div
                      className={cn(
                        "absolute top-0 left-0 bottom-0 w-1.5 transition-transform duration-500 origin-top",
                        isExpanded ? "bg-[var(--color-vermillion)] scale-y-100" : "bg-[var(--color-border)] scale-y-0"
                      )}
                    />

                    {/* Card Header Area */}
                    <div className="flex justify-between items-start gap-4 pl-2">
                      <div className="flex flex-col gap-2 min-w-0">
                        <span className="text-body text-xs font-bold uppercase tracking-wider text-[var(--color-vermillion)]">
                          {job.company}
                        </span>
                        <h3 className="text-display text-xl md:text-2xl font-bold text-[var(--color-ink)]">
                          {job.role}
                        </h3>
                        
                        {/* Meta items */}
                        <div className="flex flex-wrap gap-4 text-xs text-muted font-medium mt-1">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[var(--color-vermillion)]" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[var(--color-vermillion)]" />
                            {job.period}
                          </span>
                        </div>
                      </div>

                      {/* Dropdown Chevron */}
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center transition-all duration-300 shrink-0",
                          isExpanded
                            ? "bg-[var(--color-vermillion)]/10 text-[var(--color-vermillion)] border-[var(--color-vermillion)]/30 rotate-180"
                            : "bg-[var(--color-base)]/30 text-muted"
                        )}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Collapsible bullet list */}
                    <div
                      className={cn(
                        "pl-2 overflow-hidden transition-all duration-500 ease-in-out",
                        isExpanded ? "max-h-[500px] mt-6 border-t border-[var(--color-border)] pt-6 opacity-100" : "max-h-0 opacity-0"
                      )}
                    >
                      <ul className="flex flex-col gap-3 text-body text-sm md:text-base text-muted list-disc list-inside">
                        {job.points.map((pt, pIdx) => (
                          <li
                            key={pIdx}
                            className="leading-relaxed hover:text-[var(--color-ink)] transition-colors duration-200"
                          >
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
