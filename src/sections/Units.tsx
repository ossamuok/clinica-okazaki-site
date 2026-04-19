import { useState } from "react";
import {
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  ArrowUpRight,
  Play,
} from "lucide-react";
import { SectionTitle } from "../components/SectionTitle";
import { HOURS, UNITS, WHATSAPP_URL } from "../lib/constants";
import type { Unit } from "../lib/constants";

function LazyMap({ unit }: { unit: Unit }) {
  const [loaded, setLoaded] = useState(false);
  if (loaded) {
    return (
      <iframe
        src={unit.mapsEmbed}
        title={`Mapa ${unit.name}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 h-full w-full"
        allowFullScreen
      />
    );
  }
  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      aria-label={`Carregar mapa ${unit.name}`}
      className="absolute inset-0 h-full w-full flex items-center justify-center bg-gradient-to-br from-teal-wash to-paper-2 hover:from-teal/10 hover:to-teal-wash transition-colors group"
    >
      <div className="absolute inset-0 dot-pattern opacity-50" aria-hidden />
      <div className="relative flex flex-col items-center gap-3 text-teal-deep">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md group-hover:scale-110 transition-transform">
          <Play className="h-5 w-5 ml-0.5" aria-hidden />
        </span>
        <span className="text-sm font-medium">Carregar mapa</span>
      </div>
    </button>
  );
}

export function Units() {
  return (
    <section id="unidades" className="section">
      <div className="container-page">
        <SectionTitle
          eyebrow="onde estamos"
          title="Duas unidades em Recife, mesmo padrão"
          subtitle="Mesma equipe, mesmos protocolos e mesma tecnologia em dois endereços estratégicos — escolha o mais próximo e agende."
        />

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {UNITS.map((unit) => (
            <article
              key={unit.slug}
              className="rounded-unit border border-line overflow-hidden bg-paper flex flex-col"
            >
              <div className="relative aspect-[16/9] bg-paper-2">
                <LazyMap unit={unit} />
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <span className="pill self-start">{unit.name}</span>
                <h3 className="mt-4 text-xl font-semibold text-ink">
                  {unit.building}
                </h3>
                <div className="mt-4 space-y-3 text-sm text-ink-soft flex-1">
                  <p className="flex gap-2.5">
                    <MapPin
                      className="h-4 w-4 mt-0.5 text-teal-deep shrink-0"
                      aria-hidden
                    />
                    <span>
                      {unit.address}
                      <br />
                      {unit.district} · CEP {unit.cep}
                    </span>
                  </p>
                  <p className="flex gap-2.5">
                    <Phone
                      className="h-4 w-4 mt-0.5 text-teal-deep shrink-0"
                      aria-hidden
                    />
                    <span>{unit.phones.join(" · ")}</span>
                  </p>
                  <p className="flex gap-2.5">
                    <Clock
                      className="h-4 w-4 mt-0.5 text-teal-deep shrink-0"
                      aria-hidden
                    />
                    <span>{HOURS.short}</span>
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-sm"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden />
                    WhatsApp
                  </a>
                  <a
                    href={unit.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline text-sm"
                  >
                    Ver no Maps
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
