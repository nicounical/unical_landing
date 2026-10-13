/**
 * POR QUÉ E · High-Energy Motion — basado en 21st.dev «Glow Card Grid» (id 25283).
 * Del original se conserva: un único listener de `pointermove` en document que, para cada tarjeta, calcula la
 * posición normalizada del puntero respecto a su centro (--pointer-x/--pointer-y, por defecto −10 = fuera); una
 * copia de la imagen ampliada (scale 4), desenfocada, saturada y semitransparente se desplaza ±50 % con esas
 * variables; y un anillo de borde con backdrop-filter (blur/brightness/contrast/saturate) enmascarado con
 * mask-composite: exclude convierte ese resplandor en un borde luminoso que sigue al cursor por toda la rejilla.
 * Adaptación: avatares → foto real de cada pilar; utilidades de Tailwind v4 (cqi, rounded-(--x)) reescritas para
 * Tailwind 3 (porcentajes y estilos en línea). Energía extra: titular que entra palabra a palabra con muelle y
 * tarjetas en cascada. En táctil (sin puntero) un puntero virtual orbita la rejilla mientras está en pantalla.
 * Sin movimiento completo: tarjetas estáticas sin resplandor.
 */
import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import { motion } from "motion/react";
import { finePointer } from "@/core/env";
import { Btn, Icon } from "@/core/ui";
import { cn } from "@/lib/utils";
import { ALT, CTA, Eyebrow, PILLARS, TEXT, TITLE_PLAIN, useFull, type Pillar } from "./shared";
import { why } from "@/content/site";

const GRID_VARS = {
  "--card-radius": "20px",
  "--card-icon-blur": "28px",
  "--card-icon-saturate": 4,
  "--card-icon-brightness": 1.3,
  "--card-icon-scale": 4,
  "--card-icon-opacity": 0.55,
  "--card-border-width": "3px",
  "--card-border-blur": "10px",
  "--card-border-saturate": 4.2,
  "--card-border-brightness": 2.5,
  "--card-border-contrast": 2.5,
} as CSSProperties;

const RING: CSSProperties = {
  borderWidth: "var(--card-border-width)", borderStyle: "solid", borderColor: "transparent",
  backdropFilter: "blur(var(--card-border-blur)) brightness(var(--card-border-brightness)) contrast(var(--card-border-contrast)) saturate(var(--card-border-saturate))",
  WebkitBackdropFilter: "blur(var(--card-border-blur)) brightness(var(--card-border-brightness)) contrast(var(--card-border-contrast)) saturate(var(--card-border-saturate))",
  clipPath: "inset(0 round var(--card-radius))",
  maskImage: "linear-gradient(#fff 0 100%), linear-gradient(#fff 0 100%)",
  maskOrigin: "border-box, padding-box",
  maskClip: "border-box, padding-box",
  maskComposite: "exclude",
  WebkitMaskComposite: "xor",
  borderRadius: "var(--card-radius)",
};

const BLOB: CSSProperties = {
  transform: "translate(calc(var(--pointer-x, -10) * 50%), calc(var(--pointer-y, -10) * 50%)) translateZ(0) scale(var(--card-icon-scale))",
  filter: "blur(var(--card-icon-blur)) brightness(var(--card-icon-brightness)) saturate(var(--card-icon-saturate))",
  opacity: "var(--card-icon-opacity)" as unknown as number,
};

