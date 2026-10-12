import { useEffect, useRef } from "react";
import { numbers } from "@/content/site";
import { gsap } from "@/core/scroll";
import { fullMotion } from "@/core/env";
import { fmt } from "@/core/ui";

export type NumItem = (typeof numbers.items)[number];

/** Valor final legible (para lectores de pantalla y modo estático). */
export const finalText = (it: NumItem) => (it.text ? it.text : `${it.prefix ?? ""}${fmt(it.value ?? 0)}`);

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
      gsap.to(o, { v: it.value!, duration: 2.2, ease: "power3.out", onUpdate: () => { el.textContent = `${it.prefix ?? ""}${fmt(o.v)}`; } });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [it]);
  return <span ref={ref} className={className}>{finalText(it)}</span>;
}

export const NumTitle = ({ className = "" }: { className?: string }) => (
  <h2 className={className}>{numbers.titleA}<em className="u-em">{numbers.titleEm}</em>{numbers.titleB}</h2>
);
