/**
 * PROCESO G · Interactive Gallery — basado en 21st.dev «Feature Section» / FeatureSteps (id 1368).
 * Del original se conserva: titular centrado, rejilla de dos columnas con la lista de pasos (opacidad atenuada en los
 * inactivos, círculo con check para los pasos ya vistos y número para los siguientes, el activo resaltado y escalado)
 * y el visor de imagen en el otro lado (encima en móvil) con AnimatePresence mode="wait" que entra con y + rotateX y
 * sale hacia arriba, degradado inferior sobre la foto, avance automático con progreso (autoPlayInterval) y bucle.
 * Adaptación: cada paso es un botón (clic/teclado) con su barra de progreso; el avance se pausa con hover/foco, fuera
 * de pantalla o con el botón de pausa; tira de miniaturas clicables bajo el visor; etiquetas reales de la fase sobre
 * la foto; next/image → <img loading="lazy">, check de texto → icono lucide. Estático: lista completa con fotos.
 */
import { useEffect, useRef, useState, type FocusEvent } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CtaLink, Eyebrow, LEAD, N, PHASES, PlayPause, TITLE, useFull } from "./shared";

const INTERVAL = 4.5; // segundos

function Head() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <Eyebrow className="justify-center text-brand-strong" />
      <h2 className="mt-4 text-[length:var(--u-h2)] font-extrabold leading-[.98] tracking-[-0.045em] text-ink">{TITLE}</h2>
      <p className="mx-auto mt-5 max-w-[56ch] text-[1.02rem] leading-relaxed text-charcoal/80">{LEAD}</p>
    </div>
  );
}

function StaticView() {
  return (
    <div className="bg-soft py-[var(--u-section-y)] text-ink">
      <div className="u-wrap">
        <Head />
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PHASES.map((p) => (
            <li key={p.n} className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_28px_rgba(26,26,46,.08)]">
              <img src={p.img} alt={p.alt} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              <div className="p-5">
                <p className="font-mono text-xs tracking-[0.2em] text-brand-strong">{p.n}</p>
                <h3 className="mt-1 text-xl font-bold tracking-[-0.02em] text-ink">{p.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-charcoal/80">{p.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex justify-center"><CtaLink className="text-brand-strong hover:text-brand-deep" /></div>
      </div>
    </div>
  );
}

export default function ProcessG() {
  const full = useFull();
  const [cur, setCur] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hold, setHold] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { amount: 0.35 });
  const progress = useMotionValue(0);
  const barW = useTransform(progress, (v) => `${v * 100}%`);
  const running = full && inView && !paused && !hold;

  useEffect(() => { progress.set(0); }, [cur, progress]);
  useEffect(() => {
    if (!running) return;
    const ctrl = animate(progress, 1, { duration: INTERVAL * (1 - progress.get()), ease: "linear", onComplete: () => setCur((c) => (c + 1) % N) });
    return () => ctrl.stop();
  }, [running, cur, progress]);

  if (!full) return <StaticView />;

  const p = PHASES[cur];
  const holdProps = {
    onPointerEnter: () => setHold(true),
    onPointerLeave: () => setHold(false),
    onFocus: () => setHold(true),
    onBlur: (e: FocusEvent<HTMLDivElement>) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHold(false); },
  };

  return (
    <div ref={root} className="bg-soft py-[var(--u-section-y)] text-ink">
      <div className="u-wrap">
        <Head />

        <div className="mt-12 flex flex-col gap-8 md:mt-16 md:grid md:grid-cols-2 md:gap-12" {...holdProps}>
          {/* Lista de pasos */}
          <div className="order-2 md:order-1">
            <ol className="space-y-2" aria-label="Fases del proceso">
              {PHASES.map((s, i) => {
                const active = i === cur;
                return (
                  <li key={s.n}>
                    <motion.button type="button" onClick={() => setCur(i)} aria-current={active ? "step" : undefined}
                      className={cn("relative flex w-full items-start gap-5 overflow-hidden rounded-2xl p-4 text-left transition-colors md:gap-6 md:p-5", active ? "bg-white shadow-[0_8px_28px_rgba(26,26,46,.08)]" : "hover:bg-white/60")}
                      initial={false} animate={{ opacity: active ? 1 : 0.55 }} transition={{ duration: 0.5 }}>
                      <span className={cn("mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-transform duration-300",
                        active ? "scale-110 border-brand-strong bg-brand-strong text-white" : "border-ink/30 bg-white text-ink")} aria-hidden>
                        {i < cur ? <Check className="h-5 w-5" strokeWidth={3} /> : <span className="text-base font-semibold">{i + 1}</span>}
                      </span>
                      <span className="flex-1">
                        <span className="block font-head text-xl font-semibold tracking-[-0.02em] text-ink md:text-2xl">{s.title}</span>
                        <span className="mt-1 block text-[0.95rem] leading-relaxed text-charcoal/85 md:text-base">{s.text}</span>
                      </span>
                      {active && (
                        <span className="absolute inset-x-0 bottom-0 h-[3px] bg-brand-tint" aria-hidden>
                          <motion.span className="block h-full bg-brand-strong" style={{ width: barW }} />
                        </span>
                      )}
                    </motion.button>
                  </li>
                );
              })}
            </ol>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 px-1">
              <button type="button" onClick={() => setPaused((v) => !v)} aria-pressed={paused}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ink/15 bg-white px-4 text-[13px] font-semibold text-ink transition-colors hover:border-ink/40">
                <PlayPause paused={paused} /> {paused ? "Reanudar" : "Pausar"} <span className="sr-only">avance automático</span>
              </button>
              <CtaLink className="text-brand-strong hover:text-brand-deep" />
            </div>
          </div>

          {/* Visor */}
          <div className="order-1 md:order-2">
            <div className="relative h-[260px] overflow-hidden rounded-2xl sm:h-[340px] lg:h-[440px]" style={{ perspective: 1200 }}>
              <AnimatePresence mode="wait">
                <motion.div key={cur} className="absolute inset-0 overflow-hidden rounded-2xl"
                  initial={{ y: 100, opacity: 0, rotateX: -20 }} animate={{ y: 0, opacity: 1, rotateX: 0 }} exit={{ y: -100, opacity: 0, rotateX: 20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}>
                  <img src={p.img} alt={p.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-soft via-soft/50 to-transparent" aria-hidden />
                  <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end gap-2 p-4 md:p-5">
                    <span className="mr-auto font-head text-[clamp(2.4rem,5vw,3.6rem)] font-extrabold leading-none tracking-[-0.05em] text-ink">{p.n}</span>
                    {p.tags.map((t) => <span key={t} className="rounded-full bg-white/90 px-3 py-1 text-[12px] font-semibold text-ink shadow-sm">{t}</span>)}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <ul className="mt-3 grid grid-cols-4 gap-2 md:gap-3" aria-label="Miniaturas de las fases">
              {PHASES.map((s, i) => (
                <li key={s.n}>
                  <button type="button" onClick={() => setCur(i)} aria-label={`Ver fase ${s.n}: ${s.title}`} aria-pressed={i === cur}
                    className={cn("relative block aspect-[4/3] w-full min-h-[44px] overflow-hidden rounded-xl ring-2 ring-offset-2 ring-offset-soft transition-all duration-300",
                      i === cur ? "ring-brand-strong" : "opacity-60 ring-transparent hover:opacity-100")}>
                    <img src={s.img} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
