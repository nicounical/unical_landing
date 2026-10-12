/**
 * CONTACTO G · Interactive Gallery — basado en 21st.dev «Contact 01 - Project Inquiry Form» (id 25224, shadcnspace).
 * Del original se conserva: rejilla de 12 columnas con la información de contacto a la izquierda (6 col), una
 * columna vacía y el formulario de consulta de proyecto a la derecha (5 col), con selector de tipo de proyecto,
 * campos de contacto, casilla de aceptación y botón de envío.
 * Adaptación: se elimina la marquesina de logos/insignias de confianza. El tipo de proyecto se elige con chips
 * (radios nativos, navegables con flechas) creados con las opciones reales del formulario (cta.serviceOptions), y
 * la información de contacto incorpora una galería que muestra una foto real del tipo elegido (o el que se
 * señala con el puntero) con fundido. El formulario reutiliza las piezas reales de ContactForm (Field, Privacy,
 * useContactSubmit: misma validación y aviso). Radix/shadcn se sustituyen por elementos nativos.
 */
import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { contact, cta } from "@/content/site";
import { FIELDS, Field, Privacy, useContactSubmit } from "@/core/ContactForm";
import { cn } from "@/lib/utils";
import { ADDRESS, CHANNELS, Eyebrow, OPTION_MEDIA, TEXT, pad, useFull } from "./shared";

const OPTIONS = cta.serviceOptions;
const TOP = FIELDS.filter((f) => ["nombre", "empresa", "email", "telefono"].includes(f.name));
const MSG = FIELDS.find((f) => f.name === "mensaje")!;

const CSS = `
.cg-form input:not([type=checkbox]):not([type=radio]),.cg-form textarea{background:#F6F8FB;border-color:transparent;transition:border-color .25s,background .25s}
.cg-form input:not([type=checkbox]):not([type=radio]):focus,.cg-form textarea:focus{background:#fff;border-color:#2E6CA0}
.cg-form .cf-label{color:#16161F}
`;

export default function ContactG() {
  const full = useFull();
  const { sent, onSubmit } = useContactSubmit();
  const [sel, setSel] = useState<string | null>(null);
  const [peek, setPeek] = useState<string | null>(null);
  const shown = peek ?? sel ?? OPTIONS[0];
  const media = OPTION_MEDIA[shown] ?? OPTION_MEDIA.Otro;
  const gid = useId();

  return (
    <div className="bg-white py-[var(--u-section-y)] text-charcoal">
      <style>{CSS}</style>
      <div className="u-wrap grid grid-cols-12 gap-y-12 md:gap-x-0">
        {/* Información + galería */}
        <div className="col-span-12 flex flex-col md:col-span-6">
          <Eyebrow className="text-brand-strong" />
          <h2 className="mt-5 font-head text-[clamp(2.6rem,5.6vw,4.8rem)] font-extrabold leading-[.95] tracking-[-0.05em] text-ink">
            Trabajemos<br /><span className="text-brand-strong">juntos.</span>
          </h2>
          <p className="mt-5 max-w-[46ch] text-[1.05rem] leading-relaxed text-charcoal/80">{TEXT}</p>

          <figure className="relative mt-9 aspect-[16/10] overflow-hidden rounded-2xl bg-soft">
            <AnimatePresence initial={false}>
              <motion.img key={media.img} src={media.img} alt={media.alt} loading="lazy" decoding="async"
                initial={full ? { opacity: 0, scale: 1.06 } : false} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 h-full w-full object-cover" />
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/65 to-transparent" aria-hidden />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 text-white sm:p-5" aria-live="polite">
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">{pad(OPTIONS.indexOf(shown) + 1)} / {pad(OPTIONS.length)} · {sel === shown ? "Tu selección" : "Trabajo real"}</span>
                <span className="mt-1 block font-head text-[clamp(1.15rem,2vw,1.6rem)] font-semibold tracking-[-0.02em]">{shown === "Otro" ? "Eventos y otros proyectos" : shown}</span>
              </span>
            </figcaption>
          </figure>

          <ul className="mt-6 grid gap-2 sm:grid-cols-3">
            {CHANNELS.map(({ k, label, value, href, Icon, external }) => (
              <li key={k}>
                <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex h-full min-h-[44px] flex-col gap-3 rounded-xl border border-line p-4 transition-colors hover:border-brand-strong/40 hover:bg-brand-tint/50">
                  <Icon className="h-4 w-4 text-brand-strong" aria-hidden />
                  <span>
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-charcoal/55">{label}</span>
                    <span className="mt-0.5 block break-all text-[0.9rem] font-medium text-ink">{value}</span>
                  </span>
                  {external && <span className="sr-only">(se abre en una pestaña nueva)</span>}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-center gap-2 text-sm text-charcoal/65"><ADDRESS.Icon className="h-4 w-4" aria-hidden /> {contact.addressFull.join(", ")}</p>
        </div>

        <div className="hidden md:col-span-1 md:block" />

        {/* Formulario de consulta */}
        <div className="col-span-12 md:col-span-5">
          <form className="cf cg-form rounded-2xl border border-line bg-white p-5 shadow-[0_30px_80px_-40px_rgba(26,26,46,.3)] sm:p-7"
            action={cta.formAction} method="post" noValidate onSubmit={onSubmit} aria-label="Solicitud de presupuesto">
            <fieldset onPointerLeave={() => setPeek(null)}>
              <legend className="text-[0.74rem] font-semibold tracking-[0.04em] text-ink">¿Qué necesitas? *</legend>
              <div className="mt-3 flex flex-wrap gap-2" role="presentation">
                {OPTIONS.map((o) => (
                  <label key={o} className="relative" onPointerEnter={(e) => { if (e.pointerType === "mouse") setPeek(o); }}>
                    <input type="radio" name="servicio" value={o} required className="peer sr-only" checked={sel === o} onChange={() => setSel(o)} aria-describedby={`${gid}-h`} />
                    <span className={cn("inline-flex min-h-[44px] cursor-pointer items-center rounded-full border px-4 text-[0.88rem] font-medium transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand-strong peer-focus-visible:ring-offset-2",
                      sel === o ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:border-ink/40")}>
                      {o}
                    </span>
                  </label>
                ))}
              </div>
              <p id={`${gid}-h`} className="mt-2 text-xs text-charcoal/60">La foto de la izquierda muestra un trabajo real de cada tipo.</p>
            </fieldset>

            <div className="cf-grid mt-6">{TOP.map((f) => <Field key={f.name} f={f} />)}<Field f={MSG} /></div>
            <Privacy />
            <button type="submit" className="u-btn u-btn--dark cf-send w-full"><span className="u-btn__in">{sent ? "Enviado" : "Enviar consulta"}</span></button>
            <p className="cf-note">{cta.note}</p>
            <p className="cf-ok" role="status" hidden={!sent}>{cta.ok}</p>
          </form>
        </div>
      </div>
    </div>
  );
}
