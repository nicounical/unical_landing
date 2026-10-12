/**
 * PROCESO E · High-Energy Motion — basado en 21st.dev «Wizard Steps» (id 23576).
 * Del original se conserva: hook `useWizard` (índice, dirección 1/-1 calculada al cambiar, next/back/goTo, estado de
 * completado), etiqueta del paso actual con crossfade sobre el raíl, raíl clicable de baldosas numeradas que pasan a
 * check, segmentos que se rellenan con muelle (RAIL 520/40), navegación con flechas/Inicio/Fin y tabindex itinerante,
 * gestión de foco (raíl ↔ panel), región aria-live «Fase X de 4», panel de altura fija con transición sensible a la
 * dirección (AnimatePresence custom + variants enter/center/exit) y pantalla final «completado» con botón Atrás.
 * Adaptación: avance automático por las 4 fases reales (barra de tiempo en el panel) que se pausa con hover/foco,
 * fuera de pantalla o con el botón de pausa; tras el estado final vuelve a empezar. Todas las fases son clicables (el
 * autoplay ya las recorre). Energía: desplazamientos y skew mayores, numeral gigante cinético, foto que entra con
 * barrido y etiquetas escalonadas, fondo azul de marca. Estático: las 4 fases visibles en rejilla, sin autoplay.
 */
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { CTA, CtaLink, Eyebrow, LEAD, N, PHASES, PlayPause, TITLE, useFull } from "./shared";

const EXIT_EASE = [0.4, 0, 1, 1] as const;
const RAIL = { type: "spring", stiffness: 520, damping: 40, mass: 0.5 } as const;
const CROSSFADE = { type: "spring", stiffness: 260, damping: 34, mass: 0.8 } as const;
const DWELL = 5; // segundos por fase

type Dir = 1 | -1;

/** useWizard del original (versión no controlada) + estado de completado. */
function useWizard(total: number) {
  const [index, setIndex] = useState(0);
  const [complete, setComplete] = useState(false);
  const [seen, setSeen] = useState<{ index: number; complete: boolean; direction: Dir }>({ index: 0, complete: false, direction: 1 });
  if (seen.index !== index || seen.complete !== complete) {
    let forward: boolean;
    if (complete && !seen.complete) forward = true; // → pantalla final
    else if (seen.complete && !complete) forward = index === 0 && seen.index !== 0; // reinicio del autoplay = avanza
    else forward = index > seen.index;
    setSeen({ index, complete, direction: forward ? 1 : -1 });
  }
  const goTo = useCallback((to: number) => { setComplete(false); setIndex(Math.max(0, Math.min(total - 1, to))); }, [total]);
  const next = useCallback(() => { if (index >= total - 1) setComplete(true); else goTo(index + 1); }, [index, total, goTo]);
  const back = useCallback(() => { if (complete) setComplete(false); else goTo(index - 1); }, [complete, index, goTo]);
  return { index, complete, direction: seen.direction, goTo, next, back, isFirst: index === 0 && !complete, isLast: index === total - 1 };
}

const variants = {
  enter: (d: Dir) => ({ opacity: 0, x: d * 90, skewX: d * -6 }),
  center: { opacity: 1, x: 0, skewX: 0 },
  exit: (d: Dir) => ({ opacity: 0, x: d * -90, skewX: d * 6, transition: { duration: 0.18, ease: EXIT_EASE } }),
};

function Head() {
  return (
    <div className="grid items-end gap-6 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <Eyebrow className="text-white/80" />
        <h2 className="mt-4 max-w-[13ch] font-head text-[length:var(--u-h2)] font-black uppercase italic leading-[.92] tracking-[-0.04em] text-white">{TITLE}</h2>
      </div>
      <p className="max-w-[46ch] text-[1.02rem] leading-relaxed text-white/80 lg:col-span-5">{LEAD}</p>
    </div>
  );
}

function StaticView() {
  return (
    <div className="bg-brand-strong py-[var(--u-section-y)] text-white">
      <div className="u-wrap">
        <Head />
        <ol className="mt-12 grid gap-5 md:grid-cols-2">
          {PHASES.map((p) => (
            <li key={p.n} className="overflow-hidden rounded-2xl bg-brand-deep">
              <img src={p.img} alt={p.alt} loading="lazy" className="aspect-[16/9] w-full object-cover" />
              <div className="p-6">
                <p className="font-mono text-xs tracking-[0.2em] text-brand">{p.n}</p>
                <h3 className="mt-1 text-2xl font-extrabold uppercase italic tracking-[-0.02em] text-white">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-white/80">{p.text}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-white/60">{p.tags.join(" · ")}</p>
              </div>
            </li>
          ))}
        </ol>
        <CtaLink className="mt-10 text-white" />
      </div>
    </div>
  );
}

