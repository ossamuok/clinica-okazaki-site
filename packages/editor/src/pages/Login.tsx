import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    | { type: "idle" }
    | { type: "loading" }
    | { type: "sent" }
    | { type: "error"; message: string }
  >({ type: "idle" });

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus({ type: "loading" });
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }
    setStatus({ type: "sent" });
  }

  return (
    <div className="min-h-screen grid place-items-center px-6 bg-paper">
      <div className="w-full max-w-md">
        <div className="card">
          <p className="eyebrow mb-3">Acesso restrito</p>
          <h1 className="mb-2">Editor de Blog · Clínica Okazaki</h1>
          <p className="text-sm text-muted mb-6">
            Receba um link mágico no seu email cadastrado para entrar.
          </p>

          {status.type === "sent" ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              Link enviado para <strong>{email}</strong>. Confira a caixa de
              entrada (e a lixeira/spam).
            </div>
          ) : (
            <form onSubmit={send} className="space-y-4">
              <div>
                <label htmlFor="email" className="label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="seu@email.com"
                  disabled={status.type === "loading"}
                />
              </div>

              {status.type === "error" ? (
                <p className="text-sm text-danger">{status.message}</p>
              ) : null}

              <button
                type="submit"
                disabled={status.type === "loading" || !email}
                className="btn-primary w-full"
              >
                {status.type === "loading"
                  ? "Enviando..."
                  : "Enviar magic link"}
              </button>
            </form>
          )}
        </div>

        <p className="text-xs text-muted text-center mt-6">
          Apenas usuários previamente convidados podem entrar.
        </p>
      </div>
    </div>
  );
}
