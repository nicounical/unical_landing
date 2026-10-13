/**
 * SERVICIOS A · Cinematic Premium — basado en 21st.dev «Services Stack» (id 33309, ivarunchaudhary).
 * Tarjetas apiladas con `position: sticky`: cada una se encoge y se oscurece cuando la siguiente pasa por encima
 * (mismo bucle rAF de `update()` del original), fondo fotográfico fijo que se funde según el servicio activo,
 * columna izquierda fija con el título activo y grano de película.
 * Adaptación: los 6 servicios reales; el dibujo lineal SVG por servicio del original se sustituye por la foto real
 * del trabajo con un pie mono que nombra el alcance que se ilumina (los chips se encienden en bucle igual que en el
 * original, con palabras literales de la descripción). Tarjetas horizontales y apiladas con desfase de 14 px para
 * que la escena no supere ~300vh; grano generado con SVG inline (sin recursos remotos). Sin JS de scroll en estático.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ALT_IMG, ArrowUR, EYEBROW, Eyebrow, ITEMS, SCOPE, TITLE, pad, useFull } from "./shared";

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;
const CSS = `
.sa-grain::after{content:"";position:absolute;inset:-50%;background-image:${GRAIN};opacity:.09;animation:sa-grain 8s steps(10) infinite}
@keyframes sa-grain{0%{transform:translate(0)}10%,30%,50%,70%,90%{transform:translate(-5%,-10%)}20%,40%,60%,80%,100%{transform:translate(-15%,-20%)}}
`;

/** Alcance del servicio: los chips se encienden en bucle mientras la tarjeta es la activa (como el dibujo del original). */
function useStep(on: boolean, n: number) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!on) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % n), 1700);
    return () => window.clearInterval(id);
  }, [on, n]);
  return on ? step : -1;
}

function Card({ i, active, full }: { i: number; active: boolean; full: boolean }) {
  const s = ITEMS[i];
  const scope = SCOPE[s.n];
  const step = useStep(full && active, scope.length);
  return (
    <article className="grid overflow-hidden rounded-xl bg-gradient-to-b from-[#e6ecf5] to-[#f8f9fc] text-ink shadow-[0_30px_80px_-20px_rgba(0,0,0,.6)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[360px]">
        <img src={s.img} alt={s.alt} loading="lazy" decoding="async"
          className={cn("absolute inset-0 h-full w-full object-cover transition-transform duration-[2400ms] ease-out", full && active ? "scale-105" : "scale-100")} />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" aria-hidden />
        <p className="absolute bottom-3 left-4 h-4 font-mono text-[11px] uppercase tracking-[0.14em] text-white/85" aria-hidden>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={step} className="block" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>
              {step >= 0 ? `— ${scope[step]}` : `— ${s.sub}`}
            </motion.span>
          </AnimatePresence>
        </p>
      </div>
      <div className="flex flex-col p-6 md:p-8 lg:p-9">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/55">{s.n} / {pad(ITEMS.length)} · {s.sub}</p>
        <h3 className="mt-3 text-[clamp(1.6rem,2.4vw,2.2rem)] font-bold leading-[1.02] tracking-[-0.035em] text-ink">{s.title}</h3>
        <p className="mt-3 text-[1.02rem] leading-snug text-ink/80">{s.text}</p>
        <p id={`sa-scope-${s.n}`} className="mt-6 font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-ink/70">Qué incluye</p>
        <ul aria-labelledby={`sa-scope-${s.n}`} className="mt-2.5 flex flex-wrap gap-1.5 text-[0.88rem] leading-tight">
          {scope.map((c, k) => (
            <li key={c} className={cn("flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors duration-500",
              k === step ? "bg-brand/60 text-ink" : "bg-brand-tint text-ink/85")}>
              <span className={cn("h-1.5 w-1.5 rounded-full transition-colors duration-500", k === step ? "bg-brand-strong" : "bg-ink/70")} aria-hidden />
              {c}
            </li>
          ))}
        </ul>
        <a href={s.href} className="group mt-auto inline-flex min-h-[44px] items-center gap-2 self-start pt-6 text-sm font-semibold text-brand-strong hover:text-brand-deep">
          Ver servicio <span className="sr-only">{s.title}</span>
          <ArrowUR className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </article>
  );
}

function StaticView() {
  return (
    <div className="relative isolate overflow-hidden bg-night text-white">
      <img src={ALT_IMG["01"].src} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-30" loading="lazy" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-night/90 via-night/80 to-night" aria-hidden />
      <div className="u-wrap py-[var(--u-section-y)]">
        <Eyebrow className="text-brand" />
        <h2 className="mt-4 max-w-[16ch] text-[length:var(--u-h2)] font-extrabold leading-[.98] tracking-[-0.045em] text-white">{TITLE}</h2>
        <ol className="mt-12 grid gap-6 lg:grid-cols-2">
          {ITEMS.map((_, i) => <li key={i}><Card i={i} active={false} full={false} /></li>)}
        </ol>
      </div>
    </div>
  );
}

