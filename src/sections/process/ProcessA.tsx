/**
 * PROCESO A · Cinematic Premium — basado en 21st.dev «How It Works» (id 19861, chamaac).
 * Del original se conserva: tarjetas «clavadas» con chincheta (icono pin del original), giradas en alternancia
 * (±rotate) y colocadas en zigzag absoluto en escritorio, unidas por un trazo SVG discontinuo que avanza en bucle
 * (strokeDashoffset múltiplo de 8+6 para que el bucle sea continuo, vector-effect non-scaling-stroke), fondo de
 * papel pautado (líneas cada 32 px) con fundidos laterales, hover que escala la tarjeta y la sube de capa, y apilado
 * vertical en móvil.
 * Adaptación: 4 fases reales de site.ts (alturas y curvas del trazo recalculadas para 4 tarjetas con foto); tono
 * cinematográfico nocturno con pauta clara, viñeteado y grano; numeral Poppins en lugar de la tipografía «Comic»;
 * sobre el trazo discontinuo se dibuja un segundo trazo de marca ligado al scroll y cada tarjeta «aterriza» girando
 * hasta su ángulo al entrar en pantalla. El hover se replica con :focus-within (teclado/táctil). Estático: tarjetas
 * en su posición final y trazo completo.
 */
import { useRef, type CSSProperties } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { CtaLink, Eyebrow, LEAD, PHASES, TITLE, useFull } from "./shared";

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/** Altura del lienzo en escritorio y posiciones en zigzag (como DEFAULT_CARD_POSITIONS del original). */
const H = 1300;
const POS = [
  { cls: "md:absolute md:top-0 md:left-[4%]", rot: 6 },
  { cls: "md:absolute md:top-[170px] md:right-[4%]", rot: -6 },
  { cls: "md:absolute md:top-[600px] md:left-[6%]", rot: 5 },
  { cls: "md:absolute md:top-[770px] md:right-[3%]", rot: -6 },
];
/** Curvas que unen los centros de las 4 tarjetas (viewBox 1000 × H). */
const PATH = "M 230 250 C 520 250, 520 420, 770 420 C 1010 420, 640 600, 230 850 C 200 1010, 520 1020, 770 1020";

const Pin = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M16 3a1 1 0 0 1 .117 1.993l-.117 .007v4.764l1.894 3.789a1 1 0 0 1 .1 .331l.006 .116v2a1 1 0 0 1 -.883 .993l-.117 .007h-4v4a1 1 0 0 1 -1.993 .117l-.007 -.117v-4h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-2a1 1 0 0 1 .06 -.34l.046 -.107l1.894 -3.791v-4.762a1 1 0 0 1 -.117 -1.993l.117 -.007h8z" />
  </svg>
);

function Card({ i }: { i: number }) {
  const p = PHASES[i];
  return (
    <article className="rounded-[25px] border border-white/10 bg-white p-2 text-ink shadow-[0_30px_70px_-25px_rgba(0,0,0,.75)]">
      <Pin className="mx-auto mb-3 mt-1 h-8 w-8 text-brand-strong" />
      <div className="relative flex flex-col overflow-hidden rounded-[17px] border border-brand/30 bg-brand-tint">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img src={p.img} alt={p.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-night/55 via-transparent to-transparent" aria-hidden />
          <span className="absolute bottom-2 left-4 font-head text-[2.6rem] font-extrabold leading-none tracking-[-0.05em] text-white">{p.n}</span>
        </div>
        <div className="p-[18px]">
          <h3 className="text-[1.6rem] font-semibold leading-none tracking-[-0.03em] text-ink">{p.title}</h3>
          <p className="mt-2.5 text-[0.92rem] leading-snug tracking-tight text-ink/70">{p.text}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`Incluye en ${p.title}`}>
            {p.tags.map((t) => (
              <li key={t} className="rounded-full border border-brand-strong/20 bg-white px-2.5 py-1 text-[11.5px] font-medium text-brand-deep">{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

function Backdrop() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px)", backgroundSize: "100% 32px", marginTop: 4 }} aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-night to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-night to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(46,108,160,.22),transparent_60%)]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay" style={{ backgroundImage: GRAIN }} aria-hidden />
    </>
  );
}

function Head() {
  return (
    <div className="grid items-end gap-8 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <Eyebrow className="text-brand" />
        <h2 className="mt-4 max-w-[13ch] text-[length:var(--u-h2)] font-extrabold leading-[.96] tracking-[-0.045em] text-white">{TITLE}</h2>
      </div>
      <div className="lg:col-span-5">
        <p className="max-w-[44ch] text-[1.02rem] leading-relaxed text-white/70">{LEAD}</p>
        <CtaLink className="mt-4 text-brand hover:text-white" />
      </div>
    </div>
  );
}

export default function ProcessA() {
  const full = useFull();
  const board = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: board, offset: ["start 75%", "end 60%"] });
  const draw = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="relative isolate overflow-hidden bg-night py-[var(--u-section-y)] text-white">
      <Backdrop />
      <div className="u-wrap relative z-10">
        <Head />

        <div ref={board} className="relative mx-auto mt-16 w-full max-w-[1100px] md:mt-24 md:h-[var(--h)]" style={{ "--h": `${H}px` } as CSSProperties}>
          {/* Trazos de conexión (escritorio) */}
          <svg className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full md:block" viewBox={`0 0 1000 ${H}`} preserveAspectRatio="none" aria-hidden>
            <motion.path d={PATH} stroke="currentColor" className="text-white/25" strokeWidth={2} strokeDasharray="8 6" fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke"
              initial={{ strokeDashoffset: 0 }} animate={full ? { strokeDashoffset: -140 } : undefined} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
            <motion.path d={PATH} stroke="currentColor" className="text-brand" strokeWidth={2.5} fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke"
              style={{ pathLength: full ? draw : 1, filter: "drop-shadow(0 0 6px rgba(153,196,228,.6))" }} />
          </svg>
          {/* Conector vertical (móvil) */}
          <div className="absolute bottom-10 left-1/2 top-10 w-px -translate-x-1/2 border-l-2 border-dashed border-white/20 md:hidden" aria-hidden />

          <ol className="relative flex flex-col gap-10 md:block">
            {PHASES.map((p, i) => {
              const pos = POS[i];
              return (
                <li key={p.n} className={cn("relative z-10 mx-auto w-full max-w-[360px] hover:z-30 focus-within:z-30 md:w-[370px] md:max-w-none", pos.cls)}>
                  <motion.div
                    initial={full ? { opacity: 0, y: 80, rotate: 0, scale: 0.92 } : false}
                    whileInView={{ opacity: 1, y: 0, rotate: pos.rot * 0.6, scale: 1 }}
                    style={full ? undefined : { rotate: pos.rot * 0.6 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ type: "spring", stiffness: 90, damping: 16, mass: 0.9 }}
                  >
                    <div className="transition-transform duration-300 hover:scale-105 focus-within:scale-105"><Card i={i} /></div>
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
