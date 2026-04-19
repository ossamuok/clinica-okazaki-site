import { UserRound } from "lucide-react";
import { SectionTitle } from "../components/SectionTitle";
import { TEAM } from "../lib/constants";

export function Team() {
  return (
    <section id="equipe" className="section bg-paper-2 border-y border-line">
      <div className="container-page">
        <SectionTitle
          eyebrow="quem cuida de você"
          title="Excelência no corpo clínico, cuidado em cada detalhe"
          subtitle="Gastroenterologistas, endoscopistas, hepatologistas, geriatras e cirurgiões do aparelho digestivo — da família fundadora à nova geração."
        />

        <div className="mt-12 md:mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((doc) => (
            <article
              key={doc.name}
              className="bg-paper border border-line rounded-card p-6 hover:border-teal hover:shadow-md transition-all flex gap-4"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-wash text-teal-deep">
                <UserRound className="h-5 w-5" strokeWidth={1.6} aria-hidden />
              </span>
              <div className="min-w-0">
                {doc.role ? (
                  <span className="text-eyebrow uppercase font-medium text-teal-deep">
                    {doc.role}
                  </span>
                ) : (
                  <span className="text-eyebrow uppercase font-medium text-muted">
                    {doc.specialty.split(" · ")[0]}
                  </span>
                )}
                <h3 className="mt-1.5 text-base font-semibold text-ink leading-tight">
                  {doc.name}
                </h3>
                <p className="mt-1 text-sm text-ink-soft leading-snug">
                  {doc.specialty}
                </p>
                {doc.crm ? (
                  <p className="mt-1 text-xs text-muted">{doc.crm}</p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
