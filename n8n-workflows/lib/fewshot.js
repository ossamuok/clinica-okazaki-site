// Seleção few-shot: mesmo pilar primeiro, completa com recentes de outros pilares.
function selectExamples(rows, pillar, n) {
  const same = rows.filter(r => r.pillar === pillar);
  const other = rows.filter(r => r.pillar !== pillar);
  return same.concat(other).slice(0, n);
}

function buildExamplesBlock(examples) {
  if (!examples || examples.length === 0) return '';
  const blocks = examples.map((e, i) =>
    `### Exemplo ${i + 1}: ${e.title}\n` +
    JSON.stringify(e.content_json)
  ).join('\n\n');
  return '\n\nEXEMPLOS DE POSTS APROVADOS — escreva no MESMO estilo, tom e estrutura destes (NAO copie o tema, copie o jeito de escrever):\n\n' +
    blocks + '\n\n';
}

module.exports = { selectExamples, buildExamplesBlock };
