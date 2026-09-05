"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Github, Linkedin, Twitter, Instagram, ArrowUpRight } from "lucide-react";
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
  { label: "GitHub",    href: "https://github.com/iykevisuals", Icon: Github, brandColor: "bg-[#24292e]" },
  { label: "LinkedIn",  href: "https://linkedin.com/in/iykevisuals", Icon: Linkedin, brandColor: "bg-[#0077b5]" },
  { label: "Twitter/X", href: "https://x.com/iykevisuals", Icon: Twitter, brandColor: "bg-[#14171a]" },
  { label: "Instagram", href: "https://instagram.com/iykevisuals", Icon: Instagram, brandColor: "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]" },
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
            style={{
              fontSize: "clamp(1.2rem, 7vw, 8.5rem)",
              letterSpacing: "0.02em",
              fontFamily: "var(--font-logo-outline)",
              WebkitTextStroke: "1.5px rgba(240, 237, 230, 0.35)",
              color: "transparent",
            }}
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
              <div className="flex flex-col gap-2.5 pt-2 w-full max-w-[200px]">
                {socialLinks.map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-between px-4 py-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] text-[var(--color-base)]/80 overflow-hidden cursor-pointer select-none"
                    whileHover="hover"
                    whileTap="tap"
                    initial="rest"
                  >
                    {/* Brand background overlay that springs up and wiggles into place */}
                    <motion.div
                      variants={{
                        rest: { y: 18, scale: 0.85, rotate: -6, opacity: 0 },
                        hover: { 
                          y: 0, 
                          scale: 1, 
                          rotate: 0, 
                          opacity: 1,
                          transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 20
                          }
                        }
                      }}
                      className={cn(
                        "absolute inset-0 z-0 rounded-2xl pointer-events-none",
                        s.brandColor
                      )}
                    />

                    {/* Content */}
                    <div className="relative z-10 flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <motion.div
                          variants={{
                            rest: { scale: 1 },
                            hover: { 
                              scale: 1.12,
                              rotate: -6,
                              transition: { type: "spring", stiffness: 400, damping: 15 }
                            }
                          }}
                          className="text-[var(--color-base)] shrink-0"
                        >
                          <s.Icon size={16} />
                        </motion.div>
                        <span className="font-body text-sm font-semibold tracking-wide transition-colors duration-200 group-hover:text-white">
                          {s.label}
                        </span>
                      </div>
                      
                      {/* Micro arrow indicator on hover */}
                      <motion.div
                        variants={{
                          rest: { opacity: 0, x: -6 },
                          hover: { opacity: 0.7, x: 0 }
                        }}
                        className="text-white"
                      >
                        <ArrowUpRight size={13} strokeWidth={2.5} />
                      </motion.div>
                    </div>
                  </motion.a>
                ))}
              </div>
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
