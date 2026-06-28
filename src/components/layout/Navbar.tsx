"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/Logo";

/* ─────────────────────────────────────────────────────────────
   Navigation links — full page routes (multi-page architecture)
───────────────────────────────────────────────────────────── */
const navLinks = [
  { label: "Home",       href: "/" },
  { label: "About",      href: "/about" },
  { label: "Projects",   href: "/projects" },
  { label: "Skills",     href: "/skills" },
  { label: "Experience", href: "/experience" },
  { label: "Contact",    href: "/contact" },
];

const mobileNavLinks = [
  ...navLinks,
  { label: "Resume",     href: "/resume" },
];

/* ─────────────────────────────────────────────────────────────
   Social links — add your handles here when ready
───────────────────────────────────────────────────────────── */
const socialLinks = [
  { label: "GitHub",    href: "https://github.com/iykevisuals" },
  { label: "LinkedIn",  href: "https://linkedin.com/in/iykevisuals" },
  { label: "Twitter/X", href: "https://x.com/iykevisuals" },
  { label: "Instagram", href: "https://instagram.com/iykevisuals" },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [mounted,  setMounted]    = useState(false);   // hydration guard
  const pathname                  = usePathname();

  const menuRef      = useRef<HTMLDivElement>(null);
  const menuLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const menuTlRef    = useRef<gsap.core.Timeline | null>(null);


  /* ── Hydration guard — active-link state only after mount ── */
  useEffect(() => { setMounted(true); }, []);

  /* ── Active-path helper: returns false before mount so SSR and
     first hydration paint are identical (no className mismatch) ── */
  function isActive(href: string) {
    if (!mounted) return false;
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  /* ── Scroll detection (hairline border + shadow) ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Lock body scroll and pause Lenis when mobile menu is open ── */
  useEffect(() => {
    const lenis = (window as any).lenisInstance;
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "";
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [menuOpen]);

  /* ── Close menu on route change ── */
  useEffect(() => {
    if (menuOpen) closeMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  /* ── Build GSAP timeline dynamically on open ── */
  useEffect(() => {
    return () => {
      menuTlRef.current?.kill();
    };
  }, []);

  function openMenu() {
    setMenuOpen(true);

    if (!menuRef.current) return;

    // Kill any existing animation
    menuTlRef.current?.kill();

    // Create a new timeline
    const tl = gsap.timeline();
    menuTlRef.current = tl;

    tl.fromTo(
      menuRef.current,
      { yPercent: -100, visibility: "hidden" },
      { yPercent: 0, visibility: "visible", duration: 0.55, ease: "power4.out" }
    );

    const targets = menuLinksRef.current.filter(Boolean);
    if (targets.length > 0) {
      tl.fromTo(
        targets,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power3.out" },
        "-=0.25"
      );
    }
  }

  function closeMenu() {
    if (menuTlRef.current) {
      menuTlRef.current.reverse().then(() => {
        setMenuOpen(false);
      });
    } else {
      setMenuOpen(false);
    }
  }

  function toggleMenu() {
    menuOpen ? closeMenu() : openMenu();
  }

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          DESKTOP / TABLET NAVBAR
          Transparent at top → frosted glass on scroll
      ═══════════════════════════════════════════════════ */}
      <nav
        aria-label="Main navigation"
        className={cn(
          "fixed top-0 left-0 right-0 z-[var(--z-navbar)]",
          "h-[var(--navbar-height)]",
          "flex items-center justify-between",
          "px-6 md:px-10 lg:px-16",
          "transition-all duration-300 ease-in-out",
          menuOpen
            ? "bg-[var(--color-vermillion)] border-b border-[rgba(240,237,230,0.25)] shadow-none"
            : cn(
                "bg-[var(--color-surface)]",
                "border-b border-[var(--color-border)]",
                scrolled && "shadow-[var(--shadow-sm)]"
              )
        )}
      >
        {/* ── Left: Logo lockup ── */}
        <Logo
          variant="wordmark"
          wordmarkSize="clamp(0.9rem, 2.2vw, 1.15rem)"
          className={menuOpen ? "text-[var(--color-base)]" : "text-[var(--color-ink)]"}
        />

        {/* ── Center/Right: Desktop nav links, evenly spaced ── */}
        <div className="hidden lg:flex items-center gap-6" role="list">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              isActive={isActive(link.href)}
            />
          ))}
        </div>

        {/* ── Right: CTA & Hamburger lockup ── */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Resume button */}
          <Link
            href="/resume"
            className={cn(
              "hidden lg:inline-flex items-center justify-center gap-2",
              "h-10 lg:h-11 px-4 lg:px-6 rounded-full",
              "text-sm font-semibold whitespace-nowrap leading-none",
              "transition-all duration-200",
              menuOpen
                ? "border border-[rgba(240,237,230,0.3)] text-[var(--color-base)] hover:bg-[rgba(240,237,230,0.1)]"
                : mounted && pathname === "/resume"
                  ? "bg-[var(--color-ink)] text-[var(--color-base)] border border-[var(--color-ink)] hover:opacity-85"
                  : "border border-[var(--color-border)] bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-base)]"
            )}
          >
            Resume
          </Link>

          {/* CTA pill (visible on desktop and mobile) */}
          <Link
            href="/contact"
            className={cn(
              "inline-flex items-center justify-center gap-2",
              "h-10 lg:h-11 px-4 lg:px-6 rounded-full",
              menuOpen
                ? "bg-[var(--color-base)] text-[var(--color-vermillion)] hover:bg-[rgba(240,237,230,0.9)]"
                : "bg-[var(--color-ink)] text-[var(--color-base)] hover:opacity-85",
              "text-sm font-semibold whitespace-nowrap leading-none",
              "transition-all duration-200"
            )}
          >
            Let&apos;s talk
          </Link>

          {/* Hamburger — Gemini-style: 3 lines in a circular pill */}
          <button
            id="navbar-hamburger"
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className={cn(
              "lg:hidden relative z-50 flex items-center justify-center",
              "w-10 h-10 md:w-11 md:h-11 rounded-full",
              "transition-all duration-300",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-vermillion)]",
              menuOpen
                ? "bg-[rgba(240,237,230,0.15)] hover:bg-[rgba(240,237,230,0.25)] active:bg-[rgba(240,237,230,0.3)]"
                : "bg-transparent hover:bg-[var(--color-ink)]/[0.07] active:bg-[var(--color-ink)]/[0.12]"
            )}
          >
            {/* 3-line hamburger → X morphing icon */}
            <span className="relative flex flex-col justify-center items-center w-[18px] h-[14px]">
              {/* Line 1 — top */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute block h-[1.75px] bg-current rounded-full transition-all duration-300 ease-[var(--ease-out-expo)]",
                  menuOpen
                    ? "w-[18px] top-1/2 -translate-y-1/2 rotate-45"
                    : "w-[18px] top-0 rotate-0"
                )}
                style={{ color: menuOpen ? "var(--color-base)" : "var(--color-ink)" }}
              />
              {/* Line 2 — middle */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute block h-[1.75px] rounded-full transition-all duration-300 ease-[var(--ease-out-expo)]",
                  menuOpen
                    ? "w-0 opacity-0 top-1/2 -translate-y-1/2"
                    : "w-[14px] top-1/2 -translate-y-1/2 opacity-100 bg-current"
                )}
                style={{ color: menuOpen ? "var(--color-base)" : "var(--color-ink)" }}
              />
              {/* Line 3 — bottom */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute block h-[1.75px] bg-current rounded-full transition-all duration-300 ease-[var(--ease-out-expo)]",
                  menuOpen
                    ? "w-[18px] top-1/2 -translate-y-1/2 -rotate-45"
                    : "w-[18px] bottom-0 rotate-0"
                )}
                style={{ color: menuOpen ? "var(--color-base)" : "var(--color-ink)" }}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════
          MOBILE FULL-SCREEN MENU (CRAV-style)
          Vermillion overlay, BBH Bogle links, slides from top
      ═══════════════════════════════════════════════════ */}
      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-label="Mobile navigation"
        aria-modal="true"
        className={cn(
          "fixed inset-0 z-[calc(var(--z-navbar)-1)]",
          "bg-[var(--color-vermillion)]",
          "flex flex-col",
          "px-6 pt-[var(--navbar-height)] pb-8",
          "overflow-hidden lg:hidden"
        )}
        style={{ visibility: "hidden" }}
      >

        {/* ── Nav links: flex-1 so they fill all available space,
            justify-evenly distributes them proportionally
            regardless of screen height (phone vs tablet) ── */}
        <nav
          aria-label="Mobile navigation links"
          className="flex-1 flex flex-col justify-center min-h-0"
        >
          <ul className="flex flex-col h-full justify-evenly">
            {mobileNavLinks.map((link, i) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <li
                  key={link.href}
                  className="border-b border-[rgba(240,237,230,0.15)] last:border-0 flex items-center"
                >
                  <Link
                    href={link.href}
                    ref={(el) => { menuLinksRef.current[i] = el; }}
                    className={cn(
                      "group w-full py-3 text-logo leading-none tracking-normal",
                      "transition-all duration-200",
                      isActive
                        ? "text-[var(--color-ink)] opacity-100"
                        : "text-[var(--color-base)] opacity-70 hover:opacity-100"
                    )}
                    style={{
                      fontSize: "clamp(1.6rem, 5vw, 3.5rem)",
                      opacity: 0,
                    }}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-3 transition-transform duration-300 ease-[var(--ease-out-expo)]",
                        isActive ? "translate-x-4" : "group-hover:translate-x-4"
                      )}
                    >
                      <span className={cn(isActive && "font-bold")}>
                        {link.label.toUpperCase()}
                      </span>
                      <span
                        className={cn(
                          "transition-all duration-300 ease-[var(--ease-out-expo)] text-current",
                          isActive
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                        )}
                      >
                        ↗
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── Social footer: always anchored at bottom, never eats into link space ── */}
        <div className="shrink-0 pt-4 pb-2 border-t border-[rgba(240,237,230,0.15)] flex gap-5 flex-wrap">
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "text-body font-semibold uppercase tracking-[var(--tracking-wider)]",
                "text-[var(--color-base)] opacity-60 hover:opacity-100",
                "transition-all duration-200",
                "text-[clamp(0.6rem,1.5vw,0.75rem)]"
              )}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   DESKTOP NAV LINK
   Adam Hartwig-style vertical text slide on hover.
   Two text layers stacked — top (ink) exits up, bottom (vermillion) enters from below.
