/**
 * Tipos da camada de conteúdo. Sem deps React/Node — usável em qualquer
 * runtime (browser, n8n Code node, edge function).
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string }
  | { type: "warning"; text: string }
  | { type: "inline-cta"; text: string; label?: string }
  | { type: "video"; youtubeId: string; caption?: string }
  | { type: "link"; href: string; label: string };

export type Section = {
  id: string;
  h2: string;
  blocks: Block[];
};

export type PageFaq = { q: string; a: string };

export type MetaChip = { label: string; value: string };

export type HowToStep = { name: string; text: string };

export type PageContent = {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  h1: string;
  lead: string;
  eyebrow: string;
  breadcrumbLabel: string;
  about: string;
  metaChips?: MetaChip[];
  sections: Section[];
  faqs: PageFaq[];
  howTo?: { name: string; description: string; steps: HowToStep[] };
};

export type BlogAuthor = {
  name: string;
  crm?: string;
  rqe?: string;
  photo?: string;
  bio?: string;
};

export type BlogPillar =
  | "gastroenterologia"
  | "endoscopia"
  | "colonoscopia"
  | "hepatologia"
  | "geriatria";

export type BlogPost = PageContent & {
  pillar: BlogPillar;
  excerpt: string;
  author: BlogAuthor;
  reviewer?: BlogAuthor;
  publishedAt: string;
  updatedAt: string;
  heroImage?: { src: string; alt: string };
};
