/**
 * HERO A · Cinematic Premium — basado en 21st.dev «Scroll-Triggered Video Hero» (id 9701).
 * Capítulos de vídeo a pantalla completa que se funden con el scroll; píldora de capítulo con progreso.
 * Adaptación: vídeos reales de Unical, H1 en el primer capítulo, píldora dentro de la sección (no fija a la ventana),
 * sin grano, estático legible con reduced-motion.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence, type MotionValue } from "motion/react";
import { videos, hero, type Video } from "@/content/site";
import { SmartVideo } from "@/core/ui";
import { HeroCopy, HeroEyebrow, H1_LABEL, useFull } from "./shared";

type Chapter = { id: string; tag: string; title: string; text: string; video: Video };
const CHAPTERS: Chapter[] = [
  { id: "01", tag: "Producción visual B2B", title: "", text: hero.lead, video: videos.heroPanther },
  { id: "02", tag: "Car wrapping", title: "Vehículos que se convierten en campaña.", text: "Wrapping integral para lanzamientos y flotas con vinilos 3M y Avery, instalado por nuestro equipo.", video: videos.lexusRx },
  { id: "03", tag: "Eventos corporativos", title: "Escenarios que se recuerdan.", text: "Backdrops retroiluminados, photocalls y ambientación integral para presentaciones de marca.", video: videos.cirsa },
  { id: "04", tag: "Servicios 360°", title: "Del diseño al montaje, en casa.", text: "Impresión, rotulación, stands y retail con producción propia y montaje en toda España.", video: videos.showreel },
];

const ease = [0.16, 1, 0.3, 1] as const;

function Pill({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const p = useSpring(progress, { stiffness: 100, damping: 30 });
  return (
    <div className="flex w-max items-center gap-4 rounded-full border border-white/10 bg-black/70 py-2 pl-6 pr-2 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Capítulo {CHAPTERS[i].id} / 04</span>
        <AnimatePresence mode="wait">
          <motion.span key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="min-w-[150px] text-xs font-bold text-white">
            {CHAPTERS[i].tag}
          </motion.span>
        </AnimatePresence>
      </div>
      <svg className="h-11 w-11 -rotate-90" viewBox="0 0 48 48" aria-hidden>
        <circle cx="24" cy="24" r="18" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="2" />
        <motion.circle cx="24" cy="24" r="18" fill="none" stroke="#99C4E4" strokeWidth="2" style={{ pathLength: p }} />
      </svg>
    </div>
  );
}

export default function HeroA() {
  const full = useFull();
  const ref = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useEffect(() => scrollYProgress.on("change", (v) => setI(Math.min(CHAPTERS.length - 1, Math.floor(v * CHAPTERS.length)))), [scrollYProgress]);

  if (!full) {
    return (
      <div className="relative flex min-h-[100svh] items-end overflow-hidden bg-navy text-white">
        <img src={videos.heroPanther.poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
        <div className="u-wrap relative z-10 w-full pb-20 pt-40">
          <HeroEyebrow />
          <h1 aria-label={H1_LABEL} className="mt-5 text-[clamp(3rem,9vw,8rem)] font-extrabold leading-[.92] tracking-[-0.05em] text-white">PRODUCCIÓN<br />VISUAL <span className="text-brand">B2B.</span></h1>
          <HeroCopy className="mt-8" magnetic={false} />
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative bg-black text-white" style={{ height: `${CHAPTERS.length * 100}vh` }}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {CHAPTERS.map((c, k) => (
          <motion.div key={c.id} className="absolute inset-0" initial={false} animate={{ opacity: k === i ? 1 : 0 }} transition={{ duration: 1.2, ease: "easeInOut" }}>
            {Math.abs(k - i) <= 1 && <SmartVideo video={c.video} className="h-full w-full object-cover" eager={k === 0} staticFallback={false} />}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
          </motion.div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 z-30">
        {CHAPTERS.map((c, k) => (
          <div key={c.id} className="u-wrap flex h-screen items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-25%" }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }} className="pointer-events-auto max-w-4xl">
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }} className="mb-6 flex items-center gap-4">
                <span className="h-0.5 w-12 bg-brand" />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand">{k === 0 ? hero.eyebrow : `${c.id} · ${c.tag}`}</span>
              </motion.div>
              <div className="overflow-hidden py-2">
                {k === 0 ? (
                  <motion.h1 aria-label={H1_LABEL} variants={{ hidden: { y: "100%" }, visible: { y: "0%", transition: { duration: 0.9, ease } } }}
                    className="text-[clamp(3rem,9vw,8.5rem)] font-extrabold leading-[.9] tracking-[-0.05em] text-white">
                    <span aria-hidden>PRODUCCIÓN<br />VISUAL <span className="text-brand">B2B.</span></span>
                  </motion.h1>
                ) : (
                  <motion.h2 variants={{ hidden: { y: "100%" }, visible: { y: "0%", transition: { duration: 0.9, ease } } }}
                    className="text-[clamp(2.4rem,6vw,5.5rem)] font-extrabold leading-[.95] tracking-[-0.045em] text-white">{c.title}</motion.h2>
                )}
              </div>
              {k === 0 ? (
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3, ease } } }}>
                  <HeroCopy className="mt-6" />
                </motion.div>
              ) : (
                <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3, ease } } }}
                  className="mt-6 max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 text-lg font-light leading-relaxed text-white/85 shadow-2xl backdrop-blur-md">{c.text}</motion.p>
              )}
            </motion.div>
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 top-0 z-40 pointer-events-none">
        <div className="sticky top-[calc(100svh-6rem)] flex justify-center"><Pill i={i} progress={scrollYProgress} /></div>
      </div>
    </div>
  );
}
