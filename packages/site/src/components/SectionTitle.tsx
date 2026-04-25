import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
};

export function SectionTitle({ eyebrow, title, subtitle, align = "left" }: Props) {
  const base = align === "center" ? "text-center mx-auto" : "";
  return (
    <div className={`max-w-3xl ${base}`}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2 className="text-h2-fluid mt-5 text-balance">{title}</h2>
      {subtitle ? (
        <p className="mt-5 text-lg text-ink-soft leading-relaxed max-w-prose">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
