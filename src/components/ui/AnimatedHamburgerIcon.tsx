"use client";

import { motion } from "motion/react";

/* ─────────────────────────────────────────────────────────────
   ANIMATED HAMBURGER ICON
   3-bar → X morph, controlled externally via `open` prop.
   Top/bottom bars share the same center point + length so the
   open-state X crosses cleanly through the middle.
───────────────────────────────────────────────────────────── */

export default function AnimatedHamburgerIcon({
  open,
  color,
}: {
  open: boolean;
  color: string;
}) {
  // Base position/size for every bar is a Tailwind class, so it's baked
  // into the server-rendered HTML and shows up immediately — motion only
  // ever adds a transform (rotate/translate) on top, it never has to
  // compute top/left/width from scratch before anything is visible.
  return (
    <span className="relative block w-[18px] h-[14px]">
      {/* Top bar */}
      <motion.span
        className="absolute top-0 left-0 h-[1.75px] w-[18px] rounded-full"
        style={{ backgroundColor: color }}
        animate={{ y: open ? 6 : 0, rotate: open ? 45 : 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
      />
      {/* Middle bar */}
      <motion.span
        className="absolute top-[6px] left-0 h-[1.75px] w-[18px] rounded-full"
        style={{ backgroundColor: color }}
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      />
      {/* Bottom bar (shorter, offset right when closed) */}
      <motion.span
        className="absolute top-[12px] left-[9px] h-[1.75px] w-[9px] rounded-full"
        style={{ backgroundColor: color }}
        animate={{
          y: open ? -6 : 0,
          x: open ? -9 : 0,
          width: open ? 18 : 9,
          rotate: open ? -45 : 0,
        }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
      />
    </span>
  );
}
