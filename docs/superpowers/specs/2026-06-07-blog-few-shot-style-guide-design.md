# Blog Few-shot + Style Guide — Design Spec

**Data:** 2026-06-07
**Alvo:** blog real da Clínica Okazaki (repo `clinica-okazaki`, Supabase live `jvrjzasvnfykftddqpqn`, n8n live)
**Escopo:** v1 = Peça A (few-shot) + Peça B (style guide) + trava-perda de notas. Peça C (aprendizado por diff) fica fora da v1, mas o dado é coletado desde já.

---

## 1. Problema

A IA do Gerador não aprende sozinha a forma como a clínica gosta de escrever. Hoje:

- Posts aprovados ficam no banco mas **não realimentam** a geração.
- `reviewer_notes` (instrução de correção) é **zerado** após cada regeneração no workflow Regenerar (`7UwTdI8qLmb5F4JL`) → sinal de aprendizado evapora.
- A versão original que a IA gerou é **sobrescrita** ao editar/regenerar → não dá pra comparar antes×depois.

## 2. Objetivo

Fazer cada post aprovado e cada correção melhorarem o próximo post, sem fine-tuning, sem frontend novo, sem mexer no editor TipTap. Mecanismo: realimentar o prompt do Gerador com (a) exemplos aprovados e (b) regras de estilo destiladas das correções, aprovadas por humano via Telegram.

## 3. Decisões travadas (brainstorming 2026-06-07)

| # | Decisão | Escolha |
|---|---------|---------|
| 1 | Alvo | Blog real (`clinica-okazaki` + n8n live + Supabase live) |
| 2 | Escopo v1 | A + B + trava-perda. C fora (mas snapshot coletado). |
| 3 | Gate das regras | **Aprovação humana** antes de entrar no prompt |
| 4 | Seleção few-shot | **Mesmo pilar + completa** com recentes se faltar |
| 5 | UI de aprovação | **Telegram** (chat `-5152728039`, bot cred `pxD4NXXhJpW9E7Jn`) |
| 6 | Nº de exemplos | **3** por geração |
| 7 | Snapshot original | **Incluído** no log (habilita Peça C futura) |

## 4. Realidade técnica confirmada

**Schema `blog_drafts`** (migration `20260425_blog_create_schema.sql`):
`id, pillar (enum 5 pilares), title, slug, meta_description, keywords[], content_json JSONB, word_count, generated_at, generated_by, status (pending_review|approved|rejected|published|archived), reviewer_user_id, reviewed_at, reviewer_notes, rejection_reason, updated_at`

**Gerador** (workflow `41A8liy2qNm9zqpR`, "Blog · Gerador Semanal"):
- Nós: `Toda Segunda 08:00 BRT` → `Ler Settings + Buffer` → `Pode Gerar?` → `Escolher 6 Pilares + Prompt` (Code, monta `system`+`user`) → `Anthropic Claude Sonnet` (HTTP) → `Parse + Validar` → `INSERT blog_drafts` → `UPDATE last_pillar` → `Notificar Grupo Telegram`. (+ `Check Dup`, `Merge Dup`, `Eh Dup?`, `Telegram Descartado`).
- `POSTS_PER_RUN = 6`. Gera 6 posts por execução, gated por buffer < threshold (default 12).
- Anthropic body: `model: "claude-sonnet-4-5", max_tokens: 16000, system: [{type:"text", text: $json.system, cache_control:{type:"ephemeral"}}], messages:[{role:"user", content:$json.user},{role:"assistant", content:"{"}]`.

**Regenerar** (workflow `7UwTdI8qLmb5F4JL`, "Blog · Regenerar Draft"):
- Webhook `POST /webhook/blog-regenerar` `{draft_id, reviewer_notes}`.
- Pipeline: Webhook → SELECT draft atual → Montar Prompt Regenerar → Anthropic → Parse+Validar → **UPDATE blog_drafts (status=pending_review, reviewer_notes=NULL)** → Resposta.
- O `UPDATE` é onde a nota é perdida.

**Telegram:** nó `n8n-nodes-base.telegram`, credencial `telegramApi` id `pxD4NXXhJpW9E7Jn` ("Telegram account"), chat `-5152728039`. Bot real → inline keyboard + `callback_query` viáveis.

## 5. Arquitetura

