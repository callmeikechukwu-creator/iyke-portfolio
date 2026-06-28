import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTechIconComponent } from "@/components/ui/Icons";
import { Suspense } from "react";
import { ProjectDetailSkeleton } from "@/components/ui/Skeletons";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

interface CardStyleConfig {
  bgColor: string;
  cardBorder: string;
  mockupUrl: string;
  deliverable: string;
}

const CARD_CONFIG: Record<string, CardStyleConfig> = {
  naturalist: {
    bgColor: "bg-[#162C22]", // Forest Green
    cardBorder: "border-white/5 hover:border-white/15",
    mockupUrl: "/projects/naturalist-mockup.png",
    deliverable: "interactive e-commerce"
  },
  "samc-2026": {
    bgColor: "bg-[#B2A595]", // Warm Taupe/Beige
    cardBorder: "border-white/5 hover:border-white/15",
    mockupUrl: "/projects/samc-mockup.png",
    deliverable: "registration portal"
  },
  "tsa-youth-week-26": {
    bgColor: "bg-[#D63A2F]", // Vermillion Red
    cardBorder: "border-white/5 hover:border-white/15",
    mockupUrl: "/projects/tsa-mockup.png",
    deliverable: "event analytics platform"
  },
  "goatc-cbt": {
    bgColor: "bg-[#2E3331]", // Dark Slate
    cardBorder: "border-white/5 hover:border-white/15",
    mockupUrl: "/projects/goatc-mockup.png",
    deliverable: "cbt examination system"
  }
};

const DEFAULT_CONFIG: CardStyleConfig = {
  bgColor: "bg-[#1E1C18]",
  cardBorder: "border-white/5 hover:border-white/15",
  mockupUrl: "/projects/naturalist-mockup.png",
  deliverable: "digital product case study"
};

interface CaseStudyContent {
  challenge: string;
  steps: { title: string; desc: string }[];
  impact: string;
  metrics: { label: string; value: string }[];
}

const CASE_STUDIES: Record<string, CaseStudyContent> = {
  naturalist: {
    challenge: "Naturalist, a premium plant shop, needed a high-performance e-commerce platform that matches their high-end organic brand. The existing platform was slow, had poor SEO, and lacked automated order tracking and dynamic share previews.",
    steps: [
      { title: "Modular Schema & Inventory", desc: "Designed a clean PostgreSQL schema via Prisma, separating products, checkout details, and automated shipping workflows." },
      { title: "Dynamic OG & Sharing Engine", desc: "Developed a custom Edge runtime function to generate unique product sharing preview graphics on the fly." },
      { title: "Automated Dispatch Alerts", desc: "Integrated automated transactional email dispatches using Resend and configured secure Stripe webhook listeners." }
    ],
    impact: "Naturalist launched successfully, delivering instant product shares and automated dispatch email queues with zero transaction lag.",
    metrics: [
      { label: "Performance Score", value: "98/100" },
      { label: "Page Load Speed", value: "<1.2s" },
      { label: "Automation Rate", value: "100%" }
    ]
  },
  "samc-2026": {
    challenge: "The annual SAMC conference struggled with slow, manual registration processes and ticket generation delays. They needed an automated system capable of handling high-concurrency ticket sales and delivering digital tickets instantly.",
    steps: [
      { title: "Concurrent DB Optimization", desc: "Implemented transaction locks in PostgreSQL to prevent duplicate registration rows during high traffic spikes." },
      { title: "PDF Ticket Generation Flow", desc: "Wrote a serverless Puppeteer pipeline that generates personalized ticket documents with unique QR codes." },
      { title: "Queue-based Dispatch", desc: "Utilized Redis database queues to process ticket dispatches asynchronously without delaying user checkouts." }
    ],
    impact: "SAMC processed over 2,000 attendee registrations in record time, issuing automated QR ticket check-ins instantly.",
    metrics: [
      { label: "Transaction Speed", value: "0.8s" },
      { label: "Ticket Delivery Time", value: "<3s" },
      { label: "Double Bookings", value: "0" }
    ]
  },
  "tsa-youth-week-26": {
    challenge: "The TSA Youth Week organizers needed a centralized portal to coordinate multiple events, track attendance in real-time, and analyze metrics across days.",
    steps: [
      { title: "Real-Time WebSocket Sync", desc: "Integrated a custom WebSocket relay server to synchronize attendee checks instantly across multiple check-in devices." },
      { title: "Organizers Auth Security", desc: "Implemented scrypt password hashing and atomic rate-limiting on organizers endpoints." },
      { title: "Analytics Integration", desc: "Integrated Google Analytics 4 and created a customized reporting engine exporting CSV/PDF spreadsheets." }
    ],
    impact: "TSA Youth Week organizers coordinated a highly successful event, syncing thousands of check-ins in real-time across the venue.",
    metrics: [
      { label: "Concurrent Handlers", value: "10k+" },
      { label: "Real-time Sync Latency", value: "<150ms" },
      { label: "Reports Exported", value: "100%" }
    ]
  },
  "goatc-cbt": {
    challenge: "GOATC needed a robust, cheat-resistant computer-based testing (CBT) portal that synchronizes test states in real-time, preventing progress loss on student device disconnects.",
    steps: [
      { title: "Redis Progress Cache", desc: "Designed a lightweight Redis progression cache, preserving every keyboard keystroke and question click." },
      { title: "Admin Monitor Dashboard", desc: "Created an interactive control panel for exam proctors showing live progress metrics and student activity flags." },
      { title: "Anti-Cheat Focus Lock", desc: "Integrated browser blur listeners, automatically locking the exam state if the student switches tabs or windows." }
    ],
    impact: "GOATC successfully hosted examinations for hundreds of students simultaneously, with zero lost submissions or connection issues.",
    metrics: [
      { label: "Progress Save Frequency", value: "Instant" },
      { label: "Active Test-Takers", value: "500+" },
      { label: "Lost Exam States", value: "0" }
    ]
  }
};

