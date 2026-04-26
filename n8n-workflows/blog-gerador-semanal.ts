/**
 * n8n Workflow SDK source — Blog · Gerador Semanal
 *
 * Workflow ID: 41A8liy2qNm9zqpR
 * Cron: 0 0 11 * * 1 (segunda 11:00 UTC = 08:00 BRT)
 *
 * Aplicado via mcp__claude_ai_n8n__create_workflow_from_code em 2026-04-25.
 * Editar este arquivo + re-validar + update_workflow para mudanças.
 */

import {
  workflow,
  trigger,
  node,
  newCredential,
  ifElse,
  sticky,
  expr,
} from "@n8n/workflow-sdk";

const scheduleTrigger = trigger({
  type: "n8n-nodes-base.scheduleTrigger",
  version: 1.3,
  config: {
    name: "Toda Segunda 08:00 BRT",
    parameters: {
      rule: {
        interval: [
          { field: "cronExpression", expression: "0 0 11 * * 1" },
        ],
      },
    },
    position: [240, 300],
  },
  output: [{}],
});

const readSettings = node({
  type: "n8n-nodes-base.postgres",
  version: 2.6,
  config: {
    name: "Ler Settings + Buffer",
    parameters: {
      operation: "executeQuery",
      query:
        "SELECT (SELECT (value::text)::boolean FROM blog_settings WHERE key='generator_paused') AS paused, (SELECT (value::text)::int FROM blog_settings WHERE key='generator_pause_threshold') AS threshold, (SELECT trim(both '\"' from value::text) FROM blog_settings WHERE key='last_pillar') AS last_pillar, (SELECT count(*) FROM blog_drafts WHERE status IN ('pending_review','approved')) AS buffer_count;",
      options: {},
    },
    credentials: { postgres: newCredential("Supabase Blog Postgres") },
    position: [480, 300],
  },
  output: [
    { paused: false, threshold: 12, last_pillar: "none", buffer_count: 3 },
  ],
});

const shouldGenerate = ifElse({
  version: 2.3,
  config: {
    name: "Pode Gerar?",
    parameters: {
      conditions: {
        conditions: [
          {
            leftValue: expr("{{ $json.paused }}"),
            operator: { type: "boolean", operation: "false" },
            rightValue: "",
          },
          {
            leftValue: expr("{{ $json.buffer_count }}"),
            operator: { type: "number", operation: "lt" },
            rightValue: expr("{{ $json.threshold }}"),
          },
        ],
      },
    },
    position: [720, 300],
  },
});

// ... (restante: pickPillars, callAnthropic, parseValidate, insertDraft,
// updateLastPillar, notifyJane). Ver implementação no n8n UI ou expandir
// conforme docs/blog-n8n-workflows.md.

export {};
