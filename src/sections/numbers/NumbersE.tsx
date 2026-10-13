/**
 * CIFRAS E · High-Energy Motion — basado en 21st.dev «Stats Band» (id 35089).
 * Del original se conserva: banda de cifras en rejilla de líneas finas (layout «divided», reglas arriba y abajo),
 * cada cifra cuenta desde cero con `animate` de motion la primera vez que entra en pantalla (escalonado
 * 0.09 s, 1.6 s, curva de entrada), la cifra final reserva el ancho debajo para que nada se mueva, los lectores de
 * pantalla solo reciben el valor final, el visual de cada cifra se «dibuja» después del conteo, y al pasar el
 * cursor o enfocar una cifra su línea de detalle se cambia por una línea de contexto y el visual toma el acento.
 * Adaptación: los mini-gráficos con datos (tendencia, uptime, histograma, mapa) se sustituyen por una franja de
 * foto real del trabajo que se revela con una cortinilla (no representa ningún dato). Detalle y contexto son frases
 * reales de site.ts (why, clients, sectors). Fondo azul de marca; en táctil se muestran detalle y contexto a la vez.
 */
import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";
import { animate, useInView } from "motion/react";
import { clients, sectors, services, why } from "@/content/site";
import { cn } from "@/lib/utils";
import { Eyebrow, ITEMS, LEAD, NumTitle, finalText, group, useFull, type NumItem } from "./shared";

const ENTER = [0.16, 1, 0.3, 1] as const;
const STAGGER = 0.09;
const DURATION = 1.6;

/** Detalle + contexto + foto de cada cifra (todo texto e imagen reales de site.ts). */
const EXTRA = [
  { detail: why.pillars[0].title, context: "Sin subcontrataciones: la calidad y los plazos los controlamos nosotros.", img: why.pillars[0].img },
  { detail: clients.footText.replace(/^más para /, "Para ").replace(/\.$/, ""), context: "Cada logo es un proyecto que salió como tenía que salir.", img: services.items[1].img },
  { detail: sectors.items.slice(0, 3).map((s) => s.name).join(", ") + "…", context: "El mismo nivel de exigencia y detalle en todos los proyectos.", img: sectors.items[1].img },
  { detail: why.pillars[2].title, context: "Acabados perfectos en cualquier ubicación, por complicada que sea.", img: why.pillars[2].img },
];

function CountUp({ it, run, delay, full }: { it: NumItem; run: boolean; delay: number; full: boolean }) {
  const live = useRef<HTMLSpanElement>(null);
  const done = useRef(false);
  const final = group(it.value ?? 0);

  useLayoutEffect(() => {
    if (!full || done.current || !live.current) return;
    live.current.textContent = "0";
  }, [full]);

  useEffect(() => {
    const node = live.current;
    if (!node) return;
    if (!full) { node.textContent = final; done.current = true; return; }
    if (!run || done.current) return;
    const c = animate(0, it.value ?? 0, {
      duration: DURATION, delay, ease: [...ENTER],
      onUpdate: (v) => { node.textContent = group(v); },
      onComplete: () => { node.textContent = final; done.current = true; },
    });
    return () => c.stop();
  }, [run, full, delay, it.value, final]);

  return (
    <>
      <span className="sr-only">{finalText(it)}</span>
      <span aria-hidden className="inline-flex items-baseline">
        {it.prefix && <span className="mr-[.04em] text-brand">{it.prefix}</span>}
        <span className="relative inline-block tabular-nums">
          <span className="invisible">{final}</span>
          <span ref={live} className="absolute inset-0">{final}</span>
        </span>
      </span>
    </>
  );
}

