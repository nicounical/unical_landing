import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Video } from "@/content/site";
import { Icon } from "@/core/ui";
import { fmtTime, pickSrc, useAutoplayInView, usePlayer } from "./shared";
import "./player.css";

/**
 * Reproductor del reel con controles discretos: play/pausa, sonido (solo si el usuario lo activa; si el montaje
 * no tiene pista de audio se avisa), barra de progreso navegable (clic, arrastre y teclado), tiempo y pantalla completa.
 * Empieza siempre silenciado, no descarga nada hasta acercarse al viewport, reproduce solo en pantalla y pausa fuera.
 * `autoPlay={false}` (modo estático / reduced-motion): muestra el póster hasta que el usuario pulsa reproducir.
 */
export function ReelPlayer({ video, className = "", uiClassName = "", style, autoPlay = true, showControls = true, onClose, eager = false, fit = "cover" }: {
  video: Video; className?: string; uiClassName?: string; style?: CSSProperties; autoPlay?: boolean; showControls?: boolean; onClose?: () => void;
  eager?: boolean; fit?: "cover" | "contain";
}) {
  const box = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState<string | undefined>(() => (eager ? pickSrc(video) : undefined));
  const p = usePlayer(video, box);
  const { userPaused, inView } = useAutoplayInView(box, p.ref, autoPlay, () => setSrc((s) => s ?? pickSrc(video)));
  const dragging = useRef(false);
  const wantPlay = useRef(false);

  // Al asignar el archivo: reproducir si lo pidió el usuario o si toca autoplay silencioso en pantalla.
  useEffect(() => {
    if (!src) return;
    if (wantPlay.current || (autoPlay && inView.current && !userPaused.current)) p.play();
    wantPlay.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const toggle = () => {
    userPaused.current = p.playing;
    if (!src) { wantPlay.current = true; setSrc(pickSrc(video)); return; }
    p.toggle();
  };
  const seekAt = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    p.seek(((e.clientX - r.left) / r.width) * p.dur);
  };
  const pct = p.dur ? p.time / p.dur : 0;

  return (
    <div ref={box} className={`rp ${p.playing ? "is-playing" : ""} ${className}`} style={style}>
      <video ref={p.ref} className="rp__v" style={{ objectFit: fit }} src={src} poster={video.poster} muted playsInline loop
        preload={eager ? "metadata" : "none"} aria-label={video.label} onClick={toggle} disablePictureInPicture />
      {showControls && (
        <div className={`rp__ui ${uiClassName}`}>
          <button type="button" className="rp__btn" onClick={toggle} aria-label={p.playing ? "Pausar vídeo" : "Reproducir vídeo"}>
            <Icon name={p.playing ? "pause" : "play"} size={16} />
          </button>
          <span className="rp__time" aria-hidden>{fmtTime(p.time)}</span>
          <div className="rp__bar" role="slider" tabIndex={0} aria-label="Progreso del vídeo"
            aria-valuemin={0} aria-valuemax={Math.round(p.dur)} aria-valuenow={Math.round(p.time)}
            aria-valuetext={`${fmtTime(p.time)} de ${fmtTime(p.dur)}`}
            onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); seekAt(e); }}
            onPointerMove={(e) => { if (dragging.current) seekAt(e); }}
            onPointerUp={() => { dragging.current = false; }}
            onPointerCancel={() => { dragging.current = false; }}
            onKeyDown={(e) => {
              const k = e.key;
              if (k === "ArrowRight" || k === "ArrowUp") p.skip(5);
              else if (k === "ArrowLeft" || k === "ArrowDown") p.skip(-5);
              else if (k === "Home") p.seek(0);
              else if (k === "End") p.seek(p.dur - 0.1);
              else return;
              e.preventDefault();
            }}>
            <i style={{ transform: `scaleX(${pct})` }} />
          </div>
          <span className="rp__time rp__time--d" aria-hidden>{fmtTime(p.dur)}</span>
          <button type="button" className={`rp__btn ${!video.audio ? "is-off" : ""}`} onClick={p.sound}
            aria-label={!video.audio ? "Activar sonido (este montaje no tiene audio)" : p.muted ? "Activar sonido" : "Silenciar"}>
            <Icon name={p.muted ? "mute" : "sound"} size={16} />
          </button>
          <button type="button" className="rp__btn" onClick={p.fullscreen} aria-label={p.isFs ? "Salir de pantalla completa" : "Pantalla completa"}>
            <Icon name="expand" size={16} />
          </button>
          {onClose && <button type="button" className="rp__btn" onClick={onClose} aria-label="Cerrar reproductor"><Icon name="close" size={16} /></button>}
          <span className="rp__note" role="status" aria-live="polite" hidden={!p.note}>{p.note}</span>
        </div>
      )}
    </div>
  );
}
