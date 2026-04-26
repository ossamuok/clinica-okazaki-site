# Blog · Supabase Setup (F3)

## Projeto

- **Project ID:** `jvrjzasvnfykftddqpqn` (compartilhado com Dashboard Amigo)
- **Region:** `sa-east-1` (São Paulo)
- **URL pública:** `https://jvrjzasvnfykftddqpqn.supabase.co`
- **Namespace:** tabelas com prefixo `blog_` (sem schema separado)

> **Decisão arquitetural:** plano original previa projeto Supabase isolado. Limite de 2 projetos free atingido — optamos por compartilhar projeto Dashboard Amigo com namespacing por prefixo. Tabelas `blog_*` ficam logicamente separadas.

## Tabelas criadas

| Tabela | Descrição |
|---|---|
| `blog_drafts` | Rascunhos pendentes / aprovados / rejeitados / publicados / arquivados |
| `blog_publish_queue` | Fila de publicação com lock pessimista (`attempt_started_at`) |
| `blog_settings` | Configuração runtime (`generator_paused`, `pause_threshold`, `publish_cadence_days`, `publish_max_per_day`, `publish_hour`, `publish_tz`, `last_pillar`) |

## Triggers

| Trigger | Tabela | Função |
|---|---|---|
| `blog_drafts_touch` | `blog_drafts` | Atualiza `updated_at` em todo UPDATE |
| `blog_drafts_status_machine` | `blog_drafts` | State machine — bloqueia transições inválidas (e.g., `pending_review → published`) |
| `blog_queue_lock_draft_id` | `blog_publish_queue` | Bloqueia mudança de `draft_id` após criação |

### State machine (transições válidas)

```
pending_review → approved | rejected | archived
approved       → published | archived | pending_review
rejected       → archived | pending_review
archived       → pending_review
published      → (terminal)
```

## RLS Policies

RLS **habilitado** em todas as 3 tabelas. Frontend usa **anon key + JWT autenticado**, NUNCA service_role.

| Tabela | Operação | Quem | Restrição extra |
|---|---|---|---|
| `blog_drafts` | SELECT | authenticated | — |
| `blog_drafts` | UPDATE | authenticated | `reviewer_user_id = auth.uid()` E `status <> 'published'` |
| `blog_drafts` | INSERT/DELETE | só service_role (n8n) | — |
| `blog_publish_queue` | SELECT | authenticated | — |
| `blog_publish_queue` | INSERT | authenticated | — |
| `blog_publish_queue` | UPDATE | authenticated | `published_at IS NULL` |
| `blog_publish_queue` | DELETE | só service_role | — |
| `blog_settings` | SELECT | authenticated | — |
| `blog_settings` | UPDATE | authenticated | — |

## Credenciais

### Frontend / editor (publicáveis)

```
SUPABASE_URL=https://jvrjzasvnfykftddqpqn.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_-MkqCmLTQNDH0fR9WwkXmQ_nXaz_b6B
```

Anon key legacy (compatibilidade — preferir publishable):
```
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2cmp6YXN2bmZ5a2Z0ZGRxcHFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5OTQ2NjMsImV4cCI6MjA5MjU3MDY2M30.HJvO9A4cvLehPiE9ZE4N1Ys6A-rKho5ScGqxiburR0g
```

### Backend / n8n (service_role)

⚠️ **NÃO incluído neste arquivo.** Pegue no Dashboard Supabase:
- Project Settings → API → `service_role` (legacy) ou `secret keys` (modern)
- Salvar APENAS em n8n credentials e Edge Functions
- NUNCA committar, NUNCA expor no frontend

## Ações manuais obrigatórias (Ossamu)

### 1. Desabilitar signups

1. Dashboard Supabase → projeto `jvrjzasvnfykftddqpqn` (Dashboard Amigo)
2. Authentication → Providers → Email
3. Desmarcar **"Enable signups"** (mantém **"Enable email confirmations"** se desejar)
4. Save

> Sem isto, qualquer pessoa com `?signup=true` no editor consegue criar conta. Com signup OFF, apenas usuários invitados pelo Dashboard podem entrar.

### 2. Convidar Dra. Jane

1. Authentication → Users → **Invite User**
2. Email: `erikafrazao@gmail.com`
3. Send invite → Jane recebe magic link no email
4. Quando Jane logar, `auth.uid()` ficará disponível em todas as policies RLS

### 3. (Opcional) Customizar email template

1. Authentication → Email Templates → Magic Link
2. Subject: `Acesso ao painel de blog · Clínica Okazaki`
3. Body em PT-BR (modelo simples + link)

## Verificação

```sql
-- Conta tabelas + triggers + policies (executar via SQL Editor):
SELECT
  (SELECT count(*) FROM blog_drafts) AS drafts,
  (SELECT count(*) FROM blog_publish_queue) AS queue,
  (SELECT count(*) FROM blog_settings) AS settings,
  (SELECT count(*) FROM information_schema.triggers WHERE event_object_table LIKE 'blog_%') AS triggers,
  (SELECT count(*) FROM pg_policies WHERE tablename LIKE 'blog_%') AS policies;
-- Esperado: 0 drafts, 0 queue, 7 settings, 3 triggers, 7 policies
```

State machine smoke test:
```sql
-- Insere rascunho
INSERT INTO blog_drafts (pillar, title, slug, meta_description, content_json)
VALUES ('gastroenterologia', 'Test', 'test-smoke', 'meta description com tamanho mínimo aqui ok ok ok ok', '{"test":1}'::jsonb);

-- Tentar pular para published direto (DEVE FALHAR)
UPDATE blog_drafts SET status='published' WHERE slug='test-smoke';
-- Erro esperado: "invalid blog_drafts status transition: pending_review -> published"

-- Limpa
DELETE FROM blog_drafts WHERE slug='test-smoke';
```

## Próximos passos (F4)

- Criar `packages/editor` (React + Vite + Tailwind + shadcn/ui + Supabase JS)
- Implementar Login (magic link), Inbox, DraftEditor, Aprovar+Agendar
- Deploy Vercel `editor.clinicaokazaki.com`

## Rollback

```sql
-- Em caso de necessidade:
DROP TRIGGER IF EXISTS blog_drafts_status_machine ON blog_drafts;
DROP TRIGGER IF EXISTS blog_drafts_touch ON blog_drafts;
DROP TRIGGER IF EXISTS blog_queue_lock_draft_id ON blog_publish_queue;
DROP FUNCTION IF EXISTS blog_validate_status_transition();
DROP FUNCTION IF EXISTS blog_touch_updated_at();
DROP FUNCTION IF EXISTS blog_lock_queue_draft_id();
DROP TABLE IF EXISTS blog_publish_queue CASCADE;
DROP TABLE IF EXISTS blog_drafts CASCADE;
DROP TABLE IF EXISTS blog_settings CASCADE;
```
