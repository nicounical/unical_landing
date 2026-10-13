import { gallery, reel, sectors, services, type Service } from "@/content/site";
import { fullMotion } from "@/core/env";
import { cn } from "@/lib/utils";

/** Movimiento completo (respeta reduced-motion, equipos modestos y `?motion=` en preview). */
export const useFull = () => fullMotion();

export const ITEMS: Service[] = services.items;
export const EYEBROW = services.eyebrow;
export const TITLE = services.title;

/** Busca una foto real ya presente en site.ts (galería, sectores o reel) por fragmento de ruta. */
const POOL = [...gallery, ...sectors.items.map((s) => s.img), ...reel.items.map((r) => r.img)];
const pick = (frag: string, fallback: string) => POOL.find((src) => src.includes(frag)) ?? fallback;

/** Segunda foto real por servicio (fondos / capas), misma categoría de trabajo. */
export const ALT_IMG: Record<string, { src: string; alt: string }> = {
  "01": { src: pick("exterior-lona", ITEMS[0].img), alt: "Lona impresa de gran formato en exterior" },
  "02": { src: pick("flota-furgonetas", ITEMS[1].img), alt: "Flota de furgonetas rotuladas" },
  "03": { src: pick("stand-danone", ITEMS[2].img), alt: "Stand de feria producido por Unical" },
  "04": { src: pick("tunel-vodafone", ITEMS[3].img), alt: "Túnel ambientado para un evento corporativo" },
  "05": { src: pick("letras-maher", ITEMS[4].img), alt: "Letras corpóreas instaladas en fachada" },
  "06": { src: pick("venca", ITEMS[5].img), alt: "Punto de venta con material PLV" },
};

/** Alcance de cada servicio: palabras tomadas literalmente de su descripción en site.ts (nada inventado). */
export const SCOPE: Record<string, string[]> = {
  "01": ["Vallas", "Lonas", "Telas", "Vinilo", "Impresión UV"],
  "02": ["Furgonetas", "Camiones", "Flotas corporativas", "Vinilos 3M y Avery"],
  "03": ["Diseño", "Producción", "Transporte", "Montaje llave en mano"],
  "04": ["Photocalls", "Backdrops", "Banderolas", "Montaje integral"],
  "05": ["PVC", "Metacrilato", "Aluminio", "Retroiluminación led"],
  "06": ["Expositores", "Pop-up stores", "Material promocional"],
};

export const pad = (n: number) => String(n).padStart(2, "0");

/** Flecha de enlace (SVG inline, sin emoji). */
export const ArrowUR = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cn("h-4 w-4", className)}>
    <path d="M7 17L17 7M8 7h9v9" />
  </svg>
);

/** Eyebrow con raya de marca. */
export const Eyebrow = ({ className = "", children = EYEBROW }: { className?: string; children?: string }) => (
  <p className={cn("inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em]", className)}>
    <span className="h-px w-8 bg-current opacity-70" aria-hidden /> {children}
  </p>
);
