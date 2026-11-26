// Roda o jsCode real do nó "Gerar .post.ts + Validar" do Publicador (export em
// ../blog-publicador.json) com um draft cujo publishedAt veio inventado pela IA.
// Uso: node --test n8n-workflows/lib/publicador.test.js
const { test } = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

const workflow = require(path.join(__dirname, '..', 'blog-publicador.json'));
const code = workflow.nodes.find(n => n.name === 'Gerar .post.ts + Validar').parameters.jsCode;

const draft = {
  id: 'draft-1',
  queue_id: 'queue-1',
  attempt_count: 1,
  reviewer_author: null,
  content_json: {
    slug: 'post-de-teste', pillar: 'gastroenterologia', title: 'T', description: 'D',
    keywords: [], h1: 'H', lead: 'L', eyebrow: 'E', breadcrumbLabel: 'B', about: 'A',
    excerpt: 'X', sections: [{ heading: 'S', blocks: [{ type: 'p', text: 'ok' }] }],
    faqs: [], author: { name: 'Dra. Jane' },
    publishedAt: '2025-05-15T10:00:00-03:00',
    updatedAt: '2025-05-15T10:00:00-03:00',
  },
};

test('publishedAt = momento da publicação, não a data que veio no draft', () => {
  const before = Date.now();
  const out = new Function('$input', code)({ item: { json: draft } }).json;
  const after = Date.now();

  const marker = 'export const post = ';
  const post = JSON.parse(
    out.file_content.slice(out.file_content.indexOf(marker) + marker.length, out.file_content.lastIndexOf('}') + 1),
  );
  const published = new Date(post.publishedAt).getTime();

  assert.ok(published >= before && published <= after, `publishedAt fora da janela: ${post.publishedAt}`);
  assert.strictEqual(post.updatedAt, post.publishedAt);
  assert.match(post.publishedAt, /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/); // schema: z.string().datetime()
});
