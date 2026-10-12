/**
 * CIFRAS B · Immersive 3D — basado en 21st.dev «Neomorphism Metric Card» (id 24338).
 * Del original se conserva: tarjeta neomórfica sobre fondo #e0e5ec con doble sombra exterior (oscura abajo-derecha,
 * blanca arriba-izquierda), título en mayúsculas atenuado, cifra grande, icono lucide en círculo hundido (sombra
 * inset) y una píldora hundida en la base; hover con muelle (stiffness 300, damping 20) y escala 1.02.
 * Adaptación: añade inclinación 3D con el puntero (rotateX/rotateY con muelle, perspectiva, capas en translateZ y
 * brillo que sigue al cursor); en táctil, al pulsar la tarjeta se «hunde» (sombra inset) como alternativa. Se
 * eliminan la tendencia ± % y «vs last month» (no hay datos de evolución): la píldora hundida muestra solo el orden
 * de la cifra. Cifras reales de site.ts que cuentan al entrar; los lectores de pantalla leen el valor final.
 */
import { useRef, useState, type ComponentType } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { BadgeCheck, FolderCheck, Hourglass, Layers, type LucideProps } from "lucide-react";
import { finePointer } from "@/core/env";
import { cn } from "@/lib/utils";
import { Eyebrow, ITEMS, LEAD, NumTitle, SrValue, group, pad, useCountUp, useFull, useInViewOnce, type NumItem } from "./shared";

const ICONS: ComponentType<LucideProps>[] = [Hourglass, FolderCheck, Layers, BadgeCheck];
const OUT = "shadow-[12px_12px_24px_rgba(163,177,198,0.65),-12px_-12px_24px_rgba(255,255,255,0.9)]";
const IN_SM = "shadow-[inset_3px_3px_6px_0_rgba(163,177,198,0.7),inset_-3px_-3px_6px_0_rgba(255,255,255,0.85)]";
const IN_LG = "shadow-[inset_8px_8px_16px_rgba(163,177,198,0.6),inset_-8px_-8px_16px_rgba(255,255,255,0.85)]";

function Value({ it, run, i }: { it: NumItem; run: boolean; i: number }) {
  const v = useCountUp(it.value ?? 0, run, 2, i * 0.12);
  if (it.text) return <span aria-hidden>{it.text}</span>;
  return <span aria-hidden className="tabular-nums"><span className="text-brand-strong">{it.prefix}</span>{group(v)}</span>;
}

function Card({ it, i, run, full }: { it: NumItem; i: number; run: boolean; full: boolean }) {
  const Icon = ICONS[i] ?? BadgeCheck;
  const tilt = full && finePointer();
  const [pressed, setPressed] = useState(false);
  const mx = useMotionValue(0.5), my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 300, damping: 20 }), sy = useSpring(my, { stiffness: 300, damping: 20 });
  const rotateY = useTransform(sx, [0, 1], [-12, 12]);
  const rotateX = useTransform(sy, [0, 1], [10, -10]);
  const gx = useTransform(sx, (v) => `${v * 100}%`), gy = useTransform(sy, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,.55), transparent 55%)`;

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!tilt || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const reset = () => { mx.set(0.5); my.set(0.5); setPressed(false); };

  return (
    <div className="[perspective:1100px]">
      <motion.div
        onPointerMove={move}
        onPointerLeave={reset}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerCancel={() => setPressed(false)}
        whileHover={full ? { scale: 1.02 } : undefined}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={tilt ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        initial={full ? { opacity: 0, y: 40 } : false}
        animate={run ? { opacity: 1, y: 0 } : undefined}
        className={cn("relative flex h-full flex-col gap-8 rounded-[28px] bg-[#e0e5ec] p-7 outline-none transition-shadow duration-300 md:p-8",
          pressed ? IN_LG : OUT)}
      >
        {tilt && <motion.span aria-hidden className="pointer-events-none absolute inset-0 rounded-[28px] mix-blend-soft-light" style={{ background: glare }} />}
        <div className="flex items-start justify-between gap-4" style={tilt ? { transform: "translateZ(40px)" } : undefined}>
          <p className="max-w-[14ch] text-[12px] font-semibold uppercase leading-snug tracking-[0.14em] text-[#4a5568]/70">{it.label}</p>
          <span className={cn("grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#e0e5ec] text-brand-strong", IN_SM)} aria-hidden>
            <Icon size={22} strokeWidth={1.8} />
          </span>
        </div>
        <p className={cn("font-head font-bold leading-none tracking-[-0.04em] text-[#2d3748]", it.text ? "text-[clamp(1.9rem,2.6vw,2.4rem)]" : "text-[clamp(2.8rem,4.4vw,3.9rem)]")}
          style={tilt ? { transform: "translateZ(70px)" } : undefined}>
          <SrValue it={it} />
          <Value it={it} run={run} i={i} />
        </p>
        <div className="mt-auto flex items-center gap-3" style={tilt ? { transform: "translateZ(30px)" } : undefined} aria-hidden>
          <span className={cn("rounded-full px-3 py-1.5 font-mono text-[12px] font-semibold tabular-nums text-[#4a5568]/80", IN_SM)}>
            {pad(i + 1)} <span className="text-[#4a5568]/40">/ {pad(ITEMS.length)}</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default function NumbersB() {
  const full = useFull();
  const grid = useRef<HTMLDivElement>(null);
  const run = useInViewOnce(grid, 0.25);

  return (
    <div className="overflow-hidden bg-[#e0e5ec] py-[var(--u-section-y)] text-[#4a5568]">
      <div className="u-wrap">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow className="text-brand-strong" />
            <NumTitle className="mt-5 max-w-[17ch] text-[clamp(2.1rem,4.6vw,4rem)] font-extrabold leading-[1] tracking-[-0.045em] text-[#2d3748]" />
          </div>
          <p className="max-w-[44ch] text-[1.02rem] leading-relaxed text-[#4a5568] lg:col-span-5 lg:justify-self-end">{LEAD}</p>
        </div>
        <div ref={grid} className="mt-14 grid gap-7 sm:grid-cols-2 md:mt-20 lg:grid-cols-4 lg:gap-8">
          {ITEMS.map((it, i) => <Card key={it.label} it={it} i={i} run={run} full={full} />)}
        </div>
      </div>
    </div>
  );
}
