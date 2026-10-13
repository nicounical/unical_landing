/**
 * CLIENTES E · High-Energy Motion — basado en 21st.dev «Blurred Marquee» (id 20147).
 * Del original se conserva: `InfiniteSlider` (contenido duplicado, traslación lineal de medio recorrido en bucle,
 * sentido `reverse`, cambio de velocidad con transición suave en vez de salto), `ProgressiveBlur` (capas apiladas
 * con `backdrop-filter` creciente y máscaras en degradado) en ambos bordes, banda con fondo en degradado lateral,
 * líneas superior e inferior a todo el ancho de pantalla y cruces «+» en las esquinas opuestas.
 * Adaptación: logotipos SVG de ejemplo → 25 clientes reales en marca tipográfica grande con favicon real; dos pistas
 * en sentidos opuestos; react-use-measure sustituido por ResizeObserver y la animación por `useAnimationFrame` de
 * motion con una tasa que se interpola (mismo efecto de transición de velocidad); el original aceleraba al pasar el
 * ratón: aquí, por accesibilidad, la banda frena hasta detenerse al señalarla o enfocarla, y hay botón de pausa.
 * Energía extra: la velocidad del scroll de la página empuja las pistas.
 */
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity, type MotionValue } from "motion/react";
import { Pause, Play, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClientMark } from "./ClientMark";
import { CLIENTS, Eyebrow, FOOT, FOOT_TEXT, LEAD, TITLE, split, useFull, type Client } from "./shared";

const ROWS = split(CLIENTS, 2);
const MARK = { fontSize: "clamp(1.55rem, 3.4vw, 3rem)", gap: ".7rem" };

const GRADIENT_ANGLES = { top: 0, right: 90, bottom: 180, left: 270 };
function ProgressiveBlur({ direction, blurLayers = 8, blurIntensity = 1, className }: { direction: keyof typeof GRADIENT_ANGLES; blurLayers?: number; blurIntensity?: number; className?: string }) {
  const layers = Math.max(blurLayers, 2);
  const seg = 1 / (blurLayers + 1);
  const angle = GRADIENT_ANGLES[direction];
  return (
    <div className={cn("relative", className)} aria-hidden>
      {Array.from({ length: layers }).map((_, index) => {
        const stops = [index * seg, (index + 1) * seg, (index + 2) * seg, (index + 3) * seg]
          .map((pos, k) => `rgba(255,255,255,${k === 1 || k === 2 ? 1 : 0}) ${pos * 100}%`).join(", ");
        const g = `linear-gradient(${angle}deg, ${stops})`;
        return <div key={index} className="pointer-events-none absolute inset-0" style={{ maskImage: g, WebkitMaskImage: g, backdropFilter: `blur(${index * blurIntensity}px)`, WebkitBackdropFilter: `blur(${index * blurIntensity}px)` }} />;
      })}
    </div>
  );
}

function InfiniteSlider({ children, gap = 56, speed = 60, reverse = false, running, boost }: { children: ReactNode; gap?: number; speed?: number; reverse?: boolean; running: boolean; boost: MotionValue<number> }) {
  const track = useRef<HTMLDivElement>(null);
  const loop = useRef(0);
  const off = useRef(0);
  const rate = useRef(1);
  const x = useMotionValue(0);

  useLayoutEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => { loop.current = (el.scrollWidth + gap) / 2; };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [gap]);

  useAnimationFrame((_, delta) => {
    const L = loop.current;
    if (L <= 0) return;
    const dt = Math.min(delta / 1000, 0.05);
    rate.current += ((running ? 1 : 0) - rate.current) * (1 - Math.exp(-dt / 0.35));
    const v = speed * rate.current * (1 + (running ? boost.get() : 0));
    off.current = (off.current + v * dt) % L;
    x.set(reverse ? off.current - L : -off.current);
  });

  return (
    <div className="overflow-hidden">
      <motion.div ref={track} className="flex w-max items-center" style={{ x, gap }}>
        <div className="flex items-center" style={{ gap }}>{children}</div>
        <div className="flex items-center" style={{ gap }} aria-hidden>{children}</div>
      </motion.div>
    </div>
  );
}

const Sep = () => <span className="h-2.5 w-2.5 shrink-0 rotate-45 bg-brand" aria-hidden />;

function Row({ list, tone }: { list: Client[]; tone: "solid" | "brand" }) {
  return (
    <>
      {list.map((c) => (
        <span key={c.name} className="flex items-center gap-14">
          <ClientMark c={c} className={cn("cl-chip", tone === "solid" ? "text-white" : "text-brand")} style={MARK} />
          <Sep />
        </span>
      ))}
    </>
  );
}

