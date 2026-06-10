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
5. **Anthropic** node nativo `Anthropic Claude Sonnet` — modelo `claude-sonnet-4-5`, maxTokens 8000, system message do prompt. Roda 2× (1 por pilar). Sem cache_control — perda marginal aceita por usar nó nativo
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
5. Code `Gerar .post.ts + Validar` — valida shape, atualiza `updatedAt`, gera arquivo TS com `satisfies BlogPost` (texto puro, sem base64)
6. **GitHub** node nativo `GitHub Commit (file.edit)` — `resource: file, operation: edit` em `ossamuok/clinica-okazaki-site` branch `main`. Modo `onError: continueErrorOutput` — bifurca em sucesso/erro nativo
   - **success** → POST IndexNow (HTTP — sem nó nativo) → UPDATE `published_at` + `github_commit_sha` + drafts.status='published' → Telegram `Telegram: Publicado OK` (botão "Ver post ao vivo")
   - **error** → UPDATE `last_error` na queue → Telegram `Telegram: Falha publicação` (botão "Abrir rascunho")

**Credentials a configurar manualmente:**
- `Supabase Blog Postgres` (auto-atribuída)
- `GitHub Blog API` — tipo nativo **GitHub API** (não HTTP Header Auth!). Use access token Fine-grained PAT com Contents: Read and write
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

#### `GitHub Blog API`
- Tipo: **GitHub API** (predefinido — usado pelo nó nativo `n8n-nodes-base.github`)
- Authentication method: **Access Token**
- Access Token: `github_pat_xxxxxxxx` (sem prefixo `Bearer`)
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

---

## ⚠️ Correções 2026-06-07 (este doc estava desatualizado)

O **Gerador Semanal** (`41A8liy2qNm9zqpR`) live diverge do que está descrito acima:
- Gera **6 posts/run** (não 2). Nó Code chama-se `Escolher 6 Pilares + Prompt`, `POSTS_PER_RUN=6`.
- Anthropic via **httpRequest** (não nó nativo): `claude-sonnet-4-5`, `max_tokens 16000`, **com** `cache_control: ephemeral` no system, prefill `assistant: "{"`. Cred `anthropicApi` id `LrxhJlhaR4wnSx31`.
- `generator_pause_threshold` = **18** (não 12).
- Pausar/despausar: toggle no app editor (Configurações → Pausar gerador) **ou** `UPDATE blog_settings SET value='true'::jsonb WHERE key='generator_paused'`.

## 🧠 Aprendizado — few-shot + style guide (2026-06-07)

Sistema que faz o Gerador aprender o estilo da clínica. Guia não-técnico: `docs/blog-aprendizado.md`.

### Tabelas novas (migration `20260607_blog_learning.sql`)
- **`blog_review_log`** — guarda cada correção antes de ser apagada: `note_text`, `rejection_reason`, `original_content_json` (snapshot da versão da IA), `pillar`, `processed_at`.
- **`blog_style_rules`** — regras destiladas: `rule_text`, `scope` (tom|estrutura|seo|factual|outro), `status` (proposed|active|rejected|retired), `source_log_ids[]`, `decided_via`.

### Mudanças nos workflows existentes
- **Regenerar** (`7UwTdI8qLmb5F4JL`): nó `LOG review` (Postgres, `onError: continueRegularOutput`) entre `SELECT draft atual` e `Montar Prompt Regenerar` — grava nota + snapshot em `blog_review_log` **antes** do UPDATE que zera `reviewer_notes`. Se o log falhar, o Regenerar continua (não trava o usuário).
- **Gerador** (`41A8liy2qNm9zqpR`): 2 nós Postgres novos no ramo true do `Pode Gerar?` → `SELECT Exemplos` (top-3 aprovados por pilar) e `SELECT Regras Ativas`. O Code node injeta **regras ativas no `system`** (cacheado) e **3 exemplos do mesmo pilar no `user`** (completa com outros pilares se faltar). Lógica testada em `n8n-workflows/lib/fewshot.test.js`. Sem regras/exemplos = comportamento idêntico ao anterior (zero regressão).

### Workflows novos
| Workflow | ID | Disparo | Função |
|---|---|---|---|
| **Blog · Extrair Regras** | `P5LV0WrD3DSjQUcf` | cron `0 0 12 * * 1` + webhook `POST /webhook/blog-extrair-regras` | Lê `blog_review_log` não processado → Claude destila regras → INSERT `proposed` → manda no Telegram com botões |
| **Blog · Aprovar Regra** | `3UanDymKb3L8tTAA` | Telegram Trigger (`callback_query`) | Botão ✅/❌ → UPDATE `blog_style_rules.status` para `active`/`rejected` (idempotente, guard `AND status='proposed'`) |

### Notas operacionais (n8n public API)
- PUT/POST de workflow: body só aceita `{name, nodes, connections, settings}`; `settings` só `{"executionOrder":"v1"}` (binaryMode/callerPolicy são rejeitados → caem pro default). `availableInMCP` também não sobrevive ao PUT.
- Nós novos precisam de `id` **uuid4** senão a API os descarta silenciosamente.
- Telegram inline keyboard: `inlineKeyboard.rows[].row.buttons[]`, cada botão com `additionalFields.callback_data`.
- Postgres `onError` correto na versão atual é `"onError": "continueRegularOutput"` (não `continueOnFail`).
- Backups pré-mudança: `n8n-workflows/_backup/2026-06-07-*.json` (rollback = PUT do backup).
- **SELECT no meio de cadeia precisa `alwaysOutputData: true`** — 0 linhas = 0 items = downstream não roda (gerador pararia silencioso). Consumidor filtra item vazio.

## 💡 Sugestões de temas + anti-repetição (2026-06-10)

- **Tabela `blog_topic_suggestions`** (migration `20260610_blog_topic_suggestions.sql`): pillar, topic_text, status (pending|used|archived), RLS authenticated. Editor insere; Gerador consome.
- **Editor**: página `/temas` (`packages/editor/src/pages/Temas.tsx`) — form pilar+tema, fila pendente (excluir), histórico usados.
- **Gerador** (`41A8liy2qNm9zqpR`, agora 18 nós):
  - `SELECT Sugestoes` (alwaysOutputData) na cadeia antes do `Escolher 6 Pilares + Prompt`.
  - Sugestões **furam a fila**: FIFO por pilar, 1 por slot/run; slug = slugify(topic_text); prompt marca "tema sugerido pela equipe".
  - `Marcar Sugestao Usada` em ramo **paralelo** do Escolher (executeOnce, onError continue) — burn-on-consume: marca `used` mesmo se a geração falhar depois (raro; re-sugerir se acontecer).
  - **Anti-repetição forte**: tema-chave = 2 primeiros tokens do slug (`esteatose-hepatica-*` = 1 tema). Tema só repete quando o pool do pilar esgota. Sorteio uniforme nos sobreviventes (não mais top-3 do ranking). Janela `recent_topics` 30→100 drafts.
  - `alwaysOutputData: true` também em SELECT Exemplos/Regras Ativas (fix de bug latente).

