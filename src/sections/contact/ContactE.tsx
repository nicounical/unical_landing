import { useRef, useState, type FormEvent } from "react";
import { cta, contact } from "@/content/site";
import { FIELDS, Field, Privacy } from "@/core/ContactForm";
import { gsap } from "@/core/scroll";
import { fullMotion } from "@/core/env";
import { CtaTitle } from "./shared";
import "./contact.css";

/** E — PASO A PASO: el formulario se divide en tres pasos rápidos (servicio → datos → proyecto) con barra de progreso. */
const STEPS = [
  { t: "¿Qué necesitas?", fields: [] as string[] },
  { t: "¿Quién eres?", fields: ["nombre", "empresa", "email", "telefono"] },
  { t: "Cuéntanos el proyecto", fields: ["mensaje"] },
];

export default function ContactE() {
  const [step, setStep] = useState(0);
  const [service, setService] = useState("");
  const [sent, setSent] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const pane = useRef<HTMLDivElement>(null);

  const animate = (dir: number) => { if (fullMotion() && pane.current) gsap.fromTo(pane.current, { x: dir * 60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.5, ease: "expo.out" }); };
  const next = () => {
    const f = form.current!;
    const inputs = Array.from(f.querySelectorAll<HTMLInputElement>(`[data-step="${step}"] input, [data-step="${step}"] textarea`));
    if (step === 0 && !service) { f.querySelector<HTMLButtonElement>(".ctE__opt")?.focus(); return; }
    for (const i of inputs) if (!i.checkValidity()) { i.reportValidity(); return; }
    setStep((s) => s + 1); requestAnimationFrame(() => animate(1));
  };
  const back = () => { setStep((s) => s - 1); requestAnimationFrame(() => animate(-1)); };
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < STEPS.length - 1) { next(); return; }
    if (!e.currentTarget.checkValidity()) { e.currentTarget.reportValidity(); return; }
    setSent(true);
  };

  return (
    <div className="ctE is-dark">
      <div className="u-wrap ctE__grid">
        <div className="ctE__copy">
          <p className="u-eyebrow">{cta.eyebrow}</p>
          <CtaTitle className="ctE__t" />
          <p>{cta.text}</p>
          <p className="ctE__alt">¿Prefieres hablar? <a href={contact.phoneHref}>{contact.phone}</a> · <a href={`mailto:${contact.email}`}>{contact.email}</a></p>
        </div>
        <form ref={form} className="cf ctE__form" action={cta.formAction} method="post" noValidate onSubmit={submit} aria-label="Solicitud de presupuesto en tres pasos">
          <div className="ctE__progress" aria-hidden="true"><i style={{ transform: `scaleX(${sent ? 1 : (step + 1) / STEPS.length})` }} /></div>
          <p className="ctE__k">Paso {step + 1} de {STEPS.length}</p>
          <div ref={pane} className="ctE__pane" aria-live="polite">
            <h3>{STEPS[step].t}</h3>
            <div data-step="0" hidden={step !== 0} className="ctE__opts" role="radiogroup" aria-label="Servicio">
              {cta.serviceOptions.map((o) => (
                <button type="button" key={o} role="radio" aria-checked={service === o} className={`ctE__opt ${service === o ? "is-on" : ""}`} onClick={() => setService(o)}>{o}</button>
              ))}
              <input type="hidden" name="servicio" value={service} />
            </div>
            <div data-step="1" hidden={step !== 1} className="cf-grid">{FIELDS.filter((f) => STEPS[1].fields.includes(f.name)).map((f) => <Field key={f.name} f={f} />)}</div>
            <div data-step="2" hidden={step !== 2}>
              {FIELDS.filter((f) => f.name === "mensaje").map((f) => <Field key={f.name} f={f} />)}
              <Privacy />
            </div>
          </div>
          <div className="ctE__nav">
            {step > 0 && !sent && <button type="button" className="u-btn u-btn--ghost" onClick={back}><span className="u-btn__in">← Atrás</span></button>}
            <button type="submit" className="u-btn u-btn--light"><span className="u-btn__in">{sent ? "Enviado" : step < STEPS.length - 1 ? "Siguiente →" : "Enviar solicitud"}</span></button>
          </div>
          <p className="cf-note">{cta.note}</p>
          <p className="cf-ok" role="status" hidden={!sent}>{cta.ok}</p>
        </form>
      </div>
    </div>
  );
}
