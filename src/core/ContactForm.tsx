import { useId, useState, type FormEvent, type ReactNode } from "react";
import { contact, cta } from "@/content/site";

/**
 * Formulario de contacto compartido por todas las variantes de «Contacto».
 * Mismo comportamiento que la landing original: valida y muestra el aviso.
 * ENDPOINT: igual que en la landing, el envío real está pendiente de conectar
 * (p. ej. la función `send-contact` de Supabase del repo unicales). Ver README.
 */
export type FieldName = "nombre" | "empresa" | "email" | "telefono" | "servicio" | "mensaje";

export const FIELDS: { name: FieldName; label: string; type: string; required?: boolean; placeholder?: string; full?: boolean }[] = [
  { name: "nombre", label: "Nombre *", type: "text", required: true, placeholder: "Tu nombre" },
  { name: "empresa", label: "Empresa", type: "text", placeholder: "Tu empresa" },
  { name: "email", label: "Email *", type: "email", required: true, placeholder: "tucorreo@empresa.com" },
  { name: "telefono", label: "Teléfono", type: "tel", placeholder: "600 000 000" },
  { name: "servicio", label: "¿Qué necesitas? *", type: "select", required: true, full: true },
  { name: "mensaje", label: "Cuéntanos el proyecto", type: "textarea", placeholder: "Rotular 12 furgonetas, stand de 30 m²...", full: true },
];

export function Field({ f, className = "" }: { f: (typeof FIELDS)[number]; className?: string }) {
  const uid = useId();
  const id = `cf-${f.name}-${uid.replace(/:/g, "")}`;
  return (
    <label className={`cf-field ${f.full ? "is-full" : ""} ${className}`} htmlFor={id}>
      <span className="cf-label">{f.label}</span>
      {f.type === "select" ? (
        <select id={id} name={f.name} required={f.required} defaultValue="">
          <option value="">Selecciona un servicio</option>
          {cta.serviceOptions.map((o) => <option key={o}>{o}</option>)}
        </select>
      ) : f.type === "textarea" ? (
        <textarea id={id} name={f.name} rows={3} placeholder={f.placeholder} />
      ) : (
        <input id={id} name={f.name} type={f.type} required={f.required} placeholder={f.placeholder} autoComplete={f.name === "nombre" ? "name" : f.name === "email" ? "email" : f.name === "telefono" ? "tel" : f.name === "empresa" ? "organization" : undefined} />
      )}
    </label>
  );
}

export function Privacy() {
  return (
    <label className="cf-check">
      <input type="checkbox" name="privacidad" required />
      <span>Acepto la <a href={contact.privacyUrl}>política de privacidad</a>.</span>
    </label>
  );
}

export function useContactSubmit() {
  const [sent, setSent] = useState(false);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const f = e.currentTarget;
    e.preventDefault(); // quitar al conectar el endpoint real
    if (!f.checkValidity()) { f.reportValidity(); return; }
    setSent(true);
  };
  return { sent, onSubmit };
}

/** Formulario completo estándar; cada variante lo envuelve y lo estiliza con `className`. */
export function ContactForm({ className = "", button = "Enviar solicitud", children }: { className?: string; button?: string; children?: ReactNode }) {
  const { sent, onSubmit } = useContactSubmit();
  return (
    <form className={`cf ${className}`} action={cta.formAction} method="post" noValidate onSubmit={onSubmit} aria-label="Solicitud de presupuesto">
      {children}
      <div className="cf-grid">{FIELDS.map((f) => <Field key={f.name} f={f} />)}</div>
      <Privacy />
      <button type="submit" className="u-btn u-btn--primary cf-send"><span className="u-btn__in">{sent ? "Enviado" : button}</span></button>
      <p className="cf-note">{cta.note}</p>
      <p className="cf-ok" role="status" hidden={!sent}>{cta.ok}</p>
    </form>
  );
}
