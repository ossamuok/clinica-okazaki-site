-- Triggers (touch_updated_at, state machine, lock_queue_draft_id) + RLS policies
-- Applied via Supabase MCP `apply_migration` on 2026-04-25.
-- Project: jvrjzasvnfykftddqpqn

CREATE OR REPLACE FUNCTION blog_touch_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_drafts_touch BEFORE UPDATE ON blog_drafts
  FOR EACH ROW EXECUTE FUNCTION blog_touch_updated_at();

CREATE OR REPLACE FUNCTION blog_validate_status_transition() RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = NEW.status THEN RETURN NEW; END IF;
  IF OLD.status = 'pending_review' AND NEW.status IN ('approved','rejected','archived','pending_review') THEN RETURN NEW; END IF;
  IF OLD.status = 'approved' AND NEW.status IN ('published','archived','pending_review') THEN RETURN NEW; END IF;
  IF OLD.status = 'rejected' AND NEW.status IN ('archived','pending_review') THEN RETURN NEW; END IF;
  IF OLD.status = 'archived' AND NEW.status = 'pending_review' THEN RETURN NEW; END IF;
  RAISE EXCEPTION 'invalid blog_drafts status transition: % -> %', OLD.status, NEW.status;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_drafts_status_machine
  BEFORE UPDATE OF status ON blog_drafts
  FOR EACH ROW EXECUTE FUNCTION blog_validate_status_transition();

CREATE OR REPLACE FUNCTION blog_lock_queue_draft_id() RETURNS TRIGGER AS $$
BEGIN
  IF OLD.draft_id IS DISTINCT FROM NEW.draft_id THEN
    RAISE EXCEPTION 'cannot change draft_id of blog_publish_queue entry';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_queue_lock_draft_id
  BEFORE UPDATE OF draft_id ON blog_publish_queue
  FOR EACH ROW EXECUTE FUNCTION blog_lock_queue_draft_id();

ALTER TABLE blog_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_publish_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY blog_drafts_select_authenticated ON blog_drafts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY blog_drafts_update_authenticated ON blog_drafts
  FOR UPDATE TO authenticated USING (true)
  WITH CHECK (
    (reviewer_user_id IS NULL OR reviewer_user_id = auth.uid())
    AND status <> 'published'
  );

CREATE POLICY blog_queue_select_authenticated ON blog_publish_queue
  FOR SELECT TO authenticated USING (true);

CREATE POLICY blog_queue_insert_authenticated ON blog_publish_queue
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY blog_queue_update_authenticated ON blog_publish_queue
  FOR UPDATE TO authenticated USING (published_at IS NULL);

CREATE POLICY blog_settings_select_authenticated ON blog_settings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY blog_settings_update_authenticated ON blog_settings
  FOR UPDATE TO authenticated USING (true);
