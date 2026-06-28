import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionAdminId } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminId = await getSessionAdminId();
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing message ID" }, { status: 400 });
    }

    const body = await request.json();
    const { read } = body;

    if (typeof read !== "boolean") {
      return NextResponse.json({ error: "Read status must be a boolean" }, { status: 400 });
    }

    const updatedMessage = await db.contactMessage.update({
      where: { id },
      data: { read },
    });

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error("Error in admin PATCH message API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminId = await getSessionAdminId();
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing message ID" }, { status: 400 });
    }

    await db.contactMessage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in admin DELETE message API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
