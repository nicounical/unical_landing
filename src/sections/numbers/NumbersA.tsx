/**
 * CIFRAS A · Cinematic Premium — basado en 21st.dev «Number Ticker Real-Time Metrics Counter» (id 21515).
 * Del original se conserva: contadores grandes con cifras tabulares que «ruedan» dígito a dígito hasta su valor
 * (NumberFlow), con la etiqueta en tono atenuado junto a la cifra.
 * Adaptación: @number-flow/react no está instalado → cada dígito es una columna 0-9 (dos vueltas) que se desplaza
 * con transición CSS escalonada hasta su valor final, como hace NumberFlow. Se elimina el punto verde «live» y la
 * suma aleatoria del demo (no hay datos en tiempo real): las cifras son las cuatro reales de site.ts y se quedan
 * fijas. Fondo: el showreel real en bucle (SmartVideo, póster en modo estático) bajo un velo nocturno.
 * Los lectores de pantalla reciben el valor final; los dígitos animados son aria-hidden.
 */
import { useRef } from "react";
import { videos } from "@/content/site";
import { SmartVideo } from "@/core/ui";
import { cn } from "@/lib/utils";
import { Eyebrow, ITEMS, LEAD, NumTitle, SrValue, finalText, useFull, useInViewOnce, type NumItem } from "./shared";

const EASE = "cubic-bezier(.16,1,.3,1)";

/** Dígito rodante: columna 0-9 repetida dos veces; se detiene en la segunda vuelta (10 + d). */
function Roll({ d, on, delay, full }: { d: number; on: boolean; delay: number; full: boolean }) {
  const idx = on ? 10 + d : 0;
  return (
    <span className="relative inline-block h-[1em] overflow-hidden align-top leading-none">
      <span className="invisible">{d}</span>
      <span className="absolute inset-x-0 top-0 flex flex-col"
        style={{ transform: `translateY(${-idx * 5}%)`, transition: full ? `transform 2.2s ${EASE} ${delay}s` : "none" }}>
        {Array.from({ length: 20 }, (_, i) => <span key={i} className="block h-[1em] leading-none">{i % 10}</span>)}
      </span>
    </span>
  );
}

function Ticker({ it, on, i, full }: { it: NumItem; on: boolean; i: number; full: boolean }) {
  const txt = finalText(it);
  if (it.text) {
    return (
      <span className="block overflow-hidden" aria-hidden>
        <span className="block" style={{ transform: on ? "none" : "translateY(105%)", transition: full ? `transform 1.2s ${EASE} ${0.25 + i * 0.12}s` : "none" }}>{txt}</span>
      </span>
    );
  }
  let n = 0;
  return (
    <span className="inline-flex tabular-nums" aria-hidden>
      {Array.from(txt).map((c, k) =>
        /\d/.test(c)
          ? <Roll key={k} d={Number(c)} on={on} full={full} delay={i * 0.12 + n++ * 0.07} />
          : <span key={k} className={cn("leading-none", c === "+" && "mr-[0.04em] text-brand")}>{c}</span>)}
    </span>
  );
}

export default function NumbersA() {
  const full = useFull();
  const grid = useRef<HTMLDListElement>(null);
  const on = useInViewOnce(grid, 0.4);

  return (
    <div className="relative isolate overflow-hidden bg-night text-white">
      <div className="absolute inset-0 -z-10" aria-hidden>
        <SmartVideo video={videos.showreel} className="h-full w-full scale-105 object-cover" ariaLabel="" />
        <div className="absolute inset-0 bg-gradient-to-b from-night/85 via-night/55 to-night/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(17,17,31,.75),transparent_60%)]" />
      </div>

      <div className="u-wrap flex min-h-[min(100svh,980px)] flex-col justify-between gap-16 py-[var(--u-section-y)]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Eyebrow className="text-brand" />
            <NumTitle emClassName="!text-brand" className="mt-5 max-w-[16ch] text-[clamp(2.3rem,5.4vw,4.8rem)] font-extrabold leading-[.98] tracking-[-0.045em] text-white" />
          </div>
          <p className="max-w-[40ch] text-[1.02rem] leading-relaxed text-white/70 lg:col-span-4 lg:justify-self-end">{LEAD}</p>
        </div>

        <div>
          <dl ref={grid} className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-white/15 pt-8 lg:grid-cols-[1fr_1.55fr_1fr_1.3fr] lg:gap-0 lg:pt-10">
            {ITEMS.map((it, i) => (
              <div key={it.label} className={cn("flex flex-col-reverse gap-4 lg:px-8 lg:first:pl-0", i > 0 && "lg:border-l lg:border-white/15")}>
                <dt className="flex items-center gap-3 text-[13px] font-medium text-white/60">
                  <span className="h-px w-5 bg-brand" aria-hidden />{it.label}
                </dt>
                <dd className={cn("font-head font-semibold leading-none tracking-[-0.04em] text-white",
                  it.text ? "text-[clamp(1.7rem,2.9vw,2.7rem)] lg:whitespace-nowrap" : "text-[clamp(3rem,6.2vw,5.6rem)]")}>
                  <SrValue it={it} />
                  <Ticker it={it} on={on} i={i} full={full} />
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 text-right text-[11px] uppercase tracking-[0.2em] text-white/40">{videos.showreel.label}</p>
        </div>
      </div>
    </div>
  );
}
