import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { cn } from "@/utils/cn";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <TopBar onMenuClick={() => setMobileOpen(true)} sidebarCollapsed={collapsed} />
      <main
        className={cn(
          "min-h-[calc(100vh-3.5rem)] p-4 md:p-6 transition-all duration-300",
          collapsed ? "md:ml-16" : "md:ml-60"
        )}
      >
        {children}
      </main>
    </div>
  );
}
