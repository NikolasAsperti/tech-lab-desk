import type { Chamado, Maquina, Usuario, ChecklistItem, LabChecklist, MonthlyMetric, TimelineEntry } from "@/types";

export type { Chamado, Maquina, Usuario, ChecklistItem, LabChecklist, MonthlyMetric, TimelineEntry };



export const usuarios: Usuario[] = [
  { id: "u0", nome: "Administrador", email: "admin@techlab.com", papel: "admin", criadoEm: "2024-01-01", ativo: true },
  { id: "u1", nome: "Carlos Silva", email: "tecnico@techlab.com", papel: "tecnico", criadoEm: "2024-01-15", ativo: true },
  { id: "u2", nome: "Maria Santos", email: "maria.santos@techlab.com", papel: "tecnico", criadoEm: "2024-02-20", ativo: true },
  { id: "u3", nome: "Usuário Demo", email: "usuario@techlab.com", papel: "usuario", sala: "Boole", criadoEm: "2024-03-10", ativo: true },
  { id: "u4", nome: "Ana Costa", email: "ana.costa@techlab.com", papel: "usuario", sala: "Jobs", criadoEm: "2024-04-05", ativo: true },
  { id: "u5", nome: "Pedro Ferreira", email: "pedro.ferreira@techlab.com", papel: "usuario", criadoEm: "2024-05-12", ativo: true },
  { id: "u6", nome: "Lucia Mendes", email: "lucia.mendes@techlab.com", papel: "tecnico", criadoEm: "2024-06-01", ativo: false },
  { id: "u7", nome: "Roberto Lima", email: "roberto.lima@techlab.com", papel: "usuario", sala: "Fortran", criadoEm: "2024-07-18", ativo: true },
];

export const tecnicos = usuarios.filter((u) => u.papel === "tecnico" && u.ativo);

