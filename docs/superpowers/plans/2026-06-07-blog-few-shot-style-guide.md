# Blog Few-shot + Style Guide — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> **n8n work:** invoke `n8n-mcp-skills:n8n-node-configuration` + `n8n-mcp-skills:n8n-validation-expert` before authoring/validating any node.

**Goal:** Fazer o Gerador de blog aprender o estilo da clínica realimentando o prompt com posts aprovados (few-shot) + regras destiladas das correções (style guide), aprovadas por humano via Telegram.

**Architecture:** Aditivo, zero ALTER em `blog_drafts`. 2 tabelas novas no Supabase. Patch no Regenerar captura nota+snapshot antes de zerar. Patch no Gerador injeta 3 exemplos do mesmo pilar (msg `user`) + regras ativas (msg `system`, cacheada). 2 workflows novos: extrator de regras + aprovação Telegram.

**Tech Stack:** Supabase Postgres (projeto `jvrjzasvnfykftddqpqn`), n8n (`https://automacoes-n8n.adhgqk.easypanel.host`, API key no Keychain `n8n_api_token`), Anthropic `claude-sonnet-4-5`, Telegram bot (cred `pxD4NXXhJpW9E7Jn`, chat `-5152728039`).

**Workflows alvo:** Gerador `41A8liy2qNm9zqpR`, Regenerar `7UwTdI8qLmb5F4JL`. Credencial Postgres dos nós: `OrMhexleB5Cyk2m2` ("Supabase Blog Postgres").

---

## Realidade confirmada (não assumir o contrário)

- Gerador live: `POSTS_PER_RUN=6`, `max_tokens:16000`, `system` com `cache_control:{type:"ephemeral"}`, prefill `{`. **Os docs `blog-n8n-workflows.md` estão desatualizados** (dizem "2 pilares/8000/sem cache") — corrigir no fim.
- Gerador node Code `Escolher 6 Pilares + Prompt` retorna 6 itens `{json:{pillar, subtopic, system, user}}`. `system` = const `SYSTEM`. `user` = `userPrompt(pillar, subtopic)`.
- Regenerar: `Webhook Regenerar → SELECT draft atual → Montar Prompt Regenerar → Anthropic → Parse + Validar → UPDATE blog_drafts → Resposta`. `SELECT draft atual` retorna `id, slug, title, pillar, content_json, meta_description`. Nota da revisora vem em `$('Webhook Regenerar').item.json.body.reviewer_notes`. `UPDATE` zera `reviewer_notes=NULL`.
- n8n Postgres nodes: `typeVersion 2.6`, cred `OrMhexleB5Cyk2m2`.

## Mecânica de deploy n8n (usada em todas as tasks de workflow)

n8n public API. Token: `T=$(security find-generic-password -a "$USER" -s "n8n_api_token" -w)`. Base: `$N8N_API_URL`.

- **GET:** `curl -s -H "X-N8N-API-KEY: $T" "$N8N_API_URL/api/v1/workflows/<id>" -o wf.json`
- **PUT (replace):** body deve conter SOMENTE `{name, nodes, connections, settings}` (a API rejeita props read-only). Helper Python abaixo monta o body:

```python
# put_workflow.py — uso: python3 put_workflow.py <wf.json modificado> <id>
import json, sys, os, urllib.request
src=json.load(open(sys.argv[1])); wid=sys.argv[2]
body={k:src[k] for k in ('name','nodes','connections','settings') if k in src}
req=urllib.request.Request(f"{os.environ['N8N_API_URL']}/api/v1/workflows/{wid}",
    data=json.dumps(body).encode(), method='PUT',
    headers={'X-N8N-API-KEY':os.environ['T'],'Content-Type':'application/json'})
print(urllib.request.urlopen(req).status)
```
(Exporte `T` antes: `export T=$(security find-generic-password -a "$USER" -s "n8n_api_token" -w)`.)

- **Verificar ativo:** GET e checar `.active`. Regenerar deve ficar `active:true` (webhook). Gerador fica `active:true` mas gated por `generator_paused`.
- n8n NÃO permite editar nó por API parcial — sempre GET→modifica JSON inteiro→PUT.

---

## Task 0: Safety — pausar gerador + backup dos workflows

**Files:**
- Create: `clinica-okazaki/n8n-workflows/_backup/2026-06-07-gerador-41A8liy2qNm9zqpR.json`
- Create: `clinica-okazaki/n8n-workflows/_backup/2026-06-07-regenerar-7UwTdI8qLmb5F4JL.json`

- [ ] **Step 1: Exportar backups dos 2 workflows**

```bash
cd "/Users/ossamuokazaki/SITE CLINICA OKAZAKI/clinica-okazaki"
export T=$(security find-generic-password -a "$USER" -s "n8n_api_token" -w)
mkdir -p n8n-workflows/_backup
curl -s -H "X-N8N-API-KEY: $T" "$N8N_API_URL/api/v1/workflows/41A8liy2qNm9zqpR" -o n8n-workflows/_backup/2026-06-07-gerador-41A8liy2qNm9zqpR.json
curl -s -H "X-N8N-API-KEY: $T" "$N8N_API_URL/api/v1/workflows/7UwTdI8qLmb5F4JL" -o n8n-workflows/_backup/2026-06-07-regenerar-7UwTdI8qLmb5F4JL.json
wc -c n8n-workflows/_backup/*.json
```
Expected: dois arquivos > 15000 bytes cada.

