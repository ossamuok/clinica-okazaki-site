import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

type Props = {
  items: { label: string; href?: string }[];
};

export function Breadcrumb({ items }: Props) {
  return (
    <nav
      aria-label="Navegação"
      className="container-page pt-28 md:pt-32 pb-2 text-sm text-muted"
    >
      <ol className="flex items-center flex-wrap gap-1.5">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link to={item.href} className="hover:text-teal-deep">
                  {item.label}
                </Link>
              ) : (
                <span className={last ? "text-ink" : ""}>{item.label}</span>
              )}
              {!last ? (
                <ChevronRight className="h-3.5 w-3.5 text-muted/60" aria-hidden />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
