import { useEffect, useRef, useState, type RefObject } from "react";
import { numbers } from "@/content/site";
import { gsap } from "@/core/scroll";
import { fullMotion } from "@/core/env";
import { cn } from "@/lib/utils";

export type NumItem = (typeof numbers.items)[number];

/** Movimiento completo (respeta reduced-motion, equipos modestos y `?motion=` en preview). */
export const useFull = () => fullMotion();

export const EYEBROW = numbers.eyebrow;
export const LEAD = numbers.lead;
export const ITEMS: NumItem[] = numbers.items;
/** Título completo en texto plano (para aria-label o usos sin <em>). */
export const TITLE_TEXT = `${numbers.titleA}${numbers.titleEm}${numbers.titleB}`;

/** Miles con punto (3.000), igual que «+3.000 proyectos» de la landing original. */
export const group = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/** Valor final legible (para lectores de pantalla y modo estático). */
export const finalText = (it: NumItem) => (it.text ? it.text : `${it.prefix ?? ""}${group(it.value ?? 0)}`);

export const pad = (n: number) => String(n).padStart(2, "0");

/** Contador que cuenta al entrar en pantalla. Con reduced motion muestra el valor final. */
export function Count({ it, className = "" }: { it: NumItem; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || it.text || !fullMotion()) return;
    const o = { v: 0 };
    el.textContent = `${it.prefix ?? ""}0`;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      gsap.to(o, { v: it.value!, duration: 2.2, ease: "power3.out", onUpdate: () => { el.textContent = `${it.prefix ?? ""}${group(o.v)}`; } });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [it]);
  return <span ref={ref} className={className}>{finalText(it)}</span>;
}

export const NumTitle = ({ className = "", emClassName = "" }: { className?: string; emClassName?: string }) => (
  <h2 className={className}>{numbers.titleA}<em className={cn("u-em", emClassName)}>{numbers.titleEm}</em>{numbers.titleB}</h2>
);

/** Eyebrow con raya de marca (mismo patrón que las otras secciones). */
export const Eyebrow = ({ className = "", children = EYEBROW }: { className?: string; children?: string }) => (
  <p className={cn("inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em]", className)}>
    <span className="h-px w-8 bg-current opacity-70" aria-hidden /> {children}
  </p>
);

/** Texto solo para lectores de pantalla con el valor final y su etiqueta. */
export const SrValue = ({ it, withLabel = false }: { it: NumItem; withLabel?: boolean }) => (
  <span className="sr-only">{finalText(it)}{withLabel ? ` ${it.label}` : ""}</span>
);

/** true la primera vez que el elemento entra en pantalla (siempre true sin movimiento completo). */
export function useInViewOnce<T extends HTMLElement>(ref: RefObject<T>, amount = 0.35) {
  const [seen, setSeen] = useState(() => !fullMotion());
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: amount });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, amount, seen]);
  return seen;
}

/** Valor que cuenta de 0 a `target` con ease-out cúbico (como los tickers originales). Sin movimiento: `target`. */
export function useCountUp(target: number, run: boolean, duration = 2, delay = 0) {
  const [v, setV] = useState(() => (fullMotion() ? 0 : target));
  useEffect(() => {
    if (!fullMotion()) { setV(target); return; }
    if (!run) return;
    let raf = 0, t0 = 0;
    const tick = (t: number) => {
      if (!t0) t0 = t;
      const p = Math.min(1, Math.max(0, (t - t0 - delay * 1000) / (duration * 1000)));
      setV(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration, delay]);
  return v;
}
