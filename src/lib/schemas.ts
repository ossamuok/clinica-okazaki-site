import { SITE, UNITS } from "./constants";

type JsonLd = Record<string, unknown>;

const ORG_ID = `${SITE.url}/#organization`;

export const medicalOrganizationSchema: JsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  "@id": ORG_ID,
  name: SITE.name,
  alternateName: SITE.shortName,
  url: `${SITE.url}/`,
  logo: `${SITE.url}/assets/logo-vertical.webp`,
  image: `${SITE.url}/assets/logo-horizontal.webp`,
  description: SITE.description,
  foundingDate: String(SITE.foundingYear),
  medicalSpecialty: [
    "Gastroenterology",
    "Geriatric Medicine",
    "Digestive Surgery",
  ],
  member: {
    "@type": "Physician",
    name: SITE.tecnico.nome,
    jobTitle: "Diretor Técnico",
    medicalSpecialty: "Endoscopia Digestiva",
    identifier: [
      { "@type": "PropertyValue", propertyID: "CRM-PE", value: "19246" },
      { "@type": "PropertyValue", propertyID: "RQE", value: "8449" },
    ],
  },
  availableService: [
    { "@type": "MedicalProcedure", name: "Endoscopia Digestiva Alta" },
    { "@type": "MedicalProcedure", name: "Colonoscopia" },
    { "@type": "MedicalProcedure", name: "Consulta em Gastroenterologia" },
    { "@type": "MedicalProcedure", name: "Consulta em Hepatologia" },
    { "@type": "MedicalProcedure", name: "Consulta em Geriatria" },
    {
      "@type": "MedicalProcedure",
      name: "Consulta em Cirurgia do Aparelho Digestivo",
    },
  ],
  sameAs: [SITE.instagram],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: String(SITE.rating),
    reviewCount: String(SITE.reviewsCount),
    bestRating: "5",
    worstRating: "1",
  },
};

const openingHours = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "07:30",
    closes: "18:00",
  },
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: "Saturday",
    opens: "08:00",
    closes: "12:00",
  },
];

export const medicalClinicDerbySchema: JsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  "@id": `${SITE.url}/#clinic-derby`,
  name: `${SITE.name} — Unidade Derby`,
  parentOrganization: { "@id": ORG_ID },
  url: `${SITE.url}/#unidades`,
  telephone: "+55-81-3221-4795",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Gov. Agamenon Magalhães, 4318, Sala 307",
    addressLocality: "Recife",
    addressRegion: "PE",
    postalCode: "52010-040",
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: UNITS[0].geo.lat,
    longitude: UNITS[0].geo.lng,
  },
  openingHoursSpecification: openingHours,
  hasMap: UNITS[0].mapsUrl,
};

export const medicalClinicBoaViagemSchema: JsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  "@id": `${SITE.url}/#clinic-boa-viagem`,
  name: `${SITE.name} — Unidade Boa Viagem`,
  parentOrganization: { "@id": ORG_ID },
  url: `${SITE.url}/#unidades`,
  telephone: "+55-81-2129-1405",
  address: {
    "@type": "PostalAddress",
    streetAddress: "R. Visconde de Jequitinhonha, 1144, Sala 401",
    addressLocality: "Recife",
    addressRegion: "PE",
    postalCode: "51130-020",
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: UNITS[1].geo.lat,
    longitude: UNITS[1].geo.lng,
  },
  openingHoursSpecification: openingHours,
  hasMap: UNITS[1].mapsUrl,
};

export const faqEndoscopiaHomeSchema: JsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quanto tempo dura o exame de endoscopia?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "A endoscopia digestiva alta em si dura de 5 a 10 minutos. Considerando preparo, sedação e recuperação, o tempo total na clínica é de aproximadamente 2 a 3 horas.",
      },
    },
    {
      "@type": "Question",
      name: "A endoscopia ou a colonoscopia doem?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Não. Na Clínica Okazaki todos os exames são realizados com sedação administrada por um anestesista dedicado — você não sente dor nem desconforto durante o procedimento.",
      },
    },
    {
      "@type": "Question",
      name: "Precisa de jejum para endoscopia e colonoscopia?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Sim. Jejum de 8 horas para alimentos sólidos e 4 horas para líquidos claros (água) antes do exame.",
      },
    },
    {
      "@type": "Question",
      name: "Posso dirigir depois do exame?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Não. Como o exame é feito com sedação, você não pode dirigir no dia e precisa estar acompanhado de um adulto responsável.",
      },
    },
  ],
};

export const faqColonoscopiaHomeSchema: JsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "A partir de que idade fazer colonoscopia?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "A recomendação atual é iniciar o rastreamento de câncer colorretal a partir dos 45 anos. Com histórico familiar de pólipos ou câncer, pode começar mais cedo.",
      },
    },
    {
      "@type": "Question",
      name: "Qual a diferença da colonoscopia com CO₂?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Usamos gás carbônico (CO₂) em vez de ar ambiente para insuflar o intestino. O CO₂ é absorvido rapidamente pelo organismo, reduzindo gases, cólicas e desconforto no pós-exame.",
      },
    },
    {
      "@type": "Question",
      name: "Como é o preparo para colonoscopia?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "O preparo envolve dieta específica nos dias anteriores e uso de laxantes prescritos. Você recebe orientação detalhada por escrito e pode tirar dúvidas por telefone ou WhatsApp.",
      },
    },
    {
      "@type": "Question",
      name: "A colonoscopia é feita com sedação?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Sim. Todas as colonoscopias são realizadas com sedação administrada por anestesista dedicado — você dorme durante todo o procedimento.",
      },
    },
  ],
};

export function breadcrumbSchema(
  items: { name: string; url: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function faqPageSchema(faqs: { q: string; a: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function medicalWebPageSchema(params: {
  title: string;
  description: string;
  url: string;
  about: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: params.title,
    description: params.description,
    url: params.url,
    about: {
      "@type": "MedicalProcedure",
      name: params.about,
    },
    publisher: { "@id": ORG_ID },
    inLanguage: "pt-BR",
  };
}

export function howToSchema(params: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: params.name,
    description: params.description,
    step: params.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export const HOME_SCHEMAS: JsonLd[] = [
  medicalOrganizationSchema,
  medicalClinicDerbySchema,
  medicalClinicBoaViagemSchema,
  faqEndoscopiaHomeSchema,
  faqColonoscopiaHomeSchema,
];
