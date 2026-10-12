/**
 * CIFRAS G · Interactive Gallery — basado en 21st.dev «About 3» (id 2202, shadcnblocks).
 * Del original se conserva: cabecera en dos columnas (título / texto), rejilla de 3 columnas con imagen principal
 * (col-span-2, máx. 620 px) y columna lateral con tarjeta «breakout» (logo, título, texto y botón outline) sobre una
 * imagen secundaria; fila centrada de logotipos de clientes con su titular; y panel de logros redondeado con
 * etiqueta sobre cifra grande y rejilla de líneas de 80 px enmascarada en diagonal.
 * Adaptación: la imagen principal es una galería interactiva (miniaturas con aria-pressed + flechas, fundido
 * cruzado) con fotos reales de los servicios; la secundaria es un proyecto real. Breakout = logo Unical + pilar
 * real «Producción propia» + CTA real. Clientes reales de site.ts con ClientMark (no hay logotipos vectoriales).
 * Logros = las cuatro cifras reales, que cuentan al entrar. Sin URLs remotas; el h1 del original pasa a h2 único.
 */
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clients, projects, services, why } from "@/content/site";
import { Logo } from "@/core/ui";
import { ClientMark } from "@/sections/clients/ClientMark";
import { cn } from "@/lib/utils";
import { EYEBROW, Eyebrow, ITEMS, LEAD, NumTitle, SrValue, group, pad, useCountUp, useFull, useInViewOnce, type NumItem } from "./shared";

const SLIDES = services.items.map((s) => ({ src: s.img, alt: s.alt, cap: `${s.title} · ${s.sub}` }));
const SECOND = projects.items[0];
const PILLAR = why.pillars[0];
const LOGOS = clients.items.slice(0, 12);

function Stat({ it, i, run }: { it: NumItem; i: number; run: boolean }) {
  const v = useCountUp(it.value ?? 0, run, 2, i * 0.12);
  return (
    <div className="flex flex-col gap-4 text-center md:text-left">
      <p className="text-[14px] text-ink/65">{it.label}</p>
      <span className="font-head text-4xl font-semibold leading-none tracking-[-0.03em] text-ink md:text-5xl">
        <SrValue it={it} />
        <span aria-hidden className="tabular-nums">{it.text ?? <><span className="text-brand-strong">{it.prefix}</span>{group(v)}</>}</span>
      </span>
    </div>
  );
}

