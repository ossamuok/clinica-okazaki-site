import { SITE } from "../lib/constants";

export function ComplianceBlock() {
  return (
    <div className="mt-16 pt-8 border-t border-line text-xs text-muted leading-relaxed">
      <p>
        <strong className="text-ink-soft font-medium">
          Responsável técnico:
        </strong>{" "}
        {SITE.tecnico.nome} · {SITE.tecnico.crm} · {SITE.tecnico.rqe}
      </p>
      <p className="mt-1">
        Conteúdo informativo em conformidade com a Resolução CFM nº 2.336/2023.
        Não substitui consulta médica ou exames.
      </p>
    </div>
  );
}
