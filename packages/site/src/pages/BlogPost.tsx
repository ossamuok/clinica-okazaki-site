import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { BlockRenderer } from "@okazaki/shared-renderer/components";
import { getPostBySlug, loadPostBySlug } from "../content/blog";
import type { BlogPillar, BlogPost as BlogPostType } from "../content/blog/types";
import { Seo } from "../lib/seo";
import {
  articleSchema,
  breadcrumbSchema,
  faqPageSchema,
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
import NotFound from "./NotFound";

const PILLAR_LABELS: Record<BlogPillar, string> = {
  gastroenterologia: "Gastroenterologia",
  endoscopia: "Endoscopia",
  colonoscopia: "Colonoscopia",
  hepatologia: "Hepatologia",
  geriatria: "Geriatria",
};

const PILLAR_PATH: Record<BlogPillar, string> = {
  gastroenterologia: "/gastroenterologia",
  endoscopia: "/endoscopia",
  colonoscopia: "/colonoscopia",
  hepatologia: "/hepatologia",
  geriatria: "/geriatria",
};

export default function BlogPost() {
  const { slug = "" } = useParams<{ slug: string }>();
  const initial = getPostBySlug(slug);
  const [post, setPost] = useState<BlogPostType | undefined>(initial);
  const [loading, setLoading] = useState(initial === undefined);

  useEffect(() => {
    if (initial) {
      setPost(initial);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    loadPostBySlug(slug).then((p) => {
      if (cancelled) return;
      setPost(p);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [slug, initial]);

  if (loading) return null;
  if (!post) return <NotFound />;

  const path = `/blog/${post.slug}`;
  const url = `${SITE.url}${path}`;
  const pillarPath = PILLAR_PATH[post.pillar];
  const pillarLabel = PILLAR_LABELS[post.pillar];

  const schemas = [
    medicalWebPageSchema({
      title: post.title,
      description: post.description,
      url,
      about: post.about,
    }),
    articleSchema({
      title: post.title,
      description: post.description,
      url,
      image: post.heroImage?.src,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      author: post.author,
      reviewer: post.reviewer,
    }),
    faqPageSchema(post.faqs),
    breadcrumbSchema([
      { name: "Início", url: `${SITE.url}/` },
      { name: "Blog", url: `${SITE.url}/blog` },
      { name: post.breadcrumbLabel, url },
    ]),
  ];

  const updatedLabel = new Date(post.updatedAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Seo
        title={post.title}
        description={post.description}
        path={path}
        keywords={post.keywords}
        schemas={schemas}
        ogType="article"
        ogImage={post.heroImage?.src}
      />
      <Header />

      <main id="main" className="pt-20 md:pt-24">
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.breadcrumbLabel },
          ]}
        />

        <section className="container-page pt-6 pb-10 md:pt-10 md:pb-14">
          <div className="max-w-4xl">
            <p className="eyebrow mb-5">{post.eyebrow}</p>
            <h1 className="text-h1-fluid text-balance mb-6 tracking-tight">
              {post.h1}
            </h1>
            <p className="text-lg md:text-xl text-ink-soft text-pretty leading-relaxed max-w-3xl">
              {post.lead}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
              <Link to={pillarPath} className="text-teal-deep font-medium hover:underline">
                {pillarLabel}
              </Link>
              <span aria-hidden>·</span>
              <span>
                Atualizado em <time dateTime={post.updatedAt}>{updatedLabel}</time>
              </span>
              {post.author?.name ? (
                <>
                  <span aria-hidden>·</span>
                  <span>Revisão: {post.author.name}</span>
                </>
              ) : null}
            </div>
          </div>
        </section>

        <section className="container-page pb-16 md:pb-24">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-10 lg:gap-16">
            <article className="prose-page min-w-0">
              {post.sections.map((section) => (
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
              <AuthorBio post={post} />
            </article>

            <Toc sections={post.sections} />
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
                Dúvidas sobre {post.breadcrumbLabel.toLowerCase()}
              </h2>
            </div>
            <FaqAccordion items={post.faqs} />
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

function AuthorBio({ post }: { post: BlogPostType }) {
  if (!post.author) return null;
  const credentials = [post.author.crm, post.author.rqe]
    .filter(Boolean)
    .join(" · ");
  return (
    <aside className="not-prose mt-12 p-6 rounded-card bg-paper-2 border border-line">
      <p className="eyebrow mb-3">Autoria & revisão médica</p>
      <div className="flex items-start gap-4">
        {post.author.photo ? (
          <img
            src={post.author.photo}
            alt={post.author.name}
            className="h-16 w-16 rounded-full object-cover shrink-0"
            loading="lazy"
            decoding="async"
          />
        ) : null}
        <div className="min-w-0">
          <p className="font-semibold text-ink">{post.author.name}</p>
          {credentials ? (
            <p className="text-sm text-muted">{credentials}</p>
          ) : null}
          {post.author.bio ? (
            <p className="text-sm text-ink-soft mt-2 leading-relaxed">
              {post.author.bio}
            </p>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

function Toc({ sections }: { sections: BlogPostType["sections"] }) {
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
