/**
 * CLIENTES C · Experimental Creative — basado en 21st.dev «Logo Carousel» (id 18220, witharc).
 * Del original se conserva: ranuras que reparten la lista (cliente i → ranura i % n) y la recorren cada una a su
 * ritmo con escalonado (retardo inicial 2500 ms + 150 ms por ranura, ciclo de 3000 ms); transición
 * `AnimatePresence mode="popLayout"` con entrada y:20 + blur(8px) y salida y:-20 + blur(8px) en 0,5 s; número de
 * ranuras adaptable (1 móvil · 2 tableta · 3 escritorio); pausa al ocultar la pestaña conservando el tiempo restante;
 * variante «light» (marcas blancas sobre banda azul); rol `carousel` / `slide` accesible.
 * Adaptación: los logotipos SVG en base64 y enlaces externos pasan a ser los 25 clientes reales como marcas
 * tipográficas enormes (el favicon real queda como pequeño distintivo, nunca ampliado); sin `next/link`; el «& more»
 * se sustituye por un índice completo de los 25 nombres que resalta los que están en pantalla; botón de pausa y
 * pausa al pasar el cursor o enfocar (autoplay continuo); cifra real «+3.000 proyectos» como cierre.
 */
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { CLIENTS, Eyebrow, FOOT, FOOT_TEXT, LEAD, TITLE, hasIcon, pad, useFull, type Client } from "./shared";

const INITIAL_DELAY = 2500;
const SLOT_STAGGER = 150;
const CYCLE_INTERVAL = 3000;
const ORDER = CLIENTS.map((c, i) => ({ c, i }));

function useSlotCount(): number {
  const [count, setCount] = useState(3);
  useEffect(() => {
    const md = window.matchMedia("(min-width: 768px)");
    const lg = window.matchMedia("(min-width: 1024px)");
    const update = () => setCount(lg.matches ? 3 : md.matches ? 2 : 1);
    update();
    md.addEventListener("change", update);
    lg.addEventListener("change", update);
    return () => { md.removeEventListener("change", update); lg.removeEventListener("change", update); };
  }, []);
  return count;
}

/** Recorre una lista; se detiene con la pestaña oculta conservando el tiempo restante (como el original). */
function useLogoCycle<T>(list: T[], initialDelay: number, enabled: boolean) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let id: ReturnType<typeof setTimeout> | null = null;
    let startedAt = 0;
    let remaining = step === 0 ? initialDelay : CYCLE_INTERVAL;
    const schedule = (d: number) => { remaining = d; startedAt = Date.now(); id = setTimeout(() => setStep((s) => s + 1), d); };
    const pause = () => { if (id != null) { clearTimeout(id); id = null; remaining = Math.max(0, remaining - (Date.now() - startedAt)); } };
    const onVis = () => (document.hidden ? pause() : schedule(remaining));
    document.addEventListener("visibilitychange", onVis);
    if (!document.hidden) schedule(remaining);
    return () => { if (id != null) clearTimeout(id); document.removeEventListener("visibilitychange", onVis); };
  }, [enabled, step, initialDelay]);
  return { current: list[step % list.length], hasCycled: step > 0 };
}

function Face({ c, i }: { c: Client; i: number }) {
  return (
    <span className="flex h-full flex-col items-start justify-between gap-4">
      <span className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">
        {hasIcon(c) && <img src={c.logo} alt="" width={22} height={22} loading="lazy" className="h-[22px] w-[22px] rounded-[5px] bg-white object-contain p-[2px]" />}
        <span className="tabular-nums">{pad(i + 1)} / {CLIENTS.length}</span>
      </span>
      <span className="block font-head text-[clamp(2.3rem,3vw,3.2rem)] font-extrabold leading-[0.95] tracking-[-0.045em] text-white [overflow-wrap:anywhere] [text-wrap:balance]">
        {c.name}
      </span>
    </span>
  );
}

function Slot({ items, slot, enabled, onShow }: { items: { c: Client; i: number }[]; slot: number; enabled: boolean; onShow: (slot: number, i: number) => void }) {
  const { current, hasCycled } = useLogoCycle(items, INITIAL_DELAY + slot * SLOT_STAGGER, enabled);
  useEffect(() => onShow(slot, current.i), [current.i, slot, onShow]);
  return (
    <div role="group" aria-roledescription="diapositiva" aria-label={current.c.name}
      className="relative flex h-[11.5rem] min-w-0 items-stretch overflow-hidden border-t border-white/25 pb-2 pt-6 md:border-l md:border-t-0 md:pl-8 md:first:border-l-0 md:first:pl-0">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div key={current.c.name}
          initial={hasCycled ? { y: 20, opacity: 0, filter: "blur(8px)" } : false}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -20, opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="h-full w-full will-change-[filter]">
          <Face c={current.c} i={current.i} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden bg-brand-deep py-[var(--u-section-y)] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,#1E5076_0%,#2E6CA0_55%,#1E5076_100%)]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 opacity-[.07] [background-image:repeating-linear-gradient(90deg,#fff_0_1px,transparent_1px_80px)]" aria-hidden />
      <div className="u-wrap relative">{children}</div>
    </div>
  );
}