───────────────────────────────────────────────────────────── */
function NavLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      role="listitem"
      className={cn(
        "relative text-sm font-medium select-none group py-2",
        "transition-colors duration-200",
        isActive
          ? "text-[var(--color-ink)]"
          : "text-muted hover:text-[var(--color-ink)]"
      )}
    >
      {label}
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-0 -bottom-0.5 h-[1.5px] bg-[var(--color-ink)] rounded-full",
          "transition-transform duration-300 ease-[var(--ease-out-expo)]",
          isActive
            ? "w-full scale-x-100"
            : "w-full scale-x-0 origin-left group-hover:scale-x-100"
        )}
      />
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────
   HAMBURGER ICON
   Two-line animated hamburger → X on open
───────────────────────────────────────────────────────────── */
function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className="text-[var(--color-ink)]"
    >
      {/* Top line */}
      <line
        x1="0" y1="3" x2="18" y2="3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="transition-transform duration-300"
        style={{
          transformOrigin: "9px 3px",
          transform: isOpen ? "rotate(45deg) translateY(6px)" : "rotate(0deg)",
        }}
      />
      {/* Bottom line */}
      <line
        x1="0" y1="15" x2="18" y2="15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="transition-transform duration-300"
        style={{
          transformOrigin: "9px 15px",
          transform: isOpen ? "rotate(-45deg) translateY(-6px)" : "rotate(0deg)",
        }}
      />
    </svg>
  );
}
