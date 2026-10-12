/**
 * HERO E · High-Energy Motion — basado en 21st.dev «Hero Parallax» (Aceternity, id 1503).
 * Tres filas de trabajos reales caen inclinadas en perspectiva, se enderezan y se desplazan en sentidos
 * opuestos con el scroll. Adaptación: <img>/<a> en vez de next/image y next/link, titular y CTAs de Unical,
 * tamaños para móvil y fallback estático.
 */
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "motion/react";
import { projects } from "@/content/site";
import { HeroCopy, HeroEyebrow, H1_LABEL, HERO_IMAGES, useFull } from "./shared";

type P = { title: string; kind: string; thumbnail: string; link: string };
const PRODUCTS: P[] = HERO_IMAGES.slice(0, 15).map((h) => ({
  title: h.title, kind: h.kind, thumbnail: h.src,
  link: projects.items.find((p) => p.img === h.src)?.href ?? projects.allHref,
}));

function Card({ p, translate }: { p: P; translate: MotionValue<number> }) {
  return (
    <motion.div style={{ x: translate }} whileHover={{ y: -20 }} className="group/product relative h-56 w-[19rem] flex-shrink-0 md:h-96 md:w-[30rem]">
      <a href={p.link} className="block h-full w-full overflow-hidden rounded-xl group-hover/product:shadow-2xl">
        <img src={p.thumbnail} alt={p.title} loading="lazy" className="absolute inset-0 h-full w-full rounded-xl object-cover object-center" />
      </a>
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-navy opacity-0 transition-opacity group-hover/product:opacity-75" />
      <div className="pointer-events-none absolute bottom-4 left-4 opacity-0 transition-opacity group-hover/product:opacity-100">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">{p.kind}</p>
        <h2 className="text-lg font-bold text-white">{p.title}</h2>
      </div>
    </motion.div>
  );
}

function Header() {
  return (
    <div className="u-wrap relative z-20 w-full pb-16 pt-36 md:pb-32 md:pt-44">
      <HeroEyebrow />
      <h1 aria-label={H1_LABEL} className="mt-5 text-[clamp(3rem,9vw,8.5rem)] font-extrabold leading-[.9] tracking-[-0.05em] text-white">
        <span aria-hidden>PRODUCCIÓN<br />VISUAL <span className="text-brand">B2B.</span></span>
      </h1>
      <HeroCopy className="mt-8" />
    </div>
  );
}

export default function HeroE() {
  const full = useFull();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const cfg = { stiffness: 300, damping: 30, bounce: 100 };
  const tx = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), cfg);
  const txr = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), cfg);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), cfg);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), cfg);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), cfg);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 500]), cfg);

  if (!full) {
    return (
      <div className="relative overflow-hidden bg-navy pb-20 text-white">
        <Header />
        <div className="u-wrap grid grid-cols-2 gap-3 md:grid-cols-3">
          {PRODUCTS.slice(0, 6).map((p) => <img key={p.thumbnail} src={p.thumbnail} alt={p.title} loading="lazy" className="aspect-[4/3] w-full rounded-xl object-cover" />)}
        </div>
      </div>
    );
  }

  const rows = [PRODUCTS.slice(0, 5), PRODUCTS.slice(5, 10), PRODUCTS.slice(10, 15)];
  return (
    <div ref={ref} className="relative flex h-[260vh] flex-col overflow-hidden bg-navy pb-40 antialiased [perspective:1000px] md:h-[300vh]">
      <Header />
      <motion.div className="relative z-0" style={{ rotateX, rotateZ, translateY, opacity }}>
        <div className="mb-10 flex flex-row-reverse gap-10 md:mb-20 md:gap-20">{rows[0].map((p) => <Card key={p.thumbnail} p={p} translate={tx} />)}</div>
        <div className="mb-10 flex flex-row gap-10 md:mb-20 md:gap-20">{rows[1].map((p) => <Card key={p.thumbnail} p={p} translate={txr} />)}</div>
        <div className="flex flex-row-reverse gap-10 md:gap-20">{rows[2].map((p) => <Card key={p.thumbnail} p={p} translate={tx} />)}</div>
      </motion.div>
    </div>
  );
}
