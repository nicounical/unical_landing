/**
 * REEL G · Interactive Gallery — basado en 21st.dev «Gallery Modal Accordion» (id 24830).
 * Del original se conserva: tira de miniaturas en acordeón donde la activa se ensancha (transition-[width]
 * 300 ms ease-in-out) y las demás quedan como lamas estrechas, activación al pasar el cursor, clic → modal con fondo
 * desenfocado en el que la miniatura «crece» hasta la tarjeta grande (equivalente al layoutId compartido), tarjeta
 * con artículo inferior cuyo título entra con scaleY 0.2 → 1 y el texto con y −10 → 0 (delay 0.2), cierre con Esc
 * o clic fuera y bloqueo del scroll del body mientras está abierto.
 * Adaptación: las fotos de paisaje se sustituyen por el showreel y las piezas de `reel.items`; la miniatura activa
 * reproduce su vídeo en silencio (solo en pantalla) y el modal contiene el ReelPlayer (play/pausa, sonido bajo
 * demanda, barra navegable, pantalla completa). Las piezas sin vídeo abren su fotografía con una nota honesta.
 * El layoutId se sustituye por un FLIP manual (rect de la miniatura → tarjeta) para no animar el layout de toda la
 * tira en cada hover. Ancho por flex-grow (fluido a cualquier ancho); en móvil el acordeón es vertical. Teclado:
 * foco = activa, flechas para moverse, Enter abre; el modal atrapa el foco y lo devuelve. next/image → <img>.
 */
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Pending, SmartVideo } from "@/core/ui";
import { cn } from "@/lib/utils";
import { ReelPlayer } from "./ReelPlayer";
import { ALL, CloseBtn, EYEBROW, Eyebrow, LEAD, ReelModal, TITLE, hasVideo, pad, useFull, type Entry } from "./shared";

type Rect = { x: number; y: number; w: number; h: number };

/** Tamaño final de la tarjeta del modal (para el FLIP). */
function target(e: Entry): Rect {
  const vw = window.innerWidth, vh = window.innerHeight;
  const ratio = e.vertical ? 9 / 16 : 16 / 9;
  let w = Math.min(vw - 24, 1100), h = w / ratio;
  const maxH = vh * 0.72;
  if (h > maxH) { h = maxH; w = h * ratio; }
  return { x: vw / 2, y: vh / 2, w, h };
}

