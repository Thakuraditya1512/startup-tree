"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { 
  MagnifyingGlassIcon, 
  QuestionMarkCircleIcon, 
  LightBulbIcon, 
  ChevronUpDownIcon,
  ChevronDownIcon,
  BellIcon,
  MoonIcon,
  SunIcon,
  ComputerDesktopIcon,
  ArrowLeftStartOnRectangleIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "@/lib/context/AuthContext";

export function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const { profile, signOut } = useAuth();
  const router = useRouter();
  
  const displayName = profile?.full_name || "User";
  const initials = displayName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-10 flex h-14 w-full shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      {/* Left Context */}
      <div className="flex items-center gap-3">
        <div className="flex cursor-pointer items-center gap-2 rounded-md border border-transparent bg-transparent px-1.5 py-1 transition hover:border-border hover:bg-muted/50">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-white shadow-sm ring-1 ring-black/5">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3"><path d="M12 2L2 22h20L12 2z"/></svg>
          </div>
          <span className="text-[14px] font-medium tracking-tight text-foreground">learning next/js</span>
        </div>
        <span className="rounded-full border border-border bg-muted px-2 py-[2px] text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Free</span>
        <ChevronUpDownIcon className="h-[18px] w-[18px] cursor-pointer text-muted-foreground transition-colors hover:text-foreground" />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 text-muted-foreground sm:gap-5">
        <div className="group flex h-8 w-48 items-center rounded-md border border-border bg-muted/50 px-2.5 transition-all focus-within:border-green-500 focus-within:bg-background focus-within:ring-2 focus-within:ring-green-500/20 lg:w-64">
          <MagnifyingGlassIcon className="mr-2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-green-600" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-transparent text-[13px] text-foreground placeholder-muted-foreground outline-none"
          />
          <kbd className="ml-2 hidden rounded-[4px] border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:inline-block">Ctrl K</kbd>
        </div>

        <div className="flex items-center gap-3 border-l border-border pl-2 sm:gap-4 sm:pl-4 relative" ref={dropdownRef}>
          <button className="flex items-center justify-center transition hover:text-foreground"><QuestionMarkCircleIcon className="h-5 w-5" /></button>
          <button className="flex items-center justify-center transition hover:text-foreground"><LightBulbIcon className="h-5 w-5" /></button>
          <button className="flex items-center justify-center transition hover:text-foreground"><BellIcon className="h-5 w-5" /></button>
          
          <div className="mx-1 hidden h-4 w-[1px] bg-border sm:block"></div>
          
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex cursor-pointer items-center gap-2 rounded-full py-1 pl-1 pr-2 transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-green-500/20">
            <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-orange-400 shadow-sm ring-2 ring-background border border-border flex items-center justify-center text-white text-[10px] font-bold">
              {initials}
            </div>
            <span className="hidden text-[13px] font-medium text-foreground sm:block">{displayName.split(" ")[0]}</span>
            <ChevronDownIcon className="h-3 w-3 text-muted-foreground" />
          </button>

          {/* Theme / Profile Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-56 rounded-xl border border-border bg-background p-1.5 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-2 py-2 mb-1 border-b border-border">
                <p className="text-sm font-semibold text-foreground">{displayName}</p>
                <p className="text-xs text-muted-foreground truncate">{profile?.goal || "Career Explorer"}</p>
              </div>
              
              <div className="py-1 border-b border-border mb-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1.5">Appearance</div>
                <button
                  onClick={() => { setTheme("light"); setDropdownOpen(false); }}
                  className={`flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors ${theme === "light" ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
                >
                  <SunIcon className="w-4 h-4" /> Light Mode
                </button>
                <button
                  onClick={() => { setTheme("dark"); setDropdownOpen(false); }}
                  className={`flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors ${theme === "dark" || (!theme && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
                >
                  <MoonIcon className="w-4 h-4" /> Dark Mode
                </button>
                <button
                  onClick={() => { setTheme("system"); setDropdownOpen(false); }}
                  className={`flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors ${theme === "system" ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
                >
                  <ComputerDesktopIcon className="w-4 h-4" /> System Preference
                </button>
              </div>

              <button 
                onClick={async () => { 
                  await signOut(); 
                  router.replace("/login"); 
                }}
                className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 mt-1 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <ArrowLeftStartOnRectangleIcon className="w-4 h-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
