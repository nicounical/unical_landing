import type { ComponentType, LazyExoticComponent } from "react";
import { heroVariants } from "@/sections/hero";
import { servicesVariants } from "@/sections/services";
import { reelVariants } from "@/sections/reel";
import { projectsVariants } from "@/sections/projects";
import { processVariants } from "@/sections/process";
import { numbersVariants } from "@/sections/numbers";
import { sectorsVariants } from "@/sections/sectors";
import { whyVariants } from "@/sections/why";
import { clientsVariants } from "@/sections/clients";
import { contactVariants } from "@/sections/contact";

export type Letter = "A" | "B" | "C" | "D" | "E" | "F" | "G";
export const LETTERS: Letter[] = ["A", "B", "C", "D", "E", "F", "G"];

/** Componente de 21st.dev del que parte la variante (código real descargado vía MCP y adaptado). */
export type Source21 = { id: number; name: string; author?: string };

export type VariantDef = {
  name: string;
  /** Dirección creativa (ver DIRECTIONS). */
  direction: string;
  idea: string;
  source?: Source21;
  Component: LazyExoticComponent<ComponentType>;
};

export type VariantMap = Partial<Record<Letter, VariantDef>>;

export type SectionKey =
  | "hero" | "services" | "reel" | "projects" | "process" | "numbers" | "sectors" | "why" | "clients" | "contact";

export type SectionDef = { key: SectionKey; id: string; label: string; variants: VariantMap };

export { DIRECTIONS } from "./directions";

/* Cada variante se carga en su propio chunk: solo se descarga la que se está viendo. */
const ALL: SectionDef[] = [
  { key: "hero", id: "inicio", label: "Portada", variants: heroVariants },
  { key: "services", id: "servicios", label: "Servicios", variants: servicesVariants },
  { key: "reel", id: "reel", label: "Unical in Motion", variants: reelVariants },
  { key: "projects", id: "proyectos", label: "Proyectos", variants: projectsVariants },
  { key: "process", id: "proceso", label: "Proceso", variants: processVariants },
  { key: "numbers", id: "cifras", label: "Cifras", variants: numbersVariants },
  { key: "sectors", id: "sectores", label: "Sectores", variants: sectorsVariants },
  { key: "why", id: "por-que", label: "Por qué Unical", variants: whyVariants },
  { key: "clients", id: "clientes", label: "Clientes", variants: clientsVariants },
  { key: "contact", id: "contacto", label: "Contacto", variants: contactVariants },
];

/** Solo las secciones que ya tienen alguna variante construida. */
export const SECTIONS: SectionDef[] = ALL.filter((s) => Object.keys(s.variants).length > 0);

/** Variante pedida o, si aún no existe, la primera disponible. */
export function variantOf(def: SectionDef, l: Letter): VariantDef & { letter: Letter } {
  const letter = def.variants[l] ? l : LETTERS.find((x) => def.variants[x])!;
  return { ...def.variants[letter]!, letter };
}
