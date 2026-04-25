import { SectionTitle } from "../components/SectionTitle";
import { TEAM } from "../lib/constants";

function initials(name: string) {
  return name
    .replace(/^Dr[a]?\.\s*/i, "")
    .split(" ")
    .filter((p) => p.length > 2)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

export function Team() {
  return (
    <section id="equipe" className="section bg-paper-2 border-y border-line">
      <div className="container-page">
        <SectionTitle
          eyebrow="quem cuida de você"
          title="Excelência no corpo clínico, cuidado em cada detalhe"
          subtitle="Gastroenterologistas, endoscopistas, hepatologistas, geriatras e cirurgiões do aparelho digestivo — da família fundadora à nova geração."
        />

        <div className="mt-12 md:mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((doc) => (
            <article
              key={doc.name}
              className="bg-paper border border-line rounded-card p-5 hover:border-teal hover:shadow-md transition-all"
            >
              {/* Top row: avatar + name/crm */}
              <div className="flex gap-4">
                <div className="shrink-0 h-14 w-14 rounded-full overflow-hidden bg-teal-wash flex items-center justify-center ring-2 ring-line">
                  {doc.photo ? (
                    <img
                      src={doc.photo}
                      alt={`${doc.name} — ${doc.specialty}`}
                      className="h-full w-full object-cover object-top"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-sm font-bold text-teal-deep select-none">
                      {initials(doc.name)}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-eyebrow uppercase font-medium text-teal-deep truncate">
                    {doc.role ?? doc.specialty.split(" · ")[0]}
                  </span>
                  <h3 className="mt-1 text-sm font-semibold text-ink leading-tight">
                    {doc.name}
                  </h3>
                  {(doc.crm || doc.rqe) && (
                    <p className="mt-0.5 text-xs text-muted">
                      {[doc.crm, doc.rqe && `RQE ${doc.rqe}`]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                </div>
              </div>

              {/* Formation — full width below */}
              {doc.formation && doc.formation.length > 0 && (
                <ul className="mt-3 pt-3 border-t border-line space-y-1">
                  {doc.formation.map((f, i) => (
                    <li key={i} className="flex gap-1.5 text-xs leading-snug">
                      <span className="text-teal shrink-0 mt-0.5" aria-hidden>·</span>
                      <span className="min-w-0 break-words">
                        <span className="font-medium text-ink-soft">{f.label}</span>
                        {f.institution && (
                          <span className="text-muted"> — {f.institution}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
