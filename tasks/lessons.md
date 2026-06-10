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

## 2026-06-10 · Repetição de temas no gerador

**Erro:** Hepatologia gerava só esteatose; gastro só "quando procurar". Dedup era por slug exato (variantes do mesmo tema passavam) + sorteio sempre no top-3 do ranking SEO (temas vizinhos saíam em sequência).
**Fix:** tema-chave = 2 primeiros tokens do slug; tema só repete quando pool do pilar esgota; sorteio uniforme nos candidatos sobreviventes; janela recent_topics 30→100.
**Regra:** dedup de conteúdo gerado deve ser por TEMA (chave semântica), não por string exata. Ranking fixo + janela curta = clusters de repetição.
