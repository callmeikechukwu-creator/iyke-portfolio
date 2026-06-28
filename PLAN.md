# IYKE PORTFOLIO — MASTER BUILD PLAN
> Single source of truth for the complete redesign and rebuild.
> Every decision made in planning is documented here before a single line of code is written.
> Last updated: June 25, 2026

---

## 0. PHILOSOPHY

This is not a refresh. This is a full teardown and rebuild from the ground up.
Every existing component, page, style, and content block is deleted and replaced.
The goal is a portfolio that feels like a **living, breathing creative identity** —
not a template. Every animation has a purpose. Every spacing decision is intentional.
Every font weight carries meaning. This site should make someone stop scrolling
and say "who built this?"

---

## 1. DESIGN SYSTEM

### 1.1 Typography

Three fonts. Three distinct roles. Zero overlap.

| Font | Role | Source | Notes |
|---|---|---|---|
| **BBH Bogle** | Logo / Wordmark only | Google Fonts | Condensed, all-caps. Used exclusively for the "IA" monogram and "IKECHUKWU ALAETO" wordmark |
| **Stack Sans Notch** | Display / Headings | Google Fonts (variable) | All hero text, section titles, large typographic moments. Weights 200–700 |
| **PP Mori** | Body / UI / Everything else | Already in /public/fonts/Mori/ | Navigation links, body copy, labels, captions, form fields, buttons |

**Typography Scale (fluid, using clamp()):**
```css
--text-xs:    clamp(0.75rem, 1vw, 0.875rem)      /* captions, labels */
--text-sm:    clamp(0.875rem, 1.2vw, 1rem)        /* small body */
--text-base:  clamp(1rem, 1.5vw, 1.125rem)        /* body */
--text-lg:    clamp(1.125rem, 2vw, 1.5rem)        /* large body / lead */
--text-xl:    clamp(1.5rem, 3vw, 2rem)            /* small headings */
--text-2xl:   clamp(2rem, 4vw, 3rem)              /* section subtitles */
--text-3xl:   clamp(3rem, 6vw, 5rem)              /* section titles */
--text-hero:  clamp(5rem, 12vw, 11rem)            /* hero display text */
--text-giant: clamp(8rem, 18vw, 18rem)            /* full-bleed typographic moments */
```

**Line heights:**
- Display/Hero: 0.9 – 0.95 (tight, intentional)
- Section headings: 1.0 – 1.1
- Body: 1.6 – 1.7
- UI/Labels: 1.2

**Letter spacing:**
- Display (Stack Sans Notch): -0.03em to -0.05em (tight)
- Body (PP Mori): 0 (natural)
- Labels/Caps: 0.08em – 0.12em (open)

---

### 1.2 Color Palette

**Light Mode (primary):**

| Token | Name | Hex | Usage |
|---|---|---|---|
| `--color-base` | Bone | `#F0EDE6` | Primary page background |
| `--color-surface` | Parchment | `#FAF8F4` | Cards, elevated surfaces, alternating sections |
| `--color-vermillion` | Vermillion | `#D63A2F` | Primary accent — CTAs, active states, highlights, hover states |
| `--color-amber` | Amber | `#E8A020` | Secondary accent — tags, badges, decorative elements |
| `--color-ink` | Charcoal | `#1A1814` | All primary text |
| `--color-muted` | Warm Grey | `#8C887F` | Secondary text, captions, placeholder text |
| `--color-border` | Subtle Border | `#E0DAD0` | Card borders, dividers, subtle separators |
| `--color-border-strong` | Strong Border | `#C8C0B0` | Emphasized dividers |

**Dark Mode (built-in from day one, togglable):**

| Token | Name | Hex | Usage |
|---|---|---|---|
| `--color-base` | Deep Charcoal | `#111009` | Primary dark background |
| `--color-surface` | Dark Stone | `#1E1C18` | Dark cards/surfaces |
| `--color-vermillion` | Vermillion (same) | `#D63A2F` | Stays the same — it pops on dark too |
| `--color-amber` | Amber (same) | `#E8A020` | Stays the same |
| `--color-ink` | Bone | `#F0EDE6` | Text inverts to bone on dark |
| `--color-muted` | Muted Light | `#6B6760` | Dark mode secondary text |
| `--color-border` | Dark Border | `#2A2820` | Dark mode subtle borders |
| `--color-border-strong` | Dark Border Strong | `#3A3830` | Dark mode emphasized borders |

