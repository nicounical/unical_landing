import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { reel, videos, type ReelItem, type Video } from "@/content/site";
import { fullMotion } from "@/core/env";
import { getLenis } from "@/core/scroll";
import { Icon } from "@/core/ui";
import { cn } from "@/lib/utils";

/** Movimiento completo (respeta reduced-motion, equipos modestos y `?motion=` en preview). */
export const useFull = () => fullMotion();

export const EYEBROW = reel.eyebrow;
export const TITLE = reel.title;
export const LEAD = reel.lead;
export const MAIN: Video = reel.main;
export const SCRUB: Video = videos.showreelScrub;

/** Entrada del reel: el showreel principal + las piezas de site.ts (las `placeholder` solo tienen foto). */
export type Entry = ReelItem & { main?: boolean };
export const SHOWREEL_ENTRY: Entry = { id: "showreel", title: "Showreel Unical", cat: "Montaje con proyectos reales", img: MAIN.poster, video: MAIN, main: true };
export const ITEMS: Entry[] = reel.items;
export const VIDEO_ITEMS: Entry[] = reel.items.filter((i) => i.video && !i.placeholder);
export const ALL: Entry[] = [SHOWREEL_ENTRY, ...reel.items];
export const ALL_VIDEOS: Entry[] = [SHOWREEL_ENTRY, ...VIDEO_ITEMS];
export const hasVideo = (e: Entry): e is Entry & { video: Video } => Boolean(e.video) && !e.placeholder;

