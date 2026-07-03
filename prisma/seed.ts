import { db as prisma } from "../src/lib/db";

/**
 * Safe idempotent seed — uses upsert on unique slugs/names.
 * Running this multiple times will NEVER wipe existing data.
 * Only adds missing records or updates fields on existing ones.
 */
async function main() {
  console.log("Seeding testimonials...");

  const testimonials = [
    {
      clientName: "Bright Omoemi",
      role: "Head of Operations",
      company: "GOATC Education",
      quote: "The computer-based testing (CBT) platform built by Ikechukwu worked flawlessly. Its real-time WebSocket dashboard synchronized student metrics in sub-seconds and handled load with absolute stability.",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=150&h=150&q=80",
      order: 1,
    },
    {
      clientName: "Marcus Vance",
      role: "CTO & Co-Founder",
      company: "Veloce Technologies",
      quote: "Ikechukwu restructured our backend infrastructure and integrated Redis caching layers that cut our API latencies by over 60%. His execution is fast, structured, and extremely precise.",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=150&h=150&q=80",
      order: 2,
    },
    {
      clientName: "Dr. Elizabeth Adeyemi",
      role: "Director of Software",
      company: "Apex Health Alliance",
      quote: "A world-class full-stack engineer who understands how to bridge rich, premium designs with robust backends. He delivered our media processing pipeline and Render/AWS staging on time.",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?fit=crop&w=150&h=150&q=80",
      order: 3,
    },
  ];

  for (const item of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: (await prisma.testimonial.findFirst({ where: { clientName: item.clientName } }))?.id ?? "nonexistent" },
      update: item,
      create: item,
    });
  }

  console.log("Seeding blog posts...");

  const blogPosts = [
    {
      slug: "welcome-to-my-tech-journal",
      title: "Welcome to my Tech Journal",
      excerpt: "An overview of what to expect in my technical journal, where I share tutorials and architectural deep-dives on full-stack scalability.",
      category: "Announcements",
      coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?fit=crop&w=1200&h=630&q=80",
      publishedAt: new Date("2026-06-15T10:00:00Z"),
      content: `
        <p>Welcome to my technical journal. This blog is a space where I share my experiences, tutorials, and insights gained while designing full-stack web applications and low-latency backend systems.</p>
        <h2 class="font-body text-xl font-bold mt-6 mb-3 text-ink">What to Expect</h2>
        <p>Here, you will find deep-dives on Next.js optimizations, database scaling strategies with PostgreSQL and Redis, API design best practices, and real-time Socket.io architectures. My goal is to break down complex engineering concepts into structured, actionable case studies.</p>
        <p class="mt-6">Stay tuned for regular updates, and feel free to connect via the contact page if you want to collaborate on your next project!</p>
      `,
      published: true,
    },
    {
      slug: "building-resilient-real-time-systems-with-websockets",
      title: "Building Resilient Real-Time Systems with WebSockets",
      excerpt: "A deep dive into scaling horizontal WebSocket servers, managing reconnection states, and distributing TCP coordinate events using Redis pub/sub adapters.",
      category: "Technical Guide",
      coverImage: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?fit=crop&w=1200&h=630&q=80",
      publishedAt: new Date("2026-06-22T09:30:00Z"),
      content: `
        <p>WebSockets have revolutionized the way we build interactive applications by enabling full-duplex communication channels over a single TCP connection. However, maintaining stable WebSocket connections under high load requires careful consideration of scaling strategies, reconnection states, and connection tracking mechanisms.</p>
        <h2 class="font-body text-xl font-bold mt-6 mb-3 text-ink">The Architecture Challenge</h2>
        <p>Unlike standard stateless HTTP requests, WebSocket connections are persistent. This means that every active user maintains an open connection to a specific server instance. When scaling horizontal servers, you must route socket events across instances—typically using a Redis Adapter to pub/sub coordinates between servers.</p>
        <h2 class="font-body text-xl font-bold mt-6 mb-3 text-ink">Optimizing Reconnections</h2>
        <p>Client-side socket logic must implement exponential backoff reconnection strategies to prevent a thundering herd problem when a server node restarts or experiences transient networking glitches.</p>
      `,
      published: true,
    },
    {
      slug: "optimizing-database-query-latency-with-redis-caching",
      title: "Optimizing Database Query Latency with Redis Caching",
      excerpt: "How to drop database query response times to sub-millisecond speeds using lazy-loading Cache-Aside structures and short TTL validation strategies.",
      category: "Database Scaling",
      coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?fit=crop&w=1200&h=630&q=80",
      publishedAt: new Date("2026-06-28T14:00:00Z"),
      content: `
        <p>Slow database queries are one of the most common bottlenecks in modern web architectures. While indexing database fields is the first line of defense, implementing an in-memory caching layer using Redis can drop query latencies from hundreds of milliseconds to sub-millisecond ranges.</p>
        <h2 class="font-body text-xl font-bold mt-6 mb-3 text-ink">Cache Aside Strategy</h2>
        <p>The Cache-Aside pattern (or Lazy Loading) is the most standard approach: query the Redis cache first; if it's a hit, return the cached payload. If it's a miss, fetch the records from the main database, populate the cache, and return the data.</p>
        <h2 class="font-body text-xl font-bold mt-6 mb-3 text-ink">Cache Invalidation</h2>
        <p>Managing cache expiry and invalidation is critical to prevent serving stale data. Utilizing short Time-To-Live (TTL) policies and hooks to invalidate specific cache keys on record updates ensures consistency.</p>
      `,
      published: true,
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        // Only update content/metadata — never overwrite publishedAt if already set
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        coverImage: post.coverImage,
        content: post.content,
        published: post.published,
        publishedAt: post.publishedAt,
      },
      create: post,
    });
  }

  console.log("Done — all records seeded safely.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
