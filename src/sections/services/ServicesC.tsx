/**
 * SERVICIOS C · Experimental Creative — basado en 21st.dev «Hover Image List» (id 28258, educalvolpz).
 * Del original se conserva: lista de filas-enlace que, al pasar el cursor, revela una imagen que sigue al puntero
 * con muelle (SPRING_CONFIG 26/260) e inclinación proporcional a la velocidad horizontal (SKEW_FACTOR, MAX_SKEW),
 * lectura del puntero agrupada por requestAnimationFrame, modo fijo al navegar con teclado y AnimatePresence
 * en el cambio de imagen.
 * Adaptación: índice tipográfico a gran escala (Poppins) con las filas no activas en contorno, previsualización
 * vertical con número y subtítulo, foco de teclado que coloca la imagen junto a la fila enfocada. En pantallas
 * táctiles y en modo estático (donde no hay hover) cada fila muestra su miniatura siempre visible.
 */
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { finePointer } from "@/core/env";
import { cn } from "@/lib/utils";
import { ArrowUR, Eyebrow, ITEMS, TITLE, pad, useFull } from "./shared";

const W = 300, H = 380;
const SPRING = { damping: 26, stiffness: 260 };
const SKEW_SPRING = { damping: 18, stiffness: 220 };
const MAX_SKEW = 8, SKEW_FACTOR = 0.12, MAX_DT = 50;
const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

