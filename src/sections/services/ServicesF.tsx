/**
 * SERVICIOS F · Editorial Kinetic — basado en 21st.dev «Hover Expand» (id 28111, educalvolpz).
 * Del original se conserva: paneles de imagen que reparten el espacio con `flex-grow` animado (expandido 5 / plegado 1,
 * `flex-basis: 0`), activación por hover en dispositivos con puntero fino y por clic/toque en táctiles, el foco de
 * teclado activa el panel y las flechas mueven foco y selección (orientación vertical → ↑ ↓), etiquetas visibles
 * también en plegado, `aria-pressed` y muelle con poco rebote.
 * Adaptación: orientación vertical en bandas a todo el ancho de columna; columna editorial con numeral gigante y título
 * que entran con barrido cinético (máscaras + letras escalonadas) al cambiar de servicio; fondo azul profundo de marca.
 * El enlace «Ver servicio» vive fuera del botón (no se anidan interactivos). Estático: lista legible sin acordeón.
 */
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { finePointer } from "@/core/env";
import { cn } from "@/lib/utils";
import { ArrowUR, Eyebrow, ITEMS, SCOPE, TITLE, pad, useFull } from "./shared";

const ease = [0.76, 0, 0.24, 1] as const;

function Head() {
  return (
    <>
      <Eyebrow className="text-brand" />
      <h2 className="mt-4 max-w-[13ch] text-[clamp(2.2rem,4.4vw,4rem)] font-extrabold leading-[.96] tracking-[-0.05em] text-white">
        {TITLE.replace(/ fin\.$/, " ")}<em className="font-head font-light italic text-brand">fin.</em>
      </h2>
    </>
  );
}

