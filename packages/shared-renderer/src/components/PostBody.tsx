import type { Section } from "../types";
import { BlockRenderer, type BlockRendererConfig } from "./BlockRenderer";

export function PostBody({
  sections,
  config,
}: {
  sections: Section[];
  config: BlockRendererConfig;
}) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24">
          <h2>{section.h2}</h2>
          {section.blocks.map((block, i) => (
            <BlockRenderer key={i} block={block} config={config} />
          ))}
        </section>
      ))}
    </>
  );
}
