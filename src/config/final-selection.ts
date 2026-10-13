import type { Letter, SectionKey } from "./sections";

/**
 * COMBINACIÓN DEFINITIVA para la web pública.
 * En producción (sin selector) se renderiza exactamente esta combinación.
 * Para cambiarla: elige en el comparador, pulsa «Copiar configuración» y pega aquí el resultado.
 *
 * Propuesta inicial: solo dos escenas fijadas con scroll (portada y reel), siguiendo la regla de
 * ui-ux-pro-max de no fijar más de 1–2 secciones por página; el resto alterna claro/oscuro.
 */
export const FINAL_SELECTION: Record<SectionKey, Letter> = {
  hero: "A",
  services: "C",
  reel: "A",
  projects: "E",
  process: "D",
  numbers: "A",
  sectors: "E",
  why: "D",
  clients: "F",
  contact: "A",
};