export const chamados: Chamado[] = [
  // --- 2025-10 ---
  {
    id: "CH-001", titulo: "Monitor piscando intermitentemente", descricao: "Monitor Dell da máquina PC-Boole-03 pisca a cada 10 segundos.",
    sala: "Boole", maquinaId: "PC-Boole-03", status: "concluido", prioridade: "media",
    criadoEm: "2025-10-05", criadoPor: "João Oliveira", criadoPorId: "u3", responsavel: "Carlos Silva",
    timeline: [
      { data: "2025-10-05 08:00", descricao: "Chamado criado", autor: "João Oliveira", tipo: "usuario" },
      { data: "2025-10-05 10:30", descricao: "Chamado atribuído a Carlos Silva", autor: "Sistema", tipo: "sistema" },
      { data: "2025-10-06 14:00", descricao: "Cabo VGA substituído, problema resolvido.", autor: "Carlos Silva", tipo: "tecnico" },
      { data: "2025-10-06 14:05", descricao: "Chamado concluído", autor: "Carlos Silva", tipo: "tecnico" },
    ],
  },
  {
    id: "CH-002", titulo: "PC não liga após queda de energia", descricao: "Fonte de alimentação possivelmente queimada.",
    sala: "Jobs", maquinaId: "PC-Jobs-07", status: "concluido", prioridade: "alta",
    criadoEm: "2025-10-12", criadoPor: "Ana Costa", criadoPorId: "u4", responsavel: "Maria Santos",
    timeline: [
      { data: "2025-10-12 09:15", descricao: "Chamado criado", autor: "Ana Costa", tipo: "usuario" },
      { data: "2025-10-12 11:00", descricao: "Chamado atribuído a Maria Santos", autor: "Sistema", tipo: "sistema" },
      { data: "2025-10-13 16:00", descricao: "Fonte substituída por nova de 500W.", autor: "Maria Santos", tipo: "tecnico" },
      { data: "2025-10-13 16:10", descricao: "Chamado concluído", autor: "Maria Santos", tipo: "tecnico" },
    ],
  },
  {
    id: "CH-003", titulo: "Teclado com teclas travadas", descricao: "Teclas F5, F6 e Espaço não respondem.",
    sala: "Jobs", maquinaId: "PC-Jobs-02", status: "concluido", prioridade: "media",
    criadoEm: "2025-10-18", criadoPor: "Ana Costa", criadoPorId: "u4", responsavel: "Carlos Silva",
    timeline: [
      { data: "2025-10-18 14:00", descricao: "Chamado criado", autor: "Ana Costa", tipo: "usuario" },
      { data: "2025-10-18 16:30", descricao: "Chamado atribuído a Carlos Silva", autor: "Sistema", tipo: "sistema" },
      { data: "2025-10-19 08:00", descricao: "Teclado substituído.", autor: "Carlos Silva", tipo: "tecnico" },
      { data: "2025-10-19 08:05", descricao: "Chamado concluído", autor: "Carlos Silva", tipo: "tecnico" },
    ],
  },
  // --- 2025-11 ---
  {
    id: "CH-004", titulo: "Windows não inicializa (BSOD)", descricao: "Erro IRQL_NOT_LESS_OR_EQUAL ao iniciar.",
    sala: "Boole", maquinaId: "PC-Boole-08", status: "concluido", prioridade: "alta",
    criadoEm: "2025-11-03", criadoPor: "João Oliveira", criadoPorId: "u3", responsavel: "Maria Santos",
    timeline: [
      { data: "2025-11-03 10:15", descricao: "Chamado criado", autor: "João Oliveira", tipo: "usuario" },
      { data: "2025-11-03 11:00", descricao: "Chamado atribuído a Maria Santos", autor: "Sistema", tipo: "sistema" },
      { data: "2025-11-04 09:00", descricao: "RAM com defeito. Módulo substituído.", autor: "Maria Santos", tipo: "tecnico" },
      { data: "2025-11-04 15:00", descricao: "Chamado concluído", autor: "Maria Santos", tipo: "tecnico" },
    ],
  },
  {
    id: "CH-005", titulo: "Mouse óptico com defeito", descricao: "Cursor pula aleatoriamente na tela.",
    sala: "Fortran", maquinaId: "PC-Fortran-02", status: "concluido", prioridade: "baixa",
    criadoEm: "2025-11-10", criadoPor: "Roberto Lima", criadoPorId: "u7", responsavel: "Carlos Silva",
    timeline: [
      { data: "2025-11-10 08:45", descricao: "Chamado criado", autor: "Roberto Lima", tipo: "usuario" },
      { data: "2025-11-10 10:00", descricao: "Chamado atribuído a Carlos Silva", autor: "Sistema", tipo: "sistema" },
      { data: "2025-11-11 14:00", descricao: "Mouse substituído.", autor: "Carlos Silva", tipo: "tecnico" },
      { data: "2025-11-11 14:05", descricao: "Chamado concluído", autor: "Carlos Silva", tipo: "tecnico" },
    ],
  },
  {
    id: "CH-006", titulo: "Impressora não reconhecida", descricao: "HP LaserJet não aparece nos dispositivos.",
    sala: "Eniac", maquinaId: "PC-Eniac-01", status: "concluido", prioridade: "media",
    criadoEm: "2025-11-20", criadoPor: "Pedro Ferreira", criadoPorId: "u5", responsavel: "Maria Santos",
    timeline: [
      { data: "2025-11-20 11:00", descricao: "Chamado criado", autor: "Pedro Ferreira", tipo: "usuario" },
      { data: "2025-11-20 14:00", descricao: "Chamado atribuído a Maria Santos", autor: "Sistema", tipo: "sistema" },
      { data: "2025-11-21 10:00", descricao: "Driver reinstalado e impressora configurada.", autor: "Maria Santos", tipo: "tecnico" },
      { data: "2025-11-21 10:10", descricao: "Chamado concluído", autor: "Maria Santos", tipo: "tecnico" },
    ],
  },
  // --- 2025-12 ---
  {
    id: "CH-007", titulo: "HD fazendo barulho estranho", descricao: "HD emite cliques rítmicos. Possível falha iminente.",
    sala: "Boole", maquinaId: "PC-Boole-10", status: "concluido", prioridade: "alta",
    criadoEm: "2025-12-02", criadoPor: "João Oliveira", criadoPorId: "u3", responsavel: "Carlos Silva",
    timeline: [
      { data: "2025-12-02 09:00", descricao: "Chamado criado", autor: "João Oliveira", tipo: "usuario" },
      { data: "2025-12-02 10:30", descricao: "Urgente: risco de perda de dados. Atribuído a Carlos Silva.", autor: "Sistema", tipo: "sistema" },
      { data: "2025-12-03 08:00", descricao: "Backup realizado. HD substituído por SSD 480GB.", autor: "Carlos Silva", tipo: "tecnico" },
      { data: "2025-12-03 16:00", descricao: "Windows reinstalado. Chamado concluído.", autor: "Carlos Silva", tipo: "tecnico" },
    ],
  },
  {
    id: "CH-008", titulo: "AutoCAD travando", descricao: "AutoCAD 2024 fecha após 5 minutos de uso.",
    sala: "Fortran", maquinaId: "PC-Fortran-05", status: "concluido", prioridade: "media",
    criadoEm: "2025-12-10", criadoPor: "Roberto Lima", criadoPorId: "u7", responsavel: "Maria Santos",
    timeline: [
      { data: "2025-12-10 13:00", descricao: "Chamado criado", autor: "Roberto Lima", tipo: "usuario" },
      { data: "2025-12-10 15:00", descricao: "Chamado atribuído a Maria Santos", autor: "Sistema", tipo: "sistema" },
      { data: "2025-12-11 10:00", descricao: "Driver GPU atualizado. Problema resolvido.", autor: "Maria Santos", tipo: "tecnico" },
      { data: "2025-12-11 10:15", descricao: "Chamado concluído", autor: "Maria Santos", tipo: "tecnico" },
    ],
  },
  {
    id: "CH-009", titulo: "Ventilador da CPU ruidoso", descricao: "Fan cooler barulhento. Temperatura acima de 85°C.",
    sala: "Jobs", maquinaId: "PC-Jobs-10", status: "concluido", prioridade: "media",
    criadoEm: "2025-12-18", criadoPor: "Ana Costa", criadoPorId: "u4", responsavel: "Maria Santos",
    timeline: [
      { data: "2025-12-18 10:00", descricao: "Chamado criado", autor: "Ana Costa", tipo: "usuario" },
      { data: "2025-12-18 14:00", descricao: "Chamado atribuído a Maria Santos", autor: "Sistema", tipo: "sistema" },
      { data: "2025-12-19 09:00", descricao: "Limpeza e pasta térmica reaplicada.", autor: "Maria Santos", tipo: "tecnico" },
      { data: "2025-12-19 09:15", descricao: "Chamado concluído", autor: "Maria Santos", tipo: "tecnico" },
    ],
  },
  // --- 2026-01 ---
  {
    id: "CH-010", titulo: "Sem conexão de rede", descricao: "Cabo testado e funcionando em outra máquina. Placa de rede pode estar com defeito.",
    sala: "Jobs", maquinaId: "PC-Jobs-01", status: "concluido", prioridade: "alta",
    criadoEm: "2026-01-08", criadoPor: "Ana Costa", criadoPorId: "u4", responsavel: "Carlos Silva",
    timeline: [
      { data: "2026-01-08 07:30", descricao: "Chamado criado", autor: "Ana Costa", tipo: "usuario" },
      { data: "2026-01-08 09:00", descricao: "Chamado atribuído a Carlos Silva", autor: "Sistema", tipo: "sistema" },
      { data: "2026-01-09 11:00", descricao: "Placa de rede substituída.", autor: "Carlos Silva", tipo: "tecnico" },
      { data: "2026-01-09 11:10", descricao: "Chamado concluído", autor: "Carlos Silva", tipo: "tecnico" },
    ],
  },
  {
    id: "CH-011", titulo: "Projetor sem sinal HDMI", descricao: "Projetor não detecta sinal HDMI da máquina principal.",
    sala: "Ada", maquinaId: "PC-Ada-01", status: "concluido", prioridade: "media",
    criadoEm: "2026-01-15", criadoPor: "Pedro Ferreira", criadoPorId: "u5", responsavel: "Carlos Silva",
    timeline: [
      { data: "2026-01-15 08:15", descricao: "Chamado criado", autor: "Pedro Ferreira", tipo: "usuario" },
      { data: "2026-01-15 10:00", descricao: "Chamado atribuído a Carlos Silva", autor: "Sistema", tipo: "sistema" },
      { data: "2026-01-16 09:00", descricao: "Cabo HDMI trocado. Sinal restabelecido.", autor: "Carlos Silva", tipo: "tecnico" },
      { data: "2026-01-16 09:05", descricao: "Chamado concluído", autor: "Carlos Silva", tipo: "tecnico" },
    ],
  },
  {
    id: "CH-012", titulo: "Tela azul ao abrir VS Code", descricao: "BSOD ocorre ao iniciar VS Code com extensões pesadas.",
    sala: "Boole", maquinaId: "PC-Boole-06", status: "concluido", prioridade: "alta",
    criadoEm: "2026-01-22", criadoPor: "João Oliveira", criadoPorId: "u3", responsavel: "Maria Santos",
    timeline: [
      { data: "2026-01-22 10:00", descricao: "Chamado criado", autor: "João Oliveira", tipo: "usuario" },
      { data: "2026-01-22 11:30", descricao: "Chamado atribuído a Maria Santos", autor: "Sistema", tipo: "sistema" },
      { data: "2026-01-23 14:00", descricao: "RAM expandida de 4GB para 8GB. Problema resolvido.", autor: "Maria Santos", tipo: "tecnico" },
      { data: "2026-01-23 14:10", descricao: "Chamado concluído", autor: "Maria Santos", tipo: "tecnico" },
    ],
  },
  // --- 2026-02 ---
  {
    id: "CH-013", titulo: "Monitor não liga", descricao: "Monitor da máquina PC-Boole-03 não liga ao pressionar o botão power.",
    sala: "Boole", maquinaId: "PC-Boole-03", status: "aberto", prioridade: "alta",
    criadoEm: "2026-02-25", criadoPor: "João Oliveira", criadoPorId: "u3",
    timeline: [{ data: "2026-02-25 09:30", descricao: "Chamado criado", autor: "João Oliveira", tipo: "usuario" }],
  },
  {
    id: "CH-014", titulo: "Software Wireshark desatualizado", descricao: "Versão 3.x instalada, precisa da 4.2 para aula de redes.",
    sala: "Jobs", maquinaId: "PC-Jobs-04", status: "em_andamento", prioridade: "media",
    criadoEm: "2026-02-20", criadoPor: "Ana Costa", criadoPorId: "u4", responsavel: "Carlos Silva",
    timeline: [
      { data: "2026-02-20 10:00", descricao: "Chamado criado", autor: "Ana Costa", tipo: "usuario" },
      { data: "2026-02-20 14:00", descricao: "Chamado atribuído a Carlos Silva", autor: "Sistema", tipo: "sistema" },
      { data: "2026-02-21 09:00", descricao: "Atualizando em lote nas 10 máquinas do lab.", autor: "Carlos Silva", tipo: "tecnico" },
    ],
  },
  {
    id: "CH-015", titulo: "Sem conexão WiFi", descricao: "Notebook PC-Eniac-03 não encontra redes WiFi.",
    sala: "Eniac", maquinaId: "PC-Eniac-03", status: "aberto", prioridade: "alta",
    criadoEm: "2026-02-26", criadoPor: "Pedro Ferreira", criadoPorId: "u5",
    timeline: [{ data: "2026-02-26 07:30", descricao: "Chamado criado", autor: "Pedro Ferreira", tipo: "usuario" }],
  },
  {
    id: "CH-016", titulo: "AutoCAD licença expirada", descricao: "Licença do AutoCAD expirou em todas as máquinas do lab.",
    sala: "Fortran", maquinaId: "PC-Fortran-01", status: "em_andamento", prioridade: "alta",
    criadoEm: "2026-02-22", criadoPor: "Roberto Lima", criadoPorId: "u7", responsavel: "Maria Santos",
    timeline: [
      { data: "2026-02-22 13:00", descricao: "Chamado criado", autor: "Roberto Lima", tipo: "usuario" },
      { data: "2026-02-22 15:00", descricao: "Chamado atribuído a Maria Santos", autor: "Sistema", tipo: "sistema" },
      { data: "2026-02-23 10:00", descricao: "Solicitando renovação de licença ao departamento.", autor: "Maria Santos", tipo: "tecnico" },
    ],
  },
  {
    id: "CH-017", titulo: "Ventilador barulhento", descricao: "Fan cooler da CPU extremamente barulhento durante uso.",
    sala: "Ada", maquinaId: "PC-Ada-06", status: "aberto", prioridade: "media",
    criadoEm: "2026-02-27", criadoPor: "Pedro Ferreira", criadoPorId: "u5",
    timeline: [{ data: "2026-02-27 08:15", descricao: "Chamado criado", autor: "Pedro Ferreira", tipo: "usuario" }],
  },
  {
    id: "CH-018", titulo: "PC reiniciando sozinho", descricao: "Máquina reinicia aleatoriamente durante uso normal.",
    sala: "Boole", maquinaId: "PC-Boole-01", status: "concluido", prioridade: "alta",
    criadoEm: "2026-02-10", criadoPor: "João Oliveira", criadoPorId: "u3", responsavel: "Carlos Silva",
    timeline: [
      { data: "2026-02-10 09:00", descricao: "Chamado criado", autor: "João Oliveira", tipo: "usuario" },
      { data: "2026-02-10 10:00", descricao: "Chamado atribuído a Carlos Silva", autor: "Sistema", tipo: "sistema" },
      { data: "2026-02-11 11:00", descricao: "Fonte de alimentação com defeito. Substituída.", autor: "Carlos Silva", tipo: "tecnico" },
      { data: "2026-02-11 16:00", descricao: "Chamado concluído", autor: "Carlos Silva", tipo: "tecnico" },
    ],
  },
  // --- 2026-03 ---
  {
    id: "CH-019", titulo: "Teclado não funciona", descricao: "Teclado USB não é reconhecido pelo sistema.",
    sala: "Eniac", maquinaId: "PC-Eniac-05", status: "aberto", prioridade: "media",
    criadoEm: "2026-03-01", criadoPor: "Pedro Ferreira", criadoPorId: "u5",
    timeline: [{ data: "2026-03-01 08:00", descricao: "Chamado criado", autor: "Pedro Ferreira", tipo: "usuario" }],
  },
  {
    id: "CH-020", titulo: "Máquina extremamente lenta", descricao: "PC demora mais de 10 min para iniciar o Windows.",
    sala: "Fortran", maquinaId: "PC-Fortran-08", status: "em_andamento", prioridade: "alta",
    criadoEm: "2026-03-02", criadoPor: "Roberto Lima", criadoPorId: "u7", responsavel: "Maria Santos",
    timeline: [
      { data: "2026-03-02 09:00", descricao: "Chamado criado", autor: "Roberto Lima", tipo: "usuario" },
      { data: "2026-03-02 10:30", descricao: "Chamado atribuído a Maria Santos", autor: "Sistema", tipo: "sistema" },
      { data: "2026-03-03 08:00", descricao: "Diagnosticando. Possível necessidade de troca de HD por SSD.", autor: "Maria Santos", tipo: "tecnico" },
    ],
  },
];

