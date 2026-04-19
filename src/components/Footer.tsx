import { Link } from "react-router-dom";
import { Phone, MessageCircle } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}
import {
  FOOTER_SERVICE_LINKS,
  HOURS,
  PHONE_DISPLAY,
  PHONE_LINK,
  SITE,
  UNITS,
  WHATSAPP_URL,
} from "../lib/constants";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-paper">
      <div className="container-page py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <img
              src="/assets/logo-horizontal.webp"
              alt={SITE.name}
              className="h-10 w-auto"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <p className="mt-5 text-sm text-paper/70 leading-relaxed max-w-xs">
              Endoscopia, colonoscopia e consultas especializadas há {SITE.age} anos
              em Recife. Cuidado digestivo com precisão e humanidade.
            </p>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm text-paper/80 hover:text-paper transition-colors"
              aria-label="Instagram Clínica Okazaki"
            >
              <InstagramIcon className="h-4 w-4" />
              @centro_clinico_okazaki
            </a>
          </div>

          <div>
            <h3 className="text-eyebrow uppercase font-medium text-paper/60">
              Serviços
            </h3>
            <ul className="mt-5 space-y-2.5 text-sm">
              {FOOTER_SERVICE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-paper/80 hover:text-paper transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-eyebrow uppercase font-medium text-paper/60">
              Unidades
            </h3>
            <ul className="mt-5 space-y-5 text-sm">
              {UNITS.map((unit) => (
                <li key={unit.slug}>
                  <p className="font-medium text-paper">{unit.name}</p>
                  <p className="text-paper/70 mt-1 leading-relaxed">
                    {unit.address}
                    <br />
                    {unit.district} · CEP {unit.cep}
                  </p>
                  <p className="text-paper/70 mt-1">{unit.phones[0]}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-eyebrow uppercase font-medium text-paper/60">
              Atendimento
            </h3>
            <ul className="mt-5 space-y-2 text-sm text-paper/80">
              <li>{HOURS.weekdays}</li>
              <li>{HOURS.saturday}</li>
            </ul>
            <div className="mt-6 space-y-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-teal bg-teal-wash/10 border border-teal/30 rounded-full px-4 py-2 hover:bg-teal-wash/20 transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                WhatsApp
              </a>
              <a
                href={PHONE_LINK}
                className="inline-flex items-center gap-2 text-sm text-paper/80 hover:text-paper"
              >
                <Phone className="h-3.5 w-3.5" aria-hidden />
                {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-paper/10 text-xs text-paper/55 space-y-2 leading-relaxed">
          <p>
            © {year} {SITE.name}. Todos os direitos reservados.
          </p>
          <p>
            <span className="text-paper/70">Responsável técnico:</span>{" "}
            {SITE.tecnico.nome} · {SITE.tecnico.crm} · {SITE.tecnico.rqe}.
            Conteúdo informativo em conformidade com a Resolução CFM nº
            2.336/2023.
          </p>
        </div>
      </div>
    </footer>
  );
}
