# Lessons — clinica-okazaki

## 2026-06-07 · Implantação few-shot + style guide

**Erro:** Docs `blog-n8n-workflows.md` descreviam o Gerador como "2 pilares / 8000 tokens / sem cache". O live era 6 pilares / 16000 / com cache_control.
**Causa:** Workflow foi editado na UI depois dos docs; `n8n-workflows/*.ts` é só source parcial, não fonte da verdade.
**Regra:** Sempre `GET /api/v1/workflows/<id>` antes de mexer em workflow n8n. Nunca confiar em docs/.ts sem confirmar no live.

**Erro:** `reviewer_notes` eram apagados (`=NULL`) pelo UPDATE final do Regenerar — todo sinal de correção evaporava.
**Causa:** Workflow não tinha etapa de log antes do UPDATE.
**Regra:** Antes de qualquer UPDATE que zera campo com valor de negócio, capturar em tabela de log. Nó de log = `onError: continueRegularOutput` pra não travar o fluxo principal.

**Gotchas n8n public API (anotar pra próxima):**
- PUT/POST workflow: body só `{name,nodes,connections,settings}`; `settings` só `{"executionOrder":"v1"}` (binaryMode/callerPolicy/availableInMCP rejeitados → revertem pro default). Efeito colateral: `availableInMCP` driftou de true→false no Regenerar (impacto nulo, roda por webhook).
- Nós novos precisam `id` uuid4 senão a API os descarta sem erro.
- `onError: "continueRegularOutput"` (não o legado `continueOnFail`).
- Telegram inline keyboard: `inlineKeyboard.rows[].row.buttons[]`, botão com `additionalFields.callback_data`.
- Python urllib falha SSL contra o servidor n8n → usar `curl`.

**Regra de processo:** infra que auto-publica (Gerador → GitHub → Vercel) = pausar via `generator_paused` + backup do workflow ANTES de editar. Validar com mock-harness (simula globals n8n) em vez de disparar run real que gera/publica posts de teste.

## 2026-06-08 · Regressão: inserir nó n8n quebra `$input` do nó seguinte

**Erro:** Inseri o nó `LOG review` (Postgres INSERT) entre `SELECT draft atual` e `Montar Prompt Regenerar`. O `Montar Prompt` lia `const current = $input.first().json` — que passou a ser a saída do INSERT (sem RETURNING = vazio), não o draft → `current.content_json` undefined → `.slice()` quebrou. Regenerar morria antes da IA.
**Causa:** `$input` em n8n = saída do **predecessor imediato**. Inserir um nó no meio da cadeia muda silenciosamente o que `$input` resolve no nó de baixo. Mock-harness + verificação de wiring NÃO pegaram isso (só um run real pega).
**Regra:** Ao inserir nó no meio de cadeia n8n, checar TODO nó downstream que usa `$input` — ou trocar por referência nomeada `$('Nome do Nó')`. Nós de log/side-effect devem ser transparentes OU os consumidores devem ler de nós nomeados, não de `$input`.
**Regra 2:** Verificação que não exercita o caminho real (webhook synchronous) é incompleta. Quando não dá pra disparar (falta segredo), declarar explícito "não verificado em runtime" e pedir teste real — não marcar como provado.

## 2026-06-08 · Reestruturar/Regenerar timeout na IA (180s)

**Erro:** Nó Anthropic abortava com `ECONNABORTED` após exatos 180013ms.
**Causa:** Geração non-streaming de ~8-10k tokens passa de 180s (timeout configurado). `max_tokens 16000` permite saída longa. Gerador (background/schedule) tolera; webhooks síncronos (editor esperando) estouram.
**Fix:** timeout 180s→300s nos nós Anthropic de Regenerar + Reestruturar. NÃO reduzir `max_tokens` (truncaria posts grandes de ~8-10k tokens).
**Fix correto futuro:** tornar regeneração assíncrona (webhook responde na hora, workflow roda em background, editor faz polling) — remove a pressão de timeout síncrono. Exige mudança no editor.

## 2026-06-10 · n8n SELECT com 0 linhas mata a cadeia silenciosamente