```
                    ┌─ blog_drafts (approved/published) ──┐
                    │                                     ▼
GERADOR ────────────┼─ blog_style_rules (active) ──→ system: regras cacheadas
  6 posts/run       │                                user: 3 exemplos do pilar
                    │                                     ▼
                    └──────────────────────────→ Claude → posts melhores

REGENERAR ── antes de zerar nota → INSERT blog_review_log (nota + snapshot original)

EXTRATOR (semanal/manual) ── lê log não processado → Claude destila regras
                                          ▼
                          blog_style_rules (status=proposed)
                                          ▼
                    Telegram [✅ Aprovar][❌ Recusar] ──→ status=active/rejected
```

## 6. Componentes

### 6.1 Migration nova — 2 tabelas

`supabase/migrations/20260607_blog_learning.sql`

**`blog_review_log`** — trava-perda + snapshot:
```sql
CREATE TABLE blog_review_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID REFERENCES blog_drafts(id) ON DELETE SET NULL,
  pillar TEXT,
  note_text TEXT,                     -- reviewer_notes capturado antes do regen
  rejection_reason TEXT,
  original_content_json JSONB,        -- snapshot da versão da IA (habilita Peça C)
  captured_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ            -- NULL = ainda não consumido pelo extrator
);
CREATE INDEX idx_review_log_unprocessed ON blog_review_log(captured_at) WHERE processed_at IS NULL;
```

**`blog_style_rules`** — regras destiladas:
```sql
CREATE TABLE blog_style_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_text TEXT NOT NULL,
  scope TEXT CHECK (scope IN ('tom','estrutura','seo','factual','outro')) DEFAULT 'outro',
  status TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed','active','rejected','retired')),
  source_log_ids UUID[],              -- rastreabilidade: de quais notas saiu
  created_at TIMESTAMPTZ DEFAULT NOW(),
  decided_at TIMESTAMPTZ,
  decided_via TEXT                    -- ex: 'telegram'
);
CREATE INDEX idx_style_rules_active ON blog_style_rules(status) WHERE status='active';
```

RLS: seguir padrão das tabelas blog existentes (migration de triggers/RLS). Service role do n8n já acessa via credencial Postgres "Supabase Blog Postgres".

### 6.2 Peça A — Few-shot (patch no Gerador `41A8liy2qNm9zqpR`)

**Atenção à realidade:** o Gerador produz 6 posts/run, possivelmente de pilares diferentes. O prompt-builder (`Escolher 6 Pilares + Prompt`) emite 6 itens, cada um com seu `pillar`. Logo os exemplos few-shot precisam ser escolhidos **por pilar de cada post**, não um conjunto único.

- **Nó novo `SELECT Exemplos`** (Postgres), roda **uma vez antes** do prompt-builder e traz os top-3 aprovados **de cada pilar** num só query (window function), pra o Code node mapear por post sem N chamadas ao banco:
  ```sql
  SELECT pillar, title, content_json
  FROM (
    SELECT pillar, title, content_json,
           ROW_NUMBER() OVER (PARTITION BY pillar ORDER BY reviewed_at DESC NULLS LAST) AS rn
    FROM blog_drafts
    WHERE status IN ('approved','published')
  ) t
  WHERE rn <= 3;
  ```
- **Prompt-builder `Escolher 6 Pilares + Prompt`**: pra cada um dos 6 posts, seleciona os exemplos do **mesmo pilar** desse post; se o pilar tiver < 3 aprovados, **completa** com os aprovados mais recentes de qualquer pilar (já disponíveis no resultado acima) até somar 3. Injeta na mensagem **`user`**, bloco "EXEMPLOS DE POSTS APROVADOS — escreva no mesmo estilo:". O `system` fica estável → cache hit preservado.
- Edge case: pool total < 3 → usa quantos houver (0 exemplos = comportamento atual, sem regressão).
- Custo: ~3 × content_json (≥1500 palavras) por post, não-cacheado. Aceito. Otimização futura (condensar exemplo) fora da v1.

### 6.3 Peça B — Style guide (patch no Gerador)

- **Nó novo `SELECT Regras Ativas`** (Postgres): `SELECT rule_text FROM blog_style_rules WHERE status='active' ORDER BY decided_at`.
- **Prompt-builder**: concatena as regras no **`system`** (cacheado, estável entre pilares), bloco "REGRAS APRENDIDAS COM O EDITOR (seguir à risca):".
- Zero regras ativas → bloco omitido, sem regressão.