export default function ReelG() {
  const full = useFull();
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState<Rect | null>(null);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  const e = ALL[index];

  const rectOf = (i: number): Rect | null => {
    const r = thumbs.current[i]?.getBoundingClientRect();
    return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height } : null;
  };
  const show = (i: number) => { setIndex(i); setFrom(rectOf(i)); setOpen(true); };
  const close = () => setOpen(false);
  const onKey = (ev: React.KeyboardEvent, i: number) => {
    const next = ev.key === "ArrowRight" || ev.key === "ArrowDown" ? i + 1 : ev.key === "ArrowLeft" || ev.key === "ArrowUp" ? i - 1 : null;
    if (next === null) return;
    ev.preventDefault();
    const n = (next + ALL.length) % ALL.length;
    setIndex(n);
    thumbs.current[n]?.focus();
  };

  const t = typeof window !== "undefined" ? target(e) : null;
  const flip = (r: Rect | null) => (full && r && t ? { x: r.x - t.x, y: r.y - t.y, scaleX: r.w / t.w, scaleY: r.h / t.h, opacity: 0.6 } : { opacity: 0, scale: 0.96 });

  return (
    <div className="bg-night py-[var(--u-section-y)] text-white">
      <div className="u-wrap">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Eyebrow className="text-brand" />
            <h2 className="mt-4 text-[length:var(--u-h2)] font-extrabold leading-[.98] tracking-[-0.045em] text-white">{TITLE}</h2>
          </div>
          <p className="max-w-[46ch] text-base leading-relaxed text-white/70 md:col-span-5">{LEAD}</p>
        </div>

        {/* Acordeón */}
        <ul className="mt-12 flex h-[74svh] max-h-[640px] min-h-[520px] flex-col gap-1 md:mt-16 md:h-[min(62vh,560px)] md:min-h-[380px] md:flex-row md:gap-2" aria-label={`${EYEBROW}: galería`}>
          {ALL.map((it, i) => {
            const on = i === index, vid = hasVideo(it);
            return (
              <li key={it.id} className={cn("relative min-h-[44px] min-w-0 md:min-w-[24px]", full && "transition-[flex-grow] duration-300 ease-in-out")} style={{ flexGrow: on ? 9 : 1, flexBasis: 0 }}>
                <motion.button ref={(el) => { thumbs.current[i] = el; }} type="button" whileTap={full ? { scale: 0.97 } : undefined}
                  onMouseEnter={() => setIndex(i)} onFocus={() => setIndex(i)} onClick={() => show(i)} onKeyDown={(ev) => onKey(ev, i)}
                  aria-label={`${it.title} · ${it.cat}${vid ? " · ver vídeo" : " · ver fotografía"}`} aria-haspopup="dialog"
                  className={cn("group relative block h-full w-full overflow-hidden rounded-xl bg-ink md:rounded-2xl", on && "ring-1 ring-white/25")}>
                  {on && vid && full
                    ? <SmartVideo video={it.video} className={cn("absolute inset-0 h-full w-full", it.vertical ? "object-contain" : "object-cover")} />
                    : <img src={it.img} alt="" loading="lazy" decoding="async" className={cn("absolute inset-0 h-full w-full object-cover transition-[filter,opacity] duration-300", !on && "opacity-70 grayscale-[.4] group-hover:opacity-90")} />}
                  {on && vid && full && it.vertical && <img src={it.img} alt="" aria-hidden className="absolute inset-0 -z-0 h-full w-full scale-110 object-cover opacity-50 blur-2xl" />}
                  <span className={cn("pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-300", on ? "opacity-100" : "opacity-60")} aria-hidden />
                  {/* Lama plegada: número */}
                  <span className={cn("pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[11px] tabular-nums text-white/80 transition-opacity md:left-1/2 md:top-auto md:bottom-4 md:-translate-x-1/2 md:translate-y-0", on ? "opacity-0" : "opacity-100")} aria-hidden>{pad(i + 1)}</span>
                  {/* Activa: título */}
                  <span className={cn("pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-left transition-[opacity,transform] duration-300 md:p-6", on ? "translate-y-0 opacity-100 delay-150" : "translate-y-2 opacity-0")} aria-hidden>
                    <span className="min-w-0">
                      <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-brand">{pad(i + 1)} · {it.cat}</span>
                      <span className="mt-1 block truncate font-head text-[clamp(1.15rem,2.4vw,2rem)] font-semibold leading-tight tracking-[-0.03em] text-white">{it.title}</span>
                    </span>
                    <span className="shrink-0 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">{vid ? "Ver vídeo" : "Fotografía"}</span>
                  </span>
                  {!vid && on && <Pending>Vídeo pendiente</Pending>}
                </motion.button>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-xs text-white/45">{full ? "Pasa el cursor o usa las flechas para recorrer la galería; pulsa para abrir." : "Pulsa una pieza para abrirla."}</p>
      </div>

      <ReelModal open={open} onClose={close} label={`${e.title} · ${e.cat}`} backdrop="bg-black/50"
        className={cn("mx-auto", e.vertical ? "max-w-[min(440px,100%)]" : "max-w-[1100px]")}>
        <motion.div initial={flip(from)} animate={{ x: 0, y: 0, scaleX: 1, scaleY: 1, scale: 1, opacity: 1 }} exit={flip(from)}
          transition={{ type: "spring", stiffness: 260, damping: 30 }} className="relative overflow-hidden rounded-2xl bg-ink shadow-2xl" style={{ transformOrigin: "50% 50%" }}>
          {hasVideo(e)
            ? <ReelPlayer video={e.video} eager className={cn("w-full", e.vertical ? "aspect-[9/16] max-h-[72vh]" : "aspect-video")} />
            : <div className="relative"><img src={e.img} alt={`${e.title} · ${e.cat}`} className="aspect-video max-h-[72vh] w-full object-cover" /><Pending>Vídeo pendiente</Pending></div>}
          <div className="absolute right-3 top-3 z-10"><CloseBtn onClose={close} className="bg-black/40" /></div>
        </motion.div>
        <motion.article className="mt-3 rounded-xl bg-white/10 p-4 text-white backdrop-blur-md md:p-5"
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, delay: 0.2 }}>
          <motion.h3 className="origin-top font-head text-xl font-semibold tracking-[-0.02em] text-white" initial={{ scaleY: 0.2 }} animate={{ scaleY: 1 }} exit={{ scaleY: 0.2 }} transition={{ duration: 0.2, delay: 0.2 }}>
            {e.title}
          </motion.h3>
          <p className="mt-1 text-sm text-white/70">
            {e.cat} · {hasVideo(e) ? e.video.label : "Esta pieza aún no tiene vídeo: se muestra la fotografía del trabajo."}
          </p>
        </motion.article>
      </ReelModal>
    </div>
  );
}
