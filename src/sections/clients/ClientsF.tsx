/**
 * CLIENTES F · Editorial Kinetic — basado en 21st.dev «Logo Marquee» (id 23537).
 * Del original se conserva el hook `useLogoMarquee` casi literal: bucle rAF con física (aceleración/frenada
 * exponencial RAMP 0,19 s, asentamiento SETTLE 0,16 s, `fold` del desplazamiento), número de copias calculado con
 * ResizeObserver (máx. 14), animación solo cuando la pista está cerca del viewport (IntersectionObserver), retención al
 * pasar el ratón, al pulsar o al enfocar (con liberación en `blur` de ventana), «nudge» que desplaza la pista con
 * suavidad para revelar lo enfocado y copias decorativas con `aria-hidden`; degradados laterales de desvanecido.
 * Adaptación: los cinco clientes ficticios con enlaces pasan a ser los 25 clientes reales (sin enlaces: no existen);
 * maquetación editorial con dos pistas de tipografía enorme en sentidos opuestos (maciza y en contorno) con índice
 * entre paréntesis; como las marcas no son enlaces, cada pista es una región enfocable donde ← → usan el mismo
 * «nudge» del original; botón de pausa global. `useReducedMotion` se sustituye por `fullMotion()` del proyecto.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { CLIENTS, Eyebrow, FOOT, FOOT_TEXT, LEAD, TITLE, pad, split, useFull, type Client } from "./shared";

const RAMP = 0.19;
const SETTLE = 0.16;
const MAX_COPIES = 14;
const ROWS = split(CLIENTS, 2);
const IDX = new Map(CLIENTS.map((c, i) => [c.name, i]));

function fold(x: number, loop: number) { const m = x % loop; return m > 0 ? m - loop : m; }
function clamp(x: number, min: number, max: number) { return x < min ? min : x > max ? max : x; }

function useLogoMarquee({ speed = 44, direction = "left", gap = 40, paused = false }: { speed?: number; direction?: "left" | "right"; gap?: number; paused?: boolean }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLUListElement>(null);
  const [copies, setCopies] = useState(4);
  const [held, setHeld] = useState(false);
  const [near, setNear] = useState(false);
  const stopped = held || paused;
  const movingRef = useRef(false);
  movingRef.current = !stopped;
  const offset = useRef(0), nudge = useRef(0), rate = useRef(0), span = useRef(0);

  const paint = useCallback(() => {
    const t = trackRef.current;
    if (t) t.style.transform = `translate3d(${(offset.current - span.current).toFixed(2)}px, 0, 0)`;
  }, []);

  useLayoutEffect(() => {
    const viewport = viewportRef.current, group = groupRef.current;
    if (!viewport || !group) return;
    const measure = () => {
      const width = group.getBoundingClientRect().width;
      const loop = width > 0 ? width + gap : 0;
      const room = viewport.getBoundingClientRect().width;
      span.current = loop;
      offset.current = loop > 0 ? clamp(offset.current, -loop, loop) : 0;
      paint();
      const next = loop <= 0 ? 4 : clamp(Math.ceil(room / loop) + 3, 4, MAX_COPIES);
      setCopies((p) => (p === next ? p : next));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(viewport); ro.observe(group);
    return () => ro.disconnect();
  }, [gap, paint]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const io = new IntersectionObserver((es) => { const e = es[es.length - 1]; if (e) setNear(e.isIntersecting); }, { rootMargin: "96px" });
    io.observe(viewport);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!near) return;
    let frame = 0, last = 0;
    const sign = direction === "right" ? 1 : -1;
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      const loop = span.current;
      if (loop <= 0) return;
      rate.current += ((movingRef.current ? 1 : 0) - rate.current) * (1 - Math.exp(-dt / RAMP));
      const pull = nudge.current * (1 - Math.exp(-dt / SETTLE));
      nudge.current -= pull;
      let x = offset.current + sign * speed * rate.current * dt + pull;
      if (rate.current > 0.002 && Math.abs(nudge.current) < 0.25) { nudge.current = 0; x = fold(x, loop); }
      else x = clamp(x, -loop, loop);
      offset.current = x;
      paint();
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [near, speed, direction, paint]);

  useEffect(() => {
    const release = () => setHeld(false);
    window.addEventListener("blur", release);
    return () => window.removeEventListener("blur", release);
  }, []);

  /** Mismo mecanismo que `reveal` del original: desplazamiento suave acotado a un bucle. */
  const nudgeBy = useCallback((delta: number) => {
    const loop = span.current;
    if (loop <= 0) return;
    const target = clamp(offset.current + nudge.current + delta, -loop, loop);
    nudge.current = target - offset.current;
  }, []);

  const bind = {
    onPointerEnter: (e: PointerEvent) => { if (e.pointerType !== "touch") setHeld(true); },
    onPointerDown: () => setHeld(true),
    onPointerUp: (e: PointerEvent) => { if (e.pointerType === "touch") setHeld(false); },
    onPointerCancel: () => setHeld(false),
    onPointerLeave: () => setHeld(false),
    onFocus: () => setHeld(true),
    onBlur: () => setHeld(false),
  };

  return { viewportRef, trackRef, groupRef, copies, bind, nudgeBy };
}

