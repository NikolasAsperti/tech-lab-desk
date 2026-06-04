import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Usuario } from "@/types";
import { login as apiLogin } from "@/services/api";

interface AuthContextType {
  user: Usuario | null;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<Pick<Usuario, "nome" | "sala">>) => void;
  isTecnico: boolean;
  isAdmin: boolean;
  /** Staff = admin ou técnico (vê todos os chamados, pode agir) */
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);
const STORAGE_KEY = "labtech.user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Usuario) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, [user]);

  const login = useCallback(async (email: string, senha: string): Promise<boolean> => {
    const result = await apiLogin(email, senha);
    if (result.success && result.usuario) {
      setUser(result.usuario);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const updateProfile = useCallback((data: Partial<Pick<Usuario, "nome" | "sala">>) => {
    setUser(prev => prev ? { ...prev, ...data } : prev);
  }, []);

  const isTecnico = user?.papel === "tecnico";
  const isAdmin = user?.papel === "admin";
  const isStaff = isTecnico || isAdmin;

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, isTecnico, isAdmin, isStaff }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