**Erro:** SELECT Exemplos/Regras Ativas sem `alwaysOutputData` — se a query retornasse 0 linhas (ex: nenhuma regra ativa), o nó emite 0 items e TODO o downstream não roda. Gerador pararia de gerar sem nenhum erro visível.
**Causa:** Semântica n8n: 0 items de saída = downstream skip. Mock-harness não pega (testa só o jsCode, não a cadeia).
**Regra:** Todo nó Postgres SELECT no MEIO de uma cadeia n8n precisa de `alwaysOutputData: true` + o consumidor filtrar o item vazio (`.filter(r => r && r.campo)`). SELECT que é fim de cadeia ou cujo skip é desejado (ex: SELECT logs do Extrair) não precisa.

## 2026-06-11 · Autoria do post era fixa "Dra. Jane" independentemente de quem aprovava

**Erro:** o autor exibido no post (`post.author`) saía sempre "Dra. Jane" porque o nome é gerado pela IA (hardcoded no prompt do Gerador) e gravado em `content.author`. A aprovação no editor gravava `reviewer_user_id` mas **nunca** sobrescrevia o autor. `reviewer_user_id` era escrito e nunca lido para fim de exibição.
**Causa:** campo de identidade (autor) baked-in na geração, não derivado de quem aprovou. Choke point de publicação (Publicador) só copiava `content.author` pro `.post.ts`.
**Fix:** mapa `blog_reviewers` (chave **email**) + função `SECURITY DEFINER` `reviewer_author_for_user(uuid)` que resolve `reviewer_user_id → email → autor`. Publicador sobrescreve `content.author` no publish; fallback = autor da IA.
**Regras:**
- **Chave por email, não user_id**, quando precisa semear perfil ANTES da conta existir (magic-link `signInWithOtp` auto-cria no 1º login, `shouldCreateUser` default true). Some o ovo-galinha.
- Função que lê schema `auth` a partir do n8n: usar **`SECURITY DEFINER`** — não depende do privilégio do papel da conexão e ignora RLS do owner. `SET search_path` explícito.
- Identidade exibida (autor/aprovador) deve ser **derivada no choke point de saída** (Publicador), não baked-in na geração. Um único ponto de override cobre Gerador + Regenerar + Reestruturar.
- Sem service_role no keychain → **não** raw-insert em `auth.users` (frágil: precisa identities, hash). Usar self-signup magic-link, que é o mesmo fluxo dos usuários existentes.

## 2026-06-10 · Repetição de temas no gerador

**Erro:** Hepatologia gerava só esteatose; gastro só "quando procurar". Dedup era por slug exato (variantes do mesmo tema passavam) + sorteio sempre no top-3 do ranking SEO (temas vizinhos saíam em sequência).
**Fix:** tema-chave = 2 primeiros tokens do slug; tema só repete quando pool do pilar esgota; sorteio uniforme nos candidatos sobreviventes; janela recent_topics 30→100.
**Regra:** dedup de conteúdo gerado deve ser por TEMA (chave semântica), não por string exata. Ranking fixo + janela curta = clusters de repetição.

## 2026-06-11 · "Falha ao reestruturar: Unexpected end of JSON input" ao aprovar

