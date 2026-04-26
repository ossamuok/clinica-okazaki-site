import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import type { Block } from "@okazaki/shared-renderer/types";

type Props = {
  block: Block;
  readOnly: boolean;
  onChange: (block: Block) => void;
};

export function BlockEditor({ block, readOnly, onChange }: Props) {
  switch (block.type) {
    case "p":
      return <ProseField block={block} readOnly={readOnly} onChange={onChange} />;
    case "h3":
      return (
        <SimpleField
          label="H3"
          value={block.text}
          readOnly={readOnly}
          onChange={(v) => onChange({ ...block, text: v })}
        />
      );
    case "ul":
      return (
        <ListField
          items={block.items}
          readOnly={readOnly}
          onChange={(items) => onChange({ ...block, items })}
        />
      );
    case "callout":
      return (
        <SimpleField
          label="Callout"
          value={block.text}
          readOnly={readOnly}
          onChange={(v) => onChange({ ...block, text: v })}
        />
      );
    case "warning":
      return (
        <SimpleField
          label="Warning"
          value={block.text}
          readOnly={readOnly}
          onChange={(v) => onChange({ ...block, text: v })}
        />
      );
    case "inline-cta":
      return (
        <InlineCtaField
          block={block}
          readOnly={readOnly}
          onChange={(b) => onChange(b)}
        />
      );
    case "video":
      return (
        <VideoField
          block={block}
          readOnly={readOnly}
          onChange={(b) => onChange(b)}
        />
      );
    case "link":
      return (
        <LinkField
          block={block}
          readOnly={readOnly}
          onChange={(b) => onChange(b)}
        />
      );
  }
}

function InlineCtaField({
  block,
  readOnly,
  onChange,
}: {
  block: Extract<Block, { type: "inline-cta" }>;
  readOnly: boolean;
  onChange: (b: Block) => void;
}) {
  return (
    <div className="space-y-2 border border-line rounded-lg p-3">
      <p className="text-xs text-muted font-mono">inline-cta</p>
      <div>
        <label className="label !mb-1 text-xs">Texto</label>
        <textarea
          className="input min-h-[50px]"
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          disabled={readOnly}
        />
      </div>
      <div>
        <label className="label !mb-1 text-xs">Label do botão (opcional)</label>
        <input
          className="input"
          value={block.label ?? ""}
          onChange={(e) =>
            onChange({ ...block, label: e.target.value || undefined })
          }
          disabled={readOnly}
          placeholder="Agendar"
        />
      </div>
    </div>
  );
}

function VideoField({
  block,
  readOnly,
  onChange,
}: {
  block: Extract<Block, { type: "video" }>;
  readOnly: boolean;
  onChange: (b: Block) => void;
}) {
  return (
    <div className="space-y-2 border border-line rounded-lg p-3">
      <p className="text-xs text-muted font-mono">video (YouTube)</p>
      <div>
        <label className="label !mb-1 text-xs">YouTube ID</label>
        <input
          className="input font-mono"
          value={block.youtubeId}
          onChange={(e) => onChange({ ...block, youtubeId: e.target.value })}
          disabled={readOnly}
          placeholder="dQw4w9WgXcQ"
        />
      </div>
      <div>
        <label className="label !mb-1 text-xs">Caption (opcional)</label>
        <input
          className="input"
          value={block.caption ?? ""}
          onChange={(e) =>
            onChange({ ...block, caption: e.target.value || undefined })
          }
          disabled={readOnly}
        />
      </div>
    </div>
  );
}

function LinkField({
  block,
  readOnly,
  onChange,
}: {
  block: Extract<Block, { type: "link" }>;
  readOnly: boolean;
  onChange: (b: Block) => void;
}) {
  return (
    <div className="space-y-2 border border-line rounded-lg p-3">
      <p className="text-xs text-muted font-mono">link</p>
      <div>
        <label className="label !mb-1 text-xs">Label</label>
        <input
          className="input"
          value={block.label}
          onChange={(e) => onChange({ ...block, label: e.target.value })}
          disabled={readOnly}
        />
      </div>
      <div>
        <label className="label !mb-1 text-xs">Href</label>
        <input
          className="input font-mono"
          value={block.href}
          onChange={(e) => onChange({ ...block, href: e.target.value })}
          disabled={readOnly}
          placeholder="/endoscopia"
        />
      </div>
    </div>
  );
}

function ProseField({
  block,
  readOnly,
  onChange,
}: {
  block: { type: "p"; text: string };
  readOnly: boolean;
  onChange: (b: Block) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: false, bulletList: false, orderedList: false, codeBlock: false, blockquote: false, horizontalRule: false })],
    content: block.text,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      onChange({ ...block, text });
    },
  });

  useEffect(() => {
    if (editor && editor.getText() !== block.text) {
      editor.commands.setContent(block.text);
    }
  }, [block.text, editor]);

  return (
    <div>
      <p className="text-xs text-muted font-mono mb-1">parágrafo</p>
      <EditorContent editor={editor} />
    </div>
  );
}

function SimpleField({
  label,
  value,
  readOnly,
  onChange,
}: {
  label: string;
  value: string;
  readOnly: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-xs text-muted font-mono mb-1">{label}</p>
      <textarea
        className="input min-h-[60px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={readOnly}
      />
    </div>
  );
}

function ListField({
  items,
  readOnly,
  onChange,
}: {
  items: string[];
  readOnly: boolean;
  onChange: (items: string[]) => void;
}) {
  return (
    <div>
      <p className="text-xs text-muted font-mono mb-1">lista</p>
      <textarea
        className="input min-h-[100px] font-mono text-sm"
        value={items.join("\n")}
        onChange={(e) =>
          onChange(
            e.target.value
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
          )
        }
        disabled={readOnly}
        placeholder="Um item por linha"
      />
    </div>
  );
}

