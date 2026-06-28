import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";

export async function POST(request: Request) {
  try {
    // 1. Get Client IP for Rate Limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
    
    const rateLimitKey = `ratelimit:${ip}`;
    
    // 2. Perform Redis Rate Limiting Check (Max 3 submissions per hour)
    const currentRequests = await redis.get<number>(rateLimitKey);
    
    if (currentRequests && currentRequests >= 3) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in an hour." },
        { status: 429 }
      );
    }
    
    // Increment the request count
    const updatedCount = await redis.incr(rateLimitKey);
    if (updatedCount === 1) {
      // Set 1-hour expiration (3600 seconds) on the first request
      await redis.expire(rateLimitKey, 3600);
    }

    // 3. Parse and Validate Body
    const body = await request.json();
    const { name, email, message, honeypot } = body;

    // Honeypot field spam protection (silent reject)
    if (honeypot) {
      return NextResponse.json({ success: true, note: "Filtered" });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields (name, email, message)" },
        { status: 400 }
      );
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // 4. Save to Database
    const newMessage = await db.contactMessage.create({
      data: {
        name: name.substring(0, 100),
        email: email.toLowerCase(),
        message: message.substring(0, 5000),
      },
    });

    return NextResponse.json({ success: true, messageId: newMessage.id });
  } catch (error) {
    console.error("Error in contact form submission API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
