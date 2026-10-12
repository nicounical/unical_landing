/**
 * REEL F · Editorial Kinetic — basado en 21st.dev «Interactive Video Portfolio Scroller» (id 24368).
 * Del original se conserva: contenedor alto con escenario `sticky` y un panel enmarcado (borde fino, sombra) con
 * raíl vertical de texto a la izquierda (writing-mode vertical), columna de títulos que se desplaza ITEM_HEIGHT por
 * índice (los pasados desaparecen, los siguientes al 30 %), pista de vídeos a la derecha que se desplaza
 * --video-height por índice con los inactivos escalados a 0.85, desenfocados y al 30 %, máscaras de degradado
 * (mask-y / mask-y-video), índice activo = round(progreso · (n − 1)) con el scroll de la ventana, clic en un título
 * → window.scrollTo a su posición, solo el vídeo activo se reproduce y el resto se pausa, y botón de sonido en el
 * vídeo activo que arranca silenciado.
 * Adaptación: 400vh → 300vh; sin pantalla de carga «Loading Experience» ni detección de iOS (SmartVideo ya gestiona
 * playsInline, carga diferida y versión móvil). Serif itálica → Poppins con contraste de peso (marca). Entradas
 * reales: showreel + `reel.items`; las piezas sin vídeo se muestran como fotografía etiquetada, sin controles.
 * Controles del vídeo activo: play/pausa, sonido (honesto: avisa de que no hay pista de audio) y «Ver en grande»,
 * que abre el ReelPlayer en modal (barra navegable y pantalla completa). Estático: índice editorial con miniaturas.
 */
import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { Icon, Pending, SmartVideo, type SmartVideoHandle } from "@/core/ui";
import { getLenis } from "@/core/scroll";
import { cn } from "@/lib/utils";
import { ReelPlayer } from "./ReelPlayer";
import { ALL, CloseBtn, EYEBROW, Eyebrow, NO_AUDIO, ReelModal, TITLE, hasVideo, pad, useFull, type Entry } from "./shared";

const CSS = `
.rf-mask-y{mask-image:linear-gradient(to bottom,transparent 0%,#000 18%,#000 72%,transparent 100%);-webkit-mask-image:linear-gradient(to bottom,transparent 0%,#000 18%,#000 72%,transparent 100%)}
.rf-mask-v{mask-image:linear-gradient(to bottom,transparent 0%,#000 15%,#000 85%,transparent 100%);-webkit-mask-image:linear-gradient(to bottom,transparent 0%,#000 15%,#000 85%,transparent 100%)}
.rf-track{--vh:clamp(170px,30svh,250px);--ih:48px}
@media (min-width:768px){.rf-track{--vh:min(400px,46svh);--ih:64px}}
`;
const ease = "ease-[cubic-bezier(0.25,1,0.5,1)]";

function Modal({ e, onClose }: { e: Entry | null; onClose: () => void }) {
  return (
    <ReelModal open={Boolean(e)} onClose={onClose} label={e ? `${e.title} · ${e.cat}` : "Reproductor"} backdrop="bg-paper/85" className={e?.vertical ? "max-w-[min(420px,100%)]" : "max-w-6xl"}>
      {e?.video && (
        <div>
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="font-head text-lg font-semibold tracking-[-0.02em] text-ink">{e.title} <span className="ml-2 text-sm font-normal text-ink/55">{e.cat}</span></p>
            <CloseBtn onClose={onClose} className="bg-ink text-white hover:bg-ink/80" />
          </div>
          <ReelPlayer video={e.video} eager className={cn("w-full overflow-hidden rounded-sm shadow-2xl", e.vertical ? "aspect-[9/16] max-h-[78vh]" : "aspect-video")} />
        </div>
      )}
    </ReelModal>
  );
}

const PhotoTag = () => (
  <span className="inline-flex items-center rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85 backdrop-blur">Fotografía</span>
);