- [ ] **Step 2: Pausar o gerador (evita geração com workflow meio-editado)**

Via Supabase MCP `execute_sql` no projeto `jvrjzasvnfykftddqpqn`:
```sql
UPDATE blog_settings SET value='true'::jsonb, updated_at=NOW() WHERE key='generator_paused';
SELECT key, value FROM blog_settings WHERE key='generator_paused';
```
Expected: `generator_paused = true`.

- [ ] **Step 3: Commit backups**

```bash
git add n8n-workflows/_backup/
git commit -m "chore: backup gerador+regenerar antes do patch de aprendizado"
```

---

## Task 1: Migration — tabelas blog_review_log + blog_style_rules

**Files:**
- Create: `clinica-okazaki/supabase/migrations/20260607_blog_learning.sql`

- [ ] **Step 1: Escrever o arquivo de migration**

```sql
-- Aprendizado do blog: trava-perda de notas + regras de estilo.
-- Aditivo. Projeto jvrjzasvnfykftddqpqn. Aplicado via Supabase MCP apply_migration.

CREATE TABLE IF NOT EXISTS blog_review_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID REFERENCES blog_drafts(id) ON DELETE SET NULL,
  pillar TEXT,
  note_text TEXT,
  rejection_reason TEXT,
  original_content_json JSONB,
  captured_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_review_log_unprocessed
  ON blog_review_log(captured_at) WHERE processed_at IS NULL;

CREATE TABLE IF NOT EXISTS blog_style_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_text TEXT NOT NULL,
  scope TEXT NOT NULL DEFAULT 'outro'
    CHECK (scope IN ('tom','estrutura','seo','factual','outro')),
  status TEXT NOT NULL DEFAULT 'proposed'
    CHECK (status IN ('proposed','active','rejected','retired')),
  source_log_ids UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  decided_at TIMESTAMPTZ,
  decided_via TEXT
);
CREATE INDEX IF NOT EXISTS idx_style_rules_active
  ON blog_style_rules(status) WHERE status='active';
```

- [ ] **Step 2: Aplicar via Supabase MCP**

`apply_migration(project_id="jvrjzasvnfykftddqpqn", name="blog_learning", query=<conteúdo do arquivo>)`.

- [ ] **Step 3: Verificar schema aplicado**

Via `execute_sql`:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_name IN ('blog_review_log','blog_style_rules');
```
Expected: 2 linhas.

- [ ] **Step 4: Smoke test insert/select/delete**

```sql
INSERT INTO blog_style_rules (rule_text, scope, status)
VALUES ('REGRA TESTE — apagar', 'tom', 'proposed') RETURNING id;
DELETE FROM blog_style_rules WHERE rule_text='REGRA TESTE — apagar';
```
Expected: 1 row inserida, depois deletada.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20260607_blog_learning.sql
git commit -m "feat(db): tabelas blog_review_log + blog_style_rules"
```

---

## Task 2: Trava-perda — nó LOG review no Regenerar

**Files:**
- Modify (via API): workflow `7UwTdI8qLmb5F4JL`
- Create: `clinica-okazaki/n8n-workflows/blog-regenerar.json` (snapshot pós-patch p/ VC)

Insere nó Postgres `LOG review` entre `SELECT draft atual` e `Montar Prompt Regenerar`. Captura `note_text` (body do webhook) + `original_content_json` (content_json atual) ANTES do UPDATE zerar.

- [ ] **Step 1: GET workflow + script de patch**

```bash
cd "/Users/ossamuokazaki/SITE CLINICA OKAZAKI/clinica-okazaki"
export T=$(security find-generic-password -a "$USER" -s "n8n_api_token" -w)
curl -s -H "X-N8N-API-KEY: $T" "$N8N_API_URL/api/v1/workflows/7UwTdI8qLmb5F4JL" -o /tmp/regen.json
```

- [ ] **Step 2: Adicionar nó + reconectar (script Python)**

O nó usa query parametrizada (`$1..$4`) — mesma mecânica do `SELECT draft atual`. Parâmetros via `options.queryReplacement` (n8n Postgres 2.6).

```python
import json
d=json.load(open('/tmp/regen.json'))
log_node={
  "parameters":{
    "operation":"executeQuery",
    "query":"INSERT INTO blog_review_log (draft_id, pillar, note_text, original_content_json) VALUES ($1, $2, $3, $4::jsonb);",
    "options":{"queryReplacement":"={{ $('SELECT draft atual').item.json.id }},={{ $('SELECT draft atual').item.json.pillar }},={{ $('Webhook Regenerar').item.json.body.reviewer_notes || '' }},={{ JSON.stringify($('SELECT draft atual').item.json.content_json) }}"}
  },
  "type":"n8n-nodes-base.postgres","typeVersion":2.6,
  "position":[ -100, 500 ],  # ajustar se sobrepor; irrelevante p/ execução
  "id":"logreview-0001-0001-0001-000000000001",
  "name":"LOG review",
  "credentials":{"postgres":{"id":"OrMhexleB5Cyk2m2","name":"Supabase Blog Postgres"}}
}
d['nodes'].append(log_node)
# reconecta: SELECT draft atual -> LOG review -> Montar Prompt Regenerar
d['connections']['SELECT draft atual']['main']=[[{"node":"LOG review","type":"main","index":0}]]
d['connections']['LOG review']={"main":[[{"node":"Montar Prompt Regenerar","type":"main","index":0}]]}
json.dump(d, open('/tmp/regen.json','w'))
print("patched: nodes=",len(d['nodes']))
```
Expected: `nodes=8`.

