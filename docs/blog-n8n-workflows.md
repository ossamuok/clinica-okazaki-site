# Blog · n8n Workflows (F7 + F8)

Instância n8n: `https://automacoes-n8n.adhgqk.easypanel.host`

| Workflow | ID | Cron | Status inicial |
|---|---|---|---|
| Blog · Gerador Semanal | `41A8liy2qNm9zqpR` | `0 0 11 * * 1` (seg 11h UTC = 8h BRT) | DRAFT — ativar manualmente |
| Blog · Publicador | `WTKgkMiaL74BmJbG` | `0 */15 * * * *` (a cada 15 min) | DRAFT — ativar manualmente |

URLs:
- https://automacoes-n8n.adhgqk.easypanel.host/workflow/41A8liy2qNm9zqpR
- https://automacoes-n8n.adhgqk.easypanel.host/workflow/WTKgkMiaL74BmJbG

## F7 — Blog · Gerador Semanal

**Disparo:** segunda-feira 08:00 BRT (11:00 UTC).

**Fluxo:**
1. Schedule Trigger
2. Postgres `Ler Settings + Buffer` — lê `generator_paused`, `generator_pause_threshold`, `last_pillar`, `count(blog_drafts WHERE status IN ('pending_review','approved'))`
3. If `Pode Gerar?` — `paused=false AND buffer < threshold`
4. Code `Escolher 2 Pilares + Prompt` — round-robin a partir de `last_pillar`, monta system + user prompt para 2 pilares
5. HTTP `Anthropic Claude Sonnet` — `claude-sonnet-4-5`, max_tokens 8000, system com `cache_control: ephemeral`. Roda 2× (1 por pilar)
6. Code `Parse + Validar` — extrai bloco text, JSON.parse, valida campos obrigatórios + slug regex + description length
7. Postgres `INSERT blog_drafts` — INSERT 2× (1 por pilar)
8. Postgres `UPDATE last_pillar` — atualiza `settings.last_pillar` para o último pilar inserido
9. Telegram `Notificar Grupo Telegram` — sendMessage com lista de drafts + botão inline "Abrir editor" (executeOnce, agrega ids; chat_id `-5152728039`, parse_mode HTML)

**Credentials a configurar manualmente:**
- `Supabase Blog Postgres` (auto-atribuída se já existir conta Postgres)
- `Anthropic Blog` — Anthropic API key (Settings → Credentials → New → "Anthropic API")
- `Telegram Blog Bot` — Telegram API, token do BotFather

## F8 — Blog · Publicador

**Disparo:** a cada 15 minutos.

**Fluxo:**
1. Schedule Trigger
2. Postgres `Lock + Claim Draft` — CTE `FOR UPDATE SKIP LOCKED` + cap 1/dia BRT, marca `attempt_started_at` + incrementa `attempt_count`
3. If `Tem entry?` — sai se nada disponível
4. Postgres `SELECT draft completo` — JOIN drafts + queue
5. Code `Gerar .post.ts + Validar` — valida shape, atualiza `updatedAt`, gera arquivo TS com `satisfies BlogPost`, base64 encoda
6. HTTP `GitHub createOrUpdate File` — PUT em `repos/ossamuok/clinica-okazaki-site/contents/packages/site/src/content/blog/<slug>.post.ts`
7. If `Commit OK?` — statusCode < 300
   - **TRUE** → POST IndexNow → UPDATE `published_at` + `github_commit_sha` + drafts.status='published' → Telegram `Telegram: Publicado OK` (botão "Ver post ao vivo")
   - **FALSE** → UPDATE `last_error` na queue → Telegram `Telegram: Falha publicação` (botão "Abrir rascunho")

**Credentials a configurar manualmente:**
- `Supabase Blog Postgres` (auto-atribuída)
- `GitHub PAT Blog` — HTTP Header Auth, header `Authorization: Bearer github_pat_xxx`. PAT precisa scope `Contents: Write` no repo `ossamuok/clinica-okazaki-site`
- `Telegram Blog Bot` (mesma do Gerador)

**Variável de ambiente n8n necessária:**
- `INDEXNOW_KEY` — string aleatória 32 chars (gere via `openssl rand -hex 16`)
  - Crie correspondente em `packages/site/public/<KEY>.txt` com o mesmo valor
  - Adicionar em n8n Settings → Variables

