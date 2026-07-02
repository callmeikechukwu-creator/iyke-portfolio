export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { Calendar, User } from "lucide-react";
import StickyShareRail from "@/components/sections/StickyShareRail";
import LightboxManager from "@/components/ui/LightboxManager";

/** Format date, e.g. July 02, 2026 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

/** Strip [related-post:slug] shortcodes — we no longer render inline embeds */
function stripShortcodes(content: string): string {
  return content.replace(/\[related-post:[a-zA-Z0-9-]+\]/g, "");
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({ where: { slug } });

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt || "Read the full blog article by Ikechukwu Alaeto.",
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({ where: { slug } });

  if (!post || !post.published) notFound();

  /* Fetch up to 2 other published articles for "Keep Reading" */
  const recommendations = await db.blogPost.findMany({
    where: { published: true, id: { not: post.id } },
    take: 2,
    orderBy: { createdAt: "desc" },
  });

  const cover =
    post.coverImage ||
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?fit=crop&w=1200&h=630&q=80";

  const cleanContent = post.content ? stripShortcodes(post.content) : null;

  return (
    <>
      {/* Sticky left social share rail */}
      <StickyShareRail title={post.title} />

      {/* Lightbox click-to-zoom manager */}
      <LightboxManager />

      <article className="w-full bg-[var(--color-surface)] border-b border-border pt-28 pb-24 md:pt-32 md:pb-32 min-h-[85vh]">
        <div className="max-w-[680px] mx-auto px-6 md:px-0">

          <ScrollReveal direction="fade" delay={0.1}>
            {/* Category pill — centred */}
            <div className="flex justify-center mb-4">
              <span className="text-vermillion bg-vermillion/5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest font-display">
                {post.category || "Announcements"}
              </span>
            </div>

            {/* Ballega article title — centred */}
            <h1
              className="text-ink leading-tight mb-8 text-center uppercase font-logo"
              style={{ fontSize: "clamp(2rem, 5.5vw, 3.8rem)", letterSpacing: "-0.03em" }}
            >
              {post.title}
            </h1>

            {/* Metadata row — centred */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-b border-border pb-10 mb-10 text-[11px] font-bold text-muted uppercase tracking-wider font-display">
              <span className="text-ink flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-muted/80" />
                Ikechukwu Alaeto
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-border-strong hidden sm:inline" />
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-muted/80" />
                {formatDate(new Date(post.createdAt))}
              </span>
            </div>
          </ScrollReveal>

          {/* Featured cover image */}
          <ScrollReveal direction="fade" delay={0.2}>
            <div className="w-full aspect-[16/9] overflow-hidden rounded-3xl border border-border shadow-md mb-12 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cover}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/15 to-transparent pointer-events-none" />
            </div>
          </ScrollReveal>

          {/* Article body */}
          <ScrollReveal direction="fade" delay={0.25}>
            <div className="prose prose-neutral max-w-none text-ink/80 leading-relaxed font-display text-base md:text-[17px] font-medium tracking-normal space-y-6">
              {cleanContent ? (
                <div
                  dangerouslySetInnerHTML={{ __html: cleanContent }}
                  className="space-y-6"
                />
              ) : (
                <p className="italic text-muted font-display">
                  No content available for this post.
                </p>
              )}
            </div>
          </ScrollReveal>

        </div>
      </article>

      {/* ── Keep Reading — only shown when other posts exist ── */}
      {recommendations.length > 0 && (
        <section className="w-full bg-[var(--color-surface)] border-b border-border py-16 md:py-20 select-none">
          <div className="max-w-[760px] mx-auto px-6">
            <h3 className="text-xl font-bold uppercase font-logo text-ink tracking-tight mb-8">
              Keep Reading
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {recommendations.map((rec) => (
                <article
                  key={rec.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border bg-base/5 overflow-hidden hover:border-vermillion/40 transition-all duration-300 h-full"
                >
                  <div className="flex flex-col">
                    <div className="relative w-full aspect-[16/10] overflow-hidden border-b border-border shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          rec.coverImage ||
                          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?fit=crop&w=600&h=400&q=80"
                        }
                        alt={rec.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 flex flex-col gap-2">
                      <span className="text-[9px] font-bold text-vermillion uppercase tracking-wider bg-vermillion/5 px-2 py-0.5 rounded-md font-display w-fit">
                        {rec.category || "Announcements"}
                      </span>
                      <h4 className="text-sm font-bold uppercase font-logo text-ink group-hover:text-vermillion transition-colors duration-200 line-clamp-1 pr-2">
                        <a href={`/blog/${rec.slug}`} className="after:absolute after:inset-0">
                          {rec.title}
                        </a>
                      </h4>
                      <p className="text-xs text-muted leading-relaxed font-display font-medium line-clamp-2 mt-1">
                        {rec.excerpt || "Read this article to learn more."}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
