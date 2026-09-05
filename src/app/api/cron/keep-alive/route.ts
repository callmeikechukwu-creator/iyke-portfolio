import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * 24/7 Supabase Database Keep-Alive Route
 * ============================================================
 * Triggered periodically via GitHub Actions or Vercel Cron
 * to execute an active database query, preventing Supabase
 * free-tier instances from entering paused dormancy.
 * ============================================================
 */
export async function GET(request: Request) {
  const startTime = performance.now();

  try {
    // Optional secret check if CRON_SECRET is configured
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const authHeader = request.headers.get("Authorization");
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized cron trigger" }, { status: 401 });
      }
    }

    // Execute active query across PostgreSQL
    const [projectCount, postCount] = await Promise.all([
      db.project.count(),
      db.blogPost.count(),
    ]);

    const durationMs = Math.round(performance.now() - startTime);

    return NextResponse.json({
      success: true,
      status: "alive",
      engine: "Supabase PostgreSQL",
      metrics: {
        projects: projectCount,
        blogPosts: postCount,
        latencyMs: durationMs,
      },
      timestamp: new Date().toISOString(),
      message: "Database heartbeat successfully registered. Inactivity paused state prevented.",
    });
  } catch (error: any) {
    console.error("Keep-alive ping failed:", error);
    return NextResponse.json(
      {
        success: false,
        status: "error",
        error: error.message || "Database keep-alive ping failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
