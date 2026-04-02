import type { SoftwareCatalogItem, LabSoftwareCatalog, FormatChecklistItem } from "@/types";

export type { SoftwareCatalogItem, LabSoftwareCatalog, FormatChecklistItem };

export const labSoftwareCatalogs: LabSoftwareCatalog[] = [
  {
    lab: "Pascal",
    descricao: "Laboratório de Programação",
    softwares: [
      { nome: "Windows 11 Pro", versao: "23H2", observacao: "Licença institucional via KMS" },
      { nome: "Microsoft Office 365", versao: "2024", observacao: "Conta institucional — login automático" },
      { nome: "Adobe Acrobat Reader DC", versao: "24.0", observacao: "Instalação via imagem padrão" },
      { nome: "Python 3.11", versao: "3.11.8 + pip", observacao: "Incluir virtualenv e jupyter" },
      { nome: "Visual Studio Code", versao: "1.96", observacao: "Extensões: Python, C/C++, GitLens" },
      { nome: "Git", versao: "2.43", observacao: "Configurar credenciais globais da instituição" },
      { nome: "Node.js LTS", versao: "20.11", observacao: "Instalar via NVM para facilitar atualizações" },
      { nome: "Java JDK", versao: "21 LTS", observacao: "OpenJDK — configurar JAVA_HOME" },
      { nome: "MySQL Workbench", versao: "8.0", observacao: "Conexão ao servidor acadêmico pré-configurada" },
      { nome: "Antivírus Kaspersky", versao: "Institucional", observacao: "Licença gerenciada pelo TI central" },
      { nome: "Drivers de Rede/Áudio/Vídeo", versao: "Específicos", observacao: "Usar pacote de drivers do modelo da máquina" },
    ],
  },
  {
    lab: "Jobs",
    descricao: "Laboratório de Redes",
    softwares: [
      { nome: "Windows 10 Pro", versao: "22H2", observacao: "Imagem padrão do departamento" },
      { nome: "Microsoft Office 365", versao: "2024", observacao: "Conta institucional" },
      { nome: "Wireshark", versao: "4.2", observacao: "Instalar com WinPcap/Npcap" },
      { nome: "Cisco Packet Tracer", versao: "8.2.2", observacao: "Licença Cisco Networking Academy" },
      { nome: "PuTTY", versao: "0.80", observacao: "Incluir PuTTYgen e Pageant" },
      { nome: "VirtualBox", versao: "7.0", observacao: "Licença GPLv2 — instalação livre" },
      { nome: "GNS3", versao: "2.2", observacao: "Configurar com imagens Cisco pré-carregadas" },
      { nome: "FileZilla", versao: "3.67", observacao: "Cliente FTP para práticas de redes" },
      { nome: "Nmap", versao: "7.94", observacao: "Apenas para uso em rede interna do lab" },
      { nome: "Antivírus Kaspersky", versao: "Institucional", observacao: "Licença gerenciada pelo TI central" },
      { nome: "Drivers de Rede/Áudio/Vídeo", versao: "Específicos", observacao: "Usar pacote de drivers do modelo da máquina" },
    ],
  },
  {
    lab: "Faraday",
    descricao: "Laboratório de Design",
    softwares: [
      { nome: "Windows 11 Pro", versao: "23H2", observacao: "Licença institucional via KMS" },
      { nome: "Microsoft Office 365", versao: "2024", observacao: "Conta institucional" },
      { nome: "AutoCAD", versao: "2024.1", observacao: "Licença educacional Autodesk" },
      { nome: "Adobe Creative Suite", versao: "2024", observacao: "Photoshop, Illustrator, InDesign — licença institucional" },
      { nome: "Blender", versao: "4.0", observacao: "Software livre — instalação direta" },
      { nome: "SketchUp", versao: "2024", observacao: "Versão educacional — solicitar licença ao coordenador" },
      { nome: "GIMP", versao: "2.10", observacao: "Alternativa livre ao Photoshop" },
      { nome: "Adobe Acrobat Reader DC", versao: "24.0", observacao: "Instalação via imagem padrão" },
      { nome: "Antivírus Kaspersky", versao: "Institucional", observacao: "Licença gerenciada pelo TI central" },
      { nome: "Drivers GPU (NVIDIA/AMD)", versao: "Última estável", observacao: "Drivers Studio — essencial para renderização" },
    ],
  },
  {
    lab: "Einstein",
    descricao: "Laboratório Multimídia",
    softwares: [
      { nome: "Windows 11 Pro", versao: "23H2", observacao: "Licença institucional via KMS" },
      { nome: "Microsoft Office 365", versao: "2024", observacao: "Conta institucional" },
      { nome: "Adobe Premiere Pro", versao: "2024", observacao: "Licença institucional Adobe" },
      { nome: "Adobe After Effects", versao: "2024", observacao: "Licença institucional Adobe" },
      { nome: "OBS Studio", versao: "30.0", observacao: "Software livre — configurar perfis de gravação" },
      { nome: "Audacity", versao: "3.4", observacao: "Software livre — plugins LAME e FFmpeg" },
      { nome: "DaVinci Resolve", versao: "18.6", observacao: "Versão gratuita — edição de vídeo alternativa" },
      { nome: "VLC Media Player", versao: "3.0", observacao: "Reprodução de mídias diversas" },
      { nome: "Antivírus Kaspersky", versao: "Institucional", observacao: "Licença gerenciada pelo TI central" },
      { nome: "Drivers de Áudio/Vídeo", versao: "Específicos", observacao: "Essencial para captura e edição" },
    ],
  },
  {
    lab: "Tesla",
    descricao: "Sala de Professores",
    softwares: [
      { nome: "Windows 11 Pro", versao: "23H2", observacao: "Licença institucional via KMS" },
      { nome: "Microsoft Office 365", versao: "2024", observacao: "Conta institucional — incluir Teams e OneDrive" },
      { nome: "Adobe Acrobat Reader DC", versao: "24.0", observacao: "Instalação via imagem padrão" },
      { nome: "Google Chrome", versao: "Última estável", observacao: "Navegador principal — perfil institucional" },
      { nome: "Zoom", versao: "6.0", observacao: "Licença institucional para aulas remotas" },
      { nome: "Mozilla Firefox", versao: "Última estável", observacao: "Navegador alternativo" },
      { nome: "7-Zip", versao: "23.01", observacao: "Compactação de arquivos" },
      { nome: "Antivírus Kaspersky", versao: "Institucional", observacao: "Licença gerenciada pelo TI central" },
      { nome: "Drivers de Rede/Áudio/Vídeo", versao: "Específicos", observacao: "Usar pacote de drivers do modelo da máquina" },
    ],
  },
];

