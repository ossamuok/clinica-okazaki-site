import { SITE } from "../lib/constants";

const STATS = [
  { value: `${SITE.age}+`, label: "Anos de história" },
  { value: `${SITE.rating.toFixed(1)}★`, label: "Nota no Google" },
  { value: `${Math.round(SITE.reviewsCount / 100) * 100}+`, label: "Avaliações reais" },
  { value: "2", label: "Unidades em Recife" },
];

export function Stats() {
  return (
    <section className="py-10 md:py-14 border-y border-line bg-paper-2">
      <div className="container-page grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map((s) => (
          <div key={s.label} className="text-center md:text-left">
            <p className="text-display-stat font-semibold text-teal-deep tracking-tight">
              {s.value}
            </p>
            <p className="mt-2 text-eyebrow uppercase font-medium text-muted">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
