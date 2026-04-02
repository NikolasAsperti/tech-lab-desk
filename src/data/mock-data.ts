import type { Chamado, Maquina, Usuario, ChecklistItem, LabChecklist, MonthlyMetric, TimelineEntry } from "@/types";

export type { Chamado, Maquina, Usuario, ChecklistItem, LabChecklist, MonthlyMetric, TimelineEntry };

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

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: "tecnico" | "usuario";
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

export const usuarios: Usuario[] = [
  { id: "u1", nome: "Carlos Silva", email: "carlos.silva@uni.edu.br", papel: "tecnico", criadoEm: "2024-01-15", ativo: true },
  { id: "u2", nome: "Maria Santos", email: "maria.santos@uni.edu.br", papel: "tecnico", criadoEm: "2024-02-20", ativo: true },
  { id: "u3", nome: "João Oliveira", email: "joao.oliveira@uni.edu.br", papel: "usuario", sala: "Pascal", criadoEm: "2024-03-10", ativo: true },
  { id: "u4", nome: "Ana Costa", email: "ana.costa@uni.edu.br", papel: "usuario", sala: "Jobs", criadoEm: "2024-04-05", ativo: true },
  { id: "u5", nome: "Pedro Ferreira", email: "pedro.ferreira@uni.edu.br", papel: "usuario", criadoEm: "2024-05-12", ativo: true },
  { id: "u6", nome: "Lucia Mendes", email: "lucia.mendes@uni.edu.br", papel: "tecnico", criadoEm: "2024-06-01", ativo: false },
  { id: "u7", nome: "Roberto Lima", email: "roberto.lima@uni.edu.br", papel: "usuario", sala: "Faraday", criadoEm: "2024-07-18", ativo: true },
];

export const tecnicos = usuarios.filter((u) => u.papel === "tecnico" && u.ativo);

export const chamados: Chamado[] = [
  // --- 2025-10 ---
  {
    id: "CH-001", titulo: "Monitor piscando intermitentemente", descricao: "Monitor Dell da máquina PC-Pascal-03 pisca a cada 10 segundos.",
    sala: "Pascal", maquinaId: "PC-Pascal-03", status: "concluido", prioridade: "media",
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
    sala: "Pascal", maquinaId: "PC-Pascal-08", status: "concluido", prioridade: "alta",
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
    sala: "Faraday", maquinaId: "PC-Faraday-02", status: "concluido", prioridade: "baixa",
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
    sala: "Einstein", maquinaId: "PC-Einstein-01", status: "concluido", prioridade: "media",
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
    sala: "Pascal", maquinaId: "PC-Pascal-10", status: "concluido", prioridade: "alta",
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
    sala: "Faraday", maquinaId: "PC-Faraday-05", status: "concluido", prioridade: "media",
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
    sala: "Tesla", maquinaId: "PC-Tesla-01", status: "concluido", prioridade: "media",
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
    sala: "Pascal", maquinaId: "PC-Pascal-06", status: "concluido", prioridade: "alta",
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
    id: "CH-013", titulo: "Monitor não liga", descricao: "Monitor da máquina PC-Pascal-03 não liga ao pressionar o botão power.",
    sala: "Pascal", maquinaId: "PC-Pascal-03", status: "aberto", prioridade: "alta",
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
    id: "CH-015", titulo: "Sem conexão WiFi", descricao: "Notebook PC-Einstein-03 não encontra redes WiFi.",
    sala: "Einstein", maquinaId: "PC-Einstein-03", status: "aberto", prioridade: "alta",
    criadoEm: "2026-02-26", criadoPor: "Pedro Ferreira", criadoPorId: "u5",
    timeline: [{ data: "2026-02-26 07:30", descricao: "Chamado criado", autor: "Pedro Ferreira", tipo: "usuario" }],
  },
  {
    id: "CH-016", titulo: "AutoCAD licença expirada", descricao: "Licença do AutoCAD expirou em todas as máquinas do lab.",
    sala: "Faraday", maquinaId: "PC-Faraday-01", status: "em_andamento", prioridade: "alta",
    criadoEm: "2026-02-22", criadoPor: "Roberto Lima", criadoPorId: "u7", responsavel: "Maria Santos",
    timeline: [
      { data: "2026-02-22 13:00", descricao: "Chamado criado", autor: "Roberto Lima", tipo: "usuario" },
      { data: "2026-02-22 15:00", descricao: "Chamado atribuído a Maria Santos", autor: "Sistema", tipo: "sistema" },
      { data: "2026-02-23 10:00", descricao: "Solicitando renovação de licença ao departamento.", autor: "Maria Santos", tipo: "tecnico" },
    ],
  },
  {
    id: "CH-017", titulo: "Ventilador barulhento", descricao: "Fan cooler da CPU extremamente barulhento durante uso.",
    sala: "Tesla", maquinaId: "PC-Tesla-06", status: "aberto", prioridade: "media",
    criadoEm: "2026-02-27", criadoPor: "Pedro Ferreira", criadoPorId: "u5",
    timeline: [{ data: "2026-02-27 08:15", descricao: "Chamado criado", autor: "Pedro Ferreira", tipo: "usuario" }],
  },
  {
    id: "CH-018", titulo: "PC reiniciando sozinho", descricao: "Máquina reinicia aleatoriamente durante uso normal.",
    sala: "Pascal", maquinaId: "PC-Pascal-01", status: "concluido", prioridade: "alta",
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
    sala: "Einstein", maquinaId: "PC-Einstein-05", status: "aberto", prioridade: "media",
    criadoEm: "2026-03-01", criadoPor: "Pedro Ferreira", criadoPorId: "u5",
    timeline: [{ data: "2026-03-01 08:00", descricao: "Chamado criado", autor: "Pedro Ferreira", tipo: "usuario" }],
  },
  {
    id: "CH-020", titulo: "Máquina extremamente lenta", descricao: "PC demora mais de 10 min para iniciar o Windows.",
    sala: "Faraday", maquinaId: "PC-Faraday-08", status: "em_andamento", prioridade: "alta",
    criadoEm: "2026-03-02", criadoPor: "Roberto Lima", criadoPorId: "u7", responsavel: "Maria Santos",
    timeline: [
      { data: "2026-03-02 09:00", descricao: "Chamado criado", autor: "Roberto Lima", tipo: "usuario" },
      { data: "2026-03-02 10:30", descricao: "Chamado atribuído a Maria Santos", autor: "Sistema", tipo: "sistema" },
      { data: "2026-03-03 08:00", descricao: "Diagnosticando. Possível necessidade de troca de HD por SSD.", autor: "Maria Santos", tipo: "tecnico" },
    ],
  },
];

