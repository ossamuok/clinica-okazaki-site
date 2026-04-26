/**
 * Shared Resend email helper for blog notification Edge Functions.
 *
 * Env vars required:
 * - RESEND_API_KEY
 * - BLOG_FROM_EMAIL (e.g., "Editor Blog Okazaki <blog@clinicaokazaki.com>")
 * - EDITOR_URL (e.g., "https://editor.clinicaokazaki.com")
 *
 * Set via Supabase Dashboard → Project Settings → Edge Functions → Secrets.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export type SendEmailParams = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

export async function sendEmail(params: SendEmailParams): Promise<{ id: string }> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) throw new Error("RESEND_API_KEY missing in Edge Function env");

  const from = Deno.env.get("BLOG_FROM_EMAIL");
  if (!from) throw new Error("BLOG_FROM_EMAIL missing in Edge Function env");

  const body: Record<string, unknown> = {
    from,
    to: Array.isArray(params.to) ? params.to : [params.to],
    subject: params.subject,
    html: params.html,
  };
  if (params.text) body.text = params.text;
  if (params.replyTo) body.reply_to = params.replyTo;

  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend API ${res.status}: ${text}`);
  }
  return await res.json();
}

export function editorUrl(path = ""): string {
  const base = Deno.env.get("EDITOR_URL") ?? "https://editor.clinicaokazaki.com";
  return `${base}${path}`;
}

export function corsHeaders(origin?: string | null): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}