**Sintoma:** Editor não aprovava/agendava post. Erro client: `Failed to execute 'json' on 'Response': Unexpected end of JSON input`. 8/8 execuções recentes do `Blog · Reestruturar Draft` = error.
**Causa raiz (evidência crua da execução):** nó `Parse + Validar` fazia `JSON.parse()` no texto que a IA escreveu à mão. `stop_reason: end_turn` (NÃO truncou) — a IA emitiu aspas não-escapadas dentro de uma string JSON: `"text": "...o intestino deverá estar "limpo", e as evacuações..."`. O `"limpo"` fechava a string cedo → `SyntaxError: Expected ',' or '}' ... position 16015`. Workflow morria antes do nó `Resposta` → client recebia body inválido/vazio.
**Fix (causa raiz, não sintoma):** trocar geração de JSON-como-texto por **Anthropic tool use**. Anthropic node ganhou `tools:[{name:"emit_post", input_schema:{...}}]` + `tool_choice:{type:"tool",name:"emit_post"}`, removido o prefill `assistant:"{"`. `Parse + Validar` agora lê `content.find(c=>c.type==='tool_use').input` (já é objeto) — `JSON.parse` eliminado. API garante JSON válido e escapado.
**Verificado runtime:** draft temp com o trecho `"limpo"` → webhook HTTP 200 `{ok:true,...}`, execução `success`, content_json com sections+faqs. Temp deletado.
**Regra:** NUNCA pedir pra LLM escrever JSON grande como texto e dar `JSON.parse`. Conteúdo rico (aspas, quebras de linha) quebra escape intermitentemente. Usar tool use / structured output — a API serializa o JSON. Vale pra qualquer node IA→JSON.
**Resolvido (mesma classe, mesmo dia):** `blog-regenerar` ("Pedir nova versão", id `7UwTdI8qLmb5F4JL`) e `blog-gerador-semanal` (id `41A8liy2qNm9zqpR`) tinham o MESMO padrão (JSON.parse em texto IA + prefill `{`). Migrados pro mesmo tool use (mantido `cache_control` no system; validações de slug/description/sections preservadas no Parse). Regenerar verificado runtime (webhook HTTP 200, exec success — a IA gerou título com `"Limpo"` e o JSON saiu válido/escapado). Gerador (schedule, sem webhook, dispara Telegram no grupo) verificado via mock-harness do Parse 4/4 + reaproveita o Anthropic body idêntico ao regenerar já testado na API real. Backups em `_backup/*.LIVE-2026-06-11.json`.
**Gotcha n8n PUT:** `settings.binaryMode` é rejeitado pela API (`request/body/settings must NOT have additional properties`). `availableInMCP` e `callerPolicy` passam. Remover `binaryMode` antes do PUT (workflows sem binário → impacto nulo).
**Gotcha Vercel API:** `GET /v9/projects/{id}/env?decrypt=true` (lista) devolve valor ENCRIPTADO (len ~1176). Pra plaintext usar single-env `GET /v9/projects/{id}/env/{envId}` (devolve `value` decriptado).

## 2026-06-16 · Menu mobile invisível — `backdrop-filter` no header (3 tentativas erradas)

**Sintoma:** após adicionar link Blog, menu mobile abria (estado `open` ok, botão X funcionava) mas o painel ficava **invisível** — hero aparecia atrás.
**Tentativas erradas (retrabalho):** mexi em `z-index` 3× (z-40→z-30→z-50) e em `bg`/offset, achando que era empilhamento. Nada mudou — porque o painel tinha **altura ~0** o tempo todo.
**Causa raiz:** o `<header>` tem `backdrop-blur` (`backdrop-filter`). `filter`/`backdrop-filter`/`transform` num elemento o tornam **containing block** dos descendentes `position: fixed`. O overlay do menu era filho do header → `fixed inset-x-0 top-24 bottom-0` passou a ser relativo à caixa do header (~96px), não à viewport → `top:96px` + `bottom:0` dentro de 96px = altura 0 = invisível. (A versão `inset-0 top-20` dava sliver de 16px = "ilegível".)
**Fix:** renderizar o overlay como **irmão** do `<header>` (dentro de fragment), fora de qualquer ancestral com filter/transform. `fixed` volta a ser relativo à viewport. Confirmado no celular.
**Regras:**
- Overlay/drawer/modal `position: fixed` **nunca** deve ficar dentro de um ancestral com `transform`, `filter`, `backdrop-filter`, `perspective` ou `will-change` — esses criam containing block e quebram o `fixed`. Renderizar no topo (portal) ou como irmão fora do ancestral.
- **Debug de "elemento não aparece": cheque a CAIXA COMPUTADA (width/height/top no devtools) ANTES de mexer em z-index.** Altura 0 ≠ problema de empilhamento. Mudei z-index 3× sem inspecionar a caixa — custou 3 deploys. Hipótese → medir → corrigir, não chutar.
