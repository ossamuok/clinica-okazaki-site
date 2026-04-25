import type { PageContent } from "../types";

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
