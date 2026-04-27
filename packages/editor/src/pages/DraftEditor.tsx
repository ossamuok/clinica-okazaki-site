import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Send, X, Archive, ArchiveRestore, RefreshCcw, Sparkles } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/auth-context";
import { nextFreeSlot, isDateFree } from "../lib/scheduling";
import type { DraftRow } from "../lib/types";
import type { BlogPost, Block, Section } from "@okazaki/shared-renderer/types";
import { PostBody } from "@okazaki/shared-renderer/components";

const RESTRUCTURE_WEBHOOK_URL =
  (import.meta.env.VITE_RESTRUCTURE_WEBHOOK_URL as string) ||
  "https://automacoes-n8n.adhgqk.easypanel.host/webhook/blog-reestruturar";
const RESTRUCTURE_WEBHOOK_SECRET = import.meta.env
  .VITE_RESTRUCTURE_WEBHOOK_SECRET as string | undefined;

type EditState = {
  title: string;
  lead: string;
  body: string;
};

function blocksToMarkdown(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "p":
          return b.text;
        case "h3":
          return `### ${b.text}`;
        case "ul":
          return b.items.map((i) => `- ${i}`).join("\n");
        case "callout":
          return `> 💡 ${b.text}`;
        case "warning":
          return `> ⚠️ ${b.text}`;
        case "inline-cta":
          return `[CTA${b.label ? ` · ${b.label}` : ""}] ${b.text}`;
        case "video":
          return `[VÍDEO YouTube: ${b.youtubeId}]${b.caption ? ` ${b.caption}` : ""}`;
        case "link":
          return `[LINK: ${b.label}](${b.href})`;
      }
    })
    .filter(Boolean)
    .join("\n\n");
}

function sectionsToMarkdown(sections: Section[]): string {
  return sections
    .map((s) => `## ${s.h2}\n\n${blocksToMarkdown(s.blocks)}`)
    .join("\n\n");
}

function bodyFromContent(content: BlogPost): string {
  let text = sectionsToMarkdown(content.sections);
  if (content.faqs?.length) {
    text +=
      "\n\n## Perguntas frequentes\n\n" +
      content.faqs.map((f) => `**${f.q}**\n\n${f.a}`).join("\n\n");
  }
  return text;
}

function slugify(s: string): string {
  return (
    s
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60) || "secao"
  );
}

function parseMarkdownBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  const lines = text.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.replace(/^###\s+/, "").trim() });
      i++;
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].replace(/^-\s+/, "").trim());
        i++;
      }
      blocks.push({ type: "ul", items });
    } else if (line.startsWith(">")) {
      const stripped = line.replace(/^>\s*/, "").trim();
      if (/^⚠️|warning|atenção|alerta/i.test(stripped)) {
        blocks.push({
          type: "warning",
          text: stripped.replace(/^⚠️\s*/, "").trim(),
        });
      } else {
        blocks.push({
          type: "callout",
          text: stripped.replace(/^💡\s*/, "").trim(),
        });
      }
      i++;
    } else {
      const para: string[] = [line];
      i++;
      while (
        i < lines.length &&
        lines[i].trim() &&
        !lines[i].startsWith("##") &&
        !lines[i].startsWith("- ") &&
        !lines[i].startsWith(">")
      ) {
        para.push(lines[i]);
        i++;
      }
      blocks.push({ type: "p", text: para.join(" ").trim() });
    }
  }
  return blocks;
}

