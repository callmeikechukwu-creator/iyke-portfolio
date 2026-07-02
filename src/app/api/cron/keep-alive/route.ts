import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Perform a lightweight query to verify connection and keep DB hot
    await db.project.findFirst({ select: { id: true } });
    return NextResponse.json({ success: true, message: "Connection kept alive." });
  } catch (error) {
    console.error("Keep-alive ping failed:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
