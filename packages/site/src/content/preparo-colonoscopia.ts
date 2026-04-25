import type { PageContent } from "./types";

const preparoColonoscopia: PageContent = {
  slug: "preparo-colonoscopia",
  title: "Preparo para Colonoscopia: Dieta e Laxante | Clínica Okazaki",
  description:
    "Preparo para colonoscopia: dieta nos 2 dias anteriores, laxantes, jejum e medicamentos. Guia completo da Clínica Okazaki, Recife.",
  keywords:
    "preparo para colonoscopia, preparo colonoscopia, como preparar colonoscopia, dieta antes da colonoscopia, o que comer antes colonoscopia, laxante colonoscopia, pode beber água antes colonoscopia, prep",
  h1: "Preparo para colonoscopia: dieta, laxante e jejum em 2 dias",
  lead: "O preparo é a parte mais importante da colonoscopia — um intestino bem preparado faz o exame ser rápido, seguro e preciso. Este guia detalha cada passo, da dieta dos 2 dias anteriores até o jejum no dia do exame, com respostas às dúvidas mais frequentes.",
  eyebrow: "PREPARO · COLONOSCOPIA",
  breadcrumbLabel: "Preparo da colonoscopia",
  about: "Preparo para Colonoscopia",
  metaChips: [
    { label: "Dieta", value: "2 dias" },
    { label: "Laxante", value: "Prescrito" },
    { label: "Acompanhante", value: "Obrigatório" },
  ],
  sections: [
    {
      id: "por-que-o-preparo-importa",
      h2: "Por que o preparo é tão importante",
      blocks: [
        {
          type: "p",
          text: "A colonoscopia é um exame feito com uma câmera que percorre todo o intestino grosso. Para que o endoscopista consiga visualizar cada centímetro da mucosa e identificar lesões pequenas — como pólipos de poucos milímetros que podem ser precursores de câncer —, o intestino precisa estar completamente limpo de fezes.",
        },
        { type: "p", text: "Um preparo inadequado tem consequências sérias:" },
        {
          type: "ul",
          items: [
            "Lesões podem passar despercebidas ao endoscopista, por estarem encobertas por resíduos",
            "O exame pode precisar ser interrompido e reagendado, com novo preparo e nova sedação",
            "Aumenta o risco de complicações, como perfuração em áreas mal visualizadas",
            "O paciente passa pelo desconforto do preparo sem conseguir o benefício do exame",
          ],
        },
        {
          type: "callout",
          text: "Estudos mostram que cerca de 20% a 25% das colonoscopias no Brasil têm qualidade de preparo inferior ao ideal. Seguir o preparo rigorosamente é o que garante um exame eficiente. Abaixo, explicamos o passo a passo em detalhes.",
        },
      ],
    },
    {
      id: "dois-dias-antes",
      h2: "2 dias antes: dieta com baixo teor de fibras",
      blocks: [
        {
          type: "p",
          text: "A partir de 2 dias antes da colonoscopia, ajuste a alimentação para reduzir fibras e resíduos no intestino. O objetivo é facilitar a ação do laxante e garantir um preparo eficiente.",
        },
        { type: "p", text: "Evite completamente:" },
        {
          type: "ul",
          items: [
            "Frutas com casca, bagaço ou sementes: maçã com casca, pera, uva, morango, kiwi, mamão com sementes, melancia, abacaxi",
            "Verduras cruas e folhosos: alface, rúcula, agrião, couve, espinafre",
            "Legumes crus ou com casca: pepino, tomate com casca, cenoura crua, pimentão",
            "Cereais integrais: arroz integral, pão integral, aveia, granola, linhaça, chia",
            "Sementes e castanhas: amendoim, castanha de caju, amêndoa, noz, gergelim",
            "Milho, pipoca, ervilha — especialmente problemáticos",
          ],
        },
        { type: "p", text: "Priorize:" },
        {
          type: "ul",
          items: [
            "Carboidratos refinados: arroz branco, macarrão, pão branco, biscoito cream cracker, batata sem casca",
            "Proteínas magras: peito de frango, peixe branco, carne magra (patinho, coxão mole), ovos",
            "Laticínios claros: queijo branco, requeijão, leite, iogurte natural (sem frutas)",
            "Frutas cozidas ou sem casca e sem bagaço: maçã cozida, banana madura, melão",
            "Legumes cozidos sem casca: cenoura cozida, abobrinha cozida, chuchu, batata cozida",
            "Bebidas: água, chás claros, sucos coados sem polpa, água de coco",
          ],
        },
        {
          type: "callout",
          text: "Evite refrigerantes com corante vermelho ou roxo. Pode consumir refrigerantes transparentes (água com gás, guaraná claro) com moderação.",
        },
      ],
    },
    {
      id: "dia-anterior",
      h2: "Dia anterior ao exame: dieta líquida e laxante",
      blocks: [
        {
          type: "p",
          text: "Este é o dia mais crítico do preparo. A alimentação muda e o laxante prescrito entra em ação.",
        },
        {
          type: "p",
          text: "O café da manhã e o almoço ainda podem ser sólidos, seguindo a dieta pobre em fibras descrita acima. A última refeição sólida geralmente é o almoço, entre 12h e 13h. Depois disso, apenas líquidos claros.",
        },
        {
          type: "p",
          text: "A partir da tarde, você consome apenas líquidos que o intestino consegue absorver rapidamente, sem deixar resíduos:",
        },
        {
          type: "ul",
          items: [
            "Água, bastante — é essencial para manter hidratação durante o laxante",
            "Caldos coados (de frango ou legumes, sem pedaços)",
            "Chás claros (camomila, erva-doce, hortelã)",
            "Gelatina — exceto vermelha e roxa",
            "Sucos coados sem polpa (maçã, uva branca)",
            "Água de coco natural coada",
          ],
        },
      ],
    },
    {
      id: "dia-do-exame",
      h2: "Dia do exame: jejum e medicações",
      blocks: [
        {
          type: "p",
          text: "A partir do horário indicado no agendamento (geralmente 4 a 6 horas antes do exame), você deve manter jejum absoluto — nem água. Sem o jejum adequado, o exame é cancelado pelo risco de aspiração durante a sedação.",
        },
        {
          type: "ul",
          items: [
            "Pressão arterial, tireoide, antidepressivos, anticonvulsivantes: tomar normalmente com um pequeno gole de água",
            "Diabetes: avisar no agendamento — a medicação precisa de ajuste por causa do jejum",
            "Anticoagulantes: avisar no agendamento — o manejo é planejado com o médico que prescreveu",
            "Documento de identidade com foto e carteira do convênio",
            "Pedido médico original",
            "Exames anteriores, se tiver (colonoscopias prévias, biópsias)",
          ],
        },
        {
          type: "callout",
          text: "Nossa equipe responde pelo WhatsApp a qualquer momento nos dias anteriores ao exame. Preparo tranquilo, exame tranquilo.",
        },
      ],
    },
    {
      id: "laxante-preparo",
      h2: "O laxante: o que esperar e por que seguir à risca",
      blocks: [
        {
          type: "p",
          text: "O laxante para colonoscopia é prescrito pelo médico conforme o perfil de cada paciente — tipo, volume, horário de início e modo de preparo variam. As instruções detalhadas são enviadas no momento do agendamento.",
        },
        {
          type: "p",
          text: "O mais importante é seguir rigorosamente o protocolo prescrito: tomar na dose, no horário e do modo indicado. Não substitua por laxantes caseiros, chás ou produtos naturais — eles não têm potência nem previsibilidade suficientes para limpar o intestino adequadamente.",
        },
        {
          type: "callout",
          text: "Hidratação é essencial durante o laxante. Beba bastante água e líquidos claros ao longo de todo o processo — o laxante elimina muito líquido e a desidratação é o efeito adverso mais comum.",
        },
      ],
    },
    {
      id: "erros-comuns",
      h2: "Erros que cancelam ou prejudicam o exame",
      blocks: [
        { type: "p", text: "Estes são os erros mais comuns e como evitá-los:" },
        {
          type: "warning",
          text: "Quebrar o jejum no dia do exame (mesmo água em excesso) cancela o exame. Não tomar todo o laxante deixa o preparo incompleto. Alimentos com corante vermelho/roxo podem ser confundidos com sangue. Anticoagulantes sem ajuste podem levar a sangramento grave em polipectomia.",
        },
        {
          type: "ul",
          items: [
            "Quebrar o jejum no dia do exame (mesmo água em excesso) — cancela o exame",
            "Não tomar todo o laxante — o preparo fica incompleto e o intestino com resíduos",
            "Consumir alimentos com corante vermelho/roxo — podem ser confundidos com sangue no exame",
            "Comer fibras próximo ao preparo — milho, pipoca e sementes são especialmente problemáticos",
            "Tomar anticoagulantes sem ajuste — pode levar a sangramento grave em polipectomia",
            "Começar o laxante muito cedo ou muito tarde — compromete a janela ideal de limpeza",
          ],
        },
      ],
    },
    {
      id: "ajuste-medicamentos",
      h2: "Ajustes de medicamentos: o que precisa de atenção",
      blocks: [
        {
          type: "p",
          text: "Este é um dos pontos que mais gera dúvida. Informe sempre no agendamento todas as medicações que você usa — especialmente:",
        },
        {
          type: "warning",
          text: "Medicamentos para perda de peso ou controle glicêmico da classe GLP-1 — como Ozempic, Wegovy, Mounjaro, Zepbound, Saxenda, Victoza, Trulicity, Rybelsus e similares — retardam o esvaziamento gástrico e aumentam o risco de broncoaspiração durante a sedação. É obrigatório suspendê-los antes do exame. Ao agendar, você recebe as orientações detalhadas sobre quando suspender.",
        },
        {
          type: "warning",
          text: "Anticoagulantes (varfarina/Marevan, rivaroxabana/Xarelto, apixabana/Eliquis, dabigatrana/Pradaxa) e antiagregantes plaquetários (clopidogrel/Plavix, ticagrelor/Brilinta) precisam ser suspensos antes do exame — mas somente com o aval do médico assistente que acompanha você. Nunca suspenda por conta própria, principalmente se a medicação foi indicada após AVC, infarto, fibrilação atrial ou colocação de stent.",
        },
        {
          type: "p",
          text: "Hipoglicemiantes orais (metformina, glibenclamida) geralmente são suspensos no dia do exame. Insulina precisa de ajuste de dose por causa do jejum. Leve seu medidor de glicemia.",
        },
      ],
    },
    {
      id: "preparo-funcionando",
      h2: "Como saber se o preparo está funcionando",
      blocks: [
        {
          type: "p",
          text: "O preparo adequado se caracteriza por evacuações progressivamente mais líquidas até chegar a um líquido amarelado e transparente, sem resíduos sólidos. Esse é o \"OK\" do intestino limpo.",
        },
        {
          type: "p",
          text: "Se nas últimas horas antes do exame as evacuações ainda estão com resíduos sólidos ou muito escuras, entre em contato com a clínica. Pode ser necessário:",
        },
        {
          type: "ul",
          items: [
            "Aguardar mais algumas horas",
            "Aumentar a ingestão de líquidos claros",
            "Adicionar doses extras de laxante conforme prescrição",
          ],
        },
        {
          type: "callout",
          text: "Em casos excepcionais, o exame é adiado por algumas horas ou reagendado. É sempre melhor adiar e fazer um exame de qualidade do que insistir em um preparo incompleto.",
        },
        {
          type: "video",
          youtubeId: "5efcPRzo_Wk",
          caption: "Preparo para colonoscopia — Clínica Okazaki",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "Posso beber água durante o preparo?",
      a: "Sim, e você deve beber muita água durante o preparo para manter a hidratação — o laxante elimina muito líquido. O jejum absoluto de líquidos só começa no dia do exame, no horário indicado.",
    },
    {
      q: "O que fazer se o laxante não estiver fazendo efeito?",
      a: "Se após 2 horas do início do laxante não houver evacuação, entre em contato com a clínica. Em geral basta aumentar a ingestão de líquidos claros ou adicionar uma dose extra conforme prescrição.",
    },
    {
      q: "As fezes precisam ficar totalmente líquidas?",
      a: "Sim. O objetivo é que as últimas evacuações sejam líquidas transparentes, como água amarelada — sem resíduos sólidos. Esse é o sinal de intestino limpo o suficiente.",
    },
    {
      q: "Posso tomar meus medicamentos no dia do exame?",
      a: "Medicamentos de pressão, tireoide, antidepressivos e anticonvulsivantes são tomados com um pequeno gole de água. Diabetes e anticoagulantes precisam de ajuste — avise no agendamento.",
    },
    {
      q: "Posso mascar chiclete durante o preparo?",
      a: "Durante a dieta líquida e o laxante, evite chicletes com corantes. No dia do exame, durante o jejum, chiclete é proibido (estimula a produção de saliva e suco gástrico).",
    },
    {
      q: "Estou com muita fome, o que posso fazer?",
      a: "Fome durante a dieta líquida é normal. Consuma gelatina (exceto vermelha/roxa), caldos coados, água de coco, chás adoçados com mel e sucos coados sem polpa à vontade — são alimentos permitidos que ajudam a amenizar.",
    },
    {
      q: "Posso escovar os dentes no dia do exame?",
      a: "Sim, escove normalmente cuidando para não engolir a água.",
    },
    {
      q: "Tomei um gole de café por engano — o exame foi cancelado?",
      a: "Um gole de água ou café sem leite horas antes do horário programado geralmente não inviabiliza o exame. Avise a equipe ao chegar — eles vão avaliar o tempo decorrido e o risco. Se foi leite, refrigerante, suco com polpa ou alimento, o exame provavelmente será remarcado.",
    },
    {
      q: "Posso tomar laxante de ervas ou caseiro em vez do prescrito?",
      a: "Não. Laxantes caseiros, chás laxantes e produtos naturais não têm potência e previsibilidade suficientes para um preparo de colonoscopia. Use apenas o laxante prescrito, exatamente como orientado.",
    },
    {
      q: "Crianças e idosos fazem o mesmo preparo?",
      a: "Não. Pacientes pediátricos, idosos frágeis, pessoas com doença renal ou cardíaca podem precisar de esquemas de preparo adaptados, com menor volume e medicações específicas. Sempre converse com o médico.",
    },
  ],
  howTo: {
    name: "Como se preparar para a colonoscopia",
    description:
      "Preparo em 2 dias: dieta pobre em fibras, dieta líquida e laxante no dia anterior, jejum no dia do exame.",
    steps: [
      {
        name: "2 dias antes: dieta pobre em fibras",
        text: "Evite frutas com casca, verduras cruas, cereais integrais, sementes, castanhas, milho e pipoca. Priorize arroz branco, pão branco, proteínas magras, laticínios claros, legumes cozidos e bebidas claras.",
      },
      {
        name: "Dia anterior: dieta líquida e laxante",
        text: "Café da manhã e almoço sólidos seguindo dieta pobre em fibras. Depois do almoço, apenas líquidos claros (água, caldos coados, chás, gelatina não vermelha, sucos coados). Tome o laxante no horário prescrito.",
      },
      {
        name: "Dia do exame: jejum absoluto",
        text: "Jejum total de 4 a 6 horas antes do exame — nem água. Medicações contínuas tomadas com pequeno gole de água. Leve documento, carteira do convênio, pedido médico e exames anteriores. Compareça com acompanhante adulto.",
      },
    ],
  },
};

export default preparoColonoscopia;