// Laboratórios reais com especificações fixas por lab
const labNames = ["Jobs", "Eniac", "Boole", "Fortran", "Ada"];

interface LabSpec {
  nome: string;
  descricao: string;
  qtd: number;
  tipo: "Desktop" | "Notebook";
  so: string;
  hardware: {
    processador: string;
    placaMae: string;
    placaVideo: string;
    ram: string;
    armazenamento: string;
  };
}

const labSpecs: Record<string, LabSpec> = {
  Jobs: {
    nome: "Jobs", descricao: "Laboratório de Programação Básica",
    qtd: 60, tipo: "Desktop", so: "Windows 10 Pro",
    hardware: {
      processador: "Intel Core i5-4570 (4ª Geração)",
      placaMae: "ASUS H81M-A",
      placaVideo: "Integrada (Intel HD Graphics 4600)",
      ram: "8GB DDR3 1600MHz",
      armazenamento: "4x HDD 500GB 7200RPM",
    },
  },
  Eniac: {
    nome: "Eniac", descricao: "Laboratório Móvel (Notebooks)",
    qtd: 15, tipo: "Notebook", so: "Windows 11 Pro",
    hardware: {
      processador: "Intel Core i5-1135G7 (11ª Geração)",
      placaMae: "Integrada (Notebook Dell Latitude 3420)",
      placaVideo: "Intel Iris Xe Graphics",
      ram: "8GB DDR4 3200MHz",
      armazenamento: "SSD 256GB NVMe",
    },
  },
  Boole: {
    nome: "Boole", descricao: "Laboratório de Lógica e Algoritmos",
    qtd: 24, tipo: "Desktop", so: "Windows 10 Pro",
    hardware: {
      processador: "Intel Core i3-4150 (4ª Geração)",
      placaMae: "Gigabyte H81M-S2PH",
      placaVideo: "Integrada (Intel HD Graphics 4400)",
      ram: "8GB DDR3 1600MHz",
      armazenamento: "2x HDD 500GB 7200RPM",
    },
  },
  Fortran: {
    nome: "Fortran", descricao: "Laboratório de Computação Científica",
    qtd: 32, tipo: "Desktop", so: "Windows 11 Pro",
    hardware: {
      processador: "Intel Core i5-12400 (12ª Geração)",
      placaMae: "ASUS Prime H610M-E D4",
      placaVideo: "Integrada (Intel UHD Graphics 770)",
      ram: "16GB DDR4 3200MHz",
      armazenamento: "SSD 512GB NVMe",
    },
  },
  Ada: {
    nome: "Ada", descricao: "Laboratório de IA e Computação Gráfica",
    qtd: 20, tipo: "Desktop", so: "Windows 11 Pro",
    hardware: {
      processador: "Intel Core i7-10700 (10ª Geração)",
      placaMae: "ASUS Prime B460M-A",
      placaVideo: "NVIDIA GeForce RTX 3050 8GB",
      ram: "16GB DDR4 2933MHz",
      armazenamento: "SSD 512GB NVMe",
    },
  },
};

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const statusMaq: Array<"funcionando" | "em_manutencao" | "defeituoso"> =
  ["funcionando", "funcionando", "funcionando", "funcionando", "funcionando", "em_manutencao", "defeituoso"];

