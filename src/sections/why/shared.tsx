import type { ReactNode } from "react";
import { why } from "@/content/site";
import { fullMotion } from "@/core/env";
import { cn } from "@/lib/utils";

/** Movimiento completo (respeta reduced-motion, equipos modestos y `?motion=` en preview). */
export const useFull = () => fullMotion();

export type Pillar = (typeof why.pillars)[number];
export const PILLARS: Pillar[] = why.pillars;
export const EYEBROW = why.eyebrow;
export const TEXT = why.text;
export const CTA = why.cta;

/** Texto alternativo real de cada foto (describe lo que se ve en el trabajo). */
export const ALT: Record<string, string> = {
  "01": "Panel retroiluminado de gran formato producido para el K+ Leaders Summit 24",
  "02": "Mural gráfico diseñado y fabricado para un interior comercial",
  "03": "Coche con wrapping en degradado de color mate",
  "04": "Flota de furgonetas de TKE rotuladas",
};

/** Titular de la sección con la palabra destacada («imposible»). */
export function Title({ em = "text-brand-strong", className = "" }: { em?: string; className?: string }) {
  return (
    <span className={className}>
      {why.titleA}<span className={cn("italic", em)}>{why.titleEm}</span>{why.titleB}
    </span>
  );
}
export const TITLE_PLAIN = `${why.titleA}${why.titleEm}${why.titleB}`;

/** Eyebrow con raya de marca. */
export const Eyebrow = ({ className = "", children = EYEBROW }: { className?: string; children?: ReactNode }) => (
  <p className={cn("inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em]", className)}>
    <span className="h-px w-8 bg-current opacity-70" aria-hidden /> {children}
  </p>
);

/** Flecha de enlace (SVG inline, sin emoji). */
export const ArrowR = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cn("h-4 w-4", className)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/** Etiquetas de un pilar (texto real de site.ts). */
export const Tags = ({ tags, className = "", tagClass = "" }: { tags: string[]; className?: string; tagClass?: string }) => (
  <ul className={cn("flex flex-wrap gap-2", className)}>
    {tags.map((t) => (
      <li key={t} className={cn("rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em]", tagClass)}>{t}</li>
    ))}
  </ul>
);
