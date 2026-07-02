export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { ArrowLeft } from "lucide-react";

/** Native date formatter — no package needed */
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
  const post = await db.blogPost.findUnique({
    where: { slug },
  });

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.content
      ? post.content.replace(/<[^>]*>/g, "").substring(0, 150) + "..."
      : "Read the full blog article by Ikechukwu Alaeto.",
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({
    where: { slug },
  });

  if (!post || !post.published) {
    notFound();
  }

  // Calculate read time: assume 200 words per minute
  const wordCount = post.content ? post.content.split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <article className="w-full bg-[var(--color-surface)] border-b border-border py-20 md:py-28 min-h-[80vh]">
      <div className="max-w-[760px] mx-auto px-6 md:px-0">
        
        {/* Back Link */}
        <a
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold font-body text-muted hover:text-vermillion transition-colors duration-200 uppercase tracking-wider mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Journal
        </a>

        <ScrollReveal direction="fade" delay={0.15}>
          {/* Header */}
          <header className="flex flex-col gap-4 border-b border-border pb-8 mb-12">
            <div className="flex items-center gap-4 text-xs font-bold text-muted uppercase tracking-wider font-body">
              <span>{formatDate(new Date(post.createdAt))}</span>
              <span className="w-1 h-1 rounded-full bg-border-strong" />
              <span>{readTime} min read</span>
            </div>
            
            <h1
              className="text-display text-ink leading-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", letterSpacing: "-0.03em" }}
            >
              {post.title}
            </h1>
          </header>

          {/* Content Body */}
          <div className="prose prose-neutral max-w-none text-body text-ink/80 leading-relaxed font-body">
            {post.content ? (
              <div
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="space-y-6 text-base md:text-lg"
              />
            ) : (
              <p className="italic text-muted">No content available for this post.</p>
            )}
          </div>
        </ScrollReveal>

      </div>
    </article>
  );
}
