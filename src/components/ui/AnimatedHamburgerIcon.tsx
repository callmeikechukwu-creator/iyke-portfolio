"use client";

import { motion, type Variants } from "motion/react";

/* ─────────────────────────────────────────────────────────────
   ANIMATED HAMBURGER ICON
   3-bar → X morph, controlled externally via `open` prop.
   Top/bottom bars share the same center point + length so the
   open-state X crosses cleanly through the middle.
───────────────────────────────────────────────────────────── */

const VARIANTS: Record<"top" | "middle" | "bottom", Variants> = {
  top: {
    closed: { top: 0, left: 0, width: 18, rotate: 0 },
    open:   { top: 6, left: 0, width: 18, rotate: 45 },
  },
  middle: {
    closed: { opacity: 1 },
    open:   { opacity: 0 },
  },
  bottom: {
    closed: { top: 12, left: 9, width: 9, rotate: 0 },
    open:   { top: 6,  left: 0, width: 18, rotate: -45 },
  },
};

export default function AnimatedHamburgerIcon({
  open,
  color,
}: {
  open: boolean;
  color: string;
}) {
  return (
    <motion.span
      initial={false}
      animate={open ? "open" : "closed"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="relative block w-[18px] h-[14px]"
    >
      {/* Top bar */}
      <motion.span
        variants={VARIANTS.top}
        className="absolute h-[1.75px] rounded-full"
        style={{ backgroundColor: color }}
      />
      {/* Middle bar */}
      <motion.span
        variants={VARIANTS.middle}
        className="absolute left-0 top-[6px] h-[1.75px] w-[18px] rounded-full"
        style={{ backgroundColor: color }}
      />
      {/* Bottom bar (shorter, offset right when closed) */}
      <motion.span
        variants={VARIANTS.bottom}
        className="absolute h-[1.75px] rounded-full"
        style={{ backgroundColor: color }}
      />
    </motion.span>
  );
}
