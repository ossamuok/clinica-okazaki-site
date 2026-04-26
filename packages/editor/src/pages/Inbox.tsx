import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Inbox as InboxIcon } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { DraftRow, DraftStatus } from "../lib/types";

const PILLAR_LABELS: Record<string, string> = {
  gastroenterologia: "Gastroenterologia",
  endoscopia: "Endoscopia",
  colonoscopia: "Colonoscopia",
  hepatologia: "Hepatologia",
  geriatria: "Geriatria",
};

const STATUS_FILTERS: { value: DraftStatus | "all"; label: string }[] = [
  { value: "pending_review", label: "Pendentes" },
  { value: "approved", label: "Aprovados" },
  { value: "rejected", label: "Rejeitados" },
  { value: "archived", label: "Arquivados" },
  { value: "all", label: "Todos" },
];

export default function Inbox() {
  const [filter, setFilter] = useState<DraftStatus | "all">("pending_review");
  const [drafts, setDrafts] = useState<DraftRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    let q = supabase
      .from("blog_drafts")
      .select("*")
      .order("generated_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    q.then(({ data, error }) => {
      if (cancelled) return;
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setDrafts((data as DraftRow[]) ?? []);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [filter]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <header className="flex items-baseline justify-between mb-8">
        <div>
          <p className="eyebrow mb-2">Inbox</p>
          <h1>Rascunhos de blog</h1>
        </div>
        <p className="text-sm text-muted">
          {loading ? "Carregando..." : `${drafts.length} rascunho(s)`}
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-8">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={[
              "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
              filter === f.value
                ? "bg-teal-500 text-white border-teal-500"
                : "bg-white text-ink-500 border-line hover:border-teal-500 hover:text-teal-600",
            ].join(" ")}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-danger">
          Erro: {error}
        </div>
      ) : loading ? (
        <p className="text-sm text-muted">Carregando rascunhos...</p>
      ) : drafts.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <ul className="space-y-3">
          {drafts.map((d) => (
            <li key={d.id}>
              <DraftCard draft={d} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EmptyState({ filter }: { filter: DraftStatus | "all" }) {
  const label =
    filter === "pending_review"
      ? "Nenhum rascunho pendente. Os próximos serão gerados pelo n8n."
      : "Nada por aqui.";
  return (
    <div className="card text-center py-12 text-muted">
      <InboxIcon className="h-8 w-8 mx-auto mb-3 text-ink-100" aria-hidden />
      <p className="text-sm">{label}</p>
    </div>
  );
}

function DraftCard({ draft }: { draft: DraftRow }) {
  const date = new Date(draft.generated_at).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <Link
      to={`/drafts/${draft.id}`}
      className="block card hover:border-teal-500 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="pill">
              {PILLAR_LABELS[draft.pillar] ?? draft.pillar}
            </span>
            <StatusPill status={draft.status} />
            {draft.word_count ? (
              <span className="text-xs text-muted">
                {draft.word_count} palavras
              </span>
            ) : null}
          </div>
          <h2 className="text-base text-navy-900 mb-1 leading-snug">
            {draft.title}
          </h2>
          <p className="text-sm text-muted truncate">/blog/{draft.slug}</p>
          <p className="text-xs text-muted mt-2">
            Gerado em {date}
            {draft.generated_by ? ` · ${draft.generated_by}` : ""}
          </p>
        </div>
        <ArrowUpRight
          className="h-4 w-4 text-muted shrink-0"
          aria-hidden
        />
      </div>
    </Link>
  );
}

function StatusPill({ status }: { status: DraftStatus }) {
  const map: Record<DraftStatus, { label: string; cls: string }> = {
    pending_review: { label: "Pendente", cls: "pill-warning" },
    approved: { label: "Aprovado", cls: "pill-success" },
    rejected: {
      label: "Rejeitado",
      cls: "pill bg-red-50 text-danger border-red-200",
    },
    published: {
      label: "Publicado",
      cls: "pill bg-navy-50 text-navy-900 border-navy-100",
    },
    archived: {
      label: "Arquivado",
      cls: "pill bg-gray-50 text-muted border-gray-200",
    },
  };
  const v = map[status];
  return <span className={v.cls}>{v.label}</span>;
}
