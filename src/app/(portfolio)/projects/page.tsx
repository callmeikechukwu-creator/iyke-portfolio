import type { Metadata } from "next";
import Projects from "@/components/sections/Projects";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore case studies of software engineering projects built by Ikechukwu Alaeto. Full stack web architectures, custom database applications, and visual tools.",
};

async function getProjects() {
  try {
    const projects = await db.project.findMany({
      orderBy: { order: "asc" },
    });
    return projects;
  } catch (error) {
    console.error("Failed to fetch projects for index page:", error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <Projects projects={projects} />;
}
