/**
 * REEL C · Experimental Creative — basado en 21st.dev «Interactive Video Player» (id 28516, Skiper67).
 * Del original se conserva: vídeo en bucle silenciado con una etiqueta «Play» que sigue al cursor con muelle
 * (useSpring mass 0.1 sobre x/y/opacity, mix-blend-exclusion), clic → pop-over a pantalla completa con fondo
 * desenfocado y el reproductor que se abre con un clip-path desde el centro (inset 43.5 % … → inset 0, spring
 * 100/20) y se cierra a la inversa, con el aspa «+» girada 45° para cerrar y la barra de control en exclusion.
 * Adaptación: en lugar de un único vídeo, un mosaico asimétrico con el showreel y las piezas de `reel.items`:
 * el showreel se reproduce solo (silenciado, solo en pantalla) y el resto se previsualiza al pasar el cursor
 * (en táctil o modo estático se ve el póster). media-chrome se sustituye por el ReelPlayer de la landing (play/pausa,
 * sonido bajo demanda, barra navegable, pantalla completa). El modal añade Esc, trampa de foco, devolución del foco
 * y bloqueo de scroll. Las piezas sin vídeo (`placeholder`) no son botones: se etiquetan como «Fotografía».
 */
import { useEffect, useState } from "react";
import { motion, useSpring } from "motion/react";
import { Play, Plus } from "lucide-react";
import { finePointer } from "@/core/env";
import { Pending, SmartVideo } from "@/core/ui";
import { cn } from "@/lib/utils";
import { ReelPlayer } from "./ReelPlayer";
import { ALL, EYEBROW, Eyebrow, LEAD, ReelModal, hasVideo, pad, useFull, type Entry } from "./shared";

/** Huecos del mosaico (12 columnas, flujo denso). */
const SPAN: Record<string, string> = {
  showreel: "col-span-2 md:col-span-8 md:row-span-2",
  panther: "md:col-span-4",
  rx: "md:col-span-4",
  es: "row-span-2 md:col-span-3 md:row-span-2",
  cirsa: "md:col-span-5",
  stands: "md:col-span-4",
  corporeos: "md:col-span-3",
  "gran-formato": "md:col-span-3",
  espacios: "col-span-2 md:col-span-3",
};
const ORDER = ["showreel", "panther", "rx", "es", "cirsa", "stands", "corporeos", "gran-formato", "espacios"];
const TILES = ORDER.map((id) => ALL.find((e) => e.id === id)!).filter(Boolean);

function Tile({ e, i, full, hover, onOpen }: { e: Entry; i: number; full: boolean; hover: boolean; onOpen: (e: Entry) => void }) {
  const [over, setOver] = useState(false);
  const x = useSpring(0, { mass: 0.1 }), y = useSpring(0, { mass: 0.1 }), opacity = useSpring(0, { mass: 0.1 });
  const video = hasVideo(e);
  const live = full && video && (e.main || (hover && over));
  const caption = (
    <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/75 to-transparent p-3 pt-10 text-left md:p-4 md:pt-14">
      <span>
        <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">{pad(i + 1)} · {e.cat}</span>
        <span className={cn("mt-1 block font-head font-semibold leading-tight tracking-[-0.02em] text-white", e.main ? "text-[clamp(1.2rem,2.4vw,2rem)]" : "text-[0.95rem] md:text-[1.05rem]")}>{e.title}</span>
      </span>
      {video && !hover && <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-ink" aria-hidden><Play className="h-3.5 w-3.5 fill-current" /></span>}
    </span>
  );

  if (!video) {
    return (
      <li className={cn("relative overflow-hidden rounded-lg bg-ink", SPAN[e.id])}>
        <img src={e.img} alt={`${e.title} · ${e.cat}`} loading="lazy" decoding="async" className="h-full w-full object-cover opacity-80 saturate-[.85]" />
        <span className="absolute right-3 top-3"><PhotoTag /></span>
        <Pending>Vídeo pendiente</Pending>
        {caption}
      </li>
    );
  }

  return (
    <li className={cn("relative", SPAN[e.id])}>
      <button type="button" aria-label={`Reproducir ${e.title} (${e.cat})`} aria-haspopup="dialog"
        onClick={() => onOpen(e)}
        onMouseEnter={() => setOver(true)}
        onMouseMove={(ev) => { if (!hover) return; opacity.set(1); const b = ev.currentTarget.getBoundingClientRect(); x.set(ev.clientX - b.left); y.set(ev.clientY - b.top); }}
        onMouseLeave={() => { setOver(false); opacity.set(0); }}
        className={cn("group relative block h-full w-full overflow-hidden rounded-lg bg-ink", hover && "cursor-none")}>
        {live
          ? <SmartVideo video={e.video} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
          : <img src={e.img} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />}
        {hover && (
          <motion.span style={{ x, y, opacity }} aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-20 -ml-9 -mt-4 flex w-fit select-none items-center gap-2 p-2 text-sm font-medium text-white mix-blend-exclusion">
            <Play className="h-4 w-4 fill-white" /> Reproducir
          </motion.span>
        )}
        {caption}
      </button>
    </li>
  );
}

const PhotoTag = () => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85 backdrop-blur">Fotografía</span>
);