function StaticView() {
  return (
    <div className="bg-brand-deep py-[var(--u-section-y)] text-white">
      <div className="u-wrap">
        <Head />
        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((s) => (
            <li key={s.n} className="overflow-hidden rounded-2xl bg-white/5">
              <img src={s.img} alt={s.alt} loading="lazy" className="aspect-[16/10] w-full object-cover" />
              <div className="p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand">{s.n} · {s.sub}</p>
                <h3 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{s.text}</p>
                <a href={s.href} className="mt-3 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-white">Ver servicio <span className="sr-only">{s.title}</span><ArrowUR /></a>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function ServicesF() {
  const full = useFull();
  const [active, setActive] = useState(0);
  const [hoverDevice, setHoverDevice] = useState(() => finePointer());
  const btns = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const on = (e: MediaQueryListEvent) => setHoverDevice(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const map: Record<string, number> = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: ITEMS.length - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const n = Math.min(ITEMS.length - 1, Math.max(0, map[e.key]));
    setActive(n);
    btns.current[n]?.focus();
  };

  if (!full) return <StaticView />;
  const s = ITEMS[active];
  const spring = { type: "spring" as const, bounce: 0.12, duration: 0.6 };

  return (
    <div className="relative overflow-hidden bg-brand-deep py-[var(--u-section-y)] text-white">
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[40rem] w-[40rem] rounded-full bg-brand/15 blur-[120px]" aria-hidden />
      <div className="u-wrap relative grid gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Columna editorial */}
        <div className="flex flex-col lg:col-span-5">
          <Head />
          <div className="mt-auto hidden pt-12 lg:block">
            <div className="flex items-end gap-5 overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={s.n} aria-hidden className="block font-head text-[clamp(7rem,13vw,12rem)] font-bold leading-[.8] tracking-[-0.07em] text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,.85)]"
                  initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "-100%" }} transition={{ duration: 0.7, ease }}>{s.n}</motion.span>
              </AnimatePresence>
              <span className="mb-3 font-mono text-xs tabular-nums text-white/50" aria-hidden>/ {pad(ITEMS.length)}</span>
            </div>
            <h3 aria-label={s.title} className="mt-6 overflow-hidden text-[clamp(1.8rem,2.8vw,2.6rem)] font-bold leading-[1.05] tracking-[-0.04em] text-white">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={s.n} aria-hidden className="block" initial="in" animate="on" exit="out" transition={{ staggerChildren: 0.025 }}>
                  {s.title.split("").map((c, k) => (
                    <motion.span key={k} className="inline-block whitespace-pre"
                      variants={{ in: { y: "110%", rotate: 8 }, on: { y: "0%", rotate: 0 }, out: { y: "-110%", opacity: 0 } }}
                      transition={{ duration: 0.55, ease }}>{c}</motion.span>
                  ))}
                </motion.span>
              </AnimatePresence>
            </h3>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={s.n} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.45, ease }}>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-brand">{s.sub}</p>
                <p className="mt-4 max-w-[40ch] text-[1.02rem] leading-relaxed text-white/80">{s.text}</p>
                <p className="mt-4 text-[13px] text-white/55">{SCOPE[s.n].join(" · ")}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bandas que se expanden (Hover Expand, vertical) */}
        <div className="lg:col-span-7">
          <div role="group" aria-label="Servicios: paneles expandibles" className="flex h-[min(86svh,640px)] flex-col gap-2 lg:h-[min(80vh,700px)]">
            {ITEMS.map((it, i) => {
              const on = i === active;
              return (
                <motion.div key={it.n} className="relative min-h-0 overflow-hidden rounded-xl" style={{ flexBasis: 0 }}
                  initial={false} animate={{ flexGrow: on ? 5 : 1 }} transition={spring}>
                  <button ref={(el) => { btns.current[i] = el; }} type="button" aria-pressed={on} aria-label={`${it.n} ${it.title}, ${it.sub}`}
                    onClick={() => setActive(i)} onFocus={() => setActive(i)} onKeyDown={(e) => onKey(e, i)}
                    onMouseEnter={() => hoverDevice && setActive(i)}
                    className="group absolute inset-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand">
                    <motion.img src={it.img} alt={it.alt} loading="lazy" decoding="async" draggable={false}
                      className="absolute inset-0 h-full w-full object-cover" initial={false}
                      animate={{ scale: on ? 1 : 1.15, filter: on ? "saturate(1)" : "saturate(.35)" }} transition={{ duration: 0.9, ease }} />
                    <span className={cn("absolute inset-0 transition-colors duration-500", on ? "bg-gradient-to-t from-black/80 via-black/20 to-transparent" : "bg-brand-deep/70 group-hover:bg-brand-deep/55")} aria-hidden />
                    <span className={cn("absolute inset-x-0 flex flex-col justify-center px-5 md:px-6", on ? "bottom-0 pb-5 md:pb-6" : "inset-y-0")}>
                      <span className="flex items-center gap-4">
                        <span className="font-mono text-[11px] tabular-nums text-white/70">{it.n}</span>
                        <span className={cn("font-head font-semibold leading-none tracking-[-0.035em] text-white transition-[font-size] duration-500", on ? "text-[clamp(1.6rem,3vw,2.6rem)]" : "text-[clamp(1rem,1.5vw,1.25rem)]")}>{it.title}</span>
                        <span className={cn("ml-auto hidden font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/70 sm:block", on && "sm:hidden")}>{it.sub}</span>
                      </span>
                      {/* Móvil: el texto vive dentro de la banda activa */}
                      {on && <span className="mt-3 max-w-[40ch] text-sm leading-snug text-white/85 lg:hidden">{it.text}</span>}
                    </span>
                  </button>
                  {on && (
                    <a href={it.href} className="absolute right-4 top-4 z-10 inline-flex md:bottom-5 md:right-5 md:top-auto min-h-[44px] items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-ink transition-colors hover:bg-brand">
                      Ver servicio <span className="sr-only">{it.title}</span><ArrowUR />
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>
          <p className="mt-4 hidden text-[10px] font-semibold uppercase tracking-[0.24em] text-white/50 md:block">Pasa el cursor · ↑ ↓ · clic</p>
        </div>
      </div>
    </div>
  );
}
