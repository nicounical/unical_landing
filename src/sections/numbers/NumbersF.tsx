/**
 * CIFRAS F · Editorial Kinetic — basado en 21st.dev «Animate Digits» (id 20071, unlumen).
 * Del original se conserva: DigitCell con muelles (useSpring) para y / opacidad / escala / desenfoque que se
 * «saltan» (jump) al cambiar el dígito y vuelven a reposo; la cifra anterior sale por una cola de salida
 * (AnimatePresence, máx. 3) con blur 10 px y escala 0.7; dirección «dynamic» (sube si el dígito crece); solo se
 * animan los dígitos que cambian; y la cola de valores que avanza un paso cada `animationDelay`.
 * Adaptación: en lugar de un temporizador, cada cifra real de site.ts recorre una secuencia de pasos (ceros a la
 * izquierda → valor final) al entrar en pantalla, y vuelve a recorrerla al pasar el cursor por su fila. Maqueta
 * editorial en blanco: filas con regla, índice, cifra a cuerpo enorme y etiqueta. Modo estático: texto final sin
 * muelles. Los lectores de pantalla reciben el valor final (las celdas son aria-hidden).
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { Eyebrow, ITEMS, LEAD, NumTitle, SrValue, finalText, group, pad, useFull, type NumItem } from "./shared";

type ExitItem = { id: number; char: string; exitY: number };
let _id = 0;

const ENTER_Y = 56, ENTER_BLUR = 40, ENTER_SCALE = 0.7;

function DigitCell({ char }: { char: string }) {
  const isDigit = /\d/.test(char);
  const [exitQueue, setExitQueue] = useState<ExitItem[]>([]);
  const prevCharRef = useRef(char);
  const first = useRef(true);
  const cfg = { stiffness: 170, damping: 10 };
  const y = useSpring(0, cfg), opacity = useSpring(1, cfg), scale = useSpring(1, cfg), blur = useSpring(0, cfg);
  const filter = useTransform(blur, (v) => `blur(${Math.max(0, v)}px)`);

  useEffect(() => {
    if (!isDigit) return;
    const prev = prevCharRef.current;
    prevCharRef.current = char;
    if (first.current) { first.current = false; return; }
    if (char === prev || !/\d/.test(prev)) return;
    const up = Number(char) > Number(prev);
    const id = _id++;
    setExitQueue((q) => { const n = [...q, { id, char: prev, exitY: up ? -ENTER_Y : ENTER_Y }]; return n.length > 3 ? n.slice(-3) : n; });
    y.jump(up ? ENTER_Y : -ENTER_Y); opacity.jump(0); scale.jump(ENTER_SCALE); blur.jump(ENTER_BLUR);
    y.set(0); opacity.set(1); scale.set(1); blur.set(0);
  }, [char, isDigit, y, opacity, scale, blur]);

  if (!isDigit) return <span className="whitespace-pre">{char}</span>;
  return (
    <span className="relative grid place-items-center [&>*]:col-start-1 [&>*]:row-start-1">
      <AnimatePresence>
        {exitQueue.map(({ id, char: c, exitY }) => (
          <motion.span key={id} initial={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
            animate={{ opacity: 0, scale: 0.7, filter: "blur(10px)", y: exitY }}
            transition={{ type: "spring", stiffness: 170, damping: 15 }}
            onAnimationComplete={() => setExitQueue((q) => q.filter((it) => it.id !== id))}>{c}</motion.span>
        ))}
      </AnimatePresence>
      <motion.span style={{ opacity, scale, filter, y }}>{char}</motion.span>
    </span>
  );
}

/** Secuencia de pasos hasta el valor final, con el mismo nº de celdas (ceros a la izquierda). */
function steps(it: NumItem): string[] {
  if (it.text) {
    const d = Number(it.text.match(/\d/)?.[0] ?? 0);
    return Array.from({ length: d + 1 }, (_, k) => it.text!.replace(/\d/, String(k)));
  }
  const v = it.value ?? 0, w = String(v).length, n = 9;
  return Array.from({ length: n + 1 }, (_, k) => {
    const e = 1 - Math.pow(1 - k / n, 2.4);
    return `${it.prefix ?? ""}${String(Math.round(v * e)).padStart(w, "0").replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  });
}

function Row({ it, i, full }: { it: NumItem; i: number; full: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const seq = useRef(steps(it));
  const [value, setValue] = useState(() => (full ? seq.current[0] : finalText(it)));
  const timers = useRef<number[]>([]);
  const busy = useRef(false);

  const play = (delay = 0) => {
    if (!full || busy.current) return;
    busy.current = true;
    timers.current.forEach(clearTimeout);
    const s = seq.current;
    timers.current = s.map((v, k) => window.setTimeout(() => { setValue(v); if (k === s.length - 1) busy.current = false; }, delay + k * 110));
  };
  const replay = () => {
    if (!full || busy.current) return;
    setValue(seq.current[0]);
    window.setTimeout(() => { busy.current = false; play(); }, 140);
    busy.current = true;
  };

  useEffect(() => { if (inView) play(i * 160); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [inView]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return (
    <li ref={ref} onPointerEnter={(e) => e.pointerType === "mouse" && replay()}
      className="group grid grid-cols-[auto_1fr] items-end gap-x-5 gap-y-3 border-t border-ink/15 py-7 md:grid-cols-12 md:gap-x-8 md:py-9">
      <span className="font-mono text-[12px] tabular-nums tracking-[0.18em] text-ink/40 md:col-span-1 md:self-start md:pt-3" aria-hidden>{pad(i + 1)}</span>
      <p className={cn("col-span-2 font-head font-semibold leading-[.85] tracking-[-0.06em] text-ink md:col-span-7 md:col-start-2 md:row-start-1",
        it.text ? "text-[clamp(2.8rem,8vw,7.2rem)]" : "text-[clamp(4.2rem,13vw,11.5rem)]")}>
        <SrValue it={it} />
        {full ? (
          <span aria-hidden className={cn("flex items-center tabular-nums", it.prefix && "[&>*:first-child]:text-brand-strong")}>
            {value.split("").map((c, k) => <DigitCell key={k} char={c} />)}
          </span>
        ) : (
          <span aria-hidden className="tabular-nums">{it.prefix && <span className="text-brand-strong">{it.prefix}</span>}{it.text ?? group(it.value ?? 0)}</span>
        )}
      </p>
      <div className="col-span-2 flex items-center gap-4 md:col-span-4 md:col-start-9 md:row-start-1 md:justify-end md:pb-4">
        <span className="h-px w-10 bg-ink/30 transition-all duration-500 group-hover:w-16 group-hover:bg-brand-strong" aria-hidden />
        <span className="text-[clamp(1.05rem,1.5vw,1.3rem)] font-medium tracking-[-0.01em] text-ink">{it.label}</span>
      </div>
    </li>
  );
}

export default function NumbersF() {
  const full = useFull();
  return (
    <div className="bg-white py-[var(--u-section-y)] text-ink">
      <div className="u-wrap">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4"><Eyebrow className="text-brand-strong" /></div>
          <div className="md:col-span-8">
            <NumTitle className="text-[clamp(2.2rem,5vw,4.4rem)] font-extrabold leading-[.98] tracking-[-0.05em] text-ink" />
            <p className="mt-6 max-w-[50ch] text-[1.02rem] leading-relaxed text-ink/65">{LEAD}</p>
          </div>
        </div>
        <ol className="mt-14 border-b border-ink/15 md:mt-20">
          {ITEMS.map((it, i) => <Row key={it.label} it={it} i={i} full={full} />)}
        </ol>
      </div>
    </div>
  );
}
