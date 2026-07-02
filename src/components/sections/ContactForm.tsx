"use client";

import { useState, useEffect, useRef } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

/**
 * ContactForm Component
 * Renders the portfolio contact form section.
 * Design details:
 *   - Editorial layout with description on left, clean form on right
 *   - Form inputs with clear active outline rings and label transitions
 *   - Uses the corrected contact email: ikechukwualaeto@gmail.com
 *   - Handles submit to /api/contact endpoint with honeypot validation
 */
export default function ContactForm() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    honeypot: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "", honeypot: "" });
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setStatus("error");
      setErrorMsg("Failed to connect to the server. Please check your internet connection.");
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal left column elements
      if (leftColRef.current) {
        gsap.fromTo(
          leftColRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: leftColRef.current,
              start: "top 85%",
            },
          }
        );
      }

      // Reveal form container
      if (rightColRef.current) {
        gsap.fromTo(
          rightColRef.current,
          { opacity: 0, scale: 0.98, y: 40 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: rightColRef.current,
              start: "top 85%",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="contact-section"
      aria-label="Contact information and form"
      className="relative w-full bg-[var(--color-base)] border-b border-[var(--color-border)] py-20 md:py-32"
    >
      <div className="section-wrapper">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* ── Left Column: Description & Email ── */}
          <div ref={leftColRef} className="lg:col-span-5 flex flex-col gap-4">
            <span className="text-label text-[var(--color-vermillion)] uppercase tracking-[var(--tracking-wide)]">
              Get In Touch
            </span>
            <h2
              className="text-display text-[var(--color-ink)]"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.03em" }}
            >
              LET&apos;S BUILD SOMETHING.
            </h2>
            <p className="text-body text-muted text-base md:text-lg leading-relaxed mt-2 max-w-sm">
              Have an exciting project proposal, contract role, or collaboration idea? Drop a message in the form. I typically respond within 24 hours.
            </p>
            
            <div className="flex flex-col gap-4 mt-8 font-body text-sm text-[var(--color-ink)] font-semibold">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-vermillion)]" />
                <span>
                  Email:&nbsp;
                  <a
                    href="mailto:ikechukwualaeto@gmail.com"
                    className="text-[var(--color-vermillion)] hover:text-[var(--color-vermillion-hover)] transition-colors duration-200"
                  >
                    ikechukwualaeto@gmail.com
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-amber)]" />
                <span>Location: Ibadan, Nigeria (GMT+1)</span>
              </div>
            </div>

            {/* 3D Contact Illustration */}
            <div className="relative w-full aspect-[16/10] max-w-[340px] border border-[var(--color-border)] bg-[var(--color-surface)] rounded-3xl p-4 overflow-hidden flex items-center justify-center shadow-inner mt-8 hover:scale-[1.01] transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-vermillion)]/[0.02] to-transparent pointer-events-none" />
              <Image
                src="/brand/3d-contact.png"
                alt="3D Mail envelope illustration"
                width={200}
                height={200}
                className="object-contain hover:translate-y-[-2px] transition-transform duration-500"
              />
            </div>
          </div>

          {/* ── Right Column: Form Card ── */}
          <div ref={rightColRef} className="lg:col-span-7 w-full">
            <div className="p-6 md:p-10 bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] shadow-[var(--shadow-sm)] relative overflow-hidden">
              
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center text-center py-16 gap-6">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-vermillion)]/10 text-[var(--color-vermillion)] flex items-center justify-center animate-scale-in">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-display text-2xl font-bold text-[var(--color-ink)]">
                      MESSAGE SENT
                    </h3>
                    <p
                      className="text-body max-w-sm text-sm md:text-base leading-relaxed"
                      style={{ color: "var(--color-muted)" }}
                    >
                      Thank you for reaching out. I have received your message and will read it shortly.
                    </p>
                  </div>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-2 px-8 py-3 bg-[var(--color-vermillion)] text-[var(--color-base)] hover:bg-[var(--color-vermillion-hover)] transition-colors duration-300 rounded-full font-semibold text-sm cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-body text-sm text-[var(--color-ink)]">
                  
                  {/* Silent bot trap field */}
                  <input
                    type="text"
                    name="honeypot"
                    value={formData.honeypot}
                    onChange={handleChange}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Name Input */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-semibold">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Ikechukwu Alaeto"
                      className="w-full px-4 py-3 bg.base border border-[var(--color-border)] focus:border-[var(--color-vermillion)] focus:ring-1 focus:ring-[var(--color-vermillion)] rounded-xl outline-none transition-all text-sm"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-semibold">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="ikechukwualaeto@gmail.com"
                      className="w-full px-4 py-3 bg.base border border-[var(--color-border)] focus:border-[var(--color-vermillion)] focus:ring-1 focus:ring-[var(--color-vermillion)] rounded-xl outline-none transition-all text-sm"
                    />
                  </div>

                  {/* Message Input */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="font-semibold">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Describe your project requirements, scope, or timeline..."
                      className="w-full px-4 py-3 bg.base border border-[var(--color-border)] focus:border-[var(--color-vermillion)] focus:ring-1 focus:ring-[var(--color-vermillion)] rounded-xl outline-none transition-all text-sm resize-none"
                    />
                  </div>

                  {/* Error Alert */}
                  {status === "error" && (
                    <div className="flex items-start gap-2.5 p-4 bg-[var(--color-vermillion)]/10 text-[var(--color-vermillion)] border border-[var(--color-vermillion)]/20 rounded-xl">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span className="text-xs font-semibold leading-relaxed">{errorMsg}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className={cn(
                      "w-full md:w-auto self-start px-8 py-4 rounded-full font-semibold text-sm tracking-wide",
                      "bg-[var(--color-vermillion)] text-[var(--color-base)] hover:bg-[var(--color-vermillion-hover)]",
                      "transition-all duration-300 flex items-center justify-center gap-2 shadow-[var(--shadow-sm)] cursor-pointer",
                      status === "loading" && "opacity-75 cursor-not-allowed"
                    )}
                  >
                    {status === "loading" ? "Sending Message..." : "Send Message"}
                    <Send className="w-4 h-4" />
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