---

### 1.3 Spacing System

Base unit: 4px (0.25rem)

```
space-1:  4px    space-2:  8px    space-3:  12px   space-4:  16px
space-5:  20px   space-6:  24px   space-8:  32px   space-10: 40px
space-12: 48px   space-16: 64px   space-20: 80px   space-24: 96px
space-32: 128px  space-40: 160px  space-48: 192px
```

Section padding (vertical): `clamp(5rem, 10vw, 10rem)` on all major sections.
Max content width: `1400px` with `padding-inline: clamp(1.5rem, 5vw, 5rem)`

---

### 1.4 Motion & Easing

| Name | Curve | Used For |
|---|---|---|
| `--ease-smooth` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | General transitions |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances, reveals |
| `--ease-in-out-quad` | `cubic-bezier(0.45, 0, 0.55, 1)` | Hover states |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Magnetic elements, playful pops |

**Duration tokens:**
- Fast: 150ms (hover micro-interactions)
- Base: 300ms (standard transitions)
- Medium: 600ms (reveals, entrances)
- Slow: 900ms (page transitions, major reveals)
- Cinematic: 1200ms+ (hero animations, pinned sequences)

---

## 2. LOGO & BRAND IDENTITY

### 2.1 Logo Concept

**Full wordmark:** "IKECHUKWU ALAETO" in BBH Bogle (all-caps, condensed)
- Used on: loading screen, footer
- Color: Charcoal on light / Bone on dark

**Compact monogram:** "IA"
- The letter **I** is tilted/slanted to match the angle of the left arm of the letter **A**
- They form a ligature-like pair — the "I" leans into the "A"
- Used on: navbar (compact state after scroll), favicon, social
- This SVG monogram is custom-drawn, not generated from a font

### 2.2 Navbar Logo Behavior (Anthropic-style)
- **At top of page:** Full wordmark "IKECHUKWU ALAETO" in BBH Bogle, moderate size
- **After scrolling past hero:** Transitions to compact "IA" monogram
- Transition: smooth scale + opacity cross-fade, not a jump
- GSAP or CSS transition handles the swap

---

## 3. SITE ARCHITECTURE

### 3.1 Pages

```
/ (Home)              — Main portfolio page, all sections
/projects/[slug]      — Individual project case study
/resume               — Resume/CV page (already exists, needs redesign)
/admin                — Admin dashboard (keep existing, not redesigned now)
/api/*                — All API routes remain untouched
```

### 3.2 Homepage Section Order

```
1. NAVBAR             — Fixed, transparent → solid on scroll
2. HERO               — Full viewport, cinematic entrance
3. ABOUT              — Who I am, philosophy, quick stats
4. PROJECTS           — Selected works, case studies
5. SKILLS             — Technical stack, capabilities
6. EXPERIENCE         — Timeline/accordion
7. CONTACT            — Form + direct contact info
8. FOOTER             — Wordmark, links, copyright
```

---

## 4. SECTION-BY-SECTION DESIGN SPEC

### 4.1 NAVBAR

**Structure:**
- Fixed position, full width
- Left: Logo (wordmark → monogram on scroll)
- Right: Nav links (desktop) + Hamburger pill button (mobile)

**Desktop behavior:**
- Background: transparent at top, transitions to `--color-surface/80` with `backdrop-filter: blur(12px)` on scroll
- Nav links in PP Mori, medium weight
- Hover effect: Adam Hartwig-style vertical slide
  - Each link has two text layers stacked
  - On hover: top layer slides up out of view, bottom layer slides up into view
  - Both layers are the same text but the bottom one is in `--color-vermillion`
  - Achieved with `overflow: hidden` on the link container + CSS/GSAP transform

