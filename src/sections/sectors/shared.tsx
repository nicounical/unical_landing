import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { contact, sectors } from "@/content/site";
import { fullMotion } from "@/core/env";
import { getLenis } from "@/core/scroll";
import { cn } from "@/lib/utils";

/** Movimiento completo (respeta reduced-motion, equipos modestos y `?motion=` en preview). */
export const useFull = () => fullMotion();

export const EYEBROW = sectors.eyebrow;
export const TITLE = sectors.title;
export const LEAD = sectors.lead;
export const CONTACT_URL = contact.contactUrl;

/** Texto alternativo descriptivo de cada foto real (lo que se ve en la imagen). */
const ALT: Record<string, string> = {
  "Vehículos": "Flota de ambulancias rotuladas en una nave",
  "Stands y Ferias": "Stand de Truphone en una feria",
  "Retail y PLV": "Pop-up store iluminada de Venca",
  "Hostelería": "Letras corpóreas y decoración de un restaurante Five Guys",
  "Oficinas": "Vinilo esmerilado en las mamparas de una oficina",
  "Publicidad Exterior": "Vallas publicitarias de gran formato en la calle",
  "Eventos Deportivos": "Arco de meta del Disney Fun Run",
  "Pharma": "Stand de Neurocare impreso a todo color",
};

export type Sector = { i: number; n: string; name: string; size: number; img: string; alt: string };

export const ITEMS: Sector[] = sectors.items.map((s, i) => ({
  ...s, i, n: pad(i + 1), alt: ALT[s.name] ?? `Proyecto de Unical para el sector ${s.name}`,
}));

export function pad(n: number) { return String(n).padStart(2, "0"); }

/** Eyebrow con raya de marca. */
export const Eyebrow = ({ className = "", children = EYEBROW }: { className?: string; children?: string }) => (
  <p className={cn("inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em]", className)}>
    <span className="h-px w-8 bg-current opacity-70" aria-hidden /> {children}
  </p>
);

/** Flecha de enlace (SVG inline, sin emoji). */
export const ArrowUR = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cn("h-4 w-4", className)}>
    <path d="M7 17L17 7M8 7h9v9" />
  </svg>
);

/** Diálogo modal accesible: foco atrapado y devuelto, Esc, clic fuera, scroll del body (y Lenis) bloqueado. */
export function SectorModal({ open, onClose, label, children, className = "" }: {
  open: boolean; onClose: () => void; label: string; children: ReactNode; className?: string;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    if (!open) return;
    const back = document.activeElement as HTMLElement | null;
    const lenis = getLenis();
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      Array.from(panel.current?.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])') ?? []).filter((n) => !n.hasAttribute("disabled"));
    const t = window.setTimeout(() => (panel.current?.querySelector<HTMLElement>("[data-autofocus]") ?? focusables()[0] ?? panel.current)?.focus(), 60);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); close.current(); return; }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (!f.length) { e.preventDefault(); return; }
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (!panel.current?.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", key);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", key);
      document.body.style.overflow = prev;
      lenis?.start();
      back?.focus?.({ preventScroll: true });
    };
  }, [open]);

  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div key="sector-modal" className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 md:p-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }}>
          <div className="absolute inset-0 bg-night/80 backdrop-blur-md" onClick={onClose} aria-hidden />
          <div ref={panel} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1} className={cn("relative w-full outline-none", className)}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
