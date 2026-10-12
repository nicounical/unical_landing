/**
 * PROCESO C · Experimental Creative — basado en 21st.dev «Animated Progress Stepper» (id 28558, Stepper03).
 * Del original se conserva: pista gris entre el 12,5 % y el 87,5 % con línea de progreso en muelle (scaleX, stiffness
 * 120 / damping 20), punto viajero que recorre la pista con su propio muelle (left = 12,5 + progreso · 75 %), botones
 * redondos clicables con anillo pulsante en el paso activo, icono → check con giro al completarse (AnimatePresence
 * mode="wait"), etiquetas que se encienden, panel de contenido con fundido vertical, botones Anterior / Siguiente y
 * contador «Fase X de 4».
 * Adaptación: las 4 fases reales con sus iconos; el punto viajero se estira según su velocidad (squash & stretch con
 * useVelocity), la foto de la fase se revela con un círculo que nace en la posición del punto, numeral gigante hueco y
 * etiquetas como «pegatinas» giradas que saltan con muelle. Navegación con flechas / Inicio / Fin sobre los pasos
 * (tabindex itinerante). Sin shadcn (Button/Separator → elementos propios). Estático: las 4 fases en lista, pista llena.
 */
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useMotionTemplate, useSpring, useTransform, useVelocity } from "motion/react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CtaLink, Eyebrow, LEAD, N, PHASES, TITLE, useFull } from "./shared";

const ROT = [-6, 4, -3, 7];

function Head() {
  return (
    <div className="grid items-end gap-6 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <Eyebrow className="text-brand-strong" />
        <h2 className="mt-4 max-w-[14ch] text-[length:var(--u-h2)] font-extrabold leading-[.96] tracking-[-0.05em] text-ink">{TITLE}</h2>
      </div>
      <p className="max-w-[46ch] text-[1.02rem] leading-relaxed text-charcoal/80 lg:col-span-5">{LEAD}</p>
    </div>
  );
}

function StaticView() {
  return (
    <div className="bg-white py-[var(--u-section-y)] text-ink">
      <div className="u-wrap">
        <Head />
        <div className="relative mt-12 h-1 rounded-full bg-brand-strong" aria-hidden />
        <ol className="mt-10 grid gap-10 md:grid-cols-2">
          {PHASES.map((p) => (
            <li key={p.n} className="grid grid-cols-[auto_1fr] gap-5">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-strong text-white" aria-hidden><Check className="h-5 w-5" strokeWidth={3} /></span>
              <div>
                <p className="font-mono text-xs tracking-[0.2em] text-brand-strong">{p.n}</p>
                <h3 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-ink">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-charcoal/80">{p.text}</p>
                <img src={p.img} alt={p.alt} loading="lazy" className="mt-4 aspect-[16/10] w-full rounded-2xl object-cover" />
              </div>
            </li>
          ))}
        </ol>
        <CtaLink className="mt-10 text-brand-strong hover:text-brand-deep" />
      </div>
    </div>
  );
}

