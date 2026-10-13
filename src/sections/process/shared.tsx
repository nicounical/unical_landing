import { ClipboardList, Factory, PenTool, Wrench, type LucideIcon } from "lucide-react";
import { hero, process } from "@/content/site";
import { fullMotion } from "@/core/env";
import { cn } from "@/lib/utils";

/** Movimiento completo (respeta reduced-motion, equipos modestos y `?motion=` en preview). */
export const useFull = () => fullMotion();

export const EYEBROW = process.eyebrow;
export const TITLE = process.title;
export const LEAD = process.lead;
/** CTA real de la portada (mismo destino de contacto). */
export const CTA = hero.ctaSecondary;

export type Phase = (typeof process.phases)[number] & { alt: string; icon: LucideIcon };

/** Textos alternativos descriptivos de cada foto real (lo que se ve en la imagen). */
const ALT: Record<string, string> = {
  "01": "Fachada comercial durante la medición previa a la rotulación",
  "02": "Mural gráfico diseñado para 3Cat en un vestíbulo corporativo",
  "03": "Pieza retroiluminada producida en el taller para un congreso",
  "04": "Stand de feria instalado y terminado por el equipo de Unical",
};
const ICON: Record<string, LucideIcon> = { "01": ClipboardList, "02": PenTool, "03": Factory, "04": Wrench };

export const PHASES: Phase[] = process.phases.map((p) => ({ ...p, alt: ALT[p.n], icon: ICON[p.n] }));
export const N = PHASES.length;

export const pad = (n: number) => String(n).padStart(2, "0");

/** Flecha de enlace (SVG inline, sin emoji). */
export const ArrowUR = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cn("h-4 w-4", className)}>
    <path d="M7 17L17 7M8 7h9v9" />
  </svg>
);

/** Eyebrow con raya de marca (mismo patrón que las otras secciones). */
export const Eyebrow = ({ className = "", children = EYEBROW }: { className?: string; children?: string }) => (
  <p className={cn("inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em]", className)}>
    <span className="h-px w-8 bg-current opacity-70" aria-hidden /> {children}
  </p>
);

/** Enlace CTA de texto con flecha (≥44 px de alto). */
export const CtaLink = ({ className = "" }: { className?: string }) => (
  <a href={CTA.href} className={cn("group inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold", className)}>
    {CTA.label}
    <ArrowUR className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
  </a>
);

/** Icono de pausa / reproducción (SVG inline). */
export const PlayPause = ({ paused, className = "" }: { paused: boolean; className?: string }) =>
  paused ? (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={cn("h-4 w-4", className)}><path d="M8 5.5v13l10.5-6.5z" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={cn("h-4 w-4", className)}><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>
  );
