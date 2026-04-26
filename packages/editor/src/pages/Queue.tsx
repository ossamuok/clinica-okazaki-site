import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Edit2, Trash2, ExternalLink } from "lucide-react";
import { supabase } from "../lib/supabase";
import { isDateFree } from "../lib/scheduling";
import type { DraftRow, QueueRow } from "../lib/types";

type QueueWithDraft = QueueRow & { draft: Pick<DraftRow, "title" | "slug" | "pillar" | "status"> };

export default function Queue() {
  const [items, setItems] = useState<QueueWithDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_publish_queue")
      .select("*, draft:blog_drafts(title, slug, pillar, status)")
      .is("published_at", null)
      .order("scheduled_for", { ascending: true });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setItems((data as QueueWithDraft[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function reschedule(item: QueueWithDraft) {
    const cur = new Date(item.scheduled_for);
    const next = window.prompt(
      "Nova data e hora (ISO ou YYYY-MM-DDTHH:mm BRT):",
      toLocalInput(cur),
    );
    if (!next) return;
    const target = new Date(next);
    if (isNaN(target.getTime())) {
      window.alert("Data inválida.");
      return;
    }
    const free = await isDateFree(target);
    if (!free) {
      window.alert("Já há post agendado nesta data. Escolha outra.");
      return;
    }
    const { error } = await supabase
      .from("blog_publish_queue")
      .update({ scheduled_for: target.toISOString() })
      .eq("id", item.id);
    if (error) {
      window.alert("Erro: " + error.message);
      return;
    }
    load();
  }

  async function removeFromQueue(item: QueueWithDraft) {
    if (!window.confirm("Remover da fila? O rascunho voltará para 'pending_review'.")) return;
    // Service role obrigatório para DELETE em queue. Frontend só
    // marca status do draft de volta para pending. n8n descarta queue
    // entry quando vê status mudou.
    // Workaround: UPDATE drafts.status='pending_review' (volta) e
    // o Publicador checa status do draft antes de publicar.
    // Por ora, melhor: arquivar o draft.
    const { error } = await supabase
      .from("blog_drafts")
      .update({ status: "pending_review", reviewer_notes: "Removido da fila no editor" })
      .eq("id", item.draft_id);
    if (error) {
      window.alert("Erro: " + error.message);
      return;
    }
    // Tenta deletar a entry — pode falhar por RLS (nesse caso fica órfã p/ n8n limpar)
    await supabase.from("blog_publish_queue").delete().eq("id", item.id);
    load();
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <header className="flex items-baseline justify-between mb-8">
        <div>
          <p className="eyebrow mb-2">Fila</p>
          <h1>Publicações agendadas</h1>
        </div>
        <p className="text-sm text-muted">
          {loading ? "Carregando..." : `${items.length} agendamento(s)`}
        </p>
      </header>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-danger">
          {error}
        </div>
      ) : loading ? (
        <p className="text-sm text-muted">Carregando...</p>
      ) : items.length === 0 ? (
        <div className="card text-center py-12 text-muted">
          <Calendar className="h-8 w-8 mx-auto mb-3 text-ink-100" aria-hidden />
          <p className="text-sm">Nenhuma publicação agendada.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id}>
              <QueueItemRow
                item={item}
                onReschedule={() => reschedule(item)}
                onRemove={() => removeFromQueue(item)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function QueueItemRow({
  item,
  onReschedule,
  onRemove,
}: {
  item: QueueWithDraft;
  onReschedule: () => void;
  onRemove: () => void;
}) {
  const date = new Date(item.scheduled_for);
  const dateLabel = date.toLocaleString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const isPast = date < new Date();
  return (
    <div className="card flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={isPast ? "pill-warning" : "pill"}
          >
            {isPast ? "Atrasado" : "Agendado"}
          </span>
          <span className="text-xs text-muted">{item.draft.pillar}</span>
        </div>
        <p className="font-medium text-navy-900 truncate">{item.draft.title}</p>
        <p className="text-xs text-muted mt-1">
          <time dateTime={item.scheduled_for}>{dateLabel}</time>
          {item.attempt_count > 0 ? (
            <span> · {item.attempt_count} tentativa(s)</span>
          ) : null}
          {item.last_error ? (
            <span className="text-danger"> · erro: {item.last_error.slice(0, 60)}</span>
          ) : null}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          to={`/drafts/${item.draft_id}`}
          className="btn-ghost text-xs"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Abrir
        </Link>
        <button
          type="button"
          onClick={onReschedule}
          className="btn-ghost text-xs"
        >
          <Edit2 className="h-3.5 w-3.5" />
          Reagendar
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="btn-ghost text-xs text-danger"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remover
        </button>
      </div>
    </div>
  );
}

function toLocalInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
