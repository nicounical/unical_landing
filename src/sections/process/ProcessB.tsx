/**
 * PROCESO B · Immersive 3D — basado en 21st.dev «Hero Section» / Animated Roadmap (id 8113, ravikatiyar162).
 * Del original se conserva: hoja de ruta con hitos colocados sobre un trazo SVG «M 50 350 Q 200 50 400 200 T 750 100»
 * (viewBox 800 × 400, preserveAspectRatio none) que se dibuja con `pathLength` ligado a `useScroll`, fondo de «mapa»
 * que entra con fade + y, marcadores con punto de estado (complete / in-progress con pulso / pending) + píldora con
 * el nombre, y aparición escalonada de cada marcador (opacity/scale con delay por id).
 * Adaptación: el mapa se convierte en un suelo 3D (perspectiva + rotateX/rotateZ ligados al scroll, rejilla de marca
 * y leve inclinación con el puntero) y cada hito es una «valla» que se mantiene en pie sobre el suelo (contrarrotación
 * en billboard) con la foto real de la fase. Las posiciones se calculan sobre el propio trazo (getPointAtLength) y el
 * estado de cada hito depende de hasta dónde se ha dibujado el camino. Debajo, el detalle de las 4 fases reales.
 * Imagen remota del mapa eliminada (rejilla CSS). Estático: escena fija, trazo completo, todos los hitos completos.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { Check } from "lucide-react";
import { finePointer } from "@/core/env";
import { cn } from "@/lib/utils";
import { CtaLink, Eyebrow, LEAD, N, PHASES, TITLE, useFull } from "./shared";

const D = "M 50 350 Q 200 50 400 200 T 750 100";
/** Fracción del camino donde se sitúa cada hito. */
const AT = [0.05, 0.36, 0.64, 0.93];
/** Posiciones aproximadas (se recalculan sobre el trazo real al montar). */
const GUESS = [{ x: 8, y: 80 }, { x: 33, y: 42 }, { x: 64, y: 58 }, { x: 92, y: 28 }];

type Status = "complete" | "in-progress" | "pending";

function Marker({ i, pos, status, full, counter }: {
  i: number; pos: { x: number; y: number }; status: Status; full: boolean; counter: ReturnType<typeof useMotionTemplate> | string;
}) {
  const p = PHASES[i];
  return (
    <div className="absolute" style={{ left: `${pos.x}%`, top: `${pos.y}%`, transformStyle: "preserve-3d" }}>
      {/* sombra en el suelo */}
      <div className={cn("absolute -left-6 -top-6 h-12 w-12 rounded-full transition-colors duration-500", status === "pending" ? "bg-white/5" : "bg-brand/25")} aria-hidden />
      <div className="absolute bottom-0 left-0 -translate-x-1/2" style={{ transformStyle: "preserve-3d" }}>
      <motion.div className="flex flex-col items-center" style={{ transform: counter, transformOrigin: "50% 100%", transformStyle: "preserve-3d" }}>
        <motion.div
          className="flex flex-col items-center"
          initial={full ? { opacity: 0, scale: 0.5, y: 30 } : false}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.2 + i * 0.25, ease: "easeOut" }}
        >
          <div className={cn("hidden w-[clamp(120px,13vw,170px)] overflow-hidden rounded-xl border bg-night p-1 shadow-[0_25px_50px_-15px_rgba(0,0,0,.8)] transition-all duration-700 md:block",
            status === "pending" ? "border-white/10 opacity-50 grayscale" : "border-brand/50 opacity-100")}>
            <img src={p.img} alt={p.alt} loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-lg object-cover" />
          </div>
          <div className={cn("mt-2 flex items-center gap-2 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-xs font-semibold shadow-lg transition-colors duration-500 md:px-3.5 md:text-sm",
            status === "pending" ? "border-white/15 bg-night/80 text-white/60" : "border-brand/60 bg-white text-ink")}>
            <span className="font-mono tabular-nums">{p.n}</span>
            <span className="hidden sm:inline">{p.title}</span>
          </div>
          {/* mástil */}
          <span className={cn("h-8 w-px md:h-12", status === "pending" ? "bg-white/20" : "bg-brand")} aria-hidden />
          <span className="relative flex h-8 w-8 items-center justify-center" aria-hidden>
            <span className={cn("absolute h-3.5 w-3.5 rounded-full border-2 transition-colors duration-500",
              status === "complete" && "border-brand-strong bg-brand",
              status === "in-progress" && "animate-pulse border-white bg-brand-strong",
              status === "pending" && "border-white/30 bg-night")} />
            <span className="absolute h-full w-full rounded-full bg-brand/10" />
          </span>
        </motion.div>
      </motion.div>
      </div>
    </div>
  );
}

