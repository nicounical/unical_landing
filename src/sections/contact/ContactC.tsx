import { cta } from "@/content/site";
import { ContactForm } from "@/core/ContactForm";
import { useGsap } from "@/core/useGsap";
import { gsap } from "@/core/scroll";
import { ContactMeta } from "./shared";
import "./contact.css";

/**
 * C — REVELADO CON CURSOR (idea original de la landing «en-rev» + 21st.dev «Clipped Circle», unlumen, id 31166):
 * «TRABAJEMOS JUNTOS» en hueco gigante; un círculo que sigue al cursor descubre la foto real del proyecto.
 */
export default function ContactC() {
  const ref = useGsap<HTMLDivElement>(({ root, full, fine, onCleanup }) => {
    const q = gsap.utils.selector(root);
    const rev = q<HTMLElement>(".ctC__rev")[0];
    if (!fine || !full) { root.classList.add("is-touch"); return; }
    const st = { x: -500, y: -500, r: 0 };
    const set = () => rev.style.setProperty("clip-path", `circle(${st.r}px at ${st.x}px ${st.y}px)`);
    const m = (e: PointerEvent) => { const b = root.getBoundingClientRect(); gsap.to(st, { x: e.clientX - b.left, y: e.clientY - b.top, duration: 0.5, ease: "power3", onUpdate: set }); };
    const en = () => gsap.to(st, { r: 170, duration: 0.6, ease: "expo.out", onUpdate: set });
    const lv = () => gsap.to(st, { r: 0, duration: 0.4, onUpdate: set });
    const big = q<HTMLElement>(".ctC__big")[0];
    big.addEventListener("pointermove", m); big.addEventListener("pointerenter", en); big.addEventListener("pointerleave", lv);
    onCleanup(() => { big.removeEventListener("pointermove", m); big.removeEventListener("pointerenter", en); big.removeEventListener("pointerleave", lv); });
  });
  return (
    <div ref={ref} className="ctC is-dark">
      <div className="ctC__big">
        <div className="ctC__rev" aria-hidden="true"><img src={cta.revealImg} alt="" loading="lazy" /></div>
        <p className="u-eyebrow u-wrap">{cta.eyebrow}</p>
        <h2 className="ctC__t"><span className="u-hollow">{cta.titleHollow}</span><span>{cta.titleSolid}</span></h2>
      </div>
      <div className="u-wrap ctC__grid">
        <div className="ctC__copy"><p>{cta.text}</p><ContactMeta className="ctC__meta" /></div>
        <ContactForm className="cf--dark" />
      </div>
    </div>
  );
}
