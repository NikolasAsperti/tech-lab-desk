import { useState } from "react";
import { labSoftwareCatalogs } from "@/data/checklist-catalog";
import { BookOpen, Monitor, Info } from "lucide-react";

export default function Checklists() {
  const [activeLab, setActiveLab] = useState(0);
  const catalog = labSoftwareCatalogs[activeLab];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Catálogo de Softwares</h1>
        <p className="text-sm text-muted-foreground">
          Referência de softwares obrigatórios por laboratório — consulta para formatação de máquinas
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
        <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground">
          Este catálogo serve apenas como referência rápida. O checklist interativo de formatação é acionado
          automaticamente ao concluir um chamado com a opção "Computador foi formatado".
        </p>
      </div>

      {/* Lab tabs */}
      <div className="flex gap-1 border-b overflow-x-auto">
        {labSoftwareCatalogs.map((l, i) => (
          <button
            key={l.lab}
            onClick={() => setActiveLab(i)}
            className={`whitespace-nowrap px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeLab === i
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {l.lab}
          </button>
        ))}
      </div>

      {/* Catalog content */}
      {catalog && (
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="border-b px-5 py-3 flex items-center gap-2">
            <Monitor className="h-4 w-4 text-primary" />
            <div>
              <h2 className="font-semibold text-card-foreground">{catalog.lab}</h2>
              <p className="text-xs text-muted-foreground">{catalog.descricao}</p>
            </div>
            <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {catalog.softwares.length} softwares
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="px-5 py-2.5 text-left font-medium">#</th>
                  <th className="px-5 py-2.5 text-left font-medium">Software</th>
                  <th className="px-5 py-2.5 text-left font-medium hidden sm:table-cell">Versão</th>
                  <th className="px-5 py-2.5 text-left font-medium hidden md:table-cell">Observação</th>
                </tr>
              </thead>
              <tbody>
                {catalog.softwares.map((s, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-5 py-3 text-muted-foreground font-mono text-xs">{i + 1}</td>
                    <td className="px-5 py-3 font-medium text-card-foreground">{s.nome}</td>
                    <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                        {s.versao}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground hidden md:table-cell max-w-[300px]">
                      {s.observacao}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: show version + obs inline */}
          <div className="sm:hidden divide-y">
            {catalog.softwares.map((s, i) => (
              <div key={`mobile-${i}`} className="px-5 py-2">
                <p className="text-xs text-muted-foreground">
                  v{s.versao} · {s.observacao}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
