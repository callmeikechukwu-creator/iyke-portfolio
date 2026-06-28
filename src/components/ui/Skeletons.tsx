import { cn } from "@/lib/utils";

/**
 * Reusable layout skeletons for React Suspense fallbacks.
 * Uses Tailwind's pulse animation overlaying our branding colors.
 */

// ── 1. PROJECT GRID CARD SKELETON (HOMEPAGE & ARCHIVE) ──
export function ProjectCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8 flex flex-col gap-6 animate-pulse select-none",
        className
      )}
    >
      {/* Mock Badge */}
      <div className="h-5 w-24 bg-[var(--color-border)] rounded-md" />

      {/* Mock Title */}
      <div className="flex flex-col gap-3">
        <div className="h-8 md:h-10 w-3/4 bg-[var(--color-border-strong)] rounded-lg" />
        <div className="h-4 w-1/2 bg-[var(--color-border)] rounded-md" />
      </div>

      {/* Mock Tech Badges */}
      <div className="flex flex-wrap gap-2 pt-2">
        <div className="h-6 w-16 bg-[var(--color-border)] rounded-md" />
        <div className="h-6 w-20 bg-[var(--color-border)] rounded-md" />
        <div className="h-6 w-14 bg-[var(--color-border)] rounded-md" />
      </div>

      {/* Mock Device Mockup Frame */}
      <div className="w-full aspect-[16/10] bg-[var(--color-base)]/40 rounded-2xl border border-[var(--color-border)]/50 mt-4 flex items-center justify-center">
        <div className="h-6 w-32 bg-[var(--color-border)] rounded-md opacity-30" />
      </div>
    </div>
  );
}

// ── 2. TESTIMONIAL SLIDER SKELETON (HOMEPAGE) ──
export function TestimonialSkeleton() {
  return (
    <div className="w-full max-w-[850px] mx-auto rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-10 flex flex-col gap-8 animate-pulse select-none">
      {/* Quote marks skeleton */}
      <div className="h-10 w-12 bg-[var(--color-border)]/50 rounded-lg" />

      {/* Quote lines skeleton */}
      <div className="flex flex-col gap-3">
        <div className="h-4 md:h-5 w-full bg-[var(--color-border)] rounded-md" />
        <div className="h-4 md:h-5 w-11/12 bg-[var(--color-border)] rounded-md" />
        <div className="h-4 md:h-5 w-4/5 bg-[var(--color-border)] rounded-md" />
      </div>

      {/* Author profile skeleton */}
      <div className="flex items-center gap-4 border-t border-[var(--color-border)]/30 pt-6">
        <div className="w-12 h-12 rounded-full bg-[var(--color-border-strong)] shrink-0" />
        <div className="flex flex-col gap-2 min-w-0 w-48">
          <div className="h-4 w-32 bg-[var(--color-border-strong)] rounded-md" />
          <div className="h-3.5 w-40 bg-[var(--color-border)] rounded-md" />
        </div>
      </div>
    </div>
  );
}

// ── 3. PROJECTS PAGE LISTING SKELETON ──
export function ProjectsPageSkeleton() {
  return (
    <div className="section-wrapper flex flex-col gap-8 py-12 animate-pulse select-none">
      {/* Filters skeleton */}
      <div className="flex flex-wrap gap-3 pb-6 border-b border-[var(--color-border)]">
        <div className="h-9 w-20 bg-[var(--color-border-strong)] rounded-full" />
        <div className="h-9 w-28 bg-[var(--color-border)] rounded-full" />
        <div className="h-9 w-24 bg-[var(--color-border)] rounded-full" />
      </div>

      {/* Projects Grid skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 animate-pulse">
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
      </div>
    </div>
  );
}

// ── 4. PROJECT CASE STUDY DETAIL SKELETON ──
export function ProjectDetailSkeleton() {
  return (
    <div className="w-full min-h-screen pt-24 animate-pulse select-none">
      <div className="section-wrapper flex flex-col gap-8 pb-16">
        {/* Back Link */}
        <div className="h-5 w-24 bg-[var(--color-border)] rounded-md" />

        {/* Large Title */}
        <div className="h-16 md:h-20 w-2/3 bg-[var(--color-border-strong)] rounded-xl mt-4" />

        {/* Big Description */}
        <div className="flex flex-col gap-3 mt-2">
          <div className="h-5 w-full bg-[var(--color-border)] rounded-md" />
          <div className="h-5 w-5/6 bg-[var(--color-border)] rounded-md" />
        </div>

        {/* Metrics/Meta Rows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-b border-[var(--color-border)] py-8 mt-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-3 w-16 bg-[var(--color-border)] rounded-md" />
              <div className="h-6 w-32 bg-[var(--color-border-strong)] rounded-md" />
            </div>
          ))}
        </div>

        {/* Mock Showcase Banner */}
        <div className="w-full aspect-[16/7] bg-[var(--color-border)]/20 rounded-[2rem] mt-8 flex items-center justify-center">
          <div className="h-12 w-48 bg-[var(--color-border)]/50 rounded-lg opacity-40" />
        </div>

        {/* Case study content lines */}
        <div className="max-w-[760px] mx-auto w-full flex flex-col gap-4 pt-12">
          <div className="h-4 w-full bg-[var(--color-border)]/80 rounded-md" />
          <div className="h-4 w-full bg-[var(--color-border)]/80 rounded-md" />
          <div className="h-4 w-11/12 bg-[var(--color-border)]/80 rounded-md" />
          <div className="h-4 w-4/5 bg-[var(--color-border)]/80 rounded-md" />
        </div>
      </div>
    </div>
  );
}
