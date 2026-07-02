"use client";
 
import { useState, useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/Logo";
import AnimatedHamburgerIcon from "@/components/ui/AnimatedHamburgerIcon";
import AboutShiftingDropdown from "@/components/layout/AboutShiftingDropdown";
import { ChevronDown } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Navigation links — full page routes (multi-page architecture)
   "About" is a grouped trigger (desktop: hover dropdown,
   mobile: tap-to-expand accordion) covering About/Skills/Experience.
───────────────────────────────────────────────────────────── */
const navLinks = [
  { label: "Home",     href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Blog",     href: "/blog" },
  { label: "Contact",  href: "/contact" },
];

const aboutGroupLinks = [
  { label: "About",      href: "/about" },
  { label: "Skills",     href: "/skills" },
  { label: "Experience", href: "/experience" },
];

const mobileNavLinks = [
  { label: "Home", href: "/" },
  // "About" group is rendered separately as an accordion in the mobile menu
  { label: "Projects", href: "/projects" },
  { label: "Blog",     href: "/blog" },
  { label: "Contact",  href: "/contact" },
  { label: "Resume",   href: "/resume" },
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
  const [aboutExpanded, setAboutExpanded] = useState(false); // mobile accordion
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname                  = usePathname();

  let activeItem = "/";
  if (pathname === "/") activeItem = "/";
  else if (pathname.startsWith("/about") || pathname.startsWith("/skills") || pathname.startsWith("/experience")) {
    activeItem = "about";
  } else if (pathname.startsWith("/projects")) activeItem = "/projects";
  else if (pathname.startsWith("/blog")) activeItem = "/blog";
  else if (pathname.startsWith("/contact")) activeItem = "/contact";

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
        setAboutExpanded(false);
      });
    } else {
      setMenuOpen(false);
      setAboutExpanded(false);
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
          "flex items-center",
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
        <div className="w-full max-w-[var(--content-max-width)] mx-auto flex items-center justify-between px-6 md:px-10 lg:px-16">
          {/* ── Left: Logo lockup ── */}
          <Logo
            variant="wordmark"
            wordmarkSize="clamp(1.4rem, 3.2vw, 2.1rem)"
            className={menuOpen ? "text-[var(--color-base)]" : "text-[var(--color-ink)]"}
          />

          {/* ── Center/Right: Desktop nav links, evenly spaced ── */}
          <div
            className="hidden lg:flex items-center gap-1.5 relative"
            onMouseLeave={() => setHoveredItem(null)}
            role="list"
          >
            <NavLink
              href="/"
              label="Home"
              hoveredItem={hoveredItem}
              setHoveredItem={setHoveredItem}
              activeItem={activeItem}
            />

            <AboutShiftingDropdown
              menuOpen={menuOpen}
              isActiveGroup={aboutGroupLinks.some((l) => isActive(l.href))}
              hoveredItem={hoveredItem}
              setHoveredItem={setHoveredItem}
              activeItem={activeItem}
            />

            {navLinks
              .filter((link) => link.href !== "/")
              .map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  hoveredItem={hoveredItem}
                  setHoveredItem={setHoveredItem}
                  activeItem={activeItem}
                />
              ))}
          </div>

          {/* ── Right: CTA & Hamburger lockup ── */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Resume button */}
            <a
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
            </a>

            {/* CTA pill (visible on desktop and mobile) */}
            <a
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
            </a>

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
                  : "bg-[var(--color-ink)]/[0.06] hover:bg-[var(--color-ink)]/[0.1] active:bg-[var(--color-ink)]/[0.15]"
              )}
            >
              {/* 3-line hamburger → X morphing icon (motion/react) */}
              <AnimatedHamburgerIcon
                open={menuOpen}
                color={menuOpen ? "var(--color-base)" : "var(--color-ink)"}
              />
            </button>
          </div>
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
          className="flex-1 flex flex-col min-h-0 overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <ul className="flex flex-col min-h-full justify-evenly">
            {/* ── Home ── */}
            <MobileNavItem
              link={mobileNavLinks[0]}
              index={0}
              isActive={pathname === "/"}
              menuLinksRef={menuLinksRef}
            />

            {/* ── About accordion (About / Skills / Experience) ── */}
            <li className="border-b border-[rgba(240,237,230,0.15)]">
              <button
                type="button"
                onClick={() => setAboutExpanded((v) => !v)}
                ref={(el) => { menuLinksRef.current[1] = el as unknown as HTMLAnchorElement; }}
                aria-expanded={aboutExpanded}
                className={cn(
                  "group flex w-full items-center justify-between gap-3 py-2 text-logo leading-none tracking-normal",
                  "transition-all duration-200",
                  aboutGroupLinks.some((l) => pathname.startsWith(l.href))
                    ? "text-[var(--color-ink)] opacity-100"
                    : "text-[var(--color-base)] opacity-70 hover:opacity-100"
                )}
                style={{ fontSize: "clamp(1.05rem, 4vw, 2.6rem)", opacity: 0 }}
              >
                <span className="flex items-center gap-3">
                  <span>ABOUT</span>
                </span>
                <ChevronDown
                  className={cn(
                    "transition-transform duration-300 ease-[var(--ease-out-expo)]",
                    aboutExpanded && "rotate-180"
                  )}
                  size={22}
                />
              </button>

              {/* Expand-in-place sub-links */}
              <div
                className={cn(
                  "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-[var(--ease-out-expo)]",
                  aboutExpanded ? "grid-rows-[1fr] pb-3" : "grid-rows-[0fr]"
                )}
              >
                <div className="min-h-0 flex flex-col gap-1 pl-4">
                  {aboutGroupLinks.map((link) => {
                    const active = pathname.startsWith(link.href);
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "py-1.5 text-body text-base",
                          "transition-colors duration-200",
                          active
                            ? "text-[var(--color-ink)] font-semibold"
                            : "text-[var(--color-base)] opacity-70 hover:opacity-100"
                        )}
                      >
                        {link.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            </li>

            {/* ── Remaining flat links (Projects, Blog, Contact, Resume) ── */}
            {mobileNavLinks.slice(1).map((link, i) => (
              <MobileNavItem
                key={link.href}
                link={link}
                index={i + 2}
                isActive={pathname.startsWith(link.href)}
                menuLinksRef={menuLinksRef}
              />
            ))}
          </ul>
        </nav>


      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
/* Mobile nav item — single flat link row */
function MobileNavItem({
  link,
  index,
  isActive,
  menuLinksRef,
}: {
  link: { label: string; href: string };
  index: number;
  isActive: boolean;
  menuLinksRef: MutableRefObject<(HTMLAnchorElement | null)[]>;
}) {
  return (
    <li className="border-b border-[rgba(240,237,230,0.15)] last:border-0 flex items-center">
      <a
        href={link.href}
        ref={(el) => { menuLinksRef.current[index] = el; }}
        className={cn(
          "group w-full py-2 text-logo leading-none tracking-normal",
          "transition-all duration-200",
          isActive
            ? "text-[var(--color-ink)] opacity-100"
            : "text-[var(--color-base)] opacity-70 hover:opacity-100"
        )}
        style={{
          fontSize: "clamp(1.05rem, 4vw, 2.6rem)",
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
      </a>
    </li>
  );
}

function NavLink({
  href,
  label,
  hoveredItem,
  setHoveredItem,
  activeItem,
}: {
  href: string;
  label: string;
  hoveredItem: string | null;
  setHoveredItem: (val: string | null) => void;
  activeItem: string;
}) {
  const isCurrentHighlight = hoveredItem === href || (hoveredItem === null && activeItem === href);
  const isActive = activeItem === href;

  let textColorClass = "text-muted";
  if (isCurrentHighlight) {
    if (hoveredItem === null && activeItem === href) {
      textColorClass = "text-[var(--color-base)]";
    } else {
      textColorClass = "text-[var(--color-ink)]";
    }
  } else if (isActive) {
    textColorClass = "text-[var(--color-ink)]";
  }

  return (
    <a
      href={href}
      role="listitem"
      onMouseEnter={() => setHoveredItem(href)}
      className={cn(
        "relative text-sm font-semibold select-none py-2 px-4 rounded-full transition-colors duration-200 no-underline focus:outline-none focus-visible:outline-none",
        textColorClass
      )}
    >
      <span className="relative z-10">{label}</span>
      {isCurrentHighlight && (
        <motion.div
          layoutId="navbar-capsule"
          className={cn(
            "absolute inset-0 rounded-full z-0",
            hoveredItem === null && activeItem === href
              ? "bg-[var(--color-ink)]"
              : "bg-[var(--color-ink)]/[0.06]"
          )}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
        />
      )}
    </a>
  );
}

/* ─────────────────────────────────────────────────────────────
   HAMBURGER ICON
   Two-line animated hamburger → X on open
───────────────────────────────────────────────────────────── */

