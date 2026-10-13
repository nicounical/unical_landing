/**
 * PROCESO D · Minimal Luxury — basado en 21st.dev «Process Timeline» (id 28381, timeline-05).
 * Del original se conserva: línea vertical (border-l) con círculos centrados sobre ella (-translate-x-1/2, ring del
 * color de fondo para «cortar» la línea), check en las etapas completadas y número en las pendientes, bloques de
 * título + descripción con pl-10/pb-10 y el último sin padding inferior.
 * Adaptación: el estado «completed» deja de ser estático y lo marca el scroll: la línea se rellena de tinta con el
 * avance (scaleY) y cada círculo pasa de número a check cuando la línea lo alcanza (centro de la pantalla). Columna
 * izquierda fija con titular de peso ligero, entrada y CTA; cada etapa suma sus etiquetas reales y una foto apaisada
 * que se revela con cortinilla. Paleta papel/tinta, sin sombras. Estático: todas las etapas completadas y línea llena.
 */
import { useRef, useState } from "react";
import { motion, useInView, useMotionValueEvent, useScroll } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CtaLink, Eyebrow, LEAD, N, PHASES, TITLE, pad, useFull } from "./shared";

const ease = [0.22, 1, 0.36, 1] as const;

function Step({ i, full }: { i: number; full: boolean }) {
  const p = PHASES[i];
  const ref = useRef<HTMLLIElement>(null);
  // completada cuando la línea (centro de pantalla) alcanza el círculo
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const [passed, setPassed] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => setPassed(v > 0));
  const seen = useInView(ref, { once: true, amount: 0.25 });
  const completed = !full || passed;
  return (
    <li ref={ref} className="relative pb-16 pl-10 last:pb-0 md:pb-20 md:pl-14">
      <div className={cn("absolute left-px top-0 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border ring-8 ring-paper transition-colors duration-500",
        completed ? "border-ink bg-ink text-paper" : "border-ink/25 bg-paper text-ink/60")} aria-hidden>
        {completed ? <Check className="h-[18px] w-[18px]" strokeWidth={2} /> : <span className="text-[15px] font-medium tabular-nums">{i + 1}</span>}
      </div>
      <div className="pt-1.5">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/45">{p.n} — {pad(N)}</p>
        <h3 className="mt-3 font-sans text-[clamp(1.6rem,2.6vw,2.2rem)] font-normal leading-[1.05] tracking-[-0.035em] text-ink">{p.title}</h3>
        <p className="mt-3 max-w-[46ch] text-[1.05rem] leading-relaxed text-ink/65">{p.text}</p>
        <p className="mt-4 text-[12px] uppercase tracking-[0.18em] text-ink/45">{p.tags.join("  ·  ")}</p>
        <div className="mt-7 overflow-hidden rounded-[2px]">
          <motion.img src={p.img} alt={p.alt} loading="lazy" decoding="async" className="aspect-[21/9] w-full object-cover"
            initial={full ? { clipPath: "inset(0% 100% 0% 0%)", scale: 1.08 } : false}
            animate={seen || !full ? { clipPath: "inset(0% 0% 0% 0%)", scale: 1 } : undefined}
            transition={{ duration: 1.3, ease }} />
        </div>
      </div>
    </li>
  );
}

export default function ProcessD() {
  const full = useFull();
  const line = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: line, offset: ["start center", "end center"] });

  return (
    <div className="bg-paper py-[var(--u-section-y)] text-ink">
      <div className="u-wrap grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[18vh]">
            <Eyebrow className="text-ink/60" />
            <h2 className="mt-6 max-w-[12ch] font-sans text-[clamp(2.4rem,4.6vw,4.2rem)] font-normal leading-[1.02] tracking-[-0.05em] text-ink">{TITLE}</h2>
            <p className="mt-6 max-w-[40ch] text-[1.02rem] leading-relaxed text-ink/60">{LEAD}</p>
            <CtaLink className="mt-6 border-b border-ink/25 text-ink hover:border-ink" />
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="relative ml-5 md:ml-6">
            <div className="absolute inset-y-0 left-0 border-l border-ink/15" aria-hidden />
            <motion.div className="absolute inset-y-0 left-0 w-px origin-top bg-ink" style={{ scaleY: full ? scrollYProgress : 1 }} aria-hidden />
            <ol ref={line} className="relative">
              {PHASES.map((p, i) => <Step key={p.n} i={i} full={full} />)}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
