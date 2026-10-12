/**
 * PROYECTOS G · Interactive Gallery — basado en 21st.dev «Masonry Lightbox» (id 26223).
 * Del original se conserva: rejilla masonry por columnas CSS (2/3/4, break-inside: avoid) con la proporción real de
 * cada foto, entrada de cada pieza con opacidad + y 16 + blur 6 px escalonada (0.05 s, tope 12), elevación −3 px y
 * zoom 1.06 al pasar con degradado y pie que sube, y lightbox en portal con `layoutId` compartido (la miniatura
 * crece hasta el visor con muelle 260/28), fondo desenfocado, pie que aparece con retardo, botón de cierre,
 * Esc / clic fuera y bloqueo del scroll del body compensando la barra.
 * Adaptación: fotos de demo → los 8 proyectos reales (con enlace «Ver proyecto») + la galería de trabajos de
 * site.ts; next/image → <img loading="lazy">. Añadido para accesibilidad: navegación anterior/siguiente con
 * botones y ←/→, trampa de foco y devolución del foco, cierre de 44 px, parada de Lenis y pies visibles en
 * pantallas táctiles. Fondo claro de marca. Sin movimiento: sin entradas ni transición compartida.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { getLenis } from "@/core/scroll";
import { AllLink, ArrowUR, Chevron, Eyebrow, GALLERY, ITEMS, LEAD, TITLE, sizeOf, useFull } from "./shared";

type Pic = { id: string; src: string; alt: string; title: string; sub: string; w: number; h: number; href?: string };

const PICS: Pic[] = [
  ...ITEMS.map((p) => ({ id: p.id, src: p.img, alt: p.alt, title: p.title, sub: p.kind, href: p.href, ...sizeOf(p.img) })),
  ...GALLERY.slice(0, 8).map((g, i) => ({ id: `g${i}`, src: g.src, alt: g.alt, title: g.alt, sub: "Galería de trabajos", w: g.w, h: g.h })),
];
// Intercala proyectos y galería para que la rejilla respire.
const ORDER: Pic[] = (() => {
  const a = PICS.filter((p) => p.href), b = PICS.filter((p) => !p.href), out: Pic[] = [];
  while (a.length || b.length) { if (a.length) out.push(a.shift()!); if (b.length) out.push(b.shift()!); }
  return out;
})();

const ENTRANCE = { duration: 0.6, stagger: 0.05, max: 12, ease: [0.22, 1, 0.36, 1] as const };
const SPRING = { type: "spring" as const, stiffness: 260, damping: 28 };

function Lightbox({ i, setI, full, origin }: { i: number | null; setI: (i: number | null) => void; full: boolean; origin: string | null }) {
  const panel = useRef<HTMLDivElement>(null);
  const open = i !== null;
  const close = useCallback(() => setI(null), [setI]);
  const step = useCallback((d: number) => setI(i === null ? null : (i + d + ORDER.length) % ORDER.length), [i, setI]);

  useEffect(() => {
    if (!open) return;
    const back = document.activeElement as HTMLElement | null;
    const lenis = getLenis();
    lenis?.stop();
    const sw = window.innerWidth - document.documentElement.clientWidth;
    const prevO = document.body.style.overflow, prevP = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (sw > 0) document.body.style.paddingRight = `${sw}px`;
    const t = window.setTimeout(() => panel.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus(), 60);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevO; document.body.style.paddingRight = prevP;
      lenis?.start();
      back?.focus?.({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); close(); return; }
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); return; }
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); return; }
      if (e.key !== "Tab") return;
      const f = Array.from(panel.current?.querySelectorAll<HTMLElement>("button, [href]") ?? []);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (!panel.current?.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [open, close, step]);

  const pic = i !== null ? ORDER[i] : null;
  return createPortal(
    <AnimatePresence>
      {pic && (
        <motion.div key="lb" className="fixed inset-0 z-[120] flex items-center justify-center bg-night/75 p-4 backdrop-blur-xl sm:p-10 lg:p-16"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onClick={close}>
          <div ref={panel} role="dialog" aria-modal="true" aria-label={pic.title} className="relative flex max-w-full flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <motion.div key={pic.id} layoutId={full && pic.id === origin ? `pg-${pic.id}` : undefined} transition={SPRING}
              initial={full && pic.id !== origin ? { opacity: 0, scale: 0.97 } : undefined} animate={{ opacity: 1, scale: 1 }}
              className="relative overflow-hidden rounded-2xl bg-ink shadow-2xl">
              <img src={pic.src} alt={pic.alt} width={pic.w} height={pic.h}
                className="block h-auto max-h-[68vh] w-auto max-w-[min(92vw,1000px)] object-contain sm:max-h-[72vh]" />
              <motion.div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-5 pt-12"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: full ? 0.2 : 0, duration: 0.35 }}>
                <p className="text-base font-semibold text-white">{pic.title}</p>
                <p className="text-sm text-white/70">{pic.sub}</p>
              </motion.div>
              <button type="button" onClick={close} aria-label="Cerrar visor" data-autofocus
                className="absolute right-2.5 top-2.5 grid h-11 w-11 place-items-center rounded-full bg-black/45 text-white backdrop-blur-md transition-colors hover:bg-black/70">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" /></svg>
              </button>
            </motion.div>
            <div className="mt-4 flex w-full items-center justify-between gap-3 text-white">
              <div className="flex gap-2">
                <button type="button" onClick={() => step(-1)} aria-label="Foto anterior" className="grid h-11 w-11 place-items-center rounded-full border border-solid border-white/30 transition hover:bg-white hover:text-ink"><Chevron dir="left" /></button>
                <button type="button" onClick={() => step(1)} aria-label="Foto siguiente" className="grid h-11 w-11 place-items-center rounded-full border border-solid border-white/30 transition hover:bg-white hover:text-ink"><Chevron /></button>
              </div>
              <span className="font-mono text-[11px] tracking-[0.16em] text-white/60" aria-hidden>{String((i ?? 0) + 1).padStart(2, "0")} / {ORDER.length}</span>
              {pic.href ? (
                <a href={pic.href} className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-4 text-[13px] font-semibold text-ink transition hover:bg-brand">
                  Ver proyecto <ArrowUR className="h-3.5 w-3.5" />
                </a>
              ) : <span className="w-11" aria-hidden />}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default function ProjectsG() {
  const full = useFull();
  const [sel, setSel] = useState<number | null>(null);
  const [origin, setOrigin] = useState<string | null>(null);

  return (
    <div className="bg-soft py-[var(--u-section-y)] text-ink">
      <div className="u-wrap">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Eyebrow className="text-brand-strong" />
            <h2 className="mt-4 text-[length:var(--u-h2)] font-extrabold leading-[1] tracking-[-0.05em] text-ink">{TITLE}</h2>
          </div>
          <div className="md:col-span-5 md:justify-self-end">
            <p className="max-w-[40ch] text-[15px] leading-relaxed text-charcoal/75">{LEAD} Abre cualquier foto para verla en grande.</p>
          </div>
        </div>

        <div className="mt-12 columns-2 gap-3 sm:columns-3 sm:gap-4 md:mt-14 lg:columns-4 lg:gap-5">
          {ORDER.map((pic, i) => (
            <motion.button key={pic.id} type="button" layoutId={full ? `pg-${pic.id}` : undefined}
              onClick={() => { setOrigin(pic.id); setSel(i); }} aria-haspopup="dialog" aria-label={`${pic.title} · ${pic.sub} · ampliar`}
              className="group relative mb-3 block w-full min-w-0 overflow-hidden rounded-xl bg-line text-left focus-visible:outline-brand-strong sm:mb-4 lg:mb-5"
              style={{ breakInside: "avoid" }}
              initial={full ? { opacity: 0, y: 16, filter: "blur(6px)" } : false}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: ENTRANCE.duration, delay: full ? (i % ENTRANCE.max) * ENTRANCE.stagger : 0, ease: ENTRANCE.ease }}
              whileHover={full ? { y: -3 } : undefined}>
              <img src={pic.src} alt={pic.alt} width={pic.w} height={pic.h} loading="lazy" decoding="async"
                className="block h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.06]" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-70" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 sm:p-4 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
                <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-white sm:text-sm">{pic.title}</p>
                <p className="mt-0.5 text-[11px] text-white/70 sm:text-xs">{pic.sub}</p>
              </div>
              {pic.href && (
                <span aria-hidden className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink">Proyecto</span>
              )}
            </motion.button>
          ))}
        </div>

        <div className="mt-10 flex justify-center text-ink"><AllLink /></div>
      </div>
      <Lightbox i={sel} setI={setSel} full={full} origin={origin} />
    </div>
  );
}
