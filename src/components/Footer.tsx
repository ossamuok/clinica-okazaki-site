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
      <div className="container-page py-8 md:py-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 items-start">
          <div className="flex items-center gap-4 lg:flex-col lg:items-start lg:gap-3">
            <img
              src="/assets/logo-horizontal.png"
              alt={SITE.name}
              className="h-9 w-auto shrink-0"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-paper/70 hover:text-paper transition-colors"
              aria-label="Instagram Clínica Okazaki"
            >
              <InstagramIcon className="h-3.5 w-3.5" />
              @centro_clinico_okazaki
            </a>
          </div>

          {UNITS.map((unit) => (
            <div key={unit.slug}>
              <p className="text-xs font-semibold uppercase tracking-wider text-paper/50 mb-2">
                {unit.name}
              </p>
              <p className="text-xs text-paper/75 leading-relaxed">
                {unit.address}, {unit.district}
              </p>
              <p className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-paper/60">
                {unit.phones.map((p) => (
                  <span key={p} className="whitespace-nowrap">{p}</span>
                ))}
                {unit.mobile && (
                  <span className="whitespace-nowrap">{unit.mobile} (cel.)</span>
                )}
              </p>
            </div>
          ))}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-paper/50 mb-2">
              Atendimento
            </p>
            <p className="text-xs text-paper/75">{HOURS.weekdays}</p>
            <p className="text-xs text-paper/75">{HOURS.saturday}</p>
            <div className="mt-3 flex items-center gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-teal border border-teal/30 rounded-full px-3 py-1.5 hover:bg-teal-wash/10 transition-colors"
              >
                <MessageCircle className="h-3 w-3" aria-hidden />
                WhatsApp
              </a>
              <a
                href={PHONE_LINK}
                className="inline-flex items-center gap-1.5 text-xs text-paper/70 hover:text-paper"
              >
                <Phone className="h-3 w-3" aria-hidden />
                {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-paper/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px] text-paper/45 leading-relaxed">
          <p>© {year} {SITE.name}. Todos os direitos reservados.</p>
          <p className="text-right">
            Resp. técnico: {SITE.tecnico.nome} · {SITE.tecnico.crm} · {SITE.tecnico.rqe}
          </p>
        </div>
      </div>
    </footer>
  );
}
