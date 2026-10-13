/**
 * REEL B · Immersive 3D — basado en 21st.dev «Scroll-Linked Video Scrubber» (id 19344).
 * Del original se conserva: contenedor alto (300 %) con un escenario `sticky top-0` de una pantalla, cálculo del
 * progreso como (viewportTop − wrapperRect.top) / (altura − viewport) y `video.currentTime = progress · duration`,
 * vídeo `muted playsInline preload="auto"` sin controles nativos, recalculado en `loadedmetadata`.
 * Adaptación: se usa `videos.showreelScrub` (versión con keyframes densos para que el seek sea fluido) y el
 * currentTime se suaviza con un rAF (lerp) en lugar de saltar en cada evento de scroll. Para la dirección 3D, el
 * marco vive en un escenario con perspectiva: entra inclinado (rotateX) y escalado, se endereza al centro y se
 * despide inclinándose hacia atrás, con capas de póster desenfocadas detrás (translateZ negativo), suelo en rejilla
 * y un HUD con timecode y raíl de progreso. Como el scroll solo «recorre» el montaje, un botón abre el ReelPlayer
 * completo en un modal (play/pausa, sonido bajo demanda, barra navegable, pantalla completa). El vídeo no se
 * descarga hasta que la sección se acerca; en modo estático se muestra el póster con el mismo botón.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { Icon, useNear } from "@/core/ui";
import { ReelPlayer } from "./ReelPlayer";
import { CloseBtn, Eyebrow, LEAD, MAIN, ReelModal, SCRUB, TITLE, fmtTime, useFull } from "./shared";

function PlayFull({ onOpen, className = "" }: { onOpen: () => void; className?: string }) {
  return (
    <button type="button" onClick={onOpen}
      className={`group inline-flex min-h-[48px] items-center gap-3 rounded-full bg-white py-1.5 pl-1.5 pr-5 text-sm font-semibold text-ink shadow-[0_10px_40px_-10px_rgba(153,196,228,.6)] transition hover:bg-brand-tint ${className}`}>
      <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-strong text-white transition-transform group-hover:scale-110"><Icon name="play" size={14} /></span>
      Ver el showreel con controles
    </button>
  );
}

function Head() {
  return (
    <div className="u-wrap grid gap-6 pt-[var(--u-section-y)] md:grid-cols-12 md:items-end">
      <div className="md:col-span-7">
        <Eyebrow className="text-brand" />
        <h2 className="mt-4 text-[length:var(--u-h2)] font-extrabold leading-[.98] tracking-[-0.045em] text-white">{TITLE}</h2>
      </div>
      <p className="max-w-[44ch] text-base leading-relaxed text-white/70 md:col-span-5">{LEAD}</p>
    </div>
  );
}

function Modal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <ReelModal open={open} onClose={onClose} label="Showreel Unical" className="max-w-6xl">
      <motion.div initial={{ rotateX: 18, scale: 0.9, opacity: 0 }} animate={{ rotateX: 0, scale: 1, opacity: 1 }} exit={{ rotateX: -10, scale: 0.94, opacity: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }} style={{ transformPerspective: 1400 }}>
        <div className="mb-3 flex items-center justify-between gap-4 text-white">
          <p className="text-sm text-white/75">{MAIN.label}</p>
          <CloseBtn onClose={onClose} />
        </div>
        <ReelPlayer video={MAIN} eager className="aspect-video w-full overflow-hidden rounded-xl ring-1 ring-white/15" />
      </motion.div>
    </ReelModal>
  );
}

function StaticView() {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-night pb-[var(--u-section-y)] text-white">
      <Head />
      <div className="u-wrap mt-12">
        <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/10">
          <img src={MAIN.poster} alt={MAIN.label} className="aspect-video w-full object-cover" loading="lazy" decoding="async" />
          <div className="absolute inset-0 grid place-items-center bg-night/30"><PlayFull onOpen={() => setOpen(true)} /></div>
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

export default function ReelB() {
  const full = useFull();
  const [nearRef, near] = useNear<HTMLDivElement>("800px");
  const video = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const target = useRef(0);
  const raf = useRef(0);

  const { scrollYProgress } = useScroll({ target: nearRef, offset: ["start start", "end end"] });

  /** Seek suavizado: currentTime se acerca al objetivo en cada frame (el original asignaba directamente). */
  const tick = useCallback(() => {
    raf.current = 0;
    const v = video.current;
    if (!v || !Number.isFinite(v.duration) || !v.duration) return;
    const goal = target.current * v.duration;
    const diff = goal - v.currentTime;
    if (Math.abs(diff) < 0.02) return;
    v.currentTime = v.currentTime + diff * 0.35;
    setTime(v.currentTime);
    raf.current = requestAnimationFrame(tick);
  }, []);
  const update = useCallback((p: number) => {
    target.current = Math.max(0, Math.min(1, p));
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  }, [tick]);
  useMotionValueEvent(scrollYProgress, "change", update);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const rotX = useTransform(scrollYProgress, [0, 0.3, 0.75, 1], [26, 0, 0, -14]);
  const rotY = useTransform(scrollYProgress, [0, 0.3, 0.75, 1], [-10, 0, 0, 6]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.75, 1], [0.74, 1, 1, 0.86]);
  const lift = useTransform(scrollYProgress, [0, 0.3], ["8vh", "0vh"]);
  const ghostZ = useTransform(scrollYProgress, [0, 1], [-220, -420]);
  const ghostZ2 = useTransform(scrollYProgress, [0, 1], [-520, -760]);
  const floorY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const rail = useTransform(scrollYProgress, (v) => `scaleX(${v})`);
  const hud = useTransform(scrollYProgress, [0.05, 0.25], [0.55, 1]);

  if (!full) return <StaticView />;

  return (
    <div className="relative overflow-x-clip bg-night text-white">
      <Head />
      <div ref={nearRef} className="relative h-[300vh]">
        <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden" style={{ perspective: "1400px" }}>
          {/* Suelo en rejilla y halo de marca */}
          <div className="pointer-events-none absolute inset-x-[-30%] bottom-[-35%] h-[80%] origin-top opacity-40" style={{ transform: "rotateX(76deg)" }} aria-hidden>
            <motion.div className="h-[200%] w-full" style={{ y: floorY, backgroundImage: "linear-gradient(rgba(153,196,228,.35) 1px,transparent 1px),linear-gradient(90deg,rgba(153,196,228,.35) 1px,transparent 1px)", backgroundSize: "80px 80px", maskImage: "linear-gradient(to bottom,transparent,#000 30%,#000 60%,transparent)" }} />
          </div>
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-strong/30 blur-[120px]" aria-hidden />

          <motion.div className="relative w-[min(92vw,1180px,calc((100svh-17rem)*16/9))] max-md:mt-10" style={{ rotateX: rotX, rotateY: rotY, scale, y: lift, transformStyle: "preserve-3d" }}>
            {/* Capas traseras (profundidad) */}
            <motion.img src={MAIN.poster} alt="" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full rounded-2xl object-cover opacity-30 blur-md" style={{ z: ghostZ, x: "6%", y: "-6%" }} />
            <motion.img src={MAIN.poster} alt="" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full rounded-2xl object-cover opacity-15 blur-xl" style={{ z: ghostZ2, x: "-8%", y: "-10%" }} />

            {/* Marco con el vídeo controlado por el scroll */}
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-black shadow-[0_60px_120px_-30px_rgba(0,0,0,.85)] ring-1 ring-white/15">
              <video ref={video} src={near ? SCRUB.src : undefined} poster={SCRUB.poster} muted playsInline preload="auto" aria-label={SCRUB.label}
                className="block h-full w-full object-cover" disablePictureInPicture
                onLoadedMetadata={(e) => { setDur(e.currentTarget.duration || 0); update(scrollYProgress.get()); }} />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" aria-hidden />

              {/* HUD */}
              <motion.div className="absolute inset-0 flex flex-col justify-between p-4 md:p-6" style={{ opacity: hud }}>
                <div className="flex items-start justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-white/80">
                  <span className="flex items-center gap-2"><span className="h-2 w-2 animate-pulse rounded-full bg-brand" aria-hidden />Control por scroll</span>
                  <span className="tabular-nums" aria-hidden>{fmtTime(time)} / {fmtTime(dur)}</span>
                </div>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <p className="max-w-[28ch] text-sm text-white/80 max-md:hidden">Desliza para recorrer el montaje fotograma a fotograma.</p>
                  <PlayFull onOpen={() => setOpen(true)} />
                </div>
              </motion.div>
            </div>

            {/* Raíl de progreso bajo el marco */}
            <div className="mt-5 flex items-center gap-4 font-mono text-[11px] tracking-[0.18em] text-white/50" aria-hidden>
              <span>00</span>
              <div className="relative h-px flex-1 bg-white/15"><motion.div className="absolute inset-0 origin-left bg-brand" style={{ transform: rail }} /></div>
              <span>FIN</span>
            </div>
          </motion.div>
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