export default function ReelC() {
  const full = useFull();
  const [hover, setHover] = useState(() => finePointer());
  const [cur, setCur] = useState<Entry | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const on = (e: MediaQueryListEvent) => setHover(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const close = () => setCur(null);
  const vertical = Boolean(cur?.vertical);
  const clipFrom = "inset(43.5% 43.5% 33.5% 43.5%)";

  return (
    <div className="bg-paper py-[var(--u-section-y)] text-ink">
      <div className="u-wrap">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Eyebrow className="text-brand-strong" />
            <h2 className="mt-4 text-[clamp(2.6rem,7.4vw,7rem)] font-extrabold leading-[.88] tracking-[-0.055em] text-ink">
              Lo hacemos <span className="u-hollow">realidad.</span>
            </h2>
          </div>
          <div className="md:col-span-4">
            <p className="text-base leading-relaxed text-ink/70">{LEAD}</p>
            <p className="mt-6 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-ink/45">
              <span className="h-10 w-px bg-gradient-to-b from-transparent to-ink/50" aria-hidden />
              {hover && full ? "Pasa el cursor para previsualizar · clic para ver" : "Toca una pieza para verla"}
            </p>
          </div>
        </div>

        <ul aria-label={`${EYEBROW}: piezas en vídeo y fotografía`} className="mt-12 grid auto-rows-[clamp(150px,44vw,220px)] grid-flow-dense grid-cols-2 gap-2 md:mt-16 md:auto-rows-[clamp(170px,16vw,250px)] md:grid-cols-12 md:gap-3">
          {TILES.map((e, i) => <Tile key={e.id} e={e} i={i} full={full} hover={hover && full} onOpen={setCur} />)}
        </ul>
      </div>

      <ReelModal open={Boolean(cur)} onClose={close} label={cur ? `${cur.title} · ${cur.cat}` : "Reproductor"} backdrop="bg-paper/80"
        className={cn("mx-auto", vertical ? "w-auto" : "max-w-7xl")}>
        {cur && hasVideo(cur) && (
          <motion.div className={cn("relative mx-auto", vertical ? "aspect-[9/16] h-[min(82vh,760px,calc((100vw-24px)*16/9))]" : "aspect-video w-full")}
            initial={full ? { clipPath: clipFrom, opacity: 0 } : { opacity: 0 }}
            animate={full ? { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 } : { opacity: 1 }}
            exit={full ? { clipPath: clipFrom, opacity: 0, transition: { duration: 1, type: "spring", stiffness: 100, damping: 20, opacity: { duration: 0.2, delay: 0.5 } } } : { opacity: 0 }}
            transition={{ duration: 1, type: "spring", stiffness: 100, damping: 20 }}>
            <ReelPlayer video={cur.video} eager className="h-full w-full" />
            <button type="button" onClick={close} aria-label="Cerrar reproductor" data-autofocus
              className="absolute right-2 top-2 z-10 grid h-11 w-11 place-items-center rounded-full text-white mix-blend-exclusion transition hover:bg-white/10">
              <Plus className="h-6 w-6 rotate-45" />
            </button>
            <p className="pointer-events-none absolute left-4 top-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white mix-blend-exclusion">{cur.cat} — {cur.title}</p>
          </motion.div>
        )}
      </ReelModal>
    </div>
  );
}
