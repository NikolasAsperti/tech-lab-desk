// ===== Tipos centrais do LabTech =====
// Todas as interfaces usadas na aplicação ficam aqui.
// Ao integrar com o backend NestJS, esses tipos devem espelhar os DTOs do backend.

export interface TimelineEntry {
  data: string;
  descricao: string;
  autor: string;
  tipo?: "sistema" | "tecnico" | "usuario";
}

export interface Chamado {
  id: string;
  titulo: string;
  descricao: string;
  sala: string;
  maquinaId: string;
  status: "aberto" | "em_andamento" | "concluido";
  prioridade: "baixa" | "media" | "alta";
  criadoEm: string;
  criadoPor: string;
  criadoPorId: string;
  responsavel?: string;
  timeline: TimelineEntry[];
}

export interface HardwareInfo {
  processador: string;
  placaMae: string;
  placaVideo: string;
  ram: string;
  armazenamento: string;
}

export interface Maquina {
  id: string;
  tipo: "Desktop" | "Notebook";
  so: string;
  sala: string;
  ultimaManutencao: string;
  status: "funcionando" | "em_manutencao" | "defeituoso";
  hardware: HardwareInfo;
}

export type UserRole = "admin" | "tecnico" | "usuario";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: UserRole;
  sala?: string;
  criadoEm: string;
  ativo: boolean;
}

export interface ChecklistItem {
  id: string;
  software: string;
  instalado: boolean;
  versao: string;
  nota?: string;
  atualizadoPor?: string;
  atualizadoEm?: string;
}

export interface LabChecklist {
  sala: string;
  nome: string;
  items: ChecklistItem[];
}

export interface MonthlyMetric {
  month: string;
  label: string;
  totalAbertos: number;
  totalConcluidos: number;
}

export interface SoftwareCatalogItem {
  nome: string;
  versao: string;
  observacao: string;
}

export interface LabSoftwareCatalog {
  lab: string;
  descricao: string;
  softwares: SoftwareCatalogItem[];
}

export interface FormatChecklistItem {
  id: string;
  label: string;
  obrigatorio: boolean;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface LoginResponse {
  success: boolean;
  usuario?: Usuario;
}
