/**
 * notify-publish-success
 *
 * Trigger: HTTP POST do n8n Publicador após deploy bem-sucedido.
 * Confirma URL viva para Dra. Jane.
 *
 * Body: { to, title, slug, pillar, commit_sha?, deploy_url? }
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { sendEmail, corsHeaders } from "../_shared/email.ts";

type Body = {
  to: string;
  title: string;
  slug: string;
  pillar: string;
  commit_sha?: string;
  deploy_url?: string;
};

const SITE_URL = "https://www.clinicaokazaki.com";

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

  if (!body.to || !body.title || !body.slug) {
    return json({ error: "missing_fields" }, 400);
  }

  const liveUrl = `${SITE_URL}/blog/${body.slug}`;
  const html = `
<!doctype html>
<html lang="pt-BR">
  <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;background:#FBFCFC;color:#0B1518;margin:0;padding:24px">
    <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #E4E9EA;border-radius:16px;padding:32px">
      <p style="text-transform:uppercase;letter-spacing:2px;font-size:11px;color:#2B8A6B;font-weight:600;margin:0 0 12px">Publicado</p>
      <h1 style="font-size:22px;color:#0A2540;margin:0 0 12px">"${escapeHtml(body.title)}" está no ar</h1>
      <p style="color:#56696D;line-height:1.6;margin:0 0 20px">
        Categoria: <strong>${escapeHtml(body.pillar)}</strong>
      </p>
      <a href="${liveUrl}" style="display:inline-block;background:#148A8E;color:#fff;text-decoration:none;padding:12px 24px;border-radius:9999px;font-weight:600">Ver post ao vivo</a>
      ${body.commit_sha ? `<p style="color:#56696D;font-size:12px;margin:20px 0 0">Commit: <code style="font-family:monospace">${body.commit_sha.slice(0, 7)}</code></p>` : ""}
    </div>
  </body>
</html>`.trim();

  try {
    const result = await sendEmail({
      to: body.to,
      subject: `✅ Post publicado: ${body.title}`,
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
