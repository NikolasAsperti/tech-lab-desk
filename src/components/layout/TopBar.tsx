import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon, Bell, Menu, Search, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TopBarProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

export function TopBar({ onMenuClick, sidebarCollapsed }: TopBarProps) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 transition-all duration-300",
        sidebarCollapsed ? "md:pl-20" : "md:pl-64"
      )}
    >
      <button onClick={onMenuClick} className="md:hidden text-muted-foreground hover:text-foreground transition-colors">
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar chamados, máquinas..."
          className="w-full rounded-md border bg-secondary/50 py-1.5 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring transition-shadow"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <button className="relative flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
        </button>

        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-accent transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
              {user?.nome.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <span className="hidden text-sm font-medium sm:block">{user?.nome.split(" ")[0]}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 rounded-md border bg-popover p-1 shadow-lg animate-fade-in">
              <div className="px-3 py-2 border-b mb-1">
                <p className="text-sm font-medium">{user?.nome}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <button className="flex w-full items-center gap-2 rounded-sm px-3 py-1.5 text-sm hover:bg-accent transition-colors">
                <User className="h-3.5 w-3.5" /> Perfil
              </button>
              <button className="flex w-full items-center gap-2 rounded-sm px-3 py-1.5 text-sm hover:bg-accent transition-colors">
                <Settings className="h-3.5 w-3.5" /> Configurações
              </button>
              <div className="border-t mt-1 pt-1">
                <button onClick={logout} className="flex w-full items-center gap-2 rounded-sm px-3 py-1.5 text-sm text-destructive hover:bg-accent transition-colors">
                  <LogOut className="h-3.5 w-3.5" /> Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
