import { useEffect, useState } from "react";
import { ExternalLink, GitCommit } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { DraftRow, QueueRow } from "../lib/types";

const SITE_URL = "https://www.clinicaokazaki.com";

type Published = QueueRow & {
  draft: Pick<DraftRow, "title" | "slug" | "pillar">;
};

export default function Published() {
  const [items, setItems] = useState<Published[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    supabase
      .from("blog_publish_queue")
      .select("*, draft:blog_drafts(title, slug, pillar)")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(100)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }
        setItems((data as Published[]) ?? []);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <header className="flex items-baseline justify-between mb-8">
        <div>
          <p className="eyebrow mb-2">Publicados</p>
          <h1>Posts ao vivo</h1>
        </div>
        <p className="text-sm text-muted">
          {loading ? "Carregando..." : `${items.length} post(s)`}
        </p>
      </header>

      {error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : loading ? (
        <p className="text-sm text-muted">Carregando...</p>
      ) : items.length === 0 ? (
        <div className="card text-center py-12 text-muted text-sm">
          Nenhum post publicado ainda.
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id}>
              <PublishedRow item={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PublishedRow({ item }: { item: Published }) {
  const date = new Date(item.published_at!).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const liveUrl = `${SITE_URL}/blog/${item.draft.slug}`;
  return (
    <div className="card flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="pill-success">Publicado</span>
          <span className="text-xs text-muted">{item.draft.pillar}</span>
        </div>
        <p className="font-medium text-navy-900 truncate">
          {item.draft.title}
        </p>
        <p className="text-xs text-muted mt-1">
          <time dateTime={item.published_at!}>{date}</time>
          {item.indexnow_status ? (
            <span> · IndexNow: {item.indexnow_status}</span>
          ) : null}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-xs"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Ver ao vivo
        </a>
        {item.github_commit_sha ? (
          <a
            href={`https://github.com/ossamuok/clinica-okazaki-site/commit/${item.github_commit_sha}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-xs"
            title={item.github_commit_sha}
          >
            <GitCommit className="h-3.5 w-3.5" />
            {item.github_commit_sha.slice(0, 7)}
          </a>
        ) : null}
      </div>
    </div>
  );
}
