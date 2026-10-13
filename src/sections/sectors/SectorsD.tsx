/**
 * SECTORES D · Minimal Luxury — basado en 21st.dev «Filter Grid» (id 23525, ddoemonn).
 * Del original se conserva: hook `useFilterGrid` (filtro activo, recuento por filtro, elementos visibles), chips en
 * `role="radiogroup"` con `role="radio"`, tabIndex itinerante y teclado ← → ↑ ↓ Inicio Fin, pastilla activa compartida
 * por layoutId con el muelle CELL (520/34/0.45), cruce de opacidad entre las dos capas de texto del chip, recuento en
 * cifras tabulares, celdas con `layout="position"` + AnimatePresence `popLayout` (entrada 0.97 → 1, salida rápida
 * LEAVE), devolución del foco a la rejilla y región aria-live con «filtro: n de total».
 * Adaptación: las celdas pasan a ser fichas fotográficas de los 8 sectores reales, con tipografía ligera sobre papel;
 * los filtros agrupan los sectores por tipo de espacio (agrupación neutra, sin datos nuevos). Se elimina la altura fija
 * con scroll interno del original (evita trampas de scroll): la rejilla fluye a 2 / 4 columnas. Sin movimiento: cambios
 * instantáneos.
 */
import { useCallback, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ArrowUR, CONTACT_URL, Eyebrow, ITEMS, LEAD, TITLE, useFull, type Sector } from "./shared";

const CELL = { type: "spring", stiffness: 520, damping: 34, mass: 0.45 } as const;
const MOVE = { type: "spring", stiffness: 260, damping: 34, mass: 0.8 } as const;
const EASE = [0.23, 1, 0.32, 1] as const;
const LEAVE = { duration: 0.14, ease: [0.4, 0, 1, 1] } as const;
const INSTANT = { duration: 0 } as const;

type FilterDefinition<T> = { id: string; label: string; match: (item: T) => boolean };

const by = (names: string[]) => (s: Sector) => names.includes(s.name);
const FILTERS: FilterDefinition<Sector>[] = [
  { id: "all", label: "Todos", match: () => true },
  { id: "espacios", label: "Espacios de marca", match: by(["Retail y PLV", "Hostelería", "Oficinas", "Pharma"]) },
  { id: "eventos", label: "Ferias y eventos", match: by(["Stands y Ferias", "Eventos Deportivos"]) },
  { id: "exterior", label: "Exterior y flotas", match: by(["Vehículos", "Publicidad Exterior"]) },
];

function useFilterGrid<T>({ items, filters }: { items: readonly T[]; filters: readonly FilterDefinition<T>[] }) {
  const [internal, setInternal] = useState(filters[0]?.id ?? "");
  const current = filters.find((f) => f.id === internal) ?? filters[0];
  const active = current.id;
  const counts = useMemo(() => {
    const next: Record<string, number> = {};
    for (const f of filters) next[f.id] = items.filter(f.match).length;
    return next;
  }, [filters, items]);
  const visible = useMemo(() => items.filter(current.match), [items, current]);
  return { active, activeLabel: current.label, select: setInternal, visible, counts, total: items.length };
}

