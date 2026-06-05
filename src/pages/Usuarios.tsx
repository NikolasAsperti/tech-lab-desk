import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import type { Usuario } from "@/types";
import { getUsuarios, setUsuarioAtivo } from "@/services/api";
import { Power } from "lucide-react";

export default function Usuarios() {
  const { isAdmin } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    getUsuarios().then(setUsuarios);
  }, []);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleToggleAtivo = async (u: Usuario) => {
    const updated = await setUsuarioAtivo(u.id, !u.ativo);
    if (updated) {
      setUsuarios((prev) => prev.map((x) => (x.id === u.id ? updated : x)));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Usuários & Permissões</h1>
        <p className="text-sm text-muted-foreground">Gerenciamento de acessos ao sistema</p>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="px-4 py-2.5 text-left font-medium">Nome</th>
              <th className="px-4 py-2.5 text-left font-medium">Email</th>
              <th className="px-4 py-2.5 text-left font-medium">Papel</th>
              <th className="px-4 py-2.5 text-left font-medium hidden sm:table-cell">Sala</th>
              <th className="px-4 py-2.5 text-left font-medium hidden md:table-cell">Criado em</th>
              <th className="px-4 py-2.5 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 font-medium text-card-foreground">{u.nome}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    u.papel === "admin"
                      ? "bg-primary/15 text-primary"
                      : u.papel === "tecnico"
                        ? "bg-status-progress-bg text-status-progress-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}>
                    {u.papel === "admin" ? "Admin" : u.papel === "tecnico" ? "Técnico" : "Usuário"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{u.sala || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{u.criadoEm}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    u.ativo ? "bg-status-done-bg text-status-done-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {u.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
