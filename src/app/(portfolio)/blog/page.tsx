export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Suspense } from "react";
import { db } from "@/lib/db";
import ScrollReveal from "@/components/animations/ScrollReveal";
import InteractiveFolder from "@/components/ui/InteractiveFolder";

/** Native date formatter */
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
      <div className="flex flex-col items-center justify-center text-center py-12 md:py-20 max-w-xl mx-auto px-6">
        <InteractiveFolder size={1.25} />
        <h2 className="text-display text-xl font-bold uppercase tracking-tight text-ink mt-8 mb-3 font-logo">
          BE THE FIRST TO SHARE YOUR THOUGHTS
        </h2>
        <p className="text-sm text-muted leading-relaxed font-display font-medium max-w-[280px]">
          No posts have been published yet. Interact with the drafts above to see upcoming topics!
        </p>
        <a
          href="/"
          className="mt-8 px-6 py-2.5 bg-ink hover:bg-vermillion text-base hover:text-white text-xs font-bold font-body rounded-full transition-all duration-300 active:scale-95 uppercase tracking-wider"
        >
          Return Home
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
      {posts.map((post) => {
        // Calculate read time: assume 200 words per minute
        const wordCount = post.content ? post.content.split(/\s+/).length : 0;
        const readTime = Math.max(1, Math.ceil(wordCount / 200));
        const cover = post.coverImage || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?fit=crop&w=800&h=500&q=80";

        return (
          <article
            key={post.id}
            className="group relative flex flex-col justify-between rounded-3xl border border-border bg-surface overflow-hidden hover:border-vermillion/40 hover:shadow-lg transition-all duration-300 active:scale-[0.99] h-full"
          >
            <div className="flex flex-col">
              {/* Cover Image Frame */}
              <div className="relative w-full aspect-[16/10] overflow-hidden border-b border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cover}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/10 to-transparent pointer-events-none" />
              </div>

              {/* Card Meta Content */}
              <div className="p-6 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-vermillion uppercase tracking-wider bg-vermillion/5 px-2 py-0.5 rounded-md font-display">
                    {post.category || "Announcements"}
                  </span>
                  <span className="text-[9px] font-bold text-muted uppercase tracking-wider font-display">
                    {readTime} min read
                  </span>
                </div>

                <h3 className="text-xl font-bold text-ink leading-snug group-hover:text-vermillion transition-colors duration-200 uppercase font-logo">
                  <a href={`/blog/${post.slug}`} className="focus:outline-none">
                    <span className="absolute inset-0 z-10" />
                    {post.title}
                  </a>
                </h3>

                <p className="text-sm text-muted leading-relaxed font-display font-medium mt-1.5">
                  {post.excerpt || "Read the full article to explore deep dives, scaling guidelines, and insights."}
                </p>
              </div>
            </div>

            {/* Card Footer action */}
            <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-border/40 mt-auto">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider font-display">
                {formatDate(new Date(post.createdAt))}
              </span>
              <div className="flex items-center gap-1 text-[10px] font-bold text-vermillion uppercase tracking-wider font-display">
                Read Article <span className="transform group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default function BlogIndexPage() {
  return (
    <section aria-label="Blog posts list" className="w-full bg-[var(--color-surface)] border-b border-border py-20 md:py-28 min-h-[85vh] flex items-center">
      <div className="section-wrapper w-full">
        <ScrollReveal direction="fade" delay={0.1}>
          <div className="flex flex-col gap-3 mb-12 md:mb-16">
            <span className="text-label text-vermillion uppercase tracking-[var(--tracking-wide)]">
              Journal
            </span>
            <h1
              className="text-display text-ink uppercase font-logo"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.03em" }}
            >
              Latest Writings
            </h1>
          </div>
        </ScrollReveal>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="h-96 rounded-3xl border border-border bg-base/5 animate-pulse" />
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
