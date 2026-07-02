"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Logo Component
 * Two variants:
 *
 * "wordmark" — Full "IKECHUKWU ALAETO" in BBH Bogle font.
 *              Used in Navbar when scrollY === 0, and in Footer.
 *
 * "monogram" — "IA" rendered with BBH Bogle font.
 *              The "I" is tilted ~14° clockwise via CSS transform
 *              so its angle matches the left arm of the "A".
 *              They form a ligature-like pair.
 *              Used in Navbar after scrollY > 80.
 *
 * Both wrap in a <Link href="/"> by default (overridable via `href` prop).
 * The crossfade between states is handled by the parent (Navbar).
 */

interface LogoProps {
  variant: "wordmark" | "monogram";
  className?: string;
  href?: string;
  /** Size override for the monogram (defaults to 2.2rem) */
  monogramSize?: string;
  /** Size override for the wordmark font (defaults to 1.15rem) */
  wordmarkSize?: string;
}

export default function Logo({
  variant,
  className,
  href = "/",
  monogramSize = "2.2rem",
  wordmarkSize = "1.1rem",
}: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="Ikechukwu Alaeto — Home"
      className={cn("inline-flex items-center select-none", className || "text-ink")}
    >
      {variant === "wordmark" ? (
        <Wordmark size={wordmarkSize} className="text-current" />
      ) : (
        <Monogram size={monogramSize} className="text-current" />
      )}
    </Link>
  );
}

/* ─── Wordmark ───────────────────────────────────────────────── */

function Wordmark({ size, className }: { size: string; className?: string }) {
  return (
    <span
      className={cn("font-bold leading-none tracking-normal whitespace-nowrap inline-block uppercase", className)}
      style={{ fontSize: size, fontFamily: "var(--font-logo)" }}
    >
      IKECHUKWU ALAETO
    </span>
  );
}

/* ─── Monogram ───────────────────────────────────────────────── */

function Monogram({ size, className }: { size: string; className?: string }) {
  return (
    <span
      className={cn("inline-flex items-baseline leading-none", className)}
      style={{ fontSize: size, gap: "0.02em" }}
      aria-label="IA"
    >
      {/*
        The "I" is rotated clockwise ~13° around its own baseline center.
        This angle matches the slope of the "A"'s left arm in Stack Sans Notch.
        The negative margin-right pulls the "A" closer, reinforcing the ligature.
      */}
      <span
        className="text-logo inline-block"
        style={{
          transform: "rotate(13deg)",
          transformOrigin: "50% 82%",
          marginRight: "-0.05em",
          display: "inline-block",
        }}
        aria-hidden="true"
      >
        I
      </span>
      <span
        className="text-logo inline-block"
        aria-hidden="true"
      >
        A
      </span>
    </span>
  );
}
