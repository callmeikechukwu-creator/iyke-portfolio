"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@prisma/client";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) return null;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const active = testimonials[activeIndex];

  return (
    <section
      aria-label="Client feedback"
      className="relative w-full bg-[var(--color-surface)] border-b border-[var(--color-border)] py-20 md:py-28"
    >
      <div className="section-wrapper">
        <div className="max-w-[850px] mx-auto flex flex-col gap-8 md:gap-10">
          
          {/* Section Header */}
          <div className="flex flex-col gap-3 text-center items-center">
            <span className="text-label text-vermillion uppercase tracking-[var(--tracking-wide)]">
              TESTIMONIALS
            </span>
            <h2
              className="text-display text-ink"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}
            >
              Trusted by Partners
            </h2>
          </div>

          {/* Testimonial Card Frame */}
          <div className="relative rounded-3xl border border-border bg-base/5 p-6 md:p-10 md:p-12 overflow-hidden flex flex-col gap-6 md:gap-8 min-h-[320px] justify-between transition-all duration-500">
            
            {/* Testimonial Quote text */}
            <div className="flex flex-col gap-4 relative z-10">
              {/* Quote Icon in flow to prevent overlap */}
              <Quote className="w-10 h-10 text-vermillion/40 rotate-180 select-none shrink-0" />
              <p className="font-body text-base md:text-lg lg:text-xl text-ink/85 leading-relaxed italic font-medium">
                &ldquo;{active.quote}&rdquo;
              </p>
            </div>

            {/* Client Metadata and Profile Picture */}
            <div className="flex items-center justify-between gap-6 border-t border-border/40 pt-6 mt-2">
              <div className="flex items-center gap-4">
                {active.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={active.avatarUrl}
                    alt={active.clientName}
                    className="w-12 h-12 rounded-full object-cover border border-border-strong shrink-0 grayscale hover:grayscale-0 transition-all duration-300"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-vermillion/10 text-vermillion flex items-center justify-center font-bold text-base shrink-0 uppercase">
                    {active.clientName.charAt(0)}
                  </div>
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="font-body text-sm font-black text-ink">
                    {active.clientName}
                  </span>
                  <span className="font-body text-xs text-muted font-bold">
                    {active.role} at {active.company}
                  </span>
                </div>
              </div>

              {/* Slider Navigation Badges */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="w-9 h-9 rounded-full border border-border hover:border-border-strong flex items-center justify-center text-ink hover:bg-base/50 active:scale-95 transition-all duration-200 cursor-pointer"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-9 h-9 rounded-full border border-border hover:border-border-strong flex items-center justify-center text-ink hover:bg-base/50 active:scale-95 transition-all duration-200 cursor-pointer"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-2">
              {testimonials.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setActiveIndex(dotIdx)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                    activeIndex === dotIdx
                      ? "w-6 bg-vermillion"
                      : "w-1.5 bg-border-strong hover:bg-vermillion/40"
                  )}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
