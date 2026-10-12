import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { reducedMotion } from "./env";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

/** Smooth scroll (Lenis) sincronizado con ScrollTrigger. Se desactiva con prefers-reduced-motion. */
export function initSmoothScroll(): () => void {
  if (reducedMotion() || lenis) return () => {};
  lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.95, touchMultiplier: 1.4 });
  lenis.on("scroll", ScrollTrigger.update);
  const raf = (t: number) => lenis?.raf(t * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(raf);
    lenis?.destroy();
    lenis = null;
  };
}

export const getLenis = () => lenis;

export function scrollToTarget(target: string | HTMLElement, offset = 0) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset });
  else el.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
}

let refreshTimer = 0;
/** Recalcula los ScrollTrigger tras un cambio de layout (p. ej. al cambiar de variante). */
export function refreshScroll() {
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => {
    // Las variantes se cargan de forma diferida y en cualquier orden: se ordenan los triggers
    // por posición en la página antes de recalcular, para que los pins se apilen bien.
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  }, 150);
}

export { gsap, ScrollTrigger };
