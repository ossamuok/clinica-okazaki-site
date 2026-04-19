import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import {
  HEADER_LINKS,
  PHONE_DISPLAY,
  PHONE_LINK,
  SITE,
  WHATSAPP_URL,
} from "../lib/constants";

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

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all ${
        scrolled
          ? "bg-paper/95 backdrop-blur-md border-b border-line shadow-sm"
          : "bg-paper/70 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="container-page flex items-center justify-between h-24 md:h-28">
        <Link
          to="/"
          aria-label={SITE.name}
          className="flex items-center gap-3 shrink-0 group"
        >
          <img
            src="/assets/logo-horizontal.png"
            alt={SITE.name}
            className="h-20 md:h-24 w-auto transition-transform group-hover:scale-[1.02]"
            width="320"
            height="80"
          />
          <span className="hidden md:flex flex-col leading-tight border-l border-line pl-3">
            <span className="text-[10px] tracking-[0.18em] uppercase text-teal-deep font-semibold">
              Desde 1987
            </span>
            <span className="text-[11px] tracking-wide text-muted">
              Recife · PE
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-5 text-base font-medium text-ink-soft">
          {HEADER_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-teal-deep transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href={PHONE_LINK}
            className="text-sm text-ink-soft hover:text-teal-deep flex items-center gap-1.5"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden />
            {PHONE_DISPLAY}
          </a>
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Centro Clínico Okazaki"
            className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-line text-ink-soft hover:border-teal hover:text-teal-deep transition-colors"
          >
            <InstagramIcon className="h-4 w-4" />
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm px-5 py-2.5"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Agendar
          </a>
        </div>

        <button
          type="button"
          className="lg:hidden flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink hover:border-teal hover:text-teal-deep transition-colors"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden />
          ) : (
            <Menu className="h-5 w-5" aria-hidden />
          )}
        </button>
      </div>

      {open ? (
        <div className="lg:hidden fixed inset-0 top-20 z-40 bg-paper/98 backdrop-blur-md border-t border-line animate-fade-up">
          <div className="container-page py-8 flex flex-col gap-1">
            {HEADER_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-4 text-xl font-medium text-ink border-b border-line hover:text-teal-deep transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-8 flex flex-col gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full justify-center"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                Agendar pelo WhatsApp
              </a>
              <a
                href={PHONE_LINK}
                className="btn-outline w-full justify-center"
              >
                <Phone className="h-4 w-4" aria-hidden />
                {PHONE_DISPLAY}
              </a>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full justify-center"
              >
                <InstagramIcon className="h-4 w-4" />
                @centro_clinico_okazaki
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
