import { useState } from "react";
import { chamados as allChamados, Chamado } from "@/data/mock-data";
import { useAuth } from "@/contexts/AuthContext";
import { StatusBadge, PrioridadeBadge } from "./Index";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, User, MessageSquare } from "lucide-react";

type TabFilter = "todos" | "aberto" | "em_andamento" | "concluido" | "meus";

const tabs: { key: TabFilter; label: string; tecnicoOnly?: boolean }[] = [
  { key: "todos", label: "Todos" },
  { key: "aberto", label: "Pendentes" },
  { key: "em_andamento", label: "Em Andamento" },
  { key: "concluido", label: "Concluídos" },
  { key: "meus", label: "Meus Atribuídos", tecnicoOnly: true },
];

export default function Chamados() {
  const { user, isTecnico } = useAuth();
  const [activeTab, setActiveTab] = useState<TabFilter>("todos");
  const [selectedChamado, setSelectedChamado] = useState<Chamado | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  let filtered = isTecnico ? allChamados : allChamados.filter((c) => c.criadoPorId === user?.id);

  if (activeTab === "meus") {
    filtered = allChamados.filter((c) => c.responsavel === user?.nome);
  } else if (activeTab !== "todos") {
    filtered = filtered.filter((c) => c.status === activeTab);
  }

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (c) => c.titulo.toLowerCase().includes(term) || c.id.toLowerCase().includes(term) || c.sala.toLowerCase().includes(term)
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Chamados</h1>
          <p className="text-sm text-muted-foreground">{isTecnico ? "Todos os chamados do sistema" : "Seus chamados abertos"}</p>
        </div>
        <input
          type="text"
          placeholder="Buscar por título, ID ou sala..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-md border bg-secondary/50 px-3 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring w-full sm:max-w-xs transition-shadow"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b overflow-x-auto">
        {tabs.map((tab) => {
          if (tab.tecnicoOnly && !isTecnico) return null;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="px-4 py-2.5 text-left font-medium">ID</th>
              <th className="px-4 py-2.5 text-left font-medium">Título</th>
              <th className="px-4 py-2.5 text-left font-medium hidden sm:table-cell">Sala</th>
              <th className="px-4 py-2.5 text-left font-medium hidden md:table-cell">Máquina</th>
              <th className="px-4 py-2.5 text-left font-medium">Status</th>
              <th className="px-4 py-2.5 text-left font-medium hidden lg:table-cell">Prioridade</th>
              <th className="px-4 py-2.5 text-left font-medium hidden lg:table-cell">Responsável</th>
              <th className="px-4 py-2.5 text-left font-medium hidden md:table-cell">Data</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.id}
                onClick={() => setSelectedChamado(c)}
                className="border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.id}</td>
                <td className="px-4 py-3 font-medium text-card-foreground max-w-[200px] truncate">{c.titulo}</td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{c.sala}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden md:table-cell">{c.maquinaId}</td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3 hidden lg:table-cell"><PrioridadeBadge prioridade={c.prioridade} /></td>
                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{c.responsavel || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{c.criadoEm}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  Nenhum chamado encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedChamado} onOpenChange={() => setSelectedChamado(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {selectedChamado && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="font-mono text-sm text-muted-foreground">{selectedChamado.id}</span>
                  <span>{selectedChamado.titulo}</span>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={selectedChamado.status} />
                  <PrioridadeBadge prioridade={selectedChamado.prioridade} />
                </div>
                <p className="text-sm text-card-foreground">{selectedChamado.descricao}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Sala: <span className="text-card-foreground">{selectedChamado.sala}</span></div>
                  <div className="text-muted-foreground">Máquina: <span className="font-mono text-card-foreground">{selectedChamado.maquinaId}</span></div>
                  <div className="text-muted-foreground">Criado por: <span className="text-card-foreground">{selectedChamado.criadoPor}</span></div>
                  <div className="text-muted-foreground">Responsável: <span className="text-card-foreground">{selectedChamado.responsavel || "—"}</span></div>
                </div>

                {/* Timeline */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Linha do Tempo
                  </h3>
                  <div className="space-y-3">
                    {selectedChamado.timeline.map((entry, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                          {i < selectedChamado.timeline.length - 1 && <div className="w-px flex-1 bg-border" />}
                        </div>
                        <div className="pb-3">
                          <p className="text-sm text-card-foreground">{entry.descricao}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {entry.autor} · {entry.data}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions for technicians */}
                {isTecnico && selectedChamado.status !== "concluido" && (
                  <div className="border-t pt-4 flex flex-wrap gap-2">
                    {!selectedChamado.responsavel && (
                      <button className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
                        Pegar para mim
                      </button>
                    )}
                    <button className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors">
                      Atualizar Status
                    </button>
                    <button className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors">
                      Adicionar Comentário
                    </button>
                    <button className="rounded-md bg-status-done px-3 py-1.5 text-sm font-medium text-status-done-foreground hover:opacity-90 transition-opacity">
                      Marcar como Concluído
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