function GlowCard({ p, i, full }: { p: Pillar; i: number; full: boolean }) {
  return (
    <motion.li data-slot="glow-card"
      className="relative w-full select-none overflow-hidden ring-1 ring-white/10 transition-transform duration-200 active:scale-[0.98]"
      style={{ borderRadius: "var(--card-radius)" }}
      initial={full ? { opacity: 0, y: 60, scale: 0.92 } : false} whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ type: "spring", stiffness: 140, damping: 16, delay: i * 0.09 }}>
      <div className="relative flex h-full overflow-hidden bg-white/[0.03]" style={{ borderRadius: "var(--card-radius)", clipPath: "inset(0 round var(--card-radius))" }}>
        {full && (
          <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center will-change-[transform,filter]" style={BLOB}>
            <img src={p.img} alt="" className="h-20 w-20 rounded-full object-cover" loading="lazy" decoding="async" />
          </div>
        )}
        <div className="relative z-[1] flex flex-1 flex-col p-6 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <img src={p.img} alt={ALT[p.n]} loading="lazy" decoding="async" className="h-16 w-16 rounded-full object-cover ring-2 ring-white/15" />
            <span className="font-head text-[2.6rem] font-extrabold leading-none tracking-[-0.06em] text-white/15">{p.n}</span>
          </div>
          <div className="mt-8 flex items-center gap-3 text-brand">
            <Icon name={p.icon} size={22} />
            <h3 className="text-[1.3rem] font-bold leading-tight tracking-[-0.025em] text-white">{p.title}</h3>
          </div>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-white/65">{p.text}</p>
          <ul className="mt-auto flex flex-wrap gap-2 pt-6">
            {p.tags.map((t) => (
              <li key={t} className="rounded-full bg-white/[0.07] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">{t}</li>
            ))}
          </ul>
        </div>
      </div>
      {full && <div aria-hidden className="pointer-events-none absolute inset-0" style={RING} />}
    </motion.li>
  );
}

export default function WhyE() {
  const full = useFull();
  const grid = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (!full) return;
    const g = grid.current;
    if (!g) return;
    const apply = (cx: number, cy: number) => {
      g.querySelectorAll<HTMLElement>("[data-slot='glow-card']").forEach((card) => {
        const r = card.getBoundingClientRect();
        const x = (cx - (r.left + r.width / 2)) / (r.width / 2);
        const y = (cy - (r.top + r.height / 2)) / (r.height / 2);
        card.style.setProperty("--pointer-x", x.toFixed(3));
        card.style.setProperty("--pointer-y", y.toFixed(3));
      });
    };
    if (finePointer()) {
      const onMove = (e: PointerEvent) => apply(e.clientX, e.clientY);
      document.addEventListener("pointermove", onMove);
      return () => document.removeEventListener("pointermove", onMove);
    }
    // Táctil: puntero virtual que orbita la rejilla solo mientras está visible.
    let raf = 0, visible = false;
    const t0 = performance.now();
    const tick = (now: number) => {
      const r = g.getBoundingClientRect();
      const t = (now - t0) / 1000;
      apply(r.left + r.width / 2 + Math.cos(t * 0.9) * r.width * 0.55, r.top + r.height / 2 + Math.sin(t * 0.6) * r.height * 0.5);
      if (visible) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(tick);
    });
    io.observe(g);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [full]);

  const words = [...why.titleA.trim().split(" "), why.titleEm, ...why.titleB.trim().split(" ")];
  const emIndex = why.titleA.trim().split(" ").length;

  return (
    <div className="relative overflow-hidden bg-night py-[var(--u-section-y)] text-white">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[30rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-strong/30 blur-[140px]" />
      <div className="u-wrap relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Eyebrow className="text-brand" />
            <h2 aria-label={TITLE_PLAIN} className="mt-5 text-[clamp(2.3rem,6vw,5.4rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.05em] text-white">
              {words.map((w, i) => (
                <Fragment key={i}><span aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-top">
                  <motion.span className={cn("inline-block", i === emIndex && "italic text-brand")}
                    initial={full ? { y: "110%", rotate: 8, skewX: -12 } : false} whileInView={{ y: "0%", rotate: 0, skewX: 0 }}
                    viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: i * 0.05 }}>
                    {w}
                  </motion.span>
                </span>{i < words.length - 1 && " "}</Fragment>
              ))}
            </h2>
          </div>
          <motion.div className="lg:col-span-4" initial={full ? { opacity: 0, x: 40 } : false} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.35 }}>
            <p className="text-[1rem] leading-relaxed text-white/70">{TEXT}</p>
            <div className="mt-6"><Btn href={CTA.href} kind="primary" magnetic>{CTA.label} <span aria-hidden>→</span></Btn></div>
          </motion.div>
        </div>

        <ol ref={grid} className="mt-16 grid w-full gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4" style={GRID_VARS}>
          {PILLARS.map((p, i) => <GlowCard key={p.n} p={p} i={i} full={full} />)}
        </ol>
      </div>
    </div>
  );
}
