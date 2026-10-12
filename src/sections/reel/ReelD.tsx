/**
 * REEL D · Minimal Luxury — basado en 21st.dev «Video Player» (id 4057).
 * Del original se conserva: reproductor con capa central de play/pausa en cristal (w-16, backdrop-blur, borde
 * blanco 30 %), barra inferior con degradado negro, tiempo actual / duración en mono, barra de progreso de rango
 * con relleno por linear-gradient, botones de retroceder / avanzar 10 s, play, silencio, pantalla completa
 * (Maximize/Minimize), ocultación automática de los controles a los 3 s de reproducción y reaparición al mover el
 * ratón, y atajos de teclado activos solo con el foco dentro del reproductor (espacio/K, M, F, ← →).
 * Adaptación: marco editorial sereno sobre papel, con passe-partout blanco, pie de foto y un índice de escenas que
 * cambia el vídeo del marco (showreel + piezas con vídeo de `reel.items`). El deslizador de volumen y las flechas
 * ↑/↓ del original se omiten: ningún montaje tiene pista de audio todavía, así que el botón de sonido existe pero
 * lo explica en lugar de fingir. Arranca silenciado y solo se reproduce mientras está en pantalla; en modo
 * estático muestra el póster hasta que el usuario pulsa play. lucide-react se mantiene para los iconos.
 */
