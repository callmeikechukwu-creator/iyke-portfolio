"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Share2, Link, Twitter, Linkedin, Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

interface StickyBlogHeaderProps {
  title: string;
}

export default function StickyBlogHeader({ title }: StickyBlogHeaderProps) {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Monitor scroll progression of the prose content container
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const article = document.querySelector(".prose");

      if (article) {
        const rect = article.getBoundingClientRect();
        const articleTop = rect.top + window.scrollY;
        const articleHeight = rect.height;

        // Progress tracks from top of article entering screen to bottom of article exiting screen
        const viewBottom = window.scrollY + window.innerHeight;
        
        if (viewBottom < articleTop) {
          setScrollProgress(0);
        } else if (window.scrollY > (articleTop + articleHeight - 120)) {
          setScrollProgress(100);
        } else {
          const totalDistance = articleHeight;
          const currentDistance = viewBottom - articleTop;
          setScrollProgress(Math.min(100, Math.max(0, Math.round((currentDistance / totalDistance) * 100))));
        }
      }

      // Show header once user scrolls past the main article title area
      if (scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsDropdownOpen(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleShareTwitter = () => {
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      window.location.href
    )}&text=${encodeURIComponent(`Read "${title}" by Ikechukwu Alaeto`)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
    setIsDropdownOpen(false);
  };

  const handleShareLinkedin = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      window.location.href
    )}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
    setIsDropdownOpen(false);
  };

  // SVG Circular progress params
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={cn(
        "fixed top-[84px] left-0 right-0 z-[450] flex justify-center px-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] select-none pointer-events-none",
        visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-6 scale-95 pointer-events-none"
      )}
    >
      <div className="w-full max-w-[580px] h-[52px] pointer-events-auto relative" ref={dropdownRef}>
        {/* Main Pill Wrapper */}
        <div className="w-full h-full bg-surface/75 backdrop-blur-md border border-border/80 rounded-full px-4 flex items-center justify-between shadow-lg">
          {/* Left: Back Link & Title */}
          <div className="flex items-center gap-3 overflow-hidden pr-2">
            <a
              href="/blog"
              className="flex items-center justify-center w-8 h-8 rounded-full border border-border bg-base/5 hover:bg-base/15 text-muted hover:text-ink active:scale-90 transition-all shrink-0"
              title="Back to Journal"
            >
              <ArrowLeft className="w-4 h-4" />
            </a>
            <span className="text-xs font-black text-ink uppercase tracking-tight truncate max-w-[280px] sm:max-w-[340px] font-logo">
              {title}
            </span>
          </div>

          {/* Right: Progress Ring & Dropdown share trigger */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Circular Scroll Progress Ring */}
            <div className="relative w-9 h-9 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r={radius}
                  className="stroke-border/40"
                  strokeWidth="2.5"
                  fill="transparent"
                />
                <circle
                  cx="18"
                  cy="18"
                  r={radius}
                  className="stroke-vermillion transition-all duration-150"
                  strokeWidth="2.5"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[8px] font-bold text-ink font-body">
                {scrollProgress}%
              </span>
            </div>

            {/* Share Trigger */}
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border border-border bg-base/5 hover:bg-base/15 text-ink active:scale-90 transition-all",
                isDropdownOpen ? "border-vermillion text-vermillion bg-vermillion/5" : ""
              )}
              title="Share options"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Shifting Dropdown options */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 12 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ type: "spring", damping: 15, stiffness: 220 }}
              className="absolute right-0 top-full w-48 bg-surface/90 border border-border backdrop-blur-md shadow-xl rounded-2xl p-2 flex flex-col gap-1 z-50 origin-top-right"
            >
              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-body font-bold text-ink hover:bg-base/15 transition-all"
              >
                <span className="flex items-center gap-2">
                  <Link className="w-3.5 h-3.5 text-muted" />
                  {copied ? "Copied!" : "Copy Link"}
                </span>
                {copied && <Check className="w-3.5 h-3.5 text-green-500" />}
              </button>

              {/* Twitter */}
              <button
                onClick={handleShareTwitter}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-body font-bold text-ink hover:bg-base/15 transition-all"
              >
                <Twitter className="w-3.5 h-3.5 text-[#1DA1F2]" />
                Share to X
              </button>

              {/* LinkedIn */}
              <button
                onClick={handleShareLinkedin}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-body font-bold text-ink hover:bg-base/15 transition-all"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                Share to LinkedIn
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
