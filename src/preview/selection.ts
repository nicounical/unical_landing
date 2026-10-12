import { useEffect, useState } from "react";
import { LETTERS, SECTIONS, type Letter, type SectionKey } from "@/config/sections";
import { FINAL_SELECTION } from "@/config/final-selection";
import { PREVIEW } from "@/core/env";

export type Selection = Record<SectionKey, Letter>;
const KEY = "unical-landing:selection:v1";

const isLetter = (v: unknown): v is Letter => typeof v === "string" && (LETTERS as string[]).includes(v);

function fromUrl(): Partial<Selection> {
  const p = new URLSearchParams(window.location.search);
  const out: Partial<Selection> = {};
  SECTIONS.forEach((s) => { const v = p.get(s.key)?.toUpperCase(); if (isLetter(v)) out[s.key] = v; });
  return out;
}

function fromStorage(): Partial<Selection> {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const obj = JSON.parse(raw) as Record<string, unknown>;
    const out: Partial<Selection> = {};
    SECTIONS.forEach((s) => { if (isLetter(obj[s.key])) out[s.key] = obj[s.key] as Letter; });
    return out;
  } catch { return {}; }
}

function save(sel: Selection) {
  try { window.localStorage.setItem(KEY, JSON.stringify(sel)); } catch { /* almacenamiento no disponible */ }
}

function writeUrl(sel: Selection) {
  const p = new URLSearchParams(window.location.search);
  SECTIONS.forEach((s) => { if (sel[s.key] !== FINAL_SELECTION[s.key]) p.set(s.key, sel[s.key]); else p.delete(s.key); });
  const q = p.toString();
  window.history.replaceState(null, "", `${window.location.pathname}${q ? `?${q}` : ""}${window.location.hash}`);
}

/** Selección activa. En producción siempre es FINAL_SELECTION. En preview: URL > almacenamiento local > FINAL_SELECTION. */
export function useSelection() {
  const [sel, setSel] = useState<Selection>(() =>
    PREVIEW ? { ...FINAL_SELECTION, ...fromStorage(), ...fromUrl() } : { ...FINAL_SELECTION },
  );
  useEffect(() => { if (PREVIEW) { save(sel); writeUrl(sel); } }, [sel]);
  return {
    sel,
    set: (k: SectionKey, v: Letter) => setSel((s) => ({ ...s, [k]: v })),
    setAll: (v: Letter) => setSel(() => Object.fromEntries(SECTIONS.map((s) => [s.key, v])) as Selection),
    reset: () => setSel({ ...FINAL_SELECTION }),
  };
}

export const selectionToCode = (sel: Selection) =>
  `export const FINAL_SELECTION: Record<SectionKey, Letter> = {\n${SECTIONS.map((s) => `  ${s.key}: "${sel[s.key]}",`).join("\n")}\n};`;

export const selectionToQuery = (sel: Selection) => SECTIONS.map((s) => `${s.key}=${sel[s.key]}`).join("&");
