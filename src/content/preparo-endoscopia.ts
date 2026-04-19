import type { PageContent } from "./types";

const preparoEndoscopia: PageContent = {
  slug: "preparo-endoscopia",
  title: "Preparo para Endoscopia: Jejum e Medicamentos | Clínica Okazaki",
  description:
    "Preparo para endoscopia: jejum de 8 horas, medicamentos e o que levar. Guia completo da Clínica Okazaki, Recife.",
  keywords:
    "preparo para endoscopia, preparo endoscopia, jejum endoscopia, o que comer antes endoscopia, endoscopia jejum quantas horas, pode beber água antes endoscopia, preparo endoscopia passo a passo, preparo",
  h1: "Preparo para endoscopia: jejum de 8 horas, medicamentos e o dia do exame",
  lead: "O preparo da endoscopia digestiva alta é muito mais simples que o da colonoscopia — não exige dieta especial nem laxante. O essencial é cumprir rigorosamente o jejum de 8 horas e ajustar algumas medicações. Este guia explica tudo o que você precisa saber.",
  eyebrow: "PREPARO · ENDOSCOPIA",
  breadcrumbLabel: "Preparo da endoscopia",
  about: "Preparo para Endoscopia",
  metaChips: [
    { label: "Jejum sólidos", value: "8 horas" },
    { label: "Jejum líquidos", value: "4 horas" },
    { label: "Acompanhante", value: "Obrigatório" },
  ],
  sections: [
    {
      id: "por-que-o-jejum",
      h2: "Por que o jejum é obrigatório",
      blocks: [
        {
          type: "p",
          text: "A endoscopia digestiva alta é realizada com sedação administrada por anestesista, e essa é a principal razão para o jejum rigoroso. Durante a sedação, os reflexos protetores das vias aéreas ficam temporariamente reduzidos. Se houver alimento no estômago, existe risco de aspiração pulmonar — uma complicação rara mas potencialmente grave.",
        },
        { type: "p", text: "Além da segurança, o jejum serve para:" },
        {
          type: "ul",
          items: [
            "Permitir boa visualização da mucosa do esôfago, estômago e duodeno — resíduos alimentares podem esconder lesões",
            "Evitar náuseas e vômitos durante e após o procedimento",
            "Facilitar a coleta de biópsias quando necessário",
            "Permitir avaliação correta de conteúdo gástrico, úlceras e lesões",
          ],
        },
        {
          type: "callout",
          text: "Por essas razões, clínicas e hospitais sérios cancelam o exame se o paciente não cumpriu o jejum adequado. É uma regra de segurança, não burocracia.",
        },
      ],
    },
    {
      id: "jejum-8-horas",
      h2: "Jejum de 8 horas: o que significa exatamente",
      blocks: [
        {
          type: "p",
          text: "O protocolo de jejum para endoscopia segue as recomendações internacionais de sedação anestésica:",
        },
        { type: "p", text: "Neste grupo entram:" },
        {
          type: "ul",
          items: [
            "Todos os alimentos sólidos (pão, frutas, carnes, arroz, ovos, cereais, iogurte com pedaços)",
            "Leite (mesmo desnatado) e derivados — o leite forma coágulos no estômago",
            "Café com leite, achocolatados, capuccino",
            "Sucos com polpa (laranja, manga, maracujá integral)",
            "Vitaminas e shakes",
            "Gelatina, pudim, sorvete",
          ],
        },
        { type: "p", text: "Estes podem ser consumidos até 4 horas antes:" },
        {
          type: "ul",
          items: [
            "Água",
            "Chá sem leite (camomila, hortelã, erva-cidreira)",
            "Água de coco natural coada",
          ],
        },
      ],
    },
    {
      id: "dia-anterior",
      h2: "Dia anterior ao exame",
      blocks: [
        {
          type: "p",
          text: "Diferentemente da colonoscopia, a endoscopia não exige dieta especial nos dias anteriores. Você pode se alimentar normalmente, mas algumas recomendações ajudam:",
        },
        {
          type: "p",
          text: "Alimentação habitual, sem restrições. Mantenha-se hidratado.",
        },
        {
          type: "ul",
          items: [
            "Prefira refeição leve e de fácil digestão",
            "Evite frituras, churrasco, feijoada, pratos muito gordurosos",
            "Evite refeições fartas tarde da noite",
            "Evite bebidas alcoólicas — podem interferir na sedação",
          ],
        },
        {
          type: "callout",
          text: "Pode tomar água normalmente até o horário de início do jejum. Escove os dentes e durma cedo — você vai precisar acordar de jejum no dia seguinte.",
        },
      ],
    },
    {
      id: "dia-do-exame",
      h2: "Dia do exame: o que fazer",
      blocks: [
        {
          type: "p",
          text: "Se o horário permite (lembre do jejum de 4 horas para líquidos), você pode tomar um pequeno gole de água para ajudar a engolir as medicações contínuas. Não coma nada — nem um biscoito, nem uma bala.",
        },
        {
          type: "p",
          text: "Chegue 30 minutos antes do horário agendado. A recepção confere documentação, faz a abertura do prontuário e você assina o termo de consentimento informado. Esse tempo é usado também para repassar orientações e preparar você para o exame.",
        },
        {
          type: "ul",
          items: [
            "Escove os dentes normalmente, cuidando para não engolir a água",
            "Tome banho sem restrições",
            "Evite maquiagem pesada — o monitor de saturação precisa do dedo livre de esmalte muito escuro (tons claros são aceitáveis)",
            "Não use perfume forte — alguns pacientes têm náusea com cheiros intensos no pós-sedação",
            "Retire joias, piercings e próteses dentárias removíveis antes do exame — deixe com seu acompanhante",
          ],
        },
      ],
    },
    {
      id: "medicamentos",
      h2: "Medicamentos: o que tomar e o que suspender",
      blocks: [
        {
          type: "p",
          text: "Essas medicações não podem ser suspensas e devem ser tomadas na manhã do exame com um pequeno gole de água:",
        },
        {
          type: "ul",
          items: [
            "Anti-hipertensivos (pressão arterial): losartana, enalapril, anlodipino, atenolol, hidroclorotiazida etc.",
            "Remédios para tireoide: levotiroxina (Puran T4, Synthroid, Euthyrox) — tomar em jejum como de hábito",
            "Antidepressivos e ansiolíticos: fluoxetina, sertralina, escitalopram, clonazepam etc.",
            "Anticonvulsivantes: carbamazepina, valproato, lamotrigina",
            "Corticoides de uso crônico",
            "Inaladores para asma/DPOC: pode usar antes e deve levar consigo",
          ],
        },
        {
          type: "p",
          text: "Estes precisam ser conversados com seu médico ANTES do dia do exame:",
        },
        {
          type: "warning",
          text: "Medicamentos para perda de peso ou controle glicêmico da classe GLP-1 — como Ozempic, Wegovy, Mounjaro, Zepbound, Saxenda, Victoza, Trulicity, Rybelsus e similares — retardam o esvaziamento gástrico e aumentam o risco de broncoaspiração durante a sedação. É obrigatório suspendê-los antes do exame. Ao agendar, você recebe as orientações detalhadas sobre quando suspender.",
        },
        {
          type: "warning",
          text: "Anticoagulantes (varfarina/Marevan, rivaroxabana/Xarelto, apixabana/Eliquis, dabigatrana/Pradaxa) e antiagregantes plaquetários (clopidogrel/Plavix, ticagrelor/Brilinta) precisam ser suspensos antes do exame — mas somente com o aval do médico assistente que acompanha você. Nunca suspenda por conta própria.",
        },
      ],
    },
    {
      id: "o-que-levar",
      h2: "O que levar no dia do exame",
      blocks: [
        { type: "p", text: "Prepare uma pasta ou envelope na noite anterior com:" },
        {
          type: "ul",
          items: [
            "Documento de identidade com foto (RG, CNH ou passaporte)",
            "Carteira do convênio ou comprovante de autorização",
            "Pedido médico original (não basta foto no celular)",
            "Exames anteriores relacionados, se houver: endoscopias prévias, biópsias, relatórios de cirurgias",
            "Lista dos medicamentos em uso, com doses e horários",
          ],
        },
        {
          type: "callout",
          text: "Você não pode comparecer sozinho. A sedação impede que você dirija, tome decisões importantes ou retorne sozinho para casa. Se chegar desacompanhado, o exame é remarcado. O acompanhante deve ser um adulto (maior de 18 anos) que permanece na clínica durante o procedimento.",
        },
      ],
    },
    {
      id: "situacoes-especiais",
      h2: "Situações especiais",
      blocks: [
        {
          type: "p",
          text: "A endoscopia na gestação é feita apenas quando o benefício supera claramente o risco, preferencialmente no segundo trimestre. A decisão deve ser conjunta entre obstetra, endoscopista e anestesista. Medicações de sedação são selecionadas considerando o desenvolvimento fetal.",
        },
        {
          type: "p",
          text: "Pacientes acima de 75 anos ou com múltiplas comorbidades podem precisar de avaliação pré-exame. O protocolo de sedação também é adaptado.",
        },
        {
          type: "p",
          text: "A endoscopia em crianças exige protocolo específico, com jejum ajustado por idade, sedação adequada e, muitas vezes, presença da mãe ou responsável na sala de preparo.",
        },
      ],
    },
    {
      id: "depois-do-exame",
      h2: "Depois do exame: o que esperar",
      blocks: [
        {
          type: "ul",
          items: [
            "Recuperação de 15 a 30 minutos monitorado na sala de recuperação",
            "Lanche leve liberado (café com pão ou biscoito)",
            "Entrega do laudo macroscópico",
            "Liberação com acompanhante",
            "Não dirigir nem operar máquinas",
            "Não trabalhar, estudar ou realizar tarefas que exijam concentração",
          ],
        },
        {
          type: "warning",
          text: "Dor intensa no peito, abdome ou garganta; febre; vômitos com sangue; fezes pretas; falta de ar; dificuldade para respirar; sangramento oral persistente nas 48 horas após o exame. Ligue (81) 99954-0570 e dirija-se ao serviço de urgência mais próximo.",
        },
        {
          type: "inline-cta",
          text: "Com preparo simples e equipe especializada em duas unidades de Recife. Nossa recepção orienta cada detalhe do seu preparo.",
          label: "Tirar dúvidas pelo WhatsApp",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "Quantas horas de jejum antes da endoscopia?",
      a: "8 horas para sólidos e líquidos com resíduo (leite, café com leite, sucos com polpa) e 4 horas para líquidos claros (água, chá sem leite).",
    },
    {
      q: "Posso beber água antes da endoscopia?",
      a: "Sim, até 4 horas antes do exame em pequena quantidade. Depois desse horário, jejum absoluto — nem água.",
    },
    {
      q: "Preciso fazer dieta antes da endoscopia?",
      a: "Não é necessária dieta especial. Alimentação normal com jantar leve na noite anterior é suficiente. Cumpra apenas o jejum das 8 horas.",
    },
    {
      q: "Posso tomar meus remédios no dia da endoscopia?",
      a: "Medicamentos de pressão, tireoide, antidepressivos e anticonvulsivantes são tomados com pequeno gole de água. Diabetes e anticoagulantes precisam de ajuste prévio com o médico.",
    },
    {
      q: "Posso ir sozinho fazer a endoscopia?",
      a: "Não. Como o exame é feito com sedação, é obrigatório comparecer acompanhado de adulto responsável que aguarda durante o procedimento e acompanha o retorno.",
    },
    {
      q: "Posso escovar os dentes antes do exame?",
      a: "Sim, pode escovar normalmente tomando cuidado para não engolir a água.",
    },
    {
      q: "Tomei um café por engano 6 horas antes do exame — pode?",
      a: "Café sem leite e sem açúcar 6 horas antes é compatível com o jejum. Avise a equipe ao chegar para que a avaliação seja registrada. Café com leite, no entanto, invalida o jejum.",
    },
    {
      q: "Posso fumar antes da endoscopia?",
      a: "Não é recomendado fumar nas 6 horas anteriores ao exame. O fumo aumenta secreções gástricas e pode comprometer a visualização.",
    },
    {
      q: "Minha menstruação desceu — posso fazer endoscopia?",
      a: "Sim, menstruação não impede a endoscopia. É um exame do trato digestivo superior, não interfere.",
    },
    {
      q: "Uso CPAP para apneia do sono — preciso levar?",
      a: "Informe no agendamento. Geralmente não é necessário levar o aparelho, mas o anestesista precisa saber desse histórico para adequar a sedação.",
    },
  ],
  howTo: {
    name: "Como se preparar para a endoscopia digestiva alta",
    description:
      "Preparo simples: jejum de 8 horas para sólidos (4 horas para líquidos claros), ajuste de medicações e acompanhante adulto obrigatório.",
    steps: [
      {
        name: "Noite anterior: jantar leve",
        text: "Refeição leve e de fácil digestão. Evite frituras, churrasco, feijoada, pratos gordurosos e bebidas alcoólicas. Água à vontade até o horário de início do jejum.",
      },
      {
        name: "Jejum de 8 horas para sólidos",
        text: "A partir do horário indicado, jejum absoluto de sólidos, leite e derivados, café com leite, sucos com polpa, vitaminas, gelatina e sorvete. Líquidos claros (água, chá sem leite) podem até 4 horas antes.",
      },
      {
        name: "Manhã do exame: medicações contínuas",
        text: "Medicamentos de pressão, tireoide, antidepressivos e anticonvulsivantes com pequeno gole de água. Suspenda hipoglicemiantes e anticoagulantes apenas conforme orientação prévia.",
      },
      {
        name: "Chegada à clínica com acompanhante",
        text: "Chegue 30 minutos antes com documento, carteira do convênio, pedido médico e exames anteriores. Obrigatório acompanhante adulto — sem ele, o exame é remarcado. Recuperação de 15–30 minutos, laudo no mesmo dia e liberação com acompanhante.",
      },
    ],
  },
};

export default preparoEndoscopia;