> **Antes de PUT:** invoque `n8n-mcp-skills:n8n-node-configuration` p/ confirmar o formato exato de `queryReplacement` na versão 2.6 (string CSV de expressões vs array). Ajuste se a skill indicar formato diferente.

- [ ] **Step 3: Deploy (PUT) + manter ativo**

```bash
python3 /tmp/put_workflow.py /tmp/regen.json 7UwTdI8qLmb5F4JL
curl -s -H "X-N8N-API-KEY: $T" "$N8N_API_URL/api/v1/workflows/7UwTdI8qLmb5F4JL" | python3 -c "import json,sys;d=json.load(sys.stdin);print('active:',d['active'],'nodes:',len(d['nodes']))"
```
Expected: `active: True nodes: 8`. Se `active: False`, reativar: `curl -s -X POST -H "X-N8N-API-KEY: $T" "$N8N_API_URL/api/v1/workflows/7UwTdI8qLmb5F4JL/activate"`.

- [ ] **Step 4: Teste real — regenerar um draft de teste**

Cria draft descartável, dispara regen, confirma log com snapshot.
```sql
-- cria draft teste
INSERT INTO blog_drafts (pillar,title,slug,meta_description,content_json,status)
VALUES ('gastroenterologia','TESTE LOG','teste-log-xyz','meta teste',
  '{"sections":[{"id":"s","h2":"H","blocks":[{"type":"p","text":"original IA"}]}]}'::jsonb,
  'pending_review') RETURNING id;
```
Pega o `id`, dispara o webhook (precisa do header x-api-key do webhook — usar o mesmo que o editor usa; obter de `DraftEditor.tsx` env ou n8n):
```bash
curl -s -X POST "$N8N_API_URL/webhook/blog-regenerar" \
  -H "Content-Type: application/json" -H "x-api-key: <CHAVE_DO_WEBHOOK>" \
  -d '{"draft_id":"<ID>","reviewer_notes":"NOTA TESTE: tom mais calmo, sem agende ja"}'
```
Depois:
```sql
SELECT draft_id, note_text, (original_content_json->'sections'->0->'blocks'->0->>'text') AS snap
FROM blog_review_log WHERE pillar='gastroenterologia' ORDER BY captured_at DESC LIMIT 1;
```
Expected: `note_text='NOTA TESTE...'`, `snap='original IA'`.

- [ ] **Step 5: Limpar draft de teste + snapshot p/ VC + commit**

```sql
DELETE FROM blog_review_log WHERE note_text LIKE 'NOTA TESTE%';
DELETE FROM blog_drafts WHERE slug='teste-log-xyz';
```
```bash
curl -s -H "X-N8N-API-KEY: $T" "$N8N_API_URL/api/v1/workflows/7UwTdI8qLmb5F4JL" -o n8n-workflows/blog-regenerar.json
git add n8n-workflows/blog-regenerar.json
git commit -m "feat(n8n): Regenerar loga nota+snapshot em blog_review_log antes de zerar"
```

---

## Task 3: Lógica de seleção few-shot (função pura, TDD)

A escolha "mesmo pilar + completa até 3" e a montagem do bloco de exemplos são a parte mais arriscada. Testar isolado como JS puro antes de colar no Code node.

**Files:**
- Create: `clinica-okazaki/n8n-workflows/lib/fewshot.js`
- Test: `clinica-okazaki/n8n-workflows/lib/fewshot.test.js`

- [ ] **Step 1: Escrever teste que falha**

`fewshot.test.js` (roda com `node --test`):
```javascript
const { test } = require('node:test');
const assert = require('node:assert');
const { selectExamples, buildExamplesBlock } = require('./fewshot');

const rows = [
  { pillar:'colonoscopia', title:'C1', content_json:{a:1} },
  { pillar:'colonoscopia', title:'C2', content_json:{a:2} },
  { pillar:'colonoscopia', title:'C3', content_json:{a:3} },
  { pillar:'colonoscopia', title:'C4', content_json:{a:4} },
  { pillar:'hepatologia',  title:'H1', content_json:{a:5} },
  { pillar:'geriatria',    title:'G1', content_json:{a:6} },
];

test('prioriza mesmo pilar, no maximo 3', () => {
  const r = selectExamples(rows, 'colonoscopia', 3);
  assert.equal(r.length, 3);
  assert.deepEqual(r.map(x=>x.title), ['C1','C2','C3']);
});

test('completa com outros pilares quando faltam do mesmo', () => {
  const r = selectExamples(rows, 'hepatologia', 3);
  assert.equal(r.length, 3);
  assert.equal(r[0].title, 'H1'); // mesmo pilar primeiro
  assert.equal(r.filter(x=>x.pillar!=='hepatologia').length, 2); // completou
});

test('pool menor que 3 retorna o que tiver', () => {
  const r = selectExamples([rows[4]], 'colonoscopia', 3);
  assert.equal(r.length, 1);
});

test('pool vazio retorna []', () => {
  assert.deepEqual(selectExamples([], 'colonoscopia', 3), []);
});

test('buildExamplesBlock vazio = string vazia', () => {
  assert.equal(buildExamplesBlock([]), '');
});

test('buildExamplesBlock inclui titulo e json', () => {
  const b = buildExamplesBlock([{title:'C1',content_json:{a:1}}]);
  assert.match(b, /EXEMPLOS DE POSTS APROVADOS/);
  assert.match(b, /C1/);
  assert.match(b, /"a":1/);
});
```

