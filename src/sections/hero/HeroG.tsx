/**
 * HERO G · Interactive Gallery — basado en 21st.dev «Hero Carousel» (filmstrip editorial, id 24752).
 * Una tira de fotogramas comparte el borde superior; la pieza activa se despliega a altura completa y
 * el fondo entero se re-tiñe con su color. Arrastre, teclado, clic y autoplay con pausa.
 * Adaptación: proyectos y servicios reales, acentos de la paleta de marca, H1 y CTAs fijos,
 * SIN captura de la rueda del ratón (el original la usaba y atrapaba el scroll de la página).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue } from "motion/react";
import { projects, services } from "@/content/site";
import { HeroCopy, HeroEyebrow, H1_LABEL, useFull } from "./shared";

type Item = { title: string; image: string; credit: string; accent: string; href: string };
const ACCENTS = ["#1E5076", "#2E6CA0", "#1A1A2E", "#3A3A39", "#99C4E4", "#24304a"];
const ITEMS: Item[] = [
  ...projects.items.slice(0, 5).map((p, i) => ({ title: p.title.replace(" · ", "\n"), image: p.img, credit: p.kind, accent: ACCENTS[i % ACCENTS.length], href: p.href })),
  ...services.items.map((s, i) => ({ title: `${s.title}\n${s.sub}`, image: s.img, credit: "Servicio", accent: ACCENTS[(i + 2) % ACCENTS.length], href: s.href })),
];

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

export default function HeroG() {
  const full = useFull();
  const stage = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 1200, h: 800 });
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const last = ITEMS.length - 1;
  const go = useCallback((n: number) => setIndex(clamp(n, 0, last)), [last]);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const read = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const fullH = clamp(box.h * 0.3, 110, 380), halfH = fullH / 2, cardW = fullH * 0.75;
  const gap = Math.max(4, Math.round(cardW * 0.038)), step = cardW + gap;
  const xFor = useCallback((i: number) => box.w / 2 - (i * step + cardW / 2), [box.w, step, cardW]);
  const x = useMotionValue(0);
  const spring = full ? { type: "spring" as const, stiffness: 260, damping: 34, mass: 0.9 } : { duration: 0 };

  useEffect(() => {
    if (dragging) return;
    const run = animate(x, xFor(index), spring);
    return () => run.stop();
  }, [index, dragging, xFor]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!full || paused || dragging) return;
    const id = window.setTimeout(() => go(index === last ? 0 : index + 1), 4200);
    return () => window.clearTimeout(id);
  }, [full, paused, dragging, index, last, go]);

  const active = ITEMS[index];
  const stripTop = box.w < 768 ? 62 : 56;
  const label = Math.max(10, Math.round(box.h * 0.012));

  return (
    <div ref={stage} tabIndex={0} role="group" aria-roledescription="carrusel" aria-label="Trabajos y servicios de Unical"
      onKeyDown={(e) => {
        const k: Record<string, number> = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: last };
        if (e.key in k) { e.preventDefault(); go(k[e.key]); }
      }}
      onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      className="relative h-[100svh] min-h-[640px] w-full select-none overflow-hidden bg-black text-white outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white/40">

      <AnimatePresence initial={false}>
        <motion.div key={index} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={full ? { duration: 0.7 } : { duration: 0 }}>
          <motion.img src={active.image} alt="" aria-hidden draggable={false} className="absolute inset-0 h-full w-full object-cover"
            initial={{ scale: full ? 1.4 : 1.28 }} animate={{ scale: 1.28 }} transition={full ? { duration: 6, ease: "linear" } : { duration: 0 }} />
          <div className="absolute inset-0" style={{ backgroundColor: active.accent, mixBlendMode: "color" }} />
          <div className="absolute inset-0 opacity-55" style={{ backgroundColor: active.accent, mixBlendMode: "multiply" }} />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-black/55" />

      {/* Marca + H1 + CTAs: siempre visibles, no dependen de la diapositiva */}
      <div className="u-wrap absolute inset-x-0 top-0 z-10 flex flex-wrap items-end justify-between gap-6 pt-28 md:pt-32">
        <div>
          <HeroEyebrow />
          <h1 aria-label={H1_LABEL} className="mt-3 text-[clamp(1.9rem,3.6vw,3.2rem)] font-extrabold leading-[.95] tracking-[-0.04em] text-white">
            <span aria-hidden>Producción visual <span className="text-brand">B2B.</span></span>
          </h1>
        </div>
        <HeroCopy lead={false} />
      </div>

      {/* Titular de la diapositiva, justo encima de la tira */}
      <div className="absolute inset-x-0 flex flex-col justify-end px-[var(--u-gutter)]" style={{ top: 0, height: `${stripTop}%`, paddingBottom: Math.round(box.h * 0.025) }}>
        <div className="flex w-full flex-wrap items-end gap-x-[6vw] gap-y-2">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.a key={index} href={active.href} className="font-head font-semibold leading-[0.9] tracking-[-0.03em] text-white"
              style={{ fontSize: Math.max(28, Math.round(Math.min(box.h * 0.07, box.w * 0.09))) }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.18 } }}>
              {active.title.split("\n").map((line, i) => (
                <span key={i} className="block overflow-hidden">
                  <motion.span className="block" initial={{ y: full ? "110%" : 0 }} animate={{ y: 0 }} transition={full ? { duration: 0.62, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] } : { duration: 0 }}>{line}</motion.span>
                </span>
              ))}
            </motion.a>
          </AnimatePresence>
          <motion.p key={`c-${index}`} className="font-mono uppercase tracking-[0.14em] text-white/80" style={{ fontSize: label }} initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>{active.credit}</motion.p>
        </div>
      </div>

      {/* Tira de fotogramas */}
      <div className="absolute inset-x-0" style={{ top: `${stripTop}%`, height: fullH }}>
        <motion.div className="flex items-start" style={{ gap, x, cursor: dragging ? "grabbing" : "grab" }}
          drag="x" dragMomentum={false} dragElastic={0.08} dragConstraints={{ left: xFor(last), right: xFor(0) }}
          onDragStart={() => setDragging(true)}
          onDragEnd={(_, info) => { setDragging(false); const thrown = x.get() + info.velocity.x * 0.12; go(Math.round((box.w / 2 - thrown - cardW / 2) / step)); }}>
          {ITEMS.map((it, i) => (
            <motion.button key={it.image} type="button" aria-label={it.title.replace(/\n/g, " ")} aria-current={i === index} onClick={() => go(i)}
              className="relative shrink-0 overflow-hidden bg-white/5" style={{ width: cardW }} animate={{ height: i === index ? fullH : halfH }} transition={spring}>
              <img src={it.image} alt="" draggable={false} loading={i < 6 ? "eager" : "lazy"} className="h-full w-full object-cover" style={{ objectPosition: "50% 35%" }} />
              <motion.span aria-hidden className="absolute inset-0 bg-black" animate={{ opacity: i === index ? 0 : 0.3 }} transition={spring} />
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Raíl de posición */}
      <div className="absolute left-[var(--u-gutter)] w-[min(220px,40vw)]" style={{ bottom: Math.max(18, box.h * 0.03) }}>
        <div className="flex justify-between font-mono tabular-nums text-white/80" style={{ fontSize: label }}>
          <span>{String(index + 1).padStart(2, "0")}</span><span>{String(ITEMS.length).padStart(2, "0")}</span>
        </div>
        <div className="relative mt-2 h-px w-full bg-white/25">
          <motion.div className="absolute inset-y-0 bg-brand" style={{ width: `${100 / ITEMS.length}%` }} animate={{ left: `${(index / ITEMS.length) * 100}%` }} transition={spring} />
        </div>
      </div>
      <p className="absolute bottom-6 right-[var(--u-gutter)] hidden text-[10px] font-semibold uppercase tracking-[0.24em] text-white/50 md:block">Arrastra · ← → · clic</p>
    </div>
  );
}
