import { ClipboardList, Clock, CheckCircle2, Monitor } from "lucide-react";
import { chamados, maquinas } from "@/data/mock-data";
import { useAuth } from "@/contexts/AuthContext";

const statusLabel: Record<string, string> = { aberto: "Aberto", em_andamento: "Em Andamento", concluido: "Concluído" };

export default function Dashboard() {
  const { user, isTecnico } = useAuth();

  const meusChams = isTecnico ? chamados : chamados.filter((c) => c.criadoPorId === user?.id);
  const abertos = chamados.filter((c) => c.status === "aberto").length;
  const emAndamento = chamados.filter((c) => c.status === "em_andamento").length;
  const concluidos = chamados.filter((c) => c.status === "concluido").length;
  const totalMaquinas = maquinas.length;

  const cards = [
    { label: "Chamados Abertos", value: abertos, icon: ClipboardList, accent: "text-status-open" },
    { label: "Em Andamento", value: emAndamento, icon: Clock, accent: "text-status-progress" },
    { label: "Concluídos", value: concluidos, icon: CheckCircle2, accent: "text-status-done" },
    { label: "Máquinas Registradas", value: totalMaquinas, icon: Monitor, accent: "text-primary" },
  ];

  const recentChamados = [...chamados].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Olá, {user?.nome.split(" ")[0]} 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">Visão geral dos chamados e laboratórios</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div
            key={card.label}
            className="rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow animate-fade-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
              <card.icon className={`h-5 w-5 ${card.accent}`} />
            </div>
            <p className="text-3xl font-bold text-card-foreground">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="border-b px-5 py-3">
          <h2 className="font-semibold text-card-foreground">Atividade Recente</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="px-5 py-2.5 text-left font-medium">ID</th>
                <th className="px-5 py-2.5 text-left font-medium">Título</th>
                <th className="px-5 py-2.5 text-left font-medium">Sala</th>
                <th className="px-5 py-2.5 text-left font-medium">Status</th>
                <th className="px-5 py-2.5 text-left font-medium">Prioridade</th>
                <th className="px-5 py-2.5 text-left font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {recentChamados.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{c.id}</td>
                  <td className="px-5 py-3 font-medium text-card-foreground">{c.titulo}</td>
                  <td className="px-5 py-3 text-muted-foreground">{c.sala}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-5 py-3">
                    <PrioridadeBadge prioridade={c.prioridade} />
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{c.criadoEm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    aberto: "bg-status-open-bg text-status-open-foreground",
    em_andamento: "bg-status-progress-bg text-status-progress-foreground",
    concluido: "bg-status-done-bg text-status-done-foreground",
  };
  const labels: Record<string, string> = { aberto: "Aberto", em_andamento: "Em Andamento", concluido: "Concluído" };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || ""}`}>
      {labels[status] || status}
    </span>
  );
}

export function PrioridadeBadge({ prioridade }: { prioridade: string }) {
  const styles: Record<string, string> = {
    baixa: "text-priority-low",
    media: "text-priority-medium",
    alta: "text-priority-high font-semibold",
  };
  const labels: Record<string, string> = { baixa: "Baixa", media: "Média", alta: "Alta" };
  return <span className={`text-xs ${styles[prioridade] || ""}`}>{labels[prioridade] || prioridade}</span>;
}
