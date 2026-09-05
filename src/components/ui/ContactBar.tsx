"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, CalendarDays, ArrowUpRight, X } from "lucide-react";
import { FaWhatsapp, FaTelegram } from "react-icons/fa";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────
   Circular Radial Contact Widget
   ─────────────────────────────────────────────────────────────
   Features:
     - Fixed circular button in the bottom-right corner.
     - Rotating SVG text circling the button: "LET'S TALK • HIRE ME • SAY HELLO • LET'S BUILD •"
     - Central arrow (rotated 45 degrees).
     - When clicked/toggled, 4 contact segments spring out in a radial quadrant arc:
       * WhatsApp (180°)
       * Telegram (210°)
       * Email (240°)
       * Book a Call (270°)
     - Click outside or Escape key closes the speed dial menu.
───────────────────────────────────────────────────────────── */

const CONTACT_ITEMS = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    sublabel: "Chat now",
    href: "https://wa.me/2349012345678", // Update with your actual number
    Icon: FaWhatsapp,
    iconColor: "#25D366",
    bgHover: "hover:bg-[#25D366]/10",
    borderHover: "hover:border-[#25D366]/40",
    // Radial coordinates (at d = 100px)
    desktop: { x: -108, y: 0 },
    mobile: { x: -84, y: 0 },
  },
  {
    id: "telegram",
    label: "Telegram",
    sublabel: "Message me",
    href: "https://t.me/iykevisuals", // Update with your handle
    Icon: FaTelegram,
    iconColor: "#229ED9",
    bgHover: "hover:bg-[#229ED9]/10",
    borderHover: "hover:border-[#229ED9]/40",
    desktop: { x: -94, y: -54 },
    mobile: { x: -73, y: -42 },
  },
  {
    id: "email",
    label: "Email",
    sublabel: "Send a message",
    href: "mailto:hello@iykevisuals.com", // Update with your email
    Icon: Mail,
    iconColor: "var(--color-vermillion)",
    bgHover: "hover:bg-[var(--color-vermillion)]/10",
    borderHover: "hover:border-[var(--color-vermillion)]/40",
    desktop: { x: -54, y: -94 },
    mobile: { x: -42, y: -73 },
  },
  {
    id: "calendar",
    label: "Book a Call",
    sublabel: "Schedule 30 min",
    href: "https://cal.com/iykevisuals", // Update with your link
    Icon: CalendarDays,
    iconColor: "var(--color-amber)",
    bgHover: "hover:bg-[var(--color-amber)]/10",
    borderHover: "hover:border-[var(--color-amber)]/40",
    desktop: { x: 0, y: -108 },
    mobile: { x: 0, y: -84 },
  },
] as const;