const FACE = "inline-flex shrink-0 items-start gap-2 whitespace-nowrap font-head text-[clamp(2.6rem,6.6vw,6.2rem)] font-extrabold leading-[1.02] tracking-[-0.05em]";

function Face({ c, hollow }: { c: Client; hollow: boolean }) {
  return (
    <span className={cn(FACE, hollow ? "cl-hollow" : "text-ink")}>
      {c.name}
      <sup className="mt-[0.6em] font-mono text-[11px] font-medium tracking-[0.1em] text-ink/50 [-webkit-text-stroke:0]">({pad((IDX.get(c.name) ?? 0) + 1)})</sup>
    </span>
  );
}

function Track({ list, label, direction, speed, paused, hollow }: { list: Client[]; label: string; direction: "left" | "right"; speed: number; paused: boolean; hollow: boolean }) {
  const gap = 64;
  const { viewportRef, trackRef, groupRef, copies, bind, nudgeBy } = useLogoMarquee({ speed, direction, gap, paused });
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); nudgeBy(e.key === "ArrowLeft" ? 320 : -320); }
  };
  return (
    <div role="region" aria-label={label} tabIndex={0} onKeyDown={onKey} {...bind}
      className="group relative isolate w-full overflow-hidden outline-none focus-visible:bg-brand-tint/60 focus-visible:shadow-[inset_0_0_0_2px_#2E6CA0]">
      <div ref={viewportRef} className="overflow-hidden py-3">
        <div ref={trackRef} style={{ gap, willChange: "transform" }} className="flex w-max items-center">
          {Array.from({ length: copies }, (_, copy) => (
            <ul key={copy} ref={copy === 1 ? groupRef : undefined} aria-hidden={copy === 1 ? undefined : true} style={{ gap }} className="flex w-max items-center">
              {list.map((c) => <li key={c.name} className="shrink-0"><Face c={c} hollow={hollow} /></li>)}
            </ul>
          ))}
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-paper to-paper/0 md:w-24" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-paper to-paper/0 md:w-24" />
    </div>
  );
}

function Head() {
  return (
    <div className="u-wrap"><div className="grid gap-6 border-t border-ink/20 pt-6 lg:grid-cols-12">
      <div className="flex items-start justify-between lg:col-span-4 lg:flex-col lg:justify-start lg:gap-3">
        <Eyebrow className="text-brand-strong" />
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">Índice ({CLIENTS.length})</p>
      </div>
      <div className="lg:col-span-8">
        <h2 className="text-[clamp(2.3rem,5.4vw,4.8rem)] font-extrabold leading-[0.96] tracking-[-0.05em] text-ink">{TITLE}</h2>
        <p className="mt-6 max-w-[54ch] text-[1.05rem] leading-relaxed text-ink/65">{LEAD}</p>
      </div>
    </div></div>
  );
}

function Foot() {
  return (
    <div className="u-wrap mt-10"><div className="grid gap-4 border-t border-ink/20 pt-6 md:grid-cols-12 md:items-end md:gap-6">
      <p className="font-head text-[clamp(2.4rem,4.2vw,4rem)] font-extrabold leading-none tracking-[-0.05em] text-ink md:col-span-7 md:whitespace-nowrap">{FOOT}</p>
      <p className="max-w-[34ch] text-[1rem] leading-relaxed text-ink/65 md:col-span-5 md:justify-self-end md:text-right">{FOOT_TEXT}</p>
    </div></div>
  );
}

function StaticView() {
  return (
    <div className="bg-paper py-[var(--u-section-y)] text-ink">
      <Head />
      <div className="u-wrap mt-12"><ol aria-label="Clientes" className="grid grid-cols-1 gap-x-10 border-t border-ink/20 sm:grid-cols-2 lg:grid-cols-3">
        {CLIENTS.map((c, i) => (
          <li key={c.name} className="flex items-baseline justify-between gap-4 border-b border-ink/10 py-4">
            <span className="font-head text-[clamp(1.3rem,2vw,1.7rem)] font-extrabold tracking-[-0.04em] text-ink">{c.name}</span>
            <span className="font-mono text-[11px] text-ink/50">({pad(i + 1)})</span>
          </li>
        ))}
      </ol></div>
      <Foot />
    </div>
  );
}

function Kinetic() {
  const [paused, setPaused] = useState(false);
  const control = (
    <>
      <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60 lg:inline">Enfoca · ← →</span>
      <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused}
        aria-label={paused ? "Reanudar el desplazamiento de clientes" : "Pausar el desplazamiento de clientes"}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-solid border-ink/30 px-5 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-strong">
        {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
        {paused ? "Reanudar" : "Pausar"}
      </button>
    </>
  );
  return (
    <div className="bg-paper py-[var(--u-section-y)] text-ink">
      <Head />
      <div className="u-wrap mt-10 flex items-center justify-end gap-4 md:mt-14">{control}</div>
      <div className="mt-6 border-y border-ink/20">
        <Track list={ROWS[0]} label="Clientes, primera fila" direction="left" speed={46} paused={paused} hollow={false} />
        <div className="h-px bg-ink/15" aria-hidden />
        <Track list={ROWS[1]} label="Clientes, segunda fila" direction="right" speed={38} paused={paused} hollow />
      </div>
      <Foot />
    </div>
  );
}

export default function ClientsF() {
  return useFull() ? <Kinetic /> : <StaticView />;
}
