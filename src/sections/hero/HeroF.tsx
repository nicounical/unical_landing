/**
 * HERO F · Editorial Kinetic — basado en 21st.dev «Hero Shutter Text» (id 9989).
 * Cada letra del titular entra «cortada» en tres franjas que barren en sentidos opuestos antes de asentarse.
 * Adaptación: dos líneas (PRODUCCIÓN / VISUAL B2B.) con nombre accesible único, colores de marca,
 * rejilla técnica + vídeo real a baja opacidad para que la portada nunca sea estática, botón de repetir accesible.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { videos } from "@/content/site";
import { SmartVideo } from "@/core/ui";
import { HeroCopy, HeroEyebrow, H1_LABEL, useFull } from "./shared";

const LINES = ["PRODUCCIÓN", "VISUAL B2B."];

function Shutter({ text, offset, size, full, accent }: { text: string; offset: number; size: string; full: boolean; accent?: boolean }) {
  const chars = text.split("");
  const cls = `${size} font-head font-black leading-[.86] tracking-[-0.05em]`;
  return (
    <div className="flex flex-wrap justify-center" aria-hidden>
      {chars.map((ch, k) => {
        const i = k + offset;
        const c = ch === " " ? " " : ch;
        return (
          <div key={k} className="relative overflow-hidden px-[0.05vw]">
            <motion.span className={`${cls} block ${accent && k >= 7 ? "text-brand" : "text-white"}`}
              initial={full ? { opacity: 0, filter: "blur(10px)" } : false} animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: i * 0.04 + 0.3, duration: 0.8 }}>{c}</motion.span>
            {full && ([
              ["0 0, 100% 0, 100% 35%, 0 35%", "-100%", "100%", 0, "#99C4E4"],
              ["0 35%, 100% 35%, 100% 65%, 0 65%", "100%", "-100%", 0.1, "#ffffff"],
              ["0 65%, 100% 65%, 100% 100%, 0 100%", "-100%", "100%", 0.2, "#2E6CA0"],
            ] as const).map(([clip, from, to, d, col], s) => (
              <motion.span key={s} className={`${cls} pointer-events-none absolute inset-0 z-10 block`} style={{ clipPath: `polygon(${clip})`, color: col }}
                initial={{ x: from, opacity: 0 }} animate={{ x: to, opacity: [0, 1, 0] }} transition={{ duration: 0.7, delay: i * 0.04 + d, ease: "easeInOut" }}>{c}</motion.span>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default function HeroF() {
  const full = useFull();
  const [count, setCount] = useState(0);
  return (
    <div className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-[#0b0b16] pb-16 pt-32 text-white">
      <div className="absolute inset-0 opacity-25"><SmartVideo video={videos.showreel} className="h-full w-full object-cover" /></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b16]/70 via-[#0b0b16]/60 to-[#0b0b16]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{ backgroundImage: "linear-gradient(to right,#99C4E4 1px,transparent 1px),linear-gradient(to bottom,#99C4E4 1px,transparent 1px)", backgroundSize: "clamp(24px,5vw,64px) clamp(24px,5vw,64px)" }} />

      <div className="relative z-10 flex w-full flex-col items-center px-4">
        <HeroEyebrow className="mb-8" />
        <h1 aria-label={H1_LABEL} className="w-full">
          <AnimatePresence mode="wait">
            <motion.div key={count} className="flex flex-col items-center">
              <Shutter text={LINES[0]} offset={0} size="text-[13.5vw] md:text-[11.5vw]" full={full} />
              <Shutter text={LINES[1]} offset={LINES[0].length} size="text-[13.5vw] md:text-[11.5vw]" full={full} accent />
            </motion.div>
          </AnimatePresence>
        </h1>
        <HeroCopy className="mt-10" align="center" />
      </div>

      {full && (
        <button type="button" onClick={() => setCount((c) => c + 1)} aria-label="Repetir animación del titular"
          className="absolute bottom-8 right-[var(--u-gutter)] z-20 grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white/80 transition hover:rotate-180 hover:bg-white hover:text-navy">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></svg>
        </button>
      )}
      <div className="absolute left-8 top-24 h-12 w-12 border-l border-t border-white/15" />
      <div className="absolute bottom-8 left-8 h-12 w-12 border-b border-l border-white/15" />
    </div>
  );
}
