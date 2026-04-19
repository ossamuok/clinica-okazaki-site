import { Phone, MessageCircle } from "lucide-react";
import { PHONE_DISPLAY, PHONE_LINK, WHATSAPP_URL } from "../lib/constants";

type Props = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
};

export function CtaBand({
  eyebrow = "AGENDAMENTO",
  title = "Seu cuidado digestivo começa com um passo simples",
  subtitle = "Converse com nossa equipe e agende seu exame ou consulta em uma das duas unidades em Recife.",
}: Props) {
  return (
    <section className="section">
      <div className="container-page">
        <div className="cta-gradient rounded-[2rem] px-6 py-16 md:px-16 md:py-24 text-white text-center shadow-lg relative overflow-hidden">
          <span className="text-eyebrow uppercase tracking-[0.18em] font-medium text-white/70">
            {eyebrow}
          </span>
          <h2 className="mt-4 text-h2-fluid font-semibold text-white text-balance max-w-3xl mx-auto">
            {title}
          </h2>
          <p className="mt-5 text-white/80 text-lg max-w-xl mx-auto leading-relaxed">
            {subtitle}
          </p>
          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-teal-ink font-semibold rounded-full px-7 py-3.5 hover:bg-cream transition-colors"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              Agendar pelo WhatsApp
            </a>
            <a
              href={PHONE_LINK}
              className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-medium rounded-full px-7 py-3.5 hover:bg-white/10 transition-colors"
            >
              <Phone className="h-4 w-4" aria-hidden />
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
