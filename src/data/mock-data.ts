export interface TimelineEntry {
  data: string;
  descricao: string;
  autor: string;
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

export interface Maquina {
  id: string;
  tipo: "Desktop" | "Notebook";
  so: string;
  sala: string;
  ultimaManutencao: string;
  status: "funcionando" | "em_manutencao" | "defeituoso";
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
  { id: "u3", nome: "João Oliveira", email: "joao.oliveira@uni.edu.br", papel: "usuario", sala: "Lab 101", criadoEm: "2024-03-10", ativo: true },
  { id: "u4", nome: "Ana Costa", email: "ana.costa@uni.edu.br", papel: "usuario", sala: "Lab 202", criadoEm: "2024-04-05", ativo: true },
  { id: "u5", nome: "Pedro Ferreira", email: "pedro.ferreira@uni.edu.br", papel: "usuario", criadoEm: "2024-05-12", ativo: true },
  { id: "u6", nome: "Lucia Mendes", email: "lucia.mendes@uni.edu.br", papel: "tecnico", criadoEm: "2024-06-01", ativo: false },
  { id: "u7", nome: "Roberto Lima", email: "roberto.lima@uni.edu.br", papel: "usuario", sala: "Lab 303", criadoEm: "2024-07-18", ativo: true },
];

export const chamados: Chamado[] = [
  {
    id: "CH-001", titulo: "Monitor não liga", descricao: "O monitor da máquina PC-101-03 não liga ao pressionar o botão power. Já tentei trocar o cabo de força.",
    sala: "Lab 101", maquinaId: "PC-101-03", status: "aberto", prioridade: "alta",
    criadoEm: "2026-02-25", criadoPor: "João Oliveira", criadoPorId: "u3",
    timeline: [{ data: "2026-02-25 09:30", descricao: "Chamado criado", autor: "João Oliveira" }],
  },
  {
    id: "CH-002", titulo: "Teclado com teclas travadas", descricao: "Teclas F5, F6 e Espaço não respondem no teclado da máquina PC-202-07.",
    sala: "Lab 202", maquinaId: "PC-202-07", status: "em_andamento", prioridade: "media",
    criadoEm: "2026-02-24", criadoPor: "Ana Costa", criadoPorId: "u4", responsavel: "Carlos Silva",
    timeline: [
      { data: "2026-02-24 14:00", descricao: "Chamado criado", autor: "Ana Costa" },
      { data: "2026-02-24 16:30", descricao: "Chamado atribuído a Carlos Silva", autor: "Sistema" },
      { data: "2026-02-25 08:00", descricao: "Teclado será substituído. Aguardando peça do almoxarifado.", autor: "Carlos Silva" },
    ],
  },
  {
    id: "CH-003", titulo: "Windows não inicializa", descricao: "A máquina trava na tela de boot com erro BSOD (IRQL_NOT_LESS_OR_EQUAL).",
    sala: "Lab 101", maquinaId: "PC-101-08", status: "em_andamento", prioridade: "alta",
    criadoEm: "2026-02-23", criadoPor: "João Oliveira", criadoPorId: "u3", responsavel: "Maria Santos",
    timeline: [
      { data: "2026-02-23 10:15", descricao: "Chamado criado", autor: "João Oliveira" },
      { data: "2026-02-23 11:00", descricao: "Chamado atribuído a Maria Santos", autor: "Sistema" },
      { data: "2026-02-24 09:00", descricao: "Diagnóstico: possível falha na RAM. Testando memória.", autor: "Maria Santos" },
    ],
  },
  {
    id: "CH-004", titulo: "Mouse óptico com defeito", descricao: "Cursor pula aleatoriamente na tela. Já testei em outra porta USB.",
    sala: "Lab 303", maquinaId: "PC-303-02", status: "concluido", prioridade: "baixa",
    criadoEm: "2026-02-20", criadoPor: "Roberto Lima", criadoPorId: "u7", responsavel: "Carlos Silva",
    timeline: [
      { data: "2026-02-20 08:45", descricao: "Chamado criado", autor: "Roberto Lima" },
      { data: "2026-02-20 10:00", descricao: "Chamado atribuído a Carlos Silva", autor: "Sistema" },
      { data: "2026-02-21 14:00", descricao: "Mouse substituído por novo modelo.", autor: "Carlos Silva" },
      { data: "2026-02-21 14:05", descricao: "Chamado concluído", autor: "Carlos Silva" },
    ],
  },
  {
    id: "CH-005", titulo: "Sem conexão de rede", descricao: "Máquina não conecta à rede cabeada. Cabo testado e funcionando em outra máquina.",
    sala: "Lab 202", maquinaId: "PC-202-01", status: "aberto", prioridade: "alta",
    criadoEm: "2026-02-26", criadoPor: "Ana Costa", criadoPorId: "u4",
    timeline: [{ data: "2026-02-26 07:30", descricao: "Chamado criado", autor: "Ana Costa" }],
  },
  {
    id: "CH-006", titulo: "Impressora não reconhecida", descricao: "A impressora HP LaserJet do Lab não aparece na lista de dispositivos.",
    sala: "Sala Professores", maquinaId: "PC-SP-01", status: "aberto", prioridade: "media",
    criadoEm: "2026-02-25", criadoPor: "Pedro Ferreira", criadoPorId: "u5",
    timeline: [{ data: "2026-02-25 11:00", descricao: "Chamado criado", autor: "Pedro Ferreira" }],
  },
  {
    id: "CH-007", titulo: "Software AutoCAD travando", descricao: "AutoCAD 2024 fecha sozinho após 5 minutos de uso. Possível problema de memória.",
    sala: "Lab 303", maquinaId: "PC-303-05", status: "em_andamento", prioridade: "media",
    criadoEm: "2026-02-22", criadoPor: "Roberto Lima", criadoPorId: "u7", responsavel: "Maria Santos",
    timeline: [
      { data: "2026-02-22 13:00", descricao: "Chamado criado", autor: "Roberto Lima" },
      { data: "2026-02-22 15:00", descricao: "Chamado atribuído a Maria Santos", autor: "Sistema" },
      { data: "2026-02-23 10:00", descricao: "Verificando compatibilidade de drivers GPU.", autor: "Maria Santos" },
    ],
  },
  {
    id: "CH-008", titulo: "HD fazendo barulho estranho", descricao: "HD da máquina emite cliques rítmicos. Possível falha iminente.",
    sala: "Lab 101", maquinaId: "PC-101-10", status: "concluido", prioridade: "alta",
    criadoEm: "2026-02-18", criadoPor: "João Oliveira", criadoPorId: "u3", responsavel: "Carlos Silva",
    timeline: [
      { data: "2026-02-18 09:00", descricao: "Chamado criado", autor: "João Oliveira" },
      { data: "2026-02-18 10:30", descricao: "Urgente: risco de perda de dados. Atribuído a Carlos Silva.", autor: "Sistema" },
      { data: "2026-02-19 08:00", descricao: "Backup realizado. HD substituído por SSD 480GB.", autor: "Carlos Silva" },
      { data: "2026-02-19 16:00", descricao: "Windows reinstalado e configurado. Chamado concluído.", autor: "Carlos Silva" },
    ],
  },
  {
    id: "CH-009", titulo: "Projetor sem sinal HDMI", descricao: "Projetor do Lab Multimídia não detecta sinal HDMI da máquina principal.",
    sala: "Lab Multimídia", maquinaId: "PC-LM-01", status: "aberto", prioridade: "media",
    criadoEm: "2026-02-26", criadoPor: "Pedro Ferreira", criadoPorId: "u5",
    timeline: [{ data: "2026-02-26 08:15", descricao: "Chamado criado", autor: "Pedro Ferreira" }],
  },
  {
    id: "CH-010", titulo: "Ventilador da CPU ruidoso", descricao: "Fan cooler da CPU faz barulho excessivo. Temperatura acima de 85°C.",
    sala: "Lab 202", maquinaId: "PC-202-10", status: "concluido", prioridade: "media",
    criadoEm: "2026-02-15", criadoPor: "Ana Costa", criadoPorId: "u4", responsavel: "Maria Santos",
    timeline: [
      { data: "2026-02-15 10:00", descricao: "Chamado criado", autor: "Ana Costa" },
      { data: "2026-02-15 14:00", descricao: "Chamado atribuído a Maria Santos", autor: "Sistema" },
      { data: "2026-02-16 09:00", descricao: "Limpeza realizada e pasta térmica reaplicada. Temperatura normalizada.", autor: "Maria Santos" },
      { data: "2026-02-16 09:15", descricao: "Chamado concluído", autor: "Maria Santos" },
    ],
  },
];

const salas = ["Lab 101", "Lab 202", "Lab 303", "Lab Multimídia", "Sala Professores"];

export const maquinas: Maquina[] = [];
const sos = ["Windows 11 Pro", "Windows 10 Pro", "Ubuntu 22.04 LTS"];
const tipos: Array<"Desktop" | "Notebook"> = ["Desktop", "Notebook"];
const statusMaq: Array<"funcionando" | "em_manutencao" | "defeituoso"> = ["funcionando", "funcionando", "funcionando", "em_manutencao", "defeituoso"];

salas.forEach((sala) => {
  const prefix = sala === "Lab 101" ? "PC-101" : sala === "Lab 202" ? "PC-202" : sala === "Lab 303" ? "PC-303" : sala === "Lab Multimídia" ? "PC-LM" : "PC-SP";
  const count = sala === "Sala Professores" ? 4 : sala === "Lab Multimídia" ? 6 : 10;
  for (let i = 1; i <= count; i++) {
    maquinas.push({
      id: `${prefix}-${String(i).padStart(2, "0")}`,
      tipo: sala === "Sala Professores" ? "Notebook" : tipos[Math.floor(Math.random() * 2)],
      so: sos[Math.floor(Math.random() * sos.length)],
      sala,
      ultimaManutencao: `2026-0${Math.floor(Math.random() * 2) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
      status: statusMaq[Math.floor(Math.random() * statusMaq.length)],
    });
  }
});

export const labChecklists: LabChecklist[] = [
  {
    sala: "Lab 101", nome: "Laboratório de Programação",
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
    sala: "Lab 202", nome: "Laboratório de Redes",
    items: [
      { id: "c8", software: "Windows 10 Pro", instalado: true, versao: "22H2", atualizadoPor: "Maria Santos", atualizadoEm: "2026-01-15" },
      { id: "c9", software: "Wireshark", instalado: true, versao: "4.2", atualizadoPor: "Maria Santos", atualizadoEm: "2026-01-15" },
      { id: "c10", software: "Cisco Packet Tracer", instalado: true, versao: "8.2.2", atualizadoPor: "Carlos Silva", atualizadoEm: "2026-01-28" },
      { id: "c11", software: "PuTTY", instalado: true, versao: "0.80", atualizadoPor: "Carlos Silva", atualizadoEm: "2026-01-28" },
      { id: "c12", software: "VirtualBox", instalado: false, versao: "-", nota: "Licença expirada, aguardando renovação" },
    ],
  },
  {
    sala: "Lab 303", nome: "Laboratório de Design",
    items: [
      { id: "c13", software: "Windows 11 Pro", instalado: true, versao: "23H2", atualizadoPor: "Carlos Silva", atualizadoEm: "2026-02-10" },
      { id: "c14", software: "AutoCAD 2024", instalado: true, versao: "2024.1", atualizadoPor: "Maria Santos", atualizadoEm: "2026-02-05" },
      { id: "c15", software: "Adobe Creative Suite", instalado: true, versao: "2024", atualizadoPor: "Maria Santos", atualizadoEm: "2026-02-05" },
      { id: "c16", software: "Blender", instalado: true, versao: "4.0", atualizadoPor: "Carlos Silva", atualizadoEm: "2026-02-10" },
      { id: "c17", software: "SketchUp", instalado: false, versao: "-", nota: "Solicitado pelo Prof. Roberto para março" },
    ],
  },
];

export const mockLoginUsers = [
  { email: "admin@labtech.edu.br", senha: "admin123", usuario: usuarios[0] },
  { email: "professor@labtech.edu.br", senha: "prof123", usuario: usuarios[2] },
];