// Generate metadata dynamically from the DB
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await db.project.findUnique({ where: { slug } });

  if (!project) {
    return { title: "Project Not Found" };
  }

  // Returning just the title string lets Next.js layout template format it correctly as '%s | Ikechukwu Alaeto'
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.imageUrl ? [{ url: project.imageUrl }] : [],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  return (
    <Suspense fallback={<ProjectDetailSkeleton />}>
      <ProjectDetailInner slug={slug} />
    </Suspense>
  );
}

async function ProjectDetailInner({ slug }: { slug: string }) {
  const project = await db.project.findUnique({
    where: { slug },
  });

  if (!project) {
    notFound();
  }

  const config = CARD_CONFIG[project.slug] || DEFAULT_CONFIG;
  const workflow = CASE_STUDIES[project.slug];

  return (
    <div className="min-h-screen bg-[var(--color-base)] pt-[var(--navbar-height)]">
      
      {/* ── Section 1: Intro Header ── */}
      <header className="max-w-[var(--content-max-width)] mx-auto px-6 md:px-12 pt-12 md:pt-16 pb-12 flex flex-col gap-8">
        
        {/* Back Link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink transition-colors duration-300 font-body w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Works
        </Link>

        {/* Title and Short Description */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold tracking-widest text-vermillion uppercase font-body">
            {config.deliverable}
          </span>
          <h1 
            className="text-display font-extrabold tracking-tight text-ink leading-none"
            style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)" }}
          >
            {project.title}
          </h1>
          <p 
            className="text-body text-base md:text-xl leading-relaxed mt-2"
            style={{ color: "var(--color-ink)", opacity: 0.75 }}
          >
            {project.description}
          </p>
        </div>

        {/* Meta Stats row */}
        <div className="flex flex-wrap gap-8 pt-4 border-t border-border">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Role</span>
            <span className="text-sm font-semibold text-ink">Full Stack Engineering</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Stack</span>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <span key={tech} className="inline-flex items-center gap-1.5 text-xs font-medium text-ink bg-surface px-2.5 py-1 rounded-md border border-border">
                  {getTechIconComponent(tech)}
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

      </header>

      {/* ── Section 2: Full-Width 3D Mockup Showcase Banner ── */}
      <section 
        className={cn(
          "w-full py-20 md:py-32 relative overflow-hidden flex items-center justify-center border-y border-[var(--color-border)]/50",
          config.bgColor
        )}
      >
        {/* Giant Outlined / Semitransparent background wordmark */}
        <span 
          className="absolute inset-x-0 text-center text-white/5 font-extrabold uppercase select-none tracking-tighter leading-none pointer-events-none z-0"
          style={{ fontSize: "clamp(4rem, 15vw, 15rem)", letterSpacing: "-0.05em" }}
        >
          {project.title.toUpperCase()}
        </span>

        {/* Floating mock-up image frame */}
        <div className="relative z-10 max-w-[900px] w-[85%] mx-auto rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl transition-transform duration-700 hover:scale-[1.015]">
          <img
            src={config.mockupUrl}
            alt={`${project.title} detailed mockup preview`}
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* ── Section 3: Sequenced Process Workflow ── */}
      {workflow && (
        <section className="max-w-[760px] mx-auto px-6 md:px-0 py-16 md:py-28 flex flex-col gap-16">
          
          {/* Challenge Block */}
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="text-[10px] font-bold text-vermillion tracking-widest uppercase font-body">
              01 / Challenge
            </span>
            <h2 className="font-body text-3xl md:text-4xl font-black tracking-tight text-ink">
              The Problem &amp; Goals
            </h2>
            <p className="text-body text-base md:text-lg leading-relaxed text-ink/75 max-w-[600px] font-body">
              {workflow.challenge}
            </p>
          </div>

          {/* Tackle Steps List Block */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="text-[10px] font-bold text-vermillion tracking-widest uppercase font-body">
                02 / Workflow
              </span>
              <h2 className="font-body text-3xl md:text-4xl font-black tracking-tight text-ink">
                How I Tackled It
              </h2>
            </div>

            <div className="flex flex-col gap-8 mt-4">
              {workflow.steps.map((step, idx) => (
                <div key={step.title} className="flex gap-4 md:gap-6 items-start pb-6 border-b border-border last:border-b-0">
                  <span className="font-body text-xl md:text-2xl font-black text-muted/25 shrink-0 leading-none pt-0.5 tabular-nums">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-1.5 font-body">
                    <h3 className="font-body text-base md:text-lg font-bold text-ink">
                      {step.title}
                    </h3>
                    <p className="text-body text-sm md:text-base leading-relaxed text-ink/70">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Outcome & Metrics Block */}
          <div className="flex flex-col items-center gap-6 text-center">
            <span className="text-[10px] font-bold text-vermillion tracking-widest uppercase font-body">
              03 / Impact
            </span>
            <h2 className="font-body text-3xl md:text-4xl font-black tracking-tight text-ink">
              The Outcome
            </h2>
            <p className="text-body text-base md:text-lg leading-relaxed text-ink/75 max-w-[600px] font-body">
              {workflow.impact}
            </p>

            {/* Metrics grid cards */}
            <div className="grid grid-cols-3 gap-3 md:gap-5 mt-4 w-full">
              {workflow.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="
                    group relative flex flex-col items-center justify-center gap-2
                    bg-surface border border-border
                    hover:border-vermillion/40
                    rounded-2xl md:rounded-3xl
                    p-4 md:p-5
                    transition-all duration-300
                    overflow-hidden
                  "
                >
                  {/* Subtle hover glow */}
                  <div className="absolute inset-0 bg-vermillion/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-inherit" />
                  <span className="font-body text-lg sm:text-xl md:text-2xl font-black text-vermillion leading-none tracking-tight relative z-10 whitespace-nowrap">
                    {metric.value}
                  </span>
                  <span className="font-body text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-muted leading-tight text-center relative z-10">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Case Study HTML fallback if db content exists */}
          {project.body && (
            <div className="pt-12 border-t border-border">
              <article
                className="prose prose-neutral max-w-none text-body text-ink/80 leading-relaxed font-body"
                dangerouslySetInnerHTML={{ __html: project.body }}
              />
            </div>
          )}

          {/* Bottom Action Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-12 border-t border-border w-full">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-case-study-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-bold font-body shadow-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
                style={{ color: "var(--color-base)", backgroundColor: "var(--color-ink)" }}
              >
                View Live Demo
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-case-study-outline inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-bold font-body transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
                style={{ color: "var(--color-ink)", borderColor: "var(--color-border-strong)" }}
              >
                View Codebase
              </a>
            )}
          </div>

        </section>
      )}

    </div>
  );
}
