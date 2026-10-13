/**
 * CONTACTO F · Editorial Kinetic — basado en 21st.dev «CTA with Marquee» (id 8382, Dali Agents UI · variante Large).
 * Del original se conserva: composición a dos columnas con el texto a la izquierda y, a la derecha, dos
 * marquesinas de piezas cuadradas a sangre y sin separación (w-64/h-64 → lg:w-80/h-80) que corren en sentidos
 * opuestos (dos mitades duplicadas, la segunda aria-hidden), y el ScrambleButton que «descifra» su texto letra a
 * letra (intervalo de 30 ms, avance de 1/3 de carácter por paso).
 * Adaptación: las imágenes de stock se sustituyen por media real de Unical (vídeos de Lexus y Cirsa con SmartVideo
 * y fotos de trabajos); el scramble también se dispara con el foco de teclado y el botón baja al formulario real
 * (ContactForm), presentado debajo en una banda editorial con los canales reales. Las marquesinas se paran al pasar
 * el puntero o con foco y tienen botón de pausa. Sin next/image. Estático: marquesinas quietas, texto sin scramble.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { cta, videos, type Video } from "@/content/site";
import { ContactForm } from "@/core/ContactForm";
import { SmartVideo } from "@/core/ui";
import { cn } from "@/lib/utils";
import { ADDRESS, ArrowUpRight, Channels, Eyebrow, PHOTOS, PauseToggle, TEXT, darkFormCss, useFull } from "./shared";

const CSS = `${darkFormCss("cfm-form")}
.cfm-form .cf-send{background:#fff;color:#16161F;min-width:14rem}
.cfm-form .cf-send:hover{background:#99C4E4}
@keyframes cfm-mq{from{transform:translateX(0)}to{transform:translateX(calc(-100% - var(--gap)))}}
.cfm-mq{--gap:0px;display:flex;overflow:hidden;gap:var(--gap)}
.cfm-mq__g{display:flex;min-width:100%;flex-shrink:0;align-items:center;justify-content:space-around;gap:var(--gap);animation:cfm-mq var(--dur,30s) linear infinite}
.cfm-mq.is-rev .cfm-mq__g{animation-direction:reverse}
.cfm-stage:hover .cfm-mq__g,.cfm-stage:focus-within .cfm-mq__g,.cfm-stage.is-paused .cfm-mq__g{animation-play-state:paused}
.cfm-title .u-hollow{-webkit-text-stroke:1.5px rgba(255,255,255,.92)}
`;

type Tile = { kind: "img"; src: string; alt: string } | { kind: "video"; video: Video };
const ROW1: Tile[] = [
  { kind: "video", video: videos.heroPanther },
  { kind: "img", ...PHOTOS[1] },
  { kind: "video", video: videos.cirsa },
  { kind: "img", ...PHOTOS[2] },
  { kind: "img", ...PHOTOS[4] },
];
const ROW2: Tile[] = [PHOTOS[0], PHOTOS[9], PHOTOS[5], PHOTOS[13], PHOTOS[3]].map((p) => ({ kind: "img" as const, ...p }));

function Marquee({ children, reverse, run, speed = 30 }: { children: ReactNode; reverse?: boolean; run: boolean; speed?: number }) {
  return (
    <div className={cn("cfm-mq", reverse && "is-rev")} style={{ ["--dur" as string]: `${speed}s` }}>
      <div className="cfm-mq__g" style={run ? undefined : { animation: "none" }}>{children}</div>
      <div className="cfm-mq__g" style={run ? undefined : { animation: "none" }} aria-hidden="true">{children}</div>
    </div>
  );
}

function TileView({ t }: { t: Tile }) {
  return (
    <div className="relative h-56 w-56 shrink-0 overflow-hidden bg-night sm:h-64 sm:w-64 lg:h-80 lg:w-80">
      {t.kind === "img"
        ? <img src={t.src} alt={t.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        : <SmartVideo video={t.video} className="h-full w-full object-cover" ariaLabel={t.video.label} />}
    </div>
  );
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+";
function ScrambleButton({ href, text, full }: { href: string; text: string; full: boolean }) {
  const [shown, setShown] = useState(text);
  const busy = useRef(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearInterval(timer.current), []);
  const scramble = () => {
    if (!full || busy.current) return;
    busy.current = true;
    let it = 0;
    timer.current = window.setInterval(() => {
      setShown(text.split("").map((ch, i) => (ch === " " ? " " : i < it ? text[i] : CHARS[Math.floor(Math.random() * CHARS.length)])).join(""));
      if (it >= text.length) { window.clearInterval(timer.current); busy.current = false; setShown(text); }
      it += 1 / 3;
    }, 30);
  };
  return (
    <a href={href} onMouseEnter={scramble} onFocus={scramble} aria-label={text}
      className="inline-flex min-h-[54px] items-center gap-3 rounded-full bg-white px-8 font-mono text-[0.9rem] font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-brand">
      <span aria-hidden className="tabular-nums">{shown}</span>
      <ArrowUpRight className="h-4 w-4" aria-hidden />
    </a>
  );
}

export default function ContactF() {
  const full = useFull();
  const [paused, setPaused] = useState(false);
  const fade = (d: number) => full ? { initial: { opacity: 0, y: 26 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.8, delay: d, ease: [0.16, 1, 0.3, 1] as const } } : {};
  return (
    <div className="relative overflow-hidden bg-navy text-white">
      <style>{CSS}</style>
      <div className="flex flex-col items-center lg:flex-row lg:gap-4">
        <div className="w-full shrink-0 px-[var(--u-gutter)] pb-12 pt-[var(--u-section-y)] lg:max-w-[44rem] lg:py-24 lg:pl-[max(var(--u-gutter),calc((100vw-1240px)/2+var(--u-gutter)))]">
          <motion.div {...fade(0)}><Eyebrow className="text-brand" /></motion.div>
          <motion.div {...fade(0.08)}>
            <h2 className="cfm-title mt-6 font-head text-[clamp(2.9rem,5.4vw,5.4rem)] font-extrabold leading-[.9] tracking-[-0.05em] text-white">
              <span className="u-hollow">{cta.titleHollow}</span><br />{cta.titleSolid}
            </h2>
          </motion.div>
          <motion.div {...fade(0.16)} className="mt-7 max-w-[40ch] space-y-1 text-[1.08rem] leading-relaxed text-white/70">
            <p>{TEXT}</p>
          </motion.div>
          <motion.div {...fade(0.24)} className="mt-9"><ScrambleButton href="#cfm-form" text="Pedir presupuesto" full={full} /></motion.div>
        </div>

        <div className={cn("cfm-stage relative w-full min-w-0 flex-1 overflow-hidden", paused && "is-paused")} role="group" aria-label="Trabajos reales de Unical en movimiento">
          <Marquee reverse run={full}>{ROW1.map((t, i) => <TileView key={i} t={t} />)}</Marquee>
          <Marquee run={full}>{ROW2.map((t, i) => <TileView key={i} t={t} />)}</Marquee>
          {full && (
            <div className="absolute bottom-3 right-3 text-white">
              <PauseToggle paused={paused} onToggle={() => setPaused((p) => !p)} label="las marquesinas" className="bg-black/40" />
            </div>
          )}
        </div>
      </div>

      {/* Banda editorial con el formulario */}
      <div id="cfm-form" className="scroll-mt-16 border-t border-white/10">
        <div className="u-wrap grid gap-12 py-[clamp(3.5rem,8vw,6.5rem)] lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-brand">01 — Solicitud</p>
            <p className="mt-5 font-head text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white">Cuéntanos qué necesitas.</p>
            <div className="mt-8 text-white/90"><Channels layout="col" className="-ml-2" itemClass="hover:bg-white/[.06]" /></div>
            <p className="mt-6 text-sm text-white/55">{ADDRESS.short}</p>
          </div>
          <div className="lg:col-span-8 lg:border-l lg:border-white/10 lg:pl-12">
            <ContactForm className="cfm-form" button="Enviar solicitud" />
          </div>
        </div>
      </div>
    </div>
  );
}