// Checklist interativo para formatação (usado dentro dos chamados)
export interface FormatChecklistItem {
  id: string;
  label: string;
  obrigatorio: boolean;
}

export function getFormatChecklist(lab: string): FormatChecklistItem[] {
  const catalog = labSoftwareCatalogs.find((c) => c.lab === lab);
  if (!catalog) return getDefaultChecklist();

  const items: FormatChecklistItem[] = [
    { id: "fmt-01", label: "Instalar sistema operacional (imagem institucional)", obrigatorio: true },
  ];

  catalog.softwares
    .filter((s) => !s.nome.includes("Driver") && !s.nome.includes("Antivírus"))
    .forEach((s, i) => {
      if (s.nome.includes("Windows")) return; // já coberto pelo item de SO
      items.push({
        id: `fmt-${String(i + 10).padStart(2, "0")}`,
        label: `Instalar ${s.nome} ${s.versao}`,
        obrigatorio: true,
      });
    });

  items.push(
    { id: "fmt-90", label: "Instalar antivírus institucional", obrigatorio: true },
    { id: "fmt-91", label: "Instalar drivers de hardware", obrigatorio: true },
    { id: "fmt-92", label: "Configurar rede e domínio", obrigatorio: true },
    { id: "fmt-93", label: "Teste final de funcionalidade", obrigatorio: true },
  );

  return items;
}

function getDefaultChecklist(): FormatChecklistItem[] {
  return [
    { id: "fmt-01", label: "Instalar Windows 11 Pro (versão institucional)", obrigatorio: true },
    { id: "fmt-02", label: "Instalar Office 365", obrigatorio: true },
    { id: "fmt-03", label: "Instalar Adobe Acrobat Reader", obrigatorio: true },
    { id: "fmt-04", label: "Instalar antivírus institucional", obrigatorio: true },
    { id: "fmt-05", label: "Instalar drivers de hardware", obrigatorio: true },
    { id: "fmt-06", label: "Configurar rede e domínio", obrigatorio: true },
    { id: "fmt-07", label: "Teste final de funcionalidade", obrigatorio: true },
  ];
}
