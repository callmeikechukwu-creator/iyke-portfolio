import type { Metadata } from "next";
import ContactForm from "@/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Ikechukwu Alaeto for technical consultations, contract hiring, or project collaborations. Drop a message using the secure form.",
};

export default function ContactPage() {
  return <ContactForm />;
}
