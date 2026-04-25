import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const BLOG_DIR = path.resolve(__dirname, "../src/content/blog");
const POST_FILE_RE = /^[a-z0-9-]+\.post\.ts$/;

export type BlogSlugEntry = {
  slug: string;
  filePath: string;
  mtime: Date;
};

export function listBlogSlugs(): BlogSlugEntry[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((name) => POST_FILE_RE.test(name))
    .map((name) => {
      const filePath = path.join(BLOG_DIR, name);
      const stat = fs.statSync(filePath);
      return {
        slug: name.replace(/\.post\.ts$/, ""),
        filePath,
        mtime: stat.mtime,
      };
    })
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const entry of listBlogSlugs()) {
    process.stdout.write(`${entry.slug}\t${entry.mtime.toISOString()}\n`);
  }
}