## ⚠️ Ações manuais p/ ativar (Ossamu)

### 1. Configurar credentials no n8n

Para cada credential listada, abrir n8n → Settings → Credentials → New:

#### `Supabase Blog Postgres`
- Tipo: **Postgres**
- Host: `db.jvrjzasvnfykftddqpqn.supabase.co`
- Database: `postgres`
- User: `postgres`
- Password: pegue em Supabase Dashboard → Settings → Database → Connection string
- Port: `5432`
- SSL: `require`

> Já existe credencial Postgres no n8n? n8n auto-atribuiu — verificar se aponta para o projeto `jvrjzasvnfykftddqpqn`. Se não, criar nova com nome diferente e atualizar nodes.

#### `Anthropic Blog`
- Tipo: **Anthropic API** (predefinido)
- API Key: pegue em https://console.anthropic.com/settings/keys

#### `Telegram Blog Bot`
- Tipo: **Telegram API** (predefinido)
- Access Token: token do BotFather (`/mybots` → seu bot → API Token)
- Após salvar, n8n auto-atribui aos 3 nós Telegram nos workflows F7+F8
- Grupo Telegram já configurado: chat_id `-5152728039` (hardcoded nos nós)

#### `GitHub PAT Blog`
- Tipo: **HTTP Header Auth**
- Name: `Authorization`
- Value: `Bearer github_pat_xxxxxxxx`
- Como gerar PAT:
  1. https://github.com/settings/tokens?type=beta
  2. Generate new token (Fine-grained)
  3. Repository access: only `ossamuok/clinica-okazaki-site`
  4. Permissions → Repository → Contents: **Read and write**
  5. Copiar token → não dá pra ver depois

### 2. Configurar variable INDEXNOW_KEY

```bash
# Gere chave random 32 chars
openssl rand -hex 16
# exemplo: 4f3a8b2c1d9e5f7a6b8c2d4e1f9a3b5c
```

- n8n → Settings → Variables → New: `INDEXNOW_KEY` = `<chave>`
- Criar arquivo no repo: `packages/site/public/<chave>.txt` com APENAS `<chave>` dentro
- Build site → Vercel serve em `https://www.clinicaokazaki.com/<chave>.txt`

### 3. Ativar workflows

Abrir cada workflow no n8n UI → toggle "Active" no canto superior direito.

> **Atenção:** ativar Publicador antes do site (F1) ter sido deployado em prod com a estrutura `/blog` quebra: arquivo .post.ts vai pra repo, build CI corre, deploy → 200 só se branch f5/f4 já merged + Vercel editor configurado. Active **DEPOIS** de F4-F5 mergeados + Vercel editor up + credencial Telegram configurada.

## Smoke test end-to-end

Após todas credentials configuradas:

1. **Gerador manual** — abrir workflow F7 → Execute Workflow (manual). Espera: 2 rows em `blog_drafts` + mensagem no grupo Telegram.
2. **Editor** — Jane logga em `editor.clinicaokazaki.com`, vê os 2 drafts no inbox, edita, aprova com data hoje (back-fill `scheduled_for` para `NOW() - 1 minute`).
3. **Publicador manual** — workflow F8 → Execute. Espera: 1 commit em `main`, 1 deploy Vercel, 1 row `published_at` setado, mensagem Telegram "✅ Post publicado".
4. **Site** — verificar `https://www.clinicaokazaki.com/blog/<slug>` ao vivo.
5. **Sitemap** — `https://www.clinicaokazaki.com/sitemap.xml` deve incluir o slug novo após próximo build.

## Rollback

Para desativar pipeline imediatamente:
1. n8n → Settings da workflow → toggle "Active" OFF (ambos)
2. OU pause via app editor: Configurações → Pausar gerador = ON
3. Reverter post publicado: revert commit em `main` no GitHub

## Custos esperados

| Item | Estimado/mês |
|---|---|
| Anthropic Claude Sonnet (2 posts/sem × 4 sem × ~5k tokens out × $3/1M) | ~$0.20 |
| Anthropic input + cache hits | ~$0.30 |
| Telegram (notificações) | $0 (ilimitado) |
| Vercel Hobby (site + editor) | $0 |
| Supabase free tier (compartilhado Dashboard Amigo) | $0 |
| **Total mensal** | **~$0.50-1** |
