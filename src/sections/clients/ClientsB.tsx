/**
 * CLIENTES B · Immersive 3D — basado en 21st.dev «Logo Cloud» (id 24570).
 * Del original se conserva: contenedor redondeado con trama de circuito discontinua (SVG pattern), haz de luz global
 * que sigue al cursor por todo el panel, rejilla de celdas separadas por líneas y, por celda, el foco radial de
 * 160 px que sigue al ratón, la inclinación 3D (rotateX/rotateY ±7° + translateZ 16 px, perspective 800 px), la
 * etiqueta superior que se enciende, la inferior que sube al pasar el cursor, la cruz del vértice que gira 90° y el
 * barrido de luz que cruza la celda.
 * Adaptación: los seis logotipos SVG remotos (NVIDIA, Supabase…) pasan a ser los 25 clientes reales de site.ts como
 * marca tipográfica con su favicon real; insignias técnicas inventadas sustituidas por el índice «07 / 25» y la
 * etiqueta neutra «Cliente Unical»; colores por marca sustituidos por el azul de marca sobre fondo navy. Profundidad
 * extra: el panel entra tumbado en perspectiva y se endereza con el scroll normal de la página (sin pin). Solo ratón
 * activa la inclinación; en táctil la rejilla queda legible y estática.
 */
import { useRef, useState, type MouseEvent } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { Plus } from "lucide-react";
import { finePointer } from "@/core/env";
import { cn } from "@/lib/utils";
import { ClientMark } from "./ClientMark";
import { CLIENTS, Eyebrow, FOOT, FOOT_TEXT, LEAD, TITLE, pad, useFull, type Client } from "./shared";

const GLOW = "rgba(153,196,228,.22)";
const ACCENT = "#99C4E4";
const CELL = "relative flex h-24 flex-col items-center justify-between bg-navy p-3 select-none sm:h-32 sm:p-4 lg:h-40 max-lg:last:col-span-2";

function Head() {
  return (
    <div className="grid items-end gap-8 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <Eyebrow className="text-brand" />
        <h2 className="mt-5 text-[clamp(2.2rem,5vw,4.2rem)] font-extrabold leading-[0.98] tracking-[-0.045em] text-white">{TITLE}</h2>
      </div>
      <div className="lg:col-span-5">
        <p className="max-w-[46ch] text-[1.02rem] leading-relaxed text-white/60">{LEAD}</p>
        <p className="mt-4 text-sm text-white/45"><strong className="font-head font-bold text-white">{FOOT}</strong> {FOOT_TEXT}</p>
      </div>
    </div>
  );
}

function Pattern() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-30" aria-hidden>
      <defs>
        <pattern id="cl-b-circuit" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#99C4E4" strokeWidth="0.75" strokeDasharray="2 4" opacity=".45" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#cl-b-circuit)" />
    </svg>
  );
}

function Card({ c, i, tilt }: { c: Client; i: number; tilt: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [rot, setRot] = useState({ rx: 0, ry: 0 });
  const [on, setOn] = useState(false);

  const move = (e: MouseEvent<HTMLLIElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = e.clientX - r.left, y = e.clientY - r.top;
    setPos({ x, y });
    setRot({ rx: ((y - r.height / 2) / (r.height / 2)) * -7, ry: ((x - r.width / 2) / (r.width / 2)) * 7 });
  };

  return (
    <li ref={ref} className={cn(CELL, "group")} style={{ perspective: "800px" }}
      onMouseEnter={tilt ? () => setOn(true) : undefined}
      onMouseLeave={tilt ? () => { setOn(false); setRot({ rx: 0, ry: 0 }); } : undefined}
      onMouseMove={tilt ? move : undefined}>
      {/* Foco del cursor */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(160px circle at ${pos.x}px ${pos.y}px, ${GLOW}, transparent 80%)` }} aria-hidden />
      {/* Cruz del vértice */}
      <div className="pointer-events-none absolute -bottom-[9px] -right-[9px] z-30 hidden items-center justify-center lg:flex" aria-hidden>
        <Plus className={cn("size-4 text-white/20 transition-all duration-500 ease-out", on && "rotate-90 scale-125 text-brand")} strokeWidth={2} />
      </div>
      {/* Índice */}
      <div className="z-10 flex w-full items-center justify-between">
        <span className={cn("font-mono text-[9px] font-medium tracking-widest text-white/45 transition-colors duration-300", on && "text-brand")}>
          {pad(i + 1)} / {CLIENTS.length}
        </span>
      </div>
      {/* Marca en 3D */}
      <div className="pointer-events-none relative z-10 my-auto flex items-center justify-center"
        style={{
          transform: on ? `rotateX(${rot.rx}deg) rotateY(${rot.ry}deg) translateZ(16px)` : "rotateX(0deg) rotateY(0deg) translateZ(0px)",
          transition: on ? "transform .1s ease-out" : "transform .5s ease-out",
        }}>
        <ClientMark c={c} className={cn("cl-chip text-white/70 transition-all duration-300 group-hover:scale-110 group-hover:text-white")}
          style={{ fontSize: "clamp(.88rem, 1.2vw, 1.12rem)" }} />
      </div>
      {/* Etiqueta inferior */}
      <div className="z-10 hidden w-full items-center justify-start overflow-hidden sm:flex" aria-hidden>
        <span className={cn("font-mono text-[10px] tracking-tight transition-all duration-300 ease-out", on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0")} style={{ color: ACCENT }}>
          Cliente Unical
        </span>
      </div>
      {/* Barrido de luz */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.07] to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-full" aria-hidden />
    </li>
  );
}

function Panel({ tilt, beam }: { tilt: boolean; beam: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [b, setB] = useState({ x: 0, y: 0, o: 0 });
  return (
    <div ref={ref}
      onMouseMove={beam ? (e) => { const r = ref.current!.getBoundingClientRect(); setB({ x: e.clientX - r.left, y: e.clientY - r.top, o: 1 }); } : undefined}
      onMouseLeave={beam ? () => setB((p) => ({ ...p, o: 0 })) : undefined}
      className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] via-transparent to-white/[0.02] p-2 shadow-[0_40px_120px_-40px_rgba(0,0,0,.8)]">
      <Pattern />
      <div className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-700 ease-out"
        style={{ opacity: b.o, background: `radial-gradient(500px circle at ${b.x}px ${b.y}px, rgba(153,196,228,.10), transparent 75%)` }} aria-hidden />
      <ul aria-label="Clientes" className="relative grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-white/10 bg-white/10 lg:grid-cols-5">
        {CLIENTS.map((c, i) => <Card key={c.name} c={c} i={i} tilt={tilt} />)}
      </ul>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden bg-navy py-[var(--u-section-y)] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(46,108,160,.30),transparent_60%)]" aria-hidden />
      <div className="u-wrap relative">{children}</div>
    </div>
  );
}

function Immersive() {
  const stage = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start end", "start 25%"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const rotateX = useTransform(p, [0, 1], [26, 0]);
  const scale = useTransform(p, [0, 1], [0.9, 1]);
  const y = useTransform(p, [0, 1], [60, 0]);

  const fine = finePointer();
  return (
    <Shell>
      <Head />
      <div ref={stage} className="mt-14" style={{ perspective: "1400px" }}>
        <motion.div style={{ rotateX, scale, y, transformOrigin: "50% 100%" }}>
          <Panel tilt={fine} beam={fine} />
        </motion.div>
      </div>
    </Shell>
  );
}

export default function ClientsB() {
  const full = useFull();
  if (!full) return <Shell><Head /><div className="mt-14"><Panel tilt={false} beam={false} /></div></Shell>;
  return <Immersive />;
}
