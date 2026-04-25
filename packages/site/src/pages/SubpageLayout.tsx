import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { PageContent } from "../content/types";
import { BlockRenderer } from "@okazaki/shared-renderer/components";
import { Seo } from "../lib/seo";
import {
  breadcrumbSchema,
  faqPageSchema,
  howToSchema,
  medicalWebPageSchema,
} from "../lib/schemas";
import { SITE, WHATSAPP_URL } from "../lib/constants";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { WhatsAppFloat } from "../components/WhatsAppFloat";
import { Breadcrumb } from "../components/Breadcrumb";
import { FaqAccordion } from "../components/FaqAccordion";
import { ComplianceBlock } from "../components/ComplianceBlock";
import { CtaBand } from "../components/CtaBand";

type Props = { content: PageContent };

export function SubpageLayout({ content }: Props) {
  const path = `/${content.slug}`;
  const url = `${SITE.url}${path}`;

  const schemas = [
    medicalWebPageSchema({
      title: content.title,
      description: content.description,
      url,
      about: content.about,
    }),
    faqPageSchema(content.faqs),
    breadcrumbSchema([
      { name: "Início", url: `${SITE.url}/` },
      { name: content.breadcrumbLabel, url },
    ]),
  ];

  if (content.howTo) {
    schemas.push(howToSchema(content.howTo));
  }

  return (
    <>
      <Seo
        title={content.title}
        description={content.description}
        path={path}
        keywords={content.keywords}
        schemas={schemas}
        ogType="article"
      />
      <Header />

      <main id="main" className="pt-20 md:pt-24">
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: content.breadcrumbLabel },
          ]}
        />

        <section className="container-page pt-6 pb-10 md:pt-10 md:pb-14">
          <div className="max-w-4xl">
            <p className="eyebrow mb-5">{content.eyebrow}</p>
            <h1 className="text-h1-fluid text-balance mb-6 tracking-tight">
              {content.h1}
            </h1>
            <p className="text-lg md:text-xl text-ink-soft text-pretty leading-relaxed max-w-3xl">
              {content.lead}
            </p>

            {content.metaChips && content.metaChips.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-2">
                {content.metaChips.map((chip) => (
                  <span
                    key={chip.label}
                    className="inline-flex items-center gap-2 pl-3 pr-4 py-2 rounded-full bg-paper-2 border border-line text-sm"
                  >
                    <span className="text-xs uppercase tracking-wider text-muted">
                      {chip.label}
                    </span>
                    <span className="text-ink font-medium">{chip.value}</span>
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <section className="container-page pb-16 md:pb-24">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-10 lg:gap-16">
            <article className="prose-page min-w-0">
              {content.sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24"
                >
                  <h2>{section.h2}</h2>
                  {section.blocks.map((block, i) => (
                    <BlockRenderer
                      key={i}
                      block={block}
                      config={{ ctaUrl: WHATSAPP_URL }}
                    />
                  ))}
                </section>
              ))}
            </article>

            <Toc sections={content.sections} />
          </div>
        </section>

        <section
          id="faq"
          className="bg-paper-2 border-y border-line section scroll-mt-24"
        >
          <div className="container-page">
            <div className="max-w-3xl mb-10">
              <p className="eyebrow mb-4">Perguntas frequentes</p>
              <h2 className="text-h2-fluid text-balance">
                Dúvidas sobre {content.breadcrumbLabel.toLowerCase()}
              </h2>
            </div>
            <FaqAccordion items={content.faqs} />
          </div>
        </section>

        <div className="container-page py-10">
          <ComplianceBlock />
        </div>

        <CtaBand />
      </main>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}

function Toc({ sections }: { sections: PageContent["sections"] }) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: [0, 1] },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [sections]);

  return (
    <>
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <p className="eyebrow mb-5">Nesta página</p>
          <ul className="space-y-2.5 text-sm border-l border-line pl-4">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={`block transition-colors ${
                    active === s.id
                      ? "text-teal-deep font-medium"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {s.h2}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="lg:hidden -mt-4 mb-4">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-paper-2 border border-line text-sm font-medium text-ink"
          aria-expanded={mobileOpen}
        >
          <span>Nesta página ({sections.length})</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              mobileOpen ? "rotate-180" : ""
            }`}
            aria-hidden
          />
        </button>
        {mobileOpen ? (
          <ul className="mt-2 space-y-2 px-4 py-4 rounded-xl bg-paper-2 border border-line text-sm">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={() => setMobileOpen(false)}
                  className="block py-1.5 text-ink-soft hover:text-teal-deep"
                >
                  {s.h2}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </>
  );
}
