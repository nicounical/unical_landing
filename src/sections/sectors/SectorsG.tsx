/**
 * SECTORES G · Interactive Gallery — basado en 21st.dev «Grayscale Mosaic Gallery» (id 26806, 7ovr).
 * Del original se conserva: cabecera con distintivo + título + recuento a la derecha, mosaico en rejilla con la primera
 * pieza a 2×2, fotos en escala de grises que recuperan el color al pasar el cursor (transition-all 300 ms), capa con
 * icono ZoomIn al pasar y clic → lightbox (Dialog) con la foto en 16:9, título y descripción.
 * Adaptación: 8 sectores reales (4 columnas × 3 filas con una segunda pieza apaisada para cerrar la rejilla; 2 columnas
 * en móvil), nombre del sector siempre visible sobre cada pieza, Dialog de shadcn/radix (no instalado) sustituido por
 * un modal propio con foco atrapado y devuelto, Esc, clic fuera y bloqueo del scroll; el lightbox añade anterior /
 * siguiente con botones y flechas del teclado. Alternativa táctil: en dispositivos sin hover las fotos se muestran en
 * color y el lightbox se abre al tocar. Sin movimiento: sin transiciones.
 */
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Eyebrow, ITEMS, LEAD, SectorModal, TITLE, pad, useFull } from "./shared";

const SPAN: Record<number, string> = {
  0: "col-span-2 lg:row-span-2",
  5: "col-span-2",
};

export default function SectorsG() {
  const full = useFull();
  const [active, setActive] = useState<number | null>(null);
  const [dir, setDir] = useState(1);
  const close = useCallback(() => setActive(null), []);
  const step = useCallback((d: number) => { setDir(d); setActive((a) => (a === null ? a : (a + d + ITEMS.length) % ITEMS.length)); }, []);

  useEffect(() => {
    if (active === null) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [active, step]);

  const s = active === null ? null : ITEMS[active];
  const tr = full ? "transition-all duration-300" : "";

  return (
    <div className="bg-ink py-[var(--u-section-y)] text-white">
      <div className="u-wrap">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-12">
          <div>
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1"><Eyebrow className="text-brand">{"Sectores"}</Eyebrow></span>
            <h2 className="mt-4 max-w-[16ch] text-[length:var(--u-h2)] font-extrabold leading-[.98] tracking-[-0.045em] text-white">{TITLE}</h2>
            <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-white/65">{LEAD}</p>
          </div>
          <span className="font-mono text-sm tabular-nums text-white/55">{pad(ITEMS.length)} sectores</span>
        </div>

        <ul className="grid auto-rows-[clamp(150px,42vw,220px)] grid-cols-2 gap-2 lg:auto-rows-[clamp(170px,17vw,250px)] lg:grid-cols-4">
          {ITEMS.map((it, i) => (
            <li key={it.name} className={cn("min-w-0", SPAN[i])}>
              <button type="button" onClick={() => { setDir(1); setActive(i); }} aria-haspopup="dialog" aria-label={`Ampliar: ${it.name}`}
                className="group relative block h-full w-full overflow-hidden rounded-lg border border-white/10 bg-white/5 outline-none focus-visible:ring-2 focus-visible:ring-brand">
                <img src={it.img} alt={it.alt} loading="lazy" decoding="async"
                  className={cn("size-full object-cover grayscale group-hover:scale-[1.03] group-hover:grayscale-0 group-focus-visible:grayscale-0 [@media(hover:none)]:grayscale-0", tr)} />
                <span className={cn("absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 group-hover:bg-black/15 group-hover:opacity-100 group-focus-visible:opacity-100", full && "transition-opacity")} aria-hidden>
                  <span className="flex size-11 items-center justify-center rounded-md bg-white/90 text-ink"><ZoomIn className="size-4" /></span>
                </span>
                <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/75 to-transparent p-3 pt-10 text-left md:p-4" aria-hidden>
                  <span className={cn("font-head font-semibold leading-tight tracking-[-0.02em] text-white", i === 0 ? "text-xl md:text-3xl" : "text-sm md:text-base")}>{it.name}</span>
                  <span className="font-mono text-[10px] tabular-nums text-white/60">{it.n}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <SectorModal open={active !== null} onClose={close} label={s ? `${s.name} · sector ${s.n} de ${pad(ITEMS.length)}` : "Sector"} className="max-w-3xl">
        {s && (
          <motion.div initial={full ? { opacity: 0, scale: 0.96, y: 10 } : false} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }} className="overflow-hidden rounded-xl border border-white/10 bg-ink text-white shadow-2xl">
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              <AnimatePresence initial={false} custom={dir} mode="popLayout">
                <motion.img key={s.name} src={s.img} alt={s.alt} custom={dir}
                  initial={full ? { opacity: 0, x: dir * 40 } : false} animate={{ opacity: 1, x: 0 }} exit={full ? { opacity: 0, x: dir * -40 } : undefined}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="absolute inset-0 size-full object-cover" />
              </AnimatePresence>
              <button type="button" onClick={close} aria-label="Cerrar" data-autofocus
                className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/65">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="flex items-center justify-between gap-4 p-4 md:p-5">
              <div className="min-w-0">
                <h3 className="font-head text-lg font-semibold tracking-[-0.02em] text-white md:text-xl">{s.name}</h3>
                <p className="mt-0.5 text-sm text-white/60">{s.alt} · Sector {s.n} de {pad(ITEMS.length)}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={() => step(-1)} aria-label="Sector anterior" className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition hover:bg-white/10"><ChevronLeft className="h-5 w-5" aria-hidden /></button>
                <button type="button" onClick={() => step(1)} aria-label="Sector siguiente" className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition hover:bg-white/10"><ChevronRight className="h-5 w-5" aria-hidden /></button>
              </div>
            </div>
          </motion.div>
        )}
      </SectorModal>
    </div>
  );
}
