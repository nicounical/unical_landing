/**
 * PROYECTOS A · Cinematic Premium — basado en 21st.dev «Featured Project Hero» (id 37282, ibrandify).
 * Del original se conserva: cabecera en dos columnas (título + intro con contador «Selección / 08 proyectos»),
 * fila de pestañas accesible (role=tablist, número en pastilla + nombre, roving tabindex, ←/→/Inicio/Fin) con
 * desplazamiento horizontal propio, panel con visual grande a la izquierda e información a la derecha (meta
 * categoría/cliente, nombre, chips, acción con flecha que se desplaza al pasar el cursor) y entrada del panel
 * `fph-enter` (opacidad + y 8 px). Contenedor con container-queries → aquí breakpoints de Tailwind.
 * Adaptación: los «visual» de demo se sustituyen por las fotos reales de `projects`; se eliminan «year», «summary»
 * y «outcome» (no existen datos reales) y se muestran cliente y tipo de trabajo. Capa cinematográfica añadida:
 * fondo nocturno con la foto activa desenfocada en fundido, revelado de la imagen por máscara + zoom lento,
 * viñeta tipo letterbox y numeral grande. Acción → enlace real del proyecto; «Ver todos los proyectos» → allHref.
 */
import { useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ALL_HREF, ALL_LABEL, ArrowUR, COUNT, Eyebrow, ITEMS, LEAD, TITLE, pad, useFull } from "./shared";

const ease = [0.22, 1, 0.36, 1] as const;

