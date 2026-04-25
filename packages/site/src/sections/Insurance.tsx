import { Info } from "lucide-react";
import { SectionTitle } from "../components/SectionTitle";
import { INSURANCES } from "../lib/constants";

export function Insurance() {
  return (
    <section id="convenios" className="section bg-paper-2 border-y border-line">
      <div className="container-page">
        <SectionTitle
          eyebrow="convênios aceitos"
          title="Atendimento pelos principais planos de saúde"
          subtitle="15 convênios e também atendimento particular. Antes de agendar, confira a cobertura do seu plano com a nossa equipe."
        />

        <div className="mt-10 md:mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {INSURANCES.map((ins) => (
            <div
              key={ins.name}
              className="bg-paper border border-line rounded-xl px-5 py-4 hover:border-teal hover:bg-teal-wash/40 transition-colors"
            >
              <p className="font-semibold text-ink">{ins.name}</p>
              <p className="text-xs text-muted mt-1">{ins.coverage}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 callout">
          <Info className="h-5 w-5 shrink-0 text-teal-deep mt-0.5" aria-hidden />
          <p className="text-sm leading-relaxed">
            <strong className="text-ink">Antes do agendamento:</strong> a
            cobertura varia por tipo de plano, procedimento e unidade. Nossa
            secretaria confirma a aceitação do seu convênio e orienta o que é
            necessário.
          </p>
        </div>
      </div>
    </section>
  );
}
