import { ArrowUpRight, Info, AlertTriangle } from "lucide-react";
import type { Block } from "../types";

export type BlockRendererConfig = {
  /** URL do botão "Agendar" do bloco inline-cta. Tipicamente WHATSAPP_URL. */
  ctaUrl: string;
};

export function BlockRenderer({
  block,
  config,
}: {
  block: Block;
  config: BlockRendererConfig;
}) {
  switch (block.type) {
    case "p":
      return <p>{block.text}</p>;
    case "h3":
      return <h3>{block.text}</h3>;
    case "ul":
      return (
        <ul>
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <div className="callout my-6">
          <Info
            className="h-5 w-5 text-teal-deep shrink-0 mt-0.5"
            aria-hidden
          />
          <p className="!mb-0">{block.text}</p>
        </div>
      );
    case "warning":
      return (
        <div className="warning my-6">
          <AlertTriangle
            className="h-5 w-5 text-redBrand shrink-0 mt-0.5"
            aria-hidden
          />
          <p className="!mb-0">{block.text}</p>
        </div>
      );
    case "inline-cta":
      return (
        <div className="inline-cta my-8">
          <p className="!mb-0 text-ink font-medium text-lg max-w-xl">
            {block.text}
          </p>
          <a
            href={config.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary shrink-0"
          >
            {block.label ?? "Agendar"}
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      );
    case "video":
      return (
        <div className="my-8">
          <div
            className="relative w-full rounded-card overflow-hidden shadow-md"
            style={{ paddingBottom: "56.25%" }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${block.youtubeId}`}
              title={block.caption ?? "Vídeo"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          {block.caption && (
            <p className="mt-2 text-sm text-muted text-center">
              {block.caption}
            </p>
          )}
        </div>
      );
    case "link":
      return (
        <div className="my-6">
          <a
            href={block.href}
            className="btn-outline inline-flex items-center gap-2"
          >
            {block.label}
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      );
  }
}