function Panel({ i }: { i: number }) {
  const p = PHASES[i];
  return (
    <div className="grid h-full md:grid-cols-[1.05fr_1fr]">
      <div className="relative h-[200px] overflow-hidden md:h-full">
        <motion.img src={p.img} alt={p.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover"
          initial={{ clipPath: "inset(0 100% 0 0)", scale: 1.25 }} animate={{ clipPath: "inset(0 0% 0 0)", scale: 1 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} />
        <motion.span className="absolute -bottom-4 left-3 font-head text-[clamp(6rem,14vw,11rem)] font-black italic leading-none tracking-[-0.06em] text-white mix-blend-overlay"
          initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }} aria-hidden>{p.n}</motion.span>
      </div>
      <div className="flex flex-col justify-center p-6 md:p-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-strong">Fase {p.n} / 0{N}</p>
        <motion.h3 className="mt-3 text-[clamp(2rem,4vw,3.4rem)] font-black uppercase italic leading-[.92] tracking-[-0.04em] text-ink"
          initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.08 }}>{p.title}</motion.h3>
        <p className="mt-4 max-w-[40ch] text-[1rem] leading-relaxed text-charcoal">{p.text}</p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Incluye">
          {p.tags.map((t, k) => (
            <motion.li key={t} className="rounded-full bg-ink px-3 py-1.5 text-[12.5px] font-semibold text-white"
              initial={{ y: 16, opacity: 0, scale: 0.8 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 22, delay: 0.2 + k * 0.07 }}>{t}</motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ProcessE() {
  const full = useFull();
  const w = useWizard(N);
  const { index: at, complete, direction, goTo, next, back, isFirst, isLast } = w;
  const root = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const intent = useRef<"list" | "panel" | null>(null);
  const inView = useInView(root, { amount: 0.35 });
  const [paused, setPaused] = useState(false);
  const [hold, setHold] = useState(false);
  const running = full && inView && !paused && !hold;
  const t = useMotionValue(0);
  const timeW = useTransform(t, (v) => `${v * 100}%`);

  // foco como en el original
  useEffect(() => {
    const move = intent.current;
    intent.current = null;
    if (move === "list") listRef.current?.querySelector<HTMLButtonElement>('button[data-current="true"]')?.focus();
    else if (move === "panel") viewportRef.current?.focus({ preventScroll: true });
  }, [at, complete]);

  // reinicia el temporizador al cambiar de fase
  useEffect(() => { t.set(0); }, [at, complete, t]);

  // autoplay
  useEffect(() => {
    if (!running) return;
    const ctrl = animate(t, 1, {
      duration: DWELL * (1 - t.get()), ease: "linear",
      onComplete: () => { if (complete) goTo(0); else next(); },
    });
    return () => ctrl.stop();
  }, [running, at, complete, t, next, goTo]);

  if (!full) return <StaticView />;

  const onKey = (e: KeyboardEvent<HTMLElement>) => {
    let target = at;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") target = at + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") target = at - 1;
    else if (e.key === "Home") target = 0;
    else if (e.key === "End") target = N - 1;
    else return;
    e.preventDefault();
    target = Math.max(0, Math.min(N - 1, target));
    if (target === at && !complete) return;
    intent.current = "list";
    goTo(target);
  };

  const step = PHASES[at];
  const position = complete ? "Proceso completo" : `Fase ${at + 1} de ${N}: ${step.title}`;

  return (
    <div ref={root} className="relative isolate overflow-hidden bg-brand-strong py-[var(--u-section-y)] text-white">
      {/* rayas de velocidad */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12] [background-image:repeating-linear-gradient(115deg,#fff_0_2px,transparent_2px_46px)]" aria-hidden />
      <div className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[520px] w-[520px] rounded-full bg-brand/40 blur-[120px]" aria-hidden />
      <div className="u-wrap">
        <Head />

        <div className="mt-12 md:mt-16" onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)}
          onFocus={() => setHold(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHold(false); }}>
          <p aria-live="polite" className="sr-only">{position}</p>
          <div className="mb-3 flex items-end justify-between gap-4">
            <span aria-hidden className="grid select-none font-head text-lg font-bold uppercase italic tracking-[-0.01em] text-white md:text-xl">
              {[...PHASES.map((s) => s.title), "Llave en mano"].map((label, i) => (
                <motion.span key={label} className="col-start-1 row-start-1 truncate" initial={false}
                  animate={{ opacity: (complete ? i === N : i === at) ? 1 : 0, y: (complete ? i === N : i === at) ? 0 : 8 }} transition={CROSSFADE}>{label}</motion.span>
              ))}
            </span>
            <button type="button" onClick={() => setPaused((v) => !v)} aria-pressed={paused} aria-label={paused ? "Reanudar avance automático" : "Pausar avance automático"}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/30 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-white/10">
              <PlayPause paused={paused} /> <span className="hidden sm:inline">{paused ? "Reanudar" : "Pausar"}</span>
            </button>
          </div>

          <ol ref={listRef} aria-label="Fases del proceso" className="mb-5 flex list-none items-center gap-1.5 p-0">
            {PHASES.map((s, i) => {
              const done = complete || i < at;
              const here = !complete && i === at;
              return (
                <li key={s.n} className="flex flex-1 items-center gap-1.5 last:flex-none">
                  <button type="button" data-current={here || (complete && i === N - 1) ? "true" : undefined}
                    tabIndex={here || (complete && i === N - 1) ? 0 : -1} aria-current={here ? "step" : undefined}
                    aria-label={`Fase ${i + 1} de ${N}: ${s.title}`} onKeyDown={onKey}
                    onClick={() => { if (here) return; intent.current = "list"; goTo(i); }}
                    className="rounded-[12px] outline-none focus-visible:shadow-[0_0_0_2px_#fff]">
                    <motion.span aria-hidden initial={false} animate={{ scale: here ? 1 : 0.88, rotate: here ? -4 : 0 }} transition={RAIL}
                      className={cn("grid h-11 w-11 place-items-center rounded-[12px] border-2 font-head text-[15px] font-bold tabular-nums transition-colors duration-150",
                        done ? "border-white bg-white text-brand-strong" : here ? "border-white bg-ink text-white" : "border-white/35 bg-transparent text-white/70")}>
                      {done ? (
                        <svg width="16" height="16" viewBox="0 0 256 256" fill="none" aria-hidden><polyline points="216 72 104 184 48 128" stroke="currentColor" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      ) : i + 1}
                    </motion.span>
                  </button>
                  {i < N - 1 && (
                    <span aria-hidden className="relative h-[4px] flex-1 overflow-hidden rounded-full bg-white/20">
                      <motion.span className="absolute inset-0 origin-left rounded-full bg-white" initial={false} animate={{ scaleX: complete || i < at ? 1 : 0 }} transition={RAIL} />
                    </span>
                  )}
                </li>
              );
            })}
          </ol>

          <div ref={viewportRef} tabIndex={-1} role="group" aria-label={position}
            className="relative h-[600px] overflow-hidden rounded-[22px] bg-white shadow-[0_40px_90px_-30px_rgba(10,20,40,.7)] outline-none focus-visible:shadow-[0_0_0_3px_#99C4E4] sm:h-[560px] md:h-[440px]">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div key={complete ? "__complete" : step.n} custom={direction} variants={variants} initial="enter" animate="center" exit="exit"
                transition={CROSSFADE} className="absolute inset-0 text-ink">
                {complete ? (
                  <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-strong">{N} / {N} fases</p>
                    <p className="font-head text-[clamp(2.4rem,6vw,4.4rem)] font-black uppercase italic leading-[.9] tracking-[-0.04em] text-ink">Llave en mano.</p>
                    <p className="text-[15px] text-ink/60">Vuelve atrás para revisar cualquier fase.</p>
                    <a href={CTA.href} className="mt-3 inline-flex min-h-[48px] items-center rounded-full bg-brand-strong px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-deep">{CTA.label}</a>
                  </div>
                ) : <Panel i={at} />}
              </motion.div>
            </AnimatePresence>
            {/* temporizador del autoplay */}
            <div className="absolute inset-x-0 bottom-0 z-10 h-1 bg-ink/10" aria-hidden>
              <motion.div className="h-full bg-brand-strong" style={{ width: timeW }} />
            </div>
          </div>

          <div className="mt-4 flex min-h-[48px] items-center gap-3">
            <AnimatePresence initial={false}>
              {isFirst ? null : (
                <motion.button key="back" type="button" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, transition: { duration: 0.12, ease: EXIT_EASE } }}
                  onClick={() => { intent.current = "panel"; back(); }}
                  className="inline-flex min-h-[48px] items-center rounded-full border-2 border-white/40 px-5 text-sm font-semibold text-white transition-colors hover:border-white">
                  Atrás
                </motion.button>
              )}
            </AnimatePresence>
            {!complete && (
              <button type="button" onClick={() => { if (!isLast) intent.current = "panel"; next(); }}
                className="ml-auto grid min-h-[48px] place-items-center rounded-full bg-white px-6 text-sm font-bold uppercase italic tracking-[0.02em] text-brand-strong transition-transform hover:scale-105">
                <span aria-hidden className="invisible col-start-1 row-start-1">Finalizar</span>
                <motion.span aria-hidden className="col-start-1 row-start-1" initial={false} animate={{ opacity: isLast ? 0 : 1 }} transition={CROSSFADE}>Siguiente</motion.span>
                <motion.span aria-hidden className="col-start-1 row-start-1" initial={false} animate={{ opacity: isLast ? 1 : 0 }} transition={CROSSFADE}>Finalizar</motion.span>
                <span className="sr-only">{isLast ? "Finalizar" : "Siguiente"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
