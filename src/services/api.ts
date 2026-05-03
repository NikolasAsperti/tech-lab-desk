// ===== Camada de Serviço / API =====
// Todas as chamadas de dados passam por aqui.
// Atualmente usa dados mockados. Para integrar com NestJS,
// basta substituir cada função por uma chamada HTTP (fetch/axios).
//
// Exemplo de migração:
//   export async function getChamados(): Promise<Chamado[]> {
//     const res = await fetch(`${API_BASE_URL}/chamados`);
//     return res.json();
//   }

import type {
  Chamado,
  Maquina,
  Usuario,
  MonthlyMetric,
  LabSoftwareCatalog,
  FormatChecklistItem,
  LoginResponse,
} from "@/types";

import {
  chamados,
  maquinas,
  usuarios,
  tecnicos,
  getMonthlyMetrics as mockGetMonthlyMetrics,
  mockLoginUsers,
  addMockUser,
} from "@/data/mock-data";

import {
  labSoftwareCatalogs,
  getFormatChecklist as mockGetFormatChecklist,
} from "@/data/checklist-catalog";

// -------------------------------------------------------------------
// Config — altere API_BASE_URL ao conectar com o backend NestJS
// -------------------------------------------------------------------
// export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// -------------------------------------------------------------------
// Auth
// -------------------------------------------------------------------
export async function login(email: string, senha: string): Promise<LoginResponse> {
  const found = mockLoginUsers.find(
    (u) => u.email === email && u.senha === senha
  );
  if (found) {
    return { success: true, usuario: found.usuario };
  }
  return { success: false };
}

export async function register(
  nome: string, email: string, senha: string, papel: "tecnico" | "usuario", sala?: string
): Promise<{ success: boolean; error?: string }> {
  const ok = addMockUser(nome, email, senha, papel, sala);
  if (!ok) return { success: false, error: "Este email já está cadastrado." };
  return { success: true };
}

// -------------------------------------------------------------------
// Chamados
// -------------------------------------------------------------------
export async function getChamados(): Promise<Chamado[]> {
  return [...chamados];
}

export async function getChamadoById(id: string): Promise<Chamado | undefined> {
  return chamados.find((c) => c.id === id);
}

export async function updateChamadoStatus(
  id: string,
  status: Chamado["status"],
  comentario: string,
  autor: string
): Promise<Chamado | undefined> {
  const chamado = chamados.find((c) => c.id === id);
  if (!chamado) return undefined;
  const now = new Date().toISOString().replace("T", " ").substring(0, 16);
  chamado.status = status;
  const statusLabel = status === "em_andamento" ? "Em Andamento" : "Concluído";
  chamado.timeline.push({
    data: now,
    descricao: `Status alterado para ${statusLabel}: ${comentario}`,
    autor,
    tipo: "tecnico",
  });
  return { ...chamado };
}

export async function atribuirChamado(
  id: string,
  tecnicoNome: string,
  comentario: string
): Promise<Chamado | undefined> {
  const chamado = chamados.find((c) => c.id === id);
  if (!chamado) return undefined;
  const now = new Date().toISOString().replace("T", " ").substring(0, 16);
  chamado.responsavel = tecnicoNome;
  chamado.status = "em_andamento";
  chamado.timeline.push(
    { data: now, descricao: `Chamado atribuído a ${tecnicoNome}`, autor: "Sistema", tipo: "sistema" },
    { data: now, descricao: comentario, autor: tecnicoNome, tipo: "tecnico" }
  );
  return { ...chamado };
}

export async function addChamadoComment(
  id: string,
  comentario: string,
  autor: string
): Promise<Chamado | undefined> {
  const chamado = chamados.find((c) => c.id === id);
  if (!chamado) return undefined;
  const now = new Date().toISOString().replace("T", " ").substring(0, 16);
  chamado.timeline.push({
    data: now,
    descricao: comentario,
    autor,
    tipo: "tecnico",
  });
  return { ...chamado };
}

export async function addChecklistToChamado(
  id: string,
  descricao: string,
  autor: string
): Promise<Chamado | undefined> {
  const chamado = chamados.find((c) => c.id === id);
  if (!chamado) return undefined;
  const now = new Date().toISOString().replace("T", " ").substring(0, 16);
  chamado.status = "concluido";
  chamado.timeline.push(
    { data: now, descricao: `Status alterado para Concluído`, autor, tipo: "tecnico" },
    { data: now, descricao: descricao, autor, tipo: "tecnico" }
  );
  return { ...chamado };
}

// -------------------------------------------------------------------
// Máquinas
// -------------------------------------------------------------------
export async function getMaquinas(): Promise<Maquina[]> {
  return [...maquinas];
}

export async function getMaquinasByLab(sala: string): Promise<Maquina[]> {
  return maquinas.filter((m) => m.sala === sala);
}

export async function getLabNames(): Promise<string[]> {
  return [...new Set(maquinas.map((m) => m.sala))];
}

// -------------------------------------------------------------------
// Usuários
// -------------------------------------------------------------------
export async function getUsuarios(): Promise<Usuario[]> {
  return [...usuarios];
}

export async function getTecnicos(): Promise<Usuario[]> {
  return [...tecnicos];
}

// -------------------------------------------------------------------
// Métricas
// -------------------------------------------------------------------
export async function getMonthlyMetrics(): Promise<MonthlyMetric[]> {
  return mockGetMonthlyMetrics();
}

// -------------------------------------------------------------------
// Catálogo de Softwares / Checklist
// -------------------------------------------------------------------
export async function getSoftwareCatalogs(): Promise<LabSoftwareCatalog[]> {
  return [...labSoftwareCatalogs];
}

export async function getFormatChecklist(lab: string): Promise<FormatChecklistItem[]> {
  return mockGetFormatChecklist(lab);
}
