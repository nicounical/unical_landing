import { gallery, projects, type Project } from "@/content/site";
import { fullMotion } from "@/core/env";
import { cn } from "@/lib/utils";

/** Movimiento completo (respeta reduced-motion, equipos modestos y `?motion=` en preview). */
export const useFull = () => fullMotion();

export const EYEBROW = projects.eyebrow;
export const TITLE = projects.title;
export const ALL_HREF = projects.allHref;
export const ALL_LABEL = "Ver todos los proyectos";
/** Microcopy neutra (sin cifras ni afirmaciones nuevas). */
export const LEAD = "Una selección de trabajos reales producidos e instalados por nuestro equipo.";

export type Item = Project & { id: string; alt: string };

/** Los 8 proyectos reales de site.ts con un texto alternativo descriptivo. */
export const ITEMS: Item[] = projects.items.map((p, i) => ({
  ...p,
  id: `p${i + 1}`,
  alt: `${p.kind} para ${p.client}: ${p.title.split("·").pop()?.trim() ?? p.title}`,
}));

export type Shot = { src: string; alt: string; w: number; h: number };

/** Texto alternativo y proporción real de cada foto de `gallery` (trabajos reales). */
const GALLERY_META: Record<string, { alt: string; w: number; h: number }> = {
  "lexus-marvel": { alt: "Lexus con car wrapping de Black Panther", w: 1920, h: 1281 },
  "tunel-vodafone": { alt: "Túnel luminoso ambientado para Vodafone", w: 1200, h: 1600 },
  "five-guys": { alt: "Rótulo corpóreo y decoración de restaurante Five Guys", w: 1024, h: 768 },
  eversense: { alt: "Stand de Eversense en congreso", w: 1600, h: 1200 },
  "neon-lcky": { alt: "Logotipo luminoso de LCKY Group", w: 1600, h: 1200 },
  venca: { alt: "Pop-up store iluminada de Venca", w: 1280, h: 960 },
  disney: { alt: "Espacio exterior de Star Wars para un evento", w: 1024, h: 768 },
  "lanzamiento-coche": { alt: "Escenario nocturno para el lanzamiento de un coche", w: 1600, h: 1068 },
  tke: { alt: "Furgoneta rotulada de TKE", w: 960, h: 1280 },
  "letras-maher": { alt: "Letras corpóreas iluminadas en fachada de oficinas", w: 1448, h: 1086 },
  "3cat": { alt: "Mural gráfico de gran formato para 3Cat", w: 1195, h: 896 },
  congreso: { alt: "Escenario y ambientación de un congreso corporativo", w: 1448, h: 1086 },
  goofretti: { alt: "Food truck de Goofretti rotulado", w: 640, h: 480 },
  "publicidad-exterior": { alt: "Escaparate decorado con vinilo de gran formato para Desigual", w: 640, h: 640 },
  "luminoso-3cat": { alt: "Rótulo luminoso de 3Cat", w: 1600, h: 1200 },
  "stand-feria": { alt: "Stand de Truphone en feria", w: 1448, h: 1086 },
  "stand-danone": { alt: "Stand de cafetería en un recinto ferial", w: 1448, h: 1086 },
  mcdonalds: { alt: "Mural interior en un restaurante McDonald's", w: 1280, h: 852 },
};
const key = (src: string) => src.split("/").pop()!.replace(/\.\w+$/, "");

/** Galería real; se omiten las que repiten foto de un proyecto (Goofretti y McDonald's). */
export const GALLERY: Shot[] = gallery
  .filter((src) => !["goofretti", "mcdonalds"].includes(key(src)))
  .map((src) => ({ src, ...(GALLERY_META[key(src)] ?? { alt: "Trabajo de producción visual de Unical", w: 4, h: 3 }) }));

/** Proporciones reales de las fotos de proyecto. */
export const ITEM_SIZE: Record<string, { w: number; h: number }> = {
  "tibau-trasera": { w: 1600, h: 1200 }, "mcd-cover": { w: 1600, h: 1065 }, "goofretti-cover": { w: 640, h: 480 },
  "tibau-remolque": { w: 1600, h: 1200 }, "mcd-08": { w: 900, h: 1600 }, "tibau-camion-taller": { w: 1600, h: 1200 },
  "goofretti-trasera": { w: 640, h: 480 }, "tibau-asistencia": { w: 1600, h: 1200 },
};
export const sizeOf = (src: string) => ITEM_SIZE[key(src)] ?? { w: 4, h: 3 };

export const pad = (n: number) => String(n).padStart(2, "0");
export const COUNT = pad(ITEMS.length);

/** Flecha de enlace (SVG inline, sin emoji). */
export const ArrowUR = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cn("h-4 w-4", className)}>
    <path d="M7 17L17 7M8 7h9v9" />
  </svg>
);

export const Chevron = ({ dir = "right", className = "" }: { dir?: "left" | "right"; className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden className={cn("h-4 w-4", className)}>
    <path d={dir === "right" ? "m6 3 5 5-5 5" : "M10 3 5 8l5 5"} stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Eyebrow con raya de marca (mismo patrón que las otras secciones). */
export const Eyebrow = ({ className = "", children = EYEBROW }: { className?: string; children?: string }) => (
  <p className={cn("inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em]", className)}>
    <span className="h-px w-8 bg-current opacity-70" aria-hidden /> {children}
  </p>
);

/** Enlace «Ver todos los proyectos» en línea (44 px de alto). */
export const AllLink = ({ className = "" }: { className?: string }) => (
  <a href={ALL_HREF} className={cn("group inline-flex min-h-[44px] items-center gap-3 border-b border-current text-sm font-semibold", className)}>
    {ALL_LABEL}
    <ArrowUR className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
  </a>
);