function Details({ reached }: { reached: number }) {
  return (
    <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
      {PHASES.map((p, i) => {
        const on = i < reached;
        const Ico = p.icon;
        return (
          <li key={p.n} className={cn("bg-navy/95 p-6 transition-opacity duration-700 lg:p-7", on ? "opacity-100" : "opacity-45")}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs tracking-[0.2em] text-brand">{p.n}</span>
              <span className={cn("grid h-9 w-9 place-items-center rounded-full border transition-colors duration-500", on ? "border-brand bg-brand text-ink" : "border-white/20 text-white/60")} aria-hidden>
                {on ? <Check className="h-4 w-4" strokeWidth={3} /> : <Ico className="h-4 w-4" />}
              </span>
            </div>
            <h3 className="mt-5 text-[1.45rem] font-bold leading-none tracking-[-0.03em] text-white">{p.title}</h3>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-white/70">{p.text}</p>
            <p className="mt-4 text-[12px] uppercase tracking-[0.14em] text-white/45">{p.tags.join(" · ")}</p>
          </li>
        );
      })}
    </ol>
  );
}

export default function ProcessB() {
  const full = useFull();
  const stage = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [pos, setPos] = useState(GUESS);
  const [drawn, setDrawn] = useState(full ? 0 : 1);

  const { scrollYProgress } = useScroll({ target: stage, offset: ["start 85%", "end 70%"] });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const tilt = useTransform(scrollYProgress, [0, 1], [64, 50]);
  const spin = useTransform(scrollYProgress, [0, 1], [-14, -6]);
  const plane = useMotionTemplate`rotateX(${tilt}deg) rotateZ(${spin}deg)`;
  const nt = useTransform(tilt, (v) => -v);
  const ns = useTransform(spin, (v) => -v);
  const counter = useMotionTemplate`rotateZ(${ns}deg) rotateX(${nt}deg)`;

  // inclinación suave con el puntero (solo puntero fino)
  const px = useSpring(0, { stiffness: 60, damping: 18 });
  const py = useSpring(0, { stiffness: 60, damping: 18 });
  const scene = useMotionTemplate`rotateY(${px}deg) rotateX(${py}deg)`;

  useMotionValueEvent(pathLength, "change", (v) => setDrawn(v));

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const len = el.getTotalLength();
    setPos(AT.map((t) => { const pt = el.getPointAtLength(len * t); return { x: (pt.x / 800) * 100, y: (pt.y / 400) * 100 }; }));
  }, []);

  useEffect(() => {
    const el = stage.current;
    if (!full || !el || !finePointer()) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      px.set(((e.clientX - r.left) / r.width - 0.5) * 10);
      py.set(-((e.clientY - r.top) / r.height - 0.5) * 6);
    };
    const leave = () => { px.set(0); py.set(0); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, [full, px, py]);

  const done = !full || drawn >= 0.97;
  const reachedCount = done ? N : AT.filter((t) => drawn >= t).length;
  const statusOf = (i: number): Status => (done || i < reachedCount - 1 ? "complete" : i === reachedCount - 1 ? "in-progress" : "pending");

  return (
    <div className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#11111f_0%,#1A1A2E_45%,#1E5076_130%)] py-[var(--u-section-y)] text-white">
      <div className="u-wrap relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center text-brand" />
          <h2 className="mt-4 text-[length:var(--u-h2)] font-extrabold leading-[.98] tracking-[-0.045em] text-white">{TITLE}</h2>
          <p className="mx-auto mt-5 max-w-[54ch] text-[1.02rem] leading-relaxed text-white/70">{LEAD}</p>
        </div>

        {/* Escenario 3D */}
        <div ref={stage} className="relative mx-auto mt-6 h-[clamp(320px,52vw,600px)] w-full max-w-6xl md:mt-2" style={{ perspective: "1300px" }} aria-hidden>
          <motion.div className="absolute inset-0" style={{ transform: full ? scene : undefined, transformStyle: "preserve-3d" }}>
            <motion.div
              className="absolute inset-x-[2%] top-[14%] h-[86%]"
              style={{ transform: full ? plane : "rotateX(52deg) rotateZ(-7deg)", transformStyle: "preserve-3d" }}
              initial={full ? { opacity: 0, y: 50 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* suelo: rejilla de marca */}
              <div className="absolute -inset-[12%] rounded-[40px]"
                style={{
                  backgroundImage: "linear-gradient(rgba(153,196,228,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(153,196,228,.16) 1px, transparent 1px)",
                  backgroundSize: "48px 48px",
                  maskImage: "radial-gradient(ellipse at center, #000 35%, transparent 72%)",
                  WebkitMaskImage: "radial-gradient(ellipse at center, #000 35%, transparent 72%)",
                }} />
              <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(46,108,160,.35),transparent_65%)]" />
              <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="none" className="absolute inset-0 overflow-visible">
                <path ref={pathRef} d={D} fill="none" stroke="rgba(255,255,255,.22)" strokeWidth={3} strokeDasharray="10 5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                <motion.path d={D} fill="none" stroke="#99C4E4" strokeWidth={4} strokeLinecap="round" vectorEffect="non-scaling-stroke"
                  style={{ pathLength: full ? pathLength : 1, filter: "drop-shadow(0 0 8px rgba(153,196,228,.8))" }} />
              </svg>
              {PHASES.map((p, i) => (
                <Marker key={p.n} i={i} pos={pos[i]} status={statusOf(i)} full={full} counter={full ? counter : "rotateZ(7deg) rotateX(-52deg)"} />
              ))}
            </motion.div>
          </motion.div>
        </div>

        <Details reached={reachedCount} />
        <div className="mt-8 flex justify-center">
          <CtaLink className="text-brand hover:text-white" />
        </div>
      </div>
    </div>
  );
}
