/**
 * CLIENTES A · Cinematic Premium — basado en 21st.dev «Logo Cloud 3» (id 28279, Hirael · Mohammad Shehadeh).
 * Del original se conserva: tira tranquila de marcas tipográficas (icono + nombre) en `flex-wrap` centrado, apagadas
 * por defecto y que se iluminan al pasar el cursor; entrada `fade + slide-in-from-bottom` con curva
 * cubic-bezier(0.22,1,0.36,1) y escalonado por bloques (lista → separador → figura); separador horizontal entre
 * bloques y una figura centrada como cierre.
 * Adaptación: los siete logotipos ficticios con iconos lucide pasan a ser los 25 clientes reales de site.ts con su
 * favicon real (ClientMark); la cita con avatar y atribución se elimina (no hay testimonios) y la figura pasa a ser
 * la única cifra existente («+3.000 proyectos» + su texto). Tratamiento cinematográfico: fondo noche con halo de marca,
 * entrada con desenfoque, separador que se abre desde el centro y, con ratón, la marca señalada se ilumina mientras
 * el resto se apaga aún más (en táctil, todas quedan legibles sin interacción).
 */
import { useState, type CSSProperties } from "react";
import { motion } from "motion/react";
import { projects } from "@/content/site";
import { cn } from "@/lib/utils";
import { ClientMark } from "./ClientMark";
import { ArrowUR } from "@/sections/services/shared";
import { CLIENTS, Eyebrow, FOOT, FOOT_TEXT, LEAD, TITLE, useFull } from "./shared";

const ease = [0.22, 1, 0.36, 1] as const;
const MARK: CSSProperties = { fontSize: "clamp(1.05rem, 1.55vw, 1.4rem)" };

function Head() {
  return (
    <header className="mx-auto flex max-w-3xl flex-col items-center text-center">
      <Eyebrow className="text-brand" />
      <h2 className="mt-6 text-[clamp(2.3rem,5.4vw,4.6rem)] font-extrabold leading-[0.98] tracking-[-0.045em] text-white">{TITLE}</h2>
      <p className="mt-6 max-w-[52ch] text-[1.02rem] leading-relaxed text-white/60">{LEAD}</p>
    </header>
  );
}

function Figure() {
  return (
    <figure className="flex flex-col items-center gap-5 text-center">
      <p className="bg-gradient-to-b from-white via-white to-brand/70 bg-clip-text font-head text-[clamp(3.4rem,10vw,8.5rem)] font-extrabold leading-[0.9] tracking-[-0.06em] text-transparent">
        {FOOT}
      </p>
      <figcaption className="max-w-[40ch] text-[1.02rem] leading-relaxed text-white/60">{FOOT_TEXT}</figcaption>
      <a href={projects.allHref} className="group mt-2 inline-flex min-h-[44px] items-center gap-3 border-b border-white/25 text-sm font-medium text-white transition-colors hover:border-white">
        Ver proyectos <ArrowUR className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </figure>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden bg-night py-[var(--u-section-y)] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(46,108,160,.30),transparent_70%)]" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_60%_60%_at_50%_100%,rgba(153,196,228,.10),transparent_70%)]" aria-hidden />
      <div className="u-wrap relative">{children}</div>
    </div>
  );
}

function StaticView() {
  return (
    <Shell>
      <Head />
      <ul aria-label="Clientes" className="cl-chip mx-auto mt-16 flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
        {CLIENTS.map((c) => <li key={c.name} className="text-white/70"><ClientMark c={c} style={MARK} /></li>)}
      </ul>
      <hr className="mx-auto mt-16 max-w-5xl border-0 border-t border-white/15" />
      <div className="mt-16"><Figure /></div>
    </Shell>
  );
}

export default function ClientsA() {
  const full = useFull();
  const [hot, setHot] = useState<number | null>(null);
  if (!full) return <StaticView />;

  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 24, filter: "blur(10px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true, margin: "-12% 0px" },
    transition: { duration: 0.9, ease, delay },
  });

  return (
    <Shell>
      <motion.div {...enter(0)}><Head /></motion.div>

      <ul aria-label="Clientes" className="cl-chip mx-auto mt-16 flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14"
        onPointerLeave={() => setHot(null)}>
        {CLIENTS.map((c, i) => (
          <motion.li key={c.name}
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.7, ease, delay: 0.15 + i * 0.035 }}
            onPointerEnter={(e) => { if (e.pointerType === "mouse") setHot(i); }}
            className={cn(
              "transition-[color,opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              hot === null ? "text-white/60" : hot === i ? "-translate-y-0.5 text-white" : "text-white/25",
            )}>
            <ClientMark c={c} style={MARK} />
          </motion.li>
        ))}
      </ul>

      <motion.hr className="mx-auto mt-16 max-w-5xl origin-center border-0 border-t border-white/15"
        initial={{ scaleX: 0, opacity: 0 }} whileInView={{ scaleX: 1, opacity: 1 }} viewport={{ once: true }}
        transition={{ duration: 1.4, ease, delay: 0.3 }} />

      <motion.div className="mt-16" {...enter(0.2)}><Figure /></motion.div>
    </Shell>
  );
}
