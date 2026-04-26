import { PostBody } from "@okazaki/shared-renderer/components";
import type { BlogPost } from "@okazaki/shared-renderer/types";

const WHATSAPP_PREVIEW = "https://wa.me/5581999540570";

export function PreviewPane({ post }: { post: BlogPost }) {
  return (
    <div className="card max-h-[80vh] overflow-y-auto">
      <p className="eyebrow mb-2">Preview</p>
      <p className="text-xs text-muted mb-4">
        Render aproximado — typography do site público pode diferir
        (estilos prose-page só vivem em packages/site).
      </p>
      <article className="prose prose-sm max-w-none">
        <p className="text-xs text-teal-600 font-mono uppercase tracking-wider">
          {post.eyebrow}
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-navy-900 mt-2">
          {post.h1}
        </h1>
        <p className="text-base text-ink-500 leading-relaxed">{post.lead}</p>
        <hr className="my-4 border-line" />
        <PostBody
          sections={post.sections}
          config={{ ctaUrl: WHATSAPP_PREVIEW }}
        />
        {post.faqs.length ? (
          <>
            <hr className="my-4 border-line" />
            <h2 className="text-lg font-semibold">Perguntas frequentes</h2>
            <dl className="space-y-3">
              {post.faqs.map((f, i) => (
                <div key={i}>
                  <dt className="font-medium text-navy-900">{f.q}</dt>
                  <dd className="text-sm text-ink-500">{f.a}</dd>
                </div>
              ))}
            </dl>
          </>
        ) : null}
      </article>
    </div>
  );
}
