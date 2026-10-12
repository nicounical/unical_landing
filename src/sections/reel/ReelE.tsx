/**
 * REEL E · High-Energy Motion — basado en 21st.dev «Scroll Gallery» (id 30118, variante «studio»).
 * Del original se conserva: escenario de una pantalla fijo mientras se hace scroll, capas apiladas que se revelan
 * con la cortinilla de 20 franjas horizontales (createStripBounds / mergeIntervals / buildStripMask portados tal cual:
 * cada franja sube desde abajo con retardo j/20·0.5 y velocidad ×2), zoom de 1.25 → 1 de cada capa a lo largo de dos
 * transiciones (getScaleForImage), banda informativa centrada con borde inferior (prefijo · título · enlace) y el
 * título que sale y entra por una máscara (±120 %) al superar el 30 % de cada transición.
 * Adaptación: GSAP ScrollTrigger con pin (300vh + 1000vh por transición) → `position: sticky` en un contenedor de
 * 300vh con useScroll de motion (≈200vh de recorrido, sin secuestrar el scroll); las capas no se crean con
 * document.createElement sino en JSX y la máscara se escribe por ref sin re-render. Las diapositivas son vídeos
 * reales (showreel + piezas con vídeo): solo se reproducen la capa visible y la que se está revelando. El enlace
 * «Explore» pasa a «Ver en grande», que abre el ReelPlayer en un modal (play/pausa, sonido bajo demanda, barra,
 * pantalla completa). Añadido: contador gigante en contorno y segmentos de progreso. Estático: rejilla de pósters.
 */
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Icon, SmartVideo } from "@/core/ui";
import { cn } from "@/lib/utils";
import { ReelPlayer } from "./ReelPlayer";
import { ALL_VIDEOS, CloseBtn, EYEBROW, Eyebrow, ReelModal, TITLE, pad, useFull, type Entry } from "./shared";

const SLIDES = ALL_VIDEOS;
const STRIPS = 20;
const T = { initial: 20, per: 50, final: 30, scaleFrom: 1.25, scaleTo: 1, speed: 2, titleAt: 0.3 };
const SCALE_STEP = (T.scaleFrom - T.scaleTo) / 2;

/* ---- Cortinilla en franjas (portado del original) ---- */
const BOUNDS = Array.from({ length: STRIPS }, (_, j) => {
  const fromBottom = STRIPS - j - 1, step = 100 / STRIPS;
  return { lower: (fromBottom + 1) * step, upperGap: fromBottom * step - 0.1, delay: (j / STRIPS) * 0.5 };
});
function merge(iv: { top: number; bottom: number }[]) {
  if (!iv.length) return [];
  iv.sort((a, b) => a.top - b.top);
  const out = [{ ...iv[0] }];
  for (let i = 1; i < iv.length; i++) { const last = out[out.length - 1], n = iv[i]; if (n.top <= last.bottom) last.bottom = Math.max(last.bottom, n.bottom); else out.push({ ...n }); }
  return out;
}
const HIDDEN = "linear-gradient(to bottom, transparent 0%, transparent 100%)";
const SHOWN = "none";
function stripMask(progress: number) {
  const iv: { top: number; bottom: number }[] = [];
  for (const b of BOUNDS) {
    const adj = Math.max(0, Math.min(1, (progress - b.delay) * T.speed));
    if (adj <= 0) continue;
    iv.push({ top: b.lower - adj * (b.lower - b.upperGap), bottom: b.lower });
  }
  const m = merge(iv);
  if (!m.length) return HIDDEN;
  const stops: string[] = []; let c = 0;
  for (const { top, bottom } of m) { if (top > c) stops.push(`transparent ${c}%`, `transparent ${top}%`); stops.push(`black ${top}%`, `black ${bottom}%`); c = bottom; }
  if (c < 100) stops.push(`transparent ${c}%`, "transparent 100%");
  return `linear-gradient(to bottom, ${stops.join(", ")})`;
}
const TOTAL = T.initial + (SLIDES.length - 1) * T.per + T.final;
function imageProgress(p: number) {
  const u = p * TOTAL - T.initial;
  if (u <= 0) return 0;
  return Math.min(SLIDES.length - 1, u / T.per);
}
const scaleFor = (i: number, ip: number) => { const d = ip - Math.max(0, i - 1); return d <= 0 ? T.scaleFrom : d >= 2 ? T.scaleTo : T.scaleFrom - SCALE_STEP * d; };
const setMask = (el: HTMLElement, v: string) => { el.style.maskImage = v; el.style.webkitMaskImage = v; };

