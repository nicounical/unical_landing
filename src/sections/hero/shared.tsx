import { hero, gallery, projects, services } from "@/content/site";
import { Btn } from "@/core/ui";
import { fullMotion } from "@/core/env";
import { cn } from "@/lib/utils";

/** Bloque comercial común a las 7 portadas: en 3 s se entiende qué hace Unical y qué hacer después. */
export function HeroCopy({ className = "", align = "left", magnetic = true, lead = true }: { className?: string; align?: "left" | "center"; magnetic?: boolean; lead?: boolean }) {
  return (
    <div className={cn("flex flex-col gap-6 text-white", align === "center" && "items-center text-center", className)}>
      {lead && <p className="max-w-[46ch] text-base leading-relaxed text-white/80 md:text-lg">{hero.lead}</p>}
      <div className={cn("flex flex-wrap gap-3", align === "center" && "justify-center")}>
        <Btn href={hero.ctaPrimary.href} kind="primary" magnetic={magnetic}>{hero.ctaPrimary.label} <span aria-hidden>→</span></Btn>
        <Btn href={hero.ctaSecondary.href} kind="ghost" magnetic={magnetic}>{hero.ctaSecondary.label}</Btn>
      </div>
    </div>
  );
}

export const HeroEyebrow = ({ className = "" }: { className?: string }) => (
  <p className={cn("inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand", className)}>
    <span className="h-px w-8 bg-brand" aria-hidden /> {hero.eyebrow}
  </p>
);

/** Nombre accesible del H1: los titulares se parten visualmente, para el lector de pantalla es una frase. */
export const H1_LABEL = "Producción visual B2B en Barcelona";

/** Imágenes reales para las portadas basadas en colecciones de fotos (sin repetir). */
export const HERO_IMAGES: { src: string; title: string; kind: string }[] = (() => {
  const seen = new Set<string>();
  const out: { src: string; title: string; kind: string }[] = [];
  const push = (src: string, title: string, kind: string) => { if (!seen.has(src)) { seen.add(src); out.push({ src, title, kind }); } };
  projects.items.forEach((p) => push(p.img, p.title, p.kind));
  services.items.forEach((s) => push(s.img, s.title, s.sub));
  const KIND: Record<string, string> = { eventos: "Eventos", rotulacion: "Rotulación", impresion: "Impresión", proyectos: "Proyecto", svc: "Producción", servicios: "Servicio", hero: "Car wrapping" };
  gallery.forEach((g) => {
    const parts = g.split("/");
    const name = parts[parts.length - 1].replace(/\.webp$/, "").split("-").map((w) => (w.length <= 3 && /\d/.test(w) ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1))).join(" ");
    push(g, name, KIND[parts[parts.length - 2]] ?? "Producción visual");
  });
  return out;
})();

/** Movimiento completo (respeta reduced-motion, equipos modestos y `?motion=` en preview). */
export const useFull = () => fullMotion();