- [ ] **Step 2: Rodar — deve falhar**

Run: `cd clinica-okazaki/n8n-workflows/lib && node --test`
Expected: FAIL "Cannot find module './fewshot'".

- [ ] **Step 3: Implementar mínimo**

`fewshot.js`:
```javascript
// Seleção few-shot: mesmo pilar primeiro, completa com recentes de outros pilares.
function selectExamples(rows, pillar, n) {
  const same = rows.filter(r => r.pillar === pillar);
  const other = rows.filter(r => r.pillar !== pillar);
  return same.concat(other).slice(0, n);
}

function buildExamplesBlock(examples) {
  if (!examples || examples.length === 0) return '';
  const blocks = examples.map((e, i) =>
    `### Exemplo ${i + 1}: ${e.title}\n` +
    JSON.stringify(e.content_json)
  ).join('\n\n');
  return '\n\nEXEMPLOS DE POSTS APROVADOS — escreva no MESMO estilo, tom e estrutura destes (NAO copie o tema, copie o jeito de escrever):\n\n' +
    blocks + '\n\n';
}

module.exports = { selectExamples, buildExamplesBlock };
```

- [ ] **Step 4: Rodar — deve passar**

Run: `cd clinica-okazaki/n8n-workflows/lib && node --test`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add n8n-workflows/lib/fewshot.js n8n-workflows/lib/fewshot.test.js
git commit -m "feat(n8n): logica TDD de selecao few-shot (selectExamples + buildExamplesBlock)"
```

---

## Task 4: Gerador — nós SELECT Exemplos + SELECT Regras Ativas

**Files:**
- Modify (via API): workflow `41A8liy2qNm9zqpR`

Adiciona 2 nós Postgres entre `Pode Gerar?` (saída true) e `Escolher 6 Pilares + Prompt`, em cadeia: `Pode Gerar? → SELECT Exemplos → SELECT Regras Ativas → Escolher 6 Pilares + Prompt`. O Code node lê os dois via `$('...').all()`.

- [ ] **Step 1: GET + inspecionar conexão atual de "Pode Gerar?"**

```bash
export T=$(security find-generic-password -a "$USER" -s "n8n_api_token" -w)
curl -s -H "X-N8N-API-KEY: $T" "$N8N_API_URL/api/v1/workflows/41A8liy2qNm9zqpR" -o /tmp/ger.json
python3 -c "import json;d=json.load(open('/tmp/ger.json'));print(json.dumps(d['connections'].get('Pode Gerar?'),indent=1))"
```
Expected: mostra `main[0]` (true) → `Escolher 6 Pilares + Prompt`, `main[1]` (false) → algo/nada. **Anotar o índice true.**

- [ ] **Step 2: Inserir os 2 nós + religar (script Python)**

```python
import json
d=json.load(open('/tmp/ger.json'))
ex={
 "parameters":{"operation":"executeQuery","query":
  "SELECT pillar, title, content_json FROM (SELECT pillar, title, content_json, ROW_NUMBER() OVER (PARTITION BY pillar ORDER BY reviewed_at DESC NULLS LAST) rn FROM blog_drafts WHERE status IN ('approved','published')) t WHERE rn <= 3;",
  "options":{}},
 "type":"n8n-nodes-base.postgres","typeVersion":2.6,"position":[300,80],
 "id":"selexemplos-0001-0001-000000000001","name":"SELECT Exemplos",
 "credentials":{"postgres":{"id":"OrMhexleB5Cyk2m2","name":"Supabase Blog Postgres"}}}
ru={
 "parameters":{"operation":"executeQuery","query":
  "SELECT rule_text, scope FROM blog_style_rules WHERE status='active' ORDER BY decided_at NULLS LAST;",
  "options":{}},
 "type":"n8n-nodes-base.postgres","typeVersion":2.6,"position":[520,80],
 "id":"selregras-0001-0001-000000000001","name":"SELECT Regras Ativas",
 "credentials":{"postgres":{"id":"OrMhexleB5Cyk2m2","name":"Supabase Blog Postgres"}}}
d['nodes'] += [ex,ru]
# religa cadeia true. (substitui o alvo true de 'Pode Gerar?' por SELECT Exemplos)
pg=d['connections']['Pode Gerar?']['main']
pg[0]=[{"node":"SELECT Exemplos","type":"main","index":0}]   # main[0]=true
d['connections']['SELECT Exemplos']={"main":[[{"node":"SELECT Regras Ativas","type":"main","index":0}]]}
d['connections']['SELECT Regras Ativas']={"main":[[{"node":"Escolher 6 Pilares + Prompt","type":"main","index":0}]]}
json.dump(d,open('/tmp/ger.json','w'))
print("nodes:",len(d['nodes']))
```
> Se no Step 1 o índice true não for `main[0]`, ajustar `pg[0]` → `pg[<idx>]`.

- [ ] **Step 3: Validar workflow antes do PUT**

Invoque `n8n-mcp-skills:n8n-validation-expert` sobre `/tmp/ger.json` (estrutura de nós/conexões). Corrija o que apontar. NÃO faça PUT ainda — o Code node (Task 5) ainda referencia os novos nós; PUT só após Task 5 pra não deixar o workflow num estado intermediário rodando. **Mantenha `/tmp/ger.json` para a Task 5.**

