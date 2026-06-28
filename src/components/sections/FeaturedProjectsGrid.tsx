"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  techStack: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  imageUrl: string | null;
}

interface FeaturedProjectsGridProps {
  projects: Project[];
}

interface CardStyleConfig {
  bgColor: string;
  cardBorder: string;
  mockupUrl: string;
  deliverable: string;
}

const CARD_CONFIG: Record<string, CardStyleConfig> = {
  naturalist: {
    bgColor: "bg-[#162C22]", // Forest Green
    cardBorder: "border-white/5 hover:border-white/15",
    mockupUrl: "/projects/naturalist-mockup.png",
    deliverable: "interactive e-commerce"
  },
  "samc-2026": {
    bgColor: "bg-[#B2A595]", // Warm Taupe/Beige
    cardBorder: "border-white/5 hover:border-white/15",
    mockupUrl: "/projects/samc-mockup.png",
    deliverable: "registration portal"
  },
  "tsa-youth-week-26": {
    bgColor: "bg-[#D63A2F]", // Vermillion Red
    cardBorder: "border-white/5 hover:border-white/15",
    mockupUrl: "/projects/tsa-mockup.png",
    deliverable: "event analytics platform"
  },
  "goatc-cbt": {
    bgColor: "bg-[#2E3331]", // Dark Slate
    cardBorder: "border-white/5 hover:border-white/15",
    mockupUrl: "/projects/goatc-mockup.png",
    deliverable: "cbt examination system"
  }
};

const DEFAULT_CONFIG: CardStyleConfig = {
  bgColor: "bg-[#1E1C18]",
  cardBorder: "border-white/5 hover:border-white/15",
  mockupUrl: "/projects/naturalist-mockup.png",
  deliverable: "digital product case study"
};

export default function FeaturedProjectsGrid({ projects }: FeaturedProjectsGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el || projects.length === 0) return;

    const wrappers = el.querySelectorAll(".project-card-wrapper");
    const ctx = gsap.context(() => {
      wrappers.forEach((wrapper) => {
        gsap.fromTo(
          wrapper,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: wrapper,
              start: "top 90%", // enters when card top is 90% from top of viewport
              once: true, // Only plays once to completely prevent overlap jumps on scroll-up
              invalidateOnRefresh: true,
            }
          }
        );
      });
    }, el);

    return () => ctx.revert();
  }, [projects]);

  return (
    <section
      id="featured-work"
      aria-labelledby="featured-work-heading"
      className="py-12 md:py-20 bg-[var(--color-base)] border-b border-[var(--color-border)]"
    >
      <div className="w-full bg-[var(--color-surface)] rounded-t-[2.5rem] md:rounded-t-[3.75rem] py-12 md:py-24 border-t border-[var(--color-border)]/50 relative overflow-hidden">
        <div className="max-w-[var(--content-max-width)] mx-auto px-6 md:px-12 flex flex-col gap-12 md:gap-16">
          
          {/* Header */}
          <div className="flex flex-row flex-wrap items-end justify-between gap-4 w-full">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-muted font-body">
                SELECTED WORK
              </span>
              <h2
                id="featured-work-heading"
                className="text-display font-extrabold uppercase leading-none tracking-tight text-[var(--color-ink)]"
                style={{ fontSize: "clamp(2rem, 5vw, 4rem)", letterSpacing: "-0.03em" }}
              >
                FEATURED PROJECTS
              </h2>
            </div>
            <Link
              href="/projects"
              className="
                inline-flex items-center gap-2
                border border-[var(--color-ink)]/25
                text-[var(--color-ink)]
                rounded-full px-6 py-3
                text-xs md:text-sm font-medium tracking-wide font-body
                hover:bg-[var(--color-ink)] hover:text-[var(--color-surface)]
                hover:border-transparent
                transition-all duration-500 ease-[var(--ease-out-expo)]
                group shrink-0 w-fit self-start sm:self-auto
              "
            >
              View All Work
              <svg
                width="14"
                height="14"
                viewBox="0 0 12 12"
                fill="none"
                stroke="#E8A020"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                <line x1="2" y1="10" x2="10" y2="2"></line>
                <polyline points="4 2 10 2 10 8"></polyline>
              </svg>
            </Link>
          </div>

          {/* Responsive Grid */}
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
          >
            {projects.length > 0 ? (
              projects.map((project) => {
                const config = CARD_CONFIG[project.slug] || DEFAULT_CONFIG;

                return (
                  <div
                    key={project.id}
                    className="project-card-wrapper opacity-0 w-full h-full"
                  >
                    <div
                      className={cn(
                        "project-card group relative w-full h-full rounded-[2.5rem] overflow-hidden flex flex-col justify-between p-0 border transition-[transform,box-shadow,border-color,background-color] duration-500 ease-[var(--ease-out-expo)] hover:scale-[1.01] hover:shadow-lg",
                        config.bgColor,
                        config.cardBorder
                      )}
                    >
                      <Link
                        href={`/projects/${project.slug}`}
                        className="absolute inset-0 z-30"
                        aria-label={`View case study for ${project.title}`}
                      />

                      {/* ── Mockup Image Container (Top of card, always visible & flush) ── */}
                      <div className="w-full h-[220px] sm:h-[260px] md:h-[300px] rounded-t-[2.5rem] overflow-hidden bg-black/10 relative z-10 flex items-center justify-center">
                        <img
                          src={config.mockupUrl}
                          alt={`${project.title} Mockup Preview`}
                          className="w-full h-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>

                      {/* ── Text Details & Button (Middle & Bottom) ── */}
                      <div className="relative z-20 flex flex-col justify-between flex-1 gap-6 p-6 md:p-8 pt-2 md:pt-4">
                        
                        {/* Middle Section: Meta, Title, Description */}
                        <div className="flex flex-col gap-3">
                          
                          <div className="flex justify-between items-center text-white/50 text-[10px] font-semibold font-body uppercase tracking-widest">
                            <span>{config.deliverable}</span>
                            <span>
                              est. {project.slug === "naturalist" ? "2026" : "2025"}
                            </span>
                          </div>

                          <h3
                            className="text-display font-extrabold leading-none tracking-tight text-white"
                            style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}
                          >
                            {project.title}
                          </h3>

                          <p className="text-xs md:text-sm leading-relaxed font-medium max-w-[90%] text-white/80">
                            {project.description}
                          </p>
                        </div>

                        {/* Bottom Section: Watch Case Pill Button */}
                        <div
                          className="inline-flex items-center gap-2 border border-white/40 text-white rounded-full px-6 py-3 text-xs md:text-sm font-medium lowercase tracking-wide max-w-fit font-body transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:bg-white group-hover:text-[#1A1814] group-hover:border-transparent"
                        >
                          watch the case
                          
                          {/* Custom Bold SVG Diagonal Arrow with Amber stroke */}
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 12 12"
                            fill="none"
                            stroke="#E8A020"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-transform duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          >
                            <line x1="2" y1="10" x2="10" y2="2"></line>
                            <polyline points="4 2 10 2 10 8"></polyline>
                          </svg>
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 py-12 text-center">
                <p className="text-body text-muted text-base">
                  projects loading...
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
