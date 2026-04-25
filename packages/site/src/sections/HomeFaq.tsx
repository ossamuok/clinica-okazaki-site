import { FaqAccordion } from "../components/FaqAccordion";
import { SectionTitle } from "../components/SectionTitle";
import { HOME_FAQS } from "../lib/constants";

export function HomeFaq() {
  return (
    <section id="duvidas" className="section">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <SectionTitle
            eyebrow="dúvidas frequentes"
            title="O que os pacientes mais perguntam"
            subtitle="Se sua dúvida não estiver aqui, nossa equipe responde por WhatsApp em horário comercial."
          />
          <div>
            <FaqAccordion items={HOME_FAQS} />
          </div>
        </div>
      </div>
    </section>
  );
}
