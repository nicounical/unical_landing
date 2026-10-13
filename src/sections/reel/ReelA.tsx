/**
 * REEL A · Cinematic Premium — basado en 21st.dev «Scroll media expansion hero» (id 1932).
 * Del original se conserva: el vídeo arranca como una ventana vertical pequeña en el centro (300 × 400 px), crece
 * con el scroll hasta ocupar toda la pantalla, la foto de fondo se desvanece con el progreso (opacity 1 − p), el
 * titular se parte en dos y cada mitad sale hacia un lado (translateX ±vw, con mix-blend-difference = textBlend),
 * la capa oscura sobre el vídeo se aclara al expandirse y el contenido final aparece solo al completar la expansión.
 * Adaptación: el original capturaba la rueda y el touch (preventDefault + window.scrollTo(0,0)) para avanzar la
 * expansión; aquí NO se secuestra el scroll: un escenario `sticky` dentro de un contenedor de 260vh mapea el scroll
 * normal de la página (useScroll) al progreso. La ventana crece con clip-path (sin recalcular layout en cada frame)
 * y el vídeo hace un leve zoom-out. Al completar, aparecen los controles del ReelPlayer (play/pausa, sonido bajo
 * demanda, barra navegable, pantalla completa). next/image → <img>, framer-motion → motion/react.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { contact, gallery } from "@/content/site";
import { Btn } from "@/core/ui";
import { cn } from "@/lib/utils";
import { ReelPlayer } from "./ReelPlayer";
import { EYEBROW, Eyebrow, LEAD, MAIN, useFull } from "./shared";

const BG = gallery.find((g) => g.includes("lanzamiento-coche")) ?? gallery[0];
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function useViewport() {
  const [vp, setVp] = useState(() => ({ w: typeof window !== "undefined" ? window.innerWidth : 1440, h: typeof window !== "undefined" ? window.innerHeight : 900 }));
  useEffect(() => {
    const on = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return vp;
}

function Outro() {
  return (
    <div className="u-wrap grid gap-8 pb-[var(--u-section-y)] pt-14 md:grid-cols-12 md:items-end md:pt-20">
      <p className="max-w-[44ch] text-[1.05rem] leading-relaxed text-white/75 md:col-span-7 md:text-lg">{LEAD}</p>
      <div className="text-white md:col-span-5 md:justify-self-end">
        <Btn href={contact.projectsUrl} kind="ghost">Ver proyectos <span aria-hidden>→</span></Btn>
      </div>
    </div>
  );
}

function StaticView() {
  return (
    <div className="bg-night text-white">
      <div className="u-wrap pt-[var(--u-section-y)]">
        <Eyebrow className="text-brand" />
        <h2 className="mt-4 text-[length:var(--u-h2)] font-extrabold leading-[.98] tracking-[-0.045em] text-white">Lo hacemos <span className="text-brand">realidad.</span></h2>
        <ReelPlayer video={MAIN} autoPlay={false} className="mt-10 aspect-video w-full rounded-2xl" />
      </div>
      <Outro />
    </div>
  );
}

/** Mitades del titular que se separan (en vw) con el progreso, como `textTranslateX` del original. */
const Half = ({ children, x, className }: { children: string; x: MotionValue<string>; className?: string }) => (
  <motion.span className={cn("block will-change-transform", className)} style={{ x }}>{children}</motion.span>
);

