/**
 * CLIENTES D · Minimal Luxury — basado en 21st.dev «Logo Cloud 10» (id 21468).
 * Del original se conserva: frase centrada sobre una rejilla con borde exterior y celdas separadas por bordes
 * (2 columnas en móvil), celdas impares con fondo apagado (`odd:bg-muted/60`), marcas centradas con relleno
 * vertical generoso y las ocho líneas discontinuas que prolongan las esquinas hacia fuera y se desvanecen con máscara.
 * Adaptación: los seis logotipos SVG de ejemplo pasan a ser los 25 clientes reales (marca tipográfica + favicon real
 * en gris que recupera su color al señalar la celda); 5 columnas en escritorio para que 25 cierre la rejilla
 * (la última celda ocupa dos columnas en móvil); «Trusted by teams…» sustituido por el título y la entrada reales de
 * site.ts y la cifra «+3.000 proyectos» al pie. Papel cálido de marca, tipografía contenida y aparición muy suave.
 */
import type { CSSProperties } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ClientMark } from "./ClientMark";
import { CLIENTS, Eyebrow, FOOT, FOOT_TEXT, LEAD, TITLE, useFull } from "./shared";

const ease = [0.22, 1, 0.36, 1] as const;
const MARK: CSSProperties = { fontSize: "clamp(.92rem, 1.2vw, 1.08rem)", fontWeight: 600, letterSpacing: "-.015em" };
const fade = (dir: "l" | "r" | "t" | "b"): CSSProperties => {
  const to = { l: "to left", r: "to right", t: "to top", b: "to bottom" }[dir];
  const m = `linear-gradient(${to}, #000, transparent)`;
  return { maskImage: m, WebkitMaskImage: m };
};

function Corners() {
  const h = "pointer-events-none absolute w-6 border-b border-dashed border-ink/25 sm:w-12";
  const v = "pointer-events-none absolute h-6 border-s border-dashed border-ink/25 sm:h-12";
  return (
    <div aria-hidden>
      <div className={cn(h, "left-0 top-0 -translate-x-full")} style={fade("l")} />
      <div className={cn(h, "right-0 top-0 translate-x-full")} style={fade("r")} />
      <div className={cn(h, "bottom-0 left-0 -translate-x-full translate-y-px")} style={fade("l")} />
      <div className={cn(h, "bottom-0 right-0 translate-x-full translate-y-px")} style={fade("r")} />
      <div className={cn(v, "left-0 top-0 -translate-y-full")} style={fade("t")} />
      <div className={cn(v, "right-0 top-0 -translate-y-full translate-x-[-1px]")} style={fade("t")} />
      <div className={cn(v, "bottom-0 left-0 translate-y-full")} style={fade("b")} />
      <div className={cn(v, "bottom-0 right-0 translate-y-full translate-x-[-1px]")} style={fade("b")} />
    </div>
  );
}

export default function ClientsD() {
  const full = useFull();
  const cell = (i: number) => cn(
    "cl-cell flex w-full items-center justify-center border-b border-e border-ink/10 px-3 py-7 transition-colors duration-500 hover:bg-white sm:py-9",
    i % 2 === 0 ? "bg-paper/70" : "bg-white/40",
    "max-lg:last:col-span-2",
  );

  return (
    <div className="bg-[#FAF9F6] py-[var(--u-section-y)] text-ink">
      <div className="u-wrap">
        <header className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <Eyebrow className="text-brand-strong" />
          <h2 className="mt-6 text-[clamp(2rem,4.2vw,3.5rem)] font-semibold leading-[1.04] tracking-[-0.045em] text-ink">{TITLE}</h2>
          <p className="mt-5 max-w-[50ch] text-balance text-[1rem] leading-relaxed text-ink/60">{LEAD}</p>
        </header>

        <div className="relative mx-auto mt-14 max-w-5xl sm:mt-20">
          <ul aria-label="Clientes" className="cl-mono grid grid-cols-2 border-s border-t border-ink/10 shadow-[0_1px_2px_rgba(22,22,31,.04)] lg:grid-cols-5">
            {CLIENTS.map((c, i) => full ? (
              <motion.li key={c.name} className={cell(i)}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-6% 0px" }}
                transition={{ duration: 1.1, ease, delay: (i % 5) * 0.06 + Math.floor(i / 5) * 0.08 }}>
                <ClientMark c={c} className="cl-wrap text-ink/80" style={MARK} />
              </motion.li>
            ) : (
              <li key={c.name} className={cell(i)}><ClientMark c={c} className="cl-wrap text-ink/80" style={MARK} /></li>
            ))}
          </ul>
          <Corners />
        </div>

        <p className="mx-auto mt-14 max-w-xl text-center text-[15px] leading-relaxed text-ink/60 sm:mt-20">
          <span className="font-head font-semibold tracking-[-0.02em] text-ink">{FOOT}</span> {FOOT_TEXT}
        </p>
      </div>
    </div>
  );
}
