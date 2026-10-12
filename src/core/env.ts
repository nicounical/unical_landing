/** Entorno y capacidades del dispositivo. */
export const PREVIEW: boolean = import.meta.env.DEV || import.meta.env.VITE_PREVIEW === "1";

const mq = (q: string) => typeof window !== "undefined" && window.matchMedia(q).matches;

export const reducedMotion = (): boolean => mq("(prefers-reduced-motion: reduce)");
export const finePointer = (): boolean => mq("(hover: hover) and (pointer: fine)");
export const isMobile = (): boolean => mq("(max-width: 767px)");

/** Equipos modestos / ahorro de datos → se sirven alternativas estáticas o vídeos ligeros. */
export const lowPower = (): boolean => {
  if (typeof navigator === "undefined") return false;
  const n = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string }; deviceMemory?: number };
  if (n.connection?.saveData) return true;
  if (n.connection?.effectiveType && /(^|-)2g$/.test(n.connection.effectiveType)) return true;
  if (typeof n.deviceMemory === "number" && n.deviceMemory <= 2) return true;
  if (typeof n.hardwareConcurrency === "number" && n.hardwareConcurrency <= 2) return true;
  return false;
};

/** En preview, `?motion=full` o `?motion=static` fuerzan el modo para revisar animaciones o alternativas estáticas. */
const forced = (): "full" | "static" | null => {
  if (!PREVIEW || typeof window === "undefined") return null;
  const m = new URLSearchParams(window.location.search).get("motion");
  return m === "full" || m === "static" ? m : null;
};

/** Movimiento completo permitido (sin reduced-motion ni equipo limitado). */
export const fullMotion = (): boolean => {
  const f = forced();
  if (f) return f === "full";
  return !reducedMotion() && !lowPower();
};