export default function ProjectsA() {
  const full = useFull();
  const uid = useId();
  const [index, setIndex] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const p = ITEMS[index];
  const panelId = `${uid}-panel`;

  const select = (i: number) => {
    setIndex(i);
    tabs.current[i]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: full ? "smooth" : "auto" });
  };
  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.altKey || e.ctrlKey || e.metaKey || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const n = ITEMS.length;
    const next = e.key === "Home" ? 0 : e.key === "End" ? n - 1 : (i + (e.key === "ArrowRight" ? 1 : -1) + n) % n;
    select(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="relative isolate overflow-hidden bg-night py-[var(--u-section-y)] text-white">
      {/* Ambiente: la foto activa, desenfocada, detrás de todo */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <AnimatePresence initial={false}>
          <motion.img key={p.id} src={p.img} alt="" loading="lazy"
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-25 blur-3xl saturate-150"
            initial={full ? { opacity: 0 } : false} animate={{ opacity: 0.25 }} exit={{ opacity: 0 }} transition={{ duration: 1.2, ease }} />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-night via-night/70 to-night" />
      </div>

      <div className="u-wrap">
        {/* Cabecera */}
        <Eyebrow className="text-brand" />
        <header className="mt-5 grid items-end gap-6 lg:grid-cols-[1.3fr_1fr] lg:gap-10">
          <h2 id={`${uid}-title`} className="max-w-[16ch] text-[length:var(--u-h2)] font-extrabold leading-[1.02] tracking-[-0.05em] text-white [text-wrap:balance]">
            {TITLE}
          </h2>
          <div className="grid justify-items-start gap-4">
            <p className="max-w-[40ch] text-[15px] leading-relaxed text-white/65">{LEAD}</p>
            <p className="flex items-center gap-2 text-[11px] tracking-[0.06em] text-white/55">
              Selección <span aria-hidden>/</span>
              <strong className="text-[12px] font-semibold tabular-nums text-white">{COUNT} proyectos</strong>
            </p>
          </div>
        </header>

        {/* Pestañas */}
        <div role="tablist" aria-label="Proyectos destacados" aria-orientation="horizontal"
          className="-mx-1 mt-10 flex gap-2 overflow-x-auto border-b border-white/10 px-1 pb-5 pt-1 [scrollbar-width:thin] [mask-image:linear-gradient(to_right,#000_92%,transparent)] md:mt-12">
          {ITEMS.map((it, i) => {
            const on = i === index;
            return (
              <button key={it.id} ref={(el) => { tabs.current[i] = el; }} type="button" role="tab"
                id={`${uid}-tab-${i}`} aria-controls={panelId} aria-selected={on} tabIndex={on ? 0 : -1}
                onClick={() => select(i)} onKeyDown={(e) => onKey(e, i)}
                className={cn("inline-flex min-h-[44px] flex-none items-center gap-2.5 whitespace-nowrap rounded-xl border border-solid py-2 pl-2 pr-4 text-[13px] transition-colors duration-200",
                  on ? "border-white/25 bg-white/10 text-white" : "border-transparent text-white/55 hover:bg-white/5 hover:text-white/85")}>
                <span aria-hidden className={cn("grid h-7 w-7 place-items-center rounded-lg text-[10px] font-semibold tabular-nums transition-colors",
                  on ? "bg-brand text-night" : "bg-white/10 text-white/60")}>{pad(i + 1)}</span>
                {it.title}
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <article key={p.id} id={panelId} role="tabpanel" aria-labelledby={`${uid}-tab-${index}`} tabIndex={0}
          className="mt-8 grid min-w-0 items-center gap-7 rounded-[4px] md:mt-10 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
          <div className="relative min-w-0 overflow-hidden rounded-[22px] border border-solid border-white/10 bg-ink shadow-[0_40px_120px_-40px_rgba(0,0,0,.8)]">
            <motion.div className="relative aspect-[4/3] sm:aspect-[16/11]"
              initial={full ? { clipPath: "inset(8% 8% 8% 8% round 22px)" } : false}
              animate={{ clipPath: "inset(0% 0% 0% 0% round 22px)" }} transition={{ duration: 1.1, ease }}>
              <motion.img src={p.img} alt={p.alt} loading="lazy" decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
                initial={full ? { scale: 1.16, filter: "brightness(.6)" } : false}
                animate={{ scale: 1.02, filter: "brightness(1)" }} transition={{ duration: 2.4, ease }} />
              {/* Letterbox + viñeta */}
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_55%,rgba(0,0,0,.55))]" />
              <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
              <span aria-hidden className="absolute bottom-4 left-5 font-head text-[clamp(3rem,7vw,5.5rem)] font-extrabold leading-none tracking-[-0.06em] text-white/90 md:bottom-5 md:left-6">
                {pad(index + 1)}
              </span>
              <span aria-hidden className="absolute bottom-5 right-5 text-[11px] font-medium tabular-nums tracking-[0.16em] text-white/70 md:right-6">
                {pad(index + 1)} / {COUNT}
              </span>
            </motion.div>
          </div>

          <motion.div className="min-w-0" initial={full ? { opacity: 0, y: 8 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: full ? 0.15 : 0, ease }}>
            <p className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-brand">
              <span>{p.kind}</span><span aria-hidden className="text-white/30">/</span><span className="text-white/60">{p.client}</span>
            </p>
            <h3 className="mt-4 text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-[1.04] tracking-[-0.05em] text-white">{p.title}</h3>
            <dl className="mt-6 grid max-w-[30rem] grid-cols-2 gap-px overflow-hidden rounded-xl border border-solid border-white/10 bg-white/10 text-sm">
              <div className="bg-night/80 p-4"><dt className="text-[10px] uppercase tracking-[0.16em] text-white/45">Cliente</dt><dd className="mt-1.5 font-medium text-white">{p.client}</dd></div>
              <div className="bg-night/80 p-4"><dt className="text-[10px] uppercase tracking-[0.16em] text-white/45">Trabajo</dt><dd className="mt-1.5 font-medium text-white">{p.kind}</dd></div>
            </dl>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a href={p.href} className="group inline-flex min-h-[48px] items-center gap-6 rounded-xl bg-brand-strong px-5 text-sm font-semibold text-white transition hover:bg-brand-deep active:translate-y-px">
                Ver proyecto <span className="sr-only">{p.title}</span>
                <ArrowUR className="h-[17px] w-[17px] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a href={ALL_HREF} className="group inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-white/80 underline-offset-4 hover:text-white hover:underline">
                {ALL_LABEL}
              </a>
            </div>
          </motion.div>
        </article>
      </div>
    </div>
  );
}
