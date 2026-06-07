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
