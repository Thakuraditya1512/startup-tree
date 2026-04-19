"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FireIcon,
  BoltIcon,
  TrophyIcon,
  ClockIcon,
  SparklesIcon,
  PlayCircleIcon,
  MapIcon,
  MicrophoneIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  AcademicCapIcon,
  RocketLaunchIcon,
  LockClosedIcon,
  CheckCircleIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  ChevronRightIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  PlusIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { 
  CheckCircleIcon as CheckSolid,
  VideoCameraIcon,
  LinkIcon,
  QuestionMarkCircleIcon,
  ChatBubbleBottomCenterTextIcon,
  SparklesIcon as SparklesSolid
} from "@heroicons/react/24/solid";
import { 
  XMarkIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "@/lib/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Project {
  id: string;
  user_id?: string;
  name: string;
  goal: string;
  experience: string;
  status: string;
  progress: number;
  tasks_done: number;
  tasks_total: number;
  xp: number;
  streak: number;
  color: string;
  created_at: string;
  updated_at: string;
}
interface Activity {
  id: string;
  user_id?: string;
  type: string;
  title: string;
  xp_earned: number;
  created_at: string;
}
interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
}
interface UserTask {
  id: string;
  user_id: string;
  module_id: string;
  title: string;
  status: string;
  type: string; // Task type: video, link, quiz, text
  content_url?: string;
  content_body?: string;
  completed_at: string | null;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const STREAK_DAYS = [true, true, true, true, false, true, true]; // mock active days

const STATS = [
  { label: "Completed", value: "12 / 50", sub: "Tests", icon: BookOpenIcon, accent: "indigo", progress: 24 },
  { label: "Tests Passed", value: "8 / 32", sub: "Keep going!", icon: CheckBadgeIcon, accent: "emerald", progress: 25 },
  { label: "Study Time", value: "18h 45m", sub: "This week", icon: ClockIcon, accent: "amber", progress: null },
  { label: "Global Rank", value: "#142", sub: "Top 10%", icon: TrophyIcon, accent: "purple", progress: null },
];

const ROADMAP_MODULES = [
  {
    id: 1,
    title: "HTML & CSS Fundamentals",
    time: "4 Tests · 12 Hours",
    active: true,
    tasks: [
      { name: "Test 1: HTML Basics", status: "done" },
      { name: "Test 2: CSS Styling", status: "unlocks", unlockTime: "Tomorrow 10:00 AM" },
      { name: "Test 3: Responsive Design", status: "locked" },
      { name: "Test 4: CSS Frameworks", status: "locked" },
    ],
  },
  { id: 2, title: "JavaScript Essentials", time: "5 Tests · 15 Hours", active: false, tasks: [] },
  { id: 3, title: "React Development", time: "6 Tests · 18 Hours", active: false, tasks: [] },
  { id: 4, title: "Backend with Node.js", time: "5 Tests · 20 Hours", active: false, tasks: [] },
  { id: 5, title: "Database & Deployment", time: "4 Tests · 15 Hours", active: false, tasks: [] },
];

const QUICK_ACTIONS = [
  { icon: PlayCircleIcon, label: "Join Live Class", sub: "Today, 4:00 PM", color: "indigo" },
  { icon: BookOpenIcon, label: "View Classroom", sub: "Continue Learning", color: "violet" },
  { icon: MicrophoneIcon, label: "Mock Interview", sub: "Practice Now", color: "rose" },
  { icon: DocumentTextIcon, label: "AI Resume", sub: "Build & Export", color: "amber" },
  { icon: ChatBubbleLeftRightIcon, label: "Ask AI Coach", sub: "Get Guidance", color: "emerald" },
  { icon: UserGroupIcon, label: "Join a Pod", sub: "Study Together", color: "sky" },
];

const ACTIVITY = [
  { icon: CheckSolid, color: "green", text: "REST API Design Quiz", tag: "Completed", xp: "+120 XP", time: "2h ago" },
  { icon: CheckSolid, color: "indigo", text: "JWT Authentication Module", tag: "Completed", xp: "+240 XP", time: "Yesterday" },
  { icon: TrophyIcon, color: "amber", text: "7-Day Streak Badge Earned", tag: "Badge", xp: "+500 XP", time: "2d ago" },
];

const accentMap: Record<string, { bg: string; text: string; ring: string; border: string; solidBg: string }> = {
  indigo:  { bg: "bg-indigo-50 dark:bg-indigo-500/10",  text: "text-indigo-600 dark:text-indigo-400",  ring: "ring-indigo-600",  border: "border-indigo-200 dark:border-indigo-500/30", solidBg: "bg-indigo-600" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-500", border: "border-emerald-200 dark:border-emerald-500/30", solidBg: "bg-emerald-500" },
  amber:   { bg: "bg-amber-50 dark:bg-amber-500/10",   text: "text-amber-600 dark:text-amber-400",   ring: "ring-amber-500",   border: "border-amber-200 dark:border-amber-500/30",   solidBg: "bg-amber-500" },
  purple:  { bg: "bg-purple-50 dark:bg-purple-500/10",  text: "text-purple-600 dark:text-purple-400",  ring: "ring-purple-500",  border: "border-purple-200 dark:border-purple-500/30",  solidBg: "bg-purple-500" },
  rose:    { bg: "bg-rose-50 dark:bg-rose-500/10",    text: "text-rose-600 dark:text-rose-400",    ring: "",    border: "border-rose-200 dark:border-rose-500/30",    solidBg: "bg-rose-500" },
  sky:     { bg: "bg-sky-50 dark:bg-sky-500/10",     text: "text-sky-600 dark:text-sky-400",     ring: "",     border: "border-sky-200 dark:border-sky-500/30",     solidBg: "bg-sky-500" },
  violet:  { bg: "bg-violet-50 dark:bg-violet-500/10",  text: "text-violet-600 dark:text-violet-400",  ring: "",  border: "border-violet-200 dark:border-violet-500/30",  solidBg: "bg-violet-500" },
  green:   { bg: "bg-green-50 dark:bg-green-500/10",   text: "text-green-600 dark:text-green-400",   ring: "",   border: "",   solidBg: "bg-green-500" },
};

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [userTasks, setUserTasks] = useState<UserTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<UserTask | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const { profile } = useAuth();
  const supabase = createClient();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!profile?.id) return;
    async function load() {
      setDataLoading(true);
      const [{ data: projData }, { data: actData }, { data: modData }, { data: taskData }] = await Promise.all([
        supabase.from("projects").select("*").eq("user_id", profile!.id).order("updated_at", { ascending: false }),
        supabase.from("activities").select("*").eq("user_id", profile!.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("modules").select("*").order("order"),
        supabase.from("user_tasks").select("*").eq("user_id", profile!.id),
      ]);
      setProjects(projData || []);
      setActivities(actData || []);
      setModules(modData || []);
      setUserTasks(taskData || []);
      setDataLoading(false);
    }
    load();

    // REALTIME SUBSCRIPTION
    const channel = supabase
      .channel('tasks-update')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_tasks', filter: `user_id=eq.${profile.id}` }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setUserTasks(prev => [...prev, payload.new as UserTask]);
        } else if (payload.eventType === 'UPDATE') {
          setUserTasks(prev => prev.map(t => t.id === payload.new.id ? (payload.new as UserTask) : t));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  const handleTaskClick = async (task: UserTask) => {
    setSelectedTask(task);
  };

  const markTaskDone = async (taskId: string) => {
    const { error } = await supabase
      .from('user_tasks')
      .update({ status: 'done', completed_at: new Date().toISOString() })
      .eq('id', taskId);
      
    if (!error) {
       setUserTasks(prev => prev.map(t => t.id === taskId ? {...t, status: 'done'} : t));
       if (selectedTask?.id === taskId) setSelectedTask({...selectedTask, status: 'done'});
       
       await supabase.from('activities').insert({
         user_id: profile!.id,
         type: 'module',
         title: `Completed task: ${selectedTask?.title || 'Unknown'}`,
         xp_earned: 100
       });
    }
  };

  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    let videoId = "";
    if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0];
    else if (url.includes("be/")) videoId = url.split("be/")[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'video': return <VideoCameraIcon className="w-4 h-4 text-rose-500" />;
      case 'link': return <LinkIcon className="w-4 h-4 text-blue-500" />;
      case 'quiz': return <QuestionMarkCircleIcon className="w-4 h-4 text-emerald-500" />;
      default: return <ChatBubbleBottomCenterTextIcon className="w-4 h-4 text-gray-500" />;
    }
  };
  
  const displayName = profile?.full_name || "there";
  const totalXP = profile?.xp ?? (projects.reduce((s, p) => s + p.xp, 0));
  const streak = profile?.streak ?? (projects.length > 0 ? Math.max(...projects.map(p => p.streak)) : 0);

  if (!mounted) return null;

  return (
    <div className="w-full min-h-full p-6 lg:p-10 space-y-8 animate-in fade-in duration-500" style={{ fontFamily: "var(--font-sans)" }}>

      {/* ── WELCOME HERO ──────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        {/* Left: Greeting */}
        <div>
          <p className="text-sm font-semibold text-muted-foreground mb-1 tracking-wide">Welcome back,</p>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            {displayName} <span className="text-4xl select-none">👋</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-sm font-medium">Keep learning. Keep building. You've got this!</p>

          {/* Stay Consistent Banner */}
          <div className="mt-5 flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-3.5 max-w-lg">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/10">
              <span className="text-lg select-none">💡</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground leading-tight">Stay Consistent!</p>
              <p className="text-xs text-muted-foreground mt-0.5">Complete today's test to unlock tomorrow's content.</p>
            </div>
            <Link href="/dashboard/focus" className="shrink-0 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-bold text-white transition-all hover:-translate-y-px shadow-sm shadow-indigo-500/30">
              Continue Roadmap
            </Link>
          </div>
        </div>

        {/* Right: Streak Widget */}
        <div className="shrink-0 rounded-2xl border border-border bg-card p-5 min-w-[240px]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Current Streak</p>
              <p className="text-3xl font-extrabold text-foreground flex items-center gap-2 mt-0.5">
                <FireIcon className="w-7 h-7 text-orange-500 fill-orange-500 stroke-none" />
                7 Days
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">Best: 12 Days</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between mb-1.5">
              {DAYS.map((d, i) => (
                <span key={i} className="text-[10px] font-bold text-muted-foreground w-6 text-center">{d}</span>
              ))}
            </div>
            <div className="flex justify-between">
              {STREAK_DAYS.map((active, i) => (
                <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center ${active ? "bg-indigo-600 shadow-sm shadow-indigo-500/40" : "bg-muted border border-border"}`}>
                  {active && <CheckCircleIcon className="w-3.5 h-3.5 text-white stroke-2" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS ROW ─────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Completed', value: `${projects.reduce((s,p)=>s+p.tasks_done,0)} / ${projects.reduce((s,p)=>s+p.tasks_total,0)}`, sub: 'Tasks', icon: BookOpenIcon, accent: 'indigo', progress: projects.length > 0 ? Math.round(projects.reduce((s,p)=>s+p.tasks_done,0) / Math.max(projects.reduce((s,p)=>s+p.tasks_total,0),1)*100) : null },
          { label: 'Total XP', value: totalXP.toLocaleString(), sub: '⚡ Earned', icon: BoltIcon, accent: 'amber', progress: null },
          { label: 'Day Streak', value: `${streak} 🔥`, sub: 'Keep going!', icon: FireIcon, accent: 'emerald', progress: null },
          { label: 'Projects', value: projects.length.toString(), sub: projects.length === 0 ? 'Create one!' : 'Active', icon: RocketLaunchIcon, accent: 'purple', progress: null },
        ].map((s) => {
          const c = accentMap[s.accent];
          return (
            <div key={s.label} className="rounded-xl border border-border bg-card p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
              <div className={`w-11 h-11 shrink-0 rounded-xl ${c.bg} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${c.text}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-muted-foreground mb-0.5 uppercase tracking-wider">{s.label}</p>
                {dataLoading ? <div className="h-6 bg-muted animate-pulse rounded w-16 mt-1" /> : (
                  <p className="text-xl font-extrabold text-foreground tracking-tight leading-none">{s.value}</p>
                )}
                {s.progress !== null && !dataLoading ? (
                  <div className="mt-2">
                    <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full ${c.solidBg}`} style={{ width: `${s.progress}%` }} />
                    </div>
                    <p className={`text-[10px] font-bold mt-1 ${c.text}`}>{s.progress}%</p>
                  </div>
                ) : (
                  <p className={`text-xs font-bold mt-1 ${c.text}`}>{s.sub}</p>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* ── MAIN CONTENT GRID ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* LEFT: Roadmap + Activity */}
        <div className="xl:col-span-2 space-y-8">

          {/* YOUR LEARNING ROADMAP */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MapIcon className="w-5 h-5 text-indigo-500" />
                <h2 className="text-base font-bold text-foreground">Your Learning Roadmap</h2>
              </div>
              <button className="text-xs font-bold text-indigo-500 hover:text-indigo-400 transition flex items-center gap-1">
                View All Roadmaps <ChevronRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-border">
              {dataLoading ? (
                <div className="p-10 flex justify-center"><ArrowPathIcon className="w-8 h-8 animate-spin text-muted-foreground" /></div>
              ) : modules.length === 0 ? (
                <div className="p-10 text-center text-sm text-muted-foreground">Admin hasn't assigned your roadmap yet.</div>
              ) : modules.map((mod, mi) => {
                const tasks = userTasks.filter(t => t.module_id === mod.id);
                const isActive = tasks.length > 0 && tasks.some(t => t.status !== 'done');
                const isDone = tasks.length > 0 && tasks.every(t => t.status === 'done');
                
                return (
                  <div key={mod.id}>
                    {/* Module Row */}
                    <div className={`flex items-center gap-4 px-6 py-4 transition-colors ${isActive ? "bg-indigo-50/50 dark:bg-indigo-500/5" : "hover:bg-muted/30"}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${isDone ? "bg-green-500 text-white" : isActive ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30" : "bg-muted text-muted-foreground border border-border"}`}>
                        {mi + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold ${isActive || isDone ? "text-foreground" : "text-muted-foreground"}`}>{mod.title}</p>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">{tasks.length} Tests · {mod.description}</p>
                      </div>
                      {isDone ? (
                        <div className="flex items-center gap-1 text-xs font-bold text-green-500">
                          <CheckBadgeIcon className="w-4 h-4" /> Mastery
                        </div>
                      ) : !isActive && tasks.length === 0 ? (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground font-semibold">
                          <LockClosedIcon className="w-3.5 h-3.5" /> Locked
                        </div>
                      ) : null}
                    </div>

                    {/* Module Tasks */}
                    {(isActive || isDone) && (
                      <div className="bg-background px-6 pb-4 space-y-2">
                        {tasks.sort((a,b) => a.title.localeCompare(b.title)).map((task) => (
                          <button 
                            key={task.id}
                            onClick={() => handleTaskClick(task)}
                            className={`flex w-full items-center justify-between rounded-lg px-4 py-3 border transition-all text-left ${task.status === "done" ? "border-green-200 dark:border-green-500/20 bg-green-50 dark:bg-green-500/5 focus:ring-0" : "border-border bg-card hover:border-indigo-500/50 hover:shadow-sm focus:ring-2 ring-indigo-500/20"}`}
                          >
                            <div className="flex items-center gap-3">
                              {task.status === "done" ? (
                                <CheckSolid className="w-4 h-4 text-green-500 shrink-0" />
                              ) : (
                                getTypeIcon(task.type)
                              )}
                              <span className={`text-xs font-bold ${task.status === "done" ? "text-foreground" : "text-muted-foreground"}`}>
                                {task.title}
                              </span>
                            </div>
                            {task.status === 'done' ? (
                               <span className="text-[10px] font-extrabold text-green-600">DONE</span>
                            ) : (
                               <div className="text-[9px] font-bold uppercase py-1 px-2 rounded-md bg-muted text-muted-foreground group-hover:bg-indigo-600 group-hover:text-white transition-colors">Start</div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )})}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
              <BoltIcon className="w-4 h-4 text-yellow-500" /> Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {QUICK_ACTIONS.map((a) => {
                const c = accentMap[a.color];
                return (
                  <button key={a.label} className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-border/60 hover:shadow-sm hover:-translate-y-0.5 transition-all text-left">
                    <div className={`w-10 h-10 shrink-0 rounded-xl ${c.bg} flex items-center justify-center`}>
                      <a.icon className={`w-5 h-5 ${c.text}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground leading-tight">{a.label}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">{a.sub}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: AI Coach + Milestone + Activity */}
        <div className="space-y-5">

          {/* MILESTONE */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrophyIcon className="w-5 h-5 text-yellow-500" />
              <h3 className="text-sm font-bold text-foreground">Next Milestone</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-1 font-medium">Complete HTML &amp; CSS</p>
            <p className="text-[11px] text-muted-foreground mb-3">Unlock JavaScript Essentials</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-1/4 rounded-full bg-indigo-600 transition-all duration-700" />
              </div>
              <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">25%</span>
            </div>
          </div>

          {/* AI COACH */}
          <div className="rounded-xl border border-border bg-card p-5 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                <SparklesIcon className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-bold text-foreground">AI Coach</h3>
              <span className="ml-auto text-[9px] font-extrabold bg-green-500/15 text-green-500 border border-green-500/30 px-2 py-0.5 rounded-full tracking-wider uppercase">Live</span>
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              Great progress! Your backend skills grew <strong className="text-foreground font-bold">+12% this week</strong>. Focus on 
              <span className="text-indigo-500 font-semibold"> OAuth 2.0 flows</span> — there's a gap before your mock interview.
            </p>
            <button className="mt-3 text-xs font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1 transition">
              Full analysis <ArrowRightIcon className="w-3 h-3" />
            </button>
          </div>

          {/* RECENT ACTIVITY */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
              <CalendarDaysIcon className="w-4 h-4" /> Recent Activity
            </h3>
            <div className="space-y-4">
              {dataLoading ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-muted animate-pulse shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
                        <div className="h-2 bg-muted animate-pulse rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : activities.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No activity yet. Complete a module to see your history!</p>
              ) : activities.map((a, i) => (
                <div key={a.id} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckSolid className="w-3.5 h-3.5 text-indigo-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-foreground leading-tight">{a.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</span>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400">{a.type}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold text-green-500 shrink-0">+{a.xp_earned} XP</span>
                </div>
              ))}
            </div>
          </div>

          {/* LEADERBOARD MINI */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <TrophyIcon className="w-4 h-4 text-yellow-400" /> Top Engineers
              </h3>
              <button className="text-[10px] font-bold text-indigo-500 hover:text-indigo-400 transition">View All</button>
            </div>
            <div className="space-y-2.5">
              {[
                { rank: 1, name: "Sarah Chen", xp: "24.5k", you: false },
                { rank: 2, name: "Alex M.", xp: "22.1k", you: false },
                { rank: 12, name: "You", xp: "6.2k", you: true },
              ].map((u) => (
                <div key={u.rank} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${u.you ? "bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20" : "hover:bg-muted/50 transition"}`}>
                  <span className={`text-[11px] font-extrabold w-5 text-center ${u.rank === 1 ? "text-yellow-500" : u.rank === 2 ? "text-gray-400" : "text-muted-foreground"}`}>#{u.rank}</span>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 shrink-0" />
                  <span className={`text-xs font-bold flex-1 ${u.you ? "text-indigo-500" : "text-foreground"}`}>{u.name}</span>
                  <span className="text-[11px] font-extrabold text-muted-foreground">{u.xp} XP</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      {/* ── CONTENT MODAL ────────────────────────────────────────────── */}
      {selectedTask && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTask(null)} />
          <div className="relative w-full max-w-4xl bg-card border border-border rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
             {/* Header */}
             <div className="flex items-center justify-between p-6 border-b border-border bg-card">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center">
                   {getTypeIcon(selectedTask.type)}
                 </div>
                 <div>
                    <h2 className="text-xl font-extrabold tracking-tight">{selectedTask.title}</h2>
                    <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1 uppercase tracking-widest">{selectedTask.type} Roadmap Item</p>
                 </div>
               </div>
               <button onClick={() => setSelectedTask(null)} className="p-2 rounded-xl hover:bg-muted transition-colors">
                 <XMarkIcon className="w-6 h-6" />
               </button>
             </div>

             {/* Content Area */}
             <div className="p-6 overflow-y-auto max-h-[70vh]">
               {selectedTask.type === 'video' ? (
                 <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner border border-border/50 mb-6">
                   {getYouTubeEmbedUrl(selectedTask.content_url) ? (
                     <iframe 
                       src={getYouTubeEmbedUrl(selectedTask.content_url)!} 
                       className="w-full h-full" 
                       allowFullScreen 
                       title={selectedTask.title}
                     />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-muted-foreground">Invalid Video URL</div>
                   )}
                 </div>
               ) : selectedTask.type === 'link' ? (
                 <div className="p-8 text-center bg-muted/30 rounded-2xl border border-dashed border-border mb-6">
                   <LinkIcon className="w-12 h-12 text-blue-500 mx-auto mb-4 opacity-30" />
                   <p className="text-lg font-bold mb-4">Visit external resource to continue.</p>
                   <a 
                     href={selectedTask.content_url} 
                     target="_blank" 
                     className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition"
                   >
                     Open Website <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                   </a>
                 </div>
               ) : null}

               {selectedTask.content_body && (
                 <div className="prose prose-sm dark:prose-invert max-w-none mb-8 bg-muted/20 p-6 rounded-2xl border border-border">
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">{selectedTask.content_body}</p>
                 </div>
               )}

               {selectedTask.type === 'quiz' && (
                 <div className="p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 mb-8">
                   <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2">
                     <QuestionMarkCircleIcon className="w-5 h-5" /> Quiz / Assignment
                   </h3>
                   <p className="text-xs text-muted-foreground">Complete the tasks assigned by your admin and upload proof or mark as done below.</p>
                 </div>
               )}

               {/* Completion Button */}
               <div className="flex items-center justify-center">
                 {selectedTask.status === 'done' ? (
                   <div className="flex items-center gap-2 bg-green-500/10 text-green-500 px-6 py-4 rounded-2xl font-extrabold uppercase tracking-widest border border-green-500/30">
                     <CheckBadgeIcon className="w-6 h-6" /> Completed Mastery
                   </div>
                 ) : (
                   <button 
                     onClick={() => markTaskDone(selectedTask.id)}
                     className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-green-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                   >
                     Mark as Finished <CheckBadgeIcon className="w-5 h-5" />
                   </button>
                 )}
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

