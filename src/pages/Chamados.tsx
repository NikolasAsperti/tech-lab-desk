import { useState } from "react";
import { chamados as allChamados, Chamado, tecnicos, usuarios } from "@/data/mock-data";
import { useAuth } from "@/contexts/AuthContext";
import { StatusBadge, PrioridadeBadge } from "./Index";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, MessageSquare } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [tecnicoFilter, setTecnicoFilter] = useState("todos");

  // Modal states for "Atender Chamado"
  const [showAtenderModal, setShowAtenderModal] = useState(false);
  const [atenderComment, setAtenderComment] = useState("");

  // Modal states for status update
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [statusComment, setStatusComment] = useState("");

  // Modal states for comment
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState("");

  let filtered = isTecnico ? allChamados : allChamados.filter((c) => c.criadoPorId === user?.id);

  if (activeTab === "meus") {
    filtered = allChamados.filter((c) => c.responsavel === user?.nome);
  } else if (activeTab !== "todos") {
    filtered = filtered.filter((c) => c.status === activeTab);
  }

  // Technician filter (admin/tecnico only)
  if (isTecnico && tecnicoFilter !== "todos") {
    filtered = filtered.filter((c) => c.responsavel === tecnicoFilter);
  }

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (c) => c.titulo.toLowerCase().includes(term) || c.id.toLowerCase().includes(term) || c.sala.toLowerCase().includes(term)
    );
  }

  const handleAtender = () => {
    if (!selectedChamado || !atenderComment.trim()) return;
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    selectedChamado.responsavel = user?.nome;
    selectedChamado.status = "em_andamento";
    selectedChamado.timeline.push(
      { data: now, descricao: `Chamado atribuído a ${user?.nome}`, autor: "Sistema", tipo: "sistema" },
      { data: now, descricao: atenderComment, autor: user?.nome || "", tipo: "tecnico" }
    );
    setShowAtenderModal(false);
    setAtenderComment("");
    setSelectedChamado({ ...selectedChamado });
  };

  const handleStatusUpdate = () => {
    if (!selectedChamado || !statusComment.trim() || !newStatus) return;
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    selectedChamado.status = newStatus as Chamado["status"];
    selectedChamado.timeline.push({
      data: now,
      descricao: `Status alterado para ${newStatus === "em_andamento" ? "Em Andamento" : newStatus === "concluido" ? "Concluído" : "Aberto"}: ${statusComment}`,
      autor: user?.nome || "",
      tipo: "tecnico",
    });
    setShowStatusModal(false);
    setStatusComment("");
    setNewStatus("");
    setSelectedChamado({ ...selectedChamado });
  };

  const handleAddComment = () => {
    if (!selectedChamado || !newComment.trim()) return;
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    selectedChamado.timeline.push({
      data: now,
      descricao: newComment,
      autor: user?.nome || "",
      tipo: "tecnico",
    });
    setShowCommentModal(false);
    setNewComment("");
    setSelectedChamado({ ...selectedChamado });
  };

  const handleConcluir = () => {
    if (!selectedChamado) return;
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    selectedChamado.status = "concluido";
    selectedChamado.timeline.push({
      data: now,
      descricao: "Chamado concluído",
      autor: user?.nome || "",
      tipo: "tecnico",
    });
    setSelectedChamado({ ...selectedChamado });
  };

  // Filter timeline for non-technicians: hide tecnico entries
  const visibleTimeline = selectedChamado
    ? isTecnico
      ? selectedChamado.timeline
      : selectedChamado.timeline.filter((e) => e.tipo !== "tecnico")
    : [];

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

      {/* Technician filter (admin only) */}
      {isTecnico && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground">Filtrar por técnico:</span>
          {[{ value: "todos", label: "Todos" }, ...tecnicos.map((t) => ({ value: t.nome, label: t.nome }))].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTecnicoFilter(opt.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                tecnicoFilter === opt.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

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
      <Dialog open={!!selectedChamado && !showAtenderModal && !showStatusModal && !showCommentModal} onOpenChange={() => setSelectedChamado(null)}>
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
                    {visibleTimeline.map((entry, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`h-2 w-2 rounded-full mt-1.5 ${
                            entry.tipo === "tecnico" ? "bg-status-progress" : entry.tipo === "sistema" ? "bg-muted-foreground" : "bg-primary"
                          }`} />
                          {i < visibleTimeline.length - 1 && <div className="w-px flex-1 bg-border" />}
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
                      <button
                        onClick={() => { setShowAtenderModal(true); }}
                        className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
                      >
                        Atender Chamado
                      </button>
                    )}
                    <button
                      onClick={() => { setNewStatus(selectedChamado.status === "aberto" ? "em_andamento" : "concluido"); setShowStatusModal(true); }}
                      className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors"
                    >
                      Atualizar Status
                    </button>
                    <button
                      onClick={() => setShowCommentModal(true)}
                      className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors"
                    >
                      Adicionar Comentário
                    </button>
                    <button
                      onClick={handleConcluir}
                      className="rounded-md bg-status-done px-3 py-1.5 text-sm font-medium text-status-done-foreground hover:opacity-90 transition-opacity"
                    >
                      Marcar como Concluído
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Atender Chamado Modal */}
      <Dialog open={showAtenderModal} onOpenChange={setShowAtenderModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Atender Chamado</DialogTitle>
          </DialogHeader>
          {selectedChamado && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="text-xs text-muted-foreground">Máquina</label>
                  <p className="font-mono text-card-foreground">{selectedChamado.maquinaId}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Laboratório</label>
                  <p className="text-card-foreground">{selectedChamado.sala}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Data/Hora</label>
                  <p className="text-card-foreground">{new Date().toLocaleString("pt-BR")}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Técnico</label>
                  <p className="text-card-foreground">{user?.nome}</p>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Comentário inicial (obrigatório)</label>
                <textarea
                  value={atenderComment}
                  onChange={(e) => setAtenderComment(e.target.value)}
                  placeholder="Descreva a primeira ação ou diagnóstico..."
                  className="mt-1 w-full rounded-md border bg-secondary/50 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring min-h-[80px] resize-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowAtenderModal(false)} className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors">Cancelar</button>
                <button
                  onClick={handleAtender}
                  disabled={!atenderComment.trim()}
                  className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  Confirmar Atendimento
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Update Modal */}
      <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Atualizar Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Novo Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aberto">Aberto</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Comentário (obrigatório)</label>
              <textarea
                value={statusComment}
                onChange={(e) => setStatusComment(e.target.value)}
                placeholder="Descreva o motivo da alteração..."
                className="mt-1 w-full rounded-md border bg-secondary/50 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring min-h-[80px] resize-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowStatusModal(false)} className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors">Cancelar</button>
              <button
                onClick={handleStatusUpdate}
                disabled={!statusComment.trim() || !newStatus}
                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Atualizar
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Comment Modal */}
      <Dialog open={showCommentModal} onOpenChange={setShowCommentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Comentário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva seu comentário..."
              className="w-full rounded-md border bg-secondary/50 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring min-h-[100px] resize-none"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowCommentModal(false)} className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors">Cancelar</button>
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Enviar
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
