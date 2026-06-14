import { useState, useEffect } from "react";
import type { Maquina } from "@/types";
import { getMaquinas, getLabNames, createLab, createMaquina } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Monitor, Laptop, Cpu, HardDrive, MemoryStick, CircuitBoard, Plus, CheckCircle2 } from "lucide-react";
import { Modal, ModalHeader, ModalTitle } from "@/components/ui/Modal";

const statusStyles: Record<string, string> = {
  funcionando: "bg-status-done-bg text-status-done-foreground",
  em_manutencao: "bg-status-open-bg text-status-open-foreground",
  defeituoso: "bg-destructive/10 text-destructive",
};
const statusLabels: Record<string, string> = {
  funcionando: "Funcionando",
  em_manutencao: "Em Manutenção",
  defeituoso: "Defeituoso",
};

export default function Maquinas() {
  const { isAdmin } = useAuth();
  const [allMaquinas, setAllMaquinas] = useState<Maquina[]>([]);
  const [salas, setSalas] = useState<string[]>([]);
  const [activeSala, setActiveSala] = useState("");
  const [search, setSearch] = useState("");
  const [selectedMaquina, setSelectedMaquina] = useState<Maquina | null>(null);

  // Novo Laboratório
  const [showNovoLab, setShowNovoLab] = useState(false);
  const [novoLabNome, setNovoLabNome] = useState("");
  const [novoLabError, setNovoLabError] = useState("");

  // Nova Máquina
  const [showNovaMaquina, setShowNovaMaquina] = useState(false);
  const [nm, setNm] = useState({
    nome: "", processador: "", placaMae: "", placaVideo: "", ram: "", armazenamento: "", so: "",
  });
  const [nmError, setNmError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const reloadData = async () => {
    const [m, names] = await Promise.all([getMaquinas(), getLabNames()]);
    setAllMaquinas(m);
    setSalas(names);
    return names;
  };

  useEffect(() => {
    reloadData().then((names) => {
      if (names.length > 0 && !activeSala) setActiveSala(names[0]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let filtered = allMaquinas.filter((m) => m.sala === activeSala);
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter((m) => m.id.toLowerCase().includes(term) || m.so.toLowerCase().includes(term));
  }

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleCreateLab = async () => {
    setNovoLabError("");
    const res = await createLab(novoLabNome);
    if (!res.success) {
      setNovoLabError(res.error || "Erro ao criar laboratório.");
      return;
    }
    const nome = novoLabNome.trim();
    setShowNovoLab(false);
    setNovoLabNome("");
    await reloadData();
    setActiveSala(nome);
    showSuccess(`Laboratório "${nome}" criado com sucesso!`);
  };

  const handleCreateMaquina = async () => {
    if (!nm.nome.trim() || !nm.processador.trim() || !nm.placaMae.trim() || !nm.placaVideo.trim() || !nm.ram.trim() || !nm.armazenamento.trim() || !nm.so.trim()) {
      setNmError("Preencha todos os campos.");
      return;
    }
    if (allMaquinas.some((m) => m.id === nm.nome.trim())) {
      setNmError("Já existe uma máquina com esse nome.");
      return;
    }
    await createMaquina({ sala: activeSala, ...nm });
    setShowNovaMaquina(false);
    setNm({ nome: "", processador: "", placaMae: "", placaVideo: "", ram: "", armazenamento: "", so: "" });
    setNmError("");
    await reloadData();
    showSuccess(`Máquina "${nm.nome}" adicionada ao lab ${activeSala}!`);
  };

  return (
    <div className="space-y-4 relative">
      {successMsg && (
        <div className="fixed top-20 right-6 z-[60] flex items-center gap-2 rounded-lg border bg-card px-4 py-3 shadow-lg animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <span className="text-sm font-medium text-card-foreground">{successMsg}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Máquinas / Labs</h1>
          <p className="text-sm text-muted-foreground">Catálogo de equipamentos por laboratório</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar por ID ou SO..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border bg-secondary/50 px-3 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring w-full sm:max-w-xs transition-shadow"
          />
          {isAdmin && (
            <button
              onClick={() => { setNmError(""); setShowNovaMaquina(true); }}
              disabled={!activeSala}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
              Nova Máquina
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-1 border-b overflow-x-auto items-center">
        {salas.map((sala) => (
          <button
            key={sala}
            onClick={() => setActiveSala(sala)}
            className={`whitespace-nowrap px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeSala === sala ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {sala}
          </button>
        ))}
        {isAdmin && (
          <button
            onClick={() => { setNovoLabError(""); setShowNovoLab(true); }}
            title="Adicionar novo laboratório"
            className="ml-1 inline-flex items-center gap-1 whitespace-nowrap px-3 py-2 text-sm font-medium border-b-2 border-transparent text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Novo Lab
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map((m, i) => (
          <div
            key={m.id}
            onClick={() => setSelectedMaquina(m)}
            className="rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-shadow animate-fade-in cursor-pointer"
            style={{ animationDelay: `${i * 30}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-sm font-semibold text-card-foreground">{m.id}</span>
              {m.tipo === "Desktop" ? <Monitor className="h-4 w-4 text-muted-foreground" /> : <Laptop className="h-4 w-4 text-muted-foreground" />}
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo</span>
                <span className="text-card-foreground">{m.tipo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">SO</span>
                <span className="text-card-foreground text-xs">{m.so}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Última Manutenção</span>
                <span className="text-card-foreground text-xs">{m.ultimaManutencao}</span>
              </div>
            </div>
            <div className="mt-3">
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[m.status]}`}>
                {statusLabels[m.status]}
              </span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-10 text-sm text-muted-foreground border rounded-xl bg-card">
            Nenhuma máquina cadastrada neste laboratório.
          </div>
        )}
      </div>

      {/* Detalhe da máquina */}
      <Modal open={!!selectedMaquina} onClose={() => setSelectedMaquina(null)} className="max-w-md">
        {selectedMaquina && (
          <>
            <ModalHeader>
              <ModalTitle className="flex items-center gap-2">
                {selectedMaquina.tipo === "Desktop" ? <Monitor className="h-5 w-5 text-primary" /> : <Laptop className="h-5 w-5 text-primary" />}
                <span className="font-mono">{selectedMaquina.id}</span>
              </ModalTitle>
            </ModalHeader>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[selectedMaquina.status]}`}>
                  {statusLabels[selectedMaquina.status]}
                </span>
                <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground">{selectedMaquina.tipo}</span>
                <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground">Lab {selectedMaquina.sala}</span>
              </div>

              <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                  <CircuitBoard className="h-4 w-4 text-primary" /> Especificações de Hardware
                </h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-start gap-3">
                    <Cpu className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div><span className="text-xs text-muted-foreground">Processador</span><p className="text-card-foreground font-medium">{selectedMaquina.hardware.processador}</p></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CircuitBoard className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div><span className="text-xs text-muted-foreground">Placa-mãe</span><p className="text-card-foreground font-medium">{selectedMaquina.hardware.placaMae}</p></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Monitor className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div><span className="text-xs text-muted-foreground">Placa de Vídeo</span><p className="text-card-foreground font-medium">{selectedMaquina.hardware.placaVideo}</p></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MemoryStick className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div><span className="text-xs text-muted-foreground">Memória RAM</span><p className="text-card-foreground font-medium">{selectedMaquina.hardware.ram}</p></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <HardDrive className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div><span className="text-xs text-muted-foreground">Armazenamento</span><p className="text-card-foreground font-medium">{selectedMaquina.hardware.armazenamento}</p></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Laptop className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div><span className="text-xs text-muted-foreground">Sistema Operacional</span><p className="text-card-foreground font-medium">{selectedMaquina.so}</p></div>
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">Última manutenção: {selectedMaquina.ultimaManutencao}</div>
            </div>
          </>
        )}
      </Modal>

      {/* Novo Laboratório */}
      <Modal open={showNovoLab} onClose={() => setShowNovoLab(false)}>
        <ModalHeader>
          <ModalTitle>Novo Laboratório</ModalTitle>
        </ModalHeader>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Nome do laboratório *</label>
            <input
              type="text"
              autoFocus
              value={novoLabNome}
              onChange={(e) => setNovoLabNome(e.target.value)}
              placeholder="Ex: Turing"
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {novoLabError && <p className="text-xs text-destructive">{novoLabError}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowNovoLab(false)} className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted transition-colors">Cancelar</button>
            <button onClick={handleCreateLab} className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">Criar Laboratório</button>
          </div>
        </div>
      </Modal>

      {/* Nova Máquina */}
      <Modal open={showNovaMaquina} onClose={() => setShowNovaMaquina(false)} className="max-w-xl">
        <ModalHeader>
          <ModalTitle>Nova Máquina — Lab {activeSala}</ModalTitle>
        </ModalHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Nome *</label>
              <input type="text" value={nm.nome} onChange={(e) => setNm({ ...nm, nome: e.target.value })} placeholder={`Ex: PC-${activeSala}-01`} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Processador *</label>
              <input type="text" value={nm.processador} onChange={(e) => setNm({ ...nm, processador: e.target.value })} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Placa-mãe *</label>
              <input type="text" value={nm.placaMae} onChange={(e) => setNm({ ...nm, placaMae: e.target.value })} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Placa de vídeo *</label>
              <input type="text" value={nm.placaVideo} onChange={(e) => setNm({ ...nm, placaVideo: e.target.value })} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Memória RAM *</label>
              <input type="text" value={nm.ram} onChange={(e) => setNm({ ...nm, ram: e.target.value })} placeholder="Ex: 16GB DDR4" className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Armazenamento *</label>
              <input type="text" value={nm.armazenamento} onChange={(e) => setNm({ ...nm, armazenamento: e.target.value })} placeholder="Ex: SSD 512GB" className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Sistema operacional *</label>
              <input type="text" value={nm.so} onChange={(e) => setNm({ ...nm, so: e.target.value })} placeholder="Ex: Windows 11 Pro" className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          {nmError && <p className="text-xs text-destructive">{nmError}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowNovaMaquina(false)} className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted transition-colors">Cancelar</button>
            <button onClick={handleCreateMaquina} className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">Adicionar Máquina</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
