import type { Metadata } from "next";
import { Suspense } from "react";
import Projects from "@/components/sections/Projects";
import { ProjectsPageSkeleton } from "@/components/ui/Skeletons";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore case studies of software engineering projects built by Ikechukwu Alaeto. Full stack web architectures, custom database applications, and visual tools.",
};

async function ProjectsContentSection() {
  try {
    const projects = await db.project.findMany({
      orderBy: { order: "asc" },
    });
    return <Projects projects={projects} />;
  } catch (error) {
    console.error("Failed to fetch projects for index page:", error);
    return <Projects projects={[]} />;
  }
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectsPageSkeleton />}>
      <ProjectsContentSection />
    </Suspense>
  );
}
