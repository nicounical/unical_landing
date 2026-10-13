/**
 * POR QUÉ G · Interactive Gallery — basado en 21st.dev «About Us section» (id 2749, uniquesonu).
 * Del original se conserva: cabecera centrada con kicker + icono, H2 y subrayado animado (width 0 → 96 px), párrafo
 * introductorio, rejilla de tres columnas con los servicios repartidos a izquierda y derecha flanqueando una imagen
 * central (marco desplazado con borde, acentos flotantes con parallax useScroll y puntos pulsantes), ServiceItem
 * con icono que se agita al pasar el cursor, entrada orquestada con staggerChildren y banda CTA final en oscuro.
 * Adaptación: seis servicios inventados → los cuatro pilares reales (dos por lado). La imagen central se convierte
 * en galería interactiva: cada pilar es un botón (hover, foco, clic o toque) que cambia la foto central con un
 * barrido y su pie. Se eliminan las estadísticas animadas y cualquier dato inventado; botón «Our Portfolio» →
 * enlace real a proyectos. Sin movimiento completo: sin parallax, pulsos ni entradas; galería operativa.
 */
import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { contact } from "@/content/site";
import { Btn, Icon } from "@/core/ui";
import { cn } from "@/lib/utils";
import { ALT, ArrowR, CTA, EYEBROW, PILLARS, TEXT, Title, useFull, type Pillar } from "./shared";

const ease = [0.16, 1, 0.3, 1] as const;

function PillarItem({ p, i, on, select, side, full }: { p: Pillar; i: number; on: boolean; select: (i: number) => void; side: "left" | "right"; full: boolean }) {
  return (
    <motion.li variants={{ hidden: { opacity: 0, x: side === "left" ? -24 : 24 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease } } }}>
      <button type="button" aria-pressed={on} aria-controls="wyg-stage"
        onMouseEnter={() => select(i)} onFocus={() => select(i)} onClick={() => select(i)}
        className={cn(
          "group relative w-full rounded-2xl p-5 text-left transition-[background-color,box-shadow,transform] duration-300 md:p-6",
          on ? "bg-white shadow-[0_18px_50px_-20px_rgba(26,26,46,.35)]" : "hover:bg-white/60",
          side === "right" && "md:text-right",
        )}>
        <span className={cn("flex items-center gap-3", side === "right" && "md:flex-row-reverse")}>
          <motion.span className={cn("relative grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-colors duration-300",
            on ? "bg-brand-strong text-white" : "bg-brand-strong/10 text-brand-strong group-hover:bg-brand-strong/20")}
            whileHover={full ? { rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } } : undefined}>
            <Icon name={p.icon} size={22} />
          </motion.span>
          <span className="min-w-0">
            <span className="block font-mono text-[11px] tabular-nums tracking-[0.2em] text-ink/45">{p.n}</span>
            <span className={cn("block font-head text-xl font-bold tracking-[-0.02em] transition-colors duration-300", on ? "text-brand-strong" : "text-ink")}>{p.title}</span>
          </span>
        </span>
        <span className="mt-3 block text-sm leading-relaxed text-ink/70">{p.text}</span>
        <span className={cn("mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-strong/80", side === "right" && "md:justify-end")}>
          {p.tags.map((t) => <span key={t}>{t}</span>)}
        </span>
        <span className={cn("absolute top-1/2 hidden h-10 w-[3px] -translate-y-1/2 rounded-full bg-brand-strong transition-opacity duration-300 md:block",
          side === "left" ? "-right-[2px]" : "-left-[2px]", on ? "opacity-100" : "opacity-0")} aria-hidden />
      </button>
    </motion.li>
  );
}

