import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon, Bell, Menu, ChevronDown, LogOut, Edit, ClipboardList } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import { getChamados } from "@/services/api";
import type { Chamado } from "@/types";

interface TopBarProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

export function TopBar({ onMenuClick, sidebarCollapsed }: TopBarProps) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, logout, isStaff } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [lastSeen, setLastSeen] = useState<string>(() => {
    if (!user) return "";
    return localStorage.getItem(`labtech.notif.lastSeen.${user.id}`) || "";
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const notifEnabled = !!user;

  useEffect(() => {
    if (!notifEnabled) return;
    let active = true;
    const load = () => getChamados().then((c) => { if (active) setChamados(c); });
    load();
    const id = setInterval(load, 5000);
    return () => { active = false; clearInterval(id); };
  }, [notifEnabled]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const chamadosEscopo = isStaff
    ? chamados
    : chamados.filter((c) => c.criadoPorId === user?.id);

  const novosChamados = notifEnabled
    ? [...chamadosEscopo]
        .filter((c) => !lastSeen || c.criadoEm > lastSeen)
        .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))
    : [];
  const unreadCount = novosChamados.length;

  // Snapshot da lista exibida quando o dropdown abre, para não esvaziar ao marcar como lido
  const [snapshot, setSnapshot] = useState<Chamado[]>([]);
  const itensExibidos = notifOpen ? snapshot : novosChamados;

  const handleOpenNotif = () => {
    setNotifOpen((prev) => {
      const next = !prev;
      if (next && notifEnabled) {
        setSnapshot(novosChamados);
        if (chamadosEscopo.length > 0) {
          const newest = chamadosEscopo.reduce((acc, c) => (c.criadoEm > acc ? c.criadoEm : acc), "");
          if (newest && user) {
            setLastSeen(newest);
            localStorage.setItem(`labtech.notif.lastSeen.${user.id}`, newest);
          }
        }
      }
      return next;
    });
  };

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

      <div className="flex-1" />



      <div className="flex items-center gap-2">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {notifEnabled && (
          <div ref={notifRef} className="relative">
            <button
              onClick={handleOpenNotif}
              className="relative flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="Notificações"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-1 w-80 rounded-md border bg-popover shadow-lg animate-fade-in">
                <div className="px-3 py-2 border-b">
                  <p className="text-sm font-medium">Notificações</p>
                  <p className="text-xs text-muted-foreground">
                    {unreadCount > 0 ? `${unreadCount} novo(s) chamado(s)` : "Sem novidades"}
                  </p>
                </div>
                <div className="max-h-80 overflow-y-auto py-1">
                  {novosChamados.length === 0 ? (
                    <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                      Nenhum chamado novo no momento.
                    </div>
                  ) : (
                    novosChamados.slice(0, 10).map((c) => (
                      <button
                        key={c.id}
                        onClick={() => { setNotifOpen(false); navigate("/chamados"); }}
                        className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-accent transition-colors"
                      >
                        <ClipboardList className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{c.titulo}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {isStaff ? (
                              <>Aberto por <span className="font-medium text-foreground">{c.criadoPor}</span></>
                            ) : (
                              <>Você criou um chamado</>
                            )}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{c.criadoEm}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}


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
              <button onClick={() => { setDropdownOpen(false); navigate("/perfil"); }} className="flex w-full items-center gap-2 rounded-sm px-3 py-1.5 text-sm hover:bg-accent transition-colors">
                <Edit className="h-3.5 w-3.5" /> Editar Perfil
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
