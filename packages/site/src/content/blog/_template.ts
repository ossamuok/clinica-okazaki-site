/**
 * Template não-publicável (extensão `.ts`, não `.post.ts`) — referência
 * de shape para o gerador n8n e para humanos criando posts manualmente.
 *
 * Para criar um post real, copie este arquivo, renomeie para `<slug>.post.ts`
 * e preencha. Não importe esse template em runtime.
 */

import type { BlogPost } from "./types";

export const TEMPLATE_POST: BlogPost = {
  slug: "exemplo-slug",
  pillar: "gastroenterologia",
  title: "Título SEO até ~70 chars | Clínica Okazaki",
  description: "Meta description 140-160 chars com CTA implícito.",
  keywords: "kw1, kw2, kw3 em recife",
  h1: "H1 com keyword primária + geo-modifier quando natural",
  lead: "Parágrafo introdutório (lead) de 2-3 frases. Nunca repete o H1.",
  eyebrow: "BLOG · GASTROENTEROLOGIA",
  breadcrumbLabel: "Título curto",
  about: "Tópico principal (palavra/expressão para schema MedicalProcedure).",
  excerpt:
    "Resumo de 1-2 linhas usado na listagem (BlogIndex). Diferente da meta description.",
  publishedAt: "2026-04-25T12:00:00Z",
  updatedAt: "2026-04-25T12:00:00Z",
  author: {
    name: "Dra. Jane Erika Frazão Okazaki",
    crm: "CRM-PE 19872",
    rqe: "RQE 17633",
    photo: "/assets/team/jane.webp",
    bio: "Geriatra e revisora médica responsável pelo conteúdo do blog.",
  },
  sections: [
    {
      id: "introducao",
      h2: "Subtítulo da seção 1",
      blocks: [
        { type: "p", text: "Parágrafo." },
        { type: "ul", items: ["Item 1", "Item 2", "Item 3"] },
      ],
    },
  ],
  faqs: [{ q: "Pergunta?", a: "Resposta." }],
};
