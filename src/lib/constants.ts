export const SITE = {
  name: "Centro Clínico Okazaki",
  shortName: "Clínica Okazaki",
  url: "https://www.clinicaokazaki.com",
  description:
    "Endoscopia, colonoscopia e gastroenterologia em Recife há 38 anos. Sedação por anestesista, Olympus EVIS X1, duas unidades (Derby e Boa Viagem).",
  foundingYear: 1987,
  age: 38,
  reviewsCount: 2500,
  rating: 5.0,
  instagram: "https://www.instagram.com/centro_clinico_okazaki/",
  tecnico: {
    nome: "Dr. Ossamu Okazaki",
    crm: "CRM-PE 19246",
    rqe: "RQE 8449",
  },
} as const;

export const PHONE_DISPLAY = "(81) 99954-0570";
export const PHONE_LINK = "tel:+5581999540570";

export const WHATSAPP_NUMBER = "5581999540570";
export const WHATSAPP_URL =
  "https://api.whatsapp.com/send?phone=5581999540570&text=" +
  encodeURIComponent("Olá, gostaria de agendar um exame");

export const HOURS = {
  weekdays: "Segunda a sexta · 7h30 às 18h",
  saturday: "Sábado · 8h às 12h",
  short: "Seg–Sex 7h30–18h · Sáb 8h–12h",
};

export type Unit = {
  slug: "derby" | "boa-viagem";
  name: string;
  building: string;
  address: string;
  cep: string;
  district: string;
  phones: string[];
  mapsUrl: string;
  mapsEmbed: string;
  geo: { lat: number; lng: number };
};

export const UNITS: Unit[] = [
  {
    slug: "derby",
    name: "Unidade Derby",
    building: "Empresarial Renato Dias",
    address: "Av. Gov. Agamenon Magalhães, 4318, Sala 307",
    cep: "52010-040",
    district: "Derby, Recife — PE",
    phones: ["(81) 3221-4795", "(81) 3132-2972"],
    mapsUrl: "https://maps.app.goo.gl/jxM9VbSXHzOttaN6R",
    mapsEmbed:
      "https://www.google.com/maps?q=Empresarial+Renato+Dias+Av+Gov+Agamenon+Magalhaes+4318+Recife&output=embed",
    geo: { lat: -8.0504, lng: -34.8997 },
  },
  {
    slug: "boa-viagem",
    name: "Unidade Boa Viagem",
    building: "Boa Viagem Medical Center",
    address: "R. Visconde de Jequitinhonha, 1144, Sala 401",
    cep: "51130-020",
    district: "Boa Viagem, Recife — PE",
    phones: ["(81) 2129-1405", "(81) 2129-1406"],
    mapsUrl: "https://maps.app.goo.gl/dq7LZaFR5F98UQHEn",
    mapsEmbed:
      "https://www.google.com/maps?q=Boa+Viagem+Medical+Center+Rua+Visconde+de+Jequitinhonha+1144+Recife&output=embed",
    geo: { lat: -8.1177, lng: -34.8978 },
  },
];

export type Insurance = {
  name: string;
  coverage: string;
};

export const INSURANCES: Insurance[] = [
  { name: "Amil", coverage: "Somente exames" },
  { name: "AMEPE / CAMPE", coverage: "Exames e consultas" },
  { name: "Bradesco Saúde", coverage: "Derby · exames e consultas" },
  { name: "CAPE Saúde", coverage: "Exames e consultas" },
  { name: "Conab", coverage: "Exames e consultas" },
  { name: "FACHESF", coverage: "Exames e consultas" },
  { name: "FISCO Saúde", coverage: "Exames e consultas" },
  { name: "Gama Saúde", coverage: "Exames e consultas" },
  { name: "Mediservice", coverage: "Exames e consultas" },
  { name: "Particular", coverage: "Exames e consultas" },
  { name: "Petrobras", coverage: "Exames e consultas" },
  { name: "Select", coverage: "Exames e consultas" },
  { name: "Sul América", coverage: "Exames e consultas" },
  { name: "TRT 6", coverage: "Exames e consultas" },
  { name: "Unimed", coverage: "Recife, Intercâmbio e Unirede" },
];

export type Review = {
  text: string;
  author: string;
  unit: "Boa Viagem" | "Derby";
  source: "Google";
};

