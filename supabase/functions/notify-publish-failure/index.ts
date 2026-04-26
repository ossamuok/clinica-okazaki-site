/**
 * notify-publish-failure
 *
 * Trigger: HTTP POST do n8n Publicador após falha (validação Zod,
 * GitHub commit, Vercel deploy, IndexNow).
 *
 * Body: { to, draft_id, slug, stage, error, attempt_count }
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { sendEmail, editorUrl, corsHeaders } from "../_shared/email.ts";

type Body = {
  to: string;
  draft_id: string;
  slug: string;
  stage: "validation" | "github_commit" | "vercel_deploy" | "indexnow" | "unknown";
  error: string;
  attempt_count?: number;
};

const STAGE_LABELS: Record<Body["stage"], string> = {
  validation: "Validação Zod do conteúdo",
  github_commit: "Commit no GitHub",
  vercel_deploy: "Deploy Vercel",
  indexnow: "Notificação IndexNow",
  unknown: "Etapa desconhecida",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders(req.headers.get("origin")) });
  }
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  if (!body.to || !body.draft_id || !body.error) {
    return json({ error: "missing_fields" }, 400);
  }

  const html = `
<!doctype html>
<html lang="pt-BR">
  <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;background:#FBFCFC;color:#0B1518;margin:0;padding:24px">
    <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #B3342C;border-radius:16px;padding:32px">
      <p style="text-transform:uppercase;letter-spacing:2px;font-size:11px;color:#B3342C;font-weight:600;margin:0 0 12px">Falha na publicação</p>
      <h1 style="font-size:20px;color:#0A2540;margin:0 0 12px">Slug: ${escapeHtml(body.slug)}</h1>
      <p style="color:#56696D;margin:0 0 8px">
        Etapa: <strong>${STAGE_LABELS[body.stage] ?? body.stage}</strong>
        ${body.attempt_count ? ` · tentativa ${body.attempt_count}` : ""}
      </p>
      <pre style="background:#FFF5F5;border:1px solid #FBD0CE;border-radius:8px;padding:12px;color:#B3342C;font-size:12px;overflow-x:auto;white-space:pre-wrap;word-break:break-word">${escapeHtml(body.error)}</pre>
      <a href="${editorUrl(`/drafts/${body.draft_id}`)}" style="display:inline-block;margin-top:16px;background:#148A8E;color:#fff;text-decoration:none;padding:12px 24px;border-radius:9999px;font-weight:600">Abrir rascunho</a>
      <p style="color:#56696D;font-size:12px;margin:20px 0 0;line-height:1.5">
        O Publicador tentará novamente em ~5 minutos. Se a falha persistir, edite o rascunho ou rejeite.
      </p>
    </div>
  </body>
</html>`.trim();

  try {
    const result = await sendEmail({
      to: body.to,
      subject: `⚠️ Falha na publicação: ${body.slug}`,
      html,
    });
    return json({ ok: true, message_id: result.id });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(null) },
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