(Sem commit aqui — deploy acontece no fim da Task 5.)

---

## Task 5: Gerador — Code node injeta regras (system) + exemplos (user)

**Files:**
- Modify (via API): workflow `41A8liy2qNm9zqpR` (Code node `Escolher 6 Pilares + Prompt`)
- Create: `clinica-okazaki/n8n-workflows/blog-gerador-semanal.json` (snapshot pós-patch)

Substitui a região do `jsCode` que vai de `const inp = $input.first().json;` até o final (`return picks.map(...)`). As partes acima (`PILLARS`, `SUBTOPICS`, `POSTS_PER_RUN`) ficam intactas. A nova região reusa a lógica TDD da Task 3 (inline, pois Code node não importa módulos).

- [ ] **Step 1: Aplicar a substituição no jsCode (script Python)**

```python
import json
d=json.load(open('/tmp/ger.json'))
node=next(n for n in d['nodes'] if n['name']=='Escolher 6 Pilares + Prompt')
code=node['parameters']['jsCode']
anchor="const inp = $input.first().json;"
head=code[:code.index(anchor)]   # mantem PILLARS/SUBTOPICS/POSTS_PER_RUN
new_tail = r'''const inp = $('Ler Settings + Buffer').first().json;
const last = inp.last_pillar || 'none';
const recent = Array.isArray(inp.recent_topics) ? inp.recent_topics : [];
const startIdx = (PILLARS.indexOf(last) + 1) % PILLARS.length;
const picks = Array.from({length: POSTS_PER_RUN}, (_, i) => PILLARS[(startIdx + i) % PILLARS.length]);

const recentByPillar = {};
recent.forEach(r => {
  if (!r || !r.pillar) return;
  if (!recentByPillar[r.pillar]) recentByPillar[r.pillar] = '';
  recentByPillar[r.pillar] += ' ' + ((r.slug || '') + ' ' + (r.title || '')).toLowerCase();
});
const usedInBatch = new Set();
function pickSubtopic(pillar) {
  const pool = SUBTOPICS[pillar] || [];
  const recentBlob = recentByPillar[pillar] || '';
  const candidates = pool.filter(st => !usedInBatch.has(st) && !recentBlob.includes(st.toLowerCase()));
  let chosen;
  if (candidates.length > 0) {
    const topN = candidates.slice(0, Math.min(3, candidates.length));
    chosen = topN[Math.floor(Math.random() * topN.length)];
  } else {
    const fallback = pool.filter(st => !usedInBatch.has(st));
    chosen = fallback.length > 0 ? fallback[Math.floor(Math.random() * fallback.length)] : pool[Math.floor(Math.random() * pool.length)];
  }
  usedInBatch.add(chosen);
  return chosen;
}

// === APRENDIZADO: regras (system) + exemplos (user) ===
const ruleRows = $('SELECT Regras Ativas').all().map(i => i.json).filter(r => r && r.rule_text);
const exampleRows = $('SELECT Exemplos').all().map(i => i.json).filter(r => r && r.content_json);

function selectExamples(rows, pillar, n) {
  const same = rows.filter(r => r.pillar === pillar);
  const other = rows.filter(r => r.pillar !== pillar);
  return same.concat(other).slice(0, n);
}
function buildExamplesBlock(examples) {
  if (!examples || examples.length === 0) return '';
  const blocks = examples.map((e, i) => '### Exemplo ' + (i+1) + ': ' + e.title + '\n' + JSON.stringify(e.content_json)).join('\n\n');
  return '\n\nEXEMPLOS DE POSTS APROVADOS — escreva no MESMO estilo, tom e estrutura destes (NAO copie o tema, copie o jeito de escrever):\n\n' + blocks + '\n\n';
}
function buildRulesBlock(rules) {
  if (!rules || rules.length === 0) return '';
  const lines = rules.map(r => '- [' + (r.scope || 'outro') + '] ' + r.rule_text).join('\n');
  return '\n\nREGRAS APRENDIDAS COM O EDITOR (seguir A RISCA, prevalecem sobre o estilo padrao):\n' + lines;
}

const SYSTEM = 'Voce e um redator medico brasileiro especializado em gastroenterologia, endoscopia digestiva, colonoscopia, hepatologia e geriatria. Escreve para pacientes leigos em PT-BR claro, com revisao CFM. SEMPRE retorna APENAS JSON valido (sem texto fora do JSON, sem markdown, sem triplebackticks), conforme o schema BlogPost solicitado. Inclui ao menos 3 H2, ao menos 1500 palavras, FAQ com 4-6 perguntas, autoria Dra. Jane Erika Frazao Okazaki (CRM-PE 19872, RQE 17633). Sem promessas de cura, sem before-after, sem testimonials.';
const SYSTEM_FINAL = SYSTEM + buildRulesBlock(ruleRows);

function userPrompt(pillar, subtopic) {
  return 'Gere um rascunho de post de blog medico para a Clinica Okazaki sobre o pilar ' + pillar + '.\n\n' +
    'FOCO OBRIGATORIO E EXCLUSIVO: sub-tema "' + subtopic + '". ' +
    'O slug DEVE comecar com "' + subtopic + '" (pode adicionar palavras adicionais depois com hifen, ou usar o slug exato). ' +
    'O titulo, lead, sections, faqs e todo o conteudo devem girar exclusivamente em torno deste sub-tema. NAO escreva post generico sobre ' + pillar + ' inteiro. ' +
    'NAO repita angulos batidos: aborde com profundidade clinica especifica (sintomas, diagnostico, exames, conduta, criterios, evidencias) e quando aplicavel inclua geo-modifier "Recife" no description e/ou title.\n\n' +
    'Retorne EXCLUSIVAMENTE JSON valido com este shape: { slug, pillar, title, description (140-160 chars com geo-modifier em Recife quando faz sentido), keywords, h1, lead, eyebrow (BLOG dot ' + pillar.toUpperCase() + '), breadcrumbLabel, about, excerpt (80-200 chars), sections (array com id slug-style, h2, blocks), faqs (array {q,a}), author (Dra. Jane Erika Frazao Okazaki, CRM-PE 19872, RQE 17633, photo /assets/team/jane.webp, bio), publishedAt ISO, updatedAt ISO }. Block types: p, h3, ul (items array), callout, warning, inline-cta, link. Total 1500-2000 palavras em 4-6 sections. Inclua ao menos 1 link interno para /' + pillar + '. INICIE A RESPOSTA DIRETAMENTE COM { e nao use markdown.';
}

return picks.map(pillar => {
  const subtopic = pickSubtopic(pillar);
  const examples = selectExamples(exampleRows, pillar, 3);
  return {
    json: {
      pillar,
      subtopic,
      system: SYSTEM_FINAL,
      user: userPrompt(pillar, subtopic) + buildExamplesBlock(examples)
    }
  };
});
'''
node['parameters']['jsCode']=head+new_tail
json.dump(d,open('/tmp/ger.json','w'))
print("jsCode len:",len(node['parameters']['jsCode']))
```
Expected: jsCode len > 8000 (cresceu vs 7662 original).

