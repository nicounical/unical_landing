/**
 * SECTORES F · Editorial Kinetic — basado en 21st.dev «Reading Text Reveal» (id 9386, waleedkibhen).
 * Del original se conserva: el texto se divide en palabras y se resalta progresivamente con el scroll de la página
 * (progreso = scroll entre «inicio − nivel de ojos» y «fin − nivel de ojos», con eyeLevel = 62 % de la ventana),
 * suavizado por rAF con interpolación 0.12, palabras pendientes en gris al 40 % y transición 0.3 s ease-out.
 * Adaptación: la historia del original se sustituye por el texto real de la sección (lead de site.ts) seguido de los
 * 8 sectores; cada sector es una unidad que, al revelarse, se tiñe de azul de marca y abre una miniatura de su foto
 * dentro de la línea. Sin los 400vh ni el «The End» del original: el bloque mide lo que ocupa el texto (sin pin, sin
 * trampa de scroll), con columna lateral sticky que lleva el H2 y el contador de sectores revelados. Sin movimiento:
 * todo el texto aparece revelado.
 */
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CONTACT_URL, ArrowUR, Eyebrow, ITEMS, LEAD, TITLE, pad, useFull } from "./shared";

type Tok = { t: string; s?: number };
const LEAD_TOKENS: Tok[] = LEAD.split(" ").map((t) => ({ t }));
const SECTOR_TOKENS: Tok[] = ITEMS.map((s, i) => ({ t: s.name, s: i }));
const TOTAL = LEAD_TOKENS.length + SECTOR_TOKENS.length;

export default function SectorsF() {
  const full = useFull();
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(full ? 0 : TOTAL);

  useEffect(() => {
    if (!full) return;
    let raf: number | null = null, target = 0, current = 0;
    const smooth = () => {
      current += (target - current) * 0.12;
      if (Math.abs(target - current) > 0.001) { setCount(Math.floor(current * TOTAL)); raf = requestAnimationFrame(smooth); }
      else { current = target; setCount(Math.floor(target * TOTAL)); raf = null; }
    };
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect(), eye = window.innerHeight * 0.62;
      const start = r.top + window.scrollY - eye, end = r.top + window.scrollY + r.height - eye;
      target = Math.max(0, Math.min(1, (window.scrollY - start) / (end - start)));
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(smooth);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [full]);

  const sectorsOn = Math.max(0, Math.min(ITEMS.length, count - LEAD_TOKENS.length));
  const tr = full ? "transition-[color,opacity] duration-300 ease-out" : "";

  return (
    <div className="bg-white py-[var(--u-section-y)] text-ink">
      <div className="u-wrap grid gap-10 lg:grid-cols-12 lg:gap-12">
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Eyebrow className="text-brand-strong" />
            <h2 className="mt-4 max-w-[14ch] font-head text-[clamp(1.8rem,3vw,2.6rem)] font-bold leading-[1.02] tracking-[-0.04em] text-ink">{TITLE}</h2>
            <div className="mt-8 hidden lg:block" aria-hidden>
              <div className="flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">
                <span className="font-head text-5xl font-bold tracking-[-0.04em] text-ink tabular-nums">{pad(sectorsOn)}</span>/ {pad(ITEMS.length)} sectores
              </div>
              <div className="mt-4 h-px w-full bg-ink/10">
                <div className="h-px bg-brand-strong transition-[width] duration-300" style={{ width: `${(count / TOTAL) * 100}%` }} />
              </div>
            </div>
            <a href={CONTACT_URL} className="group mt-8 hidden min-h-[44px] items-center gap-3 border-b border-ink/25 text-sm font-semibold text-ink transition-colors hover:border-brand-strong hover:text-brand-strong lg:inline-flex">
              Cuéntanos tu proyecto <ArrowUR className="h-3.5 w-3.5" />
            </a>
          </div>
        </aside>

        <div ref={ref} className="lg:col-span-8">
          <p className="font-head text-[clamp(1.75rem,4.2vw,3.6rem)] font-semibold leading-[1.12] tracking-[-0.035em]">
            {LEAD_TOKENS.map((w, i) => (
              <span key={i} className={cn(tr, i < count ? "text-ink opacity-100" : "text-ink/30 opacity-40")}>{w.t} </span>
            ))}
          </p>
          <ul className="mt-10 flex flex-wrap items-center gap-x-[0.35em] gap-y-[0.2em] font-head text-[clamp(1.75rem,4.2vw,3.6rem)] font-semibold leading-[1.15] tracking-[-0.035em] md:mt-14">
            {SECTOR_TOKENS.map((w, k) => {
              const on = LEAD_TOKENS.length + k < count, s = ITEMS[w.s!];
              return (
                <li key={s.name} className="inline-flex items-center">
                  <span aria-hidden className={cn("inline-block h-[0.82em] overflow-hidden rounded-full align-middle", full && "transition-[width,opacity,margin] duration-500 ease-[cubic-bezier(.16,1,.3,1)]", on ? "mr-[0.18em] w-[1.5em] opacity-100" : "mr-0 w-0 opacity-0")}>
                    <img src={s.img} alt="" loading="lazy" decoding="async" className="h-full w-[1.5em] max-w-none object-cover" />
                  </span>
                  <span className={cn(tr, on ? "text-brand-strong opacity-100" : "text-ink/30 opacity-40")}>
                    {s.name}{k < SECTOR_TOKENS.length - 1 ? <span className="text-ink/25">,</span> : <span className="text-ink/25">.</span>}
                  </span>
                </li>
              );
            })}
          </ul>
          <a href={CONTACT_URL} className="group mt-10 inline-flex min-h-[44px] items-center gap-3 border-b border-ink/25 text-sm font-semibold text-ink transition-colors hover:border-brand-strong hover:text-brand-strong lg:hidden">
            Cuéntanos tu proyecto <ArrowUR className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
