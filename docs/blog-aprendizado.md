# Blog · Como a IA aprende seu estilo

> Guia simples (sem termo técnico) de como o blog foi ensinado a escrever cada vez mais perto do jeito de vocês. Implantado em 2026-06-07.

## A ideia em uma frase

Cada post que vocês **aprovam** e cada **correção** que vocês fazem passam a melhorar o próximo post. A IA não treina sozinha — montamos um mecanismo que pega esses sinais e devolve pra ela na hora de escrever.

## As duas formas de ensinar

### 1. Exemplos aprovados (automático)
Quando a IA vai escrever um post novo, ela primeiro **olha os melhores posts já aprovados** do mesmo assunto e copia o estilo, o tom e a estrutura. Quanto mais vocês aprovam, melhor fica o "modelo a seguir".
- Não precisa fazer nada. Já funciona com os posts aprovados que existem hoje (há 10).

### 2. Regras aprendidas com suas correções (você aprova no Telegram)
Toda vez que vocês **pedem uma nova versão** de um rascunho (botão "Pedir nova versão" no editor), a nota que vocês escrevem fica **guardada**. Antes ela era apagada — agora não.

Uma vez por semana (ou quando a gente disparar), a IA lê todas essas notas e propõe **regras de estilo** curtas, por exemplo:
- *"Nunca usar 'agende já'; preferir convite calmo."*
- *"Deixar o primeiro parágrafo com no máximo 2 frases."*

Essas regras **não entram sozinhas**. Elas chegam pra vocês **no grupo do Telegram**, cada uma com dois botões:

> 🆕 **Regra proposta [tom]**
> Nunca usar "agende já"; preferir convite calmo.
> [ ✅ Aprovar ]   [ ❌ Recusar ]

- Toca **✅ Aprovar** → a regra passa a valer e a IA segue ela em todos os posts seguintes.
- Toca **❌ Recusar** → a regra é descartada.

Pronto. É só isso que vocês precisam fazer: **tocar um botão no Telegram** quando uma regra boa aparecer.

## O ciclo completo

```
Vocês corrigem um rascunho (com nota)
        ↓
A nota fica guardada (não some mais)
        ↓
Toda semana a IA lê as notas e propõe regras
        ↓
Vocês aprovam/recusam no Telegram (1 toque)
        ↓
A IA escreve os próximos posts seguindo as regras + imitando os aprovados
        ↓
Cada post nasce mais perto do gosto de vocês
```

## Perguntas comuns

**Preciso saber programar?** Não. Só tocar botão no Telegram.

**E se eu não aprovar nenhuma regra?** O blog continua funcionando normal — só não aprende com as correções. Sem regra aprovada = comportamento de antes.

**Posso mudar de ideia depois?** Sim. Uma regra aprovada pode ser desativada (peça pra equipe técnica; é um campo no banco).

**Isso encarece muito?** Não. Os exemplos aprovados entram no pedido à IA; o custo sobe alguns centavos por semana. Nada relevante.

**A IA pode inventar uma regra médica errada?** O sistema é instruído a **não** criar regra de fato médico/CFM sem evidência na sua nota — e mesmo assim **nada entra sem você aprovar** no Telegram. Por isso o botão existe.

## Sugerir temas (novo — 2026-06-10)

Página **Temas** no editor (`editor.clinicaokazaki.com/temas`): escolha o pilar, escreva o tema (ex: *"Hepatite B na gravidez"*) e clique **Sugerir tema**. O próximo post daquele pilar usa o seu tema em vez do automático. A fila é por ordem de chegada; depois de usado, o tema aparece no histórico "Já usados".

## Variedade de temas (novo — 2026-06-10)

O gerador agora evita repetir o mesmo assunto dentro do pilar (ex: vários posts de esteatose em hepatologia). Um tema só volta a aparecer quando todos os outros temas do pilar já tiverem saído (~4 meses de espaçamento).

## Quem aprovou aparece no post (novo — 2026-06-11)

Antes, todo post mostrava no rodapé "Revisão: Dra. Jane Erika Frazão Okazaki", não importava quem aprovasse. Agora **aparece automaticamente o nome de quem aprovou** o rascunho no editor — com a foto, CRM e RQE corretos.

- Já está cadastrada: **Dra. Ana Beatriz Sacerdote** (Gastroenterologia · Hepatologia). Quando ela aprovar um post, o rodapé mostra o nome dela.
- **Como ela entra:** acessa `editor.clinicaokazaki.com`, digita o email `anabiasacerdote@gmail.com` e clica no link mágico que chega no email. A conta é criada sozinha no primeiro acesso.
- Quem aprovar sem cadastro de autoria continua saindo como Dra. Jane (padrão).
- **Cadastrar outro revisor no futuro:** peça à equipe técnica para adicionar email + dados na tabela `blog_reviewers`. Depois a pessoa só loga uma vez.

## Onde isso vive (pra equipe técnica)

Ver `docs/blog-n8n-workflows.md` (seções "Aprendizado — 2026-06-07" e "Sugestões de temas — 2026-06-10") para os workflows, tabelas e IDs.