import { useEffect, useRef, useState } from "react";
import { Maximize, Minimize, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { ALL_VIDEOS, Eyebrow, LEAD, TITLE, fmtTime, pad, pickSrc, useAutoplayInView, useFull, usePlayer, type Entry } from "./shared";
import type { Video } from "@/content/site";

function Player({ video, autoPlay, startPlaying, vertical = false }: { video: Video; autoPlay: boolean; startPlaying: boolean; vertical?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const p = usePlayer(video, box);
  const [src, setSrc] = useState<string | undefined>(() => (startPlaying ? pickSrc(video) : undefined));
  const { userPaused, inView } = useAutoplayInView(box, p.ref, autoPlay, () => setSrc((s) => s ?? pickSrc(video)));
  const want = useRef(startPlaying);
  const [show, setShow] = useState(true);
  const hideT = useRef(0);

  useEffect(() => {
    if (!src) return;
    if (want.current || (autoPlay && inView.current && !userPaused.current)) p.play();
    want.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const kick = () => {
    setShow(true);
    window.clearTimeout(hideT.current);
    if (p.playing) hideT.current = window.setTimeout(() => setShow(false), 3000);
  };
  useEffect(() => { kick(); return () => window.clearTimeout(hideT.current); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [p.playing]);

  const toggle = () => {
    userPaused.current = p.playing;
    if (!src) { want.current = true; setSrc(pickSrc(video)); return; }
    p.toggle();
  };
  const onKey = (e: React.KeyboardEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    kick();
    switch (e.key) {
      case " ": case "k": case "K":
        if (e.key === " " && (tag === "BUTTON" || tag === "INPUT")) return;
        e.preventDefault(); toggle(); break;
      case "m": case "M": e.preventDefault(); p.sound(); break;
      case "f": case "F": e.preventDefault(); p.fullscreen(); break;
      case "ArrowLeft": if (tag === "INPUT") return; e.preventDefault(); p.skip(-10); break;
      case "ArrowRight": if (tag === "INPUT") return; e.preventDefault(); p.skip(10); break;
    }
  };
  const pct = p.dur ? (p.time / p.dur) * 100 : 0;
  const visible = !p.playing || show;
  const btn = "grid h-11 w-11 place-items-center rounded-full text-white transition-colors hover:bg-white/15";

  return (
    <div ref={box} tabIndex={0} role="group" aria-label={`Reproductor: ${video.label}. Atajos: espacio o K reproduce, M sonido, F pantalla completa, flechas ±10 s`}
      onKeyDown={onKey} onMouseMove={kick} onFocus={kick} onMouseLeave={() => p.playing && setShow(false)}
      className={cn("group relative aspect-video w-full overflow-hidden bg-black", !visible && "cursor-none")}>
      {vertical && <img src={video.poster} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl" />}
      <video ref={p.ref} src={src} poster={video.poster} muted playsInline loop preload="none" aria-label={video.label}
        className={cn("relative h-full w-full [:fullscreen_&]:object-contain", vertical ? "object-contain" : "object-cover")} onClick={toggle} disablePictureInPicture />

      {/* Play/pausa central (visible en pausa o al mover el ratón) */}
      <div className={cn("pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-300", visible ? "opacity-100" : "opacity-0")}>
        <button type="button" onClick={(e) => { e.stopPropagation(); toggle(); }} tabIndex={-1} aria-hidden
          className={cn("pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30 md:h-20 md:w-20", p.playing && "opacity-0 group-hover:opacity-100")}>
          {p.playing ? <Pause className="h-6 w-6" strokeWidth={1.25} /> : <Play className="ml-1 h-6 w-6" strokeWidth={1.25} />}
        </button>
      </div>

      {/* Barra de controles */}
      <div className={cn("absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-16 transition-opacity duration-300", visible ? "opacity-100" : "pointer-events-none opacity-0")}>
        <div className="space-y-1 px-3 pb-2 md:px-5 md:pb-3">
          <div className="flex items-center gap-3 text-white">
            <span className="w-10 font-mono text-[11px] tabular-nums text-white/80">{fmtTime(p.time)}</span>
            <input type="range" min={0} max={p.dur || 0} step={0.1} value={p.time} aria-label="Progreso del vídeo"
              aria-valuetext={`${fmtTime(p.time)} de ${fmtTime(p.dur)}`}
              onChange={(e) => p.seek(parseFloat(e.target.value))}
              className="h-11 flex-1 cursor-pointer appearance-none bg-transparent focus-visible:outline-offset-0
                [&::-webkit-slider-runnable-track]:h-px [&::-webkit-slider-runnable-track]:[background:var(--rp-track)]
                [&::-webkit-slider-thumb]:-mt-[5px] [&::-webkit-slider-thumb]:h-[11px] [&::-webkit-slider-thumb]:w-[11px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                [&::-moz-range-track]:h-px [&::-moz-range-track]:[background:var(--rp-track)] [&::-moz-range-thumb]:h-[11px] [&::-moz-range-thumb]:w-[11px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white"
              style={{ ["--rp-track" as string]: `linear-gradient(to right,#fff 0%,#fff ${pct}%,rgba(255,255,255,.3) ${pct}%,rgba(255,255,255,.3) 100%)` }} />
            <span className="w-10 text-right font-mono text-[11px] tabular-nums text-white/60">{fmtTime(p.dur)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button type="button" className={btn} onClick={() => p.skip(-10)} aria-label="Retroceder 10 segundos"><SkipBack className="h-4 w-4" strokeWidth={1.5} /></button>
              <button type="button" className={btn} onClick={toggle} aria-label={p.playing ? "Pausar vídeo" : "Reproducir vídeo"}>
                {p.playing ? <Pause className="h-4 w-4" strokeWidth={1.5} /> : <Play className="ml-0.5 h-4 w-4" strokeWidth={1.5} />}
              </button>
              <button type="button" className={btn} onClick={() => p.skip(10)} aria-label="Avanzar 10 segundos"><SkipForward className="h-4 w-4" strokeWidth={1.5} /></button>
              <button type="button" className={cn(btn, !video.audio && "text-white/60")} onClick={p.sound}
                aria-label={!video.audio ? "Activar sonido (este montaje no tiene audio)" : p.muted ? "Activar sonido" : "Silenciar"}>
                {p.muted ? <VolumeX className="h-4 w-4" strokeWidth={1.5} /> : <Volume2 className="h-4 w-4" strokeWidth={1.5} />}
              </button>
              <span role="status" aria-live="polite" className={cn("ml-2 text-xs text-white/85 transition-opacity max-sm:hidden", p.note ? "opacity-100" : "opacity-0")}>{p.note}</span>
            </div>
            <button type="button" className={btn} onClick={p.fullscreen} aria-label={p.isFs ? "Salir de pantalla completa" : "Pantalla completa"}>
              {p.isFs ? <Minimize className="h-4 w-4" strokeWidth={1.5} /> : <Maximize className="h-4 w-4" strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>
      {p.note && <span className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink sm:hidden" aria-hidden>{p.note}</span>}
    </div>
  );
}

export default function ReelD() {
  const full = useFull();
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(false);
  const cur: Entry = ALL_VIDEOS[idx];

  return (
    <div className="bg-paper py-[var(--u-section-y)] text-ink">
      <div className="u-wrap">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4"><Eyebrow className="text-brand-strong" /></div>
          <div className="lg:col-span-8">
            <h2 className="font-sans text-[clamp(2.2rem,4.8vw,4.2rem)] font-normal leading-[1.02] tracking-[-0.05em] text-ink">{TITLE}</h2>
            <p className="mt-5 max-w-[52ch] text-[1.02rem] leading-relaxed text-ink/65">{LEAD}</p>
          </div>
        </div>

        <figure className="mt-14 md:mt-20">
          <div className="bg-white p-2 shadow-[0_40px_80px_-50px_rgba(22,22,31,.45)] ring-1 ring-ink/[.06] sm:p-3 md:p-5">
            <Player key={cur.id} video={cur.video!} autoPlay={full} startPlaying={picked} vertical={cur.vertical} />
          </div>
          <figcaption className="mt-5 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 text-[13px] text-ink/55">
            <span><span className="font-mono tabular-nums text-ink">{pad(idx + 1)}</span><span className="mx-3 inline-block h-px w-6 translate-y-[-3px] bg-ink/30" aria-hidden />{cur.video!.label}</span>
            <span className="max-md:hidden">Atajos con el reproductor enfocado: <kbd className="font-mono">K</kbd> reproducir · <kbd className="font-mono">M</kbd> sonido · <kbd className="font-mono">F</kbd> pantalla completa · <kbd className="font-mono">← →</kbd> 10 s</span>
          </figcaption>
        </figure>

        <ol className="mt-12 grid grid-cols-1 border-t border-ink/10 sm:grid-cols-2 lg:grid-cols-5" aria-label="Escenas del reel">
          {ALL_VIDEOS.map((e, i) => (
            <li key={e.id} className="border-b border-ink/10 lg:border-b-0 lg:border-r lg:last:border-r-0">
              <button type="button" onClick={() => { setPicked(true); setIdx(i); }} aria-pressed={i === idx}
                className={cn("group flex min-h-[44px] w-full flex-col gap-2 py-5 text-left transition-colors lg:px-5 lg:first:pl-0", i === idx ? "text-ink" : "text-ink/60 hover:text-ink/85")}>
                <span className="flex items-center gap-3 font-mono text-[11px] tabular-nums tracking-[0.18em]">
                  {pad(i + 1)}
                  <span className={cn("h-px flex-1 origin-left bg-current transition-transform duration-700", i === idx ? "scale-x-100" : "scale-x-[.25] group-hover:scale-x-50")} aria-hidden />
                </span>
                <span className="text-[1.02rem] font-medium leading-snug tracking-[-0.01em]">{e.title}</span>
                <span className="text-[12px] uppercase tracking-[0.14em] opacity-80">{e.cat}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
