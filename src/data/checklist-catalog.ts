import type { SoftwareCatalogItem, LabSoftwareCatalog, FormatChecklistItem } from "@/types";

export type { SoftwareCatalogItem, LabSoftwareCatalog, FormatChecklistItem };

// Catálogo enxuto — apenas o essencial por laboratório, alinhado ao hardware real
export const labSoftwareCatalogs: LabSoftwareCatalog[] = [
  {
    lab: "Jobs",
    descricao: "Laboratório de Programação Básica — 60 desktops i5 4ª gen, 8GB RAM, vídeo integrado",
    softwares: [
      { nome: "Windows 10 Pro", versao: "22H2", observacao: "Versão leve compatível com hardware de 4ª geração" },
      { nome: "Python", versao: "3.11.8", observacao: "Linguagem principal das disciplinas introdutórias" },
      { nome: "Visual Studio Code", versao: "1.96", observacao: "Editor padrão — extensão Python obrigatória" },
      { nome: "Git", versao: "2.43", observacao: "Versionamento de código em sala" },
      { nome: "Google Chrome", versao: "Última estável", observacao: "Acesso ao AVA e ferramentas web" },
    ],
  },
  {
    lab: "Eniac",
    descricao: "Laboratório Móvel — 15 notebooks i5 11ª gen, 8GB DDR4, Intel Iris Xe",
    softwares: [
      { nome: "Windows 11 Pro", versao: "23H2", observacao: "Compatível com a geração do hardware" },
      { nome: "Microsoft Office 365", versao: "2024", observacao: "Conta institucional — uso em aulas itinerantes" },
      { nome: "Google Chrome", versao: "Última estável", observacao: "Navegador principal" },
      { nome: "Adobe Acrobat Reader DC", versao: "24.0", observacao: "Leitura de materiais e provas em PDF" },
    ],
  },
  {
    lab: "Boole",
    descricao: "Laboratório de Lógica e Algoritmos — 24 desktops i3 4ª gen, 8GB RAM, Intel UHD",
    softwares: [
      { nome: "Windows 10 Pro", versao: "22H2", observacao: "SO leve para hardware de entrada" },
      { nome: "Python", versao: "3.11.8", observacao: "Algoritmos e estruturas de dados" },
      { nome: "Logisim Evolution", versao: "3.8", observacao: "Simulação de circuitos lógicos" },
      { nome: "Visual Studio Code", versao: "1.96", observacao: "Editor padrão" },
    ],
  },
  {
    lab: "Fortran",
    descricao: "Laboratório de Computação Científica — 32 desktops i5 12ª gen, 16GB RAM, Intel UHD 770",
    softwares: [
      { nome: "Windows 11 Pro", versao: "23H2", observacao: "Hardware moderno suporta versão atual" },
      { nome: "MATLAB", versao: "R2024a", observacao: "Licença institucional — disciplinas numéricas" },
      { nome: "GNU Fortran (gfortran)", versao: "13.2", observacao: "Compilador da linguagem-tema do laboratório" },
      { nome: "Anaconda (Python científico)", versao: "2024.02", observacao: "NumPy, SciPy, Jupyter pré-configurados" },
    ],
  },
  {
    lab: "Ada",
    descricao: "Laboratório de IA e Computação Gráfica — 20 desktops i7 10ª gen, 16GB RAM, RTX 3050",
    softwares: [
      { nome: "Windows 11 Pro", versao: "23H2", observacao: "Compatível com drivers NVIDIA recentes" },
      { nome: "NVIDIA CUDA Toolkit", versao: "12.4", observacao: "Essencial para acelerar treinamento de modelos" },
      { nome: "Anaconda + PyTorch", versao: "2.2", observacao: "Ambiente principal de IA — usar com GPU CUDA" },
      { nome: "Blender", versao: "4.0", observacao: "Renderização e computação gráfica acelerada por GPU" },
      { nome: "Driver NVIDIA Studio", versao: "Última estável", observacao: "Crítico — manter sempre atualizado" },
    ],
  },
];

export function getFormatChecklist(lab: string): FormatChecklistItem[] {
  const catalog = labSoftwareCatalogs.find((c) => c.lab === lab);
  if (!catalog) return getDefaultChecklist();

  const items: FormatChecklistItem[] = [
    { id: "fmt-01", label: "Instalar sistema operacional (imagem institucional)", obrigatorio: true },
  ];

  catalog.softwares
    .filter((s) => !s.nome.toLowerCase().includes("windows") && !s.nome.toLowerCase().includes("driver"))
    .forEach((s, i) => {
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
    { id: "fmt-01", label: "Instalar sistema operacional (imagem institucional)", obrigatorio: true },
    { id: "fmt-02", label: "Instalar antivírus institucional", obrigatorio: true },
    { id: "fmt-03", label: "Instalar drivers de hardware", obrigatorio: true },
    { id: "fmt-04", label: "Configurar rede e domínio", obrigatorio: true },
    { id: "fmt-05", label: "Teste final de funcionalidade", obrigatorio: true },
  ];
}
