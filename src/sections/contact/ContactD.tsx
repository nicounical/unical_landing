/**
 * CONTACTO D · Minimal Luxury — basado en 21st.dev «Contact Form» (id 35258).
 * Del original se conserva: sección a dos columnas (apiladas por debajo de lg) con cabecera a la izquierda
 * —eyebrow, h2, descripción y lista de detalles de contacto con icono— y el formulario dentro de una tarjeta a la
 * derecha, con región role="status" para el aviso de envío.
 * Adaptación: los campos y el envío son los del formulario real de la landing (ContactForm: nombre, empresa,
 * email, teléfono, servicio, mensaje, privacidad); los detalles son los canales reales (teléfono, WhatsApp, email
 * y dirección). Se elimina la promesa genérica «We reply within one business day» del original (solo queda la
 * nota real de site.ts dentro del formulario). Tipografía sobria, líneas finas y una sola entrada suave.
 */
import { motion } from "motion/react";
import { ContactForm } from "@/core/ContactForm";
import { ADDRESS, CHANNELS, Eyebrow, TEXT, useFull } from "./shared";

const CSS = `
.cd-form .cf-grid{gap:1.1rem 1rem}
.cd-form .cf-label{font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:#52525B;font-weight:600}
.cd-form input:not([type=checkbox]),.cd-form select,.cd-form textarea{border-radius:0;border:0;border-bottom:1px solid #D5DBE4;padding:.7rem 0;background:transparent;transition:border-color .3s}
.cd-form input:not([type=checkbox]):focus,.cd-form select:focus,.cd-form textarea:focus{outline:none;border-bottom-color:#2E6CA0;box-shadow:0 1px 0 0 #2E6CA0}
.cd-form .cf-send{width:100%;background:#16161F;border-radius:999px}
.cd-form .cf-send:hover{background:#2E6CA0}
`;

export default function ContactD() {
  const full = useFull();
  const fade = (d: number) => full ? { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-8% 0px" }, transition: { duration: 1, delay: d, ease: [0.16, 1, 0.3, 1] as const } } : {};
  return (
    <div className="bg-white py-[var(--u-section-y)] text-charcoal">
      <style>{CSS}</style>
      <div className="u-wrap grid gap-14 lg:grid-cols-2 lg:gap-20">
        <motion.div {...fade(0)} className="max-w-xl">
          <Eyebrow className="text-brand-strong" />
          <h2 className="mt-6 font-head text-[clamp(2.6rem,5.4vw,4.6rem)] font-semibold leading-[1] tracking-[-0.045em] text-ink">
            Trabajemos <span className="text-brand-strong">juntos.</span>
          </h2>
          <p className="mt-6 max-w-[46ch] text-pretty text-[1.08rem] leading-relaxed text-charcoal/80">{TEXT}</p>

          <ul className="mt-12 border-t border-line">
            {CHANNELS.map(({ k, label, value, href, Icon, external }) => (
              <li key={k} className="border-b border-line">
                <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group grid min-h-[60px] grid-cols-[1.5rem_6.5rem_1fr] items-center gap-3 py-3 text-[0.95rem]">
                  <Icon className="h-4 w-4 text-brand-strong" strokeWidth={1.6} aria-hidden />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal/60">{label}</span>
                  <span className="truncate font-medium text-ink underline-offset-4 group-hover:underline">{value}</span>
                  {external && <span className="sr-only">(se abre en una pestaña nueva)</span>}
                </a>
              </li>
            ))}
            <li className="grid grid-cols-[1.5rem_6.5rem_1fr] items-start gap-3 border-b border-line py-4 text-[0.95rem]">
              <ADDRESS.Icon className="mt-0.5 h-4 w-4 text-brand-strong" strokeWidth={1.6} aria-hidden />
              <span className="pt-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal/60">Taller</span>
              <address className="not-italic text-ink">{ADDRESS.lines.map((l) => <span key={l} className="block">{l}</span>)}</address>
            </li>
          </ul>
        </motion.div>

        <motion.div {...fade(0.12)} className="min-w-0">
          <div className="rounded-[20px] border border-line bg-white p-6 shadow-[0_1px_0_rgba(26,26,46,.04),0_30px_80px_-40px_rgba(26,26,46,.25)] sm:p-10">
            <ContactForm className="cd-form" button="Enviar solicitud">
              <p className="mb-8 flex items-baseline justify-between gap-4 border-b border-line pb-5">
                <span className="font-head text-xl font-semibold tracking-[-0.02em] text-ink">Solicitud de presupuesto</span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal/50">Sin compromiso</span>
              </p>
            </ContactForm>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