export const pad = (n: number) => String(n).padStart(2, "0");
export const fmtTime = (s: number) => {
  if (!Number.isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60), r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, "0")}`;
};
export const NO_AUDIO = "Este montaje aún no tiene pista de audio";

/** Eyebrow con raya de marca (mismo patrón que las otras secciones). */
export const Eyebrow = ({ className = "", children = EYEBROW }: { className?: string; children?: string }) => (
  <p className={cn("inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em]", className)}>
    <span className="h-px w-8 bg-current opacity-70" aria-hidden /> {children}
  </p>
);

/** Elige el archivo móvil si existe (misma regla que SmartVideo). */
export const pickSrc = (v: Video) =>
  typeof window !== "undefined" && v.mobile && window.innerWidth * (window.devicePixelRatio || 1) <= 1100 ? v.mobile : v.src;

/* ---------- Estado y acciones de un <video> controlado por el usuario ---------- */
export function usePlayer(video: Video, box: RefObject<HTMLElement>) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [isFs, setIsFs] = useState(false);
  const [note, setNote] = useState("");
  const noteT = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const t = () => setTime(el.currentTime);
    const d = () => setDur(Number.isFinite(el.duration) ? el.duration : 0);
    const p = () => setPlaying(!el.paused);
    const vol = () => setMuted(el.muted);
    el.addEventListener("timeupdate", t);
    el.addEventListener("loadedmetadata", d);
    el.addEventListener("durationchange", d);
    el.addEventListener("play", p);
    el.addEventListener("pause", p);
    el.addEventListener("volumechange", vol);
    d(); p();
    return () => {
      el.removeEventListener("timeupdate", t); el.removeEventListener("loadedmetadata", d); el.removeEventListener("durationchange", d);
      el.removeEventListener("play", p); el.removeEventListener("pause", p); el.removeEventListener("volumechange", vol);
    };
  }, [video.src]);

  useEffect(() => {
    const on = () => setIsFs(Boolean(document.fullscreenElement) && document.fullscreenElement === box.current);
    document.addEventListener("fullscreenchange", on);
    return () => { document.removeEventListener("fullscreenchange", on); window.clearTimeout(noteT.current); };
  }, [box]);

  const flash = useCallback((msg: string) => {
    setNote(msg);
    window.clearTimeout(noteT.current);
    noteT.current = window.setTimeout(() => setNote(""), 2600);
  }, []);
  const play = useCallback(() => { ref.current?.play().catch(() => {}); }, []);
  const pause = useCallback(() => { ref.current?.pause(); }, []);
  const toggle = useCallback(() => { const el = ref.current; if (!el) return; if (el.paused) el.play().catch(() => {}); else el.pause(); }, []);
  /** Sonido solo bajo demanda; si el montaje no tiene pista de audio se dice con honestidad. */
  const sound = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (!video.audio) { flash(NO_AUDIO); return; }
    el.muted = !el.muted;
  }, [video.audio, flash]);
  const seek = useCallback((sec: number) => {
    const el = ref.current;
    if (!el || !Number.isFinite(el.duration)) return;
    el.currentTime = Math.max(0, Math.min(el.duration, sec));
    setTime(el.currentTime);
  }, []);
  const skip = useCallback((d: number) => { const el = ref.current; if (el) seek(el.currentTime + d); }, [seek]);
  const fullscreen = useCallback(() => {
    const b = box.current;
    if (!b) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else if (b.requestFullscreen) b.requestFullscreen().catch(() => {});
    else (ref.current as HTMLVideoElement & { webkitEnterFullscreen?: () => void })?.webkitEnterFullscreen?.();
  }, [box]);

  return { ref, playing, muted, time, dur, isFs, note, play, pause, toggle, sound, seek, skip, fullscreen };
}

/** Reproduce en silencio mientras el elemento está en pantalla y pausa fuera de ella, salvo que el usuario lo haya pausado. */
export function useAutoplayInView(target: RefObject<HTMLElement>, video: RefObject<HTMLVideoElement>, enabled: boolean, onNear?: () => void) {
  const userPaused = useRef(false);
  const inView = useRef(false);
  useEffect(() => {
    const el = target.current, v = video.current;
    if (!el || !v) return;
    const near = new IntersectionObserver(([e]) => { if (e.isIntersecting) { onNear?.(); near.disconnect(); } }, { rootMargin: "400px 0px" });
    near.observe(el);
    const io = new IntersectionObserver(([e]) => {
      inView.current = e.isIntersecting && e.intersectionRatio > 0.2;
      if (inView.current) { if (enabled && !userPaused.current && v.currentSrc) v.play().catch(() => {}); }
      else if (!v.paused) v.pause();
    }, { threshold: [0, 0.2, 0.6] });
    io.observe(el);
    return () => { near.disconnect(); io.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
  return { userPaused, inView };
}

/* ---------- Modal de reproductor: Esc, trampa de foco, devolución de foco y bloqueo del scroll ---------- */
export function ReelModal({ open, onClose, label, children, className = "", backdrop = "bg-night/85" }: {
  open: boolean; onClose: () => void; label: string; children: ReactNode; className?: string; backdrop?: string;
}) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const back = document.activeElement as HTMLElement | null;
    const lenis = getLenis();
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      Array.from(panel.current?.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"]), input, video[controls]') ?? []).filter((n) => !n.hasAttribute("disabled"));
    const t = window.setTimeout(() => (panel.current?.querySelector<HTMLElement>("[data-autofocus]") ?? focusables()[0] ?? panel.current)?.focus(), 60);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { if (document.fullscreenElement) return; e.preventDefault(); onClose(); return; }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (!f.length) { e.preventDefault(); return; }
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (!panel.current?.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", key);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", key);
      document.body.style.overflow = prev;
      lenis?.start();
      back?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div key="reel-modal" className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 md:p-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.25, delay: 0.15 } }}>
          <div className={cn("absolute inset-0 backdrop-blur-lg", backdrop)} onClick={onClose} aria-hidden />
          <div ref={panel} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1} className={cn("relative w-full outline-none", className)}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/** Botón de cierre del modal (44 px). */
export const CloseBtn = ({ onClose, className = "" }: { onClose: () => void; className?: string }) => (
  <button type="button" onClick={onClose} aria-label="Cerrar reproductor" data-autofocus
    className={cn("grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20", className)}>
    <Icon name="close" size={18} />
  </button>
);

/** Etiqueta honesta para piezas que aún no tienen vídeo: visible siempre, más el aviso amarillo en preview. */
export const PhotoOnly = ({ className = "" }: { className?: string }) => (
  <span className={cn("inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85 backdrop-blur", className)}>
    <span className="h-1.5 w-1.5 rounded-full bg-white/60" aria-hidden /> Fotografía
  </span>
);
