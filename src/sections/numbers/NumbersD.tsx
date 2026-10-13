/**
 * CIFRAS D · Minimal Luxury — basado en 21st.dev «Stats Section» (id 29870, shadcnui-blocks stats-05).
 * Del original se conserva: titular centrado con subtítulo, rejilla de tarjetas con borde fino y fondo atenuado,
 * icono lucide de trazo 1.75 arriba con aire debajo (mb-8), cifra grande en peso medio con tracking −0.01em y
 * etiqueta en tamaño xl al pie.
 * Adaptación: cuatro tarjetas (las cuatro cifras reales de site.ts) en lugar de tres porcentajes inventados; iconos
 * en un solo tono de marca, paleta papel + blanco, regla fina con índice y un conteo sereno al entrar (helper Count,
 * que muestra el valor final con reduced motion). El subtítulo es el `lead` real de la sección.
 */
import { useRef } from "react";
import { motion } from "motion/react";
import { BadgeCheck, FolderCheck, Hourglass, Layers, type LucideIcon } from "lucide-react";
import { numbers } from "@/content/site";
import { Count, ITEMS, LEAD, SrValue, pad, useFull, useInViewOnce } from "./shared";

const ICONS: LucideIcon[] = [Hourglass, FolderCheck, Layers, BadgeCheck];

export default function NumbersD() {
  const full = useFull();
  const grid = useRef<HTMLDivElement>(null);
  const seen = useInViewOnce(grid, 0.2);

  return (
    <div className="bg-paper py-[var(--u-section-y)] text-ink">
      <div className="u-wrap">
        <div className="mx-auto max-w-[880px] text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-strong">{numbers.eyebrow}</p>
          <h2 className="mt-6 text-balance font-sans text-[clamp(2.1rem,4.6vw,3.9rem)] font-normal leading-[1.05] tracking-[-0.045em] text-ink">
            {numbers.titleA}<em className="font-head font-semibold not-italic text-brand-strong">{numbers.titleEm}</em>{numbers.titleB}
          </h2>
          <p className="mx-auto mt-5 max-w-[52ch] text-[clamp(1.02rem,1.4vw,1.2rem)] leading-relaxed tracking-[-0.015em] text-ink/60">{LEAD}</p>
        </div>

        <div ref={grid} className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
          {ITEMS.map((it, i) => {
            const Icon = ICONS[i] ?? BadgeCheck;
            return (
              <motion.div key={it.label}
                initial={full ? { opacity: 0, y: 18 } : false}
                animate={seen ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col rounded-xl border border-ink/[.08] bg-white/70 p-6 py-7 transition-colors duration-500 hover:bg-white md:p-7 md:py-8">
                <div className="mb-8 flex items-start justify-between">
                  <Icon className="h-10 w-10 stroke-[1.75px] text-brand-strong" aria-hidden />
                  <span className="font-mono text-[11px] tabular-nums tracking-[0.18em] text-ink/35" aria-hidden>{pad(i + 1)}</span>
                </div>
                <span className={it.text ? "font-sans text-[clamp(2rem,2.8vw,2.6rem)] font-medium leading-none tracking-[-0.02em] text-ink" : "font-sans text-5xl font-medium leading-none tracking-[-0.01em] text-ink tabular-nums lg:text-[3.4rem]"}>
                  <SrValue it={it} />
                  <span aria-hidden><Count it={it} /></span>
                </span>
                <span className="mt-6 block h-px w-10 bg-ink/15 transition-all duration-700 group-hover:w-20 group-hover:bg-brand-strong" aria-hidden />
                <p className="mt-4 text-xl leading-snug text-ink/75">{it.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
