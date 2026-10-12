/**
 * CONTACTO B · Immersive 3D — basado en 21st.dev «CTA Section With Floating Gallery» (id 29769, scrollxui).
 * Del original se conserva: titular que entra palabra a palabra con desenfoque (blur 6px → 0, y 12, 0.08 s por
 * palabra), texto y botón «orb» que aparecen después, y la galería escalonada de fotos que entran con escala
 * 0.8 → 1 en cascada, con degradados arriba y abajo.
 * Adaptación: las capturas de UI se sustituyen por fotos reales de trabajos de Unical y la galería pasa a ser una
 * escena en profundidad: tres columnas en un plano inclinado (perspective + rotateX/rotateY) que se desplazan a
 * distinta velocidad con el scroll (parallax) y se inclinan con el puntero (solo puntero fino). El OrbButton se
 * reimplementa localmente (orbe con gradiente cónico giratorio) y despliega el formulario real (ContactForm) bajo
 * el texto (aria-expanded). Canales reales debajo. Estático: galería quieta y formulario ya abierto.
 */
import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { cta } from "@/content/site";
import { ContactForm } from "@/core/ContactForm";
import { finePointer } from "@/core/env";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Channels, EYEBROW, Eyebrow, PHOTOS, TEXT, useFull } from "./shared";

const CSS = `
.cb-title .u-hollow{-webkit-text-stroke:1.5px #16161F}
@keyframes cb-spin{to{transform:rotate(1turn)}}
.cb-orb{background:conic-gradient(from 0deg,#99C4E4,#2E6CA0,#EAF2F9,#1E5076,#99C4E4);animation:cb-spin 4s linear infinite;filter:blur(.5px)}
.cb-btn:hover .cb-orb,.cb-btn:focus-visible .cb-orb{animation-duration:1.4s}
@media (prefers-reduced-motion:reduce){.cb-orb{animation:none}}
.cb-form .cf-send{width:100%}
`;

const COLS = [PHOTOS.slice(0, 5), PHOTOS.slice(5, 10), PHOTOS.slice(10, 14)];
const RANGE: [number, number][] = [[60, -140], [-60, 120], [100, -180]];

function OrbButton({ open, onClick, controls }: { open: boolean; onClick: () => void; controls: string }) {
  return (
    <button type="button" onClick={onClick} aria-expanded={open} aria-controls={controls}
      className="cb-btn group relative inline-flex min-h-[56px] items-center gap-4 rounded-full bg-ink py-2 pl-2 pr-6 text-[0.95rem] font-semibold text-white shadow-[0_18px_40px_-14px_rgba(46,108,160,.7)] transition-transform duration-300 hover:-translate-y-0.5">
      <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full" aria-hidden>
        <span className="cb-orb absolute -inset-2 rounded-full" />
        <span className="absolute inset-[3px] rounded-full bg-ink/40 backdrop-blur-sm" />
        <ArrowUpRight className={cn("relative h-4 w-4 transition-transform duration-500", open && "rotate-[135deg]")} />
      </span>
      {open ? "Cerrar formulario" : "Pedir presupuesto"}
    </button>
  );
}

function Column({ items, i, progress, full }: { items: typeof PHOTOS; i: number; progress: MotionValue<number>; full: boolean }) {
  const y = useTransform(progress, [0, 1], RANGE[i]);
  return (
    <motion.ul style={full ? { y } : undefined} className={cn("flex flex-col gap-3", i === 1 && "mt-16", i === 2 && "-mt-6 hidden sm:flex")}>
      {items.map((p, k) => (
        <motion.li key={p.src}
          initial={full ? { opacity: 0, scale: 0.8, y: 20 } : false}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 * (k + i * 2), ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-xl bg-white shadow-[0_24px_50px_-20px_rgba(26,26,46,.45)] ring-1 ring-black/5">
          <img src={p.src} alt={p.alt} loading="lazy" decoding="async" className={cn("w-full object-cover", k % 2 ? "aspect-[4/5]" : "aspect-[4/3]")} />
        </motion.li>
      ))}
    </motion.ul>
  );
}

function Gallery({ full }: { full: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: box, offset: ["start end", "end start"] });
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [26, 14]), { stiffness: 120, damping: 20 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-26, -10]), { stiffness: 120, damping: 20 });
  const tilt = full && finePointer();
  return (
    <div ref={box}
      onPointerMove={tilt ? (e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set(((e.clientX - r.left) / r.width) * 2 - 1); my.set(((e.clientY - r.top) / r.height) * 2 - 1); } : undefined}
      onPointerLeave={tilt ? () => { mx.set(0); my.set(0); } : undefined}
      className="relative h-[clamp(380px,62vw,640px)] overflow-hidden rounded-[28px] bg-gradient-to-br from-brand-tint via-white to-[#dfe9f3] [perspective:1400px]">
      <motion.div
        style={full ? { rotateX: rx, rotateY: ry, rotateZ: 6 } : { transform: "rotateX(20deg) rotateY(-18deg) rotateZ(6deg)" }}
        className="absolute inset-[-12%_-8%] grid grid-cols-2 gap-3 [transform-style:preserve-3d] sm:grid-cols-3">
        {COLS.map((items, i) => <Column key={i} items={items} i={i} progress={scrollYProgress} full={full} />)}
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-soft to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-soft to-transparent" aria-hidden />
      <p className="absolute bottom-4 left-4 rounded-full bg-white/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/70 backdrop-blur">Trabajos reales · Unical</p>
    </div>
  );
}

export default function ContactB() {
  const full = useFull();
  const [open, setOpen] = useState(!full);
  const formId = useId();
  const words = [cta.titleHollow, cta.titleSolid];
  return (
    <div className="relative overflow-hidden bg-soft py-[var(--u-section-y)] text-charcoal">
      <style>{CSS}</style>
      <div className="u-wrap grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="max-w-xl lg:pt-10">
          <Eyebrow className="text-brand-strong" />
          <h2 className="cb-title mt-5 font-head text-[clamp(2.9rem,5.6vw,5.4rem)] font-extrabold leading-[.92] tracking-[-0.05em] text-ink">
            {words.map((w, i) => (
              <motion.span key={w}
                initial={full ? { opacity: 0, filter: "blur(6px)", y: 12 } : false}
                whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: "easeInOut" }}
                className={cn("block", i === 0 && "u-hollow")}>
                {w}
              </motion.span>
            ))}
          </h2>
          <motion.p initial={full ? { opacity: 0 } : false} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 max-w-[42ch] text-[1.05rem] leading-relaxed text-charcoal/85">{TEXT}</motion.p>
          <motion.div initial={full ? { opacity: 0, y: 10 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8">
            {full && <OrbButton open={open} onClick={() => setOpen((o) => !o)} controls={formId} />}
          </motion.div>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div id={formId} key="form" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                <div className="mt-6 rounded-2xl bg-white p-5 shadow-[0_24px_60px_-30px_rgba(26,26,46,.35)] ring-1 ring-line sm:p-7">
                  <ContactForm className="cb-form" button="Enviar solicitud">
                    <p className="sr-only">{EYEBROW}</p>
                  </ContactForm>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 text-ink">
            <Channels className="-ml-2" itemClass="hover:bg-white" />
          </div>
        </div>
        <div className="lg:sticky lg:top-24"><Gallery full={full} /></div>
      </div>
    </div>
  );
}
