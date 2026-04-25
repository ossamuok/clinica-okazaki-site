import { SectionTitle } from "../components/SectionTitle";
import { DIFFERENTIALS } from "../lib/constants";

export function Differentials() {
  return (
    <section className="section bg-paper-2 border-y border-line">
      <div className="container-page">
        <SectionTitle
          eyebrow="por que a okazaki"
          title="Seis diferenças que você percebe na prática"
          subtitle="Tecnologia de última geração, protocolos rigorosos e uma equipe cuidada — isso tudo muda como você é atendido, do primeiro contato ao laudo."
        />

        <div className="mt-12 md:mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {DIFFERENTIALS.map((d) => (
            <div key={d.number} className="flex gap-5">
              <span className="text-4xl md:text-5xl font-light text-teal-deep/40 leading-none tracking-tight shrink-0">
                {d.number}
              </span>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-ink">
                  {d.title}
                </h3>
                <p className="mt-2 text-ink-soft leading-relaxed">{d.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
