import React, { createContext, useContext, useState, useCallback } from "react";
import type { Usuario } from "@/types";
import { login as apiLogin } from "@/services/api";

interface AuthContextType {
  user: Usuario | null;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  isTecnico: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);

  const login = useCallback((email: string, senha: string): boolean => {
    const found = mockLoginUsers.find(
      (u) => u.email === email && u.senha === senha
    );
    if (found) {
      setUser(found.usuario);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const isTecnico = user?.papel === "tecnico";

  return (
    <AuthContext.Provider value={{ user, login, logout, isTecnico }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
