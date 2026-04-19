import { Star, Quote, ArrowUpRight } from "lucide-react";
import { SectionTitle } from "../components/SectionTitle";
import { REVIEWS, SITE, UNITS } from "../lib/constants";

function StarRow({ size = 4 }: { size?: number }) {
  return (
    <div className="flex items-center gap-0.5 text-teal" aria-label="5 estrelas">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-${size} w-${size}`}
          strokeWidth={1.5}
          fill="currentColor"
          aria-hidden
        />
      ))}
    </div>
  );
}

export function GoogleReviews() {
  return (
    <section id="avaliacoes" className="section">
      <div className="container-page">
        <SectionTitle
          eyebrow="avaliações no google"
          title={
            <>
              2.500+ pessoas já nos confiaram seu cuidado —{" "}
              <span className="text-teal-deep">nota 5.0</span>
            </>
          }
          subtitle="As avaliações abaixo são reais e verificadas pelo Google. Leia todas clicando nos botões."
        />

        <div className="mt-12 md:mt-14 grid gap-6 lg:grid-cols-[auto_1fr] items-start">
          <div className="card flex flex-col sm:flex-row lg:flex-col gap-6 items-start lg:items-center text-center bg-gradient-to-br from-teal-wash to-cream border-teal/25">
            <div>
              <p className="text-6xl md:text-7xl font-semibold text-teal-deep leading-none">
                {SITE.rating.toFixed(1)}
              </p>
              <div className="mt-3 flex justify-center">
                <StarRow size={5} />
              </div>
              <p className="mt-3 text-sm text-ink-soft">
                Baseado em <strong>{SITE.reviewsCount.toLocaleString("pt-BR")}+</strong>{" "}
                avaliações
              </p>
            </div>
            <div className="w-full space-y-2">
              {UNITS.map((u) => (
                <a
                  key={u.slug}
                  href={u.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 text-sm bg-paper border border-line rounded-full px-4 py-2.5 hover:border-teal hover:bg-teal-wash transition-colors"
                >
                  <span className="font-medium text-ink">{u.name}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-teal-deep" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <article
                key={i}
                className="card card-hover relative overflow-hidden"
              >
                <Quote
                  className="absolute top-5 right-5 h-12 w-12 text-teal/10"
                  aria-hidden
                />
                <StarRow />
                <p className="mt-4 text-ink-soft leading-relaxed italic">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="mt-5 pt-5 border-t border-line flex items-center justify-between text-xs text-muted uppercase tracking-wider">
                  <span>Google · {r.unit}</span>
                  <span className="text-teal-deep">Verificada</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