function Header({ action }: { action?: ReactNode }) {
  return (
    <div className="u-wrap grid gap-8 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-8">
        <Eyebrow className="text-brand" />
        <h2 className="mt-5 text-[clamp(2.4rem,6vw,5.4rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.05em] text-white">{TITLE}</h2>
      </div>
      <div className="flex flex-col gap-6 lg:col-span-4 lg:items-end">
        <p className="max-w-[40ch] text-[1.02rem] leading-relaxed text-white/65 lg:text-right">{LEAD}</p>
        {action}
      </div>
    </div>
  );
}

function Foot() {
  return (
    <div className="u-wrap mt-14 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-6">
      <p className="font-head text-[clamp(2.6rem,7vw,6rem)] font-extrabold leading-[0.9] sm:whitespace-nowrap tracking-[-0.06em] text-white">{FOOT}</p>
      <p className="max-w-[30ch] text-[1.02rem] leading-relaxed text-white/65">{FOOT_TEXT}</p>
    </div>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden bg-ink py-[var(--u-section-y)] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_100%,rgba(46,108,160,.28),transparent_70%)]" aria-hidden />
      <div className="relative">{children}</div>
    </div>
  );
}

function StaticView() {
  return (
    <Shell>
      <Header />
      <ul aria-label="Clientes" className="u-wrap mt-14 flex flex-wrap gap-x-10 gap-y-5 border-y border-white/15 py-10">
        {CLIENTS.map((c, i) => (
          <li key={c.name}><ClientMark c={c} className={cn("cl-chip", i % 2 ? "text-brand" : "text-white")} style={{ fontSize: "clamp(1.2rem,2.2vw,1.9rem)" }} /></li>
        ))}
      </ul>
      <Foot />
    </Shell>
  );
}

function Marquee() {
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const running = !paused && !held;
  const { scrollY } = useScroll();
  const vel = useVelocity(scrollY);
  const boostRaw = useTransform(vel, (v) => Math.min(Math.abs(v) / 400, 5));
  const boost = useSpring(boostRaw, { stiffness: 80, damping: 30 });

  const action = (
    <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused}
      aria-label={paused ? "Reanudar el desplazamiento de clientes" : "Pausar el desplazamiento de clientes"}
      className="inline-flex h-11 items-center gap-2 self-start rounded-full bg-brand lg:self-end px-5 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
      {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
      {paused ? "Reanudar" : "Pausar"}
    </button>
  );

  return (
    <Shell>
      <Header action={action} />
      <div className="relative mx-auto mt-14 max-w-6xl bg-gradient-to-r from-white/[0.06] via-transparent to-white/[0.06] md:border-x md:border-white/15"
        role="region" aria-label="Clientes de Unical"
        onPointerEnter={(e) => { if (e.pointerType === "mouse") setHeld(true); }} onPointerLeave={() => setHeld(false)}>
        <div className="pointer-events-none absolute -top-px left-1/2 w-screen -translate-x-1/2 border-t border-white/15" aria-hidden />
        <ul className="sr-only">{CLIENTS.map((c) => <li key={c.name}>{c.name}</li>)}</ul>
        <div className="flex flex-col gap-5 py-8 md:gap-7 md:py-10" aria-hidden>
          <InfiniteSlider reverse speed={70} running={running} boost={boost}><Row list={ROWS[0]} tone="solid" /></InfiniteSlider>
          <InfiniteSlider speed={55} running={running} boost={boost}><Row list={ROWS[1]} tone="brand" /></InfiniteSlider>
        </div>
        <ProgressiveBlur direction="left" className="pointer-events-none absolute left-0 top-0 h-full w-16 md:w-40" />
        <ProgressiveBlur direction="right" className="pointer-events-none absolute right-0 top-0 h-full w-16 md:w-40" />
        <div className="pointer-events-none absolute -bottom-px left-1/2 w-screen -translate-x-1/2 border-b border-white/15" aria-hidden />
        <Plus className="absolute -right-[12.5px] -top-[12.5px] z-10 hidden size-6 text-white/70 md:block" strokeWidth={1} aria-hidden />
        <Plus className="absolute -bottom-[12.5px] -left-[12.5px] z-10 hidden size-6 text-white/70 md:block" strokeWidth={1} aria-hidden />
      </div>
      <Foot />
    </Shell>
  );
}

export default function ClientsE() {
  return useFull() ? <Marquee /> : <StaticView />;
}
