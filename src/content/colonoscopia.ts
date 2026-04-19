import { CLINIC_AGE } from "../lib/constants";
import type { PageContent } from "./types";

const colonoscopia: PageContent = {
  slug: "colonoscopia",
  title: "Colonoscopia em Recife com CO₂ e Sedação | Clínica Okazaki",
  description:
    `Colonoscopia em Recife com CO₂ e sedação por anestesista. Clínica Okazaki: ${CLINIC_AGE} anos, duas unidades (Derby e Boa Viagem). Agende pelo WhatsApp.`,
  keywords:
    "colonoscopia recife, colonoscopia com co2, colonoscopia com sedação, colonoscopia boa viagem, colonoscopia derby, quanto custa colonoscopia recife, onde fazer colonoscopia recife, colonoscopia unimed ",
  h1: "Colonoscopia em Recife: exame com CO₂ para mais conforto no pós-exame",
  lead:
    "A colonoscopia é o exame padrão-ouro para rastrear e prevenir o câncer colorretal. Na Clínica Okazaki, usamos insuflação por CO₂ em vez de ar ambiente — o gás é absorvido rapidamente pelo organismo, reduzindo a cólica, os gases e o inchaço que costumam incomodar depois do exame.",
  eyebrow: "EXAME · COLONOSCOPIA",
  breadcrumbLabel: "Colonoscopia",
  about: "Colonoscopia",
  metaChips: [
    { label: "Duração", value: "20-40 min" },
    { label: "Jejum", value: "8 horas" },
    { label: "Insuflação", value: "CO₂" },
    { label: "Laudo", value: "Mesmo dia" },
  ],
  sections: [
    {
      id: "o-que-e-a-colonoscopia",
      h2: "O que é a colonoscopia",
      blocks: [
        {
          type: "p",
          text: "A colonoscopia é um exame que permite ao médico examinar o interior de todo o intestino grosso (cólon) e, frequentemente, também o íleo terminal (final do intestino delgado). O exame é feito com um aparelho chamado colonoscópio — um tubo fino, flexível, com uma câmera de alta definição e uma fonte de luz na ponta. As imagens são transmitidas em tempo real para um monitor, permitindo avaliação detalhada da mucosa intestinal.",
        },
        {
          type: "p",
          text: "Diferentemente de outros exames de imagem (tomografia, ultrassom ou enema opaco), a colonoscopia combina diagnóstico com tratamento. Durante o mesmo procedimento, é possível coletar biópsias, remover pólipos e cauterizar pequenos pontos de sangramento — tudo sem uma segunda sedação e sem novas internações.",
        },
        {
          type: "p",
          text: "É, hoje, o exame de escolha para o rastreamento do câncer colorretal — segundo tumor mais diagnosticado no Brasil, segundo dados do INCA — e também para investigação de uma ampla gama de sintomas intestinais.",
        },
      ],
    },
    {
      id: "quando-a-colonoscopia-e-indicada",
      h2: "Quando a colonoscopia é indicada",
      blocks: [
        {
          type: "p",
          text: "A colonoscopia tem duas grandes frentes de indicação: como rastreamento preventivo em pessoas assintomáticas e como investigação diagnóstica em quem apresenta sintomas.",
        },
        {
          type: "p",
          text: "Atualmente, a recomendação das principais sociedades médicas é:",
        },
        {
          type: "callout",
          text: "Nossa recepção confere a cobertura do seu convênio, explica o preparo em detalhes e agenda o exame em até 7 dias úteis.",
        },
        {
          type: "ul",
          items: [
            "A partir dos 45 anos, para pessoas sem histórico familiar de câncer colorretal ou pólipos",
            "A partir dos 40 anos, ou 10 anos antes da idade do diagnóstico de um parente de primeiro grau — o que vier primeiro — para quem tem histórico familiar",
            "Em síndromes hereditárias (polipose familiar, Lynch), o rastreamento começa ainda mais cedo e segue protocolos específicos",
            "Pacientes com doença inflamatória intestinal (colite ulcerativa, doença de Crohn) fazem colonoscopias de vigilância periódica",
            "Sangue nas fezes (visível ou oculto) ou fezes escuras e com odor característico",
            "Mudança no hábito intestinal — alternância de diarreia e constipação, ou alteração persistente no padrão",
          ],
        },
      ],
    },
    {
      id: "por-que-co2",
      h2: "Por que usamos CO₂ em vez de ar: o diferencial Okazaki",
      blocks: [
        {
          type: "p",
          text: "Durante a colonoscopia, o intestino precisa ser insuflado para que suas paredes se afastem e o médico consiga examinar toda a mucosa. Tradicionalmente, clínicas utilizam ar ambiente para essa insuflação. O problema é que o ar permanece preso no intestino por horas após o exame, causando os desconfortos que muitos pacientes relatam como a pior parte da experiência: cólicas, sensação de inchaço abdominal e gases prolongados.",
        },
        {
          type: "p",
          text: "Na Clínica Okazaki, optamos pela insuflação com gás carbônico (CO₂). A diferença é técnica, mas o impacto para o paciente é imediato:",
        },
        {
          type: "callout",
          text: "Esse tipo de detalhe — que não aparece no folder de preços e é invisível para quem nunca fez um exame — é o que nos guia há quase quatro décadas. Tecnologia que não está a serviço do conforto do paciente não tem valor clínico real.",
        },
        {
          type: "ul",
          items: [
            "O CO₂ é absorvido pela mucosa intestinal em minutos e eliminado pela respiração — diferente do ar, que precisa ser expelido fisicamente",
            "A distensão abdominal no pós-exame é significativamente menor",
            "As cólicas são reduzidas ou simplesmente não aparecem",
            "A retomada da alimentação e das atividades normais é mais rápida e confortável",
            "Estudos mostram melhor adesão ao rastreamento preventivo em clínicas que usam CO₂, porque a experiência positiva favorece o retorno e a recomendação",
          ],
        },
      ],
    },
    {
      id: "como-e-feito-o-exame",
      h2: "Como é feito o exame na Clínica Okazaki",
      blocks: [
        {
          type: "p",
          text: "Você chega à clínica 30 minutos antes. A recepção confere documentos, pedido médico e autorização do convênio. A equipe de enfermagem pergunta sobre a qualidade do preparo nas horas anteriores — se as fezes ficaram claras e em forma de líquido transparente, o intestino está limpo o suficiente para o exame.",
        },
        {
          type: "p",
          text: "Na sala de preparo, você troca de roupa, coloca uma veia no antebraço e é avaliado pelo anestesista. O monitoramento de sinais vitais começa aqui e segue até a alta.",
        },
        {
          type: "p",
          text: "Deitado sobre o lado esquerdo, você recebe a sedação e dorme em segundos. O endoscopista então introduz o colonoscópio pelo reto e navega por toda a extensão do cólon — reto, sigmoide, cólon descendente, transverso, ascendente, ceco e, em geral, os últimos centímetros do íleo. A insuflação é feita com CO₂ e o exame é registrado em vídeo e imagens. Se forem identificados pólipos, na grande maioria dos casos são removidos no mesmo momento (polipectomia).",
        },
      ],
    },
    {
      id: "sedacao-por-anestesista",
      h2: "A sedação por anestesista: segurança em primeiro lugar",
      blocks: [
        {
          type: "p",
          text: "Toda colonoscopia na Clínica Okazaki é feita com sedação administrada por anestesiologista dedicado, que permanece presente desde o início até a recuperação completa do paciente. Essa decisão reflete nossa cultura de segurança e conforto:",
        },
        {
          type: "callout",
          text: "O resultado é que, na grande maioria dos casos, o paciente diz ao acordar: \"Já acabou? Nem senti.\"",
        },
        {
          type: "ul",
          items: [
            "A sedação tem ação ultrarrápida e recuperação veloz, com monitorização rigorosa durante todo o procedimento",
            "Um profissional dedicado apenas à sedação libera o endoscopista para se concentrar totalmente no exame",
            "Eventos adversos — queda de saturação, bradicardia, hipotensão — são detectados e tratados imediatamente",
            "O ajuste em tempo real evita tanto despertar durante o exame quanto sedação excessiva",
          ],
        },
      ],
    },
    {
      id: "preparo-etapa-importante",
      h2: "Preparo: a etapa mais importante do exame",
      blocks: [
        {
          type: "p",
          text: "O preparo intestinal é tão importante quanto o próprio exame. Um intestino mal preparado esconde pólipos, obriga à repetição do procedimento e aumenta o risco de complicações. Por isso, dedicamos atenção especial à orientação: você recebe o protocolo por escrito no agendamento e pode tirar dúvidas por telefone ou WhatsApp a qualquer momento nos dias anteriores.",
        },
        {
          type: "p",
          text: "Dieta pobre em fibras: evitar frutas com casca, verduras cruas, cereais integrais, sementes, castanhas, milho e pipoca. Alimentos permitidos incluem arroz branco, massas, batata sem casca, carnes magras, frango, peixe, pão branco e queijos brancos.",
        },
        {
          type: "p",
          text: "Dieta líquida a partir do almoço: caldos coados, gelatina (exceto vermelha e roxa), água de coco, chás claros, sucos coados sem polpa. À tarde ou à noite, conforme o horário agendado, você toma o laxante prescrito, diluído e fracionado ao longo de algumas horas.",
        },
      ],
    },
    {
      id: "polipos-e-polipectomia",
      h2: "Pólipos e polipectomia: diagnóstico que vira tratamento",
      blocks: [
        {
          type: "p",
          text: "Os pólipos intestinais são crescimentos anormais da mucosa do cólon. A grande maioria é benigna, mas alguns tipos (adenomas) podem evoluir lentamente para câncer ao longo de anos. A colonoscopia é o único exame capaz de encontrar esses pólipos ainda em fase pré-maligna e removê-los no mesmo ato.",
        },
        {
          type: "p",
          text: "A polipectomia é feita com alças metálicas, pinças ou cauterização, dependendo do tamanho e do tipo da lesão. O procedimento é indolor (paciente sedado), rápido e, na imensa maioria dos casos, interrompe a cadeia que levaria ao câncer colorretal. Os pólipos removidos são enviados ao laboratório de patologia para análise detalhada.",
        },
        {
          type: "p",
          text: "É essa combinação — rastrear + remover no mesmo exame — que torna a colonoscopia única entre os exames preventivos. Nenhum outro método permite, em uma só sessão, diagnosticar e tratar uma lesão pré-cancerosa.",
        },
      ],
    },
    {
      id: "prevencao-cancer-colorretal",
      h2: "Prevenção do câncer colorretal: por que começar aos 45 anos",
      blocks: [
        {
          type: "p",
          text: "O câncer colorretal é o segundo tumor maligno mais diagnosticado no Brasil e uma das principais causas de morte por câncer no país. A boa notícia é que, entre todos os tumores, é um dos mais preveníveis — desde que haja rastreamento em tempo adequado.",
        },
        {
          type: "p",
          text: "A evolução de um pólipo inofensivo até um câncer invasivo costuma levar de 7 a 15 anos. Essa janela é ampla o suficiente para que a colonoscopia periódica detecte e remova o pólipo muito antes que se torne perigoso. Na prática:",
        },
        {
          type: "p",
          text: "A recomendação atual é fazer a primeira colonoscopia aos 45 anos, ou antes em caso de histórico familiar. A frequência das repetições depende do que foi encontrado no primeiro exame — geralmente a cada 5 a 10 anos, se não houver alterações.",
        },
        {
          type: "ul",
          items: [
            "Entre pessoas rastreadas corretamente, a mortalidade por câncer colorretal cai drasticamente",
            "Casos descobertos em estágio inicial têm taxas de cura superiores a 90%",
            "Casos descobertos sintomáticos (geralmente em estágio avançado) têm prognóstico bem pior",
          ],
        },
      ],
    },
    {
      id: "recuperacao-pos-exame",
      h2: "Recuperação e orientações para o pós-exame",
      blocks: [
        {
          type: "p",
          text: "Graças ao CO₂ e à sedação curta administrada pelo anestesista, a recuperação da colonoscopia é geralmente tranquila. As orientações são essenciais nas 12 horas seguintes:",
        },
        {
          type: "ul",
          items: [
            "Não dirigir, trabalhar ou operar máquinas",
            "Não assinar documentos nem tomar decisões importantes",
            "Comparecer acompanhado por adulto responsável, que permanece na clínica durante o exame",
            "Começar a alimentação com líquidos e alimentos leves, progredindo conforme tolerância",
            "Evitar bebidas alcoólicas nas 24 horas seguintes",
            "Caso tenha havido polipectomia, seguir orientações específicas sobre dieta e atividade física pelos dias seguintes",
          ],
        },
      ],
    },
    {
      id: "riscos-e-complicacoes",
      h2: "Riscos e complicações: o que você precisa saber",
      blocks: [
        {
          type: "p",
          text: "A colonoscopia é um exame seguro quando realizada em ambiente adequado por equipe experiente. As complicações sérias ocorrem em menos de 1 em 1.000 exames diagnósticos e incluem:",
        },
        {
          type: "warning",
          text: "Dor abdominal intensa e progressiva, sangramento retal abundante, febre, náuseas e vômitos persistentes, ou falta de ar nas 72 horas após o exame. Ligue (81) 99954-0570 e dirija-se ao serviço de urgência mais próximo.",
        },
        {
          type: "ul",
          items: [
            "Sangramento: mais comum após polipectomia; geralmente autolimitado, excepcionalmente requer reintervenção",
            "Perfuração: muito rara; mais frequente em polipectomias complexas ou em pacientes com doença diverticular avançada",
            "Reações à sedação: monitoradas e tratadas em tempo real pelo anestesista",
            "Infecção: excepcional",
          ],
        },
      ],
    },
    {
      id: "onde-fazer-colonoscopia-recife",
      h2: "Onde fazer colonoscopia em Recife: unidades Okazaki",
      blocks: [
        {
          type: "p",
          text: "A colonoscopia é realizada nas duas unidades da Clínica Okazaki, ambas com o mesmo padrão de equipamentos, protocolos e equipe. A escolha fica a seu critério conforme a localização mais conveniente.",
        },
        {
          type: "p",
          text: "Empresarial Renato Dias · Av. Gov. Agamenon Magalhães, 4318, Sala 307 · Derby · CEP 52010-040. Sede histórica, com estrutura completa para endoscopia, colonoscopia e consultas especializadas.",
        },
        {
          type: "p",
          text: "Boa Viagem Medical Center — R. Visconde de Jequitinhonha, 1144, Sala 401. Unidade moderna na zona sul do Recife, com mesmo padrão técnico.",
        },
      ],
    },
    {
      id: "convenios-e-valores",
      h2: "Convênios e valores",
      blocks: [
        {
          type: "p",
          text: "Realizamos colonoscopia pelos principais convênios de Pernambuco: Unimed (Recife, Intercâmbio, Unirede), Sul América, Bradesco Saúde (unidade Derby), Amil, Select, Gama, AMEPE/CAMPE, CAPE Saúde, FACHESF, FISCO Saúde, TRT 6 e particular. Nossa recepção confirma a cobertura antes do agendamento. Ver lista completa de convênios →",
        },
        { type: "h3", text: "Colonoscopia particular" },
        {
          type: "p",
          text: "O valor varia conforme a necessidade de polipectomia, biópsias e o anestesista envolvido. Para orçamento personalizado, entre em contato pelo WhatsApp (81) 99954-0570 — informamos o valor atualizado e as condições de pagamento.",
        },
        {
          type: "callout",
          text: `Conforto no pós-exame com CO₂, sedação por anestesista e equipe com ${CLINIC_AGE} anos de experiência em Recife.`,
        },
      ],
    },
  ],
  faqs: [
    {
      q: "A partir de que idade devo fazer colonoscopia?",
      a: "A recomendação atual é iniciar o rastreamento aos 45 anos para pessoas sem histórico familiar. Com histórico familiar de pólipos ou câncer colorretal, o rastreamento começa aos 40 anos ou 10 anos antes da idade de diagnóstico do parente — o que vier primeiro.",
    },
    {
      q: "Qual a diferença da colonoscopia com CO₂?",
      a: "Usamos gás carbônico em vez de ar ambiente para insuflar o intestino. O CO₂ é absorvido em minutos pelo organismo, reduzindo cólicas, gases e inchaço no pós-exame. Na prática, o paciente retoma a rotina com muito mais conforto.",
    },
    {
      q: "Como é o preparo para colonoscopia?",
      a: "O preparo começa 2 a 3 dias antes com dieta pobre em fibras, evolui para dieta líquida no dia anterior e inclui um laxante prescrito. Na Clínica Okazaki você recebe orientação detalhada por escrito e pode tirar dúvidas por telefone ou WhatsApp a qualquer momento.",
    },
    {
      q: "A colonoscopia é feita com sedação?",
      a: "Sim. Todas as colonoscopias são realizadas com sedação administrada por anestesista dedicado — você dorme durante todo o procedimento e não sente dor nem desconforto.",
    },
    {
      q: "Quanto tempo dura uma colonoscopia?",
      a: "O exame em si dura de 20 a 40 minutos. Considerando chegada, sedação e recuperação, o tempo total na clínica é de 2 a 4 horas.",
    },
    {
      q: "Pólipos são retirados durante a colonoscopia?",
      a: "Sim. Na maioria dos casos, os pólipos encontrados são removidos no mesmo momento (polipectomia). Isso transforma o exame preventivo em ato terapêutico: você entra para rastrear e sai com o pólipo já removido.",
    },
    {
      q: "Colonoscopia detecta câncer de intestino?",
      a: "Sim. É o exame padrão-ouro para rastreamento e diagnóstico do câncer colorretal. Mais importante: permite remover pólipos pré-cancerosos, prevenindo o câncer antes dele aparecer.",
    },
    {
      q: "Posso fazer endoscopia e colonoscopia no mesmo dia?",
      a: "Sim. É muito comum realizar os dois exames na mesma sessão, com uma única sedação. Reduz o tempo de preparo, o número de visitas e o custo total.",
    },
    {
      q: "Quais convênios cobrem colonoscopia na Clínica Okazaki?",
      a: "Unimed (Recife, Intercâmbio, Unirede), Sul América, Bradesco Saúde (unidade Derby), Amil, Select, Gama, AMEPE/CAMPE, CAPE Saúde, Conab, FACHESF, FISCO Saúde, Mediservice, Petrobras, TRT 6 e particular. Confirme na recepção antes do agendamento.",
    },
  ],
};

export default colonoscopia;
