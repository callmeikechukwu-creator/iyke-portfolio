import Hero from "@/components/sections/Hero";
import { db } from "@/lib/db";
import Link from "next/link";
import FeaturedProjectsGrid from "@/components/sections/FeaturedProjectsGrid";
import { getTechIconComponent } from "@/components/ui/Icons";

/* ─────────────────────────────────────────────────────────────
   Fetch featured projects for the homepage preview strip
   ───────────────────────────────────────────────────────────── */
async function getFeaturedProjects() {
  try {
    const projects = await db.project.findMany({
      where: { featured: true },
      orderBy: { order: "asc" },
      take: 4, // Fetch up to 4 featured projects for the slider
    });
    return projects;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects();

  return (
    <>
      {/* ════════════════════════════════════════
          1. HERO — full viewport, cinematic
      ════════════════════════════════════════ */}
      <Hero />

      {/* ════════════════════════════════════════
          2. MARQUEE TEASER STRIP
          Identity words scrolling infinitely
      ════════════════════════════════════════ */}
      <section
        aria-label="Skills teaser"
        className="
          py-5 border-y border-[var(--color-border)]
          bg-[var(--color-ink)] overflow-hidden
        "
      >
        <div className="marquee-container">
          <div className="marquee-track marquee-left">
            {[...Array(2)].map((_, i) => (
              <span key={i} className="flex items-center gap-12">
                {[
                  "NEXT.JS", "TYPESCRIPT", "REACT", "NODE.JS",
                  "POSTGRESQL", "PRISMA", "REDIS", "FULL STACK",
                  "WEBSOCKETS", "REST APIs", "DEVOPS", "UI/UX",
                ].map((word) => (
                  <span
                    key={word}
                    className="
                      text-body text-sm font-semibold uppercase
                      tracking-[var(--tracking-wider)]
                      text-[var(--color-base)]/75
                      flex items-center gap-2.5 whitespace-nowrap
                    "
                  >
                    {getTechIconComponent(word, "w-4.5 h-4.5")}
                    {word}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          3. FEATURED WORK PREVIEW (Premium Grid)
      ════════════════════════════════════════ */}
      <FeaturedProjectsGrid projects={featuredProjects} />

      {/* ════════════════════════════════════════
          4. CTA STRIP
      ════════════════════════════════════════ */}
      <section
        aria-labelledby="cta-heading"
        className="
          section-padding bg-[var(--color-surface)]
          border-b border-[var(--color-border)]
        "
      >
        <div className="section-wrapper flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-3">
            <h2
              id="cta-heading"
              className="text-display text-[var(--color-ink)]"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3.5rem)", letterSpacing: "-0.03em" }}
            >
              LET&apos;S BUILD SOMETHING.
            </h2>
            <p className="text-body text-muted max-w-[480px]">
              Available for full-stack projects, consulting, and technical partnerships.
            </p>
          </div>

          <Link
            href="/contact"
            className="
              shrink-0 inline-flex items-center gap-3
              px-8 py-4 rounded-full
              bg-[var(--color-vermillion)] text-[var(--color-base)]
              text-body text-sm font-semibold
              tracking-[var(--tracking-wide)]
              hover:bg-[var(--color-vermillion-hover)]
              transition-colors duration-300
              shadow-[var(--shadow-md)]
            "
          >
            Get in touch
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
