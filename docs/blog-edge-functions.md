# Blog · Edge Functions (F6)

## Funções deployadas

Projeto Supabase: `jvrjzasvnfykftddqpqn`

| Nome | Slug | Trigger | Status |
|---|---|---|---|
| Notify Jane (novos drafts) | `notify-jane-new-drafts` | n8n Gerador após INSERT × 2 drafts | ACTIVE v1 |
| Notify success (publish) | `notify-publish-success` | n8n Publicador após deploy verde | ACTIVE v1 |
| Notify failure (publish) | `notify-publish-failure` | n8n Publicador em falha | ACTIVE v1 |

## Endpoint URLs

```
POST https://jvrjzasvnfykftddqpqn.supabase.co/functions/v1/notify-jane-new-drafts
POST https://jvrjzasvnfykftddqpqn.supabase.co/functions/v1/notify-publish-success
POST https://jvrjzasvnfykftddqpqn.supabase.co/functions/v1/notify-publish-failure
```

Headers obrigatórios em cada request (n8n HTTP Request node):
- `Content-Type: application/json`
- `Authorization: Bearer <SUPABASE_ANON_KEY ou SERVICE_ROLE_KEY>` — `verify_jwt: true` exige JWT válido

## Bodies esperados

### `notify-jane-new-drafts`
```json
{
  "to": "erikafrazao@gmail.com",
  "drafts": [
    { "id": "uuid", "title": "Título do post", "pillar": "gastroenterologia" }
  ]
}
```

### `notify-publish-success`
```json
{
  "to": "erikafrazao@gmail.com",
  "title": "Refluxo Gastroesofágico em Recife...",
  "slug": "refluxo-gastroesofagico",
  "pillar": "gastroenterologia",
  "commit_sha": "abc1234...",
  "deploy_url": "https://..."
}
```

### `notify-publish-failure`
```json
{
  "to": "ossamuok@gmail.com",
  "draft_id": "uuid",
  "slug": "refluxo-gastroesofagico",
  "stage": "github_commit",
  "error": "Octokit 422: ...",
  "attempt_count": 2
}
```

## ⚠️ Ações manuais obrigatórias antes de F6 funcionar

### 1. Provisionar Resend (Ossamu)

1. Criar conta em https://resend.com (free 3.000/mês)
2. Adicionar domínio `clinicaokazaki.com` em Domains
3. Configurar DNS no Registro.br (DKIM + SPF) conforme Resend mostra
4. Aguardar verificação (5-30 min)
5. Criar API Key (Settings → API Keys → "blog notifications")

### 2. Configurar secrets das Edge Functions

Dashboard Supabase → projeto `jvrjzasvnfykftddqpqn` → Project Settings → Edge Functions → Secrets:

```
RESEND_API_KEY=re_xxxxxxxxxx
BLOG_FROM_EMAIL="Editor Blog Okazaki <blog@clinicaokazaki.com>"
EDITOR_URL=https://editor.clinicaokazaki.com
```

> **Sem RESEND_API_KEY as funções respondem 500** com `error: "Resend API key missing"`. Pipeline n8n vai falhar; mas o deploy próprio das funções já está vivo.

## Smoke test (após Resend config)

```bash
curl -X POST \
  https://jvrjzasvnfykftddqpqn.supabase.co/functions/v1/notify-jane-new-drafts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -d '{
    "to": "erikafrazao@gmail.com",
    "drafts": [{"id":"test","title":"Smoke test","pillar":"gastroenterologia"}]
  }'
# Esperado: {"ok":true,"message_id":"..."}
```

## Atualização

Re-deploy via Supabase MCP (`apply_edge_function`) cria nova versão. Versão anterior fica archivada — rollback via Dashboard.

Código fonte versionado em `supabase/functions/`.