export const REVIEWS: Review[] = [
  {
    author: "Ana C.",
    text:
      "Super indico, atendimento altamente humanizado. Profissionais comprometidos e muito educados! Fui super bem atendida. Agradeço a todos os funcionários pela simpatia e eficiência.",
    unit: "Boa Viagem",
    source: "Google",
  },
  {
    author: "Fernanda M.",
    text:
      "Foi maravilhoso, pessoas maravilhosas e super atenciosas. Toda a equipe médica foi super atenciosa e me passou total tranquilidade. Recomendo de olhos fechados!",
    unit: "Boa Viagem",
    source: "Google",
  },
  {
    author: "Patrícia L.",
    text:
      "Atendimento excelente, sem nenhum ponto negativo. Desde o atendimento na recepção, passando pelo cuidado por e-mail e WhatsApp, até o procedimento — só tenho elogios e gratidão.",
    unit: "Boa Viagem",
    source: "Google",
  },
  {
    author: "Roberto A.",
    text:
      "Atendimento fora do normal, as secretárias são extremamente competentes, sempre com um sorriso no rosto e prontas para melhor atender os pacientes. Parabéns a todos que fazem o Centro Clínico Okazaki!",
    unit: "Derby",
    source: "Google",
  },
  {
    author: "Carolina B.",
    text:
      "Clínica diferenciada, sem igual! A estrutura é excelente, o atendimento é impecável do início ao fim e os equipamentos são de última geração. Voltarei sempre que precisar.",
    unit: "Derby",
    source: "Google",
  },
  {
    author: "Juliana S.",
    text:
      "Atendimento excelente, foi no horário, funcionários super educados e atentos. Explicam todo o procedimento. Super indico!",
    unit: "Boa Viagem",
    source: "Google",
  },
];

export type Formation = {
  label: string;
  institution: string;
};

export type Doctor = {
  name: string;
  role?: string;
  specialty: string;
  crm?: string;
  rqe?: string;
  photo?: string;
  formation?: Formation[];
  founder?: boolean;
};