function Gallery({ full }: { full: boolean }) {
  const [i, setI] = useState(0);
  const go = (d: number) => setI((x) => (x + d + SLIDES.length) % SLIDES.length);
  const s = SLIDES[i];
  const arrow = "grid h-11 w-11 place-items-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur transition hover:bg-white";
  return (
    <figure className="relative overflow-hidden rounded-xl bg-ink lg:col-span-2" aria-roledescription="carrusel" aria-label="Trabajos de Unical">
      <div className="relative aspect-[4/3] max-h-[620px] w-full sm:aspect-[16/11] lg:h-full lg:min-h-[520px] lg:aspect-auto">
        <AnimatePresence initial={false}>
          <motion.img key={s.src} src={s.src} alt={s.alt} loading="lazy" decoding="async"
            initial={full ? { opacity: 0, scale: 1.04 } : false} animate={{ opacity: 1, scale: 1 }} exit={full ? { opacity: 0 } : undefined}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-full w-full object-cover" />
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 to-transparent" aria-hidden />
      </div>
      <figcaption className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-medium text-ink backdrop-blur sm:left-5 sm:top-5" aria-live="polite">
        <span className="mr-2 font-mono tabular-nums text-ink/50">{pad(i + 1)}/{pad(SLIDES.length)}</span>{s.cap}
      </figcaption>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
        <div className="flex gap-2 max-sm:hidden" role="group" aria-label="Elegir imagen">
          {SLIDES.map((t, k) => (
            <button key={t.src} type="button" onClick={() => setI(k)} aria-pressed={k === i} aria-label={t.cap}
              className={cn("h-12 w-16 overflow-hidden rounded-md ring-2 transition", k === i ? "ring-white" : "opacity-60 ring-transparent hover:opacity-100")}>
              <img src={t.src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          <button type="button" className={arrow} onClick={() => go(-1)} aria-label="Imagen anterior"><ChevronLeft className="h-5 w-5" /></button>
          <button type="button" className={arrow} onClick={() => go(1)} aria-label="Imagen siguiente"><ChevronRight className="h-5 w-5" /></button>
        </div>
      </div>
    </figure>
  );
}

export default function NumbersG() {
  const full = useFull();
  const panel = useRef<HTMLDivElement>(null);
  const run = useInViewOnce(panel, 0.3);

  return (
    <div className="bg-soft py-[var(--u-section-y)] text-ink">
      <div className="u-wrap">
        <div className="mb-14 grid gap-5 text-center md:grid-cols-2 md:items-end md:text-left">
          <div>
            <Eyebrow className="text-brand-strong" />
            <NumTitle className="mt-4 text-[clamp(2.1rem,4.4vw,3.8rem)] font-extrabold leading-[1] tracking-[-0.045em] text-ink" />
          </div>
          <p className="text-[1.02rem] leading-relaxed text-ink/65 md:max-w-[46ch] md:justify-self-end">{LEAD}</p>
        </div>

        <div className="grid gap-7 lg:grid-cols-3">
          <Gallery full={full} />
          <div className="flex flex-col gap-7 md:flex-row lg:flex-col">
            <div className="flex flex-col justify-between gap-6 rounded-xl bg-white p-7 ring-1 ring-ink/[.06] md:w-1/2 lg:w-auto">
              <Logo tone="dark" height={30} className="mr-auto" />
              <div>
                <p className="mb-2 font-head text-lg font-semibold text-ink">{PILLAR.title}</p>
                <p className="text-[15px] leading-relaxed text-ink/65">{PILLAR.text}</p>
              </div>
              <a href={why.cta.href} className="mr-auto inline-flex min-h-11 items-center gap-2 rounded-lg border border-ink/15 bg-white px-4 text-[14px] font-medium text-ink transition hover:border-brand-strong hover:text-brand-strong">
                {why.cta.label} <span aria-hidden>→</span>
              </a>
            </div>
            <a href={SECOND.href} className="group relative block min-h-[260px] grow basis-0 overflow-hidden rounded-xl md:w-1/2 lg:min-h-[220px] lg:w-auto">
              <img src={SECOND.img} alt={`${SECOND.title}: ${SECOND.kind}`} loading="lazy" decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-5 pt-14 text-[13px] font-medium text-white">
                {SECOND.title} <span className="text-white/65">· {SECOND.kind}</span>
              </span>
            </a>
          </div>
        </div>

        <div className="py-20 md:py-28">
          <p className="text-center text-[15px] text-ink/70">{clients.title}</p>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-5 text-ink/70">
            {LOGOS.map((c) => (
              <li key={c.name} className="transition-colors hover:text-ink"><ClientMark c={c} /></li>
            ))}
          </ul>
          <p className="mt-8 text-center text-[13px] text-ink/50"><strong className="font-semibold text-ink">{clients.foot}</strong> {clients.footText}</p>
        </div>

        <div ref={panel} className="relative overflow-hidden rounded-xl bg-white p-8 ring-1 ring-ink/[.06] sm:p-10 md:p-16">
          <div className="flex flex-col gap-4 text-center md:text-left">
            <p className="font-head text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-tight tracking-[-0.03em] text-ink">{EYEBROW}</p>
            <p className="mx-auto max-w-screen-sm text-ink/65 md:mx-0">{why.text}</p>
          </div>
          <div className="relative z-[1] mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:flex md:flex-wrap md:justify-between md:gap-10">
            {ITEMS.map((it, i) => <Stat key={it.label} it={it} i={i} run={run} />)}
          </div>
          <div aria-hidden className="pointer-events-none absolute -top-1 right-1 hidden h-full w-full bg-[linear-gradient(to_right,#16161F_1px,transparent_1px),linear-gradient(to_bottom,#16161F_1px,transparent_1px)] bg-[size:80px_80px] opacity-[.07] [mask-image:linear-gradient(to_bottom_right,#000,transparent,transparent)] md:block" />
        </div>
      </div>
    </div>
  );
}
