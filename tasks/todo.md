# Todo — Blog Few-shot + Style Guide

Plano completo: `docs/superpowers/plans/2026-06-07-blog-few-shot-style-guide.md`
Spec: `docs/superpowers/specs/2026-06-07-blog-few-shot-style-guide-design.md`
Branch: `feature/blog-few-shot-style-guide`

## Status (2026-06-07)

- [x] Task 0 — backup workflows + pausar gerador
- [x] Task 1 — migration (blog_review_log + blog_style_rules)
- [x] Task 2 — trava-perda: nó LOG review no Regenerar
- [x] Task 3 — lógica few-shot TDD (fewshot.js, 6/6 testes)
- [x] Task 4+5 — Gerador: SELECT Exemplos/Regras + injeção (mock-harness 7/7)
- [x] Task 7 — workflow Extrair Regras (`P5LV0WrD3DSjQUcf`)
- [x] Task 8 — workflow Aprovar Regra Telegram (`3UanDymKb3L8tTAA`)
- [~] Task 9 — docs feitos; **E2E ao vivo pendente (precisa do Ossamu)**
- [ ] Task 6 — despausar gerador (após validação + OK do Ossamu)

## Pendências que precisam do Ossamu (validação ao vivo)

1. **Editor → rejeição real:** abrir um rascunho em `editor.clinicaokazaki.com`, "Pedir nova versão" com uma nota de estilo. → confirma que `blog_review_log` capta nota+snapshot ao vivo (Task 2).
2. **Telegram → clicar botão:** quando uma regra proposta chegar no grupo, tocar ✅ Aprovar. → confirma o callback (Task 8) e a regra vira `active`.
3. **Despausar o gerador:** toggle no app editor (Configurações → Pausar gerador = OFF) ou avisar pra rodar `generator_paused=false`. Só depois do item 1-2 validados.

Após os cliques do Ossamu, verificar no banco e então despausar + merge da branch.
