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
              <div className="col-span-2 py-20 text-center">
                <p className="text-body text-muted text-base">
                  No projects published yet. Check back soon or view the admin dashboard to add case studies.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
