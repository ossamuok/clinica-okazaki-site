-- Aprendizado do blog: trava-perda de notas + regras de estilo.
-- Aditivo. Projeto jvrjzasvnfykftddqpqn. Aplicado via Supabase MCP apply_migration.

CREATE TABLE IF NOT EXISTS blog_review_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID REFERENCES blog_drafts(id) ON DELETE SET NULL,
  pillar TEXT,
  note_text TEXT,
  rejection_reason TEXT,
  original_content_json JSONB,
  captured_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_review_log_unprocessed
  ON blog_review_log(captured_at) WHERE processed_at IS NULL;

CREATE TABLE IF NOT EXISTS blog_style_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_text TEXT NOT NULL,
  scope TEXT NOT NULL DEFAULT 'outro'
    CHECK (scope IN ('tom','estrutura','seo','factual','outro')),
  status TEXT NOT NULL DEFAULT 'proposed'
    CHECK (status IN ('proposed','active','rejected','retired')),
  source_log_ids UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  decided_at TIMESTAMPTZ,
  decided_via TEXT
);
CREATE INDEX IF NOT EXISTS idx_style_rules_active
  ON blog_style_rules(status) WHERE status='active';
