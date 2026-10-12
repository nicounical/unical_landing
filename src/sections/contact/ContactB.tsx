import { cta } from "@/content/site";
import { ContactForm } from "@/core/ContactForm";
import { useGsap } from "@/core/useGsap";
import { gsap } from "@/core/scroll";
import { ContactMeta, CtaTitle } from "./shared";
import "./contact.css";

/** B — TARJETA CON RELIEVE 3D: el formulario vive en una tarjeta con capas a distintas profundidades que se inclina con el cursor. */
export default function ContactB() {
  const ref = useGsap<HTMLDivElement>(({ root, full, fine, onCleanup }) => {
    if (!full) return;
    const q = gsap.utils.selector(root);
    const card = q<HTMLElement>(".ctB__card")[0];
    gsap.fromTo(card, { rotateX: 25, y: 120, autoAlpha: 0 }, { rotateX: 0, y: 0, autoAlpha: 1, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 70%" } });
    if (!fine) return;
    const rx = gsap.quickTo(card, "rotateX", { duration: 0.8, ease: "power3" }), ry = gsap.quickTo(card, "rotateY", { duration: 0.8, ease: "power3" });
    const m = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("input, select, textarea")) return;
      const r = root.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * 10); rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
    };
    const l = () => { rx(0); ry(0); };
    root.addEventListener("pointermove", m); root.addEventListener("pointerleave", l);
    onCleanup(() => { root.removeEventListener("pointermove", m); root.removeEventListener("pointerleave", l); });
  });
  return (
    <div ref={ref} className="ctB is-dark">
      <div className="ctB__glow" aria-hidden="true" />
      <div className="u-wrap ctB__in">
        <div className="ctB__card">
          <div className="ctB__layer ctB__layer--img" aria-hidden="true"><img src={cta.revealImg} alt="" loading="lazy" /></div>
          <div className="ctB__layer ctB__copy">
            <p className="u-eyebrow">{cta.eyebrow}</p>
            <CtaTitle className="ctB__t" />
            <p>{cta.text}</p>
            <ContactMeta className="ctB__meta" />
          </div>
          <div className="ctB__layer ctB__form"><ContactForm /></div>
        </div>
      </div>
    </div>
  );
}
