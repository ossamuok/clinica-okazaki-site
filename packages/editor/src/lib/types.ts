/**
 * Tipos de row do banco. Strings, não Date — Supabase retorna ISO.
 */

import type { BlogPillar } from "@okazaki/shared-renderer/types";

export type DraftStatus =
  | "pending_review"
  | "approved"
  | "rejected"
  | "published"
  | "archived";

export type DraftRow = {
  id: string;
  pillar: BlogPillar;
  title: string;
  slug: string;
  meta_description: string;
  keywords: string[] | null;
  content_json: unknown;
  word_count: number | null;
  generated_at: string;
  generated_by: string | null;
  status: DraftStatus;
  reviewer_user_id: string | null;
  reviewed_at: string | null;
  reviewer_notes: string | null;
  rejection_reason: string | null;
  updated_at: string;
};

export type QueueRow = {
  id: string;
  draft_id: string;
  scheduled_for: string;
  attempt_started_at: string | null;
  attempt_count: number;
  published_at: string | null;
  github_commit_sha: string | null;
  vercel_deploy_url: string | null;
  indexnow_status: string | null;
  last_error: string | null;
  created_at: string;
};

export type SettingRow = {
  key: string;
  value: unknown;
  updated_at: string;
};
