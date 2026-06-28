import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionAdminId } from "@/lib/auth";

export async function GET() {
  try {
    const adminId = await getSessionAdminId();
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error in admin GET messages API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
