import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { SettingRow } from "../lib/types";

type SettingsForm = {
  generator_paused: boolean;
  generator_pause_threshold: number;
  publish_cadence_days: number;
  publish_max_per_day: number;
  publish_hour: number;
  publish_tz: string;
};

const DEFAULTS: SettingsForm = {
  generator_paused: false,
  generator_pause_threshold: 12,
  publish_cadence_days: 7,
  publish_max_per_day: 1,
  publish_hour: 9,
  publish_tz: "America/Recife",
};

export default function Settings() {
  const [form, setForm] = useState<SettingsForm>(DEFAULTS);
  const [bufferCount, setBufferCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const [settingsRes, bufferRes] = await Promise.all([
      supabase.from("blog_settings").select("*"),
      supabase
        .from("blog_drafts")
        .select("id", { count: "exact", head: true })
        .in("status", ["pending_review", "approved"]),
    ]);
    if (settingsRes.error) {
      setError(settingsRes.error.message);
      setLoading(false);
      return;
    }
    const map = Object.fromEntries(
      (settingsRes.data as SettingRow[]).map((r) => [r.key, r.value]),
    );
    setForm({
      generator_paused: parseBool(map.generator_paused, DEFAULTS.generator_paused),
      generator_pause_threshold: parseNum(
        map.generator_pause_threshold,
        DEFAULTS.generator_pause_threshold,
      ),
      publish_cadence_days: parseNum(map.publish_cadence_days, DEFAULTS.publish_cadence_days),
      publish_max_per_day: parseNum(map.publish_max_per_day, DEFAULTS.publish_max_per_day),
      publish_hour: parseNum(map.publish_hour, DEFAULTS.publish_hour),
      publish_tz: typeof map.publish_tz === "string" ? map.publish_tz : DEFAULTS.publish_tz,
    });
    setBufferCount(bufferRes.count ?? 0);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    setSaving(true);
    setMessage(null);
    setError(null);
    const updates: { key: string; value: unknown }[] = [
      { key: "generator_paused", value: form.generator_paused },
      { key: "generator_pause_threshold", value: form.generator_pause_threshold },
      { key: "publish_cadence_days", value: form.publish_cadence_days },
      { key: "publish_max_per_day", value: form.publish_max_per_day },
      { key: "publish_hour", value: form.publish_hour },
      { key: "publish_tz", value: form.publish_tz },
    ];
    for (const u of updates) {
      const { error } = await supabase
        .from("blog_settings")
        .update({ value: u.value, updated_at: new Date().toISOString() })
        .eq("key", u.key);
      if (error) {
        setError(`Erro em ${u.key}: ${error.message}`);
        setSaving(false);
        return;
      }
    }
    setMessage("Configurações salvas.");
    setSaving(false);
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto px-6 py-10 text-muted">Carregando...</div>;
  }

  const aboveThreshold =
    bufferCount !== null && bufferCount >= form.generator_pause_threshold;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      <header>
        <p className="eyebrow mb-2">Configurações</p>
        <h1>Gerador e publicação</h1>
      </header>

      {bufferCount !== null ? (
        <div
          className={`card border ${aboveThreshold ? "border-amber-300 bg-amber-50" : "border-line"}`}
        >
          <p className="text-sm text-ink-500">
            Buffer atual:{" "}
            <strong className="text-navy-900">{bufferCount}</strong> rascunho(s)
            (status pending_review ou approved). Threshold de pausa:{" "}
            <strong>{form.generator_pause_threshold}</strong>.
            {aboveThreshold ? (
              <span className="text-warning ml-2">
                ⚠ Buffer atingiu threshold — gerador deveria estar pausado
                automaticamente.
              </span>
            ) : null}
          </p>
        </div>
      ) : null}

      <section className="card space-y-5">
        <h2>Gerador</h2>
        <Field
          label="Pausar gerador"
          help="Quando ligado, n8n Gerador semanal não cria novos rascunhos."
        >
          <ToggleSwitch
            checked={form.generator_paused}
            onChange={(v) => setForm({ ...form, generator_paused: v })}
          />
        </Field>
        <Field
          label="Threshold de pausa automática"
          help="Pausa automática quando rascunhos pendentes/aprovados ≥ este número."
        >
          <input
            type="number"
            min={1}
            max={100}
            className="input w-32"
            value={form.generator_pause_threshold}
            onChange={(e) =>
              setForm({
                ...form,
                generator_pause_threshold: parseInt(e.target.value, 10) || 1,
              })
            }
          />
        </Field>
      </section>

      <section className="card space-y-5">
        <h2>Publicação</h2>
        <Field
          label="Cadência (dias entre posts)"
          help="Usado pelo botão 'Sugerir próxima data' no editor."
        >
          <input
            type="number"
            min={1}
            max={30}
            className="input w-32"
            value={form.publish_cadence_days}
            onChange={(e) =>
              setForm({
                ...form,
                publish_cadence_days: parseInt(e.target.value, 10) || 1,
              })
            }
          />
        </Field>
        <Field
          label="Máximo de posts por dia"
          help="Cap rígido aplicado pelo n8n Publicador."
        >
          <input
            type="number"
            min={1}
            max={5}
            className="input w-32"
            value={form.publish_max_per_day}
            onChange={(e) =>
              setForm({
                ...form,
                publish_max_per_day: parseInt(e.target.value, 10) || 1,
              })
            }
          />
        </Field>
        <Field
          label="Hora de publicação (BRT)"
          help="Hora padrão sugerida para nextFreeSlot."
        >
          <input
            type="number"
            min={0}
            max={23}
            className="input w-32"
            value={form.publish_hour}
            onChange={(e) =>
              setForm({
                ...form,
                publish_hour: parseInt(e.target.value, 10),
              })
            }
          />
        </Field>
        <Field label="Timezone" help="IANA timezone — não alterar sem motivo.">
          <input
            type="text"
            className="input w-64 font-mono text-sm"
            value={form.publish_tz}
            onChange={(e) => setForm({ ...form, publish_tz: e.target.value })}
          />
        </Field>
      </section>

      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {message ? <p className="text-sm text-success">{message}</p> : null}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="btn-primary"
        >
          <Save className="h-4 w-4" />
          {saving ? "Salvando..." : "Salvar configurações"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-4 items-start">
      <div>
        <p className="label !mb-1">{label}</p>
        {help ? <p className="text-xs text-muted">{help}</p> : null}
      </div>
      <div className="md:justify-self-end">{children}</div>
    </div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
        checked ? "bg-teal-500" : "bg-ink-100"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function parseBool(v: unknown, def: boolean): boolean {
  if (typeof v === "boolean") return v;
  return def;
}

function parseNum(v: unknown, def: number): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = parseFloat(v);
    return isNaN(n) ? def : n;
  }
  return def;
}
