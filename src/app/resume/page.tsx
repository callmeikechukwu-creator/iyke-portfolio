import ResumeClient from "./ResumeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Curriculum Vitae of Ikechukwu Alaeto — Full Stack Web Developer based in Ibadan, Nigeria. Skills, experience, and professional timeline.",
};

export default function ResumePage() {
  return <ResumeClient />;
}