function Cell({ it, i, full }: { it: NumItem; i: number; full: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const on = inView || !full;
  const x = EXTRA[i];
  const visDelay = full ? `${i * STAGGER + DURATION * 0.75}s` : "0s";
  return (
              <div ref={ref} tabIndex={0}
                className="group/stat relative flex flex-col gap-3 bg-brand-strong px-1 py-8 outline-none transition-colors focus-visible:bg-[#3474aa] sm:px-6 lg:px-7 lg:py-10">
                <dt className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/70">{it.label}</dt>
                <dd className={cn("font-head font-bold leading-none tracking-[-0.045em] text-white",
                  it.text ? "text-[clamp(2rem,3.1vw,2.8rem)]" : "text-[clamp(3rem,4.7vw,4.5rem)]")}
                  style={full ? { transform: on ? "none" : "translateY(30%)", opacity: on ? 1 : 0, transition: `transform 1s cubic-bezier(.16,1,.3,1) ${i * STAGGER}s, opacity .6s ${i * STAGGER}s` } : undefined}>
                  {it.text ? <span>{it.text}</span> : <CountUp it={it} run={on} delay={i * STAGGER} full={full} />}
                </dd>
                {/* Detalle ↔ contexto (hover/focus); en táctil se ven ambos */}
                <dd className="relative min-h-[3.2em] text-[14px] leading-snug">
                  <span className="block text-white/75 transition-all duration-300 [@media(hover:hover)]:group-hover/stat:-translate-y-1 [@media(hover:hover)]:group-hover/stat:opacity-0 [@media(hover:hover)]:group-focus-visible/stat:opacity-0">{x.detail}</span>
                  <span className="mt-1 block text-white transition-all duration-300 [@media(hover:hover)]:pointer-events-none [@media(hover:hover)]:absolute [@media(hover:hover)]:inset-x-0 [@media(hover:hover)]:top-0 [@media(hover:hover)]:mt-0 [@media(hover:hover)]:translate-y-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/stat:translate-y-0 [@media(hover:hover)]:group-hover/stat:opacity-100 [@media(hover:hover)]:group-focus-visible/stat:translate-y-0 [@media(hover:hover)]:group-focus-visible/stat:opacity-100">{x.context}</span>
                </dd>
                {/* Visual no-dato: franja de foto real que se revela tras el conteo */}
                <dd aria-hidden className="mt-2 overflow-hidden rounded-md">
                  <div className="relative aspect-[16/6] w-full"
                    style={{ clipPath: on ? "inset(0 0 0 0)" : "inset(0 100% 0 0)", transition: full ? `clip-path var(--draw) cubic-bezier(.65,0,.35,1) ${visDelay}` : "none" }}>
                    <img src={x.img} alt="" loading="lazy" decoding="async"
                      className="h-full w-full scale-110 object-cover grayscale transition-[filter,transform] duration-700 group-hover/stat:scale-100 group-hover/stat:grayscale-0 group-focus-visible/stat:grayscale-0" />
                    <span className="absolute inset-0 bg-brand-deep/40 mix-blend-multiply transition-opacity duration-500 group-hover/stat:opacity-0" />
                    <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-brand transition-all duration-500 group-hover/stat:w-full group-focus-visible/stat:w-full" />
                  </div>
                </dd>
              </div>
            );
}

export default function NumbersE() {
  const full = useFull();

  return (
    <div className="relative overflow-hidden bg-brand-strong py-[var(--u-section-y)] text-white">
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand/30 blur-[120px]" />
      <div className="u-wrap relative">
        <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Eyebrow className="text-white/80" />
            <NumTitle emClassName="!text-brand" className="mt-5 max-w-[18ch] text-[clamp(2.2rem,5vw,4.4rem)] font-extrabold leading-[.98] tracking-[-0.045em] text-white" />
          </div>
          <p className="max-w-[42ch] text-[1.02rem] leading-relaxed text-white/80 lg:col-span-4 lg:justify-self-end">{LEAD}</p>
        </header>

        <dl
          className="mt-14 grid grid-cols-1 gap-px border-y border-white/25 bg-white/25 sm:grid-cols-2 md:mt-20 lg:grid-cols-4"
          style={{ ["--draw" as string]: `${Math.round(DURATION * 420)}ms` } as CSSProperties}>
          {ITEMS.map((it, i) => <Cell key={it.label} it={it} i={i} full={full} />)}
        </dl>
      </div>
    </div>
  );
}
