import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Video } from "@/content/site";
import { Icon } from "@/core/ui";
import "./player.css";

/**
 * Reproductor del reel con controles discretos: play/pausa, sonido (solo si el usuario lo activa),
 * barra de progreso navegable y pantalla completa. Empieza siempre silenciado.
 */
export function ReelPlayer({ video, className = "", style, autoPlay = true, showControls = true, onClose }: {
  video: Video; className?: string; style?: CSSProperties; autoPlay?: boolean; showControls?: boolean; onClose?: () => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const v = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [t, setT] = useState(0);
  const [note, setNote] = useState("");

  useEffect(() => {
    const el = v.current!;
    const on = () => setT(el.duration ? el.currentTime / el.duration : 0);
    const p = () => setPlaying(!el.paused);
    el.addEventListener("timeupdate", on);
    el.addEventListener("play", p);
    el.addEventListener("pause", p);
    if (autoPlay) el.play().catch(() => {});
    return () => { el.removeEventListener("timeupdate", on); el.removeEventListener("play", p); el.removeEventListener("pause", p); };
  }, [autoPlay, video.src]);

  const toggle = () => { const el = v.current!; if (el.paused) el.play().catch(() => {}); else el.pause(); };
  const sound = () => {
    if (!video.audio) { setNote("Este montaje aún no tiene pista de audio"); window.setTimeout(() => setNote(""), 2400); return; }
    const el = v.current!; el.muted = !el.muted; setMuted(el.muted);
  };
  const seek = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect(); const el = v.current!;
    if (el.duration) el.currentTime = ((e.clientX - r.left) / r.width) * el.duration;
  };
  const fs = () => { const b = box.current!; if (document.fullscreenElement) document.exitFullscreen(); else b.requestFullscreen?.().catch(() => {}); };

  return (
    <div ref={box} className={`rp ${className}`} style={style}>
      <video ref={v} className="rp__v" src={video.src} poster={video.poster} muted playsInline loop preload="metadata" aria-label={video.label} onClick={toggle} />
      {showControls && (
        <div className="rp__ui">
          <button className="rp__btn" onClick={toggle} aria-label={playing ? "Pausar" : "Reproducir"}><Icon name={playing ? "pause" : "play"} size={16} /></button>
          <div className="rp__bar" role="slider" aria-label="Progreso del vídeo" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(t * 100)} tabIndex={0}
            onPointerDown={seek}
            onKeyDown={(e) => { const el = v.current!; if (!el.duration) return; if (e.key === "ArrowRight") el.currentTime += 5; if (e.key === "ArrowLeft") el.currentTime -= 5; }}>
            <i style={{ transform: `scaleX(${t})` }} />
          </div>
          <button className={`rp__btn ${!video.audio ? "is-off" : ""}`} onClick={sound} aria-label={muted ? "Activar sonido" : "Silenciar"} title={video.audio ? "" : "Sin pista de audio todavía"}>
            <Icon name={muted ? "mute" : "sound"} size={16} />
          </button>
          <button className="rp__btn" onClick={fs} aria-label="Pantalla completa"><Icon name="expand" size={16} /></button>
          {onClose && <button className="rp__btn" onClick={onClose} aria-label="Cerrar"><Icon name="close" size={16} /></button>}
          {note && <span className="rp__note" role="status">{note}</span>}
        </div>
      )}
    </div>
  );
}
