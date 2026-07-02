"use client";

import { useEffect, useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LightboxManager() {
  const [activeSrc, setActiveSrc] = useState<string | null>(null);
  const [activeAlt, setActiveAlt] = useState<string>("");
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Find all images within the blog article — covers the hero/cover
    // photo as well as any images embedded in the compiled body content.
    const articleBody = document.querySelector("article");
    if (!articleBody) return;

    const images = articleBody.querySelectorAll("img");

    const handleImageClick = (e: Event) => {
      const target = e.currentTarget as HTMLImageElement;
      // Prevent default click behaviors if wrapped in links
      e.preventDefault();
      setActiveSrc(target.src);
      setActiveAlt(target.alt || "Article image");
    };

    images.forEach((img) => {
      img.style.cursor = "zoom-in";
      img.classList.add("hover:opacity-95", "transition-opacity", "duration-200");
      
      // Wrap image in a container to add a subtle hover zoom indicator if needed, 
      // or simply attach the click listener directly
      img.addEventListener("click", handleImageClick);
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener("click", handleImageClick);
      });
    };
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setActiveSrc(null);
      setClosing(false);
    }, 300); // Match Tailwind fade-out transition duration
  };

  // Close on Escape key press
  useEffect(() => {
    if (!activeSrc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSrc]);

  if (!activeSrc) return null;

  return (
    <div
      onClick={handleClose}
      className={cn(
        "fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 bg-base/80 backdrop-blur-xl cursor-zoom-out select-none transition-all duration-300 ease-out",
        closing ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"
      )}
    >
      {/* Top Action Header */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none">
        <span className="text-[10px] font-bold text-muted uppercase tracking-widest font-body flex items-center gap-1.5 bg-surface/50 border border-border/40 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
          <ZoomIn className="w-3 h-3 text-vermillion" /> Zoom view
        </span>
        <button
          onClick={handleClose}
          className="pointer-events-auto p-2.5 rounded-full border border-border bg-surface/50 hover:bg-surface text-muted hover:text-ink active:scale-90 transition-all backdrop-blur-sm"
          aria-label="Close zoom view"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Large Image Frame */}
      <div className="w-full max-w-[1100px] max-h-[80vh] flex flex-col items-center justify-center pointer-events-none mt-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={activeSrc}
          alt={activeAlt}
          className="max-w-full max-h-full object-contain rounded-2xl border border-border/40 shadow-2xl animate-scale-in"
        />
        {activeAlt && (
          <p className="text-[11px] font-bold text-muted uppercase tracking-wider mt-4 font-body text-center bg-surface/30 px-4 py-1 rounded-full border border-border/10 max-w-[400px] truncate">
            {activeAlt}
          </p>
        )}
      </div>
    </div>
  );
}
