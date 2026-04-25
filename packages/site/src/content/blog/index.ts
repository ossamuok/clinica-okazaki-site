import type { BlogPost } from "./types";

type PostModule = { post: BlogPost };

const eagerModules = import.meta.glob<PostModule>("./*.post.ts", { eager: true });
const lazyModules = import.meta.glob<PostModule>("./*.post.ts");

const VALID_SLUG = /^[a-z0-9-]+\.post\.ts$/;

function fileNameOf(path: string): string {
  return path.split("/").pop() ?? "";
}

function slugFromFile(fileName: string): string {
  return fileName.replace(/\.post\.ts$/, "");
}

function isValidPostFile(path: string): boolean {
  return VALID_SLUG.test(fileNameOf(path));
}

export const BLOG_POSTS: BlogPost[] = Object.entries(eagerModules)
  .filter(([path]) => isValidPostFile(path))
  .map(([, mod]) => mod.post)
  .sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

export const POST_LOADERS: Record<string, () => Promise<PostModule>> =
  Object.fromEntries(
    Object.entries(lazyModules)
      .filter(([path]) => isValidPostFile(path))
      .map(([path, loader]) => [slugFromFile(fileNameOf(path)), loader]),
  );

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export async function loadPostBySlug(
  slug: string,
): Promise<BlogPost | undefined> {
  const loader = POST_LOADERS[slug];
  if (!loader) return undefined;
  const mod = await loader();
  return mod.post;
}