export default function ServicesC() {
  const full = useFull();
  const [hoverDevice, setHoverDevice] = useState(() => finePointer());
  const follow = full && hoverDevice;
  const [active, setActive] = useState<number | null>(null);
  const [source, setSource] = useState<"pointer" | "focus" | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const last = useRef<{ t: number; x: number } | null>(null);
  const pending = useRef<{ x: number; y: number } | null>(null);
  const raf = useRef<number | null>(null);

  const x = useMotionValue(0), y = useMotionValue(0), skew = useMotionValue(0);
  const sx = useSpring(x, SPRING), sy = useSpring(y, SPRING), sk = useSpring(skew, SKEW_SPRING);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const on = (e: MediaQueryListEvent) => setHoverDevice(e.matches);
    mq.addEventListener("change", on);
    return () => { mq.removeEventListener("change", on); if (raf.current !== null) cancelAnimationFrame(raf.current); };
  }, []);

  const onMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (!follow || source === "focus") return;
    pending.current = { x: e.clientX, y: e.clientY };
    if (raf.current !== null) return;
    raf.current = requestAnimationFrame((now) => {
      raf.current = null;
      const p = pending.current, el = box.current;
      if (!p || !el) return;
      const r = el.getBoundingClientRect();
      const lx = p.x - r.left, ly = p.y - r.top;
      let vx = 0;
      if (last.current) { const dt = Math.min(now - last.current.t, MAX_DT); if (dt > 0) vx = (lx - last.current.x) / dt; }
      last.current = { t: now, x: lx };
      skew.set(clamp(vx * SKEW_FACTOR * 10, -MAX_SKEW, MAX_SKEW));
      x.set(lx - W / 2);
      y.set(ly - H / 2);
    });
  }, [follow, source, skew, x, y]);

  /** Foco de teclado: la imagen se coloca fija junto a la fila enfocada (sin seguir al cursor). */
  const focusRow = (i: number, el: HTMLElement) => {
    setActive(i); setSource("focus");
    const c = box.current;
    if (!c) return;
    const r = el.getBoundingClientRect(), cr = c.getBoundingClientRect();
    // entre el final del título y la columna de texto, para no tapar la descripción de la fila enfocada
    const t = el.querySelector("[data-t]")?.getBoundingClientRect();
    const d = el.querySelector("[data-d]")?.getBoundingClientRect();
    const maxX = (d ? d.left - cr.left : cr.width * 0.6) - W - 24;
    x.jump(Math.max(0, Math.min((t ? t.right - cr.left : 0) + 32, maxX))); y.jump(r.top - cr.top + r.height / 2 - H / 2);
    sx.jump(x.get()); sy.jump(y.get()); skew.jump(0); sk.jump(0);
  };

  const item = active === null ? null : ITEMS[active];

  return (
    <div className="bg-paper py-[var(--u-section-y)] text-ink">
      <div className="u-wrap">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-ink/15 pb-10">
          <div>
            <Eyebrow className="text-brand-strong" />
            <h2 className="mt-4 max-w-[13ch] text-[length:var(--u-h2)] font-extrabold leading-[.98] tracking-[-0.045em] text-ink">{TITLE}</h2>
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink/60">{pad(ITEMS.length)} servicios</p>
        </div>

        <div ref={box} className="relative" onPointerMove={onMove}
          onPointerLeave={() => { if (source === "pointer") { setActive(null); setSource(null); } last.current = null; }}
          onBlur={(e) => { if (source === "focus" && !e.currentTarget.contains(e.relatedTarget)) { setActive(null); setSource(null); } }}>
          <ul className="flex flex-col">
            {ITEMS.map((s, i) => {
              const on = active === i;
              const dim = follow && active !== null && !on;
              return (
                <li key={s.n} className="border-b border-ink/15">
                  <a href={s.href}
                    onMouseEnter={() => { if (follow) { setActive(i); setSource("pointer"); } }}
                    onFocus={(e) => follow && focusRow(i, e.currentTarget)}
                    className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 py-6 outline-none focus-visible:bg-brand-tint/60 md:grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,19rem)_3rem] md:gap-x-8 md:py-8">
                    <span className="self-start pt-2 font-mono text-xs tabular-nums text-ink/60 md:self-center md:pt-0">{s.n}</span>
                    <span className="flex min-w-0 items-center gap-4">
                      {!follow && (
                        <img src={s.img} alt={s.alt} loading="lazy" decoding="async" className="h-16 w-14 shrink-0 rounded-lg object-cover md:h-24 md:w-20" />
                      )}
                      <span data-t className={cn(
                        "block min-w-0 font-head text-[clamp(1.9rem,6.2vw,6rem)] font-semibold leading-[0.95] tracking-[-0.05em] transition-[transform,color,-webkit-text-stroke-color] duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
                        "group-hover:translate-x-3 group-hover:text-brand-strong group-focus-visible:text-brand-strong",
                        dim ? "text-transparent [-webkit-text-stroke:1.2px_rgba(22,22,31,.45)]" : "text-ink",
                      )}>{s.title}</span>
                    </span>
                    <span data-d className="col-span-3 col-start-1 md:col-span-1 md:col-start-3 md:row-start-1">
                      <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-brand-strong">{s.sub}</span>
                      <span className="mt-1.5 block text-sm leading-snug text-ink/75">{s.text}</span>
                    </span>
                    <span className="col-start-3 row-start-1 flex h-11 w-11 items-center justify-center self-start rounded-full border border-ink/20 transition-all duration-300 group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-white md:col-start-4 md:self-center" aria-hidden>
                      <ArrowUR />
                    </span>
                    <span className="sr-only">Ver servicio</span>
                  </a>
                </li>
              );
            })}
          </ul>

          {follow && (
            <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-visible">
              <motion.div className="absolute left-0 top-0 overflow-hidden rounded-2xl bg-ink shadow-[0_30px_60px_-15px_rgba(22,22,31,.45)]"
                style={{ width: W, height: H, x: sx, y: sy, skewX: sk }}
                initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: item ? 1 : 0, scale: item ? 1 : 0.94 }}
                transition={{ type: "spring", bounce: 0.1, duration: 0.25 }}>
                <AnimatePresence initial={false}>
                  {item && (
                    <motion.div key={item.n} className="absolute inset-0"
                      initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ type: "spring", bounce: 0.1, duration: 0.35 }}>
                      <img src={item.img} alt="" className="absolute inset-0 h-full w-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent p-4 pt-12 text-white">
                        <span className="font-mono text-[11px] uppercase tracking-[0.16em]">{item.n} · {item.sub}</span>
                        <ArrowUR className="h-4 w-4" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
