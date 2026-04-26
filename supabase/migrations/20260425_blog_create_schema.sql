-- Blog tables in Dashboard Amigo project (prefixed to avoid clashing with existing tables)
-- Applied via Supabase MCP `apply_migration` on 2026-04-25.
-- Project: jvrjzasvnfykftddqpqn

CREATE TABLE blog_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pillar TEXT NOT NULL CHECK (pillar IN ('gastroenterologia','endoscopia','colonoscopia','hepatologia','geriatria')),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  meta_description TEXT NOT NULL,
  keywords TEXT[],
  content_json JSONB NOT NULL,
  word_count INT,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  generated_by TEXT,
  status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN
    ('pending_review','approved','rejected','published','archived')),
  reviewer_user_id UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  reviewer_notes TEXT,
  rejection_reason TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE blog_publish_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID NOT NULL REFERENCES blog_drafts(id) ON DELETE RESTRICT,
  scheduled_for TIMESTAMPTZ NOT NULL,
  attempt_started_at TIMESTAMPTZ,
  attempt_count INT DEFAULT 0,
  published_at TIMESTAMPTZ,
  github_commit_sha TEXT,
  vercel_deploy_url TEXT,
  indexnow_status TEXT,
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE blog_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO blog_settings (key, value) VALUES
  ('generator_paused', 'false'::jsonb),
  ('generator_pause_threshold', '12'::jsonb),
  ('publish_cadence_days', '7'::jsonb),
  ('publish_max_per_day', '1'::jsonb),
  ('publish_hour', '9'::jsonb),
  ('publish_tz', '"America/Recife"'::jsonb),
  ('last_pillar', '"none"'::jsonb);

CREATE INDEX idx_blog_drafts_status ON blog_drafts(status);
CREATE INDEX idx_blog_drafts_pillar ON blog_drafts(pillar);
CREATE INDEX idx_blog_queue_due ON blog_publish_queue(scheduled_for) WHERE published_at IS NULL;
