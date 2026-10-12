import { useState, type FormEvent } from "react";
import { cta, contact } from "@/content/site";
import { FIELDS, Field, Privacy } from "@/core/ContactForm";
import "./contact.css";

/** D — BLANCO EDITORIAL: página en blanco, tipografía grande y campos de línea fina con etiquetas que flotan. */
export default function ContactD() {
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); if (!e.currentTarget.checkValidity()) { e.currentTarget.reportValidity(); return; } setSent(true); };
  return (
    <div className="ctD">
      <div className="u-wrap ctD__grid">
        <div className="ctD__left">
          <p className="u-eyebrow">{cta.eyebrow}</p>
          <h2 className="ctD__t">Trabajemos <em className="u-em">juntos.</em></h2>
          <p className="ctD__lead">{cta.text}</p>
          <dl className="ctD__dl">
            <div><dt>Teléfono</dt><dd><a href={contact.phoneHref}>{contact.phone}</a></dd></div>
            <div><dt>Email</dt><dd><a href={`mailto:${contact.email}`}>{contact.email}</a></dd></div>
            <div><dt>Taller</dt><dd>{contact.addressFull[0]}<br />{contact.addressFull[1]}</dd></div>
          </dl>
        </div>
        <form className="cf ctD__form" action={cta.formAction} method="post" noValidate onSubmit={submit} aria-label="Solicitud de presupuesto">
          <div className="cf-grid">{FIELDS.map((f) => <Field key={f.name} f={f} />)}</div>
          <Privacy />
          <button type="submit" className="ctD__send"><span>{sent ? "Enviado" : "Enviar solicitud"}</span><span aria-hidden>→</span></button>
          <p className="cf-note">{cta.note}</p>
          <p className="cf-ok" role="status" hidden={!sent}>{cta.ok}</p>
        </form>
      </div>
    </div>
  );
}