// Labs with specific names
const labNames = ["Pascal", "Jobs", "Faraday", "Einstein", "Tesla"];

// Hardware specs pools for realistic variety
const processadores = [
  "Intel Core i7-12700H", "Intel Core i5-12400", "Intel Core i5-11400", "Intel Core i3-10100",
  "AMD Ryzen 7 5800H", "AMD Ryzen 5 5600X", "AMD Ryzen 5 3600", "Intel Core i7-10700",
];
const placasMae = [
  "ASUS Prime B560M-A", "Gigabyte B550M DS3H", "MSI MAG B660M Mortar", "ASRock B450M Steel Legend",
  "ASUS TUF Gaming B550-Plus", "Gigabyte H510M H", "MSI PRO H610M-G", "ASRock H670M-ITX",
];
const placasVideo = [
  "NVIDIA GeForce GTX 1650", "NVIDIA GeForce RTX 3060", "AMD Radeon RX 6600", "Integrada (Intel UHD 730)",
  "Integrada (Intel UHD 770)", "NVIDIA GeForce GTX 1050 Ti", "AMD Radeon RX 580", "Integrada (AMD Radeon Vega 8)",
];
const rams = [
  "8GB DDR4 3200MHz", "16GB DDR4 3200MHz", "8GB DDR4 2666MHz", "16GB DDR4 2666MHz",
  "32GB DDR4 3200MHz", "4GB DDR4 2400MHz", "16GB DDR5 4800MHz", "8GB DDR5 4800MHz",
];
const armazenamentos = [
  "SSD 480GB SATA", "SSD 256GB NVMe", "SSD 512GB NVMe", "HDD 1TB 7200RPM",
  "SSD 240GB SATA", "SSD 1TB NVMe", "HDD 500GB 5400RPM + SSD 128GB", "SSD 960GB SATA",
];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const sos = ["Windows 11 Pro", "Windows 10 Pro", "Ubuntu 22.04 LTS"];
const tipos: Array<"Desktop" | "Notebook"> = ["Desktop", "Notebook"];
const statusMaq: Array<"funcionando" | "em_manutencao" | "defeituoso"> = ["funcionando", "funcionando", "funcionando", "em_manutencao", "defeituoso"];

export const maquinas: Maquina[] = [];

labNames.forEach((lab, labIdx) => {
  const count = lab === "Tesla" ? 8 : 10;
  for (let i = 1; i <= count; i++) {
    const seed = labIdx * 100 + i;
    const pick = (arr: string[]) => arr[Math.floor(seededRandom(seed + arr.length) * arr.length)];
    maquinas.push({
      id: `PC-${lab}-${String(i).padStart(2, "0")}`,
      tipo: lab === "Einstein" ? "Notebook" : tipos[Math.floor(seededRandom(seed + 1) * 2)],
      so: pick(sos),
      sala: lab,
      ultimaManutencao: `2026-0${Math.floor(seededRandom(seed + 2) * 2) + 1}-${String(Math.floor(seededRandom(seed + 3) * 28) + 1).padStart(2, "0")}`,
      status: statusMaq[Math.floor(seededRandom(seed + 4) * statusMaq.length)],
      hardware: {
        processador: pick(processadores),
        placaMae: pick(placasMae),
        placaVideo: pick(placasVideo),
        ram: pick(rams),
        armazenamento: pick(armazenamentos),
      },
    });
  }
});

