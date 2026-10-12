/**
 * POR QUÉ D · Minimal Luxury — basado en 21st.dev «Feature Grid Spotlight Cards» (id 26797, Hirael feature-08).
 * Del original se conserva: rejilla de tarjetas sobre raíles finos (líneas de 1 px que sobresalen 16 px por cada
 * lado), cruces de replanteo en las esquinas superior-inicio e inferior-fin dibujadas a medio borde, foco radial que
 * sigue al puntero (variables --mx/--my en onPointerMove) y aparece en hover, brillo superior por tarjeta
 * (radial-gradient 50% 80% at 25% 0%) e icono en caja con borde junto a título y descripción.
 * Adaptación: seis tarjetas de producto → los cuatro pilares reales (icono de marca vía `Icon`, número, etiquetas);
 * tonos cálidos → azul de marca; tipografía ligera de lujo y cabecera centrada con el manifiesto. El foco del
 * puntero es decorativo: el contenido es idéntico sin hover (táctil, teclado). Badge de shadcn → etiqueta local.
 */
import type { PointerEvent, ReactNode } from "react";
import { motion } from "motion/react";
import { Icon } from "@/core/ui";
import { cn } from "@/lib/utils";
import { ArrowR, CTA, EYEBROW, PILLARS, TEXT, Title, useFull } from "./shared";

const CrossDecor = ({ position }: { position: "top-start" | "bottom-end" }) => (
  <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"
    className={cn(
      "pointer-events-none absolute z-10 h-3.5 w-3.5 shrink-0 text-ink/40",
      position === "top-start" && "left-0 top-0 -translate-x-1/2 -translate-y-1/2",
      position === "bottom-end" && "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
    )}>
    <path d="M5 12h14" /><path d="M12 5v14" />
  </svg>
);

function FeatureCard({ children, full }: { children: ReactNode; full: boolean }) {
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div onPointerMove={full ? onMove : undefined}
      className="group relative flex h-full flex-col justify-start gap-7 bg-white px-7 pb-8 pt-9 bg-[radial-gradient(50%_80%_at_25%_0%,rgba(153,196,228,.22),transparent)]">
      {full && (
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_220px_at_var(--mx)_var(--my),rgba(46,108,160,.11),transparent_70%)]" />
      )}
      <div aria-hidden className="absolute -inset-y-4 -left-px w-px bg-line" />
      <div aria-hidden className="absolute -inset-y-4 -right-px w-px bg-line" />
      <div aria-hidden className="absolute -inset-x-4 -top-px h-px bg-line" />
      <div aria-hidden className="absolute -inset-x-4 -bottom-px h-px bg-line" />
      {children}
    </div>
  );
}

export default function WhyD() {
  const full = useFull();
  return (
    <div className="bg-white py-[var(--u-section-y)] text-ink">
      <div className="u-wrap">
        <motion.header className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center"
          initial={full ? { opacity: 0, y: 18 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}>
          <p className="rounded-full border border-line bg-soft px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/60">{EYEBROW}</p>
          <h2 className="text-[clamp(2.1rem,4.6vw,3.9rem)] font-light leading-[1.04] tracking-[-0.045em] text-ink">
            <Title em="font-semibold not-italic text-brand-strong" />
          </h2>
          <p className="max-w-[56ch] text-base leading-relaxed text-ink/60 md:text-[1.08rem]">{TEXT}</p>
        </motion.header>

        <ol className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <motion.li key={p.n} initial={full ? { opacity: 0 } : false} whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 1.2, delay: 0.1 + i * 0.12 }}>
              <FeatureCard full={full}>
                <CrossDecor position="top-start" />
                <CrossDecor position="bottom-end" />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="flex w-fit items-center justify-center rounded-[3px] border border-line bg-soft/60 p-3 text-ink transition-colors duration-500 group-hover:border-brand-strong/40 group-hover:text-brand-strong">
                    <Icon name={p.icon} size={20} />
                  </span>
                  <span className="font-mono text-[11px] tabular-nums tracking-[0.18em] text-ink/40">{p.n}</span>
                </div>
                <div className="relative z-10 flex flex-1 flex-col gap-3">
                  <h3 className="text-[1.08rem] font-semibold tracking-[-0.015em] text-ink">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-ink/60">{p.text}</p>
                  <p className="mt-auto pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-brand-strong/80">{p.tags.join(" / ")}</p>
                </div>
              </FeatureCard>
            </motion.li>
          ))}
        </ol>

        <div className="mt-20 flex justify-center">
          <a href={CTA.href} className="group inline-flex min-h-[44px] items-center gap-3 border-b border-ink/25 text-sm font-medium text-ink transition-colors hover:border-ink">
            {CTA.label}
            <ArrowR className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
}
