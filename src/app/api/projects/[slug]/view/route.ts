import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "Missing project slug" }, { status: 400 });
    }

    const key = `views:${slug}`;
    const newViews = await redis.incr(key);

    return NextResponse.json({ success: true, views: newViews });
  } catch (error) {
    console.error("Error in project views counter API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "Missing project slug" }, { status: 400 });
    }

    const key = `views:${slug}`;
    const views = (await redis.get<number>(key)) || 0;

    return NextResponse.json({ views });
  } catch (error) {
    console.error("Error fetching project views:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
