import { CLINIC_AGE } from "../lib/constants";
import type { PageContent } from "./types";

const endoscopia: PageContent = {
  slug: "endoscopia",
  title: "Endoscopia Digestiva Alta em Recife com Sedação | Clínica Okazaki",
  description:
    `Endoscopia digestiva alta em Recife com sedação por anestesista e Olympus EVIS X1. Clínica Okazaki: ${CLINIC_AGE} anos, laudo no mesmo dia. Agende.`,
  keywords:
    "endoscopia recife, endoscopia digestiva alta recife, endoscopia com sedação, endoscopia boa viagem, endoscopia derby, quanto custa endoscopia recife, onde fazer endoscopia recife, endoscopia unimed re",
  h1: "Endoscopia Digestiva Alta em Recife: exame com sedação e alta definição",
  lead:
    "A endoscopia digestiva alta é o exame que avalia o esôfago, o estômago e o duodeno com uma câmera de alta resolução. Na Clínica Okazaki, o procedimento é realizado com sedação administrada por anestesista dedicado e endoscópios Olympus EVIS X1, em duas unidades de Recife.",
  eyebrow: "EXAME · ENDOSCOPIA",
  breadcrumbLabel: "Endoscopia",
  about: "Endoscopia Digestiva Alta",
  metaChips: [
    { label: "Duração", value: "5-10 min" },
    { label: "Jejum", value: "8 horas" },
    { label: "Sedação", value: "Anestesista dedicado" },
    { label: "Laudo", value: "Mesmo dia" },
  ],
  sections: [
    {
      id: "o-que-e-a-endoscopia",
      h2: "O que é a endoscopia digestiva alta",
      blocks: [
        {
          type: "p",
          text: "A endoscopia digestiva alta, também chamada de esofagogastroduodenoscopia (EDA), é um exame que permite ao médico visualizar diretamente o interior do esôfago, do estômago e da primeira porção do intestino delgado (duodeno). O procedimento é feito com um aparelho chamado endoscópio — um tubo fino e flexível que contém uma câmera de alta definição e uma fonte de luz na ponta.",
        },
        {
          type: "p",
          text: "As imagens captadas são exibidas em tempo real em um monitor, o que permite ao endoscopista identificar lesões da mucosa, inflamações, úlceras, pólipos, varizes, hérnias e sinais precoces de câncer. Durante o exame, se necessário, também é possível coletar fragmentos de tecido (biópsias) para análise no laboratório, remover pólipos pequenos ou pesquisar a bactéria Helicobacter pylori.",
        },
        {
          type: "p",
          text: "A endoscopia é considerada o exame padrão-ouro para o diagnóstico de doenças do trato digestivo superior porque combina visualização direta com capacidade de intervenção — nenhum exame de imagem (ultrassom, tomografia ou ressonância) oferece esse nível de precisão para a avaliação da mucosa.",
        },
      ],
    },
    {
      id: "quando-a-endoscopia-e-indicada",
      h2: "Quando a endoscopia é indicada",
      blocks: [
        {
          type: "p",
          text: "A endoscopia digestiva alta pode ser solicitada em duas situações principais: diante de sintomas digestivos persistentes ou como parte de um rastreamento preventivo em grupos de risco.",
        },
        {
          type: "p",
          text: "Mesmo sem sintomas, a endoscopia pode ser recomendada para pessoas com fatores de risco aumentados para câncer gástrico ou de esôfago:",
        },
        {
          type: "callout",
          text: "A decisão sobre a indicação e a frequência ideal é sempre individual e deve ser tomada em conjunto com um gastroenterologista ou endoscopista.",
        },
        {
          type: "ul",
          items: [
            "Dor ou queimação no estômago (epigastralgia) que não melhora com medicação simples",
            "Azia ou refluxo frequente, principalmente quando associado a tosse noturna ou rouquidão",
            "Dificuldade ou dor para engolir (disfagia ou odinofagia)",
            "Náuseas e vômitos persistentes, especialmente se há vômitos com sangue",
            "Sangramento digestivo, identificado por fezes escuras (melena) ou anemia sem causa aparente",
            "Perda de peso involuntária acompanhada de sintomas digestivos",
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
          text: "O dia da endoscopia segue um fluxo padronizado nas duas unidades da Clínica Okazaki, com foco em segurança, conforto e pontualidade. Entenda o passo a passo do procedimento:",
        },
        {
          type: "p",
          text: "Você chega à clínica 30 minutos antes do horário agendado. A recepção confere seus documentos, pedido médico, autorização do convênio e assinatura do termo de consentimento informado. Nesse momento, também confirmamos a lista de medicamentos em uso e possíveis alergias.",
        },
        {
          type: "p",
          text: "Na sala de preparo, você troca de roupa. Na sala de exames, é puncionada uma veia para a medicação e realizada avaliação do anestesista. Sinais vitais (pressão, saturação de oxigênio e frequência cardíaca) são monitorados continuamente a partir deste momento.",
        },
      ],
    },
    {
      id: "sedacao-por-anestesista",
      h2: "A sedação por anestesista: por que fazemos assim",
      blocks: [
        {
          type: "p",
          text: "Todas as endoscopias da Clínica Okazaki são realizadas com sedação administrada por um anestesiologista dedicado, presente do início ao fim do procedimento. Essa escolha traz três vantagens diretas para o paciente:",
        },
        {
          type: "callout",
          text: "A sedação tem ação rápida: você dorme em segundos e desperta sem a sensação de ressaca típica de sedações mais antigas.",
        },
        {
          type: "ul",
          items: [
            "Segurança: um médico exclusivamente focado em monitorar a respiração, circulação e profundidade da sedação reduz drasticamente o risco de eventos adversos;",
            "Conforto: o ajuste da dose em tempo real garante que você não acorde durante o exame nem permaneça sedado além do necessário;",
            "Qualidade do exame: com o paciente bem sedado, o endoscopista consegue examinar a mucosa com calma e coletar biópsias com precisão, sem pressa imposta por movimentação do paciente.",
          ],
        },
      ],
    },
    {
      id: "equipamentos-e-tecnologia",
      h2: "Equipamentos e tecnologia: por que a diferença importa",
      blocks: [
        {
          type: "p",
          text: "O diagnóstico precoce de lesões gástricas depende da capacidade do aparelho de revelar alterações milimétricas da mucosa. Na Clínica Okazaki utilizamos endoscópios da linha Olympus EVIS X1, a geração mais recente da fabricante japonesa — líder mundial em endoscopia digestiva.",
        },
        {
          type: "p",
          text: "Entre as tecnologias embarcadas no sistema EVIS X1, destacam-se:",
        },
        {
          type: "callout",
          text: "Na prática, isso significa mais chances de detectar lesões em estágio precoce, quando o tratamento é mais simples e as taxas de cura são muito mais altas.",
        },
        {
          type: "ul",
          items: [
            "EDOF (Extended Depth of Field): mantém toda a imagem em foco mesmo em zoom, eliminando áreas borradas;",
            "TXI (Texture and Color Enhancement Imaging): realça variações sutis de cor e textura que indicam inflamação ou lesão precoce;",
            "NBI (Narrow Band Imaging): luz especial que destaca os vasos da mucosa, ajudando na identificação de lesões neoplásicas em estágio inicial;",
            "RDI (Red Dichromatic Imaging): visualização aprimorada de vasos profundos, útil em casos de sangramento.",
          ],
        },
      ],
    },
    {
      id: "preparo-corretamente",
      h2: "Como fazer o preparo corretamente",
      blocks: [
        {
          type: "p",
          text: "O preparo da endoscopia digestiva alta é simples comparado ao da colonoscopia, mas exige atenção ao jejum. Falhas no preparo são a principal causa de cancelamento no dia do exame.",
        },
        {
          type: "warning",
          text: "8 horas para alimentos sólidos e líquidos com resíduo (leite, café com leite, sucos com polpa) · 4 horas para líquidos claros (água, água de coco natural coada). Sem jejum adequado, o exame é remarcado por risco de aspiração pulmonar durante a sedação.",
        },
        {
          type: "p",
          text: "Medicamentos de pressão arterial, doenças da tireoide, antidepressivos e remédios para convulsão devem ser tomados normalmente com um pequeno gole de água, mesmo em jejum — salvo orientação médica em contrário. Medicamentos para diabetes (hipoglicemiantes orais e insulina) precisam ser ajustados por causa do jejum; converse com seu médico.",
        },
        {
          type: "warning",
          text: "Medicamentos para perda de peso ou controle glicêmico da classe GLP-1 — como Ozempic, Wegovy, Mounjaro, Zepbound, Saxenda, Victoza, Trulicity, Rybelsus e similares — retardam o esvaziamento gástrico e aumentam o risco de broncoaspiração durante a sedação. É obrigatório suspendê-los antes do exame. Ao agendar, você recebe as orientações detalhadas sobre quando suspender.",
        },
        {
          type: "warning",
          text: "Anticoagulantes (varfarina/Marevan, rivaroxabana/Xarelto, apixabana/Eliquis, dabigatrana/Pradaxa) e antiagregantes plaquetários (AAS/Aspirina, clopidogrel/Plavix, ticagrelor/Brilinta) precisam ser suspensos antes do exame — mas somente com o aval do médico assistente que acompanha você. Nunca suspenda por conta própria.",
        },
      ],
    },
    {
      id: "recuperacao-pos-exame",
      h2: "Recuperação e pós-exame",
      blocks: [
        {
          type: "p",
          text: "A recuperação da endoscopia é rápida, mas os efeitos da sedação persistem por algumas horas. As orientações abaixo são obrigatórias para as 12 horas seguintes ao exame:",
        },
        {
          type: "p",
          text: "A alimentação pode ser retomada logo após a liberação, começando por líquidos e progredindo para alimentos leves. Pode haver leve desconforto na garganta ou sensação de gases, que desaparecem em poucas horas.",
        },
        {
          type: "ul",
          items: [
            "Não dirigir nem operar máquinas",
            "Não trabalhar, principalmente em atividades que exijam concentração",
            "Não assinar documentos importantes nem tomar decisões com consequências legais ou financeiras",
            "Comparecer acompanhado por um adulto responsável que permaneça na clínica durante o exame",
            "Evitar bebida alcoólica nas 24 horas seguintes",
          ],
        },
      ],
    },
    {
      id: "riscos-e-quando-procurar-ajuda",
      h2: "Riscos e quando procurar ajuda",
      blocks: [
        {
          type: "p",
          text: "A endoscopia digestiva alta é um exame extremamente seguro quando realizada em ambiente adequado por equipe experiente. As complicações sérias são raras — ocorrem em menos de 1 em cada 1.000 procedimentos — e incluem:",
        },
        {
          type: "warning",
          text: "Dor intensa no peito ou abdome, febre, vômitos com sangue, fezes muito escuras, falta de ar ou dificuldade para respirar nas 48 horas após o exame. Ligue (81) 99954-0570 e dirija-se ao serviço de urgência mais próximo.",
        },
        {
          type: "ul",
          items: [
            "Reações à sedação (monitoradas pelo anestesista)",
            "Sangramento após biópsia ou polipectomia (geralmente autolimitado)",
            "Perfuração da parede do trato digestivo (rara, sobretudo em exames diagnósticos)",
            "Infecção (excepcional)",
          ],
        },
      ],
    },
    {
      id: "biopsia-helicobacter-pylori",
      h2: "Biópsia e pesquisa de Helicobacter pylori",
      blocks: [
        {
          type: "p",
          text: "A bactéria Helicobacter pylori é reconhecida como principal causa de gastrite crônica, úlcera péptica e fator de risco para câncer gástrico. A endoscopia permite pesquisar a presença da bactéria de duas formas:",
        },
        {
          type: "p",
          text: "Em casos selecionados, o endoscopista também pode optar por biópsia de lesões visíveis — pólipos, áreas de inflamação atípica, úlceras suspeitas — que são analisadas no laboratório para confirmar ou afastar malignidade. Todas essas coletas são indolores e feitas durante a sedação.",
        },
        {
          type: "ul",
          items: [
            "Teste da urease: um fragmento da mucosa gástrica é colocado em um reagente durante o próprio exame. O resultado sai em minutos e tem boa acurácia.",
            "Histopatológico: fragmentos enviados ao laboratório de patologia, com resultado mais detalhado, em 7 a 14 dias.",
          ],
        },
      ],
    },
    {
      id: "onde-fazer-endoscopia-recife",
      h2: "Onde fazer endoscopia em Recife: unidades Okazaki",
      blocks: [
        {
          type: "p",
          text: "A Clínica Okazaki realiza endoscopia digestiva alta em duas unidades, ambas com o mesmo padrão de tecnologia, equipe e protocolos de segurança. A escolha da unidade cabe a você, de acordo com a localização mais conveniente.",
        },
        {
          type: "p",
          text: "Empresarial Renato Dias — Av. Gov. Agamenon Magalhães, 4318, Sala 307, Derby. Sede histórica, com estrutura completa para endoscopia, colonoscopia e consultas em gastroenterologia, hepatologia, geriatria e cirurgia geral.",
        },
        {
          type: "p",
          text: "Boa Viagem Medical Center — R. Visconde de Jequitinhonha, 1144, Sala 401, Boa Viagem. Unidade moderna, com mesmo padrão técnico da sede, atendendo toda a zona sul do Recife.",
        },
      ],
    },
    {
      id: "convenios-e-valores",
      h2: "Convênios aceitos e endoscopia particular",
      blocks: [
        {
          type: "p",
          text: "A Clínica Okazaki realiza endoscopia digestiva alta pelos principais convênios de Pernambuco: Unimed (Recife, Intercâmbio e Unirede), Sul América, Bradesco Saúde (unidade Derby), Amil, Select, Gama, AMEPE/CAMPE, CAPE Saúde, Conab, FACHESF, FISCO Saúde, Mediservice, Petrobras e TRT 6, além de atendimento particular.",
        },
        {
          type: "p",
          text: "Antes do agendamento, nossa recepção confere a cobertura do seu plano para a unidade escolhida. Ver a lista completa de convênios aceitos →",
        },
        { type: "h3", text: "Valor da endoscopia particular" },
        {
          type: "p",
          text: "O valor da endoscopia particular varia conforme a necessidade de biópsia, sedação e pesquisa de H. pylori. Para um orçamento personalizado, entre em contato pelo WhatsApp (81) 99954-0570 — informamos o valor atualizado e condições de pagamento.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "Quanto tempo dura uma endoscopia digestiva alta?",
      a: "A endoscopia em si dura cerca de 10 minutos. Considerando preparo, sedação e recuperação, o tempo total na clínica é de 1 a 2 horas.",
    },
    {
      q: "A endoscopia com sedação dói?",
      a: "Não. Com a sedação administrada por anestesista dedicado, você dorme durante todo o procedimento e não sente dor nem desconforto. Ao acordar, pode haver leve sensação na garganta que passa em poucas horas.",
    },
    {
      q: "É obrigatório jejum para endoscopia?",
      a: "Sim. Jejum absoluto: 8 horas para sólidos e 4 horas para líquidos claros (água). Sem o jejum adequado o exame é remarcado por risco de aspiração pulmonar.",
    },
    {
      q: "Posso voltar sozinho para casa depois da endoscopia?",
      a: "Não. Como o exame é feito com sedação, você não pode dirigir, trabalhar nem tomar decisões importantes nas 12 horas seguintes. É obrigatório comparecer acompanhado de um adulto responsável.",
    },
    {
      q: "Quando receberei o resultado?",
      a: "O laudo da endoscopia é entregue no mesmo dia, antes da sua saída da clínica. Se houver biópsia, o resultado histopatológico leva de 7 a 14 dias úteis.",
    },
    {
      q: "Endoscopia detecta câncer de estômago?",
      a: "Sim. A endoscopia digestiva alta é o exame padrão-ouro para detectar lesões do esôfago, estômago e duodeno, incluindo câncer precoce. Com os endoscópios Olympus EVIS X1 utilizados na Clínica Okazaki, é possível identificar alterações milimétricas da mucosa.",
    },
    {
      q: "Posso fazer endoscopia e colonoscopia no mesmo dia?",
      a: "Sim. É comum realizar os dois exames na mesma sessão, com uma única sedação. Isso reduz o tempo total de preparo, número de visitas à clínica e custo global. Converse com seu médico sobre essa possibilidade.",
    },
    {
      q: "Gestantes podem fazer endoscopia?",
      a: "Sim, em casos selecionados. A endoscopia em gestantes deve ser indicada apenas quando o benefício supera os riscos e realizada preferencialmente no segundo trimestre. A decisão é individualizada junto ao obstetra.",
    },
    {
      q: "Quais convênios cobrem endoscopia na Clínica Okazaki?",
      a: "Unimed (Recife, Intercâmbio e Unirede), Sul América, Bradesco Saúde (unidade Derby), Amil, Select, Gama, AMEPE/CAMPE, CAPE Saúde, Conab, FACHESF, FISCO Saúde, Mediservice, Petrobras, TRT 6 e particular. Confirme a cobertura do seu plano na recepção antes do agendamento.",
    },
  ],
};

export default endoscopia;