export default function SectorsD() {
  const full = useFull();
  const reduced = !full;
  const uid = useId();
  const gridId = `${uid}-grid`;
  const { active, activeLabel, select, visible, counts, total } = useFilterGrid({ items: ITEMS, filters: FILTERS });
  const gridRef = useRef<HTMLUListElement>(null);
  const chips = useRef<(HTMLButtonElement | null)[]>([]);
  const heldFocus = useRef(false);
  const index = Math.max(0, FILTERS.findIndex((f) => f.id === active));

  const choose = useCallback((id: string) => {
    const grid = gridRef.current;
    heldFocus.current = !!grid && grid.contains(document.activeElement) && grid !== document.activeElement;
    select(id);
  }, [select]);

  const settle = useCallback(() => {
    if (!heldFocus.current) return;
    heldFocus.current = false;
    const grid = gridRef.current;
    if (grid && !grid.contains(document.activeElement)) grid.focus();
  }, []);

  const go = (i: number) => {
    const n = (i + FILTERS.length) % FILTERS.length;
    chips.current[n]?.focus();
    choose(FILTERS[n].id);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); go(i + 1); }
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); go(i - 1); }
    else if (e.key === "Home") { e.preventDefault(); go(0); }
    else if (e.key === "End") { e.preventDefault(); go(FILTERS.length - 1); }
  };

  const swap = reduced ? INSTANT : CELL;
  const step = reduced ? INSTANT : { layout: MOVE, duration: 0.2, ease: EASE };
  const leave = reduced ? INSTANT : LEAVE;

  return (
    <div className="bg-paper py-[var(--u-section-y)] text-ink">
      <div className="u-wrap">
        <div className="grid gap-8 border-b border-ink/10 pb-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow className="text-ink/55" />
            <h2 className="mt-5 max-w-[16ch] text-[clamp(2.2rem,4.6vw,4rem)] leading-[1.02] tracking-[-0.045em] text-ink !font-body !font-normal">{TITLE}</h2>
          </div>
          <p className="max-w-[44ch] text-[1.02rem] leading-relaxed text-ink/65 lg:col-span-5">{LEAD}</p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <div role="radiogroup" aria-label="Filtrar sectores" aria-controls={gridId} className="flex flex-wrap items-center gap-1.5">
            {FILTERS.map((f, i) => {
              const on = i === index;
              return (
                <button key={f.id} ref={(n) => { chips.current[i] = n; }} type="button" role="radio" aria-checked={on} tabIndex={on ? 0 : -1}
                  onClick={() => choose(f.id)} onKeyDown={(e) => onKeyDown(e, i)}
                  className="group relative inline-grid h-11 select-none place-items-center rounded-full px-4 outline-none" style={{ touchAction: "manipulation" }}>
                  {on && <motion.span aria-hidden layoutId={reduced ? undefined : `${uid}-thumb`} transition={CELL} className="absolute inset-0 rounded-full bg-ink" />}
                  <span aria-hidden className={cn("pointer-events-none absolute inset-0 rounded-full border group-focus-visible:border-brand-strong group-focus-visible:ring-2 group-focus-visible:ring-brand-strong/30", on ? "border-transparent" : "border-ink/15")} />
                  <span className="relative col-start-1 row-start-1 inline-grid">
                    <motion.span aria-hidden initial={false} animate={{ opacity: on ? 0 : 1 }} transition={swap}
                      className="col-start-1 row-start-1 inline-flex items-center gap-2 whitespace-nowrap text-[13px] font-medium text-ink/75">
                      {f.label}<span className="text-[11px] tabular-nums text-ink/45">{counts[f.id]}</span>
                    </motion.span>
                    <motion.span aria-hidden initial={false} animate={{ opacity: on ? 1 : 0 }} transition={swap}
                      className="col-start-1 row-start-1 inline-flex items-center gap-2 whitespace-nowrap text-[13px] font-medium text-white">
                      {f.label}<span className="text-[11px] tabular-nums opacity-70">{counts[f.id]}</span>
                    </motion.span>
                    <span className="sr-only">{f.label}, {counts[f.id]} de {total}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50" aria-hidden>
            <span className="tabular-nums text-ink">{String(visible.length).padStart(2, "0")}</span> / {String(total).padStart(2, "0")}
          </p>
        </div>

        <ul id={gridId} ref={gridRef} tabIndex={-1} className="relative mt-8 grid grid-cols-2 gap-x-4 gap-y-10 outline-none md:gap-x-6 lg:grid-cols-4 lg:gap-y-14">
          <AnimatePresence initial={false} mode="popLayout" onExitComplete={settle}>
            {visible.map((s) => (
              <motion.li key={s.name} layout={reduced ? false : "position"}
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98, transition: leave }}
                transition={step} className="group min-w-0">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-ink/5">
                  <img src={s.img} alt={s.alt} loading="lazy" decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]" />
                </div>
                <div className="mt-4 flex items-baseline gap-3 border-t border-ink/15 pt-3">
                  <span className="font-mono text-[11px] tabular-nums text-ink/45">{s.n}</span>
                  <h3 className="min-w-0 font-body text-[clamp(1rem,1.5vw,1.3rem)] !font-normal leading-tight tracking-[-0.02em] text-ink">{s.name}</h3>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        <p aria-live="polite" className="sr-only">{activeLabel}: {visible.length} de {total} sectores</p>

        <div className="mt-14 flex justify-center">
          <a href={CONTACT_URL} className="group inline-flex min-h-[44px] items-center gap-3 border-b border-ink/25 text-sm font-medium text-ink transition-colors hover:border-ink">
            Cuéntanos tu sector <ArrowUR className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
