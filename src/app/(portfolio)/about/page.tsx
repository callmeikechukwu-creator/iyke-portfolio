import type { Metadata } from "next";
import About from "@/components/sections/About";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Ikechukwu Alaeto, Full Stack Developer and Creative Technologist based in Ibadan, Nigeria. Discover my coding philosophy, technical stack, and track record.",
};

export default function AboutPage() {
  return <About />;
}
