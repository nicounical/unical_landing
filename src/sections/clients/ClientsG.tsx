/**
 * CLIENTES G · Interactive Gallery — basado en 21st.dev «Logo Clouds» (id 18216, LogoCloudSwap).
 * Del original se conserva: ola periódica que recorre todas las marcas con escalonado (0,11 s por pieza) y en cada
 * una hace un barrido `clipPath inset(0 0% 0 0) → inset(0 100% 0 0) → inset(0 0% 0 0)` con desenfoque 0→8→0 px y
 * opacidad 1→0,2→1 (0,92 s, tiempos [0, 0,4, 1], curvas easeIn / [0.16,1,0.3,1]); la ola termina cuando la última
 * pieza completa su animación; muelle al pasar el cursor (scale 1.07, stiffness 340, damping 24); icono + nombre por
 * pieza y rejilla de 3 columnas en móvil.
 * Adaptación: iconos de marcas de ejemplo → 25 clientes reales con su favicon real a tamaño nativo (o monograma
 * tipográfico si el favicon es de 16 px). Galería interactiva: cada pieza es un botón que destaca al cliente en un
 * panel con su nombre en grande; tras cada ola el panel avanza al siguiente cliente hasta que el usuario elige uno.
 * La ola se detiene al señalar o enfocar la rejilla y hay botón de pausa.
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { CLIENTS, Eyebrow, FOOT, FOOT_TEXT, LEAD, TITLE, hasIcon, initials, pad, useFull, type Client } from "./shared";

const WIPE_DURATION = 0.92;
const WIPE_TIMES = [0, 0.4, 1];
const STAGGER = 0.05;
const INTERVAL = 4200;

function Glyph({ c, size = "sm" }: { c: Client; size?: "sm" | "lg" }) {
  const box = size === "lg" ? "h-14 w-14 rounded-2xl" : "h-11 w-11 rounded-xl";
  return (
    <span className={cn("flex shrink-0 items-center justify-center border border-line bg-white shadow-[0_1px_2px_rgba(22,22,31,.05)]", box)} aria-hidden>
      {hasIcon(c)
        ? <img src={c.logo} alt="" width={24} height={24} loading="lazy" decoding="async" className="h-6 w-6 rounded-[5px] object-contain" />
        : <span className="font-head text-[13px] font-bold tracking-[-0.02em] text-ink/80">{initials(c.name)}</span>}
    </span>
  );
}

function Item({ c, i, waving, onDone, active, onPick, full }: { c: Client; i: number; waving: boolean; onDone: () => void; active: boolean; onPick: (i: number) => void; full: boolean }) {
  const body = (
    <>
      <Glyph c={c} />
      <span className={cn("max-w-full text-center text-[11px] font-medium leading-tight tracking-wide transition-colors sm:text-[12px]", active ? "text-ink" : "text-ink/60")}>{c.name}</span>
    </>
  );
  const cls = cn(
    "flex min-h-[44px] w-full flex-col items-center gap-2 rounded-2xl px-1 py-3 outline-none lg:py-6 transition-colors focus-visible:ring-2 focus-visible:ring-brand-strong",
    active ? "bg-brand-tint" : "hover:bg-soft",
  );
  if (!full) return <button type="button" className={cls} aria-pressed={active} onClick={() => onPick(i)}>{body}</button>;
  return (
    <motion.button type="button" className={cls} aria-pressed={active} onClick={() => onPick(i)} onFocus={() => onPick(i)}
      animate={waving
        ? { clipPath: ["inset(0 0% 0 0)", "inset(0 100% 0 0)", "inset(0 0% 0 0)"], filter: ["blur(0px)", "blur(8px)", "blur(0px)"], opacity: [1, 0.2, 1] }
        : { clipPath: "inset(0 0% 0 0)", filter: "blur(0px)", opacity: 1 }}
      transition={waving
        ? {
          clipPath: { duration: WIPE_DURATION, times: WIPE_TIMES, ease: ["easeIn", [0.16, 1, 0.3, 1]], delay: i * STAGGER },
          filter: { duration: WIPE_DURATION * 0.9, times: WIPE_TIMES, ease: "easeInOut", delay: i * STAGGER },
          opacity: { duration: WIPE_DURATION * 0.85, times: WIPE_TIMES, ease: "easeInOut", delay: i * STAGGER },
        }
        : { duration: 0.3, ease: "easeOut" }}
      onAnimationComplete={() => { if (waving && i === CLIENTS.length - 1) onDone(); }}
      whileHover={{ scale: 1.07, opacity: 1, filter: "blur(0px)", transition: { type: "spring", stiffness: 340, damping: 24 } }}>
      {body}
    </motion.button>
  );
}

function Feature({ i, full }: { i: number; full: boolean }) {
  const c = CLIENTS[i];
  const inner = (
    <div className="flex h-full flex-col justify-between gap-8">
      <div className="flex items-center justify-between">
        <Glyph c={c} size="lg" />
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">{pad(i + 1)} / {CLIENTS.length}</span>
      </div>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-strong">Cliente Unical</p>
        <p className="mt-3 font-head text-[clamp(2.2rem,4.4vw,4rem)] font-extrabold leading-[0.95] tracking-[-0.05em] text-ink [overflow-wrap:anywhere] [text-wrap:balance]">{c.name}</p>
      </div>
    </div>
  );
  return (
    <div className="relative min-h-[13rem] overflow-hidden rounded-[28px] border border-line bg-gradient-to-br from-soft to-brand-tint/70 p-6 sm:min-h-[15rem] sm:p-8" aria-live="polite">
      {full ? (
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={c.name} className="h-full min-h-[inherit]"
            initial={{ opacity: 0, filter: "blur(10px)", y: 14 }} animate={{ opacity: 1, filter: "blur(0px)", y: 0 }} exit={{ opacity: 0, filter: "blur(10px)", y: -14 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
            {inner}
          </motion.div>
        </AnimatePresence>
      ) : inner}
    </div>
  );
}

export default function ClientsG() {
  const full = useFull();
  const [active, setActive] = useState(0);
  const [picked, setPicked] = useState(false);
  const [waving, setWaving] = useState(false);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const running = full && !paused && !held;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setWaving(true);
      if (!picked) setActive((a) => (a + 1) % CLIENTS.length);
    }, INTERVAL);
    return () => clearInterval(id);
  }, [running, picked]);

  const pick = (i: number) => { setActive(i); setPicked(true); };

  return (
    <div className="bg-white py-[var(--u-section-y)] text-ink">
      <div className="u-wrap grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="flex flex-col gap-8 lg:col-span-5">
          <div>
            <Eyebrow className="text-brand-strong" />
            <h2 className="mt-5 text-[clamp(2.2rem,4.6vw,3.9rem)] font-extrabold leading-[0.98] tracking-[-0.045em] text-ink">{TITLE}</h2>
            <p className="mt-5 max-w-[46ch] text-[1.02rem] leading-relaxed text-ink/65">{LEAD}</p>
          </div>
          <Feature i={active} full={full} />
          <p className="text-sm text-ink/60"><strong className="font-head font-bold text-ink">{FOOT}</strong> {FOOT_TEXT}</p>
        </div>

        <div className="lg:col-span-7">
          <div className="mb-5 flex min-h-[44px] items-center justify-between gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">Elige un cliente</p>
            {full && (
              <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused}
                aria-label={paused ? "Reanudar la animación de la galería" : "Pausar la animación de la galería"}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-solid border-ink/20 px-5 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-strong">
                {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                {paused ? "Reanudar" : "Pausar"}
              </button>
            )}
          </div>
          <ul aria-label="Clientes" className="grid grid-cols-3 gap-1 sm:grid-cols-4 lg:grid-cols-5 lg:gap-2"
            onPointerEnter={(e) => { if (e.pointerType === "mouse") setHeld(true); }} onPointerLeave={() => setHeld(false)}
            onFocus={() => setHeld(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHeld(false); }}>
            {CLIENTS.map((c, i) => (
              <li key={c.name} className="flex">
                <Item c={c} i={i} waving={waving && full} onDone={() => setWaving(false)} active={active === i} onPick={pick} full={full} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