- [ ] **Step 2: Validar Code node**

Invoque `n8n-mcp-skills:n8n-code-javascript` p/ revisar o novo `jsCode` (refs `$('SELECT ...').all()`, retorno de itens). Corrija se apontar erro de API n8n.

- [ ] **Step 3: Deploy (PUT)**

```bash
python3 /tmp/put_workflow.py /tmp/ger.json 41A8liy2qNm9zqpR
curl -s -H "X-N8N-API-KEY: $T" "$N8N_API_URL/api/v1/workflows/41A8liy2qNm9zqpR" | python3 -c "import json,sys;d=json.load(sys.stdin);print('active:',d['active'],'nodes:',len(d['nodes']))"
```
Expected: `active: True nodes: 16` (14 + 2 novos).

- [ ] **Step 4: Teste de fumaça — execução manual com gerador ainda pausado**

Seed: 1 regra ativa + 1 exemplo aprovado, pra provar injeção.
```sql
INSERT INTO blog_style_rules (rule_text, scope, status, decided_at, decided_via)
VALUES ('Nunca usar CTA imperativo tipo "agende ja"; use convite calmo.', 'tom', 'active', NOW(), 'seed-teste');
-- garante ao menos 1 aprovado de colonoscopia (se nao houver, marca um draft existente como approved temporariamente OU insere fixture)
```
Executar o workflow manualmente via API (ignora o gate de schedule):
```bash
curl -s -X POST -H "X-N8N-API-KEY: $T" "$N8N_API_URL/api/v1/workflows/41A8liy2qNm9zqpR/run" -o /tmp/run.json 2>/dev/null || echo "se /run nao existir na sua versao, usar a UI: Executar workflow"
```
Verificar o output do Code node `Escolher 6 Pilares + Prompt` na execução (via UI ou `GET /executions/:id`): o campo `system` de cada item deve conter "REGRAS APRENDIDAS COM O EDITOR" e o `user` deve conter "EXEMPLOS DE POSTS APROVADOS".
Expected: ambos os blocos presentes. Se não houver aprovados, bloco de exemplos vazio (sem erro) — aceitável.

- [ ] **Step 5: Limpar seed de teste**

```sql
DELETE FROM blog_style_rules WHERE decided_via='seed-teste';
-- reverter qualquer draft marcado approved só p/ teste, se aplicável
```

- [ ] **Step 6: Snapshot p/ VC + commit**

```bash
curl -s -H "X-N8N-API-KEY: $T" "$N8N_API_URL/api/v1/workflows/41A8liy2qNm9zqpR" -o n8n-workflows/blog-gerador-semanal.json
git add n8n-workflows/blog-gerador-semanal.json
git commit -m "feat(n8n): Gerador injeta regras ativas (system) + 3 exemplos do pilar (user)"
```

---

## Task 6: Reativar o gerador

- [ ] **Step 1: Despausar**

```sql
UPDATE blog_settings SET value='false'::jsonb, updated_at=NOW() WHERE key='generator_paused';
SELECT key, value FROM blog_settings WHERE key='generator_paused';
```
Expected: `generator_paused = false`.

- [ ] **Step 2: Confirmar gate normal**

Verificar que `Pode Gerar?` volta a depender só de `paused=false AND buffer<threshold`. Sem commit (estado de runtime).

---

## Task 7: Workflow novo — "Blog · Extrair Regras"

**Files:**
- Create (via API POST): novo workflow
- Create: `clinica-okazaki/n8n-workflows/blog-extrair-regras.json`

Pipeline: Schedule (semanal) + Webhook manual → `SELECT logs` (não processados) → `Montar Prompt` (Code) → `Anthropic` (HTTP) → `Parse Regras` (Code) → `INSERT regras` (Postgres, status=proposed) → `Marcar processado` (Postgres UPDATE) → `Telegram` (1 msg por regra com botões).

