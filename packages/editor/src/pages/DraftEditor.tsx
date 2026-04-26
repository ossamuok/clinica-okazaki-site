import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Send, X, Archive, RefreshCcw } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/auth-context";
import { nextFreeSlot, isDateFree } from "../lib/scheduling";
import type { DraftRow } from "../lib/types";
import type { BlogPost } from "@okazaki/shared-renderer/types";
import { BlogPostSchema } from "@okazaki/shared-renderer/schema";
import { PreviewPane } from "../components/PreviewPane";
import { BlockEditor } from "../components/BlockEditor";

type EditState = {
  title: string;
  slug: string;
  meta_description: string;
  keywords: string;
  excerpt: string;
  content: BlogPost;
};

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
          slug: row.slug,
          meta_description: row.meta_description,
          keywords: (row.keywords ?? []).join(", "),
          excerpt: content.excerpt ?? "",
          content,
        });
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const previewPost = useMemo<BlogPost | null>(() => {
    if (!edit) return null;
    return {
      ...edit.content,
      title: edit.title,
      slug: edit.slug,
      meta_description: edit.meta_description,
      keywords: edit.keywords,
      excerpt: edit.excerpt,
    };
  }, [edit]);

  async function persistDraft(updates: Partial<DraftRow>) {
    setSaving(true);
    setValidation(null);
    const payload = {
      title: edit!.title,
      slug: edit!.slug,
      meta_description: edit!.meta_description,
      keywords: edit!.keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
      content_json: {
        ...edit!.content,
        title: edit!.title,
        slug: edit!.slug,
        meta_description: edit!.meta_description,
        excerpt: edit!.excerpt,
        keywords: edit!.keywords,
      },
      ...updates,
    };
    const { error: e } = await supabase
      .from("blog_drafts")
      .update(payload)
      .eq("id", id);
    setSaving(false);
    if (e) {
      setValidation(e.message);
      return false;
    }
    return true;
  }

  async function handleSave() {
    const ok = await persistDraft({});
    if (ok) {
      // optimistic — reload
      const { data } = await supabase
        .from("blog_drafts")
        .select("*")
        .eq("id", id)
        .single();
      if (data) setDraft(data as DraftRow);
    }
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
    setSaving(true);
    setValidation(null);
    const free = await isDateFree(target);
    if (!free) {
      setValidation(
        "Já há um post agendado para este dia. Escolha outra data.",
      );
      setSaving(false);
      return;
    }
    const parsed = BlogPostSchema.safeParse({
      ...edit.content,
      title: edit.title,
      slug: edit.slug,
      meta_description: edit.meta_description,
      excerpt: edit.excerpt,
      keywords: edit.keywords,
    });
    if (!parsed.success) {
      setValidation(
        "Validação falhou: " +
          parsed.error.issues.map((i) => i.message).join("; "),
      );
      setSaving(false);
      return;
    }
    const ok = await persistDraft({
      status: "approved",
      reviewer_user_id: session.user.id,
      reviewed_at: new Date().toISOString(),
    });
    if (!ok) return;
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
    const ok = await persistDraft({
      status: "rejected",
      reviewer_user_id: session.user.id,
      reviewed_at: new Date().toISOString(),
      rejection_reason: reason || null,
    });
    setSaving(false);
    if (ok) navigate("/inbox");
  }

  async function handleArchive() {
    if (!session) return;
    if (!window.confirm("Arquivar este rascunho?")) return;
    setSaving(true);
    const ok = await persistDraft({
      status: "archived",
      reviewer_user_id: session.user.id,
      reviewed_at: new Date().toISOString(),
    });
    setSaving(false);
    if (ok) navigate("/inbox");
  }

  async function handleRequestNewVersion() {
    if (!session) return;
    const note = window.prompt(
      "Notas para o gerador (o que mudar):",
    );
    if (note === null) return;
    setSaving(true);
    const ok = await persistDraft({
      status: "pending_review",
      reviewer_user_id: session.user.id,
      reviewed_at: new Date().toISOString(),
      reviewer_notes: note,
    });
    setSaving(false);
    if (ok) navigate("/inbox");
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
      <div className="max-w-6xl mx-auto px-6 py-10 text-muted">
        Carregando rascunho...
      </div>
    );
  }
  if (error || !draft || !edit || !previewPost) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-danger text-sm">Erro: {error}</p>
        <Link to="/inbox" className="btn-ghost mt-4">
          Voltar
        </Link>
      </div>
    );
  }

  const readOnly = draft.status === "published" || draft.status === "archived";

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
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* LEFT — form */}
        <div className="space-y-6">
          <section className="card">
            <h2 className="mb-4">Metadados</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Título (max ~120 chars)</label>
                <input
                  className="input"
                  value={edit.title}
                  onChange={(e) =>
                    setEdit({ ...edit, title: e.target.value })
                  }
                  disabled={readOnly}
                />
              </div>
              <div>
                <label className="label">Slug (kebab-case)</label>
                <input
                  className="input font-mono"
                  value={edit.slug}
                  onChange={(e) =>
                    setEdit({ ...edit, slug: e.target.value })
                  }
                  disabled={readOnly}
                />
              </div>
              <div>
                <label className="label">
                  Meta description (140-160 chars) — atual:{" "}
                  {edit.meta_description.length}
                </label>
                <textarea
                  className="input min-h-[80px]"
                  value={edit.meta_description}
                  onChange={(e) =>
                    setEdit({ ...edit, meta_description: e.target.value })
                  }
                  disabled={readOnly}
                />
              </div>
              <div>
                <label className="label">
                  Excerpt (resumo para listagem, 40-300 chars)
                </label>
                <textarea
                  className="input min-h-[60px]"
                  value={edit.excerpt}
                  onChange={(e) =>
                    setEdit({ ...edit, excerpt: e.target.value })
                  }
                  disabled={readOnly}
                />
              </div>
              <div>
                <label className="label">Keywords (separadas por vírgula)</label>
                <textarea
                  className="input min-h-[60px]"
                  value={edit.keywords}
                  onChange={(e) =>
                    setEdit({ ...edit, keywords: e.target.value })
                  }
                  disabled={readOnly}
                />
              </div>
            </div>
          </section>

          <section className="card">
            <h2 className="mb-4">Conteúdo</h2>
            <p className="text-xs text-muted mb-4">
              Edição inline em parágrafos, h3, listas, callouts e warnings.
              Outros tipos (vídeo, link, inline-cta) preservados como vêm do
              gerador. Reordenação e adição/remoção de seções/blocos chegam em F5.
            </p>
            <div className="space-y-6">
              {edit.content.sections.map((section, sIdx) => (
                <div
                  key={section.id}
                  className="border-l-2 border-line pl-4"
                >
                  <p className="text-xs text-muted font-mono mb-1">
                    #{section.id}
                  </p>
                  <h3 className="mb-3">{section.h2}</h3>
                  <div className="space-y-3">
                    {section.blocks.map((block, bIdx) => (
                      <BlockEditor
                        key={bIdx}
                        block={block}
                        readOnly={readOnly}
                        onChange={(updated) => {
                          const sections = [...edit.content.sections];
                          const blocks = [...sections[sIdx].blocks];
                          blocks[bIdx] = updated;
                          sections[sIdx] = { ...sections[sIdx], blocks };
                          setEdit({
                            ...edit,
                            content: { ...edit.content, sections },
                          });
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <h2 className="mb-4">Aprovar e agendar</h2>
            <div className="flex items-end gap-3 mb-4">
              <div className="flex-1">
                <label className="label">
                  Data e hora de publicação (BRT)
                </label>
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
              <p className="text-sm text-danger mb-3">{validation}</p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || readOnly}
                className="btn-secondary"
              >
                <Save className="h-4 w-4" />
                Salvar rascunho
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={saving || readOnly}
                className="btn-primary"
              >
                <Send className="h-4 w-4" />
                Aprovar e agendar
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={saving || readOnly}
                className="btn-danger"
              >
                <X className="h-4 w-4" />
                Rejeitar
              </button>
              <button
                type="button"
                onClick={handleRequestNewVersion}
                disabled={saving || readOnly}
                className="btn-ghost"
              >
                <RefreshCcw className="h-4 w-4" />
                Pedir nova versão
              </button>
              <button
                type="button"
                onClick={handleArchive}
                disabled={saving || readOnly}
                className="btn-ghost"
              >
                <Archive className="h-4 w-4" />
                Arquivar
              </button>
            </div>
          </section>
        </div>

        {/* RIGHT — preview */}
        <div className="lg:sticky lg:top-6 self-start">
          <PreviewPane post={previewPost} />
        </div>
      </div>
    </div>
  );
}

function toLocalInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
