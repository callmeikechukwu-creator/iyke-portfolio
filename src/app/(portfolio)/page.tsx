export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Hero from "@/components/sections/Hero";
import { db } from "@/lib/db";
import FeaturedProjectsGrid from "@/components/sections/FeaturedProjectsGrid";
import { getTechIconComponent } from "@/components/ui/Icons";
import Stats from "@/components/sections/Stats";
import Testimonials from "@/components/sections/Testimonials";
import { ProjectCardSkeleton, TestimonialSkeleton } from "@/components/ui/Skeletons";
import ScrollReveal from "@/components/animations/ScrollReveal";
/** Native date formatter — no package needed */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

/* ─────────────────────────────────────────────────────────────
   Database Query Child Server Components (for Suspense streaming)
   ───────────────────────────────────────────────────────────── */

async function FeaturedProjectsSection() {
  let projects: any[] = [];
  try {
    projects = await db.project.findMany({
      where: { featured: true },
      orderBy: { order: "asc" },
      take: 4,
    });
  } catch (error) {
    console.error("Failed to query featured projects:", error);
  }

  return <FeaturedProjectsGrid projects={projects} />;
}

async function TestimonialsSection() {
  let testimonials: any[] = [];
  try {
    testimonials = await db.testimonial.findMany({
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Failed to query testimonials:", error);
  }

  return <Testimonials testimonials={testimonials} />;
}

async function RecentBlogSection() {
  let posts: any[] = [];
  try {
    posts = await db.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
  } catch (error) {
    console.error("Failed to query recent blog posts:", error);
  }

  return (
    <section aria-label="Recent blog posts" className="w-full bg-base border-b border-border py-20 md:py-28">
      <div className="section-wrapper flex flex-col gap-12">
        <div className="flex flex-col gap-3">
          <span className="text-label text-vermillion uppercase tracking-[var(--tracking-wide)]">
            Journal
          </span>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2
              className="text-display text-ink"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.03em" }}
            >
              Recent Writing
            </h2>
            {posts.length > 0 && (
              <a
                href="/blog"
                className="text-xs font-bold font-body text-vermillion hover:underline whitespace-nowrap"
              >
                View all articles →
              </a>
            )}
          </div>
        </div>

        {posts.length === 0 ? (
          /* Homepage Blog Empty State */
          <div className="p-8 md:p-12 rounded-3xl border border-border bg-surface text-center max-w-xl mx-auto w-full flex flex-col items-center gap-4">
            <svg
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-28 h-28"
              aria-hidden="true"
            >
              <rect x="48" y="36" width="82" height="102" rx="7" fill="rgba(0,0,0,0.05)" />
              <rect x="40" y="28" width="82" height="102" rx="7" fill="var(--color-base)" stroke="var(--color-border)" strokeWidth="1.5" />
              <rect x="30" y="18" width="82" height="102" rx="7" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1.5" />
              <line x1="44" y1="40" x2="98" y2="40" stroke="var(--color-border)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="44" y1="54" x2="98" y2="54" stroke="var(--color-border)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="44" y1="68" x2="80" y2="68" stroke="var(--color-border)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="44" y1="82" x2="98" y2="82" stroke="var(--color-border)" strokeWidth="1.5" strokeLinecap="round" />
              <g transform="rotate(-40, 108, 128)">
                <rect x="102" y="72" width="12" height="10" rx="3" fill="var(--color-ink)" />
                <rect x="102" y="81" width="12" height="42" rx="3" fill="var(--color-vermillion)" />
                <rect x="102" y="110" width="12" height="9" rx="2" fill="rgba(0,0,0,0.18)" />
                <polygon points="102,119 114,119 108,134" fill="var(--color-ink)" />
              </g>
            </svg>
            <span className="text-display text-lg font-bold text-ink leading-tight font-body">
              Writing in Progress
            </span>
            <p className="text-body text-sm text-muted leading-relaxed font-body">
              Stay tuned for future articles, tutorials, and technical writings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {posts.map((post) => {
              // Calculate read time
              const wordCount = post.content ? post.content.split(/\s+/).length : 0;
              const readTime = Math.max(1, Math.ceil(wordCount / 200));

              // Excerpt
              const excerpt = post.content
                ? post.content.replace(/<[^>]*>/g, "").substring(0, 100) + "..."
                : "Read the full article.";

              return (
                <article
                  key={post.id}
                  className="group relative flex flex-col justify-between p-6 rounded-3xl border border-border bg-surface hover:border-vermillion/40 transition-colors duration-300 active:scale-[0.98]"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-body text-[10px] font-bold text-muted uppercase tracking-wider">
                      <span>{formatDate(new Date(post.createdAt))}</span>
                      <span>{readTime} min read</span>
                    </div>
                    <h3 className="font-body text-lg font-black text-ink leading-snug group-hover:text-vermillion transition-colors duration-200">
                      <a href={`/blog/${post.slug}`} className="focus:outline-none">
                        <span className="absolute inset-0 z-10" />
                        {post.title}
                      </a>
                    </h3>
                    <p className="text-body text-xs md:text-sm text-muted leading-relaxed font-body">
                      {excerpt}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-vermillion mt-6 font-body">
                    Read article <span aria-hidden="true">→</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
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
          3. PHILOSOPHY & INTRO BLOCK (Side-by-Side 3D Graphic)
      ════════════════════════════════════════ */}
      <ScrollReveal direction="up" delay={0.1}>
        <section
          aria-label="Philosophy"
          className="relative w-full bg-surface border-b border-border py-20 md:py-28"
        >
          <div className="section-wrapper">
            <div>
              
              {/* Text Content */}
              <div className="flex flex-col gap-6 max-w-3xl">
                <span className="text-label text-vermillion uppercase tracking-[var(--tracking-wide)]">
                  Core Philosophy
                </span>
                <h2
                  className="text-display text-ink"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)", letterSpacing: "-0.03em", lineHeight: "1.2" }}
                >
                  Bridging clean engineering with rich aesthetics. I build high-performance backend pipelines and design premium web interfaces that feel alive.
                </h2>
                <p className="text-body text-muted text-base md:text-lg leading-relaxed mt-2 font-body">
                  Engineering is about more than making things work—it is about crafting digital artifacts that are fast, intuitive, and built to scale. I specialize in turning complex database architectures, caching mechanisms, and real-time Socket.io dashboards into smooth, premium products.
                </p>
                <a
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-vermillion hover:text-vermillion-hover transition-colors duration-200 font-body w-fit"
                >
                  Read the full story <span aria-hidden="true">→</span>
                </a>
              </div>



            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ════════════════════════════════════════
          4. CORE EXPERTISE & SERVICES (Side-by-Side 3D Layout)
      ════════════════════════════════════════ */}
      <section
        aria-label="Services and Expertise"
        className="relative w-full bg-base border-b border-border py-20 md:py-28"
      >
        <div className="section-wrapper">
          <div className="flex flex-col gap-10">
            <ScrollReveal direction="up">
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
            </ScrollReveal>

            {/* Services Cards */}
            <div className="w-full">
              <ScrollReveal
                direction="up"
                stagger={0.12}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8"
              >
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
                    className="flex flex-col gap-4 p-6 rounded-3xl border border-border-strong/40 bg-surface hover:border-vermillion/40 transition-colors duration-300 active:scale-[0.98]"
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
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          5. FEATURED WORK PREVIEW (Suspense Streamed & Scroll Reveal)
      ════════════════════════════════════════ */}
      <Suspense
        fallback={
          <div className="section-wrapper py-20">
            <div className="flex flex-col gap-8">
              <div className="h-20 w-1/3 bg-border rounded-xl animate-pulse" />
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
          7. CLIENT TESTIMONIALS (Suspense Streamed & Fade Reveal with 3D Illustration)
      ════════════════════════════════════════ */}
      <section aria-label="Client feedback" className="w-full bg-[var(--color-surface)] border-b border-border py-20 md:py-28">
        <div className="section-wrapper">
          <div className="flex flex-col gap-10">
            <ScrollReveal direction="fade" delay={0.1}>
              <div className="flex flex-col gap-3 text-center items-center">
                <span className="text-label text-vermillion uppercase tracking-[var(--tracking-wide)]">
                  TESTIMONIALS
                </span>
                <h2
                  className="text-display text-ink"
                  style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}
                >
                  Trusted by Partners
                </h2>
              </div>
            </ScrollReveal>
            <Suspense fallback={<div className="flex justify-center py-10"><TestimonialSkeleton /></div>}>
              <TestimonialsSection />
            </Suspense>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          8. RECENT BLOG WRITING (Dynamic Section)
      ════════════════════════════════════════ */}
      <Suspense fallback={<div className="h-32 bg-base/5 animate-pulse" />}>
        <RecentBlogSection />
      </Suspense>

      {/* ════════════════════════════════════════
          9. CTA STRIP with 3D Envelope visual
      ════════════════════════════════════════ */}
      <section
        aria-labelledby="cta-heading"
        className="
          py-20 md:py-28 bg-surface
          border-b border-border
        "
      >
        <div className="section-wrapper">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 w-full">
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

            <a
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
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
