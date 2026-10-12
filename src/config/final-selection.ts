import type { Letter, SectionKey } from "./sections";

/**
 * COMBINACIÓN DEFINITIVA para la web pública.
 * En producción (sin selector) se renderiza exactamente esta combinación.
 * Para cambiarla: elige en el comparador, pulsa «Copiar configuración» y pega aquí el resultado.
 *
 * Propuesta inicial de dirección creativa: máximo impacto con UNA sola sección fijada con pin (el reel),
 * siguiendo la regla de ui-ux-pro-max de no fijar más de 1–2 secciones por página.
 */
export const FINAL_SELECTION: Record<SectionKey, Letter> = {
  hero: "A",
  services: "A",
  reel: "A",
  projects: "A",
  process: "A",
  numbers: "A",
  sectors: "A",
  why: "A",
  clients: "A",
  contact: "A",
};
