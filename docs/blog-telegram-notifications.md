# Blog · Notificações Telegram (substitui F6 — Edge Functions/Resend)

## Decisão

Optamos por Telegram em vez de email transacional (Resend). Motivos:
- Setup zero DNS (sem DKIM/SPF/DMARC no Wix)
- Push instantâneo no celular
- Botões inline ("Abrir editor")
- Custo zero, ilimitado
- Histórico organizado em chat dedicado

**Edge Functions Supabase (`notify-jane-new-drafts`, `notify-publish-success`, `notify-publish-failure`)** que foram deployadas em F6 não são mais usadas. Permanecem live mas inertes (sem secrets configurados → respondem 500 se forem chamadas, ninguém chama).

## Setup

### Bot + grupo

| Item | Valor |
|---|---|
| Bot username | `okazaki_blog_bot` (ou similar — definido pelo Ossamu via @BotFather) |
| Grupo Telegram | "Blog Okazaki — Notificações" |
| Membros | Dra. Jane Erika, Ossamu, bot |
| **Chat ID** | **`-5152728039`** |

> Bot precisa ser **admin** do grupo para que comandos funcionem; basta ser membro para enviar mensagens.

### Token

O **TOKEN** do bot é gerado pelo BotFather. Ossamu configura via:
- n8n → Credentials → New → tipo **Telegram API** → cola token
- Nome da credencial: **`Telegram Blog Bot`** (referenciada nos workflows)

## Workflows que usam

### F7 · Blog · Gerador Semanal (`41A8liy2qNm9zqpR`)

Último nó: **`Notificar Grupo Telegram`** (Telegram → Message → sendMessage).

Mensagem enviada quando 2+ rascunhos são gerados:
```
📚 Centro Clínico Okazaki · Blog

2 novo(s) rascunho(s) aguardando revisão da Dra. Jane:

1. Refluxo Gastroesofágico em Recife: Sintomas...
   gastroenterologia

2. Preparo de Endoscopia: O Que Você Precisa Saber
   endoscopia

[Botão: Abrir editor → editor.clinicaokazaki.com/inbox]
```

### F8 · Blog · Publicador (`WTKgkMiaL74BmJbG`)

**Sucesso** → nó `Telegram: Publicado OK`:
```
✅ Post publicado

Refluxo Gastroesofágico em Recife: Sintomas...
gastroenterologia

Commit: abc1234

[Botão: Ver post ao vivo → www.clinicaokazaki.com/blog/<slug>]
```

**Falha** → nó `Telegram: Falha publicação`:
```
⚠️ Falha na publicação

Slug: refluxo-gastroesofagico
Etapa: commit GitHub
Tentativa: 2

Erro:
github_commit failed: Resource not accessible by integration

O Publicador tentará novamente em ~5 min.

[Botão: Abrir rascunho → editor.clinicaokazaki.com/drafts/<id>]
```

## ⚠️ Ação manual obrigatória (Ossamu)

### Configurar credencial Telegram no n8n

1. Abrir https://automacoes-n8n.adhgqk.easypanel.host
2. Settings → Credentials → New credential
3. Type: **Telegram API**
4. Name: **`Telegram Blog Bot`** (exato — workflows referenciam por este nome)
5. Access Token: cola o token do BotFather
6. Save

> O n8n auto-assoluou esta credencial nos 3 nós Telegram. Se aparecer "credential not found" ao executar workflow, basta abrir o nó e selecionar manualmente.

### Smoke test

Após criar credencial:
1. Abrir workflow F7 no n8n UI
2. Botão direito sobre nó **`Notificar Grupo Telegram`** → **"Execute step"**
3. n8n vai pedir mock data → escolher última execução OU passar `[{"id":"test","title":"Teste manual","pillar":"gastroenterologia"}]`
4. Mensagem deve chegar no grupo Telegram em segundos
5. Se erro `Forbidden: bot was kicked` → bot não está no grupo. Adicionar.
6. Se erro `Bad Request: chat not found` → chat_id incorreto. Verificar.

## Trocar bot ou grupo no futuro

Substituir `chatId` em 3 nós dos 2 workflows:
- F7 → `Notificar Grupo Telegram`
- F8 → `Telegram: Publicado OK`
- F8 → `Telegram: Falha publicação`

Cada um aceita string fixa. Para múltiplos grupos (ex: errors em chat separado), basta apontar `notifyFailureTg` para outro `chatId`.
