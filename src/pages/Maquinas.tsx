import { useState, useEffect } from "react";
import type { Maquina } from "@/types";
import { getMaquinas, getLabNames } from "@/services/api";
import { Monitor, Laptop, Cpu, HardDrive, MemoryStick, CircuitBoard } from "lucide-react";
import { Modal, ModalHeader, ModalTitle } from "@/components/ui/Modal";

const salas = [...new Set(maquinas.map((m) => m.sala))];

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
  const [activeSala, setActiveSala] = useState(salas[0]);
  const [search, setSearch] = useState("");
  const [selectedMaquina, setSelectedMaquina] = useState<Maquina | null>(null);

  let filtered = maquinas.filter((m) => m.sala === activeSala);
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter((m) => m.id.toLowerCase().includes(term) || m.so.toLowerCase().includes(term));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Máquinas / Labs</h1>
          <p className="text-sm text-muted-foreground">Catálogo de equipamentos por laboratório</p>
        </div>
        <input
          type="text"
          placeholder="Buscar por ID ou SO..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border bg-secondary/50 px-3 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring w-full sm:max-w-xs transition-shadow"
        />
      </div>

      <div className="flex gap-1 border-b overflow-x-auto">
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
      </div>

      {/* Hardware Detail Modal */}
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
    </div>
  );
}
