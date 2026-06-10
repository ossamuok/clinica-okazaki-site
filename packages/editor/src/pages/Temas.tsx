import { useEffect, useState } from "react";
import { Lightbulb, Plus, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/auth-context";
import type { BlogPillar } from "@okazaki/shared-renderer/types";
import type { BlogTopicSuggestion } from "../lib/types";

const PILLAR_LABELS: Record<BlogPillar, string> = {
  gastroenterologia: "Gastroenterologia",
  endoscopia: "Endoscopia",
  colonoscopia: "Colonoscopia",
  hepatologia: "Hepatologia",
  geriatria: "Geriatria",
};

const PILLAR_OPTIONS = Object.entries(PILLAR_LABELS) as [BlogPillar, string][];

export default function Temas() {
  const { session } = useAuth();
  const [pillar, setPillar] = useState<BlogPillar>("gastroenterologia");
  const [topicText, setTopicText] = useState("");
  const [pending, setPending] = useState<BlogTopicSuggestion[]>([]);
  const [used, setUsed] = useState<BlogTopicSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const [pendingRes, usedRes] = await Promise.all([
      supabase
        .from("blog_topic_suggestions")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: true }),
      supabase
        .from("blog_topic_suggestions")
        .select("*")
        .eq("status", "used")
        .order("used_at", { ascending: false })
        .limit(20),
    ]);
    if (pendingRes.error || usedRes.error) {
      setError((pendingRes.error ?? usedRes.error)!.message);
      setLoading(false);
      return;
    }
    setPending((pendingRes.data as BlogTopicSuggestion[]) ?? []);
    setUsed((usedRes.data as BlogTopicSuggestion[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setMessage(null);
    setError(null);
    const text = topicText.trim();
    if (!text) {
      setError("Escreva o tema antes de sugerir.");
      return;
    }
    setSubmitting(true);
    const { error: insertError } = await supabase
      .from("blog_topic_suggestions")
      .insert({ pillar, topic_text: text, suggested_by: session.user.id });
    setSubmitting(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setTopicText("");
    setMessage("Tema sugerido! Ele entrou na fila do gerador.");
    load();
  }

  async function handleDelete(s: BlogTopicSuggestion) {
    if (!window.confirm(`Excluir o tema "${s.topic_text}" da fila?`)) return;
    setMessage(null);
    setError(null);
    const { error: deleteError } = await supabase
      .from("blog_topic_suggestions")
      .delete()
      .eq("id", s.id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setPending((prev) => prev.filter((p) => p.id !== s.id));
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      <header>
        <p className="eyebrow mb-2">Temas</p>
        <h1>Sugestões de temas</h1>
        <p className="text-sm text-muted mt-2">
          Os temas sugeridos aqui são usados pelo gerador automático no próximo
          post do pilar correspondente.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-[auto_minmax(0,1fr)_auto] gap-4 items-end">
          <div>
            <label htmlFor="tema-pilar" className="label">
              Pilar
            </label>
            <select
              id="tema-pilar"
              className="input w-56"
              value={pillar}
              onChange={(e) => setPillar(e.target.value as BlogPillar)}
            >
              {PILLAR_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="tema-texto" className="label">
              Tema
            </label>
            <input
              id="tema-texto"
              type="text"
              className="input"
              placeholder='Ex: "Hepatite B na gravidez"'
              value={topicText}
              onChange={(e) => setTopicText(e.target.value)}
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary">
            <Plus className="h-4 w-4" />
            {submitting ? "Enviando..." : "Sugerir tema"}
          </button>
        </div>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        {message ? <p className="text-sm text-success">{message}</p> : null}
      </form>

      <section>
        <h2 className="mb-4">Na fila</h2>
        {loading ? (
          <p className="text-sm text-muted">Carregando temas...</p>
        ) : pending.length === 0 ? (
          <div className="card text-center py-12 text-muted">
            <Lightbulb className="h-8 w-8 mx-auto mb-3 text-ink-100" aria-hidden />
            <p className="text-sm">
              Nenhum tema na fila. Sugira o primeiro usando o formulário acima.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {pending.map((s) => (
              <li key={s.id} className="card">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="pill">
                        {PILLAR_LABELS[s.pillar] ?? s.pillar}
                      </span>
                      <span className="text-xs text-muted">
                        Sugerido em {formatDate(s.created_at)}
                      </span>
                    </div>
                    <p className="text-base text-navy-900 leading-snug">
                      {s.topic_text}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(s)}
                    className="btn-danger px-3 py-1.5 text-xs shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-4">Já usados</h2>
        {loading ? (
          <p className="text-sm text-muted">Carregando temas...</p>
        ) : used.length === 0 ? (
          <p className="text-sm text-muted">
            Nenhum tema usado ainda. Quando o gerador aproveitar uma sugestão,
            ela aparece aqui.
          </p>
        ) : (
          <ul className="space-y-2">
            {used.map((s) => (
              <li
                key={s.id}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-line bg-white"
              >
                <span className="pill bg-gray-50 text-muted border-gray-200">
                  {PILLAR_LABELS[s.pillar] ?? s.pillar}
                </span>
                <span className="text-sm text-muted truncate flex-1">
                  {s.topic_text}
                </span>
                <span className="text-xs text-muted shrink-0">
                  Usado em {s.used_at ? formatDate(s.used_at) : "—"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
