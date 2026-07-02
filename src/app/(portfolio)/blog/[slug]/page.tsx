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

  const cover =
    post.coverImage ||
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?fit=crop&w=1200&h=630&q=80";

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
              {post.content ? (
                <div
                  dangerouslySetInnerHTML={{ __html: post.content }}
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
    </>
  );
}
