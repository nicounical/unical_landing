import {
  forwardRef, useEffect, useImperativeHandle, useRef, useState,
  type AnchorHTMLAttributes, type CSSProperties, type ReactNode,
} from "react";
import { fullMotion, finePointer, isMobile } from "./env";
import { media, type Video } from "@/content/site";

/* ---------- Logo (siempre la imagen real) ---------- */
export function Logo({ tone = "light", className = "", height = 34 }: { tone?: "light" | "dark"; className?: string; height?: number }) {
  return (
    <img
      src={tone === "light" ? media.logoLight : media.logoDark}
      alt="Unical Graphic"
      className={className}
      height={height}
      style={{ height, width: "auto" }}
      decoding="async"
    />
  );
}

/* ---------- Eyebrow ---------- */
export const Eyebrow = ({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) => (
  <p className={`u-eyebrow ${className}`} style={style}>{children}</p>
);

/* ---------- Botón con efecto magnético opcional ---------- */
type BtnProps = AnchorHTMLAttributes<HTMLAnchorElement> & { kind?: "primary" | "ghost" | "light" | "dark"; magnetic?: boolean };
export function Btn({ kind = "primary", magnetic = false, className = "", children, ...rest }: BtnProps) {
  const ref = useMagnetic<HTMLAnchorElement>(magnetic);
  return (
    <a ref={ref} className={`u-btn u-btn--${kind} ${className}`} {...rest}>
      <span className="u-btn__in">{children}</span>
    </a>
  );
}

export function useMagnetic<T extends HTMLElement>(enabled = true, strength = 0.35) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled || !finePointer() || !fullMotion()) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    };
    const leave = () => { el.style.transform = ""; };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, [enabled, strength]);
  return ref;
}

/* ---------- Vídeo inteligente ----------
 * - Carga diferida: no descarga nada hasta acercarse al viewport (salvo `eager`).
 * - Siempre silenciado en autoplay; play/pause según visibilidad.
 * - Con reduced-motion o equipo limitado: muestra solo el póster (alternativa estática).
 * - Elige la versión móvil si existe.
 */
export type SmartVideoHandle = { el: HTMLVideoElement | null };
type SmartVideoProps = {
  video: Video; className?: string; style?: CSSProperties; eager?: boolean; loop?: boolean;
  autoPlay?: boolean; staticFallback?: boolean; onReady?: (v: HTMLVideoElement) => void; ariaLabel?: string;
};
export const SmartVideo = forwardRef<SmartVideoHandle, SmartVideoProps>(function SmartVideo(
  { video, className = "", style, eager = false, loop = true, autoPlay = true, staticFallback = true, onReady, ariaLabel },
  handle,
) {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | undefined>(undefined);
  const [isStatic] = useState(() => staticFallback && !fullMotion());
  const visible = useRef(false);
  useImperativeHandle(handle, () => ({ el: ref.current }), [src]);

  useEffect(() => {
    if (isStatic) return;
    const el = ref.current;
    if (!el) return;
    const chosen = video.mobile && isMobile() ? video.mobile : video.src;
    if (eager) setSrc(chosen);
    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          // Solo se descarga si se va a reproducir (o si se pide carga anticipada).
          if (autoPlay) { setSrc((s) => s ?? chosen); el.play().catch(() => {}); }
        } else if (autoPlay) {
          el.pause();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [video, eager, autoPlay, isStatic]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return;
    el.load();
    if (autoPlay) el.play().catch(() => {});
    onReady?.(el);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  useEffect(() => {
    const el = ref.current;
    if (!el || isStatic) return;
    if (autoPlay && !src && visible.current) setSrc(video.mobile && isMobile() ? video.mobile : video.src);
    if (!src) return;
    if (autoPlay) el.play().catch(() => {});
    else el.pause();
  }, [autoPlay, src, isStatic, video]);

  if (isStatic) {
    return <img src={video.poster} alt={ariaLabel ?? video.label} className={className} style={style} decoding="async" />;
  }
  return (
    <video
      ref={ref}
      className={className}
      style={style}
      src={src}
      poster={video.poster}
      muted
      playsInline
      loop={loop}
      preload={eager ? "auto" : "none"}
      aria-label={ariaLabel ?? video.label}
      disablePictureInPicture
    />
  );
});

/* ---------- Texto dividido (para animaciones letra a letra / palabra a palabra) ---------- */
export function SplitChars({ text, className = "", charClass = "ch" }: { text: string; className?: string; charClass?: string }) {
  return (
    <span className={className} aria-label={text} role="text">
      {Array.from(text).map((c, i) => (
        <span key={i} className={charClass} aria-hidden="true" style={{ display: "inline-block", whiteSpace: "pre" }}>{c}</span>
      ))}
    </span>
  );
}

export function SplitWords({ text, className = "", wordClass = "wd" }: { text: string; className?: string; wordClass?: string }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="u-wmask"><span className={wordClass}>{w}</span>{i < words.length - 1 ? " " : ""}</span>
      ))}
    </span>
  );
}

