/**
 * SERVICIOS D · Minimal Luxury — basado en 21st.dev «Sticky Scroll Reveal» (id 952, Aceternity).
 * Del original se conserva: columna de textos que pasan de opacidad 0.3 a 1 cuando son el bloque activo,
 * panel multimedia `sticky` que cambia con el bloque activo, cálculo del bloque activo por el punto de corte más
 * cercano al progreso de scroll (mismo `reduce` del original) y fondo que se anima entre tonos según el bloque.
 * Adaptación: el original usaba un contenedor con scroll interno de 30rem (atrapaba la rueda); aquí se usa el scroll
 * de la página (`useScroll` con target), sin pin y ≈300vh. Degradados de colores sustituidos por fotos reales con
 * revelado en cortinilla (clip-path), fondos papel/blanco de marca, tipografía ligera de lujo. En móvil, donde el
 * original ocultaba el panel, cada bloque lleva su foto en línea.
 */
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "@/lib/utils";
import { ArrowUR, Eyebrow, ITEMS, SCOPE, TITLE, pad, useFull } from "./shared";

const BG = ["#FFFFFF", "#F3F1EC", "#F6F8FB"];
const ease = [0.22, 1, 0.36, 1] as const;

function Copy({ i }: { i: number }) {
  const s = ITEMS[i];
  return (
    <>
      <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/55">
        <span className="tabular-nums">{s.n}</span><span className="h-px w-8 bg-ink/30" aria-hidden />{s.sub}
      </p>
      <h3 className="mt-5 text-[clamp(2rem,3.6vw,3.2rem)] font-light leading-[1.02] tracking-[-0.04em] text-ink">{s.title}</h3>
      <p className="mt-5 max-w-[38ch] text-[1.02rem] leading-relaxed text-ink/70">{s.text}</p>
      <p className="mt-5 text-[13px] leading-relaxed text-ink/50">{SCOPE[s.n].join(" · ")}</p>
      <a href={s.href} className="group mt-6 inline-flex min-h-[44px] items-center gap-3 border-b border-ink/25 text-sm font-medium text-ink transition-colors hover:border-ink">
        Ver servicio <span className="sr-only">{s.title}</span>
        <ArrowUR className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </>
  );
}

function Head() {
  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <Eyebrow className="text-brand-strong" />
      </div>
      <h2 className="text-[clamp(2.2rem,4.6vw,4rem)] font-light leading-[1.02] tracking-[-0.045em] text-ink lg:col-span-7">{TITLE}</h2>
    </div>
  );
}

function StaticView() {
  return (
    <div className="bg-white py-[var(--u-section-y)] text-ink">
      <div className="u-wrap">
        <Head />
        <ol className="mt-16 grid gap-x-12 gap-y-16 md:grid-cols-2">
          {ITEMS.map((s, i) => (
            <li key={s.n}>
              <img src={s.img} alt={s.alt} loading="lazy" className="mb-8 aspect-[4/3] w-full rounded-sm object-cover" />
              <Copy i={i} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function ServicesD() {
  const full = useFull();
  const ref = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const points = ITEMS.map((_, i) => i / (ITEMS.length - 1));
    const closest = points.reduce((acc, p, i) => (Math.abs(latest - p) < Math.abs(latest - points[acc]) ? i : acc), 0);
    setActive(closest);
  });

  if (!full) return <StaticView />;

  return (
    <motion.div className="py-[var(--u-section-y)] text-ink" initial={false} animate={{ backgroundColor: BG[active % BG.length] }} transition={{ duration: 0.9 }}>
      <div className="u-wrap">
        <Head />
        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12">
          <ol ref={ref} className="lg:col-span-5">
            {ITEMS.map((s, i) => (
              <li key={s.n} className="flex flex-col justify-center py-10 lg:min-h-[52vh] lg:py-0">
                <img src={s.img} alt={s.alt} loading="lazy" decoding="async" className="mb-8 aspect-[4/3] w-full rounded-sm object-cover lg:hidden" />
                <motion.div initial={false} animate={{ opacity: active === i ? 1 : 0.3, y: active === i ? 0 : 8 }} transition={{ duration: 0.6, ease }}>
                  <Copy i={i} />
                </motion.div>
              </li>
            ))}
          </ol>

          {/* Panel fijo: cortinilla de foto a foto */}
          <div className="hidden lg:col-span-7 lg:block" aria-hidden>
            <div className="sticky top-[14vh]">
              <div className="relative h-[68vh] overflow-hidden rounded-sm bg-paper">
                {ITEMS.map((s, i) => (
                  <motion.img key={s.n} src={s.img} alt="" loading="lazy" decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ zIndex: i === active ? 2 : i < active ? 1 : 0 }}
                    initial={false}
                    animate={{ clipPath: i <= active ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)", scale: i === active ? 1 : 1.06 }}
                    transition={{ duration: 1.1, ease }} />
                ))}
              </div>
              <div className="mt-5 flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/55">
                <span className="tabular-nums text-ink">{pad(active + 1)}</span>
                <div className="relative h-px flex-1 bg-ink/15">
                  <motion.div className="absolute inset-y-0 left-0 bg-ink" initial={false} animate={{ width: `${((active + 1) / ITEMS.length) * 100}%` }} transition={{ duration: 0.8, ease }} />
                </div>
                <span className={cn("tabular-nums")}>{pad(ITEMS.length)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
