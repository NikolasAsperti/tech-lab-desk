import { useState } from "react";
import { labChecklists } from "@/data/mock-data";
import { CheckCircle2, Circle, ListChecks } from "lucide-react";

export default function Checklists() {
  const [activeLab, setActiveLab] = useState(0);
  const lab = labChecklists[activeLab];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Checklists de Softwares</h1>
        <p className="text-sm text-muted-foreground">Controle de instalações por laboratório</p>
      </div>

      <div className="flex gap-1 border-b overflow-x-auto">
        {labChecklists.map((l, i) => (
          <button
            key={l.sala}
            onClick={() => setActiveLab(i)}
            className={`whitespace-nowrap px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeLab === i ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {l.sala}
          </button>
        ))}
      </div>

      {lab && (
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="border-b px-5 py-3 flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-primary" />
            <h2 className="font-semibold text-card-foreground">{lab.nome}</h2>
            <span className="text-xs text-muted-foreground ml-auto">
              {lab.items.filter((i) => i.instalado).length}/{lab.items.length} instalados
            </span>
          </div>
          <div className="divide-y">
            {lab.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors">
                {item.instalado ? (
                  <CheckCircle2 className="h-4 w-4 text-status-done shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground">{item.software}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.instalado
                      ? `v${item.versao} · Atualizado por ${item.atualizadoPor} em ${item.atualizadoEm}`
                      : item.nota || "Não instalado"}
                  </p>
                </div>
                <span className={`text-xs font-medium ${item.instalado ? "text-status-done" : "text-muted-foreground"}`}>
                  {item.instalado ? "Instalado" : "Pendente"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