export const maquinas: Maquina[] = [];

labNames.forEach((lab, labIdx) => {
  const spec = labSpecs[lab];
  for (let i = 1; i <= spec.qtd; i++) {
    const seed = labIdx * 1000 + i;
    maquinas.push({
      id: `PC-${lab}-${String(i).padStart(2, "0")}`,
      tipo: spec.tipo,
      so: spec.so,
      sala: lab,
      ultimaManutencao: `2026-0${Math.floor(seededRandom(seed + 2) * 2) + 1}-${String(Math.floor(seededRandom(seed + 3) * 28) + 1).padStart(2, "0")}`,
      status: statusMaq[Math.floor(seededRandom(seed + 4) * statusMaq.length)],
      hardware: { ...spec.hardware },
    });
  }
});

export const labChecklists: LabChecklist[] = [
  {
    sala: "Jobs", nome: "Laboratório de Programação Básica",
    items: [
      { id: "c1", software: "Windows 10 Pro", instalado: true, versao: "22H2", atualizadoPor: "Carlos Silva", atualizadoEm: "2026-02-01" },
      { id: "c2", software: "Python 3.11", instalado: true, versao: "3.11.8", atualizadoPor: "Carlos Silva", atualizadoEm: "2026-02-01" },
      { id: "c3", software: "Visual Studio Code", instalado: true, versao: "1.96", atualizadoPor: "Maria Santos", atualizadoEm: "2026-01-20" },
      { id: "c4", software: "Git", instalado: true, versao: "2.43", atualizadoPor: "Carlos Silva", atualizadoEm: "2026-02-01" },
    ],
  },
  {
    sala: "Eniac", nome: "Laboratório Móvel (Notebooks)",
    items: [
      { id: "c5", software: "Windows 11 Pro", instalado: true, versao: "23H2", atualizadoPor: "Maria Santos", atualizadoEm: "2026-01-15" },
      { id: "c6", software: "Microsoft Office 365", instalado: true, versao: "2024", atualizadoPor: "Maria Santos", atualizadoEm: "2026-01-15" },
      { id: "c7", software: "Google Chrome", instalado: true, versao: "122", atualizadoPor: "Carlos Silva", atualizadoEm: "2026-02-10" },
      { id: "c8", software: "Visual Studio Code", instalado: false, versao: "-", nota: "Sob demanda para aulas específicas" },
    ],
  },
  {
    sala: "Boole", nome: "Laboratório de Lógica e Algoritmos",
    items: [
      { id: "c9", software: "Windows 10 Pro", instalado: true, versao: "22H2", atualizadoPor: "Carlos Silva", atualizadoEm: "2026-02-10" },
      { id: "c10", software: "Python 3.11", instalado: true, versao: "3.11.8", atualizadoPor: "Maria Santos", atualizadoEm: "2026-02-05" },
      { id: "c11", software: "Logisim Evolution", instalado: true, versao: "3.8", atualizadoPor: "Maria Santos", atualizadoEm: "2026-02-05" },
      { id: "c12", software: "Visual Studio Code", instalado: false, versao: "-", nota: "A instalar no próximo ciclo" },
    ],
  },
  {
    sala: "Fortran", nome: "Laboratório de Computação Científica",
    items: [
      { id: "c13", software: "Windows 11 Pro", instalado: true, versao: "23H2", atualizadoPor: "Carlos Silva", atualizadoEm: "2026-02-01" },
      { id: "c14", software: "MATLAB", instalado: true, versao: "R2024a", atualizadoPor: "Maria Santos", atualizadoEm: "2026-01-25" },
      { id: "c15", software: "GNU Fortran (gfortran)", instalado: true, versao: "13.2", atualizadoPor: "Carlos Silva", atualizadoEm: "2026-02-01" },
      { id: "c16", software: "Anaconda (Python científico)", instalado: false, versao: "-", nota: "A instalar no próximo ciclo" },
    ],
  },
  {
    sala: "Ada", nome: "Laboratório de IA e Computação Gráfica",
    items: [
      { id: "c17", software: "Windows 11 Pro", instalado: true, versao: "23H2", atualizadoPor: "Carlos Silva", atualizadoEm: "2026-02-01" },
      { id: "c18", software: "NVIDIA CUDA Toolkit", instalado: true, versao: "12.4", atualizadoPor: "Maria Santos", atualizadoEm: "2026-01-20" },
      { id: "c19", software: "Anaconda + PyTorch", instalado: true, versao: "2.2", atualizadoPor: "Carlos Silva", atualizadoEm: "2026-02-15" },
      { id: "c20", software: "Blender", instalado: false, versao: "-", nota: "Solicitado para próxima atualização" },
    ],
  },
];