/* ---------- Formato de cifras ---------- */
export const fmt = (n: number) => Math.round(n).toLocaleString("es-ES");

/* ---------- Marquesina CSS (sin JS) ---------- */
export function Marquee({ children, speed = 40, reverse = false, className = "" }: { children: ReactNode; speed?: number; reverse?: boolean; className?: string }) {
  return (
    <div className={`u-marquee ${className}`} style={{ ["--mq-speed" as string]: `${speed}s` }}>
      <div className={`u-marquee__track ${reverse ? "is-rev" : ""}`}>
        <div className="u-marquee__group">{children}</div>
        <div className="u-marquee__group" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}

/* ---------- Aviso de recurso pendiente (solo visible en preview) ---------- */
export function Pending({ children }: { children: ReactNode }) {
  if (!(import.meta.env.DEV || import.meta.env.VITE_PREVIEW === "1")) return null;
  return <span className="u-pending" title="Recurso audiovisual pendiente">{children}</span>;
}

/* ---------- Iconos lineales simples ---------- */
export function Icon({ name, size = 28 }: { name: string; size?: number }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (name) {
    case "factory": return <svg {...p}><path d="M3 21V10l6 4V10l6 4V5h6v16z" /><path d="M7 17h2M12 17h2M17 17h2" /></svg>;
    case "pen": return <svg {...p}><path d="M14 4l6 6-11 11H3v-6z" /><path d="M12 6l6 6" /></svg>;
    case "badge": return <svg {...p}><circle cx="12" cy="9" r="6" /><path d="M8.5 14L7 22l5-3 5 3-1.5-8" /><path d="M9.5 9l1.8 1.8L15 7.5" /></svg>;
    case "map": return <svg {...p}><path d="M12 21s-7-6.5-7-12a7 7 0 0114 0c0 5.5-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>;
    case "play": return <svg {...p}><path d="M7 4l13 8-13 8z" fill="currentColor" /></svg>;
    case "pause": return <svg {...p}><path d="M7 4h3v16H7zM14 4h3v16h-3z" fill="currentColor" /></svg>;
    case "sound": return <svg {...p}><path d="M4 9h4l5-4v14l-5-4H4z" /><path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11" /></svg>;
    case "mute": return <svg {...p}><path d="M4 9h4l5-4v14l-5-4H4z" /><path d="M17 9l5 6M22 9l-5 6" /></svg>;
    case "expand": return <svg {...p}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>;
    case "close": return <svg {...p}><path d="M5 5l14 14M19 5L5 19" /></svg>;
    case "arrow": return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    default: return null;
  }
}

/* ---------- Montaje diferido: true cuando el elemento se acerca al viewport ---------- */
export function useNear<T extends HTMLElement>(margin = "600px") {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin, near]);
  return [ref, near] as const;
}
