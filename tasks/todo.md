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
