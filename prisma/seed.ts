import { db as prisma } from "../src/lib/db";
import bcrypt from "bcryptjs";

/**
 * Safe idempotent PostgreSQL seed — uses upsert on unique keys.
 * Running this multiple times will NEVER wipe existing data.
 */
async function main() {
  console.log("🌱 Starting database seed for Supabase PostgreSQL...");

  // 1. Seed Projects
  console.log("Seeding Projects...");
  const projects = [
    {
      slug: "naturalist",
      title: "Naturalist E-commerce Platform",
      description: "High-performance organic plant e-commerce engine with automated order tracking, dynamic OG share previews, and sub-second checkout speeds.",
      body: "Naturalist, a premium organic plant retailer, needed a high-performance digital commerce platform matching their high-end aesthetic. Built with Next.js 16, PostgreSQL, and Edge-rendered share graphics, the system reduced transaction latencies to under 1.2 seconds and automated 100% of dispatch fulfillment workflows.",
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma", "Stripe", "Resend"],
      imageUrl: "/projects/naturalist-mockup.png",
      liveUrl: "https://naturalist-shop.vercel.app",
      githubUrl: "https://github.com/callmeikechukwu-creator/naturalist-ecommerce",
      featured: true,
      order: 1,
    },
    {
      slug: "samc-2026",
      title: "SAMC 2026 Registration Portal",
      description: "Automated conference ticketing engine capable of handling high-concurrency ticket sales and delivering personalized PDF passes instantly.",
      body: "The annual SAMC conference needed an automated registration platform capable of processing high-volume traffic spikes without duplicate booking collisions. Implemented PostgreSQL row-level locks, asynchronous Redis queuing, and a serverless Puppeteer ticket rendering pipeline that delivers QR check-in badges in under 3 seconds.",
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma", "Redis", "Puppeteer"],
      imageUrl: "/projects/samc-mockup.png",
      liveUrl: "https://samc2026.org",
      githubUrl: "https://github.com/callmeikechukwu-creator/samc-registration-portal",
      featured: true,
      order: 2,
    },
    {
      slug: "tsa-youth-week-26",
      title: "TSA Youth Week 26 Portal",
      description: "Real-time event analytics platform synchronizing multi-device attendee check-ins with sub-150ms WebSocket latency.",
      body: "Designed for the annual TSA Youth Week convention, this platform features an atomic WebSocket relay layer that coordinates thousands of attendee credentials across simultaneous venue doors. Features real-time check-in dashboards, rate-limited organizer authentication, and automated PDF data export.",
      techStack: ["Next.js", "TypeScript", "PostgreSQL", "WebSockets", "Redis", "Tailwind CSS"],
      imageUrl: "/projects/tsa-mockup.png",
      liveUrl: "https://tsayouthweek.org",
      githubUrl: "https://github.com/callmeikechukwu-creator/tsa-youth-week",
      featured: true,
      order: 3,
    },
    {
      slug: "goatc-cbt",
      title: "GOATC CBT Examination System",
      description: "Cheat-resistant computer-based testing portal with real-time WebSocket proctor telemetry and persistent Redis progression caching.",
      body: "An institutional examination testing portal designed for academic stability. Features lazy-loaded question pools, client-side disconnect tolerance with periodic Redis state checkpoints, and a live supervisor dashboard streaming candidate timing in sub-seconds.",
      techStack: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "WebSockets", "Docker"],
      imageUrl: "/projects/goatc-mockup.png",
      liveUrl: "https://goatc-cbt.edu.ng",
      githubUrl: "https://github.com/callmeikechukwu-creator/goatc-cbt",
      featured: true,
      order: 4,
    },
  ];

  for (const proj of projects) {
    await prisma.project.upsert({
      where: { slug: proj.slug },
      update: proj,
      create: proj,
    });
  }

  // 2. Seed Testimonials
  console.log("Seeding Testimonials...");
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
    const existing = await prisma.testimonial.findFirst({ where: { clientName: item.clientName } });
    if (existing) {
      await prisma.testimonial.update({
        where: { id: existing.id },
        data: item,
      });
    } else {
      await prisma.testimonial.create({
        data: item,
      });
    }
  }

  // 3. Seed Blog Posts
  console.log("Seeding Blog Posts...");
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

  // 4. Seed Default Admin
  console.log("Seeding Default Admin Account...");
  const adminEmail = (process.env.ADMIN_INITIAL_EMAIL || "admin@iykevisuals.com").toLowerCase().trim();
  const rawPassword = process.env.ADMIN_INITIAL_PASSWORD || "AdminPassword2026!";
  const passwordHash = await bcrypt.hash(rawPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
    },
  });

  console.log("🎉 SUCCESS! Database fully seeded in Supabase PostgreSQL.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