export const TEAM: Doctor[] = [
  {
    name: "Dr. Masaichi Okazaki",
    role: "Fundador",
    specialty: "Gastroenterologia · Endoscopia",
    crm: "CRM-PE 4764",
    founder: true,
  },
  {
    name: "Dra. Mitsu Okazaki",
    role: "Fundadora",
    specialty: "Gastroenterologia",
    crm: "CRM-PE 6616",
    founder: true,
  },
  {
    name: "Dr. Ossamu Okazaki",
    role: "Diretor Técnico",
    specialty: "Endoscopia Digestiva · Oncológica",
    crm: "CRM-PE 19246",
    rqe: "8449",
    founder: true,
    formation: [
      { label: "Endoscopia Digestiva", institution: "HC-USP" },
      { label: "Endoscopia Oncológica", institution: "ICESP-USP" },
      { label: "Fellow em Endoscopia Digestiva", institution: "Juntendo University Tokyo" },
    ],
  },
  {
    name: "Dra. Ana Beatriz Portela",
    specialty: "Gastroenterologia",
  },
  {
    name: "Dra. Aya Angelica Sakaguchi",
    specialty: "Endoscopia",
    crm: "CRM-PE 10701",
  },
  {
    name: "Dr. Carlos Esdras Almeida Moraes",
    specialty: "Cirurgia do Aparelho Digestivo",
    crm: "CRM-PE 19242",
    rqe: "13822",
    photo: "/assets/team/carlos.jpg",
    formation: [
      { label: "Cirurgia Geral", institution: "HOF-PE" },
      { label: "Cirurgia do Aparelho Digestivo", institution: "HGV-PE" },
    ],
  },
  {
    name: "Dr. Guilherme Pompílio Paranhos",
    specialty: "Gastroenterologia",
    crm: "CRM-PE 26215",
  },
  {
    name: "Dr. Henrique Sivini de Farias",
    specialty: "Gastroenterologia · Endoscopia",
    crm: "CRM-PE 24079",
  },
  {
    name: "Dra. Ingrid Laís Vieira Rodrigues",
    specialty: "Gastrohepatologia",
    crm: "CRM-PE 24689",
    rqe: "13385",
    photo: "/assets/team/ingrid.jpg",
    formation: [
      { label: "Gastrohepatologia", institution: "HUOC-UPE" },
      { label: "Clínica Médica", institution: "Hospital Maria Lucinda" },
      { label: "Pós-grad. em Cuidados Paliativos", institution: "UPE" },
    ],
  },
  {
    name: "Dra. Isabela Aquino",
    specialty: "Gastroenterologia · Endoscopia",
  },
  {
    name: "Dra. Jane Erika Frazão Okazaki",
    specialty: "Geriatria",
    crm: "CRM-PE 19351",
    rqe: "8791",
    photo: "/assets/team/jane.jpg",
    formation: [
      { label: "Geriatria", institution: "UNIFESP" },
      { label: "Mestrado em Saúde", institution: "UNIFESP" },
      { label: "Pesquisa Clínica — PPCR", institution: "Harvard University" },
    ],
  },
  {
    name: "Dra. Liliane de Andrade Carvalho",
    specialty: "Gastroenterologia · Endoscopia",
    crm: "CRM-PE 22370",
  },
  {
    name: "Dra. Lívia Braz",
    specialty: "Endoscopia Digestiva · Gastroenterologia",
    crm: "CRM-PE 24662",
    rqe: "11263",
    photo: "/assets/team/livia.jpg",
    formation: [
      { label: "Endoscopia Digestiva", institution: "RHP-PE" },
      { label: "Gastroenterologia", institution: "HC-UFPE" },
    ],
  },
  {
    name: "Dra. Mariana de Lira Fonte",
    specialty: "Gastroenterologia · Endoscopia Digestiva",
    crm: "CRM-PE 27024",
    rqe: "16671",
    photo: "/assets/team/mariana.jpg",
    formation: [
      { label: "Gastroenterologia", institution: "USP" },
      { label: "Endoscopia Digestiva", institution: "USP" },
    ],
  },
  {
    name: "Dra. Marília Novaes",
    specialty: "Endoscopia",
    crm: "CRM-PE 21897",
  },
  {
    name: "Dr. Milson Brasileiro",
    specialty: "Gastroenterologia · Endoscopia",
    crm: "CRM-PE 23302",
  },
  {
    name: "Dra. Sylene Coutinho Rampche",
    specialty: "Gastrohepatologia",
    crm: "CRM-PE 11715",
    rqe: "1780",
    photo: "/assets/team/sylene.jpg",
    formation: [
      { label: "Gastrohepatologia", institution: "UPE" },
      { label: "Doutorado em Gastroenterologia", institution: "USP" },
    ],
  },
  {
    name: "Dra. Tatiana Bezerra Regueira",
    specialty: "Endoscopia Digestiva",
    crm: "CRM-PE 28993",
    rqe: "16617",
    photo: "/assets/team/tatiana.jpg",
    formation: [
      { label: "Endoscopia Digestiva", institution: "Hospital 9 de Julho — SP" },
      { label: "Cirurgia Geral", institution: "Hospital Barão de Lucena" },
      { label: "Endoscopia Biliopancreática", institution: "Hospital 9 de Julho — SP" },
    ],
  },
  {
    name: "Dra. Zenaide Planzo",
    specialty: "Gastroenterologia",
    crm: "CRM-PE 4672",
  },
];

export type ServiceCard = {
  slug: string;
  href: string;
  title: string;
  description: string;
  bullets: string[];
};

export const SERVICES: ServiceCard[] = [
  {
    slug: "consultas",
    href: "/gastroenterologia",
    title: "Consultas especializadas",
    description:
      "Atendimento humano em Gastroenterologia, Hepatologia, Geriatria e Cirurgia do Aparelho Digestivo.",
    bullets: [
      "Gastroenterologia",
      "Hepatologia",
      "Geriatria",
      "Cirurgia do Aparelho Digestivo",
    ],
  },
  {
    slug: "endoscopia",
    href: "/endoscopia",
    title: "Endoscopia Digestiva Alta",
    description:
      "Investigação precisa do esôfago, estômago e duodeno com Olympus EVIS X1 e sedação por anestesista dedicado.",
    bullets: [
      "Sedação por anestesista",
      "Aparelhos Olympus EVIS X1",
      "Biópsia e pesquisa de H. pylori",
      "Laudo entregue no mesmo dia",
    ],
  },
  {
    slug: "colonoscopia",
    href: "/colonoscopia",
    title: "Colonoscopia com CO₂",
    description:
      "Exame padrão-ouro de rastreamento do câncer colorretal, com CO₂ para conforto no pós-exame e sedação completa.",
    bullets: [
      "Insuflação com gás carbônico",
      "Sedação por anestesista",
      "Remoção de pólipos no mesmo exame",
      "Preparo orientado por escrito e WhatsApp",
    ],
  },
];

export type Differential = {
  number: string;
  title: string;
  text: string;
};

