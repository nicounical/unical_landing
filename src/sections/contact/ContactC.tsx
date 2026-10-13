/**
 * CONTACTO C · Experimental Creative — basado en 21st.dev «Worth Keeping CTA» (id 26705, ziegfiroyt · cta69).
 * Del original se conserva: sección a sangre con una marquesina monocroma gigante (22vw / 16vw, tinta al 6 %)
 * hecha con dos mitades idénticas que se desplazan -50 % en bucle y la frase repetida REPEATS veces para que no
 * quede hueco, y encima la declaración centrada: badge, titular, nota, botón «sello» y nota al pie.
 * Adaptación: la frase es «Trabajemos juntos» (site.ts → cta) y se añade una segunda línea hueca en sentido
 * contrario; Badge7/Button12 se reimplementan (pastilla y sello circular con texto girando en SVG). El sello
 * baja al formulario real (ContactForm), que se presenta debajo junto a los canales en tipografía grande.
 * Botón de pausa para la marquesina (bucle largo). Estático: marquesina quieta, sello sin giro.
 */
import { useState } from "react";
import { motion } from "motion/react";
import { contact, cta } from "@/content/site";
import { ContactForm } from "@/core/ContactForm";
import { cn } from "@/lib/utils";
import { ADDRESS, ArrowUpRight, CHANNELS, PauseToggle, TEXT, useFull } from "./shared";

const REPEATS = 8;
const PHRASE = `${cta.titleHollow} ${cta.titleSolid.replace(".", "")}`;
const LINE = `${PHRASE} · `.repeat(REPEATS);
const SEAL = "PEDIR PRESUPUESTO · SIN COMPROMISO · ";

const CSS = `
@keyframes cc-mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes cc-spin{to{transform:rotate(1turn)}}
.cc-mq{animation:cc-mq 60s linear infinite}
.cc-mq.is-rev{animation-direction:reverse;animation-duration:80s}
.cc-paused .cc-mq,.cc-paused .cc-seal-txt{animation-play-state:paused}
.cc-seal-txt{animation:cc-spin 18s linear infinite;transform-origin:50% 50%}
.cc-seal:hover .cc-seal-txt{animation-duration:6s}
.cc-hollow{color:transparent;-webkit-text-stroke:1.5px rgba(22,22,31,.12)}
.cc-title .u-hollow{-webkit-text-stroke:2px #16161F}
.cc-form .cf-send{width:100%;background:#16161F}
.cc-form .cf-send:hover{background:#2E6CA0}
.cc-form input:not([type=checkbox]),.cc-form select,.cc-form textarea{background:#fff;border-color:rgba(22,22,31,.14);border-radius:4px}
`;

function Seal({ href, spin }: { href: string; spin: boolean }) {
  return (
    <a href={href} className="cc-seal group relative grid h-[150px] w-[150px] place-items-center rounded-full bg-ink text-white transition-transform duration-500 hover:scale-105 focus-visible:scale-105 sm:h-[168px] sm:w-[168px]">
      <svg viewBox="0 0 200 200" className={cn("absolute inset-0 h-full w-full", spin && "cc-seal-txt")} aria-hidden>
        <defs><path id="cc-circle" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" /></defs>
        <text fill="currentColor" style={{ fontSize: 15.5, letterSpacing: "0.22em", fontWeight: 600 }}>
          <textPath href="#cc-circle">{SEAL}</textPath>
        </text>
      </svg>
      <span className="grid h-14 w-14 place-items-center rounded-full bg-brand text-ink transition-transform duration-500 group-hover:rotate-45" aria-hidden>
        <ArrowUpRight className="h-6 w-6" />
      </span>
      <span className="sr-only">Pedir presupuesto sin compromiso: ir al formulario</span>
    </a>
  );
}

export default function ContactC() {
  const full = useFull();
  const [paused, setPaused] = useState(false);
  const fade = (d: number) => full ? { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.8, delay: d, ease: [0.16, 1, 0.3, 1] as const } } : {};

  return (
    <div className={cn("relative w-full overflow-hidden bg-paper text-ink", paused && "cc-paused")}>
      <style>{CSS}</style>

      {/* Marquesina gigante de fondo */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 flex h-[100svh] max-h-[960px] min-h-[640px] select-none flex-col justify-center overflow-hidden">
        <div className={cn("flex w-max shrink-0 whitespace-nowrap text-ink/[0.06]", full && "cc-mq")}>
          {[0, 1].map((c) => <span key={c} className="font-head text-[22vw] font-extrabold uppercase leading-[.86] tracking-[-0.06em] md:text-[16vw]">{LINE}</span>)}
        </div>
        <div className={cn("flex w-max shrink-0 -translate-x-1/4 whitespace-nowrap", full && "cc-mq is-rev")}>
          {[0, 1].map((c) => <span key={c} className="cc-hollow font-head text-[22vw] font-extrabold uppercase leading-[.86] tracking-[-0.06em] md:text-[16vw]">{LINE}</span>)}
        </div>
      </div>

      {/* Declaración centrada */}
      <div className="relative mx-auto flex min-h-[min(100svh,960px)] max-w-4xl flex-col items-center justify-center px-[var(--u-gutter)] py-[var(--u-section-y)] text-center">
        <motion.p {...fade(0)} className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/80 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-strong" aria-hidden /> {cta.eyebrow}
        </motion.p>
        <motion.div {...fade(0.08)}>
          <h2 className="cc-title mt-8 font-head text-[clamp(3.4rem,11vw,9.5rem)] font-extrabold uppercase leading-[.86] tracking-[-0.055em] text-ink">
            <span className="u-hollow">{cta.titleHollow}</span><br />{cta.titleSolid}
          </h2>
        </motion.div>
        <motion.p {...fade(0.16)} className="mt-7 max-w-xl text-balance text-[clamp(1.05rem,1.4vw,1.25rem)] leading-relaxed text-ink/70">{TEXT}</motion.p>
        <motion.div {...fade(0.24)} className="mt-12"><Seal href="#cc-form" spin={full} /></motion.div>
        <motion.p {...fade(0.3)} className="mt-8 text-sm text-ink/60">{ADDRESS.short}</motion.p>
        {full && (
          <div className="absolute bottom-5 right-[var(--u-gutter)] text-ink/70">
            <PauseToggle paused={paused} onToggle={() => setPaused((p) => !p)} label="la marquesina" className="bg-paper/70" />
          </div>
        )}
      </div>

      {/* Formulario + canales */}
      <div id="cc-form" className="relative scroll-mt-16 border-t border-ink/10 bg-paper">
        <div className="u-wrap grid gap-12 py-[clamp(3.5rem,8vw,7rem)] lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/55">— Escríbenos o llama</p>
            <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
              {CHANNELS.map(({ k, label, value, href, Icon, external }) => (
                <li key={k}>
                  <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex min-h-[44px] items-center justify-between gap-4 py-5">
                    <span>
                      <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/55"><Icon className="h-3.5 w-3.5" aria-hidden /> {label}</span>
                      <span className="mt-1 block font-head text-[clamp(1.35rem,2.6vw,2.1rem)] font-semibold tracking-[-0.03em] text-ink transition-colors group-hover:text-brand-strong">{value}</span>
                    </span>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-ink/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-strong" aria-hidden />
                    {external && <span className="sr-only">(se abre en una pestaña nueva)</span>}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-ink/60">{contact.addressFull.join(" · ")}</p>
          </div>
          <div className="lg:col-span-7 lg:pl-8">
            <ContactForm className="cc-form" button="Enviar solicitud" />
          </div>
        </div>
      </div>
    </div>
  );
}
