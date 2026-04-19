import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full flex flex-col bg-background text-foreground transition-colors duration-300">
      <SidebarProvider>
        {/* Main App Sidebar strictly locked to Left */}
        <AppSidebar />
        
        {/* Sidebar Inset expands automatically and contains Navbar and Content */}
        <SidebarInset className="flex w-full flex-col h-screen overflow-hidden bg-background relative">
          {/* Dotted Background - fades at edges via radial vignette */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
              maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
            }}
          />
          
          <div className="relative z-10 flex flex-col w-full h-full">
            <Navbar />
            <main className="flex-1 w-full overflow-y-auto">
              {children}
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
