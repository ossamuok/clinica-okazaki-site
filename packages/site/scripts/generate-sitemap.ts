import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listBlogSlugs } from "./list-blog-slugs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = "https://www.clinicaokazaki.com";
const DIST_DIR = path.resolve(__dirname, "../dist");

type SitemapEntry = {
  loc: string;
  lastmod: string;
  changefreq:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
};

const STATIC_ENTRIES: Omit<SitemapEntry, "lastmod">[] = [
  { loc: "/", changefreq: "monthly", priority: 1.0 },
  { loc: "/endoscopia", changefreq: "monthly", priority: 1.0 },
  { loc: "/colonoscopia", changefreq: "monthly", priority: 1.0 },
  { loc: "/gastroenterologia", changefreq: "monthly", priority: 1.0 },
  { loc: "/hepatologia", changefreq: "monthly", priority: 1.0 },
  { loc: "/geriatria", changefreq: "monthly", priority: 1.0 },
  { loc: "/preparo-endoscopia", changefreq: "monthly", priority: 0.9 },
  { loc: "/preparo-colonoscopia", changefreq: "monthly", priority: 0.9 },
  { loc: "/blog", changefreq: "weekly", priority: 0.9 },
];

function buildEntries(): SitemapEntry[] {
  const buildTime = new Date().toISOString();
  const staticEntries: SitemapEntry[] = STATIC_ENTRIES.map((e) => ({
    ...e,
    lastmod: buildTime,
  }));

  const blogEntries: SitemapEntry[] = listBlogSlugs().map((b) => ({
    loc: `/blog/${b.slug}`,
    lastmod: b.mtime.toISOString(),
    changefreq: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries];
}

function renderXml(entries: SitemapEntry[]): string {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  for (const e of entries) {
    lines.push("  <url>");
    lines.push(`    <loc>${SITE_URL}${e.loc}</loc>`);
    lines.push(`    <lastmod>${e.lastmod}</lastmod>`);
    lines.push(`    <changefreq>${e.changefreq}</changefreq>`);
    lines.push(`    <priority>${e.priority.toFixed(1)}</priority>`);
    lines.push("  </url>");
  }
  lines.push("</urlset>");
  return lines.join("\n") + "\n";
}

function main() {
  if (!fs.existsSync(DIST_DIR)) {
    process.stderr.write(
      `[generate-sitemap] dist/ não existe (${DIST_DIR}). Execute após o build.\n`,
    );
    process.exit(1);
  }
  const entries = buildEntries();
  const xml = renderXml(entries);
  const outPath = path.join(DIST_DIR, "sitemap.xml");
  fs.writeFileSync(outPath, xml, "utf8");
  process.stdout.write(
    `[generate-sitemap] escrito ${outPath} (${entries.length} URLs)\n`,
  );
}

main();
