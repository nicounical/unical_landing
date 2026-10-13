/**
 * HERO C · Experimental Creative — basado en 21st.dev «Scroll Morph Hero» (id 9583).
 * 20 trabajos reales se dispersan, forman una línea y un círculo; con el scroll el círculo se abre en un arco
 * que se desplaza mostrando más proyectos. Cada tarjeta gira al pasar el ratón y enseña el tipo de trabajo.
 * Adaptación: el scroll virtual del original (que secuestraba la rueda) se sustituye por scroll real de página
 * con una escena fijada; el H1 es visible desde el primer fotograma.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValue } from "motion/react";
import { finePointer } from "@/core/env";
import { HeroCopy, HeroEyebrow, H1_LABEL, HERO_IMAGES, useFull } from "./shared";

type Phase = "scatter" | "line" | "circle";
const N = 20;
const ITEMS = HERO_IMAGES.slice(0, N);
const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;

function FlipCard({ item, i, target, w, h }: { item: (typeof ITEMS)[number]; i: number; target: { x: number; y: number; rotation: number; scale: number; opacity: number }; w: number; h: number }) {
  return (
    <motion.div animate={{ x: target.x, y: target.y, rotate: target.rotation, scale: target.scale, opacity: target.opacity }}
      transition={{ type: "spring", stiffness: 40, damping: 15 }}
      style={{ position: "absolute", width: w, height: h, transformStyle: "preserve-3d", perspective: 1000 }} className="group cursor-pointer">
      <motion.div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }} whileHover={{ rotateY: 180 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
        <div className="absolute inset-0 overflow-hidden rounded-xl bg-charcoal shadow-lg" style={{ backfaceVisibility: "hidden" }}>
          <img src={item.src} alt={item.title} loading={i < 8 ? "eager" : "lazy"} draggable={false} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-navy p-2 text-center shadow-lg"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <p className="mb-1 text-[7px] font-bold uppercase tracking-[0.18em] text-brand">{item.kind}</p>
          <p className="text-[9px] font-semibold leading-tight text-white">{item.title}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HeroC() {
  const full = useFull();
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>(full ? "scatter" : "circle");
  const [box, setBox] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const read = () => setBox({ width: el.offsetWidth, height: el.offsetHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!full) return;
    const t1 = setTimeout(() => setPhase("line"), 400);
    const t2 = setTimeout(() => setPhase("circle"), 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [full]);

  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const morph = useSpring(useTransform(scrollYProgress, [0, 0.3], [0, 1]), { stiffness: 40, damping: 20 });
  const rotate = useSpring(useTransform(scrollYProgress, [0.3, 1], [0, 1]), { stiffness: 40, damping: 20 });
  const mouse = useMotionValue(0);
  const smoothMouse = useSpring(mouse, { stiffness: 30, damping: 20 });
  const [m, setM] = useState(0), [r, setR] = useState(0), [px, setPx] = useState(0);
  useEffect(() => {
    const a = morph.on("change", setM), b = rotate.on("change", setR), c = smoothMouse.on("change", setPx);
    return () => { a(); b(); c(); };
  }, [morph, rotate, smoothMouse]);
  useEffect(() => {
    const el = stage.current;
    if (!el || !full || !finePointer()) return;
    const on = (e: MouseEvent) => { const rc = el.getBoundingClientRect(); mouse.set(((e.clientX - rc.left) / rc.width * 2 - 1) * 100); };
    el.addEventListener("mousemove", on);
    return () => el.removeEventListener("mousemove", on);
  }, [full, mouse]);

  const scatter = useMemo(() => ITEMS.map(() => ({ x: (Math.random() - 0.5) * 1500, y: (Math.random() - 0.5) * 1000, rotation: (Math.random() - 0.5) * 180, scale: 0.6, opacity: 0 })), []);
  const contentOpacity = useTransform(morph, [0.75, 1], [0, 1]);
  const contentY = useTransform(morph, [0.75, 1], [24, 0]);
  const introOpacity = useTransform(morph, [0, 0.45], [1, 0]);

    const mobile = box.width < 768;
  const W = mobile ? 52 : 70, H = mobile ? 74 : 100;

  const targetFor = (i: number) => {
    if (phase === "scatter") return scatter[i];
    if (phase === "line") { const sp = W + 12; return { x: i * sp - (N * sp) / 2, y: 0, rotation: 0, scale: 1, opacity: 1 }; }
    const minD = Math.min(box.width, box.height);
    const cr = mobile ? box.width * 0.44 : Math.min(minD * 0.36, 360);
    const ca = (i / N) * 360, crad = (ca * Math.PI) / 180;
    const circle = { x: Math.cos(crad) * cr, y: Math.sin(crad) * cr, rotation: ca + 90 };
    const arcR = Math.min(box.width, box.height * 1.5) * (mobile ? 1.4 : 1.1);
    const apex = box.height * (mobile ? 0.38 : 0.3);
    const spread = mobile ? 100 : 130, start = -90 - spread / 2, step = spread / (N - 1);
    const ang = start + i * step - r * spread * 0.8, rad = (ang * Math.PI) / 180;
    const arc = { x: Math.cos(rad) * arcR + px, y: Math.sin(rad) * arcR + apex + arcR, rotation: ang + 90, scale: mobile ? 1.4 : 1.8 };
    return { x: lerp(circle.x, arc.x, m), y: lerp(circle.y, arc.y, m), rotation: lerp(circle.rotation, arc.rotation, m), scale: lerp(1, arc.scale, m), opacity: 1 };
  };

  return (
    <div ref={wrap} className={full ? "relative h-[300vh] bg-night" : "relative bg-night"}>
      <div ref={stage} className={full ? "sticky top-0 h-[100svh] overflow-hidden" : "relative h-[100svh] min-h-[640px] overflow-hidden"}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(46,108,160,.25),transparent_55%)]" />
        <div className="relative flex h-full w-full items-center justify-center">
          {ITEMS.map((it, i) => <FlipCard key={it.src} item={it} i={i} w={W} h={H} target={targetFor(i)} />)}
        </div>

        <motion.div style={{ opacity: full ? introOpacity : 1 }} className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
          <motion.div initial={full ? { opacity: 0, y: 20, filter: "blur(10px)" } : false} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 1, delay: 0.3 }}>
            <HeroEyebrow className="justify-center" />
            <h1 aria-label={H1_LABEL} className="mt-4 text-[1.7rem] md:text-[clamp(2.2rem,5.5vw,4.6rem)] font-extrabold leading-[.95] tracking-[-0.045em] text-white">
              <span aria-hidden>Producción visual <span className="text-brand">B2B.</span></span>
            </h1>
            {full && <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Desliza para explorar</p>}
          </motion.div>
          {!full && <HeroCopy className="pointer-events-auto mt-6" align="center" magnetic={false} />}
        </motion.div>

        {full && (
          <motion.div style={{ opacity: contentOpacity, y: contentY }} className="absolute inset-x-0 top-[13%] z-20 flex flex-col items-center px-6 text-center">
            <p className="text-[clamp(1.6rem,3.6vw,3rem)] font-head font-bold leading-tight tracking-[-0.03em] text-white">Más de 25 años produciendo<br className="hidden md:block" /> para marcas en toda España.</p>
            <HeroCopy className="mt-5" align="center" />
          </motion.div>
        )}
      </div>
    </div>
  );
}