export default function ContactBar() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if screen is mobile for radial distance adjustments
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* ── Listen for custom event from Navbar "Let's talk" ── */
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-contact-bar", handler);
    return () => window.removeEventListener("open-contact-bar", handler);
  }, []);

  /* ── Close menu on Escape key press ── */
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  /* ── Click outside to close ── */
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const toggleOpen = useCallback(() => setOpen((prev) => !prev), []);

  return (
    <>
      {/* CSS Rotation helper for the spinning text path */}
      <style>{`
        @keyframes spin-clockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-clockwise 12s linear infinite;
          transform-origin: center;
        }
      `}</style>

      {/* Backdrop overlay when open */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[calc(var(--z-modal)-2)] bg-[var(--color-ink)]/15 backdrop-blur-[2.5px] transition-all"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Main floating container */}
      <div
        ref={containerRef}
        className="fixed bottom-6 right-6 z-[var(--z-modal)] select-none"
      >
        {/* Radial items */}
        <AnimatePresence>
          {open &&
            CONTACT_ITEMS.map((item, index) => {
              const coords = isMobile ? item.mobile : item.desktop;
              return (
                <RadialItem
                  key={item.id}
                  item={item}
                  coords={coords}
                  index={index}
                  onClose={() => setOpen(false)}
                />
              );
            })}
        </AnimatePresence>

        {/* Central Toggle Button Wrapper */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
          
          {/* Rotating text overlay using crisp HTML spans rotated about the center */}
          <div 
            className="absolute inset-0 pointer-events-none animate-spin-slow"
            style={{
              opacity: open ? 0.25 : 0.85,
              transition: "opacity 0.3s ease",
            }}
          >
            {"LET'S TALK • HIRE ME • SAY HELLO • LET'S BUILD • ".split("").map((char, i, arr) => {
              const angleStep = 360 / arr.length;
              return (
                <span
                  key={i}
                  className="absolute inset-0 text-center font-body font-extrabold uppercase text-[var(--color-ink)]"
                  style={{
                    transform: `rotate(${i * angleStep}deg)`,
                    fontSize: "9.5px",
                    fontWeight: 900,
                    letterSpacing: "0.08em",
                    paddingTop: "6px",
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>

          {/* Core Central Circular Button */}
          <button
            onClick={toggleOpen}
            aria-label={open ? "Close contact options" : "Open contact options"}
            aria-expanded={open}
            className={cn(
              "relative z-20 flex items-center justify-center group overflow-hidden",
              "w-14 h-14 sm:w-16 sm:h-16 rounded-full",
              "border border-[var(--color-border)]",
              "bg-[var(--color-surface)]/75 backdrop-blur-xl",
              "shadow-[var(--shadow-lg)]",
              "text-[var(--color-ink)] transition-all duration-300",
              "hover:bg-[var(--color-ink)] hover:text-[var(--color-base)] hover:border-[var(--color-ink)]",
              "hover:scale-105 active:scale-95",
              "cursor-pointer"
            )}
          >
            {/* Center icon: Rotated Arrow or X depending on state */}
            <div className="relative w-6 h-6 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                {open ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={20} strokeWidth={2.5} className="group-hover:text-[var(--color-vermillion)]" />
                  </motion.div>
                ) : (
                  <div className="relative w-full h-full">
                    {/* Arrow 1: Centered, slides out top-right on hover */}
                    <ArrowUpRight
                      size={22}
                      strokeWidth={2.5}
                      className="absolute inset-0 transition-transform duration-300 ease-in-out group-hover:translate-x-[150%] group-hover:-translate-y-[150%] translate-x-px -translate-y-px"
                    />
                    {/* Arrow 2: Starts at bottom-left, slides to center on hover */}
                    <ArrowUpRight
                      size={22}
                      strokeWidth={2.5}
                      className="absolute inset-0 transition-transform duration-300 ease-in-out translate-x-[-150%] translate-y-[150%] group-hover:translate-x-px group-hover:-translate-y-px"
                    />
                  </div>
                )}
              </AnimatePresence>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   Radial Contact Option Item
───────────────────────────────────────────────────────────── */
interface RadialItemProps {
  item: (typeof CONTACT_ITEMS)[number];
  coords: { x: number; y: number };
  index: number;
  onClose: () => void;
}

function RadialItem({ item, coords, index, onClose }: RadialItemProps) {
  const { label, sublabel, href, Icon, iconColor, bgHover, borderHover } = item;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
      animate={{
        x: coords.x,
        y: coords.y,
        scale: 1,
        opacity: 1,
      }}
      exit={{ x: 0, y: 0, scale: 0, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 24,
        mass: 0.8,
        delay: index * 0.04,
      }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
    >
      <div className="relative flex items-center">
        {/* Tooltip Label (slides out to the left) */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: -8, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-full mr-2 py-1.5 px-3 rounded-xl border border-[var(--color-border)]/55 bg-[var(--color-surface)]/95 backdrop-blur-md shadow-md text-right pointer-events-none whitespace-nowrap"
            >
              <div className="text-[11px] font-bold text-[var(--color-ink)] leading-none">
                {label}
              </div>
              <div className="text-[9px] font-medium text-[var(--color-muted)] leading-none mt-0.5 tracking-wide">
                {sublabel}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Circular segment button */}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={cn(
            "flex items-center justify-center",
            "w-11 h-11 sm:w-13 sm:h-13 rounded-full",
            "border border-[var(--color-border)]",
            "bg-[var(--color-surface)]/80 backdrop-blur-xl",
            "shadow-md transition-all duration-200 ease-out",
            "cursor-pointer",
            bgHover,
            borderHover,
            "hover:scale-110 active:scale-95 hover:shadow-lg"
          )}
        >
          <Icon
            size={18}
            style={{ color: iconColor }}
            className="transition-transform duration-200"
            aria-hidden="true"
          />
        </a>
      </div>
    </motion.div>
  );
}