**Mobile behavior:**
- Hamburger pill button (pill-shaped, bordered)
- On click: full-screen overlay panel slides down from top
- Inside: large BBH Bogle nav links stacked vertically (CRAV-style)
- Background: deep vermillion (`#D63A2F`) with bone text
- "Est. 2022 — Ibadan, Nigeria" at the bottom in small PP Mori caps
- Close button in top right

**Scroll transitions:**
- `scrollY === 0`: transparent background, full wordmark logo
- `scrollY > 80`: surface background + blur, monogram logo
- All transitions: 400ms ease-out-expo

---

### 4.2 HERO SECTION

**Concept:** Full viewport takeover. The name dominates everything.

**Layout:**
- Background: `--color-base` (bone)
- Giant display text: "IKECHUKWU" on line 1, "ALAETO" on line 2
- Font: Stack Sans Notch, bold weight, tight tracking
- Size: `clamp(6rem, 14vw, 14rem)` — text fills ~80% of viewport width
- Text color: `--color-ink` with a subtle vermillion text-stroke or outline on select letters (optional, decide later)

**Supporting elements:**
- Small label above name: "FULL STACK DEVELOPER — IBADAN, NIGERIA" in PP Mori caps, small, tracked wide, `--color-muted`
- Below name: single-line descriptor that rotates/types (optional — a line about building things)
- Bottom left: scroll indicator (animated downward arrow or "SCROLL" text that bobs)
- Bottom right: availability status pill — "AVAILABLE FOR WORK" with a pulsing green dot

**Entrance animation (page load sequence):**
1. Page loader plays first (see 4.0 below)
2. After loader exits: label fades up (opacity 0→1, translateY 20px→0, 600ms)
3. "IKECHUKWU" splits into characters, each one clips up from below with stagger (40ms between each char)
4. "ALAETO" does the same, staggered 200ms after line 1
5. Supporting elements fade in last (descriptor, scroll indicator, status pill)
6. Total entrance: ~2 seconds from loader exit

**Scroll behavior:**
- As user scrolls, hero text very slowly parallaxes upward at 0.3x scroll speed
- Text opacity fades subtly as it leaves viewport

---

### 4.0 PAGE LOADER

**Concept:** Cinematic, not a percentage counter.

