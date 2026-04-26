# @okazaki/editor

App de aprovação de posts do blog para Dra. Jane.

## Stack
React + Vite + Tailwind + Supabase JS + Tiptap

## Setup local

```bash
cp .env.example .env.local
# Edite com SUPABASE_URL e ANON_KEY do projeto blog (jvrjzasvnfykftddqpqn)
pnpm --filter @okazaki/editor dev
# http://localhost:5174
```

## Deploy Vercel

Projeto separado:
- Root Directory: `packages/editor`
- Framework: Vite
- Build Command: `pnpm build`
- Install Command: `cd ../.. && pnpm install --frozen-lockfile`
- Output Directory: `dist`
- Domain custom: `editor.clinicaokazaki.com`
- Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Funcionalidades F4 MVP

- Magic link login (Supabase Auth)
- Inbox com filtros por status (pending_review, approved, rejected, archived, all)
- DraftEditor:
  - Edita metadados (title, slug, meta_description, excerpt, keywords)
  - Edita inline texto de blocos `p`, `h3`, `ul`, `callout`, `warning` (Tiptap em prosa)
  - Preview lado-a-lado via `@okazaki/shared-renderer`
  - Aprovar+Agendar (com `nextFreeSlot`, validação 1-por-dia client-side)
  - Rejeitar (com motivo)
  - Salvar rascunho
  - Pedir nova versão (volta status p/ pending_review com nota)
  - Arquivar
- Validação Zod do shape antes de aprovar

## Limitações F4 (vão para F5)

- Sem reordenação/adição/remoção de seções
- Sem edição de blocos `video`, `link`, `inline-cta` (preservados como vêm do gerador)
- Sem Queue (calendário visual da fila)
- Sem Settings UI (toggle generator paused, threshold)
- Sem Published (histórico)