function StaticView() {
  const [cur, setCur] = useState<Entry | null>(null);
  return (
    <div className="bg-paper py-[var(--u-section-y)] text-ink">
      <div className="u-wrap">
        <Eyebrow className="text-brand-strong" />
        <h2 className="mt-4 text-[length:var(--u-h2)] font-extrabold leading-[.98] tracking-[-0.045em]">{TITLE}</h2>
        <ol className="mt-12 border-t border-ink/15">
          {ALL.map((e, i) => (
            <li key={e.id} className="grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-b border-ink/15 py-4 md:grid-cols-[4rem_1fr_14rem_auto]">
              <span className="font-mono text-xs tabular-nums text-ink/50">{pad(i + 1)}</span>
              <span><span className="block font-head text-[clamp(1.1rem,2.2vw,1.7rem)] font-semibold tracking-[-0.03em]">{e.title}</span><span className="text-xs uppercase tracking-[0.14em] text-ink/50">{e.cat}</span></span>
              <img src={e.img} alt="" loading="lazy" className="hidden aspect-video w-full rounded-sm object-cover md:block" />
              {hasVideo(e)
                ? <button type="button" onClick={() => setCur(e)} aria-label={`Ver ${e.title}`} className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white"><Icon name="play" size={14} /></button>
                : <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/45">Foto</span>}
            </li>
          ))}
        </ol>
      </div>
      <Modal e={cur} onClose={() => setCur(null)} />
    </div>
  );
}

function ActiveControls({ e, h, paused, setPaused, onOpen }: { e: Entry & { video: NonNullable<Entry["video"]> }; h: React.RefObject<SmartVideoHandle>; paused: boolean; setPaused: (v: boolean) => void; onOpen: () => void }) {
  const [muted, setMuted] = useState(true);
  const [note, setNote] = useState("");
  useEffect(() => { if (!note) return; const t = window.setTimeout(() => setNote(""), 2600); return () => window.clearTimeout(t); }, [note]);
  const sound = () => {
    if (!e.video.audio) { setNote(NO_AUDIO); return; }
    const el = h.current?.el; if (!el) return; el.muted = !el.muted; setMuted(el.muted);
  };
  const b = "grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/70";
  return (
    <div className="pointer-events-auto absolute bottom-3 left-3 z-20 flex items-center gap-1.5">
      {note && <span role="status" className="absolute bottom-full left-0 mb-2 whitespace-nowrap rounded-md bg-white px-2.5 py-1.5 text-xs font-medium text-ink">{note}</span>}
      <button type="button" className={b} onClick={() => setPaused(!paused)} aria-label={paused ? `Reproducir ${e.title}` : `Pausar ${e.title}`}><Icon name={paused ? "play" : "pause"} size={14} /></button>
      <button type="button" className={cn(b, !e.video.audio && "text-white/60")} onClick={sound} aria-label={e.video.audio ? (muted ? "Activar sonido" : "Silenciar") : "Activar sonido (este montaje no tiene audio)"}><Icon name={muted ? "mute" : "sound"} size={14} /></button>
      <button type="button" className={b} onClick={onOpen} aria-label={`Ver en grande: ${e.title}`}><Icon name="expand" size={14} /></button>
    </div>
  );
}

export default function ReelF() {
  const full = useFull();
  const wrap = useRef<HTMLDivElement>(null);
  const handle = useRef<SmartVideoHandle>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cur, setCur] = useState<Entry | null>(null);
  const n = ALL.length;
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => setActive(Math.round(Math.max(0, Math.min(1, p)) * (n - 1))));
  useEffect(() => setPaused(false), [active]);

  const go = (i: number) => {
    const el = wrap.current;
    if (!el) return;
    const top = window.scrollY + el.getBoundingClientRect().top + (i / (n - 1)) * (el.offsetHeight - window.innerHeight);
    const l = getLenis();
    if (l) l.scrollTo(top); else window.scrollTo({ top, behavior: "smooth" });
  };

  if (!full) return <StaticView />;
  const a = ALL[active];

  return (
    <div className="bg-[#e9e7e2] text-ink">
      <style>{CSS}</style>
      <div ref={wrap} className="relative h-[300vh]">
        <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden p-3 pt-20 md:p-10 md:pt-24">
          <div className="rf-track relative flex h-full max-h-[780px] w-full max-w-[1180px] flex-col overflow-hidden rounded-sm border border-ink/15 bg-paper shadow-2xl md:flex-row">
            {/* Raíl vertical */}
            <div className="hidden w-14 shrink-0 flex-col items-center justify-between border-r border-ink/15 bg-[#f7f6f2] py-10 md:flex" aria-hidden>
              <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-ink/45" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>Cabrera de Mar</span>
              <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-ink/80" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>{EYEBROW}</span>
            </div>

            {/* Títulos */}
            <div className="relative z-10 flex h-1/2 w-full flex-col border-b border-ink/15 bg-gradient-to-r from-[#f7f6f2] to-transparent px-5 pt-5 md:h-full md:flex-1 md:border-b-0 md:px-12 md:pt-12">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Eyebrow className="text-brand-strong max-md:hidden" />
                  <h2 className="text-[clamp(1.35rem,3.2vw,2.8rem)] font-extrabold leading-[.95] tracking-[-0.045em] text-ink md:mt-3">{TITLE}</h2>
                </div>
                <p className="shrink-0 font-mono text-xs tabular-nums text-ink/50" aria-hidden><span className="text-ink">{pad(active + 1)}</span> / {pad(n)}</p>
              </div>
              <div className="rf-mask-y relative mt-2 min-h-0 flex-1 overflow-hidden md:mt-6">
                <ol className={cn("absolute left-0 w-full transition-transform duration-700", ease)} aria-label="Piezas del reel"
                  style={{ top: "40%", marginTop: "calc(var(--ih) / -2)", transform: `translateY(calc(-${active} * var(--ih)))` }}>
                  {ALL.map((e, i) => {
                    const on = i === active, past = i < active;
                    return (
                      <li key={e.id} style={{ height: "var(--ih)" }}
                        className={cn("flex w-full origin-left items-center transition-all duration-500", on && "opacity-100", past && "pointer-events-none scale-95 opacity-0", !on && !past && "scale-[0.98] opacity-30 hover:opacity-60")}>
                        <button type="button" onClick={() => go(i)} tabIndex={past ? -1 : 0} aria-current={on ? "true" : undefined}
                          className="flex min-h-[44px] w-full items-baseline gap-3 text-left md:gap-5">
                          <span className="w-6 shrink-0 font-mono text-[11px] tabular-nums text-ink/50">{pad(i + 1)}</span>
                          <span className={cn("truncate text-[clamp(1.1rem,2.1vw,2.1rem)] leading-none tracking-[-0.04em] transition-all duration-500", on ? "font-head font-bold text-ink" : "font-sans font-normal text-ink/60")}>{e.title}</span>
                          <span className={cn("ml-auto hidden shrink-0 text-[10px] uppercase tracking-[0.16em] text-ink/50 transition-opacity lg:block", on ? "opacity-100" : "opacity-0")}>{hasVideo(e) ? "Vídeo" : "Foto"}</span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            {/* Pista de vídeos */}
            <div className="rf-mask-v relative h-1/2 w-full overflow-hidden bg-[#1a1a1a] md:h-full md:w-[45%] md:border-l md:border-ink/15">
              <div className={cn("absolute left-0 top-1/2 flex w-full flex-col transition-transform duration-700", ease)}
                style={{ marginTop: "calc(var(--vh) / -2)", transform: `translateY(calc(-${active} * var(--vh)))` }}>
                {ALL.map((e, i) => {
                  const on = i === active, near = Math.abs(i - active) <= 1;
                  return (
                    <div key={e.id} className={cn("relative flex w-full shrink-0 items-center justify-center p-3 transition-all duration-700 md:p-4", ease,
                      on ? "z-10 scale-100 opacity-100 blur-none" : "pointer-events-none z-0 scale-[0.85] opacity-30 blur-[4px] md:blur-[6px]")}
                      style={{ height: "var(--vh)" }} aria-hidden={!on}>
                      <div className="relative h-full w-full overflow-hidden rounded-sm bg-black shadow-2xl">
                        {hasVideo(e) && near
                          ? <SmartVideo ref={on ? handle : undefined} video={e.video} autoPlay={on && !paused} className={cn("h-full w-full", e.vertical ? "object-contain" : "object-cover")} />
                          : <img src={e.img} alt={on ? `${e.title} · ${e.cat}` : ""} loading="lazy" decoding="async" className="h-full w-full object-cover" />}
                        {on && <span className="absolute left-3 top-3 z-20 text-[11px] uppercase tracking-[0.2em] text-white/85 drop-shadow md:left-4 md:top-4">{e.cat}</span>}
                        {on && !hasVideo(e) && <span className="absolute bottom-3 left-3 z-20"><PhotoTag /></span>}
                        {on && !hasVideo(e) && <Pending>Vídeo pendiente</Pending>}
                      </div>
                    </div>
                  );
                })}
              </div>
              {hasVideo(a) && (
                <div className="pointer-events-none absolute inset-x-3 top-1/2 z-20 h-[calc(var(--vh)-1.5rem)] -translate-y-1/2 md:inset-x-4 md:h-[calc(var(--vh)-2rem)]">
                  <ActiveControls key={a.id} e={a} h={handle} paused={paused} setPaused={setPaused} onOpen={() => setCur(a)} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal e={cur} onClose={() => setCur(null)} />
    </div>
  );
}
