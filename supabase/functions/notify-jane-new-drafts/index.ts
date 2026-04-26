/**
 * notify-jane-new-drafts
 *
 * Trigger: HTTP POST do n8n Gerador após inserir drafts.
 * Envia email para Dra. Jane com link p/ inbox do editor.
 *
 * Body:
 * {
 *   to: string,                       // Email Jane
 *   drafts: { id: string; title: string; pillar: string }[]
 * }
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { sendEmail, editorUrl, corsHeaders } from "../_shared/email.ts";

type Body = {
  to: string;
  drafts: { id: string; title: string; pillar: string }[];
};

const PILLAR_LABELS: Record<string, string> = {
  gastroenterologia: "Gastroenterologia",
  endoscopia: "Endoscopia",
  colonoscopia: "Colonoscopia",
  hepatologia: "Hepatologia",
  geriatria: "Geriatria",
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

  if (!body.to || !Array.isArray(body.drafts) || body.drafts.length === 0) {
    return json({ error: "missing_fields" }, 400);
  }

  const subject =
    body.drafts.length === 1
      ? "1 novo rascunho de blog para revisar"
      : `${body.drafts.length} novos rascunhos de blog para revisar`;

  const items = body.drafts
    .map((d) => {
      const pillar = PILLAR_LABELS[d.pillar] ?? d.pillar;
      const link = editorUrl(`/drafts/${d.id}`);
      return `<li style="margin-bottom:10px"><a href="${link}" style="color:#148A8E;text-decoration:none;font-weight:600">${escapeHtml(d.title)}</a><br/><span style="color:#56696D;font-size:13px">${pillar}</span></li>`;
    })
    .join("");

  const html = `
<!doctype html>
<html lang="pt-BR">
  <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;background:#FBFCFC;color:#0B1518;margin:0;padding:24px">
    <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #E4E9EA;border-radius:16px;padding:32px">
      <p style="text-transform:uppercase;letter-spacing:2px;font-size:11px;color:#148A8E;font-weight:600;margin:0 0 12px">Centro Clínico Okazaki · Blog</p>
      <h1 style="font-size:22px;color:#0A2540;margin:0 0 8px">Olá, Dra. Jane</h1>
      <p style="color:#56696D;line-height:1.6;margin:0 0 20px">
        Há ${body.drafts.length === 1 ? "um novo rascunho" : `${body.drafts.length} novos rascunhos`} aguardando sua revisão no editor:
      </p>
      <ul style="list-style:none;padding:0;margin:0 0 24px">${items}</ul>
      <a href="${editorUrl("/inbox")}" style="display:inline-block;background:#148A8E;color:#fff;text-decoration:none;padding:12px 24px;border-radius:9999px;font-weight:600">Abrir inbox</a>
      <p style="color:#56696D;font-size:12px;margin:24px 0 0;line-height:1.5">
        Você pode revisar, editar, aprovar, rejeitar ou pedir nova versão de cada rascunho.
      </p>
    </div>
    <p style="text-align:center;color:#56696D;font-size:11px;margin:16px 0 0">
      Mensagem automática · Centro Clínico Okazaki
    </p>
  </body>
</html>`.trim();

  try {
    const result = await sendEmail({ to: body.to, subject, html });
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
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
