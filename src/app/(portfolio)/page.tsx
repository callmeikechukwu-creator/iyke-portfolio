import { Suspense } from "react";
import Hero from "@/components/sections/Hero";
import { db } from "@/lib/db";
import Link from "next/link";
import FeaturedProjectsGrid from "@/components/sections/FeaturedProjectsGrid";
import { getTechIconComponent } from "@/components/ui/Icons";
import Stats from "@/components/sections/Stats";
import Testimonials from "@/components/sections/Testimonials";
import { ProjectCardSkeleton, TestimonialSkeleton } from "@/components/ui/Skeletons";

/* ─────────────────────────────────────────────────────────────
   Database Query Child Server Components (for Suspense streaming)
   ───────────────────────────────────────────────────────────── */

async function FeaturedProjectsSection() {
  const projects = await db.project.findMany({
    where: { featured: true },
    orderBy: { order: "asc" },
    take: 4,
  });

  return <FeaturedProjectsGrid projects={projects} />;
}

async function TestimonialsSection() {
  const testimonials = await db.testimonial.findMany({
    orderBy: { order: "asc" },
  });

  return <Testimonials testimonials={testimonials} />;
}

export default function HomePage() {
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
          py-5 border-y border-border
          bg-ink overflow-hidden
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
                      text-base/75
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
          3. PHILOSOPHY & INTRO BLOCK
      ════════════════════════════════════════ */}
      <section
        aria-label="Philosophy"
        className="relative w-full bg-surface border-b border-border py-20 md:py-28"
      >
        <div className="section-wrapper flex flex-col gap-6 max-w-[800px]">
          <span className="text-label text-vermillion uppercase tracking-[var(--tracking-wide)]">
            Core Philosophy
          </span>
          <h2
            className="text-display text-ink"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)", letterSpacing: "-0.03em", lineHeight: "1.2" }}
          >
            Bridging clean engineering with rich aesthetics. I build high-performance backend pipelines and design premium web interfaces that feel alive.
          </h2>
          <p className="text-body text-muted text-base md:text-lg leading-relaxed max-w-2xl mt-2">
            Engineering is about more than making things work—it is about crafting digital artifacts that are fast, intuitive, and built to scale. I specialize in turning complex database architectures, caching mechanisms, and real-time Socket.io dashboards into smooth, premium products.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-vermillion hover:text-vermillion-hover transition-colors duration-200 font-body w-fit"
          >
            Read the full story <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════
          4. CORE EXPERTISE & SERVICES
      ════════════════════════════════════════ */}
      <section
        aria-label="Services and Expertise"
        className="relative w-full bg-base border-b border-border py-20 md:py-28"
      >
        <div className="section-wrapper flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <span className="text-label text-vermillion uppercase tracking-[var(--tracking-wide)]">
              Expertise
            </span>
            <h2
              className="text-display text-ink"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.03em" }}
            >
              Superpowers &amp; Services
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-4">
            {[
              {
                title: "Full-Stack Development",
                desc: "Building rich, animated client applications in Next.js/React integrated with robust backend servers.",
              },
              {
                title: "API & Backend Systems",
                desc: "Designing secure, structured RESTful and WebSocket integrations with custom middleware and OAuth2 specs.",
              },
              {
                title: "Database & Caching",
                desc: "Optimizing database schemas with PostgreSQL/Prisma and delivering low-latency queries using Upstash Redis.",
              },
              {
                title: "Scraping & Automation",
                desc: "Engineering headless browser agents with Puppeteer for automated pipelines, PDF generation, and data extraction.",
              },
            ].map((service, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-4 p-6 rounded-3xl border border-border-strong/40 bg-surface hover:border-vermillion/40 transition-colors duration-300"
              >
                <span className="text-body text-xs font-bold text-vermillion uppercase tracking-wider">
                  0{idx + 1}
                </span>
                <h3 className="text-display text-lg font-bold text-ink leading-tight">
                  {service.title}
                </h3>
                <p className="text-body text-xs md:text-sm text-muted leading-relaxed font-body">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          5. FEATURED WORK PREVIEW (Suspense Streamed)
      ════════════════════════════════════════ */}
      <Suspense
        fallback={
          <div className="section-wrapper py-20">
            <div className="flex flex-col gap-8">
              <div className="h-20 w-1/3 bg-[var(--color-border)] rounded-xl animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ProjectCardSkeleton />
                <ProjectCardSkeleton />
              </div>
            </div>
          </div>
        }
      >
        <FeaturedProjectsSection />
      </Suspense>

      {/* ════════════════════════════════════════
          6. QUICK FACTS & KEY STATS (GSAP Animated)
      ════════════════════════════════════════ */}
      <Stats />

      {/* ════════════════════════════════════════
          7. CLIENT TESTIMONIALS (Suspense Streamed)
      ════════════════════════════════════════ */}
      <Suspense
        fallback={
          <div className="section-wrapper py-20 flex items-center justify-center">
            <TestimonialSkeleton />
          </div>
        }
      >
        <TestimonialsSection />
      </Suspense>

      {/* ════════════════════════════════════════
          8. CTA STRIP
      ════════════════════════════════════════ */}
      <section
        aria-labelledby="cta-heading"
        className="
          section-padding bg-surface
          border-b border-border
        "
      >
        <div className="section-wrapper flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-3">
            <h2
              id="cta-heading"
              className="text-display text-ink"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3.5rem)", letterSpacing: "-0.03em" }}
            >
              LET&apos;S BUILD SOMETHING.
            </h2>
            <p className="text-body text-muted max-w-[480px] font-body">
              Available for full-stack projects, consulting, and technical partnerships.
            </p>
          </div>

          <Link
            href="/contact"
            className="
              group
              shrink-0 inline-flex items-center gap-3
              px-8 py-4 rounded-full
              bg-vermillion text-base
              text-body text-sm font-semibold
              tracking-[var(--tracking-wide)]
              hover:bg-vermillion-hover
              hover:scale-[1.03] active:scale-[0.97]
              hover:shadow-[0_12px_24px_rgba(214,58,47,0.25)]
              transition-all duration-300
              shadow-[var(--shadow-md)]
            "
          >
            Get in touch
            <span 
              className="transition-transform duration-300 ease-out group-hover:translate-x-1.5" 
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
