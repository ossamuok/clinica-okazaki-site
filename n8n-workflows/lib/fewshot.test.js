const { test } = require('node:test');
const assert = require('node:assert');
const { selectExamples, buildExamplesBlock } = require('./fewshot');

const rows = [
  { pillar:'colonoscopia', title:'C1', content_json:{a:1} },
  { pillar:'colonoscopia', title:'C2', content_json:{a:2} },
  { pillar:'colonoscopia', title:'C3', content_json:{a:3} },
  { pillar:'colonoscopia', title:'C4', content_json:{a:4} },
  { pillar:'hepatologia',  title:'H1', content_json:{a:5} },
  { pillar:'geriatria',    title:'G1', content_json:{a:6} },
];

test('prioriza mesmo pilar, no maximo 3', () => {
  const r = selectExamples(rows, 'colonoscopia', 3);
  assert.equal(r.length, 3);
  assert.deepEqual(r.map(x=>x.title), ['C1','C2','C3']);
});

test('completa com outros pilares quando faltam do mesmo', () => {
  const r = selectExamples(rows, 'hepatologia', 3);
  assert.equal(r.length, 3);
  assert.equal(r[0].title, 'H1'); // mesmo pilar primeiro
  assert.equal(r.filter(x=>x.pillar!=='hepatologia').length, 2); // completou
});

test('pool menor que 3 retorna o que tiver', () => {
  const r = selectExamples([rows[4]], 'colonoscopia', 3);
  assert.equal(r.length, 1);
});

test('pool vazio retorna []', () => {
  assert.deepEqual(selectExamples([], 'colonoscopia', 3), []);
});

test('buildExamplesBlock vazio = string vazia', () => {
  assert.equal(buildExamplesBlock([]), '');
});

test('buildExamplesBlock inclui titulo e json', () => {
  const b = buildExamplesBlock([{title:'C1',content_json:{a:1}}]);
  assert.match(b, /EXEMPLOS DE POSTS APROVADOS/);
  assert.match(b, /C1/);
  assert.match(b, /"a":1/);
});
