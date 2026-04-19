"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
// ─── Types ───────────────────────────────────────────────────────────────────

interface NavLink {
  label: string;
  href: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

interface Step {
  emoji: string;
  name: string;
  description: string;
}

interface Testimonial {
  initials: string;
  quote: string;
  name: string;
  role: string;
  avatarColor: string;
}

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
  badge?: string;
}

interface Skill {
  name: string;
  pct: number;
}

interface RoadmapNode {
  title: string;
  subtitle: string;
  status: "done" | "active" | "todo";
  num: number;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_LINKS: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

const FEATURES: Feature[] = [
  {
    icon: "🗺️",
    title: "AI Roadmap Engine",
    description:
      "Personalized learning paths that adapt to your goal role, timeline, and weak spots — updated after every session.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: "🎙️",
    title: "Live Mock Interviews",
    description:
      "Real-time AI interviewer with instant scoring, detailed feedback, and infinite retries on every question type.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: "⚡",
    title: "Daily Execution Loop",
    description:
      "A focused 60-minute daily session system engineered to build compound momentum across weeks, not just days.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: "📊",
    title: "Skill Radar Analytics",
    description:
      "Visual breakdown of all 8 key engineering dimensions with actionable gap analysis and next-step suggestions.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: "🏆",
    title: "Leaderboards & Pods",
    description:
      "Compete with peers in your cohort, join accountability pods, and track your rank among thousands globally.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: "📄",
    title: "Resume & Portfolio Builder",
    description:
      "ATS-optimized resume templates, AI rewrite suggestions, and one-click GitHub portfolio integration.",
    color: "bg-sky-50 text-sky-600",
  },
];

const STEPS: Step[] = [
  { emoji: "📖", name: "Learn", description: "AI-curated reading with highlighted key concepts for your target role." },
  { emoji: "📺", name: "Watch", description: "Curated video lessons with auto-generated notes and smart timestamps." },
  { emoji: "🔨", name: "Build", description: "Hands-on coding task in an embedded editor. Ship real code, not tutorials." },
  { emoji: "🧠", name: "Quiz", description: "Spaced-repetition quiz to cement today's concepts into long-term memory." },
  { emoji: "🚀", name: "Ship", description: "Submit, earn XP, update your streak, and unlock tomorrow's challenge." },
];

const ROADMAP_NODES: RoadmapNode[] = [
  { title: "Databases & Indexing", subtitle: "SQL, B-trees, query optimization", status: "done", num: 1 },
  { title: "Caching Strategies", subtitle: "Redis, CDN, cache invalidation", status: "done", num: 2 },
  { title: "Distributed Systems", subtitle: "CAP theorem, Raft consensus, Paxos", status: "active", num: 3 },
  { title: "Load Balancing & Proxies", subtitle: "Nginx, HAProxy, Round-robin", status: "todo", num: 4 },
  { title: "System Design Capstone", subtitle: "Design Twitter, Uber, Netflix", status: "todo", num: 5 },
];

const SKILLS: Skill[] = [
  { name: "DSA", pct: 87 },
  { name: "System Design", pct: 72 },
  { name: "Coding Speed", pct: 90 },
  { name: "Behavioral", pct: 65 },
  { name: "SQL / DB", pct: 78 },
  { name: "Cloud / Infra", pct: 60 },
];

const TESTIMONIALS: Testimonial[] = [
  {
    initials: "AK",
    quote:
      "I spent 6 months grinding LeetCode with zero progress. Three weeks on CareerOS and I had offers from Google and Stripe. The daily loop is genuinely addictive.",
    name: "Aryan Kapoor",
    role: "SWE II @ Google · ex-startup",
    avatarColor: "bg-indigo-100 text-indigo-700",
  },
  {
    initials: "MB",
    quote:
      "The skill radar told me I was avoiding System Design. After 2 weeks of targeted sessions, I aced the Meta E5 design round. Would not have been possible without this.",
    name: "Meera Bhatt",
    role: "Staff Engineer @ Meta",
    avatarColor: "bg-violet-100 text-violet-700",
  },
  {
    initials: "RJ",
    quote:
      "CareerOS feels like having a senior engineer mentor you every single day. The AI feedback on mock interviews was more actionable than anything from paid coaching.",
    name: "Rohit Jaiswal",
    role: "Senior SWE @ Stripe",
    avatarColor: "bg-emerald-100 text-emerald-700",
  },
];

const PRICING: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    description: "Everything to get started. No credit card required.",
    features: [
      "3 daily sessions / week",
      "Basic roadmap (2 tracks)",
      "5 mock interviews / month",
      "Community access",
    ],
    cta: "Start for free",
  },
  {
    name: "Pro",
    price: "$29",
    description: "The full CareerOS experience. Everything you need to get hired.",
    features: [
      "Unlimited daily sessions",
      "AI-personalized roadmaps",
      "Unlimited mock interviews",
      "Full skill radar analytics",
      "Resume builder + AI review",
      "Focus pods (group sessions)",
    ],
    cta: "Start 14-day free trial",
    featured: true,
    badge: "Most popular",
  },
  {
    name: "Expert",
    price: "$79",
    description: "1:1 coaching, referrals, and white-glove placement support.",
    features: [
      "Everything in Pro",
      "Weekly 1:1 coaching calls",
      "Direct company referrals",
      "Offer negotiation support",
      "Job guarantee*",
    ],
    cta: "Book a call",
  },
];

