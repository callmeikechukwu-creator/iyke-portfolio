import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { blogPostId, authorName, content } = body;

    if (!blogPostId || !authorName || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Sanitize values
    const cleanName = authorName.replace(/<[^>]*>/g, "").trim().substring(0, 50);
    const cleanContent = content.replace(/<[^>]*>/g, "").trim().substring(0, 500);

    if (!cleanName || !cleanContent) {
      return NextResponse.json({ error: "Invalid comment content" }, { status: 400 });
    }

    const comment = await db.comment.create({
      data: {
        blogPostId,
        authorName: cleanName,
        content: cleanContent,
        approved: false, // Moderated by default
      },
    });

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    console.error("Failed to post comment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
