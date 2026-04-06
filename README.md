# LabTech Dashboard

Sistema de gerenciamento de chamados e máquinas para laboratórios de informática.

## Stack

- **React 18** + TypeScript
- **Tailwind CSS** (design tokens via CSS variables)
- **React Router** (rotas SPA)
- **TanStack React Query** (cache de dados)
- **Lucide React** (ícones)

## Estrutura

```
src/
├── assets/        # Imagens, fontes, SVGs
├── components/    # Componentes reutilizáveis (layout, ui, ThemeProvider)
├── contexts/      # Contextos React (AuthContext)
├── data/          # Dados mockados (substituir por API real)
├── pages/         # Páginas/rotas
├── services/      # Camada de API (pronta para NestJS)
├── styles/        # CSS global (tema claro/escuro)
├── types/         # Interfaces TypeScript (contratos p/ DTOs)
└── utils/         # Funções auxiliares
```

## Integração com Backend

A camada `src/services/api.ts` centraliza todas as chamadas de dados.  
Para conectar ao NestJS, basta substituir as funções mock por chamadas HTTP:

```ts
export async function getChamados(): Promise<Chamado[]> {
  const res = await fetch(`${API_BASE_URL}/chamados`);
  return res.json();
}
```

## Desenvolvimento

```sh
npm install
npm run dev
```

## Credenciais de teste

| Email                  | Senha    | Papel   |
|------------------------|----------|---------|
| admin@labtech.edu.br   | admin123 | Técnico |
| joao@labtech.edu.br    | user123  | Usuário |
