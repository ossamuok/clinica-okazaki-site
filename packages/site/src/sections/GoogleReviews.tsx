import { ArrowUpRight } from "lucide-react";
import { SectionTitle } from "../components/SectionTitle";
import { REVIEWS, SITE, UNITS } from "../lib/constants";

const AVATAR_COLORS = [
  "#4285F4",
  "#EA4335",
  "#34A853",
  "#FF6D00",
  "#7B1FA2",
  "#00897B",
];

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-label="Google">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function StarRow() {
  return (
    <div className="flex items-center gap-0.5" aria-label="5 estrelas">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" aria-hidden>
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill="#FBBC05"
            stroke="none"
          />
        </svg>
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
          {/* Rating summary card */}
          <div className="card flex flex-col sm:flex-row lg:flex-col gap-6 items-start lg:items-center text-center bg-gradient-to-br from-teal-wash to-cream border-teal/25">
            <div className="w-full">
              <div className="flex items-center justify-center gap-2 mb-4">
                <GoogleG />
                <span className="text-sm font-medium text-ink-soft">Google</span>
              </div>
              <p className="text-7xl font-semibold text-ink leading-none">
                {SITE.rating.toFixed(1)}
              </p>
              <div className="mt-3 flex justify-center">
                <StarRow />
              </div>
              <p className="mt-3 text-sm text-ink-soft">
                Baseado em{" "}
                <strong>{SITE.reviewsCount.toLocaleString("pt-BR")}+</strong>{" "}
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

          {/* Review cards */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {REVIEWS.map((r, i) => {
              const initial = r.author.charAt(0).toUpperCase();
              const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
              return (
                <article
                  key={i}
                  className="bg-paper rounded-2xl border border-line p-5 flex flex-col gap-3 hover:border-teal/40 hover:shadow-md transition-all"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0"
                        style={{ backgroundColor: color }}
                        aria-hidden
                      >
                        {initial}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink leading-tight">
                          {r.author}
                        </p>
                        <p className="text-xs text-muted">
                          {r.unit}
                        </p>
                      </div>
                    </div>
                    <GoogleG />
                  </div>

                  {/* Stars */}
                  <StarRow />

                  {/* Text */}
                  <p className="text-sm text-ink-soft leading-relaxed flex-1">
                    {r.text}
                  </p>

                  {/* Footer */}
                  <p className="text-xs text-muted pt-2 border-t border-line">
                    Avaliação verificada pelo Google
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
