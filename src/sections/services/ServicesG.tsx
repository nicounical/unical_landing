/**
 * SERVICIOS G · Interactive Gallery — basado en 21st.dev «Elastic Gallery» (id 9859).
 * Del original se conserva: acordeón horizontal de imágenes (vertical en móvil) donde la pieza activa ocupa 4 partes
 * y el resto 1, activación por hover y por clic/toque, inactivas al 50 % de brillo (75 % al pasar), zoom 110 → 100
 * en la activa, degradado inferior, etiqueta de categoría en píldora de cristal, título en mayúsculas de peso máximo,
 * CTA con flecha, título en vertical (writing-mode) en las plegadas y solo el número en móvil; arranca en la 03.
 * Adaptación: next/image → <img loading="lazy">; transición de flex-grow con curva de rebote (elástica de verdad,
 * el original usaba una ease-out); botones accesibles con flechas/Inicio/Fin y enlace real «Ver servicio» fuera del
 * botón; texto del servicio en la activa; contador y fondo negro de galería. Estático: rejilla legible.
 */
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { finePointer } from "@/core/env";
import { cn } from "@/lib/utils";
import { ArrowUR, Eyebrow, ITEMS, TITLE, pad, useFull } from "./shared";

const ELASTIC = "cubic-bezier(0.34, 1.45, 0.5, 1)";

function Head({ count }: { count?: React.ReactNode }) {
  return (
    <div className="u-wrap flex flex-wrap items-end justify-between gap-6">
      <div>
        <Eyebrow className="text-brand" />
        <h2 className="mt-4 max-w-[15ch] text-[length:var(--u-h2)] font-extrabold leading-[.98] tracking-[-0.045em] text-white">{TITLE}</h2>
      </div>
      {count}
    </div>
  );
}

function StaticView() {
  return (
    <div className="bg-black py-[var(--u-section-y)] text-white">
      <Head />
      <ol className="u-wrap mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((s) => (
          <li key={s.n} className="relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl border border-neutral-800 p-6">
            <img src={s.img} alt={s.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="relative">
              <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white">{s.sub}</span>
              <h3 className="mt-3 text-3xl font-black uppercase leading-none text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-white/80">{s.text}</p>
              <a href={s.href} className="mt-2 inline-flex min-h-[44px] items-center gap-2 text-xs font-bold uppercase tracking-widest text-white">Ver servicio <span className="sr-only">{s.title}</span><ArrowUR /></a>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function ServicesG() {
  const full = useFull();
  const [active, setActive] = useState(2);
  const [hoverDevice, setHoverDevice] = useState(() => finePointer());
  const btns = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const on = (e: MediaQueryListEvent) => setHoverDevice(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const map: Record<string, number> = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: ITEMS.length - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const n = Math.min(ITEMS.length - 1, Math.max(0, map[e.key]));
    setActive(n);
    btns.current[n]?.focus();
  };

  if (!full) return <StaticView />;

  return (
    <div className="bg-black py-[var(--u-section-y)] text-white">
      <Head count={
        <div className="flex items-center gap-5" aria-hidden>
          <p className="hidden text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45 md:block">Pasa el cursor · ← → · clic</p>
          <p className="font-mono text-sm tabular-nums text-white">{pad(active + 1)} <span className="text-white/40">/ {pad(ITEMS.length)}</span></p>
        </div>
      } />

      <div role="group" aria-label="Galería de servicios" className="u-wrap mt-10 flex h-[620px] flex-col gap-2 md:mt-14 md:h-[min(74vh,640px)] md:flex-row md:gap-3">
        {ITEMS.map((s, i) => {
          const on = i === active;
          return (
            <div key={s.n}
              className="group relative min-h-0 min-w-0 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950"
              style={{ flex: `${on ? 4 : 1} 1 0%`, transition: `flex-grow 900ms ${ELASTIC}` }}>
              <button ref={(el) => { btns.current[i] = el; }} type="button" aria-pressed={on} aria-label={`${s.n} ${s.title}, ${s.sub}`}
                onMouseEnter={() => hoverDevice && setActive(i)} onClick={() => setActive(i)} onFocus={() => setActive(i)} onKeyDown={(e) => onKey(e, i)}
                className="absolute inset-0 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand">
                <img src={s.img} alt={s.alt} loading="lazy" decoding="async" draggable={false}
                  className={cn("absolute inset-0 h-full w-full object-cover transition-transform duration-1000", on ? "scale-100" : "scale-110")} />
                {/* brillo 50 % / 75 % al pasar (el original usaba filter: brightness) */}
                <span className={cn("absolute inset-0 bg-black transition-opacity duration-500", on ? "opacity-0" : "opacity-50 group-hover:opacity-25")} aria-hidden />
                <span className={cn("absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity duration-500", on ? "opacity-100" : "opacity-0")} aria-hidden />

                {/* Plegada: título en vertical (escritorio) / número + título (móvil) */}
                <span aria-hidden className={cn("absolute transition-all duration-500 left-4 top-1/2 -translate-y-1/2 md:left-1/2 md:top-auto md:bottom-8 md:-translate-x-1/2 md:translate-y-0",
                  on ? "scale-50 opacity-0" : "opacity-100 delay-300")}>
                  <span className="hidden whitespace-nowrap text-lg font-bold uppercase tracking-widest text-white [writing-mode:vertical-rl] md:block lg:text-xl">{s.title}</span>
                  <span className="flex items-center gap-3 text-sm font-bold text-white md:hidden"><span className="font-mono text-xs text-white/70">{s.n}</span>{s.title}</span>
                </span>

                {/* Activa: categoría, título y texto */}
                <span className={cn("absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 pb-20 transition-all duration-500 md:p-8 md:pb-24",
                  on ? "translate-y-0 opacity-100 delay-200" : "pointer-events-none translate-y-12 opacity-0")}>
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs text-white/70">{s.n}</span>
                    <span className="rounded-full border border-white/30 bg-white/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-md md:px-3 md:text-xs">{s.sub}</span>
                  </span>
                  <span className="block font-head text-2xl font-black uppercase leading-none tracking-[-0.02em] text-white md:text-5xl">{s.title}</span>
                  <span className="mt-1 line-clamp-3 max-w-[46ch] text-sm leading-snug text-white/80 md:text-base">{s.text}</span>
                </span>
              </button>
              {on && (
                <a href={s.href} className="absolute bottom-4 left-5 z-10 inline-flex min-h-[44px] items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/90 hover:text-brand md:bottom-7 md:left-8 md:text-sm">
                  Ver servicio <span className="sr-only">{s.title}</span><ArrowUR className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