export const DIFFERENTIALS: Differential[] = [
  {
    number: "01",
    title: "Olympus EVIS X1",
    text:
      "A geração mais recente da endoscopia japonesa — EDOF, TXI, NBI e RDI — para identificar lesões em estágio inicial.",
  },
  {
    number: "02",
    title: "Insuflação com CO₂",
    text:
      "Usamos gás carbônico em vez de ar ambiente: absorvido rapidamente pelo organismo, reduz cólicas, gases e desconforto no pós-exame.",
  },
  {
    number: "03",
    title: "Sedação com anestesista",
    text:
      "Um médico anestesiologista acompanha cada exame, ajustando a sedação em tempo real — mais segurança e conforto do início à alta.",
  },
  {
    number: "04",
    title: "Great Place to Work",
    text:
      "Clínica certificada GPTW — equipe cuidada, treinada e valorizada é o que sustenta o atendimento humano que você sente.",
  },
  {
    number: "05",
    title: "Duas unidades em Recife",
    text:
      "Derby (sede histórica) e Boa Viagem Medical Center — mesma equipe, mesmo protocolo, mesmo padrão técnico.",
  },
  {
    number: "06",
    title: "Laudo no mesmo dia",
    text:
      "Você sai da clínica com o laudo em mãos. Quando há biópsia, o resultado histopatológico chega em 7 a 14 dias.",
  },
];

export type HomeFaq = { q: string; a: string };

export const HOME_FAQS: HomeFaq[] = [
  {
    q: "Quanto tempo dura o exame de endoscopia?",
    a: "A endoscopia digestiva alta em si dura cerca de 10 minutos. Considerando preparo, sedação e recuperação, o tempo total na clínica é de aproximadamente 1 a 2 horas.",
  },
  {
    q: "A endoscopia ou a colonoscopia doem?",
    a: "Não. Na Clínica Okazaki todos os exames são realizados com sedação administrada por um médico anestesista — você não sente dor nem desconforto durante o procedimento.",
  },
  {
    q: "Como é o preparo para colonoscopia?",
    a: "O preparo envolve dieta específica nos dias anteriores e uso de laxantes prescritos. Você recebe orientação detalhada por escrito e, se precisar, por telefone. Não é complicado — seguindo o roteiro, o intestino fica pronto para um exame de qualidade.",
  },
  {
    q: "Precisa de jejum?",
    a: "Sim. Jejum de 10 horas para alimentos sólidos e 4 horas para líquidos claros (água) antes do exame, tanto para endoscopia quanto para colonoscopia.",
  },
  {
    q: "Posso dirigir ou voltar sozinho?",
    a: "Não. Como o exame é feito com sedação, você não pode dirigir no dia. É obrigatório comparecer acompanhado de um adulto responsável.",
  },
  {
    q: "A partir de que idade fazer colonoscopia?",
    a: "A recomendação atual é iniciar o rastreamento de câncer colorretal a partir dos 45 anos. Com histórico familiar de pólipos ou câncer, pode começar mais cedo — converse com seu gastroenterologista.",
  },
  {
    q: "Qual a diferença da colonoscopia com CO₂?",
    a: "Usamos gás carbônico (CO₂) em vez de ar ambiente para insuflar o intestino durante o exame. O CO₂ é absorvido rapidamente pelo organismo, reduzindo muito os gases, cólicas e desconforto no pós-exame.",
  },
  {
    q: "Quanto tempo demora o laudo?",
    a: "Os laudos são liberados no mesmo dia do exame. Você sai da clínica com o resultado em mãos.",
  },
];

export type NavLink = { label: string; href: string };

export const HEADER_LINKS: NavLink[] = [
  { label: "Serviços", href: "/#servicos" },
  { label: "Convênios", href: "/#convenios" },
  { label: "Unidades", href: "/#unidades" },
  { label: "Avaliações", href: "/#avaliacoes" },
  { label: "Equipe", href: "/#equipe" },
  { label: "Dúvidas", href: "/#duvidas" },
];

export const FOOTER_SERVICE_LINKS: NavLink[] = [
  { label: "Endoscopia Digestiva Alta", href: "/endoscopia" },
  { label: "Colonoscopia com CO₂", href: "/colonoscopia" },
  { label: "Preparo para Endoscopia", href: "/preparo-endoscopia" },
  { label: "Preparo para Colonoscopia", href: "/preparo-colonoscopia" },
  { label: "Gastroenterologia", href: "/gastroenterologia" },
  { label: "Hepatologia", href: "/hepatologia" },
  { label: "Geriatria", href: "/geriatria" },
];
