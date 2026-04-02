import { useState, useEffect } from "react";
import type { Chamado, Usuario, FormatChecklistItem } from "@/types";
import * as api from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { StatusBadge, PrioridadeBadge } from "./Index";
import { Modal, ModalHeader, ModalTitle } from "@/components/ui/Modal";
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
  const [allChamados, setAllChamados] = useState<Chamado[]>([]);
  const [tecnicos, setTecnicos] = useState<Usuario[]>([]);
  const [activeTab, setActiveTab] = useState<TabFilter>("todos");
  const [selectedChamado, setSelectedChamado] = useState<Chamado | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tecnicoFilter, setTecnicoFilter] = useState("todos");

  const [showAtenderModal, setShowAtenderModal] = useState(false);
  const [atenderComment, setAtenderComment] = useState("");

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<"em_andamento" | "concluido" | "">("");
  const [statusComment, setStatusComment] = useState("");

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState("");

  const [foiFormatado, setFoiFormatado] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [checklistItems, setChecklistItems] = useState<FormatChecklistItem[]>([]);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});
  const [checklistObs, setChecklistObs] = useState<Record<string, string>>({});
  const [checklistJustificativa, setChecklistJustificativa] = useState("");

  useEffect(() => {
    api.getChamados().then(setAllChamados);
    api.getTecnicos().then(setTecnicos);
  }, []);

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

  const handleAtender = async () => {
    if (!selectedChamado || !atenderComment.trim()) return;
    const updated = await api.atribuirChamado(selectedChamado.id, user?.nome || "", atenderComment);
    if (updated) {
      setShowAtenderModal(false);
      setAtenderComment("");
      setSelectedChamado(updated);
      api.getChamados().then(setAllChamados);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedChamado || !statusComment.trim() || !pendingStatus) return;
    if (pendingStatus === "concluido" && foiFormatado) {
      const items = await api.getFormatChecklist(selectedChamado.sala);
      const initial: Record<string, boolean> = {};
      items.forEach((it) => (initial[it.id] = false));
      setChecklistItems(items);
      setChecklistState(initial);
      setChecklistObs({});
      setChecklistJustificativa("");
      setShowStatusModal(false);
      setShowChecklistModal(true);
      return;
    }
    const updated = await api.updateChamadoStatus(selectedChamado.id, pendingStatus, statusComment, user?.nome || "");
    if (updated) {
      setShowStatusModal(false);
      setStatusComment("");
      setPendingStatus("");
      setFoiFormatado(false);
      setSelectedChamado(updated);
      api.getChamados().then(setAllChamados);
    }
  };

  const handleChecklistConclude = async () => {
    if (!selectedChamado) return;
    const allChecked = checklistItems.every((it) => checklistState[it.id]);
    if (!allChecked && !checklistJustificativa.trim()) return;

    const checkedItems = checklistItems.filter((it) => checklistState[it.id]);
    const uncheckedItems = checklistItems.filter((it) => !checklistState[it.id]);
    let checklistDesc = `Checklist de Formatação — ${selectedChamado.sala}: ${checkedItems.length}/${checklistItems.length} itens concluídos.`;
    const obsEntries = Object.entries(checklistObs).filter(([, v]) => v.trim());
    if (obsEntries.length > 0) {
      const obsLabels = obsEntries.map(([id, obs]) => {
        const item = checklistItems.find((it) => it.id === id);
        return `${item?.label}: ${obs}`;
      });
      checklistDesc += ` Observações: ${obsLabels.join("; ")}`;
    }
    if (uncheckedItems.length > 0) {
      checklistDesc += ` Itens pendentes: ${uncheckedItems.map((it) => it.label).join(", ")}. Justificativa: ${checklistJustificativa}`;
    }

    const updated = await api.addChecklistToChamado(selectedChamado.id, checklistDesc, user?.nome || "");
    if (updated) {
      setShowChecklistModal(false);
      setStatusComment("");
      setPendingStatus("");
      setFoiFormatado(false);
      setSelectedChamado(updated);
      api.getChamados().then(setAllChamados);
    }
  };

  const handleAddComment = async () => {
    if (!selectedChamado || !newComment.trim()) return;
    const updated = await api.addChamadoComment(selectedChamado.id, newComment, user?.nome || "");
    if (updated) {
      setShowCommentModal(false);
      setNewComment("");
      setSelectedChamado(updated);
    }
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

  const allChecklistChecked = checklistItems.every((it) => checklistState[it.id]);
  const canConcludeChecklist = allChecklistChecked || checklistJustificativa.trim().length > 0;

  const detailOpen = !!selectedChamado && !showAtenderModal && !showStatusModal && !showCommentModal && !showChecklistModal;

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

      {/* Detail Modal */}
      <Modal open={detailOpen} onClose={() => setSelectedChamado(null)} className="max-h-[85vh] overflow-y-auto">
        {selectedChamado && (
          <>
            <ModalHeader>
              <ModalTitle className="flex items-center gap-2">
                <span className="font-mono text-sm text-muted-foreground">{selectedChamado.id}</span>
                <span>{selectedChamado.titulo}</span>
              </ModalTitle>
            </ModalHeader>
            <div className="space-y-4">
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
                        <p className="text-xs text-muted-foreground mt-0.5">{entry.autor} · {entry.data}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

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
      </Modal>

      {/* Atender Chamado Modal */}
      <Modal open={showAtenderModal} onClose={() => setShowAtenderModal(false)} className="max-w-md">
        <ModalHeader><ModalTitle>Atender Chamado</ModalTitle></ModalHeader>
        {selectedChamado && (
          <div className="space-y-4">
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
      </Modal>

      {/* Status Update Modal */}
      <Modal open={showStatusModal} onClose={() => setShowStatusModal(false)} className="max-w-md">
        <ModalHeader>
          <ModalTitle>{pendingStatus === "em_andamento" ? "Marcar como Em Andamento" : "Marcar como Concluído"}</ModalTitle>
        </ModalHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Adicione um comentário obrigatório para registrar a alteração de status.</p>
          <textarea
            value={statusComment}
            onChange={(e) => setStatusComment(e.target.value)}
            placeholder="Descreva o motivo da alteração..."
            className="w-full rounded-md border bg-secondary/50 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring min-h-[100px] resize-none"
          />
          {pendingStatus === "concluido" && (
            <div className="rounded-lg border p-4 space-y-2">
              <p className="text-sm font-semibold text-card-foreground">O computador foi formatado?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setFoiFormatado(false)}
                  className={`flex-1 rounded-md px-4 py-3 text-sm font-semibold border-2 transition-all ${
                    !foiFormatado ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  Não
                </button>
                <button
                  onClick={() => setFoiFormatado(true)}
                  className={`flex-1 rounded-md px-4 py-3 text-sm font-semibold border-2 transition-all ${
                    foiFormatado ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/30"
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
      </Modal>

      {/* Formatting Checklist Modal */}
      <Modal open={showChecklistModal} onClose={() => setShowChecklistModal(false)} className="max-h-[85vh] overflow-y-auto">
        <ModalHeader><ModalTitle>Checklist de Formatação — {selectedChamado?.sala}</ModalTitle></ModalHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Marque cada item conforme finalizar a instalação/configuração. Todos os itens devem estar concluídos ou uma justificativa deve ser fornecida.
          </p>
          <div className="divide-y rounded-lg border">
            {checklistItems.map((item) => (
              <div key={item.id} className="px-4 py-3 space-y-2">
                <button
                  onClick={() => setChecklistState((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
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
                  onChange={(e) => setChecklistObs((prev) => ({ ...prev, [item.id]: e.target.value }))}
                  className="ml-8 w-[calc(100%-2rem)] rounded border bg-secondary/50 px-2 py-1 text-xs outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full bg-primary transition-all rounded-full"
                style={{ width: `${checklistItems.length > 0 ? (checklistItems.filter((it) => checklistState[it.id]).length / checklistItems.length) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {checklistItems.filter((it) => checklistState[it.id]).length}/{checklistItems.length}
            </span>
          </div>
          {!allChecklistChecked && (
            <div>
              <label className="text-xs font-medium text-muted-foreground">Justificativa para itens pendentes (obrigatório)</label>
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
              onClick={() => { setShowChecklistModal(false); setShowStatusModal(true); }}
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
      </Modal>

      {/* Add Comment Modal */}
      <Modal open={showCommentModal} onClose={() => setShowCommentModal(false)} className="max-w-md">
        <ModalHeader><ModalTitle>Adicionar Comentário</ModalTitle></ModalHeader>
        <div className="space-y-4">
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
      </Modal>
    </div>
  );
}
