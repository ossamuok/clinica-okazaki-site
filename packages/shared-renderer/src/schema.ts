/**
 * Zod schemas para validação runtime do BlogPost.
 *
 * Sem deps React. Usado em:
 * - n8n Publicador (Code node) — valida content_json antes de commitar
 * - n8n Gerador (Code node) — valida resposta LLM
 * - Edge Functions Supabase
 * - Editor app (validação de form schema-driven)
 *
 * O schema é a fonte da verdade do shape. Tipos derivados via z.infer
 * garantem que types.ts e schema.ts não divergem.
 */

import { z } from "zod";

export const BlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("p"), text: z.string().min(1) }),
  z.object({ type: z.literal("h3"), text: z.string().min(1) }),
  z.object({ type: z.literal("ul"), items: z.array(z.string().min(1)).min(1) }),
  z.object({ type: z.literal("callout"), text: z.string().min(1) }),
  z.object({ type: z.literal("warning"), text: z.string().min(1) }),
  z.object({
    type: z.literal("inline-cta"),
    text: z.string().min(1),
    label: z.string().optional(),
  }),
  z.object({
    type: z.literal("video"),
    youtubeId: z.string().min(1),
    caption: z.string().optional(),
  }),
  z.object({
    type: z.literal("link"),
    href: z.string().min(1),
    label: z.string().min(1),
  }),
]);

export const SectionSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9][a-z0-9-]*$/, "id deve ser slug-style ([a-z0-9-])"),
  h2: z.string().min(1),
  blocks: z.array(BlockSchema).min(1),
});

export const PageFaqSchema = z.object({
  q: z.string().min(1),
  a: z.string().min(1),
});

export const MetaChipSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

export const HowToStepSchema = z.object({
  name: z.string().min(1),
  text: z.string().min(1),
});

export const PageContentSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9][a-z0-9-]*$/, "slug deve ser kebab-case ([a-z0-9-])"),
  title: z.string().min(1).max(120),
  description: z.string().min(80).max(180),
  keywords: z.string().min(1),
  h1: z.string().min(1),
  lead: z.string().min(1),
  eyebrow: z.string().min(1),
  breadcrumbLabel: z.string().min(1),
  about: z.string().min(1),
  metaChips: z.array(MetaChipSchema).optional(),
  sections: z.array(SectionSchema).min(1),
  faqs: z.array(PageFaqSchema),
  howTo: z
    .object({
      name: z.string().min(1),
      description: z.string().min(1),
      steps: z.array(HowToStepSchema).min(1),
    })
    .optional(),
});

export const BlogAuthorSchema = z.object({
  name: z.string().min(1),
  crm: z.string().optional(),
  rqe: z.string().optional(),
  photo: z.string().optional(),
  bio: z.string().optional(),
});

export const BlogPillarSchema = z.enum([
  "gastroenterologia",
  "endoscopia",
  "colonoscopia",
  "hepatologia",
  "geriatria",
]);

export const BlogPostSchema = PageContentSchema.extend({
  pillar: BlogPillarSchema,
  excerpt: z.string().min(40).max(300),
  author: BlogAuthorSchema,
  reviewer: BlogAuthorSchema.optional(),
  publishedAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  heroImage: z
    .object({
      src: z.string().min(1),
      alt: z.string().min(1),
    })
    .optional(),
});

export type BlogPostInput = z.input<typeof BlogPostSchema>;
export type BlogPostParsed = z.output<typeof BlogPostSchema>;
