/**
 * PROYECTOS B · Immersive 3D — basado en 21st.dev «Panoramic Spread Hero» (id 30669).
 * Del original se conserva: escena `sticky` con perspectiva 1200 px, tarjetas tipo polaroid que parten apiladas
 * (x/y/rotateZ escalonados, escala 0.75) y se despliegan en un arco panorámico 3D (x por desplazamiento, caída en y
 * según |offset|, rotateY −12° por posición, escala decreciente) con la curva en S del original sobre el progreso de
 * scroll suavizado por muelle; inclinación de toda la escena con el puntero (rotateX/rotateY con muelle) solo cuando
 * el arco está desplegado; tamaños y arco distintos en móvil; hover que aclara la foto y la amplía.
 * Adaptación: 400vh → 230vh (un único pin corto, scroll nativo de la página, sin secuestrar la rueda); fotos de
 * Unsplash → los 8 proyectos reales, cada tarjeta es un enlace a su proyecto con pie (título + tipo de trabajo);
 * el titular deja de aparecer detrás de las tarjetas y vive arriba con el enlace «Ver todos los proyectos».
 * Sin movimiento: el arco se muestra ya desplegado, sin pin ni inclinación.
 */
import { useEffect, useRef, useState } from "react";
import {
  motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue,
} from "motion/react";
import { finePointer } from "@/core/env";
import { AllLink, EYEBROW, useFull, Eyebrow, ITEMS, LEAD, TITLE, type Item } from "./shared";

type Pose = { x: number; y: number; rotateZ: number; rotateY: number; scale: number };
type Layout = { stacked: Pose; panoramic: Pose };

const PROGRESS_SPRING = { stiffness: 80, damping: 25, mass: 0.5, restDelta: 0.001 };
const PARALLAX_SPRING = { stiffness: 50, damping: 25, mass: 0.5 };

const CARDS = ITEMS.map((item, i) => {
  const offset = i - (ITEMS.length - 1) / 2;
  const abs = Math.abs(offset);
  return {
    item,
    z: Math.round(10 - abs),
    desktop: {
      stacked: { x: offset * 1.6, y: offset * -1.6, rotateZ: offset * 2.5, rotateY: 0, scale: 1 },
      panoramic: { x: offset * 13.2, y: abs * 3, rotateZ: offset * 1.5, rotateY: offset * -12, scale: 1 - abs * 0.05 },
    } as Layout,
    mobile: {
      stacked: { x: offset * 1.5, y: offset * -1.5, rotateZ: offset * 3, rotateY: 0, scale: 1 },
      panoramic: { x: offset * 15, y: abs * 3.2, rotateZ: offset * 2, rotateY: offset * -15, scale: 1 - abs * 0.04 },
    } as Layout,
  };
});

/** Curva en S del original. */
const sCurve = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

function Card({ card, progress, mobile }: { card: (typeof CARDS)[number]; progress: MotionValue<number>; mobile: boolean }) {
  const { stacked, panoramic } = mobile ? card.mobile : card.desktop;
  const e = useTransform(progress, sCurve);
  const x = useTransform(e, [0, 1], [stacked.x, panoramic.x], { clamp: false });
  const y = useTransform(e, [0, 1], [stacked.y, panoramic.y], { clamp: false });
  const xs = useTransform(x, (v) => `${v}vw`);
  const ys = useTransform(y, (v) => `${v}vh`);
  const rotateZ = useTransform(e, [0, 1], [stacked.rotateZ, panoramic.rotateZ]);
  const rotateY = useTransform(e, [0, 1], [stacked.rotateY, panoramic.rotateY]);
  const scale = useTransform(e, [0, 1], [0.75, panoramic.scale]);
  const it: Item = card.item;
  const w = mobile ? 44 : 19; // vw
  const h = mobile ? 28 : 36; // vh

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2" style={{ zIndex: card.z }}>
      <motion.a href={it.href} aria-label={`${it.title} · ${it.kind}`}
        className="group pointer-events-auto block rounded-md shadow-2xl shadow-navy/20 will-change-transform focus-visible:outline-brand-strong"
        style={{ width: `${w}vw`, height: `max(${h}vh, ${mobile ? 190 : 300}px)`, marginLeft: `-${w / 2}vw`, marginTop: `min(-${h / 2}vh, -${mobile ? 95 : 150}px)`, x: xs, y: ys, rotateZ, rotateY, scale, transformOrigin: "center center -50px" }}>
        <div className="flex h-full w-full flex-col overflow-hidden rounded-md bg-white p-1 ring-1 ring-navy/5 transition-[transform,box-shadow] duration-500 group-hover:-translate-y-2 group-focus-visible:-translate-y-2 group-hover:shadow-navy/30 md:p-2">
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-sm bg-line">
            <div className="pointer-events-none absolute inset-0 z-10 bg-navy/15 transition-colors duration-500 group-hover:bg-transparent" />
            <img src={it.img} alt={it.alt} loading="lazy" draggable={false}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div className="hidden min-w-0 items-baseline justify-between gap-3 px-1 pb-0.5 pt-2.5 md:flex">
            <span className="truncate text-[12px] font-semibold tracking-[-0.01em] text-ink">{it.title}</span>
            <span className="flex-none text-[10px] uppercase tracking-[0.12em] text-ink/45">{it.kind.split(" ")[0]}</span>
          </div>
        </div>
      </motion.a>
    </div>
  );
}

