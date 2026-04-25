import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { BLOG_POSTS } from "../content/blog";
import type { BlogPillar } from "../content/blog/types";
import { Seo } from "../lib/seo";
import { breadcrumbSchema, medicalWebPageSchema } from "../lib/schemas";
import { SITE } from "../lib/constants";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { WhatsAppFloat } from "../components/WhatsAppFloat";
import { Breadcrumb } from "../components/Breadcrumb";
import { CtaBand } from "../components/CtaBand";

const PILLAR_LABELS: Record<BlogPillar, string> = {
  gastroenterologia: "Gastroenterologia",
  endoscopia: "Endoscopia",
  colonoscopia: "Colonoscopia",
  hepatologia: "Hepatologia",
  geriatria: "Geriatria",
};

const PILLAR_ORDER: BlogPillar[] = [
  "gastroenterologia",
  "endoscopia",
  "colonoscopia",
  "hepatologia",
  "geriatria",
];

const PAGE_SIZE = 12;

export default function BlogIndex() {
  const [pillarFilter, setPillarFilter] = useState<BlogPillar | "all">("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (pillarFilter === "all") return BLOG_POSTS;
    return BLOG_POSTS.filter((p) => p.pillar === pillarFilter);
  }, [pillarFilter]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = filtered.length > visible.length;

  const path = "/blog";
  const url = `${SITE.url}${path}`;

  const schemas = [
    medicalWebPageSchema({
      title: "Blog · Clínica Okazaki",
      description:
        "Conteúdo médico revisado sobre gastroenterologia, endoscopia, colonoscopia, hepatologia e geriatria. Centro Clínico Okazaki — Recife.",
      url,
      about: "Educação em saúde digestiva",
    }),
    breadcrumbSchema([
      { name: "Início", url: `${SITE.url}/` },
      { name: "Blog", url },
    ]),
  ];

  return (
    <>
      <Seo
        title="Blog · Centro Clínico Okazaki — Saúde Digestiva em Recife"
        description="Artigos médicos revisados sobre gastroenterologia, endoscopia, colonoscopia, hepatologia e geriatria. Conteúdo educativo da Clínica Okazaki."
        path={path}
        keywords="blog clínica okazaki, gastroenterologia recife, endoscopia recife, colonoscopia recife, hepatologia, geriatria, saúde digestiva"
        schemas={schemas}
        ogType="website"
      />
      <Header />

      <main id="main" className="pt-20 md:pt-24">
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Blog" },
          ]}
        />

        <section className="container-page pt-6 pb-10 md:pt-10 md:pb-14">
          <div className="max-w-4xl">
            <p className="eyebrow mb-5">BLOG · SAÚDE DIGESTIVA</p>
            <h1 className="text-h1-fluid text-balance mb-6 tracking-tight">
              Conteúdo médico revisado em saúde digestiva
            </h1>
            <p className="text-lg md:text-xl text-ink-soft text-pretty leading-relaxed max-w-3xl">
              Artigos sobre gastroenterologia, endoscopia, colonoscopia, hepatologia e geriatria — escritos com revisão médica de profissionais do Centro Clínico Okazaki.
            </p>
          </div>
        </section>

        <section className="container-page pb-16 md:pb-24">
          <div className="flex flex-wrap gap-2 mb-10">
            <PillarChip
              active={pillarFilter === "all"}
              onClick={() => {
                setPillarFilter("all");
                setPage(1);
              }}
            >
              Todos
            </PillarChip>
            {PILLAR_ORDER.map((p) => (
              <PillarChip
                key={p}
                active={pillarFilter === p}
                onClick={() => {
                  setPillarFilter(p);
                  setPage(1);
                }}
              >
                {PILLAR_LABELS[p]}
              </PillarChip>
            ))}
          </div>

          {visible.length === 0 ? (
            <p className="text-muted">
              Nenhum artigo publicado nesta categoria ainda.
            </p>
          ) : (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((post) => (
                <li key={post.slug}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}

          {hasMore ? (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                className="btn-outline"
              >
                Carregar mais
              </button>
            </div>
          ) : null}
        </section>

        <CtaBand />
      </main>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}

function PillarChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
        active
          ? "bg-teal-deep text-white border-teal-deep"
          : "bg-paper-2 text-ink-soft border-line hover:border-teal-deep hover:text-teal-deep"
      }`}
    >
      {children}
    </button>
  );
}

function PostCard({ post }: { post: { slug: string; title: string; excerpt: string; pillar: BlogPillar; publishedAt: string; breadcrumbLabel: string } }) {
  const dateLabel = new Date(post.publishedAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col h-full p-6 rounded-card bg-paper-2 border border-line hover:border-teal-deep hover:shadow-md transition"
    >
      <p className="eyebrow mb-3 text-teal-deep">
        {PILLAR_LABELS[post.pillar]}
      </p>
      <h2 className="text-xl font-semibold text-ink mb-3 leading-snug group-hover:text-teal-deep transition-colors">
        {post.breadcrumbLabel || post.title}
      </h2>
      <p className="text-ink-soft text-sm leading-relaxed mb-6 flex-1">
        {post.excerpt}
      </p>
      <div className="flex items-center justify-between text-xs text-muted">
        <time dateTime={post.publishedAt}>{dateLabel}</time>
        <span className="inline-flex items-center gap-1 text-teal-deep font-medium">
          Ler artigo
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