const COMPANIES = ["Google", "Meta", "Stripe", "Vercel", "Linear", "Figma", "Shopify"];

// ─── Tiny Hooks ───────────────────────────────────────────────────────────────

function useScrolled(threshold = 10) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);
  return scrolled;
}

function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FadeUp({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useFadeUp();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        } ${className}`}
    >
      {children}
    </div>
  );
}

function CheckIcon({ featured }: { featured?: boolean }) {
  return (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" fill={featured ? "rgba(255,255,255,0.2)" : "#ECFDF5"} />
      <path
        d="M4.5 8l2.5 2.5 4.5-4.5"
        stroke={featured ? "white" : "#10B981"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const scrolled = useScrolled();
  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 h-16 flex items-center transition-shadow duration-200 border-b border-border bg-background/85 backdrop-blur-xl ${scrolled ? "shadow-md dark:shadow-white/5" : ""
        }`}
    >
      <div className="max-w-7xl mx-auto w-full px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 font-bold text-[1.05rem] text-foreground tracking-tight no-underline">
          <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4">
              <path d="M9 2L15.5 5.5V12.5L9 16L2.5 12.5V5.5L9 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
              <circle cx="9" cy="9" r="2.5" fill="white" />
            </svg>
          </span>
          CareerOS
        </a>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="px-3.5 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors no-underline"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link
            href="/login"
            className="hidden sm:inline-flex px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent hover:border-border transition-all no-underline"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center px-4 py-2 rounded-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 border border-indigo-700 shadow-sm shadow-indigo-200 transition-all hover:-translate-y-px no-underline"
          >
            Get started free
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroDashboardCard() {
  return (
    <div className="relative ml-4">
      {/* Floating badges */}
      <div className="absolute -top-5 right-10 z-10 flex items-center gap-2 bg-white border border-stone-100 rounded-xl px-3.5 py-2.5 shadow-lg text-sm font-semibold text-stone-900 whitespace-nowrap animate-[float_3s_ease-in-out_infinite]">
        <span>⚡</span> +240 XP earned today
      </div>
      <div className="absolute bottom-10 -left-8 z-10 flex items-center gap-2 bg-white border border-stone-100 rounded-xl px-3.5 py-2.5 shadow-lg text-sm font-semibold text-stone-900 whitespace-nowrap animate-[float_3s_ease-in-out_infinite_1.5s]">
        <span>🔥</span> 42-day streak active
      </div>

      {/* Main card */}
      <div className="bg-background border border-stone-100 rounded-2xl shadow-2xl overflow-hidden max-w-sm">
        {/* Window chrome */}
        <div className="bg-muted border-b border-stone-100 px-4 py-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
          <span className="ml-2 text-xs text-stone-400 font-mono">dashboard.careeros.app</span>
        </div>

        <div className="p-5">
          {/* Mission header */}
          <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone-300 mb-1.5">Today&apos;s mission</p>
          <h4 className="text-base font-bold text-stone-900 mb-3">System Design Foundations</h4>

          {/* Progress */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-stone-400">Step 2 of 5 — Build</span>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">40% done</span>
          </div>
          <div className="flex gap-1.5 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full relative overflow-hidden ${i <= 2 ? "bg-indigo-500" : "bg-stone-100"
                  }`}
              >
                {i === 3 && (
                  <div className="absolute inset-y-0 left-0 w-[60%] bg-indigo-300 rounded-full animate-pulse" />
                )}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: "Streak", value: "42 🔥", color: "text-indigo-600" },
              { label: "Today XP", value: "240 ⚡", color: "text-foreground" },
              { label: "Readiness", value: "87%", color: "text-emerald-600" },
            ].map((s) => (
              <div key={s.label} className="bg-muted border border-stone-100 rounded-lg p-2.5">
                <p className="text-[0.6rem] text-stone-400 font-medium mb-1">{s.label}</p>
                <p className={`text-lg font-bold font-mono leading-none ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Tasks */}
          {[
            { text: "Watch: Load Balancers", done: true },
            { text: "Read: CAP Theorem", done: true },
            { text: "Build: URL Shortener", done: false },
          ].map((task) => (
            <div
              key={task.text}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1.5 border text-sm font-medium transition-colors ${task.done
                  ? "bg-muted border-stone-100 text-stone-400"
                  : "bg-indigo-50 border-indigo-200 text-stone-900"
                }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center ${task.done ? "bg-emerald-500" : "border-2 border-stone-200"
                  }`}
              >
                {task.done && (
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className={task.done ? "line-through" : ""}>{task.text}</span>
              {task.done ? (
                <span className="ml-auto text-[0.65rem] font-semibold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-200">Done</span>
              ) : (
                <span className="ml-auto text-[0.65rem] font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Active</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section
      className="pt-36 pb-24 px-6 bg-background transition-colors duration-300"
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        backgroundBlendMode: "overlay",
      }}
    >
      <div
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        style={{ background: "linear-gradient(to bottom, transparent 70%, var(--color-background))" }}
      >
        {/* Left */}
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full px-3 py-1.5 text-xs font-medium mb-6">
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-indigo-100">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            </span>
            Now in public beta · Join 12,000+ developers
          </div>

          {/* Headline */}
          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-serif font-normal leading-[1.08] tracking-tight text-foreground mb-5">
            From Hello World
            <br />
            to{" "}
            <em className="font-serif italic not-italic text-indigo-600" style={{ fontStyle: "italic" }}>
              Hired.
            </em>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
            CareerOS is the all-in-one career acceleration platform — AI roadmaps, mock interviews, daily execution
            loops, and real-time skill tracking to land your dream role faster.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap mb-8">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-base font-semibold border border-indigo-700 shadow-[0_4px_16px_rgba(79,70,229,0.3)] hover:shadow-[0_8px_24px_rgba(79,70,229,0.35)] transition-all hover:-translate-y-0.5 no-underline"
            >
              Start your mission free
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-foreground border border-border hover:border-muted-foreground bg-background hover:bg-muted transition-all hover:-translate-y-0.5 no-underline"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
                <path d="M6.5 5.5l4 2.5-4 2.5V5.5z" fill="currentColor" />
              </svg>
              Watch demo
            </a>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3">
            <div className="flex">
              {["AK", "MB", "RJ", "TP"].map((initials, i) => (
                <div
                  key={initials}
                  className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[0.6rem] font-bold ${["bg-indigo-100 text-indigo-700", "bg-violet-100 text-violet-700", "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700"][i]
                    }`}
                  style={{ marginLeft: i === 0 ? 0 : "-8px" }}
                >
                  {initials}
                </div>
              ))}
              <div
                className="w-8 h-8 rounded-full border-2 border-white bg-rose-100 text-rose-600 flex items-center justify-center text-[0.55rem] font-bold"
                style={{ marginLeft: "-8px" }}
              >
                +8k
              </div>
            </div>
            <p className="text-sm text-stone-500">
              <strong className="text-card-foreground">2,400+</strong> hired this quarter alone
            </p>
          </div>
        </div>

        {/* Right — dashboard card */}
        <div className="hidden lg:flex justify-center items-center">
          <HeroDashboardCard />
        </div>
      </div>
    </section>
  );
}

