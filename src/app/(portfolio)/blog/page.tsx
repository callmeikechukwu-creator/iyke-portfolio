export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Suspense } from "react";
import { db } from "@/lib/db";
import ScrollReveal from "@/components/animations/ScrollReveal";
/** Native date formatter — no package needed */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Technical articles, tutorials, and deep-dives on full-stack architecture, API designs, and database scaling by Ikechukwu Alaeto.",
};

async function BlogContentSection() {
  let posts: any[] = [];
  try {
    posts = await db.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to query blog posts:", error);
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 md:py-24 max-w-xl mx-auto px-6">
        {/* Inline SVG: stacked pages + pen */}
        <svg
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-36 h-36 md:w-44 md:h-44 mb-8"
          aria-hidden="true"
        >
          {/* Shadow */}
          <rect x="48" y="36" width="82" height="102" rx="7" fill="rgba(0,0,0,0.05)" />
          {/* Back page */}
          <rect x="40" y="28" width="82" height="102" rx="7" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1.5" />
          {/* Front page */}
          <rect x="30" y="18" width="82" height="102" rx="7" fill="var(--color-base)" stroke="var(--color-border)" strokeWidth="1.5" />
          {/* Rule lines */}
          <line x1="44" y1="40" x2="98" y2="40" stroke="var(--color-border)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="44" y1="54" x2="98" y2="54" stroke="var(--color-border)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="44" y1="68" x2="80" y2="68" stroke="var(--color-border)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="44" y1="82" x2="98" y2="82" stroke="var(--color-border)" strokeWidth="1.5" strokeLinecap="round" />
          {/* Pen — rotated -40deg around its tip at (108,128) */}
          <g transform="rotate(-40, 108, 128)">
            {/* Cap */}
            <rect x="102" y="72" width="12" height="10" rx="3" fill="var(--color-ink)" />
            {/* Barrel */}
            <rect x="102" y="81" width="12" height="42" rx="3" fill="var(--color-vermillion)" />
            {/* Grip */}
            <rect x="102" y="110" width="12" height="9" rx="2" fill="rgba(0,0,0,0.18)" />
            {/* Tip */}
            <polygon points="102,119 114,119 108,134" fill="var(--color-ink)" />
          </g>
        </svg>
        <h2 className="font-body text-3xl font-black tracking-tight text-ink mb-4">
          Writing in Progress
        </h2>
        <p className="text-body text-base text-muted leading-relaxed font-body">
          Stay tuned for future articles, tutorials, and technical writings. Check back soon!
        </p>
        <a
          href="/"
          className="mt-8 px-6 py-3 bg-ink text-base text-xs font-bold font-body rounded-full hover:opacity-90 active:scale-95 transition-all duration-200"
        >
          Return Home
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {posts.map((post) => {
        // Calculate read time: assume 200 words per minute
        const wordCount = post.content ? post.content.split(/\s+/).length : 0;
        const readTime = Math.max(1, Math.ceil(wordCount / 200));

        // Short excerpt: clean first 140 chars of content
        const excerpt = post.content
          ? post.content.replace(/<[^>]*>/g, "").substring(0, 140) + "..."
          : "Read the full article to learn more.";

        return (
          <article
            key={post.id}
            className="group relative flex flex-col justify-between p-6 rounded-3xl border border-border bg-surface hover:border-vermillion/40 transition-colors duration-300 active:scale-[0.98]"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between text-body text-[10px] font-bold text-muted uppercase tracking-wider">
                <span>{formatDate(new Date(post.createdAt))}</span>
                <span>{readTime} min read</span>
              </div>
              <h3 className="font-body text-xl font-black text-ink leading-snug group-hover:text-vermillion transition-colors duration-200">
                <a href={`/blog/${post.slug}`} className="focus:outline-none">
                  {/* Stretches link to cover card */}
                  <span className="absolute inset-0 z-10" />
                  {post.title}
                </a>
              </h3>
              <p className="text-body text-sm text-muted leading-relaxed font-body">
                {excerpt}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-vermillion mt-6 font-body">
              Read article <span aria-hidden="true">→</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default function BlogIndexPage() {
  return (
    <section aria-label="Blog posts list" className="w-full bg-[var(--color-surface)] border-b border-border py-20 md:py-28 min-h-[70vh] flex items-center">
      <div className="section-wrapper w-full">
        <ScrollReveal direction="fade" delay={0.1}>
          <div className="flex flex-col gap-3 mb-12 md:mb-16">
            <span className="text-label text-vermillion uppercase tracking-[var(--tracking-wide)]">
              Journal
            </span>
            <h1
              className="text-display text-ink"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.03em" }}
            >
              Latest Writings
            </h1>
          </div>
        </ScrollReveal>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="h-64 rounded-3xl border border-border bg-base/5 animate-pulse" />
              ))}
            </div>
          }
        >
          <BlogContentSection />
        </Suspense>
      </div>
    </section>
  );
}