- [ ] **Step 1: Montar o JSON do workflow**

Nós-chave (autoria via `n8n-mcp-skills:n8n-node-configuration`):
- **Schedule Trigger** cron `0 0 12 * * 1` (seg 12h UTC) + **Webhook** `POST /webhook/blog-extrair-regras` (disparo manual), ambos → SELECT logs.
- **SELECT logs** (Postgres, cred `OrMhexleB5Cyk2m2`):
  ```sql
  SELECT id, pillar, note_text, original_content_json
  FROM blog_review_log WHERE processed_at IS NULL AND note_text IS NOT NULL AND note_text <> ''
  ORDER BY captured_at LIMIT 50;
  ```
- **Montar Prompt** (Code): agrega as notas num prompt. System: "Voce destila regras de estilo editorial a partir de correcoes de uma revisora medica. Proponha 1 a 5 regras ACIONAVEIS e ESPECIFICAS. Para cada regra: scope (tom|estrutura|seo|factual|outro) e rule_text curto e imperativo. NAO invente regra factual/CFM sem evidencia clara nas notas. Responda APENAS JSON: {rules:[{scope,rule_text}]}". User: lista das `note_text`. Prefill assistant `{`.
- **Anthropic** (HTTP, mesma config do Gerador): `claude-sonnet-4-5`, system cacheado, prefill `{`. Reusar credencial Anthropic do Gerador.
- **Parse Regras** (Code): `JSON.parse`, valida `rules[]`, retorna 1 item por regra com `scope, rule_text` + `source_log_ids` (todos os ids do SELECT logs).
- **INSERT regras** (Postgres): por item:
  ```sql
  INSERT INTO blog_style_rules (rule_text, scope, status, source_log_ids)
  VALUES ($1, $2, 'proposed', $3::uuid[]) RETURNING id, rule_text, scope;
  ```
- **Marcar processado** (Postgres, executeOnce após inserts):
  ```sql
  UPDATE blog_review_log SET processed_at=NOW() WHERE processed_at IS NULL AND note_text IS NOT NULL;
  ```
- **Telegram** (cred `pxD4NXXhJpW9E7Jn`, chat `-5152728039`): 1 sendMessage por regra inserida, texto = `🆕 Regra proposta [scope]: <rule_text>`, `reply_markup` inline:
  ```json
  {"inline_keyboard":[[{"text":"✅ Aprovar","callback_data":"aprovar:<rule_id>"},{"text":"❌ Recusar","callback_data":"recusar:<rule_id>"}]]}
  ```

- [ ] **Step 2: Deploy via POST**

```bash
python3 -c "import json,os,urllib.request;b=json.load(open('/tmp/extrair.json'));req=urllib.request.Request(os.environ['N8N_API_URL']+'/api/v1/workflows',data=json.dumps({k:b[k] for k in ('name','nodes','connections','settings')}).encode(),method='POST',headers={'X-N8N-API-KEY':os.environ['T'],'Content-Type':'application/json'});print(urllib.request.urlopen(req).read().decode()[:200])"
```
Expected: JSON com `id` do novo workflow. **Anotar o id.** Ativar: `POST /api/v1/workflows/<id>/activate`.

- [ ] **Step 3: Teste — seed 1 log + disparar manual**

```sql
INSERT INTO blog_review_log (pillar, note_text, original_content_json)
VALUES ('colonoscopia','Tom muito agressivo, troquei "agende ja" por convite calmo. Lead estava longo demais.', '{}'::jsonb);
```
```bash
curl -s -X POST "$N8N_API_URL/webhook/blog-extrair-regras" -H "Content-Type: application/json" -d '{}'
```
Verificar:
```sql
SELECT scope, rule_text, status FROM blog_style_rules WHERE status='proposed' ORDER BY created_at DESC LIMIT 5;
SELECT count(*) FROM blog_review_log WHERE processed_at IS NOT NULL;
```
Expected: ≥1 regra `proposed` plausível; log marcado processado. Confirmar que a mensagem com botões chegou no Telegram.

- [ ] **Step 4: Limpar teste + snapshot + commit**

```sql
DELETE FROM blog_style_rules WHERE status='proposed' AND created_at > NOW() - INTERVAL '10 minutes';
DELETE FROM blog_review_log WHERE note_text LIKE 'Tom muito agressivo%';
```
```bash
curl -s -H "X-N8N-API-KEY: $T" "$N8N_API_URL/api/v1/workflows/<id>" -o n8n-workflows/blog-extrair-regras.json
git add n8n-workflows/blog-extrair-regras.json
git commit -m "feat(n8n): workflow Extrair Regras (notas -> regras propostas -> Telegram)"
```

---

## Task 8: Workflow novo — "Blog · Aprovar Regra" (callback Telegram)

**Files:**
- Create (via API POST): novo workflow
- Create: `clinica-okazaki/n8n-workflows/blog-aprovar-regra.json`

Pipeline: **Telegram Trigger** (updates: `callback_query`) → `Parse callback` (Code: split `callback_data` em `acao:rule_id`) → `UPDATE regra` (Postgres) → `Answer + Edit` (Telegram: answerCallbackQuery + editar texto da mensagem).

- [ ] **Step 1: Montar o JSON**

