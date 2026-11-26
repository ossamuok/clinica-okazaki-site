# Todo — Publicador grava data errada no post (2026-11-26)

Pedido: posts saem com data que não é a da publicação. Verificar e corrigir.

## Diagnóstico (confirmado em dados)
- 22/22 posts em `main` com `publishedAt` em 2025 (ex.: `2025-05-15T10:00:00-03:00`); publicação real = 2026 (`blog_publish_queue.published_at` e data do commit batem entre si).
- `publishedAt` nasce no Gerador, escrito pela IA (data inventada). Publicador (`WTKgkMiaL74BmJbG`, nó `Gerar .post.ts + Validar`) só sobrescreve `updatedAt`.
- Efeito: data errada no card do blog, ordem do índice (`content/blog/index.ts` ordena por `publishedAt`) e `datePublished` do JSON-LD.

## Plano
- [x] 1. Backup do workflow vivo em `n8n-workflows/_backup/`
- [x] 2. Teste que falha: `n8n-workflows/lib/publicador.test.js` roda o jsCode do nó e exige `publishedAt` = momento da publicação
- [x] 3. Fix no nó: `publishedAt = updatedAt = agora` → PUT no n8n → reexportar JSON local
- [x] 4. Backfill dos 22 posts: `publishedAt` = data do commit que adicionou o arquivo
- [x] 5. Build do site + docs + lessons + commit/push (conferência no ar: ver relato da sessão)

Fora do escopo: republicação de post já publicado (editor não tem esse fluxo; se passar a ter, preservar a 1ª `published_at` da fila).

---

# Todo — Sugestão de temas + anti-repetição

Pedido (2026-06-10): (1) sugerir temas pros posts via página no editor; (2) acabar com repetição de tema dentro do pilar (ex: hepatologia = só esteatose).

## Diagnóstico (confirmado em dados)
- Hepatologia: 3/7 posts esteatose/gordura; gastro: 4/8 "quando procurar"; endoscopia: 4/8 "digestiva alta".
- Causa 1: dedup por slug exato — `esteatose-hepatica-sintomas` não bloqueia `esteatose-hepatica-grau-1-2-3`.
- Causa 2: picker sempre sorteia no top-3 do ranking SEO → temas vizinhos no ranking saem em sequência.
- Bug latente: SELECTs do Gerador sem `alwaysOutputData` → 0 regras ativas um dia = cadeia morre silenciosa.
- Run real de 06-08 (exec 29419) = success com few-shot+regras. Sistema vivo.

## Decisões (Ossamu)
- Canal: **página no editor** (`/temas`)
- Anti-repetição: **forte** (tema-chave só repete quando pool do pilar esgota)
- Inbox atual: não mexer

## Plano
- [ ] 1. Migration `blog_topic_suggestions` (pillar NOT NULL, topic_text, status pending/used/archived, RLS authenticated)
- [ ] 2. Editor: página `/temas` (form pilar+tema, lista pendentes c/ excluir, histórico usados) + rota + nav AppShell — subagent
- [ ] 3. Gerador:
  - `alwaysOutputData=true` em SELECT Exemplos + SELECT Regras Ativas (fix latente)
  - nó novo `SELECT Sugestoes` (pending, alwaysOutputData)
  - Code: sugestões FIFO por pilar furam fila; anti-repetição por tema-chave (2 primeiros tokens do slug) vs recentes+batch; sorteio uniforme no pool sobrevivente; janela recent_topics 30→100
  - nó `Marcar Sugestao Usada` em ramo PARALELO do Escolher (não inline — lição $input)
- [ ] 4. Mock-harness do Code novo (sugestão consumida, tema repetido bloqueado, 0-rows ok)
- [ ] 5. Docs + lessons + commit
- [ ] 6. Deploy editor = precisa push (Vercel builda do GitHub) — pedir autorização no fim