**Behavior:**
1. On page load: full-screen overlay in `--color-ink` (deep charcoal)
2. Center of screen: "IKECHUKWU ALAETO" in BBH Bogle, bone color, animates in letter by letter
3. Then: the wordmark scales up and the background does a circular clip-path wipe (circle expands from center, revealing the page beneath)
4. Alternatively: the overlay splits vertically (left panel slides left, right panel slides right) — "curtain open" effect
5. Duration: 1.8–2.2 seconds total. Fast enough to not frustrate, slow enough to be cinematic.
6. Only plays on first load (sessionStorage flag — doesn't replay on navigation)

---

### 4.3 ABOUT SECTION

**Concept:** Editorial. Left/right split. Text-heavy but beautifully spaced.

**Layout:**
- Background: `--color-surface` (parchment) — creates visual break from hero
- Left column (sticky): Section label + large section number "01" in Stack Sans Notch, very large, `--color-border` (decorative, almost watermark-like)
- Right column: Scrollable content
  - Opening statement: large PP Mori, ~1.5rem, `--color-ink`
  - Two paragraphs of body text
  - Three stat cards in a row: "3+ Years", "5+ Projects", "100% Dynamic Stack"
  - Stat cards: clean, minimal, bordered

**Animations:**
- Section number "01" parallaxes slightly as you scroll through
- Text paragraphs reveal word by word (GSAP SplitText) as you scroll into view
- Stat numbers count up from 0 when they enter viewport

**Profile photo:**
- Circular, right side of layout or integrated into a card
- Placeholder for now: abstract geometric shape or initials in a styled container
- When photo is ready: object-fit cover, slight grayscale → color on hover

---

### 4.4 PROJECTS SECTION

**Concept:** Case studies, not cards. Each project gets real estate and presence.

**Layout:**
- Background: `--color-base` (bone)
- Section header: "SELECTED WORKS" in Stack Sans Notch + project count
- Projects displayed as large numbered list items OR large horizontal cards
- Each project card:
  - Large project number (01, 02, 03...) in Stack Sans Notch, giant, muted
  - Project title in Stack Sans Notch, bold
  - Short description in PP Mori
  - Tech stack as small pills
  - Hover: card background shifts to vermillion, text inverts to bone
  - Arrow icon that animates on hover (slides right)
  - Links to /projects/[slug] for full case study

**Animations:**
- On scroll into view: each project card slides up from 40px below with fade
- Stagger between cards: 100ms
- Hover: 300ms smooth background fill (not a jump — fills from left using pseudo-element)

---

### 4.5 SKILLS SECTION

**Concept:** Confident display of technical mastery. Not a boring list.

**Layout:**
- Background: `--color-ink` (dark section — creates contrast in the page rhythm)
- Text: bone on dark
- Large heading: "CAPABILITIES" in Stack Sans Notch
- Skills displayed as large scrolling horizontal ticker tape (marquee) OR as a grid of large text items
- Preferred: Two rows of skills, each row scrolls in opposite directions (infinite marquee)
  - Row 1 scrolls left: Next.js · TypeScript · React · Prisma · PostgreSQL · ...
  - Row 2 scrolls right: Node.js · Express · Redis · MongoDB · Socket.io · ...
- Below ticker: 4 category cards (Frontend, Backend, Database, DevOps) in a 2x2 grid

**Animations:**
- Marquee: CSS animation, `animation: scroll-left 20s linear infinite`
- Category cards: fade up on scroll with stagger

---

### 4.6 EXPERIENCE SECTION

**Concept:** Timeline with weight. Each role has presence.

**Layout:**
- Background: `--color-surface`
- Left: vertical timeline line in `--color-border`
- Each experience item: left side has year/period, right side has role details
- Expanded/collapsed accordion — click to expand bullet points
- Active item: left border becomes vermillion

**Animations:**
- Timeline line draws itself downward as you scroll (SVG stroke-dashoffset animation)
- Each experience card fades and slides in from right as timeline reaches it

---

### 4.7 CONTACT SECTION

**Concept:** Warm, inviting. Not a cold form.

**Layout:**
- Background: `--color-base`
- Large heading: "LET'S BUILD SOMETHING" in Stack Sans Notch
- Left: Personal message, email link, location
- Right: Contact form (name, email, message, submit)
- Submit button: large pill, vermillion fill, bone text

**Animations:**
- Heading animates in with word-by-word reveal
- Form fields slide up with stagger on scroll

---

### 4.8 FOOTER

**Concept:** Clean, confident. The wordmark gets one last moment.

**Layout:**
- Background: `--color-ink`
- Top: Full "IKECHUKWU ALAETO" wordmark in BBH Bogle, giant, bone — decorative, fills the footer width
- Below: Two columns — left: tagline, right: nav links
- Bottom strip: copyright + "Built with Next.js" + social links

---

## 5. ANIMATION MASTER PLAN

### 5.1 Tools
- **GSAP** (already installed): Timeline control, ScrollTrigger, SplitText
- **Lenis** (already installed): Smooth scroll with physical inertia
- **CSS** `@keyframes`: Marquee animations, simple loops
- **CSS** `clip-path`: Section reveal wipes

### 5.2 Animation Inventory

| Animation | Type | Trigger | GSAP/CSS |
|---|---|---|---|
| Page loader exit | Clip-path wipe / curtain | Auto on load complete | GSAP |
| Hero name entrance | Character-by-character clip reveal | After loader | GSAP SplitText |
| Navbar logo condensation | Opacity/scale swap | scrollY > 80 | CSS transition |
| Navbar hover slide | Vertical text slide | Hover | CSS transform |
| Mobile menu open/close | Slide down from top | Click | GSAP |
| Section headings | Word-by-word reveal | ScrollTrigger enter | GSAP SplitText |
| About text reveal | Word fade-in stagger | ScrollTrigger enter | GSAP |
| Stat counter | Number count up | ScrollTrigger enter | GSAP |
| Section number parallax | Slow upward drift | Scroll position | GSAP ScrollTrigger |
| Project card entrance | Slide up + fade | ScrollTrigger enter | GSAP |
| Project card hover fill | Background fill left→right | Hover | CSS pseudo-element |
| Skills marquee | Infinite horizontal scroll | Auto | CSS animation |
| Timeline line draw | SVG stroke reveal | ScrollTrigger | GSAP |
| Experience card entrance | Slide from right | ScrollTrigger | GSAP |
| Contact heading reveal | Word-by-word | ScrollTrigger | GSAP |
| Footer wordmark entrance | Character stagger | ScrollTrigger | GSAP |
| Smooth scroll | Physical inertia on all scroll | Global | Lenis |
| Dark/light mode toggle | Color token swap | Click | CSS data-theme + transition |

### 5.3 Performance Rules
- All GSAP contexts cleaned up in `useEffect` return (`ctx.revert()`)
- `will-change: transform` only on actively animating elements, removed after
- No animation on `prefers-reduced-motion: reduce` (implement media query check)
- Lazy load all GSAP ScrollTrigger plugins
- Images: Next.js `<Image>` with `loading="lazy"` except hero/above-fold

---

## 6. RESPONSIVENESS SPEC

### 6.1 Breakpoints

```css
--bp-sm:  480px   /* large phones */
--bp-md:  768px   /* tablets */
--bp-lg:  1024px  /* small laptops */
--bp-xl:  1280px  /* desktops */
--bp-2xl: 1536px  /* large screens */
```

### 6.2 Rules Per Component

**Navbar:**
- Mobile (<768px): Logo left, hamburger right. No visible nav links.
- Desktop (≥768px): Logo left, nav links right.

**Hero:**
- Mobile: Name still large but `clamp(4rem, 14vw, 14rem)` scales down naturally.
- Text stays left-aligned on mobile (not centered).
- Scroll indicator hidden on mobile.

**About:**
- Mobile: Single column. Sticky left col becomes normal flow header.
- Stats: 2-column grid on mobile, 3-column on desktop.

**Projects:**
- Mobile: Single column stack.
- Desktop: Can be 2-column or single column depending on final design choice.

**Skills:**
- Marquee works on all screen sizes.
- Category cards: 2-column on mobile, 4-column on desktop.

**Experience:**
- Mobile: Timeline line hidden. Cards stack vertically.
- Desktop: Left/right split with timeline.

**Contact:**
- Mobile: Single column, form below text.
- Desktop: Side by side.

### 6.3 Touch Considerations
- All hover states have active/focus equivalents for touch
- Hamburger menu tap target: minimum 44x44px
- Form inputs: minimum 48px height
- No hover-only interactions that hide critical information on mobile

---

## 7. TECHNICAL ARCHITECTURE

### 7.1 File Structure (what we're building toward)

```
src/
├── app/
│   ├── (portfolio)/
│   │   ├── layout.tsx          ← Portfolio shell (Navbar + PageLoader)
│   │   ├── page.tsx            ← Homepage (imports all sections)
│   │   └── projects/
│   │       └── [slug]/
│   │           └── page.tsx    ← Project detail page
│   ├── admin/                  ← Untouched
│   ├── api/                    ← Untouched
│   ├── resume/                 ← Needs redesign later
│   ├── globals.css             ← COMPLETE REWRITE (design tokens, fonts, base)
│   └── layout.tsx              ← Root layout (Lenis provider)
├── components/
│   ├── animations/
│   │   ├── PageLoader.tsx      ← COMPLETE REWRITE (cinematic)
│   │   ├── SplitText.tsx       ← NEW: reusable text split component
│   │   ├── ScrollReveal.tsx    ← NEW: reusable scroll reveal wrapper
│   │   └── LenisProvider.tsx   ← NEW: Lenis smooth scroll provider
│   ├── layout/
│   │   ├── Navbar.tsx          ← COMPLETE REWRITE
│   │   └── Footer.tsx          ← NEW
│   ├── sections/
│   │   ├── Hero.tsx            ← NEW
│   │   ├── About.tsx           ← COMPLETE REWRITE
│   │   ├── Projects.tsx        ← COMPLETE REWRITE
│   │   ├── Skills.tsx          ← COMPLETE REWRITE
│   │   ├── Experience.tsx      ← COMPLETE REWRITE
│   │   └── Contact.tsx         ← COMPLETE REWRITE (replaces ContactForm.tsx)
│   └── ui/
│       ├── ProjectCard.tsx     ← COMPLETE REWRITE
│       ├── Button.tsx          ← NEW: reusable button component
│       ├── Tag.tsx             ← NEW: tech stack tags
│       └── Logo.tsx            ← NEW: SVG monogram + wordmark component
└── lib/
    ├── db.ts                   ← Untouched
    ├── utils.ts                ← Untouched
    └── animations.ts           ← NEW: shared GSAP animation presets
```

### 7.2 Font Loading Strategy

**BBH Bogle:** Via `next/font/google` (Google Fonts)
**Stack Sans Notch:** Via `next/font/google` (Google Fonts, variable)
**PP Mori:** Via `@font-face` in globals.css (local files in /public/fonts/Mori/)

All fonts: `font-display: swap` to prevent invisible text during load.

### 7.3 CSS Architecture

- **Tailwind v4** for utility classes (already configured)
- **CSS custom properties** (design tokens) in `:root` and `[data-theme="dark"]`
- **globals.css** owns: tokens, font-face, base resets, component-level CSS where Tailwind is insufficient
- **No inline styles** except for GSAP-driven dynamic values

---

## 8. CONTENT PLAN

All copy is being rewritten. Nothing from the current site carries over verbatim.

### 8.1 Hero
- Name: Ikechukwu Alaeto (display, dominant)
- Label: "Full Stack Developer"
- Location: "Ibadan, Nigeria"
- One-liner: TBD — something that captures the "builds things that matter" energy

### 8.2 About
- Opening statement: Powerful, first-person, direct. Not corporate.
- Philosophy paragraph: What drives the work. Performance + visual excellence + reliability.
- Stack paragraph: What specifically is being built with right now.
- Stats: 3+ Years / 5+ Projects / 100% Server-Dynamic

### 8.3 Projects (from database — no hardcoding)
Four initial projects from existing DB seed:
1. Naturalist — e-commerce platform
2. SAMC 2026 — Conference registration
3. TSA Youth Week 26 — Event management
4. GOATC CBT — Computer-based testing

Each gets a full case study page at /projects/[slug]

### 8.4 Skills
Exact skills from existing Skills.tsx component — those are accurate.
Presented differently (marquee + cards) but same data.

### 8.5 Experience
Same two roles from existing Experience.tsx — content is accurate.
Visual treatment changes completely.

### 8.6 Contact
Email: careers@picsible.com
Location: Ibadan, Nigeria (GMT+1)
Message: TBD — warm, human, inviting

---

## 9. BUILD ORDER

We build in this exact sequence. Each phase is complete before the next begins.

### Phase 1 — Foundation (do first)
- [ ] Delete all existing component code (keep file structure, wipe content)
- [ ] Rewrite `globals.css` — tokens, fonts, base styles
- [ ] Set up font loading (BBH Bogle + Stack Sans Notch via next/font, PP Mori via @font-face)
- [ ] Create `LenisProvider.tsx` and wire it into root layout
- [ ] Create `animations.ts` shared presets
- [ ] Create `Logo.tsx` component (SVG monogram + wordmark)

### Phase 2 — Navbar
- [ ] Build new `Navbar.tsx` from scratch
- [ ] Desktop: transparent → blur on scroll, logo condensation, hover slide effect
- [ ] Mobile: hamburger pill, full-screen overlay menu, CRAV-style

### Phase 3 — Page Loader
- [ ] Rewrite `PageLoader.tsx`
- [ ] Cinematic entrance: wordmark animates in, curtain wipe exits
- [ ] sessionStorage flag to prevent replay on navigation

### Phase 4 — Hero Section
- [ ] Build `Hero.tsx`
- [ ] Giant name display, entrance animation sequence
- [ ] Scroll indicator, availability status, parallax on scroll

### Phase 5 — About Section
- [ ] Build `About.tsx`
- [ ] Editorial layout, sticky section number, split text reveals
- [ ] Stat counters, profile placeholder

### Phase 6 — Projects Section
- [ ] Build `Projects.tsx` and rewrite `ProjectCard.tsx`
- [ ] Numbered list/card design, hover fill animation
- [ ] Connects to existing DB via server component

### Phase 7 — Skills Section
- [ ] Rewrite `Skills.tsx`
- [ ] Marquee rows, category cards
- [ ] Dark background section

### Phase 8 — Experience Section
- [ ] Rewrite `Experience.tsx`
- [ ] SVG timeline draw animation, accordion cards

### Phase 9 — Contact Section
- [ ] Rewrite `Contact.tsx`
- [ ] Keeps existing API route (`/api/contact`) — just new UI

### Phase 10 — Footer
- [ ] Build `Footer.tsx`
- [ ] Giant wordmark, links, copyright

### Phase 11 — Project Detail Page
- [ ] Rewrite `/projects/[slug]/page.tsx`
- [ ] Full case study layout

### Phase 12 — Dark Mode
- [ ] Wire up dark mode toggle in Navbar
- [ ] Test all tokens in dark mode
- [ ] Adjust any colors that don't work in dark

### Phase 13 — Polish & Performance
- [ ] `prefers-reduced-motion` check for all animations
- [ ] Lighthouse audit — target 90+ performance
- [ ] Cross-browser test (Chrome, Firefox, Safari)
- [ ] Mobile test on real device
- [ ] Meta tags, OG images, sitemap (already has robots.ts + sitemap.ts)

---

## 10. DECISIONS LOG

| Date | Decision | Reason |
|---|---|---|
| June 25, 2026 | Full teardown, no content carries over | Generic foundation doesn't represent Iyke's brand |
| June 25, 2026 | BBH Bogle for logo only | Great at large display sizes, all-caps condensed works perfectly for wordmark |
| June 25, 2026 | Stack Sans Notch for display | Variable, distinctive notch detail, premium feel |
| June 25, 2026 | PP Mori for body | Already owned, Japanese-inspired gothic, quiet character |
| June 25, 2026 | Option C palette (bone/vermillion/amber/charcoal) | Warm, editorial, distinctive without being loud |
| June 25, 2026 | Light mode primary, dark mode built-in | Preference stated, dark mode tokens set from day one |
| June 25, 2026 | "IA" monogram with tilted I | Clever typographic ligature — I leans into A's left arm |
| June 25, 2026 | Anthropic-style logo condensation on scroll | Adds polish, saves navbar space, rewarding detail |
| June 25, 2026 | GSAP + Lenis (already installed) | No new dependencies needed for animation layer |
| June 25, 2026 | Mobile-first, fluid typography with clamp() | Complete responsiveness from day one |

---

## 11. OPEN QUESTIONS (to decide before or during build)

- [ ] Hero one-liner: What exact phrase captures your brand? (e.g. "I build things that feel alive" / "Engineering at the edge of beautiful" — you decide)
- [ ] Profile photo: Placeholder strategy until real photo is ready
- [ ] Availability status: "Available for work" — is this accurate right now?
- [ ] Social links: GitHub confirmed. LinkedIn? Twitter/X? Any others?
- [ ] Blog: Was mentioned in previous session. Scope for later — not in this build phase.
- [ ] "IA" monogram: Final SVG needs to be drawn/designed before Phase 1. Can be done in code as SVG or as an actual asset file.
- [ ] Resume page: Redesign is out of scope for current phases — focus on homepage first.
- [ ] Admin dashboard: Untouched. Confirm this stays as-is.

---

*This document is the contract between planning and execution.
Nothing gets built that isn't in this plan.
Nothing in this plan gets skipped.*