- **Telegram Trigger** (`n8n-nodes-base.telegramTrigger`, cred `pxD4NXXhJpW9E7Jn`), updates = `["callback_query"]`.
- **Parse callback** (Code):
  ```javascript
  const cb = $json.callback_query;
  const [acao, ruleId] = (cb.data || '').split(':');
  const status = acao === 'aprovar' ? 'active' : 'rejected';
  return [{ json: { ruleId, status, acao,
    chatId: cb.message.chat.id, messageId: cb.message.message_id,
    callbackQueryId: cb.id, original: cb.message.text } }];
  ```
- **UPDATE regra** (Postgres, cred `OrMhexleB5Cyk2m2`):
  ```sql
  UPDATE blog_style_rules SET status=$1, decided_at=NOW(), decided_via='telegram'
  WHERE id=$2::uuid RETURNING rule_text;
  ```
  ($1 = status, $2 = ruleId via queryReplacement.)
- **Telegram answerCallbackQuery** (operation answerCallbackQuery, `query_id` = callbackQueryId, text = "Registrado ✅") + **edit message** (editMessageText, chat_id+message_id, text = `{{$json.original}}` + (status==='active' ? "\n\n✅ APROVADA" : "\n\n❌ RECUSADA")).

- [ ] **Step 2: Deploy via POST + ativar**

Igual Task 7 Step 2, arquivo `/tmp/aprovar.json`. Anotar id, `POST .../activate`.

- [ ] **Step 3: Teste real — clicar botão**

Pré: ter 1 regra `proposed` (rodar Task 7 Step 3 seed de novo, ou inserir uma). Acionar o Extrair pra mandar a msg no Telegram, então **clicar [✅ Aprovar]**.
Verificar:
```sql
SELECT status, decided_via, decided_at FROM blog_style_rules WHERE id='<rule_id>';
```
Expected: `status='active'`, `decided_via='telegram'`. A mensagem no Telegram deve mostrar "✅ APROVADA".

- [ ] **Step 4: Limpar + snapshot + commit**

```sql
DELETE FROM blog_style_rules WHERE decided_via='telegram' AND rule_text LIKE '%teste%';
```
```bash
curl -s -H "X-N8N-API-KEY: $T" "$N8N_API_URL/api/v1/workflows/<id>" -o n8n-workflows/blog-aprovar-regra.json
git add n8n-workflows/blog-aprovar-regra.json
git commit -m "feat(n8n): workflow Aprovar Regra via botao Telegram (callback_query)"
```

---

## Task 9: E2E + atualizar docs

- [ ] **Step 1: Ciclo ponta-a-ponta real**

1. No editor, rejeitar um draft real com nota de estilo (ex: "encurtar lead, tom mais calmo") → confirmar row em `blog_review_log` (nota+snapshot).
2. Disparar Extrair Regras (`POST /webhook/blog-extrair-regras`) → regra `proposed` chega no Telegram.
3. Clicar [✅ Aprovar] → regra vira `active`.
4. Executar Gerador manualmente → confirmar no output do Code node que a regra aparece em `system` e exemplos aprovados em `user`.

```sql
-- evidência final
SELECT 'logs' k, count(*) n FROM blog_review_log
UNION ALL SELECT 'regras_active', count(*) FROM blog_style_rules WHERE status='active'
UNION ALL SELECT 'aprovados', count(*) FROM blog_drafts WHERE status IN ('approved','published');
```
Expected: contadores coerentes; ≥1 regra active.

- [ ] **Step 2: Corrigir docs desatualizados**

Atualizar `docs/blog-n8n-workflows.md`: Gerador = **6 pilares**, `max_tokens 16000`, **com cache_control**, e adicionar seção dos 2 workflows novos (Extrair Regras, Aprovar Regra) + as 2 tabelas. Criar `docs/blog-aprendizado.md` resumindo o ciclo de aprendizado pro Ossamu (não-técnico): como aprovar regras no Telegram, o que cada tabela guarda.

- [ ] **Step 3: Commit final**

```bash
git add docs/blog-n8n-workflows.md docs/blog-aprendizado.md
git commit -m "docs: atualiza workflows do blog + guia de aprendizado (few-shot + style guide)"
```

- [ ] **Step 4: Atualizar tasks/lessons + memória**

Registrar em `tasks/lessons.md` lições (ex: docs n8n desatualizados vs live; reviewer_notes era zerado). Salvar memória do projeto se houver fato não-óbvio.

---

## Self-review (cobertura da spec)

| Spec § | Task |
|--------|------|
| 6.1 Migration 2 tabelas | Task 1 |
| 6.2 Few-shot (3, mesmo pilar) | Task 3 (lógica) + Task 4 (SELECT) + Task 5 (injeção) |
| 6.3 Style guide (system) | Task 4 (SELECT) + Task 5 (injeção) |
| 6.4 Trava-perda Regenerar | Task 2 |
| 6.5 Extrator | Task 7 |
| 6.6 Aprovação Telegram | Task 8 |
| 7 Fluxo E2E | Task 9 |
| 9 Riscos (pausar gerador, backup) | Task 0 |
| 10 Critério "pronto" | Task 9 Step 1 |

**Riscos operacionais cobertos:** backup antes (Task 0), gerador pausado durante patch (Task 0/6), testes com fixtures descartáveis e limpeza (Tasks 2/5/7/8), snapshots de workflow versionados no repo.

**Pendência conhecida (resolver na execução, não placeholder):** a CHAVE do webhook `blog-regenerar` (header `x-api-key`) — obter de `packages/editor` (env `VITE_*`) ou da config do nó Webhook no n8n antes da Task 2 Step 4.
