import { useLayoutEffect, useRef, type DependencyList } from "react";
import { gsap } from "./scroll";
import { fullMotion, reducedMotion, finePointer, isMobile } from "./env";

export type MotionCtx = {
  root: HTMLElement;
  /** true si se permite animación completa (sin reduced motion ni equipo limitado). */
  full: boolean;
  reduce: boolean;
  fine: boolean;
  mobile: boolean;
  /** Registra una limpieza (listeners en window, timers…). */
  onCleanup: (fn: () => void) => void;
};

/**
 * Ejecuta animaciones GSAP dentro de un gsap.context ligado al elemento raíz.
 * Todo (tweens, ScrollTriggers) se revierte al desmontar la variante.
 */
export function useGsap<T extends HTMLElement = HTMLElement>(
  setup: (ctx: MotionCtx) => void | (() => void),
  deps: DependencyList = [],
) {
  const ref = useRef<T>(null);
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const cleanups: (() => void)[] = [];
    const ctx = gsap.context(() => {
      const r = setup({
        root,
        full: fullMotion(),
        reduce: reducedMotion(),
        fine: finePointer(),
        mobile: isMobile(),
        onCleanup: (fn) => cleanups.push(fn),
      });
      if (typeof r === "function") cleanups.push(r);
    }, root);
    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}
