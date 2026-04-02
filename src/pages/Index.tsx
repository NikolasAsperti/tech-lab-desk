import { useState, useMemo, useEffect } from "react";
import { ClipboardList, Clock, CheckCircle2, Monitor, TrendingUp } from "lucide-react";
import type { Chamado, Maquina, MonthlyMetric } from "@/types";
import { getChamados, getMaquinas, getMonthlyMetrics } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [totalMaquinas, setTotalMaquinas] = useState(0);
  const [allMetrics, setAllMetrics] = useState<MonthlyMetric[]>([]);
  const [periodFilter, setPeriodFilter] = useState("6");

  useEffect(() => {
    getChamados().then(setChamados);
    getMaquinas().then((m) => setTotalMaquinas(m.length));
    getMonthlyMetrics().then(setAllMetrics);
  }, []);

  const abertos = chamados.filter((c) => c.status === "aberto").length;
  const emAndamento = chamados.filter((c) => c.status === "em_andamento").length;
  const concluidos = chamados.filter((c) => c.status === "concluido").length;

  const cards = [
    { label: "Chamados Abertos", value: abertos, icon: ClipboardList, accent: "text-status-open" },
    { label: "Em Andamento", value: emAndamento, icon: Clock, accent: "text-status-progress" },
    { label: "Concluídos", value: concluidos, icon: CheckCircle2, accent: "text-status-done" },
    { label: "Máquinas Registradas", value: totalMaquinas, icon: Monitor, accent: "text-primary" },
  ];

  const recentChamados = [...chamados].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)).slice(0, 5);

  const metrics = useMemo(() => {
    if (periodFilter === "current") {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      return allMetrics.filter((m) => m.month === currentMonth);
    }
    const n = parseInt(periodFilter);
    return allMetrics.slice(-n);
  }, [allMetrics, periodFilter]);

  const resolutionRate = useMemo(() => {
    const totalAbertos = metrics.reduce((acc, m) => acc + m.totalAbertos, 0);
    const totalConcluidos = metrics.reduce((acc, m) => acc + m.totalConcluidos, 0);
    if (totalAbertos === 0) return 0;
    return Math.round((totalConcluidos / totalAbertos) * 100);
  }, [metrics]);

  const maxValue = useMemo(() => {
    let max = 1;
    metrics.forEach((m) => {
      if (m.totalAbertos > max) max = m.totalAbertos;
      if (m.totalConcluidos > max) max = m.totalConcluidos;
    });
    return max;
  }, [metrics]);

  const chartWidth = 600;
  const chartHeight = 240;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const innerW = chartWidth - padding.left - padding.right;
  const innerH = chartHeight - padding.top - padding.bottom;

  const getX = (i: number) => padding.left + (metrics.length > 1 ? (i / (metrics.length - 1)) * innerW : innerW / 2);
  const getY = (val: number) => padding.top + innerH - (val / maxValue) * innerH;

  const makePath = (key: "totalAbertos" | "totalConcluidos") => {
    if (metrics.length === 0) return "";
    return metrics
      .map((m, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(m[key])}`)
      .join(" ");
  };

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

      {/* Efficiency Charts */}
      <div className="rounded-xl border bg-card shadow-sm animate-fade-in" style={{ animationDelay: "320ms" }}>
        <div className="border-b px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h2 className="font-semibold text-card-foreground">Análise de Eficiência</h2>
          </div>
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="rounded-md border bg-secondary/50 px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="current">Mês Atual</option>
            <option value="3">Últimos 3 meses</option>
            <option value="6">Últimos 6 meses</option>
            <option value="12">1 Ano</option>
          </select>
        </div>
        <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Chamados Abertos × Concluídos</h3>
            <div className="w-full overflow-x-auto">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto min-w-[400px]">
                {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                  const y = padding.top + innerH * (1 - t);
                  return (
                    <g key={t}>
                      <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} className="stroke-border" strokeDasharray="4 4" />
                      <text x={padding.left - 8} y={y + 4} textAnchor="end" className="fill-muted-foreground text-[10px]">
                        {Math.round(maxValue * t)}
                      </text>
                    </g>
                  );
                })}
                {metrics.map((m, i) => (
                  <text key={i} x={getX(i)} y={chartHeight - 8} textAnchor="middle" className="fill-muted-foreground text-[10px]">
                    {m.label}
                  </text>
                ))}
                <path d={makePath("totalAbertos")} fill="none" stroke="hsl(var(--status-open))" strokeWidth="2" />
                <path d={makePath("totalConcluidos")} fill="none" stroke="hsl(var(--status-done))" strokeWidth="2" />
                {metrics.map((m, i) => (
                  <g key={i}>
                    <circle cx={getX(i)} cy={getY(m.totalAbertos)} r="3" fill="hsl(var(--status-open))" />
                    <circle cx={getX(i)} cy={getY(m.totalConcluidos)} r="3" fill="hsl(var(--status-done))" />
                  </g>
                ))}
              </svg>
            </div>
            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-status-open" /> Abertos
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-status-done" /> Concluídos
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-xl border bg-muted/30 p-6">
            <span className="text-sm font-medium text-muted-foreground mb-2">Taxa de Resolução</span>
            <span className={`text-6xl font-bold ${resolutionRate >= 70 ? "text-status-done" : resolutionRate >= 40 ? "text-status-progress" : "text-destructive"}`}>
              {resolutionRate}%
            </span>
            <span className="text-xs text-muted-foreground mt-2">dos chamados resolvidos</span>
          </div>
        </div>
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
                  <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-5 py-3"><PrioridadeBadge prioridade={c.prioridade} /></td>
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
