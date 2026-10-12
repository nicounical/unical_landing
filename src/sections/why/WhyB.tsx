/**
 * POR QUÉ B · Immersive 3D — basado en 21st.dev «3D parallax effect on hover» (id 2195, minhxthanh).
 * Del original se conserva: la foto en perspectiva con giro rotateY(90deg·f) y recorte clip-path
 * inset(0 f' 0 0 round r) que, al pasar el cursor, se invierte (inset(0 0 0 f'), translateX(-f') rotateY(-a)),
 * con un factor `--f` y un radio `--r` distintos por tarjeta, de modo que cada imagen «gira» sobre sí misma.
 * Adaptación: cada pilar es una tarjeta por capas — foto real + capa frontal con número e icono desplazada en Z
 * (parallax entre capas) — y su texto debajo. También se activa con el foco de teclado; en pantallas táctiles
 * (sin hover) la tarjeta que pasa por el centro de la pantalla gira sola. Imágenes remotas → fotos de site.ts.
 * Sin movimiento completo: tarjetas planas sin giro.
 */
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { finePointer } from "@/core/env";
import { Btn, Icon } from "@/core/ui";
import { cn } from "@/lib/utils";
import { ALT, CTA, Eyebrow, PILLARS, TEXT, Tags, Title, useFull, type Pillar } from "./shared";
import "./why.css";

const LAYERS = [
  { f: 0.1, r: "18px" },
  { f: 0.13, r: "8px" },
  { f: 0.08, r: "26px" },
  { f: 0.11, r: "14px" },
];

function Card({ p, i, full }: { p: Pillar; i: number; full: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  // Alternativa táctil: sin hover, la tarjeta gira cuando cruza la franja central de la pantalla.
  useEffect(() => {
    const el = ref.current;
    if (!el || !full || finePointer()) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: "-38% 0px -38% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [full]);

  const L = LAYERS[i % LAYERS.length];
  return (
    <motion.li className={cn("flex flex-col", i % 2 === 1 && "lg:mt-16")}
      initial={full ? { opacity: 0, y: 40, rotateX: 12 } : false} whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }} transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformPerspective: 900 }}>
      <div ref={ref} tabIndex={full ? 0 : undefined} aria-label={full ? `${p.title}: ${ALT[p.n]}` : undefined}
        className={cn("wyb-card", on && "is-on", full ? "cursor-pointer" : "wyb-static")}
        style={{ ["--f" as string]: L.f, ["--r" as string]: L.r }}>
        <img src={p.img} alt={ALT[p.n]} loading="lazy" decoding="async" className="wyb-card__img" />
        <div className="wyb-card__layer" aria-hidden>
          <div className="wyb-card__shade absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between py-5 text-white" style={{ paddingInline: "calc(var(--_f) + 1rem)" }}>
            <span className="font-head text-[clamp(3rem,5vw,4.5rem)] font-extrabold leading-none tracking-[-0.06em] drop-shadow-[0_8px_24px_rgba(0,0,0,.35)]">{p.n}</span>
            <span className="grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md ring-1 ring-white/30">
              <Icon name={p.icon} size={22} />
            </span>
          </div>
        </div>
      </div>
      <h3 className="mt-7 text-[1.35rem] font-bold tracking-[-0.025em] text-ink">{p.title}</h3>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-charcoal/85">{p.text}</p>
      <Tags tags={p.tags} className="mt-5" tagClass="border-ink/15 text-ink/70" />
    </motion.li>
  );
}

export default function WhyB() {
  const full = useFull();
  return (
    <div className="relative overflow-hidden bg-soft py-[var(--u-section-y)] text-ink">
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-brand/25 blur-[120px]" />
      <div className="u-wrap relative">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow className="text-brand-strong" />
            <h2 className="mt-5 max-w-[17ch] text-[length:var(--u-h2)] font-extrabold leading-[1] tracking-[-0.045em] text-ink">
              <Title />
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="max-w-[44ch] text-[1.02rem] leading-relaxed text-charcoal">{TEXT}</p>
            <div className="mt-6"><Btn href={CTA.href} kind="dark">{CTA.label} <span aria-hidden>→</span></Btn></div>
          </div>
        </div>
        <ol className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {PILLARS.map((p, i) => <Card key={p.n} p={p} i={i} full={full} />)}
        </ol>
        {full && (
          <p className="mt-12 hidden font-mono text-[11px] uppercase tracking-[0.2em] text-ink/45 md:block" aria-hidden>
            Pasa el cursor por cada pilar
          </p>
        )}
      </div>
    </div>
  );
}