export default function ProcessC() {
  const full = useFull();
  const [at, setAt] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const focusList = useRef(false);
  const progress = at / (N - 1);

  // punto viajero con muelle + estiramiento según velocidad
  const left = useSpring(12.5, { stiffness: 160, damping: 24 });
  useEffect(() => { left.set(12.5 + progress * 75); }, [progress, left]);
  const vel = useVelocity(left);
  const stretch = useTransform(vel, [-260, 0, 260], [3.2, 1, 3.2]);
  const leftCss = useMotionTemplate`${left}%`;

  useEffect(() => {
    if (!focusList.current) return;
    focusList.current = false;
    listRef.current?.querySelector<HTMLButtonElement>('button[aria-current="step"]')?.focus();
  }, [at]);

  if (!full) return <StaticView />;

  const go = (i: number) => setAt(Math.max(0, Math.min(N - 1, i)));
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    let t = at;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") t = at + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") t = at - 1;
    else if (e.key === "Home") t = 0;
    else if (e.key === "End") t = N - 1;
    else return;
    e.preventDefault();
    focusList.current = true;
    go(t);
  };

  const p = PHASES[at];

  return (
    <div className="relative overflow-hidden bg-white py-[var(--u-section-y)] text-ink">
      {/* trama de puntos experimental */}
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(46,108,160,.18)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_70%,transparent)]" aria-hidden />
      <div className="u-wrap relative">
        <Head />

        <div className="mt-12 rounded-[28px] border border-line bg-white/90 p-5 shadow-[0_30px_80px_-40px_rgba(26,26,46,.35)] backdrop-blur md:mt-16 md:p-10">
          {/* Stepper */}
          <div className="relative">
            <div className="absolute top-6 h-1 rounded-full bg-line md:top-7" style={{ left: "12.5%", right: "12.5%" }} aria-hidden />
            <motion.div className="absolute top-6 h-1 origin-left rounded-full bg-brand-strong md:top-7" style={{ left: "12.5%", right: "12.5%" }}
              initial={false} animate={{ scaleX: progress }} transition={{ type: "spring", stiffness: 120, damping: 20 }} aria-hidden />
            <motion.span className="absolute top-[26px] z-[5] h-3 w-3 rounded-full bg-brand shadow-[0_0_0_4px_rgba(153,196,228,.35)] md:top-[30px]"
              style={{ left: leftCss, x: "-50%", y: "-50%", scaleX: stretch }} aria-hidden />
            <ol ref={listRef} aria-label="Fases del proceso" className="relative flex items-start justify-between">
              {PHASES.map((s, i) => {
                const active = i === at;
                const done = i < at;
                const Ico = s.icon;
                return (
                  <li key={s.n} className="flex flex-1 flex-col items-center gap-3">
                    <button type="button" onClick={() => go(i)} onKeyDown={onKey} tabIndex={active ? 0 : -1}
                      aria-current={active ? "step" : undefined} aria-label={`Fase ${i + 1} de ${N}: ${s.title}${done ? " (completada)" : ""}`}
                      className="group relative z-10 flex h-12 w-12 items-center justify-center rounded-full md:h-14 md:w-14">
                      <span className={cn("absolute inset-0 rounded-full transition-colors duration-300", done || active ? "bg-brand-strong" : "bg-soft ring-1 ring-line group-hover:bg-brand-tint")} />
                      {active && (
                        <motion.span className="absolute inset-0 rounded-full ring-2 ring-brand-strong/50"
                          animate={{ scale: [1, 1.45, 1], opacity: [1, 0.2, 1] }} transition={{ duration: 2.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }} />
                      )}
                      <motion.span className="relative flex items-center justify-center" animate={{ scale: active ? 1.1 : 1 }} transition={{ type: "spring", stiffness: 320, damping: 18 }}>
                        <AnimatePresence mode="wait" initial={false}>
                          {done ? (
                            <motion.span key="check" initial={{ scale: 0, rotate: -90, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} exit={{ scale: 0, rotate: 90, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 400, damping: 22 }} className="flex text-brand">
                              <Check className="h-5 w-5" strokeWidth={3} />
                            </motion.span>
                          ) : (
                            <motion.span key="icon" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 400, damping: 22 }} className="flex">
                              <Ico className={cn("h-5 w-5", active ? "text-white" : "text-ink/50")} />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.span>
                    </button>
                    <span aria-hidden className={cn("hidden text-center text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-300 sm:block", active || done ? "text-ink" : "text-ink/45")}>{s.title}</span>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Contenido */}
          <div className="mt-10 grid items-center gap-8 md:mt-14 md:grid-cols-2 md:gap-12">
            <div className="relative min-h-[300px] md:min-h-[360px]" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div key={at} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.25 }}>
                  <div className="flex items-end gap-4">
                    <span className="u-hollow font-head text-[clamp(5rem,12vw,9.5rem)] font-black leading-[.8] tracking-[-0.06em] [-webkit-text-stroke-color:#2E6CA0]" aria-hidden>{p.n}</span>
                    <p className="pb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">Fase {at + 1} de {N}</p>
                  </div>
                  <h3 className="mt-5 text-[clamp(2rem,3.6vw,3rem)] font-extrabold leading-none tracking-[-0.045em] text-ink">{p.title}</h3>
                  <p className="mt-4 max-w-[42ch] text-[1.05rem] leading-relaxed text-charcoal/85">{p.text}</p>
                  <ul className="mt-6 flex flex-wrap gap-2.5" aria-label="Incluye">
                    {p.tags.map((t, k) => (
                      <motion.li key={t} className="rounded-md border-2 border-ink bg-brand px-3 py-1.5 text-[13px] font-semibold text-ink shadow-[3px_3px_0_#16161F]"
                        initial={{ scale: 0.4, opacity: 0, rotate: 0 }} animate={{ scale: 1, opacity: 1, rotate: ROT[(k + at) % ROT.length] }}
                        transition={{ type: "spring", stiffness: 420, damping: 14, delay: 0.15 + k * 0.08 }}>
                        {t}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-ink">
              <AnimatePresence initial={false}>
                <motion.img key={p.n} src={p.img} alt={p.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover"
                  initial={{ clipPath: `circle(0% at ${12.5 + progress * 75}% 0%)`, scale: 1.12 }}
                  animate={{ clipPath: `circle(150% at ${12.5 + progress * 75}% 0%)`, scale: 1 }}
                  exit={{ opacity: 1, transition: { duration: 0.9 } }}
                  transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }} />
              </AnimatePresence>
              <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-ink">{p.n} · {p.title}</span>
            </div>
          </div>

          <div className="mt-8 h-px bg-line" aria-hidden />
          <div className="mt-5 flex items-center justify-between gap-3">
            <button type="button" onClick={() => go(at - 1)} disabled={at === 0}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-line px-4 text-sm font-semibold text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-40">
              <ChevronLeft className="h-4 w-4" aria-hidden /> Anterior
            </button>
            <p className="hidden text-sm text-ink/55 sm:block">Fase {at + 1} de {N}</p>
            {at < N - 1 ? (
              <button type="button" onClick={() => go(at + 1)}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong">
                Siguiente <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            ) : (
              <CtaLink className="rounded-full bg-brand-strong px-5 text-white hover:bg-brand-deep" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