export default function ServicesA() {
  const full = useFull();
  const root = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const shades = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!full) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      let idx = 0;
      cards.current.forEach((card, i) => {
        if (!card) return;
        const r = card.getBoundingClientRect();
        if (r.top <= vh * 0.5) idx = i;
        // cuánto ha avanzado la SIGUIENTE tarjeta sobre esta (0..1), como en el original
        const next = cards.current[i + 1];
        const covered = next ? Math.min(1, Math.max(0, 1 - (next.getBoundingClientRect().top - r.top - 14) / Math.max(1, r.height))) : 0;
        const inner = card.firstElementChild as HTMLElement | null;
        if (inner) inner.style.transform = `scale(${1 - covered * 0.06}) translateY(${-covered * 18}px)`;
        const sh = shades.current[i];
        if (sh) sh.style.opacity = String(covered * 0.55);
      });
      setActive(idx);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); cancelAnimationFrame(raf); };
  }, [full]);

  if (!full) return <StaticView />;

  return (
    <div ref={root} className="relative isolate bg-night text-white">
      <style>{CSS}</style>
      {/* Fondo fijo: fotos que se funden según el servicio activo + grano */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
          {ITEMS.map((s, i) => (
            <img key={s.n} src={ALT_IMG[s.n].src} alt="" loading="lazy" decoding="async"
              className={cn("absolute inset-0 h-full w-full scale-105 object-cover transition-opacity duration-1000", i !== active && "opacity-0")} />
          ))}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(17,17,31,.55),rgba(17,17,31,.92))]" />
          <div className="absolute inset-0 bg-gradient-to-r from-night via-night/70 to-night/30" />
          <div className="sa-grain absolute inset-0 overflow-hidden" />
        </div>
      </div>

      <div className="u-wrap grid gap-10 pb-[var(--u-section-y)] pt-[var(--u-section-y)] lg:grid-cols-12 lg:gap-12 lg:pt-0">
        {/* Columna fija: titular + servicio activo */}
        <div className="lg:col-span-5">
          <div className="flex flex-col lg:sticky lg:top-0 lg:h-[100svh] lg:justify-center">
            <Eyebrow className="text-brand" />
            <h2 className="mt-4 max-w-[14ch] text-[clamp(2.2rem,4.2vw,3.9rem)] font-extrabold leading-[.98] tracking-[-0.045em] text-white">{TITLE}</h2>
            <div className="relative mt-10 hidden h-[clamp(5rem,9vw,8rem)] lg:block" aria-hidden>
              {ITEMS.map((s, i) => (
                <div key={s.n} className={cn("absolute inset-0 transition duration-500 ease-out", i !== active && (i < active ? "-translate-y-6 opacity-0" : "translate-y-6 opacity-0"))}>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">{s.n} — {s.sub}</p>
                  <p className="mt-2 font-head text-[clamp(2rem,3.6vw,3.3rem)] font-semibold leading-none tracking-[-0.04em] text-white/90">{s.title}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 hidden items-center gap-4 lg:flex" aria-hidden>
              <span className="font-mono text-xs tabular-nums text-white/70">{pad(active + 1)}</span>
              <div className="flex gap-1.5">
                {ITEMS.map((s, i) => <span key={s.n} className={cn("h-[3px] rounded-full transition-all duration-500", i === active ? "w-10 bg-brand" : "w-4 bg-white/25")} />)}
              </div>
              <span className="font-mono text-xs tabular-nums text-white/40">{pad(ITEMS.length)}</span>
            </div>
            <p className="sr-only">{EYEBROW}: {ITEMS.map((s) => s.title).join(", ")}.</p>
          </div>
        </div>

        {/* Pila de tarjetas */}
        <ol className="lg:col-span-7 lg:pt-[14vh]">
          {ITEMS.map((s, i) => (
            <li key={s.n} ref={(el) => { cards.current[i] = el; }}
              className="sticky mb-[8vh] last:mb-0 lg:mb-[12vh]"
              style={{ top: `calc(clamp(5rem, 14vh, 8.5rem) + ${i * 14}px)` }}>
              <div className="relative origin-top will-change-transform">
                <Card i={i} active={i === active} full />
                <div ref={(el) => { shades.current[i] = el; }} className="pointer-events-none absolute inset-0 rounded-xl bg-night opacity-0" aria-hidden />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