function Scene({ progress, tiltX, tiltY, mobile }: { progress: MotionValue<number>; tiltX?: MotionValue<number>; tiltY?: MotionValue<number>; mobile: boolean }) {
  return (
    <motion.ul className="absolute inset-0 z-10 m-0 list-none" style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }} aria-label={`${EYEBROW}: ${ITEMS.length} proyectos`}>
      {CARDS.map((c) => (
        <li key={c.item.id}><Card card={c} progress={progress} mobile={mobile} /></li>
      ))}
    </motion.ul>
  );
}

function Head({ fade }: { fade?: { y: MotionValue<string> } }) {
  return (
    <motion.div className="relative z-20 mx-auto flex max-w-3xl flex-col items-center px-5 text-center" style={fade}>
      <Eyebrow className="text-brand-strong" />
      <h2 className="mt-4 text-[clamp(2rem,4.4vw,3.8rem)] font-extrabold leading-[1.02] tracking-[-0.05em] text-ink [text-wrap:balance]">{TITLE}</h2>
      <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-charcoal/75">{LEAD}</p>
    </motion.div>
  );
}

function useIsMobile() {
  const [m, setM] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  useEffect(() => {
    const on = () => setM(window.innerWidth < 768);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return m;
}

const BG = "bg-[radial-gradient(120%_80%_at_50%_60%,#FFFFFF_0%,#F6F8FB_55%,#E9EEF5_100%)]";

function StaticView() {
  const mobile = useIsMobile();
  const one = useMotionValue(1);
  return (
    <div className={`${BG} overflow-hidden py-[var(--u-section-y)]`}>
      <Head />
      <div className="relative mt-6 h-[min(64svh,560px)] min-h-[420px]" style={{ perspective: "1200px" }}>
        <Scene progress={one} mobile={mobile} />
      </div>
      <div className="mt-4 flex justify-center text-ink"><AllLink /></div>
    </div>
  );
}

function MotionView() {
  const wrap = useRef<HTMLDivElement>(null);
  const mobile = useIsMobile();
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, PROGRESS_SPRING);
  const progress = useTransform(smooth, [0.08, 0.78], [0, 1]);

  // Inclinación con el puntero solo con el arco desplegado (como el original)
  const [spread, setSpread] = useState(false);
  useMotionValueEvent(progress, "change", (p) => setSpread(p > 0.95));
  const rawX = useMotionValue(0), rawY = useMotionValue(0);
  const tiltX = useSpring(rawX, PARALLAX_SPRING), tiltY = useSpring(rawY, PARALLAX_SPRING);
  useEffect(() => {
    if (!spread || !finePointer()) { rawX.set(0); rawY.set(0); return; }
    const move = (e: PointerEvent) => {
      rawX.set((e.clientY / window.innerHeight - 0.5) * -8);
      rawY.set((e.clientX / window.innerWidth - 0.5) * 8);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [spread, rawX, rawY]);

  const headY = useTransform(progress, [0, 1], ["4vh", "0vh"]);
    const hint = useTransform(progress, [0, 0.25], [1, 0]);

  return (
    <div ref={wrap} className={`relative h-[230vh] ${BG}`}>
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pt-[max(5.5rem,11vh)]">
        <Head fade={{ y: headY }} />
        <div className="relative min-h-0 flex-1" style={{ perspective: "1200px" }}>
          <Scene progress={progress} tiltX={tiltX} tiltY={tiltY} mobile={mobile} />
        </div>
        <div className="relative z-20 flex flex-col items-center gap-1 pb-[max(1.5rem,4vh)] text-ink">
          <motion.p aria-hidden style={{ opacity: hint }} className="text-[10px] font-semibold uppercase tracking-[0.3em] text-ink/45">Desplaza para desplegar</motion.p>
          <AllLink />
        </div>
      </div>
    </div>
  );
}

export default function ProjectsB() {
  return useFull() ? <MotionView /> : <StaticView />;
}