export const mockLoginUsers: { email: string; senha: string; usuario: Usuario }[] = [
  { email: "admin@techlab.com", senha: "admin123", usuario: usuarios[0] },
  { email: "tecnico@techlab.com", senha: "tecnico123", usuario: usuarios[1] },
  { email: "usuario@techlab.com", senha: "usuario123", usuario: usuarios[3] },
];

export function addMockUser(
  nome: string,
  email: string,
  senha: string,
  papel: "tecnico" | "usuario",
  sala?: string,
  subtipo?: "aluno" | "professor",
) {
  if (mockLoginUsers.some(u => u.email === email)) return false;
  const newUser: Usuario = {
    id: `u${Date.now()}`,
    nome,
    email,
    papel,
    subtipo: papel === "usuario" ? subtipo : undefined,
    sala,
    criadoEm: new Date().toISOString().substring(0, 10),
    ativo: true,
  };
  usuarios.push(newUser);
  mockLoginUsers.push({ email, senha, usuario: newUser });
  return true;
}

export function addChamado(data: {
  titulo: string;
  descricao: string;
  sala: string;
  maquinaId: string;
  prioridade: "baixa" | "media" | "alta";
  criadoPor: string;
  criadoPorId: string;
}): Chamado {
  const nextNum = chamados.length + 1;
  const id = `CH-${String(nextNum).padStart(3, "0")}`;
  const now = new Date();
  const data_str = now.toISOString().substring(0, 10);
  const datetime = now.toISOString().replace("T", " ").substring(0, 16);
  const novo: Chamado = {
    id,
    titulo: data.titulo,
    descricao: data.descricao,
    sala: data.sala,
    maquinaId: data.maquinaId,
    status: "aberto",
    prioridade: data.prioridade,
    criadoEm: data_str,
    criadoPor: data.criadoPor,
    criadoPorId: data.criadoPorId,
    timeline: [
      { data: datetime, descricao: `Chamado criado por ${data.criadoPor}`, autor: data.criadoPor, tipo: "usuario" },
    ],
  };
  chamados.unshift(novo);
  return novo;
}

// Helper: compute metrics per month for dashboard charts
// MonthlyMetric importado de @/types

const monthLabels: Record<string, string> = {
  "01": "Jan", "02": "Fev", "03": "Mar", "04": "Abr", "05": "Mai", "06": "Jun",
  "07": "Jul", "08": "Ago", "09": "Set", "10": "Out", "11": "Nov", "12": "Dez",
};

export function getMonthlyMetrics(): MonthlyMetric[] {
  const grouped: Record<string, Chamado[]> = {};
  chamados.forEach((c) => {
    const m = c.criadoEm.substring(0, 7);
    if (!grouped[m]) grouped[m] = [];
    grouped[m].push(c);
  });

  return Object.keys(grouped).sort().map((month) => {
    const list = grouped[month];
    const concluidos = list.filter((c) => c.status === "concluido").length;
    const [y, m] = month.split("-");
    return {
      month,
      label: `${monthLabels[m]}/${y.substring(2)}`,
      totalAbertos: list.length,
      totalConcluidos: concluidos,
    };
  });
}