function Head({ right }: { right?: React.ReactNode }) {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-7">
        <Eyebrow className="text-white/75" />
        <h2 className="mt-5 text-[clamp(2.2rem,5vw,4.2rem)] font-extrabold leading-[0.98] tracking-[-0.045em] text-white">{TITLE}</h2>
      </div>
      <div className="flex flex-col gap-6 lg:col-span-5 lg:items-end">
        <p className="max-w-[44ch] text-[1.02rem] leading-relaxed text-white/75 lg:text-right">{LEAD}</p>
        {right}
      </div>
    </div>
  );
}

function Index({ live }: { live: Set<number> }) {
  return (
    <div className="mt-14 border-t border-white/25 pt-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">Índice · {CLIENTS.length} clientes</p>
      <ul aria-label="Todos los clientes" className="mt-4 flex flex-wrap gap-x-2 gap-y-1.5 text-[15px] leading-snug">
        {ORDER.map(({ c, i }) => (
          <li key={c.name} className={cn("transition-colors duration-500", live.has(i) ? "text-white" : "text-white/55")}>
            <span className={cn("rounded-sm px-1 transition-colors duration-500", live.has(i) && "bg-white/15")}>{c.name}</span>
            {i < CLIENTS.length - 1 && <span className="text-white/30" aria-hidden> /</span>}
          </li>
        ))}
      </ul>
      <p className="mt-10 text-sm text-white/70"><strong className="font-head text-[clamp(1.6rem,2.6vw,2.2rem)] font-extrabold tracking-[-0.04em] text-white">{FOOT}</strong> <span className="ml-2">{FOOT_TEXT}</span></p>
    </div>
  );
}

function StaticView() {
  return (
    <Shell>
      <Head />
      <div className="mt-14 grid gap-x-8 md:grid-cols-3">
        {CLIENTS.slice(0, 3).map((c, i) => (
          <div key={c.name} className="flex h-[11.5rem] items-stretch border-t border-white/25 pb-2 pt-6 md:border-l md:border-t-0 md:pl-8 md:first:border-l-0 md:first:pl-0"><Face c={c} i={i} /></div>
        ))}
      </div>
      <Index live={new Set([0, 1, 2])} />
    </Shell>
  );
}

function Carousel() {
  const slotCount = useSlotCount();
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const [shown, setShown] = useState<Record<number, number>>({});
  const slots = useMemo(() => Array.from({ length: slotCount }, (_, s) => ORDER.filter((_, i) => i % slotCount === s)), [slotCount]);
  const onShow = useMemo(() => (slot: number, i: number) => setShown((p) => (p[slot] === i ? p : { ...p, [slot]: i })), []);
  const live = new Set(Object.entries(shown).filter(([s]) => Number(s) < slotCount).map(([, i]) => i));
  const running = !paused && !held;

  const btn = (
    <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused}
      aria-label={paused ? "Reanudar la rotación de clientes" : "Pausar la rotación de clientes"}
      className="inline-flex h-11 items-center gap-2 self-start rounded-full border border-solid border-white/40 lg:self-end px-5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white hover:text-brand-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
      {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
      {paused ? "Reanudar" : "Pausar"}
    </button>
  );

  return (
    <Shell>
      <Head right={btn} />
      <div role="region" aria-roledescription="carrusel" aria-label="Clientes de Unical"
        onPointerEnter={(e) => { if (e.pointerType === "mouse") setHeld(true); }} onPointerLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)} onBlur={() => setHeld(false)}
        className="mt-14 grid gap-x-8" style={{ gridTemplateColumns: `repeat(${slotCount}, minmax(0, 1fr))` }}>
        {slots.map((items, s) => <Slot key={`${slotCount}-${s}`} items={items} slot={s} enabled={running} onShow={onShow} />)}
      </div>
      <Index live={live} />
    </Shell>
  );
}

export default function ClientsC() {
  return useFull() ? <Carousel /> : <StaticView />;
}
