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
      return NextResponse.json({ error: "Missing project ID" }, { status: 400 });
    }

    const body = await request.json();
    const { 
      title, 
      slug, 
      description, 
      body: projectBody, 
      techStack, 
      liveUrl, 
      githubUrl, 
      imageUrl, 
      featured, 
      order 
    } = body;

    const updatedProject = await db.project.update({
      where: { id },
      data: {
        title,
        slug: slug ? slug.toLowerCase().trim() : undefined,
        description,
        body: projectBody !== undefined ? (projectBody || null) : undefined,
        techStack: techStack !== undefined ? techStack : undefined,
        liveUrl: liveUrl !== undefined ? (liveUrl || null) : undefined,
        githubUrl: githubUrl !== undefined ? (githubUrl || null) : undefined,
        imageUrl,
        featured: featured !== undefined ? featured : undefined,
        order: typeof order === "number" ? order : undefined,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error: any) {
    console.error("Error in admin PATCH project API:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Project slug must be unique" }, { status: 400 });
    }
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
      return NextResponse.json({ error: "Missing project ID" }, { status: 400 });
    }

    await db.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in admin DELETE project API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