export default function WhyG() {
  const full = useFull();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const r1 = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const r2 = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const cur = PILLARS[active];

  const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } } };
  const item = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" as const } } };
  const anim = full ? { initial: "hidden" as const, whileInView: "visible" as const, viewport: { once: true, amount: 0.15 } } : { initial: false as const, animate: "visible" as const };

  const left = PILLARS.slice(0, 2), right = PILLARS.slice(2);

  return (
    <div ref={ref} className="relative overflow-hidden bg-gradient-to-b from-paper to-[#FAF9F6] py-[var(--u-section-y)] text-ink">
      {full && (
        <>
          <motion.div aria-hidden className="absolute left-10 top-20 h-64 w-64 rounded-full bg-brand/25 blur-3xl" style={{ y: y1, rotate: r1 }} />
          <motion.div aria-hidden className="absolute bottom-20 right-10 h-80 w-80 rounded-full bg-brand-strong/10 blur-3xl" style={{ y: y2, rotate: r2 }} />
        </>
      )}
      <motion.div className="u-wrap relative z-10" variants={container} {...anim}>
        <motion.div className="mb-6 flex flex-col items-center text-center" variants={item}>
          <span className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-strong">
            <Icon name="badge" size={16} /> {EYEBROW}
          </span>
          <h2 className="max-w-[20ch] text-[clamp(2rem,4.6vw,3.8rem)] font-extrabold leading-[1.02] tracking-[-0.045em] text-ink"><Title /></h2>
          <motion.div aria-hidden className="mt-6 h-1 rounded-full bg-brand-strong" initial={full ? { width: 0 } : false} whileInView={{ width: 96 }}
            viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} style={full ? undefined : { width: 96 }} />
        </motion.div>
        <motion.p className="mx-auto mb-16 max-w-2xl text-center text-[1.02rem] leading-relaxed text-ink/75" variants={item}>{TEXT}</motion.p>

        <div className="relative grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_minmax(0,22rem)_1fr] md:gap-8 lg:grid-cols-[1fr_minmax(0,26rem)_1fr]">
          <ul className="space-y-4 md:space-y-8">
            {left.map((p, i) => <PillarItem key={p.n} p={p} i={i} on={active === i} select={setActive} side="left" full={full} />)}
          </ul>

          {/* Imagen central = escenario de la galería */}
          <motion.div className="order-first mb-6 flex justify-center md:order-none md:mb-0" variants={item}>
            <div className="w-full max-w-[22rem] md:max-w-none">
            <div className="relative">
              <div id="wyg-stage" role="region" aria-live="polite" aria-label={`Pilar ${cur.n}: ${cur.title}`}
                className="relative aspect-[4/5] overflow-hidden rounded-md bg-navy shadow-xl">
                <AnimatePresence initial={false}>
                  <motion.img key={cur.n} src={cur.img} alt={ALT[cur.n]} loading="lazy" decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={full ? { clipPath: "inset(0 0 100% 0)", scale: 1.12 } : false}
                    animate={{ clipPath: "inset(0 0 0% 0)", scale: 1 }} exit={{ opacity: 0.999 }}
                    transition={{ duration: full ? 0.9 : 0, ease }} />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] tabular-nums tracking-[0.2em] text-brand">{cur.n} / {String(PILLARS.length).padStart(2, "0")}</p>
                    <p className="mt-1 font-head text-lg font-bold leading-tight text-white">{cur.title}</p>
                  </div>
                  <a href={contact.projectsUrl} className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-navy transition-transform duration-300 hover:scale-105">
                    Ver proyectos <ArrowR className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
              <motion.div aria-hidden className="absolute inset-0 -z-10 -m-3 rounded-md border-4 border-brand"
                initial={full ? { opacity: 0, scale: 1.1 } : false} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.6 }} />
              {full && (
                <>
                  <motion.div aria-hidden className="absolute -right-8 -top-4 h-16 w-16 rounded-full bg-brand-strong/15" style={{ y: y1 }} />
                  <motion.div aria-hidden className="absolute -bottom-6 -left-10 h-20 w-20 rounded-full bg-brand/30" style={{ y: y2 }} />
                  <motion.div aria-hidden className="absolute -top-10 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-brand-strong"
                    animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
                  <motion.div aria-hidden className="absolute -bottom-12 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-brand"
                    animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />
                </>
              )}
            </div>
              {/* Miniaturas: acceso directo a cada foto (útil en táctil) */}
              <div className="mt-8 flex justify-center gap-2" role="group" aria-label="Fotos de los pilares">
                {PILLARS.map((p, i) => (
                  <button key={p.n} type="button" onClick={() => setActive(i)} aria-pressed={active === i} aria-label={`Ver ${p.title}`}
                    className={cn("h-11 w-11 overflow-hidden rounded-lg ring-2 ring-offset-2 ring-offset-paper transition-all duration-300",
                      active === i ? "ring-brand-strong" : "opacity-60 ring-transparent hover:opacity-100")}>
                    <img src={p.img} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <ul className="space-y-4 md:space-y-8">
            {right.map((p, i) => <PillarItem key={p.n} p={p} i={i + 2} on={active === i + 2} select={setActive} side="right" full={full} />)}
          </ul>
        </div>

        <motion.div className="mt-20 flex flex-col items-start justify-between gap-6 rounded-xl bg-navy p-8 text-white md:flex-row md:items-center md:p-10" variants={item}>
          <div className="flex-1">
            <h3 className="text-2xl font-bold tracking-[-0.025em] text-white">Somos tu partner, no solo tu proveedor.</h3>
            <p className="mt-2 text-white/75">Producción propia, diseño, instalación certificada y cobertura en toda España.</p>
          </div>
          <Btn href={CTA.href} kind="primary">{CTA.label} <span aria-hidden>→</span></Btn>
        </motion.div>
      </motion.div>
    </div>
  );
}
