"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

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

interface ProjectCardProps {
  project: Project;
  index: number;
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

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const config = CARD_CONFIG[project.slug] || DEFAULT_CONFIG;

  return (
    <div className="project-card-wrapper opacity-0 w-full h-full">
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
}
