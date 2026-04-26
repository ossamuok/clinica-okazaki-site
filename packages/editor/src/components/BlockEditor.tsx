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
      return <ReadOnlyBadge type="inline-cta" preview={block.text} />;
    case "video":
      return (
        <ReadOnlyBadge
          type="video"
          preview={`youtubeId: ${block.youtubeId}`}
        />
      );
    case "link":
      return (
        <ReadOnlyBadge type="link" preview={`${block.label} → ${block.href}`} />
      );
  }
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

function ReadOnlyBadge({ type, preview }: { type: string; preview: string }) {
  return (
    <div className="px-3 py-2 rounded-lg border border-dashed border-line bg-paper text-xs text-muted">
      <span className="font-mono mr-2">[{type}]</span>
      {preview}
      <span className="ml-2 text-muted/60">— edição em F5</span>
    </div>
  );
}
