"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Micro Tooltip (desktop only)
───────────────────────────────────────────── */
function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <div
        className={cn(
          "pointer-events-none absolute left-full ml-2.5 whitespace-nowrap z-10",
          "px-1.5 py-0.5 rounded-md",
          "text-[9px] font-semibold uppercase tracking-wider font-body leading-none",
          "bg-ink/90 text-base/80",
          "transition-all duration-150 ease-out",
          show ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1 pointer-events-none"
        )}
      >
        {label}
        <span className="absolute right-full top-1/2 -translate-y-1/2 border-[3px] border-transparent border-r-ink/90" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Icons
───────────────────────────────────────────── */
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function DrunkCheck({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-drunk-check", size === "sm" ? "w-4 h-4" : "w-5 h-5")}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Shared logic hook
───────────────────────────────────────────── */
function useShareActions(title: string) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    if (copied) return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch { /* silent */ }
  };

  const handleShareX = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`"${title}" by Ikechukwu Alaeto`)}`,
      "_blank", "noopener,noreferrer"
    );
  };

  const handleShareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
      "_blank", "noopener,noreferrer"
    );
  };

  return { copied, handleCopyLink, handleShareX, handleShareLinkedIn };
}

/* ─────────────────────────────────────────────
   Shared vertical pill — used by both rails
───────────────────────────────────────────── */
function SharePill({
  title,
  withTooltips = false,
}: {
  title: string;
  withTooltips?: boolean;
}) {
  const { copied, handleCopyLink, handleShareX, handleShareLinkedIn } = useShareActions(title);

  const xBtn = (
    <button
      onClick={handleShareX}
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-xl",
        "border border-white/10 bg-white/[0.03] text-muted",
        "hover:bg-white hover:border-white/80 hover:text-ink",
        "active:scale-90 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
      )}
    >
      <XIcon className="w-5 h-5" />
    </button>
  );

  const liBtn = (
    <button
      onClick={handleShareLinkedIn}
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-xl",
        "border border-white/10 bg-white/[0.03] text-muted",
        "hover:bg-[#0A66C2] hover:border-[#0A66C2]/80 hover:text-white",
        "active:scale-90 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
      )}
    >
      <LinkedInIcon className="w-5 h-5" />
    </button>
  );

  const copyBtn = (
    <button
      onClick={handleCopyLink}
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-xl",
        "border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-90",
        copied
          ? "border-green-500/40 bg-green-500/10 text-green-400"
          : "border-white/10 bg-white/[0.03] text-muted hover:border-vermillion/60 hover:bg-vermillion/10 hover:text-vermillion",
      )}
    >
      {copied ? <DrunkCheck /> : <LinkIcon className="w-5 h-5" />}
    </button>
  );

  return (
    <div className={cn(
      "flex flex-col items-center gap-4 px-3 py-5 rounded-2xl",
      "bg-white/[0.05] backdrop-blur-2xl",
      "border border-white/[0.1]",
      "shadow-[0_8px_32px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.07)]",
    )}>
      {withTooltips ? (
        <>
          <Tooltip label="Share on X">{xBtn}</Tooltip>
          <Tooltip label="LinkedIn">{liBtn}</Tooltip>
          <Tooltip label={copied ? "Copied!" : "Copy link"}>{copyBtn}</Tooltip>
        </>
      ) : (
        <>
          {xBtn}
          {liBtn}
          {copyBtn}
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Desktop Left Rail
───────────────────────────────────────────── */
function DesktopRail({ title }: { title: string }) {
  const [footerVisible, setFooterVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    observerRef.current = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observerRef.current.observe(footer);
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "fixed left-6 top-1/2 -translate-y-1/2 z-[350]",
        "hidden lg:flex flex-col items-center",
        "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        footerVisible ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"
      )}
      aria-label="Share this article"
    >
      <SharePill title={title} withTooltips />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Mobile Rail — same pill, bottom-right corner
───────────────────────────────────────────── */
function MobileRail({ title }: { title: string }) {
  const [footerVisible, setFooterVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    observerRef.current = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observerRef.current.observe(footer);
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-6 right-5 z-[350]",
        "flex lg:hidden flex-col items-center",
        "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        footerVisible ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"
      )}
      aria-label="Share this article"
    >
      <SharePill title={title} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Exported wrapper
───────────────────────────────────────────── */
export default function StickyShareRail({ title }: { title: string }) {
  return (
    <>
      <DesktopRail title={title} />
      <MobileRail title={title} />
    </>
  );
}
