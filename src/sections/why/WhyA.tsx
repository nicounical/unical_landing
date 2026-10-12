/**
 * POR QUÉ A · Cinematic Premium — basado en 21st.dev «Scroll word reveal» (id 24525, Motion).
 * Del original se conserva: el texto se divide en palabras y cada una pasa de REST_OPACITY (0.15) a 1 dentro de su
 * ventana (getWordRange / getWordOpacity con REVEAL_SPAN 0.8 y WORD_WINDOW 0.2), progreso `useScroll` con offset
 * ["start start", "end end"] sobre un escenario `sticky`, barra de progreso vertical con scaleY y aria-label con el
 * texto completo (palabras aria-hidden).
 * Adaptación: el original usaba un contenedor con scroll propio; aquí se usa el scroll normal de la página (220vh,
 * sin secuestrar la rueda). El manifiesto real de Unical (titular + texto de site.ts) se revela sobre el showreel
 * real en bucle, con viñeteado cinematográfico; tras la escena, los cuatro pilares entran en una franja de créditos.
 * Sin movimiento completo: todo el texto visible a opacidad 1 sobre el póster del vídeo.
 */
import { Fragment, useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { videos, why } from "@/content/site";
import { Btn, Icon, SmartVideo } from "@/core/ui";
import { cn } from "@/lib/utils";
import { CTA, Eyebrow, PILLARS, TEXT, TITLE_PLAIN, useFull } from "./shared";

const REST_OPACITY = 0.15;
const REVEAL_SPAN = 0.8;
const WORD_WINDOW = 0.2;

function getWordRange(index: number, count: number) {
  const start = count <= 1 ? 0 : (index / (count - 1)) * REVEAL_SPAN;
  return { start, end: Math.min(1, start + WORD_WINDOW) };
}
function getWordOpacity(progress: number, { start, end }: { start: number; end: number }, rest = REST_OPACITY) {
  if (progress <= start) return rest;
  if (progress >= end) return 1;
  return rest + (1 - rest) * ((progress - start) / (end - start));
}

/** Palabras del titular (con la destacada marcada) seguidas de las del manifiesto: un único barrido continuo. */
type W = { t: string; em?: boolean };
const TITLE_WORDS: W[] = [
  ...why.titleA.trim().split(" ").map((t) => ({ t })),
  { t: why.titleEm, em: true },
  ...why.titleB.trim().split(" ").map((t) => ({ t })),
];
const TEXT_WORDS: W[] = TEXT.split(" ").map((t) => ({ t }));
const COUNT = TITLE_WORDS.length + TEXT_WORDS.length;

function Word({ w, progress, index }: { w: W; progress: MotionValue<number>; index: number }) {
  const range = getWordRange(index, COUNT);
  const opacity = useTransform(progress, (v) => getWordOpacity(v, range));
  return (
    <motion.span aria-hidden="true" style={{ opacity }} className={cn(w.em && "italic text-brand")}>{w.t}</motion.span>
  );
}

function Words({ list, offset, progress }: { list: W[]; offset: number; progress: MotionValue<number> | null }) {
  return (
    <>
      {list.map((w, i) => (
        <Fragment key={i}>
          {progress
            ? <Word w={w} progress={progress} index={offset + i} />
            : <span aria-hidden="true" className={cn(w.em && "italic text-brand")}>{w.t}</span>}
          {i < list.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

function Manifesto({ progress }: { progress: MotionValue<number> | null }) {
  return (
    <div className="relative max-w-[62rem]">
      <Eyebrow className="text-brand">{why.eyebrow}</Eyebrow>
      <h2 aria-label={TITLE_PLAIN} className="mt-6 max-w-[22ch] text-[clamp(1.9rem,4.4vw,3.9rem)] font-extrabold leading-[1.02] tracking-[-0.045em] text-white">
        <Words list={TITLE_WORDS} offset={0} progress={progress} />
      </h2>
      <p aria-label={TEXT} className="mt-8 max-w-[46ch] font-head text-[clamp(1.15rem,2.1vw,1.85rem)] font-semibold leading-[1.32] tracking-[-0.02em] text-white/95">
        <Words list={TEXT_WORDS} offset={TITLE_WORDS.length} progress={progress} />
      </p>
    </div>
  );
}

function Backdrop() {
  return (
    <div className="absolute inset-0" aria-hidden>
      <SmartVideo video={videos.showreel} className="absolute inset-0 h-full w-full scale-[1.04] object-cover" ariaLabel="" />
      <div className="absolute inset-0 bg-night/70" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_70%_40%,transparent_0%,rgba(17,17,31,.55)_55%,rgba(17,17,31,.95)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night to-transparent" />
    </div>
  );
}

function Pillars({ full }: { full: boolean }) {
  return (
    <div className="u-wrap relative pb-[var(--u-section-y)] pt-14 md:pt-20">
      <ol className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((p, i) => (
          <motion.li key={p.n} className="flex flex-col gap-4 bg-night p-6 md:p-8"
            initial={full ? { opacity: 0, y: 24 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}>
            <div className="flex items-center justify-between text-brand">
              <Icon name={p.icon} size={26} />
              <span className="font-mono text-[11px] tabular-nums tracking-[0.2em] text-white/45">{p.n}</span>
            </div>
            <h3 className="text-xl font-bold tracking-[-0.02em] text-white">{p.title}</h3>
            <p className="text-[0.95rem] leading-relaxed text-white/70">{p.text}</p>
            <p className="mt-auto pt-2 text-[11px] font-medium uppercase tracking-[0.16em] text-brand/80">{p.tags.join(" · ")}</p>
          </motion.li>
        ))}
      </ol>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
        <p className="max-w-[48ch] text-sm leading-relaxed text-white/60">Producción propia, diseño, instalación certificada y cobertura nacional: un único interlocutor de principio a fin.</p>
        <Btn href={CTA.href} kind="light" magnetic>{CTA.label} <span aria-hidden>→</span></Btn>
      </div>
    </div>
  );
}

function StaticView() {
  return (
    <div className="bg-night text-white">
      <div className="relative overflow-hidden">
        <Backdrop />
        <div className="u-wrap relative py-[var(--u-section-y)]">
          <Manifesto progress={null} />
        </div>
      </div>
      <Pillars full={false} />
    </div>
  );
}

export default function WhyA() {
  const full = useFull();
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  if (!full) return <StaticView />;

  return (
    <div className="bg-night text-white">
      <div ref={track} className="relative h-[220vh]">
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
          <Backdrop />
          <div className="u-wrap relative flex w-full gap-6 md:gap-12">
            <div className="relative hidden w-px shrink-0 self-stretch bg-white/15 sm:block" aria-hidden>
              <motion.span className="absolute inset-0 origin-top bg-brand" style={{ scaleY: scrollYProgress }} />
            </div>
            <Manifesto progress={scrollYProgress} />
          </div>
          <p className="absolute bottom-6 right-[var(--u-gutter)] hidden font-mono text-[10px] uppercase tracking-[0.24em] text-white/40 md:block" aria-hidden>
            {videos.showreel.label}
          </p>
        </div>
      </div>
      <Pillars full />
    </div>
  );
}
