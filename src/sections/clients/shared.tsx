import "./clients.css";
import { clients } from "@/content/site";
import { fullMotion } from "@/core/env";
import { cn } from "@/lib/utils";

/** Movimiento completo (respeta reduced-motion, equipos modestos y `?motion=` en preview). */
export const useFull = () => fullMotion();

export type Client = { name: string; logo: string };

/** Los 25 clientes reales de site.ts (nombre + favicon). Nada más: sin testimonios, valoraciones ni recuentos. */
export const CLIENTS: Client[] = clients.items;
export const EYEBROW = clients.eyebrow;
export const TITLE = clients.title;
export const LEAD = clients.lead;
/** Única cifra disponible en site.ts para esta sección. */
export const FOOT = clients.foot;
export const FOOT_TEXT = clients.footText;

export const pad = (n: number) => String(n).padStart(2, "0");

/** Favicons de muy baja resolución (16 px): no se muestran (misma lista que ClientMark). */
const LOWRES = new Set(["catai", "generali", "leo-pharma", "longi", "otis", "rituals"]);
export const slugOf = (c: Client) => c.logo.split("/").pop()!.replace(".png", "");
export const hasIcon = (c: Client) => !LOWRES.has(slugOf(c));

/** Monograma tipográfico (sustituye al favicon cuando no hay resolución suficiente). */
export const initials = (name: string) =>
  name.replace(/[^\p{L}\p{N}\s-]/gu, "").split(/[\s-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

/** Reparte la lista en `n` filas equilibradas (para marquesinas de varias pistas). */
export const split = <T,>(list: T[], n: number): T[][] =>
  Array.from({ length: n }, (_, r) => list.filter((_, i) => i % n === r));

/** Eyebrow con raya de marca (mismo patrón que las otras secciones). */
export const Eyebrow = ({ className = "", children = EYEBROW }: { className?: string; children?: string }) => (
  <p className={cn("inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em]", className)}>
    <span className="h-px w-8 bg-current opacity-70" aria-hidden /> {children}
  </p>
);
