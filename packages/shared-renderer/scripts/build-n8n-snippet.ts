/**
 * Gera `dist/n8n-snippet.js` — versão concat-friendly de schema.ts
 * para colar em n8n Code nodes.
 *
 * n8n Code nodes não conseguem `require('@okazaki/shared-renderer')`
 * (sem node_modules do monorepo). Esta solução copia o schema fonte
 * + injeta `const { z } = require('zod')` no topo (n8n já tem zod
 * disponível via External Modules ou Function Item).
 *
 * Hash SHA-256 escrito em `dist/n8n-snippet.sha` para detectar drift
 * (CI futuro pode falhar se snippet local desync com schema).
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_SRC = path.resolve(__dirname, "../src/schema.ts");
const DIST_DIR = path.resolve(__dirname, "../dist");
const OUT_JS = path.join(DIST_DIR, "n8n-snippet.js");
const OUT_SHA = path.join(DIST_DIR, "n8n-snippet.sha");

function buildSnippet(): string {
  const schemaSrc = fs.readFileSync(SCHEMA_SRC, "utf8");

  const stripped = schemaSrc
    .replace(/import\s*\{\s*z\s*\}\s*from\s*["']zod["'];?\n/g, "")
    .replace(/^export\s+/gm, "")
    .replace(/^\s*export\s+type\s+\w+\s*=.*$/gm, "");

  const header = `// AUTO-GENERATED — do not edit. Regenerate via:
// pnpm --filter @okazaki/shared-renderer build:n8n-snippet
//
// Cole este bloco no início do n8n Code node. Requer 'zod' em
// External Modules (Self-Hosted n8n: NODE_FUNCTION_ALLOW_EXTERNAL=zod).
const { z } = require('zod');
`;

  return `${header}\n${stripped}\n\nmodule.exports = { BlockSchema, SectionSchema, PageFaqSchema, MetaChipSchema, HowToStepSchema, PageContentSchema, BlogAuthorSchema, BlogPillarSchema, BlogPostSchema };\n`;
}

function main() {
  fs.mkdirSync(DIST_DIR, { recursive: true });
  const snippet = buildSnippet();
  const sha = crypto.createHash("sha256").update(snippet).digest("hex");

  fs.writeFileSync(OUT_JS, snippet, "utf8");
  fs.writeFileSync(OUT_SHA, `${sha}\n`, "utf8");

  process.stdout.write(`[build-n8n-snippet] ${OUT_JS}\n`);
  process.stdout.write(`[build-n8n-snippet] sha256 ${sha}\n`);
}

main();
