# F0 — Monorepo Migration & vercel.json Audit

## Resumo

Repo migrado para monorepo pnpm workspaces. Código atual movido para `packages/site/`. Nada removido — apenas restruturado. Build local verde.

## Estrutura

```
clinica-okazaki/                  ← git root (inalterado)
├── package.json                  ← NOVO (root, scripts pass-through)
├── pnpm-workspace.yaml           ← NOVO
├── .gitignore                    ← NOVO (root, abrange packages/*)
├── packages/
│   └── site/                     ← TODO código atual movido p/ aqui
│       ├── package.json          ← name: "@okazaki/site" (era "clinica-okazaki")
│       ├── src/
│       ├── public/
│       ├── vite.config.ts
│       ├── vercel.json
│       └── ...
```

Pacotes futuros (não criados nesta fase): `packages/editor`, `packages/shared-renderer`.

## Auditoria `vercel.json`

Arquivo: `packages/site/vercel.json` (ainda na localização original p/ Vercel detectar). Total: 26 redirects 301.

### Redirects que afetam `/blog*`

| Linha | Source | Destination | Decisão F1 |
|---|---|---|---|
| 33 | `/blog` | `/` | **REMOVER** em F1 quando rota `/blog` (BlogIndex) for criada |
| 34 | `/blog/:path*` | `/` | **REMOVER** em F1 quando rota `/blog/:slug` (BlogPost) for criada |

Ambos legados Wix — bloqueiam blog atual. Sem outros redirects tocando `/blog`.

### Outros redirects (não-blog)

26 redirects no total cobrem variantes de URLs antigas:
- Apex → www: `clinicaokazaki.com/*` → `www.clinicaokazaki.com/*`
- Anchors: `/unidades`, `/equipe`, `/convenios`, `/contato`
- Especialidades: `/gastro`, `/hepato`, `/geriatra`, `/gastroenterologista`, etc.
- Preparos: `/preparacao-*`, `/preparo-para-*`
- Endoscopia: `/endoscopia-digestiva-alta`, `/endoscopia-alta`
- Genéricos: `/home`, `/index`, `/sobre`, `/sobre-nos`, `/procedimentos`, `/exames`, `/contatos`

Nenhum colide com novas rotas planejadas. **Manter todos.**

## Smoke Build

```
pnpm install        # 414 pacotes, 12.2s
pnpm --filter @okazaki/site build
```

Resultado: ✓ built in 7.51s. Prerender Puppeteer funcionou. 8 páginas estáticas geradas em `packages/site/dist/`.

Warning (tolerado): build scripts ignorados de `puppeteer@24.42.0` (n8n não impacta — only Chromium). Resolver depois com `pnpm approve-builds` se necessário.

## ⚠️ AÇÃO MANUAL OBRIGATÓRIA — Vercel Dashboard

**ANTES do próximo deploy CI**, atualizar Vercel:

1. Vercel Dashboard → Projeto `clinica-okazaki-site`
2. Settings → General → **Root Directory** → digitar `packages/site`
3. Settings → General → Install Command → `cd ../.. && pnpm install --frozen-lockfile`
4. Settings → General → Build Command → `pnpm --filter @okazaki/site build`
5. Settings → General → Output Directory → `dist` (relativo a Root Directory)

Sem este passo, build CI falha com "no package.json found at root".

Alternativa: criar arquivo `vercel.json` na raiz do monorepo apontando build, MAS Vercel monorepo prefere config via Dashboard.

## Próximos Passos (F1+)

- F1: criar estrutura `/blog` em `packages/site` (rotas, types, BlogIndex, BlogPost, sitemap, robots, prerender). Remover redirects L33-L34 de `vercel.json`.
- F2: extrair `packages/shared-renderer`.
- F3: Supabase project `blog`.
- F4-F5: editor web em `packages/editor`.
- F6-F8: Edge Functions + n8n workflows.
- F9: hardening.

Plano completo: `~/.claude/plans/a-mesmo-site-react-vite-velvety-wolf.md`.

## Não-fiz nesta fase (intencional)

- ❌ Modificar `vercel.json` (apenas auditado)
- ❌ Remover redirects `/blog*` (faz em F1 junto com criação das rotas)
- ❌ Criar `packages/editor` ou `packages/shared-renderer` (F2/F4)
- ❌ Mergear na `main` (PR aberto p/ revisão)
