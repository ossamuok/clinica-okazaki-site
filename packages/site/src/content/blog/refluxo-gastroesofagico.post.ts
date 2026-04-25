import type { BlogPost } from "./types";

export const post: BlogPost = {
  slug: "refluxo-gastroesofagico",
  pillar: "gastroenterologia",
  title:
    "Refluxo Gastroesofágico em Recife: Sintomas, Diagnóstico e Tratamento",
  description:
    "Refluxo gastroesofágico em Recife: o que é, sintomas, quando é DRGE, diagnóstico por endoscopia e tratamento. Avaliação com gastroenterologista na Clínica Okazaki.",
  keywords:
    "refluxo gastroesofágico recife, drge recife, refluxo sintomas, esofagite, gastroenterologista recife, endoscopia recife, h. pylori",
  h1: "Refluxo gastroesofágico: o que é, sintomas e tratamento em Recife",
  lead:
    "Refluxo gastroesofágico é o retorno do conteúdo do estômago para o esôfago. Quando ocorre com frequência ou causa lesão na mucosa, configura DRGE — Doença do Refluxo Gastroesofágico — e exige investigação com gastroenterologista. Neste artigo, explicamos sintomas, exames e opções de tratamento.",
  eyebrow: "BLOG · GASTROENTEROLOGIA",
  breadcrumbLabel: "Refluxo gastroesofágico",
  about: "Refluxo Gastroesofágico",
  excerpt:
    "Quando azia frequente vira DRGE, como o gastroenterologista investiga e o que esperar do tratamento — guia direto para pacientes em Recife.",
  publishedAt: "2026-04-25T12:00:00Z",
  updatedAt: "2026-04-25T12:00:00Z",
  author: {
    name: "Dra. Jane Erika Frazão Okazaki",
    crm: "CRM-PE 19872",
    rqe: "RQE 17633",
    photo: "/assets/team/jane.webp",
    bio: "Médica geriatra do Centro Clínico Okazaki, responsável pela revisão clínica do conteúdo deste blog.",
  },
  sections: [
    {
      id: "o-que-e-refluxo",
      h2: "O que é refluxo gastroesofágico",
      blocks: [
        {
          type: "p",
          text: "O refluxo gastroesofágico ocorre quando o conteúdo ácido do estômago retorna para o esôfago, causando irritação da mucosa. Episódios eventuais de refluxo são fisiológicos e acontecem em pessoas saudáveis — principalmente após refeições volumosas ou ao deitar logo depois de comer.",
        },
        {
          type: "p",
          text: "O problema aparece quando esses episódios se tornam frequentes, intensos ou começam a causar lesões. A partir desse ponto, falamos em DRGE (Doença do Refluxo Gastroesofágico), uma das condições mais comuns na prática gastroenterológica.",
        },
        {
          type: "callout",
          text: "Refluxo ocasional ≠ DRGE. A diferença é frequência, intensidade e impacto na qualidade de vida.",
        },
      ],
    },
    {
      id: "sintomas",
      h2: "Sintomas do refluxo e quando suspeitar de DRGE",
      blocks: [
        {
          type: "p",
          text: "Os sintomas típicos são azia (queimação retroesternal) e regurgitação ácida. Procure avaliação com gastroenterologista quando os sintomas:",
        },
        {
          type: "ul",
          items: [
            "Acontecem mais de duas vezes por semana",
            "Pioram à noite ou ao deitar",
            "Persistem por mais de 4 a 6 semanas",
            "Causam dor torácica, tosse crônica ou rouquidão sem causa pulmonar",
            "Pioram ao engolir (disfagia)",
            "Ocorrem com perda de peso, anemia ou sangramento digestivo",
          ],
        },
        {
          type: "warning",
          text: "Sinais de alarme — disfagia, perda de peso, anemia, sangramento — exigem investigação imediata com endoscopia. Não trate por conta própria.",
        },
      ],
    },
    {
      id: "diagnostico",
      h2: "Como é feito o diagnóstico",
      blocks: [
        {
          type: "p",
          text: "Em muitos casos, o diagnóstico é clínico — baseado nos sintomas característicos. A endoscopia digestiva alta entra como exame chave em três cenários:",
        },
        {
          type: "ul",
          items: [
            "Sintomas com sinais de alarme",
            "Sintomas que não melhoram após teste terapêutico com inibidor de bomba de prótons",
            "Pacientes com mais de 45-50 anos sem investigação prévia",
          ],
        },
        {
          type: "p",
          text: "A endoscopia permite visualizar diretamente o esôfago e identificar esofagite, hérnia de hiato, esôfago de Barrett e outras alterações. Também é o momento ideal para pesquisar H. pylori e excluir outras causas de sintomas similares.",
        },
        {
          type: "link",
          href: "/endoscopia",
          label: "Saiba mais sobre endoscopia digestiva alta",
        },
        {
          type: "p",
          text: "Em casos selecionados, o gastroenterologista pode solicitar pHmetria de 24 horas ou impedanciometria — exames mais especializados para quantificar o refluxo quando o quadro clínico é atípico.",
        },
      ],
    },
    {
      id: "tratamento",
      h2: "Tratamento do refluxo gastroesofágico",
      blocks: [
        {
          type: "p",
          text: "O tratamento combina três pilares: medidas comportamentais, medicação e — quando indicado — cirurgia. A grande maioria dos pacientes responde bem aos dois primeiros.",
        },
        {
          type: "h3",
          text: "Medidas comportamentais",
        },
        {
          type: "ul",
          items: [
            "Elevar a cabeceira da cama em 15-20 cm",
            "Evitar deitar nas 2-3 horas após refeições",
            "Reduzir refeições volumosas, fracionar em porções menores",
            "Reduzir café, chocolate, alimentos gordurosos, bebidas alcoólicas e cigarro",
            "Perder peso quando há sobrepeso (efeito comprovado)",
          ],
        },
        {
          type: "h3",
          text: "Medicação",
        },
        {
          type: "p",
          text: "Os inibidores de bomba de prótons (omeprazol, pantoprazol, esomeprazol) são a primeira linha. A duração e a dose são individualizadas pelo gastroenterologista de acordo com gravidade dos sintomas e achados endoscópicos.",
        },
        {
          type: "h3",
          text: "Cirurgia",
        },
        {
          type: "p",
          text: "A fundoplicatura (cirurgia de Nissen) é reservada para casos graves, refratários à medicação, com complicações ou em pacientes que não desejam manter medicação por longo prazo. A indicação é sempre individualizada.",
        },
        {
          type: "inline-cta",
          text: "Convive com refluxo há semanas? Marque consulta com nossa gastroenterologia.",
          label: "Agendar consulta",
        },
      ],
    },
    {
      id: "complicacoes",
      h2: "Complicações da DRGE não tratada",
      blocks: [
        {
          type: "p",
          text: "DRGE não tratada pode evoluir para esofagite erosiva, estenose péptica (estreitamento do esôfago) e esôfago de Barrett — condição em que a mucosa do esôfago muda em resposta ao ácido crônico. Esôfago de Barrett aumenta o risco de adenocarcinoma de esôfago e exige acompanhamento endoscópico regular.",
        },
        {
          type: "p",
          text: "Por isso, sintomas de refluxo persistentes nunca devem ser ignorados. Investigação adequada com endoscopia, quando indicada, faz a diferença entre tratar uma condição comum e benigna versus deixar evoluir uma complicação séria.",
        },
        {
          type: "link",
          href: "/gastroenterologia",
          label: "Conheça a consulta em gastroenterologia",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "Quanto tempo dura o tratamento de refluxo?",
      a: "Varia. Muitos pacientes melhoram em 4 a 8 semanas com inibidor de bomba de prótons + medidas comportamentais. Casos com esofagite ou DRGE de longa data podem precisar de tratamento prolongado e reavaliação periódica.",
    },
    {
      q: "Refluxo causa câncer?",
      a: "DRGE não tratada por longo prazo aumenta o risco de esôfago de Barrett, condição associada a adenocarcinoma de esôfago. Tratamento adequado e acompanhamento endoscópico, quando indicado, reduzem esse risco.",
    },
    {
      q: "Posso tomar omeprazol sem prescrição?",
      a: "Para sintomas isolados e ocasionais, o uso de curto prazo é seguro. Sintomas frequentes ou persistentes exigem avaliação médica — automedicação prolongada pode mascarar diagnósticos importantes.",
    },
    {
      q: "Refluxo silencioso existe?",
      a: "Sim. Algumas pessoas têm refluxo sem azia clássica, manifestando apenas tosse crônica, rouquidão, pigarro ou sensação de bolo na garganta. O gastroenterologista investiga essas apresentações atípicas.",
    },
    {
      q: "Faço endoscopia em jejum?",
      a: "Sim. Jejum de 8 horas para sólidos e 4 horas para líquidos claros antes do exame. Detalhes do preparo são entregues no agendamento.",
    },
  ],
};
