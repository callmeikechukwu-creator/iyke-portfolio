"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard from "@/components/ui/ProjectCard";

gsap.registerPlugin(ScrollTrigger);

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

interface ProjectsProps {
  projects: Project[];
}

/**
 * Projects Component
 * Renders the full list of case studies on the projects index page.
 * Features:
 *   - "SELECTED WORKS" display header
 *   - Staggered list element reveals on mount/scroll
 *   - Dynamic layout with grid overlay background
 */
export default function Projects({ projects }: ProjectsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal header elements
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
          }
        );
      }

      // Staggered reveal for project items
      if (listRef.current) {
        const wrappers = listRef.current.querySelectorAll(".project-card-wrapper");
        if (wrappers.length > 0) {
          gsap.fromTo(
            wrappers,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: listRef.current,
                start: "top 90%",
                once: true,
                invalidateOnRefresh: true,
              }
            }
          );
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="projects-section"
      aria-label="Selected works list"
      className="relative w-full bg-[var(--color-base)] border-b border-[var(--color-border)] pt-[var(--navbar-height)] min-h-[80vh]"
    >
      {/* Grid Overlay background decoration */}
      <div
        aria-hidden="true"
        className="
          absolute inset-0 pointer-events-none
          bg-[linear-gradient(to_right,var(--color-ink)_1px,transparent_1px),
              linear-gradient(to_bottom,var(--color-ink)_1px,transparent_1px)]
          bg-[size:6rem_6rem]
          opacity-[0.015]
        "
      />

      <div className="w-full bg-[var(--color-surface)] rounded-t-[2.5rem] md:rounded-t-[3.75rem] py-12 md:py-24 border-t border-[var(--color-border)]/50 relative overflow-hidden">
        <div className="max-w-[var(--content-max-width)] mx-auto px-6 md:px-12 flex flex-col gap-12 md:gap-16">
          
          {/* Header */}
          <div ref={headerRef} className="flex flex-col gap-3 max-w-[640px]">
            <span className="text-label text-[var(--color-vermillion)] uppercase tracking-[var(--tracking-wide)]">
              Case Studies
            </span>
            <h1
              className="text-display text-[var(--color-ink)]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.03em" }}
            >
              SELECTED WORKS
            </h1>
            <p className="text-body text-base md:text-lg leading-relaxed mt-2" style={{ color: "var(--color-ink)", opacity: 0.7 }}>
              A curated index of projects spanning full stack engineering, interactive visual applications, and custom database integrations. Each case study details technical workflows and architecture choices.
            </p>
          </div>

          {/* Projects list */}
          <div
            ref={listRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
          >
            {projects.length > 0 ? (
              projects.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={i}
                />
              ))
            ) : (
              <div className="col-span-2 flex justify-center py-6">
                <div className="p-8 md:p-12 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] text-center max-w-xl w-full flex flex-col items-center gap-4 shadow-[var(--shadow-sm)]">
                  <svg
                    viewBox="0 0 160 160"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-28 h-28"
                    aria-hidden="true"
                  >
                    {/* Background stacked shadow */}
                    <rect x="48" y="36" width="82" height="82" rx="12" fill="rgba(0,0,0,0.03)" />
                    {/* Middle window layer */}
                    <rect x="36" y="24" width="82" height="82" rx="12" fill="var(--color-base)" stroke="var(--color-border)" strokeWidth="1.5" />
                    {/* Top window layer */}
                    <rect x="24" y="12" width="82" height="82" rx="12" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1.5" />
                    
                    {/* Decorative browser dots */}
                    <circle cx="36" cy="22" r="3" fill="var(--color-vermillion)" />
                    <circle cx="46" cy="22" r="3" fill="var(--color-amber)" />
                    <circle cx="56" cy="22" r="3" fill="var(--color-border-strong)" />

                    {/* Editor header rule */}
                    <path d="M24 32H106" stroke="var(--color-border)" strokeWidth="1.5" />
                    
                    {/* Blueprint grid dashes */}
                    <line x1="36" y1="42" x2="36" y2="84" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="52" y1="42" x2="52" y2="84" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="68" y1="42" x2="68" y2="84" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="84" y1="42" x2="84" y2="84" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="3 3" />
                    
                    <line x1="30" y1="48" x2="100" y2="48" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="30" y1="64" x2="100" y2="64" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="3 3" />

                    {/* Compass overlay indicating work-in-progress drafting */}
                    <g transform="translate(68, 60)">
                      <circle cx="0" cy="0" r="18" stroke="var(--color-border-strong)" strokeWidth="1.5" strokeDasharray="4 2" />
                      <line x1="-24" y1="24" x2="0" y2="0" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" />
                      <line x1="24" y1="24" x2="0" y2="0" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" />
                      {/* Brass hinge circle */}
                      <circle cx="0" cy="0" r="4" fill="var(--color-vermillion)" stroke="var(--color-ink)" strokeWidth="1.5" />
                    </g>
                  </svg>
                  <span className="text-display text-lg font-bold text-[var(--color-ink)] leading-tight font-body">
                    Crafting Selected Works
                  </span>
                  <p className="text-body text-sm text-[var(--color-muted)] leading-relaxed font-body">
                    Case studies, software architecture drafts, and interactive visual designs are currently being finalized.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
