import type { ReactNode } from "react";

/** Cabecera de sección: eyebrow + H2 (patrón de marca). */
export function SecHead({ eyebrow, title, lead, className = "", align = "left", children }: {
  eyebrow: string; title: ReactNode; lead?: ReactNode; className?: string; align?: "left" | "center"; children?: ReactNode;
}) {
  return (
    <header className={`sh sh--${align} ${className}`}>
      <p className="u-eyebrow">{eyebrow}</p>
      <h2 className="sh__t">{title}</h2>
      {lead && <p className="sh__lead">{lead}</p>}
      {children}
    </header>
  );
}
