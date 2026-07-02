"use client";

import { useState } from "react";
import { X, Lightbulb, FileText, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const darkenColor = (hex: string, percent: number): string => {
  let color = hex.startsWith("#") ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color.split("").map((c) => c + c).join("");
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

interface DraftItem {
  type: "idea" | "draft";
  title: string;
  category: string;
  notes: string[];
}

const DRAFTS: DraftItem[] = [
  {
    type: "draft",
    title: "Inside Next.js HMR Engine",
    category: "Technical Guide",
    notes: [
      "Deconstructing Turbopack vs Webpack hot-reload modules.",
      "Analyzing persistent WebSocket sync channels.",
      "Fixing browser chunk loading errors under heavy refresh states."
    ]
  },
  {
    type: "idea",
    title: "Rust-Based CLI Tools",
    category: "Developer Tooling",
    notes: [
      "Building blisteringly fast local build helpers in Rust.",
      "Compiling native binary utilities with memory safety.",
      "Replacing heavy Node.js script tasks with binary commands."
    ]
  },
  {
    type: "draft",
    title: "Advanced Redis Caching",
    category: "Database Scaling",
    notes: [
      "Configuring reactive cache-aside patterns in serverless environments.",
      "Handling cache stampede and concurrency locks.",
      "Designing multi-region Redis sync networks for low latency."
    ]
  }
];

export default function InteractiveFolder({
  color = "#D63A2F",
  size = 1,
  className = "",
}: {
  color?: string;
  size?: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [activeDraft, setActiveDraft] = useState<DraftItem | null>(null);
  const [paperOffsets, setPaperOffsets] = useState<{ x: number; y: number }[]>([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ]);

  const folderBackColor = darkenColor(color, 0.08);
  const paper1 = darkenColor("#ffffff", 0.08);
  const paper2 = darkenColor("#ffffff", 0.04);
  const paper3 = "#ffffff";

  const handleFolderClick = () => {
    setOpen((prev) => !prev);
    if (open) {
      setPaperOffsets([
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 }
      ]);
      setActiveDraft(null);
    }
  };

  const handlePaperMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (!open) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) * 0.15;
    const offsetY = (e.clientY - centerY) * 0.15;
    setPaperOffsets((prev) => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: offsetX, y: offsetY };
      return newOffsets;
    });
  };

  const handlePaperMouseLeave = (index: number) => {
    setPaperOffsets((prev) => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: 0, y: 0 };
      return newOffsets;
    });
  };

  const folderStyle = {
    "--folder-color": color,
    "--folder-back-color": folderBackColor,
    "--paper-1": paper1,
    "--paper-2": paper2,
    "--paper-3": paper3,
  } as React.CSSProperties;

  const scaleStyle = { transform: `scale(${size})` };

  return (
    <div className={cn("relative flex flex-col items-center select-none", className)}>
      {/* Folder Container */}
      <div style={scaleStyle} className="h-[200px] flex items-center justify-center">
        <div
          className={cn("folder", open && "open")}
          style={folderStyle}
          onClick={handleFolderClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleFolderClick();
            }
          }}
          tabIndex={0}
          role="button"
          aria-expanded={open}
          aria-label={open ? "Close folder" : "Open folder"}
        >
          <div className="folder__back">
            {DRAFTS.map((item, i) => (
              <div
                key={i}
                className={cn("paper", `paper-${i + 1}`, "flex flex-col justify-between p-3 border border-border/20 shadow-sm")}
                onMouseMove={(e) => handlePaperMouseMove(e, i)}
                onMouseLeave={() => handlePaperMouseLeave(i)}
                onClick={(e) => {
                  if (open) {
                    e.stopPropagation();
                    setActiveDraft(item);
                  }
                }}
                style={
                  open
                    ? {
                        transform: `translate(${
                          i === 0 ? "-120%" : i === 1 ? "10%" : "-50%"
                        }, -70%) rotate(${
                          i === 0 ? "-15deg" : i === 1 ? "15deg" : "5deg"
                        }) translate(${paperOffsets[i]?.x || 0}px, ${paperOffsets[i]?.y || 0}px) scale(1)`,
                      }
                    : {}
                }
              >
                {/* Paper Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[7px] uppercase font-bold tracking-wider text-muted opacity-80">
                    {item.type}
                  </span>
                  {item.type === "idea" ? (
                    <Lightbulb className="w-2.5 h-2.5 text-vermillion" />
                  ) : (
                    <FileText className="w-2.5 h-2.5 text-ink" />
                  )}
                </div>
                {/* Paper Text */}
                <div className="flex flex-col gap-0.5 mt-2">
                  <p className="text-[8px] font-black text-ink leading-tight font-body uppercase">
                    {item.title}
                  </p>
                  <p className="text-[6px] text-muted font-body font-bold uppercase tracking-wide">
                    {item.category}
                  </p>
                </div>
                {/* Paper Footer indicator */}
                <div className="flex items-center justify-end text-[5px] font-bold text-vermillion font-body mt-2">
                  CLICK TO READ <ArrowRight className="w-1.5 h-1.5 ml-0.5" />
                </div>
              </div>
            ))}
            <div className="folder__front"></div>
            <div className="folder__front right"></div>
          </div>
        </div>
      </div>

      {/* Guide text */}
      <p className="text-[10px] font-bold text-muted uppercase tracking-[var(--tracking-wide)] mt-6 text-center font-body">
        {open ? "Click a draft page to inspect ideas" : "Hover or Click the folder to open drafts"}
      </p>

      {/* Modal / Notepad teaser drawer */}
      {activeDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base/40 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-[420px] bg-surface border border-border p-6 rounded-3xl shadow-xl flex flex-col gap-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setActiveDraft(null)}
              className="absolute top-4 right-4 p-2 rounded-full border border-border hover:bg-base/10 active:scale-95 transition-all text-muted hover:text-ink"
              aria-label="Close notes"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Note Header */}
            <div className="flex flex-col gap-1.5 mt-2">
              <span className="text-[10px] font-bold text-vermillion uppercase tracking-wider font-body">
                {activeDraft.type} / {activeDraft.category}
              </span>
              <h4 className="text-xl font-bold font-body text-ink uppercase leading-snug">
                {activeDraft.title}
              </h4>
            </div>

            {/* Note content */}
            <div className="flex flex-col gap-4 border-t border-border pt-4">
              <span className="text-[9px] font-bold text-muted uppercase tracking-widest font-body">
                Draft Outline:
              </span>
              <ul className="flex flex-col gap-3">
                {activeDraft.notes.map((note, idx) => (
                  <li key={idx} className="flex gap-2 text-xs text-muted leading-relaxed font-body">
                    <span className="text-vermillion font-bold font-body">•</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>

            {/* Note Footer */}
            <p className="text-[10px] italic text-muted font-body mt-2 border-t border-border pt-3">
              This post is currently a draft. Let me know in the Contact page if you want me to write it next!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
