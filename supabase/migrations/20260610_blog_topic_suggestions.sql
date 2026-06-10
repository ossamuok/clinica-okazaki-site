-- Sugestões de temas da equipe para o gerador de blog.
-- Aditivo. Editor (authenticated via RLS) insere/gerencia; n8n (postgres) consome.
-- Aplicado via Supabase MCP apply_migration em 2026-06-10.

CREATE TABLE IF NOT EXISTS blog_topic_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pillar TEXT NOT NULL CHECK (pillar IN ('gastroenterologia','endoscopia','colonoscopia','hepatologia','geriatria')),
  topic_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','used','archived')),
  suggested_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_topic_suggestions_pending
  ON blog_topic_suggestions(pillar, created_at) WHERE status='pending';

ALTER TABLE blog_topic_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY topic_suggestions_select_authenticated ON blog_topic_suggestions
  FOR SELECT TO authenticated USING (true);
CREATE POLICY topic_suggestions_insert_authenticated ON blog_topic_suggestions
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY topic_suggestions_update_authenticated ON blog_topic_suggestions
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY topic_suggestions_delete_authenticated ON blog_topic_suggestions
  FOR DELETE TO authenticated USING (status='pending');