export const labChecklists: LabChecklist[] = [
  {
    sala: "Pascal", nome: "Laboratório de Programação",
    items: [
      { id: "c1", software: "Windows 11 Pro", instalado: true, versao: "23H2", atualizadoPor: "Carlos Silva", atualizadoEm: "2026-02-01" },
      { id: "c2", software: "Microsoft Office 365", instalado: true, versao: "2024", atualizadoPor: "Carlos Silva", atualizadoEm: "2026-02-01" },
      { id: "c3", software: "Python 3.12", instalado: true, versao: "3.12.1", atualizadoPor: "Maria Santos", atualizadoEm: "2026-01-20" },
      { id: "c4", software: "VS Code", instalado: true, versao: "1.96", atualizadoPor: "Maria Santos", atualizadoEm: "2026-01-20" },
      { id: "c5", software: "Git", instalado: true, versao: "2.43", atualizadoPor: "Carlos Silva", atualizadoEm: "2026-02-01" },
      { id: "c6", software: "Node.js LTS", instalado: false, versao: "-", nota: "Pendente instalação para semestre 2026.1" },
      { id: "c7", software: "Adobe Acrobat Reader", instalado: true, versao: "24.0", atualizadoPor: "Carlos Silva", atualizadoEm: "2026-02-01" },
    ],
  },
  {
    sala: "Jobs", nome: "Laboratório de Redes",
    items: [
      { id: "c8", software: "Windows 10 Pro", instalado: true, versao: "22H2", atualizadoPor: "Maria Santos", atualizadoEm: "2026-01-15" },
      { id: "c9", software: "Wireshark", instalado: true, versao: "4.2", atualizadoPor: "Maria Santos", atualizadoEm: "2026-01-15" },
      { id: "c10", software: "Cisco Packet Tracer", instalado: true, versao: "8.2.2", atualizadoPor: "Carlos Silva", atualizadoEm: "2026-01-28" },
      { id: "c11", software: "PuTTY", instalado: true, versao: "0.80", atualizadoPor: "Carlos Silva", atualizadoEm: "2026-01-28" },
      { id: "c12", software: "VirtualBox", instalado: false, versao: "-", nota: "Licença expirada, aguardando renovação" },
    ],
  },
  {
    sala: "Faraday", nome: "Laboratório de Design",
    items: [
      { id: "c13", software: "Windows 11 Pro", instalado: true, versao: "23H2", atualizadoPor: "Carlos Silva", atualizadoEm: "2026-02-10" },
      { id: "c14", software: "AutoCAD 2024", instalado: true, versao: "2024.1", atualizadoPor: "Maria Santos", atualizadoEm: "2026-02-05" },
      { id: "c15", software: "Adobe Creative Suite", instalado: true, versao: "2024", atualizadoPor: "Maria Santos", atualizadoEm: "2026-02-05" },
      { id: "c16", software: "Blender", instalado: true, versao: "4.0", atualizadoPor: "Carlos Silva", atualizadoEm: "2026-02-10" },
      { id: "c17", software: "SketchUp", instalado: false, versao: "-", nota: "Solicitado pelo Prof. Roberto para março" },
    ],
  },
  {
    sala: "Einstein", nome: "Laboratório Multimídia",
    items: [
      { id: "c18", software: "Windows 11 Pro", instalado: true, versao: "23H2", atualizadoPor: "Carlos Silva", atualizadoEm: "2026-02-01" },
      { id: "c19", software: "Adobe Premiere Pro", instalado: true, versao: "2024", atualizadoPor: "Maria Santos", atualizadoEm: "2026-01-25" },
      { id: "c20", software: "OBS Studio", instalado: true, versao: "30.0", atualizadoPor: "Carlos Silva", atualizadoEm: "2026-02-01" },
      { id: "c21", software: "Audacity", instalado: false, versao: "-", nota: "A instalar no próximo ciclo" },
    ],
  },
  {
    sala: "Tesla", nome: "Sala de Professores",
    items: [
      { id: "c22", software: "Windows 11 Pro", instalado: true, versao: "23H2", atualizadoPor: "Carlos Silva", atualizadoEm: "2026-02-01" },
      { id: "c23", software: "Microsoft Office 365", instalado: true, versao: "2024", atualizadoPor: "Carlos Silva", atualizadoEm: "2026-02-01" },
      { id: "c24", software: "Zoom", instalado: true, versao: "6.0", atualizadoPor: "Maria Santos", atualizadoEm: "2026-01-20" },
      { id: "c25", software: "Google Chrome", instalado: true, versao: "122", atualizadoPor: "Carlos Silva", atualizadoEm: "2026-02-15" },
    ],
  },
];

export const mockLoginUsers = [
  { email: "admin@labtech.edu.br", senha: "admin123", usuario: usuarios[0] },
  { email: "professor@labtech.edu.br", senha: "prof123", usuario: usuarios[2] },
];

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