function Modal({ e, onClose }: { e: Entry | null; onClose: () => void }) {
  return (
    <ReelModal open={Boolean(e)} onClose={onClose} label={e ? `${e.title} · ${e.cat}` : "Reproductor"} className={e?.vertical ? "max-w-[min(420px,100%)]" : "max-w-6xl"}>
      {e?.video && (
        <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ type: "spring", stiffness: 160, damping: 22 }}>
          <div className="mb-3 flex items-center justify-between gap-4 text-white">
            <p className="font-head text-lg font-semibold tracking-[-0.02em]">{e.title} <span className="ml-2 text-sm font-normal text-white/60">{e.cat}</span></p>
            <CloseBtn onClose={onClose} />
          </div>
          <ReelPlayer video={e.video} eager className={cn("w-full overflow-hidden rounded-xl", e.vertical ? "aspect-[9/16] max-h-[78vh]" : "aspect-video")} />
        </motion.div>
      )}
    </ReelModal>
  );
}

function StaticView() {
  const [cur, setCur] = useState<Entry | null>(null);
  return (
    <div className="bg-night py-[var(--u-section-y)] text-white">
      <div className="u-wrap">
        <Eyebrow className="text-brand" />
        <h2 className="mt-4 text-[length:var(--u-h2)] font-extrabold uppercase leading-[.92] tracking-[-0.05em] text-white">{TITLE}</h2>
        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SLIDES.map((s, i) => (
            <li key={s.id} className={cn(i === 0 && "sm:col-span-2 lg:col-span-4")}>
              <button type="button" onClick={() => setCur(s)} aria-label={`Ver ${s.title}`} className="group relative block w-full overflow-hidden rounded-lg text-left">
                <img src={s.img} alt="" loading="lazy" className={cn("w-full object-cover", i === 0 ? "aspect-[21/9]" : "aspect-video")} />
                <span className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent p-4">
                  <span><span className="block font-mono text-[11px] text-white/60">{pad(i + 1)} · {s.cat}</span><span className="font-head text-lg font-semibold">{s.title}</span></span>
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink"><Icon name="play" size={14} /></span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <Modal e={cur} onClose={() => setCur(null)} />
    </div>
  );
}

export default function ReelE() {
  const full = useFull();
  const wrap = useRef<HTMLDivElement>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const segs = useRef<(HTMLSpanElement | null)[]>([]);
  const [title, setTitle] = useState({ i: 0, dir: 1 });
  const [band, setBand] = useState({ base: 0, moving: false });
  const [cur, setCur] = useState<Entry | null>(null);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const ip = imageProgress(p);
    const base = Math.floor(ip), sp = ip - base;
    layers.current.forEach((el, i) => {
      if (!el) return;
      (el.firstElementChild as HTMLElement | null)?.style.setProperty("transform", `translate3d(0,0,0) scale(${scaleFor(i, ip)})`);
      if (i === 0) return;
      const t = i - 1;
      if (t < base) setMask(el, SHOWN);
      else if (t === base) setMask(el, stripMask(sp));
      else setMask(el, HIDDEN);
    });
    segs.current.forEach((s, i) => { if (s) s.style.transform = `scaleX(${Math.max(0, Math.min(1, ip - i + 1))})`; });
    const ti = sp >= T.titleAt ? Math.min(base + 1, SLIDES.length - 1) : base;
    setTitle((prev) => (prev.i === ti ? prev : { i: ti, dir: ti > prev.i ? 1 : -1 }));
    const moving = sp > 0 && base < SLIDES.length - 1;
    setBand((prev) => (prev.base === base && prev.moving === moving ? prev : { base, moving }));
  });

  if (!full) return <StaticView />;
  const s = SLIDES[title.i];

  return (
    <div className="bg-night text-white">
      <div ref={wrap} className="relative h-[300vh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {/* Capas de vídeo */}
          <div className="absolute inset-0" aria-hidden>
            {SLIDES.map((sl, i) => (
              <div key={sl.id} ref={(el) => { layers.current[i] = el; }} className="absolute inset-0 overflow-hidden"
                style={i === 0 ? undefined : { maskImage: HIDDEN, WebkitMaskImage: HIDDEN, maskSize: "100% 100%", maskRepeat: "no-repeat" }}>
                <div className="h-full w-full origin-center will-change-transform" style={{ transform: `scale(${T.scaleFrom})` }}>
                  {sl.vertical && <img src={sl.img} alt="" className="absolute inset-0 h-full w-full object-cover blur-2xl" />}
                  <SmartVideo video={sl.video!} autoPlay={i === band.base || (band.moving && i === band.base + 1)}
                    className={cn("relative h-full w-full", sl.vertical ? "object-contain" : "object-cover")} />
                </div>
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/10 to-night/80" />
          </div>

          {/* Cabecera */}
          <div className="relative z-[2] flex items-start justify-between gap-6 px-[var(--u-gutter)] pt-24 md:pt-28">
            <div>
              <Eyebrow className="text-brand" />
              <h2 className="mt-3 max-w-[12ch] text-[clamp(2.2rem,5.6vw,5.2rem)] font-extrabold uppercase leading-[.88] tracking-[-0.05em] text-white">{TITLE}</h2>
            </div>
            <p className="whitespace-nowrap pt-1 font-mono text-sm tabular-nums text-white/80" aria-live="polite">
              <span className="text-white">{pad(title.i + 1)}</span> / {pad(SLIDES.length)}
            </p>
          </div>

          {/* Banda informativa (prefijo · título · enlace) */}
          <div className="absolute left-0 top-1/2 z-[2] w-full -translate-y-1/2 border-b border-white/20 pb-4 [text-shadow:0_2px_24px_rgba(0,0,0,.45)]">
            <div className="flex items-end gap-8 px-[var(--u-gutter)]">
              <p className="flex-1 text-[clamp(1rem,2.4vw,2.25rem)] font-medium leading-none tracking-[-0.02em] text-white max-[1000px]:hidden">{EYEBROW}</p>
              <div className="relative h-[clamp(1.5rem,3.4vw,3rem)] flex-[2] overflow-hidden">
                <AnimatePresence initial={false} custom={title.dir}>
                  <motion.p key={title.i} custom={title.dir} className="absolute inset-0 truncate text-[clamp(1.1rem,3vw,2.6rem)] font-semibold leading-none tracking-[-0.03em] text-white"
                    variants={{ enter: (d: number) => ({ y: d > 0 ? "120%" : "-120%" }), center: { y: "0%" }, exit: (d: number) => ({ y: d > 0 ? "-120%" : "120%" }) }}
                    initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}>
                    {s.title}
                  </motion.p>
                </AnimatePresence>
              </div>
              <div className="flex flex-1 items-center justify-end gap-5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand max-lg:hidden">{s.cat}</span>
                <button type="button" onClick={() => setCur(s)} aria-label={`Ver en grande: ${s.title}`}
                  className="group inline-flex min-h-[44px] items-center gap-2 text-[clamp(.95rem,1.6vw,1.4rem)] font-medium text-white">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-brand text-ink transition-transform group-hover:scale-110"><Icon name="play" size={14} /></span>
                  <span className="max-sm:sr-only">Ver en grande</span>
                </button>
              </div>
            </div>
            
          </div>

          {/* Contador gigante + segmentos de progreso */}
          <p className="pointer-events-none absolute -bottom-[0.18em] right-[var(--u-gutter)] z-[1] font-head text-[clamp(8rem,26vw,24rem)] font-extrabold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,.35)]" aria-hidden>
            {pad(title.i + 1)}
          </p>
          <div className="absolute bottom-6 left-[var(--u-gutter)] z-[2] flex w-[min(360px,55vw)] gap-1.5" aria-hidden>
            {SLIDES.map((sl, i) => (
              <span key={sl.id} className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/20">
                <span ref={(el) => { segs.current[i] = el; }} className="absolute inset-0 origin-left bg-brand" style={{ transform: `scaleX(${i === 0 ? 1 : 0})` }} />
              </span>
            ))}
          </div>
        </div>
      </div>
      <Modal e={cur} onClose={() => setCur(null)} />
    </div>
  );
}
