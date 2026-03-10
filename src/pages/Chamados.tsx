import { useState } from "react";
import { chamados as allChamados, Chamado, tecnicos } from "@/data/mock-data";
import { getFormatChecklist } from "@/data/checklist-catalog";
import { useAuth } from "@/contexts/AuthContext";
import { StatusBadge, PrioridadeBadge } from "./Index";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, MessageSquare, CheckSquare, Square } from "lucide-react";

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

  // Modal states
  const [showAtenderModal, setShowAtenderModal] = useState(false);
  const [atenderComment, setAtenderComment] = useState("");

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<"em_andamento" | "concluido" | "">("");
  const [statusComment, setStatusComment] = useState("");

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState("");

  // Conclusion flow: toggle "foi formatado?" + checklist
  const [foiFormatado, setFoiFormatado] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});
  const [checklistObs, setChecklistObs] = useState<Record<string, string>>({});
  const [checklistJustificativa, setChecklistJustificativa] = useState("");

  let filtered = isTecnico ? allChamados : allChamados.filter((c) => c.criadoPorId === user?.id);

  if (activeTab === "meus") {
    filtered = allChamados.filter((c) => c.responsavel === user?.nome);
  } else if (activeTab !== "todos") {
    filtered = filtered.filter((c) => c.status === activeTab);
  }

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
    if (!selectedChamado || !statusComment.trim() || !pendingStatus) return;
    
    // If concluding and "foi formatado" is true, open checklist modal instead
    if (pendingStatus === "concluido" && foiFormatado) {
      const items = getFormatChecklist(selectedChamado.sala);
      const initial: Record<string, boolean> = {};
      items.forEach((it) => (initial[it.id] = false));
      setChecklistState(initial);
      setChecklistObs({});
      setChecklistJustificativa("");
      setShowStatusModal(false);
      setShowChecklistModal(true);
      return;
    }

    // Normal status update
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    selectedChamado.status = pendingStatus;
    const statusLabel = pendingStatus === "em_andamento" ? "Em Andamento" : "Concluído";
    selectedChamado.timeline.push({
      data: now,
      descricao: `Status alterado para ${statusLabel}: ${statusComment}`,
      autor: user?.nome || "",
      tipo: "tecnico",
    });
    setShowStatusModal(false);
    setStatusComment("");
    setPendingStatus("");
    setFoiFormatado(false);
    setSelectedChamado({ ...selectedChamado });
  };

  const handleChecklistConclude = () => {
    if (!selectedChamado) return;
    const items = getFormatChecklist(selectedChamado.sala);
    const allChecked = items.every((it) => checklistState[it.id]);
    if (!allChecked && !checklistJustificativa.trim()) return;

    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    selectedChamado.status = "concluido";

    // Add status comment
    selectedChamado.timeline.push({
      data: now,
      descricao: `Status alterado para Concluído: ${statusComment}`,
      autor: user?.nome || "",
      tipo: "tecnico",
    });

    // Add formatting checklist entry
    const checkedItems = items.filter((it) => checklistState[it.id]);
    const uncheckedItems = items.filter((it) => !checklistState[it.id]);
    let checklistDesc = `Checklist de Formatação — ${selectedChamado.sala}: ${checkedItems.length}/${items.length} itens concluídos.`;
    
    // Add observations
    const obsEntries = Object.entries(checklistObs).filter(([, v]) => v.trim());
    if (obsEntries.length > 0) {
      const obsLabels = obsEntries.map(([id, obs]) => {
        const item = items.find((it) => it.id === id);
        return `${item?.label}: ${obs}`;
      });
      checklistDesc += ` Observações: ${obsLabels.join("; ")}`;
    }

    if (uncheckedItems.length > 0) {
      checklistDesc += ` Itens pendentes: ${uncheckedItems.map((it) => it.label).join(", ")}. Justificativa: ${checklistJustificativa}`;
    }

    selectedChamado.timeline.push({
      data: now,
      descricao: checklistDesc,
      autor: user?.nome || "",
      tipo: "tecnico",
    });

    setShowChecklistModal(false);
    setStatusComment("");
    setPendingStatus("");
    setFoiFormatado(false);
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

  const openStatusChange = (status: "em_andamento" | "concluido") => {
    setPendingStatus(status);
    setStatusComment("");
    setFoiFormatado(false);
    setShowStatusModal(true);
  };

  const visibleTimeline = selectedChamado
    ? isTecnico
      ? selectedChamado.timeline
      : selectedChamado.timeline.filter((e) => e.tipo !== "tecnico")
    : [];

  // Checklist helpers
  const checklistItems = selectedChamado ? getFormatChecklist(selectedChamado.sala) : [];
  const allChecklistChecked = checklistItems.every((it) => checklistState[it.id]);
  const canConcludeChecklist = allChecklistChecked || checklistJustificativa.trim().length > 0;

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

      {/* Technician filter */}
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
      <Dialog open={!!selectedChamado && !showAtenderModal && !showStatusModal && !showCommentModal && !showChecklistModal} onOpenChange={() => setSelectedChamado(null)}>
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
                  <div className="border-t pt-4 space-y-3">
                    {!selectedChamado.responsavel && (
                      <button
                        onClick={() => setShowAtenderModal(true)}
                        className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
                      >
                        Atender Chamado
                      </button>
                    )}

                    {selectedChamado.responsavel && (
                      <div className="flex flex-col gap-2">
                        {selectedChamado.status === "aberto" && (
                          <button
                            onClick={() => openStatusChange("em_andamento")}
                            className="w-full rounded-md bg-status-progress-bg text-status-progress-foreground px-3 py-2 text-sm font-medium hover:opacity-80 transition-opacity border border-status-progress/20"
                          >
                            Marcar como Em Andamento
                          </button>
                        )}
                        {(selectedChamado.status === "aberto" || selectedChamado.status === "em_andamento") && (
                          <button
                            onClick={() => openStatusChange("concluido")}
                            className="w-full rounded-md bg-status-done-bg text-status-done-foreground px-3 py-2 text-sm font-medium hover:opacity-80 transition-opacity border border-status-done/20"
                          >
                            Marcar como Concluído
                          </button>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => setShowCommentModal(true)}
                      className="w-full rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="h-4 w-4" /> Adicionar Comentário
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
                  <label className="text-xs text-muted-foreground">Nome da Máquina</label>
                  <p className="font-mono font-medium text-card-foreground">{selectedChamado.maquinaId}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Laboratório</label>
                  <p className="font-medium text-card-foreground">{selectedChamado.sala}</p>
                </div>
              </div>
              <div className="rounded-lg border bg-muted/40 p-3">
                <label className="text-xs font-medium text-muted-foreground">Descrição do Problema</label>
                <p className="text-sm text-card-foreground mt-1">{selectedChamado.descricao}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="text-xs text-muted-foreground">Data/Hora</label>
                  <p className="text-card-foreground">{new Date().toLocaleString("pt-BR")}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Técnico Responsável</label>
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

      {/* Status Update Modal — now with "foi formatado?" toggle for conclusion */}
      <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {pendingStatus === "em_andamento" ? "Marcar como Em Andamento" : "Marcar como Concluído"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <p className="text-sm text-muted-foreground">
              Adicione um comentário obrigatório para registrar a alteração de status.
            </p>
            <textarea
              value={statusComment}
              onChange={(e) => setStatusComment(e.target.value)}
              placeholder="Descreva o motivo da alteração..."
              className="w-full rounded-md border bg-secondary/50 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring min-h-[100px] resize-none"
            />

            {/* Toggle: "O computador foi formatado?" — only for conclusion */}
            {pendingStatus === "concluido" && (
              <div className="rounded-lg border p-4 space-y-2">
                <p className="text-sm font-semibold text-card-foreground">O computador foi formatado?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFoiFormatado(false)}
                    className={`flex-1 rounded-md px-4 py-3 text-sm font-semibold border-2 transition-all ${
                      !foiFormatado
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    Não
                  </button>
                  <button
                    onClick={() => setFoiFormatado(true)}
                    className={`flex-1 rounded-md px-4 py-3 text-sm font-semibold border-2 transition-all ${
                      foiFormatado
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    Sim
                  </button>
                </div>
                {foiFormatado && (
                  <p className="text-xs text-muted-foreground">
                    Ao confirmar, será aberto o checklist de formatação do laboratório {selectedChamado?.sala}.
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowStatusModal(false)} className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors">Cancelar</button>
              <button
                onClick={handleStatusUpdate}
                disabled={!statusComment.trim()}
                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {foiFormatado && pendingStatus === "concluido" ? "Preencher Checklist" : "Confirmar"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Formatting Checklist Modal */}
      <Dialog open={showChecklistModal} onOpenChange={setShowChecklistModal}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Checklist de Formatação — {selectedChamado?.sala}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <p className="text-sm text-muted-foreground">
              Marque cada item conforme finalizar a instalação/configuração. Todos os itens devem estar concluídos ou uma justificativa deve ser fornecida.
            </p>

            <div className="divide-y rounded-lg border">
              {checklistItems.map((item) => (
                <div key={item.id} className="px-4 py-3 space-y-2">
                  <button
                    onClick={() =>
                      setChecklistState((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                    }
                    className="flex items-center gap-3 w-full text-left group"
                  >
                    {checklistState[item.id] ? (
                      <CheckSquare className="h-5 w-5 text-primary shrink-0" />
                    ) : (
                      <Square className="h-5 w-5 text-muted-foreground shrink-0 group-hover:text-primary/60 transition-colors" />
                    )}
                    <span className={`text-sm font-medium ${checklistState[item.id] ? "text-primary line-through" : "text-card-foreground"}`}>
                      {item.label}
                    </span>
                  </button>
                  <input
                    type="text"
                    placeholder="Observação (opcional)"
                    value={checklistObs[item.id] || ""}
                    onChange={(e) =>
                      setChecklistObs((prev) => ({ ...prev, [item.id]: e.target.value }))
                    }
                    className="ml-8 w-[calc(100%-2rem)] rounded border bg-secondary/50 px-2 py-1 text-xs outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                  />
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-primary transition-all rounded-full"
                  style={{
                    width: `${(checklistItems.filter((it) => checklistState[it.id]).length / checklistItems.length) * 100}%`,
                  }}
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {checklistItems.filter((it) => checklistState[it.id]).length}/{checklistItems.length}
              </span>
            </div>

            {/* Justificativa if not all checked */}
            {!allChecklistChecked && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Justificativa para itens pendentes (obrigatório)
                </label>
                <textarea
                  value={checklistJustificativa}
                  onChange={(e) => setChecklistJustificativa(e.target.value)}
                  placeholder="Explique por que alguns itens não foram concluídos..."
                  className="mt-1 w-full rounded-md border bg-secondary/50 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring min-h-[60px] resize-none"
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowChecklistModal(false);
                  setShowStatusModal(true);
                }}
                className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleChecklistConclude}
                disabled={!canConcludeChecklist}
                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Concluir Chamado
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
