/**
 * SECTORES A · Cinematic Premium — basado en 21st.dev «Hover Image Gallery» (id 2492, isaiahbjork).
 * Del original se conserva: la imagen visible cambia según la posición horizontal del puntero sobre el visor
 * (índice = floor(x / ancho · n), acotado) y el cursor propio de cristal esmerilado con los dos chevrones que sigue al
 * puntero (cursor-none + backdrop-blur), visible solo mientras se está encima.
 * Adaptación: visor a sangre completa y formato cinematográfico con las 8 fotos reales de sectores apiladas
 * (fundido + leve zoom en lugar del cambio seco de src), nombre del sector a gran escala con máscara, contador y una
 * barra segmentada cuyas 8 columnas coinciden con las zonas invisibles del visor. Alternativas al hover: en táctil se
 * arrastra el dedo en horizontal (touch-action: pan-y conserva el scroll vertical) o se pulsan los segmentos; con
 * teclado, los segmentos son botones con flechas ← →. Sin movimiento: cambio instantáneo y sin cursor propio.
 */
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { finePointer } from "@/core/env";
import { cn } from "@/lib/utils";
import { ArrowUR, CONTACT_URL, Eyebrow, ITEMS, LEAD, TITLE, pad, useFull } from "./shared";

const ease = [0.16, 1, 0.3, 1] as const;

export default function SectorsA() {
  const full = useFull();
  const cursorOk = full && finePointer();
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const down = useRef(false);
  const segs = useRef<(HTMLButtonElement | null)[]>([]);
  const s = ITEMS[index];

  const fromX = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    setPos({ x, y });
    const i = Math.max(0, Math.min(ITEMS.length - 1, Math.floor((x / r.width) * ITEMS.length)));
    setIndex(i);
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" || down.current) fromX(e);
  };

  const onSegKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    const to = e.key === "Home" ? 0 : e.key === "End" ? ITEMS.length - 1 : d ? (i + d + ITEMS.length) % ITEMS.length : null;
    if (to === null) return;
    e.preventDefault();
    setIndex(to);
    segs.current[to]?.focus();
  };

  return (
    <div className="bg-night pt-[var(--u-section-y)] text-white">
      <div className="u-wrap grid gap-6 pb-10 md:grid-cols-12 md:items-end md:pb-14">
        <div className="md:col-span-7">
          <Eyebrow className="text-brand" />
          <h2 className="mt-4 max-w-[16ch] text-[length:var(--u-h2)] font-extrabold leading-[.98] tracking-[-0.045em] text-white">{TITLE}</h2>
        </div>
        <div className="md:col-span-5">
          <p className="max-w-[46ch] text-base leading-relaxed text-white/70">{LEAD}</p>
          <a href={CONTACT_URL} className="group mt-6 inline-flex min-h-[44px] items-center gap-3 border-b border-white/30 text-sm font-semibold text-white transition-colors hover:border-brand hover:text-brand">
            Cuéntanos tu proyecto <ArrowUR className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>

      {/* Visor a sangre: la foto cambia con la posición horizontal del puntero */}
      <div
        className={cn("relative h-[min(86svh,860px)] min-h-[520px] w-full touch-pan-y select-none overflow-hidden bg-ink", cursorOk && "cursor-none")}
        onPointerMove={onMove}
        onPointerDown={(e) => { if (e.pointerType !== "mouse") { down.current = true; fromX(e); } }}
        onPointerUp={() => { down.current = false; }}
        onPointerCancel={() => { down.current = false; }}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") setHover(true); }}
        onPointerLeave={() => { setHover(false); down.current = false; }}
      >
        {ITEMS.map((it, i) => (
          <img key={it.name} src={it.img} alt={i === index ? it.alt : ""} aria-hidden={i !== index} loading="lazy" decoding="async" draggable={false}
            className={cn("absolute inset-0 h-full w-full object-cover",
              full && "transition-[opacity,transform] duration-700 ease-[cubic-bezier(.16,1,.3,1)]",
              i === index ? "scale-100 opacity-100" : "scale-[1.06] opacity-0")} />
        ))}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_40%,transparent_40%,rgba(10,10,20,.55)_100%)]" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-night via-night/60 to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-night/80 to-transparent" aria-hidden />

        {/* Rejilla guía: las 8 zonas del visor */}
        <div className="pointer-events-none absolute inset-0 hidden grid-cols-8 md:grid" aria-hidden>
          {ITEMS.map((it, i) => (
            <span key={it.name} className={cn("border-r border-white/[0.06] transition-colors duration-500 last:border-r-0", i === index && "bg-white/[0.035]")} />
          ))}
        </div>

        <div className="pointer-events-none absolute left-0 right-0 top-6 md:top-8">
          <div className="u-wrap flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-white/75">
            <span className="tabular-nums"><span className="text-white">{pad(index + 1)}</span> / {pad(ITEMS.length)}</span>
            <span className="hidden sm:inline">{cursorOk ? "Desliza el cursor" : "Desliza o elige un sector"}</span>
          </div>
        </div>

        {/* Nombre del sector a gran escala */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[96px] md:bottom-[120px]">
          <div className="u-wrap">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-brand">Sector {pad(index + 1)}</p>
            <div className="relative mt-2 overflow-hidden pb-[0.08em]" aria-live="polite">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p key={s.name}
                  initial={full ? { y: "100%", opacity: 0 } : false} animate={{ y: "0%", opacity: 1 }} exit={full ? { y: "-60%", opacity: 0 } : undefined}
                  transition={{ duration: 0.6, ease }}
                  className="font-head text-[clamp(2.6rem,9vw,8.5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-white">
                  {s.name}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Barra segmentada: alternativa táctil y de teclado */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="grid grid-cols-8 border-t border-white/15" role="group" aria-label="Elegir sector">
            {ITEMS.map((it, i) => {
              const on = i === index;
              return (
                <button key={it.name} ref={(el) => { segs.current[i] = el; }} type="button" aria-pressed={on} aria-label={it.name}
                  tabIndex={on ? 0 : -1} onClick={() => setIndex(i)} onFocus={() => setIndex(i)} onKeyDown={(e) => onSegKey(e, i)}
                  className={cn("group relative flex min-h-[64px] flex-col justify-end gap-1 px-2 pb-4 pt-3 text-left outline-none transition-colors md:min-h-[80px] md:px-4",
                    "focus-visible:bg-white/10", cursorOk && "cursor-none")}>
                  <span className="absolute inset-x-0 top-0 h-[2px] bg-white/0" aria-hidden>
                    <span className={cn("block h-full bg-brand", full && "transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]", on ? "scale-x-100" : "scale-x-0")} style={{ transformOrigin: "left" }} />
                  </span>
                  <span className={cn("font-mono text-[10px] tabular-nums tracking-[0.18em] transition-colors", on ? "text-brand" : "text-white/50")}>{pad(i + 1)}</span>
                  <span className={cn("hidden truncate text-[13px] font-medium transition-colors lg:block", on ? "text-white" : "text-white/55 group-hover:text-white/80")}>{it.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cursor de cristal con chevrones */}
        {cursorOk && hover && (
          <div className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2" style={{ left: pos.x, top: pos.y }} aria-hidden>
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/15 shadow-lg backdrop-blur-md">
              <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              <svg className="ml-1 h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
