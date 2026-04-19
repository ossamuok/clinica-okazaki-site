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
          ? "bg-paper/85 backdrop-blur-md border-b border-line shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container-page flex items-center justify-between h-16 md:h-20">
        <Link
          to="/"
          aria-label={SITE.name}
          className="flex items-center gap-2 shrink-0"
        >
          <img
            src="/assets/logo-horizontal.webp"
            alt={SITE.name}
            className="h-8 md:h-9 w-auto"
            width="180"
            height="36"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-ink-soft">
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
        <div className="lg:hidden fixed inset-0 top-16 z-40 bg-paper/98 backdrop-blur-md border-t border-line animate-fade-up">
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
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