function parseMarkdownToSections(body: string): Section[] {
  const sections: Section[] = [];
  const parts = body.split(/(?=^##\s)/m);
  let leading = "";
  for (const part of parts) {
    if (!part.trim()) continue;
    if (part.startsWith("## ")) {
      const firstNl = part.indexOf("\n");
      const h2 = part.slice(3, firstNl === -1 ? undefined : firstNl).trim();
      const rest = firstNl === -1 ? "" : part.slice(firstNl + 1);
      const blocks = parseMarkdownBlocks(rest);
      if (blocks.length === 0) blocks.push({ type: "p", text: "" });
      sections.push({ id: slugify(h2), h2, blocks });
    } else {
      leading += part;
    }
  }
  if (leading.trim() && sections.length === 0) {
    sections.push({
      id: "introducao",
      h2: "Introdução",
      blocks: parseMarkdownBlocks(leading),
    });
  }
  if (sections.length === 0) {
    sections.push({
      id: "vazio",
      h2: "Conteúdo",
      blocks: [{ type: "p", text: "" }],
    });
  }
  return sections;
}

export default function DraftEditor() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [draft, setDraft] = useState<DraftRow | null>(null);
  const [edit, setEdit] = useState<EditState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [validation, setValidation] = useState<string | null>(null);
  const [scheduledFor, setScheduledFor] = useState<string>("");
  const [restructuring, setRestructuring] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    supabase
      .from("blog_drafts")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          setError(error?.message ?? "Rascunho não encontrado");
          setLoading(false);
          return;
        }
        const row = data as DraftRow;
        const content = row.content_json as BlogPost;
        setDraft(row);
        setEdit({
          title: row.title,
          lead: content.lead ?? "",
          body: bodyFromContent(content),
        });
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function persistRaw() {
    if (!edit || !draft) return false;
    setSaving(true);
    setValidation(null);
    const content = draft.content_json as BlogPost;
    const merged: BlogPost = {
      ...content,
      title: edit.title,
      lead: edit.lead,
    };
    (merged as BlogPost & { _raw_body?: string })._raw_body = edit.body;
    const { error: e } = await supabase
      .from("blog_drafts")
      .update({
        title: edit.title,
        content_json: merged,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    setSaving(false);
    if (e) {
      setValidation(e.message);
      return false;
    }
    return true;
  }

  async function callRestructure(): Promise<boolean> {
    if (!edit || !draft) return false;
    setRestructuring(true);
    setValidation(null);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (RESTRUCTURE_WEBHOOK_SECRET) {
        headers["Authorization"] = `Bearer ${RESTRUCTURE_WEBHOOK_SECRET}`;
      }
      const res = await fetch(RESTRUCTURE_WEBHOOK_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          draft_id: id,
          title: edit.title,
          lead: edit.lead,
          body: edit.body,
          pillar: draft.pillar,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Webhook ${res.status}: ${text.slice(0, 200)}`);
      }
      const data = await res.json();
      if (!data.ok) throw new Error("Webhook retornou ok=false");
      const { data: refreshed } = await supabase
        .from("blog_drafts")
        .select("*")
        .eq("id", id)
        .single();
      if (refreshed) setDraft(refreshed as DraftRow);
      return true;
    } catch (e) {
      setValidation("Falha ao reestruturar: " + (e as Error).message);
      return false;
    } finally {
      setRestructuring(false);
    }
  }

  async function handleSave() {
    await persistRaw();
  }

  async function handleApprove() {
    if (!edit || !scheduledFor || !session) {
      setValidation("Escolha uma data de publicação antes de aprovar.");
      return;
    }
    const target = new Date(scheduledFor);
    if (isNaN(target.getTime())) {
      setValidation("Data inválida.");
      return;
    }
    const free = await isDateFree(target);
    if (!free) {
      setValidation(
        "Já há um post agendado para este dia. Escolha outra data.",
      );
      return;
    }
    const okPersist = await persistRaw();
    if (!okPersist) return;
    const okRestructure = await callRestructure();
    if (!okRestructure) return;
    setSaving(true);
    const { error: uErr } = await supabase
      .from("blog_drafts")
      .update({
        status: "approved",
        reviewer_user_id: session.user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (uErr) {
      setValidation("Falha ao aprovar: " + uErr.message);
      setSaving(false);
      return;
    }
    const { error: qErr } = await supabase.from("blog_publish_queue").insert({
      draft_id: id,
      scheduled_for: target.toISOString(),
    });
    if (qErr) {
      setValidation("Aprovou mas falhou ao agendar: " + qErr.message);
      setSaving(false);
      return;
    }
    navigate("/inbox");
  }

  async function handleReject() {
    if (!session) return;
    const reason = window.prompt("Motivo da rejeição (opcional):") ?? "";
    setSaving(true);
    const { error: e } = await supabase
      .from("blog_drafts")
      .update({
        status: "rejected",
        reviewer_user_id: session.user.id,
        reviewed_at: new Date().toISOString(),
        rejection_reason: reason || null,
      })
      .eq("id", id);
    setSaving(false);
    if (!e) navigate("/inbox");
    else setValidation(e.message);
  }

  async function handleArchive() {
    if (!session) return;
    if (!window.confirm("Arquivar este rascunho?")) return;
    setSaving(true);
    const { error: e } = await supabase
      .from("blog_drafts")
      .update({
        status: "archived",
        reviewer_user_id: session.user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);
    setSaving(false);
    if (!e) navigate("/inbox");
    else setValidation(e.message);
  }

  async function handleUnarchive() {
    if (!session) return;
    if (!window.confirm("Desarquivar este rascunho? Volta para revisão.")) return;
    setSaving(true);
    const { error: e, data } = await supabase
      .from("blog_drafts")
      .update({
        status: "pending_review",
        reviewer_user_id: session.user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();
    setSaving(false);
    if (!e && data) setDraft(data as DraftRow);
    else if (e) setValidation(e.message);
  }

  async function handleRequestNewVersion() {
    if (!session) return;
    const note = window.prompt("Notas para o gerador (o que mudar):");
    if (note === null) return;
    setSaving(true);
    const { error: e } = await supabase
      .from("blog_drafts")
      .update({
        status: "pending_review",
        reviewer_user_id: session.user.id,
        reviewed_at: new Date().toISOString(),
        reviewer_notes: note,
      })
      .eq("id", id);
    setSaving(false);
    if (!e) navigate("/inbox");
    else setValidation(e.message);
  }

  async function suggestNextSlot() {
    try {
      const next = await nextFreeSlot();
      setScheduledFor(toLocalInput(next));
    } catch (e) {
      setValidation((e as Error).message);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10 text-muted">
        Carregando rascunho...
      </div>
    );
  }
  if (error || !draft || !edit) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <p className="text-danger text-sm">Erro: {error}</p>
        <Link to="/inbox" className="btn-ghost mt-4">
          Voltar
        </Link>
      </div>
    );
  }

  const readOnly =
    draft.status === "published" || draft.status === "archived";

  const previewSections = useMemo(
    () => parseMarkdownToSections(edit.body),
    [edit.body],
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link to="/inbox" className="btn-ghost">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <div className="text-xs text-muted">
          status:{" "}
          <span className="font-medium text-ink-900">{draft.status}</span>
          {" · "}
          pilar:{" "}
          <span className="font-medium text-ink-900">{draft.pillar}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
      <section className="card space-y-6">
        <div>
          <label className="label">Título</label>
          <input
            type="text"
            className="input text-lg"
            value={edit.title}
            onChange={(e) => setEdit({ ...edit, title: e.target.value })}
            disabled={readOnly}
          />
        </div>

        <div>
          <label className="label">Subtítulo / Lead</label>
          <textarea
            className="input min-h-[80px]"
            value={edit.lead}
            onChange={(e) => setEdit({ ...edit, lead: e.target.value })}
            disabled={readOnly}
            placeholder="Parágrafo introdutório (1-3 frases)"
          />
        </div>

        <div>
          <label className="label">
            Corpo do post
            <span className="ml-2 text-xs font-normal text-muted">
              Markdown — `## Título da seção`, `- item de lista`, parágrafos
              separados por linha em branco
            </span>
          </label>
          <textarea
            className="input min-h-[480px] font-mono text-sm leading-relaxed"
            value={edit.body}
            onChange={(e) => setEdit({ ...edit, body: e.target.value })}
            disabled={readOnly}
            spellCheck
          />
          <p className="text-xs text-muted mt-2">
            A IA reorganiza estrutura (slug, SEO, FAQs, blocos) ao aprovar.
            Você foca apenas no texto médico.
          </p>
        </div>
      </section>

      <section className="card mt-6 space-y-4">
        <h2>Aprovar e agendar</h2>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="label">Data e hora de publicação (BRT)</label>
            <input
              type="datetime-local"
              className="input"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              disabled={readOnly}
            />
          </div>
          <button
            type="button"
            onClick={suggestNextSlot}
            className="btn-secondary"
            disabled={readOnly}
          >
            Sugerir próxima data
          </button>
        </div>
        {validation ? (
          <p className="text-sm text-danger">{validation}</p>
        ) : null}
        {restructuring ? (
          <p className="text-sm text-teal-700">
            <Sparkles className="inline h-4 w-4 mr-1" />
            IA reorganizando estrutura...
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || restructuring || readOnly}
            className="btn-secondary"
          >
            <Save className="h-4 w-4" />
            Salvar rascunho
          </button>
          <button
            type="button"
            onClick={handleApprove}
            disabled={saving || restructuring || readOnly}
            className="btn-primary"
          >
            <Send className="h-4 w-4" />
            Aprovar e agendar
          </button>
          <button
            type="button"
            onClick={handleReject}
            disabled={saving || restructuring || readOnly}
            className="btn-danger"
          >
            <X className="h-4 w-4" />
            Rejeitar
          </button>
          <button
            type="button"
            onClick={handleRequestNewVersion}
            disabled={saving || restructuring || readOnly}
            className="btn-ghost"
          >
            <RefreshCcw className="h-4 w-4" />
            Pedir nova versão
          </button>
          {draft.status === "archived" ? (
            <button
              type="button"
              onClick={handleUnarchive}
              disabled={saving || restructuring}
              className="btn-ghost"
            >
              <ArchiveRestore className="h-4 w-4" />
              Desarquivar
            </button>
          ) : (
            <button
              type="button"
              onClick={handleArchive}
              disabled={saving || restructuring || readOnly}
              className="btn-ghost"
            >
              <Archive className="h-4 w-4" />
              Arquivar
            </button>
          )}
        </div>
      </section>
        </div>

        <aside className="lg:sticky lg:top-6 self-start">
          <div className="card max-h-[85vh] overflow-y-auto">
            <p className="eyebrow mb-2">Preview</p>
            <p className="text-xs text-muted mb-4">
              Renderização aproximada do post — estilos finais aplicados após
              IA reestruturar e site gerar build.
            </p>
            <article className="prose prose-sm max-w-none">
              <p className="text-xs text-teal-600 font-mono uppercase tracking-wider">
                BLOG · {draft.pillar.toUpperCase()}
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-navy-900 mt-2">
                {edit.title || "(sem título)"}
              </h1>
              {edit.lead ? (
                <p className="text-base text-ink-500 leading-relaxed">
                  {edit.lead}
                </p>
              ) : null}
              <hr className="my-4 border-line" />
              <PostBody
                sections={previewSections}
                config={{ ctaUrl: "https://wa.me/5581999540570" }}
              />
            </article>
          </div>
        </aside>
      </div>
    </div>
  );
}

function toLocalInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
