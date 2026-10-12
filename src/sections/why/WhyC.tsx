/**
 * POR QUÉ C · Experimental Creative — basado en 21st.dev «Dual Wipe Reveal» (id 28388, soralabs).
 * Del original se conserva: dos cortinas de color superpuestas (acento debajo, cubierta encima) que se encogen con
 * scaleX/scaleY hacia el origen opuesto a la dirección (DIRECTION_MAP left/right/up/down), la de acento con un
 * desfase `stagger` de 0.1 s, curva power3.inOut [0.65, 0, 0.35, 1], disparo con useInView (margin −18 %) una vez.
 * Adaptación: componente portado localmente (sin whitespace-nowrap para que los títulos largos puedan partirse en
 * móvil); cortinas en azul de marca y blanco sobre navy. Cada pilar es una fila experimental: numeral hueco
 * gigante, título enorme revelado por las cortinas, foto real revelada en vertical y ligeramente girada, con la
 * dirección alternándose fila a fila. Sin movimiento completo: todo visible sin cortinas.
 */
import { useRef, type ElementType, type ReactNode } from "react";
import { motion, useInView } from "motion/react";
import { Btn, Icon } from "@/core/ui";
import { cn } from "@/lib/utils";
import { ALT, CTA, Eyebrow, PILLARS, TEXT, Tags, useFull } from "./shared";
import { why } from "@/content/site";

type Dir = "left" | "right" | "up" | "down";
const DIRECTION_MAP = {
  left: { axis: "scaleX", originClass: "origin-right" },
  right: { axis: "scaleX", originClass: "origin-left" },
  down: { axis: "scaleY", originClass: "origin-bottom" },
  up: { axis: "scaleY", originClass: "origin-top" },
} as const;
const EASE_POWER3_IN_OUT = [0.65, 0, 0.35, 1] as const;

function DualWipeReveal({
  as: Tag = "span", children, className, delay = 0, direction = "left", duration = 0.7, stagger = 0.1,
  accentColor = "#99C4E4", wipeColor = "#FFFFFF", inViewMargin = "0px 0px -18% 0px", full,
}: {
  as?: ElementType; children: ReactNode; className?: string; delay?: number; direction?: Dir; duration?: number;
  stagger?: number; accentColor?: string; wipeColor?: string; inViewMargin?: string; full: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: inViewMargin as never });
  if (!full) return <Tag className={cn("block", className)}>{children}</Tag>;
  const { axis, originClass } = DIRECTION_MAP[direction];
  const s = inView ? 0 : 1;
  const init = axis === "scaleX" ? { scaleX: 1 } : { scaleY: 1 };
  const target = axis === "scaleX" ? { scaleX: s } : { scaleY: s };
  return (
    <Tag ref={ref} className={cn("relative block overflow-hidden", className)}>
      {children}
      <motion.span aria-hidden className={cn("pointer-events-none absolute -inset-[0.1em] z-10 block will-change-transform", originClass)}
        style={{ backgroundColor: accentColor }} initial={init} animate={target}
        transition={{ duration, delay: delay + stagger, ease: EASE_POWER3_IN_OUT }} />
      <motion.span aria-hidden className={cn("pointer-events-none absolute -inset-[0.1em] z-20 block will-change-transform", originClass)}
        style={{ backgroundColor: wipeColor }} initial={init} animate={target}
        transition={{ duration, delay, ease: EASE_POWER3_IN_OUT }} />
    </Tag>
  );
}

const Fade = ({ children, className, delay = 0, full }: { children: ReactNode; className?: string; delay?: number; full: boolean }) => (
  <motion.div className={className} initial={full ? { opacity: 0, y: 16 } : false} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "0px 0px -18% 0px" }} transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}>
    {children}
  </motion.div>
);

export default function WhyC() {
  const full = useFull();
  return (
    <div className="relative overflow-hidden bg-navy py-[var(--u-section-y)] text-white">
      <div className="u-wrap">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-6">
          <Eyebrow className="text-brand" />
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">04 pilares</p>
        </div>

        <h2 className="mt-10 text-[clamp(2.3rem,7vw,6.6rem)] font-extrabold leading-[0.95] tracking-[-0.055em] text-white">
          <DualWipeReveal full={full} className="w-fit pb-[0.06em]">{why.titleA}<span className="italic text-brand">{why.titleEm}</span></DualWipeReveal>
          <DualWipeReveal full={full} delay={0.18} direction="right" accentColor="#2E6CA0" className="ml-auto mt-1 w-fit pb-[0.06em] text-right">
            {why.titleB.trim()}
          </DualWipeReveal>
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-12">
          <Fade full={full} delay={0.4} className="md:col-span-6 md:col-start-7">
            <p className="text-[1.05rem] leading-relaxed text-white/75">{TEXT}</p>
            <div className="mt-7 text-white"><Btn href={CTA.href} kind="ghost">{CTA.label} <span aria-hidden>→</span></Btn></div>
          </Fade>
        </div>

        <ol className="mt-20 md:mt-28">
          {PILLARS.map((p, i) => {
            const odd = i % 2 === 1;
            return (
              <li key={p.n} className="grid items-center gap-8 border-t border-white/15 py-12 md:grid-cols-12 md:gap-10 md:py-16">
                <div className={cn("md:col-span-7", odd && "md:order-2 md:col-start-6")}>
                  <div className="flex items-center gap-5">
                    <span className="font-head text-transparent text-[clamp(3.2rem,8vw,7rem)] font-extrabold leading-none tracking-[-0.06em] [-webkit-text-stroke:1.5px_rgba(153,196,228,.8)]" aria-hidden>{p.n}</span>
                    <span className="grid h-12 w-12 place-items-center rounded-full border border-white/25 text-brand"><Icon name={p.icon} size={22} /></span>
                  </div>
                  <DualWipeReveal as="h3" full={full} direction={odd ? "right" : "left"} accentColor={odd ? "#99C4E4" : "#2E6CA0"}
                    className="mt-4 w-fit max-w-full font-head text-[clamp(2rem,5.4vw,4.8rem)] font-extrabold leading-[0.98] tracking-[-0.05em] text-white">
                    {p.title}
                  </DualWipeReveal>
                  <Fade full={full} delay={0.35}>
                    <p className="mt-6 max-w-[48ch] text-[1rem] leading-relaxed text-white/70">{p.text}</p>
                    <Tags tags={p.tags} className="mt-6" tagClass="border-white/25 text-white/80" />
                  </Fade>
                </div>
                <div className={cn("md:col-span-5", odd && "md:order-1 md:col-start-1")}>
                  <DualWipeReveal full={full} direction={odd ? "down" : "up"} delay={0.15} duration={0.9} accentColor="#99C4E4" wipeColor="#2E6CA0"
                    className={cn("aspect-[4/5] w-full rounded-[4px] md:max-w-[26rem]", odd ? "md:rotate-[2deg]" : "md:ml-auto md:-rotate-[2deg]")}>
                    <img src={p.img} alt={ALT[p.n]} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  </DualWipeReveal>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