### 6.4 Trava-perda (patch no Regenerar `7UwTdI8qLmb5F4JL`)

- **Nó novo `LOG review`** (Postgres INSERT) inserido **antes** do `UPDATE blog_drafts`:
  ```sql
  INSERT INTO blog_review_log (draft_id, pillar, note_text, rejection_reason, original_content_json)
  SELECT id, pillar, reviewer_notes, rejection_reason, content_json
  FROM blog_drafts WHERE id = $draft_id;
  ```
  (Captura nota + snapshot da versão atual antes da sobrescrita.)
- Ordem: SELECT draft → **LOG review** → ... → UPDATE (zera nota). Nota fica preservada no log.

### 6.5 Extrator de regras (workflow novo "Blog · Extrair Regras")

- Trigger: schedule semanal + webhook manual (pra rodar sob demanda).
- Pipeline: SELECT `blog_review_log WHERE processed_at IS NULL` → Code monta prompt → Anthropic (`claude-sonnet-4-5`) destila 1-5 regras candidatas (com `scope`) → INSERT em `blog_style_rules` status=`proposed`, `source_log_ids` preenchido → UPDATE `blog_review_log.processed_at=NOW()` → Telegram envia cada regra com inline keyboard `[✅ Aprovar][❌ Recusar]`, callback_data `aprovar:<rule_id>` / `recusar:<rule_id>`.
- Prompt do extrator: instrui Claude a propor regras **acionáveis e específicas** (ex: "trocar CTA imperativo por convite calmo"), marcar `scope`, e **não** inventar regra factual/CFM sem evidência nas notas.

### 6.6 Aprovação Telegram (workflow novo "Blog · Aprovar Regra")

- Trigger: Telegram Trigger em `callback_query`.
- Parse `callback_data` → `acao` + `rule_id` → UPDATE `blog_style_rules SET status=(active|rejected), decided_at=NOW(), decided_via='telegram'` → `answerCallbackQuery` + edita a mensagem ("✅ Aprovada" / "❌ Recusada").
- "Editar" fora do MVP (= Recusar + reescrever manualmente depois).

## 7. Fluxo de dados (ciclo completo)

1. Editor rejeita/regenera post → Regenerar loga nota+snapshot em `blog_review_log` (antes de zerar).
2. Semanalmente, Extrator lê o log, destila regras `proposed`, manda no Telegram.
3. Humano toca [✅ Aprovar] → regra vira `active`.
4. Próxima execução do Gerador injeta regras `active` no `system` + 3 exemplos aprovados no `user`.
5. Post novo nasce mais perto do gosto da clínica. Loop fecha.

## 8. Não-objetivos (v1)

- Peça C (extrator de diff antes×depois) — só coleta dado (snapshot), não processa ainda.
- Frontend novo / mudança no editor TipTap.
- Botão "Editar regra" no Telegram.
- Condensação/resumo dos exemplos few-shot.
- Portar pro `okazaki-saas` (futuro).

## 9. Riscos e mitigação

| Risco | Mitigação |
|-------|-----------|
| Pool de exemplos pequeno no início | Fallback "completa com qualquer pilar"; 0 exemplos = comportamento atual |
| Tokens few-shot encarecem geração | 3 exemplos fixos; condensação fica como otimização futura |
| Regra ruim/contraditória no prompt | Gate humano via Telegram antes de virar `active` |
| Regra factual/CFM errada | Extrator instruído a não inventar fato; gate humano; `scope='factual'` sinaliza atenção |
| Migration quebra schema live | Tabelas **novas** apenas, zero ALTER em `blog_drafts`; testar em branch Supabase antes |
| Patch quebra Gerador live | Nós novos são aditivos (SELECT antes do prompt); validar workflow antes de ativar |

## 10. Critério de "pronto"

- [ ] Migration aplicada; 2 tabelas existem no Supabase live.
- [ ] Regenerar loga nota+snapshot em `blog_review_log` (testado com 1 regen real).
- [ ] Gerador injeta 3 exemplos no `user` e regras `active` no `system` (validado em execução de teste).
- [ ] Extrator gera regras `proposed` e manda no Telegram com botões (testado).
- [ ] Botão Telegram aprova/recusa e atualiza `blog_style_rules` (testado clicando).
- [ ] 1 ciclo ponta-a-ponta provado: correção → log → regra proposta → aprovada → aparece no próximo prompt.