export default function ReelA() {
  const full = useFull();
  const wrap = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const { w, h } = useViewport();
  const mobile = w < 768;
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  // La expansión se completa al 70 % del recorrido; el 30 % restante deja el vídeo a pantalla completa.
  const p = useTransform(scrollYProgress, (v) => clamp01(v / 0.7));
  const [expanded, setExpanded] = useState(false);
  useMotionValueEvent(p, "change", (v) => setExpanded(v >= 0.98));

  // inert en los controles mientras la ventana aún está creciendo
  useEffect(() => {
    const el = media.current?.querySelector(".rp__ui");
    if (!el) return;
    if (expanded) el.removeAttribute("inert"); else el.setAttribute("inert", "");
  }, [expanded]);

  const w0 = mobile ? Math.min(w * 0.62, 300) : 300;
  const h0 = mobile ? Math.min(h * 0.5, 400) : 400;
  const clip = useTransform(p, (v) => {
    const e = v * v * (3 - 2 * v); // smoothstep
    const cw = w0 + (w - w0) * e, ch = h0 + (h - h0) * e;
    const r = 18 * (1 - e);
    return `inset(${(h - ch) / 2}px ${(w - cw) / 2}px ${(h - ch) / 2}px ${(w - cw) / 2}px round ${r}px)`;
  });
  const vScale = useTransform(p, [0, 1], [1.28, 1]);
  const shade = useTransform(p, [0, 1], [0.5, 0.08]);
  const bgOpacity = useTransform(p, (v) => 1 - v);
  const k = mobile ? 180 : 150;
  const left = useTransform(p, (v) => `-${v * k * 0.6}vw`);
  const right = useTransform(p, (v) => `${v * k * 0.6}vw`);
  const hint = useTransform(p, [0, 0.25], [1, 0]);

  if (!full) return <StaticView />;

  return (
    <div className="bg-night text-white">
      <div ref={wrap} className="relative h-[260vh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {/* Fondo fotográfico que se desvanece */}
          <motion.div className="absolute inset-0" style={{ opacity: bgOpacity }} aria-hidden>
            <img src={BG} alt="" className="h-full w-full scale-105 object-cover" decoding="async" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/45 to-night/80" />
          </motion.div>

          {/* Ventana del vídeo que crece hasta pantalla completa */}
          <motion.div ref={media} className="absolute inset-0 z-[1] shadow-[0_0_50px_rgba(0,0,0,.3)]" style={{ clipPath: clip }}>
            <motion.div className="h-full w-full" style={{ scale: vScale }}>
              <ReelPlayer video={MAIN} className="h-full w-full"
                uiClassName={cn("max-md:!bottom-24 !transition-[opacity,transform] !duration-500 md:!bottom-8 md:!left-8 md:!right-auto md:!w-[min(560px,60vw)]",
                  !expanded && "pointer-events-none translate-y-4 !opacity-0")} />
            </motion.div>
            <motion.div className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: shade }} aria-hidden />
          </motion.div>

          {/* Titular partido (mix-blend-difference) */}
          <div className="pointer-events-none absolute inset-0 z-[2] flex flex-col items-center justify-center text-center mix-blend-difference">
            <motion.p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand" style={{ x: right }}>{EYEBROW}</motion.p>
            <h2 className="text-[clamp(2.8rem,9vw,8.5rem)] font-extrabold leading-[.9] tracking-[-0.05em] text-white">
              <Half x={left}>Lo hacemos</Half>
              <Half x={right} className="text-brand">realidad.</Half>
            </h2>
            <motion.p className="mt-6 text-sm font-medium text-brand" style={{ x: left, opacity: hint }} aria-hidden>Desliza para expandir</motion.p>
          </div>

          {/* Contenido que aparece al completar la expansión */}
          <motion.div className="pointer-events-none absolute left-0 right-0 top-0 z-[3] bg-gradient-to-b from-black/55 to-transparent pb-20 pt-24 md:pt-28"
            initial={false} animate={{ opacity: expanded ? 1 : 0, y: expanded ? 0 : -12 }} transition={{ duration: 0.7 }} aria-hidden={!expanded}>
            <div className="u-wrap flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow className="text-brand" />
                <p className="mt-3 font-head text-[clamp(1.4rem,2.6vw,2.2rem)] font-semibold leading-tight tracking-[-0.03em] text-white">Showreel Unical</p>
              </div>
              <p className="max-w-[34ch] text-sm text-white/75">{MAIN.label}. Controla la reproducción, el sonido y la pantalla completa.</p>
            </div>
          </motion.div>
        </div>
      </div>
      <Outro />
    </div>
  );
}
