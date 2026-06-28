import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionAdminId } from "@/lib/auth";

export async function GET() {
  try {
    const adminId = await getSessionAdminId();
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await db.project.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error in admin GET projects API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const adminId = await getSessionAdminId();
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    if (!title || !slug || !description || !imageUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newProject = await db.project.create({
      data: {
        title,
        slug: slug.toLowerCase().trim(),
        description,
        body: projectBody || null,
        techStack: techStack || [],
        liveUrl: liveUrl || null,
        githubUrl: githubUrl || null,
        imageUrl,
        featured: featured || false,
        order: typeof order === "number" ? order : 0,
      },
    });

    return NextResponse.json(newProject);
  } catch (error: any) {
    console.error("Error in admin POST project API:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Project slug must be unique" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
