/**
 * HERO D · Minimal Luxury — basado en 21st.dev «Editorial Hero» (Hero05, id 19075).
 * Composición editorial en 12 columnas: tagline a la izquierda, titular y CTAs a la derecha y una banda
 * panorámica con máscara degradada. Adaptación: Poppins/Inter de marca en lugar de serif, `text-wrap: balance`
 * nativo en vez de react-wrap-balancer, vídeo real del Lexus Black Panther como panorámica, leve parallax.
 */
import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "motion/react";
import { hero, videos } from "@/content/site";
import { SmartVideo } from "@/core/ui";
import { HeroCopy, H1_LABEL, useFull } from "./shared";

const container: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } };
const item: Variants = { hidden: { opacity: 0, y: 14, filter: "blur(6px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } };
const media: Variants = { hidden: { opacity: 0, y: 30, filter: "blur(8px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } } };

export default function HeroD() {
  const full = useFull();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const anim = full ? { variants: container, initial: "hidden", animate: "visible" } : {};

  return (
    <div ref={ref} className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-navy text-white">
      <motion.div {...anim} className="u-wrap relative z-10 grid grid-cols-1 gap-10 pb-8 pt-28 md:pt-32 lg:grid-cols-12">
        <motion.div variants={item} className="flex flex-col justify-end gap-5 lg:col-span-4 lg:self-stretch">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand">{hero.eyebrow}</p>
          <p className="max-w-xs text-sm leading-relaxed text-white/60 [text-wrap:balance] md:text-base">
            Impresión, rotulación, stands y eventos con producción propia en Cabrera de Mar.
          </p>
        </motion.div>
        <motion.div variants={item} className="flex flex-col items-start gap-7 lg:col-span-7 lg:col-start-6">
          <h1 aria-label={H1_LABEL} className="text-[clamp(2.4rem,5.2vw,5.2rem)] font-semibold leading-[.98] tracking-[-0.045em] text-white [text-wrap:balance]">
            <span aria-hidden>Producción visual <span className="font-light italic text-brand">B2B</span>, del diseño al montaje.</span>
          </h1>
          <HeroCopy />
        </motion.div>
      </motion.div>

      <motion.div variants={full ? media : undefined} initial={full ? "hidden" : false} animate="visible" className="relative flex w-full flex-1 flex-col">
        <div className="relative min-h-[42svh] flex-1 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_100%)]">
          <motion.div style={full ? { scale, y } : undefined} className="absolute inset-0 origin-center">
            <SmartVideo video={videos.heroPanther} eager className="h-full w-full object-cover" ariaLabel={videos.heroPanther.label} />
          </motion.div>
          <div className="pointer-events-none absolute inset-0 bg-navy/10 mix-blend-overlay" />
          <p className="absolute bottom-4 right-[var(--u-gutter)] text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">{videos.heroPanther.label}</p>
        </div>
      </motion.div>
    </div>
  );
}
