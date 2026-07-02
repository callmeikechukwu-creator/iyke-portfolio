"use client";
 
import { useState, useEffect, useRef, type MutableRefObject } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/Logo";
import AnimatedHamburgerIcon from "@/components/ui/AnimatedHamburgerIcon";
import AboutShiftingDropdown from "@/components/layout/AboutShiftingDropdown";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Moon,
  Sun,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  ArrowUpRight
} from "lucide-react";

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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activePane, setActivePane] = useState<"main" | "about">("main");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const pathname                  = usePathname();

  let activeItem = "/";
  if (pathname === "/") activeItem = "/";
  else if (pathname.startsWith("/about") || pathname.startsWith("/skills") || pathname.startsWith("/experience")) {
    activeItem = "about";
  } else if (pathname.startsWith("/projects")) activeItem = "/projects";
  else if (pathname.startsWith("/blog")) activeItem = "/blog";
  else if (pathname.startsWith("/contact")) activeItem = "/contact";

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

  /* ── Reset active mobile pane when menu closes ── */
  useEffect(() => {
    if (!menuOpen) {
      setActivePane("main");
    }
  }, [menuOpen]);

  /* ── Close menu on route change ── */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  /* ── GSAP: animate mobile menu open/close ── */
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const links = menuLinksRef.current.filter(Boolean) as HTMLAnchorElement[];
    const tl = gsap.timeline();

    if (menuOpen) {
      gsap.set(menu, { visibility: "visible" });
      tl.fromTo(
        menu,
        { yPercent: -100 },
        { yPercent: 0, duration: 0.6, ease: "power4.inOut" }
      ).fromTo(
        links,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power3.out" },
        "-=0.25"
      );
    } else {
      tl.to(links, { opacity: 0, duration: 0.2 })
        .to(
          menu,
          { yPercent: -100, duration: 0.5, ease: "power4.inOut" },
          "-=0.1"
        )
        .set(menu, { visibility: "hidden" });
    }

    return () => {
      tl.kill();
    };
  }, [menuOpen]);

  /* ── Load initial theme on mount ── */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const current = document.documentElement.getAttribute("data-theme") as "light" | "dark" || "light";
      setTheme(current);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

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
          "bg-[var(--color-surface)]/80 backdrop-blur-md",
          "border-b border-[var(--color-border)]",
          scrolled && "shadow-[var(--shadow-sm)]"
        )}
      >
        <div className="w-full max-w-[var(--content-max-width)] mx-auto flex items-center justify-between px-6 md:px-10 lg:px-16">
          {/* ── Left: Logo lockup ── */}
          <Logo
            variant="wordmark"
            wordmarkSize="clamp(1.4rem, 3.2vw, 2.1rem)"
            className="text-[var(--color-ink)]"
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
                mounted && pathname === "/resume"
                  ? "bg-[var(--color-ink)] text-[var(--color-base)] border border-[var(--color-ink)] hover:opacity-85"
                  : "border border-[var(--color-border)] bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-base)]"
              )}
            >
              Resume
            </a>

            {/* CTA pill (visible on desktop and mobile) */}
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 h-10 lg:h-11 px-4 lg:px-6 rounded-full bg-[var(--color-ink)] text-[var(--color-base)] hover:opacity-85 text-sm font-semibold whitespace-nowrap leading-none transition-all duration-200"
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
                "bg-[var(--color-ink)]/[0.06] hover:bg-[var(--color-ink)]/[0.1] active:bg-[var(--color-ink)]/[0.15]"
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
          MOBILE FLOATING GLASS MENU (Vercel-style Option 1)
      ═══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-label="Mobile navigation"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className={cn(
              "fixed left-6 right-6 top-[80px] bottom-6 z-[49] lg:hidden",
              "rounded-[2.2rem] border border-[var(--color-border)]/50 bg-[var(--color-surface)]/75 backdrop-blur-xl shadow-2xl",
              "flex flex-col overflow-hidden p-6"
            )}
          >
            {/* Sliding Panes Container */}
            <div className="relative flex-1 overflow-hidden">
              
              {/* ── Pane 1: Main Menu Links ── */}
              <motion.div
                animate={{
                  x: activePane === "main" ? 0 : "-105%",
                  opacity: activePane === "main" ? 1 : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="absolute inset-0 flex flex-col justify-between"
              >
                <nav aria-label="Mobile navigation links" className="flex-1 overflow-y-auto pr-1">
                  <div className="flex flex-col gap-1">
                    {/* Home */}
                    <a
                      href="/"
                      className={cn(
                        "flex items-center justify-between py-4 border-b border-[var(--color-border)]/20 text-xl font-bold transition-colors duration-200",
                        pathname === "/" ? "text-[var(--color-vermillion)]" : "text-[var(--color-ink)]/80 hover:text-[var(--color-ink)]"
                      )}
                    >
                      <span>Home</span>
                      <ArrowUpRight size={18} className="opacity-40" />
                    </a>

                    {/* About Accordion Trigger */}
                    <button
                      onClick={() => setActivePane("about")}
                      className="flex items-center justify-between w-full py-4 border-b border-[var(--color-border)]/20 text-xl font-bold text-[var(--color-ink)]/80 hover:text-[var(--color-ink)] cursor-pointer focus:outline-none"
                    >
                      <span>About</span>
                      <ChevronRight size={18} className="text-muted" />
                    </button>

                    {/* Remaining Flat Links */}
                    {mobileNavLinks.slice(1).map((link) => {
                      const isActiveLink = pathname.startsWith(link.href);
                      return (
                        <a
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "flex items-center justify-between py-4 border-b border-[var(--color-border)]/20 text-xl font-bold transition-colors duration-200",
                            isActiveLink ? "text-[var(--color-vermillion)]" : "text-[var(--color-ink)]/80 hover:text-[var(--color-ink)]"
                          )}
                        >
                          <span>{link.label}</span>
                          <ArrowUpRight size={18} className="opacity-40" />
                        </a>
                      );
                    })}
                  </div>
                </nav>

                {/* Footer section inside main menu */}
                <div className="mt-auto pt-6 border-t border-[var(--color-border)]/20">
                  {/* Theme Switcher */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-bold text-muted uppercase tracking-wider">Appearance</span>
                    <button
                      onClick={toggleTheme}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--color-ink)]/[0.05] text-[var(--color-ink)] text-xs font-semibold focus:outline-none cursor-pointer hover:bg-[var(--color-ink)]/[0.1] transition-all duration-200"
                    >
                      {theme === "light" ? <Moon size={12} /> : <Sun size={12} />}
                      <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
                    </button>
                  </div>

                  {/* Social links row */}
                  <div className="flex justify-center gap-4 mb-4">
                    {socialLinks.map((social) => {
                      let Icon = Github;
                      if (social.label.includes("LinkedIn")) Icon = Linkedin;
                      if (social.label.includes("Twitter")) Icon = Twitter;
                      if (social.label.includes("Instagram")) Icon = Instagram;

                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-full bg-[var(--color-ink)]/[0.05] hover:bg-[var(--color-ink)]/[0.1] text-[var(--color-ink)] transition-colors duration-200"
                          title={social.label}
                        >
                          <Icon size={16} />
                        </a>
                      );
                    })}
                  </div>

                  {/* Contact Call-to-action button */}
                  <a
                    href="/contact"
                    className="flex items-center justify-center w-full py-4 rounded-2xl bg-[var(--color-vermillion)] text-[var(--color-base)] font-bold text-center hover:opacity-90 active:scale-98 transition-all duration-200 shadow-md"
                  >
                    Let's Talk
                  </a>
                </div>
              </motion.div>

              {/* ── Pane 2: About Sub-links Menu ── */}
              <motion.div
                initial={{ x: "105%", opacity: 0 }}
                animate={{
                  x: activePane === "about" ? 0 : "105%",
                  opacity: activePane === "about" ? 1 : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="absolute inset-0 flex flex-col"
              >
                {/* Back button */}
                <button
                  onClick={() => setActivePane("main")}
                  className="flex items-center gap-2 py-3 mb-4 text-sm font-bold text-muted hover:text-[var(--color-ink)] cursor-pointer focus:outline-none w-fit"
                >
                  <ChevronLeft size={16} />
                  <span>Back to Menu</span>
                </button>

                <nav aria-label="About submenu links" className="flex-1 overflow-y-auto">
                  <div className="flex flex-col gap-1">
                    {aboutGroupLinks.map((link) => {
                      const isSubActive = pathname.startsWith(link.href);
                      return (
                        <a
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "flex items-center justify-between py-4 border-b border-[var(--color-border)]/20 text-xl font-bold transition-colors duration-200",
                            isSubActive ? "text-[var(--color-vermillion)]" : "text-[var(--color-ink)]/80 hover:text-[var(--color-ink)]"
                          )}
                        >
                          <span>{link.label}</span>
                          <ArrowUpRight size={18} className="opacity-40" />
                        </a>
                      );
                    })}
                  </div>
                </nav>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
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

