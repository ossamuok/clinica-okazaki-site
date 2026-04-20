import { Helmet } from "react-helmet-async";
import { SITE } from "./constants";

type JsonLd = Record<string, unknown>;

type SeoProps = {
  title: string;
  description: string;
  path?: string;
  keywords?: string;
  ogImage?: string;
  schemas?: JsonLd[];
  ogType?: "website" | "article";
};

export function Seo({
  title,
  description,
  path = "/",
  keywords,
  ogImage = "/assets/logo-horizontal.webp",
  schemas = [],
  ogType = "website",
}: SeoProps) {
  const canonical = `${SITE.url}${path}`;
  const ogImageAbs = ogImage.startsWith("http") ? ogImage : `${SITE.url}${ogImage}`;

  return (
    <Helmet>
      <html lang="pt-BR" />
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <meta name="author" content={SITE.name} />
      <meta name="robots" content="index,follow,max-image-preview:large" />
      <link rel="canonical" href={canonical} />

      <meta name="geo.region" content="BR-PE" />
      <meta name="geo.placename" content="Recife" />
      <meta name="geo.position" content="-8.0576;-34.8916" />
      <meta name="ICBM" content="-8.0576, -34.8916" />

      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageAbs} />
      <meta property="og:image:width" content="800" />
      <meta property="og:image:height" content="448" />
      <meta property="og:image:type" content="image/webp" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageAbs} />

      <meta name="theme-color" content="#0d8b7e" />

      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // react-helmet requires string children for <script>
        >
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
