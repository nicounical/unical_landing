/**
 * HERO B · Immersive 3D — basado en 21st.dev «Spatial Depth Hero» (id 30683).
 * Una pila de trabajos reales estalla en el espacio 3D con el scroll; la cámara se inclina con el cursor.
 * Adaptación: fotos reales de Unical, H1 + CTAs en el centro, tamaños de tarjeta para móvil, fallback estático.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionValueEvent, type MotionValue } from "motion/react";
import { finePointer } from "@/core/env";
import { HeroCopy, HeroEyebrow, H1_LABEL, HERO_IMAGES, useFull } from "./shared";

const COORDS = [
  { x: -28, y: -18, z: 250 }, { x: 30, y: -22, z: 150 }, { x: -32, y: 20, z: 80 }, { x: 28, y: 18, z: -50 },
  { x: -16, y: 28, z: -150 }, { x: 18, y: -32, z: -250 }, { x: -12, y: -30, z: -350 }, { x: 12, y: 32, z: -450 },
];
const PICK = [0, 1, 2, 8, 10, 12, 14, 9].map((k) => HERO_IMAGES[k % HERO_IMAGES.length]);
const CARDS = PICK.map((item, i) => {
  const c = COORDS[i];
  return {
    item,
    stacked: { x: 0, y: 0, z: i * 2, rz: (i - 3.5) * 4, ry: 0, rx: 0 },
    spatial: { x: c.x, y: c.y, z: c.z, rz: (i - 3.5) * 1.5, ry: c.x * -0.5, rx: c.y * 0.5 },
  };
});

function Card({ card, index, progress, active, hovered, setHovered }: {
  card: (typeof CARDS)[number]; index: number; progress: MotionValue<number>; active: boolean; hovered: number | null; setHovered: (n: number | null) => void;
}) {
  const { stacked: s, spatial: e, item } = card;
  const x = useTransform(progress, [0, 1], [s.x, e.x]);
  const y = useTransform(progress, [0, 1], [s.y, e.y]);
  const z = useTransform(progress, [0, 1], [s.z, e.z]);
  const rz = useTransform(progress, [0, 1], [s.rz, e.rz]);
  const ry = useTransform(progress, [0, 1], [s.ry, e.ry]);
  const rx = useTransform(progress, [0, 1], [s.rx, e.rx]);
  const scale = useTransform(progress, [0, 0.1, 1], [0, 0.65, 0.8]);
  const opacity = useTransform(progress, [0, 0.1, 1], [0, 1, 1]);
  const transform = useTransform([x, y, z, rx, ry, rz, scale] as MotionValue<number>[], ([tx, ty, tz, a, b, c, k]) =>
    `translate3d(calc(-50% + ${tx}vw), calc(-50% + ${ty}vh), ${tz}px) rotateX(${a}deg) rotateY(${b}deg) rotateZ(${c}deg) scale(${k})`);
  const dim = hovered !== null && hovered !== index;
  return (
    <motion.div className="pointer-events-none absolute left-1/2 top-1/2 h-[24vh] w-[30vw] md:h-[22vh] md:w-[15vw]" style={{ zIndex: s.z, opacity, transform }}>
      <motion.div
        className="pointer-events-auto h-full w-full cursor-pointer overflow-hidden rounded-[18px] shadow-2xl shadow-black/50 ring-1 ring-white/20"
        onMouseEnter={() => active && setHovered(index)} onMouseLeave={() => active && setHovered(null)}
        animate={{ opacity: dim ? 0.3 : 1, filter: dim ? "blur(6px) brightness(0.5)" : "blur(0px) brightness(1)" }}
        transition={{ duration: 0.3 }}
        whileHover={active ? { scale: 1.1, rotateX: 0, rotateY: 0, transition: { type: "spring", stiffness: 400, damping: 25 } } : undefined}
      >
        <img src={item.src} alt={item.title} loading={index < 3 ? "eager" : "lazy"} draggable={false} className="h-full w-full object-cover" />
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90">{item.kind}</span>
      </motion.div>
    </motion.div>
  );
}

export default function HeroB() {
  const full = useFull();
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [spread, setSpread] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 25, restDelta: 0.001 });
  const progress = useTransform(smooth, [0.05, 0.75], [0, 1]);
  useMotionValueEvent(progress, "change", (p) => setSpread(p > 0.8));

  const rawX = useMotionValue(0), rawY = useMotionValue(0);
  const tiltX = useSpring(rawX, { stiffness: 40, damping: 30 }), tiltY = useSpring(rawY, { stiffness: 40, damping: 30 });
  useEffect(() => {
    if (!full || !finePointer()) return;
    const on = (e: PointerEvent) => { rawX.set((e.clientY / innerHeight - 0.5) * -12); rawY.set((e.clientX / innerWidth - 0.5) * 12); };
    addEventListener("pointermove", on, { passive: true });
    return () => removeEventListener("pointermove", on);
  }, [full, rawX, rawY]);

  const textOpacity = useTransform(progress, [0, 0.25, 1], [1, 1, 0.25]);
  const textScale = useTransform(progress, [0, 1], [1, 0.85]);
  const textBlur = useTransform(progress, [0, 0.25, 1], ["blur(0px)", "blur(0px)", "blur(8px)"]);

  const Copy = (
    <>
      <HeroEyebrow />
      <h1 aria-label={H1_LABEL} className="mt-5 text-[clamp(2.8rem,7.5vw,7rem)] font-extrabold leading-[.92] tracking-[-0.05em] text-white">
        <span aria-hidden>Producción visual<br /><span className="text-brand">B2B.</span></span>
      </h1>
      <HeroCopy className="mt-7" align="center" />
    </>
  );

  if (!full) {
    return (
      <div className="relative overflow-hidden bg-night pb-20 pt-36 text-white">
        <div className="u-wrap flex flex-col items-center text-center">{Copy}</div>
        <div className="u-wrap mt-14 grid grid-cols-2 gap-3 md:grid-cols-4">
          {PICK.slice(0, 8).map((p) => <img key={p.src} src={p.src} alt={p.title} loading="lazy" className="aspect-[4/5] w-full rounded-2xl object-cover" />)}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative h-[320vh] w-full bg-night text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(46,108,160,.22),transparent_60%)]" />
      <div className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden" style={{ perspective: "1000px" }}>
        <motion.div className="absolute inset-0 z-10" style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}>
          {CARDS.map((c, i) => <Card key={i} index={i} card={c} progress={progress} active={spread} hovered={hovered} setHovered={setHovered} />)}
        </motion.div>
        <motion.div className="relative z-[5] flex flex-col items-center px-6 text-center" style={{ opacity: textOpacity, scale: textScale, filter: textBlur }}>
          {Copy}
        </motion.div>
        <p className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">Desliza para abrir el espacio</p>
      </div>
    </div>
  );
}
