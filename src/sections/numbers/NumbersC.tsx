/**
 * CIFRAS C · Experimental Creative — basado en 21st.dev «Segmented LCD Number Ticker» (id 29887).
 * Del original se conserva: cada dígito es un SVG de siete segmentos (mismo SEGMENT_MAP de bits y mismos trazos en
 * viewBox 12×21, strokeWidth 1.7, extremos redondeados), segmentos encendidos frente a apagados, y el contador que
 * avanza con requestAnimationFrame y ease-out cúbico (1 − (1 − p)³).
 * Adaptación: se elimina el intervalo que sumaba usuarios aleatorios del demo; las cifras son las reales de
 * site.ts y cuentan una vez al entrar en pantalla. Se monta como un cuadro de instrumentos: pantallas LCD con brillo
 * de marca, posiciones vacías apagadas (como un display real), signo «+» también segmentado, rejilla de líneas de
 * barrido y un botón por pantalla para volver a contar. «3M · Avery» no es numérico → matriz de texto LCD.
 * Modo estático: valores finales sin animación. Lectores de pantalla: valor final + etiqueta.
 */
import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Eyebrow, ITEMS, LEAD, NumTitle, SrValue, pad, useFull, useInViewOnce, type NumItem } from "./shared";

const SEGMENT_MAP: number[] = [63, 6, 91, 79, 102, 109, 125, 7, 127, 111];
const SEGMENT_PATHS: string[] = ["M2.5 1h7", "M11 2.5v6.5", "M11 12v6.5", "M2.5 20h7", "M1 12v6.5", "M1 2.5v6.5", "M2.5 10.5h7"];
const ON = "stroke-brand [filter:drop-shadow(0_0_3px_rgba(153,196,228,.85))]";
const OFF = "stroke-white/[.07]";
const SIZE = "h-auto w-[clamp(1.9rem,9vw,3.9rem)] lg:w-[clamp(2.4rem,4.2vw,4.1rem)]";

/** Dígito de siete segmentos (`null` = posición vacía con todos los segmentos apagados). */
function SegmentDigit({ digit }: { digit: number | null }) {
  const segments = digit === null ? 0 : SEGMENT_MAP[digit] ?? 0;
  return (
    <svg className={SIZE} viewBox="0 0 12 21" aria-hidden>
      {SEGMENT_PATHS.map((path, i) => (
        <path key={i} d={path} fill="none" strokeLinecap="round" strokeWidth="1.7" className={(segments >> i) & 1 ? ON : OFF} />
      ))}
    </svg>
  );
}

/** «+» segmentado (barra central + vertical corta). */
const SegmentPlus = () => (
  <svg className={SIZE} viewBox="0 0 12 21" aria-hidden>
    <path d="M2.5 10.5h7" fill="none" strokeLinecap="round" strokeWidth="1.7" className={ON} />
    <path d="M6 7v7" fill="none" strokeLinecap="round" strokeWidth="1.7" className={ON} />
  </svg>
);

/** Contador del original: rAF + ease-out cúbico; `run` cambia para reiniciar. */
function useTicker(end: number, run: number, duration = 2) {
  const full = useFull();
  const [value, setValue] = useState(full ? 0 : end);
  useEffect(() => {
    if (!full) { setValue(end); return; }
    if (!run) return;
    let frame = 0, start: number | null = null;
    const animate = (t: number) => {
      if (start === null) start = t;
      const percent = Math.min((t - start) / (duration * 1000), 1);
      setValue(end * (1 - Math.pow(1 - percent, 3)));
      if (percent < 1) frame = requestAnimationFrame(animate);
    };
    setValue(0);
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [end, run, duration, full]);
  return value;
}

function Display({ it, i, seen }: { it: NumItem; i: number; seen: boolean }) {
  const full = useFull();
  const [run, setRun] = useState(0);
  useEffect(() => { if (seen) setRun((r) => r || 1); }, [seen]);
  const value = useTicker(it.value ?? 0, run, 1.8 + i * 0.25);
  const width = String(it.value ?? 0).length;
  const digits = String(Math.floor(value)).split("").map(Number);
  const cells: (number | null)[] = [...Array(Math.max(0, width - digits.length)).fill(null), ...digits];

  return (
    <div className={cn("relative flex flex-col rounded-2xl border border-white/10 bg-[#0c0c16] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.06),0_30px_60px_-30px_rgba(0,0,0,.8)] sm:p-5")}>
      <div className="flex items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
        <span>CH.{pad(i + 1)}</span>
        {!it.text && full ? (
          <button type="button" onClick={() => setRun((r) => r + 1)} aria-label={`Volver a contar: ${it.label}`}
            className="-mr-2 grid h-11 w-11 place-items-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-brand">
            <RotateCcw className="h-4 w-4" strokeWidth={1.6} />
          </button>
        ) : <span className="h-11" aria-hidden />}
      </div>
      {/* Pantalla */}
      <div className="relative mt-2 flex min-h-[clamp(6rem,14vw,8.5rem)] items-center overflow-hidden rounded-xl bg-[#05050b] px-4 py-5 shadow-[inset_0_2px_14px_rgba(0,0,0,.9)] sm:px-6">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,.035)_0_1px,transparent_1px_4px)]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(153,196,228,.12),transparent_65%)]" />
        <SrValue it={it} />
        {it.text ? (
          <p aria-hidden className="relative font-mono whitespace-nowrap text-[clamp(1.35rem,6vw,2.1rem)] font-semibold uppercase tracking-[0.08em] lg:text-[clamp(1.3rem,2.2vw,2.1rem)] text-brand [text-shadow:0_0_10px_rgba(153,196,228,.7)]">
            {it.text}
          </p>
        ) : (
          <div className="relative inline-flex items-center gap-[clamp(.35rem,1vw,.7rem)]" aria-hidden>
            {it.prefix === "+" && <SegmentPlus />}
            {cells.map((d, k) => <SegmentDigit key={k} digit={d} />)}
          </div>
        )}
      </div>
      <p className="mt-4 flex items-center gap-2 text-[14px] font-medium text-white/80">
        <span className="h-1.5 w-1.5 rounded-full bg-brand/70" aria-hidden />{it.label}
      </p>
    </div>
  );
}

export default function NumbersC() {
  const panel = useRef<HTMLDivElement>(null);
  const seen = useInViewOnce(panel, 0.3);

  return (
    <div className="relative overflow-hidden bg-ink py-[var(--u-section-y)] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[.35] [background-image:linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" />
      <div className="u-wrap relative grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <Eyebrow className="text-brand" />
          <NumTitle emClassName="!text-brand" className="mt-5 text-[clamp(2.1rem,4.2vw,3.6rem)] font-extrabold leading-[1] tracking-[-0.045em] text-white" />
          <p className="mt-6 max-w-[40ch] text-[1.02rem] leading-relaxed text-white/65">{LEAD}</p>
        </div>
        <div ref={panel} className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:col-span-8">
          {ITEMS.map((it, i) => <Display key={it.label} it={it} i={i} seen={seen} />)}
        </div>
      </div>
    </div>
  );
}