// ─── Logos ────────────────────────────────────────────────────────────────────

function LogoStrip() {
  return (
    <div className="border-y border-stone-100 bg-stone-50 py-10 px-6">
      <p className="text-center text-[0.7rem] font-semibold uppercase tracking-widest text-stone-300 mb-6">
        Trusted by engineers now working at
      </p>
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-10 flex-wrap">
        {COMPANIES.map((c) => (
          <span
            key={c}
            className="text-lg font-bold text-stone-200 tracking-tight hover:text-muted-foreground transition-colors cursor-default"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

function Features() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <span className="inline-flex items-center gap-1.5 text-[0.75rem] font-semibold uppercase tracking-widest text-indigo-600 mb-3">
            <span className="w-5 h-0.5 bg-indigo-400 rounded-full" />
            Features
          </span>
          <h2 className="text-4xl lg:text-5xl font-serif font-normal tracking-tight text-stone-900 leading-tight mb-4">
            Everything you need to{" "}
            <em className="italic text-indigo-600">land the role.</em>
          </h2>
          <p className="text-lg text-stone-500 max-w-xl leading-relaxed">
            Stop cobbling together YouTube playlists and Notion boards. CareerOS gives you a complete, structured
            system built for getting hired fast.
          </p>
        </FadeUp>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-14">
          {FEATURES.map((f, i) => (
            <FadeUp key={f.title} delay={i * 60}>
              <div
                onClick={() => setActiveTab(i)}
                className={`p-6 rounded-2xl border cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${activeTab === i
                    ? "border-indigo-200 bg-indigo-50 shadow-md shadow-indigo-100"
                    : "border-border bg-white hover:border-border"
                  }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="text-[0.9375rem] font-semibold text-stone-900 mb-2">{f.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{f.description}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Roadmap preview */}
        <FadeUp className="mt-12">
          <div className="bg-background border border-stone-100 rounded-2xl shadow-xl overflow-hidden max-w-2xl mx-auto">
            <div className="bg-muted border-b border-stone-100 px-5 py-3 flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 h-6 bg-stone-100 rounded-md flex items-center px-3 font-mono text-xs text-stone-400">
                careeros.app/roadmap
              </div>
            </div>
            <div className="p-6">
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone-300 mb-1.5">
                AI-Generated Roadmap · Software Engineer → Senior SWE
              </p>
              <h4 className="text-base font-bold text-stone-900 mb-1">Phase 2: System Design Mastery</h4>
              <p className="text-xs text-stone-400 mb-5">Week 5–8 · Estimated 28 days remaining</p>

              <div className="divide-y divide-stone-100">
                {ROADMAP_NODES.map((node) => (
                  <div
                    key={node.title}
                    className={`flex items-center gap-4 py-3 ${node.status === "active" ? "-mx-6 px-6 bg-indigo-50 border-y border-indigo-100" : ""
                      }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border-2 ${node.status === "done"
                          ? "bg-emerald-50 border-emerald-400 text-emerald-600"
                          : node.status === "active"
                            ? "bg-indigo-50 border-indigo-500 text-indigo-600"
                            : "bg-muted border-stone-200 text-stone-400"
                        }`}
                    >
                      {node.status === "done" ? "✓" : node.status === "active" ? "→" : node.num}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-semibold ${node.status === "active" ? "text-indigo-900" : "text-stone-800"
                          }`}
                      >
                        {node.title}
                      </p>
                      <p className="text-xs text-stone-400">{node.subtitle}</p>
                    </div>
                    <span
                      className={`text-[0.65rem] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${node.status === "done"
                          ? "bg-emerald-50 text-emerald-600"
                          : node.status === "active"
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-muted text-stone-400"
                        }`}
                    >
                      {node.status === "done" ? "Completed" : node.status === "active" ? "In progress" : "Upcoming"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-stone-50">
      <div className="max-w-7xl mx-auto">
        <FadeUp className="text-center">
          <span className="inline-flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-widest text-indigo-600 mb-3">
            <span className="w-5 h-0.5 bg-indigo-400 rounded-full" />
            How it works
            <span className="w-5 h-0.5 bg-indigo-400 rounded-full" />
          </span>
          <h2 className="text-4xl lg:text-5xl font-serif font-normal tracking-tight text-stone-900 leading-tight mb-4">
            The <em className="italic text-indigo-600">five-step</em> daily loop
          </h2>
          <p className="text-lg text-stone-500 max-w-xl mx-auto leading-relaxed">
            Each 60-minute session follows the same high-retention loop — engineered to maximize learning, retention,
            and hiring velocity.
          </p>
        </FadeUp>

        {/* Steps */}
        <div className="relative mt-16">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-7 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-indigo-200 via-indigo-400 to-indigo-200" />

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {STEPS.map((step, i) => (
              <FadeUp key={step.name} delay={i * 80} className="text-center relative z-10">
                <div className="group">
                  <div className="w-14 h-14 rounded-full bg-white border-2 border-indigo-200 flex items-center justify-center mx-auto mb-4 shadow-sm shadow-stone-50 group-hover:border-indigo-500 group-hover:bg-indigo-50 group-hover:shadow-[0_0_0_6px_rgba(99,102,241,0.1)] transition-all duration-200 cursor-default">
                    <span className="text-2xl">{step.emoji}</span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900 mb-1.5">{step.name}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{step.description}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>

        {/* Focus mode mockup */}
        <FadeUp className="mt-16 max-w-2xl mx-auto">
          <div className="bg-background border border-stone-100 rounded-2xl shadow-xl overflow-hidden">
            {/* Dark header bar */}
            <div className="bg-stone-900 px-5 py-3.5 flex items-center justify-between">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <span className="font-mono text-xs text-stone-400">Focus Mode — No distractions</span>
              <span className="font-mono text-sm font-semibold text-emerald-400">47:22</span>
            </div>

            <div className="p-7">
              {/* Step indicator */}
              <div className="grid grid-cols-5 gap-2 mb-7">
                {STEPS.map((s, i) => (
                  <div
                    key={s.name}
                    className={`py-2 px-1 rounded-lg text-center text-[0.7rem] font-semibold ${i < 2
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-600"
                        : i === 2
                          ? "bg-indigo-600 text-white border border-indigo-500"
                          : "bg-muted border border-stone-200 text-stone-400"
                      }`}
                  >
                    {i < 2 ? "✓ " : i === 2 ? "▶ " : ""}{s.name}
                  </div>
                ))}
              </div>

              <h4 className="text-lg font-bold text-stone-900 mb-2">Build: Design a URL Shortener</h4>
              <p className="text-sm text-stone-500 leading-relaxed mb-5">
                Design a system that maps short codes (e.g.{" "}
                <code className="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-xs">bit.ly/abc</code>) to long
                URLs. Consider scale: 100M URLs, 10B reads/month.
              </p>

              {/* Code block */}
              <div className="bg-stone-900 rounded-xl p-5 font-mono text-[0.8rem] leading-relaxed">
                <span className="text-emerald-300">class</span>{" "}
                <span className="text-yellow-300">URLShortener</span>:<br />
                {"  "}
                <span className="text-emerald-300">def</span>{" "}
                <span className="text-blue-300">shorten</span>(self, url:{" "}
                <span className="text-sky-300">str</span>) →{" "}
                <span className="text-sky-300">str</span>:<br />
                {"    "}
                <span className="text-muted-foreground"># hash + base62 encode</span>
                <br />
                {"    "}code = <span className="text-cyan-300">base62</span>(
                <span className="text-cyan-300">sha256</span>(url)[:6])<br />
                {"    "}
                <span className="text-emerald-300">return</span>{" "}
                <span className="text-rose-300">{`f"short.ly/{'{'}code{'}'}"`}</span>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Skill Radar ──────────────────────────────────────────────────────────────

function SkillRadar() {
  // Compute polygon points for 8-axis radar
  const cx = 160;
  const cy = 160;
  const maxR = 120;
  const skills8 = [87, 72, 90, 65, 80, 55, 78, 68]; // % per axis
  const points = skills8
    .map((pct, i) => {
      const angle = (Math.PI * 2 * i) / 8 - Math.PI / 2;
      const r = (pct / 100) * maxR;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    })
    .join(" ");

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <FadeUp>
            <span className="inline-flex items-center gap-1.5 text-[0.75rem] font-semibold uppercase tracking-widest text-indigo-600 mb-3">
              <span className="w-5 h-0.5 bg-indigo-400 rounded-full" />
              Skill Analytics
            </span>
            <h2 className="text-4xl lg:text-5xl font-serif font-normal tracking-tight text-stone-900 leading-tight mb-4">
              Know exactly{" "}
              <em className="italic text-indigo-600">where to improve.</em>
            </h2>
            <p className="text-lg text-stone-500 max-w-xl leading-relaxed mb-8">
              Real-time skill tracking across all 8 dimensions that top companies evaluate. No guessing what to
              study next.
            </p>

            {/* Metric cards */}
            <div className="flex gap-4 mb-8">
              {[
                { icon: "🎯", label: "Job Readiness", value: "87%", color: "text-indigo-600" },
                { icon: "📈", label: "Weekly Growth", value: "+12%", color: "text-emerald-600" },
              ].map((m) => (
                <div key={m.label} className="flex-1 flex items-center gap-3 p-4 border border-stone-100 rounded-xl">
                  <span className="text-xl">{m.icon}</span>
                  <div>
                    <p className="text-xs text-stone-400 mb-0.5">{m.label}</p>
                    <p className={`font-mono text-xl font-bold leading-none ${m.color}`}>{m.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Skill bars */}
            <div className="flex flex-col gap-3">
              {SKILLS.map((skill, i) => (
                <div key={skill.name} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-stone-600 w-28 flex-shrink-0">{skill.name}</span>
                  <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 transition-all duration-1000"
                      style={{ width: `${skill.pct}%`, animationDelay: `${i * 100}ms` }}
                    />
                  </div>
                  <span className="font-mono text-xs font-semibold text-indigo-600 w-8 text-right">
                    {skill.pct}%
                  </span>
                </div>
              ))}
            </div>
          </FadeUp>

          {/* Radar SVG */}
          <FadeUp className="flex justify-center">
            <svg viewBox="0 0 320 320" className="w-full max-w-xs" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="radarGrad" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0.04" />
                </radialGradient>
              </defs>
              {/* Grid rings */}
              {[30, 60, 90, 120].map((r) => (
                <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="#F5F5F4" strokeWidth="1" />
              ))}
              {/* Spokes */}
              {skills8.map((_, i) => {
                const angle = (Math.PI * 2 * i) / 8 - Math.PI / 2;
                return (
                  <line
                    key={i}
                    x1={cx}
                    y1={cy}
                    x2={cx + maxR * Math.cos(angle)}
                    y2={cy + maxR * Math.sin(angle)}
                    stroke="#F5F5F4"
                    strokeWidth="1"
                  />
                );
              })}
              {/* Data polygon */}
              <polygon points={points} fill="url(#radarGrad)" stroke="#6366F1" strokeWidth="2" strokeLinejoin="round" />
              {/* Data points */}
              {skills8.map((pct, i) => {
                const angle = (Math.PI * 2 * i) / 8 - Math.PI / 2;
                const r = (pct / 100) * maxR;
                return <circle key={i} cx={cx + r * Math.cos(angle)} cy={cy + r * Math.sin(angle)} r={4} fill="#6366F1" />;
              })}
              {/* Labels */}
              {["DSA", "Sys Design", "Coding", "Behavioral", "Networking", "OS", "SQL", "Cloud"].map((label, i) => {
                const angle = (Math.PI * 2 * i) / 8 - Math.PI / 2;
                const r = maxR + 22;
                return (
                  <text
                    key={label}
                    x={cx + r * Math.cos(angle)}
                    y={cy + r * Math.sin(angle)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="10"
                    fontFamily="Geist, sans-serif"
                    fontWeight="600"
                    fill="#A8A29E"
                  >
                    {label}
                  </text>
                );
              })}
              {/* Center label */}
              <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontFamily="Geist Mono, monospace" fontWeight="700" fill="#4F46E5">
                87%
              </text>
              <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fontFamily="Geist, sans-serif" fill="#A8A29E">
                Readiness
              </text>
            </svg>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  return (
    <section className="py-24 px-6 bg-indigo-600">
      <div className="max-w-7xl mx-auto">
        <FadeUp className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-widest text-indigo-200 mb-3">
            <span className="w-5 h-0.5 bg-indigo-400 rounded-full" />
            Testimonials
            <span className="w-5 h-0.5 bg-indigo-400 rounded-full" />
          </span>
          <h2 className="text-4xl lg:text-5xl font-serif font-normal tracking-tight text-white leading-tight mb-4">
            Hired in weeks, <em className="italic text-indigo-200">not months.</em>
          </h2>
          <p className="text-lg text-indigo-200/70 max-w-xl mx-auto leading-relaxed">
            Real developers who used CareerOS to transform their careers.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <FadeUp key={t.name} delay={i * 80}>
              <div className="bg-white/10 border border-white/15 rounded-2xl p-7 hover:bg-white/15 hover:-translate-y-1 transition-all duration-200">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} className="text-amber-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-[0.9375rem] text-white/90 leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold bg-white/20 text-white`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/50">{t.role}</p>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <FadeUp className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-widest text-indigo-600 mb-3">
            <span className="w-5 h-0.5 bg-indigo-400 rounded-full" />
            Pricing
            <span className="w-5 h-0.5 bg-indigo-400 rounded-full" />
          </span>
          <h2 className="text-4xl lg:text-5xl font-serif font-normal tracking-tight text-stone-900 leading-tight mb-4">
            Simple, <em className="italic text-indigo-600">transparent</em> pricing.
          </h2>
          <p className="text-lg text-stone-500 max-w-xl mx-auto leading-relaxed">
            One month of CareerOS costs less than one hour with an interview coach. Start free, upgrade when ready.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {PRICING.map((tier, i) => (
            <FadeUp key={tier.name} delay={i * 80} className={tier.featured ? "relative" : ""}>
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-amber-400 text-stone-900 text-[0.65rem] font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap">
                  {tier.badge}
                </div>
              )}
              <div
                className={`rounded-2xl p-8 border h-full flex flex-col transition-all duration-200 hover:-translate-y-1 ${tier.featured
                    ? "bg-indigo-600 border-indigo-500 shadow-[0_16px_48px_rgba(79,70,229,0.3)] hover:shadow-[0_24px_64px_rgba(79,70,229,0.4)]"
                    : "bg-background border-stone-100 shadow-sm hover:shadow-lg"
                  }`}
              >
                <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${tier.featured ? "text-indigo-200" : "text-muted-foreground"}`}>
                  {tier.name}
                </p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-lg font-semibold ${tier.featured ? "text-indigo-200" : "text-muted-foreground"}`}>$</span>
                  <span className={`font-mono text-5xl font-bold tracking-tight leading-none ${tier.featured ? "text-white" : "text-foreground"}`}>
                    {tier.price.replace("$", "")}
                  </span>
                  <span className={`text-sm ${tier.featured ? "text-indigo-200" : "text-muted-foreground"}`}>/ mo</span>
                </div>
                <p className={`text-sm mb-5 leading-relaxed ${tier.featured ? "text-indigo-200/80" : "text-muted-foreground"}`}>
                  {tier.description}
                </p>
                <hr className={`mb-5 ${tier.featured ? "border-white/15" : "border-border"}`} />
                <ul className="flex flex-col gap-2.5 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2.5 text-sm ${tier.featured ? "text-white/85" : "text-muted-foreground"}`}>
                      <CheckIcon featured={tier.featured} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`mt-8 block text-center py-3 px-5 rounded-xl text-sm font-semibold transition-all no-underline ${tier.featured
                      ? "bg-background text-indigo-700 hover:bg-indigo-50 shadow-md"
                      : "border border-stone-200 text-stone-700 hover:bg-muted hover:border-border"
                    }`}
                >
                  {tier.cta}
                </Link>
              </div>
            </FadeUp>
          ))}
        </div>
        <p className="text-center text-xs text-stone-400 mt-4">
          *Job guarantee terms apply. Refund if not placed within 90 days of completion.
        </p>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTA() {
  const [email, setEmail] = useState("");

  return (
    <section id="about" className="py-32 px-6 bg-stone-900 text-white text-center">
      <FadeUp className="max-w-2xl mx-auto">
        <h2 className="text-5xl lg:text-6xl font-serif font-normal tracking-tight leading-tight mb-5">
          Your career is <br />
          <em className="italic text-indigo-400">one session away.</em>
        </h2>
        <p className="text-lg text-white/50 max-w-md mx-auto leading-relaxed mb-8">
          Join 12,000 developers accelerating their careers with CareerOS. Start free — no credit card required.
        </p>

        <div className="flex gap-2.5 max-w-md mx-auto mb-3">
          <input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-white/8 border border-white/12 text-white placeholder-white/30 text-sm font-sans outline-none focus:border-indigo-400 focus:bg-white/12 transition-all"
          />
          <button className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold border border-indigo-500 transition-colors whitespace-nowrap">
            Get started free →
          </button>
        </div>
        <p className="text-xs text-white/30">No credit card · 14-day Pro trial · Cancel anytime</p>
      </FadeUp>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const cols = [
    { title: "Product", links: ["Features", "Roadmap", "Changelog", "Pricing"] },
    { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
    { title: "Resources", links: ["Documentation", "Community", "Interview Prep", "Support"] },
  ];

  return (
    <footer className="bg-stone-900 border-t border-white/6 px-6 pt-14 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4">
                  <path d="M9 2L15.5 5.5V12.5L9 16L2.5 12.5V5.5L9 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                  <circle cx="9" cy="9" r="2.5" fill="white" />
                </svg>
              </span>
              <span className="font-bold text-white">CareerOS</span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed">
              The operating system for software engineering careers. Built by engineers who&apos;ve been there.
            </p>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-white/30 mb-4">{col.title}</p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-white/50 hover:text-white transition-colors no-underline">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">© 2025 CareerOS, Inc. All rights reserved.</p>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Cookies"].map((l) => (
              <a key={l} href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors no-underline">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CareerOSLanding() {
  return (
    <>
      {/*
        Add to your global CSS / tailwind.config.js:

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        In tailwind.config.js extend:
        animation: { float: 'float 3s ease-in-out infinite' }

        Fonts (add to <head> or layout.tsx):
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />

        Add to globals.css:
        @import url('https://fonts.googleapis.com/...');
        .font-serif { font-family: 'Instrument Serif', Georgia, serif; }
        body { font-family: 'Geist', system-ui, sans-serif; }
      */}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
        body, * { font-family: 'Geist', system-ui, sans-serif; box-sizing: border-box; }
        .font-serif, .font-serif * { font-family: 'Instrument Serif', Georgia, serif !important; }
        .font-mono { font-family: 'Geist Mono', monospace !important; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .animate-\\[float_3s_ease-in-out_infinite\\] { animation: float 3s ease-in-out infinite; }
        .animate-\\[float_3s_ease-in-out_infinite_1\\.5s\\] { animation: float 3s ease-in-out infinite 1.5s; }
        html { scroll-behavior: smooth; }
      `}</style>

      <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden transition-colors duration-300">
        <Navbar />
        <Hero />
        <LogoStrip />
        <Features />
        <HowItWorks />
        <SkillRadar />
        <Testimonials />
        <Pricing />
        <CTA />
        <Footer />
      </div>
    </>
  );
}