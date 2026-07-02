"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const footerLinks = [
  { label: "Home",       href: "/" },
  { label: "About",      href: "/about" },
  { label: "Projects",   href: "/projects" },
  { label: "Skills",     href: "/skills" },
  { label: "Experience", href: "/experience" },
  { label: "Contact",    href: "/contact" },
];

const socialLinks = [
  { label: "GitHub",    href: "https://github.com/iykevisuals" },
  { label: "LinkedIn",  href: "https://linkedin.com/in/iykevisuals" },
  { label: "Twitter/X", href: "https://x.com/iykevisuals" },
  { label: "Instagram", href: "https://instagram.com/iykevisuals" },
];

/**
 * Footer Component
 * Premium dark background footer (`bg-[var(--color-ink)]`).
 * Features:
 *   - Giant responsive wordmark: "IKECHUKWU ALAETO" in Stack Sans Notch
 *   - Balanced columns with tagline, quick links, and active social hooks
 *   - Simple, modern, and aligned with visual best practices
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      aria-label="Site footer"
      className="relative w-full bg-[var(--color-ink)] text-[var(--color-base)] pt-16 pb-8 md:pt-24 md:pb-12 border-t border-[var(--color-base)]/10"
    >
      {/* Decorative Grid Overlay */}
      <div
        aria-hidden="true"
        className="
          absolute inset-0 pointer-events-none
          bg-[linear-gradient(to_right,rgba(240,237,230,0.025)_1px,transparent_1px),
              linear-gradient(to_bottom,rgba(240,237,230,0.025)_1px,transparent_1px)]
          bg-[size:4rem_4rem]
        "
      />

      <div className="section-wrapper flex flex-col gap-12 md:gap-16 relative z-10">
        
        {/* ── Top Row: Giant Logo Wordmark ── */}
        <div className="w-full overflow-hidden select-none pointer-events-none border-b border-[var(--color-base)]/10 pb-10 md:pb-14">
          <span
            className="block w-full text-center font-bold text-[var(--color-base)] uppercase opacity-90 leading-[1.5] py-4 whitespace-nowrap"
            style={{ fontSize: "clamp(1.2rem, 7vw, 8.5rem)", letterSpacing: "0.02em", fontFamily: "var(--font-logo-outline)" }}
          >
            IKECHUKWU&nbsp;ALAETO
          </span>
        </div>

        {/* ── Mid Row: Tagline + Navigation ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Left Block: Tagline */}
          <div className="md:col-span-6 flex flex-col gap-4">
            <span className="text-body text-xs font-bold text-[var(--color-vermillion)] uppercase tracking-[var(--tracking-wider)]">
              Digital Architect
            </span>
            <p
              className="text-display font-medium text-[var(--color-base)]/90 leading-tight max-w-[360px]"
              style={{ fontSize: "clamp(1.2rem, 3.5vw, 1.8rem)", letterSpacing: "-0.02em" }}
            >
              I build web experiences that feel alive.
            </p>
            <p className="text-body text-xs text-[var(--color-base)]/50 leading-relaxed max-w-[320px]">
              Available for full stack contracts, technical consulting, and visual development projects globally.
            </p>
          </div>

          {/* Right Block: Sitemap Links */}
          <div className="md:col-span-6 grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <span className="text-body text-xs font-bold text-[var(--color-base)]/40 uppercase tracking-widest">
                Navigation
              </span>
              <ul className="flex flex-col gap-3 font-body text-sm font-semibold">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[var(--color-base)]/75 hover:text-[var(--color-vermillion)] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-body text-xs font-bold text-[var(--color-base)]/40 uppercase tracking-widest">
                Social Hub
              </span>
              <ul className="flex flex-col gap-3 font-body text-sm font-semibold">
                {socialLinks.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-base)]/75 hover:text-[var(--color-vermillion)] transition-colors duration-200"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Bottom Row: Copyright ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--color-base)]/10 text-body text-[10px] sm:text-xs text-[var(--color-base)]/40 font-semibold uppercase tracking-wider w-full text-center">
          <span className="whitespace-nowrap">
            &copy; {currentYear} Ikechukwu Alaeto. All rights reserved.
          </span>
          <div className="flex items-center gap-2 justify-center sm:justify-end whitespace-nowrap">
            <span>Crafted with passion using Next.js &amp; React</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-vermillion)]" />
          </div>
        </div>

      </div>
    </footer>
  );
}
