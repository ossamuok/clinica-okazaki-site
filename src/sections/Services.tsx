import { Link } from "react-router-dom";
import { ArrowRight, Check, Stethoscope, Microscope, Users } from "lucide-react";
import { SectionTitle } from "../components/SectionTitle";
import { SERVICES } from "../lib/constants";

const ICONS: Record<string, typeof Stethoscope> = {
  endoscopia: Microscope,
  colonoscopia: Stethoscope,
  consultas: Users,
};

export function Services() {
  return (
    <section id="servicos" className="section">
      <div className="container-page">
        <SectionTitle
          eyebrow="o que fazemos"
          title={
            <>
              Diagnóstico e cuidado especializado,{" "}
              <span className="text-teal-deep">do exame à consulta</span>
            </>
          }
          subtitle="Procedimentos endoscópicos de alta definição e consultas com gastroenterologistas, hepatologistas e geriatras — tudo em dois endereços em Recife."
        />

        <div className="mt-12 md:mt-16 grid gap-6 md:grid-cols-3">
          {SERVICES.map((s) => {
            const Icon = ICONS[s.slug] ?? Stethoscope;
            return (
              <article key={s.slug} className="card card-hover group flex flex-col">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-wash text-teal-deep">
                  <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden />
                </span>
                <h3 className="mt-6 text-h3-fluid font-semibold text-ink">
                  {s.title}
                </h3>
                <p className="mt-3 text-ink-soft leading-relaxed">
                  {s.description}
                </p>
                <ul className="mt-5 space-y-2 text-sm text-ink-soft flex-1">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-2.5">
                      <Check
                        className="h-4 w-4 mt-0.5 shrink-0 text-teal-deep"
                        strokeWidth={2.5}
                        aria-hidden
                      />
                      {b}
                    </li>
                  ))}
                </ul>
                <Link
                  to={s.href}
                  className="mt-7 inline-flex items-center gap-1 text-sm font-medium text-teal-deep hover:text-teal-ink group-hover:gap-2 transition-all"
                >
                  Saiba mais
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
