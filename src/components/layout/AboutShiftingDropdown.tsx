"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiNodedotjs,
  SiTailwindcss,
  SiPostgresql,
} from "react-icons/si";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────
   ABOUT SHIFTING DROPDOWN
   ONE hover-triggered nav item ("About") that opens a single
   panel. Inside the open panel, three small tabs (About / Skills
   / Experience) switch content via click. The panel auto-animates
   both width AND height to hug whichever tab's content is active,
   measured via hidden refs (not mid-transition DOM reads).

   Desktop-only (hover-driven). Close has a short delay so a
   shaky mouse crossing the gap between trigger and panel doesn't
   slam it shut.
───────────────────────────────────────────────────────────── */

type TabId = 1 | 2 | 3;
const CLOSE_DELAY = 150; // ms

const TABS: { id: TabId; title: string; Component: React.ComponentType }[] = [
  { id: 1 as TabId, title: "Overview", Component: AboutTeaser },
  { id: 2 as TabId, title: "Skills", Component: SkillsTeaser },
  { id: 3 as TabId, title: "Experience", Component: ExperienceTeaser },
];

export default function AboutShiftingDropdown({
  menuOpen,
  isActiveGroup,
  hoveredItem,
  setHoveredItem,
  activeItem,
}: {
  /** true when the mobile hamburger overlay is open (recolor to sit on vermillion) */
  menuOpen: boolean;
  /** true if current route is /about, /skills, or /experience */
  isActiveGroup: boolean;
  hoveredItem: string | null;
  setHoveredItem: (val: string | null) => void;
  activeItem: string;
}) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>(1);
  const [dir, setDir] = useState<"l" | "r" | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const itemHref = "about";
  const isCurrentHighlight = hoveredItem === itemHref || (hoveredItem === null && activeItem === itemHref);
  const isActive = activeItem === itemHref;

  let textColorClass = "text-muted";
  if (isCurrentHighlight) {
    if (hoveredItem === null && activeItem === itemHref) {
      textColorClass = "text-[var(--color-base)]";
    } else {
      textColorClass = "text-[var(--color-ink)]";
    }
  } else if (isActive) {
    textColorClass = "text-[var(--color-ink)]";
  }

  function clearCloseTimer() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function scheduleClose() {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY);
  }

  function handleTabChange(id: TabId) {
    setDir(activeTab > id ? "r" : activeTab < id ? "l" : null);
    setActiveTab(id);
  }

  useEffect(() => () => clearCloseTimer(), []);

  return (
    <div
      onMouseEnter={() => {
        clearCloseTimer();
        setOpen(true);
        setHoveredItem(itemHref);
      }}
      onMouseLeave={scheduleClose}
      className="relative flex h-fit"
    >
      {/* ── Single trigger ── */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
        className={cn(
          "group relative flex items-center gap-1 py-2 px-4 rounded-full text-sm font-semibold select-none cursor-pointer transition-colors duration-200 focus:outline-none focus-visible:outline-none",
          textColorClass
        )}
      >
        <span className="relative z-10 flex items-center gap-1">
          <span>About</span>
          {/* Sleek Morphing Chevron */}
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            className="ml-1 text-current shrink-0"
          >
            <motion.path
              d={open ? "M1 4.5L5 1.5L9 4.5" : "M1 1.5L5 4.5L9 1.5"}
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ d: open ? "M1 4.5L5 1.5L9 4.5" : "M1 1.5L5 4.5L9 1.5" }}
              transition={{ type: "spring", stiffness: 350, damping: 22 }}
            />
          </svg>
        </span>
        {isCurrentHighlight && (
          <motion.div
            layoutId="navbar-capsule"
            className={cn(
              "absolute inset-0 rounded-full z-0",
              hoveredItem === null && activeItem === itemHref
                ? "bg-[var(--color-ink)]"
                : "bg-[var(--color-ink)]/[0.06]"
            )}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          />
        )}
      </div>

      <AnimatePresence>
        {open && (
          <Panel
            activeTab={activeTab}
            dir={dir}
            onTabChange={handleTabChange}
            onMouseEnter={clearCloseTimer}
            onMouseLeave={scheduleClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Panel: auto-sizes to active tab's natural width/height ──── */

function Panel({
  activeTab,
  dir,
  onTabChange,
  onMouseEnter,
  onMouseLeave,
}: {
  activeTab: TabId;
  dir: "l" | "r" | null;
  onTabChange: (id: TabId) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  // Hidden measurement refs — one per tab, rendered off-screen so
  // we can read natural size BEFORE animating to it (never mid-transition).
  const measureRefs = useRef<Record<TabId, HTMLDivElement | null>>({
    1: null,
    2: null,
    3: null,
  });
  const [sizes, setSizes] = useState<Record<TabId, { w: number; h: number }>>({
    1: { w: 480, h: 220 },
    2: { w: 480, h: 220 },
    3: { w: 480, h: 220 },
  });

  useLayoutEffect(() => {
    const next: Record<TabId, { w: number; h: number }> = { ...sizes };
    let changed = false;
    (Object.keys(measureRefs.current) as unknown as TabId[]).forEach((id) => {
      const el = measureRefs.current[id];
      if (el) {
        const w = Math.ceil(el.scrollWidth);
        const h = Math.ceil(el.scrollHeight);
        if (w !== next[id].w || h !== next[id].h) {
          next[id] = { w, h };
          changed = true;
        }
      }
    });
    if (changed) setSizes(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const target = sizes[activeTab];
  const ActiveComponent = TABS.find((t) => t.id === activeTab)?.Component;

  return (
    <motion.div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute left-1/2 -translate-x-1/2 top-[calc(100%_+_12px)] z-10"
    >
      {/* Bridge closes the hover gap between trigger and panel */}
      <div className="absolute -top-3 left-0 right-0 h-3" />

      {/* Animated SVG Pointer Nub (connector) */}
      <motion.svg
        aria-hidden="true"
        width="16"
        height="8"
        viewBox="0 0 16 8"
        fill="none"
        initial={{ opacity: 0, scale: 0, y: 3 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0, y: 3 }}
        transition={{ type: "spring", stiffness: 320, damping: 28, delay: 0.05 }}
        className="absolute left-1/2 -translate-x-1/2 -top-[7px] z-20 pointer-events-none origin-bottom"
      >
        <path
          d="M0 8L8 0L16 8"
          stroke="var(--color-border)"
          strokeWidth="1.2"
          fill="var(--color-surface)"
        />
      </motion.svg>

      {/* Auto-sizing frame */}
      <motion.div
        animate={{ width: target.w, height: target.h }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className={cn(
          "overflow-hidden rounded-2xl",
          "border border-[var(--color-border)] bg-[var(--color-surface)]",
          "shadow-[var(--shadow-lg)]"
        )}
      >
        <div className="w-max p-8">
          {/* Internal tab switcher */}
          <div className="mb-6 flex justify-center w-full">
            <div className="inline-flex gap-1 rounded-full bg-[var(--color-ink)]/[0.05] p-1.5">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onTabChange(t.id)}
                  className="relative rounded-full px-5 py-2 text-sm font-semibold whitespace-nowrap transition-colors duration-200 focus:outline-none focus-visible:outline-none"
                >
                  <span
                    className={cn(
                      "relative z-10 transition-colors duration-200",
                      activeTab === t.id
                        ? "text-[var(--color-base)]"
                        : "text-muted hover:text-[var(--color-ink)]"
                    )}
                  >
                    {t.title}
                  </span>
                  {activeTab === t.id && (
                    <motion.span
                      layoutId="activeTabPill"
                      className="absolute inset-0 z-0 rounded-full bg-[var(--color-ink)] shadow-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Active tab content — slides horizontally on switch */}
          <div className="relative overflow-hidden p-4 -m-4">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: dir === "l" ? 40 : dir === "r" ? -40 : 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir === "l" ? -40 : dir === "r" ? 40 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                {ActiveComponent && <ActiveComponent />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* ── Hidden measurement clones (off-screen, not interactive) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9999px] top-0 opacity-0"
      >
        {TABS.map((t) => (
          <div
            key={t.id}
            ref={(el) => { measureRefs.current[t.id] = el; }}
            className="w-max p-8"
          >
            <div className="mb-6 flex justify-center w-full">
              <div className="inline-flex gap-1 rounded-full p-1.5">
                {TABS.map((tt) => (
                  <span key={tt.id} className="rounded-full px-5 py-2 text-sm font-semibold whitespace-nowrap">
                    {tt.title}
                  </span>
                ))}
              </div>
            </div>
            <t.Component />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Tab content — About / Skills / Experience ─────────────── */

function AboutTeaser() {
  return (
    <div className="w-[28rem] md:w-[32rem]">
      <h3 className="mb-2 text-xl font-bold text-[var(--color-ink)]">
        Who I Am
      </h3>
      <p className="mb-4 text-base leading-relaxed text-muted">
        I am Ikechukwu, a full-stack developer in Ibadan, Nigeria that builds web experiences
        that turn complex problems into fast, beautiful products.
      </p>
      <Link
        href="/about"
        className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-vermillion)] hover:text-[var(--color-vermillion-hover)] transition-colors duration-200"
      >
        <span>Read full bio</span>
        <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

const SKILL_ICONS: { name: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { name: "Next.js", Icon: SiNextdotjs },
  { name: "React", Icon: SiReact },
  { name: "TypeScript", Icon: SiTypescript },
  { name: "Node.js", Icon: SiNodedotjs },
  { name: "Tailwind", Icon: SiTailwindcss },
  { name: "PostgreSQL", Icon: SiPostgresql },
];

function SkillsTeaser() {
  return (
    <div className="w-[28rem] md:w-[32rem]">
      <h3 className="mb-3 text-xl font-bold text-[var(--color-ink)]">
        My Core Stack
      </h3>
      <div className="mb-4 grid grid-cols-3 gap-3">
        {SKILL_ICONS.map(({ name, Icon }) => (
          <div
            key={name}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 transition-all duration-300 hover:border-[var(--color-ink)]/[0.2] hover:-translate-y-1 hover:scale-[1.04] hover:shadow-sm"
          >
            <Icon className="h-6 w-6 text-[var(--color-ink)]" />
            <span className="text-xs font-semibold text-[var(--color-ink)]">{name}</span>
          </div>
        ))}
      </div>
      <Link
        href="/skills"
        className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-vermillion)] hover:text-[var(--color-vermillion-hover)] transition-colors duration-200"
      >
        <span>View all skills</span>
        <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

function ExperienceTeaser() {
  return (
    <div className="w-[28rem] md:w-[32rem]">
      <h3 className="mb-2 text-xl font-bold text-[var(--color-ink)]">
        My Recent Works
      </h3>
      <ul className="mb-4 space-y-2">
        <li className="text-base text-muted flex items-start gap-2">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-vermillion)]" />
          <span>Full stack projects across Next.js, MongoDB &amp; Prisma</span>
        </li>
        <li className="text-base text-muted flex items-start gap-2">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-vermillion)]" />
          <span>Freelance builds under Iyke Visuals Studios</span>
        </li>
      </ul>
      <Link
        href="/experience"
        className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-vermillion)] hover:text-[var(--color-vermillion-hover)] transition-colors duration-200"
      >
        <span>See full timeline</span>
        <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
