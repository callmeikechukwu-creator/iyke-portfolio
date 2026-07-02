"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@prisma/client";
import Image from "next/image";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) return null;

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const active = testimonials[activeIndex];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      
      {/* Testimonials Slider Card */}
      <div className="lg:col-span-7 flex flex-col gap-6 w-full">
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="relative rounded-3xl border border-border bg-base/5 p-6 md:p-10 md:p-12 overflow-hidden flex flex-col gap-6 md:gap-8 min-h-[320px] justify-between transition-all duration-500 cursor-grab active:cursor-grabbing select-none"
        >
          {/* Testimonial Quote text */}
          <div className="flex flex-col gap-4 relative z-10">
            {/* Quote Icon in flow to prevent overlap */}
            <Quote className="w-10 h-10 text-vermillion/40 rotate-180 select-none shrink-0" />
            <p className="font-body text-base md:text-lg lg:text-xl text-ink/85 leading-relaxed italic font-medium">
              &ldquo;{active.quote}&rdquo;
            </p>
          </div>

          {/* Client Metadata and Profile Picture */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border/40 pt-6 mt-2">
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
            <div className="flex items-center gap-2 self-end sm:self-auto">
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

      {/* 3D Testimonials Illustration */}
      <div className="lg:col-span-5 flex justify-center w-full">
        <div className="relative w-full aspect-square max-w-[400px] border border-border bg-base/10 rounded-3xl p-6 overflow-hidden flex items-center justify-center shadow-inner hover:scale-[1.01] transition-transform duration-500">
          <div className="absolute inset-0 bg-gradient-to-tr from-vermillion/[0.02] to-transparent pointer-events-none" />
          <Image
            src="/brand/3d-testimonials.png"
            alt="Client feedback network illustration"
            width={350}
            height={350}
            className="object-contain hover:scale-102 transition-transform duration-500"
          />
        </div>
      </div>

    </div>
  );
}
