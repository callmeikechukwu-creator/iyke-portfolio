import type { Metadata } from "next";
import Skills from "@/components/sections/Skills";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Explore the technical skills and technology stack used by Ikechukwu Alaeto. Frontend frameworks, backend design, dynamic databases, and DevOps methodologies.",
};

export default function SkillsPage() {
  return <Skills />;
}
