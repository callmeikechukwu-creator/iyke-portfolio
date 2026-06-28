import type { Metadata } from "next";
import Experience from "@/components/sections/Experience";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Explore the professional timeline and software development career of Ikechukwu Alaeto. Architecting platforms at Iyke Visuals Studio and teaching coding at GOATC.",
};

export default function ExperiencePage() {
  return <Experience />;
}
