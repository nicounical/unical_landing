/**
 * PROYECTOS D · Minimal Luxury — basado en 21st.dev «Project Index» (id 30554, ssych ui).
 * Del original se conserva: filas desnudas con filete superior (título · etiqueta · dato · flecha), el resto de filas
 * se apagan al 30 % mientras una está activa, la flecha avanza al pasar, y la portada solo existe mientras se pasa
 * por una fila: flota junto al cursor con muelle (stiffness 260, damping 28) y aparece con opacidad + escala 0.96;
 * con el teclado la portada se coloca a la derecha de la fila enfocada. Sin animación con reduced-motion.
 * Adaptación: gradientes de demo → fotos reales de los 8 proyectos (fundido entre portadas en vez de display:none);
 * el año (no hay dato real) se sustituye por el cliente y la etiqueta por el tipo de trabajo; enlaces reales.
 * Ancho completo con numeración, tipografía ligera sobre papel y filas de 44 px+. En pantallas táctiles (sin hover)
 * cada fila muestra su miniatura en línea. Cierre con «Ver todos los proyectos».
 */
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { finePointer } from "@/core/env";
import { cn } from "@/lib/utils";
import { AllLink, COUNT, Eyebrow, ITEMS, LEAD, TITLE, pad, useFull } from "./shared";

const EASE = [0.16, 1, 0.3, 1] as const;
const COVER_W = 340;

export default function ProjectsD() {
  const full = useFull();
  const wrap = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [fine, setFine] = useState(true);
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    setFine(finePointer());
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const r = wrap.current?.getBoundingClientRect();
    if (r) setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <div className="bg-paper py-[var(--u-section-y)] text-ink">
      <div className="u-wrap">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow className="text-brand-strong" />
            <h2 className="mt-6 font-body text-[clamp(2.4rem,5.4vw,4.6rem)] font-normal leading-[1] tracking-[-0.055em] text-ink">{TITLE}</h2>
          </div>
          <div className="flex flex-col gap-4 lg:col-span-4 lg:col-start-9">
            <p className="max-w-[36ch] text-[15px] leading-relaxed text-ink/60">{LEAD}</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/40">Índice · {COUNT}</p>
          </div>
        </div>

        <div ref={wrap} onPointerMove={onMove} className="relative mt-16 md:mt-20">
          <ul>
            {ITEMS.map((p, i) => {
              const dim = hover !== null && hover !== i;
              return (
                <li key={p.id}>
                  <a href={p.href}
                    onPointerEnter={(e) => { if (e.pointerType === "mouse") setHover(i); }}
                    onPointerLeave={() => setHover(null)}
                    onFocus={(e) => {
                      const r = wrap.current?.getBoundingClientRect();
                      const row = e.currentTarget.getBoundingClientRect();
                      if (r) setPos({ x: r.width - COVER_W - 24, y: row.top - r.top + row.height / 2 });
                      setHover(i);
                    }}
                    onBlur={() => setHover(null)}
                    className="group grid min-h-[64px] grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-1 border-t border-ink/15 py-5 outline-none transition-colors duration-200 focus-visible:bg-white/60 focus-visible:ring-2 focus-visible:ring-brand-strong md:grid-cols-[3rem_minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,0.8fr)_auto] md:gap-x-6 md:py-6">
                    {!fine && <img src={p.img} alt="" loading="lazy" className="row-span-2 h-14 w-[4.5rem] rounded-sm object-cover md:hidden" />}
                    <span className={cn("font-mono text-[11px] tabular-nums text-ink/40", !fine && "max-md:hidden")}>{pad(i + 1)}</span>
                    <span className={cn("text-[clamp(1.35rem,2.6vw,2.15rem)] font-light leading-tight tracking-[-0.035em] transition-colors duration-200", dim ? "text-ink/30" : "text-ink")}>
                      {p.title}
                    </span>
                    <span className={cn("col-start-2 truncate text-[13px] text-ink/55 md:col-start-auto", !fine && "max-md:col-start-2")} title={p.kind}>{p.kind}</span>
                    <span className="hidden truncate text-[13px] text-ink/40 md:block">{p.client}</span>
                    <span aria-hidden className={cn("row-start-1 col-start-3 text-ink/35 transition-transform duration-300 [transition-timing-function:cubic-bezier(.16,1,.3,1)] group-hover:translate-x-1.5 group-hover:text-ink md:col-start-auto md:row-start-auto", !fine && "max-md:col-start-3")}>
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16m-6-6 6 6-6 6" /></svg>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-ink/15" />

          {/* Portada flotante — solo existe mientras una fila está activa */}
          <motion.div aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-10 hidden overflow-hidden rounded-[3px] bg-white shadow-[0_30px_70px_-20px_rgba(22,22,31,.45)] md:block"
            style={{ width: COVER_W }}
            initial={false}
            animate={{
              x: Math.max(0, Math.min(pos.x + 28, width - COVER_W)),
              y: pos.y - COVER_W * 0.375,
              opacity: hover !== null ? 1 : 0,
              scale: hover !== null ? 1 : 0.96,
            }}
            transition={full ? { type: "spring", stiffness: 260, damping: 28, opacity: { duration: 0.2, ease: EASE } } : { duration: 0 }}>
            <div className="relative aspect-[4/3] w-full">
              {ITEMS.map((p, i) => (
                <img key={p.id} src={p.img} alt="" loading="lazy"
                  className={cn("absolute inset-0 h-full w-full object-cover", full && "transition-[opacity,transform] duration-500", hover === i ? "scale-100 opacity-100" : "scale-[1.06] opacity-0")} />
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-12 flex justify-end text-ink"><AllLink /></div>
      </div>
    </div>
  );
}
