"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";
import { 
  Square3Stack3DIcon, 
  MapIcon, 
  MicrophoneIcon, 
  ChartPieIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  BookOpenIcon,
  Cog8ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ArrowLeftIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "@/lib/context/AuthContext";

interface SidebarItem {
  title: string;
  url: string;
  icon: any;
  subItems?: { name: string; url: string }[];
}

const baseItems: SidebarItem[] = [
  { title: "Mission Control", url: "/dashboard", icon: Square3Stack3DIcon },
  { 
    title: "Learning Roadmaps", 
    url: "#", 
    icon: MapIcon,
    subItems: [{ name: "Active Track", url: "#" }, { name: "Explore Topics", url: "#" }, { name: "Completed", url: "#" }]
  },
  { 
    title: "Mock Interviews", 
    url: "#", 
    icon: MicrophoneIcon,
    subItems: [{ name: "Start AI Interview", url: "#" }, { name: "Past Recordings", url: "#" }, { name: "Metrics", url: "#" }]
  },
  { title: "Skill Analytics", url: "#", icon: ChartPieIcon },
  { title: "Community Pods", url: "#", icon: UserGroupIcon },
  { 
    title: "Career Hub", 
    url: "#", 
    icon: DocumentTextIcon,
    subItems: [{ name: "AI Resume Builder", url: "#" }, { name: "Cover Letters", url: "#" }, { name: "Job Tracker", url: "#" }]
  },
  { title: "Settings", url: "#", icon: Cog8ToothIcon },
];

export function AppSidebar() {
  const { setOpen, state } = useSidebar();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const { profile } = useAuth();
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith('/admin');

  // Define Admin specific items
  const adminItems: SidebarItem[] = [
    { title: "Back to App", url: "/dashboard", icon: ArrowLeftIcon },
    { title: "User Control", url: "/admin", icon: UserGroupIcon },
    { title: "Course Editor", url: "/admin/courses", icon: BookOpenIcon },
    { title: "System Settings", url: "/admin/settings", icon: Cog8ToothIcon },
  ];

  const items: SidebarItem[] = isAdminPath ? adminItems : [...baseItems];
  
  if (!isAdminPath && profile?.role === "admin") {
    items.unshift({ title: "Admin Portal", url: "/admin", icon: ShieldCheckIcon });
  }

  const toggleMenu = (title: string) => {
    if (state === "collapsed") setOpen(true);
    setOpenMenus(prev => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border bg-background z-40 transition-all duration-300"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        setOpen(false);
        setOpenMenus({}); // Auto collapse submenus when sidebar collapses
      }}
    >
      <SidebarHeader className="flex h-14 items-center justify-center border-b border-border bg-background">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-500/20 transition-transform group-hover/sidebar:scale-110">
           <svg viewBox="0 0 18 18" fill="none" className="h-4 w-4">
             <path d="M9 2L15.5 5.5V12.5L9 16L2.5 12.5V5.5L9 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
             <circle cx="9" cy="9" r="2.5" fill="white" />
           </svg>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-background py-3">
        <SidebarGroup>
          <div className="mb-2 px-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground opacity-0 transition-opacity duration-200 group-data-[state=expanded]:opacity-100">
            Navigation
          </div>
          <SidebarMenu className="gap-1.5 px-2">
            {items.map((item) => (
              <div 
                key={item.title} 
                onMouseEnter={() => { if (item.subItems) { setOpenMenus(p => ({...p, [item.title]: true})); } }}
                onMouseLeave={() => { if (item.subItems) { setOpenMenus(p => ({...p, [item.title]: false})); } }}
              >
                <SidebarMenuItem>
                  {item.subItems ? (
                    <button
                      onClick={() => toggleMenu(item.title)}
                      className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span className="font-medium whitespace-nowrap opacity-0 transition-all duration-200 group-data-[state=expanded]:opacity-100">
                          {item.title}
                        </span>
                      </div>
                      <ChevronDownIcon 
                        className={`h-3.5 w-3.5 opacity-0 transition-all duration-300 group-data-[state=expanded]:opacity-100 ${openMenus[item.title] ? "rotate-180 text-foreground" : "text-muted-foreground"}`} 
                      />
                    </button>
                  ) : (
                    <SidebarMenuButton
                      render={<a href={item.url} />}
                      tooltip={item.title}
                      className="flex items-center gap-3 rounded-lg px-2 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span className="font-medium whitespace-nowrap opacity-0 transition-all duration-200 group-data-[state=expanded]:opacity-100">
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
                
                {/* Expandable Sub-items */}
                {item.subItems && (
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openMenus[item.title] && state === "expanded" ? "max-h-[200px] opacity-100 mt-1" : "max-h-0 opacity-0"}`}
                  >
                    <div className="pl-10 pr-2 flex flex-col gap-1 border-l-2 border-border ml-4 my-1">
                      {item.subItems.map((sub: { name: string; url: string }) => (
                        <a 
                          key={sub.name} 
                          href={sub.url}
                          className="text-sm font-medium text-muted-foreground hover:text-foreground px-2 py-1.5 rounded-md hover:bg-muted transition-colors whitespace-nowrap"
                        >
                          {sub.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border bg-background p-3">
        <SidebarMenuButton 
            onClick={() => setOpen(state === "expanded" ? false : true)} 
            className="flex items-center justify-center text-muted-foreground transition hover:bg-muted hover:text-foreground rounded-lg py-3"
        >
            {state === "expanded" ? <ChevronLeftIcon className="h-5 w-5 shrink-0" /> : <ChevronRightIcon className="h-5 w-5 shrink-0" />}
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}